# M3 — calibração auditável por corridas observadas

O M3 transforma o termo “autoaprimoramento” em um processo local, verificável e controlado. Ele não muda fórmulas por conta própria. Primeiro, a aplicação salva uma trajetória M2; depois, você liga uma corrida observada àquela trajetória; por fim, o painel calcula cobertura, separa treino e validação e, apenas quando os critérios são satisfeitos, apresenta um **rascunho de limiar de risco** para revisão humana.

> O M3 não produz taxa de vitória. A colocação registrada permanece descritiva; a métrica inicial compara somente o **HP final de referência** com a inferência anotada de falta de stamina.

## Fluxo de evidência

| Etapa | Ação no aplicativo | Registro local gerado |
|---|---|---|
| 1 | Em **Diagnosticar**, configure a trajetória M2 e selecione **Salvar referência M2**. | Snapshot com build, CM, estratégia, HP final, eventos, data e versão de modelo. |
| 2 | Faça a corrida real e anote somente eventos que você conseguiu observar. | Fatos: Rushed, Pace Down, bloqueio, ultrapassagem, recovery e Late Start; falta de stamina permanece inferência. |
| 3 | Selecione **Registrar corrida** e escolha a trajetória compatível no campo “Trajetória M2 a confrontar”. | Observação pareada por ID de previsão, build, CM e estratégia. |
| 4 | Confira o painel **M3 · calibração auditável**. | Cobertura, registros sem vínculo, links rejeitados e lacunas por CM/estratégia. |
| 5 | Quando liberado, registre parecer favorável ou rejeição. | Histórico local de decisão; o simulador continua inalterado. |

## Bloqueios de segurança

O M3 permanece bloqueado até que **todos** os critérios abaixo sejam verdadeiros. Isso impede que uma pequena coleção de corridas, ou resultados de uma única estratégia, seja interpretada como conhecimento geral.

| Critério | Regra implementada | Efeito se não cumprir |
|---|---:|---|
| Pares observação–previsão | Pelo menos 20. | Nenhuma proposta é calculada. |
| Cobertura por CM e estratégia | Pelo menos 3 pares em cada grupo existente. | O painel identifica o grupo insuficiente. |
| Validação temporal | Os 20% mais recentes, com mínimo de 4 pares, ficam fora do treino. | A proposta continua bloqueada sem conjunto de validação. |
| Compatibilidade | Build obrigatoriamente igual; CM e estratégia iguais quando registradas. | O vínculo é rejeitado e exibido no placar. |

Quando a cobertura atende aos critérios, o motor testa os limiares de **10%, 15%, 20% e 25% de HP final** sobre o conjunto mais antigo. Em seguida, mede o erro no conjunto mais recente. O menor erro de treino vira somente um rascunho; a interface mostra também o erro de validação para evitar confiar em uma escolha feita sobre os mesmos dados que a produziram.

## O que o M3 aprende hoje

O primeiro alvo é propositalmente estreito: verificar se um limiar de HP final pode sinalizar a inferência manual de falta de stamina de forma mais consistente. Isto é adequado para treinar o processo de coleta, pareamento e validação antes de tentar variáveis muito mais difíceis, como bloqueio ou ultrapassagem.

| Pode fazer | Não faz |
|---|---|
| Medir pares válidos, cobertura e incompatibilidades. | Estimar chance de vitória ou transformar colocação em probabilidade. |
| Propor um limiar de risco de HP como rascunho revisável. | Aplicar o limiar proposto ao M2 automaticamente. |
| Guardar pareceres locais de aprovação para revisão futura ou rejeição. | Inventar eventos, preencher corridas ausentes ou tratar inferência como fato. |
| Manter um histórico de snapshots do modelo M2. | Misturar snapshots de builds, CMs ou estratégias diferentes. |

## Onde os dados ficam

O M3 usa armazenamento local do aplicativo. Os snapshots M2, observações e pareceres ficam no dispositivo e não são enviados para serviços externos. Como o histórico de builds pode usar o modo desktop/SQLite, mantenha também o backup regular das informações locais antes de atualizar ou limpar o navegador. A persistência específica dos snapshots e pareceres no banco SQLite poderá ser uma evolução posterior da versão desktop.

## Interpretação correta de uma proposta

Um parecer favorável significa apenas: “o conjunto atual justifica testar este limiar em uma versão futura”. Ele não ativa o limiar, não muda a simulação e não prova causalidade. Antes de uma aplicação efetiva, será necessário comparar o rascunho com novas corridas que não participaram nem do treino nem da validação inicial.

> O M3 se torna útil por dizer **quando ainda não sabe o suficiente**. Um painel bloqueado é o comportamento esperado enquanto a coleta for pequena.
