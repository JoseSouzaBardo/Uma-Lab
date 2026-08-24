# Extração para o guia de mecânicas

> Fonte primária: *Race Mechanics Handbook* fornecido pelo usuário em `/home/ubuntu/upload/gametora.com_umamusume_race-mechanics_1787331088518.md`.

## Atributos e aptidões confirmados

| Tema | Síntese confirmada pelo documento | Uso no guia |
|---|---|---|
| Limite de atributos | Os cinco atributos-base vão de 1 a 2000; valores acima de 1200 entram reduzidos pela metade nos cálculos. Humor modifica o valor mecânico em 2% por nível; Career adiciona 400 temporariamente. | Explicar que número exibido e valor mecânico não são sempre idênticos. |
| Speed | Afeta Target Speed no Late-Race e Last Spurt, não nas fases anteriores; terreno e condição podem reduzir o valor usado. | Relacionar Speed ao ganho de velocidade-alvo no fim da prova. |
| Stamina | Define HP máximo; interage com último spurt, Stamina Contest e recovery. Late Surger/End Closer convertem melhor que Pace Chaser. | Explicar margem de HP e por que recovery depende do HP máximo. |
| Power | Afeta aceleração, troca de faixa, subida e várias mecânicas de posicionamento. | Distinguir aceleração de aumento imediato de velocidade. |
| Guts | Afeta bônus de spurt, Spot Struggle, Dueling, Repositioning e Securing the Lead; reduz consumo no Late/Spurt. | Explicar sustentação de fim de corrida. |
| Wit | Afeta ativação de skills, chance de Rushed, descidas e modos de Position Keep; não afeta Late Start. Aptidão de estratégia afeta a eficácia de Wit. | Corrigir a associação incorreta entre Wit e Late Start. |
| Aptidão de estratégia | S aumenta a eficácia de Wit em 10%, A mantém, e inferiores reduzem; aumento via spark/skills não muda chance de ativação. | Explicar por que a aptidão efetiva editável da build importa. |

## Percurso, velocidade e HP

| Tema | Síntese confirmada | Uso no guia |
|---|---|---|
| Fases | Early = 1/6; Mid = 2º–4º sexto; Late = 5º sexto; Last Spurt = 6º sexto. Em 2400 m: 0–400, 400–1600, 1600–2000 e 2000–2400 m. | Usar a mesma régua visual do app. |
| Target e Current Speed | Target é a velocidade para a qual corre; Current é a velocidade atual. Aumentar Target não cria aumento instantâneo de Current. | Explicar por que timing e aceleração importam. |
| Aceleração | Depende de Power, estratégia, fase, subida e aptidões de terreno/distância. É mais valiosa quando há grande diferença de Target Speed, como no spurt. | Ligar aceleração ao momento, não apenas ao nome da skill. |
| Recovery | Recupera porcentagem do HP máximo; duração/resultado dependem de HP máximo e comprimento da corrida. | Manter registro por ID de skill e não como caixa genérica. |
| Terreno | Turf/Dirt e condição podem alterar Speed, Power e consumo de HP; Soft/Heavy elevam o consumo. | Apresentar a pista como contexto obrigatório. |

## Estados e condições de corrida

| Estado | Síntese confirmada | Limite para o laboratório |
|---|---|---|
| Late Start | É atraso de largada; Wit não o altera. Atrasos de 0,066 s ou mais contam como Late Start. | Pode ser observado; não inferir causa sem evidência. |
| Position Keep | Vai do início até aproximadamente metade do Mid-Race e usa modos por estratégia. | O app o mostra como marco de percurso; não tenta resolver todos os modos automaticamente. |
| Pace Down | Para estratégias não Front Runner, reduz Target Speed quando a corredora está próxima demais do pacemaker; skill de velocidade encerra o modo. | Permanece como evento localizado, não multiplicador da corrida inteira. |
| Rushed | Pode ocorrer uma vez entre meio do Early e meio do Mid; aumenta consumo de stamina e altera o comportamento de Position Keep. | Permanece como observação de evento, não certeza causal. |
| Last Spurt | Pode atrasar, reduzir ou não ocorrer plenamente por HP insuficiente. | O app descreve risco de HP; não prevê vitória. |
| Spot Struggle / Dueling | Dependem de proximidade, estratégia, fase/trecho e HP; recebem influência de Guts. | Entram como fatos ou contexto quando observados, não como garantias. |
| Repositioning / Securing the Lead | Podem consumir HP para elevar Target Speed em situações posicionais; dependem de estratégia, condições e checks. | Explicar como estados de contexto; não transformar em regra automática sem cobertura. |

## Decisão para a interface

O guia principal será organizado em **Atributos**, **Aptidões**, **Pista e fases**, **Velocidade e aceleração**, **HP e recovery**, e **Estados de corrida**. O guia de status do laboratório será deslocado para uma seção final denominada **Como o laboratório usa estes fatos**, deixando explícito que etiquetas internas não são mecânicas do jogo.
