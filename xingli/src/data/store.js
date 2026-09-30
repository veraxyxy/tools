import { STORAGE_KEYS } from './constants.js';
import { OFFICIAL_MODULES } from './seeds.js';
import { normalizeRecord, normalizeOfficialModule, normalizeLibraryItem } from './models.js';
import { LocalStorageAdapter } from './adapters/localStorageAdapter.js';

const RETIRED_OFFICIAL_MODULE_IDS = new Set([
    'module-baby-comfort',
    'module-baby-snacks',
]);
const OFFICIAL_SEED_VERSION = 5;
const REVISED_OFFICIAL_MODULE_IDS = new Set([
    'module-hygiene',
    'module-makeup',
    'module-docs',
    'module-skincare',
    'module-clothing',
    'module-baby-base',
    'module-baby-feeding',
    'module-baby-clothing',
    'module-baby-overnight',
    'module-baby-medicine',
    'module-baby-gear',
    'module-baby-vaccine',
    'module-baby-outdoor',
    'module-electronics',
    'module-international',
    'module-long-haul-flight',
]);
const LEGACY_OFFICIAL_MODULE_NAMES = {
    'module-hygiene': ['洗漱包'],
    'module-makeup': ['化妆包'],
    'module-docs': ['证件包'],
    'module-skincare': ['护肤包'],
    'module-clothing': ['衣服包'],
    'module-baby-base': ['宝宝基础包', '宝宝换洗护理包', '宝宝日常出门包'],
    'module-baby-feeding': ['喂养插件包', '宝宝喂养包'],
    'module-baby-clothing': ['宝宝衣物包'],
    'module-baby-overnight': ['过夜插件包', '宝宝洗澡包', '宝宝过夜补充包'],
    'module-baby-medicine': ['宝宝药品包'],
    'module-baby-gear': ['宝宝出行装备包'],
    'module-baby-vaccine': ['疫苗插件包', '宝宝疫苗场景'],
    'module-baby-outdoor': ['户外插件包', '宝宝户外场景'],
    'module-electronics': ['电子包'],
    'module-international': ['海外出行包'],
    'module-long-haul-flight': ['长途飞机场景'],
};

/**
 * DataStore
 * 数据存储核心类。接受一个 adapter 实例，所有存储操作通过 adapter 完成。
 * 可在运行时切换 adapter（如切换到 SQLite 或 API adapter）。
 */
export class DataStore {
    constructor(adapter = new LocalStorageAdapter()) {
        this._adapter = adapter;
    }

    _parseJson(raw, fallback) {
        try {
            return raw ? JSON.parse(raw) : fallback;
        } catch {
            return fallback;
        }
    }

    readJson(key, fallback) {
        return this._parseJson(this._adapter.read(key), fallback);
    }

    writeJson(key, value) {
        return this._adapter.write(key, JSON.stringify(value)) !== false;
    }

    // ===== 记录（Trip + Module 混存）=====

    getRecords() {
        return this.readJson(STORAGE_KEYS.records, [])
            .map(normalizeRecord)
            .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));
    }

    saveRecords(records) {
        return this.writeJson(STORAGE_KEYS.records, records);
    }

    saveRecord(record) {
        const records = this.getRecords();
        const idx = records.findIndex(item => item.id === record.id);
        const normalized = normalizeRecord(record);
        if (idx >= 0) records[idx] = normalized;
        else records.unshift(normalized);
        return this.saveRecords(records);
    }

    // ===== 官方小包 =====

    getOfficialModules() {
        const stored = this.readJson(STORAGE_KEYS.officialModules, null);
        const deletedIds = new Set(this.readJson(STORAGE_KEYS.deletedOfficialModules, []));
        const storedSeedVersion = Number(this.readJson(STORAGE_KEYS.officialSeedVersion, 0)) || 0;
        const shouldRefreshOfficialSeeds = storedSeedVersion < OFFICIAL_SEED_VERSION;
        if (!stored) {
            this.writeJson(STORAGE_KEYS.officialSeedVersion, OFFICIAL_SEED_VERSION);
            return OFFICIAL_MODULES
                .filter(module => !deletedIds.has(module.id))
                .map(normalizeOfficialModule);
        }

        const storedModules = (stored || [])
            .map(normalizeOfficialModule)
            .filter(module => !RETIRED_OFFICIAL_MODULE_IDS.has(module.id));
        const storedById = new Map(storedModules.map(module => [module.id, module]));
        const seedIds = new Set(OFFICIAL_MODULES.map(module => module.id));
        const seeded = OFFICIAL_MODULES
            .filter(module => !deletedIds.has(module.id))
            .map(module => {
                const storedModule = storedById.get(module.id);
                const legacyNames = LEGACY_OFFICIAL_MODULE_NAMES[module.id] || [];
                const canRefreshSeed = !storedModule || legacyNames.includes(storedModule.name);
                return shouldRefreshOfficialSeeds
                    && REVISED_OFFICIAL_MODULE_IDS.has(module.id)
                    && canRefreshSeed
                    ? normalizeOfficialModule(module)
                    : (storedModule || normalizeOfficialModule(module));
            });
        const extra = storedModules.filter(module => !seedIds.has(module.id) && !deletedIds.has(module.id));
        if (shouldRefreshOfficialSeeds) {
            this.writeJson(STORAGE_KEYS.officialSeedVersion, OFFICIAL_SEED_VERSION);
            this.saveOfficialModules([...seeded, ...extra]);
        }
        return [...seeded, ...extra];
    }

    saveOfficialModules(modules) {
        return this.writeJson(STORAGE_KEYS.officialModules, (modules || []).map(normalizeOfficialModule));
    }

    markOfficialModuleDeleted(moduleId) {
        const deleted = new Set(this.readJson(STORAGE_KEYS.deletedOfficialModules, []));
        deleted.add(moduleId);
        return this.writeJson(STORAGE_KEYS.deletedOfficialModules, [...deleted]);
    }

    // ===== 便捷访问 =====

    getTrips() {
        return this.getRecords().filter(record => record.recordType === 'trip');
    }

    getMyModules() {
        return this.getRecords().filter(record => record.recordType === 'module');
    }
}

// ===== 全局单例（向后兼容）=====

let _store = new DataStore();

export function getStore() {
    return _store;
}

/**
 * 切换存储 adapter（运行时热切换，用于切换到 SQLite/API 等）
 */
export function setStoreAdapter(adapter) {
    _store = new DataStore(adapter);
}

// ===== 兼容层：直接导出与旧 API 同名的函数 =====
// 所有函数代理到全局单例，保持 tripService / libraryService 无需改动

export function readJson(key, fallback) {
    return _store.readJson(key, fallback);
}

export function writeJson(key, value) {
    return _store.writeJson(key, value);
}

export function getRecords() {
    return _store.getRecords();
}

export function saveRecords(records) {
    return _store.saveRecords(records);
}

export function saveRecord(record) {
    return _store.saveRecord(record);
}

export function getOfficialModules() {
    return _store.getOfficialModules();
}

export function saveOfficialModules(modules) {
    return _store.saveOfficialModules(modules);
}

export function markOfficialModuleDeleted(moduleId) {
    return _store.markOfficialModuleDeleted(moduleId);
}

export function getTrips() {
    return _store.getTrips();
}

export function getMyModules() {
    return _store.getMyModules();
}
