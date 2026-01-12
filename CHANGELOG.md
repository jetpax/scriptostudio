# Changelog

## 2026-01-12 - Registry Documentation & Extensions Catalogue

### Added

- **New README.md**: User-friendly introduction to the registry
  - Clear explanation of ScriptOs vs Extensions
  - Comparison table highlighting key differences
  - Links to both catalogues (ScriptOs and Extensions)
  - Usage instructions for both content types
  - Repository structure and workflow overview

- **docs/CONTRIBUTING.md**: Comprehensive contributor guide
  - Moved technical documentation from old README
  - Step-by-step guides for adding ScriptOs
  - Step-by-step guides for adding Extensions
  - Local development instructions
  - Tag system guidelines
  - Submission guidelines and best practices
  - Code quality requirements

- **tools/generate_extensions_catalogue.py**: Extensions catalogue generator
  - Generates browsable HTML interface for Extensions
  - Main list page with search functionality
  - Individual detail pages for each extension
  - Card-based layout with icons and metadata
  - Shows device-side library information
  - Displays menu/tabs for each extension
  - Installation instructions

### Modified

- **tools/test_build.sh**: Updated to test both catalogues
  - Added Extensions catalogue generation step
  - Updated cleanup instructions

- **.github/workflows/build_and_publish.yml**: Updated CI/CD workflow
  - Added Extensions catalogue generation step
  - Updated commit messages and output URLs
  - Now publishes both catalogues to gh-pages

### Structure

The registry now provides two distinct catalogues:

1. **ScriptOs Catalogue** (`/catalogue/`)
   - Python scripts for device functionality
   - Library-style browsing
   - Tag-based filtering

2. **Extensions Catalogue** (`/extensions-catalogue/`)
   - Full-featured applications
   - Card-based visual layout
   - Shows device library requirements
   - Feature/tab information

### URLs

Once published, the registry provides:
- **Index**: `https://jetpax.github.io/scripto-studio-registry/index.json`
- **ScriptOs Catalogue**: `https://jetpax.github.io/scripto-studio-registry/catalogue/`
- **Extensions Catalogue**: `https://jetpax.github.io/scripto-studio-registry/extensions-catalogue/`
