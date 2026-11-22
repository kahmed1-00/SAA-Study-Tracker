# Plan: SAA Study Tracker (Artifact 5)

**Goal:** A study app that real students preparing for the AWS SAA-C03 exam can use, deployed on AWS, with AI-generated practice questions and progress that syncs across devices.

**Final due:** Sunday, December 13, 2026. Final show and tell: Monday, December 7.

## Milestones

### Week 1 (Nov 9–15): Prototype ✅
- [x] Pick the moonshot and add the Artifact 5 card to the portfolio
- [x] Prototype inside the portfolio page: readiness sliders, flashcards, notes

### Week 2 (Nov 16–22): Real project, standalone app
- [x] Own repo with README, CLAUDE.md, PLAN.md, LOG.md
- [x] Split into index.html / css / js / data
- [x] Dashboard: weighted readiness, exam countdown, streak, mastered count, recent sessions
- [x] Flashcards with spaced repetition (Leitner boxes)
- [x] Practice quiz weighted toward weak domains, per-domain accuracy
- [x] Notes per domain, export/import progress
- [ ] Deploy to GitHub Pages and link it from the portfolio card

### Week 3 (Nov 23–29): AI question generator on AWS
- [ ] AWS account setup: IAM user with least privilege, billing alert in AWS Budgets
- [ ] Lambda function that asks Claude to write a new multiple-choice question for a chosen domain, returns JSON
- [ ] API Gateway endpoint in front of it, with CORS and a rate limit
- [ ] API key stored in Secrets Manager, never in the frontend
- [ ] "Generate a new question" button in the quiz
- [ ] Grow the starting deck to 60+ cards

### Week 4 (Nov 30–Dec 6): Accounts and cloud sync
- [ ] Cognito sign-in (optional; the app still works signed out)
- [ ] DynamoDB table for progress, synced on save
- [ ] Move hosting to S3 + CloudFront
- [ ] Infrastructure as code (SAM or CDK) in `infra/`
- [ ] Architecture diagram in the README

### Week 5 (Dec 7–13): Real users and ship
- [ ] Show and tell Monday Dec 7
- [ ] Share with classmates and the UX Club, collect feedback
- [ ] Fix the top issues from feedback
- [ ] Final portfolio card: title, live link, repo link, reflection

## Stretch
- Timed full-length practice exam mode
- Charts of quiz accuracy over time
- Explanations for wrong answers generated on demand

## Risks
- AWS costs: keep everything in the free tier, set a $5 budget alert first.
- Claude API key leaking: only ever called from Lambda.
- Scope: weeks 3 and 4 are the big ones. If time runs short, cloud sync is cut before the AI generator.
