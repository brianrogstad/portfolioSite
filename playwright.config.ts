import { defineConfig, devices } from '@playwright/test';

// QA layer E2E harness (projects/portfolio/specs/qa-spec.md).
// Runs against the production browser artifact served like GitHub Pages
// (scripts/serve-pages-static.mjs); build it first with `npm run build`,
// or use `npm run e2e`, which builds and then runs.
const PORT = Number(process.env['E2E_PORT'] || 4300);

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 1 : 0,
  reporter: process.env['CI'] ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: `PORT=${PORT} node scripts/serve-pages-static.mjs`,
    url: `http://localhost:${PORT}/`,
    reuseExistingServer: !process.env['CI'],
  },
});
