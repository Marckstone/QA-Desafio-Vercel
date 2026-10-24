---
name: qa-planning
description: Conduz o planejamento de testes de um desafio/feature de ponta a ponta, sem depender de Jira — lê o enunciado, cruza com Regras-Globais, aponta ambiguidades e pergunta ao usuário antes de decidir, e cria os artefatos de QA no padrão do repositório (INDICE, STATUS, Descricao, Estrategia por risco, Cenarios em Gherkin). Use quando o usuário disser "vamos planejar os testes", "monte os cenários", "processe o Gherkin", "bora planejar o desafio", ou trouxer enunciado/Gherkin para virar planejamento — mesmo sem pedir a skill pelo nome.
---

# Planejamento de testes (genérico, sem Jira)

> Limite de referência: ~10 mil caracteres neste arquivo (D8). Aprendizado novo vai para anexo (`armadilhas.md`, `historico-de-uso.md`) nesta pasta.

## Por que existe
Planejar "de cabeça" pula duas coisas: (1) checar se o plano contradiz regras já registradas, (2) manter rastreabilidade quando surge fato novo. Este fluxo evita ambas e produz sempre o mesmo formato.

## Fluxo
1. Ler a fonte  2. Analisar conflitos/ambiguidades  3. Perguntar  4. Criar artefatos  5. Aguardar aprovação  6. Executar/ajustar  7. Absorver informação nova  8. Gate de entrega

Trate a ordem como default: se o usuário já respondeu uma ambiguidade, não repita a pergunta. **Tempo curto?** Se o usuário disser que está apertado, reduza Estrategia/Cenarios ao essencial, mas **não pule o gate da etapa 2**, a pergunta da etapa 3 nem o gate de entrega (etapa 8).

## 1. Ler a fonte
- Enunciado em `Enunciado/`, material bruto em `_inbox/`, ou texto colado no chat. Se houver URL/produto real a testar, anote ambiente e versão.
- Se o usuário já trouxe Gherkin pronto: **preserve-o**; seu papel é organizar, classificar por tipo, achar lacunas e ligar a risco — não reescrever.

## 2. Analisar conflitos e ambiguidades (etapa mais importante)
**Gate obrigatório:** leia TODOS os arquivos de `Regras-Globais/` e registre explicitamente "aplica-se / não se aplica e por quê" para cada um (pasta vazia = registre "nenhuma regra global ainda"). Releia a pasta a cada uso.

Procure: conflito de regra; requisito ambíguo ou sem critério de aceite mensurável; dependência entre cenários; lacunas (caminho de erro, limites, permissões, estados vazios); o que o enunciado pede mas o Gherkin não cobre (e vice-versa); itens que não são testáveis no ambiente disponível.

Via de mão dupla: regra que você documenta e que valerá em mais de um cenário → candidata a `Regras-Globais/regra-<assunto>.md` (crie quando a regra estiver confirmada, sem esperar o fim).

Apresente os achados em prosa **antes** de perguntar: resumo da fonte, depois conflitos/ambiguidades.

## 3. Perguntar antes de decidir
`AskUserQuestion`, até 4 perguntas por chamada, 2–4 opções concretas, recomendada primeiro "(Recomendado)". Não escreva artefatos antes das respostas (ou de instrução explícita para seguir com defaults). Cada decisão vira linha na tabela **Decisões de Escopo** do `INDICE.md`. Não escolha silenciosamente a recomendada.

## 4. Criar artefatos (não inventar formato novo)
Use os arquivos de `Desafio/` como molde; confira contra eles antes de escrever.

- **INDICE.md** — objetivo, premissas, tabela de Decisões de Escopo (ambiguidade + decisão + justificativa), bugs, regras envolvidas, cenários P0, pontos de atenção.
- **STATUS.md** — foto do estado atual (≤ ~80 linhas); ao fim do planejamento todos os CTs entram como ⏳ Pendente.
- **Descricao/descricao.md** — Objetivo, Motivação, Fora do Escopo, Premissas, Regras de Negócio com nomes reais (rota, campo, componente, endpoint) tirados da fonte, Pontos de Atenção para Testes.
- **Estrategia/estrategia.md** — seções 1–7 do template; **Análise de Risco** com Risco | Severidade | Tipo de teste | Cenário. Releia a tabela contra `Cenarios/base.md`: CT e tipo precisam bater.
- **Cenarios/base.md** — cenários agrupados por tipo em H2 (`## Funcionais`, `## API`, `## Integração`, `## Regressão`, e `## Não funcionais`/`## Acessibilidade`/`## Segurança` se o desafio pedir). Cada cenário: `### Cenário N: Nome`, `### Tipo de teste` (negrito), `### Descrição (BDD)` em bloco `gherkin`, `### Casos de teste` (`CTnn`).

Hábitos:
- **Gherkin em todos os casos:** nada de CT só em tabela. Dado de entrada/saída em tabela → `Esquema do Cenário` + `Exemplos` (detalhes em `gate-de-entrega.md`).
- Consolide variações de um fluxo em um cenário com sub-casos (`CT08`, `CT08.1`) — caminho feliz vs. exceção/borda.
- **Marque candidatos a automação:** CT determinístico, de alto valor de regressão e sem dependência externa leva 🤖 depois do ID (`- **CT01** 🤖 — ...`). Quando virar spec, troque/adicione `✱` e cite o spec. Bug encontrado na execução também é candidato: o spec assertia o comportamento *esperado* e passa a ser regressão após a correção. Liste os candidatos no STATUS.
- **Não invente cenário** para algo que o usuário, como especialista, disser que não existe ou não é testável. Remova.
- Se o desafio tiver prazo curto, marque **P0** nos cenários que cobrem o fluxo principal e execute esses primeiro.

## 5. Aguardar aprovação
Sem aprovação explícita do material, não avance para execução em massa, automação ou publicação de relatório.

## 6. Execução e ajustes
Depois da aprovação, ajude a executar (navegar, montar requisição, inspecionar). Bugs: `Desafio/Bug-report/bug-NNN.md` no formato de `Bug-report/README.md` (confira o template antes de escrever; evidências em `evidencias/`). Registre em `INDICE.md` (bug → correção → causa raiz).

## 7. Informação nova no meio do caminho
Edite Descricao/Estrategia/Cenarios/INDICE já escritos (nota de status, risco reclassificado, CT corrigido) — não deixe só no chat. Inconsistência interna achada ao reler: corrija e avise.

## 8. Gate de entrega (antes de entregar)
Rode `gate-de-entrega.md`: bugs com severidade + prioridade fechadas e justificadas (sem "sujeito a revisão"), todos os cenários em Gherkin, conferência cruzada. Vale também com tempo curto.

## Preferências permanentes
- `INDICE.md` é a espinha dorsal de rastreabilidade.
- Feedback do usuário que muda uma etapa vira instrução duradoura: atualize esta skill (ou seu anexo), não só a rodada atual.
