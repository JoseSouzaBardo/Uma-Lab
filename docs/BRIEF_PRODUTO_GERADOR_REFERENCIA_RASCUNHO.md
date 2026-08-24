# Rascunho de produto — Gerador de Build de Referência

## Posicionamento

> **O Uma Strategy Lab ajuda o jogador a escolher uma candidata e gerar um plano individual de referência para uma Champions Meeting do servidor Global, combinando meta comunitário atribuído e regras de mecânica explicáveis.**

O resultado é uma recomendação de compatibilidade e risco, não uma “melhor build” nem uma previsão de vitória.

## Fluxo principal da primeira versão

| Etapa | Ação do usuário | Resposta do laboratório | Fonte principal |
|---|---|---|---|
| 1. Escolher CM | Seleciona uma das 18 CMs Global. | Mostra pista, distância, superfície, direção, condição e marcos de fase. | Catálogo local de CMs e mecânicas. |
| 2. Explorar candidatas | Consulta seleção curta por tier. | Exibe até três destaques em SS, S e A; “ver mais” amplia a lista da fonte. | Tier comunitário atribuído. |
| 3. Abrir candidata | Escolhe uma personagem. | Mostra variantes, nota comunitária e estratégias elegíveis. Estratégias citadas pela fonte têm rótulo próprio; as demais são ordenadas por aptidão e regras. | Meta + catálogo de personagem + mecânicas. |
| 4. Gerar plano | Confirma candidata e estratégia. | Retorna metas de treino, skills priorizadas, heranças e deck de referência, com condições confirmadas, situacionais e excluídas. | M1 determinístico + meta atribuído. |
| 5. Entender o plano | Opcionalmente abre a análise. | Explica HP, condições de skill e trajetória de referência. | Analisador M2 e guia. |

## Saída de um plano individual

| Bloco | O que exibe | Rótulo obrigatório |
|---|---|---|
| Candidata | Variante, tier e motivo resumido da fonte. | **Referência comunitária** |
| Estratégia | Estratégia escolhida, aptidão e motivo de elegibilidade. | **Mecânica + escolha do usuário** |
| Metas | Speed, Stamina, Power, Guts e Wit de referência, quando disponíveis. | **Meta de treino comunitária** |
| Skills | Ordem de prioridade, custo e condição. | **Confirmada / situacional / excluída** |
| Herança e deck | Sugestões de fontes de skill e cartas. | **Deck de referência; não considera inventário** |
| Limites | O que depende de HP, posição, pelotão, ativação ou corrida observada. | **Ainda incerto** |

## Decisões consolidadas

| Tema | Decisão |
|---|---|
| Unidade de geração | Uma build individual por vez. |
| Escolha inicial | A ferramenta sugere personagem e estratégia a partir da CM; o usuário abre a candidata desejada. |
| Tiers | Seleção curta, inicialmente até três destaques por tier; expansão sob demanda. |
| Inventário | Não entra na primeira versão. As saídas são builds e decks de referência. |
| Meta comunitário | Linha de base atribuída, preservando tier e notas da fonte. |
| Análise | Opcional depois da geração, para explicar o plano. |
| Evidência local e M3 | Não modificam a recomendação inicial automaticamente. |

## Fora do escopo da primeira versão

O primeiro lançamento não monta o time de três corredoras, não analisa sinergia da equipe, não filtra por personagens/cartas possuídas, não mede chance real de vitória e não ajusta o meta a partir de poucas corridas locais.

## Próxima implementação, após aprovação do brief

1. Criar uma entrada de geração por CM com candidatas curtas por tier e proveniência visível.
2. Criar a etapa de candidata + estratégia elegível e conectar ao M1 já existente.
3. Reorganizar a navegação para colocar o Gerador de referência como experiência principal e deixar análise/coleta como apoio.
4. Testar o fluxo em CM 1, CM 9 e CM 17 antes de ampliar a interface para as 18 CMs.
