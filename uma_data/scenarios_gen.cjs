// Gera "UMA - cenarios de treino.txt" — os 4 cenários de treino do servidor Global
// Fontes: gametora (scenarios.json + artigos URA/Unity/Trackblazer/Grand Live) e fatores (factors.json)
const fs = require('fs');
const SC = require('/home/user/gametora_data/scenarios.61b7c51c.json');
const SF = require('/home/user/gametora_data/static_scenarios.4dc6b664.json');

const dmy = ts => new Date(ts * 1000).toISOString().slice(0, 10).split('-').reverse().join('/');

const sById = new Map(SC.map(x => [x.id, x]));
const fById = new Map(SF.map(x => [x.id, x]));

// ordem de lançamento desejada
const ORDER = [
  { id: 1, en: 'URA Finale' },
  { id: 2, en: 'Unity Cup' },
  { id: 4, en: 'Trackblazer' },
  { id: 3, en: 'Grand Live' },
];

function factorLine(id) {
  const f = fById.get(id);
  if (!f) return null;
  const fx = f.factors[0];
  const STAT = { speed: 'Speed', stamina: 'Stamina', power: 'Power', guts: 'Guts', wisdom: 'Wit', pt: 'Pt (recurso)' };
  return `Spark do cenário: ${fx.name_en || fx.name_ja} → +${STAT[fx.effect_1]} e +${STAT[fx.effect_2]} (★1/★2/★3: +10/+20/+30 de cada)`;
}

const content = {
  1: {
    title: 'URA FINALE (FINAIS URA)',
    extra: `Também conhecido como: URA Finals · 新設！URAファイナルズ`,
    release: `Lançamento: JP 24/02/2021 (lançamento do jogo) · Global 26/06/2025 (lançamento do servidor)`,
    update: `Atualização relevante no Global: 01/07/2026 (duelos da Happy Meek e valores de treino melhorados; no JP: nov/2022)`,
    links: 'Personagens-link do cenário: Aoi Kiryuin (桐生院葵).',
    mechanics: [
      'Objetivos POR PERSONAGEM (participar/correr/fãs), depois classificatórias → semifinal → final do URA Finale.',
      'Level-up da skill única (eventos fixos): 60k fãs até início/fev ano 3 · 70k fãs até início/abr ano 3 (exige amizade verde com a Akikawa) · 120k fãs até final/dez ano 3. Personagens de dirt (Haru Urara, Smart Falcon): 40k/60k/80k.',
      'Duelos vs. Happy Meek (atualização Global de 01/07/2026): treino com marca laranja "対決"; vitória dá +4 de uncap no stat, +10-25 de stat, +30 SP, +4 de energia máxima e hint de skill "Essence of Racing". 5 vitórias = Happy Meek Lv MAX (versão fortalecida na final).',
      'Eventos de fãs: 50k fãs → hint (início/nov ano 2); 100k fãs → +30 SP (fim ano 2); 240k fãs → +30 SP (fim ano 3).',
    ],
    factor: factorLine(1),
    caps: 'Caps de status: 1400 em todos (Speed/Stamina/Power/Guts/Wit).',
    tips: [
      'Cenário mais rápido para farm de herança/fãs (objetivos curtos).',
      'O spark do cenário (URA Finale) é um dos mais desejados para white sparks (Speed+Stamina).',
    ],
  },
  2: {
    title: 'UNITY CUP (TAÇA UNITY)',
    extra: `Também conhecido como: Aoharu Hai · アオハル杯～輝け、チームの絆～`,
    release: `Lançamento: JP 30/08/2021 · Global 06/11/2025`,
    update: `Atualização relevante no Global: 01/07/2026 (JP: 20/01/2023) — Spirit Burst extremo, rank S+ de equipe, elite teams, valores de treino ajustados`,
    links: 'Personagens-link do cenário: Taiki Shuttle, Rice Shower, Haru Urara, Matikanefukukitaru e Riko Kashimoto (樫本理子).',
    mechanics: [
      'Foco em CORRIDAS DE EQUIPE: torneio da Unity Cup a cada 6 meses de carreira (5 corridas, estilo Team Trials), contra equipes NPC (Zenith/"First" na final).',
      'Time = support cards do deck (exceto Pals) + 4 personagens da história (Haru Urara, Rice Shower, Matikanefukukitaru, Taiki Shuttle) + membros aleatórios que entram após cada torneio.',
      'Level das instalações de treino NÃO sobe por uso: sobe com o RANK DA EQUIPE (Unity Training + Spirit Burst; Spirit Burst extremo dá hint das skills "Ignited" e reduz falha do treino a 0%).',
      'Objetivos e agenda praticamente iguais ao URA Finale (incluindo as 3 finais no fim da carreira).',
      'Level-up da skill única: mesmo esquema de fãs do URA (60k/70k/120k), MAS sem exigência de amizade com a Akikawa (ausente do cenário).',
      'Rank de liga da equipe: escolher o adversário NPC certo; derrotar equipes fortes dá mais rank. Rank S+ alcançável após a atualização.',
    ],
    factor: factorLine(2),
    caps: 'Caps de status: 1300 em Speed/Stamina/Power/Guts e 1800 em Wit.',
    tips: [
      'Cenário preferido para "aces" (stats altas) — leva um pouco mais de tempo que o URA.',
      'Wit com cap altíssimo (1800) favorece builds de Wit; equipe forte é essencial para os torneios.',
    ],
  },
  4: {
    title: 'TRACKBLAZER (MANT — MAKE A NEW TRACK)',
    extra: `Também conhecido como: Make a New Track!! · Make a new track!!～クライマックス開幕～`,
    release: `Lançamento: JP 24/02/2022 · Global 12/03/2026`,
    update: 'Sem atualização de mecânica relevante até 21/08/2026.',
    links: 'Personagens-link do cenário: NENHUM (sem mecânica de scenario link).',
    mechanics: [
      'Cenário centrado em CORRIDAS: não há objetivos por personagem — o progresso é por GRADE POINTS (成績Pt).',
      '4 objetivos: 1) Debut; 2) 60 Grade Points; 3) 300 Grade Points; 4) 300 Grade Points. Personagens de dirt: 30/200 em vez de 60/300; personagens só de sprint (ex.: Curren Chan): 200 no 3º objetivo. Pontos de um objetivo NÃO acumulam para o próximo.',
      'Grade Points vêm de corridas conforme o grade (G1 dá mais); posições menores dão proporcionalmente menos.',
      'Shop Coins (moeda especial) também vêm de corridas (100 por 1º lugar) e são gastas na Loja Especial: Artisan/Master Cleat Hammer (+20%/+35% race bonus), Glow Sticks (+50% fãs), etc.',
      'RIVALS: corridas aleatórias com rival "VS" — vencer dá hint de skill da distância/estratégia da corrida.',
      'Final do cenário: TWINKLE STAR CLIMAX.',
    ],
    factor: factorLine(4),
    caps: 'Caps de status (Global): 1200 em todos (os caps elevados do JP — Stamina 1900, Wit 1500 — chegam em atualização futura).',
    tips: [
      'Como não há objetivos fixos, TODAS as corridas ficam disponíveis — ideal para troféus e farm de sparks de corrida G1.',
      'Planeje os Grade Points por objetivo (excedente não carrega).',
    ],
  },
  3: {
    title: 'GRAND LIVE (NOSSO GRANDE CONCERTO)',
    extra: `Também conhecido como: Brighter Together Our Grand Concert · つなげ、照らせ、ひかれ。私たちのグランドライブ`,
    release: `Lançamento: JP 24/08/2022 · Global 22/07/2026`,
    update: '—',
    links: 'Personagens-link do cenário: Silence Suzuka, Agnes Tachyon, Smart Falcon, Mihono Bourbon e Light Hello (ライトハロー, NPC nova).',
    mechanics: [
      'Cenário de IDOL: 4 "Promotional Lives" (shows) a cada 6 meses a partir do fim/dez do ano 1; meta final = Grand Live com "grande sucesso" (大成功).',
      'Nova mecânica de LESSONS (aulas de música) para subir o Hype Level (ライブ期待度) de cada show.',
      'Tokens de performance: Dance, Passion, Vocal, Visual e Mental (cap inicial 200) — obtidos nos treinos junto com stats.',
      'Herança ESPECIAL: fatores azuis dão UNCAPS de status no início da run (★1=+4, ★2=+9, ★3=+16 por fator; máx. +48 com pai 9★) e eventos de inspiração com fatores verdes também dão uncaps (baseados no growth do dono da skill).',
      'Corridas existem, mas com papel reduzido; objetivos tradicionais substituídos pelos shows.',
    ],
    factor: factorLine(3),
    caps: 'Caps de status: Speed 1600 · Stamina 1300 · Power 1300 · Guts 1500 · Wit 1300.',
    tips: [
      'Caps assimétricos (Speed 1600 / Guts 1500) mudam as metas de status em relação aos outros cenários.',
      'Fatores azuis 9★ valem muito mais aqui (uncaps iniciais).',
    ],
  },
};

// stats iniciais por cenário (dados da gametora)
function statsLine(id) {
  const s = sById.get(id);
  if (!s) return null;
  const [sp, st, pw, gu, wi] = s.stats;
  return `Stats iniciais da carreira (dados da gametora): Speed ${sp} · Stamina ${st} · Power ${pw} · Guts ${gu} · Wit ${wi}`;
}

const header = [
  '================================================================================',
  'BANCO DE DADOS DE CENÁRIOS DE TREINO — UMA MUSUME: PRETTY DERBY (servidor Global)',
  'Fontes: gametora (dados de cenários + artigos oficiais URA Finale / Unity Cup /',
  'Trackblazer / Grand Live, atualizados em 07/2026) e uma.guide. Extraído em 21/08/2026.',
  '',
  'Os 4 cenários permanentes disponíveis no servidor Global (em ordem de lançamento):',
  '  1) URA Finale · 2) Unity Cup (Aoharu Hai) · 3) Trackblazer (MANT) · 4) Grand Live.',
  '',
  'CONVENÇÕES:',
  '- "Caps de status": limite que o treino pode atingir por atributo no cenário.',
  '- "Spark do cenário": fator branco ganho no fim da carreira (chance), efeito em',
  '  eventos de inspiração (★1/★2/★3 → +10/+20/+30 de cada atributo, salvo indicação).',
  '- "Personagens-link": personagens cujas support cards têm eventos fortalecidos no',
  '  cenário (bônus de scenario link).',
  '- Stats iniciais conforme os dados estruturados da gametora (podem variar com',
  '  atualizações; confira no jogo antes de planejar metas exatas).',
  '================================================================================',
  '',
  '',
];

const out = [header.join('\n')];
for (const o of ORDER) {
  const c = content[o.id];
  out.push('══════════════════════════════════════════════');
  out.push(`${c.title}`);
  out.push('══════════════════════════════════════════════');
  out.push('');
  out.push(c.extra);
  out.push(c.release);
  if (c.update && c.update !== '—') out.push(c.update);
  out.push(c.links);
  const st = statsLine(o.id);
  if (st) out.push(st);
  out.push('');
  out.push('Mecânica central:');
  for (const m of c.mechanics) out.push(`  - ${m}`);
  out.push('');
  out.push(c.factor);
  out.push(c.caps);
  out.push('');
  out.push('Dicas:');
  for (const t of c.tips) out.push(`  - ${t}`);
  out.push('');
  out.push('');
}

// tabela comparativa
out.push('══════════════════════════════════════════════');
out.push('TABELA COMPARATIVA');
out.push('══════════════════════════════════════════════');
out.push('');
out.push('Cenário        | Global      | JP          | Fator (spark)      | Caps destacados');
out.push('───────────────┼─────────────┼─────────────┼─────────────────────┼────────────────');
out.push('URA Finale     | 26/06/2025  | 24/02/2021  | Speed + Stamina     | 1400 em tudo');
out.push('Unity Cup      | 06/11/2025  | 30/08/2021  | Power + Wit         | Wit 1800');
out.push('Trackblazer    | 12/03/2026  | 24/02/2022  | Stamina + Guts      | 1200 em tudo (Global)');
out.push('Grand Live     | 22/07/2026  | 24/08/2022  | Speed + Guts        | Speed 1600, Guts 1500');
out.push('');
out.push('Notas de analista:');
out.push('  - O spark do Trackblazer aparece nos dados da gametora como "TS Climax Scenario"');
out.push('    (Climax) — é o fator do cenário MANT (Stamina + Guts).');
out.push('  - Caps do Trackblazer no Global ainda são os clássicos 1200 (os caps elevados do');
out.push('    JP vêm em atualização futura, segundo o artigo da gametora).');
out.push('  - URA e Unity Cup compartilham a estrutura de objetivos por personagem;');
out.push('    Trackblazer usa Grade Points e Grand Live usa os Promotional Lives.');
out.push('  - Skills "Ignited" (Ignited/Burning Spirit SPD/STA/PWR/GUTS/WIT) vêm dos Spirit');
out.push('    Bursts da Unity Cup — ver arquivo de skills (IDs 210xxx).');

fs.writeFileSync('/home/user/UMA - cenarios de treino.txt', out.join('\n'));
console.log('OK — cenários:', ORDER.length, '| tamanho:', (out.join('\n').length / 1024).toFixed(1), 'KB');
