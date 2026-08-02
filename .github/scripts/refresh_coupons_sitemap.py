#!/usr/bin/env python3
"""
用 git 提交时间重写 coupons sitemap 的 lastmod。

背景：static/coupons/sitemap.xml 是手写的，lastmod 长期不更新
（比如 meituan 停在 2026-03-13，而 coupons.json 天天在改）。
推送 Action 按「近 2 天更新」筛 URL，日期不动这些页面就永远不会被推送。

所以构建后按每个类目目录的最后一次 git 提交时间重算 lastmod，
写进 public/ 里待部署的那份（不改仓库里的源文件）。

用法：python3 .github/scripts/refresh_coupons_sitemap.py public/coupons/sitemap.xml
"""
import re
import subprocess
import sys
from pathlib import Path

SITE = "https://www.shenquanquan.com/coupons/"

# /coupons/ 首页由这些文件决定，任意一个变了都算首页更新
ROOT_DEPS = [
    "static/coupons/index.html",
    "static/coupons/platforms.json",
    "static/coupons/coupon-renderer.js",
    "static/coupons/script.js",
    "static/coupons/style.css",
]


def last_commit_date(paths):
    """取这些路径里最后一次提交的日期（YYYY-MM-DD），全都没有记录则返回 None。"""
    existing = [p for p in paths if Path(p).exists()]
    if not existing:
        return None
    out = subprocess.run(
        ["git", "log", "-1", "--format=%cs", "--"] + existing,
        capture_output=True, text=True,
    )
    return out.stdout.strip() or None


def resolve(loc):
    """把 sitemap 里的 URL 映射到仓库路径。"""
    if loc.rstrip("/") == SITE.rstrip("/"):
        return ROOT_DEPS
    slug = loc[len(SITE):].strip("/")
    return [f"static/coupons/{slug}"] if slug else []


def main(path):
    p = Path(path)
    xml = p.read_text(encoding="utf-8")
    changed = 0

    def repl(m):
        nonlocal changed
        loc, old = m.group("loc"), m.group("date")
        new = last_commit_date(resolve(loc))
        if not new or new == old:
            return m.group(0)
        changed += 1
        print(f"  {loc}  {old} → {new}")
        return m.group(0).replace(
            f"<lastmod>{old}</lastmod>", f"<lastmod>{new}</lastmod>"
        )

    xml = re.sub(
        r"<loc>(?P<loc>[^<]+)</loc>\s*<lastmod>(?P<date>[^<]+)</lastmod>",
        repl, xml,
    )

    p.write_text(xml, encoding="utf-8")
    print(f"coupons sitemap：更新 {changed} 条 lastmod")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "public/coupons/sitemap.xml")
