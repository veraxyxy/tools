import { BABY_MODULE_IDS } from './constants.js';
import { uniqueStrings } from './utils.js';
import { normalizeTripItem } from './models.js';

export function normalizeSmartConfig(config) {
    if (!config) return null;
    const sceneFactors = {};
    const rawSceneFactors = config.sceneFactors || {};
    Object.keys(rawSceneFactors).forEach(key => {
        const value = parseInt(rawSceneFactors[key]);
        if (Number.isFinite(value) && value > 0) sceneFactors[key] = value;
    });
    return {
        mode: 'formula',
        dailyIncrement: Math.max(0, parseInt(config.dailyIncrement) || parseInt(config.perDay) || 0),
        personIncrement: Math.max(0, parseInt(config.personIncrement) || 0),
        sceneFactors,
    };
}

export function mergeSmartConfig(currentConfig, nextConfig) {
    const current = normalizeSmartConfig(currentConfig);
    const next = normalizeSmartConfig(nextConfig);
    if (!current) return next;
    if (!next) return current;
    const mergedSceneFactors = { ...current.sceneFactors };
    Object.keys(next.sceneFactors).forEach(key => {
        mergedSceneFactors[key] = Math.max(mergedSceneFactors[key] || 0, next.sceneFactors[key]);
    });
    return {
        mode: 'formula',
        dailyIncrement: Math.max(current.dailyIncrement, next.dailyIncrement),
        personIncrement: Math.max(current.personIncrement, next.personIncrement),
        sceneFactors: mergedSceneFactors,
    };
}

export function getSmartSceneFactor(smartConfig, tripContext) {
    const config = normalizeSmartConfig(smartConfig);
    if (!config || !tripContext?.sourceModules?.length) return 0;
    const activeModuleIds = new Set((tripContext.sourceModules || []).map(module => module.id));
    return Object.keys(config.sceneFactors).reduce((sum, moduleId) => sum + (activeModuleIds.has(moduleId) ? config.sceneFactors[moduleId] : 0), 0);
}

export function computeSmartQty(baseQty, smartRule, days, people, smartConfig = null, tripContext = null) {
    const safeBase = Math.max(1, parseInt(baseQty) || 1);
    const safeDays = Math.max(1, parseInt(days) || 1);
    const safePeople = Math.max(1, parseInt(people) || 1);

    if (smartRule === 'formula') {
        const config = normalizeSmartConfig(smartConfig);
        if (!config) return safeBase;
        return Math.max(1, safeBase + safeDays * config.dailyIncrement + Math.max(0, safePeople - 1) * config.personIncrement + getSmartSceneFactor(config, tripContext));
    }
    if (smartRule === 'perPerson') return safeBase * safePeople;
    if (smartRule === 'perDay') return safeBase * safeDays;
    if (smartRule === 'perPersonPerDay') return safeBase * safeDays * safePeople;
    return safeBase;
}

export function strongerSmartRule(currentRule, nextRule) {
    const order = { fixed: 0, perPerson: 1, perDay: 2, perPersonPerDay: 3, formula: 4 };
    return (order[nextRule] || 0) > (order[currentRule] || 0) ? nextRule : currentRule;
}

export function smartRuleLabel(rule, smartConfig = null) {
    if (rule === 'formula') {
        const config = normalizeSmartConfig(smartConfig);
        if (!config) return '基础量 + 天数增量 + 场景系数';
        return `基础量 + ${config.dailyIncrement}\u00D7天数 + 场景系数`;
    }
    if (rule === 'perPerson') return '按人数建议';
    if (rule === 'perDay') return '按天数建议';
    if (rule === 'perPersonPerDay') return '按天数 \u00D7 人数建议';
    return '固定数量';
}

export function smartRuleShort(rule) {
    if (rule === 'formula') return '公式补量';
    if (rule === 'perPerson') return '按人数';
    if (rule === 'perDay') return '按天数';
    if (rule === 'perPersonPerDay') return '按天/人';
    return '固定';
}

export function inferSmartConfig(name, category) {
    const n = String(name || '').toLowerCase();
    if (['尿不湿', '纸尿裤'].some(keyword => n.includes(keyword))) {
        return normalizeSmartConfig({
            dailyIncrement: 3,
            sceneFactors: {
                [BABY_MODULE_IDS.vaccine]: 1,
                [BABY_MODULE_IDS.feeding]: 1,
                [BABY_MODULE_IDS.overnight]: 3,
                [BABY_MODULE_IDS.outdoor]: 2,
            },
        });
    }
    if (['备用衣裤', '宝宝衣服', '宝宝衣裤'].some(keyword => n.includes(keyword))) {
        return normalizeSmartConfig({
            dailyIncrement: 1,
            sceneFactors: {
                [BABY_MODULE_IDS.overnight]: 1,
                [BABY_MODULE_IDS.outdoor]: 1,
            },
        });
    }
    if ((n.includes('湿巾') && (n.includes('婴儿') || n.includes('宝宝'))) || n === '湿巾（婴儿专用）') {
        return normalizeSmartConfig({
            dailyIncrement: 1,
            sceneFactors: {
                [BABY_MODULE_IDS.overnight]: 1,
                [BABY_MODULE_IDS.outdoor]: 1,
            },
        });
    }
    if (n.includes('棉柔巾')) {
        return normalizeSmartConfig({
            dailyIncrement: 1,
            sceneFactors: {
                [BABY_MODULE_IDS.feeding]: 1,
                [BABY_MODULE_IDS.overnight]: 1,
            },
        });
    }
    if (n.includes('隔尿垫')) {
        return normalizeSmartConfig({
            dailyIncrement: 1,
            sceneFactors: {
                [BABY_MODULE_IDS.overnight]: 1,
                [BABY_MODULE_IDS.outdoor]: 1,
            },
        });
    }
    if (['围兜', '围嘴', '口水巾'].some(keyword => n.includes(keyword))) {
        return normalizeSmartConfig({
            dailyIncrement: 1,
            sceneFactors: {
                [BABY_MODULE_IDS.feeding]: 1,
                [BABY_MODULE_IDS.overnight]: 1,
            },
        });
    }
    if (n.includes('大量零食')) {
        return normalizeSmartConfig({
            dailyIncrement: 1,
            sceneFactors: {
                [BABY_MODULE_IDS.outdoor]: 2,
            },
        });
    }
    return null;
}

export function inferSmartRule(name, category) {
    const n = String(name || '').toLowerCase();
    if (inferSmartConfig(name, category)) return 'formula';
    if (category === 'clothing') {
        if (['t恤', '上衣', '衬衫', '裤', '裙', '内衣', '内裤', '文胸', '袜', '打底裤', '宝宝袜子'].some(keyword => n.includes(keyword))) {
            return 'perPersonPerDay';
        }
        if (['睡衣', '外套', '鞋', '拖鞋', '帽子'].some(keyword => n.includes(keyword))) {
            return 'perPerson';
        }
        return 'perPerson';
    }
    if (['奶瓶', '毛巾', '浴巾'].some(keyword => n.includes(keyword))) return 'perPerson';
    return 'fixed';
}

export function resolveItemSmartPlan(name, category, rawRule = null, rawConfig = null) {
    const smartConfig = normalizeSmartConfig(rawConfig || inferSmartConfig(name, category));
    const fallbackRule = inferSmartRule(name, category);
    const smartRule = rawRule || (smartConfig ? 'formula' : fallbackRule);
    return {
        smartRule: smartConfig && smartRule === 'fixed' ? 'formula' : smartRule,
        smartConfig,
    };
}

export function mergeTripItems(targetItems, incomingItems, tripContext, strategy = 'manual') {
    incomingItems.forEach(candidate => {
        const existing = targetItems.find(item => item.name === candidate.name && item.category === candidate.category);
        if (!existing) {
            targetItems.push(normalizeTripItem(candidate));
            return;
        }

        existing.sourceModules = uniqueStrings([...(existing.sourceModules || []), ...(candidate.sourceModules || [])]);
        existing.notes = existing.notes || candidate.notes || '';

        if (strategy === 'module') {
            existing.smartRule = strongerSmartRule(existing.smartRule, candidate.smartRule);
            existing.smartConfig = mergeSmartConfig(existing.smartConfig, candidate.smartConfig);
            existing.smartBaseQty = Math.max(existing.smartBaseQty || existing.qty, candidate.smartBaseQty || candidate.qty || 1);
            if (!existing.smartLocked) {
                existing.qty = Math.max(
                    existing.qty,
                    candidate.qty,
                    computeSmartQty(existing.smartBaseQty || 1, existing.smartRule, tripContext.days, tripContext.people, existing.smartConfig, tripContext)
                );
            } else {
                existing.qty = Math.max(existing.qty, candidate.qty);
            }
        } else {
            existing.qty += candidate.qty;
            if (existing.smartRule !== 'fixed') existing.smartLocked = true;
        }
    });
}

export function applyTripSmartFill(trip, unlockAll = false) {
    trip.items = trip.items.map(item => {
        const next = normalizeTripItem(item);
        if (unlockAll) next.smartLocked = false;
        if (next.smartRule !== 'fixed' && !next.smartLocked) {
            next.qty = computeSmartQty(next.smartBaseQty || 1, next.smartRule, trip.days, trip.people, next.smartConfig, trip);
        }
        return next;
    });
}
