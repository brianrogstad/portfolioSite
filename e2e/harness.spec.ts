import { expect, test } from '@playwright/test';

// Harness smoke: the static production artifact is served and boots.
test('home serves the production build', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle(/Brian Rogstad/);
});
