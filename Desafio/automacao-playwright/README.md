# Automação Playwright — VZS-142

Três specs, um por escolha de cenário (cada spec cita o cenário de [base.md](../Cenarios/base.md) no topo):

| Spec | Cenário/CT | Tipo | Hoje |
|------|-----------|------|------|
| `tests/cupom-caminho-feliz.spec.ts` | Cenário 1 · CT01 | Caminho feliz (UI) | ✅ passa |
| `tests/api-calcular-contrato.spec.ts` | Cenário 10 · CT20 (+CT22/CT23) | Candidato marcado 🤖 (API) | ✅ passa |
| `tests/bug-001-frete-200.spec.ts` | Cenário 5 · CT09 | Regressão do [BUG-001](../Bug-report/bug-001.md) (API + UI) | ❌ falha até o bug ser corrigido (esperado) |

## Rodar

```bash
npm install
npx playwright install chromium
npx playwright test            # todos
npx playwright test cupom      # um spec
npx playwright show-report     # relatório HTML
```

A URL da loja está em `playwright.config.ts` (`baseURL`). Os seletores usam papéis/nomes acessíveis e o atributo `data-valor` do Resumo do pedido. Ambiente compartilhado: cada teste usa o próprio carrinho (por aba), então não há interferência.

## Pasta `exploracao/`

Scripts usados na execução manual/exploratória (geram os prints e logs de [Evidencias](../Evidencias/)); não são specs:
`e2-ui-bateria.mjs` (UI), `e3-oraculo-api.mjs` (300 carrinhos comparados em centavos), `e4-checkout.mjs`, `e5-extra.mjs`. Rodar a partir desta pasta: `node exploracao/e2-ui-bateria.mjs`.
