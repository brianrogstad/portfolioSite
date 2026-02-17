# Feature Requests & Enhancements

Requested features, enhancements, and new capabilities.

---

## Current Status
✅ **Feature-complete for current vision** — Site does what it needs to

---

## Open Requests

(Currently empty — add feature ideas as they arise)

### Template for Feature Request
```markdown
## [Feature Name]

**Category:** Enhancement | New Feature
**Status:** Proposed | Considering | Planned | Rejected
**Priority:** Must-Have | Should-Have | Nice-to-Have
**Requested:** [Who asked for this?]

**What's the request?**
[Clear description of what's wanted]

**User value:**
[How does this help visitors or you?]

**Impact:**
[What changes about the site?]

**Effort estimate:**
[Rough hours/days to implement]

**Dependencies:**
[What needs to exist first?]

**Alternative approaches:**
[Other ways to solve this?]

**Decision:**
[Include reason if rejected]
```

---

## Examples (For Reference)

### Example 1: Dark/Light Theme Toggle
```markdown
## User theme toggle (dark/light)

**Category:** Enhancement
**Status:** Considering
**Priority:** Nice-to-Have
**Requested:** Yourself (accessibility improvement)

**What's the request?**
Add a toggle button to switch between light and dark themes. Currently respects system preference only.

**User value:**
- Users on light systems but prefer dark mode can override
- More control over readability
- Personalization

**Impact:**
- Add toggle button in header
- Store preference in localStorage
- Remember across sessions

**Effort:** 2-3 hours

**Dependencies:** None (CSS dark theme already exists)

**Alternative approaches:**
- Keep system preference only (current state)
- Add theme selector in settings page (if added)

**Decision:** Not scheduled yet — low priority, system preference usually sufficient
```

### Example 2: Blog Section
```markdown
## Blog / Articles section

**Category:** New Feature
**Status:** Proposed
**Priority:** Should-Have
**Requested:** Yourself (content marketing, SEO)

**What's the request?**
Add a blog section for writing about design, development, and industry insights.

**User value:**
- SEO benefits (more indexed content)
- Demonstrate expertise
- Connect with audience
- Build thought leadership

**Impact:**
- New `/blog` route
- Blog post listing page
- Individual blog post pages
- Markdown content support (can reuse from projects)
- RSS feed (optional)

**Effort:** 8-12 hours (depends on features)

**Dependencies:**
- Decide on content format (markdown files vs CMS)
- Design blog post layout
- Establish editorial calendar

**Alternative approaches:**
- Medium.com integration (external blogging)
- Link to articles elsewhere
- Keep content on portfolio only (no blog)

**Decision:** TBD — depends on whether content marketing is priority
```

---

## Feature Categories

### Content
- Blog section
- Case study templates
- Resource library
- Speaking/conference history
- Open source projects list

### Design & UX
- Dark/light theme toggle
- Advanced project filtering
- Search functionality
- Related projects section
- Project tags/categories

### Technical
- API for project data
- Headless CMS integration
- Newsletter signup
- Comment system
- RSS feeds

### Monetization
- Affiliate links (if relevant)
- Course/service promotion
- Email capture
- Featured projects
- Sponsored content (probably not)

---

## Prioritization Framework

**Before scheduling a feature, ask:**

1. **Does it align with portfolio purpose?**
   - YES → Consider it
   - NO → Reject

2. **Does it improve user experience?**
   - YES → Continue
   - NO → Nice-to-have at best

3. **Is ROI clear?** (time investment vs benefit)
   - YES → Prioritize high
   - NO → Lower priority

4. **Is it low effort?** (< 4 hours)
   - YES → Consider now
   - NO → Schedule for later or reject

---

## Feature Request Process

**When you have an idea:**

1. Add it to this file
2. Use the template above
3. Think through user value and effort
4. Mark as "Proposed"
5. During quarterly reviews, decide:
   - **Approved:** Move to ROADMAP.md phase file
   - **Considering:** Keep in backlog, think more
   - **Rejected:** Note decision reason, keep for reference

**During development:**
- Update status as you work on it
- Move to appropriate phase file when scheduled
- Archive decisions for future reference

---

## Rejected Features (Reference)

### Why we're not doing certain things:

**Ads/monetization on portfolio**
- **Reason:** Compromises credibility and user experience
- **Decision:** Keep portfolio pure, explore monetization only if separate product

**Build-your-own-portfolio tool**
- **Reason:** Out of scope (portfolio is for showcasing YOUR work)
- **Decision:** If considering this, it's a separate product

**Live chat/support**
- **Reason:** Portfolio doesn't need it (simple information site)
- **Decision:** Contact form sufficient

---

**Last Updated:** 2026-02-17
