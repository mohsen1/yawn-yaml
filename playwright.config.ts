import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for YAWN YAML demo e2e tests.
 *
 * Supports two modes:
 * - Local: Tests against local dev server (npm run start)
 * - Production: Tests against https://azimi.me/yawn-yaml/demo/index.html
 *
 * Set BASE_URL env var to override the default URL.
 */

const isCI = !!process.env.CI;
const isProdTest = !!process.env.PROD_TEST;
// For local: parcel serves at root, so baseURL is just the origin
// For prod: the demo is at /yawn-yaml/demo/
const baseURL = process.env.BASE_URL || (isProdTest
  ? 'https://azimi.me/yawn-yaml/demo/'
  : 'http://localhost:1234');

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: isCI ? 'github' : 'list',

  use: {
    baseURL,
    headless: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Only start local server when not testing production
  ...(isProdTest ? {} : {
    webServer: {
      command: 'npm run start',
      url: 'http://localhost:1234',
      reuseExistingServer: !isCI,
      timeout: 120000,
    },
  }),
});
