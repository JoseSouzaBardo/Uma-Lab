# UMA-LAB — ARQUITETURA OFICIAL
## Especificação Técnica e Contrato de Desenvolvimento — v1.0

**Projeto:** UMA-Lab  
**Repositório:** `JoseSouzaBardo/Uma-Lab`  
**Objetivo:** Simulação, análise e comparação de builds de Umamusume: Pretty Derby  
**Status:** Arquitetura inicial aprovada para implementação  
**Base:** Investigações A, B, C e D

---

# 1. PROPÓSITO DO PROJETO

O UMA-Lab é uma ferramenta destinada a:

1. simular corridas de Umamusume;
2. representar múltiplos corredores simultaneamente;
3. reproduzir, tanto quanto possível, as mecânicas verificadas do jogo;
4. analisar o comportamento de uma build em uma pista;
5. comparar diferentes builds sob condições equivalentes;
6. executar múltiplas simulações estatísticas;
7. registrar telemetria detalhada;
8. produzir gráficos e métricas que expliquem o desempenho observado.

O objetivo não é simplesmente produzir um simulador que "pareça correto".

O objetivo é construir um simulador:

- reproduzível;
- auditável;
- testável;
- estatisticamente útil;
- extensível;
- baseado em evidências;
- capaz de representar corridas com múltiplos corredores.

---

# 2. PRINCÍPIO FUNDAMENTAL

> **O UMA-Lab não deve inventar mecânicas do jogo.**

Quando uma mecânica não for conhecida, ela deverá ser:

- isolada;
- explicitamente identificada como desconhecida;
- substituível;
- documentada;
- impedida de contaminar outras partes do sistema.

Uma aproximação experimental pode existir, mas deve ser identificada como aproximação e nunca apresentada como comportamento confirmado do jogo.

---

# 3. CLASSIFICAÇÃO DE EVIDÊNCIAS

Todas as mecânicas e decisões importantes deverão utilizar uma das seguintes classificações.

## CONFIRMED

Existe evidência direta suficiente no código, dados ou validação.

Pode ser implementado como comportamento oficial do modelo.

## STRONGLY SUPPORTED

Existe evidência forte, mas não suficiente para considerar a mecânica completamente comprovada.

Pode ser implementado, mas deve permanecer documentado como tal.

## PLAUSIBLE

A hipótese possui evidências indiretas ou comportamento compatível.

Não deve ser tratada como verdade do jogo.

Pode existir em modelos experimentais.

## UNKNOWN

Não existe informação suficiente.

Não implementar comportamento definitivo.

---

# 4. REGRA DE OURO PARA AGENTES DE IA

Um agente de IA trabalhando no UMA-Lab está proibido de:

- inventar parâmetros;
- inventar fórmulas;
- assumir comportamento baseado em outros jogos;
- preencher valores desconhecidos por "valores razoáveis";
- transformar uma hipótese em regra;
- modificar dados originais sem autorização;
- substituir uma fórmula existente sem evidência;
- remover código simplesmente porque parece desnecessário;
- criar uma mecânica para completar uma interface sem documentar a hipótese;
- alterar arquitetura para facilitar sua própria implementação sem registrar a decisão.

Quando faltar informação:

> **PARAR E REPORTAR A INCERTEZA.**

Uma implementação incompleta é preferível a uma implementação falsa.

---

# 5. FONTES DE VERDADE

As fontes do projeto possuem diferentes níveis de autoridade.

## 5.1 Dados do jogo

Fontes:

- `uma_data`
- `gametora_data`
- dados de pistas;
- dados de personagens;
- dados de skills;
- demais dados brutos.

Utilizados como fonte primária para dados estruturais.

---

## 5.2 Umalator-global

O `umalator-global` é uma fonte extremamente importante para:

- fórmulas;
- constantes;
- efeitos;
- fluxo de ativação de skills;
- integração física;
- HP;
- velocidade;
- aceleração;
- fases;
- last spurt;
- downhill;
- outros comportamentos já identificados.

Entretanto:

> **O Umalator-global não deve ser considerado automaticamente uma implementação correta de comportamento coletivo.**

A Investigação B demonstrou que sua arquitetura é fundamentalmente single-horse.

O simulador processa cada corredor de forma independente, sem uma coleção global viva de corredores e sem um estado coletivo real.

Portanto:

**reutilizar matemática ≠ reutilizar arquitetura.**

---

# 6. PRINCÍPIO DE REAPROVEITAMENTO

O código existente deve ser classificado como:

### REUSE

Pode ser reutilizado diretamente ou com adaptação mínima.

### ADAPT

A lógica é válida, mas precisa ser desacoplada da arquitetura antiga.

### REFERENCE

O código serve como referência para reconstrução.

### REPLACE

A implementação existente é inadequada para o novo simulador.

### UNKNOWN

Não existe evidência suficiente.

---

# 7. MAPA DE REUTILIZAÇÃO DO UMALATOR-GLOBAL

## 7.1 REUTILIZAR / ADAPTAR

### Física

- `wt()`
- `Wt()`
- `Kt()`
- `Yt`
- constantes relacionadas;
- cálculo de target speed;
- cálculo de aceleração;
- integração da velocidade;
- consumo de HP;
- modificadores de skills.

As investigações identificaram essas fórmulas como confirmadas e adequadas para reaproveitamento.

### Fases

Reutilizar:

- cálculo de fases;
- Position Keep;
- Final Spurt;
- transições de fase;
- cálculo baseado na distância.

Position Keep e Final Spurt foram validados nas pistas analisadas.

### Skills

Reutilizar:

- dados;
- efeitos;
- duração;
- escalonamento;
- estrutura de modifiers;
- fluxo geral de ativação.

O fluxo identificado é:

```text
expire
    ↓
check pending
    ↓
verificar trigger
    ↓
avaliar condição
    ↓
ativar
    ↓
calcular duração/modificador
    ↓
aplicar efeito
```

Esse fluxo foi considerado confirmado.

---

# 8. O QUE NÃO DEVE SER REUTILIZADO COMO ESTÁ

Não reutilizar a arquitetura de:

- processamento independente de cada corredor;
- loop single-horse;
- estado coletivo inexistente;
- `order` atual;
- `order_rate` derivado do estado quebrado;
- `near_count` aleatório;
- `blocked_*` aleatório;
- `is_overtake` aleatório;
- `change_order_*` aleatório;
- demais placeholders de interação.

A Investigação B identificou que não existe uma coleção global viva de corredores durante a simulação e que o loop atual processa um corredor por vez.

---

# 9. ARQUITETURA GERAL

O sistema deverá ser dividido em:

```text
UMA-Lab
│
├── Data
│
├── Domain
│
├── Simulation
│
├── Analysis
│
├── Visualization
│
├── Infrastructure
│
├── Tests
│
└── Documentation
```

A separação conceitual é:

```text
                    DATA
                     │
                     ▼
                  DOMAIN
                     │
                     ▼
                SIMULATION
                     │
                     ▼
                  RESULTS
                     │
             ┌───────┴────────┐
             ▼                ▼
         ANALYSIS       VISUALIZATION
```

---

# 10. ESTRUTURA DE DIRETÓRIOS

A estrutura proposta é:

```text
uma-lab/
│
├── data/
│   ├── characters/
│   ├── skills/
│   ├── courses/
│   ├── races/
│   ├── factors/
│   └── raw/
│
├── src/
│   │
│   ├── domain/
│   │   ├── runner/
│   │   ├── build/
│   │   ├── race/
│   │   ├── course/
│   │   └── skill/
│   │
│   ├── simulation/
│   │   ├── core/
│   │   ├── physics/
│   │   ├── positioning/
│   │   ├── interaction/
│   │   ├── lateral/
│   │   ├── strategy/
│   │   ├── skills/
│   │   └── telemetry/
│   │
│   ├── analysis/
│   │   ├── statistics/
│   │   ├── comparison/
│   │   ├── compatibility/
│   │   └── reports/
│   │
│   ├── visualization/
│   │
│   └── infrastructure/
│       ├── loaders/
│       ├── exporters/
│       └── configuration/
│
├── tests/
│   ├── unit/
│   ├── regression/
│   ├── simulation/
│   └── validation/
│
├── docs/
│   ├── architecture/
│   ├── mechanics/
│   ├── evidence/
│   └── decisions/
│
└── tools/
```

Essa estrutura é uma arquitetura-alvo.

Os agentes não devem criar todos esses diretórios antecipadamente sem necessidade.

---

# 11. DOMAIN

A camada `domain` representa os conceitos do jogo.

Ela não deve conter lógica de simulação.

---

# 12. RUNNER

## Runner

Representa a entidade estática de uma corredora/personagem.

Exemplos de informações:

```text
Runner
├── id
├── name
├── baseStats
├── aptitudes
├── growth
├── uniqueSkill
└── metadata
```

---

# 13. BUILD

Uma build representa a configuração utilizada na corrida.

```text
Build
├── runner
├── stats
├── skills
├── strategy
├── aptitudes
├── factors
└── configuration
```

A build não deve conter estado de corrida.

---

# 14. TRACK

A pista é uma entidade estática.

```text
Track
├── id
├── distance
├── surface
├── turn
├── laneMax
├── sections[]
├── slopes[]
├── corners[]
├── straights[]
└── phaseBoundaries
```

Os dados existentes de `course_data.json` devem ser preservados sempre que forem considerados fonte válida.

`laneMax` representa a extensão lateral disponível identificada nos dados.

---

# 15. RACE CONFIGURATION

A configuração de uma corrida deverá representar:

```text
RaceConfiguration
├── track
├── weather
├── groundCondition
├── season
├── numRunners
├── runners[]
├── seed
└── simulationSettings
```

A configuração deve ser imutável durante a execução, exceto quando explicitamente definido como estado.

---

# 16. RACE STATE

`RaceState` é o coração da nova arquitetura.

Representa o estado coletivo da corrida em um instante.

```text
RaceState
├── time
├── distance
├── phase
├── runners[]
├── pacer
├── raceEvents
└── globalState
```

Diferentemente do Umalator-global, o novo motor deve possuir uma coleção viva de corredores.

Isso é necessário para representar corridas de 9+ corredores.

---

# 17. RUNNER STATE

Cada corredor possui estado próprio:

```text
RunnerState
├── runnerId
│
├── position
├── lateralPosition
├── speed
├── targetSpeed
├── acceleration
├── hp
│
├── phase
├── section
│
├── order
├── orderRate
│
├── runningStyle
│
├── blockedFront
├── blockedSide
├── blockedFrontTime
├── blockedSideTime
│
├── isOvertake
├── overtakeTarget
│
├── activeSkills
├── pendingSkills
│
├── kakari
├── lastSpurt
├── paceDown
│
└── ...
```

Nem todas as propriedades precisam ser implementadas imediatamente.

---

# 18. INDIVIDUAL VS COLLECTIVE STATE

As investigações identificaram aproximadamente:

- 50 variáveis individuais;
- 30 variáveis coletivas;
- 15 variáveis derivadas;
- algumas variáveis ainda desconhecidas.

Essa separação deve ser preservada.

## Individual

Depende apenas do próprio corredor:

- stats;
- HP;
- velocidade;
- aceleração;
- skills;
- timers;
- estado individual.

## Collective

Depende dos demais corredores:

- ordem;
- distância ao líder;
- distância ao corredor à frente;
- distância ao corredor atrás;
- `near_count`;
- bloqueio;
- ultrapassagem;
- mudanças de ordem;
- relações laterais.

## Derived

Calculado a partir de dados existentes:

- fase;
- segmento;
- `Z(course)`;
- `sectionLength`;
- base target speed;
- base acceleration.

---

# 19. SIMULATION LAYER

A simulação será organizada em componentes independentes.

```text
RaceEngine
│
├── PhysicsEngine
├── PositionEngine
├── InteractionEngine
├── LateralEngine
├── StrategyEngine
├── SkillEngine
├── ConditionEngine
├── PhaseEngine
├── RandomEngine
└── TelemetryEngine
```

`RaceEngine` é o orquestrador.

Ele não deve concentrar todas as regras.

---

# 20. RACE ENGINE

Responsabilidades:

- iniciar corrida;
- manter relógio;
- executar ticks;
- coordenar subsistemas;
- detectar término;
- produzir `RaceResult`.

O `RaceEngine` não deve conter diretamente:

- fórmulas de velocidade;
- parser de condições;
- regras individuais de skills;
- regras de lateralidade;
- estatísticas.

---

# 21. PHYSICS ENGINE

Responsável por:

- target speed;
- aceleração;
- forças;
- modifiers;
- HP;
- integração de movimento.

As fórmulas confirmadas do Umalator devem ser reproduzidas antes de qualquer tentativa de otimização.

---

# 22. POSITION ENGINE

Responsável por transformar o estado físico em posição na pista.

Deve calcular:

```text
position
section
phase
distance remaining
order
orderRate
```

A ordem de corredores deverá ser derivada da posição longitudinal real.

Não utilizar os placeholders existentes do Umalator.

---

# 23. INTERACTION ENGINE

Responsável pelas relações entre corredores.

Deve fornecer informações como:

```text
distanceToLeader
distanceToFront
distanceToBack
nearCount
sameLane
lateralGap
blockedFront
blockedSide
overtakeState
```

Esse componente é uma das principais partes novas do UMA-Lab.

---

# 24. LATERAL ENGINE

O modelo de posição lateral será contínuo.

```text
0 <= lateralPosition <= laneMax
```

A existência de posição lateral contínua possui suporte nos dados e no modelo existente.

Entretanto:

> **A dinâmica exata do movimento lateral ainda não está comprovada.**

Portanto o `LateralEngine` deverá ser substituível.

Não assumir:

- número fixo de faixas;
- velocidade lateral;
- snap para faixas;
- direção obrigatória de ultrapassagem;
- duração de mudança lateral.

Enquanto esses elementos não forem comprovados, devem permanecer configuráveis/experimentais.

---

# 25. STRATEGY ENGINE

Representa o comportamento associado aos estilos:

```text
1 = Nige
2 = Senkou
3 = Sasi
4 = Oikomi
5 = Oonige
```

Os estilos são confirmados como categorias discretas e são utilizados em condições de skills.

O comportamento físico adicional de cada estilo deve ser implementado somente quando houver evidência.

---

# 26. PACER

O sistema atual fornece evidência de `useDefaultPacer()` durante Position Keep.

Position Keep foi validado em aproximadamente 5/12 da distância.

A arquitetura deverá representar:

```text
Pacer
```

como estado do coletivo, e não como propriedade isolada permanente de uma corredora.

O algoritmo exato de seleção dinâmica do pacer ainda deve ser tratado com cautela.

Não assumir histerese sem evidência.

---

# 27. CONDITION ENGINE

As condições das skills devem ser interpretadas por um `ConditionEngine`.

Fluxo:

```text
Skill
   │
   ▼
Condition AST
   │
   ▼
ConditionContext
   │
   ▼
ConditionEvaluator
   │
   ▼
true / false
```

O parsing das condições deve ocorrer fora do hot path sempre que possível.

O contexto deverá fornecer variáveis do:

- `RunnerState`;
- `RaceState`;
- `Track`;
- `RaceConfiguration`.

---

# 28. CONDITION CONTEXT

O `ConditionContext` deverá expor somente variáveis realmente conhecidas.

Exemplo:

```text
phase
order
orderRate
remainDistance
distanceDiffTop
bashinDiffInfront
bashinDiffBehind
nearCount
blockedFront
blockedSide
blockedFrontContinuetime
blockedSideContinuetime
isOvertake
runningStyle
groundType
groundCondition
slope
trackId
...
```

Uma variável desconhecida não pode ser preenchida aleatoriamente apenas para satisfazer uma skill.

---

# 29. SKILL ENGINE

O `SkillEngine` será responsável por:

1. verificar skills pendentes;
2. verificar triggers;
3. avaliar condições;
4. executar wisdom check quando aplicável;
5. ativar skill;
6. calcular duração;
7. calcular modificadores;
8. adicionar efeitos;
9. expirar efeitos;
10. registrar eventos.

---

# 30. SKILL DATA

O dataset possui centenas de skills e variantes.

A arquitetura deve tratar o banco de skills como **dados**, não como centenas de classes codificadas manualmente.

A Investigação D identificou aproximadamente 591 entradas e uma ampla taxonomia de condições.

Portanto:

> **Não criar uma classe específica para cada skill salvo necessidade comprovada.**

A preferência é:

```text
SkillData
+
Condition AST
+
Effect definitions
```

---

# 31. SKILL CONDITIONS

As condições devem ser classificadas aproximadamente em:

```text
PHASE
POSITION
DISTANCE
INTERACTION
BLOCKING
OVERTAKING
STYLE
RANDOM
STATE
ENVIRONMENT
SKILL_CHAIN
DYNAMIC
```

Essa classificação é utilizada para compreender dependências e não deve ser confundida com uma taxonomia oficial do jogo.

---

# 32. BLOCKING

Existem evidências fortes para:

```text
blocked_front
blocked_side
blocked_front_continuetime
blocked_side_continuetime
```

Esses estados deverão ser derivados da interação entre corredores.

Entretanto, os valores exatos da geometria de bloqueio não devem ser inventados.

O valor `bashin_diff <= 1` representa uma relação de distância identificada nas condições de skills, mas não prova sozinho toda a física de bloqueio.

---

# 33. OVERTAKING

`is_overtake` é uma variável importante das skills.

A arquitetura deve representá-la como um estado derivado da corrida.

Não assumir automaticamente que:

```text
ganhou posição = iniciou manobra física
```

A relação entre mudança de ordem, movimento lateral e ultrapassagem ainda requer validação.

O sistema deve permitir posteriormente substituir o modelo de ultrapassagem sem alterar o restante do motor.

---

# 34. DRAFTING

Não implementar física aerodinâmica de drafting/slipstream.

A Investigação D não encontrou um modelo físico correspondente no simulador analisado.

Efeitos de pelotão presentes nas skills devem continuar sendo tratados pelas próprias condições das skills.

---

# 35. STAMINA E PELOTÃO

Não adicionar economia de stamina baseada simplesmente em estar atrás de outro corredor.

A economia de HP identificada está associada ao downhill.

Não inventar economia aerodinâmica.

---

# 36. RANDOM ENGINE

Todo RNG deverá ser centralizado.

Nenhum componente deve chamar aleatoriedade global diretamente.

A arquitetura deve permitir:

```text
RandomEngine(seed)
```

e resultados reproduzíveis.

Exemplo:

```text
seed = 12345
```

deve permitir reproduzir uma simulação.

---

# 37. COMPARAÇÃO CONTROLADA

Ao comparar duas builds:

```text
Build A
Build B
```

elas devem poder ser executadas utilizando:

- mesma pista;
- mesmas condições;
- mesmo conjunto de adversários;
- mesmas seeds;
- mesmo número de simulações.

Isso reduz ruído estatístico e permite comparação mais justa.

---

# 38. TELEMETRIA

A telemetria é parte fundamental do sistema.

Não deve ser adicionada somente depois que o simulador estiver pronto.

Eventos mínimos:

```text
tick
skill_activate
skill_expire
phase_change
kakari
last_spurt
pace_down_start
pace_down_end
overtake_start
overtake_end
block_start
block_end
lane_change
finish
```

A Investigação C identificou esses eventos como necessários para debug, validação e análise.

---

# 39. TELEMETRIA DE TICK

Cada tick deve poder registrar:

```text
timestamp
runnerId
position
lateralPosition
currentSpeed
targetSpeed
acceleration
hp
phase
order
```

A taxa natural de simulação identificada é 1/15 segundo.

O sistema não deve obrigatoriamente persistir todos os ticks em todas as execuções de produção se isso gerar problemas de desempenho.

Entretanto, o motor deve ser capaz de produzi-los para validação.

---

# 40. RACE RESULT

Uma corrida deverá retornar:

```text
RaceResult
├── winner
├── finishingOrder
├── finishTimes
├── runnerResults[]
└── telemetry
```

Cada resultado individual deverá permitir análise posterior.

---

# 41. RUNNER RESULT

Exemplo conceitual:

```text
RunnerResult
├── runnerId
├── finalPosition
├── finishTime
├── finalHp
├── averageSpeed
├── maxSpeed
├── skillsActivated
├── overtakes
├── timesBlocked
├── timeBlocked
├── phaseSplits
└── telemetry
```

Novas métricas podem ser adicionadas sem alterar o motor de simulação.

---

# 42. ANALYSIS ENGINE

O resultado da simulação alimentará:

```text
StatisticsEngine
        │
        ├── win rate
        ├── average finish
        ├── median finish
        ├── variance
        ├── standard deviation
        ├── percentiles
        └── consistency
```

---

# 43. BUILD COMPARISON

O comparador deverá responder:

> Qual build apresenta melhor desempenho sob determinadas condições?

Não deverá retornar apenas o vencedor médio.

Deverá futuramente analisar:

- taxa de vitória;
- posição média;
- distribuição de posições;
- tempo médio;
- variância;
- consistência;
- ativações de skills;
- impacto de bloqueio;
- impacto de ultrapassagem;
- desempenho por fase;
- desempenho por seção da pista.

---

# 44. COMPATIBILITY ANALYSIS

O analisador de compatibilidade deverá avaliar:

```text
Build × Track
```

considerando:

- distância;
- superfície;
- condição do terreno;
- inclinação;
- curvas;
- retas;
- fase final;
- aptidões;
- skills;
- estratégia;
- requisitos posicionais;
- recuperação;
- condições de ativação.

A análise deve explicar **por que** uma build é compatível ou incompatível.

---

# 45. VISUALIZAÇÃO

O sistema deverá futuramente produzir gráficos como:

## Velocidade × distância

Comparar corredores ao longo da corrida.

## Posição × distância

Mostrar mudanças de colocação.

## HP × distância

Mostrar consumo e recuperação.

## Skills

Mostrar ativações ao longo da corrida.

## Posição lateral

Mostrar movimentação lateral.

## Distribuição de resultados

Mostrar a variância de múltiplas simulações.

---

# 46. TESTES

O projeto deverá possuir quatro níveis principais.

## Unit tests

Testam componentes isolados.

Exemplo:

```text
wt()
Wt()
Kt()
HP
ConditionEvaluator
SkillEffectApplier
```

---

## Regression tests

Comparam o novo motor com resultados conhecidos do Umalator.

O objetivo inicial é:

> **um corredor isolado deve reproduzir o comportamento conhecido antes da introdução das interações coletivas.**

---

## Simulation tests

Testam corridas completas.

Exemplo:

```text
2 runners
9 runners
16 runners
18 runners
```

---

## Validation tests

Testam correspondência com dados ou comportamento observado do jogo.

---

# 47. ESTRATÉGIA DE IMPLEMENTAÇÃO

A implementação deverá ocorrer em etapas.

## FASE 0 — Infraestrutura

Criar:

- configuração;
- loaders;
- modelos básicos;
- RNG;
- testes;
- logging.

---

## FASE 1 — DOMAIN

Implementar:

- Runner;
- Build;
- Track;
- Skill;
- RaceConfiguration.

Nenhuma física coletiva.

---

## FASE 2 — SINGLE RUNNER

Implementar:

- relógio;
- física;
- HP;
- velocidade;
- aceleração;
- fases;
- Position Keep;
- Final Spurt;
- downhill;
- skills.

Objetivo:

> reproduzir o Umalator dentro da tolerância estabelecida.

---

## FASE 3 — MULTI-RUNNER STATE

Implementar:

```text
RaceState
RunnerState[]
```

e:

- ordem;
- distância ao líder;
- distância ao corredor anterior;
- distância ao seguinte.

Ainda sem inventar lateralidade complexa.

---

## FASE 4 — INTERACTION ENGINE

Implementar a infraestrutura para:

- nearby;
- blocking;
- overtaking;
- mudança de ordem.

Somente regras comprovadas devem ser consideradas definitivas.

---

## FASE 5 — LATERAL ENGINE

Implementar o modelo lateral aprovado pelas evidências disponíveis.

Modelos experimentais deverão permanecer isolados.

---

## FASE 6 — SKILL MIGRATION

Migrar progressivamente as condições das skills.

Prioridade:

```text
fase/tempo
↓
posição
↓
distância
↓
style
↓
interação
↓
bloqueio/ultrapassagem
↓
condições desconhecidas
```

---

## FASE 7 — TELEMETRIA COMPLETA

Adicionar:

- eventos;
- replay;
- métricas;
- análise por seção.

---

## FASE 8 — ANALYSIS

Implementar:

- estatísticas;
- comparação;
- compatibilidade;
- gráficos.

---

# 48. ORDEM DE DESENVOLVIMENTO

A prioridade não deverá ser:

> "fazer todas as features".

Deverá ser:

```text
CORREÇÃO
   ↓
VALIDAÇÃO
   ↓
INTERAÇÃO
   ↓
ESCALA
   ↓
ANÁLISE
```

Um simulador menor e validado é preferível a um simulador completo e incorreto.

---

# 49. TESTE DE OURO

O primeiro grande marco do projeto será:

```text
UMA-Lab
   VS
Umalator-global
```

com:

```text
1 corredor
mesma build
mesma pista
mesmas condições
mesma seed
```

As diferenças devem ser medidas.

Não devemos prosseguir para a validação coletiva se a reprodução individual ainda apresentar divergências inexplicadas.

---

# 50. TESTE MULTI-RUNNER

Depois:

```text
2 corredores
```

Depois:

```text
9 corredores
```

Depois:

```text
16 corredores
```

Depois:

```text
18 corredores
```

O aumento de corredores deverá acontecer somente depois que o estágio anterior estiver validado.

---

# 51. MÉTRICAS DE VALIDAÇÃO

Cada teste deverá informar:

```text
expected
actual
absoluteError
relativeError
tolerance
status
```

Exemplo:

```text
Expected finish time: 102.31
Actual finish time:   102.34
Error:                  0.03
Tolerance:              0.10
Status:                 PASS
```

---

# 52. DOCUMENTAÇÃO DE DECISÕES

Toda decisão arquitetural relevante deverá possuir registro.

Arquivo recomendado:

```text
docs/decisions/
```

Formato:

```text
DECISION:
DATE:
STATUS:
CONTEXT:
EVIDENCE:
ALTERNATIVES:
DECISION:
CONSEQUENCES:
```

---

# 53. REGISTRO DE INCERTEZAS

Arquivo:

```text
docs/evidence/UNKNOWN.md
```

Deverá conter:

```text
Mecânica
Status
O que sabemos
O que não sabemos
Fonte
Impacto
Experimento necessário
```

Exemplos atuais:

- velocidade lateral;
- resolução de ultrapassagens simultâneas;
- histerese do pacer;
- algoritmo exato do wisdom check;
- alguns estados coletivos.

---

# 54. REGRA PARA PARÂMETROS

Todo parâmetro deverá possuir:

```text
nome
valor
unidade
fonte
confiança
```

É proibido:

```text
BLOCK_DISTANCE = 5
```

sem documentação de por que `5` existe.

Se o valor for experimental:

```text
BLOCK_DISTANCE = experimental
```

e deverá existir uma configuração que permita substituí-lo.

---

# 55. NÃO ALTERAR DADOS-FONTE

Arquivos que representam dados originais não devem ser modificados para acomodar o simulador.

Transformações devem ocorrer durante o carregamento:

```text
Raw Data
   ↓
Loader
   ↓
Domain Model
```

Isso preserva a rastreabilidade.

---

# 56. NÃO MISTURAR DADOS COM SIMULAÇÃO

Evitar:

```text
SkillData
    ↓
SkillData executa corrida
```

Preferir:

```text
SkillData
    ↓
SkillEngine
    ↓
RaceState
```

Da mesma forma:

```text
TrackData
    ↓
Track
    ↓
Simulation
```

---

# 57. PRINCÍPIO DE PUREZA

Sempre que possível, componentes matemáticos devem ser funções puras.

Exemplos:

```text
calculateTargetSpeed(...)
calculateAcceleration(...)
evaluateCondition(...)
calculateSkillModifier(...)
```

Isso facilita:

- testes;
- regressão;
- debug;
- comparação com o Umalator.

A Investigação C explicitamente recomendou `ConditionEvaluator` e `SkillEffectApplier` como funções puras.

---

# 58. PERFORMANCE

O projeto será utilizado para executar muitas simulações.

Portanto:

- parsing de skills não deve ocorrer a cada tick;
- condições devem ser pré-processadas;
- objetos temporários no hot path devem ser reduzidos;
- telemetria detalhada deve poder ser desligada;
- múltiplas corridas deverão futuramente poder executar em paralelo.

A arquitetura, porém, não deve sacrificar precisão por otimização prematura.

---

# 59. O QUE É PROIBIDO OTIMIZAR

Não remover cálculos ou simplificar fórmulas porque:

> "o resultado parece quase igual."

Qualquer simplificação de uma fórmula confirmada exige:

1. justificativa;
2. benchmark;
3. teste de regressão;
4. aprovação explícita.

---

# 60. MODELOS EXPERIMENTAIS

O UMA-Lab poderá possuir modelos alternativos.

Exemplo:

```text
LateralModel
├── ExperimentalModelA
├── ExperimentalModelB
└── VerifiedModel
```

Isso é permitido.

O que não é permitido é chamar um modelo experimental de:

```text
OfficialPhysics
```

sem evidência correspondente.

---

# 61. EXPERIMENTOS PRIORITÁRIOS

A fila atual é:

### E1 — LaneMax

Investigar impacto da largura lateral.

### E2 — Bloqueio

Investigar duração crítica de bloqueio.

### E3 — Ultrapassagem

Investigar relação entre distância relativa e ultrapassagem.

### E4 — Densidade

Investigar `near_count` com diferentes números de corredores.

### E5 — Pacer

Investigar influência do pacer.

### E6 — Running Style

Comparar comportamento dos estilos.

### E7 — Wisdom

Investigar variância causada pelo wisdom check.

### E8 — Downhill

Validar economia de HP.

---

# 62. STATUS DAS PRINCIPAIS MECÂNICAS

| Mecânica | Status |
|---|---|
| Geometria da pista | CONFIRMED |
| Position Keep | CONFIRMED |
| Final Spurt | CONFIRMED |
| Speed formulas | CONFIRMED |
| Acceleration formulas | CONFIRMED |
| HP | CONFIRMED |
| Skill effects | CONFIRMED |
| Skill activation flow | CONFIRMED |
| Running styles | CONFIRMED |
| Posição longitudinal | CONFIRMED |
| Posição lateral contínua | STRONGLY SUPPORTED |
| `is_overtake` | STRONGLY SUPPORTED |
| Blocking state | STRONGLY SUPPORTED |
| Draft físico | AUSENTE NO MODELO ANALISADO |
| Economia de stamina por pelotão | AUSENTE NO MODELO ANALISADO |
| Velocidade lateral | UNKNOWN |
| Ultrapassagem simultânea | UNKNOWN |
| Histerese do pacer | UNKNOWN |
| Wisdom algorithm | UNKNOWN/PARCIAL |

---

# 63. PRINCÍPIO DE COMPATIBILIDADE COM O UMALATOR

O Umalator-global não deve ser tratado como adversário.

Ele é uma referência.

O UMA-Lab deverá:

```text
reutilizar
      ↓
validar
      ↓
isolar
      ↓
estender
```

A intenção é preservar tudo aquilo que já funciona e substituir apenas aquilo que impede a representação correta de uma corrida coletiva.

---

# 64. ARQUITETURA DE FLUXO DA CORRIDA

O fluxo conceitual será:

```text
RaceConfiguration
        │
        ▼
Initialize RaceState
        │
        ▼
┌───────────────────────────┐
│         RACE TICK         │
└───────────────────────────┘
        │
        ▼
Update Clock
        │
        ▼
Update Track State
        │
        ▼
Update Phase
        │
        ▼
Calculate Interactions
        │
        ▼
Evaluate Strategy
        │
        ▼
Evaluate Skills
        │
        ▼
Apply Skill Effects
        │
        ▼
Calculate Target Speed
        │
        ▼
Calculate Acceleration
        │
        ▼
Integrate Movement
        │
        ▼
Update Lateral Position
        │
        ▼
Update Derived State
        │
        ▼
Record Telemetry
        │
        ▼
Check Finish
        │
        ├── NO ──→ NEXT TICK
        │
        └── YES
             ↓
        RaceResult
```

A ordem acima é uma **arquitetura conceitual**, não uma afirmação de que a ordem interna exata do jogo já foi completamente determinada.

Qualquer alteração dessa ordem deverá ser documentada e testada.

---

# 65. PRINCÍPIO DE NÃO-CIRCULARIDADE

Os subsistemas não devem formar dependências circulares desnecessárias.

Preferir:

```text
RaceState
   ↓
InteractionState
   ↓
Skill evaluation
   ↓
Effects
   ↓
Physics
```

em vez de:

```text
Skill → Physics → Interaction → Skill → Physics
```

durante o mesmo cálculo.

Quando uma mecânica exigir feedback, o feedback deve ocorrer no tick seguinte ou em uma fase explicitamente definida.

---

# 66. RESULTADO FINAL ESPERADO

O produto final deverá permitir algo como:

```text
BUILD A
        ×
TRACK X
        ×
OPPONENT FIELD
        ↓
10.000 SIMULATIONS
        ↓
┌────────────────────────────┐
│ Win Rate:          63.2%   │
│ Avg Position:       1.84   │
│ Avg Time:         112.31s  │
│ Median Position:   1       │
│ Consistency:      78.4%    │
└────────────────────────────┘
```

E, além dos números:

```text
WHY?
```

com explicações derivadas da telemetria:

- skills ativadas;
- timing;
- posicionamento;
- bloqueios;
- ultrapassagens;
- perda de velocidade;
- ganho de velocidade;
- comportamento por fase;
- desempenho por seção.

---

# 67. PRINCÍPIO MAIS IMPORTANTE DO UMA-LAB

O projeto deve sempre preferir:

> **"Não sabemos."**

a:

> **"Provavelmente é assim."**

E deve preferir:

> **"Este modelo é experimental."**

a:

> **"O jogo funciona assim."**

O valor científico do UMA-Lab depende mais da rastreabilidade de suas suposições do que da quantidade de funcionalidades.

---

# 68. CONTRATO PARA AGENTES DE IA

Antes de modificar o código, qualquer agente deverá:

1. ler `ARCHITECTURE.md`;
2. ler `DECISIONS.md`;
3. verificar `UNKNOWN.md`;
4. localizar a fonte da mecânica que pretende modificar;
5. determinar o nível de evidência;
6. identificar os testes afetados;
7. implementar a menor alteração necessária;
8. executar os testes;
9. registrar qualquer decisão nova;
10. informar explicitamente qualquer hipótese.

---

# 69. REGRA DE ESCOPO

Se a tarefa for:

> "implemente bloqueio"

o agente não está autorizado a:

- redesenhar o sistema de skills;
- alterar física;
- mudar fórmulas;
- criar um sistema lateral completamente novo;
- reorganizar o projeto inteiro.

Deve modificar somente aquilo necessário para cumprir a tarefa.

---

# 70. REGRA DE MODIFICAÇÃO

Antes de alterar qualquer arquivo, o agente deve responder internamente:

```text
QUAL É A FONTE DESTA REGRA?
QUAL É O NÍVEL DE EVIDÊNCIA?
QUAL É O MENOR CÓDIGO NECESSÁRIO?
QUAIS TESTES VALIDAM A MUDANÇA?
```

Se não conseguir responder:

> não implementar a regra.

---

# 71. REGRA DE NOVOS ARQUIVOS

Um agente não deve criar novos arquivos apenas por conveniência.

Antes de criar um arquivo:

```text
O arquivo corresponde a uma responsabilidade arquitetural real?
Existe outro arquivo que já possui essa responsabilidade?
A criação está alinhada com ARCHITECTURE.md?
```

Se não:

> não criar.

---

# 72. REGRA DE ALTERAÇÃO DE ARQUITETURA

Nenhum agente pode alterar:

- estrutura principal;
- interfaces centrais;
- fluxo do RaceEngine;
- modelo de RaceState;
- contrato do ConditionEngine;
- contrato do TelemetryEngine;

sem registrar uma Architecture Decision.

---

# 73. CRITÉRIO DE CONCLUSÃO

Uma funcionalidade só será considerada concluída quando:

```text
Implementada
    +
Testada
    +
Documentada
    +
Classificada quanto à evidência
```

Código sem teste não está concluído.

Código baseado em hipótese não documentada não está concluído.

---

# 74. ROADMAP MACRO

```text
INVESTIGAÇÃO
     │
     ├── A
     ├── B
     ├── C
     └── D
          │
          ▼
ARQUITETURA v1
          │
          ▼
SINGLE RUNNER
          │
          ▼
REGRESSION
          │
          ▼
MULTI RUNNER
          │
          ▼
INTERACTIONS
          │
          ▼
LATERAL
          │
          ▼
SKILLS
          │
          ▼
TELEMETRIA
          │
          ▼
STATISTICS
          │
          ▼
BUILD COMPARISON
          │
          ▼
COMPATIBILITY ANALYSIS
          │
          ▼
UMA-LAB
```

---

# 75. ESTADO DE APROVAÇÃO

Este documento define a arquitetura inicial do UMA-Lab.

Ele **não afirma que todas as mecânicas do jogo foram descobertas**.

Ele define:

- o que sabemos;
- o que reutilizaremos;
- o que reconstruiremos;
- o que permanece desconhecido;
- como o código deverá ser organizado;
- como a IA deverá trabalhar;
- como o simulador deverá ser validado.

Alterações futuras deverão preservar esses princípios ou registrar explicitamente por que eles foram modificados.

---

## FIM DA ESPECIFICAÇÃO UMA-LAB v1.0