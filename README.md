# 项目进度看板 · 使用指南

基于 GitHub Pages + Jekyll 的零成本项目进度管理站点。`git push` 即部署，Markdown 编写即更新。

---

## 快速开始（本地预览）

```bash
gem install jekyll bundler
bundle exec jekyll serve --livereload
```

打开 `http://localhost:4000/zhinenganquanmao/` 预览，修改文件自动刷新。

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
| `progress` | 整体进度 0–100，首页自动读取最新一篇的值 |
| `issues` | 本周遇到的问题（数组） |
| `next_plan` | 下周计划（数组） |

### 2. 管理问题

在 `_issues/` 下新建 `YYYY-MM-DD-问题简述.md`：

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

| 字段 | 说明 |
|------|------|
| `title` | 问题标题 |
| `status` | `open`（未解决）/ `closed`（已解决） |
| `severity` | `高` / `中` / `低` |
| `date` | 发现日期 |
| `resolution_date` | 解决日期（关闭时填写） |
| `resolution` | 解决方案（关闭时填写） |

> 关闭问题：改 `status: closed`，补充 `resolution_date` 和 `resolution`。已解决问题自动移入「已解决」分区，不删除。

### 3. 更新阶段进度

编辑 `process/` 下对应文件的前言：

```yaml
status: 进行中       # 未开始 / 进行中 / 已完成
progress: 60         # 0–100
```

### 4. 发布上线

```bash
git add .
git commit -m "更新周报 / 关闭问题 / 更新进度"
git push origin master
```

推送后 1–2 分钟自动部署生效。未更新时 `Ctrl + Shift + R` 强制刷新浏览器。

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
├── _config.yml          # Jekyll 配置（站点信息、集合、默认布局）
├── index.md             # 首页仪表盘
├── _layouts/            # 页面布局模板
├── _includes/           # 可复用组件（导航、页脚、状态徽章）
├── _sass/main.scss      # 样式源文件
├── assets/css/style.scss # 样式入口（编译为 style.css）
├── _posts/weekly/       # 周报（YYYY-MM-DD-weekNN.md）
├── _issues/             # 问题跟踪（YYYY-MM-DD-问题简述.md）
└── process/             # 研发阶段详情页
```
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
