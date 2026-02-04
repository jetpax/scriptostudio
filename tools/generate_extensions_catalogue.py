#!/usr/bin/env python3
"""
Generate browsable HTML catalogue for Extensions
Reads index.json and generates:
- extensions-catalogue/index.html (main list page)
- extensions-catalogue/extensions/{id}.html (individual detail pages)
"""

import json
import os
import shutil
from pathlib import Path
from urllib.parse import quote

def load_index(index_file='index.json'):
    """Load index.json"""
    with open(index_file, 'r', encoding='utf-8') as f:
        return json.load(f)

def slugify(name):
    """Convert name to URL-friendly slug"""
    slug = name.replace(' ', '-').lower()
    slug = ''.join(c if c.isalnum() or c == '-' else '' for c in slug)
    return slug

def format_timestamp(timestamp):
    """Format Unix timestamp to readable date"""
    from datetime import datetime
    if timestamp:
        dt = datetime.fromtimestamp(timestamp)
        return dt.strftime('%Y-%m-%d %H:%M:%S UTC')
    return 'Unknown'

def generate_list_page(extensions, index, output_path):
    """Generate main list page for extensions"""
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Extensions Catalogue - ScriptO Studio</title>
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
            --primary: #8e44ad;
            --primary-dark: #7d3c98;
            --primary-light: #a569bd;
            --primary-glow: rgba(142, 68, 173, 0.3);
            --accent: #9b59b6;
            --bg-dark: #0a0a0f;
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
                radial-gradient(ellipse at 80% 10%, rgba(142, 68, 173, 0.1) 0%, transparent 50%),
                radial-gradient(ellipse at 20% 90%, rgba(155, 89, 182, 0.08) 0%, transparent 50%);
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
        
        .stats {{
            margin-top: 1rem;
            color: var(--text-muted);
            font-size: 0.9rem;
        }}
        
        .extensions-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
            gap: 1.25rem;
        }}
        
        .extension-card {{
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
        
        .extension-card::before {{
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
        
        .extension-card:hover {{
            transform: translateY(-4px);
            border-color: var(--border-hover);
            background: var(--bg-card-hover);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 0 30px var(--primary-glow);
        }}
        
        .extension-card:hover::before {{
            opacity: 1;
        }}
        
        .extension-header {{
            display: flex;
            align-items: flex-start;
            gap: 1rem;
            margin-bottom: 0.75rem;
        }}
        
        .extension-icon {{
            font-size: 1.75rem;
            width: 52px;
            height: 52px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, var(--primary), var(--accent));
            border-radius: 14px;
            flex-shrink: 0;
        }}
        
        .extension-title {{
            flex: 1;
            min-width: 0;
        }}
        
        .extension-name {{
            font-size: 1.15rem;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 0.25rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }}
        
        .extension-author {{
            font-size: 0.8rem;
            color: var(--text-muted);
        }}
        
        .extension-description {{
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
        
        .extension-footer {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 1rem;
            border-top: 1px solid var(--border);
            gap: 0.75rem;
        }}
        
        .extension-version {{
            font-size: 0.8rem;
            color: var(--text-muted);
            font-weight: 500;
        }}
        
        .extension-badge {{
            padding: 0.3rem 0.75rem;
            background: rgba(8, 145, 178, 0.15);
            color: var(--accent);
            border-radius: 100px;
            font-size: 0.7rem;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
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
            
            .extensions-grid {{
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
            <h1>🔌 Extensions Catalogue</h1>
            <p>Full-featured applications and integrations for <a href="https://scriptostudio.com" style="color: inherit; text-decoration: underline;">ScriptO Studio</a></p>
        </div>
    </div>
    
    <div class="container">
        <div class="controls">
            <div class="search-box">
                <span class="search-icon">🔍</span>
                <input type="text" id="search-input" class="search-input" placeholder="Search extensions by name, description, or author...">
            </div>
            <div class="stats" id="stats">
                Showing <span id="count">{len(extensions)}</span> of {len(extensions)} Extensions
            </div>
        </div>
        
        <div class="extensions-grid" id="extensions-grid">
{chr(10).join(generate_card_html(ext) for ext in extensions)}
        </div>
        
        <div class="no-results" id="no-results" style="display: none;">
            <div class="no-results-icon">🔍</div>
            <p>No extensions found matching your search.</p>
        </div>
    </div>
    
    <div class="footer">
        <p>Last updated: {format_timestamp(index.get('updated', 0))}</p>
        <div class="footer-links">
            <a href="https://github.com/jetpax/scriptostudio/tree/main/registry">View on GitHub</a>
            <a href="../catalogue/">Browse ScriptOs</a>
        </div>
    </div>
    
    <script>
        const extensions = {json.dumps(extensions)};
        
        const searchInput = document.getElementById('search-input');
        const grid = document.getElementById('extensions-grid');
        const noResults = document.getElementById('no-results');
        const statsCount = document.getElementById('count');
        
        let searchQuery = '';
        
        function formatVersion(version) {{
            if (Array.isArray(version)) {{
                return version.join('.');
            }}
            return version || '1.0.0';
        }}
        
        function matchesSearch(extension, query) {{
            if (!query) return true;
            const q = query.toLowerCase();
            return (
                extension.name.toLowerCase().includes(q) ||
                (extension.description || '').toLowerCase().includes(q) ||
                (extension.author || '').toLowerCase().includes(q) ||
                (extension.id || '').toLowerCase().includes(q)
            );
        }}
        
        function slugify(name) {{
            return name.replace(/[^a-z0-9]/gi, '-').toLowerCase();
        }}
        
        function generateCardHTML(ext) {{
            const detailUrl = `extensions/${{slugify(ext.id || ext.name)}}.html`;
            const version = formatVersion(ext.version);
            const hasLib = ext.mipPackage ? '<span class="extension-badge">📦 Device Library</span>' : '';
            const icon = ext.iconSvg ? ext.iconSvg : '🔌';
            
            return `
                <a href="${{detailUrl}}" class="extension-card">
                    <div class="extension-header">
                        <div class="extension-icon">${{icon}}</div>
                        <div class="extension-title">
                            <div class="extension-name">${{ext.name}}</div>
                            <div class="extension-author">by ${{ext.author || 'Unknown'}}</div>
                        </div>
                    </div>
                    <div class="extension-description">
                        ${{ext.description || 'No description provided.'}}
                    </div>
                    <div class="extension-footer">
                        <span class="extension-version">v${{version}}</span>
                        ${{hasLib}}
                    </div>
                </a>
            `;
        }}
        
        function filterExtensions() {{
            const filtered = extensions.filter(e => matchesSearch(e, searchQuery));
            
            if (filtered.length > 0) {{
                grid.innerHTML = filtered.map(e => generateCardHTML(e)).join('');
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
            filterExtensions();
        }});
    </script>
</body>
</html>
"""
    
    html_file = output_path / 'index.html'
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(html)
    
    print(f"✓ Generated {html_file}")

def generate_card_html(extension):
    """Generate card HTML for list page"""
    slug = slugify(extension.get('id') or extension['name'])
    detail_url = f"extensions/{slug}.html"
    version = '.'.join(map(str, extension.get('version', [1, 0, 0])))
    has_lib = '<span class="extension-badge">📦 Device Library</span>' if extension.get('mipPackage') else ''
    icon = extension.get('iconSvg', '🔌')
    
    return f"""            <a href="{detail_url}" class="extension-card">
                <div class="extension-header">
                    <div class="extension-icon">{icon}</div>
                    <div class="extension-title">
                        <div class="extension-name">{extension['name']}</div>
                        <div class="extension-author">by {extension.get('author', 'Unknown')}</div>
                    </div>
                </div>
                <div class="extension-description">
                    {extension.get('description', 'No description provided.')}
                </div>
                <div class="extension-footer">
                    <span class="extension-version">v{version}</span>
                    {has_lib}
                </div>
            </a>"""

def generate_detail_page(extension, output_path):
    """Generate individual detail page for an extension"""
    slug = slugify(extension.get('id') or extension['name'])
    detail_dir = output_path / 'extensions'
    detail_dir.mkdir(exist_ok=True)
    
    version = '.'.join(map(str, extension.get('version', [1, 0, 0])))
    author = extension.get('author', 'Unknown')
    description = extension.get('description', 'No description provided.')
    # Build GitHub source URL from directory in the url field (preserves correct case)
    url = extension.get('url', '')
    dir_name = ''
    if '/registry/Extensions/' in url:
        after_extensions = url.split('/registry/Extensions/')[-1]
        dir_name = after_extensions.split('/')[0] if after_extensions else ''
    github_url = f"https://github.com/jetpax/scriptostudio/tree/main/registry/Extensions/{dir_name}" if dir_name else url
    icon = extension.get('iconSvg', '🔌')
    menu = extension.get('menu', [])
    mip_package = extension.get('mipPackage', '')
    
    # Generate menu tabs HTML
    menu_html = ''
    if menu:
        menu_items = ''.join(f'<li><strong>{item.get("label", item.get("id", "Tab"))}</strong></li>' for item in menu)
        menu_html = f"""
            <div class="detail-section">
                <h3>Features & Tabs</h3>
                <ul class="feature-list">
                    {menu_items}
                </ul>
            </div>
        """
    
    # Device library info
    lib_html = ''
    if mip_package:
        lib_html = f"""
            <div class="detail-section">
                <h3>Device-Side Library</h3>
                <p style="margin-bottom: 1rem;">This extension includes Python libraries that run on your ESP32 device.</p>
                <div class="code-block">
                    <code>{mip_package}</code>
                </div>
                <p class="note">The library will be automatically installed when you add this extension.</p>
            </div>
        """
    
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{extension['name']} - Extensions Catalogue</title>
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
            --primary: #8e44ad;
            --primary-dark: #7d3c98;
            --primary-light: #a569bd;
            --primary-glow: rgba(142, 68, 173, 0.3);
            --accent: #9b59b6;
            --bg-dark: #0a0a0f;
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
                radial-gradient(ellipse at 80% 10%, rgba(142, 68, 173, 0.1) 0%, transparent 50%),
                radial-gradient(ellipse at 20% 90%, rgba(155, 89, 182, 0.08) 0%, transparent 50%);
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
        
        .detail-section {{
            margin: 2rem 0;
        }}
        
        .detail-section h3 {{
            font-size: 1.15rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: var(--accent);
        }}
        
        .feature-list {{
            list-style: none;
            padding-left: 0;
        }}
        
        .feature-list li {{
            padding: 0.625rem 0;
            padding-left: 1.75rem;
            position: relative;
            color: var(--text-secondary);
        }}
        
        .feature-list li:before {{
            content: "✓";
            position: absolute;
            left: 0;
            color: var(--accent);
            font-weight: bold;
        }}
        
        .code-block {{
            background: rgba(0, 0, 0, 0.5);
            color: var(--accent);
            padding: 1rem 1.25rem;
            border-radius: 10px;
            overflow-x: auto;
            margin: 1rem 0;
            border: 1px solid var(--border);
        }}
        
        .code-block code {{
            font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
            font-size: 0.9rem;
        }}
        
        .note {{
            background: rgba(8, 145, 178, 0.1);
            border-left: 4px solid var(--primary);
            padding: 1rem 1.25rem;
            margin: 1rem 0;
            border-radius: 0 8px 8px 0;
            font-size: 0.95rem;
            color: var(--text-secondary);
        }}
        
        .install-info {{
            background: rgba(34, 211, 238, 0.08);
            border: 1px solid rgba(34, 211, 238, 0.2);
            border-radius: 12px;
            padding: 1.25rem 1.5rem;
            margin-top: 1.5rem;
            font-size: 0.95rem;
            color: var(--text-secondary);
        }}
        
        .install-info strong {{
            color: var(--accent);
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
        <a href="../index.html">← Back to Extensions Catalogue</a>
    </div>
    
    <div class="container">
        <div class="detail-card">
            <div class="detail-header">
                <div class="detail-icon">{icon}</div>
                <div class="detail-title">
                    <h1>{extension['name']}</h1>
                    <div class="detail-meta">
                        <span>👤 {author}</span>
                        <span>📦 v{version}</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-description">
                {description}
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
                    <span class="info-label">Extension ID</span>
                    <span class="info-value">{extension.get('id', 'N/A')}</span>
                </div>
            </div>
            
            {menu_html}
            {lib_html}
            
            <div class="install-info">
                <strong>Installation:</strong> Open ScriptO Studio, click the Extensions button (or the + next to EXTENSIONS in the sidebar), 
                search for "{extension['name']}", and click Install. The extension and any device-side libraries will be installed automatically.
            </div>
            
            <div class="detail-actions">
                <a href="{github_url}" target="_blank" class="btn btn-primary">📂 View Source Code</a>
                <a href="../index.html" class="btn btn-secondary">← Back to Catalogue</a>
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

def generate_html_catalogue(index, output_dir='extensions-catalogue', extensions_dir='Extensions'):
    """Generate HTML catalogue with list and detail pages for extensions"""
    extensions = index.get('extensions', [])
    
    if not extensions:
        print("⚠ No extensions found in index.json")
        return False
    
    # Create output directory
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)
    extensions_output = output_path / 'extensions'
    extensions_output.mkdir(exist_ok=True)
    
    # Copy extension files to catalogue (optional - for source viewing)
    extensions_source = Path(extensions_dir)
    if extensions_source.exists():
        for extension in extensions:
            filename = extension.get('filename', '')
            if filename:
                ext_files = list(extensions_source.glob(f"**/{filename}"))
                if ext_files:
                    source_file = ext_files[0]
                    ext_id = extension.get('id', slugify(extension['name']))
                    ext_dir = extensions_output / ext_id
                    ext_dir.mkdir(exist_ok=True)
                    shutil.copy2(source_file, ext_dir / filename)
    
    # Generate main list page
    print("Generating extensions list page...")
    generate_list_page(extensions, index, output_path)
    
    # Generate detail pages
    print("Generating extension detail pages...")
    for extension in extensions:
        generate_detail_page(extension, output_path)
    
    print(f"\n✓ Extensions catalogue generated successfully!")
    return True

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Generate Extensions HTML catalogue')
    parser.add_argument('--index', default='registry/index.json', help='Input index.json file')
    parser.add_argument('--output', default='registry/extensions-catalogue', help='Output directory')
    parser.add_argument('--extensions-dir', default='registry/Extensions', help='Extensions source directory')
    
    args = parser.parse_args()
    
    # Load index
    print(f"Loading {args.index}...")
    index = load_index(args.index)
    
    # Generate catalogue
    print(f"Generating extensions catalogue in {args.output}...")
    generate_html_catalogue(index, args.output, args.extensions_dir)
    
    print(f"\n✓ Extensions catalogue generated successfully!")

if __name__ == '__main__':
    main()
