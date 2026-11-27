import { expect, test } from '@playwright/test'

test('detalhes exibe recomendações e os pontos navegam pelo carrossel', async ({ page }) => {
  await page.goto('/nft/nft-001')

  const carousel = page.getByRole('region', { name: 'Mais desta coleção' })
  await expect(carousel).toBeVisible()

  const scroller = carousel.getByRole('region', { name: 'Anúncios recomendados' })
  await expect(scroller.getByRole('link')).toHaveCount(15)

  await carousel.getByRole('button', { name: 'Ir para a posição 3 de 3' }).click()
  await expect.poll(() => scroller.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0)

  await scroller.getByRole('link').first().click()
  await expect(page).toHaveURL(/\/nft\/nft-006$/)
})

test('carrinho recomenda NFTs que ainda não estão no pedido', async ({ page }) => {
  await page.goto('/nft/nft-001')
  await page.getByRole('button', { name: /adicionar ao carrinho/i }).click()
  await expect(page.getByRole('status')).toContainText('NFT adicionado ao carrinho!')

  await page.goto('/cart')

  const carousel = page.getByRole('region', { name: 'Colecionadores também viram' })
  await expect(carousel).toBeVisible()

  const scroller = carousel.getByRole('region', { name: 'Anúncios recomendados' })
  await expect(scroller.getByRole('link')).toHaveCount(15)
  await expect(scroller.getByRole('link', { name: /Golden Ape/ })).toHaveCount(0)
})
