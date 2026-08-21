// Gera "UMA - pistas CM 1-18.txt" com os dados das pistas das Champions Meeting 1–18
// Fonte: gametora.com (lista de CMs + dados de pistas do servidor EN/Global)
const fs = require('fs');

const JP = require('/home/user/gametora_data/events_champions-meeting.7af42cb7.json');
const EN = require('/home/user/gametora_data/en_events_champions-meeting.357ceced.json');
// Dataset EN (o que o viewer da gametora exibe para o servidor Global):
const TRACKS = require('/home/user/gametora_data/history_pre_2_5th_anni_racetracks.b6eac814.json');
// Dataset atual (usado apenas para nota de divergência):
const TRACKS_CUR = require('/home/user/gametora_data/racetracks.7d2f3355.json');

const TRACK_NAMES = { 10001:'Sapporo',10002:'Hakodate',10003:'Niigata',10004:'Fukushima',10005:'Nakayama',10006:'Tokyo',10007:'Chukyo',10008:'Kyoto',10009:'Hanshin',10010:'Kokura',10101:'Oi',10103:'Kawasaki',10104:'Funabashi',10105:'Morioka',10201:'Longchamp' };

const DIR = { 1:'Direita (sentido horário)', 2:'Esquerda (sentido anti-horário)' };
const SEASON = { 1:'Primavera', 2:'Verão', 3:'Outono', 4:'Inverno' };
const WEATHER = { 1:'Ensolarado', 2:'Nublado', 3:'Chuva', 4:'Neve' };
const COND_TURF = { 1:'Firme', 2:'Bom', 3:'Macio', 4:'Pesado' };
const COND_DIRT = { 1:'Bom', 2:'Levemente pesado', 3:'Pesado', 4:'Ruim' };
const INOUT = { 1:'', 2:'Interna', 3:'Externa', 4:'Externa→Interna' };
const PHASE = { 0:'Abertura (início)', 1:'Meio', 2:'Final', 3:'Spurt final' };
const STAT = { 1:'Speed', 2:'Stamina', 3:'Power', 4:'Guts', 5:'Wit' };
const LOC = { straight:'reta', corner:'curva', final_corner:'curva final', final_straight:'reta final', backstretch:'reta oposta', uphill:'subida', downhill:'descida', slope:'inclinação', front:'frente' };

function dmy(ts){ const d=new Date(ts*1000); return d.toISOString().slice(0,10).split('-').reverse().join('/'); }

// Estimativa da CM18 Global (mesmo algoritmo do site: mediana dos intervalos)
function estimateNext(){
  const starts = EN.map(x=>x.start).sort((a,b)=>a-b);
  const diffs = [];
  for(let i=1;i<starts.length;i++) diffs.push(starts[i]-starts[i-1]);
  diffs.sort((a,b)=>a-b);
  const med = diffs[Math.floor(diffs.length/2)];
  const last = EN.reduce((a,b)=>b.start>a.start?b:a);
  return last.start + (18-last.id)*med;
}
const EN18_EST = estimateNext();

function findCourse(track, len, terrain, turn, cmId){
  const t = TRACKS.find(x=>String(x.id)===String(track)) || {courses:[]};
  let c = t.courses.find(x=>x.length===len && x.terrain===terrain && x.turn===turn);
  if(!c) c = t.courses.find(x=>x.length===len && x.terrain===terrain);
  return c || null;
}

function fmtSlope(v){ return (v/10000).toFixed(v%10000===0?0:1) + '%'; }

function buildEntry(cm){
  const L = [];
  const race = cm.race;
  const trackName = TRACK_NAMES[race.track] || ('pista '+race.track);
  const course = findCourse(race.track, race.distance, race.ground, race.turn, cm.id);
  const en = EN.find(x=>x.id===cm.id);
  L.push('══════════════════════════════════════════════');
  L.push(`CM ${String(cm.id).padStart(2,'0')} — ${cm.name_en}${cm.name!==cm.name_en?' ('+cm.name+')':''}`);
  L.push('══════════════════════════════════════════════');
  L.push('');
  L.push('Evento:');
  if(en){
    L.push(`  Datas (Global/EN): ${dmy(en.start)} → ${dmy(en.end)}`);
  } else {
    L.push(`  Datas (Global/EN): início estimado em ${dmy(EN18_EST)} (ainda não anunciado)`);
  }
  L.push(`  Datas (JP original): ${dmy(cm.start)} → ${dmy(cm.end)}`);
  L.push('');
  L.push('Corrida:');
  L.push(`  Pista: ${trackName}`);
  L.push(`  Superfície: ${race.ground===1?'Turf (grama)':'Dirt (areia)'}`);
  L.push(`  Distância: ${race.distance} m`);
  L.push(`  Direção: ${DIR[race.turn]||race.turn}`);
  L.push(`  Estação: ${SEASON[race.season]||race.season}`);
  L.push(`  Clima: ${WEATHER[race.weather]||race.weather}`);
  const cond = race.ground===1 ? (COND_TURF[race.condition]||race.condition) : (COND_DIRT[race.condition]||race.condition);
  L.push(`  Condição do piso: ${cond}`);
  if(course){
    if(INOUT[course.inout]) L.push(`  Variante da pista: ${INOUT[course.inout]}`);
    if(course.laps && course.laps.length>1){
      L.push(`  Voltas (diagrama): ${course.laps.map(l=>`Volta ${l.lap}: ${l.start}–${l.end} m`).join(' · ')}`);
    } else {
      L.push(`  Voltas (diagrama): 1 volta (0–${course.length} m)`);
    }
  }
  L.push('');
  if(!course){
    L.push('Pista: DADOS NÃO ENCONTRADOS para esta combinação nos dados da gametora.');
    return L.join('\n');
  }
  // Fases
  L.push('Fases:');
  for(const p of course.phases) L.push(`  ${PHASE[p.id]||('Fase '+p.id)}: ${p.start}–${p.end} m`);
  L.push('');
  // Retas
  L.push('Retas:');
  let rs=0;
  for(const s of course.straights){ rs++; L.push(`  Reta ${rs}${s.frontType===1?' (final)':s.frontType===2?' (oposta)':''}: ${s.start}–${s.end} m`); }
  L.push('');
  // Curvas
  L.push('Curvas:');
  for(const c of course.corners) L.push(`  Curva ${c.number}: ${c.start}–${c.end} m`);
  L.push('');
  // Inclinações
  L.push('Inclinações:');
  if(course.slopes.length){
    let n=0;
    for(const s of course.slopes){ n++; L.push(`  Inclinação ${n} (${s.slope>0?'subida':'descida'} ${fmtSlope(Math.abs(s.slope))}): ${s.start}–${s.end} m`); }
  } else L.push('  Nenhuma (pista plana)');
  L.push('');
  // Stat thresholds
  L.push('Stat Thresholds:');
  if(course.statThresholds.length) L.push('  ' + course.statThresholds.map(x=>STAT[x]||('?'+x)).join(', '));
  else L.push('  Nenhum');
  L.push('');
  // Extras
  L.push('Extras:');
  if(course.spurtStart){
    // lógica do site: se o 2º item contém o 1º, exibe só a partir do 2º
    let loc = course.spurtStart.location||[];
    if(loc.length>1 && String(loc[1]).includes(loc[0])) loc = loc.slice(1);
    const locTxt = loc.map(x=>LOC[x]||x).join(', ');
    L.push(`  Spurt final inicia: volta ${course.spurtStart.lap}, aos ${course.spurtStart.meters} m (${locTxt})`);
  }
  if(course.positionKeepEnd) L.push(`  Position Keep termina: aos ${course.positionKeepEnd} m`);
  if(course.noMansLand && course.noMansLand.length){
    L.push(`  Trecho neutro (nem reta nem curva): ${course.noMansLand.map(x=>x.start+'–'+x.end+' m').join(' · ')}`);
  }
  if(course.terrainChanges && course.terrainChanges.length>1){
    const parts = course.terrainChanges.map((t,i,arr)=>{
      const until = arr[i+1] ? arr[i+1].start : course.length;
      return `${t.start}–${until} m ${t.terrain===1?'turf':'dirt'}`;
    }).join(' · ');
    L.push(`  Transição de terreno: ${parts}`);
  }
  if(course.overlaps && course.overlaps.length){
    const ov = course.overlaps.map(o=>o.split('').map(d=>PHASE[Number(d)]).join('+')).join(' · ');
    L.push(`  Sobreposição no diagrama (fases): ${ov}`);
  }
  // Notas de analista
  const notes = [];
  if(cm.id===3) notes.push('uma.guide descreve esta CM como "Inner"; nos dados da gametora existe apenas um traçado de 1600m turf em Tokyo (sem rótulo de variante) — usamos esse traçado.');
  if(cm.id===4) notes.push('uma.guide descreve esta CM como "Outer", mas os dados da gametora têm apenas uma pista de 2200m turf em Hanshin (rotulada como Interna); usamos a pista dos dados.');
  if(cm.id===10){
    const cur = TRACKS_CUR.flatMap(t=>t.courses).find(c=>String(c.id)===String(course.id));
    if(cur && JSON.stringify(cur.terrainChanges)!==JSON.stringify(course.terrainChanges)){
      notes.push('O dataset mais recente da gametora move a transição turf→dirt de 120 m para 100 m; o valor acima é o do dataset exibido pelo viewer Global.');
    }
  }
  if(cm.id===17) notes.push('uma.guide descreve o piso como "Good"; os dados da gametora indicam condição 2 em pista de dirt (= Levemente pesado). Mantivemos a classificação da gametora.');
  if(notes.length){ L.push('Notas:'); notes.forEach(n=>L.push('  - '+n)); }
  return L.join('\n');
}

const header = [
  '================================================================================',
  'BANCO DE DADOS DE PISTAS — CHAMPIONS MEETING 1 a 18 (UMA MUSUME: PRETTY DERBY)',
  'Fonte: https://gametora.com/umamusume/events/champions-meeting?cm=1 (CMs 1–18)',
  'Dados extraídos dos arquivos públicos da gametora em 21/08/2026:',
  '- Lista de CMs (JP) e lista de CMs do servidor Global (EN);',
  '- Dataset de pistas do servidor Global (history/pre_2_5th_anni/racetracks), que é o',
  '  mesmo que o viewer da gametora usa para exibir as CMs no servidor Global.',
  '',
  'VALIDAÇÃO (21/08/2026): dados conferidos contra o simulador umalator-global',
  '(course_data.json) — 18/18 pistas idênticas (curvas, retas, inclinações, stat',
  'thresholds, fases, spurt e position keep). Ver "RELATORIO - validacao de pistas.md".',
  '',
  'CONVENÇÕES:',
  '- Metros: distância de corrida a partir da largada (0 m = largada; X m = chegada,',
  '  onde X é a distância da CM).',
  '- Direção: sentido do giro da pista (direita = horário; esquerda = anti-horário).',
  '- Fases: Abertura (início da corrida), Meio, Final e Spurt final (última arrancada).',
  '- Reta oposta = reta dos fundos (backstretch); reta final = reta da chegada.',
  '- Inclinações em % de gradiente (subida = aclive; descida = declive).',
  '- Stat Thresholds: atributos que a pista verifica (mapeamento da gametora:',
  '  1=Speed, 2=Stamina, 3=Power, 4=Guts, 5=Wit). "Nenhum" = pista sem checagem.',
  '- Variante da pista: Interna/Externa/Externa→Interna (quando a pista tem mais de',
  '  um traçado; omitido quando a pista tem traçado único).',
  '- Datas: o servidor Global repete as CMs do JP na mesma ordem, com datas próprias.',
  '  A CM18 Global ainda não ocorreu (início estimado pelo algoritmo do próprio site).',
  '================================================================================',
  '',
  '',
];

// Tabela-resumo
const summary = ['RESUMO — CM 1 A 18', '────────────────────'];
for(const cm of JP.slice(0,18)){
  const race = cm.race;
  const trackName = TRACK_NAMES[race.track]||('pista '+race.track);
  const en = EN.find(x=>x.id===cm.id);
  const gd = en ? `${dmy(en.start)} → ${dmy(en.end)}` : `estimado ${dmy(EN18_EST)}`;
  summary.push(`CM ${String(cm.id).padStart(2,'0')} ${cm.name_en.padEnd(18)} | ${trackName.padEnd(9)} | ${race.ground===1?'Turf':'Dirt'} ${race.distance} m | Global: ${gd}`);
}

const out = header.join('\n') + summary.join('\n') + '\n\n\n\n' + JP.slice(0,18).map(buildEntry).join('\n\n\n\n') + '\n';
fs.writeFileSync('/home/user/UMA - pistas CM 1-18.txt', out);
console.log('OK — CMs:', JP.slice(0,18).length, '| tamanho:', (out.length/1024).toFixed(1), 'KB');
