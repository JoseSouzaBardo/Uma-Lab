// Gera "UMA - support cards (completo).txt" a partir do dump.json (uma.guide, versão Global)
const fs = require('fs');
const d = require('/home/user/uma_data/dump.json');

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
  if (appendNew) for (const v of map.values()) { if (v._remove) continue; const { _remove, ...f } = v; out.push(f); }
  return out;
}
const sup = applyOverrides(d.b, (d.d.supportCards || []), 'supportCardId', false);

const LEVELS = [1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
const fieldOf = n => (n === 1 ? 'initValue' : `level${n}Value`);
const RAR = { 1: 'R', 2: 'SR', 3: 'SSR' };

// nomes de efeito (do próprio dump, com apelido oficial do site)
const EFFECT_NAMES = new Map();
for (const s of d.b) for (const e of (s.effects || [])) if (e.effectTypeName) EFFECT_NAMES.set(e.effectType, e.effectTypeName);
EFFECT_NAMES.set(30, 'SP Bonus'); // site usa "SP Bonus" (dump: Skill Point Bonus)

// ---- efeito no NÍVEL MÁXIMO (Nv 50): último valor definido ----
function effectMax(e) {
  let last = null;
  for (const lv of LEVELS) {
    const v = e[fieldOf(lv)];
    if (v !== undefined && v !== null && v !== -1) last = v;
  }
  return last;
}
function effectLine(e) {
  const v = effectMax(e);
  return `${e.effectTypeName}: ${v === null ? '-' : v}`;
}

// ---- efeito único (SSR), ativo no nível máximo ----
function uniqueParts(u) {
  // retorna [{type, value, name}] dos componentes do efeito único
  if (!u) return [];
  if (u.type0 === 101) {
    const parts = [];
    const n1 = EFFECT_NAMES.get(u.value01) || `Efeito ${u.value01}`;
    parts.push({ type: u.value01, name: n1, value: u.value02 });
    if (u.value03) {
      const n2 = EFFECT_NAMES.get(u.value03) || `Efeito ${u.value03}`;
      parts.push({ type: u.value03, name: n2, value: u.value04 });
    }
    return parts;
  }
  const parts = [];
  for (let i = 0; i <= 1; i++) {
    const t = u[`type${i}`], n = u[`type${i}Name`], v = u[`value${i}`];
    if (t && t !== 0 && t !== 999 && n && n !== 'None') parts.push({ type: t, name: n, value: v });
  }
  return parts;
}
function uniqueLine(u) {
  if (!u) return null;
  const parts = uniqueParts(u);
  if (!parts.length) return null;
  if (u.type0 === 101) return `At Bond ${u.value0}: ${parts.map(p => `${p.name} +${p.value}`).join(' · ')}`;
  return parts.map(p => `${p.name} +${p.value}`).join(' · ');
}

function fmtDate(iso) {
  if (!iso) return '';
  return iso.slice(0, 10).split('-').reverse().join('/');
}

// efeitos únicos textuais (sem bônus numérico) — texto observado na página do site
const UNIQUE_TEXT_OVERRIDES = {
  30080: 'Increase Acupuncturist Event Chance (sem bônus numérico)',
};

function buildEntry(s) {
  const L = [];
  L.push('──────────────────────────────────────────────');
  L.push(`Nome: ${s.supportCardTitle} (${s.charaName})`);
  const meta = [`ID: ${s.supportCardId}`, `Raridade: ${s.rarityDisplay}`, `Tipo: ${s.supportCardTypeName}`];
  if (s.startDate) meta.push(`Lançamento (JP): ${fmtDate(s.startDate)}`);
  L.push(meta.join(' | '));
  // efeitos no Nv 50, agregando os componentes do efeito único (como o site)
  const agg = new Map(); // type -> valor agregado
  const order = [];
  for (const e of (s.effects || [])) {
    const v = effectMax(e);
    if (v === null) continue;
    if (!agg.has(e.effectType)) order.push({ type: e.effectType, name: EFFECT_NAMES.get(e.effectType) || e.effectTypeName });
    agg.set(e.effectType, (agg.get(e.effectType) || 0) + v);
  }
  for (const p of uniqueParts(s.uniqueEffect)) {
    if (!agg.has(p.type)) order.push({ type: p.type, name: p.name });
    agg.set(p.type, (agg.get(p.type) || 0) + p.value);
  }
  L.push('Efeitos (Nv 50):');
  for (const o of order) L.push(`  ${o.name}: ${agg.get(o.type)}`);
  const u = uniqueLine(s.uniqueEffect) || UNIQUE_TEXT_OVERRIDES[s.supportCardId] || (s.uniqueEffect ? '(efeito especial — ver página da carta no site)' : null);
  if (u) L.push(`Efeito único (ativo): ${u}`);
  L.push(`Skill hints (${(s.skillHints || []).length}):`);
  const hints = (s.skillHints || []).map(h => h.skillId === 0 ? h.skillName : `${h.skillName}${h.skillLevel ? ' (Nv ' + h.skillLevel + ')' : ''}`);
  L.push('  ' + (hints.join(', ') || '(nenhuma)'));
  if ((s.events || []).length) {
    L.push(`Eventos (${s.events.length}):`);
    for (const ev of s.events) L.push(`  - ${ev.eventTitle} (${ev.eventType})`);
  }
  return L.join('\n');
}

const TYPE_ORDER = ['Speed', 'Stamina', 'Power', 'Guts', 'Intelligence', 'Friend'];
const TYPE_TITLE = { Speed: 'SPEED', Stamina: 'STAMINA', Power: 'POWER', Guts: 'GUTS', Intelligence: 'WIT (INTELIGÊNCIA)', Friend: 'FRIEND (AMIGA)' };

const header = [
  '================================================================================',
  'BANCO DE DADOS DE SUPPORT CARDS — UMA MUSUME: PRETTY DERBY (versão Global)',
  'Fonte: https://uma.guide/support-cards/ — dados extraídos e conferidos em 21/08/2026',
  `Cobertura: ${sup.length} support cards (${sup.filter(s=>s.rarity===3).length} SSR, ${sup.filter(s=>s.rarity===2).length} SR, ${sup.filter(s=>s.rarity===1).length} R).`,
  '',
  'SIMPLIFICAÇÃO: TODAS AS CARTAS CONSIDERADAS NO NÍVEL MÁXIMO (Nv 50).',
  'Cada efeito mostra apenas o valor final (último upgrade aplicado), igual à',
  'aba "Stats at Level 50" do site. Efeitos únicos (SSR/SR) já aparecem ativos,',
  'com os componentes SOMADOS à tabela (como o site faz no Nv 50).',
  '',
  'ORGANIZAÇÃO:',
  '- Agrupadas por TIPO (Speed, Stamina, Power, Guts, Wit, Friend — como o filtro do site),',
  '  e dentro do tipo por raridade (SSR → SR → R) e ordem de ID. Índice alfabético ao final.',
  '- "Friend" são as cartas de personagem (Group).',
  '',
  'CONVENÇÕES:',
  '- "At Bond X" (efeito único): bônus só vale com a amizade (bond) ≥ X com a personagem.',
  '- Skill hints: skills que a carta ensina nos treinos.',
  '- Eventos: eventos aleatórios da carta (com tipo).',
  '- Datas de lançamento são do servidor JP (o Global lança em ordem própria).',
  '- IDs servem para cruzar com os outros arquivos (skills, personagens).',
  '================================================================================',
  '',
  '',
];

const out = [header.join('\n')];
for (const t of TYPE_ORDER) {
  const list = sup.filter(s => s.supportCardTypeName === t)
    .sort((a, b) => (b.rarity - a.rarity) || (a.supportCardId - b.supportCardId));
  out.push('══════════════════════════════════════════════');
  out.push(`${TYPE_TITLE[t]} (${list.length})`);
  out.push('══════════════════════════════════════════════');
  out.push('');
  for (const s of list) { out.push(buildEntry(s)); out.push(''); out.push(''); }
}

// Índice alfabético (por personagem e título)
out.push('══════════════════════════════════════════════');
out.push('ÍNDICE ALFABÉTICO (por personagem)');
out.push('══════════════════════════════════════════════');
out.push('');
const sorted = [...sup].sort((a, b) => a.charaName.localeCompare(b.charaName, 'en') || a.supportCardTitle.localeCompare(b.supportCardTitle, 'en'));
for (const s of sorted) out.push(`${s.charaName} ${s.supportCardTitle} — ${s.supportCardId} (${s.rarityDisplay}, ${s.supportCardTypeName})`);

fs.writeFileSync('/home/user/UMA - support cards (completo).txt', out.join('\n'));
console.log('OK — support cards:', sup.length, '| tamanho:', (out.join('\n').length / 1024).toFixed(1), 'KB');
