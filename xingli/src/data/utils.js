import { DEFAULT_CATEGORIES, DEFAULT_BAGS, CATEGORY_BAG_MAP } from './constants.js';

export function gid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
}

export function uniqueStrings(values) {
    return Array.from(new Set((values || []).filter(Boolean)));
}

export function guessCat(name) {
    const n = String(name || '').toLowerCase();
    const rules = [
        [['身份证', '护照', '签证', '驾照', '工作证', '门禁', '名片', '发票', '行程', '保险', '户口', '出生', '学生证', '预订', '确认单', '社保', '医保'], 'docs'],
        [['充电', '电池', '数据线', '耳机', '手机', '电脑', 'pad', '平板', '相机', '转换插', 'u盘', '鼠标', '手电', '头灯', '露营灯', '音箱', '自拍', '插线板', '读卡器', 'watch'], 'electronics'],
        [['衬衫', 't恤', '裤', '裙', '连衣裙', '内衣', '内裤', '文胸', '袜', '外套', '西装', '风衣', '睡衣', '泳衣', '拖鞋', '鞋', '冲锋衣', '速干', '帽子', '围巾', '口水巾', '宝宝衣服', '宝宝袜子', '打底裤'], 'clothing'],
        [['牙刷', '牙膏', '漱口', '牙线', '洗面', '梳', '剃须', '沐浴', '洗发', '香皂', '浴巾', '毛巾', '牙刷杯'], 'hygiene'],
        [['口红', '唇釉', '粉底', '粉扑', '气垫', '眼影', '化妆', '卸妆', '睫毛', '腮红', '眉笔', '眼线', '遮瑕', '散粉', '高光', '修容', '定妆', '妆前', '美妆蛋', '化妆刷', '香水', '定妆喷雾'], 'makeup'],
        [['面霜', '防晒', '唇膏', '面膜', '芦荟', '驱蚊', '护肤', '护臀', '乳液', '精华', '身体乳', '护手霜', '喷雾'], 'skincare'],
        [['感冒药', '退烧', '创可贴', '肠胃', '晕车', '维生素', '温度计', '碘伏', '止痛', '消毒', '常备药', '退热贴', '过敏药'], 'medicine'],
        [['钱包', '钥匙', '口罩', '随身', '现金', '银行卡', '墨镜', '发绳'], 'small-bag'],
        [['购物袋', '收纳袋', '压缩袋', '大包', '行李箱'], 'big-bag'],
        [['雨伞', '雨衣', '纸巾', '湿巾', '垃圾袋', '塑料袋', '零食', '水杯', '保温杯', 'u型枕', '眼罩', '耳塞', '行李锁', '行李牌', '打火机', '绳索', '扎带', '饮用水', '奶瓶', '奶粉', '围兜', '安抚玩具', '隔尿垫', '奶嘴', '尿不湿', '辅食'], 'misc'],
    ];

    for (const [keywords, category] of rules) {
        if (keywords.some(keyword => n.includes(keyword))) return category;
    }
    return 'misc';
}

export function catInfo(id) {
    return DEFAULT_CATEGORIES.find(cat => cat.id === id) || { id: 'misc', name: '杂物', cssClass: 'cat-misc' };
}

export function bagName(id, bags = DEFAULT_BAGS) {
    const bag = (bags || []).find(entry => entry.id === id);
    return bag ? bag.name : '未分配';
}

export function bagIcon(id, bags = DEFAULT_BAGS) {
    const bag = (bags || []).find(entry => entry.id === id);
    return bag ? bag.icon : '📦';
}

export function suggestBagForItem(name, category) {
    const n = String(name || '');
    if (['疫苗本', '退烧贴', '退热贴', '医保卡'].some(keyword => n.includes(keyword))) return 'bag-baby-vaccine';
    if (['奶瓶', '奶粉', '奶粉格', '辅食碗', '围兜', '围嘴', '保温杯'].some(keyword => n.includes(keyword))) return 'bag-baby-feeding';
    if (['便携烧水壶', '奶瓶刷', '折叠澡盆'].some(keyword => n.includes(keyword))) return 'bag-baby-overnight';
    if (['驱蚊液', '防晒霜', '便携马桶', '大量零食'].some(keyword => n.includes(keyword))) return 'bag-baby-outdoor';
    if (n.includes('宝宝') || ['尿不湿', '纸尿裤', '隔尿垫', '棉柔巾', '湿巾（婴儿专用）', '备用衣裤', '安抚奶嘴', '口水巾'].some(keyword => n.includes(keyword))) return 'bag-baby';
    return CATEGORY_BAG_MAP[category] || 'bag-misc';
}

export function parseBulkNames(text) {
    return [...new Set(String(text || '').split(/[\s,，、；;]+/).map(s => s.trim()).filter(Boolean))];
}

export function esc(s) {
    if (s === null || s === undefined) return '';
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

export function matchCat(text) {
    if (!text) return 'misc';
    const t = String(text).toLowerCase();
    const found = DEFAULT_CATEGORIES.find(c => c.name.includes(t) || c.id.includes(t) || t.includes(c.name));
    return found ? found.id : 'misc';
}
