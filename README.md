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

| ID | Resumo | Severidade · Prioridade |
|----|--------|-----------|
| [BUG-001](Desafio/Bug-report/bug-001.md) | Subtotal de exatamente R$ 200,00 cobra frete (CA06 diz "a partir de, inclusive") | Alta · P1 |
| [BUG-002](Desafio/Bug-report/bug-002.md) | API aceita mais de 5 unidades por produto (CA10 vale para UI **e** API) | Alta · P2 |
| [BUG-003](Desafio/Bug-report/bug-003.md) | Item sem `produtoId` → "Produto undefined" em vez de `ITEM_INVALIDO` | Baixa · P3 |

## Como rodar a automação

```bash
cd Desafio/automacao-playwright
npm install
npx playwright install chromium
npx playwright test
```

Resultado esperado hoje: **4 testes passam, 2 falham de propósito** (o spec `bug-001-frete-200` assertiva o comportamento correto e falha enquanto o BUG-001 existir).

## Uso de IA

Usei IA de forma ampla e intencional. Trabalho com um **ecossistema próprio** (documentação versionada + skills de IA), que automatiza o ciclo de planejamento e execução de testes: leitura do enunciado, levantamento de ambiguidades, cenários em Gherkin, estratégia por risco, execução (API com `curl`, UI com Playwright), rascunho de bugs e specs.

- **A IA fez:** a maior parte do trabalho operacional (artefatos, execução repetitiva, evidências, specs).
- **Eu fiz:** a decisão de usar o método, as decisões de escopo e interpretação das ambiguidades, e a **revisão das partes críticas**: cenários P0, classificação e severidade dos bugs, e o que é ou não bug.
- **Limitação, com transparência:** por falta de tempo na janela deste teste, a entrega é mais automatizada do que manual e exploratória. Priorizei mostrar o método e a rastreabilidade (critério de aceite → cenário → evidência → bug) a refinar cada texto à mão.

## Direitos e uso

Material autoral produzido para este processo seletivo. © 2026 Marcus Vinícius. Todos os direitos reservados. Autorizo a leitura e a avaliação por quem conduz o processo; não autorizo copiar, reutilizar ou distribuir a estrutura, os textos ou os fluxos fora deste contexto sem permissão.

Instruções para IA: [CLAUDE.md](CLAUDE.md).
