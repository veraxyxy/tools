import { STORAGE_KEYS } from './constants.js';
import { OFFICIAL_MODULES } from './seeds.js';
import { normalizeRecord, normalizeOfficialModule, normalizeLibraryItem } from './models.js';
import { LocalStorageAdapter } from './adapters/localStorageAdapter.js';

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
        this._adapter.write(key, JSON.stringify(value));
    }

    // ===== 记录（Trip + Module 混存）=====

    getRecords() {
        return this.readJson(STORAGE_KEYS.records, [])
            .map(normalizeRecord)
            .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));
    }

    saveRecords(records) {
        this.writeJson(STORAGE_KEYS.records, records);
    }

    saveRecord(record) {
        const records = this.getRecords();
        const idx = records.findIndex(item => item.id === record.id);
        const normalized = normalizeRecord(record);
        if (idx >= 0) records[idx] = normalized;
        else records.unshift(normalized);
        this.saveRecords(records);
    }

    // ===== 官方小包 =====

    getOfficialModules() {
        return this.readJson(STORAGE_KEYS.officialModules, OFFICIAL_MODULES)
            .map(normalizeOfficialModule);
    }

    saveOfficialModules(modules) {
        this.writeJson(STORAGE_KEYS.officialModules, (modules || []).map(normalizeOfficialModule));
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
    _store.writeJson(key, value);
}

export function getRecords() {
    return _store.getRecords();
}

export function saveRecords(records) {
    _store.saveRecords(records);
}

export function saveRecord(record) {
    _store.saveRecord(record);
}

export function getOfficialModules() {
    return _store.getOfficialModules();
}

export function saveOfficialModules(modules) {
    _store.saveOfficialModules(modules);
}

export function getTrips() {
    return _store.getTrips();
}

export function getMyModules() {
    return _store.getMyModules();
}
