import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dataPath = join(root, 'data', 'irasok.json');
const outputPath = join(root, 'js', 'irasok-adatok.js');
const checkOnly = process.argv.includes('--check');

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const source = JSON.parse(await readFile(dataPath, 'utf8'));
const slugs = new Set();

for (const writing of source) {
  for (const field of ['file', 'title', 'description', 'category', 'categoryId', 'year']) {
    if (writing[field] === undefined || writing[field] === '') {
      throw new Error(`Hiányzó „${field}” mező: ${writing.file || writing.title || 'ismeretlen cikk'}`);
    }
  }
  if (!writing.file.endsWith('/')) throw new Error(`A file mező végén / szükséges: ${writing.file}`);
  if (slugs.has(writing.file)) throw new Error(`Ismétlődő cikkazonosító: ${writing.file}`);
  slugs.add(writing.file);
}

const publicData = source.map(({ file, title, description, category, categoryId, year }) => ({
  file,
  title,
  description,
  category,
  categoryId,
  year,
}));

const generatedData = `// Automatikusan generált fájl. A cikkadatokat a data/irasok.json fájlban szerkeszd.\nwindow.WRITINGS = ${JSON.stringify(publicData, null, 2)};\n`;
const changes = [];

const updateFile = async (path, content) => {
  let current;
  try {
    current = await readFile(path, 'utf8');
  } catch {
    throw new Error(`Nem található a generálandó fájl: ${path}`);
  }
  if (current === content) return;
  changes.push(path);
  if (!checkOnly) await writeFile(path, content, 'utf8');
};

await updateFile(outputPath, generatedData);

for (const writing of source) {
  const slug = writing.file.slice(0, -1);
  const articlePath = join(root, 'irasok', `${slug}.html`);
  const current = await readFile(articlePath, 'utf8');
  const title = escapeHtml(writing.title);
  const heading = writing.heading || { title: writing.title };
  const classAttribute = writing.titleClass ? ` class="${escapeHtml(writing.titleClass)}"` : '';
  const subtitle = heading.subtitle
    ? `<span class="title-subtitle">${escapeHtml(heading.subtitle)}</span>`
    : '';
  const h1 = `<h1${classAttribute}>${escapeHtml(heading.title)}${subtitle}</h1>`;
  const next = current
    .replace(/<title>[^<]*<\/title>/, `<title>${title} | Szanyi Aida</title>`)
    .replace(/<h1(?:\s[^>]*)?>[\s\S]*?<\/h1>/, h1);

  if (next === current && (!current.includes(`<title>${title} | Szanyi Aida</title>`) || !current.includes(h1))) {
    throw new Error(`Nem sikerült frissíteni a címet ebben a fájlban: ${articlePath}`);
  }
  await updateFile(articlePath, next);
}

if (checkOnly && changes.length) {
  console.error('A generált cikkadatok nincsenek naprakész állapotban:');
  changes.forEach((path) => console.error(`- ${path}`));
  process.exitCode = 1;
} else if (changes.length) {
  console.log(`${changes.length} fájl frissítve.`);
} else {
  console.log('A cikkadatok naprakészek.');
}
