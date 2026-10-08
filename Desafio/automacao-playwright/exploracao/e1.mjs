import { run, U, txt, addVitrine } from './lib.mjs';
await run(async (p) => {
  await addVitrine(p, 4, 2); // P005 x2 = 200,00
  await p.goto(U + '/carrinho');
  const box = p.getByRole('textbox', { name: 'Cupom de desconto' });
  const aplicar = async (c) => {
    await box.fill(c);
    await p.getByRole('button', { name: 'Aplicar cupom' }).click();
    await p.waitForTimeout(700);
    console.log(JSON.stringify(c), '=>', (await txt(p)).slice(60, 420));
  };
  await aplicar('bemvindo10');
  console.log((await p.locator('main').ariaSnapshot()).split('\n').filter((l) => /button|textbox|status|alert|upom/i.test(l)).join('\n'));
  await p.screenshot({ path: '../Evidencias/ui/cupom-aplicado-200.png' });
});
