#!/usr/bin/env python3
"""
Script to fix resource paths in the Insane Lineup wasm app's index.html.
Converts relative paths to absolute paths starting with /insane/, adds a
<base href="/insane/"> tag, and adds URL cleanup logic.
"""

import re
import sys
from pathlib import Path


def fix_resource_paths(html_content: str) -> str:
    """Fix all resource paths in the HTML content to use absolute paths."""
    patterns = [
        # Match href="something" or src="something" where something doesn't start with / or http
        (r'(href|src)="(?!\/|http)([^"]+)"', r'\1="/insane/\2"'),
        # Already-fixed paths — leave them as is (idempotency)
        (r'(href|src)="/insane/insane/', r'\1="/insane/'),
    ]

    result = html_content
    for pattern, replacement in patterns:
        result = re.sub(pattern, replacement, result)

    return result


def add_url_cleanup_script(html_content: str) -> str:
    """Add or update the URL cleanup script in the HTML head."""
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
            result = html_content[:insert_pos] + '\n' + cleanup_script + html_content[insert_pos:]
        else:
            result = html_content.replace('</head>', cleanup_script + '</head>')
    else:
        result = html_content.replace('</head>', cleanup_script + '</head>')

    return result


def add_base_tag(html_content: str) -> str:
    """Add a base tag so dynamically loaded resources resolve under /insane/."""
    if '<base' in html_content:
        return html_content

    base_tag = '<base href="/insane/">'

    head_match = re.search(r'<head[^>]*>\s*', html_content)
    if head_match:
        insert_pos = head_match.end()
        return html_content[:insert_pos] + '\n  ' + base_tag + html_content[insert_pos:]

    return html_content


def process_index_html(file_path: Path) -> bool:
    try:
        print(f"Reading {file_path}...")
        content = file_path.read_text(encoding='utf-8')
        original_content = content

        print("Adding base tag for dynamic resources...")
        content = add_base_tag(content)

        print("Fixing resource paths...")
        content = fix_resource_paths(content)

        print("Adding URL cleanup script...")
        content = add_url_cleanup_script(content)

        if content == original_content:
            print("No changes needed - file is already correctly formatted.")
            return True

        print(f"Writing changes to {file_path}...")
        file_path.write_text(content, encoding='utf-8')

        print("Successfully fixed resource paths in index.html")
        return True

    except FileNotFoundError:
        print(f"Error: File not found: {file_path}", file=sys.stderr)
        return False
    except Exception as e:
        print(f"Error processing file: {e}", file=sys.stderr)
        return False


def main():
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    index_html_path = project_root / 'public' / 'insane' / 'index.html'

    print("=" * 60)
    print("Insane Lineup Resource Path Fixer")
    print("=" * 60)
    print()

    success = process_index_html(index_html_path)

    print()
    print("=" * 60)

    sys.exit(0 if success else 1)


if __name__ == '__main__':
    main()
