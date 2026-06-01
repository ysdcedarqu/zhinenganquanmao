# 智能安全帽 · 项目进度汇报站

基于 GitHub Pages + Jekyll 构建的项目研发进度管理平台，面向团队内部及领导层，提供周报记录、问题跟踪、全流程进度可视化等功能。

> **在线访问**：<https://ysdcedarqu.github.io/zhinenganquanmao/>

---

## 项目背景

「智能安全帽」是一款面向智慧工地场景的综合安全解决方案，集成了佩戴检测、姿态监测、实时定位、应急呼救、语音交互等九大功能模块。本仓库用于管理该项目的研发进度、周报归档及问题跟踪，便于团队成员与领导层实时掌握项目动态。

| 功能模块 | 技术路线 |
| :--- | :--- |
| 佩戴合规 | 霍尔传感器 + 磁贴，锁扣检测戴帽状态 |
| 姿态监测 | 六轴 IMU（加速度 + 陀螺仪） |
| 实时位置 | 实时定位、电子围栏、轨迹记录 |
| 应急呼救 | SOS 按键、蜂鸣器报警 |
| 语音交互 | 麦克风阵列 + 扬声器、语音播报、对讲 |
| 电源 | 单块 2000–3000mAh 可拆卸锂电 |
| 视频采集 | 1080P 摄像头 + TF 卡存储 |
| 照明灯 | LED 照明 |
| 状态上报 | 4G 模块上传云端进行异常识别 |

---

## 站点结构

| 板块 | 说明 |
|------|------|
| 首页仪表盘 | 项目整体状态概览、关键指标监控、研发阶段时间线 |
| 研发流程 | 7 个阶段详细进度（需求分析 → 方案设计 → 硬件选型 → 原型开发 → 软件开发 → 集成测试 → 部署交付） |
| 周报 | 每周研发进展记录，支持归档与回溯 |
| 问题跟踪 | 研发过程中遇到的问题、解决方案及状态管理 |

---

## 快速开始（本地预览）

想在本地预览站点效果？只需两步：

```bash
# 1. 安装依赖（首次）
gem install jekyll bundler

# 2. 启动本地服务器（支持自动刷新）
bundle exec jekyll serve --livereload
```

打开浏览器访问 `http://localhost:4000/zhinenganquanmao/` 即可实时预览。修改文件保存后浏览器会自动刷新。

---

## 日常操作指南

### 1. 撰写周报

在 `_posts/weekly/` 目录下新建 Markdown 文件，**文件名必须遵循** `YYYY-MM-DD-weekNN.md` 格式：

```markdown
---
title: 第3周 · 阶段进展标题
date: 2026-06-06
progress: 20
issues:
  - 问题描述1
  - 问题描述2
next_plan:
  - 下周计划1
  - 下周计划2
---

## 本周完成

- [x] 完成事项 1
- [x] 完成事项 2
- [ ] 未完成事项

## 详细进展

### 模块A

具体进展描述...

## 风险与应对

如有潜在风险，在此记录。
```

| Front Matter 字段 | 类型 | 说明 |
|------|------|------|
| `title` | 字符串 | 周报标题，格式建议：`第N周 · 本周主题` |
| `date` | 日期 | 发布日期，必须与文件名中的日期一致 |
| `progress` | 数字 | 本周完成后的整体进度百分比（0–100） |
| `issues` | 数组 | 本周遇到的问题列表 |
| `next_plan` | 数组 | 下周工作计划列表 |

正文使用标准 Markdown 自由编写，推荐包含任务列表（`- [x]` / `- [ ]`）。

### 2. 记录/更新问题

在 `_issues/` 目录下新建文件，命名格式为 `ISSUE-NNN.md`（编号递增）：

```markdown
---
title: 问题标题（简要描述）
status: open
severity: 高
date: 2026-06-06
---

## 问题描述

详细描述现象、复现步骤等。

## 影响范围

说明该问题对项目的影响。

## 解决思路

记录排查过程和最终采用的方案。
```

| Front Matter 字段 | 类型 | 说明 |
|------|------|------|
| `title` | 字符串 | 问题简要标题 |
| `status` | 枚举 | `open`（未解决）/ `closed`（已解决） |
| `severity` | 枚举 | `高` / `中` / `低` |
| `date` | 日期 | 发现日期 |
| `resolution_date` | 日期 | 解决日期（关闭时填写） |
| `resolution` | 字符串 | 解决方案概述（关闭时填写） |

> **关闭问题时**：将 `status` 改为 `closed`，补充 `resolution_date` 和 `resolution` 字段。

### 3. 更新研发阶段进度

编辑 `process/` 目录下对应阶段的 `.md` 文件，修改 Front Matter 中的 `status` 和 `progress`：

```yaml
---
title: 需求分析
phase: 1
icon: 📋
status: 进行中       # 未开始 / 进行中 / 已完成
progress: 60         # 当前阶段完成度 0–100
prev:
next: /process/02-方案设计/
---
```

7 个阶段文件一览：

| 文件 | 阶段 | 当前状态 |
|------|------|------|
| `process/01-需求分析.md` | 第 1 阶段 | 进行中 |
| `process/02-方案设计.md` | 第 2 阶段 | 未开始 |
| `process/03-硬件选型.md` | 第 3 阶段 | 未开始 |
| `process/04-原型开发.md` | 第 4 阶段 | 未开始 |
| `process/05-软件开发.md` | 第 5 阶段 | 未开始 |
| `process/06-集成测试.md` | 第 6 阶段 | 未开始 |
| `process/07-部署交付.md` | 第 7 阶段 | 未开始 |

### 4. 发布更新到线上

三步推送，自动部署：

```bash
git add .
git commit -m "更新第X周周报 / 关闭 ISSUE-00X / 更新XX阶段进度"
git push origin master
```

推送后 GitHub Actions 会自动构建并部署到 GitHub Pages，约 **1–2 分钟**后刷新线上页面即可看到更新。

> **提示**：如果推送后页面未更新，尝试 `Ctrl + Shift + R` 强制刷新浏览器缓存。

---

## 项目文件结构

```
.
├── _config.yml              # Jekyll 全局配置（站点信息、集合、默认布局）
├── index.md                 # 首页仪表盘（关键指标 + 流程时间线 + 周报列表）
├── 技术路线.md               # 各功能模块技术路线汇总
├── README.md                # 本文件
├── _layouts/                # 页面布局模板
│   ├── default.html         #   基础布局（导航栏 + 内容区 + 页脚）
│   ├── post.html            #   周报详情页布局
│   ├── issue.html           #   问题详情页布局
│   └── process.html         #   研发阶段详情页布局
├── _includes/               # 可复用 HTML 组件
│   ├── nav.html             #   顶部导航栏
│   ├── footer.html          #   底部版权信息
│   └── status-badge.html    #   状态徽章组件
├── _sass/                   # SCSS 样式源文件
│   └── main.scss            #   主样式（变量、组件、布局、动画）
├── assets/css/              # 样式入口
│   └── style.scss           #   仅含 @import，编译后输出 style.css
├── _posts/weekly/           # 周报归档（文件名必须含日期）
├── _issues/                 # 问题跟踪记录
└── process/                 # 7 个研发阶段详情页
```

---

## 技术栈

- **静态站点生成器**：Jekyll（GitHub Pages 原生支持）
- **样式预处理**：SCSS
- **模板引擎**：Liquid
- **托管平台**：GitHub Pages

---

## 贡献者

| 姓名 | 职责 |
|------|------|
| 屈雪松 | 站点架构设计与开发、样式定制、内容维护 |

---

## 许可证

本仓库为内部项目进度管理用途，暂不设置开源许可证。

## 本地预览

需要 Ruby 环境：

```bash
gem install bundler
bundle init
bundle add jekyll jekyll-seo-tag
bundle exec jekyll serve
```

浏览器打开 `http://localhost:4000/zhinenganquanmao/` 预览。
