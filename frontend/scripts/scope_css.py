#!/usr/bin/env python3
"""Extract the <style> block from a page HTML and scope every content rule under a
wrapper class (e.g. .page-solutions) so it can't collide with the shared global.css.
Drops :root / html / body / * reset rules (the shared design system covers those).
Usage: python3 scope_css.py <page.html> <.page-scope> <out.css>
"""
import re, sys

def scope_css(css, scope):
    css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
    def split_top(s):
        blocks, depth, buf = [], 0, ''
        for ch in s:
            buf += ch
            if ch == '{': depth += 1
            elif ch == '}':
                depth -= 1
                if depth == 0:
                    blocks.append(buf); buf = ''
        if buf.strip(): blocks.append(buf)
        return blocks
    def scope_selector(sel):
        out = []
        for p in (x.strip() for x in sel.split(',')):
            if not p: continue
            low = p.lower()
            if low in (':root', '*') or low.startswith('html') or low.startswith('body'):
                continue
            m = re.match(r'^(\[data-theme[^\]]*\])\s*(.*)$', p)
            if m:
                rest = m.group(2).strip()
                out.append(m.group(1) + ' ' + scope + ((' ' + rest) if rest else ''))
            else:
                out.append(scope + ' ' + p)
        return ', '.join(out) if out else None
    res = []
    for blk in split_top(css):
        bm = re.match(r'^\s*(@[\w-]+)', blk)
        if bm:
            at = bm.group(1).lower()
            if at in ('@media', '@supports'):
                hm = re.match(r'^\s*(@[^{]+)\{(.*)\}\s*$', blk, flags=re.S)
                if hm:
                    inner = ''
                    for sel, body in re.findall(r'([^{}]+)\{([^{}]*)\}', hm.group(2)):
                        ss = scope_selector(sel)
                        if ss: inner += ss + '{' + body.strip() + '}'
                    if inner: res.append(hm.group(1).strip() + '{' + inner + '}')
            else:
                res.append(blk.strip())  # @keyframes / @font-face etc. kept as-is
        else:
            m = re.match(r'^([^{]+)\{(.*)\}\s*$', blk, flags=re.S)
            if m:
                ss = scope_selector(m.group(1))
                if ss: res.append(ss + '{' + m.group(2).strip() + '}')
    return '\n'.join(res)

if __name__ == '__main__':
    page, scope, out = sys.argv[1], sys.argv[2], sys.argv[3]
    html = open(page).read()
    m = re.search(r'<style>(.*?)</style>', html, flags=re.S)
    css = m.group(1) if m else ''
    css = css.replace("url('assets/", "url('/assets/").replace('url("assets/', 'url("/assets/')
    open(out, 'w').write(scope_css(css, scope))
    print('scoped %d chars -> %s' % (len(css), out))
