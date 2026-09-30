# 行理 iOS 上架 Checklist

> 项目路径：`/Users/vera/WorkBuddy/应用开发/pack-helper/xingli`
> 产品名：**行理 · 小包行程助手**
> 当前版本：v1.0（基于 HTML v0.9 + Capacitor iOS）

---

## 一、开发环境

- [ ] macOS + **Xcode**（App Store 完整版，非仅 Command Line Tools）
- [ ] 执行 `sudo xcode-select -s /Applications/Xcode.app/Contents/Developer`
- [ ] **Apple Developer** 账号（$99/年）
- [ ] Node.js 18+（已用于 `npm run build`）
- [ ] **CocoaPods**：`brew install cocoapods`
- [ ] 一键初始化：`npm run ios:setup`（= `pod install` + `cap sync`）

> 当前机器若 `xcodebuild` 报错指向 CommandLineTools，需先安装 Xcode 再继续。

### 常用命令

```bash
cd "/Users/vera/WorkBuddy/应用开发/pack-helper/xingli"

# 构建 Web 资源并同步到 iOS 工程
npm run cap:sync

# 用 Xcode 打开
npm run cap:open

# 仅跑单元测试
npm test
```

---

## 二、代码与功能（上架前自测）

### 核心流程

- [ ] 新用户引导可完成或跳过
- [ ] 新建行程 → 勾选小包 → 生成清单
- [ ] 规划模式：增删物品、智能填充
- [ ] 打包模式：勾选进度、切换小包视图
- [ ] 物品库：新增 / 编辑 / 批量添加 / 搜索 / 分类筛选
- [ ] 小包：官方小包 + 自建小包
- [ ] 清单 Tab：所有行程列表正常
- [ ] 我的 → 物品库管理：Header 标题与返回正常
- [ ] 数据重启 App 后仍在（localStorage）

### 真机 UI

- [ ] iPhone 刘海 / 灵动岛：顶部 Header 不被遮挡
- [ ] 底部 Tab + Home 条：底部导航可点击
- [ ] 弹窗（新建行程、编辑物品）键盘弹出时不挡输入框
- [ ] 横屏（若支持）：布局不崩；若不支持，在 Xcode 锁定竖屏

### 已知已修复（2026-06）

- [x] `itemlibrary` / `lists` 页 Header 空白
- [x] 物品库页面 ID 与 JS 不一致导致无法渲染
- [x] 「我的」页文案改为 App 语境

---

## 三、Capacitor / iOS 工程

- [ ] `capacitor.config.json` 中 `appId` 已确认为最终 Bundle ID（当前：`com.xingli.packhelper`）
- [x] `npm run build:www` 产出 `www/`（仅 `index.html` + `bundle.js` + `style.css`）
- [x] `ios/` 工程与默认 Icon / Splash 已生成
- [ ] `npm run ios:setup` 或 `npm run cap:sync` 无报错（需 Xcode + CocoaPods）
- [ ] Xcode → **Signing & Capabilities** 选好 Team
- [x] **Deployment Target** iOS 14.0；**方向**已锁竖屏；**Version** 1.0.0 / Build 1

### 建议的 Xcode 设置

| 项 | 建议 |
|----|------|
| Display Name | 行理 |
| Bundle Identifier | com.xingli.packhelper（可改，改后需同步 config） |
| Version | 1.0.0 |
| Build | 1 |
| 方向 | 仅竖屏 Portrait |
| Status Bar | 与网页 theme-color `#f3f5fb` 协调 |

---

## 四、图标与启动图

- [x] **App Icon** 1024×1024 占位图已配置（`AppIcon-512@2x.png`，上架前建议换正式设计）
- [x] **Launch Screen** 默认 Splash 已配置
- [ ] 隐私政策 URL：`privacy.html` 需托管到可公网访问地址（GitHub Pages 等）

---

## 五、App Store Connect 材料

### 基本信息

| 字段 | 建议文案 |
|------|----------|
| 名称 | 行理 |
| 副标题 | 小包组合，出行不漏带 |
| 关键词 | 行李,打包,出行,清单,旅行,收纳,行程,露营,亲子 |
| 类别 | 旅游 或 效率 |
| 年龄分级 | 4+ |

### 描述（可参考）

```
行理帮你把出行打包这件事变简单。

· 用「小包」沉淀常带物品（洗漱包、化妆包、宝宝包…）
· 新建行程，勾选小包，自动合并成一张清单
· 按天数和人数智能建议衣物数量
· 打包模式逐项勾选，再也不怕落东西

所有数据保存在本机，无需注册，离线可用。
```

### 截图（至少 3 张，6.7" iPhone）

1. 首页 / 进行中行程
2. 小包库
3. 打包模式勾选
4. （可选）新建行程、物品库

### 隐私

- [ ] **App Privacy** 问卷：不收集数据（无账号、无分析、无网络请求时选「不收集」）
- [ ] 隐私政策 URL：若完全不联网，可用简单静态页说明「数据仅存本机」；上架时 Connect 可能要求填链接

### 审核备注（Review Notes）

```
行理是离线行李清单工具。数据存储在用户设备本地，无需登录。
测试路径：打开 App → 跳过引导 → 点「新建行程」→ 勾选小包 → 进入打包模式勾选物品。
```

---

## 六、TestFlight 内测

- [ ] Archive → Distribute → App Store Connect
- [ ] 上传成功后，在 TestFlight 添加内部测试员
- [ ] 自己完整走一遍：安装 → 新建行程 → 杀进程重开 → 数据仍在
- [ ] 邀请 2～3 个朋友试用打包流程

---

## 七、上架后（v1.1 候选）

| 功能 | 说明 |
|------|------|
| 导出 / 导入 JSON | 防卸载丢数据 |
| iCloud 同步 | 换机备份 |
| 系统分享清单 | UIActivityViewController |
| 触感反馈 | 勾选时 haptic |
| IAP 模板包 | 商业化时再上 |

---

## 八、与「说明书之家」的关系

| | 行理 | 说明书之家 |
|--|------|------------|
| 状态 | HTML 成熟 → Capacitor | SwiftUI 从 0 |
| 后端 | 无 | v1 CloudKit，无自建服务器 |
| 建议顺序 | **先发** | 并行开发 |

两个 App 共用同一个 Apple Developer 账号即可。

---

## 九、问题排查

| 现象 | 处理 |
|------|------|
| 白屏 | 确认 `npm run build:www` 后 `www/bundle.js` 存在，再 `cap sync` |
| 样式丢失 | 确认 `style.css` 已复制进 `www/` |
| 数据丢失 | WKWebView localStorage 正常；卸载会清空 |
| Archive 失败 | 检查 Signing、Bundle ID、证书是否过期 |

---

*最后更新：2026-06-13*
