import { run, U, txt } from './lib.mjs';
await run(async (p) => {
  await p.goto(U + '/'); const btn = p.getByRole('button', { name: 'Adicionar ao carrinho' }).nth(3);
  for (let i = 0; i < 7; i++) await btn.click({ timeout: 800 }).catch(() => {});
  await p.goto(U + '/carrinho'); await p.waitForTimeout(1000); console.log('CT11.2', (await txt(p)).slice(0, 260));
  console.log('storage:', JSON.stringify(await p.evaluate(() => ({ s: { ...sessionStorage }, l: { ...localStorage } }))));
  // adultera storage para 6 unidades e vai ao checkout (UI x API, CA10)
  await p.evaluate(() => { for (const k of Object.keys(sessionStorage)) { const v = sessionStorage.getItem(k); if (/P004/.test(v)) sessionStorage.setItem(k, v.replace(/"quantidade":5/, '"quantidade":6').replace(/"quantity":5/, '"quantity":6').replace(/"qty":5/, '"qty":6')); } });
  await p.goto(U + '/carrinho'); await p.waitForTimeout(1000); console.log('storage adulterado ->', (await txt(p)).slice(0, 300));
  await p.getByRole('link', { name: 'Finalizar compra' }).click().catch(() => {}); await p.waitForTimeout(500);
  await p.getByRole('textbox', { name: /nome/i }).fill('Maria Silva'); await p.getByRole('textbox', { name: /e-?mail/i }).fill('m@e.com'); await p.getByRole('textbox', { name: /cep/i }).fill('01310100');
  await p.getByRole('button', { name: 'Confirmar pedido' }).click(); await p.waitForTimeout(1000); console.log('pedido c/ 6 un ->', (await txt(p)).slice(0, 300));
  await p.getByRole('link', { name: /Continuar comprando/ }).click(); await p.goto(U + '/carrinho'); await p.waitForTimeout(800); console.log('carrinho apos pedido ->', (await txt(p)).slice(0, 120));
});
