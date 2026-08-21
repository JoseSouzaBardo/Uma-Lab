// Parser dos guias de CM do game8 (markdown do r.jina.ai) → JSON compacto por CM
const fs = require('fs');

function clean(s) {
  return s
    .replace(/!\[Image \d+: (SS|S|A|B|C|D) Rank\]\([^)]*\)/g, '[$1]')   // tier marker
    .replace(/!\[Image \d+: (Speed|Stamina|Power|Guts|Wit) Icon?\]\([^)]*\)/g, '{$1}') // stat icon
    .replace(/!\[Image \d+: ([^\]]*?)\]\([^)]*\)/g, (m, alt) => {        // outros ícones
      const a = alt.replace(/Icon$/i, '').trim();
      if (/Front Runner|Pace Chaser|Late Surger|End Closer|Ace Runners|Recovery|Rare .*Skill Icon/.test(a)) return `{${a}}`;
      return '';
    })
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')                                  // imagens restantes
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')                               // links → texto
    .replace(/\[\]\([^)]*\)/g, '')                                         // links vazios
    .replace(/\{((?:Front Runner|Pace Chaser|Late Surger|End Closer|Ace Runners)[A-Za-z ]*)\}\1/g, '$1') // ícone+texto duplicado
    .replace(/\{(?!(?:Speed|Stamina|Power|Guts|Wit)\})[A-Za-z ]{3,30}\}/g, '')   // ícones soltos (mantém stats)
    .replace(/\*\*/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');
}

function parse(cm) {
  const raw = fs.readFileSync(`/home/user/game8_guides/cm${String(cm).padStart(2, '0')}.md`, 'utf8');
  // conteúdo markdown (após "Markdown Content:")
  const idx = raw.indexOf('Markdown Content:');
  const body = idx >= 0 ? raw.slice(idx + 17) : raw;
  const lines = body.split('\n').map(l => clean(l.trim())).filter(l => l.length > 0);

  const out = { cm: Number(cm) };

  // ---- datas + condições (1 linha) ----
  const ri = lines.findIndex(l => /^Champions Meeting:/.test(l));
  const rc = lines.findIndex(l => /^Race Conditions:/.test(l));
  if (rc >= 0) out.race = lines.slice(rc + 1, rc + 3).join(' ').replace(/\s+/g, ' ').slice(0, 120);
  const date = lines.find(l => /^[A-Z][a-z]+ \d+.*20\d\d$/.test(l));
  if (date) out.date = date;

  // ---- Course Notes ----
  let cn = lines.findIndex(l => l === 'Course Notes');
  if (cn < 0) cn = lines.findIndex(l => /^・/.test(l)); // fallback: bullets soltos (guias 2025)
  if (cn >= 0) {
    const bullets = [];
    for (let i = cn + (lines[cn] === 'Course Notes' ? 1 : 0); i < lines.length; i++) {
      if (/^\[SS\]|^\[S\]|^\[A\]|^\[B\]|Tier List|^\[SS Rank\]|^\|.*Tier List/.test(lines[i])) break;
      const b = lines[i].replace(/^・\s*/, '').trim();
      if (lines[i].startsWith('・')) bullets.push(b);
      if (bullets.length >= 8) break;
    }
    out.courseNotes = bullets.filter(b => b.length < 300);
  }

  // ---- Tier List (header pode ser "| **X** Tier List ... |" ou "| Champions Meeting |") ----
  let tl = lines.findIndex(l => /^\|\s*[^|\n]*Tier List[^|\n]*\|/.test(l) || l === '| Champions Meeting |');
  if (tl < 0) tl = lines.findIndex(l => /^\|\s*\[(SS|S|A|B|C|D)\]\s*\|/.test(l));
  if (tl >= 0) {
    const tiers = [];
    let cur = null;
    for (let i = tl; i < Math.min(tl + 30, lines.length); i++) {
      const l = lines[i];
      const m = l.match(/^\|\s*\[(SS|S|A|B|C|D)\]\s*\|/);
      if (m) { cur = { tier: m[1], chars: [], notes: [] }; tiers.push(cur); }
      if (l.startsWith('| Debuffers') || l === '| Notes') break;
      if (!cur) continue;
      // nomes: "Char (Alt) Rarity: SSR" como texto de link (na mesma linha do tier ou nas seguintes)
      // filtra support cards ("Speed X (Y)" = prefixo de tipo antes do nome)
      const names = [...l.matchAll(/([A-Z][A-Za-z' .☆♪!?&~-]+\([^)]{3,40}\))\s*Rarity:\s*(SSR|SR|R)/g)].map(x => x[1])
        .filter(n => !/^(Speed|Stamina|Power|Guts|Wit|Friend|Pal|Group)\s/.test(n));
      cur.chars.push(...names);
      if (/Needs sparks|Needs several sparks|D or lower|off-meta|Off-Meta/i.test(l)) cur.notes.push(l.slice(0, 200));
    }
    out.tiers = tiers.map(t => ({ tier: t.tier, chars: [...new Set(t.chars)], notes: [...new Set(t.notes)] }));
  }

  // ---- Recommended Character | Key Points ----
  const rc2 = lines.findIndex(l => /^\|\s*Recommended Character/.test(l));
  if (rc2 >= 0) {
    const recs = [];
    for (let i = rc2 + 2; i < lines.length; i++) {
      const l = lines[i];
      if (!l.startsWith('|')) break;
      if (/Recommended Character|^\|---/.test(l)) continue;
      const cells = l.split('|').map(x => x.trim()).filter(Boolean);
      if (cells.length < 2) continue;
      const nameMatch = cells[0].match(/([A-Z][A-Za-z' .☆♪!?&~-]+\([^)]{3,40}\))/);
      if (!nameMatch) break;
      const pts = cells[1].split('* * *').map(x => x.replace(/^・\s*/, '').trim()).filter(x => x.length > 3 && x.length < 400);
      recs.push({ name: nameMatch[1], points: pts });
      if (recs.length >= 12) break;
    }
    out.recommended = recs;
  } else {
    // fallback 2025: tabela "| Notable Racers | Details |"
    const nr = lines.findIndex(l => /^\|\s*Notable Racers/.test(l));
    if (nr >= 0) {
      const recs = [];
      for (let i = nr + 2; i < Math.min(nr + 15, lines.length); i++) {
        const l = lines[i];
        if (!l.startsWith('|')) break;
        const cells = l.split('|').map(x => x.trim()).filter(Boolean);
        if (cells.length < 2) continue;
        const nm = cells[0].match(/([A-Z][A-Za-z' .☆♪!?&~-]+\([^)]{3,40}\))/);
        if (!nm) continue;
        const pts = cells[1].split('* * *').map(x => x.replace(/^・\s*/, '').trim()).filter(x => x.length > 3 && x.length < 400);
        recs.push({ name: nm[1], points: pts });
      }
      if (recs.length) out.recommended = recs;
    }
  }

  // ---- Ace Runners ----
  const ar = lines.findIndex(l => /\{Ace Runners/.test(l) || /Ace Runners \(/.test(l));
  if (ar >= 0) {
    const aces = [];
    for (let i = ar; i < Math.min(ar + 8, lines.length); i++) {
      const m = lines[i].match(/\{(Front Runner|Pace Chaser|Late Surger|End Closer)\}/);
      if (m) {
        const names = [...lines[i].matchAll(/([A-Z][A-Za-z' .☆♪!?&~-]+\([^)]{3,40}\))\s*Rarity:\s*(SSR|SR|R)/g)].map(x => x[1]);
        aces.push({ style: m[1], chars: [...new Set(names)] });
      }
    }
    out.aces = aces;
  }

  // ---- Debuffers ----
  const db = lines.findIndex(l => l.startsWith('| Debuffers'));
  if (db >= 0) {
    const names = [];
    for (let i = db; i < Math.min(db + 4, lines.length); i++) {
      names.push(...[...lines[i].matchAll(/([A-Z][A-Za-z' .☆♪!?&~-]+\([^)]{3,40}\))\s*Rarity:\s*(SSR|SR|R)/g)].map(x => x[1]));
    }
    if (names.length) out.debuffers = [...new Set(names)];
  }

  // ---- Metas de status ----
  const base = lines.findIndex(l => /Baselines \(20\d\d\)/.test(l));
  if (base >= 0) {
    out.stats = [];
    for (let i = base; i < Math.min(base + 9, lines.length); i++) {
      const l = lines[i];
      if (l.startsWith('|') && !/Baselines|---/.test(l)) out.stats.push(l.split('|').map(x => x.trim()).filter(Boolean).join(' | '));
      else if (!l.startsWith('|') && out.stats.length) { out.statNote = l.slice(0, 400); break; }
    }
  } else {
    const stats2025 = lines.findIndex(l => /Stats \(2025\)/.test(l));
    if (stats2025 >= 0) {
      out.stats = [];
      for (let i = stats2025; i < Math.min(stats2025 + 10, lines.length); i++) {
        const l = lines[i];
        if (l.startsWith('|')) out.stats.push(l.split('|').map(x => x.trim()).filter(Boolean).join(' | '));
        else if (out.stats.length) break;
      }
      const stamina = lines.findIndex(l => /Aim for Building High Stamina/.test(l));
      if (stamina >= 0) {
        const snotes = [];
        for (let i = stamina + 1; i < Math.min(stamina + 25, lines.length); i++) {
          const l = lines[i];
          if (/^##|^###/.test(l)) break;
          if (l.startsWith('|') || l.startsWith('ⓘ') || l.startsWith('※') || (l.length > 30 && !l.startsWith('|'))) snotes.push(l.slice(0, 400));
        }
        out.staminaNotes = snotes.slice(0, 12);
      }
    }
  }

  // ---- Skills recomendadas ----
  const sk = lines.findIndex(l => /^\|\s*Skill\s*\|/.test(l));
  if (sk >= 0) {
    const skills = [];
    for (let i = sk + 1; i < Math.min(sk + 200, lines.length); i++) {
      const l = lines[i];
      if (!l.startsWith('|')) break;
      const cells = l.split('|').map(x => x.trim()).filter(Boolean);
      const first = cells[0] || '';
      const nm = first.match(/([A-Z][A-Za-z' .☆♪!?&~○◯×-]{3,60})\s*$/);
      if (!nm) continue;
      const type = cells[1] && /^[A-Z][a-z]+$/.test(cells[1]) ? cells[1] : '';
      skills.push(type ? `${nm[1].trim()} [${type}]` : nm[1].trim());
      if (skills.length >= 80) break;
    }
    if (skills.length) out.skills = [...new Set(skills)];
  }

  // ---- Support cards recomendados ----
  const sup = lines.findIndex(l => /Support Cards above/.test(l));
  if (sup >= 0) {
    const supports = [];
    for (let i = Math.max(0, sup - 60); i < sup; i++) {
      const l = lines[i];
      const matches = [...l.matchAll(/([A-Z][A-Za-z' .☆♪!?&~-]+(?:\([^)]{3,40}\))?)\s*Type:\s*([A-Za-z]+)\s*Rarity:\s*(SSR|SR|R)/g)];
      for (const m of matches) supports.push(`${m[1].trim()} (${m[2]}, ${m[3]})`);
    }
    if (supports.length) out.supports = [...new Set(supports)];
    const note = lines.slice(sup, sup + 4).find(l => l.length > 60 && !l.startsWith('|'));
    if (note) out.supportNote = note.slice(0, 300);
  }

  // ---- Análise (parágrafos de meta após a tier list) ----
  {
    let anStart = lines.findIndex(l => /^Outside of these top two|^As a |^As another|^Overall|^The meta/.test(l));
    if (anStart < 0 && out.tiers && out.tiers.length) {
      // fallback: prosa logo após a última linha da tier list
      let lastTier = -1;
      for (let i = tl; i < lines.length; i++) {
        if (/^\|\s*\[(SS|S|A|B|C|D)\]\s*\|/.test(lines[i])) lastTier = i;
        if (lastTier > 0 && !lines[i].startsWith('|') && i > lastTier + 2 && lines[i].length > 40 && !/^##/.test(lines[i])) { anStart = i; break; }
      }
    }
    if (anStart >= 0) {
      const paras = [];
      for (let i = anStart; i < Math.min(anStart + 14, lines.length); i++) {
        const l = lines[i];
        if (l.startsWith('|') || /^##|Recommended Skills|Support Cards above|^\* \[/.test(l)) break;
        if (l.length > 60) paras.push(l);
      }
      if (paras.length) out.analysis = paras.slice(0, 6);
    }
  }

  return out;
}

const all = {};
for (let cm = 1; cm <= 18; cm++) {
  try { all[cm] = parse(cm); } catch (e) { console.log('cm' + cm, 'ERRO', e.message); }
}
fs.writeFileSync('/home/user/uma_data/game8_parsed.json', JSON.stringify(all, null, 1));
const s = JSON.stringify(all);
console.log('OK — tamanho do JSON:', (s.length / 1024).toFixed(1), 'KB');
// checagens
for (let cm = 1; cm <= 18; cm++) {
  const o = all[cm];
  const k = Object.keys(o).filter(k => k !== 'cm');
  console.log(`cm${String(cm).padStart(2, '0')}:`, k.join(','));
}
