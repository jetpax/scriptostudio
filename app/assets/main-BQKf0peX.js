const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/tree-sitter-DllzGrkJ.js","assets/vendor-BlQEGJgO.js","assets/vendor-CeCKEaxg.js","assets/vendor-HOZhAhrT.css","assets/index-BalQ1Nwo.js","assets/index-DXz9816u.js","assets/index-C67KyK7a.js","assets/index-BlIhKDWf.js","assets/index-DdUpN0Lu.js","assets/index-ByjkoLU-.js","assets/xterm-DOrYoP_4.css"])))=>i.map(i=>d[i]);
import{PANEL_TOO_SMALL as bt,PANEL_CLOSED as oe,PANEL_DEFAULT as Ge}from"./vendor-BlQEGJgO.js";import{c as me,C as Ct,h as C,a as xt,b as St}from"./vendor-CeCKEaxg.js";(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))o(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const c of s.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&o(c)}).observe(document,{childList:!0,subtree:!0});function t(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(i){if(i.ep)return;i.ep=!0;const s=t(i);fetch(i.href,s)}})();function de(e){const n="# === START_CONFIG_PARAMETERS ===",t="# === END_CONFIG_PARAMETERS ===",o=e.indexOf(n),i=e.indexOf(t);if(o===-1||i===-1)return console.warn("[ScriptOs Parser] Config markers not found"),null;const s=e.substring(o+n.length,i).trim();try{return Et(s)}catch(c){return console.error("[ScriptOs Parser] Failed to parse config:",c),null}}function Et(e){let n=e.trim();n.startsWith("dict(")&&n.endsWith(")")&&(n=n.substring(5,n.length-1).trim()),n=n.split(`
`).map(i=>{let s=!1,c=null,r=!1;for(let a=0;a<i.length;a++){const l=i[a];if(r){r=!1;continue}if(l==="\\"){r=!0;continue}if((l==='"'||l==="'"||l==="`")&&!s){s=!0,c=l;continue}if(l===c&&s){s=!1,c=null;continue}if(l==="#"&&!s)return i.substring(0,a)}return i}).join(`
`),n=n.replace(/\\\s*[\r\n]+\s*/g," ");let t="{";const o=ue(n,",");for(let i=0;i<o.length;i++){const s=o[i].trim();if(!s)continue;const c=s.indexOf("=");if(c===-1)continue;const r=s.substring(0,c).trim();let a=s.substring(c+1).trim();a=pe(a),i>0&&(t+=","),t+=`"${r}":${a}`}return t+="}",JSON.parse(t)}function ue(e,n){const t=[];let o="",i=0,s=!1,c=null,r=!1;for(let a=0;a<e.length;a++){const l=e[a],d=a>0?e[a-1]:"";if(r){o+=l,r=!1;continue}if(l==="\\"){r=!0,o+=l;continue}if((l==='"'||l==="'"||l==="`")&&!s){s=!0,c=l,o+=l;continue}if(l===c&&s&&d!=="\\"){s=!1,c=null,o+=l;continue}if(s){o+=l;continue}if(l==="("||l==="["||l==="{"?i++:(l===")"||l==="]"||l==="}")&&i--,l===n&&i===0){t.push(o),o="";continue}o+=l}return o.trim()&&t.push(o),t}function pe(e){if(e=e.trim(),e==="None")return"null";if(e==="True")return"true";if(e==="False")return"false";if(/^-?\d+(\.\d+)?$/.test(e))return e;if(e.startsWith("[")&&e.endsWith("]")){const n=e.substring(1,e.length-1);return"["+ue(n,",").map(i=>pe(i)).join(",")+"]"}if(e.startsWith("(")&&e.endsWith(")")){const n=e.substring(1,e.length-1);return"["+ue(n,",").map(i=>pe(i)).join(",")+"]"}if(e.startsWith("dict(")&&e.endsWith(")")){const n=e.substring(5,e.length-1);return $t(n)}if(e.startsWith("{")&&e.endsWith("}")){const n=e.substring(1,e.length-1);return kt(n)}if(e.includes("+")){const n=e.split("+").map(t=>{const o=t.trim();return o.startsWith("'")||o.startsWith('"')?o.substring(1,o.length-1):o});return JSON.stringify(n.join(""))}if(e.startsWith("'''")||e.startsWith('"""')){e.substring(0,3);let n=e.substring(3,e.length-3);return n=n.replace(/\s+/g," ").trim(),JSON.stringify(n)}return e.startsWith("'")&&e.endsWith("'")||e.startsWith('"')&&e.endsWith('"')?JSON.stringify(e.substring(1,e.length-1)):e==="str"?'"str"':e==="int"?'"int"':e==="float"?'"float"':e==="bool"?'"bool"':e==="list"?'"list"':e==="dict"?'"dict"':JSON.stringify(e)}function $t(e){let n="{";const t=ue(e,",");let o=!0;for(let i=0;i<t.length;i++){const s=t[i].trim();if(!s)continue;const c=s.indexOf("=");if(c===-1)continue;const r=s.substring(0,c).trim();let a=s.substring(c+1).trim();a=pe(a),o||(n+=","),n+=`"${r}":${a}`,o=!1}return n+="}",n}function kt(e){let n="{";const t=ue(e,",");let o=!0;for(let i=0;i<t.length;i++){const s=t[i].trim();if(!s)continue;const c=s.indexOf(":");if(c===-1)continue;let r=s.substring(0,c).trim(),a=s.substring(c+1).trim();(r.startsWith("'")&&r.endsWith("'")||r.startsWith('"')&&r.endsWith('"'))&&(r=r.substring(1,r.length-1)),a=pe(a),o||(n+=","),n+=`"${r}":${a}`,o=!1}return n+="}",n}function Ze(e,n,t){const o="# === START_CONFIG_PARAMETERS ===",i="# === END_CONFIG_PARAMETERS ===",s=e.indexOf(o),c=e.indexOf(i);if(s===-1||c===-1)return e;const r=e.substring(0,s).trim(),a=e.substring(c+i.length).trim();if(!n.args||Object.keys(n.args).length===0){const p=n.info||{};let u=`# ${p.name||"ScriptO"}
`;return p.description&&(u+=`# ${p.description}
`),p.author&&(u+=`# Author: ${p.author}
`),u+=`
`,u+(r?r+`

`:"")+a}const l=n.info||{};let d=`# ${l.name||"ScriptO"}
`;l.description&&(d+=`# ${l.description}
`),l.author&&(d+=`# Author: ${l.author}
`),d+=`
`,r&&(d+=r+`

`),d+=`# Configuration
`,d+=`class args:
`;for(const p in n.args){const u=n.args[p];let f=t[p];f==null&&(f=u.value);let g;f==null?g="None":typeof f=="string"?g=`'${ln(f)}'`:typeof f=="boolean"?g=f?"True":"False":typeof f=="number"?g=f.toString():Array.isArray(f)?g="["+f.map(h=>typeof h=="string"?`'${ln(h)}'`:h).join(", ")+"]":g="None",d+=`    ${p} = ${g}
`}return d+=`
`,a&&(d+=a),d}function ln(e){return String(e).replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/\t/g,"\\t")}class _t{constructor(){this.DB_NAME="scripto-studio-files",this.DB_VERSION=1,this.STORE_FILES="files",this.rootPath="/"}async _initDB(){return new Promise((n,t)=>{const o=indexedDB.open(this.DB_NAME,this.DB_VERSION);o.onerror=()=>t(o.error),o.onsuccess=()=>n(o.result),o.onupgradeneeded=i=>{const s=i.target.result;s.objectStoreNames.contains(this.STORE_FILES)||s.createObjectStore(this.STORE_FILES)}})}_normalizePath(n){return n?(n=n.replace(this.rootPath,""),n.startsWith("/")||(n="/"+n),n!=="/"&&n.endsWith("/")&&(n=n.slice(0,-1)),n):"/"}async _getFilesInDirectory(n){const t=this._normalizePath(n),o=t==="/"?"/":t+"/",i=await this._initDB();return new Promise((s,c)=>{const l=i.transaction([this.STORE_FILES],"readonly").objectStore(this.STORE_FILES).openCursor(),d=[],p=new Set;l.onsuccess=u=>{const f=u.target.result;if(f){const g=f.key,h=f.value;if(g.startsWith(o)){const v=g.substring(o.length);if(g.endsWith("/")&&h.type==="folder"){const S=v.slice(0,-1);S&&!S.includes("/")&&!p.has(S)&&(p.add(S),d.push({path:S,type:"folder"}))}else if(v&&!v.includes("/"))d.push({path:v,type:h.type||"file",content:h.content,timestamp:h.timestamp,size:h.size});else if(v.includes("/")){const S=v.split("/")[0];p.has(S)||(p.add(S),d.push({path:S,type:"folder"}))}}f.continue()}else d.sort((g,h)=>g.type===h.type?g.path.localeCompare(h.path):g.type==="folder"?-1:1),s(d)},l.onerror=()=>c(l.error)})}async initialize(){try{return await this._initDB(),!0}catch(n){return console.error("[IDB FS] Error initializing:",n),!1}}isSupported(){return"indexedDB"in window}async openFolder(){const n=await this.ilistFiles("/");return{folder:this.rootPath,files:n}}async ilistFiles(n){try{return(await this._getFilesInDirectory(n)).map(o=>{let i=o.size;return i===void 0&&o.type==="file"&&(o.content?typeof o.content=="string"?i=new TextEncoder().encode(o.content).length:o.content instanceof ArrayBuffer?i=o.content.byteLength:o.content instanceof Uint8Array?i=o.content.length:o.content instanceof Blob&&(i=o.content.size):i=0),{path:o.path,type:o.type,size:i}})}catch(t){return console.error("[IDB FS] Error listing files:",t),[]}}async ilistAllFiles(n){try{const t=this._normalizePath(n),o=t==="/"?"/":t+"/",i=await this._initDB();return new Promise((s,c)=>{const l=i.transaction([this.STORE_FILES],"readonly").objectStore(this.STORE_FILES).openCursor(),d=[],p=new Set;l.onsuccess=u=>{const f=u.target.result;if(f){const g=f.key,h=f.value;if(g.startsWith(o)){const v=g.substring(o.length);if(v){const S=v.split("/");let P=o.slice(0,-1);for(let k=0;k<S.length;k++)P+="/"+S[k],p.has(P)||(p.add(P),k===S.length-1&&h.type==="file"?d.push({path:P,type:"file"}):k<S.length-1&&d.push({path:P,type:"folder"}))}}f.continue()}else s(d)},l.onerror=()=>c(l.error)})}catch(t){return console.error("[IDB FS] Error listing all files:",t),[]}}async loadFile(n){try{const t=this._normalizePath(n),o=await this._initDB();return new Promise((i,s)=>{const a=o.transaction([this.STORE_FILES],"readonly").objectStore(this.STORE_FILES).get(t);a.onsuccess=()=>{const l=a.result;if(!l||l.type!=="file"){s(new Error(`File not found: ${n}`));return}const d=l.content||"",u=new TextEncoder().encode(d).buffer;console.log("[IDB FS] Loaded file:",n,"(",u.byteLength,"bytes)"),i(u)},a.onerror=()=>s(a.error)})}catch(t){throw console.error("[IDB FS] Error loading file:",t),new Error(`Failed to load file: ${t.message}`)}}async saveFileContent(n,t){try{const o=this._normalizePath(n);let i=t;t instanceof Uint8Array?i=new TextDecoder().decode(t):t instanceof ArrayBuffer?i=new TextDecoder().decode(new Uint8Array(t)):t instanceof Blob?i=await t.text():typeof t!="string"&&(i=String(t));const s=await this._initDB();return new Promise((c,r)=>{const d=s.transaction([this.STORE_FILES],"readwrite").objectStore(this.STORE_FILES).put({type:"file",content:i,timestamp:Date.now(),size:new TextEncoder().encode(i).length},o);d.onsuccess=()=>{console.log("[IDB FS] Saved file:",n),c(!0)},d.onerror=()=>r(d.error)})}catch(o){throw console.error("[IDB FS] Error saving file:",o),new Error(`Failed to save file: ${o.message}`)}}async importFiles(n="/"){return new Promise((t,o)=>{const i=document.createElement("input");i.type="file",i.multiple=!0,i.accept="*/*",i.onchange=async s=>{try{const c=Array.from(s.target.files);if(c.length===0){t([]);return}const r=[];for(const a of c){const l=await a.text(),d=this.getFullPath(n,"",a.name);await this.saveFileContent(d,l),r.push({name:a.name,path:d,size:a.size}),console.log("[IDB FS] Imported file:",a.name,"→",d)}t(r)}catch(c){console.error("[IDB FS] Error importing files:",c),o(c)}},i.oncancel=()=>{t([])},i.click()})}async fileExists(n){try{const t=this._normalizePath(n),o=await this._initDB();return new Promise((i,s)=>{const a=o.transaction([this.STORE_FILES],"readonly").objectStore(this.STORE_FILES).get(t);a.onsuccess=()=>{const l=a.result;i(l&&l.type==="file")},a.onerror=()=>s(a.error)})}catch{return!1}}async folderExists(n){try{const t=this._normalizePath(n),o=t.endsWith("/")?t:t+"/",i=t==="/"?"/":t+"/",s=await this._initDB();return new Promise((c,r)=>{const l=s.transaction([this.STORE_FILES],"readonly").objectStore(this.STORE_FILES),d=l.get(o);d.onsuccess=()=>{if(d.result&&d.result.type==="folder"){c(!0);return}const p=l.openCursor();p.onsuccess=u=>{const f=u.target.result;if(f){const g=f.key;if(g.startsWith(i)&&g!==o){c(!0);return}f.continue()}else c(!1)},p.onerror=()=>r(p.error)},d.onerror=()=>r(d.error)})}catch{return!1}}async removeFile(n){try{const t=this._normalizePath(n),o=await this._initDB();return new Promise((i,s)=>{const a=o.transaction([this.STORE_FILES],"readwrite").objectStore(this.STORE_FILES).delete(t);a.onsuccess=()=>{console.log("[IDB FS] Removed file:",n),i(!0)},a.onerror=()=>s(a.error)})}catch(t){throw console.error("[IDB FS] Error removing file:",t),new Error(`Failed to remove file: ${t.message}`)}}async renameFile(n,t){try{const o=this._normalizePath(n),i=this._normalizePath(t),s=await this.loadFile(n);return await this.saveFileContent(t,s),await this.removeFile(n),console.log("[IDB FS] Renamed file:",n,"->",t),!0}catch(o){throw console.error("[IDB FS] Error renaming file:",o),new Error(`Failed to rename file: ${o.message}`)}}async createFolder(n){try{const t=this._normalizePath(n),o=t.endsWith("/")?t:t+"/",i=await this._initDB();return new Promise((s,c)=>{const a=i.transaction([this.STORE_FILES],"readwrite").objectStore(this.STORE_FILES),l=a.get(o);l.onsuccess=()=>{if(l.result){console.log("[IDB FS] Folder already exists:",n),s(!0);return}const d=a.put({type:"folder",timestamp:Date.now()},o);d.onsuccess=()=>{console.log("[IDB FS] Created folder:",n),s(!0)},d.onerror=()=>c(d.error)},l.onerror=()=>c(l.error)})}catch(t){throw console.error("[IDB FS] Error creating folder:",t),new Error(`Failed to create folder: ${t.message}`)}}async removeFolder(n){try{const t=this._normalizePath(n),o=t==="/"?"/":t+"/",i=t.endsWith("/")?t:t+"/",s=await this._initDB();return new Promise((c,r)=>{const d=s.transaction([this.STORE_FILES],"readwrite").objectStore(this.STORE_FILES).openCursor(),p=[];d.onsuccess=u=>{const f=u.target.result;if(f){const g=f.key;(g.startsWith(o)||g===t||g===i)&&p.push(f.delete()),f.continue()}else Promise.all(p).then(()=>{console.log("[IDB FS] Removed folder:",n),c(!0)}).catch(r)},d.onerror=()=>r(d.error)})}catch(t){throw console.error("[IDB FS] Error removing folder:",t),new Error(`Failed to remove folder: ${t.message}`)}}async listFiles(n){return this.ilistFiles(n)}getFullPath(n,t,o){let i=n||"/";return t&&t!=="/"&&(i+=(i.endsWith("/")?"":"/")+t.replace(/^\//,"")),o&&(i+=(i.endsWith("/")?"":"/")+o),i.startsWith("/")||(i="/"+i),i}getNavigationPath(n,t){if(t===".."){const o=n.split("/").filter(i=>i);return o.pop(),"/"+o.join("/")}return n==="/"?"/"+t:n+"/"+t}async getAppPath(){return this.rootPath}async clearWorkspace(){try{const n=await this._initDB();return new Promise((t,o)=>{const c=n.transaction([this.STORE_FILES],"readwrite").objectStore(this.STORE_FILES).clear();c.onsuccess=()=>{console.log("[IDB FS] Workspace cleared"),t()},c.onerror=()=>o(c.error)})}catch(n){console.error("[IDB FS] Error clearing workspace:",n)}}async listScriptOsFiles(){try{const n="/ScriptOs",t=await this.ilistFiles(n),o=[];console.log(`[IDB FS] Found ${t.length} items in ScriptOs directory`);for(const i of t)if(i.type==="file"&&i.path.endsWith(".py"))try{const s=n+"/"+i.path,c=await this.loadFile(s),r=new TextDecoder().decode(new Uint8Array(c)),a=de(r);a?(o.push({filename:i.path,fullPath:s,content:r,config:a}),console.log(`[IDB FS] Loaded ScriptO: ${a.info?.name||i.path}`)):console.warn(`[IDB FS] No valid config found in: ${i.path}`)}catch(s){console.error(`[IDB FS] Error loading ScriptO ${i.path}:`,s)}return console.log(`[IDB FS] Successfully loaded ${o.length} ScriptOs`),o}catch(n){return console.error("[IDB FS] Error listing ScriptOs files:",n),[]}}async hasOnboardedDevices(){try{return(await this.ilistFiles("/onboarded")).some(t=>t.type==="file"&&t.path.endsWith(".json"))}catch{return!1}}async getOnboardedDevices(){try{const n=await this.ilistFiles("/onboarded"),t=[];for(const o of n)if(o.type==="file"&&o.path.endsWith(".json"))try{const i=await this.loadFile("/onboarded/"+o.path),s=new TextDecoder().decode(new Uint8Array(i));t.push(JSON.parse(s))}catch(i){console.warn("[IDB FS] Error parsing device file:",o.path,i)}return t}catch(n){return console.error("[IDB FS] Error listing onboarded devices:",n),[]}}async addOnboardedDevice(n,t){try{await this.createFolder("/onboarded");const i="/onboarded/"+(n.replace(/:/g,"")+".json");await this.saveFileContent(i,JSON.stringify(t,null,2)),console.log("[IDB FS] Added onboarded device:",t.hostname||n)}catch(o){throw console.error("[IDB FS] Error adding onboarded device:",o),o}}}const V=new _t,Tt=`You are an expert MicroPython developer specializing in ESP32 microcontrollers.

CRITICAL: MicroPython is NOT standard Python - it has a LIMITED subset of modules.
- Many CPython modules do NOT exist (display, matplotlib, numpy, pandas, PIL, tkinter, pygame, etc.)
- Only use modules that exist in MicroPython ESP32 (machine, network, esp32, neopixel, time, math, etc.)
- For visual output, use webrepl.display_ui() with HTML/CSS/JavaScript, NOT display libraries
- NEVER import modules that don't exist in MicroPython

Your task is to generate complete, working ScriptO code based on user requests.

CRITICAL RULES - READ THIS CAREFULLY:

1. CODE GENERATION VS EXPLANATION:
   - If the user asks you to generate/create/write code → Generate complete ScriptO code in a code block
   - If the user asks you to modify/fix/change existing code → Generate the complete updated ScriptO code in a code block
   - If the user just asks a question or for clarification → Respond with text only, NO code block
   - Examples:
     * "print fibonacci numbers" → Generate ScriptO code
     * "fix the bug" → Generate corrected ScriptO code
     * "why didn't you send code?" → Respond with text explanation only
   
   IMPORTANT: Use your judgment about script naming:
   - If modifying/improving the previous script → Keep the SAME info.name
   - If creating something completely different → Use a NEW appropriate name
   - Context will tell you what the previous script was called

2. NEVER EXECUTE CODE:
   You MUST ALWAYS generate ScriptO code format, NEVER execute code or return computation results.
   Even if the user asks "print the first 30 fibonacci numbers", you should generate a ScriptO script that WILL print them when run.
   The user wants a reusable ScriptO script they can save and run multiple times, NOT the output of executing code once.
   
   WRONG: Returning "0, 1, 1, 2, 3, 5, 8, 13..." (this is execution output)
   RIGHT: Returning a Python script with the ScriptO config format that prints fibonacci numbers

IMPORTANT: ScriptO Format Requirements:

1. ALWAYS include configurable parameters in the args section when possible
   - Numbers that might need adjustment (count, delay, threshold, etc.)
   - Pin numbers for GPIO
   - Text strings (names, messages, etc.)
   - Boolean options (enable/disable features)
   - Make scripts flexible and reusable!

2. CRITICAL: Use args.paramName in your code, NOT hardcoded values!
   - If you define args.count, use args.count in the code
   - If you define args.pin, use args.pin in the code
   - The configuration system will replace args.* with user values
   - DO NOT use hardcoded values that you defined in the config!

3. Include a configuration dictionary between these exact markers (START AT COLUMN 0 - NO LEADING SPACES):

# === START_CONFIG_PARAMETERS ===
dict(
  info = dict(
    name = 'Script Name',
    version = [1, 0, 0],
    category = 'Hardware',
    description = 'Brief description',
    author = 'Your Name'
  ),
  args = dict(
    argName = dict(
      label = 'User-friendly label:',
      type = int,  # str, int, float, bool, list (for GPIO pins), or dict (for dropdowns)
      value = 10,  # default value
      optional = False
    )
  )
)
# === END_CONFIG_PARAMETERS ===

2. After the config, write the actual code that uses: args.argName

3. Type options:

   - int: Integer input

   - float: Decimal number input

   - str: Text input

   - bool: Checkbox

   - list: GPIO pin selector (shows pins: 0-48)

   - dict: Dropdown menu (use items = {'key': 'Label', ...})

4. For dict type with dropdown, include 'items':

   items = { '0': 'Option 1', '1': 'Option 2' }

5. MicroPython Module Availability (CRITICAL):

   AVAILABLE modules in MicroPython ESP32:
   - machine (GPIO, ADC, PWM, I2C, SPI, Timer, etc.)
   - network (WiFi, WLAN)
   - esp32 (httpserver, webrepl, NVS, etc.)
   - neopixel (NeoPixel LED strips)
   - time, utime
   - ujson, uos, uio
   - socket, select
   - gc (garbage collector)
   - sys
   - math
   - lib.client_helpers, lib.device_helpers (ScriptO-specific helpers)
   
   NOT AVAILABLE - DO NOT USE:
   - ❌ display (does not exist - use web UI or terminal output instead)
   - ❌ matplotlib (does not exist - use web UI with canvas/Chart.js for plotting)
   - ❌ numpy (does not exist - use basic math module)
   - ❌ pandas (does not exist)
   - ❌ PIL/Pillow (does not exist - use web UI for images)
   - ❌ tkinter (does not exist - use web UI instead)
   - ❌ pygame (does not exist)
   - ❌ Most CPython standard library modules
   
   For output/display (choose the simplest appropriate method):
   - PREFERRED for simple results: Use print() for terminal output (numbers, text, simple data)
   - Use webrepl.display_ui() ONLY for complex interactive UIs (forms, charts, real-time updates, multiple controls)
   - Use web UI with HTML5 Canvas or Chart.js ONLY when user explicitly asks for visual plots/charts
   - If unclear whether to use print() or web UI, prefer print() for simplicity
   - NEVER try to import display, matplotlib, or GUI libraries

6. Common ESP32 hardware patterns:

   - GPIO: Use machine.Pin(args.pin, machine.Pin.OUT)

   - ADC: Use machine.ADC(machine.Pin(args.pin))

   - PWM: Use machine.PWM(machine.Pin(args.pin), freq=args.frequency)

   - NeoPixel: from neopixel import NeoPixel; np = NeoPixel(Pin(args.pin), args.count)

   - I2C: machine.I2C(0, scl=Pin(args.scl), sda=Pin(args.sda))

   - SPI: machine.SPI(1, baudrate=args.baudrate, sck=Pin(args.sck), mosi=Pin(args.mosi), miso=Pin(args.miso))

7. Always include proper error handling and interrupt support (try/except KeyboardInterrupt)

8. Add helpful comments explaining what the code does

9. Output Method Selection (IMPORTANT - choose the simplest approach):

   PREFERRED: Use print() for simple output:
   - Numbers, text, simple data structures
   - Lists, dictionaries, sensor readings
   - Status messages, logs
   - Simple calculations and results
   - Example: "print fibonacci numbers" → use print() statements
   
   Use webrepl.display_ui() when user requests:
   - "web UI", "web interface", "HTML interface", "browser interface"
   - "interactive UI", "buttons", "forms", "controls", "sliders"
   - "chart", "plot", "visualization", "graph" (any visual output)
   - "display", "show in UI", "web page"
   - Complex multi-component interfaces with real-time updates
   
   CRITICAL: When generating ANY web UI (HTML, charts, plots, visualizations):
   - MUST use esp32.httpserver.on() to register the route
   - MUST use webrepl.display_ui() to open it in ScriptO Studio
   - MUST use getDeviceURL() to get the correct URL
   - NEVER use raw socket servers or manual HTTP handling
   - NEVER just print URLs and expect users to open browsers manually
   
   Decision rules (apply in order):
   1. User asks for "plot", "chart", "graph", "visualization", "display", "show" → Use webrepl.display_ui() with web UI
   2. User explicitly says "web UI", "HTML", "web interface", "browser" → Use webrepl.display_ui()
   3. User asks for interactive controls/forms/buttons → Use webrepl.display_ui()
   4. Simple text/numbers only → Use print() for simplicity
   
10. ScriptO Studio UI Display Feature (REQUIRED for any web UI/chart/plot):

   CRITICAL: When generating ANY web-based UI, chart, plot, or visualization:
   - You MUST use this pattern - NEVER use raw sockets or manual HTTP servers
   - The device serves HTML via esp32.httpserver.on('/route', handler, 'GET')
   - CRITICAL: Always include the HTTP method ('GET') as the third parameter to httpserver.on()
   - MUST use webrepl.display_ui(url, title) to automatically open UI in ScriptO Studio
   - MUST use lib.client_helpers.getDeviceURL() to auto-detect HTTP/HTTPS
   - Set silent = True in config for UI-based ScriptOs (hide internal prints)
   
   REQUIRED pattern (ALWAYS use this for web UIs):
     \`\`\`python
     from esp32 import httpserver, webrepl
     from lib.client_helpers import getDeviceURL
     
     # HTTP handler returns HTML
     def my_ui_handler(uri, post_data=None):
         html = '<html><body><h1>Hello!</h1></body></html>'
         return html
     
     # Unregister route first (if it exists) to avoid conflicts
     try:
         httpserver.off('/my_ui', 'GET')
     except:
         pass
     
     # Register HTTP route - MUST include 'GET' as third parameter
     httpserver.on('/my_ui', my_ui_handler, 'GET')
     
     # Display UI in Studio (auto-detects HTTP/HTTPS) - REQUIRED!
     url = getDeviceURL('/my_ui')
     webrepl.display_ui(url, 'My UI Title')
     \`\`\`
   
   FORBIDDEN patterns (NEVER use these):
   - ❌ Raw socket servers (socket.socket(), socket.bind(), etc.)
   - ❌ Manual HTTP request parsing
   - ❌ Printing URLs and asking users to open browsers manually
   - ❌ Using socket.listen() or socket.accept() for HTTP
   
   HTML can include inline CSS/JavaScript for interactive UIs
   ALWAYS unregister routes with httpserver.off() before registering to avoid conflicts`;class Pt{constructor(){this.registryExamples=null,this.registryUrl="https://scriptostudio.com/registry/index.json",this.systemPrompt=Tt,this.systemPrompt||console.warn("[AIBridge] System prompt not loaded")}async testConnection(n){const{provider:t,apiKey:o,model:i,endpoint:s}=n;if(!o)throw new Error("API key is required");try{const c=await this.makeRequest("Hi! Just testing the connection.",[],n,!0);return{success:!0}}catch(c){throw new Error(c.message||"Connection test failed")}}async fetchRegistryExamples(){if(this.registryExamples)return this.registryExamples;try{console.log("[AIBridge] Fetching registry examples...");const n=await fetch(this.registryUrl);if(!n.ok)throw new Error("Failed to fetch registry");const t=await n.json(),o=[],i=["UI Plugins","GPIO","Hardware","Utilities"];for(const s of i){const c=t.scriptos.find(r=>r.tags&&r.tags.includes(s));if(c){const r=await fetch(c.url);if(r.ok){const a=await r.text();o.push({name:c.name,category:s,code:a})}}}return this.registryExamples=o,console.log(`[AIBridge] Loaded ${o.length} registry examples`),o}catch(n){return console.warn("[AIBridge] Failed to fetch registry examples:",n),[]}}async generateCode(n,t,o){await this.fetchRegistryExamples();const i=this.buildMessages(n,t,o);try{const s=await this.makeRequest(n,i,o,!1);console.log("[AIBridge] Raw AI response:",s.substring(0,200)+"...");const c=this.extractCode(s);return console.log("[AIBridge] Extracted code:",c?"YES ("+c.length+" chars)":"NO CODE FOUND"),c&&(console.log("[AIBridge] Extracted code (first 300 chars):",c.substring(0,300)),console.log("[AIBridge] Code has START marker:",c.includes("# === START_CONFIG_PARAMETERS ===")),console.log("[AIBridge] Code has END marker:",c.includes("# === END_CONFIG_PARAMETERS ==="))),{content:s,code:c}}catch(s){throw console.error("[AIBridge] Error generating code:",s),s}}buildMessages(n,t,o){const i=[];let s=o.systemPrompt&&typeof o.systemPrompt=="string"&&o.systemPrompt.trim().length>0?o.systemPrompt.trim():this.systemPrompt;if(this.registryExamples&&this.registryExamples.length>0){s+=`

REAL-WORLD EXAMPLES FROM REGISTRY:

`,s+=`Study these actual ScriptOs from the registry to learn the patterns:

`;for(const a of this.registryExamples){s+=`Example: ${a.name} (${a.category})
`,s+="```python\n";const l=a.code.length>500?a.code.substring(0,500)+`
# ... (rest of code omitted)
`:a.code;s+=l,s+="```\n\n"}s+=`Use these examples as reference for proper ScriptO format, patterns, and best practices.
`}console.log("[AIBridge] Using system prompt:",s===this.systemPrompt?"DEFAULT (ScriptO format)":"CUSTOM","| Length:",s.length,"chars",this.registryExamples?`| ${this.registryExamples.length} registry examples`:""),(o.provider==="openai"||o.provider==="grok"||o.provider==="openrouter"||o.provider==="custom")&&i.push({role:"system",content:s}),t.slice(-10).filter(a=>a.role==="user"||a.role==="assistant").forEach(a=>{(a.role==="user"||a.role==="assistant")&&i.push({role:a.role,content:a.content})});const r=t[t.length-1];return(!r||r.content!==n)&&i.push({role:"user",content:n}),i}async makeRequest(n,t,o,i=!1){const{provider:s,apiKey:c,model:r,endpoint:a,anthropicProxyUrl:l}=o;switch(s){case"openai":return await this.callOpenAI(t,c,r,i);case"anthropic":const d=o.systemPrompt&&typeof o.systemPrompt=="string"&&o.systemPrompt.trim().length>0?o.systemPrompt.trim():this.systemPrompt;return await this.callAnthropic(t,c,r,d,i,l);case"grok":return await this.callGrok(t,c,r,i);case"openrouter":return await this.callOpenRouter(t,c,r,i);case"custom":return await this.callCustomEndpoint(t,c,r,a,i);default:throw new Error(`Unknown provider: ${s}`)}}async callOpenAI(n,t,o,i){const s="https://api.openai.com/v1/chat/completions",c={model:o,messages:i?[{role:"system",content:"You are a helpful assistant."},{role:"user",content:'Say "OK" if you can read this.'}]:n,temperature:.7,max_tokens:i?10:2e3},r=await fetch(s,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`},body:JSON.stringify(c)});if(!r.ok){let l=`OpenAI API error: ${r.status}`;try{const d=await r.json(),p=d.error?.message||"";p.includes("insufficient_quota")||p.includes("billing")?l="Insufficient credits or billing issue. Please check your OpenAI account balance.":r.status===401?l="Invalid API key. Please check your API key in System > AI Agent settings.":r.status===403?l="Access forbidden. Check your API key permissions and account status.":l=d.error?.message||l}catch{l=`OpenAI API error: ${r.status} ${r.statusText}`}throw new Error(l)}return(await r.json()).choices[0].message.content}async callAnthropic(n,t,o,i,s,c){const r=c||"http://localhost:3001/api/anthropic",a=n.filter(d=>d.role!=="system"),l={model:o,max_tokens:s?10:2e3,system:s?"You are a helpful assistant.":i,messages:s?[{role:"user",content:'Say "OK" if you can read this.'}]:a,apiKey:t||void 0};try{const d=await fetch(r,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(l)});if(!d.ok){let u=`Anthropic API error: ${d.status}`;try{const f=await d.json();u=f.error?.message||f.message||u}catch{}throw new Error(u)}return(await d.json()).content[0].text}catch(d){throw d.message.includes("Failed to fetch")||d.message.includes("NetworkError")||d.name==="TypeError"?new Error(`Could not connect to Anthropic proxy server at ${r}. Make sure the proxy server is running. See proxy-server/README.md for setup instructions.`):d}}async callGrok(n,t,o,i){const s="https://api.x.ai/v1/chat/completions",c={model:o,messages:i?[{role:"system",content:"You are a helpful assistant."},{role:"user",content:'Say "OK" if you can read this.'}]:n,stream:!1,temperature:i?0:.7,max_tokens:i?10:2e3},r=await fetch(s,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`},body:JSON.stringify(c)});if(!r.ok){let l=`Grok API error: ${r.status} ${r.statusText}`;try{const d=await r.json();if(d.code||d.error){const p=d.code||"",u=d.error||"";p.includes("permission")||u.includes("credits")?l="No credits available. Please purchase credits at https://console.x.ai or check your account balance.":p.includes("authentication")||r.status===401?l="Invalid API key. Please check your API key in System > AI Agent settings.":r.status===403?l=d.error||d.message||"Access forbidden. Check your API key permissions and account status.":l=d.error||d.message||d.code||l}else l=d.message||l}catch{const p=await r.text();p&&(l+=` - ${p}`)}throw new Error(l)}return(await r.json()).choices[0].message.content}async callOpenRouter(n,t,o,i){const s="https://openrouter.ai/api/v1/chat/completions",c={model:o,messages:i?[{role:"system",content:"You are a helpful assistant."},{role:"user",content:'Say "OK" if you can read this.'}]:n},r=await fetch(s,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`,"HTTP-Referer":window.location.origin,"X-Title":"ScriptO Studio"},body:JSON.stringify(c)});if(!r.ok){let l=`OpenRouter API error: ${r.status} ${r.statusText}`;try{const d=await r.json(),p=d.error?.message||d.message||"";p.includes("credits")||p.includes("balance")?l="Insufficient credits. Please add credits to your OpenRouter account.":r.status===401?l="Invalid API key. Please check your API key in System > AI Agent settings.":r.status===403?l=d.error?.message||d.message||"Access forbidden. Check your API key permissions and account status.":l=d.error?.message||d.message||l}catch{const p=await r.text();p&&(l+=` - ${p}`)}throw new Error(l)}return(await r.json()).choices[0].message.content}async callCustomEndpoint(n,t,o,i,s){if(!i)throw new Error("Custom endpoint URL is required");const c={model:o,messages:s?[{role:"system",content:"You are a helpful assistant."},{role:"user",content:'Say "OK" if you can read this.'}]:n,temperature:.7,max_tokens:s?10:2e3},r=await fetch(i,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`},body:JSON.stringify(c)});if(!r.ok)throw new Error(`Custom endpoint error: ${r.status}`);const a=await r.json();if(a.choices&&a.choices[0]?.message?.content)return a.choices[0].message.content;if(a.content&&Array.isArray(a.content))return a.content[0].text;if(a.response)return a.response;if(a.text)return a.text;throw new Error("Unable to parse response from custom endpoint")}extractCode(n){let t=null;const o=n.match(/```python\n([\s\S]*?)```/);if(o&&(t=o[1].trim()),!t){const i=n.match(/```\n([\s\S]*?)```/);i&&(t=i[1].trim())}if(!t&&n.includes("# === START_CONFIG_PARAMETERS ===")&&(t=n.trim()),t){const i=t.includes("# === START_CONFIG_PARAMETERS ==="),s=t.includes("def ")||t.includes("import ")||t.includes("print(")||t.includes("class ")||/^[a-zA-Z_][\w]*\s*=/.test(t);return!i&&!s?(console.log("[AIBridge] Extracted content does not look like code, ignoring"),null):t.length<50?(console.log("[AIBridge] Extracted code too short, probably not valid:",t.length,"chars"),null):t}return null}}const cn=new Pt;class Nt{constructor(){this.DB_NAME="scripto-studio-extension-registry",this.DB_VERSION=1,this.STORE_INDEX="index",this.STORE_EXTENSIONS="extensions",this.STORE_INSTALLED="installed"}async _initDB(){return new Promise((n,t)=>{const o=indexedDB.open(this.DB_NAME,this.DB_VERSION);o.onerror=()=>t(o.error),o.onsuccess=()=>n(o.result),o.onupgradeneeded=i=>{const s=i.target.result;s.objectStoreNames.contains(this.STORE_INDEX)||s.createObjectStore(this.STORE_INDEX,{keyPath:"id"}),s.objectStoreNames.contains(this.STORE_EXTENSIONS)||s.createObjectStore(this.STORE_EXTENSIONS,{keyPath:"id"}),s.objectStoreNames.contains(this.STORE_INSTALLED)||s.createObjectStore(this.STORE_INSTALLED,{keyPath:"id"})}})}async loadIndex(n){try{const t=await this._initDB();try{const o=await fetch(n);if(!o.ok)throw new Error(`Failed to fetch registry: ${o.status}`);const s=(await o.json()).extensions||[],r=t.transaction([this.STORE_INDEX],"readwrite").objectStore(this.STORE_INDEX);return await new Promise((a,l)=>{const d=r.put({id:"registry",timestamp:Date.now(),extensions:s});d.onsuccess=()=>a(),d.onerror=()=>l(d.error)}),console.log("[Extension Registry] Loaded and cached index:",s.length,"extensions"),s}catch(o){console.warn("[Extension Registry] Failed to fetch index, trying cache:",o);const s=t.transaction([this.STORE_INDEX],"readonly").objectStore(this.STORE_INDEX);return new Promise((c,r)=>{const a=s.get("registry");a.onsuccess=()=>{const l=a.result;l&&l.extensions?(console.log("[Extension Registry] Using cached index:",l.extensions.length,"extensions"),c(l.extensions)):r(new Error("No cached registry available"))},a.onerror=()=>r(a.error)})}}catch(t){return console.error("[Extension Registry] Error loading index:",t),[]}}parseExtensionConfig(n){const t="// === START_EXTENSION_CONFIG ===",o="// === END_EXTENSION_CONFIG ===",i=n.indexOf(t),s=n.indexOf(o);if(i===-1||s===-1)return null;const a=n.substring(i+t.length,s).trim().split(`
`).map(p=>(p=p.trim(),p.startsWith("//")?p.substring(2).trim():p)).filter(p=>p.length>0).join(`
`);let l=-1;for(let p=0;p<a.length;p++)if(a[p]==="{"||a[p]==="["){l=p;break}if(l===-1)return console.error("[Extension Registry] No JSON object/array found in extension config"),null;const d=a.substring(l);try{return JSON.parse(d)}catch(p){return console.error("[Extension Registry] Failed to parse config:",p),null}}async installExtension(n){try{console.log("[Extension Registry] Installing extension:",n.name);const t=await fetch(n.url);if(!t.ok)throw new Error(`Failed to fetch extension: ${t.status}`);const o=await t.text(),i=this.parseExtensionConfig(o);if(!i)throw new Error("Failed to parse extension config");const s=await this._initDB(),c={id:n.id,content:o,config:i,styles:i.styles||"",mipPackage:i.mipPackage||n.mipPackage||null,url:n.url,installedAt:Date.now()},a=s.transaction([this.STORE_EXTENSIONS],"readwrite").objectStore(this.STORE_EXTENSIONS);await new Promise((p,u)=>{const f=a.put(c);f.onsuccess=()=>p(),f.onerror=()=>u(f.error)});const d=s.transaction([this.STORE_INSTALLED],"readwrite").objectStore(this.STORE_INSTALLED);return await new Promise((p,u)=>{const f=d.put({id:n.id,name:i.name,icon:i.icon,iconSvg:i.iconSvg||null,menu:i.menu,version:i.version,mipPackage:i.mipPackage||null,installedAt:Date.now()});f.onsuccess=()=>p(),f.onerror=()=>u(f.error)}),console.log("[Extension Registry] Extension installed:",i.name),c}catch(t){throw console.error("[Extension Registry] Installation failed:",t),t}}async getInstalledExtensions(){try{const o=(await this._initDB()).transaction([this.STORE_INSTALLED],"readonly").objectStore(this.STORE_INSTALLED);return new Promise((i,s)=>{const c=o.getAll();c.onsuccess=()=>{console.log("[Extension Registry] Found installed extensions:",c.result.length),i(c.result)},c.onerror=()=>s(c.error)})}catch(n){return console.error("[Extension Registry] Error getting installed extensions:",n),[]}}async getExtension(n){try{const i=(await this._initDB()).transaction([this.STORE_EXTENSIONS],"readonly").objectStore(this.STORE_EXTENSIONS);return new Promise((s,c)=>{const r=i.get(n);r.onsuccess=()=>{r.result?(console.log("[Extension Registry] Loaded extension from cache:",n),s(r.result)):(console.warn("[Extension Registry] Extension not found in cache:",n),s(null))},r.onerror=()=>c(r.error)})}catch(t){return console.error("[Extension Registry] Error getting extension:",t),null}}async uninstallExtension(n){try{const t=await this._initDB(),i=t.transaction([this.STORE_EXTENSIONS],"readwrite").objectStore(this.STORE_EXTENSIONS);await new Promise((r,a)=>{const l=i.delete(n);l.onsuccess=()=>r(),l.onerror=()=>a(l.error)});const c=t.transaction([this.STORE_INSTALLED],"readwrite").objectStore(this.STORE_INSTALLED);return await new Promise((r,a)=>{const l=c.delete(n);l.onsuccess=()=>r(),l.onerror=()=>a(l.error)}),console.log("[Extension Registry] Extension uninstalled:",n),!0}catch(t){return console.error("[Extension Registry] Uninstall failed:",t),!1}}async getDependencies(n){try{const i=(await this._initDB()).transaction([this.STORE_EXTENSIONS],"readonly").objectStore(this.STORE_EXTENSIONS);return new Promise((s,c)=>{const r=i.get(n);r.onsuccess=()=>{const a=r.result;a&&a.config&&a.config.mipPackage?s({mipPackage:a.config.mipPackage}):s(null)},r.onerror=()=>c(r.error)})}catch(t){return console.error("[Extension Registry] Error getting dependencies:",t),null}}async updateExtensionDev(n,t){try{console.log("[Extension Registry] DEV: Updating extension:",n);const o=this.parseExtensionConfig(t);if(!o)throw new Error("Failed to parse extension config from content");const i=await this._initDB(),s=await this.getExtension(n);if(!s)throw new Error(`Extension ${n} not found. Install it first from the registry.`);const c={id:n,content:t,config:o,styles:o.styles||"",mipPackage:o.mipPackage||null,url:s.url,installedAt:s.installedAt||Date.now()},a=i.transaction([this.STORE_EXTENSIONS],"readwrite").objectStore(this.STORE_EXTENSIONS);await new Promise((p,u)=>{const f=a.put(c);f.onsuccess=()=>p(),f.onerror=()=>u(f.error)});const d=i.transaction([this.STORE_INSTALLED],"readwrite").objectStore(this.STORE_INSTALLED);return await new Promise((p,u)=>{const f=d.put({id:n,name:o.name,icon:o.icon,iconSvg:o.iconSvg||null,menu:o.menu,version:o.version,mipPackage:o.mipPackage||null,installedAt:s.installedAt||Date.now()});f.onsuccess=()=>p(),f.onerror=()=>u(f.error)}),console.log("[Extension Registry] DEV: Extension updated successfully:",o.name),console.log("[Extension Registry] DEV: Reload the extension panel to see changes"),console.log("[Extension Registry] DEV: iconSvg stored:",!!o.iconSvg),c}catch(o){throw console.error("[Extension Registry] DEV: Update failed:",o),o}}async updateExtensionDevFromFile(n,t){try{console.log("[Extension Registry] DEV: Fetching extension from:",t);const o=await fetch(t);if(!o.ok)throw new Error(`Failed to fetch file: ${o.status} ${o.statusText}`);const i=await o.text();return await this.updateExtensionDev(n,i)}catch(o){throw console.error("[Extension Registry] DEV: Failed to load file:",o),o}}}let dn=class{constructor(n){this.device=n}async execute(n,t=!0){if(!this.device)throw new Error("Device not connected");try{return await this.device.exec(n)||""}catch(o){throw console.error("[DeviceAPI] Execution error:",o),o}}parseJSON(n){if(n&&typeof n=="object")return n;if(!n)throw new Error("Empty output from device");typeof n!="string"&&(n=String(n));try{return JSON.parse(n)}catch{const o=n.indexOf("{");if(o!==-1){let i=0,s=-1;for(let c=o;c<n.length;c++)if(n[c]==="{"&&i++,n[c]==="}"&&i--,i===0){s=c+1;break}if(s!==-1){const c=n.substring(o,s);try{return JSON.parse(c)}catch{throw new Error("Failed to parse extracted JSON: "+c.substring(0,100))}}}throw new Error("Failed to parse response: "+n.substring(0,100))}}},X={en:{},de:{},es:{},fr:{}},en="en";function It(e,n,t,o){X.en=e||{},X.de=n||{},X.es=t||{},X.fr=o||{}}function Ot(){return en}function Ft(e){Rn().includes(e)&&(en=e)}function Rn(){return["en","de","es","fr"]}function At(e){return{en:"English",de:"Deutsch",es:"Español",fr:"Français"}[e]||e}function y(e,n={}){const o=X[en||"en"]||X.en,i=e.split(".");let s=o;for(const c of i)if(s&&typeof s=="object"&&c in s)s=s[c];else{let a=X.en||{};for(const l of i)if(a&&typeof a=="object"&&l in a)a=a[l];else return e;s=a;break}return typeof s!="string"?e:Object.keys(n).length>0?s.replace(/\{(\w+)\}/g,(c,r)=>n[r]!==void 0?n[r]:c):s}const Dt={initTranslations:It,getLocale:Ot,setLocale:Ft,getAvailableLocales:Rn,getLocaleName:At,t:y};window.i18n=Dt;class Rt{constructor(){this.websocket=null,this.state="DISCONNECTED",this.password="",this.dataCallbacks=[],this.connectionClosedCallbacks=[],this.eventHandlers=new Map,this.completionCallbacks=[],this.onEthStatus=null,this.onWwanStatus=null,this.pendingRequests=new Map,this.pendingRun=null,this.pendingFileOps=new Map,this.currentTransfer=null,this.isReady=!1,this.authenticated=!1,this.CH_FILE=23,this.CH_TRM=1,this.CH_M2M=2,this.CH_DBG=3,this.CH_LOG=4,this.CH_EVENT=0,this.OP_EXE=0,this.OP_INT=1,this.OP_RST=2,this.OP_RES=0,this.OP_CON=1,this.OP_PRO=2,this.OP_COM=3,this.FILE_RRQ=1,this.FILE_WRQ=2,this.FILE_DATA=3,this.FILE_ACK=4,this.FILE_ERROR=5,this.ERR_NOT_FOUND=1,this.ERR_ACCESS=2,this.ERR_DISK_FULL=3,this.EVT_AUTH=0,this.EVT_AUTH_OK=1,this.EVT_AUTH_FAIL=2,this.EVT_INFO=3,this.EVT_LOG=4,this.FMT_PY=0,this.FMT_MPY=1,this.DEFAULT_BLKSIZE=4096}_generateId(){return Math.random().toString(36).substring(2,9)}_sendChannel(n,t,o="",i={}){if(!this.websocket||this.state!=="CONNECTED"){console.warn("[WCB] Cannot send: not connected");return}const s=[n,t,o];i.id!==void 0?(s.push(i.format!==void 0?i.format:null),s.push(i.id)):i.format!==void 0&&s.push(i.format);const c=me.encode(s),r=o?o.length:0;console.debug(`[WCB] Sending CH=${n} OP=${t} DataLen=${r} EncodedLen=${c.byteLength}`),this.websocket.send(c)}_sendEvent(n,...t){if(!this.websocket||this.state!=="CONNECTED"){console.warn("[WCB] Cannot send: not connected");return}const o=[this.CH_EVENT,n,...t],i=me.encode(o);this.websocket.send(i)}_sendFileMsg(n,...t){if(this.state!=="CONNECTED")return;const o=[this.CH_FILE,n,...t],i=me.encode(o);this.websocket.send(i)}_handleMessage(n){const t=n.data;if(!(t instanceof ArrayBuffer)){console.warn("[WCB] Unexpected TEXT frame");return}try{const o=me.decode(t);if(!Array.isArray(o)||o.length<2){console.warn("[WCB] Invalid message format");return}const i=o[0];i===this.CH_FILE?this._handleFile(o):i===this.CH_EVENT?this._handleEvent(o):i>=this.CH_TRM&&i<=22?this._handleChannel(o):console.warn("[WCB] Unknown channel:",i)}catch(o){console.error("[WCB] Failed to decode CBOR:",o);const i=new Uint8Array(t),s=Array.from(i.slice(0,32)).map(c=>c.toString(16).padStart(2,"0")).join(" ");console.error("[WCB] Raw data (first 32 bytes):",s),console.error("[WCB] As ASCII:",String.fromCharCode(...i.slice(0,32)))}}_handleChannel(n){if(n.length<3)return;const[t,o,...i]=n;switch(o){case this.OP_RES:this._handleRES(t,i[0],i[1]);break;case this.OP_CON:this._handleCON(t);break;case this.OP_PRO:this._handlePRO(t,i[0],i[1],i[2]);break;case this.OP_COM:this._handleCOM(t,i[0]);break;default:console.warn("[WCB] Unknown channel opcode:",o)}}_handleRES(n,t,o){const i=this.parseDebugState(t);if(i){console.debug("[WCB] Parsed debug state:",i);const s=this.eventHandlers.get("debug-state");if(s)try{s(i)}catch(c){console.error("[WCB] debug-state event handler error:",c)}}if(o&&this.pendingRequests.has(o)){const s=this.pendingRequests.get(o);s.buffer=(s.buffer||"")+t,console.debug("[WCB] M2M RES with ID:",o,"data length:",t.length,"total buffer:",s.buffer.length);return}n===this.CH_M2M&&!o&&(console.warn("[WCB] M2M RES message missing ID (device bug). Expected one of:",Array.from(this.pendingRequests.keys())),console.warn("[WCB] RES data:",t.substring(0,200))),n===this.CH_TRM?this._notifyData(t,!1):n===this.CH_DBG?this._notifyData(t,!1):n===this.CH_LOG&&console.log("[WCB LOG]",t)}_handleCON(n){console.debug("[WCB] Continuation prompt (...)")}_handleCOM(n,t){console.debug("[WCB] Tab completions on channel",n,":",t),this.completionCallbacks.forEach(o=>{try{o(n,t)}catch(i){console.error("[WCB] Completion callback error:",i)}})}_handlePRO(n,t,o=null,i=null){if(i&&this.pendingRequests.has(i)){const s=this.pendingRequests.get(i),{resolve:c,reject:r,timeoutId:a,buffer:l}=s;if(clearTimeout(a),this.pendingRequests.delete(i),t!==0)r(new Error(o||"Request failed"));else if(n===this.CH_M2M){console.debug("[WCB] M2M PRO success with ID:",i,"buffer length:",l?l.length:0,"buffer:",l?l.substring(0,200):"null");try{let d=null;if(l)try{d=JSON.parse(l)}catch(p){const u=l.indexOf("{");if(u!==-1){let f=0,g=-1;for(let h=u;h<l.length;h++)if(l[h]==="{"&&f++,l[h]==="}"&&f--,f===0){g=h+1;break}if(g!==-1){const h=l.substring(u,g);d=JSON.parse(h)}else throw p}else throw p}c(d)}catch(d){console.warn("[WCB] Failed to parse JSON buffer:",d,"buffer:",l?l.substring(0,200):"null"),c(l||null)}}else c(l||null);return}if(n===this.CH_M2M&&!i&&console.warn("[WCB] M2M PRO message missing ID (device bug):",{status:t,error:o}),t!==0){const s=o||"Unknown error";if(console.error("[WCB] Error:",s),this.isReady=!0,this.pendingRun){const{reject:c}=this.pendingRun;this.pendingRun=null,c(new Error(s))}}else if(this.isReady=!0,this.pendingRun){const{resolve:s}=this.pendingRun;this.pendingRun=null,s()}}_handleFile(n){if(n.length<2)return;const t=n[1],o=n.slice(2);if(!this.currentTransfer){console.warn("[WCB] Received file message with no active transfer");return}switch(t){case this.FILE_ACK:this._handleFileAck(o);break;case this.FILE_DATA:this._handleFileData(o);break;case this.FILE_ERROR:this._handleFileError(o);break;default:console.warn("[WCB] Unknown file opcode:",t)}}_handleFileAck(n){if(!this.currentTransfer)return;const t=n[0];this.currentTransfer.type==="UPLOAD"?t===this.currentTransfer.blockNum&&this.currentTransfer.resolveBlock():this.currentTransfer.type==="DOWNLOAD"&&t===0&&this.currentTransfer.blockNum===-1&&(n.length>1&&(this.currentTransfer.totalSize=n[1]),this._sendFileMsg(this.FILE_ACK,0),this.currentTransfer.blockNum=0)}_handleFileData(n){if(!this.currentTransfer||this.currentTransfer.type!=="DOWNLOAD")return;const t=n[0],o=n[1],i=(this.currentTransfer.blockNum+1)%65536;if(t===i){if((o instanceof Uint8Array||o instanceof ArrayBuffer)&&(this.currentTransfer.chunks.push(o),this.currentTransfer.receivedSize+=o.byteLength),this.currentTransfer.blockNum=t,this._sendFileMsg(this.FILE_ACK,t),this.currentTransfer.progressCallback&&this.currentTransfer.totalSize>0){const s=Math.floor(this.currentTransfer.receivedSize/this.currentTransfer.totalSize*100);this.currentTransfer.progressCallback(Math.min(s,99))}if(o.byteLength<this.currentTransfer.blksize){this.currentTransfer.progressCallback&&this.currentTransfer.progressCallback(100);const s=(Date.now()-this.currentTransfer.startTime)/1e3,c=(this.currentTransfer.receivedSize/s/1024).toFixed(2),r=(this.currentTransfer.receivedSize*8/s/1e6).toFixed(2);console.log(`[WCB] Download complete: ${this.currentTransfer.path} (${this.currentTransfer.receivedSize} bytes in ${s.toFixed(2)}s = ${c} KB/s / ${r} Mbps)`);const a=new Blob(this.currentTransfer.chunks),l=new FileReader;l.onload=()=>{this.currentTransfer.resolve(new Uint8Array(l.result)),this.currentTransfer=null},l.readAsArrayBuffer(a)}}else t===this.currentTransfer.blockNum&&this._sendFileMsg(this.FILE_ACK,t)}_handleFileError(n){if(this.currentTransfer){const t=n[0],o=n[1];this.currentTransfer.reject(new Error(`TFTP Error ${t}: ${o}`)),this.currentTransfer=null}}_handleEvent(n){if(n.length<2)return;const[t,o,...i]=n;switch(o){case this.EVT_AUTH_OK:this._authResolve&&(this.authenticated=!0,this._authResolve(),this._authResolve=null,this._authReject=null);break;case this.EVT_AUTH_FAIL:if(this._authReject){const s=i[0]||"Authentication failed";this._authReject(new Error(s)),this._authResolve=null,this._authReject=null}break;case this.EVT_INFO:{let s={};try{const r=i[0];if(typeof r!="string"){console.error("[WCB] INFO payload must be a JSON string, got:",typeof r);break}s=JSON.parse(r)}catch(r){console.error("[WCB] Failed to parse INFO payload JSON:",r,i[0]);break}if(s.welcome){this.isReady=!0;const r=this.eventHandlers.get("welcome");r&&r(s.welcome)}if(s.heap!==void 0){const r={heap:s.heap,uptime:s.uptime,rssi:s.rssi,extra:s.extra},a=this.eventHandlers.get("auto_info");a&&a(r)}if(s.eth_status!==void 0){if(console.log("[WCB] Ethernet status event:",s.eth_status),this.onEthStatus)try{this.onEthStatus(s.eth_status)}catch(a){console.error("[WCB] onEthStatus callback error:",a)}const r=this.eventHandlers.get("eth_status");if(r)try{r(s.eth_status)}catch(a){console.error("[WCB] eth_status event handler error:",a)}}if(s.wwan_status!==void 0){if(console.log("[WCB] WWAN status event:",s.wwan_status),this.onWwanStatus)try{this.onWwanStatus(s.wwan_status)}catch(a){console.error("[WCB] onWwanStatus callback error:",a)}const r=this.eventHandlers.get("wwan_status");if(r)try{r(s.wwan_status)}catch(a){console.error("[WCB] wwan_status event handler error:",a)}}if(s.display_ui!==void 0){if(console.log("[WCB] Display UI event:",s.display_ui),this.onDisplayUi)try{this.onDisplayUi(s.display_ui)}catch(a){console.error("[WCB] onDisplayUi callback error:",a)}const r=this.eventHandlers.get("display_ui");if(r)try{r(s.display_ui)}catch(a){console.error("[WCB] display_ui event handler error:",a)}}const c=this.eventHandlers.get("info");c&&c(s)}break;case this.EVT_LOG:{const[s,c,r,a]=i,l={level:s,message:c,timestamp:r,source:a};console.debug("[WCB] LOG event received:",l);const d=this.eventHandlers.get("log");if(console.debug("[WCB] LOG handler check:",{hasHandler:!!d,handlerCount:this.eventHandlers.size,allHandlers:Array.from(this.eventHandlers.keys())}),d)console.debug("[WCB] Calling LOG handler with:",l),d(l);else{const p=["DBG","INF","WRN","ERR"][s]||"LOG";console.log(`[WCB ${p}] ${c} (no handler registered)`)}}break;default:console.debug("[WCB] Unhandled event:",o)}}async connect(n,t="password"){if(this.state!=="DISCONNECTED")throw new Error("Already connected or connecting");return this.password=t,new Promise((o,i)=>{try{const s=Date.now();console.log("[WCB] Connecting to:",n),this.websocket=new WebSocket(n,["webrepl.binary.v1"]),this.websocket.binaryType="arraybuffer",this.state="CONNECTING";const c=setTimeout(()=>{i(new Error("Connection timeout")),this.disconnect()},1e4);this.websocket.addEventListener("open",async()=>{console.log("[WCB] WebSocket opened after",Date.now()-s,"ms"),this.state="CONNECTED";try{await this._authenticate(),clearTimeout(c),this.isReady=!0,console.log("[WCB] Authenticated successfully"),o()}catch(r){clearTimeout(c),i(new Error("Authentication failed: "+r.message)),this.disconnect()}}),this.websocket.addEventListener("message",r=>{this._handleMessage(r)}),this.websocket.addEventListener("close",r=>{console.log("[WCB] Connection closed",{code:r.code,reason:r.reason||"No reason provided"}),this.state="DISCONNECTED",this.isReady=!1,this.authenticated=!1,this.currentTransfer&&(console.warn("[WCB] Transfer interrupted by disconnect:",this.currentTransfer.path),this.currentTransfer.reject&&this.currentTransfer.reject(new Error("Transfer interrupted: Connection closed")),this.currentTransfer=null),this._notifyConnectionClosed()}),this.websocket.addEventListener("error",r=>{console.error("[WCB] WebSocket error:",r),i(r)})}catch(s){this.state="DISCONNECTED",i(s)}})}async _authenticate(){return new Promise((n,t)=>{const o=setTimeout(()=>{this._authResolve=null,this._authReject=null,t(new Error("Auth timeout"))},1e4);this._authResolve=()=>{clearTimeout(o),n()},this._authReject=i=>{clearTimeout(o),t(i)},this._sendEvent(this.EVT_AUTH,this.password)})}async disconnect(){this.websocket&&(this.websocket.close(),this.websocket=null),this.state="DISCONNECTED",this.isReady=!1,this.authenticated=!1,this.pendingRequests.clear(),this.pendingRun=null,this.currentTransfer&&(console.warn("[WCB] Clearing transfer state on disconnect:",this.currentTransfer.path),this.currentTransfer.reject&&this.currentTransfer.reject(new Error("Transfer cancelled: Disconnected")),this.currentTransfer=null),this.pendingFileOps&&this.pendingFileOps.clear()}async exec(n){if(this.state!=="CONNECTED")throw new Error("Not connected");return new Promise((t,o)=>{const i=this._generateId(),s=setTimeout(()=>{this.pendingRequests.has(i)&&(this.pendingRequests.delete(i),o(new Error("M2M timeout")))},3e4);this.pendingRequests.set(i,{resolve:t,reject:o,timeoutId:s,buffer:""}),console.debug("[WCB] Sending M2M EXE with ID:",i,"code:",n.substring(0,50)),this._sendChannel(this.CH_M2M,this.OP_EXE,n+`
`,{format:this.FMT_PY,id:i})})}async execBytecode(n){if(this.state!=="CONNECTED")throw new Error("Not connected");return new Promise((t,o)=>{const i=this._generateId(),s=setTimeout(()=>{this.pendingRequests.has(i)&&(this.pendingRequests.delete(i),o(new Error("M2M timeout")))},3e4);this.pendingRequests.set(i,{resolve:t,reject:o,timeoutId:s,buffer:""}),this._sendChannel(this.CH_M2M,this.OP_EXE,n,{format:this.FMT_MPY,id:i})})}async sendInput(n){if(this.state!=="CONNECTED")throw new Error("Not connected");this._pendingInputEcho=n+`\r
`,this._sendChannel(this.CH_TRM,this.OP_EXE,n+"\r")}async run(n){if(this.state!=="CONNECTED")throw new Error("Not connected");return this.isReady||await this.interrupt(),console.debug("[WCB] Executing:",n.substring(0,50)+(n.length>50?"...":"")),this.isReady=!1,new Promise((t,o)=>{this.pendingRun={resolve:t,reject:o},this._sendChannel(this.CH_TRM,this.OP_EXE,n+`
`)})}async requestCompletion(n){if(this.state!=="CONNECTED")throw new Error("Not connected");return new Promise((t,o)=>{const i=setTimeout(()=>{this.offCompletion(s),o(new Error("Completion timeout"))},5e3),s=(c,r)=>{c===this.CH_TRM&&(clearTimeout(i),this.offCompletion(s),t(r||[]))};this.onCompletion(s),console.debug("[WCB] Requesting completion for:",n),this._sendChannel(this.CH_TRM,this.OP_EXE,n+"	")})}async interrupt(){if(this.pendingRun!==null)console.log("[WCB] Interrupting active script execution"),this._sendChannel(this.CH_TRM,this.OP_INT);else{console.log("[WCB] No script running - stopping background tasks via M2M");try{const t=await this.exec("from lib import bg_tasks; bg_tasks.stop_user_tasks()");console.log("[WCB] Stopped tasks:",t),this.isReady=!0}catch(t){console.warn("[WCB] Failed to send stop request:",t)}}return new Promise(t=>{const o=setInterval(()=>{this.isReady&&(clearInterval(o),t())},50);setTimeout(()=>{clearInterval(o),this.isReady=!0,t()},2e3)})}async reset(n=!1){if(this.state!=="CONNECTED")throw new Error("Not connected");console.log("[WCB] Sending",n?"hard":"soft","reset"),this._sendChannel(this.CH_TRM,this.OP_RST,n?1:0),this.isReady=!1}async saveFile(n,t,o={}){if(this.currentTransfer)throw new Error("Transfer already in progress");const i=typeof t=="string"?new TextEncoder().encode(t):t,s=i.length;return new Promise(async(c,r)=>{this.currentTransfer={type:"UPLOAD",path:n,data:i,totalSize:s,blockNum:0,blksize:8192,startTime:Date.now(),resolveBlock:null,resolve:c,reject:r,chunks:null},this._sendFileMsg(this.FILE_WRQ,n,s,this.DEFAULT_BLKSIZE,5e3,0);try{await new Promise(g=>{this.currentTransfer.resolveBlock=g});let a=0,l=1;const d=o.progressCallback;for(d&&d(0);a<s;){const g=i.slice(a,a+this.DEFAULT_BLKSIZE);if(this.currentTransfer.blockNum=l,this._sendFileMsg(this.FILE_DATA,l,g),await new Promise(h=>{this.currentTransfer.resolveBlock=h}),a+=g.length,l++,d&&s>0){const h=Math.floor(a/s*100);d(Math.min(h,99))}}d&&d(100),s===0&&(this._sendFileMsg(this.FILE_DATA,1,new Uint8Array(0)),this.currentTransfer.blockNum=1,await new Promise(g=>{this.currentTransfer.resolveBlock=g}));const p=(Date.now()-this.currentTransfer.startTime)/1e3,u=(s/p/1024).toFixed(2),f=(s*8/p/1e6).toFixed(2);console.log(`[WCB] Upload complete: ${n} (${s} bytes in ${p.toFixed(2)}s = ${u} KB/s / ${f} Mbps)`),this.currentTransfer=null,c()}catch(a){this.currentTransfer=null,r(a)}})}async loadFile(n,t={}){if(this.currentTransfer&&this.state==="DISCONNECTED"&&(console.warn("[WCB] Clearing stale transfer state before loadFile"),this.currentTransfer=null),this.currentTransfer)throw new Error("Transfer already in progress");return new Promise((o,i)=>{this.currentTransfer={type:"DOWNLOAD",path:n,totalSize:0,receivedSize:0,blockNum:-1,chunks:[],blksize:16384,startTime:Date.now(),progressCallback:t.progressCallback,resolve:o,reject:i},this._sendFileMsg(this.FILE_RRQ,n,16384,5e3)})}subscribe(n,t){this.eventHandlers.set(n,t)}unsubscribe(n){this.eventHandlers.delete(n)}onData(n){this.dataCallbacks=[n]}onConnectionClosed(n){this.connectionClosedCallbacks.push(n)}onCompletion(n){this.completionCallbacks.push(n)}offCompletion(n){const t=this.completionCallbacks.indexOf(n);t>=0&&this.completionCallbacks.splice(t,1)}_notifyData(n,t=!1){if(this._pendingInputEcho&&n.includes(this._pendingInputEcho)){if(n=n.replace(this._pendingInputEcho,""),this._pendingInputEcho=null,n==="")return}else if(this._pendingInputEcho&&this._pendingInputEcho.startsWith(n)){this._pendingInputEcho=this._pendingInputEcho.slice(n.length);return}this.dataCallbacks.forEach(o=>o(n,t))}_notifyConnectionClosed(){this.connectionClosedCallbacks.forEach(n=>n())}isCommandRunning(){return this.pendingRun!==null||!this.isReady}isFileOperationActive(){return this.currentTransfer!==null||this.pendingFileOps.size>0}parseDebugState(n){const t="\x1B[?1049hD",o="D\x1B[?1049l";if(n.includes(t)&&n.includes(o)){const i=n.indexOf(t)+t.length,s=n.indexOf(o),c=n.substring(i,s);try{return JSON.parse(c)}catch(r){return console.error("[WCB] Failed to parse debug state:",r),null}}return null}async sendDebugCommand(n){const t=`_debug_cmd = '${n}'; import __main__; setattr(__main__, '_debug_cmd', '${n}'); import builtins; setattr(builtins, '_debug_cmd', '${n}')`;return console.log("[WCB] Sending debug command via M2M:",n),this.exec(t)}}const re=Ct;class un{constructor(){this.pc=null,this.dataChannel=null,this.state="DISCONNECTED",this.signalingUrl="",this.dataCallbacks=[],this.connectionClosedCallbacks=[],this.eventHandlers=new Map,this.completionCallbacks=[],this.pendingRequests=new Map,this.pendingRun=null,this.pendingFileOps=new Map,this.currentTransfer=null,this.keepaliveTimer=null,this.isReady=!1,this.authenticated=!1,this.CH_FILE=23,this.CH_TRM=1,this.CH_M2M=2,this.CH_DBG=3,this.CH_LOG=4,this.CH_EVENT=0,this.OP_EXE=0,this.OP_INT=1,this.OP_RST=2,this.OP_RES=0,this.OP_CON=1,this.OP_PRO=2,this.OP_COM=3,this.FILE_RRQ=1,this.FILE_WRQ=2,this.FILE_DATA=3,this.FILE_ACK=4,this.FILE_ERROR=5,this.ERR_NOT_FOUND=1,this.ERR_ACCESS=2,this.ERR_DISK_FULL=3,this.EVT_AUTH=0,this.EVT_AUTH_OK=1,this.EVT_AUTH_FAIL=2,this.EVT_INFO=3,this.EVT_LOG=4,this.CH_AUTH=0,this.FMT_PY=0,this.FMT_MPY=1,this.DEFAULT_BLKSIZE=4096}_generateId(){return Math.random().toString(36).substring(2,9)}_sendChannel(n,t,o="",i={}){if(!this.dataChannel||this.dataChannel.readyState!=="open"){console.warn("[RTC] Cannot send: DataChannel not open",{hasDataChannel:!!this.dataChannel,readyState:this.dataChannel?.readyState,state:this.state});return}const s=[n,t,o];i.id!==void 0?(s.push(i.format!==void 0?i.format:null),s.push(i.id)):i.format!==void 0&&s.push(i.format);const c=re.encode(s);try{this.dataChannel.send(c)}catch(r){throw console.error("[RTC] DataChannel send failed:",r,{readyState:this.dataChannel.readyState,bufferedAmount:this.dataChannel.bufferedAmount}),r}}_sendEvent(n,...t){if(!this.dataChannel||this.dataChannel.readyState!=="open"){console.warn("[RTC] Cannot send event: DataChannel not open");return}const o=[this.CH_AUTH,n,...t],i=re.encode(o);this.dataChannel.send(i)}_sendFileMsg(n,...t){if(!this.dataChannel||this.dataChannel.readyState!=="open")return;const o=[this.CH_FILE,n,...t],i=re.encode(o);this.dataChannel.send(i)}_handleMessage(n){const t=Date.now(),o=n.data;if(console.debug("[RTC] Received message:",{type:typeof o,size:o?.byteLength||0,timestamp:t}),!(o instanceof ArrayBuffer)){console.warn("[RTC] Unexpected non-binary data");return}try{const i=re.decode(o);if(console.debug("[RTC] Decoded message:",i),!Array.isArray(i)||i.length<2){console.warn("[RTC] Invalid message format");return}const s=i[0];s===this.CH_FILE?this._handleFile(i):s===this.CH_EVENT?this._handleEvent(i):s>=this.CH_TRM&&s<=22?this._handleChannel(i):console.warn("[RTC] Unknown channel:",s)}catch(i){console.error("[RTC] Failed to decode CBOR:",i);const s=new Uint8Array(o),c=Array.from(s.slice(0,32)).map(r=>r.toString(16).padStart(2,"0")).join(" ");console.error("[RTC] Raw data (first 32 bytes):",c),console.error("[RTC] As ASCII:",String.fromCharCode(...s.slice(0,32)))}}_handleChannel(n){if(n.length<3)return;const[t,o,...i]=n;switch(console.debug("[RTC] Handling channel message:",{channel:t,opcode:o,restLength:i.length}),o){case this.OP_RES:this._handleRES(t,i[0],i[1]);break;case this.OP_CON:this._handleCON(t);break;case this.OP_PRO:this._handlePRO(t,i[0],i[1],i[2]);break;case this.OP_COM:this._handleCOM(t,i[0]);break;default:console.warn("[RTC] Unknown channel opcode:",o)}}_handleRES(n,t,o){if(console.debug("[RTC] Handling RES:",{channel:n,dataType:typeof t,dataLength:t?.length||0,id:o}),o&&this.pendingRequests.has(o)){const i=this.pendingRequests.get(o);i.buffer=(i.buffer||"")+t,console.debug("[RTC] Buffered data for ID:",o,"Total:",i.buffer.length);return}n===this.CH_M2M&&!o&&(console.warn("[RTC] M2M RES message missing ID (device bug). Expected one of:",Array.from(this.pendingRequests.keys())),console.warn("[RTC] RES data:",t?.substring?t.substring(0,200):t)),n===this.CH_TRM?(console.debug("[RTC] Notifying terminal data:",t),this._notifyData(t,!1)):n===this.CH_DBG?(console.debug("[RTC] Notifying debug data:",t),this._notifyData(t,!1)):n===this.CH_LOG&&console.log("[RTC LOG]",t)}_handleCON(n){}_handleCOM(n,t){this.completionCallbacks.forEach(o=>{try{o(n,t)}catch(i){console.error(i)}})}_handlePRO(n,t,o=null,i=null){if(console.log("[RTC] PRO received:",{channel:n,status:t,error:o,id:i,pendingRun:!!this.pendingRun}),i&&this.pendingRequests.has(i)){const s=this.pendingRequests.get(i),{resolve:c,reject:r,timeoutId:a,buffer:l}=s;if(console.debug("[RTC] Completing request:",i,"Buffer:",l),clearTimeout(a),this.pendingRequests.delete(i),t!==0)r(new Error(o||"Request failed"));else if(n===this.CH_M2M){console.debug("[RTC] M2M PRO success with ID:",i,"buffer length:",l?l.length:0);try{let d=null;if(l)try{d=JSON.parse(l)}catch(p){const u=l.indexOf("{");if(u!==-1){let f=0,g=-1;for(let h=u;h<l.length;h++)if(l[h]==="{"&&f++,l[h]==="}"&&f--,f===0){g=h+1;break}if(g!==-1){const h=l.substring(u,g);d=JSON.parse(h)}else throw p}else throw p}console.debug("[RTC] M2M result parsed:",d),c(d)}catch(d){console.warn("[RTC] Failed to parse JSON buffer:",d,"buffer:",l?l.substring(0,200):"null"),c(l||null)}}else c(l||null);return}if(console.log("[RTC] PRO for TRM, pendingRun:",!!this.pendingRun,"id:",i),t!==0){const s=o||"Unknown error";if(console.error("[RTC] Error:",s),this.pendingRun){const{reject:c}=this.pendingRun;this.pendingRun=null,c(new Error(s))}}else if(this.isReady=!0,this.pendingRun){console.log("[RTC] Resolving pendingRun, setting isReady=true");const{resolve:s}=this.pendingRun;this.pendingRun=null,s()}}_handleFile(n){if(n.length<2)return;const t=n[1],o=n.slice(2);if(!this.currentTransfer){console.warn("[RTC] File message with no active transfer");return}switch(t){case this.FILE_ACK:this._handleFileAck(o);break;case this.FILE_DATA:this._handleFileData(o);break;case this.FILE_ERROR:this._handleFileError(o);break}}_handleFileAck(n){if(!this.currentTransfer)return;const t=n[0];this.currentTransfer.type==="UPLOAD"?t===this.currentTransfer.blockNum&&this.currentTransfer.resolveBlock():this.currentTransfer.type==="DOWNLOAD"&&t===0&&this.currentTransfer.blockNum===-1&&(n.length>1&&(this.currentTransfer.totalSize=n[1]),this._sendFileMsg(this.FILE_ACK,0),this.currentTransfer.blockNum=0)}_handleFileData(n){if(!this.currentTransfer||this.currentTransfer.type!=="DOWNLOAD")return;const t=n[0],o=n[1],i=(this.currentTransfer.blockNum+1)%65536;if(t===i){if(this.currentTransfer.chunks.push(o),this.currentTransfer.receivedSize+=o.byteLength,this.currentTransfer.totalSize&&this.currentTransfer.progressCallback){const s=Math.floor(this.currentTransfer.receivedSize*100/this.currentTransfer.totalSize);this.currentTransfer.progressCallback(Math.min(s,99))}if(this._sendFileMsg(this.FILE_ACK,t),this.currentTransfer.blockNum=t,o.byteLength<this.currentTransfer.blksize){this.currentTransfer.progressCallback&&this.currentTransfer.progressCallback(100);const s=new Blob(this.currentTransfer.chunks),c=new FileReader;c.onload=()=>{this.currentTransfer.resolve(new Uint8Array(c.result)),this.currentTransfer=null},c.readAsArrayBuffer(s)}}else t===this.currentTransfer.blockNum&&this._sendFileMsg(this.FILE_ACK,t)}_handleFileError(n){if(this.currentTransfer){const t=n[0],o=n[1];this.currentTransfer.reject(new Error(`TFTP Error ${t}: ${o}`)),this.currentTransfer=null}}_handleEvent(n){if(n.length<2)return;const[t,o,...i]=n;switch(o){case this.EVT_INFO:{let s={};try{const r=i[0];if(typeof r!="string"){console.error("[RTC] INFO payload must be a JSON string, got:",typeof r);break}s=JSON.parse(r)}catch(r){console.error("[RTC] Failed to parse INFO payload JSON:",r,i[0]);break}if(s.welcome){this.isReady=!0;const r=this.eventHandlers.get("welcome");r&&r(s.welcome)}if(s.display_ui!==void 0){if(console.log("[RTC] Display UI event:",s.display_ui),this.onDisplayUi)try{this.onDisplayUi(s.display_ui)}catch(a){console.error("[RTC] onDisplayUi callback error:",a)}const r=this.eventHandlers.get("display_ui");if(r)try{r(s.display_ui)}catch(a){console.error("[RTC] display_ui event handler error:",a)}}const c=this.eventHandlers.get("info");c&&c(s)}break;case this.EVT_AUTH_OK:this._authResolve&&(this.authenticated=!0,this._authResolve(),this._authResolve=null,this._authReject=null);break;case this.EVT_AUTH_FAIL:{const s=i[0]||"Authentication failed";console.error("[RTC] Authentication failed:",s),this._authReject&&(this._authReject(new Error(s)),this._authResolve=null,this._authReject=null)}break;case this.EVT_LOG:{const[s,c,r,a]=i,l={level:s,message:c,timestamp:r,source:a},d=this.eventHandlers.get("log");d&&d(l)}break}}async connect(n,t=""){if(this.state!=="DISCONNECTED")throw new Error("Already connected or connecting");let o,i;n=n.trim(),n.startsWith("https://")?(o="https:",n=n.slice(8)):n.startsWith("http://")?(o="http:",n=n.slice(7)):o=window.location.protocol==="https:"?"https:":"http:";const s=n.indexOf("/");s!==-1&&(n=n.slice(0,s)),i=n,this.signalingUrl=`${o}//${i}/webrtc/offer`,this.state="CONNECTING";try{this.pc=new RTCPeerConnection({iceServers:[{urls:"stun:stun.l.google.com:19302"}]}),this.dataChannel=this.pc.createDataChannel("wbp",{ordered:!0,protocol:"webrepl.binary.v1"}),this.dataChannel.binaryType="arraybuffer",this._setupDataChannel();const c=[],r=new Promise(u=>{this.pc.onicecandidate=f=>{f.candidate?c.push(f.candidate.candidate):u()},setTimeout(u,3e3)}),a=await this.pc.createOffer();await this.pc.setLocalDescription(a),await r;let l=this.pc.localDescription.sdp;const d=await fetch(this.signalingUrl,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sdp:l,password:t})});if(!d.ok)throw new Error(`Signaling failed: ${d.status}`);const p=await d.json();if(p.error)throw new Error(p.error);if(await this.pc.setRemoteDescription({type:"answer",sdp:p.sdp}),p.ice_candidates)for(const u of p.ice_candidates)try{await this.pc.addIceCandidate({candidate:u,sdpMid:"0",sdpMLineIndex:0})}catch{}await new Promise((u,f)=>{const g=setTimeout(()=>f(new Error("DataChannel open timeout")),1e4);this.dataChannel.readyState==="open"?(clearTimeout(g),u()):(this.dataChannel.onopen=()=>{clearTimeout(g),u()},this.dataChannel.onerror=h=>{clearTimeout(g),f(new Error("DataChannel error"))})}),await this.authenticate(t),this.state="CONNECTED",this.isReady=!0,console.log("[RTC] Connection established:",{state:this.state,isReady:this.isReady,dataChannelState:this.dataChannel.readyState,peerConnectionState:this.pc.connectionState}),this._startKeepalive()}catch(c){throw console.error("[RTC] Connection failed:",c),this.state="DISCONNECTED",this._cleanup(),c}}async authenticate(n){if(!this.dataChannel||this.dataChannel.readyState!=="open")throw new Error("DataChannel not open");if(!this.authenticated)return new Promise((t,o)=>{const i=setTimeout(()=>{this._authResolve=null,this._authReject=null,o(new Error("Authentication timeout"))},1e4);this._authResolve=()=>{clearTimeout(i),t()},this._authReject=s=>{clearTimeout(i),o(s)},this._sendEvent(this.EVT_AUTH,n)})}_setupDataChannel(){this.dataChannel.onmessage=n=>this._handleMessage(n),this.dataChannel.onclose=()=>{this.state="DISCONNECTED",this.isReady=!1,this._stopKeepalive(),this._notifyConnectionClosed()},this.dataChannel.onerror=n=>{console.error("[RTC] DataChannel error:",n)}}_startKeepalive(){this._stopKeepalive(),this.keepaliveTimer=setInterval(()=>{if(this.dataChannel&&this.dataChannel.readyState==="open")try{const n=re.encode([0,99]);this.dataChannel.send(n)}catch(n){console.warn("[RTC] Keepalive send failed:",n)}},2e3)}_stopKeepalive(){this.keepaliveTimer&&(clearInterval(this.keepaliveTimer),this.keepaliveTimer=null)}_cleanup(){this._stopKeepalive(),this.dataChannel&&(this.dataChannel.close(),this.dataChannel=null),this.pc&&(this.pc.close(),this.pc=null),this.currentTransfer=null,this.pendingRequests.clear(),this.pendingRun=null}async disconnect(){this._cleanup(),this.state="DISCONNECTED",this.isReady=!1,this.authenticated=!1}async exec(n){if(this.state!=="CONNECTED")throw new Error("Not connected");return new Promise((t,o)=>{const i=this._generateId(),s=setTimeout(()=>{this.pendingRequests.has(i)&&(this.pendingRequests.delete(i),o(new Error("M2M timeout")))},3e4);this.pendingRequests.set(i,{resolve:t,reject:o,timeoutId:s,buffer:""}),this._sendChannel(this.CH_M2M,this.OP_EXE,n+`
`,{format:this.FMT_PY,id:i})})}async run(n){if(this.state!=="CONNECTED")throw new Error("Not connected");const t=performance.now();return this.isReady||(console.log("[RTC] run(): isReady=false, calling interrupt()..."),await this.interrupt(),console.log("[RTC] run(): interrupt() took",(performance.now()-t).toFixed(0),"ms")),this.isReady=!1,console.log("[RTC] run(): sending command, total setup time:",(performance.now()-t).toFixed(0),"ms"),new Promise((o,i)=>{const s=setTimeout(()=>{this.pendingRun&&(console.warn("[RTC] run(): Command timed out after 30 seconds"),this.pendingRun=null,this.isReady=!0,i(new Error("Command timeout")))},3e4);this.pendingRun={resolve:c=>{clearTimeout(s),o(c)},reject:c=>{clearTimeout(s),i(c)}},this._sendChannel(this.CH_TRM,this.OP_EXE,n+`
`)})}async interrupt(){return this._sendChannel(this.CH_TRM,this.OP_INT),new Promise(n=>{const t=setInterval(()=>{this.isReady&&(clearInterval(t),n())},50);setTimeout(()=>{clearInterval(t),this.isReady=!0,n()},2e3)})}async requestCompletion(n){if(this.state!=="CONNECTED")throw new Error("Not connected");return new Promise((t,o)=>{const i=setTimeout(()=>{this.offCompletion(s),o(new Error("Completion timeout"))},5e3),s=(c,r)=>{c===this.CH_TRM&&(clearTimeout(i),this.offCompletion(s),t(r||[]))};this.onCompletion(s),console.debug("[RTC] Requesting completion for:",n),this._sendChannel(this.CH_TRM,this.OP_EXE,n+"	")})}async reset(n=!1){if(this.state!=="CONNECTED")throw new Error("Not connected");this._sendChannel(this.CH_TRM,this.OP_RST,n?1:0),this.isReady=!1}async saveFile(n,t,o={}){if(this.currentTransfer)throw new Error("Transfer already in progress");const i=typeof t=="string"?new TextEncoder().encode(t):t,s=i.length;return new Promise(async(c,r)=>{this.currentTransfer={type:"UPLOAD",path:n,data:i,totalSize:s,blockNum:0,blksize:this.DEFAULT_BLKSIZE,startTime:Date.now(),resolveBlock:null,resolve:c,reject:r},this._sendFileMsg(this.FILE_WRQ,n,s,this.DEFAULT_BLKSIZE,5e3,0);try{await new Promise(p=>{this.currentTransfer.resolveBlock=p});let a=0,l=1;const d=o.progressCallback;for(d&&d(0);a<s;){const p=i.slice(a,a+this.DEFAULT_BLKSIZE);this.currentTransfer.blockNum=l,this._sendFileMsg(this.FILE_DATA,l,p),await new Promise(u=>{this.currentTransfer.resolveBlock=u}),a+=p.length,l++,d&&s>0&&d(Math.min(Math.floor(a/s*100),99))}d&&d(100),s===0&&(this._sendFileMsg(this.FILE_DATA,1,new Uint8Array(0)),this.currentTransfer.blockNum=1,await new Promise(p=>{this.currentTransfer.resolveBlock=p})),this.currentTransfer=null,c()}catch(a){this.currentTransfer=null,r(a)}})}async loadFile(n,t={}){if(this.currentTransfer)throw new Error("Transfer already in progress");return new Promise((o,i)=>{this.currentTransfer={type:"DOWNLOAD",path:n,totalSize:0,receivedSize:0,blockNum:-1,chunks:[],blksize:16384,startTime:Date.now(),progressCallback:t.progressCallback,resolve:o,reject:i},this._sendFileMsg(this.FILE_RRQ,n,16384,5e3)})}subscribe(n,t){this.eventHandlers.set(n,t)}unsubscribe(n){this.eventHandlers.delete(n)}onData(n){this.dataCallbacks=[n]}onConnectionClosed(n){this.connectionClosedCallbacks.push(n)}onCompletion(n){this.completionCallbacks.push(n)}offCompletion(n){const t=this.completionCallbacks.indexOf(n);t>=0&&this.completionCallbacks.splice(t,1)}_notifyData(n,t=!1){console.debug("[RTC] _notifyData called:",{data:n,isError:t,callbackCount:this.dataCallbacks.length}),this.dataCallbacks.forEach(o=>o(n,t))}_notifyConnectionClosed(){this.connectionClosedCallbacks.forEach(n=>n())}isCommandRunning(){return this.pendingRun!==null||!this.isReady}isFileOperationActive(){return this.currentTransfer!==null||this.pendingFileOps.size>0}}class Lt{constructor(){this.client=null,this.transportType=null,this.pendingCallbacks={onData:null,onConnectionClosed:[],onCompletion:[],subscriptions:{}}}async connect(n,t="rtyu4567"){if(n.startsWith("ws://")||n.startsWith("wss://"))console.log("[Bridge] Using WebSocket transport"),this.client=new Rt,this.transportType="websocket";else if(n.startsWith("http://")||n.startsWith("https://")){if(console.log("[Bridge] Using WebRTC transport"),typeof un>"u")throw new Error("WebRTC transport not available");this.client=new un,this.transportType="webrtc"}else throw new Error(`Unknown transport protocol in URL: ${n}
Supported: ws://, wss://, http://, https://`);this.pendingCallbacks.onData&&this.client.onData(this.pendingCallbacks.onData);for(const o of this.pendingCallbacks.onConnectionClosed)this.client.onConnectionClosed(o);for(const o of this.pendingCallbacks.onCompletion)this.client.onCompletion(o);for(const[o,i]of Object.entries(this.pendingCallbacks.subscriptions))this.client.subscribe(o,i);return this.client.connect(n,t)}async disconnect(){if(this.client){const n=await this.client.disconnect();return this.client=null,this.transportType=null,n}}async exec(n){if(!this.client)throw new Error("Not connected");return this.client.exec(n)}async execBytecode(n){if(!this.client)throw new Error("Not connected");return this.client.execBytecode(n)}async run(n){if(!this.client)throw new Error("Not connected");return this.client.run(n)}async sendInput(n){if(!this.client)throw new Error("Not connected");return this.client.sendInput?this.client.sendInput(n):this.client.run(n)}async requestCompletion(n){if(!this.client)throw new Error("Not connected");return this.client.requestCompletion(n)}async interrupt(){if(!this.client)throw new Error("Not connected");return this.client.interrupt()}async reset(n=!1){if(!this.client)throw new Error("Not connected");return this.client.reset(n)}async sendDebugCommand(n){if(!this.client)throw new Error("Not connected");return this.client.sendDebugCommand(n)}async saveFile(n,t,o={}){if(!this.client)throw new Error("Not connected");return this.client.saveFile(n,t,o)}async loadFile(n,t={}){if(!this.client)throw new Error("Not connected");return this.client.loadFile(n,t)}onData(n){if(!this.client){this.pendingCallbacks.onData=n;return}this.client.onData(n)}onConnectionClosed(n){if(!this.client){this.pendingCallbacks.onConnectionClosed.push(n);return}this.client.onConnectionClosed(n)}subscribe(n,t){if(!this.client){this.pendingCallbacks.subscriptions[n]=t;return}this.client.subscribe(n,t)}unsubscribe(n){this.client&&this.client.unsubscribe(n)}onCompletion(n){if(!this.client){this.pendingCallbacks.onCompletion.push(n);return}this.client.onCompletion(n)}offCompletion(n){this.client&&this.client.offCompletion(n)}isCommandRunning(){return this.client?this.client.isCommandRunning():!1}isFileOperationActive(){return this.client?this.client.isFileOperationActive():!1}get state(){return this.client?.state||"DISCONNECTED"}get isReady(){return this.client?.isReady||!1}get authenticated(){return this.client?.authenticated||!1}set onEthStatus(n){this.client&&(this.client.onEthStatus=n)}get onEthStatus(){return this.client?.onEthStatus}set onWwanStatus(n){this.client&&(this.client.onWwanStatus=n)}get onWwanStatus(){return this.client?.onWwanStatus}set onDisplayUi(n){this.client&&(this.client.onDisplayUi=n)}get onDisplayUi(){return this.client?.onDisplayUi}set onPlotData(n){this.client&&(this.client.onPlotData=n)}get onPlotData(){return this.client?.onPlotData}set onMqttConfig(n){this.client&&(this.client.onMqttConfig=n)}get onMqttConfig(){return this.client?.onMqttConfig}set onMqttConfigSave(n){this.client&&(this.client.onMqttConfigSave=n)}get onMqttConfigSave(){return this.client?.onMqttConfigSave}set onWwanConfig(n){this.client&&(this.client.onWwanConfig=n)}get onWwanConfig(){return this.client?.onWwanConfig}set onWwanConfigSave(n){this.client&&(this.client.onWwanConfigSave=n)}get onWwanConfigSave(){return this.client?.onWwanConfigSave}set onModemStatus(n){this.client&&(this.client.onModemStatus=n)}get onModemStatus(){return this.client?.onModemStatus}set onNtpSync(n){this.client&&(this.client.onNtpSync=n)}get onNtpSync(){return this.client?.onNtpSync}set onNtpConfig(n){this.client&&(this.client.onNtpConfig=n)}get onNtpConfig(){return this.client?.onNtpConfig}set onNtpConfigSave(n){this.client&&(this.client.onNtpConfigSave=n)}get onNtpConfigSave(){return this.client?.onNtpConfigSave}set onCanConfig(n){this.client&&(this.client.onCanConfig=n)}get onCanConfig(){return this.client?.onCanConfig}set onCanConfigSave(n){this.client&&(this.client.onCanConfigSave=n)}get onCanConfigSave(){return this.client?.onCanConfigSave}set onVpnConfig(n){this.client&&(this.client.onVpnConfig=n)}get onVpnConfig(){return this.client?.onVpnConfig}set onVpnConfigSave(n){this.client&&(this.client.onVpnConfigSave=n)}get onVpnConfigSave(){return this.client?.onVpnConfigSave}set onVpnConnect(n){this.client&&(this.client.onVpnConnect=n)}get onVpnConnect(){return this.client?.onVpnConnect}set onVpnDisconnect(n){this.client&&(this.client.onVpnDisconnect=n)}get onVpnDisconnect(){return this.client?.onVpnDisconnect}set onVpnInfo(n){this.client&&(this.client.onVpnInfo=n)}get onVpnInfo(){return this.client?.onVpnInfo}set onSdcardConfig(n){this.client&&(this.client.onSdcardConfig=n)}get onSdcardConfig(){return this.client?.onSdcardConfig}set onSdcardConfigSave(n){this.client&&(this.client.onSdcardConfigSave=n)}get onSdcardConfigSave(){return this.client?.onSdcardConfigSave}set onSdcardInfo(n){this.client&&(this.client.onSdcardInfo=n)}get onSdcardInfo(){return this.client?.onSdcardInfo}set onSdcardMount(n){this.client&&(this.client.onSdcardMount=n)}get onSdcardMount(){return this.client?.onSdcardMount}set onSdcardUnmount(n){this.client&&(this.client.onSdcardUnmount=n)}get onSdcardUnmount(){return this.client?.onSdcardUnmount}set onGpioConfig(n){this.client&&(this.client.onGpioConfig=n)}get onGpioConfig(){return this.client?.onGpioConfig}set onGpioConfigSave(n){this.client&&(this.client.onGpioConfigSave=n)}get onGpioConfigSave(){return this.client?.onGpioConfigSave}set onEthConfig(n){this.client&&(this.client.onEthConfig=n)}get onEthConfig(){return this.client?.onEthConfig}set onEthConfigSave(n){this.client&&(this.client.onEthConfigSave=n)}get onEthConfigSave(){return this.client?.onEthConfigSave}set onEthInit(n){this.client&&(this.client.onEthInit=n)}get onEthInit(){return this.client?.onEthInit}}const B=new Lt,Mt="modulepreload",Bt=function(e){return"/app/"+e},pn={},R=function(n,t,o){let i=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const c=document.querySelector("meta[property=csp-nonce]"),r=c?.nonce||c?.getAttribute("nonce");i=Promise.allSettled(t.map(a=>{if(a=Bt(a),a in pn)return;pn[a]=!0;const l=a.endsWith(".css"),d=l?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${a}"]${d}`))return;const p=document.createElement("link");if(p.rel=l?"stylesheet":Mt,l||(p.as="script"),p.crossOrigin="",p.href=a,r&&p.setAttribute("nonce",r),document.head.appendChild(p),l)return new Promise((u,f)=>{p.addEventListener("load",u),p.addEventListener("error",()=>f(new Error(`Unable to preload CSS for ${a}`)))})}))}function s(c){const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=c,window.dispatchEvent(r),!r.defaultPrevented)throw c}return i.then(c=>{for(const r of c||[])r.status==="rejected"&&s(r.reason);return n().catch(s)})};let ve=null,fn=null,gn=null,Le=null;const zt=`
# Debug State Module (injected at runtime)
try:
    from time import monotonic as _time_now
    _time_unit = 1000
except ImportError:
    from time import ticks_ms as _time_now
    _time_unit = 1
import gc, json
from time import sleep

class DebugStates:
    _instance = None
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):
        self.s = "CO"  # CO: Continue, S: Step Into, SO: Step Over, ST: Step Out
        self.depth = 0
        self.target_depth = 0
        self.t = _time_now() * _time_unit
        self.d = {"t": 0, "m": gc.mem_free(), "f": "", "l": 1, "w": {}, "h": False, "d": 0, "v": {}}
        self.hc = {} # hit counts
    
    def us(self, f, l, c=True, h=None):
        if not c: return
        k = "%s:%d" % (f, l)
        self.hc[k] = self.hc.get(k, 0) + 1
        cnt = self.hc[k]
        b = False
        if h:
            try:
                if h.startswith(">="): b = cnt >= int(h[2:])
                elif h.startswith("<="): b = cnt <= int(h[2:])
                elif h.startswith(">"): b = cnt > int(h[1:])
                elif h.startswith("<"): b = cnt < int(h[1:])
                elif h.startswith("="): b = cnt == int(h[1:])
                elif h.startswith("%"): b = cnt % int(h[1:]) == 0
                else: b = cnt >= int(h)
            except: b = True
        else: b = True
        if b: self.s = "S"

    def sv(self, l):
        v = {}
        for k, val in l.items():
            if k.startswith("_") or k == "_ds": continue
            try:
                s = str(val)
                if len(s) > 100: s = s[:97] + "..."
                v[k] = s
            except: v[k] = "?"
        self.d["v"] = v
    
    def wrap(self, f):
        def w(*a, **k):
            self.depth += 1
            try: return f(*a, **k)
            finally: self.depth -= 1
        return w

    def awrap(self, f):
        async def w(*a, **k):
            self.depth += 1
            try: return await f(*a, **k)
            finally: self.depth -= 1
        return w
    
    def sh(self, fileName, lineNum):
        duration = (_time_now() * _time_unit) - self.t
        self.d = {"t": duration, "m": gc.mem_free(), "f": fileName, "l": lineNum, "w": {}, "h": False, "d": self.depth, "v": {}}
    
    def st(self):
        global _debug_cmd
        
        halt = False
        if self.s == "S": halt = True
        elif self.s == "SO":
            if self.depth <= self.target_depth: halt = True
        elif self.s == "ST":
            if self.depth < self.target_depth: halt = True
        
        if halt:
            self.d["h"] = True
            # Send state via alternate screen buffer (hidden from REPL)
            print("\\x1b[?1049hD" + json.dumps(self.d) + "D\\x1b[?1049l", end="")
            
            timeout = 30000
            start = _time_now() * _time_unit
            
            _pq_wr = None
            _pq_hs = None
            try:
                import webrepl_binary as _wr
                _pq_wr = _wr.process_queue
            except:
                try: from esp32 import webrepl as _wr; _pq_wr = _wr.process_queue
                except: pass
            try:
                import httpserver as _hs
                _pq_hs = _hs.process_queue
            except:
                try: from esp32 import httpserver as _hs; _pq_hs = _hs.process_queue
                except: pass
            
            while (_time_now() * _time_unit - start) < timeout:
                if _pq_hs: _pq_hs()
                if _pq_wr: _pq_wr()
                
                cmd = None
                if '_debug_cmd' in globals():
                    cmd = globals()['_debug_cmd']
                    if cmd: globals()['_debug_cmd'] = None
                
                if not cmd:
                    try:
                        import __main__
                        if hasattr(__main__, '_debug_cmd') and __main__._debug_cmd:
                            cmd = __main__._debug_cmd
                            __main__._debug_cmd = None
                    except: pass
                
                if not cmd:
                    try:
                        import builtins
                        if hasattr(builtins, '_debug_cmd') and builtins._debug_cmd:
                            cmd = builtins._debug_cmd
                            builtins._debug_cmd = None
                    except: pass

                if cmd:
                    if cmd in ("S", "SO", "ST", "CO", "CW"):
                        self.s = cmd
                        self.target_depth = self.depth
                    else:
                        self.s = "CO"
                    break
                
                sleep(0.01)
            
            # Send final state before continuing
            print("\\x1b[?1049hD" + json.dumps(self.d) + "D\\x1b[?1049l", end="")
        
        self.t = _time_now() * _time_unit
    
    def exec(self, code):
        g = {"__name__": "__main__", "_ds": self}
        exec(code, g)

# Initialize and reset state
_ds = DebugStates()
_debug_cmd = None
try:
    import __main__
    __main__._debug_cmd = None
except: pass

# Drain process queues
try:
    _wr = None
    _hs = None
    try: import webrepl_binary as _wr
    except:
        try: from esp32 import webrepl as _wr
        except: pass
    try: import httpserver as _hs
    except:
        try: from esp32 import httpserver as _hs
        except: pass

    if _hs and hasattr(_hs, 'process_queue'):
        while _hs.process_queue() > 0: pass
    if _wr and hasattr(_wr, 'process_queue'):
        while _wr.process_queue() > 0: pass
except: pass
`;let ae=null,Me=null;async function Ut(){if(ae&&Me)return ae;try{if(!ve){console.log("[Debugger] Lazy loading Tree-sitter...");const[e,n,t]=await Promise.all([R(()=>import("./tree-sitter-DllzGrkJ.js"),__vite__mapDeps([0,1,2,3])),R(()=>import("./tree-sitter-B3V3Ji9r.js"),[]),R(()=>import("./tree-sitter-python-DxlSE_Ss.js"),[])]);ve=e.Parser,fn=e.Language,gn=n.default,Le=t.default,console.log("[Debugger] Tree-sitter modules loaded")}if(await ve.init({locateFile:()=>gn}),ae=new ve,console.log("[Debugger] Loading Python grammar..."),!Le)throw new Error("tree-sitter-python.wasm URL not found in imports");return Me=await fn.load(Le),ae.setLanguage(Me),console.log("[Debugger] Tree-sitter parser initialized successfully"),ae}catch(e){throw console.error("[Debugger] Failed to initialize parser:",e),new Error(`Tree-sitter initialization failed: ${e.message}`)}}async function jt(e){const n=await Ut();if(!n)return new Map;const t=n.parse(e),o=new Map,i=["expression_statement","assignment","return_statement","if_statement","for_statement","while_statement","try_statement","with_statement","function_definition","async_function_definition","class_definition","break_statement","continue_statement","pass_statement","match_statement"],s=["else_clause","elif_clause","except_clause","finally_clause","case_clause"],c=r=>{if(!r)return;let a=!1;const l=r.type;s.includes(l)?a=!1:i.includes(l)?(a=!0,(l==="function_definition"||l==="async_function_definition"||l==="class_definition")&&r.parent&&r.parent.type==="decorated_definition"&&(a=!1),l==="expression_statement"&&r.childCount===1&&r.firstChild.type==="string"&&(a=!1)):l==="decorated_definition"&&(a=!0),a&&o.set(r.startPosition.row,l);for(let d=0;d<r.childCount;d++)c(r.child(d))};return c(t.rootNode),o}function Wt(e,n,t,o,i,s,c=null){let r="";if(c){const a=c.condition?`(${c.condition})`:"True",l=c.hitCount?`"${c.hitCount}"`:"None",d=c.enabled!==!1?"True":"False";r+=`${e}try:
`,r+=`${e}    _ds.us("${t}", ${o}, ${d} and ${a}, ${l})
`,r+=`${e}except:
`,r+=`${e}    pass
`}else n?r+=`${e}_ds.us("${t}", ${o}, True, None)
`:(s.forEach(a=>{r+=`${e}try:
`,r+=`${e}    if (${a}): _ds.s = "S"
`,r+=`${e}except:
`,r+=`${e}    pass
`}),r+=`${e}if _ds.s == "S":
`,e+="    ");return r+=`${e}_ds.sh("${t}", ${o})
`,r+=`${e}if _ds.s != "CO": _ds.sv(locals())
`,i.forEach(a=>{const l=a.replace(/"/g,'\\"');r+=`${e}try:
`,r+=`${e}    _ds.d["w"]["${l}"] = str(${a})
`,r+=`${e}except Exception as _debug_e:
`,r+=`${e}    _ds.d["w"]["${l}"] = str(_debug_e)
`}),r+=`${e}_ds.st()
`,r}async function hn(e,n={}){const{watches:t={},conditionalBP:o={},fileName:i="main.py"}=n,s=performance.now(),c=await jt(e);console.log(`[Debugger] Identified ${c.size} code rows in ${performance.now()-s}ms`);let r=e.split(/\r?\n/);const a=new Map,l=t[""]||[],d=t[i]||[],p=[...new Set([...l,...d])],u=o[""]||[],f=o[i]||[],g=[...new Set([...u,...f])],h=Array.from(c.keys()).sort((O,x)=>O-x);for(const O of h){const x=r[O],L=c.get(O);if(x===void 0)continue;const _=/# ●/.test(x),W=n.breakpoints&&n.breakpoints[i]?n.breakpoints[i][O+1]:null;(_||W)&&console.log(`[Debugger] Breakpoint detected at line ${O+1}: ${x}`);const z=x.match(/^(\s*)/)[1];let N=Wt(z,_,i,O+1,p,g,W);L==="function_definition"?N+=`${z}@_ds.wrap
`:L==="async_function_definition"&&(N+=`${z}@_ds.awrap
`),_&&console.log(`[Debugger] Generated instrumentation for row ${O+1} (${L})`),a.set(O,N)}let v=[];for(let O=0;O<r.length;O++)a.has(O)&&v.push(a.get(O)),v.push(r[O]);const S=v.join(`
`),P=`${zt}

# Execute isolated code
_ds.exec("""${S.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/'/g,"\\'")}""")
`,k=performance.now()-s;return console.log(`[Debugger] Instrumentation complete in ${k.toFixed(0)}ms`),P}console.log("[Libs] ES modules loaded");function Ht(e,n={}){const{className:t="",size:o=24,color:i="currentColor"}=n;return C`
    <svg class="icon icon-tabler ${t}" 
         width="${o}" 
         height="${o}" 
         viewBox="0 0 24 24" 
         fill="none" 
         stroke="${i}" 
         stroke-width="2" 
         stroke-linecap="round" 
         stroke-linejoin="round">
      <use href="#tabler-${e}" />
    </svg>
  `}const w={renderIcon:Ht};await R(()=>import("./vendor-BlQEGJgO.js"),__vite__mapDeps([1,2,3]));console.log("[Views] Vendor loaded, Component available:",!!window.Component);function F(e){const{first:n=!1,size:t="",square:o=!1,icon:i="link",onClick:s=O=>{},disabled:c=!1,active:r=!1,tooltip:a,label:l,background:d}=e;let p=html``;a&&(p=html`<div class="tooltip">${a}</div>`),p=html``;let u=r?"active":"",f=r?"selected":"",g=d?"inverted":"",h=n?"first":"",v=o?"square":"",S=c?"inactive":"active",P=t==="small"?"":html`<div class="label ${S} ${f}">${l}</div>`;const k=w.renderIcon(i,{className:""});return html`
     <div class="button ${h}">
       <button disabled=${c} class="${v}${t} ${u} ${g}" onclick=${s}>
         ${k}
       </button>
       ${P}
       ${p}
     </div>
   `}let mn=!1,ne,ce,$e,Ln,Mn,Bn,zn,Un,jn,vn,Wn,Hn,qn,Gn,Vn,Kn,Jn,Xn,Yn,Qn,Zn,et,nt,tt,it,ot=null,ee=null,st=null;async function qt(){if(!mn)try{const[e,n,t,o,i,s,c,r,a]=await Promise.all([R(()=>import("./vendor-CeCKEaxg.js").then(h=>h.af),[]),R(()=>import("./vendor-CeCKEaxg.js").then(h=>h.ae),[]),R(()=>import("./index-BalQ1Nwo.js"),__vite__mapDeps([4,5,2,6])),R(()=>import("./index-BlIhKDWf.js"),__vite__mapDeps([7,5,2])),R(()=>import("./index-DdUpN0Lu.js"),__vite__mapDeps([8,2])),R(()=>import("./vendor-CeCKEaxg.js").then(h=>h.ag),[]),R(()=>import("./index-C67KyK7a.js"),__vite__mapDeps([6,2])),R(()=>import("./index-ByjkoLU-.js"),__vite__mapDeps([9,2])),R(()=>import("./vendor-CeCKEaxg.js").then(h=>h.ah),[])]);ne=e.EditorView,Bn=e.keymap,zn=e.highlightActiveLine,Un=e.lineNumbers,jn=e.gutter,vn=e.GutterMarker,ce=n.EditorState,$e=n.Compartment,Ln=t.python,Mn=o.json,Wn=i.search,Hn=i.searchKeymap,qn=i.highlightSelectionMatches,Gn=s.foldGutter,Vn=s.foldKeymap,Kn=s.indentOnInput,Jn=s.syntaxHighlighting,Xn=s.defaultHighlightStyle,Yn=s.bracketMatching,Qn=c.closeBrackets,Zn=c.closeBracketsKeymap,et=r.indentWithTab,nt=r.defaultKeymap,tt=r.history,it=r.historyKeymap,st=class extends vn{constructor(h=!0){super(),this.enabled=h}toDOM(){const h=document.createElement("span");return h.className="cm-breakpoint"+(this.enabled?"":" cm-breakpoint-disabled"),h.textContent="●",h}},ot=ne.theme({"&":{height:"100%",fontSize:"14px"},".cm-scroller":{fontFamily:"var(--font-mono)",overflow:"auto"},".cm-content":{caretColor:"currentColor"},".cm-cursor":{borderLeftColor:"currentColor"},".cm-gutters":{backgroundColor:"transparent !important",borderRight:"none"},".cm-gutter.cm-lineNumbers":{backgroundColor:"transparent !important"},"&.cm-focused .cm-selectionBackground, ::selection":{backgroundColor:"rgba(100, 100, 100, 0.3)"},".cm-foldGutter .cm-gutterElement":{cursor:"pointer",padding:"0 3px"},".cm-breakpoint-gutter":{width:"20px !important",minWidth:"20px !important"},".cm-breakpoint-gutter .cm-gutterElement":{display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",padding:"0"},".cm-breakpoint":{color:"#e63946",fontSize:"14px",lineHeight:"1",paddingRight:"9px"},".cm-breakpoint-disabled":{opacity:"0.3"},".cm-panels":{fontSize:"14px"},".cm-panels input, .cm-panels button":{fontSize:"14px"}});const{cobalt:l,solarizedLight:d,coolGlow:p,clouds:u}=a,f=ne.theme({"&":{backgroundColor:"#2f1e2e",color:"#a39e9b"},".cm-content":{caretColor:"#a39e9b"},".cm-cursor":{borderLeftColor:"#a39e9b"},".cm-gutters":{backgroundColor:"#1e1429",color:"#776e71"},".cm-activeLine":{backgroundColor:"#41323f"},".cm-activeLineGutter":{backgroundColor:"#41323f"},".cm-panels":{backgroundColor:"#1e1429",color:"#a39e9b"}},{dark:!0}),g=ne.theme({"&":{backgroundColor:"#e7e9db",color:"#2f1e2e"},".cm-content":{caretColor:"#2f1e2e"},".cm-cursor":{borderLeftColor:"#2f1e2e"},".cm-gutters":{backgroundColor:"#d1d4c7",color:"#776e71"},".cm-activeLine":{backgroundColor:"#c0c3b5"},".cm-activeLineGutter":{backgroundColor:"#c0c3b5"},".cm-panels":{backgroundColor:"#d1d4c7",color:"#2f1e2e"}},{dark:!1});ee={cobalt:l,"solarized-light":d,"paraiso-dark":f,"paraiso-light":g,coolglow:p,clouds:u},mn=!0,console.debug("[Editor] Lazy loaded CM6 modules")}catch(e){throw console.error("[Editor] Failed to load CM6:",e),e}}class Gt extends Component{constructor(){super(),this.view=null,this.content="# empty file",this.fileName=null,this.scrollTop=0,this.currentTheme=null,this.themeCompartment=null,this.readOnlyCompartment=null,this.languageCompartment=null}createElement(n){return n&&(this.content=n),html`<div id="code-editor"></div>`}load(n){qt().then(()=>this.createEditor(n)).catch(t=>{console.error("[Editor] Failed to initialize:",t),n.innerHTML='<div style="color:red;padding:10px;">Editor failed to load. Check console for errors.</div>'})}createEditor(n){this.themeCompartment=new $e,this.readOnlyCompartment=new $e,this.languageCompartment=new $e;const t=this.getEditorTheme();if(this.currentTheme=t,this.fileName&&typeof this.fileName=="string"&&this.fileName.toLowerCase().endsWith(".json")){const a=this._tryFormatJson(this.content);a!==null&&(this.content=a)}const o=window.appState?.debugger?.active||window.appState?.debugger?.configOpen||!1,i=this.getLanguageMode(),s=this,c=jn({class:"cm-breakpoint-gutter",lineMarker:(a,l)=>{const d=a.state.doc.lineAt(l.from).number,p=a.state.doc.line(d).text;if(/# ●/.test(p)){const f=(window.appState?.debugger?.breakpoints?.[s.fileName]||{})[d],g=f?f.enabled!==!1:!0;return new st(g)}return null},domEventHandlers:{click:(a,l)=>{const d=a.state.doc.lineAt(l.from).number,p=a.state.doc.line(d).text;return/# ●/.test(p)?window.appInstance.emitter.emit("debugger:edit-breakpoint",{file:s.fileName,line:d}):s.toggleBreakpoint(d-1),!0}}}),r=ce.create({doc:this.content||"",extensions:[Un(),tt(),Gn({openText:"▼",closedText:"▶"}),Kn(),Yn(),Qn(),zn(),qn(),Jn(Xn,{fallback:!0}),Wn({top:!0}),Bn.of([...nt,...it,...Zn,...Vn,...Hn,et]),this.languageCompartment.of(i),ot,this.themeCompartment.of(ee[t]||ee.cobalt),this.readOnlyCompartment.of(ce.readOnly.of(o)),c,ne.updateListener.of(a=>{a.docChanged&&(this.content=a.state.doc.toString(),this.onChange()),a.geometryChanged&&(this.scrollTop=this.view?.scrollDOM.scrollTop||0)})]});this.view=new ne({state:r,parent:n}),setTimeout(()=>{this.view&&this.scrollTop>0&&(this.view.scrollDOM.scrollTop=this.scrollTop)},10),this.themeObserver=new MutationObserver(()=>{this.updateTheme()}),this.themeObserver.observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme"]}),this.editorThemeHandler=()=>this.updateTheme(),window.addEventListener("editor-theme-changed",this.editorThemeHandler),this.breakpointsUpdatedHandler=a=>{a.file===this.fileName&&this.syncBreakpointsFromStore()},window.appInstance.emitter.on("debugger:breakpoints-updated",this.breakpointsUpdatedHandler)}getLanguageMode(){return this.fileName&&typeof this.fileName=="string"&&this.fileName.toLowerCase().endsWith(".json")?Mn():Ln()}getEditorTheme(){const n=document.documentElement.getAttribute("data-theme")==="dark";switch(localStorage.getItem("editorTheme")||"auto"){case"cobalt":return n?"cobalt":"solarized-light";case"paraiso":return n?"paraiso-dark":"paraiso-light";case"coolglow":return n?"coolglow":"clouds";case"auto":default:return n?"cobalt":"solarized-light"}}updateTheme(){if(!this.view||!ee)return;const n=this.getEditorTheme();n!==this.currentTheme&&(this.currentTheme=n,this.view.dispatch({effects:this.themeCompartment.reconfigure(ee[n]||ee.cobalt)}))}update(n){if(this.view&&window.appState?.debugger){const t=window.appState.debugger.active||window.appState.debugger.configOpen;this.view.state.facet(ce.readOnly)!==t&&(this.view.dispatch({effects:this.readOnlyCompartment.reconfigure(ce.readOnly.of(t))}),this.view.dom.style.opacity=t?"0.7":"1.0")}return!1}unload(){this.themeObserver&&(this.themeObserver.disconnect(),this.themeObserver=null),this.editorThemeHandler&&(window.removeEventListener("editor-theme-changed",this.editorThemeHandler),this.editorThemeHandler=null),this.breakpointsUpdatedHandler&&(window.appInstance.emitter.removeListener("debugger:breakpoints-updated",this.breakpointsUpdatedHandler),this.breakpointsUpdatedHandler=null),this.view&&(this.scrollTop=this.view.scrollDOM.scrollTop,this.view.destroy(),this.view=null)}updateScrollPosition(n){this.scrollTop=n.target.scrollTop}onChange(){return!1}_tryFormatJson(n){if(typeof n!="string")return null;const t=n.trim();if(!t)return null;const o=t[0];if(o!=="{"&&o!=="[")return null;try{const i=JSON.parse(t);return JSON.stringify(i,null,2)+`
`}catch{return null}}toggleBreakpoint(n){if(!this.view)return;const t=this.view.state.doc.line(n+1),o=t.text,i=/# ●/.test(o);let s;i?s=o.replace(/\s*# ●.*/,""):s=o.trimEnd()+" # ●",this.view.dispatch({changes:{from:t.from,to:t.to,insert:s}})}syncBreakpointsFromStore(){if(!this.view||!this.fileName)return;const n=window.appState?.debugger?.breakpoints?.[this.fileName]||{},t=this.view.state.doc,o=[];for(let i=1;i<=t.lines;i++){const s=t.line(i),c=s.text,r=n[i],a=/# ●/.test(c);if(r&&!a)o.push({from:s.to,to:s.to,insert:" # ●"});else if(!r&&a){const l=c.match(/\s*# ●.*/);if(l){const d=s.from+c.indexOf(l[0]);o.push({from:d,to:s.to,insert:""})}}}o.length>0&&this.view.dispatch({changes:o})}}const Vt=Object.freeze(Object.defineProperty({__proto__:null,CodeMirrorEditor:Gt},Symbol.toStringTag,{value:"Module"}));function Kt(e){const{text:n="undefined",icon:t="device-desktop",onSelectTab:o=()=>!1,onCloseTab:i=()=>!1,onStartRenaming:s=()=>!1,onFinishRenaming:c=()=>!1,active:r=!1,renaming:a=!1,hasChanges:l=!1}=e;if(r)if(a){let u=function(g){c(g.target.value)},f=function(g){g.key.toLowerCase()==="enter"&&g.target.blur(),g.key.toLowerCase()==="escape"&&(g.target.value=null,g.target.blur())};return html`
        <div class="tab active" tabindex="0">
          ${w.renderIcon(t,{className:"icon"})}
          <div class="text">
            <input type="text"
              value=${n}
              onblur=${u}
              onkeydown=${f}
              />
          </div>
        </div>
      `}else{let u=function(f){f.stopPropagation(),i(f)};return html`
        <div class="tab active" tabindex="0">
          ${w.renderIcon(t,{className:"icon"})}
          <div class="text" onclick=${s}>
            ${l?" *":""} ${n}
          </div>
          <div class="options" >
            <button onclick=${u}>
              ${w.renderIcon("x",{className:"icon"})}
            </button>
          </div>
        </div>
      `}function d(u){u.target.classList.contains("close-tab")||o(u)}function p(u){u.stopPropagation(),i(u)}return html`
    <div
      class="tab"
      tabindex="1"
      onclick=${d}
      >
      ${w.renderIcon(t,{className:"icon"})}
      <div class="text">
        ${l?"*":""} ${n}
      </div>
      <div class="options close-tab">
        <button class="close-tab" onclick=${p}>
          ${w.renderIcon("x",{className:"close-tab icon"})}
        </button>
      </div>
    </div>
  `}const G="\x1B[38;2;221;221;221m>>> \x1B[0m";function Oe(e){const n=e.cache(H,"terminal");if(!n||!n.term){console.debug("[TerminalHelpers] Terminal not ready yet, will bind on view switch");return}const t=n.term;B.onData((i,s=!1)=>{if(i){const c=i.replace(/\n/g,`\r
`);s?t.write("\x1B[91m"+c+"\x1B[0m\x1B[38;2;51;255;51m"):t.write(c),t.scrollToBottom()}})}function Q(e,n,t,o){const i=o.isCommandRunning&&o.isCommandRunning(),s=i?"":G,c=i?0:4;e.write("\r\x1B[K"+s+n);const r=c+t,a=c+n.length;r<a&&e.write("\x1B["+(a-r)+"D")}function Jt(e,n,t){e.onData(async o=>{if(o==="\x1B[A"){n.commandHistory.length>0&&(n.historyIndex===-1?(n.savedLine=n.currentLine,n.historyIndex=n.commandHistory.length-1):n.historyIndex>0&&n.historyIndex--,n.currentLine=n.commandHistory[n.historyIndex],n.cursorPos=n.currentLine.length,Q(e,n.currentLine,n.cursorPos,t)),e.scrollToBottom();return}if(o==="\x1B[B"){n.historyIndex!==-1&&(n.historyIndex++,n.historyIndex>=n.commandHistory.length?(n.currentLine=n.savedLine||"",n.historyIndex=-1):n.currentLine=n.commandHistory[n.historyIndex],n.cursorPos=n.currentLine.length,Q(e,n.currentLine,n.cursorPos,t)),e.scrollToBottom();return}if(o==="\x1B[D"){n.cursorPos>0&&(n.cursorPos--,e.write("\x1B[D"));return}if(o==="\x1B[C"){n.cursorPos<n.currentLine.length&&(n.cursorPos++,e.write("\x1B[C"));return}if(o==="\r"||o===`
`){if(e.write(`\r
`),n.currentLine.trim().length>0){(n.commandHistory.length===0||n.commandHistory[n.commandHistory.length-1]!==n.currentLine)&&(n.commandHistory.push(n.currentLine),n.commandHistory.length>100&&n.commandHistory.shift()),n.historyIndex=-1,n.savedLine="";try{if(t.isCommandRunning&&t.isCommandRunning()){console.log("[Terminal] Sending input to running command:",n.currentLine),await t.sendInput(n.currentLine),n.currentLine="",n.cursorPos=0;return}else{const i=n.currentLine;n.currentLine="",n.cursorPos=0;const s=performance.now();console.log("[Terminal] Calling device.run at",s.toFixed(0)),await t.run(i),console.log("[Terminal] device.run returned after",(performance.now()-s).toFixed(0),"ms")}}catch(i){e.write("Error: "+i.message+`\r
`)}}e.write(G)}else if(o==="	"){if(n.isConnected&&t&&typeof t.requestCompletion=="function")try{const i=await t.requestCompletion(n.currentLine);if(!i||i.length===0){e.write("\x07");return}const s=l=>l&&l.length>=2&&/^[A-Z][A-Z0-9_]*$/.test(l),c=i.filter(l=>!s(l));if(c.length===0){e.write("\x07");return}let r="",a=[];if(c.length===1)r=c[0];else{const l=n.currentLine;let d=c[0];for(let p=1;p<c.length;p++){let u=0;for(;u<d.length&&u<c[p].length&&d[u]===c[p][u];)u++;d=d.slice(0,u)}d.length>l.length&&(r=d.slice(l.length)),a=c}if(r&&(n.currentLine=n.currentLine.slice(0,n.cursorPos)+r+n.currentLine.slice(n.cursorPos),n.cursorPos+=r.length,Q(e,n.currentLine,n.cursorPos,t)),a.length>0){e.write(`\r
`);const l=80;let d="";for(const p of a){const u=d.length+p.length+(d?4:0);d&&u>l?(e.write(d+`\r
`),d=p):d=d?d+"    "+p:p}d&&e.write(d+`\r
`),e.write(G),Q(e,n.currentLine,n.cursorPos,t)}}catch(i){console.error("[Terminal] Completion error:",i),e.write("\x07")}else e.write("\x07");e.scrollToBottom()}else if(o==="")e.write(`^C\r
`),n.currentLine="",n.cursorPos=0,n.historyIndex=-1,e.write(G);else if(o===""||o==="\b")n.cursorPos>0&&(t.isCommandRunning&&t.isCommandRunning()?(n.currentLine=n.currentLine.slice(0,-1),n.cursorPos--,e.write("\b \b")):(n.currentLine=n.currentLine.slice(0,n.cursorPos-1)+n.currentLine.slice(n.cursorPos),n.cursorPos--,Q(e,n.currentLine,n.cursorPos,t)));else if(o.length>=1){const i=o.split("").filter(s=>{const c=s.charCodeAt(0);return c>=32&&c<127}).join("");i.length>0&&(t.isCommandRunning&&t.isCommandRunning()?(n.currentLine+=i,n.cursorPos+=i.length,e.write(i)):(n.currentLine=n.currentLine.slice(0,n.cursorPos)+i+n.currentLine.slice(n.cursorPos),n.cursorPos+=i.length,Q(e,n.currentLine,n.cursorPos,t)))}e.scrollToBottom()})}async function Xt(e,n=null){const t=()=>`\x1B[3m${e}\x1B[0m`;return typeof figlet<"u"&&typeof figlet=="function"?ye(e,figlet,n).catch(()=>t()):document.querySelector('script[src*="figlet"]')?typeof figlet<"u"&&typeof figlet=="function"?ye(e,figlet,n).catch(()=>t()):new Promise(i=>{let s=0;const c=setInterval(()=>{s++,typeof figlet<"u"&&typeof figlet=="function"?(clearInterval(c),ye(e,figlet,n).then(i).catch(()=>i(t()))):s>50&&(clearInterval(c),i(t()))},100)}):new Promise(i=>{const s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/figlet@1.7.0/lib/figlet.js",s.onload=()=>{setTimeout(()=>{typeof figlet<"u"&&typeof figlet=="function"?ye(e,figlet,n).then(i).catch(()=>i(t())):i(t())},100)},s.onerror=()=>{i(t())},document.head.appendChild(s)})}function ye(e,n,t=null){return new Promise(o=>{n.defaults&&n.defaults({fontPath:"https://cdn.jsdelivr.net/npm/figlet@1.7.0/fonts"});const i=["Slant","Standard","Block","Small","Big"],s=t?[t,...i.filter(a=>a!==t)]:i;let c=0;const r=()=>{if(c>=s.length){o(`\x1B[3m${e}\x1B[0m`);return}const a=s[c++];n(e,a,(l,d)=>{l||!d||d.length<=e.length*3?r():o(d)})};r()})}let ke=null,_e=null,yn=!1;async function rt(){if(yn)return{Terminal:ke,FitAddon:_e};try{const[e,n]=await Promise.all([R(()=>import("./xterm-CASmyfyk.js"),[]),R(()=>import("./addon-fit-DOCEibfw.js"),[]),R(()=>Promise.resolve({}),__vite__mapDeps([10]))]);return ke=e.Terminal,_e=n.FitAddon,yn=!0,console.debug("[XTerm] Lazy loaded xterm modules"),{Terminal:ke,FitAddon:_e}}catch(e){throw console.error("[XTerm] Failed to load xterm:",e),e}}rt();class H extends xt{constructor(n,t,o){super(n),this.term=null,this.fitAddon=null,this.resizeObserver=null,this.inputBound=!1,this._emit=o}load(n){if(this.term){console.debug("[XTerm] Reusing existing terminal instance (no re-open needed)");const t=this.term.element?.parentElement;t&&n.appendChild(t),this.resizeObserver&&this.resizeObserver.disconnect(),this.resizeObserver=new ResizeObserver(()=>{setTimeout(()=>this.fitTerminal(),50)}),this.resizeObserver.observe(n),setTimeout(()=>this.fitTerminal(),50),setTimeout(()=>this.fitTerminal(),150);return}rt().then(()=>this.ensureFontsLoaded()).then(()=>this.createAndOpenTerminal(n)).catch(t=>{console.error("[XTerm] Failed to initialize terminal:",t),n.innerHTML='<div style="color:red;padding:10px;">Terminal failed to load. Check console for errors.</div>'})}async ensureFontsLoaded(){if(document.fonts&&document.fonts.ready)try{return await document.fonts.ready,document.fonts.check&&await new Promise(n=>setTimeout(n,50)),Promise.resolve()}catch{return new Promise(t=>setTimeout(t,200))}else return new Promise(n=>setTimeout(n,200))}createAndOpenTerminal(n){this.term=new ke({fontFamily:"CodeFont, Cascadia Code, Menlo, Monaco, Consolas, monospace",fontSize:14,letterSpacing:0,cursorBlink:!0,cursorStyle:"block",scrollback:1e3,theme:{foreground:"#33ff33",background:"#000000",cursor:"#FFFFFF",cursorAccent:"#000000"}}),this.term.open(n),this.fitAddon=new _e,this.term.loadAddon(this.fitAddon),setTimeout(()=>this.fitTerminal(),50),setTimeout(()=>this.fitTerminal(),150),setTimeout(()=>this.fitTerminal(),300),setTimeout(()=>this.fitTerminal(),600);let t=null;const o=()=>{t&&clearTimeout(t),t=setTimeout(()=>this.fitTerminal(),100)};this.resizeObserver=new ResizeObserver(o),this.resizeObserver.observe(n);const i=n.closest(".repl-panel-main");i&&this.resizeObserver.observe(i)}createElement(){return C`<div class="terminal-wrapper"></div>`}update(){return this.fitAddon&&setTimeout(()=>this.fitTerminal(),50),!1}unload(){this.resizeObserver&&(this.resizeObserver.disconnect(),this.resizeObserver=null)}fitTerminal(){if(!(!this.term||!this.fitAddon))try{this.fitAddon.fit(),this.term.refresh&&this.term.refresh(0,this.term.rows-1)}catch(n){console.warn("[XTerm] Fit failed:",n)}}resizeTerm(){this.fitTerminal()}bindInput(n,t){return this.inputBound||!this.term?!1:(console.debug("[XTerm] Binding input handler"),this.inputBound=!0,this.term.textarea&&this.term.textarea.addEventListener("focus",()=>{this._emit&&this._emit("terminal-focus")}),Jt(this.term,n,t),!0)}isInputBound(){return this.inputBound}}function Yt(e,n){if(e.editingFile){const t=e.openFiles.find(o=>o.id==e.editingFile);return t?t.editor.render():(console.error("[CodeEditor] File not found for id:",e.editingFile),C`<div id="code-editor">File not found</div>`)}else return C`
      <div id="code-editor"></div>
    `}function Qt(e,n){const t=e.isConnectionDialogOpen?"open":"closed",o=localStorage.getItem("webrepl-url")||"",i=localStorage.getItem("webrepl-password")||"";let s=!1;function c(p){s=p.target.closest(".dialog-content")!==null}function r(p){p.target.id=="dialog-connection"&&!s&&n("close-connection-dialog"),s=!1}function a(p){if(p.preventDefault(),p.stopPropagation(),e.isConnecting)return;const u=document.getElementById("webrepl-url").value,f=document.getElementById("webrepl-password").value;n("connect-webrepl",{wsUrl:u,password:f})}function l(p){p.stopPropagation(),p.key==="Enter"&&!e.isConnecting&&a(p)}e.isConnectionDialogOpen&&!window._connectionDialogEnterHandler?(window._connectionDialogEmit=n,window._connectionDialogEnterHandler=p=>{const u=document.getElementById("dialog-connection");if(!u||!u.classList.contains("open"))return;const f=u.querySelector(".connect-button");if(!(f&&f.disabled)&&p.key==="Enter"){const g=p.target;if(g.tagName!=="INPUT"&&g.tagName!=="TEXTAREA"){p.preventDefault(),p.stopPropagation();const h=document.getElementById("webrepl-url")?.value,v=document.getElementById("webrepl-password")?.value;h&&v&&window._connectionDialogEmit&&window._connectionDialogEmit("connect-webrepl",{wsUrl:h,password:v})}}},document.addEventListener("keydown",window._connectionDialogEnterHandler)):!e.isConnectionDialogOpen&&window._connectionDialogEnterHandler&&(document.removeEventListener("keydown",window._connectionDialogEnterHandler),window._connectionDialogEnterHandler=null,window._connectionDialogEmit=null);const d=html`
  <div id="dialog-connection" class="dialog ${t}" tabindex="-1" onmousedown=${c} onclick=${r} onkeydown=${p=>{p.key==="Enter"&&!e.isConnecting&&(p.preventDefault(),p.stopPropagation(),a(p))}} oncreate=${()=>{const p=document.getElementById("webrepl-url"),u=document.getElementById("webrepl-password");p&&o&&(p.value=o),u&&i&&(u.value=i)}}>
    
    <div class="dialog-content webrepl-dialog">
      <div class="dialog-header">
        <div class="dialog-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
        </div>
        <div class="dialog-title">Connect to Device</div>
        <div class="dialog-subtitle">Enter your device connection details</div>
      </div>
      
      <div class="dialog-body">
        <div class="form-group">
          <label class="form-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M2 12h20"/>
            </svg>
            Device URL
          </label>
          <input 
            type="text" 
            id="webrepl-url" 
            class="form-input"
            placeholder="https://scripto-XXXX.local/webrepl (WebRTC) or wss://192.168.1.32/webrepl (WebSocket)"
            value=${o}
            onclick=${p=>p.stopPropagation()}
            onkeydown=${l}
          />
        </div>
        
        <div class="form-group">
          <label class="form-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Password
          </label>
          <input 
            type="password" 
            id="webrepl-password" 
            class="form-input"
            placeholder="Enter password"
            value=${i}
            onclick=${p=>p.stopPropagation()}
            onkeydown=${l}
          />
        </div>
        
        <div class="dialog-footer">
          <button class="connect-button" onclick=${a} disabled=${e.isConnecting}>
            ${e.isConnecting?"Connecting...":"Connect"}
          </button>
          <div class="dialog-feedback ${e.isConnecting?"connecting":""}">
            ${e.isConnecting?html`<svg class="spinner" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg> Connecting...`:"Press Enter or click Connect to begin"}
          </div>
        </div>
      </div>
    </div>
    
  </div>
  `;if(e.isConnectionDialogOpen)return d}function Zt(e="/"){return`
import os, json
S_IFDIR = 0x4000
S_IFREG = 0x8000
def S_ISDIR(m): return (m & 0xF000) == S_IFDIR
def S_ISREG(m): return (m & 0xF000) == S_IFREG
def _join(p1, p2):
    if p1 == "/" and not p2.startswith("/"): return "/" + p2
    elif p1 == "/": return p2
    return p1 + "/" + p2

dir_path = ${JSON.stringify(e)}
result_list = []
entries_dict = {}

try:
    # 1. Check if dir_path exists and is a directory
    dir_stats = os.stat(dir_path)
    if S_ISDIR(dir_stats[0]):
        # Use ilistdir() which provides file type AND size directly
        try:
            for entry in os.ilistdir(dir_path):
                item_name = entry[0]
                item_mode = entry[1] if len(entry) > 1 else None
                item_size = entry[3] if len(entry) > 3 else -1
                item_type = 'unknown'
                
                if item_mode is not None:
                    if S_ISDIR(item_mode):
                        item_type = 'dir'
                        item_size = 0
                    elif S_ISREG(item_mode):
                        item_type = 'file'
                        # Size is already in entry[3]
                        if item_size == -1:
                            try:
                                fullpath = _join(dir_path, item_name)
                                item_stats = os.stat(fullpath)
                                item_size = item_stats[6]
                            except: item_size = -1
                else:
                    # Fallback if no mode in entry
                    try:
                        fullpath = _join(dir_path, item_name)
                        item_stats = os.stat(fullpath)
                        item_mode = item_stats[0]
                        if S_ISDIR(item_mode):
                            item_type = 'dir'
                            item_size = 0
                        elif S_ISREG(item_mode):
                            item_type = 'file'
                            item_size = item_stats[6]
                    except: pass
                
                result_list.append({'name': item_name, 'type': item_type, 'size': item_size})
        except AttributeError:
            # Fallback for old MicroPython without ilistdir
            for item_name in os.listdir(dir_path):
                item_type = 'unknown'
                item_size = -1
                try:
                    fullpath = _join(dir_path, item_name)
                    item_stats = os.stat(fullpath)
                    item_mode = item_stats[0]
                    if S_ISDIR(item_mode):
                        item_type = 'dir'
                        item_size = 0
                    elif S_ISREG(item_mode):
                        item_type = 'file'
                        item_size = item_stats[6]
                except: pass
                result_list.append({'name': item_name, 'type': item_type, 'size': item_size})
except: pass

# 2. Sort the list
result_list.sort(key=lambda item: (0 if item.get('type') == 'dir' else 1, item.get('name', '')))

# 3. Format dictionary
for item_map in result_list:
    f_name = item_map.get('name')
    f_type = item_map.get('type')
    f_size = item_map.get('size')
    if f_name is not None:
        entries_dict[f_name] = f_size if f_type == 'file' else None

print(json.dumps({'path': dir_path, 'entries': entries_dict}))`.trim()}function ei(e){return`
import os
S_IFDIR = 0x4000
def S_ISDIR(m): return (m & 0xF000) == S_IFDIR
def _join(p1, p2):
    if p1 == "/" and not p2.startswith("/"): return "/" + p2
    elif p1 == "/": return p2
    return p1 + "/" + p2

def _recursive_delete(path):
    try:
        stat_info = os.stat(path)
        if S_ISDIR(stat_info[0]):
            items = os.listdir(path)
            for item in items:
                full_path = _join(path, item)
                _recursive_delete(full_path)
            os.rmdir(path)
        else:
            os.remove(path)
    except OSError as e:
        raise Exception("Error deleting " + path + ": " + str(e))

_recursive_delete(${JSON.stringify(e)})
`.trim()}async function ni(e){const n=await e.exec("getSysInfo()");return typeof n=="string"?JSON.parse(n):n}async function ti(e){const n=await e.exec("getNetworksInfo()");return typeof n=="string"?JSON.parse(n):n}async function at(e,n="/"){const o=(await e.exec(Zt(n))).entries||{};return Object.entries(o).map(([i,s])=>({fileName:i,size:s,type:s===null?"folder":"file"}))}async function ii(e,n){const t=`import os, json; print(json.dumps(os.stat('${n}')))`,o=await e.exec(t);return typeof o=="string"?JSON.parse(o):o}async function wn(e,n){const t=`import os; os.remove('${n}')`;await e.exec(t)}async function bn(e,n,t){const o=`import os; os.rename('${n}', '${t}')`;await e.exec(o)}async function oi(e,n){const t=`import os; os.mkdir('${n}')`;await e.exec(t)}async function te(e,n){try{return await ii(e,n),!0}catch{return!1}}async function si(e,n){await e.exec(ei(n))}function lt(e,n,t){let o=e||"";return n&&n!=="/"&&(o+=n),t&&(o+="/"+t),o.replace(/\/+/g,"/")}function Cn(e,n){if(n===".."){const t=e.split("/").filter(o=>o);return t.pop(),"/"+t.join("/")}return e==="/"?"/"+n:e+"/"+n}const fe=()=>V,ct=()=>B,$=lt;async function Ve(e){let t=await fe().ilistFiles(e);return t=t.map(o=>({fileName:o.path,type:o.type,size:o.size})),t=t.sort(dt),t}async function Ke(e){let n=await at(B,e);return n=n.sort(dt),n}function dt(e,n){return e.fileName.localeCompare(n.fileName)}async function xn({root:e,parentFolder:n,fileName:t}){if(e==null||n==null||t==null)return!1;const o=fe(),i=o.getFullPath(e,n,t),s=await o.fileExists(i),c=await o.folderExists(i);return s||c}async function Sn({root:e,parentFolder:n,fileName:t}){return e==null||n==null||t==null?!1:te(B,$(e,n,t))}async function le({fileNames:e=[],parentPath:n,source:t}){let o=[];return t==="board"?o=await Ke(n):o=await Ve(n),o.filter(i=>e.indexOf(i.fileName)!==-1)}function Je(e){{const n=`New${window.appState.fileCounter}.py`;return window.appState.fileCounter++,n}}function ri(){return`${Date.now()}_${parseInt(Math.random()*1024)}`}async function ai(e,n,t){t=t||function(){};const o=ct(),i=fe();await o.createFolder(n);let s=await i.ilistAllFiles(e);for(let c in s){const r=s[c],a=r.path.substring(e.length);if(r.type==="folder")await o.createFolder($(n,a,""));else{const l=i.getFullPath(e,a,""),d=$(n,a,""),p=await V.loadFile(l),u=new Uint8Array(p);await o.saveFile(d,u,{progressCallback:f=>{t(f,a)}})}t(100,a)}}async function li(e,n,t){t=t||function(){},await fe().createFolder(n);try{const i=[];async function s(c){const r=await at(B,c);for(const a of r){const l=c==="/"?`/${a.fileName}`:`${c}/${a.fileName}`;a.type==="folder"?(i.push({path:l,type:"folder"}),await s(l)):i.push({path:l,type:"file"})}}await s(e);for(let c in i){const r=i[c],a=r.path.substring(e.length),l=fe(),d=ct();if(r.type=="folder")await l.createFolder(l.getFullPath(n,a,""));else{const p=$(e,a,""),u=$(n,a,""),f=await d.loadFile(p,{progressCallback:g=>{t(g,a)}});await V.saveFileContent(u,f.buffer)}t(100,a)}}catch(i){throw console.error(`[Store] Error downloading folder ${e}:`,i),new Error(`Failed to download folder: ${i.message}`)}}async function Be(e){try{await si(B,e)}catch(n){throw console.error(`[Store] Error removing folder ${e}:`,n),new Error(`Failed to remove folder: ${n.message}`)}}function ut({isConnected:e,openFiles:n,editingFile:t}){const o=n.find(i=>i.id===t);return!o||!o.hasChanges?!1:o.source==="disk"?!0:e}function Te({isConnected:e}){return e}function ci({isConnected:e,selectedFiles:n}){const t=n.filter(o=>o.source==="disk");return e&&n.length>0&&t.length===0}function di({isConnected:e,selectedFiles:n}){const t=n.filter(o=>o.source==="board");return e&&n.length>0&&t.length===0}function ui({selectedFiles:e}){return e.filter(t=>t.type=="file").length!=0}function pi(e,n){const t=e.isNewFileDialogOpen?"open":"closed";function o(u){u.target.id=="dialog-new-file"&&n("close-new-file-dialog")}function i(u){return()=>{const f=document.querySelector("#file-name"),g=f.value.trim()||f.placeholder;n("create-new-tab",u,g)}}let s="";e.isConnected&&(s=html`
      <button class="button item" onclick=${i("board")}>Board</button>
    `),new MutationObserver((u,f)=>{const g=document.querySelector("#dialog-new-file input");g&&(g.focus(),f.disconnect())}).observe(document.body,{childList:!0,subtree:!0});let r="",a="";a=Je();const l={type:"text",id:"file-name",value:r,placeholder:a},d=Je();e.newFileName===null&&`${d}`;const p=html`
  <div id="dialog-new-file" class="dialog ${t}" onclick=${o}>
    <div class="dialog-content">
      <h2 class="dialog-title">Create new file</h2>
      <input class="dialog-input" ${l} />
      <div class="buttons-horizontal">
        ${s}
        <button class="button item" onclick=${i("disk")}>Computer</button>
      </div>
    </div>
  </div>
`;if(e.isNewFileDialogOpen){const u=p.querySelector("#dialog-new-file .dialog-content > input");return u&&u.focus(),p}}function fi(e,n){return e.isScriptOsModalOpen?html`
    <div class="scriptos-modal-overlay" onclick=${t=>{t.target.classList.contains("scriptos-modal-overlay")&&n("close-scriptos-modal")}}>
      <div class="scriptos-modal">
        <button 
          class="scriptos-modal-close" 
          onclick=${()=>n("close-scriptos-modal")}
          title="Close">
          ×
        </button>
        ${e.scriptOsModalView==="library"?gi(e,n):hi(e,n)}
      </div>
    </div>
  `:html`<div></div>`}function gi(e,n){if(e.scriptOsCategoryCollapse||(e.scriptOsCategoryCollapse={}),e.isLoadingRegistry)return html`
      <div class="scriptos-library">
        <div class="scriptos-empty">
          <div class="scriptos-loading-spinner"></div>
          <h3>Loading ScriptO Registry...</h3>
          <p>Fetching ScriptOs from the cloud registry</p>
        </div>
      </div>
    `;const t=u=>u.registryEntry?{name:u.registryEntry.name||u.filename,description:u.registryEntry.description||"",tags:u.registryEntry.tags||[],author:u.registryEntry.author||"",version:u.registryEntry.version||[1,0,0]}:u.config&&u.config.info?{name:u.config.info.name||u.filename,description:u.config.info.description||"",tags:u.config.info.category?[u.config.info.category]:[],author:u.config.info.author||"",version:u.config.info.version||[1,0,0]}:{name:u.filename,description:"",tags:[],author:"",version:[1,0,0]},o=new Set;e.scriptOsList.forEach(u=>{t(u).tags.forEach(g=>o.add(g))});const i=Array.from(o).sort(),s=(e.scriptOsSearchQuery||"").toLowerCase(),c=e.scriptOsFilterTags||[],r=e.scriptOsList.filter(u=>{const f=t(u),g=f.name.toLowerCase(),h=f.description.toLowerCase(),v=f.tags.join(" ").toLowerCase(),S=!s||g.includes(s)||h.includes(s)||v.includes(s),P=c.length===0||c.every(k=>f.tags.includes(k));return S&&P}),a={},l=[];r.forEach(u=>{const f=t(u),g=f.tags.length>0?f.tags[0]:null;g?(a[g]||(a[g]=[]),a[g].push(u)):l.push(u)});const d=Object.keys(a).sort(),p=u=>{e.scriptOsCategoryCollapse[u]=!e.scriptOsCategoryCollapse[u],n("render")};return html`
    <div class="scriptos-library">
      <div class="scriptos-header-sticky">
        <div class="scriptos-header">
          <h2>ScriptO Registry</h2>
          <p class="scriptos-subtitle">
            ${e.scriptOsList.length} ScriptO${e.scriptOsList.length!==1?"s":""} available from cloud registry
          </p>
        </div>
        
        ${e.scriptOsList.length>0?html`
          <div class="scriptos-search">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="scriptos-search-icon">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input 
            type="text" 
            class="scriptos-search-input"
            placeholder="Search ScriptOs by name, description, or tags..."
            value="${e.scriptOsSearchQuery||""}"
            oninput=${u=>n("scriptos-search",u.target.value)}
          />
          ${s?html`
            <button 
              class="scriptos-search-clear"
              onclick=${()=>n("scriptos-search","")}
              title="Clear search">
              ×
            </button>
          `:""}
          </div>
          
          ${i.length>0?html`
            <div class="scriptos-tag-filters">
              <div class="scriptos-tag-filters-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                </svg>
                Filter by tags:
              </div>
              <div class="scriptos-tag-filters-list">
                ${i.map(u=>{const f=c.includes(u);return html`
                    <button 
                      class="scriptos-tag-filter ${f?"active":""}"
                      onclick=${()=>n("scriptos-toggle-tag",u)}
                      title="${f?"Remove filter":"Filter by "+u}">
                      ${u}
                      ${f?html`<span class="scriptos-tag-check">✓</span>`:""}
                    </button>
                  `})}
              </div>
              ${c.length>0?html`
                <button 
                  class="scriptos-clear-filters"
                  onclick=${()=>n("scriptos-clear-tags")}
                  title="Clear all filters">
                  Clear filters (${c.length})
                </button>
              `:""}
            </div>
          `:""}
        `:""}
      </div>
      
      <div class="scriptos-content">
        ${e.scriptOsList.length===0?html`
          <div class="scriptos-empty">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
              <line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
            <h3>No ScriptOs Found</h3>
            <p>Unable to load ScriptOs from the registry</p>
            <p class="scriptos-hint">
              Check your internet connection and try again
            </p>
          </div>
        `:r.length===0?html`
          <div class="scriptos-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <h3>No ScriptOs Found</h3>
            <p>No ScriptOs match "${s}"</p>
            <button 
              class="scriptos-btn scriptos-btn-primary"
              onclick=${()=>n("scriptos-search","")}>
              Clear Search
            </button>
          </div>
        `:html`
          <div class="scriptos-categories">
            ${d.map(u=>{const f=e.scriptOsCategoryCollapse[u]===!0;return html`
                <div class="scriptos-category ${f?"collapsed":""}">
                  <h3 class="scriptos-category-title" onclick=${()=>p(u)}>
                    <svg class="scriptos-category-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                    <span>${u}</span>
                    <span class="scriptos-category-count">${a[u].length}</span>
                  </h3>
                  <div class="scriptos-grid" style="${f?"display: none;":""}">
                    ${a[u].map(g=>En(g,n))}
                  </div>
                </div>
              `})}
            ${l.length>0?html`
              <div class="scriptos-category ${e.scriptOsCategoryCollapse.Other?"collapsed":""}">
                <h3 class="scriptos-category-title" onclick=${()=>p("Other")}>
                  <svg class="scriptos-category-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                  <span>Other</span>
                  <span class="scriptos-category-count">${l.length}</span>
                </h3>
                <div class="scriptos-grid" style="${e.scriptOsCategoryCollapse.Other?"display: none;":""}">
                  ${l.map(u=>En(u,n))}
                </div>
              </div>
            `:""}
          </div>
        `}
      </div>
    </div>
  `}function En(e,n){let t,o,i;return e.registryEntry?(t=e.registryEntry,i=t.tags||[]):e.config&&e.config.info?(t=e.config.info,i=t.category?[t.category]:[]):(t={},i=[]),o="v1.0.0",t.version&&(Array.isArray(t.version)?o=`v${t.version.join(".")}`:o=`v${t.version}`),html`
    <div 
      class="scriptos-card"
      onclick=${()=>n("select-scriptos",e)}>
      <div class="scriptos-card-header">
        <div class="scriptos-card-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="16 18 22 12 16 6"/>
            <polyline points="8 6 2 12 8 18"/>
          </svg>
        </div>
        <h3>${t.name||e.filename}</h3>
        <span class="scriptos-card-version">${o}</span>
      </div>
      
      <p class="scriptos-card-description">
        ${t.description||"No description available"}
      </p>
      
      ${i.length>0?html`
        <div class="scriptos-card-tags">
          ${i.slice(0,3).map(s=>html`<span class="scriptos-tag-badge">${s}</span>`)}
          ${i.length>3?html`<span class="scriptos-tag-badge">+${i.length-3}</span>`:""}
        </div>
      `:""}
      
      <div class="scriptos-card-footer">
        ${t.author?html`
          <span class="scriptos-card-author">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            ${t.author}
          </span>
        `:""}
      </div>
    </div>
  `}function hi(e,n){const t=e.selectedScriptOs;if(!t)return html`<div>Loading...</div>`;const o=t.config.info||{},i=t.config.args,s=i&&typeof i=="object"&&Object.keys(i).length>0;let c="v1.0.0";return o.version&&(Array.isArray(o.version)?c=`v${o.version.join(".")}`:c=`v${o.version}`),html`
    <div class="scriptos-config">
      <div class="scriptos-config-header">
        <div class="scriptos-config-title">
          <h2>${o.name||t.filename}</h2>
          <span class="scriptos-config-version">
            ${c}
          </span>
        </div>
        <p class="scriptos-config-description">${o.description||"No description"}</p>
        ${o.author?html`
          <div class="scriptos-config-meta">
            <span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              ${o.author}
            </span>
            ${o.www?html`
              <a href="${o.www}" target="_blank" rel="noopener">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
                Website
              </a>
            `:""}
          </div>
        `:""}
      </div>
      
      <div class="scriptos-config-form">
        ${s?html`
          <h3>Configuration</h3>
          ${mi(i,e,n)}
        `:html`
          <div class="scriptos-config-no-args">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            <p>This ScriptO requires no configuration</p>
          </div>
        `}
      </div>
      
      <div class="scriptos-config-actions">
        <button 
          class="scriptos-btn scriptos-btn-secondary" 
          onclick=${()=>n("scriptos-back")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          Back
        </button>
        <button 
          class="scriptos-btn scriptos-btn-primary" 
          onclick=${()=>n("scriptos-execute")}>
          Generate Code
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="5 12 5 5 12 5"/>
            <polyline points="19 12 19 19 12 19"/>
            <line x1="5" y1="5" x2="19" y2="19"/>
          </svg>
        </button>
      </div>
    </div>
  `}function mi(e,n,t){const o=Object.keys(e);return html`
    <div class="scriptos-config-fields">
      ${o.map(i=>{const s=e[i],c=s.label||i;s.type;const r=s.optional||!1;return html`
          <div class="scriptos-config-field">
            <label for="arg-${i}">
              ${c}
              ${r?html`<span class="scriptos-field-optional">(optional)</span>`:""}
            </label>
            ${vi(i,s,n,t)}
          </div>
        `})}
    </div>
  `}function vi(e,n,t,o){const i=n.type,s=t.scriptOsArgs[e],c=n.value!==void 0?n.value:null;switch(i){case"str":return html`
        <input 
          type="text" 
          id="arg-${e}"
          class="scriptos-input"
          value="${s!==void 0?s:c||""}"
          oninput=${d=>o("scriptos-update-arg",{argId:e,value:d.target.value})}
          placeholder="Enter text..."
        />
      `;case"int":return html`
        <input 
          type="number" 
          id="arg-${e}"
          class="scriptos-input"
          step="1"
          value="${s!==void 0?s:c||0}"
          oninput=${d=>o("scriptos-update-arg",{argId:e,value:parseInt(d.target.value)||0})}
          placeholder="Enter integer..."
        />
      `;case"float":return html`
        <input 
          type="number" 
          id="arg-${e}"
          class="scriptos-input"
          step="0.1"
          value="${s!==void 0?s:c||0}"
          oninput=${d=>o("scriptos-update-arg",{argId:e,value:parseFloat(d.target.value)||0})}
          placeholder="Enter number..."
        />
      `;case"bool":return html`
        <label class="scriptos-checkbox">
          <input 
            type="checkbox" 
            id="arg-${e}"
            checked=${s!==void 0?s:c||!1}
            onchange=${d=>o("scriptos-update-arg",{argId:e,value:d.target.checked})}
          />
          <span class="scriptos-checkbox-label">Enabled</span>
        </label>
      `;case"list":const r=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,21,26,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48];return html`
        <select 
          id="arg-${e}"
          class="scriptos-select"
          onchange=${d=>o("scriptos-update-arg",{argId:e,value:d.target.value==="none"?null:parseInt(d.target.value)})}>
          ${n.optional?html`<option value="none">No pin</option>`:""}
          ${r.map(d=>html`
            <option 
              value="${d}" 
              selected=${s==d||s===void 0&&c==d}>
              GPIO ${d}
            </option>
          `)}
        </select>
      `;case"dict":const a=n.items||{},l=Object.keys(a);return html`
        <select 
          id="arg-${e}"
          class="scriptos-select"
          onchange=${d=>o("scriptos-update-arg",{argId:e,value:d.target.value})}>
          ${l.map(d=>html`
            <option 
              value="${d}" 
              selected=${s===d||s===void 0&&c===d}>
              ${a[d]}
            </option>
          `)}
        </select>
      `;default:return html`
        <input 
          type="text" 
          id="arg-${e}"
          class="scriptos-input"
          value="${s!==void 0?s:c||""}"
          oninput=${d=>o("scriptos-update-arg",{argId:e,value:d.target.value})}
          placeholder="Enter value..."
        />
      `}}function yi(e,n){if(!e.scriptOsUiModal||!e.scriptOsUiModal.isOpen)return html`<div></div>`;const{url:t,title:o}=e.scriptOsUiModal;return html`
    <div 
      class="scriptos-ui-modal-overlay" 
      onclick=${i=>{i.target.classList.contains("scriptos-ui-modal-overlay")&&n("close-scriptos-ui-modal")}}>
      <div class="scriptos-ui-modal-container">
        <div class="scriptos-ui-modal-header">
          <h2 class="scriptos-ui-modal-title">${o||"ScriptO UI"}</h2>
          <button 
            class="scriptos-ui-modal-close" 
            onclick=${()=>n("close-scriptos-ui-modal")}
            title="Close (Esc)">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        
        <div class="scriptos-ui-modal-content">
          ${e.scriptOsUiModal.isLoading?html`
            <div class="scriptos-ui-modal-loading">
              <div class="scriptos-ui-modal-spinner"></div>
              <p>Loading UI from device...</p>
            </div>
          `:""}
          
          <iframe
            src="${t}"
            class="scriptos-ui-modal-iframe"
            style="${e.scriptOsUiModal.isLoading?"display: none;":""}"
            sandbox="allow-scripts allow-same-origin allow-forms"
            onload=${()=>{e.scriptOsUiModal&&e.scriptOsUiModal.isLoading&&(e.scriptOsUiModal.loadTimeout&&(clearTimeout(e.scriptOsUiModal.loadTimeout),e.scriptOsUiModal.loadTimeout=null),e.scriptOsUiModal.isLoading=!1,e.scriptOsUiModal.error=null,n("render"))}}
            onerror=${i=>{console.error("[ScriptO UI] Failed to load iframe:",i),e.scriptOsUiModal&&(e.scriptOsUiModal.loadTimeout&&(clearTimeout(e.scriptOsUiModal.loadTimeout),e.scriptOsUiModal.loadTimeout=null),e.scriptOsUiModal.isLoading=!1,e.scriptOsUiModal.error="Failed to load UI from device. Check the browser console for details.",n("render"))}}
          ></iframe>
          
          ${e.scriptOsUiModal.error?html`
            <div class="scriptos-ui-modal-error">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p>${e.scriptOsUiModal.error}</p>
              <button 
                class="scriptos-ui-modal-retry"
                onclick=${()=>{e.scriptOsUiModal.error=null,e.scriptOsUiModal.isLoading=!0,n("render")}}>
                Retry
              </button>
            </div>
          `:""}
        </div>
        
        <div class="scriptos-ui-modal-footer">
          <div class="scriptos-ui-modal-url">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
            ${t}
          </div>
        </div>
      </div>
    </div>
  `}function wi(e,n){return!e.isExtensionsModalOpen&&!e.installingDependencies&&!e.dependencyPrompt?html`<div></div>`:e.dependencyPrompt?bi(e,n):e.installingDependencies?Ci(e):html`
    <div class="scriptos-modal-overlay" onclick=${t=>{t.target.classList.contains("scriptos-modal-overlay")&&n("close-extensions-modal")}}>
      <div class="scriptos-modal">
        <button 
          class="scriptos-modal-close" 
          onclick=${()=>n("close-extensions-modal")}
          title="Close">
          ×
        </button>
        ${e.isLoadingExtensions?html`
          <div class="scriptos-loading">
            <div class="scriptos-loading-spinner"></div>
            <p>Loading extensions registry...</p>
          </div>
        `:xi(e,n)}
      </div>
    </div>
  `}function bi(e,n){const{extensionId:t,extensionName:o,dependencies:i}=e.dependencyPrompt,s=i?.mipPackage||"";return html`
    <div class="scriptos-modal-overlay" onclick=${c=>{c.target.classList.contains("scriptos-modal-overlay")&&n("close-dependency-prompt")}}>
      <div class="scriptos-modal" style="max-width: 500px;">
        <div class="scriptos-library">
          <div class="scriptos-header">
            <h2>Install Dependencies?</h2>
            <p class="scriptos-subtitle">${o} requires Python libraries</p>
          </div>
          
          <div style="padding: 20px;">
            <p style="color: var(--text-primary); margin-bottom: 16px;">
              This extension requires Python libraries to be installed on your device.
            </p>
            <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 6px; padding: 12px; margin-bottom: 20px;">
              <div style="font-family: 'Menlo', 'Monaco', monospace; color: var(--scheme-primary); font-size: 13px; word-break: break-all;">
                ${s}
              </div>
            </div>
            <p style="color: var(--text-secondary); font-size: 13px; margin-bottom: 20px;">
              Make sure your device is connected before installing.
            </p>
            <div style="display: flex; gap: 12px; justify-content: flex-end;">
              <button 
                class="scriptos-uninstall-btn"
                onclick=${()=>n("close-dependency-prompt")}
                style="padding: 10px 20px;">
                Skip
              </button>
              <button 
                class="scriptos-update-btn"
                onclick=${()=>n("upload-extension-dependencies",t)}
                style="padding: 10px 20px;">
                Install
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `}function Ci(e,n){const{extensionName:t,mipPackage:o}=e.installingDependencies;return html`
    <div class="scriptos-modal-overlay">
      <div class="scriptos-modal" style="max-width: 500px;">
        <div class="scriptos-library">
          <div class="scriptos-header">
            <h2>Installing Dependencies</h2>
            <p class="scriptos-subtitle">Installing Python libraries for ${t}...</p>
          </div>
          
          <div style="padding: 40px 20px; text-align: center;">
            <div class="scriptos-loading-spinner" style="margin: 0 auto 20px;"></div>
            <div style="font-family: 'Menlo', 'Monaco', monospace; color: var(--scheme-primary); font-size: 14px; margin-bottom: 12px;">
              ${o}
            </div>
            <p style="color: var(--text-secondary);">
              This may take a few moments. Please wait...
            </p>
          </div>
        </div>
      </div>
    </div>
  `}function xi(e,n){const t=e.availableExtensions||[],o=e.installedExtensions||[],i=new Set(o.map(r=>r.id)),s=t.filter(r=>!i.has(r.id)),c=(r,a)=>{for(let l=0;l<3;l++){const d=r[l]||0,p=a[l]||0;if(d>p)return!0;if(d<p)return!1}return!1};return t.length===0?html`
      <div class="scriptos-library">
        <div class="scriptos-header-sticky">
           <div class="scriptos-header">
            <h2>Extensions</h2>
            <p class="scriptos-subtitle">System extensions registry</p>
          </div>
        </div>
        <div class="scriptos-content">
          <div class="scriptos-empty">
            <h3>No Extensions Available</h3>
            <p>No extensions found in the registry</p>
          </div>
        </div>
      </div>
    `:html`
    <div class="scriptos-library">
      <div class="scriptos-header-sticky">
        <div class="scriptos-header">
          <h2>Extensions</h2>
          <p class="scriptos-subtitle">
            ${o.length} installed, ${s.length} available
          </p>
        </div>
      </div>
      
      <div class="scriptos-content">
        ${o.length>0?html`
          <div class="scriptos-section" style="margin-bottom: 32px">
            <h3 style="margin: 0 0 16px 0; font-size: 16px; color: var(--text-primary);">Installed</h3>
            
            <div class="scriptos-grid">
              ${o.map(r=>{const a=t.find(d=>d.id===r.id),l=a&&c(a.version,r.version);return html`
                  <div class="scriptos-card installed ${l?"has-update":""}">
                    ${l?html`
                      <div class="scriptos-update-badge">Update available</div>
                    `:""}
                    
                    <div class="scriptos-card-header">
                      <div class="scriptos-card-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          ${$n(r.icon)}
                        </svg>
                      </div>
                      <h3>${r.name}</h3>
                      <span class="scriptos-card-version">
                        v${r.version.join(".")}
                        ${l?html`<span class="scriptos-version-arrow">→ v${a.version.join(".")}</span>`:""}
                      </span>
                    </div>

                    <p class="scriptos-card-description">${r.description}</p>
                    
                    <div class="scriptos-card-actions" style="margin-top: auto; padding-top: 12px; border-top: 1px solid var(--border-color); display: flex; gap: 8px;">
                      ${l?html`
                        <button 
                          class="scriptos-update-btn"
                          onclick=${d=>{d.stopPropagation(),n("update-extension",{extension:r,newVersion:a})}}
                          title="Update to v${a.version.join(".")}">
                          Update
                        </button>
                      `:""}
                      <button 
                        class="scriptos-uninstall-btn"
                        onclick=${d=>{d.stopPropagation(),n("uninstall-extension",r.id)}}
                        title="Uninstall ${r.name}">
                        Uninstall
                      </button>
                    </div>
                    
                    <div class="scriptos-card-footer" style="border: none; padding-top: 8px;">
                       <span class="scriptos-card-author">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                        ${r.author}
                      </span>
                    </div>
                  </div>
                `})}
            </div>
          </div>
        `:""}
        
        ${s.length>0?html`
          <div class="scriptos-section">
            <h3 style="margin: 0 0 16px 0; font-size: 16px; color: var(--text-primary);">Available for Install</h3>
            
            <div class="scriptos-grid">
              ${s.map(r=>html`
                <div class="scriptos-card" onclick=${()=>n("install-extension",r)}>
                  <div class="scriptos-card-header">
                    <div class="scriptos-card-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        ${$n(r.icon)}
                      </svg>
                    </div>
                    <h3>${r.name}</h3>
                    <span class="scriptos-card-version">v${r.version.join(".")}</span>
                  </div>
                  
                  <p class="scriptos-card-description">${r.description}</p>
                  
                  <div class="scriptos-card-badge" style="margin-top: auto;">
                    <span class="scriptos-badge-install">Click to Install</span>
                  </div>

                   <div class="scriptos-card-footer">
                       <span class="scriptos-card-author">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                        ${r.author}
                      </span>
                    </div>
                </div>
              `)}
            </div>
          </div>
        `:""}
      </div>
    </div>
  `}function $n(e){const n={sliders:html`
      <line x1="4" y1="21" x2="4" y2="14"/>
      <line x1="4" y1="10" x2="4" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="12"/>
      <line x1="12" y1="8" x2="12" y2="3"/>
      <line x1="20" y1="21" x2="20" y2="16"/>
      <line x1="20" y1="12" x2="20" y2="3"/>
      <line x1="1" y1="14" x2="7" y2="14"/>
      <line x1="9" y1="8" x2="15" y2="8"/>
      <line x1="17" y1="16" x2="23" y2="16"/>
    `,activity:html`
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    `,radio:html`
      <circle cx="12" cy="12" r="2"/>
      <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/>
    `,"trending-up":html`
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>
    `,cpu:html`
      <rect x="4" y="4" width="16" height="16" rx="2" ry="2"/>
      <rect x="9" y="9" width="6" height="6"/>
      <line x1="9" y1="1" x2="9" y2="4"/>
      <line x1="15" y1="1" x2="15" y2="4"/>
      <line x1="9" y1="20" x2="9" y2="23"/>
      <line x1="15" y1="20" x2="15" y2="23"/>
      <line x1="20" y1="9" x2="23" y2="9"/>
      <line x1="20" y1="14" x2="23" y2="14"/>
      <line x1="1" y1="9" x2="4" y2="9"/>
      <line x1="1" y1="14" x2="4" y2="14"/>
    `};return n[e]||n.cpu}function Si(e,n){const t=e.isResetDialogOpen?"open":"closed";function o(r){r.target.id==="dialog-reset"&&n("close-reset-dialog")}function i(){n("trigger-reset",0)}async function s(){confirm(`HARD RESET WARNING:

This is equivalent to pressing the physical reset button.
The connection will be lost immediately.

Are you sure you want to proceed?`)&&n("trigger-reset",1)}e.isResetDialogOpen&&window.addEventListener("keydown",function r(a){a.key==="Escape"&&(n("close-reset-dialog"),window.removeEventListener("keydown",r))},{once:!0});const c=html`
  <div id="dialog-reset" class="dialog ${t}" tabindex="-1" onclick=${o}>
    <div class="dialog-content webrepl-dialog" style="max-width: 450px;">
      <div class="dialog-header">
        <div class="dialog-icon" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
          </svg>
        </div>
        <div class="dialog-title">Reset Device</div>
        <div class="dialog-subtitle">Choose how you want to reset the device</div>
      </div>
      
      <div class="dialog-body">
        <div style="display: flex; flex-direction: column; gap: 16px;">
          
          <div class="reset-option" style="padding: 16px; background: var(--bg-secondary); border-radius: 8px; border: 1px solid var(--border-color); cursor: pointer;" onclick=${i}>
             <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                <div style="font-weight: 600; color: var(--text-primary);">Soft Reset</div>
                <div style="font-size: 11px; background: var(--scheme-primary); color: white; padding: 2px 6px; border-radius: 4px;">RECOMMENDED</div>
             </div>
             <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.4;">
               Restarts the MicroPython interpreter (VM). Global variables are cleared, but the WebREPL connection remains active.
             </div>
          </div>

          <div class="reset-option" style="padding: 16px; background: var(--bg-secondary); border-radius: 8px; border: 1px solid var(--border-color); cursor: pointer;" onclick=${s}>
             <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                <div style="font-weight: 600; color: #ef4444;">Hard Reset</div>
                <div style="font-size: 11px; background: #ef4444; color: white; padding: 2px 6px; border-radius: 4px;">DISCONNECTS</div>
             </div>
             <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.4;">
               Equivalent to pressing the physical reset button. The device will reboot and the connection will be lost.
             </div>
          </div>

        </div>
        
        <div class="dialog-footer" style="justify-content: center; margin-top: 24px;">
           <button class="scriptos-btn scriptos-btn-secondary" style="min-width: 100px;" onclick=${()=>n("close-reset-dialog")}>
             Cancel
           </button>
        </div>
      </div>
    </div>
  </div>
  `;if(e.isResetDialogOpen)return c}function Ei(e,n){if(!e.debugger||!e.debugger.configOpen)return html``;const t=e.openFiles.filter(c=>c.fileName&&c.fileName.endsWith(".py")),i=(e.debugger.watchExpressions[""]||[]).join(`
`),s=e.debugger.active;return html`
    <div class="debug-sidebar">
      <div class="debug-sidebar-header">
        <h2>${s?"Debug Session":"Setup Debugger"}</h2>
        <button class="close-btn" onclick=${()=>{n(s?"debugger:stop":"debugger:close-config")}}>×</button>
      </div>

      <div class="debug-sidebar-body">
        ${t.length===0?html`
          <div class="empty-state">
            <p>No Python files open. Please open a .py file to debug.</p>
          </div>
        `:html`
          <section class="debug-section">
            <h3>Watch Expressions</h3>
            <p class="help-text">Expressions to evaluate on each step</p>
            <textarea 
              class="debug-textarea"
              placeholder="e.g., x * 2"
              rows="6"
              oninput=${c=>n("debugger:set-watches",c.target.value)}
            >${i}</textarea>
          </section>

          ${s?html`
            <section class="debug-section">
              <h3>Live Variables</h3>
              <div class="debug-variables">
                ${Object.entries(e.debugger.variables||{}).map(([c,r])=>html`
                  <div class="debug-var">
                    <span class="var-name">${c}:</span>
                    <span class="var-value">${r}</span>
                  </div>
                `)}
                ${Object.entries(e.debugger.locals||{}).map(([c,r])=>html`
                  <div class="debug-var">
                    <span class="var-name">${c}:</span>
                    <span class="var-value">${r}</span>
                  </div>
                `)}
                ${Object.keys(e.debugger.variables||{}).length===0&&Object.keys(e.debugger.locals||{}).length===0?html`
                  <p class="empty-hint">No variables captured.</p>
                `:""}
              </div>
            </section>
          `:html`
            <section class="debug-section">
              <h3>Target File</h3>
              <p class="file-path">${e.openFiles.find(c=>c.id===e.editingFile)?.fileName||"No file selected"}</p>
              
              <div class="debug-actions">
                <button 
                  class="debug-btn-primary" 
                  onclick=${()=>n("debugger:start")}
                  disabled=${t.length===0}
                >
                  Start Debugging
                </button>
              </div>
            </section>
          `}
        `}
      </div>
    </div>

    <style>
      .debug-sidebar {
        position: fixed;
        top: 100px; /* Below navigation bar */
        right: 0;
        bottom: 40px; /* Above status bar */
        width: 320px;
        z-index: 900;
        background: var(--bg-primary);
        border-left: 1px solid var(--border-color);
        display: flex;
        flex-direction: column;
        box-shadow: -2px 0 10px rgba(0,0,0,0.1);
      }

      .debug-sidebar-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        background: var(--bg-secondary);
        border-bottom: 1px solid var(--border-color);
      }

      .debug-sidebar-header h2 {
        margin: 0;
        font-size: 14px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.8px;
        color: var(--text-primary);
      }

      .close-btn {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: var(--text-secondary);
        line-height: 1;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .close-btn:hover {
        color: var(--text-primary);
      }

      .debug-sidebar-body {
        padding: 20px;
        flex: 1;
        overflow-y: auto;
      }

      .debug-section {
        margin-bottom: 24px;
      }

      .debug-section h3 {
        margin: 0 0 8px 0;
        font-size: 12px;
        font-weight: 600;
        color: var(--text-primary);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .help-text {
        margin: 0 0 10px 0;
        font-size: 11px;
        color: var(--text-secondary);
      }

      .debug-textarea {
        width: 100%;
        padding: 10px;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        font-family: 'CodeFont', monospace;
        font-size: 12px;
        background: var(--bg-tertiary);
        color: var(--text-primary);
        resize: vertical;
        box-sizing: border-box;
      }

      .file-path {
        font-family: monospace;
        font-size: 11px;
        background: var(--bg-secondary);
        padding: 8px;
        border-radius: 4px;
        color: var(--text-secondary);
        word-break: break-all;
      }

      .debug-variables {
        background: var(--bg-tertiary);
        border-radius: 4px;
        padding: 8px;
        border: 1px solid var(--border-color);
        max-height: 400px;
        overflow-y: auto;
      }

      .debug-var {
        display: flex;
        justify-content: space-between;
        padding: 6px 0;
        font-family: monospace;
        font-size: 11px;
        border-bottom: 1px solid rgba(0,0,0,0.05);
      }

      .debug-var:last-child {
        border-bottom: none;
      }

      .var-name {
        color: var(--scheme-primary);
        font-weight: 600;
      }

      .var-value {
        color: var(--text-secondary);
        word-break: break-all;
        text-align: right;
        padding-left: 10px;
      }

      .empty-hint {
        font-style: italic;
        color: var(--text-secondary);
        font-size: 11px;
        margin: 0;
      }

      .debug-actions {
        margin-top: 16px;
      }

      .debug-btn-primary {
        width: 100%;
        padding: 10px;
        background: var(--scheme-primary);
        color: white;
        border: none;
        border-radius: 4px;
        font-weight: 600;
        font-size: 13px;
        cursor: pointer;
        transition: opacity 0.2s;
      }

      .debug-btn-primary:hover:not(:disabled) {
        opacity: 0.9;
      }

      .debug-btn-primary:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .empty-state {
        text-align: center;
        padding: 40px 10px;
        color: var(--text-secondary);
        font-size: 12px;
      }
    </style>
  `}function $i(e,n){if(!e.debugger||!e.debugger.breakpointModalOpen)return html`<div></div>`;const{file:t,line:o}=e.debugger.editingBreakpoint,i=e.debugger.breakpoints[t][o]||{condition:"",hitCount:"",enabled:!0},s=()=>{n("debugger:save-breakpoint",{file:t,line:o,config:i})},c=()=>{n("debugger:delete-breakpoint",{file:t,line:o})},r=()=>{n("debugger:close-breakpoint-modal")};return html`
    <div class="scriptos-modal-overlay" onclick=${a=>{a.target.classList.contains("scriptos-modal-overlay")&&r()}}>
      <div class="scriptos-modal breakpoint-modal">
        <div class="breakpoint-modal-header">
          <div class="breakpoint-modal-title">
            <span onclick=${r} style="cursor: pointer; font-size: 20px; line-height: 1;">×</span>
            <span>Breakpoint</span>
          </div>
          <div class="switch-container">
            <label class="switch">
              <input type="checkbox" checked=${i.enabled} onchange=${a=>{i.enabled=a.target.checked,n("render")}}>
              <span class="slider"></span>
            </label>
            <span style="font-size: 13px; color: var(--text-primary);">
              ${i.enabled?"Enabled":"Disabled"}
            </span>
            <button class="btn-delete" onclick=${c} title="Delete Breakpoint">
              ${w.renderIcon("trash",{size:20})}
            </button>
          </div>
        </div>

        <div class="breakpoint-modal-file">
          ${t} (${o})
        </div>

        <div class="breakpoint-field">
          <div class="breakpoint-field-icon" title="Condition">?</div>
          <input 
            type="text" 
            class="breakpoint-input" 
            placeholder="CONDITION EXPRESSION e.g. x == 0"
            value=${i.condition}
            oninput=${a=>{i.condition=a.target.value}}
          >
        </div>

        <div class="breakpoint-field">
          <div class="breakpoint-field-icon" title="Hit Count">
            ${w.renderIcon("hash",{size:18})}
          </div>
          <input 
            type="text" 
            class="breakpoint-input" 
            placeholder="HIT COUNT e.g. <1 or <=2 or =3 or >4 or >=5 or %6"
            value=${i.hitCount}
            oninput=${a=>{i.hitCount=a.target.value}}
          >
        </div>

        <div class="breakpoint-actions">
          <button class="scriptos-btn scriptos-btn-secondary" onclick=${r}>Cancel</button>
          <button class="scriptos-btn scriptos-btn-primary" onclick=${s}>Save</button>
        </div>
      </div>
    </div>
  `}function ki(e,n,t){const o=e.activeExtension,i=e.activeExtensionPanel;if(!o||!i)return t`
      <div class="system-panel">
        <div class="panel-message">
          <p>No extension panel selected</p>
        </div>
      </div>
    `;if(!e.loadedExtensions[o])return t`
      <div class="system-panel">
        <div class="panel-message">
          <p>Loading extension...</p>
        </div>
      </div>
    `;const s=e.loadedExtensions[o];if(!s.instance){console.log("[ExtensionContainer] No instance found, creating new one...");try{if(s.data.styles&&!s.stylesInjected){const f=`extension-styles-${o}`;let g=document.getElementById(f);g||(g=document.createElement("style"),g.id=f,g.textContent=s.data.styles,document.head.appendChild(g),console.log("[ExtensionContainer] Injected styles for extension:",o)),s.stylesInjected=!0}const a=s.data.content,d=new Function("DeviceAPI","html","emit","state",`
        ${a}
        
        // Find the extension class (assumes it's defined in the code)
        // Get the class name from the code (supports both App and Extension suffix for backward compatibility)
        const classMatch = ${JSON.stringify(a)}.match(/class\\s+(\\w+(?:App|Extension))\\s*{/);
        if (!classMatch) {
          throw new Error('No extension class found in code (expected class ending in App or Extension)');
        }
        const className = classMatch[1];
        
        // Return the class
        return eval(className);
      `)(dn,t,n,e),p=new dn(B),u=new d(p,n,e,t);e.loadedExtensions[o].instance=u}catch(a){return console.error("[ExtensionContainer] Failed to instantiate extension:",a),t`
        <div class="system-panel">
          <div class="panel-message error">
            <p>Failed to load extension: ${a.message}</p>
          </div>
        </div>
      `}}const c=s.instance,r=`render${i.charAt(0).toUpperCase()+i.slice(1)}`;if(typeof c[r]!="function")return t`
      <div class="system-panel">
        <div class="panel-message error">
          <p>Extension panel not found: ${i}</p>
          <p>Looking for method: ${r}</p>
        </div>
      </div>
    `;try{return c[r]()}catch(a){return console.error("[ExtensionContainer] Render error:",a),t`
      <div class="system-panel">
        <div class="panel-message error">
          <p>Extension render error: ${a.message}</p>
        </div>
      </div>
    `}}function _i(e,n){return e.aiAgent.isOpen?html`
    <div class="agent-sidebar">
      <!-- Header -->
      <div class="agent-sidebar-header">
        <div class="agent-sidebar-title">
          <svg width="20" height="20" viewBox="0 0 50 50" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.2px">
            <rect x="8" y="13" width="35" height="32" rx="3.5" ry="3.5"/>
            <line x1="25" y1="6" x2="25" y2="13"/>
            <circle cx="25" cy="4" r="2.5"/>
            <circle cx="16" cy="25" r="3.5"/>
            <circle cx="34" cy="25" r="3.5"/>
            <line x1="15" y1="36" x2="35" y2="36"/>
            <line x1="17" y1="40" x2="33" y2="40"/>
            <line x1="8" y1="25" x2="4" y2="25"/>
            <line x1="43" y1="25" x2="46" y2="25"/>
          </svg>
          <h3>AI Agent</h3>
        </div>
        <div class="agent-sidebar-actions">
          ${e.aiAgent.messages.length>0?html`
            <button 
              class="agent-sidebar-clear"
              onclick=${()=>n("ai-clear-chat")}
              title="Clear chat">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          `:""}
          <button 
            class="agent-sidebar-close"
            onclick=${()=>n("toggle-agent-sidebar")}
            title="Close sidebar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Messages -->
      <div class="agent-sidebar-messages" id="agent-messages">
        ${e.aiAgent.messages.length===0?html`
          <div class="agent-welcome">
            <svg width="64" height="64" viewBox="0 0 50 50" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.2px">
              <rect x="8" y="13" width="35" height="32" rx="3.5" ry="3.5"/>
              <line x1="25" y1="6" x2="25" y2="13"/>
              <circle cx="25" cy="4" r="2.5"/>
              <circle cx="16" cy="25" r="3.5"/>
              <circle cx="34" cy="25" r="3.5"/>
              <line x1="15" y1="36" x2="35" y2="36"/>
              <line x1="17" y1="40" x2="33" y2="40"/>
              <line x1="8" y1="25" x2="4" y2="25"/>
              <line x1="43" y1="25" x2="46" y2="25"/>
            </svg>
            <h4>Welcome to AI Agent</h4>
            <p>Generate MicroPython code for your ESP32 using natural language.</p>
            <div class="agent-examples">
              <strong>Try asking:</strong>
              <ul>
                <li>"Flash a NeoPixel at 1Hz"</li>
                <li>"Read an analog sensor on GPIO 34"</li>
                <li>"Control a servo motor"</li>
                <li>"Set up I2C communication"</li>
              </ul>
            </div>
            ${e.aiAgent.settings.apiKey?"":html`
              <div class="agent-setup-warning">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                <p>Please configure your API key in <strong>System > AI Agent</strong> to get started.</p>
              </div>
            `}
          </div>
        `:e.aiAgent.messages.map(t=>Ti(t,n))}
        
        ${e.aiAgent.isGenerating?html`
          <div class="agent-message agent-message-assistant">
            <div class="agent-message-avatar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="4" y="4" width="16" height="16" rx="2" ry="2"/>
                <rect x="9" y="9" width="6" height="6"/>
              </svg>
            </div>
            <div class="agent-message-content">
              <div class="agent-typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        `:""}
      </div>

      <!-- Input -->
      <div class="agent-sidebar-input">
        <textarea
          id="agent-input"
          class="agent-input-field"
          placeholder="Describe what you want to build..."
          rows="3"
          data-preserve-value="true"
          oninput=${t=>{e.aiAgent.inputValue=t.target.value,n("ai-update-input",t.target.value)}}
          onkeydown=${t=>Ni(t,e,n)}
          disabled=${e.aiAgent.isGenerating}
        >${e.aiAgent.inputValue||""}</textarea>
        <button 
          class="agent-send-btn"
          onclick=${()=>pt(e,n)}
          disabled=${e.aiAgent.isGenerating}
          title="Send message (Ctrl+Enter)">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </div>
  `:html`<div></div>`}function Ti(e,n){const t=new Date(e.timestamp).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});return e.role==="user"?html`
      <div class="agent-message agent-message-user">
        <div class="agent-message-content">
          <div class="agent-message-text">${e.content}</div>
          <div class="agent-message-time">${t}</div>
        </div>
        <div class="agent-message-avatar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
      </div>
    `:e.role==="assistant"?html`
      <div class="agent-message agent-message-assistant">
        <div class="agent-message-avatar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="4" y="4" width="16" height="16" rx="2" ry="2"/>
            <rect x="9" y="9" width="6" height="6"/>
          </svg>
        </div>
        <div class="agent-message-content">
          <div class="agent-message-text">${Pi(e.content)}</div>
          ${e.code?html`
            <div class="agent-code-actions">
              <button 
                class="agent-code-btn"
                onclick=${()=>n("ai-code-generated",e.code)}
                title="Configure">
                Configure
              </button>
              <button 
                class="agent-copy-btn"
                onclick=${()=>n("ai-open-in-new-tab",e.code)}
                title="Open in new tab">
                Open in new tab
              </button>
            </div>
          `:""}
          <div class="agent-message-time">${t}</div>
        </div>
      </div>
    `:e.role==="error"?html`
      <div class="agent-message agent-message-error">
        <div class="agent-message-avatar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        </div>
        <div class="agent-message-content">
          <div class="agent-message-text">${e.content}</div>
          <div class="agent-message-time">${t}</div>
        </div>
      </div>
    `:html`<div></div>`}function Pi(e){let n=e;n=n.replace(/```python\n[\s\S]*?```/g,'[Code generated - click "Configure" below]'),n=n.replace(/```\n[\s\S]*?```/g,'[Code generated - click "Configure" below]');const t=n.split(`
`);if(t.length===0)return"";if(t.length===1)return t[0]||"";const o=[];for(let i=0;i<t.length;i++)o.push(t[i]),i<t.length-1&&o.push(html`<br>`);return html`${o}`}function Ni(e,n,t){(e.ctrlKey||e.metaKey)&&e.key==="Enter"&&(e.preventDefault(),pt(n,t))}function pt(e,n){const t=(e.aiAgent.inputValue||"").trim();!t||e.aiAgent.isGenerating||(n("ai-send-message",t),setTimeout(()=>{const o=document.getElementById("agent-messages");o&&(o.scrollTop=o.scrollHeight)},100))}class Ii extends Component{constructor(n,t,o){super(n),this.state=t,this.emit=o,this.term=null,this.fitAddon=null,this.resizeObserver=null,this.writeHandler=null,this.clearHandler=null}createElement(n){return html`<div class="log-sidebar-terminal"></div>`}update(n){return this.state=n,!1}load(n){console.debug("[LogTerminal] Component loaded, initializing terminal"),this.initTerminal(n),this.attachEventListeners()}unload(){console.debug("[LogTerminal] Component unloading, cleaning up"),this.cleanup()}async initTerminal(n){const o=document.documentElement.getAttribute("data-theme")==="dark";let i,s,c,r;o?(i="#2c3e50",s="#e8eaed",c="#008184",r="#34495e"):(i="#ffffff",s="#1f1f1f",c="#008184",r="#e8e8e8"),await this.ensureFontsLoaded();const[a,l]=await Promise.all([R(()=>import("./xterm-CASmyfyk.js"),[]),R(()=>import("./addon-fit-DOCEibfw.js"),[]),R(()=>Promise.resolve({}),__vite__mapDeps([10]))]),d=a.Terminal,p=l.FitAddon;this.term=new d({cursorBlink:!1,cursorStyle:"bar",fontSize:12,fontFamily:"CodeFont, monospace",letterSpacing:0,theme:{background:i,foreground:s,cursor:c,selection:r},disableStdin:!0,scrollback:this.state.logs?.maxMessages||1e3}),this.fitAddon=new p,this.term.loadAddon(this.fitAddon),console.debug("[LogTerminal] Opening terminal into container, dimensions:",n.getBoundingClientRect()),this.term.open(n),this.fitAfterOpen(n)}async ensureFontsLoaded(){if(document.fonts&&document.fonts.ready)try{return await document.fonts.ready,document.fonts.check&&await new Promise(n=>setTimeout(n,50)),Promise.resolve()}catch{return new Promise(t=>setTimeout(t,200))}else return new Promise(n=>setTimeout(n,200))}fitAfterOpen(n){setTimeout(()=>this.fitTerminal(),100),setTimeout(()=>this.fitTerminal(),300),setTimeout(()=>this.fitTerminal(),1e3),this.resizeObserver=new ResizeObserver(()=>{setTimeout(()=>this.fitTerminal(),50)}),this.resizeObserver.observe(n);const t=n.closest(".log-sidebar");t&&this.resizeObserver.observe(t),this.term.write(`\x1B[1;32m=== Log Terminal Initialized ===\x1B[0m\r
`),this.term.write(`\x1B[37mTerminal is ready to receive logs\x1B[0m\r
\r
`),this.state.logs?.messages?.length>0&&(console.debug("[LogTerminal] Writing",this.state.logs.messages.length,"buffered messages"),this.state.logs.messages.forEach(o=>{this.writeLogEntry(o)}))}fitTerminal(){if(!this.term||!this.fitAddon)return;const t=this.element?.closest(".log-sidebar")?.getBoundingClientRect(),o=this.element?.getBoundingClientRect();console.debug("[LogTerminal] Sidebar rect:",t,"Container rect:",o);try{this.fitAddon.fit(),this.term.refresh&&this.term.refresh(0,this.term.rows-1),console.debug("[LogTerminal] Fitted:",this.term.cols,"x",this.term.rows)}catch(i){console.warn("[LogTerminal] Fit failed:",i)}}attachEventListeners(){this.writeHandler=n=>{const t=n.detail;t&&this.term&&this.writeLogEntry(t)},this.clearHandler=()=>{this.term&&this.term.clear()},window.addEventListener("log-terminal-write",this.writeHandler),window.addEventListener("log-terminal-clear",this.clearHandler),console.debug("[LogTerminal] Event listeners attached")}writeLogEntry(n){if(!this.term)return;const{level:t,message:o,timestamp:i,source:s}=n,c=["\x1B[37m","\x1B[34m","\x1B[33m","\x1B[31m"],r=["DBG","INF","WRN","ERR"],a=c[t]||"",l=r[t]||"LOG",d="\x1B[0m";let p="";if(i){const h=i<9466848e5?i*1e3:i;p=`[${new Date(h).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"})}] `}const u=s?`[${s}] `:"",f=`${p}${a}[${l}]${d} ${u}${o}\r
`;this.term.write(f),this.state.logs?.autoScroll!==!1&&this.term.scrollToBottom()}cleanup(){this.writeHandler&&(window.removeEventListener("log-terminal-write",this.writeHandler),this.writeHandler=null),this.clearHandler&&(window.removeEventListener("log-terminal-clear",this.clearHandler),this.clearHandler=null),this.resizeObserver&&(this.resizeObserver.disconnect(),this.resizeObserver=null),this.term&&(this.term.dispose(),this.term=null),this.fitAddon=null}}let we=null;function Oi(e,n){if(!e.logs.isOpen)return we=null,null;we||(we=new Ii("log-terminal",e,n));const t=we.render(e),o=e.logSidebarWidth||350;return html`
    <div class="log-sidebar" style="width: ${o}px; flex: 0 0 ${o}px;">
      <div class="log-sidebar-resizer" 
           onmousedown=${()=>n("start-resizing-log-sidebar")}></div>
      <div class="log-sidebar-header">
        ${w.renderIcon("file-text",{className:"",size:16})}
        <span>Logs</span>
      </div>
      ${t}
    </div>
  `}function Fi(e,n){const{isConnected:t,selectedFiles:o}=e;return html`
  <div id="file-actions">
    ${F({icon:"edit",size:"small",disabled:!ui({selectedFiles:e.selectedFiles}),onClick:()=>n("open-selected-files")})}
    ${F({icon:"arrow-left",size:"small",background:"inverted",active:!0,disabled:!di({isConnected:t,selectedFiles:o}),onClick:()=>n("upload-files")})}
    ${F({icon:"arrow-right",size:"small",background:"inverted",active:!0,disabled:!ci({isConnected:t,selectedFiles:o}),onClick:()=>n("download-files")})}
    ${F({icon:"trash",size:"small",disabled:e.selectedFiles.length===0,onClick:()=>n("remove-files")})}
  </div>

  `}const Ai=ft("disk"),Di=ft("board");function ft(e){return function(t,o){function i(u){u.key.toLowerCase()==="enter"&&u.target.blur(),u.key.toLowerCase()==="escape"&&(u.target.value=null,u.target.blur())}const s=html`
      <div class="item">
        ${w.renderIcon("file",{className:"icon"})}
        <div class="text">
          <input type="text" onkeydown=${i} onblur=${u=>o("finish-creating-file",u.target.value)}/>
        </div>
      </div>
    `,c=html`
      <div class="item">
        ${w.renderIcon("folder",{className:"icon"})}
        <div class="text">
          <input type="text" onkeydown=${i} onblur=${u=>o("finish-creating-folder",u.target.value)}/>
        </div>
      </div>
    `;function r(u,f){const g=html`
        <input type="text"
          value=${u.fileName}
          onkeydown=${i}
          onblur=${_=>o("finish-renaming-file",_.target.value)}
          onclick=${_=>!1}
          ondblclick=${_=>!1}
          />
      `,h=t.selectedFiles.find(_=>_.fileName===u.fileName&&_.source===e);function v(_){return _.preventDefault(),o("rename-file",e,u),!1}function S(){t.renamingFile||o(`navigate-${e}-folder`,u.fileName)}function P(){t.renamingFile||o("open-file",e,u)}let k=u.fileName;const O=t.selectedFiles.find(_=>_.fileName===k);t.renamingFile==e&&O&&(k=g);function x(_){if(_==null)return"";if(_===0)return"0 B";const W=1024,z=["B","KB","MB","GB"],N=Math.floor(Math.log(_)/Math.log(W));return parseFloat((_/Math.pow(W,N)).toFixed(1))+" "+z[N]}const L=u.type==="file"?x(u.size):"";return u.type==="folder"?html`
          <div
            class="item ${h?"selected":""}"
            onclick=${_=>o("toggle-file-selection",u,e,_)}
            ondblclick=${S}
            >
            ${w.renderIcon("folder",{className:"icon"})}
            <div class="text">${k}</div>
            <div class="options" onclick=${v}>
              ${w.renderIcon("cursor-text",{className:""})}
            </div>
          </div>
        `:html`
          <div
            class="item ${h?"selected":""}"
            onclick=${_=>o("toggle-file-selection",u,e,_)}
            ondblclick=${P}
            >
            ${w.renderIcon("file",{className:"icon"})}
            <div class="text" style="display: flex; justify-content: space-between; padding-right: 10px;">
              <span>${k}</span>
              <span class="file-size">${L}</span>
            </div>
            <div class="options" onclick=${v}>
              ${w.renderIcon("cursor-text",{className:""})}
            </div>
          </div>
        `}const a=t[`${e}Files`].sort((u,f)=>{const g=u.fileName.toUpperCase(),h=f.fileName.toUpperCase();if(u.type==="folder"&&f.type==="file")return-1;if(u.type===f.type){if(g<h)return-1;if(g>h)return 1}return 0}),l=html`<div class="item"
  onclick=${()=>o(`navigate-${e}-parent`)}
  style="cursor: pointer"
  >
  ..
</div>`,d=html`
      <div class="file-list">
        <div class="list">
          ${e==="disk"&&t.diskNavigationPath!="/"?l:""}
          ${e==="board"&&t.boardNavigationPath!="/"?l:""}
          ${t.creatingFile==e?s:null}
          ${t.creatingFolder==e?c:null}
          ${a.map(r)}
        </div>
      </div>
    `;return new MutationObserver(u=>{const f=d.querySelector("input");f&&f.focus()}).observe(d,{childList:!0,subtree:!0}),d}}function Ri(e,n){const t=()=>{e.panelHeight>oe?n("close-panel"):n("open-panel")};e.isPanelOpen;const o=e.panelHeight>bt?"visible":"hidden";let i="terminal-enabled";return(!e.isConnected||e.isNewFileDialogOpen)&&(i="terminal-disabled"),C`
    <div id="panel" style="height: ${e.panelHeight}px">
      <div class="panel-bar">
        ${e.isConnected&&e.connectedPort?C`
          <div class="panel-connection-label" title=${`Connected to ${e.connectedPort}`}>
            Connected to ${e.connectedPort}
          </div>
        `:""}
        <div class="spacer"></div>
        <div id="drag-handle"
          onmousedown=${s=>n("start-resizing-panel",s)}
          ></div>
        <div class="term-operations ${o}">
          ${Li(e,n)}
        </div>
        ${F({icon:e.panelHeight>oe?"chevron-down":"chevron-up",size:"small",onClick:t})}
        
      </div>
      <div class="repl-panel-content">
        <div class="repl-panel-main ${i}">
          ${e.cache(H,"terminal").render()}
        </div>
        ${e.logs&&e.logs.isOpen?Oi(e,n):""}
      </div>
    </div>
  `}function Li(e,n){return[F({icon:"copy",size:"small",tooltip:"Copy",onClick:()=>document.execCommand("copy")}),F({icon:"clipboard",size:"small",tooltip:"Paste",onClick:()=>document.execCommand("paste")}),F({icon:"trash",size:"small",tooltip:`Clean (${e.platform==="darwin"?"Cmd":"Ctrl"}+L)`,onClick:()=>n("clear-terminal")}),F({icon:"file-text",size:"small",tooltip:"Toggle Logs",onClick:()=>n("toggle-log-sidebar")})]}function Mi(e,n){const t=html`
    <div id="tabs">
      ${e.openFiles.map(i=>Kt({text:i.fileName,icon:i.source==="board"?"cpu":"device-desktop",active:i.id===e.editingFile,renaming:i.id===e.renamingTab,hasChanges:i.hasChanges,onSelectTab:()=>n("select-tab",i.id),onCloseTab:()=>n("close-tab",i.id),onStartRenaming:()=>n("rename-tab",i.id),onFinishRenaming:s=>n("finish-renaming-tab",s)}))}
    </div>
  `;return new MutationObserver(i=>{const s=t.querySelector("input");s&&s.focus()}).observe(t,{childList:!0,subtree:!0}),t}function Bi(e,n){const t=ut({isConnected:e.isConnected,openFiles:e.openFiles,editingFile:e.editingFile}),o=Te({isConnected:e.isConnected}),i=e.platform==="darwin"?"Cmd":"Ctrl",s=e.debugger.active||e.debugger.configOpen;return html`
    <div id="navigation-bar">
      <div id="toolbar">
        ${F({icon:"file-plus",label:"New",tooltip:`New (${i}+N)`,disabled:e.systemSection!="editor"||s,onClick:()=>n("create-new-file"),first:!0})}

        ${F({icon:"device-floppy",label:"Save",tooltip:`Save (${i}+S)`,disabled:!t||s,onClick:()=>n("save")})}

        <div class="separator"></div>

        ${F({icon:"alert-triangle",label:"Reset",tooltip:"Reset Device",disabled:!e.isConnected,onClick:()=>n("open-reset-dialog")})}

        ${s?html`
          ${F({icon:"player-stop",label:"Stop",tooltip:"Stop Debug",onClick:()=>n("debugger:stop")})}

          ${F({icon:"player-play",label:e.debugger.active?"Continue":"Run",tooltip:e.debugger.active?"Continue (F5)":"Start Debugging (F5)",disabled:e.debugger.active&&!e.debugger.halted,onClick:()=>{e.debugger.active?n("debugger:continue",!0):n("debugger:start")}})}

          ${F({icon:"player-skip-forward",label:"Step",tooltip:"Step Over (F10)",disabled:!e.debugger.active||!e.debugger.halted,onClick:()=>n("debugger:step-over")})}
          ${F({icon:"step-into",label:"Step In",tooltip:"Step Into (F11)",disabled:!e.debugger.active||!e.debugger.halted,onClick:()=>n("debugger:step-into")})}
          ${F({icon:"step-out",label:"Step Out",tooltip:"Step Out (F12)",disabled:!e.debugger.active||!e.debugger.halted,onClick:()=>n("debugger:step-out")})}
        `:html`
          ${F({icon:"player-stop",label:"Stop",tooltip:`Stop (${i}+H)`,disabled:!o,onClick:()=>n("stop")})}

          ${F({icon:"player-play",label:"Run",tooltip:`Run (${i}+R)`,disabled:!o,onClick:c=>{c.altKey?n("run-from-button",!0):n("run-from-button")}})}

          <div class="separator"></div>

          ${e.systemSection==="editor"?F({icon:"bug",label:"Debug",tooltip:"Start Debugging",disabled:!o||!e.editingFile,onClick:()=>n("debugger:open-config")}):""}

          <div class="separator"></div>

          ${e.systemSection==="editor"?F({icon:"script",label:"ScriptO",tooltip:"Open ScriptO Library",onClick:()=>n("open-scriptos-modal")}):""}

          ${e.systemSection==="system"?F({icon:"apps",label:"Extensions",tooltip:"Manage Extensions",onClick:()=>n("open-extensions-modal")}):""}

          ${e.systemSection==="editor"?F({icon:"robot-face",label:"AI Agent",tooltip:"Open AI Code Assistant",active:e.aiAgent.isOpen,onClick:()=>n("toggle-agent-sidebar")}):""}
        `}
      </div>
    </div>
  `}function zi(e,n){let t=html`<div id="overlay" class="closed"></div>`;if(e.diskFiles==null&&(n("load-disk-files"),t=html`<div id="overlay" class="open"><p>Loading files...</p></div>`),e.isRemoving&&(t=html`<div id="overlay" class="open"><p>Removing...</p></div>`),e.isConnecting&&(t=html`<div id="overlay" class="open"><p>Connecting...</p></div>`),e.isLoadingFiles&&(t=html`<div id="overlay" class="open"><p>Loading files...</p></div>`),e.isSaving&&(t=html`<div id="overlay" class="open"><p>Saving file... ${e.savingProgress}</p></div>`),e.isTransferring){const o=String(e.transferringProgress||""),i=o.match(/(\d+)%?$/),s=i?parseInt(i[1]):0,c=o.match(/^(.+?):/),r=c?c[1]:"file";t=html`
      <div id="overlay" class="open">
        <div class="transfer-overlay-content">
          <div class="transfer-title">Transferring File</div>
          <div class="transfer-filename">${r}</div>
          <div class="transfer-progress-container">
            <div class="transfer-progress-bar">
              <div class="transfer-progress-fill" style="width: ${s}%"></div>
            </div>
            <div class="transfer-progress-text">${s}%</div>
          </div>
        </div>
      </div>
    `}return t}const ge="ScriptO Studio © JetPax 2026";function Ui(e){const n=(e||0)*60,t=Math.floor(n/86400),o=Math.floor(n%86400/3600),i=Math.floor(n%3600/60),s=Math.floor(n%60),c=[];return t>0&&c.push(`${t}d`),o>0&&c.push(`${o}h`),i>0&&c.push(`${i}m`),(s>0||c.length===0)&&c.push(`${s}s`),c.join(" ")}function Xe(e,n){if(!e)return{connected:!1,disconnectedText:ge,ram:null,temp:null,uptime:null,rssi:null};const t=e.mem||{},o=e.temp,i=e.uptime||0,s=e.wifi_rssi,c=t.alloc||0,r=t.free||0,a=c+r,l=(c/1024).toFixed(2),d=(a/(1024*1024)).toFixed(2);let p=null;o!=null&&((n||"degC")==="degF"?p=`${(o*9/5+32).toFixed(1)}°F`:p=`${o.toFixed(1)}°C`);const u=Ui(i);let f=null;return s!=null&&(f=`${s} dBm`),{connected:!0,disconnectedText:ge,ram:`${l} KB / ${d} MB`,temp:p,uptime:u,rssi:f}}function ji(e,n){const t=Xe(e.isConnected?e.statusInfo:null,e.temperatureUnit||"degC");if(!t||!t.connected){const o=t&&t.disconnectedText||ge;return html`
      <div id="status-bar" class="disconnected">
        <div class="status-bar-center">
          <a href="https://scriptostudio.com" target="_blank" rel="noopener noreferrer">${o}</a>
        </div>
      </div>
    `}return html`
    <div id="status-bar">
      <div class="status-bar-center">
        <div class="status-item ram">
          <span class="status-label">RAM</span>
          <span class="status-value">${t.ram}</span>
        </div>
        ${t.temp?html`
          <div class="status-item temp">
            <span class="status-label">TEMP</span>
            <span class="status-value">${t.temp}</span>
          </div>
        `:""}
        <div class="status-item uptime">
          <span class="status-label">UPTIME</span>
          <span class="status-value">${t.uptime}</span>
        </div>
        ${t.rssi?html`
          <div class="status-item wifi-rssi">
            <span class="status-label">RSSI</span>
            <span class="status-value">${t.rssi}</span>
          </div>
        `:""}
      </div>
    </div>
  `}function Wi(e,n){const t=window.html||(()=>{}),o=e.locale||"en",i=window.i18n?window.i18n.getAvailableLocales():["en","de","es","fr"],s={en:"English",de:"Deutsch",es:"Español",fr:"Français"},c=window.i18n?window.i18n.t("language"):"Language";return t`
    <div class="language-selector">
      <label class="language-selector-label" for="language-select">
        ${c}
      </label>
      <select
        id="language-select"
        class="language-select"
        onchange=${a=>{const l=a.target.value;n("change-locale",l)}}
      >
        ${i.map(a=>t`
          <option value=${a} selected=${a===o}>
            ${s[a]||a}
          </option>
        `)}
      </select>
    </div>
  `}typeof window<"u"&&(window.LanguageSelector=Wi);function kn(e,n){const t=window.i18n?window.i18n.t:o=>o;return html`
    <div class="panel-container">
      <div class="appearance-content">
        
        <!-- Theme Mode Section -->
        <div class="appearance-section">
          <h3>${t("appearance.theme")}</h3>
          <p class="appearance-hint">${t("appearance.themeHint")}</p>
          
          <div class="theme-mode-selector">
            ${ze("light",t("appearance.themeLight"),e,n)}
            ${ze("dark",t("appearance.themeDark"),e,n)}
            ${ze("device",t("appearance.themeDevice"),e,n)}
          </div>
          
          ${e.theme==="device"?html`
            <p class="appearance-hint">
              ${t("appearance.themeCurrentlyUsing")} <strong>${e.effectiveTheme==="dark"?t("appearance.themeDark"):t("appearance.themeLight")}</strong> 
              ${t("appearance.themeFromSystem")}
            </p>
          `:""}
        </div>
        
        <!-- Color Scheme Section -->
        <div class="appearance-section">
          <h3>${t("appearance.colorScheme")}</h3>
          <p class="appearance-hint">${t("appearance.colorSchemeHint")}</p>
          
          <div class="color-scheme-grid">
            ${Z("teal",t("appearance.colorTeal"),e,n)}
            ${Z("blue",t("appearance.colorBlue"),e,n)}
            ${Z("purple",t("appearance.colorPurple"),e,n)}
            ${Z("green",t("appearance.colorGreen"),e,n)}
            ${Z("red",t("appearance.colorRed"),e,n)}
            ${Z("orange",t("appearance.colorOrange"),e,n)}
          </div>
        </div>
        
        <!-- Editor Theme Section -->
        <div class="appearance-section">
          <h3>${t("appearance.editorTheme")}</h3>
          <p class="appearance-hint">${t("appearance.editorThemeHint")}</p>
          
          <div class="editor-theme-grid">
            ${be("auto",t("appearance.editorAuto"),t("appearance.editorAutoDesc"),e,n)}
            ${be("cobalt",t("appearance.editorCobalt"),t("appearance.editorCobaltDesc"),e,n)}
            ${be("paraiso",t("appearance.editorParaiso"),t("appearance.editorParaisoDesc"),e,n)}
            ${be("coolglow",t("appearance.editorCoolGlow"),t("appearance.editorCoolGlowDesc"),e,n)}
          </div>
        </div>
        
        <!-- Temperature Unit Section -->
        <div class="appearance-section">
          <h3>${t("appearance.temperatureUnit")}</h3>
          <p class="appearance-hint">${t("appearance.temperatureUnitHint")}</p>
          
          <div class="theme-mode-selector">
            ${_n("degC",t("appearance.temperatureCelsius"),e,n)}
            ${_n("degF",t("appearance.temperatureFahrenheit"),e,n)}
          </div>
        </div>
        
      </div>
    </div>
  `}function ze(e,n,t,o){const i=t.theme===e;return html`
    <button 
      class="theme-mode-option ${i?"selected":""}"
      onclick=${()=>o("set-theme",e)}
    >
      ${Hi(e)}
      <span>${n}</span>
    </button>
  `}function Hi(e){const n={light:html`
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="1" x2="12" y2="3"/>
        <line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/>
        <line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </svg>
    `,dark:html`
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    `,device:html`
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    `};return n[e]||n.device}function Z(e,n,t,o){const i=t.colorScheme===e;return html`
    <div 
      class="color-scheme-option ${i?"selected":""}"
      data-scheme="${e}"
      onclick=${()=>o("set-color-scheme",e)}
    >
      <div class="color-scheme-circle"></div>
      <div class="color-scheme-label">${n}</div>
    </div>
  `}function _n(e,n,t,o){const i=(t.temperatureUnit||"degC")===e;return html`
    <button 
      class="theme-mode-option ${i?"selected":""}"
      onclick=${()=>o("set-temperature-unit",e)}
    >
      <span>${n}</span>
    </button>
  `}function be(e,n,t,o,i){const s=(o.editorTheme||"auto")===e;return html`
    <div 
      class="editor-theme-option ${s?"selected":""}"
      onclick=${()=>i("set-editor-theme",e)}
    >
      <div class="editor-theme-preview" data-theme="${e}"></div>
      <div class="editor-theme-info">
        <div class="editor-theme-name">${n}</div>
        <div class="editor-theme-desc">${t}</div>
      </div>
    </div>
  `}function qi(e,n){const t=window.i18n?window.i18n.t:i=>i;if(!e.systemInfo&&e.isConnected&&!e.isLoadingSystemInfo&&!e.systemInfoAttempted&&(e.systemInfoAttempted=!0,n("refresh-system-info")),!e.systemInfo)return e.isConnected?html`
      <div class="panel-container">
        <div class="panel-header">
          <h2>${t("sysinfo.title")}</h2>
        </div>
        <div class="panel-loading">
          ${t("sysinfo.loading")}
        </div>
      </div>
    `:html`
        <div class="panel-container" style="padding: 0; overflow-y: auto;">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');

            .demo-features {
                display: grid;
                grid-template-columns: repeat(1, 1fr);
                gap: 32px;
                padding: 20px;
                margin: 0;
                background: var(--bg-primary);
            }

            @media (min-width: 600px) {
                .demo-features {
                    grid-template-columns: repeat(2, 1fr);
                }
            }

            @media (min-width: 1024px) {
                .demo-features {
                    grid-template-columns: repeat(3, 1fr);
                }
            }

            .feature-card {
                background: var(--panel-bg);
                border-radius: 16px;
                padding: 32px;
                border: 1px solid var(--border-color);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                overflow: hidden;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            }

            .feature-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 3px;
                background: linear-gradient(90deg, var(--scheme-primary), var(--scheme-primary-light), var(--scheme-primary));
                transform: scaleX(0);
                transition: transform 0.3s ease;
            }

            .feature-card:hover {
                transform: translateY(-8px) scale(1.02);
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                border-color: var(--scheme-primary-light);
            }

            .feature-card:hover::before {
                transform: scaleX(1);
            }

            .feature-card h3 {
                color: var(--scheme-primary);
                margin-top: 0;
                margin-bottom: 20px;
                font-size: 1.25rem;
                font-weight: 600;
                position: relative;
                z-index: 1;
            }

            .feature-card p {
                color: var(--text-primary);
                line-height: 1.7;
                position: relative;
                z-index: 1;
            }

            /* Floating animation for cards */
            .feature-card:nth-child(odd) {
                animation: float 6s ease-in-out infinite;
            }

            .feature-card:nth-child(even) {
                animation: float 6s ease-in-out infinite reverse;
            }

            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
            }

            .demo-header {
                text-align: center;
                padding: 40px 20px;
                position: relative;
                background: var(--bg-tertiary);

            }


            .demo-header h2 {
                font-size: 3.5rem;
                margin-bottom: 10px;
                background: linear-gradient(135deg, var(--scheme-primary) 0%, var(--scheme-primary-light) 50%, var(--scheme-primary) 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                animation: glow 2s ease-in-out infinite alternate;
                font-family: 'Orbitron', monospace;
                font-weight: 700;
                letter-spacing: 0.05em;
            }

            @keyframes glow {
                from { filter: brightness(1) drop-shadow(0 0 5px var(--scheme-primary)); }
                to { filter: brightness(1.1) drop-shadow(0 0 20px var(--scheme-primary-light)); }
            }

            .demo-header p {
                font-size: 1.2rem;
                color: var(--text-secondary);
                max-width: 500px;
                margin: 0 auto;
                line-height: 1.7;
                opacity: 0.9;
            }

            .demo-cta {
                text-align: center;
                position: relative;
                background: var(--bg-primary);
                padding-bottom: 700px;
            }

            .pulse-circle {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 120px;
                height: 120px;
                border: 2px solid var(--scheme-primary);
                border-radius: 50%;
                opacity: 0.3;
                animation: pulse 2s infinite;
            }

            .pulse-delay {
                animation-delay: 1s;
            }

            @keyframes pulse {
                0% {
                    transform: translate(-50%, -50%) scale(0.8);
                    opacity: 1;
                }
                100% {
                    transform: translate(-50%, -50%) scale(2);
                    opacity: 0;
                }
            }

            .interactive-btn {
                background: var(--scheme-primary);
                color: white;
                border: none;
                padding: 16px 32px;
                border-radius: 50px;
                font-size: 1.1rem;
                font-weight: 600;
                cursor: pointer;
                position: relative;
                z-index: 2;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 4px 15px var(--scheme-primary);
                text-transform: uppercase;
                letter-spacing: 0.5px;
                opacity: 0.9;
            }

            .interactive-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px var(--scheme-primary-light);
                background: var(--scheme-primary-light);
                opacity: 1;
            }

            .interactive-btn:active {
                transform: translateY(0);
            }

            .demo-tagline {
                color: var(--text-secondary);
                margin-top: 20px;
                font-style: italic;
            }
          </style>

          <div class="demo-header">
              <h2>${t("sysinfo.demoTitle")}</h2>
              <p class="demo-tagline">
                  ${t("sysinfo.demoTagline")}
              </p>
          </div>

          <section class="demo-features">
              <div class="feature-card">
                  <h3>${t("sysinfo.featureFast")}</h3>
                  <p>${t("sysinfo.featureFastDesc")}</p>
              </div>

              <div class="feature-card">
                  <h3>${t("sysinfo.featureEditor")}</h3>
                    <p>${t("sysinfo.featureEditorDesc")}</p>
                </div>

              <div class="feature-card">
                  <h3>${t("sysinfo.featureScripto")}</h3>
                  <p>${t("sysinfo.featureScriptoDesc")}</p>
              </div>

              <div class="feature-card">
                  <h3>${t("sysinfo.featureExtensions")}</h3>
                  <p>${t("sysinfo.featureExtensionsDesc")}</p>
              </div>

              <div class="feature-card">
                  <h3>${t("sysinfo.featureManagement")}</h3>
                  <p>${t("sysinfo.featureManagementDesc")}</p>
              </div>

              <div class="feature-card">
                  <h3>${t("sysinfo.featureMonitoring")}</h3>
                  <p>${t("sysinfo.featureMonitoringDesc")}</p>
              </div>
          </section>

          <div class="demo-cta">
              <div style="display: inline-block; position: relative;">
                  <div class="pulse-circle"></div>
                  <div class="pulse-circle pulse-delay"></div>
                  <button class="interactive-btn" onclick=${()=>n("connect")}>
                      ${t("sysinfo.connectDevice")}
                  </button>
              </div>
          </div>
        </div>
      `;const o=e.systemInfo;return html`
    <div class="panel-container">
      <div class="panel-header">
        <h2>${t("sysinfo.title")}</h2>
      </div>
      
      ${Gi(e.boardConfig,t)}
      ${Vi(o,t)}
      ${Ki(o,t)}
    </div>
  `}function Gi(e,n){return html`
    <div class="panel-section">
      <h3 class="panel-section-title">${n("sysinfo.boardInfo")}</h3>
      ${e?html`
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">${n("sysinfo.boardName")}</span>
            <span class="info-value">${e.board_name||n("sysinfo.notAvailable")}</span>
          </div>
          <div class="info-item">
            <span class="info-label">${n("sysinfo.boardId")}</span>
            <span class="info-value info-mono">${e.board_id||n("sysinfo.notAvailable")}</span>
          </div>
          <div class="info-item">
            <span class="info-label">${n("sysinfo.chip")}</span>
            <span class="info-value">${e.chip||n("sysinfo.notAvailable")}</span>
          </div>
          <div class="info-item">
            <span class="info-label">${n("sysinfo.version")}</span>
            <span class="info-value">${e.version||n("sysinfo.notAvailable")}</span>
          </div>
          ${e.description?html`
            <div class="info-item" style="grid-column: 1 / -1;">
              <span class="info-label">${n("sysinfo.description")}</span>
              <span class="info-value">${e.description}</span>
            </div>
          `:""}
        </div>
      `:html`
        <div class="panel-loading" style="padding: 20px; text-align: center; color: var(--text-secondary);">
          ${n("sysinfo.loadingBoard")}
        </div>
      `}
    </div>
  `}function Vi(e,n){const t=e.os||{};return html`
    <div class="panel-section">
      <h3 class="panel-section-title">${n("sysinfo.mcuTitle")}</h3>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">${n("sysinfo.uniqueId")}</span>
          <span class="info-value info-mono">${e.uid||n("sysinfo.notAvailable")}</span>
        </div>
        <div class="info-item">
          <span class="info-label">${n("sysinfo.frequency")}</span>
          <span class="info-value">${e.freq?e.freq+" "+n("sysinfo.mhz"):n("sysinfo.notAvailable")}</span>
        </div>
        <div class="info-item">
          <span class="info-label">${n("sysinfo.flashSize")}</span>
          <span class="info-value">${gt(e.flashSize)}</span>
        </div>
        <div class="info-item">
          <span class="info-label">${n("sysinfo.platform")}</span>
          <span class="info-value">${t.platform||n("sysinfo.notAvailable")}</span>
        </div>
        <div class="info-item">
          <span class="info-label">${n("sysinfo.system")}</span>
          <span class="info-value">${t.system||n("sysinfo.notAvailable")}</span>
        </div>
        <div class="info-item">
          <span class="info-label">${n("sysinfo.release")}</span>
          <span class="info-value">${t.release||n("sysinfo.notAvailable")}</span>
        </div>
        <div class="info-item">
          <span class="info-label">${n("sysinfo.version")}</span>
          <span class="info-value info-mono">${t.version||n("sysinfo.notAvailable")}</span>
        </div>
        <div class="info-item">
          <span class="info-label">${n("sysinfo.implementation")}</span>
          <span class="info-value">${t.implem||n("sysinfo.notAvailable")}</span>
        </div>
        <div class="info-item">
          <span class="info-label">${n("sysinfo.spiram")}</span>
          <span class="info-value ${t.spiram?"status-yes":"status-no"}">
            ${t.spiram?n("sysinfo.yes"):n("sysinfo.no")}
          </span>
        </div>
        <div class="info-item">
          <span class="info-label">${n("sysinfo.mpyVersion")}</span>
          <span class="info-value">${t.mpyver||n("sysinfo.notAvailable")}</span>
        </div>
      </div>
    </div>
  `}function Ki(e,n){return!e.partitions||e.partitions.length===0?"":html`
    <div class="panel-section">
      <h3 class="panel-section-title">${n("sysinfo.partitions")}</h3>
      <div class="partitions-table">
        <div class="partition-header">
          <span class="partition-name">${n("sysinfo.partitionName")}</span>
          <span class="partition-type">${n("sysinfo.partitionType")}</span>
          <span class="partition-offset">${n("sysinfo.partitionOffset")}</span>
          <span class="partition-size">${n("sysinfo.partitionSize")}</span>
        </div>
        ${e.partitions.map(t=>{let o;return Array.isArray(t)?o={type:t[0],subtype:t[1],offset:t[2],size:t[3],name:t[4]||"unknown",encrypted:t[5]}:o=t,html`
            <div class="partition-row">
              <span class="partition-name">
                ${Xi(o.name)}
                ${o.name}
              </span>
              <span class="partition-type">${Ji(o.type,o.subtype)}</span>
              <span class="partition-offset">0x${o.offset.toString(16)}</span>
              <span class="partition-size">${gt(o.size)}</span>
            </div>
          `})}
      </div>
    </div>
  `}function Ji(e,n){return{0:"APP",1:"DATA"}[e]||`Type ${e}`}function Xi(e){if(!e)return"📦";const n=e.toLowerCase();return n.includes("ota")?"🔄":n.includes("nvs")?"💾":n.includes("www")?"🌐":n.includes("vfs")?"📁":n.includes("data")?"💿":n.includes("factory")?"🏭":"📦"}function gt(e){return e?e<1024?e+" B":e<1024*1024?(e/1024).toFixed(1)+" KB":(e/(1024*1024)).toFixed(2)+" MB":"N/A"}function Tn(e,n){if(!e.networksInfo&&e.isConnected&&!e.isLoadingNetworks&&n("refresh-networks"),!e.networksInfo)return html`
      <div class="panel-container">
        <div class="panel-header">
          <h2>WiFi Configuration</h2>
        </div>
        <div class="panel-loading">
          ${e.isConnected?"Loading WiFi information...":"Connect to device to view WiFi configuration"}
        </div>
      </div>
    `;const t=e.networksInfo;return html`
    <div class="panel-container">
      <div class="panel-header">
        <h2>WiFi Configuration</h2>
      </div>
      
      ${Yi(t.wifiSTA)}
      ${Qi(t.wifiAP)}
    </div>
  `}function Yi(e){return e?html`
    <div class="panel-section">
      <div class="section-header">
        <h3 class="panel-section-title">Wi-Fi Client Interface</h3>
        <div class="status-badge ${e.active?"status-active":"status-inactive"}">
          ${e.active?"Active":"Inactive"}
        </div>
      </div>
      
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">MAC Address:</span>
          <span class="info-value info-mono">${e.mac||"N/A"}</span>
        </div>
        <div class="info-item">
          <span class="info-label">SSID:</span>
          <span class="info-value">${e.ssid||"Not connected"}</span>
        </div>
        <div class="info-item">
          <span class="info-label">IP Address:</span>
          <span class="info-value info-mono">${e.ip||"0.0.0.0"}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Subnet Mask:</span>
          <span class="info-value info-mono">${e.mask||"0.0.0.0"}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Gateway:</span>
          <span class="info-value info-mono">${e.gateway||"0.0.0.0"}</span>
        </div>
        <div class="info-item">
          <span class="info-label">DNS Server:</span>
          <span class="info-value info-mono">${e.dns||"0.0.0.0"}</span>
        </div>
        ${e.rssi?html`
          <div class="info-item">
            <span class="info-label">Signal Strength:</span>
            <span class="info-value">${e.rssi} dBm</span>
          </div>
        `:""}
      </div>
      
      ${e.active&&e.ssid?html`
        <div class="config-actions">
          <button class="secondary-button" onclick=${()=>alert("WiFi configuration coming soon")}>
            Configure
          </button>
        </div>
      `:html`
        <div class="config-actions">
          <button class="primary-button" onclick=${()=>alert("WiFi setup coming soon")}>
            Connect to Network
          </button>
        </div>
      `}
    </div>
  `:""}function Qi(e){return e?html`
    <div class="panel-section">
      <div class="section-header">
        <h3 class="panel-section-title">Wi-Fi Access Point Interface</h3>
        <div class="status-badge ${e.active?"status-active":"status-inactive"}">
          ${e.active?"Active":"Inactive"}
        </div>
      </div>
      
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">MAC Address:</span>
          <span class="info-value info-mono">${e.mac||"N/A"}</span>
        </div>
        <div class="info-item">
          <span class="info-label">SSID:</span>
          <span class="info-value">${e.ssid||"N/A"}</span>
        </div>
        <div class="info-item">
          <span class="info-label">IP Address:</span>
          <span class="info-value info-mono">${e.ip||"0.0.0.0"}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Subnet Mask:</span>
          <span class="info-value info-mono">${e.mask||"0.0.0.0"}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Gateway:</span>
          <span class="info-value info-mono">${e.gateway||"0.0.0.0"}</span>
        </div>
        <div class="info-item">
          <span class="info-label">DNS Server:</span>
          <span class="info-value info-mono">${e.dns||"0.0.0.0"}</span>
        </div>
        ${e.clients!==void 0?html`
          <div class="info-item">
            <span class="info-label">Connected Clients:</span>
            <span class="info-value">${e.clients}</span>
          </div>
        `:""}
      </div>
      
      <div class="config-actions">
        <button class="secondary-button" onclick=${()=>alert("AP configuration coming soon")}>
          ${e.active?"Configure":"Enable AP"}
        </button>
      </div>
    </div>
  `:""}function Zi(e,n){if(!e.networksInfo&&e.isConnected&&!e.isLoadingNetworks&&n("refresh-networks"),e.isConnected&&!e.ethConfigLoaded&&!e.isLoadingEthConfig&&n("load-eth-config"),!e.networksInfo)return html`
      <div class="panel-container">
        <div class="panel-header">
          <h2>Ethernet Configuration</h2>
        </div>
        <div class="panel-loading">
          ${e.isConnected?"Loading Ethernet information...":"Connect to device to view Ethernet configuration"}
        </div>
      </div>
    `;const t=e.networksInfo.eth,o=e.ethStatus||t,i=e.ethConfig||{},s=t!==null,c=o&&(o.mac||o.enabled||o.enable||o.initialized),r=o&&o.ip&&o.ip!=="0.0.0.0",a=o&&o.linkup===!0,l=r;return s?html`
    <div class="panel-container">
      <div class="panel-header">
        <h2>Ethernet Configuration</h2>
      </div>
      
      <div class="panel-section">
        <div class="section-header">
          <h3 class="panel-section-title">Ethernet PHY Interface</h3>
          <div class="status-badge ${l?"status-active":a?"status-warning":"status-inactive"}">
            ${l?"Connected":a?"Link Up (No IP)":c?"No Link":"Not Initialized"}
          </div>
        </div>
        
        ${c?html`
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">MAC Address:</span>
              <span class="info-value info-mono">${o.mac||"N/A"}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Status:</span>
              <span class="info-value ${o.enabled||o.enable?"status-yes":"status-no"}">
                ${o.enabled||o.enable?"Active":"Inactive"}
              </span>
            </div>
            <div class="info-item">
              <span class="info-label">Link:</span>
              <span class="info-value ${a?"status-yes":"status-no"}">
                ${a?"Cable Connected":"No Cable"}
              </span>
            </div>
            ${r?html`
              <div class="info-item">
                <span class="info-label">IP Address:</span>
                <span class="info-value info-mono">${o.ip||"0.0.0.0"}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Subnet Mask:</span>
                <span class="info-value info-mono">${o.mask||"0.0.0.0"}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Gateway:</span>
                <span class="info-value info-mono">${o.gateway||"0.0.0.0"}</span>
              </div>
              <div class="info-item">
                <span class="info-label">DNS Server:</span>
                <span class="info-value info-mono">${o.dns||"0.0.0.0"}</span>
              </div>
            `:""}
          </div>
        `:html`
          <div class="panel-message" style="margin: 16px 0;">
            <p>Ethernet interface is available but not initialized.</p>
          </div>
        `}
        
        <div class="config-actions" style="margin-top: 16px;">
          ${c?"":html`
            <button 
              class="primary-button" 
              onclick=${()=>n("init-ethernet")}
              disabled=${e.isInitializingEth}
            >
              ${e.isInitializingEth?"Initializing...":"Initialize Ethernet"}
            </button>
          `}
        </div>
      </div>
      
      ${i?html`
        <div class="panel-section">
          <div class="section-header">
            <h3 class="panel-section-title">Configuration</h3>
          </div>
          
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Auto-Enable:</span>
              <span class="info-value ${i.enabled!==!1?"status-yes":"status-no"}">
                ${i.enabled!==!1?"Yes":"No"}
              </span>
            </div>
            <div class="info-item">
              <span class="info-label">DHCP:</span>
              <span class="info-value ${i.dhcp!==!1?"status-yes":"status-no"}">
                ${i.dhcp!==!1?"Enabled":"Static IP"}
              </span>
            </div>
            <div class="info-item">
              <span class="info-label">PHY Type:</span>
              <span class="info-value">${i.phy_type||"Auto"}</span>
            </div>
            <div class="info-item">
              <span class="info-label">PHY Address:</span>
              <span class="info-value">${i.phy_addr!==void 0?i.phy_addr:"Auto"}</span>
            </div>
            ${i.pins?html`
              <div class="info-item">
                <span class="info-label">MDC Pin:</span>
                <span class="info-value">GPIO ${i.pins.mdc}</span>
              </div>
              <div class="info-item">
                <span class="info-label">MDIO Pin:</span>
                <span class="info-value">GPIO ${i.pins.mdio}</span>
              </div>
            `:""}
          </div>
        </div>
      `:""}
      
      <div class="panel-section">
        <div class="section-header">
          <h3 class="panel-section-title">Network Priority</h3>
        </div>
        <div class="info-description">
          <p style="margin: 0 0 8px 0;">
            <strong>Ethernet-Preferred Mode:</strong> When Ethernet is connected with a valid IP, 
            it becomes the preferred network interface. WiFi remains active as an automatic fallback.
          </p>
        </div>
      </div>
    </div>
  `:html`
      <div class="panel-container">
        <div class="panel-header">
          <h2>Ethernet Configuration</h2>
        </div>
        <div class="panel-message">
          <p>Ethernet is not available on this device.</p>
          <p style="color: var(--text-secondary); font-size: 0.9em; margin-top: 8px;">
            This chip may not have an internal EMAC, or the firmware was built without Ethernet support.
          </p>
        </div>
      </div>
    `}function eo(e,n){e.isConnected&&!e.vpnConfigLoaded&&!e.isLoadingVpnConfig&&n("load-vpn-config");const t=e.vpnConfig||{hostname:"",join_code:"",auto_connect:!1},o=e.networksInfo?.vpn,i=e.isConnected,s=e.networksInfo&&o!==void 0;!s||o.available;const c=s&&o.active;return html`
    <div class="panel-container">
      <div class="panel-header">
        <h2>VPN Configuration</h2>
      </div>
      
      <!-- Module not available warning (only show when connected and confirmed unavailable) -->
      ${i&&s&&!o.available?html`
        <div class="panel-section">
          <div class="panel-message" style="background: var(--warning-bg, rgba(255, 193, 7, 0.1)); border-left: 3px solid var(--warning-color, #ffc107);">
            <p><strong>Husarnet VPN module not available</strong></p>
            <p style="margin-top: 8px; font-size: 13px; color: var(--text-secondary);">
              The Husarnet VPN module is not compiled into this firmware build.
              To enable VPN support, rebuild the firmware with 
              <code style="background: var(--bg-secondary); padding: 2px 6px; border-radius: 3px;">MODULE_PYDIRECT_HUSARNET=ON</code>
            </p>
          </div>
        </div>
      `:""}
      
      <!-- VPN Status Section -->
      <div class="panel-section">
        <div class="section-header">
          <h3 class="panel-section-title">VPN Status</h3>
          <div class="status-badge ${c?"status-active":"status-inactive"}">
            ${c?"Connected":"Disconnected"}
          </div>
        </div>
        
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Status:</span>
            <span class="info-value ${c?"status-yes":"status-no"}">
              ${c?"Connected":"Not connected"}
            </span>
          </div>
          <div class="info-item">
            <span class="info-label">VPN IPv6 Address:</span>
            <span class="info-value info-mono">${c&&o?.ip?o.ip:"--"}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Hostname:</span>
            <span class="info-value">${o?.hostname||t.hostname||"--"}</span>
          </div>
        </div>
      </div>
      
      <!-- VPN Configuration Section -->
      <div class="panel-section">
        <div class="section-header">
          <h3 class="panel-section-title">Configuration</h3>
        </div>
        
        <form class="config-form" onsubmit=${r=>{r.preventDefault();const a=new FormData(r.target),l=a.get("hostname")||"",d=a.get("join_code")||"",p=a.get("auto_connect")==="on";if(!l.trim()){alert("Please enter a hostname for this device");return}if(!d.trim()){alert("Please enter a Husarnet join code");return}n("vpn-connect",{hostname:l.trim(),join_code:d.trim(),auto_connect:p})}}>
          <div class="form-group">
            <label for="vpn-hostname">
              Device Hostname
              <span class="label-tooltip">
                <svg class="label-tooltip-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                <span class="tooltip">A unique name for this device on the VPN network</span>
              </span>
            </label>
            <input 
              type="text" 
              id="vpn-hostname" 
              name="hostname" 
              value=${t.hostname||""}
              placeholder="e.g., my-esp32-device"
              ${c?"disabled":""}
            />
          </div>
          
          <div class="form-group">
            <label for="vpn-join-code">
              Join Code
              <span class="label-tooltip">
                <svg class="label-tooltip-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                <span class="tooltip">
                  Get your join code from the Husarnet Dashboard at app.husarnet.com.
                  Create a network and copy the join code.
                </span>
              </span>
            </label>
            <input 
              type="text" 
              id="vpn-join-code" 
              name="join_code" 
              value=${t.join_code||""}
              placeholder="fc94:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx"
              ${c?"disabled":""}
              style="font-family: var(--font-mono); font-size: 12px;"
            />
            <p class="form-help-text" style="margin-top: 6px; font-size: 12px; color: var(--text-secondary);">
              Get your join code from 
              <a href="https://app.husarnet.com" target="_blank" rel="noopener" style="color: var(--accent-color);">
                app.husarnet.com
              </a>
            </p>
          </div>
          
          <div class="form-group">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                name="auto_connect"
                ${t.auto_connect?"checked":""}
              />
              <span>
                Auto-connect on boot
                <span class="label-tooltip">
                  <svg class="label-tooltip-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="16" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                  <span class="tooltip">Automatically connect to VPN when the device boots (requires network)</span>
                </span>
              </span>
            </label>
          </div>
          
          <div class="config-actions">
            ${c?html`
              <button 
                type="button" 
                class="secondary-button danger" 
                onclick=${()=>n("vpn-disconnect")}
              >
                Disconnect VPN
              </button>
            `:html`
              <button type="submit" class="primary-button" disabled=${!i}>
                Connect to VPN
              </button>
              <button 
                type="button" 
                class="secondary-button" 
                disabled=${!i}
                onclick=${r=>{r.preventDefault();const a=r.target.closest("form"),l=new FormData(a);n("vpn-save-config",{hostname:l.get("hostname")||"",join_code:l.get("join_code")||"",auto_connect:l.get("auto_connect")==="on",enabled:!1})}}
              >
                Save Only
              </button>
            `}
          </div>
        </form>
      </div>
      
      <!-- Connected Peers Section -->
      <div class="panel-section">
        <div class="section-header">
          <h3 class="panel-section-title">Connected Peers</h3>
        </div>
        
        ${c&&o?.peers&&o.peers.length>0?html`
          <div class="peers-list">
            ${o.peers.map(r=>html`
              <div class="peer-item">
                <div class="peer-hostname">${r.hostname}</div>
                <div class="peer-ip info-mono">${r.ip}</div>
              </div>
            `)}
          </div>
        `:html`
          <p class="info-description">
            ${c?"No other peers discovered yet. Add more devices to your Husarnet network to see them here.":"Connect to VPN to discover peers on your network."}
          </p>
        `}
      </div>
      
      <!-- About Husarnet -->
      <div class="panel-section">
        <div class="section-header">
          <h3 class="panel-section-title">About Husarnet VPN</h3>
        </div>
        <p class="info-description">
          Husarnet is a peer-to-peer VPN that creates secure, encrypted connections between your devices.
          Each device gets a unique IPv6 address (fc94::/16) that remains constant across network changes.
        </p>
        <ul class="feature-list" style="margin-top: 12px; padding-left: 20px; font-size: 13px; color: var(--text-secondary);">
          <li>Low latency P2P connections (no server in the middle)</li>
          <li>Works across NAT and firewalls</li>
          <li>End-to-end encryption (X25519 + ChaCha20-Poly1305)</li>
          <li>Stable addresses for services like registries, OTA, and OVMS</li>
        </ul>
      </div>
    </div>
  `}function no(e,n){if(!e.networksInfo&&e.isConnected&&!e.isLoadingNetworks&&n("refresh-networks"),!e.networksInfo)return html`
      <div class="panel-container">
        <div class="panel-header">
          <h2>Bluetooth LE Configuration</h2>
        </div>
        <div class="panel-loading">
          ${e.isConnected?"Loading Bluetooth LE information...":"Connect to device to view Bluetooth LE configuration"}
        </div>
      </div>
    `;const t=e.networksInfo.ble;return t?html`
    <div class="panel-container">
      <div class="panel-header">
        <h2>Bluetooth LE Configuration</h2>
      </div>
      
      <div class="panel-section">
        <div class="section-header">
          <h3 class="panel-section-title">Bluetooth LE Interface</h3>
          <div class="status-badge ${t.active?"status-active":"status-inactive"}">
            ${t.active?"Active":"Inactive"}
          </div>
        </div>
        
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">MAC Address:</span>
            <span class="info-value info-mono">${t.mac||"N/A"}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Status:</span>
            <span class="info-value">${t.active?"Enabled":"Disabled"}</span>
          </div>
        </div>
        
        <div class="config-actions">
          <button class="secondary-button" onclick=${()=>alert("Bluetooth configuration coming soon")}>
            ${t.active?"Configure":"Enable Bluetooth"}
          </button>
        </div>
      </div>
    </div>
  `:html`
      <div class="panel-container">
        <div class="panel-header">
          <h2>Bluetooth LE Configuration</h2>
        </div>
        <div class="panel-message">
          <p>Bluetooth LE information not available.</p>
        </div>
      </div>
    `}function to(e,n){e.isConnected&&!e.wwanConfigLoaded&&!e.isLoadingWwanConfig&&n("load-wwan-config"),e.isConnected&&!e.modemStatusLoaded&&!e.isLoadingModemStatus&&n("load-modem-status");const t=e.wwanConfig||{},o=e.modemStatus||{},i=o.ppp||{};let s="Disabled",c="status-disabled";return t.mobile_data_enabled&&(i.connected?(s="Connected",c="status-connected"):i.connecting?(s="Connecting...",c="status-connecting"):o.connected?(s="Standby (WiFi OK)",c="status-standby"):(s="Waiting for modem...",c="status-waiting")),html`
    <div class="panel-container">
      <div class="panel-header">
        <h2>WWAN/Mobile Data</h2>
      </div>
      
      <!-- Mobile Data Toggle Section -->
      <div class="panel-section">
        <div class="section-header">
          <h3 class="panel-section-title">Mobile Data</h3>
        </div>
        
        <div class="mobile-data-control">
          <div class="toggle-row">
            <label class="toggle-switch ${i.connected?"ppp-active":i.connecting?"ppp-connecting":""}">
              <input 
                type="checkbox" 
                ${t.mobile_data_enabled?"checked":""}
                onchange=${r=>{r.target.checked?n("enable-mobile-data"):n("disable-mobile-data")}}
                disabled=${!e.isConnected}
              />
              <span class="toggle-slider"></span>
            </label>
            <span class="toggle-label">Enable Mobile Data</span>
          </div>
          
          <div class="status-row">
            <span class="status-label">Status:</span>
            <span class="status-value ${c}">${s}</span>
          </div>
          
          ${i.connected&&i.ip?html`
            <div class="ip-row">
              <span class="ip-label">IP Address:</span>
              <span class="ip-value">${i.ip}</span>
            </div>
          `:""}
          
          <p class="mobile-data-note">
            WiFi is preferred. Mobile data is used as backup when WiFi has no internet connectivity.
          </p>
        </div>
      </div>
      
      <!-- GPRS Settings Section -->
      <div class="panel-section">
        <div class="section-header">
          <h3 class="panel-section-title">GPRS Settings</h3>
        </div>
        
        <form class="config-form" onsubmit=${r=>{r.preventDefault();const a=new FormData(r.target),l={apn:a.get("apn")||"",username:a.get("username")||"",password:a.get("password")||"",auto_init_modem:a.get("auto_init_modem")==="on",mobile_data_enabled:t.mobile_data_enabled||!1};n("save-wwan-config",l)}}>
          <div class="form-group">
            <label for="wwan-apn">
              GPRS APN
              <span class="label-tooltip">
                <svg class="label-tooltip-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                <span class="tooltip">The access point name for the mobile network (optional, required for GPRS connection)</span>
              </span>
            </label>
            <input 
              type="text" 
              id="wwan-apn" 
              name="apn" 
              value=${t.apn||""}
              placeholder="e.g., internet"
            />
          </div>
          
          <div class="form-group">
            <label for="wwan-username">
              GPRS Username
              <span class="label-tooltip">
                <svg class="label-tooltip-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                <span class="tooltip">Username for GPRS connection (if required by provider)</span>
              </span>
            </label>
            <input 
              type="text" 
              id="wwan-username" 
              name="username" 
              value=${t.username||""}
              placeholder="Optional"
            />
          </div>
          
          <div class="form-group">
            <label for="wwan-password">
              GPRS Password
              <span class="label-tooltip">
                <svg class="label-tooltip-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                <span class="tooltip">Password for GPRS connection (if required by provider)</span>
              </span>
            </label>
            <input 
              type="password" 
              id="wwan-password" 
              name="password" 
              value=${t.password||""}
              placeholder="Optional"
            />
          </div>
          
          <div class="form-group">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                name="auto_init_modem" 
                ${t.auto_init_modem!==!1?"checked":""}
              />
              <span>
                Auto-initialize USB Modem on Boot
                <span class="label-tooltip">
                  <svg class="label-tooltip-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="16" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                  <span class="tooltip">Automatically initialize and connect to USB modem if detected on boot</span>
                </span>
              </span>
            </label>
          </div>
          
          <div class="config-actions">
            <button type="submit" class="primary-button" disabled=${!e.isConnected}>
              Save Configuration
            </button>
          </div>
        </form>
      </div>
      
      ${e.isConnected?"":html`
        <div class="panel-message">
          <p>Connect to device to configure WWAN settings.</p>
        </div>
      `}
    </div>
    
    <style>
      .mobile-data-control {
        padding: 12px 0;
      }
      
      .toggle-row {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
      }
      
      .toggle-switch {
        position: relative;
        display: inline-block;
        width: 48px;
        height: 26px;
      }
      
      .toggle-switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }
      
      .toggle-slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: var(--border-color);
        transition: 0.3s;
        border-radius: 26px;
      }
      
      .toggle-slider:before {
        position: absolute;
        content: "";
        height: 20px;
        width: 20px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: 0.3s;
        border-radius: 50%;
      }
      
      .toggle-switch input:checked + .toggle-slider {
        background-color: var(--scheme-primary);
      }
      
      .toggle-switch.ppp-active input:checked + .toggle-slider {
        background-color: #22c55e;
      }
      
      .toggle-switch.ppp-connecting input:checked + .toggle-slider {
        background-color: var(--scheme-primary-light);
        animation: toggle-pulse 1.5s ease-in-out infinite;
      }
      
      @keyframes toggle-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.6; }
      }
      
      .toggle-switch input:checked + .toggle-slider:before {
        transform: translateX(22px);
      }
      
      .toggle-switch input:disabled + .toggle-slider {
        opacity: 0.5;
        cursor: not-allowed;
      }
      
      .toggle-label {
        font-size: 14px;
        font-weight: 500;
      }
      
      .status-row, .ip-row {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
        font-size: 13px;
      }
      
      .status-label, .ip-label {
        color: var(--text-secondary);
      }
      
      .status-value {
        font-weight: 500;
      }
      
      .status-disabled {
        color: var(--text-secondary);
      }
      
      .status-standby {
        color: #f59e0b;
      }
      
      .status-waiting {
        color: #f59e0b;
      }
      
      .status-connected {
        color: #22c55e;
      }
      
      .status-connecting {
        color: var(--scheme-primary-light);
        animation: pulse 1.5s ease-in-out infinite;
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      
      .ip-value {
        font-family: 'CodeFont', monospace;
        color: var(--scheme-primary);
      }
      
      .mobile-data-note {
        font-size: 12px;
        color: var(--text-secondary);
        opacity: 0.8;
        margin-top: 12px;
        padding: 8px;
        background: var(--bg-secondary);
        border-radius: 4px;
        line-height: 1.4;
      }
    </style>
  `}function io(e,n){e.isConnected&&!e.mqttConfigLoaded&&!e.isLoadingMqttConfig&&n("load-mqtt-config");const t=e.mqttConfig||{};return html`
    <div class="panel-container">
      <div class="panel-header">
        <h2>MQTT Configuration</h2>
      </div>
      
      <div class="panel-section">
        <div class="section-header">
          <h3 class="panel-section-title">MQTT Broker Settings</h3>
        </div>
        
        <form class="config-form" onsubmit=${o=>{o.preventDefault();const i=new FormData(o.target),s={server:i.get("server")||"",port:parseInt(i.get("port")||"1883"),username:i.get("username")||"",password:i.get("password")||"",tls:i.get("tls")==="on",ca_cert_path:i.get("ca_cert_path")||"",topic_prefix:i.get("topic_prefix")||""};if(!s.server){alert("Server address is required");return}n("save-mqtt-config",s)}}>
          <div class="form-group">
            <label for="mqtt-server">
              Server Address <span class="required">*</span>
              <span class="label-tooltip">
                <svg class="label-tooltip-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                <span class="tooltip">The IP address or hostname of your MQTT broker</span>
              </span>
            </label>
            <input 
              type="text" 
              id="mqtt-server" 
              name="server" 
              value=${t.server||""}
              placeholder="e.g., mqtt.example.com or 192.168.1.100"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="mqtt-port">
              Port
              <span class="label-tooltip">
                <svg class="label-tooltip-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                <span class="tooltip">Use 1883 for unencrypted connections or 8883 for TLS/SSL</span>
              </span>
            </label>
            <input 
              type="number" 
              id="mqtt-port" 
              name="port" 
              value=${t.port||1883}
              min="1"
              max="65535"
            />
          </div>
          
          <div class="form-group">
            <label for="mqtt-username">
              Username
              <span class="label-tooltip">
                <svg class="label-tooltip-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                <span class="tooltip">The username for connecting to your MQTT broker</span>
              </span>
            </label>
            <input 
              type="text" 
              id="mqtt-username" 
              name="username" 
              value=${t.username||""}
              placeholder="Optional"
            />
          </div>
          
          <div class="form-group">
            <label for="mqtt-password">
              Password
              <span class="label-tooltip">
                <svg class="label-tooltip-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                <span class="tooltip">The password for connecting to your MQTT broker</span>
              </span>
            </label>
            <input 
              type="password" 
              id="mqtt-password" 
              name="password" 
              value=${t.password||""}
              placeholder="Optional"
            />
          </div>
          
          <div class="form-group">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                name="tls" 
                ${t.tls?"checked":""}
              />
              <span>
                Encryption (TLS/SSL)
                <span class="label-tooltip">
                  <svg class="label-tooltip-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="16" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                  <span class="tooltip">Enable this for secure communication</span>
                </span>
              </span>
            </label>
          </div>
          
          <div class="form-group">
            <label for="mqtt-ca-cert">
              CA Certificate Path
              <span class="label-tooltip">
                <svg class="label-tooltip-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                <span class="tooltip">Path to CA certificate file (required if using TLS)</span>
              </span>
            </label>
            <input 
              type="text" 
              id="mqtt-ca-cert" 
              name="ca_cert_path" 
              value=${t.ca_cert_path||""}
              placeholder="e.g., /store/trustedca/mqtt.pem"
            />
          </div>
          
          <div class="form-group">
            <label for="mqtt-topic-prefix">
              Topic Prefix
              <span class="label-tooltip">
                <svg class="label-tooltip-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                <span class="tooltip">Common prefix for organizing data (standard: ovms/&lt;username&gt;/&lt;vehicleid&gt;)</span>
              </span>
            </label>
            <input 
              type="text" 
              id="mqtt-topic-prefix" 
              name="topic_prefix" 
              value=${t.topic_prefix||"ovms/"}
              placeholder="e.g., ovms/username/vehicleid"
            />
          </div>
          
          <div class="config-actions">
            <button type="submit" class="primary-button" disabled=${!e.isConnected}>
              Save Configuration
            </button>
          </div>
        </form>
      </div>
      
      ${e.isConnected?"":html`
        <div class="panel-message">
          <p>Connect to device to configure MQTT settings.</p>
        </div>
      `}
    </div>
  `}function oo(e,n){e.isConnected&&!e.ntpConfigLoaded&&!e.isLoadingNtpConfig&&n("load-ntp-config");const t=e.ntpConfig||{server:"pool.ntp.org",timezone:"UTC",autoDetect:!1,autoSync:!1},o=e.ntpSyncResult||null,i=r=>{if(!r)return"--:--:--";const{year:a,month:l,day:d,hour:p,minute:u,second:f}=r;return`${String(p).padStart(2,"0")}:${String(u).padStart(2,"0")}:${String(f).padStart(2,"0")}`},s=r=>{if(!r)return"";const{year:a,month:l,day:d}=r;return`${a}-${String(l).padStart(2,"0")}-${String(d).padStart(2,"0")}`},c=[{value:"UTC",offset:0,label:"UTC (Coordinated Universal Time)"},{value:"EST",offset:-5,label:"EST (Eastern Standard Time)"},{value:"CST",offset:-6,label:"CST (Central Standard Time)"},{value:"MST",offset:-7,label:"MST (Mountain Standard Time)"},{value:"PST",offset:-8,label:"PST (Pacific Standard Time)"},{value:"GMT",offset:0,label:"GMT (Greenwich Mean Time)"},{value:"CET",offset:1,label:"CET (Central European Time)"},{value:"EET",offset:2,label:"EET (Eastern European Time)"},{value:"JST",offset:9,label:"JST (Japan Standard Time)"},{value:"AEST",offset:10,label:"AEST (Australian Eastern Standard Time)"}];return html`
    <div class="panel-container">
      <div class="panel-header">
        <h2>NTP Time Synchronization</h2>
      </div>
      
      <div class="panel-section">
        <div class="section-header">
          <h3 class="panel-section-title">Current Time</h3>
        </div>
        
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">UTC Time:</span>
            <span class="info-value">
              ${o&&o.utc?`${s(o.utc)} ${i(o.utc)}`:"--:--:--"}
            </span>
          </div>
          <div class="info-item">
            <span class="info-label">Local Time:</span>
            <span class="info-value">
              ${o&&o.local?`${s(o.local)} ${i(o.local)}`:"--:--:--"}
            </span>
          </div>
        </div>
        ${o?html`
          <p class="info-description" style="margin-top: 12px; font-size: 12px; color: var(--text-secondary);">
            Last synchronized: ${new Date(o.timestamp).toLocaleTimeString()}
          </p>
        `:""}
      </div>
      
      <div class="panel-section">
        <div class="section-header">
          <h3 class="panel-section-title">NTP Configuration</h3>
        </div>
        
        <form class="config-form" onsubmit=${async r=>{r.preventDefault();const a=new FormData(r.target),l=a.get("server")||"pool.ntp.org",d=a.get("timezone")||"UTC",p=a.get("auto_detect")==="on",u=a.get("auto_sync")==="on",f=c.find(v=>v.value===d),g=f?f.offset:0,h={server:l,tz_offset:g,timezone:d,auto_detect:p,auto_sync:u};try{await new Promise((v,S)=>{const P=setTimeout(()=>S(new Error("Save timeout")),1e4),k=()=>{clearTimeout(P),window.appInstance.emitter.removeListener("ntp-config-saved",O),window.appInstance.emitter.removeListener("ntp-config-save-error",x)},O=()=>{k(),v()},x=L=>{k(),S(L)};window.appInstance.emitter.once("ntp-config-saved",O),window.appInstance.emitter.once("ntp-config-save-error",x),n("save-ntp-config",h)}),n("sync-ntp-time",l,g,p,u)}catch(v){console.error("[NTP] Failed to save config before sync:",v),alert(`Failed to save NTP configuration: ${v.message}`)}}}>
          <div class="form-group">
            <label for="ntp-server">
              NTP Server
              <span class="label-tooltip">
                <svg class="label-tooltip-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                <span class="tooltip">NTP server hostname or IP address</span>
              </span>
            </label>
            <input 
              type="text" 
              id="ntp-server" 
              name="server" 
              value=${t.server||"pool.ntp.org"}
              placeholder="e.g., pool.ntp.org"
            />
          </div>
          
          <div class="form-group">
            <label for="ntp-timezone">
              Timezone
              <span class="label-tooltip">
                <svg class="label-tooltip-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                <span class="tooltip">Select your timezone</span>
              </span>
            </label>
            <select id="ntp-timezone" name="timezone">
              ${c.map(r=>html`
                <option value=${r.value} ${t.timezone===r.value?"selected":""}>
                  ${r.label}
                </option>
              `)}
            </select>
          </div>
          
          <div class="form-group">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                name="auto_detect"
                ${t.autoDetect?"checked":""}
              />
              <span>
                Auto-detect timezone from IP
                <span class="label-tooltip">
                  <svg class="label-tooltip-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="16" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                  <span class="tooltip">Attempt to automatically detect timezone using IP geolocation</span>
                </span>
              </span>
            </label>
          </div>
          
          <div class="form-group">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                name="auto_sync"
                ${t.autoSync?"checked":""}
              />
              <span>
                Auto-sync on network connect
                <span class="label-tooltip">
                  <svg class="label-tooltip-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="16" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                  <span class="tooltip">Automatically synchronize time when device connects to internet</span>
                </span>
              </span>
            </label>
          </div>
          
          <div class="config-actions">
            <button type="submit" class="primary-button" disabled=${!e.isConnected}>
              Synchronize Time
            </button>
          </div>
        </form>
      </div>
      
      ${e.isConnected?"":html`
        <div class="panel-message">
          <p>Connect to device to synchronize time.</p>
        </div>
      `}
    </div>
  `}function so(e,n){e.isConnected&&!e.canConfigLoaded&&!e.isLoadingCanConfig&&n("load-can-config");const t=e.canConfig||{bitrate:5e5,enabled:!0};return html`
    <div class="panel-container">
      <div class="panel-header">
        <h2>CAN/TWAI Configuration</h2>
      </div>
      
      <div class="panel-section">
        <div class="panel-section">
          <div class="section-header">
            <h3 class="panel-section-title">Protocol Settings</h3>
            <div class="status-badge ${t.enabled?"status-active":"status-inactive"}">
              ${t.enabled?"Enabled":"Disabled"}
            </div>
          </div>
          
          <form class="config-form" onsubmit=${async o=>{o.preventDefault();const i=new FormData(o.target),s={bitrate:parseInt(i.get("bitrate")||"500000"),enabled:i.get("enabled")==="on"};n("save-can-config",s)}}>
          <div class="form-group">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                name="enabled" 
                ${t.enabled?"checked":""}
              />
              <span>
                Enable CAN Bus
                <span class="label-tooltip">
                  <svg class="label-tooltip-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="16" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                  <span class="tooltip">Enable or disable CAN/TWAI bus</span>
                </span>
              </span>
            </label>
          </div>
          
          <div class="form-group">
            <label for="can-bitrate">
              Bitrate <span class="required">*</span>
              <span class="label-tooltip">
                <svg class="label-tooltip-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                <span class="tooltip">CAN bus bitrate in bits per second (bps)</span>
              </span>
            </label>
            <select id="can-bitrate" name="bitrate" required>
              <option value="125000" ${t.bitrate===125e3?"selected":""}>125 kbps</option>
              <option value="250000" ${t.bitrate===25e4?"selected":""}>250 kbps</option>
              <option value="500000" ${t.bitrate===5e5?"selected":""}>500 kbps</option>
              <option value="1000000" ${t.bitrate===1e6?"selected":""}>1 Mbps</option>
            </select>
          </div>
          
          <div class="config-actions">
            <button type="submit" class="primary-button" disabled=${!e.isConnected}>
              Save Settings
            </button>
          </div>
        </form>
      </div>
      
      <div class="panel-section">
        <div class="section-header">
          <h3 class="panel-section-title">Usage</h3>
        </div>
        
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Used by:</span>
            <span class="info-value">GVRET, OpenInverter, OVMS, DTC extensions</span>
          </div>
          <div class="info-item">
            <span class="info-label">Note:</span>
            <span class="info-value">Changes require device restart to take effect</span>
          </div>
        </div>
      </div>
      
      <div class="panel-section">
        <div class="section-header">
          <h3 class="panel-section-title">Hardware (from board.json)</h3>
        </div>
        
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">TX Pin:</span>
            <span class="info-value">${t.txPin!=null?"GPIO"+t.txPin:"Not configured"}</span>
          </div>
          <div class="info-item">
            <span class="info-label">RX Pin:</span>
            <span class="info-value">${t.rxPin!=null?"GPIO"+t.rxPin:"Not configured"}</span>
          </div>
        </div>
      </div>
      
      ${e.isConnected?"":html`
        <div class="panel-message">
          <p>Connect to device to configure CAN settings.</p>
        </div>
      `}
    </div>
  `}function Pn(e,n){e.isConnected&&!e.gpsDataLoaded&&!e.isLoadingGpsData&&n("load-gps-data");const t=e.gpsData||{},o=t.latitude!==void 0&&t.longitude!==void 0,i=37.3349,s=-122.009,c=o?t.latitude:i,r=o?t.longitude:s;return html`
    <div class="panel-container">
      <div class="panel-header">
        <h2>GPS Location</h2>
      </div>
      
      ${e.isLoadingGpsData?html`
        <div class="panel-loading">
          Loading GPS data...
        </div>
      `:html`
        <div class="panel-section">
          <div class="section-header">
            <h3 class="panel-section-title">${o?"Current Location":"Map Display"}</h3>
            <div class="status-badge ${o?"status-active":"status-inactive"}">
              ${o?"GPS Fix Acquired":"No GPS Fix"}
            </div>
          </div>
          
          <!-- Map Container (always shown) -->
          <div class="gps-map-container">
            ${o?"":html`
              <div style="margin-bottom: 0.5rem; color: #999; font-size: 0.9em;">
                Showing default location (Apple Park) - Waiting for GPS fix...
              </div>
            `}
            <iframe
              class="gps-map"
              width="100%"
              height="400"
              frameborder="0"
              scrolling="no"
              marginheight="0"
              marginwidth="0"
              src=${`https://www.openstreetmap.org/export/embed.html?bbox=${r-.01},${c-.01},${r+.01},${c+.01}&layer=mapnik&marker=${c},${r}`}
            >
            </iframe>
            <br/>
            <small>
              <a 
                href=${`https://www.openstreetmap.org/?mlat=${c}&mlon=${r}&zoom=15`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Larger Map
              </a>
            </small>
          </div>
            
            <!-- GPS Information Grid -->
            <div class="info-grid" style="margin-top: 1rem;">
              ${o?html`
                <div class="info-item">
                  <span class="info-label">Latitude:</span>
                  <span class="info-value info-mono">${t.latitude.toFixed(6)}°</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Longitude:</span>
                  <span class="info-value info-mono">${t.longitude.toFixed(6)}°</span>
                </div>
              `:html`
                <div class="info-item">
                  <span class="info-label">Latitude:</span>
                  <span class="info-value info-mono" style="color: #999;">${c.toFixed(6)}° (default)</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Longitude:</span>
                  <span class="info-value info-mono" style="color: #999;">${r.toFixed(6)}° (default)</span>
                </div>
              `}
              ${t.altitude!==void 0?html`
                <div class="info-item">
                  <span class="info-label">Altitude:</span>
                  <span class="info-value">${t.altitude.toFixed(1)} m</span>
                </div>
              `:""}
              ${t.satellites!==void 0?html`
                <div class="info-item">
                  <span class="info-label">Satellites:</span>
                  <span class="info-value">${t.satellites}</span>
                </div>
              `:""}
              ${t.speed!==void 0?html`
                <div class="info-item">
                  <span class="info-label">Speed:</span>
                  <span class="info-value">${t.speed.toFixed(1)} km/h</span>
                </div>
              `:""}
              ${t.heading!==void 0?html`
                <div class="info-item">
                  <span class="info-label">Heading:</span>
                  <span class="info-value">${t.heading.toFixed(1)}°</span>
                </div>
              `:""}
              ${t.date?html`
                <div class="info-item">
                  <span class="info-label">Date:</span>
                  <span class="info-value info-mono">${ro(t.date)}</span>
                </div>
              `:""}
              ${t.time?html`
                <div class="info-item">
                  <span class="info-label">Time:</span>
                  <span class="info-value info-mono">${ao(t.time)}</span>
                </div>
              `:""}
            </div>
            
            <!-- Google Maps Link -->
            <div class="config-actions" style="margin-top: 1rem;">
              <a 
                href=${`https://www.google.com/maps?q=${c},${r}`}
                target="_blank"
                rel="noopener noreferrer"
                class="primary-button"
                style="text-decoration: none; display: inline-block;"
              >
                Open in Google Maps
              </a>
            </div>
          </div>
          
          ${o?"":html`
            <div class="panel-section" style="margin-top: 1rem;">
              <div class="section-header">
                <h3 class="panel-section-title">GPS Status</h3>
              </div>
              <p class="info-description">
                GPS is enabled but no fix has been acquired yet. This can take 30-60 seconds for a cold start.
                Make sure the GPS antenna has a clear view of the sky.
              </p>
              ${t.satellites!==void 0?html`
                <div class="info-grid" style="margin-top: 1rem;">
                  <div class="info-item">
                    <span class="info-label">Satellites in View:</span>
                    <span class="info-value">${t.satellites}</span>
                  </div>
                </div>
              `:""}
            </div>
          `}
      `}
      
      ${e.isConnected?"":html`
        <div class="panel-message">
          <p>Connect to device to view GPS location data.</p>
        </div>
      `}
    </div>
  `}function ro(e){if(!e||e.length!==6)return e;const n=e.substring(0,2),t=e.substring(2,4),o="20"+e.substring(4,6);return`${n}/${t}/${o}`}function ao(e){if(!e)return e;const n=e.indexOf("."),t=n!==-1?e.substring(0,n):e;if(t.length!==6)return e;const o=t.substring(0,2),i=t.substring(2,4),s=t.substring(4,6);return`${o}:${i}:${s}`}function lo(e,n){e.isConnected&&!e.modemStatusLoaded&&!e.isLoadingModemStatus&&n("load-modem-status");const t=e.modemStatus||{},o=t.info||{},i=t.signal||{},s=t.ppp||{},c=i.dbm,r=co(c),a=uo(c),l=po(c);let d="Not detected",p="status-disconnected";return t.connected&&(s.connected?(d="PPP Active",p="status-ppp"):s.connecting?(d="PPP Connecting...",p="status-connecting"):(d="Connected (AT)",p="status-connected")),html`
    <div class="panel-container">
      <div class="panel-header">
        <h2>Modem</h2>
      </div>
      
      <!-- Connection Status -->
      <div class="panel-section">
        <div class="section-header">
          <h3 class="panel-section-title">Status</h3>
        </div>
        <div class="status-display">
          <span class="status-indicator ${p}"></span>
          <span class="status-text">${d}</span>
        </div>
        ${s.connected&&s.ip?html`
          <div class="ip-display">
            <span class="ip-label">IP Address:</span>
            <span class="ip-value">${s.ip}</span>
          </div>
        `:""}
      </div>
      
      <!-- Signal Strength -->
      <div class="panel-section">
        <div class="section-header">
          <h3 class="panel-section-title">Signal Strength</h3>
        </div>
        ${t.connected?html`
          <div class="signal-display">
            <div class="signal-bars">
              ${[1,2,3,4,5].map(u=>html`
                <div class="signal-bar ${u<=r?"active":""}" style="--bar-color: ${l}"></div>
              `)}
            </div>
            <div class="signal-info">
              ${c!=null&&c!==-999?html`
                <span class="signal-dbm" style="color: ${l}">${c} dBm</span>
                <span class="signal-quality">${a}</span>
              `:html`
                <span class="signal-unknown">Unknown</span>
              `}
            </div>
          </div>
          ${i.rssi!=null?html`
            <div class="signal-raw">
              <span>RSSI: ${i.rssi}</span>
              ${i.ber!=null?html`<span>BER: ${i.ber}</span>`:""}
            </div>
          `:""}
        `:html`
          <p class="no-data">Modem not connected</p>
        `}
      </div>
      
      <!-- Modem Info -->
      <div class="panel-section">
        <div class="section-header">
          <h3 class="panel-section-title">Modem Information</h3>
        </div>
        ${t.connected&&Object.keys(o).length>0?html`
          <div class="info-grid">
            ${o.manufacturer?html`
              <div class="info-row">
                <span class="info-label">Manufacturer</span>
                <span class="info-value">${o.manufacturer}</span>
              </div>
            `:""}
            ${o.model?html`
              <div class="info-row">
                <span class="info-label">Model</span>
                <span class="info-value">${o.model}</span>
              </div>
            `:""}
            ${o.revision?html`
              <div class="info-row">
                <span class="info-label">Revision</span>
                <span class="info-value">${o.revision}</span>
              </div>
            `:""}
            ${o.imei?html`
              <div class="info-row">
                <span class="info-label">IMEI</span>
                <span class="info-value mono">${o.imei}</span>
              </div>
            `:""}
            ${t.firmware?html`
              <div class="info-row">
                <span class="info-label">Firmware</span>
                <span class="info-value">${t.firmware}</span>
              </div>
            `:""}
          </div>
        `:html`
          <p class="no-data">${t.connected?"Loading...":"Modem not connected"}</p>
        `}
      </div>
      
      ${e.isConnected?"":html`
        <div class="panel-message">
          <p>Connect to device to view modem status.</p>
        </div>
      `}
    </div>
    
    <style>
      /* refresh-button uses global styles from main.css */
      
      .status-display {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 0;
      }
      
      .status-indicator {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: var(--text-secondary);
        opacity: 0.5;
      }
      
      .status-indicator.status-disconnected {
        background: var(--text-secondary);
        opacity: 0.5;
      }
      
      .status-indicator.status-connected {
        background: #f59e0b;
      }
      
      .status-indicator.status-ppp {
        background: #22c55e;
      }
      
      .status-indicator.status-connecting {
        background: var(--scheme-primary-light);
        animation: pulse 1.5s ease-in-out infinite;
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      
      .status-text {
        font-size: 14px;
        font-weight: 500;
      }
      
      .ip-display {
        display: flex;
        gap: 8px;
        font-size: 13px;
        padding-bottom: 12px;
      }
      
      .ip-label {
        color: var(--text-secondary);
      }
      
      .ip-value {
        font-family: 'CodeFont', monospace;
        color: var(--scheme-primary);
      }
      
      .signal-display {
        display: flex;
        align-items: center;
        gap: 20px;
        padding: 16px 0;
      }
      
      .signal-bars {
        display: flex;
        align-items: flex-end;
        gap: 4px;
        height: 32px;
      }
      
      .signal-bar {
        width: 8px;
        background: var(--bg-tertiary);
        border-radius: 2px;
        transition: all 0.3s;
      }
      
      .signal-bar:nth-child(1) { height: 20%; }
      .signal-bar:nth-child(2) { height: 40%; }
      .signal-bar:nth-child(3) { height: 60%; }
      .signal-bar:nth-child(4) { height: 80%; }
      .signal-bar:nth-child(5) { height: 100%; }
      
      .signal-bar.active {
        background: var(--bar-color, var(--scheme-primary));
      }
      
      .signal-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      
      .signal-dbm {
        font-size: 18px;
        font-weight: 600;
        font-family: 'CodeFont', monospace;
      }
      
      .signal-quality {
        font-size: 12px;
        color: var(--text-secondary);
      }
      
      .signal-unknown {
        color: var(--text-secondary);
        opacity: 0.6;
        font-style: italic;
      }
      
      .signal-raw {
        display: flex;
        gap: 16px;
        font-size: 12px;
        color: var(--text-secondary);
        opacity: 0.6;
        padding-bottom: 12px;
      }
      
      .info-grid {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 8px 0;
      }
      
      .info-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 6px 0;
        border-bottom: 1px solid var(--border-color);
      }
      
      .info-row:last-child {
        border-bottom: none;
      }
      
      .info-label {
        font-size: 13px;
        color: var(--text-secondary);
      }
      
      .info-value {
        font-size: 13px;
        color: var(--text-primary);
      }
      
      .info-value.mono {
        font-family: 'CodeFont', monospace;
      }
      
      .no-data {
        color: var(--text-secondary);
        opacity: 0.6;
        font-style: italic;
        padding: 16px 0;
      }
    </style>
  `}function co(e){return e==null||e===-999?0:e>=-70?5:e>=-80?4:e>=-90?3:e>=-100?2:e>=-110?1:0}function uo(e){return e==null||e===-999?"Unknown":e>=-70?"Excellent":e>=-80?"Good":e>=-90?"Fair":e>=-100?"Poor":"Very Poor"}function po(e){return e==null||e===-999?"var(--text-secondary)":e>=-70||e>=-80?"#22c55e":e>=-90||e>=-100?"#f59e0b":"#ef4444"}function fo(e,n){const o=e.boardConfig?.hardware?.sdcard;e.isConnected&&!e.sdcardConfigLoaded&&!e.isLoadingSdcardConfig&&n("load-sdcard-config"),o&&e.isConnected&&!e.sdcardInfo&&!e.isLoadingSdcardInfo&&n("sdcard-get-info");const i=e.sdcardConfig||{mountPoint:"/sd",autoMount:!1};return e.isConnected?o?html`
    <div class="panel-container">
      <div class="panel-header">
        <h2>SD Card Configuration</h2>
        ${e.sdcardInfo&&!e.sdcardInfo.error?html`
          <button 
            class="refresh-button" 
            onclick=${()=>n("sdcard-unmount")}
            disabled=${!e.isConnected||e.isUnmountingSDCard}
            title="Unmount SD Card"
          >
            ${e.isUnmountingSDCard?"Unmounting...":"Unmount"}
          </button>
        `:html`
          <button 
            class="refresh-button" 
            onclick=${()=>n("sdcard-mount")}
            disabled=${!e.isConnected}
            title="Mount SD Card"
          >
            Mount
          </button>
        `}
      </div>
      
      ${go(o)}
      
      <div class="panel-section">
        <div class="section-header">
          <h3 class="panel-section-title">SD Card Settings</h3>
        </div>
        
        <form class="config-form" onsubmit=${async s=>{s.preventDefault();const c=new FormData(s.target),r={mountPoint:c.get("mount_point")||"/sd",autoMount:c.get("auto_mount")==="on"};n("save-sdcard-config",r)}}>
          <div class="form-group">
            <label for="sdcard-mount-point">
              Mount Point <span class="required">*</span>
              <span class="label-tooltip">
                ${w.renderIcon("info-circle",{className:"label-tooltip-icon",size:16})}
                <span class="tooltip">Filesystem mount point path (e.g., /sd)</span>
              </span>
            </label>
            <input 
              type="text" 
              id="sdcard-mount-point"
              name="mount_point" 
              value=${i.mountPoint||"/sd"}
              required
              pattern="^/[a-zA-Z0-9_\-/]*$"
              placeholder="/sd"
            />
          </div>
          
          <div class="form-group">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                name="auto_mount" 
                ${i.autoMount?"checked":""}
              />
              <span>
                Auto-mount on boot
                <span class="label-tooltip">
                  <svg class="label-tooltip-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="16" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                  <span class="tooltip">Automatically mount SD card when device boots</span>
                </span>
              </span>
            </label>
          </div>
          
          <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 20px;">
            <button type="submit" class="scriptos-update-btn">
              Save Settings
            </button>
          </div>
        </form>
      </div>
      
      ${e.sdcardInfo?html`
        <div class="panel-section">
          <div class="section-header">
            <h3 class="panel-section-title">
              ${e.sdcardInfo.error?"SD Card Status":"Storage Information"}
            </h3>
          </div>
          
          ${e.sdcardInfo.error?html`
            <div style="padding: 16px; background: var(--bg-error); border-radius: 4px; border: 1px solid #dc3545; color: var(--text-error);">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                ${w.renderIcon("alert-circle",{size:20})}
                <strong>Not Mounted</strong>
              </div>
              <div style="font-size: 14px;">${e.sdcardInfo.error}</div>
              <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(220, 53, 69, 0.3); font-size: 13px;">
                Click the <strong>Mount</strong> button above to mount the SD card.
              </div>
            </div>
          `:html`
            <div style="padding: 16px; background: var(--bg-secondary); border-radius: 4px; border: 1px solid var(--border-color);">
              ${e.sdcardInfo.totalSize!==void 0?html`
                <div style="margin-bottom: 8px;">
                  <span style="color: var(--text-secondary);">Total Size: </span>
                  <span style="color: var(--text-primary); font-weight: 600;">${Ue(e.sdcardInfo.totalSize)}</span>
                </div>
              `:""}
              ${e.sdcardInfo.freeSize!==void 0?html`
                <div style="margin-bottom: 8px;">
                  <span style="color: var(--text-secondary);">Free Space: </span>
                  <span style="color: var(--text-primary); font-weight: 600;">${Ue(e.sdcardInfo.freeSize)}</span>
                </div>
              `:""}
              ${e.sdcardInfo.usedSize!==void 0?html`
                <div style="margin-bottom: 8px;">
                  <span style="color: var(--text-secondary);">Used Space: </span>
                  <span style="color: var(--text-primary); font-weight: 600;">${Ue(e.sdcardInfo.usedSize)}</span>
                </div>
              `:""}
              ${e.sdcardInfo.mountPoint?html`
                <div>
                  <span style="color: var(--text-secondary);">Mount Point: </span>
                  <span style="color: var(--text-primary); font-weight: 600;">${e.sdcardInfo.mountPoint}</span>
                </div>
              `:""}
            </div>
          `}
        </div>
      `:e.isLoadingSdcardInfo?html`
        <div class="panel-section">
          <div style="text-align: center; padding: 20px; color: var(--text-secondary);">
            ${w.renderIcon("loader",{size:24,className:"spinner"})}
            <div style="margin-top: 8px;">Loading storage information...</div>
          </div>
        </div>
      `:""}
    </div>
  `:html`
      <div class="panel-container">
        <div class="panel-header">
          <h2>SD Card Configuration</h2>
        </div>
        
        <div class="panel-section">
          <div style="text-align: center; padding: 40px 20px; color: var(--text-secondary);">
            <div style="font-size: 48px; margin-bottom: 16px;">📇</div>
            <h3 style="margin-bottom: 8px; color: var(--text-primary);">No SD Card Hardware Detected</h3>
            <p>This board does not have SD card hardware configured.</p>
          </div>
        </div>
      </div>
    `:html`
      <div class="panel-container">
        <div class="panel-header">
          <h2>SD Card Configuration</h2>
        </div>
        
        <div class="panel-section">
          <div style="text-align: center; padding: 40px 20px; color: var(--text-secondary);">
            <div style="font-size: 48px; margin-bottom: 16px;">📇</div>
            <h3 style="margin-bottom: 8px; color: var(--text-primary);">No SD Card Hardware Detected</h3>
            <p>This board does not have SD card hardware configured.</p>
            <p style="margin-top: 12px; font-size: 14px;">Connect to a device to check board configuration.</p>
          </div>
        </div>
      </div>
    `}function go(e){if(!e)return"";const n=e.pins||{},t=e.power_control||{},o=e.mode||"SD";let i=1;n.d3!==void 0?i=4:n.d0!==void 0?i=1:o==="SD"&&(i=4);const s=o==="SD"?"SDMMC":o;return html`
    <div class="panel-section">
      <div class="section-header">
        <h3 class="panel-section-title">Board Hardware Configuration</h3>
      </div>
      
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">Mode:</span>
          <span class="info-value">${s}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Width:</span>
          <span class="info-value">${i}-bit</span>
        </div>
      </div>
      
      <div style="margin-top: 12px;">
        <details>
          <summary style="cursor: pointer; color: var(--text-secondary); font-size: 14px;">
            Pin Configuration
          </summary>
          <div class="info-grid" style="margin-top: 8px;">
            ${n.cmd!==void 0?html`
              <div class="info-item">
                <span class="info-label">CMD:</span>
                <span class="info-value info-mono">GPIO ${n.cmd}</span>
              </div>
            `:""}
            ${n.clk!==void 0?html`
              <div class="info-item">
                <span class="info-label">CLK:</span>
                <span class="info-value info-mono">GPIO ${n.clk}</span>
              </div>
            `:""}
            ${n.d0!==void 0?html`
              <div class="info-item">
                <span class="info-label">D0:</span>
                <span class="info-value info-mono">GPIO ${n.d0}</span>
              </div>
            `:""}
            ${n.d1!==void 0?html`
              <div class="info-item">
                <span class="info-label">D1:</span>
                <span class="info-value info-mono">GPIO ${n.d1}</span>
              </div>
            `:""}
            ${n.d2!==void 0?html`
              <div class="info-item">
                <span class="info-label">D2:</span>
                <span class="info-value info-mono">GPIO ${n.d2}</span>
              </div>
            `:""}
            ${n.d3!==void 0?html`
              <div class="info-item">
                <span class="info-label">D3:</span>
                <span class="info-value info-mono">GPIO ${n.d3}</span>
              </div>
            `:""}
            ${t.pin!==void 0?html`
              <div class="info-item">
                <span class="info-label">Power:</span>
                <span class="info-value info-mono">GPIO ${t.pin} ${t.active_low?"(Active Low)":"(Active High)"}</span>
              </div>
            `:""}
          </div>
        </details>
      </div>
    </div>
  `}function Ue(e){if(!e||e===0)return"0 B";const n=1024,t=["B","KB","MB","GB"],o=Math.floor(Math.log(e)/Math.log(n));return Math.round(e/Math.pow(n,o)*100)/100+" "+t[o]}const ho="https://api.github.com/repos/jetpax/pyDirect/releases",mo=["https://api.codetabs.com/v1/proxy?quest=","https://api.allorigins.win/raw?url=","https://corsproxy.io/?"],vo=import.meta?.env?.DEV||window.location.hostname==="localhost";function yo(e){return vo&&e.startsWith("https://github.com/")?e.replace("https://github.com","/github-releases"):e}const wo={"ESP32-S3":"ESP32_S3","ESP32-P4":"ESP32_P4","ESP32-S2":"ESP32_S2","ESP32-C3":"ESP32_C3","ESP32-C6":"ESP32_C6",ESP32:"ESP32"};async function bo(){try{const e=await fetch(ho);if(!e.ok)throw new Error(`GitHub API error: ${e.status}`);return(await e.json()).filter(t=>!t.draft).map(t=>({id:t.id,name:t.name||t.tag_name,tag:t.tag_name,published:t.published_at,prerelease:t.prerelease,assets:t.assets.filter(o=>o.name.startsWith("pyDirect-")&&o.name.endsWith("-merged.bin")).map(o=>({name:o.name,size:o.size,downloadUrl:o.browser_download_url}))})).filter(t=>t.assets.length>0)}catch(e){throw console.error("[firmware-flasher] Failed to fetch releases:",e),e}}async function Co(){const e=await bo();return e.find(t=>!t.prerelease)||e[0]||null}function xo(e,n){let t=e.replace(/_/g," ");if(n){const o=(n/1024/1024).toFixed(1);t+=` (${o} MB)`}return t}function ht(e,n){const t=wo[n];return t?e.assets.filter(i=>{const s=i.name.match(/^pyDirect-(.+)-merged\.bin$/);if(!s)return!1;const c=s[1];return!!(c.startsWith(t)||n==="ESP32-S3"&&(c==="RetroVMS_Mini"||c.includes("S3"))||n==="ESP32-P4"&&c.includes("P4"))}).map(i=>{const s=i.name.match(/^pyDirect-(.+)-merged\.bin$/),c=s?s[1]:i.name;return{...i,productId:c,displayName:xo(c,i.size)}}):(console.warn(`[firmware-flasher] No firmware mapping for chip: ${n}`),[])}function So(e,n,t=null){const o=ht(e,n);if(o.length===0)return null;let i=o[0];if(t&&n==="ESP32-S3"&&parseInt(t)>=16){const c=o.find(r=>r.productId==="ESP32_S3_16MB");c&&(i=c)}return i}async function Eo(e,n=()=>{}){let t;const o=yo(e);o!==e&&console.log("[firmware-flasher] Using Vite dev proxy for download");try{if(t=await fetch(o),!t.ok)throw new Error(`HTTP ${t.status}`)}catch(s){console.log("[firmware-flasher] Direct download failed:",s.message,"- trying CORS proxies");let c;for(const r of mo)try{if(console.log("[firmware-flasher] Trying proxy:",r),t=await fetch(r+encodeURIComponent(e)),t.ok){console.log("[firmware-flasher] Proxy succeeded:",r);break}c=new Error(`HTTP ${t.status}`)}catch(a){c=a,console.log("[firmware-flasher] Proxy failed:",r,a.message)}if(!t||!t.ok)throw console.error("[firmware-flasher] All proxies failed"),new Error(`Failed to fetch firmware: ${c?.message||"All proxies failed"}`)}try{const s=t.headers.get("content-length"),c=s?parseInt(s,10):0;if(console.log(`[firmware-flasher] Content-Length: ${s||"unknown"}, starting download...`),!t.body){console.log("[firmware-flasher] Using non-streaming fallback");const f=await t.arrayBuffer();return n(100),f}const r=t.body.getReader(),a=[];let l=0,d=Date.now();for(;;){const{done:f,value:g}=await r.read();if(f)break;if(a.push(g),l+=g.length,c>0)n(Math.round(l/c*100));else if(Date.now()-d>500){console.log(`[firmware-flasher] Downloaded ${(l/1024/1024).toFixed(1)} MB...`),d=Date.now();const v=10+l/1e6%80;n(Math.round(v))}}const p=new Uint8Array(l);let u=0;for(const f of a)p.set(f,u),u+=f.length;return console.log(`[firmware-flasher] Downloaded ${l} bytes (${(l/1024/1024).toFixed(1)} MB)`),n(100),p.buffer}catch(s){throw console.error("[firmware-flasher] Download error:",s),s}}let E=null,D=null,Pe="",Ne="",ie=!0,je=null,he=null,m={view:"connect",deviceInfo:null,releases:[],selectedFirmware:null,flashProgress:0,wifiNetworks:[],selectedNetwork:null,credentials:null,logs:[{message:"> Ready",type:"info",timestamp:new Date().toLocaleTimeString()}],isFlashing:!1,isScanning:!1,terminalCollapsed:!1,reblessComplete:!1,reblessHostname:null,flashStep:"select",currentRelease:null,firmwareOptions:[],flashComplete:!1};function b(e,n="info"){m.logs.push({message:`> ${e}`,type:n,timestamp:new Date().toLocaleTimeString()}),m.logs.length>100&&(m.logs=m.logs.slice(-100)),T()}function nn(){m.logs=[]}function T(){document.dispatchEvent(new CustomEvent("firmware-panel-update"))}async function tn(e){await e.setSignals({dataTerminalReady:!1,requestToSend:!1}),await new Promise(n=>setTimeout(n,50)),await e.setSignals({dataTerminalReady:!1,requestToSend:!0}),await new Promise(n=>setTimeout(n,100)),await e.setSignals({dataTerminalReady:!1,requestToSend:!1}),await new Promise(n=>setTimeout(n,100))}async function on(){D&&(await D.disconnect(),D=null,await new Promise(r=>setTimeout(r,100))),await E.close(),await new Promise(r=>setTimeout(r,100)),await E.open({baudRate:115200}),b("Resetting device..."),await tn(E),b("Waiting for System booting...");const e=E.readable.getReader(),n=new TextDecoder;let t="";const o=Date.now();let i=!1,s=null;const c=[{pattern:/invalid header: 0x[0-9a-fA-F]+/i,message:"Invalid firmware header - incompatible image for this device"},{pattern:/flash read err/i,message:"Flash read error - firmware may be corrupted"},{pattern:/ets_main\.c/i,message:"Boot failure - firmware not recognized"},{pattern:/rst:0x10.*boot:0x[0-9a-f]+.*invalid/i,message:"Boot loop detected - firmware incompatible"}];for(;Date.now()-o<8e3;){const{value:r,done:a}=await e.read();if(a)break;if(r){t+=n.decode(r);for(const{pattern:l,message:d}of c)if(l.test(t)){s=d,console.log("[transitionToREPL] Boot error detected:",t);break}if(s)break;if(t.includes("System booting...")){i=!0,b("System booting detected","success"),e.releaseLock();const l=E.writable.getWriter();await l.write(new Uint8Array([3,3,3])),await new Promise(d=>setTimeout(d,30)),await l.write(new Uint8Array([3,3])),l.releaseLock(),b("Interrupting to enter REPL...");break}}}if(!i)try{e.releaseLock()}catch{}if(s)return b(s,"error"),{success:!1,error:s,bootOutput:t};if(!i){b("No boot signature detected","error");const r=E.writable.getWriter();return await r.write(new Uint8Array([3,3])),r.releaseLock(),{success:!1,error:"No boot signature from device - firmware may be incompatible",bootOutput:t}}await new Promise(r=>setTimeout(r,200)),b("Entering REPL mode...");try{const r=E.readable.getReader(),a=setTimeout(()=>r.cancel(),500);try{for(;;){const{value:l,done:d}=await r.read();if(d)break}}catch{}clearTimeout(a),r.releaseLock()}catch(r){console.log("[DRAIN] Error:",r)}return b("REPL ready"),{success:!0}}function mt({variant:e="",icon:n,title:t,subtitle:o,body:i,buttons:s}){return new Promise(c=>{const r=document.createElement("div");r.className="fw-modal-overlay active",r.innerHTML=`
      <div class="fw-styled-modal">
        <div class="fw-styled-modal-header ${e?`fw-styled-modal-header--${e}`:""}">
          <div class="fw-styled-modal-icon">${n}</div>
          <h2>${t}</h2>
          <p>${o}</p>
        </div>
        <div class="fw-styled-modal-content">
          <div class="fw-styled-modal-card">${i}</div>
          ${s.map(a=>`<button class="${a.class}" data-id="${a.id}">${a.icon||""}${a.label}</button>`).join("")}
        </div>
      </div>`,document.body.appendChild(r),s.forEach(a=>{r.querySelector(`[data-id="${a.id}"]`).addEventListener("click",()=>{r.remove(),c(a.id)})})})}async function sn(e){await mt({variant:"danger",icon:'<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',title:"Boot Failure Detected",subtitle:"Incompatible firmware image",body:`<p><strong>${e}</strong></p><p>The device could not boot. This typically happens when the wrong firmware variant is flashed.</p>`,buttons:[{id:"reflash",class:"fw-styled-modal-btn-primary",icon:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" style="margin-right:0.5rem"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>',label:"Return to Bootloader"},{id:"close",class:"fw-styled-modal-btn-cancel",label:"Close"}]})==="reflash"&&(b("Returning to bootloader mode..."),b('Ready for re-flash. Select "Onboard New Device" to flash correct firmware.',"success")),m.view="scenarios",T()}async function j(e,n,t=15e3,o=!0){const i=e.writable.getWriter();try{const s=n.split(`
`).filter(g=>g.trim().length>0),c=Math.min(...s.map(g=>{const h=g.match(/^(\s*)/);return h?h[1].length:0})),r=s.map(g=>g.slice(c)).join(`
`);o&&(await i.write(new Uint8Array([1])),await new Promise(g=>setTimeout(g,100)));const a=new TextEncoder().encode(r),l=64;for(let g=0;g<a.length;g+=l){const h=a.slice(g,Math.min(g+l,a.length));await i.write(h),await new Promise(v=>setTimeout(v,10))}await new Promise(g=>setTimeout(g,50)),await i.write(new Uint8Array([4])),i.releaseLock();const d=e.readable.getReader();let p="";const u=new TextDecoder,f=Date.now();for(;Date.now()-f<t;){const{value:g,done:h}=await d.read();if(h||g&&(p+=u.decode(g),p.includes("OK")&&p.endsWith(">")))break}return d.releaseLock(),p}catch(s){try{i.releaseLock()}catch{}throw s}}async function $o(e){je||(je=(await R(()=>import("./tasmota-esptool.bundle-CejzY9o0.js"),[])).ESPLoader,console.log("[firmware-panel] ESPLoader module loaded"));const n={log:r=>console.log(r),debug:r=>console.debug(r),error:r=>console.error(r)},t=new je(e,n);await t.initialize();const o=t.chipName||"Unknown";console.log("Connected to chip:",o);const i=t.macAddr(),s=Array.isArray(i)&&i.length>=6?i.slice(0,6).map(r=>r.toString(16).padStart(2,"0")).join(":"):"Unknown";let c="Unknown";try{console.log("Running stub...");const r=await t.runStub();await r.detectFlashSize(),c=r.flashSize||"Unknown",console.log("Flash size detected:",c),D=r}catch(r){console.warn("Stub/Feature detection failed:",r),c="Detection Failed",D=t}return{chipName:o,flashSizeMB:c,macAddress:s}}async function ko(){try{D&&(await D.disconnect(),D=null),E&&(await E.close(),E=null)}catch(e){console.log("Cleanup previous connection:",e)}try{nn(),b("Requesting serial port..."),E=await navigator.serial.requestPort({}),await E.open({baudRate:115200}),b("Port opened"),b("Detecting hardware...");const e=await $o(E);Pe=e.chipName,Ne=e.macAddress,b(`Detected: ${Pe}`),b(`MAC: ${Ne}`),m.deviceInfo={chipName:Pe,mac:Ne,flashSize:e.flashSizeMB},ie=!0,m.view="scenarios",b("Device connected - select an action"),he&&(he.connectionMode="usb"),T()}catch(e){console.error("[firmware-panel]",e),b(`Error: ${e.message}`,"error");try{E&&await E.close()}catch{}E=null,D=null,T()}}async function _o(){try{if(D&&(await D.disconnect(),D=null),E){try{await tn(E)}catch(e){console.log("[handleDisconnect] Reset error:",e)}await E.close(),E=null}}catch{}m.view="connect",m.deviceInfo=null,Pe="",Ne="",ie=!0,he&&(he.connectionMode=null),nn(),b("Disconnected"),T()}async function To(){try{if(D&&(await D.disconnect(),D=null),E){try{await tn(E)}catch(e){console.log("[resetAndClosePort] Reset error:",e)}await E.close(),E=null}}catch(e){console.log("[resetAndClosePort] Error:",e)}}function Ce(e){b(`Selected: ${e}`),m.view=e,e==="new-device"?Po():e==="forgot-credentials"?Oo():e==="change-wifi"?vt():e==="re-provision"&&Fo(),T()}function Ae(){m.flashStep="select",m.flashComplete=!1,m.flashProgress=0,m.view="scenarios",T()}async function Po(){try{b("Loading firmware options..."),m.flashStep="select",m.firmwareOptions=[],T();const e=await Co();if(!e){b("No firmware releases found","error");return}m.currentRelease=e,b(`Found release: ${e.name}`);const n=m.deviceInfo?.chipName?.includes("ESP32-S3")?"ESP32-S3":m.deviceInfo?.chipName?.includes("ESP32-P4")?"ESP32-P4":m.deviceInfo?.chipName?.includes("ESP32-C3")?"ESP32-C3":m.deviceInfo?.chipName?.includes("ESP32")?"ESP32":null;if(!n){b("Unknown chip family - cannot select firmware","error");return}const t=ht(e,n);if(t.length===0){b(`No firmware available for ${n}`,"error");return}m.firmwareOptions=t;const o=m.deviceInfo?.flashSize,i=So(e,n,o);m.selectedFirmware=i||t[0],b(`Found ${t.length} firmware option(s)`),b(`Selected: ${m.selectedFirmware.displayName||m.selectedFirmware.name}`),T()}catch(e){b(`Error: ${e.message}`,"error"),T()}}async function No(){if(!D){b("Error: No device connected","error");return}if(!m.selectedFirmware){b("Error: No firmware selected","error");return}if(!confirm(`⚠️ FLASH FIRMWARE ⚠️

This will ERASE all data on the device and install:
${m.selectedFirmware.name}

Any existing scripts, settings, and certificates will be PERMANENTLY DELETED.

Are you sure you want to continue?`)){b("Flash cancelled by user");return}try{m.flashStep="downloading",m.flashProgress=0,T(),b(`Downloading ${m.selectedFirmware.name}...`);const n=await Eo(m.selectedFirmware.downloadUrl,t=>{m.flashProgress=t,t%20===0&&b(`Download: ${t}%`),T()});b(`Downloaded ${(n.byteLength/1024/1024).toFixed(1)} MB`),m.flashStep="flashing",m.flashProgress=0,T(),b("Syncing with device...");try{await D.sync()}catch{await D.initialize()}b("Flashing firmware...");try{await D.flashData(n,(t,o)=>{const i=Math.floor(t/o*100);m.flashProgress=i,i%10===0&&b(`Progress: ${i}%`),T()},0,!0)}catch(t){if((t?.message||String(t)).includes("Timed out")&&m.flashProgress>=95)b("Flash complete (device rebooted)");else throw t}b("✓ Flash complete!","success");try{await D.disconnect()}catch{}D=null,m.flashStep="complete",m.flashComplete=!0,m.terminalCollapsed=!0,T()}catch(n){console.error("[firmware-panel] Flash error:",n),b(`Flash failed: ${n.message}`,"error"),m.flashStep="select";try{E&&await E.close()}catch{}E=null,D=null,T()}}async function Io(){b("Proceeding to WiFi setup..."),m.flashStep="select",m.flashComplete=!1,m.flashProgress=0,m.view="change-wifi";try{if(!E){b("Please reconnect device"),m.view="connect",T();return}vt()}catch(e){b(`Error: ${e.message}`,"error")}T()}async function Oo(){try{b("Reading credentials from device...");const e=await on();if(!e.success){await sn(e.error);return}const t=(await j(E,`
import json
from lib.sys import settings
hostname = settings.get("device.hostname", "unknown")
password = settings.get("server.webrepl_password", "not set")
ssid = settings.get("wifi.ssid", "not set")
print("CREDS:" + json.dumps({"h": hostname, "p": password, "s": ssid}))
`)).match(/CREDS:(\{.*\})/);if(t){const o=JSON.parse(t[1]);m.credentials={hostname:o.h+".local",password:o.p,ssid:o.s},b(`Found: ${o.h}.local`,"success")}else throw new Error("Could not read settings - device may need firmware");T()}catch(e){b(`Error: ${e.message}`,"error"),T()}}async function vt(){nn();try{let r=function(a){return new Promise((l,d)=>{const p=document.createElement("div");p.className="fw-modal-overlay active",p.innerHTML=`
          <div class="fw-modal">
            <h3>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 0.5rem;">
                <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
                <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
                <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
                <circle cx="12" cy="20" r="1"/>
              </svg>
              Select WiFi Network
            </h3>
            <div class="fw-network-modal-list">
              ${a.map((h,v)=>`
                <button class="fw-modal-network-item" data-index="${v}">
                  <span class="fw-network-name">${h.ssid}</span>
                  <span class="fw-network-info">
                    ${h.sec?'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>':""}
                    <span class="fw-network-rssi">${h.rssi} dBm</span>
                  </span>
                </button>
              `).join("")}
            </div>
            <button class="fw-modal-cancel">Cancel</button>
          </div>
        `,document.body.appendChild(p);const u=h=>{const v=h.target.closest(".fw-modal-network-item");if(v){const S=parseInt(v.dataset.index);g(),l(S)}},f=()=>{g(),d(new Error("Setup cancelled"))},g=()=>{p.remove()};p.querySelector(".fw-network-modal-list").addEventListener("click",u),p.querySelector(".fw-modal-cancel").addEventListener("click",f)})};b("Connecting to REPL...");const e=await on();if(!e.success){await sn(e.error);return}b("Scanning for WiFi networks...");const t=(await j(E,`
import network
import json
wlan = network.WLAN(network.STA_IF)
wlan.active(True)
raw = wlan.scan()
# Deduplicate by SSID, keeping strongest signal
nets = {}
for ssid, bssid, channel, rssi, authmode, hidden in raw:
    s = ssid.decode()
    if s and (s not in nets or rssi > nets[s][0]):
        nets[s] = (rssi, authmode)
# Convert to sorted list (by rssi descending)
result = [{"ssid": k, "rssi": v[0], "sec": v[1] != 0} for k, v in nets.items()]
result.sort(key=lambda x: x["rssi"], reverse=True)
print("JSON:" + json.dumps(result))
`)).match(/JSON:(\[.*\])/);if(!t)throw new Error("Failed to parse network scan - no JSON found");let o;try{o=JSON.parse(t[1])}catch(a){throw new Error("Failed to parse network JSON: "+a.message)}if(o.length===0)throw new Error("No WiFi networks found");b(`Found ${o.length} networks`);let i=!1,s=null,c=null;for(;!i;){const a=await r(o),l=o[a],d=prompt(`Enter password for "${l.ssid}":`);if(d===null)continue;b(`Connecting to "${l.ssid}"...`);const u=(await j(E,`
import time
try:
    wlan.disconnect()
except:
    pass
time.sleep(0.3)
wlan.connect('${l.ssid}', '${d}')
for i in range(20):
    if wlan.isconnected():
        ip = wlan.ifconfig()[0]
        print(f"CONNECTED:{ip}")
        break
    time.sleep(0.5)
else:
    print("FAILED:timeout")
`,15e3,!1)).match(/CONNECTED:(\d+\.\d+\.\d+\.\d+)/);if(u){s=u[1],i=!0,b(`Connected! IP: ${s}`),b("Saving settings...");const g=`pydirect-${m.deviceInfo?.mac?m.deviceInfo.mac.replace(/:/g,"").slice(-4).toLowerCase():"xxxx"}`;await j(E,`
from lib.sys import settings
settings.set("wifi.ssid", "${l.ssid}")
settings.set("wifi.password", "${d}")
settings.set("server.https_enabled", True)
settings.set("device.hostname", "${g}")
settings.save()
print("SETTINGS_OK")
`,5e3,!1),b(`Settings saved (hostname: ${g})`,"success"),m.view="scenarios",T();return}else if(b("Connection failed"),!confirm(`WiFi connection failed. Wrong password?

Click OK to try again, or Cancel to abort.`))throw new Error("Connection cancelled")}}catch(e){b(`Error: ${e.message}`,"error"),T()}}async function Fo(){try{b("Starting re-provisioning...");const e=await on();if(!e.success){await sn(e.error);return}b("Reading device settings...");const t=(await j(E,`
from lib.sys import settings
print("HOST:" + settings.get("device.hostname", "pydirect-xxxx"))
`)).match(/HOST:(.+)/),o=t?t[1].trim():"pydirect-new";b(`Generating new certificate for ${o}.local...`),window.forge||await new Promise((a,l)=>{const d=document.createElement("script");d.src="https://cdn.jsdelivr.net/npm/node-forge@1.3.1/dist/forge.min.js",d.onload=a,d.onerror=l,document.head.appendChild(d)});const i=o+".local",{certPem:s,keyPem:c}=Do(i);b("Installing new certificate..."),await Ro(E,s,c),b("Enabling setup mode..."),await j(E,`
from lib.sys import settings
settings.set("setup_mode", True)
settings.save()
print("SETUP_MODE_SET")
`,5e3,!1),b("Resetting device..."),await j(E,"import machine; machine.reset()",1e3,!1);try{await E.close()}catch{}E=null,b("Device is restarting and connecting to WiFi...","success");const r=`https://${i}/setup`;Ao(i,r)}catch(e){b(`Error: ${e.message}`,"error"),T()}}async function Ao(e,n){const t=await mt({icon:'<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>',title:"Accept Security Warning",subtitle:"Your device has new certificates",body:'<p>Your device is <strong>restarting</strong> and connecting to WiFi.</p><p>When the browser opens, click <strong>"Advanced"</strong> → <strong>"Proceed"</strong> to trust your device.</p>',buttons:[{id:"connect",class:"fw-styled-modal-btn-primary",icon:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" style="margin-right:0.5rem"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',label:`Connect to ${e}`},{id:"cancel",class:"fw-styled-modal-btn-cancel",label:"Cancel"}]});m.view="scenarios",m.reblessComplete=!1,T(),t==="connect"&&window.open(n,"_blank")}function Do(e,n=10){const t=forge.pki.rsa.generateKeyPair(2048),o=forge.pki.createCertificate();o.publicKey=t.publicKey,o.serialNumber="01",o.validity.notBefore=new Date,o.validity.notAfter=new Date,o.validity.notAfter.setFullYear(o.validity.notBefore.getFullYear()+n);const i=[{name:"commonName",value:e}];return o.setSubject(i),o.setIssuer(i),o.setExtensions([{name:"subjectAltName",altNames:[{type:2,value:e}]}]),o.sign(t.privateKey,forge.md.sha256.create()),{certPem:forge.pki.certificateToPem(o),keyPem:forge.pki.privateKeyToPem(t.privateKey)}}async function Ro(e,n,t){b("Creating /certs directory..."),await j(e,`
import os
try:
    os.mkdir('/certs')
except OSError:
    pass
print('DIR_OK')
`,3e3,!1),b("Writing certificate...");const o=btoa(n);await j(e,`
import binascii
with open('/certs/servercert.pem', 'wb') as f:
    f.write(binascii.a2b_base64('${o}'))
print('CERT_OK')
`,5e3,!1),b("Writing private key...");const i=btoa(t);await j(e,`
with open('/certs/prvtkey.pem', 'wb') as f:
    f.write(binascii.a2b_base64('${i}'))
print('KEY_OK')
`,5e3,!1),b("Certificates installed!")}function Lo(e,n){he=e;const t=m.view;return C`
    <div class="firmware-panel">
      ${t==="connect"?Mo():""}
      ${t==="scenarios"?Bo():""}
      ${t==="new-device"?zo():""}
      ${t==="forgot-credentials"?Uo():""}
      ${t==="change-wifi"?jo():""}
      ${t==="re-provision"?Wo():""}
      
      ${Ho()}
    </div>
  `}function Y(e="Connected",n="fw-status-success"){const t=m.deviceInfo;return t?C`
    <div class="fw-device-info-compact">
      ${w.renderIcon("cpu",{className:"fw-device-icon"})}
      <span class="fw-device-name">${t.chipName}</span>
      <span class="fw-status-badge ${n}">${e}</span>
    </div>
  `:""}function Mo(e,n){return C`
    <div class="fw-view active">
      <div class="fw-welcome">
        <h2>${y("firmware.deviceSetup")}</h2>
        <p>${y("firmware.deviceSetupHint")}</p>
      </div>
      
      <button class="fw-btn fw-btn-primary" onclick=${ko}>
        ${w.renderIcon("usb",{className:"fw-btn-icon",size:20})}
        ${y("firmware.connectDevice")}
      </button>
      
      <div class="fw-hint-box">
        ${w.renderIcon("bulb",{className:"fw-hint-icon"})}
        <span>${y("firmware.connectHint")}</span>
      </div>
    </div>
  `}function Bo(e,n){const t=y(ie?"firmware.readyToFlash":"firmware.pyDirectDetected");return C`
    <div class="fw-view active">
      ${Y(t,ie?"fw-status-warning":"fw-status-success")}
      
      <div class="fw-scenario-grid">
        <div class="fw-scenario-card ${ie?"fw-scenario-highlighted":""}" 
             onclick=${()=>Ce("new-device")}>
          <div class="fw-scenario-icon">
            ${w.renderIcon("cpu",{className:"",size:28})}
          </div>
          <h3>${y("firmware.newDevice")}</h3>
          <p>${y("firmware.newDeviceDesc")}</p>
        </div>
        
        <div class="fw-scenario-card ${ie?"":"fw-scenario-highlighted"}"
             onclick=${()=>Ce("forgot-credentials")}>
          <div class="fw-scenario-icon">
            ${w.renderIcon("key",{className:"",size:28})}
          </div>
          <h3>${y("firmware.forgotCredentials")}</h3>
          <p>${y("firmware.forgotCredentialsDesc")}</p>
        </div>
        
        <div class="fw-scenario-card"
             onclick=${()=>Ce("change-wifi")}>
          <div class="fw-scenario-icon">
            ${w.renderIcon("wifi",{className:"",size:28})}
          </div>
          <h3>${y("firmware.changeWifi")}</h3>
          <p>${y("firmware.changeWifiDesc")}</p>
        </div>
        
        <div class="fw-scenario-card"
             onclick=${()=>Ce("re-provision")}>
          <div class="fw-scenario-icon">
            ${w.renderIcon("refresh",{className:"",size:28})}
          </div>
          <h3>${y("firmware.reProvision")}</h3>
          <p>${y("firmware.reProvisionDesc")}</p>
        </div>
      </div>
      
      <button class="fw-btn fw-btn-secondary" onclick=${_o}>
        ${w.renderIcon("unlink",{className:"fw-btn-icon"})}
        ${y("firmware.disconnect")}
      </button>
    </div>
  `}function zo(e,n){const t=m.deviceInfo,o=m.flashStep,i=m.flashProgress,s=m.selectedFirmware;if(o==="complete")return C`
      <div class="fw-view active">
        ${Y(y("firmware.flashComplete"),"fw-status-success")}
        
        <div class="fw-device-card">
          <div class="fw-device-card-header">
            <h3>
              ${w.renderIcon("cpu",{className:"fw-header-icon"})}
              ${y("firmware.flashComplete")}
            </h3>
          </div>
          
          <div style="text-align: center; padding: 2rem 0;">
            <div class="fw-success-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h2 style="font-size: 1.25rem; margin-bottom: 0.5rem;">${y("firmware.flashSuccess")}</h2>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">
              ${y("firmware.flashSuccessHint")}
            </p>
          </div>
          
          <button class="fw-btn fw-btn-primary" onclick=${Io}>
            ${w.renderIcon("wifi",{className:"fw-btn-icon",size:20})}
            ${y("firmware.configureWifi")}
          </button>
          <button class="fw-btn fw-btn-secondary" onclick=${()=>{m.view="scenarios",m.flashStep="select",m.flashComplete=!1,T()}}>
            ${y("firmware.skipForNow")}
          </button>
        </div>
      </div>
    `;if(o==="downloading"||o==="flashing"){const c=y(o==="downloading"?"firmware.downloading":"firmware.flashing"),r=o==="flashing"&&i>90?C`<p style="text-align: center; color: var(--text-muted); margin-top: 0.5rem; font-size: 0.8rem;">
          ${y("firmware.writingToFlash")}
        </p>`:null;return C`
      <div class="fw-view active">
        ${Y(c,"fw-status-warning")}
        
        <div class="fw-device-card">
          <div class="fw-device-card-header">
            <h3>
              ${w.renderIcon("cpu",{className:"fw-header-icon"})}
              ${c}
            </h3>
          </div>
          
          <div style="padding: 1.5rem 0;">
            <div class="fw-progress-bar">
              <div class="fw-progress-fill" style="width: ${i}%"></div>
            </div>
            <p style="text-align: center; color: var(--text-secondary); margin-top: 0.75rem; font-size: 0.9rem;">
              ${i}%
            </p>
            ${r}
          </div>
        </div>
      </div>
    `}return C`
    <div class="fw-view active">
      <button class="fw-btn-back" onclick=${Ae}>
        ${y("firmware.back")}
      </button>
      
      ${Y(y("firmware.readyToFlash"),"fw-status-warning")}
      
      <div class="fw-device-card">
        <div class="fw-device-card-header">
          <h3>
            ${w.renderIcon("cpu",{className:"fw-header-icon"})}
            ${y("firmware.deviceInfo")}
          </h3>
        </div>
        
        ${t?C`
          <div class="fw-info-grid">
            <div class="fw-info-item">
              <label>${y("firmware.chip")}</label>
              <span>${t.chipName}</span>
            </div>
            <div class="fw-info-item">
              <label>${y("firmware.macAddress")}</label>
              <span>${t.mac}</span>
            </div>
            <div class="fw-info-item">
              <label>${y("firmware.flashSize")}</label>
              <span>${t.flashSize}</span>
            </div>
          </div>
        `:""}
      </div>
      
      <div class="fw-device-card" style="margin-top: 1rem;">
        <div class="fw-device-card-header">
          <h3>
            ${w.renderIcon("bolt",{className:"fw-header-icon"})}
            ${y("firmware.selectFirmware")}
          </h3>
        </div>
        
        ${s?C`
          ${m.firmwareOptions.length>1?C`
            <div class="fw-form-group">
              <select class="fw-select" onchange=${c=>{const r=m.firmwareOptions.find(a=>a.productId===c.target.value);r&&(m.selectedFirmware=r,T())}}>
                ${m.firmwareOptions.map(c=>C`
                  <option value="${c.productId}" selected=${c.productId===s.productId}>
                    ${c.displayName}
                  </option>
                `)}
              </select>
            </div>
          `:C`
            <div class="fw-firmware-info">
              <p style="font-weight: 500; margin-bottom: 0.25rem;">${s.displayName||s.name}</p>
              <p style="font-size: 0.8rem; color: var(--text-secondary);">
                ${(s.size/1024/1024).toFixed(1)} MB
              </p>
            </div>
          `}
          
          <button class="fw-btn fw-btn-primary" onclick=${No} style="margin-top: 1rem;">
            ${w.renderIcon("bolt",{className:"fw-btn-icon",size:20})}
            ${y("firmware.flashButton")}
          </button>
        `:C`
          <div class="fw-loading">
            <span>${y("firmware.loadingFirmware")}</span>
          </div>
        `}
      </div>
    </div>
  `}function Uo(e,n){const t=m.credentials;return C`
    <div class="fw-view active">
      <button class="fw-btn-back" onclick=${Ae}>
        ${y("firmware.back")}
      </button>
      
      ${Y()}
      
      <div class="fw-device-card">
        <div class="fw-device-card-header">
          <h3>
            ${w.renderIcon("key",{className:"fw-header-icon"})}
            ${y("firmware.deviceCredentials")}
          </h3>
        </div>
        
        ${t?C`
          <div class="fw-credentials-grid">
            <div class="fw-cred-item">
              <label>${y("firmware.hostname")}</label>
              <span class="fw-cred-value">${t.hostname}</span>
            </div>
            <div class="fw-cred-item">
              <label>${y("firmware.password")}</label>
              <span class="fw-cred-value">${t.password}</span>
            </div>
            <div class="fw-cred-item">
              <label>${y("firmware.wifiNetwork")}</label>
              <span class="fw-cred-value">${t.ssid}</span>
            </div>
          </div>
        `:C`
          <div class="fw-loading">
            <span>${y("firmware.readingCredentials")}</span>
          </div>
        `}
      </div>
    </div>
  `}function jo(e,n){return m.setupComplete?C`
      <div class="fw-view active">
        <div class="fw-device-card">
          <div class="fw-device-card-header">
            <h3>
              ${w.renderIcon("zap",{className:"fw-header-icon"})}
              Setup Complete!
            </h3>
          </div>
          
          <div style="text-align: center; padding: 2rem 0;">
            <div class="fw-success-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
                <path d="M20 6L9 17L4 12"></path>
              </svg>
            </div>
            <h2 style="font-size: 1.25rem; margin-bottom: 0.5rem;">Device Ready!</h2>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">
              Your device is configured at: <strong>${m.setupHostname}</strong>
            </p>
          </div>
          
          <!-- Browser Security Warning -->
          <div class="fw-hint-box fw-hint-warning">
            <h4>
              ${w.renderIcon("alert-triangle",{className:"fw-hint-icon"})}
              ${y("firmware.browserSecurityTitle")}
            </h4>
            <p>${y("firmware.browserSecurityHint")}</p>
          </div>
          
          <button class="fw-btn fw-btn-primary" onclick=${()=>window.open(m.setupUrl,"_blank")}>
            ${w.renderIcon("external-link",{className:"fw-btn-icon",size:20})}
            ${y("firmware.openDeviceSetup")}
          </button>
          
          <button class="fw-btn fw-btn-secondary" style="margin-top: 0.5rem;" onclick=${()=>{m.setupComplete=!1,m.view="scenarios",T()}}>
            ${y("firmware.done")}
          </button>
        </div>
      </div>
    `:C`
    <div class="fw-view active">
      <button class="fw-btn-back" onclick=${Ae}>
        ${y("firmware.back")}
      </button>
      
      ${Y()}
      
      <div class="fw-device-card">
        <div class="fw-device-card-header">
          <h3>
            ${w.renderIcon("wifi",{className:"fw-header-icon"})}
            ${y("firmware.changeWifi")}
          </h3>
        </div>
        
        <p style="color: var(--text-secondary); font-size: 0.85rem;">
          Connecting to device and scanning for networks...
        </p>
      </div>
    </div>
  `}function Wo(e,n){const t=()=>{const i=`https://${m.reblessHostname}`;window.open(i,"_blank")},o=async()=>{await To(),m.reblessComplete=!1,m.reblessHostname=null,m.view="connect",T()};return m.reblessComplete?C`
      <div class="fw-view active">
        <div class="fw-device-card">
          <div class="fw-device-card-header">
            <h3>
              ${w.renderIcon("refresh",{className:"fw-header-icon"})}
              ${y("firmware.reProvisionTitle")}
            </h3>
          </div>
          
          <p style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 1.5rem;">
            ${y("firmware.reProvisionHint")}
          </p>
          
          <!-- Success State -->
          <div style="text-align: center; padding: 2rem 0;">
            <div class="fw-success-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h2 style="font-size: 1.25rem; margin-bottom: 0.5rem;">${y("firmware.reProvisionComplete")}</h2>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">
              ${y("firmware.reProvisionSuccess")} <strong>${m.reblessHostname}</strong>
            </p>
          </div>
          
          <!-- Browser Security Warning -->
          <div class="fw-hint-box fw-hint-warning">
            ${w.renderIcon("alert-triangle",{className:"fw-hint-icon-warning"})}
            <div style="flex: 1;">
              <strong style="display: block; margin-bottom: 0.25rem;">${y("firmware.browserSecurityTitle")}</strong>
              <span style="font-size: 0.8rem;">
                ${y("firmware.browserSecurityHint")}
              </span>
            </div>
          </div>
          
          <button class="fw-btn fw-btn-primary" onclick=${t} style="margin-top: 1rem;">
            ${w.renderIcon("external-link",{className:"fw-btn-icon",size:20})}
            ${y("firmware.openDeviceSetup")}
          </button>
          <button class="fw-btn fw-btn-secondary" onclick=${o} style="margin-top: 0.5rem;">
            ${y("firmware.done")}
          </button>
        </div>
      </div>
    `:C`
    <div class="fw-view active">
      <button class="fw-btn-back" onclick=${Ae}>
        ${y("firmware.back")}
      </button>
      
      ${Y()}
      
      <div class="fw-device-card">
        <div class="fw-device-card-header">
          <h3>
            ${w.renderIcon("refresh",{className:"fw-header-icon"})}
            ${y("firmware.reProvisionTitle")}
          </h3>
        </div>
        
        <div class="fw-provision-info">
          <p>${y("firmware.generatingCerts")}</p>
          <p>${y("firmware.checkTerminal")}</p>
        </div>
      </div>
    </div>
  `}function Ho(){const e=m.logs;return C`
    <div class="fw-terminal ${m.terminalCollapsed?"collapsed":""}">
      <div class="fw-terminal-header" onclick=${()=>{m.terminalCollapsed=!m.terminalCollapsed,T()}}>
        <span>${w.renderIcon("terminal",{className:"fw-terminal-icon",size:14})} ${y("firmware.statusLog")}</span>
        ${w.renderIcon(m.terminalCollapsed?"chevron-up":"chevron-down",{className:"fw-terminal-toggle"})}
      </div>
      <div class="fw-terminal-content">
        ${e.map(n=>C`
          <div class="fw-log-line ${n.type}">${n.message}</div>
        `)}
      </div>
    </div>
  `}function qo(e,n){const t=e.aiAgent.settings;return html`
    <div class="panel-container">
      <div class="ai-agent-content">
        
        <!-- API Provider Section -->
        <div class="ai-agent-section">
          <h3>API Provider</h3>
          <p class="ai-agent-hint">Select your AI service provider</p>
          
          <select 
            class="ai-agent-select"
            value="${t.provider}"
            onchange=${o=>n("ai-set-provider",o.target.value)}
          >
            <option value="openai" selected=${t.provider==="openai"}>OpenAI (GPT-4, GPT-3.5)</option>
            <option value="anthropic" selected=${t.provider==="anthropic"}>Anthropic (Claude)</option>
            <option value="grok" selected=${t.provider==="grok"}>Grok (x.ai)</option>
            <option value="openrouter" selected=${t.provider==="openrouter"}>OpenRouter (Multi-model)</option>
            <option value="custom" selected=${t.provider==="custom"}>Custom Endpoint</option>
          </select>
        </div>
        
        <!-- API Key Section -->
        <div class="ai-agent-section">
          <h3>API Key</h3>
          <p class="ai-agent-hint">
            ${t.provider==="openai"?"Get your API key from platform.openai.com":""}
            ${t.provider==="anthropic"?html`
              Get your API key from console.anthropic.com
              <br><strong style="color: var(--scheme-primary);">Note:</strong> Anthropic requires a proxy server (see below). You can enter your API key here (it will be sent to the proxy), or configure it in the proxy server's .env file.
            `:""}
            ${t.provider==="grok"?"Get your API key from x.ai":""}
            ${t.provider==="openrouter"?"Get your API key from openrouter.ai":""}
            ${t.provider==="custom"?"Enter your custom API key and endpoint URL":""}
          </p>
          
          <div class="ai-agent-input-group">
            <input 
              type="password"
              class="ai-agent-input"
              placeholder="sk-..."
              value="${t.apiKey||""}"
              oninput=${o=>n("ai-set-apikey",o.target.value)}
            />
            <button 
              class="ai-agent-test-btn"
              onclick=${()=>n("ai-test-connection")}
              disabled=${!t.apiKey}
            >
              Test
            </button>
          </div>
          
          ${e.aiAgent.connectionStatus?html`
            <div class="ai-agent-status ${e.aiAgent.connectionStatus.success?"success":"error"}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                ${e.aiAgent.connectionStatus.success?html`
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                `:html`
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                `}
              </svg>
              ${e.aiAgent.connectionStatus.message}
            </div>
          `:""}
        </div>
        
        <!-- Model Selection -->
        <div class="ai-agent-section">
          <h3>Model</h3>
          <p class="ai-agent-hint">Choose the AI model to use for code generation</p>
          
          <select 
            class="ai-agent-select"
            value="${t.model}"
            onchange=${o=>n("ai-set-model",o.target.value)}
            disabled=${e.aiAgent.isLoadingOpenRouterModels&&t.provider==="openrouter"}
          >
            ${Go(t.provider,t.model,e.aiAgent.openRouterModels,e.aiAgent.isLoadingOpenRouterModels)}
          </select>
          ${e.aiAgent.isLoadingOpenRouterModels&&t.provider==="openrouter"?html`
            <p class="ai-agent-hint" style="margin-top: 8px; font-size: 12px; color: var(--text-secondary);">
              Loading available models...
            </p>
          `:""}
        </div>
        
        <!-- Custom Endpoint (if custom provider) -->
        ${t.provider==="custom"?html`
          <div class="ai-agent-section">
            <h3>Custom Endpoint</h3>
            <p class="ai-agent-hint">Enter your custom API endpoint URL</p>
            
            <input 
              type="text"
              class="ai-agent-input"
              placeholder="https://api.example.com/v1/chat/completions"
              value="${t.endpoint||""}"
              oninput=${o=>n("ai-set-endpoint",o.target.value)}
            />
          </div>
        `:""}
        
        <!-- Anthropic Proxy URL (if anthropic provider) -->
        ${t.provider==="anthropic"?html`
          <div class="ai-agent-section">
            <h3>Proxy Server URL</h3>
            <p class="ai-agent-hint">
              URL of the Anthropic proxy server. 
              <br><strong>Localhost:</strong> http://localhost:3001/api/anthropic
              <br><strong>LAN access:</strong> http://YOUR_IP:3001/api/anthropic
              <br>See <code>proxy-server/README.md</code> for setup instructions.
            </p>
            
            <input 
              type="text"
              class="ai-agent-input"
              placeholder="http://localhost:3001/api/anthropic"
              value="${t.anthropicProxyUrl||""}"
              oninput=${o=>n("ai-set-anthropic-proxy-url",o.target.value)}
            />
          </div>
        `:""}
        
        <!-- System Prompt Section -->
        <div class="ai-agent-section">
          <h3>System Prompt</h3>
          <p class="ai-agent-hint">Customize the AI's behavior (optional)</p>
          
          <textarea 
            class="ai-agent-textarea"
            rows="6"
            placeholder="Leave empty to use default MicroPython expert prompt..."
            value="${t.systemPrompt||""}"
            oninput=${o=>n("ai-set-system-prompt",o.target.value)}
          ></textarea>
        </div>
        
        <!-- Info Section -->
        <div class="ai-agent-section ai-agent-info">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          <div>
            <strong>Privacy Note:</strong> Your API key is stored locally in your browser and never sent to our servers.
            All AI requests go directly from your browser to your chosen provider.
          </div>
        </div>
        
      </div>
    </div>
  `}function Go(e,n,t=[],o=!1){const i={openai:[{value:"gpt-4o",label:"GPT-4o (Recommended)"},{value:"gpt-4-turbo",label:"GPT-4 Turbo"},{value:"gpt-4",label:"GPT-4"},{value:"gpt-3.5-turbo",label:"GPT-3.5 Turbo"}],anthropic:[{value:"claude-3-5-sonnet-20241022",label:"Claude 3.5 Sonnet (Recommended)"},{value:"claude-3-opus-20240229",label:"Claude 3 Opus"},{value:"claude-3-sonnet-20240229",label:"Claude 3 Sonnet"},{value:"claude-3-haiku-20240307",label:"Claude 3 Haiku"}],grok:[{value:"grok-4-latest",label:"Grok-4 Latest (Recommended)"},{value:"grok-2-1212",label:"Grok-2"},{value:"grok-beta",label:"Grok Beta"},{value:"grok-vision-beta",label:"Grok Vision Beta"}],openrouter:t.length>0?t:[{value:"anthropic/claude-3.5-sonnet",label:"Claude 3.5 Sonnet"},{value:"openai/gpt-4-turbo",label:"GPT-4 Turbo"},{value:"google/gemini-pro-1.5",label:"Gemini Pro 1.5"},{value:"meta-llama/llama-3.1-70b-instruct",label:"Llama 3.1 70B"}],custom:[{value:"custom-model",label:"Custom Model"}]},s=i[e]||i.openai;return o&&e==="openrouter"?html`<option>Loading models...</option>`:s.map(c=>html`
    <option value="${c.value}" selected=${c.value===n}>${c.label}</option>
  `)}function Vo(e,n){return C`
    <div class="editor-layout">
      <div class="working-area">
        ${Bi(e,n)}
        ${Mi(e,n)}
        ${Yt(e)}
        ${Ri(e,n)}
      </div>
      ${_i(e,n)}
    </div>
  `}function Ko(e,n){let t="Connect to board",o=`${e.diskNavigationRoot}${e.diskNavigationPath}`;return e.isConnected&&(t=`${e.connectedPort}${e.boardNavigationPath}`),html`
    <div id="file-manager">
      <div id="board-files">
        <div class="device-header">
          ${w.renderIcon(e.isConnected?"cpu":"unlink",{className:"icon"})}
          <div onclick=${()=>n("connect")} class="text">
            <span>${t}</span>
          </div>
          <button disabled=${!e.isConnected} onclick=${()=>n("create-folder","board")}>
            ${w.renderIcon("folder-plus",{className:"icon"})}
          </button>
          <button disabled=${!e.isConnected} onclick=${()=>n("create-file","board")}>
            ${w.renderIcon("file-plus",{className:"icon"})}
          </button>
          <button disabled=${!e.isConnected} onclick=${()=>n("upload-to-device")} title="Upload files from computer directly to device">
            ${w.renderIcon("file-upload",{className:"icon"})}
          </button>
        </div>
        ${Di(e,n)}
      </div>
      ${Fi(e,n)}
      <div id="disk-files">
        <div class="device-header">
          ${w.renderIcon("device-desktop",{className:"icon"})}
          <div class="text">
            <span>${o}</span>
          </div>
          <button onclick=${()=>n("create-folder","disk")}>
            ${w.renderIcon("folder-plus",{className:"icon"})}
          </button>
          <button onclick=${()=>n("create-file","disk")}>
            ${w.renderIcon("file-plus",{className:"icon"})}
          </button>
          <button onclick=${()=>n("import-files")} title="Import files from computer">
            ${w.renderIcon("file-upload",{className:"icon"})}
          </button>
        </div>
        ${Ai(e,n)}
      </div>
    </div>
  `}function Nn(e,n){return C`
    <div class="landing-view">
      <div class="landing-container">
        <!-- Demo Header with Scripto Studio branding -->
        <div class="demo-header">
          <h2>${y("landing.title")}</h2>
          <p>${y("landing.tagline")}</p>
        </div>
        
        <div class="landing-scenario-grid">
          <div class="landing-scenario-card" onclick=${()=>We("https://scriptostudio.com/registry/extensions-catalogue/")}>
            <div class="landing-scenario-icon">
              ${w.renderIcon("packages",{className:"landing-icon-large"})}
            </div>
            <h3>${y("landing.browseExtensions")}</h3>
            <p>${y("landing.browseExtensionsDesc")}</p>
          </div>
          
          <div class="landing-scenario-card" onclick=${()=>We("https://scriptostudio.com/registry/catalogue/")}>
            <div class="landing-scenario-icon">
              ${w.renderIcon("script",{className:"landing-icon-large"})}
            </div>
            <h3>${y("landing.browseScriptOs")}</h3>
            <p>${y("landing.browseScriptOsDesc")}</p>
          </div>
          
          <div class="landing-scenario-card" onclick=${()=>We("https://scriptostudio.com/docs/")}>
            <div class="landing-scenario-icon">
              ${w.renderIcon("book",{className:"landing-icon-large"})}
            </div>
            <h3>${y("landing.browseDocs")}</h3>
            <p>${y("landing.browseDocsDesc")}</p>
          </div>
          
          <div class="landing-scenario-card ${e.needsOnboarding?"highlight-pulse":""}" onclick=${()=>n("navigate","system:firmware")}>
            <div class="landing-scenario-icon">
              ${w.renderIcon("cpu",{className:"landing-icon-large"})}
            </div>
            <h3>${y("landing.onboardDevice")}</h3>
            <p>${y("landing.onboardDeviceDesc")}</p>
          </div>
        </div>
        
        <!-- Animated Connect Button with Pulse Circle (mobile only, when sidebar is hidden) -->
        <div class="demo-cta mobile-only">
          <div style="display: inline-block; position: relative;">
            <div class="pulse-circle"></div>
            <div class="pulse-circle pulse-delay"></div>
            <button class="interactive-btn" onclick=${()=>n("connect")}>
              ${y("landing.connectDevice")}
            </button>
          </div>
        </div>
      </div>
    </div>
  `}function We(e){window.open(e,"_blank","noopener,noreferrer")}function Jo(e,n){e.sidebarIconRotated===void 0&&(e.sidebarIconRotated=!1);const t=e.connectionMode==="webrepl"?"#00FF7F":e.connectionMode==="usb"?"#FF9500":"var(--text-secondary)",o=C`
    <div class="sidebar-header">
      <div
        class="sidebar-header-logo connection-${e.connectionMode||"none"}"
        onclick=${()=>{e.isConnected?n("disconnect"):n("connect")}}
        title=${e.isConnected?"Disconnect from Device":"Connect to Device"}
        style="color: ${t}"
      >
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>
      </div>
    </div>
  `;return C`
    <div class="working-area">
      <div class="system-container">
        ${o}
        <aside class="system-sidebar">
          ${Xo(e,n)}
        </aside>
        <main class="system-content">
          ${Yo(e,n)}
        </main>
      </div>
    </div>
    ${ji(e)}
    ${Qt(e,n)}
    ${Ei(e,n)}
    ${pi(e,n)}
    ${fi(e,n)}
    ${yi(e,n)}
    ${Si(e,n)}
    ${wi(e,n)}
    ${$i(e,n)}
  `}function Xo(e,n){const t=window.i18n?window.i18n.t:x=>x,o=[{id:"sysinfo",label:t("sidebar.about"),icon:"info-circle"}],i=[{id:"editor",label:t("sidebar.editor"),icon:"code"},{id:"file-manager",label:t("sidebar.files"),icon:"folder"}],s=[{id:"settings",label:t("sidebar.settings"),icon:"adjustments-alt"},{id:"ai-agent",label:t("sidebar.aiAgent"),icon:"robot-face"},{id:"firmware",label:t("sidebar.firmware"),icon:"file-download"}],c=[{id:"wifi",label:t("sidebar.wifi"),icon:"wifi"},{id:"ethernet",label:t("sidebar.ethernet"),icon:"cloud-network"},{id:"vpn",label:t("sidebar.vpn"),icon:"shield-chevron"},{id:"btle",label:t("sidebar.btle"),icon:"bluetooth"},{id:"wwan",label:t("sidebar.wwan"),icon:"cell"},{id:"mqtt",label:t("sidebar.mqtt"),icon:"message-2"},{id:"ntp",label:t("sidebar.ntp"),icon:"clock-cog"},{id:"can",label:t("sidebar.can"),icon:"car-crash"}],r=[{id:"gps",label:t("sidebar.gps"),icon:"gps"},{id:"4g-modem",label:t("sidebar.modem"),icon:"signal-4g"},{id:"sdcard",label:t("sidebar.sdcard"),icon:"device-sd-card"}],a=o.map(x=>In(x,e,n)),l=i.map(x=>In(x,e,n)),d=e.expandedSystem!==!1,p=C`
    <div class="system-sidebar-extension">
      <div 
        class="system-sidebar-item system-sidebar-toggle"
        onclick=${()=>n("toggle-system-menu")}
      >
        ${w.renderIcon("settings",{className:"",size:20})}
        <span>${t("sidebar.system")}</span>
        ${w.renderIcon("chevron-down",{className:`expand-icon ${d?"expanded":""}`,size:16})}
      </div>
      
      ${d?C`
        <div class="system-sidebar-submenu">
          ${s.map(x=>{const L=e.activeSystemPanel===x.id;return C`
              <div 
                class="system-sidebar-subitem ${L?"active":""}"
                onclick=${()=>n("change-system-panel",x.id)}
              >
                ${w.renderIcon(x.icon,{className:"",size:16})}
                <span>${x.label}</span>
              </div>
            `})}
        </div>
      `:""}
    </div>
  `,u=e.expandedNetworks!==!1,f=C`
    <div class="system-sidebar-extension">
      <div 
        class="system-sidebar-item system-sidebar-toggle"
        onclick=${()=>n("toggle-networks-menu")}
      >
        ${w.renderIcon("network",{className:"",size:20})}
        <span>${t("sidebar.networks")}</span>
        ${w.renderIcon("chevron-down",{className:`expand-icon ${u?"expanded":""}`,size:16})}
      </div>
      
      ${u?C`
        <div class="system-sidebar-submenu">
          ${c.map(x=>{const L=e.activeNetworkPanel===x.id;return C`
              <div 
                class="system-sidebar-subitem ${L?"active":""}"
                onclick=${()=>n("change-network-panel",x.id)}
              >
                ${w.renderIcon(x.icon,{className:"",size:16})}
                <span>${x.label}</span>
              </div>
            `})}
        </div>
      `:""}
    </div>
  `,g=e.expandedPeripherals!==!1,h=C`
    <div class="system-sidebar-extension">
      <div
        class="system-sidebar-item system-sidebar-toggle"
        onclick=${()=>n("toggle-peripherals-menu")}
      >
        ${w.renderIcon("cpu",{className:"",size:20})}
        <span>${t("sidebar.peripherals")}</span>
        ${w.renderIcon("chevron-down",{className:`expand-icon ${g?"expanded":""}`,size:16})}
      </div>
      
      ${g?C`
        <div class="system-sidebar-submenu">
          ${r.map(x=>{const L=e.activePeripheralsPanel===x.id;return C`
              <div 
                class="system-sidebar-subitem ${L?"active":""}"
                onclick=${()=>n("change-peripherals-panel",x.id)}
              >
                ${w.renderIcon(x.icon,{className:"",size:16})}
                <span>${x.label}</span>
              </div>
            `})}
        </div>
      `:""}
    </div>
  `,v=x=>{if(x.iconSvg)try{const z=new DOMParser().parseFromString(x.iconSvg,"image/svg+xml").querySelector("svg");if(z){const N=z.getAttribute("viewBox")||"0 0 24 24",A=Array.from(z.querySelectorAll("path"));return C`
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              class="icon icon-extension icon-tabler" 
              width="20" 
              height="20" 
              viewBox="${N}" 
              stroke-width="2" 
              stroke="none"
              fill="none" 
              stroke-linecap="round" 
              stroke-linejoin="round"
              style="vertical-align: middle; border: none !important; outline: none !important; box-shadow: none !important; display: block;"
            >
              ${A.map(q=>{const se=q.getAttribute("d")||"",De=q.getAttribute("fill")||"none",Re=q.getAttribute("stroke");return se==="M0 0h24v24H0z"||Re==="none"?C`<path d="${se}" stroke="none" fill="none" />`:C`<path d="${se}" stroke="currentColor" fill="${De}" />`})}
            </svg>
          `}}catch(_){console.warn("[System] Failed to parse extension icon SVG:",_)}const L=x.icon||"settings";return w.renderIcon(L,{className:"",size:20})},S=(e.installedExtensions||[]).map(x=>{const L=e.expandedExtensions[x.id],_=e.activeExtension===x.id,W=x.devices===!0;let z=null;if(W&&L)if(!e.loadedExtensions[x.id])console.warn("[System] Extension not loaded:",x.id);else{const N=e.loadedExtensions[x.id];if(!N.instance)try{const A=N.data.content,se=new Function("DeviceAPI","html","emit","state",`
              ${A}
              const classMatch = ${JSON.stringify(A)}.match(/class\\s+(\\w+(?:App|Extension))\\s*{/);
              if (!classMatch) {
                throw new Error('No extension class found');
              }
              return eval(classMatch[1]);
            `)(DeviceAPI,C,n,e),De=new DeviceAPI(B),Re=new se(De,n,e,C);e.loadedExtensions[x.id].instance=Re}catch(A){console.error(`[System] Error instantiating extension ${x.id}:`,A)}if(N.instance&&typeof N.instance.getMenuItems=="function")try{const A=N.instance.getMenuItems();A&&Array.isArray(A)&&(x.menu=A)}catch(A){console.error(`[System] Error getting menu items for ${x.id}:`,A)}if(N.instance&&typeof N.instance.renderSidebarDevices=="function")try{z=N.instance.renderSidebarDevices()}catch(A){console.error(`[System] Error rendering sidebar devices for ${x.id}:`,A)}else console.warn(`[System] renderSidebarDevices not available for ${x.id}`)}if(L&&e.loadedExtensions[x.id]?.instance){const N=e.loadedExtensions[x.id];if(N.instance&&typeof N.instance.getMenuItems=="function")try{const A=N.instance.getMenuItems();A&&Array.isArray(A)&&(x.menu=A)}catch(A){console.error(`[System] Error getting menu items for ${x.id}:`,A)}}return C`
      <div class="system-sidebar-extension">
        <div 
          class="system-sidebar-item system-sidebar-toggle ${_?"active-extension":""}"
          onclick=${()=>n("toggle-extension-menu",x.id)}
        >
          ${v(x)}
          <span>${x.name}</span>
          ${w.renderIcon("chevron-down",{className:`expand-icon ${L?"expanded":""}`,size:16})}
        </div>
        
        ${L?C`
          <div class="system-sidebar-submenu">
            ${x.menu.map(N=>{const A=e.activeExtension===x.id&&e.activeExtensionPanel===N.id,q=N.disabled===!0;return C`
                <div 
                  class="system-sidebar-subitem ${A?"active":""} ${q?"disabled":""}"
                  onclick=${q?null:()=>n("change-extension-panel",{extensionId:x.id,panelId:N.id})}
                  style=${q?"opacity: 0.6; cursor: default; font-weight: 600;":""}
                >
                  <span>${N.label}</span>
                </div>
              `})}
            
            ${W?C`
              <div class="system-sidebar-devices-section">
                <div class="system-sidebar-devices-header">
                  DEVICES
                </div>
                ${z||C`
                  <div style="padding: 12px; text-align: center; color: var(--text-secondary); font-size: 11px;">
                    Loading...
                  </div>
                `}
              </div>
            `:""}
          </div>
        `:""}
      </div>
    `}),P=C`
    <div class="system-sidebar-extensions-header">
      <span>${t("extensions")}</span>
      <button 
        class="extensions-add-button" 
        onclick=${()=>n("open-extensions-modal")}
        title=${t("add_extension")}
      >
        +
      </button>
    </div>
  `,k=C`
    <div class="system-sidebar-divider"></div>
  `,O=C`
    <div class="sidebar-footer">
      ${window.LanguageSelector?window.LanguageSelector(e,n):""}
    </div>
  `;return C`
    <div class="system-sidebar-content">
      ${a}
      ${l}
      ${f}
      ${h}
      ${p}
      ${k}
      ${P}
      ${S}
      ${O}
    </div>
  `}function In(e,n,t){const o=n.systemSection===e.id,s=["editor","file-manager"].includes(e.id)?"change-view":"change-system-section";return C`
    <div
      class="system-sidebar-item ${o?"active":""}"
      onclick=${()=>t(s,e.id)}
    >
      ${w.renderIcon(e.icon,{className:"",size:20})}
      <span>${e.label}</span>
    </div>
  `}function Yo(e,n){const t=e.systemSection;if(t==="editor")return Vo(e,n);if(t==="file-manager")return Ko(e,n);if(t==="landing")return Nn(e,n);if(t?.startsWith("extension:"))return ki(e,n,C);if(t?.startsWith("network:"))switch(t.split(":")[1]){case"wifi":return Tn(e,n);case"ethernet":return Zi(e,n);case"vpn":return eo(e,n);case"btle":return no(e,n);case"wwan":return to(e,n);case"mqtt":return io(e,n);case"ntp":return oo(e,n);case"can":return so(e,n);default:return Tn(e,n)}if(t?.startsWith("peripherals:"))switch(t.split(":")[1]){case"gps":return Pn(e,n);case"4g-modem":return lo(e,n);case"sdcard":return fo(e,n);default:return Pn(e,n)}if(t?.startsWith("system:"))switch(t.split(":")[1]){case"settings":return kn(e,n);case"ai-agent":return qo(e,n);case"firmware":return Lo(e);default:return kn(e,n)}return e.isConnected?qi(e,n):Nn(e,n)}const xe=Date.now();window.i18nReady=Promise.all([fetch(`locales/en.json?v=${xe}`).then(e=>e.json()),fetch(`locales/de.json?v=${xe}`).then(e=>e.json()),fetch(`locales/es.json?v=${xe}`).then(e=>e.json()),fetch(`locales/fr.json?v=${xe}`).then(e=>e.json())]).then(([e,n,t,o])=>{if(window.i18n){window.i18n.initTranslations(e,n,t,o);const i=localStorage.getItem("locale")||"en";window.i18n.setLocale(i),console.log("[i18n] Translations loaded, locale set to:",i),window.appInstance&&window.appInstance.emitter.emit("render")}else console.warn("[i18n] window.i18n not available yet");return!0}).catch(e=>(console.error("[i18n] Failed to load translations:",e),!1));const Fe=`# This program was created in ScriptO Studio for MicroPython

print('Hello, ')
print('ScriptO!') # ●
`;async function yt(e){return new Promise(n=>setTimeout(n,e))}async function M(e,n,t){return confirm(e)?0:1}function rn(e,n){const t=document.getElementById("status-bar");if(!t)return;const o=n||localStorage.getItem("temperatureUnit")||"degC",i=Xe?Xe(e,o):null;if(!i||!i.connected){t.className="disconnected";const p=t.querySelector(".status-bar-center");p?p.textContent=i&&i.disconnectedText||ge:t.textContent=i&&i.disconnectedText||ge;return}t.className="";const s=t.querySelector(".status-bar-center")||t;function c(p){let u=s.querySelector(`.status-item.${p}`);if(!u){u=document.createElement("div"),u.className=`status-item ${p}`;const f=document.createElement("span");f.className="status-label";const g=document.createElement("span");g.className="status-value",u.appendChild(f),u.appendChild(g),s.appendChild(u)}return u}const r=c("ram");r.querySelector(".status-label").textContent="RAM",r.querySelector(".status-value").textContent=i.ram;const a=s.querySelector(".status-item.temp");if(i.temp){const p=c("temp");p.querySelector(".status-label").textContent="TEMP",p.querySelector(".status-value").textContent=i.temp}else a&&a.remove();const l=c("uptime");l.querySelector(".status-label").textContent="UPTIME",l.querySelector(".status-value").textContent=i.uptime;const d=s.querySelector(".status-item.wifi-rssi");if(i.rssi){const p=c("wifi-rssi");p.querySelector(".status-label").textContent="RSSI",p.querySelector(".status-value").textContent=i.rssi}else d&&d.remove()}function I(e){const n=document.getElementById("overlay");if(!n)return;let t=!1,o="";if(e.diskFiles==null)t=!0,o="<p>Loading files...</p>";else if(e.isRemoving)t=!0,o="<p>Removing...</p>";else if(e.isConnecting)t=!0,o="<p>Connecting...</p>";else if(e.isLoadingFiles)t=!0,o="<p>Loading files...</p>";else if(e.isSaving)t=!0,o=`<p>Saving file... ${e.savingProgress||0}</p>`;else if(e.isTransferring){t=!0;const i=String(e.transferringProgress||""),s=i.match(/(\d+)%?$/),c=s?parseInt(s[1]):0,r=i.match(/^(.+?):/);o=`
      <div class="transfer-overlay-content">
        <div class="transfer-title">Transferring File</div>
        <div class="transfer-filename">${r?r[1]:"file"}</div>
        <div class="transfer-progress-container">
          <div class="transfer-progress-bar">
            <div class="transfer-progress-fill" style="width: ${c}%"></div>
          </div>
          <div class="transfer-progress-text">${c}%</div>
        </div>
      </div>
    `}t?(n.classList.remove("closed"),n.classList.add("open"),n.innerHTML=o):(n.classList.remove("open"),n.classList.add("closed"))}class Qo{constructor(){this.DB_NAME="scripto-studio-registry-cache",this.DB_VERSION=1,this.STORE_SCRIPTOS="scriptos",this.STORE_INDEX="index",this.INDEX_CACHE_KEY="index",this.INDEX_CACHE_EXPIRY=24*60*60*1e3}async _initDB(){return new Promise((n,t)=>{const o=indexedDB.open(this.DB_NAME,this.DB_VERSION);o.onerror=()=>t(o.error),o.onsuccess=()=>n(o.result),o.onupgradeneeded=i=>{const s=i.target.result;s.objectStoreNames.contains(this.STORE_SCRIPTOS)||s.createObjectStore(this.STORE_SCRIPTOS),s.objectStoreNames.contains(this.STORE_INDEX)||s.createObjectStore(this.STORE_INDEX)}})}async getIndex(){try{const n=await this._initDB();return new Promise((t,o)=>{const c=n.transaction([this.STORE_INDEX],"readonly").objectStore(this.STORE_INDEX).get(this.INDEX_CACHE_KEY);c.onsuccess=()=>{const r=c.result;if(r&&r.data){const a=Date.now()-r.timestamp;a<this.INDEX_CACHE_EXPIRY?(console.log("[Registry Cache] Using cached index (age:",Math.round(a/1e3/60),"minutes)"),t(r.data)):(console.log("[Registry Cache] Index cache expired"),t(null))}else t(null)},c.onerror=()=>o(c.error)})}catch(n){return console.error("[Registry Cache] Error getting index:",n),null}}async saveIndex(n){try{const t=await this._initDB();return new Promise((o,i)=>{const r=t.transaction([this.STORE_INDEX],"readwrite").objectStore(this.STORE_INDEX).put({data:n,timestamp:Date.now()},this.INDEX_CACHE_KEY);r.onsuccess=()=>{console.log("[Registry Cache] Saved index"),o()},r.onerror=()=>i(r.error)})}catch(t){console.error("[Registry Cache] Error saving index:",t)}}async getScriptO(n){try{const t=await this._initDB();return new Promise((o,i)=>{const r=t.transaction([this.STORE_SCRIPTOS],"readonly").objectStore(this.STORE_SCRIPTOS).get(n);r.onsuccess=()=>{const a=r.result;a&&a.content?(console.log("[Registry Cache] Using cached ScriptO:",n),o(a)):o(null)},r.onerror=()=>i(r.error)})}catch(t){return console.error("[Registry Cache] Error getting ScriptO:",t),null}}async saveScriptO(n,t,o){try{const i=await this._initDB();return new Promise((s,c)=>{const l=i.transaction([this.STORE_SCRIPTOS],"readwrite").objectStore(this.STORE_SCRIPTOS).put({url:n,content:t,config:o,timestamp:Date.now()},n);l.onsuccess=()=>{console.log("[Registry Cache] Saved ScriptO:",n),s()},l.onerror=()=>c(l.error)})}catch(i){console.error("[Registry Cache] Error saving ScriptO:",i)}}}async function Zo(e,n,t){const o=V;e.platform=navigator.platform.indexOf("Mac")>-1?"darwin":"linux",e.systemSection=null,e.diskNavigationPath="/",e.isInitializing=!0,e.commandHistory=[],e.historyIndex=-1,e.cursorPos=0,await o.initialize(),e.diskNavigationRoot="/",console.log("[Store] Using IndexedDB virtual filesystem, root:",e.diskNavigationRoot),e.isInitializing=!1,n.emit("render"),e.diskFiles=[],e.boardNavigationPath="/",e.boardNavigationRoot="/",e.boardFiles=[],e.openFiles=[],e.selectedFiles=[],e.filesLoadedOnce=!1,e.newTabFileName=null,e.editingFile=null,e.creatingFile=null,e.renamingFile=null,e.currentLine="",e.bannerDisplayed=!1,e.creatingFolder=null,e.renamingTab=null,e.fileCounter=1,e.isConnectionDialogOpen=!1,e.isConnecting=!1,e.systemInfo=null,e.networksInfo=null,e.isLoadingSystemInfo=!1,e.isLoadingNetworks=!1,e.expandedNetworks=!1,e.activeNetworkPanel=null,e.expandedPeripherals=!1,e.activePeripheralsPanel=null,e.expandedSystem=!1,e.activeSystemPanel=null,e.sdcardConfig=null,e.isLoadingSdcardConfig=!1,e.sdcardConfigLoaded=!1,e.sdcardInfo=null,e.isLoadingSdcardInfo=!1,e.isMountingSDCard=!1,e.isUnmountingSDCard=!1,e.gpioConfig=null,e.isLoadingGpioConfig=!1,e.gpioConfigLoaded=!1,e.gpioSortBy="usage",e.gpioSortOrder="asc",e.gpioEditingRow=null,e.gpioEditingRowData=null,e.gpioValidationErrors=[],e.mqttConfig=null,e.isLoadingMqttConfig=!1,e.canConfig=null,e.canConfigLoaded=!1,e.isLoadingCanConfig=!1,e.mqttConfigLoaded=!1,e.ntpConfig={server:"pool.ntp.org",tzOffset:0,timezone:"UTC",autoDetect:!1,autoSync:!1},e.isLoadingNtpConfig=!1,e.ntpConfigLoaded=!1,e.ntpSyncResult=null,e.wwanConfig=null,e.isLoadingWwanConfig=!1,e.wwanConfigLoaded=!1,e.modemStatus=null,e.isLoadingModemStatus=!1,e.modemStatusLoaded=!1,e.gpsData=null,e.isLoadingGpsData=!1,e.gpsDataLoaded=!1,e.theme=null,e.colorScheme=null,e.effectiveTheme=null,e.locale=localStorage.getItem("locale")||"en",e.isConnected=!1,e.connectedPort=null,e.connectionMode="none",e.needsOnboarding=!1;try{const i=await o.hasOnboardedDevices();e.needsOnboarding=!i,console.log("[State Init] Onboarding needed:",e.needsOnboarding)}catch(i){console.warn("[State Init] Could not check onboarded devices:",i),e.needsOnboarding=!0}e.statusInfo=null,e.scriptOsList=[],e.selectedScriptOs=null,e.scriptOsModalView="library",e.scriptOsArgs={},e.scriptOsSearchQuery="",e.scriptOsFilterTags=[],e.isScriptOsModalOpen=!1,e.registryUrl="https://scriptostudio.com/registry/index.json",e.isLoadingRegistry=!1,e.scriptOsUiModal={isOpen:!1,url:null,title:null,isLoading:!1,error:null},e.aiAgent={isOpen:!1,messages:[],isGenerating:!1,connectionStatus:null,openRouterModels:[],isLoadingOpenRouterModels:!1,inputValue:"",lastConfiguredArgs:null,lastScriptName:null,settings:{provider:localStorage.getItem("ai-provider")||"openai",apiKey:localStorage.getItem("ai-apikey")||null,model:localStorage.getItem("ai-model")||"gpt-4o",endpoint:localStorage.getItem("ai-endpoint")||null,systemPrompt:localStorage.getItem("ai-system-prompt")||"",anthropicProxyUrl:localStorage.getItem("ai-anthropic-proxy-url")||"http://localhost:3001/api/anthropic"}},e.debugger={active:!1,halted:!1,configOpen:!1,debugFiles:[],breakpoints:{},watchExpressions:{},conditionalBreakpoints:{},breakpointModalOpen:!1,editingBreakpoint:null,currentFile:"",currentLine:0,variables:{},locals:{},memory:0,timing:0},e.extensionRegistry=new Nt,e.installedExtensions=[],e.availableExtensions=[],e.loadedExtensions={},e.activeExtension=null,e.activeExtensionPanel=null,e.expandedExtensions={},e.isExtensionsModalOpen=!1,e.isLoadingExtensions=!1,e.dependencyPrompt=null,e.installingDependencies=null,e.isNewFileDialogOpen=!1,e.isSaving=!1,e.savingProgress=0,e.isTransferring=!1,e.transferringProgress="",e.isRemoving=!1,e.isLoadingFiles=!1,e.dialogs=[],e.shortcutsDisabled=!1,await t("disk"),e.savedPanelHeight=Ge,e.panelHeight=oe,e.dragStartY=0,e.dragStartHeight=0,e.logSidebarWidth=350,e.savedLogSidebarWidth=350;try{e.installedExtensions=await e.extensionRegistry.getInstalledExtensions(),console.log(`[Extension Registry] Found installed extensions: ${e.installedExtensions.length}`)}catch(i){console.error("[Extensions] Failed to load installed extensions:",i),e.installedExtensions=[]}e.cache(H,"terminal"),console.log("[State Init] Terminal component cached"),typeof window<"u"&&(window.dev={state:e,registry:e.extensionRegistry,updateExtension:async i=>new Promise((s,c)=>{const r=document.createElement("input");r.type="file",r.accept=".js",r.onchange=async a=>{try{const l=await a.target.files[0].text(),d=await e.extensionRegistry.updateExtensionDev(i,l);console.log("✅ Extension updated! Click another panel, then back to reload."),s(d)}catch(l){c(l)}},r.click()})},console.log('[State Init] Dev utilities exposed: window.dev.updateExtension("dtc")')),e.resizePanel=function(i){const s=parseFloat(getComputedStyle(document.body).zoom)||1,c=(i.clientY-e.dragStartY)/s;e.panelHeight=e.dragStartHeight-c,e.panelHeight<=oe?e.savedPanelHeight=Ge:e.savedPanelHeight=e.panelHeight,n.emit("render")},e.resizeLogSidebar=function(i){const r=document.querySelector(".repl-panel-content");if(!r)return;const a=r.getBoundingClientRect(),l=a.width,d=a.right-i.clientX,p=l-600;d>=200&&d<=p&&(e.logSidebarWidth=d,e.savedLogSidebarWidth=d,n.emit("render"))}}function es(){try{return window.matchMedia("(prefers-color-scheme: dark)").matches}catch(e){return console.warn("Failed to detect system theme:",e),!1}}function an(e){if(e.theme==="device"){const n=es();e.effectiveTheme=n?"dark":"light"}else e.effectiveTheme=e.theme;e.effectiveTheme==="dark"?document.documentElement.setAttribute("data-theme","dark"):document.documentElement.removeAttribute("data-theme")}function wt(e){document.documentElement.setAttribute("data-color-scheme",e.colorScheme)}let U=null;function ns(e,n){if(U)try{U.removeListener?U.removeListener(Se):U.removeEventListener&&U.removeEventListener("change",Se)}catch{}U=window.matchMedia("(prefers-color-scheme: dark)"),U.addListener?U.addListener(()=>Se(e,n)):U.addEventListener&&U.addEventListener("change",()=>Se(e,n))}function Se(e,n){e.theme==="device"&&(an(e),window.dispatchEvent(new CustomEvent("theme-changed")),n.emit("render"))}function ts(e,n){const t=localStorage.getItem("theme")||"dark",o=localStorage.getItem("colorScheme")||"green",i=localStorage.getItem("editorTheme")||"auto";e.theme=t,e.colorScheme=o,e.editorTheme=i,an(e),wt(e),ns(e,n)}function is(e,n){n.on("set-theme",t=>{console.log("set-theme",t),e.theme=t,localStorage.setItem("theme",e.theme),an(e),window.dispatchEvent(new CustomEvent("theme-changed")),n.emit("render")}),n.on("set-color-scheme",t=>{console.log("set-color-scheme",t),e.colorScheme=t,localStorage.setItem("colorScheme",e.colorScheme),wt(e),n.emit("render")}),n.on("set-temperature-unit",t=>{console.log("set-temperature-unit",t),e.temperatureUnit=t,localStorage.setItem("temperatureUnit",e.temperatureUnit),e.isConnected&&e.statusInfo&&rn(e.statusInfo,t||"degC"),n.emit("render")}),n.on("set-editor-theme",t=>{console.log("set-editor-theme",t),e.editorTheme=t,localStorage.setItem("editorTheme",e.editorTheme),window.dispatchEvent(new CustomEvent("editor-theme-changed",{detail:{theme:t}})),n.emit("render")})}function J(e,n,t=null){t&&t.key!="Escape"||(window._dismissDialogsKeyHandler&&(document.removeEventListener("keydown",window._dismissDialogsKeyHandler),window._dismissDialogsKeyHandler=null),e.isConnectionDialogOpen=!1,e.isNewFileDialogOpen=!1,e.scriptOsUiModal&&e.scriptOsUiModal.isOpen&&n.emit("close-scriptos-ui-modal"),n.emit("render"))}function Ee(e,n){const t=document.getElementById(e);return t?(n?(t.classList.remove("closed"),t.classList.add("open")):(t.classList.remove("open"),t.classList.add("closed")),!0):!1}function os(e,n,t){n.on("open-connection-dialog",async()=>{J(e,n),await t.disconnect(),e.isConnectionDialogOpen=!0,Ee("dialog-connection",!0)||n.emit("render");const o=i=>J(e,n,i);document.addEventListener("keydown",o),window._dismissDialogsKeyHandler=o}),n.on("close-connection-dialog",()=>{e.isConnectionDialogOpen=!1,J(e,n),Ee("dialog-connection",!1)}),n.on("create-new-file",()=>{console.log("create-new-file"),J(e,n),e.isNewFileDialogOpen=!0,Ee("dialog-new-file",!0)||n.emit("render");const o=i=>J(e,n,i);document.addEventListener("keydown",o),window._dismissDialogsKeyHandler=o}),n.on("close-new-file-dialog",()=>{e.isNewFileDialogOpen=!1,J(e,n),Ee("dialog-new-file",!1)})}function ss(e,n,t,o){let i=!1;function s(){i=!0,setTimeout(()=>{i=!1},500)}function c(d=!1){i||(n.emit("run",d),s())}function r(){Te({isConnected:e.isConnected})&&c()}function a(){Te({isConnected:e.isConnected})&&c(!0)}function l(){Te({isConnected:e.isConnected})&&n.emit("stop")}return n.on("run-from-button",(d=!1)=>{d?a():r()}),n.on("run",async(d=!1)=>{const p=e.openFiles.find(h=>h.id==e.editingFile);if(!p||!p.editor){console.warn("[run] No active file to execute");return}let u=p.editor.content||"";if(d&&p.editor.view){const h=p.editor.view.state,v=h.selection;if(v.ranges.some(P=>P.from!==P.to)){const P=v.ranges.filter(k=>k.from!==k.to).map(k=>h.sliceDoc(k.from,k.to)).join(`
`);P.trim().length>0&&(u=P)}}let f=!1;if(!d&&u.startsWith("# SCRIPTOS_SILENT: True")&&(f=!0,console.log("[ScriptO] Detected silent mode marker")),!d&&u.includes("# === START_CONFIG_PARAMETERS ==="))try{console.log("[ScriptO] Detected ScriptO file, parsing...");const h=de(u);if(h){f=h.silent===!0,console.log("[ScriptO] Config parsed:",h,"silent:",f);const v={};if(h.args)for(const P in h.args){const k=h.args[P];k.value!==void 0&&(v[P]=k.value)}console.log("[ScriptO] Using default values:",v);const S=Ze(u,h,v);console.log("[ScriptO] Generated code length:",S.length,"original:",u.length),u=S,console.log("[ScriptO] Parsed and generated clean code successfully")}else console.log("[ScriptO] Config parsing returned null")}catch(h){console.error("[ScriptO] Error parsing config:",h)}n.emit("open-panel");let g=document.querySelector(".xterm-helper-textarea");g&&g.focus(),n.emit("render");try{Oe(e);let h=e.cache(o,"terminal").term;h.write(`\r
`);const v=await t.run(u,f);v&&v.trim()&&f&&h.write(v+`\r
`),h.write(G),h.scrollToBottom()}catch(h){console.log("error",h),Oe(e);let v=e.cache(o,"terminal").term;v.write(`\r
\x1B[91mError: `+h.message+`\x1B[0m\r
`),v.write(G),v.scrollToBottom()}g=document.querySelector(".cm-content"),g&&g.focus(),n.emit("render")}),n.on("stop",async()=>{if(e.panelHeight<=oe&&(e.panelHeight=e.savedPanelHeight),n.emit("open-panel"),n.emit("render"),e.isConnected)try{await t.interrupt()}catch(d){console.log("Stop failed:",d)}}),n.on("clear-terminal",()=>{e.cache(o,"terminal").term.clear(),n.emit("log:clear")}),n.on("terminal:write",d=>{e.cache(o,"terminal").term.write(d)}),n.on("terminal:write-prompt",()=>{e.cache(o,"terminal").term.write(G)}),n.on("open-panel",()=>{n.emit("stop-resizing-panel"),e.panelHeight=e.savedPanelHeight,n.emit("render"),setTimeout(()=>{e.cache(o,"terminal").resizeTerm()},200)}),n.on("close-panel",()=>{n.emit("stop-resizing-panel"),e.savedPanelHeight=e.panelHeight,e.panelHeight=0,n.emit("render")}),n.on("start-resizing-panel",d=>{e.dragStartY=d.clientY,e.dragStartHeight=e.panelHeight;const p=document.querySelector("#panel");p&&p.classList.add("resizing"),document.body.style.userSelect="none",document.body.style.cursor="grabbing",window.addEventListener("mousemove",e.resizePanel);const u=()=>{n.emit("stop-resizing-panel")};window.addEventListener("mouseup",u,{once:!0}),document.body.addEventListener("mouseleave",u,{once:!0}),document.querySelector("#tabs").addEventListener("mouseenter",u,{once:!0})}),n.on("stop-resizing-panel",()=>{const d=document.querySelector("#panel");d&&d.classList.remove("resizing"),document.body.style.userSelect="",document.body.style.cursor="",window.removeEventListener("mousemove",e.resizePanel),setTimeout(()=>e.cache(o,"terminal").resizeTerm(),50)}),{runCode:r,runCodeSelection:a,stopCode:l}}function rs(e,n){e.logs={isOpen:!1,messages:[],maxMessages:1e3,autoScroll:!0},n.on("toggle-log-sidebar",()=>{e.logs.isOpen=!e.logs.isOpen,n.emit("render"),e.logs.isOpen&&e.logs.autoScroll&&setTimeout(()=>{const t=document.querySelector("#log-terminal .xterm-viewport");t&&(t.scrollTop=t.scrollHeight)},100)}),n.on("log:add",t=>{console.debug("[Log Store] log:add event received:",t),e.logs.messages.push(t),e.logs.messages.length>e.logs.maxMessages&&e.logs.messages.shift();const o=new CustomEvent("log-terminal-write",{detail:t});console.debug("[Log Store] Dispatching log-terminal-write event:",t),window.dispatchEvent(o)}),n.on("log:clear",()=>{e.logs.messages=[];const t=new CustomEvent("log-terminal-clear");window.dispatchEvent(t),n.emit("render")}),n.on("log:toggle-autoscroll",()=>{e.logs.autoScroll=!e.logs.autoScroll,n.emit("render")}),n.on("start-resizing-log-sidebar",()=>{console.log("start-resizing-log-sidebar"),window.addEventListener("mousemove",e.resizeLogSidebar);const t=()=>{n.emit("stop-resizing-log-sidebar")};window.addEventListener("mouseup",t,{once:!0}),document.body.addEventListener("mouseleave",t,{once:!0})}),n.on("stop-resizing-log-sidebar",()=>{window.removeEventListener("mousemove",e.resizeLogSidebar)})}function as(e,n){n.on("toggle-system-menu",()=>{e.expandedSystem=!e.expandedSystem,n.emit("render")}),n.on("change-system-panel",t=>{e.activeSystemPanel=t,e.activeNetworkPanel=null,e.activePeripheralsPanel=null,e.activeExtension=null,e.activeExtensionPanel=null,e.systemSection=`system:${t}`,n.emit("render")})}function ls(e,n,t){const o=console.log;n.on("toggle-networks-menu",()=>{o("toggle-networks-menu"),e.expandedNetworks=!e.expandedNetworks,n.emit("render")}),n.on("change-network-panel",i=>{o("change-network-panel:",i),e.activeNetworkPanel=i,e.activeSystemPanel=null,e.activePeripheralsPanel=null,e.activeExtension=null,e.activeExtensionPanel=null,e.systemSection=`network:${i}`,i==="gps"&&!e.gpsDataLoaded&&e.isConnected&&n.emit("load-gps-data"),n.emit("render")}),n.on("load-ntp-config",async()=>{if(o("load-ntp-config"),!e.isConnected){console.warn("[NTP] Not connected to device");return}if(e.isLoadingNtpConfig){console.log("[NTP] Already loading config, skipping");return}try{e.isLoadingNtpConfig=!0;const s=await t.exec(`
from lib.sys import settings
import json

# Load config from settings API
config = {
    'server': settings.get("ntp.server", "pool.ntp.org"),
    'tz_offset': settings.get("ntp.tz_offset", 0.0),
    'timezone': settings.get("ntp.timezone", "UTC"),
    'auto_detect': settings.get("ntp.auto_detect", False),
    'auto_sync': settings.get("ntp.auto_sync", False)
}

print(json.dumps({'success': True, 'config': config}))
`);t.onNtpConfig&&t.onNtpConfig(s)}catch(i){console.error("[NTP] Failed to load config:",i),e.isLoadingNtpConfig=!1}}),n.on("save-ntp-config",async i=>{if(o("save-ntp-config",i),!e.isConnected){console.warn("[NTP] Not connected to device"),n.emit("ntp-config-save-error",new Error("Not connected"));return}try{const c=`
from lib.sys import settings
import json

config_json = '${JSON.stringify(i).replace(/'/g,"\\'")}'
config = json.loads(config_json)

# Save config using settings API
settings.set("ntp.server", config.get('server', config.get('server', 'pool.ntp.org')))
settings.set("ntp.tz_offset", config.get('tz_offset', config.get('tzOffset', 0.0)))
settings.set("ntp.timezone", config.get('timezone', 'UTC'))
settings.set("ntp.auto_detect", config.get('auto_detect', config.get('autoDetect', False)))
settings.set("ntp.auto_sync", config.get('auto_sync', config.get('autoSync', False)))

settings.save()

print(json.dumps({'success': True, 'message': 'NTP configuration saved successfully'}))
`,r=await t.exec(c);if(r&&r.success)e.ntpConfig={server:i.server||"pool.ntp.org",tzOffset:i.tz_offset??i.tzOffset??0,timezone:i.timezone||"UTC",autoDetect:i.auto_detect??i.autoDetect??!1,autoSync:i.auto_sync??i.autoSync??!1},n.emit("render"),n.emit("ntp-config-saved");else{const a=new Error(r?.error||"Save failed");throw n.emit("ntp-config-save-error",a),a}}catch(s){throw console.error("[NTP] Failed to save config:",s),alert(`Failed to save NTP configuration: ${s.message}`),n.emit("ntp-config-save-error",s),s}}),n.on("sync-ntp-time",async(i,s,c,r)=>{if(o("sync-ntp-time",i,s,c,r),!e.isConnected){console.warn("[NTP] Not connected to device");return}try{const l=`
from lib.network_helpers import sync_ntp_time
sync_ntp_time('${i}', ${s}, ${c?"True":"False"}, save_config=False)
`,d=await t.exec(l);if(t.onNtpSync){const p={autoDetect:c,autoSync:r,server:i,tzOffset:s};t.onNtpSync(d,p)}}catch(a){console.error("[NTP] Failed to sync time:",a),alert(`Failed to sync NTP time: ${a.message}`)}}),n.on("load-mqtt-config",async()=>{if(o("load-mqtt-config"),!e.isConnected){console.warn("[MQTT] Not connected to device");return}if(e.isLoadingMqttConfig){console.log("[MQTT] Already loading config, skipping");return}try{e.isLoadingMqttConfig=!0;const s=await t.exec(`
from lib.sys import settings
import json

# Load config from settings API
config = {
    'server': settings.get("mqtt.server", ""),
    'port': settings.get("mqtt.port", 1883),
    'username': settings.get("mqtt.username", ""),
    'password': settings.get("mqtt.password", ""),
    'tls': settings.get("mqtt.tls", False),
    'ca_cert_path': settings.get("mqtt.ca_cert_path", ""),
    'topic_prefix': settings.get("mqtt.topic_prefix", "")
}

print(json.dumps({'success': True, 'config': config}))
`);t.onMqttConfig&&t.onMqttConfig(s)}catch(i){console.error("[MQTT] Failed to load config:",i),e.isLoadingMqttConfig=!1}}),n.on("save-mqtt-config",async i=>{if(o("save-mqtt-config",i),!e.isConnected){console.warn("[MQTT] Not connected to device");return}try{const c=`
from lib.sys import settings
import json

config_json = '${JSON.stringify(i).replace(/'/g,"\\'")}'
config = json.loads(config_json)

# Save config using settings API
settings.set("mqtt.server", config.get('server', ''))
settings.set("mqtt.port", config.get('port', 1883))
settings.set("mqtt.username", config.get('username', ''))
settings.set("mqtt.password", config.get('password', ''))
settings.set("mqtt.tls", config.get('tls', False))
settings.set("mqtt.ca_cert_path", config.get('ca_cert_path', ''))
settings.set("mqtt.topic_prefix", config.get('topic_prefix', ''))

settings.save()

print(json.dumps({'success': True, 'message': 'MQTT configuration saved successfully'}))
`,r=await t.exec(c);t.onMqttConfigSave&&t.onMqttConfigSave(r),e.mqttConfig=i,n.emit("render")}catch(s){console.error("[MQTT] Failed to save config:",s),alert(`Failed to save MQTT configuration: ${s.message}`)}}),n.on("load-wwan-config",async()=>{if(o("load-wwan-config"),!e.isConnected){console.warn("[WWAN] Not connected to device");return}if(e.isLoadingWwanConfig){console.log("[WWAN] Already loading config, skipping");return}try{e.isLoadingWwanConfig=!0;const s=await t.exec(`
from lib.sys import settings
from lib.network import wwan
import json

# Load config from settings API
config = wwan.load_config()

# Map auto_init to auto_init_modem for client compatibility
config['auto_init_modem'] = config.get('auto_init', True)

# Get status from network.wwan module
status = wwan.get_status()

print(json.dumps({'success': True, 'config': config, 'status': status}))
`);t.onWwanConfig&&t.onWwanConfig(s)}catch(i){console.error("[WWAN] Failed to load config:",i),e.isLoadingWwanConfig=!1}}),n.on("save-wwan-config",async i=>{if(o("save-wwan-config",i),!e.isConnected){console.warn("[WWAN] Not connected to device");return}try{const c=`
from lib.sys import settings
import json

config_json = '${JSON.stringify(i).replace(/'/g,"\\'")}'
config = json.loads(config_json)

# Save config using settings API
settings.set("wwan.apn", config.get('apn', ''))
settings.set("wwan.username", config.get('username', ''))
settings.set("wwan.password", config.get('password', ''))
# Map auto_init_modem to auto_init for settings
settings.set("wwan.auto_init", config.get('auto_init_modem', config.get('auto_init', True)))
settings.set("wwan.mobile_data_enabled", config.get('mobile_data_enabled', False))

settings.save()

print(json.dumps({'success': True, 'message': 'WWAN configuration saved successfully'}))
`,r=await t.exec(c);t.onWwanConfigSave&&t.onWwanConfigSave(r),e.wwanConfig=i,n.emit("render")}catch(s){console.error("[WWAN] Failed to save config:",s),alert(`Failed to save WWAN configuration: ${s.message}`)}}),n.on("load-modem-status",async()=>{if(o("load-modem-status"),!e.isConnected){console.warn("[Modem] Not connected to device");return}if(e.isLoadingModemStatus){console.log("[Modem] Already loading status, skipping");return}try{e.isLoadingModemStatus=!0;const s=await t.exec(`
from lib.network import wwan
import json

status = wwan.get_status()
print(json.dumps(status))
`);t.onModemStatus&&t.onModemStatus(s)}catch(i){console.error("[Modem] Failed to load status:",i),e.isLoadingModemStatus=!1}}),n.on("load-can-config",async()=>{if(o("load-can-config"),!e.isConnected){console.warn("[CAN] Not connected to device");return}if(e.isLoadingCanConfig){console.log("[CAN] Already loading config, skipping");return}try{e.isLoadingCanConfig=!0;const s=await t.exec(`
from lib.sys import settings
from lib.sys import board
import json

# Hardware pins from board.json (immutable)
try:
    can_bus = board.can("can0")
    tx_pin = can_bus.tx
    rx_pin = can_bus.rx
except:
    tx_pin = None
    rx_pin = None

# User preferences from settings
config = {
    'txPin': tx_pin,
    'rxPin': rx_pin,
    'bitrate': settings.get("can.bitrate", 500000),
    'enabled': settings.get("can.enabled", False),
    'mode': settings.get("can.mode", "NORMAL")
}

print(json.dumps({'success': True, 'config': config}))
`);t.onCanConfig&&t.onCanConfig(s)}catch(i){console.error("[CAN] Failed to load config:",i),e.isLoadingCanConfig=!1}}),n.on("save-can-config",async i=>{if(o("save-can-config",i),!e.isConnected){console.warn("[CAN] Not connected to device");return}try{const c=`
from lib.sys import settings
import json

config_json = '${JSON.stringify(i).replace(/'/g,"\\'")}'
config = json.loads(config_json)

# Save user preferences only (pins come from board.json, not settings)
settings.set("can.bitrate", config.get('bitrate', 500000))
settings.set("can.enabled", config.get('enabled', False))
settings.set("can.mode", config.get('mode', "NORMAL"))

settings.save()

print(json.dumps({'success': True, 'message': 'CAN configuration saved successfully'}))
`,r=await t.exec(c);t.onCanConfigSave&&t.onCanConfigSave(r),e.canConfig=i,n.emit("render")}catch(s){console.error("[CAN] Failed to save config:",s),alert(`Failed to save CAN configuration: ${s.message}`)}}),n.on("load-vpn-config",async()=>{if(o("load-vpn-config"),!e.isConnected){console.warn("[VPN] Not connected to device");return}if(e.isLoadingVpnConfig){console.log("[VPN] Already loading config, skipping");return}try{e.isLoadingVpnConfig=!0;const s=await t.exec(`
from lib.sys import settings
import json

# Load VPN config from settings API
config = {
    'hostname': settings.get("vpn.hostname", ""),
    'join_code': settings.get("vpn.join_code", ""),
    'auto_connect': settings.get("vpn.auto_connect", False),
    'enabled': settings.get("vpn.enabled", False)
}

print(json.dumps({'success': True, 'config': config}))
`);t.onVpnConfig&&t.onVpnConfig(s)}catch(i){console.error("[VPN] Failed to load config:",i),e.isLoadingVpnConfig=!1}}),n.on("vpn-save-config",async i=>{if(o("vpn-save-config",i),!e.isConnected){console.warn("[VPN] Not connected to device");return}try{const c=`
from lib.sys import settings
import json

config_json = '${JSON.stringify(i).replace(/'/g,"\\'")}'
config = json.loads(config_json)

# Save VPN config using settings API
settings.set("vpn.hostname", config.get('hostname', ''))
settings.set("vpn.join_code", config.get('join_code', ''))
settings.set("vpn.auto_connect", config.get('auto_connect', False))
settings.set("vpn.enabled", config.get('enabled', False))

settings.save()

print(json.dumps({'success': True, 'message': 'VPN configuration saved successfully'}))
`,r=await t.exec(c);t.onVpnConfigSave&&t.onVpnConfigSave(r),e.vpnConfig=i,e.vpnConfigLoaded=!0,n.emit("render")}catch(s){console.error("[VPN] Failed to save config:",s),alert(`Failed to save VPN configuration: ${s.message}`)}}),n.on("vpn-connect",async i=>{if(o("vpn-connect",i),!e.isConnected){console.warn("[VPN] Not connected to device");return}try{const s=`
import husarnet
import json

try:
    # Initialize Husarnet client first
    husarnet.init()
    
    # Join with hostname and join_code as separate arguments
    husarnet.join('${i.hostname}', '${i.join_code}')
    
    ipv6 = husarnet.get_ip()
    print(json.dumps({'success': True, 'ipv6': ipv6, 'message': 'Connected to Husarnet'}))
except Exception as e:
    import sys
    sys.print_exception(e)
    print(json.dumps({'success': False, 'error': str(e)}))
`,c=await t.exec(s);t.onVpnConnect&&t.onVpnConnect(c),e.vpnConfig=i,e.vpnConfigLoaded=!0,setTimeout(()=>{n.emit("refresh-networks")},2e3),n.emit("render")}catch(s){console.error("[VPN] Failed to connect:",s),alert(`Failed to connect to VPN: ${s.message}`)}}),n.on("vpn-disconnect",async()=>{if(o("vpn-disconnect"),!e.isConnected){console.warn("[VPN] Not connected to device");return}try{const s=await t.exec(`
import husarnet
import json

try:
    husarnet.leave()
    print(json.dumps({'success': True, 'message': 'Disconnected from Husarnet'}))
except Exception as e:
    import sys
    sys.print_exception(e)
    print(json.dumps({'success': False, 'error': str(e)}))
`);t.onVpnDisconnect&&t.onVpnDisconnect(s),e.vpnConfig&&(e.vpnConfig.enabled=!1),setTimeout(()=>{n.emit("refresh-networks")},1e3),n.emit("render")}catch(i){console.error("[VPN] Failed to disconnect:",i),alert(`Failed to disconnect VPN: ${i.message}`)}}),n.on("load-gps-data",async()=>{if(o("load-gps-data"),!e.isConnected){console.warn("[GPS] Not connected to device");return}if(e.isLoadingGpsData){console.log("[GPS] Already loading GPS data, skipping");return}try{e.isLoadingGpsData=!0,n.emit("render");const s=await t.exec(`
import usbmodem
import json
try:
    info = usbmodem.gps_info()
    # Convert to dict and serialize as JSON
    result = {}
    if 'latitude' in info:
        result['latitude'] = float(info['latitude'])
    if 'longitude' in info:
        result['longitude'] = float(info['longitude'])
    if 'altitude' in info:
        result['altitude'] = float(info['altitude'])
    if 'satellites' in info:
        result['satellites'] = int(info['satellites'])
    if 'date' in info:
        result['date'] = str(info['date'])
    if 'time' in info:
        result['time'] = str(info['time'])
    if 'speed' in info:
        result['speed'] = float(info['speed'])
    if 'heading' in info:
        result['heading'] = float(info['heading'])
    print(json.dumps({'success': True, 'data': result}))
except Exception as e:
    import sys
    sys.print_exception(e)
    print(json.dumps({'success': False, 'error': str(e)}))
`);s&&s.success&&s.data?(e.gpsData=s.data,e.gpsDataLoaded=!0,console.log("[GPS] GPS data loaded:",e.gpsData)):(e.gpsData={},e.gpsDataLoaded=!0)}catch(i){console.error("[GPS] Failed to load GPS data:",i),e.gpsData={},e.gpsDataLoaded=!0}finally{e.isLoadingGpsData=!1,n.emit("render")}}),n.on("refresh-gps-data",async()=>{o("refresh-gps-data"),e.gpsDataLoaded=!1,n.emit("load-gps-data")}),n.on("refresh-system-info",async()=>{if(!e.isConnected){console.warn("[System Info] Not connected, cannot refresh system info");return}if(e.isLoadingSystemInfo){console.log("[System Info] Already loading, skipping");return}e.isLoadingSystemInfo=!0,n.emit("render");try{const i=await ni(t);e.systemInfo=i,console.log("[System Info] Loaded:",i)}catch(i){console.error("[System Info] Failed to load:",i),e.systemInfo=null}finally{e.isLoadingSystemInfo=!1,n.emit("render")}}),n.on("refresh-networks",async()=>{if(o("refresh-networks"),!e.isConnected){console.warn("[Networks] Not connected, cannot refresh networks");return}if(e.isLoadingNetworks){console.log("[Networks] Already loading, skipping");return}e.isLoadingNetworks=!0,n.emit("render");try{const i=await ti(t);e.networksInfo=i,console.log("[Networks] Loaded:",i)}catch(i){console.error("[Networks] Failed to load:",i),e.networksInfo=null}finally{e.isLoadingNetworks=!1,n.emit("render")}}),n.on("load-eth-config",async()=>{if(o("load-eth-config"),!e.isConnected){console.warn("[Ethernet] Not connected to device");return}if(e.isLoadingEthConfig){console.log("[Ethernet] Already loading config, skipping");return}try{e.isLoadingEthConfig=!0,n.emit("render");const s=await t.exec(`
from lib.sys import settings
from lib.network import eth
import json

# Load config from settings API
config = {
    'dhcp': settings.get("ethernet.dhcp", True),
    'static_ip': settings.get("ethernet.static_ip", None)
}

# Get status from network.eth module
status = eth.get_status()

print(json.dumps({'success': True, 'config': config, 'status': status}))
`);t.onEthConfig&&t.onEthConfig(s)}catch(i){console.error("[Ethernet] Failed to load config:",i),e.isLoadingEthConfig=!1,n.emit("render")}}),n.on("save-eth-config",async i=>{if(o("save-eth-config",i),!e.isConnected){console.warn("[Ethernet] Not connected to device");return}try{const c=`
from lib.sys import settings
import json

config_json = '${JSON.stringify(i).replace(/'/g,"\\'")}'
config = json.loads(config_json)

# Save config using settings API
settings.set("ethernet.dhcp", config.get('dhcp', True))
if config.get('static_ip'):
    settings.set("ethernet.static_ip", config.get('static_ip'))
else:
    settings.set("ethernet.static_ip", None)

settings.save()

print(json.dumps({'success': True, 'message': 'Ethernet configuration saved'}))
`,r=await t.exec(c);t.onEthConfigSave&&t.onEthConfigSave(r),e.ethConfig=i,n.emit("render")}catch(s){console.error("[Ethernet] Failed to save config:",s),alert(`Failed to save Ethernet configuration: ${s.message}`)}}),n.on("init-ethernet",async()=>{if(o("init-ethernet"),!e.isConnected){console.warn("[Ethernet] Not connected to device");return}try{e.isInitializingEth=!0,n.emit("render");const s=await t.exec(`
from lib.network import eth
import json
import time

# Initialize Ethernet (uses settings internally)
lan = eth.init()

if lan is None:
    print(json.dumps({'success': False, 'error': 'Ethernet not available or initialization failed'}))
else:
    # Wait briefly for link/DHCP
    for _ in range(20):
        status = eth.get_status()
        if status.get('connected') or status.get('ip'):
            break
        time.sleep_ms(250)
    
    status = eth.get_status()
    print(json.dumps({'success': True, 'status': status}))
`);t.onEthInit&&t.onEthInit(s),e.isInitializingEth=!1,n.emit("refresh-networks")}catch(i){console.error("[Ethernet] Failed to initialize:",i),e.isInitializingEth=!1,alert(`Failed to initialize Ethernet: ${i.message}`),n.emit("render")}}),n.on("refresh-eth-status",async()=>{if(o("refresh-eth-status"),!!e.isConnected)try{const s=await t.exec(`
from lib.network import eth
import json
print(json.dumps(eth.get_status()))
`);t.onEthStatus&&t.onEthStatus(s)}catch(i){console.error("[Ethernet] Failed to get status:",i)}})}function cs(e,n,t){const o=console.log;n.on("toggle-peripherals-menu",()=>{o("toggle-peripherals-menu"),e.expandedPeripherals=!e.expandedPeripherals,n.emit("render")}),n.on("change-peripherals-panel",i=>{o("change-peripherals-panel:",i),e.activePeripheralsPanel=i,e.activeNetworkPanel=null,e.activeSystemPanel=null,e.activeExtension=null,e.activeExtensionPanel=null,e.systemSection=`peripherals:${i}`,i==="gps"&&e.isConnected&&!e.gpsDataLoaded&&!e.isLoadingGpsData&&n.emit("load-gps-data"),i==="sdcard"&&e.isConnected&&(!e.sdcardConfigLoaded&&!e.isLoadingSdcardConfig&&n.emit("load-sdcard-config"),e.sdcardInfo=null,n.emit("sdcard-get-info")),n.emit("render")}),n.on("load-sdcard-config",async()=>{if(o("load-sdcard-config"),!e.isConnected){console.warn("[SD Card] Not connected to device");return}if(e.isLoadingSdcardConfig){console.log("[SD Card] Already loading config, skipping");return}try{e.isLoadingSdcardConfig=!0;const s=await t.exec(`
import json
try:
    with open('/settings/sdcard.json', 'r') as f:
        config = json.load(f)
    print(json.dumps({'success': True, 'config': config}))
except OSError:
    print(json.dumps({'success': True, 'config': {'mountPoint': '/sd', 'autoMount': False}}))
except Exception as e:
    print(json.dumps({'success': False, 'error': str(e)}))
`);t.onSdcardConfig&&t.onSdcardConfig(s)}catch(i){console.error("[SD Card] Failed to load config:",i),e.isLoadingSdcardConfig=!1}}),n.on("save-sdcard-config",async i=>{if(o("save-sdcard-config",i),!e.isConnected){console.warn("[SD Card] Not connected to device");return}try{const c=`
import json
import os
config_json = '${JSON.stringify(i).replace(/'/g,"\\'")}'
config = json.loads(config_json)

# Ensure settings directory exists
settings_dir = '/settings'
try:
    os.mkdir(settings_dir)
except OSError:
    pass  # Directory already exists

# Write config
with open(settings_dir + '/sdcard.json', 'w') as f:
    json.dump(config, f)

print(json.dumps({'success': True, 'message': 'SD Card configuration saved successfully'}))
`,r=await t.exec(c);t.onSdcardConfigSave&&t.onSdcardConfigSave(r),e.sdcardConfig=i,n.emit("render")}catch(s){console.error("[SD Card] Failed to save config:",s),alert(`Failed to save SD Card configuration: ${s.message}`)}}),n.on("sdcard-unmount",async()=>{if(o("sdcard-unmount"),!e.isConnected){console.warn("[SD Card] Not connected to device");return}if(e.isUnmountingSDCard){console.log("[SD Card] Already unmounting, skipping");return}try{e.isUnmountingSDCard=!0,n.emit("render");const c=`
import os
import json

mount_point = '${(e.sdcardConfig||{mountPoint:"/sd"}).mountPoint||"/sd"}'

try:
    # Unmount the SD card
    os.umount(mount_point)
    print(json.dumps({'success': True, 'message': 'SD card unmounted successfully'}))
except Exception as e:
    print(json.dumps({'success': False, 'error': str(e)}))
`,r=await t.exec(c);t.onSdcardUnmount&&t.onSdcardUnmount(r)}catch(i){console.error("[SD Card] Failed to unmount:",i),e.isUnmountingSDCard=!1,alert(`Failed to unmount SD card: ${i.message}`),n.emit("render")}}),n.on("sdcard-mount",async()=>{if(o("sdcard-mount"),!e.isConnected){console.warn("[SD Card] Not connected to device");return}if(e.isMountingSDCard){console.log("[SD Card] Already mounting, skipping");return}try{e.isMountingSDCard=!0,n.emit("render");const c=`
import json
import time
from machine import Pin, SDCard
from lib.sys import board
import os

result = {'success': False, 'log': []}

def log_msg(msg):
    result['log'].append(msg)
    print(msg)

try:
    # Load board configuration
    log_msg("Loading board configuration...")
    log_msg(f"Board: {board.id.name}")
    
    # Get SD card hardware config from board
    if not board.has("sdcard"):
        log_msg("✗ No SD card configuration found for this board")
        result['error'] = 'No SD card configuration found for this board'
        print(json.dumps(result))
    else:
        sd_device = board.device('sdcard')
        sd_bus = board.sdmmc('sdcard')
        
        # Determine bus width (4-bit or 1-bit)
        width = 4 if hasattr(sd_bus, 'd3') else 1
        
        # Extract power control settings
        power_ctrl = getattr(sd_device, 'power_control', {})
        power_pin = power_ctrl.get('pin', 45)
        power_active_low = power_ctrl.get('active_low', True)
        
        # Normalize to simpler structure
        sd_hw_norm = {
            'pins': {
                'power': power_pin,
                'clk': sd_bus.clk,
                'cmd': sd_bus.cmd,
                'd0': sd_bus.d0,
                'd1': getattr(sd_bus, 'd1', None),
                'd2': getattr(sd_bus, 'd2', None),
                'd3': getattr(sd_bus, 'd3', None)
            },
            'slot': 0,  # Assuming slot 0 for sdcard
            'width': width,
            'power_active_low': power_active_low
        }
        log_msg(f"Slot: {sd_hw_norm['slot']}, Width: {sd_hw_norm['width']}-bit")
        
        # Power cycle the card
        log_msg("Power cycling SD card...")
        sd_power = Pin(power_pin, Pin.OUT)
        sd_power.value(1 if power_active_low else 0)  # Disable power
        time.sleep_ms(200)
        sd_power.value(0 if power_active_low else 1)  # Enable power
        time.sleep_ms(500)
        log_msg("✓ Power cycle complete")
        
        # Initialize SD card
        log_msg("Initializing SD card...")
        import gc
        gc.collect()
        time.sleep_ms(200)
        
        pins = sd_hw_norm['pins']
        data_pins = (pins['d0'], pins['d1'], pins['d2'], pins['d3']) if sd_hw_norm['width'] == 4 else (pins['d0'],)
        
        sd = SDCard(
            slot=sd_hw_norm['slot'],
            width=sd_hw_norm['width'],
            sck=pins['clk'],
            cmd=pins['cmd'],
            data=data_pins,
            freq=400000
        )
        
        info = sd.info()
        capacity_gb = (info[0] * info[1]) / (1024**3)
        log_msg(f"✓ {capacity_gb:.1f} GB card detected")
        
        # Mount filesystem
        mount_point = '${(e.sdcardConfig||{mountPoint:"/sd"}).mountPoint||"/sd"}'
        log_msg(f"Mounting to {mount_point}...")
        os.mount(sd, mount_point)
        log_msg("✓ Mounted")
        
        # Get filesystem info
        stat = os.statvfs(mount_point)
        total_mb = (stat[0] * stat[2]) / (1024**2)
        free_mb = (stat[0] * stat[3]) / (1024**2)
        used_mb = total_mb - free_mb
        
        log_msg(f"Total: {total_mb:.0f} MB")
        log_msg(f"Free:  {free_mb:.0f} MB")
        log_msg(f"Used:  {used_mb:.0f} MB ({used_mb/total_mb*100:.1f}%)")
        
        result['success'] = True
        result['info'] = {
            'mountPoint': mount_point,
            'totalSize': int(total_mb * 1024 * 1024),
            'freeSize': int(free_mb * 1024 * 1024),
            'usedSize': int(used_mb * 1024 * 1024)
        }
        
        print(json.dumps(result))

except Exception as e:
    import sys
    log_msg(f"✗ Failed: {e}")
    result['error'] = str(e)
    print(json.dumps(result))
`,r=await t.exec(c);t.onSdcardMount&&t.onSdcardMount(r)}catch(i){console.error("[SD Card] Failed to mount:",i),e.isMountingSDCard=!1,alert(`Failed to mount SD card: ${i.message}`),n.emit("render")}}),n.on("sdcard-get-info",async()=>{if(o("sdcard-get-info"),!e.isConnected){console.warn("[SD Card] Not connected to device");return}if(e.isLoadingSdcardInfo){console.log("[SD Card] Already loading info, skipping");return}try{e.isLoadingSdcardInfo=!0,n.emit("render");const c=`
import os
import json

mount_point = '${(e.sdcardConfig||{mountPoint:"/sd"}).mountPoint||"/sd"}'

try:
    # Check if mount point exists using os.stat() (NOT listdir - crashes P4+C6)
    os.stat(mount_point)
    
    # Get filesystem stats - same logic as SD Card Mount Test script
    stat = os.statvfs(mount_point)
    # statvfs returns: (bsize, frsize, blocks, bfree, bavail, files, ffree, favail, flags, namemax)
    block_size = stat[0]
    total_blocks = stat[2]
    free_blocks = stat[3]
    
    total_size = block_size * total_blocks
    free_size = block_size * free_blocks
    used_size = total_size - free_size
    
    info = {
        'mountPoint': mount_point,
        'totalSize': total_size,
        'freeSize': free_size,
        'usedSize': used_size,
        'blockSize': block_size
    }
    print(json.dumps({'success': True, 'info': info}))
    
except OSError as e:
    # Mount point doesn't exist or not mounted
    print(json.dumps({'success': False, 'error': f'SD Card not mounted at {mount_point}'}))
except Exception as e:
    print(json.dumps({'success': False, 'error': str(e)}))
`,r=await t.exec(c);t.onSdcardInfo&&t.onSdcardInfo(r)}catch(i){console.error("[SD Card] Failed to get info:",i),e.isLoadingSdcardInfo=!1,e.sdcardInfo={error:`Failed to get storage info: ${i.message}`},n.emit("render")}})}const ds=1e4;let Ie=null,Ye=!1;function us(e,n,t){Qe(),Ye=!0;let o=null;Ie=setInterval(async()=>{if(!Ye)return;if(!n.isConnected||!e){Qe();return}const i=n.isTransferring,s=n.installingDependencies,c=e.isFileOperationActive&&e.isFileOperationActive(),r=e.isCommandRunning&&e.isCommandRunning();if(i||s||c||r){const a=i?"transferring":c?"fileOp":r?"command":"deps";a!==o&&(console.log(`[Store] Status info polling paused: ${a}`),o=a);return}o&&(console.log("[Store] Status info polling resuming"),o=null);try{const a=await e.exec("getStatusInfo()");a&&(n.statusInfo=a,rn(a,n.temperatureUnit||"degC"))}catch(a){console.debug("[Store] Status info poll failed:",a.message)}},ds)}function Qe(){Ye=!1,Ie&&(clearInterval(Ie),Ie=null,console.log("[Store] Stopped status info polling"))}function ps(e,n,t,o,i){n.on("disconnected",()=>{Qe(),e.isConnected=!1,e.connectionMode="none",e.panelHeight=oe,e.boardFiles=[],e.boardNavigationPath="/",e.filesLoadedOnce=!1,e.isTransferring=!1,e.transferringProgress="",e.isSaving=!1,e.savingProgress=0,e.isRemoving=!1,e.bannerDisplayed=!1,e.systemInfoAttempted=!1,n.emit("refresh-files"),n.emit("render"),e.isResettingHard&&(e.isResettingHard=!1,setTimeout(()=>{n.emit("open-connection-dialog")},100))}),n.on("disconnect",async()=>{await t.disconnect()}),n.on("connection-timeout",async()=>{e.isConnected=!1,e.isConnecting=!1,e.isConnectionDialogOpen=!0,n.emit("render")}),n.on("connect",async()=>{n.emit("open-connection-dialog")}),n.on("connect-webrepl",async({wsUrl:s,password:c})=>{s&&localStorage.setItem("webrepl-url",s),c&&localStorage.setItem("webrepl-password",c),e.isConnecting=!0,n.emit("render"),I(e);const r=e.cache(H,"terminal");r&&r.term&&r.bindInput(e,t),i(e);try{await t.connect(s,c),e.isConnecting=!1,e.isConnected=!0,e.connectionMode="webrepl",I(e),e.boardNavigationPath="/",e.connectedPort=s,o(),n.emit("render"),e.systemSection==="file-manager"&&n.emit("refresh-files"),t.onConnectionClosed(()=>n.emit("disconnected")),t.subscribe("status_info",l=>{const d=!e.statusInfo&&l;e.statusInfo=l,d?n.emit("render"):rn(l,e.temperatureUnit||"degC")}),t.subscribe("log",l=>{console.debug("[Connection] LOG event handler called with:",l),n.emit("log:add",l)}),t.onPlotData=l=>{},t.onDisplayUi=l=>{console.log("[ScriptO UI] Display UI command received:",l),n.emit("open-scriptos-ui-modal",l)},t.onWwanStatus=l=>{console.log("[WWAN] Status event received:",l),e.wwanStatus=l,n.emit("render")},t.onMqttConfig=l=>{console.log("[MQTT] Config received:",l),e.isLoadingMqttConfig=!1,e.mqttConfigLoaded=!0,l.success&&l.config?e.mqttConfig=l.config:e.mqttConfig={},n.emit("render")},t.onMqttConfigSave=l=>{console.log("[MQTT] Config save response:",l),l.success?n.emit("render"):alert(`Failed to save MQTT configuration: ${l.error||"Unknown error"}`)},t.onWwanConfig=l=>{console.log("[WWAN] Config received:",l),e.isLoadingWwanConfig=!1,e.wwanConfigLoaded=!0,l.success&&l.config?(e.wwanConfig=l.config,e.wwanConfig.auto_init_modem===void 0&&(e.wwanConfig.auto_init_modem=!0)):e.wwanConfig={auto_init_modem:!0},n.emit("render")},t.onWwanConfigSave=l=>{console.log("[WWAN] Config save response:",l),l.success?n.emit("render"):alert(`Failed to save WWAN configuration: ${l.error||"Unknown error"}`)},t.onModemStatus=l=>{console.log("[Modem] Status received:",l),e.isLoadingModemStatus=!1,e.modemStatusLoaded=!0,e.modemStatus=l,n.emit("render")},t.onNtpSync=(l,d)=>{if(console.log("[NTP] Sync response:",l),l.success){e.ntpConfig||(e.ntpConfig={server:"pool.ntp.org",tzOffset:0,timezone:"UTC",autoDetect:!1,autoSync:!1});const p=d?.autoDetect??e.ntpConfig.autoDetect??!1,u=d?.autoSync??e.ntpConfig.autoSync??!1,f=e.ntpConfig.timezone??"UTC";l.ntp_server?e.ntpConfig.server=l.ntp_server:d?.server&&(e.ntpConfig.server=d.server),l.tz_offset!==void 0?e.ntpConfig.tzOffset=l.tz_offset:d?.tzOffset!==void 0&&(e.ntpConfig.tzOffset=d.tzOffset),e.ntpConfig.autoDetect=p,e.ntpConfig.autoSync=u,e.ntpConfig.timezone=f,e.ntpSyncResult={utc:l.utc,local:l.local,timestamp:Date.now()},n.emit("render")}else alert(`NTP sync failed: ${l.error||"Unknown error"}`)},t.onNtpConfig=l=>{console.log("[NTP] Config received:",l),e.isLoadingNtpConfig=!1,e.ntpConfigLoaded=!0,l.success&&l.config&&(e.ntpConfig={server:l.config.server||"pool.ntp.org",tzOffset:l.config.tz_offset||0,timezone:l.config.timezone||"UTC",autoDetect:l.config.auto_detect||!1,autoSync:l.config.auto_sync||!1}),n.emit("render")},t.onNtpConfigSave=l=>{if(console.log("[NTP] Config save response:",l),l.success)n.emit("render");else{const d=new Error(l.error||"Unknown error");n.emit("ntp-config-save-error",d),alert(`Failed to save NTP configuration: ${d.message}`)}},t.onCanConfig=l=>{console.log("[CAN] Config received:",l),e.isLoadingCanConfig=!1,e.canConfigLoaded=!0,l.success&&l.config&&(e.canConfig={txPin:l.config.txPin||5,rxPin:l.config.rxPin||4,bitrate:l.config.bitrate||5e5,enabled:l.config.enabled!==void 0?l.config.enabled:!0,loopback:l.config.loopback||!1},n.emit("render"))},t.onCanConfigSave=l=>{console.log("[CAN] Config save response:",l),l.success?(n.emit("render"),alert("CAN configuration saved successfully. Device restart required for changes to take effect.")):alert(`Failed to save CAN configuration: ${l.error||"Unknown error"}`)},t.onVpnConfig=l=>{console.log("[VPN] Config received:",l),e.isLoadingVpnConfig=!1,e.vpnConfigLoaded=!0,l.success&&l.config?e.vpnConfig={hostname:l.config.hostname||"",join_code:l.config.join_code||"",auto_connect:l.config.auto_connect||!1,enabled:l.config.enabled||!1}:e.vpnConfig={hostname:"",join_code:"",auto_connect:!1,enabled:!1},n.emit("render")},t.onVpnConfigSave=l=>{console.log("[VPN] Config save response:",l),l.success?n.emit("render"):alert(`Failed to save VPN configuration: ${l.error||"Unknown error"}`)},t.onVpnConnect=l=>{console.log("[VPN] Connect response:",l),l.success?(alert(l.message||"Connected to VPN successfully!"),n.emit("refresh-networks")):alert(`Failed to connect to VPN: ${l.error||"Unknown error"}`),n.emit("render")},t.onVpnDisconnect=l=>{console.log("[VPN] Disconnect response:",l),l.success?(alert(l.message||"VPN disconnected."),n.emit("refresh-networks")):alert(`Failed to disconnect VPN: ${l.error||"Unknown error"}`),n.emit("render")},t.onVpnInfo=l=>{console.log("[VPN] Info received:",l),e.networksInfo&&(e.networksInfo.vpn=l),n.emit("render")},t.onSdcardConfig=l=>{console.log("[SD Card] Config received:",l),e.isLoadingSdcardConfig=!1,e.sdcardConfigLoaded=!0,l.success&&l.config?e.sdcardConfig={mountPoint:l.config.mountPoint||"/sd",autoMount:l.config.autoMount||!1}:e.sdcardConfig={mountPoint:"/sd",autoMount:!1},n.emit("render")},t.onSdcardConfigSave=l=>{console.log("[SD Card] Config save response:",l),l.success?n.emit("render"):alert(`Failed to save SD Card configuration: ${l.error||"Unknown error"}`)},t.onSdcardInfo=l=>{console.log("[SD Card] Info received:",l),e.isLoadingSdcardInfo=!1,l.success&&l.info?e.sdcardInfo=l.info:e.sdcardInfo={error:l.error||"Failed to get storage information"},n.emit("render")},t.onSdcardMount=l=>{if(console.log("[SD Card] Mount response:",l),e.isMountingSDCard=!1,l.success){const d=l.log?l.log.join(`
`):"SD card mounted successfully";console.log(`[SD Card] Mount log:
`+d),l.info&&(e.sdcardInfo=l.info)}else{const d=l.error||"Unknown error",p=l.log?`

Log:
`+l.log.join(`
`):"";alert("Failed to mount SD card: "+d+p),e.sdcardInfo={error:d}}n.emit("render")},t.onSdcardUnmount=l=>{if(console.log("[SD Card] Unmount response:",l),e.isUnmountingSDCard=!1,l.success)console.log("[SD Card] Unmounted successfully"),e.sdcardInfo=null;else{const d=l.error||"Unknown error";alert("Failed to unmount SD card: "+d)}n.emit("render")},t.onGpioConfig=l=>{console.log("[GPIO] Config received:",l),e.isLoadingGpioConfig=!1,e.gpioConfigLoaded=!0,l.success&&l.config?e.gpioConfig=l.config:(l.chipInfo?e.gpioConfig={version:"1.0",assignments:{OUT:{digital:{PP:[],HS:[],LS:[]}},IN:{digital:{PU:[],PD:[],FLOAT:[]}},SPI0:{MISO:null,MOSI:null,SCLK:null,CS:null},SPI1:{MISO:null,MOSI:null,SCLK:null,CS:null},I2C0:{SDA:null,SCL:null},I2C1:{SDA:null,SCL:null},UART0:{TXD:null,RXD:null},UART1:{TXD:null,RXD:null},UART2:{TXD:null,RXD:null},CAN:{TX:null,RX:null},PWM:{channels:{}},NEO:{DIN:null,count:0},BUZZ:{PWM:null},BOOT:{pin:0,mode:"INPUT_PULLUP"},SDCARD:{CMD:null,CLK:null,D0:null,D1:null,D2:null,D3:null,mode:"SPI"},BRIDGE:{0:{HS:null,LS:null},1:{HS:null,LS:null}},USB:{DP:null,DM:null,enabled:!1}},metadata:{...l.chipInfo,board:l.chipInfo.board||"Unknown",modified:null}}:e.gpioConfig=null,console.warn("[GPIO] Config not found, using defaults with chip info")),n.emit("render")},t.onGpioConfigSave=l=>{console.log("[GPIO] Config save response:",l),l.success?(alert("GPIO configuration saved successfully"),n.emit("render")):alert(`Failed to save GPIO configuration: ${l.error||"Unknown error"}`)},t.onEthConfig=l=>{console.log("[Ethernet] Config received:",l),e.isLoadingEthConfig=!1,e.ethConfigLoaded=!0,l.success?(e.ethConfig=l.config||{},e.ethStatus=l.status||{}):(e.ethConfig={enabled:!0,dhcp:!0},console.warn("[Ethernet] Config not found, using defaults")),n.emit("render")},t.onEthConfigSave=l=>{console.log("[Ethernet] Config save response:",l),l.success?alert("Ethernet configuration saved successfully"):alert(`Failed to save Ethernet configuration: ${l.error||"Unknown error"}`),n.emit("render")},t.onEthInit=l=>{console.log("[Ethernet] Init response:",l),e.isInitializingEth=!1,l.success&&l.status?(e.ethStatus=l.status,l.status.gotip?alert(`Ethernet connected: ${l.status.ip}`):l.status.linkup?alert("Ethernet link up, waiting for DHCP..."):alert("Ethernet initialized (no cable detected)")):alert(`Ethernet initialization failed: ${l.error||"Unknown error"}`),n.emit("render")},t.onEthStatus=l=>{console.log("[Ethernet] Status received:",l),e.ethStatus=l,n.emit("render")},window.handleIframeMessage=async l=>{if(!l.data||l.data.type!=="execute")return;const{id:d,code:p}=l.data;console.log("[Iframe Bridge] Executing code from iframe:",p.substring(0,50)+"...");try{const u=await t.run(p,!0);console.log("[Iframe Bridge] Raw output from device:",u.substring(0,200));const f=u.indexOf("{");let g=u;if(f!==-1){let h=0,v=-1;for(let S=f;S<u.length;S++)if(u[S]==="{"&&h++,u[S]==="}"&&h--,h===0){v=S+1;break}v!==-1&&(g=u.substring(f,v),console.log("[Iframe Bridge] Extracted JSON:",g.substring(0,100)+"..."))}l.source.postMessage({type:"result",id:d,data:g},"*"),console.log("[Iframe Bridge] Result sent to iframe")}catch(u){console.log("[Iframe Bridge] Error executing code:",u),l.source.postMessage({type:"error",id:d,error:u.message||"Execution failed"},"*")}},window.addEventListener("message",window.handleIframeMessage);const a=e.cache(H,"terminal");a&&a.term&&a.term.clear(),e.panelHeight=Ge,n.emit("open-panel"),n.emit("close-connection-dialog");try{const l=await t.exec("getStatusInfo()");l&&(e.statusInfo=l,n.emit("render"))}catch{}us(t,e,n),n.emit("refresh-system-info"),setTimeout(()=>{n.emit("terminal-focus")},200),(async()=>{try{const l=await t.exec(`
import os
from lib.sys import board
import json

# Get basic config from board module
board_id = board.id.id
board_name = board.id.name
chip = board.id.chip

# Get version and UI fields from board.json (only load what we need)
version = '0.0'
description = None
hardware = None
try:
    with open('/settings/board.json', 'r') as f:
        config = json.load(f)
        # Version is in identity.revision
        v = config.get('identity', {}).get('revision')
        if v is not None:
            version = str(v) if not isinstance(v, str) else v
        description = config.get('description') or config.get('identity', {}).get('description')
        hardware = config.get('hardware')
except Exception as e:
    # Log error for debugging (version will default to '0.0')
    import sys
    sys.print_exception(e)

print(json.dumps({
  'board_id': board_id,
  'board_name': board_name,
  'chip': chip,
  'version': version,
  'machine': os.uname().machine,
  'description': description,
  'hardware': hardware
}))
`),d=typeof l=="object"?l:JSON.parse(l.trim());e.boardConfig={board_id:d.board_id,board_name:d.board_name,chip:d.chip,version:d.version,description:d.description,hardware:d.hardware};try{const u=new URL(s).hostname,f=d.board_id||u.replace(/\\./g,"-");await V.addOnboardedDevice(f,{hostname:u,url:s,board_id:d.board_id,board_name:d.board_name,chip:d.chip,version:d.version,connectedAt:new Date().toISOString()}),console.log("[Connection] Device saved to /onboarded/"),e.needsOnboarding=!1}catch(p){console.warn("[Connection] Could not save device to /onboarded/:",p)}n.emit("render")}catch(l){console.error("[BoardConfig] Failed to load board config:",l)}})(),n.emit("render")}catch(a){let l="Connection failed";a instanceof Error||a&&a.message?l=a.message:a&&a.type==="error"&&(l=`WebSocket connection failed. Check if device is available at ${s}`),console.log("✗ Connection failed:",l),e.isConnecting=!1,e.isConnected=!1,I(e),n.emit("render")}}),n.on("open-reset-dialog",()=>{e.isResetDialogOpen=!0,n.emit("render")}),n.on("close-reset-dialog",()=>{e.isResetDialogOpen=!1,n.emit("render")}),n.on("trigger-reset",async s=>{e.isResetDialogOpen=!1,n.emit("render");try{s===1?(console.log("[Connection] Triggering Hard Reset"),e.isResettingHard=!0,await t.reset(1),console.log("[Connection] Hard reset sent, waiting for disconnect...")):(console.log("[Connection] Triggering Soft Reset"),await t.reset(0))}catch(c){console.error("[Connection] Reset failed:",c),e.isResettingHard=!1,alert("Reset failed: "+c.message)}}),n.on("bind-terminal-input",()=>{const s=e.cache(H,"terminal");!s||!s.term||s.bindInput(e,t)&&console.log("[Connection] Bound terminal input after view change")}),n.on("terminal-focus",async()=>{if(console.debug("[Connection] terminal-focus event received, isConnected:",e.isConnected,"bannerDisplayed:",e.bannerDisplayed),!e.isConnected||e.bannerDisplayed){console.debug("[Connection] Skipping banner: not connected or already displayed");return}const s=e.cache(H,"terminal");if(!s||!s.term){console.log("[Connection] Skipping banner: terminal component not available");return}const c=s.term;try{console.log("[Connection] Fetching banner data...");const r=await t.exec(`
import os, json
u = os.uname()
print(json.dumps({"name": "ScriptO Studio", "version": u.version, "machine": u.machine}))
`);if(console.log("[Connection] banner() returned:",r),r&&r.name){const a=r.name,l=`MicroPython ${r.version} on ${r.machine}`,p=(await Xt(a,null)).split(/\r?\n/).filter(f=>f.trim().length>0);let u=`\r\x1B[K\x1B[38;05;208;1m\r
`;for(const f of p)u+="  "+f+`\r
`;u+=`\r
\x1B[1;32m`+l+`\x1B[0m\r
`,u+=`\x1B[0mType "help()" for more information.\r
`,c.write(u),c.write(G),c.scrollToBottom(),e.bannerDisplayed=!0,console.log("[Connection] Welcome banner displayed")}}catch(r){console.debug("[Connection] Failed to fetch banner:",r.message)}})}function fs(e,n,t,o,i,s,c){n.on("save",async()=>{if(console.log("save"),ut({isConnected:e.isConnected,openFiles:e.openFiles,editingFile:e.editingFile})==!1){console.log("can't save");return}e.isSaving=!0,I(e);let a=e.openFiles.find(g=>g.id===e.editingFile),l=!1;const d=a.parentFolder,p=d===null;p&&(a.source=="board"?a.parentFolder=e.boardNavigationPath:a.source=="disk"&&(a.parentFolder=e.diskNavigationPath));let u=!1;if(a.source=="board"?u=await te(B,$(e.boardNavigationRoot,a.parentFolder,a.fileName)):a.source=="disk"&&(u=await o.fileExists(o.getFullPath(e.diskNavigationRoot,a.parentFolder,a.fileName))),(p||!u)&&(a.source=="board"?(a.parentFolder=e.boardNavigationPath,l=await te(B,$(e.boardNavigationRoot,a.parentFolder,a.fileName))):a.source=="disk"&&(a.parentFolder=e.diskNavigationPath,l=await o.fileExists(o.getFullPath(e.diskNavigationRoot,a.parentFolder,a.fileName)))),l&&await M(`You are about to overwrite the file ${a.fileName} on your ${a.source}.

 Are you sure you want to proceed?`)!==0){e.isSaving=!1,a.parentFolder=d,I(e),n.emit("render");return}let f=a.editor.content||"";if(a.fileName&&a.fileName.toLowerCase().endsWith(".json"))try{const g=f.trim();if(g&&(g[0]==="{"||g[0]==="[")){const h=JSON.parse(g),v=JSON.stringify(h,null,2)+`
`;v!==f&&(f=v)}}catch{}try{if(a.source=="board"){if(["main.py","boot.py"].includes(a.fileName)&&await M(`⚠️ Warning: Saving '${a.fileName}' to device may cause disconnection.

This file is running on the device. Overwriting it may crash the connection.

Recommended: Save locally instead (to disk), then reconnect.

Continue saving to device?`,"Cancel","OK")!==0){e.isSaving=!1,I(e),n.emit("render");return}await t.saveFile($(e.boardNavigationRoot,a.parentFolder,a.fileName),f,{progressCallback:h=>{e.savingProgress=h,n.emit("render")}})}else a.source=="disk"&&await o.saveFileContent(o.getFullPath(e.diskNavigationRoot,a.parentFolder,a.fileName),f)}catch(g){console.log("error",g)}a.hasChanges=!1,e.isSaving=!1,e.savingProgress=0,I(e),n.emit("refresh-files"),n.emit("render")}),n.on("select-tab",r=>{if(console.log("select-tab",r),!e.openFiles.find(l=>l.id===r)){console.warn("[select-tab] Tab not found:",r);return}e.editingFile=r,n.emit("render")}),n.on("close-tab",async r=>{console.log("close-tab",r);const a=e.openFiles.find(l=>l.id===r);if(!a){console.warn("[close-tab] Tab not found:",r);return}if(a.hasChanges&&await M("Your file has unsaved changes. Are you sure you want to proceed?")!==0)return!1;e.openFiles=e.openFiles.filter(l=>l.id!==r),e.openFiles.length>0?e.editingFile=e.openFiles[0].id:await s("disk"),n.emit("render")}),n.on("refresh-board-files",async()=>{if(console.log("refresh-board-files"),e.isConnected)try{e.boardFiles=await Ke($(e.boardNavigationRoot,e.boardNavigationPath,""))}catch{e.boardFiles=[]}else e.boardFiles=[];n.emit("refresh-selected-files"),n.emit("render")}),n.on("refresh-disk-files",async()=>{console.log("refresh-disk-files");try{e.diskFiles=await Ve(o.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,""))}catch(r){console.error("[FS] Error refreshing disk files:",r),e.diskNavigationRoot=null,e.diskNavigationPath="/"}n.emit("refresh-selected-files"),n.emit("render")}),n.on("refresh-files",async()=>{if(console.log("refresh-files"),e.isLoadingFiles)return;e.isLoadingFiles=!0;const r=document.getElementById("overlay");r?(r.classList.remove("closed"),r.classList.add("open"),r.innerHTML="<p>Loading files...</p>"):n.emit("render");try{await Promise.all([(async()=>{if(e.isConnected)try{e.boardFiles=await Ke($(e.boardNavigationRoot,e.boardNavigationPath,""))}catch{e.boardFiles=[]}else e.boardFiles=[]})(),(async()=>{try{e.diskFiles=await Ve(o.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,""))}catch(a){console.error("[FS] Error refreshing files:",a),e.diskNavigationRoot=null,e.diskNavigationPath="/"}})()])}finally{e.isLoadingFiles=!1,n.emit("refresh-selected-files");const a=document.getElementById("overlay");a&&(a.classList.remove("open"),a.classList.add("closed")),e.systemSection==="file-manager"&&n.emit("render")}}),n.on("refresh-selected-files",()=>{e.selectedFiles=e.selectedFiles.filter(r=>r.source==="board"?e.isConnected?e.boardFiles.find(a=>r.fileName===a.fileName):!1:e.diskFiles.find(a=>r.fileName===a.fileName)),n.emit("render")}),n.on("create-new-tab",async(r,a=null)=>{const l=r=="board"?e.boardNavigationPath:e.diskNavigationPath;console.log("create-new-tab",r,a,l),await s(r,a,l)&&(n.emit("close-new-file-dialog"),n.emit("render"))}),n.on("create-file",(r,a=null)=>{console.log("create-file",r),e.creatingFile===null&&(e.creatingFile=r,e.creatingFolder=null,a!=null&&n.emit("finish-creating-file",a),n.emit("render"))}),n.on("finish-creating-file",async r=>{if(console.log("finish-creating",r),!e.creatingFile)return;if(!r){e.creatingFile=null,n.emit("render");return}if(e.creatingFile=="board"&&e.isConnected){if(await Sn({root:e.boardNavigationRoot,parentFolder:e.boardNavigationPath,fileName:r})&&await M(`You are about to overwrite the file ${r} on your board.

Are you sure you want to proceed?`)!==0){e.creatingFile=null,n.emit("render");return}if(["main.py","boot.py"].includes(r)&&await M(`⚠️ Warning: Saving '${r}' to device may cause disconnection.

This file is running on the device. Overwriting it may crash the connection.

Recommended: Save locally instead (to disk), then reconnect.

Continue saving to device?`)!==0){e.creatingFile=null,n.emit("render");return}await t.saveFile($(e.boardNavigationRoot,e.boardNavigationPath,r),Fe)}else if(e.creatingFile=="disk"){if(await xn({root:e.diskNavigationRoot,parentFolder:e.diskNavigationPath,fileName:r})&&await M(`You are about to overwrite the file ${r} on your disk.

Are you sure you want to proceed?`)!==0){e.creatingFile=null,n.emit("render");return}await o.saveFileContent(o.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,r),Fe)}const a=e.creatingFile;setTimeout(()=>{e.creatingFile=null,J(e,n),a==="disk"?n.emit("refresh-disk-files"):n.emit("refresh-board-files"),n.emit("render")},200)}),n.on("import-files",async()=>{console.log("import-files");try{const r=o.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,""),a=await o.importFiles(r);a.length>0&&(console.log(`[Store] Imported ${a.length} file(s):`,a.map(l=>l.name).join(", ")),n.emit("refresh-disk-files"),n.emit("render"))}catch(r){console.error("[Store] Error importing files:",r),alert(`Failed to import files: ${r.message}`)}}),n.on("upload-to-device",async()=>{if(console.log("upload-to-device"),!e.isConnected){alert("Please connect to device first");return}try{const r=document.createElement("input");r.type="file",r.multiple=!0;const a=await new Promise((p,u)=>{r.onchange=f=>{p(Array.from(f.target.files||[]))},r.oncancel=()=>p([]),r.click()});if(a.length===0)return;e.isTransferring=!0,I(e);const l=a.map(p=>p.name),d=await le({source:"board",fileNames:l,parentPath:$(e.boardNavigationRoot,e.boardNavigationPath,"")});if(d.length>0){let p=`You are about to overwrite the following files/folders on your board:

`;if(d.forEach(f=>p+=`${f.fileName}
`),p+=`
Are you sure you want to proceed?`,await M(p,"Cancel","Yes")!==0){e.isTransferring=!1,I(e),n.emit("render");return}}for(const p of a){const u=$(e.boardNavigationRoot,e.boardNavigationPath,p.name),f=await p.arrayBuffer(),g=new Uint8Array(f);await t.saveFile(u,g,{progressCallback:h=>{e.transferringProgress=`${p.name}: ${h}%`,n.emit("render")}}),e.transferringProgress=""}n.emit("refresh-files"),n.emit("render")}catch(r){console.error("[Store] Error uploading to device:",r),alert(`Failed to upload files: ${r.message}`)}finally{e.isTransferring=!1,e.transferringProgress="",I(e),n.emit("render")}}),n.on("create-folder",r=>{console.log("create-folder",r),e.creatingFolder===null&&(e.creatingFolder=r,e.creatingFile=null,n.emit("render"))}),n.on("finish-creating-folder",async r=>{if(console.log("finish-creating-folder",r),!!e.creatingFolder){if(!r){e.creatingFolder=null,n.emit("render");return}if(e.creatingFolder=="board"&&e.isConnected){if(await Sn({root:e.boardNavigationRoot,parentFolder:e.boardNavigationPath,fileName:r})){if(await M(`You are about to overwrite ${r} on your board.

Are you sure you want to proceed?`)!==0){e.creatingFolder=null,n.emit("render");return}await Be($(e.boardNavigationRoot,e.boardNavigationPath,r))}await oi(t,$(e.boardNavigationRoot,e.boardNavigationPath,r))}else if(e.creatingFolder=="disk"){if(await xn({root:e.diskNavigationRoot,parentFolder:e.diskNavigationPath,fileName:r})){if(await M(`You are about to overwrite ${r} on your disk.

Are you sure you want to proceed?`)!==0){e.creatingFolder=null,n.emit("render");return}await o.removeFolder(o.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,r))}await o.createFolder(o.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,r))}setTimeout(()=>{e.creatingFolder=null,n.emit("refresh-files"),n.emit("render")},200)}}),n.on("remove-files",async()=>{console.log("remove-files");let r=e.selectedFiles.filter(f=>f.source==="board").map(f=>f.fileName),a=e.selectedFiles.filter(f=>f.source==="disk").map(f=>f.fileName),l=`You are about to delete the following files:

`;if(r.length&&(l+=`From your board:
`,r.forEach(f=>l+=`${f}
`),l+=`
`),a.length&&(l+=`From your disk:
`,a.forEach(f=>l+=`${f}
`),l+=`
`),l+="Are you sure you want to proceed?",await M(l)!==0){n.emit("render");return}let p=!1,u=!1;for(let f in e.selectedFiles){const g=e.selectedFiles[f];g.type=="folder"?g.source==="board"?(await Be($(e.boardNavigationRoot,e.boardNavigationPath,g.fileName)),p=!0):(await o.removeFolder(o.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,g.fileName)),u=!0):g.source==="board"?(await wn(t,$(e.boardNavigationRoot,e.boardNavigationPath,g.fileName)),p=!0):(await o.removeFile(o.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,g.fileName)),u=!0)}p&&u?n.emit("refresh-files"):p?n.emit("refresh-board-files"):u&&n.emit("refresh-disk-files"),e.selectedFiles=[],n.emit("render")}),n.on("rename-file",(r,a)=>{console.log("rename-file",r,a),e.renamingFile=r,n.emit("render")}),n.on("finish-renaming-file",async r=>{console.log("finish-renaming-file",r);const a=e.selectedFiles[0];if(!r||a.fileName==r){e.renamingFile=null,n.emit("render");return}if(e.isSaving=!0,I(e),e.renamingFile=="board"&&e.isConnected){if((await le({fileNames:[r],parentPath:o.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,""),source:"board"})).length>0){let d=`You are about to overwrite the following file/folder on your board:

`;if(d+=`${r}

`,d+="Are you sure you want to proceed?",await M(d)!==0){e.isSaving=!1,e.renamingFile=null,I(e),n.emit("render");return}a.type=="folder"?await Be($(e.boardNavigationRoot,e.boardNavigationPath,r)):a.type=="file"&&await wn(t,$(e.boardNavigationRoot,e.boardNavigationPath,r))}}else if(e.renamingFile=="disk"&&(await le({fileNames:[r],parentPath:o.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,""),source:"disk"})).length>0){let d=`You are about to overwrite the following file/folder on your disk:

`;if(d+=`${r}

`,d+="Are you sure you want to proceed?",await M(d)!==0){e.isSaving=!1,e.renamingFile=null,I(e),n.emit("render");return}a.type=="folder"?await o.removeFolder(o.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,r)):a.type=="file"&&await o.removeFile(o.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,r))}try{e.renamingFile=="board"?await bn(t,$(e.boardNavigationRoot,e.boardNavigationPath,a.fileName),$(e.boardNavigationRoot,e.boardNavigationPath,r)):await o.renameFile(o.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,a.fileName),o.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,r));const l=e.openFiles.findIndex(d=>d.fileName===a.fileName&&d.source===a.source&&d.parentFolder===a.parentFolder);l>-1&&(e.openFiles[l].fileName=r,n.emit("render"))}catch{alert(`The file ${a.fileName} could not be renamed to ${r}`)}e.isSaving=!1,e.renamingFile=null,I(e),n.emit("refresh-files"),n.emit("render")}),n.on("rename-tab",r=>{console.log("rename-tab",r),e.renamingTab=r,n.emit("render")}),n.on("finish-renaming-tab",async r=>{console.log("finish-renaming-tab",r);const a=e.openFiles.find(g=>g.id===e.renamingTab);if(!r||a.fileName==r){e.renamingTab=null,e.isSaving=!1,I(e),n.emit("render");return}e.isSaving=!0,I(e);const l=a.parentFolder,d=a.fileName;a.fileName=r;const p=l===null;let u=!1;p||(a.source=="board"?u=await te(B,$(e.boardNavigationRoot,a.parentFolder,d)):a.source=="disk"&&(u=await o.fileExists(o.getFullPath(e.diskNavigationRoot,a.parentFolder,d)))),(p||!u)&&(a.source=="board"?a.parentFolder=e.boardNavigationPath:a.source=="disk"&&(a.parentFolder=e.diskNavigationPath));let f=!1;if(a.source=="board"?f=await te(B,$(e.boardNavigationRoot,a.parentFolder,a.fileName)):a.source=="disk"&&(f=await o.fileExists(o.getFullPath(e.diskNavigationRoot,a.parentFolder,a.fileName))),f&&await M(`You are about to overwrite the file ${a.fileName} on your ${a.source}.

 Are you sure you want to proceed?`)!==0){e.renamingTab=null,e.isSaving=!1,a.fileName=d,n.emit("render");return}if(u){if(a.hasChanges){const g=a.editor.content||"";try{if(a.source=="board"){if(["main.py","boot.py"].includes(d)&&await M(`⚠️ Warning: Saving '${d}' to device may cause disconnection.

This file is running on the device. Overwriting it may crash the connection.

Recommended: Save locally instead (to disk), then reconnect.

Continue saving to device?`,"Cancel","OK")!==0){e.renamingTab=null,e.isSaving=!1,a.fileName=d,I(e),n.emit("render");return}await t.saveFile($(e.boardNavigationRoot,a.parentFolder,d),g,{progressCallback:v=>{e.savingProgress=v,n.emit("render")}})}else a.source=="disk"&&await o.saveFileContent(o.getFullPath(e.diskNavigationRoot,a.parentFolder,d),g)}catch(h){console.log("error",h)}}try{a.source=="board"?await bn(t,$(e.boardNavigationRoot,a.parentFolder,d),$(e.boardNavigationRoot,a.parentFolder,a.fileName)):a.source=="disk"&&await o.renameFile(o.getFullPath(e.diskNavigationRoot,a.parentFolder,d),o.getFullPath(e.diskNavigationRoot,a.parentFolder,a.fileName))}catch(g){console.log("error",g)}}else if(!u){const g=a.editor.content||"";try{if(a.source=="board"){if(["main.py","boot.py"].includes(a.fileName)&&await M(`⚠️ Warning: Saving '${a.fileName}' to device may cause disconnection.

This file is running on the device. Overwriting it may crash the connection.

Recommended: Save locally instead (to disk), then reconnect.

Continue saving to device?`,"Cancel","OK")!==0){e.renamingTab=null,e.isSaving=!1,a.fileName=d,I(e),n.emit("render");return}await t.saveFile($(e.boardNavigationRoot,a.parentFolder,a.fileName),g,{progressCallback:v=>{e.savingProgress=v,n.emit("render")}})}else a.source=="disk"&&await o.saveFileContent(o.getFullPath(e.diskNavigationRoot,a.parentFolder,a.fileName),g)}catch(h){console.log("error",h)}}a.hasChanges=!1,e.renamingTab=null,e.isSaving=!1,e.savingProgress=0,I(e),n.emit("refresh-files"),n.emit("render")}),n.on("toggle-file-selection",(r,a,l)=>{console.log("toggle-file-selection",r,a,l);let d=a=="board"?e.boardNavigationPath:e.diskNavigationPath;if(l&&!l.ctrlKey&&!l.metaKey){e.selectedFiles=[{fileName:r.fileName,type:r.type,source:a,parentFolder:d}],n.emit("render");return}e.selectedFiles.find(u=>u.fileName===r.fileName&&u.source===a)?e.selectedFiles=e.selectedFiles.filter(u=>!(u.fileName===r.fileName&&u.source===a)):e.selectedFiles.push({fileName:r.fileName,type:r.type,source:a,parentFolder:d}),n.emit("render")}),n.on("open-selected-files",async()=>{console.log("open-selected-files");let r=[],a=[];if(!e.isLoadingFiles){e.isLoadingFiles=!0,n.emit("render");for(let l in e.selectedFiles){let d=e.selectedFiles[l];if(d.type=="folder")continue;const p=e.openFiles.find(u=>u.fileName==d.fileName&&u.source==d.source&&u.parentFolder==d.parentFolder);if(p)a.push(p);else{let u=null;if(d.source=="board"){const f=await t.loadFile($(e.boardNavigationRoot,e.boardNavigationPath,d.fileName)),g=new Uint8Array(f),h=new TextDecoder("utf-8").decode(g);u=await i({parentFolder:e.boardNavigationPath,fileName:d.fileName,source:d.source,content:h}),u.editor.onChange=function(){u.hasChanges=!0,n.emit("render")}}else if(d.source=="disk"){const f=await o.loadFile(o.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,d.fileName)),g=new Uint8Array(f),h=new TextDecoder("utf-8").decode(g);u=await i({parentFolder:e.diskNavigationPath,fileName:d.fileName,source:d.source,content:h}),u.editor.onChange=function(){u.hasChanges=!0,n.emit("render")}}r.push(u)}}a.length>0&&(e.editingFile=a[0].id),r.length>0&&(e.editingFile=r[0].id),e.openFiles=e.openFiles.concat(r),e.selectedFiles=[],e.isLoadingFiles=!1,n.emit("change-view","editor"),n.emit("render")}}),n.on("open-file",(r,a)=>{console.log("open-file",r,a),e.selectedFiles=[{fileName:a.fileName,type:a.type,source:r,parentFolder:e[`${r}NavigationPath`]}],n.emit("open-selected-files")}),n.on("upload-files",async()=>{console.log("upload-files"),e.isTransferring=!0,n.emit("render");const r=await le({source:"board",fileNames:e.selectedFiles.map(a=>a.fileName),parentPath:$(e.boardNavigationRoot,e.boardNavigationPath,"")});if(r.length>0){let a=`You are about to overwrite the following files/folders on your board:

`;if(r.forEach(d=>a+=`${d.fileName}
`),a+=`
`,a+="Are you sure you want to proceed?",await M(a)!==0){e.isTransferring=!1,n.emit("render");return}}try{for(let a in e.selectedFiles){const l=e.selectedFiles[a],d=o.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,l.fileName),p=$(e.boardNavigationRoot,e.boardNavigationPath,l.fileName);if(l.type=="folder")await ai(d,p,(u,f)=>{e.transferringProgress=`${f}: ${u}`,n.emit("render")}),e.transferringProgress="";else{const u=await V.loadFile(d),f=new Uint8Array(u);await t.saveFile(p,f,{progressCallback:g=>{e.transferringProgress=`${l.fileName}: ${g}%`,n.emit("render")}}),e.transferringProgress=""}}e.selectedFiles=[],e.isTransferring=!1,e.transferringProgress="",I(e),n.emit("refresh-files"),n.emit("render")}catch(a){console.error("[Upload] Transfer failed:",a),e.isTransferring=!1,e.transferringProgress="",I(e),n.emit("render");let l=a.message;l&&l.includes("Transfer already in progress")&&(l="Transfer already in progress. The device may have stale TFTP state from a previous disconnected transfer. Please wait a moment and try again, or disconnect and reconnect."),alert(`Upload failed: ${l}`)}}),n.on("download-files",async()=>{console.log("download-files"),e.isTransferring=!0,I(e),n.emit("render");const r=await le({source:"disk",fileNames:e.selectedFiles.map(a=>a.fileName),parentPath:o.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,"")});if(r.length>0){let a=`You are about to overwrite the following files/folders on your disk:

`;if(r.forEach(d=>a+=`${d.fileName}
`),a+=`
`,a+="Are you sure you want to proceed?",await M(a)!==0){e.isTransferring=!1,n.emit("render");return}}try{for(let a in e.selectedFiles){const l=e.selectedFiles[a],d=$(e.boardNavigationRoot,e.boardNavigationPath,l.fileName),p=o.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,l.fileName);if(l.type=="folder")await li(d,p,u=>{e.transferringProgress=u,n.emit("render")});else{const u=await t.loadFile(d,{progressCallback:f=>{e.transferringProgress=`${l.fileName}: ${f}%`,n.emit("render")}});await V.saveFileContent(p,u.buffer)}}e.isTransferring=!1,e.selectedFiles=[],I(e),n.emit("refresh-files"),n.emit("render")}catch(a){console.error("[Download] Transfer failed:",a),e.isTransferring=!1,e.transferringProgress="",I(e),n.emit("render");let l=a.message;l&&l.includes("Transfer already in progress")&&(l="Transfer already in progress. The device may have stale TFTP state from a previous disconnected transfer. Please wait a moment and try again, or disconnect and reconnect."),alert(`Download failed: ${l}`)}}),n.on("navigate-board-folder",r=>{console.log("navigate-board-folder",r),e.boardNavigationPath=Cn(e.boardNavigationPath,r),n.emit("refresh-files"),n.emit("render")}),n.on("navigate-board-parent",()=>{console.log("navigate-board-parent"),e.boardNavigationPath=Cn(e.boardNavigationPath,".."),n.emit("refresh-files"),n.emit("render")}),n.on("navigate-disk-folder",r=>{console.log("navigate-disk-folder",r),e.diskNavigationPath=o.getNavigationPath(e.diskNavigationPath,r),n.emit("refresh-files"),n.emit("render")}),n.on("navigate-disk-parent",()=>{console.log("navigate-disk-parent"),e.diskNavigationPath=o.getNavigationPath(e.diskNavigationPath,".."),n.emit("refresh-files"),n.emit("render")})}function On(e,n){let t=null;console.log("[Debugger Store] Registering event handlers"),n.on("debugger:open-config",()=>{console.log("[Debugger] Opening config modal"),e.debugger.configOpen=!0,n.emit("render")}),n.on("debugger:close-config",()=>{e.debugger.configOpen=!1,n.emit("render")}),n.on("debugger:toggle-file",o=>{const i=e.debugger.debugFiles.indexOf(o);i>=0?e.debugger.debugFiles.splice(i,1):e.debugger.debugFiles.push(o),n.emit("render")}),n.on("debugger:set-watches",o=>{const i=o.split(`
`).map(s=>s.trim()).filter(s=>s.length>0);e.debugger.watchExpressions[""]=i,n.emit("render")}),n.on("debugger:start",async()=>{try{const o=e.openFiles.find(s=>s.id===e.editingFile);if(!o){console.error("[Debugger] No file open");return}const i=o.editor?o.editor.content:"";if(!i){console.error("[Debugger] No content to debug");return}e.debugger.active=!0,n.emit("render"),t=new gs(e,n),await t.start(i,e.debugger.watchExpressions,e.debugger.conditionalBreakpoints,o.fileName)}catch(o){console.error("[Debugger] Failed to start:",o),e.debugger.active=!1,n.emit("render")}}),n.on("debugger:step-over",async()=>{t&&await t.stepOver()}),n.on("debugger:step-into",async()=>{t&&await t.stepInto()}),n.on("debugger:step-out",async()=>{t&&await t.stepOut()}),n.on("debugger:continue",async(o=!0)=>{t&&await t.continue(o)}),n.on("debugger:stop",async()=>{t&&(await t.stop(),t=null),e.debugger.active=!1,e.debugger.halted=!1,e.debugger.configOpen=!1,n.emit("render")}),n.on("debugger:state-update",o=>{e.debugger.currentFile=o.f,e.debugger.currentLine=o.l,e.debugger.variables=o.w,e.debugger.locals=o.v,e.debugger.memory=o.m,e.debugger.timing=o.t,e.debugger.halted=o.h,n.emit("render")}),n.on("debugger:edit-breakpoint",o=>{const{file:i,line:s}=o;e.debugger.breakpoints[i]||(e.debugger.breakpoints[i]={}),e.debugger.breakpoints[i][s]||(e.debugger.breakpoints[i][s]={condition:"",hitCount:"",enabled:!0}),e.debugger.editingBreakpoint={file:i,line:s},e.debugger.breakpointModalOpen=!0,n.emit("render")}),n.on("debugger:save-breakpoint",o=>{const{file:i,line:s,config:c}=o;e.debugger.breakpoints[i]||(e.debugger.breakpoints[i]={}),e.debugger.breakpoints[i][s]=c,e.debugger.breakpointModalOpen=!1,e.debugger.editingBreakpoint=null,n.emit("debugger:breakpoints-updated",{file:i}),n.emit("render")}),n.on("debugger:delete-breakpoint",o=>{const{file:i,line:s}=o;e.debugger.breakpoints[i]&&delete e.debugger.breakpoints[i][s],e.debugger.breakpointModalOpen=!1,e.debugger.editingBreakpoint=null,n.emit("debugger:breakpoints-updated",{file:i}),n.emit("render")}),n.on("debugger:close-breakpoint-modal",()=>{e.debugger.breakpointModalOpen=!1,e.debugger.editingBreakpoint=null,n.emit("render")})}class gs{constructor(n,t){this.state=n,this.emitter=t,this.device=B}async start(n,t,o,i){if(console.log("[Debugger] Starting debug session for:",i),!hn){console.error("[Debugger] instrumentCodeForExec not available - debugger-utils.js may not be loaded"),this.emitter.emit("show-dialog",{title:"Debugger Error",message:"Debugger utilities not loaded. Please refresh the page.",buttons:["OK"]});return}const s=performance.now(),c=await hn(n,{watches:this.state.debugger.watchExpressions,conditionalBP:this.state.debugger.conditionalBreakpoints,breakpoints:this.state.debugger.breakpoints,fileName:i});console.log(`[Debugger] Instrumentation took ${(performance.now()-s).toFixed(0)}ms`),await this.device.interrupt(),await yt(100),this.device.subscribe("debug-state",this.onDebugState.bind(this)),console.log("[Debugger] Executing instrumented code...");try{await this.device.run(c),console.log("[Debugger] Execution completed successfully")}catch(r){console.warn("[Debugger] Code execution ended:",r.message)}finally{this.emitter.emit("terminal:write-prompt"),this.device.unsubscribe("debug-state"),this.state.debugger.active=!1,this.state.debugger.halted=!1,this.emitter.emit("render")}}async stepInto(){console.log("[Debugger] Step Into"),await this.device.sendDebugCommand("S")}async stepOver(){console.log("[Debugger] Step Over"),await this.device.sendDebugCommand("SO")}async stepOut(){console.log("[Debugger] Step Out"),await this.device.sendDebugCommand("ST")}async continue(n=!0){console.log("[Debugger] Continue",n?"(with log)":"(no log)"),await this.device.sendDebugCommand(n?"CW":"CO")}async stop(){console.log("[Debugger] Stop"),await this.device.interrupt(),this.device.unsubscribe("debug-state")}onDebugState(n){console.log("[Debugger] State update:",n),this.emitter.emit("debugger:state-update",n),this.displayDebugState(n)}displayDebugState(n){let t=`
[DEBUG] Paused at ${n.f}:${n.l}
`;const o=Object.entries(n.w);o.length>0&&(t+=`
[WATCHES]
`,o.forEach(([s,c])=>{t+=`  ${s} = ${c}
`}));const i=Object.entries(n.v||{});i.length>0&&(t+=`
[LOCALS]
`,i.forEach(([s,c])=>{t+=`  ${s} = ${c}
`})),t+=`[DEBUG] Memory: ${this.formatBytes(n.m)} | Time: ${n.t} ms
`,this.emitter.emit("terminal:append",t)}formatBytes(n){if(!n)return"0 B";const t=1024,o=["B","KB","MB"],i=Math.floor(Math.log(n)/Math.log(t));return`${(n/Math.pow(t,i)).toFixed(1)} ${o[i]}`}}const hs=()=>window.stopStatusInfoPolling?window.stopStatusInfoPolling():null,Fn=(e,n,t)=>window.startStatusInfoPolling?window.startStatusInfoPolling(e,n,t):null;function ms(e,n,t,o){const i=console.log;n.on("open-extensions-modal",async()=>{i("open-extensions-modal"),e.isExtensionsModalOpen=!0,e.isLoadingExtensions=!0,n.emit("render");try{e.availableExtensions=await e.extensionRegistry.loadIndex(e.registryUrl),e.isLoadingExtensions=!1,n.emit("render")}catch(s){console.error("[Extensions] Error loading registry:",s),e.isLoadingExtensions=!1,e.availableExtensions=[],n.emit("render"),alert(`Failed to load extensions registry:
${s.message}`)}}),n.on("close-extensions-modal",()=>{i("close-extensions-modal"),e.isExtensionsModalOpen=!1,n.emit("render")}),n.on("install-extension",async s=>{i("install-extension:",s.name);try{await e.extensionRegistry.installExtension(s),e.installedExtensions=await e.extensionRegistry.getInstalledExtensions(),e.isExtensionsModalOpen=!1,i(`[Extensions] Installed ${s.name}`),n.emit("render"),s.mipPackage&&n.emit("prompt-upload-dependencies",{extensionId:s.id,extensionName:s.name})}catch(c){console.error("[Extensions] Installation failed:",c),alert(`Failed to install extension:
${c.message}`)}}),n.on("update-extension",async({extension:s,newVersion:c})=>{i("update-extension:",s.id,`v${s.version.join(".")} → v${c.version.join(".")}`);try{delete e.loadedExtensions[s.id];const r=`extension-styles-${s.id}`,a=document.getElementById(r);a&&(a.remove(),console.log(`[Extensions] Removed old styles for ${s.id}`)),await e.extensionRegistry.uninstallExtension(s.id),await e.extensionRegistry.installExtension(c),e.installedExtensions=await e.extensionRegistry.getInstalledExtensions(),e.activeExtension===s.id&&n.emit("change-extension-panel",{extensionId:s.id,panelId:e.activeExtensionPanel||c.menu[0].id}),i(`[Extensions] Updated ${s.name} to v${c.version.join(".")}`),c.mipPackage&&n.emit("prompt-upload-dependencies",{extensionId:s.id,extensionName:s.name}),n.emit("render")}catch(r){console.error("[Extensions] Update failed:",r),alert(`Failed to update extension:
${r.message}`)}}),n.on("uninstall-extension",async s=>{i("uninstall-extension:",s);try{await e.extensionRegistry.uninstallExtension(s),delete e.loadedExtensions[s];const c=`extension-styles-${s}`,r=document.getElementById(c);r&&(r.remove(),console.log(`[Extensions] Removed styles for ${s}`)),e.installedExtensions=await e.extensionRegistry.getInstalledExtensions(),e.activeExtension===s&&(e.activeExtension=null,e.activeExtensionPanel=null,e.systemSection="settings"),i(`[Extensions] Uninstalled ${s}`),n.emit("render")}catch(c){console.error("[Extensions] Uninstall failed:",c),alert(`Failed to uninstall extension:
${c.message}`)}}),n.on("prompt-upload-dependencies",async({extensionId:s,extensionName:c})=>{i("prompt-upload-dependencies:",s);try{const r=await e.extensionRegistry.getDependencies(s);if(!r||!r.mipPackage)return;e.dependencyPrompt={extensionId:s,extensionName:c,dependencies:r},n.emit("render")}catch(r){console.error("[Extensions] Error getting dependencies:",r)}}),n.on("close-dependency-prompt",()=>{i("close-dependency-prompt"),e.dependencyPrompt=null,n.emit("render")}),n.on("upload-extension-dependencies",async s=>{i("upload-extension-dependencies:",s),e.dependencyPrompt=null;try{const c=e.installedExtensions.find(l=>l.id===s);if(!c||!c.mipPackage){n.emit("render");return}if(!e.isConnected){alert("Please connect to device first"),n.emit("render");return}hs(),e.installingDependencies={extensionName:c.name,mipPackage:c.mipPackage},n.emit("render");const r=`
import mip
try:
    result = mip.install("${c.mipPackage}", target="/lib")
    print("mip.install completed")
    print(f"mip.install result: {result}")
except Exception as e:
    print(f"mip.install error: {e}")
    import sys
    sys.print_exception(e)
    raise  # Re-raise to ensure error is visible
`,a=await t.run(r,!1);if(a&&(a.includes("error")||a.includes("Error")||a.includes("Exception")))throw new Error(`mip install failed: ${a}`);e.installingDependencies=null,e.isConnected&&t&&Fn(t,e,n),n.emit("render"),alert("Dependencies installed successfully via mip!")}catch(c){console.error("[Extensions] Dependency installation failed:",c),e.installingDependencies=null,e.isConnected&&t&&Fn(t,e,n),n.emit("render"),alert(`Failed to install dependencies:
${c.message}`)}}),n.on("toggle-extension-menu",s=>{e.expandedExtensions[s]=!e.expandedExtensions[s],n.emit("render")}),n.on("change-extension-panel",async({extensionId:s,panelId:c})=>{if(i("change-extension-panel:",s,c),!e.loadedExtensions[s])try{const r=await e.extensionRegistry.getExtension(s);if(!r)throw new Error(`Extension not found: ${s}`);e.loadedExtensions[s]={data:r,instance:null},i(`[Extensions] Loaded extension ${s} from cache`)}catch(r){console.error("[Extensions] Failed to load extension:",r),alert(`Failed to load extension:
${r.message}`);return}e.activeExtension=s,e.activeExtensionPanel=c,e.activeNetworkPanel=null,e.activePeripheralsPanel=null,e.activeSystemPanel=null,e.systemSection=`extension:${s}:${c}`,n.emit("render")})}function vs(e,n,t){const o=console.log;n.on("toggle-agent-sidebar",()=>{o("toggle-agent-sidebar"),e.aiAgent.isOpen=!e.aiAgent.isOpen,n.emit("render")}),n.on("ai-set-provider",async i=>{o("ai-set-provider",i);const s=e.aiAgent.settings.provider;if(e.aiAgent.settings.provider=i,localStorage.setItem("ai-provider",i),s!==i){const c={openai:"gpt-4o",anthropic:"claude-3-5-sonnet-20241022",grok:"grok-4-latest",openrouter:"anthropic/claude-3.5-sonnet",custom:"custom-model"};e.aiAgent.settings.model=c[i]||"gpt-4o",localStorage.setItem("ai-model",e.aiAgent.settings.model)}i==="openrouter"&&e.aiAgent.settings.apiKey&&n.emit("ai-fetch-openrouter-models"),n.emit("render")}),n.on("ai-fetch-openrouter-models",async()=>{if(o("ai-fetch-openrouter-models"),!!e.aiAgent.settings.apiKey){e.aiAgent.isLoadingOpenRouterModels=!0,n.emit("render");try{const i=await fetch("https://openrouter.ai/api/v1/models",{headers:{Authorization:`Bearer ${e.aiAgent.settings.apiKey}`}});if(i.ok){const c=(await i.json()).data.filter(r=>r.id&&!r.id.includes("moderation")).sort((r,a)=>r.pricing?.prompt&&!a.pricing?.prompt?-1:!r.pricing?.prompt&&a.pricing?.prompt?1:r.name.localeCompare(a.name)).map(r=>({value:r.id,label:r.name||r.id}));e.aiAgent.openRouterModels=c,!c.find(r=>r.value===e.aiAgent.settings.model)&&c.length>0&&(e.aiAgent.settings.model=c[0].value,localStorage.setItem("ai-model",e.aiAgent.settings.model))}else console.warn("[AI] Failed to fetch OpenRouter models:",i.status)}catch(i){console.error("[AI] Error fetching OpenRouter models:",i)}finally{e.aiAgent.isLoadingOpenRouterModels=!1,n.emit("render")}}}),n.on("ai-set-apikey",i=>{e.aiAgent.settings.apiKey=i,localStorage.setItem("ai-apikey",i),e.aiAgent.connectionStatus=null,e.aiAgent.settings.provider==="openrouter"&&i&&n.emit("ai-fetch-openrouter-models")}),n.on("ai-set-model",i=>{o("ai-set-model",i),e.aiAgent.settings.model=i,localStorage.setItem("ai-model",i),n.emit("render")}),n.on("ai-set-endpoint",i=>{e.aiAgent.settings.endpoint=i,localStorage.setItem("ai-endpoint",i)}),n.on("ai-set-anthropic-proxy-url",i=>{e.aiAgent.settings.anthropicProxyUrl=i,localStorage.setItem("ai-anthropic-proxy-url",i)}),n.on("ai-set-system-prompt",i=>{e.aiAgent.settings.systemPrompt=i,localStorage.setItem("ai-system-prompt",i)}),n.on("ai-test-connection",async()=>{if(o("ai-test-connection"),!e.aiAgent.settings.apiKey){e.aiAgent.connectionStatus={success:!1,message:"Please enter an API key"},n.emit("render");return}try{e.aiAgent.connectionStatus={success:!1,message:"Testing connection..."},n.emit("render");const s=await cn.testConnection(e.aiAgent.settings);e.aiAgent.connectionStatus={success:!0,message:"Connection successful! Ready to generate code."}}catch(i){e.aiAgent.connectionStatus={success:!1,message:i.message||"Connection failed"}}n.emit("render")}),n.on("ai-update-input",i=>{e.aiAgent.inputValue=i}),n.on("ai-send-message",async i=>{if(o("ai-send-message",i),!(!i||!i.trim())){if(!e.aiAgent.settings.apiKey){e.aiAgent.messages.push({role:"error",content:"Please configure your API key in System > AI Agent settings",timestamp:new Date}),n.emit("render");return}e.aiAgent.inputValue="",e.aiAgent.messages.push({role:"user",content:i,timestamp:new Date}),e.aiAgent.isGenerating=!0,n.emit("render");try{const s=cn;let c=i;e.aiAgent.lastScriptName&&(c=`[CONTEXT: The last script you generated was "${e.aiAgent.lastScriptName}". If the user is asking you to modify/improve that script, keep the same name. If they're asking for something completely different, use a new appropriate name.]

${i}`,console.log("[AI] Adding script context:",e.aiAgent.lastScriptName));const r=await s.generateCode(c,e.aiAgent.messages,e.aiAgent.settings);e.aiAgent.messages.push({role:"assistant",content:r.content,code:r.code,timestamp:new Date}),r.code&&n.emit("ai-code-generated",r.code)}catch(s){e.aiAgent.messages.push({role:"error",content:`Error: ${s.message}`,timestamp:new Date})}e.aiAgent.isGenerating=!1,n.emit("render")}}),n.on("ai-clear-chat",()=>{o("ai-clear-chat"),e.aiAgent.messages=[],e.aiAgent.inputValue="",e.aiAgent.lastConfiguredArgs=null,e.aiAgent.lastScriptName=null,console.log("[AI] Cleared chat and configuration values"),n.emit("render")}),n.on("ai-code-generated",async i=>{o("ai-code-generated");try{console.log("[AI] Code received (first 500 chars):",i.substring(0,500)),console.log("[AI] Code has START marker:",i.includes("# === START_CONFIG_PARAMETERS ===")),console.log("[AI] Code has END marker:",i.includes("# === END_CONFIG_PARAMETERS ==="));const s=de(i);if(console.log("[AI] Parsed config:",s),console.log("[AI] Config args:",s?.args),console.log("[AI] Has args:",s&&s.args&&Object.keys(s.args).length>0),s&&s.args&&Object.keys(s.args).length>0){let r=(s.info||{}).name||"AI Generated Script";const a=e.aiAgent.lastScriptName===s.info.name,l=a&&e.aiAgent.lastConfiguredArgs!==null;if(console.log("[AI] Script name:",s.info.name),console.log("[AI] Last script name:",e.aiAgent.lastScriptName),console.log("[AI] Is same script:",a),console.log("[AI] Has existing config:",l),console.log("[AI] Last configured args:",e.aiAgent.lastConfiguredArgs),console.log("[AI] New config args:",Object.keys(s.args)),l){console.log("[AI] Using previous configuration values:",e.aiAgent.lastConfiguredArgs);let d=Ze(i,s,e.aiAgent.lastConfiguredArgs);s.silent===!0&&(d=`# SCRIPTOS_SILENT: True
${d}`);const p=r.replace(/[^a-zA-Z0-9]/g,"_")+".py",u=e.openFiles.find(f=>f.isAIGenerated&&f.source==="disk"&&f.fileName===p);if(u)u.editor.editor.setValue(d),u.hasChanges=!0,e.editingFile=u.id,console.log("[AI] Auto-updated existing tab with previous config:",u.fileName);else if(await t("disk",p,null,d)){const g=e.openFiles[e.openFiles.length-1];g.isAIGenerated=!0,console.log("[AI] Created new tab with previous config:",p)}}else e.selectedScriptOs={filename:r,content:i,config:s,isAIGenerated:!0},e.scriptOsModalView="config",e.scriptOsArgs={},e.isScriptOsModalOpen=!0}else{const c=e.openFiles.find(r=>r.isAIGenerated&&r.source==="disk");if(c)c.editor.editor.setValue(i),c.hasChanges=!0,e.editingFile=c.id,console.log("[AI] Updated existing AI-generated tab:",c.fileName);else{const r="AI_Generated.py";if(await t("disk",r,null,i)){const l=e.openFiles[e.openFiles.length-1];l.isAIGenerated=!0,console.log("[AI] Created new AI-generated tab:",r)}}}n.emit("render")}catch(s){console.error("[AI] Error processing generated code:",s);const c=e.openFiles.find(r=>r.isAIGenerated&&r.source==="disk");if(c)c.editor.editor.setValue(i),c.hasChanges=!0,e.editingFile=c.id;else{await t("disk","AI_Generated.py",null,i);const a=e.openFiles[e.openFiles.length-1];a&&(a.isAIGenerated=!0)}n.emit("render")}})}function ys(e,n,t,o){const i=console.log;n.on("open-scriptos-modal",async()=>{i("open-scriptos-modal"),e.isLoadingRegistry=!0,e.scriptOsModalView="library",e.scriptOsSearchQuery="",e.scriptOsFilterTags=[],e.isScriptOsModalOpen=!0,n.emit("render");try{let s=t?await t.getIndex():null;console.log("[Registry] Fetching index from network...");const c=e.registryUrl+(e.registryUrl.includes("?")?"&":"?")+"_t="+Date.now(),r=await fetch(c,{cache:"no-cache"});if(!r.ok)throw new Error(`Failed to fetch registry: ${r.status} ${r.statusText}`);const a=await r.json(),l=!s||s.updated!==a.updated||(s.scriptos?.length||0)!==(a.scriptos?.length||0);let d;l?(console.log("[Registry] Cache is stale, using fresh data"),d=a,t&&await t.saveIndex(a)):(console.log("[Registry] Cache is up to date, using cached index"),d=s,t&&t.saveIndex(a).catch(u=>console.warn("[Registry] Background cache update failed:",u)));const p=d.scriptos||[];e.scriptOsList=p.map(u=>({filename:u.filename,url:u.url,registryEntry:u})),e.isLoadingRegistry=!1,n.emit("render")}catch(s){console.error("[ScriptOs] Error loading registry:",s),e.isLoadingRegistry=!1,e.scriptOsList=[],n.emit("render"),alert(`Failed to load ScriptOs registry:
${s.message}

Please check your internet connection and try again.`)}}),n.on("select-scriptos",async s=>{if(i("select-scriptos:",s.registryEntry?.name||s.filename),s.url&&!s.content){const c=s.url;console.log("[Registry] Fetching ScriptO from:",c);let r=t?await t.getScriptO(c):null,a,l;const d=r?.config?.info?.version,p=s.registryEntry?.version,u=d&&p&&JSON.stringify(d)===JSON.stringify(p);if(r&&r.content&&u)a=r.content,l=r.config,console.log("[Registry] Using cached ScriptO (version match)");else{r&&!u&&console.log("[Registry] Cache version mismatch, fetching fresh copy");try{const f=await fetch(c);if(!f.ok)throw new Error(`Failed to fetch ScriptO: ${f.status} ${f.statusText}`);if(a=await f.text(),l=de(a),!l)throw new Error("Failed to parse ScriptO configuration");t&&await t.saveScriptO(c,a,l),console.log("[Registry] Fetched and cached ScriptO")}catch(f){console.error("[Registry] Error fetching ScriptO:",f),alert(`Failed to load ScriptO:
${f.message}`);return}}s={filename:s.filename,content:a,config:l,url:c}}if(e.selectedScriptOs=s,e.scriptOsArgs={},s.config&&s.config.args)for(const c in s.config.args){const r=s.config.args[c];r.value!==void 0?e.scriptOsArgs[c]=r.value:r.type==="str"?e.scriptOsArgs[c]="":r.type==="int"||r.type==="float"?e.scriptOsArgs[c]=0:r.type==="bool"?e.scriptOsArgs[c]=!1:r.type==="list"?e.scriptOsArgs[c]=r.optional?null:0:r.type==="dict"&&r.items&&(e.scriptOsArgs[c]=Object.keys(r.items)[0])}e.scriptOsModalView="config",n.emit("render")}),n.on("scriptos-update-arg",({argId:s,value:c})=>{e.scriptOsArgs[s]=c}),n.on("scriptos-search",s=>{e.scriptOsSearchQuery=s,n.emit("render")}),n.on("scriptos-toggle-tag",s=>{i("scriptos-toggle-tag:",s);const c=e.scriptOsFilterTags.indexOf(s);c>=0?e.scriptOsFilterTags.splice(c,1):e.scriptOsFilterTags.push(s),n.emit("render")}),n.on("scriptos-clear-tags",()=>{i("scriptos-clear-tags"),e.scriptOsFilterTags=[],n.emit("render")}),n.on("scriptos-back",()=>{i("scriptos-back"),e.scriptOsModalView="library",e.selectedScriptOs=null,n.emit("render")}),n.on("scriptos-execute",async()=>{i("scriptos-execute");const s=e.selectedScriptOs;if(s)try{let c=Ze(s.content,s.config,e.scriptOsArgs);s.config.silent===!0&&(c=`# SCRIPTOS_SILENT: True
${c}`),e.isScriptOsModalOpen=!1;const r=s.config.info||{};let a=(r.name||s.filename.replace(".py","")).replace(/[^a-zA-Z0-9]/g,"_")+".py";if(s.isAIGenerated){e.aiAgent.lastConfiguredArgs={...e.scriptOsArgs},e.aiAgent.lastScriptName=r.name,console.log("[AI] Saved configuration values for future updates:",e.aiAgent.lastConfiguredArgs),console.log("[AI] Saved script name:",e.aiAgent.lastScriptName);const l=e.openFiles.find(d=>d.isAIGenerated&&d.source==="disk"&&d.fileName===a);if(l)l.editor.editor.setValue(c),l.hasChanges=!0,e.editingFile=l.id,console.log("[AI] Updated existing AI-generated tab with configured code:",l.fileName);else{const d=a||"AI_Generated.py";if(await o("disk",d,null,c)){const u=e.openFiles[e.openFiles.length-1];u.isAIGenerated=!0,console.log("[AI] Created new AI-generated tab with configured code:",d)}}}else await o("disk",a,null,c),i("[ScriptOs] Generated code in new tab:",a);n.emit("render")}catch(c){console.error("[ScriptOs] Error generating code:",c)}}),n.on("close-scriptos-modal",()=>{i("close-scriptos-modal"),e.isScriptOsModalOpen=!1,e.selectedScriptOs=null,e.scriptOsModalView="library",n.emit("render")}),n.on("open-scriptos-ui-modal",s=>{i("open-scriptos-ui-modal",s),e.scriptOsUiModal&&e.scriptOsUiModal.loadTimeout&&clearTimeout(e.scriptOsUiModal.loadTimeout),e.scriptOsUiModal={isOpen:!0,url:s.url,title:s.title||"ScriptO UI",isLoading:!0,error:null,loadTimeout:null},e.scriptOsUiModal.loadTimeout=setTimeout(()=>{e.scriptOsUiModal&&e.scriptOsUiModal.isLoading&&(console.warn("[ScriptO UI] Load timeout - iframe did not load within 10 seconds"),e.scriptOsUiModal.isLoading=!1,e.scriptOsUiModal.error="Failed to load UI: timeout after 10 seconds. Check if the URL is accessible.",n.emit("render"))},1e4),n.emit("render")}),n.on("close-scriptos-ui-modal",()=>{i("close-scriptos-ui-modal"),e.scriptOsUiModal&&e.scriptOsUiModal.loadTimeout&&clearTimeout(e.scriptOsUiModal.loadTimeout),e.scriptOsUiModal={isOpen:!1,url:null,title:null,isLoading:!1,error:null,loadTimeout:null},n.emit("render")}),n.on("configure-scripto",async s=>{i("configure-scripto",s);try{console.log("[ScriptO] Fetching ScriptO from:",s);const c=await fetch(s);if(!c.ok)throw new Error(`Failed to fetch ScriptO: ${c.status} ${c.statusText}`);const r=await c.text();console.log("[ScriptO] Fetched content, length:",r.length);const a=de(r);if(!a)throw new Error("Failed to parse ScriptO configuration");const l=s.split("/");let d=l[l.length-1];d=decodeURIComponent(d),d=decodeURIComponent(d);let p=d;a.info&&a.info.name&&(p=a.info.name),console.log("[ScriptO] Opening in config modal:",p);const u={filename:p,content:r,config:a};if(e.selectedScriptOs=u,e.scriptOsArgs={},a.args)for(const f in a.args){const g=a.args[f];g.value!==void 0?e.scriptOsArgs[f]=g.value:g.type==="str"?e.scriptOsArgs[f]="":g.type==="int"||g.type==="float"?e.scriptOsArgs[f]=0:g.type==="bool"?e.scriptOsArgs[f]=!1:g.type==="list"?e.scriptOsArgs[f]=g.optional?null:0:g.type==="dict"&&g.items&&(e.scriptOsArgs[f]=Object.keys(g.items)[0])}e.scriptOsModalView="config",e.isScriptOsModalOpen=!0,console.log("[ScriptO] Successfully opened ScriptO in config modal"),n.emit("render")}catch(c){console.error("[ScriptO] Error loading ScriptO:",c),alert(`Failed to load ScriptO from ${s}:
${c.message}`)}})}console.log("[Stores] ES modules loaded");let He=null;async function ws(){return He||(He=(await R(()=>Promise.resolve().then(()=>Vt),void 0)).CodeMirrorEditor),He}const An=console.log,K=B,qe=V,bs=new Qo;async function Cs(e,n){async function t(s){const{source:c,parentFolder:r,fileName:a,content:l=Fe,hasChanges:d=!1}=s,p=ri(),u=await ws(),f=e.cache(u,`editor_${p}`);return f.content=l,f.fileName=a,{id:p,source:c,parentFolder:r,fileName:a,editor:f,hasChanges:d}}async function o(s,c=null,r=null,a=null){s=="board"?e.boardNavigationPath:e.diskNavigationPath;const l=await t({fileName:c===null?Je():c,parentFolder:r,source:s,hasChanges:!0,content:a||Fe});let d=!1;return r!=null&&(s=="board"?d=await te(B,lt(e.boardNavigationRoot,l.parentFolder,l.fileName)):s=="disk"&&(d=await qe.fileExists(qe.getFullPath(e.diskNavigationRoot,l.parentFolder,l.fileName)))),e.openFiles.find(u=>u.parentFolder===l.parentFolder&&u.fileName===l.fileName&&u.source===l.source)||d?(await M(`File ${l.fileName} already exists on ${s}. Please choose another name.`),!1):(l.editor.onChange=function(){l.hasChanges=!0,n.emit("render")},e.openFiles.push(l),e.editingFile=l.id,!0)}await Zo(e,n,o),ts(e,n),is(e,n);const i=()=>{};os(e,n,K),ps(e,n,K,i,Oe),fs(e,n,K,qe,t,o),ss(e,n,K,H),vs(e,n,o),rs(e,n),document.addEventListener("connection-mode-change",s=>{const c=s.detail?.mode||"none";e.connectionMode=c,n.emit("render")}),document.addEventListener("firmware-panel-update",()=>{n.emit("render")}),n.on("navigate",s=>{n.emit("change-system-section",s)}),n.on("change-view",async s=>{s==="file-manager"&&(e.isConnected&&B&&B.isCommandRunning()&&(n.emit("stop"),await yt(250)),e.filesLoadedOnce||(An("[File Manager] Loading files for first time..."),e.filesLoadedOnce=!0),e.isConnected?n.emit("refresh-files"):n.emit("refresh-disk-files")),e.systemSection!==s&&(e.selectedFiles=[],e.systemSection=s,e.activeNetworkPanel=null,e.activePeripheralsPanel=null,e.activeSystemPanel=null,e.activeExtension=null,e.activeExtensionPanel=null,s==="editor"&&e.isConnected&&setTimeout(()=>{Oe(e);const c=e.cache(H,"terminal");c&&c.term&&(n.emit("bind-terminal-input"),n.emit("terminal-focus"))},100),n.emit("render"))}),n.on("launch-app",async(s,c)=>{window.launchApp(s,c)}),n.on("change-system-section",s=>{if(An("change-system-section",s),e.systemSection=s,s.startsWith("network:")){const c=s.split(":")[1];e.activeNetworkPanel=c,e.activeSystemPanel=null,e.activePeripheralsPanel=null,e.activeExtension=null,e.activeExtensionPanel=null}else if(s.startsWith("peripherals:")){const c=s.split(":")[1];e.activePeripheralsPanel=c,e.activeNetworkPanel=null,e.activeSystemPanel=null,e.activeExtension=null,e.activeExtensionPanel=null}else if(s.startsWith("system:")){const c=s.split(":")[1];e.activeSystemPanel=c,e.activeNetworkPanel=null,e.activePeripheralsPanel=null,e.activeExtension=null,e.activeExtensionPanel=null}else e.activeNetworkPanel=null,e.activePeripheralsPanel=null,e.activeSystemPanel=null,e.activeExtension=null,e.activeExtensionPanel=null;(s==="ai-agent"||s==="system:ai-agent")&&e.aiAgent.settings.provider==="openrouter"&&e.aiAgent.settings.apiKey&&e.aiAgent.openRouterModels.length===0&&n.emit("ai-fetch-openrouter-models"),n.emit("render")}),ls(e,n,K),cs(e,n,K),as(e,n),ms(e,n,K),ys(e,n,bs,o),typeof On=="function"?On(e,n):console.warn("[Store] Debugger store not loaded"),n.on("change-locale",s=>{e.locale=s,localStorage.setItem("locale",s),window.i18n&&window.i18n.setLocale(s),n.emit("render")}),window.i18n?(window.i18n.setLocale(e.locale),console.log("[i18n] Locale initialized to:",e.locale)):console.warn("[i18n] i18n module not available")}const xs=45,Ss=65,Es=320;typeof window<"u"&&(window.PANEL_CLOSED=xs,window.PANEL_TOO_SMALL=Ss,window.PANEL_DEFAULT=Es);function $s(e,n){return e.isInitializing?C`
      <div id="app" style="display: flex; justify-content: center; align-items: center; height: 100vh;">
        <p>Loading...</p>
      </div>
    `:C`
    <div id="app">
      ${Jo(e,n)}
      ${zi(e,n)}
    </div>
  `}async function Dn(){window.i18nReady&&(await window.i18nReady,console.log("[App] Translations loaded, starting app..."));let e=St();e.use(Cs),e.route("*",$s),e.mount("#app"),window.appState=e.state,window.appInstance=e,e.emitter.on("DOMContentLoaded",()=>{e.state.diskNavigationRoot&&e.emitter.emit("refresh-files");const n=new URLSearchParams(window.location.search),t=n.get("device");if(t){const i=`wss://${t}/webrepl`;localStorage.setItem("webrepl-url",i),console.log(`[App] Device URL from query param: ${i}`),setTimeout(()=>{e.emitter.emit("open-connection-dialog");const s=window.location.pathname;window.history.replaceState({},"",s)},500)}const o=n.get("configure");if(o&&setTimeout(()=>{e.emitter.emit("configure-scripto",o);const i=window.location.pathname;window.history.replaceState({},"",i)},500),!e.state.isConnected){let i=document.getElementById("hand-click-hint");if(!i){i=document.createElement("div"),i.id="hand-click-hint";const r=document.createElementNS("http://www.w3.org/2000/svg","svg");r.setAttribute("width","36"),r.setAttribute("height","36"),r.setAttribute("viewBox","0 0 24 24"),r.setAttribute("fill","none"),r.setAttribute("stroke","currentColor"),r.setAttribute("stroke-width","2"),r.setAttribute("stroke-linecap","round"),r.setAttribute("stroke-linejoin","round"),r.innerHTML=`
          <path d="M8 13v-8.5a1.5 1.5 0 0 1 3 0v7.5" />
          <path d="M11 11.5v-2a1.5 1.5 0 0 1 3 0v2.5" />
          <path d="M14 10.5a1.5 1.5 0 0 1 3 0v1.5" />
          <path d="M17 11.5a1.5 1.5 0 0 1 3 0v4.5a6 6 0 0 1 -6 6h-2h.208a6 6 0 0 1 -5.012 -2.7l-.196 -.3c-.312 -.479 -1.407 -2.388 -3.286 -5.728a1.5 1.5 0 0 1 .536 -2.022a1.867 1.867 0 0 1 2.28 .28l1.47 1.47" />
          <path d="M5 3l-1 -1" />
          <path d="M4 7h-1" />
          <path d="M14 3l1 -1" />
          <path d="M15 6h1" />
        `,i.appendChild(r),document.body.appendChild(i)}const s=()=>{i.classList.add("animate"),setTimeout(()=>{i.classList.remove("animate")},7500)};setTimeout(s,1e3);const c=setInterval(s,1e4);e.emitter.on("connect",()=>{clearInterval(c);const r=document.getElementById("hand-click-hint");r&&r.remove()})}})}document.readyState==="complete"?Dn():window.addEventListener("load",Dn);export{R as _};
