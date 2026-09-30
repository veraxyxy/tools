import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = join(root, 'minitool-dist');

rmSync(outputDir, { recursive: true, force: true });
mkdirSync(outputDir, { recursive: true });

const sourceHtml = readFileSync(join(root, 'index.html'), 'utf8');
const offlineHtml = sourceHtml.replace(/\?v=[0-9-]+/g, '');

writeFileSync(join(outputDir, 'index.html'), offlineHtml);
cpSync(join(root, 'bundle.js'), join(outputDir, 'bundle.js'));
cpSync(join(root, 'style.css'), join(outputDir, 'style.css'));
cpSync(join(root, 'minitool-assets'), join(outputDir, 'assets'), { recursive: true });

console.log('[prepare-minitool] created offline artifact at minitool-dist/');
