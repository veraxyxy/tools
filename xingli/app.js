const DEFAULT_CATEGORIES = [
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

const DEFAULT_BAGS = [
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

const CATEGORY_BAG_MAP = {
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

const MODULE_FILTERS = [
    { id: 'all', name: '全部' },
    { id: 'starter', name: '基础' },
    { id: 'travel', name: '出行' },
    { id: 'family', name: '宝宝' },
    { id: 'daily', name: '随身' },
    { id: 'custom', name: '我的' },
];

const STORAGE_KEYS = {
    records: 'packHelper_lists',
    itemLibrary: 'packHelper_itemLibrary',
    officialModules: 'packHelper_officialModules',
    onboarded: 'packHelper_onboarded',
};

const BABY_MODULE_IDS = {
    base: 'module-baby-base',
    vaccine: 'module-baby-vaccine',
    feeding: 'module-baby-feeding',
    overnight: 'module-baby-overnight',
    outdoor: 'module-baby-outdoor',
};

const OFFICIAL_MODULES = [
    {
        id: 'module-hygiene',
        name: '洗漱包',
        icon: '🧴',
        purpose: 'starter',
        desc: '过夜和中短途都能直接复用的基础洗漱模块。',
        tags: ['基础', '过夜', '高频'],
        items: [
            { name: '牙刷牙膏', c: 'hygiene' },
            { name: '洗面奶', c: 'hygiene' },
            { name: '梳子', c: 'hygiene' },
            { name: '漱口水', c: 'hygiene' },
            { name: '牙线', c: 'hygiene' },
            { name: '毛巾', c: 'hygiene', smart: 'perPerson' },
            { name: '洗发水分装瓶', c: 'hygiene' },
            { name: '护发素分装瓶', c: 'hygiene' },
            { name: '沐浴露分装瓶', c: 'hygiene' },
            { name: '折叠牙刷杯', c: 'hygiene' },
        ],
    },
    {
        id: 'module-makeup',
        name: '化妆包',
        icon: '💄',
        purpose: 'starter',
        desc: '把妆面需要的固定物品收成一个小包，出行时按需勾选。',
        tags: ['妆面', '固定搭配', '高频'],
        items: [
            { name: '口红', c: 'makeup' },
            { name: '唇釉', c: 'makeup' },
            { name: '粉底液', c: 'makeup' },
            { name: '粉扑', c: 'makeup' },
            { name: '气垫', c: 'makeup' },
            { name: '眼影盘', c: 'makeup' },
            { name: '眉笔', c: 'makeup' },
            { name: '眼线笔', c: 'makeup' },
            { name: '睫毛膏', c: 'makeup' },
            { name: '腮红', c: 'makeup' },
            { name: '散粉', c: 'makeup' },
            { name: '高光', c: 'makeup' },
            { name: '修容', c: 'makeup' },
            { name: '遮瑕', c: 'makeup' },
            { name: '定妆喷雾', c: 'makeup' },
            { name: '美妆蛋', c: 'makeup' },
            { name: '化妆刷', c: 'makeup' },
        ],
    },
    {
        id: 'module-docs',
        name: '证件包',
        icon: '📁',
        purpose: 'daily',
        desc: '所有需要临出门确认的证件、支付和预订单据统一归位。',
        tags: ['证件', '支付', '随手带'],
        items: [
            { name: '身份证', c: 'docs' },
            { name: '护照', c: 'docs' },
            { name: '驾驶证', c: 'docs' },
            { name: '银行卡', c: 'small-bag' },
            { name: '现金', c: 'small-bag' },
            { name: '车票/机票', c: 'docs' },
            { name: '酒店预订确认单', c: 'docs' },
            { name: '行程单', c: 'docs' },
        ],
    },
    {
        id: 'module-clothing',
        name: '衣服包',
        icon: '👕',
        purpose: 'travel',
        desc: '这类物品会按行程天数和人数自动给出建议数量。',
        tags: ['智能填充', '衣物', '按天数'],
        items: [
            { name: 'T恤/上衣', c: 'clothing', smart: 'perPersonPerDay' },
            { name: '衬衫', c: 'clothing', smart: 'perPersonPerDay' },
            { name: '裤子/裙子', c: 'clothing', smart: 'perPersonPerDay' },
            { name: '内衣', c: 'clothing', smart: 'perPersonPerDay' },
            { name: '内裤', c: 'clothing', smart: 'perPersonPerDay' },
            { name: '袜子', c: 'clothing', smart: 'perPersonPerDay' },
            { name: '睡衣', c: 'clothing', smart: 'perPerson' },
            { name: '轻薄外套', c: 'clothing', smart: 'perPerson' },
            { name: '运动鞋', c: 'clothing', smart: 'perPerson' },
            { name: '拖鞋', c: 'clothing', smart: 'perPerson' },
        ],
    },
    {
        id: BABY_MODULE_IDS.base,
        name: '宝宝基础包',
        icon: '🍼',
        purpose: 'family',
        group: 'baby',
        role: 'base',
        defaultOn: true,
        desc: '所有带娃行程的默认底盘，会在选择任一宝宝插件包时自动带上。',
        tags: ['宝宝', '默认开启', '基础底盘'],
        items: [
            { name: '尿不湿', c: 'misc', q: 2, bag: 'bag-baby' },
            { name: '湿巾（婴儿专用）', c: 'misc', q: 1, bag: 'bag-baby' },
            { name: '棉柔巾', c: 'misc', q: 1, bag: 'bag-baby' },
            { name: '隔尿垫', c: 'misc', q: 1, bag: 'bag-baby' },
            { name: '备用衣裤', c: 'clothing', q: 1, bag: 'bag-baby' },
            { name: '安抚奶嘴', c: 'misc', q: 1, bag: 'bag-baby' },
        ],
    },
    {
        id: BABY_MODULE_IDS.vaccine,
        name: '疫苗插件包',
        icon: '💉',
        purpose: 'family',
        group: 'baby',
        role: 'addon',
        desc: '带宝宝去打疫苗、体检这类半天外出时叠加的证件和应急插件。',
        tags: ['宝宝', '插件', '短时外出'],
        items: [
            { name: '疫苗本', c: 'docs', bag: 'bag-baby-vaccine' },
            { name: '退烧贴', c: 'medicine', q: 2, bag: 'bag-baby-vaccine' },
            { name: '医保卡', c: 'docs', bag: 'bag-baby-vaccine' },
        ],
    },
    {
        id: BABY_MODULE_IDS.feeding,
        name: '喂养插件包',
        icon: '🧃',
        purpose: 'family',
        group: 'baby',
        role: 'addon',
        desc: '奶粉、奶瓶和辅食相关物品集中成包，按喂养需求随时叠加。',
        tags: ['宝宝', '插件', '喂养'],
        items: [
            { name: '奶粉格', c: 'misc', bag: 'bag-baby-feeding' },
            { name: '奶瓶', c: 'misc', q: 2, bag: 'bag-baby-feeding' },
            { name: '保温杯', c: 'misc', bag: 'bag-baby-feeding' },
            { name: '辅食碗', c: 'misc', bag: 'bag-baby-feeding' },
            { name: '围兜', c: 'misc', q: 1, bag: 'bag-baby-feeding' },
        ],
    },
    {
        id: BABY_MODULE_IDS.overnight,
        name: '过夜插件包',
        icon: '🌙',
        purpose: 'family',
        group: 'baby',
        role: 'addon',
        desc: '只在带宝宝外住时打开，补足洗奶瓶、洗澡和夜间换洗相关物品。',
        tags: ['宝宝', '插件', '过夜'],
        items: [
            { name: '便携烧水壶', c: 'misc', bag: 'bag-baby-overnight' },
            { name: '奶瓶刷', c: 'misc', bag: 'bag-baby-overnight' },
            { name: '折叠澡盆', c: 'misc', bag: 'bag-baby-overnight' },
            { name: '睡衣', c: 'clothing', q: 1, bag: 'bag-baby-overnight' },
        ],
    },
    {
        id: BABY_MODULE_IDS.outdoor,
        name: '户外插件包',
        icon: '⛰️',
        purpose: 'family',
        group: 'baby',
        role: 'addon',
        desc: '爬山、露营、公园久待时叠加，重点补防护和户外补给。',
        tags: ['宝宝', '插件', '户外'],
        items: [
            { name: '驱蚊液', c: 'skincare', bag: 'bag-baby-outdoor' },
            { name: '防晒霜', c: 'skincare', bag: 'bag-baby-outdoor' },
            { name: '便携马桶', c: 'misc', bag: 'bag-baby-outdoor' },
            { name: '大量零食', c: 'misc', q: 2, bag: 'bag-baby-outdoor' },
        ],
    },
    {
        id: 'module-electronics',
        name: '电子包',
        icon: '🔌',
        purpose: 'travel',
        desc: '长短途都能直接拿走的充电、拍摄和办公电子模块。',
        tags: ['电子', '充电', '办公'],
        items: [
            { name: '手机', c: 'electronics' },
            { name: '充电器（手机）', c: 'electronics' },
            { name: '数据线', c: 'electronics', q: 2 },
            { name: '充电宝', c: 'electronics' },
            { name: '耳机', c: 'electronics' },
            { name: 'Apple Watch 充电器', c: 'electronics' },
            { name: 'iPad', c: 'electronics' },
            { name: 'iPad 充电器', c: 'electronics' },
            { name: '笔记本电脑', c: 'electronics' },
            { name: '充电器（电脑）', c: 'electronics' },
            { name: '转换插头', c: 'electronics' },
        ],
    },
];

const BASE_LIBRARY_ITEMS = [
    { name: '身份证', category: 'docs' },
    { name: '护照', category: 'docs' },
    { name: '驾驶证', category: 'docs' },
    { name: '工作证/门禁卡', category: 'docs' },
    { name: '社保卡', category: 'docs' },
    { name: '医保卡', category: 'docs' },
    { name: '宝宝出生证明', category: 'docs' },
    { name: '户口本', category: 'docs' },
    { name: '学生证', category: 'docs' },
    { name: '车票/机票', category: 'docs' },
    { name: '酒店预订确认单', category: 'docs' },
    { name: '行程单', category: 'docs' },
    { name: '保险保单', category: 'docs' },
    { name: '银行卡', category: 'small-bag' },
    { name: '现金', category: 'small-bag' },
    { name: '钱包', category: 'small-bag' },
    { name: '钥匙', category: 'small-bag' },
    { name: '口罩', category: 'small-bag', defaultQty: 3 },
    { name: '墨镜', category: 'small-bag' },
    { name: '发绳', category: 'small-bag' },
    { name: '纸巾', category: 'misc' },
    { name: '湿巾', category: 'misc' },
    { name: '湿巾（婴儿专用）', category: 'misc', defaultQty: 2, bag: 'bag-baby' },
    { name: '垃圾袋', category: 'misc', defaultQty: 3 },
    { name: '保鲜袋', category: 'misc' },
    { name: '收纳袋', category: 'big-bag' },
    { name: '压缩袋', category: 'big-bag' },
    { name: '折叠购物袋', category: 'big-bag' },
    { name: '雨伞', category: 'misc' },
    { name: '保温杯', category: 'misc' },
    { name: '水杯', category: 'misc' },
    { name: '零食', category: 'misc' },
    { name: '笔', category: 'misc' },
    { name: '行李牌', category: 'misc' },
    { name: '行李锁', category: 'misc' },
    { name: 'U型枕', category: 'misc' },
    { name: '眼罩', category: 'misc' },
    { name: '耳塞', category: 'small-bag' },
    { name: '奶瓶', category: 'misc', defaultQty: 2, bag: 'bag-baby', smartRule: 'perPerson' },
    { name: '奶粉', category: 'misc', bag: 'bag-baby' },
    { name: '奶瓶刷', category: 'misc', bag: 'bag-baby' },
    { name: '宝宝奶嘴', category: 'misc', defaultQty: 2, bag: 'bag-baby' },
    { name: '围兜', category: 'misc', defaultQty: 1, bag: 'bag-baby', smartRule: 'perPersonPerDay' },
    { name: '安抚玩具', category: 'misc', bag: 'bag-baby' },
    { name: '隔尿垫', category: 'misc', defaultQty: 2, bag: 'bag-baby' },
    { name: '棉柔巾', category: 'misc', bag: 'bag-baby' },
    { name: '辅食剪', category: 'misc', bag: 'bag-baby' },
    { name: '辅食碗', category: 'misc', bag: 'bag-baby' },
    { name: '尿不湿', category: 'misc', defaultQty: 5, bag: 'bag-baby', smartRule: 'perPersonPerDay' },
    { name: '手机', category: 'electronics' },
    { name: '充电器（手机）', category: 'electronics' },
    { name: '数据线', category: 'electronics', defaultQty: 2 },
    { name: '双头充电线', category: 'electronics' },
    { name: '充电宝', category: 'electronics' },
    { name: '耳机', category: 'electronics' },
    { name: '降噪耳机', category: 'electronics' },
    { name: 'Apple Watch 充电器', category: 'electronics' },
    { name: 'iPad', category: 'electronics' },
    { name: 'iPad 充电器', category: 'electronics' },
    { name: '笔记本电脑', category: 'electronics' },
    { name: '充电器（电脑）', category: 'electronics' },
    { name: '鼠标', category: 'electronics' },
    { name: '相机', category: 'electronics' },
    { name: '相机备用电池', category: 'electronics' },
    { name: '相机充电器', category: 'electronics' },
    { name: '读卡器', category: 'electronics' },
    { name: '自拍杆', category: 'electronics' },
    { name: '转换插头', category: 'electronics' },
    { name: '插线板', category: 'electronics' },
    { name: '手电筒', category: 'electronics' },
    { name: '露营灯', category: 'electronics' },
    { name: '牙刷牙膏', category: 'hygiene' },
    { name: '电动牙刷', category: 'hygiene' },
    { name: '漱口水', category: 'hygiene' },
    { name: '牙线', category: 'hygiene' },
    { name: '洗面奶', category: 'hygiene' },
    { name: '梳子', category: 'hygiene' },
    { name: '剃须刀', category: 'hygiene' },
    { name: '毛巾', category: 'hygiene', smartRule: 'perPerson' },
    { name: '浴巾', category: 'hygiene', smartRule: 'perPerson' },
    { name: '洗发水分装瓶', category: 'hygiene' },
    { name: '护发素分装瓶', category: 'hygiene' },
    { name: '沐浴露分装瓶', category: 'hygiene' },
    { name: '折叠牙刷杯', category: 'hygiene' },
    { name: '润唇膏', category: 'skincare' },
    { name: '防晒霜', category: 'skincare' },
    { name: '面霜', category: 'skincare' },
    { name: '乳液', category: 'skincare' },
    { name: '精华', category: 'skincare' },
    { name: '面膜', category: 'skincare', defaultQty: 2 },
    { name: '身体乳', category: 'skincare' },
    { name: '护手霜', category: 'skincare' },
    { name: '喷雾', category: 'skincare' },
    { name: '驱蚊液', category: 'skincare' },
    { name: '护臀膏', category: 'skincare', bag: 'bag-baby' },
    { name: '芦荟胶', category: 'skincare' },
    { name: '口红', category: 'makeup' },
    { name: '唇釉', category: 'makeup' },
    { name: '粉底液', category: 'makeup' },
    { name: '粉扑', category: 'makeup' },
    { name: '气垫', category: 'makeup' },
    { name: '眼影盘', category: 'makeup' },
    { name: '眉笔', category: 'makeup' },
    { name: '眼线笔', category: 'makeup' },
    { name: '睫毛膏', category: 'makeup' },
    { name: '腮红', category: 'makeup' },
    { name: '散粉', category: 'makeup' },
    { name: '高光', category: 'makeup' },
    { name: '修容', category: 'makeup' },
    { name: '遮瑕', category: 'makeup' },
    { name: '妆前乳', category: 'makeup' },
    { name: '定妆喷雾', category: 'makeup' },
    { name: '美妆蛋', category: 'makeup' },
    { name: '化妆刷', category: 'makeup' },
    { name: '卸妆油', category: 'makeup' },
    { name: '卸妆湿巾', category: 'makeup' },
    { name: '香水', category: 'makeup' },
    { name: 'T恤/上衣', category: 'clothing', smartRule: 'perPersonPerDay' },
    { name: '衬衫', category: 'clothing', smartRule: 'perPersonPerDay' },
    { name: '裤子/裙子', category: 'clothing', smartRule: 'perPersonPerDay' },
    { name: '连衣裙', category: 'clothing', smartRule: 'perPersonPerDay' },
    { name: '睡衣', category: 'clothing', smartRule: 'perPerson' },
    { name: '内衣', category: 'clothing', defaultQty: 1, smartRule: 'perPersonPerDay' },
    { name: '内裤', category: 'clothing', defaultQty: 1, smartRule: 'perPersonPerDay' },
    { name: '文胸', category: 'clothing', defaultQty: 1, smartRule: 'perPersonPerDay' },
    { name: '袜子', category: 'clothing', defaultQty: 1, smartRule: 'perPersonPerDay' },
    { name: '打底裤', category: 'clothing', defaultQty: 1, smartRule: 'perPersonPerDay' },
    { name: '轻薄外套', category: 'clothing', smartRule: 'perPerson' },
    { name: '运动鞋', category: 'clothing', smartRule: 'perPerson' },
    { name: '拖鞋', category: 'clothing', smartRule: 'perPerson' },
    { name: '宝宝衣服', category: 'clothing', defaultQty: 2, bag: 'bag-baby', smartRule: 'perPersonPerDay' },
    { name: '宝宝袜子', category: 'clothing', defaultQty: 1, bag: 'bag-baby', smartRule: 'perPersonPerDay' },
    { name: '口水巾', category: 'clothing', defaultQty: 1, bag: 'bag-baby', smartRule: 'perPersonPerDay' },
    { name: '帽子', category: 'clothing', smartRule: 'perPerson' },
    { name: '感冒药', category: 'medicine' },
    { name: '退烧药', category: 'medicine' },
    { name: '退烧药（儿童）', category: 'medicine', bag: 'bag-baby' },
    { name: '体温计', category: 'medicine', bag: 'bag-baby' },
    { name: '退烧贴', category: 'medicine', defaultQty: 2, bag: 'bag-baby-vaccine' },
    { name: '退热贴', category: 'medicine', defaultQty: 2, bag: 'bag-baby' },
    { name: '创可贴', category: 'medicine' },
    { name: '碘伏棉签', category: 'medicine' },
    { name: '止痛药', category: 'medicine' },
    { name: '晕车药', category: 'medicine' },
    { name: '肠胃药', category: 'medicine' },
    { name: '过敏药', category: 'medicine' },
    { name: '消毒喷雾', category: 'medicine' },
    { name: '常备药', category: 'medicine' },
];

let S = {
    currentPage: 'home',
    currentTripId: null,
    currentTrip: null,
    currentModule: null,
    currentModuleAction: 'browse',
    homeHistoryExpanded: false,
    tripMode: 'plan',
    packView: 'bags',
    moduleFilter: 'all',
    moduleSearch: '',
    itemFilter: 'all',
    itemSearch: '',
    returnPage: null,
    libraryModalEditId: null,
    tripItemEditId: null,
    moduleBuilderSelection: new Set(),
    moduleBuilderSearch: '',
    moduleBuilderDraftId: null,
    moduleBuilderDraftSource: 'custom',
    moduleBuilderGesture: {
        active: false,
        pointerId: null,
        mode: 'add',
        visited: new Set(),
    },
    tripBuilderSelection: new Set(),
    kitView: 'compact',
    collapsedBags: new Set(),
    currentEditingTags: [],
};

function init() {
    ensureItemLibrarySeeded();
    setupModalOverlays();
    setupModuleBuilderGesture();
    fillCatSelect('libraryItemCategory');
    fillBagSelect('libraryItemBag', null, DEFAULT_BAGS);
    fillCatSelect('manualItemCategory');
    fillCatSelect('tripItemCategory');
    fillCatSelect('moduleQuickItemCategory');
    bindFormEvents();
    nav('home');
    if (!localStorage.getItem(STORAGE_KEYS.onboarded)) {
        setTimeout(startOnboarding, 400);
    }
}

function bindFormEvents() {
    document.getElementById('tripDays')?.addEventListener('input', syncTripBuilderSummary);
    document.getElementById('tripPeople')?.addEventListener('input', syncTripBuilderSummary);

    document.getElementById('libraryItemCategory')?.addEventListener('change', () => {
        syncBagWithCategory('libraryItemCategory', 'libraryItemBag', DEFAULT_BAGS);
        updateLibrarySmartHint();
    });
    document.getElementById('libraryItemName')?.addEventListener('input', updateLibrarySmartHint);
    document.getElementById('libraryItemBulkInput')?.addEventListener('input', updateLibrarySmartHint);
    document.getElementById('libraryItemQty')?.addEventListener('input', updateLibrarySmartHint);

    document.getElementById('manualItemCategory')?.addEventListener('change', () => {
        syncBagWithCategory('manualItemCategory', 'manualItemBag', S.currentTrip?.bags || DEFAULT_BAGS);
        updateManualItemSmartHint();
    });
    document.getElementById('manualItemName')?.addEventListener('input', updateManualItemSmartHint);
    document.getElementById('manualItemBulkInput')?.addEventListener('input', updateManualItemSmartHint);
    document.getElementById('manualItemQty')?.addEventListener('input', updateManualItemSmartHint);

    document.getElementById('tripItemQty')?.addEventListener('input', updateTripItemSmartMeta);
    document.getElementById('tripItemCategory')?.addEventListener('change', () => {
        syncBagWithCategory('tripItemCategory', 'tripItemBag', S.currentTrip?.bags || DEFAULT_BAGS);
        updateTripItemSmartMeta();
    });

    document.getElementById('moduleQuickItemName')?.addEventListener('input', updateModuleQuickItemCategory);
    document.getElementById('moduleQuickItemCategory')?.addEventListener('change', updateModuleQuickItemCategory);

    document.getElementById('libraryItemTagInput')?.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); addLibraryItemTag(); } });
    document.getElementById('tripItemTagInput')?.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); addTripItemTag(); } });
}

function nav(page) {
    S.currentPage = page;
    document.querySelectorAll('.page').forEach(el => el.classList.toggle('active', el.dataset.page === page));
    renderHeader();
    renderBottomNav();

    if (page === 'home') renderHome();
    if (page === 'kits') renderModuleLibrary();
    if (page === 'items') renderItemLibrary();
    if (page === 'list') renderTripPage();
    if (page === 'me') renderMePage();
}

function openMainPage(page) {
    S.returnPage = null;
    S.currentModuleAction = 'browse';
    nav(page);
}

function goBack() {
    if (S.currentPage === 'list') {
        nav('home');
        return;
    }
    if (S.returnPage) {
        const target = S.returnPage;
        S.returnPage = null;
        S.currentModuleAction = 'browse';
        nav(target);
        return;
    }
    nav('home');
}

function renderHeader() {
    const backWrap = document.getElementById('headerBackWrap');
    const title = document.getElementById('headerTitle');
    const eyebrow = document.getElementById('headerEyebrow');
    const right = document.getElementById('headerRight');

    backWrap.style.visibility = (S.currentPage === 'list' || S.returnPage) ? 'visible' : 'hidden';
    right.innerHTML = '';

    if (S.currentPage === 'home') {
        title.textContent = '行理';
        eyebrow.textContent = '物品库 → 小包 → 行程';
        right.innerHTML = '<button class="btn-icon" onclick="openCreateTripModal()" aria-label="新建行程">＋</button>';
    } else if (S.currentPage === 'kits') {
        title.textContent = '小包';
        eyebrow.textContent = S.currentModuleAction === 'add' ? '把小包加进当前行程单' : '先沉淀，再复用';
        right.innerHTML = '<button class="btn-icon" onclick="openCreateModuleModal()" aria-label="新建小包">＋</button>';
    } else if (S.currentPage === 'items') {
        title.textContent = '物品库';
        eyebrow.textContent = S.currentTrip ? '从物品库给当前行程补货' : '沉淀你的标准物品资产';
        right.innerHTML = '<button class="btn-icon" onclick="openLibraryItemModal()" aria-label="新增物品">＋</button>';
    } else if (S.currentPage === 'list') {
        title.textContent = '行程详情';
        eyebrow.textContent = S.tripMode === 'plan' ? '规划模式：组合小包、补充物品、智能建议' : '打包模式：对照实物勾选';
        right.innerHTML = '<button class="btn-icon" onclick="toggleTripMode()" aria-label="切换模式">' + (S.tripMode === 'plan' ? '🎒' : '✏️') + '</button>';
    } else if (S.currentPage === 'me') {
        title.textContent = '我的';
        eyebrow.textContent = '设置与数据管理';
        right.innerHTML = '';
    }
}

function renderBottomNav() {
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.nav === S.currentPage);
    });
}

function renderHome() {
    const trips = getTrips();
    const modules = getMyModules();
    const library = getItemLibrary();
    const active = trips.find(trip => getTripStatus(trip).key !== 'done') || null;
    const recent = trips.filter(trip => trip.id !== active?.id).slice(0, 3);
    const history = trips.filter(trip => trip.id !== active?.id).slice(3);

    const isNewUser = !trips.length && !modules.length;
    const heroEl = document.getElementById('homeHero');
    if (heroEl) heroEl.style.display = isNewUser ? 'block' : 'none';

    const statsEl = document.getElementById('homeStats');
    if (statsEl) {
        statsEl.innerHTML = isNewUser ? '' : '<span>' + trips.length + ' 个行程</span><span class="qs-dot">·</span><span>' + (modules.length + getOfficialModules().length) + ' 个小包</span><span class="qs-dot">·</span><span>' + library.length + ' 件物品</span>';
    }

    document.getElementById('activeTripMeta').textContent = active
        ? getTripStatus(active).label
        : '';

    document.getElementById('activeTripSection').innerHTML = active
        ? renderActiveTrip(active)
        : (isNewUser ? '' : renderHomeEmpty());

    document.getElementById('recentTripList').innerHTML = recent.length
        ? recent.map(renderTripCard).join('')
        : (isNewUser ? '' : '<div class="empty-panel"><div class="empty-hint">还没有行程，点上方 ＋ 新建一个。</div></div>');

    document.getElementById('historyToggleMeta').textContent = history.length
        ? (S.homeHistoryExpanded ? '收起' : `展开 ${history.length} 条`)
        : '暂无';

    const historyBox = document.getElementById('historyTripList');
    historyBox.style.display = S.homeHistoryExpanded && history.length ? 'flex' : 'none';
    historyBox.innerHTML = history.length
        ? history.map(renderTripCard).join('')
        : '';
}

function renderHomeEmpty() {
    return '<div class="empty-panel">' +
        '<div class="empty-icon">📝</div>' +
        '<div class="empty-title">还没有进行中的行程</div>' +
        '<div class="empty-hint">点右上角 ＋ 新建一个行程，或先去"小包"页整理物品。</div>' +
        '</div>';
}

function renderActiveTrip(trip) {
    const progress = getTripProgress(trip);
    const status = getTripStatus(trip);
    return '<div class="active-trip-card">' +
        '<div class="active-trip-top">' +
        '<span class="status-chip ' + status.key + '">' + status.label + '</span>' +
        '<span class="section-meta">' + esc(formatTripMeta(trip)) + '</span>' +
        '</div>' +
        '<div class="list-summary-title">' + esc(trip.name) + '</div>' +
        '<div class="list-summary-meta">' + esc(formatTripSourceSummary(trip)) + '</div>' +
        renderProgress(progress) +
        '<div class="hero-actions" style="margin-top:14px;">' +
        '<button class="btn-secondary" onclick="openTrip(\'' + trip.id + '\',\'plan\')">继续规划</button>' +
        '<button class="btn-primary" onclick="openTrip(\'' + trip.id + '\',\'pack\')">开始打包</button>' +
        '</div></div>';
}

function renderTripCard(trip) {
    const progress = getTripProgress(trip);
    const status = getTripStatus(trip);
    const openMode = status.key === 'done' ? 'plan' : 'pack';
    return '<div class="saved-list-card">' +
        '<div class="saved-list-icon">' + status.icon + '</div>' +
        '<div class="saved-list-info" onclick="openTrip(\'' + trip.id + '\',\'plan\')">' +
        '<div class="saved-list-name">' + esc(trip.name) + '</div>' +
        '<div class="saved-list-meta">' + esc(formatTripMeta(trip)) + ' · ' + esc(formatTripSourceSummary(trip)) + '</div>' +
        renderProgress(progress) +
        '</div>' +
        '<div class="saved-list-actions">' +
        '<button class="icon-action" onclick="event.stopPropagation();openTrip(\'' + trip.id + '\',\'' + openMode + '\')" title="打开">🎒</button>' +
        '<button class="icon-action" onclick="event.stopPropagation();duplicateTrip(\'' + trip.id + '\')" title="复制">📋</button>' +
        '<button class="icon-action" onclick="event.stopPropagation();deleteRecord(\'' + trip.id + '\')" title="删除">🗑️</button>' +
        '</div></div>';
}

function renderProgress(progress) {
    return '<div class="saved-list-progress">' +
        '<div class="saved-list-progress-bar"><div class="saved-list-progress-fill" style="width:' + progress.pct + '%"></div></div>' +
        '<span class="saved-list-progress-text">已打包 ' + progress.packed + '/' + progress.total + ' 件</span>' +
        '</div>';
}

function toggleHomeHistory() {
    if (!getTrips().slice(3).length) return;
    S.homeHistoryExpanded = !S.homeHistoryExpanded;
    renderHome();
}

function renderTripPage() {
    const summaryBox = document.getElementById('listSummary');
    const switchBox = document.getElementById('listModeSwitch');
    const actionBar = document.getElementById('listActionBar');
    const subBar = document.getElementById('listSubBar');
    const content = document.getElementById('listContent');

    if (!S.currentTrip) {
        summaryBox.innerHTML = '<div class="empty-panel"><div class="empty-icon">📭</div><div class="empty-title">还没有打开的行程</div><div class="empty-hint">先去勾选几个小包，再回来这里继续整理。</div></div>';
        switchBox.innerHTML = '';
        actionBar.innerHTML = '';
        subBar.innerHTML = '';
        content.innerHTML = '';
        return;
    }

    const trip = S.currentTrip;
    const progress = getTripProgress(trip);
    const status = getTripStatus(trip);
    const smartCount = trip.items.filter(item => item.smartRule !== 'fixed').length;

    summaryBox.innerHTML = '<div class="list-summary-card">' +
        '<div class="list-summary-top">' +
        '<div>' +
        '<div class="list-summary-title-row"><div class="list-summary-title">' + esc(trip.name) + '</div><span class="status-chip ' + status.key + '">' + status.label + '</span></div>' +
        '<div class="list-summary-meta">' + esc(formatTripSourceSummary(trip)) + ' · ' + esc(formatTripMeta(trip)) + '</div>' +
        '</div>' +
        '<button class="pill-button" onclick="saveCurrentTripAsModule()">存为小包</button>' +
        '</div>' +
        renderProgress(progress) +
        '<div class="trip-settings-bar">' +
        renderTripSettingBlock('days', '天数', trip.days, 1, 90) +
        renderTripSettingBlock('people', '人数', trip.people, 1, 20) +
        '<div class="trip-setting-block"><div class="trip-setting-label">智能填充</div><button class="btn-secondary wide" onclick="reapplyTripSmartFill()">重新智能填充</button></div>' +
        '</div>' +
        '<div class="trip-smart-note">已按当前设置建议 ' + smartCount + ' 项可变数量物品；你手动改过的数量会优先保留。</div>' +
        '</div>';

    switchBox.innerHTML = '<button class="mode-tab ' + (S.tripMode === 'plan' ? 'active' : '') + '" onclick="setTripMode(\'plan\')">规划模式</button>' +
        '<button class="mode-tab ' + (S.tripMode === 'pack' ? 'active' : '') + '" onclick="setTripMode(\'pack\')">打包模式</button>';

    if (S.tripMode === 'plan') {
        actionBar.innerHTML = [
            '<button class="btn-secondary" onclick="goSelectModuleForTrip()">从小包添加</button>',
            '<button class="btn-secondary" onclick="goSelectItemsForTrip()">从物品库添加</button>',
            '<button class="btn-primary" onclick="openManualItemModal()">手动添加物品</button>',
        ].join('');
        subBar.innerHTML = '<div class="info-card subtle">行程里只需要勾选这次要带的小包；如果勾选了宝宝插件包，系统会自动补上宝宝基础包，并给尿不湿、备用衣裤、湿巾这类物品按天数和场景重新建议数量。</div>';
        content.innerHTML = trip.items.length ? trip.items.map(renderTripPlanItemCard).join('') : renderTripEmpty();
    } else {
        actionBar.innerHTML = [
            '<button class="btn-secondary" onclick="markAllPacked()">标记全部完成</button>',
            '<button class="btn-secondary" onclick="markAllUnpacked()">恢复为未打包</button>',
        ].join('');
        subBar.innerHTML = '<div class="pack-view-switch">' +
            '<button class="pack-view-tab ' + (S.packView === 'bags' ? 'active' : '') + '" onclick="setPackView(\'bags\')">按小包看</button>' +
            '<button class="pack-view-tab ' + (S.packView === 'remaining' ? 'active' : '') + '" onclick="setPackView(\'remaining\')">未打包</button>' +
            '<button class="pack-view-tab ' + (S.packView === 'all' ? 'active' : '') + '" onclick="setPackView(\'all\')">全部</button>' +
            '</div>';
        content.innerHTML = renderPackContent(trip);
    }
}

function renderTripSettingBlock(field, label, value, min, max) {
    return '<div class="trip-setting-block">' +
        '<div class="trip-setting-label">' + label + '</div>' +
        '<div class="stepper">' +
        '<button class="stepper-btn" onclick="changeCurrentTripSetting(\'' + field + '\', -1)">−</button>' +
        '<input type="number" min="' + min + '" max="' + max + '" value="' + value + '" oninput="updateCurrentTripSetting(\'' + field + '\', this.value)">' +
        '<button class="stepper-btn" onclick="changeCurrentTripSetting(\'' + field + '\', 1)">+</button>' +
        '</div>' +
        '</div>';
}

function renderTripEmpty() {
    return '<div class="empty-panel">' +
        '<div class="empty-icon">🧳</div>' +
        '<div class="empty-title">这张行程单还是空的</div>' +
        '<div class="empty-hint">去勾选一个或多个小包，或者直接手动加单个物品。</div>' +
        '</div>';
}

function renderTripPlanItemCard(item) {
    const cat = catInfo(item.category);
    const sourceText = formatItemSource(item);
    const tagsHtml = (item.tags || []).map(tag => '<span class="item-pill" style="background:var(--secondary-soft);color:#1d7fbf">' + esc(tag) + '</span>').join('');
    const smartBadge = item.smartRule !== 'fixed'
        ? '<span class="item-pill smart-pill">' + esc(item.smartLocked ? '数量已手调' : smartRuleShort(item.smartRule)) + '</span>'
        : '';
    return '<div class="list-item-card' + (item.packed ? ' packed' : '') + '">' +
        '<button class="check-button ' + (item.packed ? 'checked' : '') + '" onclick="togglePackItem(\'' + item.id + '\')">✓</button>' +
        '<div class="list-item-main" onclick="openTripItemModal(\'' + item.id + '\')">' +
        '<div class="list-item-name">' + esc(item.name) + '</div>' +
        '<div class="item-subline">' +
        '<span class="item-pill ' + cat.cssClass + '">' + esc(cat.name) + '</span>' +
        '<span class="item-pill">' + esc(bagName(item.bag, S.currentTrip.bags)) + '</span>' +
        smartBadge +
        (sourceText ? '<span class="item-pill">' + esc(sourceText) + '</span>' : '') +
        '</div>' +
        (item.notes ? '<div class="item-notes">备注：' + esc(item.notes) + '</div>' : '') +
        (tagsHtml ? '<div class="item-subline">' + tagsHtml + '</div>' : '') +
        '</div>' +
        '<div class="item-qty">×' + item.qty + '</div>' +
        '</div>';
}

function renderPackContent(trip) {
    if (!trip.items.length) return renderTripEmpty();
    if (S.packView === 'remaining') {
        const remaining = trip.items.filter(item => !item.packed);
        if (!remaining.length) {
            return '<div class="empty-panel"><div class="empty-icon">🎉</div><div class="empty-title">全部打包完成</div><div class="empty-hint">这次出门需要带的东西都准备好了。</div></div>';
        }
        return remaining.map(renderPackItemCard).join('');
    }
    if (S.packView === 'all') {
        return trip.items.map(renderPackItemCard).join('');
    }
    return renderBagsPackView(trip);
}

function renderBagsPackView(trip) {
    const bags = trip.bags || DEFAULT_BAGS;
    const groups = bags.map(bag => ({
        bag,
        items: trip.items.filter(item => item.bag === bag.id),
    })).filter(group => group.items.length);

    const unassigned = trip.items.filter(item => !bags.some(bag => bag.id === item.bag));
    if (unassigned.length) groups.push({ bag: { id: 'unassigned', icon: '❓', name: '未分配' }, items: unassigned });

    if (!groups.length) return renderTripEmpty();

    // Auto-expand bags that have partial progress
    groups.forEach(group => {
        if (!S.collapsedBags.has(group.bag.id)) {
            const packed = group.items.filter(item => item.packed).length;
            if (packed === 0) S.collapsedBags.add(group.bag.id);
        }
    });

    return groups.map(group => {
        const packed = group.items.filter(item => item.packed).length;
        const collapsed = S.collapsedBags.has(group.bag.id) ? ' collapsed' : '';
        return '<div class="bag-group' + collapsed + '" id="bag-' + group.bag.id + '">' +
            '<div class="bag-group-header" onclick="toggleBagCollapse(\'' + group.bag.id + '\')">' +
            '<span>' + group.bag.icon + ' ' + esc(group.bag.name) + '</span>' +
            '<div style="display:flex;align-items:center;gap:8px">' +
            '<span class="section-meta">' + packed + '/' + group.items.length + '</span>' +
            '<span class="bag-toggle">▼</span>' +
            '</div></div>' +
            '<div class="bag-group-items">' + group.items.map(renderPackItemCard).join('') + '</div>' +
            '</div>';
    }).join('');
}

function toggleBagCollapse(bagId) {
    if (S.collapsedBags.has(bagId)) {
        S.collapsedBags.delete(bagId);
    } else {
        S.collapsedBags.add(bagId);
    }
    const el = document.getElementById('bag-' + bagId);
    if (el) el.classList.toggle('collapsed', S.collapsedBags.has(bagId));
}

function renderPackItemCard(item) {
    const cat = catInfo(item.category);
    const tagsHtml = (item.tags || []).map(tag => '<span class="item-pill" style="background:var(--secondary-soft);color:#1d7fbf">' + esc(tag) + '</span>').join('');
    return '<div class="list-item-card' + (item.packed ? ' packed' : '') + '" onclick="togglePackItem(\'' + item.id + '\')">' +
        '<button class="check-button ' + (item.packed ? 'checked' : '') + '">✓</button>' +
        '<div class="list-item-main">' +
        '<div class="list-item-name">' + esc(item.name) + '</div>' +
        '<div class="item-subline">' +
        '<span class="item-pill ' + cat.cssClass + '">' + esc(cat.name) + '</span>' +
        '<span class="item-pill">' + esc(bagName(item.bag, S.currentTrip.bags)) + '</span>' +
        (tagsHtml ? tagsHtml : '') +
        '</div>' +
        '</div>' +
        '<div class="item-qty">×' + item.qty + '</div>' +
        '</div>';
}

function setTripMode(mode) {
    S.tripMode = mode;
    renderHeader();
    renderTripPage();
}

function toggleTripMode() {
    setTripMode(S.tripMode === 'plan' ? 'pack' : 'plan');
}

function setPackView(view) {
    S.packView = view;
    renderTripPage();
}

function openTrip(id, mode = 'plan') {
    const trip = getTrips().find(item => item.id === id);
    if (!trip) return;
    S.currentTripId = id;
    S.currentTrip = deepClone(trip);
    S.tripMode = mode;
    S.collapsedBags = new Set();
    nav('list');
}

function changeCurrentTripSetting(field, delta) {
    if (!S.currentTrip) return;
    const current = field === 'days' ? S.currentTrip.days : S.currentTrip.people;
    updateCurrentTripSetting(field, current + delta);
}

function updateCurrentTripSetting(field, rawValue) {
    if (!S.currentTrip) return;
    const min = field === 'days' ? 1 : 1;
    const max = field === 'days' ? 90 : 20;
    const value = Math.max(min, Math.min(max, parseInt(rawValue) || min));
    if (field === 'days' && value === S.currentTrip.days) return;
    if (field === 'people' && value === S.currentTrip.people) return;

    if (field === 'days') S.currentTrip.days = value;
    if (field === 'people') S.currentTrip.people = value;

    applyTripSmartFill(S.currentTrip, false);
    persistCurrentTrip();
    renderTripPage();
    renderHome();
}

function reapplyTripSmartFill() {
    if (!S.currentTrip) return;
    applyTripSmartFill(S.currentTrip, true);
    persistCurrentTrip();
    renderTripPage();
    renderHome();
    toast('已重新按天数和人数智能填充');
}

function updateModuleSearch(value) {
    S.moduleSearch = value.trim();
    renderModuleLibrary();
}

function setModuleFilter(filterId) {
    S.moduleFilter = filterId;
    renderModuleLibrary();
}

function renderModuleLibrary() {
    const banner = document.getElementById('moduleContextBanner');
    const officialBox = document.getElementById('officialModuleGrid');
    const myBox = document.getElementById('myModuleGrid');
    const myMeta = document.getElementById('myModuleMeta');
    const toggle = document.getElementById('kitViewToggle');

    toggle.innerHTML =
        '<button class="kit-view-btn ' + (S.kitView === 'compact' ? 'active' : '') + '" onclick="setKitView(\'compact\')">精简</button>' +
        '<button class="kit-view-btn ' + (S.kitView === 'normal' ? 'active' : '') + '" onclick="setKitView(\'normal\')">详情</button>';

    banner.classList.toggle('visible', S.currentModuleAction === 'add' && !!S.currentTrip);
    banner.textContent = S.currentModuleAction === 'add' && S.currentTrip
        ? `当前行程：${S.currentTrip.name}。打开一个小包后，可把整包物品一键加入当前行程。`
        : '你先在这里维护标准化小包；创建 Trips 时，再从库里勾选需要的小包组合。';

    renderModuleFilters();
    document.getElementById('moduleSearchInput').value = S.moduleSearch;

    const keyword = S.moduleSearch.toLowerCase();
    const official = getOfficialModules().filter(module => {
        const searchBlob = [module.name, module.desc, ...(module.tags || [])].join(' ').toLowerCase();
        const filterMatch = S.moduleFilter === 'all' || S.moduleFilter === module.purpose;
        const searchMatch = !keyword || searchBlob.includes(keyword);
        return filterMatch && searchMatch;
    });

    const mine = getMyModules().filter(module => {
        const searchBlob = [module.name, module.desc, ...(module.tags || []), ...(module.items || []).map(item => item.name)].join(' ').toLowerCase();
        const filterMatch = S.moduleFilter === 'all' || S.moduleFilter === 'custom';
        const searchMatch = !keyword || searchBlob.includes(keyword);
        return filterMatch && searchMatch;
    });

    officialBox.innerHTML = official.length
        ? official.map(m => renderOfficialModuleCard(m, S.kitView)).join('')
        : '<div class="empty-panel"><div class="empty-hint">没有匹配的官方小包。</div></div>';

    myMeta.textContent = mine.length ? `${mine.length} 个可复用小包` : '还没有';
    myBox.innerHTML = mine.length
        ? mine.map(m => renderMyModuleCard(m, S.kitView)).join('')
        : '<div class="empty-panel"><div class="empty-title">还没有我的小包</div><div class="empty-hint">可以从官方小包起步，也可以从物品库滑选后新建。</div></div>';
}

function renderModuleFilters() {
    document.getElementById('moduleFilterRow').innerHTML = MODULE_FILTERS.map(filter =>
        '<button class="filter-chip ' + (S.moduleFilter === filter.id ? 'active' : '') + '" onclick="setModuleFilter(\'' + filter.id + '\')">' + esc(filter.name) + '</button>'
    ).join('');
}

function renderOfficialModuleCard(module, view = 'normal') {
    const preview = resolveOfficialModuleItems(module, getPreviewDays(), getPreviewPeople());
    const smartCount = preview.filter(item => item.smartRule !== 'fixed').length;
    if (view === 'compact') {
        return '<div class="kit-card compact recommended" onclick="openModuleDetail(\'official\',\'' + module.id + '\')">' +
            '<div class="kit-card-top">' +
            '<div class="kit-card-icon">' + module.icon + '</div>' +
            '<div class="kit-card-name">' + esc(module.name) + '</div>' +
            '</div>' +
            '<div class="kit-card-count"><span class="kit-card-count-icon">📦</span>' + preview.length + '件</div>' +
            '</div>';
    }
    return '<div class="kit-card recommended" onclick="openModuleDetail(\'official\',\'' + module.id + '\')">' +
        '<div class="kit-card-top">' +
        '<div class="kit-card-icon">' + module.icon + '</div>' +
        '<div class="inline-actions">' +
        '<span class="kit-badge">官方小包</span>' +
        '<button class="icon-action" onclick="event.stopPropagation();openEditModuleModal(\'official\',\'' + module.id + '\')" title="编辑官方小包">✏️</button>' +
        '</div></div>' +
        '<div class="kit-card-name">' + esc(module.name) + '</div>' +
        '<div class="kit-card-desc">' + esc(module.desc) + '</div>' +
        '<div class="tag-row">' + (module.tags || []).map(tag => '<span class="tag">' + esc(tag) + '</span>').join('') + '</div>' +
        '<div class="kit-card-meta">' + preview.length + ' 件物品 · ' + smartCount + ' 项随天数/人数变化</div>' +
        '</div>';
}

function renderMyModuleCard(module, view = 'normal') {
    const preview = resolveCustomModuleItems(module, getPreviewDays(), getPreviewPeople());
    const smartCount = preview.filter(item => item.smartRule !== 'fixed').length;
    if (view === 'compact') {
        return '<div class="kit-card compact" onclick="openModuleDetail(\'custom\',\'' + module.id + '\')">' +
            '<div class="kit-card-top">' +
            '<div class="kit-card-icon">' + esc(module.icon || '🧰') + '</div>' +
            '<div class="kit-card-name">' + esc(module.name) + '</div>' +
            '</div>' +
            '<div class="kit-card-count"><span class="kit-card-count-icon">📦</span>' + preview.length + '件</div>' +
            '</div>';
    }
    return '<div class="kit-card" onclick="openModuleDetail(\'custom\',\'' + module.id + '\')">' +
        '<div class="kit-card-top">' +
        '<div class="kit-card-icon">' + esc(module.icon || '🧰') + '</div>' +
        '<div class="inline-actions">' +
        '<span class="kit-badge soft">我的小包</span>' +
        '<button class="icon-action" onclick="event.stopPropagation();openEditModuleModal(\'custom\',\'' + module.id + '\')" title="编辑小包">✏️</button>' +
        '</div></div>' +
        '<div class="kit-card-name">' + esc(module.name) + '</div>' +
        '<div class="kit-card-desc">' + esc(module.desc || '你自己维护的可复用小包模块') + '</div>' +
        '<div class="kit-card-meta">' + preview.length + ' 件物品 · ' + smartCount + ' 项可智能填充</div>' +
        '</div>';
}

function setKitView(view) {
    S.kitView = view;
    renderModuleLibrary();
}

function openModuleDetail(source, id) {
    S.currentModule = { source, id };
    const entity = getModuleEntity(source, id);
    if (!entity) return;

    const days = getPreviewDays();
    const people = getPreviewPeople();
    const preview = source === 'official'
        ? resolveOfficialModuleItems(entity, days, people)
        : resolveCustomModuleItems(entity, days, people);
    const smartCount = preview.filter(item => item.smartRule !== 'fixed').length;

    document.getElementById('moduleDetailTitle').textContent = entity.name;
    document.getElementById('moduleDetailIcon').textContent = entity.icon || '🧰';
    document.getElementById('moduleDetailSubtitle').textContent = source === 'official'
        ? '官方小包 · 可编辑'
        : '我的小包 · 可编辑';
    document.getElementById('moduleDetailDesc').textContent = entity.desc || '可复用的小包模块。';
    document.getElementById('moduleDetailTags').innerHTML = (entity.tags || []).map(tag => '<span class="tag">' + esc(tag) + '</span>').join('') || '<span class="tag">标准化小包</span>';
    document.getElementById('moduleDetailSummary').textContent = `按当前 ${days} 天 / ${people} 人预览，共 ${preview.length} 件物品，其中 ${smartCount} 项会随天数或人数变化。`;
    document.getElementById('moduleDetailItems').innerHTML = preview.map(item => renderReadonlyModuleItemCard(item, S.currentTrip?.bags || DEFAULT_BAGS)).join('');
    document.getElementById('moduleEditBtn').style.display = 'inline-flex';
    document.getElementById('moduleEditBtn').textContent = source === 'official' ? '编辑官方小包' : '编辑小包';
    document.getElementById('modulePrimaryBtn').textContent = S.currentModuleAction === 'add' && S.currentTrip ? '加入当前行程' : '用于新行程';
    showModal('moduleDetailModal');
}

function renderReadonlyModuleItemCard(item, bags) {
    const cat = catInfo(item.category);
    const smart = item.smartRule !== 'fixed'
        ? '<span class="item-pill smart-pill">' + esc(smartRuleShort(item.smartRule)) + '</span>'
        : '';
    return '<div class="list-item-card">' +
        '<div class="list-item-main">' +
        '<div class="list-item-name">' + esc(item.name) + '</div>' +
        '<div class="item-subline">' +
        '<span class="item-pill ' + cat.cssClass + '">' + esc(cat.name) + '</span>' +
        '<span class="item-pill">' + esc(bagName(item.bag, bags)) + '</span>' +
        smart +
        '</div>' +
        '</div>' +
        '<div class="item-qty">×' + item.qty + '</div>' +
        '</div>';
}

function useCurrentModule() {
    if (!S.currentModule) return;
    const { source, id } = S.currentModule;
    closeModal('moduleDetailModal');
    if (S.currentModuleAction === 'add' && S.currentTrip) {
        addModuleToCurrentTrip(source, id);
        nav('list');
        return;
    }
    openCreateTripModal([getModuleKey(source, id)]);
}

function openEditCurrentModule() {
    if (!S.currentModule) return;
    closeModal('moduleDetailModal');
    openEditModuleModal(S.currentModule.source, S.currentModule.id);
}

function openEditModuleModal(source = 'custom', id) {
    const module = getModuleEntity(source, id);
    if (!module) return;
    openCreateModuleModal(module.items, { editId: id, editSource: source });
}

function updateItemSearch(value) {
    S.itemSearch = value.trim();
    renderItemLibrary();
}

function setItemFilter(filterId) {
    S.itemFilter = filterId;
    renderItemLibrary();
}

function renderItemLibrary() {
    const banner = document.getElementById('itemContextBanner');
    const gridBox = document.getElementById('itemLibraryGrid');
    const searchInput = document.getElementById('itemSearchInput');
    const summaryBox = document.getElementById('itemLibrarySummary');
    const allItems = getItemLibrary();
    const currentTripNames = new Set((S.currentTrip?.items || []).map(item => String(item.name || '').trim()));

    banner.classList.toggle('visible', !!S.currentTrip);
    banner.textContent = S.currentTrip
        ? `当前行程：${S.currentTrip.name}。只显示未加入的物品。`
        : '';

    searchInput.value = S.itemSearch;
    renderItemFilters();

    const keyword = S.itemSearch.toLowerCase();
    const hiddenCount = S.currentTrip ? allItems.filter(item => currentTripNames.has(item.name)).length : 0;
    const items = allItems.filter(item => {
        const filterMatch = S.itemFilter === 'all' || item.category === S.itemFilter;
        const searchMatch = !keyword || item.name.toLowerCase().includes(keyword);
        const tripMatch = !S.currentTrip || !currentTripNames.has(item.name);
        return filterMatch && searchMatch && tripMatch;
    });

    const customCount = allItems.filter(item => item.source === 'user').length;
    if (summaryBox) {
        summaryBox.innerHTML = '<span>共 ' + allItems.length + ' 件</span>' +
            (customCount ? '<span class="qs-dot">·</span><span>自建 ' + customCount + '</span>' : '') +
            (hiddenCount ? '<span class="qs-dot">·</span><span>已隐藏 ' + hiddenCount + '</span>' : '');
    }

    gridBox.innerHTML = items.length
        ? items.map(renderLibraryCard).join('')
        : '<div class="empty-panel full-span"><div class="empty-hint">' + (S.currentTrip ? '本次清单物品已全部补齐。' : '没有匹配的物品。') + '</div></div>';
}

function renderItemFilters() {
    const options = [{ id: 'all', name: '全部' }, ...DEFAULT_CATEGORIES.map(cat => ({ id: cat.id, name: cat.name }))];
    document.getElementById('itemFilterRow').innerHTML = options.map(option =>
        '<button class="filter-chip ' + (S.itemFilter === option.id ? 'active' : '') + '" onclick="setItemFilter(\'' + option.id + '\')">' + esc(option.name) + '</button>'
    ).join('');
}

function renderLibraryCard(item) {
    const cat = catInfo(item.category);
    const addButton = S.currentTrip
        ? '<button class="library-action primary" onclick="event.stopPropagation();addLibraryItemToCurrentTrip(\'' + item.id + '\')">+ 加入</button>'
        : '';
    const tagsHtml = (item.tags || []).map(tag => '<span class="library-item-tag">' + esc(tag) + '</span>').join('');
    return '<div class="library-card ' + (item.source === 'user' ? 'user-built' : '') + '" onclick="openLibraryItemModal(\'' + item.id + '\')">' +
        '<div class="library-card-body">' +
        '<div class="library-name">' + esc(item.name) + '</div>' +
        '<div class="library-meta">' + esc(cat.name) + ' · ' + esc(bagName(item.bag, DEFAULT_BAGS)) + ' · ×' + item.defaultQty + '</div>' +
        (tagsHtml ? '<div class="library-item-tags">' + tagsHtml + '</div>' : '') +
        '</div>' +
        (addButton ? '<div class="library-actions">' + addButton + '</div>' : '') +
        '</div>';
}


function parseBulkNames(text) {
    return uniqueStrings(
        String(text || '')
            .split(/[\s,，、；;]+/)
            .map(name => name.trim())
            .filter(Boolean)
    );
}

function collectDraftNames(singleInputId, bulkInputId = null) {
    const single = document.getElementById(singleInputId)?.value.trim() || '';
    const bulk = bulkInputId ? parseBulkNames(document.getElementById(bulkInputId)?.value || '') : [];
    return uniqueStrings([single, ...bulk].filter(Boolean));
}

function buildLibraryItemDraft(name, qty, category, bag, existing = null) {
    const { smartRule, smartConfig } = resolveItemSmartPlan(name, category, existing?.smartRule, existing?.smartConfig);
    return normalizeLibraryItem({
        ...existing,
        id: existing?.id || ('asset-' + gid()),
        name,
        defaultQty: qty,
        category,
        bag,
        smartRule,
        smartConfig,
        source: existing?.source || 'user',
    });
}

function openCreateTripModal(initialModuleKeys = []) {
    S.tripBuilderSelection = new Set(initialModuleKeys);
    ensureTripBuilderBabyBaseSelection();
    document.getElementById('createTripName').value = initialModuleKeys.length === 1
        ? getModuleEntity(...splitModuleKey(initialModuleKeys[0]))?.name + ' 行程'
        : '新的行程单';
    document.getElementById('tripDays').value = S.currentTrip?.days || 2;
    document.getElementById('tripPeople').value = S.currentTrip?.people || 1;
    renderTripBuilderModules();
    syncTripBuilderSummary();
    showModal('createTripModal');
    setTimeout(() => document.getElementById('createTripName').focus(), 50);
}

function renderTripBuilderModules() {
    const box = document.getElementById('tripBuilderModuleGrid');
    if (!box) return;

    const modules = [
        ...getOfficialModules().map(module => ({ source: 'official', module })),
        ...getMyModules().map(module => ({ source: 'custom', module })),
    ];
    const forceBabyBase = tripBuilderHasBabyAddonSelection();

    box.innerHTML = modules.length
        ? modules.map(({ source, module }) => {
            const key = getModuleKey(source, module.id);
            const selected = S.tripBuilderSelection.has(key);
            const locked = forceBabyBase && source === 'official' && module.id === BABY_MODULE_IDS.base;
            const preview = source === 'official'
                ? resolveOfficialModuleItems(module, getTripBuilderDays(), getTripBuilderPeople())
                : resolveCustomModuleItems(module, getTripBuilderDays(), getTripBuilderPeople());
            const smartCount = preview.filter(item => item.smartRule !== 'fixed').length;
            const typeLabel = module.group === 'baby'
                ? (module.role === 'base' ? '宝宝底盘' : '宝宝插件')
                : (source === 'official' ? '官方小包' : '我的小包');
            const stateLabel = locked ? '默认开启' : (selected ? '已勾选' : '点选');
            return '<div class="picker-item module-choice ' + (selected ? 'selected' : '') + '" onclick="toggleTripBuilderModule(\'' + source + '\',\'' + module.id + '\')">' +
                '<div class="picker-item-top">' +
                '<span class="item-pill">' + esc(typeLabel) + '</span>' +
                '<span class="mini-badge picker-tile-state">' + stateLabel + '</span>' +
                '</div>' +
                '<div class="picker-item-name">' + esc(module.icon || '🧰') + ' ' + esc(module.name) + '</div>' +
                '<div class="picker-item-meta">' + preview.length + ' 件物品 · ' + smartCount + ' 项会变动</div>' +
                '</div>';
        }).join('')
        : '<div class="empty-panel full-span"><div class="empty-title">还没有可选小包</div><div class="empty-hint">先去创建一个吧。</div></div>';
}

function toggleTripBuilderModule(source, id) {
    const key = getModuleKey(source, id);
    const module = getModuleEntity(source, id);
    if (isBabyBaseModuleEntity(module) && tripBuilderHasBabyAddonSelection()) {
        toast('带娃行程会默认带上宝宝基础包');
        return;
    }
    if (S.tripBuilderSelection.has(key)) S.tripBuilderSelection.delete(key);
    else S.tripBuilderSelection.add(key);
    ensureTripBuilderBabyBaseSelection();
    renderTripBuilderModules();
    syncTripBuilderSummary();
}

function syncTripBuilderSummary() {
    const days = getTripBuilderDays();
    const people = getTripBuilderPeople();
    const modules = buildTripBuilderModulesFromSelection();

    const items = [];
    modules.forEach(({ source, module }) => {
        const resolved = source === 'official'
            ? resolveOfficialModuleItems(module, days, people)
            : resolveCustomModuleItems(module, days, people);
        mergeTripItems(items, resolved, { days, people, sourceModules: modules.map(entry => ({ source: entry.source, id: entry.module.id, name: entry.module.name })) }, 'module');
    });

    const previewTrip = {
        days,
        people,
        items,
        sourceModules: modules.map(entry => ({ source: entry.source, id: entry.module.id, name: entry.module.name })),
    };
    applyTripSmartFill(previewTrip, false);

    const hasBabyAddon = modules.some(entry => isBabyModuleEntity(entry.module) && !isBabyBaseModuleEntity(entry.module));
    const smartCount = previewTrip.items.filter(item => item.smartRule !== 'fixed').length;
    document.getElementById('tripBuilderCount').textContent = `已选 ${modules.length} 个小包`;
    document.getElementById('tripBuilderSummary').innerHTML = modules.length
        ? `已选 <strong>${modules.length}</strong> 个小包，预计生成 <strong>${previewTrip.items.length}</strong> 件物品，其中 <strong>${smartCount}</strong> 项会按 ${days} 天 / ${people} 人自动建议数量。${hasBabyAddon ? ' 已自动带上 <strong>宝宝基础包</strong>，并会给尿不湿、备用衣裤这类物品叠加场景系数。' : ''}`
        : '你也可以先创建一张空白行程，再慢慢从小包库或物品库往里加。';
}

function confirmCreateTrip() {
    const name = document.getElementById('createTripName').value.trim();
    if (!name) {
        toast('请先填写行程名称');
        return;
    }

    const days = getTripBuilderDays();
    const people = getTripBuilderPeople();
    const selected = buildTripBuilderModulesFromSelection();

    const items = [];
    selected.forEach(({ source, module }) => {
        const resolved = source === 'official'
            ? resolveOfficialModuleItems(module, days, people)
            : resolveCustomModuleItems(module, days, people);
        mergeTripItems(items, resolved, { days, people, sourceModules: selected.map(entry => ({ source: entry.source, id: entry.module.id, name: entry.module.name })) }, 'module');
    });

    const trip = normalizeTripRecord({
        id: 'trip-' + gid(),
        recordType: 'trip',
        name,
        days,
        people,
        bags: deepClone(DEFAULT_BAGS),
        sourceModules: selected.map(({ source, module }) => ({ source, id: module.id, name: module.name })),
        items,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    });
    applyTripSmartFill(trip, false);

    saveRecord(trip);
    closeModal('createTripModal');
    openTrip(trip.id, 'plan');
    toast(selected.some(entry => isBabyModuleEntity(entry.module) && !isBabyBaseModuleEntity(entry.module)) ? '行程已创建，已自动带上宝宝基础包' : '行程已创建');
}

function goSelectModuleForTrip() {
    if (!S.currentTrip) return;
    S.returnPage = 'list';
    S.currentModuleAction = 'add';
    nav('kits');
}

function goSelectItemsForTrip() {
    if (!S.currentTrip) return;
    S.returnPage = 'list';
    nav('items');
}

function addModuleToCurrentTrip(source, id) {
    if (!S.currentTrip) return;
    const entity = getModuleEntity(source, id);
    if (!entity) return;
    if (isBabyModuleEntity(entity) && !isBabyBaseModuleEntity(entity)) {
        ensureBabyBaseModuleOnTripRecord(S.currentTrip);
    }
    const items = source === 'official'
        ? resolveOfficialModuleItems(entity, S.currentTrip.days, S.currentTrip.people)
        : resolveCustomModuleItems(entity, S.currentTrip.days, S.currentTrip.people);
    mergeItemsIntoCurrentTrip(items, 'module', { source, id: entity.id, name: entity.name });
    toast(isBabyModuleEntity(entity) && !isBabyBaseModuleEntity(entity) ? '已加入插件包，并自动补上宝宝基础包' : '已把小包加入当前行程');
}

function addLibraryItemToCurrentTrip(itemId) {
    if (!S.currentTrip) {
        toast('请先打开一张行程');
        return;
    }
    const asset = getItemLibrary().find(item => item.id === itemId);
    if (!asset) return;
    mergeItemsIntoCurrentTrip([createTripItemFromAsset(asset, S.currentTrip.days, S.currentTrip.people)], 'manual');
    toast('已加入当前行程');
}

function mergeItemsIntoCurrentTrip(items, strategy = 'manual', sourceModule = null) {
    if (!S.currentTrip) return;
    mergeTripItems(S.currentTrip.items, items, S.currentTrip, strategy);
    if (sourceModule) upsertTripSourceModule(S.currentTrip, sourceModule);
    if (strategy === 'module') applyTripSmartFill(S.currentTrip, false);
    persistCurrentTrip();
    renderTripPage();
    renderItemLibrary();
    renderHome();
}

function openLibraryItemModal(itemId = null) {
    S.libraryModalEditId = itemId;
    const item = itemId ? getItemLibrary().find(entry => entry.id === itemId) : null;

    fillCatSelect('libraryItemCategory', item?.category || 'misc');
    fillBagSelect('libraryItemBag', item?.bag || (CATEGORY_BAG_MAP[item?.category || 'misc'] || 'bag-misc'), DEFAULT_BAGS);

    document.getElementById('libraryItemModalTitle').textContent = item ? '编辑物品' : '新增物品';
    document.getElementById('libraryItemName').value = item?.name || '';
    document.getElementById('libraryItemQty').value = item?.defaultQty || 1;
    document.getElementById('libraryItemBulkInput').value = '';
    document.getElementById('libraryBulkPanel').style.display = item ? 'none' : 'block';
    document.getElementById('libraryDeleteBtn').style.visibility = item?.source === 'user' ? 'visible' : 'hidden';

    S.currentEditingTags = Array.isArray(item?.tags) ? [...item.tags] : [];
    renderLibraryItemTags();
    document.getElementById('libraryItemTagInput').value = '';

    updateLibrarySmartHint();
    showModal('libraryItemModal');
    setTimeout(() => document.getElementById('libraryItemName').focus(), 50);
}

function renderLibraryItemTags() {
    const el = document.getElementById('libraryItemTagsDisplay');
    if (!el) return;
    el.innerHTML = S.currentEditingTags.map(tag =>
        '<span class="item-tag-pill">' + esc(tag) +
        '<span class="item-tag-remove" onclick="removeLibraryItemTag(\'' + esc(tag) + '\')">✕</span></span>'
    ).join('');
}

function addLibraryItemTag() {
    const input = document.getElementById('libraryItemTagInput');
    const val = input?.value.trim();
    if (!val) return;
    if (S.currentEditingTags.includes(val)) { toast('该标签已存在'); return; }
    S.currentEditingTags.push(val);
    renderLibraryItemTags();
    if (input) input.value = '';
}

function removeLibraryItemTag(tag) {
    S.currentEditingTags = S.currentEditingTags.filter(t => t !== tag);
    renderLibraryItemTags();
}

function updateLibrarySmartHint() {
    const hint = document.getElementById('libraryItemSmartHint');
    if (!hint) return;

    const names = S.libraryModalEditId
        ? collectDraftNames('libraryItemName')
        : collectDraftNames('libraryItemName', 'libraryItemBulkInput');
    const category = document.getElementById('libraryItemCategory')?.value || 'misc';
    const qty = Math.max(1, parseInt(document.getElementById('libraryItemQty')?.value) || 1);

    if (!names.length) {
        hint.textContent = '衣物类和宝宝高频消耗物品会默认参与智能填充；批量添加时会默认使用同一分类和默认数量。';
        return;
    }

    if (!S.libraryModalEditId && names.length > 1) {
        hint.textContent = `将批量保存 ${names.length} 件物品，统一使用当前分类、默认数量和归属小包；保存后也可以逐个再修改。`;
        return;
    }

    const name = names[0];
    const { smartRule, smartConfig } = resolveItemSmartPlan(name, category);
    hint.textContent = smartRule === 'fixed'
        ? `当前会按固定默认数量 ×${qty} 保存。`
        : `当前会按"${smartRuleLabel(smartRule, smartConfig)}"参与智能填充；基础数量为 ${qty}。`;
}

function saveLibraryItem() {
    const names = S.libraryModalEditId
        ? collectDraftNames('libraryItemName')
        : collectDraftNames('libraryItemName', 'libraryItemBulkInput');
    if (!names.length) {
        toast('请填写至少一个物品名称');
        return;
    }

    const qty = Math.max(1, parseInt(document.getElementById('libraryItemQty').value) || 1);
    const category = document.getElementById('libraryItemCategory').value;
    const bag = document.getElementById('libraryItemBag').value;
    const items = getItemLibrary();
    let added = 0;
    let updated = 0;

    names.forEach((name, index) => {
        const existing = S.libraryModalEditId
            ? items.find(item => item.id === S.libraryModalEditId)
            : items.find(item => item.name === name);
        const nextItem = buildLibraryItemDraft(name, qty, category, bag, existing);
        // Carry tags over from editing session for the primary edited item
        if (S.libraryModalEditId && index === 0) {
            nextItem.tags = [...S.currentEditingTags];
        } else if (!existing) {
            nextItem.tags = [];
        }
        if (existing) {
            const idx = items.findIndex(item => item.id === existing.id);
            if (idx >= 0) items[idx] = nextItem;
            updated += 1;
        } else {
            items.unshift(nextItem);
            added += 1;
        }
        if (S.libraryModalEditId && index === 0) return;
    });

    saveItemLibrary(items);
    closeModal('libraryItemModal');
    renderItemLibrary();
    renderModuleBuilderItems();
    toast(names.length > 1 ? `已批量处理 ${names.length} 件物品（新增 ${added}，更新 ${updated}）` : '物品库已更新');
}

function deleteLibraryItem() {
    if (!S.libraryModalEditId) return;
    const items = getItemLibrary();
    const target = items.find(item => item.id === S.libraryModalEditId);
    if (!target || target.source !== 'user') {
        toast('系统物品不支持删除');
        return;
    }
    saveItemLibrary(items.filter(item => item.id !== S.libraryModalEditId));
    closeModal('libraryItemModal');
    renderItemLibrary();
    renderModuleBuilderItems();
    toast('已删除物品');
}

function openManualItemModal() {
    fillCatSelect('manualItemCategory', 'misc');
    fillBagSelect('manualItemBag', 'bag-misc', S.currentTrip?.bags || DEFAULT_BAGS);
    document.getElementById('manualItemName').value = '';
    document.getElementById('manualItemBulkInput').value = '';
    document.getElementById('manualItemQty').value = 1;
    document.getElementById('manualItemNotes').value = '';
    updateManualItemSmartHint();
    showModal('manualItemModal');
    setTimeout(() => document.getElementById('manualItemName').focus(), 50);
}

function updateManualItemSmartHint() {
    const hint = document.getElementById('manualItemSmartHint');
    if (!hint) return;
    const names = collectDraftNames('manualItemName', 'manualItemBulkInput');
    const category = document.getElementById('manualItemCategory')?.value || 'misc';
    const qty = Math.max(1, parseInt(document.getElementById('manualItemQty')?.value) || 1);

    if (!names.length) {
        hint.textContent = '支持一次粘贴多件物品，系统会按空格、逗号或换行拆分；每件物品都会单独判断智能数量。';
        return;
    }

    if (names.length > 1) {
        hint.textContent = `将按当前分类和归属小包批量添加 ${names.length} 件物品；每件都会单独判断智能数量，之后也可以逐个修改。`;
        return;
    }

    const { smartRule, smartConfig } = resolveItemSmartPlan(names[0], category);
    const currentSuggestion = S.currentTrip
        ? computeSmartQty(qty, smartRule, S.currentTrip.days, S.currentTrip.people, smartConfig, S.currentTrip)
        : qty;
    hint.textContent = smartRule === 'fixed'
        ? `这件物品会按固定数量 ×${qty} 加入当前行程。`
        : `这件物品会按"${smartRuleLabel(smartRule, smartConfig)}"智能建议；当前行程预计数量 ×${currentSuggestion}。`;
}

function saveManualTripItem() {
    if (!S.currentTrip) return;
    const names = collectDraftNames('manualItemName', 'manualItemBulkInput');
    if (!names.length) {
        toast('请填写至少一个物品名称');
        return;
    }

    const baseQty = Math.max(1, parseInt(document.getElementById('manualItemQty').value) || 1);
    const category = document.getElementById('manualItemCategory').value;
    const bag = document.getElementById('manualItemBag').value;
    const notes = document.getElementById('manualItemNotes').value.trim();
    const items = names.map(name => {
        const { smartRule, smartConfig } = resolveItemSmartPlan(name, category);
        return normalizeTripItem({
            id: 'item-' + gid(),
            name,
            category,
            bag,
            notes,
            smartRule,
            smartConfig,
            smartBaseQty: baseQty,
            qty: computeSmartQty(baseQty, smartRule, S.currentTrip.days, S.currentTrip.people, smartConfig, S.currentTrip),
            packed: false,
            sourceModules: [],
        });
    });

    mergeItemsIntoCurrentTrip(items, 'manual');
    closeModal('manualItemModal');
    toast(names.length > 1 ? `已批量添加 ${names.length} 件物品` : '已添加到行程');
}

function openTripItemModal(itemId) {
    if (!S.currentTrip) return;
    const item = S.currentTrip.items.find(entry => entry.id === itemId);
    if (!item) return;
    S.tripItemEditId = itemId;
    document.getElementById('tripItemModalTitle').textContent = item.name;
    document.getElementById('tripItemQty').value = item.qty;
    fillCatSelect('tripItemCategory', item.category);
    fillBagSelect('tripItemBag', item.bag, S.currentTrip.bags || DEFAULT_BAGS);
    document.getElementById('tripItemNotes').value = item.notes || '';

    S.currentEditingTags = Array.isArray(item.tags) ? [...item.tags] : [];
    renderTripItemTags();
    document.getElementById('tripItemTagInput').value = '';

    updateTripItemSmartMeta();
    showModal('tripItemModal');
}

function renderTripItemTags() {
    const el = document.getElementById('tripItemTagsDisplay');
    if (!el) return;
    el.innerHTML = S.currentEditingTags.map(tag =>
        '<span class="item-tag-pill">' + esc(tag) +
        '<span class="item-tag-remove" onclick="removeTripItemTag(\'' + esc(tag) + '\')">✕</span></span>'
    ).join('');
}

function addTripItemTag() {
    const input = document.getElementById('tripItemTagInput');
    const val = input?.value.trim();
    if (!val) return;
    if (S.currentEditingTags.includes(val)) { toast('该标签已存在'); return; }
    S.currentEditingTags.push(val);
    renderTripItemTags();
    if (input) input.value = '';
}

function removeTripItemTag(tag) {
    S.currentEditingTags = S.currentEditingTags.filter(t => t !== tag);
    renderTripItemTags();
}

function updateTripItemSmartMeta() {
    const meta = document.getElementById('tripItemSmartMeta');
    if (!meta || !S.currentTrip || !S.tripItemEditId) return;
    const item = S.currentTrip.items.find(entry => entry.id === S.tripItemEditId);
    if (!item) return;

    if (item.smartRule === 'fixed') {
        meta.style.display = 'none';
        return;
    }

    const qty = Math.max(1, parseInt(document.getElementById('tripItemQty').value) || 1);
    const suggested = computeSmartQty(item.smartBaseQty || 1, item.smartRule, S.currentTrip.days, S.currentTrip.people);
    meta.style.display = 'block';
    meta.textContent = qty === suggested
        ? `智能填充：${smartRuleLabel(item.smartRule)}。当前建议数量 ×${suggested}。`
        : `智能填充：${smartRuleLabel(item.smartRule)}。当前建议 ×${suggested}；你现在填写的是 ×${qty}，保存后会优先按你的手动数量保留。`;
}

function saveCurrentTripItem() {
    if (!S.currentTrip || !S.tripItemEditId) return;
    const item = S.currentTrip.items.find(entry => entry.id === S.tripItemEditId);
    if (!item) return;

    item.qty = Math.max(1, parseInt(document.getElementById('tripItemQty').value) || 1);
    item.category = document.getElementById('tripItemCategory').value;
    item.bag = document.getElementById('tripItemBag').value;
    item.notes = document.getElementById('tripItemNotes').value.trim();
    item.tags = [...S.currentEditingTags];
    if (item.smartRule !== 'fixed') {
        const suggested = computeSmartQty(item.smartBaseQty || 1, item.smartRule, S.currentTrip.days, S.currentTrip.people);
        item.smartLocked = item.qty !== suggested;
    }

    persistCurrentTrip();
    closeModal('tripItemModal');
    renderTripPage();
    renderHome();
    toast('物品已更新');
}

function deleteCurrentTripItem() {
    if (!S.currentTrip || !S.tripItemEditId) return;
    S.currentTrip.items = S.currentTrip.items.filter(item => item.id !== S.tripItemEditId);
    persistCurrentTrip();
    closeModal('tripItemModal');
    renderTripPage();
    renderHome();
    toast('已删除物品');
}

function togglePackItem(itemId) {
    if (!S.currentTrip) return;
    const item = S.currentTrip.items.find(entry => entry.id === itemId);
    if (!item) return;
    item.packed = !item.packed;
    persistCurrentTrip();
    renderTripPage();
    renderHome();
}

function markAllPacked() {
    if (!S.currentTrip) return;
    S.currentTrip.items.forEach(item => { item.packed = true; });
    persistCurrentTrip();
    renderTripPage();
    renderHome();
    toast('已全部标记完成');
}

function markAllUnpacked() {
    if (!S.currentTrip) return;
    S.currentTrip.items.forEach(item => { item.packed = false; });
    persistCurrentTrip();
    renderTripPage();
    renderHome();
    toast('已恢复为未打包');
}

function openCreateModuleModal(initialItems = null, options = {}) {
    const editSource = options.editSource || 'custom';
    const editModule = options.editId ? getModuleEntity(editSource, options.editId) : null;
    const baseItems = editModule ? editModule.items : (initialItems || []);

    syncItemsIntoLibrary(baseItems);
    const library = getItemLibrary();
    const selected = baseItems.map(item => library.find(asset => asset.name === item.name)?.id).filter(Boolean);

    S.moduleBuilderDraftId = editModule?.id || null;
    S.moduleBuilderDraftSource = editModule ? editSource : 'custom';
    S.moduleBuilderSelection = new Set(selected);
    S.moduleBuilderSearch = '';

    document.getElementById('moduleBuilderModalTitle').textContent = editModule
        ? (editSource === 'official' ? '编辑官方小包' : '编辑我的小包')
        : '新建我的小包';
    document.getElementById('moduleBuilderSaveBtn').textContent = editModule ? '保存小包修改' : '保存到我的小包';
    document.getElementById('moduleBuilderDeleteBtn').style.visibility = editModule ? 'visible' : 'hidden';
    document.getElementById('moduleBuilderHint').textContent = editModule
        ? '已带出原有物品；按住并滑过卡片可连续补选或取消，也能手动输一个新物品马上加进当前小包。'
        : '从物品库里按住并滑过卡片即可连续多选；也可以先手动输入一个新物品再选入小包。';

    document.getElementById('moduleBuilderName').value = editModule?.name || '';
    document.getElementById('moduleBuilderIcon').value = editModule?.icon || '🧰';
    document.getElementById('moduleBuilderDesc').value = editModule?.desc || '';
    document.getElementById('moduleBuilderSearch').value = '';
    document.getElementById('moduleQuickItemName').value = '';
    document.getElementById('moduleQuickItemQty').value = 1;
    document.getElementById('moduleQuickItemCategory').value = 'misc';
    renderModuleBuilderItems();
    showModal('createModuleModal');
    setTimeout(() => document.getElementById('moduleBuilderName').focus(), 50);
}

function updateModuleBuilderSearch(value) {
    S.moduleBuilderSearch = value.trim();
    renderModuleBuilderItems();
}

function clearModuleBuilderSelection() {
    S.moduleBuilderSelection = new Set();
    renderModuleBuilderItems();
}

function updateModuleQuickItemCategory() {
    const input = document.getElementById('moduleQuickItemName');
    const select = document.getElementById('moduleQuickItemCategory');
    if (!input || !select) return;
    const current = select.value;
    if (current && current !== 'misc') return;
    select.value = guessCat(input.value.trim());
}

function addBuilderCustomItem() {
    const name = document.getElementById('moduleQuickItemName').value.trim();
    if (!name) {
        toast('请先填写物品名称');
        return;
    }
    const qty = Math.max(1, parseInt(document.getElementById('moduleQuickItemQty').value) || 1);
    const category = document.getElementById('moduleQuickItemCategory').value || guessCat(name);
    const bag = category === 'misc' && name.includes('宝宝') ? 'bag-baby' : (CATEGORY_BAG_MAP[category] || 'bag-misc');
    const { smartRule, smartConfig } = resolveItemSmartPlan(name, category);
    const library = getItemLibrary();
    let target = library.find(item => item.name === name) || null;

    if (!target) {
        target = normalizeLibraryItem({
            id: 'asset-' + gid(),
            name,
            defaultQty: qty,
            category,
            bag,
            smartRule,
            smartConfig,
            source: 'user',
        });
        library.unshift(target);
        saveItemLibrary(library);
    } else {
        target = normalizeLibraryItem({
            ...target,
            defaultQty: qty,
            category,
            bag,
            smartRule,
            smartConfig,
        });
        const idx = library.findIndex(item => item.id === target.id);
        if (idx >= 0) library[idx] = target;
        saveItemLibrary(library);
    }

    S.moduleBuilderSelection.add(target.id);
    document.getElementById('moduleQuickItemName').value = '';
    document.getElementById('moduleQuickItemQty').value = 1;
    document.getElementById('moduleQuickItemCategory').value = 'misc';
    renderModuleBuilderItems();
    renderItemLibrary();
    toast('新物品已加入物品库，并选入当前小包');
}

function renderModuleBuilderItems() {
    const box = document.getElementById('moduleBuilderItems');
    if (!box) return;

    const keyword = S.moduleBuilderSearch.toLowerCase();
    const items = getItemLibrary()
        .filter(item => !keyword || item.name.toLowerCase().includes(keyword))
        .sort((a, b) => {
            const selectedDiff = Number(S.moduleBuilderSelection.has(b.id)) - Number(S.moduleBuilderSelection.has(a.id));
            if (selectedDiff !== 0) return selectedDiff;
            const userDiff = Number(b.source === 'user') - Number(a.source === 'user');
            if (userDiff !== 0) return userDiff;
            return a.name.localeCompare(b.name, 'zh-Hans-CN');
        });

    box.innerHTML = items.length
        ? items.map(item => {
            const selected = S.moduleBuilderSelection.has(item.id);
            const cat = catInfo(item.category);
            return '<div class="picker-item ' + (selected ? 'selected' : '') + '" data-item-id="' + item.id + '">' +
                '<div class="picker-item-top">' +
                '<span class="item-pill ' + cat.cssClass + '">' + esc(cat.name) + '</span>' +
                '<span class="mini-badge picker-tile-state">' + (selected ? '已选' : '滑选') + '</span>' +
                '</div>' +
                '<div class="picker-item-name">' + esc(item.name) + '</div>' +
                '<div class="picker-item-meta">默认 ×' + item.defaultQty + ' · ' + esc(smartRuleShort(item.smartRule)) + '</div>' +
                '</div>';
        }).join('')
        : '<div class="empty-panel full-span"><div class="empty-title">没有找到物品</div><div class="empty-hint">换个关键词试试。</div></div>';

    syncModuleBuilderMeta();
}

function syncModuleBuilderMeta() {
    const meta = document.getElementById('moduleBuilderCount');
    const clearBtn = document.getElementById('moduleBuilderClearBtn');
    if (meta) meta.textContent = `已选 ${S.moduleBuilderSelection.size} 件`;
    if (clearBtn) clearBtn.textContent = S.moduleBuilderSelection.size ? `清空（${S.moduleBuilderSelection.size}）` : '清空选择';
}

function setupModuleBuilderGesture() {
    const box = document.getElementById('moduleBuilderItems');
    if (!box || box.dataset.gestureReady === 'true') return;
    box.dataset.gestureReady = 'true';
    box.addEventListener('pointerdown', handleModuleBuilderPointerDown);
    box.addEventListener('pointermove', handleModuleBuilderPointerMove);
    document.addEventListener('pointerup', endModuleBuilderGesture);
    document.addEventListener('pointercancel', endModuleBuilderGesture);
}

function handleModuleBuilderPointerDown(event) {
    const box = document.getElementById('moduleBuilderItems');
    const tile = event.target.closest('.picker-item');
    if (!box || !tile || !box.contains(tile)) return;

    const itemId = tile.dataset.itemId;
    const shouldSelect = !S.moduleBuilderSelection.has(itemId);
    S.moduleBuilderGesture = {
        active: true,
        pointerId: event.pointerId,
        mode: shouldSelect ? 'add' : 'remove',
        visited: new Set(),
    };

    try {
        box.setPointerCapture(event.pointerId);
    } catch {
        // ignore
    }

    applyModuleBuilderGesture(itemId);
    event.preventDefault();
}

function handleModuleBuilderPointerMove(event) {
    if (!S.moduleBuilderGesture.active || S.moduleBuilderGesture.pointerId !== event.pointerId) return;
    const box = document.getElementById('moduleBuilderItems');
    if (!box) return;
    const node = document.elementFromPoint(event.clientX, event.clientY);
    const tile = node && node.closest ? node.closest('.picker-item') : null;
    if (!tile || !box.contains(tile)) return;
    applyModuleBuilderGesture(tile.dataset.itemId);
    event.preventDefault();
}

function applyModuleBuilderGesture(itemId) {
    if (!itemId || S.moduleBuilderGesture.visited.has(itemId)) return;
    S.moduleBuilderGesture.visited.add(itemId);
    setModuleBuilderItemSelected(itemId, S.moduleBuilderGesture.mode === 'add');
}

function setModuleBuilderItemSelected(itemId, selected) {
    if (selected) S.moduleBuilderSelection.add(itemId);
    else S.moduleBuilderSelection.delete(itemId);

    const tile = document.querySelector('.picker-item[data-item-id="' + itemId + '"]');
    if (tile) {
        tile.classList.toggle('selected', selected);
        const state = tile.querySelector('.picker-tile-state');
        if (state) state.textContent = selected ? '已选' : '滑选';
    }
    syncModuleBuilderMeta();
}

function endModuleBuilderGesture(event) {
    if (!S.moduleBuilderGesture.active) return;
    if (event?.pointerId != null && event.pointerId !== S.moduleBuilderGesture.pointerId) return;
    const box = document.getElementById('moduleBuilderItems');
    try {
        box?.releasePointerCapture?.(S.moduleBuilderGesture.pointerId);
    } catch {
        // ignore
    }
    S.moduleBuilderGesture = {
        active: false,
        pointerId: null,
        mode: 'add',
        visited: new Set(),
    };
}

function saveCustomModule() {
    const name = document.getElementById('moduleBuilderName').value.trim();
    if (!name) {
        toast('请填写小包名称');
        return;
    }

    const selectedIds = Array.from(S.moduleBuilderSelection);
    if (!selectedIds.length) {
        toast('请至少选择一个物品');
        return;
    }

    const library = getItemLibrary();
    const items = selectedIds.map(id => {
        const asset = library.find(entry => entry.id === id);
        return asset ? createModuleItemFromAsset(asset) : null;
    }).filter(Boolean);

    if (S.moduleBuilderDraftSource === 'official') {
        const officialModules = getOfficialModules();
        const existing = S.moduleBuilderDraftId ? officialModules.find(item => item.id === S.moduleBuilderDraftId) : null;
        const nextModule = normalizeOfficialModule({
            ...existing,
            id: existing?.id || ('official-module-' + gid()),
            name,
            icon: document.getElementById('moduleBuilderIcon').value.trim() || '🧰',
            desc: document.getElementById('moduleBuilderDesc').value.trim(),
            purpose: existing?.purpose || 'starter',
            group: existing?.group || '',
            role: existing?.role || '',
            defaultOn: existing?.defaultOn || false,
            tags: existing?.tags?.length ? existing.tags : ['官方小包'],
            items,
        });
        const idx = officialModules.findIndex(item => item.id === nextModule.id);
        if (idx >= 0) officialModules[idx] = nextModule;
        else officialModules.unshift(nextModule);
        saveOfficialModules(officialModules);
        closeModal('createModuleModal');
        renderModuleLibrary();
        renderHome();
        toast('官方小包已更新');
        return;
    }

    const existing = S.moduleBuilderDraftId ? getMyModules().find(item => item.id === S.moduleBuilderDraftId) : null;
    const module = normalizeModuleRecord({
        id: existing?.id || ('module-' + gid()),
        recordType: 'module',
        name,
        icon: document.getElementById('moduleBuilderIcon').value.trim() || '🧰',
        desc: document.getElementById('moduleBuilderDesc').value.trim(),
        purpose: 'custom',
        tags: existing?.tags || ['我的小包'],
        items,
        createdAt: existing?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    });

    saveRecord(module);
    closeModal('createModuleModal');
    renderModuleLibrary();
    renderHome();
    toast(existing ? '小包已更新' : '已保存到我的小包');
}

function deleteCurrentModuleDraft() {
    if (!S.moduleBuilderDraftId) return;
    if (!confirm(S.moduleBuilderDraftSource === 'official' ? '确定删除这个官方小包吗？' : '确定删除这个小包吗？')) return;

    if (S.moduleBuilderDraftSource === 'official') {
        saveOfficialModules(getOfficialModules().filter(item => item.id !== S.moduleBuilderDraftId));
    } else {
        deleteRecord(S.moduleBuilderDraftId, { silent: true });
    }

    closeModal('createModuleModal');
    renderModuleLibrary();
    renderHome();
    toast(S.moduleBuilderDraftSource === 'official' ? '已删除官方小包' : '已删除小包');
}

function saveCurrentTripAsModule() {
    if (!S.currentTrip || !S.currentTrip.items.length) {
        toast('空行程还不能保存为小包');
        return;
    }
    openCreateModuleModal(S.currentTrip.items);
    document.getElementById('moduleBuilderName').value = S.currentTrip.name + ' 小包';
    document.getElementById('moduleBuilderDesc').value = `由行程「${S.currentTrip.name}」沉淀而来，可在后续 Trips 中复用。`;
}

function duplicateTrip(id) {
    const target = getTrips().find(trip => trip.id === id);
    if (!target) return;
    const copy = deepClone(target);
    copy.id = 'trip-' + gid();
    copy.name = target.name + '（副本）';
    copy.recordType = 'trip';
    copy.createdAt = new Date().toISOString();
    copy.updatedAt = new Date().toISOString();
    saveRecord(copy);
    renderHome();
    toast('已复制行程');
}

function deleteRecord(id, options = {}) {
    const records = getRecords().filter(record => record.id !== id);
    saveRecords(records);
    if (S.currentTripId === id) {
        S.currentTripId = null;
        S.currentTrip = null;
    }
    if (S.currentModule?.id === id) {
        S.currentModule = null;
        closeModal('moduleDetailModal');
    }
    if (!options.silent) {
        if (S.currentPage === 'list') nav('home');
        renderHome();
        renderModuleLibrary();
        toast('已删除');
    }
}

function persistCurrentTrip() {
    if (!S.currentTrip?.id) return;
    S.currentTrip.updatedAt = new Date().toISOString();
    saveRecord(S.currentTrip);
}

function getModuleEntity(source, id) {
    if (source === 'official') return getOfficialModules().find(module => module.id === id) || null;
    return getMyModules().find(module => module.id === id) || null;
}

function resolveOfficialModuleItems(module, days, people) {
    return (module.items || []).map(item => createTripItemFromModuleItem(normalizeModuleItem(item), days, people, module.name));
}

function resolveCustomModuleItems(module, days, people) {
    return (module.items || []).map(item => createTripItemFromModuleItem(item, days, people, module.name));
}

function resolveItemSmartPlan(name, category, rawRule = null, rawConfig = null) {
    const smartConfig = normalizeSmartConfig(rawConfig || inferSmartConfig(name, category));
    const fallbackRule = inferSmartRule(name, category);
    const smartRule = rawRule || (smartConfig ? 'formula' : fallbackRule);
    return {
        smartRule: smartConfig && smartRule === 'fixed' ? 'formula' : smartRule,
        smartConfig,
    };
}

function createTripItemFromDef(def, days, people, sourceModuleName) {
    const category = def.c || def.category || guessCat(def.name);
    const baseQty = Math.max(1, parseInt(def.q) || 1);
    const { smartRule, smartConfig } = resolveItemSmartPlan(def.name, category, def.smartRule || def.smart, def.smartConfig);
    return normalizeTripItem({
        id: 'item-' + gid(),
        name: def.name,
        category,
        bag: def.bag || suggestBagForItem(def.name, category),
        smartRule,
        smartConfig,
        smartBaseQty: baseQty,
        qty: computeSmartQty(baseQty, smartRule, days, people, smartConfig),
        packed: false,
        notes: '',
        sourceModules: sourceModuleName ? [sourceModuleName] : [],
        tags: Array.isArray(def.tags) ? [...def.tags] : [],
    });
}

function createTripItemFromModuleItem(item, days, people, sourceModuleName) {
    const { smartRule, smartConfig } = resolveItemSmartPlan(item.name, item.category, item.smartRule, item.smartConfig);
    return normalizeTripItem({
        id: 'item-' + gid(),
        name: item.name,
        category: item.category,
        bag: item.bag,
        smartRule,
        smartConfig,
        smartBaseQty: item.defaultQty,
        qty: computeSmartQty(item.defaultQty, smartRule, days, people, smartConfig),
        packed: false,
        notes: '',
        sourceModules: sourceModuleName ? [sourceModuleName] : [],
        tags: Array.isArray(item.tags) ? [...item.tags] : [],
    });
}

function createTripItemFromAsset(asset, days, people) {
    const { smartRule, smartConfig } = resolveItemSmartPlan(asset.name, asset.category, asset.smartRule, asset.smartConfig);
    return normalizeTripItem({
        id: 'item-' + gid(),
        name: asset.name,
        category: asset.category,
        bag: asset.bag || suggestBagForItem(asset.name, asset.category),
        smartRule,
        smartConfig,
        smartBaseQty: asset.defaultQty || 1,
        qty: computeSmartQty(asset.defaultQty || 1, smartRule, days, people, smartConfig),
        packed: false,
        notes: '',
        sourceModules: [],
        tags: Array.isArray(asset.tags) ? [...asset.tags] : [],
    });
}

function createModuleItemFromAsset(asset) {
    const { smartRule, smartConfig } = resolveItemSmartPlan(asset.name, asset.category, asset.smartRule, asset.smartConfig);
    return normalizeModuleItem({
        id: 'module-item-' + gid(),
        name: asset.name,
        category: asset.category,
        bag: asset.bag || suggestBagForItem(asset.name, asset.category),
        defaultQty: asset.defaultQty || 1,
        smartRule,
        smartConfig,
    });
}

function mergeTripItems(targetItems, incomingItems, tripContext, strategy = 'manual') {
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

function applyTripSmartFill(trip, unlockAll = false) {
    trip.items = trip.items.map(item => {
        const next = normalizeTripItem(item);
        if (unlockAll) next.smartLocked = false;
        if (next.smartRule !== 'fixed' && !next.smartLocked) {
            next.qty = computeSmartQty(next.smartBaseQty || 1, next.smartRule, trip.days, trip.people, next.smartConfig, trip);
        }
        return next;
    });
}

function normalizeSmartConfig(config) {
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

function mergeSmartConfig(currentConfig, nextConfig) {
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

function getSmartSceneFactor(smartConfig, tripContext) {
    const config = normalizeSmartConfig(smartConfig);
    if (!config || !tripContext?.sourceModules?.length) return 0;
    const activeModuleIds = new Set((tripContext.sourceModules || []).map(module => module.id));
    return Object.keys(config.sceneFactors).reduce((sum, moduleId) => sum + (activeModuleIds.has(moduleId) ? config.sceneFactors[moduleId] : 0), 0);
}

function computeSmartQty(baseQty, smartRule, days, people, smartConfig = null, tripContext = null) {
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

function strongerSmartRule(currentRule, nextRule) {
    const order = { fixed: 0, perPerson: 1, perDay: 2, perPersonPerDay: 3, formula: 4 };
    return (order[nextRule] || 0) > (order[currentRule] || 0) ? nextRule : currentRule;
}

function smartRuleLabel(rule, smartConfig = null) {
    if (rule === 'formula') {
        const config = normalizeSmartConfig(smartConfig);
        if (!config) return '基础量 + 天数增量 + 场景系数';
        return `基础量 + ${config.dailyIncrement}×天数 + 场景系数`;
    }
    if (rule === 'perPerson') return '按人数建议';
    if (rule === 'perDay') return '按天数建议';
    if (rule === 'perPersonPerDay') return '按天数 × 人数建议';
    return '固定数量';
}

function smartRuleShort(rule) {
    if (rule === 'formula') return '公式补量';
    if (rule === 'perPerson') return '按人数';
    if (rule === 'perDay') return '按天数';
    if (rule === 'perPersonPerDay') return '按天/人';
    return '固定';
}

function inferSmartConfig(name, category) {
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

function inferSmartRule(name, category) {
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

function getTripProgress(trip) {
    const total = trip.items?.length || 0;
    const packed = trip.items?.filter(item => item.packed).length || 0;
    return {
        total,
        packed,
        pending: Math.max(0, total - packed),
        pct: total ? Math.round((packed / total) * 100) : 0,
    };
}

function getTripStatus(trip) {
    const progress = getTripProgress(trip);
    if (progress.total > 0 && progress.packed >= progress.total) return { key: 'done', label: '已完成', icon: '✅' };
    if (progress.packed > 0) return { key: 'packing', label: '打包中', icon: '🎒' };
    return { key: 'planning', label: '规划中', icon: '📝' };
}

function formatTripMeta(trip) {
    const modules = trip.sourceModules?.length ? ` · ${trip.sourceModules.length} 个小包` : '';
    return `${trip.days || 1} 天 · ${trip.people || 1} 人 · ${trip.items?.length || 0} 件${modules}`;
}

function formatTripSourceSummary(trip) {
    if (!trip.sourceModules?.length) return '自由添加物品';
    const names = trip.sourceModules.map(module => module.name);
    if (names.length <= 2) return names.join(' + ');
    return names.slice(0, 2).join(' + ') + ` +${names.length - 2} 个小包`;
}

function formatItemSource(item) {
    if (!item.sourceModules?.length) return '';
    if (item.sourceModules.length === 1) return '来自 ' + item.sourceModules[0];
    return `来自 ${item.sourceModules.length} 个小包`;
}

function stepValue(id, delta) {
    const input = document.getElementById(id);
    if (!input) return;
    const min = parseInt(input.min) || 0;
    const max = parseInt(input.max) || 90;
    let value = parseInt(input.value);
    if (!Number.isFinite(value)) value = min;
    value = Math.max(min, Math.min(max, value + delta));
    input.value = value;
    if (id === 'tripDays' || id === 'tripPeople') {
        syncTripBuilderSummary();
        renderTripBuilderModules();
    }
}

function getTripBuilderDays() {
    return Math.max(1, parseInt(document.getElementById('tripDays')?.value) || 1);
}

function getTripBuilderPeople() {
    return Math.max(1, parseInt(document.getElementById('tripPeople')?.value) || 1);
}

function getPreviewDays() {
    return S.currentTrip?.days || 2;
}

function getPreviewPeople() {
    return S.currentTrip?.people || 1;
}

function getModuleKey(source, id) {
    return `${source}:${id}`;
}

function splitModuleKey(key) {
    return key.split(':');
}

function getBabyBaseModule() {
    return getOfficialModules().find(module => module.id === BABY_MODULE_IDS.base) || null;
}

function isBabyModuleEntity(module) {
    if (!module) return false;
    if (module.group === 'baby') return true;
    if (module.purpose === 'family') return true;
    const blob = [module.name, module.desc, ...(module.tags || []), ...((module.items || []).map(item => item.name || ''))].join(' ');
    return /宝宝|带娃|疫苗|奶瓶|尿不湿|辅食/.test(blob);
}

function isBabyBaseModuleEntity(module) {
    return !!module && module.id === BABY_MODULE_IDS.base;
}

function tripBuilderHasBabyAddonSelection() {
    return Array.from(S.tripBuilderSelection).some(key => {
        const [source, id] = splitModuleKey(key);
        const module = getModuleEntity(source, id);
        return isBabyModuleEntity(module) && !isBabyBaseModuleEntity(module);
    });
}

function ensureTripBuilderBabyBaseSelection() {
    if (!tripBuilderHasBabyAddonSelection()) return;
    S.tripBuilderSelection.add(getModuleKey('official', BABY_MODULE_IDS.base));
}

function buildTripBuilderModulesFromSelection() {
    ensureTripBuilderBabyBaseSelection();
    return Array.from(S.tripBuilderSelection).map(key => {
        const [source, id] = splitModuleKey(key);
        const module = getModuleEntity(source, id);
        return module ? { source, module } : null;
    }).filter(Boolean);
}

function upsertTripSourceModule(trip, sourceModule) {
    if (!trip || !sourceModule) return;
    const existing = trip.sourceModules || [];
    if (!existing.some(module => module.source === sourceModule.source && module.id === sourceModule.id)) {
        existing.push(sourceModule);
        trip.sourceModules = existing;
    }
}

function ensureBabyBaseModuleOnTripRecord(trip) {
    if (!trip) return;
    const baseModule = getBabyBaseModule();
    if (!baseModule) return;
    if ((trip.sourceModules || []).some(module => module.source === 'official' && module.id === baseModule.id)) return;
    const items = resolveOfficialModuleItems(baseModule, trip.days, trip.people);
    mergeTripItems(trip.items, items, trip, 'module');
    upsertTripSourceModule(trip, { source: 'official', id: baseModule.id, name: baseModule.name });
}

function syncBagWithCategory(catSelectId, bagSelectId, bags) {
    const category = document.getElementById(catSelectId)?.value;
    const select = document.getElementById(bagSelectId);
    if (!category || !select) return;
    const preferred = suggestBagForItem(
        document.getElementById(catSelectId.replace('Category', 'Name'))?.value || '',
        category
    );
    fillBagSelect(bagSelectId, preferred, bags);
}

function suggestBagForItem(name, category) {
    const n = String(name || '');
    if (['疫苗本', '退烧贴', '退热贴', '医保卡'].some(keyword => n.includes(keyword))) return 'bag-baby-vaccine';
    if (['奶瓶', '奶粉', '奶粉格', '辅食碗', '围兜', '围嘴', '保温杯'].some(keyword => n.includes(keyword))) return 'bag-baby-feeding';
    if (['便携烧水壶', '奶瓶刷', '折叠澡盆'].some(keyword => n.includes(keyword))) return 'bag-baby-overnight';
    if (['驱蚊液', '防晒霜', '便携马桶', '大量零食'].some(keyword => n.includes(keyword))) return 'bag-baby-outdoor';
    if (n.includes('宝宝') || ['尿不湿', '纸尿裤', '隔尿垫', '棉柔巾', '湿巾（婴儿专用）', '备用衣裤', '安抚奶嘴', '口水巾'].some(keyword => n.includes(keyword))) return 'bag-baby';
    return CATEGORY_BAG_MAP[category] || 'bag-misc';
}

function readJson(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
}

function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getRecords() {
    return readJson(STORAGE_KEYS.records, [])
        .map(normalizeRecord)
        .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));
}

function saveRecords(records) {
    writeJson(STORAGE_KEYS.records, records);
}

function saveRecord(record) {
    const records = getRecords();
    const idx = records.findIndex(item => item.id === record.id);
    const normalized = normalizeRecord(record);
    if (idx >= 0) records[idx] = normalized;
    else records.unshift(normalized);
    saveRecords(records);
}

function getOfficialModules() {
    return readJson(STORAGE_KEYS.officialModules, OFFICIAL_MODULES)
        .map(normalizeOfficialModule);
}

function saveOfficialModules(modules) {
    writeJson(STORAGE_KEYS.officialModules, (modules || []).map(normalizeOfficialModule));
}

function getTrips() {
    return getRecords().filter(record => record.recordType === 'trip');
}

function getMyModules() {
    return getRecords().filter(record => record.recordType === 'module');
}

function getItemLibrary() {
    const items = readJson(STORAGE_KEYS.itemLibrary, buildSeedItemLibrary());
    return sortLibraryItems((items || []).map(normalizeLibraryItem));
}

function saveItemLibrary(items) {
    writeJson(STORAGE_KEYS.itemLibrary, sortLibraryItems((items || []).map(normalizeLibraryItem)));
}

function buildSeedItemLibrary() {
    const byName = new Map();
    const ref = { value: 1 };
    BASE_LIBRARY_ITEMS.forEach(def => registerSeedItem(byName, def, ref));
    getOfficialModules().forEach(module => {
        module.items.forEach(def => registerSeedItem(byName, def, ref));
    });
    return sortLibraryItems(Array.from(byName.values()));
}

function registerSeedItem(map, def, ref) {
    const name = String(def.name || '').trim();
    if (!name || map.has(name)) return;
    const category = def.category || def.c || guessCat(name);
    map.set(name, normalizeLibraryItem({
        id: 'asset-seed-' + ref.value++,
        name,
        category,
        defaultQty: def.defaultQty || def.q || 1,
        bag: def.bag || suggestBagForItem(name, category),
        smartRule: def.smartRule || def.smart || inferSmartRule(name, category),
        source: 'system',
    }));
}

function ensureItemLibrarySeeded() {
    const stored = readJson(STORAGE_KEYS.itemLibrary, null);
    const seeded = buildSeedItemLibrary();
    if (!stored || !stored.length) {
        saveItemLibrary(seeded);
        return;
    }

    const merged = (stored || []).map(normalizeLibraryItem);
    const byName = new Map(merged.map(item => [item.name, true]));
    seeded.forEach(item => {
        if (!byName.has(item.name)) merged.push(item);
    });
    saveItemLibrary(merged);
}

function syncItemsIntoLibrary(items = []) {
    if (!items.length) return;
    const library = getItemLibrary();
    const byName = new Map(library.map(item => [item.name, true]));
    let changed = false;

    items.forEach(item => {
        const name = String(item?.name || '').trim();
        if (!name || byName.has(name)) return;
        const category = item.category || guessCat(name);
        const { smartRule, smartConfig } = resolveItemSmartPlan(name, category, item.smartRule, item.smartConfig);
        library.unshift(normalizeLibraryItem({
            id: 'asset-' + gid(),
            name,
            category,
            defaultQty: item.defaultQty || item.smartBaseQty || item.qty || 1,
            bag: item.bag || suggestBagForItem(name, category),
            smartRule,
            smartConfig,
            source: 'user',
        }));
        byName.set(name, true);
        changed = true;
    });

    if (changed) saveItemLibrary(library);
}

function sortLibraryItems(items) {
    return [...items].sort((a, b) => {
        const sourceDiff = Number(b.source === 'user') - Number(a.source === 'user');
        if (sourceDiff !== 0) return sourceDiff;
        const categoryDiff = catInfo(a.category).name.localeCompare(catInfo(b.category).name, 'zh-Hans-CN');
        if (categoryDiff !== 0) return categoryDiff;
        return a.name.localeCompare(b.name, 'zh-Hans-CN');
    });
}

function normalizeRecord(record) {
    const type = record.recordType || (record.isTemplate ? 'module' : 'trip');
    return type === 'module' ? normalizeModuleRecord(record) : normalizeTripRecord(record);
}

function normalizeTripRecord(record) {
    const bags = Array.isArray(record.bags) && record.bags.length ? record.bags : deepClone(DEFAULT_BAGS);
    return {
        ...record,
        recordType: 'trip',
        isTemplate: false,
        days: Math.max(1, parseInt(record.days) || 1),
        people: Math.max(1, parseInt(record.people) || 1),
        bags,
        sourceModules: Array.isArray(record.sourceModules) ? record.sourceModules.map(module => ({
            source: module.source || 'custom',
            id: module.id || '',
            name: module.name || '未命名小包',
        })) : [],
        items: (record.items || []).map(normalizeTripItem),
        createdAt: record.createdAt || new Date().toISOString(),
        updatedAt: record.updatedAt || record.createdAt || new Date().toISOString(),
    };
}

function normalizeOfficialModule(module) {
    return {
        id: module?.id || ('official-module-' + gid()),
        name: module?.name || '未命名官方小包',
        icon: module?.icon || '🧰',
        purpose: module?.purpose || 'starter',
        group: module?.group || '',
        role: module?.role || '',
        defaultOn: Boolean(module?.defaultOn),
        desc: module?.desc || '',
        tags: Array.isArray(module?.tags) ? uniqueStrings(module.tags) : [],
        items: (module?.items || []).map(normalizeModuleItem),
    };
}

function normalizeModuleRecord(record) {
    return {
        ...record,
        recordType: 'module',
        isTemplate: true,
        icon: record.icon || record.kitMeta?.icon || '🧰',
        desc: record.desc || record.kitMeta?.desc || '',
        purpose: record.purpose || 'custom',
        tags: Array.isArray(record.tags) ? record.tags : [],
        items: (record.items || []).map(normalizeModuleItem),
        createdAt: record.createdAt || new Date().toISOString(),
        updatedAt: record.updatedAt || record.createdAt || new Date().toISOString(),
    };
}

function normalizeTripItem(item) {
    const category = item.category || guessCat(item.name || '');
    const smartConfig = normalizeSmartConfig(item.smartConfig || inferSmartConfig(item.name, category));
    return {
        id: item.id || ('item-' + gid()),
        name: item.name || '未命名物品',
        category,
        bag: item.bag || suggestBagForItem(item.name, category),
        qty: Math.max(1, parseInt(item.qty) || 1),
        packed: Boolean(item.packed),
        notes: item.notes || '',
        smartRule: item.smartRule || (smartConfig ? 'formula' : 'fixed'),
        smartConfig,
        smartBaseQty: Math.max(1, parseInt(item.smartBaseQty) || parseInt(item.defaultQty) || parseInt(item.qty) || 1),
        smartLocked: Boolean(item.smartLocked),
        sourceModules: Array.isArray(item.sourceModules) ? uniqueStrings(item.sourceModules) : (item.sourceModule ? [item.sourceModule] : []),
        tags: Array.isArray(item?.tags) ? uniqueStrings(item.tags) : [],
    };
}

function normalizeModuleItem(item) {
    const category = item.category || guessCat(item.name || '');
    const smartConfig = normalizeSmartConfig(item.smartConfig || inferSmartConfig(item.name, category));
    return {
        id: item.id || ('module-item-' + gid()),
        name: item.name || '未命名物品',
        category,
        bag: item.bag || suggestBagForItem(item.name, category),
        defaultQty: Math.max(1, parseInt(item.defaultQty) || parseInt(item.smartBaseQty) || parseInt(item.qty) || 1),
        smartRule: item.smartRule || (smartConfig ? 'formula' : inferSmartRule(item.name, category)),
        smartConfig,
    };
}

function normalizeLibraryItem(item) {
    const name = String(item?.name || '未命名物品').trim();
    const category = item?.category || guessCat(name);
    const smartConfig = normalizeSmartConfig(item?.smartConfig || inferSmartConfig(name, category));
    return {
        id: item?.id || ('asset-' + gid()),
        name,
        category,
        defaultQty: Math.max(1, parseInt(item?.defaultQty) || 1),
        bag: item?.bag || suggestBagForItem(name, category),
        smartRule: smartConfig ? 'formula' : (item?.smartRule || inferSmartRule(name, category)),
        smartConfig,
        source: item?.source === 'user' ? 'user' : 'system',
        tags: Array.isArray(item?.tags) ? uniqueStrings(item.tags) : [],
    };
}

function catInfo(id) {
    return DEFAULT_CATEGORIES.find(cat => cat.id === id) || { id: 'misc', name: '杂物', cssClass: 'cat-misc' };
}

function bagName(id, bags = DEFAULT_BAGS) {
    const bag = (bags || []).find(entry => entry.id === id);
    return bag ? bag.name : '未分配';
}

function bagIcon(id, bags = DEFAULT_BAGS) {
    const bag = (bags || []).find(entry => entry.id === id);
    return bag ? bag.icon : '📦';
}

function fillCatSelect(id, selected) {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = DEFAULT_CATEGORIES.map(cat => '<option value="' + cat.id + '"' + (cat.id === selected ? ' selected' : '') + '>' + cat.name + '</option>').join('');
}

function fillBagSelect(id, selected, bags = DEFAULT_BAGS) {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = (bags || DEFAULT_BAGS).map(bag => '<option value="' + bag.id + '"' + (bag.id === selected ? ' selected' : '') + '>' + bag.icon + ' ' + bag.name + '</option>').join('');
}

function guessCat(name) {
    const n = String(name || '').toLowerCase();
    const rules = [
        [['身份证', '护照', '签证', '驾照', '工作证', '门禁', '名片', '发票', '行程', '保险', '户口', '出生', '学生证', '预订', '确认单', '社保', '医保'], 'docs'],
        [['充电', '电池', '数据线', '耳机', '手机', '电脑', 'pad', '平板', '相机', '转换插', 'u盘', '鼠标', '手电', '头灯', '露营灯', '音箱', '自拍', '插线板', '读卡器', 'watch'], 'electronics'],
        [['衬衫', 't恤', '裤', '裙', '连衣裙', '内衣', '内裤', '文胸', '袜', '外套', '西装', '风衣', '睡衣', '泳衣', '拖鞋', '鞋', '冲锋衣', '速干', '帽子', '围巾', '口水巾', '宝宝衣服', '宝宝袜子', '打底裤'], 'clothing'],
        [['牙刷', '牙膏', '漱口', '牙线', '洗面', '梳', '剃须', '沐浴', '洗发', '香皂', '浴巾', '毛巾', '牙刷杯'], 'hygiene'],
        [['面霜', '防晒', '唇膏', '面膜', '芦荟', '驱蚊', '护肤', '护臀', '乳液', '精华', '身体乳', '护手霜', '喷雾'], 'skincare'],
        [['口红', '唇釉', '粉底', '粉扑', '气垫', '眼影', '化妆', '卸妆', '睫毛', '腮红', '眉笔', '眼线', '遮瑕', '散粉', '高光', '修容', '定妆', '妆前', '美妆蛋', '化妆刷', '香水'], 'makeup'],
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

function uniqueStrings(values) {
    return Array.from(new Set((values || []).filter(Boolean)));
}

function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
}

function gid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function esc(value) {
    const div = document.createElement('div');
    div.textContent = value == null ? '' : String(value);
    return div.innerHTML;
}

function setupModalOverlays() {
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', event => {
            if (event.target === overlay) overlay.classList.remove('active');
        });
    });
}

function showModal(id) {
    document.getElementById(id)?.classList.add('active');
}

function closeModal(id) {
    if (id === 'createModuleModal') {
        S.moduleBuilderDraftId = null;
        endModuleBuilderGesture();
    }
    document.getElementById(id)?.classList.remove('active');
}

function toast(message) {
    const el = document.createElement('div');
    el.className = 'notification';
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2200);
}

// ===== 新手引导 =====

const ONBOARDING_STEPS = [
    {
        icon: '🧰',
        title: '第一步：整理小包',
        desc: '把你常带的物品按用途分组，比如洗漱包、化妆包、证件包。系统已预置了一批官方小包，你也可以新建自己的。',
    },
    {
        icon: '📝',
        title: '第二步：新建行程',
        desc: '每次出门前，新建一个行程，勾选这次需要带的小包。系统会自动合并物品并按天数、人数建议数量。',
    },
    {
        icon: '🎒',
        title: '第三步：打包出发',
        desc: '打开行程后切换到"打包模式"，实物打包时逐一勾选，再也不怕落东西。',
    },
];

let onboardingIndex = 0;

function startOnboarding() {
    onboardingIndex = 0;
    renderOnboardingStep();
    showModal('onboardingModal');
}

function renderOnboardingStep() {
    const step = ONBOARDING_STEPS[onboardingIndex];
    const stepEl = document.getElementById('onboardingStep');
    const dotsEl = document.getElementById('onboardingDots');
    const nextBtn = document.getElementById('onboardingNext');
    const skipBtn = document.getElementById('onboardingSkip');
    if (!stepEl || !step) return;

    stepEl.innerHTML = '<div class="onboarding-icon">' + step.icon + '</div>' +
        '<div class="onboarding-title">' + step.title + '</div>' +
        '<div class="onboarding-desc">' + step.desc + '</div>';

    dotsEl.innerHTML = ONBOARDING_STEPS.map((_, i) =>
        '<span class="onboarding-dot ' + (i === onboardingIndex ? 'active' : '') + '"></span>'
    ).join('');

    const isLast = onboardingIndex >= ONBOARDING_STEPS.length - 1;
    nextBtn.textContent = isLast ? '开始使用' : '下一步';
    skipBtn.style.display = isLast ? 'none' : 'inline-flex';
}

function nextOnboardingStep() {
    if (onboardingIndex >= ONBOARDING_STEPS.length - 1) {
        finishOnboarding();
        return;
    }
    onboardingIndex++;
    renderOnboardingStep();
}

function finishOnboarding() {
    localStorage.setItem(STORAGE_KEYS.onboarded, '1');
    closeModal('onboardingModal');
}

// ===== 我的页面 =====

function renderMePage() {
    const trips = getTrips();
    const modules = getMyModules();
    const library = getItemLibrary();
    const officialCount = getOfficialModules().length;

    document.getElementById('meStats').innerHTML = [
        { label: '行程', value: trips.length },
        { label: '小包', value: modules.length + officialCount },
        { label: '物品', value: library.length },
    ].map(stat => `
        <div class="me-stat">
            <div class="me-stat-value">${stat.value}</div>
            <div class="me-stat-label">${stat.label}</div>
        </div>
    `).join('');
}

function resetOfficialModules() {
    if (!confirm('确定恢复所有官方小包到初始状态？你自建的小包不会受影响。')) return;
    localStorage.removeItem(STORAGE_KEYS.officialModules);
    ensureItemLibrarySeeded();
    renderModuleLibrary();
    renderMePage();
    toast('已恢复官方小包');
}

function clearAllData() {
    if (!confirm('确定清除所有数据？包括行程、小包和物品库，此操作不可撤销。')) return;
    localStorage.removeItem(STORAGE_KEYS.records);
    localStorage.removeItem(STORAGE_KEYS.itemLibrary);
    localStorage.removeItem(STORAGE_KEYS.officialModules);
    localStorage.removeItem(STORAGE_KEYS.onboarded);
    S.currentTrip = null;
    S.currentTripId = null;
    ensureItemLibrarySeeded();
    nav('home');
    toast('数据已清除');
}

init();
