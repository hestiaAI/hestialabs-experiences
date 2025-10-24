import { test, expect } from '@playwright/test'

test('experience-tracker-control', async({ page }) => {
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

  await page.getByRole('option', { name: 'tracker-control' }).getByText('tracker-control').click()

  await page.getByText('Install and enable TrackerControl to monitor the behaviour of the apps on your A').click()

  await page.getByRole('button', { name: 'Selectionner des données de test' }).click()

  await page.getByText('tracker-control.csv').click()

  await page.getByRole('button', { name: 'Explorer vos données' }).click()

  await page.locator('text:has-text("Google")').click()

  await page.locator('.pie-slice-group > g:nth-child(2) > path').click()

  await page.locator('text:has-text("Facebook")').click()

  await page.locator('#category-chart').getByText('réinitialiser').click()

  await page.getByText('Réinitialiser tout').click()

  await page.getByRole('cell', { name: 'ajax.googleapis.com' }).click()

  // Check that there is no error during the test
  expect(messages).toStrictEqual([])
})
