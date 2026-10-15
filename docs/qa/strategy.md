# QA Strategy and Ownership

The QA layer is the repeatable check above unit tests: the Playwright harness,
the browser/device matrix, the evaluator journey, the GitHub Pages deep-link
checks, the axe-core scan and the regression gate. It runs on every change.
Source contract: `unwritten-ops/projects/portfolio/specs/qa-spec.md`.

## What QA owns

- The Playwright harness: `playwright.config.ts`, `scripts/serve-pages-static.mjs`,
  everything under `e2e/`, and the `e2e`, `e2e:run`, `e2e:smoke:live` and `qa`
  npm scripts
- The browser/device matrix (`docs/qa/browser-matrix.md`) and its drift test
- The evaluator-journey E2E (home, case study, about, not found)
- The static GitHub Pages deep-link and `404.html` fallback checks
- The automated axe-core scan: which routes, which rules, and the
  serious/critical pass/fail threshold
- The regression gate definition (`docs/qa/regression-gate.md`) and the
  post-deploy `@smoke` subset

## What QA does not own

Each check has one owner. QA runs the repeatable browser-level layer and
leaves the rest to the spec named here.

| Spec                   | Owns                                                                        | Boundary with QA                                                                                                                                 |
| ---------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| unit-tests             | Component, service, pipe and data unit logic, and unit coverage             | QA never re-tests a unit; a bug a unit test can catch belongs there                                                                              |
| test-infrastructure    | The Karma/Jasmine runner, unit CI job, coverage tooling                     | QA owns the separate Playwright harness. QA's evaluator journey on chromium is the browser smoke; test-infrastructure does not keep a second one |
| accessibility          | WCAG 2.1 AA conformance, fixing violations, manual and screen-reader checks | QA's axe scan reports violations and fails the gate; the fix is accessibility's                                                                  |
| navigation             | Nav structure, IA and routing decisions                                     | QA asserts links resolve and deep links load; it does not design the nav                                                                         |
| performance-and-deploy | Lighthouse targets, load budgets, the Pages deploy workflow                 | QA tests the built artifact the deploy ships; it runs no Lighthouse or load numbers                                                              |
| seo                    | Meta tags, Open Graph, sitemap and structured-data correctness              | QA does not check meta or schema; the build's sitemap check is seo's                                                                             |
| legal-and-launch       | The one-time live-domain pass, full link check, manual device sweep         | QA owns the repeatable pre-deploy gate and the live `@smoke` subset that feeds it                                                                |

## Not in QA scope

- Form QA: the site has no forms or user-submitted data.
- CI enforcement of E2E + a11y: QA ships a runnable gate; making CI block on
  it is the org-wide test-authoring-discipline spec's job.
- Load, concurrency and soak testing: a static personal site has no traffic SLA.
