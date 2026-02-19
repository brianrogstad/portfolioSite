# Broken Unit Tests — Missing Router Providers

**Severity:** High
**Status:** Triaged
**Reported:** 2026-02-19

---

## The Issue

**Component:** app.component, home.component, project-detail.component

**Steps to reproduce:**
1. Run `npm test`
2. 5 of 6 tests fail

**Expected behavior:**
All tests pass.

**Actual behavior:**
`NullInjectorError: No provider for ActivatedRoute!` — test specs weren't updated after the standalone component migration.

---

## Environment

**Browser/Device:** ChromeHeadless (Karma runner)
**Angular version:** 18.2.14
**Reproducible:** Always

---

## Context

**Notes:**
Tests broke during the Angular 18 rebuild when components moved to standalone. The TestBed configurations need `provideRouter([])` or equivalent to satisfy the ActivatedRoute dependency. Only `about.component` and `projects.service` tests pass. Coverage is at 69.69% statements / 0% branches / 45.45% functions / 66.66% lines — all well below the 80% target.

**Workaround (if any):**
Site is stable in production. Tests are just not providing a safety net.

---

## Resolution

**Status:** Triaged
**Assigned to:** Unassigned
**Fix:** Add `provideRouter([])` to TestBed imports in app.component.spec.ts, home.component.spec.ts, project-detail.component.spec.ts
**Commit:** [To be filled in when fixed]

---

**Created:** 2026-02-19
**Updated:** 2026-02-19
