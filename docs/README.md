# Portfolio Site Documentation

Complete documentation for brianrogstad.com — how it's built, how it works, and how to maintain it.

**Live site:** [brianrogstad.com](https://brianrogstad.com)
**Status:** 🚀 Live and stable
**Last rebuilt:** February 2025 (Angular 18)
**Work tracking:** Linear (workspace: Unwritten, https://linear.app/unwritten)

---

## Where to Start

### New to this project?
1. Read **PROJECT.md** — understand the vision and values
2. Read **STATE.md** — see what's happening right now
3. Skim **RULES.md** — know the standards and how to do things

### Want to add a new project?
1. Go to **RULES.md → "Adding a New Project"** — step-by-step guide
2. Follow exact folder structure
3. Test locally before pushing

### Need to understand the code?
1. Read **system/architecture.md** — high-level technical overview
2. Check the `src/` folder structure
3. Look at existing components for patterns

### Got an idea or found a bug?
1. Decide which category: Bug, Feature, Tech Debt, or Idea
2. Add to appropriate file in `backlog/` folder
3. We'll triage quarterly

---

## Documentation Structure

```
docs/
├── README.md                    # This file
├── PROJECT.md                   # Vision, values, user journeys
├── ROADMAP.md                   # Current phase + future plans
├── STATE.md                     # What's happening now
├── RULES.md                     # Standards & how-tos
│
└── system/                      # Technical reference (no timelines)
    └── architecture.md          # How the code is organized
```

**Work tracking:** See Linear (workspace: Unwritten)

### Core Documents (Read These First)

| Document | Purpose | Read when... |
|----------|---------|--------------|
| **PROJECT.md** | Vision, values, principles | You want to understand *why* this site exists |
| **STATE.md** | Current status, what changed, next steps | You're returning after time away |
| **ROADMAP.md** | Current phase + future phases | You want to know what's scheduled |
| **RULES.md** | Standards, constraints, how-tos | You're making changes to the site |

### Reference Documents (Keep Nearby)

| Document | Purpose | Use when... |
|----------|---------|------------|
| **system/architecture.md** | Code structure and design | You're working on technical changes |

---

## How to Use This Documentation

### Reading Documentation
```
Start general, get specific:

PROJECT.md (vision)
    ↓
STATE.md (what's now)
    ↓
ROADMAP.md (what's next)
    ↓
RULES.md (how to do it)
    ↓
system/architecture.md (deep technical)
```

### Making Changes
1. **Check STATE.md** — what are you working on?
2. **Read RULES.md** — what standards apply?
3. **Make your changes** — code, assets, content
4. **Test thoroughly** — especially new projects
5. **Commit with clear message** — helps future you

### Adding Work Items
1. Create an issue in Linear (workspace: Unwritten)
2. Add context and labels
3. Link to related documentation if needed

### Quarterly Review (Every 3 months)
1. Review Linear issues (workspace: Unwritten)
2. Triage items (schedule high-priority, close low-priority)
3. Update STATE.md and ROADMAP.md if anything changed

---

## Key Principles

### This Documentation Reflects Reality
- Not aspirational ("this is what we *hope* to do")
- Not vague ("make it better")
- Concrete and specific
- Updated when reality changes

### This Documentation Reduces Friction
**Problems it solves:**
- Forgetting how the CSS works after time away
- Not knowing where to add new projects
- Confusion about design decisions
- Unclear priorities

### This Documentation Respects Your Autonomy
- You're the sole developer, these are your standards
- Docs empower you to maintain this without asking anyone
- If you hire help (agents or humans), docs make onboarding trivial

---

## Quick Reference

### Common Tasks

**Add a new project:**
→ RULES.md → "Adding a New Project" (step-by-step)

**Fix a bug or work on a feature:**
→ Create or find issue in Linear (workspace: Unwritten)
→ Mark as "In Progress"
→ Work on it
→ Mark complete when done

**Improve the code:**
→ Create issue in Linear as tech debt
→ Prioritize during quarterly review
→ Fix it

**Have a random idea:**
→ Create issue in Linear as idea/brainstorm
→ Revisit quarterly
→ Promote to "Considering" if interesting

---

## Standards Quick Reference

### Tech Stack
- **Frontend:** Angular 18+
- **Styling:** SCSS (hand-crafted)
- **Server:** Express + Node.js (SSR)
- **Deployment:** GitHub Pages (automatic)

### Required Standards
- ✅ WCAG 2.1 AA accessible (no exceptions)
- ✅ Semantic HTML (clean code)
- ✅ Lighthouse 95+ on all categories
- ✅ Mobile-responsive
- ✅ Hand-crafted CSS (no frameworks)

### How to Add a Project (TL;DR)
1. Add data to `projects.service.ts`
2. Add images/videos to `public/projects/my-project/`
3. Write markdown content
4. Test locally
5. Commit and push (auto-deploys)
6. Done!

---

## Getting Help

### If You Get Stuck
1. **Can't remember how something works?** → Check RULES.md
2. **Wondering what to work on?** → Check STATE.md and ROADMAP.md
3. **Need technical details?** → Check system/architecture.md
4. **Frustrated with something?** → Add to tech-debt.md, triage later

### If You Find an Issue
- **It's broken?** → Create bug issue in Linear
- **It's slow?** → Create tech-debt issue in Linear
- **You have a feature idea?** → Create feature issue in Linear
- **It's a wild idea?** → Create brainstorm issue in Linear

---

## Document Ownership

| Document | Owner | Update Frequency |
|----------|-------|-----------------|
| PROJECT.md | You (product vision) | Rarely (only if vision changes) |
| STATE.md | You (current focus) | Whenever significant change |
| ROADMAP.md | You (future plans) | Quarterly review |
| RULES.md | You (standards) | When standards change |
| system/architecture.md | You (technical reference) | When structure changes |

---

## When to Update Docs

### Update Immediately
- Major feature completed
- Direction changed
- New standard established
- Blocker or major issue

### Update Quarterly
- Backlog triage
- ROADMAP.md review
- PROJECT.md refresh
- Dependencies/tech stack review

### Update Annually
- Full documentation audit
- Standards review
- Archive old ideas
- Celebrate progress

---

## Success Criteria

This documentation is working if:
- ✅ You can return after 2 weeks away and remember where you left off
- ✅ You can add a new project in < 30 minutes
- ✅ You understand why every design decision was made
- ✅ Code quality remains consistent
- ✅ Onboarding new help is simple

---

## Questions?

If documentation is unclear or missing something:
1. Add a note to ideas.md
2. Update the docs
3. Include in next quarterly review

This documentation should serve *you*, not the other way around.

---

**Last Updated:** 2026-02-17
**Created:** 2026-02-17 (first unified docs for this site)
