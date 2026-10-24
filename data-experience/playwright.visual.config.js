// @ts-check
import { devices } from '@playwright/test'

/**
 * Screenshots of every tab of an experience, compared with the committed ones.
 * Run through scripts/visual-tests.sh, which takes the screenshots in the Playwright Docker image
 * so they are the same on every machine and in CI. See e2e/README.md.
 *
 * @type {import('@playwright/test').PlaywrightTestConfig}
 */
const config = {
  testDir: './e2e/visual',
  snapshotPathTemplate: '{testDir}/__screenshots__/{projectName}/{arg}{ext}',
  timeout: 180 * 1000,
  expect: {
    timeout: 15000,
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
      // tolerate anti-aliasing noise only
      maxDiffPixelRatio: 0.001
    }
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // a screenshot difference is a result, not a flake
  retries: 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL: process.env.VISUAL_BASE_URL || 'http://localhost:8080',
    timezoneId: 'Europe/Zurich',
    locale: 'en-GB',
    colorScheme: 'light',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure'
  },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } }
    },
    {
      name: 'phone',
      use: { ...devices['Pixel 5'] }
    }
  ]
}

export default config
