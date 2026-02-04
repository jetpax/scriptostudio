#!/usr/bin/env python3
"""
Build ScriptOs index.json
Scans ScriptOs directory, parses config blocks, and generates index.json
"""

import json
import os
import re
import time
import glob
from pathlib import Path
from urllib.parse import quote

# Configuration
SCRIPTOS_DIR = 'registry/ScriptOs'
EXTENSIONS_DIR = 'registry/Extensions'
OUTPUT_FILE = 'registry/index.json'
START_MARKER = '# === START_CONFIG_PARAMETERS ==='
END_MARKER = '# === END_CONFIG_PARAMETERS ==='
EXTENSION_START_MARKER = '// === START_EXTENSION_CONFIG ==='
EXTENSION_END_MARKER = '// === END_EXTENSION_CONFIG ==='

def parse_python_dict(content):
    """Parse Python dict syntax to Python dict object"""
    try:
        # Use eval with safe globals to parse the dict
        # This is safe because we control the input (ScriptOs files)
        safe_globals = {
            'dict': dict,
            'str': str,
            'int': int,
            'float': float,
            'bool': bool,
            'list': list,
            'None': None,
            'True': True,
            'False': False,
        }
        return eval(content, safe_globals, {})
    except Exception as e:
        print(f"Warning: Failed to parse dict: {e}")
        return None

def extract_config_block(file_content):
    """Extract config block from ScriptO file"""
    start_idx = file_content.find(START_MARKER)
    end_idx = file_content.find(END_MARKER)
    
    if start_idx == -1 or end_idx == -1:
        return None
    
    # Extract the dict(...) block
    config_block = file_content[start_idx + len(START_MARKER):end_idx].strip()
    
    # Find the dict(...) part
    dict_match = re.search(r'dict\s*\(', config_block)
    if not dict_match:
        return None
    
    # Find matching closing parenthesis - start from 'dict'
    start_pos = dict_match.start()  # Start from 'dict', not just '('
    depth = 0
    in_string = False
    string_char = None
    escaped = False
    in_triple_quote = False
    triple_quote_char = None
    
    i = start_pos
    while i < len(config_block):
        char = config_block[i]
        
        if escaped:
            escaped = False
            i += 1
            continue
        
        if char == '\\':
            escaped = True
            i += 1
            continue
        
        # Check for triple quotes (''' or """)
        if i + 2 < len(config_block):
            triple = config_block[i:i+3]
            if triple in ("'''", '"""'):
                if not in_triple_quote:
                    in_triple_quote = True
                    triple_quote_char = triple
                    i += 3  # Skip the triple quote
                    continue
                elif triple == triple_quote_char:
                    in_triple_quote = False
                    triple_quote_char = None
                    i += 3
                    continue
        
        if in_triple_quote:
            i += 1
            continue
        
        if not in_string and (char == '"' or char == "'"):
            in_string = True
            string_char = char
            i += 1
            continue
        
        if in_string and char == string_char:
            in_string = False
            string_char = None
            i += 1
            continue
        
        if not in_string and not in_triple_quote:
            if char == '(':
                depth += 1
            elif char == ')':
                depth -= 1
                if depth == 0:
                    # Include the full dict(...) call
                    dict_content = config_block[start_pos:i+1]
                    return dict_content
        
        i += 1
    
    return None

def extract_extension_config_block(file_content):
    """Extract config block from Extension .js file"""
    start_idx = file_content.find(EXTENSION_START_MARKER)
    end_idx = file_content.find(EXTENSION_END_MARKER)
    
    if start_idx == -1 or end_idx == -1:
        return None
    
    # Extract the JSON block (between comment markers)
    config_block = file_content[start_idx + len(EXTENSION_START_MARKER):end_idx].strip()
    
    # Remove comment prefixes (//) from each line and filter out empty lines
    lines = []
    for line in config_block.split('\n'):
        line = line.strip()
        if line.startswith('//'):
            line = line[2:].strip()
        # Only add non-empty lines
        if line:
            lines.append(line)
    
    json_content = '\n'.join(lines)
    
    # Find the start of the JSON object/array (skip any non-JSON lines at the beginning)
    json_start = -1
    for i, char in enumerate(json_content):
        if char in '{[':
            json_start = i
            break
    
    if json_start == -1:
        print(f"Warning: No JSON object/array found in extension config")
        return None
    
    json_content = json_content[json_start:]
    
    try:
        return json.loads(json_content)
    except json.JSONDecodeError as e:
        print(f"Warning: Failed to parse extension config JSON: {e}")
        return None

def parse_extension_file(file_path, repo_url=None, branch='main', extensions_base_dir=None):
    """Parse an Extension .js file and extract metadata"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        config = extract_extension_config_block(content)
        if not config:
            print(f"  ⚠ No config block found in {file_path.name}")
            return None
        
        filename = file_path.name
        
        # Determine the extension's directory structure (relative to Extensions/)
        if extensions_base_dir:
            rel_path = file_path.relative_to(extensions_base_dir)
            extension_dir = rel_path.parent
        else:
            extension_dir = Path('.')
        
        # Extract metadata
        name = config.get('name', filename.replace('.js', ''))
        extension_id = config.get('id', name.lower().replace(' ', '-'))
        version = config.get('version', [1, 0, 0])
        author = config.get('author', '')
        description = config.get('description', '')
        icon = config.get('icon', 'sliders')
        menu = config.get('menu', [])
        mip_package = config.get('mipPackage', None)
        # Note: styles are not extracted for index.json (loaded from full .app.js instead)
        
        # Generate URL for main extension file
        if repo_url:
            # GitHub raw URL
            if 'raw.githubusercontent.com' in repo_url:
                url = f"{repo_url}/{branch}/registry/Extensions/{str(rel_path).replace(os.sep, '/')}"
            else:
                url = f"{repo_url}/raw/{branch}/registry/Extensions/{str(rel_path).replace(os.sep, '/')}"
        else:
            url = f"/registry/Extensions/{str(rel_path).replace(os.sep, '/')}"
        
        # Build Extension entry
        # Note: styles are excluded from index.json as they're unused
        # The actual CSS is loaded from the full .js file when the extension is installed
        extension_entry = {
            "name": name,
            "id": extension_id,
            "filename": filename,
            "version": version,
            "author": author,
            "description": description,
            "icon": icon,
            "menu": menu,
            "url": url
        }
        
        # Add mipPackage if specified
        if mip_package:
            extension_entry["mipPackage"] = mip_package
        
        return extension_entry
        
    except Exception as e:
        print(f"  ✗ Error parsing {file_path.name}: {e}")
        import traceback
        traceback.print_exc()
        return None


def parse_scripto_file(file_path, repo_url=None, branch='main'):
    """Parse a ScriptO file and extract metadata"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        config_block = extract_config_block(content)
        if not config_block:
            print(f"  ⚠ No config block found in {file_path.name}")
            return None
        
        config = parse_python_dict(config_block)
        if not config or 'info' not in config:
            print(f"  ⚠ Invalid config in {file_path.name}")
            return None
        
        info = config.get('info', {})
        filename = file_path.name
        
        # Extract metadata
        name = info.get('name', filename.replace('.py', ''))
        version = info.get('version', [1, 0, 0])
        author = info.get('author', '')
        description = info.get('description', '')
        category = info.get('category', '')
        www = info.get('www', '')
        
        # Extract new fields for converted libraries
        tags_from_info = info.get('tags', [])
        source_url = info.get('source_url', None)
        source_repo = info.get('source_repo', None)
        upstream_version = info.get('upstream_version', None)
        license_type = info.get('license', 'MIT')
        
        # Build tags list (merge category and explicit tags)
        tags = []
        if category:
            tags.append(category.lower())
        if isinstance(tags_from_info, list):
            tags.extend([t.lower() for t in tags_from_info if t.lower() not in tags])
        elif isinstance(tags_from_info, str):
            if tags_from_info.lower() not in tags:
                tags.append(tags_from_info.lower())
        
        # Generate URL
        if repo_url:
            # GitHub raw URL - always use ScriptOs/filename format
            # repo_url should already be raw.githubusercontent.com format
            if 'raw.githubusercontent.com' in repo_url:
                url = f"{repo_url}/{branch}/registry/ScriptOs/{quote(filename)}"
            else:
                # Fallback for other formats
                url = f"{repo_url}/raw/{branch}/registry/ScriptOs/{quote(filename)}"
        else:
            # Relative URL
            url = f"/registry/ScriptOs/{quote(filename)}"
        
        # Build ScriptO entry
        scripto_entry = {
            "name": name,
            "filename": filename,
            "version": version,
            "author": author,
            "description": description,
            "category": category if category else None,
            "tags": tags if tags else None,
            "license": license_type,
            "source_url": source_url,
            "source_repo": source_repo,
            "upstream_version": upstream_version,
            "docs": www if www else None,
            "url": url
        }
        
        # Remove None values
        scripto_entry = {k: v for k, v in scripto_entry.items() if v is not None}
        
        return scripto_entry
        
    except Exception as e:
        print(f"  ✗ Error parsing {file_path.name}: {e}")
        return None

def build_index(scriptos_dir=SCRIPTOS_DIR, extensions_dir=EXTENSIONS_DIR, output_file=OUTPUT_FILE, repo_url=None, branch='main'):
    """Build index.json from ScriptOs and Extensions directories"""
    scriptos_path = Path(scriptos_dir)
    extensions_path = Path(extensions_dir)
    
    if not scriptos_path.exists():
        print(f"Error: ScriptOs directory not found: {scriptos_dir}")
        return False
    
    # Scan ScriptOs
    print(f"Scanning {scriptos_dir}...")
    py_files = list(scriptos_path.glob('*.py'))
    
    if not py_files:
        print(f"No .py files found in {scriptos_dir}")
        return False
    
    print(f"Found {len(py_files)} ScriptO files")
    
    scriptos = []
    for py_file in sorted(py_files):
        print(f"Processing {py_file.name}...")
        entry = parse_scripto_file(py_file, repo_url, branch)
        if entry:
            scriptos.append(entry)
    
    # Scan Extensions (look for extension.json files in subdirectories)
    extensions = []
    if extensions_path.exists():
        print(f"\nScanning {extensions_dir}...")
        # Search for extension.json files in subdirectories
        extension_configs = list(extensions_path.glob('*/extension.json'))
        
        if extension_configs:
            print(f"Found {len(extension_configs)} Extension(s)")
            
            for config_file in sorted(extension_configs):
                ext_dir = config_file.parent
                ext_name = ext_dir.name
                print(f"Processing {ext_name}...")
                
                try:
                    with open(config_file, 'r', encoding='utf-8') as f:
                        config = json.load(f)
                    
                    # Extract metadata from extension.json
                    name = config.get('name', ext_name)
                    extension_id = config.get('id', name.lower().replace(' ', '-'))
                    version = config.get('version', [1, 0, 0])
                    author = config.get('author', '')
                    description = config.get('description', '')
                    icon = config.get('icon', 'sliders')
                    icon_svg = config.get('iconSvg', None)
                    menu = config.get('menu', [])
                    
                    # Generate URL for bundle file
                    bundle_filename = f"{extension_id}.bundle.js"
                    if repo_url:
                        if 'raw.githubusercontent.com' in repo_url:
                            url = f"{repo_url}/{branch}/registry/Extensions/{ext_name}/{bundle_filename}"
                        else:
                            url = f"{repo_url}/raw/{branch}/registry/Extensions/{ext_name}/{bundle_filename}"
                    else:
                        url = f"/registry/Extensions/{ext_name}/{bundle_filename}"
                    
                    # Build Extension entry
                    extension_entry = {
                        "name": name,
                        "id": extension_id,
                        "filename": bundle_filename,
                        "version": version,
                        "author": author,
                        "description": description,
                        "icon": icon,
                        "menu": menu,
                        "url": url
                    }
                    
                    # Add iconSvg if present
                    if icon_svg:
                        extension_entry["iconSvg"] = icon_svg
                    
                    extensions.append(extension_entry)
                    
                except Exception as e:
                    print(f"  ✗ Error parsing {config_file}: {e}")
        else:
            print(f"No extension.json files found in {extensions_dir}")
    
    # Build index
    index = {
        "v": 1,
        "updated": int(time.time()),
        "scriptos": scriptos,
        "extensions": extensions
    }
    
    # Write index.json
    output_path = Path(output_file)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(index, f, indent=2, ensure_ascii=False)
    
    print(f"\n✓ Generated {output_file} with {len(scriptos)} ScriptOs and {len(extensions)} Extensions")
    return True

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Build ScriptOs and Extensions index.json')
    parser.add_argument('--scriptos-dir', default=SCRIPTOS_DIR, help='ScriptOs directory')
    parser.add_argument('--extensions-dir', default=EXTENSIONS_DIR, help='Extensions directory')
    parser.add_argument('--output', default=OUTPUT_FILE, help='Output index.json file')
    parser.add_argument('--repo-url', help='GitHub repository URL (e.g., https://github.com/user/repo)')
    parser.add_argument('--branch', default='main', help='Git branch name')
    
    args = parser.parse_args()
    
    # Convert repo URL to raw.githubusercontent.com format if needed
    repo_url = args.repo_url
    if repo_url and 'github.com' in repo_url:
        # Convert https://github.com/user/repo to https://raw.githubusercontent.com/user/repo
        if 'raw.githubusercontent.com' not in repo_url:
            repo_url = repo_url.replace('github.com', 'raw.githubusercontent.com')
        # Remove any duplicate /raw/ in the path
        repo_url = repo_url.replace('/raw/raw/', '/raw/')
    
    success = build_index(args.scriptos_dir, args.extensions_dir, args.output, repo_url, args.branch)
    exit(0 if success else 1)

if __name__ == '__main__':
    main()
