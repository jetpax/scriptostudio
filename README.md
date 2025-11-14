# ScriptO Registry

A browsable registry of ScriptOs and Apps for ScriptO Studio.

## Structure

- `ScriptOs/` - Source ScriptO files (`.py` files with config blocks)
- `tools/build_index.py` - Build script that generates `index.json`
- `tools/generate_catalogue.py` - Generates browsable HTML catalogue
- `.github/workflows/build_and_publish.yml` - GitHub Actions workflow

## How It Works

1. **Build Process**: When you push to `main`, GitHub Actions automatically:
   - Scans the `ScriptOs/` directory
   - Parses config blocks from each ScriptO file
   - Generates `index.json` with metadata
   - Creates a browsable HTML catalogue
   - Publishes everything to the `gh-pages` branch

2. **Index Format**: The `index.json` follows this structure:
   ```json
   {
     "v": 1,
     "updated": 1234567890,
     "scriptos": [
       {
         "name": "ScriptO Name",
         "filename": "scripto.py",
         "version": [1, 0, 0],
         "author": "Author Name",
         "description": "Description text",
         "tags": ["Category"],
         "license": "MIT",
         "docs": "https://...",
         "url": "https://raw.githubusercontent.com/..."
       }
     ]
   }
   ```

3. **Installation**: ScriptOs can be installed via URL:
   ```
   ?install=github:jetpax/scripto-studio-registry/ScriptOs/Name.py
   ```

## Local Development

To test the build process locally:

```bash
# Build index.json
python3 tools/build_index.py \
  --scriptos-dir ScriptOs \
  --output index.json \
  --repo-url https://github.com/jetpax/scripto-studio-registry \
  --branch main

# Generate HTML catalogue
python3 tools/generate_catalogue.py \
  --index index.json \
  --output catalogue \
  --scriptos-dir ScriptOs
```

Or use the test script:
```bash
./tools/test_build.sh
```

## Adding ScriptOs

### Manual Addition

1. Add your `.py` file to the `ScriptOs/` directory
2. Ensure it has a config block between:
   ```python
   # === START_CONFIG_PARAMETERS ===
   dict(
       info = dict(
           name = 'Your ScriptO Name',
           version = [1, 0, 0],
           description = 'Description here',
           category = 'Category',
           author = 'Your Name',
           www = 'https://...',  # Optional
           tags = ['tag1', 'tag2'],  # Optional
           license = 'MIT',  # Optional, defaults to MIT
           source_url = 'https://...',  # Optional (for converted libraries)
           source_repo = 'owner/repo',  # Optional (for converted libraries)
           upstream_version = '1.2.3'  # Optional (for converted libraries)
       ),
       ...
   )
   # === END_CONFIG_PARAMETERS ===
   ```
3. Commit and push - the registry will auto-update!

### Converting from Awesome MicroPython

To convert libraries from [Awesome MicroPython](https://awesome-micropython.com/):

```bash
cd tools
python3 convert_awesome_mp.py
```

The converter will:
- Fetch library metadata from GitHub
- Extract README description and license
- Generate proper ScriptO config block
- Add source tracking fields (`source_url`, `source_repo`, `upstream_version`)
- Tag with `untested` and `awesome-micropython`
- Use Awesome MicroPython categories as tags
- Output converted file to `ScriptOs/` directory

**Example:**
```bash
python3 convert_awesome_mp.py
# Enter repo URL: https://github.com/adafruit/Adafruit_CircuitPython_SSD1306
# Enter category: Display
```

**Checking for Updates:**
```bash
python3 check_updates.py  # Check all converted libraries
python3 check_updates.py --update-available  # Show only outdated
```

**Tag System:**
- `untested` - Library hasn't been tested on hardware yet
- `awesome-micropython` - Converted from Awesome MicroPython
- Category tags (e.g., `display`, `sensor`, `communications`)
- Custom tags from ScriptO config

## Accessing the Registry

Once published, the registry will be available at:
- **Index**: `https://jetpax.github.io/scripto-studio-registry/index.json`
- **Catalogue**: `https://jetpax.github.io/scripto-studio-registry/catalogue/`

## License

ScriptOs in this registry maintain their individual licenses. The registry infrastructure is MIT licensed.


