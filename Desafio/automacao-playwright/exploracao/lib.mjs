// Utilitário das explorações de UI (não são specs): abre o navegador, executa e sempre fecha.
import { chromium } from '@playwright/test';

export const U = 'https://verzel-store.qa-test-verzel-store.workers.dev';

export async function run(fn) {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  p.setDefaultTimeout(8000);
  try { await fn(p); } catch (e) { console.log('ERRO:', e.message.split('\n')[0]); } finally { await b.close(); }
}

export const txt = async (p) => (await p.locator('main').innerText()).replace(/\n+/g, ' | ');

// adiciona pela vitrine: índice do produto (0=P001 ... 7=P008) x quantidade
export async function addVitrine(p, idx, qtd = 1) {
  await p.goto(U + '/');
  for (let i = 0; i < qtd; i++) await p.getByRole('button', { name: 'Adicionar ao carrinho' }).nth(idx).click();
}
