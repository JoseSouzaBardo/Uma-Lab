// Constrói data.json para o Analisador de CM (prototipo web)
const fs = require('fs');
const d = require('/home/user/uma_data/dump.json');
const G8 = require('/home/user/uma_data/game8_parsed.json');
const UG = require('/home/user/uma_data/umaguide_parsed.json');
const CM_JP = require('/home/user/gametora_data/events_champions-meeting.7af42cb7.json').slice(0, 18);
const CM_EN = require('/home/user/gametora_data/en_events_champions-meeting.357ceced.json');
const TRACKS = require('/home/user/gametora_data/history_pre_2_5th_anni_racetracks.b6eac814.json');

// ---------- overrides (replica Zr do site) ----------
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
const chars = applyOverrides(d.c, d.d.characters, 'cardId', false);
const skills = applyOverrides(d.s, d.d.skills, 'skillId', true);
const skMap = new Map(skills.map(s => [s.skillId, s]));

// ---------- personagens ----------
function baseUniqueId(charaId, cardId) { return cardId % 100 <= 1 ? null : 100001 + (charaId - 1000) * 10; }
function displayedUnique(c) {
  const ids = c.skillIds.split(',').map(Number);
  const pot = new Set((c.potentialSkills || []).map(p => p.skillId));
  const ex = baseUniqueId(c.charaId, c.cardId);
  const uniq = ids.filter(id => !pot.has(id) && id !== ex).map(id => skMap.get(id)).filter(s => s && s.skillCategory === 'Unique');
  return uniq[0] || null;
}
const JdMap = { Type6:'Runaway', Type8:'Increase FOV', Type10:'Improve Start Reaction Time', Type13:'Increase Rush Time', Type14:'Increase Start Delay', Type21:'Decrease Current Speed', Type22:'Increase Current Speed', Type28:'Increase Lane Movement Speed', Type29:'Increased Rush Chance', Type32:'All Stats Increase', Type35:'Change Lane', Type37:'Use Random Gold Skills', Type38:'Debuff Immunity', Type41:'Force Activation', Type42:'Conditional Increase Duration' };
function fxSummary(s) {
  if (s.effectSummary) return s.effectSummary.replace(/\|/g, ' · ');
  const parts = [];
  for (const e of (s.effects || [])) {
    if (JdMap[e.type] && !/Type/.test(e.type)) { parts.push(JdMap[e.type] + ' ' + e.value); continue; }
    if (e.displayText) parts.push(e.displayText);
    else if (/Stat/.test(e.type)) parts.push(e.type.replace(' Stat','') + ' +' + e.value);
    else if (e.type === 'Stamina Recovery') parts.push('HP Recovery +' + (e.value * 100).toFixed(1) + '%');
    else if (['Target Speed','Acceleration','Current Speed'].includes(e.type)) parts.push(e.type + ' +' + e.value);
  }
  return parts.join(' · ');
}
const charList = chars.map(c => {
  const u = displayedUnique(c);
  return {
    id: c.cardId,
    name: c.charaName,
    title: c.cardTitle.replace(/[\[\]]/g, ''),
    apt: {
      turf: c.aptitudeTurf, dirt: c.aptitudeDirt,
      sprint: c.aptitudeShort, mile: c.aptitudeMile, medium: c.aptitudeMiddle, long: c.aptitudeLong,
      front: c.aptitudeRunner, pace: c.aptitudeLeader, late: c.aptitudeBetweener, end: c.aptitudeChaser,
    },
    growth: { speed: c.talentSpeed, stamina: c.talentStamina, power: c.talentPower, guts: c.talentGuts, wit: c.talentWisdom },
    base: { speed: c.baseSpeed, stamina: c.baseStamina, power: c.basePower, guts: c.baseGuts, wit: c.baseWisdom },
    unique: u ? {
      name: u.skillName,
      effect: fxSummary(u),
      dur: u.duration,
      cond: [u.activationCondition, u.precondition, u.activationCondition2, u.precondition2].filter(Boolean).join('@'),
    } : null,
    innate: (c.potentialSkills || []).filter(p => p.needRank === 0).map(p => p.skillId),
    potential: (c.potentialSkills || []).filter(p => p.needRank > 0).map(p => p.skillId),
  };
});

// ---------- skills ----------
const skillList = skills.map(s => ({
  id: s.skillId,
  name: s.skillName,
  cat: s.skillCategory,
  rar: s.rarity,
  eff: fxSummary(s),
  cond: [s.activationCondition, s.precondition].filter(Boolean).join('&'),
  cond2: s.activationCondition2 || '',
  dur: s.duration,
  sp: s.needSkillPoint || 0,
}));

// ---------- CMs ----------
const GT_COURSE = {1:'10606',2:'10811',3:'10602',4:'10906',5:'10903',6:'10810',7:'10604',8:'10506',9:'10701',10:'10611',11:'10914',12:'10504',13:'10606',14:'10602',15:'10906',16:'10501',17:'11103',18:'10903'};
const gtcourses = new Map();
for (const t of TRACKS) for (const c of t.courses) gtcourses.set(String(c.id), c);
const TRACK_NAMES = {10001:'Sapporo',10002:'Hakodate',10003:'Niigata',10004:'Fukushima',10005:'Nakayama',10006:'Tokyo',10007:'Chukyo',10008:'Kyoto',10009:'Hanshin',10010:'Kokura',10101:'Oi',10103:'Kawasaki',10104:'Funabashi',10105:'Morioka',10201:'Longchamp'};
const CM_NAMES = {1:'Taurus Cup',2:'Gemini Cup',3:'Cancer Cup',4:'Leo Cup',5:'Virgo Cup',6:'Libra Cup',7:'Scorpio Cup',8:'Sagittarius Cup',9:'Capricorn Cup',10:'Aquarius Cup',11:'Pisces Cup',12:'Aries Cup',13:'Taurus Cup',14:'Gemini Cup',15:'Cancer Cup',16:'Leo Cup',17:'Virgo Cup',18:'Libra Cup'};
// cenário da época (Global): 1-5 URA · 6-16 Unity · 17-18 Grand Live
const ERA = {1:'ura',2:'ura',3:'ura',4:'ura',5:'ura',6:'unity',7:'unity',8:'unity',9:'unity',10:'unity',11:'unity',12:'unity',13:'unity',14:'unity',15:'unity',16:'unity',17:'live',18:'live'};

const SCEN = {
  ura:   { name: 'URA Finale',      caps: [1400,1400,1400,1400,1400], stats: [200,200,200,200,200] },
  unity: { name: 'Unity Cup',       caps: [1300,1300,1300,1300,1800], stats: [100,100,100,100,600] },
  mant:  { name: 'Trackblazer',     caps: [1200,1200,1200,1200,1200], stats: [0,700,0,0,300] },
  live:  { name: 'Grand Live',      caps: [1600,1300,1300,1500,1300], stats: [400,100,100,300,100] },
};

function distTypeOf(m) { return m < 1401 ? 1 : m < 1801 ? 2 : m < 2401 ? 3 : 4; }
function yearOf(cm) {
  const en = CM_EN.find(x => x.id === cm);
  if (en) return new Date(en.start * 1000).getFullYear();
  const last = CM_EN.reduce((a, b) => (b.id > a.id ? b : a), CM_EN[0]);
  return new Date(last.start * 1000).getFullYear();
}

const cms = CM_JP.map(jp => {
  const id = jp.id;
  const race = jp.race;
  const course = gtcourses.get(GT_COURSE[id]);
  const en = CM_EN.find(x => x.id === id);
  return {
    id,
    name: CM_NAMES[id] || jp.name_en,
    year: yearOf(id),
    dates: en ? { start: en.start * 1000, end: en.end * 1000 } : null,
    trackId: race.track,
    trackName: TRACK_NAMES[race.track] || String(race.track),
    surface: race.ground === 1 ? 'Turf' : 'Dirt',
    ground: race.ground,
    distance: race.distance,
    distanceType: distTypeOf(race.distance),
    direction: race.turn,          // 1 direita, 2 esquerda
    season: race.season,
    weather: race.weather,
    condition: race.condition,
    era: ERA[id],
    course: course ? {
      corners: course.corners.map(c => [c.start, c.end]),
      straights: course.straights.map(s => [s.start, s.end, s.frontType]),
      slopes: course.slopes.map(s => [s.start, s.end, s.slope]),
      phases: course.phases.map(p => [p.start, p.end, p.id]),
      statThresholds: course.statThresholds || [],
      spurt: course.spurtStart ? { lap: course.spurtStart.lap, meters: course.spurtStart.meters, loc: course.spurtStart.location } : null,
      posKeep: course.positionKeepEnd || 0,
      noMans: course.noMansLand || [],
      terrainChanges: course.terrainChanges || [],
    } : null,
    game8: G8[id] || {},
    umaguide: UG[id] ? UG[id].text : null,
  };
});

const data = {
  generatedAt: '2026-08-21',
  chars: charList,
  skills: skillList,
  cms,
  scen: SCEN,
};

fs.mkdirSync('/home/user/analyst/app', { recursive: true });
fs.writeFileSync('/home/user/analyst/app/data.json', JSON.stringify(data));
console.log('data.json:', (JSON.stringify(data).length / 1024).toFixed(0), 'KB |', 'chars:', charList.length, '| skills:', skillList.length, '| cms:', cms.length);
