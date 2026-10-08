import { expect, Page } from '@playwright/test';

/** Adiciona `qtd` unidades de um produto pela vitrine (/). */
export async function adicionarPelaVitrine(page: Page, produto: string, qtd = 1) {
  await page.goto('/');
  const card = page.getByRole('heading', { name: produto }).locator('xpath=ancestor::*[.//button][1]');
  for (let i = 0; i < qtd; i++) await card.getByRole('button', { name: 'Adicionar ao carrinho' }).click();
}

export async function abrirCarrinho(page: Page) {
  await page.goto('/carrinho');
  await expect(page.getByRole('region', { name: 'Resumo do pedido' })).toBeVisible();
}

export async function aplicarCupom(page: Page, codigo: string) {
  await page.getByRole('textbox', { name: 'Cupom de desconto' }).fill(codigo);
  await page.getByRole('button', { name: 'Aplicar cupom' }).click();
}

/** Valor do Resumo do pedido pelo atributo data-valor do site (subtotal | desconto | frete | total). */
export function valorResumo(page: Page, campo: 'subtotal' | 'desconto' | 'frete' | 'total') {
  return page.getByRole('region', { name: 'Resumo do pedido' }).locator(`dd[data-valor="${campo}"]`);
}
