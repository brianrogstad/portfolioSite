# Tech Debt & Internal Improvements

Code quality, performance, and maintenance improvements that aren't visible to users but improve the codebase.

---

## Current Status
✅ **Low tech debt** — Recent rebuild kept debt minimal

---

## Open Items

(Currently empty — capture items as you find them during development)

### Template for Tech Debt
```markdown
## [Debt Item Title]

**Category:** Performance | Refactoring | Dependencies | Testing | Documentation | Security
**Status:** Identified | Planned | In Progress | Blocked
**Priority:** Must-Fix | Should-Fix | Nice-to-Fix

**What's the debt?**
[Explain the technical issue]

**Impact if not fixed:**
[What gets worse over time?]

**Effort to fix:**
[Rough estimate: hours/days]

**Benefit:**
[What improves? Performance? Maintainability?]

**Dependencies:**
[What needs to exist first?]

**Notes:**
[Any additional context]
```

---

## Categories

### Performance
- Bundle size optimization
- Rendering performance improvements
- Image/media optimization
- Caching strategies

### Refactoring
- Code simplification
- Component restructuring
- Service consolidation
- Naming/organization improvements

### Dependencies
- npm package updates
- Security patches
- Deprecation handling
- Version upgrades

### Testing
- Unit test coverage
- E2E test automation
- Accessibility testing
- Visual regression testing

### Documentation
- Code comments
- README updates
- Component documentation
- Architecture docs

### Security
- Vulnerability fixes
- CORS configuration
- Content Security Policy
- Environment variable security

---

## Examples (For Reference)

### Example 1: CSS Refactoring
```markdown
## CSS variable consolidation

**Category:** Refactoring
**Status:** Identified
**Effort:** 2-3 hours
**Benefit:** Easier theme switching, maintainability

**What's the debt?**
Design tokens are defined in multiple places instead of single source of truth.

**Impact:**
Hard to update colors/spacing globally. Theme switching would require changes in multiple files.

**Benefit:**
Single design token file makes global updates trivial. Easier to add new themes.
```

### Example 2: Bundle Size
```markdown
## Reduce initial JavaScript bundle

**Category:** Performance
**Status:** Identified
**Effort:** 4-6 hours
**Benefit:** Faster page load, better Core Web Vitals

**What's the debt?**
Some utility code could be lazy-loaded instead of bundled with initial app.

**Impact:**
Initial JS bundle is larger than necessary. LCP could be faster.

**Benefit:**
< 2s page load time on slower networks. Better Lighthouse score.
```

---

## Deprecation Tracking

### Angular 18 Deprecations
- `OnInit` → Use `inject()` in constructor (modern Angular)
- `ActivatedRoute` → Use input signals (Angular 17+)
- RxJS patterns → Consider Signals when applicable

### npm Dependency Monitoring
- Check for security advisories: `npm audit`
- Check for outdated packages: `npm outdated`
- Review major version updates quarterly

---

## When to Tackle Tech Debt

**During active development:**
- Fix critical performance issues immediately
- Address security vulnerabilities immediately
- Refactor if blocking new features

**During maintenance phases:**
- Dedicate time to tech debt reduction
- Update dependencies
- Improve test coverage
- Optimize bundle size

**Never compromise:**
- Accessibility (always meets WCAG AA)
- Security
- Performance (if it impacts UX)

---

**Last Updated:** 2026-02-17
