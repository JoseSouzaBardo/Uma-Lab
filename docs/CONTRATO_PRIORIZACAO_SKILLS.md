# Contrato de priorização de skills

## Finalidade

O módulo de priorização ajuda a **analisar uma build em uma CM específica**. Ele classifica as skills da build por regras determinísticas do catálogo e deixa o usuário revisar essa classificação. Não prevê vitória, não altera o M2, não aplica parâmetros do M3 e não treina um modelo automaticamente.

## Contexto selecionado

Cada rascunho de prioridade é identificado por **build + CM**. A estratégia vem da build e a CM oferece distância, superfície, direção, estação, clima, condição do terreno, trechos, curvas, retas, inclinações, Position Keep e início do Spurt.

## Classificação automática

Para cada skill, o classificador verifica primeiro se condições estáticas da CM e da estratégia são compatíveis. Skills excluídas não entram como centrais. Entre as elegíveis, o motor atribui linhas de evidência para o tipo de efeito, a condição conhecida ou situacional, a distância e a margem de stamina da build.

| Papel sugerido | Peso sugerido | Regra inicial |
|---|---:|---|
| Central de estratégia ou recovery central | 3 | Até três skills automáticas de maior prioridade; recovery positiva recebe atenção elevada |
| Suporte | 2 | Skill elegível útil, mas fora das três principais |
| Contextual | 1 | Skill que depende mais do estado de corrida ou tem função secundária |
| Não elegível | 0 | Condição estática incompatível; não conta como prioridade |

Uma recovery que também for central recebe peso 3 uma única vez. O sistema nunca soma papéis para multiplicar artificialmente o mesmo sinal.

## Revisão manual e feedback local

O usuário pode incluir uma skill do catálogo, retirar uma indicação automática e mudar o peso de cada skill entre 1, 2 e 3. Essas escolhas são persistidas apenas neste navegador como **feedback local para análise futura**. Nesta etapa, elas não treinam um modelo, não alteram regras de forma automática e não são enviadas para nenhum serviço externo.

## Relação com o M3

Vitória, colocação e ativação de skills são sinais de avaliação histórica. O M3 continua exigindo pares compatíveis de snapshot M2 e observação real, cobertura mínima, variedade e validação temporal. A priorização pode ajudar a identificar quais condições e ativações merecem ser observadas, mas nunca reduz o limiar de 20 pares, não altera parâmetros e não declara uma build vencedora.
