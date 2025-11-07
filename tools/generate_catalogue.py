#!/usr/bin/env python3
"""
Generate browsable HTML catalogue for ScriptOs
Reads index.json and generates:
- catalogue/index.html (main list page)
- catalogue/scriptos/{name}.html (individual detail pages)
"""

import json
import os
import shutil
from pathlib import Path
from urllib.parse import quote, unquote

def load_index(index_file='index.json'):
    """Load index.json"""
    with open(index_file, 'r', encoding='utf-8') as f:
        return json.load(f)

def get_all_tags(scriptos):
    """Get all unique tags from ScriptOs"""
    tags = set()
    for scripto in scriptos:
        tags.update(scripto.get('tags', []))
    return sorted(tags)

def slugify(name):
    """Convert name to URL-friendly slug"""
    # Remove .py extension, replace spaces with hyphens, lowercase
    slug = name.replace('.py', '').replace(' ', '-').lower()
    # Remove special characters
    slug = ''.join(c if c.isalnum() or c == '-' else '' for c in slug)
    return slug

def format_timestamp(timestamp):
    """Format Unix timestamp to readable date"""
    from datetime import datetime
    if timestamp:
        dt = datetime.fromtimestamp(timestamp)
        return dt.strftime('%Y-%m-%d %H:%M:%S UTC')
    return 'Unknown'

def generate_list_page(scriptos, all_tags, index, output_path):
    """Generate main list page (like /packages)"""
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ScriptOs Registry - Browse & Install</title>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: #f5f5f5;
            color: #1f1f1f;
            line-height: 1.6;
        }}
        
        .header {{
            background: linear-gradient(135deg, #008184 0%, #00a5a8 100%);
            color: white;
            padding: 2rem;
            text-align: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }}
        
        .header h1 {{
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
        }}
        
        .header p {{
            opacity: 0.9;
            font-size: 1.1rem;
        }}
        
        .container {{
            max-width: 1200px;
            margin: 2rem auto;
            padding: 0 1rem;
        }}
        
        .controls {{
            background: white;
            padding: 1.5rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 2rem;
        }}
        
        .search-box {{
            margin-bottom: 1rem;
        }}
        
        .search-input {{
            width: 100%;
            padding: 0.75rem;
            border: 2px solid #e0e0e0;
            border-radius: 6px;
            font-size: 1rem;
        }}
        
        .search-input:focus {{
            outline: none;
            border-color: #008184;
        }}
        
        .tag-filters {{
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-top: 1rem;
        }}
        
        .tag-filter {{
            padding: 0.5rem 1rem;
            background: #f0f0f0;
            border: 2px solid #e0e0e0;
            border-radius: 20px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: all 0.2s;
            text-decoration: none;
            color: #333;
        }}
        
        .tag-filter:hover {{
            background: #e0e0e0;
        }}
        
        .tag-filter.active {{
            background: #008184;
            color: white;
            border-color: #008184;
        }}
        
        .stats {{
            margin-top: 1rem;
            color: #666;
            font-size: 0.9rem;
        }}
        
        .scriptos-table {{
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            overflow: hidden;
        }}
        
        table {{
            width: 100%;
            border-collapse: collapse;
        }}
        
        thead {{
            background: #f8f9fa;
        }}
        
        th {{
            padding: 1rem;
            text-align: left;
            font-weight: 600;
            color: #333;
            border-bottom: 2px solid #e0e0e0;
            cursor: pointer;
            user-select: none;
        }}
        
        th:hover {{
            background: #f0f0f0;
        }}
        
        td {{
            padding: 1rem;
            border-bottom: 1px solid #f0f0f0;
        }}
        
        tr:hover {{
            background: #f8f9fa;
        }}
        
        .scripto-name {{
            font-weight: 600;
            color: #008184;
        }}
        
        .scripto-name a {{
            color: #008184;
            text-decoration: none;
        }}
        
        .scripto-name a:hover {{
            text-decoration: underline;
        }}
        
        .scripto-description {{
            color: #666;
            font-size: 0.9rem;
            max-width: 400px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }}
        
        .scripto-tags {{
            display: flex;
            flex-wrap: wrap;
            gap: 0.25rem;
        }}
        
        .scripto-tag {{
            padding: 0.25rem 0.5rem;
            background: #e8f4f5;
            color: #008184;
            border-radius: 12px;
            font-size: 0.75rem;
        }}
        
        .footer {{
            text-align: center;
            padding: 2rem;
            color: #666;
            margin-top: 3rem;
        }}
        
        .no-results {{
            text-align: center;
            padding: 3rem;
            color: #666;
        }}
    </style>
</head>
<body>
    <div class="header">
        <h1>📦 ScriptOs Registry</h1>
        <p>Browse and install ScriptOs for MicroPython</p>
    </div>
    
    <div class="container">
        <div class="controls">
            <div class="search-box">
                <input type="text" id="search-input" class="search-input" placeholder="🔎 Search ScriptOs by name, description, author, or tags...">
            </div>
            <div class="tag-filters" id="tag-filters">
                <a href="#" class="tag-filter active" data-tag="all">All</a>
{chr(10).join(f'                <a href="#" class="tag-filter" data-tag="{tag}">{tag}</a>' for tag in all_tags)}
            </div>
            <div class="stats" id="stats">
                Showing <span id="count">{len(scriptos)}</span> of {len(scriptos)} ScriptOs
            </div>
        </div>
        
        <div class="scriptos-table">
            <table>
                <thead>
                    <tr>
                        <th data-sort="name">Name</th>
                        <th data-sort="author">Author</th>
                        <th data-sort="description">Description</th>
                        <th data-sort="tags">Tags</th>
                        <th data-sort="version">Version</th>
                    </tr>
                </thead>
                <tbody id="scriptos-tbody">
{chr(10).join(generate_table_row(scripto) for scripto in scriptos)}
                </tbody>
            </table>
        </div>
    </div>
    
    <div class="footer">
        <p>Last updated: {format_timestamp(index.get('updated', 0))}</p>
        <p><a href="https://github.com/jetpax/scripto-studio-registry" style="color: #008184;">View on GitHub</a></p>
    </div>
    
    <script>
        const scriptos = {json.dumps(scriptos)};
        const allTags = {json.dumps(all_tags)};
        
        const searchInput = document.getElementById('search-input');
        const tagFilters = document.querySelectorAll('.tag-filter');
        const tbody = document.getElementById('scriptos-tbody');
        const statsCount = document.getElementById('count');
        
        let activeTag = 'all';
        let searchQuery = '';
        let sortBy = 'name';
        let sortAsc = true;
        
        function formatVersion(version) {{
            if (Array.isArray(version)) {{
                return version.join('.');
            }}
            return version || '1.0.0';
        }}
        
        function matchesSearch(scripto, query) {{
            if (!query) return true;
            const q = query.toLowerCase();
            return (
                scripto.name.toLowerCase().includes(q) ||
                (scripto.description || '').toLowerCase().includes(q) ||
                (scripto.author || '').toLowerCase().includes(q) ||
                (scripto.tags || []).some(tag => tag.toLowerCase().includes(q))
            );
        }}
        
        function matchesTag(scripto, tag) {{
            if (tag === 'all') return true;
            return (scripto.tags || []).includes(tag);
        }}
        
        function slugify(name) {{
            return name.replace(/[^a-z0-9]/gi, '-').toLowerCase().replace(/\\.py$/, '');
        }}
        
        function generateRowHTML(scripto) {{
            const detailUrl = `scriptos/${{slugify(scripto.name)}}.html`;
            const tags = (scripto.tags || []).map(t => `<span class="scripto-tag">${{t}}</span>`).join('');
            const version = formatVersion(scripto.version);
            const desc = scripto.description || '';
            const descShort = desc.length > 100 ? desc.substring(0, 100) + '...' : desc;
            
            return `
                <tr>
                    <td class="scripto-name"><a href="${{detailUrl}}">${{scripto.name}}</a></td>
                    <td>${{scripto.author || 'Unknown'}}</td>
                    <td class="scripto-description">${{descShort}}</td>
                    <td><div class="scripto-tags">${{tags}}</div></td>
                    <td>v${{version}}</td>
                </tr>
            `;
        }}
        
        function filterAndSort() {{
            let filtered = scriptos.filter(s => 
                matchesSearch(s, searchQuery) && matchesTag(s, activeTag)
            );
            
            // Sort
            filtered.sort((a, b) => {{
                let aVal = a[sortBy];
                let bVal = b[sortBy];
                
                if (sortBy === 'version') {{
                    // Compare version arrays
                    aVal = a.version || [0, 0, 0];
                    bVal = b.version || [0, 0, 0];
                    for (let i = 0; i < 3; i++) {{
                        if (aVal[i] !== bVal[i]) {{
                            return sortAsc ? aVal[i] - bVal[i] : bVal[i] - aVal[i];
                        }}
                    }}
                    return 0;
                }}
                
                if (sortBy === 'tags') {{
                    aVal = (a.tags || []).join(', ');
                    bVal = (b.tags || []).join(', ');
                }}
                
                if (typeof aVal === 'string') {{
                    aVal = aVal.toLowerCase();
                    bVal = bVal.toLowerCase();
                }}
                
                if (aVal < bVal) return sortAsc ? -1 : 1;
                if (aVal > bVal) return sortAsc ? 1 : -1;
                return 0;
            }});
            
            tbody.innerHTML = filtered.length > 0
                ? filtered.map(s => generateRowHTML(s)).join('')
                : '<tr><td colspan="5" class="no-results">No ScriptOs found</td></tr>';
            
            statsCount.textContent = filtered.length;
        }}
        
        searchInput.addEventListener('input', (e) => {{
            searchQuery = e.target.value;
            filterAndSort();
        }});
        
        tagFilters.forEach(filter => {{
            filter.addEventListener('click', (e) => {{
                e.preventDefault();
                tagFilters.forEach(f => f.classList.remove('active'));
                filter.classList.add('active');
                activeTag = filter.dataset.tag;
                filterAndSort();
            }});
        }});
        
        // Sort functionality
        document.querySelectorAll('th[data-sort]').forEach(th => {{
            th.addEventListener('click', () => {{
                const newSort = th.dataset.sort;
                if (sortBy === newSort) {{
                    sortAsc = !sortAsc;
                }} else {{
                    sortBy = newSort;
                    sortAsc = true;
                }}
                filterAndSort();
            }});
        }});
    </script>
</body>
</html>
"""
    
    html_file = output_path / 'index.html'
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(html)
    
    print(f"✓ Generated {html_file}")

def generate_table_row(scripto):
    """Generate table row HTML for list page"""
    slug = slugify(scripto['name'])
    detail_url = f"scriptos/{slug}.html"
    tags_html = ''.join(f'<span class="scripto-tag">{tag}</span>' for tag in scripto.get('tags', []))
    version = '.'.join(map(str, scripto.get('version', [1, 0, 0])))
    description = (scripto.get('description', '') or '')[:100]
    if len(scripto.get('description', '') or '') > 100:
        description += '...'
    
    return f"""                    <tr>
                        <td class="scripto-name"><a href="{detail_url}">{scripto['name']}</a></td>
                        <td>{scripto.get('author', 'Unknown')}</td>
                        <td class="scripto-description">{description}</td>
                        <td><div class="scripto-tags">{tags_html}</div></td>
                        <td>v{version}</td>
                    </tr>"""

def generate_detail_page(scripto, output_path):
    """Generate individual detail page (like /packages/aioble)"""
    slug = slugify(scripto['name'])
    detail_dir = output_path / 'scriptos'
    detail_dir.mkdir(exist_ok=True)
    
    version = '.'.join(map(str, scripto.get('version', [1, 0, 0])))
    tags_html = ''.join(f'<span class="scripto-tag">{tag}</span>' for tag in scripto.get('tags', []))
    author = scripto.get('author', 'Unknown')
    description = scripto.get('description', '')
    docs = scripto.get('docs', '')
    url = scripto.get('url', '')
    license = scripto.get('license', 'MIT')
    
    # Install URL for ScriptO Studio
    install_url = f"http://localhost:5174/?install={quote(url)}" if url else "#"
    
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{scripto['name']} - ScriptOs Registry</title>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: #f5f5f5;
            color: #1f1f1f;
            line-height: 1.6;
        }}
        
        .header {{
            background: linear-gradient(135deg, #008184 0%, #00a5a8 100%);
            color: white;
            padding: 1.5rem 2rem;
        }}
        
        .header a {{
            color: white;
            text-decoration: none;
            opacity: 0.9;
        }}
        
        .header a:hover {{
            opacity: 1;
        }}
        
        .container {{
            max-width: 900px;
            margin: 2rem auto;
            padding: 0 1rem;
        }}
        
        .detail-card {{
            background: white;
            border-radius: 8px;
            padding: 2rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 2rem;
        }}
        
        .detail-header {{
            border-bottom: 2px solid #f0f0f0;
            padding-bottom: 1.5rem;
            margin-bottom: 1.5rem;
        }}
        
        .detail-header h1 {{
            color: #008184;
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }}
        
        .detail-meta {{
            color: #666;
            font-size: 0.9rem;
            margin-bottom: 1rem;
        }}
        
        .detail-description {{
            margin: 1.5rem 0;
            line-height: 1.8;
            color: #444;
        }}
        
        .detail-tags {{
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin: 1rem 0;
        }}
        
        .scripto-tag {{
            padding: 0.5rem 1rem;
            background: #e8f4f5;
            color: #008184;
            border-radius: 12px;
            font-size: 0.9rem;
        }}
        
        .detail-info {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin: 1.5rem 0;
            padding: 1.5rem;
            background: #f8f9fa;
            border-radius: 6px;
        }}
        
        .info-item {{
            display: flex;
            flex-direction: column;
        }}
        
        .info-label {{
            font-size: 0.85rem;
            color: #666;
            margin-bottom: 0.25rem;
        }}
        
        .info-value {{
            font-weight: 600;
            color: #333;
        }}
        
        .detail-actions {{
            display: flex;
            gap: 1rem;
            margin-top: 2rem;
            padding-top: 2rem;
            border-top: 2px solid #f0f0f0;
        }}
        
        .btn {{
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 6px;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.2s;
            text-decoration: none;
            display: inline-block;
        }}
        
        .btn-primary {{
            background: #008184;
            color: white;
        }}
        
        .btn-primary:hover {{
            background: #006668;
        }}
        
        .btn-secondary {{
            background: #f0f0f0;
            color: #333;
        }}
        
        .btn-secondary:hover {{
            background: #e0e0e0;
        }}
        
        .install-note {{
            background: #fff3cd;
            border: 1px solid #ffc107;
            border-radius: 6px;
            padding: 1rem;
            margin-top: 1rem;
            font-size: 0.9rem;
            color: #856404;
        }}
    </style>
</head>
<body>
    <div class="header">
        <a href="../index.html">← Back to ScriptOs Registry</a>
    </div>
    
    <div class="container">
        <div class="detail-card">
            <div class="detail-header">
                <h1>{scripto['name']}</h1>
                <div class="detail-meta">
                    by {author} • Version {version} • License: {license}
                </div>
            </div>
            
            <div class="detail-description">
                {description or 'No description provided.'}
            </div>
            
            <div class="detail-tags">
                {tags_html if tags_html else '<span class="scripto-tag">Uncategorized</span>'}
            </div>
            
            <div class="detail-info">
                <div class="info-item">
                    <span class="info-label">Author</span>
                    <span class="info-value">{author}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Version</span>
                    <span class="info-value">{version}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">License</span>
                    <span class="info-value">{license}</span>
                </div>
                {f'<div class="info-item"><span class="info-label">Documentation</span><span class="info-value"><a href="{docs}" target="_blank">View Docs</a></span></div>' if docs else ''}
            </div>
            
            <div class="detail-actions">
                <a href="{install_url}" class="btn btn-primary">Open in ScriptO Studio</a>
                {f'<a href="{docs}" target="_blank" class="btn btn-secondary">Documentation</a>' if docs else ''}
                <a href="{url}" target="_blank" class="btn btn-secondary">View Source</a>
            </div>
            
            <div class="install-note">
                <strong>Note:</strong> The "Open in ScriptO Studio" button will only work if ScriptO Studio is running on localhost:5174. 
                Otherwise, copy the ScriptO URL and paste it into ScriptO Studio manually.
            </div>
        </div>
    </div>
</body>
</html>
"""
    
    html_file = detail_dir / f"{slug}.html"
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(html)
    
    print(f"  Generated detail page: {slug}.html")

def generate_html_catalogue(index, output_dir='catalogue', scriptos_dir='ScriptOs'):
    """Generate HTML catalogue with list and detail pages"""
    scriptos = index.get('scriptos', [])
    all_tags = get_all_tags(scriptos)
    
    # Create output directory
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)
    scriptos_output = output_path / 'scriptos'
    scriptos_output.mkdir(exist_ok=True)
    
    # Copy ScriptO files to catalogue/scriptos/
    scriptos_source = Path(scriptos_dir)
    if scriptos_source.exists():
        for scripto in scriptos:
            filename = scripto['filename']
            source_file = scriptos_source / filename
            if source_file.exists():
                shutil.copy2(source_file, scriptos_output / filename)
    
    # Generate main list page
    print("Generating list page...")
    generate_list_page(scriptos, all_tags, index, output_path)
    
    # Generate detail pages
    print("Generating detail pages...")
    for scripto in scriptos:
        generate_detail_page(scripto, output_path)
    
    print(f"\n✓ Catalogue generated successfully!")
    return True

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Generate ScriptOs HTML catalogue')
    parser.add_argument('--index', default='index.json', help='Input index.json file')
    parser.add_argument('--output', default='catalogue', help='Output directory')
    parser.add_argument('--scriptos-dir', default='ScriptOs', help='ScriptOs source directory')
    
    args = parser.parse_args()
    
    # Load index
    print(f"Loading {args.index}...")
    index = load_index(args.index)
    
    # Generate catalogue
    print(f"Generating catalogue in {args.output}...")
    generate_html_catalogue(index, args.output, args.scriptos_dir)
    
    print(f"\n✓ Catalogue generated successfully!")

if __name__ == '__main__':
    main()
