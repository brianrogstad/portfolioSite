import { defineConfig, devices } from '@playwright/test';

// QA layer E2E harness (projects/portfolio/specs/qa-spec.md).
// Runs against the production browser artifact served like GitHub Pages
// (scripts/serve-pages-static.mjs); build it first with `npm run build`,
// or use `npm run e2e`, which builds and then runs.
// E2E_BASE_URL (e.g. https://brianrogstad.com) skips the local server and
// points the run at a deployed site: the post-deploy smoke subset.
const PORT = Number(process.env['E2E_PORT'] || 4300);
const LIVE_URL = process.env['E2E_BASE_URL'];

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 1 : 0,
  reporter: process.env['CI'] ? 'github' : 'list',
  use: {
    baseURL: LIVE_URL || `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 7'] } },
  ],
  webServer: LIVE_URL
    ? undefined
    : {
        command: `PORT=${PORT} node scripts/serve-pages-static.mjs`,
        url: `http://localhost:${PORT}/`,
        reuseExistingServer: !process.env['CI'],
      },
});
