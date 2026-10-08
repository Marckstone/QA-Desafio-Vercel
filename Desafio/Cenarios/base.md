# VZS-142 — Cenários e Casos de Teste

Cupom de desconto e frete grátis · Verzel Store v2.3.0 · fonte: [Enunciado/enunciado.md](../../Enunciado/enunciado.md)

**Legenda:** `P0` = prioridade de execução (fluxo principal) · 🤖 = **candidato a automação** (determinístico, alto valor de regressão, sem dependência de dado externo) · `✱` = automatizado (preenchido após a execução).

---

## Escopo desta documentação

Cobre os critérios CA01–CA11 na UI (`/`, `/carrinho`, checkout) e na API (`/api/produtos`, `/api/carrinho/calcular`, `/api/pedidos`), mais regressão das regras pré-existentes (nome, e-mail, CEP, pagamento na entrega). Fora: carga, estresse, segurança, login, pagamento online, consulta de pedidos. Comportamentos de "Sobre este ambiente" são **esperados** e não geram bug.

Cálculo de referência (massa de dados em `enunciado.md`): `total = subtotal − desconto + frete`.

---

## Funcionais

### Cenário 1 (P0): Aplicar cupom BEMVINDO10 (CA01, CA09, CA11)

### Tipo de teste
**Funcional**

### Descrição (BDD)

```gherkin
Dado que o carrinho contém P002 x1 e P004 x2 (subtotal R$ 239,70)
Quando aplico o cupom "BEMVINDO10"
Então o desconto exibido é R$ 23,97
E o frete é R$ 0,00
E o total é R$ 215,73
```

### Casos de teste

- **CT01** 🤖 — Caminho feliz: cupom válido sobre carrinho acima de R$ 200 → desconto 10% do subtotal, total R$ 215,73
- **CT02** — Desconto não incide sobre o frete: P005 x1 + BEMVINDO10 → desconto R$ 10,00, frete R$ 19,90, total R$ 109,90
- **CT02.1** — Valores sem artefato de ponto flutuante (ex.: P001 x3 = R$ 179,70 e 10% = R$ 17,97, sem `…0000001`)

---

### Cenário 2: Normalização do código do cupom (CA02)

### Tipo de teste
**Funcional**

### Descrição (BDD)

```gherkin
Dado que o carrinho contém P005 x1
Quando aplico o cupom "<entrada>"
Então o cupom é aplicado como BEMVINDO10
```

### Casos de teste

- **CT03** — `bemvindo10` (minúsculas) e `BemVindo10` (misto) são aceitos
- **CT03.1** — `  BEMVINDO10  ` (espaços nas pontas) é aceito
- **CT03.2** — `BEM VINDO10` (espaço no meio): interpretação = inválido (ver INDICE, D2)
- **CT03.3** — Campo vazio ou só espaços: não aplica cupom e não quebra a tela

---

### Cenário 3 (P0): Cupom inválido e expirado na UI (CA03, CA04)

### Tipo de teste
**Funcional**

### Descrição (BDD)

```gherkin
Dado que o carrinho contém P005 x1
Quando aplico o cupom "<código>"
Então a mensagem exibida é "<mensagem>"
E nenhum desconto é aplicado
E o total continua R$ 119,90
```

### Casos de teste

- **CT04** — `XPTO123` → "Cupom inválido."
- **CT05** — `VERAO2026` → "Cupom expirado."
- **CT05.1** — Após erro, aplicar `BEMVINDO10` válido funciona (erro não "trava" o campo)

---

### Cenário 4: Apenas um cupom por vez (CA05)

### Tipo de teste
**Funcional**

### Descrição (BDD)

```gherkin
Dado que o cupom BEMVINDO10 está aplicado
Quando tento aplicar outro cupom sem removê-lo
Então a UI não permite o segundo cupom
Quando removo o cupom atual e aplico "VERAO2026"
Então o cupom anterior sai e o novo é avaliado
```

### Casos de teste

- **CT06** — Com cupom ativo, o campo/botão de aplicar fica indisponível ou rejeita o segundo
- **CT07** — Remover o cupom devolve o total ao valor sem desconto
- **CT07.1** — Trocar: remover BEMVINDO10 e aplicar VERAO2026 → "Cupom expirado." e total sem desconto

---

### Cenário 5 (P0): Frete grátis e faltante (CA06, CA07, CA08)

### Tipo de teste
**Funcional**

### Descrição (BDD)

```gherkin
Dado que o subtotal do carrinho é <subtotal>
Quando visualizo o resumo
Então o frete é <frete>
E o valor faltante para frete grátis é <faltante>
```

### Casos de teste

- **CT08** — Abaixo de R$ 200: P005 x1 (R$ 100,00) → frete R$ 19,90, "faltam R$ 100,00"
- **CT09** 🤖 — Fronteira inclusiva: P005 x2 (R$ 200,00) → frete R$ 0,00, faltante R$ 0,00
- **CT09.1** — Logo abaixo: P001 + P002 (R$ 199,80) → frete R$ 19,90, faltam R$ 0,20
- **CT10** 🤖 — Frete usa subtotal ANTES do cupom: P005 x2 + BEMVINDO10 (subtotal 200,00 → 180,00 após desconto) mantém frete R$ 0,00; total R$ 180,00
- **CT10.1** — Subtotal abaixo de R$ 200 + cupom nunca vira frete grátis (P003 + BEMVINDO10: 189,90 − 18,99 + 19,90 = R$ 190,81)

---

### Cenário 6 (P0): Limite de 5 unidades por produto na UI (CA10)

### Tipo de teste
**Funcional**

### Descrição (BDD)

```gherkin
Dado que o carrinho tem P004 com 5 unidades
Quando tento aumentar a quantidade para 6
Então a UI impede ou informa o limite de 5 unidades
E a quantidade permanece 5
```

### Casos de teste

- **CT11** — 5 unidades de um produto é aceito
- **CT11.1** 🤖 — 6ª unidade bloqueada via botão "+" / campo de quantidade
- **CT11.2** — Adicionar o mesmo produto repetidamente pela vitrine (`/`) não ultrapassa 5
- **CT11.3** — O limite é por produto: 5 x P004 e 5 x P006 coexistem

---

### Cenário 7: Carrinho — operações gerais (regressão da UI)

### Tipo de teste
**Funcional**

### Descrição (BDD)

```gherkin
Dado que estou na vitrine
Quando adiciono, altero e removo itens do carrinho
Então subtotal, frete e total acompanham as mudanças
```

### Casos de teste

- **CT12** — Adicionar produtos da vitrine e ver itens, preço unitário e total por linha corretos
- **CT13** — Alterar quantidade e remover item recalcula tudo; carrinho vazio mostra estado vazio
- **CT14** — Cupom aplicado se mantém ao alterar quantidades (e recalcula sobre o novo subtotal)
- **CT14.1** — Recarregar a aba mantém o carrinho (esperado); nova aba/anônima começa vazia (esperado, não é bug)

---

### Cenário 8 (P0): Finalizar pedido e dados do cliente (regras pré-existentes)

### Tipo de teste
**Funcional**

### Descrição (BDD)

```gherkin
Dado que o carrinho tem itens e o cupom BEMVINDO10 aplicado
Quando preencho nome, e-mail e CEP válidos e confirmo
Então o pedido é confirmado com número no formato "VZ-000000"
E os valores exibidos coincidem com o resumo do carrinho
E o pagamento é na entrega
```

### Casos de teste

- **CT15** — Pedido feliz com cupom: número `VZ-` + 6 dígitos, valores iguais ao carrinho
- **CT16** — Nome só com um termo ("Maria") é rejeitado; "Maria Silva" aceito
- **CT16.1** — E-mail inválido (`maria@`, `maria.com`) é rejeitado
- **CT16.2** — CEP com 7 ou 9 dígitos, letras → rejeitado; `01310-100` e `01310100` aceitos
- **CT16.3** — Campos vazios mostram mensagem por campo, sem perder o carrinho
- **CT17** — Não existe etapa de pagamento online

---

## API

### Cenário 9: Produtos (GET /api/produtos, /api/produtos/{id})

### Tipo de teste
**API**

### Descrição (BDD)

```gherkin
Quando consulto GET /api/produtos
Então recebo 200 com 8 produtos (id, nome, descricao, categoria, preco)
Quando consulto GET /api/produtos/P999
Então recebo 404 com erro.codigo "PRODUTO_NAO_ENCONTRADO"
```

### Casos de teste

- **CT18** — Lista: 200, 8 itens, campos e preços iguais à massa de dados
- **CT19** — Produto existente: 200 com o produto
- **CT19.1** — Id inexistente: 404 `PRODUTO_NAO_ENCONTRADO` no formato `{erro:{codigo,mensagem,campo}}`
- **CT19.2** — Rota inexistente: 404 `ROTA_NAO_ENCONTRADA`; método não permitido (ex.: `DELETE /api/produtos`): 405 `METODO_NAO_PERMITIDO`

---

### Cenário 10 (P0): Cálculo do carrinho (POST /api/carrinho/calcular)

### Tipo de teste
**API**

### Descrição (BDD)

```gherkin
Dado o corpo {"itens":[{"produtoId":"P002","quantidade":1},{"produtoId":"P004","quantidade":2}],"cupom":"BEMVINDO10"}
Quando envio POST /api/carrinho/calcular
Então recebo 200
E subtotal 239.7, desconto 23.97, frete 0, freteGratis true, total 215.73
E cupom.aplicado true
```

### Casos de teste

- **CT20** 🤖 — Contrato e valores do exemplo da documentação
- **CT21** — Sem campo `cupom`: desconto 0, `cupom` nulo/ausente conforme contrato
- **CT22** — `cupom` inexistente: 200, desconto 0, `cupom.aplicado=false`, mensagem "Cupom inválido."
- **CT23** — `VERAO2026`: 200, desconto 0, mensagem "Cupom expirado."
- **CT24** — Código `" bemvindo10 "` aplicado (CA02) também na API
- **CT25** — Fronteira de frete na API: 199,80 → frete 19.9 / 200 → frete 0; `valorFaltanteFreteGratis` = 0.2 e 0 (nunca negativo)
- **CT26** — Arredondamento: todos os campos monetários com no máx. 2 casas (ex.: P001 x3)
- **CT27** — Não grava nada: duas chamadas idênticas retornam o mesmo resultado (stateless)

---

### Cenário 11: Validação de entrada (calcular e pedidos) (CA10)

### Tipo de teste
**API**

### Descrição (BDD)

```gherkin
Quando envio um corpo inválido para POST /api/carrinho/calcular
Então recebo o status e o erro.codigo documentados
E erro.campo aponta o campo (ex.: "itens[0].quantidade")
```

### Casos de teste

- **CT28** 🤖 — `quantidade: 6` → 422 `QUANTIDADE_MAXIMA_EXCEDIDA`; `quantidade: 5` → 200
- **CT29** — `quantidade` 0, -1, 1.5, "2", null → 422 `QUANTIDADE_INVALIDA`
- **CT30** — `itens` ausente ou `[]` → 422 `ITENS_OBRIGATORIOS`
- **CT31** — Item não-objeto, sem `produtoId` ou sem `quantidade` → 422 `ITEM_INVALIDO`
- **CT32** — `produtoId` inexistente → 422 `PRODUTO_NAO_ENCONTRADO`
- **CT33** — Mesmo produto duas vezes → 422 `ITEM_DUPLICADO`
- **CT34** — JSON malformado → 400 `JSON_INVALIDO`; corpo array/string → 400
- **CT35** — `GET /api/carrinho/calcular` → 405 `METODO_NAO_PERMITIDO`

---

### Cenário 12 (P0): Pedidos (POST /api/pedidos)

### Tipo de teste
**API**

### Descrição (BDD)

```gherkin
Dado cliente válido, itens e cupom BEMVINDO10
Quando envio POST /api/pedidos
Então recebo 201 com numero "VZ-######"
E o mesmo resumo de valores que /calcular
E cliente.cep somente com dígitos
```

### Casos de teste

- **CT36** — Pedido feliz: 201, `numero` `^VZ-\d{6}$`, valores = /calcular, CEP `01310-100` → `01310100`
- **CT37** — Cupom inexistente → 422 `CUPOM_INVALIDO` (diferente de /calcular, que dá 200)
- **CT38** — `VERAO2026` → 422 `CUPOM_EXPIRADO`
- **CT39** — Cliente inválido (nome sem sobrenome, e-mail, CEP) → 422 `DADOS_INVALIDOS` com detalhes em `campos`
- **CT40** — `cliente` ausente; mesmas validações de itens (quantidade 6, duplicado) valem em /pedidos
- **CT41** — Combinação de erros: qual código prevalece (ex.: cupom inválido + quantidade 6)? Registrar a observação

---

## Integração

### Cenário 13: Consistência UI × API

### Tipo de teste
**Integração**

### Descrição (BDD)

```gherkin
Dado um carrinho montado na UI
Quando comparo os valores exibidos com POST /api/carrinho/calcular para os mesmos itens/cupom
Então subtotal, desconto, frete, faltante e total são idênticos
```

### Casos de teste

- **CT42** — 3 combinações (abaixo de 200, exatamente 200, acima com cupom): UI = API
- **CT43** — Mensagem de cupom na UI = `cupom.mensagem` da API (inválido e expirado)

---

## Regressão

### Cenário 14: Regras pré-existentes não afetadas

### Tipo de teste
**Regressão**

### Descrição (BDD)

```gherkin
Dado a entrega VZS-142 publicada
Quando executo o fluxo de compra sem cupom
Então carrinho, dados do cliente e confirmação continuam funcionando
```

### Casos de teste

- **CT44** — Compra sem cupom: total = subtotal + frete (CT15 sem cupom)
- **CT45** — Vitrine lista 8 produtos com nome, categoria e preço corretos

---

## Observações finais

- **Automação (3 specs, decididas com o usuário):** (1) caminho feliz → CT01; (2) candidato marcado 🤖 → CT10 (frete sobre subtotal pré-cupom, fronteira R$ 200); (3) **regressão de bug** → o primeiro bug de severidade ≥ Média encontrado na execução, assertando o comportamento *esperado* (a spec falha enquanto o bug existir e vira regressão após a correção). `✱` será marcado aqui quando existir.
- Ordem de execução: P0 primeiro (Cenários 1, 3, 5, 6, 8, 10, 12), depois o restante.
- Lacunas abertas: ver tabela de Decisões de Escopo em [INDICE.md](../INDICE.md).
