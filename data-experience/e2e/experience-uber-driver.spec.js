import { test, expect } from '@playwright/test'

test('experience-uber-driver', async({ page }) => {
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

  await page.getByText('uber-driver').click()

  await page.getByLabel('Selectionner des données de test').click()

  await page.getByText('uber-driver.zip').click()

  await page.getByRole('button', { name: 'Explorer vos données' }).click()

  await page.getByRole('tab', { name: 'Driver Points' }).click()

  await page.getByRole('tab', { name: 'Driver Payments' }).click()

  await page.getByRole('tab', { name: 'Rider Trips' }).click()

  await page.getByRole('tab', { name: 'Rider Points' }).click()

  await page.getByRole('tab', { name: 'Driver Time Lost' }).click()

  await page.getByRole('tab', { name: 'Accounting (Mockup)' }).click()

  await page.getByText('This feature is still under construction').click()

  // Check that there is no error during the test
  expect(messages).toStrictEqual([])
})
