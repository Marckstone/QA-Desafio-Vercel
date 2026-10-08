/**
 * Cenário 10 (P0) — CT20 🤖 ✱ Contrato e valores de POST /api/carrinho/calcular
 * Cobre CA01, CA03/CA04 (cupom ruim = 200 sem desconto), CA06/CA07 (abaixo de 200), CA11.
 * Fonte: Desafio/Cenarios/base.md
 */
import { test, expect } from '@playwright/test';

const itens = [
  { produtoId: 'P002', quantidade: 1 },
  { produtoId: 'P004', quantidade: 2 },
];

test('CT20 — exemplo da documentação: 10% de desconto, frete grátis, total 215.73', async ({ request }) => {
  const res = await request.post('/api/carrinho/calcular', { data: { itens, cupom: 'BEMVINDO10' } });
  expect(res.status()).toBe(200);
  const corpo = await res.json();
  expect(corpo).toMatchObject({
    subtotal: 239.7,
    desconto: 23.97,
    frete: 0,
    freteGratis: true,
    valorFaltanteFreteGratis: 0,
    total: 215.73,
    cupom: { codigo: 'BEMVINDO10', aplicado: true },
  });
  expect(corpo.itens).toHaveLength(2);
});

test('CT22/CT23 — cupom inexistente e expirado: 200, sem desconto, motivo em cupom.mensagem', async ({ request }) => {
  const casos = [
    { cupom: 'XPTO123', mensagem: 'Cupom inválido.' },
    { cupom: 'VERAO2026', mensagem: 'Cupom expirado.' },
  ];
  for (const { cupom, mensagem } of casos) {
    const res = await request.post('/api/carrinho/calcular', { data: { itens: [{ produtoId: 'P005', quantidade: 1 }], cupom } });
    expect(res.status()).toBe(200);
    const corpo = await res.json();
    expect(corpo.desconto).toBe(0);
    expect(corpo.total).toBe(119.9); // 100,00 + frete 19,90
    expect(corpo.cupom).toMatchObject({ aplicado: false, mensagem });
  }
});
