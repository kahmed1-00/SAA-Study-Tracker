// Storage layer: everything lives in one localStorage key so it can be exported/imported as a file.
const STORE_KEY = "saa-tracker-v1";

const DOMAINS = [
  { id: "secure", name: "Design Secure Architectures", weight: 0.30 },
  { id: "resilient", name: "Design Resilient Architectures", weight: 0.26 },
  { id: "performance", name: "Design High-Performing Architectures", weight: 0.24 },
  { id: "cost", name: "Design Cost-Optimized Architectures", weight: 0.20 }
];

function defaultState() {
  return {
    readiness: { secure: 0, resilient: 0, performance: 0, cost: 0 },
    examDate: "",
    notes: { secure: "", resilient: "", performance: "", cost: "" },
    customCards: [],
    // Leitner boxes: cardId -> { box: 1-5, due: timestamp }
    progress: {},
    // quiz stats per domain
    quiz: { secure: { right: 0, total: 0 }, resilient: { right: 0, total: 0 }, performance: { right: 0, total: 0 }, cost: { right: 0, total: 0 } },
    // list of ISO dates (YYYY-MM-DD) with study activity
    studyDays: [],
    sessions: []
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return defaultState();
    // merge so new fields added later still exist for old saves
    return Object.assign(defaultState(), JSON.parse(raw));
  } catch (e) {
    return defaultState();
  }
}

function saveState(state) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* storage full or blocked */ }
}
