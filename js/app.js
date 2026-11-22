// SAA Study Tracker - main app logic
let state = loadState();
let baseCards = [];
const DAY = 24 * 60 * 60 * 1000;
// Leitner box -> days until the card is due again
const BOX_DAYS = { 1: 0, 2: 1, 3: 3, 4: 7, 5: 14 };

const $ = (id) => document.getElementById(id);
const domainName = (id) => (DOMAINS.find((d) => d.id === id) || {}).name || id;
const allCards = () => baseCards.concat(state.customCards);
// local date as YYYY-MM-DD (not UTC, so late-night study counts for the right day)
const localDay = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const today = () => localDay(new Date());

function markStudied(what) {
  const d = today();
  if (!state.studyDays.includes(d)) state.studyDays.push(d);
  state.sessions.unshift({ when: new Date().toLocaleString(), what });
  state.sessions = state.sessions.slice(0, 8);
  saveState(state);
}

// ---------- Navigation ----------
document.querySelectorAll("nav button").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("nav button").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
    btn.classList.add("active");
    $("view-" + btn.dataset.view).classList.add("active");
    if (btn.dataset.view === "dashboard") renderDashboard();
    if (btn.dataset.view === "flashcards") nextCard();
  });
});

function fillDomainSelect(sel, includeAll) {
  sel.innerHTML = (includeAll ? '<option value="all">All domains</option>' : "") +
    DOMAINS.map((d) => `<option value="${d.id}">${d.name}</option>`).join("");
}

// ---------- Dashboard ----------
function quizAccuracy(id) {
  const q = state.quiz[id];
  return q.total ? Math.round((q.right / q.total) * 100) : null;
}

function streak() {
  let count = 0;
  const d = new Date();
  // streak still counts if you haven't studied yet today
  if (!state.studyDays.includes(localDay(d))) d.setDate(d.getDate() - 1);
  while (state.studyDays.includes(localDay(d))) {
    count++;
    d.setDate(d.getDate() - 1);
  }
  return count;
}

function renderDashboard() {
  $("domains").innerHTML = DOMAINS.map((d) => {
    const acc = quizAccuracy(d.id);
    return `<div class="domain">
      <div><strong>${d.name}</strong><div class="hint">${Math.round(d.weight * 100)}% of exam</div></div>
      <input type="range" min="0" max="100" step="5" value="${state.readiness[d.id]}" data-domain="${d.id}">
      <div class="acc"><span id="val-${d.id}">${state.readiness[d.id]}%</span> feel<br>${acc === null ? "no quiz yet" : acc + "% quiz"}</div>
    </div>`;
  }).join("");
  $("domains").querySelectorAll("input").forEach((inp) => {
    inp.addEventListener("input", () => {
      state.readiness[inp.dataset.domain] = Number(inp.value);
      $("val-" + inp.dataset.domain).textContent = inp.value + "%";
      saveState(state);
      updateStats();
    });
  });
  $("examDate").value = state.examDate;
  $("sessions").innerHTML = state.sessions.length
    ? state.sessions.map((s) => `<li>${s.when}: ${s.what}</li>`).join("")
    : "<li>No sessions yet. Do some flashcards or a quiz.</li>";
  updateStats();
}

function setStat(id, text) {
  const el = $(id);
  if (el.textContent !== String(text)) {
    el.textContent = text;
    el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop");
  }
}

function updateStats() {
  const weighted = DOMAINS.reduce((sum, d) => sum + state.readiness[d.id] * d.weight, 0);
  setStat("readiness", Math.round(weighted) + "%");
  $("ship").style.left = "calc(" + Math.round(weighted) + "% - " + Math.round(weighted * 0.54) + "px)";
  $("streak").textContent = streak() + (streak() === 1 ? " day" : " days");
  setStat("mastered", Object.values(state.progress).filter((p) => p.box >= 4).length + " / " + allCards().length);
  if (state.examDate) {
    const days = Math.ceil((new Date(state.examDate + "T00:00") - new Date()) / DAY);
    $("countdown").textContent = days >= 0 ? days : "passed";
  } else {
    $("countdown").textContent = "–";
  }
}

$("examDate").addEventListener("change", (e) => {
  state.examDate = e.target.value;
  saveState(state);
  updateStats();
});

// ---------- Flashcards (Leitner spaced repetition) ----------
let currentCard = null;

function dueCards() {
  const dom = $("fcDomain").value;
  const now = Date.now();
  return allCards().filter((c) => (dom === "all" || c.domain === dom) &&
    (!state.progress[c.id] || state.progress[c.id].due <= now));
}

function nextCard() {
  const due = dueCards();
  $("fcDue").textContent = due.length + " card" + (due.length === 1 ? "" : "s") + " due";
  $("fcFlip").classList.remove("flipped");
  $("fcFlip").classList.remove("deal"); void $("fcFlip").offsetWidth; $("fcFlip").classList.add("deal");
  $("fcAgain").classList.add("hidden");
  $("fcGood").classList.add("hidden");
  if (!due.length) {
    currentCard = null;
    $("fcTag").textContent = "Done";
    $("fcQ").textContent = "No cards due right now. Come back later or pick another domain.";
    $("fcShow").classList.add("hidden");
    return;
  }
  // lowest box first so missed cards come back sooner
  due.sort((a, b) => ((state.progress[a.id] || { box: 0 }).box - (state.progress[b.id] || { box: 0 }).box) || Math.random() - 0.5);
  currentCard = due[0];
  $("fcTag").textContent = domainName(currentCard.domain);
  $("fcQ").textContent = currentCard.q;
  setTimeout(() => { if (currentCard) $("fcA").textContent = currentCard.a; }, 350);
  $("fcShow").classList.remove("hidden");
}

function grade(correct) {
  const p = state.progress[currentCard.id] || { box: 1 };
  p.box = correct ? Math.min(5, p.box + 1) : 1;
  p.due = Date.now() + BOX_DAYS[p.box] * DAY;
  state.progress[currentCard.id] = p;
  markStudied("Flashcard: " + (correct ? "got" : "missed") + " a " + domainName(currentCard.domain) + " card");
  nextCard();
}

$("fcShow").addEventListener("click", () => {
  $("fcFlip").classList.add("flipped");
  $("fcShow").classList.add("hidden");
  $("fcAgain").classList.remove("hidden");
  $("fcGood").classList.remove("hidden");
});
$("fcAgain").addEventListener("click", () => grade(false));
$("fcGood").addEventListener("click", () => {
  $("fcFlip").classList.add("win");
  celebrate($("fcFlip"));
  setTimeout(() => { $("fcFlip").classList.remove("win"); grade(true); }, 650);
});
$("fcDomain").addEventListener("change", nextCard);

$("addCard").addEventListener("click", () => {
  const q = $("newQ").value.trim();
  const a = $("newA").value.trim();
  if (!q || !a) return;
  state.customCards.push({ id: "u" + Date.now(), domain: $("newDomain").value, q, a });
  saveState(state);
  $("newQ").value = "";
  $("newA").value = "";
  nextCard();
});

// ---------- Practice quiz ----------
let quiz = [];
let qi = 0;
let score = 0;

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuiz() {
  // weight each domain by exam weight and by how weak it is (low accuracy = more questions)
  const cards = allCards();
  const weightOf = (c) => {
    const d = DOMAINS.find((x) => x.id === c.domain);
    const acc = quizAccuracy(c.domain);
    return d.weight * (acc === null ? 1 : 1.5 - acc / 100);
  };
  const pool = shuffle(cards).sort((a, b) => weightOf(b) * Math.random() - weightOf(a) * Math.random());
  return pool.slice(0, Math.min(10, pool.length)).map((card) => {
    // wrong choices are answers from other cards, preferring the same domain so they are plausible
    const others = shuffle(cards.filter((c) => c.id !== card.id))
      .sort((a, b) => (b.domain === card.domain) - (a.domain === card.domain))
      .slice(0, 3)
      .map((c) => c.a);
    return { card, choices: shuffle([card.a].concat(others)) };
  });
}

function showQuestion() {
  const item = quiz[qi];
  $("quizProgress").textContent = `Question ${qi + 1} of ${quiz.length}`;
  $("quizTag").textContent = domainName(item.card.domain);
  $("quizQ").textContent = item.card.q;
  $("quizFeedback").textContent = "";
  $("quizNext").classList.add("hidden");
  $("quizChoices").innerHTML = "";
  item.choices.forEach((choice) => {
    const b = document.createElement("button");
    b.textContent = choice;
    b.addEventListener("click", () => answer(b, choice === item.card.a));
    $("quizChoices").appendChild(b);
  });
}

function coinBurst(el) {
  const r = el.getBoundingClientRect();
  for (let i = 0; i < 7; i++) {
    const c = document.createElement("span");
    c.className = "coin";
    c.textContent = "🪙";
    c.style.left = r.left + r.width / 2 + "px";
    c.style.top = r.top + "px";
    c.style.setProperty("--dx", (Math.random() * 160 - 80) + "px");
    c.style.animationDelay = i * 0.05 + "s";
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 1400);
  }
}

// gold celebration: screen flash, shine sweep, star burst, coins
function celebrate(el) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const r = el.getBoundingClientRect();
  const x = r.left + r.width / 2, y = r.top + r.height / 2;
  const f = document.createElement("div");
  f.className = "flash";
  f.style.setProperty("--x", x + "px");
  f.style.setProperty("--y", y + "px");
  document.body.appendChild(f);
  setTimeout(() => f.remove(), 800);
  el.classList.remove("shine"); void el.offsetWidth; el.classList.add("shine");
  for (let i = 0; i < 16; i++) {
    const s = document.createElement("span");
    s.className = "star";
    const ang = (Math.PI * 2 * i) / 16, dist = 60 + Math.random() * 70;
    s.style.left = x + "px";
    s.style.top = y + "px";
    s.style.setProperty("--dx", Math.cos(ang) * dist + "px");
    s.style.setProperty("--dy", Math.sin(ang) * dist + "px");
    s.style.animationDelay = Math.random() * 0.12 + "s";
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 1200);
  }
  coinBurst(el);
  if (window.shipSound) window.shipSound.chime(880, 0.3);
}

function answer(btn, correct) {
  const item = quiz[qi];
  $("quizChoices").querySelectorAll("button").forEach((b) => {
    b.disabled = true;
    if (b.textContent === item.card.a) b.classList.add("right");
  });
  if (!correct) { btn.classList.add("wrong"); if (window.shipSound) window.shipSound.thud(); }
  const stats = state.quiz[item.card.domain];
  stats.total++;
  if (correct) { stats.right++; score++; celebrate(btn); }
  saveState(state);
  $("quizFeedback").textContent = correct ? "Correct." : "Not quite. The right answer is highlighted.";
  $("quizNext").classList.remove("hidden");
}

$("startQuiz").addEventListener("click", startQuiz);
$("quizAgain").addEventListener("click", startQuiz);

function startQuiz() {
  quiz = buildQuiz();
  qi = 0;
  score = 0;
  $("quizStart").classList.add("hidden");
  $("quizDone").classList.add("hidden");
  $("quizBody").classList.remove("hidden");
  showQuestion();
}

$("quizNext").addEventListener("click", () => {
  qi++;
  if (qi < quiz.length) return showQuestion();
  $("quizBody").classList.add("hidden");
  $("quizDone").classList.remove("hidden");
  $("quizScore").textContent = `You scored ${score} / ${quiz.length}`;
  $("quizScore").textContent += score >= 8 ? " · Treasure found!" : score >= 5 ? " · Steady sailing" : " · Rough seas, keep going";
  markStudied(`Practice quiz: ${score}/${quiz.length}`);
});

// ---------- Notes ----------
$("noteDomain").addEventListener("change", () => { $("noteText").value = state.notes[$("noteDomain").value]; });
$("noteText").addEventListener("input", () => {
  state.notes[$("noteDomain").value] = $("noteText").value;
  saveState(state);
});

// ---------- Export / import / reset ----------
$("exportBtn").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "saa-tracker-backup-" + today() + ".json";
  a.click();
});

$("importFile").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      state = Object.assign(defaultState(), JSON.parse(reader.result));
      saveState(state);
      init();
    } catch (err) {
      $("importFile").value = "";
    }
  };
  reader.readAsText(file);
});

$("resetBtn").addEventListener("click", () => {
  if ($("resetBtn").dataset.armed) {
    state = defaultState();
    saveState(state);
    delete $("resetBtn").dataset.armed;
    $("resetBtn").textContent = "Reset everything";
    init();
  } else {
    $("resetBtn").dataset.armed = "1";
    $("resetBtn").textContent = "Click again to confirm";
  }
});

// ---------- Night sky ----------
(function makeSky() {
  const sky = $("sky");
  for (let i = 0; i < 45; i++) {
    const st = document.createElement("i");
    st.style.left = Math.random() * 100 + "%";
    st.style.top = Math.random() * 70 + "%";
    st.style.setProperty("--t", 2 + Math.random() * 4 + "s");
    st.style.setProperty("--d", Math.random() * 4 + "s");
    if (Math.random() < 0.15) { st.style.width = "3px"; st.style.height = "3px"; }
    sky.appendChild(st);
  }
})();

// ---------- Start ----------
function init() {
  fillDomainSelect($("fcDomain"), true);
  fillDomainSelect($("newDomain"), false);
  fillDomainSelect($("noteDomain"), false);
  $("noteText").value = state.notes[$("noteDomain").value];
  renderDashboard();
  nextCard();
}

fetch("data/cards.json")
  .then((r) => r.json())
  .then((cards) => { baseCards = cards; init(); })
  .catch(() => { baseCards = []; init(); });
