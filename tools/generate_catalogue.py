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

# Tag icons mapping
TAG_ICONS = {
    'hardware': '🔧',
    'networking': '🌐',
    'display': '🖥️',
    'sensor': '📡',
    'leds': '💡',
    'storage': '💾',
    'test': '🧪',
    'demos': '🎮',
    'communication': '📨',
    'bluetooth': '📶',
    'can': '🚗',
    'audio': '🔊',
    'motor': '⚡',
    'gpio': '🔌',
    'i2c': '🔗',
    'spi': '🔗',
    'uart': '📟',
    'wifi': '📡',
    'usb': '🔌',
    'diagnostics': '🔍',
    'utility': '🛠️',
}

def get_tag_icon(tag):
    """Get icon for a tag"""
    return TAG_ICONS.get(tag.lower(), '📦')

def generate_list_page(scriptos, all_tags, index, output_path):
    """Generate main list page (like /packages)"""
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ScriptO Registry - Browse & Install</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        :root {{
            --primary: #e85d04;
            --primary-dark: #d45403;
            --primary-light: #ff7b2e;
            --primary-glow: rgba(232, 93, 4, 0.3);
            --accent: #f9844a;
            --bg-dark: #0f0f0f;
            --bg-card: rgba(255, 255, 255, 0.03);
            --bg-card-hover: rgba(255, 255, 255, 0.06);
            --text-primary: #ffffff;
            --text-secondary: rgba(255, 255, 255, 0.7);
            --text-muted: rgba(255, 255, 255, 0.5);
            --border: rgba(255, 255, 255, 0.08);
            --border-hover: rgba(255, 255, 255, 0.15);
        }}
        
        body {{
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: var(--bg-dark);
            color: var(--text-primary);
            line-height: 1.6;
            min-height: 100vh;
            zoom: 0.75;
        }}
        
        /* Animated background */
        body::before {{
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
                radial-gradient(ellipse at 10% 20%, rgba(232, 93, 4, 0.08) 0%, transparent 50%),
                radial-gradient(ellipse at 90% 80%, rgba(249, 132, 74, 0.06) 0%, transparent 50%);
            pointer-events: none;
            z-index: -1;
        }}
        
        .header {{
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
            padding: 3rem 2rem;
            text-align: center;
            position: relative;
            overflow: hidden;
        }}
        
        .header::before {{
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                rgba(255,255,255,0.02) 10px,
                rgba(255,255,255,0.02) 20px
            );
            animation: shimmer 20s linear infinite;
        }}
        
        @keyframes shimmer {{
            0% {{ transform: translateX(-50%) translateY(-50%) rotate(0deg); }}
            100% {{ transform: translateX(-50%) translateY(-50%) rotate(360deg); }}
        }}
        
        .header-content {{
            position: relative;
            z-index: 1;
        }}
        
        .header h1 {{
            font-size: 2.75rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            letter-spacing: -0.02em;
            text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
        }}
        
        .header p {{
            opacity: 0.9;
            font-size: 1.15rem;
            font-weight: 400;
        }}
        
        .container {{
            max-width: 1300px;
            margin: 0 auto;
            padding: 2rem 1.5rem;
        }}
        
        .controls {{
            background: var(--bg-card);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            padding: 1.5rem;
            border-radius: 16px;
            border: 1px solid var(--border);
            margin-bottom: 2rem;
        }}
        
        .search-box {{
            position: relative;
        }}
        
        .search-input {{
            width: 100%;
            padding: 1rem 1.25rem;
            padding-left: 3rem;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--border);
            border-radius: 12px;
            font-size: 1rem;
            color: var(--text-primary);
            transition: all 0.3s ease;
            font-family: inherit;
        }}
        
        .search-input::placeholder {{
            color: var(--text-muted);
        }}
        
        .search-input:focus {{
            outline: none;
            border-color: var(--primary);
            background: rgba(255, 255, 255, 0.08);
            box-shadow: 0 0 0 3px var(--primary-glow);
        }}
        
        .search-icon {{
            position: absolute;
            left: 1rem;
            top: 50%;
            transform: translateY(-50%);
            font-size: 1.1rem;
            opacity: 0.5;
        }}
        
        .tag-filters {{
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-top: 1.25rem;
        }}
        
        .tag-filter {{
            padding: 0.5rem 1rem;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--border);
            border-radius: 100px;
            cursor: pointer;
            font-size: 0.85rem;
            transition: all 0.2s ease;
            text-decoration: none;
            color: var(--text-secondary);
            font-weight: 500;
        }}
        
        .tag-filter:hover {{
            background: rgba(255, 255, 255, 0.1);
            border-color: var(--border-hover);
            color: var(--text-primary);
        }}
        
        .tag-filter.active {{
            background: var(--primary);
            color: white;
            border-color: var(--primary);
        }}
        
        .stats {{
            margin-top: 1rem;
            color: var(--text-muted);
            font-size: 0.9rem;
        }}
        
        .scriptos-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 1.25rem;
        }}
        
        .scripto-card {{
            background: var(--bg-card);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border-radius: 16px;
            border: 1px solid var(--border);
            padding: 1.5rem;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            text-decoration: none;
            color: inherit;
            display: flex;
            flex-direction: column;
            position: relative;
            overflow: hidden;
        }}
        
        .scripto-card::before {{
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, var(--primary), var(--accent));
            opacity: 0;
            transition: opacity 0.3s ease;
        }}
        
        .scripto-card:hover {{
            transform: translateY(-4px);
            border-color: var(--border-hover);
            background: var(--bg-card-hover);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 0 30px var(--primary-glow);
        }}
        
        .scripto-card:hover::before {{
            opacity: 1;
        }}
        
        .scripto-header {{
            display: flex;
            align-items: flex-start;
            gap: 1rem;
            margin-bottom: 0.75rem;
        }}
        
        .scripto-icon {{
            font-size: 1.75rem;
            width: 48px;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, var(--primary), var(--accent));
            border-radius: 12px;
            flex-shrink: 0;
        }}
        
        .scripto-title {{
            flex: 1;
            min-width: 0;
        }}
        
        .scripto-name {{
            font-size: 1.1rem;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 0.25rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }}
        
        .scripto-author {{
            font-size: 0.8rem;
            color: var(--text-muted);
        }}
        
        .scripto-description {{
            color: var(--text-secondary);
            font-size: 0.9rem;
            line-height: 1.5;
            margin-bottom: 1rem;
            flex: 1;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }}
        
        .scripto-footer {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 1rem;
            border-top: 1px solid var(--border);
        }}
        
        .scripto-tags {{
            display: flex;
            flex-wrap: wrap;
            gap: 0.375rem;
        }}
        
        .scripto-tag {{
            padding: 0.25rem 0.625rem;
            background: rgba(232, 93, 4, 0.15);
            color: var(--accent);
            border-radius: 6px;
            font-size: 0.7rem;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.03em;
        }}
        
        .scripto-version {{
            font-size: 0.8rem;
            color: var(--text-muted);
            font-weight: 500;
        }}
        
        .footer {{
            text-align: center;
            padding: 3rem 2rem;
            color: var(--text-muted);
            margin-top: 2rem;
            border-top: 1px solid var(--border);
        }}
        
        .footer a {{
            color: var(--primary);
            text-decoration: none;
            transition: color 0.2s;
        }}
        
        .footer a:hover {{
            color: var(--primary-light);
        }}
        
        .footer-links {{
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin-top: 0.75rem;
        }}
        
        .no-results {{
            text-align: center;
            padding: 4rem 2rem;
            color: var(--text-secondary);
            background: var(--bg-card);
            border-radius: 16px;
            border: 1px solid var(--border);
        }}
        
        .no-results-icon {{
            font-size: 3rem;
            margin-bottom: 1rem;
            opacity: 0.5;
        }}
        
        @media (max-width: 768px) {{
            .header h1 {{
                font-size: 2rem;
            }}
            
            .scriptos-grid {{
                grid-template-columns: 1fr;
            }}
            
            .footer-links {{
                flex-direction: column;
                gap: 0.75rem;
            }}
        }}
    </style>
</head>
<body>
    <div class="header">
        <div class="header-content">
            <h1>📜 ScriptO Registry</h1>
            <p>Easy to configure scripts for <a href="https://scriptostudio.com" style="color: inherit; text-decoration: underline;">ScriptO Studio</a></p>
        </div>
    </div>
    
    <div class="container">
        <div class="controls">
            <div class="search-box">
                <span class="search-icon">🔍</span>
                <input type="text" id="search-input" class="search-input" placeholder="Search ScriptOs by name, description, or tags...">
            </div>
            <div class="tag-filters" id="tag-filters">
                <a href="#" class="tag-filter active" data-tag="all">All</a>
{chr(10).join(f'                <a href="#" class="tag-filter" data-tag="{tag}">{get_tag_icon(tag)} {tag}</a>' for tag in all_tags)}
            </div>
            <div class="stats" id="stats">
                Showing <span id="count">{len(scriptos)}</span> of {len(scriptos)} ScriptOs
            </div>
        </div>
        
        <div class="scriptos-grid" id="scriptos-grid">
{chr(10).join(generate_card_html(scripto) for scripto in scriptos)}
        </div>
        
        <div class="no-results" id="no-results" style="display: none;">
            <div class="no-results-icon">🔍</div>
            <p>No ScriptOs found matching your search.</p>
        </div>
    </div>
    
    <div class="footer">
        <p>Last updated: {format_timestamp(index.get('updated', 0))}</p>
        <div class="footer-links">
            <a href="https://github.com/jetpax/scriptostudio/tree/main/registry">View on GitHub</a>
            <a href="../extensions-catalogue/">Browse Extensions</a>
        </div>
    </div>
    
    <script>
        const scriptos = {json.dumps(scriptos)};
        const allTags = {json.dumps(all_tags)};
        
        const searchInput = document.getElementById('search-input');
        const tagFilters = document.querySelectorAll('.tag-filter');
        const grid = document.getElementById('scriptos-grid');
        const noResults = document.getElementById('no-results');
        const statsCount = document.getElementById('count');
        
        let activeTag = 'all';
        let searchQuery = '';
        
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
        
        function getTagIcon(tag) {{
            const icons = {json.dumps(TAG_ICONS)};
            return icons[tag.toLowerCase()] || '📦';
        }}
        
        function generateCardHTML(scripto) {{
            const detailUrl = `scriptos/${{slugify(scripto.name)}}.html`;
            const tags = (scripto.tags || []).slice(0, 2).map(t => `<span class="scripto-tag">${{t}}</span>`).join('');
            const version = formatVersion(scripto.version);
            const desc = scripto.description || '';
            const descShort = desc.length > 80 ? desc.substring(0, 80) + '...' : desc;
            const icon = scripto.tags && scripto.tags[0] ? getTagIcon(scripto.tags[0]) : '📜';
            
            return `
                <a href="${{detailUrl}}" class="scripto-card">
                    <div class="scripto-header">
                        <div class="scripto-icon">${{icon}}</div>
                        <div class="scripto-title">
                            <div class="scripto-name">${{scripto.name}}</div>
                            <div class="scripto-author">by ${{scripto.author || 'Unknown'}}</div>
                        </div>
                    </div>
                    <div class="scripto-description">${{descShort}}</div>
                    <div class="scripto-footer">
                        <div class="scripto-tags">${{tags}}</div>
                        <span class="scripto-version">v${{version}}</span>
                    </div>
                </a>
            `;
        }}
        
        function filterAndDisplay() {{
            let filtered = scriptos.filter(s => 
                matchesSearch(s, searchQuery) && matchesTag(s, activeTag)
            );
            
            if (filtered.length > 0) {{
                grid.innerHTML = filtered.map(s => generateCardHTML(s)).join('');
                grid.style.display = 'grid';
                noResults.style.display = 'none';
            }} else {{
                grid.style.display = 'none';
                noResults.style.display = 'block';
            }}
            
            statsCount.textContent = filtered.length;
        }}
        
        searchInput.addEventListener('input', (e) => {{
            searchQuery = e.target.value;
            filterAndDisplay();
        }});
        
        tagFilters.forEach(filter => {{
            filter.addEventListener('click', (e) => {{
                e.preventDefault();
                tagFilters.forEach(f => f.classList.remove('active'));
                filter.classList.add('active');
                activeTag = filter.dataset.tag;
                filterAndDisplay();
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

def generate_card_html(scripto):
    """Generate card HTML for list page"""
    slug = slugify(scripto['name'])
    detail_url = f"scriptos/{slug}.html"
    version = '.'.join(map(str, scripto.get('version', [1, 0, 0])))
    tags = scripto.get('tags', [])
    tags_html = ''.join(f'<span class="scripto-tag">{tag}</span>' for tag in tags[:2])
    description = (scripto.get('description', '') or '')[:80]
    if len(scripto.get('description', '') or '') > 80:
        description += '...'
    
    # Get icon based on first tag
    icon = get_tag_icon(tags[0]) if tags else '📜'
    
    return f"""            <a href="{detail_url}" class="scripto-card">
                <div class="scripto-header">
                    <div class="scripto-icon">{icon}</div>
                    <div class="scripto-title">
                        <div class="scripto-name">{scripto['name']}</div>
                        <div class="scripto-author">by {scripto.get('author', 'Unknown')}</div>
                    </div>
                </div>
                <div class="scripto-description">{description}</div>
                <div class="scripto-footer">
                    <div class="scripto-tags">{tags_html}</div>
                    <span class="scripto-version">v{version}</span>
                </div>
            </a>"""

def generate_detail_page(scripto, output_path):
    """Generate individual detail page (like /packages/aioble)"""
    slug = slugify(scripto['name'])
    detail_dir = output_path / 'scriptos'
    detail_dir.mkdir(exist_ok=True)
    
    version = '.'.join(map(str, scripto.get('version', [1, 0, 0])))
    tags = scripto.get('tags', [])
    tags_html = ''.join(f'<span class="scripto-tag">{get_tag_icon(tag)} {tag}</span>' for tag in tags)
    author = scripto.get('author', 'Unknown')
    description = scripto.get('description', '')
    docs = scripto.get('docs', '')
    url = scripto.get('url', '')
    license = scripto.get('license', 'MIT')
    icon = get_tag_icon(tags[0]) if tags else '📜'
    
    # Configure URL for ScriptO Studio (production)
    configure_url = f"https://scriptostudio.com/app/?configure={quote(url)}" if url else "#"
    
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{scripto['name']} - ScriptO Registry</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        :root {{
            --primary: #e85d04;
            --primary-dark: #d45403;
            --primary-light: #ff7b2e;
            --primary-glow: rgba(232, 93, 4, 0.3);
            --accent: #f9844a;
            --bg-dark: #0f0f0f;
            --bg-card: rgba(255, 255, 255, 0.03);
            --text-primary: #ffffff;
            --text-secondary: rgba(255, 255, 255, 0.7);
            --text-muted: rgba(255, 255, 255, 0.5);
            --border: rgba(255, 255, 255, 0.08);
        }}
        
        body {{
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: var(--bg-dark);
            color: var(--text-primary);
            line-height: 1.6;
            min-height: 100vh;
            zoom: 0.75;
        }}
        
        body::before {{
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
                radial-gradient(ellipse at 10% 20%, rgba(232, 93, 4, 0.08) 0%, transparent 50%),
                radial-gradient(ellipse at 90% 80%, rgba(249, 132, 74, 0.06) 0%, transparent 50%);
            pointer-events: none;
            z-index: -1;
        }}
        
        .header {{
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
            padding: 1.25rem 2rem;
            position: relative;
            overflow: hidden;
        }}
        
        .header a {{
            color: white;
            text-decoration: none;
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            transition: opacity 0.2s;
        }}
        
        .header a:hover {{
            opacity: 0.8;
        }}
        
        .container {{
            max-width: 900px;
            margin: 2rem auto;
            padding: 0 1.5rem;
        }}
        
        .detail-card {{
            background: var(--bg-card);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-radius: 20px;
            border: 1px solid var(--border);
            padding: 2.5rem;
            position: relative;
            overflow: hidden;
        }}
        
        .detail-card::before {{
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, var(--primary), var(--accent));
        }}
        
        .detail-header {{
            display: flex;
            align-items: center;
            gap: 1.5rem;
            border-bottom: 1px solid var(--border);
            padding-bottom: 2rem;
            margin-bottom: 2rem;
        }}
        
        .detail-icon {{
            font-size: 2.5rem;
            width: 80px;
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, var(--primary), var(--accent));
            border-radius: 20px;
            flex-shrink: 0;
        }}
        
        .detail-title {{
            flex: 1;
        }}
        
        .detail-title h1 {{
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            letter-spacing: -0.02em;
        }}
        
        .detail-meta {{
            color: var(--text-muted);
            font-size: 0.95rem;
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
        }}
        
        .detail-meta span {{
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
        }}
        
        .detail-description {{
            margin: 1.5rem 0;
            line-height: 1.8;
            color: var(--text-secondary);
            font-size: 1.05rem;
        }}
        
        .detail-tags {{
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin: 1.5rem 0;
        }}
        
        .scripto-tag {{
            padding: 0.5rem 1rem;
            background: rgba(232, 93, 4, 0.15);
            color: var(--accent);
            border-radius: 100px;
            font-size: 0.85rem;
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            gap: 0.375rem;
        }}
        
        .detail-info {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 1rem;
            margin: 2rem 0;
            padding: 1.5rem;
            background: rgba(255, 255, 255, 0.02);
            border-radius: 12px;
            border: 1px solid var(--border);
        }}
        
        .info-item {{
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
        }}
        
        .info-label {{
            font-size: 0.8rem;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }}
        
        .info-value {{
            font-weight: 600;
            color: var(--text-primary);
        }}
        
        .info-value a {{
            color: var(--primary);
            text-decoration: none;
        }}
        
        .info-value a:hover {{
            text-decoration: underline;
        }}
        
        .detail-actions {{
            display: flex;
            gap: 1rem;
            margin-top: 2.5rem;
            padding-top: 2rem;
            border-top: 1px solid var(--border);
            flex-wrap: wrap;
        }}
        
        .btn {{
            padding: 0.875rem 1.75rem;
            border: none;
            border-radius: 12px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            font-family: inherit;
        }}
        
        .btn-primary {{
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
            color: white;
            box-shadow: 0 4px 15px var(--primary-glow);
        }}
        
        .btn-primary:hover {{
            transform: translateY(-2px);
            box-shadow: 0 8px 25px var(--primary-glow);
        }}
        
        .btn-secondary {{
            background: rgba(255, 255, 255, 0.05);
            color: var(--text-primary);
            border: 1px solid var(--border);
        }}
        
        .btn-secondary:hover {{
            background: rgba(255, 255, 255, 0.1);
            border-color: var(--primary);
        }}
        
        @media (max-width: 768px) {{
            .detail-header {{
                flex-direction: column;
                text-align: center;
            }}
            
            .detail-title h1 {{
                font-size: 1.5rem;
            }}
            
            .detail-meta {{
                justify-content: center;
            }}
            
            .detail-actions {{
                flex-direction: column;
            }}
            
            .btn {{
                width: 100%;
                justify-content: center;
            }}
        }}
    </style>
</head>
<body>
    <div class="header">
        <a href="../index.html">← Back to ScriptO Registry</a>
    </div>
    
    <div class="container">
        <div class="detail-card">
            <div class="detail-header">
                <div class="detail-icon">{icon}</div>
                <div class="detail-title">
                    <h1>{scripto['name']}</h1>
                    <div class="detail-meta">
                        <span>👤 {author}</span>
                        <span>📦 v{version}</span>
                        <span>📄 {license}</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-description">
                {description or 'No description provided.'}
            </div>
            
            <div class="detail-tags">
                {tags_html if tags_html else '<span class="scripto-tag">📦 Uncategorized</span>'}
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
                <a href="{configure_url}" class="btn btn-primary">🚀 Open in ScriptO Studio</a>
                {f'<a href="{docs}" target="_blank" class="btn btn-secondary">📖 Documentation</a>' if docs else ''}
                <a href="{url}" target="_blank" class="btn btn-secondary">📄 View Source</a>
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
    parser.add_argument('--index', default='registry/index.json', help='Input index.json file')
    parser.add_argument('--output', default='registry/catalogue', help='Output directory')
    parser.add_argument('--scriptos-dir', default='registry/ScriptOs', help='ScriptOs source directory')
    
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
