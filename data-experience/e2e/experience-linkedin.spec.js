import { test, expect } from '@playwright/test'

test('experience-linkedin', async({ page }) => {
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

  await page.getByText('linkedin').click()

  await page.getByLabel('Selectionner des données de test').click()

  await page.getByText('linkedin.zip').click()

  await page.getByRole('button', { name: 'Explorer vos données' }).click()

  await page.getByText('Linkedin-fake-data').click()

  await page.getByText('Ad_Targeting.csv').click()

  await page.getByRole('tab', { name: 'Brut' }).click()

  await page.getByRole('tab', { name: 'Schéma' }).click()

  await page.getByRole('tab', { name: 'Joli' }).click()

  await page.getByRole('tab', { name: 'Données inférées' }).click()

  await page.getByText('Human resources professional').click()

  await page.getByText('Based on factors such as your industry and profile headline.').click()

  await page.locator('.v-card__actions > div:nth-child(2)').first().click()

  await page.locator('div[role="combobox"]:has-text("Filtrer par catégorie") div').nth(1).click()

  await page.getByRole('option', { name: 'Intérêts inférés' }).getByText('Intérêts inférés').click()

  await page.getByRole('option', { name: 'Intérêts inférés' }).getByText('Intérêts inférés').click()

  await page.getByRole('tab', { name: 'Ciblage publicitaire' }).click()

  await page.getByRole('tab', { name: 'Connections' }).click()

  await page.getByRole('tab', { name: 'Chronologie' }).click()

  // Check that there is no error during the test
  expect(messages).toStrictEqual([])
})
