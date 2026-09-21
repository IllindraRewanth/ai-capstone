# Cursor Rules

## Project Stack
- Node.js
- Express
- Zod
- Git
- Cursor AI

## Coding Conventions
- Follow Conventional Commits.
- Keep functions small and readable.
- Use meaningful variable names.
- Write clear documentation.

## Project rules (testable)

1. **Settings and form payloads** must be validated with **Zod in `src/settingsSchema.js`** (or a feature-local schema module). Client-side checks are supplementary, not sufficient.
2. **Form markup in `public/`** must use `<label for="…">` on every editable control and surface errors with `textContent`; do not use `innerHTML` for validation or status messages.
3. **API or validation changes** require **`test/*.test.js`** (Node test runner + supertest) and a green `npm test` before merge.

## AI workflow
- For non-trivial features: explore the repo, state file paths and constraints, implement, then add/run tests.
- Ask Cursor AI to explain suggested changes before applying them when the diff is large.
