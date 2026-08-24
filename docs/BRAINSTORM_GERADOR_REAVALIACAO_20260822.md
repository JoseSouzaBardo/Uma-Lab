# Reavaliação do produto — gerador de builds

## Constatação principal

O projeto já possui uma base M1 mais próxima do objetivo do que a interface atual sugere. O catálogo local reúne 18 CMs, contexto de pista, metas de treino comunitárias, tiers de personagens, recomendações qualitativas, skills, heranças e support cards. A prioridade não é criar um motor novo; é consolidar o **fluxo de entrada e a saída do gerador**.

## O papel correto de cada fonte

| Fonte | O que pode fornecer | O que não deve fornecer sozinha |
|---|---|---|
| Mecânicas confirmadas | Restrições de pista, fases, condições de skill, risco de HP e aptidões. | Uma classificação comunitária de personagem ou previsão de vitória. |
| Meta comunitário por CM | Tiers, personagens recorrentes, metas de treino e observações estratégicas já usadas por jogadores. | Prova causal, calibração automática ou garantia de desempenho pessoal. |
| Dados locais do usuário | Personagens, support cards, heranças, orçamento e corridas observadas. | Uma verdade universal quando a amostra é pequena. |
| Analisador M2–M4 | Verificação de coerência, trajetória de referência e evidência auditável. | A primeira experiência obrigatória do gerador. |

## Proposta de produto

> **O Uma Strategy Lab gera planos de build recomendados para uma CM do servidor Global a partir de regras de mecânica, referências comunitárias atribuídas e restrições informadas pelo jogador.**

O resultado deverá chamar-se **plano recomendado** ou **build de referência personalizada**, nunca “melhor build” nem “chance de vitória”. A tela precisa mostrar de onde cada decisão veio: mecânica confirmada, referência comunitária ou escolha do usuário.

## Distinção indispensável

| Saída | Quando é honesta | Exemplo de limite |
|---|---|---|
| Build de referência | O usuário ainda não informou inventário. | Deck e heranças são referências possíveis, não itens possuídos. |
| Build personalizada | Personagens, support cards e limites foram informados. | Continua sendo recomendação de compatibilidade e risco. |
| Análise pós-build | O usuário quer entender uma build escolhida ou gerada. | Não precisa anteceder toda geração. |
| Evidência e calibração | Já existem observações/snapshots compatíveis suficientes. | Não deve bloquear a geração inicial. |

## Lacunas de produto antes de implementar

1. **Modo de geração:** a primeira versão gera uma única candidata individual ou já organiza três corredoras de uma equipe de CM.
2. **Restrições pessoais:** quais dados o usuário aceita informar agora — roster de personagens, inventário de support cards, heranças, limite de SP, cenário ou todos eles.
3. **Forma da saída:** quantidade de candidatas, explicação de origem, e se o meta aparece como referência prioritária ou comparação lateral.
4. **Nível de autonomia:** o usuário escolhe personagem/estratégia primeiro, ou o gerador sugere essas escolhas a partir da CM e do roster.
