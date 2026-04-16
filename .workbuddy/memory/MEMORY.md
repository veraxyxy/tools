# 行理项目长期记忆

## 项目概况
- 出行打包助手 App，核心流程：物品库 → 小包 → 行程
- 仓库：https://github.com/veraxyxy/tools，Pages：veraxyxy.github.io/tools/xingli/
- 工蜂镜像：https://git.woa.com/veraxwang/AIactivity

## 技术栈
- 前端 SPA：index.html + app.js(UI层~1875行) + src/data/(数据层9模块~1220行) + style.css
- 构建：esbuild 打包为 bundle.js（IIFE），index.html 引用 bundle.js
- 数据存储：localStorage（4 个 key：packHelper_lists / packHelper_itemLibrary / packHelper_officialModules / packHelper_onboarded）
- 部署：GitHub Pages + GitHub Actions
- 测试：Jest，74 个纯函数单测（待更新为 import 数据层模块）
- 数据层模块结构：constants / seeds / utils / smartFill / models / store / libraryService / tripService / index

## 数据结构
- Trip 和 Module 混存在 packHelper_lists，靠 recordType 字段区分
- 全局状态对象 `S`，手动渲染，无框架
- 9 个官方预置小包（洗漱/化妆/证件/衣服/宝宝系列/电子/露营）
- ~120 件种子物品库

## 未来规划（2026-04-15 确认）
- 目标：做成 iOS App + 付费系统
- 路径：数据层抽离 → 存储层可切换 → Capacitor iOS 壳 → 用户+付费 → 云同步
- 付费模型：免费用户同时活跃 2 个行程，Pro 解锁无限+云同步+导出
- 顶层设计文档：xingli/ROADMAP.md
- 待用户确认：数据模型、付费模型、iOS 技术路线、后端选型

## UI 偏好
- 糖果色、白底、大圆角，空卡片灰色提示字
- 不要卡片嵌套（外层容器直接承载内容）
- 物品库多列紧凑布局
- 小包页不显示件数计数

## 上次修改：2026-04-15
