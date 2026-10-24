# Evidências da Execução — VZS-142

Execução de 2026-10-08 · Ambiente: https://verzel-store.qa-test-verzel-store.workers.dev (v2.3.0) · Cenários: [base.md](../Cenarios/base.md)

**Legenda:** ✅ Passou · ❌ Falhou (bug) · ⚠ Passou com observação · 
## Resumo

Contagem por CT principal (CT01–CT45; sub-casos como CT03.1 contam dentro do CT-pai):

| Resultado | Qtde | CTs |
|-----------|------|-----|
| ✅ Passou | 36 | demais |
| ⚠ Passou com observação | 4 | CT03, CT24, CT31 (→ BUG-003), CT39 |
| ❌ Falhou | 5 | CT09, CT10, CT25 (BUG-001) · CT28, CT40 (BUG-002) |

Bugs: [BUG-001](../Bug-report/bug-001.md) (Alta, P1) · [BUG-002](../Bug-report/bug-002.md) (Alta, P2) · [BUG-003](../Bug-report/bug-003.md) (Baixa, P3).

## Como foi executado

| Frente | Como | Onde estão as evidências |
|--------|------|--------------------------|
| API | `curl` via [api-run.sh](api-run.sh): cada chamada grava requisição, status e corpo | [api/](api/) (um arquivo por CT) |
| UI | Playwright exploratório (headless Chromium): bateria com leitura do resumo + prints | [ui/](ui/) — `resultados-ui.txt`, `resultados-checkout.txt` e PNGs |
| Cálculo | Oráculo: 292 carrinhos aleatórios recalculados em centavos e comparados com a API | [e3-oraculo-api.mjs](../automacao-playwright/exploracao/e3-oraculo-api.mjs) |
| Automação | 3 specs Playwright: 4 testes passam, 2 falham por desenho (BUG-001) | [playwright-execucao.txt](playwright-execucao.txt) |

Scripts em [automacao-playwright/exploracao/](../automacao-playwright/exploracao/): `e2-ui-bateria.mjs`, `e4-checkout.mjs`, `e5-extra.mjs`.

## Resultado por caso de teste

### Funcionais (UI)

| CT | Resultado | Observado | Evidência |
|----|-----------|-----------|-----------|
| CT01 | ✅ | P002+P004x2 + BEMVINDO10: desconto 23,97, frete Grátis, total 215,73 | [png](ui/CT01-cupom-valido.png) · spec CT01 |
| CT02 | ✅ | P005 + cupom: desc 10,00, frete 19,90, total 109,90 (desconto não incide no frete) | [png](ui/CT02-desconto-sem-frete.png) |
| CT02.1 | ✅ | P001x3: 179,70 / 17,97 / 181,63 (sem artefato de ponto flutuante) | resultados-ui.txt |
| CT03 / 03.1 | ✅ | `bemvindo10`, `BemVindo10`, `  BEMVINDO10  ` aplicados | resultados-ui.txt |
| CT03.2 | ✅ | `BEM VINDO10` → "Cupom inválido." (interpretação D2) | resultados-ui.txt |
| CT03.3 | ⚠ | Vazio e só espaços: não aplica, não quebra; **sem mensagem** na UI. Lacuna da doc, não é bug | resultados-ui.txt |
| CT04 | ✅ | `XPTO123` → "Cupom inválido.", sem desconto | [png](ui/CT04-cupom-invalido.png) |
| CT05 / 05.1 | ✅ | `VERAO2026` → "Cupom expirado."; depois BEMVINDO10 funciona | [png](ui/CT05-cupom-expirado.png) |
| CT06 | ✅ | Com cupom ativo o campo some e aparece "Remover cupom" | resultados-ui.txt |
| CT07 / 07.1 | ✅ | Remover volta ao total sem desconto; trocar para VERAO2026 → expirado | resultados-ui.txt |
| CT08 | ✅ | R$ 100,00: frete 19,90, "Faltam R$ 100,00" | [png](ui/CT08-abaixo-200.png) |
| **CT09** | ❌ **BUG-001** | R$ 200,00: **frete 19,90** e "Faltam R$ 0,00 para o frete grátis" | [png](ui/CT09-fronteira-200-BUG.png) |
| CT09.1 | ✅ | R$ 199,80: frete 19,90, faltam 0,20 | resultados-ui.txt |
| CT09.2 / CT10.2 | ✅ | Acima de 200 (219,80 e 249,70): frete Grátis. **CA08**: 219,80 + cupom → 197,82 mantém frete grátis (API CT10.2) | [CT10.2](api/CT10.2.txt) |
| **CT10** | ❌ **BUG-001** | 200,00 + cupom: frete 19,90, total 199,90 (esperado 180,00) | [png](ui/CT10-200-com-cupom.png) |
| CT10.1 | ✅ | 189,90 + cupom: 190,81 (frete cobrado) | resultados-ui.txt |
| CT11 / 11.1 | ✅ | 5 un. aceitas; "+" desabilitado e "Limite de 5 unidades por produto." | [png](ui/CT11-limite-5.png) |
| CT11.2 | ✅ | Vitrine: botão desabilita após 5 cliques; carrinho fica em 5 | [png](ui/CT11.2-vitrine-limite.png) |
| CT11.3 | ✅ | 5xP004 + 5xP006 = 399,00 coexistem | resultados-ui.txt |
| CT12 / CT13 | ✅ | Linhas, "cada" e totais; −1, remover e esvaziar recalculam; estado vazio | [png](ui/CT13-carrinho-vazio.png) |
| CT14 / 14.1 | ✅ | Cupom persiste ao mudar quantidade e ao recarregar a aba. (Outra aba/anônima vazia = esperado) | resultados-ui.txt |

### Checkout (UI)

| CT | Resultado | Observado | Evidência |
|----|-----------|-----------|-----------|
| CT15 | ✅ | Pedido `VZ-463186`, valores iguais aos do carrinho; carrinho esvaziado depois | [form](ui/CT15-checkout-form.png) · [confirmado](ui/CT15-pedido-confirmado.png) |
| CT16 / 16.1 / 16.2 / 16.3 | ✅ | Nome só "Maria" → "Informe nome e sobrenome."; e-mail inválido; CEP de 7/9 dígitos/letra; campos vazios com mensagem por campo | [png](ui/CT16-nome-invalido.png) · resultados-checkout.txt |
| CT17 | ✅ | Só "O pagamento é feito na entrega."; sem pagamento online | resultados-checkout.txt |

### API

| CT | Resultado | Observado | Evidência |
|----|-----------|-----------|-----------|
| CT18 | ✅ | 200, 8 produtos com id/nome/descricao/categoria/preco | [CT18](api/CT18.txt) |
| CT19 / 19.1 / 19.2 | ✅ | 200; 404 `PRODUTO_NAO_ENCONTRADO`; 404 `ROTA_NAO_ENCONTRADA`; 405 `METODO_NAO_PERMITIDO` | [CT19.1](api/CT19.1.txt) |
| CT20 | ✅ | Idêntico ao exemplo da documentação | [CT20](api/CT20.txt) · spec CT20 |
| CT21 | ✅ | Sem cupom: `cupom: null`, desconto 0 | [CT21](api/CT21.txt) |
| CT22 / CT23 | ✅ | 200 sem desconto, mensagens "Cupom inválido." / "Cupom expirado." | [CT22](api/CT22.txt) · [CT23](api/CT23.txt) |
| CT24 | ⚠ | `" bemVindo10 "` aplicado; `"BEM VINDO10"` inválido. Obs.: `""` → `cupom: null`, mas `"   "` → `cupom.codigo ""` "inválido"; `123` (número) vira `"123"` inválido. Inconsistência menor, sem regra violada | [CT24.x](api/) |
| **CT25** | ❌ **BUG-001** | 200,00 → frete 19,9; 199,80 e 199,60 corretos; 219,80/219,60 grátis | [CT25a](api/CT25a.txt) · [CT25e](api/CT25e.txt) |
| CT26 | ✅ | Valores com no máx. 2 casas (179,7/17,97; 239,4/23,94; 2798,5/279,85). Oráculo: 0 divergências fora de 200,00 | [CT26a](api/CT26a.txt) |
| CT27 | ✅ | Duas chamadas idênticas retornam o mesmo corpo (stateless) | [CT27](api/CT27.txt) |
| **CT28** | ❌ **BUG-002** | `quantidade` 6, 10 e 1000 aceitas (200); 5 aceita | [CT29-q6](api/CT29-q6.txt) · [CT28a](api/CT28a.txt) |
| CT29 | ✅ | 0, −1, 1.5, "2", null, true → 422 `QUANTIDADE_INVALIDA`. `1e0` é lido como 1 e aceito (JSON válido) | [CT29-*](api/) |
| CT30 | ✅ | `{}`, `[]`, `"x"` → 422 `ITENS_OBRIGATORIOS` | [CT30a](api/CT30a.txt) |
| CT31 | ⚠ BUG-003 | String/null → `ITEM_INVALIDO`. **Sem `produtoId` → `PRODUTO_NAO_ENCONTRADO` "Produto undefined"**. Sem `quantidade` → `QUANTIDADE_INVALIDA` (aceito) | [CT31b](api/CT31b.txt) |
| CT32 | ✅ | `P999` e `p001` (minúsculo) → 422 `PRODUTO_NAO_ENCONTRADO` | [CT32](api/CT32.txt) |
| CT33 | ✅ | 422 `ITEM_DUPLICADO` em `itens[1].produtoId` | [CT33](api/CT33.txt) |
| CT34 | ✅ | JSON malformado, `[]`, `"x"` → 400 `JSON_INVALIDO` | [CT34a](api/CT34a.txt) |
| CT35 | ✅ | GET/PUT em `/calcular` → 405 | [CT35](api/CT35.txt) |
| CT36 | ✅ | 201 `VZ-504181`; CEP `01310-100` → `01310100`; valores = `/calcular` | [CT36](api/CT36.txt) |
| CT37 / CT38 | ✅ | 422 `CUPOM_INVALIDO` / `CUPOM_EXPIRADO` com `campo: "cupom"` (diferente de `/calcular`, intencional) | [CT37](api/CT37.txt) |
| CT39 | ⚠ | Nome sem sobrenome, e-mail e CEP inválidos → 422 `DADOS_INVALIDOS` com `campos`. Obs.: aceitam-se `"Maria  Silva"` (2 espaços) e `"Maria 123"`; `"Maria S"` (sobrenome de 1 letra) é rejeitado. A doc não define; registrado como lacuna | [CT39a–l](api/) |
| CT40 | ❌ parcial | `cliente` ausente → `DADOS_INVALIDOS` ✅; duplicado → ✅; **6 unidades em `/pedidos` → 201 (BUG-002)** | [CT40a](api/CT40a.txt) |
| CT41 | ✅ | Ordem das validações: dados do cliente → cupom → (quantidade, que hoje não valida). Cupom inválido + 6 un. → `CUPOM_INVALIDO` | [CT41](api/CT41.txt) |

### Integração e regressão

| CT | Resultado | Observado | Evidência |
|----|-----------|-----------|-----------|
| CT42 | ✅ | UI = API nas combinações testadas (239,70 c/ cupom; 100,00 c/ cupom; 200,00 c/ cupom — mesmo frete errado nos dois) | resultados-ui.txt × CT20/CT21/CT10 |
| CT43 | ✅ | Mensagens da UI = `cupom.mensagem` da API (inválido/expirado) | resultados-ui.txt × CT22/CT23 |
| CT44 | ✅ | Compra sem cupom: total = subtotal + frete (`VZ-161879`) | resultados-checkout.txt |
| CT45 | ✅ | Vitrine com 8 produtos | [png](ui/CT45-vitrine.png) |

## Decisões sobre as observações ⚠ (fechadas)

Regra aplicada (INDICE, D4): contraria um critério de aceite literal ou a documentação, é bug; é lacuna da documentação, vira interpretação registrada e não bug.

| Observação | Decisão | Motivo |
|------------|---------|--------|
| CT03.3: cupom vazio ou só espaços sem mensagem na UI | Não é bug | A documentação não define mensagem para campo vazio; a UI não aplica nada e não quebra |
| CT24: `""` vira `cupom: null` e `"   "` vira "inválido" na API | Não é bug | Inconsistência menor sem regra violada; sem efeito em valores |
| CT39: nome com 2 espaços ou número é aceito; sobrenome de 1 letra é rejeitado | Não é bug | A regra pré-existente só diz "nome e sobrenome"; sem critério para o resto |
| CT31: item sem `produtoId` | **Bug** (BUG-003, Baixa) | A documentação diz que o caso é `ITEM_INVALIDO` |

Fora de escopo e não coberto: conferência visual de layout em celular (não faz parte dos CA01–CA11).

## Aviso de limite

Os testes dependem do ambiente compartilhado: respostas da API são estáveis, mas a UI foi lida pelo texto renderizado no momento da execução.
