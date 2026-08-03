#!/usr/bin/env python3
"""
给优惠券子站的 css/js 引用加内容 hash 查询串，解决缓存不更新。

背景：Nginx 对 css/js 设了 expires 7d，而 static/coupons/ 下的
style.css、landing.css、script.js、coupon-renderer.js 都是裸引用，
没有版本标识。改了样式之后，老用户最长 7 天拿到的还是旧文件，
出现「新 HTML + 旧 CSS」的错位（2026-08-03 品牌条不显示就是这个原因）。

Hugo 主题自己的资源已经带内容 hash（stylesheet.<sha256>.css），
不受影响，所以只处理 public/coupons/ 下的静态页。

做法：把 href="style.css" 改写成 href="style.css?v=<内容前8位hash>"。
内容变了 URL 就变，缓存自动失效；内容没变则继续命中缓存。

用法：python3 .github/scripts/add_asset_hash.py public/coupons
"""
import hashlib
import re
import sys
from pathlib import Path

ASSET_RE = re.compile(r'(?P<attr>href|src)="(?P<path>[^"?#]+\.(?:css|js))"')


def main(root):
    root = Path(root)
    if not root.is_dir():
        print(f"目录不存在：{root}", file=sys.stderr)
        return 1

    hashes = {}          # 解析后的绝对路径 -> hash，避免重复读文件
    changed = missing = 0

    for html in sorted(root.rglob("*.html")):
        text = html.read_text(encoding="utf-8")

        def repl(m):
            nonlocal changed, missing
            rel = m.group("path")
            target = (html.parent / rel).resolve()
            if target not in hashes:
                if not target.is_file():
                    hashes[target] = None
                else:
                    digest = hashlib.md5(target.read_bytes()).hexdigest()[:8]
                    hashes[target] = digest
            h = hashes[target]
            if h is None:
                missing += 1
                print(f"  ⚠️ 找不到 {rel}（引用自 {html.relative_to(root)}）")
                return m.group(0)
            changed += 1
            return f'{m.group("attr")}="{rel}?v={h}"'

        new = ASSET_RE.sub(repl, text)
        if new != text:
            html.write_text(new, encoding="utf-8")

    uniq = {p.name: h for p, h in hashes.items() if h}
    print(f"资源版本号：改写 {changed} 处引用，涉及 {len(uniq)} 个文件")
    for name, h in sorted(uniq.items()):
        print(f"  {name}?v={h}")
    if missing:
        print(f"⚠️ 有 {missing} 处引用找不到目标文件")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else "public/coupons"))
