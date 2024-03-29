import { test, expect } from '@playwright/test'

test('experience-apple-tracker', async({ page }) => {
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

  await page.getByRole('button', { name: 'Experience twitter' }).click()

  await page.getByText('apple-tracker').click()

  await page.getByLabel('Selectionner des données de test').click()

  await page.getByRole('option', { name: 'apple-tracker.ndjson' }).locator('div:has-text("apple-tracker.ndjson")').first().click()

  await page.getByRole('button', { name: 'Explorer vos données' }).click()

  await page.getByText('Yes (10.61%)').click()

  await page.locator('#domain-chart-graph_IOSNetwork > svg > g > g:nth-child(3) > rect').click()

  await page.getByText('com.rivergame.worldbattleGlobal').click()

  await page.getByText('Reset All').click()

  await page.getByRole('tab', { name: 'Resource Access' }).click()

  await page.locator('#app-chart-graph_IOSAccess').getByText('com.apple.mobilemail').click()

  await page.getByText('com.apple.mobileslideshow').click()

  await page.getByText('contacts (49.13%)').click()

  await page.locator('#category-chart-graph_IOSAccess').getByText('réinitialiser').click()

  await page.getByText('Réinitialiser tout').click()

  await page.getByRole('cell', { name: 'com.apple.mobilemail' }).click()

  // Check that there is no error during the test
  expect(messages).toStrictEqual([])
})
