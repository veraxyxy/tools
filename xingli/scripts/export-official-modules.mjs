import { build } from 'esbuild';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const result = await build({
    entryPoints: [join(root, 'src/data/seeds.js')],
    bundle: true,
    format: 'esm',
    platform: 'node',
    write: false,
});
const moduleUrl = 'data:text/javascript;base64,' + Buffer.from(result.outputFiles[0].text).toString('base64');
const { OFFICIAL_MODULES } = await import(moduleUrl);

const smartLabels = {
    fixed: '固定数量',
    perPerson: '按人数',
    perDay: '按天数',
    perPersonPerDay: '按人数×天数',
    formula: '公式计算',
};

const lines = [
    '# 行理：当前官方小包文字版',
    '',
    '> 直接导出自 `src/data/seeds.js`，不包含用户自建小包。',
    `> 共 ${OFFICIAL_MODULES.length} 个官方小包。`,
    '',
];

for (const module of OFFICIAL_MODULES) {
    lines.push(`## ${module.icon || ''} ${module.name}（${module.items.length} 项）`);
    lines.push('');
    if (module.desc) lines.push(module.desc, '');
    for (const item of module.items) {
        const notes = [];
        if ((item.q || 1) > 1) notes.push(`默认 ×${item.q}`);
        if (item.smart) notes.push(smartLabels[item.smart] || item.smart);
        lines.push(`- ${item.name}${notes.length ? `（${notes.join('；')}）` : ''}`);
    }
    lines.push('');
}

const outputPath = join(root, 'docs', 'official-packs-current.md');
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, lines.join('\n') + '\n');
console.log(outputPath);
