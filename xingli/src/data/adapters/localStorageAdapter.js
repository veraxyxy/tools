/**
 * LocalStorage Adapter
 * Web 浏览器环境使用的存储适配器
 */
export class LocalStorageAdapter {
    read(key) {
        try {
            return localStorage.getItem(key);
        } catch {
            return null;
        }
    }

    write(key, value) {
        try {
            localStorage.setItem(key, value);
            return true;
        } catch (e) {
            console.warn('[LocalStorageAdapter] write failed:', e);
            return false;
        }
    }

    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.warn('[LocalStorageAdapter] remove failed:', e);
        }
    }
}
