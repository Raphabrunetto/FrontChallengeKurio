
import { test, expect } from '@playwright/test'

const createTestUser = () => ({
  name: 'Colecionador Teste',
  email: `playwright-${Date.now()}-${Math.random().toString(36).slice(2)}@kurio.test`,
  password: 'Kurio123456',
})

test.describe('Autenticação', () => {
  test('deve carregar a página inicial', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('body')).toContainText('Golden Ape')
  })

  test('deve redirecionar visitante ao tentar acessar a conta', async ({ page }) => {
    await page.goto('/account')

    await expect(page).toHaveURL(/\/login$/)
    await expect(
      page.getByRole('heading', { name: 'Bem-vindo de volta' })
    ).toBeVisible()
  })

  test('deve exibir o formulário de login', async ({ page }) => {
    await page.goto('/login')

    await expect(page.getByLabel('E-mail')).toBeVisible()
    await expect(page.getByLabel('Senha')).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Entrar' })
    ).toBeVisible()
  })

  test('deve cadastrar um novo colecionador', async ({ page }) => {
    const user = createTestUser()

    await page.goto('/register')

    await page.getByLabel('Nome').fill(user.name)
    await page.getByLabel('E-mail').fill(user.email)
    await page.getByLabel('Senha').fill(user.password)

    await page.getByRole('button', { name: 'Criar minha conta' }).click()

    await expect(page).toHaveURL(/\/account$/)
  })

  test('deve impedir login com credenciais inválidas', async ({ page }) => {
    await page.goto('/login')

    await page.getByLabel('E-mail').fill('naoexiste@kurio.test')
    await page.getByLabel('Senha').fill('SenhaErrada123')

    await page.getByRole('button', { name: 'Entrar' }).click()

    await expect(page).toHaveURL(/\/login$/)
    await expect(page.getByLabel('E-mail')).toBeVisible()
  })

  test('deve realizar login e manter a sessão após atualizar a página', async ({ page }) => {
    const user = createTestUser()

    // Cria uma conta para utilizar no teste de login.
    await page.goto('/register')

    await page.getByLabel('Nome').fill(user.name)
    await page.getByLabel('E-mail').fill(user.email)
    await page.getByLabel('Senha').fill(user.password)

    await page.getByRole('button', { name: 'Criar minha conta' }).click()

    await expect(page).toHaveURL(/\/account$/)

    // Realiza login com a conta criada.
    await page.goto('/login')

    await page.getByLabel('E-mail').fill(user.email)
    await page.getByLabel('Senha').fill(user.password)

    await page.getByRole('button', { name: 'Entrar' }).click()

    await expect(page).toHaveURL(/\/account$/)

    // Atualiza a página para verificar a persistência da sessão.
    await page.reload()

    await expect(page).toHaveURL(/\/account$/)
  })
})
