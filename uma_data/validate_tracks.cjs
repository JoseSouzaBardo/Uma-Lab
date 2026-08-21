// Validação cruzada: umalator course_data.json × gametora (hist EN) para as CMs 1–18
const UMA = require('/home/user/umalator-global/course_data.json');
const GT = require('/home/user/gametora_data/history_pre_2_5th_anni_racetracks.b6eac814.json');
const CM = require('/home/user/gametora_data/events_champions-meeting.7af42cb7.json').slice(0, 18);

const GT_COURSE = {1:'10606',2:'10811',3:'10602',4:'10906',5:'10903',6:'10810',7:'10604',8:'10506',9:'10701',10:'10611',11:'10914',12:'10504',13:'10606',14:'10602',15:'10906',16:'10501',17:'11103',18:'10903'};

const gtcourses = new Map();
for (const t of GT) for (const c of t.courses) gtcourses.set(String(c.id), c);

const S = o => JSON.stringify(Object.keys(o).sort().reduce((a,k)=>{a[k]=o[k];return a},{}));
const cornersG = g => (g.corners||[]).map(c=>({start:c.start,length:c.end-c.start}));
const slopesG  = g => (g.slopes||[]).map(s=>({start:s.start,length:s.end-s.start,slope:s.slope}));
const straightsG = g => (g.straights||[]).map(s=>({start:s.start,end:s.end,frontType:s.frontType}));

let allOk = 0, issues = [];
for (const cm of CM) {
  const gid = GT_COURSE[cm.id];
  const g = gtcourses.get(gid), u = UMA[gid];
  if (!g || !u) { issues.push(`CM ${cm.id}: falta dado (${!g?'gametora':'umalator'})`); continue; }
  const diffs = [];
  if (g.length !== u.distance) diffs.push('distância');
  if (g.terrain !== u.surface) diffs.push('superfície');
  if (g.turn !== u.turn) diffs.push('direção');
  if (S(cornersG(g)) !== S(u.corners.map(c=>({start:c.start,length:c.length})))) diffs.push('curvas');
  if (S(straightsG(g)) !== S(u.straights.map(s=>({start:s.start,end:s.end,frontType:s.frontType})))) diffs.push('retas');
  if (S(slopesG(g)) !== S(u.slopes.map(s=>({start:s.start,length:s.length,slope:s.slope})))) diffs.push('inclinações');
  const stg = (g.statThresholds||[]).slice().sort((a,b)=>a-b);
  const stu = (u.courseSetStatus||[]).slice().sort((a,b)=>a-b);
  if (JSON.stringify(stg) !== JSON.stringify(stu)) diffs.push(`stat thresholds (${stg} vs ${stu})`);
  if (diffs.length) issues.push(`CM ${cm.id} (${cm.name_en}, ${gid}): ${diffs.join(', ')}`);
  else allOk++;
}

console.log(`OK: ${allOk}/18 | divergências reais: ${issues.length}`);
issues.forEach(x => console.log('  ' + x));

// Fases: gametora guarda, umalator deriva de frações (phaseStart/phaseEnd)
console.log('\n=== Fases: gametora (guardadas) × umalator (derivadas 1/6, 2/3, 5/6) ===');
const frac = d => [0, Math.round(d*1/6), Math.round(d*2/3), Math.round(d*5/6), d];
for (const cm of CM) {
  const g = gtcourses.get(GT_COURSE[cm.id]);
  if (!g) continue;
  const gp = g.phases.map(p=>p.start).concat([g.phases[g.phases.length-1].end]);
  const up = frac(g.length);
  const ok = JSON.stringify(gp)===JSON.stringify(up);
  console.log(`CM ${String(cm.id).padStart(2,'0')} ${cm.name_en.padEnd(16)} gametora ${JSON.stringify(gp)} | derivado ${JSON.stringify(up)} ${ok?'OK':'DIVERGE'}`);
}

// Spurt (2/3) e Position Keep (5/12)
console.log('\n=== Spurt (2/3) e Position Keep (5/12) × distância ===');
for (const cm of CM) {
  const g = gtcourses.get(GT_COURSE[cm.id]);
  if (!g) continue;
  const sp = Math.round(g.length*2/3);
  const pk = Math.round(g.length*5/12);
  const okS = g.spurtStart && g.spurtStart.meters===sp;
  const okP = g.positionKeepEnd===pk;
  console.log(`CM ${String(cm.id).padStart(2,'0')} ${cm.name_en.padEnd(16)} spurt ${g.spurtStart?g.spurtStart.meters:'?'} vs ${sp} ${okS?'OK':'X'} | poskeep ${g.positionKeepEnd} vs ${pk} ${okP?'OK':'X'}`);
}
