# 行理 · iOS 开发说明

小包行程助手的 iOS 版基于 **Capacitor 7** 打包现有 HTML/JS 应用。

## 当前状态

| 项 | 状态 |
|----|------|
| `www/` Web 资源 | ✅ 已配置（`npm run build:www`） |
| `ios/` Xcode 工程 | ✅ 已生成 |
| App Icon / Splash | ✅ 默认资源已就位（可替换为正式设计） |
| CocoaPods / `pod install` | ⏳ 需 **完整 Xcode**（非仅 Command Line Tools） |
| 真机运行 / 上架 | ⏳ 安装 Xcode 后按下方步骤执行 |

## 前置条件（真机 & 上架必做）

1. **Xcode**（从 Mac App Store 安装，约 12GB+）
2. 切换开发者目录（安装 Xcode 后执行一次）：

   ```bash
   sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
   sudo xcodebuild -license accept
   ```

3. **CocoaPods**：`brew install cocoapods`
4. **Apple Developer** 账号（$99/年，真机调试与上架必需）
5. Node.js 18+

> 若 `xcode-select -p` 显示 `/Library/Developer/CommandLineTools`，说明尚未安装或未激活完整 Xcode，`pod install` 与真机构建都会失败。

## 一键初始化（安装 Xcode 后）

```bash
cd "/Users/vera/WorkBuddy/应用开发/pack-helper/xingli"
npm run ios:setup
```

等价于：`pod install` + `npm run cap:sync`。

## 日常开发

```bash
# 修改 app.js / index.html / style.css 后
npm test                 # 单元测试
npm run cap:sync         # 构建 + 同步（需 CocoaPods）
# 若 pod 暂不可用，仅同步 Web 资源：
npm run cap:copy
npm run cap:open         # 用 Xcode 打开 App.xcworkspace
```

## Xcode 真机运行

1. 打开 **`ios/App/App.xcworkspace`**（不是 `.xcodeproj`）
2. 选中 **App** target → **Signing & Capabilities**
   - 勾选 **Automatically manage signing**
   - **Team** 选你的 Apple Developer 团队
   - Bundle ID：`com.xingli.packhelper`（需与 App Store Connect 一致）
3. iPhone 用数据线连接，信任此电脑
4. 顶部设备选你的 iPhone → **Run** (⌘R)

首次安装若提示「不受信任的开发者」：设置 → 通用 → VPN 与设备管理 → 信任。

## TestFlight / App Store 上架

1. [App Store Connect](https://appstoreconnect.apple.com) 新建 App
   - 名称：**行理**
   - Bundle ID：`com.xingli.packhelper`
   - SKU：自定（如 `xingli-ios`）
2. Xcode：**Product → Archive** → **Distribute App** → App Store Connect
3. Connect 填写截图、描述、隐私问卷（不收集数据）
4. 隐私政策 URL：可托管 `privacy.html`（本目录已提供）
5. 提交审核

完整清单见：`../docs/xingli-ios-release-checklist.md`

## 目录说明

| 路径 | 说明 |
|------|------|
| `app.js` | 主逻辑源码 |
| `bundle.js` | esbuild 打包产物 |
| `www/` | Capacitor 静态资源（自动生成） |
| `ios/App/App.xcworkspace` | Xcode 工程入口 |
| `capacitor.config.json` | Capacitor 配置 |
| `privacy.html` | 隐私说明（上架用 URL） |

## 版本信息

- **Marketing Version**：1.0.0
- **Build**：1
- **最低 iOS**：14.0
- **方向**：仅竖屏
