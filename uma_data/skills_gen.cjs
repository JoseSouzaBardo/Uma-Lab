// Gera "UMA - skills (completo).txt" a partir dos dados do uma.guide (versão Global).
// Replica o pipeline de exibição do site (Jd/L0/lf/HP/Pv) + overrides oficiais.
const fs = require('fs');
const d = require('/home/user/uma_data/dump.json');

// ---------- Overrides do site (Zr em app.js) ----------
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
let skills = applyOverrides(d.s, d.d.skills, 'skillId', true);

// ---------- Mesclagem: skills únicas duplicadas → versão fraca (9xxxxx) ----------
// A versão fraca (ID = forte + 800000) é a versão herdável do jogo. Conforme
// solicitado, as entradas fortes passam a exibir efeito + duração (e descrição,
// efeito alternativo e escala, quando existirem) da versão fraca, e as entradas
// duplicadas 9xxxxx são removidas — uma entrada por skill.
  {
    const byId = new Map(skills.map(s => [s.skillId, s]));
    const merged = [];
    for (const s of skills) {
      if (String(s.skillId).startsWith('9') && s.skillId < 1000000) continue; // fraca removida (mesclada no par forte)
      const weak = byId.get(s.skillId + 800000);
      if (s.skillCategory === 'Unique') {
        if (!weak) continue; // skill única SEM versão fraca → removida (revisão v4)
        merged.push({
          ...s,
          effects: weak.effects, effectSummary: weak.effectSummary,
          effects2: weak.effects2, effectSummary2: weak.effectSummary2,
          duration: weak.duration, duration2: weak.duration2,
          activationCondition2: weak.activationCondition2, precondition2: weak.precondition2,
          specialScaling: weak.specialScaling,
          skillDesc: weak.skillDesc,
        });
      } else {
        merged.push(s);
      }
    }
    skills = merged;
  }

// ---------- Pipeline de exibição do site ----------
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
function Jd(skill) { return { ...skill, effects: (skill.effects || []).map(L0), effects2: (skill.effects2 || []).map(L0) }; }
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
function toUserPct(line) {
  return line.replace(/^(Target Speed|Acceleration|Current Speed|Enemy Speed)\s+([+-])?(\d+(?:\.\d+)?)$/, (m, name, sign, val) => {
    const s = sign === '-' ? '-' : '+';
    return `${name} ${s}${Pv(Number(val))}%`;
  });
}
function effectString(skill) {
  return siteEffectLines(skill).map(toUserPct).join(' · ');
}

// ---------- Condições (od() do site: @ → OR, & → linhas) ----------
function condLines(cond) {
  if (!cond) return [];
  return cond.split('@').map(b => b.split('&').map(x => x.trim()).filter(Boolean).join('\n')).filter(Boolean);
}
function condText(skill) {
  const parts = [];
  if (skill.precondition) parts.push(...condLines(skill.precondition).map(b => 'Pré-condição:\n' + b));
  const main = condLines(skill.activationCondition);
  if (main.length) parts.push('Condições de ativação:\n' + main.join('\n--- OU ---\n'));
  else if (!skill.precondition) parts.push('Condições de ativação:\nNenhuma condição (ativa automaticamente)');
  if (skill.activationCondition2) parts.push('Condição alternativa:\n' + condLines(skill.activationCondition2).join('\n--- OU ---\n'));
  return parts.join('\n\n');
}

// ---------- Escala dinâmica (specialScaling) ----------
const FIELD_FMT = {
  'Target Speed': v => `${v * 100}%`,
  'Acceleration': v => `${v * 100}%`,
  'Lane Movement (%)': v => `${v}%`,
  'HP Recovery (%)': v => `${v}%`,
  'FOV': v => `${v}`,
  'duration': v => `${v}s`,
};
function fmtField(field, value) {
  const f = FIELD_FMT[field] || (v => `${v}`);
  return f(value);
}
function scalingText(sc) {
  if (!sc) return [];
  const out = [];
  if (sc.type === 'distribution') {
    const parts = (sc.entries || []).map(e => `${e.chance}% de chance → ${e.value}${sc.unit === '%' ? '%' : ' ' + (sc.unit || '')}`.trim());
    out.push(`Escala dinâmica (${sc.label}): ${parts.join(' · ')}`);
    return out;
  }
  out.push('Escala dinâmica:');
  for (const o of sc.outputs || []) {
    const fields = o.field.split(', ');
    const bps = (o.breakpoints || []).map(b => {
      const vals = Array.isArray(b.value) ? b.value : [b.value];
      return `${b.at} → ${vals.map((v, i) => fmtField(fields[i], v)).join(' / ')}`;
    });
    out.push(`  ${sc.label} → ${o.field}: ${bps.join(' · ')}`);
  }
  return out;
}

// ---------- Variantes (mesma condição) ----------
function variantKey(s) { return `${s.tagId}|${s.activationCondition}|${s.precondition}|${s.cooldownTime}`; }
const vGroups = new Map();
for (const s of skills) {
  const k = s.skillCategory === 'Unique' ? 'U|' + s.skillName + '|' + variantKey(s) : 'N|' + variantKey(s);
  if (!vGroups.has(k)) vGroups.set(k, []);
  vGroups.get(k).push(s);
}
function rarityLabel(s) {
  return s.rarity === 1 ? 'White' : s.rarity === 2 ? 'Gold' : 'Unique';
}
function variantsOf(s) {
  const k = s.skillCategory === 'Unique' ? 'U|' + s.skillName + '|' + variantKey(s) : 'N|' + variantKey(s);
  const g = vGroups.get(k) || [];
  return g.filter(x => x.skillId !== s.skillId).sort((a, b) => b.rarity - a.rarity)
    .map(x => `${x.skillName} (${x.skillId}, ${rarityLabel(x)})`);
}

// ---------- Fontes ----------
const charSources = new Map();
for (const c of d.c) {
  if (!c.skillIds) continue;
  for (const id of c.skillIds.split(',').map(Number)) {
    if (!charSources.has(id)) charSources.set(id, []);
    charSources.get(id).push(`${c.charaName} [${c.cardTitle.replace(/^\[|\]$/g, '')}]`);
  }
}
const suppById = new Map((d.b || []).map(s => [s.supportCardId, s]));

// ---------- Seções ----------
const SECTION_ORDER = ['Unique', 'Passive', 'Speed Boost', 'Acceleration', 'Recovery', 'Lane Effect', 'Vision', 'Debuff'];
const SECTION_TITLES = {
  Unique: 'SKILLS ÚNICAS',
  Passive: 'SKILLS PASSIVAS',
  'Speed Boost': 'SPEED BOOST',
  Acceleration: 'ACCELERATION',
  Recovery: 'RECOVERY',
  'Lane Effect': 'LANE EFFECT',
  Vision: 'VISION',
  Debuff: 'DEBUFF',
};

function buildEntry(s) {
  const L = [];
  L.push('──────────────────────────────────────────────');
  L.push(`Nome: ${s.skillName}`);
  const meta = [`ID: ${s.skillId}`, `Categoria: ${s.skillCategory}`, `Raridade: ${rarityLabel(s)}`];
  if (s.gradeValue !== undefined && s.gradeValue !== null) meta.push(`Grau: ${s.gradeValue}`);
  if (s.needSkillPoint) meta.push(`Custo: ${s.needSkillPoint} sp`);
  L.push(meta.join(' | '));
  const eff = effectString(s);
  if (eff) L.push(`Efeito: ${eff}`);
  if (s.activationCondition2 && s.effects2 && s.effects2.length) {
    const fake2 = { skillCategory: s.skillCategory, gradeValue: s.gradeValue, effectSummary: s.effectSummary2, effects: s.effects2 };
    const eff2 = effectString(fake2);
    if (eff2) L.push(`Efeito alternativo: ${eff2}`);
  }
  if (s.duration > 0) L.push(`Duração base: ${s.duration}s`);
  if (s.duration2 > 0) L.push(`Duração alternativa: ${s.duration2}s`);
  if (s.cooldownTime > 0 && s.cooldownTime < 500) L.push(`Cooldown: ${s.cooldownTime}s`);
  const sc = scalingText(s.specialScaling);
  if (sc.length) L.push(...sc);
  L.push(condText(s));
  if (s.skillDesc) L.push(`Descrição: ${s.skillDesc}`);
  const vars = variantsOf(s);
  if (vars.length) L.push(`Variantes (mesma condição): ${vars.join(' · ')}`);
  const src = [];
  const ch = charSources.get(s.skillId);
  if (ch) src.push('Personagens: ' + [...new Set(ch)].join(', '));
  const sids = (s.supportCardIds || '').split(',').map(x => Number(x.trim())).filter(Boolean);
  if (sids.length) {
    const names = sids.map(id => { const c = suppById.get(id); return c ? `${c.supportCardTitle} (${c.charaName})` : `#${id}`; });
    src.push('Support cards: ' + names.join(', '));
  }
  if (src.length) L.push('Fontes:');
  src.forEach(x => L.push('  ' + x));
  return L.join('\n');
}

// ---------- Montagem ----------
const header = [
  '================================================================================',
  'BANCO DE DADOS DE SKILLS — UMA MUSUME: PRETTY DERBY (versão Global)',
  'Fonte: https://uma.guide/skills/ — dados extraídos e conferidos em 20/08/2026 (revisão v4)',
  `Cobertura: ${skills.length} skills da listagem do site. Skills únicas que possuem`,
  'uma segunda versão mais fraca (a versão herdável, ID 9xxxxx) foram MESCLADAS:',
  'uma única entrada por skill, exibindo efeito e duração da versão fraca.',
  'As 20 skills únicas SEM versão fraca foram REMOVIDAS do arquivo.',
  '',
  'ORGANIZAÇÃO:',
  '- O site exibe as skills como uma lista única (ordenada por ID) com filtro por tipo.',
  '  Aqui elas estão agrupadas por CATEGORIA (o "tipo" do filtro do site), mantendo a',
  '  ordem interna da listagem do site (ID crescente). Ao final, há um índice alfabético.',
  '- Skills evoluídas (evolutions) NÃO fazem parte da listagem do site — só aparecem nas',
  '  páginas de personagem, por isso ficaram de fora.',
  '- Skills únicas com versão fraca: os valores exibidos (efeito, duração e descrição)',
  '  são os da versão fraca/herdável. A versão forte não aparece mais no arquivo.',
  '  (O arquivo de personagens continua mostrando o efeito forte, correto para o dono.)',
  '',
  'CONVENÇÕES:',
  '- Raridade: White (comum) | Gold (dourada) | Unique (única). "Grau" é o gradeValue',
  '  interno (usado no custo de Room Match/CM).',
  '- Efeitos de velocidade/aceleração convertidos de m/s² para % (valor × 100):',
  '  ex.: Target Speed +0.15 = +15%. Stats passivos (Speed +40) são pontos, não %.',
  '- "·" separa múltiplos efeitos (como no site). Duração em segundos; durações ≤ 0 não',
  '  são exibidas (efeito instantâneo/passiva), como no site.',
  '- Cooldown: o site só exibe quando < 500 (500 = cooldown interno "1x por corrida").',
  '- Condições: cada linha = uma condição; todas devem valer simultaneamente.',
  '  "--- OU ---" separa blocos alternativos. "Pré-condição" e "Condição alternativa"',
  '  são campos separados do banco de dados, como no site.',
  '- "Escala dinâmica": tabela de escala oficial do site para skills com efeito variável.',
  '- "Variantes (mesma condição)": skills que compartilham a mesma condição de ativação',
  '  (pares dourada/branca), como o modal "Variants" do site.',
  '- "Fontes": personagens e support cards que oferecem a skill.',
  '- IDs servem para cruzar com o arquivo de personagens (UMA - dados gerais (completo).txt).',
  '================================================================================',
  '',
  '',
];

const out = [header.join('\n')];
for (const cat of SECTION_ORDER) {
  const list = skills.filter(s => s.skillCategory === cat);
  out.push('══════════════════════════════════════════════');
  out.push(`${SECTION_TITLES[cat]} (${list.length})`);
  out.push('══════════════════════════════════════════════');
  out.push('');
  for (const s of list) { out.push(buildEntry(s)); out.push(''); out.push(''); }
}
const others = skills.filter(s => !SECTION_ORDER.includes(s.skillCategory));
if (others.length) {
  out.push('══════════════════════════════════════════════');
  out.push(`OUTRAS CATEGORIAS (${others.length})`);
  out.push('══════════════════════════════════════════════');
  out.push('');
  for (const s of others) { out.push(buildEntry(s)); out.push(''); out.push(''); }
}

// Índice alfabético
out.push('══════════════════════════════════════════════');
out.push('ÍNDICE ALFABÉTICO');
out.push('══════════════════════════════════════════════');
out.push('');
const sorted = [...skills].sort((a, b) => a.skillName.localeCompare(b.skillName, 'en'));
for (const s of sorted) out.push(`${s.skillName} — ${s.skillId} (${s.skillCategory})`);

fs.writeFileSync('/home/user/UMA - skills (completo).txt', out.join('\n'));
console.log('OK — skills:', skills.length, '| tamanho:', (out.join('\n').length / 1024).toFixed(1), 'KB');
