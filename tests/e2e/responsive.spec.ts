import { expect, test } from '@playwright/test'

test('rotas principais não criam rolagem horizontal em telas mobile', async ({ page }) => {
  const widths = [320, 375, 390]
  const user = {
    name: 'Colecionador Mobile',
    email: `mobile-${Date.now()}@kurio.test`,
    password: 'Kurio123456',
  }

  await page.setViewportSize({ width: widths[0], height: 800 })
  await page.goto('/register')
  await page.getByLabel('Nome').fill(user.name)
  await page.getByLabel('E-mail').fill(user.email)
  await page.getByLabel('Senha').fill(user.password)
  await page.getByRole('button', { name: 'Criar minha conta' }).click()
  await expect(page).toHaveURL(/\/account$/)

  await page.goto('/nft/nft-001')
  await page.getByRole('button', { name: /adicionar ao carrinho/i }).click()

  const routes = [
    '/login',
    '/register',
    '/account',
    '/',
    '/nft/nft-001',
    '/cart',
    '/checkout',
  ]

  for (const width of widths) {
    await page.setViewportSize({ width, height: 800 })

    for (const route of routes) {
      await page.goto(route)
      await expect(page.locator('body')).not.toBeEmpty()

      const dimensions = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        content: document.documentElement.scrollWidth,
        overflowing: [...document.querySelectorAll<HTMLElement>('*')]
          .map((element) => ({
            tag: element.tagName.toLowerCase(),
            className: typeof element.className === 'string' ? element.className : '',
            right: Math.round(element.getBoundingClientRect().right),
            width: Math.round(element.getBoundingClientRect().width),
          }))
          .filter((element) => element.right > document.documentElement.clientWidth + 1)
          .slice(0, 5),
      }))

      expect(
        dimensions.content,
        `${route} overflowed at ${width}px (${dimensions.content}px content width): ${JSON.stringify(dimensions.overflowing)}`,
      ).toBeLessThanOrEqual(dimensions.viewport)
    }
  }
})
