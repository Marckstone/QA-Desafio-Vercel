# STATUS — VZS-142 (Cupom de desconto e frete grátis · Verzel Store)

*Foto do estado atual para retomar em sessão nova — reescrita a cada atualização, não é diário (decisão D1). Histórico completo: [INDICE.md](INDICE.md). Limite: ~80 linhas.*
*Atualizado: 2026-10-08*

## Como retomar

1. Leia **apenas este arquivo**. Abra o INDICE/Cenarios só no trecho do que for executar.
2. Uma sessão = uma execução E2E. Ao terminar: atualize este arquivo (+ INDICE), commit, só então `/clear`.
3. Ao pausar: registre em "Onde parou".

## Cenários

45 CTs em 14 cenários (ver [base.md](Cenarios/base.md)). Todos ⏳ Pendente. Candidatos a automação (🤖): CT01, CT09, CT10, CT11.1, CT20, CT28.

| Grupo | CTs | Status |
|-------|-----|--------|
| UI cupom/frete/limite (Cen. 1–7) | CT01–CT14.1 | ⏳ Pendente |
| Checkout (Cen. 8) | CT15–CT17 | ⏳ Pendente |
| API (Cen. 9–12) | CT18–CT41 | ⏳ Pendente |
| Integração/Regressão (Cen. 13–14) | CT42–CT45 | ⏳ Pendente |

*Legenda: ⏳ Pendente · 🔄 Em execução · ✅ Feito · ⏸ Pausado · ❌ Cancelado*

## Onde parou

- Planejamento concluído (Enunciado, Descricao, Estrategia, Cenarios, INDICE) em 2026-10-08. **Aguardando aprovação do Marcus** para iniciar a execução.
- Próximo passo: executar API (curl) → UI (navegador embutido) → bugs → 3 specs Playwright → README + evidências. Material de "aula" da API fica fora do repo (pasta local fora do git).

## Massa de teste

- Produtos P001–P008, cupons `BEMVINDO10` e `VERAO2026` (ver [enunciado.md](../Enunciado/enunciado.md)). Ambiente compartilhado, sem estado: nada a limpar.

## Bugs abertos

| Link/ID | Resumo | Severidade |
|------|--------|-----------|
| — | — | — |
