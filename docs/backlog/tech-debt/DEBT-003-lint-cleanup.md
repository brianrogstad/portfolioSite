# Lint Cleanup — ESLint + Stylelint Errors

**Category:** Refactoring
**Status:** Triaged
**Priority:** Should-Fix
**Effort:** 3-5 hours

---

## The Debt

**What's the issue?**
32 ESLint errors and 143 Stylelint errors across the codebase.

**ESLint (7 non-template errors):**
- 3x `prefer-inject` — constructor injection should use `inject()` function (app.component.ts, project-detail.component.ts)
- 1x unused `OnInit` import (home.component.ts)
- 1x `no-inferrable-types` (project-detail.component.ts)
- 1x `no-wrapper-object-types` — uppercase `Object` (app.component.ts)
- 1x `consistent-indexed-object-style` — Record over index signature (projects.service.ts)

**Stylelint (143 errors, 5 warnings):**
- ~60% in vendor Font Awesome files (not custom code)
- ~40% in custom SCSS: hex colors not using variables, missing leading zeros, empty line issues, vendor prefixes
- 100 are auto-fixable via `--fix`
- 5 Sass deprecation warnings for `/` division in Font Awesome vendor files

**Impact if not fixed:**
Noisy lint output. Inconsistent code style. Sass deprecation warnings will become errors in Dart Sass 2.0.

**Who does this affect?**
Code maintainability. No user-facing impact.

---

## Resolution Plan

**How to fix it:**
1. Run `npx stylelint "src/**/*.scss" --fix` — resolves 100 of 143 auto-fixable errors
2. Add Font Awesome vendor files to `.stylelintignore` (they're third-party, not worth hand-fixing)
3. Fix remaining custom SCSS errors manually
4. Fix 7 ESLint TypeScript errors manually (quick edits across 4 files)
5. Replace `/` division with `math.div()` in Font Awesome vendor files (or upgrade FA)

**Benefit of fixing:**
Clean lint output. Consistent code style. No more deprecation warnings.

**Effort estimate:**
3-5 hours total (10 min auto-fix + 2-3 hours manual SCSS + 30 min ESLint + 1 hour FA vendor fixes)

**Dependencies:**
DEBT-002 (control flow migration) resolves 25 of the 32 ESLint errors. Best to do that first.

**Related items:**
- DEBT-002 (control flow migration) — handles 25 of 32 ESLint errors
- DEBT-001 (Angular 19 upgrade) — inject() migration may be handled by upgrade schematics

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
