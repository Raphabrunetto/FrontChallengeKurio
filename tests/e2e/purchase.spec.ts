
import { test, expect } from '@playwright/test'

const createTestUser = () => ({
    name: 'Colecionador Teste',
    email: `purchase-${Date.now()}@kurio.test`,
    password: 'Kurio123456',
})

test.describe('Fluxo de compra', () => {
    test('deve comprar um NFT utilizando PIX e aplicar um cupom', async ({ page }) => {

        const user = createTestUser()

        // Cria uma conta para o teste
        await page.goto('/register')

        await page.getByLabel('Nome').fill(user.name)
        await page.getByLabel('E-mail').fill(user.email)
        await page.getByLabel('Senha').fill(user.password)

        await page.getByRole('button', {
            name: 'Criar minha conta',
        }).click()

        await expect(page).toHaveURL(/\/account$/)
        // 1. Acessa o catálogo
        await page.goto('/')

        // 2. Abre os detalhes do NFT
        await page.getByText('Golden Ape').first().click()

        await expect(
            page.getByRole('heading', { name: 'Golden Ape' })
        ).toBeVisible()

        // 3. Adiciona o NFT ao carrinho
        await page.getByRole('button', {
            name: /adicionar ao carrinho/i,
        }).click()

        await expect(
            page.getByRole('status')
        ).toContainText('NFT adicionado ao carrinho!')

        // 4. Acessa o carrinho
        await page.goto('/cart')

        await expect(page.locator('body')).toContainText('Golden Ape')

        // 5. Aplica o cupom
        await page.getByLabel('Cupom de desconto').fill('KURIO10')
        await page.getByRole('button', { name: 'Aplicar' }).click()

        await expect(
            page.getByText('KURIO10', { exact: true })
        ).toBeVisible()

        await expect(
            page.getByRole('status')
        ).toContainText('Cupom KURIO10 aplicado com sucesso!')

        // 6. Vai para o checkout
        await page.getByRole('button', {
            name: 'Ir para checkout',
        }).click()

        console.log('URL após clicar em checkout:', page.url())

        await page.screenshot({
            path: 'test-results/checkout-debug.png',
            fullPage: true,
        })

        await expect(page).toHaveURL(/\/checkout$/)

        console.log('URL atual:', page.url())
        console.log('Título da página:', await page.title())

        await expect(
            page.getByRole('heading', { name: 'Perfil do colecionador' })
        ).toBeVisible()

        // 7. Preenche os dados do colecionador
        await page.getByPlaceholder('Seu nome').fill('Colecionador Teste')
        await page.getByPlaceholder('@seuusuario').fill('@colecionador')
        await page.getByPlaceholder('seu@email.com').fill('colecionador@kurio.test')

        // 8. Seleciona PIX
        await page.getByRole('button', { name: /PIX/i }).click()

        // 9. Confirma a compra
        await page.getByRole('button', {
            name: 'Confirmar compra',
        }).click()

        // 10. Confere a confirmação
        await expect(
            page.getByRole('heading', { name: 'Compra realizada!' })
        ).toBeVisible()

        await expect(page.locator('body')).toContainText('Golden Ape')
        await expect(page.locator('body')).toContainText('PIX (simulado)')
        await expect(page.locator('body')).toContainText('KURIO10')
    })
})
