# CLAUDE.md

Context for the coding agent working on this repo.

## Project
SAA Study Tracker: a study app for the AWS Solutions Architect – Associate (SAA-C03) exam.
Owner: Khalil Ahmednoor. This is his TCSS 490 Artifact 5 (five-week "moonshot", final due Dec 13, 2026).
The goal is a real app that real students can use, and a portfolio project toward an AWS Solutions Architect career.

## Stack (current)
- Plain HTML, CSS and JavaScript. No framework, no build step.
- Hosted on GitHub Pages from the `main` branch root.
- State lives in one localStorage key, `saa-tracker-v1` (see `js/storage.js`).
- Card deck lives in `data/cards.json`.

## Stack (planned, see PLAN.md)
- AWS Lambda + API Gateway for an AI question generator (calls the Claude API; key stays server-side).
- Amazon Cognito for sign-in, DynamoDB for synced progress.
- Infrastructure as code (AWS SAM or CDK) in an `infra/` folder.

## Rules
- Read `PLAN.md` and the latest entries in `LOG.md` before starting work.
- Add a `LOG.md` entry at the end of every session: date, what was planned, what changed, what is next. Write only what actually happened.
- Keep the app working on GitHub Pages after every change. No build step unless PLAN.md says so.
- Never put API keys or AWS credentials in the frontend or in the repo. Use environment variables / Secrets Manager.
- New fields in the saved state must be added to `defaultState()` so old saves still load.
- Card content must be original and accurate. Do not copy real exam questions or paid practice tests.
- The four domains and their weights are fixed in `DOMAINS` in `js/storage.js`.

## Domains
| id | Name | Weight |
|---|---|---|
| secure | Design Secure Architectures | 30% |
| resilient | Design Resilient Architectures | 26% |
| performance | Design High-Performing Architectures | 24% |
| cost | Design Cost-Optimized Architectures | 20% |
