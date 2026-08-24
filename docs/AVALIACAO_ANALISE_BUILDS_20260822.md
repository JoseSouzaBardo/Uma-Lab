# Avaliação da Análise de builds

## Objetivo atual

O objetivo adequado nesta etapa é um **analisador explicável de builds**: organizar os dados de uma build, confrontá-los com uma CM, mostrar riscos e condições de skills, registrar uma trajetória de referência e separar o que é observado do que ainda é hipótese. A aplicação não deve apresentar recomendação de vitória como conclusão.

## Diagnóstico do fluxo existente

| Bloco atual | Pertinência ao analisador | Problema de organização | Destino proposto |
|---|---|---|---|
| Visão geral | Alta | Começa pelo mapa e pela coleta global antes de deixar clara a build em avaliação. | **Leitura inicial**: build selecionada, cenário e três sinais principais. |
| Planejar | Parcial | Reúne M1, calculadora de stamina e recomendação; mistura alternativa de build com diagnóstico da build atual. | **Checagem da build**: stamina e condições. M1 fica como bloco auxiliar e experimental ao fim. |
| Diagnosticar | Alta, mas densa | M2, M3, M4 e inventário de skills aparecem sem uma sequência de leitura. | **Trajetória e evidência**: skills e M2 primeiro; M3/M4 depois como consequência. |
| Comparar | Alta | É uma atividade de análise, mas a rota a chama de “cobertura” e parece uma etapa do percurso. | **Comparar**: manter como leitura lateral, depois do diagnóstico individual. |

## Estrutura proposta

1. **Leitura inicial** — “O que esta build traz para esta CM?”; cenário, atributos, aptidões, orçamento e sinais principais.
2. **Checagem da build** — “O que precisa ser conferido?”; stamina, compatibilidade de skills e condições que dependem da corrida.
3. **Trajetória e evidência** — “O que o modelo de referência mostra?”; trajetória M2, snapshots e cobertura M3/M4, sempre com bloqueios visíveis.
4. **Comparar** — “Como as builds diferem?”; comparação lado a lado, sem ranking de vitória.

## Decisões de limite

O gerador M1 e as sugestões de skills não serão removidos. Nesta reorganização, eles passam a aparecer como **exploração auxiliar**, após a leitura da build, e continuam explicitamente experimentais. Coleta, Prioridade, Guia e demais abas não serão modificadas.
