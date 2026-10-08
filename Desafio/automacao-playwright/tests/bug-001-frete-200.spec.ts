/**
 * Cenário 5 (P0) — CT09 ✱ Regressão do BUG-001: frete grátis "a partir de R$ 200,00, inclusive" (CA06)
 * Fonte: Desafio/Cenarios/base.md · Bug: Desafio/Bug-report/bug-001.md
 *
 * ESTE SPEC FALHA ENQUANTO O BUG-001 EXISTIR (assertiva = comportamento esperado).
 * Depois da correção ele passa e fica como teste de regressão.
 */
import { test, expect } from '@playwright/test';
import { abrirCarrinho, adicionarPelaVitrine, valorResumo } from './helpers';

test('BUG-001 / CT09 (API) — subtotal exatamente R$ 200,00 tem frete grátis', async ({ request }) => {
  const res = await request.post('/api/carrinho/calcular', { data: { itens: [{ produtoId: 'P005', quantidade: 2 }] } });
  expect(res.status()).toBe(200);
  const corpo = await res.json();
  expect(corpo.subtotal).toBe(200);
  expect(corpo.freteGratis).toBe(true);
  expect(corpo.frete).toBe(0);
  expect(corpo.total).toBe(200);
});

test('BUG-001 / CT09 (UI) — carrinho de R$ 200,00 mostra frete Grátis', async ({ page }) => {
  await adicionarPelaVitrine(page, 'Mochila Urbana 20L', 2);
  await abrirCarrinho(page);
  await expect(valorResumo(page, 'subtotal')).toHaveText('R$ 200,00');
  await expect(valorResumo(page, 'frete')).toHaveText('Grátis');
  await expect(valorResumo(page, 'total')).toHaveText('R$ 200,00');
});

test('controle — R$ 199,80 ainda cobra frete (a fronteira abaixo está correta)', async ({ request }) => {
  const res = await request.post('/api/carrinho/calcular', {
    data: { itens: [{ produtoId: 'P001', quantidade: 1 }, { produtoId: 'P002', quantidade: 1 }] },
  });
  const corpo = await res.json();
  expect(corpo.subtotal).toBe(199.8);
  expect(corpo.frete).toBe(19.9);
  expect(corpo.valorFaltanteFreteGratis).toBe(0.2);
});
