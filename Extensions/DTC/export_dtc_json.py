#!/usr/bin/env python3
"""
Export dtc_codes.db to compact JSON for DTC.js extension
"""

import json
import sqlite3
import os

# Path to dtc-database
DB_PATH = '/Users/jep/github/dtc-database/data/dtc_codes.db'
OUTPUT_PATH = '/Users/jep/github/scripto-studio-registry/Extensions/DTC/data/dtc_codes.json'

def export_to_json():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('SELECT code, description, type, manufacturer FROM dtc_definitions')
    
    dtc_db = {}
    for code, desc, type_, mfr in cursor.fetchall():
        # Use compact keys: d=description, t=type, m=manufacturer
        entry = {"d": desc}
        if type_:
            entry["t"] = type_
        if mfr:
            entry["m"] = mfr
        dtc_db[code] = entry
    
    conn.close()
    
    # Write compact JSON (no pretty print, minimal separators)
    with open(OUTPUT_PATH, 'w') as f:
        json.dump(dtc_db, f, separators=(',', ':'))
    
    # Report size
    size_bytes = os.path.getsize(OUTPUT_PATH)
    print(f"Exported {len(dtc_db)} DTCs to {OUTPUT_PATH}")
    print(f"File size: {size_bytes:,} bytes ({size_bytes/1024/1024:.2f} MB)")

if __name__ == '__main__':
    export_to_json()
