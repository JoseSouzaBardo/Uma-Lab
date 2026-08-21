# RELATÓRIO — Validação Cruzada das Pistas (CM 1–18)

**Data:** 21/08/2026
**Objetivo:** validar os dados de pista do arquivo `UMA - pistas CM 1-18.txt` contra uma fonte
independente (o simulador umalator) e contra observações reais de corrida do usuário (CM1).

**Fontes:**
1. **gametora** (arquivo de pistas) — dataset EN `history/pre_2_5th_anni/racetracks`
2. **umalator** (`course_data.json` do simulador, atualizado em 19/08/2026)
3. **In-game** — `UMA - CM1 database.txt` (4 corridas reais na Taurus Cup, Tokyo 2400 m)

---

## 1. Validação estrutural: gametora × umalator

**Resultado: 18/18 cursos idênticos.** Para cada uma das 18 CMs foi comparado campo a campo:

| Campo | Resultado |
|---|---|
| Distância, superfície, direção | 18/18 idênticos |
| Curvas (posição + comprimento) | 18/18 idênticos |
| Retas (posição + tipo final/oposta) | 18/18 idênticos |
| Inclinações (posição + comprimento + gradiente %) | 18/18 idênticos |
| Stat Thresholds (Speed/Stamina/Power/Guts/Wit) | 18/18 idênticos |

**Fases:** a gametora guarda as fases explicitamente; o umalator as deriva das frações padrão do
jogo (1/6, 2/3, 5/6 da distância). As duas fontes coincidem nas **18/18** corridas.
**Spurt final:** inicia em 2/3 da distância — 18/18 OK. **Position Keep:** termina em 5/12 da
distância — 18/18 OK.

Conclusão: as duas bases independentes concordam integralmente — o arquivo de pistas está validado.

---

## 2. Validação in-game (CM1 — Taurus Cup, Tokyo 2400 m)

O arquivo do usuário registra as skills que **de fato ativaram** em 4 corridas reais. Cada uma foi
cruzada com a condição oficial do banco de skills e com o layout da pista:

### 2.1 Confirmações diretas de propriedades da pista

| Evidência in-game | O que confirma |
|---|---|
| "Left-handed ○" ativou (3 corridas) | Tokyo 2400 é anti-horária (`rotation==2`) ✓ |
| "Medium Straightaways/Medium Corners ○" ativaram | 2400 m é distância média (`distance_type==3`) ✓ |
| "Professor of Curvature", "Swinging Maestro", "Corner Connoisseur" ativaram sempre | pista tem curvas sorteadas entre as 4 curvas do traçado ✓ |
| "After-School Stroll" (exige descida por 10s) ativou | Tokyo 2400 tem descida de 250 m (1250–1500 m) ✓ |
| "Moxie" (exige subida por 10s) ativou | Tokyo 2400 tem 3 subidas ✓ |
| "Pace Chaser/End Closer Straightaways ○" ativaram | estilos 2 e 4 presentes nos builds ✓ (condição por estilo) |
| "Dodging Danger" ativou na Suzuka | ela foi bloqueada no início (fase 0) ✓ |
| Blocking no Mid-Race (corrida 4) | meio da corrida = 400–1600 m (retas+curvas) ✓ |

### 2.2 Skills únicas observadas × condições oficiais

| Skill (dona/herdada) | Condição | Observação in-game |
|---|---|---|
| Anchors Aweigh! (Gold Ship) | 50–60% da corrida, atrás do meio do pelotão | ativou em todas as corridas (Gold Ship corria de trás) ✓ |
| Triumphant Pulse (Oguri) | 200 m finais, 2º–5º, ≤50% do pelotão | ativou; "diminuiu de 5 para 2 corpos" ✓ |
| Shadow Break (Narita Brian) | meio bloqueado ao lado + curva final, perdendo posição | "abriu larga vantagem no Late-Race" ✓ |
| The View from the Lead Is Mine! (Suzuka) | 50%+, líder, alguém a ≥1 corpo atrás | Suzuka venceu a corrida 3 ✓ |
| Resplendent Red Ace (Daiwa) | 50%+, líder (ou 2ª ultrapassando) | corrida 1: perdeu o 1º lugar antes disso e despencou no Late-Race — consistente com a condição não disparar no ramo principal ✓ |
| Sky-High Teio Step (herdada no GS 002) | curva final→reta, ≤3º | **não** foi observada — GS 002 corria 4º–5º ✓ consistente |
| Moving Past, and Beyond (herdada no GS 001) | curva (não final) após fase 2, sem rush | **não** observada — condições restritivas ✓ |
| White Lightning Comin' Through! (herdada no Oguri) | 50%+, reta, 20–30% ou 70–75% do pelotão | **não** observada — Oguri corria em posição intermediária ✓ |
| Victory Cheer!/Barcarole (herdadas na Daiwa) | exigem ≤2º–40% à frente | **não** observadas — ela corria de trás ✓ |

**Conclusão:** nenhuma skill ativou fora das condições oficiais, e as skills que "deveriam" falhar
de fato não apareceram nas corridas. Os dados de skills + pista são consistentes com o jogo real.

### 2.3 Achados de build (valor de análise)

1. **Updrafters é inútil em 2400 m.** A skill exige `distance_type==2` (**mile**), mas a Taurus Cup
   é 2400 m (`distance_type==3`). O Build_003 (Oguri) a tinha aprendida e ela **nunca ativou** em
   nenhuma corrida — o banco de skills previa exatamente isso. Sugestão: trocar por uma skill de
   medium (ex.: Medium Straightaways ○).
2. **Daiwa Scarlet ficou sem stamina** (corrida 2, "perdeu por distância"). Stamina 621 para 2400 m
   com muitas skills de aceleração é apertado — consistente com o que o simulador de stamina do
   umalator mostra.
3. **A estratégia da Resplendent Red Ace depende de manter a ponta até 50%.** A Daiwa usava
   Taking the Lead/Early Lead (fase 0), mas perder a liderança antes da metade da corrida
   desativa o ramo principal da única.
4. Nomenclatura: "Straightawayspurt" = **Straightaway Spurt** (skill oficial 200642, End Closer);
   "White Lighting" = **White Lightning Comin' Through!** (Tamamo Cross); "End Closer Savvy o" =
   **End Closer Savvy ○** (201552).

---

## 3. Conclusão geral

- O arquivo `UMA - pistas CM 1-18.txt` está **100% validado** contra o simulador (18/18 cursos
  idênticos) e corroborado pelas corridas reais da CM1.
- O banco de skills (`UMA - skills (completo).txt`) também saiu reforçado: todas as ativações
  observadas in-game respeitam as condições registradas.
- Selo de validação adicionado ao cabeçalho do arquivo de pistas.
