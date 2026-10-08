/**
 * Cenário 1 (P0) — CT01 🤖 ✱ Caminho feliz: cupom BEMVINDO10 (CA01, CA08, CA09, CA11)
 * Fonte: Desafio/Cenarios/base.md
 *
 * Dado P002 x1 + P004 x2 (subtotal R$ 239,70)
 * Quando aplico "BEMVINDO10"
 * Então desconto R$ 23,97, frete grátis e total R$ 215,73
 */
import { test, expect } from '@playwright/test';
import { abrirCarrinho, adicionarPelaVitrine, aplicarCupom, valorResumo } from './helpers';

test('CT01 — cupom BEMVINDO10 aplica 10% sobre o subtotal e mantém frete grátis', async ({ page }) => {
  await adicionarPelaVitrine(page, 'Calça Jeans Slim', 1);
  await adicionarPelaVitrine(page, 'Boné Aba Curva', 2);
  await abrirCarrinho(page);
  await expect(valorResumo(page, 'subtotal')).toHaveText('R$ 239,70');

  await aplicarCupom(page, 'BEMVINDO10');

  await expect(page.getByText('Cupom BEMVINDO10 aplicado.')).toBeVisible();
  await expect(valorResumo(page, 'desconto')).toHaveText(/R\$ 23,97/);
  await expect(valorResumo(page, 'frete')).toHaveText('Grátis');
  await expect(valorResumo(page, 'total')).toHaveText('R$ 215,73');
});
