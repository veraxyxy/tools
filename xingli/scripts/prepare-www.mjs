import { cpSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const wwwDir = join(root, 'www');
const assets = ['index.html', 'bundle.js', 'style.css'];
const assetDirs = ['assets'];

rmSync(wwwDir, { recursive: true, force: true });
mkdirSync(wwwDir, { recursive: true });

for (const file of assets) {
  cpSync(join(root, file), join(wwwDir, file));
}

for (const dir of assetDirs) {
  cpSync(join(root, dir), join(wwwDir, dir), { recursive: true });
}

console.log(`[prepare-www] copied ${[...assets, ...assetDirs].join(', ')} -> www/`);
