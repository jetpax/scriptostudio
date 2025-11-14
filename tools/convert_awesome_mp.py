#!/usr/bin/env python3
"""
Convert Awesome MicroPython Libraries to ScriptO Format
========================================================

This tool automatically converts MicroPython libraries from GitHub repositories
into ScriptO format, adding proper config blocks and tracking upstream sources.

Usage:
    python3 convert_awesome_mp.py --url <github-url> [--output-dir ScriptOs]
    python3 convert_awesome_mp.py --batch libraries_list.txt
    python3 convert_awesome_mp.py --awesome-url <url> --category Sensors

Features:
- Fetches library from GitHub
- Detects main Python file
- Generates ScriptO config block
- Preserves license and adds attribution
- Tags with "untested" and category tags
"""

import os
import sys
import re
import json
import argparse
import requests
from pathlib import Path
from urllib.parse import urlparse
import base64

# GitHub API base URL
GITHUB_API = "https://api.github.com"

# Config block template
CONFIG_TEMPLATE = """
# === START_CONFIG_PARAMETERS ===

dict(
    
    timeout = 0,  # No interrupt button by default for libraries
    
    info    = dict(
        name        = '{name}',
        version     = [1, 0, 0],  # Initial ScriptO version
        category    = '{category}',
        description = '''{description}''',
        author      = '{author}',
        tags        = {tags},
        source_url  = '{source_url}',
        source_repo = '{source_repo}',
        upstream_version = '{upstream_version}',
        license     = '{license}'
    ),
    
    args    = dict(
        # Add library-specific arguments here if needed
    )
)

# === END_CONFIG_PARAMETERS ===

# Converted from: {source_url}
# Original author: {author}
# Original license: {license}
# 
# This library has been converted to ScriptO format for use with Scripto Studio.
# Tagged as "untested" - please test and report issues at:
# https://github.com/jetpax/scripto-studio-registry/issues

"""

def parse_github_url(url):
    """Extract owner and repo from GitHub URL"""
    # Handle various GitHub URL formats
    patterns = [
        r'github\.com/([^/]+)/([^/]+?)(?:\.git)?$',  # https://github.com/owner/repo or .git
        r'github\.com/([^/]+)/([^/]+)/tree',  # https://github.com/owner/repo/tree/...
        r'github\.com/([^/]+)/([^/]+)/blob',  # https://github.com/owner/repo/blob/...
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            owner, repo = match.groups()
            # Remove .git suffix if present
            repo = repo.replace('.git', '')
            return owner, repo
    
    raise ValueError(f"Could not parse GitHub URL: {url}")


def get_github_api_headers():
    """Get headers for GitHub API requests with token if available"""
    headers = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'ScriptO-Converter/1.0'
    }
    
    # Check for GitHub token in environment
    token = os.environ.get('GITHUB_TOKEN')
    if token:
        headers['Authorization'] = f'token {token}'
        print("[GitHub API] Using authenticated requests")
    else:
        print("[GitHub API] No GITHUB_TOKEN found, using unauthenticated requests (lower rate limit)")
    
    return headers


def fetch_repo_info(owner, repo):
    """Fetch repository information from GitHub API"""
    url = f"{GITHUB_API}/repos/{owner}/{repo}"
    response = requests.get(url, headers=get_github_api_headers())
    
    if response.status_code == 404:
        raise ValueError(f"Repository not found: {owner}/{repo}")
    elif response.status_code != 200:
        raise ValueError(f"GitHub API error: {response.status_code} - {response.text}")
    
    return response.json()


def fetch_repo_readme(owner, repo):
    """Fetch README content from GitHub"""
    url = f"{GITHUB_API}/repos/{owner}/{repo}/readme"
    response = requests.get(url, headers=get_github_api_headers())
    
    if response.status_code == 200:
        readme_data = response.json()
        # README is base64 encoded
        content = base64.b64decode(readme_data['content']).decode('utf-8')
        return content
    
    return None


def detect_license(owner, repo):
    """Detect license from GitHub API"""
    url = f"{GITHUB_API}/repos/{owner}/{repo}/license"""
    response = requests.get(url, headers=get_github_api_headers())
    
    if response.status_code == 200:
        license_data = response.json()
        return license_data.get('license', {}).get('spdx_id', 'Unknown')
    
    return 'Unknown'


def fetch_repo_contents(owner, repo, path=''):
    """Fetch repository contents (file listing)"""
    url = f"{GITHUB_API}/repos/{owner}/{repo}/contents/{path}"
    response = requests.get(url, headers=get_github_api_headers())
    
    if response.status_code == 200:
        return response.json()
    
    return []


def find_main_python_file(owner, repo):
    """Find the main Python file in the repository"""
    contents = fetch_repo_contents(owner, repo)
    
    # Look for common main file patterns
    priorities = [
        # Exact matches (highest priority)
        lambda f: f['name'].endswith('.py') and f['name'].lower() in ['__init__.py', 'main.py'],
        # Repo name match
        lambda f: f['name'].endswith('.py') and repo.lower().replace('-', '_') in f['name'].lower(),
        # Any Python file (lowest priority)
        lambda f: f['name'].endswith('.py') and not f['name'].startswith('test') and not f['name'].startswith('example'),
    ]
    
    for priority_func in priorities:
        candidates = [f for f in contents if f['type'] == 'file' and priority_func(f)]
        if candidates:
            return candidates[0]
    
    # No suitable file found
    return None


def fetch_file_content(file_info):
    """Fetch file content from GitHub"""
    if file_info['encoding'] == 'base64':
        content = base64.b64decode(file_info['content']).decode('utf-8')
        return content
    else:
        # Fetch via download_url
        response = requests.get(file_info['download_url'])
        if response.status_code == 200:
            return response.text
    
    return None


def extract_description_from_readme(readme_content, repo_name):
    """Extract a meaningful description from README"""
    if not readme_content:
        return f"MicroPython library for {repo_name}"
    
    # Try to find first paragraph after title
    lines = readme_content.split('\n')
    description_lines = []
    skip_title = True
    
    for line in lines:
        line = line.strip()
        # Skip title lines (# or ===)
        if skip_title and (line.startswith('#') or line.startswith('=')):
            continue
        skip_title = False
        
        # Skip empty lines
        if not line:
            if description_lines:
                break
            continue
        
        # Skip badges and images
        if line.startswith('!') or line.startswith('[!'):
            continue
        
        # Add line to description
        description_lines.append(line)
        
        # Stop after first meaningful paragraph
        if len(' '.join(description_lines)) > 100:
            break
    
    description = ' '.join(description_lines)
    
    # Clean up markdown
    description = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', description)  # Remove links
    description = re.sub(r'[*_`]', '', description)  # Remove formatting
    description = description.strip()
    
    if not description:
        description = f"MicroPython library for {repo_name}"
    
    # Limit to reasonable length
    if len(description) > 300:
        description = description[:297] + '...'
    
    return description


def categorize_library(repo_name, description, readme_content):
    """Attempt to categorize the library based on content"""
    text = (repo_name + ' ' + description + ' ' + (readme_content or '')).lower()
    
    # Category keywords
    categories = {
        'Sensors': ['sensor', 'temperature', 'humidity', 'pressure', 'bme280', 'dht', 'accelerometer', 'gyro'],
        'Display': ['display', 'lcd', 'oled', 'tft', 'screen', 'ssd1306', 'st7735', 'ili9341'],
        'Communications': ['wifi', 'bluetooth', 'mqtt', 'http', 'websocket', 'ble', 'can', 'uart', 'serial'],
        'IO': ['gpio', 'pwm', 'adc', 'dac', 'pin', 'input', 'output'],
        'Storage': ['eeprom', 'flash', 'sd', 'file', 'storage', 'database'],
        'LEDs': ['led', 'neopixel', 'ws2812', 'rgb', 'strip'],
        'Motion': ['motor', 'servo', 'stepper'],
        'Audio': ['audio', 'sound', 'speaker', 'buzzer', 'mp3'],
        'Utilities': ['util', 'helper', 'library', 'tool']
    }
    
    for category, keywords in categories.items():
        if any(keyword in text for keyword in keywords):
            return category
    
    return 'Utilities'


def generate_tags(category, repo_name, description):
    """Generate relevant tags for the library"""
    tags = ['untested', 'awesome-micropython', category.lower()]
    
    # Add technology tags
    text = (repo_name + ' ' + description).lower()
    
    tech_tags = {
        'i2c': ['i2c', 'i²c'],
        'spi': ['spi'],
        'uart': ['uart', 'serial'],
        'wifi': ['wifi', 'wireless'],
        'bluetooth': ['bluetooth', 'ble'],
        'esp32': ['esp32'],
        'esp8266': ['esp8266'],
        'rp2040': ['rp2040', 'pico'],
    }
    
    for tag, keywords in tech_tags.items():
        if any(keyword in text for keyword in keywords):
            if tag not in tags:
                tags.append(tag)
    
    return tags


def convert_library(github_url, output_dir='ScriptOs', category=None):
    """Convert a single library from GitHub to ScriptO format"""
    print(f"\n{'='*60}")
    print(f"Converting: {github_url}")
    print(f"{'='*60}")
    
    try:
        # Parse GitHub URL
        owner, repo = parse_github_url(github_url)
        print(f"Repository: {owner}/{repo}")
        
        # Fetch repository info
        repo_info = fetch_repo_info(owner, repo)
        print(f"Description: {repo_info.get('description', 'N/A')}")
        
        # Fetch README
        readme_content = fetch_repo_readme(owner, repo)
        
        # Extract better description
        description = extract_description_from_readme(readme_content, repo)
        if not description:
            description = repo_info.get('description', f"MicroPython library for {repo}")
        
        # Detect license
        license_type = detect_license(owner, repo)
        print(f"License: {license_type}")
        
        # Auto-categorize if not specified
        if not category:
            category = categorize_library(repo, description, readme_content)
        print(f"Category: {category}")
        
        # Generate tags
        tags = generate_tags(category, repo, description)
        print(f"Tags: {tags}")
        
        # Find main Python file
        main_file = find_main_python_file(owner, repo)
        if not main_file:
            print("⚠ Warning: No suitable Python file found in repository root")
            print("   You may need to manually specify the file or check subdirectories")
            return False
        
        print(f"Main file: {main_file['name']}")
        
        # Fetch file content
        file_content = fetch_file_content(main_file)
        if not file_content:
            print("✗ Error: Could not fetch file content")
            return False
        
        # Get latest version/tag
        try:
            tags_url = f"{GITHUB_API}/repos/{owner}/{repo}/tags"
            tags_response = requests.get(tags_url, headers=get_github_api_headers())
            if tags_response.status_code == 200 and tags_response.json():
                upstream_version = tags_response.json()[0]['name']
            else:
                # Use latest commit as version
                upstream_version = repo_info.get('default_branch', 'main')
        except:
            upstream_version = 'main'
        
        # Generate config block
        config = CONFIG_TEMPLATE.format(
            name=repo.replace('-', ' ').replace('_', ' ').title(),
            category=category,
            description=description,
            author=repo_info.get('owner', {}).get('login', 'Unknown'),
            tags=str(tags),
            source_url=github_url,
            source_repo=f"{owner}/{repo}",
            upstream_version=upstream_version,
            license=license_type
        )
        
        # Combine config and original code
        converted_content = config + "\n" + file_content
        
        # Generate output filename
        output_filename = repo.replace('-', ' ').replace('_', ' ').title() + '.py'
        output_path = Path(output_dir) / output_filename
        
        # Ensure output directory exists
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Write output file
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(converted_content)
        
        print(f"✓ Successfully converted to: {output_path}")
        print(f"  Lines: {len(converted_content.splitlines())}")
        
        return True
        
    except Exception as e:
        print(f"✗ Error converting {github_url}: {e}")
        import traceback
        traceback.print_exc()
        return False


def convert_batch(batch_file, output_dir='ScriptOs'):
    """Convert multiple libraries from a list file"""
    with open(batch_file, 'r') as f:
        lines = f.readlines()
    
    total = 0
    success = 0
    
    for line in lines:
        line = line.strip()
        # Skip empty lines and comments
        if not line or line.startswith('#'):
            continue
        
        # Parse line: URL [category]
        parts = line.split()
        url = parts[0]
        category = parts[1] if len(parts) > 1 else None
        
        total += 1
        if convert_library(url, output_dir, category):
            success += 1
    
    print(f"\n{'='*60}")
    print(f"Batch conversion complete: {success}/{total} successful")
    print(f"{'='*60}")


def main():
    parser = argparse.ArgumentParser(
        description='Convert Awesome MicroPython libraries to ScriptO format',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Convert single library
  python3 convert_awesome_mp.py --url https://github.com/adafruit/Adafruit_CircuitPython_BME280
  
  # Convert with specific category
  python3 convert_awesome_mp.py --url https://github.com/user/repo --category Sensors
  
  # Batch convert from file
  python3 convert_awesome_mp.py --batch libraries_list.txt
  
  # Specify output directory
  python3 convert_awesome_mp.py --url https://github.com/user/repo --output-dir ../ScriptOs
        """
    )
    
    parser.add_argument('--url', help='GitHub URL of library to convert')
    parser.add_argument('--batch', help='File containing list of GitHub URLs to convert')
    parser.add_argument('--output-dir', default='ScriptOs', help='Output directory for converted files')
    parser.add_argument('--category', help='Category for the library (auto-detected if not specified)')
    
    args = parser.parse_args()
    
    if not args.url and not args.batch:
        parser.print_help()
        sys.exit(1)
    
    if args.batch:
        convert_batch(args.batch, args.output_dir)
    elif args.url:
        success = convert_library(args.url, args.output_dir, args.category)
        sys.exit(0 if success else 1)


if __name__ == '__main__':
    main()

