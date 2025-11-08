#!/usr/bin/env python3
"""
Script to fix resource paths in memorchess's index.html file.
This script converts relative paths to absolute paths starting with /memorchess/
and adds URL cleanup logic.
"""

import re
import sys
from pathlib import Path


def fix_resource_paths(html_content: str) -> str:
    """
    Fix all resource paths in the HTML content to use absolute paths.

    Args:
        html_content: The original HTML content

    Returns:
        The modified HTML content with fixed paths
    """
    # Patterns to match and fix
    patterns = [
        # Match href="something" or src="something" where something doesn't start with / or http
        (r'(href|src)="(?!\/|http)([^"]+)"', r'\1="/memorchess/\2"'),
        # Already fixed paths - leave them as is (this ensures idempotency)
        (r'(href|src)="/memorchess/memorchess/', r'\1="/memorchess/'),
    ]

    result = html_content
    for pattern, replacement in patterns:
        result = re.sub(pattern, replacement, result)

    return result


def add_url_cleanup_script(html_content: str) -> str:
    """
    Add or update the URL cleanup script in the HTML head.

    Args:
        html_content: The HTML content

    Returns:
        The modified HTML content with the cleanup script
    """
    # Check if script already exists
    if 'Remove index.html from URL' in html_content or 'replaceState' in html_content:
        # Script already exists, don't duplicate
        return html_content

    # Find the </head> tag and insert the script before it
    cleanup_script = '''  <script>
    // Remove index.html from URL if present
    if (window.location.pathname.includes('index.html')) {
      const newPath = window.location.pathname.replace(/\\/index\\.html/, '');
      const newUrl = newPath + window.location.hash;
      window.history.replaceState({}, '', newUrl);
    }
  </script>
'''

    # Insert before the last script tag in head, or before </head> if no scripts
    if '<script' in html_content and '</head>' in html_content:
        # Find the position of the last script tag before </head>
        head_end = html_content.find('</head>')
        head_content = html_content[:head_end]

        # Find last script tag in head
        last_script_match = None
        for match in re.finditer(r'<script[^>]*>.*?</script>', head_content, re.DOTALL):
            last_script_match = match

        if last_script_match:
            # Insert after the last script tag
            insert_pos = last_script_match.end()
            result = html_content[:insert_pos] + '\n' + cleanup_script + html_content[insert_pos:]
        else:
            # Insert before </head>
            result = html_content.replace('</head>', cleanup_script + '</head>')
    else:
        # Insert before </head>
        result = html_content.replace('</head>', cleanup_script + '</head>')

    return result


def add_base_tag(html_content: str) -> str:
    """
    Add a base tag to handle dynamically loaded resources (like composeResources).

    Args:
        html_content: The HTML content

    Returns:
        The modified HTML content with the base tag
    """
    # Check if base tag already exists
    if '<base' in html_content:
        # Base tag already exists, don't duplicate
        return html_content

    # Find the <head> tag and insert base tag right after it
    base_tag = '<base href="/memorchess/">'

    # Insert after <head> and before any other tags
    # Find position after opening <head> tag
    head_match = re.search(r'<head[^>]*>\s*', html_content)
    if head_match:
        insert_pos = head_match.end()
        result = html_content[:insert_pos] + '\n  ' + base_tag + html_content[insert_pos:]
        return result

    return html_content


def process_index_html(file_path: Path) -> bool:
    """
    Process the index.html file to fix resource paths.

    Args:
        file_path: Path to the index.html file

    Returns:
        True if successful, False otherwise
    """
    try:
        # Read the file
        print(f"Reading {file_path}...")
        content = file_path.read_text(encoding='utf-8')
        original_content = content

        # Apply fixes
        print("Adding base tag for dynamic resources...")
        content = add_base_tag(content)

        print("Fixing resource paths...")
        content = fix_resource_paths(content)

        print("Adding URL cleanup script...")
        content = add_url_cleanup_script(content)

        # Check if anything changed
        if content == original_content:
            print("No changes needed - file is already correctly formatted.")
            return True

        # Write back to file
        print(f"Writing changes to {file_path}...")
        file_path.write_text(content, encoding='utf-8')

        print("✓ Successfully fixed resource paths in index.html")
        return True

    except FileNotFoundError:
        print(f"Error: File not found: {file_path}", file=sys.stderr)
        return False
    except Exception as e:
        print(f"Error processing file: {e}", file=sys.stderr)
        return False


def main():
    """Main entry point for the script."""
    # Determine the path to index.html
    # Script is in scripts/, index.html is in public/memorchess/
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    index_html_path = project_root / 'public' / 'memorchess' / 'index.html'

    print("=" * 60)
    print("memorchess Resource Path Fixer")
    print("=" * 60)
    print()

    success = process_index_html(index_html_path)

    print()
    print("=" * 60)

    sys.exit(0 if success else 1)


if __name__ == '__main__':
    main()

