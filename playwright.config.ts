import { defineConfig, devices } from '@playwright/test';

const isLive = !!process.env.BASE_URL;
const baseURL = process.env.BASE_URL || 'http://127.0.0.1:8000';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 4 : undefined,
  timeout: 30000,
  expect: {
    timeout: 5000,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.05,
      threshold: 0.2,
      animations: 'disabled',
    },
  },
  reporter: process.env.CI
    ? [
      ['github'],
      ['html', { outputFolder: 'reports/html', open: 'never' }],
      ['json', { outputFile: 'reports/results.json' }],
      ['list']
    ]
    : [['list'], ['html', { outputFolder: 'reports/html', open: 'never' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 8'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 18'] },
    },
  ],
  // Only launch local Node server when not targeting an external live URL
  webServer: isLive
    ? undefined
    : {
      command: 'node scripts/serve.mjs 8000',
      url: 'http://127.0.0.1:8000',
      reuseExistingServer: !process.env.CI,
      stdout: 'pipe',
      stderr: 'pipe',
    },
});
