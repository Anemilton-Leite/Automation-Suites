# 🤖 Automation Suites

Suítes de automação de testes, derivadas diretamente dos casos manuais documentados em `test-cases/test_case_login.md`.

## Estrutura sugerida no repositório

```
automation-suites/
├── cypress/
│   ├── e2e/
│   │   └── login.cy.js
│   └── cypress.config.js
├── playwright/
│   ├── tests/
│   │   └── login.spec.js
│   └── playwright.config.js
└── README.md
```

## Cypress

**Instalação:**
```bash
npm install cypress --save-dev
```

**Execução:**
```bash
npx cypress open      # modo interativo
npx cypress run       # modo headless (CI)
```

Arquivo: [`login.cy.js`](./login.cy.js)

## Playwright

**Instalação:**
```bash
npm init playwright@latest
```

**Execução:**
```bash
npx playwright test              # todos os testes
npx playwright test --ui         # modo interativo
npx playwright show-report       # relatório HTML
```

Arquivo: [`login.spec.js`](./login.spec.js)

## Cobertura atual

| Caso | Cypress | Playwright | Origem |
|---|:---:|:---:|---|
| TC-001 — Login válido | ✅ | ✅ | test_case_login.md |
| TC-002 — Senha incorreta | ✅ | ✅ | test_case_login.md |
| TC-003 — E-mail não cadastrado | ✅ | ✅ | test_case_login.md |
| TC-004 — Campos vazios | ✅ | ✅ | test_case_login.md |
| TC-005 — E-mail inválido | ✅ | ✅ | test_case_login.md |
| TC-006 — Rate limiting | ⬜ | ⬜ | pendente (depende de fix do BUG-001) |
| TC-007 — Lembrar-me | ⬜ | ⬜ | pendente |
| TC-008 — Máscara de senha | ✅ | ✅ | test_case_login.md |

## Observações

- Os seletores usam atributos `data-cy` (Cypress) e `data-testid` (Playwright) — ajuste conforme os atributos reais da aplicação sob teste
- TC-006 (rate limiting) foi propositalmente deixado de fora da automação porque o comportamento ainda está com bug aberto (BUG-001); automatizar um teste que já se sabe que falha vira "flaky test" sem valor até o bug ser corrigido
- Próximo passo: integrar essa suíte a um pipeline de CI (GitHub Actions) para rodar a cada push
