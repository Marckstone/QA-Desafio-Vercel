# QA-Desafio-Vercel — Teste técnico QA Júnior (Verzel Store, card VZS-142)

Validação da entrega **VZS-142 — cupom de desconto e frete grátis** da Verzel Store, usando um método de *Living Docs + BDD + testes baseados em risco*, versionado em Git.

- Loja: https://verzel-store.qa-test-verzel-store.workers.dev/ · Documentação: `/documentacao` · API: `/api`
- Resultado: **45 casos de teste, 3 bugs** (2 de severidade Alta, 1 Baixa) e **3 specs de automação** com Playwright.

## Onde encontrar cada entrega

| Entrega do enunciado | Onde está |
|----------------------|-----------|
| Cenários de teste (Gherkin, PT) | [Desafio/Cenarios/base.md](Desafio/Cenarios/base.md) — 14 cenários, 45 CTs; 🤖 = candidato a automação, ✱ = automatizado |
| Contexto e decisões de escopo/ambiguidades | [Desafio/INDICE.md](Desafio/INDICE.md) (tabela **Decisões de Escopo**), [Descricao](Desafio/Descricao/descricao.md), [Estrategia por risco](Desafio/Estrategia/estrategia.md) |
| Execução e resultado de cada cenário | [Desafio/Evidencias/evidencias.md](Desafio/Evidencias/evidencias.md) |
| Report de bugs | [Desafio/Bug-report/](Desafio/Bug-report/README.md) — BUG-001, BUG-002, BUG-003 |
| Documento de evidências | [Desafio/Evidencias/](Desafio/Evidencias/) — `api/` (requisição + resposta), `ui/` (prints e logs) |
| Automação Playwright | [Desafio/automacao-playwright/](Desafio/automacao-playwright/README.md) |
| Enunciado (texto) | [Enunciado/enunciado.md](Enunciado/enunciado.md) |
| Estado atual | [Desafio/STATUS.md](Desafio/STATUS.md) |

## Resumo dos bugs

| ID | Resumo | Severidade |
|----|--------|-----------|
| [BUG-001](Desafio/Bug-report/bug-001.md) | Subtotal de exatamente R$ 200,00 cobra frete (CA06 diz "a partir de, inclusive") | Alta |
| [BUG-002](Desafio/Bug-report/bug-002.md) | API aceita mais de 5 unidades por produto (CA10 vale para UI **e** API) | Alta |
| [BUG-003](Desafio/Bug-report/bug-003.md) | Item sem `produtoId` → "Produto undefined" em vez de `ITEM_INVALIDO` | Baixa |

## Como rodar a automação

```bash
cd Desafio/automacao-playwright
npm install
npx playwright install chromium
npx playwright test
```

Resultado esperado hoje: **4 testes passam, 2 falham de propósito** (o spec `bug-001-frete-200` assertiva o comportamento correto e falha enquanto o BUG-001 existir).

## Uso de IA (para o formulário de envio)

Usei o Claude Code com um ecossistema próprio de documentação e skills (`qa-planning`, `salvar-status`), do mesmo método que uso no trabalho. Fluxo: a IA leu o enunciado e a documentação, levantou ambiguidades e eu decidi as interpretações (INDICE → Decisões de Escopo); a IA gerou os artefatos, executou API (curl) e UI (Playwright), escreveu os specs e os bug reports. Eu revisei os cenários, as severidades e as decisões de classificação (bug ou não). As decisões de escopo e a classificação são minhas; os rascunhos e a execução repetitiva foram da IA.

Instruções para IA: [CLAUDE.md](CLAUDE.md).
