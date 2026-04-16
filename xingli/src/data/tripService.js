import { BABY_MODULE_IDS } from './constants.js';
import { gid, uniqueStrings, guessCat, suggestBagForItem } from './utils.js';
import { normalizeTripItem, normalizeModuleItem } from './models.js';
import { resolveItemSmartPlan, computeSmartQty, mergeTripItems } from './smartFill.js';
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

export function ensureBabyBaseModuleOnTripRecord(trip) {
    if (!trip) return;
    const baseModule = getBabyBaseModule();
    if (!baseModule) return;
    if ((trip.sourceModules || []).some(module => module.source === 'official' && module.id === baseModule.id)) return;
    const items = resolveOfficialModuleItems(baseModule, trip.days, trip.people);
    mergeTripItems(trip.items, items, trip, 'module');
    upsertTripSourceModule(trip, { source: 'official', id: baseModule.id, name: baseModule.name });
}
