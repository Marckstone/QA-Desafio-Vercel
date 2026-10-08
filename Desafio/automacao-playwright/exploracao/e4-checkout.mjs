import { chromium } from '@playwright/test';
import fs from 'node:fs';
const U = 'https://verzel-store.qa-test-verzel-store.workers.dev', OUT = '../Evidencias/ui/'; const log = [];
const L = (m) => { console.log(m); log.push(m); };
const b = await chromium.launch();
async function nova(itens, cup) { const p = await (await b.newContext({ viewport: { width: 1280, height: 900 } })).newPage(); p.setDefaultTimeout(6000);
  await p.goto(U + '/'); for (const [i, q] of itens) for (let k = 0; k < q; k++) await p.getByRole('button', { name: 'Adicionar ao carrinho' }).nth(i).click();
  await p.goto(U + '/carrinho'); if (cup) { await p.getByRole('textbox', { name: 'Cupom de desconto' }).fill(cup); await p.getByRole('button', { name: 'Aplicar cupom' }).click(); await p.waitForTimeout(700); }
  await p.getByRole('link', { name: 'Finalizar compra' }).click(); await p.waitForTimeout(700); return p; }
const main = async (p) => (await p.locator('main').innerText()).replace(/\n+/g, ' | ');
try {
  let p = await nova([[4, 1]], 'BEMVINDO10');
  L('CHECKOUT url=' + p.url()); L((await p.locator('main').ariaSnapshot()).split('\n').filter((l) => /textbox|button|heading|link|term|definition|paragraph/.test(l)).join('\n'));
  await p.screenshot({ path: OUT + 'CT15-checkout-form.png' });
  const f = async (n, e, c) => { await p.getByRole('textbox', { name: /nome/i }).fill(n); await p.getByRole('textbox', { name: /e-?mail/i }).fill(e); await p.getByRole('textbox', { name: /cep/i }).fill(c); await p.getByRole('button', { name: /confirmar|finalizar|enviar|pedido/i }).click(); await p.waitForTimeout(900); };
  await f('Maria Silva', 'maria@exemplo.com', '01310-100'); L('CT15 -> ' + (await main(p)).slice(0, 500)); await p.screenshot({ path: OUT + 'CT15-pedido-confirmado.png' });
  for (const [id, n, e, c] of [['CT16', 'Maria', 'maria@exemplo.com', '01310100'], ['CT16.1a', 'Maria Silva', 'maria@', '01310100'], ['CT16.1b', 'Maria Silva', 'maria.com', '01310100'], ['CT16.2a', 'Maria Silva', 'maria@exemplo.com', '0131010'], ['CT16.2b', 'Maria Silva', 'maria@exemplo.com', '013101000'], ['CT16.2c', 'Maria Silva', 'maria@exemplo.com', '0131010a'], ['CT16.3', '', '', '']]) {
    p = await nova([[4, 1]]); await f(n, e, c); L(`${id} (${n}|${e}|${c}) -> ` + (await main(p)).slice(0, 360)); if (id === 'CT16') await p.screenshot({ path: OUT + 'CT16-nome-invalido.png' }); }
  p = await nova([[4, 1]]); await f('Maria Silva', 'maria@exemplo.com', '01310100'); L('CT15b sem cupom, cep sem hifen -> ' + (await main(p)).slice(0, 300));
  L('CT17 menções de pagamento: ' + ((await main(p)).match(/pagamento[^|]*/gi) || ['nenhuma']).join(' ; '));
} catch (e) { L('ERRO ' + e.message.split('\n')[0]); } finally { fs.writeFileSync(OUT + 'resultados-checkout.txt', log.join('\n') + '\n'); await b.close(); }
