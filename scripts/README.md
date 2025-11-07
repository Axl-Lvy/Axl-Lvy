# TarotMeter Path Fixer Script

This script automatically fixes resource paths in the TarotMeter `index.html` file after it's downloaded from the build artifact.

## What it does

1. **Converts relative paths to absolute paths**: 
   - `href="styles.css"` → `href="/tarotmeter/styles.css"`
   - `src="composeApp.js"` → `src="/tarotmeter/composeApp.js"`
   - All favicon and resource paths

2. **Adds URL cleanup script**: Adds a client-side script that removes `index.html` from the URL if present

3. **Idempotent**: Can be run multiple times safely - won't duplicate changes

## Usage

### Manual run (from project root):
```bash
python3 scripts/fix_tarotmeter_paths.py
```

### Automatic run:
The script is automatically executed by the GitHub Actions workflow `.github/workflows/update_tarotmeter.yml` after downloading the TarotMeter artifact.

## How it works

The script uses regex patterns to:
- Match all `href` and `src` attributes with relative paths
- Replace them with absolute paths starting with `/tarotmeter/`
- Avoid double-prefixing paths that are already correct
- Insert the URL cleanup script if not already present

## Robustness

The script is designed to be robust against future changes:
- Uses regex patterns that match any relative path, not specific filenames
- Checks if changes are already applied (idempotent)
- Handles different HTML formatting styles
- Provides clear error messages if something goes wrong
- Safe to run multiple times without side effects

