import { test, expect } from '@playwright/test'

test('experience-explorer', async({ page }) => {
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

  await page.getByRole('option', { name: 'explorer' }).getByText('explorer').click()

  await page.getByRole('button', { name: 'naviguer' }).click()

  await page.getByRole('button', { name: 'naviguer' }).setInputFiles('TrackerControl-TheEyeballs-Hestiaphone2.csv')

  await page.getByRole('button', { name: 'Explorer vos données' }).click()

  await page.getByText('Analysé 1 fichier (40.28 kB) et trouvé aucun point de données').click()

  await page.getByRole('tab', { name: 'Chronologie' }).click()

  await page.getByRole('button', { name: 'Intervalle Semaines' }).click()

  await page.getByText('Mois').click()

  await page.getByRole('button', { name: 'Fichiers TrackerContro..' }).click()

  await page.getByRole('menuitem', { name: 'Sélectionner Tout' }).locator('svg').click()

  await page.getByRole('menuitem', { name: 'Sélectionner Tout' }).locator('svg').click()

  await page.getByRole('cell', { name: 'Time : [Uid : 0, Daddr : api16-core-c-useast1a.tiktokv.com, Uncertain : 1, Tracker : ByteDance, Category : Uncategorised, Package : , App : ]' }).click()

  await page.getByRole('tab', { name: 'Observations de localisation' }).click()

  await page.getByText('Aucune donnée pertinente trouvée').click()

  // Check that there is no error during the test
  expect(messages).toStrictEqual([])
})
