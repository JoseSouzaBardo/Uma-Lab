# M2 — trajetória setorial e protocolo de calibração

O M2 introduz uma **trajetória determinística de referência**. Ela divide a prova em trechos, calcula uma velocidade-alvo e um consumo de HP aproximado, e registra eventos aplicados em janelas explícitas. O objetivo é tornar hipóteses visíveis e comparáveis; não é estimar chance de vitória.

> Uma trajetória determinística só é útil se puder ser confrontada com corridas observadas. Até existir calibração suficiente, o resultado deve ser interpretado como **compatibilidade e risco estimados**.

## Estados do modelo

| Estado | Tratamento no M2 | Interpretação correta |
|---|---|---|
| HP, velocidade-alvo e fase | Calculados por trecho a partir da build, distância e estratégia. | Referência numérica reproduzível. |
| Rushed e Pace Down | Aplicados apenas entre os metros definidos pelo usuário. | Hipótese localizada; não afeta a prova inteira. |
| Recovery | Aplicada uma vez no marco configurado, limitada ao HP máximo. | Efeito de teste, não confirmação de ativação. |
| Bloqueio e ultrapassagem | Registrados no trecho, sem bônus ou penalidade numérica. | Contexto observado que precisa de dados para calibração. |
| Inclinações | Listadas quando a pista as informa, sem converter gradiente em aceleração local. | Dado de rota; impacto numérico pendente. |

## Relações de referência

O motor usa uma velocidade-base dependente da distância e uma base de HP dependente de stamina, estratégia e distância. As transições mecânicas de fase seguem 0, `1/6`, `2/3` e `5/6` do percurso; a apresentação converte esses pontos em Abertura, Meio, Final e Spurt. Essas relações foram verificadas contra a leitura documental do simulador público `uma-tools`, mas o Uma Strategy Lab possui uma implementação nova e limitada, sem importar seu código GPL-3.0.[1] [2]

## Como calibrar com uma corrida real

Registre uma corrida por build com os mesmos dados iniciais e preencha os eventos observados. Para que duas corridas possam ser comparadas, registre personagem/variante, estratégia, atributos, skills, pista, colocação, Rushed, Pace Down, bloqueios, ultrapassagens e recuperações que você conseguiu confirmar. Evite preencher um evento apenas por inferência de resultado.

| Ordem | Ação no aplicativo | Evidência que se busca |
|---|---|---|
| 1 | Abra **Diagnosticar** e selecione a build. | Cenário e atributos iguais aos da corrida observada. |
| 2 | No painel M2, injete somente eventos vistos ou documentados. | Intervalo aproximado em metros, não duração inventada. |
| 3 | Recalcule e anote os trechos com HP baixo, Rushed ou Pace Down. | Sinal de risco, não prova de causalidade. |
| 4 | Abra **Dados Coletados** e registre a corrida. | Colocação e observações de evento por participante. |
| 5 | Compare repetições da mesma build. | Padrões consistentes antes de alterar qualquer constante. |

Uma calibração posterior deve usar conjuntos separados: um conjunto para ajustar hipóteses e outro, nunca usado no ajuste, para medir se o sinal se mantém. Caso os dados ainda sejam poucos, o sistema deve aumentar a incerteza apresentada em vez de produzir uma taxa de vitória.

## O que o M2 ainda não afirma

O M2 não modela posições numéricas do pelotão, adversárias, RNG, sorteio de raia, taxas reais de ativação, janelas completas de skills, algoritmo de ultrapassagem ou força de bloqueio. A própria interface declara esses limites. A fase seguinte só deve adicionar efeitos numéricos a bloqueio, ultrapassagem e inclinação quando as corridas observadas permitirem validar o efeito de forma repetível.

## Referências

[1]: https://github.com/alpha123/uma-tools "alpha123/uma-tools — simulador público de referência"
[2]: https://github.com/alpha123/uma-tools/blob/master/LICENSE "alpha123/uma-tools — licença GNU GPL v3.0"
