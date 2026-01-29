#!/usr/bin/env python3
"""
Migrate GitHub Wiki to MkDocs structure.

This script:
1. Copies wiki markdown files to the new docs/ structure
2. Renames files to lowercase with dashes
3. Converts GitHub wiki link syntax to MkDocs relative links
4. Merges existing /docs/ developer files
"""

import os
import re
import shutil
from pathlib import Path

# Paths
WIKI_DIR = Path("/Users/jep/github/scriptostudio.wiki")
DOCS_DIR = Path("/Users/jep/github/scriptostudio/docs")
OLD_DOCS_DIR = Path("/Users/jep/github/scriptostudio/docs")  # Will backup first

# File mapping: wiki filename -> new location (relative to docs/)
FILE_MAPPING = {
    "Home.md": "index.md",
    "Getting-Started.md": "getting-started/index.md",
    "First-ScriptO.md": "getting-started/first-scripto.md",
    "Connection.md": "getting-started/connection.md",
    "IDE-Overview.md": "getting-started/ide-overview.md",
    "Writing-ScriptOs.md": "user-guide/writing-scriptos.md",
    "File-Manager.md": "user-guide/file-manager.md",
    "Editor-Features.md": "user-guide/editor-features.md",
    "Extensions-Overview.md": "user-guide/extensions.md",
    "System-Information.md": "user-guide/system-info.md",
    "Settings.md": "user-guide/settings.md",
    "Flashing-Firmware.md": "device-setup/flashing-firmware.md",
    "Agent-Overview.md": "agent/index.md",
    "Agent-Setup.md": "agent/setup.md",
    "Using-the-Agent.md": "agent/usage.md",
    "Debugger-Overview.md": "debugging/index.md",
    "Setting-Breakpoints.md": "debugging/breakpoints.md",
    "Writing-Extensions.md": "extensions/writing-extensions.md",
    "WebREPL-Binary-Protocol.md": "protocol/webrepl-binary-protocol.md",
    "Architecture.md": "developer/architecture.md",
    "Contributing.md": "developer/contributing.md",
    "Troubleshooting-Connection.md": "troubleshooting/connection.md",
    "FAQ.md": "reference/faq.md",
}

# Old docs file mapping
OLD_DOCS_MAPPING = {
    "DEV_SHORTCUT.md": "developer/shortcuts.md",
    "MICROPYTHON_REFERENCE.md": "developer/micropython-reference.md",
    "README_REGISTRY.md": "developer/registry.md",
    "EXTENSION_VERSIONING.md": "extensions/versioning.md",
    # CONTRIBUTING.md will be merged with wiki's Contributing.md
}

# Link conversion map: wiki link target -> new relative path
LINK_MAP = {
    "Home": "../index.md",
    "Getting-Started": "../getting-started/index.md",
    "First-ScriptO": "../getting-started/first-scripto.md",
    "Connection": "../getting-started/connection.md",
    "IDE-Overview": "../getting-started/ide-overview.md",
    "Writing-ScriptOs": "../user-guide/writing-scriptos.md",
    "File-Manager": "../user-guide/file-manager.md",
    "Editor-Features": "../user-guide/editor-features.md",
    "Extensions-Overview": "../user-guide/extensions.md",
    "System-Information": "../user-guide/system-info.md",
    "Settings": "../user-guide/settings.md",
    "Flashing-Firmware": "../device-setup/flashing-firmware.md",
    "Agent-Overview": "../agent/index.md",
    "Agent-Setup": "../agent/setup.md",
    "Using-the-Agent": "../agent/usage.md",
    "Debugger-Overview": "../debugging/index.md",
    "Setting-Breakpoints": "../debugging/breakpoints.md",
    "Writing-Extensions": "../extensions/writing-extensions.md",
    "WebREPL-Binary-Protocol": "../protocol/webrepl-binary-protocol.md",
    "Architecture": "../developer/architecture.md",
    "Contributing": "../developer/contributing.md",
    "Troubleshooting-Connection": "../troubleshooting/connection.md",
    "FAQ": "../reference/faq.md",
    # Pages mentioned in sidebar but don't exist yet
    "Terminal-REPL": "../user-guide/terminal-repl.md",
    "Board-Configurations": "../device-setup/board-configurations.md",
    "Network-Setup": "../device-setup/network-setup.md",
    "Provisioning": "../device-setup/provisioning.md",
    "Debug-Console": "../debugging/debug-console.md",
    "Extension-API": "../extensions/extension-api.md",
    "Device-Libraries": "../extensions/device-libraries.md",
    "Built-in-Extensions": "../extensions/built-in-extensions.md",
    "WebRTC-Transport": "../protocol/webrtc-transport.md",
    "WebSocket-Transport": "../protocol/websocket-transport.md",
    "Message-Types": "../protocol/message-types.md",
    "Building-from-Source": "../developer/building-from-source.md",
    "ESM-Modules": "../developer/esm-modules.md",
    "Troubleshooting-Memory": "../troubleshooting/memory.md",
    "Troubleshooting-Errors": "../troubleshooting/errors.md",
    "Debug-Logging": "../troubleshooting/debug-logging.md",
    "Changelog": "../reference/changelog.md",
    "Roadmap": "../reference/roadmap.md",
}


def convert_links(content: str, source_file: str) -> str:
    """Convert GitHub wiki links to MkDocs relative links."""
    
    # Pattern for markdown links: [text](Target-Page)
    # Also handles [text](Target-Page#anchor)
    def replace_link(match):
        text = match.group(1)
        target = match.group(2)
        anchor = match.group(3) or ""
        
        # Skip external URLs
        if target.startswith(("http://", "https://", "mailto:", "/")):
            return match.group(0)
        
        # Look up in link map
        if target in LINK_MAP:
            new_target = LINK_MAP[target]
            return f"[{text}]({new_target}{anchor})"
        
        # Unknown internal link - leave as-is but warn
        print(f"  WARNING: Unknown link target '{target}' in {source_file}")
        return match.group(0)
    
    # Match [text](target) or [text](target#anchor)
    pattern = r'\[([^\]]+)\]\(([^)#]+)(#[^)]+)?\)'
    content = re.sub(pattern, replace_link, content)
    
    return content


def create_directory_structure():
    """Create the docs directory structure."""
    subdirs = [
        "getting-started",
        "user-guide",
        "device-setup",
        "agent",
        "debugging",
        "extensions",
        "protocol",
        "developer",
        "troubleshooting",
        "reference",
    ]
    
    for subdir in subdirs:
        (DOCS_DIR / subdir).mkdir(parents=True, exist_ok=True)
        print(f"Created: docs/{subdir}/")


def backup_old_docs():
    """Backup existing docs/ files before migration."""
    backup_dir = DOCS_DIR.parent / "docs_backup"
    if backup_dir.exists():
        shutil.rmtree(backup_dir)
    
    if DOCS_DIR.exists() and any(DOCS_DIR.iterdir()):
        shutil.copytree(DOCS_DIR, backup_dir)
        print(f"Backed up existing docs/ to {backup_dir}")
        
        # Clear docs dir but keep it
        for item in DOCS_DIR.iterdir():
            if item.is_file():
                item.unlink()
            elif item.is_dir():
                shutil.rmtree(item)


def migrate_wiki_files():
    """Copy and convert wiki files to new structure."""
    for wiki_file, new_path in FILE_MAPPING.items():
        source = WIKI_DIR / wiki_file
        dest = DOCS_DIR / new_path
        
        if not source.exists():
            print(f"SKIP: {wiki_file} (not found)")
            continue
        
        # Read content
        content = source.read_text(encoding="utf-8")
        
        # Convert links
        content = convert_links(content, wiki_file)
        
        # Write to new location
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(content, encoding="utf-8")
        print(f"Migrated: {wiki_file} -> docs/{new_path}")


def migrate_old_docs():
    """Migrate existing /docs/ developer files to new structure."""
    backup_dir = DOCS_DIR.parent / "docs_backup"
    
    for old_file, new_path in OLD_DOCS_MAPPING.items():
        source = backup_dir / old_file
        dest = DOCS_DIR / new_path
        
        if not source.exists():
            print(f"SKIP: old docs/{old_file} (not found)")
            continue
        
        content = source.read_text(encoding="utf-8")
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(content, encoding="utf-8")
        print(f"Migrated: old docs/{old_file} -> docs/{new_path}")


def create_placeholder_pages():
    """Create placeholder pages for links that exist in sidebar but no content."""
    placeholder_content = """# {title}

!!! note "Coming Soon"
    This page is under construction.

Please check back later or [contribute to the docs](../developer/contributing.md).
"""
    
    # Pages referenced in sidebar but not in wiki
    placeholders = {
        "user-guide/terminal-repl.md": "Terminal & REPL",
        "device-setup/board-configurations.md": "Board Configurations",
        "device-setup/network-setup.md": "Network Setup",
        "device-setup/provisioning.md": "Provisioning",
        "debugging/debug-console.md": "Debug Console",
        "extensions/extension-api.md": "Extension API",
        "extensions/device-libraries.md": "Device Libraries",
        "extensions/built-in-extensions.md": "Built-in Extensions",
        "protocol/webrtc-transport.md": "WebRTC Transport",
        "protocol/websocket-transport.md": "WebSocket Transport",
        "protocol/message-types.md": "Message Types",
        "developer/building-from-source.md": "Building from Source",
        "developer/esm-modules.md": "ESM Modules",
        "troubleshooting/memory.md": "Memory & Performance",
        "troubleshooting/errors.md": "Common Errors",
        "troubleshooting/debug-logging.md": "Debug Logging",
        "reference/changelog.md": "Changelog",
        "reference/roadmap.md": "Roadmap",
    }
    
    for path, title in placeholders.items():
        dest = DOCS_DIR / path
        if not dest.exists():
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_text(placeholder_content.format(title=title), encoding="utf-8")
            print(f"Created placeholder: docs/{path}")


def main():
    print("=" * 50)
    print("MkDocs Migration Script")
    print("=" * 50)
    print()
    
    print("1. Backing up existing docs/...")
    backup_old_docs()
    print()
    
    print("2. Creating directory structure...")
    create_directory_structure()
    print()
    
    print("3. Migrating wiki files...")
    migrate_wiki_files()
    print()
    
    print("4. Migrating old docs/ files...")
    migrate_old_docs()
    print()
    
    print("5. Creating placeholder pages...")
    create_placeholder_pages()
    print()
    
    print("=" * 50)
    print("Migration complete!")
    print()
    print("Next steps:")
    print("  cd /Users/jep/github/scriptostudio")
    print("  pip install mkdocs-material")
    print("  mkdocs serve")
    print("  # Open http://localhost:8000")
    print("=" * 50)


if __name__ == "__main__":
    main()
