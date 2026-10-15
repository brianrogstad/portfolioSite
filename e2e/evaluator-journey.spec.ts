import { expect, test, type Page } from '@playwright/test';
import { projectTitle } from './support/site-data';

// The evaluator path: home -> a project card -> the case study -> about ->
// an unmatched route. Each hop asserts content a routing or data-binding
// regression would silently drop.

async function openAbout(page: Page): Promise<void> {
  const desktopAbout = page
    .locator('.desktop-nav')
    .getByRole('link', { name: 'About', exact: true });
  if (await desktopAbout.isVisible()) {
    await desktopAbout.click();
    return;
  }
  await page.getByRole('button', { name: 'Open navigation menu' }).click();
  await page.locator('#mobile-menu').getByRole('link', { name: 'About', exact: true }).click();
}

test('evaluator journey: home, case study, about, not found', async ({ page }) => {
  // Any console error or uncaught page error along the happy path fails the run.
  const consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => consoleErrors.push(err.message));

  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Brian Rogstad' })).toBeVisible();

  const card = page.locator('a.project-card__image[href^="/projects/"]').first();
  const href = await card.getAttribute('href');
  expect(href).toMatch(/^\/projects\/[\w-]+\/$/);
  const id = href!.split('/').filter(Boolean).pop()!;
  const title = projectTitle(id);

  await card.click();
  await expect(page).toHaveURL(new RegExp(`/projects/${id}/$`));
  await expect(page.getByRole('heading', { level: 1, name: title, exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Project Not Found' })).toHaveCount(0);

  await openAbout(page);
  await expect(page).toHaveURL(/\/about\/$/);
  await expect(page.getByRole('heading', { level: 1, name: 'About Me' })).toBeVisible();

  // Connect: the evaluator's way to reach out from About.
  const connect = page.getByRole('complementary', { name: 'Get in touch' });
  await expect(connect).toBeVisible();
  await expect(connect.getByRole('link', { name: 'Connect with me on LinkedIn' })).toHaveAttribute(
    'href',
    /linkedin\.com\/in\//,
  );

  expect(consoleErrors, 'console errors on the happy path').toEqual([]);

  await page.goto('/this-route-does-not-exist');
  await expect(page.getByRole('heading', { level: 1, name: 'Page Not Found' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Return Home' })).toBeVisible();
});
