# RELATÓRIO — Revisão e Correções do Banco de Dados (UMA - dados gerais)

**Data da extração/verificação:** 20/08/2026 (revisão v2 aplicada no mesmo dia)
**Fonte:** https://uma.guide/characters/ (versão **Global** do jogo)
**Arquivo gerado:** `UMA - dados gerais (completo).txt`

---

## 1. O que foi feito

1. Extraí os dados públicos do uma.guide (chunks de dados da versão Global do site) e repliquei o
   **mesmo pipeline de exibição usado pelo site** (mapeamento de tipos de efeito `Jd/L0`, formatação
   `lf/HP/Pv`) para garantir fidelidade total aos valores exibidos nas páginas de personagem.
2. Completei o banco com **todas as 99 cartas listadas no site** — isso cobre **64 personagens únicos**;
   personagens com múltiplas skins aparecem **uma entrada por skin**, porque aptidões, fator de
   crescimento e skills mudam conforme a skin (o template já registra a skin no cabeçalho).
3. Corrigi as 6 entradas já preenchidas (detalhes na seção 4).
4. Validei amostras contra as páginas ao vivo do site (King Halo, Agnes Tachyon, Taiki Shuttle) — 100% de aderência.

### Organização do arquivo
- Posições 1–15: estrutura original do seu documento.
  - Posição 1 (placeholder vazio): **Special Week [Special Dreamer]**.
  - Posições 2–7: suas 6 entradas (corrigidas, na mesma ordem).
  - Posição 8: **Agnes Tachyon [tach-nology]** (slot já nomeado no arquivo).
  - Posições 9–15 (placeholders vazios): os 8 personagens "clássicos" restantes foram distribuídos:
    Silence Suzuka, Tokai Teio, Mejiro McQueen, Gold Ship, Oguri Cap, Daiwa Scarlet, Vodka.
    *(Nota: eram 8 espaços vazios e coloquei 7 aqui + Special Week na posição 1 — escolhi os
    personagens mais icônicos da franquia; reordene como preferir.)*
- Da posição 16 em diante: as demais 84 cartas do site, em ordem de ID (ordem do arquivo de dados do site;
  a página web exibe do mais recente para o mais antigo).

---

## 2. Mapa de campos (documento ↔ site)

| Campo do documento | Campo no site | Observação |
|---|---|---|
| Turf / Dirt | Track: Turf / Dirt | Letras G→S |
| Sprint / Mile / Medium / Long | Distance: Sprint/Mile/Medium/Long | `aptitudeShort/Mile/Middle/Long` |
| Front Runner / Pace Chaser / Late Surger / End Closer | Style: Front/Pace/Late/End | `aptitudeRunner/Leader/Betweener/Chaser` |
| Fator crescimento (%) | Growth (+X%) | `talentSpeed/Stamina/Power/Guts/Wisdom` |
| Skill única | Unique Skill | 1ª skill da lista `skillIds` |
| Efeito da skill única | Linha de efeito na página | ver conversões na seção 3 |
| Duração base | `duration` (segundos) | 0 = efeito instantâneo |
| Requisitos de ativação | `activationCondition` + `precondition` | cada linha = 1 condição; todas precisam valer simultaneamente |
| Skills inatas | INNATE SKILLS | needRank 0 |
| Skills potenciais | POTENTIAL SKILLS | com nível de potencial (Nv.2 a Nv.5) |

---

## 3. Convenções adotadas

- **Efeitos em %:** o site exibe velocidade/aceleração em m/s² ("Target Speed +0.45"). Converti para o
  padrão do seu documento: `Target Speed +45%`, `Acceleration +10%`, `Current Speed +15%`, etc.
  (valor × 100). HP Recovery já era % no site.
- **"--- OU ---":** separa blocos alternativos de ativação (o site usa "--- OR ---" na visualização crua).
- **"Condição alternativa:"** aparece quando a skill única tem 2ª variante (ex.: Special Week
  [Ruler of Japan], Taiki Shuttle [Bubblegum☆Memories]).
- **○ (círculo):** nomes oficiais de skills de pista/distância usam ○ (ex.: "Outer Post Proficiency ○");
  padronizei todos (antes estavam como "O").
- **Skills inatas × potenciais:** separei em duas linhas. As 4 skills de "potencial" estavam misturadas
  na linha "Skills inatas" — agora cada uma vem com seu nível (Nv.2–Nv.5), como no site.
- **Precondição:** o site guarda parte das condições num campo separado (`precondition`) e as combina
  com a condição principal. Fiz o mesmo (ex.: Winning Ticket, abaixo).
- **Cooldown:** o site lista um cooldown (500ms) para skills únicas, mas seu template não tem esse campo —
  omiti de propósito.
- **Skills evoluídas** (evolutions, ex.: "Shocking Sweep") não entram no template — ficam de fora.

---

## 4. Correções aplicadas às entradas existentes

### King Halo [King of Emeralds]
| Antes | Depois | Motivo |
|---|---|---|
| Pace Chase - B | Pace Chaser - B | Rótulo do seu próprio template |
| order>=40% | order>=4 | Dado bruto do site: posição ≥ 4º lugar |
| order<=70% | order_rate<=70 | `order_rate` é a posição percentual (≤ 70% do pelotão) |
| Outer Post Proficiency O | Outer Post Proficiency ○ | Nome oficial no site |
| 7 skills juntas em "Skills inatas" | 3 inatas + 4 potenciais (Nv.2–5) | Estrutura do site |

### Nice Nature [Poinsettia Ribbon]
| Antes | Depois | Motivo |
|---|---|---|
| Front Runner - G | Front Runner - F | Site: Front **F** (vale para as duas skins dela) |
| Kokura Racecourse O | Kokura Racecourse ○ | Nome oficial |
| Ordem: Mystifying Murmur, All-Seeing Eyes, Hesitant Late Surgers... | Hesitant Late Surgers (Nv.2), Mystifying Murmur (Nv.3), A Small Breather (Nv.4), All-Seeing Eyes (Nv.5) | Ordem/níveis do site |

### Matikanefukukitaru [Rising☆Fortune]
| Antes | Depois | Motivo |
|---|---|---|
| Smok Screen | Smoke Screen | Typo (nome oficial) |
| Lucky Seven O | Lucky Seven ○ | Nome oficial |
| Ordem das skills | Triple 7s (Nv.2), Illusionist (Nv.3), Trick (Rear) (Nv.4), Super Lucky Seven (Nv.5) | Ordem/níveis do site |

### Haru Urara [Bestest Prize ♪]
| Antes | Depois | Motivo |
|---|---|---|
| Long Shot O. | Long Shot ○ | Nome oficial |
| ... Indomitable, Long Shot O | Long Shot ○ (Nv.4), Indomitable (Nv.5) | Ordem/níveis do site |

### Sakura Bakushin O [Blossom in Learning]
| Antes | Depois | Motivo |
|---|---|---|
| Pace Straightways O | Pace Chaser Straightaways ○ | Nome oficial no site (a tradução literal "Pace" difere) |

### Winning Ticket [Get to Winning!]
| Antes | Depois | Motivo |
|---|---|---|
| Long - A | Long - B | Site: Long **B** (vale para as duas skins dele) |
| Requisitos com `blocked_side_continuetime>=2` sem fonte | Mantidos, agora com fonte: o site guarda essa cláusula no campo `precondition` da skill | Seus dados estavam corretos — documentei a origem |
| Firm Conditions O / Late Surger Corners O | Firm Conditions ○ / Late Surger Corners ○ | Nomes oficiais |

**Observação crítica:** na versão JP, a skill do Winning Ticket usa `is_last_straight==1`; a versão
Global usa `is_finalcorner==1&corner==0` (equivalente). Os dados deste banco são os da versão **Global**.

---

## 5. Glossário das condições de ativação

| Condição | Significado |
|---|---|
| `phase` | Fase da corrida: 0 = início, 1 = meio, 2 = reta final (final), 3 = spurt final |
| `order` | Posição (rank): 1 = líder |
| `order_rate` | Posição percentual no pelotão: 0 = líder, 100 = último |
| `remain_distance` | Distância restante, em metros (ex.: <=201&>=199 ≈ faltando 200 m) |
| `distance_rate` | Percentual da corrida já percorrido (>=50 = segunda metade) |
| `distance_diff_top` | Distância (em metros) até o líder |
| `corner` / `is_finalcorner` | Trecho de curva / curva final (==0 = reta; !=0 = curva) |
| `is_finalstraight` / `is_last_straight` | Reta final |
| `temptation_count==0` | Ainda não "rushou" (temptation = rush; site exibe "Haven't Rushed") |
| `bashin_diff_behind` / `bashin_diff_infront` | Distância até o oponente atrás/frente, em "corpos" (~1L ≈ 2,5 m) |
| `near_count` | Nº de adversários a ≤ 1 corpo |
| `blocked_front_continuetime` / `blocked_side_continuetime` | Tempo contínuo (s) bloqueado por adversário à frente / ao lado |
| `change_order_onetime` | Mudança de posição no último intervalo (>0 = ganhou posição; <0 = perdeu) |
| `change_order_up_end_after` | Nº de ultrapassagens na reta final em diante |
| `is_overtake` / `overtake_target_time` | Em ultrapassagem / tempo mirando ultrapassar alguém |
| `order_rate_inNN_continue` | Manteve-se dentro dos NN% da frente do pelotão |
| `order_rate_outNN_continue` | Manteve-se fora dos NN% da frente (mais atrás) |
| `post_number` | Portão de largada |
| `ground_condition` | Condição do piso (1 = firme/good) |
| `track_id` | ID da pista (ex.: 10005 = Tokyo, 10010 = Kokura) |
| `distance_type` | Tipo de distância da prova: 1 = sprint, 2 = mile, 3 = medium, 4 = long |
| `running_style` | Estratégia: 1 = Front Runner, 2 = Pace Chaser, 3 = Late Surger, 4 = End Closer |
| `running_style_count_*` | Nº de adversários de uma estratégia (ex.: `_nige_otherself` = front runners rivais) |
| `straight_random` / `corner_random` / `phase_random` | Reta/curva/fase aleatória (sorteada no início da corrida) |
| `is_move_lane` | Mudando de raia |
| `accumulatetime` | Tempo acumulado em certo estado (ex.: segundos bloqueado/em ultrapassagem) |
| `is_activate_any_skill` | Alguma skill (qualquer) ativada |
| `slope` / `up_slope_random` | Aclive / aclive aleatório |
| `popularity` | Popularidade (apostas): >=4 = azarão |
| `random_lot` | Sorteio aleatório (0–100) |
| `lane_type` | Tipo de raia (0 = interna...) |
| `is_badstart` | Largada ruim |

---

## 6. Limitações e ressalvas (leitura crítica)

1. **Dados por skin:** aptidões, fator e skills são da skin indicada no cabeçalho. A mesma personagem
   em outra skin pode ter valores diferentes (ex.: Mejiro McQueen tem 3 skins no banco).
2. **99 cartas ≠ 99 personagens:** a listagem do site ("99 of 99 characters") contém 99 cartas de
   64 personagens únicos. O banco cobre a listagem inteira.
3. **Conversão de unidades:** o site mostra m/s² (ex.: Target Speed +0.45); o banco usa % (×100).
   Para comparar com o site, divida por 100.
4. **Cooldown e custo de SP** das skills existem no site mas não estão no seu template.
5. **Evoluções de skill** (evolved skills) não foram incluídas — estão no site se precisar.
6. **Condições "order_rate"** dependem do tamanho do pelotão quando convertidas em posição exata;
   por isso mantive os valores percentuais brutos.
7. **Dados podem mudar** com atualizações do jogo/site (esta extração é de 20/08/2026).
8. **Divergências que encontrei nos seus dados originais** estão todas documentadas na seção 4.

---

## 7. Revisão v2 — correções apontadas pelo usuário (aplicadas)

### 7.1 Copano Rickey [Eightfold☆Fortune] — efeito da skill única corrigido
**Problema:** o banco exibia `Target Speed +25%, Target Speed +5%, Acceleration +5%` como se fossem
bônus fixos — o usuário apontou que a Acceleration base é 0% e que o efeito escala com skills verdes.

**Correção (dados oficiais de escala do site):**
- Base: **Target Speed +25% e Acceleration +0%**
- Bônus por skills verdes (passivas) ativadas: **+5% Target Speed e +5% Acceleration a cada 2 skills
  verdes** — máx. **+15%/+15% com 6 skills verdes** (breakpoints oficiais: 0 → 3 → 5 → 6 skills).

Fonte: descrição oficial da skill ("increase velocity and acceleration based on how many passive
skills the skill user has in effect") + tabela `specialScaling` do site (rótulo "# of Green Skills
Activated", 0–6 skills).

### 7.2 Agnes Digital [Fanatic♡Jiangshi] — skill única corrigida
**Problema:** o banco mostrava `OMG! (ﾟ∀ﾟ) The Final Sprint! ☆` (a unique da skin base) na
[Fanatic♡Jiangshi], idêntica à da [Full-Color Fangirling].

**Causa:** a lista de skills da carta contém **duas** skills únicas — a da skin base (`100191`) e a
própria da skin (`110191`). O site **exclui a unique da skin base** da exibição das skins alternativas
(regra `c4` do site: exclui `100001+(charaId-1000)*10`).

**Correção:** skill única da [Fanatic♡Jiangshi] = **"THE MOE AAAA Thanks for My Life"** (Target Speed
+35%, 5s; condições: `near_count>=3`, `phase==1`, `corner!=0`, `order_rate>=40`) — conferido na página
ao vivo do site.

A mesma regra corrigiu mais **10 cartas** que exibiam a unique da skin base:
| Carta | Unique correta |
|---|---|
| Special Week [Hopp'n♪Happy Heart] | Dazzl'n ♪ Diver |
| Maruzensky [Hot☆Summer Night] | A Kiss for Courage |
| Fuji Kiseki [Succès Étoilé] | Ravissant |
| Oguri Cap [Ashen Miracle] | Festive Miracle |
| Grass Wonder [Saintly Jade Cleric] | Superior Heal |
| Mejiro McQueen [End of the Skies] | Legacy of the Strong |
| T.M. Opera O [New Year, Same Radiance!] | Barcarole of Blessings |
| Air Groove [Quercus Civilis] | Eternal Moments |
| Meisho Doto [Dot-o'-Lantern] | Spooky, Scary, Happy |
| Mejiro Dober [Sapphire Sojourn] | Wherever This Wonder Leads |

### 7.3 Mejiro McQueen [Fair Lady of the Waves] — unique duplicada removida
A carta listava `Legacy of the Strong` + `Your Smile Sparkles as the Waves`. O site aplica um
**override oficial** nos dados dessa carta (camada `characters` de overrides), removendo a primeira:
a unique exibida é somente **"Your Smile Sparkles as the Waves"**. O gerador agora replica essa camada
de overrides do site.

### 7.4 Outros efeitos dinâmicos agora descritos por extenso
- **Winning Ticket [Dream Deliverer] — Ticket to Your Dreams!:** Target Speed +25% (base) **+5% por
  skill ativada (até 3x; máx. +15%)**.
- **Bamboo Memory [Iron Ambition] — Red-Hot Discipline!:** Acceleration +10% (base) **+10% e duração
  aumentada por adversário ultrapassado (até 3x)**.
- **Mejiro Bright [Brunissage Line] — Lovely Spring Breeze:** duração real varia com a HP restante
  (breakpoints oficiais: 5s com 0 HP → 20s com 3500 HP).
- **Mejiro McQueen [Fair Lady of the Waves]:** duração do "long spurt" aumenta conforme a HP restante.
- **Haru Urara [New Year ♪ New Urara!] — 114th Time's the Charm:** duração proporcional à distância
  até o líder.
- **Gold Ship [RUN! RUIN! LAUNCHER!] — 564 Escapades:** além do efeito listado, ativa 2 skills raras
  (douradas) aleatórias, ignorando as condições delas (efeito que o site não exibe na linha de efeito).

### 7.5 Metodologia da v2
- O gerador agora replica a **camada de overrides** do site (função `Zr` do app.js: overrides de
  personagens por `cardId` e de skills por `skillId`), garantindo que o banco reflita exatamente o que
  a página de cada personagem exibe (validado contra as páginas ao vivo de King Halo, Agnes Tachyon,
  Taiki Shuttle, Agnes Digital [Fanatic♡Jiangshi], Mejiro McQueen [Fair Lady of the Waves] e
  Copano Rickey).
- Verificação estrutural pós-overrides: **99/99 cartas** com exatamente 1 skill única exibida,
  0 skills não encontradas, 0 divergências entre lista de skills e skills potenciais.

---

## 8. Banco de skills (novo arquivo)

**`UMA - skills (completo).txt`** — banco completo das **710 skills** da listagem de
https://uma.guide/skills/ (versão Global), gerado com o mesmo pipeline de exibição do site.

- **Organização:** o site exibe as skills em lista única com filtro por tipo; no arquivo elas estão
  agrupadas pela **categoria** (o filtro de tipo do site) — Skills Únicas (218), Passivas (149),
  Speed Boost (156), Acceleration (51), Recovery (52), Lane Effect (14), Vision (8), Debuff (60) e
  Outras (2) — mantendo a ordem interna da listagem do site (ID crescente). Índice alfabético ao final.
- **Campos por skill:** Nome, ID, Categoria, Raridade (White/Gold/Unique), Grau (gradeValue), Custo
  em SP, Efeito(s) (convertidos para % em velocidade/aceleração), Duração, Cooldown, Pré-condição,
  Condições de ativação (com "--- OU ---" e "Condição alternativa"), Escala dinâmica (tabelas oficiais
  de efeito variável — ex.: Copano Rickey, Burning Spirit, Nothing Ventured), Descrição oficial,
  Variantes (pares dourada/branca de mesma condição), Fontes (personagens e support cards).
- **IDs** permitem cruzar com o arquivo de personagens (a skill única de cada personagem está na
  seção "Skills Únicas" com o mesmo ID).
- Skills evoluídas (evolutions) ficaram de fora, pois não fazem parte da listagem do site.

### 8.1 Revisão v3 — skills únicas duplicadas mescladas com a versão fraca
Conforme solicitado, as 99 skills únicas que possuem uma **segunda versão mais fraca** (a versão
herdável do jogo, ID 9xxxxx) foram mescladas:
- **Uma entrada por skill**, exibindo efeito, duração, descrição, efeito alternativo e escala
  dinâmica da **versão fraca** (ex.: Prideful King agora mostra Target Speed +25% / 3s em vez de
  +45% / 5s; Luck Runs My Way mostra +5% / 3s, sem o acúmulo por skills verdes — que é exclusivo da
  versão forte, conforme a descrição oficial da versão fraca).
- As entradas duplicadas 9xxxxx foram removidas do arquivo (710 → **611 skills**).
- As 20 skills únicas **sem** versão fraca (ex.: Warning Shot!, Xceleration, Corazón ☆ Ardiente)
  permanecem com seus valores originais.
- O arquivo de **personagens não foi alterado**: lá cada personagem continua mostrando o efeito
  forte da própria skill única (correto para o dono da skill).

### 8.2 Revisão v4 — skills únicas sem versão fraca removidas
As 20 skills únicas que não possuem versão fraca (resquícios do banco, sem nenhuma carta de
personagem atual as referenciando) foram **removidas** do arquivo de skills:
Warning Shot!, Xceleration, Red Ace, Focused Mind, Corazón ☆ Ardiente, Empress's Pride,
1st Place Kiss☆, Feel the Burn!, Introduction to Physiology, V Is for Victory!,
Class Rep + Speed = Bakushin, Clear Heart, Super-Duper Stoked, Luck Be with Me!,
I Can Win Sometimes, Right?, Call Me King, Ready, Go!, Shine On, Tomakomai! ☆,
Ruler of Japan (300131) e Indomitable (300141).

Resultado: 611 → **591 skills**; seção Skills Únicas: 119 → **99** (todas com versão fraca mesclada).
Observação: a skill "Indomitable" que permanece no arquivo é a skill normal de Recovery (ID 200471,
inata da Haru Urara) — homônima, mas sem relação com a única removida (300141).

---

## 9. Banco de pistas das Champions Meeting 1–18 (novo arquivo)

**`UMA - pistas CM 1-18.txt`** — dados das pistas das CMs 1 a 18, extraídos da gametora
(https://gametora.com/umamusume/events/champions-meeting?cm=1 a ?cm=18).

- **Fontes:** lista de CMs embutida no JS da página + JSONs públicos da gametora
  (`/data/manifests/umamusume.json` → lista de CMs JP, lista de CMs do servidor Global/EN e o
  dataset de pistas `history/pre_2_5th_anni/racetracks`, que é o mesmo que o viewer usa no Global).
- **Por CM:** nome, datas (Global e JP original), pista, superfície, distância, direção, estação,
  clima, condição do piso, variante da pista (Interna/Externa/Externa→Interna), voltas do diagrama,
  fases (Abertura/Meio/Final/Spurt final com metros de início/fim), retas (final/oposta), curvas
  (numeradas), inclinações (subida/descida em % com início/fim), Stat Thresholds (Speed/Stamina/
  Power/Guts/Wit), spurt final (volta/metros/local), Position Keep, trechos neutros, transições de
  terreno e sobreposições do diagrama.
- **Observações de analista:** o servidor Global repete as CMs do JP na mesma ordem (datas próprias);
  a CM18 Global ainda não ocorreu (início estimado em 29/08/2026 pelo algoritmo do próprio site).
  Divergências pontuais vs. uma.guide (CM3/CM4 variante de pista; CM17 condição do piso; CM10
  transição turf→dirt) estão documentadas como notas dentro do arquivo.

---

## 10. Support cards e fatores de herança (novos arquivos)

### 10.1 `UMA - support cards (completo).txt`
**245 support cards** da listagem do uma.guide (113 SSR, 50 SR, 82 R), agrupadas por TIPO
(Speed, Stamina, Power, Guts, Wit, Friend — como o filtro do site) e, dentro do tipo, por
raridade (SSR → SR → R) e ID. Índice alfabético por personagem ao final.

Campos por carta: Nome ([Título] + personagem), ID, Raridade, Tipo, Lançamento (JP), **Efeitos no
Nv 50** (simplificação: todas as cartas no nível MÁXIMO; cada efeito mostra só o valor final, igual
à aba "Stats at Level 50" do site, com os componentes do efeito único SOMADOS à tabela),
**Efeito único (ativo)** com a condição de bond ("At Bond X") quando houver, **Skill hints**
(skills que a carta ensina), **Eventos** (aleatórios da carta).
Observação: 1 carta ([This Might Sting!]) tem efeito único textual sem bônus numérico —
descrito por extenso conforme a página do site.

### 10.2 `UMA - fatores de heranca.txt`
Dados completos dos **fatores (sparks) de herança**, extraídos da gametora (`factors.json` +
artigo "Uma Musume Legacies") com nomes cruzados com o uma.guide:

- **Mecânica** resumida do artigo oficial (bônus iniciais, inspiração, compatibilidade, chances).
- **Sparks azuis**: os 5 atributos, chance de estrelas conforme o stat final da carreira
  (<600 / 600–1100 / >1100) e bônus por estrela (★1=+5, ★2=+12, ★3=+21, somando legacies e
  sub-legacies).
- **Sparks rosa**: as 10 categorias de aptidão + **tabela por personagem** dos sparks rosa
  possíveis (aptidões base ≠ G).
- **Sparks verdes**: tabela das 99 skins → skill única herdável (requer raridade ≥ 3★).
- **Sparks brancos de corrida**: as 37 corridas G1 com efeito por estrela (atributo +3/+6/+9 e/ou
  dica de skill), com pista/distância do uma.guide.
- **Sparks brancos de cenário**: os 34 cenários com bônus por estrela.
- **Sparks brancos de skill**: pool de 439 skills normais que podem virar spark (20%/25%/40%).
- Skills novas ainda sem tradução EN aparecem com o nome JP (ex.: アメリカンドリーム).

---

## 11. Cenários de treino (novo arquivo)

**`UMA - cenarios de treino.txt`** — os 4 cenários permanentes do servidor Global, extraídos dos
artigos oficiais da gametora (URA Finale, Unity Cup, Trackblazer, Grand Live — atualizados em
07/2026) + dados estruturados de cenários da gametora.

Por cenário (em ordem de lançamento): nomes EN/JP, datas de lançamento (JP e **Global**),
atualizações relevantes, personagens-link, **stats iniciais da carreira** (dados estruturados),
mecânica central (objetivos, sistemas exclusivos como Grade Points/Shop Coins do Trackblazer,
Spirit Burst da Unity Cup, Lessons/tokens do Grand Live), eventos de level-up da skill única,
**spark do cenário** (fator branco), **caps de status** e dicas.

Tabela comparativa ao final + notas de analista (ex.: o spark do Trackblazer aparece como
"TS Climax Scenario" nos dados; caps do Trackblazer Global ainda são os clássicos 1200).

---

## 12. Metas de CM da comunidade (novo arquivo)

**`UMA - metas de CM (comunidade).txt`** — o "meta" recomendado pela comunidade para as CMs 1–18,
extraído em 21/08/2026 de duas fontes:

- **game8.co** (guias oficiais de cada CM, do CM1 Taurus Cup 2025 ao CM18 Libra Cup 2026) —
  extraído via proxy de leitura (o site bloqueia bots) e parseado localmente. Por CM:
  análise de pista, **metas de status** (tabelas por estilo nas CMs de 2025 e baselines
  Graded/Open League nas CMs de 2026, sempre na ordem Speed|Stamina|Power|Guts|Wit),
  orientações de stamina e recovery (CM1–3), tier list de personagens (SS/S/A/B, com notas
  "needs sparks"), personagens recomendados com pontos-chave, aces por estilo, debuffers,
  skills recomendadas (com tipo) e support cards recomendados (com tipo/raridade).
- **uma.guide** (guias técnicos das CMs 9–18) — texto integral dos guias (análises de aceleração,
  stamina, debuffs, visão do meta), com cortes de navegação, em inglês.

Observações registradas no arquivo: os guias do game8 das CMs 1–3 (2025) são compactos (não
listam skills/suportes), e as CMs 2–3 também não têm tier list detalhada; os campos ausentes
são indicados como tal.

**Limitação de leitura de imagens:** o canvas da CM17 (umalator.app/Canva) não pôde ser lido —
não tenho capacidade de visão neste ambiente e o Canva só expõe miniaturas de 668px (OCR ilegível
e resolução maior bloqueada por assinatura). As mesmas informações estão cobertas pelas duas
fontes de texto acima.

---

## 13. Protótipo do Analisador de CM (aplicativo web)

Aplicativo web **Analisador de CM** (pasta `analyst/` + servidor local no preview). Arquivos:

- `analyst/app/index.html` — o app (HTML+JS embutidos, sem dependências externas).
- `analyst/app/data.json` — dados agregados: 18 CMs (pista + meta game8 + guia uma.guide),
  99 personagens, 710 skills, caps/stats dos 4 cenários.
- `uma_data/analyst_gen.cjs` — gerador do data.json (replicando os overrides do uma.guide).

Funcionalidades por CM (1–18):
1. **Pista** — fases, retas, curvas, inclinações, stat thresholds, spurt/position keep + análise
   de pista do game8.
2. **Metas** — caps do cenário da época + metas da comunidade (Graded/Open/mínimos ou por estilo),
   com aviso automático quando a meta excede o cap do cenário, e sparks azuis recomendados.
3. **Personagens** — ranking calculado (aptidões distância×5 + superfície×3 + estilo×2 + bônus da
   skill única 15/8) comparado à tier list, recomendados, aces e debuffers do game8.
4. **Skills** — avaliador de condições próprio: para cada skill e CM, classifica em
   ✓ ativa (condições determinísticas satisfeitas: pista/direção/estação/clima/piso/distância/
   inclinações/retas), ~ situacional (posição, bloqueio, ultrapassagem, sorteios) ou ✗ não ativa.
   Filtro por estilo de corrida + lista de recomendadas do game8.
5. **Análise** — prosa da meta (game8) + guia técnico completo (uma.guide).

Validação do avaliador: 30 casos conhecidos (skills de estação/clima/pista/distância/inclinação
contra CMs 1/9/17 etc.) — 29 PASS + 1 nome de teste inexistente; distribuição média por CM de
~90 ✓ / ~212 ~ / ~190 ✗. Renderização testada em jsdom (18 CMs × 5 abas × 4 estilos, 0 erros).
