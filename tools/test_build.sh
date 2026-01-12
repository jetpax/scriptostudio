#!/bin/bash
# Test script for build process

set -e

echo "Testing ScriptO Studio registry build process..."
echo ""

# Test 1: Build index.json
echo "1. Building index.json..."
python3 tools/build_index.py \
  --scriptos-dir ScriptOs \
  --extensions-dir Extensions \
  --output test-index.json \
  --repo-url https://github.com/test/test \
  --branch main

if [ -f "test-index.json" ]; then
    echo "✓ index.json created successfully"
    echo "  First 20 lines:"
    head -20 test-index.json
else
    echo "✗ Failed to create index.json"
    exit 1
fi

echo ""
echo "2. Generating ScriptOs HTML catalogue..."
python3 tools/generate_catalogue.py \
  --index test-index.json \
  --output test-catalogue \
  --scriptos-dir ScriptOs

if [ -f "test-catalogue/index.html" ]; then
    echo "✓ ScriptOs catalogue created successfully"
    echo "  File size: $(wc -l < test-catalogue/index.html) lines"
else
    echo "✗ Failed to create ScriptOs catalogue"
    exit 1
fi

echo ""
echo "3. Generating Extensions HTML catalogue..."
python3 tools/generate_extensions_catalogue.py \
  --index test-index.json \
  --output test-extensions-catalogue \
  --extensions-dir Extensions

if [ -f "test-extensions-catalogue/index.html" ]; then
    echo "✓ Extensions catalogue created successfully"
    echo "  File size: $(wc -l < test-extensions-catalogue/index.html) lines"
else
    echo "✗ Failed to create Extensions catalogue"
    exit 1
fi

echo ""
echo "✓ All tests passed!"
echo ""
echo "To clean up test files:"
echo "  rm -rf test-index.json test-catalogue test-extensions-catalogue"

