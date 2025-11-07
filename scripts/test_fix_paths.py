#!/usr/bin/env python3
"""
Test script for fix_tarotmeter_paths.py
"""

import sys
from pathlib import Path

# Add scripts directory to path
scripts_dir = Path(__file__).parent
sys.path.insert(0, str(scripts_dir))

from fix_tarotmeter_paths import fix_resource_paths, add_url_cleanup_script


def test_fix_resource_paths():
    """Test the fix_resource_paths function."""
    print("Testing fix_resource_paths()...")

    # Test case 1: Simple relative paths
    input_html = '<link rel="stylesheet" href="styles.css">'
    expected = '<link rel="stylesheet" href="/tarotmeter/styles.css">'
    result = fix_resource_paths(input_html)
    assert result == expected, f"Expected: {expected}, Got: {result}"
    print("✓ Test 1 passed: Simple relative path")

    # Test case 2: Script src
    input_html = '<script src="app.js"></script>'
    expected = '<script src="/tarotmeter/app.js"></script>'
    result = fix_resource_paths(input_html)
    assert result == expected, f"Expected: {expected}, Got: {result}"
    print("✓ Test 2 passed: Script src")

    # Test case 3: Already fixed path (idempotent)
    input_html = '<link rel="stylesheet" href="/tarotmeter/styles.css">'
    expected = '<link rel="stylesheet" href="/tarotmeter/styles.css">'
    result = fix_resource_paths(input_html)
    assert result == expected, f"Expected: {expected}, Got: {result}"
    print("✓ Test 3 passed: Idempotent (already fixed)")

    # Test case 4: Nested path
    input_html = '<link rel="icon" href="favicon_io/favicon.png">'
    expected = '<link rel="icon" href="/tarotmeter/favicon_io/favicon.png">'
    result = fix_resource_paths(input_html)
    assert result == expected, f"Expected: {expected}, Got: {result}"
    print("✓ Test 4 passed: Nested path")

    # Test case 5: External URL (should not change)
    input_html = '<script src="https://cdn.example.com/lib.js"></script>'
    expected = '<script src="https://cdn.example.com/lib.js"></script>'
    result = fix_resource_paths(input_html)
    assert result == expected, f"Expected: {expected}, Got: {result}"
    print("✓ Test 5 passed: External URL unchanged")

    print("\n✅ All fix_resource_paths tests passed!\n")


def test_add_url_cleanup_script():
    """Test the add_url_cleanup_script function."""
    print("Testing add_url_cleanup_script()...")

    # Test case 1: Add script to HTML without it
    input_html = '''<html>
<head>
  <title>Test</title>
</head>
<body></body>
</html>'''
    result = add_url_cleanup_script(input_html)
    assert 'replaceState' in result, "Script should be added"
    assert 'index.html' in result, "Script should handle index.html"
    print("✓ Test 1 passed: Script added")

    # Test case 2: Don't duplicate script
    result2 = add_url_cleanup_script(result)
    count = result2.count('replaceState')
    assert count == 1, f"Script should appear only once, found {count} times"
    print("✓ Test 2 passed: Script not duplicated")

    print("\n✅ All add_url_cleanup_script tests passed!\n")


def main():
    """Run all tests."""
    print("=" * 60)
    print("Running TarotMeter Path Fixer Tests")
    print("=" * 60)
    print()

    try:
        test_fix_resource_paths()
        test_add_url_cleanup_script()

        print("=" * 60)
        print("✅ ALL TESTS PASSED!")
        print("=" * 60)
        return 0
    except AssertionError as e:
        print(f"\n❌ TEST FAILED: {e}")
        return 1
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == '__main__':
    sys.exit(main())

