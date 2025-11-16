# ScriptO Registry

A browsable registry of ScriptOs for MicroPython, automatically built and published to GitHub Pages.

## Structure

- `ScriptOs/` - Source ScriptO files (`.py` files with config blocks)
- `tools/build_index.py` - Build script that generates `index.json`
- `tools/generate_catalogue.py` - Generates browsable HTML catalogue
- `.github/workflows/build_and_publish.yml` - GitHub Actions workflow

## Usage

### Building Locally

```bash
# Generate index.json
python3 tools/build_index.py \
  --scriptos-dir ScriptOs \
  --output index.json \
  --repo-url https://github.com/USERNAME/REPO \
  --branch main

# Generate HTML catalogue
python3 tools/generate_catalogue.py \
  --index index.json \
  --output catalogue \
  --scriptos-dir ScriptOs
```

### Installing ScriptOs

Once published, ScriptOs can be installed via URL:

```
?install=github:USERNAME/REPO/ScriptOs/Name.py
```

Or browse the catalogue at:
```
https://USERNAME.github.io/REPO/catalogue/
```

## Index Format

The `index.json` file contains:

```json
{
  "v": 1,
  "updated": 1234567890,
  "scriptos": [
    {
      "name": "ScriptO Name",
      "filename": "ScriptO.py",
      "version": [1, 0, 0],
      "author": "Author Name",
      "description": "Description",
      "category": "Category",
      "tags": ["tag1", "tag2"],
      "license": "MIT",
      "source_url": "https://...",
      "source_repo": "owner/repo",
      "upstream_version": "1.2.3",
      "docs": "https://...",
      "url": "https://raw.githubusercontent.com/..."
    }
  ]
}
```

**Extended Fields for Converted Libraries:**
- `source_url` - Original library URL
- `source_repo` - GitHub repository (owner/repo)
- `upstream_version` - Latest version from source
- `tags` - Includes category + custom tags + `untested` 

## Adding ScriptOs

### Manual Addition

1. Add your `.py` file to the `ScriptOs/` directory
2. Ensure it has a config block between `# === START_CONFIG_PARAMETERS ===` and `# === END_CONFIG_PARAMETERS ===`
3. Push to GitHub - the workflow will automatically build and publish

### Automated Conversion

Use the conversion tool to import libraries from Awesome MicroPython:

```bash
cd tools
python3 convert_awesome_mp.py
```

**Interactive Mode:**
```bash
$ python3 convert_awesome_mp.py
Enter GitHub repository URL: https://github.com/adafruit/Adafruit_CircuitPython_SSD1306
Enter category (e.g., Display, Sensor, Communications): Display
```

**Batch Mode:**
```python
# Create a list of repos to convert
repos = [
    ("https://github.com/adafruit/Adafruit_CircuitPython_SSD1306", "Display"),
    ("https://github.com/peterhinch/micropython-mqtt", "Communications"),
]

# Run converter
for url, category in repos:
    # Manual or scripted conversion
    pass
```

**Update Checking:**
```bash
# Check all converted libraries for updates
python3 check_updates.py

# Show only libraries with updates available
python3 check_updates.py --update-available
```

## GitHub Pages

The registry is automatically published to the `gh-pages` branch on every push. Enable GitHub Pages in repository settings to make it accessible.

