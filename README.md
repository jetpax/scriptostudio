# ScriptOs Registry

A browsable registry of ScriptOs for MicroPython, automatically built and published to GitHub Pages.

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
           www = 'https://...'  # Optional
       ),
       ...
   )
   # === END_CONFIG_PARAMETERS ===
   ```
3. Commit and push - the registry will auto-update!

## Accessing the Registry

Once published, the registry will be available at:
- **Index**: `https://jetpax.github.io/scripto-studio-registry/index.json`
- **Catalogue**: `https://jetpax.github.io/scripto-studio-registry/catalogue/`

## License

ScriptOs in this registry maintain their individual licenses. The registry infrastructure is MIT licensed.


