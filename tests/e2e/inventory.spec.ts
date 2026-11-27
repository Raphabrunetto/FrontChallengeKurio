
import { test, expect } from '@playwright/test'

test('deve atualizar o estoque do NFT após uma compra', async ({ page }) => {
    const user = {
        name: 'Colecionador Teste',
        email: `inventory-${Date.now()}@kurio.test`,
        password: 'Kurio123456',
    }

    // Criar conta
    await page.goto('/register')

    await page.getByLabel('Nome').fill(user.name)
    await page.getByLabel('E-mail').fill(user.email)
    await page.getByLabel('Senha').fill(user.password)

    await page.getByRole('button', {
        name: 'Criar minha conta',
    }).click()

    await expect(page).toHaveURL(/\/account$/)

    // Consultar estoque inicial
    const initialStock = await page.evaluate(() => {
        const inventory = localStorage.getItem('kurio-inventory')
        const parsed = inventory ? JSON.parse(inventory) : {}

        return parsed['nft-001'] ?? 12
    })

    // Adicionar 2 Golden Apes
    await page.goto('/')

    await page.getByText('Golden Ape').first().click()

    await page.getByRole('button', {
        name: /adicionar ao carrinho/i,
    }).click()

    await expect(page.getByRole('status')).toContainText(
        'NFT adicionado ao carrinho!'
    )

    await page.goto('/cart')

    await page.getByRole('button', {
        name: 'Aumentar quantidade de Golden Ape',
    }).click()

    await expect(
        page.getByRole('article').getByText('2', { exact: true })
    ).toBeVisible()

    // Finalizar compra
    await page.getByRole('button', {
        name: 'Ir para checkout',
    }).click()

    await expect(page).toHaveURL(/\/checkout$/)

    await page.getByPlaceholder('Seu nome').fill(user.name)

    await page.getByPlaceholder('@seuusuario').fill(
        `@colecionador${Date.now()}`
    )

    await page.getByPlaceholder('seu@email.com').fill(user.email)

    await page.getByRole('button', {
        name: 'PIX',
    }).click()

    await page.getByRole('button', {
        name: 'Confirmar compra',
    }).click()

    await expect(
        page.getByRole('heading', { name: 'Compra realizada!' })
    ).toBeVisible()

    // Conferir estoque atualizado diretamente pela API
    const updatedNFT = await page.evaluate(async () => {
        const response = await fetch('/api/nfts/nft-001')
        return response.json()
    })

    console.log('Estoque retornado pela API:', updatedNFT.availableEditions)

    expect(updatedNFT.availableEditions).toBe(initialStock - 2)

    // Conferir estoque atualizado no catálogo
    await page.goto('/')

    await page.getByText('Golden Ape').first().click()

    await expect(
        page.getByText(`${initialStock - 2} / 50`, { exact: true })
    ).toBeVisible()
})
