# Índice — VZS-142 — Cupom de desconto e frete grátis (Verzel Store)

*Ponto central de rastreabilidade do desafio. Ambiente: https://verzel-store.qa-test-verzel-store.workers.dev/ · Versão 2.3.0*

---

## Objetivo e Premissas

Validar a entrega VZS-142 (cupom + frete grátis) em UI e API, reportar bugs e automatizar 3 cenários com Playwright. Premissas: ambiente compartilhado/stateless (ver [Descricao](Descricao/descricao.md)); uso de IA é permitido e será declarado no formulário de envio.

## Gate de Regras-Globais (2026-10-08)

| Arquivo | Aplica-se? | Motivo |
|---------|-----------|--------|
| — (pasta vazia) | n/a | Nenhuma regra global registrada ainda. Candidatas: arredondamento a 2 casas e "comportamentos esperados do ambiente" — criar `regra-*.md` quando confirmadas na execução. |

---

## Decisões de Escopo

| # | Ambiguidade | Decisão (interpretação) | Justificativa |
|---|-------------|--------------------------|---------------|
| D1 | Como executar | IA executa UI (navegador embutido) e API; itens manuais pontuais ficam com o Marcus | Pedido do usuário (2026-10-08) |
| D2 | CA02: espaço no meio do código (`BEM VINDO10`) | Tratado como cupom **inválido**; só espaços nas pontas são ignorados | O CA diz "início e fim". Se a loja aceitar, registro como observação, não bug |
| D3 | CA11: método de arredondamento não definido | Esperado "metade para cima" a 2 casas; foco em artefatos de ponto flutuante | Preços são múltiplos de R$ 0,10, então meio-centavo não ocorre com BEMVINDO10 |
| D4 | Comportamento duvidoso | Contraria CA literal → bug. Lacuna da doc → registro interpretação e sigo | Regra "Ambiguidades" do desafio + escolha do usuário |
| D5 | CA05 na API | "Um cupom por vez" é verificado só na UI; `/calcular` aceita apenas um campo `cupom` | Contrato da API |
| D6 | Gherkin | Português, ~45 CTs agrupados por tipo | Enunciado em PT |
| D7 | Automação | 3 specs: feliz (CT01), candidato 🤖 (CT20), regressão do BUG-001 (CT09). CT10 foi trocado por CT20: depende da fronteira de R$ 200 e falha pelo BUG-001 | Escolha do usuário; ajuste após a execução |
| D8 | Marcação de candidatos a automação | Emoji 🤖 no CT + `✱` quando automatizado; regra adicionada à skill `qa-planning` | Convenção ainda não existia neste repo (corrigida na fonte, na skill) |

---

## Bugs Identificados

| ID | Título | Severidade | Status |
|----|--------|------------|--------|
| BUG-001 | Subtotal de exatamente R$ 200,00 cobra frete (CA06) | Alta | 🔴 Aberto |
| BUG-002 | API não aplica o limite de 5 unidades (CA10) | Alta | 🔴 Aberto |
| BUG-003 | Item sem `produtoId` → "Produto undefined" em vez de `ITEM_INVALIDO` | Baixa | 🔴 Aberto |

---

## Bug → Correção → Causa Raiz

| Bug | Arquivo Bug Report | Arquivo Correção | Causa Raiz |
|-----|-------------------|------------------|------------|
| BUG-001 | [bug-001.md](Bug-report/bug-001.md) | — (sem correção do dev) | Hipótese: comparação `>` no lugar de `>=` no frete |
| BUG-002 | [bug-002.md](Bug-report/bug-002.md) | — | Hipótese: `QUANTIDADE_MAXIMA_EXCEDIDA` não implementada na validação de itens |
| BUG-003 | [bug-003.md](Bug-report/bug-003.md) | — | Hipótese: `produtoId` ausente não é validado antes da busca |

---

## Arquivos e Endpoints Impactados

### VZS-142

| Tipo | Nome | Descrição |
|------|------|-----------|
| **Endpoint** | `GET /api/produtos` | Lista de 8 produtos |
| **Endpoint** | `GET /api/produtos/{id}` | Produto ou 404 |
| **Endpoint** | `POST /api/carrinho/calcular` | Subtotal, desconto, frete, total (stateless) |
| **Endpoint** | `POST /api/pedidos` | 201 `VZ-000000` ou 422 |
| **Tela** | `/`, `/carrinho`, `/documentacao` | Vitrine, carrinho/checkout, regras |

---

## Regras de Negócio Envolvidas

| Regra | Descrição | Arquivo |
|-------|-----------|---------|
| RN001 | Fórmula do total e arredondamento (CA11) | [descricao.md §1](Descricao/descricao.md) |
| RN002 | Cupom (CA01–CA05, CA09) | [descricao.md §2](Descricao/descricao.md) |
| RN003 | Frete grátis e faltante (CA06–CA08) | [descricao.md §3](Descricao/descricao.md) |
| RN004 | Limite de 5 unidades (CA10) | [descricao.md §4](Descricao/descricao.md) |
| RN005 | Regras pré-existentes (cliente) | [descricao.md §5](Descricao/descricao.md) |

---

## Cenários de Validação (P0)

- [x] [P0.1] Cupom BEMVINDO10 (Cenário 1) ✅
- [x] [P0.2] Cupom inválido/expirado na UI (Cenário 3)
- [x] [P0.3] Frete e fronteira R$ 200 (Cenário 5) ❌ BUG-001
- [x] [P0.4] Limite de 5 na UI (Cenário 6)
- [x] [P0.5] Pedido ponta a ponta (Cenário 8)
- [x] [P0.6] `/calcular` (Cenário 10) ❌ BUG-001/BUG-002
- [x] [P0.7] `/pedidos` (Cenário 12) ❌ BUG-002

---

## Pontos de Atenção para Novos Desafios

| Ponto | Origem | Recomendação |
|-------|--------|--------------|
| PDF do enunciado era só imagem (sem texto) | Verzel | Extrair as imagens com `pypdf` e ler; guardar o texto em `Enunciado/` |
| Documentação é SPA (curl não traz conteúdo) | Verzel | Ler via navegador (`get_page_text`) |
| `curl -w '%{http_code}'` falhou neste Windows (erro 43) | Execução | Usar `curl -i`/`-D arquivo` e ler a 1ª linha (ver `Evidencias/api-run.sh`) |
| Mais de um bug na mesma regra de fronteira | VZS-142 | Sempre testar o valor exato (200,00) e os vizinhos; um oráculo em centavos isola divergências |

---

*Última atualização: 10/2026*
*Mantido por: Marcus (QA)*
