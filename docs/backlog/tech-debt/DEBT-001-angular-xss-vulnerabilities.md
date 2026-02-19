# Angular XSS Vulnerabilities — Upgrade to Angular 19

**Category:** Security
**Status:** Triaged
**Priority:** Must-Fix
**Effort:** 1-2 days

---

## The Debt

**What's the issue?**
Angular 18.2.14 has 2 known high-severity XSS vulnerabilities: GHSA-jrmj-c5cx-3cw6 (SVG script attributes) and GHSA-v4hv-rgfq-gp49 (SVG animation/MathML attributes). Fix requires upgrading to Angular 19.2.18+, which is a major version change.

**Impact if not fixed:**
Known CVEs remain in production. Low practical risk for this portfolio (no user input/dynamic content), but the vulnerabilities are real and disclosed. npm audit reports 72 total vulnerabilities, 45 high — most cascade from the Angular core packages.

**Who does this affect?**
Security posture. Visitors have minimal actual risk since the site is static content with no forms or user-generated content.

---

## Resolution Plan

**How to fix it:**
1. Run `ng update @angular/core@19 @angular/cli@19` — migration schematics handle most changes
2. Update `@angular/ssr` and related packages
3. Test all 20 project detail pages, about page, and homepage
4. Verify SSR still functions
5. Run full lint + test suite after upgrade

**Benefit of fixing:**
Resolves 45+ high-severity npm audit findings. Brings codebase to current Angular LTS. Unlocks latest signals, control flow, and performance improvements.

**Effort estimate:**
1-2 days (migration schematics + testing all pages)

**Dependencies:**
None. Can be done independently.

**Related items:**
- DEBT-002 (control flow migration) — Angular 19 migration schematics may handle this automatically
- DEBT-003 (inject() migration) — same

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
