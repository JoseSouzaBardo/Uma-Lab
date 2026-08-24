# Roteiro crítico para um Uma Strategy Lab confiável e autônomo

## Estado atual

O projeto possui uma interface local funcional para a **CM 1 — Taurus Cup**, seis builds iniciais, quatro corridas observadas, um catálogo parcial de **53 skills usadas nas builds** e uma comparação de até três builds. O motor atual lê condições estáticas de pista, estratégia, distância, setor, efeito e duração; ele expõe estados dinâmicos pendentes, em vez de fingir que já consegue simulá-los.

> O projeto está na fase de **analisador explicável**, não de simulador validado ou recomendador de vitória.

| Capacidade | Situação | Limite atual |
|---|---|---|
| Cenário CM 1 | Pronto | Course ID `10606` e Track ID `10006` registrados. |
| Personagens e skins | Dados-fonte disponíveis | Ainda não foram importados integralmente para o aplicativo. |
| Skills Global | Dados-fonte disponíveis | Só 53 skills presentes nas builds foram estruturadas na interface. |
| Skills únicas | Overrides das cinco skins usadas | O restante do catálogo de personagens ainda precisa ser importado. |
| Skills verdes | Primeira regra implementada | O motor reconhece `Passive` e trata condição estática satisfeita como efeito desde a abertura até a chegada. |
| Registro de corridas | Interface local disponível | Ainda não alimenta estatísticas, calibração ou inferência automática. |
| Comparação | Duas ou três builds | Mostra atributos, cobertura, repertório e histórico; não calcula probabilidade de vitória. |

## Limitações que não podem ser ignoradas

### 1. O motor não simula o estado de corrida

Posição, HP, bloqueio, ultrapassagem, Rushed, Spot Struggle, mudança de faixa, aleatoriedade de trechos e o comportamento do pelotão ainda não são simulados. Portanto, uma skill marcada como `situacional` significa somente que a pista permite o gatilho; **não significa que ela ativará**.

### 2. Alternativas lógicas precisam de um avaliador formal

O catálogo usa `--- OU ---` para grupos alternativos de condições. A implementação inicial preserva esse texto e apresenta as dependências, mas o avaliador completo deve respeitar grupos `AND` internos e grupos `OR` externos. Não é aceitável tratar toda a condição como uma única lista de requisitos.

### 3. Algumas checagens estáticas são apenas “possíveis no percurso”

O fato de a CM 1 conter curvas, retas, aclives ou fases não prova que a personagem estará naquele trecho no estado exigido. Uma regra como `corner==0` só é realmente satisfeita quando o motor avança a corrida até uma reta; `order<=3` só pode ser decidida depois de calcular ou observar posição.

### 4. Quatro corridas não suportam conclusão estatística

As quatro tentativas existentes são excelentes como exemplos e fixtures de teste, mas não sustentam afirmações de taxa de vitória, ranking confiável ou superioridade de build. A posição média atual é descritiva e vulnerável a Late Start, Rushed, bloqueio, oponente e variância.

### 5. A origem das skills precisa virar dado estruturado

O arquivo de coleta já diferencia `única própria`, `herdada` e `aprendida`. A próxima versão do banco deve guardar isso em campos, incluindo `skill_id`, `origem`, `personagem_origem` quando herdada, nível e efeito aplicado. Texto livre não pode ser a chave definitiva de uma regra.

## Arquitetura-alvo

```text
Arquivos-fonte preservados
        ↓ importadores validados
Banco local estruturado
 ├── personagens / skins / aptidões
 ├── skills / efeitos / condições / variantes
 ├── pistas / setores / course_id / track_id
 ├── builds / skills da build / origem
 ├── corridas / participantes / eventos / ativações
 └── versões e fontes
        ↓
Motor determinístico de condições e corrida
        ↓
Camada de análise, comparação e recomendação
        ↓
Interface local + exportação + backup
```

SQLite é apropriado para a versão autônoma de longo prazo, pois suporta relações, consultas, backups e histórico. Enquanto a aplicação web local usar armazenamento do navegador, deve oferecer exportação e importação explícitas de JSON para evitar perda de dados.

## Etapas obrigatórias antes de recomendar builds de forma forte

| Prioridade | Entrega | Critério de aceite |
|---|---|---|
| P0 | Importador normalizado | Cada personagem, pista e skill possui ID estável; aliases de grafia ficam separados do nome canônico. |
| P0 | Parser de condições | Converte `AND`, `OR`, pré-condições e alternativas em uma árvore avaliável. |
| P0 | Testes unitários | Cada condição usada na CM 1 possui caso verdadeiro, falso e alternativo. |
| P1 | Estado de corrida por setores | Registra distância, fase, reta/curva, HP, posição, ordem percentual e eventos. |
| P1 | Motor de efeitos | Aplica e remove velocidade, aceleração, recuperação, buffs e passivas na ordem correta. |
| P1 | Validação contra referência | Compara saídas controladas com o simulador público e documenta divergências. |
| P2 | Coleta repetida | Registra muitas tentativas comparáveis, com participantes e eventos completos. |
| P2 | Estatística de incerteza | Exibe amostra, variância, intervalo de confiança e limitações da recomendação. |
| P3 | Gerador de builds | Considera support cards, herança, SP, níveis, restrições e itens realmente disponíveis. |

## Dados que devem ser coletados a partir de agora

Cada corrida deve possuir um ID, CM, pista, condições, participantes, ordem final, diferença em corpos, eventos por participante, skills observadas e um nível de confiança por anotação. O registro deve diferenciar fato observado de inferência.

| Campo | Exemplo | Natureza |
|---|---|---|
| `late_start` | `true` | Observação direta |
| `blocked_mid_race` | `true` | Observação direta, se visível |
| `stamina_shortage` | `inferred` | Inferência; requer nota livre |
| `skill_activation` | ID da skill + setor | Observação direta ou desconhecida |
| `margin_bashin` | `1.25` | Resultado da corrida |

Para comparar builds, repita o mesmo pelotão e a mesma pista diversas vezes. Só então altere uma variável por vez, como uma skill, um atributo ou a estratégia. Sem esse controle, a ferramenta poderá registrar correlação, mas não demonstrar causa.

## Qualidade de código e manutenção independente

Antes da exportação final, o projeto deve ter um `README` que explique instalação, comandos, estrutura de pastas, backup, importação e restauração. Deve também conter arquivos de exemplo, um glossário de condições, convenções de IDs, changelog e testes automatizados.

| Item | Necessário antes de entregar para manutenção independente |
|---|---|
| Node.js LTS e instruções de instalação | Sim |
| `pnpm install`, `pnpm dev`, `pnpm check`, `pnpm build` documentados | Sim |
| Esquema dos arquivos de dados | Sim |
| Testes do motor | Sim |
| Rotina de backup e restauração testada | Sim |
| Licenças e atribuição de fontes externas | Sim |
| Dados brutos separados de dados normalizados | Sim |
| Migração de dados entre versões | Sim, antes de usar SQLite de forma extensa |

Não copie código do simulador de terceiros sem verificar sua licença. Use-o como referência para testes e documente claramente qualquer fórmula confirmada por ele.

## Definição honesta de pronto

O projeto estará pronto para uma primeira recomendação **qualificada** quando puder importar os dados, simular uma corrida por setores, explicar cada ativação de skill, reproduzir casos de teste conhecidos e indicar incerteza. Ele estará pronto para recomendar builds de treinamento somente depois de considerar recursos realmente disponíveis — support cards, herança, SP, níveis e restrições do usuário.

Enquanto esses critérios não forem atendidos, o produto deve dizer: “compatibilidade e risco estimados”, e não “melhor build” ou “chance real de vitória”.

## Fontes do projeto

1. Arquivos de mecânicas, personagens, skills, pistas e corridas fornecidos pelo usuário.
2. [alpha123/uma-tools](https://github.com/alpha123/uma-tools), código público analisado como referência de modelagem.
3. [alpha123/uma-skill-tools](https://github.com/alpha123/uma-skill-tools), código público de regras analisado como referência de modelagem.
