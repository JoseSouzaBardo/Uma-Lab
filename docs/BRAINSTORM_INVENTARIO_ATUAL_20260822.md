# Inventário atual para consolidação do produto

## O que já está construído

| Área | Módulos existentes | Papel para um analisador de builds | Classificação inicial |
|---|---|---|---|
| Registro da build | Catálogo Global, seletor de variante/skills, aptidões editáveis, única automática, orçamento SP | Define a build real a ser compreendida. | **Núcleo** |
| Contexto da prova | CM 1 detalhada, catálogo de 18 CMs, terreno, distância, fases e regras de percurso | Permite interpretar uma build dentro de um cenário, não isoladamente. | **Núcleo** |
| Leitura da build | Resumo de Stamina/Wit/estratégia, calculadora de stamina, condições de skills, parser formal | Explica atributos, condições conhecidas e o que ainda depende de corrida. | **Núcleo** |
| Trajetória de referência | M2 com HP, fases, velocidade-alvo e eventos localizados | Organiza uma hipótese de percurso; não determina vitória ou colocação. | **Núcleo avançado** |
| Coleta real | Sessões CM 1, eventos, recovery por ID, snapshots e pareamento | Converte observação do usuário em evidência auditável. | **Núcleo avançado** |
| Histórico | Vitória, colocação, amostra comparável e índice descritivo | Mostra resultados registrados, sem inferir causalidade. | **Apoio de evidência** |
| Comparação | Comparação lateral de até três builds | Ajuda a encontrar diferenças concretas entre builds. | **Apoio útil** |
| Guia de mecânicas | Atributos, aptidões, fases, HP, recovery e estados | Ensina a leitura correta a usuários iniciantes. | **Apoio essencial** |
| Priorização | Regras por CM, pesos e feedback manual local | Organiza o que observar; ainda não é aprendizado automático. | **Pesquisa / apoio** |
| M1 | Gerador e sugestões por regras | Explora alternativas, mas não é necessário para compreender a build atual. | **Experimental / secundário** |
| M3 e M4 | Calibração bloqueada e relatórios consolidados | Auditoria avançada após evidência suficiente. | **Avançado / secundário** |

## Problemas de organização identificados

O fluxo ficou amplo demais para o estágio atual. O usuário pode encontrar planejamento, geração, coleta, calibração e guia antes de ter uma leitura simples da build em uma corrida. Há também uma diferença importante entre **funções que explicam a build atual** e **funções que tentam evoluir o modelo futuramente**.

## Hipótese de núcleo mínimo

O produto pode se definir, por enquanto, como:

> **Um caderno local que ajuda um jogador a entender como uma build interage com uma corrida específica, separando dados da build, condições de skill, risco de HP e fatos observados.**

Sob essa definição, geração de builds, calibração e feedback para aprendizado devem permanecer fora do caminho principal e só aparecer quando o usuário pedir exploração ou evidência avançada.
