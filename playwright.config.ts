import { defineConfig, devices } from '@playwright/test';

// Browser tests for keyboard and screen reader behaviour that axe cannot check.
// Run: npm run test:browser (first time: npx playwright install chromium webkit).
export default defineConfig({
  testDir: 'tests/browser',
  fullyParallel: true,
  reporter: 'list',
  use: { baseURL: 'http://localhost:6111' },
  webServer: { command: 'vite serve --config tests/harness/vite.config.ts', url: 'http://localhost:6111', reuseExistingServer: !process.env.CI },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
