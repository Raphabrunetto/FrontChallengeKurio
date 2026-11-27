
import { test, expect } from '@playwright/test'

const createTestUser = () => ({
    name: 'Colecionador Teste',
    email: `cart-${Date.now()}-${Math.random().toString(36).slice(2)}@kurio.test`,
    password: 'Kurio123456',
})

async function registerAndLogin(page: import('@playwright/test').Page) {
    const user = createTestUser()

    await page.goto('/register')

    await page.getByLabel('Nome').fill(user.name)
    await page.getByLabel('E-mail').fill(user.email)
    await page.getByLabel('Senha').fill(user.password)

    await page.getByRole('button', { name: 'Criar minha conta' }).click()

    await expect(page).toHaveURL(/\/account$/)

    return user
}

async function addGoldenApeToCart(page: import('@playwright/test').Page) {
    await page.goto('/')

    await page.getByText('Golden Ape').first().click()

    await expect(
        page.getByRole('heading', { name: 'Golden Ape' })
    ).toBeVisible()

    await page.getByRole('button', {
        name: /adicionar ao carrinho/i,
    }).click()

    await expect(
        page.getByRole('status')
    ).toContainText('NFT adicionado ao carrinho!')

    await page.goto('/cart')

    await expect(page.locator('body')).toContainText('Golden Ape')
}

test.describe('Carrinho de compras', () => {
    test.beforeEach(async ({ page }) => {
        await registerAndLogin(page)
        await addGoldenApeToCart(page)
    })


    test('deve aumentar a quantidade de um NFT', async ({ page }) => {
        const nftCard = page.getByRole('article')

        await page.getByRole('button', {
            name: 'Aumentar quantidade de Golden Ape',
        }).click()

        await expect(
            nftCard.getByText('2', { exact: true })
        ).toBeVisible()
    })

    test('deve diminuir a quantidade de um NFT', async ({ page }) => {
        const nftCard = page.getByRole('article')

        await page.getByRole('button', {
            name: 'Aumentar quantidade de Golden Ape',
        }).click()

        await expect(
            nftCard.getByText('2', { exact: true })
        ).toBeVisible()

        await page.getByRole('button', {
            name: 'Diminuir quantidade de Golden Ape',
        }).click()

        await expect(
            nftCard.getByText('1', { exact: true })
        ).toBeVisible()
    })


    test('deve remover um NFT do carrinho', async ({ page }) => {
        await page.getByRole('button', {
            name: 'Remover Golden Ape do carrinho',
        }).click()

        await expect(
            page.getByText('Golden Ape', { exact: true })
        ).toHaveCount(0)

        await expect(
            page.getByText(/seu carrinho está vazio/i)
        ).toBeVisible()
    })

    test('deve limpar todos os itens do carrinho', async ({ page }) => {
        await page.getByRole('button', {
            name: 'Limpar carrinho',
        }).click()

        await expect(
            page.getByText(/seu carrinho está vazio/i)
        ).toBeVisible()
    })


    test('deve impedir aumentar a quantidade acima do estoque', async ({ page }) => {
        const nftCard = page.getByRole('article')

        // Golden Ape começa com 1 unidade no carrinho.
        // Vamos adicionar até atingir as 12 unidades disponíveis.
        for (let quantity = 1; quantity < 12; quantity++) {
            await page.getByRole('button', {
                name: 'Aumentar quantidade de Golden Ape',
            }).click()
        }

        await expect(
            nftCard.getByText('12', { exact: true })
        ).toBeVisible()

        // O botão deve ficar desabilitado ao atingir o estoque.
        await expect(
            page.getByRole('button', {
                name: 'Aumentar quantidade de Golden Ape',
            })
        ).toBeDisabled()
    })

    test('a API deve rejeitar uma quantidade acima do estoque', async ({ page }) => {
        const response = await page.evaluate(async () => {
            const result = await fetch('/api/cart/items/nft-001', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quantity: 13 }),
            })

            return {
                status: result.status,
                body: await result.json(),
            }
        })

        expect(response.status).toBe(409)
        expect(response.body.message).toBe(
            'Quantidade indisponível em estoque.'
        )
    })

})
