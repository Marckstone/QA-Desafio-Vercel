// Oráculo: recalcula em centavos (inteiros) e compara com POST /api/carrinho/calcular
const B = 'https://verzel-store.qa-test-verzel-store.workers.dev';
const preco = { P001: 5990, P002: 13990, P003: 18990, P004: 4990, P005: 10000, P006: 2990, P007: 22990, P008: 5000 };
const ids = Object.keys(preco);
let seed = 42; const rnd = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
const divergentes = []; let n = 0;
for (let i = 0; i < 300; i++) {
  const itens = ids.filter(() => rnd() < 0.35).map((id) => ({ produtoId: id, quantidade: 1 + Math.floor(rnd() * 5) }));
  if (!itens.length) continue;
  const cupom = rnd() < 0.5 ? 'BEMVINDO10' : undefined;
  const sub = itens.reduce((s, it) => s + preco[it.produtoId] * it.quantidade, 0);
  const desc = cupom ? Math.round(sub * 0.10) : 0;
  const frete = sub >= 20000 ? 0 : 1990;
  const esp = { subtotal: sub / 100, desconto: desc / 100, frete: frete / 100, freteGratis: frete === 0, valorFaltanteFreteGratis: Math.max(0, 20000 - sub) / 100, total: (sub - desc + frete) / 100 };
  const r = await (await fetch(B + '/api/carrinho/calcular', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ itens, cupom }) })).json();
  n++;
  const dif = Object.keys(esp).filter((k) => Math.abs(esp[k] - r[k]) > 1e-9 && esp[k] !== r[k]);
  if (dif.length) divergentes.push({ sub: esp.subtotal, dif: dif.map((k) => `${k}: esp ${esp[k]} / obtido ${r[k]}`), cupom: !!cupom });
}
console.log('casos', n, 'divergentes', divergentes.length);
const porSub200 = divergentes.filter((d) => d.sub === 200).length;
console.log('divergentes com subtotal exatamente 200:', porSub200);
console.log('outros:', JSON.stringify(divergentes.filter((d) => d.sub !== 200).slice(0, 8), null, 1));
