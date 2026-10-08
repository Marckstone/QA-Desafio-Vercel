// Bateria exploratória de UI (gera evidências em ../Evidencias/ui). Não é spec: roda uma vez e registra o observado.
import { chromium } from '@playwright/test';
import fs from 'node:fs';
const U = 'https://verzel-store.qa-test-verzel-store.workers.dev';
const OUT = '../Evidencias/ui/';
const log = [];
const L = (ct, msg) => { const l = `${ct} | ${msg}`; console.log(l); log.push(l); };

const b = await chromium.launch();
const nova = async () => { const p = await (await b.newContext({ viewport: { width: 1280, height: 900 } })).newPage(); p.setDefaultTimeout(6000); return p; };
const main = async (p) => (await p.locator('main').innerText()).replace(/\n+/g, ' | ');
const resumo = async (p) => {
  await p.waitForTimeout(900);
  const t = await main(p);
  const g = (re) => (t.match(re) || [, '?'])[1];
  return `sub=${g(/Subtotal \| (R\$ [\d.,]+)/)} desc=${g(/Desconto[^|]*\| (-? ?R\$ [\d.,]+)/)} frete=${g(/Frete \| ([^|]+?) \|/)} total=${g(/Total \| (R\$ [\d.,]+)/)} | ${g(/(Faltam R\$ [\d.,]+ para o frete grátis\.|Frete grátis[^|]*)/)}`;
};
const add = async (p, idx, q = 1) => { await p.goto(U + '/'); for (let i = 0; i < q; i++) await p.getByRole('button', { name: 'Adicionar ao carrinho' }).nth(idx).click(); };
const cart = async (p, itens) => { await p.goto(U + '/'); for (const [idx, q] of itens) for (let i = 0; i < q; i++) await p.getByRole('button', { name: 'Adicionar ao carrinho' }).nth(idx).click(); await p.goto(U + '/carrinho'); };
const cupom = async (p, c) => { await p.getByRole('textbox', { name: 'Cupom de desconto' }).fill(c); await p.getByRole('button', { name: 'Aplicar cupom' }).click(); await p.waitForTimeout(700); };
const msg = async (p) => { const t = await main(p); return (t.match(/(Cupom [^|]*\.)/) || [, '(sem mensagem)'])[1]; };
const shot = (p, n) => p.screenshot({ path: OUT + n + '.png' });
const P = { P001: 0, P002: 1, P003: 2, P004: 3, P005: 4, P006: 5, P007: 6, P008: 7 };

async function ct(id, fn) { const p = await nova(); try { await fn(p); } catch (e) { L(id, 'ERRO: ' + e.message.split('\n')[0]); } await p.context().close(); }

await ct('CT01', async (p) => { await cart(p, [[P.P002, 1], [P.P004, 2]]); await cupom(p, 'BEMVINDO10'); L('CT01', await resumo(p) + ' | ' + await msg(p)); await shot(p, 'CT01-cupom-valido'); });
await ct('CT02', async (p) => { await cart(p, [[P.P005, 1]]); await cupom(p, 'BEMVINDO10'); L('CT02', await resumo(p)); await shot(p, 'CT02-desconto-sem-frete'); });
await ct('CT02.1', async (p) => { await cart(p, [[P.P001, 3]]); await cupom(p, 'BEMVINDO10'); L('CT02.1', await resumo(p)); });
for (const [id, c] of [['CT03', 'bemvindo10'], ['CT03a', 'BemVindo10'], ['CT03.1', '  BEMVINDO10  '], ['CT03.2', 'BEM VINDO10'], ['CT03.3a', ''], ['CT03.3b', '   ']])
  await ct(id, async (p) => { await cart(p, [[P.P005, 1]]); await cupom(p, c); L(id, `entrada=${JSON.stringify(c)} -> ${await resumo(p)} | ${await msg(p)}`); });
await ct('CT04', async (p) => { await cart(p, [[P.P005, 1]]); await cupom(p, 'XPTO123'); L('CT04', await resumo(p) + ' | ' + await msg(p)); await shot(p, 'CT04-cupom-invalido'); });
await ct('CT05', async (p) => { await cart(p, [[P.P005, 1]]); await cupom(p, 'VERAO2026'); L('CT05', await resumo(p) + ' | ' + await msg(p)); await shot(p, 'CT05-cupom-expirado');
  await cupom(p, 'BEMVINDO10'); L('CT05.1', 'apos erro, valido -> ' + await resumo(p)); });
await ct('CT06/07', async (p) => { await cart(p, [[P.P005, 1]]); await cupom(p, 'BEMVINDO10');
  L('CT06', 'campo de cupom visivel com cupom ativo? ' + await p.getByRole('textbox', { name: 'Cupom de desconto' }).isVisible() + ' | botao Remover cupom: ' + await p.getByRole('button', { name: 'Remover cupom' }).isVisible());
  await p.getByRole('button', { name: 'Remover cupom' }).click(); await p.waitForTimeout(500); L('CT07', 'apos remover: ' + await resumo(p));
  await cupom(p, 'VERAO2026'); L('CT07.1', 'troca p/ expirado: ' + await resumo(p) + ' | ' + await msg(p)); });
await ct('CT08', async (p) => { await cart(p, [[P.P005, 1]]); L('CT08', await resumo(p)); await shot(p, 'CT08-abaixo-200'); });
await ct('CT09', async (p) => { await cart(p, [[P.P005, 2]]); L('CT09', 'SUBTOTAL 200,00 -> ' + await resumo(p)); await shot(p, 'CT09-fronteira-200-BUG'); });
await ct('CT09.1', async (p) => { await cart(p, [[P.P001, 1], [P.P002, 1]]); L('CT09.1', await resumo(p)); });
await ct('CT09.2', async (p) => { await cart(p, [[P.P001, 2], [P.P005, 1]]); L('CT09.2', 'subtotal 219,80 -> ' + await resumo(p)); });
await ct('CT10', async (p) => { await cart(p, [[P.P005, 2]]); await cupom(p, 'BEMVINDO10'); L('CT10', 'subtotal 200 + cupom -> ' + await resumo(p)); await shot(p, 'CT10-200-com-cupom'); });
await ct('CT10.2', async (p) => { await cart(p, [[P.P002, 1], [P.P001, 1], [P.P004, 1]]); await cupom(p, 'BEMVINDO10'); L('CT10.2', 'subtotal 249,70, pos-cupom 224,73 -> ' + await resumo(p)); });
await ct('CT10.1', async (p) => { await cart(p, [[P.P003, 1]]); await cupom(p, 'BEMVINDO10'); L('CT10.1', await resumo(p)); });
await ct('CT11', async (p) => { await cart(p, [[P.P004, 5]]); L('CT11', '5 un: ' + await resumo(p)); L('CT11.1', 'botao + habilitado? ' + await p.getByRole('button', { name: /Aumentar quantidade/ }).isEnabled() + ' | ' + ((await main(p)).match(/Limite[^|]*/) || ['sem aviso'])[0]); await shot(p, 'CT11-limite-5'); });
await ct('CT11.2', async (p) => { await p.goto(U + '/'); const btn = p.getByRole('button', { name: 'Adicionar ao carrinho' }).nth(3); for (let i = 0; i < 7; i++) await btn.click({ timeout: 800 }).catch(() => {}); await p.goto(U + '/carrinho'); L('CT11.2', 'vitrine x7 cliques -> ' + (await main(p)).slice(0, 140)); });
await ct('CT11.2b', async (p) => { await p.goto(U + '/'); const btn = p.getByRole('button', { name: 'Adicionar ao carrinho' }).nth(3); for (let i = 0; i < 5; i++) await btn.click(); L('CT11.2b', 'apos 5 cliques, botao vitrine habilitado? ' + await btn.isEnabled() + ' | texto=' + (await btn.innerText())); await shot(p, 'CT11.2-vitrine-limite'); });
await ct('CT11.3', async (p) => { await cart(p, [[P.P004, 5], [P.P006, 5]]); L('CT11.3', await resumo(p)); });
await ct('CT13', async (p) => { await cart(p, [[P.P001, 2], [P.P002, 1]]); await p.getByRole('button', { name: /Diminuir quantidade de Camiseta/ }).click(); L('CT13', 'apos -1 camiseta: ' + await resumo(p));
  await p.getByRole('button', { name: /Remover Calça/ }).click(); L('CT13', 'apos remover calca: ' + await resumo(p));
  await p.getByRole('button', { name: 'Esvaziar carrinho' }).click(); await p.waitForTimeout(400); L('CT13', 'apos esvaziar: ' + (await main(p)).slice(0, 160)); await shot(p, 'CT13-carrinho-vazio'); });
await ct('CT14', async (p) => { await cart(p, [[P.P005, 1]]); await cupom(p, 'BEMVINDO10'); await p.getByRole('button', { name: /Aumentar quantidade/ }).click(); await p.waitForTimeout(500); L('CT14', 'cupom ativo + qtd 2: ' + await resumo(p)); });
await ct('CT14.1', async (p) => { await cart(p, [[P.P005, 1]]); await cupom(p, 'BEMVINDO10'); await p.reload(); await p.waitForTimeout(600); L('CT14.1', 'apos reload: ' + await resumo(p) + ' | ' + await msg(p)); });
await ct('CT45', async (p) => { await p.goto(U + '/'); L('CT45', 'cards=' + await p.getByRole('button', { name: 'Adicionar ao carrinho' }).count()); await shot(p, 'CT45-vitrine'); });

fs.writeFileSync(OUT + 'resultados-ui.txt', log.join('\n') + '\n');
await b.close();
