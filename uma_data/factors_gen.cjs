// Gera "UMA - fatores de heranca.txt" — fatores/sparks de herança (gametora + uma.guide)
const fs = require('fs');
const F = require('/home/user/gametora_data/factors.json');
const d = require('/home/user/uma_data/dump.json');

const STAT = { 1: 'Speed', 2: 'Stamina', 3: 'Power', 4: 'Guts', 5: 'Wit', 6: 'Recurso especial do cenário' };
const skMap = new Map(d.s.map(s => [s.skillId, s]));
const raceMap = new Map(d.a.map(r => [r.raceName, r]));

// fallback JP (skills novas ainda sem nome Global)
const JP_SKILLS = (() => {
  try {
    const src = fs.readFileSync('/home/user/uma_data/jp-skill-data.js', 'utf8');
    const m = src.match(/const [a-zA-Z]+=JSON\.parse\(\`([\s\S]*)\`\)/);
    return new Map(JSON.parse(m[1]).map(s => [s.skillId, s.skillName]));
  } catch (e) { return new Map(); }
})();

// ---------- joins ----------
function skillName(id) {
  const s = skMap.get(id);
  if (s) return s.skillName;
  const jp = JP_SKILLS.get(id);
  return jp ? `${jp} [JP, sem nome EN]` : `skill ${id}`;
}
function raceInfo(name, r) {
  if (/story|ストーリー|オークス_ストーリー/i.test(name)) return '(corrida de história — não listada no uma.guide)';
  const m = raceMap.get(name) || [...raceMap.values()].find(x => x.raceName && name && (x.raceName.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(x.raceName.toLowerCase())));
  return m ? `${m.trackName}, ${m.distance} m, ${m.distanceCategory}` : '(corrida não encontrada no uma.guide)';
}

// ---------- seção 2: azuis ----------
const blueSec = ['Sparks AZUIS (blue):', '──────────────────────────────────────────────', ''];
blueSec.push('1 spark azul por carreira, tipo sorteado entre os 5 atributos. Bônus inicial:');
blueSec.push('  ★1 = +5 de atributo | ★2 = +12 | ★3 = +21 (por legacy E por sub-legacy; somam).');
blueSec.push('');
blueSec.push('Chance de estrelas conforme o valor FINAL do atributo no fim da carreira:');
blueSec.push('  Menos de 600:      90% ★1 · 10% ★2');
blueSec.push('  600 a 1100:        50% ★1 · 45% ★2 · 5% ★3');
blueSec.push('  Acima de 1100:     20% ★1 · 70% ★2 · 10% ★3');
blueSec.push('');
for (const b of F.blue) blueSec.push(`  ${b.name_en.padEnd(9)} — bônus de ${b.name_en} no início do treino (+5/+12/+21 conforme estrelas)`);

// ---------- seção 3: rosa ----------
const pinkSec = ['Sparks ROSA (pink):', '──────────────────────────────────────────────', ''];
pinkSec.push('1 spark rosa por carreira, sorteado entre as aptidões que a personagem "gosta"');
pinkSec.push('(nunca sai uma aptidão com nota G). Estrelas: aleatórias.');
pinkSec.push('Melhora a aptidão correspondente no início do treino (até A); se sair de novo em');
pinkSec.push('inspiração, pode subir de A para S.');
pinkSec.push('');
pinkSec.push('Categorias: ' + F.pink.map(p => p.name_en).join(' · '));
pinkSec.push('');
pinkSec.push('Sparks rosa possíveis por personagem (aptidões base ≠ G):');
pinkSec.push('');
const PINK_MAP = { Turf: 'aptitudeTurf', Dirt: 'aptitudeDirt', Sprint: 'aptitudeShort', Mile: 'aptitudeMile', Medium: 'aptitudeMiddle', Long: 'aptitudeLong', 'Front Runner': 'aptitudeRunner', 'Pace Chaser': 'aptitudeLeader', 'Late Surger': 'aptitudeBetweener', 'End Closer': 'aptitudeChaser' };
const seenChars = new Set();
for (const c of d.c) {
  if (seenChars.has(c.charaId)) continue;
  seenChars.add(c.charaId);
  const pool = F.pink.filter(p => c[PINK_MAP[p.name_en]] && c[PINK_MAP[p.name_en]] !== 'G').map(p => p.name_en);
  pinkSec.push(`  ${c.charaName.padEnd(22)} ${pool.join(' · ')}`);
}

// ---------- seção 4: verde ----------
const greenSec = ['Sparks VERDES (green):', '──────────────────────────────────────────────', ''];
greenSec.push('Só existem se a raridade da personagem for ≥ 3★ no início da carreira (garantido');
greenSec.push('nesse caso). Concedem a SKILL ÚNICA da skin usada. Sempre obtidos no início do');
greenSec.push('treino; se saírem de novo em inspiração, dão desconto na compra da skill.');
greenSec.push('');
greenSec.push('Spark verde por skin:');
greenSec.push('');
for (const c of d.c) {
  const uid = c.skillIds ? Number(c.skillIds.split(',')[0]) : 0;
  const u = skMap.get(uid);
  greenSec.push(`  ${c.charaName.padEnd(22)} [${c.cardTitle.replace(/[\[\]]/g, '')}] → ${u ? u.skillName : '(única não encontrada)'}`);
}

// ---------- seção 5: brancos de corrida ----------
const raceSec = ['Sparks BRANCOS (white) — de CORRIDA:', '──────────────────────────────────────────────', ''];
raceSec.push('Chance de 20% por corrida G1 VENCIDA na carreira. Cada spark dá 2 efeitos');
raceSec.push('(atributo + dica de skill, ou 2 atributos). Valor por estrela: 3/6/9;');
raceSec.push('dica de skill no nível 1. (Star chances: ★1 50% · ★2 45% · ★3 5%.)');
raceSec.push('');
for (const r of F.race) {
  const parts = [];
  for (const e of r.effects) {
    if (e.type === 41) parts.push(`dica de skill ${skillName(e.value_1[0])} (Nv ${e.value_2[0]})`);
    else parts.push(`${STAT[e.type]} +3/+6/+9 (★1/★2/★3)`);
  }
  raceSec.push(`  ${(r.name_en || r.name_ja).padEnd(34)} ${parts.join(' + ')}`);
  raceSec.push(`      ${raceInfo(r.name_en, r)}`);
}

// ---------- seção 6: brancos de cenário ----------
const scSec = ['Sparks BRANCOS (white) — de CENÁRIO:', '──────────────────────────────────────────────', ''];
scSec.push('Spark da própria carreira (final do cenário). Valor por estrela: 10/20/30 nos');
scSec.push('cenários clássicos; outros cenários usam valores próprios (listados abaixo).');
scSec.push('');
for (const s of F.scenario) {
  const name = s.name_en || s.name_ja || `#${s.id}`;
  const vals = s.effects.map(e => {
    const v = e.value_1;
    const vstr = v.every(x => x === 10) || v.every(x => x === 12) || v.every(x => x === 5) || v.every(x => x === 4) || v.every(x => x === 3)
      ? `${v[0]}/${v[1]}/${v[2]}` : v.join('/');
    return `${STAT[e.type]} +${vstr}`;
  });
  scSec.push(`  ${name.padEnd(32)} ${vals.join(' + ')}`);
}

// ---------- seção 7: brancos de skill ----------
const skSec = ['Sparks BRANCOS (white) — de SKILL:', '──────────────────────────────────────────────', ''];
skSec.push('Chance no fim da carreira por skill normal aprendida: 20% (25% skills ◎, 40%');
skSec.push('skills douradas). Em inspiração, liberam a skill com desconto conforme estrelas.');
skSec.push('');
skSec.push(`Pool de skills que podem virar spark branco (${F.skill.length}):`);
skSec.push('');
for (const s of F.skill) {
  const sid = s.effects[0].value_1[0];
  skSec.push(`  ${String(s.id).padEnd(6)} ${skillName(sid)} (${sid})`);
}

// ---------- montagem ----------
const header = [
  '================================================================================',
  'BANCO DE DADOS DE FATORES DE HERANÇA — UMA MUSUME: PRETTY DERBY',
  'Fontes: gametora (factors.json + artigo "Uma Musume Legacies") e uma.guide',
  '(nomes de skills/corridas). Extraído e conferido em 21/08/2026.',
  '',
  'TERMINOLOGIA: "spark" (faísca) = "fator" de herança. A cada carreira, a',
  'personagem gera sparks que serão herdados por quem a usar como legacy (pai/mãe).',
  'Tipos: AZUL (atributo), ROSA (aptidão), VERDE (skill única), BRANCO (skill,',
  'corrida G1 ou cenário).',
  '',
  'MECÂNICA (resumo do artigo oficial da gametora):',
  '- 1 spark azul e 1 spark rosa são GARANTIDOS por carreira; verdes e brancos têm',
  '  condições específicas (seções abaixo).',
  '- Estrelas dos brancos: ★1 50% · ★2 45% · ★3 5% (chance de ★2/★3 maior com rank SS).',
  '- Estrelas dos rosas: aleatórias.',
  '- Bônus inicial (início do treino): stats azuis somados de legacies + sub-legacies;',
  '  rosas sobem aptidões (até A); verdes garantem a skill única.',
  '- Inspiração (2x por treino, abr/anos 2 e 3): bônus extras conforme os sparks;',
  '  compatibilidade (▲/○/◎) afeta as chances.',
  '- Dica prática do artigo: Stamina e Power são os sparks azuis mais populares;',
  '  em rosa, prefira os de distância; em branco, o spark do cenário URA Finale.',
  '================================================================================',
  '',
  '',
];

const out = header.join('\n') + '\n\n'
  + blueSec.join('\n') + '\n\n\n'
  + pinkSec.join('\n') + '\n\n\n'
  + greenSec.join('\n') + '\n\n\n'
  + raceSec.join('\n') + '\n\n\n'
  + scSec.join('\n') + '\n\n\n'
  + skSec.join('\n') + '\n';
fs.writeFileSync('/home/user/UMA - fatores de heranca.txt', out);
console.log('OK — fatores | tamanho:', (out.length / 1024).toFixed(1), 'KB');
console.log('pink:', F.pink.length, '| race:', F.race.length, '| scenario:', F.scenario.length, '| skill:', F.skill.length);
