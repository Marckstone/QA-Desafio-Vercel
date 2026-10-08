# VZS-142 — Cupom de desconto e frete grátis

## Objetivo

Adicionar à Verzel Store (v2.3.0, publicada em 30/09/2026) a aplicação de um cupom de desconto no carrinho e a regra de frete grátis. Os cálculos são feitos pela API e a interface apenas exibe o resultado.

---

## Motivação

História: *"Como cliente da Verzel Store, quero aplicar um cupom de desconto e ganhar frete grátis em compras maiores, para pagar menos nas minhas compras."*

---

## Fora do Escopo

Login, cadastro de clientes, pagamento online, consulta de pedidos; testes de carga, estresse e segurança (regra do desafio).

---

## Premissas

- Ambiente compartilhado e *stateless*: carrinho vive só na aba do navegador; pedidos não são gravados; sem e-mail/cobrança; sem estoque; produtos, preços e cupons fixos. **Nada disso é bug** (seção "Sobre este ambiente" da documentação).
- A UI não calcula: qualquer divergência UI × API é suspeita de bug na camada de exibição ou de integração.

---

# Regras de Negócio

Superfícies reais: loja `/` (vitrine), `/carrinho`, `/documentacao`; API `/api/produtos`, `/api/produtos/{id}`, `/api/carrinho/calcular`, `/api/pedidos`.

## 1. Fórmula do total (CA11)

`total = subtotal − desconto + frete`, tudo arredondado a 2 casas.

| Valor | Cálculo |
|-------|---------|
| Subtotal | Σ preço unitário × quantidade |
| Desconto | % do cupom × subtotal; 0 sem cupom válido |
| Frete | R$ 0,00 se subtotal ≥ 200,00; senão R$ 19,90 |
| Faltante | max(0, 200,00 − subtotal) |

## 2. Cupom (CA01–CA05, CA09)

| Código | Desconto | Situação | Mensagem sem desconto |
|--------|----------|----------|-----------------------|
| `BEMVINDO10` | 10% | Válido | — |
| `VERAO2026` | 15% | Expirado em 31/03/2026 | "Cupom expirado." |
| qualquer outro | — | Inexistente | "Cupom inválido." |

- Case-insensitive; espaços nas pontas ignorados (CA02).
- Um cupom por vez; trocar = remover + aplicar (CA05).
- Desconto incide só sobre produtos, nunca sobre o frete (CA09).
- API: `/calcular` → 200 sem desconto, motivo em `cupom.mensagem`; `/pedidos` → 422 `CUPOM_INVALIDO` / `CUPOM_EXPIRADO`.

## 3. Frete grátis (CA06–CA08)

| Subtotal (antes do cupom) | Frete | Faltante |
|---------------------------|-------|----------|
| < 200,00 | 19,90 | 200 − subtotal |
| ≥ 200,00 (inclusive) | 0,00 | 0 |

## 4. Limite por produto (CA10)

Máx. 5 unidades por produto, na UI e na API (`QUANTIDADE_MAXIMA_EXCEDIDA`). Quantidade deve ser inteira ≥ 1 (`QUANTIDADE_INVALIDA`).

## 5. Regras pré-existentes

Nome com nome e sobrenome · e-mail em formato válido · CEP com 8 dígitos (com/sem hífen; a API devolve só dígitos) · pagamento na entrega.

## Resumo das Fontes de Verdade

| Etapa | Fonte Principal |
|-------|----------------|
| Regras e CA | `/documentacao` (cópia em [Enunciado/enunciado.md](../../Enunciado/enunciado.md)) |
| Valores calculados | Resposta de `POST /api/carrinho/calcular` (a UI só exibe) |
| Contrato de erro | Tabela "Códigos de erro" da documentação |

---

## Pontos de Atenção para Testes

- Fronteira de R$ 200,00: P005 x2 (=200,00), P001+P002 (=199,80).
- Subtotal ≥ 200 mas < 200 após o cupom (P005 x2 + BEMVINDO10 = 180,00) deve manter frete grátis (CA08).
- Ponto flutuante: `59.9 * 3 = 179.70000000000002` — checar CA11 em subtotais e descontos.
- `/calcular` tolera cupom ruim (200), `/pedidos` não (422) — comportamento diferente é intencional.
- Limite de 5 precisa valer na UI **e** na API (testar burlar a UI chamando a API direto).
- Tipos de `quantidade` fora do esperado (string, decimal, null, 0, negativo).

*Última atualização: 10/2026*
