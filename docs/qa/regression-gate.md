# Regression Gate

What must be green before a change merges to `master`, and what runs after
GitHub Pages deploys it.

## Before merge: `npm run qa`

One command, run from the repo root. It stops at the first failing stage.

| Stage      | Command                                  | What it proves                                                                  |
| ---------- | ---------------------------------------- | ------------------------------------------------------------------------------- |
| Lint       | `npm run lint`, `npm run lint:styles`    | ESLint and Stylelint rules hold                                                 |
| Unit       | `npm run test`                           | Karma + Jasmine unit specs pass (ChromeHeadless)                                |
| Build      | `npm run build` (inside `npm run e2e`)   | Prerender, Pages route entry points and sitemap checks pass                     |
| E2E + a11y | `playwright test` (inside `npm run e2e`) | Every spec in `e2e/` passes in all four projects of `docs/qa/browser-matrix.md` |

The E2E stage runs against the built `dist/portfolio-site/browser` folder,
served by `scripts/serve-pages-static.mjs` the way GitHub Pages serves it
(200 for a real file, `404.html` with a 404 otherwise). It covers:

- `harness.spec.ts`: the production build serves and boots
- `evaluator-journey.spec.ts`: home, a project card, the case study, about, not found
- `pages-deep-links.spec.ts`: prerendered 200s for `/about`, `/privacy` and every
  `PROJECT_IDS` page, plus the `404.html` fallback for unknown paths
- `accessibility.spec.ts`: axe-core, zero serious/critical WCAG 2.1 A/AA
  violations on every public route
- `browser-matrix.spec.ts`: the matrix doc matches the Playwright projects

`npm run e2e:run` reruns Playwright without rebuilding. Set `E2E_DIST_DIR` to
a copied artifact when another build may rewrite `dist/` during the run.

## What CI enforces today

`.github/workflows/ci.yml` runs lint, Stylelint, unit tests and the build on
every push and pull request to `master`. It does **not** run the E2E or a11y
suites yet, so CI alone is not the full gate: run `npm run qa` locally before
merging. Making CI block on E2E + a11y belongs to the org-wide
test-authoring-discipline spec.

## After deploy: `npm run e2e:smoke:live`

Runs the `@smoke`-tagged tests against `https://brianrogstad.com` (no local
server): the home page boots, `/about`, `/privacy` and every project page
answer 200 with prerendered content, `/projects/tremor` reads with
JavaScript off, and an unknown path falls back to `404.html`. Run it after
the Deploy workflow finishes. A failure here means the deployed artifact
differs from the one the gate passed, most often a Pages fallback or
prerender problem. Point it elsewhere with `E2E_BASE_URL=<url> playwright
test --grep @smoke`.
