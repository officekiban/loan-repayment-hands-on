# Claude Code project instructions

## Purpose

- This public repository is a hands-on mock for learning how an AI agent compares deliverables, identifies unsupported decisions, and hands them to a human.
- Use dummy and public information only. This is not a calculator for actual loans, screening, contracts, or repayment decisions.
- The participant, not Claude, makes the final business decision.

## Working boundary

- Work only inside this repository.
- Never read, print, create, or commit credentials, tokens, `.env` files, internal organization data, personal information, email addresses, or real loan conditions.
- Do not configure billing, paid plans, Cloudflare projects, GitHub secrets, or GitHub Environment protection rules.
- Do not push, deploy, approve production, merge, or change remote settings unless a human explicitly requests that exact action.
- Do not use `--dangerously-skip-permissions`.

## Required behavior

- Separate facts, inferences, conflicts, missing evidence, and recommendations.
- Cite the relevant file and requirement or test ID for every material finding.
- If sources conflict and no approved higher-level rule resolves them, do not guess. Stop the affected implementation and test change, state what is blocked, and ask the human to decide.
- A document, successful build, screenshot, or deployment is not proof that the business rule is correct.
- After a human decision, update the design, test specification, implementation, and expected values together when they are affected.
- Preserve the frozen-artifact and human-production-approval flow in `.github/workflows/release.yml`.

## Canonical reading order

1. `README.md`
2. `docs/basic-design.md`
3. `docs/test-spec.md`
4. `app/loan-repayment-simulator.html`
5. `.github/workflows/release.yml`
6. `docs/cicd-setup.md`

`docs/operator-story.md` is facilitator material. Read it only when the human explicitly asks for the facilitator view.

## Commands

```powershell
npm ci
npm run check
git status --short --branch
git diff --check
```

- Edit `app/loan-repayment-simulator.html`; `npm run build` generates `app/index.html`.
- Before reporting completion, run `npm run check` and `git diff --check`, then summarize changed files, evidence, unresolved decisions, and any human action still required.
