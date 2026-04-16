import { DEFAULT_BAGS } from './constants.js';
import { gid, deepClone, uniqueStrings, guessCat, suggestBagForItem } from './utils.js';
import { normalizeSmartConfig, inferSmartConfig, inferSmartRule } from './smartFill.js';

export function normalizeRecord(record) {
    const type = record.recordType || (record.isTemplate ? 'module' : 'trip');
    return type === 'module' ? normalizeModuleRecord(record) : normalizeTripRecord(record);
}

export function normalizeTripRecord(record) {
    const bags = Array.isArray(record.bags) && record.bags.length ? record.bags : deepClone(DEFAULT_BAGS);
    return {
        ...record,
        recordType: 'trip',
        isTemplate: false,
        days: Math.max(1, parseInt(record.days) || 1),
        people: Math.max(1, parseInt(record.people) || 1),
        bags,
        sourceModules: Array.isArray(record.sourceModules) ? record.sourceModules.map(module => ({
            source: module.source || 'custom',
            id: module.id || '',
            name: module.name || '未命名小包',
        })) : [],
        items: (record.items || []).map(normalizeTripItem),
        createdAt: record.createdAt || new Date().toISOString(),
        updatedAt: record.updatedAt || record.createdAt || new Date().toISOString(),
    };
}

export function normalizeOfficialModule(module) {
    return {
        id: module?.id || ('official-module-' + gid()),
        name: module?.name || '未命名官方小包',
        icon: module?.icon || '🧰',
        purpose: module?.purpose || 'starter',
        group: module?.group || '',
        role: module?.role || '',
        defaultOn: Boolean(module?.defaultOn),
        desc: module?.desc || '',
        tags: Array.isArray(module?.tags) ? uniqueStrings(module.tags) : [],
        items: (module?.items || []).map(normalizeModuleItem),
    };
}

export function normalizeModuleRecord(record) {
    return {
        ...record,
        recordType: 'module',
        isTemplate: true,
        icon: record.icon || record.kitMeta?.icon || '🧰',
        desc: record.desc || record.kitMeta?.desc || '',
        purpose: record.purpose || 'custom',
        tags: Array.isArray(record.tags) ? record.tags : [],
        items: (record.items || []).map(normalizeModuleItem),
        createdAt: record.createdAt || new Date().toISOString(),
        updatedAt: record.updatedAt || record.createdAt || new Date().toISOString(),
    };
}

export function normalizeTripItem(item) {
    const category = item.category || guessCat(item.name || '');
    const smartConfig = normalizeSmartConfig(item.smartConfig || inferSmartConfig(item.name, category));
    return {
        id: item.id || ('item-' + gid()),
        name: item.name || '未命名物品',
        category,
        bag: item.bag || suggestBagForItem(item.name, category),
        qty: Math.max(1, parseInt(item.qty) || 1),
        packed: Boolean(item.packed),
        notes: item.notes || '',
        smartRule: item.smartRule || (smartConfig ? 'formula' : 'fixed'),
        smartConfig,
        smartBaseQty: Math.max(1, parseInt(item.smartBaseQty) || parseInt(item.defaultQty) || parseInt(item.qty) || 1),
        smartLocked: Boolean(item.smartLocked),
        sourceModules: Array.isArray(item.sourceModules) ? uniqueStrings(item.sourceModules) : (item.sourceModule ? [item.sourceModule] : []),
        tags: Array.isArray(item?.tags) ? uniqueStrings(item.tags) : [],
    };
}

export function normalizeModuleItem(item) {
    const category = item.category || guessCat(item.name || '');
    const smartConfig = normalizeSmartConfig(item.smartConfig || inferSmartConfig(item.name, category));
    return {
        id: item.id || ('module-item-' + gid()),
        name: item.name || '未命名物品',
        category,
        bag: item.bag || suggestBagForItem(item.name, category),
        defaultQty: Math.max(1, parseInt(item.defaultQty) || parseInt(item.smartBaseQty) || parseInt(item.qty) || 1),
        smartRule: item.smartRule || (smartConfig ? 'formula' : inferSmartRule(item.name, category)),
        smartConfig,
    };
}

export function normalizeLibraryItem(item) {
    const name = String(item?.name || '未命名物品').trim();
    const category = item?.category || guessCat(name);
    const smartConfig = normalizeSmartConfig(item?.smartConfig || inferSmartConfig(name, category));
    return {
        id: item?.id || ('asset-' + gid()),
        name,
        category,
        defaultQty: Math.max(1, parseInt(item?.defaultQty) || 1),
        bag: item?.bag || suggestBagForItem(name, category),
        smartRule: smartConfig ? 'formula' : (item?.smartRule || inferSmartRule(name, category)),
        smartConfig,
        source: item?.source === 'user' ? 'user' : 'system',
        tags: Array.isArray(item?.tags) ? uniqueStrings(item.tags) : [],
    };
}
