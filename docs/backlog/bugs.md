# Bugs & Issues

Reported issues that need investigation or fixing.

---

## Current Status
✅ **No critical bugs** — Site is stable and working well

---

## Open Bugs

(Currently empty — add bugs as they're discovered)

### Template for New Bug
```markdown
## [Bug Title]

**Severity:** Critical | High | Medium | Low
**Status:** Open | In Progress | Blocked | Ready to Fix
**Reported:** [Date]

**Component:** [app.component, project-detail, etc.]

**Steps to reproduce:**
1. ...
2. ...

**Expected behavior:**
[What should happen]

**Actual behavior:**
[What actually happens]

**Browser/Device:**
[Chrome/Safari/Firefox on Mac/iOS/Android]

**Notes:**
[Any additional context]
```

---

## Resolved Bugs (Archive)

### 2026-02-16: Mobile nav hamburger menu not closing
- **Status:** ✅ Fixed
- **Issue:** Hamburger menu stayed open after clicking link
- **Fix:** Added nav close on route change
- **Commit:** `fix(nav): close mobile menu on route navigation`

---

## How to Report a Bug

Found an issue? Add it here:

1. Create a new section with the bug title
2. Fill in severity (Critical > High > Medium > Low)
3. Include exact steps to reproduce
4. Note expected vs. actual behavior
5. Include browser/device info
6. Update status as you work on it

**Severity Guide:**
- **Critical:** Site broken, can't navigate, core feature unusable
- **High:** Major feature broken, workaround possible
- **Medium:** Feature has issues, but usable
- **Low:** Minor visual glitch, low impact

---

**Last Updated:** 2026-02-17
