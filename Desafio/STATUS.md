# STATUS — VZS-142 (Cupom de desconto e frete grátis · Verzel Store)

*Foto do estado atual para retomar em sessão nova — reescrita a cada atualização, não é diário (decisão D1). Histórico completo: [INDICE.md](INDICE.md). Limite: ~80 linhas.*
*Atualizado: 2026-10-08*

## Como retomar

1. Leia **apenas este arquivo**. Abra o INDICE/Cenarios só no trecho do que for executar.
2. Uma sessão = uma execução E2E. Ao terminar: atualize este arquivo (+ INDICE), commit, só então `/clear`.
3. Ao pausar: registre em "Onde parou".

## Cenários

45 CTs em 14 cenários ([base.md](Cenarios/base.md)). Resultado detalhado por CT: [Evidencias/evidencias.md](Evidencias/evidencias.md).

| Resultado | CTs |
|-----------|-----|
| ✅ Feito (36) | todos os demais |
| ⚠ Feito com observação (4) | CT03, CT24, CT31 (BUG-003), CT39 |
| ❌ Falhou — bug (5) | CT09, CT10, CT25 (BUG-001) · CT28, CT40 (BUG-002) |

*Legenda: ⏳ Pendente · 🔄 Em execução · ✅ Feito · ⏸ Pausado · ❌ Falhou/cancelado*

Automação (✱): CT01 (feliz), CT20 (candidato 🤖), CT09 (regressão BUG-001). Rodar: ver [automacao-playwright/README.md](automacao-playwright/README.md). Hoje: 4 passam, 2 falham de propósito.

## Onde parou

- Concluído em 2026-10-08: planejamento, execução (API + UI), 3 bugs, 3 specs, documentação. Entrega enviada à Verzel.
- Em 2026-10-24, após o retorno do processo: severidade e prioridade dos 3 bugs fechadas com justificativa; todos os cenários de `base.md` reescritos em Gherkin (Esquema do Cenário + Exemplos); observações ⚠ decididas em `evidencias.md`.
- Nada pendente neste desafio.

## Massa de teste

- Produtos P001–P008, cupons `BEMVINDO10` e `VERAO2026` ([enunciado.md](../Enunciado/enunciado.md)). Ambiente sem estado: nada a limpar.

## Bugs abertos

| Link/ID | Resumo | Severidade · Prioridade |
|------|--------|-----------|
| [BUG-001](Bug-report/bug-001.md) | Subtotal R$ 200,00 exato cobra frete (CA06) | Alta · P1 |
| [BUG-002](Bug-report/bug-002.md) | API sem limite de 5 unidades (CA10) | Alta · P2 |
| [BUG-003](Bug-report/bug-003.md) | `produtoId` ausente → "Produto undefined" | Baixa · P3 |
