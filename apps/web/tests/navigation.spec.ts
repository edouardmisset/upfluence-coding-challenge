import { test, expect } from '@playwright/test'

const frameworks = [
  {
    name: 'React',
    title: 'Upfluence Live Stream - React',
  },
  {
    name: 'Vue',
    title: 'Upfluence Live Stream - Vue',
  },
  {
    name: 'Svelte',
    title: 'Upfluence Live Stream - Svelte',
  },
  {
    name: 'Preact',
    title: 'Upfluence Live Stream - Preact',
  },
]

test.describe('Navigation', () => {
  for (const framework of frameworks) {
    test(`should navigate to ${framework.name} page and back`, async ({
      page,
    }) => {
      await test.step('Start on home page', async () => {
        await page.goto('')
        await expect(
          page.getByRole('heading', { name: 'Upfluence Coding Challenge' }),
        ).toBeVisible()
      })

      await test.step(`Navigate to ${framework.name} page`, async () => {
        await page
          .getByRole('link', { name: framework.name, exact: true })
          .click()
      })

      await test.step('Check page content', async () => {
        await expect(
          page.getByRole('heading', { name: framework.title }),
        ).toBeVisible()

        await expect(page.getByRole('status')).toBeVisible()
      })

      await test.step('Go back home', async () => {
        await page.getByRole('link', { name: 'Back to home' }).click()
      })

      await test.step('Check we are home', async () => {
        await expect(
          page.getByRole('heading', { name: 'Upfluence Coding Challenge' }),
        ).toBeVisible()
      })
    })
  }
})
