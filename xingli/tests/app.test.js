/**
 * 出行打包助手 - 单元测试
 * 测试 src/data/ 纯函数层（零 DOM 依赖）
 */

const { describe, test, expect } = require('@jest/globals');
const {
    DEFAULT_CATEGORIES,
    DEFAULT_BAGS,
    CATEGORY_BAG_MAP,
    BABY_MODULE_IDS,
    guessCat,
    matchCat,
    gid,
    catInfo,
    esc,
    bagName,
    parseBulkNames,
    computeSmartQty,
    inferSmartConfig,
    normalizeTripRecord,
    normalizeTripItem,
    resyncTripFromSourceModules,
    removeModuleFromTrip,
    isModuleOnTrip,
    mergeTripItems,
    applyTripSmartFill,
    getTripProgress,
    getTripStatus,
    saveOfficialModules,
} = require('../src/data/index.js');

// ===== guessCat 智能分类函数 =====

describe('guessCat 智能分类函数', () => {
    test('证件类 - 身份证', () => { expect(guessCat('身份证')).toBe('docs'); });
    test('证件类 - 护照', () => { expect(guessCat('护照')).toBe('docs'); });
    test('证件类 - 驾照', () => { expect(guessCat('驾照')).toBe('docs'); });
    test('证件类 - 社保卡', () => { expect(guessCat('社保卡')).toBe('docs'); });
    test('证件类 - 医保卡', () => { expect(guessCat('医保卡')).toBe('docs'); });
    test('电子设备类 - 充电宝', () => { expect(guessCat('充电宝')).toBe('electronics'); });
    test('电子设备类 - 数据线', () => { expect(guessCat('数据线')).toBe('electronics'); });
    test('电子设备类 - 耳机', () => { expect(guessCat('耳机')).toBe('electronics'); });
    test('电子设备类 - 插线板', () => { expect(guessCat('插线板')).toBe('electronics'); });
    test('衣物类 - T恤', () => { expect(guessCat('T恤')).toBe('clothing'); });
    test('衣物类 - 内裤', () => { expect(guessCat('内裤')).toBe('clothing'); });
    test('衣物类 - 连衣裙', () => { expect(guessCat('连衣裙')).toBe('clothing'); });
    test('衣物类 - 宝宝衣服', () => { expect(guessCat('宝宝衣服')).toBe('clothing'); });
    test('洗漱类 - 牙刷', () => { expect(guessCat('牙刷')).toBe('hygiene'); });
    test('洗漱类 - 洗面奶', () => { expect(guessCat('洗面奶')).toBe('hygiene'); });
    test('洗漱类 - 牙膏', () => { expect(guessCat('牙膏')).toBe('hygiene'); });
    test('洗漱类 - 牙线', () => { expect(guessCat('牙线')).toBe('hygiene'); });
    test('护肤类 - 面霜', () => { expect(guessCat('面霜')).toBe('skincare'); });
    test('护肤类 - 防晒霜', () => { expect(guessCat('防晒霜')).toBe('skincare'); });
    test('护肤类 - 护臀膏', () => { expect(guessCat('护臀膏')).toBe('skincare'); });
    test('化妆类 - 口红', () => { expect(guessCat('口红')).toBe('makeup'); });
    test('化妆类 - 粉底', () => { expect(guessCat('粉底')).toBe('makeup'); });
    test('化妆类 - 化妆刷', () => { expect(guessCat('化妆刷')).toBe('makeup'); });
    test('药品类 - 感冒药', () => { expect(guessCat('感冒药')).toBe('medicine'); });
    test('药品类 - 创可贴', () => { expect(guessCat('创可贴')).toBe('medicine'); });
    test('药品类 - 退烧贴', () => { expect(guessCat('退烧贴')).toBe('medicine'); });
    test('随身小包类 - 钱包', () => { expect(guessCat('钱包')).toBe('small-bag'); });
    test('随身小包类 - 钥匙', () => { expect(guessCat('钥匙')).toBe('small-bag'); });
    test('随身小包类 - 墨镜', () => { expect(guessCat('墨镜')).toBe('small-bag'); });
    test('杂物类 - 雨伞', () => { expect(guessCat('雨伞')).toBe('misc'); });
    test('杂物类 - 纸巾', () => { expect(guessCat('纸巾')).toBe('misc'); });
    test('杂物类 - 奶瓶', () => { expect(guessCat('奶瓶')).toBe('misc'); });
    test('杂物类 - 零食', () => { expect(guessCat('零食')).toBe('misc'); });
    test('未知物品默认返回 misc', () => { expect(guessCat('奇怪的东西')).toBe('misc'); });
    test('大小写不敏感', () => { expect(guessCat('充电宝')).toBe('electronics'); });
    test('处理特殊字符', () => { expect(guessCat('身份证（含特殊）')).toBe('docs'); });
    test('处理 emoji', () => { expect(guessCat('手机📱')).toBe('electronics'); });
});

// ===== matchCat 分类匹配函数 =====

describe('matchCat 分类匹配函数', () => {
    test('精确匹配证件', () => { expect(matchCat('证件')).toBe('docs'); });
    test('精确匹配洗漱用品', () => { expect(matchCat('洗漱用品')).toBe('hygiene'); });
    test('精确匹配洗漱', () => { expect(matchCat('洗漱')).toBe('hygiene'); });
    test('精确匹配护肤', () => { expect(matchCat('护肤')).toBe('skincare'); });
    test('ID 匹配 electronics', () => { expect(matchCat('electronics')).toBe('electronics'); });
    test('ID 匹配 clothing', () => { expect(matchCat('clothing')).toBe('clothing'); });
    test('空字符串返回 misc', () => { expect(matchCat('')).toBe('misc'); });
    test('null 返回 misc', () => { expect(matchCat(null)).toBe('misc'); });
    test('undefined 返回 misc', () => { expect(matchCat(undefined)).toBe('misc'); });
    test('未匹配返回 misc', () => { expect(matchCat('完全不存在的分类')).toBe('misc'); });
    test('前后有空格仍能匹配（模糊搜索）', () => { expect(matchCat(' 证件 ')).toBe('docs'); });
});

// ===== gid ID生成函数 =====

describe('gid ID生成函数', () => {
    test('生成唯一 ID', () => {
        const id1 = gid();
        const id2 = gid();
        expect(id1).not.toBe(id2);
    });
    test('ID 是字符串', () => { expect(typeof gid()).toBe('string'); });
    test('ID 有一定长度', () => { expect(gid().length).toBeGreaterThan(5); });
    test('多次调用不重复', () => {
        const ids = new Set(Array.from({ length: 100 }, () => gid()));
        expect(ids.size).toBe(100);
    });
});

// ===== catInfo 分类信息函数 =====

describe('catInfo 分类信息函数', () => {
    test('获取洗漱用品信息', () => { expect(catInfo('hygiene').name).toBe('洗漱用品'); });
    test('获取证件信息', () => { expect(catInfo('docs').name).toBe('证件'); });
    test('获取衣物信息', () => { expect(catInfo('clothing').name).toBe('衣物'); });
    test('获取化妆信息', () => { expect(catInfo('makeup').name).toBe('化妆用品'); });
    test('未知分类返回杂物信息', () => { expect(catInfo('unknown').name).toBe('杂物'); });
    test('null 返回杂物', () => { expect(catInfo(null).name).toBe('杂物'); });
    test('返回包含 cssClass', () => { expect(catInfo('electronics').cssClass).toBe('cat-electronics'); });
});

// ===== esc HTML转义函数 =====

describe('esc HTML转义函数', () => {
    test('转义 <script> 标签', () => { expect(esc('<script>')).toBe('&lt;script&gt;'); });
    test('转义双引号', () => { expect(esc('"test"')).toBe('&quot;test&quot;'); });
    test('转义单引号', () => { expect(esc("'test'")).toBe('&#039;test&#039;'); });
    test('转义 & 符号', () => { expect(esc('A & B')).toBe('A &amp; B'); });
    test('转义 > 符号', () => { expect(esc('a > b')).toBe('a &gt; b'); });
    test('不转义普通文本', () => { expect(esc('普通文本')).toBe('普通文本'); });
    test('处理空字符串', () => { expect(esc('')).toBe(''); });
    test('处理 null', () => { expect(esc(null)).toBe(''); });
    test('处理 undefined', () => { expect(esc(undefined)).toBe(''); });
    test('处理数字输入', () => { expect(esc(123)).toBe('123'); });
});

// ===== bagName 包名称函数 =====

describe('bagName 包名称函数', () => {
    test('获取洗漱包名称', () => { expect(bagName('bag-hygiene', DEFAULT_BAGS)).toBe('洗漱包'); });
    test('获取化妆包名称', () => { expect(bagName('bag-makeup', DEFAULT_BAGS)).toBe('化妆包'); });
    test('获取证件包名称', () => { expect(bagName('bag-docs', DEFAULT_BAGS)).toBe('证件包'); });
    test('不存在的包返回未分配', () => { expect(bagName('bag-nonexistent', DEFAULT_BAGS)).toBe('未分配'); });
    test('空数组返回未分配', () => { expect(bagName('bag-hygiene', [])).toBe('未分配'); });
    test('null bags 使用默认', () => { expect(bagName('bag-hygiene', null)).toBe('未分配'); });
    test('宝宝包名称正确', () => { expect(bagName('bag-baby', DEFAULT_BAGS)).toBe('宝宝基础包'); });
});

// ===== parseBulkNames 批量解析 =====

describe('parseBulkNames 批量解析函数', () => {
    test('逗号分隔', () => {
        expect(parseBulkNames('身份证,护照,牙刷')).toEqual(['身份证', '护照', '牙刷']);
    });
    test('中文顿号分隔', () => {
        expect(parseBulkNames('身份证、护照、牙刷')).toEqual(['身份证', '护照', '牙刷']);
    });
    test('换行符分隔', () => {
        expect(parseBulkNames('身份证\n护照\n牙刷')).toEqual(['身份证', '护照', '牙刷']);
    });
    test('混合分隔', () => {
        expect(parseBulkNames('身份证 护照\n牙刷，牙膏')).toEqual(['身份证', '护照', '牙刷', '牙膏']);
    });
    test('自动去重', () => {
        expect(parseBulkNames('纸巾, 纸巾\n  口罩   ')).toEqual(['纸巾', '口罩']);
    });
    test('过滤空白', () => {
        expect(parseBulkNames('身份证,,护照  \n  ')).toEqual(['身份证', '护照']);
    });
    test('空字符串返回空数组', () => {
        expect(parseBulkNames('')).toEqual([]);
    });
    test('null 返回空数组', () => {
        expect(parseBulkNames(null)).toEqual([]);
    });
});

// ===== CATEGORY_BAG_MAP 映射 =====

describe('CATEGORY_BAG_MAP 映射逻辑', () => {
    test('证件类映射到证件包', () => { expect(CATEGORY_BAG_MAP['docs']).toBe('bag-docs'); });
    test('电子产品映射到电子包', () => { expect(CATEGORY_BAG_MAP['electronics']).toBe('bag-electronics'); });
    test('衣物映射到衣服包', () => { expect(CATEGORY_BAG_MAP['clothing']).toBe('bag-clothing'); });
    test('洗漱映射到洗漱包', () => { expect(CATEGORY_BAG_MAP['hygiene']).toBe('bag-hygiene'); });
    test('化妆映射到化妆包', () => { expect(CATEGORY_BAG_MAP['makeup']).toBe('bag-makeup'); });
    test('护肤映射到洗漱包（合并）', () => { expect(CATEGORY_BAG_MAP['skincare']).toBe('bag-hygiene'); });
    test('不存在的分类返回 undefined', () => { expect(CATEGORY_BAG_MAP['nonexistent']).toBeUndefined(); });
});

// ===== 物品动态数量计算 =====

describe('computeSmartQty 智能数量计算', () => {
    test('perDay 规则：3天×基础量', () => {
        expect(computeSmartQty(1, 'perDay', 3, 1)).toBe(3);
    });
    test('perPerson 规则：2人×基础量', () => {
        expect(computeSmartQty(1, 'perPerson', 1, 2)).toBe(2);
    });
    test('perPersonPerDay 规则：2人×3天×基础量', () => {
        expect(computeSmartQty(2, 'perPersonPerDay', 3, 2)).toBe(12);
    });
    test('fixed 规则：返回基础量', () => {
        expect(computeSmartQty(5, 'fixed', 3, 2)).toBe(5);
    });
    test('formula 规则：叠加宝宝插件场景系数', () => {
        const smartConfig = inferSmartConfig('尿不湿');
        const tripContext = {
            sourceModules: [
                { id: BABY_MODULE_IDS.base, name: '宝宝基础包' },
                { id: BABY_MODULE_IDS.overnight, name: '过夜插件包' },
            ],
        };
        const qty = computeSmartQty(1, 'formula', 3, 1, smartConfig, tripContext);
        expect(qty).toBeGreaterThan(3);
    });
});

// ===== mergeTripItems / applyTripSmartFill =====

describe('mergeTripItems 合并逻辑', () => {
    test('module 策略：同名同分类合并并取更强智能规则', () => {
        const items = [
            normalizeTripItem({
                id: 'a',
                name: 'T恤',
                category: 'clothing',
                qty: 2,
                smartRule: 'perDay',
                smartBaseQty: 1,
                sourceModules: ['衣服包'],
            }),
        ];
        const incoming = [
            normalizeTripItem({
                id: 'b',
                name: 'T恤',
                category: 'clothing',
                qty: 3,
                smartRule: 'perPersonPerDay',
                smartBaseQty: 1,
                sourceModules: ['备用包'],
            }),
        ];
        mergeTripItems(items, incoming, { days: 3, people: 2, sourceModules: [] }, 'module');
        expect(items).toHaveLength(1);
        expect(items[0].smartRule).toBe('perPersonPerDay');
        expect(items[0].sourceModules).toEqual(expect.arrayContaining(['衣服包', '备用包']));
        expect(items[0].qty).toBeGreaterThanOrEqual(3);
    });

    test('manual 策略：累加数量并锁定智能填充', () => {
        const items = [
            normalizeTripItem({
                id: 'a',
                name: '口罩',
                category: 'misc',
                qty: 2,
                smartRule: 'perDay',
                smartBaseQty: 1,
            }),
        ];
        mergeTripItems(items, [
            normalizeTripItem({
                id: 'b',
                name: '口罩',
                category: 'misc',
                qty: 3,
                smartRule: 'perDay',
                smartBaseQty: 1,
            }),
        ], { days: 2, people: 1 }, 'manual');
        expect(items[0].qty).toBe(5);
        expect(items[0].smartLocked).toBe(true);
    });

    test('module 策略：smartLocked 时不降低已有数量', () => {
        const items = [
            normalizeTripItem({
                id: 'a',
                name: '毛巾',
                category: 'hygiene',
                qty: 9,
                smartRule: 'perPerson',
                smartBaseQty: 1,
                smartLocked: true,
                sourceModules: ['洗漱包'],
            }),
        ];
        mergeTripItems(items, [
            normalizeTripItem({
                id: 'b',
                name: '毛巾',
                category: 'hygiene',
                qty: 2,
                smartRule: 'perPerson',
                smartBaseQty: 1,
                sourceModules: ['洗漱包'],
            }),
        ], { days: 2, people: 2 }, 'module');
        expect(items[0].qty).toBe(9);
        expect(items[0].smartLocked).toBe(true);
    });
});

describe('applyTripSmartFill 智能填充', () => {
    test('未锁定物品按天数重算', () => {
        const trip = normalizeTripRecord({
            id: 'trip-fill',
            name: '填充测试',
            days: 3,
            people: 1,
            items: [
                normalizeTripItem({
                    id: 'shirt',
                    name: 'T恤',
                    category: 'clothing',
                    qty: 1,
                    smartRule: 'perDay',
                    smartBaseQty: 1,
                }),
            ],
        });
        applyTripSmartFill(trip, false);
        expect(trip.items[0].qty).toBe(3);
    });

    test('smartLocked 物品不会被覆盖', () => {
        const trip = normalizeTripRecord({
            id: 'trip-locked',
            name: '锁定测试',
            days: 5,
            people: 1,
            items: [
                normalizeTripItem({
                    id: 'shirt',
                    name: 'T恤',
                    category: 'clothing',
                    qty: 2,
                    smartRule: 'perDay',
                    smartBaseQty: 1,
                    smartLocked: true,
                }),
            ],
        });
        applyTripSmartFill(trip, false);
        expect(trip.items[0].qty).toBe(2);
    });

    test('unlockAll 会解锁并重新计算', () => {
        const trip = normalizeTripRecord({
            id: 'trip-unlock',
            name: '解锁测试',
            days: 4,
            people: 1,
            items: [
                normalizeTripItem({
                    id: 'shirt',
                    name: 'T恤',
                    category: 'clothing',
                    qty: 2,
                    smartRule: 'perDay',
                    smartBaseQty: 1,
                    smartLocked: true,
                }),
            ],
        });
        applyTripSmartFill(trip, true);
        expect(trip.items[0].smartLocked).toBe(false);
        expect(trip.items[0].qty).toBe(4);
    });
});

describe('getTripProgress / getTripStatus', () => {
    test('空行程为规划中', () => {
        const trip = normalizeTripRecord({ id: 't1', name: '空', items: [] });
        expect(getTripStatus(trip).key).toBe('planning');
        expect(getTripProgress(trip).pct).toBe(0);
    });

    test('全部打包为已完成', () => {
        const trip = normalizeTripRecord({
            id: 't2',
            name: '完成',
            items: [
                normalizeTripItem({ id: '1', name: '牙刷', category: 'hygiene', qty: 1, packed: true }),
            ],
        });
        expect(getTripStatus(trip).key).toBe('done');
        expect(getTripProgress(trip).pct).toBe(100);
    });

    test('部分打包为打包中', () => {
        const trip = normalizeTripRecord({
            id: 't3',
            name: '进行中',
            items: [
                normalizeTripItem({ id: '1', name: '牙刷', category: 'hygiene', qty: 1, packed: true }),
                normalizeTripItem({ id: '2', name: '牙膏', category: 'hygiene', qty: 1, packed: false }),
            ],
        });
        expect(getTripStatus(trip).key).toBe('packing');
        expect(getTripProgress(trip).packed).toBe(1);
        expect(getTripProgress(trip).total).toBe(2);
    });
});

describe('removeModuleFromTrip / isModuleOnTrip', () => {
    test('移除小包时删掉仅属于它的物品', () => {
        const trip = normalizeTripRecord({
            id: 'trip-remove-mod',
            name: '移除测试',
            sourceModules: [
                { source: 'official', id: 'mod-a', name: '洗漱包' },
                { source: 'official', id: 'mod-b', name: '证件包' },
            ],
            items: [
                normalizeTripItem({ id: '1', name: '牙刷', category: 'hygiene', qty: 1, sourceModules: ['洗漱包'] }),
                normalizeTripItem({ id: '2', name: '身份证', category: 'docs', qty: 1, sourceModules: ['证件包'] }),
                normalizeTripItem({ id: '3', name: '充电宝', category: 'electronics', qty: 1, sourceModules: [] }),
            ],
        });

        saveOfficialModules([
            { id: 'mod-a', name: '洗漱包', icon: '🧴', purpose: 'starter', items: [] },
            { id: 'mod-b', name: '证件包', icon: '📁', purpose: 'daily', items: [] },
        ]);

        expect(isModuleOnTrip(trip, 'official', 'mod-a')).toBe(true);
        const result = removeModuleFromTrip(trip, 'official', 'mod-a');
        expect(result.changed).toBe(true);
        expect(result.removedItems).toBe(1);
        expect(trip.items.some(item => item.name === '牙刷')).toBe(false);
        expect(trip.items.some(item => item.name === '身份证')).toBe(true);
        expect(trip.items.some(item => item.name === '充电宝')).toBe(true);
        expect(isModuleOnTrip(trip, 'official', 'mod-a')).toBe(false);
    });

    test('多来源物品只去掉对应来源标签', () => {
        saveOfficialModules([
            { id: 'mod-x', name: '包A', icon: '🧴', purpose: 'starter', items: [] },
            { id: 'mod-y', name: '包B', icon: '📁', purpose: 'daily', items: [] },
        ]);
        const trip = normalizeTripRecord({
            id: 'trip-multi-src',
            name: '多来源',
            sourceModules: [
                { source: 'official', id: 'mod-x', name: '包A' },
                { source: 'official', id: 'mod-y', name: '包B' },
            ],
            items: [
                normalizeTripItem({ id: '1', name: '毛巾', category: 'hygiene', qty: 1, sourceModules: ['包A', '包B'] }),
            ],
        });

        removeModuleFromTrip(trip, 'official', 'mod-x');
        expect(trip.items).toHaveLength(1);
        expect(trip.items[0].sourceModules).toEqual(['包B']);
    });
});

// ===== 按小包重新同步 =====

describe('resyncTripFromSourceModules 按小包重新同步', () => {
    test('按更新后的小包定义刷新行程物品', () => {
        saveOfficialModules([
            {
                id: 'module-test-sync',
                name: '测试小包',
                icon: '🧪',
                purpose: 'starter',
                items: [{ name: '牙刷', category: 'hygiene', defaultQty: 1 }],
            },
        ]);

        const trip = normalizeTripRecord({
            id: 'trip-sync-test',
            name: '同步测试',
            days: 2,
            people: 1,
            sourceModules: [{ source: 'official', id: 'module-test-sync', name: '测试小包' }],
            items: [
                normalizeTripItem({
                    id: 'item-old',
                    name: '牙刷',
                    category: 'hygiene',
                    qty: 1,
                    smartBaseQty: 1,
                    smartRule: 'fixed',
                    sourceModules: ['测试小包'],
                }),
                normalizeTripItem({
                    id: 'item-manual',
                    name: '自定义物品',
                    category: 'misc',
                    qty: 1,
                    sourceModules: [],
                }),
            ],
        });

        saveOfficialModules([
            {
                id: 'module-test-sync',
                name: '测试小包',
                icon: '🧪',
                purpose: 'starter',
                items: [
                    { name: '牙刷', category: 'hygiene', defaultQty: 1 },
                    { name: '牙膏', category: 'hygiene', defaultQty: 1 },
                ],
            },
        ]);

        const result = resyncTripFromSourceModules(trip);
        expect(result.added).toBe(1);
        expect(trip.items.some(item => item.name === '牙膏')).toBe(true);
        expect(trip.items.some(item => item.name === '自定义物品')).toBe(true);
    });

    test('保留手动添加物品与打包状态', () => {
        saveOfficialModules([
            {
                id: 'module-test-packed',
                name: '证件包',
                icon: '📁',
                purpose: 'daily',
                items: [{ name: '身份证', category: 'docs', defaultQty: 1 }],
            },
        ]);

        const trip = normalizeTripRecord({
            id: 'trip-packed-test',
            name: '打包测试',
            days: 1,
            people: 1,
            sourceModules: [{ source: 'official', id: 'module-test-packed', name: '证件包' }],
            items: [
                normalizeTripItem({
                    id: 'item-docs',
                    name: '身份证',
                    category: 'docs',
                    qty: 1,
                    packed: true,
                    sourceModules: ['证件包'],
                }),
            ],
        });

        const result = resyncTripFromSourceModules(trip);
        const docs = trip.items.find(item => item.name === '身份证');
        expect(docs?.packed).toBe(true);
        expect(result.changed).toBe(false);
    });

    test('合并与手动添加同名的重复物品', () => {
        saveOfficialModules([
            {
                id: 'module-dup',
                name: '洗漱包',
                icon: '🧴',
                purpose: 'starter',
                items: [{ name: '牙刷', category: 'hygiene', defaultQty: 1 }],
            },
        ]);

        const trip = normalizeTripRecord({
            id: 'trip-dup',
            name: '重复测试',
            days: 1,
            people: 1,
            sourceModules: [{ source: 'official', id: 'module-dup', name: '洗漱包' }],
            items: [
                normalizeTripItem({
                    id: 'from-module',
                    name: '牙刷',
                    category: 'hygiene',
                    qty: 1,
                    sourceModules: ['洗漱包'],
                }),
                normalizeTripItem({
                    id: 'manual-dup',
                    name: '牙刷',
                    category: 'hygiene',
                    qty: 2,
                    sourceModules: [],
                }),
            ],
        });

        const result = resyncTripFromSourceModules(trip);
        expect(result.mergedDuplicates).toBe(1);
        expect(trip.items.filter(item => item.name === '牙刷')).toHaveLength(1);
        expect(trip.items.find(item => item.name === '牙刷').qty).toBe(2);
    });
});

// ===== 深拷贝逻辑 =====

describe('深拷贝逻辑', () => {
    test('JSON.parse/JSON.stringify 实现深拷贝', () => {
        const items = [{ id: '1', name: '身份证', qty: 1 }];
        const itemsCopy = JSON.parse(JSON.stringify(items));
        itemsCopy[0].qty = 999;
        expect(items[0].qty).toBe(1); // 原数据不变
    });
});

// ===== DEFAULT_CATEGORIES 结构验证 =====

describe('DEFAULT_CATEGORIES 数据完整性', () => {
    test('包含所有预期分类', () => {
        const ids = DEFAULT_CATEGORIES.map(c => c.id);
        expect(ids).toContain('hygiene');
        expect(ids).toContain('makeup');
        expect(ids).toContain('skincare');
        expect(ids).toContain('clothing');
        expect(ids).toContain('electronics');
        expect(ids).toContain('medicine');
        expect(ids).toContain('docs');
        expect(ids).toContain('small-bag');
        expect(ids).toContain('big-bag');
        expect(ids).toContain('misc');
    });
    test('每个分类都有 name 和 cssClass', () => {
        DEFAULT_CATEGORIES.forEach(cat => {
            expect(typeof cat.name).toBe('string');
            expect(typeof cat.cssClass).toBe('string');
        });
    });
});

// ===== DEFAULT_BAGS 结构验证 =====

describe('DEFAULT_BAGS 数据完整性', () => {
    test('包含宝宝相关包', () => {
        const ids = DEFAULT_BAGS.map(b => b.id);
        expect(ids).toContain('bag-baby');
        expect(ids).toContain('bag-baby-vaccine');
        expect(ids).toContain('bag-baby-feeding');
        expect(ids).toContain('bag-baby-overnight');
        expect(ids).toContain('bag-baby-outdoor');
    });
    test('每个包都有 id name icon', () => {
        DEFAULT_BAGS.forEach(bag => {
            expect(typeof bag.id).toBe('string');
            expect(typeof bag.name).toBe('string');
            expect(typeof bag.icon).toBe('string');
        });
    });
});
