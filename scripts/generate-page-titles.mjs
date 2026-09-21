import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { pageTitles } from '../src/data/pageTitles.js';

const dist = new URL('../dist/', import.meta.url);
const template = await readFile(new URL('index.html', dist), 'utf8');
for (const [path, title] of Object.entries(pageTitles)) {
  if (path === '/') continue;
  const directory = new URL(`${path.slice(1)}/`, dist);
  await mkdir(directory, { recursive: true });
  const html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(/(<meta property="og:title" content=")[^"]*("\s*\/?>)/, `$1${title}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*("\s*\/?>)/, `$1https://www.idhair.com${path}$2`);
  await writeFile(new URL('index.html', directory), html);
}
console.log('Generated page HTML with header-based titles.');
