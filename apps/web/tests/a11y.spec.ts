import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility', () => {
  test('should not have any automatically detectable accessibility issues on home page', async ({
    page,
  }) => {
    await page.goto('/')

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()

    expect(accessibilityScanResults.violations).toHaveLength(0)
  })

  test('should not have any automatically detectable accessibility issues on react-viz page', async ({
    page,
  }) => {
    await page.goto('/react-viz')

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()

    expect(accessibilityScanResults.violations).toHaveLength(0)
  })
})
