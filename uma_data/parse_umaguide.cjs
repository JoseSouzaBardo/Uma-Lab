// Extrai o texto dos guias de CM do uma.guide (HTML SSR) → JSON
const fs = require('fs');

const NAMES = {
  9: 'Capricorn Cup (CM9)', 10: 'Aquarius Cup (CM10)', 11: 'Pisces Cup (CM11)',
  12: 'Aries Cup (CM12)', 13: 'Taurus Cup (CM13)', 14: 'Gemini Cup (CM14)',
  15: 'Cancer Cup (CM15)', 16: 'Leo Cup (CM16)', 17: 'Virgo Cup (CM17)', 18: 'Libra Cup (CM18)',
};

function htmlToLines(s) {
  return s
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<(h[1-4]|p|li|tr|br|div)[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .split('\n')
    .map(x => x.replace(/\s+/g, ' ').trim())
    .filter(x => x.length > 1);
}

const out = {};
for (let cm = 9; cm <= 18; cm++) {
  const s = fs.readFileSync(`/home/user/uma_guides/cm${cm}.html`, 'utf8');
  const lines = htmlToLines(s);
  // localizar início: título do guia (após o breadcrumb "About")
  const start = lines.findIndex(l => l.includes(`(${NAMES[cm].match(/CM\d+/)[0]})`) && l.includes('Last Updated') === false);
  const title = lines.findIndex(l => /^[A-Z][A-Za-z ]+ \(CM\d+\)$/.test(l));
  const end = lines.findIndex(l => /^Character Rate Up$/.test(l));
  let seg;
  if (title >= 0) {
    seg = lines.slice(title, end > title ? end : lines.length);
  } else if (start >= 0) {
    seg = lines.slice(start, end > start ? end : lines.length);
  } else {
    console.log('cm' + cm, 'início não encontrado');
    continue;
  }
  // remove restos de navegação
  seg = seg.filter(l => !/^(Characters|Support Cards|Skills|Guides|Tools|Champions Meeting|About|Themes|Ctrl K|Last Updated|Contributors|uma\.guide)$/.test(l));
  out[cm] = { title: NAMES[cm], text: seg };
  console.log('cm' + cm, '| linhas:', seg.length, '| amostra:', seg.slice(0, 8).join(' | ').slice(0, 200));
}
fs.writeFileSync('/home/user/uma_data/umaguide_parsed.json', JSON.stringify(out, null, 1));
console.log('OK —', (JSON.stringify(out).length / 1024).toFixed(1), 'KB');
