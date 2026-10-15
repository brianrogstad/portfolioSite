import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { projectIds } from './support/site-data';

// Repo-owned a11y gate: axe-core on every public route, failing on any
// serious or critical violation. Remediation belongs to the accessibility
// spec; this gate only reports. Ad hoc live-domain axe audits are separate.

const routes = ['/', '/about', '/privacy', ...projectIds().map((id) => `/projects/${id}`)];

for (const route of routes) {
  test(`axe: no serious/critical violations on ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator('h1').first()).toBeAttached();
    await page.waitForLoadState('networkidle');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    const blocking = results.violations
      .filter((v) => v.impact === 'serious' || v.impact === 'critical')
      .map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.map((n) => n.target.join(' ')).slice(0, 5),
      }));
    expect(blocking, `${route} serious/critical axe violations`).toEqual([]);
  });
}
