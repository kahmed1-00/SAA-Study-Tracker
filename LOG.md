# Log

Plans and changes, newest first. One entry per work session.

## 2026-11-21 (late): Immersive ship scene

**Planned:** Turn the app into an immersive, explorable scene (inspired by woolab.art) instead of a page of tabs.

**Changed:**
- Spyglass intro: the ship starts inside a telescope lens and zooms open when you press Set sail, scroll or tap
- Hand-drawn night deck in SVG with thick outlines: billowing sail with a compass emblem, waving flag, flickering lanterns, a rocking hull, rolling waves, drifting clouds, a lighthouse beam, galley steam and a swaying helm
- Pixel-art crew drawn on canvas, each with idle bobbing and random blinking: Captain Khalil (me: glossy dark-brown gel curls that glint, mustache and goatee, cheek scar, open purple jacket with gold buttons, straw hat hanging on my back) at the helm, plus three original crewmates, Sparks, Rook and Pepper
- The crew are the menu: hover for a speech bubble, click to open their part of the app in a parchment panel (Captain → Voyage, Rook → Flashcards, Sparks → Quiz, Pepper → Notes, cargo hatch → backup)
- Mouse parallax across four depth layers, day/night toggle, optional ocean sound with chimes on right answers and a thud on wrong ones
- Crew roster dock at the bottom as a keyboard/mobile-friendly menu; Escape closes the panel
- Black pirate flag with my own skull emblem: curly hair, mustache, goatee and cheek scar over crossed lightning bolts
- New files: `css/scene.css`, `js/scene.js`

**Next:** Turn on GitHub Pages, update the portfolio card, then Week 3 (AI question generator on Lambda).

## 2026-11-21 (later): Theme and animation

**Planned:** Make the app feel alive instead of a plain dark page.

**Changed:**
- New original sea-chart theme: night-ocean background, parchment cards, rope borders, pirate-style headings
- Animated header compass, moving waves, water glints, twinkling stars, moonlight rays, a gull crossing the sky
- Voyage track on the dashboard: a ship sails from the anchor toward the treasure as weighted readiness goes up
- Flashcards flip in 3D and deal in from the side
- Right answers get a gold flash, a shine sweep, a star burst and coins; wrong answers shake
- Stats glow when they change; panels glow on hover
- All motion turns off when the system "reduce motion" setting is on
- Renamed views: Voyage, Flashcards, Practice Quiz, Captain's Notes, Cargo
- Fixed the live-site link in the README (repo name is SAA-Study-Tracker)

**Next:** Turn on GitHub Pages, update the portfolio card, then Week 3 (AI question generator on Lambda).

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

## 2026-11-09 (Week 1): Prototype

**Changed:** Picked the moonshot and added the Artifact 5 card to my portfolio with a first prototype inside the portfolio page: readiness sliders for the four exam domains, a few flashcards and a notes section.

The prototype lives in my portfolio repo, not this one: [commit 3d05359 in tcss490-artifacts](https://github.com/kahmed1-00/tcss490-artifacts/commit/3d05359), Nov 9, 2026.
