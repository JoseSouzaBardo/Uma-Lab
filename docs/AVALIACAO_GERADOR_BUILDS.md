# Avaliação do gerador de builds para Champions Meeting

**Data da avaliação:** 21 de agosto de 2026  
**Escopo:** servidor Global, CM 1–18, dados locais e resultados explicáveis em português brasileiro.

## Parecer executivo

O prompt é uma proposta **boa e tecnicamente orientada**. Ele tem uma característica importante: não pede apenas uma resposta genérica de “IA”, mas define dados de entrada, regras de domínio, marcos, testes concretos e uma preocupação legítima com reprodutibilidade. Isso combina com o objetivo do Uma Strategy Lab: construir uma ferramenta que o usuário possa executar, revisar e aprimorar localmente.

O ajuste essencial é de terminologia e ordem. A primeira entrega deve ser um **gerador determinístico e explicável de planos de build**, e não uma ferramenta que afirme encontrar a “melhor build”. A etapa de “autoaprimoramento” não é um modelo de linguagem ou uma inteligência autônoma; ela é uma busca controlada que altera pesos previamente definidos e só é confiável depois de existir simulação calibrada e um conjunto de validação independente.

> Enquanto a simulação dinâmica não estiver validada, o resultado correto é **“compatibilidade e risco estimados”**, acompanhado das premissas utilizadas; não “chance real de vitória” nem “melhor build”.

O repositório de pesquisa já reúne os arquivos brutos, o agregador `analyst/app/data.json` e um protótipo anterior. A aplicação React atual, por outro lado, já possui peças fundamentais de um novo núcleo mais robusto: catálogo Global por IDs estáveis, condições AND/OR formais, custos de SP, validação de formulário, uma recomendação explicável para CM 1 e testes automatizados. As duas bases são complementares, mas o protótipo não deve ser copiado mecanicamente para o novo aplicativo. Seus dados e comportamentos precisam ser migrados por esquemas, importadores e testes auditáveis.[1]

## O que o prompt propõe versus o que já existe

| Marco do prompt | Estado no Uma Strategy Lab | Leitura prática |
|---|---|---|
| **M1 — gerador determinístico** | **Parcialmente pronto.** Há catálogo Global com 99 variantes, 64 personagens-base e 591 skills por ID; parser de condições; regras de CM 1; orçamento de SP; formulário com limites e recomendador explicável inicial. | Já é possível evoluir para um planejador de CM 1 sem usar IA externa. Para CM 1–18, faltam estruturas de dados e regras gerais de elegibilidade. |
| **M2 — medir por simulação** | **Não pronto.** Há cálculo de stamina de planejamento e representação de referências por setor, mas não há motor completo de posição, HP, eventos, ativação, pelotão e aleatoriedade. | Um adaptador para um simulador externo pode ser criado antes de uma simulação própria, desde que resultados e limitações sejam preservados. |
| **M3 — ajuste automático de parâmetros** | **Prematuro.** O aplicativo dispõe de poucas corridas observadas e ainda não tem uma métrica de desempenho calibrada. | Fazer otimização agora tenderia a aperfeiçoar uma pontuação arbitrária, e não a qualidade real da recomendação. |
| **M4 — relatório antes/depois** | **Viável como formato**, porém depende de M2 e M3 para ter dados honestos. | O relatório deve apresentar versão de dados, parâmetros, sementes, hipóteses, métricas e incertezas; nunca apenas um “melhor resultado”. |

## Componentes que podem ser reaproveitados imediatamente

O núcleo atual já resolveu escolhas que serão importantes para o gerador. O identificador da skill é a chave primária, evitando ambiguidades por nomes repetidos; por exemplo, skills homônimas não são confundidas no armazenamento. O orçamento de SP e o limite de skills também já são tratados como restrições, e não como detalhes de interface. Isso permite que um gerador proponha uma lista e o aplicativo explique exatamente por que uma skill foi incluída, excluída ou ficou pendente.

O parser formal de condições AND/OR e a semântica de skills verdes são particularmente úteis. Ele oferece uma base para distinguir condições **confirmadas pela pista**, condições **possíveis mas dependentes do estado de corrida** e condições **incompatíveis**. Essa separação deve ser mantida em todo o gerador para que uma aceleração de late-race, por exemplo, não receba a mesma certeza de uma passiva válida para a pista.

| Recurso existente | Uso no gerador futuro |
|---|---|
| Catálogo Global por IDs e custos oficiais | Selecionar skills e explicar gasto de SP sem depender de nomes de exibição. |
| Parser AND/OR de condições | Validar regras estáticas da pista e sinalizar pré-requisitos dinâmicos. |
| Regras estruturadas e recomendador da CM 1 | Servir de padrão para a generalização de CM 2–18. |
| Formulário de build, orçamento e limites | Expor o plano gerado e permitir revisão manual segura. |
| Aplicação de sugestão à cópia planejável | Converter uma recomendação selecionada em um rascunho editável sem alterar a build de referência. |
| Registro local de corridas | Tornar-se a futura fonte de observações, calibração e comparação; atualmente ainda é pequeno demais para inferência estatística. |

## O que falta para o M1: gerador determinístico

O M1 é a próxima meta adequada. Ele não precisa “aprender sozinho”: deve aplicar regras claras para transformar uma entrada — CM, personagem, estratégia, função, SP e recursos disponíveis — em um plano revisável. Para isso, faltam cinco blocos de dados e regras.

| Lacuna | O que precisa ser estruturado | Critério de qualidade |
|---|---|---|
| **Herança** | Azul, rosa, verde e branco por ID; estrelas; notas de aptidão do pai; skill única herdada; restrição de duas únicas herdáveis. | O sistema deve mostrar o cálculo e a origem de cada aumento, sem presumir que a relação `id + 800000` vale para todos os casos antes de validá-la no catálogo. |
| **Support cards** | As 245 cartas, níveis, efeitos de treino, hints, eventos, personagem da carta, disponibilidade e restrições do deck. | O gerador só pode propor uma carta e um deck quando a carta está disponível ao usuário e atende às restrições de seis cartas, sem repetição e no máximo uma Friend. |
| **Cenários de treino e caps** | Caps, bônus e regras dos cenários Global que convertem plano de atributos em metas possíveis. | O resultado deve separar “meta recomendada” de “meta inviável no cenário selecionado”. |
| **CM 2–18** | Pista, estação, clima, condição de solo, direção, superfície, fases, curvas, retas, inclinações, distância, metas e versão da fonte. | Cada skill recebe o mesmo diagnóstico estruturado hoje disponível na CM 1, não somente uma etiqueta textual. |
| **Efeitos de skills** | Tipo, magnitude, duração, fase, alvo, custo, recuperação, debuff, pré-condições e fonte de obtenção. | Os 591 registros precisam ter cobertura mensurável: regra normalizada, regra pendente ou exclusão documentada. |

O `data.json` do protótipo é uma boa **fonte agregada de importação**, conforme o próprio prompt propõe. A aplicação não deve reprocessar os `.txt` em tempo de execução. A abordagem segura é criar um importador versionado que leia o agregado uma vez, valide contagens, IDs, campos obrigatórios e referências cruzadas, e gere os JSON/TypeScript normalizados que o site utilizará. Os arquivos brutos continuam preservados como evidência e fonte de correção.[1]

Também falta representar a **realidade do inventário do usuário**. Uma recomendação de herança ou support deck não é executável se ela considerar recursos que a pessoa não tem. Assim, a entrada do gerador deve incluir, inicialmente de forma opcional, cartas possuídas, nível de cada carta, personagens disponíveis e legados disponíveis. Caso esses dados não sejam informados, a saída deve ser chamada de “plano de referência” e destacar quais componentes exigem substituição manual.

## O que falta para o M2: simulação e medição

Uma calculadora de stamina é útil para eliminar builds evidentemente inseguras, mas não substitui uma corrida. Para chegar ao M2, o sistema precisará de um estado de corrida avançando por setores, com HP real, posição relativa, ordem, aceleração, velocidade, recuperação, habilidades ativas, bloqueio, Rushed, Pace Down, troca de faixa e aleatoriedade controlada. Cada alteração deve ser atribuível a uma regra de mecânica e a uma fonte de dado.

O `umalator-global` pode ser usado como **referência externa** e como ferramenta de verificação. Contudo, o repositório `alpha123/uma-tools` declara GPL-3.0; incorporar ou adaptar trechos de seu código pode impor obrigações de licenciamento ao trabalho distribuído. A menor exposição é manter uma integração por entrada/saída: o Uma Strategy Lab exporta um cenário reprodutível, o simulador é executado separadamente, e o resultado é importado ou referenciado. Antes de empacotar ou distribuir uma integração mais profunda, a conformidade da licença deve ser revisada de modo específico; esta avaliação não constitui aconselhamento jurídico.[2]

No começo, **20 simulações com seed fixa** servem como teste de fumaça da integração, mas não suportam ranking fino entre builds próximas. Para comparar variantes, as corridas devem usar sementes idênticas e o mesmo pelotão; a análise precisa comparar resultados pareados e registrar a variância. Além disso, o simulador deve ser confrontado com casos de referência e observações reais. Caso haja divergência, o relatório deve exibir a divergência, e não escondê-la com uma nota única.

## Por que o M3 não deve ser implementado agora

O maior risco do prompt está na expressão “auto-melhoria”. Uma busca por hill climbing, algoritmos genéticos ou pesos ajustáveis pode ser útil, mas ela **não descobre automaticamente a mecânica real**. Ela encontra parâmetros que pontuam bem segundo a métrica fornecida. Se a métrica vier de uma simulação incompleta, de poucas corridas observadas ou de tier lists, o gerador pode aprender a reproduzir vieses: maximizar alinhamento com o meta comunitário, favorecer passivas por uma ponderação arbitrária ou aceitar segurança de stamina falsa.

Para ser controlado, o M3 precisa de uma política de experimentos. Os fatos de mecânica e elegibilidade não podem ser alterados pelo otimizador; somente pesos explicitamente marcados como heurísticos podem mudar. Cada experimento precisa registrar versão do catálogo, versão da pista, parâmetros de entrada, população/candidatas, seed, métrica, conjunto de treino e conjunto de validação. Um conjunto de validação deve permanecer congelado para impedir que o sistema celebre uma melhoria que só decorre de decorar os exemplos usados para ajustar os pesos.

| Métrica sugerida | Pode entrar agora? | Condição para ser confiável |
|---|---|---|
| `spEfficiency` | **Sim, como métrica descritiva.** | Explicar valor coberto por SP e não tratá-la como força competitiva. |
| `staminaSafety` | **Sim, como triagem.** | Declarar a fórmula, recuperações consideradas e margem; calibrar depois contra corridas. |
| `metaAlignment` | **Sim, com peso baixo.** | Mostrar a fonte e a data; meta comunitário é referência, não ground truth de mecânica. |
| `activationRate` | **Ainda não como fato.** | Diferenciar taxa simulada, observada e desconhecida; requer motor validado ou coleta adequada. |
| `winRate` | **Não.** | Requer simulador calibrado, repetições comparáveis, pelotão definido e intervalo de incerteza. |

## Testes de sanidade: excelente exigência, com uma ampliação

Os casos CM 1, CM 9 e CM 17 do prompt são muito bons porque cobrem superfície, distância, clima, estação, pista plana e estratégia. Eles devem virar testes automatizados que verificam não somente um rótulo final, mas também o motivo. Por exemplo, uma regra de condição estática deve retornar `confirmada`; uma condição que depende de estado de corrida deve retornar `pendente`; e uma skill incompatível deve retornar `impossível`.

| Caso | Resultado esperado no motor |
|---|---|
| CM 1 — Tokyo 2400 | `Left-Handed`, `Spring Runner`, `Firm Conditions` e `Medium Straightaways` confirmadas; `Right-Handed`, `Snowy Days` e `Updrafters` impossíveis. |
| CM 9 — Chukyo 1200 no inverno/neve | `Snowy Days`, `Winter Runner`, `Wet Conditions` e `Sprint Straightaways` confirmadas; `Firm Conditions` impossível. |
| CM 17 — Oi Dirt 2000 plana | A regra de `Oi Racecourse` deve ser confirmada; skills dependentes de inclinação devem ser impossíveis; condições de corrida que ainda exigem estado devem permanecer pendentes, nunca promovidas automaticamente. |
| Copano Rickey na CM 17 | O plano deve priorizar pelo menos cinco passivas verdes se elas forem elegíveis e acessíveis, exibindo o motivo da sinergia com `Luck Runs My Way`. |
| Gold Ship [Red Strife] e Maruzensky na CM 1 | Os testes devem demonstrar a mudança de aptidão rosa B→A com a estrela informada, incluindo pai, grau, regra aplicada e a limitação de não sair da nota G. |

Além desses exemplos, devem existir testes de dados: total de registros esperado, unicidade de IDs, custo de SP válido, referências de skill e personagem resolvidas, deck sem personagem repetido e ausência de sugestões que excedam orçamento ou quantidade máxima. Um teste deve falhar deliberadamente quando uma condição for desconhecida, para impedir que campos incompletos apareçam como “válidos”.

## Roteiro incremental recomendado

### Fase P0 — fundação de dados e gerador explicável

Começar pela importação normalizada de herança, support cards, cenários e metas por CM, preservando a proveniência de cada campo. Em seguida, criar um modelo comum para CM 1–18 e transferir as regras de elegibilidade da CM 1 para uma camada genérica. O primeiro gerador aceitará CM, personagem, estratégia, função, SP, cenário e inventário opcional; devolverá metas de atributos, plano de herança, prioridades de skills, gasto de SP, riscos, sugestões de deck e uma explicação em português.

Nesse ponto, o produto estará pronto para gerar **planos revisáveis**, não conclusões competitivas. A primeira bateria de testes deve implementar CM 1, CM 9 e CM 17 exatamente como proposto. Não faz sentido criar “cinco gerações” em `experiments/` nesta fase, pois isso seria fabricar resultados antes de haver uma métrica simulada válida.

### Fase P1 — dados de corrida e validação externa

Expandir o registro de observações para armazenar participantes, versões de build, condições, resultados, margem, eventos e ativações com o rótulo `observado`, `inferido` ou `desconhecido`. Em paralelo, criar um adaptador externo para o `umalator-global`: entrada reproduzível, seed, pelotão, parâmetros e resultado importável. A prioridade é comparar cenários de referência e documentar qualquer divergência.

### Fase P2 — simulador próprio mínimo por setores

Somente depois da validação externa, implementar um simulador próprio de escopo limitado. Ele deve começar com HP, setores, fases, ativações estáticas e recuperação, e só avançar para pelotão, bloqueio e posição quando houver testes de referência. Este é o marco que torna métricas como taxa de ativação simulada e margem de stamina mais úteis, mas ainda não autoriza declarar taxa real de vitória.

### Fase P3 — experimentos controlados

Criar `params.json` como arquivo de parâmetros heurísticos documentados, e `experiments/` como histórico reproduzível. A busca deve trabalhar com variações pequenas, seeds fixas e comparação contra um conjunto congelado. Uma candidata só pode virar parâmetro padrão se superar a anterior em validação, não apenas no conjunto usado para ajustá-la. O relatório M4 deve mostrar antes/depois, mas também o que **não** pode ser concluído.

## Estrutura de código sugerida

Para evitar que o aplicativo e a linha de comando passem a ter duas regras diferentes, o motor deve ser TypeScript puro e compartilhável. A interface React apenas apresenta os resultados; a CLI usa exatamente o mesmo núcleo para gerar relatórios e experimentos locais.

```text
shared/generator-core/
  schema.ts                 modelos e validação de dados
  cm-context.ts             contexto normalizado de cada CM
  eligibility.ts            condições e elegibilidade
  inheritance.ts            azul, rosa, verde e únicas herdadas
  planner.ts                plano determinístico e explicação
  support-deck.ts           composição de deck e restrições
  report.ts                 saída estruturada em PT-BR

scripts/
  import-build-generator-data.mjs
  validate-build-generator-data.mjs
  run-generator.mjs         --cm --char --style --role --sp

client/src/lib/
  generator-adapter.ts      ponte visual para o núcleo compartilhado

experiments/
  README.md                 protocolo, versão, sementes e limitações
  <somente após P3>/        artefatos JSON gerados de verdade
```

O arquivo `BUILD-GENERATOR-README.md` deve explicar como instalar Node.js LTS e pnpm, atualizar os dados, rodar testes, executar a CLI, exportar backups e interpretar cada nível de confiança. Como o objetivo é autonomia, ele é tão importante quanto o motor.

## Decisão recomendada

O projeto deve seguir com o **M1 reformulado**. É uma extensão coerente do que já construímos, pode ser totalmente local e não depende de uma IA externa nem de hospedagem paga. As próximas três implementações devem ser: importar herança e support cards; normalizar CM 2–18 e metas; e criar os testes CM 1/9/17. Depois disso, será possível apresentar builds recomendadas como planos explicáveis e editar suas premissas na interface.

M2 deve vir antes de M3. A ferramenta pode, no futuro, ajustar pesos e comparar candidatos, mas esse recurso deve ficar bloqueado até existir medição reproduzível e validação separada. Essa ordem não torna o projeto mais lento; ela evita que ele adquira uma aparência de precisão sem evidência suficiente.

## Referências

[1]: https://github.com/JoseSouzaBardo/Uma-Lab "Uma-Lab — repositório de dados, protótipo e fontes"
[2]: https://github.com/alpha123/uma-tools/blob/master/LICENSE "alpha123/uma-tools — licença GNU GPL v3.0"
