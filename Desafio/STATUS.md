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

- Planejamento, execução (API + UI), 3 bugs, 3 specs e documentação **concluídos** em 2026-10-08.
- **Falta (Marcus):** (1) revisar severidade dos 3 bugs e as observações ⚠; (2) criar o repositório público no GitHub e dar push (`git remote add` + `git push`); (3) preencher o formulário https://elitedev.verzel.com.br/ (usar a seção "Uso de IA" do README raiz, ajustada ao que for verdade); (4) opcional: conferência visual mobile.
- Material de aula da API: fora do repo, em `C:\Users\Marcus\QA-Desafio-Vercel-aula\`.

## Massa de teste

- Produtos P001–P008, cupons `BEMVINDO10` e `VERAO2026` ([enunciado.md](../Enunciado/enunciado.md)). Ambiente sem estado: nada a limpar.

## Bugs abertos

| Link/ID | Resumo | Severidade |
|------|--------|-----------|
| [BUG-001](Bug-report/bug-001.md) | Subtotal R$ 200,00 exato cobra frete (CA06) | Alta |
| [BUG-002](Bug-report/bug-002.md) | API sem limite de 5 unidades (CA10) | Alta |
| [BUG-003](Bug-report/bug-003.md) | `produtoId` ausente → "Produto undefined" | Baixa |
