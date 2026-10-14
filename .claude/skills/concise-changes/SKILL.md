---
name: concise-changes
description: Keep every code change in this repo minimal and focused. Use whenever editing files, preparing a commit, or reviewing your own diff.
---

# Concise changes

Apply these rules to every edit and commit in this repository.

## Editing
- Make the smallest diff that achieves the goal. No drive-by refactors, renames or reformatting.
- Match the surrounding code: naming, file layout, comment density, CSS-module vs. inline conventions.
- Delete dead code instead of commenting it out. Do not leave TODOs for work you could finish now.
- Comments explain *why*, never restate *what* the code does.
- No new dependency unless it removes real code or risk; say why in the commit body.
- Colours, fonts and spacing come from `src/theme/` tokens, not literals.

## Committing
- One logical change per commit. Split unrelated fixes into their own commits.
- Message: `<type>: <imperative summary>` (`feat`, `fix`, `chore`), under 72 chars; body only if the why isn't obvious.
- Before committing run `git diff --stat` and remove any file that the change does not need.
- Run `bun run lint && bun run typecheck && bun run test` before every commit; `bun run build` before pushing.

## Reporting
- Summarise what changed and how it was verified in a few lines. Name failures plainly.
