# Log

Plans and changes, newest first. One entry per work session.

## 2026-11-21: Move from prototype to a real project

**Planned:** Turn the Week 1 prototype (a section inside my portfolio page) into its own repo and app, and set the project up so it can last the rest of the five weeks.

**Changed:**
- Created this repo with README, CLAUDE.md, PLAN.md and this log
- Split the app into `index.html`, `css/style.css`, `js/storage.js`, `js/app.js`, `data/cards.json`
- Dashboard: weighted readiness across the four SAA-C03 domains, exam-date countdown, study streak, cards mastered, recent sessions
- Flashcards now use spaced repetition (Leitner boxes 1–5, due after 0/1/3/7/14 days)
- New practice quiz: 10 multiple-choice questions, weighted toward weaker domains, tracks accuracy per domain and shows it next to the readiness slider
- Notes per domain, export/import of progress as JSON, reset
- Starting deck of 26 cards
- Used Claude to scaffold the repo and write the first version of the app

**Next:** Deploy to GitHub Pages, link it from the Artifact 5 card, then start Week 3 (AI question generator on Lambda). Add more cards.

## Week 1: Prototype

**Changed:** Picked the moonshot and added the Artifact 5 card to my portfolio with a first prototype inside the portfolio page: readiness sliders for the four exam domains, a few flashcards and a notes section.
