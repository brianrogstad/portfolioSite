# Rules & Standards

Technical and design standards for the portfolio site. These rules ensure consistency and embody your values.

---

## Tech Stack Standards

### Framework & Runtime
- **Frontend:** Angular 18+ (latest stable)
- **Backend:** Express + Node.js (for SSR)
- **Build Tool:** Vite (via Angular CLI 18+)
- **Package Manager:** npm

### Language Standards
- **TypeScript:** Strict mode, no `any` types (use `unknown` with type guards)
- **Styling:** SCSS (hand-crafted, no CSS frameworks)
- **HTML:** Semantic, valid, accessible

### Project Structure
```
portfolioSite/
├── src/
│   ├── app/
│   │   ├── app.component.ts        # Root component
│   │   ├── app.routes.ts           # Route configuration
│   │   ├── app.config.ts           # App configuration
│   │   ├── pages/
│   │   │   ├── home/               # Homepage
│   │   │   ├── project-detail/     # Project detail pages
│   │   │   └── about/              # About page
│   │   ├── models/
│   │   │   └── project.model.ts    # Data structures
│   │   └── services/
│   │       └── projects.service.ts # Project data service
│   ├── styles/                     # Global SCSS
│   └── styles.scss                 # Entry point
├── docs/                           # Documentation
└── public/                         # Static assets (images, videos)
```

---

## Styling Standards

### CSS Architecture
- **Source:** `src/styles/` folder (SCSS files)
- **Approach:** Utility styles + component styles
- **No frameworks:** No Bootstrap, Tailwind, or CSS frameworks (you write the CSS)
- **Entry point:** `src/styles.scss`

### Design Tokens
```scss
// Colors (light theme)
$primary: #your-brand-color;
$background: #ffffff;
$text: #1a1a1a;
$border: #e0e0e0;

// Dark theme
@media (prefers-color-scheme: dark) {
  --background: #1a1a1a;
  --text: #ffffff;
}

// Spacing (4px baseline)
$spacing-xs: 0.25rem;  // 4px
$spacing-sm: 0.5rem;   // 8px
$spacing-md: 1rem;     // 16px
$spacing-lg: 1.5rem;   // 24px
$spacing-xl: 2rem;     // 32px

// Typography
$font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
$font-size-base: 1rem;
$line-height: 1.5;
```

### CSS Best Practices
- **Semantic selectors** — Use `.heading`, `.button`, not `.red-thing`
- **BEM for components** — `.component`, `.component__child`, `.component--modifier`
- **Mobile-first** — Start with mobile, add @media (min-width) for larger screens
- **No hardcoded values** — Use design tokens for colors, spacing, fonts
- **Prefer CSS over JS** — Style with CSS, reserve JS for behavior
- **Print-friendly** — Ensure pages print well (tests regularly)

### Accessibility in CSS
- **Color contrast:** Min 4.5:1 for text (WCAG AA)
- **Focus states:** Always visible focus rings on buttons, links, inputs
- **Reduced motion:** Respect `prefers-reduced-motion` media query
- **Dark theme:** Automatic dark theme support via `prefers-color-scheme`

---

## HTML & Semantic Structure

### Required Standards
- **Valid HTML5** — Use W3C validator
- **Semantic tags** — Use `<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`
- **Heading hierarchy** — `<h1>` once per page, then `<h2>`, `<h3>` in order
- **Alt text on images** — Every image has descriptive alt text
- **Form labels** — Every input has associated `<label>` with `for` attribute
- **Link structure** — Links have descriptive text (not "click here")

### Accessibility Requirements
- **WCAG 2.1 AA compliance** — Minimum standard for all pages
- **Keyboard navigation** — Tab through all interactive elements
- **Screen reader testing** — Test with VoiceOver (Mac) or NVDA (Windows)
- **Color isn't only signal** — Don't rely on color alone (icons, text, patterns)
- **Sufficient contrast** — Min 4.5:1 for normal text, 3:1 for large text

---

## Adding a New Project

### Step-by-Step Process

#### 1. Create Project Data
Edit `src/app/services/projects.service.ts`:

```typescript
const projects: ProjectDetail[] = [
  {
    id: 'my-new-project',
    title: 'Project Name',
    category: 'Design' | 'Development' | 'Full-Stack',
    description: 'Brief one-liner for the homepage',
    images: [
      {
        src: '/projects/my-new-project/image-1.jpg',
        alt: 'Descriptive alt text',
        width: 800,
        height: 600,
        caption: 'Optional caption'
      }
    ],
    content: `# Project Title

Markdown content here. Images and videos embedded automatically.`
  }
];
```

#### 2. Add Project Content
Create `public/projects/my-new-project/` folder with:
- Images (JPG/PNG, optimized for web)
- Videos (MP4, optimized)
- Any other media

#### 3. Write Case Study
In `projects.service.ts`, populate `content` field with markdown:
```markdown
## Background
What was the problem you solved?

## Approach
How did you solve it?

## Results
What were the outcomes?

## Learnings
What did you learn?
```

#### 4. Test
```bash
npm start                # Start dev server
# Visit http://localhost:4200
# Test new project page
# Test on mobile
# Test keyboard navigation
# Test with screen reader
```

#### 5. Deploy
```bash
git add .
git commit -m "feat(portfolio): add new project - Project Name"
git push origin main
# Automatic GitHub Actions deployment to GitHub Pages
```

---

## Image Standards

### Optimization
- **Format:** JPG (photos), PNG (screenshots/graphics)
- **Size:** Max 1200px width for web (optimize with ImageOptim or similar)
- **File size:** < 500KB per image (aim for < 200KB)
- **Responsiveness:** Include `width` and `height` attributes

### Naming & Organization
```
public/projects/
├── my-first-project/
│   ├── hero.jpg
│   ├── screenshot-1.png
│   ├── screenshot-2.png
│   └── result.jpg
└── my-second-project/
    ├── process.jpg
    └── final.jpg
```

### Alt Text Standards
- **Descriptive, not redundant** — "Screenshot showing homepage design" not "image"
- **Includes context** — "League Index player stats dashboard" not "dashboard"
- **Action images** — "Button showing 'Search' action" not "button"
- **Decorative images** — `alt=""` if purely decorative

---

## Performance Standards

### Build & Runtime
- **Build time:** < 30 seconds (ng build)
- **Dev server startup:** < 10 seconds (ng serve)
- **Homepage load:** < 2 seconds (LCP < 2.5s)
- **Project detail:** < 3 seconds (LCP < 2.5s)

### Lighthouse Targets
- **Performance:** 95+
- **Accessibility:** 95+
- **Best Practices:** 95+
- **SEO:** 95+

### Core Web Vitals
- **LCP (Largest Contentful Paint):** < 2.5 seconds
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1

### Bundle Size
- **Initial JS:** < 100KB (gzipped)
- **CSS:** < 50KB (gzipped)
- **Total:** < 200KB (gzipped)

---

## SEO Standards

### Required Elements
- **Page titles:** Unique, descriptive (under 60 chars)
- **Meta descriptions:** 150-160 characters
- **Open Graph tags:** For social sharing
- **Canonical URLs:** Self-referential on all pages
- **Sitemap:** Automatically generated, submitted to search engines
- **Robots.txt:** In `public/` folder, excludes nothing
- **Heading hierarchy:** `<h1>` unique per page, `<h2>`/`<h3>` in order

### Project Page SEO
- **Title format:** "Project Name - Portfolio | Brian Rogstad"
- **Meta description:** One-sentence project summary
- **Keywords:** 2-3 relevant terms (naturally included in content)
- **Image alt text:** Descriptive (also helps SEO)

### Content Standards
- **Original content** — No AI-generated fluff, write in your voice
- **Length:** Project descriptions 200-500 words (detailed but not verbose)
- **Structure:** Use headers, short paragraphs, breaks for readability
- **Internal links:** Link between related projects when relevant

---

## Analytics Standards

### Google Analytics Setup
- Connected to brianrogstad.com
- Tracking user behavior and engagement
- **Monitored metrics:**
  - Total sessions
  - Sessions per project detail page
  - Bounce rate (lower is better)
  - Average session duration
  - Referral sources

### What We Track
✅ Page views
✅ Project detail engagement
✅ Referral sources (where visitors come from)
✅ Geographic location
✅ Device type and browser

### What We Don't Track
❌ Individual user behavior (no cookies)
❌ Personally identifiable information
❌ Marketing pixels or retargeting

---

## Code Quality Standards

### TypeScript
- **Strict mode:** Required in `tsconfig.json`
- **No `any` types** — Use `unknown` with type guards
- **Explicit types** — Function return types, constructor parameters
- **Naming conventions** — camelCase for variables/functions, PascalCase for classes

### Components
- **Standalone components** — Use `standalone: true` (Angular 14+)
- **No NgModules** — Keep it modern and simple
- **OnPush change detection** — When possible, for performance
- **Template syntax** — Use `@if`, `@for` (Angular 17+), not `*ngIf`, `*ngFor`

### Services
- **Single responsibility** — One job per service
- **Dependency injection** — Use Angular's DI, not manual instantiation
- **Naming convention** — `*.service.ts`

---

## Deployment Standards

### Git Workflow
```bash
# Create feature branch
git checkout -b feat/add-new-project

# Make changes, commit with clear message
git commit -m "feat(portfolio): add new project - Project Name"

# Push and create PR (if team review)
git push origin feat/add-new-project

# Merge to main
git checkout main
git merge feat/add-new-project
git push origin main

# GitHub Actions automatically builds and deploys to GitHub Pages
```

### Deployment Process
1. Push to `main` branch
2. GitHub Actions workflow triggers
3. `npm install` and `npm build`
4. Generate SSR build and static output
5. Deploy to `gh-pages` branch
6. Site live at brianrogstad.com (via CNAME)

### Rollback
```bash
# If needed, revert the commit
git revert <commit-hash>
git push origin main
# GitHub Actions re-deploys automatically
```

---

## Maintenance Checklist

### Monthly
- [ ] Check Lighthouse scores (target 95+)
- [ ] Review analytics (traffic patterns, top projects)
- [ ] Scan for broken links
- [ ] Check console errors in dev tools

### Quarterly
- [ ] Run full accessibility audit (axe DevTools)
- [ ] Update npm dependencies
- [ ] Review Core Web Vitals
- [ ] Test on multiple browsers/devices

### Annually
- [ ] Full SEO audit
- [ ] Redesign/visual refresh consideration
- [ ] Analyze employment leads from portfolio
- [ ] Update projects to reflect current work

---

## Communication & Team Notes

**This is your personal portfolio**, so these rules are more like "your own standards" than team rules. But if you bring on agents or team members to help maintain this:

- **Preserve your voice:** Any text updates should sound like you
- **Respect design decisions:** Keep hand-crafted CSS, don't introduce frameworks
- **Maintain accessibility:** Never compromise WCAG 2.1 AA for anything
- **Keep it simple:** Resist feature creep, stay focused on project showcase

---

**Last Updated:** 2026-02-17
