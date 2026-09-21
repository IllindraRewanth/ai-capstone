# Vague vs. spec-driven AI workflow

This drill compared two ways of building the same capstone feature—a **settings form with validation**—on independent branches: `workflow/round-one-vague` and `workflow/round-two-spec`.

## Prompts

**Round one (intentionally lazy):** “Add a settings page where users can change their name and email.”

**Round two:** Build `public/settings.html`, `public/settings.js`, and `server.js` under this Node + Express repo. Use **Zod** in `src/settingsSchema.js` for server-side validation (trim strings, required display name max 80, valid email, boolean notifications). POST `/api/settings` must return **400** with `fieldErrors` on failure and must not overwrite stored settings. UI: explicit `<label for>` on every control, `aria-invalid` + `role="alert"` for errors, `role="status"` for success. After implementation, add **`test/settings.test.js`** (Node test runner + supertest) and run `npm test` until green.

Round two took longer in the editor but less rework: round one was ~45 minutes of “looks fine” followed by manual QA that found server trust bugs; round two was ~70 minutes upfront including tests, with almost no fix loop afterward.

## What the diff showed

`git diff workflow/round-one-vague...workflow/round-two-spec` added `src/settingsSchema.js`, `src/settingsStore.js`, split client JS/CSS, six automated tests, and **Zod + supertest** dependencies. Round one kept validation only in inline `<script>` with `email.includes("@")` and wrote errors via **`innerHTML`**. Round one’s API assigned `req.body` fields with **no server validation**, so invalid payloads still returned `{ ok: true }`.

**Correctness:** Round two trims whitespace, rejects `"   "` names and `"@"` emails, and caps display name length—cases round one accepts.

**Accessibility:** Round one used placeholders instead of labels for name/email (screen readers get empty fields). Round two pairs labels, `aria-describedby`, and live status text without HTML injection.

**Edge cases:** Round one never loads existing settings on open; round two GETs `/api/settings` on load. Round one disables nothing during submit (double-submit risk); round two disables the save button while the request is in flight.

**Review effort:** Round one needed a full manual pass to notice missing server validation. Round two’s tests encode four schema cases and two HTTP behaviors, so review starts from failing CI rather than guesswork.

## AI mistake caught

The vague pass **looked** complete because the form showed red errors client-side, but the API still persisted junk (e.g. email `"@"`). That is a common pattern: UI validation without a shared schema on the server. Round two’s tests explicitly assert invalid POST returns 400 and leaves prior settings unchanged.

## Rules going forward

See `CLAUDE.md` and `.cursor/rules.md` for testable project rules derived from this drill.
