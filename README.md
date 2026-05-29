# 智能安全帽 · 项目进度汇报站

基于 GitHub Pages + Jekyll 的项目进度管理站点，用于向领导汇报研发周报、问题跟踪和全流程进度。

**在线预览**：<https://ysdcedarqu.github.io/zhinenganquanmao/>

## 站点结构

| 板块 | 说明 |
|------|------|
| 首页仪表盘 | 项目状态总览、流程时间线、周报/问题列表 |
| 研发流程 | 7 阶段进度详情（需求分析→部署交付） |
| 周报 | 每周研发进展记录 |
| 问题跟踪 | 遇到的问题与解决方案 |

## 写周报

在 `_posts/weekly/` 下新建文件，命名格式 `YYYY-MM-DD-weekNN.md`：

```markdown
---
title: 第3周 · 标题
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

- 具体工作内容

## 详细进展

补充说明...
```

- `progress`：本周整体进度百分比
- `issues`：遇到的问题列表
- `next_plan`：下周计划列表
- 正文用 Markdown 自由编写

## 记问题

在 `_issues/` 下新建文件，命名格式 `ISSUE-NNN.md`：

```markdown
---
title: 问题标题
status: open
severity: 高
date: 2026-06-06
resolution_date: 2026-06-10
resolution: 解决方案描述
---

## 问题描述

详细说明...
```

- `status`：`open`（未解决）或 `closed`（已解决）
- `severity`：`高` / `中` / `低`
- `resolution` 和 `resolution_date`：解决后填写，未解决时删掉这两行

## 更新研发流程

编辑 `process/` 下对应阶段的文件，修改 front matter：

```yaml
status: 进行中    # 未开始 / 进行中 / 已完成
progress: 60      # 0-100
```

7 个阶段文件：

```
process/01-需求分析.md
process/02-方案设计.md
process/03-硬件选型.md
process/04-原型开发.md
process/05-软件开发.md
process/06-集成测试.md
process/07-部署交付.md
```

## 发布

```bash
git add .
git commit -m "更新周报/问题/进度"
git push
```

推送后 GitHub Pages 会自动构建，约 1-2 分钟生效。

## 本地预览

需要 Ruby 环境：

```bash
gem install bundler
bundle init
bundle add jekyll jekyll-seo-tag
bundle exec jekyll serve
```

浏览器打开 `http://localhost:4000/zhinenganquanmao/` 预览。
