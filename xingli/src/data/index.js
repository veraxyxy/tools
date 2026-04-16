// Data layer barrel export
// All data-layer functions are re-exported from this single entry point.

export * from './constants.js';
export * from './utils.js';
export * from './seeds.js';
export * from './smartFill.js';
export * from './models.js';
export * from './store.js';
export * from './libraryService.js';
export * from './tripService.js';

// 导出 DataStore 类和 adapter（用于 Phase 2+）
export { DataStore, setStoreAdapter, getStore } from './store.js';
export { LocalStorageAdapter } from './adapters/localStorageAdapter.js';
