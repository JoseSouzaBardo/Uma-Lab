const fs = require('fs');
const vm = require('vm');

const src = fs.readFileSync('/home/user/uma_data/uma-data.DYxPX9WP.js', 'utf8');

const exportMatch = src.match(/export\s*\{([^}]*)\};?\s*$/);
if (!exportMatch) throw new Error('export not found');
const body = src.slice(0, exportMatch.index);

// Parse export list: {G as $, pe as A, ...}
const exportList = exportMatch[1];
const pairs = exportList.split(',');
const locals = [];
const aliases = [];
for (const p of pairs) {
  const [local, alias] = p.split(' as ').map(s => s.trim());
  locals.push(local);
  aliases.push(alias || local);
}

// Append a collector that captures all local names
const collector = '\n;globalThis.__OUT__ = { ' + locals.map((l, i) => JSON.stringify(aliases[i]) + ': ' + l).join(', ') + ' };';
const code = body + collector;

const sandbox = { JSON };
vm.createContext(sandbox);
vm.runInContext(code, sandbox, { filename: 'uma-data.js' });

const exportMap = sandbox.__OUT__;
fs.writeFileSync('/home/user/uma_data/dump.json', JSON.stringify(exportMap, null, 1));
console.log('Exported keys:', Object.keys(exportMap).length);
for (const [k, v] of Object.entries(exportMap)) {
  if (Array.isArray(v)) console.log(k, '-> array of', v.length, '| sample keys:', v.length ? Object.keys(v[0]).slice(0, 25).join(',') : '');
  else if (v && typeof v === 'object') console.log(k, '-> object with keys:', Object.keys(v).slice(0, 25).join(','));
  else console.log(k, '->', typeof v);
}
