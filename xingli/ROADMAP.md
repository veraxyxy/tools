# 行理 · 顶层设计与开发路径

> 编写日期：2026-04-15  
> 目标：从当前 Web 原型出发，建立可演进到 iOS App + 付费系统的工程基础，避免重走 AI 活动平台前后端分离的弯路。

---

## 一、当前状态诊断

| 维度 | 现状 | 风险等级 |
|------|------|---------|
| 代码组织 | 3023 行 app.js 单文件，全局函数式，零模块化 | 高 |
| 数据层 | localStorage，4 个 key，无迁移方案 | 高 |
| 状态管理 | 全局对象 `S`，手动渲染，无响应式绑定 | 中 |
| 路由 | 手写 `nav()` 切 5 个 page div | 低 |
| 后端 | 无 | — |
| 测试 | 74 个纯函数单测，无 UI/集成测试 | 中 |
| 部署 | GitHub Pages 静态部署 | 低 |

核心问题：**数据层和业务逻辑和渲染层完全耦合**，未来换任何技术栈（React Native、Swift UI）都要全部重写。

---

## 二、核心设计原则

1. **数据层独立**：数据模型、CRUD、业务规则抽成纯 JS 模块，不依赖任何 DOM 或框架  
2. **UI 层可替换**：Web 版和 iOS 版共享同一套数据层，只换渲染层  
3. **离线优先、云同步可选**：本地先写后同步，断网可用  
4. **先跑通再优化**：每个阶段都有可运行的产品，不做大爆炸重构

---

## 三、数据模型定义（所有端统一）

在写任何代码之前，先把数据模型固定下来。这是最重要的顶层设计。

### 3.1 实体关系

```
User (1) ──── (N) Trip
User (1) ──── (N) Module (小包)
User (1) ──── (N) LibraryItem (物品库)
Trip (N) ──── (N) Module (行程引用了哪些小包)
Trip (1) ──── (N) TripItem (行程物品清单)
Module (1) ── (N) ModuleItem (小包包含的物品)
LibraryItem ─ 被 ModuleItem / TripItem 引用
```

### 3.2 核心实体字段

```typescript
// === User ===
interface User {
  id: string;
  name: string;
  plan: 'free' | 'pro';        // 付费状态
  tripQuota: number;            // 免费用户 = 2
  createdAt: string;
  updatedAt: string;
}

// === Trip（行程） ===
interface Trip {
  id: string;
  userId: string;
  name: string;
  days: number;
  people: number;
  status: 'planning' | 'packing' | 'done';
  bags: Bag[];
  sourceModuleIds: string[];    // 引用的小包 ID
  items: TripItem[];
  createdAt: string;
  updatedAt: string;
}

// === TripItem（行程物品） ===
interface TripItem {
  id: string;
  tripId: string;
  name: string;
  category: string;
  bagId: string;
  qty: number;
  packed: boolean;
  notes: string;
  smartRule: 'fixed' | 'perPerson' | 'perDay' | 'perPersonPerDay' | 'formula';
  smartBaseQty: number;
  smartConfig: SmartConfig | null;
  smartLocked: boolean;
  sourceModuleIds: string[];
  tags: string[];
}

// === Module（小包） ===
interface Module {
  id: string;
  userId: string | null;        // null = 官方预置
  name: string;
  icon: string;
  desc: string;
  purpose: string;
  group: string;
  role: string;
  tags: string[];
  items: ModuleItem[];
  isOfficial: boolean;
  createdAt: string;
  updatedAt: string;
}

// === LibraryItem（物品库） ===
interface LibraryItem {
  id: string;
  userId: string | null;
  name: string;
  category: string;
  defaultQty: number;
  bagId: string;
  smartRule: string;
  smartConfig: SmartConfig | null;
  source: 'system' | 'user';
  tags: string[];
}
```

### 3.3 localStorage → 结构化存储迁移映射

| localStorage key | 对应实体 | 迁移方式 |
|-----------------|----------|---------|
| `packHelper_lists` | Trip + Module (混存) | 按 `recordType` 拆分 |
| `packHelper_itemLibrary` | LibraryItem | 直接映射 |
| `packHelper_officialModules` | Module (isOfficial=true) | 直接映射 |

---

## 四、开发阶段路径

### Phase 0：顶层设计冻结（当前阶段，1 天）

**目标**：把需求和数据模型想清楚，写成文档，冻结后再动代码。

- [x] 诊断当前项目状态
- [ ] 确认数据模型（本文档 §3）
- [ ] 确认用例清单（本文档 §5）
- [ ] 确认付费模型和边界

**交付物**：本文档 + 你的确认

---

### Phase 1：数据层抽离（2-3 天）

**目标**：把 app.js 里的数据逻辑抽成独立模块，Web 版功能不变。

**具体步骤**：

```
xingli/
├── src/
│   ├── data/
│   │   ├── store.js          // 存储抽象层（localStorage adapter）
│   │   ├── tripService.js    // Trip CRUD + 业务逻辑
│   │   ├── moduleService.js  // Module CRUD + 业务逻辑
│   │   ├── libraryService.js // LibraryItem CRUD
│   │   ├── smartFill.js      // 智能数量计算（纯函数）
│   │   └── constants.js      // 分类、包、预置数据
│   ├── ui/
│   │   ├── app.js            // 主入口，只管渲染和事件绑定
│   │   ├── home.js           // 首页渲染
│   │   ├── tripPage.js       // 行程详情页渲染
│   │   ├── kitsPage.js       // 小包页渲染
│   │   ├── itemsPage.js      // 物品库页渲染
│   │   └── modals.js         // 弹窗管理
│   └── utils.js              // gid, esc, deepClone 等
├── index.html
├── style.css
└── tests/
    ├── smartFill.test.js     // 数据层纯函数测试
    ├── tripService.test.js
    └── ...
```

**关键规则**：
- `src/data/` 下的文件 **零 DOM 依赖**，可以在 Node.js 环境直接跑测试
- `src/ui/` 下的文件只做 DOM 操作，通过调用 `data/` 层的函数获取数据
- 用 ES Modules（`import/export`），通过一个简单的打包脚本合并成单文件部署

**验收标准**：
- 现有 74 个单测全部通过
- 新增数据层测试覆盖率 > 80%
- Web 版功能和视觉与重构前完全一致

---

### Phase 2：存储层可切换（1-2 天）

**目标**：让数据层不绑定 localStorage，支持切换到其他存储后端。

```javascript
// src/data/store.js
class DataStore {
  constructor(adapter) {
    this.adapter = adapter; // localStorage / SQLite / API
  }
  
  async getTrips()     { return this.adapter.read('trips'); }
  async saveTrip(trip)  { return this.adapter.write('trips', trip); }
  // ...
}

// adapters/localStorageAdapter.js  —— Web 版用
// adapters/sqliteAdapter.js        —— iOS 本地用
// adapters/apiAdapter.js           —— 云同步用
```

**验收标准**：
- 切换 adapter 后，所有数据层测试通过
- Web 版继续用 localStorage adapter，行为不变

---

### Phase 3：iOS App 壳（3-5 天）

**技术选型建议**：

| 方案 | 优点 | 缺点 | 推荐度 |
|------|------|------|--------|
| **Capacitor + 当前 Web** | 改动最小，1-2 天出壳 | 性能一般，不够原生 | ⭐⭐⭐ 先出 MVP |
| React Native | 生态成熟 | 需要重写 UI 层 | ⭐⭐ 长期路线 |
| SwiftUI | 最原生 | 全部重写 | ⭐ 除非你找 iOS 开发 |

**推荐路径**：先用 Capacitor 打包当前 Web 版上 TestFlight，同时开始 Phase 1-2 的重构。重构完成后再决定是否切 React Native。

**Capacitor 最小配置**：
```bash
npm install @capacitor/core @capacitor/cli @capacitor/ios
npx cap init "行理" "com.xingli.app" --web-dir .
npx cap add ios
npx cap sync
npx cap open ios
```

---

### Phase 4：用户系统 + 付费（3-5 天）

**付费模型确认**：

| 功能 | 免费用户 | Pro 用户 |
|------|---------|---------|
| 行程数量 | 最多 2 个（活跃） | 无限 |
| 小包数量 | 无限 | 无限 |
| 物品库 | 无限 | 无限 |
| 数据同步 | 仅本地 | iCloud / 云端同步 |
| 历史行程 | 最近 3 个月 | 永久保留 |
| 导出分享 | 纯文本 | PDF + 图片 |

**建议调整**：
- 免费 2 个 → 改为 "同时活跃 2 个行程"，完成的不计数，降低付费压力
- 付费核心卖点放在 **云同步 + 多设备** 和 **导出分享**，而非数量限制
- 定价建议：月付 6 元 / 年付 48 元（打出时间限免首年 28 元）

**技术实现**：
- 用户认证：Sign in with Apple（iOS 必选） + 微信登录
- 后端：Supabase（开箱即用的 Auth + PostgreSQL + Realtime sync）
- 付费：RevenueCat（统一管理 App Store 订阅）

---

### Phase 5：云同步（5-7 天）

**同步策略**：离线优先 + 增量同步

```
本地修改 → 写入本地存储 → 标记 dirty
网络恢复 → 推送 dirty 记录到云端
云端变更 → WebSocket 推送到本地
冲突解决 → last-write-wins（按 updatedAt）
```

---

## 五、用例清单

在写代码之前，先把所有用例列清楚。每个用例对应一个可测试的行为。

### 5.1 行程管理

| # | 用例 | 当前状态 | 备注 |
|---|------|---------|------|
| T1 | 新建行程（勾选小包 + 天/人） | ✅ 已实现 | |
| T2 | 打开行程（规划/打包模式切换） | ✅ 已实现 | |
| T3 | 编辑行程（改天数/人数，智能重算） | ✅ 已实现 | |
| T4 | 复制行程 | ✅ 已实现 | |
| T5 | 删除行程 | ✅ 已实现 | |
| T6 | 行程打包进度追踪 | ✅ 已实现 | |
| T7 | 免费用户行程数限制 | ❌ 未实现 | Phase 4 |
| T8 | 行程分享/导出 | ❌ 未实现 | Phase 4 |

### 5.2 小包管理

| # | 用例 | 当前状态 |
|---|------|---------|
| M1 | 浏览官方小包 | ✅ |
| M2 | 新建自定义小包（从物品库滑选） | ✅ |
| M3 | 编辑小包（含官方小包） | ✅ |
| M4 | 删除小包 | ✅ |
| M5 | 把小包加入当前行程 | ✅ |
| M6 | 宝宝包自动联动 | ✅ |

### 5.3 物品库

| # | 用例 | 当前状态 |
|---|------|---------|
| I1 | 浏览物品库（搜索、分类筛选） | ✅ |
| I2 | 新增物品（单个/批量） | ✅ |
| I3 | 编辑物品（分类、数量、标签） | ✅ |
| I4 | 删除自建物品 | ✅ |
| I5 | 从物品库直接加入当前行程 | ✅ |

### 5.4 智能填充

| # | 用例 | 当前状态 |
|---|------|---------|
| S1 | 衣物按天×人自动算量 | ✅ |
| S2 | 宝宝物品公式补量 | ✅ |
| S3 | 手动覆盖后锁定数量 | ✅ |
| S4 | 重新智能填充 | ✅ |

### 5.5 用户与付费（Phase 4 新增）

| # | 用例 |
|---|------|
| U1 | Sign in with Apple |
| U2 | 微信登录 |
| U3 | 查看/管理订阅状态 |
| U4 | 免费用户创建第 3 个行程时弹付费引导 |
| U5 | Pro 用户解锁云同步 |
| U6 | 数据导出（行程 → PDF/图片） |

---

## 六、推进节奏建议

```
Week 1  ─── Phase 0（本文档确认） + Phase 1 开始
Week 2  ─── Phase 1 完成 + Phase 2 完成
Week 3  ─── Phase 3（Capacitor iOS 壳）
Week 4  ─── Phase 4（用户系统 + 付费）上 TestFlight
Week 5+ ─── Phase 5（云同步）+ 打磨后提审 App Store
```

每个 Phase 结束时都有一个可运行的产品，不做大跳跃。

---

## 七、接下来的行动

确认以下几个决策点后，我就开始按 Phase 1 推进：

1. **数据模型**：§3 的字段设计是否 OK？有没有要加的字段？
2. **付费模型**：§4 的"同时活跃 2 个行程"方案是否接受？
3. **iOS 技术路线**：先 Capacitor 打壳还是直接 React Native？
4. **后端选型**：Supabase 还是自建（工蜂内部资源）？
