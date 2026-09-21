# Claude Instructions

## Tech Stack
- Node.js
- JavaScript
- Express (HTTP + static assets)
- Zod (request validation)

## Coding Conventions
- Follow Conventional Commits.
- Keep functions small and modular.

## Project rules (testable)

1. **Settings and form payloads** must be validated with **Zod in `src/settingsSchema.js`** (or a schema module beside the feature). Do not rely on client-only checks or ad hoc `includes("@")` email tests.
2. **Every user-editable field** in `public/*.html` must have a visible `<label for="…">` tied to an `id`, plus programmatic errors via `textContent` (never `innerHTML` for user-facing validation messages).
3. **New API behavior** ships with **`node --test`** coverage under `test/` using supertest for routes; `npm test` must pass before the change is considered done.

## AI Assistant
Review code before changes and suggest improvements where appropriate. After AI-generated form or API work, run `npm test` and manually check one invalid submit (empty name, bad email).

## Project Standards

- Prefer simple solutions.
- Write reusable code.
