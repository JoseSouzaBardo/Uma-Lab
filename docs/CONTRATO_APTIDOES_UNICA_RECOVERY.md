# Contrato de cadastro e evidência — aptidões, única e recovery

## Aptidões

Uma build local registra três aptidões contextualizadas para a corrida em análise: **superfície**, **distância** e **estratégia**. O catálogo Global oferece o valor-base da variante, mas o usuário pode substituí-lo por qualquer graduação entre `S` e `G`, pois herança, fatores e treinamento podem elevar a aptidão efetiva da build. O valor salvo é o valor informado para aquela build, não uma dedução posterior do catálogo.

## Skill única

Ao selecionar uma variante, o formulário insere seus `uniqueSkillIds` estáveis automaticamente. A skill única aparece com selo próprio, permanece vinculada à variante e não consome SP porque o catálogo Global a registra sem custo. Ao trocar a variante, a única automática anterior é removida e a nova é inserida; as skills escolhidas manualmente são preservadas. A build salva mantém todos os IDs em uma única lista para a análise, mas o formulário guarda a origem automática apenas enquanto é editado.

## Recovery em uma corrida observada

Recovery não é um estado genérico de corrida como Rushed ou Pace Down. A mecânica documentada descreve a recuperação como um efeito de **uma skill específica**, que restaura HP em porcentagem do HP máximo e varia com o comprimento da corrida. Portanto, uma observação nova registra o **ID da skill de recovery que ativou**. O formulário apresenta apenas skills da própria build cujo efeito estruturado contém recuperação positiva de HP; uma lista de skills ativadas continua disponível para outros efeitos.

Registros antigos que marcaram apenas `recovery` sem ID serão preservados como dado legado não atribuível. Eles não serão apagados, mas não serão mostrados como confirmação de ativação de uma skill específica.

> A falta de stamina continua sendo uma inferência separada. Uma recovery observada não prova, por si só, que a corredora teria ficado sem stamina.

## Referência de mecânica

O documento de mecânicas fornecido pelo usuário informa que recovery skills restauram HP em porcentagem do HP máximo e que a recuperação final é afetada pela distância; também separa HP, gasto de stamina e condições dinâmicas de corrida. O aplicativo utiliza isso somente para qualificar o registro de evidência, não para declarar uma taxa de ativação.[1]

[1]: /home/ubuntu/upload/gametora.com_umamusume_race-mechanics_1787331088518.md "Race Mechanics Handbook — documento fornecido pelo usuário"
