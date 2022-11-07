import { test, expect } from '@playwright/test'

test('experience-tinder', async({ page }) => {
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

  await page.getByRole('option', { name: 'tinder' }).getByText('tinder').click()

  await page.getByLabel('Selectionner des données de test').click()

  await page.getByText('tinder.json').click()

  await page.getByRole('button', { name: 'Explorer vos données' }).click()

  await page.getByRole('tab', { name: 'Usage' }).click()

  await page.getByRole('tab', { name: 'Likes et passes' }).click()

  await page.getByLabel('Intervalle').click()

  await page.getByText('Semaines').click()

  await page.getByRole('tab', { name: 'Messages' }).click()

  await page.locator('.calendar-hour > g:nth-child(48) > rect').click()

  await page.getByRole('tab', { name: 'Comparaison' }).click()

  await page.locator('select[name="versus"]').selectOption('Likes,App ouverte')

  await page.getByRole('tab', { name: 'Corrélation Likes / passes' }).click()

  await page.locator('div[role="tablist"]:has-text("Charger vos données Informations utilisat·eur·rice Usage Likes et passes Message")').click()

  // Check that there is no error during the test
  expect(messages).toStrictEqual([])
})
