const d = require('/home/user/uma_data/dump.json');
const chars = d.c;
const skills = d.s;
const skMap = new Map(skills.map(s => [s.skillId, s]));

console.log('=== Validation ===');
console.log('chars:', chars.length);
let missing = 0, nonUnique = 0, cond2 = [], eff2 = [], negDur = [], pre = [], weird = [];
for (const c of chars) {
  const ids = c.skillIds ? c.skillIds.split(',').map(Number) : [];
  if (!ids.length) { missing++; console.log('NO SKILLS:', c.charaName, c.cardId); continue; }
  const uni = skMap.get(ids[0]);
  if (!uni) { missing++; console.log('UNIQUE NOT FOUND:', c.charaName, c.cardId, ids[0]); continue; }
  if (uni.skillCategory !== 'Unique') { nonUnique++; console.log('NOT UNIQUE:', c.charaName, ids[0], uni.skillCategory, uni.skillName); }
  if (uni.activationCondition2) cond2.push(c.charaName + ' (' + uni.skillName + ')');
  if (uni.effects2 && uni.effects2.length) eff2.push(c.charaName + ' (' + uni.skillName + ')');
  if (uni.precondition) pre.push(c.charaName + ' (' + uni.skillName + '): ' + uni.precondition);
  if (uni.duration < 0) negDur.push(c.charaName + ' (' + uni.skillName + '): dur=' + uni.duration);
  // check innate+potential count
  const pot = c.potentialSkills || [];
  const innateIds = pot.filter(p => p.needRank === 0).map(p => p.skillId);
  const potentialIds = pot.filter(p => p.needRank > 0).sort((a,b)=>a.needRank-b.needRank).map(p => p.skillId);
  const all = [...innateIds, ...potentialIds];
  const expected = ids.slice(1);
  const same = all.length === expected.length && all.every((v,i)=>v===expected[i]);
  if (!same) { weird.push(c.charaName + ': potentialSkills=' + JSON.stringify(pot.map(p=>p.skillId+':'+p.needRank)) + ' skillIds=' + JSON.stringify(expected)); }
}
console.log('missing unique:', missing, '| nonUnique:', nonUnique);
console.log('cond2:', cond2.length, cond2.join(' ; '));
console.log('eff2:', eff2.length, eff2.join(' ; '));
console.log('precondition non-empty:', pre.length); pre.forEach(x=>console.log('  ', x));
console.log('negative duration:', negDur.length, negDur.join(' ; '));
console.log('potential/skillIds mismatch:', weird.length); weird.slice(0,10).forEach(x=>console.log('  ', x));

// effect types present in unique skills
const types = new Map();
for (const c of chars) {
  const ids = c.skillIds.split(',').map(Number);
  const uni = skMap.get(ids[0]);
  if (!uni) continue;
  for (const e of uni.effects || []) types.set(e.type, (types.get(e.type)||0)+1);
  if (uni.effects2) for (const e of uni.effects2) types.set(e.type, (types.get(e.type)||0)+1);
}
console.log('unique effect types:', JSON.stringify([...types.entries()]));

// effectSummary examples containing weird tokens
const sums = new Set();
for (const c of chars) {
  const uni = skMap.get(Number(c.skillIds.split(',')[0]));
  if (uni && uni.effectSummary && /[\u3000-\u9fff]|[A-Za-z]+ \+[+-]|Intelligence/.test(uni.effectSummary)) sums.add(uni.effectSummary);
}
console.log('weird summaries:'); [...sums].slice(0,30).forEach(x=>console.log('  ', x));
