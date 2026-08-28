# UMA-Lab — Arquitetura Inicial do Simulador e Analisador

**Status:** Proposta inicial  
**Versão:** 0.1  
**Data:** 28/08/2026  
**Objetivo:** definir a arquitetura do novo simulador de corridas, do sistema de análise de builds e das regras de desenvolvimento assistido por IA.

---

# 1. Objetivo do projeto

O UMA-Lab deverá evoluir de um conjunto de bancos de dados e um protótipo de analisador para uma ferramenta capaz de:

1. representar fielmente personagens, builds, skills, pistas e condições de corrida;
2. simular uma corrida completa com **9 ou mais corredores**;
3. modelar interações entre corredores;
4. modelar posicionamento, ultrapassagens, bloqueios, mudanças de faixa e interferências;
5. calcular ativações de skills de acordo com suas condições reais;
6. produzir resultados reproduzíveis e auditáveis;
7. analisar a compatibilidade de uma build com uma pista;
8. comparar duas ou mais builds na mesma pista;
9. identificar pontos fortes e fracos de uma build;
10. apresentar os resultados por meio de tabelas e gráficos;
11. permitir futuramente análises de sensibilidade e otimização de builds.

O projeto **não deve depender de uma IA para decidir o resultado de uma corrida**.

A IA poderá auxiliar no desenvolvimento, interpretação e explicação dos resultados, mas os resultados numéricos devem ser produzidos por código determinístico ou por um sistema de aleatoriedade controlada e documentada.

---

# 2. Princípio fundamental

## Fonte de verdade

O projeto possui três categorias de informação:

### A. Dados confirmados

Informações extraídas ou validadas a partir de fontes externas ou observações in-game.

Exemplos:

- atributos;
- aptidões;
- crescimento;
- skills;
- condições de skills;
- layouts de pistas;
- fases;
- curvas;
- retas;
- inclinações;
- thresholds.

Esses dados **não podem ser alterados por inferência da IA**.

### B. Mecânicas confirmadas

Fórmulas ou comportamentos confirmados por documentação, código do jogo/simulador, testes ou observações.

Devem ser documentados individualmente.

### C. Mecânicas desconhecidas ou aproximadas

Quando o comportamento real do jogo não estiver suficientemente determinado, o sistema deve registrar explicitamente:

```text
UNKNOWN
```

ou:

```text
APPROXIMATION
```

Nunca transformar uma hipótese em uma regra silenciosamente.

---

# 3. Situação atual do repositório

O repositório atual contém:

```text
Uma-Lab/
├── analyst/
├── uma_data/
├── gametora_data/
├── game8_guides/
├── uma_guides/
├── umalator-global/
│
├── UMA - dados gerais (completo).txt
├── UMA - skills (completo).txt
├── UMA - support cards (completo).txt
├── UMA - pistas CM 1-18.txt
├── UMA - fatores de heranca.txt
├── UMA - cenarios de treino.txt
├── UMA - metas de CM (comunidade).txt
│
├── RELATORIO - revisao e correcoes.md
└── RELATORIO - validacao de pistas.md
```

O README identifica `analyst/` como o protótipo de analisador e `umalator-global/` como uma cópia do simulador baseado em `alpha123/uma-tools`.

O banco de personagens contém 99 cartas correspondentes a 64 personagens únicos, preservando diferenças entre skins.

O banco de skills contém atualmente 591 skills e possui IDs para cruzamento com personagens e support cards, além de condições, pré-condições, duração, cooldown e escalas dinâmicas.

---

# 4. Problema do simulador atual

O `umalator-global` é uma referência extremamente útil, mas não deve ser tratado como a implementação definitiva da corrida.

O objetivo do novo motor é superar principalmente:

- limitação do número de corredores;
- simplificações de posicionamento;
- interações entre corredores;
- bloqueios;
- ultrapassagens;
- disputa por espaço;
- mudanças de faixa;
- quantidade de corredores;
- comportamento coletivo do pelotão.

A arquitetura deve, portanto, ser construída em torno de um conceito:

> **A corrida é um sistema multiagente.**

Não devemos modelar:

```text
Corredor A → corre sozinho
Corredor B → corre sozinho
Corredor C → corre sozinho
```

e posteriormente comparar os tempos.

Devemos modelar:

```text
                    RACE
                     │
          ┌──────────┼──────────┐
          │          │          │
       Runner A   Runner B   Runner C
          │          │          │
          └──────────┼──────────┘
                     │
              INTERACTIONS
                     │
        ┌────────────┼────────────┐
        │            │            │
     Position     Blocking     Overtake
        │            │            │
        └────────────┼────────────┘
                     │
                Race State
```

---

# 5. Separação fundamental do sistema

O projeto deve ser dividido em cinco grandes camadas:

```text
┌──────────────────────────────────────────────┐
│                    DATA                      │
│ personagens, skills, pistas, etc.            │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│                   DOMAIN                     │
│ Build, Runner, Track, Race, Skill, etc.      │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│                  SIMULATION                  │
│ motor temporal da corrida                    │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│                   ANALYSIS                   │
│ comparação, compatibilidade e diagnóstico    │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│               PRESENTATION                   │
│ interface, gráficos e relatórios             │
└──────────────────────────────────────────────┘
```

Nenhuma camada deve assumir responsabilidades pertencentes a outra.

---

# 6. Estrutura de pastas proposta

A estrutura inicial recomendada é:

```text
Uma-Lab/
│
├── data/
│   ├── characters/
│   ├── skills/
│   ├── supports/
│   ├── tracks/
│   ├── inheritance/
│   ├── scenarios/
│   └── sources/
│
├── simulator/
│   ├── domain/
│   │   ├── runner/
│   │   ├── race/
│   │   ├── track/
│   │   ├── skill/
│   │   └── build/
│   │
│   ├── engine/
│   │   ├── physics/
│   │   ├── movement/
│   │   ├── positioning/
│   │   ├── overtaking/
│   │   ├── blocking/
│   │   ├── skills/
│   │   └── phases/
│   │
│   ├── random/
│   ├── events/
│   └── simulation/
│
├── analysis/
│   ├── compatibility/
│   ├── comparison/
│   ├── ranking/
│   ├── strengths/
│   ├── weaknesses/
│   └── sensitivity/
│
├── presentation/
│   ├── web/
│   ├── charts/
│   └── reports/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── regression/
│   ├── simulation/
│   └── validation/
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── GAME_MECHANICS.md
│   ├── SIMULATION_MODEL.md
│   ├── SKILL_CONDITIONS.md
│   ├── VALIDATION.md
│   └── AI_RULES.md
│
└── tools/
    ├── data_import/
    ├── data_validation/
    └── migration/
```

Os nomes exatos de arquivos e linguagem ainda não devem ser fixados.

A escolha da linguagem deve ser feita depois de avaliar o código existente e o desempenho necessário.

---

# 7. Entidades principais

## 7.1 Character

Representa a carta/personagem, e não uma build.

```text
Character
├── id
├── name
├── title
├── baseStats
├── growthRates
├── aptitudes
├── uniqueSkill
├── innateSkills
└── potentialSkills
```

Uma skin deve ser uma entidade independente quando seus dados forem diferentes.

---

# 8. Build

Representa a configuração efetivamente colocada na corrida.

```text
Build
├── character
├── stats
│   ├── speed
│   ├── stamina
│   ├── power
│   ├── guts
│   └── wit
│
├── aptitudes
├── skills
├── inheritedSkills
├── strategy
├── equipment/configuration
└── metadata
```

A build deve ser imutável durante a simulação, salvo efeitos explicitamente previstos pelas regras.

---

# 9. Runner

`Runner` representa uma build participando de uma corrida.

Isso é diferente de `Build`.

```text
Build
   │
   ▼
Runner
```

O `Runner` possui estado dinâmico:

```text
Runner
├── build
├── position
├── lane
├── distance
├── speed
├── acceleration
├── stamina/HP
├── currentPhase
├── currentState
├── activeEffects
├── activatedSkills
├── blockedState
├── overtakingState
├── targetRunner
└── history
```

Esse estado muda continuamente durante a simulação.

---

# 10. Track

A pista deve ser tratada como uma sequência espacial de segmentos.

```text
Track
├── metadata
├── distance
├── surface
├── direction
├── season
├── weather
├── groundCondition
├── phases
├── straights
├── corners
├── slopes
├── thresholds
├── positionKeep
└── finalSpurt
```

O arquivo de pistas já contém grande parte dessas informações, incluindo fases, retas, curvas, inclinações, thresholds, spurt e Position Keep.

A validação existente encontrou correspondência de 18/18 pistas entre o dataset da gametora e o `umalator`, portanto esse banco deve ser tratado como uma base confiável para a reconstrução da pista.

---

# 11. TrackSegment

O simulador não deve consultar a pista apenas como:

```text
track.isCorner(distance)
```

O ideal é representar explicitamente o estado espacial:

```text
TrackSegment
├── start
├── end
├── type
├── phase
├── slope
├── laneProperties
└── specialProperties
```

Tipos possíveis:

```text
START
STRAIGHT
CORNER
SLOPE_UP
SLOPE_DOWN
FINAL_CORNER
FINAL_STRAIGHT
```

Um mesmo segmento pode possuir múltiplas propriedades.

Não assumir que os tipos são mutuamente exclusivos.

---

# 12. Race

Representa uma corrida inteira.

```text
Race
├── track
├── conditions
├── runners[]
├── randomSeed
├── time
├── state
└── eventHistory
```

A corrida deve aceitar **qualquer número válido de corredores**, e não possuir uma lógica especial para exatamente dois.

Exemplo:

```text
Race
├── Runner 1
├── Runner 2
├── Runner 3
├── Runner 4
├── Runner 5
├── Runner 6
├── Runner 7
├── Runner 8
└── Runner 9
```

A arquitetura deve continuar funcionando com:

```text
9
12
18
...
```

sem alterar o algoritmo principal.

---

# 13. RaceState

O estado global da corrida deve ser separado dos objetos permanentes.

```text
RaceState
├── elapsedTime
├── distance
├── phase
├── runners
├── activeEvents
├── randomState
└── globalConditions
```

Isso permitirá:

- salvar uma simulação;
- reproduzir uma corrida;
- comparar duas execuções;
- fazer debugging;
- criar testes determinísticos.

---

# 14. Event System

Como muitas mecânicas dependem de acontecimentos, o simulador deve possuir eventos.

Exemplos:

```text
RaceStarted
PhaseChanged
RunnerMoved
RunnerAccelerated
RunnerSlowed
RunnerBlocked
RunnerUnblocked
RunnerStartedOvertake
RunnerCompletedOvertake
SkillConditionMet
SkillActivated
SkillExpired
RunnerChangedLane
RunnerFinished
```

Isso é preferível a espalhar efeitos diretamente pelo código.

---

# 15. Motor temporal

O simulador deverá funcionar em pequenos intervalos de tempo ou eventos discretos.

A implementação exata ainda precisa ser investigada.

Não devemos simplesmente escolher arbitrariamente:

```text
tick = 0.1 seconds
```

sem verificar se a resolução é suficiente para representar corretamente as mecânicas do jogo.

Essa decisão deve ser documentada e validada.

A arquitetura deve permitir futuramente alterar:

```text
0.1 s
```

para:

```text
0.05 s
```

ou outro método de integração sem reescrever as regras da corrida.

---

# 16. Pipeline de cada ciclo

Conceitualmente:

```text
START
  │
  ▼
Atualizar posição espacial
  │
  ▼
Determinar segmento da pista
  │
  ▼
Atualizar fase
  │
  ▼
Atualizar estado dos corredores
  │
  ├── bloqueio
  ├── ultrapassagem
  ├── mudança de faixa
  ├── distância entre corredores
  └── estratégia
  │
  ▼
Avaliar condições de skills
  │
  ▼
Ativar skills
  │
  ▼
Aplicar efeitos
  │
  ▼
Calcular velocidade/aceleração
  │
  ▼
Atualizar posição
  │
  ▼
Verificar chegada
  │
  ├── não terminou → próximo ciclo
  │
  └── terminou → resultado
```

A ordem exata desse pipeline **ainda é uma hipótese arquitetural** e deverá ser confirmada contra as mecânicas conhecidas do jogo.

---

# 17. Sistema de skills

Uma das partes mais importantes do sistema.

As skills atualmente possuem:

- ID;
- categoria;
- raridade;
- grau;
- custo;
- efeitos;
- duração;
- cooldown;
- pré-condições;
- condições;
- condições alternativas;
- escalas dinâmicas;
- variantes;
- fontes.

Isso já está documentado no banco atual.

Portanto, a skill não deve ser implementada como:

```text
if skill == "X":
    ...
```

O sistema deve utilizar dados.

Conceitualmente:

```text
Skill
├── id
├── effects[]
├── activationCondition
├── precondition
├── duration
├── cooldown
└── dynamicScaling
```

---

# 18. Condition Engine

As condições devem possuir um interpretador próprio.

Exemplo:

```text
phase>=2
order<=3
remain_distance<=200
corner!=0
```

O banco já documenta condições como:

- `phase`
- `order`
- `order_rate`
- `remain_distance`
- `distance_rate`
- `distance_diff_top`
- `corner`
- `is_finalcorner`
- `is_finalstraight`
- `near_count`
- `blocked_front_continuetime`
- `blocked_side_continuetime`
- `change_order_onetime`
- `is_overtake`
- `running_style_count_*`
- entre várias outras.

O interpretador deve receber um contexto:

```text
ConditionContext
```

e responder:

```text
true / false
```

ou, futuramente, valores necessários para condições complexas.

---

# 19. Condições devem acessar RaceState

Uma skill não deve saber como encontrar um corredor.

Errado:

```text
Skill → procura corredor
```

Correto:

```text
RaceState
    ↓
ConditionContext
    ↓
ConditionEvaluator
    ↓
Skill
```

Isso mantém as regras desacopladas.

---

# 20. Position System

Essa será uma das maiores diferenças em relação ao simulador antigo.

Cada corredor precisa possuir:

```text
distance
lane
order
orderRate
```

e informações relativas aos demais corredores:

```text
distanceToFront
distanceToBehind
distanceDiffTop
nearCount
```

Além disso:

```text
blockedFront
blockedSide
isOvertaking
overtakeTarget
```

devem ser derivados do estado coletivo.

Não devem ser armazenados como números independentes sem uma razão clara.

---

# 21. Pelotão

O pelotão deve ser uma estrutura dinâmica.

Exemplo:

```text
                FRONT

Runner A ────────────────
             Runner B ──────────
Runner C ─────────────────────
       Runner D ────────────────
           Runner E ─────────────
Runner F ───────────────────────
                   Runner G ────
          Runner H ─────────────
Runner I ───────────────────────

                BACK
```

O simulador deve determinar:

- quem está à frente;
- quem está atrás;
- quem está próximo;
- quem está bloqueando;
- quem pode ultrapassar;
- quem precisa mudar de faixa.

Essas relações devem ser recalculadas conforme o pelotão muda.

---

# 22. Overtaking System

Ultrapassagem deve ser uma mecânica própria.

```text
OvertakeSystem
├── canOvertake()
├── selectTarget()
├── evaluateGap()
├── initiateOvertake()
├── maintainOvertake()
└── completeOvertake()
```

Não tratar uma ultrapassagem simplesmente como:

```text
if speedA > speedB:
    swap(position)
```

Isso seria justamente uma das simplificações que o novo simulador pretende eliminar.

---

# 23. Blocking System

O bloqueio também deve ser independente.

```text
BlockingSystem
├── detectFrontBlock()
├── detectSideBlock()
├── calculateBlockedDuration()
└── resolveMovement()
```

Isso é necessário porque várias skills utilizam diretamente condições de bloqueio.

O próprio banco documenta condições como:

```text
blocked_front
blocked_front_continuetime
blocked_side_continuetime
```

e o relatório de validação confirmou situações reais de bloqueio observadas in-game.

---

# 24. Lane System

A posição longitudinal não é suficiente.

O corredor também precisa possuir uma representação lateral.

```text
RunnerPosition
├── distance
├── lane
├── lateralPosition
└── laneState
```

A representação matemática exata ainda deve ser definida após investigação das mecânicas de faixa.

**Não assumir que o jogo utiliza simplesmente três faixas fixas.**

---

# 25. Estratégia de corrida

A estratégia deve ser modelada como comportamento, não apenas como atributo.

```text
RunningStrategy
├── FrontRunner
├── PaceChaser
├── LateSurger
└── EndCloser
```

Cada estratégia pode influenciar:

- objetivo de posição;
- aceleração;
- preferência de faixa;
- reação ao pelotão;
- ultrapassagem;
- comportamento em determinadas fases.

Essas regras precisam ser documentadas separadamente.

---

# 26. Randomness

O simulador deverá possuir um gerador aleatório controlável.

```text
SimulationConfig
└── seed
```

Com isso:

```text
seed = 12345
```

deve produzir a mesma corrida.

Isso é fundamental para debugging.

Também permitirá:

```text
Build A
1000 simulações
seed 1–1000
```

e:

```text
Build B
1000 simulações
seed 1–1000
```

comparando as duas sob o mesmo conjunto de condições aleatórias.

---

# 27. Resultado da simulação

Uma corrida não deve retornar somente:

```text
1º lugar
```

O resultado deve preservar dados suficientes para análise posterior.

```text
SimulationResult
├── finishOrder[]
├── finishTimes[]
├── totalDistance
├── runnerResults[]
├── skillActivations[]
├── positionHistory
├── speedHistory
├── staminaHistory
├── blockingHistory
├── overtakingHistory
└── randomSeed
```

---

# 28. RunnerResult

```text
RunnerResult
├── finalPosition
├── finishTime
├── averageSpeed
├── maxSpeed
├── distanceCovered
├── staminaRemaining
├── skillsActivated
├── skillsFailed
├── timeBlocked
├── overtakes
├── timesOvertaken
└── phasePerformance
```

A lista exata de métricas ainda deve ser ajustada conforme as informações que o simulador conseguir produzir de maneira confiável.

---

# 29. Analysis Layer

O analisador deve consumir resultados do simulador.

Nunca modificar o simulador para produzir diretamente uma nota de build.

Fluxo:

```text
Build
  +
Track
  +
Race Configuration
       │
       ▼
Simulation
       │
       ▼
SimulationResult
       │
       ▼
Analysis
       │
       ▼
AnalysisResult
```

---

# 30. CompatibilityAnalyzer

A compatibilidade não deve ser uma fórmula arbitrária como:

```text
score =
speed * 0.3 +
stamina * 0.2 +
power * 0.5
```

a menos que esses pesos sejam fundamentados.

A primeira versão deve procurar medir compatibilidade através de resultados observáveis.

Exemplo:

```text
CompatibilityAnalyzer
├── aptitudeCompatibility
├── statCompatibility
├── skillCompatibility
├── trackCompatibility
├── strategyCompatibility
└── simulationPerformance
```

A composição final da nota deverá ser especificada em documento próprio.

---

# 31. BuildComparator

O comparador deverá comparar builds sob as mesmas condições.

```text
BuildComparator
├── compareFinishTime()
├── compareWinRate()
├── comparePodiumRate()
├── compareAveragePosition()
├── compareSkillValue()
├── compareStaminaEfficiency()
├── comparePhasePerformance()
└── compareConsistency()
```

Nunca comparar duas builds usando sementes aleatórias completamente diferentes quando o objetivo for medir diferenças entre elas.

Preferir:

```text
Seeds:
1,2,3,...,1000

Build A → seeds 1–1000
Build B → seeds 1–1000
```

Isso reduz ruído estatístico.

---

# 32. Strength/Weakness Analyzer

O sistema deve explicar o resultado com base nos dados.

Exemplo:

```text
Strength:
Excelente desempenho durante a reta final.

Evidence:
- 94% de ativação da skill X;
- forte aceleração na entrada do spurt;
- baixa frequência de bloqueio no final.

Weakness:
Dependência elevada de posição.

Evidence:
- skill X ativou somente em 31% das corridas;
- média de posição no final da fase 2: 6.8;
- bloqueio acima da média.
```

A explicação deve sempre possuir evidências mensuráveis.

---

# 33. Gráfico principal

A interface deverá possuir um gráfico comparativo.

Exemplo conceitual:

```text
                     BUILD A     BUILD B

Velocidade             ████████    ██████
Aceleração             ███████     ████████
Stamina                █████████   ██████
Curvas                 █████       ████████
Retas                  ████████    ██████
Posicionamento         ███████     ████████
Skills                 █████████   ███████
Consistência           ████████    █████
```

O gráfico deve ser gerado a partir de métricas reais.

Nunca atribuir valores arbitrários apenas para produzir uma visualização bonita.

---

# 34. Análise de sensibilidade

Fase posterior.

O sistema poderá alterar uma variável por vez:

```text
Speed +10
Speed +20
Speed +30
...
```

ou:

```text
Skill A
Skill B
Skill C
```

e medir o impacto.

Resultado:

```text
Variável              Impacto médio

Speed +50             -0.083 s
Power +50             -0.041 s
Skill A               -0.092 s
Skill B               -0.014 s
Stamina +50           -0.031 s
```

Essa ferramenta será particularmente importante para descobrir **quais características realmente importam**, em vez de depender somente de opiniões de comunidade.

---

# 35. Reutilização do umalator-global

O `umalator-global` não deve ser simplesmente copiado para dentro do novo motor e modificado indiscriminadamente.

Ele deve ser tratado como:

## 1. Fonte de referência

Usar para descobrir:

- fórmulas;
- constantes;
- estruturas;
- comportamento de pista;
- cálculos existentes.

## 2. Fonte de dados

Quando um dataset for confirmado e validado.

## 3. Fonte de testes

Comparar resultados do novo simulador com situações conhecidas do antigo.

## 4. Código potencialmente reutilizável

Somente depois de análise individual.

---

# 36. O que NÃO deve ser reutilizado automaticamente

Não copiar cegamente:

- arquitetura;
- limitações de número de corredores;
- abstrações feitas para o simulador original;
- simplificações de posicionamento;
- fórmulas não verificadas;
- decisões de interface;
- qualquer comportamento que exista somente porque o simulador antigo precisava funcionar daquela maneira.

O objetivo é:

```text
umalator
    ↓
investigação
    ↓
validação
    ↓
reimplementação
```

e não:

```text
umalator
    ↓
copiar
    ↓
remendar
```

---

# 37. Regra de ouro para reutilização

Para cada trecho do `umalator` que for considerado para reutilização, criar uma classificação:

```text
CONFIRMED
```

```text
VALIDATED
```

```text
UNKNOWN
```

```text
APPROXIMATION
```

```text
OBSOLETE
```

Somente `CONFIRMED` e `VALIDATED` podem entrar diretamente no núcleo.

`UNKNOWN` e `APPROXIMATION` precisam permanecer explicitamente identificados.

---

# 38. Regras obrigatórias para agentes de IA

Estas regras são parte da especificação do projeto.

## REGRA 1 — Não inventar dados

Se um valor não estiver no banco ou em uma fonte autorizada:

**não inventar.**

---

## REGRA 2 — Não inventar fórmulas

Se uma fórmula não estiver documentada:

**não criar uma fórmula "plausível".**

Marcar:

```text
FORMULA UNKNOWN
```

e solicitar investigação.

---

## REGRA 3 — Não assumir comportamento do jogo

Nunca concluir:

> "Provavelmente o jogo faz X."

e implementar X como fato.

Registrar:

```text
HYPOTHESIS
```

até validação.

---

## REGRA 4 — Não modificar dados de origem

Arquivos de dados brutos e arquivos de fonte devem ser tratados como somente leitura.

Nunca "corrigir" um dataset diretamente.

Criar uma camada de transformação/versionamento.

---

## REGRA 5 — Não apagar código antigo

Nenhum agente pode remover código funcional sem:

1. identificar o código;
2. explicar a razão;
3. verificar dependências;
4. criar/substituir testes;
5. obter aprovação humana.

---

## REGRA 6 — Não criar arquivos sem necessidade

Antes de criar um arquivo, verificar:

1. se já existe arquivo com a mesma responsabilidade;
2. se a funcionalidade realmente precisa de um novo módulo;
3. se o arquivo pertence à arquitetura definida.

---

## REGRA 7 — Não modificar arquitetura sozinho

A IA não pode decidir:

> "Vou mudar tudo para outra arquitetura."

sem aprovação.

---

## REGRA 8 — Não alterar APIs públicas silenciosamente

Mudanças em interfaces/classes/funções utilizadas por outras partes do projeto precisam ser identificadas.

---

## REGRA 9 — Não misturar simulação e apresentação

O simulador não deve importar componentes da interface.

---

## REGRA 10 — Não colocar regras de jogo na interface

Exemplo proibido:

```text
if track == "Tokyo":
    ...
```

dentro do frontend.

---

## REGRA 11 — Não colocar dados dentro das regras

Exemplo proibido:

```text
if character == "Oguri Cap":
    speed += 20
```

Os dados devem vir do banco.

---

## REGRA 12 — Toda regra nova precisa de teste

Uma nova mecânica deve possuir pelo menos:

```text
unit test
```

quando possível.

Mecânicas complexas também devem possuir:

```text
simulation/regression test
```

---

## REGRA 13 — Toda fórmula importante precisa de documentação

Exemplo:

```text
docs/SIMULATION_MODEL.md
```

deve conter:

```text
Fórmula
Fonte
Hipóteses
Unidades
Limitações
Testes
```

---

## REGRA 14 — Não alterar uma regra para fazer um teste passar

Se o teste falhar:

```text
investigar primeiro.
```

Não fazer:

```text
alterar fórmula → teste passa → pronto
```

---

## REGRA 15 — Não considerar o umalator como autoridade absoluta

O simulador antigo é uma fonte de comparação, não uma prova de que determinada mecânica está correta.

---

## REGRA 16 — Preservar rastreabilidade

Todo dado importante deve permitir responder:

> "De onde veio este número?"

---

## REGRA 17 — Não esconder aproximações

Se uma mecânica for aproximada:

```text
APPROXIMATION
```

deve estar documentado.

---

## REGRA 18 — Mudanças grandes devem ser pequenas por etapas

Preferir:

```text
1 alteração
→ testes
→ validação
→ próxima alteração
```

a:

```text
alterar 20 sistemas
→ tentar descobrir por que quebrou
```

---

# 39. Protocolo obrigatório para agentes

Antes de modificar código:

```text
1. Ler ARCHITECTURE.md
2. Ler documentos relevantes
3. Inspecionar arquivos existentes
4. Identificar dependências
5. Explicar plano
6. Implementar somente o solicitado
7. Executar testes
8. Relatar alterações
9. Relatar incertezas
```

A IA deve terminar informando:

```text
FILES CHANGED:
...

FILES CREATED:
...

FILES DELETED:
...

TESTS:
...

ASSUMPTIONS:
...

UNKNOWN:
...
```

---

# 40. Modo de planejamento

Para tarefas grandes, a IA deve primeiro produzir:

```text
PLAN.md
```

ou uma resposta de planejamento contendo:

```text
Objetivo
Arquivos afetados
Mudanças propostas
Dependências
Riscos
Testes necessários
```

Somente depois deve implementar.

---

# 41. Modo de investigação

Quando o pedido envolver uma mecânica desconhecida:

```text
INVESTIGATION MODE
```

A IA deve:

1. procurar evidências existentes;
2. verificar dados do repositório;
3. verificar código existente;
4. verificar testes;
5. comparar fontes;
6. classificar a confiança.

Resultado:

```text
CONFIDENCE: HIGH
```

ou:

```text
CONFIDENCE: MEDIUM
```

ou:

```text
CONFIDENCE: LOW
```

---

# 42. Hierarquia de fontes

Para regras do projeto, utilizar:

```text
1. Evidência direta in-game
2. Dados oficiais/documentação confiável
3. Código validado
4. Dados independentes concordantes
5. Documentação comunitária
6. Inferência
```

Quanto mais abaixo da lista, maior deve ser a cautela.

---

# 43. Validação do simulador

O novo simulador deve possuir três níveis de validação.

## Nível 1 — Unidade

Testar:

```text
calculateSpeed()
evaluateCondition()
calculateDistance()
detectCorner()
...
```

## Nível 2 — Mecânica

Testar:

```text
skill activation
overtaking
blocking
phase transition
stamina consumption
...
```

## Nível 3 — Corrida

Testar uma corrida completa conhecida.

---

# 44. Testes de regressão

Toda mecânica validada deve possuir um caso de regressão.

Exemplo:

```text
CM1
Tokyo
2400m
Runner configuration X
Seed 12345
```

Se uma futura alteração mudar o resultado:

```text
REGRESSION DETECTED
```

e a alteração precisa ser investigada.

---

# 45. Validação contra corridas reais

O projeto possui uma vantagem rara: existem observações in-game no próprio repositório.

O relatório de validação já cruzou quatro corridas reais da Taurus Cup com as condições de skills e da pista e encontrou consistência entre as ativações observadas e as condições documentadas.

Esses dados devem virar testes.

Exemplo:

```text
Expected:
Skill X activates

Expected:
Skill Y does not activate

Expected:
Runner A finishes before Runner B
```

Não necessariamente exigir que o simulador reproduza exatamente todos os milissegundos de uma corrida real, mas utilizar essas corridas como **evidência de comportamento**.

---

# 46. Dados do protótipo atual

O `analyst/app/data.json` já possui uma estrutura bastante útil:

```text
chars[]
├── id
├── name
├── title
├── apt
├── growth
├── base
├── unique
├── innate[]
└── potential[]
```

Isso mostra que existe um embrião de modelo de dados estruturado que pode servir como referência para a nova camada de dados.

Entretanto, não transformar automaticamente esse JSON no modelo definitivo.

Primeiro verificar quais campos são necessários pelo simulador.

---

# 47. O protótipo de analyst

O `analyst` atual deve ser considerado:

```text
PROTOTYPE
```

e não:

```text
CORE ENGINE
```

Ele já contém conceitos úteis como:

- aptidões;
- distância;
- estratégia;
- fases;
- nomes de atributos;
- ranking;
- visualização.

Esses conceitos podem ser reaproveitados, mas a lógica deve ser gradualmente separada da interface.

---

# 48. Ordem recomendada de desenvolvimento

Não começar pelo frontend.

## Fase 1 — Fundação

```text
Data model
Track model
Build model
Runner model
Race model
```

## Fase 2 — Motor básico

```text
distance
speed
acceleration
stamina
phases
finish
```

## Fase 3 — Pelotão

```text
position
order
distance between runners
near runners
blocking
```

## Fase 4 — Movimento

```text
lane
overtaking
lane change
strategy behavior
```

## Fase 5 — Skills

```text
condition engine
activation
duration
effects
cooldown
dynamic scaling
```

## Fase 6 — Validação

```text
unit tests
mechanical tests
real-race tests
umalator comparison
```

## Fase 7 — Análise

```text
compatibility
comparison
strengths
weaknesses
statistics
```

## Fase 8 — Interface

```text
build editor
track selector
simulation
charts
reports
```

## Fase 9 — Otimização

Somente depois:

```text
sensitivity analysis
build search
optimization
```

---

# 49. Primeira versão do simulador

O MVP não precisa implementar todas as 591 skills.

O primeiro objetivo deve ser:

```text
9 corredores
+
1 pista
+
atributos
+
estratégias
+
movimento
+
posicionamento
+
ultrapassagem
+
bloqueio
+
resultado
```

Depois:

```text
skills simples
```

Depois:

```text
skills complexas
```

Depois:

```text
skills dinâmicas
```

Isso permite descobrir problemas no modelo antes de introduzir centenas de exceções.

---

# 50. Regra fundamental para o MVP

O MVP deve simular **poucas mecânicas corretamente**, e não muitas mecanicamente de forma aproximada.

É preferível:

```text
9 corredores
+ posicionamento confiável
+ ultrapassagem razoável
```

a:

```text
591 skills
+ 9 corredores
+ física simplificada
+ comportamento de pelotão inventado
```

---

# 51. Arquitetura futura

Depois que o motor estiver validado:

```text
                         UMA-LAB
                            │
             ┌──────────────┼──────────────┐
             │              │              │
          DATABASE       SIMULATOR      ANALYST
             │              │              │
             │              ▼              │
             │       MULTI-AGENT RACE      │
             │              │              │
             │              ▼              │
             │       SIMULATION RESULT      │
             │              │              │
             └──────────────┼──────────────┘
                            ▼
                       COMPARISON
                            │
                 ┌──────────┴──────────┐
                 ▼                     ▼
              GRAPHS                REPORT
                 │                     │
                 └──────────┬──────────┘
                            ▼
                       OPTIMIZATION
```

---

# 52. Objetivo final

O resultado final não deve ser simplesmente:

> "Esta build é Tier S."

Deve ser capaz de responder:

> **"Por que esta build funciona nesta pista?"**

e:

> **"O que faz esta build perder para aquela?"**

e:

> **"Qual mecânica está produzindo essa diferença?"**

e, futuramente:

> **"Se eu trocar esta skill, quanto muda o desempenho?"**

Essa é a finalidade real do UMA-Lab.

---

# 53. Regra final para a IA

A seguinte regra deve ser considerada absoluta:

> **Quando houver conflito entre completar uma tarefa e preservar a fidelidade dos dados/mecânicas, preservar a fidelidade.**

Uma funcionalidade incompleta pode ser implementada depois.

Uma mecânica inventada pode contaminar todos os resultados produzidos pelo simulador.

O UMA-Lab deve preferir:

```text
UNKNOWN
```

a:

```text
FAKE PRECISION
```

---

# 54. Próximo passo

A arquitetura acima é uma especificação inicial, não uma autorização para começar a implementar tudo.

Antes de criar o simulador, devem ser realizadas duas investigações:

### Investigação A — `umalator-global`

Mapear:

- estrutura dos arquivos;
- engine;
- fórmulas;
- estado dos corredores;
- loop da corrida;
- sistema de skills;
- sistema de posicionamento;
- partes que podem ser reutilizadas;
- partes que precisam ser reescritas.

### Investigação B — mecânicas do jogo

Construir:

```text
GAME_MECHANICS.md
```

contendo somente mecânicas cuja implementação esteja suficientemente fundamentada.

Somente depois dessas duas investigações deve começar a implementação do novo `RaceEngine`.

---

# 55. Regra de versionamento

Toda mudança relevante no simulador deve possuir:

```text
Before
After
Reason
Evidence
Tests
```

Isso permitirá descobrir posteriormente por que determinado resultado mudou.

O simulador deve ser tratado como uma ferramenta científica/experimental, não apenas como uma aplicação comum.

---

**Fim da especificação inicial.**