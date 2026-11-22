# SAA Study Tracker

A study app for the **AWS Certified Solutions Architect – Associate (SAA-C03)** exam.
Built by Khalil Ahmednoor as **Artifact 5: The Moonshot** for TCSS 490 (UW Tacoma, Autumn 2026).

**Live site:** https://kahmed1-00.github.io/saa-study-tracker/

## What it does

- **Dashboard:** weighted exam readiness across the four SAA-C03 domains, exam-date countdown, study streak, cards mastered, recent sessions
- **Flashcards:** spaced repetition (Leitner boxes). Cards you miss come back sooner, and cards you know move out to 1, 3, 7 and 14 days
- **Practice quiz:** 10 multiple-choice questions, weighted toward your weakest domains, with per-domain accuracy tracked over time
- **Notes:** study notes for each domain
- **Data:** export and import your progress as a JSON file

All progress is saved in your browser (localStorage). Nothing is sent to a server yet.

## Run it locally

The app loads `data/cards.json` with `fetch`, so it needs a local server rather than opening the file directly:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Project files

| File | What it is |
|---|---|
| `index.html` | The page and all five views |
| `css/style.css` | Styles |
| `js/storage.js` | Domains, default state, load/save to localStorage |
| `js/app.js` | Dashboard, flashcards, quiz, notes, export/import |
| `data/cards.json` | The starting card deck (26 cards across 4 domains) |
| `PLAN.md` | The five-week plan, broken into pieces |
| `LOG.md` | Log of plans and changes, session by session |
| `CLAUDE.md` | What the coding agent needs to know about this project |

## Roadmap

See [PLAN.md](PLAN.md). Next up: an AI question generator on AWS Lambda, then accounts and cloud sync with Cognito and DynamoDB.

## Disclaimer

Not affiliated with or endorsed by Amazon Web Services. Card content is written for study practice and is not official exam material.
