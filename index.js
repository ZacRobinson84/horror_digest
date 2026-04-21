import 'dotenv/config';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { feeds } from './src/feeds.js';
import { fetchFeeds } from './src/fetchFeeds.js';
import { summarize } from './src/summarize.js';

const items = await fetchFeeds(feeds);
console.log(`Fetched ${items.length} items from last 24h.`);

const digest = await summarize(items);

const date = new Date().toISOString().slice(0, 10);
const sourceCount = new Set(items.map((i) => i.source)).size;
const itemCount = digest
  .split(/\n\s*\n/)
  .map((p) => p.trim())
  .filter((p) => p.length > 0 && !p.startsWith('**Worth reading in full:**'))
  .length;
const frontmatter = [
  '---',
  `date: ${date}`,
  `itemCount: ${itemCount}`,
  `articleCount: ${items.length}`,
  `sourceCount: ${sourceCount}`,
  '---',
  '',
].join('\n');

const outDir = 'content';
await mkdir(outDir, { recursive: true });
const outPath = join(outDir, `${date}.md`);
await writeFile(outPath, frontmatter + digest + '\n', 'utf8');
console.log(`Wrote digest to ${outPath}`);
process.exit(0);
