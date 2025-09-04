# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# 所有交互回答都使用中文

# 启动并行的代理执行任务

# 环境约定
- python环境：python3 pip3
- nodejs环境：node npm

## 项目概述

这是一个中文优惠券聚合网站，整合了美团、饿了么、京东和生活服务等多个平台的优惠券信息。采用JSON数据驱动架构，响应式设计。

## 技术架构

- **数据驱动**: 所有优惠券数据存储在JSON文件中 (`*/coupons.json`)
- **原生JavaScript**: 无框架依赖，使用ES5兼容性模式
- **静态网站**: 无构建过程，可直接在浏览器中运行
- **响应式设计**: 移动端优先，基于选项卡的平台切换

### 核心组件

- `coupon-renderer.js`: 核心渲染引擎，加载JSON数据并生成HTML
- `script.js`: UI交互处理（选项卡切换、剪贴板操作）
- `index.html`: 主页面，包含所有平台的选项卡界面
- 平台目录 (`meituan/`, `eleme/`, `jingdong/`, `shenghuo/`): 每个包含 `coupons.json` 和 `top.json`

### 数据结构

每个平台的 `coupons.json` 遵循以下结构:
```json
{
  "platform": "平台标识",
  "platformName": "显示名称", 
  "icon": "图标路径",
  "sections": [{
    "title": "区域标题",
    "coupons": [{
      "id": "唯一标识符",
      "title": "优惠券标题",
      "description": "描述文字", 
      "type": "link|copy",
      "action": "按钮文字",
      "url": "链接地址", // link类型使用
      "content": "复制内容", // copy类型使用
      "dataType": "wxapp", // 可选，微信小程序标识
      "icon": "自定义图标路径" // 可选，覆盖平台默认图标
    }]
  }]
}
```

## 开发说明

这是一个静态HTML/CSS/JavaScript项目，无需构建过程：

1. **本地开发**: 直接在浏览器中打开 `index.html` 或使用任何静态服务器
2. **兼容性测试**: 打开 `compatibility-test.html` 进行浏览器兼容性检查
3. **内容更新**: 编辑平台目录中的JSON文件后刷新浏览器

## 内容管理

### 添加/更新优惠券

1. 编辑对应的 `*/coupons.json` 文件
2. 遵循上述JSON结构规范
3. 确保新优惠券使用唯一ID
4. 刷新浏览器查看更改效果

详细操作指南参见 `JSON编辑指南.md`

### 今日主推更新

更新 `*/top.json` 文件来设置当日推荐:
```json
{
  "items": [
    "🔥 今日限时活动文字",
    "🎉 推荐内容2"
  ]
}
```

### 优惠券类型

- **link类型**: 点击跳转到外部链接，需要 `url` 字段
- **copy类型**: 点击复制内容到剪贴板，需要 `content` 字段
- **微信小程序**: copy类型 + `dataType: "wxapp"`，复制后提示在微信中粘贴

## 平台结构

- 每个平台都有独立目录，包含数据文件和图标
- 各平台的独立页面 (如 `meituan/meituan.html`) 已废弃，主要使用主页的选项卡界面
- `coupon-renderer.js` 包含初始化冲突检测，避免在独立页面重复加载

## 浏览器兼容性

- 包含fetch API和Promise的polyfill支持老版本浏览器
- 微信浏览器检测和特殊处理
- 使用document.execCommand作为剪贴板操作降级方案
- 网络请求和渲染失败的错误处理机制

## SEO优化

- 完整的meta标签和结构化数据
- 隐藏的SEO内容区域供搜索引擎索引
- 集成sitemap支持
- 各平台专用页面URL以提升索引效果

## 文件说明

- `兼容性修复说明.md`: 浏览器兼容性问题的修复记录
- `SEO优化指南.md`: 搜索引擎优化相关说明
- `google716b12fb28d5d523.html`: Google Search Console验证文件