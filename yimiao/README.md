# Yimiao

一个手机端疫苗查看与记录小页面。

在线访问：
- GitHub Pages: https://veraxyxy.github.io/tools/yimiao/

功能：
- 支持“健康院省钱版 / 机构减针版”两种模式切换
- 支持疫苗状态记录：未打、已预约、已打
- 支持更轻量的小程序式视觉
- 默认优先显示“当前月龄 + 下一个月龄”
- 默认不展示 6 岁以后内容
- 支持按月龄整组快捷标记，减少逐条点击
- 使用浏览器本地存储保存状态

目录说明：
- `index.html`：主页面
- `data/vaccine_data.json`：由 Excel 提取后的统一数据
- `scripts/extract_vaccine_data.py`：从原始 Excel 抽取数据的脚本

本地预览：
```bash
python3 -m http.server 8123
```
然后打开：
`http://127.0.0.1:8123/yimiao/index.html`

更新数据：
```bash
python3 scripts/extract_vaccine_data.py --src "~/Downloads/疫苗及打针记录.xlsx"
```
