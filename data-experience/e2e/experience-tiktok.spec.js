import { test, expect } from '@playwright/test'

test('experience-tiktok', async({ page }) => {
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

  await page.getByText('tiktok').click()

  await page.getByLabel('Selectionner des données de test').click()

  await page.getByText('tiktok.zip').click()

  await page.getByRole('button', { name: 'Explorer vos données' }).click()

  await page.getByText('user_data.json').click()

  await page.getByRole('tab', { name: 'Brut' }).click()

  await page.getByRole('tab', { name: 'Historique des connexions' }).click()

  await page.getByRole('tab', { name: 'Abonnements et abonnés' }).click()

  await page.getByRole('tab', { name: 'Historique de l\'activité' }).click()

  await page.locator('text:has-text("Like")').click()

  await page.locator('#top-chart-graph_activityhistory').getByText('réinitialiser').click()

  await page.getByRole('tab', { name: 'Messages' }).click()

  // Check that there is no error during the test
  expect(messages).toStrictEqual([])
})
