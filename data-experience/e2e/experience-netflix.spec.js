import { test, expect } from '@playwright/test'

test('experience-netflix', async({ page }) => {
  const messages = []
  page.on('console', (msg) => {
    // Ignore regular log messages; we are only interested in errors.
    if (msg.type() === 'error') {
      messages.push(`[${msg.type()}] ${msg.text()}`)
    }
  })
  // Uncaught (in promise) TypeError + friends are page errors.
  page.on('pageerror', (error) => {
    messages.push(`[${error.name}] ${error.message}`)
  })

  await page.goto('http://localhost:8080/')

  await page.getByLabel('Experience').click()

  await page.getByText('netflix').click()

  await page.getByLabel('Selectionner des données de test').click()

  await page.getByText('netflix.zip').click()

  await page.getByRole('button', { name: 'Explorer vos données' }).click()

  await page.getByText('dim').click()

  await page.locator('text:has-text("Fireproof")').click()

  await page.getByText('Réinitialiser tout').click()

  await page.getByRole('tab', { name: 'Notifications' }).click()

  await page.locator('[id="\\34 "]').nth(3).click()

  await page.locator('.text-right > .v-btn').click()

  await page.getByLabel('Interaction avec').click()

  await page.getByRole('option', { name: '1' }).getByText('1').click()

  await page.getByRole('button', { name: 'Sauvegarder' }).click()

  await page.locator('[id="\\31 4"]').first().click()

  await page.getByRole('tab', { name: 'Chronologie' }).click()

  await page.getByText('De janvier 01, 2008 à novembre 03, 2022 nous avons trouvé 7526 événements datés').click()

  // Check that there is no error during the test
  expect(messages).toStrictEqual([])
})
