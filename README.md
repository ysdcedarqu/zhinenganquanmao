# 项目进度看板 · 使用指南

基于 GitHub Pages + Node.js 构建的零成本项目进度管理站点。Markdown 编写，Node.js 构建，`git push` 即部署。

| 类型 | 地址 |
|------|------|
| 🌐 静态网页 | [ysdcedarqu.github.io/zhinenganquanmao](https://ysdcedarqu.github.io/zhinenganquanmao/) |
| 📦 GitHub 仓库 | [github.com/ysdcedarqu/zhinenganquanmao](https://github.com/ysdcedarqu/zhinenganquanmao) |
| 📦 Gitee 仓库 | [gitee.com/ysdcedarqu/zhinenganquanmao](https://gitee.com/ysdcedarqu/zhinenganquanmao) |

---

## 快速开始

```bash
# 安装依赖
npm install

# 构建站点（输出到 _site/）
npm run build
```

构建后 `_site/` 目录即为完整的静态站点，可直接推送至 GitHub Pages。

---

## 日常操作

### 1. 撰写周报

在 `_posts/weekly/` 下新建 `YYYY-MM-DD-weekNN.md`：

```markdown
---
title: 第N周 · 本周主题
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

- [x] 完成事项
- [ ] 未完成事项

## 详细进展

自由编写 Markdown，支持表格、列表、代码等。
```

| 字段 | 说明 |
|------|------|
| `title` | 周报标题 |
| `date` | 发布日期，须与文件名日期一致 |
| `reporter` | 填报人姓名 |
| `org` | 所属单位 |
| `progress` | 整体进度 0–100，首页自动读取最新一篇的值 |
| `issues` | 本周遇到的问题（数组） |
| `next_plan` | 下周计划（数组） |

> 可直接复制 `_posts/weekly/TEMPLATE.md` 作为起点。

### 2. 管理问题

**新建问题** — 在 `_issues/` 下新建 `YYYY-MM-DD-问题简述.md`：

```markdown
---
title: 问题标题
status: open
severity: 高
date: 2026-06-06
---

## 问题描述
...

## 影响范围
...

## 解决思路
...
```

**关闭问题** — 编辑原文件，改 `status` 并补充解决信息：

```markdown
---
title: 问题标题
status: closed
severity: 高
date: 2026-06-06
resolution_date: 2026-06-10
resolution: 采用 GNSS + BLE 混合方案，芯片选型为 xxx
---

## 问题描述
...（原内容保留不动）...
```

| 字段 | 说明 |
|------|------|
| `title` | 问题标题 |
| `status` | `open`（未解决）/ `closed`（已解决） |
| `severity` | `高` / `中` / `低` |
| `date` | 发现日期 |
| `resolution_date` | 解决日期（关闭时填写） |
| `resolution` | 解决方案简述（关闭时填写） |

> 只需改 Front Matter 三个字段（`status`、`resolution_date`、`resolution`），正文不动。网页自动将该问题从「未解决」移至「已解决」分区展示。
>
> 可直接复制 `_issues/TEMPLATE.md` 作为起点。

### 3. 更新阶段进度

编辑 `process/` 下对应文件的前言：

```yaml
status: 进行中       # 未开始 / 进行中 / 已完成
progress: 60         # 0–100
```

### 4. 构建并发布上线

```bash
# 构建站点
npm run build

# 提交并推送
git add .
git commit -m "更新周报 / 关闭问题 / 更新进度"
git push origin master
```

> 如果 GitHub Pages 配置为 `_site/` 目录部署，推送后 1–2 分钟自动生效。
> 也可以将 `_site/` 内容部署到任意静态服务器。

---

## 首页数据联动

首页指标自动读取，**无需手动改 `index.md`**：

| 指标 | 数据来源 | 更新方式 |
|------|------|------|
| 当前阶段 | `process/` 中 `status: 进行中` 的页面 | 改阶段文件的 `status` |
| 整体进度 | 最新周报的 `progress` | 写新周报时填 `progress` |
| 待解决问题数 | `_issues/` 中 `status: open` 的数量 | 新建或关闭 Issue |
| 周报全文 | 最新周报正文 | 写新周报即自动展示 |

---

## 文件结构

```
.
├── package.json          # Node.js 依赖与构建脚本
├── scripts/build.js      # 静态站点生成器
├── index.md              # 首页仪表盘
├── _layouts/             # 页面布局模板
├── _includes/            # 可复用组件（导航、页脚、状态徽章）
├── _sass/main.scss       # 样式源文件
├── assets/css/style.scss # 样式入口（编译为 style.css）
├── _posts/weekly/        # 周报（复制 TEMPLATE.md 新建）
├── _issues/              # 问题跟踪（复制 TEMPLATE.md 新建）
├── process/              # 研发阶段详情页
└── _site/                # 构建输出目录（不提交到 Git）
```
|------|------|
| 屈雪松 | 站点架构设计与开发、样式定制、内容维护 |

---

## 许可证

本仓库为内部项目进度管理用途，暂不设置开源许可证。

## 构建说明

需要 Node.js 环境：

```bash
npm install
npm run build
```

构建产物在 `_site/` 目录，可直接部署到任意静态服务器或 GitHub Pages。
