const fs = require('fs');
const d = require('/home/user/uma_data/dump.json');

// ---------- Overrides do site (Zr em app.js): mescla campos por ID ----------
function applyOverrides(base, overrides, key, appendNew) {
  if (!overrides || !overrides.length) return base;
  const map = new Map();
  for (const o of overrides) if (o[key] !== undefined) map.set(o[key], o);
  const out = [];
  for (const c of base) {
    const m = map.get(c[key]);
    if (m) {
      map.delete(c[key]);
      if (m._remove) continue;
      const { _remove, ...fields } = m;
      out.push({ ...c, ...fields });
    } else out.push(c);
  }
  if (appendNew) {
    for (const v of map.values()) {
      if (v._remove) continue;
      const { _remove, ...f } = v;
      out.push(f);
    }
  }
  return out;
}
const chars = applyOverrides(d.c, d.d.characters, 'cardId', false);
const skills = applyOverrides(d.s, d.d.skills, 'skillId', true);
const skMap = new Map(skills.map(s => [s.skillId, s]));

// ---------- Site display pipeline (replica of uma.guide's Jd/L0 + lf/HP/Pv/GP) ----------
const i4 = {
  Type6: 'Runaway', Type8: 'Increase FOV', Type10: 'Improve Start Reaction Time',
  Type13: 'Increase Rush Time', Type14: 'Increase Start Delay', Type21: 'Decrease Current Speed',
  Type22: 'Increase Current Speed', Type28: 'Increase Lane Movement Speed', Type29: 'Increased Rush Chance',
  Type32: 'All Stats Increase', Type35: 'Change Lane', Type37: 'Use Random Gold Skills',
  Type38: 'Debuff Immunity', Type41: 'Force Activation', Type42: 'Conditional Increase Duration',
  Type501: 'Type501', Type502: 'Type502', Type503: 'Type503',
};
function O0(n, e) {
  if (n === 'Stamina Recovery') { const r = e >= 0 ? '+' : ''; const i = (e * 100).toFixed(1).replace(/\.0$/, ''); return `HP Recovery ${r}${i}%`; }
  if (n === 'Change Lane') return `Change Lane (${e})`;
  if (n === 'Runaway') return 'Runaway';
  if (n === 'Debuff Immunity') return 'Debuff Immunity';
  if (n === 'Use Random Gold Skills') return 'Use Random Gold Skills';
  if (n === 'Force Activation') return 'Force Activation';
  if (n === 'Conditional Increase Duration') return 'Conditional Increase Duration';
  const a = e >= 0 ? '+' : '';
  return `${n} ${a}${e}`;
}
function L0(eff) {
  const e = i4[eff.type];
  if (e) return { ...eff, type: e, displayText: O0(e, eff.value) };
  if (eff.type === 'Stamina Recovery') return { ...eff, displayText: O0(eff.type, eff.value) };
  return eff;
}
function Jd(skill) {
  return { ...skill, effects: (skill.effects || []).map(L0), effects2: (skill.effects2 || []).map(L0) };
}
function Pv(n) { return (n * 100).toFixed(1).replace(/\.0$/, ''); }
function isNonDebuff(s) { return !!(s.skillCategory && s.skillCategory !== 'Debuff' || typeof s.gradeValue === 'number' && s.gradeValue < 0); }
function HPline(text, nonDebuff) {
  return text.replace(/Stamina Recovery\s+(\+-|[+-])?(\d+(?:\.\d+)?)/g, (a, r, i) => {
    const l = Number(i), u = r === '-' || r === '+-';
    return `${u && !nonDebuff ? 'Enemy HP' : 'HP Recovery'} ${u ? '-' : '+'}${Pv(l)}%`;
  });
}
function siteEffectLines(skill) {
  skill = Jd(skill);
  const e = [], a = isNonDebuff(skill);
  if (skill.effectSummary) {
    let r = skill.effectSummary;
    r = r.replace(/Intelligence/g, 'Wit');
    r = HPline(r, a);
    r = r.replace(/\+-/g, '-');
    for (const i of r.split('|')) { const l = i.trim(); if (l) e.push(l); }
  }
  if (skill.effects && skill.effects.length > 0) {
    for (const r of skill.effects) {
      if (r.type === 'Increase FOV' && r.value > 0) e.push(`FOV +${r.value}`);
      else if (r.type === 'Increase FOV' && r.value < 0) e.push(`Enemy FOV ${r.value}`);
      else if (r.type === 'Increase Lane Movement Speed' && r.value > 0) e.push(`Lane Movement +${(r.value * 100).toFixed(1)}%`);
      else if (r.type === 'Decrease Current Speed' && r.value < 0) { const i = a ? 'Current Speed' : 'Enemy Speed'; e.push(`${i} ${r.value}`); }
      else if (r.type === 'Increase Current Speed' && r.value > 0) e.push(`Current Speed +${r.value}`);
      else if (r.type === 'Increase Rush Time') e.push(`Rush Cooldown +${r.value}`);
      else if (r.type === 'Increased Rush Chance') { const i = r.value > 0 ? '+' : ''; e.push(`Rushed Chance ${i}${r.value}`); }
      else if (r.type === 'All Stats Increase') { const i = r.value > 0 ? '+' : ''; e.push(`All Stats ${i}${r.value}`); }
      else if (r.type === 'Stamina Recovery' && !skill.effectSummary) {
        const i = r.value >= 0 ? '+' : '-', l = r.value < 0 && !a ? 'Enemy HP' : 'HP Recovery';
        e.push(`${l} ${i}${Pv(Math.abs(r.value))}%`);
      }
    }
  }
  return e;
}
// Convert site decimals to the user's % convention for velocity/accel-type effects
function toUserPct(line) {
  return line.replace(/^(Target Speed|Acceleration|Current Speed|Enemy Speed)\s+([+-])?(\d+(?:\.\d+)?)$/, (m, name, sign, val) => {
    const s = sign === '-' ? '-' : '+';
    return `${name} ${s}${Pv(Number(val))}%`;
  });
}
function effectString(skill) {
  return siteEffectLines(skill).map(toUserPct).join(', ');
}

// ---------- Conditions ----------
function mergeCond(cond, pre) {
  const out = [];
  const seen = new Set();
  for (const part of [cond, pre]) {
    if (!part) continue;
    for (const clause of part.split('&')) {
      const t = clause.trim();
      if (t && !seen.has(t)) { seen.add(t); out.push(t); }
    }
  }
  return out;
}
function condBlock(skill, alt = false) {
  const cond = alt ? skill.activationCondition2 : skill.activationCondition;
  const pre = alt ? skill.precondition2 : skill.precondition;
  const blocks = [];
  const parts = mergeCond(cond, pre);
  // mergeCond loses @ structure; rebuild from raw
  const raw = [];
  if (cond) raw.push(cond);
  if (pre) raw.push(pre);
  const joined = raw.join('&');
  const orBlocks = joined.split('@').map(b => b.split('&').map(x => x.trim()).filter(Boolean));
  // dedupe within each block only
  const seen = new Set();
  const result = [];
  for (const b of orBlocks) {
    const lines = [];
    for (const clause of b) if (!seen.has(clause)) { seen.add(clause); lines.push(clause); }
    if (lines.length) result.push(lines.join('\n'));
  }
  if (!result.length) return ['Nenhuma condição (ativa automaticamente)'];
  return result;
}
function condText(skill) {
  const main = condBlock(skill, false).join('\n--- OU ---\n');
  let out = main;
  if (skill.activationCondition2) {
    out += '\n\nCondição alternativa:\n' + condBlock(skill, true).join('\n--- OU ---\n');
  }
  return out;
}

// ---------- Skills ----------
function skillName(id) {
  const s = skMap.get(id);
  return s ? s.skillName : `[skill não encontrada: ${id}]`;
}
function skillsOf(entry) {
  const pot = entry.potentialSkills || [];
  const innate = pot.filter(p => p.needRank === 0).map(p => skillName(p.skillId));
  const potential = pot.filter(p => p.needRank > 0).sort((a, b) => a.needRank - b.needRank)
    .map(p => `${skillName(p.skillId)} (Nv.${p.needRank})`);
  return { innate, potential };
}
// Regra do site (app.js c4/Di): em skins alternativas, a skill única BASE do personagem
// (100001 + (charaId-1000)*10) é excluída da seção UNIQUE SKILL da página.
function baseUniqueId(charaId, cardId) {
  return cardId % 100 <= 1 ? null : 100001 + (charaId - 1000) * 10;
}
function displayedUniques(entry) {
  const ids = entry.skillIds.split(',').map(Number);
  const pot = new Set((entry.potentialSkills || []).map(p => p.skillId));
  const ex = baseUniqueId(entry.charaId, entry.cardId);
  return ids
    .filter(id => !pot.has(id) && id !== ex)
    .map(id => skMap.get(id))
    .filter(s => s && s.skillCategory === 'Unique');
}

// Correções semânticas de exibição (efeitos dinâmicos que a linha plana do site omite)
const EFFECT_OVERRIDES = {
  // Copano Rickey: bônus por skill verde (dados de escala oficial: specialScaling do site)
  100981: 'Target Speed +25% (base) e Acceleration +0% (base); bônus por skills verdes ativadas: +5% Target Speed e +5% Acceleration a cada 2 skills verdes (máx. +15%/+15% com 6 skills verdes)',
  // Winning Ticket [Dream Deliverer]: o +5% é POR skill ativada (até 3x)
  110351: 'Target Speed +25% (base) + +5% Target Speed por skill ativada (até 3x; máx. +15%)',
  // Bamboo Memory [Iron Ambition]: efeito E duração aumentam por ultrapassagem (até 3x)
  100531: 'Acceleration +10% (base) + +10% Acceleration e duração aumentada por adversário ultrapassado (até 3x)',
};
const NOTE_OVERRIDES = {
  // Mejiro Bright [Brunissage Line]: duração real escala com a HP restante (breakpoints oficiais)
  100741: 'Atenção: a duração real varia com a HP restante (breakpoints oficiais): 5s (0 HP) → 7,5s (2000) → 10s (2400) → 11s (2600) → 12,5s (2800) → 15s (3000) → 17,5s (3200) → 20s (3500).',
  // Mejiro McQueen [Fair Lady of the Waves]: long spurt baseado na stamina restante
  120131: 'Atenção: segundo a descrição oficial, é um "long spurt" cuja duração aumenta conforme a stamina (HP) restante.',
  // Haru Urara [New Year ♪ New Urara!]: duração proporcional à distância até o líder
  110521: 'Atenção: segundo a descrição oficial, a duração é proporcional à distância até o líder (quanto mais longe, maior a duração).',
  // Gold Ship [RUN! RUIN! LAUNCHER!]: efeito oculto não exibido pelo site
  110071: 'Atenção: além do efeito listado, a skill ativa 2 skills raras (douradas) aleatórias do personagem, ignorando as condições delas.',
};

// ---------- Entry builder ----------
function uniqueBlock(uni, prefix) {
  const dur = uni.duration;
  let effect = EFFECT_OVERRIDES[uni.skillId] || effectString(uni);
  let durText;
  if (dur < 0) durText = 'contínua (skill passiva)';
  else if (Number.isInteger(dur)) durText = `${dur} segundos`;
  else durText = `${dur} segundos`;
  if (uni.activationCondition2) {
    const fake2 = { skillCategory: uni.skillCategory, gradeValue: uni.gradeValue, effectSummary: uni.effectSummary2, effects: uni.effects2 };
    const eff2 = effectString(fake2);
    if (eff2) {
      effect += `\nEfeito alternativo: ${eff2}`;
      if (uni.duration2 > 0) effect += `\nDuração alternativa: ${Number.isInteger(uni.duration2) ? uni.duration2 : uni.duration2} segundos`;
    }
  }
  const L = [];
  L.push(`${prefix} - ${uni.skillName}`);
  L.push(`Efeito da skill única: ${effect}`);
  L.push(`Duração base: ${durText}`);
  L.push('Requisitos de ativação:');
  L.push(condText(uni));
  return L.join('\n');
}

function buildEntry(entry, notes = '') {
  const { innate, potential } = skillsOf(entry);
  let uniques = displayedUniques(entry);
  if (!uniques.length) uniques = [skMap.get(Number(entry.skillIds.split(',')[0]))].filter(Boolean);
  const L = [];
  L.push(`Personagem: ${entry.charaName} [${entry.cardTitle.replace(/^\[|\]$/g, '')}]`);
  L.push('');
  L.push('');
  L.push('Aptidões de superfície:');
  L.push(`Turf - ${entry.aptitudeTurf}`);
  L.push(`Dirt - ${entry.aptitudeDirt}`);
  L.push('');
  L.push('');
  L.push('Aptidões de distância:');
  L.push(`Sprint - ${entry.aptitudeShort}`);
  L.push(`Mile - ${entry.aptitudeMile}`);
  L.push(`Medium - ${entry.aptitudeMiddle}`);
  L.push(`Long - ${entry.aptitudeLong}`);
  L.push('');
  L.push('');
  L.push('Aptidões de estratégia:');
  L.push(`Front Runner - ${entry.aptitudeRunner}`);
  L.push(`Pace Chaser - ${entry.aptitudeLeader}`);
  L.push(`Late Surger - ${entry.aptitudeBetweener}`);
  L.push(`End Closer - ${entry.aptitudeChaser}`);
  L.push('');
  L.push('');
  L.push('Fator crescimento:');
  L.push(`${entry.talentSpeed}% Speed`);
  L.push(`${entry.talentStamina}% Stamina`);
  L.push(`${entry.talentPower}% Power`);
  L.push(`${entry.talentGuts}% Guts`);
  L.push(`${entry.talentWisdom}% Wit`);
  L.push('');
  L.push('');
  L.push(uniqueBlock(uniques[0], 'Skill única'));
  for (const extra of uniques.slice(1)) {
    L.push('');
    L.push('');
    L.push(uniqueBlock(extra, 'Skill única adicional'));
  }
  L.push('');
  L.push('');
  L.push(`Skills inatas: ${innate.join(', ')}`);
  L.push(`Skills potenciais: ${potential.join(', ')}`);
  L.push('');
  L.push('');
  const extraNotes = NOTE_OVERRIDES[uniques[0].skillId];
  L.push(`Notas: ${notes}${extraNotes ? (notes ? ' ' + extraNotes : extraNotes) : ''}`);
  return L.join('\n');
}

// ---------- Order ----------
const byCard = new Map(chars.map(c => [c.cardId, c]));
const get = cardId => byCard.get(cardId);
if (!get) throw new Error('no map');

// 8 iconic characters placed in the original placeholder slots
const iconic = [
  100101, // Special Week [Special Dreamer]
  100201, // Silence Suzuka [Innocent Silence]
  100301, // Tokai Teio [Peak Joy]
  101301, // Mejiro McQueen [Frontline Elegance]
  100701, // Gold Ship [Red Strife]
  100601, // Oguri Cap [Starlight Beat]
  100901, // Daiwa Scarlet [Peak Blue]
  100801, // Vodka [Wild Top Gear]
];

// Slots order: placeholder1, KingHalo, NiceNature, Matikane, HaruUrara, Bakushin, WinningTicket, AgnesTachyon, placeholders 2-8, then the rest
const userOrder = [
  { cardId: iconic[0], notes: '' },
  { cardId: 106101, notes: 'temptation também é conhecido como rushed.', fixed: true },
  { cardId: 106001, notes: 'bashin_diff_behind significa que tem um personagem a menos de 1 corpo (1L) de distância atrás dele.', fixed: true },
  { cardId: 105601, notes: '', fixed: true },
  { cardId: 105201, notes: 'near_count verifica se tem um personagem por perto. Creio que seja em um raio de 1 corpo (1L).', fixed: true },
  { cardId: 104101, notes: '', fixed: true },
  { cardId: 103501, notes: '', fixed: true },
  { cardId: 103201, notes: '' }, // Agnes Tachyon [tach-nology]
  ...iconic.slice(1).map(cardId => ({ cardId, notes: '' })),
];

const placed = new Set(userOrder.map(o => o.cardId));
const rest = chars.filter(c => !placed.has(c.cardId));

const header = [
  '================================================================================',
  'BANCO DE DADOS — UMA MUSUME: PRETTY DERBY (versão Global)',
  'Fonte: uma.guide/characters — dados extraídos e conferidos em 20/08/2026 (revisão v2)',
  'Cobertura: 99 cartas listadas no site (64 personagens únicos; personagens com',
  'múltiplas skins aparecem uma vez por skin, pois aptidões/fator/skills variam por skin).',
  'Inclui a camada de overrides oficial do site e correções de skills únicas de skins alternativas.',
  '',
  'CONVENÇÕES DESTE ARQUIVO:',
  '- Aptidões: G < F < E < D < C < B < A < S (G é a pior, S a melhor).',
  '- Efeitos de velocidade/aceleração convertidos de m/s² para % (ex.: Target Speed +0.45 = +45%).',
  '- Efeitos dinâmicos (acúmulo por skill passiva, duração por stamina) são descritos por extenso,',
  '  pois a exibição plana do site esconde essa informação (ver relatório de revisão).',
  '- Skills inatas: skills nativas da skin. Skills potenciais: desbloqueiam por nível de potencial (Nv.).',
  '- Requisitos de ativação: condições do banco de dados (cada linha = uma condição; todas devem valer).',
  '  "--- OU ---" separa blocos alternativos de ativação. "Condição alternativa:" = 2ª variante da skill.',
  '- Glossário completo das condições: ver arquivo RELATORIO - revisao e correcoes.md.',
  '================================================================================',
  '',
  '',
];

const sections = [];
for (const o of userOrder) {
  const entry = get(o.cardId);
  sections.push(buildEntry(entry, o.notes));
}
for (const c of rest) {
  sections.push(buildEntry(c, ''));
}

const out = header.join('\n') + sections.join('\n\n\n\n\n') + '\n';
fs.writeFileSync('/home/user/UMA - dados gerais (completo).txt', out);
console.log('OK - entries:', userOrder.length + rest.length);
console.log('size:', (out.length / 1024).toFixed(1), 'KB');

// warnings
const warns = [];
for (const c of chars) {
  const ids = c.skillIds.split(',').map(Number);
  for (const id of ids) if (!skMap.has(id)) warns.push(`${c.charaName} ${c.cardTitle}: skill ${id} ausente`);
  const pot = new Set((c.potentialSkills || []).map(p => p.skillId));
  const ex = baseUniqueId(c.charaId, c.cardId);
  const leftover = ids.filter(id => !pot.has(id) && id !== ex).map(id => skMap.get(id)).filter(s => s && s.skillCategory !== 'Unique');
  if (leftover.length) warns.push(`${c.charaName} ${c.cardTitle}: ids fora do padrão único/inato/potencial: ${leftover.map(s => s.skillName).join(', ')}`);
}
console.log('warnings:', warns.length); warns.forEach(w => console.log('  ', w));

// durations seen
const durs = new Set();
chars.forEach(c => { const u = skMap.get(Number(c.skillIds.split(',')[0])); if (u) durs.add(u.duration); });
console.log('durations:', [...durs].sort((a,b)=>a-b).join(', '));
