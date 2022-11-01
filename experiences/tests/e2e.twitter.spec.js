import { test, expect } from '@playwright/test'

test('twitter full execution', async({ page }) => {
  // Listen for all console events and handle errors, test fail if there is one
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.log(`Error text: "${msg.text()}"`)
      test.fail()
    }
  })
  await page.goto('https://digipower.academy/fr')

  await page.getByRole('link', { name: 'Twitter Expérience' }).click()
  await expect(page).toHaveURL('https://digipower.academy/fr/experience/twitter#load-data')

  await page.frameLocator('iframe').getByRole('button', { name: 'Lire' }).click()

  await page.frameLocator('iframe').getByRole('button', { name: 'Pause' }).click()

  await page.getByLabel('Selectionner des données de test').click()

  await page.getByRole('option', { name: 'twitter-small.zip' }).click()

  await page.getByRole('button', { name: 'Explorer vos données' }).click()
  await expect(page).toHaveURL('https://digipower.academy/fr/experience/twitter#file-explorer')

  await page.getByRole('button').nth(4).click()

  await page.getByText('ad-engagements.js').click()

  await page.getByRole('tab', { name: 'Brut' }).click()

  await page.getByRole('tab', { name: 'Schéma' }).click()

  await page.getByRole('tab', { name: 'Vue d\'ensemble des publicités' }).click()
  await expect(page).toHaveURL('https://digipower.academy/fr/experience/twitter#overview')

  await page.getByRole('tab', { name: 'Vue d\'ensemble des publicités (du mois dernier)' }).click()
  await expect(page).toHaveURL('https://digipower.academy/fr/experience/twitter#overview-last-month')

  await page.getByRole('tab', { name: 'Vue d\'ensemble des publicités (du mois dernier)' }).click()

  await page.getByRole('tab', { name: 'Principaux publicitaires' }).click()
  await expect(page).toHaveURL('https://digipower.academy/fr/experience/twitter#ads-per-advertiser')

  await page.getByRole('tab', { name: 'Critères de ciblage (10 principaux publicitaires)' }).click()
  await expect(page).toHaveURL('https://digipower.academy/fr/experience/twitter#targeting-criteria-by-advertiser')

  await page.getByRole('tab', { name: 'Critères de ciblage (10 principaux publicitaires)' }).click()

  await page.getByRole('tab', { name: 'Critères de ciblage (10 principaux publicitaires)' }).click()

  await page.getByRole('tab', { name: 'Critères de ciblage (tous publicitaires)' }).click()
  await expect(page).toHaveURL('https://digipower.academy/fr/experience/twitter#targeting-criteria-all-advertisers')

  await page.getByRole('tab', { name: 'Critères de ciblage (1 publicitaire)' }).click()
  await expect(page).toHaveURL('https://digipower.academy/fr/experience/twitter#all-criteria-all-advertisers')

  await page.getByRole('tab', { name: 'Données supposées' }).click()
  await expect(page).toHaveURL('https://digipower.academy/fr/experience/twitter#personalization')

  await page.getByRole('tab', { name: 'Chronologie' }).click()
  await expect(page).toHaveURL('https://digipower.academy/fr/experience/twitter#genericDateViewer')

  await page.locator('#range-chartgraph_genericDateViewer > svg > g > .brush > .overlay').click()
})
