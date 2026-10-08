# Enunciado — Teste técnico QA Júnior (Verzel)

Fonte: PDF "Teste tecnico QA Junior - Verzel.pdf" (5 páginas, imagens) + documentação da entrega em `/documentacao` (lida em 2026-10-08).

## Links
- Loja: https://verzel-store.qa-test-verzel-store.workers.dev/
- Documentação: https://verzel-store.qa-test-verzel-store.workers.dev/documentacao
- API: https://verzel-store.qa-test-verzel-store.workers.dev/api
- Formulário de envio: https://elitedev.verzel.com.br/

## O que entregar (tudo em UM repositório público no GitHub)
1. Cenários de teste levantados a partir da documentação (Gherkin é diferencial)
2. Execução dos testes, manuais e exploratórios, com o resultado de cada cenário
3. Report de todos os bugs encontrados
4. Documento com as evidências da execução
5. Automação de pelo menos 3 cenários com Playwright
6. README explicando como rodar a automação e onde encontrar cada entrega

## Regras
- **Prazo:** 5 dias corridos a partir do recebimento do documento
- **Formato livre:** planilha, documento ou Markdown, desde que no repositório; a organização também é avaliada
- **Uso de IA:** permitido e não tira ponto; contar onde/como usou no formulário de envio
- **Ambiente compartilhado:** outros candidatos testam ao mesmo tempo; cada pessoa tem seu carrinho
- **Fora do escopo:** testes de carga, estresse e segurança
- **Ambiguidades:** registrar a interpretação própria e seguir em frente (conta como avaliação)
- **Campos do formulário:** nome, e-mail, repositório, "mais de um repo" = não se aplica, deploy = ignorar, onde/como usou IA

## Entrega testada — VZS-142 (v2.3.0, 30/09/2026): Cupom de desconto e frete grátis
Os cálculos são feitos pela API; a UI só exibe o resultado.

### Critérios de aceite
| ID | Critério |
|----|----------|
| CA01 | Cupom `BEMVINDO10` aplica 10% sobre o subtotal dos produtos |
| CA02 | Código do cupom case-insensitive; espaços no início/fim ignorados |
| CA03 | Cupom inexistente: mensagem "Cupom inválido." e nenhum desconto |
| CA04 | Cupom fora da validade: mensagem "Cupom expirado." e nenhum desconto |
| CA05 | Apenas um cupom por vez; para trocar, remover o atual e aplicar outro |
| CA06 | Frete grátis para subtotal ≥ R$ 200,00 (inclusive) |
| CA07 | Abaixo de R$ 200,00: frete fixo R$ 19,90 e o carrinho informa quanto falta para frete grátis |
| CA08 | Frete grátis considera subtotal ANTES do desconto do cupom |
| CA09 | Desconto do cupom não incide sobre o frete |
| CA10 | Máx. 5 unidades por produto por pedido (UI e API) |
| CA11 | Todos os valores arredondados a 2 casas decimais |

### Fórmulas
`total = subtotal - desconto + frete`
- Subtotal = Σ preço unitário × quantidade
- Desconto = % do cupom × subtotal (0 sem cupom válido)
- Frete = 0,00 se subtotal ≥ 200,00; senão 19,90
- Faltante = max(0, 200,00 − subtotal)

### Regras pré-existentes
Nome com nome e sobrenome · e-mail com formato válido · CEP com 8 dígitos (com/sem hífen) · pagamento na entrega (sem pagamento online)

### Massa de dados
| Id | Produto | Preço |
|----|---------|-------|
| P001 | Camiseta Essencial | 59,90 |
| P002 | Calça Jeans Slim | 139,90 |
| P003 | Tênis Casual Urbano | 189,90 |
| P004 | Boné Aba Curva | 49,90 |
| P005 | Mochila Urbana 20L | 100,00 |
| P006 | Kit 3 Pares de Meias | 29,90 |
| P007 | Jaqueta Corta-Vento | 229,90 |
| P008 | Garrafa Térmica 750ml | 50,00 |

Cupons: `BEMVINDO10` 10% válido · `VERAO2026` 15% expirado em 31/03/2026

### API (base `/api`, JSON)
| Método | Rota | Comportamento |
|--------|------|---------------|
| GET | `/api/produtos` | Lista produtos (200) |
| GET | `/api/produtos/{id}` | 200 ou 404 `PRODUTO_NAO_ENCONTRADO` |
| POST | `/api/carrinho/calcular` | Calcula sem gravar; cupom inválido/expirado = 200 sem desconto, motivo em `cupom.mensagem` |
| POST | `/api/pedidos` | 201 com `numero` `VZ-000000` + resumo; cupom inválido/expirado = 422 |

Corpo calcular: `{"itens":[{"produtoId","quantidade"}],"cupom":"..."}` · Corpo pedidos: acrescenta `cliente:{nome,email,cep}` (CEP retorna só dígitos).
Resposta de valores: `itens[]`, `subtotal`, `desconto`, `frete`, `freteGratis`, `valorFaltanteFreteGratis`, `total`, `cupom{codigo,aplicado,mensagem}`.
Erro: `{"erro":{"codigo","mensagem","campo"}}`.

| Status | Código | Quando |
|--------|--------|--------|
| 400 | JSON_INVALIDO | Corpo não é objeto JSON válido |
| 404 | ROTA_NAO_ENCONTRADA | Rota inexistente |
| 404 | PRODUTO_NAO_ENCONTRADO | GET produto com id inexistente |
| 405 | METODO_NAO_PERMITIDO | Rota existe, método não aceito |
| 422 | ITENS_OBRIGATORIOS | Itens ausente ou vazio |
| 422 | ITEM_INVALIDO | Item não é objeto com produtoId e quantidade |
| 422 | PRODUTO_NAO_ENCONTRADO | Item referencia produto inexistente |
| 422 | ITEM_DUPLICADO | Mesmo produto repetido |
| 422 | QUANTIDADE_INVALIDA | Não é inteiro ≥ 1 |
| 422 | QUANTIDADE_MAXIMA_EXCEDIDA | Quantidade > 5 |
| 422 | DADOS_INVALIDOS | Dados do cliente inválidos (detalhes em `campos`) |
| 422 | CUPOM_INVALIDO | Pedido com cupom inexistente |
| 422 | CUPOM_EXPIRADO | Pedido com cupom expirado |

### Sobre este ambiente — comportamentos ESPERADOS (não são bug)
- Carrinho guardado só na aba do navegador (outra aba/janela anônima = vazio)
- Pedidos não armazenados; número fictício; sem consulta de pedidos
- Nenhum e-mail enviado, nenhuma cobrança
- Produtos, preços e cupons fixos; sem controle de estoque
- API stateless
- Fora do escopo: login, cadastro de clientes, pagamento online, consulta de pedidos
