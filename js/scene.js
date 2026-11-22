// Immersive ship scene: spyglass intro, pixel crew, hotspots that open the app views, day/night and sound.
(function () {
  const $ = (id) => document.getElementById(id);

  // ---------- Pixel sprites ----------
  // Each sprite is a grid of characters; each character maps to a colour in its palette. "." is empty.
  const SPRITES = {
    // Captain Khalil: straw hat with a UW-purple band, big curly afro, light brown skin, mustache and goatee, cheek scar, purple & gold hoodie
    captain: {
      glint: true,
      pal: { Y: "#e9c46a", y: "#c99a3b", P: "#5b2a86", r: "#5a3a24", H: "#2a170b", h: "#5c3a22", L: "#a8774c", Q: "#fbeedd", S: "#8a5a3b", s: "#6e4429", E: "#1b120c", W: "#ffffff", M: "#4a1c10", F: "#1f130b", X: "#b88464", U: "#4b2e83", u: "#3a2266", T: "#f4f1e8", G: "#e8c45c", K: "#22222b", B: "#4a2c17" },
      rows: [
        "....H..HQHH..H....",
        ".....QHhHHhQH.....",
        "....HhHQhhQhhH....",
        "..HHQHHSShSHHhHH..",
        "...hHSSSSSSSShQ...",
        "...HhShhSShhSHh...",
        "..HQHSWESSEWSLHH..",
        "....HSSEsSESXh....",
        ".....SFFFFFFS.....",
        "...h.SMWWWWMS.H...",
        "...yhYSsFFsSYyL...",
        "..yLPYYSFFSYYPYy..",
        ".yYPYYrssssrYYPYy.",
        "yyUUUUGTTTTuUUUUyy",
        "yyUUUUUTTTTuUUUUyy",
        "yySUUUGTTTTuUUUSyy",
        ".ySUUUUTTTTuUUUSy.",
        "..SUUUGTTTTuUUUS..",
        "...uuuuuuuuuuuu...",
        "....KKKKKKKKKK....",
        "....KKKK..KKKK....",
        ".....sss..sss.....",
        ".....sss..sss.....",
        "....BBBB..BBBB...."
      ]
    },
    // Rook the quartermaster: green bandana, red beard, striped shirt
    rook: {
      pal: { G: "#2f8f5b", g: "#1f6440", H: "#b5532a", S: "#e0ac7e", E: "#1b120c", W: "#ffffff", R: "#b5532a", T: "#f4f1e8", N: "#24476b", K: "#3a2a1a", B: "#2a1a10", M: "#7a2c1a" },
      rows: [
        "....gGGGGGGGg.....",
        "...GGGGGGGGGGGgg..",
        "...GGGGGGGGGGG.gg.",
        "...SSSSSSSSSSS....",
        "...SSEWSSSEWSS....",
        "...SSEESSSEESS....",
        "...SSSSSSSSSSS....",
        "...RRSSSSSSSRR....",
        "...RRRMMMMMRRR....",
        "....RRRRRRRRR.....",
        ".....RRRRRRR......",
        "...TTNNTTNNTTN....",
        "..TNNTTNNTTNNTT...",
        ".STTNNTTNNTTNNTS..",
        ".SNNTTNNTTNNTTNS..",
        "..TTNNTTNNTTNNT...",
        "...KKKKK.KKKKK....",
        "...KKKKK.KKKKK....",
        "..BBBBBB.BBBBBB..."
      ]
    },
    // Sparks the gunner: brass goggles, short black hair, orange scarf
    sparks: {
      pal: { H: "#121212", O: "#e0a526", o: "#9a6a12", L: "#7fd3f0", S: "#c68a5e", E: "#1b120c", M: "#5a2a14", F: "#e36b2c", f: "#b14a17", J: "#3c4a5c", K: "#2a2a35", B: "#1b120c" },
      rows: [
        ".....HHHHHHHH.....",
        "....HHHHHHHHHH....",
        "...HHHHHHHHHHHH...",
        "...oOOOOooOOOOo...",
        "...OLLLOooOLLLO...",
        "...oOOOOSSOOOOo...",
        "...SSSSSSSSSSSS...",
        "...SSEESSSSEESS...",
        "...SSSSSSSSSSSS...",
        "....SSMMMMMMSS....",
        ".....SSSSSSSS.....",
        "...FFFFFFFFFFFF...",
        "..fFFFFFFFFFFFFf..",
        "..JJJJJJJJJJJJJJ..",
        ".SJJJJJJOJJJJJJJS.",
        ".SJJJJJJJJJJJJJJS.",
        "..JJJJJJJJJJJJJJ..",
        "...KKKKKK.KKKKKK..",
        "...KKKKKK.KKKKKK..",
        "..BBBBBBB.BBBBBBB."
      ]
    },
    // Pepper the cook: tall white chef hat, braids, apron
    pepper: {
      pal: { W: "#fbfbf6", w: "#d9d9cf", H: "#3b2210", S: "#a8704a", E: "#1b120c", M: "#7a2c1a", C: "#c0392b", A: "#f4f1e8", a: "#cfcabb", K: "#5a3d8a", B: "#2a1a10", R: "#e0a526" },
      rows: [
        "....wWWWWWWWw.....",
        "...WWWWWWWWWWW....",
        "...WWWWWWWWWWW....",
        "....WWWWWWWWW.....",
        "....wwwwwwwww.....",
        "..HHSSSSSSSSSHH...",
        "..HSSEESSSEESSH...",
        "..HSSSSSSSSSSSH...",
        "..HSRSSSSSSSRSH...",
        "..H.SSMMMMMSS.H...",
        "..H..SSSSSSS..H...",
        "..H.CCCCCCCCC.H...",
        "...CCAAAAAAACC....",
        "..SCCAAAAAAACCS...",
        "..SCCAAaaaAACCS...",
        "...CCAAAAAAACC....",
        "....KKKK.KKKK.....",
        "....KKKK.KKKK.....",
        "...BBBBB.BBBBB...."
      ]
    }
  };

  // Draws the sprite with a 1px dark outline baked in (no CSS filters needed, so it stays smooth).
  function drawSprite(canvas, sprite, blink, phase) {
    phase = phase || 0;
    const ctx = canvas.getContext("2d");
    const rows = sprite.rows;
    const w = rows[0].length, h = rows.length;
    if (canvas.width !== w + 2) { canvas.width = w + 2; canvas.height = h + 2; }
    ctx.clearRect(0, 0, w + 2, h + 2);
    const filled = (x, y) => y >= 0 && y < h && x >= 0 && x < w && rows[y][x] !== ".";
    ctx.fillStyle = "#1b120c";
    for (let y = -1; y <= h; y++) {
      for (let x = -1; x <= w; x++) {
        if (filled(x, y)) continue;
        if (filled(x - 1, y) || filled(x + 1, y) || filled(x, y - 1) || filled(x, y + 1)) ctx.fillRect(x + 1, y + 1, 1, 1);
      }
    }
    rows.forEach((row, y) => {
      [...row].forEach((ch, x) => {
        if (ch === ".") return;
        let col = sprite.pal[ch];
        // blinking: the top eye row closes to skin, the bottom row becomes a lash line
        if (blink && (ch === "E" || (ch === "W" && rows[y].includes("E")))) {
          const below = rows[y + 1] && rows[y + 1][x] === "E";
          col = below ? sprite.pal.S : "#1b120c";
        }
        // wet-look glints shimmer across the curls
        if (sprite.glint && ch === "Q" && (x + y + phase) % 3 !== 0) col = sprite.pal.L;
        if (!col) return;
        ctx.fillStyle = col;
        ctx.fillRect(x + 1, y + 1, 1, 1);
      });
    });
  }

  document.querySelectorAll("canvas.sprite").forEach((c) => {
    const sp = SPRITES[c.dataset.sprite];
    let phase = 0, blinking = false;
    const draw = () => drawSprite(c, sp, blinking, phase);
    draw();
    // random blinking so the crew feels alive
    (function loop() {
      setTimeout(() => {
        blinking = true; draw();
        setTimeout(() => { blinking = false; draw(); loop(); }, 140);
      }, 1800 + Math.random() * 3500);
    })();
    // glistening curls
    if (sp.glint) setInterval(() => { phase = (phase + 1) % 3; draw(); }, 420);
  });

  // ---------- Intro: spyglass zoom ----------
  const intro = $("intro");
  let entered = false;
  function enter() {
    if (entered) return;
    entered = true;
    document.body.classList.add("aboard");
    sound.chime(660, 0.25);
    setTimeout(() => intro.remove(), 1700);
  }
  $("setSail").addEventListener("click", enter);
  intro.addEventListener("wheel", enter, { passive: true });
  intro.addEventListener("touchmove", enter, { passive: true });
  window.addEventListener("keydown", (e) => { if (!entered && (e.key === "Enter" || e.key === " " || e.key === "ArrowDown")) enter(); });

  // ---------- Hotspots open the views in a parchment panel ----------
  const panel = $("panel");
  function openView(view, title) {
    const btn = document.querySelector(`nav button[data-view="${view}"]`);
    if (btn) btn.click();
    $("panelTitle").textContent = title;
    panel.classList.add("open");
    document.body.classList.add("panel-open");
    sound.chime(520, 0.12);
  }
  function closePanel() {
    panel.classList.remove("open");
    document.body.classList.remove("panel-open");
  }
  document.querySelectorAll("[data-open]").forEach((el) => {
    el.addEventListener("click", () => openView(el.dataset.open, el.dataset.title));
    el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openView(el.dataset.open, el.dataset.title); } });
  });
  $("panelClose").addEventListener("click", closePanel);
  $("panelBackdrop").addEventListener("click", closePanel);
  window.addEventListener("keydown", (e) => { if (e.key === "Escape") closePanel(); });

  // ---------- Day / night ----------
  $("dayNight").addEventListener("click", () => {
    document.body.classList.toggle("day");
    $("dayNight").textContent = document.body.classList.contains("day") ? "☾" : "☀";
    $("dayNight").setAttribute("aria-label", document.body.classList.contains("day") ? "Switch to night" : "Switch to day");
  });

  // ---------- Sound (off by default): ocean hush + chimes ----------
  const sound = {
    ctx: null, on: false, sea: null,
    start() {
      this.ctx = this.ctx || new (window.AudioContext || window.webkitAudioContext)();
      const ctx = this.ctx;
      const len = ctx.sampleRate * 2;
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource();
      src.buffer = buf; src.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass"; filter.frequency.value = 500;
      const gain = ctx.createGain(); gain.gain.value = 0.05;
      const lfo = ctx.createOscillator(); lfo.frequency.value = 0.12;
      const lfoGain = ctx.createGain(); lfoGain.gain.value = 0.04;
      lfo.connect(lfoGain).connect(gain.gain);
      src.connect(filter).connect(gain).connect(ctx.destination);
      src.start(); lfo.start();
      this.sea = { src, lfo };
    },
    stop() {
      if (this.sea) { this.sea.src.stop(); this.sea.lfo.stop(); this.sea = null; }
    },
    chime(freq, len) {
      if (!this.on || !this.ctx) return;
      const ctx = this.ctx;
      [1, 1.5, 2].forEach((m, i) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = "sine"; o.frequency.value = freq * m;
        g.gain.setValueAtTime(0.0001, ctx.currentTime + i * 0.06);
        g.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + i * 0.06 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.06 + len + 0.3);
        o.connect(g).connect(ctx.destination);
        o.start(ctx.currentTime + i * 0.06); o.stop(ctx.currentTime + i * 0.06 + len + 0.4);
      });
    },
    thud() {
      if (!this.on || !this.ctx) return;
      const ctx = this.ctx, o = ctx.createOscillator(), g = ctx.createGain();
      o.type = "triangle"; o.frequency.setValueAtTime(140, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.3);
      g.gain.setValueAtTime(0.2, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
      o.connect(g).connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.4);
    }
  };
  window.shipSound = sound;
  $("soundBtn").addEventListener("click", () => {
    sound.on = !sound.on;
    if (sound.on) { sound.start(); sound.chime(784, 0.2); } else sound.stop();
    $("soundBtn").textContent = sound.on ? "🔊" : "🔈";
    $("soundBtn").setAttribute("aria-label", sound.on ? "Sound off" : "Sound on");
  });

  // ---------- Gentle parallax: layers ease toward the mouse in one animation loop ----------
  const layers = [...document.querySelectorAll(".plx")].map((el) => ({ el, depth: Number(el.dataset.depth) || 0 }));
  let tx = 0, ty = 0, cx = 0, cy = 0, running = false;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function tick() {
    cx += (tx - cx) * 0.08;
    cy += (ty - cy) * 0.08;
    layers.forEach(({ el, depth }) => {
      el.style.transform = `translate3d(${(-cx * depth).toFixed(2)}px, ${(-cy * depth * 0.35).toFixed(2)}px, 0)`;
    });
    if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) requestAnimationFrame(tick);
    else running = false;
  }
  if (!reduce) {
    window.addEventListener("mousemove", (e) => {
      if (document.body.classList.contains("panel-open")) return;
      tx = e.clientX / window.innerWidth - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
      if (!running) { running = true; requestAnimationFrame(tick); }
    }, { passive: true });
  }
})();
