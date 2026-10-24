# Gate de entrega (rodar antes de entregar qualquer desafio)

Origem: feedback de um desafio real (Verzel, 2026-10): o planejamento e os bugs foram elogiados, mas a nota ficou abaixo do corte por dois acabamentos que a IA deixou passar. **Este gate não é opcional, mesmo com tempo curto** — corte escopo antes de cortar o gate.

## 1. Bug reports fechados, sem pendência escrita
- Severidade marcada **com justificativa do impacto** (por que esse nível e não o vizinho).
- **Prioridade** (P1/P2/P3 = ordem de correção) com o motivo, e a ordem entre os bugs.
- Proibido deixar nos artefatos frases como "sujeito à revisão", "a confirmar", "proposta do QA" ou uma lista de pendências de revisão. A IA propõe e **fecha** a classificação; se o usuário delegar ("fica ao seu critério"), ela decide e justifica. Se a decisão é do usuário e ele ainda não deu, perguntar **antes** de entregar, não escrever o hedge no documento.
- Cada observação ⚠ da execução ganha decisão registrada (bug / não é bug / lacuna da doc) e o motivo.

## 2. Todo cenário em Gherkin
- Nenhum caso de teste só em tabela ou lista de texto: todo CT existe como `Cenário:` ou como linha de `Exemplos:`.
- Caso que nasce como tabela de dados → `Esquema do Cenário:` com `Exemplos:` (coluna com o ID do CT). Entradas com espaços ou vazias vão entre aspas na tabela.
- Idioma do enunciado; passos `Dado / Quando / Então / E` (pt) ou `Given / When / Then` (en).
- Placeholder `<campo>` sem tabela `Exemplos:` é erro: ou vira esquema completo ou vira valor literal.
- A lista "Casos de teste" abaixo do Gherkin serve só para rastreabilidade (ID + título).

## 3. Conferência cruzada (30 segundos)
- `grep -rn "sujeit\|a confirmar\|pendente de revis" Desafio/` não retorna nada nos artefatos entregues.
- Todo CT do `Cenarios/base.md` aparece no relatório de evidências e vice-versa.
- Prioridades P0/P1/P2 dos cenários estão no `base.md` e na estratégia.
- README raiz aponta cada entrega pedida pelo enunciado.
