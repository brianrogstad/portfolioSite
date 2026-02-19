# Architecture Overview

Technical reference for how the portfolio site is built and how components interact.

---

## High-Level Structure

```
┌─────────────────────────────────────────────┐
│         brianrogstad.com (Live Site)        │
└──────────────────┬──────────────────────────┘
                   │
         ┌─────────┴─────────┐
         │                   │
    ┌────▼────┐          ┌────▼────┐
    │ Browser │          │ Express │
    │ (Client)│          │ Server  │
    └────┬────┘          └────┬────┘
         │   Angular 18       │
         │  Standalone        │
         │  Components        │
         │                    │
         │                    │ Server-Side
         │                    │ Rendering
         └────────┬───────────┘
                  │
        ┌─────────┴──────────┐
        │                    │
    ┌───▼───┐         ┌─────▼────┐
    │ SCSS  │         │  Routes   │
    │Styles │         │  & Pages  │
    └───────┘         └───────────┘
```

---

## Technology Stack

### Frontend
- **Framework:** Angular 18 (latest stable)
- **Module System:** Standalone components (no NgModules)
- **Control Flow:** New syntax (@if, @for, @switch)
- **Change Detection:** OnPush (performance optimized)
- **Build Tool:** Vite (via Angular CLI)
- **Styling:** SCSS (custom, no frameworks)

### Backend (Server-Side Rendering)
- **Runtime:** Node.js (Latest LTS)
- **Framework:** Express 4
- **SSR:** Angular SSR package
- **Port:** 4200 (dev), deployed to GitHub Pages

### Build & Deployment
- **Package Manager:** npm
- **Build Command:** `ng build` (produces dist/ folder)
- **Deploy:** GitHub Pages (automatic via GitHub Actions)
- **Hosting:** GitHub Pages (free tier)
- **Domain:** brianrogstad.com (CNAME configured)

---

## Component Structure

### Root Component
- **File:** `src/app/app.component.ts`
- **Purpose:** Main layout shell, navigation, routing outlet
- **Includes:** Header, nav, footer, `<router-outlet>`

### Pages (Routable Components)

#### Home Page
- **File:** `src/app/pages/home/`
- **Route:** `/` (root)
- **Purpose:** List all projects with descriptions
- **Features:** Grid layout, project cards, brief descriptions

#### Project Detail Page
- **File:** `src/app/pages/project-detail/`
- **Route:** `/project/:id`
- **Purpose:** Full case study with markdown content, images, videos
- **Features:** Dynamic routing, markdown parsing, media gallery

#### About Page
- **File:** `src/app/pages/about/`
- **Route:** `/about`
- **Purpose:** Your background, values, contact info
- **Features:** Markdown content, possibly contact form

### Services

#### Projects Service
- **File:** `src/app/services/projects.service.ts`
- **Purpose:** Centralized project data (20 projects)
- **Methods:**
  - `getProject(id)` — Single project by key for detail page
- **Data Source:** Individual JSON files in `src/app/data/*.json`, imported into a `{ [key: string]: ProjectDetail }` dictionary

---

## Routing Configuration

```typescript
// src/app/app.routes.ts
const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'projects/:id',
    component: ProjectDetailComponent
  },
  {
    path: '**',
    redirectTo: ''  // Catch-all: redirect to home
  }
];
```

---

## Data Model

### ProjectDetail Interface
```typescript
export interface ProjectDetail {
  id: string;                    // Unique identifier (used in URL)
  title: string;                 // Project name
  category: string;              // Design, Development, Full-Stack
  description?: string;          // One-liner for homepage
  content?: string;              // Markdown for detail page
  images?: ProjectImage[];       // Gallery images
  videos?: ProjectVideo[];       // Embedded videos
  media?: ProjectMedia[];        // Combined media array
}

export interface ProjectImage {
  src: string;                   // Path to image
  alt: string;                   // Alt text (required)
  width?: number;                // Image width for layout
  height?: number;               // Image height for layout
  caption?: string;              // Optional caption
}

export interface ProjectVideo {
  src: string;                   // Video URL or path
  alt: string;                   // Alt text
  caption?: string;              // Optional caption
  autoplay?: boolean;            // Auto-play when visible
  loop?: boolean;                // Loop on end
  muted?: boolean;               // Start muted (required for autoplay)
}
```

---

## Styling Architecture

### SCSS Organization
```
src/styles/
├── styles.scss           # Entry point
├── base/                 # Foundation styles
│   ├── _glob.scss        # Base barrel file
│   ├── _colors.scss      # Color variables and theme definitions
│   └── _fonts.scss       # Font declarations
├── components/           # Component-specific styles
│   ├── _glob.scss        # Components barrel file
│   ├── _content.scss     # Content area styles
│   ├── _footer.scss      # Footer styles
│   ├── _header.scss      # Header styles
│   ├── _main-nav.scss    # Main navigation
│   ├── _menu-open.scss   # Mobile menu open state
│   ├── _project.scss     # Project card/detail styles
│   └── _side-nav.scss    # Side navigation
├── layout/               # Layout and structural styles
│   ├── _glob.scss        # Layout barrel file
│   ├── _global.scss      # Global layout rules
│   └── _headings.scss    # Heading hierarchy
├── pages/                # Page-specific styles
│   ├── _glob.scss        # Pages barrel file
│   └── _404.scss         # 404 page styles
├── utils/                # Utilities and helpers
│   ├── _glob.scss        # Utils barrel file
│   ├── _mixins.scss      # Reusable mixins
│   └── _normalize.scss   # CSS normalization
└── vendor/               # Third-party styles
    ├── _glob.scss        # Vendor barrel file
    ├── _font-awesome.scss
    └── font-awesome/     # Font Awesome partials
```

### Design Tokens
```scss
// Colors (src/styles/base/_colors.scss)
// Named color variables
$danube: #307ecd;        // Blue
$chambray: #166fc8;      // Darker blue

// Theme map with light/dark definitions
$themes: (
  light: (bg: #ffffff, text: #333333, primary: #4285f4, secondary: #fbbc05),
  dark:  (bg: #121212, text: #f5f5f5, primary: #8ab4f8, secondary: #fdd663)
);
// Themes output as CSS custom properties (--bg, --text, --primary, --secondary)

// Spacing (4px baseline)
$spacing-xs: 0.25rem;   // 4px
$spacing-sm: 0.5rem;    // 8px
$spacing-md: 1rem;      // 16px
$spacing-lg: 1.5rem;    // 24px
$spacing-xl: 2rem;      // 32px

// Typography
$font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
$font-size-base: 1rem;
$line-height-base: 1.5;
```

### CSS Approach
- **No frameworks** — All styles hand-crafted
- **BEM naming** — `.component`, `.component__element`, `.component--modifier`
- **Mobile-first** — Base styles for mobile, then @media (min-width) for larger screens
- **Dark theme** — `@media (prefers-color-scheme: dark)` for dark mode

---

## Server-Side Rendering (SSR)

### How It Works
1. User requests page (e.g., `/project/my-project`)
2. Express server intercepts request
3. Angular renders component tree on server
4. Server returns fully-rendered HTML to browser
5. Browser immediately displays content (fast!)
6. Angular boots on client, takes over interactivity

### Benefits
- **Fast initial page load** (HTML received immediately)
- **Better SEO** (search bots see full HTML)
- **Better UX on slow networks** (content visible even if JS slow to load)
- **Graceful degradation** (site works even if JS fails to load)

### SSR Configuration
- **File:** `src/app/app.config.server.ts`
- **Server:** `server.ts` (Express configuration)
- **Build output:** `dist/portfolio-site/server/` and `dist/portfolio-site/browser/`

---

## Performance Optimizations

### Bundle Size
- **No CSS frameworks** — Keeps CSS bundle small
- **No heavy dependencies** — Only Angular and essentials
- **Lazy loading** — Components only loaded when needed
- **Code splitting** — Routes loaded on demand

### Rendering Performance
- **OnPush change detection** — Reduced unnecessary checks
- **Signals** (when used) — Granular reactivity
- **Image optimization** — Lazy loading via `loading="lazy"`
- **Service worker** (if needed) — Caching strategy

### Network Performance
- **SSR** — Initial content rendered server-side
- **Compression** — gzip on all responses
- **Caching headers** — Set for static assets (CSS, images)
- **CDN** — GitHub Pages CDN delivers content globally

---

## Static Assets

### Organization
```
public/
├── projects/
│   ├── my-first-project/
│   │   ├── hero.jpg
│   │   ├── screenshot-1.png
│   │   └── result.jpg
│   └── my-second-project/
│       ├── image.jpg
│       └── video.mp4
├── favicon.ico
├── robots.txt           # SEO
├── sitemap.xml          # SEO
└── CNAME                # Custom domain config
```

### Image Optimization
- **Formats:** JPG (photos), PNG (graphics/screenshots)
- **Size:** < 1200px width, optimized file size < 500KB
- **Responsive:** Include width/height attributes for layout stability

---

## Build Process

### Development Build
```bash
npm start
# Vite dev server starts
# Hot reload on file changes
# Available at http://localhost:4200
```

### Production Build
```bash
npm run build
# Produces optimized dist/ folder
# Runs Angular build (includes SSR build)
# Creates server.mjs and static assets
```

### Deployment Process
1. Push to `main` branch
2. GitHub Actions workflow triggered
3. Install dependencies: `npm install`
4. Run build: `npm run build`
5. Deploy dist/ to gh-pages branch
6. GitHub Pages serves site automatically

---

## Testing Strategy

### Manual Testing (Current)
- Desktop browsers (Chrome, Safari, Firefox)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Keyboard navigation (Tab through all elements)
- Screen reader (VoiceOver or NVDA)

### Automated Testing (Optional Future)
- Unit tests (component logic, services)
- E2E tests (user workflows)
- Accessibility tests (axe-core)
- Performance tests (Lighthouse)

---

## SEO Implementation

### Technical SEO
- **Semantic HTML:** Proper heading hierarchy, semantic tags
- **Meta tags:** Title, description on all pages
- **Open Graph:** For social sharing
- **Sitemap:** Auto-generated, submitted to search engines
- **Robots.txt:** Allows all crawlers
- **Structured data:** (Optional) Schema.org markup

### Performance SEO
- **Core Web Vitals:** Monitored and optimized
- **Page speed:** < 2 seconds target
- **Mobile-friendly:** Responsive design
- **Crawlability:** All pages accessible to bots

---

## Analytics & Monitoring

### Google Analytics
- **Tracking ID:** (Set in app config)
- **Tracked:** Page views, user behavior, referral sources
- **Dashboard:** Quarterly review of metrics

### Performance Monitoring
- **Lighthouse:** Monthly audits (target 95+)
- **Core Web Vitals:** Continuous monitoring
- **Error tracking:** Console errors logged (development)

---

## Future Considerations

### If Adding Features
- **Blog section:** Markdown parsing, categorization, search
- **Search functionality:** Client-side search (JSON data)
- **Dark theme toggle:** User preference, saved to localStorage
- **Comments/feedback:** Comment system or form submission

### If Scaling Content
- **CMS integration:** Could migrate from hardcoded data to CMS
- **API endpoint:** Separate data service from component code
- **Database:** If user-generated content (comments, submissions)

---

**Last Updated:** 2026-02-19
