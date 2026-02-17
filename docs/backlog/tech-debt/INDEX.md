# Tech Debt & Internal Improvements

Code quality, performance, and maintenance improvements that aren't visible to users but improve the codebase.

---

## Current Status
✅ **Low tech debt** — Recent rebuild kept debt minimal

---

## How to Add Tech Debt Items

1. Copy `_TEMPLATE.md` to create a new file: `debt-name.md`
2. Fill in all sections from the template
3. Set status to "Identified"
4. During quarterly triage, we'll prioritize and schedule

---

## Active Items

(Currently empty — capture items as you find them during development)

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
