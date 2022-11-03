import { test, expect } from '@playwright/test'

test('experience-twitter', async({ page }) => {
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

  await page.getByRole('button', { name: 'Experience twitter' }).click()

  await page.getByRole('option', { name: 'twitter' }).locator('div:has-text("twitter")').first().click()

  await page.getByLabel('Selectionner des données de test').click()

  await page.getByRole('option', { name: 'twitter-small.zip' }).click()

  await page.locator('.v-card__text > div:nth-child(2) > div').click()

  await page.getByRole('button', { name: 'Explorer vos données' }).click()

  await page.getByText('data').click()

  await page.getByText('ad-engagements.js').click()

  await page.getByRole('tab', { name: 'Brut' }).click()

  await page.getByRole('tab', { name: 'Schéma' }).click()

  await page.getByText('ad-impressions.js').click()

  await page.getByRole('tab', { name: 'Brut' }).click()

  await page.getByRole('tab', { name: 'Joli' }).click()

  await page.getByText('personalization.js').click()

  await page.getByRole('tab', { name: 'Brut' }).click()

  await page.getByRole('tab', { name: 'Schéma' }).click()

  await page.getByRole('tab', { name: 'Vue d\'ensemble des publicités' }).click()

  await page.getByRole('tab', { name: 'Vue d\'ensemble des publicités (du mois dernier)' }).click()

  await page.getByRole('tab', { name: 'Principaux publicitaires' }).click()

  await page.getByRole('tab', { name: 'Principaux publicitaires' }).click()

  await page.getByRole('tab', { name: 'Critères de ciblage (10 principaux publicitaires)' }).click()

  await page.getByRole('tab', { name: 'Critères de ciblage (tous publicitaires)' }).click()

  await page.getByRole('tab', { name: 'Critères de ciblage (1 publicitaire)' }).click()

  await page.getByRole('tab', { name: 'Données supposées' }).click()

  await page.getByRole('tab', { name: 'Chronologie' }).click()

  await page.locator('div[role="tablist"]:has-text("Charger vos données Fichiers Vue d\'ensemble des publicités Vue d\'ensemble des pu")').click()

  await page.getByRole('tab', { name: 'Critères de ciblage (1 publicitaire)' }).click()

  await page.getByRole('row', { name: 'Binance 1003' }).locator('div').nth(2).click()

  // Check that there is no error during the test
  expect(messages).toStrictEqual([])
})
