export const DEFAULT_CATEGORIES = [
    { id: 'hygiene', name: '洗漱用品', cssClass: 'cat-hygiene' },
    { id: 'makeup', name: '化妆用品', cssClass: 'cat-makeup' },
    { id: 'skincare', name: '护肤用品', cssClass: 'cat-skincare' },
    { id: 'small-bag', name: '随身小物', cssClass: 'cat-small-bag' },
    { id: 'big-bag', name: '大件收纳', cssClass: 'cat-big-bag' },
    { id: 'misc', name: '杂物', cssClass: 'cat-misc' },
    { id: 'docs', name: '证件', cssClass: 'cat-docs' },
    { id: 'electronics', name: '电子设备', cssClass: 'cat-electronics' },
    { id: 'medicine', name: '药品', cssClass: 'cat-medicine' },
    { id: 'clothing', name: '衣物', cssClass: 'cat-clothing' },
];

export const DEFAULT_BAGS = [
    { id: 'bag-hygiene', name: '洗漱包', icon: '🧴' },
    { id: 'bag-makeup', name: '化妆包', icon: '💄' },
    { id: 'bag-docs', name: '证件包', icon: '📁' },
    { id: 'bag-clothing', name: '衣服包', icon: '👕' },
    { id: 'bag-baby', name: '宝宝基础包', icon: '🍼' },
    { id: 'bag-baby-vaccine', name: '疫苗插件包', icon: '💉' },
    { id: 'bag-baby-feeding', name: '喂养插件包', icon: '🧃' },
    { id: 'bag-baby-overnight', name: '过夜插件包', icon: '🌙' },
    { id: 'bag-baby-outdoor', name: '户外插件包', icon: '⛰️' },
    { id: 'bag-electronics', name: '电子包', icon: '🔌' },
    { id: 'bag-small', name: '随身小包', icon: '👛' },
    { id: 'bag-big', name: '大件收纳包', icon: '🧳' },
    { id: 'bag-medicine', name: '药品包', icon: '💊' },
    { id: 'bag-misc', name: '杂物包', icon: '📦' },
];

export const CATEGORY_BAG_MAP = {
    hygiene: 'bag-hygiene',
    makeup: 'bag-makeup',
    skincare: 'bag-hygiene',
    'small-bag': 'bag-small',
    'big-bag': 'bag-big',
    misc: 'bag-misc',
    docs: 'bag-docs',
    electronics: 'bag-electronics',
    medicine: 'bag-medicine',
    clothing: 'bag-clothing',
};

export const MODULE_FILTERS = [
    { id: 'all', name: '全部' },
    { id: 'starter', name: '基础' },
    { id: 'travel', name: '出行' },
    { id: 'family', name: '宝宝' },
    { id: 'daily', name: '随身' },
    { id: 'custom', name: '我的' },
];

export const STORAGE_KEYS = {
    records: 'packHelper_lists',
    itemLibrary: 'packHelper_itemLibrary',
    officialModules: 'packHelper_officialModules',
    onboarded: 'packHelper_onboarded',
};

export const BABY_MODULE_IDS = {
    base: 'module-baby-base',
    vaccine: 'module-baby-vaccine',
    feeding: 'module-baby-feeding',
    overnight: 'module-baby-overnight',
    outdoor: 'module-baby-outdoor',
};
