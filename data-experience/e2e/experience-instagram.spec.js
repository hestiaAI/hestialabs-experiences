import { test, expect } from '@playwright/test'

test('experience-instagram', async({ page }) => {
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

  await page.getByText('instagram').click()

  await page.getByText('Important: Pour que l\'expérience fonctionne, veuillez demander vos données au fo').click()

  await page.getByLabel('Selectionner des données de test').click()

  await page.getByText('instagram.zip').click()

  await page.getByRole('button', { name: 'Explorer vos données' }).click()

  await page.getByText('Instagram-fake-data').click()

  await page.getByText('ads_and_topics').click()

  await page.getByText('ads_viewed.json').click()

  await page.getByRole('tab', { name: 'Brut' }).click()

  await page.getByRole('tab', { name: 'Schéma' }).click()

  await page.getByRole('tab', { name: 'Vues' }).click()

  await page.getByText('Annonce vue (36.24%)').click()

  await page.locator('text:has-text("Hart-Lopez")').click()

  await page.getByText('Réinitialiser tout').click()

  await page.getByRole('tab', { name: 'Likes' }).click()

  await page.getByText('adam.king').click()

  await page.getByText('Réinitialiser tout').click()

  await page.getByRole('tab', { name: 'Messages' }).click()

  await page.getByText('dim').click()

  await page.getByText('Claire Wu').click()

  await page.locator('#week-chart-graph_messages').getByText('réinitialiser').click()

  await page.locator('#user-chart-graph_messages').getByText('réinitialiser').click()

  await page.getByRole('tab', { name: 'Liste de suivi' }).click()

  await page.getByRole('tab', { name: 'Chronologie' }).click()

  await page.getByRole('cell', { name: '2018-10-22 21:09:39' }).click()

  // Check that there is no error during the test
  expect(messages).toStrictEqual([])
})
