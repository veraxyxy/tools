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
    { id: 'bag-skincare', name: '护肤包', icon: '🫧' },
    { id: 'bag-docs', name: '证件包', icon: '📁' },
    { id: 'bag-clothing', name: '衣服包', icon: '👕' },
    { id: 'bag-baby', name: '宝宝日常出门包', icon: '🧷' },
    { id: 'bag-baby-feeding', name: '宝宝喂养包', icon: '🍼' },
    { id: 'bag-baby-clothing', name: '宝宝衣物包', icon: '👕' },
    { id: 'bag-baby-bath', name: '宝宝过夜补充包', icon: '🌙' },
    { id: 'bag-baby-medicine', name: '宝宝药品包', icon: '🌡️' },
    { id: 'bag-baby-gear', name: '宝宝出行装备包', icon: '🚗' },
    { id: 'bag-baby-vaccine', name: '宝宝疫苗场景', icon: '💉' },
    { id: 'bag-baby-outdoor', name: '宝宝户外场景', icon: '🌿' },
    { id: 'bag-electronics', name: '电子包', icon: '🔌' },
    { id: 'bag-camera', name: '摄影设备包', icon: '📷' },
    { id: 'bag-small', name: '随身小包', icon: '👛' },
    { id: 'bag-big', name: '大件收纳包', icon: '🧳' },
    { id: 'bag-medicine', name: '药品包', icon: '💊' },
    { id: 'bag-misc', name: '杂物包', icon: '📦' },
];

export const CATEGORY_BAG_MAP = {
    hygiene: 'bag-hygiene',
    makeup: 'bag-makeup',
    skincare: 'bag-skincare',
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
    { id: 'short', name: '短途' },
    { id: 'business', name: '出差' },
    { id: 'travel', name: '出行' },
    { id: 'family', name: '宝宝' },
    { id: 'daily', name: '随身' },
    { id: 'custom', name: '我的' },
];

export const STORAGE_KEYS = {
    records: 'packHelper_lists',
    itemLibrary: 'packHelper_itemLibrary',
    officialModules: 'packHelper_officialModules',
    officialSeedVersion: 'packHelper_officialSeedVersion',
    deletedOfficialModules: 'packHelper_deletedOfficialModules',
    onboarded: 'packHelper_onboarded',
};

export const BABY_MODULE_IDS = {
    base: 'module-baby-base',
    feeding: 'module-baby-feeding',
    clothing: 'module-baby-clothing',
    // 沿用旧的过夜模块 ID，避免已有行程失去来源关联。
    bath: 'module-baby-overnight',
    comfort: 'module-baby-comfort',
    snacks: 'module-baby-snacks',
    medicine: 'module-baby-medicine',
    gear: 'module-baby-gear',
    vaccine: 'module-baby-vaccine',
    // 保留旧键名，兼容已有行程与智能推荐数据。
    overnight: 'module-baby-overnight',
    outdoor: 'module-baby-outdoor',
};
