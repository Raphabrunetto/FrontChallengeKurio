
import { test, expect } from '@playwright/test'

const createTestUser = () => ({
  name: 'Colecionador Teste',
  email: `history-${Date.now()}-${Math.random().toString(36).slice(2)}@kurio.test`,
  password: 'Kurio123456',
})

test('deve registrar e exibir uma compra no histórico do colecionador', async ({
  page,
}) => {
  const user = createTestUser()

  // 1. Criar conta
  await page.goto('/register')

  await page.getByLabel('Nome').fill(user.name)
  await page.getByLabel('E-mail').fill(user.email)
  await page.getByLabel('Senha').fill(user.password)

  await page.getByRole('button', { name: /criar minha conta/i }).click()

  await expect(page).toHaveURL(/\/account/)

  // 2. Abrir o marketplace
  await page.goto('/')

  await page.getByText('Golden Ape').first().click()

  await expect(
    page.getByRole('heading', { name: 'Golden Ape' }),
  ).toBeVisible()

  // 3. Adicionar NFT ao carrinho
  await page.getByRole('button', {
    name: /adicionar ao carrinho/i,
  }).click()

  await expect(
    page.getByRole('status').filter({
      hasText: 'NFT adicionado ao carrinho!',
    }),
  ).toBeVisible()

  // 4. Abrir carrinho
  await page.goto('/cart')

  await expect(page.getByText('Golden Ape').first()).toBeVisible()

  // 5. Ir para checkout
  await page.getByRole('button', {
    name: /ir para checkout/i,
  }).click()

  await expect(page).toHaveURL(/\/checkout/)

  // 6. Preencher perfil do colecionador
  await page.getByPlaceholder('Seu nome').fill(user.name)

  await page.getByPlaceholder('@seuusuario').fill(
    `@colecionador${Date.now()}`,
  )

  await page.getByPlaceholder('seu@email.com').fill(user.email)

  // 7. Selecionar PIX e confirmar compra
  await page.getByRole('button', { name: 'PIX' }).click()

  await page.getByRole('button', {
    name: /confirmar compra/i,
  }).click()

  await expect(
    page.getByRole('heading', { name: 'Compra realizada!' }),
  ).toBeVisible()

  // 8. Acessar conta do colecionador
  await page.goto('/account')

  await expect(
    page.getByRole('heading', { name: 'Histórico de compras' }),
  ).toBeVisible()

  // 9. Validar os dados do pedido
  const order = page.locator('article').filter({
    hasText: 'Golden Ape × 1',
  })

  await expect(order).toBeVisible()
  await expect(order.getByText('PIX (simulado)')).toBeVisible()
  await expect(order.getByText('1.265 ETH')).toBeVisible()

  // 10. Validar indicadores da conta
  await expect(
    page.getByText('Compras realizadas'),
  ).toBeVisible()

  await expect(
    page.getByText('NFTs adquiridos'),
  ).toBeVisible()

  // 11. Atualizar a página e conferir persistência
  await page.reload()

  await expect(
    page.getByRole('heading', { name: 'Histórico de compras' }),
  ).toBeVisible()

  await expect(order).toBeVisible()
  await expect(order.getByText('PIX (simulado)')).toBeVisible()
})
