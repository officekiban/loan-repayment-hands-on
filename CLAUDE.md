# Claude Code project instructions

## Read first

1. `docs/basic-design.md`
2. `docs/test-spec.md`
3. `app/loan-repayment-simulator.html`

## Work rules

- When asked for a review, do not edit files. Report each finding with the file name and requirement or test ID.
- When asked for a specification change, update the basic design, test specification/results sheet, source HTML, and generated HTML together.
- Edit `app/loan-repayment-simulator.html`. Generate `app/index.html` with `npm run build`.
- Do not resolve the existing interest-rounding inconsistency unless the prompt explicitly asks for that decision.
- Before completion, run `npm run check` and report the changed files and result.

## Commands

```powershell
npm ci
npm run check
```
