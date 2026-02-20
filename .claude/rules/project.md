# Portfolio Site — Technical Rules

Project-specific constraints that differ from or extend global standards.

**Note:** Work tracking has moved to Linear (workspace: Unwritten, https://linear.app/unwritten).

## Stack Specifics
- **Build tool:** Vite (via Angular CLI 18+)
- **Styling:** Hand-crafted SCSS only — NO CSS frameworks (Bootstrap, Tailwind, etc.)
- **SSR:** Express + Angular Universal
- **Hosting:** GitHub Pages via GitHub Actions (push to main auto-deploys)

## Project Structure
- Pages: `src/app/pages/<name>/` (not `features/`)
- Models: `src/app/models/`
- Services: `src/app/services/`
- Global styles: `src/styles/`

## Design Tokens
Use these values — never hardcode:
```scss
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

## CSS Conventions
- BEM naming for component styles (`.component`, `.component__child`, `.component--modifier`)
- Mobile-first responsive (start mobile, add `@media (min-width)` for larger)
- Respect `prefers-reduced-motion` and `prefers-color-scheme: dark`

## Performance Budgets (stricter than global)
- **Initial JS:** < 100KB gzipped (global allows 500KB total)
- **CSS:** < 50KB gzipped
- **Total:** < 200KB gzipped
- **Homepage LCP:** < 2.5 seconds
- **Lighthouse targets:** 95+ across all categories
