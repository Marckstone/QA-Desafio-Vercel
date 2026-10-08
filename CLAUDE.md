# CLAUDE.md — QA-Desafio-Vercel

Instruções para assistentes de IA (Claude Code etc.) neste repositório.

## O que é este repositório

Repositório **independente** do desafio técnico de QA da Vercel (oportunidade de vaga). Reaproveita o *método* do repositório de QA da TruckMe (planejamento → Gherkin → estratégia por risco → rastreabilidade), mas **não tem relação com o domínio TruckMe**.

> **Proibido neste repo:** referenciar Jira TRKM, regras ANTT/frete, entidades TruckMe ou o ambiente TST. Se algo assim aparecer, é cópia indevida — remova.

## Estrutura

```
QA-Desafio-Vercel/
├── CLAUDE.md          ← este arquivo
├── README.md          ← visão geral para humanos
├── Enunciado/         ← enunciado original do desafio (texto, prints, links) — fonte de verdade
├── Regras-Globais/    ← regras transversais ao produto testado (criadas ao longo do desafio)
├── _inbox/            ← material bruto a processar (Gherkin, anotações) → vira artefato .md
├── Desafio/
│   ├── INDICE.md      ← rastreabilidade: bug → correção → causa raiz
│   ├── STATUS.md      ← foto do estado atual (onde parou) — lido primeiro ao retomar
│   ├── Descricao/     ← escopo e regras do que está sendo testado
│   ├── Estrategia/    ← estratégia com análise de risco
│   ├── Cenarios/      ← cenários em Gherkin (base.md)
│   └── Bug-report/    ← bugs com evidências (evidencias/ ao lado do arquivo)
└── .claude/skills/    ← qa-planning, salvar-status
```

## Como trabalhar

- **Retomar:** leia só `Desafio/STATUS.md`; abra o resto apenas no trecho necessário (use `grep`).
- **Planejar:** skill `qa-planning` (fluxo completo, sem Jira).
- **Pausar/encerrar sessão:** skill `salvar-status`.
- **Processar bruto:** coloque em `_inbox/`, peça "Processe o arquivo em `_inbox/`"; a IA gera os artefatos em `Desafio/` e limpa a inbox.
- **Gherkin:** `Dado / Quando / Então` (pt) ou `Given / When / Then` (en) — manter o idioma do enunciado se ele for em inglês.
- **Se o desafio tiver mais de uma frente** (ex.: dois produtos/features), duplique `Desafio/` como `Desafio-<nome>/`, um STATUS por frente.

## Convenções

### Severidade de bugs
| Severidade | Significado |
|-----------|-------------|
| Crítica | Bloqueia o fluxo principal, perde/corrompe dado, ou falha de segurança |
| Alta | Alto impacto no fluxo principal, sem bloqueio total |
| Média | Impacto em fluxo secundário |
| Baixa | Edge case, cosmético ou sem efeito prático |

("P0" em cenários = prioridade de execução, não severidade.)

### IDs
- Cenários: `Cenário N`, casos `CTnn` (sub-casos `CT08.1`). Bugs: `BUG-001`…
- Se o desafio informar IDs próprios, use-os.

### Preferências do Marcus (valem aqui)
- **Não assuma — verifique.** Confira formatos contra o exemplo real mais próximo do repo.
- **Não decida por mim:** ambiguidade real ou classificação (bug ou não) → pergunte antes.
- **Cruze com o que já existe** (Regras-Globais, enunciado) e registre o resultado: aplica-se / não se aplica e por quê.
- **Corrija a causa, não o sintoma** (se uma skill pula etapa, corrija a skill).
- Explicações técnicas de backend/DB: analogia + âncora técnica real (arquivo, endpoint, campo) + apoio visual.

## Economia de contexto

| # | Regra |
|---|-------|
| D1 | `STATUS.md` é foto do estado atual, reescrita a cada atualização (≤ ~80 linhas). Histórico vai para `INDICE.md`. |
| D2 | Uma sessão = uma execução/jornada. `/clear` só depois do commit e do `STATUS.md` atualizado. |
| D3 | Passou de ~200 mil tokens de contexto → pergunte ao usuário antes de agir; se aprovar, registre "Onde parou" no STATUS. |
| D8 | Cada `SKILL.md` ≤ ~10 mil caracteres; aprendizado novo vai para anexo na pasta da skill. |

Hábitos: agrupe passos de navegador/Bash; filtre respostas de API com `jq`; use `grep` + `Edit` em arquivos grandes; commite só a pasta tocada (`git add <caminho>`, nunca `git add .`).

## Automação (se o desafio pedir)

Playwright em `Desafio/automacao-playwright/` (criar quando necessário), um spec por cenário, citando o cenário de `Cenarios/base.md` no topo de cada spec.

---
*Mantido por: Marcus (QA)*
