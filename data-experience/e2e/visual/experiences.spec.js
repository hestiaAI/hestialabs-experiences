import { test, expect } from '../fixtures.js'

// Experiences whose tabs are compared with the screenshots in __screenshots__.
// Add an experience here, with a sample from packages/lib/data-samples/, then create its screenshots
// with `npm run test:visual -- --update-snapshots` (see e2e/README.md).
const experiences = [
  { slug: 'apple-tracker', sample: 'apple-tracker.ndjson' },
  { slug: 'tracker-control', sample: 'tracker-control.csv' }
]

const locales = ['en', 'fr']

// Fixed UI over the content (bottom navigation, settings button): not part of the tabs.
const hideFixedUi = '.v-bottom-navigation, .v-speed-dial { visibility: hidden !important; }'

// A tab renders its charts after its pipeline has run: wait until nothing is loading
// and the tab's height has stayed the same for a moment.
async function waitForTab(page, locator) {
  let previous = null
  let stable = 0
  for (let attempt = 0; attempt < 100 && stable < 4; attempt++) {
    await page.waitForTimeout(250)
    const loading = await page.locator('.v-progress-circular:visible, .v-progress-linear:visible').count()
    const { height } = await locator.boundingBox()
    stable = !loading && height === previous ? stable + 1 : 0
    previous = height
  }
}

for (const { slug, sample } of experiences) {
  for (const locale of locales) {
    test(`${slug} (${locale})`, async({ page }) => {
      test.setTimeout(180000)
      const errors = []
      page.on('pageerror', error => errors.push(`[${error.name}] ${error.message}`))

      await page.goto('/', { waitUntil: 'domcontentloaded' })
      await page.getByLabel('Experience').click()
      await page.getByRole('option', { name: slug, exact: true }).click()

      // switching the language clears the loaded data, so switch before loading the sample
      await page.evaluate((code) => {
        document.querySelector('[data-app]').__vue__.$i18n.locale = code
      }, locale)

      await page.getByRole('button', { name: /Select sample data|Selectionner des données de test/i }).click()
      await page.getByText(sample, { exact: true }).click()
      await page.getByRole('button', { name: /Explore your data|Explorer vos données/i }).click()

      const tabs = page.locator(`.${slug}-tabs-wrapper`)
      await expect(tabs.getByRole('tab').first()).toBeVisible()
      await page.addStyleTag({ content: hideFixedUi })
      await page.evaluate(() => document.fonts.ready)

      const count = await tabs.getByRole('tab').count()
      for (let index = 0; index < count; index++) {
        await tabs.getByRole('tab').nth(index).click()
        await page.mouse.move(0, 0)
        await waitForTab(page, tabs)
        await expect(tabs).toHaveScreenshot(`${slug}-${index + 1}-${locale}.png`)
      }

      expect(errors).toStrictEqual([])
    })
  }
}
