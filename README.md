# 智能安全帽 · 项目进度汇报站

基于 GitHub Pages + Jekyll 构建的项目研发进度管理平台，面向团队内部及领导层，提供周报记录、问题跟踪、全流程进度可视化等功能。

> **在线访问**：<https://ysdcedarqu.github.io/zhinenganquanmao/>

---

## 项目背景

「智能安全帽」是一款面向智慧工地场景的综合安全解决方案，集成了佩戴检测、姿态监测、实时定位、应急呼救、语音交互等九大功能模块。本仓库用于管理该项目的研发进度、周报归档及问题跟踪，便于团队成员与领导层实时掌握项目动态。

---

## 站点结构

| 板块 | 说明 |
|------|------|
| 首页仪表盘 | 项目整体状态概览、关键指标监控、研发阶段时间线 |
| 研发流程 | 7 个阶段详细进度（需求分析 → 方案设计 → 硬件选型 → 原型开发 → 软件开发 → 集成测试 → 部署交付） |
| 周报 | 每周研发进展记录，支持归档与回溯 |
| 问题跟踪 | 研发过程中遇到的问题、解决方案及状态管理 |

---

## 使用指南

### 撰写周报

在 `_posts/weekly/` 目录下新建 Markdown 文件，命名格式为 `YYYY-MM-DD-weekNN.md`：

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

- 具体工作条目

## 详细进展

补充说明...
```

| 字段 | 说明 |
|------|------|
| `progress` | 本周整体进度百分比（0–100） |
| `issues` | 本周遇到的问题列表 |
| `next_plan` | 下周工作计划列表 |

正文部分使用标准 Markdown 语法自由编写。

### 记录问题

在 `_issues/` 目录下新建文件，命名格式为 `ISSUE-NNN.md`：

```markdown
---
title: 问题标题
status: open
severity: 高
date: 2026-06-06
resolution_date: 2026-06-10
resolution: 解决方案简要说明
---

## 问题描述

详细说明...
```

| 字段 | 说明 |
|------|------|
| `status` | `open`（未解决）或 `closed`（已解决） |
| `severity` | `高` / `中` / `低` |
| `resolution` | 解决方案概述（问题解决后填写，未解决时删除该行） |
| `resolution_date` | 解决日期（问题解决后填写，未解决时删除该行） |

### 更新研发阶段进度

编辑 `process/` 目录下对应阶段的 Markdown 文件，修改 YAML Front Matter：

```yaml
status: 进行中    # 可选值：未开始 / 进行中 / 已完成
progress: 60      # 当前阶段进度 0–100
```

7 个阶段文件一览：

```
process/01-需求分析.md
process/02-方案设计.md
process/03-硬件选型.md
process/04-原型开发.md
process/05-软件开发.md
process/06-集成测试.md
process/07-部署交付.md
```

### 发布更新

```bash
git add .
git commit -m "更新周报/问题/进度"
git push
```

推送至 `master` 分支后，GitHub Pages 将自动触发构建与部署，约 1–2 分钟后生效。

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
