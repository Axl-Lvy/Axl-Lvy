#!/usr/bin/env python3
"""
Rewrite resource paths in public/rain/index.html so the vendored Kotlin/Wasm
bundle resolves against /rain/ when served from axl-lvy.fr/rain.

Mirrors scripts/fix_memorchess_paths.py — same three transformations:
  1. Inject <base href="/rain/"> so Compose's dynamically loaded resources
     (composeResources/*) resolve correctly.
  2. Rewrite href="x"/src="x" relative paths to absolute /rain/x form
     (no-op for paths that already start with /rain/ or http).
  3. Insert a tiny client-side script that strips a trailing /index.html
     from the URL bar after load, so the visible URL stays clean.
"""

import re
import sys
from pathlib import Path


def fix_resource_paths(html_content: str) -> str:
    patterns = [
        (r'(href|src)="(?!\/|http)([^"]+)"', r'\1="/rain/\2"'),
        # idempotency: collapse accidental /rain/rain/ if the script runs twice
        (r'(href|src)="/rain/rain/', r'\1="/rain/'),
    ]
    result = html_content
    for pattern, replacement in patterns:
        result = re.sub(pattern, replacement, result)
    return result


def add_url_cleanup_script(html_content: str) -> str:
    if 'Remove index.html from URL' in html_content or 'replaceState' in html_content:
        return html_content

    cleanup_script = '''  <script>
    // Remove index.html from URL if present
    if (window.location.pathname.includes('index.html')) {
      const newPath = window.location.pathname.replace(/\\/index\\.html/, '');
      const newUrl = newPath + window.location.hash;
      window.history.replaceState({}, '', newUrl);
    }
  </script>
'''

    if '<script' in html_content and '</head>' in html_content:
        head_end = html_content.find('</head>')
        head_content = html_content[:head_end]
        last_script_match = None
        for match in re.finditer(r'<script[^>]*>.*?</script>', head_content, re.DOTALL):
            last_script_match = match
        if last_script_match:
            insert_pos = last_script_match.end()
            return html_content[:insert_pos] + '\n' + cleanup_script + html_content[insert_pos:]
        return html_content.replace('</head>', cleanup_script + '</head>')
    return html_content.replace('</head>', cleanup_script + '</head>')


def add_base_tag(html_content: str) -> str:
    if '<base' in html_content:
        return html_content
    base_tag = '<base href="/rain/">'
    head_match = re.search(r'<head[^>]*>\s*', html_content)
    if head_match:
        insert_pos = head_match.end()
        return html_content[:insert_pos] + '\n  ' + base_tag + html_content[insert_pos:]
    return html_content


def process_index_html(file_path: Path) -> bool:
    try:
        print(f"Reading {file_path}...")
        content = file_path.read_text(encoding='utf-8')
        original = content

        print("Adding base tag for dynamic resources...")
        content = add_base_tag(content)
        print("Fixing resource paths...")
        content = fix_resource_paths(content)
        print("Adding URL cleanup script...")
        content = add_url_cleanup_script(content)

        if content == original:
            print("No changes needed.")
            return True

        print(f"Writing changes to {file_path}...")
        file_path.write_text(content, encoding='utf-8')
        print("✓ Fixed paths in index.html")
        return True
    except FileNotFoundError:
        print(f"Error: file not found: {file_path}", file=sys.stderr)
        return False
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        return False


def main():
    project_root = Path(__file__).parent.parent
    index_html = project_root / 'public' / 'rain' / 'index.html'
    print("=" * 60)
    print("rain Resource Path Fixer")
    print("=" * 60)
    print()
    ok = process_index_html(index_html)
    print()
    print("=" * 60)
    sys.exit(0 if ok else 1)


if __name__ == '__main__':
    main()
