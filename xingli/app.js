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
    getOfficialModules, saveOfficialModules, markOfficialModuleDeleted, getTrips, getMyModules,
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
    currentPage: 'list',
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
    tripActionsTargetId: null,
    kitView: 'compact',
    collapsedBags: new Set(),
    tripInfoCollapsed: true,
    moduleAddPanelOpen: false,
    currentEditingTags: [],
};
let modalReturnFocus = null;

function init() {
    ensureItemLibrarySeeded();
    applyRuntimeCapabilityClasses();
    bindDeclarativeActions();
    setupModalOverlays();
    fillCatSelect('libraryItemCategory');
    fillBagSelect('libraryItemBag', null, DEFAULT_BAGS);
    fillCatSelect('manualItemCategory');
    fillCatSelect('tripItemCategory');
    fillCatSelect('moduleItemCategory');
    fillBagSelect('moduleItemBag', null, DEFAULT_BAGS);
    bindFormEvents();
    openTripPage();
    if (!safeStorageGet(STORAGE_KEYS.onboarded)) {
        setTimeout(startOnboarding, 400);
    }
}

function safeStorageGet(key) {
    try {
        return localStorage.getItem(key);
    } catch (error) {
        return null;
    }
}

function safeStorageSet(key, value) {
    try {
        localStorage.setItem(key, value);
        return true;
    } catch (error) {
        return false;
    }
}

function safeStorageRemove(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        return false;
    }
}

function applyRuntimeCapabilityClasses() {
    const flex = document.createElement('div');
    flex.style.position = 'absolute';
    flex.style.visibility = 'hidden';
    flex.style.display = 'flex';
    flex.style.flexDirection = 'column';
    flex.style.rowGap = '1px';
    flex.appendChild(document.createElement('div'));
    flex.appendChild(document.createElement('div'));
    document.body.appendChild(flex);
    const supportsFlexGap = flex.scrollHeight === 1;
    flex.parentNode.removeChild(flex);
    document.documentElement.classList.add(supportsFlexGap ? 'supports-flex-gap' : 'no-flex-gap');
}

const ACTION_EVENT_ATTRIBUTES = {
    click: 'actionClick',
    input: 'actionInput',
    change: 'actionChange',
};

function bindDeclarativeActions() {
    Object.keys(ACTION_EVENT_ATTRIBUTES).forEach(eventName => {
        document.addEventListener(eventName, event => {
            const actionElement = event.target.closest('[data-action-' + eventName + ']');
            if (!actionElement) return;
            const expression = actionElement.dataset[ACTION_EVENT_ATTRIBUTES[eventName]];
            runDeclarativeAction(expression, actionElement, event);
        });
    });
}

function runDeclarativeAction(expression, element, event) {
    let source = String(expression || '').trim();
    if (!source) return;

    const selfTargetPrefix = 'if(event.target===this)';
    if (source.indexOf(selfTargetPrefix) === 0) {
        if (event.target !== element) return;
        source = source.slice(selfTargetPrefix.length);
    }

    source.split(';').map(statement => statement.trim()).filter(Boolean).forEach(statement => {
        if (statement === 'event.stopPropagation()') {
            event.stopPropagation();
            return;
        }
        const call = statement.match(/^([A-Za-z_$][\w$]*)\((.*)\)$/);
        if (!call) return;
        const action = window[call[1]];
        if (typeof action !== 'function') return;
        action.apply(element, parseDeclarativeArguments(call[2], element, event));
    });
}

function parseDeclarativeArguments(source, element, event) {
    if (!source.trim()) return [];
    const tokens = [];
    let token = '';
    let quote = '';
    for (let index = 0; index < source.length; index += 1) {
        const char = source[index];
        if (quote) {
            token += char;
            if (char === quote && source[index - 1] !== '\\') quote = '';
        } else if (char === '\'' || char === '"') {
            quote = char;
            token += char;
        } else if (char === ',') {
            tokens.push(token.trim());
            token = '';
        } else {
            token += char;
        }
    }
    tokens.push(token.trim());
    return tokens.map(value => parseDeclarativeValue(value, element, event));
}

function parseDeclarativeValue(value, element, event) {
    if (value === 'this.value') return element.value;
    if (value === 'S.tripMode') return S.tripMode;
    if (value === 'event') return event;
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (value === 'null') return null;
    if (/^-?\d+(?:\.\d+)?$/.test(value)) return Number(value);
    if ((value[0] === '\'' && value[value.length - 1] === '\'') ||
        (value[0] === '"' && value[value.length - 1] === '"')) {
        return value.slice(1, -1).replace(/\\(['"\\])/g, '$1');
    }
    return value;
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

    document.getElementById('moduleItemQty')?.addEventListener('input', updateModuleItemSmartHint);

    document.getElementById('moduleBuilderItems')?.addEventListener('click', e => {
        const tile = e.target.closest('.picker-item');
        if (!tile?.dataset.itemId) return;
        addModuleBuilderItemByAssetId(tile.dataset.itemId);
    });

    document.getElementById('moduleBuilderSelectedItems')?.addEventListener('click', e => {
        const btn = e.target.closest('[data-remove-module-item]');
        if (!btn) return;
        removeModuleBuilderItem(btn.dataset.removeModuleItem);
    });

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

    document.getElementById('listContent')?.addEventListener('click', e => {
        const card = e.target.closest('[data-trip-item-id]');
        if (!card || S.tripMode !== 'plan') return;
        openTripItemModal(card.dataset.tripItemId);
    });

    document.getElementById('libraryItemTagInput')?.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); addLibraryItemTag(); } });
    document.getElementById('tripItemTagInput')?.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); addTripItemTag(); } });

    document.getElementById('moduleItemCategory')?.addEventListener('change', () => {
        syncBagWithCategory('moduleItemCategory', 'moduleItemBag', DEFAULT_BAGS);
        updateModuleItemSmartHint();
    });
}

function nav(page) {
    if (page === 'itemlibrary') page = 'items';
    S.currentPage = page;
    document.querySelectorAll('.page').forEach(el => el.classList.toggle('active', el.dataset.page === page));
    renderHeader();
    renderBottomNav();

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

function openSubPage(page, returnTo) {
    S.returnPage = returnTo;
    S.currentModuleAction = 'browse';
    nav(page);
}

function openTripPage() {
    S.returnPage = null;
    S.currentModuleAction = 'browse';
    nav('list');
}

function goBack() {
    if (S.currentPage === 'list' && S.currentTrip) {
        S.currentTrip = null;
        S.currentTripId = null;
        renderHeader();
        renderTripPage();
        return;
    }
    if (S.returnPage) {
        const target = S.returnPage;
        S.returnPage = null;
        S.currentModuleAction = 'browse';
        nav(target);
        return;
    }
    nav('list');
}

function refreshTripHub() {
    if (S.currentPage === 'list' && !S.currentTrip) renderTripPage();
}

function renderHeader() {
    const backWrap = document.getElementById('headerBackWrap');
    const title = document.getElementById('headerTitle');
    const eyebrow = document.getElementById('headerEyebrow');
    const right = document.getElementById('headerRight');

    backWrap.style.visibility = ((S.currentPage === 'list' && S.currentTrip) || S.returnPage) ? 'visible' : 'hidden';
    right.innerHTML = '';
    right.className = 'header-right';

    if (S.currentPage === 'kits') {
        title.textContent = '小包';
        eyebrow.textContent = S.currentModuleAction === 'add' ? '加入当前行程' : '可复用的打包模块';
        right.innerHTML = '<button class="btn-icon" data-action-click="openCreateModuleModal()" aria-label="新建小包">＋</button>';
    } else if (S.currentPage === 'items') {
        title.textContent = '物品库';
        eyebrow.textContent = S.currentTrip ? '给当前行程补货' : '常用物品一处管理';
        right.innerHTML = '<button class="btn-icon" data-action-click="openLibraryItemModal()" aria-label="新增物品">＋</button>';
    } else if (S.currentPage === 'list' && !S.currentTrip) {
        title.textContent = '行程';
        eyebrow.textContent = '规划 · 打包 · 出发';
        right.innerHTML = '<button class="btn-icon" data-action-click="openCreateTripModal()" aria-label="新建行程">＋</button>';
    } else if (S.currentPage === 'list') {
        title.textContent = S.currentTrip?.name || '行程';
        eyebrow.textContent = formatTripMeta(S.currentTrip);
        right.className = 'header-right wide';
        right.innerHTML = '<div class="header-mode-switch">' +
            '<button type="button" class="header-mode-tab' + (S.tripMode === 'plan' ? ' active' : '') + '" data-action-click="setTripMode(\'plan\')">规划</button>' +
            '<button type="button" class="header-mode-tab' + (S.tripMode === 'pack' ? ' active' : '') + '" data-action-click="setTripMode(\'pack\')">打包</button>' +
            '</div>';
    } else if (S.currentPage === 'me') {
        title.textContent = '我的';
        eyebrow.textContent = '设置与数据';
        right.innerHTML = '';
    }
}

function renderBottomNav() {
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.nav === S.currentPage);
    });
}

function renderTripHub() {
    const trips = getTrips();
    const summaryBox = document.getElementById('listSummary');
    const switchBox = document.getElementById('listModeSwitch');
    const actionBar = document.getElementById('listActionBar');
    const subBar = document.getElementById('listSubBar');
    const content = document.getElementById('listContent');
    if (!summaryBox || !content) return;

    switchBox.innerHTML = '';
    actionBar.innerHTML = '';
    subBar.innerHTML = '';

    if (!trips.length) {
        summaryBox.innerHTML = '';
        content.innerHTML = '<div class="trip-hub">' +
            '<div class="empty-hero">' +
            '<img class="empty-mascot" src="assets/xingli-dog-mascot.png" alt="" aria-hidden="true">' +
            '<div class="empty-kicker">开始第一次出行</div>' +
            '<div class="empty-title">还没有行程</div>' +
            '<div class="empty-hint">用小包拼出清单，再按天按人智能建议数量。</div>' +
            '</div>' +
            '<div class="empty-steps">' +
            '<div class="empty-step"><span class="empty-step-num">1</span><div><div class="empty-step-title">整理小包</div><div class="empty-step-desc">洗漱、化妆、证件等常带组合</div></div></div>' +
            '<div class="empty-step"><span class="empty-step-num">2</span><div><div class="empty-step-title">新建行程</div><div class="empty-step-desc">勾选这次要带的小包</div></div></div>' +
            '<div class="empty-step"><span class="empty-step-num">3</span><div><div class="empty-step-title">打包勾选</div><div class="empty-step-desc">对照实物逐项打勾</div></div></div>' +
            '</div>' +
            '<div class="empty-actions stacked">' +
            '<button class="btn-primary wide" type="button" data-action-click="openCreateTripModal()">新建行程</button>' +
            '<button class="btn-secondary wide" type="button" data-action-click="openMainPage(\'kits\')">先看小包</button>' +
            '</div></div>';
        return;
    }

    const active = trips.filter(trip => getTripStatus(trip).key !== 'done');
    const done = trips.filter(trip => getTripStatus(trip).key === 'done');
    summaryBox.innerHTML = '<div class="hub-toolbar">' +
        '<img class="hub-mascot" src="assets/xingli-dog-mascot.png" alt="" aria-hidden="true">' +
        '<div class="hub-toolbar-copy">' +
        '<div class="hub-toolbar-title">我的行程</div>' +
        '<div class="hub-toolbar-meta">' + active.length + ' 个进行中 · 共 ' + trips.length + ' 个</div>' +
        '</div>' +
        '<button class="btn-primary" type="button" data-action-click="openCreateTripModal()">新建</button>' +
        '</div>';

    let html = '';
    if (active.length) {
        html += '<section class="section trip-home-section"><div class="section-head"><h3 class="section-title">进行中</h3><span class="section-meta">' + active.length + '</span></div>' +
            '<div class="trip-list-compact">' + active.map(renderTripCardCompact).join('') + '</div></section>';
    } else {
        html += '<div class="soft-banner">暂无进行中的行程，点右上角新建一张。</div>';
    }
    if (done.length) {
        const showing = S.homeHistoryExpanded ? done : done.slice(0, 3);
        html += '<section class="section trip-home-section section-gap-top"><div class="section-head">' +
            '<h3 class="section-title">已完成</h3>' +
            (done.length > 3 ? '<span class="section-meta section-link" data-action-click="toggleHomeHistory()">' +
                (S.homeHistoryExpanded ? '收起' : '全部 ' + done.length) + '</span>' : '<span class="section-meta">' + done.length + '</span>') +
            '</div><div class="trip-list-compact">' + showing.map(renderTripCardCompact).join('') + '</div></section>';
    }
    content.innerHTML = html;
}

function toggleHomeHistory() {
    if (getDoneTrips().length <= 3) return;
    S.homeHistoryExpanded = !S.homeHistoryExpanded;
    refreshTripHub();
}

function renderTripCardCompact(trip) {
    const progress = getTripProgress(trip);
    const status = getTripStatus(trip);
    const openMode = progress.packed > 0 && status.key !== 'done' ? 'pack' : 'plan';
    return '<div class="trip-row">' +
        '<button type="button" class="trip-row-hit" data-action-click="openTrip(\'' + trip.id + '\',\'' + openMode + '\')">' +
        '<div class="trip-row-content">' +
        '<div class="trip-row-top">' +
        '<div class="trip-row-title">' + esc(trip.name) + '</div>' +
        '<span class="status-chip ' + status.key + '">' + status.label + '</span>' +
        '</div>' +
        '<div class="trip-row-subtitle">' + esc(formatTripMeta(trip)) +
        (trip.sourceModules?.length ? ' · ' + esc(formatTripSourceSummary(trip)) : '') +
        '</div>' +
        '</div>' +
        '<div class="trip-row-trail">' +
        '<div class="progress-ring progress-ring-sm" style="--pct:' + progress.pct + '">' +
        '<span class="progress-ring-text">' + progress.pct + '%</span></div>' +
        '<span class="trip-row-chevron" aria-hidden="true">›</span>' +
        '</div></button>' +
        '<button type="button" class="trip-row-menu" data-action-click="openTripActionsSheet(\'' + trip.id + '\')" aria-label="更多操作">⋯</button>' +
        '</div>';
}

function openTripActionsSheet(tripId) {
    S.tripActionsTargetId = tripId;
    document.getElementById('tripActionsSheet')?.classList.add('active');
}

function closeTripActionsSheet() {
    S.tripActionsTargetId = null;
    document.getElementById('tripActionsSheet')?.classList.remove('active');
}

function duplicateTripFromSheet() {
    const id = S.tripActionsTargetId;
    closeTripActionsSheet();
    if (id) duplicateTrip(id);
}

function deleteTripFromSheet() {
    const id = S.tripActionsTargetId;
    closeTripActionsSheet();
    if (id) deleteTrip(id);
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
            '<button type="button" class="chip-remove" data-action-click="removeModuleFromCurrentTrip(\'' + module.source + '\', \'' + module.id + '\')" aria-label="移除 ' + esc(module.name) + '">×</button></span>'
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

function renderTripPage() {
    const summaryBox = document.getElementById('listSummary');
    const switchBox = document.getElementById('listModeSwitch');
    const actionBar = document.getElementById('listActionBar');
    const subBar = document.getElementById('listSubBar');
    const content = document.getElementById('listContent');

    if (!S.currentTrip) {
        renderTripHub();
        return;
    }

    const trip = S.currentTrip;
    const progress = getTripProgress(trip);
    const status = getTripStatus(trip);
    const smartCount = trip.items.filter(item => item.smartRule !== 'fixed').length;

    const collapsed = S.tripInfoCollapsed ? ' collapsed' : '';
    const cardClass = 'list-summary-card' + (S.tripInfoCollapsed ? ' is-collapsed' : '') + (S.tripMode === 'pack' ? ' pack-mode' : '');
    const allTrips = getTrips();
    const tripSwitcher = allTrips.length > 1
        ? '<div class="trip-switch-row">' +
        '<select class="trip-switch-select" aria-label="切换行程" data-action-change="openTrip(this.value, S.tripMode)">' +
        allTrips.map(entry => '<option value="' + entry.id + '"' + (entry.id === trip.id ? ' selected' : '') + '>' + esc(entry.name) + '</option>').join('') +
        '</select></div>'
        : '';
    summaryBox.innerHTML = '<div class="' + cardClass + '">' +
        '<div class="trip-summary-bar" data-action-click="toggleTripInfoCard()">' +
        '<div class="trip-summary-bar-main">' +
        '<div class="list-summary-title">' + esc(trip.name) + '</div>' +
        '<span class="status-chip ' + status.key + '">' + status.label + '</span>' +
        '<span class="trip-summary-pct">' + progress.pct + '%</span>' +
        '</div>' +
        '<span class="trip-info-toggle-arrow' + collapsed + '">▼</span>' +
        '</div>' +
        tripSwitcher +
        '<div class="trip-summary-expanded">' +
        '<div class="list-summary-meta">' + esc(formatTripSourceSummary(trip)) + ' · ' + esc(formatTripMeta(trip)) + '</div>' +
        renderProgress(progress) +
        '<div class="trip-info-body' + collapsed + '">' +
        '<div class="trip-info-row">' +
        '<div class="trip-info-row-label">天数</div>' +
        '<div class="stepper">' +
        '<button class="stepper-btn" data-action-click="changeCurrentTripSetting(\'days\', -1)">−</button>' +
        '<input type="number" min="1" max="90" value="' + trip.days + '" aria-label="行程天数" data-action-change="updateCurrentTripSetting(\'days\', this.value)">' +
        '<button class="stepper-btn" data-action-click="changeCurrentTripSetting(\'days\', 1)">+</button>' +
        '</div></div>' +
        '<div class="trip-info-row">' +
        '<div class="trip-info-row-label">人数</div>' +
        '<div class="stepper">' +
        '<button class="stepper-btn" data-action-click="changeCurrentTripSetting(\'people\', -1)">−</button>' +
        '<input type="number" min="1" max="20" value="' + trip.people + '" aria-label="出行人数" data-action-change="updateCurrentTripSetting(\'people\', this.value)">' +
        '<button class="stepper-btn" data-action-click="changeCurrentTripSetting(\'people\', 1)">+</button>' +
        '</div></div>' +
        '<div class="trip-info-actions">' +
        '<button type="button" class="btn-ghost" data-action-click="saveCurrentTripAsModule()">存为小包</button>' +
        ((trip.sourceModules || []).length
            ? '<button type="button" class="btn-recompute" data-action-click="resyncCurrentTripFromModules()">按小包重新同步</button>'
            : '') +
        '<button type="button" class="btn-recompute outline" data-action-click="reapplyTripSmartFill()">重新智能填充</button>' +
        '</div></div>' +
        '<div class="trip-smart-note">' + ((trip.sourceModules || []).length
            ? '改过小包后可重新同步；手调数量与勾选会尽量保留。'
            : '已建议 ' + smartCount + ' 项可变数量；手改过的数量优先保留。') + '</div>' +
        '</div></div>';

    switchBox.innerHTML = '';

    if (S.tripMode === 'plan') {
        actionBar.innerHTML = (trip.items.length
            ? '<button type="button" class="start-pack-cta" data-action-click="setTripMode(\'pack\')">' +
                '<span class="start-pack-copy"><strong>开始打包</strong><small>共 ' + trip.items.length + ' 件，边收拾边勾选</small></span>' +
                '<span class="start-pack-arrow" aria-hidden="true">→</span>' +
                '</button>'
            : '') +
            '<div class="trip-edit-actions">' +
            '<button class="btn-secondary" data-action-click="goSelectModuleForTrip()">从小包添加</button>' +
            '<button class="btn-secondary" data-action-click="goSelectItemsForTrip()">从物品库</button>' +
            '<button class="btn-primary" data-action-click="openManualItemModal()">手动添加</button>' +
            '</div>';
        subBar.innerHTML = renderTripSourceModulesBar(trip);
        content.innerHTML = trip.items.length ? renderPlanBagGroups(trip) : renderTripEmpty();
    } else {
        actionBar.innerHTML = trip.items.some(item => item.packed)
            ? '<button class="btn-secondary" data-action-click="markAllUnpacked()">重置打包进度</button>'
            : '';
        subBar.innerHTML = '<div class="pack-view-switch">' +
            '<button class="pack-view-tab ' + (S.packView === 'bags' ? 'active' : '') + '" data-action-click="setPackView(\'bags\')">按小包</button>' +
            '<button class="pack-view-tab ' + (S.packView === 'remaining' ? 'active' : '') + '" data-action-click="setPackView(\'remaining\')">未打包</button>' +
            '<button class="pack-view-tab ' + (S.packView === 'all' ? 'active' : '') + '" data-action-click="setPackView(\'all\')">全部</button>' +
            '</div>';
        content.innerHTML = renderPackContent(trip);
    }
}

function renderTripSettingBlock(field, label, value, min, max) {
    return '<div class="trip-setting-block">' +
        '<div class="trip-setting-label">' + label + '</div>' +
        '<div class="stepper">' +
        '<button class="stepper-btn" data-action-click="changeCurrentTripSetting(\'' + field + '\', -1)">−</button>' +
        '<input type="number" min="' + min + '" max="' + max + '" value="' + value + '" data-action-input="updateCurrentTripSetting(\'' + field + '\', this.value)">' +
        '<button class="stepper-btn" data-action-click="changeCurrentTripSetting(\'' + field + '\', 1)">+</button>' +
        '</div>' +
        '</div>';
}

function renderTripEmpty() {
    return '<div class="empty-panel">' +
        '<div class="empty-title">这张行程单还是空的</div>' +
        '<div class="empty-hint">勾选小包，或手动添加物品。</div>' +
        '</div>';
}

function renderPlanBagGroups(trip) {
    const bags = trip.bags || DEFAULT_BAGS;
    const groups = bags
        .map(bag => ({ bag, items: trip.items.filter(item => item.bag === bag.id) }))
        .filter(group => group.items.length);
    const unassigned = trip.items.filter(item => !bags.some(bag => bag.id === item.bag));
    if (unassigned.length) {
        groups.push({ bag: { id: 'unassigned', icon: '', name: '未分配' }, items: unassigned });
    }
    return groups.map(group =>
        '<div class="bag-group" id="plan-bag-' + group.bag.id + '">' +
        '<div class="bag-group-header">' +
        '<div class="bag-group-label">' +
        '<span class="bag-icon">' + (group.bag.icon || '') + '</span>' +
        '<span class="bag-name">' + esc(group.bag.name) + '</span>' +
        '</div>' +
        '<span class="bag-progress-count">' + group.items.length + '件</span>' +
        '</div>' +
        '<div class="bag-group-items">' + group.items.map(renderTripPlanItemCard).join('') + '</div>' +
        '</div>'
    ).join('');
}

function renderTripPlanItemCard(item) {
    return '<div class="list-item-card plan-card' + (item.packed ? ' packed' : '') + '" data-trip-item-id="' + item.id + '">' +
        '<div class="plan-card-name">' +
        (item.packed ? '<span class="packed-dot">✓</span>' : '') +
        esc(item.name) +
        (item.qty > 1 ? '<span class="plan-card-qty">×' + item.qty + '</span>' : '') +
        '</div></div>';
}

function renderPackContent(trip) {
    if (!trip.items.length) return renderTripEmpty();
    if (S.packView === 'remaining') {
        const remaining = trip.items.filter(item => !item.packed);
        if (!remaining.length) {
            return '<div class="empty-panel"><div class="empty-title">全部打包完成</div><div class="empty-hint">需要带的东西都准备好了。</div></div>';
        }
        const bags = trip.bags || DEFAULT_BAGS;
        const groups = bags
            .map(bag => ({ bag, items: remaining.filter(item => item.bag === bag.id) }))
            .filter(group => group.items.length);
        const unassigned = remaining.filter(item => !bags.some(bag => bag.id === item.bag));
        if (unassigned.length) {
            groups.push({ bag: { id: 'unassigned', icon: '', name: '未分配' }, items: unassigned });
        }
        return groups.map(group =>
            '<div class="bag-group" id="bag-remain-' + group.bag.id + '">' +
            '<div class="bag-group-header">' +
            '<div class="bag-group-label">' +
            '<span class="bag-icon">' + (group.bag.icon || '') + '</span>' +
            '<span class="bag-name">' + esc(group.bag.name) + '</span>' +
            '</div>' +
            '<span class="bag-progress-count">' + group.items.length + '件未打</span>' +
            '</div>' +
            '<div class="bag-group-items">' + group.items.map(renderPackItemCard).join('') + '</div>' +
            '</div>'
        ).join('');
    }
    if (S.packView === 'all') {
        const bags = trip.bags || DEFAULT_BAGS;
        const groups = bags
            .map(bag => ({ bag, items: trip.items.filter(item => item.bag === bag.id) }))
            .filter(group => group.items.length);
        const unassigned = trip.items.filter(item => !bags.some(bag => bag.id === item.bag));
        if (unassigned.length) {
            groups.push({ bag: { id: 'unassigned', icon: '', name: '未分配' }, items: unassigned });
        }
        return groups.map(group => {
            const packed = group.items.filter(item => item.packed).length;
            const collapsed = S.collapsedBags.has(group.bag.id) ? ' collapsed' : '';
            return '<div class="bag-group' + collapsed + '" id="bag-' + group.bag.id + '">' +
                '<button type="button" class="bag-group-header" data-action-click="toggleBagCollapse(\'' + group.bag.id + '\')" aria-expanded="' + (!collapsed) + '" aria-controls="bag-all-items-' + group.bag.id + '">' +
                '<div class="bag-group-label">' +
                '<span class="bag-icon">' + (group.bag.icon || '') + '</span>' +
                '<span class="bag-name">' + esc(group.bag.name) + '</span>' +
                '</div>' +
                '<div style="display:flex;align-items:center;gap:8px">' +
                '<span class="bag-progress-count">' + packed + '/' + group.items.length + '</span>' +
                '<span class="bag-toggle" aria-hidden="true">▼</span>' +
                '</div></button>' +
                '<div class="bag-group-items" id="bag-all-items-' + group.bag.id + '">' + group.items.map(renderPackItemCard).join('') + '</div>' +
                '</div>';
        }).join('');
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
            '<button type="button" class="bag-group-header" data-action-click="toggleBagCollapse(\'' + group.bag.id + '\')" aria-expanded="' + (!collapsed) + '" aria-controls="bag-items-' + group.bag.id + '">' +
            '<div class="bag-group-label">' +
            '<span class="bag-icon">' + (group.bag.icon || '') + '</span>' +
            '<span class="bag-name">' + esc(group.bag.name) + '</span>' +
            '</div>' +
            '<div style="display:flex;align-items:center;gap:8px">' +
            '<span class="bag-progress-count">' + packed + '/' + group.items.length + '</span>' +
            '<span class="bag-toggle" aria-hidden="true">▼</span>' +
            '</div></button>' +
            '<div class="bag-group-items" id="bag-items-' + group.bag.id + '">' + group.items.map(renderPackItemCard).join('') + '</div>' +
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
    if (el) {
        const collapsed = S.collapsedBags.has(bagId);
        el.classList.toggle('collapsed', collapsed);
        el.querySelector('.bag-group-header')?.setAttribute('aria-expanded', String(!collapsed));
    }
}

function toggleTripInfoCard() {
    S.tripInfoCollapsed = !S.tripInfoCollapsed;
    const summaryBox = document.getElementById('listSummary');
    if (!summaryBox) return;
    const card = summaryBox.querySelector('.list-summary-card');
    const toggle = summaryBox.querySelector('.trip-info-toggle-arrow');
    const body = summaryBox.querySelector('.trip-info-body');
    const expanded = summaryBox.querySelector('.trip-summary-expanded');
    if (card) card.classList.toggle('is-collapsed', S.tripInfoCollapsed);
    if (toggle) toggle.classList.toggle('collapsed', S.tripInfoCollapsed);
    if (body) body.classList.toggle('collapsed', S.tripInfoCollapsed);
    if (expanded) expanded.classList.toggle('collapsed', S.tripInfoCollapsed);
}

function renderPackItemCard(item) {
    return '<button type="button" class="list-item-card plan-card' + (item.packed ? ' packed' : '') + '" data-action-click="togglePackItem(\'' + item.id + '\')" aria-pressed="' + item.packed + '">' +
        '<span class="pack-check" aria-hidden="true">' + (item.packed ? '✓' : '') + '</span>' +
        '<div class="plan-card-name">' +
        esc(item.name) +
        (item.qty > 1 ? '<span class="plan-card-qty">×' + item.qty + '</span>' : '') +
        '</div></button>';
}

function setTripMode(mode) {
    S.tripMode = mode;
    if (mode === 'pack') {
        // Start ready to pack. Users can collapse individual bags as needed.
        S.collapsedBags = new Set();
        S.tripInfoCollapsed = true;
    }
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
    S.tripInfoCollapsed = true;
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
    if (!persistCurrentTrip()) return;
    refreshTripSettingViews();
    refreshTripHub();
}

function reapplyTripSmartFill() {
    if (!S.currentTrip) return;
    applyTripSmartFill(S.currentTrip, true);
    if (!persistCurrentTrip()) return;
    refreshTripSettingViews();
    refreshTripHub();
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
    if (!persistCurrentTrip()) return;
    refreshTripSettingViews();
    refreshTripHub();

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
    if (!persistCurrentTrip()) return;
    renderTripPage();
    refreshTripHub();
    toast(result.removedItems
        ? `已移除「${result.moduleName}」，并删掉 ${result.removedItems} 件仅属于它的物品`
        : `已移除「${result.moduleName}」`);
}

function refreshTripListContent() {
    const content = document.getElementById('listContent');
    if (!content || !S.currentTrip) return;
    const trip = S.currentTrip;
    if (S.tripMode === 'plan') {
        content.innerHTML = trip.items.length ? renderPlanBagGroups(trip) : renderTripEmpty();
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

    const pctEl = summaryBox.querySelector('.trip-summary-pct');
    if (pctEl) pctEl.textContent = progress.pct + '%';

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

    banner.classList.toggle('visible', S.currentModuleAction === 'add' && !!S.currentTrip);
    if (S.currentModuleAction === 'add' && S.currentTrip) {
        const added = (S.currentTrip.sourceModules || []).length;
        banner.textContent = `为「${S.currentTrip.name}」添加小包（已添加 ${added} 个，带「已添加」标记的无需重复加入）`;
    } else {
        banner.textContent = '维护可复用小包；新建行程时勾选组合。';
    }

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
        ? official.map(m => renderOfficialModuleCard(m)).join('')
        : '<div class="empty-panel"><div class="empty-hint">没有匹配的小包。</div></div>';

    myMeta.textContent = mine.length ? `${mine.length} 个` : '';
    myBox.innerHTML = mine.length
        ? mine.map(m => renderMyModuleCard(m)).join('')
        : '<div class="empty-panel"><div class="empty-title">还没有我的小包</div><div class="empty-hint">点右上角 + 新建，或从官方小包复制修改。</div></div>';
}

function renderModuleFilters() {
    document.getElementById('moduleFilterRow').innerHTML = MODULE_FILTERS.map(filter =>
        '<button class="filter-chip ' + (S.moduleFilter === filter.id ? 'active' : '') + '" data-action-click="setModuleFilter(\'' + filter.id + '\')">' + esc(filter.name) + '</button>'
    ).join('');
}

function isModuleOnCurrentTrip(source, id) {
    return S.currentTrip && isModuleOnTrip(S.currentTrip, source, id);
}

function renderOfficialModuleCard(module) {
    const preview = resolveOfficialModuleItems(module, getPreviewDays(), getPreviewPeople());
    const added = S.currentModuleAction === 'add' && isModuleOnCurrentTrip('official', module.id);
    const tag = (module.tags && module.tags[0]) || '官方';
    return '<div class="kit-card compact recommended' + (added ? ' added' : '') + '" data-action-click="openModuleDetail(\'official\',\'' + module.id + '\')">' +
        '<div class="kit-card-body">' +
        '<div class="kit-card-kicker">官方 · ' + esc(tag) + '</div>' +
        '<div class="kit-card-name">' + esc(module.name) + '</div>' +
        '<div class="kit-card-meta">' + preview.length + ' 件物品</div>' +
        '</div>' +
        (added ? '<span class="kit-added-badge">已添加</span>' : '<span class="kit-card-chevron">›</span>') +
        '</div>';
}

function renderMyModuleCard(module) {
    const preview = resolveCustomModuleItems(module, getPreviewDays(), getPreviewPeople());
    const added = S.currentModuleAction === 'add' && isModuleOnCurrentTrip('custom', module.id);
    return '<div class="kit-card compact' + (added ? ' added' : '') + '" data-action-click="openModuleDetail(\'custom\',\'' + module.id + '\')">' +
        '<div class="kit-card-body">' +
        '<div class="kit-card-kicker">我的小包</div>' +
        '<div class="kit-card-name">' + esc(module.name) + '</div>' +
        '<div class="kit-card-meta">' + preview.length + ' 件物品</div>' +
        '</div>' +
        (added ? '<span class="kit-added-badge">已添加</span>' : '<span class="kit-card-chevron">›</span>') +
        '</div>';
}

function openModuleDetail(source, id) {
    S.currentModule = { source, id };
    renderModuleDetailModal(source, id);
    showModal('moduleDetailModal');
}

function renderModuleDetailModal(source, id) {
    const entity = getModuleEntity(source, id);
    if (!entity) return;

    const moduleItems = (entity.items || []).map(normalizeModuleItem);
    const smartCount = moduleItems.filter(item => item.smartRule !== 'fixed').length;

    document.getElementById('moduleDetailTitle').textContent = entity.name;
    document.getElementById('moduleDetailSummary').innerHTML =
        '<div class="module-detail-badges">' +
        '<span class="mini-badge">' + (source === 'official' ? '官方小包' : '我的小包') + '</span>' +
        '<span class="mini-badge soft">' + moduleItems.length + ' 件</span>' +
        (smartCount ? '<span class="mini-badge soft">' + smartCount + ' 项可变数量</span>' : '') +
        '</div>' +
        '<p class="module-detail-desc">' + esc(entity.desc || '可复用的打包模块，创建行程时可一键加入。') + '</p>';
    document.getElementById('moduleDetailItems').innerHTML = moduleItems.length
        ? moduleItems.map(item => renderModuleDetailItemRow(item)).join('')
        : '<div class="empty-panel"><div class="empty-hint">点「编辑物品」添加或删除。</div></div>';
    document.getElementById('moduleEditBtn').style.display = 'inline-flex';
    document.getElementById('moduleEditBtn').textContent = '编辑物品';
    const deleteBtn = document.getElementById('moduleDeleteBtn');
    deleteBtn.style.display = 'inline-flex';
    deleteBtn.textContent = source === 'official' ? '删除官方小包' : '删除小包';
    const alreadyOnTrip = S.currentModuleAction === 'add' && S.currentTrip && isModuleOnTrip(S.currentTrip, source, id);
    const primaryBtn = document.getElementById('modulePrimaryBtn');
    primaryBtn.textContent = alreadyOnTrip
        ? '已在当前行程'
        : (S.currentModuleAction === 'add' && S.currentTrip ? '加入当前行程' : '用于新行程');
    primaryBtn.disabled = alreadyOnTrip;
    primaryBtn.classList.toggle('disabled', alreadyOnTrip);
}

function deleteCurrentModuleFromDetail() {
    if (!S.currentModule) return;
    const { source, id } = S.currentModule;
    const entity = getModuleEntity(source, id);
    if (!entity) return;
    const recoveryHint = source === 'official'
        ? '\n\n之后可在「我的 → 恢复官方小包」中找回。'
        : '';
    if (!confirm(`确定删除「${entity.name}」吗？${recoveryHint}`)) return;

    if (source === 'official') {
        if (!markOfficialModuleDeleted(id)) {
            toast('删除失败，请重试');
            return;
        }
    } else if (!deleteRecord(id, { silent: true })) {
        return;
    }

    closeModal('moduleDetailModal');
    S.currentModule = null;
    renderModuleLibrary();
    refreshTripHub();
    toast(source === 'official' ? '已删除，可在「我的」中恢复' : '已删除小包');
}

function renderModuleDetailItemRow(item) {
    const cat = catInfo(item.category);
    return '<div class="module-detail-row">' +
        '<div class="module-detail-main">' +
        '<span class="module-detail-name">' + esc(item.name) + '</span>' +
        '<span class="module-detail-sub">' + esc(cat.name) + (item.smartRule !== 'fixed' ? ' · 智能数量' : '') + '</span>' +
        '</div>' +
        '<span class="module-detail-qty">×' + item.defaultQty + '</span>' +
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
    if (S.currentModuleAction === 'add' && S.currentTrip) {
        addModuleToCurrentTrip(source, id);
        renderModuleDetailModal(source, id);
        renderModuleLibrary();
        return;
    }
    closeModal('moduleDetailModal');
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

function updateILibrarySearch(value) {
    updateItemSearch(value);
}

function setItemFilter(filterId) {
    S.itemFilter = filterId;
    renderItemLibrary();
}

function renderItemLibrary() {
    const banner = document.getElementById('itemContextBanner');
    const gridBox = document.getElementById('ilibraryGrid') || document.getElementById('itemLibraryGrid');
    const searchInput = document.getElementById('ilibrarySearchInput') || document.getElementById('itemSearchInput');
    const summaryBox = document.getElementById('ilibrarySummary') || document.getElementById('itemLibrarySummary');
    const allItems = getItemLibrary();
    const currentTripItemKeys = new Set((S.currentTrip?.items || []).map(item =>
        String(item.name || '').trim() + '::' + String(item.category || '')
    ));
    const isOnCurrentTrip = item => currentTripItemKeys.has(String(item.name || '').trim() + '::' + String(item.category || ''));

    if (banner) {
        banner.classList.toggle('visible', !!S.currentTrip);
        banner.textContent = S.currentTrip
            ? `正在为「${S.currentTrip.name}」添加物品；已在清单中的物品会明确标记。`
            : '';
    }

    if (searchInput) searchInput.value = S.itemSearch;
    renderItemFilters();

    const keyword = S.itemSearch.toLowerCase();
    const joinedCount = S.currentTrip ? allItems.filter(isOnCurrentTrip).length : 0;
    const items = allItems.filter(item => {
        const filterMatch = S.itemFilter === 'all' || item.category === S.itemFilter;
        const searchMatch = !keyword || item.name.toLowerCase().includes(keyword);
        return filterMatch && searchMatch;
    }).sort((a, b) => Number(isOnCurrentTrip(a)) - Number(isOnCurrentTrip(b)));

    const customCount = allItems.filter(item => item.source === 'user').length;
    if (summaryBox) {
        summaryBox.innerHTML = '<span>共 ' + allItems.length + ' 件</span>' +
            (customCount ? '<span class="qs-dot">·</span><span>自建 ' + customCount + '</span>' : '') +
            (S.currentTrip ? '<span class="qs-dot">·</span><span>可添加 ' + (allItems.length - joinedCount) + '</span>' +
                '<span class="qs-dot">·</span><span class="summary-joined">已加入 ' + joinedCount + '</span>' : '');
    }

    if (!gridBox) return;

    gridBox.innerHTML = items.length
        ? items.map(item => renderLibraryCard(item, isOnCurrentTrip(item))).join('')
        : '<div class="empty-panel full-span"><div class="empty-hint">没有匹配的物品。</div></div>';
}

function renderItemFilters() {
    const options = [{ id: 'all', name: '全部' }, ...DEFAULT_CATEGORIES.map(cat => ({ id: cat.id, name: cat.name }))];
    const filterRow = document.getElementById('ilibraryFilterRow') || document.getElementById('itemFilterRow');
    if (!filterRow) return;
    filterRow.innerHTML = options.map(option =>
        '<button class="filter-chip ' + (S.itemFilter === option.id ? 'active' : '') + '" data-action-click="setItemFilter(\'' + option.id + '\')">' + esc(option.name) + '</button>'
    ).join('');
}

function renderLibraryCard(item, alreadyAdded = false) {
    const cat = catInfo(item.category);
    const addButton = S.currentTrip
        ? (alreadyAdded
            ? '<span class="library-action added">已加入 ✓</span>'
            : '<button class="library-action primary" data-action-click="event.stopPropagation();addLibraryItemToCurrentTrip(\'' + item.id + '\')">加入</button>')
        : '';
    const cardAction = S.currentTrip
        ? (alreadyAdded ? '' : 'addLibraryItemToCurrentTrip(\'' + item.id + '\')')
        : 'openLibraryItemModal(\'' + item.id + '\')';
    return '<div class="library-card ' + (item.source === 'user' ? 'user-built ' : '') + (alreadyAdded ? 'on-trip' : '') + '"' +
        (cardAction ? ' data-action-click="' + cardAction + '" role="button" tabindex="0"' : '') + '>' +
        '<div class="library-card-body">' +
        '<div class="library-card-top">' +
        '<span class="item-pill ' + cat.cssClass + '">' + esc(cat.name) + '</span>' +
        (item.source === 'user' ? '<span class="mini-badge soft">自建</span>' : '') +
        '</div>' +
        '<div class="library-name">' + esc(item.name) + '</div>' +
        '<div class="library-meta">' + esc(bagName(item.bag, DEFAULT_BAGS)) + ' · 默认 ×' + item.defaultQty + '</div>' +
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
            const previewNames = preview.slice(0, 3).map(item => item.name).join('、');
            const isScenario = module.role === 'scenario' || (module.tags || []).includes('场景补充');
            const typeLabel = module.group === 'baby'
                ? (isScenario ? '场景补充' : '宝宝小包')
                : (source === 'official' ? (isScenario ? '场景补充' : '官方小包') : '我的小包');
            const stateLabel = locked ? '默认开启' : (selected ? '已勾选' : '点选');
            return '<div class="picker-item module-choice ' + (selected ? 'selected' : '') + '" data-action-click="toggleTripBuilderModule(\'' + source + '\',\'' + module.id + '\')">' +
                '<div class="picker-item-top">' +
                '<span class="item-pill">' + esc(typeLabel) + '</span>' +
                '<span class="mini-badge picker-tile-state">' + stateLabel + '</span>' +
                '</div>' +
                '<div class="picker-item-name">' + esc(module.icon || '🧰') + ' ' + esc(module.name) + '</div>' +
                '<div class="picker-item-meta">' + preview.length + ' 件物品 · ' + smartCount + ' 项会变动</div>' +
                (previewNames ? '<div class="picker-item-preview">' + esc(previewNames) + (preview.length > 3 ? '…' : '') + '</div>' : '') +
                '</div>';
        }).join('')
        : '<div class="empty-panel full-span"><div class="empty-title">还没有可选小包</div><div class="empty-hint">先去创建一个吧。</div></div>';
}

function toggleTripBuilderModule(source, id) {
    const key = getModuleKey(source, id);
    const module = getModuleEntity(source, id);
    if (isBabyBaseModuleEntity(module) && tripBuilderHasBabyAddonSelection()) {
        toast('宝宝场景会默认带上日常出门包');
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

    if (!saveRecord(trip)) {
        toast('保存失败，请检查设备存储空间后重试');
        return;
    }
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
    if (S.currentPage === 'kits') renderModuleLibrary();
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
    if (!persistCurrentTrip()) return;
    renderTripPage();
    renderItemLibrary();
    refreshTripHub();
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

function toggleLibraryItemTagSection() {
    toggleTagSection('libraryItemTagSection', 'libraryItemTagToggle');
}

function toggleTagSection(sectionId, toggleId) {
    const section = document.getElementById(sectionId);
    const toggle = document.getElementById(toggleId);
    if (!section) return;
    const expanded = section.classList.toggle('expanded');
    if (toggle) toggle.textContent = expanded ? '收起标签' : '+ 添加标签';
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

    if (!saveItemLibrary(items)) {
        toast('物品库保存失败，请重试');
        return;
    }
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
    if (!saveItemLibrary(items.filter(item => item.id !== S.libraryModalEditId))) {
        toast('删除失败，请重试');
        return;
    }
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

function toggleTripItemTagSection() {
    toggleTagSection('tripItemTagSection', 'tripItemTagToggle');
}

function updateItemPickerSearch(value) {
    const query = String(value || '').trim().toLowerCase();
    document.querySelectorAll('#itemPickerItems .picker-item').forEach(item => {
        item.style.display = !query || item.textContent.toLowerCase().includes(query) ? '' : 'none';
    });
}

function confirmItemPicker() {
    closeModal('itemPickerModal');
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

    if (!persistCurrentTrip()) return;
    closeModal('tripItemModal');
    renderTripPage();
    refreshTripHub();
    toast('物品已更新');
}

function deleteCurrentTripItem() {
    if (!S.currentTrip || !S.tripItemEditId) return;
    S.currentTrip.items = S.currentTrip.items.filter(item => item.id !== S.tripItemEditId);
    if (!persistCurrentTrip()) return;
    closeModal('tripItemModal');
    renderTripPage();
    refreshTripHub();
    toast('已删除物品');
}

function togglePackItem(itemId) {
    if (!S.currentTrip) return;
    const item = S.currentTrip.items.find(entry => entry.id === itemId);
    if (!item) return;
    item.packed = !item.packed;
    if (!persistCurrentTrip()) return;
    renderTripPage();
    refreshTripHub();
}

function markAllPacked() {
    if (!S.currentTrip) return;
    S.currentTrip.items.forEach(item => { item.packed = true; });
    if (!persistCurrentTrip()) return;
    renderTripPage();
    refreshTripHub();
    toast('已全部标记完成');
}

function markAllUnpacked() {
    if (!S.currentTrip) return;
    S.currentTrip.items.forEach(item => { item.packed = false; });
    if (!persistCurrentTrip()) return;
    renderTripPage();
    refreshTripHub();
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
    S.moduleAddPanelOpen = false;

    document.getElementById('moduleBuilderModalTitle').textContent = editModule ? '编辑小包' : '新建小包';
    document.getElementById('moduleBuilderSaveBtn').textContent = '保存';
    document.getElementById('moduleBuilderDeleteBtn').style.visibility = editModule ? 'visible' : 'hidden';
    document.getElementById('moduleBuilderName').value = editModule?.name || '';
    document.getElementById('moduleBuilderSearch').value = '';
    const panel = document.getElementById('moduleAddPanel');
    if (panel) panel.hidden = true;
    renderModuleBuilderSelectedItems();
    renderModuleBuilderItems();
    showModal('createModuleModal');
    setTimeout(() => document.getElementById('moduleBuilderName').focus(), 50);
}

function toggleModuleAddPanel() {
    S.moduleAddPanelOpen = !S.moduleAddPanelOpen;
    const panel = document.getElementById('moduleAddPanel');
    if (panel) panel.hidden = !S.moduleAddPanelOpen;
    if (S.moduleAddPanelOpen) {
        renderModuleBuilderItems();
        setTimeout(() => document.getElementById('moduleBuilderSearch')?.focus(), 50);
    }
}

function updateModuleBuilderSearch(value) {
    S.moduleBuilderSearch = value.trim();
    renderModuleBuilderItems();
}

function removeModuleBuilderItem(itemId) {
    const target = S.moduleBuilderItems.find(item => item.id === itemId);
    S.moduleBuilderItems = S.moduleBuilderItems.filter(item => item.id !== itemId);
    if (target) {
        const library = getItemLibrary();
        const assetId = library.find(asset => asset.name === target.name)?.id;
        if (assetId) S.moduleBuilderSelection.delete(assetId);
    }
    renderModuleBuilderSelectedItems();
    renderModuleBuilderItems();
}

function addModuleBuilderItemByAssetId(itemId) {
    const library = getItemLibrary();
    const asset = library.find(entry => entry.id === itemId);
    if (!asset) return;
    if (S.moduleBuilderItems.some(item => item.name === asset.name)) {
        toast('已在包内');
        return;
    }
    S.moduleBuilderSelection.add(itemId);
    S.moduleBuilderItems.push(createModuleItemFromAsset(asset));
    renderModuleBuilderSelectedItems();
    renderModuleBuilderItems();
}

function renderModuleBuilderSelectedItems() {
    const box = document.getElementById('moduleBuilderSelectedItems');
    if (!box) return;

    const items = S.moduleBuilderItems || [];
    box.innerHTML = items.length
        ? items.map(item =>
            '<div class="module-edit-row">' +
            '<span class="module-edit-name">' + esc(item.name) + '</span>' +
            '<span class="module-edit-qty">×' + item.defaultQty + '</span>' +
            '<button type="button" class="chip-remove" data-remove-module-item="' + item.id + '" aria-label="移除">×</button>' +
            '</div>'
        ).join('')
        : '<div class="empty-hint">还没有物品，点「+ 添加」从物品库挑选。</div>';
}

function renderModuleBuilderItems() {
    const box = document.getElementById('moduleBuilderItems');
    if (!box) return;

    const selectedNames = new Set((S.moduleBuilderItems || []).map(item => item.name));
    const keyword = S.moduleBuilderSearch.toLowerCase();
    const items = getItemLibrary()
        .filter(item => !selectedNames.has(item.name))
        .filter(item => !keyword || item.name.toLowerCase().includes(keyword))
        .sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN'));

    box.innerHTML = items.length
        ? items.map(item =>
            '<div class="picker-item addable" data-item-id="' + item.id + '">' +
            '<div class="picker-item-name">' + esc(item.name) + '</div>' +
            '</div>'
        ).join('')
        : '<div class="empty-panel full-span"><div class="empty-hint">' +
            (keyword ? '没有匹配的物品' : '物品库里的都已加入') +
            '</div></div>';
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
            icon: existing?.icon || '·',
            desc: existing?.desc || '',
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
        if (!saveOfficialModules(officialModules)) {
            toast('小包保存失败，请重试');
            return;
        }
        closeModal('createModuleModal');
        renderModuleLibrary();
        refreshTripHub();
        toast('官方小包已更新，之后新建行程都会按新设置生成');
        return;
    }

    const existing = S.moduleBuilderDraftId ? getMyModules().find(item => item.id === S.moduleBuilderDraftId) : null;
    const module = normalizeModuleRecord({
        id: existing?.id || ('module-' + gid()),
        recordType: 'module',
        name,
        icon: existing?.icon || '·',
        desc: existing?.desc || '',
        purpose: 'custom',
        tags: existing?.tags || ['我的小包'],
        items,
        createdAt: existing?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    });

    items.forEach(upsertLibraryFromModuleItem);
    if (!saveRecord(module)) {
        toast('小包保存失败，请重试');
        return;
    }
    closeModal('createModuleModal');
    renderModuleLibrary();
    refreshTripHub();
    toast(existing ? '小包已更新，之后新建行程都会按新设置生成' : '已保存到我的小包');
}

function deleteCurrentModuleDraft() {
    if (!S.moduleBuilderDraftId) return;
    if (!confirm(S.moduleBuilderDraftSource === 'official' ? '确定删除这个官方小包吗？' : '确定删除这个小包吗？')) return;

    if (S.moduleBuilderDraftSource === 'official') {
        if (!markOfficialModuleDeleted(S.moduleBuilderDraftId)) {
            toast('删除失败，请重试');
            return;
        }
    } else {
        if (!deleteRecord(S.moduleBuilderDraftId, { silent: true })) return;
    }

    closeModal('createModuleModal');
    renderModuleLibrary();
    refreshTripHub();
    toast(S.moduleBuilderDraftSource === 'official' ? '已删除官方小包' : '已删除小包');
}

function saveCurrentTripAsModule() {
    if (!S.currentTrip || !S.currentTrip.items.length) {
        toast('空行程还不能保存为小包');
        return;
    }
    openCreateModuleModal(S.currentTrip.items);
    document.getElementById('moduleBuilderName').value = S.currentTrip.name + ' 小包';
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
    if (!saveRecord(copy)) {
        toast('复制失败，请重试');
        return;
    }
    refreshTripHub();
    toast('已复制行程');
}

function deleteRecord(id, options = {}) {
    const records = getRecords().filter(record => record.id !== id);
    if (!saveRecords(records)) {
        toast('删除失败，请重试');
        return false;
    }
    if (S.currentTripId === id) {
        S.currentTripId = null;
        S.currentTrip = null;
    }
    if (S.currentModule?.id === id) {
        S.currentModule = null;
        closeModal('moduleDetailModal');
    }
    if (!options.silent) {
        if (S.currentPage === 'list') nav('list');
        refreshTripHub();
        renderModuleLibrary();
        toast('已删除');
    }
    return true;
}

function persistCurrentTrip() {
    if (!S.currentTrip?.id) return false;
    S.currentTrip.updatedAt = new Date().toISOString();
    const saved = saveRecord(S.currentTrip);
    if (!saved) {
        const stored = getTrips().find(trip => trip.id === S.currentTripId);
        if (stored) S.currentTrip = deepClone(stored);
        toast('行程保存失败，请检查设备存储空间后重试');
    }
    return saved;
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
        return isBabyModuleEntity(module) && module?.role === 'scenario';
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
    el.innerHTML = (bags || DEFAULT_BAGS).map(bag => '<option value="' + bag.id + '"' + (bag.id === selected ? ' selected' : '') + '>' + esc(bag.name) + '</option>').join('');
}
function esc(value) {
    const div = document.createElement('div');
    div.textContent = value == null ? '' : String(value);
    return div.innerHTML;
}

function setupModalOverlays() {
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        const dialog = overlay.querySelector('.modal');
        if (dialog) {
            dialog.setAttribute('role', 'dialog');
            dialog.setAttribute('aria-modal', 'true');
            dialog.setAttribute('tabindex', '-1');
        }
        overlay.addEventListener('click', event => {
            if (event.target === overlay) closeModal(overlay.id);
        });
    });
    document.addEventListener('keydown', event => {
        if (event.key !== 'Escape') return;
        const activeOverlay = document.querySelector('.modal-overlay.active');
        if (activeOverlay) closeModal(activeOverlay.id);
    });
}

function showModal(id) {
    const overlay = document.getElementById(id);
    if (!overlay) return;
    modalReturnFocus = document.activeElement;
    overlay.classList.add('active');
    setTimeout(() => {
        const target = overlay.querySelector('input:not([type="hidden"]), textarea, select, button, [tabindex="0"]');
        target?.focus();
    }, 0);
}

function closeModal(id) {
    if (id === 'createModuleModal') {
        S.moduleBuilderDraftId = null;
        S.moduleAddPanelOpen = false;
    }
    document.getElementById(id)?.classList.remove('active');
    if (modalReturnFocus instanceof HTMLElement) modalReturnFocus.focus();
    modalReturnFocus = null;
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
        title: '整理小包',
        desc: '把常带物品按用途分组，比如洗漱包、化妆包。系统已预置官方小包，你也可以新建自己的。',
    },
    {
        title: '新建行程',
        desc: '每次出门前新建行程，勾选需要的小包，系统自动合并物品并按天数、人数建议数量。',
    },
    {
        title: '打包出发',
        desc: '打开行程后切换到打包模式，实物打包时逐一勾选。',
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

    stepEl.innerHTML = '<div class="onboarding-title">' + step.title + '</div>' +
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
    safeStorageSet(STORAGE_KEYS.onboarded, '1');
    closeModal('onboardingModal');
}

// ===== 我的页面 =====

function renderMePage() {
    const trips = getTrips();
    const modules = getMyModules();
    const library = getItemLibrary();
    const officialCount = getOfficialModules().length;
    const activeCount = trips.filter(trip => getTripStatus(trip).key !== 'done').length;

    document.getElementById('meName').textContent = '行理';
    document.getElementById('meStats').innerHTML = [
        { label: '进行中', value: activeCount },
        { label: '行程', value: trips.length },
        { label: '小包', value: modules.length + officialCount },
        { label: '物品', value: library.length },
    ].map(stat =>
        '<div class="me-stat"><div class="me-stat-value">' + stat.value + '</div><div class="me-stat-label">' + stat.label + '</div></div>'
    ).join('');
}

function resetOfficialModules() {
    if (!confirm('确定恢复所有官方小包到初始状态？你自建的小包不会受影响。')) return;
    safeStorageRemove(STORAGE_KEYS.officialModules);
    safeStorageRemove(STORAGE_KEYS.deletedOfficialModules);
    safeStorageRemove(STORAGE_KEYS.officialSeedVersion);
    ensureItemLibrarySeeded();
    renderModuleLibrary();
    renderMePage();
    toast('已恢复官方小包');
}

function clearAllData() {
    if (!confirm('确定清除所有数据？包括行程、小包和物品库，此操作不可撤销。')) return;
    safeStorageRemove(STORAGE_KEYS.records);
    safeStorageRemove(STORAGE_KEYS.itemLibrary);
    safeStorageRemove(STORAGE_KEYS.officialModules);
    safeStorageRemove(STORAGE_KEYS.deletedOfficialModules);
    safeStorageRemove(STORAGE_KEYS.onboarded);
    S.currentTrip = null;
    S.currentTripId = null;
    ensureItemLibrarySeeded();
    nav('list');
    toast('数据已清除');
}

// Expose the allowlisted actions used by CSP-safe delegated event handlers.
Object.assign(window, {
    // nav & pages
    openMainPage, openSubPage, openTripPage, goBack, nav,
    // trip builder
    openCreateTripModal, confirmCreateTrip, stepValue,
    toggleTripBuilderModule, changeCurrentTripSetting, updateCurrentTripSetting,
    // trip page
    openTrip, setTripMode, toggleTripMode, setPackView,
    togglePackItem, toggleBagCollapse, toggleTripInfoCard, markAllPacked, markAllUnpacked,
    reapplyTripSmartFill, resyncCurrentTripFromModules, removeModuleFromCurrentTrip, saveCurrentTripAsModule,
    goSelectModuleForTrip, goSelectItemsForTrip,
    // module
    openCreateModuleModal, saveCustomModule, deleteCurrentModuleDraft, deleteCurrentModuleFromDetail,
    toggleModuleAddPanel, updateModuleBuilderSearch,
    useCurrentModule, openEditCurrentModule, openEditModuleModal, openModuleDetail,
    openModuleItemModal, saveModuleItemEdit, deleteModuleItemEdit,
    setModuleFilter, updateModuleSearch,
    // library
    saveLibraryItem, deleteLibraryItem, openLibraryItemModal, addLibraryItemToCurrentTrip,
    addLibraryItemTag, toggleLibraryItemTagSection,
    setItemFilter, updateItemSearch, updateILibrarySearch,
    // manual item
    openManualItemModal, saveManualTripItem,
    // trip item edit
    openTripItemModal, saveCurrentTripItem, deleteCurrentTripItem,
    addTripItemTag, toggleTripItemTagSection,
    // modals
    showModal, closeModal, updateItemPickerSearch, confirmItemPicker,
    // onboarding
    startOnboarding, nextOnboardingStep, finishOnboarding,
    // me page
    resetOfficialModules, clearAllData,
    // home extras
    toggleHomeHistory, duplicateTrip, deleteTrip,
    openTripActionsSheet, closeTripActionsSheet, duplicateTripFromSheet, deleteTripFromSheet,
});

try {
    init();
} catch (error) {
    console.error('[xingli] init failed', error);
    const content = document.getElementById('listContent');
    if (content) {
        content.innerHTML = '<div class="empty-panel"><div class="empty-title">页面加载失败</div>' +
            '<div class="empty-hint">请关闭后重新打开；如果仍然失败，请更新到最新版本。</div></div>';
    }
}
