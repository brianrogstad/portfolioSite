# Legacy Control Flow Directives — Migrate to @if/@for

**Category:** Refactoring
**Status:** Triaged
**Priority:** Should-Fix
**Effort:** 1-2 hours

---

## The Debt

**What's the issue?**
25 ESLint errors across `app.component.html` (11) and `project-detail.component.html` (14) from using legacy `*ngIf` and `*ngFor` directives instead of the modern `@if`/`@for` control flow syntax.

**Impact if not fixed:**
Lint failures block clean CI runs. Code doesn't match project standards (Angular 18+ conventions). Legacy syntax will eventually be deprecated.

**Who does this affect?**
Code maintainability. No user-facing impact.

---

## Resolution Plan

**How to fix it:**
Run Angular's migration schematic: `ng generate @angular/core:control-flow-migration`. Verify templates render correctly after migration.

**Benefit of fixing:**
Eliminates 25 of 32 ESLint errors. Aligns codebase with Angular modern patterns. Slightly better runtime performance (built-in control flow is faster than structural directives).

**Effort estimate:**
1-2 hours (30 min schematic + 1 hour manual verification)

**Dependencies:**
None. Can be done independently, but could be bundled with DEBT-001 (Angular 19 upgrade).

**Related items:**
- DEBT-001 (Angular 19 upgrade) — migration schematics may handle this automatically
- DEBT-003 (inject() migration)

---

## Implementation

**Status:** Triaged
**Assigned to:** Unassigned
**Started:** [To be filled in]
**Completed:** [To be filled in]
**Commit:** [To be filled in when done]

---

**Created:** 2026-02-19
**Updated:** 2026-02-19
