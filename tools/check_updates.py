#!/usr/bin/env python3
"""
Check for Updates to Converted ScriptOs
========================================

This tool checks for updates to ScriptOs that were converted from upstream
GitHub repositories. It queries the GitHub API to find new releases or commits.

Usage:
    python3 check_updates.py --check-all
    python3 check_updates.py --update <scripto-name>
    python3 check_updates.py --report outdated.md

Features:
- Checks all ScriptOs with source_repo field
- Compares upstream_version with latest release/commit
- Reports outdated libraries
- Can auto-update and show diff
"""

import os
import sys
import json
import argparse
import requests
from pathlib import Path
from datetime import datetime

# GitHub API base URL
GITHUB_API = "https://api.github.com"

def get_github_api_headers():
    """Get headers for GitHub API requests with token if available"""
    headers = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'ScriptO-UpdateChecker/1.0'
    }
    
    # Check for GitHub token in environment
    token = os.environ.get('GITHUB_TOKEN')
    if token:
        headers['Authorization'] = f'token {token}'
    
    return headers


def load_index(index_file='index.json'):
    """Load the registry index.json file"""
    try:
        with open(index_file, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading index.json: {e}")
        return None


def get_latest_github_version(source_repo):
    """Get latest version from GitHub (release tag or latest commit)"""
    try:
        # Try to get latest release first
        releases_url = f"{GITHUB_API}/repos/{source_repo}/releases/latest"
        response = requests.get(releases_url, headers=get_github_api_headers())
        
        if response.status_code == 200:
            release_data = response.json()
            return {
                'version': release_data['tag_name'],
                'type': 'release',
                'published_at': release_data['published_at'],
                'url': release_data['html_url']
            }
        
        # If no releases, get latest commit
        commits_url = f"{GITHUB_API}/repos/{source_repo}/commits"
        response = requests.get(commits_url, headers=get_github_api_headers())
        
        if response.status_code == 200:
            commits = response.json()
            if commits:
                latest_commit = commits[0]
                return {
                    'version': latest_commit['sha'][:7],
                    'type': 'commit',
                    'published_at': latest_commit['commit']['committer']['date'],
                    'url': latest_commit['html_url']
                }
        
        return None
        
    except Exception as e:
        print(f"Error checking {source_repo}: {e}")
        return None


def is_version_newer(current, latest):
    """Compare version strings to determine if update is available"""
    # Strip 'v' prefix if present
    current_clean = current.lstrip('v')
    latest_clean = latest.lstrip('v')
    
    # If they're the same, no update
    if current_clean == latest_clean:
        return False
    
    # Try semantic versioning comparison
    try:
        current_parts = [int(x) for x in current_clean.split('.')]
        latest_parts = [int(x) for x in latest_clean.split('.')]
        
        for i in range(max(len(current_parts), len(latest_parts))):
            c = current_parts[i] if i < len(current_parts) else 0
            l = latest_parts[i] if i < len(latest_parts) else 0
            if l > c:
                return True
            elif l < c:
                return False
        
        return False
    except:
        # If not semantic version, just check if they're different
        return current_clean != latest_clean


def check_all_updates(index_data):
    """Check all ScriptOs for updates"""
    scriptos = index_data.get('scriptos', [])
    
    outdated = []
    up_to_date = []
    no_source = []
    errors = []
    
    print(f"Checking {len(scriptos)} ScriptOs for updates...")
    print()
    
    for scripto in scriptos:
        name = scripto.get('name', 'Unknown')
        source_repo = scripto.get('source_repo')
        current_version = scripto.get('upstream_version')
        
        if not source_repo:
            no_source.append(name)
            continue
        
        print(f"Checking {name} ({source_repo})...", end=' ')
        
        latest = get_latest_github_version(source_repo)
        
        if not latest:
            print("ERROR")
            errors.append(name)
            continue
        
        if current_version and is_version_newer(current_version, latest['version']):
            print(f"UPDATE AVAILABLE: {current_version} → {latest['version']}")
            outdated.append({
                'name': name,
                'filename': scripto.get('filename'),
                'current': current_version,
                'latest': latest['version'],
                'source_repo': source_repo,
                'published_at': latest['published_at'],
                'url': latest['url']
            })
        else:
            print("UP TO DATE")
            up_to_date.append(name)
    
    # Print summary
    print()
    print("="*60)
    print("SUMMARY")
    print("="*60)
    print(f"Up to date: {len(up_to_date)}")
    print(f"Updates available: {len(outdated)}")
    print(f"No source tracking: {len(no_source)}")
    print(f"Errors: {len(errors)}")
    
    if outdated:
        print()
        print("UPDATES AVAILABLE:")
        for item in outdated:
            print(f"  • {item['name']}: {item['current']} → {item['latest']}")
            print(f"    {item['source_repo']}")
    
    return {
        'outdated': outdated,
        'up_to_date': up_to_date,
        'no_source': no_source,
        'errors': errors
    }


def generate_report(results, output_file):
    """Generate a markdown report of outdated libraries"""
    with open(output_file, 'w') as f:
        f.write("# ScriptO Update Report\n\n")
        f.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
        
        f.write("## Summary\n\n")
        f.write(f"- Up to date: {len(results['up_to_date'])}\n")
        f.write(f"- Updates available: {len(results['outdated'])}\n")
        f.write(f"- No source tracking: {len(results['no_source'])}\n")
        f.write(f"- Errors: {len(results['errors'])}\n\n")
        
        if results['outdated']:
            f.write("## Updates Available\n\n")
            for item in results['outdated']:
                f.write(f"### {item['name']}\n\n")
                f.write(f"- **Current**: `{item['current']}`\n")
                f.write(f"- **Latest**: `{item['latest']}`\n")
                f.write(f"- **Repository**: [{item['source_repo']}](https://github.com/{item['source_repo']})\n")
                f.write(f"- **Published**: {item['published_at']}\n")
                f.write(f"- **File**: `{item['filename']}`\n\n")
                f.write(f"Update command:\n")
                f.write(f"```bash\n")
                f.write(f"python3 tools/convert_awesome_mp.py --url https://github.com/{item['source_repo']}\n")
                f.write(f"```\n\n")
        
        if results['no_source']:
            f.write("## No Source Tracking\n\n")
            f.write("These ScriptOs don't have source_repo tracking:\n\n")
            for name in results['no_source']:
                f.write(f"- {name}\n")
            f.write("\n")
        
        if results['errors']:
            f.write("## Errors\n\n")
            f.write("These ScriptOs encountered errors during checking:\n\n")
            for name in results['errors']:
                f.write(f"- {name}\n")
            f.write("\n")
    
    print(f"\nReport saved to: {output_file}")


def find_scripto_file(filename, scriptos_dir='ScriptOs'):
    """Find a ScriptO file in the directory"""
    path = Path(scriptos_dir) / filename
    if path.exists():
        return path
    return None


def update_scripto(scripto_name, index_data):
    """Update a specific ScriptO by re-converting from source"""
    scriptos = index_data.get('scriptos', [])
    
    # Find the ScriptO
    scripto = None
    for s in scriptos:
        if s.get('name', '').lower() == scripto_name.lower() or \
           s.get('filename', '').lower() == scripto_name.lower():
            scripto = s
            break
    
    if not scripto:
        print(f"Error: ScriptO '{scripto_name}' not found in index")
        return False
    
    source_repo = scripto.get('source_repo')
    source_url = scripto.get('source_url')
    
    if not source_repo or not source_url:
        print(f"Error: ScriptO '{scripto_name}' has no source tracking")
        return False
    
    print(f"Updating {scripto['name']} from {source_url}...")
    
    # Use convert_awesome_mp.py to re-convert
    import subprocess
    
    cmd = [
        'python3',
        'tools/convert_awesome_mp.py',
        '--url', source_url,
        '--output-dir', 'ScriptOs'
    ]
    
    category = scripto.get('category')
    if category:
        cmd.extend(['--category', category])
    
    result = subprocess.run(cmd, capture_output=True, text=True)
    
    if result.returncode == 0:
        print("✓ Successfully updated")
        print("\nNext steps:")
        print("  1. Review the changes")
        print("  2. Test on hardware")
        print("  3. Run: python3 tools/build_index.py")
        print("  4. Commit and push")
        return True
    else:
        print("✗ Update failed")
        print(result.stdout)
        print(result.stderr)
        return False


def main():
    parser = argparse.ArgumentParser(
        description='Check for updates to converted ScriptOs',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Check all ScriptOs for updates
  python3 check_updates.py --check-all
  
  # Generate a report
  python3 check_updates.py --check-all --report outdated.md
  
  # Update a specific ScriptO
  python3 check_updates.py --update "BME280 Sensor"
        """
    )
    
    parser.add_argument('--check-all', action='store_true',
                        help='Check all ScriptOs for updates')
    parser.add_argument('--update', metavar='NAME',
                        help='Update a specific ScriptO by name')
    parser.add_argument('--report', metavar='FILE',
                        help='Generate markdown report of outdated libraries')
    parser.add_argument('--index', default='index.json',
                        help='Path to index.json file (default: index.json)')
    
    args = parser.parse_args()
    
    if not any([args.check_all, args.update]):
        parser.print_help()
        sys.exit(1)
    
    # Load index
    index_data = load_index(args.index)
    if not index_data:
        sys.exit(1)
    
    if args.check_all:
        results = check_all_updates(index_data)
        
        if args.report:
            generate_report(results, args.report)
    
    if args.update:
        success = update_scripto(args.update, index_data)
        sys.exit(0 if success else 1)


if __name__ == '__main__':
    main()

