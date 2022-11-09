import { test, expect } from '@playwright/test'

test('experience-uber', async({ page }) => {
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

  await page.locator('.my-2').first().click()
  await page.getByText('Français').click()

  await page.getByLabel('Experience').click()

  await page.getByRole('option', { name: 'uber' }).getByText('uber').click()

  await page.getByLabel('Selectionner des données de test').click()

  await page.getByText('uber.zip').click()

  await page.getByRole('button', { name: 'Explorer vos données' }).click()

  await page.getByRole('tab', { name: 'Vue d\'ensemble' }).click()

  await page.getByText('dim').click()

  await page.locator('text:has-text("Sesame Street")').click()

  await page.locator('#address-chart').getByText('réinitialiser').click()

  await page.locator('.v-card__actions > .my-2').click()

  await page.getByRole('tab', { name: 'Trajets' }).click()

  await page.getByRole('tab', { name: 'Chronologie' }).click()

  await page.getByRole('tab', { name: 'Carte de trajets' }).click()

  await page.getByRole('tab', { name: 'Observations de localisation' }).click()

  // Check that there is no error during the test
  expect(messages).toStrictEqual([])
})
