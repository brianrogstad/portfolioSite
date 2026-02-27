# Product Rules & Constraints

Product behavior, design standards, and content guidelines. Technical coding rules live in `.claude/rules/`.

---

## Design Standards

### CSS Architecture
- Hand-crafted SCSS — NO CSS frameworks (Bootstrap, Tailwind, etc.)
- Utility styles + component styles approach
- BEM naming for component styles (`.component`, `.component__child`, `.component--modifier`)
- Mobile-first responsive (start mobile, add `@media (min-width)` for larger)

### Accessibility in Design
- Color contrast: Min 4.5:1 for text (WCAG AA)
- Visible focus rings on all interactive elements
- Respect `prefers-reduced-motion` media query
- Automatic dark theme via `prefers-color-scheme`
- Color is never the only signal — use icons, text, patterns

### Semantic HTML
- Valid HTML5 (W3C validator)
- Semantic tags: `<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`
- Heading hierarchy: `<h1>` once per page, then `<h2>`, `<h3>` in order
- Descriptive link text (never "click here")
- Screen reader testing with VoiceOver

---

## Adding a New Project

1. **Create project data** — Add a new JSON file in `src/app/data/<project-name>.json` matching the `ProjectDetail` interface, then import and register it in `src/app/services/projects.service.ts`
2. **Add media** — Create `public/projects/<project-name>/` folder with optimized images
3. **Write case study** — Populate `content` field: Background, Approach, Results, Learnings
4. **Test** — Dev server, mobile, keyboard nav, screen reader
5. **Deploy** — Commit, push to main, GitHub Actions auto-deploys

---

## Image Standards

- **Format:** JPG (photos), PNG (screenshots/graphics)
- **Max width:** 1200px for web
- **File size:** < 500KB per image (aim for < 200KB)
- **Alt text:** Descriptive and contextual ("League Index player stats dashboard" not "dashboard")
- **Decorative images:** `alt=""`

---

## SEO Standards

### Required Elements
- Page titles: Unique, descriptive, under 60 chars
- Meta descriptions: 150-160 characters
- Open Graph tags for social sharing
- Canonical URLs (self-referential)
- Sitemap automatically generated
- Robots.txt in `public/`

### Project Pages
- Title format: "Project Name - Portfolio | Brian Rogstad"
- 200-500 word descriptions (detailed but not verbose)
- Original content, written in your voice (no AI-generated fluff)
- Internal links between related projects

---

## Analytics

### What We Track
- Page views, project detail engagement, referral sources, geographic location, device type

### What We Don't Track
- Individual user behavior, personally identifiable information, marketing pixels, retargeting

---

## Deployment

- Push to `main` triggers GitHub Actions
- Auto-builds SSR + static output
- Deploys to `gh-pages` branch → live at brianrogstad.com
- Rollback via `git revert` + push

---

## Maintenance Cadence

- **Monthly:** Lighthouse scores (95+ target), analytics review, broken link scan
- **Quarterly:** Full accessibility audit, dependency updates, Core Web Vitals review
- **Annually:** Full SEO audit, visual refresh consideration, project updates

---

## Voice & Identity

- This is your personal portfolio — preserve your voice in all content
- Keep it simple — resist feature creep, stay focused on project showcase
- Never compromise accessibility for aesthetics
