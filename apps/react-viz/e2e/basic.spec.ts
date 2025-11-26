import { test, expect } from '@playwright/test'

test('has title', async ({ page }) => {
  await page.goto('/')

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Upfluence Coding Challenge/)
})

test('displays dashboard header', async ({ page }) => {
  await page.goto('/')

  await expect(
    page.getByRole('heading', { name: 'Upfluence Live Stream' }),
  ).toBeVisible()
  await expect(
    page.getByText('Real-time social media post visualization'),
  ).toBeVisible()
})

test('displays connection status', async ({ page }) => {
  await page.goto('/')

  // The connection status might be "Connecting..." initially
  await expect(page.getByRole('status')).toBeVisible()
  await expect(page.getByRole('status')).toHaveText(/Connecting|Live/)
})

test('displays all post type cards', async ({ page }) => {
  await page.goto('/')

  const expectedTitles = [
    'Pin',
    'Instagram Media',
    'Youtube Video',
    'Article',
    'Tweet',
    'Facebook Status',
  ]

  for (const title of expectedTitles) {
    await expect(page.getByRole('heading', { name: title })).toBeVisible()
  }
})
