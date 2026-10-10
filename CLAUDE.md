# CLAUDE.md — QA-Desafio-Verzel

Instruções para assistentes de IA neste repositório.

## O que é este repositório

Planejamento e execução de testes do desafio técnico de QA da Verzel (card VZS-142: cupom de desconto e frete grátis), com rastreabilidade do enunciado até o bug.

## Estrutura

```
Enunciado/          enunciado original (fonte de verdade)
Regras-Globais/     regras transversais confirmadas
Desafio/
├── INDICE.md       rastreabilidade e decisões de escopo
├── STATUS.md       estado atual (ler primeiro ao retomar)
├── Descricao/ · Estrategia/ · Cenarios/ · Bug-report/ · Evidencias/
└── automacao-playwright/
```

## Como trabalhar

- Retomar: ler só `Desafio/STATUS.md`.
- Planejar: skill `qa-planning`. Pausar/encerrar: skill `salvar-status`.
- Gherkin em português; IDs `Cenário N`, `CTnn`, `BUG-001`.
- Verificar antes de assumir; perguntar quando houver ambiguidade ou decisão de classificação (bug ou não).
- Commitar só a pasta tocada.

## Severidade de bugs

Crítica (bloqueia o fluxo principal ou corrompe dado) · Alta (alto impacto, sem bloqueio total) · Média (fluxo secundário) · Baixa (cosmético ou edge case).
