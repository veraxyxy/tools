import { STORAGE_KEYS } from './constants.js';
import { BASE_LIBRARY_ITEMS } from './seeds.js';
import { gid, guessCat, catInfo, suggestBagForItem } from './utils.js';
import { normalizeLibraryItem, normalizeModuleItem } from './models.js';
import { resolveItemSmartPlan, inferSmartRule } from './smartFill.js';
import { readJson, writeJson, getOfficialModules } from './store.js';

export function sortLibraryItems(items) {
    return [...items].sort((a, b) => {
        const sourceDiff = Number(b.source === 'user') - Number(a.source === 'user');
        if (sourceDiff !== 0) return sourceDiff;
        const categoryDiff = catInfo(a.category).name.localeCompare(catInfo(b.category).name, 'zh-Hans-CN');
        if (categoryDiff !== 0) return categoryDiff;
        return a.name.localeCompare(b.name, 'zh-Hans-CN');
    });
}

export function getItemLibrary() {
    const items = readJson(STORAGE_KEYS.itemLibrary, buildSeedItemLibrary());
    return sortLibraryItems((items || []).map(normalizeLibraryItem));
}

export function saveItemLibrary(items) {
    writeJson(STORAGE_KEYS.itemLibrary, sortLibraryItems((items || []).map(normalizeLibraryItem)));
}

export function buildSeedItemLibrary() {
    const byName = new Map();
    const ref = { value: 1 };
    BASE_LIBRARY_ITEMS.forEach(def => registerSeedItem(byName, def, ref));
    getOfficialModules().forEach(module => {
        module.items.forEach(def => registerSeedItem(byName, def, ref));
    });
    return sortLibraryItems(Array.from(byName.values()));
}

export function registerSeedItem(map, def, ref) {
    const name = String(def.name || '').trim();
    if (!name || map.has(name)) return;
    const category = def.category || def.c || guessCat(name);
    map.set(name, normalizeLibraryItem({
        id: 'asset-seed-' + ref.value++,
        name,
        category,
        defaultQty: def.defaultQty || def.q || 1,
        bag: def.bag || suggestBagForItem(name, category),
        smartRule: def.smartRule || def.smart || inferSmartRule(name, category),
        source: 'system',
    }));
}

export function ensureItemLibrarySeeded() {
    const stored = readJson(STORAGE_KEYS.itemLibrary, null);
    const seeded = buildSeedItemLibrary();
    if (!stored || !stored.length) {
        saveItemLibrary(seeded);
        return;
    }

    const merged = (stored || []).map(normalizeLibraryItem);
    const byName = new Map(merged.map(item => [item.name, true]));
    seeded.forEach(item => {
        if (!byName.has(item.name)) merged.push(item);
    });
    saveItemLibrary(merged);
}

export function syncItemsIntoLibrary(items = []) {
    if (!items.length) return;
    const library = getItemLibrary();
    const byName = new Map(library.map(item => [item.name, true]));
    let changed = false;

    items.forEach(item => {
        const name = String(item?.name || '').trim();
        if (!name || byName.has(name)) return;
        const category = item.category || guessCat(name);
        const { smartRule, smartConfig } = resolveItemSmartPlan(name, category, item.smartRule, item.smartConfig);
        library.unshift(normalizeLibraryItem({
            id: 'asset-' + gid(),
            name,
            category,
            defaultQty: item.defaultQty || item.smartBaseQty || item.qty || 1,
            bag: item.bag || suggestBagForItem(name, category),
            smartRule,
            smartConfig,
            source: 'user',
        }));
        byName.set(name, true);
        changed = true;
    });

    if (changed) saveItemLibrary(library);
}

export function buildLibraryItemDraft(name, category) {
    const cat = category || guessCat(name);
    const { smartRule, smartConfig } = resolveItemSmartPlan(name, cat);
    return normalizeLibraryItem({
        id: 'asset-' + gid(),
        name,
        category: cat,
        defaultQty: 1,
        bag: suggestBagForItem(name, cat),
        smartRule,
        smartConfig,
        source: 'user',
    });
}

export function createModuleItemFromAsset(asset) {
    const { smartRule, smartConfig } = resolveItemSmartPlan(asset.name, asset.category, asset.smartRule, asset.smartConfig);
    return normalizeModuleItem({
        id: 'module-item-' + gid(),
        name: asset.name,
        category: asset.category,
        bag: asset.bag || suggestBagForItem(asset.name, asset.category),
        defaultQty: asset.defaultQty || 1,
        smartRule,
        smartConfig,
    });
}
