/**
 * Automation Suite — Login / Autenticação
 * Ferramenta: Playwright
 * Autor: Anemilton Leite
 *
 * Casos automatizados a partir da suíte manual (test_case_login.md):
 * - TC-001, TC-002, TC-003, TC-004, TC-005
 *
 * Pré-requisitos:
 *   npm init playwright@latest
 *   npx playwright test
 */

const { test, expect } = require('@playwright/test');

const VALID_EMAIL = process.env.VALID_EMAIL || 'usuario@teste.com';
const VALID_PASSWORD = process.env.VALID_PASSWORD || 'Senha@123';

test.describe('Login / Autenticação', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('TC-001: login com credenciais válidas', async ({ page }) => {
    await page.getByTestId('email-input').fill(VALID_EMAIL);
    await page.getByTestId('password-input').fill(VALID_PASSWORD);
    await page.getByTestId('login-button').click();

    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.getByTestId('welcome-message')).toBeVisible();
  });

  test('TC-002: senha incorreta exibe erro genérico', async ({ page }) => {
    await page.getByTestId('email-input').fill(VALID_EMAIL);
    await page.getByTestId('password-input').fill('SenhaErrada1');
    await page.getByTestId('login-button').click();

    const errorMessage = page.getByTestId('error-message');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('E-mail ou senha inválidos');
    await expect(page).toHaveURL(/.*login/);
  });

  test('TC-003: e-mail não cadastrado exibe erro genérico', async ({ page }) => {
    await page.getByTestId('email-input').fill('naoexiste@teste.com');
    await page.getByTestId('password-input').fill('QualquerSenha1');
    await page.getByTestId('login-button').click();

    await expect(page.getByTestId('error-message')).toContainText('E-mail ou senha inválidos');
  });

  test('TC-004: campos obrigatórios vazios bloqueiam envio', async ({ page }) => {
    await page.getByTestId('login-button').click();

    const emailInput = page.getByTestId('email-input');
    const validationMessage = await emailInput.evaluate((el) => el.validationMessage);
    expect(validationMessage).not.toBe('');
    await expect(page).toHaveURL(/.*login/);
  });

  test('TC-005: formato de e-mail inválido não dispara requisição', async ({ page }) => {
    let requestFired = false;
    page.on('request', (req) => {
      if (req.url().includes('/auth/login')) requestFired = true;
    });

    await page.getByTestId('email-input').fill('usuarioteste.com');
    await page.getByTestId('password-input').fill(VALID_PASSWORD);
    await page.getByTestId('login-button').click();

    expect(requestFired).toBe(false);
    await expect(page.getByTestId('email-error')).toBeVisible();
  });

  test('TC-008: campo de senha é mascarado por padrão', async ({ page }) => {
    const passwordInput = page.getByTestId('password-input');
    await passwordInput.fill('QualquerValor');
    await expect(passwordInput).toHaveAttribute('type', 'password');

    await page.getByTestId('toggle-password-visibility').click();
    await expect(passwordInput).toHaveAttribute('type', 'text');
  });
});
