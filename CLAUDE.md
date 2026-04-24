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

---

# 文章写作规范（SEO 内容文章）

## 网站定位

shenquanquan.com 是外卖优惠券引流站，推广美团外卖、饿了么等平台优惠券。
核心目标：让用户看完文章后，点击领券按钮或扫码关注公众号「外卖神券探探」。

## Front Matter 格式

```yaml
---
title: "文章标题"
date: YYYY-MM-DDT00:00:00+08:00
summary: "一句话摘要，50字以内，说清楚文章解决什么问题。"
tags: ["美团外卖", "相关标签"]
categories: ["省钱攻略"]   # 或 "平台对比" / "新人指南"
slug: "pinyin-slug-yong-lian-zi-fu"
draft: false
---
```

**日期规则**：统一用 `T00:00:00+08:00`，不要用 `T10:00:00+08:00`，避免与 GitHub Actions cron 时间冲突。

## 写作原则

- **够用就行**：把要说的事说清楚、说准确，不堆字
- **逻辑清晰**：每个 `##` 小节只讲一件事，读者能跳着看
- **信息准确**：金额、活动规则、操作步骤要准确；活动会变化的注明「以当期活动为准」
- **口语化**：说人话，不用营销腔
- **禁止使用第三方推广口令**：不得在文章中出现任何第三方的推广口令或邀请码（如「外卖548」之类），这些是他人的推广链接，用了等于给别人导流
- **知乎文章引流用链接卡片**：引导用户领券时，插入 shenquanquan.com/coupons/ 链接卡片，不只提公众号名字
- **多个同类券说清优先级**：大券主推、小券备选，用"如果抢不到X，可以抢Y"结构，而不是并列列举

## 内部链接

提到站内已有文章话题时，加上内部链接：

```markdown
[文章标题](/posts/slug/)
```

已有文章：
- [美团外卖神券怎么领](/posts/meituan-shenquan-lingqu-gonglue/)
- [美团外卖30元无门槛券怎么领](/posts/meituan-30yuan-wumenkan-coupon/)
- [美团优惠券叠加使用教程](/posts/meituan-coupon-diejia-gonglue/)
- [专门发美团优惠券的公众号推荐](/posts/meituan-coupon-gongzhonghao-tuijian/)
- [美团优惠券膨胀技巧详解](/posts/meituan-coupon-pengzhang-jiqiao/)
- [美团外卖和饿了么哪个便宜](/posts/meituan-vs-eleme-bijiao/)
- [新用户首单攻略](/posts/meituan-xinyonghu-shodan-gonglue/)
- [京东外卖29减25优惠券怎么抢](/posts/jd-waimai-29-25-coupon-qiangjuan/)
- [饿了么变成淘宝闪购了？账号、超吃卡、优惠券怎么用](/posts/eleme-bianchen-taobao-shanggou/)
- [京东外卖超级月卡值得开吗？1.68元能省多少](/posts/jd-waimai-super-yueka/)
- [淘宝闪购超级吃货卡值不值得开？3.6元能省多少](/posts/taobao-flash-super-chika-card/)
- [美团外卖神券包4.9元值不值买？12张5元无门槛券](/posts/meituan-shenquanbao-zhide-mai/)
- [京东418超级外卖日：今晚20点开抢，大牌1分钱+月卡1.68元](/posts/jd-418-super-waimai-day/)
- [美团外卖红包在哪里领？2026年5个真实入口整理好了](/posts/meituan-waimai-hongbao-zai-na-ling/)
- [京东外卖怎么省钱？2026年完整攻略，叠加用每单少付5-15元](/posts/jd-waimai-shengqian-gonglue/)
- [淘宝闪购怎么省钱？2026年最新攻略，四层叠加每单省10-20元](/posts/taobao-flash-shengqian-gonglue/)
- [美团、淘宝闪购、京东外卖，哪个更便宜？三平台实测](/posts/meituan-taobao-flash-jd-bijiao/)
- [用外卖优惠券，商家会亏本吗？三种券的钱谁出的](/posts/waimai-youhuiquan-shui-chengdan/)

每写一篇新文章后，在这里追加一条。

## 结尾固定模块（每篇必须有）

```markdown
---

<div style="text-align:center; margin: 2rem 0;">
  <a href="/coupons/" style="display:inline-block; padding:14px 36px; background:linear-gradient(135deg,#FF8C00,#FFA500); color:white; text-decoration:none; border-radius:10px; font-size:1.1rem; font-weight:bold; box-shadow:0 4px 15px rgba(255,140,0,0.35);">
    🧧 点这里领今日神券 →
  </a>
</div>

---

## 关注公众号，第一时间获取优惠

<div style="text-align:center; margin: 1.5rem 0;">
  <img src="/images/wechat-qrcode.jpg" alt="外卖神券探探公众号二维码" style="width:180px; height:180px; border-radius:8px; display:block; margin:0 auto;">
  <p style="color:#888; font-size:0.9rem; margin-top:0.5rem;">微信扫码关注「外卖神券探探」</p>
</div>
```

按钮文案可根据文章主题微调，如「领新人专属神券」「领今日大额券」等。

## slug 命名规则

全小写拼音，单词间用 `-` 连接，体现核心关键词，4-6个词为宜。
示例：`meituan-30yuan-wumenkan-coupon`、`eleme-xinyonghu-gonglue`

---

# 知识库系统

## 位置

`.claude/knowledge/` — 写文章前必须先读相关文件。

- 索引：[`.claude/knowledge/README.md`](.claude/knowledge/README.md)（所有文件一览）
- 规范：[`.claude/knowledge/STANDARD.md`](.claude/knowledge/STANDARD.md)（文件格式与采集标准）

## 目前覆盖范围

| 平台 | 官方规则 | 知乎洞察 |
|------|---------|---------|
| 美团外卖 | ✅ | ✅ 8个文件 |
| 饿了么 / 淘宝闪购 | ✅ | ✅ 2个文件 |
| 京东外卖 | ✅ | 待建 |
| 跨平台对比 | — | ✅ 2个文件 |

## 写文章时的使用流程

**第0步（必须）：选题查重**
写任何新文章前，先做内容查重，避免重复覆盖已有角度：
1. 读 `.claude/platforms/zhihu/published.md` — 查看已发布的知乎文章和回答
2. 看 CLAUDE.md「内部链接」章节的已有文章列表 — 确认 Hugo 文章现有覆盖
3. 确认新文章与已有内容的**关键词**或**用户意图**有明显差异，再开始写

**第1-6步：内容准备与审校**
1. 确定文章主题和涉及平台
2. 先读对应平台的 `official.md`（保证规则准确）
3. 再读相关主题的 `insights/` 文件（获取深度角度和用户视角）
4. `official.md` 的内容保证事实准确性，`insights/` 提供写作角度
5. **查图片素材**：读 `.claude/image-assets.md`，找与文章主题相关的图片；有相关图就在正文对应位置插入 `![描述](/images/<平台>/<文件名>)`；没有合适图片时告知用户
6. **文章草稿完成后，发布前必须用 `proofreading` skill 做一遍审校**，去除 AI 腔，确认数字准确，再交用户确认

## 扩充知识库

新增文件后，必须在 `README.md` 的索引表里追加一行，格式见 `STANDARD.md` 第五节。

---

# 内容获取工具优先级

读取外部内容时，**按以下优先级选工具**，不要默认使用 Playwright MCP 或 WebFetch。

## 知乎文章（zhuanlan.zhihu.com/p/...）

**优先用 fetch-article CLI（已验证有效）：**
```bash
cd .claude/skills/zhihu-skills && source .venv/bin/activate
python scripts/cli.py fetch-article --article-id {文章ID} --output-dir /tmp/zhihu_articles/
```
文章 ID 是 URL 中 `/p/` 后面的数字。

## 知乎问题和回答（zhihu.com/question/...）

**优先用 fetch-answers 或 question-detail CLI：**
```bash
cd .claude/skills/zhihu-skills && source .venv/bin/activate
python scripts/cli.py fetch-answers --question-id {问题ID} --output-dir /tmp/zhihu_answers/
python scripts/cli.py question-detail --question-id {问题ID}
```

## 微信公众号文章（mp.weixin.qq.com）

**优先用 wechat-reader skill（已验证有效）：**
```bash
wechat-article-to-markdown "https://mp.weixin.qq.com/s/..." --output /tmp/wechat_article/
```

## 降级规则

只有当以上专用工具**明确失败**时，才降级到 Playwright MCP 或 WebFetch。不允许跳过专用工具直接用通用工具。