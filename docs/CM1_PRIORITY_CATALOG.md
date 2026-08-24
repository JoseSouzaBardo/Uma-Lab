# Catálogo prioritário da CM 1

O recomendador inicial usa apenas skills cuja regra já está estruturada para a CM 1, possuem **ID Global estável** e têm **custo oficial de Skill Points** registrado. Essa é uma camada de elegibilidade, não uma lista de “melhores skills”.

| Entrada | Tratamento inicial | Motivo |
|---|---|---|
| Recovery, Acceleration, Speed Boost, Passive, Lane Effect e Vision | Candidata à pontuação | Possuem efeitos e regras que podem ser lidos pelo motor atual. |
| Unique | Excluída da compra | Pertence à variante; não deve ser recomendada como aquisição. |
| Debuff | Excluída da primeira versão | Requer composição adversária, que ainda não é um campo de cenário. |
| Sem custo Global | Excluída da seleção por orçamento | O sistema não inventa SP. |

> A pontuação favorece recuperação quando a Stamina é limitada, aceleração próxima ao Spurt, cobertura de velocidade e passivas compatíveis. Gatilhos dinâmicos continuam sinalizados como condicionais; não são transformados em garantia de ativação.

O método de montagem dentro do orçamento será guloso e explicável: ordena por pontuação documentada, inclui uma candidata quando ainda há SP e espaço, e registra por que cada item ficou de fora. Ele não é uma otimização global nem uma simulação de vitória.
