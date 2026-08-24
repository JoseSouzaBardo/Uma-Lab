# Gerador de Builds — M1 determinístico

O módulo M1 do **Uma Strategy Lab** cria um plano de build local e explicável para as Champions Meeting 1–18 do servidor Global. Ele combina pista, personagem, estratégia, função, orçamento de Skill Points, cenário de treino, skills, fatores de herança e support cards. A ferramenta não envia dados para serviços externos, não chama um modelo de IA e não exige hospedagem paga.

> O resultado é uma **estimativa de compatibilidade e risco**, não uma previsão de vitória. Posição, HP, bloqueio, ultrapassagem e taxa de ativação ainda dependem de uma simulação validada.

## O que o M1 faz

O motor importa 245 support cards, 18 pistas de Champions Meeting, quatro cenários Global, cinco fatores azuis, dez rosas, fatores verdes ligados às variantes e fatores brancos de corrida, cenário e skill. As skills usam IDs estáveis do catálogo Global já existente no aplicativo. A saída organiza metas de treino, fatores recomendados, skills priorizadas, fontes de hints e um deck de seis cartas sem repetir personagem e com no máximo uma Friend.

| Área | Comportamento do M1 | Limite declarado |
|---|---|---|
| Pistas CM 1–18 | Confirma superfície, distância, direção, clima, estação, solo, fases e presença de inclinações. | Não calcula posição ou pelotão. |
| Skills | Separa condições **confirmadas**, **situacionais** e **excluídas**. | Estados dinâmicos permanecem pendentes. |
| Herança | Recomenda prioridades azul, rosa e até duas únicas verdes herdadas quando o ID existe no catálogo Global. | Não inventa uma única herdada se `id + 800000` não estiver no catálogo. |
| Metas de treino | Exibe referências numéricas comunitárias somente quando uma linha é parseável e compara com caps do cenário. | Referência comunitária não equivale a mecânica comprovada. |
| Support deck | Pontua hints do plano e respeita seis cartas, personagem sem repetição e no máximo uma Friend. | Sem inventário informado, é um **deck de referência**, não uma lista de cartas possuídas. |

## Dados e proveniência

O arquivo gerado `client/src/data/build-generator-catalog.json` é uma cópia normalizada dos dados usados pela interface. Ele não depende de conexão com a internet durante o uso. O script de importação lê o repositório de pesquisa indicado abaixo, mas não executa nenhum de seus scripts: apenas lê JSON e o arquivo documentado de pistas.

| Fonte no repositório de pesquisa | Uso no M1 |
|---|---|
| `uma_data/dump.json` | Support cards e hints de skill. |
| `gametora_data/factors.json` | Fatores azul, rosa, verde e branco. |
| `analyst/app/data.json` | Cenários de treino e referências comunitárias por CM. |
| `UMA - pistas CM 1-18.txt` | Percurso, fases, retas, curvas, inclinações e condições da prova. |
| `cm_map.json` | Nome e URL de referência Game8 por CM. |

As fontes estão preservadas no repositório público do usuário.[1] A conformidade das pistas foi documentada no próprio repositório como validação contra o `umalator-global`; o M1 **não incorpora** código desse simulador. O projeto de referência declara GPL-3.0, portanto qualquer cópia ou integração de código deve ser avaliada separadamente antes de distribuição.[2]

## Como atualizar os dados

Primeiro, obtenha uma cópia local dos dois repositórios. No Windows, é mais simples usar o **GitHub Desktop** para clonar `Uma-Lab`, ou baixar seu ZIP e extrair em uma pasta permanente. Em seguida, abra um terminal na pasta `uma-strategy-lab`.

```bash
pnpm install

# Linux/macOS
UMA_LAB_SOURCE=/caminho/para/Uma-Lab pnpm import:generator-data

# Windows PowerShell
$env:UMA_LAB_SOURCE = "C:\caminho\para\Uma-Lab"
pnpm import:generator-data
```

O comando valida as contagens esperadas e falha caso a fonte esteja incompleta. A importação atual verifica 245 support cards, 18 CMs, quatro cenários, cinco fatores azuis, dez rosas, 37 brancos de corrida, 34 de cenário e 439 de skill. Depois, execute os testes e o aplicativo:

```bash
pnpm check
pnpm test
pnpm dev
```

## Como usar a interface

Abra a aplicação local e entre em **Análise de Build → Planejar**. O painel **M1 · planejador determinístico** permite escolher CM, variante, estratégia, função, orçamento de SP e cenário. Após clicar em **Gerar plano**, revise cada seção, sobretudo os avisos de aptidão, as condições situacionais e o modo do deck.

Quando o usuário ainda não informou as cartas que possui, o painel chama o resultado de **deck de referência**. Isso é deliberado: ele evita fingir que uma carta está disponível. A próxima evolução do M1 poderá incluir uma tela de inventário local e passar `availableSupportCardIds` ao motor.

## Como usar a linha de comando

A CLI usa o mesmo núcleo da interface e produz JSON reproduzível. O nome de personagem pode ser a variante completa, o nome de uma personagem sem ambiguidade ou o ID estável. Caso existam várias variantes, informe nome e variante ou use o ID.

```bash
# Plano exibido no terminal
pnpm generate:build -- --cm 1 --char "Gold Ship Red Strife" --style "Late Surger" --role Ace --sp 1400 --scenario live

# Plano salvo em arquivo
pnpm generate:build -- --cm 17 --char "Copano Rickey" --style "Front Runner" --role Ace --sp 1400 --scenario live --out copano-cm17.json

# Ajuda e opções aceitas
pnpm generate:build -- --help
```

As opções obrigatórias são `--cm`, `--char`, `--style`, `--role` e `--sp`. As opções `--scenario`, `--existing`, `--supports` e `--out` são opcionais. `--existing` e `--supports` recebem IDs separados por vírgulas, por exemplo `--supports 30002,30028,30078`.

## Testes de sanidade implementados

O arquivo `client/src/lib/build-generator.test.ts` cobre as regras estáticas propostas para CM 1, CM 9 e CM 17. Os testes verificam mão da pista, estação, clima, condição do solo, classe de distância, pista plana e diferenças entre fatos estáticos e gatilhos dinâmicos. Também verificam Gold Ship `Late Surger B → A`, Maruzensky `Medium B → A`, orçamento, limites do deck e o aviso de `Luck Runs My Way` para Copano Rickey na CM 17.

```bash
pnpm test
pnpm check
pnpm build
```

## O que ainda não é implementado

O M1 não é uma simulação de corrida. Por isso, uma skill marcada como situacional significa que a pista permite o gatilho, mas a corrida ainda precisaria determinar posição, HP, proximidade, bloqueio, ultrapassagem ou estado do pelotão. O M2 deverá validar uma integração externa ou um motor setorial próprio antes de gerar `winRate` ou `activationRate`. O M3, de ajuste automático de parâmetros, só deve existir depois de haver simulação calibrada, corridas observadas comparáveis e conjuntos de validação separados.

## Referências

[1]: https://github.com/JoseSouzaBardo/Uma-Lab "Uma-Lab — dados, guias e protótipo do usuário"
[2]: https://github.com/alpha123/uma-tools/blob/master/LICENSE "alpha123/uma-tools — GNU General Public License v3.0"
