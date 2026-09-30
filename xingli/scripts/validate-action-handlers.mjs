import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const appSource = readFileSync(join(root, 'app.js'), 'utf8');
const htmlSource = readFileSync(join(root, 'index.html'), 'utf8');
const actionLines = (htmlSource + '\n' + appSource)
    .split('\n')
    .filter(line => line.includes('data-action-'));

const ignoredCalls = new Set(['if', 'stopPropagation', 'closest', 'esc']);
const handlers = new Set();
for (const line of actionLines) {
    for (const match of line.matchAll(/([A-Za-z_$][\w$]*)\(/g)) {
        if (!ignoredCalls.has(match[1])) handlers.add(match[1]);
    }
}

const exposedStart = appSource.indexOf('Object.assign(window, {');
const exposedEnd = appSource.indexOf('\n});', exposedStart);
const exposedBlock = exposedStart >= 0 && exposedEnd > exposedStart
    ? appSource.slice(exposedStart, exposedEnd)
    : '';

const missingDeclarations = [];
const missingExports = [];
for (const handler of handlers) {
    const declaration = new RegExp('function\\s+' + handler + '\\s*\\(');
    const exposure = new RegExp('\\b' + handler + '\\b');
    if (!declaration.test(appSource)) missingDeclarations.push(handler);
    if (!exposure.test(exposedBlock)) missingExports.push(handler);
}

if (missingDeclarations.length || missingExports.length) {
    if (missingDeclarations.length) console.error('Missing action declarations:', missingDeclarations.join(', '));
    if (missingExports.length) console.error('Missing action exports:', missingExports.join(', '));
    process.exit(1);
}

console.log(`[validate-actions] ${handlers.size} declarative handlers are defined and exposed`);
