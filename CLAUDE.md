# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个使用 Hugo 静态网站生成器构建的中文优惠信息网站。网站展示每日精选的优惠券和折扣信息，使用 PaperMod 主题，并集成了一个独立的优惠券聚合子网站。

## 技术架构

### Hugo 网站结构
- **静态网站生成器**: Hugo v0.149.0+extended
- **主题**: PaperMod (作为 git submodule)
- **语言**: 简体中文 (zh-cn)
- **内容结构**: 博客文章形式展示每日优惠信息

### 核心目录结构
```
hugo-deals-website/
├── content/posts/          # 每日优惠文章内容
├── layouts/               # 自定义模板
│   ├── index.html        # 首页模板 - 显示最新文章
│   └── partials/         
│       └── post_meta.html # 自定义日期显示模板 (中文格式)
├── static/               # 静态资源
│   └── coupons/         # 优惠券聚合子网站 (独立的纯HTML/JS应用)
├── themes/PaperMod/      # 主题文件 (git submodule)
└── hugo.toml            # Hugo 配置文件
```

## 关键开发命令

### 本地开发
```bash
# 启动开发服务器 (包含草稿文章)
hugo server -D --bind 0.0.0.0 --port 1313

# 快速启动 (当前目录)
hugo server -D

# 生产构建
hugo --minify
```

### 内容管理
```bash
# 创建新的每日优惠文章
hugo new posts/daily-deals-$(date +%Y-%m-%d).md

# 构建静态文件到 public/ 目录
hugo
```

## 架构特点

### 双重内容系统
1. **Hugo 博客部分** (`content/posts/`): 每日优惠文章，使用 Markdown + Front Matter
2. **优惠券聚合应用** (`static/coupons/`): 独立的纯前端应用，JSON数据驱动

### 首页定制
- `layouts/index.html`: 重写默认首页，只显示最新一篇优惠文章
- 集成"查看往期优惠"按钮链接到文章列表
- 内联CSS样式实现橙色渐变按钮设计

### 中文日期显示
- `layouts/partials/post_meta.html`: 自定义日期格式化，显示为"2025年9月4日"格式
- 通过月份数字映射实现中文月份显示

### PaperMod 主题配置
关键配置项 (`hugo.toml`):
- `ShowReadingTime: true` - 显示阅读时间
- `ShowShareButtons: true` - 显示分享按钮  
- `ShowBreadCrumbs: true` - 显示面包屑导航
- `disableThemeToggle: true` - 禁用主题切换
- `env: "production"` - 生产环境模式

## 内容创作规范

### 每日文章结构
```yaml
---
title: "X月X日优惠精选 - 平台名称 + 主要优惠"
date: 2025-09-04T17:45:30+08:00
summary: "今日精选XX优惠券、XX特价等热门优惠简述"
tags: ["外卖", "电商", "美团", "淘宝", "数码"]
categories: ["每日精选"]
draft: false
---
```

### 文章内容模板
- `## 📢 今日优惠头条` - 开头介绍
- `## 🍔 平台优惠` - 按平台分类
- `## 💡 省钱小贴士` - 使用建议
- `## 📱 更多优惠` - 结尾引导

## 优惠券聚合子网站

位于 `static/coupons/` 的独立前端应用:
- 纯 HTML/CSS/JavaScript，无构建过程
- JSON 数据驱动 (`*/coupons.json`, `*/top.json`)
- 多平台聚合：美团、饿了么、京东、生活服务
- 响应式设计，支持链接跳转和内容复制功能

详细开发指南参见 `static/coupons/CLAUDE.md`

## 部署和维护

### 静态文件生成
```bash
# 生成到 public/ 目录
hugo --minify

# 清理旧文件重新构建
hugo --cleanDestinationDir
```

### Git Submodule 管理
PaperMod 主题使用 submodule:
```bash
# 初始化 submodule
git submodule update --init --recursive

# 更新主题
git submodule update --remote themes/PaperMod
```

### 常见问题修复
- **模板渲染错误**: 检查 `layouts/partials/post_meta.html` 中的 `printf` 函数参数
- **日期格式问题**: 确保 `.Date.Format` 调用语法正确
- **主题样式冲突**: 检查自定义 CSS 与 PaperMod 主题的兼容性

## 特殊功能

### SEO 优化
- 多语言支持配置 (`languages.zh-cn`)
- 结构化 meta 标签
- 面包屑导航和分享功能
- RSS 订阅支持

### 移动端适配
- 响应式设计
- 移动端导航优化
- 触摸友好的交互元素

# 所有交互回答都使用中文