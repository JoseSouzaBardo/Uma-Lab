# Auditoria de stamina por estratégia — CM 1

## Hipótese investigada

O planejador simplificado deve preservar a relação de referência na CM 1: **Front Runner** exige mais stamina que **End Closer** sob as mesmas estatísticas e recoveries assumidas. A versão anterior aplicava apenas velocidades-alvo teóricas e a conversão de stamina em HP; ela não calculava o comportamento transitório de *Position Keep*.

## Achados confirmados

O resolvedor público usado como referência calcula HP máximo com coeficientes próprios por estratégia e aplica consumo por velocidade. Além disso, *Pace Down* é um estado temporário exclusivo de não-*Front Runners*, não um multiplicador permanente. A documentação pública confirma que o mecanismo de *Position Keep* pode reduzir temporariamente consumo de HP de estratégias não-frontais e que a comparação de stamina deve considerar o resolvedor completo quando esse comportamento importa.

O planejador local não deve aplicar *Pace Down* à corrida completa. Contudo, ele também não deve afirmar que seu consumo simplificado reproduz a ordem final do simulador até que os estados temporários, o spurt condicionado por HP e a transição de velocidade sejam integrados.

## Reprodução da discrepância

Com os atributos da build-base selecionada (Speed 1038, Stamina 779, Power 1063, Guts 446 e Wit 426), o painel simplificado retornou `789` de stamina para **Front Runner** e `875` para **End Closer**. A reprodução com o resolvedor local de referência, usando HP real e *Position Keep* temporário para não-*Front Runners*, também deixou **Front Runner** abaixo de **End Closer** (`812` contra `825`) em uma corrida isolada.

Isso revelou a causa: o resolvedor local usado como referência desativa a lógica de *Position Keep* para `Nige`/Front Runner e, portanto, não representa os modos **Speed Up**, **Overtake** nem a **Lead Competition** que aumentam velocidade e, em disputas de frente, o consumo de HP do Front Runner. Já o painel local simplificou ainda mais, usando uma velocidade-alvo constante em cada fase e iniciando o spurt no último sexto, em vez de recalcular seu início conforme o HP.

Em consequência, o número de Front Runner atual é apenas um **cenário isolado sem pressão de frente**. Ele não é adequado para afirmar uma comparação geral contra End Closer. O ajuste correto exigirá representar explicitamente o contexto de frente — ao menos Front Runner isolado versus frente disputada — e não aplicar Rushed ou Pace Down como multiplicadores permanentes.

## Fontes consultadas

1. Código público `RaceSolver.ts` e `HpPolicy.ts` do projeto `alpha123/uma-tools`, clonado em `/home/ubuntu/research/uma-skill-tools/`.
2. [Uma Musume Wiki — Game:Mechanics](https://umamusu.wiki/Game:Mechanics).
3. [GameTora — Race Mechanics Handbook](https://gametora.com/umamusume/race-mechanics).
4. [UmaReference — Required Stamina Chart](https://www.umareference.com/guide/stats/required-stamina-chart).

## Calculador Global indicado pelo usuário — primeira inspeção

O calculador público de Federico Heichou aceita Speed, Stamina, Power, Guts, Wit, distância, superfície, condição, mood, aptidões de pista/distância/estilo, estratégia e grupos de recoveries e skills verdes. Para os valores iniciais exibidos no site — 1200/900/1200/600/1200, Turf Firm, Normal, A/A/A, 2400 m e Front Runner — ele mostra HP total `3084.00`, consumo `3097.28` e Stamina requerida `918`.

O próprio site aponta para um repositório público com a implementação HTML e para uma planilha de fórmulas. Repositório: [FedericoHeichou/umamusume-stamina-calculator-global](https://github.com/FedericoHeichou/umamusume-stamina-calculator-global). A próxima etapa é reproduzir os quatro estilos com os mesmos parâmetros e auditar o código da página para identificar os termos ausentes no painel local.

## Fórmula identificada no código externo

O calculador externo não trata *Pace Down* como permanente. Ele aplica uma aproximação apenas na parte constante da fase 1 e somente a estratégias não-Front Runner:

`consumo_fase_1 × (1 − 0,4 × 0,05 × uptime_de_modo_não_normal)`.

O código fixa `paceDownChangeAssumption = 0,05` e usa a redução de 40% como diferença entre o consumo normal e o multiplicador de 0,6 de *Pace Down*. Ele também modela separadamente aceleração de largada, transições de fase e início do spurt dependente do HP, em vez de reservar um último sexto integral em velocidade de spurt. Essas duas diferenças explicam por que o painel local não reproduz os valores externos.

O uptime de modo não normal é aproximado por `t_seção / (t_seção + 3)`, em que `t_seção = (distância / 24) / velocidade_média_da_fase_1`. Para Front Runner, o alvo de velocidade da fase 1 recebe o termo de *Speed Up* `0,04 × 0,2 × log10(Wit × 0,1)` ponderado pelo mesmo uptime; para as outras estratégias, recebe `−0,055 × 0,05` ponderado pelo uptime. O consumo durante aceleração é integrado pela diferença cúbica de velocidade, e não tratado como consumo constante. O início do spurt é limitado pelo HP restante, com a reserva de 60 m antes da linha de chegada.

Com os parâmetros iniciais do calculador externo (1200 Speed, 900 Stamina, 1200 Power, 600 Guts, 1200 Wit, 2400 m, Turf Firm, mood Normal, aptidões A/A/A e sem recovery), a comparação controlada retornou:

| Estratégia | HP total | Consumo | Stamina requerida |
|---|---:|---:|---:|
| Front Runner | 3084,00 | 3097,28 | 918 |
| Pace Chaser | 3040,80 | 3091,24 | 971 |
| Late Surger | 3120,00 | 3123,00 | 904 |
| End Closer | 3116,40 | 3135,42 | 924 |

O benchmark **não** confirma a premissa de que Front Runner sempre gasta mais. Sob a entrada-base, ele estima consumo menor para Front Runner do que para End Closer (`3097,28` contra `3135,42`) e também Stamina requerida menor (`918` contra `924`). Isso é coerente com um cenário médio sem disputa explícita de liderança; o próprio calculador não recebe a composição do pelotão. Logo, essa comparação não pode ser usada para afirmar um custo universal por estratégia.

Ele ainda é uma referência útil para o painel porque modela aceleração, *Pace Down* como aproximação temporária, *Speed Up* de Front Runner e início de spurt condicionado por HP. Porém, continua sendo uma aproximação de condições médias, não um simulador de composição inteira, *Lead Competition*, bloqueios ou eventos aleatórios.

Os coeficientes públicos auditados são os mesmos valores conhecidos de conversão de HP: Front Runner `0,95`, Pace Chaser `0,89`, Late Surger `1,00` e End Closer `0,995`. Para velocidade, a tabela é `[1, 0,98, 0,962]`, `[0,978, 0,991, 0,975]`, `[0,938, 0,998, 0,994]` e `[0,931, 1, 1]`, respectivamente. O calculador também usa aceleração por estratégia e aplica o mood a Speed e Power, aptidão de distância a Speed/aceleração e aptidão de pista a Power/aceleração.
