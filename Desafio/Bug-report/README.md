# Bug Reports — VZS-142

Esta pasta contém os bugs identificados durante a validação do desafio.

## Bugs registrados

| ID | Arquivo | Título | Severidade | Status |
|----|---------|--------|------------|--------|
| BUG-001 | [bug-001.md](bug-001.md) | Subtotal de exatamente R$ 200,00 cobra frete (CA06) | Alta | 🔴 Aberto |
| BUG-002 | [bug-002.md](bug-002.md) | API não aplica o limite de 5 unidades (CA10) | Alta | 🔴 Aberto |
| BUG-003 | [bug-003.md](bug-003.md) | Item sem `produtoId` → "Produto undefined" em vez de `ITEM_INVALIDO` | Baixa | 🔴 Aberto |

## Estrutura de cada bug report

Este é o formato realmente usado em todo o repositório (auditado em 2026-09-18 contra os bug reports existentes) — não o formato mínimo de uma versão anterior deste template. Cada arquivo de bug deve conter, nesta ordem:

1. **Título** (H1): descrição curta e específica do problema — não apenas o nome do módulo
2. **Informações Gerais**: ID (ID do tracker, ou "a preencher"), Módulo, Ambiente, Versão/Build, Data da identificação
3. **Descrição**: narrativa do que foi observado e por que diverge do esperado (pode citar a regra de negócio violada)
4. **Objetivo do Teste**: o que a validação pretendia confirmar quando o bug foi encontrado
5. **Pré-condições**: estado necessário para reproduzir (embarcador, flag, tipo de veículo, etc.)
6. **Caso de teste relacionado** (opcional): CT que originou o achado — "Não identificado" quando veio de exploração livre
7. **Passos para reprodução**: numerados e precisos
8. **Resultado atual**: o que está acontecendo, com valores/payloads reais quando aplicável
9. **Resultado esperado**: o que deveria acontecer
10. **Impacto**: consequência prática/de negócio se o bug não for corrigido
11. **Severidade**: checklist Baixa / Média / Alta / Crítica (ver `CLAUDE.md` → Severidade de Bugs)
12. **Frequência**: checklist Sempre / Intermitente / Não reproduzido novamente
13. **Evidências**: prints, logs, payloads de API (link para `evidencias/` quando houver arquivo)
14. **Análise técnica**: hipótese ou investigação de onde no código o problema está
15. **Causa Raiz Técnica (categorização)** (opcional — usar quando a causa já foi confirmada com o dev, não apenas hipotetizada)
16. **Observações**: notas de processo, achados correlatos, o que falta para fechar a classificação

---

## Template de bug report

```markdown
# Bug Report — [Título curto e específico do problema]

## Informações Gerais
- **ID:** [ID-DO-DESAFIO ou "a preencher após registro"]
- **Módulo:** [tela/serviço/fluxo afetado]
- **Ambiente:** [local / preview / staging / produção]
- **Versão/Build:** [ou "mesma sessão de teste"]
- **Data da identificação:** [AAAA-MM-DD]

---

## Descrição
[Narrativa: o que foi observado, e qual regra/expectativa é violada]

---

## Objetivo do Teste
[O que a validação pretendia confirmar]

---

## Pré-condições
- [item]

---

## Caso de teste relacionado
[CT que originou o achado, ou "Não identificado — achado durante exploração livre"]

---

## Passos para reprodução
1.
2.
3.

---

## Resultado atual
[o que está acontecendo — com valores/payloads reais quando houver]

---

## Resultado esperado
[o que deveria acontecer]

---

## Impacto
[consequência prática/de negócio se não for corrigido]

---

## Severidade
- [ ] Baixa
- [ ] Média
- [ ] Alta
- [ ] Crítica

---

## Frequência
- [ ] Sempre
- [ ] Intermitente
- [ ] Não reproduzido novamente

---

## Evidências
[links para prints/logs/payloads, ex: evidencias/nome-do-print.png]

---

## Análise técnica
[hipótese de onde no código está o problema, recomendação ao dev]

---

## Observações
[notas de processo, achados correlatos, pendências para fechar a classificação]
```

### Sobre a seção opcional "Causa Raiz Técnica (categorização)"

Usar apenas quando a causa raiz já foi **confirmada** (não hipotetizada) com o dev responsável — a "Análise técnica" acima é o lugar certo para hipóteses ainda não validadas. Quando usada, nomeie a categoria de forma explícita (ex.: "Regra de negócio incompleta em um caminho de código", "Divergência entre telas/módulos", "Falha de persistência") e cite a data/fonte da investigação.
