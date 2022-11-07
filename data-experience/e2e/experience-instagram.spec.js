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

  await page.getByLabel('Experience').click()

  await page.getByText('instagram').click()

  await page.getByLabel('Selectionner des données de test').click()

  await page.getByText('instagram.zip').click()

  await page.getByRole('button', { name: 'Explorer vos données' }).click()

  await page.getByRole('tab', { name: 'Vues' }).click()

  await page.getByText('Ramirez Group').click()

  await page.locator('#top-chart-graph_views').getByText('réinitialiser').click()

  await page.getByText('Réinitialiser tout').click()

  await page.getByRole('tab', { name: 'Likes' }).click()

  await page.getByText('adam.king').click()

  await page.getByText('Réinitialiser tout').click()

  await page.getByRole('tab', { name: 'Messages' }).click()

  await page.getByText('Tracy Leon').click()

  await page.locator('text:has-text("ven")').click()

  await page.getByText('Réinitialiser tout').click()

  await page.getByRole('tab', { name: 'Liste de suivi' }).click()

  await page.getByLabel('Intervalle').click()

  await page.getByText('Liste de suivi').nth(4).click()

  await page.getByRole('tab', { name: 'Chronologie' }).click()

  await page.getByRole('textbox', { name: 'Intervalle' }).click()

  await page.getByText('Semaines').click()

  await page.getByText('De janvier 01, 2008 à novembre 03, 2022 nous avons trouvé 2926 événements datés').click()

  // Check that there is no error during the test
  expect(messages).toStrictEqual([])
})
