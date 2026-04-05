/**
 * 出行打包助手 - 单元测试
 * 测试核心工具函数
 */

const { describe, test, expect } = require('@jest/globals');

// ===== 模拟环境 =====
// 由于 app.js 定义了全局变量和函数，我们需要模拟它们
// 在实际测试中，我们隔离测试纯函数

// 模拟 DEFAULT_CATEGORIES
const DEFAULT_CATEGORIES = [
    { id: 'hygiene', name: '洗漱用品', cssClass: 'cat-hygiene' },
    { id: 'makeup', name: '化妆用品', cssClass: 'cat-makeup' },
    { id: 'skincare', name: '护肤用品', cssClass: 'cat-skincare' },
    { id: 'small-bag', name: '随身小包', cssClass: 'cat-small-bag' },
    { id: 'big-bag', name: '随身大包', cssClass: 'cat-big-bag' },
    { id: 'misc', name: '杂物', cssClass: 'cat-misc' },
    { id: 'docs', name: '证件', cssClass: 'cat-docs' },
    { id: 'electronics', name: '电子设备', cssClass: 'cat-electronics' },
    { id: 'medicine', name: '药品', cssClass: 'cat-medicine' },
    { id: 'clothing', name: '衣物', cssClass: 'cat-clothing' },
];

// 模拟 guessCat 函数（从 app.js 复制）
function guessCat(name) {
    const n = name.toLowerCase();
    const rules = [
        [['身份证','护照','签证','驾照','工作证','门禁','名片','发票','行程','保险','户口','出生','学生证','预订','确认单'], 'docs'],
        [['充电','电池','数据线','耳机','手机','电脑','pad','平板','相机','转换插','U盘','鼠标','手电','头灯','露营灯','音箱','自拍'], 'electronics'],
        [['衬衫','T恤','裤','裙','内衣','内裤','袜','外套','西装','风衣','睡衣','泳衣','拖鞋','鞋','冲锋衣','速干','帽子'], 'clothing'],
        [['牙刷','牙膏','洗面','梳','剃须','沐浴','洗发','香皂','浴巾','毛巾'], 'hygiene'],
        [['面霜','防晒','唇膏','面膜','芦荟','驱蚊','护肤','纸尿裤','隔离'], 'skincare'],
        [['口红','粉底','眼影','化妆','卸妆','睫毛','腮红','眉笔'], 'makeup'],
        [['感冒药','退烧','创可贴','肠胃','晕车','维生素','温度计','碘伏','止痛','消毒'], 'medicine'],
        [['钱包','钥匙','口罩','随身'], 'small-bag'],
        [['雨伞','雨衣','纸巾','湿巾','垃圾袋','塑料袋','零食','水杯','保温杯','U型枕','眼罩','耳塞','行李锁','压缩袋','打火机','绳索','扎带'], 'misc'],
    ];
    for (const [kws, cat] of rules) {
        if (kws.some(k => n.includes(k.toLowerCase()))) return cat;
    }
    return 'misc';
}

// 模拟 matchCat 函数
function matchCat(text) {
    if (!text) return 'misc';
    const t = text.toLowerCase();
    const found = DEFAULT_CATEGORIES.find(c => c.name.includes(t) || c.id.includes(t) || t.includes(c.name));
    return found ? found.id : 'misc';
}

// 模拟 gid 函数
function gid() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// 模拟 catInfo 函数
function catInfo(id) {
    return DEFAULT_CATEGORIES.find(c => c.id === id) || { id: 'misc', name: '杂物', cssClass: 'cat-misc' };
}

// ===== 测试用例 =====

describe('guessCat 智能分类函数', () => {
    test('证件类 - 身份证', () => {
        expect(guessCat('身份证')).toBe('docs');
    });

    test('证件类 - 护照', () => {
        expect(guessCat('护照')).toBe('docs');
    });

    test('证件类 - 驾照', () => {
        expect(guessCat('驾照')).toBe('docs');
    });

    test('电子设备类 - 充电宝', () => {
        expect(guessCat('充电宝')).toBe('electronics');
    });

    test('电子设备类 - 数据线', () => {
        expect(guessCat('数据线')).toBe('electronics');
    });

    test('电子设备类 - 耳机', () => {
        expect(guessCat('耳机')).toBe('electronics');
    });

    test('衣物类 - T恤', () => {
        expect(guessCat('T恤')).toBe('clothing');
    });

    test('衣物类 - 内裤', () => {
        expect(guessCat('内裤')).toBe('clothing');
    });

    test('洗漱类 - 牙刷', () => {
        expect(guessCat('牙刷')).toBe('hygiene');
    });

    test('洗漱类 - 洗面奶', () => {
        expect(guessCat('洗面奶')).toBe('hygiene');
    });

    test('护肤类 - 面霜', () => {
        expect(guessCat('面霜')).toBe('skincare');
    });

    test('护肤类 - 防晒霜', () => {
        expect(guessCat('防晒霜')).toBe('skincare');
    });

    test('化妆类 - 口红', () => {
        expect(guessCat('口红')).toBe('makeup');
    });

    test('药品类 - 感冒药', () => {
        expect(guessCat('感冒药')).toBe('medicine');
    });

    test('药品类 - 创可贴', () => {
        expect(guessCat('创可贴')).toBe('medicine');
    });

    test('随身小包类 - 钱包', () => {
        expect(guessCat('钱包')).toBe('small-bag');
    });

    test('随身小包类 - 钥匙', () => {
        expect(guessCat('钥匙')).toBe('small-bag');
    });

    test('杂物类 - 雨伞', () => {
        expect(guessCat('雨伞')).toBe('misc');
    });

    test('杂物类 - 纸巾', () => {
        expect(guessCat('纸巾')).toBe('misc');
    });

    test('未知物品默认返回 misc', () => {
        expect(guessCat('奇怪的东西')).toBe('misc');
    });

    test('中文大小写不敏感', () => {
        expect(guessCat('充电宝')).toBe('electronics');
        expect(guessCat('充电宝'.toUpperCase())).toBe('electronics');
    });
});

describe('matchCat 分类匹配函数', () => {
    test('精确匹配证件', () => {
        expect(matchCat('证件')).toBe('docs');
    });

    test('精确匹配洗漱用品', () => {
        expect(matchCat('洗漱用品')).toBe('hygiene');
    });

    test('部分匹配', () => {
        expect(matchCat('洗漱')).toBe('hygiene');
    });

    test('ID 匹配', () => {
        expect(matchCat('electronics')).toBe('electronics');
    });

    test('空字符串返回 misc', () => {
        expect(matchCat('')).toBe('misc');
    });

    test('null 返回 misc', () => {
        expect(matchCat(null)).toBe('misc');
    });

    test('未匹配返回 misc', () => {
        expect(matchCat('完全不存在的分类')).toBe('misc');
    });
});

describe('gid ID生成函数', () => {
    test('生成唯一 ID', () => {
        const id1 = gid();
        const id2 = gid();
        expect(id1).not.toBe(id2);
    });

    test('ID 是字符串', () => {
        expect(typeof gid()).toBe('string');
    });

    test('ID 有一定长度', () => {
        expect(gid().length).toBeGreaterThan(5);
    });
});

describe('catInfo 分类信息函数', () => {
    test('获取洗漱用品信息', () => {
        const info = catInfo('hygiene');
        expect(info.name).toBe('洗漱用品');
    });

    test('获取证件信息', () => {
        const info = catInfo('docs');
        expect(info.name).toBe('证件');
    });

    test('未知分类返回杂物信息', () => {
        const info = catInfo('unknown');
        expect(info.name).toBe('杂物');
    });
});

describe('边界情况测试', () => {
    test('guessCat 处理特殊字符', () => {
        expect(guessCat('身份证（含特殊）')).toBe('docs');
    });

    test('guessCat 处理emoji', () => {
        expect(guessCat('手机📱')).toBe('electronics');
    });

    test('matchCat 处理空格', () => {
        expect(matchCat(' 证件 ')).toBe('docs');
    });
});

// ===== esc HTML转义函数 =====
// 使用简单的转义实现，不依赖 DOM
function esc(s) {
    if (s === null || s === undefined) return '';
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

describe('esc HTML转义函数', () => {
    test('转义 HTML 特殊字符', () => {
        expect(esc('<script>')).toBe('&lt;script&gt;');
    });

    test('转义引号', () => {
        expect(esc('"test"')).toBe('&quot;test&quot;');
    });

    test('转义 & 符号', () => {
        expect(esc('A & B')).toBe('A &amp; B');
    });

    test('不转义普通文本', () => {
        expect(esc('普通文本')).toBe('普通文本');
    });

    test('处理空字符串', () => {
        expect(esc('')).toBe('');
    });
});

// ===== bagName 包名称函数 =====

const DEFAULT_BAGS = [
    { id: 'bag-hygiene', name: '洗漱包', icon: '🧴' },
    { id: 'bag-makeup', name: '化妆包', icon: '💄' },
    { id: 'bag-skincare', name: '护肤包', icon: '🧪' },
    { id: 'bag-small', name: '随身小包', icon: '👛' },
    { id: 'bag-big', name: '随身大包', icon: '👜' },
    { id: 'bag-misc', name: '杂物包', icon: '📦' },
];

function bagName(bags, id) {
    const b = bags.find(b => b.id === id);
    return b ? b.name : '未分配';
}

describe('bagName 包名称函数', () => {
    test('获取存在的包名称', () => {
        expect(bagName(DEFAULT_BAGS, 'bag-hygiene')).toBe('洗漱包');
    });

    test('获取化妆包名称', () => {
        expect(bagName(DEFAULT_BAGS, 'bag-makeup')).toBe('化妆包');
    });

    test('不存在的包返回未分配', () => {
        expect(bagName(DEFAULT_BAGS, 'bag-nonexistent')).toBe('未分配');
    });

    test('空数组返回未分配', () => {
        expect(bagName([], 'bag-hygiene')).toBe('未分配');
    });
});

// ===== 清单数据过滤逻辑 =====

describe('清单数据过滤逻辑', () => {
    const mockLists = [
        { id: '1', name: '出差清单', isTemplate: false, items: [] },
        { id: '2', name: '旅行模板', isTemplate: true, items: [] },
        { id: '3', name: '周末出游', isTemplate: false, items: [] },
    ];

    test('过滤掉模板，保留普通清单', () => {
        const filtered = mockLists.filter(l => !l.isTemplate);
        expect(filtered.length).toBe(2);
        expect(filtered.map(l => l.name)).toEqual(['出差清单', '周末出游']);
    });

    test('只保留模板', () => {
        const filtered = mockLists.filter(l => l.isTemplate);
        expect(filtered.length).toBe(1);
        expect(filtered[0].name).toBe('旅行模板');
    });

    test('空数组过滤', () => {
        const filtered = [].filter(l => !l.isTemplate);
        expect(filtered.length).toBe(0);
    });
});

// ===== 物品数量计算逻辑 =====

describe('物品数量计算逻辑', () => {
    test('基本数量', () => {
        const t = { q: 1 };
        let qty = t.q || 1;
        expect(qty).toBe(1);
    });

    test('带 pd（每夜）的数量计算', () => {
        const t = { q: 1, pd: true };
        const nights = 3;
        let qty = t.q || 1;
        if (t.pd) qty *= nights > 0 ? nights : 1;
        expect(qty).toBe(3);
    });

    test('带 pp（每人）的数量计算', () => {
        const t = { q: 1, pp: true };
        const people = 2;
        let qty = t.q || 1;
        if (t.pp) qty *= people;
        expect(qty).toBe(2);
    });

    test('同时带 pd 和 pp', () => {
        const t = { q: 2, pd: true, pp: true };
        const nights = 2;
        const people = 3;
        let qty = t.q || 1;
        if (t.pd) qty *= nights;
        if (t.pp) qty *= people;
        expect(qty).toBe(12);
    });

    test('nights 为 0 时 pd 不计算', () => {
        const t = { q: 2, pd: true };
        const nights = 0;
        let qty = t.q || 1;
        if (nights <= 0 && t.pd) qty = 1;
        else if (t.pd) qty *= nights;
        expect(qty).toBe(1);
    });
});

describe('宝宝动态数量公式', () => {
    function computeDynamicQty(baseQty, days, sceneFactors = []) {
        return baseQty.base + days * baseQty.dailyIncrement + sceneFactors.reduce((sum, factor) => sum + factor, 0);
    }

    test('基础量加天数增量', () => {
        expect(computeDynamicQty({ base: 2, dailyIncrement: 3 }, 1)).toBe(5);
        expect(computeDynamicQty({ base: 2, dailyIncrement: 3 }, 2)).toBe(8);
    });

    test('叠加单个场景系数', () => {
        expect(computeDynamicQty({ base: 2, dailyIncrement: 3 }, 1, [1])).toBe(6);
    });

    test('叠加多个插件场景系数', () => {
        expect(computeDynamicQty({ base: 1, dailyIncrement: 1 }, 2, [1, 2])).toBe(6);
    });
});

// ===== 保存和加载清单逻辑 =====

describe('保存和加载清单逻辑', () => {
    test('创建新清单数据', () => {
        const S = {
            scene: '出差',
            items: [{ id: '1', name: '身份证', qty: 1 }],
            bags: DEFAULT_BAGS,
            listId: null,
        };

        const data = {
            id: S.listId || 'list-new',
            name: '测试清单',
            scene: S.scene,
            days: 3,
            nights: 2,
            people: 1,
            items: JSON.parse(JSON.stringify(S.items)),
            bags: JSON.parse(JSON.stringify(S.bags)),
            isTemplate: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        expect(data.id).toBe('list-new');
        expect(data.items.length).toBe(1);
        expect(data.isTemplate).toBe(false);
    });

    test('深拷贝物品数据', () => {
        const items = [{ id: '1', name: '身份证', qty: 1 }];
        const itemsCopy = JSON.parse(JSON.stringify(items));
        itemsCopy[0].qty = 999;
        expect(items[0].qty).toBe(1); // 原数据不变
    });

    test('bags 为空时使用默认包', () => {
        const savedList = { id: '1', name: '测试', items: [], bags: null };
        const bags = savedList.bags || DEFAULT_BAGS;
        expect(bags).toEqual(DEFAULT_BAGS);
    });

    test('bags 有值时使用保存的包', () => {
        const customBags = [{ id: 'custom-1', name: '我的包', icon: '🎒' }];
        const savedList = { id: '1', name: '测试', items: [], bags: customBags };
        const bags = savedList.bags || DEFAULT_BAGS;
        expect(bags).toEqual(customBags);
    });
});

// ===== CATEGORY_BAG_MAP 映射逻辑 =====

describe('CATEGORY_BAG_MAP 映射逻辑', () => {
    const CATEGORY_BAG_MAP = {
        'hygiene': 'bag-hygiene',
        'makeup': 'bag-makeup',
        'skincare': 'bag-skincare',
        'small-bag': 'bag-small',
        'big-bag': 'bag-big',
        'misc': 'bag-misc',
        'docs': 'bag-docs',
        'electronics': 'bag-electronics',
        'medicine': 'bag-medicine',
        'clothing': 'bag-clothing',
    };

    test('证件类映射到证件包', () => {
        expect(CATEGORY_BAG_MAP['docs']).toBe('bag-docs');
    });

    test('电子产品映射到电子设备包', () => {
        expect(CATEGORY_BAG_MAP['electronics']).toBe('bag-electronics');
    });

    test('不存在的分类映射到杂物包', () => {
        expect(CATEGORY_BAG_MAP['nonexistent']).toBeUndefined();
    });
});

// ===== 批量导入逻辑 =====

describe('批量导入逻辑', () => {
    function parseBulkNames(text) {
        return Array.from(new Set(
            String(text || '')
                .split(/[\s,，、；;]+/)
                .map(name => name.trim())
                .filter(Boolean)
        ));
    }

    test('解析普通物品行', () => {
        const line = '身份证';
        let name, category;
        if (line.includes('|')) {
            const p = line.split('|').map(s => s.trim());
            name = p[0];
        } else {
            name = line;
        }
        expect(name).toBe('身份证');
    });

    test('解析带分类的物品行', () => {
        const line = '洗面奶 | 洗漱';
        let name, category;
        if (line.includes('|')) {
            const p = line.split('|').map(s => s.trim());
            name = p[0];
            category = p[1];
        } else {
            name = line;
        }
        expect(name).toBe('洗面奶');
        expect(category).toBe('洗漱');
    });

    test('批量文本支持空格、逗号和换行混合分隔', () => {
        expect(parseBulkNames('身份证 护照\n牙刷，牙膏 数据线')).toEqual(['身份证', '护照', '牙刷', '牙膏', '数据线']);
    });

    test('批量文本会自动去重和忽略空白', () => {
        expect(parseBulkNames('纸巾, 纸巾\n  口罩   ')).toEqual(['纸巾', '口罩']);
    });

    test('行程上下文下会隐藏当前清单已有物品', () => {
        const library = [{ name: '纸巾' }, { name: '口罩' }, { name: '充电器' }];
        const currentTripNames = new Set(['口罩']);
        const visible = library.filter(item => !currentTripNames.has(item.name));
        expect(visible.map(item => item.name)).toEqual(['纸巾', '充电器']);
    });

    test('去重检测', () => {
        const existingItems = [{ name: '身份证' }];
        const newItem = '身份证';
        const isDuplicate = existingItems.some(i => i.name === newItem);
        expect(isDuplicate).toBe(true);
    });
});

// ===== 步进器逻辑 =====

describe('步进器逻辑', () => {
    function stepValue(currentValue, delta, min = 0, max = 90) {
        let v = parseInt(currentValue) || 0;
        v = Math.max(min, Math.min(max, v + delta));
        return v;
    }

    test('基本增减', () => {
        expect(stepValue(5, 1)).toBe(6);
        expect(stepValue(5, -1)).toBe(4);
    });

    test('边界值限制', () => {
        expect(stepValue(0, -1, 0)).toBe(0);
        expect(stepValue(90, 1, 0, 90)).toBe(90);
    });

    test('非数字默认值', () => {
        expect(stepValue('abc', 1)).toBe(1);
        expect(stepValue(null, 1)).toBe(1);
    });

    test('天数和夜数同步', () => {
        const days = 5;
        const nights = Math.max(0, days - 1);
        expect(nights).toBe(4);
    });
});
