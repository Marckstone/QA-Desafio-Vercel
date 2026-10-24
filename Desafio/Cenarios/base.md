# VZS-142 — Cenários e Casos de Teste

Cupom de desconto e frete grátis · Verzel Store v2.3.0 · fonte: [Enunciado/enunciado.md](../../Enunciado/enunciado.md)

**Legenda:** `P0` = execução primeiro (fluxo principal e dinheiro) · `P1` = regras de apoio e validações · `P2` = regressão e bordas · 🤖 = **candidato a automação** (determinístico, alto valor de regressão, sem dependência externa) · `✱` = automatizado.

Todo caso de teste está em Gherkin. Cada `@CTnn` ao lado do cenário é o ID rastreado em [evidencias.md](../Evidencias/evidencias.md) e nos bug reports. Casos que nascem como tabela de dados usam `Esquema do Cenário` com `Exemplos`, com o ID do CT numa coluna.

---

## Escopo desta documentação

Cobre os critérios CA01–CA11 na UI (`/`, `/carrinho`, `/checkout`) e na API (`/api/produtos`, `/api/carrinho/calcular`, `/api/pedidos`), mais regressão das regras pré-existentes (nome, e-mail, CEP, pagamento na entrega). Fora: carga, estresse, segurança, login, pagamento online, consulta de pedidos. Comportamentos de "Sobre este ambiente" são **esperados** e não geram bug.

Cálculo de referência (massa de dados em `enunciado.md`): `total = subtotal − desconto + frete`.

---

## Funcionais

### Cenário 1 (P0): Aplicar cupom BEMVINDO10 (CA01, CA09, CA11)

### Tipo de teste
**Funcional**

### Descrição (BDD)

```gherkin
Funcionalidade: Cupom BEMVINDO10

  @CT01 @automatizado
  Cenário: Cupom válido sobre carrinho acima de R$ 200,00
    Dado que o carrinho contém P002 x1 e P004 x2 (subtotal R$ 239,70)
    Quando aplico o cupom "BEMVINDO10"
    Então o desconto exibido é R$ 23,97
    E o frete é grátis
    E o total é R$ 215,73

  @CT02
  Cenário: O desconto não incide sobre o frete
    Dado que o carrinho contém P005 x1 (subtotal R$ 100,00)
    Quando aplico o cupom "BEMVINDO10"
    Então o desconto exibido é R$ 10,00
    E o frete é R$ 19,90
    E o total é R$ 109,90

  @CT02.1
  Cenário: Valores sem artefato de ponto flutuante (CA11)
    Dado que o carrinho contém P001 x3 (subtotal R$ 179,70)
    Quando aplico o cupom "BEMVINDO10"
    Então o desconto exibido é R$ 17,97
    E o total é R$ 181,63
```

### Casos de teste

- **CT01** 🤖 ✱ — Caminho feliz com cupom válido
- **CT02** — Desconto não incide sobre o frete
- **CT02.1** — Arredondamento sem artefato de ponto flutuante

---

### Cenário 2 (P1): Normalização do código do cupom (CA02)

### Tipo de teste
**Funcional**

### Descrição (BDD)

```gherkin
Funcionalidade: Normalização do código do cupom

  Esquema do Cenário: Código digitado em formatos diferentes
    Dado que o carrinho contém P005 x1 (subtotal R$ 100,00)
    Quando informo o cupom <entrada>
    Então o resultado é "<resultado>"
    E o total é R$ <total>

    Exemplos:
      | CT     | entrada            | resultado                 | total  |
      | CT03   | "bemvindo10"       | cupom BEMVINDO10 aplicado | 109,90 |
      | CT03   | "BemVindo10"       | cupom BEMVINDO10 aplicado | 109,90 |
      | CT03.1 | "  BEMVINDO10  "   | cupom BEMVINDO10 aplicado | 109,90 |
      | CT03.2 | "BEM VINDO10"      | Cupom inválido.           | 119,90 |
      | CT03.3 | ""                 | nenhum cupom aplicado     | 119,90 |
      | CT03.3 | "   "              | nenhum cupom aplicado     | 119,90 |
```

> As aspas delimitam a entrada exata: `CT03.1` tem espaços no início e no fim; `CT03.3` cobre campo vazio e campo só com espaços. `CT03.2` segue a interpretação D2 do INDICE (espaço no meio é inválido).

### Casos de teste

- **CT03** — Maiúsculas e minúsculas são equivalentes
- **CT03.1** — Espaços no início e no fim são ignorados
- **CT03.2** — Espaço no meio do código é inválido (decisão D2)
- **CT03.3** — Vazio ou só espaços não aplica cupom e não quebra a tela

---

### Cenário 3 (P0): Cupom inválido e expirado na UI (CA03, CA04)

### Tipo de teste
**Funcional**

### Descrição (BDD)

```gherkin
Funcionalidade: Cupom inválido ou expirado

  Esquema do Cenário: Cupom que não gera desconto
    Dado que o carrinho contém P005 x1 (subtotal R$ 100,00)
    Quando aplico o cupom "<código>"
    Então a mensagem exibida é "<mensagem>"
    E nenhum desconto é aplicado
    E o total continua R$ 119,90

    Exemplos:
      | CT   | código    | mensagem          |
      | CT04 | XPTO123   | Cupom inválido.   |
      | CT05 | VERAO2026 | Cupom expirado.   |

  @CT05.1
  Cenário: Um cupom válido funciona depois de um erro
    Dado que o cupom "VERAO2026" foi rejeitado como expirado
    Quando aplico o cupom "BEMVINDO10"
    Então o desconto exibido é R$ 10,00
    E o total é R$ 109,90
```

### Casos de teste

- **CT04** — Cupom inexistente → "Cupom inválido."
- **CT05** — Cupom fora da validade → "Cupom expirado."
- **CT05.1** — O erro não trava o campo de cupom

---

### Cenário 4 (P1): Apenas um cupom por vez (CA05)

### Tipo de teste
**Funcional**

### Descrição (BDD)

```gherkin
Funcionalidade: Um cupom por vez

  @CT06
  Cenário: Com cupom ativo, não é possível informar outro
    Dado que o cupom "BEMVINDO10" está aplicado
    Então o campo para informar outro cupom não está disponível
    E existe a ação "Remover cupom"

  @CT07
  Cenário: Remover o cupom devolve o total sem desconto
    Dado que o cupom "BEMVINDO10" está aplicado sobre P005 x1
    Quando removo o cupom
    Então o desconto é R$ 0,00
    E o total é R$ 119,90

  @CT07.1
  Cenário: Trocar de cupom exige remover o atual
    Dado que o cupom "BEMVINDO10" está aplicado
    Quando removo o cupom e aplico "VERAO2026"
    Então a mensagem exibida é "Cupom expirado."
    E nenhum desconto é aplicado
```

### Casos de teste

- **CT06** — Campo de cupom some quando há cupom ativo
- **CT07** — Remover cupom restaura o total
- **CT07.1** — Troca de cupom pelo caminho remover + aplicar

---

### Cenário 5 (P0): Frete grátis e valor faltante (CA06, CA07, CA08)

### Tipo de teste
**Funcional**

### Descrição (BDD)

```gherkin
Funcionalidade: Frete grátis a partir de R$ 200,00

  Esquema do Cenário: Frete conforme o subtotal, sem cupom
    Dado que o carrinho contém <itens>
    Quando visualizo o resumo do pedido
    Então o subtotal é R$ <subtotal>
    E o frete é <frete>
    E o valor faltante para frete grátis é R$ <faltante>

    Exemplos:
      | CT       | itens           | subtotal | frete    | faltante |
      | CT08     | P005 x1         | 100,00   | R$ 19,90 | 100,00   |
      | CT09.1   | P001 x1, P002 x1| 199,80   | R$ 19,90 | 0,20     |
      | CT09 🤖 ✱| P005 x2         | 200,00   | grátis   | 0,00     |
      | CT09.2   | P001 x2, P005 x1| 219,80   | grátis   | 0,00     |

  Esquema do Cenário: O frete usa o subtotal antes do cupom (CA08)
    Dado que o carrinho contém <itens>
    Quando aplico o cupom "BEMVINDO10"
    Então o subtotal é R$ <subtotal>
    E o desconto é R$ <desconto>
    E o frete é <frete>
    E o total é R$ <total>

    Exemplos:
      | CT        | itens            | subtotal | desconto | frete    | total  |
      | CT10 🤖   | P005 x2          | 200,00   | 20,00    | grátis   | 180,00 |
      | CT10.1    | P003 x1          | 189,90   | 18,99    | R$ 19,90 | 190,81 |
      | CT10.2    | P001 x2, P005 x1 | 219,80   | 21,98    | grátis   | 197,82 |
```

> `CT10.2` é a prova do CA08: o carrinho de R$ 219,80 fica em R$ 197,82 depois do cupom, abaixo de R$ 200,00, e mantém o frete grátis.

### Casos de teste

- **CT08** — Abaixo de R$ 200,00 cobra R$ 19,90 e informa o que falta
- **CT09** 🤖 ✱ — Fronteira inclusiva: exatamente R$ 200,00 é frete grátis
- **CT09.1** — Logo abaixo da fronteira (R$ 199,80) cobra frete
- **CT09.2** — Acima da fronteira (R$ 219,80) é frete grátis
- **CT10** 🤖 — Cupom em R$ 200,00 não tira o frete grátis
- **CT10.1** — Abaixo de R$ 200,00 o cupom nunca vira frete grátis
- **CT10.2** — CA08: subtotal acima de R$ 200,00 e abaixo depois do cupom mantém frete grátis

---

### Cenário 6 (P0): Limite de 5 unidades por produto na UI (CA10)

### Tipo de teste
**Funcional**

### Descrição (BDD)

```gherkin
Funcionalidade: Limite de 5 unidades por produto

  @CT11
  Cenário: Cinco unidades são aceitas
    Dado que o carrinho tem P004 com 4 unidades
    Quando aumento a quantidade para 5
    Então a quantidade é 5
    E o subtotal é R$ 249,50

  @CT11.1 @automatizavel
  Cenário: A sexta unidade é bloqueada
    Dado que o carrinho tem P004 com 5 unidades
    Então a ação de aumentar a quantidade está desabilitada
    E a mensagem "Limite de 5 unidades por produto." é exibida

  @CT11.2
  Cenário: A vitrine não deixa passar de 5
    Dado que estou na vitrine
    Quando clico 7 vezes em "Adicionar ao carrinho" do produto P004
    Então o carrinho tem P004 com 5 unidades

  @CT11.3
  Cenário: O limite vale por produto
    Dado que o carrinho tem P004 com 5 unidades
    Quando adiciono 5 unidades de P006
    Então o carrinho tem P004 x5 e P006 x5
    E o subtotal é R$ 399,00
```

### Casos de teste

- **CT11** — 5 unidades aceitas
- **CT11.1** 🤖 — Sexta unidade bloqueada
- **CT11.2** — Limite respeitado pela vitrine
- **CT11.3** — Limite por produto, não por carrinho

---

### Cenário 7 (P2): Carrinho, operações gerais (regressão da UI)

### Tipo de teste
**Funcional**

### Descrição (BDD)

```gherkin
Funcionalidade: Operações do carrinho

  @CT12
  Cenário: Itens exibem preço unitário e total por linha
    Dado que adiciono P001 x2 e P002 x1 pela vitrine
    Quando abro o carrinho
    Então vejo "R$ 59,90 cada" com total de linha R$ 119,80
    E vejo "R$ 139,90 cada" com total de linha R$ 139,90

  @CT13
  Cenário: Alterar, remover e esvaziar recalculam o resumo
    Dado que o carrinho tem P001 x2 e P002 x1
    Quando diminuo P001 para 1
    Então o subtotal é R$ 199,80
    Quando removo P002
    Então o subtotal é R$ 59,90
    Quando esvazio o carrinho
    Então vejo o estado de carrinho vazio

  @CT14
  Cenário: O cupom se mantém ao alterar a quantidade
    Dado que o carrinho tem P005 x1 com o cupom "BEMVINDO10"
    Quando aumento a quantidade de P005 para 2
    Então o desconto é recalculado sobre R$ 200,00

  @CT14.1
  Cenário: O carrinho vive na aba (comportamento esperado do ambiente)
    Dado que o carrinho tem itens
    Quando recarrego a página
    Então o carrinho é mantido
    Quando abro uma aba anônima
    Então o carrinho está vazio
```

### Casos de teste

- **CT12** — Linhas do carrinho
- **CT13** — Alterar, remover, esvaziar
- **CT14** — Cupom persiste na mudança de quantidade
- **CT14.1** — Persistência por aba (esperado, não é bug)

---

### Cenário 8 (P0): Finalizar pedido e dados do cliente (regras pré-existentes)

### Tipo de teste
**Funcional**

### Descrição (BDD)

```gherkin
Funcionalidade: Finalizar compra

  @CT15
  Cenário: Pedido com cupom
    Dado que o carrinho tem P005 x1 com o cupom "BEMVINDO10"
    Quando preencho nome "Maria Silva", e-mail "maria@exemplo.com" e CEP "01310-100" e confirmo
    Então o pedido é confirmado com número no formato "VZ-######"
    E os valores exibidos são os do carrinho (total R$ 109,90)
    E o pagamento será feito na entrega

  Esquema do Cenário: Dados do cliente inválidos
    Dado que o carrinho tem P005 x1
    Quando preencho nome "<nome>", e-mail "<email>" e CEP "<cep>" e confirmo
    Então vejo a mensagem "<mensagem>"
    E o pedido não é confirmado
    E o carrinho é mantido

    Exemplos:
      | CT      | nome        | email             | cep       | mensagem                          |
      | CT16    | Maria       | maria@exemplo.com | 01310100  | Informe nome e sobrenome.         |
      | CT16.1  | Maria Silva | maria@            | 01310100  | Informe um e-mail válido.         |
      | CT16.1  | Maria Silva | maria.com         | 01310100  | Informe um e-mail válido.         |
      | CT16.2  | Maria Silva | maria@exemplo.com | 0131010   | Informe um CEP com 8 dígitos.     |
      | CT16.2  | Maria Silva | maria@exemplo.com | 013101000 | Informe um CEP com 8 dígitos.     |
      | CT16.2  | Maria Silva | maria@exemplo.com | 0131010a  | Informe um CEP com 8 dígitos.     |
      | CT16.3  |             |                   |           | Informe o nome completo. / Informe o e-mail. / Informe o CEP. |

  @CT17
  Cenário: Não há pagamento online
    Dado que estou no checkout
    Então vejo a informação "O pagamento é feito na entrega."
    E não existe nenhum campo de cartão ou pagamento
```

### Casos de teste

- **CT15** — Pedido feliz com cupom
- **CT16** — Nome sem sobrenome
- **CT16.1** — E-mail inválido
- **CT16.2** — CEP inválido
- **CT16.3** — Campos vazios, mensagem por campo
- **CT17** — Sem pagamento online

---

## API

### Cenário 9 (P2): Produtos (GET /api/produtos, /api/produtos/{id})

### Tipo de teste
**API**

### Descrição (BDD)

```gherkin
Funcionalidade: Consulta de produtos

  @CT18
  Cenário: Listar produtos
    Quando consulto GET /api/produtos
    Então recebo 200
    E a lista tem 8 produtos com id, nome, descricao, categoria e preco

  @CT19
  Cenário: Consultar um produto existente
    Quando consulto GET /api/produtos/P003
    Então recebo 200 com "Tênis Casual Urbano" e preco 189.9

  Esquema do Cenário: Erros de rota e método
    Quando envio <método> <rota>
    Então recebo <status> com erro.codigo "<codigo>"

    Exemplos:
      | CT      | método | rota              | status | codigo                 |
      | CT19.1  | GET    | /api/produtos/P999| 404    | PRODUTO_NAO_ENCONTRADO |
      | CT19.2  | GET    | /api/xyz          | 404    | ROTA_NAO_ENCONTRADA    |
      | CT19.2  | DELETE | /api/produtos     | 405    | METODO_NAO_PERMITIDO   |
```

### Casos de teste

- **CT18** — Lista de produtos
- **CT19** — Produto existente
- **CT19.1** — Produto inexistente
- **CT19.2** — Rota inexistente e método não permitido

---

### Cenário 10 (P0): Cálculo do carrinho (POST /api/carrinho/calcular)

### Tipo de teste
**API**

### Descrição (BDD)

```gherkin
Funcionalidade: Cálculo do carrinho pela API

  @CT20 @automatizado
  Cenário: Exemplo da documentação
    Dado o corpo {"itens":[{"produtoId":"P002","quantidade":1},{"produtoId":"P004","quantidade":2}],"cupom":"BEMVINDO10"}
    Quando envio POST /api/carrinho/calcular
    Então recebo 200
    E subtotal 239.7, desconto 23.97, frete 0, freteGratis true e total 215.73
    E cupom.aplicado é true

  @CT21
  Cenário: Sem cupom
    Dado o corpo com P005 x1 e sem o campo "cupom"
    Quando envio POST /api/carrinho/calcular
    Então recebo 200 com desconto 0 e cupom nulo

  Esquema do Cenário: Cupom na API
    Dado o corpo com P005 x1 e cupom "<cupom>"
    Quando envio POST /api/carrinho/calcular
    Então recebo 200
    E cupom.aplicado é <aplicado>
    E cupom.mensagem é "<mensagem>"
    E o desconto é <desconto>

    Exemplos:
      | CT   | cupom          | aplicado | mensagem                                       | desconto |
      | CT22 | XPTO123        | false    | Cupom inválido.                                | 0        |
      | CT23 | VERAO2026      | false    | Cupom expirado.                                | 0        |
      | CT24 |   bemVindo10   | true     | Cupom aplicado: 10% de desconto nos produtos.  | 10       |

  Esquema do Cenário: Fronteira de frete na API
    Dado o corpo com <itens>
    Quando envio POST /api/carrinho/calcular
    Então subtotal é <subtotal>, frete é <frete> e valorFaltanteFreteGratis é <faltante>

    Exemplos:
      | CT    | itens                 | subtotal | frete | faltante |
      | CT25  | P004 x4               | 199.6    | 19.9  | 0.4      |
      | CT25  | P001 x1, P002 x1      | 199.8    | 19.9  | 0.2      |
      | CT25  | P005 x2               | 200      | 0     | 0        |
      | CT25  | P008 x4               | 200      | 0     | 0        |
      | CT25  | P001 x2, P005 x1      | 219.8    | 0     | 0        |

  @CT26
  Cenário: Arredondamento a 2 casas
    Dado o corpo com P001 x3 e cupom "BEMVINDO10"
    Quando envio POST /api/carrinho/calcular
    Então subtotal 179.7, desconto 17.97 e total 181.63
    E nenhum campo monetário tem mais de 2 casas decimais

  @CT27
  Cenário: A API não guarda estado
    Dado o mesmo corpo enviado duas vezes seguidas
    Quando comparo as duas respostas
    Então elas são idênticas
```

### Casos de teste

- **CT20** 🤖 ✱ — Contrato e valores do exemplo da documentação
- **CT21** — Sem cupom
- **CT22** — Cupom inexistente
- **CT23** — Cupom expirado
- **CT24** — Código com espaços e caixa mista
- **CT25** — Fronteira de frete na API
- **CT26** — Arredondamento
- **CT27** — Stateless

---

### Cenário 11 (P1): Validação de entrada (CA10)

### Tipo de teste
**API**

### Descrição (BDD)

```gherkin
Funcionalidade: Validação do corpo de POST /api/carrinho/calcular

  Esquema do Cenário: Corpo inválido ou fora da regra
    Dado o corpo <corpo>
    Quando envio POST /api/carrinho/calcular
    Então recebo <status> com erro.codigo "<codigo>"

    Exemplos:
      | CT           | corpo                                                       | status | codigo                      |
      | CT28 🤖      | {"itens":[{"produtoId":"P004","quantidade":6}]}             | 422    | QUANTIDADE_MAXIMA_EXCEDIDA  |
      | CT29         | {"itens":[{"produtoId":"P004","quantidade":0}]}             | 422    | QUANTIDADE_INVALIDA         |
      | CT29         | {"itens":[{"produtoId":"P004","quantidade":-1}]}            | 422    | QUANTIDADE_INVALIDA         |
      | CT29         | {"itens":[{"produtoId":"P004","quantidade":1.5}]}           | 422    | QUANTIDADE_INVALIDA         |
      | CT29         | {"itens":[{"produtoId":"P004","quantidade":"2"}]}           | 422    | QUANTIDADE_INVALIDA         |
      | CT29         | {"itens":[{"produtoId":"P004","quantidade":null}]}          | 422    | QUANTIDADE_INVALIDA         |
      | CT30         | {}                                                          | 422    | ITENS_OBRIGATORIOS          |
      | CT30         | {"itens":[]}                                                | 422    | ITENS_OBRIGATORIOS          |
      | CT31         | {"itens":["P001"]}                                          | 422    | ITEM_INVALIDO               |
      | CT31         | {"itens":[{"quantidade":1}]}                                | 422    | ITEM_INVALIDO               |
      | CT32         | {"itens":[{"produtoId":"P999","quantidade":1}]}             | 422    | PRODUTO_NAO_ENCONTRADO      |
      | CT33         | {"itens":[{"produtoId":"P001","quantidade":1},{"produtoId":"P001","quantidade":2}]} | 422 | ITEM_DUPLICADO |
      | CT34         | {"itens":[                                                  | 400    | JSON_INVALIDO               |
      | CT34         | []                                                          | 400    | JSON_INVALIDO               |

  @CT28
  Cenário: A quantidade máxima é aceita
    Dado o corpo com P004 x5
    Quando envio POST /api/carrinho/calcular
    Então recebo 200 e subtotal 249.5

  @CT35
  Cenário: Método não permitido
    Quando envio GET /api/carrinho/calcular
    Então recebo 405 com erro.codigo "METODO_NAO_PERMITIDO"
```

### Casos de teste

- **CT28** 🤖 — Limite de 5 unidades na API (6 → 422; 5 → 200)
- **CT29** — Quantidade de tipo ou valor inválido
- **CT30** — Itens ausentes ou vazios
- **CT31** — Item malformado
- **CT32** — Produto inexistente
- **CT33** — Item duplicado
- **CT34** — JSON malformado
- **CT35** — Método não permitido

---

### Cenário 12 (P0): Pedidos (POST /api/pedidos)

### Tipo de teste
**API**

### Descrição (BDD)

```gherkin
Funcionalidade: Confirmação do pedido pela API

  @CT36
  Cenário: Pedido feliz
    Dado cliente "Maria Silva", "maria@exemplo.com", CEP "01310-100", item P005 x1 e cupom "BEMVINDO10"
    Quando envio POST /api/pedidos
    Então recebo 201 com numero no formato "VZ-######"
    E os valores são os mesmos de /api/carrinho/calcular (total 109.9)
    E cliente.cep é "01310100"

  Esquema do Cenário: Cupom ruim no pedido gera erro (diferente do /calcular)
    Dado um pedido válido com o cupom "<cupom>"
    Quando envio POST /api/pedidos
    Então recebo 422 com erro.codigo "<codigo>" e erro.campo "cupom"

    Exemplos:
      | CT   | cupom     | codigo          |
      | CT37 | XPTO      | CUPOM_INVALIDO  |
      | CT38 | VERAO2026 | CUPOM_EXPIRADO  |

  Esquema do Cenário: Dados do cliente inválidos no pedido
    Dado um pedido com nome "<nome>", e-mail "<email>" e CEP "<cep>"
    Quando envio POST /api/pedidos
    Então recebo 422 com erro.codigo "DADOS_INVALIDOS"
    E o detalhe vem em "campos" para <campo>

    Exemplos:
      | CT   | nome        | email             | cep       | campo        |
      | CT39 | Maria       | maria@exemplo.com | 01310100  | cliente.nome |
      | CT39 | Maria Silva | maria@            | 01310100  | cliente.email|
      | CT39 | Maria Silva | maria@exemplo.com | 0131010   | cliente.cep  |

  @CT40
  Cenário: As validações de itens também valem no pedido
    Dado um pedido válido com P004 x6
    Quando envio POST /api/pedidos
    Então recebo 422 com erro.codigo "QUANTIDADE_MAXIMA_EXCEDIDA"

  @CT40.1
  Cenário: Cliente ausente
    Dado um pedido sem o objeto "cliente"
    Quando envio POST /api/pedidos
    Então recebo 422 com erro.codigo "DADOS_INVALIDOS"

  @CT41
  Cenário: Ordem de prevalência quando há mais de um erro
    Dado um pedido com cupom "XPTO" e P004 x6
    Quando envio POST /api/pedidos
    Então registro qual erro.codigo prevalece
```

### Casos de teste

- **CT36** — Pedido feliz
- **CT37** — Cupom inexistente no pedido
- **CT38** — Cupom expirado no pedido
- **CT39** — Dados do cliente inválidos
- **CT40** — Limite de 5 unidades no pedido, e cliente ausente (CT40.1)
- **CT41** — Prevalência entre erros

---

## Integração

### Cenário 13 (P1): Consistência UI × API

### Tipo de teste
**Integração**

### Descrição (BDD)

```gherkin
Funcionalidade: A UI exibe o que a API calcula

  Esquema do Cenário: Mesmos valores na tela e na API
    Dado o carrinho montado na UI com <itens> e <cupom>
    Quando consulto POST /api/carrinho/calcular para os mesmos itens e cupom
    Então subtotal, desconto, frete, faltante e total da UI são iguais aos da API

    Exemplos:
      | CT   | itens            | cupom      |
      | CT42 | P005 x1          | nenhum     |
      | CT42 | P005 x2          | nenhum     |
      | CT42 | P002 x1, P004 x2 | BEMVINDO10 |

  Esquema do Cenário: Mensagem de cupom igual na UI e na API
    Dado o carrinho com P005 x1 e o cupom "<cupom>"
    Então a mensagem na UI é igual a cupom.mensagem da API: "<mensagem>"

    Exemplos:
      | CT   | cupom     | mensagem        |
      | CT43 | XPTO123   | Cupom inválido. |
      | CT43 | VERAO2026 | Cupom expirado. |
```

### Casos de teste

- **CT42** — UI = API em 3 combinações
- **CT43** — Mensagens de cupom iguais

---

## Regressão

### Cenário 14 (P2): Regras pré-existentes não afetadas

### Tipo de teste
**Regressão**

### Descrição (BDD)

```gherkin
Funcionalidade: Fluxo de compra sem cupom

  @CT44
  Cenário: Compra sem cupom
    Dado que o carrinho tem P005 x1 e nenhum cupom
    Quando preencho dados válidos e confirmo o pedido
    Então o total é R$ 119,90 (subtotal + frete)

  @CT45
  Cenário: Vitrine completa
    Quando abro a vitrine
    Então vejo 8 produtos com nome, categoria e preço corretos
```

### Casos de teste

- **CT44** — Compra sem cupom
- **CT45** — Vitrine com 8 produtos

---

## Observações finais

- **Automação (3 specs) em `Desafio/automacao-playwright/tests/`:** (1) caminho feliz → CT01 (`cupom-caminho-feliz.spec.ts`); (2) candidato 🤖 → CT20 (`api-calcular-contrato.spec.ts`, cobre também CT22/CT23); (3) regressão de bug → CT09 / BUG-001 (`bug-001-frete-200.spec.ts`), que assertiva o comportamento esperado e **falha até a correção**. O CT10 depende da fronteira de R$ 200,00 e por isso falha enquanto o BUG-001 existir; vira candidato assim que ele for corrigido. Candidatos 🤖 restantes: CT11.1 e CT28 (este falha até o BUG-002 ser corrigido).
- Ordem de execução: P0 primeiro (Cenários 1, 3, 5, 6, 8, 10, 12), depois P1 (2, 4, 11, 13) e P2 (7, 9, 14).
- Decisões de interpretação de ambiguidades: tabela **Decisões de Escopo** em [INDICE.md](../INDICE.md).
