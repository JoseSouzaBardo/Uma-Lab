// Gera "UMA - metas de CM (comunidade).txt" a partir de game8 + uma.guide
const fs = require('fs');
const G = require('/home/user/uma_data/game8_parsed.json');
const U = require('/home/user/uma_data/umaguide_parsed.json');
const CM = require('/home/user/gametora_data/events_champions-meeting.7af42cb7.json').slice(0, 18);
const CM_EN = require('/home/user/gametora_data/en_events_champions-meeting.357ceced.json');
const MAP = require('/home/user/cm_map.json');

function yearOf(cm) {
  const en = CM_EN.find(x => x.id === cm);
  if (en) return new Date(en.start * 1000).getFullYear();
  // CM ainda não registrada no EN: usa o ano da última EN registrada
  const last = CM_EN.reduce((a, b) => (b.id > a.id ? b : a), CM_EN[0]);
  return new Date(last.start * 1000).getFullYear();
}

const CM_NAME = { 1:'Taurus Cup', 2:'Gemini Cup', 3:'Cancer Cup', 4:'Leo Cup', 5:'Virgo Cup', 6:'Libra Cup', 7:'Scorpio Cup', 8:'Sagittarius Cup', 9:'Capricorn Cup', 10:'Aquarius Cup', 11:'Pisces Cup', 12:'Aries Cup', 13:'Taurus Cup', 14:'Gemini Cup', 15:'Cancer Cup', 16:'Leo Cup', 17:'Virgo Cup', 18:'Libra Cup' };

function renderStats(cm, o) {
  const L = [];
  const rows = o.stats || [];
  const hasStyleRows = rows.some(r => /^(Front|Pace|Late|End)\s*\|/.test(r));
  if (hasStyleRows) {
    L.push('Metas de status por estilo (formato: estilo | Speed | Stamina | Power | Guts | Wit):');
    for (const r of rows) {
      if (/Stats \(20\d\d\)|---|^✕$|^$/.test(r)) continue;
      if (/^(Front|Pace|Late|End)\s*\|/.test(r)) L.push('  ' + r);
      else L.push('  ' + r.slice(0, 220));
    }
    if (o.staminaNotes) {
      L.push('  Orientações de Stamina:');
      for (const n of o.staminaNotes) L.push('  ' + n.slice(0, 300));
    }
  } else {
    // estilo 2026: baselines (5 números) + Open League
    L.push('  Metas de status — colunas: Speed | Stamina | Power | Guts | Wit');
    let numeric = 0;
    let prevLabel = '';
    for (const r of rows) {
      if (!r || r.startsWith('---')) continue;
      if (/^Open League/.test(r)) { prevLabel = 'open'; L.push('  ' + r); continue; }
      if (/^(Distance|Track)\s*\|/.test(r)) { prevLabel = 'apt'; L.push('  ' + r); continue; }
      if (/^\d/.test(r)) {
        numeric++;
        if (numeric === 1 || prevLabel === 'base') L.push('  Graded: ' + r);
        else if (prevLabel === 'open' || numeric === 2) L.push('  Open:   ' + r);
        else L.push('  ' + r);
        continue;
      }
      L.push('  ' + r.slice(0, 220));
    }
  }
  if (o.statNote) L.push('  ' + o.statNote.slice(0, 400));
  return L;
}

function build(cm) {
  const o = G[cm] || {};
  const L = [];
  const meta = CM[cm - 1];
  L.push('══════════════════════════════════════════════');
  L.push(`CM ${String(cm).padStart(2, '0')} — ${CM_NAME[cm]} (${yearOf(cm)}, servidor Global) — metas da comunidade`);
  L.push('══════════════════════════════════════════════');
  L.push('');
  const u = U[cm];
  L.push('Fontes: game8.co' + (MAP[cm] ? ` (${MAP[cm].url})` : '') + (u ? ' · uma.guide/guides' : ''));
  if (o.race) L.push(`Corrida: ${o.race}`);
  L.push('');

  // GAME8
  L.push('── GAME8 ──');
  if (o.courseNotes && o.courseNotes.length) {
    const notes = o.courseNotes.filter(n => n.length > 12);
    if (notes.length) {
      L.push('Análise de pista:');
      for (const n of notes) L.push('  ・' + n);
    }
  }
  L.push('');
  if (o.stats && o.stats.length) {
    L.push(...renderStats(cm, o));
    L.push('');
  }
  if (o.tiers && o.tiers.length) {
    L.push('Tier list de personagens:');
    for (const t of o.tiers) {
      const chars = t.chars.join(' · ') || '(vazio)';
      L.push(`  ${t.tier}: ${chars}`);
      for (const n of t.notes) L.push('    ⓘ ' + n.slice(0, 250));
    }
    L.push('');
  }
  if (o.recommended && o.recommended.length) {
    L.push('Personagens recomendados:');
    for (const r of o.recommended) {
      L.push(`  - ${r.name}`);
      for (const p of r.points) L.push(`      ・${p}`);
    }
    L.push('');
  }
  if (o.aces && o.aces.length) {
    L.push('Aces por estilo:');
    for (const a of o.aces) L.push(`  ${a.style}: ${a.chars.join(' · ') || '—'}`);
    L.push('');
  }
  if (o.debuffers && o.debuffers.length) {
    L.push('Debuffers recomendados: ' + o.debuffers.join(' · '));
    L.push('');
  }
  if (o.skills && o.skills.length) {
    L.push(`Skills recomendadas (${o.skills.length}):`);
    L.push('  ' + o.skills.join(' · '));
    L.push('');
  }
  if (o.supports && o.supports.length) {
    L.push(`Support cards recomendados (${o.supports.length}):`);
    L.push('  ' + o.supports.join(' · '));
    if (o.supportNote) L.push('  ⓘ ' + o.supportNote);
    L.push('');
  }
  if (o.analysis && o.analysis.length) {
    L.push('Análise da meta:');
    for (const p of o.analysis) L.push('  ' + p);
    L.push('');
  }
  if (!o.tiers && !o.stats && !o.skills) L.push('(guia compacto do game8 — ver análise abaixo)' + '\n');

  // UMA.GUIDE
  if (u) {
    L.push('── UMA.GUIDE (guia completo) ──');
    const noise = /^(Contributors?:?|Last Updated:|EN PT-BR|.*archived.*|.*Browse current guides.*|uma\.guide \|)|uma\.guide \| Umamusume Guides & References/;
    const titleDup = new RegExp(`^${CM_NAME[cm]} \\(CM${cm}\\)$`);
    for (const t0 of u.text) {
      const t = t0.replace(/[\u200b\u200c\u00a0]/g, ' ').replace(/\s+/g, ' ').trim();
      if (!t || noise.test(t) || titleDup.test(t)) continue;
      L.push(t);
    }
    L.push('');
  }
  return L.join('\n');
}

const header = [
  '================================================================================',
  'BANCO DE DADOS DE METAS DE CM — COMUNIDADE (UMA MUSUME: PRETTY DERBY)',
  'Fontes: game8.co (guias oficiais de cada CM, CMs 1–18) e uma.guide (guias CM9–18).',
  'Extraído em 21/08/2026. Traduções e organização: automaticas.',
  '',
  'OBSERVAÇÕES:',
  '- "Metas de status" seguem a ordem FIXA das tabelas do game8:',
  '  Speed | Stamina | Power | Guts | Wit.',
  '- "Blue Sparks Init. Stats" = sparks azuis recomendados nos legados (★= estrelas;',
  '  ex.: 9★ STA = spark azul 3★ de Stamina de cada legacy; +126 STA = bônus inicial).',
  '- Tier list usa a nota do game8 (SS > S > A > B; "Needs sparks" = precisa de',
  '  sparks para corrigir aptidão).',
  '- Guias do game8 para CM1–CM3 (2025) são compactos: podem não listar skills/',
  '  suportes; a análise de pista está nos textos.',
  '- Os guias do uma.guide (CM9–18) são análises técnicas (aceleração, stamina,',
  '  debuffs); textos em inglês mantidos na íntegra (com cortes de navegação).',
  '- Dados de layout das pistas: ver "UMA - pistas CM 1-18.txt".',
  '- Dados de skills/personagens/support cards: ver os arquivos correspondentes.',
  '================================================================================',
  '',
  '',
];

const parts = [header.join('\n')];
for (let cm = 1; cm <= 18; cm++) parts.push(build(cm));
const out = parts.join('\n\n\n\n') + '\n';
fs.writeFileSync('/home/user/UMA - metas de CM (comunidade).txt', out);
console.log('OK — tamanho:', (out.length / 1024).toFixed(1), 'KB');
