# Estratégia de Teste — VZS-142
## Cupom de desconto e frete grátis (Verzel Store v2.3.0)

---

## 1. Objetivo da Estratégia

Garantir que os critérios CA01–CA11 funcionam na UI e na API, que UI e API mostram os mesmos valores, e que o fluxo de compra pré-existente (dados do cliente, confirmação) não regrediu. Foco em risco financeiro (total errado) e na fronteira do frete.

---

## 2. Escopo

### Dentro do escopo
- Cupom (válido, inválido, expirado, normalização, um por vez)
- Frete grátis/faltante e fronteira de R$ 200,00
- Limite de 5 unidades (UI e API) e validações de entrada da API
- Arredondamento (CA11)
- Checkout: nome, e-mail, CEP, número do pedido
- Consistência UI × API

### Fora do escopo
- Carga, estresse, segurança; login, cadastro, pagamento online, consulta de pedidos
- Comportamentos simplificados de propósito (carrinho por aba, pedidos não gravados, sem estoque)

---

## 3. Tipos de Teste Aplicados

### 3.1 Funcional
- **Objetivo**: validar regras visíveis ao cliente
- **Cobertura**: `/`, `/carrinho`, checkout
- **Estratégia**: caminho feliz + análise de valor-limite (R$ 200, 5 unidades) + exceção (cupom ruim)

### 3.2 API
- **Objetivo**: validar contrato e regras sem a UI
- **Cobertura**: `GET /api/produtos[/{id}]`, `POST /api/carrinho/calcular`, `POST /api/pedidos`
- **Estratégia**: tabela de erros da documentação, um caso por código; tipos inválidos de `quantidade`

### 3.3 Integração
- **Objetivo**: UI exibe exatamente o que a API calcula
- **Estratégia**: mesma combinação de itens/cupom na UI e no `/calcular`

### 3.4 Regressão
- **Objetivo**: regras pré-existentes intactas
- **Cobertura**: compra sem cupom, validação de cliente

### 3.5 Automação (Playwright)
3 specs: caminho feliz (CT01), candidato 🤖 (CT20) e regressão do BUG-001 (CT09). Ver `Observações finais` em [base.md](../Cenarios/base.md).

---

## 4. Análise de Risco

| Risco | Severidade | Tipo de teste | Cenário |
|-------|-----------|---------------|---------|
| Total errado (desconto/frete/soma) | Crítica | Funcional / API | 1, 5, 10 |
| Frete decidido pelo subtotal pós-cupom (CA08) | Alta | Funcional / API | 5 (CT10) |
| Erro de fronteira em R$ 200,00 (> em vez de ≥) | Alta | Funcional / API | 5, 10 |
| Desconto incidindo sobre o frete (CA09) | Alta | Funcional | 1 (CT02) |
| Limite de 5 só na UI, burlável pela API (CA10) | Alta | API | 6, 11 |
| Arredondamento / ponto flutuante (CA11) | Média | Funcional / API | 1 (CT02.1), 10 (CT26) |
| Normalização do cupom (CA02) | Média | Funcional / API | 2, 10 (CT24) |
| Mensagens de cupom divergentes (CA03/CA04) | Média | Funcional / Integração | 3, 13 |
| Segundo cupom aplicado (CA05) | Média | Funcional | 4 |
| `quantidade` com tipos estranhos aceita | Média | API | 11 |
| UI diverge da API | Alta | Integração | 13 |
| Validação de cliente regrediu | Média | Funcional / Regressão | 8, 14 |
| `/pedidos` aceita cupom ruim ou ignora validação | Alta | API | 12 |

---

## 5. Critérios de Aceite de QA

- [ ] CA01–CA11 cada um coberto por ≥1 CT executado
- [ ] Nenhum bug Crítico/Alto aberto sem registro e decisão
- [ ] UI = API nas 3 combinações de CT42
- [ ] Os 3 specs Playwright rodam e os resultados batem com o relatório manual

---

## 6. Critério de Encerramento

- [ ] Todos os CTs P0 executados; demais executados ou justificados
- [ ] Bugs reportados com evidência em [Bug-report/](../Bug-report/)
- [ ] Evidências consolidadas em `Desafio/Evidencias/evidencias.md`
- [ ] README do repositório aponta cada entrega

---

## 7. Evidências Esperadas

### Funcional
- Prints dos estados de carrinho (antes/depois do cupom, fronteira, limite de 5)

### API
- Requisição + resposta (status e corpo) por CT, salvos em `evidencias/`

---

*Última atualização: 10/2026*
