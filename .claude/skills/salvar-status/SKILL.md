---
name: salvar-status
description: Atualiza o Desafio/STATUS.md como foto do estado atual e faz commit só da pasta tocada. Use quando o usuário pedir para "salvar o status", "atualizar o STATUS.md", "pausar aqui", "registrar onde parei", ao terminar uma execução antes do /clear, ou quando o alerta de contexto (~200 mil tokens) for aprovado pelo usuário.
---

# Salvar o STATUS.md

> Skill curta de propósito (≤ ~10 mil caracteres). Exemplos e histórico vão para anexo nesta pasta.

## Quando usar
- Fim de uma execução (antes do `/clear`) ou pausa para outra tarefa.
- Alerta de ~200 mil tokens, **depois que o usuário aprovar**. Nunca interrompa no meio sem perguntar.

## Passos
1. **Identifique a frente** em andamento (`Desafio/` ou `Desafio-<nome>/`). Dúvida → pergunte.
2. **Leia o `STATUS.md` atual** (se não existir, copie de `Desafio/STATUS.md` do template).
3. **Reescreva como foto do agora**, sem diário:
   - tabela de CTs: status e evidência dos que mudaram;
   - "Onde parou": ponto atual (etapa, o que falta, próximo passo). Se pausa: `Pausado em AAAA-MM-DD: <motivo>; próximo passo: <...>`;
   - massa de teste e bugs abertos: corrija o que mudou;
   - **apague** o que não serve mais para retomar. Limite ~80 linhas.
4. **Histórico → `INDICE.md`:** entrada nova via `grep` + `Edit` no trecho, sem ler o arquivo inteiro.
5. **Commit só da pasta tocada:** `git add Desafio/` e `docs(desafio): atualiza STATUS (<resumo>)`. Nunca `git add .`. Push só se o usuário pedir.
6. **Confirme em 2–3 linhas:** o que mudou em "Onde parou", o hash do commit, e que já pode rodar `/clear`.
