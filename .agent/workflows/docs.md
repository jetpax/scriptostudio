---
description: Documentation workflow for MkDocs
---

# Documentation Workflow

## Editing Documentation

1. Make changes to files in `docs-src/`
2. Commit and push `docs-src/` changes only
3. CI will automatically build `docs/` and commit it

## IMPORTANT: Do NOT run `mkdocs build` locally

The `docs/` folder is built by GitHub Actions (`.github/workflows/docs.yml`).
Running `mkdocs build` locally will cause git conflicts because:
- Local build has different asset hashes
- CI commits its own build after your push
- Your local `docs/` diverges from remote

## Local Preview

For local preview, use one of these options:

**Option 1: Live server (recommended)**
```bash
mkdocs serve
```
Runs a dev server at `http://localhost:8000` - no files written.

**Option 2: Build to local directory**
```bash
mkdocs build -d docs-local
```
Builds to `docs-local/` which is gitignored.

## Files

- `docs-src/` - Source markdown files (EDIT THESE)
- `docs/` - Built output (DO NOT EDIT, CI builds this)
- `mkdocs.yml` - MkDocs configuration
