import { BABY_MODULE_IDS } from './constants.js';
import { gid, uniqueStrings, guessCat, suggestBagForItem } from './utils.js';
import { normalizeTripItem, normalizeModuleItem } from './models.js';
import { resolveItemSmartPlan, computeSmartQty, mergeTripItems, applyTripSmartFill } from './smartFill.js';
import { getOfficialModules, getMyModules } from './store.js';

export function getModuleEntity(source, id) {
    if (source === 'official') return getOfficialModules().find(module => module.id === id) || null;
    return getMyModules().find(module => module.id === id) || null;
}

export function resolveOfficialModuleItems(module, days, people) {
    return (module.items || []).map(item => createTripItemFromModuleItem(normalizeModuleItem(item), days, people, module.name));
}

export function resolveCustomModuleItems(module, days, people) {
    return (module.items || []).map(item => createTripItemFromModuleItem(item, days, people, module.name));
}

export function createTripItemFromDef(def, days, people, sourceModuleName) {
    const category = def.c || def.category || guessCat(def.name);
    const baseQty = Math.max(1, parseInt(def.q) || 1);
    const { smartRule, smartConfig } = resolveItemSmartPlan(def.name, category, def.smartRule || def.smart, def.smartConfig);
    return normalizeTripItem({
        id: 'item-' + gid(),
        name: def.name,
        category,
        bag: def.bag || suggestBagForItem(def.name, category),
        smartRule,
        smartConfig,
        smartBaseQty: baseQty,
        qty: computeSmartQty(baseQty, smartRule, days, people, smartConfig),
        packed: false,
        notes: '',
        sourceModules: sourceModuleName ? [sourceModuleName] : [],
        tags: Array.isArray(def.tags) ? [...def.tags] : [],
    });
}

export function createTripItemFromModuleItem(item, days, people, sourceModuleName) {
    const { smartRule, smartConfig } = resolveItemSmartPlan(item.name, item.category, item.smartRule, item.smartConfig);
    return normalizeTripItem({
        id: 'item-' + gid(),
        name: item.name,
        category: item.category,
        bag: item.bag,
        smartRule,
        smartConfig,
        smartBaseQty: item.defaultQty,
        qty: computeSmartQty(item.defaultQty, smartRule, days, people, smartConfig),
        packed: false,
        notes: '',
        sourceModules: sourceModuleName ? [sourceModuleName] : [],
        tags: Array.isArray(item.tags) ? [...item.tags] : [],
    });
}

export function createTripItemFromAsset(asset, days, people) {
    const { smartRule, smartConfig } = resolveItemSmartPlan(asset.name, asset.category, asset.smartRule, asset.smartConfig);
    return normalizeTripItem({
        id: 'item-' + gid(),
        name: asset.name,
        category: asset.category,
        bag: asset.bag || suggestBagForItem(asset.name, asset.category),
        smartRule,
        smartConfig,
        smartBaseQty: asset.defaultQty || 1,
        qty: computeSmartQty(asset.defaultQty || 1, smartRule, days, people, smartConfig),
        packed: false,
        notes: '',
        sourceModules: [],
        tags: Array.isArray(asset.tags) ? [...asset.tags] : [],
    });
}

export function getTripProgress(trip) {
    const total = trip.items?.length || 0;
    const packed = trip.items?.filter(item => item.packed).length || 0;
    return {
        total,
        packed,
        pending: Math.max(0, total - packed),
        pct: total ? Math.round((packed / total) * 100) : 0,
    };
}

export function getTripStatus(trip) {
    const progress = getTripProgress(trip);
    if (progress.total > 0 && progress.packed >= progress.total) return { key: 'done', label: '已完成', icon: '✅' };
    if (progress.packed > 0) return { key: 'packing', label: '打包中', icon: '🎒' };
    return { key: 'planning', label: '规划中', icon: '📝' };
}

export function formatTripMeta(trip) {
    const modules = trip.sourceModules?.length ? ` \u00B7 ${trip.sourceModules.length} 个小包` : '';
    return `${trip.days || 1} 天 \u00B7 ${trip.people || 1} 人 \u00B7 ${trip.items?.length || 0} 件${modules}`;
}

export function formatTripSourceSummary(trip) {
    if (!trip.sourceModules?.length) return '自由添加物品';
    const names = trip.sourceModules.map(module => module.name);
    if (names.length <= 2) return names.join(' + ');
    return names.slice(0, 2).join(' + ') + ` +${names.length - 2} 个小包`;
}

export function formatItemSource(item) {
    if (!item.sourceModules?.length) return '';
    if (item.sourceModules.length === 1) return '来自 ' + item.sourceModules[0];
    return `来自 ${item.sourceModules.length} 个小包`;
}

export function getModuleKey(source, id) {
    return `${source}:${id}`;
}

export function splitModuleKey(key) {
    return key.split(':');
}

export function getBabyBaseModule() {
    return getOfficialModules().find(module => module.id === BABY_MODULE_IDS.base) || null;
}

export function isBabyModuleEntity(module) {
    if (!module) return false;
    if (module.group === 'baby') return true;
    if (module.purpose === 'family') return true;
    const blob = [module.name, module.desc, ...(module.tags || []), ...((module.items || []).map(item => item.name || ''))].join(' ');
    return /宝宝|带娃|疫苗|奶瓶|尿不湿|辅食/.test(blob);
}

export function isBabyBaseModuleEntity(module) {
    return !!module && module.id === BABY_MODULE_IDS.base;
}

export function upsertTripSourceModule(trip, sourceModule) {
    if (!trip || !sourceModule) return;
    const existing = trip.sourceModules || [];
    if (!existing.some(module => module.source === sourceModule.source && module.id === sourceModule.id)) {
        existing.push(sourceModule);
        trip.sourceModules = existing;
    }
}

export function isModuleOnTrip(trip, source, moduleId) {
    return (trip?.sourceModules || []).some(module => module.source === source && module.id === moduleId);
}

export function removeModuleFromTrip(trip, source, moduleId) {
    const entity = getModuleEntity(source, moduleId);
    if (!entity || !trip) return { changed: false, trip, moduleName: '', removedItems: 0 };

    const moduleName = entity.name;
    if (!isModuleOnTrip(trip, source, moduleId)) {
        return { changed: false, trip, moduleName, removedItems: 0 };
    }

    trip.sourceModules = (trip.sourceModules || []).filter(
        module => !(module.source === source && module.id === moduleId)
    );

    let removedItems = 0;
    const nextItems = [];
    (trip.items || []).forEach(item => {
        const sources = [...(item.sourceModules || [])];
        if (!sources.length) {
            nextItems.push(item);
            return;
        }
        if (!sources.includes(moduleName)) {
            nextItems.push(item);
            return;
        }
        const remaining = sources.filter(name => name !== moduleName);
        if (!remaining.length) {
            removedItems += 1;
            return;
        }
        nextItems.push({
            ...item,
            sourceModules: uniqueStrings(remaining),
        });
    });

    trip.items = nextItems.map(normalizeTripItem);
    return { changed: true, trip, moduleName, removedItems };
}

export function ensureBabyBaseModuleOnTripRecord(trip) {
    if (!trip) return;
    const baseModule = getBabyBaseModule();
    if (!baseModule) return;
    if ((trip.sourceModules || []).some(module => module.source === 'official' && module.id === baseModule.id)) return;
    const items = resolveOfficialModuleItems(baseModule, trip.days, trip.people);
    mergeTripItems(trip.items, items, trip, 'module');
    upsertTripSourceModule(trip, { source: 'official', id: baseModule.id, name: baseModule.name });
}

export function tripItemSnapshotKey(item) {
    return `${item.name}::${item.category}`;
}

export function getTripModuleEntries(trip) {
    const entries = [];
    const seen = new Set();
    (trip?.sourceModules || []).forEach(meta => {
        const entity = getModuleEntity(meta.source, meta.id);
        if (!entity) return;
        const key = `${meta.source}:${meta.id}`;
        if (seen.has(key)) return;
        seen.add(key);
        entries.push({
            source: meta.source,
            module: entity,
            meta: { source: meta.source, id: meta.id, name: meta.name || entity.name },
        });
    });
    return entries;
}

export function ensureBabyBaseInModuleEntries(entries) {
    const hasBabyAddon = entries.some(entry => isBabyModuleEntity(entry.module) && !isBabyBaseModuleEntity(entry.module));
    if (!hasBabyAddon) return entries;
    if (entries.some(entry => isBabyBaseModuleEntity(entry.module))) return entries;
    const baseModule = getBabyBaseModule();
    if (!baseModule) return entries;
    return [{
        source: 'official',
        module: baseModule,
        meta: { source: 'official', id: baseModule.id, name: baseModule.name },
    }, ...entries];
}

export function buildTripItemsFromModuleEntries(trip, entries) {
    const sourceModules = entries.map(entry => entry.meta);
    const tripContext = {
        days: trip.days,
        people: trip.people,
        sourceModules,
    };
    const items = [];
    entries.forEach(({ source, module }) => {
        const resolved = source === 'official'
            ? resolveOfficialModuleItems(module, trip.days, trip.people)
            : resolveCustomModuleItems(module, trip.days, trip.people);
        mergeTripItems(items, resolved, tripContext, 'module');
    });
    applyTripSmartFill({ days: trip.days, people: trip.people, items, sourceModules }, false);
    return { items, sourceModules };
}

/**
 * 按行程关联的小包定义重新生成小包来源物品。
 * 手动添加的物品（无 sourceModules）会保留；打包状态、备注、标签、手调数量尽量保留。
 */
export function resyncTripFromSourceModules(trip, options = {}) {
    const preservePacked = options.preservePacked !== false;
    const preserveLocked = options.preserveLocked !== false;
    const preserveManualFields = options.preserveManualFields !== false;

    const manualItems = (trip.items || []).filter(item => !(item.sourceModules || []).length);
    const oldModuleSnapshots = new Map();
    (trip.items || []).filter(item => (item.sourceModules || []).length)
        .forEach(item => oldModuleSnapshots.set(tripItemSnapshotKey(item), normalizeTripItem(item)));

    const hadModuleRefs = (trip.sourceModules || []).length > 0;
    const entries = ensureBabyBaseInModuleEntries(getTripModuleEntries(trip));

    if (!entries.length) {
        if (!hadModuleRefs) {
            return { changed: false, trip, added: 0, removed: 0, updated: 0, moduleCount: 0 };
        }
        trip.sourceModules = [];
        trip.items = manualItems.map(normalizeTripItem);
        return {
            changed: oldModuleSnapshots.size > 0,
            trip,
            added: 0,
            removed: oldModuleSnapshots.size,
            updated: 0,
            moduleCount: 0,
        };
    }

    const beforeKeys = new Set(oldModuleSnapshots.keys());
    const { items: moduleItems, sourceModules } = buildTripItemsFromModuleEntries(trip, entries);
    const afterKeys = new Set(moduleItems.map(tripItemSnapshotKey));

    moduleItems.forEach(item => {
        const old = oldModuleSnapshots.get(tripItemSnapshotKey(item));
        if (!old) return;
        if (preservePacked) item.packed = old.packed;
        if (preserveManualFields) {
            if (old.notes) item.notes = old.notes;
            if (old.tags?.length) item.tags = [...old.tags];
        }
        if (preserveLocked && old.smartLocked) {
            item.smartLocked = true;
            item.qty = old.qty;
        }
    });

    const keptManual = [];
    let mergedDuplicates = 0;
    manualItems.forEach(item => {
        const key = tripItemSnapshotKey(item);
        const moduleItem = moduleItems.find(entry => tripItemSnapshotKey(entry) === key);
        if (!moduleItem) {
            keptManual.push(item);
            return;
        }
        mergedDuplicates += 1;
        moduleItem.qty = Math.max(moduleItem.qty || 1, item.qty || 1);
        if (preservePacked && item.packed) moduleItem.packed = true;
        if (preserveManualFields) {
            if (item.notes && !moduleItem.notes) moduleItem.notes = item.notes;
            if (item.tags?.length) {
                moduleItem.tags = uniqueStrings([...(moduleItem.tags || []), ...item.tags]);
            }
        }
        if (preserveLocked && item.smartLocked) {
            moduleItem.smartLocked = true;
            moduleItem.qty = item.qty;
        }
    });

    trip.sourceModules = sourceModules;
    trip.items = [...moduleItems.map(normalizeTripItem), ...keptManual.map(normalizeTripItem)];
    applyTripSmartFill(trip, false);

    let added = 0;
    let removed = 0;
    let updated = 0;
    afterKeys.forEach(key => { if (!beforeKeys.has(key)) added += 1; });
    beforeKeys.forEach(key => { if (!afterKeys.has(key)) removed += 1; });
    moduleItems.forEach(item => {
        const old = oldModuleSnapshots.get(tripItemSnapshotKey(item));
        if (!old) return;
        if (old.qty !== item.qty || old.smartBaseQty !== item.smartBaseQty || old.smartRule !== item.smartRule) {
            updated += 1;
        }
    });

    return {
        changed: added > 0 || removed > 0 || updated > 0 || mergedDuplicates > 0,
        trip,
        added,
        removed,
        updated,
        mergedDuplicates,
        moduleCount: entries.length,
    };
}
