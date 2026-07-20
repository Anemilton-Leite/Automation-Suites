/**
 * Automation Suite — Login / Autenticação
 * Ferramenta: Cypress
 * Autor: Anemilton Leite
 *
 * Casos automatizados a partir da suíte manual (test_case_login.md):
 * - TC-001: Login com credenciais válidas
 * - TC-002: Login com senha incorreta
 * - TC-003: Login com e-mail não cadastrado
 * - TC-004: Campos obrigatórios vazios
 * - TC-005: Formato de e-mail inválido
 *
 * Pré-requisitos:
 *   npm install cypress --save-dev
 *   npx cypress open
 *
 * Variáveis de ambiente esperadas (cypress.config.js -> env):
 *   baseUrl, validEmail, validPassword
 */

describe('Login / Autenticação', () => {
  const validEmail = Cypress.env('validEmail') || 'usuario@teste.com';
  const validPassword = Cypress.env('validPassword') || 'Senha@123';

  beforeEach(() => {
    cy.visit('/login');
  });

  it('TC-001: deve logar com sucesso usando credenciais válidas', () => {
    cy.get('[data-cy=email-input]').type(validEmail);
    cy.get('[data-cy=password-input]').type(validPassword);
    cy.get('[data-cy=login-button]').click();

    // Espera redirecionamento para o dashboard
    cy.url().should('include', '/dashboard');
    cy.get('[data-cy=welcome-message]').should('be.visible');
  });

  it('TC-002: deve exibir erro genérico ao informar senha incorreta', () => {
    cy.get('[data-cy=email-input]').type(validEmail);
    cy.get('[data-cy=password-input]').type('SenhaErrada1');
    cy.get('[data-cy=login-button]').click();

    cy.get('[data-cy=error-message]')
      .should('be.visible')
      .and('contain.text', 'E-mail ou senha inválidos');

    // Não deve conter mensagem específica indicando qual campo está errado
    cy.get('[data-cy=error-message]').should('not.contain.text', 'senha incorreta');
    cy.url().should('include', '/login');
  });

  it('TC-003: deve exibir erro genérico ao informar e-mail não cadastrado', () => {
    cy.get('[data-cy=email-input]').type('naoexiste@teste.com');
    cy.get('[data-cy=password-input]').type('QualquerSenha1');
    cy.get('[data-cy=login-button]').click();

    cy.get('[data-cy=error-message]')
      .should('be.visible')
      .and('contain.text', 'E-mail ou senha inválidos');
  });

  it('TC-004: deve bloquear envio com campos obrigatórios vazios', () => {
    cy.get('[data-cy=login-button]').click();

    cy.get('[data-cy=email-input]')
      .then(($input) => {
        expect($input[0].validationMessage).to.not.be.empty;
      });

    cy.url().should('include', '/login');
  });

  it('TC-005: deve validar formato de e-mail inválido antes de enviar', () => {
    cy.get('[data-cy=email-input]').type('usuarioteste.com');
    cy.get('[data-cy=password-input]').type(validPassword);

    cy.intercept('POST', '**/auth/login').as('loginRequest');

    cy.get('[data-cy=login-button]').click();

    // A requisição não deve ser disparada, pois a validação é client-side
    cy.get('@loginRequest.all').should('have.length', 0);
    cy.get('[data-cy=email-error]').should('be.visible');
  });

  it('TC-008: deve mascarar o campo de senha por padrão', () => {
    cy.get('[data-cy=password-input]')
      .type('QualquerValor')
      .should('have.attr', 'type', 'password');

    // Verifica alternância ao clicar no ícone de "mostrar senha"
    cy.get('[data-cy=toggle-password-visibility]').click();
    cy.get('[data-cy=password-input]').should('have.attr', 'type', 'text');
  });
});
