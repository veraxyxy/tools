import {
    // constants
    DEFAULT_CATEGORIES, DEFAULT_BAGS, CATEGORY_BAG_MAP, MODULE_FILTERS, STORAGE_KEYS, BABY_MODULE_IDS,
    // seeds
    OFFICIAL_MODULES, BASE_LIBRARY_ITEMS,
    // utils
    gid, deepClone, uniqueStrings, guessCat, catInfo, bagName, bagIcon, suggestBagForItem,
    // smartFill
    normalizeSmartConfig, mergeSmartConfig, computeSmartQty, strongerSmartRule,
    smartRuleLabel, smartRuleShort, inferSmartConfig, inferSmartRule, resolveItemSmartPlan,
    mergeTripItems, applyTripSmartFill,
    // models
    normalizeRecord, normalizeTripRecord, normalizeOfficialModule, normalizeModuleRecord,
    normalizeTripItem, normalizeModuleItem, normalizeLibraryItem,
    // store
    readJson, writeJson, getRecords, saveRecords, saveRecord,
    getOfficialModules, saveOfficialModules, getTrips, getMyModules,
    // libraryService
    sortLibraryItems, getItemLibrary, saveItemLibrary, buildSeedItemLibrary,
    ensureItemLibrarySeeded, syncItemsIntoLibrary, createModuleItemFromAsset,
    // tripService
    getModuleEntity, resolveOfficialModuleItems, resolveCustomModuleItems,
    createTripItemFromDef, createTripItemFromModuleItem, createTripItemFromAsset,
    getTripProgress, getTripStatus, formatTripMeta, formatTripSourceSummary, formatItemSource,
    getModuleKey, splitModuleKey, getBabyBaseModule,
    isBabyModuleEntity, isBabyBaseModuleEntity, upsertTripSourceModule, ensureBabyBaseModuleOnTripRecord,
    resyncTripFromSourceModules, isModuleOnTrip, removeModuleFromTrip,
} from './src/data/index.js';

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
    moduleBuilderItems: [],
    moduleItemEditContext: null,
    kitView: 'compact',
    collapsedBags: new Set(),
    tripInfoCollapsed: false,
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
    fillCatSelect('moduleItemCategory');
    fillBagSelect('moduleItemBag', null, DEFAULT_BAGS);
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

    document.getElementById('moduleItemCategory')?.addEventListener('change', () => {
        syncBagWithCategory('moduleItemCategory', 'moduleItemBag', DEFAULT_BAGS);
        updateModuleItemSmartHint();
    });
    document.getElementById('moduleItemQty')?.addEventListener('input', updateModuleItemSmartHint);

    document.getElementById('libraryItemTagsDisplay')?.addEventListener('click', e => {
        const btn = e.target.closest('.item-tag-remove');
        if (!btn) return;
        e.preventDefault();
        removeLibraryItemTagByIndex(parseInt(btn.dataset.tagIndex, 10));
    });
    document.getElementById('tripItemTagsDisplay')?.addEventListener('click', e => {
        const btn = e.target.closest('.item-tag-remove');
        if (!btn) return;
        e.preventDefault();
        removeTripItemTagByIndex(parseInt(btn.dataset.tagIndex, 10));
    });
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

function openTripPage() {
    S.returnPage = null;
    S.currentModuleAction = 'browse';

    if (S.currentTrip) {
        nav('list');
        return;
    }

    const trips = getTrips();
    if (!trips.length) {
        S.currentTripId = null;
        S.currentTrip = null;
        nav('list');
        return;
    }

    const active = trips.find(trip => getTripStatus(trip).key !== 'done') || trips[0];
    openTrip(active.id, 'plan');
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
    const rest = trips.filter(trip => trip.id !== active?.id);
    const recent = rest.filter(t => getTripStatus(t).key !== 'done').slice(0, 3);
    const history = getDoneTrips();

    const isNewUser = !trips.length && !modules.length;
    const heroEl = document.getElementById('homeHero');
    if (heroEl) heroEl.style.display = isNewUser ? 'block' : 'none';

    const statsEl = document.getElementById('homeStats');
    if (statsEl) {
        statsEl.innerHTML = isNewUser ? '' : '<span>' + trips.length + ' 个行程</span><span class="qs-dot">·</span><span>' + (modules.length + getOfficialModules().length) + ' 个小包</span><span class="qs-dot">·</span><span>' + library.length + ' 件物品</span>';
    }

    const content = document.getElementById('homeContent');
    if (!content) return;

    // 新用户：展示 feature highlights
    if (isNewUser) {
        content.innerHTML = renderNewUserGuide();
        return;
    }

    let html = '';

    // 进行中行程（有才显示，没有不占位）
    if (active) {
        html += '<section class="section">' +
            '<div class="section-head">' +
            '<h3 class="section-title">进行中</h3>' +
            '<span class="section-meta">' + getTripStatus(active).label + '</span>' +
            '</div>' +
            renderActiveTrip(active) +
            '</section>';
    } else {
        // 没有进行中行程：用一个轻量的 CTA banner
        html += '<div class="home-cta-banner" onclick="openCreateTripModal()">' +
            '<div class="home-cta-icon">📝</div>' +
            '<div class="home-cta-body">' +
            '<div class="home-cta-title">新建行程</div>' +
            '<div class="home-cta-desc">选几个小包，智能生成打包清单</div>' +
            '</div>' +
            '<div class="home-cta-arrow">›</div>' +
            '</div>';
    }

    // 最近行程
    if (recent.length) {
        html += '<section class="section">' +
            '<div class="section-head">' +
            '<h3 class="section-title">最近</h3>' +
            '</div>' +
            '<div class="trip-list-compact">' + recent.map(renderTripCardCompact).join('') + '</div>' +
            '</section>';
    }

    // 历史行程（已完成的）
    if (history.length) {
        const showing = S.homeHistoryExpanded ? history : history.slice(0, 2);
        html += '<section class="section">' +
            '<div class="section-head">' +
            '<h3 class="section-title">已完成</h3>' +
            '<span class="section-meta section-link" onclick="toggleHomeHistory()">' +
            (S.homeHistoryExpanded ? '收起' : (history.length > 2 ? '查看全部 ' + history.length + ' 条' : '')) +
            '</span>' +
            '</div>' +
            '<div class="trip-list-compact">' + showing.map(renderTripCardCompact).join('') + '</div>' +
            '</section>';
    }

    content.innerHTML = html;
}

function renderNewUserGuide() {
    return '<div class="home-features">' +
        '<div class="feature-card" onclick="openMainPage(\'kits\')">' +
        '<div class="feature-icon">🧰</div>' +
        '<div class="feature-body">' +
        '<div class="feature-title">整理小包</div>' +
        '<div class="feature-desc">把常带物品按用途分组，比如洗漱包、化妆包。系统已预置 9 个官方小包。</div>' +
        '</div>' +
        '<div class="home-cta-arrow">\u203A</div>' +
        '</div>' +
        '<div class="feature-card" onclick="openCreateTripModal()">' +
        '<div class="feature-icon">📝</div>' +
        '<div class="feature-body">' +
        '<div class="feature-title">新建行程</div>' +
        '<div class="feature-desc">勾选需要的小包，系统自动合并物品并按天数、人数建议数量。</div>' +
        '</div>' +
        '<div class="home-cta-arrow">\u203A</div>' +
        '</div>' +
        '<div class="feature-card" onclick="openMainPage(\'items\')">' +
        '<div class="feature-icon">🎒</div>' +
        '<div class="feature-body">' +
        '<div class="feature-title">物品库</div>' +
        '<div class="feature-desc">管理你的物品库，添加个人常用物品，打包时随手挑选。</div>' +
        '</div>' +
        '<div class="home-cta-arrow">\u203A</div>' +
        '</div>' +
        '</div>';
}

function renderHomeEmpty() {
    return '';
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

function renderTripCardCompact(trip) {
    const progress = getTripProgress(trip);
    const status = getTripStatus(trip);
    const openMode = status.key === 'done' ? 'plan' : 'pack';
    return '<div class="trip-card-compact">' +
        '<div class="trip-card-compact-main" onclick="openTrip(\'' + trip.id + '\',\'' + openMode + '\')">' +
        '<div class="trip-compact-icon">' + status.icon + '</div>' +
        '<div class="trip-compact-body">' +
        '<div class="trip-compact-name">' + esc(trip.name) + '</div>' +
        '<div class="trip-compact-meta">' + esc(formatTripMeta(trip)) + '</div>' +
        '</div>' +
        '<div class="trip-compact-progress">' +
        '<div class="progress-ring" style="--pct:' + progress.pct + '">' +
        '<span class="progress-ring-text">' + progress.pct + '%</span>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="trip-compact-actions">' +
        '<button type="button" class="icon-action compact" onclick="duplicateTrip(\'' + trip.id + '\')" title="复制行程" aria-label="复制行程">📋</button>' +
        '<button type="button" class="icon-action compact" onclick="deleteTrip(\'' + trip.id + '\')" title="删除行程" aria-label="删除行程">🗑️</button>' +
        '</div></div>';
}

function renderTripSourceModulesBar(trip) {
    const modules = trip.sourceModules || [];
    if (!modules.length) {
        return '<div class="info-card subtle">还没有关联小包。点「从小包添加」把标准化小包加进来。</div>';
    }
    return '<div class="trip-modules-panel">' +
        '<div class="trip-modules-head">' +
        '<span class="trip-modules-label">已选小包</span>' +
        '<span class="trip-modules-hint">点 × 移除；改小包定义后请重新同步</span>' +
        '</div>' +
        '<div class="trip-module-chips">' +
        modules.map(module =>
            '<span class="trip-module-chip">' + esc(module.name) +
            '<button type="button" class="chip-remove" onclick="removeModuleFromCurrentTrip(\'' + module.source + '\', \'' + module.id + '\')" aria-label="移除 ' + esc(module.name) + '">×</button></span>'
        ).join('') +
        '</div></div>';
}

function renderProgress(progress) {
    return '<div class="saved-list-progress">' +
        '<div class="saved-list-progress-bar"><div class="saved-list-progress-fill" style="width:' + progress.pct + '%"></div></div>' +
        '<span class="saved-list-progress-text">已打包 ' + progress.packed + '/' + progress.total + ' 件</span>' +
        '</div>';
}

function getDoneTrips() {
    return getTrips().filter(trip => getTripStatus(trip).key === 'done');
}

function toggleHomeHistory() {
    if (getDoneTrips().length <= 2) return;
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
        summaryBox.innerHTML = '<div class="empty-panel">' +
            '<div class="empty-icon">📭</div>' +
            '<div class="empty-title">还没有打开的行程</div>' +
            '<div class="empty-hint">从首页进入进行中的行程，或新建一张行程单开始整理。</div>' +
            '<div class="empty-actions">' +
            '<button class="btn-secondary" type="button" onclick="openMainPage(\'home\')">回首页</button>' +
            '<button class="btn-primary" type="button" onclick="openCreateTripModal()">新建行程</button>' +
            '</div></div>';
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

    const collapsed = S.tripInfoCollapsed ? ' collapsed' : '';
    const allTrips = getTrips();
    const tripSwitcher = allTrips.length > 1
        ? '<div class="trip-switch-row">' +
        '<span class="trip-switch-label">切换行程</span>' +
        '<select class="trip-switch-select" aria-label="切换行程" onchange="openTrip(this.value, S.tripMode)">' +
        allTrips.map(entry => '<option value="' + entry.id + '"' + (entry.id === trip.id ? ' selected' : '') + '>' + esc(entry.name) + '</option>').join('') +
        '</select></div>'
        : '';
    summaryBox.innerHTML = '<div class="list-summary-card">' +
        '<div class="list-summary-top">' +
        '<div>' +
        '<div class="list-summary-title-row"><div class="list-summary-title">' + esc(trip.name) + '</div><span class="status-chip ' + status.key + '">' + status.label + '</span></div>' +
        tripSwitcher +
        '<div class="list-summary-meta">' + esc(formatTripSourceSummary(trip)) + ' · ' + esc(formatTripMeta(trip)) + '</div>' +
        '</div>' +
        '<button class="pill-button" onclick="saveCurrentTripAsModule()">存为小包</button>' +
        '</div>' +
        renderProgress(progress) +
        '<div class="trip-info-toggle" onclick="toggleTripInfoCard()">' +
        '<span class="trip-info-toggle-text">行程设置</span>' +
        '<span class="trip-info-toggle-arrow' + collapsed + '">▼</span>' +
        '</div>' +
        '<div class="trip-info-body' + collapsed + '">' +
        '<div class="trip-info-row">' +
        '<div class="trip-info-row-label">天数</div>' +
        '<div class="stepper">' +
        '<button class="stepper-btn" onclick="changeCurrentTripSetting(\'days\', -1)">−</button>' +
        '<input type="number" min="1" max="90" value="' + trip.days + '" aria-label="行程天数" onchange="updateCurrentTripSetting(\'days\', this.value)">' +
        '<button class="stepper-btn" onclick="changeCurrentTripSetting(\'days\', 1)">+</button>' +
        '</div>' +
        '</div>' +
        '<div class="trip-info-row">' +
        '<div class="trip-info-row-label">人数</div>' +
        '<div class="stepper">' +
        '<button class="stepper-btn" onclick="changeCurrentTripSetting(\'people\', -1)">−</button>' +
        '<input type="number" min="1" max="20" value="' + trip.people + '" aria-label="出行人数" onchange="updateCurrentTripSetting(\'people\', this.value)">' +
        '<button class="stepper-btn" onclick="changeCurrentTripSetting(\'people\', 1)">+</button>' +
        '</div>' +
        '</div>' +
        '<div class="trip-info-actions">' +
        ((trip.sourceModules || []).length
            ? '<button type="button" class="btn-recompute" onclick="resyncCurrentTripFromModules()">按小包重新同步</button>'
            : '') +
        '<button type="button" class="btn-recompute' + ((trip.sourceModules || []).length ? ' outline' : '') + '" onclick="reapplyTripSmartFill()">重新智能填充</button>' +
        '</div>' +
        '</div>' +
        '<div class="trip-smart-note">' + ((trip.sourceModules || []).length
            ? '改过小包定义后，可点「按小包重新同步」更新本行程；手调数量与打包勾选会尽量保留。'
            : '已按当前设置建议 ' + smartCount + ' 项可变数量物品；你手动改过的数量会优先保留。') + '</div>' +
        '</div>';

    switchBox.innerHTML = '<button class="mode-tab ' + (S.tripMode === 'plan' ? 'active' : '') + '" onclick="setTripMode(\'plan\')">规划模式</button>' +
        '<button class="mode-tab ' + (S.tripMode === 'pack' ? 'active' : '') + '" onclick="setTripMode(\'pack\')">打包模式</button>';

    if (S.tripMode === 'plan') {
        actionBar.innerHTML = [
            '<button class="btn-secondary" onclick="goSelectModuleForTrip()">从小包添加</button>',
            '<button class="btn-secondary" onclick="goSelectItemsForTrip()">从物品库添加</button>',
            '<button class="btn-primary" onclick="openManualItemModal()">手动添加物品</button>',
        ].join('');
        subBar.innerHTML = renderTripSourceModulesBar(trip);
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

    return groups.map(group => {
        const packed = group.items.filter(item => item.packed).length;
        const collapsed = S.collapsedBags.has(group.bag.id) ? ' collapsed' : '';
        return '<div class="bag-group' + collapsed + '" id="bag-' + group.bag.id + '">' +
            '<div class="bag-group-header">' +
            '<div class="bag-group-label">' +
            '<span class="bag-icon">' + group.bag.icon + '</span>' +
            '<span class="bag-name">' + esc(group.bag.name) + '</span>' +
            '</div>' +
            '<div style="display:flex;align-items:center;gap:8px">' +
            '<span class="bag-toggle" onclick="toggleBagCollapse(\'' + group.bag.id + '\')">▼</span>' +
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

function toggleTripInfoCard() {
    S.tripInfoCollapsed = !S.tripInfoCollapsed;
    const summaryBox = document.getElementById('listSummary');
    if (!summaryBox) return;
    const toggle = summaryBox.querySelector('.trip-info-toggle-arrow');
    const body = summaryBox.querySelector('.trip-info-body');
    if (toggle) toggle.classList.toggle('collapsed', S.tripInfoCollapsed);
    if (body) body.classList.toggle('collapsed', S.tripInfoCollapsed);
}

function renderPackItemCard(item) {
    const cat = catInfo(item.category);
    const tags = (item.tags || []).map(tag => '<span class="item-pill" style="background:var(--secondary-soft);color:#1d7fbf">' + esc(tag) + '</span>').join('');
    const sourceModules = item.sourceModules || [];
    const sourcePill = sourceModules.length > 0
        ? '<span class="item-pill source-module-pill" title="' + sourceModules.map(esc).join(', ') + '">' + esc(sourceModules.length > 1 ? sourceModules[0] + '等' : sourceModules[0]) + '</span>'
        : '';
    return '<div class="list-item-card' + (item.packed ? ' packed' : '') + '" onclick="togglePackItem(\'' + item.id + '\')">' +
        '<button class="check-button ' + (item.packed ? 'checked' : '') + '">✓</button>' +
        '<div class="list-item-main">' +
        '<div class="list-item-name">' + esc(item.name) + '</div>' +
        '<div class="item-subline">' +
        '<span class="item-pill ' + cat.cssClass + '">' + esc(cat.name) + '</span>' +
        (sourcePill ? sourcePill : '<span class="item-pill">' + esc(bagName(item.bag, S.currentTrip.bags)) + '</span>') +
        (tags ? tags : '') +
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
    S.tripInfoCollapsed = false;
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
    refreshTripSettingViews();
    renderHome();
}

function reapplyTripSmartFill() {
    if (!S.currentTrip) return;
    applyTripSmartFill(S.currentTrip, true);
    persistCurrentTrip();
    refreshTripSettingViews();
    renderHome();
    toast('已重新按天数和人数智能填充');
}

function resyncCurrentTripFromModules() {
    if (!S.currentTrip) return;
    if (!(S.currentTrip.sourceModules || []).length) {
        toast('当前行程没有关联小包，无法同步');
        return;
    }
    if (!confirm('将按小包最新定义重新生成本行程中的小包物品。\n\n· 手动添加的物品会保留\n· 已打包勾选、备注和标签会保留\n· 你手动改过的数量会保留\n\n继续？')) {
        return;
    }

    const result = resyncTripFromSourceModules(S.currentTrip);
    persistCurrentTrip();
    refreshTripSettingViews();
    renderHome();

    if (!result.changed) {
        toast('已与小包定义一致，无需变更');
        return;
    }

    const parts = [];
    if (result.added) parts.push(`新增 ${result.added} 件`);
    if (result.removed) parts.push(`移除 ${result.removed} 件`);
    if (result.updated) parts.push(`更新 ${result.updated} 件`);
    if (result.mergedDuplicates) parts.push(`合并同名 ${result.mergedDuplicates} 件`);
    toast(parts.length ? `已从小包同步（${result.moduleCount} 个小包）：${parts.join('，')}` : '已按小包重新同步');
}

function removeModuleFromCurrentTrip(source, id) {
    if (!S.currentTrip) return;
    const entity = getModuleEntity(source, id);
    if (!entity) return;
    if (!confirm(`确定从当前行程移除「${entity.name}」？\n\n仅来自这个小包的物品会被移除；若物品同时来自多个小包，会保留并去掉该来源。`)) {
        return;
    }

    const result = removeModuleFromTrip(S.currentTrip, source, id);
    if (!result.changed) return;

    applyTripSmartFill(S.currentTrip, false);
    persistCurrentTrip();
    renderTripPage();
    renderHome();
    toast(result.removedItems
        ? `已移除「${result.moduleName}」，并删掉 ${result.removedItems} 件仅属于它的物品`
        : `已移除「${result.moduleName}」`);
}

function refreshTripListContent() {
    const content = document.getElementById('listContent');
    if (!content || !S.currentTrip) return;
    const trip = S.currentTrip;
    if (S.tripMode === 'plan') {
        content.innerHTML = trip.items.length ? trip.items.map(renderTripPlanItemCard).join('') : renderTripEmpty();
    } else {
        content.innerHTML = renderPackContent(trip);
    }
}

function patchTripSummaryMetrics() {
    if (!S.currentTrip) return;
    const summaryBox = document.getElementById('listSummary');
    if (!summaryBox) return;

    const trip = S.currentTrip;
    const progress = getTripProgress(trip);
    const status = getTripStatus(trip);
    const smartCount = trip.items.filter(item => item.smartRule !== 'fixed').length;

    const progressEl = summaryBox.querySelector('.saved-list-progress');
    if (progressEl) progressEl.outerHTML = renderProgress(progress);

    const statusChip = summaryBox.querySelector('.status-chip');
    if (statusChip) {
        statusChip.className = 'status-chip ' + status.key;
        statusChip.textContent = status.label;
    }

    const metaEl = summaryBox.querySelector('.list-summary-meta');
    if (metaEl) metaEl.textContent = formatTripSourceSummary(trip) + ' · ' + formatTripMeta(trip);

    const smartNote = summaryBox.querySelector('.trip-smart-note');
    if (smartNote) {
        smartNote.textContent = '已按当前设置建议 ' + smartCount + ' 项可变数量物品；你手动改过的数量会优先保留。';
    }

    const rows = summaryBox.querySelectorAll('.trip-info-row');
    const daysInput = rows[0]?.querySelector('input');
    const peopleInput = rows[1]?.querySelector('input');
    if (daysInput && document.activeElement !== daysInput) daysInput.value = trip.days;
    if (peopleInput && document.activeElement !== peopleInput) peopleInput.value = trip.people;
}

function refreshTripSettingViews() {
    if (S.currentPage !== 'list' || !S.currentTrip) {
        renderTripPage();
        return;
    }
    patchTripSummaryMetrics();
    refreshTripListContent();
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
    renderModuleDetailModal(source, id);
    showModal('moduleDetailModal');
}

function renderModuleDetailModal(source, id) {
    const entity = getModuleEntity(source, id);
    if (!entity) return;

    const days = getPreviewDays();
    const people = getPreviewPeople();
    const moduleItems = (entity.items || []).map(normalizeModuleItem);
    const previewContext = {
        days,
        people,
        sourceModules: [{ source, id: entity.id, name: entity.name }],
    };
    const smartCount = moduleItems.filter(item => item.smartRule !== 'fixed').length;

    document.getElementById('moduleDetailTitle').textContent = entity.name;
    document.getElementById('moduleDetailIcon').textContent = entity.icon || '🧰';
    document.getElementById('moduleDetailSubtitle').textContent = source === 'official'
        ? '官方小包 · 点击物品可改默认设置'
        : '我的小包 · 点击物品可改默认设置';
    document.getElementById('moduleDetailDesc').textContent = entity.desc || '可复用的小包模块。';
    document.getElementById('moduleDetailTags').innerHTML = (entity.tags || []).map(tag => '<span class="tag">' + esc(tag) + '</span>').join('') || '<span class="tag">标准化小包</span>';
    document.getElementById('moduleDetailSummary').textContent = `按当前 ${days} 天 / ${people} 人预览，共 ${moduleItems.length} 件物品，其中 ${smartCount} 项会随天数或人数变化。修改会保存到小包里，之后新建行程都会生效。`;
    document.getElementById('moduleDetailItems').innerHTML = moduleItems.length
        ? moduleItems.map(item => renderModuleDetailItemCard(item, source, id, previewContext, S.currentTrip?.bags || DEFAULT_BAGS)).join('')
        : '<div class="empty-panel"><div class="empty-hint">这个小包还没有物品，点下方「编辑小包」去添加。</div></div>';
    document.getElementById('moduleEditBtn').style.display = 'inline-flex';
    document.getElementById('moduleEditBtn').textContent = source === 'official' ? '编辑官方小包' : '编辑小包';
    const alreadyOnTrip = S.currentModuleAction === 'add' && S.currentTrip && isModuleOnTrip(S.currentTrip, source, id);
    const primaryBtn = document.getElementById('modulePrimaryBtn');
    primaryBtn.textContent = alreadyOnTrip
        ? '已在当前行程'
        : (S.currentModuleAction === 'add' && S.currentTrip ? '加入当前行程' : '用于新行程');
    primaryBtn.disabled = alreadyOnTrip;
    primaryBtn.classList.toggle('disabled', alreadyOnTrip);
}

function renderModuleDetailItemCard(item, source, moduleId, previewContext, bags) {
    const cat = catInfo(item.category);
    const previewQty = computeSmartQty(
        item.defaultQty,
        item.smartRule,
        previewContext.days,
        previewContext.people,
        item.smartConfig,
        previewContext
    );
    const smart = item.smartRule !== 'fixed'
        ? '<span class="item-pill smart-pill">' + esc(smartRuleShort(item.smartRule)) + '</span>'
        : '';
    return '<div class="list-item-card editable" onclick="openModuleItemModal(\'module\', \'' + source + '\', \'' + moduleId + '\', \'' + item.id + '\')">' +
        '<div class="list-item-main">' +
        '<div class="list-item-name">' + esc(item.name) + '</div>' +
        '<div class="item-subline">' +
        '<span class="item-pill ' + cat.cssClass + '">' + esc(cat.name) + '</span>' +
        '<span class="item-pill">' + esc(bagName(item.bag, bags)) + '</span>' +
        smart +
        '<span class="item-pill subtle-pill">默认 ×' + item.defaultQty + '</span>' +
        '</div>' +
        '</div>' +
        '<div class="item-qty">预览 ×' + previewQty + '</div>' +
        '</div>';
}

function tripOrModuleItemToModuleItem(item) {
    return normalizeModuleItem({
        id: String(item.id || '').startsWith('module-item-') ? item.id : ('module-item-' + gid()),
        name: item.name,
        category: item.category,
        bag: item.bag,
        defaultQty: item.defaultQty || item.smartBaseQty || item.qty || 1,
        smartRule: item.smartRule,
        smartConfig: item.smartConfig,
    });
}

function syncModuleBuilderSelectionFromItems() {
    const library = getItemLibrary();
    S.moduleBuilderSelection = new Set(
        S.moduleBuilderItems
            .map(item => library.find(asset => asset.name === item.name)?.id)
            .filter(Boolean)
    );
}

function upsertLibraryFromModuleItem(moduleItem) {
    const library = getItemLibrary();
    const idx = library.findIndex(entry => entry.name === moduleItem.name);
    const next = normalizeLibraryItem({
        ...(idx >= 0 ? library[idx] : {}),
        id: idx >= 0 ? library[idx].id : ('asset-' + gid()),
        name: moduleItem.name,
        category: moduleItem.category,
        defaultQty: moduleItem.defaultQty,
        bag: moduleItem.bag,
        smartRule: moduleItem.smartRule,
        smartConfig: moduleItem.smartConfig,
        source: idx >= 0 ? library[idx].source : 'user',
    });
    if (idx >= 0) library[idx] = next;
    else library.unshift(next);
    saveItemLibrary(library);
}

function saveModuleEntityItems(source, moduleId, items) {
    if (source === 'official') {
        const modules = getOfficialModules();
        const idx = modules.findIndex(module => module.id === moduleId);
        if (idx < 0) return null;
        modules[idx] = normalizeOfficialModule({
            ...modules[idx],
            items: items.map(normalizeModuleItem),
        });
        saveOfficialModules(modules);
        return modules[idx];
    }

    const module = getMyModules().find(entry => entry.id === moduleId);
    if (!module) return null;
    const next = normalizeModuleRecord({
        ...module,
        items: items.map(normalizeModuleItem),
        updatedAt: new Date().toISOString(),
    });
    saveRecord(next);
    return next;
}

function findModuleItemContext(itemId) {
    const ctx = S.moduleItemEditContext;
    if (!ctx) return null;

    if (ctx.mode === 'builder') {
        const item = S.moduleBuilderItems.find(entry => entry.id === itemId);
        return item ? { item, items: S.moduleBuilderItems } : null;
    }

    const entity = getModuleEntity(ctx.source, ctx.moduleId);
    if (!entity) return null;
    const item = (entity.items || []).find(entry => entry.id === itemId);
    return item ? { item, entity } : null;
}

function openModuleItemModal(mode, source, moduleId, itemId) {
    const ctx = { mode, source: source || null, moduleId: moduleId || null, itemId };
    S.moduleItemEditContext = ctx;

    let item = null;
    if (mode === 'builder') {
        item = S.moduleBuilderItems.find(entry => entry.id === itemId);
    } else {
        const entity = getModuleEntity(source, moduleId);
        item = entity?.items?.find(entry => entry.id === itemId);
    }
    if (!item) return;

    item = normalizeModuleItem(item);
    document.getElementById('moduleItemModalTitle').textContent = item.name;
    document.getElementById('moduleItemQty').value = item.defaultQty;
    fillCatSelect('moduleItemCategory', item.category);
    fillBagSelect('moduleItemBag', item.bag, DEFAULT_BAGS);
    document.getElementById('moduleItemDeleteBtn').style.display = 'inline-flex';
    updateModuleItemSmartHint();
    showModal('moduleItemModal');
}

function updateModuleItemSmartHint() {
    const hint = document.getElementById('moduleItemSmartHint');
    const ctx = S.moduleItemEditContext;
    if (!hint || !ctx) return;

    const found = findModuleItemContext(ctx.itemId);
    if (!found?.item) return;

    const category = document.getElementById('moduleItemCategory')?.value || found.item.category;
    const qty = Math.max(1, parseInt(document.getElementById('moduleItemQty')?.value) || 1);
    const { smartRule, smartConfig } = resolveItemSmartPlan(found.item.name, category, found.item.smartRule, found.item.smartConfig);
    const previewContext = ctx.mode === 'module' && ctx.moduleId
        ? { sourceModules: [{ source: ctx.source, id: ctx.moduleId, name: getModuleEntity(ctx.source, ctx.moduleId)?.name || '' }] }
        : null;
    const previewQty = smartRule === 'fixed'
        ? qty
        : computeSmartQty(qty, smartRule, getPreviewDays(), getPreviewPeople(), smartConfig, previewContext);

    hint.textContent = smartRule === 'fixed'
        ? `默认固定数量 ×${qty}。保存后，之后用这个包创建行程都会按此默认量生成。`
        : `默认基础量 ×${qty}，按「${smartRuleLabel(smartRule, smartConfig)}」智能建议；当前预览约 ×${previewQty}。保存后新建行程都会沿用这里的默认设置。`;
}

function saveModuleItemEdit() {
    const ctx = S.moduleItemEditContext;
    if (!ctx) return;

    const found = findModuleItemContext(ctx.itemId);
    if (!found?.item) return;

    const nextItem = normalizeModuleItem({
        ...found.item,
        defaultQty: Math.max(1, parseInt(document.getElementById('moduleItemQty').value) || 1),
        category: document.getElementById('moduleItemCategory').value,
        bag: document.getElementById('moduleItemBag').value,
    });
    const { smartRule, smartConfig } = resolveItemSmartPlan(nextItem.name, nextItem.category, found.item.smartRule, found.item.smartConfig);
    nextItem.smartRule = smartRule;
    nextItem.smartConfig = smartConfig;

    if (ctx.mode === 'builder') {
        const idx = S.moduleBuilderItems.findIndex(entry => entry.id === ctx.itemId);
        if (idx >= 0) S.moduleBuilderItems[idx] = nextItem;
        upsertLibraryFromModuleItem(nextItem);
        syncModuleBuilderSelectionFromItems();
        closeModal('moduleItemModal');
        renderModuleBuilderSelectedItems();
        renderModuleBuilderItems();
        renderItemLibrary();
        toast('小包物品已更新');
        return;
    }

    const entity = found.entity;
    const items = (entity.items || []).map(item => item.id === ctx.itemId ? nextItem : normalizeModuleItem(item));
    saveModuleEntityItems(ctx.source, ctx.moduleId, items);
    upsertLibraryFromModuleItem(nextItem);
    closeModal('moduleItemModal');
    if (S.currentModule?.source === ctx.source && S.currentModule?.id === ctx.moduleId) {
        renderModuleDetailModal(ctx.source, ctx.moduleId);
    }
    renderModuleLibrary();
    toast('已保存到小包里，之后新建行程都会按此默认设置生成');
}

function deleteModuleItemEdit() {
    const ctx = S.moduleItemEditContext;
    if (!ctx) return;

    if (ctx.mode === 'builder') {
        const target = S.moduleBuilderItems.find(entry => entry.id === ctx.itemId);
        S.moduleBuilderItems = S.moduleBuilderItems.filter(entry => entry.id !== ctx.itemId);
        if (target) {
            const library = getItemLibrary();
            const assetId = library.find(asset => asset.name === target.name)?.id;
            if (assetId) S.moduleBuilderSelection.delete(assetId);
        }
        closeModal('moduleItemModal');
        renderModuleBuilderSelectedItems();
        renderModuleBuilderItems();
        toast('已从小包中移除');
        return;
    }

    const entity = getModuleEntity(ctx.source, ctx.moduleId);
    if (!entity) return;
    const items = (entity.items || []).filter(item => item.id !== ctx.itemId);
    saveModuleEntityItems(ctx.source, ctx.moduleId, items);
    closeModal('moduleItemModal');
    if (S.currentModule?.source === ctx.source && S.currentModule?.id === ctx.moduleId) {
        renderModuleDetailModal(ctx.source, ctx.moduleId);
    }
    renderModuleLibrary();
    toast('已从小包中移除');
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
    if (isModuleOnTrip(S.currentTrip, source, id)) {
        toast('这个小包已在当前行程中');
        return;
    }
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
    el.innerHTML = S.currentEditingTags.map((tag, index) =>
        '<span class="item-tag-pill">' + esc(tag) +
        '<button type="button" class="item-tag-remove" data-tag-index="' + index + '" aria-label="移除标签 ' + esc(tag) + '">✕</button></span>'
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

function removeLibraryItemTagByIndex(index) {
    if (!Number.isFinite(index) || index < 0 || index >= S.currentEditingTags.length) return;
    S.currentEditingTags = S.currentEditingTags.filter((_, i) => i !== index);
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
    el.innerHTML = S.currentEditingTags.map((tag, index) =>
        '<span class="item-tag-pill">' + esc(tag) +
        '<button type="button" class="item-tag-remove" data-tag-index="' + index + '" aria-label="移除标签 ' + esc(tag) + '">✕</button></span>'
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

function removeTripItemTagByIndex(index) {
    if (!Number.isFinite(index) || index < 0 || index >= S.currentEditingTags.length) return;
    S.currentEditingTags = S.currentEditingTags.filter((_, i) => i !== index);
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
    const suggested = computeSmartQty(
        item.smartBaseQty || 1,
        item.smartRule,
        S.currentTrip.days,
        S.currentTrip.people,
        item.smartConfig,
        S.currentTrip
    );
    meta.style.display = 'block';
    meta.textContent = qty === suggested
        ? `智能填充：${smartRuleLabel(item.smartRule, item.smartConfig)}。当前建议数量 ×${suggested}。`
        : `智能填充：${smartRuleLabel(item.smartRule, item.smartConfig)}。当前建议 ×${suggested}；你现在填写的是 ×${qty}，保存后会优先按你的手动数量保留。`;
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
        const suggested = computeSmartQty(
            item.smartBaseQty || 1,
            item.smartRule,
            S.currentTrip.days,
            S.currentTrip.people,
            item.smartConfig,
            S.currentTrip
        );
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
    S.moduleBuilderDraftId = editModule?.id || null;
    S.moduleBuilderDraftSource = editModule ? editSource : 'custom';
    S.moduleBuilderItems = (baseItems || []).map(item => tripOrModuleItemToModuleItem(item));
    syncModuleBuilderSelectionFromItems();
    S.moduleBuilderSearch = '';

    document.getElementById('moduleBuilderModalTitle').textContent = editModule
        ? (editSource === 'official' ? '编辑官方小包' : '编辑我的小包')
        : '新建我的小包';
    document.getElementById('moduleBuilderSaveBtn').textContent = editModule ? '保存小包修改' : '保存到我的小包';
    document.getElementById('moduleBuilderDeleteBtn').style.visibility = editModule ? 'visible' : 'hidden';
    document.getElementById('moduleBuilderHint').textContent = editModule
        ? '上方「小包内物品」可点击逐项调整；下方物品库可继续滑选补货。保存后，之后新建行程都会按这里的默认设置生成。'
        : '从物品库滑选加入小包；加入后可在上方「小包内物品」点击调整默认数量。保存后新建行程都会沿用这些设置。';

    document.getElementById('moduleBuilderName').value = editModule?.name || '';
    document.getElementById('moduleBuilderIcon').value = editModule?.icon || '🧰';
    document.getElementById('moduleBuilderDesc').value = editModule?.desc || '';
    document.getElementById('moduleBuilderSearch').value = '';
    document.getElementById('moduleQuickItemName').value = '';
    document.getElementById('moduleQuickItemQty').value = 1;
    document.getElementById('moduleQuickItemCategory').value = 'misc';
    renderModuleBuilderSelectedItems();
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
    S.moduleBuilderItems = [];
    renderModuleBuilderSelectedItems();
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
    if (!S.moduleBuilderItems.some(item => item.name === target.name)) {
        S.moduleBuilderItems.push(createModuleItemFromAsset(target));
    }
    document.getElementById('moduleQuickItemName').value = '';
    document.getElementById('moduleQuickItemQty').value = 1;
    document.getElementById('moduleQuickItemCategory').value = 'misc';
    renderModuleBuilderSelectedItems();
    renderModuleBuilderItems();
    renderItemLibrary();
    toast('新物品已加入物品库，并选入当前小包');
}

function renderModuleBuilderSelectedItems() {
    const box = document.getElementById('moduleBuilderSelectedItems');
    const section = document.getElementById('moduleBuilderSelectedSection');
    const meta = document.getElementById('moduleBuilderSelectedMeta');
    if (!box || !section) return;

    const items = S.moduleBuilderItems || [];
    section.style.display = items.length ? 'block' : 'none';
    if (meta) meta.textContent = items.length ? `共 ${items.length} 件 · 点击可改默认数量、分类和归属小包` : '点击物品可改默认数量、分类和归属小包';

    box.innerHTML = items.length
        ? items.map(item => {
            const cat = catInfo(item.category);
            const smart = item.smartRule !== 'fixed'
                ? '<span class="item-pill smart-pill">' + esc(smartRuleShort(item.smartRule)) + '</span>'
                : '';
            return '<div class="list-item-card editable compact" onclick="openModuleItemModal(\'builder\', null, null, \'' + item.id + '\')">' +
                '<div class="list-item-main">' +
                '<div class="list-item-name">' + esc(item.name) + '</div>' +
                '<div class="item-subline">' +
                '<span class="item-pill ' + cat.cssClass + '">' + esc(cat.name) + '</span>' +
                '<span class="item-pill">' + esc(bagName(item.bag, DEFAULT_BAGS)) + '</span>' +
                smart +
                '</div></div>' +
                '<div class="item-qty">×' + item.defaultQty + '</div></div>';
        }).join('')
        : '';
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
    const count = S.moduleBuilderItems?.length || 0;
    if (meta) meta.textContent = `已选 ${count} 件`;
    if (clearBtn) clearBtn.textContent = count ? `清空（${count}）` : '清空选择';
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
    const library = getItemLibrary();
    const asset = library.find(entry => entry.id === itemId);
    if (!asset) return;

    if (selected) {
        S.moduleBuilderSelection.add(itemId);
        if (!S.moduleBuilderItems.some(item => item.name === asset.name)) {
            S.moduleBuilderItems.push(createModuleItemFromAsset(asset));
        }
    } else {
        S.moduleBuilderSelection.delete(itemId);
        S.moduleBuilderItems = S.moduleBuilderItems.filter(item => item.name !== asset.name);
    }

    const tile = document.querySelector('.picker-item[data-item-id="' + itemId + '"]');
    if (tile) {
        tile.classList.toggle('selected', selected);
        const state = tile.querySelector('.picker-tile-state');
        if (state) state.textContent = selected ? '已选' : '滑选';
    }
    renderModuleBuilderSelectedItems();
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

    const items = (S.moduleBuilderItems || []).map(normalizeModuleItem);
    if (!items.length) {
        toast('请至少选择一个物品');
        return;
    }

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
        items.forEach(upsertLibraryFromModuleItem);
        saveOfficialModules(officialModules);
        closeModal('createModuleModal');
        renderModuleLibrary();
        renderHome();
        toast('官方小包已更新，之后新建行程都会按新设置生成');
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

    items.forEach(upsertLibraryFromModuleItem);
    saveRecord(module);
    closeModal('createModuleModal');
    renderModuleLibrary();
    renderHome();
    toast(existing ? '小包已更新，之后新建行程都会按新设置生成' : '已保存到我的小包');
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

function deleteTrip(id) {
    const target = getTrips().find(trip => trip.id === id);
    if (!target) return;
    if (!confirm(`确定删除行程「${target.name}」吗？此操作不可撤销。`)) return;
    deleteRecord(id);
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

// Expose functions to global scope for HTML onclick/oninput handlers
Object.assign(window, {
    // nav & pages
    openMainPage, openTripPage, goBack, nav,
    // trip builder
    openCreateTripModal, confirmCreateTrip, stepValue,
    toggleTripBuilderModule, changeCurrentTripSetting,
    // trip page
    openTrip, setTripMode, toggleTripMode, setPackView,
    togglePackItem, toggleBagCollapse, toggleTripInfoCard, markAllPacked, markAllUnpacked,
    reapplyTripSmartFill, resyncCurrentTripFromModules, removeModuleFromCurrentTrip, saveCurrentTripAsModule,
    goSelectModuleForTrip, goSelectItemsForTrip,
    // module
    openCreateModuleModal, saveCustomModule, deleteCurrentModuleDraft,
    clearModuleBuilderSelection, addBuilderCustomItem,
    useCurrentModule, openEditCurrentModule, openModuleDetail,
    openModuleItemModal, saveModuleItemEdit, deleteModuleItemEdit,
    setModuleFilter, updateModuleSearch, updateModuleBuilderSearch,
    // library
    saveLibraryItem, deleteLibraryItem, openLibraryItemModal,
    addLibraryItemTag,
    setItemFilter, updateItemSearch,
    // manual item
    openManualItemModal, saveManualTripItem,
    // trip item edit
    openTripItemModal, saveCurrentTripItem, deleteCurrentTripItem,
    addTripItemTag,
    // modals
    showModal, closeModal,
    // onboarding
    startOnboarding, nextOnboardingStep, finishOnboarding,
    // me page
    resetOfficialModules, clearAllData,
    // home extras
    toggleHomeHistory, duplicateTrip, deleteTrip,
    // kit view
    setKitView,
});

init();
