import { expect, test } from '@playwright/test';
import { projectIds, projectTitle } from './support/site-data';

// GitHub Pages serves the static browser artifact, never the Express SSR
// server. Known routes must have their own prerendered file (HTTP 200 with
// content in the raw HTML); unknown routes fall to 404.html, the client
// shell, which renders NotFoundComponent once Angular boots.

function h1Text(html: string): string[] {
  return [...html.matchAll(/<h1[^>]*>([^<]*)</g)].map((m) => m[1].trim());
}

const ids = projectIds();

test('PROJECT_IDS is read from the loader map', () => {
  expect(ids.length).toBeGreaterThan(20);
  expect(ids).toContain('tremor');
});

for (const [route, heading] of [
  ['/about', 'About Me'],
  ['/privacy', 'Privacy'],
] as const) {
  test(`hard load ${route} returns prerendered 200`, { tag: '@smoke' }, async ({ request }) => {
    const response = await request.get(route);
    expect(response.status()).toBe(200);
    expect(h1Text(await response.text())).toContain(heading);
  });
}

test(
  'every PROJECT_IDS entry has a prerendered project entry point',
  { tag: '@smoke' },
  async ({ request }) => {
    for (const id of ids) {
      const response = await request.get(`/projects/${id}`);
      expect(response.status(), `/projects/${id} status`).toBe(200);
      expect(h1Text(await response.text()), `/projects/${id} h1`).toContain(projectTitle(id));
    }
  },
);

test(
  'hard load of a known case study shows content before hydration',
  { tag: '@smoke' },
  async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    const response = await page.goto('/projects/tremor');
    expect(response?.status()).toBe(200);
    await expect(
      page.getByRole('heading', { level: 1, name: projectTitle('tremor'), exact: true }),
    ).toBeVisible();
    await context.close();
  },
);

test(
  'unknown path falls back to the 404.html client shell',
  { tag: '@smoke' },
  async ({ page, request }) => {
    const raw = await request.get('/no-such-page/deep');
    expect(raw.status()).toBe(404);
    expect(h1Text(await raw.text())).not.toContain('Brian Rogstad');

    const response = await page.goto('/no-such-page/deep');
    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { level: 1, name: 'Page Not Found' })).toBeVisible();
  },
);
