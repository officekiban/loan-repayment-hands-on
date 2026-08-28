# Claude Code project instructions

## Read first

1. `claude-demo/docs/basic-design.md`
2. `claude-demo/docs/test-spec.md`
3. `claude-demo/app/loan-repayment-simulator.html`

## Work rules

- When asked for a review, do not edit files. Report each finding with the document name and item name, not only an internal ID.
- When asked for a specification change, update the basic design, test specification/results sheet, source HTML, and generated HTML in `claude-demo` together.
- Edit `claude-demo/app/loan-repayment-simulator.html`. Generate `claude-demo/app/index.html` with `npm --prefix claude-demo run build`.
- Do not resolve the existing interest-rounding inconsistency unless the prompt explicitly asks for that decision.
- Before completion, run `npm run check` and report the changed files and result.

## Commands

```powershell
npm ci
npm run check
npm --prefix claude-demo run check
```
