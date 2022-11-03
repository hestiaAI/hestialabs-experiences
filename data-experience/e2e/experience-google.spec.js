import { test, expect } from '@playwright/test'

test('experience-google', async({ page }) => {
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

  await page.getByRole('option', { name: 'google' }).getByText('google').click()

  await page.getByLabel('Selectionner des données de test').click()

  await page.getByRole('option', { name: 'google-takeout.zip' }).locator('div:has-text("google-takeout.zip")').first().click()

  await page.getByRole('button', { name: 'Explorer vos données' }).click()

  await page.getByText('Nous avons trouvé 54 endroits visités dans votre/vos fichier(s).').click()

  await page.getByRole('tab', { name: 'Un endroit particulier' }).click()

  await page.getByText('Temps total passé à Rue du Petit-Saint-Jean 5: 513h29m22s. Temps moyen passé à R').click()

  await page.getByRole('button', { name: 'Endroit Rue du Petit-Saint-Jean 5' }).click()

  await page.locator('#OnePlace').getByText('Un endroit particulier').click()

  await page.getByRole('tab', { name: 'Autres candidats' }).click()

  await page.getByRole('tab', { name: 'Trajets' }).click()

  await page.getByRole('tab', { name: 'Historique' }).click()

  await page.getByRole('tab', { name: 'Wifi' }).click()

  // Check that there is no error during the test
  expect(messages).toStrictEqual([])
})
