const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/tree-sitter-Bi_wodRt.js","assets/vendor-B7iaGaih.js","assets/vendor-YJ71nRLj.js","assets/vendor-BmHXJZDI.css","assets/index-D8uXHUWg.js","assets/index-BvC6oQL-.js","assets/index-CEIVfw6W.js","assets/index-Ckq7-Rzu.js","assets/index-BR6z4vJu.js","assets/index-Bvni1Ih1.js","assets/index-CzizjDTO.js","assets/xterm-DOrYoP_4.css"])))=>i.map(i=>d[i]);
import{PANEL_TOO_SMALL as PANEL_TOO_SMALL$1,PANEL_CLOSED as PANEL_CLOSED$1,PANEL_DEFAULT as PANEL_DEFAULT$1}from"./vendor-B7iaGaih.js";import{c as cborExports,C as CBOR,h as html$1,a as Component$1,g,r as raw,b as Choo}from"./vendor-YJ71nRLj.js";(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const d of r.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&s(d)}).observe(document,{childList:!0,subtree:!0});function i(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerPolicy&&(r.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?r.credentials="include":o.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(o){if(o.ep)return;o.ep=!0;const r=i(o);fetch(o.href,r)}})();function parseScriptOsConfig(e){const n="# === START_CONFIG_PARAMETERS ===",i="# === END_CONFIG_PARAMETERS ===",s=e.indexOf(n),o=e.indexOf(i);if(s===-1||o===-1)return console.warn("[ScriptOs Parser] Config markers not found"),null;const r=e.substring(s+n.length,o).trim();try{return parsePythonDict(r)}catch(d){return console.error("[ScriptOs Parser] Failed to parse config:",d),null}}function parsePythonDict(e){let n=e.trim();n.startsWith("dict(")&&n.endsWith(")")&&(n=n.substring(5,n.length-1).trim()),n=n.split(`
`).map(o=>{let r=!1,d=null,a=!1;for(let c=0;c<o.length;c++){const l=o[c];if(a){a=!1;continue}if(l==="\\"){a=!0;continue}if((l==='"'||l==="'"||l==="`")&&!r){r=!0,d=l;continue}if(l===d&&r){r=!1,d=null;continue}if(l==="#"&&!r)return o.substring(0,c)}return o}).join(`
`),n=n.replace(/\\\s*[\r\n]+\s*/g," ");let i="{";const s=smartSplit(n,",");for(let o=0;o<s.length;o++){const r=s[o].trim();if(!r)continue;const d=r.indexOf("=");if(d===-1)continue;const a=r.substring(0,d).trim();let c=r.substring(d+1).trim();c=convertPythonValue(c),o>0&&(i+=","),i+=`"${a}":${c}`}return i+="}",JSON.parse(i)}function smartSplit(e,n){const i=[];let s="",o=0,r=!1,d=null,a=!1;for(let c=0;c<e.length;c++){const l=e[c],p=c>0?e[c-1]:"";if(a){s+=l,a=!1;continue}if(l==="\\"){a=!0,s+=l;continue}if((l==='"'||l==="'"||l==="`")&&!r){r=!0,d=l,s+=l;continue}if(l===d&&r&&p!=="\\"){r=!1,d=null,s+=l;continue}if(r){s+=l;continue}if(l==="("||l==="["||l==="{"?o++:(l===")"||l==="]"||l==="}")&&o--,l===n&&o===0){i.push(s),s="";continue}s+=l}return s.trim()&&i.push(s),i}function convertPythonValue(e){if(e=e.trim(),e==="None")return"null";if(e==="True")return"true";if(e==="False")return"false";if(/^-?\d+(\.\d+)?$/.test(e))return e;if(e.startsWith("[")&&e.endsWith("]")){const n=e.substring(1,e.length-1);return"["+smartSplit(n,",").map(o=>convertPythonValue(o)).join(",")+"]"}if(e.startsWith("(")&&e.endsWith(")")){const n=e.substring(1,e.length-1);return"["+smartSplit(n,",").map(o=>convertPythonValue(o)).join(",")+"]"}if(e.startsWith("dict(")&&e.endsWith(")")){const n=e.substring(5,e.length-1);return convertDictContent(n)}if(e.startsWith("{")&&e.endsWith("}")){const n=e.substring(1,e.length-1);return convertDictLiteral(n)}if(e.includes("+")){const n=e.split("+").map(i=>{const s=i.trim();return s.startsWith("'")||s.startsWith('"')?s.substring(1,s.length-1):s});return JSON.stringify(n.join(""))}if(e.startsWith("'''")||e.startsWith('"""')){e.substring(0,3);let n=e.substring(3,e.length-3);return n=n.replace(/\s+/g," ").trim(),JSON.stringify(n)}return e.startsWith("'")&&e.endsWith("'")||e.startsWith('"')&&e.endsWith('"')?JSON.stringify(e.substring(1,e.length-1)):e==="str"?'"str"':e==="int"?'"int"':e==="float"?'"float"':e==="bool"?'"bool"':e==="list"?'"list"':e==="dict"?'"dict"':JSON.stringify(e)}function convertDictContent(e){let n="{";const i=smartSplit(e,",");let s=!0;for(let o=0;o<i.length;o++){const r=i[o].trim();if(!r)continue;const d=r.indexOf("=");if(d===-1)continue;const a=r.substring(0,d).trim();let c=r.substring(d+1).trim();c=convertPythonValue(c),s||(n+=","),n+=`"${a}":${c}`,s=!1}return n+="}",n}function convertDictLiteral(e){let n="{";const i=smartSplit(e,",");let s=!0;for(let o=0;o<i.length;o++){const r=i[o].trim();if(!r)continue;const d=r.indexOf(":");if(d===-1)continue;let a=r.substring(0,d).trim(),c=r.substring(d+1).trim();(a.startsWith("'")&&a.endsWith("'")||a.startsWith('"')&&a.endsWith('"'))&&(a=a.substring(1,a.length-1)),c=convertPythonValue(c),s||(n+=","),n+=`"${a}":${c}`,s=!1}return n+="}",n}function generateScriptOsCode(e,n,i){const s="# === START_CONFIG_PARAMETERS ===",o="# === END_CONFIG_PARAMETERS ===",r=e.indexOf(s),d=e.indexOf(o);if(r===-1||d===-1)return e;const a=e.substring(0,r).trim(),c=e.substring(d+o.length).trim();if(!n.args||Object.keys(n.args).length===0){const u=n.info||{};let f=`# ${u.name||"ScriptO"}
`;return u.description&&(f+=`# ${u.description}
`),u.author&&(f+=`# Author: ${u.author}
`),f+=`
`,f+(a?a+`

`:"")+c}const l=n.info||{};let p=`# ${l.name||"ScriptO"}
`;l.description&&(p+=`# ${l.description}
`),l.author&&(p+=`# Author: ${l.author}
`),p+=`
`,a&&(p+=a+`

`),p+=`# Configuration
`,p+=`class args:
`;for(const u in n.args){const f=n.args[u];let h=i[u];h==null&&(h=f.value);let m;h==null?m="None":typeof h=="string"?m=`'${escapePythonString(h)}'`:typeof h=="boolean"?m=h?"True":"False":typeof h=="number"?m=h.toString():Array.isArray(h)?m="["+h.map(v=>typeof v=="string"?`'${escapePythonString(v)}'`:v).join(", ")+"]":m="None",p+=`    ${u} = ${m}
`}return p+=`
`,c&&(p+=c),p}function escapePythonString(e){return String(e).replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/\t/g,"\\t")}class IndexedDBFileBridge{constructor(){this.DB_NAME="scripto-studio-files",this.DB_VERSION=1,this.STORE_FILES="files",this.rootPath="/"}async _initDB(){return new Promise((n,i)=>{const s=indexedDB.open(this.DB_NAME,this.DB_VERSION);s.onerror=()=>i(s.error),s.onsuccess=()=>n(s.result),s.onupgradeneeded=o=>{const r=o.target.result;r.objectStoreNames.contains(this.STORE_FILES)||r.createObjectStore(this.STORE_FILES)}})}_normalizePath(n){return n?(n=n.replace(this.rootPath,""),n.startsWith("/")||(n="/"+n),n!=="/"&&n.endsWith("/")&&(n=n.slice(0,-1)),n):"/"}async _getFilesInDirectory(n){const i=this._normalizePath(n),s=i==="/"?"/":i+"/",o=await this._initDB();return new Promise((r,d)=>{const l=o.transaction([this.STORE_FILES],"readonly").objectStore(this.STORE_FILES).openCursor(),p=[],u=new Set;l.onsuccess=f=>{const h=f.target.result;if(h){const m=h.key,v=h.value;if(m.startsWith(s)){const y=m.substring(s.length);if(m.endsWith("/")&&v.type==="folder"){const w=y.slice(0,-1);w&&!w.includes("/")&&!u.has(w)&&(u.add(w),p.push({path:w,type:"folder"}))}else if(y&&!y.includes("/"))p.push({path:y,type:v.type||"file",content:v.content,timestamp:v.timestamp,size:v.size});else if(y.includes("/")){const w=y.split("/")[0];u.has(w)||(u.add(w),p.push({path:w,type:"folder"}))}}h.continue()}else p.sort((m,v)=>m.type===v.type?m.path.localeCompare(v.path):m.type==="folder"?-1:1),r(p)},l.onerror=()=>d(l.error)})}async initialize(){try{return await this._initDB(),!0}catch(n){return console.error("[IDB FS] Error initializing:",n),!1}}isSupported(){return"indexedDB"in window}async openFolder(){const n=await this.ilistFiles("/");return{folder:this.rootPath,files:n}}async ilistFiles(n){try{return(await this._getFilesInDirectory(n)).map(s=>{let o=s.size;return o===void 0&&s.type==="file"&&(s.content?typeof s.content=="string"?o=new TextEncoder().encode(s.content).length:s.content instanceof ArrayBuffer?o=s.content.byteLength:s.content instanceof Uint8Array?o=s.content.length:s.content instanceof Blob&&(o=s.content.size):o=0),{path:s.path,type:s.type,size:o}})}catch(i){return console.error("[IDB FS] Error listing files:",i),[]}}async ilistAllFiles(n){try{const i=this._normalizePath(n),s=i==="/"?"/":i+"/",o=await this._initDB();return new Promise((r,d)=>{const l=o.transaction([this.STORE_FILES],"readonly").objectStore(this.STORE_FILES).openCursor(),p=[],u=new Set;l.onsuccess=f=>{const h=f.target.result;if(h){const m=h.key,v=h.value;if(m.startsWith(s)){const y=m.substring(s.length);if(y){const w=y.split("/");let S=s.slice(0,-1);for(let x=0;x<w.length;x++)S+="/"+w[x],u.has(S)||(u.add(S),x===w.length-1&&v.type==="file"?p.push({path:S,type:"file"}):x<w.length-1&&p.push({path:S,type:"folder"}))}}h.continue()}else r(p)},l.onerror=()=>d(l.error)})}catch(i){return console.error("[IDB FS] Error listing all files:",i),[]}}async loadFile(n){try{const i=this._normalizePath(n),s=await this._initDB();return new Promise((o,r)=>{const c=s.transaction([this.STORE_FILES],"readonly").objectStore(this.STORE_FILES).get(i);c.onsuccess=()=>{const l=c.result;if(!l||l.type!=="file"){r(new Error(`File not found: ${n}`));return}const p=l.content||"",f=new TextEncoder().encode(p).buffer;console.log("[IDB FS] Loaded file:",n,"(",f.byteLength,"bytes)"),o(f)},c.onerror=()=>r(c.error)})}catch(i){throw console.error("[IDB FS] Error loading file:",i),new Error(`Failed to load file: ${i.message}`)}}async saveFileContent(n,i){try{const s=this._normalizePath(n);let o=i;i instanceof Uint8Array?o=new TextDecoder().decode(i):i instanceof ArrayBuffer?o=new TextDecoder().decode(new Uint8Array(i)):i instanceof Blob?o=await i.text():typeof i!="string"&&(o=String(i));const r=await this._initDB();return new Promise((d,a)=>{const p=r.transaction([this.STORE_FILES],"readwrite").objectStore(this.STORE_FILES).put({type:"file",content:o,timestamp:Date.now(),size:new TextEncoder().encode(o).length},s);p.onsuccess=()=>{console.log("[IDB FS] Saved file:",n),d(!0)},p.onerror=()=>a(p.error)})}catch(s){throw console.error("[IDB FS] Error saving file:",s),new Error(`Failed to save file: ${s.message}`)}}async importFiles(n="/"){return new Promise((i,s)=>{const o=document.createElement("input");o.type="file",o.multiple=!0,o.accept="*/*",o.onchange=async r=>{try{const d=Array.from(r.target.files);if(d.length===0){i([]);return}const a=[];for(const c of d){const l=await c.text(),p=this.getFullPath(n,"",c.name);await this.saveFileContent(p,l),a.push({name:c.name,path:p,size:c.size}),console.log("[IDB FS] Imported file:",c.name,"→",p)}i(a)}catch(d){console.error("[IDB FS] Error importing files:",d),s(d)}},o.oncancel=()=>{i([])},o.click()})}async fileExists(n){try{const i=this._normalizePath(n),s=await this._initDB();return new Promise((o,r)=>{const c=s.transaction([this.STORE_FILES],"readonly").objectStore(this.STORE_FILES).get(i);c.onsuccess=()=>{const l=c.result;o(l&&l.type==="file")},c.onerror=()=>r(c.error)})}catch{return!1}}async folderExists(n){try{const i=this._normalizePath(n),s=i.endsWith("/")?i:i+"/",o=i==="/"?"/":i+"/",r=await this._initDB();return new Promise((d,a)=>{const l=r.transaction([this.STORE_FILES],"readonly").objectStore(this.STORE_FILES),p=l.get(s);p.onsuccess=()=>{if(p.result&&p.result.type==="folder"){d(!0);return}const u=l.openCursor();u.onsuccess=f=>{const h=f.target.result;if(h){const m=h.key;if(m.startsWith(o)&&m!==s){d(!0);return}h.continue()}else d(!1)},u.onerror=()=>a(u.error)},p.onerror=()=>a(p.error)})}catch{return!1}}async removeFile(n){try{const i=this._normalizePath(n),s=await this._initDB();return new Promise((o,r)=>{const c=s.transaction([this.STORE_FILES],"readwrite").objectStore(this.STORE_FILES).delete(i);c.onsuccess=()=>{console.log("[IDB FS] Removed file:",n),o(!0)},c.onerror=()=>r(c.error)})}catch(i){throw console.error("[IDB FS] Error removing file:",i),new Error(`Failed to remove file: ${i.message}`)}}async renameFile(n,i){try{const s=this._normalizePath(n),o=this._normalizePath(i),r=await this.loadFile(n);return await this.saveFileContent(i,r),await this.removeFile(n),console.log("[IDB FS] Renamed file:",n,"->",i),!0}catch(s){throw console.error("[IDB FS] Error renaming file:",s),new Error(`Failed to rename file: ${s.message}`)}}async createFolder(n){try{const i=this._normalizePath(n),s=i.endsWith("/")?i:i+"/",o=await this._initDB();return new Promise((r,d)=>{const c=o.transaction([this.STORE_FILES],"readwrite").objectStore(this.STORE_FILES),l=c.get(s);l.onsuccess=()=>{if(l.result){console.log("[IDB FS] Folder already exists:",n),r(!0);return}const p=c.put({type:"folder",timestamp:Date.now()},s);p.onsuccess=()=>{console.log("[IDB FS] Created folder:",n),r(!0)},p.onerror=()=>d(p.error)},l.onerror=()=>d(l.error)})}catch(i){throw console.error("[IDB FS] Error creating folder:",i),new Error(`Failed to create folder: ${i.message}`)}}async removeFolder(n){try{const i=this._normalizePath(n),s=i==="/"?"/":i+"/",o=i.endsWith("/")?i:i+"/",r=await this._initDB();return new Promise((d,a)=>{const p=r.transaction([this.STORE_FILES],"readwrite").objectStore(this.STORE_FILES).openCursor(),u=[];p.onsuccess=f=>{const h=f.target.result;if(h){const m=h.key;(m.startsWith(s)||m===i||m===o)&&u.push(h.delete()),h.continue()}else Promise.all(u).then(()=>{console.log("[IDB FS] Removed folder:",n),d(!0)}).catch(a)},p.onerror=()=>a(p.error)})}catch(i){throw console.error("[IDB FS] Error removing folder:",i),new Error(`Failed to remove folder: ${i.message}`)}}async listFiles(n){return this.ilistFiles(n)}getFullPath(n,i,s){let o=n||"/";return i&&i!=="/"&&(o+=(o.endsWith("/")?"":"/")+i.replace(/^\//,"")),s&&(o+=(o.endsWith("/")?"":"/")+s),o.startsWith("/")||(o="/"+o),o}getNavigationPath(n,i){if(i===".."){const s=n.split("/").filter(o=>o);return s.pop(),"/"+s.join("/")}return n==="/"?"/"+i:n+"/"+i}async getAppPath(){return this.rootPath}async clearWorkspace(){try{const n=await this._initDB();return new Promise((i,s)=>{const d=n.transaction([this.STORE_FILES],"readwrite").objectStore(this.STORE_FILES).clear();d.onsuccess=()=>{console.log("[IDB FS] Workspace cleared"),i()},d.onerror=()=>s(d.error)})}catch(n){console.error("[IDB FS] Error clearing workspace:",n)}}async listScriptOsFiles(){try{const n="/ScriptOs",i=await this.ilistFiles(n),s=[];console.log(`[IDB FS] Found ${i.length} items in ScriptOs directory`);for(const o of i)if(o.type==="file"&&o.path.endsWith(".py"))try{const r=n+"/"+o.path,d=await this.loadFile(r),a=new TextDecoder().decode(new Uint8Array(d)),c=parseScriptOsConfig(a);c?(s.push({filename:o.path,fullPath:r,content:a,config:c}),console.log(`[IDB FS] Loaded ScriptO: ${c.info?.name||o.path}`)):console.warn(`[IDB FS] No valid config found in: ${o.path}`)}catch(r){console.error(`[IDB FS] Error loading ScriptO ${o.path}:`,r)}return console.log(`[IDB FS] Successfully loaded ${s.length} ScriptOs`),s}catch(n){return console.error("[IDB FS] Error listing ScriptOs files:",n),[]}}async hasOnboardedDevices(){try{return(await this.ilistFiles("/onboarded")).some(i=>i.type==="file"&&i.path.endsWith(".json"))}catch{return!1}}async getOnboardedDevices(){try{const n=await this.ilistFiles("/onboarded"),i=[];for(const s of n)if(s.type==="file"&&s.path.endsWith(".json"))try{const o=await this.loadFile("/onboarded/"+s.path),r=new TextDecoder().decode(new Uint8Array(o));i.push(JSON.parse(r))}catch(o){console.warn("[IDB FS] Error parsing device file:",s.path,o)}return i}catch(n){return console.error("[IDB FS] Error listing onboarded devices:",n),[]}}async addOnboardedDevice(n,i){try{await this.createFolder("/onboarded");const o="/onboarded/"+(n.replace(/:/g,"")+".json");await this.saveFileContent(o,JSON.stringify(i,null,2)),console.log("[IDB FS] Added onboarded device:",i.hostname||n)}catch(s){throw console.error("[IDB FS] Error adding onboarded device:",s),s}}}const BridgeDisk=new IndexedDBFileBridge,AIAgentSystemPrompt=`You are an expert MicroPython developer specializing in ESP32 microcontrollers.

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
   ALWAYS unregister routes with httpserver.off() before registering to avoid conflicts`;class AIBridge{constructor(){this.registryExamples=null,this.registryUrl="https://scriptostudio.com/registry/index.json",this.systemPrompt=AIAgentSystemPrompt,this.systemPrompt||console.warn("[AIBridge] System prompt not loaded")}async testConnection(n){const{provider:i,apiKey:s,model:o,endpoint:r}=n;if(!s)throw new Error("API key is required");try{const d=await this.makeRequest("Hi! Just testing the connection.",[],n,!0);return{success:!0}}catch(d){throw new Error(d.message||"Connection test failed")}}async fetchRegistryExamples(){if(this.registryExamples)return this.registryExamples;try{console.log("[AIBridge] Fetching registry examples...");const n=await fetch(this.registryUrl);if(!n.ok)throw new Error("Failed to fetch registry");const i=await n.json(),s=[],o=["UI Plugins","GPIO","Hardware","Utilities"];for(const r of o){const d=i.scriptos.find(a=>a.tags&&a.tags.includes(r));if(d){const a=await fetch(d.url);if(a.ok){const c=await a.text();s.push({name:d.name,category:r,code:c})}}}return this.registryExamples=s,console.log(`[AIBridge] Loaded ${s.length} registry examples`),s}catch(n){return console.warn("[AIBridge] Failed to fetch registry examples:",n),[]}}async generateCode(n,i,s){await this.fetchRegistryExamples();const o=this.buildMessages(n,i,s);try{const r=await this.makeRequest(n,o,s,!1);console.log("[AIBridge] Raw AI response:",r.substring(0,200)+"...");const d=this.extractCode(r);return console.log("[AIBridge] Extracted code:",d?"YES ("+d.length+" chars)":"NO CODE FOUND"),d&&(console.log("[AIBridge] Extracted code (first 300 chars):",d.substring(0,300)),console.log("[AIBridge] Code has START marker:",d.includes("# === START_CONFIG_PARAMETERS ===")),console.log("[AIBridge] Code has END marker:",d.includes("# === END_CONFIG_PARAMETERS ==="))),{content:r,code:d}}catch(r){throw console.error("[AIBridge] Error generating code:",r),r}}buildMessages(n,i,s){const o=[];let r=s.systemPrompt&&typeof s.systemPrompt=="string"&&s.systemPrompt.trim().length>0?s.systemPrompt.trim():this.systemPrompt;if(this.registryExamples&&this.registryExamples.length>0){r+=`

REAL-WORLD EXAMPLES FROM REGISTRY:

`,r+=`Study these actual ScriptOs from the registry to learn the patterns:

`;for(const c of this.registryExamples){r+=`Example: ${c.name} (${c.category})
`,r+="```python\n";const l=c.code.length>500?c.code.substring(0,500)+`
# ... (rest of code omitted)
`:c.code;r+=l,r+="```\n\n"}r+=`Use these examples as reference for proper ScriptO format, patterns, and best practices.
`}console.log("[AIBridge] Using system prompt:",r===this.systemPrompt?"DEFAULT (ScriptO format)":"CUSTOM","| Length:",r.length,"chars",this.registryExamples?`| ${this.registryExamples.length} registry examples`:""),(s.provider==="openai"||s.provider==="grok"||s.provider==="openrouter"||s.provider==="custom")&&o.push({role:"system",content:r}),i.slice(-10).filter(c=>c.role==="user"||c.role==="assistant").forEach(c=>{(c.role==="user"||c.role==="assistant")&&o.push({role:c.role,content:c.content})});const a=i[i.length-1];return(!a||a.content!==n)&&o.push({role:"user",content:n}),o}async makeRequest(n,i,s,o=!1){const{provider:r,apiKey:d,model:a,endpoint:c,anthropicProxyUrl:l}=s;switch(r){case"openai":return await this.callOpenAI(i,d,a,o);case"anthropic":const p=s.systemPrompt&&typeof s.systemPrompt=="string"&&s.systemPrompt.trim().length>0?s.systemPrompt.trim():this.systemPrompt;return await this.callAnthropic(i,d,a,p,o,l);case"grok":return await this.callGrok(i,d,a,o);case"openrouter":return await this.callOpenRouter(i,d,a,o);case"custom":return await this.callCustomEndpoint(i,d,a,c,o);default:throw new Error(`Unknown provider: ${r}`)}}async callOpenAI(n,i,s,o){const r="https://api.openai.com/v1/chat/completions",d={model:s,messages:o?[{role:"system",content:"You are a helpful assistant."},{role:"user",content:'Say "OK" if you can read this.'}]:n,temperature:.7,max_tokens:o?10:2e3},a=await fetch(r,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${i}`},body:JSON.stringify(d)});if(!a.ok){let l=`OpenAI API error: ${a.status}`;try{const p=await a.json(),u=p.error?.message||"";u.includes("insufficient_quota")||u.includes("billing")?l="Insufficient credits or billing issue. Please check your OpenAI account balance.":a.status===401?l="Invalid API key. Please check your API key in System > AI Agent settings.":a.status===403?l="Access forbidden. Check your API key permissions and account status.":l=p.error?.message||l}catch{l=`OpenAI API error: ${a.status} ${a.statusText}`}throw new Error(l)}return(await a.json()).choices[0].message.content}async callAnthropic(n,i,s,o,r,d){const a=d||"http://localhost:3001/api/anthropic",c=n.filter(p=>p.role!=="system"),l={model:s,max_tokens:r?10:2e3,system:r?"You are a helpful assistant.":o,messages:r?[{role:"user",content:'Say "OK" if you can read this.'}]:c,apiKey:i||void 0};try{const p=await fetch(a,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(l)});if(!p.ok){let f=`Anthropic API error: ${p.status}`;try{const h=await p.json();f=h.error?.message||h.message||f}catch{}throw new Error(f)}return(await p.json()).content[0].text}catch(p){throw p.message.includes("Failed to fetch")||p.message.includes("NetworkError")||p.name==="TypeError"?new Error(`Could not connect to Anthropic proxy server at ${a}. Make sure the proxy server is running. See proxy-server/README.md for setup instructions.`):p}}async callGrok(n,i,s,o){const r="https://api.x.ai/v1/chat/completions",d={model:s,messages:o?[{role:"system",content:"You are a helpful assistant."},{role:"user",content:'Say "OK" if you can read this.'}]:n,stream:!1,temperature:o?0:.7,max_tokens:o?10:2e3},a=await fetch(r,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${i}`},body:JSON.stringify(d)});if(!a.ok){let l=`Grok API error: ${a.status} ${a.statusText}`;try{const p=await a.json();if(p.code||p.error){const u=p.code||"",f=p.error||"";u.includes("permission")||f.includes("credits")?l="No credits available. Please purchase credits at https://console.x.ai or check your account balance.":u.includes("authentication")||a.status===401?l="Invalid API key. Please check your API key in System > AI Agent settings.":a.status===403?l=p.error||p.message||"Access forbidden. Check your API key permissions and account status.":l=p.error||p.message||p.code||l}else l=p.message||l}catch{const u=await a.text();u&&(l+=` - ${u}`)}throw new Error(l)}return(await a.json()).choices[0].message.content}async callOpenRouter(n,i,s,o){const r="https://openrouter.ai/api/v1/chat/completions",d={model:s,messages:o?[{role:"system",content:"You are a helpful assistant."},{role:"user",content:'Say "OK" if you can read this.'}]:n},a=await fetch(r,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${i}`,"HTTP-Referer":window.location.origin,"X-Title":"ScriptO Studio"},body:JSON.stringify(d)});if(!a.ok){let l=`OpenRouter API error: ${a.status} ${a.statusText}`;try{const p=await a.json(),u=p.error?.message||p.message||"";u.includes("credits")||u.includes("balance")?l="Insufficient credits. Please add credits to your OpenRouter account.":a.status===401?l="Invalid API key. Please check your API key in System > AI Agent settings.":a.status===403?l=p.error?.message||p.message||"Access forbidden. Check your API key permissions and account status.":l=p.error?.message||p.message||l}catch{const u=await a.text();u&&(l+=` - ${u}`)}throw new Error(l)}return(await a.json()).choices[0].message.content}async callCustomEndpoint(n,i,s,o,r){if(!o)throw new Error("Custom endpoint URL is required");const d={model:s,messages:r?[{role:"system",content:"You are a helpful assistant."},{role:"user",content:'Say "OK" if you can read this.'}]:n,temperature:.7,max_tokens:r?10:2e3},a=await fetch(o,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${i}`},body:JSON.stringify(d)});if(!a.ok)throw new Error(`Custom endpoint error: ${a.status}`);const c=await a.json();if(c.choices&&c.choices[0]?.message?.content)return c.choices[0].message.content;if(c.content&&Array.isArray(c.content))return c.content[0].text;if(c.response)return c.response;if(c.text)return c.text;throw new Error("Unable to parse response from custom endpoint")}extractCode(n){let i=null;const s=n.match(/```python\n([\s\S]*?)```/);if(s&&(i=s[1].trim()),!i){const o=n.match(/```\n([\s\S]*?)```/);o&&(i=o[1].trim())}if(!i&&n.includes("# === START_CONFIG_PARAMETERS ===")&&(i=n.trim()),i){const o=i.includes("# === START_CONFIG_PARAMETERS ==="),r=i.includes("def ")||i.includes("import ")||i.includes("print(")||i.includes("class ")||/^[a-zA-Z_][\w]*\s*=/.test(i);return!o&&!r?(console.log("[AIBridge] Extracted content does not look like code, ignoring"),null):i.length<50?(console.log("[AIBridge] Extracted code too short, probably not valid:",i.length,"chars"),null):i}return null}}const AIBridgeInstance=new AIBridge;class ExtensionRegistry{constructor(){this.DB_NAME="scripto-studio-extension-registry",this.DB_VERSION=1,this.STORE_INDEX="index",this.STORE_EXTENSIONS="extensions",this.STORE_INSTALLED="installed"}async _initDB(){return new Promise((e,n)=>{const i=indexedDB.open(this.DB_NAME,this.DB_VERSION);i.onerror=()=>n(i.error),i.onsuccess=()=>e(i.result),i.onupgradeneeded=s=>{const o=s.target.result;o.objectStoreNames.contains(this.STORE_INDEX)||o.createObjectStore(this.STORE_INDEX,{keyPath:"id"}),o.objectStoreNames.contains(this.STORE_EXTENSIONS)||o.createObjectStore(this.STORE_EXTENSIONS,{keyPath:"id"}),o.objectStoreNames.contains(this.STORE_INSTALLED)||o.createObjectStore(this.STORE_INSTALLED,{keyPath:"id"})}})}async loadIndex(e){try{const n=await this._initDB();try{const i=await fetch(e);if(!i.ok)throw new Error(`Failed to fetch registry: ${i.status}`);const o=(await i.json()).extensions||[],d=n.transaction([this.STORE_INDEX],"readwrite").objectStore(this.STORE_INDEX);return await new Promise((a,c)=>{const l=d.put({id:"registry",timestamp:Date.now(),extensions:o});l.onsuccess=()=>a(),l.onerror=()=>c(l.error)}),console.log("[Extension Registry] Loaded and cached index:",o.length,"extensions"),o}catch(i){console.warn("[Extension Registry] Failed to fetch index, trying cache:",i);const o=n.transaction([this.STORE_INDEX],"readonly").objectStore(this.STORE_INDEX);return new Promise((r,d)=>{const a=o.get("registry");a.onsuccess=()=>{const c=a.result;c&&c.extensions?(console.log("[Extension Registry] Using cached index:",c.extensions.length,"extensions"),r(c.extensions)):d(new Error("No cached registry available"))},a.onerror=()=>d(a.error)})}}catch(n){return console.error("[Extension Registry] Error loading index:",n),[]}}parseExtensionConfig(content){const metaMatch=content.match(/export\s+const\s+__EXTENSION_META__\s*=\s*(\{[\s\S]*?\});/);if(!metaMatch)return console.error("[Extension Registry] No __EXTENSION_META__ found in V2 bundle"),null;try{return JSON.parse(metaMatch[1])}catch(error){try{return eval("("+metaMatch[1]+")")}catch(e){return console.error("[Extension Registry] Failed to parse V2 config:",error),null}}}async installExtension(e){try{console.log("[Extension Registry] Installing extension:",e.name);const n=await fetch(e.url);if(!n.ok)throw new Error(`Failed to fetch extension: ${n.status}`);const i=await n.text(),s=this.parseExtensionConfig(i);if(!s)throw new Error("Failed to parse extension config");const o=await this._initDB(),r={id:e.id,content:i,config:s,styles:s.styles||"",mipPackage:s.mipPackage||e.mipPackage||null,url:e.url,installedAt:Date.now()},a=o.transaction([this.STORE_EXTENSIONS],"readwrite").objectStore(this.STORE_EXTENSIONS);await new Promise((p,u)=>{const f=a.put(r);f.onsuccess=()=>p(),f.onerror=()=>u(f.error)});const l=o.transaction([this.STORE_INSTALLED],"readwrite").objectStore(this.STORE_INSTALLED);return await new Promise((p,u)=>{const f=l.put({id:e.id,name:s.name,icon:s.icon,iconSvg:s.iconSvg,menu:s.menu,version:s.version,mipPackage:s.mipPackage||null,installedAt:Date.now()});f.onsuccess=()=>p(),f.onerror=()=>u(f.error)}),console.log("[Extension Registry] Extension installed:",s.name),r}catch(n){throw console.error("[Extension Registry] Installation failed:",n),n}}async getInstalledExtensions(){try{const i=(await this._initDB()).transaction([this.STORE_INSTALLED],"readonly").objectStore(this.STORE_INSTALLED);return new Promise((s,o)=>{const r=i.getAll();r.onsuccess=()=>{console.log("[Extension Registry] Found installed extensions:",r.result.length),s(r.result)},r.onerror=()=>o(r.error)})}catch(e){return console.error("[Extension Registry] Error getting installed extensions:",e),[]}}async getExtension(e){try{const s=(await this._initDB()).transaction([this.STORE_EXTENSIONS],"readonly").objectStore(this.STORE_EXTENSIONS);return new Promise((o,r)=>{const d=s.get(e);d.onsuccess=()=>{d.result?(console.log("[Extension Registry] Loaded extension from cache:",e),o(d.result)):(console.warn("[Extension Registry] Extension not found in cache:",e),o(null))},d.onerror=()=>r(d.error)})}catch(n){return console.error("[Extension Registry] Error getting extension:",n),null}}async uninstallExtension(e){try{const n=await this._initDB(),s=n.transaction([this.STORE_EXTENSIONS],"readwrite").objectStore(this.STORE_EXTENSIONS);await new Promise((d,a)=>{const c=s.delete(e);c.onsuccess=()=>d(),c.onerror=()=>a(c.error)});const r=n.transaction([this.STORE_INSTALLED],"readwrite").objectStore(this.STORE_INSTALLED);return await new Promise((d,a)=>{const c=r.delete(e);c.onsuccess=()=>d(),c.onerror=()=>a(c.error)}),console.log("[Extension Registry] Extension uninstalled:",e),!0}catch(n){return console.error("[Extension Registry] Uninstall failed:",n),!1}}async installExtensionFromContent(e){try{const n=this.parseExtensionConfig(e);if(!n)throw new Error("Failed to parse extension config. Ensure the file is a valid bundle with __EXTENSION_META__.");if(!n.id)throw new Error('Extension config must have an "id" field');console.log("[Extension Registry] Installing extension from content:",n.name||n.id);const i=await this._initDB(),s={id:n.id,content:e,config:n,styles:n.styles||"",mipPackage:n.mipPackage||null,url:"local://dev",installedAt:Date.now()},r=i.transaction([this.STORE_EXTENSIONS],"readwrite").objectStore(this.STORE_EXTENSIONS);await new Promise((c,l)=>{const p=r.put(s);p.onsuccess=()=>c(),p.onerror=()=>l(p.error)});const a=i.transaction([this.STORE_INSTALLED],"readwrite").objectStore(this.STORE_INSTALLED);return await new Promise((c,l)=>{const p=a.put({id:n.id,name:n.name,icon:n.icon,iconSvg:n.iconSvg,menu:n.menu,version:n.version,mipPackage:n.mipPackage||null,installedAt:Date.now()});p.onsuccess=()=>c(),p.onerror=()=>l(p.error)}),console.log("[Extension Registry] Extension installed:",n.name),s}catch(n){throw console.error("[Extension Registry] Installation from content failed:",n),n}}async getDependencies(e){try{const s=(await this._initDB()).transaction([this.STORE_EXTENSIONS],"readonly").objectStore(this.STORE_EXTENSIONS);return new Promise((o,r)=>{const d=s.get(e);d.onsuccess=()=>{const a=d.result;a&&a.config&&a.config.mipPackage?o({mipPackage:a.config.mipPackage}):o(null)},d.onerror=()=>r(d.error)})}catch(n){return console.error("[Extension Registry] Error getting dependencies:",n),null}}async updateExtensionDev(e,n){try{console.log("[Extension Registry] DEV: Updating extension:",e);const i=this.parseExtensionConfig(n);if(!i)throw new Error("Failed to parse extension config from content");const s=await this._initDB(),o=await this.getExtension(e);if(!o)throw new Error(`Extension ${e} not found. Install it first from the registry.`);const r={id:e,content:n,config:i,styles:i.styles||"",mipPackage:i.mipPackage||null,url:o.url,installedAt:o.installedAt||Date.now()},a=s.transaction([this.STORE_EXTENSIONS],"readwrite").objectStore(this.STORE_EXTENSIONS);await new Promise((p,u)=>{const f=a.put(r);f.onsuccess=()=>p(),f.onerror=()=>u(f.error)});const l=s.transaction([this.STORE_INSTALLED],"readwrite").objectStore(this.STORE_INSTALLED);return await new Promise((p,u)=>{const f=l.put({id:e,name:i.name,icon:i.icon,menu:i.menu,version:i.version,mipPackage:i.mipPackage||null,installedAt:o.installedAt||Date.now()});f.onsuccess=()=>p(),f.onerror=()=>u(f.error)}),console.log("[Extension Registry] DEV: Extension updated successfully:",i.name),console.log("[Extension Registry] DEV: Reload the extension panel to see changes"),r}catch(i){throw console.error("[Extension Registry] DEV: Update failed:",i),i}}async updateExtensionDevFromFile(e,n){try{console.log("[Extension Registry] DEV: Fetching extension from:",n);const i=await fetch(n);if(!i.ok)throw new Error(`Failed to fetch file: ${i.status} ${i.statusText}`);const s=await i.text();return await this.updateExtensionDev(e,s)}catch(i){throw console.error("[Extension Registry] DEV: Failed to load file:",i),i}}}const extensionLoader=Object.freeze(Object.defineProperty({__proto__:null,ExtensionRegistry},Symbol.toStringTag,{value:"Module"}));let DeviceAPI$1=class{constructor(n){this.device=n}async execute(n,i={}){if(!this.device)throw new Error("Device not connected");try{return await this.device.exec(n)||""}catch(s){throw i.suppressErrors||console.error("[DeviceAPI] Execution error:",s),s}}async saveFile(n,i,s={}){if(!this.device)throw new Error("Device not connected");return this.device.saveFile(n,i,s)}subscribe(n,i){this.device&&this.device.subscribe(n,i)}unsubscribe(n){this.device&&this.device.unsubscribe(n)}async mkdir(n){if(!this.device)throw new Error("Device not connected");await this.device.exec(`
import os, json
def mkdirs(p):
  parts = p.strip('/').split('/')
  cur = ''
  for part in parts:
    cur += '/' + part
    try: os.mkdir(cur)
    except: pass
mkdirs('${n}')
print(json.dumps({"ok":True}))
`)}parseJSON(n){if(n&&typeof n=="object")return n;if(!n)throw new Error("Empty output from device");typeof n!="string"&&(n=String(n));try{return JSON.parse(n)}catch{const s=n.indexOf("{");if(s!==-1){let o=0,r=-1;for(let d=s;d<n.length;d++)if(n[d]==="{"&&o++,n[d]==="}"&&o--,o===0){r=d+1;break}if(r!==-1){const d=n.substring(s,r);try{return JSON.parse(d)}catch{throw new Error("Failed to parse extracted JSON: "+d.substring(0,100))}}}throw new Error("Failed to parse response: "+n.substring(0,100))}}};const deviceApi=Object.freeze(Object.defineProperty({__proto__:null,DeviceAPI:DeviceAPI$1},Symbol.toStringTag,{value:"Module"}));let translations={en:{},de:{},es:{},fr:{},zh:{}},currentLocale="en";function initTranslations(e,n,i,s,o){translations.en=e||{},translations.de=n||{},translations.es=i||{},translations.fr=s||{},translations.zh=o||{}}function getLocale(){return currentLocale}function setLocale(e){getAvailableLocales().includes(e)&&(currentLocale=e)}function getAvailableLocales(){return["en","de","es","fr","zh"]}function getLocaleName(e){return{en:"English",de:"Deutsch",es:"Español",fr:"Français",zh:"中文"}[e]||e}function t(e,n={}){const s=translations[currentLocale||"en"]||translations.en,o=e.split(".");let r=s;for(const d of o)if(r&&typeof r=="object"&&d in r)r=r[d];else{let c=translations.en||{};for(const l of o)if(c&&typeof c=="object"&&l in c)c=c[l];else return e;r=c;break}return typeof r!="string"?e:Object.keys(n).length>0?r.replace(/\{(\w+)\}/g,(d,a)=>n[a]!==void 0?n[a]:d):r}const i18n={initTranslations,getLocale,setLocale,getAvailableLocales,getLocaleName,t};window.i18n=i18n;class WebREPLWCB{constructor(){this.websocket=null,this.state="DISCONNECTED",this.password="",this.dataCallbacks=[],this.connectionClosedCallbacks=[],this.eventHandlers=new Map,this.completionCallbacks=[],this.onEthStatus=null,this.onWwanStatus=null,this.pendingRequests=new Map,this.pendingRun=null,this.pendingFileOps=new Map,this.currentTransfer=null,this.isReady=!1,this.authenticated=!1,this.CH_FILE=23,this.CH_TRM=1,this.CH_M2M=2,this.CH_DBG=3,this.CH_LOG=4,this.CH_EVENT=0,this.OP_EXE=0,this.OP_INT=1,this.OP_RST=2,this.OP_RES=0,this.OP_CON=1,this.OP_PRO=2,this.OP_COM=3,this.FILE_RRQ=1,this.FILE_WRQ=2,this.FILE_DATA=3,this.FILE_ACK=4,this.FILE_ERROR=5,this.ERR_NOT_FOUND=1,this.ERR_ACCESS=2,this.ERR_DISK_FULL=3,this.EVT_AUTH=0,this.EVT_AUTH_OK=1,this.EVT_AUTH_FAIL=2,this.EVT_INFO=3,this.EVT_LOG=4,this.FMT_PY=0,this.FMT_MPY=1,this.DEFAULT_BLKSIZE=4096}_generateId(){return Math.random().toString(36).substring(2,9)}_sendChannel(n,i,s="",o={}){if(!this.websocket||this.state!=="CONNECTED"){console.warn("[WCB] Cannot send: not connected");return}const r=[n,i,s];o.id!==void 0?(r.push(o.format!==void 0?o.format:null),r.push(o.id)):o.format!==void 0&&r.push(o.format);const d=cborExports.encode(r),a=s?s.length:0;console.debug(`[WCB] Sending CH=${n} OP=${i} DataLen=${a} EncodedLen=${d.byteLength}`),this.websocket.send(d)}_sendEvent(n,...i){if(!this.websocket||this.state!=="CONNECTED"){console.warn("[WCB] Cannot send: not connected");return}const s=[this.CH_EVENT,n,...i],o=cborExports.encode(s);this.websocket.send(o)}_sendFileMsg(n,...i){if(this.state!=="CONNECTED")return;const s=[this.CH_FILE,n,...i],o=cborExports.encode(s);this.websocket.send(o)}_handleMessage(n){const i=n.data;if(!(i instanceof ArrayBuffer)){console.warn("[WCB] Unexpected TEXT frame");return}try{const s=cborExports.decode(i);if(!Array.isArray(s)||s.length<2){console.warn("[WCB] Invalid message format");return}const o=s[0];o===this.CH_FILE?this._handleFile(s):o===this.CH_EVENT?this._handleEvent(s):o>=this.CH_TRM&&o<=22?this._handleChannel(s):console.warn("[WCB] Unknown channel:",o)}catch(s){console.error("[WCB] Failed to decode CBOR:",s);const o=new Uint8Array(i),r=Array.from(o.slice(0,32)).map(d=>d.toString(16).padStart(2,"0")).join(" ");console.error("[WCB] Raw data (first 32 bytes):",r),console.error("[WCB] As ASCII:",String.fromCharCode(...o.slice(0,32)))}}_handleChannel(n){if(n.length<3)return;const[i,s,...o]=n;switch(s){case this.OP_RES:this._handleRES(i,o[0],o[1]);break;case this.OP_CON:this._handleCON(i);break;case this.OP_PRO:this._handlePRO(i,o[0],o[1],o[2]);break;case this.OP_COM:this._handleCOM(i,o[0]);break;default:console.warn("[WCB] Unknown channel opcode:",s)}}_handleRES(n,i,s){const o=this.parseDebugState(i);if(o){console.debug("[WCB] Parsed debug state:",o);const r=this.eventHandlers.get("debug-state");if(r)try{r(o)}catch(d){console.error("[WCB] debug-state event handler error:",d)}}if(s&&this.pendingRequests.has(s)){const r=this.pendingRequests.get(s);r.buffer=(r.buffer||"")+i,console.debug("[WCB] M2M RES with ID:",s,"data length:",i.length,"total buffer:",r.buffer.length);return}n===this.CH_M2M&&!s&&(console.warn("[WCB] M2M RES message missing ID (device bug). Expected one of:",Array.from(this.pendingRequests.keys())),console.warn("[WCB] RES data:",i.substring(0,200))),n===this.CH_TRM?this._notifyData(i,!1):n===this.CH_DBG?this._notifyData(i,!1):n===this.CH_LOG&&console.log("[WCB LOG]",i)}_handleCON(n){console.debug("[WCB] Continuation prompt (...)")}_handleCOM(n,i){console.debug("[WCB] Tab completions on channel",n,":",i),this.completionCallbacks.forEach(s=>{try{s(n,i)}catch(o){console.error("[WCB] Completion callback error:",o)}})}_handlePRO(n,i,s=null,o=null){if(o&&this.pendingRequests.has(o)){const r=this.pendingRequests.get(o),{resolve:d,reject:a,timeoutId:c,buffer:l}=r;if(clearTimeout(c),this.pendingRequests.delete(o),i!==0)a(new Error(s||"Request failed"));else if(n===this.CH_M2M){console.debug("[WCB] M2M PRO success with ID:",o,"buffer length:",l?l.length:0,"buffer:",l?l.substring(0,200):"null");try{let p=null;if(l)try{p=JSON.parse(l)}catch(u){const f=l.indexOf("{");if(f!==-1){let h=0,m=-1;for(let v=f;v<l.length;v++)if(l[v]==="{"&&h++,l[v]==="}"&&h--,h===0){m=v+1;break}if(m!==-1){const v=l.substring(f,m);p=JSON.parse(v)}else throw u}else throw u}d(p)}catch(p){console.warn("[WCB] Failed to parse JSON buffer:",p,"buffer:",l?l.substring(0,200):"null"),d(l||null)}}else d(l||null);return}if(n===this.CH_M2M&&!o&&console.warn("[WCB] M2M PRO message missing ID (device bug):",{status:i,error:s}),i!==0){const r=s||"Unknown error";if(console.error("[WCB] Error:",r),this.isReady=!0,this.pendingRun){const{reject:d}=this.pendingRun;this.pendingRun=null,d(new Error(r))}}else if(this.isReady=!0,this.pendingRun){const{resolve:r}=this.pendingRun;this.pendingRun=null,r()}}_handleFile(n){if(n.length<2)return;const i=n[1],s=n.slice(2);if(!this.currentTransfer){console.warn("[WCB] Received file message with no active transfer");return}switch(i){case this.FILE_ACK:this._handleFileAck(s);break;case this.FILE_DATA:this._handleFileData(s);break;case this.FILE_ERROR:this._handleFileError(s);break;default:console.warn("[WCB] Unknown file opcode:",i)}}_handleFileAck(n){if(!this.currentTransfer)return;const i=n[0];this.currentTransfer.type==="UPLOAD"?i===this.currentTransfer.blockNum&&this.currentTransfer.resolveBlock():this.currentTransfer.type==="DOWNLOAD"&&i===0&&this.currentTransfer.blockNum===-1&&(n.length>1&&(this.currentTransfer.totalSize=n[1]),n.length>2&&typeof n[2]=="number"&&n[2]>0&&(this.currentTransfer.blksize=n[2]),this._sendFileMsg(this.FILE_ACK,0),this.currentTransfer.blockNum=0)}_handleFileData(n){if(!this.currentTransfer||this.currentTransfer.type!=="DOWNLOAD")return;const i=n[0],s=n[1],o=(this.currentTransfer.blockNum+1)%65536;if(i===o){if((s instanceof Uint8Array||s instanceof ArrayBuffer)&&(this.currentTransfer.chunks.push(s),this.currentTransfer.receivedSize+=s.byteLength),this.currentTransfer.blockNum=i,this._sendFileMsg(this.FILE_ACK,i),this.currentTransfer.progressCallback&&this.currentTransfer.totalSize>0){const r=Math.floor(this.currentTransfer.receivedSize/this.currentTransfer.totalSize*100);this.currentTransfer.progressCallback(Math.min(r,99))}if(s.byteLength<this.currentTransfer.blksize){this.currentTransfer.progressCallback&&this.currentTransfer.progressCallback(100);const r=(Date.now()-this.currentTransfer.startTime)/1e3,d=(this.currentTransfer.receivedSize/r/1024).toFixed(2),a=(this.currentTransfer.receivedSize*8/r/1e6).toFixed(2);console.log(`[WCB] Download complete: ${this.currentTransfer.path} (${this.currentTransfer.receivedSize} bytes in ${r.toFixed(2)}s = ${d} KB/s / ${a} Mbps)`);const c=new Blob(this.currentTransfer.chunks),l=new FileReader;l.onload=()=>{this.currentTransfer.resolve(new Uint8Array(l.result)),this.currentTransfer=null},l.readAsArrayBuffer(c)}}else i===this.currentTransfer.blockNum&&this._sendFileMsg(this.FILE_ACK,i)}_handleFileError(n){if(this.currentTransfer){const i=n[0],s=n[1];this.currentTransfer.reject(new Error(`TFTP Error ${i}: ${s}`)),this.currentTransfer=null}}_handleEvent(n){if(n.length<2)return;const[i,s,...o]=n;switch(s){case this.EVT_AUTH_OK:console.log("[WCB] Event: AUTH_OK received"),this._authResolve?(this.authenticated=!0,this._authResolve(),this._authResolve=null,this._authReject=null):console.warn("[WCB] AUTH_OK but no pending auth handler (late/duplicate?)");break;case this.EVT_AUTH_FAIL:if(console.warn("[WCB] Event: AUTH_FAIL received, params:",o),this._authReject){const r=o[0]||"Authentication failed";this._authReject(new Error(r)),this._authResolve=null,this._authReject=null}else console.warn("[WCB] AUTH_FAIL but no pending auth handler");break;case this.EVT_INFO:{let r={};try{const a=o[0];if(typeof a!="string"){console.error("[WCB] INFO payload must be a JSON string, got:",typeof a);break}r=JSON.parse(a)}catch(a){console.error("[WCB] Failed to parse INFO payload JSON:",a,o[0]);break}if(r.welcome){this.isReady=!0;const a=this.eventHandlers.get("welcome");a&&a(r.welcome)}if(r.heap!==void 0){const a={heap:r.heap,uptime:r.uptime,rssi:r.rssi,extra:r.extra},c=this.eventHandlers.get("auto_info");c&&c(a)}if(r.eth_status!==void 0){if(console.log("[WCB] Ethernet status event:",r.eth_status),this.onEthStatus)try{this.onEthStatus(r.eth_status)}catch(c){console.error("[WCB] onEthStatus callback error:",c)}const a=this.eventHandlers.get("eth_status");if(a)try{a(r.eth_status)}catch(c){console.error("[WCB] eth_status event handler error:",c)}}if(r.wwan_status!==void 0){if(console.log("[WCB] WWAN status event:",r.wwan_status),this.onWwanStatus)try{this.onWwanStatus(r.wwan_status)}catch(c){console.error("[WCB] onWwanStatus callback error:",c)}const a=this.eventHandlers.get("wwan_status");if(a)try{a(r.wwan_status)}catch(c){console.error("[WCB] wwan_status event handler error:",c)}}if(r.display_ui!==void 0){if(console.log("[WCB] Display UI event:",r.display_ui),this.onDisplayUi)try{this.onDisplayUi(r.display_ui)}catch(c){console.error("[WCB] onDisplayUi callback error:",c)}const a=this.eventHandlers.get("display_ui");if(a)try{a(r.display_ui)}catch(c){console.error("[WCB] display_ui event handler error:",c)}}if(r.pfc_chat!==void 0){const a=this.eventHandlers.get("pfc_chat");if(a)try{a(r.pfc_chat)}catch(c){console.error("[WCB] pfc_chat handler error:",c)}}const d=this.eventHandlers.get("info");d&&d(r)}break;case this.EVT_LOG:{const[r,d,a,c]=o,l={level:r,message:d,timestamp:a,source:c};console.debug("[WCB] LOG event received:",l);const p=this.eventHandlers.get("log");if(console.debug("[WCB] LOG handler check:",{hasHandler:!!p,handlerCount:this.eventHandlers.size,allHandlers:Array.from(this.eventHandlers.keys())}),p)console.debug("[WCB] Calling LOG handler with:",l),p(l);else{const u=["DBG","INF","WRN","ERR"][r]||"LOG";console.log(`[WCB ${u}] ${d} (no handler registered)`)}}break;default:console.debug("[WCB] Unhandled event:",s)}}async connect(n,i="password"){if(this.state!=="DISCONNECTED")throw new Error("Already connected or connecting");return this.password=i,new Promise((s,o)=>{try{const r=Date.now(),d=()=>`+${Date.now()-r}ms`;console.log("[WCB] Connecting to:",n),this.websocket=new WebSocket(n,["webrepl.binary.v1"]),this.websocket.binaryType="arraybuffer",this.state="CONNECTING";const a=setTimeout(()=>{console.error(`[WCB] ${d()} Connect timeout (10s) — state=${this.state} auth=${this.authenticated} ready=${this.isReady}`),o(new Error("Connection timeout")),this.disconnect()},1e4);this.websocket.addEventListener("open",async()=>{console.log(`[WCB] ${d()} WebSocket opened, protocol=${this.websocket.protocol||"none"}`),this.state="CONNECTED";try{console.log(`[WCB] ${d()} Starting authentication...`),await this._authenticate(),clearTimeout(a),this.isReady=!0,console.log(`[WCB] ${d()} Authenticated successfully`),s()}catch(c){console.error(`[WCB] ${d()} Auth failed: ${c.message}`),clearTimeout(a),o(new Error("Authentication failed: "+c.message)),this.disconnect()}}),this.websocket.addEventListener("message",c=>{this._handleMessage(c)}),this.websocket.addEventListener("close",c=>{console.log("[WCB] Connection closed",{code:c.code,reason:c.reason||"No reason provided"}),this.state="DISCONNECTED",this.isReady=!1,this.authenticated=!1,this.currentTransfer&&(console.warn("[WCB] Transfer interrupted by disconnect:",this.currentTransfer.path),this.currentTransfer.reject&&this.currentTransfer.reject(new Error("Transfer interrupted: Connection closed")),this.currentTransfer=null),this._notifyConnectionClosed()}),this.websocket.addEventListener("error",c=>{console.error("[WCB] WebSocket error:",c),o(c)})}catch(r){this.state="DISCONNECTED",o(r)}})}async _authenticate(){return new Promise((n,i)=>{const s=Date.now();console.log(`[WCB] Auth: sending credentials (${this.password?this.password.length+" chars":"empty"})`);const o=setTimeout(()=>{console.error(`[WCB] Auth: timeout after ${Date.now()-s}ms — no AUTH_OK/AUTH_FAIL received`),this._authResolve=null,this._authReject=null,i(new Error("Auth timeout"))},1e4);this._authResolve=()=>{console.log(`[WCB] Auth: AUTH_OK received after ${Date.now()-s}ms`),clearTimeout(o),n()},this._authReject=r=>{console.warn(`[WCB] Auth: AUTH_FAIL received after ${Date.now()-s}ms: ${r.message}`),clearTimeout(o),i(r)},this._sendEvent(this.EVT_AUTH,this.password),console.log("[WCB] Auth: credentials sent, waiting for response...")})}async disconnect(){this.websocket&&(this.websocket.close(),this.websocket=null),this.state="DISCONNECTED",this.isReady=!1,this.authenticated=!1,this.pendingRequests.clear(),this.pendingRun=null,this.currentTransfer&&(console.warn("[WCB] Clearing transfer state on disconnect:",this.currentTransfer.path),this.currentTransfer.reject&&this.currentTransfer.reject(new Error("Transfer cancelled: Disconnected")),this.currentTransfer=null),this.pendingFileOps&&this.pendingFileOps.clear()}async exec(n){if(this.state!=="CONNECTED")throw new Error("Not connected");return new Promise((i,s)=>{const o=this._generateId(),r=setTimeout(()=>{this.pendingRequests.has(o)&&(this.pendingRequests.delete(o),s(new Error("M2M timeout")))},3e4);this.pendingRequests.set(o,{resolve:i,reject:s,timeoutId:r,buffer:""}),console.debug("[WCB] Sending M2M EXE with ID:",o,"code:",n.substring(0,50)),this._sendChannel(this.CH_M2M,this.OP_EXE,n+`
`,{format:this.FMT_PY,id:o})})}async execBytecode(n){if(this.state!=="CONNECTED")throw new Error("Not connected");return new Promise((i,s)=>{const o=this._generateId(),r=setTimeout(()=>{this.pendingRequests.has(o)&&(this.pendingRequests.delete(o),s(new Error("M2M timeout")))},3e4);this.pendingRequests.set(o,{resolve:i,reject:s,timeoutId:r,buffer:""}),this._sendChannel(this.CH_M2M,this.OP_EXE,n,{format:this.FMT_MPY,id:o})})}async sendInput(n){if(this.state!=="CONNECTED")throw new Error("Not connected");this._pendingInputEcho=n+`\r
`,this._sendChannel(this.CH_TRM,this.OP_EXE,n+"\r")}async run(n){if(this.state!=="CONNECTED")throw new Error("Not connected");return this.isReady||await this.interrupt(),console.debug("[WCB] Executing:",n.substring(0,50)+(n.length>50?"...":"")),this.isReady=!1,new Promise((i,s)=>{this.pendingRun={resolve:i,reject:s},this._sendChannel(this.CH_TRM,this.OP_EXE,n+`
`)})}async requestCompletion(n){if(this.state!=="CONNECTED")throw new Error("Not connected");return new Promise((i,s)=>{const o=setTimeout(()=>{this.offCompletion(r),s(new Error("Completion timeout"))},5e3),r=(d,a)=>{d===this.CH_TRM&&(clearTimeout(o),this.offCompletion(r),i(a||[]))};this.onCompletion(r),console.debug("[WCB] Requesting completion for:",n),this._sendChannel(this.CH_TRM,this.OP_EXE,n+"	")})}async interrupt(){if(this.pendingRun!==null)console.log("[WCB] Interrupting active script execution"),this._sendChannel(this.CH_TRM,this.OP_INT);else{console.log("[WCB] No script running - stopping background tasks via M2M");try{const i=await this.exec("from lib.sys import bg_tasks; bg_tasks.stop_user_tasks()");console.log("[WCB] Stopped tasks:",i),this.isReady=!0}catch(i){console.warn("[WCB] Failed to send stop request:",i)}}return new Promise(i=>{const s=setInterval(()=>{this.isReady&&(clearInterval(s),i())},50);setTimeout(()=>{clearInterval(s),this.isReady=!0,i()},2e3)})}async reset(n=!1){if(this.state!=="CONNECTED")throw new Error("Not connected");console.log("[WCB] Sending",n?"hard":"soft","reset"),this._sendChannel(this.CH_TRM,this.OP_RST,n?1:0),this.isReady=!1}async saveFile(n,i,s={}){if(this.currentTransfer)throw new Error("Transfer already in progress");const o=typeof i=="string"?new TextEncoder().encode(i):i,r=o.length;return new Promise(async(d,a)=>{this.currentTransfer={type:"UPLOAD",path:n,data:o,totalSize:r,blockNum:0,blksize:8192,startTime:Date.now(),resolveBlock:null,resolve:d,reject:a,chunks:null},this._sendFileMsg(this.FILE_WRQ,n,r,this.DEFAULT_BLKSIZE,5e3,0);try{await new Promise(m=>{this.currentTransfer.resolveBlock=m});let c=0,l=1;const p=s.progressCallback;for(p&&p(0);c<r;){const m=o.slice(c,c+this.DEFAULT_BLKSIZE);if(this.currentTransfer.blockNum=l,this._sendFileMsg(this.FILE_DATA,l,m),await new Promise(v=>{this.currentTransfer.resolveBlock=v}),c+=m.length,l++,p&&r>0){const v=Math.floor(c/r*100);p(Math.min(v,99))}}p&&p(100),r===0&&(this._sendFileMsg(this.FILE_DATA,1,new Uint8Array(0)),this.currentTransfer.blockNum=1,await new Promise(m=>{this.currentTransfer.resolveBlock=m}));const u=(Date.now()-this.currentTransfer.startTime)/1e3,f=(r/u/1024).toFixed(2),h=(r*8/u/1e6).toFixed(2);console.log(`[WCB] Upload complete: ${n} (${r} bytes in ${u.toFixed(2)}s = ${f} KB/s / ${h} Mbps)`),this.currentTransfer=null,d()}catch(c){this.currentTransfer=null,a(c)}})}async loadFile(n,i={}){if(this.currentTransfer&&this.state==="DISCONNECTED"&&(console.warn("[WCB] Clearing stale transfer state before loadFile"),this.currentTransfer=null),this.currentTransfer)throw new Error("Transfer already in progress");return new Promise((s,o)=>{this.currentTransfer={type:"DOWNLOAD",path:n,totalSize:0,receivedSize:0,blockNum:-1,chunks:[],blksize:16384,startTime:Date.now(),progressCallback:i.progressCallback,resolve:s,reject:o},this._sendFileMsg(this.FILE_RRQ,n,16384,5e3)})}subscribe(n,i){this.eventHandlers.set(n,i)}unsubscribe(n){this.eventHandlers.delete(n)}onData(n){this.dataCallbacks=[n]}onConnectionClosed(n){this.connectionClosedCallbacks.push(n)}onCompletion(n){this.completionCallbacks.push(n)}offCompletion(n){const i=this.completionCallbacks.indexOf(n);i>=0&&this.completionCallbacks.splice(i,1)}_notifyData(n,i=!1){if(this._pendingInputEcho&&n.includes(this._pendingInputEcho)){if(n=n.replace(this._pendingInputEcho,""),this._pendingInputEcho=null,n==="")return}else if(this._pendingInputEcho&&this._pendingInputEcho.startsWith(n)){this._pendingInputEcho=this._pendingInputEcho.slice(n.length);return}this.dataCallbacks.forEach(s=>s(n,i))}_notifyConnectionClosed(){this.connectionClosedCallbacks.forEach(n=>n())}isCommandRunning(){return this.pendingRun!==null||!this.isReady}isFileOperationActive(){return this.currentTransfer!==null||this.pendingFileOps.size>0}parseDebugState(n){const i="\x1B[?1049hD",s="D\x1B[?1049l";if(n.includes(i)&&n.includes(s)){const o=n.indexOf(i)+i.length,r=n.indexOf(s),d=n.substring(o,r);try{return JSON.parse(d)}catch(a){return console.error("[WCB] Failed to parse debug state:",a),null}}return null}async sendDebugCommand(n){const i=`_debug_cmd = '${n}'; import __main__; setattr(__main__, '_debug_cmd', '${n}'); import builtins; setattr(builtins, '_debug_cmd', '${n}')`;return console.log("[WCB] Sending debug command via M2M:",n),this.exec(i)}}const CBOR_RTC=CBOR;class WebREPLRTC{constructor(){this.pc=null,this.dataChannel=null,this.state="DISCONNECTED",this.signalingUrl="",this.dataCallbacks=[],this.connectionClosedCallbacks=[],this.eventHandlers=new Map,this.completionCallbacks=[],this.pendingRequests=new Map,this.pendingRun=null,this.pendingFileOps=new Map,this.currentTransfer=null,this.keepaliveTimer=null,this.isReady=!1,this.authenticated=!1,this.CH_FILE=23,this.CH_TRM=1,this.CH_M2M=2,this.CH_DBG=3,this.CH_LOG=4,this.CH_EVENT=0,this.OP_EXE=0,this.OP_INT=1,this.OP_RST=2,this.OP_RES=0,this.OP_CON=1,this.OP_PRO=2,this.OP_COM=3,this.FILE_RRQ=1,this.FILE_WRQ=2,this.FILE_DATA=3,this.FILE_ACK=4,this.FILE_ERROR=5,this.ERR_NOT_FOUND=1,this.ERR_ACCESS=2,this.ERR_DISK_FULL=3,this.EVT_AUTH=0,this.EVT_AUTH_OK=1,this.EVT_AUTH_FAIL=2,this.EVT_INFO=3,this.EVT_LOG=4,this.CH_AUTH=0,this.FMT_PY=0,this.FMT_MPY=1,this.DEFAULT_BLKSIZE=4096}_generateId(){return Math.random().toString(36).substring(2,9)}_sendChannel(n,i,s="",o={}){if(!this.dataChannel||this.dataChannel.readyState!=="open"){console.warn("[RTC] Cannot send: DataChannel not open",{hasDataChannel:!!this.dataChannel,readyState:this.dataChannel?.readyState,state:this.state});return}const r=[n,i,s];o.id!==void 0?(r.push(o.format!==void 0?o.format:null),r.push(o.id)):o.format!==void 0&&r.push(o.format);const d=CBOR_RTC.encode(r);try{this.dataChannel.send(d)}catch(a){throw console.error("[RTC] DataChannel send failed:",a,{readyState:this.dataChannel.readyState,bufferedAmount:this.dataChannel.bufferedAmount}),a}}_sendEvent(n,...i){if(!this.dataChannel||this.dataChannel.readyState!=="open"){console.warn("[RTC] Cannot send event: DataChannel not open");return}const s=[this.CH_AUTH,n,...i],o=CBOR_RTC.encode(s);this.dataChannel.send(o)}_sendFileMsg(n,...i){if(!this.dataChannel||this.dataChannel.readyState!=="open")return;const s=[this.CH_FILE,n,...i],o=CBOR_RTC.encode(s);this.dataChannel.send(o)}_handleMessage(n){const i=Date.now(),s=n.data;if(console.debug("[RTC] Received message:",{type:typeof s,size:s?.byteLength||0,timestamp:i}),!(s instanceof ArrayBuffer)){console.warn("[RTC] Unexpected non-binary data");return}try{const o=CBOR_RTC.decode(s);if(console.debug("[RTC] Decoded message:",o),!Array.isArray(o)||o.length<2){console.warn("[RTC] Invalid message format");return}const r=o[0];r===this.CH_FILE?this._handleFile(o):r===this.CH_EVENT?this._handleEvent(o):r>=this.CH_TRM&&r<=22?this._handleChannel(o):console.warn("[RTC] Unknown channel:",r)}catch(o){console.error("[RTC] Failed to decode CBOR:",o);const r=new Uint8Array(s),d=Array.from(r.slice(0,32)).map(a=>a.toString(16).padStart(2,"0")).join(" ");console.error("[RTC] Raw data (first 32 bytes):",d),console.error("[RTC] As ASCII:",String.fromCharCode(...r.slice(0,32)))}}_handleChannel(n){if(n.length<3)return;const[i,s,...o]=n;switch(console.debug("[RTC] Handling channel message:",{channel:i,opcode:s,restLength:o.length}),s){case this.OP_RES:this._handleRES(i,o[0],o[1]);break;case this.OP_CON:this._handleCON(i);break;case this.OP_PRO:this._handlePRO(i,o[0],o[1],o[2]);break;case this.OP_COM:this._handleCOM(i,o[0]);break;default:console.warn("[RTC] Unknown channel opcode:",s)}}_handleRES(n,i,s){if(console.debug("[RTC] Handling RES:",{channel:n,dataType:typeof i,dataLength:i?.length||0,id:s}),s&&this.pendingRequests.has(s)){const o=this.pendingRequests.get(s);o.buffer=(o.buffer||"")+i,console.debug("[RTC] Buffered data for ID:",s,"Total:",o.buffer.length);return}n===this.CH_M2M&&!s&&(console.warn("[RTC] M2M RES message missing ID (device bug). Expected one of:",Array.from(this.pendingRequests.keys())),console.warn("[RTC] RES data:",i?.substring?i.substring(0,200):i)),n===this.CH_TRM?(console.debug("[RTC] Notifying terminal data:",i),this._notifyData(i,!1)):n===this.CH_DBG?(console.debug("[RTC] Notifying debug data:",i),this._notifyData(i,!1)):n===this.CH_LOG&&console.log("[RTC LOG]",i)}_handleCON(n){}_handleCOM(n,i){this.completionCallbacks.forEach(s=>{try{s(n,i)}catch(o){console.error(o)}})}_handlePRO(n,i,s=null,o=null){if(console.log("[RTC] PRO received:",{channel:n,status:i,error:s,id:o,pendingRun:!!this.pendingRun}),o&&this.pendingRequests.has(o)){const r=this.pendingRequests.get(o),{resolve:d,reject:a,timeoutId:c,buffer:l}=r;if(console.debug("[RTC] Completing request:",o,"Buffer:",l),clearTimeout(c),this.pendingRequests.delete(o),i!==0)a(new Error(s||"Request failed"));else if(n===this.CH_M2M){console.debug("[RTC] M2M PRO success with ID:",o,"buffer length:",l?l.length:0);try{let p=null;if(l)try{p=JSON.parse(l)}catch(u){const f=l.indexOf("{");if(f!==-1){let h=0,m=-1;for(let v=f;v<l.length;v++)if(l[v]==="{"&&h++,l[v]==="}"&&h--,h===0){m=v+1;break}if(m!==-1){const v=l.substring(f,m);p=JSON.parse(v)}else throw u}else throw u}console.debug("[RTC] M2M result parsed:",p),d(p)}catch(p){console.warn("[RTC] Failed to parse JSON buffer:",p,"buffer:",l?l.substring(0,200):"null"),d(l||null)}}else d(l||null);return}if(console.log("[RTC] PRO for TRM, pendingRun:",!!this.pendingRun,"id:",o),i!==0){const r=s||"Unknown error";if(console.error("[RTC] Error:",r),this.pendingRun){const{reject:d}=this.pendingRun;this.pendingRun=null,d(new Error(r))}}else if(this.isReady=!0,this.pendingRun){console.log("[RTC] Resolving pendingRun, setting isReady=true");const{resolve:r}=this.pendingRun;this.pendingRun=null,r()}}_handleFile(n){if(n.length<2)return;const i=n[1],s=n.slice(2);if(!this.currentTransfer){console.warn("[RTC] File message with no active transfer");return}switch(i){case this.FILE_ACK:this._handleFileAck(s);break;case this.FILE_DATA:this._handleFileData(s);break;case this.FILE_ERROR:this._handleFileError(s);break}}_handleFileAck(n){if(!this.currentTransfer)return;const i=n[0];this.currentTransfer.type==="UPLOAD"?i===this.currentTransfer.blockNum&&this.currentTransfer.resolveBlock():this.currentTransfer.type==="DOWNLOAD"&&i===0&&this.currentTransfer.blockNum===-1&&(n.length>1&&(this.currentTransfer.totalSize=n[1]),this._sendFileMsg(this.FILE_ACK,0),this.currentTransfer.blockNum=0)}_handleFileData(n){if(!this.currentTransfer||this.currentTransfer.type!=="DOWNLOAD")return;const i=n[0],s=n[1],o=(this.currentTransfer.blockNum+1)%65536;if(i===o){if(this.currentTransfer.chunks.push(s),this.currentTransfer.receivedSize+=s.byteLength,this.currentTransfer.totalSize&&this.currentTransfer.progressCallback){const r=Math.floor(this.currentTransfer.receivedSize*100/this.currentTransfer.totalSize);this.currentTransfer.progressCallback(Math.min(r,99))}if(this._sendFileMsg(this.FILE_ACK,i),this.currentTransfer.blockNum=i,s.byteLength<this.currentTransfer.blksize){this.currentTransfer.progressCallback&&this.currentTransfer.progressCallback(100);const r=new Blob(this.currentTransfer.chunks),d=new FileReader;d.onload=()=>{this.currentTransfer.resolve(new Uint8Array(d.result)),this.currentTransfer=null},d.readAsArrayBuffer(r)}}else i===this.currentTransfer.blockNum&&this._sendFileMsg(this.FILE_ACK,i)}_handleFileError(n){if(this.currentTransfer){const i=n[0],s=n[1];this.currentTransfer.reject(new Error(`TFTP Error ${i}: ${s}`)),this.currentTransfer=null}}_handleEvent(n){if(n.length<2)return;const[i,s,...o]=n;switch(s){case this.EVT_INFO:{let r={};try{const a=o[0];if(typeof a!="string"){console.error("[RTC] INFO payload must be a JSON string, got:",typeof a);break}r=JSON.parse(a)}catch(a){console.error("[RTC] Failed to parse INFO payload JSON:",a,o[0]);break}if(r.welcome){this.isReady=!0;const a=this.eventHandlers.get("welcome");a&&a(r.welcome)}if(r.display_ui!==void 0){if(console.log("[RTC] Display UI event:",r.display_ui),this.onDisplayUi)try{this.onDisplayUi(r.display_ui)}catch(c){console.error("[RTC] onDisplayUi callback error:",c)}const a=this.eventHandlers.get("display_ui");if(a)try{a(r.display_ui)}catch(c){console.error("[RTC] display_ui event handler error:",c)}}if(r.pfc_chat!==void 0){const a=this.eventHandlers.get("pfc_chat");if(a)try{a(r.pfc_chat)}catch(c){console.error("[RTC] pfc_chat handler error:",c)}}const d=this.eventHandlers.get("info");d&&d(r)}break;case this.EVT_AUTH_OK:this._authResolve&&(this.authenticated=!0,this._authResolve(),this._authResolve=null,this._authReject=null);break;case this.EVT_AUTH_FAIL:{const r=o[0]||"Authentication failed";console.error("[RTC] Authentication failed:",r),this._authReject&&(this._authReject(new Error(r)),this._authResolve=null,this._authReject=null)}break;case this.EVT_LOG:{const[r,d,a,c]=o,l={level:r,message:d,timestamp:a,source:c},p=this.eventHandlers.get("log");p&&p(l)}break}}async connect(n,i=""){if(this.state!=="DISCONNECTED")throw new Error("Already connected or connecting");this._cleanup(),this.authenticated=!1;let s,o;n=n.trim(),n.startsWith("https://")?(s="https:",n=n.slice(8)):n.startsWith("http://")?(s="http:",n=n.slice(7)):s=window.location.protocol==="https:"?"https:":"http:";const r=n.indexOf("/");r!==-1&&(n=n.slice(0,r)),o=n,this.signalingUrl=`${s}//${o}/webrtc/offer`,this.state="CONNECTING";try{this.pc=new RTCPeerConnection({iceServers:[{urls:"stun:stun.l.google.com:19302"}]}),this.dataChannel=this.pc.createDataChannel("wbp",{ordered:!0,protocol:"webrepl.binary.v1"}),this.dataChannel.binaryType="arraybuffer",this._setupDataChannel();const d=[],a=new Promise(f=>{this.pc.onicecandidate=h=>{h.candidate?d.push(h.candidate.candidate):f()},setTimeout(f,3e3)}),c=await this.pc.createOffer();await this.pc.setLocalDescription(c),await a;let l=this.pc.localDescription.sdp;const p=await fetch(this.signalingUrl,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sdp:l,password:i})});if(!p.ok)throw new Error(`Signaling failed: ${p.status}`);const u=await p.json();if(u.error)throw new Error(u.error);if(await this.pc.setRemoteDescription({type:"answer",sdp:u.sdp}),u.ice_candidates)for(const f of u.ice_candidates)try{await this.pc.addIceCandidate({candidate:f,sdpMid:"0",sdpMLineIndex:0})}catch{}await new Promise((f,h)=>{const m=setTimeout(()=>h(new Error("DataChannel open timeout")),1e4);this.dataChannel.readyState==="open"?(clearTimeout(m),f()):(this.dataChannel.onopen=()=>{clearTimeout(m),f()},this.dataChannel.onerror=v=>{clearTimeout(m),h(new Error("DataChannel error"))})}),await this.authenticate(i),this.state="CONNECTED",this.isReady=!0,console.log("[RTC] Connection established:",{state:this.state,isReady:this.isReady,dataChannelState:this.dataChannel.readyState,peerConnectionState:this.pc.connectionState}),this._startKeepalive()}catch(d){throw console.error("[RTC] Connection failed:",d),this.state="DISCONNECTED",this._cleanup(),d}}async authenticate(n){if(!this.dataChannel||this.dataChannel.readyState!=="open")throw new Error("DataChannel not open");if(!this.authenticated)return new Promise((i,s)=>{const o=setTimeout(()=>{this._authResolve=null,this._authReject=null,s(new Error("Authentication timeout"))},1e4);this._authResolve=()=>{clearTimeout(o),i()},this._authReject=r=>{clearTimeout(o),s(r)},this._sendEvent(this.EVT_AUTH,n)})}_setupDataChannel(){this.dataChannel.onmessage=n=>this._handleMessage(n),this.dataChannel.onclose=()=>{this.state="DISCONNECTED",this.isReady=!1,this._stopKeepalive(),this._notifyConnectionClosed()},this.dataChannel.onerror=n=>{console.error("[RTC] DataChannel error:",n)}}_startKeepalive(){this._stopKeepalive(),this.keepaliveTimer=setInterval(()=>{if(this.dataChannel&&this.dataChannel.readyState==="open")try{const n=CBOR_RTC.encode([0,99]);this.dataChannel.send(n)}catch(n){console.warn("[RTC] Keepalive send failed:",n)}},2e3)}_stopKeepalive(){this.keepaliveTimer&&(clearInterval(this.keepaliveTimer),this.keepaliveTimer=null)}_cleanup(){this._stopKeepalive(),this.dataChannel&&(this.dataChannel.close(),this.dataChannel=null),this.pc&&(this.pc.close(),this.pc=null),this.currentTransfer=null,this.pendingRequests.clear(),this.pendingRun=null}async disconnect(){this._cleanup(),this.state="DISCONNECTED",this.isReady=!1,this.authenticated=!1}async exec(n){if(this.state!=="CONNECTED")throw new Error("Not connected");return new Promise((i,s)=>{const o=this._generateId(),r=setTimeout(()=>{this.pendingRequests.has(o)&&(this.pendingRequests.delete(o),s(new Error("M2M timeout")))},3e4);this.pendingRequests.set(o,{resolve:i,reject:s,timeoutId:r,buffer:""}),this._sendChannel(this.CH_M2M,this.OP_EXE,n+`
`,{format:this.FMT_PY,id:o})})}async run(n){if(this.state!=="CONNECTED")throw new Error("Not connected");const i=performance.now();return this.isReady||(console.log("[RTC] run(): isReady=false, calling interrupt()..."),await this.interrupt(),console.log("[RTC] run(): interrupt() took",(performance.now()-i).toFixed(0),"ms")),this.isReady=!1,console.log("[RTC] run(): sending command, total setup time:",(performance.now()-i).toFixed(0),"ms"),new Promise((s,o)=>{const r=setTimeout(()=>{this.pendingRun&&(console.warn("[RTC] run(): Command timed out after 30 seconds"),this.pendingRun=null,this.isReady=!0,o(new Error("Command timeout")))},3e4);this.pendingRun={resolve:d=>{clearTimeout(r),s(d)},reject:d=>{clearTimeout(r),o(d)}},this._sendChannel(this.CH_TRM,this.OP_EXE,n+`
`)})}async interrupt(){return this._sendChannel(this.CH_TRM,this.OP_INT),new Promise(n=>{const i=setInterval(()=>{this.isReady&&(clearInterval(i),n())},50);setTimeout(()=>{clearInterval(i),this.isReady=!0,n()},2e3)})}async requestCompletion(n){if(this.state!=="CONNECTED")throw new Error("Not connected");return new Promise((i,s)=>{const o=setTimeout(()=>{this.offCompletion(r),s(new Error("Completion timeout"))},5e3),r=(d,a)=>{d===this.CH_TRM&&(clearTimeout(o),this.offCompletion(r),i(a||[]))};this.onCompletion(r),console.debug("[RTC] Requesting completion for:",n),this._sendChannel(this.CH_TRM,this.OP_EXE,n+"	")})}async reset(n=!1){if(this.state!=="CONNECTED")throw new Error("Not connected");this._sendChannel(this.CH_TRM,this.OP_RST,n?1:0),this.isReady=!1}async saveFile(n,i,s={}){if(this.currentTransfer)throw new Error("Transfer already in progress");const o=typeof i=="string"?new TextEncoder().encode(i):i,r=o.length;return new Promise(async(d,a)=>{this.currentTransfer={type:"UPLOAD",path:n,data:o,totalSize:r,blockNum:0,blksize:this.DEFAULT_BLKSIZE,startTime:Date.now(),resolveBlock:null,resolve:d,reject:a},this._sendFileMsg(this.FILE_WRQ,n,r,this.DEFAULT_BLKSIZE,5e3,0);try{await new Promise(u=>{this.currentTransfer.resolveBlock=u});let c=0,l=1;const p=s.progressCallback;for(p&&p(0);c<r;){const u=o.slice(c,c+this.DEFAULT_BLKSIZE);this.currentTransfer.blockNum=l,this._sendFileMsg(this.FILE_DATA,l,u),await new Promise(f=>{this.currentTransfer.resolveBlock=f}),c+=u.length,l++,p&&r>0&&p(Math.min(Math.floor(c/r*100),99))}p&&p(100),r===0&&(this._sendFileMsg(this.FILE_DATA,1,new Uint8Array(0)),this.currentTransfer.blockNum=1,await new Promise(u=>{this.currentTransfer.resolveBlock=u})),this.currentTransfer=null,d()}catch(c){this.currentTransfer=null,a(c)}})}async loadFile(n,i={}){if(this.currentTransfer)throw new Error("Transfer already in progress");return new Promise((s,o)=>{this.currentTransfer={type:"DOWNLOAD",path:n,totalSize:0,receivedSize:0,blockNum:-1,chunks:[],blksize:16384,startTime:Date.now(),progressCallback:i.progressCallback,resolve:s,reject:o},this._sendFileMsg(this.FILE_RRQ,n,16384,5e3)})}subscribe(n,i){this.eventHandlers.set(n,i)}unsubscribe(n){this.eventHandlers.delete(n)}onData(n){this.dataCallbacks=[n]}onConnectionClosed(n){this.connectionClosedCallbacks.push(n)}onCompletion(n){this.completionCallbacks.push(n)}offCompletion(n){const i=this.completionCallbacks.indexOf(n);i>=0&&this.completionCallbacks.splice(i,1)}_notifyData(n,i=!1){console.debug("[RTC] _notifyData called:",{data:n,isError:i,callbackCount:this.dataCallbacks.length}),this.dataCallbacks.forEach(s=>s(n,i))}_notifyConnectionClosed(){this.connectionClosedCallbacks.forEach(n=>n())}isCommandRunning(){return this.pendingRun!==null||!this.isReady}isFileOperationActive(){return this.currentTransfer!==null||this.pendingFileOps.size>0}}class WebREPLBridge{constructor(){this.client=null,this.transportType=null,this.pendingCallbacks={onData:null,onConnectionClosed:[],onCompletion:[],subscriptions:{}}}async connect(n,i="password"){let s;if(n.startsWith("ws://")||n.startsWith("wss://"))s="websocket";else if(n.startsWith("http://")||n.startsWith("https://"))s="webrtc";else throw new Error(`Unknown transport protocol in URL: ${n}
Supported: ws://, wss://, http://, https://`);if(this.client&&this.transportType===s){const o=this.client.state||"DISCONNECTED";if(o==="DISCONNECTED")return console.log("[Bridge] Reusing existing client for reconnect"),this.client.connect(n,i);if(o==="CONNECTING"){console.log("[Bridge] Cleaning up stuck CONNECTING client before reconnect");try{this.client.disconnect()}catch{}return this.client.connect(n,i)}}if(s==="websocket")console.log("[Bridge] Using WebSocket transport"),this.client=new WebREPLWCB,this.transportType="websocket";else{if(console.log("[Bridge] Using WebRTC transport"),typeof WebREPLRTC>"u")throw new Error("WebRTC transport not available");this.client=new WebREPLRTC,this.transportType="webrtc"}this.pendingCallbacks.onData&&this.client.onData(this.pendingCallbacks.onData);for(const o of this.pendingCallbacks.onConnectionClosed)this.client.onConnectionClosed(o);for(const o of this.pendingCallbacks.onCompletion)this.client.onCompletion(o);for(const[o,r]of Object.entries(this.pendingCallbacks.subscriptions))this.client.subscribe(o,r);return this.client.connect(n,i)}async disconnect(){if(this.client){const n=await this.client.disconnect();return this.client=null,this.transportType=null,n}}async exec(n){if(!this.client)throw new Error("Not connected");return this.client.exec(n)}async execBytecode(n){if(!this.client)throw new Error("Not connected");return this.client.execBytecode(n)}async run(n){if(!this.client)throw new Error("Not connected");return this.client.run(n)}async sendInput(n){if(!this.client)throw new Error("Not connected");return this.client.sendInput?this.client.sendInput(n):this.client.run(n)}async requestCompletion(n){if(!this.client)throw new Error("Not connected");return this.client.requestCompletion(n)}async interrupt(){if(!this.client)throw new Error("Not connected");return this.client.interrupt()}async reset(n=!1){if(!this.client)throw new Error("Not connected");return this.client.reset(n)}async sendDebugCommand(n){if(!this.client)throw new Error("Not connected");return this.client.sendDebugCommand(n)}async saveFile(n,i,s={}){if(!this.client)throw new Error("Not connected");return this.client.saveFile(n,i,s)}async loadFile(n,i={}){if(!this.client)throw new Error("Not connected");return this.client.loadFile(n,i)}onData(n){if(!this.client){this.pendingCallbacks.onData=n;return}this.client.onData(n)}onConnectionClosed(n){if(!this.client){this.pendingCallbacks.onConnectionClosed.push(n);return}this.client.onConnectionClosed(n)}subscribe(n,i){if(!this.client){this.pendingCallbacks.subscriptions[n]=i;return}this.client.subscribe(n,i)}unsubscribe(n){this.client&&this.client.unsubscribe(n)}onCompletion(n){if(!this.client){this.pendingCallbacks.onCompletion.push(n);return}this.client.onCompletion(n)}offCompletion(n){this.client&&this.client.offCompletion(n)}isCommandRunning(){return this.client?this.client.isCommandRunning():!1}isFileOperationActive(){return this.client?this.client.isFileOperationActive():!1}get state(){return this.client?.state||"DISCONNECTED"}get isReady(){return this.client?.isReady||!1}get authenticated(){return this.client?.authenticated||!1}set onEthStatus(n){this.client&&(this.client.onEthStatus=n)}get onEthStatus(){return this.client?.onEthStatus}set onWwanStatus(n){this.client&&(this.client.onWwanStatus=n)}get onWwanStatus(){return this.client?.onWwanStatus}set onDisplayUi(n){this.client&&(this.client.onDisplayUi=n)}get onDisplayUi(){return this.client?.onDisplayUi}set onPlotData(n){this.client&&(this.client.onPlotData=n)}get onPlotData(){return this.client?.onPlotData}set onMqttConfig(n){this.client&&(this.client.onMqttConfig=n)}get onMqttConfig(){return this.client?.onMqttConfig}set onMqttConfigSave(n){this.client&&(this.client.onMqttConfigSave=n)}get onMqttConfigSave(){return this.client?.onMqttConfigSave}set onWwanConfig(n){this.client&&(this.client.onWwanConfig=n)}get onWwanConfig(){return this.client?.onWwanConfig}set onWwanConfigSave(n){this.client&&(this.client.onWwanConfigSave=n)}get onWwanConfigSave(){return this.client?.onWwanConfigSave}set onModemStatus(n){this.client&&(this.client.onModemStatus=n)}get onModemStatus(){return this.client?.onModemStatus}set onNtpSync(n){this.client&&(this.client.onNtpSync=n)}get onNtpSync(){return this.client?.onNtpSync}set onNtpConfig(n){this.client&&(this.client.onNtpConfig=n)}get onNtpConfig(){return this.client?.onNtpConfig}set onNtpConfigSave(n){this.client&&(this.client.onNtpConfigSave=n)}get onNtpConfigSave(){return this.client?.onNtpConfigSave}set onCanConfig(n){this.client&&(this.client.onCanConfig=n)}get onCanConfig(){return this.client?.onCanConfig}set onCanConfigSave(n){this.client&&(this.client.onCanConfigSave=n)}get onCanConfigSave(){return this.client?.onCanConfigSave}set onVpnConfig(n){this.client&&(this.client.onVpnConfig=n)}get onVpnConfig(){return this.client?.onVpnConfig}set onVpnConfigSave(n){this.client&&(this.client.onVpnConfigSave=n)}get onVpnConfigSave(){return this.client?.onVpnConfigSave}set onVpnConnect(n){this.client&&(this.client.onVpnConnect=n)}get onVpnConnect(){return this.client?.onVpnConnect}set onVpnDisconnect(n){this.client&&(this.client.onVpnDisconnect=n)}get onVpnDisconnect(){return this.client?.onVpnDisconnect}set onVpnInfo(n){this.client&&(this.client.onVpnInfo=n)}get onVpnInfo(){return this.client?.onVpnInfo}set onSdcardConfig(n){this.client&&(this.client.onSdcardConfig=n)}get onSdcardConfig(){return this.client?.onSdcardConfig}set onSdcardConfigSave(n){this.client&&(this.client.onSdcardConfigSave=n)}get onSdcardConfigSave(){return this.client?.onSdcardConfigSave}set onSdcardInfo(n){this.client&&(this.client.onSdcardInfo=n)}get onSdcardInfo(){return this.client?.onSdcardInfo}set onSdcardMount(n){this.client&&(this.client.onSdcardMount=n)}get onSdcardMount(){return this.client?.onSdcardMount}set onSdcardUnmount(n){this.client&&(this.client.onSdcardUnmount=n)}get onSdcardUnmount(){return this.client?.onSdcardUnmount}set onGpioConfig(n){this.client&&(this.client.onGpioConfig=n)}get onGpioConfig(){return this.client?.onGpioConfig}set onGpioConfigSave(n){this.client&&(this.client.onGpioConfigSave=n)}get onGpioConfigSave(){return this.client?.onGpioConfigSave}set onEthConfig(n){this.client&&(this.client.onEthConfig=n)}get onEthConfig(){return this.client?.onEthConfig}set onEthConfigSave(n){this.client&&(this.client.onEthConfigSave=n)}get onEthConfigSave(){return this.client?.onEthConfigSave}set onEthInit(n){this.client&&(this.client.onEthInit=n)}get onEthInit(){return this.client?.onEthInit}}const BridgeDevice=new WebREPLBridge,scriptRel="modulepreload",assetsURL=function(e){return"/app/"+e},seen={},__vitePreload=function e(n,i,s){let o=Promise.resolve();if(i&&i.length>0){document.getElementsByTagName("link");const d=document.querySelector("meta[property=csp-nonce]"),a=d?.nonce||d?.getAttribute("nonce");o=Promise.allSettled(i.map(c=>{if(c=assetsURL(c),c in seen)return;seen[c]=!0;const l=c.endsWith(".css"),p=l?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${p}`))return;const u=document.createElement("link");if(u.rel=l?"stylesheet":scriptRel,l||(u.as="script"),u.crossOrigin="",u.href=c,a&&u.setAttribute("nonce",a),document.head.appendChild(u),l)return new Promise((f,h)=>{u.addEventListener("load",f),u.addEventListener("error",()=>h(new Error(`Unable to preload CSS for ${c}`)))})}))}function r(d){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=d,window.dispatchEvent(a),!a.defaultPrevented)throw d}return o.then(d=>{for(const a of d||[])a.status==="rejected"&&r(a.reason);return n().catch(r)})};let Parser=null,Language=null,wasmUrl=null,pythonWasmImportUrl=null;const DEBUG_STATE_MODULE=`
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
`;let parserInstance=null,pythonLanguage=null;async function getParser(){if(parserInstance&&pythonLanguage)return parserInstance;try{if(!Parser){console.log("[Debugger] Lazy loading Tree-sitter...");const[e,n,i]=await Promise.all([__vitePreload(()=>import("./tree-sitter-Bi_wodRt.js"),__vite__mapDeps([0,1,2,3])),__vitePreload(()=>import("./tree-sitter-B3V3Ji9r.js"),[]),__vitePreload(()=>import("./tree-sitter-python-DxlSE_Ss.js"),[])]);Parser=e.Parser,Language=e.Language,wasmUrl=n.default,pythonWasmImportUrl=i.default,console.log("[Debugger] Tree-sitter modules loaded")}if(await Parser.init({locateFile:()=>wasmUrl}),parserInstance=new Parser,console.log("[Debugger] Loading Python grammar..."),!pythonWasmImportUrl)throw new Error("tree-sitter-python.wasm URL not found in imports");return pythonLanguage=await Language.load(pythonWasmImportUrl),parserInstance.setLanguage(pythonLanguage),console.log("[Debugger] Tree-sitter parser initialized successfully"),parserInstance}catch(e){throw console.error("[Debugger] Failed to initialize parser:",e),new Error(`Tree-sitter initialization failed: ${e.message}`)}}async function identifyCodeRows(e){const n=await getParser();if(!n)return new Map;const i=n.parse(e),s=new Map,o=["expression_statement","assignment","return_statement","if_statement","for_statement","while_statement","try_statement","with_statement","function_definition","async_function_definition","class_definition","break_statement","continue_statement","pass_statement","match_statement"],r=["else_clause","elif_clause","except_clause","finally_clause","case_clause"],d=a=>{if(!a)return;let c=!1;const l=a.type;r.includes(l)?c=!1:o.includes(l)?(c=!0,(l==="function_definition"||l==="async_function_definition"||l==="class_definition")&&a.parent&&a.parent.type==="decorated_definition"&&(c=!1),l==="expression_statement"&&a.childCount===1&&a.firstChild.type==="string"&&(c=!1)):l==="decorated_definition"&&(c=!0),c&&s.set(a.startPosition.row,l);for(let p=0;p<a.childCount;p++)d(a.child(p))};return d(i.rootNode),s}function generateDebugBlock(e,n,i,s,o,r,d=null){let a="";if(d){const c=d.condition?`(${d.condition})`:"True",l=d.hitCount?`"${d.hitCount}"`:"None",p=d.enabled!==!1?"True":"False";a+=`${e}try:
`,a+=`${e}    _ds.us("${i}", ${s}, ${p} and ${c}, ${l})
`,a+=`${e}except:
`,a+=`${e}    pass
`}else n?a+=`${e}_ds.us("${i}", ${s}, True, None)
`:(r.forEach(c=>{a+=`${e}try:
`,a+=`${e}    if (${c}): _ds.s = "S"
`,a+=`${e}except:
`,a+=`${e}    pass
`}),a+=`${e}if _ds.s == "S":
`,e+="    ");return a+=`${e}_ds.sh("${i}", ${s})
`,a+=`${e}if _ds.s != "CO": _ds.sv(locals())
`,o.forEach(c=>{const l=c.replace(/"/g,'\\"');a+=`${e}try:
`,a+=`${e}    _ds.d["w"]["${l}"] = str(${c})
`,a+=`${e}except Exception as _debug_e:
`,a+=`${e}    _ds.d["w"]["${l}"] = str(_debug_e)
`}),a+=`${e}_ds.st()
`,a}async function instrumentCodeForExec(e,n={}){const{watches:i={},conditionalBP:s={},fileName:o="main.py"}=n,r=performance.now(),d=await identifyCodeRows(e);console.log(`[Debugger] Identified ${d.size} code rows in ${performance.now()-r}ms`);let a=e.split(/\r?\n/);const c=new Map,l=i[""]||[],p=i[o]||[],u=[...new Set([...l,...p])],f=s[""]||[],h=s[o]||[],m=[...new Set([...f,...h])],v=Array.from(d.keys()).sort((E,b)=>E-b);for(const E of v){const b=a[E],k=d.get(E);if(b===void 0)continue;const C=/# ●/.test(b),T=n.breakpoints&&n.breakpoints[o]?n.breakpoints[o][E+1]:null;(C||T)&&console.log(`[Debugger] Breakpoint detected at line ${E+1}: ${b}`);const I=b.match(/^(\s*)/)[1];let $=generateDebugBlock(I,C,o,E+1,u,m,T);k==="function_definition"?$+=`${I}@_ds.wrap
`:k==="async_function_definition"&&($+=`${I}@_ds.awrap
`),C&&console.log(`[Debugger] Generated instrumentation for row ${E+1} (${k})`),c.set(E,$)}let y=[];for(let E=0;E<a.length;E++)c.has(E)&&y.push(c.get(E)),y.push(a[E]);const w=y.join(`
`),S=`${DEBUG_STATE_MODULE}

# Execute isolated code
_ds.exec("""${w.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/'/g,"\\'")}""")
`,x=performance.now()-r;return console.log(`[Debugger] Instrumentation complete in ${x.toFixed(0)}ms`),S}console.log("[Libs] ES modules loaded");function renderIcon(e,n={}){const{className:i="",size:s=24,color:o="currentColor"}=n;return html$1`
    <svg class="icon icon-tabler ${i}" 
         width="${s}" 
         height="${s}" 
         viewBox="0 0 24 24" 
         fill="none" 
         stroke="${o}" 
         stroke-width="2" 
         stroke-linecap="round" 
         stroke-linejoin="round">
      <use href="#tabler-${e}" />
    </svg>
  `}const IconSprite={renderIcon};await __vitePreload(()=>import("./vendor-B7iaGaih.js"),__vite__mapDeps([1,2,3]));console.log("[Views] Vendor loaded, Component available:",!!window.Component);function Button(e){const{first:n=!1,size:i="",square:s=!1,icon:o="link",onClick:r=E=>{},disabled:d=!1,active:a=!1,tooltip:c,label:l,background:p}=e;let u=html``;c&&(u=html`<div class="tooltip">${c}</div>`),u=html``;let f=a?"active":"",h=a?"selected":"",m=p?"inverted":"",v=n?"first":"",y=s?"square":"",w=d?"inactive":"active",S=i==="small"?"":html`<div class="label ${w} ${h}">${l}</div>`;const x=IconSprite.renderIcon(o,{className:""});return html`
     <div class="button ${v}">
       <button disabled=${d} class="${y}${i} ${f} ${m}" onclick=${r}>
         ${x}
       </button>
       ${S}
       ${u}
     </div>
   `}let cm6Loaded=!1,EditorView,EditorState,Compartment,python,json,keymap,highlightActiveLine,lineNumbers,gutter,GutterMarker,search,searchKeymap,highlightSelectionMatches,foldGutter,foldKeymap,indentOnInput,syntaxHighlighting,defaultHighlightStyle,bracketMatching,closeBrackets,closeBracketsKeymap,indentWithTab,defaultKeymap,history,historyKeymap,baseTheme=null,themes=null,BreakpointMarkerClass=null;async function loadCM6(){if(!cm6Loaded)try{const[e,n,i,s,o,r,d,a,c,l]=await Promise.all([__vitePreload(()=>import("./vendor-YJ71nRLj.js").then(y=>y.aj),[]),__vitePreload(()=>import("./vendor-YJ71nRLj.js").then(y=>y.ai),[]),__vitePreload(()=>import("./index-D8uXHUWg.js"),__vite__mapDeps([4,5,2,6])),__vitePreload(()=>import("./index-Ckq7-Rzu.js"),__vite__mapDeps([7,5,2])),__vitePreload(()=>import("./index-BR6z4vJu.js"),__vite__mapDeps([8,2])),__vitePreload(()=>import("./vendor-YJ71nRLj.js").then(y=>y.ak),[]),__vitePreload(()=>import("./index-CEIVfw6W.js"),__vite__mapDeps([6,2])),__vitePreload(()=>import("./index-Bvni1Ih1.js"),__vite__mapDeps([9,2])),__vitePreload(()=>import("./vendor-YJ71nRLj.js").then(y=>y.al),[]),__vitePreload(()=>import("./index-CzizjDTO.js"),__vite__mapDeps([10,2]))]);EditorView=e.EditorView,keymap=e.keymap,highlightActiveLine=e.highlightActiveLine,lineNumbers=e.lineNumbers,gutter=e.gutter,GutterMarker=e.GutterMarker,EditorState=n.EditorState,Compartment=n.Compartment,python=i.python,json=s.json,search=o.search,searchKeymap=o.searchKeymap,highlightSelectionMatches=o.highlightSelectionMatches,foldGutter=r.foldGutter,foldKeymap=r.foldKeymap,indentOnInput=r.indentOnInput,syntaxHighlighting=r.syntaxHighlighting,defaultHighlightStyle=r.defaultHighlightStyle,bracketMatching=r.bracketMatching,closeBrackets=d.closeBrackets,closeBracketsKeymap=d.closeBracketsKeymap,indentWithTab=a.indentWithTab,defaultKeymap=a.defaultKeymap,history=a.history,historyKeymap=a.historyKeymap,BreakpointMarkerClass=class extends GutterMarker{constructor(y=!0){super(),this.enabled=y}toDOM(){const y=document.createElement("span");return y.className="cm-breakpoint"+(this.enabled?"":" cm-breakpoint-disabled"),y.textContent="●",y}},baseTheme=EditorView.theme({"&":{height:"100%",fontSize:"14px"},".cm-scroller":{fontFamily:"var(--font-mono)",overflow:"auto"},".cm-content":{caretColor:"currentColor"},".cm-cursor":{borderLeftColor:"currentColor"},".cm-gutters":{backgroundColor:"transparent !important",borderRight:"none"},".cm-gutter.cm-lineNumbers":{backgroundColor:"transparent !important"},"&.cm-focused .cm-selectionBackground, ::selection":{backgroundColor:"rgba(100, 100, 100, 0.3)"},".cm-foldGutter .cm-gutterElement":{cursor:"pointer",padding:"0 3px"},".cm-breakpoint-gutter":{width:"20px !important",minWidth:"20px !important"},".cm-breakpoint-gutter .cm-gutterElement":{display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",padding:"0"},".cm-breakpoint":{color:"#e63946",fontSize:"14px",lineHeight:"1",paddingRight:"9px"},".cm-breakpoint-disabled":{opacity:"0.3"},".cm-panels":{fontSize:"14px"},".cm-panels input, .cm-panels button":{fontSize:"14px"}});const{cobalt:p,solarizedLight:u,coolGlow:f,clouds:h}=c,{xcodeDark:m,xcodeLight:v}=l;themes={cobalt:p,"solarized-light":u,"xcode-dark":m,"xcode-light":v,coolglow:f,clouds:h},cm6Loaded=!0,console.debug("[Editor] Lazy loaded CM6 modules")}catch(e){throw console.error("[Editor] Failed to load CM6:",e),e}}class CodeMirrorEditor extends Component{constructor(){super(),this.view=null,this.content="# empty file",this.fileName=null,this.scrollTop=0,this.currentTheme=null,this.themeCompartment=null,this.readOnlyCompartment=null,this.languageCompartment=null}createElement(n){return n&&(this.content=n),html`<div id="code-editor"></div>`}load(n){loadCM6().then(()=>this.createEditor(n)).catch(i=>{console.error("[Editor] Failed to initialize:",i),n.innerHTML='<div style="color:red;padding:10px;">Editor failed to load. Check console for errors.</div>'})}createEditor(n){this.themeCompartment=new Compartment,this.readOnlyCompartment=new Compartment,this.languageCompartment=new Compartment;const i=this.getEditorTheme();if(this.currentTheme=i,this.fileName&&typeof this.fileName=="string"&&this.fileName.toLowerCase().endsWith(".json")){const c=this._tryFormatJson(this.content);c!==null&&(this.content=c)}const s=window.appState?.debugger?.active||window.appState?.debugger?.configOpen||!1,o=this.getLanguageMode(),r=this,d=gutter({class:"cm-breakpoint-gutter",lineMarker:(c,l)=>{const p=c.state.doc.lineAt(l.from).number,u=c.state.doc.line(p).text;if(/# ●/.test(u)){const h=(window.appState?.debugger?.breakpoints?.[r.fileName]||{})[p],m=h?h.enabled!==!1:!0;return new BreakpointMarkerClass(m)}return null},domEventHandlers:{click:(c,l)=>{const p=c.state.doc.lineAt(l.from).number,u=c.state.doc.line(p).text;return/# ●/.test(u)?window.appInstance.emitter.emit("debugger:edit-breakpoint",{file:r.fileName,line:p}):r.toggleBreakpoint(p-1),!0}}}),a=EditorState.create({doc:this.content||"",extensions:[lineNumbers(),history(),foldGutter({openText:"▼",closedText:"▶"}),indentOnInput(),bracketMatching(),closeBrackets(),highlightActiveLine(),highlightSelectionMatches(),syntaxHighlighting(defaultHighlightStyle,{fallback:!0}),search({top:!0}),keymap.of([...defaultKeymap,...historyKeymap,...closeBracketsKeymap,...foldKeymap,...searchKeymap,indentWithTab]),this.languageCompartment.of(o),baseTheme,this.themeCompartment.of(themes[i]||themes.cobalt),this.readOnlyCompartment.of(EditorState.readOnly.of(s)),d,EditorView.updateListener.of(c=>{c.docChanged&&(this.content=c.state.doc.toString(),this.onChange()),c.geometryChanged&&(this.scrollTop=this.view?.scrollDOM.scrollTop||0)})]});this.view=new EditorView({state:a,parent:n}),setTimeout(()=>{this.view&&this.scrollTop>0&&(this.view.scrollDOM.scrollTop=this.scrollTop)},10),this.themeObserver=new MutationObserver(()=>{this.updateTheme()}),this.themeObserver.observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme"]}),this.editorThemeHandler=()=>this.updateTheme(),window.addEventListener("editor-theme-changed",this.editorThemeHandler),this.breakpointsUpdatedHandler=c=>{c.file===this.fileName&&this.syncBreakpointsFromStore()},window.appInstance.emitter.on("debugger:breakpoints-updated",this.breakpointsUpdatedHandler)}getLanguageMode(){return this.fileName&&typeof this.fileName=="string"&&this.fileName.toLowerCase().endsWith(".json")?json():python()}getEditorTheme(){const n=document.documentElement.getAttribute("data-theme")==="dark";switch(localStorage.getItem("editorTheme")||"auto"){case"cobalt":return n?"cobalt":"solarized-light";case"xcode":return n?"xcode-dark":"xcode-light";case"coolglow":return n?"coolglow":"clouds";case"auto":default:return n?"cobalt":"solarized-light"}}updateTheme(){if(!this.view||!themes)return;const n=this.getEditorTheme();n!==this.currentTheme&&(this.currentTheme=n,this.view.dispatch({effects:this.themeCompartment.reconfigure(themes[n]||themes.cobalt)}))}update(n){if(this.view&&window.appState?.debugger){const i=window.appState.debugger.active||window.appState.debugger.configOpen;this.view.state.facet(EditorState.readOnly)!==i&&(this.view.dispatch({effects:this.readOnlyCompartment.reconfigure(EditorState.readOnly.of(i))}),this.view.dom.style.opacity=i?"0.7":"1.0")}return!1}unload(){this.themeObserver&&(this.themeObserver.disconnect(),this.themeObserver=null),this.editorThemeHandler&&(window.removeEventListener("editor-theme-changed",this.editorThemeHandler),this.editorThemeHandler=null),this.breakpointsUpdatedHandler&&(window.appInstance.emitter.removeListener("debugger:breakpoints-updated",this.breakpointsUpdatedHandler),this.breakpointsUpdatedHandler=null),this.view&&(this.scrollTop=this.view.scrollDOM.scrollTop,this.view.destroy(),this.view=null)}updateScrollPosition(n){this.scrollTop=n.target.scrollTop}onChange(){return!1}_tryFormatJson(n){if(typeof n!="string")return null;const i=n.trim();if(!i)return null;const s=i[0];if(s!=="{"&&s!=="[")return null;try{const o=JSON.parse(i);return JSON.stringify(o,null,2)+`
`}catch{return null}}toggleBreakpoint(n){if(!this.view)return;const i=this.view.state.doc.line(n+1),s=i.text,o=/# ●/.test(s);let r;o?r=s.replace(/\s*# ●.*/,""):r=s.trimEnd()+" # ●",this.view.dispatch({changes:{from:i.from,to:i.to,insert:r}})}syncBreakpointsFromStore(){if(!this.view||!this.fileName)return;const n=window.appState?.debugger?.breakpoints?.[this.fileName]||{},i=this.view.state.doc,s=[];for(let o=1;o<=i.lines;o++){const r=i.line(o),d=r.text,a=n[o],c=/# ●/.test(d);if(a&&!c)s.push({from:r.to,to:r.to,insert:" # ●"});else if(!a&&c){const l=d.match(/\s*# ●.*/);if(l){const p=r.from+d.indexOf(l[0]);s.push({from:p,to:r.to,insert:""})}}}s.length>0&&this.view.dispatch({changes:s})}}const editor=Object.freeze(Object.defineProperty({__proto__:null,CodeMirrorEditor},Symbol.toStringTag,{value:"Module"}));function Tab(e){const{text:n="undefined",icon:i="device-desktop",onSelectTab:s=()=>!1,onCloseTab:o=()=>!1,onStartRenaming:r=()=>!1,onFinishRenaming:d=()=>!1,active:a=!1,renaming:c=!1,hasChanges:l=!1}=e;if(a)if(c){let f=function(m){d(m.target.value)},h=function(m){m.key.toLowerCase()==="enter"&&m.target.blur(),m.key.toLowerCase()==="escape"&&(m.target.value=null,m.target.blur())};return html`
        <div class="tab active" tabindex="0">
          ${IconSprite.renderIcon(i,{className:"icon"})}
          <div class="text">
            <input type="text"
              value=${n}
              onblur=${f}
              onkeydown=${h}
              />
          </div>
        </div>
      `}else{let f=function(h){h.stopPropagation(),o(h)};return html`
        <div class="tab active" tabindex="0">
          ${IconSprite.renderIcon(i,{className:"icon"})}
          <div class="text" onclick=${r}>
            ${l?" *":""} ${n}
          </div>
          <div class="options" >
            <button onclick=${f}>
              ${IconSprite.renderIcon("x",{className:"icon"})}
            </button>
          </div>
        </div>
      `}function p(f){f.target.classList.contains("close-tab")||s(f)}function u(f){f.stopPropagation(),o(f)}return html`
    <div
      class="tab"
      tabindex="1"
      onclick=${p}
      >
      ${IconSprite.renderIcon(i,{className:"icon"})}
      <div class="text">
        ${l?"*":""} ${n}
      </div>
      <div class="options close-tab">
        <button class="close-tab" onclick=${u}>
          ${IconSprite.renderIcon("x",{className:"close-tab icon"})}
        </button>
      </div>
    </div>
  `}const TERMINAL_PROMPT="\x1B[38;2;221;221;221m>>> \x1B[0m";function bindTerminalOutput(e){const n=e.cache(XTerm,"terminal");if(!n||!n.term){console.debug("[TerminalHelpers] Terminal not ready yet, will bind on view switch");return}const i=n.term;BridgeDevice.onData((o,r=!1)=>{if(o){const d=o.replace(/\n/g,`\r
`);r?i.write("\x1B[91m"+d+"\x1B[0m\x1B[38;2;51;255;51m"):i.write(d),i.scrollToBottom()}})}function redrawLine(e,n,i,s){const o=s.isCommandRunning&&s.isCommandRunning(),r=o?"":TERMINAL_PROMPT,d=o?0:4;e.write("\r\x1B[K"+r+n);const a=d+i,c=d+n.length;a<c&&e.write("\x1B["+(c-a)+"D")}function setupTerminalInputHandler(e,n,i){e.onData(async s=>{if(s==="\x1B[A"){n.commandHistory.length>0&&(n.historyIndex===-1?(n.savedLine=n.currentLine,n.historyIndex=n.commandHistory.length-1):n.historyIndex>0&&n.historyIndex--,n.currentLine=n.commandHistory[n.historyIndex],n.cursorPos=n.currentLine.length,redrawLine(e,n.currentLine,n.cursorPos,i)),e.scrollToBottom();return}if(s==="\x1B[B"){n.historyIndex!==-1&&(n.historyIndex++,n.historyIndex>=n.commandHistory.length?(n.currentLine=n.savedLine||"",n.historyIndex=-1):n.currentLine=n.commandHistory[n.historyIndex],n.cursorPos=n.currentLine.length,redrawLine(e,n.currentLine,n.cursorPos,i)),e.scrollToBottom();return}if(s==="\x1B[D"){n.cursorPos>0&&(n.cursorPos--,e.write("\x1B[D"));return}if(s==="\x1B[C"){n.cursorPos<n.currentLine.length&&(n.cursorPos++,e.write("\x1B[C"));return}if(s==="\r"||s===`
`){if(e.write(`\r
`),n.currentLine.trim().length>0){(n.commandHistory.length===0||n.commandHistory[n.commandHistory.length-1]!==n.currentLine)&&(n.commandHistory.push(n.currentLine),n.commandHistory.length>100&&n.commandHistory.shift()),n.historyIndex=-1,n.savedLine="";try{if(i.isCommandRunning&&i.isCommandRunning()){console.log("[Terminal] Sending input to running command:",n.currentLine),await i.sendInput(n.currentLine),n.currentLine="",n.cursorPos=0;return}else{const o=n.currentLine;n.currentLine="",n.cursorPos=0;const r=performance.now();console.log("[Terminal] Calling device.run at",r.toFixed(0)),await i.run(o),console.log("[Terminal] device.run returned after",(performance.now()-r).toFixed(0),"ms")}}catch(o){e.write("Error: "+o.message+`\r
`)}}e.write(TERMINAL_PROMPT)}else if(s==="	"){if(n.isConnected&&i&&typeof i.requestCompletion=="function")try{const o=await i.requestCompletion(n.currentLine);if(!o||o.length===0){e.write("\x07");return}const r=l=>l&&l.length>=2&&/^[A-Z][A-Z0-9_]*$/.test(l),d=o.filter(l=>!r(l));if(d.length===0){e.write("\x07");return}let a="",c=[];if(d.length===1)a=d[0];else{const l=n.currentLine;let p=d[0];for(let u=1;u<d.length;u++){let f=0;for(;f<p.length&&f<d[u].length&&p[f]===d[u][f];)f++;p=p.slice(0,f)}p.length>l.length&&(a=p.slice(l.length)),c=d}if(a&&(n.currentLine=n.currentLine.slice(0,n.cursorPos)+a+n.currentLine.slice(n.cursorPos),n.cursorPos+=a.length,redrawLine(e,n.currentLine,n.cursorPos,i)),c.length>0){e.write(`\r
`);const l=80;let p="";for(const u of c){const f=p.length+u.length+(p?4:0);p&&f>l?(e.write(p+`\r
`),p=u):p=p?p+"    "+u:u}p&&e.write(p+`\r
`),e.write(TERMINAL_PROMPT),redrawLine(e,n.currentLine,n.cursorPos,i)}}catch(o){console.error("[Terminal] Completion error:",o),e.write("\x07")}else e.write("\x07");e.scrollToBottom()}else if(s==="")e.write(`^C\r
`),n.currentLine="",n.cursorPos=0,n.historyIndex=-1,e.write(TERMINAL_PROMPT);else if(s===""||s==="\b")n.cursorPos>0&&(i.isCommandRunning&&i.isCommandRunning()?(n.currentLine=n.currentLine.slice(0,-1),n.cursorPos--,e.write("\b \b")):(n.currentLine=n.currentLine.slice(0,n.cursorPos-1)+n.currentLine.slice(n.cursorPos),n.cursorPos--,redrawLine(e,n.currentLine,n.cursorPos,i)));else if(s.length>=1){const o=s.split("").filter(r=>{const d=r.charCodeAt(0);return d>=32&&d<127}).join("");o.length>0&&(i.isCommandRunning&&i.isCommandRunning()?(n.currentLine+=o,n.cursorPos+=o.length,e.write(o)):(n.currentLine=n.currentLine.slice(0,n.cursorPos)+o+n.currentLine.slice(n.cursorPos),n.cursorPos+=o.length,redrawLine(e,n.currentLine,n.cursorPos,i)))}e.scrollToBottom()})}let TerminalClass=null,FitAddonClass=null,xtermLoaded=!1;async function loadXterm(){if(xtermLoaded)return{Terminal:TerminalClass,FitAddon:FitAddonClass};try{const[e,n]=await Promise.all([__vitePreload(()=>import("./xterm-CASmyfyk.js"),[]),__vitePreload(()=>import("./addon-fit-DOCEibfw.js"),[]),__vitePreload(()=>Promise.resolve({}),__vite__mapDeps([11]))]);return TerminalClass=e.Terminal,FitAddonClass=n.FitAddon,xtermLoaded=!0,console.debug("[XTerm] Lazy loaded xterm modules"),{Terminal:TerminalClass,FitAddon:FitAddonClass}}catch(e){throw console.error("[XTerm] Failed to load xterm:",e),e}}loadXterm();class XTerm extends Component$1{constructor(n,i,s){super(n),this.term=null,this.fitAddon=null,this.resizeObserver=null,this.inputBound=!1,this._emit=s}load(n){if(this.term){console.debug("[XTerm] Reusing existing terminal instance (no re-open needed)");const i=this.term.element?.parentElement;i&&n.appendChild(i),this.resizeObserver&&this.resizeObserver.disconnect(),this.resizeObserver=new ResizeObserver(()=>{setTimeout(()=>this.fitTerminal(),50)}),this.resizeObserver.observe(n),setTimeout(()=>this.fitTerminal(),50),setTimeout(()=>this.fitTerminal(),150);return}loadXterm().then(()=>this.ensureFontsLoaded()).then(()=>this.createAndOpenTerminal(n)).catch(i=>{console.error("[XTerm] Failed to initialize terminal:",i),n.innerHTML='<div style="color:red;padding:10px;">Terminal failed to load. Check console for errors.</div>'})}async ensureFontsLoaded(){if(document.fonts&&document.fonts.ready)try{return await document.fonts.ready,document.fonts.check&&await new Promise(n=>setTimeout(n,50)),Promise.resolve()}catch{return new Promise(i=>setTimeout(i,200))}else return new Promise(n=>setTimeout(n,200))}createAndOpenTerminal(n){this.term=new TerminalClass({fontFamily:"monospace",fontSize:12,letterSpacing:0,cursorBlink:!0,cursorStyle:"block",scrollback:1e3,theme:{foreground:"#33ff33",background:"#000000",cursor:"#FFFFFF",cursorAccent:"#000000"}}),this.term.open(n),this.fitAddon=new FitAddonClass,this.term.loadAddon(this.fitAddon),setTimeout(()=>this.fitTerminal(),50),setTimeout(()=>this.fitTerminal(),150),setTimeout(()=>this.fitTerminal(),300),setTimeout(()=>this.fitTerminal(),600);let i=null;const s=()=>{i&&clearTimeout(i),i=setTimeout(()=>this.fitTerminal(),100)};this.resizeObserver=new ResizeObserver(s),this.resizeObserver.observe(n);const o=n.closest(".repl-panel-main");o&&this.resizeObserver.observe(o)}createElement(){return html$1`<div class="terminal-wrapper"></div>`}update(){return this.fitAddon&&setTimeout(()=>this.fitTerminal(),50),!1}unload(){this.resizeObserver&&(this.resizeObserver.disconnect(),this.resizeObserver=null)}fitTerminal(){if(!(!this.term||!this.fitAddon))try{this.fitAddon.fit(),this.term.refresh&&this.term.refresh(0,this.term.rows-1)}catch(n){console.warn("[XTerm] Fit failed:",n)}}resizeTerm(){this.fitTerminal()}bindInput(n,i){return this.inputBound||!this.term?!1:(console.debug("[XTerm] Binding input handler"),this.inputBound=!0,this.term.textarea&&this.term.textarea.addEventListener("focus",()=>{this._emit&&this._emit("terminal-focus")}),setupTerminalInputHandler(this.term,n,i),!0)}isInputBound(){return this.inputBound}}function CodeEditor(e,n){if(e.editingFile){const i=e.openFiles.find(s=>s.id==e.editingFile);return i?i.editor.render():(console.error("[CodeEditor] File not found for id:",e.editingFile),html$1`<div id="code-editor">File not found</div>`)}else return html$1`
      <div id="code-editor"></div>
    `}function ConnectionDialog(e,n){const i=e.isConnectionDialogOpen?"open":"closed",s=localStorage.getItem("webrepl-url")||"",o=localStorage.getItem("webrepl-password")||"";let r=!1;function d(u){r=u.target.closest(".dialog-content")!==null}function a(u){u.target.id=="dialog-connection"&&!r&&n("close-connection-dialog"),r=!1}function c(u){if(u.preventDefault(),u.stopPropagation(),e.isConnecting)return;e.connectionError=null;const f=document.getElementById("webrepl-url").value,h=document.getElementById("webrepl-password").value;n("connect-webrepl",{wsUrl:f,password:h})}function l(u){u.stopPropagation(),u.key==="Enter"&&!e.isConnecting&&c(u)}e.isConnectionDialogOpen&&!window._connectionDialogEnterHandler?(window._connectionDialogEmit=n,window._connectionDialogEnterHandler=u=>{const f=document.getElementById("dialog-connection");if(!f||!f.classList.contains("open"))return;const h=f.querySelector(".connect-button");if(!(h&&h.disabled)&&u.key==="Enter"){const m=u.target;if(m.tagName!=="INPUT"&&m.tagName!=="TEXTAREA"){u.preventDefault(),u.stopPropagation();const v=document.getElementById("webrepl-url")?.value,y=document.getElementById("webrepl-password")?.value;v&&y&&window._connectionDialogEmit&&window._connectionDialogEmit("connect-webrepl",{wsUrl:v,password:y})}}},document.addEventListener("keydown",window._connectionDialogEnterHandler)):!e.isConnectionDialogOpen&&window._connectionDialogEnterHandler&&(document.removeEventListener("keydown",window._connectionDialogEnterHandler),window._connectionDialogEnterHandler=null,window._connectionDialogEmit=null);const p=html`
  <div id="dialog-connection" class="dialog ${i}" tabindex="-1" onmousedown=${d} onclick=${a} onkeydown=${u=>{u.key==="Enter"&&!e.isConnecting&&(u.preventDefault(),u.stopPropagation(),c(u))}} oncreate=${()=>{const u=document.getElementById("webrepl-url"),f=document.getElementById("webrepl-password");u&&s&&(u.value=s),f&&o&&(f.value=o)}}>
    
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
            value=${s}
            onclick=${u=>u.stopPropagation()}
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
            value=${o}
            onclick=${u=>u.stopPropagation()}
            onkeydown=${l}
          />
        </div>
        
        ${e.connectionError?html`
          <div class="connection-error">
            <div class="connection-error-message">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 8v4"/>
                <path d="M12 16h.01"/>
              </svg>
              ${e.connectionError.message}
            </div>
            ${e.connectionError.certHint?html`
              <div class="connection-error-hint">
                This may be a certificate trust issue. 
                <a href=${e.connectionError.certUrl} target="_blank" rel="noopener">
                  Open device page
                </a>
                to accept the certificate, then retry.
              </div>
            `:""}
          </div>
        `:""}
        
        <div class="dialog-footer">
          <button class="connect-button" onclick=${c} disabled=${e.isConnecting}>
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
  `;if(e.isConnectionDialogOpen)return p}function getListDirScript(e="/"){return`
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

print(json.dumps({'path': dir_path, 'entries': entries_dict}))`.trim()}function getDeleteFolderScript(e){return`
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
`.trim()}async function getSystemInfo(e){const n=await e.exec("getSysInfo()");return typeof n=="string"?JSON.parse(n):n}async function getNetworksInfo(e){const n=await e.exec("getNetworksInfo()");return typeof n=="string"?JSON.parse(n):n}async function ilistFiles(e,n="/"){const s=(await e.exec(getListDirScript(n))).entries||{};return Object.entries(s).map(([o,r])=>({fileName:o,size:r,type:r===null?"folder":"file"}))}async function statFile(e,n){const i=`import os, json; print(json.dumps(os.stat('${n}')))`,s=await e.exec(i);return typeof s=="string"?JSON.parse(s):s}async function deleteFile(e,n){const i=`import os; os.remove('${n}')`;await e.exec(i)}async function renameFile(e,n,i){const s=`import os; os.rename('${n}', '${i}')`;await e.exec(s)}async function createFolder(e,n){const i=`import os; os.mkdir('${n}')`;await e.exec(i)}async function fileExists(e,n){try{return await statFile(e,n),!0}catch{return!1}}async function deleteFolder(e,n){await e.exec(getDeleteFolderScript(n))}function getFullPath$1(e,n,i){let s=e||"";return n&&n!=="/"&&(s+=n),i&&(s+="/"+i),s.replace(/\/+/g,"/")}function getNavigationPath(e,n){if(n===".."){const i=e.split("/").filter(s=>s);return i.pop(),"/"+i.join("/")}return e==="/"?"/"+n:e+"/"+n}const getDisk=()=>BridgeDisk,getDevice=()=>BridgeDevice,getFullPath=getFullPath$1;async function getDiskFiles(e){let i=await getDisk().ilistFiles(e);return i=i.map(s=>({fileName:s.path,type:s.type,size:s.size})),i=i.sort(sortFilesAlphabetically),i}async function getBoardFiles(e){let n=await ilistFiles(BridgeDevice,e);return n=n.sort(sortFilesAlphabetically),n}function sortFilesAlphabetically(e,n){return e.fileName.localeCompare(n.fileName)}async function checkDiskFile({root:e,parentFolder:n,fileName:i}){if(e==null||n==null||i==null)return!1;const s=getDisk(),o=s.getFullPath(e,n,i),r=await s.fileExists(o),d=await s.folderExists(o);return r||d}async function checkBoardFile({root:e,parentFolder:n,fileName:i}){return e==null||n==null||i==null?!1:fileExists(BridgeDevice,getFullPath(e,n,i))}async function checkOverwrite({fileNames:e=[],parentPath:n,source:i}){let s=[];return i==="board"?s=await getBoardFiles(n):s=await getDiskFiles(n),s.filter(o=>e.indexOf(o.fileName)!==-1)}function generateFileName(e){{const n=`New${window.appState.fileCounter}.py`;return window.appState.fileCounter++,n}}function generateHash(){return`${Date.now()}_${parseInt(Math.random()*1024)}`}async function uploadFolder(e,n,i){i=i||function(){};const s=getDevice(),o=getDisk();await s.createFolder(n);let r=await o.ilistAllFiles(e);for(let d in r){const a=r[d],c=a.path.substring(e.length);if(a.type==="folder")await s.createFolder(getFullPath(n,c,""));else{const l=o.getFullPath(e,c,""),p=getFullPath(n,c,""),u=await BridgeDisk.loadFile(l),f=new Uint8Array(u);await s.saveFile(p,f,{progressCallback:h=>{i(h,c)}})}i(100,c)}}async function downloadFolder(e,n,i){i=i||function(){},await getDisk().createFolder(n);try{const o=[];async function r(d){const a=await ilistFiles(BridgeDevice,d);for(const c of a){const l=d==="/"?`/${c.fileName}`:`${d}/${c.fileName}`;c.type==="folder"?(o.push({path:l,type:"folder"}),await r(l)):o.push({path:l,type:"file"})}}await r(e);for(let d in o){const a=o[d],c=a.path.substring(e.length),l=getDisk(),p=getDevice();if(a.type=="folder")await l.createFolder(l.getFullPath(n,c,""));else{const u=getFullPath(e,c,""),f=getFullPath(n,c,""),h=await p.loadFile(u,{progressCallback:m=>{i(m,c)}});await BridgeDisk.saveFileContent(f,h.buffer)}i(100,c)}}catch(o){throw console.error(`[Store] Error downloading folder ${e}:`,o),new Error(`Failed to download folder: ${o.message}`)}}async function removeBoardFolder(e){try{await deleteFolder(BridgeDevice,e)}catch(n){throw console.error(`[Store] Error removing folder ${e}:`,n),new Error(`Failed to remove folder: ${n.message}`)}}function canSave({isConnected:e,openFiles:n,editingFile:i}){const s=n.find(o=>o.id===i);return!s||!s.hasChanges?!1:s.source==="disk"?!0:e}function canExecute({isConnected:e}){return e}function canDownload({isConnected:e,selectedFiles:n}){const i=n.filter(s=>s.source==="disk");return e&&n.length>0&&i.length===0}function canUpload({isConnected:e,selectedFiles:n}){const i=n.filter(s=>s.source==="board");return e&&n.length>0&&i.length===0}function canEdit({selectedFiles:e}){return e.filter(i=>i.type=="file").length!=0}function NewFileDialog(e,n){const i=e.isNewFileDialogOpen?"open":"closed";function s(f){f.target.id=="dialog-new-file"&&n("close-new-file-dialog")}function o(f){return()=>{const h=document.querySelector("#file-name"),m=h.value.trim()||h.placeholder;n("create-new-tab",f,m)}}let r="";e.isConnected&&(r=html`
      <button class="button item" onclick=${o("board")}>Board</button>
    `),new MutationObserver((f,h)=>{const m=document.querySelector("#dialog-new-file input");m&&(m.focus(),h.disconnect())}).observe(document.body,{childList:!0,subtree:!0});let a="",c="";c=generateFileName();const l={type:"text",id:"file-name",value:a,placeholder:c},p=generateFileName();e.newFileName===null&&`${p}`;const u=html`
  <div id="dialog-new-file" class="dialog ${i}" onclick=${s}>
    <div class="dialog-content">
      <h2 class="dialog-title">Create new file</h2>
      <input class="dialog-input" ${l} />
      <div class="buttons-horizontal">
        ${r}
        <button class="button item" onclick=${o("disk")}>Computer</button>
      </div>
    </div>
  </div>
`;if(e.isNewFileDialogOpen){const f=u.querySelector("#dialog-new-file .dialog-content > input");return f&&f.focus(),u}}function ScriptOsModal(e,n){return e.isScriptOsModalOpen?html`
    <div class="scriptos-modal-overlay" onclick=${i=>{i.target.classList.contains("scriptos-modal-overlay")&&n("close-scriptos-modal")}}>
      <div class="scriptos-modal">
        <button 
          class="scriptos-modal-close" 
          onclick=${()=>n("close-scriptos-modal")}
          title="Close">
          ×
        </button>
        ${e.scriptOsModalView==="library"?ScriptOsLibraryView(e,n):ScriptOsConfigView(e,n)}
      </div>
    </div>
  `:html`<div></div>`}function ScriptOsLibraryView(e,n){if(e.scriptOsCategoryCollapse||(e.scriptOsCategoryCollapse={}),e.isLoadingRegistry)return html`
      <div class="scriptos-library">
        <div class="scriptos-empty">
          <div class="scriptos-loading-spinner"></div>
          <h3>Loading ScriptO Registry...</h3>
          <p>Fetching ScriptOs from the cloud registry</p>
        </div>
      </div>
    `;const i=y=>{if(y.slug){const w=[];return y.category&&w.push(y.category),y.skillType&&w.push(y.skillType==="skill"?"📦 Package":"🔧 Tool"),{name:y.displayName||y.slug,description:y.summary||"",tags:w,author:"",version:y.latestVersion?.version||"1.0.0"}}else return y.config&&y.config.info?{name:y.config.info.name||y.filename,description:y.config.info.description||"",tags:y.config.info.category?[y.config.info.category]:[],author:y.config.info.author||"",version:y.config.info.version||[1,0,0]}:{name:y.filename||"Unknown",description:"",tags:[],author:"",version:[1,0,0]}},s=new Set;e.scriptOsList.forEach(y=>{i(y).tags.forEach(S=>s.add(S))});const o=Array.from(s).sort(),r=(e.scriptOsSearchQuery||"").toLowerCase(),d=e.scriptOsFilterTags||[],a=e.scriptOsList.filter(y=>{const w=i(y),S=w.name.toLowerCase(),x=w.description.toLowerCase(),E=w.tags.join(" ").toLowerCase(),b=!r||S.includes(r)||x.includes(r)||E.includes(r),k=d.length===0||d.every(C=>w.tags.includes(C));return b&&k}),c={},l=[];a.forEach(y=>{const w=i(y),S=w.tags.length>0?w.tags[0]:null;S?(c[S]||(c[S]=[]),c[S].push(y)):l.push(y)});const p=Object.keys(c).sort(),u=y=>{e.scriptOsCategoryCollapse[y]=!e.scriptOsCategoryCollapse[y],n("render")},f=()=>{e.scriptOsFiltersCollapsed=!e.scriptOsFiltersCollapsed,n("render")},h=()=>{e.scriptOsViewMode=e.scriptOsViewMode==="cards"?"list":"cards",n("render")},m=e.scriptOsFiltersCollapsed,v=e.scriptOsViewMode||"cards";return html`
    <div class="scriptos-library">
      <div class="scriptos-header-sticky">
        <div class="scriptos-header">
          <h2>ScriptO Registry</h2>
          <p class="scriptos-subtitle">
            ${e.scriptOsList.length} ScriptO${e.scriptOsList.length!==1?"s":""} available from cloud registry
          </p>
        </div>
        
        ${e.scriptOsList.length>0?html`
          <div class="scriptos-toolbar">
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
                oninput=${y=>n("scriptos-search",y.target.value)}
              />
              ${r?html`
                <button 
                  class="scriptos-search-clear"
                  onclick=${()=>n("scriptos-search","")}
                  title="Clear search">
                  ×
                </button>
              `:""}
            </div>
            <div class="scriptos-toolbar-actions">
              ${o.length>1?html`
                <button 
                  class="scriptos-toolbar-btn ${m?"":"active"} ${d.length>0?"has-filters":""}"
                  onclick=${f}
                  title="${m?"Show filters":"Hide filters"}">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                  </svg>
                  ${d.length>0?html`<span class="scriptos-toolbar-badge">${d.length}</span>`:""}
                </button>
              `:""}
              <button 
                class="scriptos-toolbar-btn"
                onclick=${h}
                title="${v==="cards"?"Switch to list view":"Switch to card view"}">
                ${v==="cards"?html`
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
                    <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
                  </svg>
                `:html`
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
                  </svg>
                `}
              </button>
            </div>
          </div>
          
          ${o.length>1&&!m?html`
            <div class="scriptos-tag-filters">
              <div class="scriptos-tag-filters-list">
                ${o.map(y=>{const w=d.includes(y);return html`
                    <button 
                      class="scriptos-tag-filter ${w?"active":""}" 
                      onclick=${()=>n("scriptos-toggle-tag",y)}
                      title="${w?"Remove filter":"Filter by "+y}">
                      ${y}
                      ${w?html`<span class="scriptos-tag-check">✓</span>`:""}
                    </button>
                  `})}
              </div>
              ${d.length>0?html`
                <button 
                  class="scriptos-clear-filters"
                  onclick=${()=>n("scriptos-clear-tags")}
                  title="Clear all filters">
                  Clear filters (${d.length})
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
        `:a.length===0?html`
          <div class="scriptos-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <h3>No ScriptOs Found</h3>
            <p>No ScriptOs match "${r}"</p>
            <button 
              class="scriptos-btn scriptos-btn-primary"
              onclick=${()=>n("scriptos-search","")}>
              Clear Search
            </button>
          </div>
        `:p.length<=1&&l.length===0?html`
          <!-- Single category or flat list: no collapsible headers -->
          ${v==="list"?html`
            <div class="scriptos-list">
              ${a.map(y=>ScriptOsListRow(y,n))}
            </div>
          `:html`
            <div class="scriptos-grid">
              ${a.map(y=>ScriptOsCard(y,n,o.length<=1))}
            </div>
          `}
        `:html`
          <div class="scriptos-categories">
            ${p.map(y=>{const w=e.scriptOsCategoryCollapse[y]===!0;return html`
                <div class="scriptos-category ${w?"collapsed":""}">
                  <h3 class="scriptos-category-title" onclick=${()=>u(y)}>
                    <svg class="scriptos-category-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                    <span>${y}</span>
                    <span class="scriptos-category-count">${c[y].length}</span>
                  </h3>
                  ${w?"":v==="list"?html`
                    <div class="scriptos-list">
                      ${c[y].map(S=>ScriptOsListRow(S,n))}
                    </div>
                  `:html`
                    <div class="scriptos-grid">
                      ${c[y].map(S=>ScriptOsCard(S,n,!1))}
                    </div>
                  `}
                </div>
              `})}
            ${l.length>0?html`
              <div class="scriptos-category ${e.scriptOsCategoryCollapse.Other?"collapsed":""}">
                <h3 class="scriptos-category-title" onclick=${()=>u("Other")}>
                  <svg class="scriptos-category-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                  <span>Other</span>
                  <span class="scriptos-category-count">${l.length}</span>
                </h3>
                ${e.scriptOsCategoryCollapse.Other?"":v==="list"?html`
                  <div class="scriptos-list">
                    ${l.map(y=>ScriptOsListRow(y,n))}
                  </div>
                `:html`
                  <div class="scriptos-grid">
                    ${l.map(y=>ScriptOsCard(y,n,!1))}
                  </div>
                `}
              </div>
            `:""}
          </div>
        `}
      </div>
    </div>
  `}function ScriptOsCard(e,n,i=!1){let s,o,r,d,a;if(e.slug)s=e.displayName||e.slug,o=e.summary||"",d=e.tags?Object.keys(e.tags):[],r=e.latestVersion?.version?`v${e.latestVersion.version}`:"v1.0.0",a="";else if(e.config&&e.config.info){const c=e.config.info;s=c.name||e.filename,o=c.description||"",d=c.category?[c.category]:[],a=c.author||"",c.version?r=Array.isArray(c.version)?`v${c.version.join(".")}`:`v${c.version}`:r="v1.0.0"}else s=e.filename||"Unknown",o="",d=[],r="v1.0.0",a="";return html`
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
        <h3>${s}</h3>
        <span class="scriptos-card-version">${r}</span>
      </div>
      
      <p class="scriptos-card-description">
        ${o||"No description available"}
      </p>
      
      ${d.length>0&&!i?html`
        <div class="scriptos-card-tags">
          ${d.slice(0,3).map(c=>html`<span class="scriptos-tag-badge">${c}</span>`)}
          ${d.length>3?html`<span class="scriptos-tag-badge">+${d.length-3}</span>`:""}
        </div>
      `:""}
      
      <div class="scriptos-card-footer">
        ${a?html`
          <span class="scriptos-card-author">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            ${a}
          </span>
        `:""}
      </div>
    </div>
  `}function ScriptOsListRow(e,n){let i,s,o;if(e.slug)i=e.displayName||e.slug,s=e.summary||"",o=e.latestVersion?.version?`v${e.latestVersion.version}`:"v1.0.0";else if(e.config&&e.config.info){const r=e.config.info;i=r.name||e.filename,s=r.description||"",r.version?o=Array.isArray(r.version)?`v${r.version.join(".")}`:`v${r.version}`:o="v1.0.0"}else i=e.filename||"Unknown",s="",o="v1.0.0";return html`
    <div class="scriptos-list-row" onclick=${()=>n("select-scriptos",e)}>
      <span class="scriptos-list-name">${i}</span>
      <span class="scriptos-list-version">${o}</span>
      <span class="scriptos-list-desc">${s}</span>
    </div>
  `}function ScriptOsConfigView(e,n){const i=e.selectedScriptOs;if(!i)return html`<div>Loading...</div>`;const s=i.config.info||{},o=i.config.args,r=o&&typeof o=="object"&&Object.keys(o).length>0;let d="v1.0.0";return s.version&&(Array.isArray(s.version)?d=`v${s.version.join(".")}`:d=`v${s.version}`),html`
    <div class="scriptos-config">
      <div class="scriptos-config-header">
        <div class="scriptos-config-title">
          <h2>${s.name||i.filename}</h2>
          <span class="scriptos-config-version">
            ${d}
          </span>
        </div>
        <p class="scriptos-config-description">${s.description||"No description"}</p>
        ${s.author?html`
          <div class="scriptos-config-meta">
            <span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              ${s.author}
            </span>
            ${s.www?html`
              <a href="${s.www}" target="_blank" rel="noopener">
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
        ${r?html`
          <h3>Configuration</h3>
          ${renderConfigFields(o,e,n)}
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
  `}function renderConfigFields(e,n,i){const s=Object.keys(e);return html`
    <div class="scriptos-config-fields">
      ${s.map(o=>{const r=e[o],d=r.label||o;r.type;const a=r.optional||!1;return html`
          <div class="scriptos-config-field">
            <label for="arg-${o}">
              ${d}
              ${a?html`<span class="scriptos-field-optional">(optional)</span>`:""}
            </label>
            ${renderInputField(o,r,n,i)}
          </div>
        `})}
    </div>
  `}function renderInputField(e,n,i,s){const o=n.type,r=i.scriptOsArgs[e],d=n.value!==void 0?n.value:null;switch(o){case"str":return html`
        <input 
          type="text" 
          id="arg-${e}"
          class="scriptos-input"
          value="${r!==void 0?r:d||""}"
          oninput=${p=>s("scriptos-update-arg",{argId:e,value:p.target.value})}
          placeholder="Enter text..."
        />
      `;case"int":return html`
        <input 
          type="number" 
          id="arg-${e}"
          class="scriptos-input"
          step="1"
          value="${r!==void 0?r:d||0}"
          oninput=${p=>s("scriptos-update-arg",{argId:e,value:parseInt(p.target.value)||0})}
          placeholder="Enter integer..."
        />
      `;case"float":return html`
        <input 
          type="number" 
          id="arg-${e}"
          class="scriptos-input"
          step="0.1"
          value="${r!==void 0?r:d||0}"
          oninput=${p=>s("scriptos-update-arg",{argId:e,value:parseFloat(p.target.value)||0})}
          placeholder="Enter number..."
        />
      `;case"bool":return html`
        <label class="scriptos-checkbox">
          <input 
            type="checkbox" 
            id="arg-${e}"
            checked=${r!==void 0?r:d||!1}
            onchange=${p=>s("scriptos-update-arg",{argId:e,value:p.target.checked})}
          />
          <span class="scriptos-checkbox-label">Enabled</span>
        </label>
      `;case"list":const a=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,21,26,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48];return html`
        <select 
          id="arg-${e}"
          class="scriptos-select"
          onchange=${p=>s("scriptos-update-arg",{argId:e,value:p.target.value==="none"?null:parseInt(p.target.value)})}>
          ${n.optional?html`<option value="none">No pin</option>`:""}
          ${a.map(p=>html`
            <option 
              value="${p}" 
              selected=${r==p||r===void 0&&d==p}>
              GPIO ${p}
            </option>
          `)}
        </select>
      `;case"dict":const c=n.items||{},l=Object.keys(c);return html`
        <select 
          id="arg-${e}"
          class="scriptos-select"
          onchange=${p=>s("scriptos-update-arg",{argId:e,value:p.target.value})}>
          ${l.map(p=>html`
            <option 
              value="${p}" 
              selected=${r===p||r===void 0&&d===p}>
              ${c[p]}
            </option>
          `)}
        </select>
      `;default:return html`
        <input 
          type="text" 
          id="arg-${e}"
          class="scriptos-input"
          value="${r!==void 0?r:d||""}"
          oninput=${p=>s("scriptos-update-arg",{argId:e,value:p.target.value})}
          placeholder="Enter value..."
        />
      `}}function ScriptOsUiModal(e,n){if(!e.scriptOsUiModal||!e.scriptOsUiModal.isOpen)return html`<div></div>`;const{url:i,title:s}=e.scriptOsUiModal;return html`
    <div 
      class="scriptos-ui-modal-overlay" 
      onclick=${o=>{o.target.classList.contains("scriptos-ui-modal-overlay")&&n("close-scriptos-ui-modal")}}>
      <div class="scriptos-ui-modal-container">
        <div class="scriptos-ui-modal-header">
          <h2 class="scriptos-ui-modal-title">${s||"ScriptO UI"}</h2>
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
            src="${i}"
            class="scriptos-ui-modal-iframe"
            style="${e.scriptOsUiModal.isLoading?"display: none;":""}"
            sandbox="allow-scripts allow-same-origin allow-forms"
            onload=${()=>{e.scriptOsUiModal&&e.scriptOsUiModal.isLoading&&(e.scriptOsUiModal.loadTimeout&&(clearTimeout(e.scriptOsUiModal.loadTimeout),e.scriptOsUiModal.loadTimeout=null),e.scriptOsUiModal.isLoading=!1,e.scriptOsUiModal.error=null,n("render"))}}
            onerror=${o=>{console.error("[ScriptO UI] Failed to load iframe:",o),e.scriptOsUiModal&&(e.scriptOsUiModal.loadTimeout&&(clearTimeout(e.scriptOsUiModal.loadTimeout),e.scriptOsUiModal.loadTimeout=null),e.scriptOsUiModal.isLoading=!1,e.scriptOsUiModal.error="Failed to load UI from device. Check the browser console for details.",n("render"))}}
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
            ${i}
          </div>
        </div>
      </div>
    </div>
  `}function ExtensionsModal(e,n){return!e.isExtensionsModalOpen&&!e.installingDependencies&&!e.dependencyPrompt?html`<div></div>`:e.dependencyPrompt?DependencyPromptModal(e,n):e.installingDependencies?DependencyInstallModal(e):html`
    <div class="scriptos-modal-overlay" onclick=${i=>{i.target.classList.contains("scriptos-modal-overlay")&&n("close-extensions-modal")}}>
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
        `:ExtensionsLibraryView(e,n)}
      </div>
    </div>
  `}function DependencyPromptModal(e,n){const{extensionId:i,extensionName:s,dependencies:o}=e.dependencyPrompt,r=o?.mipPackage||"";return html`
    <div class="scriptos-modal-overlay" onclick=${d=>{d.target.classList.contains("scriptos-modal-overlay")&&n("close-dependency-prompt")}}>
      <div class="scriptos-modal" style="max-width: 500px;">
        <div class="scriptos-library">
          <div class="scriptos-header">
            <h2>Install Dependencies?</h2>
            <p class="scriptos-subtitle">${s} requires Python libraries</p>
          </div>
          
          <div style="padding: 20px;">
            <p style="color: var(--text-primary); margin-bottom: 16px;">
              This extension requires Python libraries to be installed on your device.
            </p>
            <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 6px; padding: 12px; margin-bottom: 20px;">
              <div style="font-family: 'Menlo', 'Monaco', monospace; color: var(--scheme-primary); font-size: 13px; word-break: break-all;">
                ${r}
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
                onclick=${()=>n("upload-extension-dependencies",i)}
                style="padding: 10px 20px;">
                Install
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `}function DependencyInstallModal(e,n){const{extensionName:i,mipPackage:s}=e.installingDependencies;return html`
    <div class="scriptos-modal-overlay">
      <div class="scriptos-modal" style="max-width: 500px;">
        <div class="scriptos-library">
          <div class="scriptos-header">
            <h2>Installing Dependencies</h2>
            <p class="scriptos-subtitle">Installing Python libraries for ${i}...</p>
          </div>
          
          <div style="padding: 40px 20px; text-align: center;">
            <div class="scriptos-loading-spinner" style="margin: 0 auto 20px;"></div>
            <div style="font-family: 'Menlo', 'Monaco', monospace; color: var(--scheme-primary); font-size: 14px; margin-bottom: 12px;">
              ${s}
            </div>
            <p style="color: var(--text-secondary);">
              This may take a few moments. Please wait...
            </p>
          </div>
        </div>
      </div>
    </div>
  `}function ExtensionsLibraryView(e,n){const i=e.availableExtensions||[],s=e.installedExtensions||[],o=new Set(s.map(a=>a.id)),r=i.filter(a=>!o.has(a.id)),d=(a,c)=>{for(let l=0;l<3;l++){const p=a[l]||0,u=c[l]||0;if(p>u)return!0;if(p<u)return!1}return!1};return i.length===0?html`
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
            ${s.length} installed, ${r.length} available
          </p>
        </div>
      </div>
      
      <div class="scriptos-content">
        ${s.length>0?html`
          <div class="scriptos-section" style="margin-bottom: 32px">
            <h3 style="margin: 0 0 16px 0; font-size: 16px; color: var(--text-primary);">Installed</h3>
            
            <div class="scriptos-grid">
              ${s.map(a=>{const c=i.find(p=>p.id===a.id),l=c&&d(c.version,a.version);return html`
                  <div class="scriptos-card installed ${l?"has-update":""}">
                    ${l?html`
                      <div class="scriptos-update-badge">Update available</div>
                    `:""}
                    
                    <div class="scriptos-card-header">
                      <div class="scriptos-card-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          ${getExtensionIcon(a.icon)}
                        </svg>
                      </div>
                      <h3>${a.name}</h3>
                      <span class="scriptos-card-version">
                        v${a.version.join(".")}
                        ${l?html`<span class="scriptos-version-arrow">→ v${c.version.join(".")}</span>`:""}
                      </span>
                    </div>

                    <p class="scriptos-card-description">${a.description}</p>
                    
                    ${l&&c.changelog?html`
                      <p class="scriptos-card-changelog">${c.changelog}</p>
                    `:""}
                    
                    <div class="scriptos-card-actions" style="margin-top: auto; padding-top: 12px; border-top: 1px solid var(--border-color); display: flex; gap: 8px;">
                      ${l?html`
                        <button 
                          class="scriptos-update-btn"
                          onclick=${p=>{p.stopPropagation(),n("update-extension",{extension:a,newVersion:c})}}
                          title="Update to v${c.version.join(".")}">
                          Update
                        </button>
                      `:""}
                      <button 
                        class="scriptos-uninstall-btn"
                        onclick=${p=>{p.stopPropagation(),n("uninstall-extension",a.id)}}
                        title="Uninstall ${a.name}">
                        Uninstall
                      </button>
                    </div>
                    
                    <div class="scriptos-card-footer" style="border: none; padding-top: 8px;">
                       <span class="scriptos-card-author">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                        ${a.author}
                      </span>
                    </div>
                  </div>
                `})}
            </div>
          </div>
        `:""}
        
        ${r.length>0?html`
          <div class="scriptos-section">
            <h3 style="margin: 0 0 16px 0; font-size: 16px; color: var(--text-primary);">Available for Install</h3>
            
            <div class="scriptos-grid">
              ${r.map(a=>html`
                <div class="scriptos-card" onclick=${()=>n("install-extension",a)}>
                  <div class="scriptos-card-header">
                    <div class="scriptos-card-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        ${getExtensionIcon(a.icon)}
                      </svg>
                    </div>
                    <h3>${a.name}</h3>
                    <span class="scriptos-card-version">v${a.version.join(".")}</span>
                  </div>
                  
                  <p class="scriptos-card-description">${a.description}</p>
                  
                  <div class="scriptos-card-badge" style="margin-top: auto;">
                    <span class="scriptos-badge-install">Click to Install</span>
                  </div>

                   <div class="scriptos-card-footer">
                       <span class="scriptos-card-author">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                        ${a.author}
                      </span>
                    </div>
                </div>
              `)}
            </div>
          </div>
        `:""}
      </div>
    </div>
  `}function getExtensionIcon(e){const n={sliders:html`
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
    `};return n[e]||n.cpu}function ResetDialog(e,n){const i=e.isResetDialogOpen?"open":"closed";function s(a){a.target.id==="dialog-reset"&&n("close-reset-dialog")}function o(){n("trigger-reset",0)}async function r(){confirm(`HARD RESET WARNING:

This is equivalent to pressing the physical reset button.
The connection will be lost immediately.

Are you sure you want to proceed?`)&&n("trigger-reset",1)}e.isResetDialogOpen&&window.addEventListener("keydown",function a(c){c.key==="Escape"&&(n("close-reset-dialog"),window.removeEventListener("keydown",a))},{once:!0});const d=html`
  <div id="dialog-reset" class="dialog ${i}" tabindex="-1" onclick=${s}>
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
          
          <div class="reset-option" style="padding: 16px; background: var(--bg-secondary); border-radius: 8px; border: 1px solid var(--border-color); cursor: pointer;" onclick=${o}>
             <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                <div style="font-weight: 600; color: var(--text-primary);">Soft Reset</div>
                <div style="font-size: 11px; background: var(--scheme-primary); color: white; padding: 2px 6px; border-radius: 4px;">RECOMMENDED</div>
             </div>
             <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.4;">
               Restarts the MicroPython interpreter (VM). Global variables are cleared, but the WebREPL connection remains active.
             </div>
          </div>

          <div class="reset-option" style="padding: 16px; background: var(--bg-secondary); border-radius: 8px; border: 1px solid var(--border-color); cursor: pointer;" onclick=${r}>
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
  `;if(e.isResetDialogOpen)return d}function DebugSidebar(e,n){if(!e.debugger||!e.debugger.configOpen)return html``;const i=e.openFiles.filter(d=>d.fileName&&d.fileName.endsWith(".py")),o=(e.debugger.watchExpressions[""]||[]).join(`
`),r=e.debugger.active;return html`
    <div class="debug-sidebar">
      <div class="debug-sidebar-header">
        <h2>${r?"Debug Session":"Setup Debugger"}</h2>
        <button class="close-btn" onclick=${()=>{n(r?"debugger:stop":"debugger:close-config")}}>×</button>
      </div>

      <div class="debug-sidebar-body">
        ${i.length===0?html`
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
              oninput=${d=>n("debugger:set-watches",d.target.value)}
            >${o}</textarea>
          </section>

          ${r?html`
            <section class="debug-section">
              <h3>Live Variables</h3>
              <div class="debug-variables">
                ${Object.entries(e.debugger.variables||{}).map(([d,a])=>html`
                  <div class="debug-var">
                    <span class="var-name">${d}:</span>
                    <span class="var-value">${a}</span>
                  </div>
                `)}
                ${Object.entries(e.debugger.locals||{}).map(([d,a])=>html`
                  <div class="debug-var">
                    <span class="var-name">${d}:</span>
                    <span class="var-value">${a}</span>
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
              <p class="file-path">${e.openFiles.find(d=>d.id===e.editingFile)?.fileName||"No file selected"}</p>
              
              <div class="debug-actions">
                <button 
                  class="debug-btn-primary" 
                  onclick=${()=>n("debugger:start")}
                  disabled=${i.length===0}
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
  `}function BreakpointModal(e,n){if(!e.debugger||!e.debugger.breakpointModalOpen)return html`<div></div>`;const{file:i,line:s}=e.debugger.editingBreakpoint,o=e.debugger.breakpoints[i][s]||{condition:"",hitCount:"",enabled:!0},r=()=>{n("debugger:save-breakpoint",{file:i,line:s,config:o})},d=()=>{n("debugger:delete-breakpoint",{file:i,line:s})},a=()=>{n("debugger:close-breakpoint-modal")};return html`
    <div class="scriptos-modal-overlay" onclick=${c=>{c.target.classList.contains("scriptos-modal-overlay")&&a()}}>
      <div class="scriptos-modal breakpoint-modal">
        <div class="breakpoint-modal-header">
          <div class="breakpoint-modal-title">
            <span onclick=${a} style="cursor: pointer; font-size: 20px; line-height: 1;">×</span>
            <span>Breakpoint</span>
          </div>
          <div class="switch-container">
            <label class="switch">
              <input type="checkbox" checked=${o.enabled} onchange=${c=>{o.enabled=c.target.checked,n("render")}}>
              <span class="slider"></span>
            </label>
            <span style="font-size: 13px; color: var(--text-primary);">
              ${o.enabled?"Enabled":"Disabled"}
            </span>
            <button class="btn-delete" onclick=${d} title="Delete Breakpoint">
              ${IconSprite.renderIcon("trash",{size:20})}
            </button>
          </div>
        </div>

        <div class="breakpoint-modal-file">
          ${i} (${s})
        </div>

        <div class="breakpoint-field">
          <div class="breakpoint-field-icon" title="Condition">?</div>
          <input 
            type="text" 
            class="breakpoint-input" 
            placeholder="CONDITION EXPRESSION e.g. x == 0"
            value=${o.condition}
            oninput=${c=>{o.condition=c.target.value}}
          >
        </div>

        <div class="breakpoint-field">
          <div class="breakpoint-field-icon" title="Hit Count">
            ${IconSprite.renderIcon("hash",{size:18})}
          </div>
          <input 
            type="text" 
            class="breakpoint-input" 
            placeholder="HIT COUNT e.g. <1 or <=2 or =3 or >4 or >=5 or %6"
            value=${o.hitCount}
            oninput=${c=>{o.hitCount=c.target.value}}
          >
        </div>

        <div class="breakpoint-actions">
          <button class="scriptos-btn scriptos-btn-secondary" onclick=${a}>Cancel</button>
          <button class="scriptos-btn scriptos-btn-primary" onclick=${r}>Save</button>
        </div>
      </div>
    </div>
  `}const REGISTRY_PATH="/lib/ext/registry.json";async function readDeviceExtensionRegistry(e){try{const n=await e.execute(`
import json
try:
    with open('${REGISTRY_PATH}') as f:
        print(json.dumps({"registry": json.load(f)}))
except:
    print(json.dumps({"registry": {}}))
`);if(typeof n=="object"&&n.registry!==void 0)return n.registry;if(typeof n=="string"){const i=JSON.parse(n.trim());return i.registry||i||{}}return{}}catch(n){return console.warn("[device-registry] Error reading registry:",n),{}}}async function updateDeviceExtensionRegistry(e,n,i){try{const s=await readDeviceExtensionRegistry(e);s[n]={version:i,installedAt:Date.now()};const r=JSON.stringify(s).replace(/\\/g,"\\\\").replace(/'/g,"\\'");await e.execute(`
import json
import os
# Ensure /lib/ext exists as a Python package
def mkdirs(p):
  parts = p.strip('/').split('/')
  cur = ''
  for part in parts:
    cur += '/' + part
    try: os.mkdir(cur)
    except: pass
mkdirs('/lib/ext')
# Create __init__.py to make lib.ext a valid Python package
try:
  with open('/lib/ext/__init__.py', 'r'): pass
except:
  with open('/lib/ext/__init__.py', 'w') as f:
    f.write('# Extension package marker\\n')
# Write registry
with open('${REGISTRY_PATH}', 'w') as f:
    f.write('${r}')
print(json.dumps({"ok": True}))
`),console.log(`[device-registry] Updated ${n} to v${i}`)}catch(s){throw console.error("[device-registry] Error updating registry:",s),s}}function needsInstall(e,n){if(!n)return!0;const i=Array.isArray(e)?e.join("."):String(e),s=n.version||"";return i!==s}function hasOnInstallMethod(e){return e?/async\s+onInstall\s*\(/.test(e):!1}const deviceRegistry=Object.freeze(Object.defineProperty({__proto__:null,hasOnInstallMethod,needsInstall,readDeviceExtensionRegistry,updateDeviceExtensionRegistry},Symbol.toStringTag,{value:"Module"}));function decodeDeviceFiles(extensionCode){const filesMatch=extensionCode.match(/export\s+const\s+__DEVICE_FILES__\s*=\s*(\{[\s\S]*?\});/);if(!filesMatch)return{};try{const rawFiles=eval("("+filesMatch[1]+")"),deviceFiles={};for(const[e,n]of Object.entries(rawFiles))try{const i=atob(n),s=new Uint8Array(i.length);for(let o=0;o<i.length;o++)s[o]=i.charCodeAt(o);e.endsWith(".mpy")?deviceFiles[e]=s:deviceFiles[e]=new TextDecoder("utf-8").decode(s)}catch(i){console.warn(`[bundle-utils] Failed to decode ${e}:`,i),deviceFiles[e]=n}return deviceFiles}catch(e){return console.warn("[bundle-utils] Device files parse failed:",e),{}}}let lastExtensionDOM=null,lastExtensionKey=null;function shouldPreserveInput(e){const n=document.activeElement;if(n&&(n.tagName==="INPUT"||n.tagName==="TEXTAREA")){if(n.classList.contains("msg-input"))return!1;if(n.closest('.system-panel, .msg-chat, [class*="extension"]'))return!0}return!1}async function checkAndRunOnInstall(e,n,i,s,o,r){const d=i.data.config,a=Array.isArray(d.version)?d.version.join("."):String(d.version||"0.0.0");try{const l=(await readDeviceExtensionRegistry(s))[e];if(!needsInstall(a,l))return;o.loadedExtensions[e].installing=!0,r("render");try{await n.onInstall(),await updateDeviceExtensionRegistry(s,e,a)}catch(p){console.error("[ExtensionContainer] onInstall failed:",p),o.loadedExtensions[e].installError=p.message}finally{o.loadedExtensions[e].installing=!1,r("render")}}catch(c){console.warn("[ExtensionContainer] Could not check device registry:",c)}}async function instantiateExtension$1(e,n,i,s,o){if(n.data.styles&&!n.stylesInjected){const f=`extension-styles-${e}`;let h=document.getElementById(f);h||(h=document.createElement("style"),h.id=f,h.textContent=n.data.styles,document.head.appendChild(h)),n.stylesInjected=!0}const r=n.data.content,d=decodeDeviceFiles(r),a=new Blob([r],{type:"text/javascript"}),c=URL.createObjectURL(a);let l;try{l=(await import(c)).default}finally{URL.revokeObjectURL(c)}if(!l)throw new Error("No default export found in extension bundle");const p=new DeviceAPI$1(BridgeDevice),u=new l(p,s,i,o);u.deviceFiles=d,n.instance=u,n.instantiating=!1,s("render"),i.isConnected&&typeof u.onInstall=="function"&&checkAndRunOnInstall(e,u,n,p,i,s)}function ExtensionContainer(e,n,i){const s=e.activeExtension,o=e.activeExtensionPanel,r=`${s}:${o}`;if(shouldPreserveInput()&&lastExtensionDOM&&lastExtensionKey===r)return console.debug("[ExtensionContainer] Preserving DOM during input focus"),lastExtensionDOM;if(!s||!o)return lastExtensionDOM=null,lastExtensionKey=null,i`
      <div class="system-panel">
        <div class="panel-message">
          <p>No extension panel selected</p>
        </div>
      </div>
    `;if(!e.loadedExtensions[s])return lastExtensionDOM=null,lastExtensionKey=null,e.isConnected?i`
      <div class="system-panel">
        <div class="panel-message">
          <p>Loading extension...</p>
        </div>
      </div>
    `:i`
        <div class="system-panel">
          <div class="panel-message" style="cursor: pointer;" onclick=${()=>n("connect")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="32" height="32" style="opacity: 0.4; margin-bottom: 8px;">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
            <p style="color: var(--text-secondary);">Connect to device</p>
          </div>
        </div>
      `;const d=e.loadedExtensions[s];if(!d.instance&&!d.instantiating)return d.instantiating=!0,instantiateExtension$1(s,d,e,n,i).catch(l=>{console.error("[ExtensionContainer] Failed to instantiate extension:",l),d.instantiateError=l.message,d.instantiating=!1,n("render")}),lastExtensionDOM=null,lastExtensionKey=null,i`
      <div class="system-panel">
        <div class="panel-message">
          <p>Loading extension...</p>
        </div>
      </div>
    `;if(d.instantiating)return lastExtensionDOM=null,lastExtensionKey=null,i`
      <div class="system-panel">
        <div class="panel-message">
          <p>Loading extension...</p>
        </div>
      </div>
    `;if(d.instantiateError)return lastExtensionDOM=null,lastExtensionKey=null,i`
      <div class="system-panel">
        <div class="panel-message error">
          <p>Failed to load extension: ${d.instantiateError}</p>
        </div>
      </div>
    `;if(d.installing){lastExtensionDOM=null,lastExtensionKey=null;const l=d.data?.config?.name||s;return i`
      <div class="system-panel">
        <div class="panel-message" style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; padding: 48px 24px;">
          <div class="install-progress-spinner"></div>
          <div style="text-align: center;">
            <div style="font-size: 1.1rem; font-weight: 600; margin-bottom: 6px;">Installing ${l}</div>
            <div style="color: var(--text-secondary); font-size: 0.9rem;">Writing files to device…</div>
          </div>
        </div>
      </div>
    `}if(d.installError)return lastExtensionDOM=null,lastExtensionKey=null,i`
      <div class="system-panel">
        <div class="panel-message error">
          <p>Failed to install extension files: ${d.installError}</p>
          <button onclick=${()=>{delete d.installError,delete d.instance,n("render")}}>Retry</button>
        </div>
      </div>
    `;const a=d.instance,c=`render${o.charAt(0).toUpperCase()+o.slice(1)}`;if(typeof a[c]!="function")return lastExtensionDOM=null,lastExtensionKey=null,i`
      <div class="system-panel">
        <div class="panel-message error">
          <p>Extension panel not found: ${o}</p>
          <p>Looking for method: ${c}</p>
        </div>
      </div>
    `;try{const l=a[c]();return lastExtensionDOM=l,lastExtensionKey=r,l}catch(l){return console.error("[ExtensionContainer] Render error:",l),lastExtensionDOM=null,lastExtensionKey=null,i`
      <div class="system-panel">
        <div class="panel-message error">
          <p>Extension render error: ${l.message}</p>
        </div>
      </div>
    `}}function AgentSidebar(e,n){return e.aiAgent.isOpen?html`
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
        `:e.aiAgent.messages.map(i=>renderMessage(i,n))}
        
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
          oninput=${i=>{e.aiAgent.inputValue=i.target.value,n("ai-update-input",i.target.value)}}
          onkeydown=${i=>handleInputKeydown(i,e,n)}
          disabled=${e.aiAgent.isGenerating}
        >${e.aiAgent.inputValue||""}</textarea>
        <button 
          class="agent-send-btn"
          onclick=${()=>handleSendMessage(e,n)}
          disabled=${e.aiAgent.isGenerating}
          title="Send message (Ctrl+Enter)">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </div>
  `:html`<div></div>`}function renderMessage(e,n){const i=new Date(e.timestamp).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});return e.role==="user"?html`
      <div class="agent-message agent-message-user">
        <div class="agent-message-content">
          <div class="agent-message-text">${e.content}</div>
          <div class="agent-message-time">${i}</div>
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
          <div class="agent-message-text">${formatMessageContent(e.content)}</div>
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
          <div class="agent-message-time">${i}</div>
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
          <div class="agent-message-time">${i}</div>
        </div>
      </div>
    `:html`<div></div>`}function formatMessageContent(e){let n=e;n=n.replace(/```python\n[\s\S]*?```/g,'[Code generated - click "Configure" below]'),n=n.replace(/```\n[\s\S]*?```/g,'[Code generated - click "Configure" below]');const i=n.split(`
`);if(i.length===0)return"";if(i.length===1)return i[0]||"";const s=[];for(let o=0;o<i.length;o++)s.push(i[o]),o<i.length-1&&s.push(html`<br>`);return html`${s}`}function handleInputKeydown(e,n,i){(e.ctrlKey||e.metaKey)&&e.key==="Enter"&&(e.preventDefault(),handleSendMessage(n,i))}function handleSendMessage(e,n){const i=(e.aiAgent.inputValue||"").trim();!i||e.aiAgent.isGenerating||(n("ai-send-message",i),setTimeout(()=>{const s=document.getElementById("agent-messages");s&&(s.scrollTop=s.scrollHeight)},100))}class LogTerminalComponent extends Component{constructor(n,i,s){super(n),this.state=i,this.emit=s,this.term=null,this.fitAddon=null,this.resizeObserver=null,this.writeHandler=null,this.clearHandler=null}createElement(n){return html`<div class="log-sidebar-terminal"></div>`}update(n){return this.state=n,!1}load(n){console.debug("[LogTerminal] Component loaded, initializing terminal"),this.initTerminal(n),this.attachEventListeners()}unload(){console.debug("[LogTerminal] Component unloading, cleaning up"),this.cleanup()}async initTerminal(n){const s=document.documentElement.getAttribute("data-theme")==="dark";let o,r,d,a;s?(o="#2c3e50",r="#e8eaed",d="#008184",a="#34495e"):(o="#ffffff",r="#1f1f1f",d="#008184",a="#e8e8e8"),await this.ensureFontsLoaded();const[c,l]=await Promise.all([__vitePreload(()=>import("./xterm-CASmyfyk.js"),[]),__vitePreload(()=>import("./addon-fit-DOCEibfw.js"),[]),__vitePreload(()=>Promise.resolve({}),__vite__mapDeps([11]))]),p=c.Terminal,u=l.FitAddon;this.term=new p({cursorBlink:!1,cursorStyle:"bar",fontSize:12,fontFamily:"monospace",letterSpacing:0,theme:{background:o,foreground:r,cursor:d,selection:a},disableStdin:!0,scrollback:this.state.logs?.maxMessages||1e3}),this.fitAddon=new u,this.term.loadAddon(this.fitAddon),console.debug("[LogTerminal] Opening terminal into container, dimensions:",n.getBoundingClientRect()),this.term.open(n),this.fitAfterOpen(n)}async ensureFontsLoaded(){if(document.fonts&&document.fonts.ready)try{return await document.fonts.ready,document.fonts.check&&await new Promise(n=>setTimeout(n,50)),Promise.resolve()}catch{return new Promise(i=>setTimeout(i,200))}else return new Promise(n=>setTimeout(n,200))}fitAfterOpen(n){setTimeout(()=>this.fitTerminal(),100),setTimeout(()=>this.fitTerminal(),300),setTimeout(()=>this.fitTerminal(),1e3),this.resizeObserver=new ResizeObserver(()=>{setTimeout(()=>this.fitTerminal(),50)}),this.resizeObserver.observe(n);const i=n.closest(".log-sidebar");i&&this.resizeObserver.observe(i),this.term.write(`\x1B[1;32m=== Log Terminal Initialized ===\x1B[0m\r
`),this.term.write(`\x1B[37mTerminal is ready to receive logs\x1B[0m\r
\r
`),this.state.logs?.messages?.length>0&&(console.debug("[LogTerminal] Writing",this.state.logs.messages.length,"buffered messages"),this.state.logs.messages.forEach(s=>{this.writeLogEntry(s)}))}fitTerminal(){if(!this.term||!this.fitAddon)return;const i=this.element?.closest(".log-sidebar")?.getBoundingClientRect(),s=this.element?.getBoundingClientRect();console.debug("[LogTerminal] Sidebar rect:",i,"Container rect:",s);try{this.fitAddon.fit(),this.term.refresh&&this.term.refresh(0,this.term.rows-1),console.debug("[LogTerminal] Fitted:",this.term.cols,"x",this.term.rows)}catch(o){console.warn("[LogTerminal] Fit failed:",o)}}attachEventListeners(){this.writeHandler=n=>{const i=n.detail;i&&this.term&&this.writeLogEntry(i)},this.clearHandler=()=>{this.term&&this.term.clear()},window.addEventListener("log-terminal-write",this.writeHandler),window.addEventListener("log-terminal-clear",this.clearHandler),console.debug("[LogTerminal] Event listeners attached")}writeLogEntry(n){if(!this.term)return;const{level:i,message:s,timestamp:o,source:r}=n,d=["\x1B[37m","\x1B[34m","\x1B[33m","\x1B[31m"],a=["DBG","INF","WRN","ERR"],c=d[i]||"",l=a[i]||"LOG",p="\x1B[0m";let u="";if(o){const v=o<9466848e5?o*1e3:o;u=`[${new Date(v).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"})}] `}const f=r?`[${r}] `:"",h=`${u}${c}[${l}]${p} ${f}${s}\r
`;this.term.write(h),this.state.logs?.autoScroll!==!1&&this.term.scrollToBottom()}cleanup(){this.writeHandler&&(window.removeEventListener("log-terminal-write",this.writeHandler),this.writeHandler=null),this.clearHandler&&(window.removeEventListener("log-terminal-clear",this.clearHandler),this.clearHandler=null),this.resizeObserver&&(this.resizeObserver.disconnect(),this.resizeObserver=null),this.term&&(this.term.dispose(),this.term=null),this.fitAddon=null}}let logTerminalComponent=null;function LogSidebar(e,n){if(!e.logs.isOpen)return logTerminalComponent=null,null;logTerminalComponent||(logTerminalComponent=new LogTerminalComponent("log-terminal",e,n));const i=logTerminalComponent.render(e),s=e.logSidebarWidth||350;return html`
    <div class="log-sidebar" style="width: ${s}px; flex: 0 0 ${s}px;">
      <div class="log-sidebar-resizer" 
           onmousedown=${()=>n("start-resizing-log-sidebar")}></div>
      <div class="log-sidebar-header">
        ${IconSprite.renderIcon("file-text",{className:"",size:16})}
        <span>Logs</span>
      </div>
      ${i}
    </div>
  `}function FileActions(e,n){const{isConnected:i,selectedFiles:s}=e,o=s.some(r=>r.type==="file");return html`
  <div id="file-actions">
    ${Button({icon:"edit",size:"small",disabled:!canEdit({selectedFiles:e.selectedFiles}),onClick:()=>n("open-selected-files")})}
    ${Button({icon:"arrow-left",size:"small",background:"inverted",active:!0,disabled:!canUpload({isConnected:i,selectedFiles:s}),onClick:()=>n("upload-files")})}
    ${Button({icon:"arrow-right",size:"small",background:"inverted",active:!0,disabled:!canDownload({isConnected:i,selectedFiles:s}),onClick:()=>n("download-files")})}
    ${Button({icon:"arrow-down",size:"small",background:"inverted",active:!0,disabled:!o,onClick:()=>n("export-files")})}
    ${Button({icon:"trash",size:"small",disabled:e.selectedFiles.length===0,onClick:()=>n("remove-files")})}
  </div>

  `}const DiskFileList=generateFileList("disk"),BoardFileList=generateFileList("board");function generateFileList(e){return function(i,s){function o(f){f.key.toLowerCase()==="enter"&&f.target.blur(),f.key.toLowerCase()==="escape"&&(f.target.value=null,f.target.blur())}const r=html`
      <div class="item">
        ${IconSprite.renderIcon("file",{className:"icon"})}
        <div class="text">
          <input type="text" onkeydown=${o} onblur=${f=>s("finish-creating-file",f.target.value)}/>
        </div>
      </div>
    `,d=html`
      <div class="item">
        ${IconSprite.renderIcon("folder",{className:"icon"})}
        <div class="text">
          <input type="text" onkeydown=${o} onblur=${f=>s("finish-creating-folder",f.target.value)}/>
        </div>
      </div>
    `;function a(f,h){const m=html`
        <input type="text"
          value=${f.fileName}
          onkeydown=${o}
          onblur=${C=>s("finish-renaming-file",C.target.value)}
          onclick=${C=>!1}
          ondblclick=${C=>!1}
          />
      `,v=i.selectedFiles.find(C=>C.fileName===f.fileName&&C.source===e);function y(C){return C.preventDefault(),s("rename-file",e,f),!1}function w(){i.renamingFile||s(`navigate-${e}-folder`,f.fileName)}function S(){i.renamingFile||s("open-file",e,f)}let x=f.fileName;const E=i.selectedFiles.find(C=>C.fileName===x);i.renamingFile==e&&E&&(x=m);function b(C){if(C==null)return"";if(C===0)return"0 B";const T=1024,I=["B","KB","MB","GB"],$=Math.floor(Math.log(C)/Math.log(T));return parseFloat((C/Math.pow(T,$)).toFixed(1))+" "+I[$]}const k=f.type==="file"?b(f.size):"";return f.type==="folder"?html`
          <div
            class="item ${v?"selected":""}"
            onclick=${C=>s("toggle-file-selection",f,e,C)}
            ondblclick=${w}
            >
            ${IconSprite.renderIcon("folder",{className:"icon"})}
            <div class="text">${x}</div>
            <div class="options" onclick=${y}>
              ${IconSprite.renderIcon("cursor-text",{className:""})}
            </div>
          </div>
        `:html`
          <div
            class="item ${v?"selected":""}"
            onclick=${C=>s("toggle-file-selection",f,e,C)}
            ondblclick=${S}
            >
            ${IconSprite.renderIcon("file",{className:"icon"})}
            <div class="text" style="display: flex; justify-content: space-between; padding-right: 10px;">
              <span>${x}</span>
              <span class="file-size">${k}</span>
            </div>
            <div class="options" onclick=${y}>
              ${IconSprite.renderIcon("cursor-text",{className:""})}
            </div>
          </div>
        `}const c=i[`${e}Files`].sort((f,h)=>{const m=f.fileName.toUpperCase(),v=h.fileName.toUpperCase();if(f.type==="folder"&&h.type==="file")return-1;if(f.type===h.type){if(m<v)return-1;if(m>v)return 1}return 0}),l=html`<div class="item"
  onclick=${()=>s(`navigate-${e}-parent`)}
  style="cursor: pointer"
  >
  ..
</div>`,p=html`
      <div class="file-list">
        <div class="list">
          ${e==="disk"&&i.diskNavigationPath!="/"?l:""}
          ${e==="board"&&i.boardNavigationPath!="/"?l:""}
          ${i.creatingFile==e?r:null}
          ${i.creatingFolder==e?d:null}
          ${c.map(a)}
        </div>
      </div>
    `;return new MutationObserver(f=>{const h=p.querySelector("input");h&&h.focus()}).observe(p,{childList:!0,subtree:!0}),p}}function ReplPanel(e,n){const i=()=>{e.panelHeight>PANEL_CLOSED$1?n("close-panel"):n("open-panel")};e.isPanelOpen;const s=e.panelHeight>PANEL_TOO_SMALL$1?"visible":"hidden";let o="terminal-enabled";return(!e.isConnected||e.isNewFileDialogOpen)&&(o="terminal-disabled"),html$1`
    <div id="panel" style="height: ${e.panelHeight}px">
      <div class="panel-bar">
        ${e.isConnected&&e.connectedPort?html$1`
          <div class="panel-connection-label" title=${`Connected to ${e.connectedPort}`}>
            Connected to ${e.connectedPort}
          </div>
        `:""}
        <div class="spacer"></div>
        <div id="drag-handle"
          onmousedown=${r=>n("start-resizing-panel",r)}
          ></div>
        <div class="term-operations ${s}">
          ${ReplOperations(e,n)}
        </div>
        ${Button({icon:e.panelHeight>PANEL_CLOSED$1?"chevron-down":"chevron-up",size:"small",onClick:i})}
        
      </div>
      <div class="repl-panel-content">
        <div class="repl-panel-main ${o}">
          ${e.cache(XTerm,"terminal").render()}
        </div>
        ${e.logs&&e.logs.isOpen?LogSidebar(e,n):""}
      </div>
    </div>
  `}function ReplOperations(e,n){return[Button({icon:"copy",size:"small",tooltip:"Copy",onClick:()=>document.execCommand("copy")}),Button({icon:"clipboard",size:"small",tooltip:"Paste",onClick:()=>document.execCommand("paste")}),Button({icon:"trash",size:"small",tooltip:`Clean (${e.platform==="darwin"?"Cmd":"Ctrl"}+L)`,onClick:()=>n("clear-terminal")}),Button({icon:"file-text",size:"small",tooltip:"Toggle Logs",onClick:()=>n("toggle-log-sidebar")})]}function Tabs(e,n){const i=html`
    <div id="tabs">
      ${e.openFiles.map(o=>Tab({text:o.fileName,icon:o.source==="board"?"cpu":"device-desktop",active:o.id===e.editingFile,renaming:o.id===e.renamingTab,hasChanges:o.hasChanges,onSelectTab:()=>n("select-tab",o.id),onCloseTab:()=>n("close-tab",o.id),onStartRenaming:()=>n("rename-tab",o.id),onFinishRenaming:r=>n("finish-renaming-tab",r)}))}
    </div>
  `;return new MutationObserver(o=>{const r=i.querySelector("input");r&&r.focus()}).observe(i,{childList:!0,subtree:!0}),i}function openIframeModal(e,n){const i=document.createElement("div");return i.className="fw-modal-overlay active",i.style.cssText="z-index: 10000;",i.innerHTML=`
    <div style="
      width: 92vw; height: 90vh; max-width: 1200px;
      background: var(--bg-primary, #1a1d23);
      border-radius: 12px;
      overflow: hidden;
      display: flex; flex-direction: column;
      box-shadow: 0 25px 60px rgba(0,0,0,0.5);
    ">
      <div style="
        display: flex; align-items: center; justify-content: space-between;
        padding: 12px 16px;
        border-bottom: 1px solid var(--border-color, #2a2d35);
        background: var(--bg-secondary, #22252b);
      ">
        <span style="font-weight: 600; font-size: 1rem; color: var(--text-primary, #e0e0e0);">${n}</span>
        <div style="display: flex; gap: 8px; align-items: center;">
          <button onclick="window.open('${e}', '_blank')" style="
            background: none; border: 1px solid var(--border-color, #2a2d35);
            color: var(--text-secondary, #999); cursor: pointer;
            padding: 4px 10px; border-radius: 6px; font-size: 0.8rem;
          ">↗ Open in tab</button>
          <button class="iframe-modal-close" style="
            background: none; border: none;
            color: var(--text-secondary, #999); cursor: pointer;
            font-size: 1.4rem; line-height: 1; padding: 4px 8px;
          ">✕</button>
        </div>
      </div>
      <iframe src="${e}" style="
        flex: 1; border: none; width: 100%;
        background: var(--bg-primary, #1a1d23);
      "></iframe>
    </div>
  `,i.querySelector(".iframe-modal-close").addEventListener("click",()=>i.remove()),i.addEventListener("click",s=>{s.target===i&&i.remove()}),document.addEventListener("keydown",function s(o){o.key==="Escape"&&(i.remove(),document.removeEventListener("keydown",s))}),document.body.appendChild(i),i}function closeIframeModal(){const e=document.querySelector(".fw-modal-overlay.active");e&&e.remove()}function Toolbar(e,n){const i=canSave({isConnected:e.isConnected,openFiles:e.openFiles,editingFile:e.editingFile}),s=canExecute({isConnected:e.isConnected}),o=e.platform==="darwin"?"Cmd":"Ctrl",r=e.debugger.active||e.debugger.configOpen;return html`
    <div id="navigation-bar">
      <div id="toolbar">
        ${Button({icon:"file-plus",label:"New",tooltip:`New (${o}+N)`,disabled:e.systemSection!="editor"||r,onClick:()=>n("create-new-file"),first:!0})}

        ${Button({icon:"device-floppy",label:"Save",tooltip:`Save (${o}+S)`,disabled:!i||r,onClick:()=>n("save")})}

        <div class="separator"></div>

        ${Button({icon:"alert-triangle",label:"Reset",tooltip:"Reset Device",disabled:!e.isConnected,onClick:()=>n("open-reset-dialog")})}

        ${r?html`
          ${Button({icon:"player-stop",label:"Stop",tooltip:"Stop Debug",onClick:()=>n("debugger:stop")})}

          ${Button({icon:"player-play",label:e.debugger.active?"Continue":"Run",tooltip:e.debugger.active?"Continue (F5)":"Start Debugging (F5)",disabled:e.debugger.active&&!e.debugger.halted,onClick:()=>{e.debugger.active?n("debugger:continue",!0):n("debugger:start")}})}

          ${Button({icon:"player-skip-forward",label:"Step",tooltip:"Step Over (F10)",disabled:!e.debugger.active||!e.debugger.halted,onClick:()=>n("debugger:step-over")})}
          ${Button({icon:"step-into",label:"Step In",tooltip:"Step Into (F11)",disabled:!e.debugger.active||!e.debugger.halted,onClick:()=>n("debugger:step-into")})}
          ${Button({icon:"step-out",label:"Step Out",tooltip:"Step Out (F12)",disabled:!e.debugger.active||!e.debugger.halted,onClick:()=>n("debugger:step-out")})}
        `:html`
          ${Button({icon:"player-stop",label:"Stop",tooltip:`Stop (${o}+H)`,disabled:!s,onClick:()=>n("stop")})}

          ${Button({icon:"player-play",label:"Run",tooltip:`Run (${o}+R)`,disabled:!s,onClick:d=>{d.altKey?n("run-from-button",!0):n("run-from-button")}})}

          <div class="separator"></div>

          ${e.systemSection==="editor"?Button({icon:"bug",label:"Debug",tooltip:"Start Debugging",disabled:!s||!e.editingFile,onClick:()=>n("debugger:open-config")}):""}

          <div class="separator"></div>

          ${e.systemSection==="editor"?Button({icon:"script",label:"ScriptO",tooltip:"Open ScriptO Library",onClick:()=>openIframeModal("https://scriptohub.ai/skills","Browse ScriptOs")}):""}

          ${e.systemSection==="system"?Button({icon:"apps",label:"Extensions",tooltip:"Manage Extensions",onClick:()=>n("open-extensions-modal")}):""}

          ${e.systemSection==="editor"?Button({icon:"robot-face",label:"AI Agent",tooltip:"Open AI Code Assistant",active:e.aiAgent.isOpen,onClick:()=>n("toggle-agent-sidebar")}):""}
        `}
      </div>
    </div>
  `}function Overlay(e,n){let i=html`<div id="overlay" class="closed"></div>`;if(e.diskFiles==null&&(n("load-disk-files"),i=html`<div id="overlay" class="open"><p>Loading files...</p></div>`),e.isRemoving&&(i=html`<div id="overlay" class="open"><p>Removing...</p></div>`),e.isConnecting&&(i=html`<div id="overlay" class="open"><p>Connecting...</p></div>`),e.isLoadingFiles&&(i=html`<div id="overlay" class="open"><p>Loading files...</p></div>`),e.isSaving&&(i=html`<div id="overlay" class="open"><p>Saving file... ${e.savingProgress}</p></div>`),e.isTransferring){const s=String(e.transferringProgress||""),o=s.match(/(\d+)%?$/),r=o?parseInt(o[1]):0,d=s.match(/^(.+?):/),a=d?d[1]:"file";i=html`
      <div id="overlay" class="open">
        <div class="transfer-overlay-content">
          <div class="transfer-title">Transferring File</div>
          <div class="transfer-filename">${a}</div>
          <div class="transfer-progress-container">
            <div class="transfer-progress-bar">
              <div class="transfer-progress-fill" style="width: ${r}%"></div>
            </div>
            <div class="transfer-progress-text">${r}%</div>
          </div>
        </div>
      </div>
    `}return i}const DISCONNECTED_STATUS_TEXT="ScriptO Studio © JetPax 2026";function formatUptimeMinutes(e){const n=(e||0)*60,i=Math.floor(n/86400),s=Math.floor(n%86400/3600),o=Math.floor(n%3600/60),r=Math.floor(n%60),d=[];return i>0&&d.push(`${i}d`),s>0&&d.push(`${s}h`),o>0&&d.push(`${o}m`),(r>0||d.length===0)&&d.push(`${r}s`),d.join(" ")}function buildStatusBarModel(e,n){if(!e)return{connected:!1,disconnectedText:DISCONNECTED_STATUS_TEXT,ram:null,temp:null,uptime:null,rssi:null};const i=e.mem||{},s=e.temp,o=e.uptime||0,r=e.wifi_rssi;let d=i.alloc||0,a=i.free||0;const c=e.bvm;c&&(d+=c.total||0);const l=d+a,p=(d/1024).toFixed(2),u=(l/(1024*1024)).toFixed(2);let f=null;s!=null&&((n||"degC")==="degF"?f=`${(s*9/5+32).toFixed(1)}°F`:f=`${s.toFixed(1)}°C`);const h=formatUptimeMinutes(o);let m=null;return r!=null&&(m=`${r} dBm`),{connected:!0,disconnectedText:DISCONNECTED_STATUS_TEXT,ram:`${p} KB / ${u} MB`,temp:f,uptime:h,rssi:m}}function StatusBar(e,n){const i=buildStatusBarModel(e.isConnected?e.statusInfo:null,e.temperatureUnit||"degC");if(!i||!i.connected){const s=i&&i.disconnectedText||DISCONNECTED_STATUS_TEXT;return html`
      <div id="status-bar" class="disconnected">
        <div class="status-bar-center">
          <a href="https://scriptostudio.com" target="_blank" rel="noopener noreferrer">${s}</a>
        </div>
      </div>
    `}return html`
    <div id="status-bar">
      <div class="status-bar-center">
        <div class="status-item ram">
          <span class="status-label">RAM</span>
          <span class="status-value">${i.ram}</span>
        </div>
        ${i.temp?html`
          <div class="status-item temp">
            <span class="status-label">TEMP</span>
            <span class="status-value">${i.temp}</span>
          </div>
        `:""}
        <div class="status-item uptime">
          <span class="status-label">UPTIME</span>
          <span class="status-value">${i.uptime}</span>
        </div>
        ${i.rssi?html`
          <div class="status-item wifi-rssi">
            <span class="status-label">RSSI</span>
            <span class="status-value">${i.rssi}</span>
          </div>
        `:""}
      </div>
    </div>
  `}function LanguageSelector(e,n){const i=window.html||(()=>{}),s=e.locale||"en",o=window.i18n?window.i18n.getAvailableLocales():["en","de","es","fr"],r=window.i18n?window.i18n.t("language"):"Language";return i`
    <div class="language-selector">
      <label class="language-selector-label" for="language-select">
        ${r}
      </label>
      <select
        id="language-select"
        class="language-select"
        onchange=${a=>{const c=a.target.value;n("change-locale",c)}}
      >
        ${o.map(a=>i`
          <option value=${a} selected=${a===s}>
            ${window.i18n?window.i18n.getLocaleName(a):a}
          </option>
        `)}
      </select>
    </div>
  `}typeof window<"u"&&(window.LanguageSelector=LanguageSelector);function AppearancePanel(e,n){const i=window.i18n?window.i18n.t:d=>d;e.isConnected&&!e.networkInterfacesConfig&&!e.isLoadingNetworkInterfacesConfig&&n("load-network-interfaces-config");const s=e.networksInfo?.eth!==null,o=e.networksInfo?.wwan!==null,r=e.networkInterfacesConfig||{wifi:!0,ethernet:!0,wwan:!0};return html`
    <div class="panel-container">
      <div class="appearance-content">
        
        <!-- Theme Mode Section -->
        <div class="appearance-section">
          <h3>${i("appearance.theme")}</h3>
          <p class="appearance-hint">${i("appearance.themeHint")}</p>
          
          <div class="theme-mode-selector">
            ${renderThemeOption("light",i("appearance.themeLight"),e,n)}
            ${renderThemeOption("dark",i("appearance.themeDark"),e,n)}
            ${renderThemeOption("device",i("appearance.themeDevice"),e,n)}
          </div>
          
          ${e.theme==="device"?html`
            <p class="appearance-hint">
              ${i("appearance.themeCurrentlyUsing")} <strong>${e.effectiveTheme==="dark"?i("appearance.themeDark"):i("appearance.themeLight")}</strong> 
              ${i("appearance.themeFromSystem")}
            </p>
          `:""}
        </div>
        
        <!-- Color Scheme Section -->
        <div class="appearance-section">
          <h3>${i("appearance.colorScheme")}</h3>
          <p class="appearance-hint">${i("appearance.colorSchemeHint")}</p>
          
          <div class="color-scheme-grid">
            ${renderColorSchemeOption("teal",i("appearance.colorTeal"),e,n)}
            ${renderColorSchemeOption("blue",i("appearance.colorBlue"),e,n)}
            ${renderColorSchemeOption("purple",i("appearance.colorPurple"),e,n)}
            ${renderColorSchemeOption("green",i("appearance.colorGreen"),e,n)}
            ${renderColorSchemeOption("red",i("appearance.colorRed"),e,n)}
            ${renderColorSchemeOption("orange",i("appearance.colorOrange"),e,n)}
          </div>
        </div>
        
        <!-- Editor Theme Section -->
        <div class="appearance-section">
          <h3>${i("appearance.editorTheme")}</h3>
          <p class="appearance-hint">${i("appearance.editorThemeHint")}</p>
          
          <div class="editor-theme-grid">
            ${renderEditorThemeOption("auto",i("appearance.editorAuto"),i("appearance.editorAutoDesc"),e,n)}
            ${renderEditorThemeOption("cobalt",i("appearance.editorCobalt"),i("appearance.editorCobaltDesc"),e,n)}
            ${renderEditorThemeOption("xcode",i("appearance.editorXcode"),i("appearance.editorXcodeDesc"),e,n)}
            ${renderEditorThemeOption("coolglow",i("appearance.editorCoolGlow"),i("appearance.editorCoolGlowDesc"),e,n)}
          </div>
        </div>
        
        <!-- Temperature Unit Section -->
        <div class="appearance-section">
          <h3>${i("appearance.temperatureUnit")}</h3>
          <p class="appearance-hint">${i("appearance.temperatureUnitHint")}</p>
          
          <div class="theme-mode-selector">
            ${renderTemperatureUnitOption("degC",i("appearance.temperatureCelsius"),e,n)}
            ${renderTemperatureUnitOption("degF",i("appearance.temperatureFahrenheit"),e,n)}
          </div>
        </div>
        
        <!-- Network Interfaces Section (only show when connected) -->
        ${e.isConnected?html`
          <div class="appearance-section">
            <h3>Network Interfaces</h3>
            <p class="appearance-hint">Enable or disable network interfaces. Disabled interfaces will not start on boot. At least one interface must remain enabled.</p>
            
            ${e.isLoadingNetworkInterfacesConfig?html`
              <p style="color: var(--text-secondary);">Loading configuration...</p>
            `:html`
              <div class="network-interfaces-grid">
                ${renderNetworkInterfaceOption("wifi","WiFi",r.wifi,e,n)}
                ${s?renderNetworkInterfaceOption("ethernet","Ethernet",r.ethernet,e,n):""}
                ${o?renderNetworkInterfaceOption("wwan","WWAN (4G)",r.wwan,e,n):""}
              </div>
              
              <button 
                class="save-button" 
                style="margin-top: 16px;"
                onclick=${()=>{const d={wifi:e.networkInterfacesConfig?.wifi??!0,ethernet:e.networkInterfacesConfig?.ethernet??!0,wwan:e.networkInterfacesConfig?.wwan??!0};n("save-network-interfaces-config",d)}}
                disabled=${!e.isConnected||e.isSavingNetworkInterfacesConfig===!0}
              >
                ${e.isSavingNetworkInterfacesConfig?"Saving...":"Save Network Settings"}
              </button>
            `}
          </div>
        `:""}
        
      </div>
    </div>
  `}function renderThemeOption(e,n,i,s){const o=i.theme===e;return html`
    <button 
      class="theme-mode-option ${o?"selected":""}"
      onclick=${()=>s("set-theme",e)}
    >
      ${getThemeIcon(e)}
      <span>${n}</span>
    </button>
  `}function getThemeIcon(e){const n={light:html`
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
    `};return n[e]||n.device}function renderColorSchemeOption(e,n,i,s){const o=i.colorScheme===e;return html`
    <div 
      class="color-scheme-option ${o?"selected":""}"
      data-scheme="${e}"
      onclick=${()=>s("set-color-scheme",e)}
    >
      <div class="color-scheme-circle"></div>
      <div class="color-scheme-label">${n}</div>
    </div>
  `}function renderTemperatureUnitOption(e,n,i,s){const o=(i.temperatureUnit||"degC")===e;return html`
    <button 
      class="theme-mode-option ${o?"selected":""}"
      onclick=${()=>s("set-temperature-unit",e)}
    >
      <span>${n}</span>
    </button>
  `}function renderEditorThemeOption(e,n,i,s,o){const r=(s.editorTheme||"auto")===e;return html`
    <div 
      class="editor-theme-option ${r?"selected":""}"
      onclick=${()=>o("set-editor-theme",e)}
    >
      <div class="editor-theme-preview" data-theme="${e}"></div>
      <div class="editor-theme-info">
        <div class="editor-theme-name">${n}</div>
        <div class="editor-theme-desc">${i}</div>
      </div>
    </div>
  `}function renderNetworkInterfaceOption(e,n,i,s,o){return html`
    <div class="network-interface-option">
      <div class="network-interface-info">
        <span class="network-interface-label">${n}</span>
        <span class="network-interface-status ${i?"enabled":"disabled"}">
          ${i?"Enabled":"Disabled"}
        </span>
      </div>
      <label class="toggle-switch">
        <input 
          type="checkbox" 
          checked=${i}
          onchange=${r=>{s.networkInterfacesConfig||(s.networkInterfacesConfig={wifi:!0,ethernet:!0,wwan:!0}),s.networkInterfacesConfig[e]=r.target.checked,o("render")}}
        />
        <span class="toggle-slider"></span>
      </label>
    </div>
  `}function StudioInfoSection(e){return html`
    <div class="panel-section">
      <h3 class="panel-section-title">${e("sysinfo.studioTitle")}</h3>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">${e("sysinfo.studioVersion")}</span>
          <span class="info-value">${"1.2.1"}</span>
        </div>
        <div class="info-item">
          <span class="info-label">${e("sysinfo.studioCommit")}</span>
          <span class="info-value info-mono">${"cbb6af6"}</span>
        </div>
        <div class="info-item">
          <span class="info-label">${e("sysinfo.studioBuildDate")}</span>
          <span class="info-value">${"2026-05-04"}</span>
        </div>
      </div>
    </div>
  `}function FirmwareInfoSection(e,n){const i=e?.firmware_version||{},s=i.platform_version||i.platform||n("sysinfo.notAvailable"),o=i.built||n("sysinfo.notAvailable"),r=i.origin||(i.platform_version?"gha":"unknown");return html`
    <div class="panel-section">
      <h3 class="panel-section-title">${n("sysinfo.firmwareTitle")}</h3>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">${n("sysinfo.firmwareVersion")}</span>
          <span class="info-value">${s}</span>
        </div>
        <div class="info-item">
          <span class="info-label">${n("sysinfo.firmwareBuilt")}</span>
          <span class="info-value info-mono">${o}</span>
        </div>
        <div class="info-item">
          <span class="info-label">${n("sysinfo.firmwareOrigin")}</span>
          <span class="info-value">${r}</span>
        </div>
      </div>
    </div>
  `}function SysInfoPanel(e,n){const i=window.i18n?window.i18n.t:o=>o;if(!e.systemInfo&&e.isConnected&&!e.isLoadingSystemInfo&&!e.systemInfoAttempted&&(e.systemInfoAttempted=!0,n("refresh-system-info")),!e.systemInfo)return html`
      <div class="panel-container">
        <div class="panel-header">
          <h2>${i("sysinfo.title")}</h2>
        </div>
        ${StudioInfoSection(i)}
        <div class="panel-message">
          <p>${e.isConnected?i("sysinfo.loading"):"Connect to a device to view system information."}</p>
        </div>
      </div>
    `;const s=e.systemInfo;return html`
    <div class="panel-container">
      <div class="panel-header">
        <h2>${i("sysinfo.title")}</h2>
      </div>
      
      ${StudioInfoSection(i)}
      ${FirmwareInfoSection(e.boardConfig,i)}
      ${BoardInfoSection(e.boardConfig,i)}
      ${MCUSection(s,i)}
      ${PartitionsSection(s,i)}
    </div>
  `}function BoardInfoSection(e,n){return html`
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
          ${e.version&&e.version!=="0.0"?html`
            <div class="info-item">
              <span class="info-label">${n("sysinfo.hardwareRevision")}</span>
              <span class="info-value">${e.version}</span>
            </div>
          `:""}
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
  `}function MCUSection(e,n){const i=e.os||{};return html`
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
          <span class="info-value">${formatBytes$1(e.flashSize)}</span>
        </div>
        <div class="info-item">
          <span class="info-label">${n("sysinfo.platform")}</span>
          <span class="info-value">${i.platform||n("sysinfo.notAvailable")}</span>
        </div>
        <div class="info-item">
          <span class="info-label">${n("sysinfo.system")}</span>
          <span class="info-value">${i.system||n("sysinfo.notAvailable")}</span>
        </div>
        <div class="info-item">
          <span class="info-label">${n("sysinfo.release")}</span>
          <span class="info-value">${i.release||n("sysinfo.notAvailable")}</span>
        </div>
        <div class="info-item">
          <span class="info-label">${n("sysinfo.version")}</span>
          <span class="info-value info-mono">${i.version||n("sysinfo.notAvailable")}</span>
        </div>
        <div class="info-item">
          <span class="info-label">${n("sysinfo.implementation")}</span>
          <span class="info-value">${i.implem||n("sysinfo.notAvailable")}</span>
        </div>
        <div class="info-item">
          <span class="info-label">${n("sysinfo.spiram")}</span>
          <span class="info-value ${i.spiram?"status-yes":"status-no"}">
            ${i.spiram?n("sysinfo.yes"):n("sysinfo.no")}
          </span>
        </div>
        <div class="info-item">
          <span class="info-label">${n("sysinfo.mpyVersion")}</span>
          <span class="info-value">${i.mpyver||n("sysinfo.notAvailable")}</span>
        </div>
      </div>
    </div>
  `}function PartitionsSection(e,n){return!e.partitions||e.partitions.length===0?"":html`
    <div class="panel-section">
      <h3 class="panel-section-title">${n("sysinfo.partitions")}</h3>
      <div class="partitions-table">
        <div class="partition-header">
          <span class="partition-name">${n("sysinfo.partitionName")}</span>
          <span class="partition-type">${n("sysinfo.partitionType")}</span>
          <span class="partition-offset">${n("sysinfo.partitionOffset")}</span>
          <span class="partition-size">${n("sysinfo.partitionSize")}</span>
        </div>
        ${e.partitions.map(i=>{let s;return Array.isArray(i)?s={type:i[0],subtype:i[1],offset:i[2],size:i[3],name:i[4]||"unknown",encrypted:i[5]}:s=i,html`
            <div class="partition-row">
              <span class="partition-name">
                ${getPartitionIcon(s.name)}
                ${s.name}
              </span>
              <span class="partition-type">${getPartitionType(s.type,s.subtype)}</span>
              <span class="partition-offset">0x${s.offset.toString(16)}</span>
              <span class="partition-size">${formatBytes$1(s.size)}</span>
            </div>
          `})}
      </div>
    </div>
  `}function getPartitionType(e,n){return{0:"APP",1:"DATA"}[e]||`Type ${e}`}function getPartitionIcon(e){if(!e)return"📦";const n=e.toLowerCase();return n.includes("ota")?"🔄":n.includes("nvs")?"💾":n.includes("www")?"🌐":n.includes("vfs")?"📁":n.includes("data")?"💿":n.includes("factory")?"🏭":"📦"}function formatBytes$1(e){return e?e<1024?e+" B":e<1024*1024?(e/1024).toFixed(1)+" KB":(e/(1024*1024)).toFixed(2)+" MB":"N/A"}function WiFiPanel(e,n){if(!e.networksInfo&&e.isConnected&&!e.isLoadingNetworks&&n("refresh-networks"),e.isConnected&&!e.networkInterfacesConfig&&!e.isLoadingNetworkInterfacesConfig&&n("load-network-interfaces-config"),!e.networksInfo)return html`
      <div class="panel-container">
        <div class="panel-header">
          <h2>WiFi Configuration</h2>
        </div>
        <div class="panel-loading">
          ${e.isConnected?"Loading WiFi information...":"Connect to device to view WiFi configuration"}
        </div>
      </div>
    `;const i=e.networksInfo,s=e.networkInterfacesConfig?.wifi===!1;return html`
    <div class="panel-container">
      <div class="panel-header">
        <h2>WiFi Configuration</h2>
      </div>
      
      ${WiFiSTASection(i.wifiSTA,s)}
      ${WiFiAPSection(i.wifiAP)}
    </div>
  `}function WiFiSTASection(e,n=!1){if(!e)return"";const i=n?"status-disabled":e.active?"status-active":"status-inactive",s=n?"Disabled":e.active?"Active":"Inactive";return html`
    <div class="panel-section">
      <div class="section-header">
        <h3 class="panel-section-title">Wi-Fi Client Interface</h3>
        <div class="status-badge ${i}">
          ${s}
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
  `}function WiFiAPSection(e){return e?html`
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
  `:""}function EthernetPanel(e,n){if(!e.networksInfo&&e.isConnected&&!e.isLoadingNetworks&&n("refresh-networks"),e.isConnected&&!e.ethConfigLoaded&&!e.isLoadingEthConfig&&n("load-eth-config"),e.isConnected&&!e.networkInterfacesConfig&&!e.isLoadingNetworkInterfacesConfig&&n("load-network-interfaces-config"),!e.networksInfo)return html`
      <div class="panel-container">
        <div class="panel-header">
          <h2>Ethernet Configuration</h2>
        </div>
        <div class="panel-loading">
          ${e.isConnected?"Loading Ethernet information...":"Connect to device to view Ethernet configuration"}
        </div>
      </div>
    `;const i=e.networksInfo.eth,s=e.ethStatus,o=s&&s.initialized?s:i&&i.mac?i:s||i,r=e.ethConfig||{},d=i!==null,a=e.networkInterfacesConfig?.ethernet===!1,c=o&&(o.mac||o.enabled||o.enable||o.initialized),l=o&&o.ip&&o.ip!=="0.0.0.0",p=o&&o.linkup===!0,u=l;if(!d)return html`
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
    `;const f=a?"status-disabled":u?"status-active":p?"status-warning":"status-inactive",h=a?"Disabled":u?"Connected":p?"Link Up (No IP)":c?"No Link":"Not Initialized";return html`
    <div class="panel-container">
      <div class="panel-header">
        <h2>Ethernet Configuration</h2>
      </div>
      
      <div class="panel-section">
        <div class="section-header">
          <h3 class="panel-section-title">Ethernet PHY Interface</h3>
          <div class="status-badge ${f}">
            ${h}
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
              <span class="info-value ${p?"status-yes":"status-no"}">
                ${p?"Cable Connected":"No Cable"}
              </span>
            </div>
            ${l?html`
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
      
      ${r?html`
        <div class="panel-section">
          <div class="section-header">
            <h3 class="panel-section-title">Configuration</h3>
          </div>
          
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Auto-Enable:</span>
              <span class="info-value ${r.enabled!==!1?"status-yes":"status-no"}">
                ${r.enabled!==!1?"Yes":"No"}
              </span>
            </div>
            <div class="info-item">
              <span class="info-label">DHCP:</span>
              <span class="info-value ${r.dhcp!==!1?"status-yes":"status-no"}">
                ${r.dhcp!==!1?"Enabled":"Static IP"}
              </span>
            </div>
            <div class="info-item">
              <span class="info-label">PHY Type:</span>
              <span class="info-value">${r.phy_type||"Auto"}</span>
            </div>
            <div class="info-item">
              <span class="info-label">PHY Address:</span>
              <span class="info-value">${r.phy_addr!==void 0?r.phy_addr:"Auto"}</span>
            </div>
            ${r.pins?html`
              <div class="info-item">
                <span class="info-label">MDC Pin:</span>
                <span class="info-value">GPIO ${r.pins.mdc}</span>
              </div>
              <div class="info-item">
                <span class="info-label">MDIO Pin:</span>
                <span class="info-value">GPIO ${r.pins.mdio}</span>
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
  `}function VPNPanel(e,n){e.isConnected&&!e.vpnConfigLoaded&&!e.isLoadingVpnConfig&&n("load-vpn-config");const i=e.vpnConfig||{hostname:"",join_code:"",auto_connect:!1},s=e.networksInfo?.vpn,o=e.isConnected,r=e.networksInfo&&s!==void 0;!r||s.available;const d=r&&s.active;return html`
    <div class="panel-container">
      <div class="panel-header">
        <h2>VPN Configuration</h2>
      </div>
      
      <!-- Module not available warning (only show when connected and confirmed unavailable) -->
      ${o&&r&&!s.available?html`
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
          <div class="status-badge ${d?"status-active":"status-inactive"}">
            ${d?"Connected":"Disconnected"}
          </div>
        </div>
        
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Status:</span>
            <span class="info-value ${d?"status-yes":"status-no"}">
              ${d?"Connected":"Not connected"}
            </span>
          </div>
          <div class="info-item">
            <span class="info-label">VPN IPv6 Address:</span>
            <span class="info-value info-mono">${d&&s?.ip?s.ip:"--"}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Hostname:</span>
            <span class="info-value">${s?.hostname||i.hostname||"--"}</span>
          </div>
        </div>
      </div>
      
      <!-- VPN Configuration Section -->
      <div class="panel-section">
        <div class="section-header">
          <h3 class="panel-section-title">Configuration</h3>
        </div>
        
        <form class="config-form" onsubmit=${a=>{a.preventDefault();const c=new FormData(a.target),l=c.get("hostname")||"",p=c.get("join_code")||"",u=c.get("auto_connect")==="on";if(!l.trim()){alert("Please enter a hostname for this device");return}if(!p.trim()){alert("Please enter a Husarnet join code");return}n("vpn-connect",{hostname:l.trim(),join_code:p.trim(),auto_connect:u})}}>
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
              value=${i.hostname||""}
              placeholder="e.g., my-esp32-device"
              ${d?"disabled":""}
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
              value=${i.join_code||""}
              placeholder="fc94:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx"
              ${d?"disabled":""}
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
                ${i.auto_connect?"checked":""}
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
            ${d?html`
              <button 
                type="button" 
                class="secondary-button danger" 
                onclick=${()=>n("vpn-disconnect")}
              >
                Disconnect VPN
              </button>
            `:html`
              <button type="submit" class="primary-button" disabled=${!o}>
                Connect to VPN
              </button>
              <button 
                type="button" 
                class="secondary-button" 
                disabled=${!o}
                onclick=${a=>{a.preventDefault();const c=a.target.closest("form"),l=new FormData(c);n("vpn-save-config",{hostname:l.get("hostname")||"",join_code:l.get("join_code")||"",auto_connect:l.get("auto_connect")==="on",enabled:!1})}}
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
        
        ${d&&s?.peers&&s.peers.length>0?html`
          <div class="peers-list">
            ${s.peers.map(a=>html`
              <div class="peer-item">
                <div class="peer-hostname">${a.hostname}</div>
                <div class="peer-ip info-mono">${a.ip}</div>
              </div>
            `)}
          </div>
        `:html`
          <p class="info-description">
            ${d?"No other peers discovered yet. Add more devices to your Husarnet network to see them here.":"Connect to VPN to discover peers on your network."}
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
  `}function BTLEPanel(e,n){if(!e.networksInfo&&e.isConnected&&!e.isLoadingNetworks&&n("refresh-networks"),!e.networksInfo)return html`
      <div class="panel-container">
        <div class="panel-header">
          <h2>Bluetooth LE Configuration</h2>
        </div>
        <div class="panel-loading">
          ${e.isConnected?"Loading Bluetooth LE information...":"Connect to device to view Bluetooth LE configuration"}
        </div>
      </div>
    `;const i=e.networksInfo.ble;return i?html`
    <div class="panel-container">
      <div class="panel-header">
        <h2>Bluetooth LE Configuration</h2>
      </div>
      
      <div class="panel-section">
        <div class="section-header">
          <h3 class="panel-section-title">Bluetooth LE Interface</h3>
          <div class="status-badge ${i.active?"status-active":"status-inactive"}">
            ${i.active?"Active":"Inactive"}
          </div>
        </div>
        
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">MAC Address:</span>
            <span class="info-value info-mono">${i.mac||"N/A"}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Status:</span>
            <span class="info-value">${i.active?"Enabled":"Disabled"}</span>
          </div>
        </div>
        
        <div class="config-actions">
          <button class="secondary-button" onclick=${()=>alert("Bluetooth configuration coming soon")}>
            ${i.active?"Configure":"Enable Bluetooth"}
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
    `}function WWANPanel(e,n){if(e.isConnected&&!e.wwanConfigLoaded&&!e.isLoadingWwanConfig&&n("load-wwan-config"),e.isConnected&&!e.modemStatusLoaded&&!e.isLoadingModemStatus&&n("load-modem-status"),e.isConnected&&!e.networkInterfacesConfig&&!e.isLoadingNetworkInterfacesConfig&&n("load-network-interfaces-config"),e.networkInterfacesConfig?.wwan===!1)return html`
      <div class="panel-container">
        <div class="panel-header">
          <h2>WWAN/Mobile Data</h2>
        </div>
        <div class="panel-section">
          <div class="section-header">
            <h3 class="panel-section-title">Interface Status</h3>
            <div class="status-badge status-disabled">Disabled</div>
          </div>
          <div class="panel-message" style="margin: 16px 0;">
            <p>WWAN interface is disabled in system settings.</p>
            <p style="color: var(--text-secondary); font-size: 0.9em; margin-top: 8px;">
              To enable, go to System → Settings → Network Interfaces.
            </p>
          </div>
        </div>
      </div>
    `;const s=e.wwanConfig||{},o=e.modemStatus||{},r=o.ppp||{};let d="Disabled",a="status-disabled";return s.mobile_data_enabled&&(r.connected?(d="Connected",a="status-connected"):r.connecting?(d="Connecting...",a="status-connecting"):o.connected?(d="Standby (WiFi OK)",a="status-standby"):(d="Waiting for modem...",a="status-waiting")),html`
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
            <label class="toggle-switch ${r.connected?"ppp-active":r.connecting?"ppp-connecting":""}">
              <input 
                type="checkbox" 
                ${s.mobile_data_enabled?"checked":""}
                onchange=${c=>{c.target.checked?n("enable-mobile-data"):n("disable-mobile-data")}}
                disabled=${!e.isConnected}
              />
              <span class="toggle-slider"></span>
            </label>
            <span class="toggle-label">Enable Mobile Data</span>
          </div>
          
          <div class="status-row">
            <span class="status-label">Status:</span>
            <span class="status-value ${a}">${d}</span>
          </div>
          
          ${r.connected&&r.ip?html`
            <div class="ip-row">
              <span class="ip-label">IP Address:</span>
              <span class="ip-value">${r.ip}</span>
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
        
        <form class="config-form" onsubmit=${c=>{c.preventDefault();const l=new FormData(c.target),p={apn:l.get("apn")||"",username:l.get("username")||"",password:l.get("password")||"",auto_init_modem:l.get("auto_init_modem")==="on",mobile_data_enabled:s.mobile_data_enabled||!1};n("save-wwan-config",p)}}>
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
              value=${s.apn||""}
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
              value=${s.username||""}
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
              value=${s.password||""}
              placeholder="Optional"
            />
          </div>
          
          <div class="form-group">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                name="auto_init_modem" 
                ${s.auto_init_modem!==!1?"checked":""}
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
  `}function MQTTPanel(e,n){e.isConnected&&!e.mqttConfigLoaded&&!e.isLoadingMqttConfig&&n("load-mqtt-config");const i=e.mqttConfig||{};return html`
    <div class="panel-container">
      <div class="panel-header">
        <h2>MQTT Configuration</h2>
      </div>
      
      <div class="panel-section">
        <div class="section-header">
          <h3 class="panel-section-title">MQTT Broker Settings</h3>
        </div>
        
        <form class="config-form" onsubmit=${s=>{s.preventDefault();const o=new FormData(s.target),r={server:o.get("server")||"",port:parseInt(o.get("port")||"1883"),username:o.get("username")||"",password:o.get("password")||"",tls:o.get("tls")==="on",ca_cert_path:o.get("ca_cert_path")||"",topic_prefix:o.get("topic_prefix")||""};if(!r.server){alert("Server address is required");return}n("save-mqtt-config",r)}}>
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
              value=${i.server||""}
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
              value=${i.port||1883}
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
              value=${i.username||""}
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
              value=${i.password||""}
              placeholder="Optional"
            />
          </div>
          
          <div class="form-group">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                name="tls" 
                ${i.tls?"checked":""}
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
              value=${i.ca_cert_path||""}
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
              value=${i.topic_prefix||"ovms/"}
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
    </div>
  `}function NTPPanel(e,n){e.isConnected&&!e.ntpConfigLoaded&&!e.isLoadingNtpConfig&&n("load-ntp-config");const i=e.ntpConfig||{server:"pool.ntp.org",tzOffset:0,timezone:"UTC",autoDetect:!1},s=e.ntpSyncResult||null,o=l=>{if(!l)return"--:--:--";const{year:p,month:u,day:f,hour:h,minute:m,second:v}=l;return`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(v).padStart(2,"0")}`},r=l=>{if(!l)return"";const{year:p,month:u,day:f}=l;return`${p}-${String(u).padStart(2,"0")}-${String(f).padStart(2,"0")}`},d=[{value:"UTC",offset:0,label:"UTC (Coordinated Universal Time)"},{value:"EST",offset:-5,label:"EST (Eastern Standard Time)"},{value:"CST",offset:-6,label:"CST (Central Standard Time)"},{value:"MST",offset:-7,label:"MST (Mountain Standard Time)"},{value:"PST",offset:-8,label:"PST (Pacific Standard Time)"},{value:"GMT",offset:0,label:"GMT (Greenwich Mean Time)"},{value:"CET",offset:1,label:"CET (Central European Time)"},{value:"EET",offset:2,label:"EET (Eastern European Time)"},{value:"JST",offset:9,label:"JST (Japan Standard Time)"},{value:"AEST",offset:10,label:"AEST (Australian Eastern Standard Time)"}],a=i.timezone,c=[...d];return a&&!d.find(l=>l.value===a)&&c.unshift({value:a,offset:i.tzOffset||0,label:`${a} (Detected)`}),html`
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
            <span class="info-label">Local Time:</span>
            <span class="info-value">
              ${s&&s.local?`${r(s.local)} ${o(s.local)}`:"--:--:--"}
            </span>
          </div>
          <div class="info-item">
            <span class="info-label">UTC Time:</span>
            <span class="info-value">
              ${s&&s.utc?`${r(s.utc)} ${o(s.utc)}`:"--:--:--"}
            </span>
          </div>
        </div>
        ${s?html`
          <p class="info-description" style="margin-top: 12px; font-size: 12px; color: var(--text-secondary);">
            Last synchronized: ${new Date(s.timestamp).toLocaleTimeString()}
          </p>
        `:""}
      </div>
      
      <div class="panel-section">
        <div class="section-header">
          <h3 class="panel-section-title">NTP Configuration</h3>
        </div>
        
        <form class="config-form" onsubmit=${async l=>{l.preventDefault();const p=new FormData(l.target),u=p.get("server")||"pool.ntp.org",f=p.get("timezone")||"UTC",h=p.get("auto_detect")==="on",m=c.find(w=>w.value===f),v=m?m.offset:0,y={server:u,tz_offset:v,timezone:f,auto_detect:h};try{await new Promise((w,S)=>{const x=setTimeout(()=>S(new Error("Save timeout")),1e4),E=()=>{clearTimeout(x),window.appInstance.emitter.removeListener("ntp-config-saved",b),window.appInstance.emitter.removeListener("ntp-config-save-error",k)},b=()=>{E(),w()},k=C=>{E(),S(C)};window.appInstance.emitter.once("ntp-config-saved",b),window.appInstance.emitter.once("ntp-config-save-error",k),n("save-ntp-config",y)}),n("sync-ntp-time",u,v,h)}catch(w){console.error("[NTP] Failed to save config before sync:",w),alert(`Failed to save NTP configuration: ${w.message}`)}}}>
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
              value=${i.server||"pool.ntp.org"}
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
              ${c.map(l=>html`
                <option value=${l.value} ${i.timezone===l.value?"selected":""}>
                  ${l.label}
                </option>
              `)}
            </select>
          </div>
          
          <div class="form-group">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                name="auto_detect"
                ${i.autoDetect?"checked":""}
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
          
          <div class="config-actions">
            <button type="submit" class="primary-button" disabled=${!e.isConnected}>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  `}function CANPanel(e,n){e.isConnected&&!e.canConfigLoaded&&!e.isLoadingCanConfig&&n("load-can-config");const i=e.canConfig||{bitrate:5e5,enabled:!0};return html`
    <div class="panel-container">
      <div class="panel-header">
        <h2>CAN/TWAI Configuration</h2>
      </div>
      
      <div class="panel-section">
        <div class="panel-section">
          <div class="section-header">
            <h3 class="panel-section-title">Protocol Settings</h3>
            <div class="status-badge ${i.enabled?"status-active":"status-inactive"}">
              ${i.enabled?"Enabled":"Disabled"}
            </div>
          </div>
          
          <form class="config-form" onsubmit=${async s=>{s.preventDefault();const o=new FormData(s.target),r={bitrate:parseInt(o.get("bitrate")||"500000"),enabled:o.get("enabled")==="on"};n("save-can-config",r)}}>
          <div class="form-group">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                name="enabled" 
                ${i.enabled?"checked":""}
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
              <option value="125000" ${i.bitrate===125e3?"selected":""}>125 kbps</option>
              <option value="250000" ${i.bitrate===25e4?"selected":""}>250 kbps</option>
              <option value="500000" ${i.bitrate===5e5?"selected":""}>500 kbps</option>
              <option value="1000000" ${i.bitrate===1e6?"selected":""}>1 Mbps</option>
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
            <span class="info-value">${i.txPin!=null?"GPIO"+i.txPin:"Not configured"}</span>
          </div>
          <div class="info-item">
            <span class="info-label">RX Pin:</span>
            <span class="info-value">${i.rxPin!=null?"GPIO"+i.rxPin:"Not configured"}</span>
          </div>
        </div>
      </div>
    </div>
  `}function GPSPanel(e,n){e.isConnected&&!e.gpsDataLoaded&&!e.isLoadingGpsData&&n("load-gps-data");const i=e.gpsData||{},s=i.latitude!==void 0&&i.longitude!==void 0,o=37.3349,r=-122.009,d=s?i.latitude:o,a=s?i.longitude:r;return html`
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
            <h3 class="panel-section-title">${s?"Current Location":"Map Display"}</h3>
            <div class="status-badge ${s?"status-active":"status-inactive"}">
              ${s?"GPS Fix Acquired":"No GPS Fix"}
            </div>
          </div>
          
          <!-- Map Container (always shown) -->
          <div class="gps-map-container">
            ${s?"":html`
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
              src=${`https://www.openstreetmap.org/export/embed.html?bbox=${a-.01},${d-.01},${a+.01},${d+.01}&layer=mapnik&marker=${d},${a}`}
            >
            </iframe>
            <br/>
            <small>
              <a 
                href=${`https://www.openstreetmap.org/?mlat=${d}&mlon=${a}&zoom=15`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Larger Map
              </a>
            </small>
          </div>
            
            <!-- GPS Information Grid -->
            <div class="info-grid" style="margin-top: 1rem;">
              ${s?html`
                <div class="info-item">
                  <span class="info-label">Latitude:</span>
                  <span class="info-value info-mono">${i.latitude.toFixed(6)}°</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Longitude:</span>
                  <span class="info-value info-mono">${i.longitude.toFixed(6)}°</span>
                </div>
              `:html`
                <div class="info-item">
                  <span class="info-label">Latitude:</span>
                  <span class="info-value info-mono" style="color: #999;">${d.toFixed(6)}° (default)</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Longitude:</span>
                  <span class="info-value info-mono" style="color: #999;">${a.toFixed(6)}° (default)</span>
                </div>
              `}
              ${i.altitude!==void 0?html`
                <div class="info-item">
                  <span class="info-label">Altitude:</span>
                  <span class="info-value">${i.altitude.toFixed(1)} m</span>
                </div>
              `:""}
              ${i.satellites!==void 0?html`
                <div class="info-item">
                  <span class="info-label">Satellites:</span>
                  <span class="info-value">${i.satellites}</span>
                </div>
              `:""}
              ${i.speed!==void 0?html`
                <div class="info-item">
                  <span class="info-label">Speed:</span>
                  <span class="info-value">${i.speed.toFixed(1)} km/h</span>
                </div>
              `:""}
              ${i.heading!==void 0?html`
                <div class="info-item">
                  <span class="info-label">Heading:</span>
                  <span class="info-value">${i.heading.toFixed(1)}°</span>
                </div>
              `:""}
              ${i.date?html`
                <div class="info-item">
                  <span class="info-label">Date:</span>
                  <span class="info-value info-mono">${formatDate(i.date)}</span>
                </div>
              `:""}
              ${i.time?html`
                <div class="info-item">
                  <span class="info-label">Time:</span>
                  <span class="info-value info-mono">${formatTime(i.time)}</span>
                </div>
              `:""}
            </div>
            
            <!-- Google Maps Link -->
            <div class="config-actions" style="margin-top: 1rem;">
              <a 
                href=${`https://www.google.com/maps?q=${d},${a}`}
                target="_blank"
                rel="noopener noreferrer"
                class="primary-button"
                style="text-decoration: none; display: inline-block;"
              >
                Open in Google Maps
              </a>
            </div>
          </div>
          
          ${s?"":html`
            <div class="panel-section" style="margin-top: 1rem;">
              <div class="section-header">
                <h3 class="panel-section-title">GPS Status</h3>
              </div>
              <p class="info-description">
                GPS is enabled but no fix has been acquired yet. This can take 30-60 seconds for a cold start.
                Make sure the GPS antenna has a clear view of the sky.
              </p>
              ${i.satellites!==void 0?html`
                <div class="info-grid" style="margin-top: 1rem;">
                  <div class="info-item">
                    <span class="info-label">Satellites in View:</span>
                    <span class="info-value">${i.satellites}</span>
                  </div>
                </div>
              `:""}
            </div>
          `}
      `}
      
    </div>
  `}function formatDate(e){if(!e||e.length!==6)return e;const n=e.substring(0,2),i=e.substring(2,4),s="20"+e.substring(4,6);return`${n}/${i}/${s}`}function formatTime(e){if(!e)return e;const n=e.indexOf("."),i=n!==-1?e.substring(0,n):e;if(i.length!==6)return e;const s=i.substring(0,2),o=i.substring(2,4),r=i.substring(4,6);return`${s}:${o}:${r}`}function ModemPanel(e,n){e.isConnected&&!e.modemStatusLoaded&&!e.isLoadingModemStatus&&n("load-modem-status");const i=e.modemStatus||{},s=i.info||{},o=i.signal||{},r=i.ppp||{},d=o.dbm,a=rssiToBars(d),c=rssiToQuality(d),l=getSignalColor(d);let p="Not detected",u="status-disconnected";return i.connected&&(r.connected?(p="PPP Active",u="status-ppp"):r.connecting?(p="PPP Connecting...",u="status-connecting"):(p="Connected (AT)",u="status-connected")),html`
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
          <span class="status-indicator ${u}"></span>
          <span class="status-text">${p}</span>
        </div>
        ${r.connected&&r.ip?html`
          <div class="ip-display">
            <span class="ip-label">IP Address:</span>
            <span class="ip-value">${r.ip}</span>
          </div>
        `:""}
      </div>
      
      <!-- Signal Strength -->
      <div class="panel-section">
        <div class="section-header">
          <h3 class="panel-section-title">Signal Strength</h3>
        </div>
        ${i.connected?html`
          <div class="signal-display">
            <div class="signal-bars">
              ${[1,2,3,4,5].map(f=>html`
                <div class="signal-bar ${f<=a?"active":""}" style="--bar-color: ${l}"></div>
              `)}
            </div>
            <div class="signal-info">
              ${d!=null&&d!==-999?html`
                <span class="signal-dbm" style="color: ${l}">${d} dBm</span>
                <span class="signal-quality">${c}</span>
              `:html`
                <span class="signal-unknown">Unknown</span>
              `}
            </div>
          </div>
          ${o.rssi!=null?html`
            <div class="signal-raw">
              <span>RSSI: ${o.rssi}</span>
              ${o.ber!=null?html`<span>BER: ${o.ber}</span>`:""}
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
        ${i.connected&&Object.keys(s).length>0?html`
          <div class="info-grid">
            ${s.manufacturer?html`
              <div class="info-row">
                <span class="info-label">Manufacturer</span>
                <span class="info-value">${s.manufacturer}</span>
              </div>
            `:""}
            ${s.model?html`
              <div class="info-row">
                <span class="info-label">Model</span>
                <span class="info-value">${s.model}</span>
              </div>
            `:""}
            ${s.revision?html`
              <div class="info-row">
                <span class="info-label">Revision</span>
                <span class="info-value">${s.revision}</span>
              </div>
            `:""}
            ${s.imei?html`
              <div class="info-row">
                <span class="info-label">IMEI</span>
                <span class="info-value mono">${s.imei}</span>
              </div>
            `:""}
            ${i.firmware?html`
              <div class="info-row">
                <span class="info-label">Firmware</span>
                <span class="info-value">${i.firmware}</span>
              </div>
            `:""}
          </div>
        `:html`
          <p class="no-data">${i.connected?"Loading...":"Modem not connected"}</p>
        `}
      </div>
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
  `}function rssiToBars(e){return e==null||e===-999?0:e>=-70?5:e>=-80?4:e>=-90?3:e>=-100?2:e>=-110?1:0}function rssiToQuality(e){return e==null||e===-999?"Unknown":e>=-70?"Excellent":e>=-80?"Good":e>=-90?"Fair":e>=-100?"Poor":"Very Poor"}function getSignalColor(e){return e==null||e===-999?"var(--text-secondary)":e>=-70||e>=-80?"#22c55e":e>=-90||e>=-100?"#f59e0b":"#ef4444"}function SDCardPanel(e,n){const i=e.boardConfig,s=i?.hardware?.sdcard,o=i?.sdmmc?.sdcard;return s&&e.isConnected&&!e.sdcardInfo&&!e.isLoadingSdcardInfo&&n("sdcard-get-info"),e.isConnected?s?html`
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
      
      ${BoardSDCardHardwareSection(s,o)}
      
      <div class="sdcard-layout">
        ${e.sdcardInfo?html`
          <div class="panel-section">
            <h3 class="panel-section-title">
              ${e.sdcardInfo.error?"SD Card Status":"SD Card Partitions"}
            </h3>
            ${e.sdcardInfo.error?html`
              <div class="info-grid">
                <div class="info-item" style="grid-column: 1 / -1; border-left: 3px solid #dc3545;">
                  <span class="info-label">Not Mounted</span>
                  <span class="info-value">${e.sdcardInfo.error}</span>
                </div>
              </div>
            `:html`
              <div class="partitions-table">
                <div class="partition-header">
                  <span class="partition-name">Name</span>
                  <span class="partition-type">Type</span>
                  <span class="partition-size">Size</span>
                </div>
                ${e.sdcardInfo.cardCapacity?html`
                  <div class="partition-row">
                    <span class="partition-name">💳 SD Card</span>
                    <span class="partition-type">Physical</span>
                    <span class="partition-size">${formatBytes(e.sdcardInfo.cardCapacity)}</span>
                  </div>
                `:""}
                <div class="partition-row">
                  <span class="partition-name">📁 /sd</span>
                  <span class="partition-type">FAT32</span>
                  <span class="partition-size">${formatBytes(e.sdcardInfo.totalSize)}</span>
                </div>
                <div class="partition-row" style="padding-left: 32px;">
                  <span class="partition-name">Used</span>
                  <span class="partition-type"></span>
                  <span class="partition-size">${formatBytes(e.sdcardInfo.usedSize)}</span>
                </div>
                <div class="partition-row" style="padding-left: 32px;">
                  <span class="partition-name">Free</span>
                  <span class="partition-type"></span>
                  <span class="partition-size">${formatBytes(e.sdcardInfo.freeSize)}</span>
                </div>
                ${e.sdcardInfo.cardCapacity&&e.sdcardInfo.cardCapacity>e.sdcardInfo.totalSize?html`
                  <div class="partition-row" style="color: var(--text-secondary); opacity: 0.7;">
                    <span class="partition-name">⚠️ Unallocated</span>
                    <span class="partition-type">—</span>
                    <span class="partition-size">${formatBytes(e.sdcardInfo.cardCapacity-e.sdcardInfo.totalSize)}</span>
                  </div>
                `:""}
              </div>
            `}
          </div>
        `:e.isLoadingSdcardInfo?html`
          <div class="panel-section">
            <div class="panel-loading">Loading storage information...</div>
          </div>
        `:""}
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
    `}function BoardSDCardHardwareSection(e,n){if(!e)return"";const i=n||{},s=e.power_control||{},o=e.mode||"SD";let r=e.bus_width||1;e.bus_width||(i.d3!==void 0?r=4:i.d0!==void 0?r=1:o==="SD"&&(r=4));const d=o==="SD"?"SDMMC":o;return html`
    <div class="panel-section">
      <div class="section-header">
        <h3 class="panel-section-title">Board Hardware Configuration</h3>
      </div>
      
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">Mode:</span>
          <span class="info-value">${d}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Width:</span>
          <span class="info-value">${r}-bit</span>
        </div>
      </div>
      
      <div style="margin-top: 12px;">
        <details>
          <summary style="cursor: pointer; color: var(--text-secondary); font-size: 14px;">
            Pin Configuration
          </summary>
          <div class="info-grid" style="margin-top: 8px;">
            ${i.cmd!==void 0?html`
              <div class="info-item">
                <span class="info-label">CMD:</span>
                <span class="info-value info-mono">GPIO ${i.cmd}</span>
              </div>
            `:""}
            ${i.clk!==void 0?html`
              <div class="info-item">
                <span class="info-label">CLK:</span>
                <span class="info-value info-mono">GPIO ${i.clk}</span>
              </div>
            `:""}
            ${i.d0!==void 0?html`
              <div class="info-item">
                <span class="info-label">D0:</span>
                <span class="info-value info-mono">GPIO ${i.d0}</span>
              </div>
            `:""}
            ${i.d1!==void 0?html`
              <div class="info-item">
                <span class="info-label">D1:</span>
                <span class="info-value info-mono">GPIO ${i.d1}</span>
              </div>
            `:""}
            ${i.d2!==void 0?html`
              <div class="info-item">
                <span class="info-label">D2:</span>
                <span class="info-value info-mono">GPIO ${i.d2}</span>
              </div>
            `:""}
            ${i.d3!==void 0?html`
              <div class="info-item">
                <span class="info-label">D3:</span>
                <span class="info-value info-mono">GPIO ${i.d3}</span>
              </div>
            `:""}
            ${s.pin!==void 0?html`
              <div class="info-item">
                <span class="info-label">Power:</span>
                <span class="info-value info-mono">GPIO ${s.pin} ${s.active_low?"(Active Low)":"(Active High)"}</span>
              </div>
            `:""}
          </div>
        </details>
      </div>
    </div>
  `}function formatBytes(e){if(!e||e===0)return"0 B";const n=1024,i=["B","KB","MB","GB"],s=Math.floor(Math.log(e)/Math.log(n));return Math.round(e/Math.pow(n,s)*100)/100+" "+i[s]}const REGISTRY_BASE="/boards",CHIP_VARIANT_MAP={"ESP32-S3":{base:"ESP32_S3_8",variants:["ESP32_S3_8","ESP32_S3_8_OCT","ESP32_S3_16","ESP32_S3_32"]},"ESP32-P4":{base:"ESP32_P4_16",variants:["ESP32_P4_16","ESP32_P4_32"]}};async function fetchFirmwareInfo(){try{const e=await fetch(`${REGISTRY_BASE}/firmware/latest.json`);if(!e.ok)throw new Error(`Registry error: ${e.status}`);return await e.json()}catch(e){throw console.error("[firmware-flasher] Failed to fetch firmware info:",e),e}}async function selectFirmwareVariant(e,n=0,i=null){const s=CHIP_VARIANT_MAP[e];if(!s)return console.warn(`[firmware-flasher] No firmware mapping for chip: ${e}`),null;const o=typeof n=="string"?parseInt(n):n;let r=s.base;e==="ESP32-S3"?o>=32?r="ESP32_S3_32":o>=16?r="ESP32_S3_16":i==="octal"&&(r="ESP32_S3_8_OCT"):e==="ESP32-P4"&&o>=32&&(r="ESP32_P4_32");try{const a=await fetchFirmwareInfo(),c=(a.variants||[]).find(l=>l.id===r);if(c&&c.url)return{id:c.id,file:c.file,url:c.url,displayName:c.id.replace(/_/g," "),version:a.micropython_version||a.version,platformVersion:a.version}}catch(a){console.warn("[firmware-flasher] Could not fetch latest.json, using fallback URL:",a)}const d=`${r}-merged.bin`;return{id:r,file:d,url:`${REGISTRY_BASE}/firmware/${d}`,displayName:r.replace(/_/g," ")}}async function fetchBoardManifests(e=null){try{const n=await fetch(`${REGISTRY_BASE}/manifests/index.json`);if(!n.ok)throw new Error(`Registry error: ${n.status}`);let s=(await n.json()).boards||[];return e&&(s=s.filter(o=>o.chip===e)),s}catch(n){throw console.error("[firmware-flasher] Failed to fetch board manifests:",n),n}}async function fetchBoardManifest(e){try{const n=await fetch(`${REGISTRY_BASE}/manifests/${e}.json`);if(!n.ok)throw new Error(`Manifest not found: ${e}`);return await n.json()}catch(n){throw console.error(`[firmware-flasher] Failed to fetch manifest for ${e}:`,n),n}}async function downloadFirmware(e,n=()=>{},i=0){try{const s=await fetch(e);if(!s.ok){const u=e.match(/([A-Z0-9_]+)-merged\.bin/),f=u?u[1]:"requested";throw s.status===404||s.status===503?new Error(`Firmware "${f}" is not available yet. The build may still be in progress — please try again in a few minutes.`):new Error(`Failed to download firmware: HTTP ${s.status}`)}const o=s.headers.get("content-length"),r=o?parseInt(o,10):0;if(!s.body){const u=await s.arrayBuffer();return n(100),u}const d=s.body.getReader(),a=[];let c=0;for(;;){const{done:u,value:f}=await d.read();if(u)break;a.push(f),c+=f.length;const h=i||r;h>0?n(Math.round(c/h*100)):n(Math.round(10+c/1e6%80))}const l=new Uint8Array(c);let p=0;for(const u of a)l.set(u,p),p+=u.length;return console.log(`[firmware-flasher] Downloaded ${(c/1024/1024).toFixed(1)} MB`),n(100),l.buffer}catch(s){throw console.error("[firmware-flasher] Download error:",s),s}}function showStyledModal({variant:e="",icon:n,title:i,subtitle:s,body:o,buttons:r}){const d=a=>a?a.includes("<")||/[\u{1F300}-\u{1F9FF}]/u.test(a)?a:`<svg class="icon icon-tabler" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><use href="#tabler-${a}"></use></svg>`:"";return new Promise(a=>{const c=document.createElement("div");c.className="fw-modal-overlay active",c.innerHTML=`
      <div class="fw-styled-modal">
        <div class="fw-styled-modal-header ${e?`fw-styled-modal-header--${e}`:""}">
          <div class="fw-styled-modal-icon">${d(n)}</div>
          <h2>${i}</h2>
          <p>${s}</p>
        </div>
        <div class="fw-styled-modal-content">
          <div class="fw-styled-modal-card">${o}</div>
          ${r.map(l=>`<button class="${l.class}" data-id="${l.id}">${l.icon||""}${l.label}</button>`).join("")}
        </div>
      </div>`,document.body.appendChild(c),r.forEach(l=>{c.querySelector(`[data-id="${l.id}"]`).addEventListener("click",()=>{c.remove(),a(l.id)})})})}function updateModalBody(e){const n=document.querySelector(".fw-styled-modal-card");n&&(n.innerHTML=e)}function closeStyledModal(){const e=document.querySelector(".fw-modal-overlay.active");e&&e.remove()}let currentPort=null,currentLoader=null,detectedChipName="",detectedMacAddress="",isBlankDevice=!0,ESPLoader=null,appState=null,panelState={view:"connect",deviceInfo:null,releases:[],selectedFirmware:null,flashProgress:0,wifiNetworks:[],selectedNetwork:null,credentials:null,logs:[{message:"> Ready",type:"info",timestamp:new Date().toLocaleTimeString()}],isFlashing:!1,isScanning:!1,terminalCollapsed:!1,reblessComplete:!1,reblessHostname:null,flashStep:"select",currentRelease:null,firmwareOptions:[],flashComplete:!1,boardOptions:[],selectedBoard:null,isNewDeviceFlow:!1};function addLog(e,n="info"){panelState.logs.push({message:`> ${e}`,type:n,timestamp:new Date().toLocaleTimeString()}),panelState.logs.length>100&&(panelState.logs=panelState.logs.slice(-100)),(n==="error"?console.error:n==="warning"?console.warn:console.log)(`[firmware-panel] ${e}`),triggerRerender()}function clearLog(){panelState.logs=[]}function triggerRerender(){document.dispatchEvent(new CustomEvent("firmware-panel-update"))}async function pulseReset(e){await e.setSignals({dataTerminalReady:!1,requestToSend:!1}),await new Promise(n=>setTimeout(n,50)),await e.setSignals({dataTerminalReady:!1,requestToSend:!0}),await new Promise(n=>setTimeout(n,100)),await e.setSignals({dataTerminalReady:!1,requestToSend:!1}),await new Promise(n=>setTimeout(n,100))}async function transitionToREPL(){currentLoader&&(await currentLoader.disconnect(),currentLoader=null,await new Promise(l=>setTimeout(l,100))),await currentPort.close(),await new Promise(l=>setTimeout(l,100)),await currentPort.open({baudRate:115200}),addLog("Resetting device..."),await pulseReset(currentPort),addLog("Waiting for System booting...");const e=currentPort.readable.getReader(),n=new TextDecoder;let i="";const s=Date.now();let o=!1,r=null;const d=[{pattern:/invalid header: 0x[0-9a-fA-F]+/i,message:"Invalid firmware header - incompatible image for this device"},{pattern:/flash read err/i,message:"Flash read error - firmware may be corrupted"},{pattern:/ets_main\.c/i,message:"Boot failure - firmware not recognized"},{pattern:/rst:0x10.*boot:0x[0-9a-f]+.*invalid/i,message:"Boot loop detected - firmware incompatible"}],c=panelState.deviceInfo?.chipFamily==="ESP32-P4"?15e3:8e3;for(;Date.now()-s<c;){const{value:l,done:p}=await e.read();if(p)break;if(l){i+=n.decode(l);for(const{pattern:u,message:f}of d)if(u.test(i)){r=f,console.log("[transitionToREPL] Boot error detected:",i);break}if(r)break;if(i.includes("System booting...")){o=!0,addLog("System booting detected","success"),e.releaseLock();const u=currentPort.writable.getWriter();await u.write(new Uint8Array([3,3,3])),await new Promise(f=>setTimeout(f,30)),await u.write(new Uint8Array([3,3])),u.releaseLock(),addLog("Interrupting to enter REPL...");break}}}if(!o)try{e.releaseLock()}catch{}if(r)return addLog(r,"error"),{success:!1,error:r,bootOutput:i};if(!o){addLog("No boot signature detected","error");const l=currentPort.writable.getWriter();return await l.write(new Uint8Array([3,3])),l.releaseLock(),{success:!1,error:"No boot signature from device - firmware may be incompatible",bootOutput:i}}await new Promise(l=>setTimeout(l,200)),addLog("Entering REPL mode...");try{const l=currentPort.readable.getReader(),p=setTimeout(()=>l.cancel(),500);try{for(;;){const{value:u,done:f}=await l.read();if(f)break}}catch{}clearTimeout(p),l.releaseLock()}catch(l){console.log("[DRAIN] Error:",l)}return addLog("REPL ready"),{success:!0}}async function handleBootFailure(e){await showStyledModal({variant:"danger",icon:'<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',title:"Boot Failure Detected",subtitle:"Incompatible firmware image",body:`<p><strong>${e}</strong></p><p>The device could not boot. This typically happens when the wrong firmware variant is flashed.</p>`,buttons:[{id:"reflash",class:"fw-styled-modal-btn-primary",icon:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" style="margin-right:0.5rem"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>',label:"Return to Bootloader"},{id:"close",class:"fw-styled-modal-btn-cancel",label:"Close"}]})==="reflash"&&(addLog("Returning to bootloader mode..."),addLog('Ready for re-flash. Select "Onboard New Device" to flash correct firmware.',"success")),panelState.view="scenarios",triggerRerender()}async function sendREPLCommand(e,n,i=15e3,s=!0,o=null){const r=e.writable.getWriter();try{const d=n.split(`
`).filter(v=>v.trim().length>0),a=Math.min(...d.map(v=>{const y=v.match(/^(\s*)/);return y?y[1].length:0})),c=d.map(v=>v.slice(a)).join(`
`);s&&(await r.write(new Uint8Array([1])),await new Promise(v=>setTimeout(v,100)));const l=new TextEncoder().encode(c),p=64;for(let v=0;v<l.length;v+=p){const y=l.slice(v,Math.min(v+p,l.length));await r.write(y),await new Promise(w=>setTimeout(w,10))}await new Promise(v=>setTimeout(v,50)),await r.write(new Uint8Array([4])),r.releaseLock();const u=e.readable.getReader();let f="";const h=new TextDecoder,m=Date.now();for(;Date.now()-m<i;){const{value:v,done:y}=await u.read();if(y||v&&(f+=h.decode(v),f.includes("OK")&&f.endsWith(">")))break}if(u.releaseLock(),o&&!f.includes(o))throw new Error(`REPL command failed (no "${o}" in output): ${f.slice(-300).trim()}`);return f}catch(d){try{r.releaseLock()}catch{}throw d}}const USB_BRIDGE_DB={6790:{vendorName:"QinHeng Electronics",products:{29986:{name:"CH340",maxBaudrate:460800},29987:{name:"CH340",maxBaudrate:460800},21971:{name:"CH343",maxBaudrate:6e6},21972:{name:"CH9102",maxBaudrate:6e6}}},4292:{vendorName:"Silicon Labs",products:{6e4:{name:"CP2102(n)",maxBaudrate:3e6},60016:{name:"CP2105",maxBaudrate:2e6}}},1027:{vendorName:"FTDI",products:{24577:{name:"FT232R",maxBaudrate:3e6},24592:{name:"FT2232",maxBaudrate:3e6},24597:{name:"FT230X",maxBaudrate:3e6}}},12346:{vendorName:"Espressif Systems",products:{2:{name:"ESP32-S2 Native USB",maxBaudrate:2e6},4097:{name:"ESP32 Native USB",maxBaudrate:2e6},16386:{name:"ESP32 Native USB (CDC)",maxBaudrate:2e6}}}},JEDEC_MANUFACTURERS={1:"Spansion/Infineon",11:"Samsung",28:"Eon/Puya",32:"Micron",104:"Atmel/Adesto",133:"Fudan",157:"ISSI",191:"Microchip/SST",194:"Macronix",200:"GigaDevice",239:"Winbond"},JEDEC_FLASH_PARTS={239:{16406:"W25Q32 (32 Mbit)",16407:"W25Q64 (64 Mbit)",16408:"W25Q128 (128 Mbit)",16409:"W25Q256 (256 Mbit)"},200:{16406:"GD25Q32 (32 Mbit)",16407:"GD25Q64 (64 Mbit)",16408:"GD25Q128 (128 Mbit)",16409:"GD25Q256 (256 Mbit)"},194:{16406:"MX25L3206 (32 Mbit)",16407:"MX25L6406 (64 Mbit)",16408:"MX25L12835 (128 Mbit)"}};function getUsbBridgeInfo(e){try{const n=e.getInfo?.();if(!n||typeof n.usbVendorId!="number")return null;const i=n.usbVendorId,s=n.usbProductId,o=USB_BRIDGE_DB[i];if(!o)return`Unknown (0x${i.toString(16).padStart(4,"0")})`;const r=o.products[s];return r?`${o.vendorName} - ${r.name} (0x${s.toString(16).toUpperCase()})`:`${o.vendorName} (0x${s?.toString(16).padStart(4,"0")||"????"})`}catch(n){return console.log("[getUsbBridgeInfo] Error:",n),null}}function getFlashDeviceInfo(e){if(!e||typeof e!="number")return null;const n=e&255,i=e>>8&255,s=e>>16&255,o=i<<8|s,r=JEDEC_MANUFACTURERS[n],d=JEDEC_FLASH_PARTS[n]?.[o];return r&&d?`${r} ${d}`:r?`${r} (0x${o.toString(16).toUpperCase()})`:`0x${e.toString(16).padStart(6,"0").toUpperCase()}`}async function detectHardware(e){ESPLoader||(ESPLoader=(await __vitePreload(()=>import("./tasmota-esptool.bundle-CejzY9o0.js"),[])).ESPLoader,console.log("[firmware-panel] ESPLoader module loaded"));const n={log:u=>console.log(u),debug:u=>console.debug(u),error:u=>console.error(u)},i=new ESPLoader(e,n),s=getUsbBridgeInfo(e);await i.initialize();const o=i.chipName||"Unknown";console.log("Connected to chip:",o);const r=i.macAddr(),d=Array.isArray(r)&&r.length>=6?r.slice(0,6).map(u=>u.toString(16).padStart(2,"0")).join(":"):"Unknown";let a=null;if(o?.includes("ESP32-S3"))try{const f=await i.readRegister(1610641492),h=f>>3&3,m=f>>7&3,v={0:null,1:"8MB",2:"2MB",3:"8MB+"},y={1:"AP Memory 3.3V",2:"AP Memory 1.8V"};if(h>0){const w=m===1;a={capacity:v[h]||"Unknown",vendor:y[m]||"",mode:w?"octal":"quad",display:`Embedded PSRAM ${v[h]||""}${y[m]?` (${y[m]})`:""}`},console.log("PSRAM detected:",a)}}catch(u){console.log("PSRAM eFuse detection not available:",u)}let c="Unknown",l=null,p=115200;try{console.log("Running stub...");const u=await i.runStub();await u.detectFlashSize(),c=u.flashSize||"Unknown",console.log("Flash size detected:",c);try{const f=await u.flashId?.();f&&(l=getFlashDeviceInfo(f),console.log("Flash device:",l))}catch(f){console.log("Flash ID detection not available:",f)}p=u.transport?.baudrate||921600,currentLoader=u}catch(u){console.warn("Stub/Feature detection failed:",u),c="Detection Failed",currentLoader=i}return{chipName:o,flashSizeMB:c,macAddress:d,usbBridge:s,flashDevice:l,connectionBaud:p,psramInfo:a}}async function handleConnect(){try{currentLoader&&(await currentLoader.disconnect(),currentLoader=null),currentPort&&(await currentPort.close(),currentPort=null)}catch(e){console.log("Cleanup previous connection:",e)}try{if(clearLog(),addLog("Requesting serial port..."),!navigator.serial){addLog("Error: Web Serial API is not available in this browser.","error"),addLog("Please use Google Chrome or Microsoft Edge (version 89+).","error");return}currentPort=await navigator.serial.requestPort({}),await currentPort.open({baudRate:115200}),addLog("Port opened"),addLog("Detecting hardware...");const e=await detectHardware(currentPort);detectedChipName=e.chipName,detectedMacAddress=e.macAddress,addLog(`Detected: ${detectedChipName}`),addLog(`MAC: ${detectedMacAddress}`),panelState.deviceInfo={chipName:detectedChipName,mac:detectedMacAddress,flashSize:e.flashSizeMB,usbBridge:e.usbBridge,flashDevice:e.flashDevice,connectionBaud:e.connectionBaud,psramInfo:e.psramInfo},isBlankDevice=!0;const n=sessionStorage.getItem("extension-install-active");n?(addLog(`Extension install: ${n} — skipping to flash`),selectScenario("new-device")):(panelState.view="scenarios",addLog("Device connected - select an action")),appState&&(appState.connectionMode="usb"),triggerRerender()}catch(e){if(console.error("[firmware-panel]",e),addLog(`Error: ${e.message}`,"error"),currentPort){try{await currentPort.close()}catch{}try{await currentPort.forget()}catch{}}currentPort=null,currentLoader=null,triggerRerender()}}async function handleDisconnect(){try{if(currentLoader&&(await currentLoader.disconnect(),currentLoader=null),currentPort){try{await pulseReset(currentPort)}catch(e){console.log("[handleDisconnect] Reset error:",e)}await currentPort.close(),currentPort=null}}catch{}panelState.view="connect",panelState.deviceInfo=null,detectedChipName="",detectedMacAddress="",isBlankDevice=!0,appState&&(appState.connectionMode=null),clearLog(),addLog("Disconnected"),triggerRerender()}async function resetAndClosePort(){try{if(currentLoader&&(await currentLoader.disconnect(),currentLoader=null),currentPort){try{await pulseReset(currentPort)}catch(e){console.log("[resetAndClosePort] Reset error:",e)}await currentPort.close(),currentPort=null}}catch(e){console.log("[resetAndClosePort] Error:",e)}}function selectScenario(e){addLog(`Selected: ${e}`),panelState.view=e,e==="new-device"?loadFirmwareOptions():e==="forgot-credentials"?readCredentials():e==="change-wifi"?performWifiSetup():e==="re-provision"&&startRebless(),triggerRerender()}function goBack(){panelState.flashStep="select",panelState.flashComplete=!1,panelState.flashProgress=0,panelState.view="scenarios",triggerRerender()}async function loadFirmwareOptions(){try{addLog("Selecting firmware variant..."),panelState.flashStep="select",panelState.firmwareOptions=[],triggerRerender();const e=panelState.deviceInfo?.chipName?.includes("ESP32-S3")?"ESP32-S3":panelState.deviceInfo?.chipName?.includes("ESP32-P4")?"ESP32-P4":null;if(!e){addLog("Unknown chip family - cannot select firmware","error");return}const n=panelState.deviceInfo?.flashSize,i=panelState.deviceInfo?.psramInfo?.mode||null,s=await selectFirmwareVariant(e,n,i);if(!s){addLog(`No firmware available for ${e}`,"error");return}panelState.selectedFirmware=s,panelState.firmwareOptions=[s],addLog(`Selected: ${s.displayName}`);try{const o=await fetchBoardManifests(e);panelState.boardOptions=o;const r=e==="ESP32-S3"?"generic_esp32s3":"generic_esp32p4";panelState.selectedBoard=o.find(d=>d.id===r)||o[0]||null}catch(o){console.warn("[firmware-panel] Could not load board manifests:",o),panelState.boardOptions=[],panelState.selectedBoard=null}triggerRerender()}catch(e){addLog(`Error: ${e.message}`,"error"),triggerRerender()}}async function startFlash(){if(!currentLoader){addLog("Error: No device connected","error");return}if(!panelState.selectedFirmware){addLog("Error: No firmware selected","error");return}if(!confirm(`⚠️ FLASH FIRMWARE ⚠️

This will ERASE all data on the device and install:
${panelState.selectedFirmware.displayName}

Any existing scripts, settings, and certificates will be PERMANENTLY DELETED.

Are you sure you want to continue?`)){addLog("Flash cancelled by user");return}try{panelState.flashStep="downloading",panelState.flashProgress=0,triggerRerender(),addLog(`Downloading ${panelState.selectedFirmware.displayName}...`);const n=panelState.deviceInfo?.flashSize||"",i=parseFloat(n)*1024*1024||0,s=await downloadFirmware(panelState.selectedFirmware.url,o=>{panelState.flashProgress=o,o%20===0&&addLog(`Download: ${o}%`),triggerRerender()},i);addLog(`Downloaded ${(s.byteLength/1024/1024).toFixed(1)} MB`),panelState.flashStep="flashing",panelState.flashProgress=0,triggerRerender(),addLog("Syncing with device...");try{await currentLoader.sync()}catch{await currentLoader.initialize()}addLog("Flashing firmware...");try{await currentLoader.flashData(s,(o,r)=>{const d=Math.floor(o/r*100);panelState.flashProgress=d,d%10===0&&addLog(`Progress: ${d}%`),triggerRerender()},0,!0)}catch(o){const r=o?.message||String(o),d=parseFloat(panelState.deviceInfo?.flashSize)||8,a=d>=32?85:d>=16?90:95;if(r.includes("Timed out")&&panelState.flashProgress>=a)addLog(`⚠ Flash timed out at ${panelState.flashProgress}% — large flash chips can stall during cache flush.`,"warning"),addLog("Reconnect to verify. If device boots normally, the flash succeeded.","warning");else throw o}addLog("✓ Flash complete!","success");try{await currentLoader.disconnect()}catch{}currentLoader=null,panelState.flashStep="complete",panelState.flashComplete=!0,panelState.terminalCollapsed=!0,triggerRerender()}catch(n){console.error("[firmware-panel] Flash error:",n),addLog(`Flash failed: ${n.message}`,"error");const i=panelState.flashStep==="flashing";if(panelState.flashStep="select",i){try{currentPort&&await currentPort.close()}catch{}currentPort=null,currentLoader=null}triggerRerender()}}async function proceedToWifiSetup(){addLog("Proceeding to WiFi setup..."),panelState.flashStep="select",panelState.flashComplete=!1,panelState.flashProgress=0,panelState.isNewDeviceFlow=!0,panelState.view="change-wifi";try{if(!currentPort){addLog("Please reconnect device"),panelState.view="connect",triggerRerender();return}performWifiSetup()}catch(e){addLog(`Error: ${e.message}`,"error")}triggerRerender()}async function readCredentials(){try{addLog("Reading credentials from device...");const e=await transitionToREPL();if(!e.success){await handleBootFailure(e.error);return}const i=(await sendREPLCommand(currentPort,`
import json
from lib.sys import settings
hostname = settings.get("device.hostname", "unknown")
password = settings.get("server.webrepl_password", "not set")
ssid = settings.get("wifi.ssid", "not set")
print("CREDS:" + json.dumps({"h": hostname, "p": password, "s": ssid}))
`)).match(/CREDS:(\{.*\})/);if(i){const s=JSON.parse(i[1]);panelState.credentials={hostname:s.h+".local",password:s.p,ssid:s.s},addLog(`Found: ${s.h}.local`,"success")}else throw new Error("Could not read settings - device may need firmware");triggerRerender()}catch(e){addLog(`Error: ${e.message}`,"error"),triggerRerender()}}async function performWifiSetup(){clearLog();try{let a=function(c){return new Promise((l,p)=>{const u=document.createElement("div");u.className="fw-modal-overlay active",u.innerHTML=`
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
              ${c.map((v,y)=>`
                <button class="fw-modal-network-item" data-index="${y}">
                  <span class="fw-network-name">${v.ssid}</span>
                  <span class="fw-network-info">
                    ${v.sec?'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>':""}
                    <span class="fw-network-rssi">${v.rssi} dBm</span>
                  </span>
                </button>
              `).join("")}
            </div>
            <button class="fw-modal-cancel">Cancel</button>
          </div>
        `,document.body.appendChild(u);const f=v=>{const y=v.target.closest(".fw-modal-network-item");if(y){const w=parseInt(y.dataset.index);m(),l(w)}},h=()=>{m(),p(new Error("Setup cancelled"))},m=()=>{u.remove()};u.querySelector(".fw-network-modal-list").addEventListener("click",f),u.querySelector(".fw-modal-cancel").addEventListener("click",h)})};addLog("Connecting to REPL...");const e=await transitionToREPL();if(!e.success){await handleBootFailure(e.error);return}addLog("Scanning for WiFi networks...");const i=(await sendREPLCommand(currentPort,`
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
`)).match(/JSON:(\[.*\])/);if(!i)throw new Error("Failed to parse network scan - no JSON found");let s;try{s=JSON.parse(i[1])}catch(c){throw new Error("Failed to parse network JSON: "+c.message)}if(s.length===0)throw new Error("No WiFi networks found");addLog(`Found ${s.length} networks`);let o=!1,r=null,d=null;for(;!o;){const c=await a(s),l=s[c],p=prompt(`Enter password for "${l.ssid}":`);if(p===null)continue;addLog(`Connecting to "${l.ssid}"...`);const f=(await sendREPLCommand(currentPort,`
import time
try:
    wlan.disconnect()
except:
    pass
time.sleep(0.3)
wlan.connect('${l.ssid}', '${p}')
for i in range(20):
    if wlan.isconnected():
        ip = wlan.ifconfig()[0]
        print(f"CONNECTED:{ip}")
        break
    time.sleep(0.5)
else:
    print("FAILED:timeout")
`,15e3,!1)).match(/CONNECTED:(\d+\.\d+\.\d+\.\d+)/);if(f){r=f[1],o=!0,addLog(`Connected! IP: ${r}`),addLog("Saving settings...");const m=`pybot-${panelState.deviceInfo?.mac?panelState.deviceInfo.mac.replace(/:/g,"").slice(-4).toLowerCase():"xxxx"}`;if(await sendREPLCommand(currentPort,`
from lib.sys import settings
settings.set("wifi.ssid", "${l.ssid}")
settings.set("wifi.password", "${p}")
settings.set("server.https_enabled", True)
settings.set("device.hostname", "${m}")
settings.save()
print("SETTINGS_OK")
`,5e3,!1,"SETTINGS_OK"),addLog(`Settings saved (hostname: ${m})`,"success"),panelState.isNewDeviceFlow){panelState.isNewDeviceFlow=!1,panelState.savedHostname=m,addLog("Continuing to certificate generation..."),await continueToProvision(m);return}panelState.view="scenarios",triggerRerender();return}else if(addLog("Connection failed"),!confirm(`WiFi connection failed. Wrong password?

Click OK to try again, or Cancel to abort.`))throw new Error("Connection cancelled")}}catch(e){addLog(`Error: ${e.message}`,"error"),triggerRerender()}}async function continueToProvision(e){try{const n=e+".local";addLog("Generating HTTPS certificate..."),window.forge||await new Promise((a,c)=>{const l=document.createElement("script");l.src="https://cdn.jsdelivr.net/npm/node-forge@1.3.1/dist/forge.min.js",l.onload=a,l.onerror=()=>c(new Error("Failed to load forge")),document.head.appendChild(l)}),addLog(`Hostname: ${n}`);const{certPem:i,keyPem:s}=generateSelfSignedCert(n);if(addLog(`Certificate generated (${i.length} bytes)`),addLog("Installing certificate..."),await uploadCertsToDevice(currentPort,i,s),panelState.selectedBoard)try{addLog(`Installing board config: ${panelState.selectedBoard.name}...`);const a=await fetchBoardManifest(panelState.selectedBoard.id),c=JSON.stringify(a).replace(/\\/g,"\\\\").replace(/'/g,"\\'");await sendREPLCommand(currentPort,`
import json
try:
    import os
    os.mkdir('/settings')
except:
    pass
with open('/settings/board.json', 'w') as f:
    f.write('${c}')
print("BOARD_OK")
`,1e4,!1,"BOARD_OK"),addLog("Board config installed","success")}catch(a){addLog(`Warning: Could not install board config: ${a.message}`,"error")}const o=localStorage.getItem("pending-extension-id");if(o){localStorage.removeItem("pending-extension-id");try{addLog(`Pre-installing extension: ${o}...`);const a=new ExtensionRegistry,l=(await a.loadIndex("https://cheerful-stoat-894.convex.site/api/v1/extensions")).find(p=>p.id===o);l?(await a.installExtension(l),addLog(`Extension cached: ${l.name}`,"success")):addLog(`Extension "${o}" not found in registry`,"error")}catch(a){addLog(`Warning: could not pre-install extension: ${a.message}`,"error")}}const r=panelState.selectedFirmware?.version||"unknown";addLog(`Firmware version: ${r}`),addLog("Enabling setup mode..."),await sendREPLCommand(currentPort,`
from lib.sys import settings
settings.set("setup_mode", True)
settings.set("firmware.version", "${r}")
settings.save()
print("SETUP_MODE_SET")
`,5e3,!1,"SETUP_MODE_SET"),addLog("Resetting device...");try{const a=currentPort.writable.getWriter(),l=new TextEncoder().encode("import machine; machine.reset()"),p=new Uint8Array(l.length+1);p.set(l),p[l.length]=4,await a.write(p),a.releaseLock()}catch{}await new Promise(a=>setTimeout(a,500));try{await currentPort.close()}catch{}currentPort=null,addLog("Device is restarting and connecting to WiFi...","success");let d=`https://${n}/setup`;o&&(d+=`?ext=${encodeURIComponent(o)}`),showSecurityWarningModal(n,d)}catch(n){addLog(`Error: ${n.message}`,"error"),triggerRerender()}}async function startRebless(){try{addLog("Starting re-provisioning...");const e=await transitionToREPL();if(!e.success){addLog("Boot detection failed — attempting recovery...","warning"),addLog("Sending interrupt to reach REPL...");try{const c=currentPort.writable.getWriter();for(let l=0;l<3;l++)await c.write(new Uint8Array([3,3,3])),await new Promise(p=>setTimeout(p,500));c.releaseLock(),await new Promise(l=>setTimeout(l,1e3))}catch{addLog("Could not send interrupt — device may need re-flash","error"),await handleBootFailure(e.error);return}}addLog("Reading device settings...");const i=(await sendREPLCommand(currentPort,`
from lib.sys import settings
print("HOST:" + settings.get("device.hostname", "pybot-xxxx"))
`)).match(/HOST:(.+)/),s=i?i[1].trim():"pybot-new";addLog(`Generating new certificate for ${s}.local...`),window.forge||await new Promise((c,l)=>{const p=document.createElement("script");p.src="https://cdn.jsdelivr.net/npm/node-forge@1.3.1/dist/forge.min.js",p.onload=c,p.onerror=l,document.head.appendChild(p)});const o=s+".local",{certPem:r,keyPem:d}=generateSelfSignedCert(o);addLog("Installing new certificate..."),await uploadCertsToDevice(currentPort,r,d);try{const l=(await sendREPLCommand(currentPort,`
import json
try:
    with open('/settings/board.json') as f:
        b = json.load(f)
    print("BOARD_ID:" + b.get("identity", {}).get("id", ""))
except:
    print("BOARD_ID:")
`,5e3,!1)).match(/BOARD_ID:(.+)/),p=l?l[1].trim():"";if(p){addLog(`Updating board config: ${p}...`);const u=await fetchBoardManifest(p),f=JSON.stringify(u).replace(/\\/g,"\\\\").replace(/'/g,"\\'");await sendREPLCommand(currentPort,`
with open('/settings/board.json', 'w') as f:
    f.write('${f}')
print("BOARD_OK")
`,1e4,!1,"BOARD_OK"),addLog("Board config updated","success")}else addLog("No board config found on device — skipping update")}catch(c){addLog(`Warning: Could not update board config: ${c.message}`,"warning")}addLog("Enabling setup mode..."),await sendREPLCommand(currentPort,`
from lib.sys import settings
settings.set("setup_mode", True)
settings.save()
print("SETUP_MODE_SET")
`,5e3,!1,"SETUP_MODE_SET"),addLog("Resetting device...");try{const c=currentPort.writable.getWriter(),p=new TextEncoder().encode("import machine; machine.reset()"),u=new Uint8Array(p.length+1);u.set(p),u[p.length]=4,await c.write(u),c.releaseLock()}catch{}await new Promise(c=>setTimeout(c,500));try{await currentPort.close()}catch{}currentPort=null,addLog("Device is restarting and connecting to WiFi...","success");const a=`https://${o}/setup`;showSecurityWarningModal(o,a)}catch(e){addLog(`Error: ${e.message}`,"error"),triggerRerender()}}async function showSecurityWarningModal(e,n){const i=await showStyledModal({icon:'<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>',title:"Accept Security Warning",subtitle:"Your device has new certificates",body:'<p>Your device is <strong>restarting</strong> and connecting to WiFi.</p><p>A new tab will open — click <strong>"Advanced"</strong> → <strong>"Proceed"</strong> to trust your device, then <strong>return here</strong>.</p>',buttons:[{id:"connect",class:"fw-styled-modal-btn-primary",icon:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" style="margin-right:0.5rem"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',label:`Open ${e}`},{id:"cancel",class:"fw-styled-modal-btn-cancel",label:"Skip for now"}]});panelState.view="scenarios",panelState.reblessComplete=!1,triggerRerender(),i==="connect"&&window.open(n,"_blank")}function generateSelfSignedCert(e,n=10){const i=forge.pki.rsa.generateKeyPair(2048),s=forge.pki.createCertificate();s.publicKey=i.publicKey,s.serialNumber="01",s.validity.notBefore=new Date,s.validity.notAfter=new Date,s.validity.notAfter.setFullYear(s.validity.notBefore.getFullYear()+n);const o=[{name:"commonName",value:e}];return s.setSubject(o),s.setIssuer(o),s.setExtensions([{name:"subjectAltName",altNames:[{type:2,value:e}]}]),s.sign(i.privateKey,forge.md.sha256.create()),{certPem:forge.pki.certificateToPem(s),keyPem:forge.pki.privateKeyToPem(i.privateKey)}}async function uploadCertsToDevice(e,n,i){addLog("Creating /certs directory..."),await sendREPLCommand(e,`
import os
try:
    os.mkdir('/certs')
except OSError:
    pass
print('DIR_OK')
`,3e3,!1,"DIR_OK"),addLog("Writing certificate...");const s=btoa(n);await sendREPLCommand(e,`
import binascii
with open('/certs/servercert.pem', 'wb') as f:
    f.write(binascii.a2b_base64(b'${s}'))
print('CERT_OK')
`,1e4,!1,"CERT_OK"),addLog("Writing private key...");const o=btoa(i);await sendREPLCommand(e,`
with open('/certs/prvtkey.pem', 'wb') as f:
    f.write(binascii.a2b_base64(b'${o}'))
print('KEY_OK')
`,1e4,!1,"KEY_OK"),addLog("Certificates installed!")}function FirmwarePanel(e,n){appState=e;const i=panelState.view;return html$1`
    <div class="firmware-panel">
      ${i==="connect"?renderConnectView():""}
      ${i==="scenarios"?renderScenariosView():""}
      ${i==="new-device"?renderNewDeviceView():""}
      ${i==="forgot-credentials"?renderForgotCredentialsView():""}
      ${i==="change-wifi"?renderChangeWifiView():""}
      ${i==="re-provision"?renderReProvisionView():""}
      
      ${renderTerminal()}
    </div>
  `}function renderDeviceInfoCompact(e="Connected",n="fw-status-success"){const i=panelState.deviceInfo;if(!i)return"";const s=getChipFeatures(i.chipName),o=i.connectionBaud?`${i.connectionBaud.toLocaleString()} bps`:"115,200 bps";return html$1`
    <div class="fw-device-info-header">
      <!-- Dark Header Section -->
      <div class="fw-device-chip-header">
        <div class="fw-device-chip-name">${i.chipName}</div>
        <div class="fw-device-chip-subline">
          <span class="fw-device-subline-item">
            ${IconSprite.renderIcon("refresh",{className:"fw-subline-icon",size:16})}
            v1.0
          </span>
          <span class="fw-device-subline-item">
            ${IconSprite.renderIcon("wifi",{className:"fw-subline-icon",size:16})}
            ${i.mac} (MAC)
          </span>
        </div>
      </div>
      
      <!-- Blue Summary Card -->
      <div class="fw-device-summary-card">
        <div class="fw-summary-section">
          <div class="fw-summary-label">
            ${IconSprite.renderIcon("cpu",{className:"fw-summary-icon",size:24})}
            MEMORY
          </div>
          <div class="fw-summary-value">${i.flashSize||"Unknown"} Flash${i.psramInfo?` · ${i.psramInfo.capacity} PSRAM`:""}</div>
          <div class="fw-summary-meta">Crystal 40 MHz${i.psramInfo?` · ${i.psramInfo.mode.toUpperCase()} PSRAM`:""}</div>
          <div class="fw-summary-facts">
            ${i.flashDevice?html$1`
              <div class="fw-summary-fact">
                ${IconSprite.renderIcon("cpu",{className:"fw-fact-icon",size:14})}
                <span>Flash Device : ${i.flashDevice}</span>
              </div>
            `:""}
            ${i.usbBridge?html$1`
              <div class="fw-summary-fact">
                ${IconSprite.renderIcon("usb",{className:"fw-fact-icon",size:14})}
                <span>USB Bridge : ${i.usbBridge}</span>
              </div>
            `:""}
            <div class="fw-summary-fact">
              ${IconSprite.renderIcon("bolt",{className:"fw-fact-icon",size:14})}
              <span>Connection Baud : ${o}</span>
            </div>
          </div>
        </div>
        
        <div class="fw-summary-divider"></div>
        
        <div class="fw-summary-section">
          <div class="fw-summary-label">
            ${IconSprite.renderIcon("bolt",{className:"fw-summary-icon",size:24})}
            FEATURE SET
          </div>
          <div class="fw-summary-value">${s.length} capabilities</div>
          <div class="fw-summary-chips">
            ${s.map(r=>html$1`
              <div class="fw-feature-chip">
                <span class="fw-feature-label">${r}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <path d="M20 6L9 17L4 12"></path>
                </svg>
              </div>
            `)}
          </div>
        </div>
      </div>
    </div>
  `}function getChipFeatures(e){const n={"ESP32-P4":["High-Performance MCU","RISC-V Dual Core"],"ESP32-S3":["WiFi","BLE 5.0","USB OTG"],"ESP32-S2":["WiFi","USB OTG"],"ESP32-C3":["WiFi","BLE 5.0","RISC-V"],"ESP32-C6":["WiFi 6","BLE 5.0","Thread"],ESP32:["WiFi","Bluetooth Classic","BLE"]};for(const[i,s]of Object.entries(n))if(e?.includes(i))return s;return["Microcontroller"]}let extensionDisplayNames={},extensionNamesFetched=!1;async function fetchExtensionDisplayName(e){if(!extensionNamesFetched){extensionNamesFetched=!0;try{const n=await fetch("https://cheerful-stoat-894.convex.site/api/v1/extensions");if(!n.ok)return;const i=await n.json();for(const s of i.extensions||[])extensionDisplayNames[s.id]=s.name;triggerRerender()}catch(n){console.warn("[firmware-panel] Could not fetch extension names:",n)}}}function renderConnectView(e,n){const i=sessionStorage.getItem("extension-install-active");if(i){extensionNamesFetched||fetchExtensionDisplayName();const s=extensionDisplayNames[i]||i.toUpperCase();return html$1`
      <div class="fw-view active" style="align-items: center; justify-content: center;">
        <div class="fw-ext-card">
          <div class="fw-ext-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 4m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z" />
              <path d="M12 2v2" />
              <path d="M9 12v9" />
              <path d="M15 12v9" />
              <path d="M5 16l4 -2" />
              <path d="M15 14l4 2" />
              <path d="M9 18h6" />
              <path d="M10 8v.01" />
              <path d="M14 8v.01" />
            </svg>
          </div>
          
          <h2 class="fw-ext-title">Installing ${s}</h2>
          <p class="fw-ext-subtitle">Plug in your device via USB</p>
          
          <div class="fw-ext-spinner" aria-hidden="true">
            <div class="fw-ext-spinner-ring"></div>
          </div>
          
          <p class="fw-ext-note">
            We'll detect your hardware, flash firmware, and install the <strong>${s}</strong> extension on your ESP32 device.
          </p>
          
          <button class="fw-ext-connect-btn" onclick=${handleConnect}>
            Connect Device
          </button>
        </div>
      </div>
    `}return html$1`
    <div class="fw-view active">
      <div class="fw-welcome">
        <h2>${t("firmware.deviceSetup")}</h2>
        <p>${t("firmware.deviceSetupHint")}</p>
      </div>
      
      <button class="fw-btn fw-btn-primary" onclick=${handleConnect}>
        ${IconSprite.renderIcon("usb",{className:"fw-btn-icon",size:20})}
        ${t("firmware.connectDevice")}
      </button>
      
      <div class="fw-hint-box">
        ${IconSprite.renderIcon("bulb",{className:"fw-hint-icon"})}
        <span>${t("firmware.connectHint")}</span>
      </div>
    </div>
  `}function renderScenariosView(e,n){const i=t(isBlankDevice?"firmware.readyToFlash":"firmware.pyDirectDetected");return html$1`
    <div class="fw-view active">
      ${renderDeviceInfoCompact(i,isBlankDevice?"fw-status-warning":"fw-status-success")}
      
      <div class="fw-scenario-grid">
        <div class="fw-scenario-card ${isBlankDevice?"fw-scenario-highlighted":""}" 
             onclick=${()=>selectScenario("new-device")}>
          <div class="fw-scenario-icon">
            ${IconSprite.renderIcon("cpu",{className:"",size:28})}
          </div>
          <h3>${t("firmware.newDevice")}</h3>
          <p>${t("firmware.newDeviceDesc")}</p>
        </div>
        
        <div class="fw-scenario-card ${isBlankDevice?"":"fw-scenario-highlighted"}"
             onclick=${()=>selectScenario("forgot-credentials")}>
          <div class="fw-scenario-icon">
            ${IconSprite.renderIcon("key",{className:"",size:28})}
          </div>
          <h3>${t("firmware.forgotCredentials")}</h3>
          <p>${t("firmware.forgotCredentialsDesc")}</p>
        </div>
        
        <div class="fw-scenario-card"
             onclick=${()=>selectScenario("change-wifi")}>
          <div class="fw-scenario-icon">
            ${IconSprite.renderIcon("wifi",{className:"",size:28})}
          </div>
          <h3>${t("firmware.changeWifi")}</h3>
          <p>${t("firmware.changeWifiDesc")}</p>
        </div>
        
        <div class="fw-scenario-card"
             onclick=${()=>selectScenario("re-provision")}>
          <div class="fw-scenario-icon">
            ${IconSprite.renderIcon("refresh",{className:"",size:28})}
          </div>
          <h3>${t("firmware.reProvision")}</h3>
          <p>${t("firmware.reProvisionDesc")}</p>
        </div>
      </div>
    </div>
  `}function renderNewDeviceView(e,n){const i=panelState.flashStep,s=panelState.flashProgress,o=panelState.selectedFirmware;if(i==="complete")return html$1`
      <div class="fw-view active">
        ${renderDeviceInfoCompact(t("firmware.flashComplete"),"fw-status-success")}
        
        <div class="fw-device-card">
          <div class="fw-device-card-header">
            <h3>
              ${IconSprite.renderIcon("cpu",{className:"fw-header-icon"})}
              ${t("firmware.flashComplete")}
            </h3>
          </div>
          
          <div style="text-align: center; padding: 2rem 0;">
            <div class="fw-success-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h2 style="font-size: 1.25rem; margin-bottom: 0.5rem;">${t("firmware.flashSuccess")}</h2>
            ${o?.version?html$1`<p style="color: var(--brand); font-size: 0.85rem; font-weight: 500; margin-bottom: 0.25rem;">pyDirect ${o.version}</p>`:""}
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">
              ${t("firmware.flashSuccessHint")}
            </p>
          </div>
          
          <button class="fw-btn fw-btn-primary" onclick=${proceedToWifiSetup}>
            ${IconSprite.renderIcon("wifi",{className:"fw-btn-icon",size:20})}
            ${t("firmware.configureWifi")}
          </button>
          <button class="fw-btn fw-btn-secondary" onclick=${()=>{panelState.view="scenarios",panelState.flashStep="select",panelState.flashComplete=!1,triggerRerender()}}>
            ${t("firmware.skipForNow")}
          </button>
        </div>
      </div>
    `;if(i==="downloading"||i==="flashing"){const r=t(i==="downloading"?"firmware.downloading":"firmware.flashing"),d=i==="flashing"&&s>90?html$1`<p style="text-align: center; color: var(--text-muted); margin-top: 0.5rem; font-size: 0.8rem;">
          ${t("firmware.writingToFlash")}
        </p>`:null;return html$1`
      <div class="fw-view active">
        ${renderDeviceInfoCompact(r,"fw-status-warning")}
        
        <div class="fw-device-card">
          <div class="fw-device-card-header">
            <h3>
              ${IconSprite.renderIcon("cpu",{className:"fw-header-icon"})}
              ${r}
            </h3>
          </div>
          
          <div style="padding: 1.5rem 0;">
            <div class="fw-progress-bar">
              <div class="fw-progress-fill" style="width: ${s}%"></div>
            </div>
            <p style="text-align: center; color: var(--text-secondary); margin-top: 0.75rem; font-size: 0.9rem;">
              ${s}%
            </p>
            ${d}
          </div>
        </div>
      </div>
    `}return html$1`
    <div class="fw-view active">
      <button class="fw-btn-back" onclick=${goBack}>
        ${t("firmware.back")}
      </button>
      
      ${renderDeviceInfoCompact(t("firmware.readyToFlash"),"fw-status-warning")}
      
      
      
      
      <div class="fw-device-card" style="margin-top: 1rem;">
        <div class="fw-device-card-header">
          <h3>
            ${IconSprite.renderIcon("bolt",{className:"fw-header-icon"})}
            ${t("firmware.selectFirmware")}
          </h3>
        </div>
        
        ${o?html$1`
          ${panelState.firmwareOptions.length>1?html$1`
            <div class="fw-form-group">
              <select class="fw-select" onchange=${r=>{const d=panelState.firmwareOptions.find(a=>a.id===r.target.value);d&&(panelState.selectedFirmware=d,triggerRerender())}}>
                ${panelState.firmwareOptions.map(r=>html$1`
                  <option value="${r.id}" selected=${r.id===o.id}>
                    ${r.displayName}
                  </option>
                `)}
              </select>
            </div>
          `:html$1`
            <div class="fw-firmware-info">
              <p style="font-weight: 500;">${o.displayName} <span style="font-size: 0.8rem; color: var(--text-secondary);">
                ${o.version?` ( Based on MicroPython ${o.version} )`:""}${o.platformVersion?` · Platform ${o.platformVersion}`:""}
                ${o.version&&o.size?" · ":""}
                ${o.size?`${(o.size/1024/1024).toFixed(1)} MB`:o.version?"":"Ready to flash"}
              </span></p>
            </div>
          `}
          
          ${panelState.boardOptions.length>0?html$1`
            <div class="fw-form-group" style="margin-top: 1rem;">
              <label style="font-size: 0.85rem; font-weight: 500; margin-bottom: 0.5rem; display: block; color: var(--text-secondary);">
                Board Configuration
              </label>
              <select class="fw-select" onchange=${r=>{const d=panelState.boardOptions.find(a=>a.id===r.target.value);d&&(panelState.selectedBoard=d,triggerRerender())}}>
                ${panelState.boardOptions.map(r=>html$1`
                  <option value="${r.id}" selected=${panelState.selectedBoard?.id===r.id}>
                    ${r.name}
                  </option>
                `)}
              </select>
              ${panelState.selectedBoard?.description?html$1`
                <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.35rem;">
                  ${panelState.selectedBoard.description}
                </p>
              `:""}
            </div>
          `:""}
          
          <button class="fw-btn fw-btn-primary" onclick=${startFlash} style="margin-top: 1rem;">
            ${IconSprite.renderIcon("bolt",{className:"fw-btn-icon",size:20})}
            ${t("firmware.flashButton")}
          </button>
        `:html$1`
          <div class="fw-loading">
            <span>${t("firmware.loadingFirmware")}</span>
          </div>
        `}
      </div>
    </div>
  `}function renderForgotCredentialsView(e,n){const i=panelState.credentials;return html$1`
    <div class="fw-view active">
      <button class="fw-btn-back" onclick=${goBack}>
        ${t("firmware.back")}
      </button>
      
      ${renderDeviceInfoCompact()}
      
      <div class="fw-device-card">
        <div class="fw-device-card-header">
          <h3>
            ${IconSprite.renderIcon("key",{className:"fw-header-icon"})}
            ${t("firmware.deviceCredentials")}
          </h3>
        </div>
        
        ${i?html$1`
          <div class="fw-credentials-grid">
            <div class="fw-cred-item">
              <label>${t("firmware.hostname")}</label>
              <span class="fw-cred-value">${i.hostname}</span>
            </div>
            <div class="fw-cred-item">
              <label>${t("firmware.password")}</label>
              <span class="fw-cred-value">${i.password}</span>
            </div>
            <div class="fw-cred-item">
              <label>${t("firmware.wifiNetwork")}</label>
              <span class="fw-cred-value">${i.ssid}</span>
            </div>
          </div>
        `:html$1`
          <div class="fw-loading">
            <span>${t("firmware.readingCredentials")}</span>
          </div>
        `}
      </div>
    </div>
  `}function renderChangeWifiView(e,n){return panelState.setupComplete?html$1`
      <div class="fw-view active">
        <div class="fw-device-card">
          <div class="fw-device-card-header">
            <h3>
              ${IconSprite.renderIcon("zap",{className:"fw-header-icon"})}
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
              Your device is configured at: <strong>${panelState.setupHostname}</strong>
            </p>
          </div>
          
          <!-- Browser Security Warning -->
          <div class="fw-hint-box fw-hint-warning">
            <h4>
              ${IconSprite.renderIcon("alert-triangle",{className:"fw-hint-icon"})}
              ${t("firmware.browserSecurityTitle")}
            </h4>
            <p>${t("firmware.browserSecurityHint")}</p>
          </div>
          
          <button class="fw-btn fw-btn-primary" onclick=${()=>window.open(panelState.setupUrl,"_blank")}>
            ${IconSprite.renderIcon("external-link",{className:"fw-btn-icon",size:20})}
            ${t("firmware.openDeviceSetup")}
          </button>
          
          <button class="fw-btn fw-btn-secondary" style="margin-top: 0.5rem;" onclick=${()=>{panelState.setupComplete=!1,panelState.view="scenarios",triggerRerender()}}>
            ${t("firmware.done")}
          </button>
        </div>
      </div>
    `:html$1`
    <div class="fw-view active">
      <button class="fw-btn-back" onclick=${goBack}>
        ${t("firmware.back")}
      </button>
      
      ${renderDeviceInfoCompact()}
      
      <div class="fw-device-card">
        <div class="fw-device-card-header">
          <h3>
            ${IconSprite.renderIcon("wifi",{className:"fw-header-icon"})}
            ${t("firmware.changeWifi")}
          </h3>
        </div>
        
        <p style="color: var(--text-secondary); font-size: 0.85rem;">
          Connecting to device and scanning for networks...
        </p>
      </div>
    </div>
  `}function renderReProvisionView(e,n){const i=()=>{const o=`https://${panelState.reblessHostname}`;window.open(o,"_blank")},s=async()=>{await resetAndClosePort(),panelState.reblessComplete=!1,panelState.reblessHostname=null,panelState.view="connect",triggerRerender()};return panelState.reblessComplete?html$1`
      <div class="fw-view active">
        <div class="fw-device-card">
          <div class="fw-device-card-header">
            <h3>
              ${IconSprite.renderIcon("refresh",{className:"fw-header-icon"})}
              ${t("firmware.reProvisionTitle")}
            </h3>
          </div>
          
          <p style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 1.5rem;">
            ${t("firmware.reProvisionHint")}
          </p>
          
          <!-- Success State -->
          <div style="text-align: center; padding: 2rem 0;">
            <div class="fw-success-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h2 style="font-size: 1.25rem; margin-bottom: 0.5rem;">${t("firmware.reProvisionComplete")}</h2>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">
              ${t("firmware.reProvisionSuccess")} <strong>${panelState.reblessHostname}</strong>
            </p>
          </div>
          
          <!-- Browser Security Warning -->
          <div class="fw-hint-box fw-hint-warning">
            ${IconSprite.renderIcon("alert-triangle",{className:"fw-hint-icon-warning"})}
            <div style="flex: 1;">
              <strong style="display: block; margin-bottom: 0.25rem;">${t("firmware.browserSecurityTitle")}</strong>
              <span style="font-size: 0.8rem;">
                ${t("firmware.browserSecurityHint")}
              </span>
            </div>
          </div>
          
          <button class="fw-btn fw-btn-primary" onclick=${i} style="margin-top: 1rem;">
            ${IconSprite.renderIcon("external-link",{className:"fw-btn-icon",size:20})}
            ${t("firmware.openDeviceSetup")}
          </button>
          <button class="fw-btn fw-btn-secondary" onclick=${s} style="margin-top: 0.5rem;">
            ${t("firmware.done")}
          </button>
        </div>
      </div>
    `:html$1`
    <div class="fw-view active">
      <button class="fw-btn-back" onclick=${goBack}>
        ${t("firmware.back")}
      </button>
      
      ${renderDeviceInfoCompact()}
      
      <div class="fw-device-card">
        <div class="fw-device-card-header">
          <h3>
            ${IconSprite.renderIcon("refresh",{className:"fw-header-icon"})}
            ${t("firmware.reProvisionTitle")}
          </h3>
        </div>
        
        <div class="fw-provision-info">
          <p>${t("firmware.generatingCerts")}</p>
          <p>${t("firmware.checkTerminal")}</p>
        </div>
      </div>
    </div>
  `}function renderTerminal(){const e=panelState.logs;return html$1`
    <div class="fw-terminal ${panelState.terminalCollapsed?"collapsed":""}">
      <div class="fw-terminal-header" onclick=${()=>{panelState.terminalCollapsed=!panelState.terminalCollapsed,triggerRerender()}}>
        <span>${IconSprite.renderIcon("terminal",{className:"fw-terminal-icon",size:14})} ${t("firmware.statusLog")}</span>
        ${IconSprite.renderIcon(panelState.terminalCollapsed?"chevron-up":"chevron-down",{className:"fw-terminal-toggle"})}
      </div>
      <div class="fw-terminal-content">
        ${e.map(n=>html$1`
          <div class="fw-log-line ${n.type}">${n.message}</div>
        `)}
      </div>
    </div>
  `}function AIAgentPanel(e,n){const i=e.aiAgent.settings;return html`
    <div class="panel-container">
      <div class="ai-agent-content">
        
        <!-- API Provider Section -->
        <div class="ai-agent-section">
          <h3>API Provider</h3>
          <p class="ai-agent-hint">Select your AI service provider</p>
          
          <select 
            class="ai-agent-select"
            value="${i.provider}"
            onchange=${s=>n("ai-set-provider",s.target.value)}
          >
            <option value="openai" selected=${i.provider==="openai"}>OpenAI (GPT-4, GPT-3.5)</option>
            <option value="anthropic" selected=${i.provider==="anthropic"}>Anthropic (Claude)</option>
            <option value="grok" selected=${i.provider==="grok"}>Grok (x.ai)</option>
            <option value="openrouter" selected=${i.provider==="openrouter"}>OpenRouter (Multi-model)</option>
            <option value="custom" selected=${i.provider==="custom"}>Custom Endpoint</option>
          </select>
        </div>
        
        <!-- API Key Section -->
        <div class="ai-agent-section">
          <h3>API Key</h3>
          <p class="ai-agent-hint">
            ${i.provider==="openai"?"Get your API key from platform.openai.com":""}
            ${i.provider==="anthropic"?html`
              Get your API key from console.anthropic.com
              <br><strong style="color: var(--scheme-primary);">Note:</strong> Anthropic requires a proxy server (see below). You can enter your API key here (it will be sent to the proxy), or configure it in the proxy server's .env file.
            `:""}
            ${i.provider==="grok"?"Get your API key from x.ai":""}
            ${i.provider==="openrouter"?"Get your API key from openrouter.ai":""}
            ${i.provider==="custom"?"Enter your custom API key and endpoint URL":""}
          </p>
          
          <div class="ai-agent-input-group">
            <input 
              type="password"
              class="ai-agent-input"
              placeholder="sk-..."
              value="${i.apiKey||""}"
              oninput=${s=>n("ai-set-apikey",s.target.value)}
            />
            <button 
              class="ai-agent-test-btn"
              onclick=${()=>n("ai-test-connection")}
              disabled=${!i.apiKey}
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
            value="${i.model}"
            onchange=${s=>n("ai-set-model",s.target.value)}
            disabled=${e.aiAgent.isLoadingOpenRouterModels&&i.provider==="openrouter"}
          >
            ${getModelOptions(i.provider,i.model,e.aiAgent.openRouterModels,e.aiAgent.isLoadingOpenRouterModels)}
          </select>
          ${e.aiAgent.isLoadingOpenRouterModels&&i.provider==="openrouter"?html`
            <p class="ai-agent-hint" style="margin-top: 8px; font-size: 12px; color: var(--text-secondary);">
              Loading available models...
            </p>
          `:""}
        </div>
        
        <!-- Custom Endpoint (if custom provider) -->
        ${i.provider==="custom"?html`
          <div class="ai-agent-section">
            <h3>Custom Endpoint</h3>
            <p class="ai-agent-hint">Enter your custom API endpoint URL</p>
            
            <input 
              type="text"
              class="ai-agent-input"
              placeholder="https://api.example.com/v1/chat/completions"
              value="${i.endpoint||""}"
              oninput=${s=>n("ai-set-endpoint",s.target.value)}
            />
          </div>
        `:""}
        
        <!-- Anthropic Proxy URL (if anthropic provider) -->
        ${i.provider==="anthropic"?html`
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
              value="${i.anthropicProxyUrl||""}"
              oninput=${s=>n("ai-set-anthropic-proxy-url",s.target.value)}
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
            value="${i.systemPrompt||""}"
            oninput=${s=>n("ai-set-system-prompt",s.target.value)}
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
  `}function getModelOptions(e,n,i=[],s=!1){const o={openai:[{value:"gpt-4o",label:"GPT-4o (Recommended)"},{value:"gpt-4-turbo",label:"GPT-4 Turbo"},{value:"gpt-4",label:"GPT-4"},{value:"gpt-3.5-turbo",label:"GPT-3.5 Turbo"}],anthropic:[{value:"claude-3-5-sonnet-20241022",label:"Claude 3.5 Sonnet (Recommended)"},{value:"claude-3-opus-20240229",label:"Claude 3 Opus"},{value:"claude-3-sonnet-20240229",label:"Claude 3 Sonnet"},{value:"claude-3-haiku-20240307",label:"Claude 3 Haiku"}],grok:[{value:"grok-4-latest",label:"Grok-4 Latest (Recommended)"},{value:"grok-2-1212",label:"Grok-2"},{value:"grok-beta",label:"Grok Beta"},{value:"grok-vision-beta",label:"Grok Vision Beta"}],openrouter:i.length>0?i:[{value:"anthropic/claude-3.5-sonnet",label:"Claude 3.5 Sonnet"},{value:"openai/gpt-4-turbo",label:"GPT-4 Turbo"},{value:"google/gemini-pro-1.5",label:"Gemini Pro 1.5"},{value:"meta-llama/llama-3.1-70b-instruct",label:"Llama 3.1 70B"}],custom:[{value:"custom-model",label:"Custom Model"}]},r=o[e]||o.openai;return s&&e==="openrouter"?html`<option>Loading models...</option>`:r.map(d=>html`
    <option value="${d.value}" selected=${d.value===n}>${d.label}</option>
  `)}function parseSkillMd(e){const n={meta:{},body:e},i=e.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);if(i){const s=i[1];for(const o of s.split(`
`)){const r=o.match(/^(\w+)\s*:\s*(.+)$/);r&&(n.meta[r[1].trim()]=r[2].trim())}n.body=e.slice(i[0].length)}return n.body=n.body.replace(/^ScriptO for\s+\[.*?\]\(.*?\)\.?\s*Run on device\s*\(MicroPython\)\.?\s*\n?/im,""),n.body=n.body.trim(),n}function SkillSidebar(e,n){if(!e.isSkillSidebarOpen||!e.skillSidebarContent)return html`<div></div>`;const{name:i,skillMd:s}=e.skillSidebarContent,{meta:o,body:r}=parseSkillMd(s);let d="";try{r&&(d=g.parse(r,{breaks:!0}))}catch(u){console.error("[SkillSidebar] Failed to parse markdown:",u),d=`<pre>${r}</pre>`}const a=[];o.description&&a.push(`<p class="skill-meta-description">${o.description}</p>`);const c=[];o.category&&c.push(`<span class="skill-meta-tag">${o.category}</span>`),o.author&&c.push(`<span class="skill-meta-tag">by ${o.author}</span>`),c.length&&a.push(`<div class="skill-meta-tags">${c.join("")}</div>`);const l=a.length?`<div class="skill-meta-block">${a.join("")}</div>`:"",p=document.createElement("div");return p.className="skill-sidebar-content skill-md-content",p.innerHTML=l+d,html`
    <div class="skill-sidebar">
      <!-- Titlebar -->
      <div class="skill-sidebar-titlebar">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
        <span>SKILL</span>
        <button 
          class="skill-sidebar-close"
          onclick=${()=>n("close-skill-sidebar")}
          title="Close sidebar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <!-- Skill Name Header -->
      <div class="skill-sidebar-header">
        <h3>${i||o.name||"Skill Documentation"}</h3>
      </div>

      <!-- Metadata + Markdown Content -->
      ${p}

      <!-- Deploy Button Footer -->
      <div class="skill-sidebar-footer">
        <button
          class="skill-deploy-btn"
          onclick=${()=>n("deploy-skill")}
          title="Deploy this skill to the connected device">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Deploy Skill
        </button>
      </div>
    </div>
  `}function ReconnectDialog(e,n){if(!e.isReconnecting)return;const i=e.reconnectAttempt||0;function s(){n("reconnect-cancel")}return html$1`
  <div id="dialog-reconnect" class="dialog open" tabindex="-1">
    <div class="dialog-content webrepl-dialog" style="max-width: 400px;">
      <div class="dialog-header">
        <div class="dialog-icon" style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 11A8.1 8.1 0 0 0 4.5 9M4 5v4h4"/>
            <path d="M4 13a8.1 8.1 0 0 0 15.5 2M20 19v-4h-4"/>
          </svg>
        </div>
        <div class="dialog-title">Reconnecting…</div>
        <div class="dialog-subtitle">Attempting to reconnect… (${i+1})</div>
      </div>

      <div class="dialog-body">
        <div style="display: flex; justify-content: center; padding: 16px 0;">
          <div class="reconnect-spinner" style="
            width: 36px; height: 36px;
            border: 3px solid var(--border-color);
            border-top-color: var(--scheme-primary);
            border-radius: 50%;
            animation: reconnect-spin 0.8s linear infinite;
          "></div>
        </div>

        <div class="dialog-footer" style="justify-content: center; margin-top: 16px;">
           <button class="scriptos-btn scriptos-btn-secondary" style="min-width: 100px;" onclick=${s}>
             Cancel
           </button>
        </div>
      </div>
    </div>
  </div>

  <style>
    @keyframes reconnect-spin {
      to { transform: rotate(360deg); }
    }
  </style>
  `}function EditorContent(e,n){return html$1`
    <div class="editor-layout">
      <div class="working-area">
        ${Toolbar(e,n)}
        ${Tabs(e,n)}
        ${CodeEditor(e)}
        ${ReplPanel(e,n)}
      </div>
      ${AgentSidebar(e,n)}
      ${SkillSidebar(e,n)}
    </div>
  `}function FileManagerContent(e,n){let i="Connect to board",s=`${e.diskNavigationRoot}${e.diskNavigationPath}`;return e.isConnected&&(i=`${e.connectedPort}${e.boardNavigationPath}`),html`
    <div id="file-manager">
      <div id="board-files">
        <div class="device-header">
          ${IconSprite.renderIcon(e.isConnected?"cpu":"unlink",{className:"icon"})}
          <div onclick=${()=>n("connect")} class="text">
            <span>${i}</span>
          </div>
          <button disabled=${!e.isConnected} onclick=${()=>n("create-folder","board")}>
            ${IconSprite.renderIcon("folder-plus",{className:"icon"})}
          </button>
          <button disabled=${!e.isConnected} onclick=${()=>n("create-file","board")}>
            ${IconSprite.renderIcon("file-plus",{className:"icon"})}
          </button>
          <button disabled=${!e.isConnected} onclick=${()=>n("upload-to-device")} title="Upload files from computer directly to device">
            ${IconSprite.renderIcon("file-upload",{className:"icon"})}
          </button>
        </div>
        ${BoardFileList(e,n)}
      </div>
      ${FileActions(e,n)}
      <div id="disk-files">
        <div class="device-header">
          ${IconSprite.renderIcon("device-desktop",{className:"icon"})}
          <div class="text">
            <span>${s}</span>
          </div>
          <button onclick=${()=>n("create-folder","disk")}>
            ${IconSprite.renderIcon("folder-plus",{className:"icon"})}
          </button>
          <button onclick=${()=>n("create-file","disk")}>
            ${IconSprite.renderIcon("file-plus",{className:"icon"})}
          </button>
          <button onclick=${()=>n("import-files")} title="Import files from computer">
            ${IconSprite.renderIcon("file-upload",{className:"icon"})}
          </button>
        </div>
        ${DiskFileList(e,n)}
      </div>
    </div>
  `}function TwilioPanel(e,n){e.isConnected&&!e.twilioConfigLoaded&&!e.isLoadingTwilioConfig&&n("load-twilio-config");const i=e.twilioConfig||{};return html`
    <div class="panel-container">
      <div class="panel-header">
        <h2>Telephony</h2>
      </div>
      
      <div class="panel-section">
        <div class="section-header">
          <h3 class="panel-section-title">Twilio Credentials</h3>
        </div>
        
        <form class="config-form" onsubmit=${s=>{s.preventDefault();const o=new FormData(s.target),r={account_sid:o.get("account_sid")||"",auth_token:o.get("auth_token")||"",from_number:o.get("from_number")||""};if(!r.account_sid){alert("Account SID is required");return}if(!r.auth_token){alert("Auth Token is required");return}n("save-twilio-config",r)}}>
          <div class="form-group">
            <label for="twilio-account-sid">
              Account SID <span class="required">*</span>
              <span class="label-tooltip">
                <svg class="label-tooltip-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 16v-4"/>
                  <path d="M12 8h.01"/>
                </svg>
                <span class="tooltip">Your Twilio Account SID (starts with AC). Find it at twilio.com/console</span>
              </span>
            </label>
            <input 
              type="text" 
              id="twilio-account-sid" 
              name="account_sid" 
              value=${i.account_sid||""}
              placeholder="ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
            />
          </div>
          
          <div class="form-group">
            <label for="twilio-auth-token">
              Auth Token <span class="required">*</span>
              <span class="label-tooltip">
                <svg class="label-tooltip-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 16v-4"/>
                  <path d="M12 8h.01"/>
                </svg>
                <span class="tooltip">Your Twilio Auth Token. Find it at twilio.com/console</span>
              </span>
            </label>
            <input 
              type="password" 
              id="twilio-auth-token" 
              name="auth_token" 
              value=${i.auth_token||""}
              placeholder="Your auth token"
            />
          </div>
          
          <div class="form-group">
            <label for="twilio-from-number">
              From Number
              <span class="label-tooltip">
                <svg class="label-tooltip-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 16v-4"/>
                  <path d="M12 8h.01"/>
                </svg>
                <span class="tooltip">Your Twilio phone number in E.164 format (e.g. +12229876543)</span>
              </span>
            </label>
            <input 
              type="text" 
              id="twilio-from-number" 
              name="from_number" 
              value=${i.from_number||""}
              placeholder="+12229876543"
            />
          </div>
          
          <div class="config-actions">
            <button type="submit" class="primary-button" disabled=${!e.isConnected}>
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  `}function LandingView(e,n){return html$1`
    <div class="landing-view">
      <div class="landing-container">
        <!-- Demo Header with Scripto Studio branding -->
        <div class="demo-header">
          <h2>${t("landing.title")}</h2>
          <p>${t("landing.tagline")}</p>
        </div>
        
        <div class="landing-scenario-grid">
          <div class="landing-scenario-card" onclick=${()=>openIframeModal("https://scriptohub.ai/extensions","Browse Extensions")}>
            <div class="landing-scenario-icon">
              ${IconSprite.renderIcon("packages",{className:"landing-icon-large"})}
            </div>
            <h3>${t("landing.browseExtensions")}</h3>
            <p>${t("landing.browseExtensionsDesc")}</p>
          </div>
          
          <div class="landing-scenario-card" onclick=${()=>openIframeModal("https://scriptohub.ai/skills","Browse ScriptOs")}>
            <div class="landing-scenario-icon">
              ${IconSprite.renderIcon("script",{className:"landing-icon-large"})}
            </div>
            <h3>${t("landing.browseScriptOs")}</h3>
            <p>${t("landing.browseScriptOsDesc")}</p>
          </div>
          
          <div class="landing-scenario-card" onclick=${()=>openExternal("https://scriptostudio.com/docs/")}>
            <div class="landing-scenario-icon">
              ${IconSprite.renderIcon("book",{className:"landing-icon-large"})}
            </div>
            <h3>${t("landing.browseDocs")}</h3>
            <p>${t("landing.browseDocsDesc")}</p>
          </div>
          
          <div class="landing-scenario-card ${e.needsOnboarding?"highlight-pulse":""}" onclick=${()=>n("navigate","system:firmware")}>
            <div class="landing-scenario-icon">
              ${IconSprite.renderIcon("cpu",{className:"landing-icon-large"})}
            </div>
            <h3>${t("landing.onboardDevice")}</h3>
            <p>${t("landing.onboardDeviceDesc")}</p>
          </div>
        </div>
        
        <!-- Animated Connect Button with Pulse Circle (mobile only, when sidebar is hidden) -->
        <div class="demo-cta mobile-only">
          <div style="display: inline-block; position: relative;">
            <div class="pulse-circle"></div>
            <div class="pulse-circle pulse-delay"></div>
            <button class="interactive-btn" onclick=${()=>n("connect")}>
              ${t("landing.connectDevice")}
            </button>
          </div>
        </div>
      </div>
    </div>
  `}function openExternal(e){window.open(e,"_blank","noopener,noreferrer")}function SystemView(e,n){e.sidebarIconRotated===void 0&&(e.sidebarIconRotated=!1);const i=e.connectionMode==="webrepl"?"#00FF7F":e.connectionMode==="usb"?"#FF9500":"var(--text-secondary)",s=html$1`
    <div class="sidebar-header">
      <div
        class="sidebar-header-logo connection-${e.connectionMode||"none"}"
        onclick=${()=>{e.connectionMode==="usb"?handleDisconnect():e.isConnected?n("disconnect"):n("connect")}}
        title=${e.connectionMode==="usb"?"Disconnect USB Device":e.isConnected?"Disconnect from Device":"Connect to Device"}
        style="color: ${i}"
      >
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>
      </div>
    </div>
  `;return html$1`
    <div class="working-area">
      <div class="system-container">
        ${s}
        <aside class="system-sidebar">
          ${SystemSidebar(e,n)}
        </aside>
        <main class="system-content">
          ${renderActivePanel(e,n)}
        </main>
      </div>
    </div>
    ${StatusBar(e)}
    ${ConnectionDialog(e,n)}
    ${DebugSidebar(e,n)}
    ${NewFileDialog(e,n)}
    ${ScriptOsModal(e,n)}
    ${ScriptOsUiModal(e,n)}
    ${ResetDialog(e,n)}
    ${ReconnectDialog(e,n)}
    ${ExtensionsModal(e,n)}
    ${BreakpointModal(e,n)}
  `}function SystemSidebar(e,n){const i=window.i18n?window.i18n.t:b=>b,s=[{id:"home",label:i("sidebar.home"),icon:"home"}],o=[{id:"editor",label:i("sidebar.editor"),icon:"code"},{id:"file-manager",label:i("sidebar.files"),icon:"folder"}],r=[{id:"about",label:i("sidebar.about"),icon:"info-circle"},{id:"settings",label:i("sidebar.settings"),icon:"adjustments-alt"},{id:"ai-agent",label:i("sidebar.aiAgent"),icon:"robot-face"},{id:"firmware",label:i("sidebar.firmware"),icon:"file-download"}],d=[{id:"wifi",label:i("sidebar.wifi"),icon:"wifi"},{id:"ethernet",label:i("sidebar.ethernet"),icon:"cloud-network"},{id:"vpn",label:i("sidebar.vpn"),icon:"shield-chevron"},{id:"btle",label:i("sidebar.btle"),icon:"bluetooth"},{id:"wwan",label:i("sidebar.wwan"),icon:"cell"},{id:"mqtt",label:i("sidebar.mqtt"),icon:"message-2"},{id:"twilio",label:i("sidebar.telephony"),icon:"phone"},{id:"ntp",label:i("sidebar.ntp"),icon:"clock-cog"},{id:"can",label:i("sidebar.can"),icon:"car-crash"}],a=[{id:"gps",label:i("sidebar.gps"),icon:"gps"},{id:"4g-modem",label:i("sidebar.modem"),icon:"signal-4g"},{id:"sdcard",label:i("sidebar.sdcard"),icon:"device-sd-card"}],c=s.map(b=>renderSidebarItem(b,e,n)),l=o.map(b=>renderSidebarItem(b,e,n)),p=e.expandedSystem!==!1,u=html$1`
    <div class="system-sidebar-extension">
      <div 
        class="system-sidebar-item system-sidebar-toggle"
        onclick=${()=>n("toggle-system-menu")}
      >
        ${IconSprite.renderIcon("settings",{className:"",size:20})}
        <span>${i("sidebar.system")}</span>
        ${IconSprite.renderIcon("chevron-down",{className:`expand-icon ${p?"expanded":""}`,size:16})}
      </div>
      
      ${p?html$1`
        <div class="system-sidebar-submenu">
          ${r.map(b=>{const k=e.activeSystemPanel===b.id;return html$1`
              <div 
                class="system-sidebar-subitem ${k?"active":""}"
                onclick=${()=>n("change-system-panel",b.id)}
              >
                ${IconSprite.renderIcon(b.icon,{className:"",size:16})}
                <span>${b.label}</span>
              </div>
            `})}
        </div>
      `:""}
    </div>
  `,f=e.expandedNetworks!==!1,h=html$1`
    <div class="system-sidebar-extension">
      <div 
        class="system-sidebar-item system-sidebar-toggle"
        onclick=${()=>n("toggle-networks-menu")}
      >
        ${IconSprite.renderIcon("network",{className:"",size:20})}
        <span>${i("sidebar.networks")}</span>
        ${IconSprite.renderIcon("chevron-down",{className:`expand-icon ${f?"expanded":""}`,size:16})}
      </div>
      
      ${f?html$1`
        <div class="system-sidebar-submenu">
          ${d.map(b=>{const k=e.activeNetworkPanel===b.id;return html$1`
              <div 
                class="system-sidebar-subitem ${k?"active":""}"
                onclick=${()=>n("change-network-panel",b.id)}
              >
                ${IconSprite.renderIcon(b.icon,{className:"",size:16})}
                <span>${b.label}</span>
              </div>
            `})}
        </div>
      `:""}
    </div>
  `,m=e.expandedPeripherals!==!1,v=html$1`
    <div class="system-sidebar-extension">
      <div
        class="system-sidebar-item system-sidebar-toggle"
        onclick=${()=>n("toggle-peripherals-menu")}
      >
        ${IconSprite.renderIcon("cpu",{className:"",size:20})}
        <span>${i("sidebar.peripherals")}</span>
        ${IconSprite.renderIcon("chevron-down",{className:`expand-icon ${m?"expanded":""}`,size:16})}
      </div>
      
      ${m?html$1`
        <div class="system-sidebar-submenu">
          ${a.map(b=>{const k=e.activePeripheralsPanel===b.id;return html$1`
              <div 
                class="system-sidebar-subitem ${k?"active":""}"
                onclick=${()=>n("change-peripherals-panel",b.id)}
              >
                ${IconSprite.renderIcon(b.icon,{className:"",size:16})}
                <span>${b.label}</span>
              </div>
            `})}
        </div>
      `:""}
    </div>
  `,y=b=>{if(b.iconSvg)return html$1`<span class="icon icon-extension">${raw(b.iconSvg)}</span>`;const k=b.icon||"settings";return IconSprite.renderIcon(k,{className:"",size:20})},w=(e.installedExtensions||[]).map(b=>{const k=e.expandedExtensions[b.id],C=e.activeExtension===b.id,T=b.devices===!0;let I=null;if(T&&k)if(!e.loadedExtensions[b.id])console.warn("[System] Extension not loaded:",b.id);else{const $=e.loadedExtensions[b.id];if(!$.instance)try{const _=$.data.content,N=new Function("DeviceAPI","html","emit","state",`
              ${_}
              const classMatch = ${JSON.stringify(_)}.match(/class\\s+(\\w+(?:App|Extension))\\s*{/);
              if (!classMatch) {
                throw new Error('No extension class found');
              }
              return eval(classMatch[1]);
            `)(DeviceAPI,html$1,n,e),O=new DeviceAPI(BridgeDevice),F=new N(O,n,e,html$1);e.loadedExtensions[b.id].instance=F}catch(_){console.error(`[System] Error instantiating extension ${b.id}:`,_)}if($.instance&&typeof $.instance.getMenuItems=="function")try{const _=$.instance.getMenuItems();_&&Array.isArray(_)&&(b.menu=_)}catch(_){console.error(`[System] Error getting menu items for ${b.id}:`,_)}if($.instance&&typeof $.instance.renderSidebarDevices=="function")try{I=$.instance.renderSidebarDevices()}catch(_){console.error(`[System] Error rendering sidebar devices for ${b.id}:`,_)}else console.warn(`[System] renderSidebarDevices not available for ${b.id}`)}if(k&&e.loadedExtensions[b.id]?.instance){const $=e.loadedExtensions[b.id];if($.instance&&typeof $.instance.getMenuItems=="function")try{const _=$.instance.getMenuItems();_&&Array.isArray(_)&&(b.menu=_)}catch(_){console.error(`[System] Error getting menu items for ${b.id}:`,_)}}return html$1`
      <div class="system-sidebar-extension">
        <div 
          class="system-sidebar-item system-sidebar-toggle ${C?"active-extension":""}"
          onclick=${()=>n("toggle-extension-menu",b.id)}
        >
          ${y(b)}
          <span>${b.name}</span>
          ${IconSprite.renderIcon("chevron-down",{className:`expand-icon ${k?"expanded":""}`,size:16})}
        </div>
        
        ${k?html$1`
          <div class="system-sidebar-submenu">
            ${b.menu.map($=>{const _=e.activeExtension===b.id&&e.activeExtensionPanel===$.id,P=$.disabled===!0;return html$1`
                <div 
                  class="system-sidebar-subitem ${_?"active":""} ${P?"disabled":""}"
                  onclick=${P?null:()=>n("change-extension-panel",{extensionId:b.id,panelId:$.id})}
                  style=${P?"opacity: 0.6; cursor: default; font-weight: 600;":""}
                >
                  <span>${$.label}</span>
                </div>
              `})}
            
            ${T?html$1`
              <div class="system-sidebar-devices-section">
                <div class="system-sidebar-devices-header">
                  DEVICES
                </div>
                ${I||html$1`
                  <div style="padding: 12px; text-align: center; color: var(--text-secondary); font-size: 11px;">
                    Loading...
                  </div>
                `}
              </div>
            `:""}
          </div>
        `:""}
      </div>
    `}),S=html$1`
    <div class="system-sidebar-extensions-header">
      <span>${i("extensions")}</span>
      <button 
        class="extensions-add-button" 
        onclick=${()=>n("open-extensions-modal")}
        title=${i("add_extension")}
      >
        +
      </button>
    </div>
  `,x=html$1`
    <div class="system-sidebar-divider"></div>
  `,E=html$1`
    <div class="sidebar-footer">
      ${window.LanguageSelector?window.LanguageSelector(e,n):""}
    </div>
  `;return html$1`
    <div class="system-sidebar-content">
      ${c}
      ${l}
      ${h}
      ${v}
      ${u}
      ${x}
      ${S}
      ${w}
      ${E}
    </div>
  `}function renderSidebarItem(e,n,i){const s=n.systemSection===e.id,r=["editor","file-manager"].includes(e.id)?"change-view":"change-system-section";return html$1`
    <div
      class="system-sidebar-item ${s?"active":""}"
      onclick=${()=>i(r,e.id)}
    >
      ${IconSprite.renderIcon(e.icon,{className:"",size:20})}
      <span>${e.label}</span>
    </div>
  `}function renderActivePanel(e,n){const i=e.systemSection;if(i==="editor")return EditorContent(e,n);if(i==="file-manager")return FileManagerContent(e,n);if(i==="landing")return LandingView(e,n);if(i?.startsWith("extension:"))return ExtensionContainer(e,n,html$1);if(i?.startsWith("network:"))switch(i.split(":")[1]){case"wifi":return WiFiPanel(e,n);case"ethernet":return EthernetPanel(e,n);case"vpn":return VPNPanel(e,n);case"btle":return BTLEPanel(e,n);case"wwan":return WWANPanel(e,n);case"mqtt":return MQTTPanel(e,n);case"twilio":return TwilioPanel(e,n);case"ntp":return NTPPanel(e,n);case"can":return CANPanel(e,n);default:return WiFiPanel(e,n)}if(i?.startsWith("peripherals:"))switch(i.split(":")[1]){case"gps":return GPSPanel(e,n);case"4g-modem":return ModemPanel(e,n);case"sdcard":return SDCardPanel(e,n);default:return GPSPanel(e,n)}if(i?.startsWith("system:"))switch(i.split(":")[1]){case"about":return SysInfoPanel(e,n);case"settings":return AppearancePanel(e,n);case"ai-agent":return AIAgentPanel(e,n);case"firmware":return FirmwarePanel(e);default:return AppearancePanel(e,n)}return LandingView(e,n)}const cacheBuster=Date.now();window.i18nReady=Promise.all([fetch(`locales/en.json?v=${cacheBuster}`).then(e=>e.json()),fetch(`locales/de.json?v=${cacheBuster}`).then(e=>e.json()),fetch(`locales/es.json?v=${cacheBuster}`).then(e=>e.json()),fetch(`locales/fr.json?v=${cacheBuster}`).then(e=>e.json()),fetch(`locales/zh.json?v=${cacheBuster}`).then(e=>e.json())]).then(([e,n,i,s,o])=>{if(window.i18n){window.i18n.initTranslations(e,n,i,s,o);const r=localStorage.getItem("locale")||"en";window.i18n.setLocale(r),console.log("[i18n] Translations loaded, locale set to:",r),window.appInstance&&window.appInstance.emitter.emit("render")}else console.warn("[i18n] window.i18n not available yet");return!0}).catch(e=>(console.error("[i18n] Failed to load translations:",e),!1));const newFileContent=`# This program was created in ScriptO Studio for MicroPython

print('Hello, ')
print('ScriptO!') # ●
`;async function sleep(e){return new Promise(n=>setTimeout(n,e))}async function confirmDialog(e,n,i){return confirm(e)?0:1}function updateStatusBarDirectly(e,n){const i=document.getElementById("status-bar");if(!i)return;const s=n||localStorage.getItem("temperatureUnit")||"degC",o=buildStatusBarModel?buildStatusBarModel(e,s):null;if(!o||!o.connected){i.className="disconnected";const u=i.querySelector(".status-bar-center");u?u.textContent=o&&o.disconnectedText||DISCONNECTED_STATUS_TEXT:i.textContent=o&&o.disconnectedText||DISCONNECTED_STATUS_TEXT;return}i.className="";const r=i.querySelector(".status-bar-center")||i;function d(u){let f=r.querySelector(`.status-item.${u}`);if(!f){f=document.createElement("div"),f.className=`status-item ${u}`;const h=document.createElement("span");h.className="status-label";const m=document.createElement("span");m.className="status-value",f.appendChild(h),f.appendChild(m),r.appendChild(f)}return f}const a=d("ram");a.querySelector(".status-label").textContent="RAM",a.querySelector(".status-value").textContent=o.ram;const c=r.querySelector(".status-item.temp");if(o.temp){const u=d("temp");u.querySelector(".status-label").textContent="TEMP",u.querySelector(".status-value").textContent=o.temp}else c&&c.remove();const l=d("uptime");l.querySelector(".status-label").textContent="UPTIME",l.querySelector(".status-value").textContent=o.uptime;const p=r.querySelector(".status-item.wifi-rssi");if(o.rssi){const u=d("wifi-rssi");u.querySelector(".status-label").textContent="RSSI",u.querySelector(".status-value").textContent=o.rssi}else p&&p.remove()}function updateOverlayDirectly(e){const n=document.getElementById("overlay");if(!n)return;let i=!1,s="";if(e.diskFiles==null)i=!0,s="<p>Loading files...</p>";else if(e.isRemoving)i=!0,s="<p>Removing...</p>";else if(e.isConnecting)i=!0,s="<p>Connecting...</p>";else if(e.isLoadingFiles)i=!0,s="<p>Loading files...</p>";else if(e.isSaving)i=!0,s=`<p>Saving file... ${e.savingProgress||0}</p>`;else if(e.isTransferring){i=!0;const o=String(e.transferringProgress||""),r=o.match(/(\d+)%?$/),d=r?parseInt(r[1]):0,a=o.match(/^(.+?):/);s=`
      <div class="transfer-overlay-content">
        <div class="transfer-title">Transferring File</div>
        <div class="transfer-filename">${a?a[1]:"file"}</div>
        <div class="transfer-progress-container">
          <div class="transfer-progress-bar">
            <div class="transfer-progress-fill" style="width: ${d}%"></div>
          </div>
          <div class="transfer-progress-text">${d}%</div>
        </div>
      </div>
    `}i?(n.classList.remove("closed"),n.classList.add("open"),n.innerHTML=s):(n.classList.remove("open"),n.classList.add("closed"))}class RegistryCache{constructor(){this.DB_NAME="scripto-studio-registry-cache",this.DB_VERSION=1,this.STORE_SCRIPTOS="scriptos",this.STORE_INDEX="index",this.INDEX_CACHE_KEY="index",this.INDEX_CACHE_EXPIRY=24*60*60*1e3}async _initDB(){return new Promise((n,i)=>{const s=indexedDB.open(this.DB_NAME,this.DB_VERSION);s.onerror=()=>i(s.error),s.onsuccess=()=>n(s.result),s.onupgradeneeded=o=>{const r=o.target.result;r.objectStoreNames.contains(this.STORE_SCRIPTOS)||r.createObjectStore(this.STORE_SCRIPTOS),r.objectStoreNames.contains(this.STORE_INDEX)||r.createObjectStore(this.STORE_INDEX)}})}async getIndex(){try{const n=await this._initDB();return new Promise((i,s)=>{const d=n.transaction([this.STORE_INDEX],"readonly").objectStore(this.STORE_INDEX).get(this.INDEX_CACHE_KEY);d.onsuccess=()=>{const a=d.result;if(a&&a.data){const c=Date.now()-a.timestamp;c<this.INDEX_CACHE_EXPIRY?(console.log("[Registry Cache] Using cached index (age:",Math.round(c/1e3/60),"minutes)"),i(a.data)):(console.log("[Registry Cache] Index cache expired"),i(null))}else i(null)},d.onerror=()=>s(d.error)})}catch(n){return console.error("[Registry Cache] Error getting index:",n),null}}async saveIndex(n){try{const i=await this._initDB();return new Promise((s,o)=>{const a=i.transaction([this.STORE_INDEX],"readwrite").objectStore(this.STORE_INDEX).put({data:n,timestamp:Date.now()},this.INDEX_CACHE_KEY);a.onsuccess=()=>{console.log("[Registry Cache] Saved index"),s()},a.onerror=()=>o(a.error)})}catch(i){console.error("[Registry Cache] Error saving index:",i)}}async getScriptO(n){try{const i=await this._initDB();return new Promise((s,o)=>{const a=i.transaction([this.STORE_SCRIPTOS],"readonly").objectStore(this.STORE_SCRIPTOS).get(n);a.onsuccess=()=>{const c=a.result;c&&c.content?(console.log("[Registry Cache] Using cached ScriptO:",n),s(c)):s(null)},a.onerror=()=>o(a.error)})}catch(i){return console.error("[Registry Cache] Error getting ScriptO:",i),null}}async saveScriptO(n,i,s){try{const o=await this._initDB();return new Promise((r,d)=>{const l=o.transaction([this.STORE_SCRIPTOS],"readwrite").objectStore(this.STORE_SCRIPTOS).put({url:n,content:i,config:s,timestamp:Date.now()},n);l.onsuccess=()=>{console.log("[Registry Cache] Saved ScriptO:",n),r()},l.onerror=()=>d(l.error)})}catch(o){console.error("[Registry Cache] Error saving ScriptO:",o)}}}async function initializeState(e,n,i){const s=BridgeDisk;e.platform=navigator.platform.indexOf("Mac")>-1?"darwin":"linux",e.systemSection=null,e.diskNavigationPath="/",e.isInitializing=!0,e.commandHistory=[],e.historyIndex=-1,e.cursorPos=0,await s.initialize(),e.diskNavigationRoot="/",console.log("[Store] Using IndexedDB virtual filesystem, root:",e.diskNavigationRoot),e.isInitializing=!1,n.emit("render"),e.diskFiles=[],e.boardNavigationPath="/",e.boardNavigationRoot="/",e.boardFiles=[],e.openFiles=[],e.selectedFiles=[],e.filesLoadedOnce=!1,e.newTabFileName=null,e.editingFile=null,e.creatingFile=null,e.renamingFile=null,e.currentLine="",e.bannerDisplayed=!1,e.creatingFolder=null,e.renamingTab=null,e.fileCounter=1,e.isConnectionDialogOpen=!1,e.isConnecting=!1,e.systemInfo=null,e.networksInfo=null,e.isLoadingSystemInfo=!1,e.isLoadingNetworks=!1,e.expandedNetworks=!1,e.activeNetworkPanel=null,e.expandedPeripherals=!1,e.activePeripheralsPanel=null,e.expandedSystem=!1,e.activeSystemPanel=null,e.sdcardConfig=null,e.isLoadingSdcardConfig=!1,e.sdcardConfigLoaded=!1,e.sdcardInfo=null,e.isLoadingSdcardInfo=!1,e.isMountingSDCard=!1,e.isUnmountingSDCard=!1,e.gpioConfig=null,e.isLoadingGpioConfig=!1,e.gpioConfigLoaded=!1,e.gpioSortBy="usage",e.gpioSortOrder="asc",e.gpioEditingRow=null,e.gpioEditingRowData=null,e.gpioValidationErrors=[],e.mqttConfig=null,e.isLoadingMqttConfig=!1,e.canConfig=null,e.canConfigLoaded=!1,e.isLoadingCanConfig=!1,e.mqttConfigLoaded=!1,e.ntpConfig={server:"pool.ntp.org",tzOffset:0,timezone:"UTC",autoDetect:!1},e.isLoadingNtpConfig=!1,e.ntpConfigLoaded=!1,e.ntpSyncResult=null,e.wwanConfig=null,e.isLoadingWwanConfig=!1,e.wwanConfigLoaded=!1,e.modemStatus=null,e.isLoadingModemStatus=!1,e.modemStatusLoaded=!1,e.gpsData=null,e.isLoadingGpsData=!1,e.gpsDataLoaded=!1,e.theme=null,e.colorScheme=null,e.effectiveTheme=null,e.locale=localStorage.getItem("locale")||"en",e.isConnected=!1,e.connectedPort=null,e.connectionMode="none",e.needsOnboarding=!1;try{const o=await s.hasOnboardedDevices();e.needsOnboarding=!o,console.log("[State Init] Onboarding needed:",e.needsOnboarding)}catch(o){console.warn("[State Init] Could not check onboarded devices:",o),e.needsOnboarding=!0}e.statusInfo=null,e.scriptOsList=[],e.selectedScriptOs=null,e.scriptOsModalView="library",e.scriptOsArgs={},e.scriptOsSearchQuery="",e.scriptOsFilterTags=[],e.scriptOsFiltersCollapsed=!0,e.scriptOsViewMode="cards",e.isScriptOsModalOpen=!1,e.scriptohubApiUrl="https://cheerful-stoat-894.convex.site",e.isLoadingRegistry=!1,e.isSkillSidebarOpen=!1,e.skillSidebarContent=null,e.scriptOsUiModal={isOpen:!1,url:null,title:null,isLoading:!1,error:null},e.aiAgent={isOpen:!1,messages:[],isGenerating:!1,connectionStatus:null,openRouterModels:[],isLoadingOpenRouterModels:!1,inputValue:"",lastConfiguredArgs:null,lastScriptName:null,settings:{provider:localStorage.getItem("ai-provider")||"openai",apiKey:localStorage.getItem("ai-apikey")||null,model:localStorage.getItem("ai-model")||"gpt-4o",endpoint:localStorage.getItem("ai-endpoint")||null,systemPrompt:localStorage.getItem("ai-system-prompt")||"",anthropicProxyUrl:localStorage.getItem("ai-anthropic-proxy-url")||"http://localhost:3001/api/anthropic"}},e.debugger={active:!1,halted:!1,configOpen:!1,debugFiles:[],breakpoints:{},watchExpressions:{},conditionalBreakpoints:{},breakpointModalOpen:!1,editingBreakpoint:null,currentFile:"",currentLine:0,variables:{},locals:{},memory:0,timing:0},e.extensionRegistry=new ExtensionRegistry,e.installedExtensions=[],e.allCachedExtensions=[],e.availableExtensions=[],e.loadedExtensions={},e.activeExtension=null,e.activeExtensionPanel=null,e.expandedExtensions={},e.isExtensionsModalOpen=!1,e.isLoadingExtensions=!1,e.dependencyPrompt=null,e.installingDependencies=null,e.isNewFileDialogOpen=!1,e.isSaving=!1,e.savingProgress=0,e.isTransferring=!1,e.transferringProgress="",e.isRemoving=!1,e.isLoadingFiles=!1,e.dialogs=[],e.shortcutsDisabled=!1,await i("disk"),e.savedPanelHeight=PANEL_DEFAULT$1,e.panelHeight=PANEL_CLOSED$1,e.dragStartY=0,e.dragStartHeight=0,e.logSidebarWidth=350,e.savedLogSidebarWidth=350;try{const o=await e.extensionRegistry.getInstalledExtensions();e.allCachedExtensions=o,e.installedExtensions=[...o],console.log(`[Extension Registry] Cached extensions in IDB: ${o.length}`)}catch(o){console.error("[Extensions] Failed to load installed extensions:",o),e.allCachedExtensions=[],e.installedExtensions=[]}e.cache(XTerm,"terminal"),console.log("[State Init] Terminal component cached"),typeof window<"u"&&(window.dev={state:e,registry:e.extensionRegistry,updateExtension:async o=>new Promise((r,d)=>{const a=document.createElement("input");a.type="file",a.accept=".js",a.onchange=async c=>{try{const l=await c.target.files[0].text(),p=await e.extensionRegistry.updateExtensionDev(o,l);console.log("✅ Extension updated! Click another panel, then back to reload."),r(p)}catch(l){d(l)}},a.click()}),installExtensionFromFile:async()=>new Promise((o,r)=>{const d=document.createElement("input");d.type="file",d.accept=".js",d.onchange=async a=>{try{const c=await a.target.files[0].text(),l=await e.extensionRegistry.installExtensionFromContent(c);if(console.log(`✅ Extension "${l.config.name}" installed!`),e.installedExtensions=await e.extensionRegistry.getInstalledExtensions(),e.allCachedExtensions=[...e.installedExtensions],n.emit("render"),hasOnInstallMethod(c)&&e.isConnected){showStyledModal({variant:"",icon:"📦",title:"Installing Extension Files",subtitle:l.config.name,body:"<p>Writing files to device...</p>",buttons:[]});try{const p=(k,...C)=>k.reduce((T,I,$)=>T+I+(C[$]||""),""),u=new DeviceAPI$1(BridgeDevice),f=decodeDeviceFiles(c),h=c.match(/export\s*\{\s*(\w+)\s+as\s+default\s*\}/),m=h?h[1]:null,v=c.replace(/export\s+(const|default|class|function)/g,"$1").replace(/export\s*\{[^}]*\}\s*;?/g,""),y=m?`return ${m};`:`if (typeof P !== 'undefined') return P;
                       const classMatch = ${JSON.stringify(v)}.match(/class\\s+(\\w+(?:App|Extension))\\s*{/);
                       if (classMatch) return eval(classMatch[1]);
                       throw new Error('No extension class found in bundle');`,S=new Function("DeviceAPI","html","emit","state",`
                    ${v}
                    ${y}
                  `)(DeviceAPI$1,p,n.emit.bind(n),e),x=new S(u,n.emit.bind(n),e,p);if(x.deviceFiles=f,console.log(`[Dev Install] Loaded with ${Object.keys(f).length} device files`),await x.onInstall()===!1)throw new Error("onInstall returned false (check console for details)");const b=Array.isArray(l.config.version)?l.config.version.join("."):"0.0.0";await updateDeviceExtensionRegistry(u,l.id,b),closeStyledModal(),await showStyledModal({variant:"success",icon:"✅",title:"Extension Ready",subtitle:l.config.name,body:"<p>Extension files have been installed on your device.</p>",buttons:[{id:"done",class:"fw-styled-modal-btn-primary",label:"Done"}]})}catch(p){console.error("[Dev Install] onInstall failed:",p),closeStyledModal(),await showStyledModal({variant:"danger",icon:"❌",title:"Installation Failed",subtitle:l.config.name,body:`<p>Failed to install files: ${p.message}</p>`,buttons:[{id:"close",class:"fw-styled-modal-btn-cancel",label:"Close"}]})}}else hasOnInstallMethod(c)&&await showStyledModal({variant:"warning",icon:"📦",title:"Extension Saved",subtitle:l.config.name,body:"<p>Connect to your device and open the extension to install files.</p>",buttons:[{id:"ok",class:"fw-styled-modal-btn-primary",label:"OK"}]});o(l),console.log("[Dev Install] 🔄 Reloading to apply changes..."),setTimeout(()=>location.reload(),500)}catch(c){r(c)}},d.click()})},console.log('[State Init] Dev utilities exposed: dev.updateExtension("id"), dev.installExtensionFromFile()')),e.resizePanel=function(o){const r=parseFloat(getComputedStyle(document.body).zoom)||1,d=(o.clientY-e.dragStartY)/r;e.panelHeight=e.dragStartHeight-d,e.panelHeight<=PANEL_CLOSED$1?e.savedPanelHeight=PANEL_DEFAULT$1:e.savedPanelHeight=e.panelHeight,n.emit("render")},e.resizeLogSidebar=function(o){const a=document.querySelector(".repl-panel-content");if(!a)return;const c=a.getBoundingClientRect(),l=c.width,p=c.right-o.clientX,u=l-600;p>=200&&p<=u&&(e.logSidebarWidth=p,e.savedLogSidebarWidth=p,n.emit("render"))}}function detectSystemTheme(){try{return window.matchMedia("(prefers-color-scheme: dark)").matches}catch(e){return console.warn("Failed to detect system theme:",e),!1}}function applyTheme(e){if(e.theme==="device"){const n=detectSystemTheme();e.effectiveTheme=n?"dark":"light"}else e.effectiveTheme=e.theme;e.effectiveTheme==="dark"?document.documentElement.setAttribute("data-theme","dark"):document.documentElement.removeAttribute("data-theme")}function applyColorScheme(e){document.documentElement.setAttribute("data-color-scheme",e.colorScheme)}let darkModeMediaQuery=null;function setupThemeListener(e,n){if(darkModeMediaQuery)try{darkModeMediaQuery.removeListener?darkModeMediaQuery.removeListener(handleSystemThemeChange):darkModeMediaQuery.removeEventListener&&darkModeMediaQuery.removeEventListener("change",handleSystemThemeChange)}catch{}darkModeMediaQuery=window.matchMedia("(prefers-color-scheme: dark)"),darkModeMediaQuery.addListener?darkModeMediaQuery.addListener(()=>handleSystemThemeChange(e,n)):darkModeMediaQuery.addEventListener&&darkModeMediaQuery.addEventListener("change",()=>handleSystemThemeChange(e,n))}function handleSystemThemeChange(e,n){e.theme==="device"&&(applyTheme(e),window.dispatchEvent(new CustomEvent("theme-changed")),n.emit("render"))}function initializeTheme(e,n){const i=localStorage.getItem("theme")||"dark",s=localStorage.getItem("colorScheme")||"green",o=localStorage.getItem("editorTheme")||"auto";e.theme=i,e.colorScheme=s,e.editorTheme=o,applyTheme(e),applyColorScheme(e),setupThemeListener(e,n)}function registerThemeHandlers(e,n){n.on("set-theme",i=>{console.log("set-theme",i),e.theme=i,localStorage.setItem("theme",e.theme),applyTheme(e),window.dispatchEvent(new CustomEvent("theme-changed")),n.emit("render")}),n.on("set-color-scheme",i=>{console.log("set-color-scheme",i),e.colorScheme=i,localStorage.setItem("colorScheme",e.colorScheme),applyColorScheme(e),n.emit("render")}),n.on("set-temperature-unit",i=>{console.log("set-temperature-unit",i),e.temperatureUnit=i,localStorage.setItem("temperatureUnit",e.temperatureUnit),e.isConnected&&e.statusInfo&&updateStatusBarDirectly(e.statusInfo,i||"degC"),n.emit("render")}),n.on("set-editor-theme",i=>{console.log("set-editor-theme",i),e.editorTheme=i,localStorage.setItem("editorTheme",e.editorTheme),window.dispatchEvent(new CustomEvent("editor-theme-changed",{detail:{theme:i}})),n.emit("render")})}function dismissOpenDialogs(e,n,i=null){i&&i.key!="Escape"||(window._dismissDialogsKeyHandler&&(document.removeEventListener("keydown",window._dismissDialogsKeyHandler),window._dismissDialogsKeyHandler=null),e.isConnectionDialogOpen=!1,e.isNewFileDialogOpen=!1,e.scriptOsUiModal&&e.scriptOsUiModal.isOpen&&n.emit("close-scriptos-ui-modal"),n.emit("render"))}function updateDialogDOM(e,n){const i=document.getElementById(e);return i?(n?(i.classList.remove("closed"),i.classList.add("open")):(i.classList.remove("open"),i.classList.add("closed")),!0):!1}function registerDialogHandlers(e,n,i){n.on("open-connection-dialog",async()=>{dismissOpenDialogs(e,n),await i.disconnect(),e.isConnectionDialogOpen=!0,updateDialogDOM("dialog-connection",!0)||n.emit("render");const s=o=>dismissOpenDialogs(e,n,o);document.addEventListener("keydown",s),window._dismissDialogsKeyHandler=s}),n.on("close-connection-dialog",()=>{e.isConnectionDialogOpen=!1,dismissOpenDialogs(e,n),updateDialogDOM("dialog-connection",!1)}),n.on("create-new-file",()=>{console.log("create-new-file"),dismissOpenDialogs(e,n),e.isNewFileDialogOpen=!0,updateDialogDOM("dialog-new-file",!0)||n.emit("render");const s=o=>dismissOpenDialogs(e,n,o);document.addEventListener("keydown",s),window._dismissDialogsKeyHandler=s}),n.on("close-new-file-dialog",()=>{e.isNewFileDialogOpen=!1,dismissOpenDialogs(e,n),updateDialogDOM("dialog-new-file",!1)})}function registerTerminalHandlers(e,n,i,s){let o=!1;function r(){o=!0,setTimeout(()=>{o=!1},500)}function d(p=!1){o||(n.emit("run",p),r())}function a(){canExecute({isConnected:e.isConnected})&&d()}function c(){canExecute({isConnected:e.isConnected})&&d(!0)}function l(){canExecute({isConnected:e.isConnected})&&n.emit("stop")}return n.on("run-from-button",(p=!1)=>{p?c():a()}),n.on("run",async(p=!1)=>{const u=e.openFiles.find(v=>v.id==e.editingFile);if(!u||!u.editor){console.warn("[run] No active file to execute");return}let f=u.editor.content||"";if(p&&u.editor.view){const v=u.editor.view.state,y=v.selection;if(y.ranges.some(S=>S.from!==S.to)){const S=y.ranges.filter(x=>x.from!==x.to).map(x=>v.sliceDoc(x.from,x.to)).join(`
`);S.trim().length>0&&(f=S)}}let h=!1;if(!p&&f.startsWith("# SCRIPTOS_SILENT: True")&&(h=!0,console.log("[ScriptO] Detected silent mode marker")),!p&&f.includes("# === START_CONFIG_PARAMETERS ==="))try{console.log("[ScriptO] Detected ScriptO file, parsing...");const v=parseScriptOsConfig(f);if(v){h=v.silent===!0,console.log("[ScriptO] Config parsed:",v,"silent:",h);const y={};if(v.args)for(const S in v.args){const x=v.args[S];x.value!==void 0&&(y[S]=x.value)}console.log("[ScriptO] Using default values:",y);const w=generateScriptOsCode(f,v,y);console.log("[ScriptO] Generated code length:",w.length,"original:",f.length),f=w,console.log("[ScriptO] Parsed and generated clean code successfully")}else console.log("[ScriptO] Config parsing returned null")}catch(v){console.error("[ScriptO] Error parsing config:",v)}n.emit("open-panel");let m=document.querySelector(".xterm-helper-textarea");m&&m.focus(),n.emit("render");try{bindTerminalOutput(e);let v=e.cache(s,"terminal").term;v.write(`\r
`);const y=await i.run(f,h);y&&y.trim()&&h&&v.write(y+`\r
`),v.write(TERMINAL_PROMPT),v.scrollToBottom()}catch(v){console.log("error",v),bindTerminalOutput(e);let y=e.cache(s,"terminal").term;y.write(`\r
\x1B[91mError: `+v.message+`\x1B[0m\r
`),y.write(TERMINAL_PROMPT),y.scrollToBottom()}m=document.querySelector(".cm-content"),m&&m.focus(),n.emit("render")}),n.on("stop",async()=>{if(e.panelHeight<=PANEL_CLOSED$1&&(e.panelHeight=e.savedPanelHeight),n.emit("open-panel"),n.emit("render"),e.isConnected)try{await i.interrupt()}catch(p){console.log("Stop failed:",p)}}),n.on("clear-terminal",()=>{e.cache(s,"terminal").term.clear(),n.emit("log:clear")}),n.on("terminal:write",p=>{e.cache(s,"terminal").term.write(p)}),n.on("terminal:write-prompt",()=>{e.cache(s,"terminal").term.write(TERMINAL_PROMPT)}),n.on("open-panel",()=>{n.emit("stop-resizing-panel"),e.panelHeight=e.savedPanelHeight,n.emit("render"),setTimeout(()=>{e.cache(s,"terminal").resizeTerm()},200)}),n.on("close-panel",()=>{n.emit("stop-resizing-panel"),e.savedPanelHeight=e.panelHeight,e.panelHeight=0,n.emit("render")}),n.on("start-resizing-panel",p=>{e.dragStartY=p.clientY,e.dragStartHeight=e.panelHeight;const u=document.querySelector("#panel");u&&u.classList.add("resizing"),document.body.style.userSelect="none",document.body.style.cursor="grabbing",window.addEventListener("mousemove",e.resizePanel);const f=()=>{n.emit("stop-resizing-panel")};window.addEventListener("mouseup",f,{once:!0}),document.body.addEventListener("mouseleave",f,{once:!0}),document.querySelector("#tabs").addEventListener("mouseenter",f,{once:!0})}),n.on("stop-resizing-panel",()=>{const p=document.querySelector("#panel");p&&p.classList.remove("resizing"),document.body.style.userSelect="",document.body.style.cursor="",window.removeEventListener("mousemove",e.resizePanel),setTimeout(()=>e.cache(s,"terminal").resizeTerm(),50)}),{runCode:a,runCodeSelection:c,stopCode:l}}function registerLogHandlers(e,n){e.logs={isOpen:!1,messages:[],maxMessages:1e3,autoScroll:!0},n.on("toggle-log-sidebar",()=>{e.logs.isOpen=!e.logs.isOpen,n.emit("render"),e.logs.isOpen&&e.logs.autoScroll&&setTimeout(()=>{const i=document.querySelector("#log-terminal .xterm-viewport");i&&(i.scrollTop=i.scrollHeight)},100)}),n.on("log:add",i=>{console.debug("[Log Store] log:add event received:",i),e.logs.messages.push(i),e.logs.messages.length>e.logs.maxMessages&&e.logs.messages.shift();const s=new CustomEvent("log-terminal-write",{detail:i});console.debug("[Log Store] Dispatching log-terminal-write event:",i),window.dispatchEvent(s)}),n.on("log:clear",()=>{e.logs.messages=[];const i=new CustomEvent("log-terminal-clear");window.dispatchEvent(i),n.emit("render")}),n.on("log:toggle-autoscroll",()=>{e.logs.autoScroll=!e.logs.autoScroll,n.emit("render")}),n.on("start-resizing-log-sidebar",()=>{console.log("start-resizing-log-sidebar"),window.addEventListener("mousemove",e.resizeLogSidebar);const i=()=>{n.emit("stop-resizing-log-sidebar")};window.addEventListener("mouseup",i,{once:!0}),document.body.addEventListener("mouseleave",i,{once:!0})}),n.on("stop-resizing-log-sidebar",()=>{window.removeEventListener("mousemove",e.resizeLogSidebar)})}function registerSystemConfigHandlers(e,n,i){n.on("toggle-system-menu",()=>{e.expandedSystem=!e.expandedSystem,n.emit("render")}),n.on("change-system-panel",s=>{e.activeSystemPanel=s,e.activeNetworkPanel=null,e.activePeripheralsPanel=null,e.activeExtension=null,e.activeExtensionPanel=null,e.systemSection=`system:${s}`,n.emit("render")}),n.on("load-network-interfaces-config",async()=>{if(console.log("[Network Interfaces] Loading config..."),!e.isConnected){console.warn("[Network Interfaces] Not connected to device");return}if(e.isLoadingNetworkInterfacesConfig){console.log("[Network Interfaces] Already loading, skipping");return}try{e.isLoadingNetworkInterfacesConfig=!0;const o=await i.exec(`
from lib.sys import settings
import json

config = {
    'wifi': settings.get("network.wifi.enabled", True),
    'ethernet': settings.get("network.ethernet.enabled", True),
    'wwan': settings.get("network.wwan.enabled", True)
}

print(json.dumps({'success': True, 'config': config}))
`);o&&o.success&&(e.networkInterfacesConfig=o.config,console.log("[Network Interfaces] Config loaded:",e.networkInterfacesConfig))}catch(s){console.error("[Network Interfaces] Failed to load config:",s)}finally{e.isLoadingNetworkInterfacesConfig=!1,n.emit("render")}}),n.on("save-network-interfaces-config",async s=>{if(console.log("[Network Interfaces] Saving config:",s),!e.isConnected){console.warn("[Network Interfaces] Not connected to device");return}if(!s.wifi&&!s.ethernet&&!s.wwan){alert("At least one network interface must be enabled.");return}try{e.isSavingNetworkInterfacesConfig=!0,n.emit("render");const r=`
from lib.sys import settings
import json

config_json = '${JSON.stringify(s).replace(/'/g,"\\'")}'
config = json.loads(config_json)

settings.set("network.wifi.enabled", config.get('wifi', True))
settings.set("network.ethernet.enabled", config.get('ethernet', True))
settings.set("network.wwan.enabled", config.get('wwan', True))

settings.save()

print(json.dumps({'success': True, 'message': 'Network interfaces configuration saved. Reboot to apply changes.'}))
`,d=await i.exec(r);if(d&&d.success)e.networkInterfacesConfig=s,alert("Network interfaces configuration saved. Please reboot the device to apply changes.");else throw new Error(d?.error||"Save failed")}catch(o){console.error("[Network Interfaces] Failed to save config:",o),alert(`Failed to save configuration: ${o.message}`)}finally{e.isSavingNetworkInterfacesConfig=!1,n.emit("render")}})}function registerNetworkConfigHandlers(e,n,i){const s=console.log;n.on("toggle-networks-menu",()=>{s("toggle-networks-menu"),e.expandedNetworks=!e.expandedNetworks,n.emit("render")}),n.on("change-network-panel",o=>{s("change-network-panel:",o),e.activeNetworkPanel=o,e.activeSystemPanel=null,e.activePeripheralsPanel=null,e.activeExtension=null,e.activeExtensionPanel=null,e.systemSection=`network:${o}`,o==="gps"&&!e.gpsDataLoaded&&e.isConnected&&n.emit("load-gps-data"),n.emit("render")}),n.on("load-ntp-config",async()=>{if(s("load-ntp-config"),!e.isConnected){console.warn("[NTP] Not connected to device");return}if(e.isLoadingNtpConfig){console.log("[NTP] Already loading config, skipping");return}try{e.isLoadingNtpConfig=!0;const r=await i.exec(`
from lib.sys import settings
from time import gmtime, localtime, mktime
import json

# Load config from settings API
tz_offset = settings.get("ntp.tz_offset", 0.0)
config = {
    'server': settings.get("ntp.server", "pool.ntp.org"),
    'tz_offset': tz_offset,
    'timezone': settings.get("ntp.timezone", "UTC"),
    'auto_detect': settings.get("ntp.auto_detect_tz", False)
}

# Get current RTC time if synced (year >= 2023)
utc = gmtime()
current_time = None
if utc[0] >= 2023:
    utc_timestamp = mktime(utc)
    local_timestamp = utc_timestamp + int(tz_offset * 3600)
    local = localtime(local_timestamp)
    current_time = {
        'utc': {'year': utc[0], 'month': utc[1], 'day': utc[2], 'hour': utc[3], 'minute': utc[4], 'second': utc[5]},
        'local': {'year': local[0], 'month': local[1], 'day': local[2], 'hour': local[3], 'minute': local[4], 'second': local[5]}
    }

print(json.dumps({'success': True, 'config': config, 'current_time': current_time}))
`);i.onNtpConfig&&i.onNtpConfig(r)}catch(o){console.error("[NTP] Failed to load config:",o),e.isLoadingNtpConfig=!1}}),n.on("save-ntp-config",async o=>{if(s("save-ntp-config",o),!e.isConnected){console.warn("[NTP] Not connected to device"),n.emit("ntp-config-save-error",new Error("Not connected"));return}try{const d=`
from lib.sys import settings
import json

config_json = '${JSON.stringify(o).replace(/'/g,"\\'")}'
config = json.loads(config_json)

# Save config using settings API
settings.set("ntp.server", config.get('server', config.get('server', 'pool.ntp.org')))
settings.set("ntp.tz_offset", config.get('tz_offset', config.get('tzOffset', 0.0)))
settings.set("ntp.timezone", config.get('timezone', 'UTC'))
settings.set("ntp.auto_detect_tz", config.get('auto_detect', config.get('autoDetect', False)))

settings.save()

print(json.dumps({'success': True, 'message': 'NTP configuration saved successfully'}))
`,a=await i.exec(d);if(a&&a.success)e.ntpConfig={server:o.server||"pool.ntp.org",tzOffset:o.tz_offset??o.tzOffset??0,timezone:o.timezone||"UTC",autoDetect:o.auto_detect??o.autoDetect??!1},n.emit("render"),n.emit("ntp-config-saved");else{const c=new Error(a?.error||"Save failed");throw n.emit("ntp-config-save-error",c),c}}catch(r){throw console.error("[NTP] Failed to save config:",r),alert(`Failed to save NTP configuration: ${r.message}`),n.emit("ntp-config-save-error",r),r}}),n.on("sync-ntp-time",async(o,r,d)=>{if(s("sync-ntp-time",o,r,d),!e.isConnected){console.warn("[NTP] Not connected to device");return}try{const c=`
from lib.sys.utils import sync_ntp
sync_ntp('${o}', ${r}, ${d?"True":"False"}, force=True)
`,l=await i.exec(c);if(i.onNtpSync){const p={autoDetect:d,server:o,tzOffset:r};i.onNtpSync(l,p)}}catch(a){console.error("[NTP] Failed to sync time:",a),alert(`Failed to sync NTP time: ${a.message}`)}}),n.on("load-mqtt-config",async()=>{if(s("load-mqtt-config"),!e.isConnected){console.warn("[MQTT] Not connected to device");return}if(e.isLoadingMqttConfig){console.log("[MQTT] Already loading config, skipping");return}try{e.isLoadingMqttConfig=!0;const r=await i.exec(`
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
`);i.onMqttConfig&&i.onMqttConfig(r)}catch(o){console.error("[MQTT] Failed to load config:",o),e.isLoadingMqttConfig=!1}}),n.on("save-mqtt-config",async o=>{if(s("save-mqtt-config",o),!e.isConnected){console.warn("[MQTT] Not connected to device");return}try{const d=`
from lib.sys import settings
import json

config_json = '${JSON.stringify(o).replace(/'/g,"\\'")}'
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
`,a=await i.exec(d);i.onMqttConfigSave&&i.onMqttConfigSave(a),e.mqttConfig=o,n.emit("render")}catch(r){console.error("[MQTT] Failed to save config:",r),alert(`Failed to save MQTT configuration: ${r.message}`)}}),n.on("load-wwan-config",async()=>{if(s("load-wwan-config"),!e.isConnected){console.warn("[WWAN] Not connected to device");return}if(e.isLoadingWwanConfig){console.log("[WWAN] Already loading config, skipping");return}try{e.isLoadingWwanConfig=!0;const r=await i.exec(`
from lib.sys import settings
from lib.sys.network import wwan
import json

# Load config from settings API
config = wwan.load_config()

# Map auto_init to auto_init_modem for client compatibility
config['auto_init_modem'] = config.get('auto_init', True)

# Get status from network.wwan module
status = wwan.get_status()

print(json.dumps({'success': True, 'config': config, 'status': status}))
`);i.onWwanConfig&&i.onWwanConfig(r)}catch(o){console.error("[WWAN] Failed to load config:",o),e.isLoadingWwanConfig=!1}}),n.on("save-wwan-config",async o=>{if(s("save-wwan-config",o),!e.isConnected){console.warn("[WWAN] Not connected to device");return}try{const d=`
from lib.sys import settings
import json

config_json = '${JSON.stringify(o).replace(/'/g,"\\'")}'
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
`,a=await i.exec(d);i.onWwanConfigSave&&i.onWwanConfigSave(a),e.wwanConfig=o,n.emit("render")}catch(r){console.error("[WWAN] Failed to save config:",r),alert(`Failed to save WWAN configuration: ${r.message}`)}}),n.on("load-modem-status",async()=>{if(s("load-modem-status"),!e.isConnected){console.warn("[Modem] Not connected to device");return}if(e.isLoadingModemStatus){console.log("[Modem] Already loading status, skipping");return}try{e.isLoadingModemStatus=!0;const r=await i.exec(`
from lib.sys.network import wwan
import json

status = wwan.get_status()
print(json.dumps(status))
`);i.onModemStatus&&i.onModemStatus(r)}catch(o){console.error("[Modem] Failed to load status:",o),e.isLoadingModemStatus=!1}}),n.on("load-can-config",async()=>{if(s("load-can-config"),!e.isConnected){console.warn("[CAN] Not connected to device");return}if(e.isLoadingCanConfig){console.log("[CAN] Already loading config, skipping");return}try{e.isLoadingCanConfig=!0;const r=await i.exec(`
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
`);i.onCanConfig&&i.onCanConfig(r)}catch(o){console.error("[CAN] Failed to load config:",o),e.isLoadingCanConfig=!1}}),n.on("save-can-config",async o=>{if(s("save-can-config",o),!e.isConnected){console.warn("[CAN] Not connected to device");return}try{const d=`
from lib.sys import settings
import json

config_json = '${JSON.stringify(o).replace(/'/g,"\\'")}'
config = json.loads(config_json)

# Save user preferences only (pins come from board.json, not settings)
settings.set("can.bitrate", config.get('bitrate', 500000))
settings.set("can.enabled", config.get('enabled', False))
settings.set("can.mode", config.get('mode', "NORMAL"))

settings.save()

print(json.dumps({'success': True, 'message': 'CAN configuration saved successfully'}))
`,a=await i.exec(d);i.onCanConfigSave&&i.onCanConfigSave(a),e.canConfig=o,n.emit("render")}catch(r){console.error("[CAN] Failed to save config:",r),alert(`Failed to save CAN configuration: ${r.message}`)}}),n.on("load-vpn-config",async()=>{if(s("load-vpn-config"),!e.isConnected){console.warn("[VPN] Not connected to device");return}if(e.isLoadingVpnConfig){console.log("[VPN] Already loading config, skipping");return}try{e.isLoadingVpnConfig=!0;const r=await i.exec(`
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
`);i.onVpnConfig&&i.onVpnConfig(r)}catch(o){console.error("[VPN] Failed to load config:",o),e.isLoadingVpnConfig=!1}}),n.on("vpn-save-config",async o=>{if(s("vpn-save-config",o),!e.isConnected){console.warn("[VPN] Not connected to device");return}try{const d=`
from lib.sys import settings
import json

config_json = '${JSON.stringify(o).replace(/'/g,"\\'")}'
config = json.loads(config_json)

# Save VPN config using settings API
settings.set("vpn.hostname", config.get('hostname', ''))
settings.set("vpn.join_code", config.get('join_code', ''))
settings.set("vpn.auto_connect", config.get('auto_connect', False))
settings.set("vpn.enabled", config.get('enabled', False))

settings.save()

print(json.dumps({'success': True, 'message': 'VPN configuration saved successfully'}))
`,a=await i.exec(d);i.onVpnConfigSave&&i.onVpnConfigSave(a),e.vpnConfig=o,e.vpnConfigLoaded=!0,n.emit("render")}catch(r){console.error("[VPN] Failed to save config:",r),alert(`Failed to save VPN configuration: ${r.message}`)}}),n.on("vpn-connect",async o=>{if(s("vpn-connect",o),!e.isConnected){console.warn("[VPN] Not connected to device");return}try{const r=`
import husarnet
import json

try:
    # Initialize Husarnet client first
    husarnet.init()
    
    # Join with hostname and join_code as separate arguments
    husarnet.join('${o.hostname}', '${o.join_code}')
    
    ipv6 = husarnet.get_ip()
    print(json.dumps({'success': True, 'ipv6': ipv6, 'message': 'Connected to Husarnet'}))
except Exception as e:
    import sys
    sys.print_exception(e)
    print(json.dumps({'success': False, 'error': str(e)}))
`,d=await i.exec(r);i.onVpnConnect&&i.onVpnConnect(d),e.vpnConfig=o,e.vpnConfigLoaded=!0,setTimeout(()=>{n.emit("refresh-networks")},2e3),n.emit("render")}catch(r){console.error("[VPN] Failed to connect:",r),alert(`Failed to connect to VPN: ${r.message}`)}}),n.on("vpn-disconnect",async()=>{if(s("vpn-disconnect"),!e.isConnected){console.warn("[VPN] Not connected to device");return}try{const r=await i.exec(`
import husarnet
import json

try:
    husarnet.leave()
    print(json.dumps({'success': True, 'message': 'Disconnected from Husarnet'}))
except Exception as e:
    import sys
    sys.print_exception(e)
    print(json.dumps({'success': False, 'error': str(e)}))
`);i.onVpnDisconnect&&i.onVpnDisconnect(r),e.vpnConfig&&(e.vpnConfig.enabled=!1),setTimeout(()=>{n.emit("refresh-networks")},1e3),n.emit("render")}catch(o){console.error("[VPN] Failed to disconnect:",o),alert(`Failed to disconnect VPN: ${o.message}`)}}),n.on("load-gps-data",async()=>{if(s("load-gps-data"),!e.isConnected){console.warn("[GPS] Not connected to device");return}if(e.isLoadingGpsData){console.log("[GPS] Already loading GPS data, skipping");return}try{e.isLoadingGpsData=!0,n.emit("render");const r=await i.exec(`
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
`);r&&r.success&&r.data?(e.gpsData=r.data,e.gpsDataLoaded=!0,console.log("[GPS] GPS data loaded:",e.gpsData)):(e.gpsData={},e.gpsDataLoaded=!0)}catch(o){console.error("[GPS] Failed to load GPS data:",o),e.gpsData={},e.gpsDataLoaded=!0}finally{e.isLoadingGpsData=!1,n.emit("render")}}),n.on("refresh-gps-data",async()=>{s("refresh-gps-data"),e.gpsDataLoaded=!1,n.emit("load-gps-data")}),n.on("refresh-system-info",async()=>{if(!e.isConnected){console.warn("[System Info] Not connected, cannot refresh system info");return}if(e.isLoadingSystemInfo){console.log("[System Info] Already loading, skipping");return}e.isLoadingSystemInfo=!0,n.emit("render");try{const o=await getSystemInfo(i);e.systemInfo=o,console.log("[System Info] Loaded:",o)}catch(o){console.error("[System Info] Failed to load:",o),e.systemInfo=null}finally{e.isLoadingSystemInfo=!1,n.emit("render")}}),n.on("refresh-networks",async()=>{if(s("refresh-networks"),!e.isConnected){console.warn("[Networks] Not connected, cannot refresh networks");return}if(e.isLoadingNetworks){console.log("[Networks] Already loading, skipping");return}e.isLoadingNetworks=!0,n.emit("render");try{const o=await getNetworksInfo(i);e.networksInfo=o,console.log("[Networks] Loaded:",o)}catch(o){console.error("[Networks] Failed to load:",o),e.networksInfo=null}finally{e.isLoadingNetworks=!1,n.emit("render")}}),n.on("load-eth-config",async()=>{if(s("load-eth-config"),!e.isConnected){console.warn("[Ethernet] Not connected to device");return}if(e.isLoadingEthConfig){console.log("[Ethernet] Already loading config, skipping");return}try{e.isLoadingEthConfig=!0,n.emit("render");const r=await i.exec(`
from lib.sys import settings
from lib.sys.network import eth
import json

# Load config from settings API
config = {
    'dhcp': settings.get("ethernet.dhcp", True),
    'static_ip': settings.get("ethernet.static_ip", None)
}

# Get status from network.eth module
status = eth.get_status()

print(json.dumps({'success': True, 'config': config, 'status': status}))
`);i.onEthConfig&&i.onEthConfig(r)}catch(o){console.error("[Ethernet] Failed to load config:",o),e.isLoadingEthConfig=!1,n.emit("render")}}),n.on("save-eth-config",async o=>{if(s("save-eth-config",o),!e.isConnected){console.warn("[Ethernet] Not connected to device");return}try{const d=`
from lib.sys import settings
import json

config_json = '${JSON.stringify(o).replace(/'/g,"\\'")}'
config = json.loads(config_json)

# Save config using settings API
settings.set("ethernet.dhcp", config.get('dhcp', True))
if config.get('static_ip'):
    settings.set("ethernet.static_ip", config.get('static_ip'))
else:
    settings.set("ethernet.static_ip", None)

settings.save()

print(json.dumps({'success': True, 'message': 'Ethernet configuration saved'}))
`,a=await i.exec(d);i.onEthConfigSave&&i.onEthConfigSave(a),e.ethConfig=o,n.emit("render")}catch(r){console.error("[Ethernet] Failed to save config:",r),alert(`Failed to save Ethernet configuration: ${r.message}`)}}),n.on("init-ethernet",async()=>{if(s("init-ethernet"),!e.isConnected){console.warn("[Ethernet] Not connected to device");return}try{e.isInitializingEth=!0,n.emit("render");const r=await i.exec(`
from lib.sys.network import eth
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
`);i.onEthInit&&i.onEthInit(r),e.isInitializingEth=!1,n.emit("refresh-networks")}catch(o){console.error("[Ethernet] Failed to initialize:",o),e.isInitializingEth=!1,alert(`Failed to initialize Ethernet: ${o.message}`),n.emit("render")}}),n.on("refresh-eth-status",async()=>{if(s("refresh-eth-status"),!!e.isConnected)try{const r=await i.exec(`
from lib.sys.network import eth
import json
print(json.dumps(eth.get_status()))
`);i.onEthStatus&&i.onEthStatus(r)}catch(o){console.error("[Ethernet] Failed to get status:",o)}}),n.on("load-twilio-config",async()=>{if(s("load-twilio-config"),!e.isConnected){console.warn("[Twilio] Not connected to device");return}if(e.isLoadingTwilioConfig){console.log("[Twilio] Already loading config, skipping");return}try{e.isLoadingTwilioConfig=!0;const r=await i.exec(`
from lib.sys import settings
import json

# Load config from settings API
config = {
    'account_sid': settings.get("twilio.account_sid", ""),
    'auth_token': settings.get("twilio.auth_token", ""),
    'from_number': settings.get("twilio.from_number", "")
}

print(json.dumps({'success': True, 'config': config}))
`);r&&r.success&&r.config&&(e.twilioConfig=r.config,e.twilioConfigLoaded=!0),e.isLoadingTwilioConfig=!1,n.emit("render")}catch(o){console.error("[Twilio] Failed to load config:",o),e.isLoadingTwilioConfig=!1}}),n.on("save-twilio-config",async o=>{if(s("save-twilio-config",o),!e.isConnected){console.warn("[Twilio] Not connected to device");return}try{const d=`
from lib.sys import settings
import json

config_json = '${JSON.stringify(o).replace(/'/g,"\\'")}'
config = json.loads(config_json)

# Save config using settings API
settings.set("twilio.account_sid", config.get('account_sid', ''))
settings.set("twilio.auth_token", config.get('auth_token', ''))
settings.set("twilio.from_number", config.get('from_number', ''))

settings.save()

print(json.dumps({'success': True, 'message': 'Twilio configuration saved successfully'}))
`,a=await i.exec(d);a&&a.success?(e.twilioConfig=o,e.twilioConfigLoaded=!0,n.emit("render"),alert("Twilio configuration saved!")):alert("Failed to save Twilio configuration")}catch(r){console.error("[Twilio] Failed to save config:",r),alert(`Failed to save Twilio configuration: ${r.message}`)}})}function registerHardwareConfigHandlers(e,n,i){const s=console.log;n.on("toggle-peripherals-menu",()=>{s("toggle-peripherals-menu"),e.expandedPeripherals=!e.expandedPeripherals,n.emit("render")}),n.on("change-peripherals-panel",o=>{s("change-peripherals-panel:",o),e.activePeripheralsPanel=o,e.activeNetworkPanel=null,e.activeSystemPanel=null,e.activeExtension=null,e.activeExtensionPanel=null,e.systemSection=`peripherals:${o}`,o==="gps"&&e.isConnected&&!e.gpsDataLoaded&&!e.isLoadingGpsData&&n.emit("load-gps-data"),o==="sdcard"&&e.isConnected&&(e.sdcardInfo=null,n.emit("sdcard-get-info")),n.emit("render")}),n.on("sdcard-unmount",async()=>{if(s("sdcard-unmount"),!e.isConnected){console.warn("[SD Card] Not connected to device");return}if(e.isUnmountingSDCard){console.log("[SD Card] Already unmounting, skipping");return}try{e.isUnmountingSDCard=!0,n.emit("render");const r=await i.exec(`
import os
import json

mount_point = '/sd'

try:
    os.umount(mount_point)
except OSError:
    pass

# Clear the storage module's SD card reference
try:
    import lib.sys.storage as _storage
    if _storage._sd_card is not None:
        _storage._sd_card.deinit()
        _storage._sd_card = None
except:
    pass

import gc
gc.collect()
print(json.dumps({'success': True, 'message': 'SD card unmounted successfully'}))
`);i.onSdcardUnmount&&i.onSdcardUnmount(r),e.sdcardInfo={error:"SD card unmounted"},e.isUnmountingSDCard=!1,n.emit("render")}catch(o){console.error("[SD Card] Failed to unmount:",o),e.isUnmountingSDCard=!1,alert(`Failed to unmount SD card: ${o.message}`),n.emit("render")}}),n.on("sdcard-mount",async()=>{if(s("sdcard-mount"),!e.isConnected){console.warn("[SD Card] Not connected to device");return}if(e.isMountingSDCard){console.log("[SD Card] Already mounting, skipping");return}try{e.isMountingSDCard=!0,n.emit("render");const r=await i.exec(`
import json
result = {'success': False, 'log': []}

def log_msg(msg):
    result['log'].append(msg)
    print(msg)

try:
    from lib.sys.storage import mount_sdcard, get_sd_card
    import os
    
    ok = mount_sdcard()
    if not ok:
        result['error'] = 'SD card mount failed (no card or hardware error)'
        print(json.dumps(result))
    else:
        sd = get_sd_card()
        info = sd.info()
        capacity_gb = (info[0] * info[1]) / (1024**3)
        log_msg(f"Mounted {capacity_gb:.1f} GB card")
        
        mount_point = '/sd'
        stat = os.statvfs(mount_point)
        total = stat[0] * stat[2]
        free = stat[0] * stat[3]
        used = total - free
        
        result['success'] = True
        result['info'] = {
            'mountPoint': mount_point,
            'cardCapacity': info[0],
            'sectorSize': info[1],
            'totalSize': total,
            'freeSize': free,
            'usedSize': used
        }
        print(json.dumps(result))
except Exception as e:
    import sys
    log_msg(f"Failed: {e}")
    result['error'] = str(e)
    print(json.dumps(result))
`);i.onSdcardMount&&i.onSdcardMount(r)}catch(o){console.error("[SD Card] Failed to mount:",o),e.isMountingSDCard=!1,alert(`Failed to mount SD card: ${o.message}`),n.emit("render")}}),n.on("sdcard-get-info",async()=>{if(s("sdcard-get-info"),!e.isConnected){console.warn("[SD Card] Not connected to device");return}if(e.isLoadingSdcardInfo){console.log("[SD Card] Already loading info, skipping");return}try{e.isLoadingSdcardInfo=!0,n.emit("render");const r=await i.exec(`
import os
import json

mount_point = '/sd'

try:
    os.stat(mount_point)
    
    # Get physical card capacity from storage module
    card_capacity = 0
    sector_size = 0
    try:
        from lib.sys.storage import get_sd_card
        _sd = get_sd_card()
        if _sd:
            _ci = _sd.info()
            card_capacity = _ci[0]
            sector_size = _ci[1]
    except:
        pass
    
    # Get filesystem stats
    stat = os.statvfs(mount_point)
    block_size = stat[0]
    total_blocks = stat[2]
    free_blocks = stat[3]
    
    total_size = block_size * total_blocks
    free_size = block_size * free_blocks
    used_size = total_size - free_size
    
    info = {
        'mountPoint': mount_point,
        'cardCapacity': card_capacity,
        'sectorSize': sector_size,
        'totalSize': total_size,
        'freeSize': free_size,
        'usedSize': used_size,
        'blockSize': block_size
    }
    print(json.dumps({'success': True, 'info': info}))
    
except OSError as e:
    print(json.dumps({'success': False, 'error': f'SD Card not mounted at {mount_point}'}))
except Exception as e:
    print(json.dumps({'success': False, 'error': str(e)}))
`);i.onSdcardInfo&&i.onSdcardInfo(r)}catch(o){console.error("[SD Card] Failed to get info:",o),e.isLoadingSdcardInfo=!1,e.sdcardInfo={error:`Failed to get storage info: ${o.message}`},n.emit("render")}})}const STATUS_INFO_POLL_INTERVAL=1e4;let statusInfoPollInterval=null,statusInfoPollingEnabled=!1;function startStatusInfoPolling$1(e,n,i){stopStatusInfoPolling$1(),statusInfoPollingEnabled=!0;let s=null;statusInfoPollInterval=setInterval(async()=>{if(!statusInfoPollingEnabled)return;if(!n.isConnected||!e){stopStatusInfoPolling$1();return}const o=n.isTransferring,r=n.installingDependencies,d=e.isFileOperationActive&&e.isFileOperationActive(),a=e.isCommandRunning&&e.isCommandRunning();if(o||r||d||a){const c=o?"transferring":d?"fileOp":a?"command":"deps";c!==s&&(console.log(`[Store] Status info polling paused: ${c}`),s=c);return}s&&(console.log("[Store] Status info polling resuming"),s=null);try{const c=await e.exec("getStatusInfo()");c&&(n.statusInfo=c,updateStatusBarDirectly(c,n.temperatureUnit||"degC"))}catch(c){console.debug("[Store] Status info poll failed:",c.message)}},STATUS_INFO_POLL_INTERVAL)}function stopStatusInfoPolling$1(){statusInfoPollingEnabled=!1,statusInfoPollInterval&&(clearInterval(statusInfoPollInterval),statusInfoPollInterval=null,console.log("[Store] Stopped status info polling"))}function registerConnectionHandlers(e,n,i,s,o){n.on("disconnected",()=>{stopStatusInfoPolling$1(),e.isConnected=!1,e.connectionMode="none",e.panelHeight=PANEL_CLOSED$1,e.boardFiles=[],e.boardNavigationPath="/",e.filesLoadedOnce=!1,e.isTransferring=!1,e.transferringProgress="",e.isSaving=!1,e.savingProgress=0,e.isRemoving=!1,e.bannerDisplayed=!1,e.systemInfoAttempted=!1;for(const r in e.loadedExtensions)e.loadedExtensions[r].instance=null;n.emit("refresh-files"),n.emit("render"),e.isResettingHard&&(e.isResettingHard=!1,setTimeout(()=>{n.emit("open-connection-dialog")},100))}),n.on("disconnect",async()=>{e._userDisconnected=!0,e._reconnectTimer&&(clearTimeout(e._reconnectTimer),e._reconnectTimer=null),e.isReconnecting=!1,await i.disconnect(),n.emit("disconnected")}),n.on("reconnecting",()=>{if(e.isReconnecting){console.log("[Store] Reconnect already in progress, ignoring duplicate");return}if(e._userDisconnected){n.emit("disconnected");return}console.log("[Store] Connection lost - starting auto-reconnect"),stopStatusInfoPolling$1(),e.isReconnecting=!0,e.reconnectAttempt=0,e.isConnected=!1,e.connectionMode="none",n.emit("render");const r=localStorage.getItem("webrepl-url"),d=localStorage.getItem("webrepl-password")||"";if(!r){console.warn("[Store] No saved connection URL, falling back to disconnect"),e.isReconnecting=!1,n.emit("disconnected");return}const a=20,c=3e3,l=async()=>{if(e.isReconnecting){e.reconnectAttempt++,console.log(`[Store] Reconnect attempt ${e.reconnectAttempt}/${a}`),n.emit("render");try{await i.connect(r,d),console.log("[Store] Reconnected successfully"),e.isReconnecting=!1,e.reconnectAttempt=0,e.isConnected=!0,e.connectionMode="webrepl",e._reconnectTimer=null,s(),n.emit("render"),startStatusInfoPolling$1(i,e,n);try{const p=await i.exec("getStatusInfo()");p&&(e.statusInfo=p,updateStatusBarDirectly(p,e.temperatureUnit||"degC"))}catch{}}catch(p){if(console.log(`[Store] Reconnect attempt ${e.reconnectAttempt} failed:`,p.message),e.reconnectAttempt>=a){console.warn("[Store] Max reconnect attempts reached, giving up"),e.isReconnecting=!1,e._reconnectTimer=null,n.emit("disconnected");return}e.isReconnecting&&(e._reconnectTimer=setTimeout(l,c))}}};e._reconnectTimer=setTimeout(l,c)}),n.on("reconnect-cancel",()=>{console.log("[Store] Reconnect cancelled by user"),e._reconnectTimer&&(clearTimeout(e._reconnectTimer),e._reconnectTimer=null),e.isReconnecting=!1,n.emit("disconnected")}),n.on("connection-timeout",async()=>{e.isConnected=!1,e.isConnecting=!1,e.isConnectionDialogOpen=!0,n.emit("render")}),n.on("connect",async()=>{n.emit("open-connection-dialog")}),n.on("connect-webrepl",async({wsUrl:r,password:d})=>{r&&localStorage.setItem("webrepl-url",r),d&&localStorage.setItem("webrepl-password",d),e.isConnecting=!0,n.emit("render"),updateOverlayDirectly(e);const a=e.cache(XTerm,"terminal");a&&a.term&&a.bindInput(e,i),o(e);try{await i.connect(r,d),e.isConnecting=!1,e.isConnected=!0,e.connectionMode="webrepl",updateOverlayDirectly(e),e.boardNavigationPath="/",e.connectedPort=r,s(),n.emit("render"),e.systemSection==="file-manager"&&n.emit("refresh-files"),e._userDisconnected=!1,i.onConnectionClosed(()=>{e._userDisconnected||n.emit("reconnecting")}),i.subscribe("status_info",l=>{const p=!e.statusInfo&&l;e.statusInfo=l,p?n.emit("render"):updateStatusBarDirectly(l,e.temperatureUnit||"degC")}),i.subscribe("log",l=>{console.debug("[Connection] LOG event handler called with:",l),n.emit("log:add",l)}),i.onPlotData=l=>{},i.onDisplayUi=l=>{console.log("[ScriptO UI] Display UI command received:",l),n.emit("open-scriptos-ui-modal",l)},i.onWwanStatus=l=>{console.log("[WWAN] Status event received:",l),e.wwanStatus=l,n.emit("render")},i.onMqttConfig=l=>{console.log("[MQTT] Config received:",l),e.isLoadingMqttConfig=!1,e.mqttConfigLoaded=!0,l.success&&l.config?e.mqttConfig=l.config:e.mqttConfig={},n.emit("render")},i.onMqttConfigSave=l=>{console.log("[MQTT] Config save response:",l),l.success?n.emit("render"):alert(`Failed to save MQTT configuration: ${l.error||"Unknown error"}`)},i.onWwanConfig=l=>{console.log("[WWAN] Config received:",l),e.isLoadingWwanConfig=!1,e.wwanConfigLoaded=!0,l.success&&l.config?(e.wwanConfig=l.config,e.wwanConfig.auto_init_modem===void 0&&(e.wwanConfig.auto_init_modem=!0)):e.wwanConfig={auto_init_modem:!0},n.emit("render")},i.onWwanConfigSave=l=>{console.log("[WWAN] Config save response:",l),l.success?n.emit("render"):alert(`Failed to save WWAN configuration: ${l.error||"Unknown error"}`)},i.onModemStatus=l=>{console.log("[Modem] Status received:",l),e.isLoadingModemStatus=!1,e.modemStatusLoaded=!0,e.modemStatus=l,n.emit("render")},i.onNtpSync=(l,p)=>{if(console.log("[NTP] Sync response:",l),l.success){e.ntpConfig||(e.ntpConfig={server:"pool.ntp.org",tzOffset:0,timezone:"UTC",autoDetect:!1,autoSync:!1});const u=p?.autoDetect??e.ntpConfig.autoDetect??!1,f=p?.autoSync??e.ntpConfig.autoSync??!1,h=e.ntpConfig.timezone??"UTC";l.ntp_server?e.ntpConfig.server=l.ntp_server:p?.server&&(e.ntpConfig.server=p.server),l.tz_offset!==void 0?e.ntpConfig.tzOffset=l.tz_offset:p?.tzOffset!==void 0&&(e.ntpConfig.tzOffset=p.tzOffset),e.ntpConfig.autoDetect=u,e.ntpConfig.autoSync=f,e.ntpConfig.timezone=h,e.ntpSyncResult={utc:l.utc,local:l.local,timestamp:Date.now()},n.emit("render")}else alert(`NTP sync failed: ${l.error||"Unknown error"}`)},i.onNtpConfig=l=>{console.log("[NTP] Config received:",l),e.isLoadingNtpConfig=!1,e.ntpConfigLoaded=!0,l.success&&l.config&&(e.ntpConfig={server:l.config.server||"pool.ntp.org",tzOffset:l.config.tz_offset||0,timezone:l.config.timezone||"UTC",autoDetect:l.config.auto_detect||!1,autoSync:l.config.auto_sync||!1},l.current_time&&(e.ntpSyncResult={utc:l.current_time.utc,local:l.current_time.local,timestamp:Date.now()})),n.emit("render")},i.onNtpConfigSave=l=>{if(console.log("[NTP] Config save response:",l),l.success)n.emit("render");else{const p=new Error(l.error||"Unknown error");n.emit("ntp-config-save-error",p),alert(`Failed to save NTP configuration: ${p.message}`)}},i.onCanConfig=l=>{console.log("[CAN] Config received:",l),e.isLoadingCanConfig=!1,e.canConfigLoaded=!0,l.success&&l.config&&(e.canConfig={txPin:l.config.txPin||5,rxPin:l.config.rxPin||4,bitrate:l.config.bitrate||5e5,enabled:l.config.enabled!==void 0?l.config.enabled:!0,loopback:l.config.loopback||!1},n.emit("render"))},i.onCanConfigSave=l=>{console.log("[CAN] Config save response:",l),l.success?(n.emit("render"),alert("CAN configuration saved successfully. Device restart required for changes to take effect.")):alert(`Failed to save CAN configuration: ${l.error||"Unknown error"}`)},i.onVpnConfig=l=>{console.log("[VPN] Config received:",l),e.isLoadingVpnConfig=!1,e.vpnConfigLoaded=!0,l.success&&l.config?e.vpnConfig={hostname:l.config.hostname||"",join_code:l.config.join_code||"",auto_connect:l.config.auto_connect||!1,enabled:l.config.enabled||!1}:e.vpnConfig={hostname:"",join_code:"",auto_connect:!1,enabled:!1},n.emit("render")},i.onVpnConfigSave=l=>{console.log("[VPN] Config save response:",l),l.success?n.emit("render"):alert(`Failed to save VPN configuration: ${l.error||"Unknown error"}`)},i.onVpnConnect=l=>{console.log("[VPN] Connect response:",l),l.success?(alert(l.message||"Connected to VPN successfully!"),n.emit("refresh-networks")):alert(`Failed to connect to VPN: ${l.error||"Unknown error"}`),n.emit("render")},i.onVpnDisconnect=l=>{console.log("[VPN] Disconnect response:",l),l.success?(alert(l.message||"VPN disconnected."),n.emit("refresh-networks")):alert(`Failed to disconnect VPN: ${l.error||"Unknown error"}`),n.emit("render")},i.onVpnInfo=l=>{console.log("[VPN] Info received:",l),e.networksInfo&&(e.networksInfo.vpn=l),n.emit("render")},i.onSdcardInfo=l=>{console.log("[SD Card] Info received:",l),e.isLoadingSdcardInfo=!1,l.success&&l.info?(!l.info.cardCapacity&&e.sdcardInfo&&e.sdcardInfo.cardCapacity&&(l.info.cardCapacity=e.sdcardInfo.cardCapacity,l.info.sectorSize=e.sdcardInfo.sectorSize),e.sdcardInfo=l.info):e.sdcardInfo={error:l.error||"Failed to get storage information"},n.emit("render")},i.onSdcardMount=l=>{if(console.log("[SD Card] Mount response:",l),e.isMountingSDCard=!1,l.success){const p=l.log?l.log.join(`
`):"SD card mounted successfully";console.log(`[SD Card] Mount log:
`+p),l.info&&(e.sdcardInfo=l.info)}else{const p=l.error||"Unknown error",u=l.log?`

Log:
`+l.log.join(`
`):"";alert("Failed to mount SD card: "+p+u),e.sdcardInfo={error:p}}n.emit("render")},i.onSdcardUnmount=l=>{if(console.log("[SD Card] Unmount response:",l),e.isUnmountingSDCard=!1,l.success)console.log("[SD Card] Unmounted successfully"),e.sdcardInfo=null;else{const p=l.error||"Unknown error";alert("Failed to unmount SD card: "+p)}n.emit("render")},i.onGpioConfig=l=>{console.log("[GPIO] Config received:",l),e.isLoadingGpioConfig=!1,e.gpioConfigLoaded=!0,l.success&&l.config?e.gpioConfig=l.config:(l.chipInfo?e.gpioConfig={version:"1.0",assignments:{OUT:{digital:{PP:[],HS:[],LS:[]}},IN:{digital:{PU:[],PD:[],FLOAT:[]}},SPI0:{MISO:null,MOSI:null,SCLK:null,CS:null},SPI1:{MISO:null,MOSI:null,SCLK:null,CS:null},I2C0:{SDA:null,SCL:null},I2C1:{SDA:null,SCL:null},UART0:{TXD:null,RXD:null},UART1:{TXD:null,RXD:null},UART2:{TXD:null,RXD:null},CAN:{TX:null,RX:null},PWM:{channels:{}},NEO:{DIN:null,count:0},BUZZ:{PWM:null},BOOT:{pin:0,mode:"INPUT_PULLUP"},SDCARD:{CMD:null,CLK:null,D0:null,D1:null,D2:null,D3:null,mode:"SPI"},BRIDGE:{0:{HS:null,LS:null},1:{HS:null,LS:null}},USB:{DP:null,DM:null,enabled:!1}},metadata:{...l.chipInfo,board:l.chipInfo.board||"Unknown",modified:null}}:e.gpioConfig=null,console.warn("[GPIO] Config not found, using defaults with chip info")),n.emit("render")},i.onGpioConfigSave=l=>{console.log("[GPIO] Config save response:",l),l.success?(alert("GPIO configuration saved successfully"),n.emit("render")):alert(`Failed to save GPIO configuration: ${l.error||"Unknown error"}`)},i.onEthConfig=l=>{console.log("[Ethernet] Config received:",l),e.isLoadingEthConfig=!1,e.ethConfigLoaded=!0,l.success?(e.ethConfig=l.config||{},e.ethStatus=l.status||{}):(e.ethConfig={enabled:!0,dhcp:!0},console.warn("[Ethernet] Config not found, using defaults")),n.emit("render")},i.onEthConfigSave=l=>{console.log("[Ethernet] Config save response:",l),l.success?alert("Ethernet configuration saved successfully"):alert(`Failed to save Ethernet configuration: ${l.error||"Unknown error"}`),n.emit("render")},i.onEthInit=l=>{console.log("[Ethernet] Init response:",l),e.isInitializingEth=!1,l.success&&l.status?(e.ethStatus=l.status,l.status.gotip?alert(`Ethernet connected: ${l.status.ip}`):l.status.linkup?alert("Ethernet link up, waiting for DHCP..."):alert("Ethernet initialized (no cable detected)")):alert(`Ethernet initialization failed: ${l.error||"Unknown error"}`),n.emit("render")},i.onEthStatus=l=>{console.log("[Ethernet] Status received:",l),e.ethStatus=l,n.emit("render")},window.handleIframeMessage=async l=>{if(!l.data||l.data.type!=="execute")return;const{id:p,code:u}=l.data;console.log("[Iframe Bridge] Executing code from iframe:",u.substring(0,50)+"...");try{const f=await i.run(u,!0);console.log("[Iframe Bridge] Raw output from device:",f.substring(0,200));const h=f.indexOf("{");let m=f;if(h!==-1){let v=0,y=-1;for(let w=h;w<f.length;w++)if(f[w]==="{"&&v++,f[w]==="}"&&v--,v===0){y=w+1;break}y!==-1&&(m=f.substring(h,y),console.log("[Iframe Bridge] Extracted JSON:",m.substring(0,100)+"..."))}l.source.postMessage({type:"result",id:p,data:m},"*"),console.log("[Iframe Bridge] Result sent to iframe")}catch(f){console.log("[Iframe Bridge] Error executing code:",f),l.source.postMessage({type:"error",id:p,error:f.message||"Execution failed"},"*")}},window.addEventListener("message",window.handleIframeMessage);const c=e.cache(XTerm,"terminal");c&&c.term&&c.term.clear(),e.panelHeight=PANEL_DEFAULT$1,n.emit("open-panel"),n.emit("close-connection-dialog");try{const l=await i.exec("getStatusInfo()");l&&(e.statusInfo=l,n.emit("render"))}catch{}startStatusInfoPolling$1(i,e,n),n.emit("refresh-system-info"),setTimeout(()=>{n.emit("terminal-focus")},200),(async()=>{try{const l=await i.exec(`
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
firmware_version = None
try:
    with open('/settings/board.json', 'r') as f:
        config = json.load(f)
        # Version is in identity.revision
        v = config.get('identity', {}).get('revision')
        if v is not None:
            version = str(v) if not isinstance(v, str) else v
        description = config.get('description') or config.get('identity', {}).get('description')
        hardware = config.get('devices')
        sdmmc = config.get('resources', {}).get('sdmmc')
except Exception as e:
    # Log error for debugging (version will default to '0.0')
    import sys
    sys.print_exception(e)

# Read platform firmware version baked into VFS by GHA build
try:
    with open('/firmware-version.json', 'r') as f:
        firmware_version = json.load(f)
except:
    pass

print(json.dumps({
  'board_id': board_id,
  'board_name': board_name,
  'chip': chip,
  'version': version,
  'firmware_version': firmware_version,
  'machine': os.uname().machine,
  'description': description,
  'hardware': hardware,
  'sdmmc': sdmmc
}))
`),p=typeof l=="object"?l:JSON.parse(l.trim());e.boardConfig={board_id:p.board_id,board_name:p.board_name,chip:p.chip,version:p.version,firmware_version:p.firmware_version,description:p.description,hardware:p.hardware,sdmmc:p.sdmmc};try{const f=new URL(r).hostname,h=p.board_id||f.replace(/\\./g,"-");await BridgeDisk.addOnboardedDevice(h,{hostname:f,url:r,board_id:p.board_id,board_name:p.board_name,chip:p.chip,version:p.version,connectedAt:new Date().toISOString()}),console.log("[Connection] Device saved to /onboarded/"),e.needsOnboarding=!1}catch(u){console.warn("[Connection] Could not save device to /onboarded/:",u)}n.emit("render")}catch(l){console.error("[BoardConfig] Failed to load board config:",l)}try{const l=(await __vitePreload(async()=>{const{DeviceAPI:S}=await Promise.resolve().then(()=>deviceApi);return{DeviceAPI:S}},void 0)).DeviceAPI,{updateDeviceExtensionRegistry:p,needsInstall:u}=await __vitePreload(async()=>{const{updateDeviceExtensionRegistry:S,needsInstall:x}=await Promise.resolve().then(()=>deviceRegistry);return{updateDeviceExtensionRegistry:S,needsInstall:x}},void 0),f=new l(BridgeDevice),h=await readDeviceExtensionRegistry(f),m=new Set(Object.keys(h)),v=localStorage.getItem("pending-extension-id"),y=sessionStorage.getItem("extension-install-active");for(const S in e.loadedExtensions)e.loadedExtensions[S].instance=null;if(y)console.log(`[Extensions] Skipping prune — install in progress for: ${y}`);else{const S=e.allCachedExtensions.filter(x=>!m.has(x.id)&&x.id!==v);S.length>0&&console.log(`[Extensions] Hiding ${S.length} extension(s) not on this device: ${S.map(x=>x.id).join(", ")}`),e.installedExtensions=e.allCachedExtensions.filter(x=>m.has(x.id)||x.id===v)}const w=Object.keys(h).filter(S=>!e.installedExtensions.some(x=>x.id===S));if(w.length>0){console.log(`[Extensions] Device has ${w.length} extension(s) not cached in IDB: ${w.join(", ")}`);try{const{ExtensionRegistry:S}=await __vitePreload(async()=>{const{ExtensionRegistry:k}=await Promise.resolve().then(()=>extensionLoader);return{ExtensionRegistry:k}},void 0),x=new S,E=e.registryUrl||"https://cheerful-stoat-894.convex.site/api/v1/extensions",b=await x.loadIndex(E);for(const k of w){const C=b.find(T=>T.id===k);C?(console.log(`[Extensions] Re-installing ${k} from registry into IDB cache...`),await x.installExtension(C)):console.warn(`[Extensions] Extension ${k} not found in registry, skipping re-add`)}e.installedExtensions=await x.getInstalledExtensions(),e.allCachedExtensions=[...e.installedExtensions]}catch(S){console.warn("[Extensions] Could not re-add extensions from registry:",S)}}console.log(`[Extensions] Device registry has ${Object.keys(h).length} extensions, sidebar showing: ${e.installedExtensions.map(S=>S.id).join(", ")||"(none)"}`),n.emit("render"),v&&!h[v]&&(console.log(`[Extensions] Pending extension ${v} not in device registry — running onInstall`),(async()=>{try{const{ExtensionRegistry:S}=await __vitePreload(async()=>{const{ExtensionRegistry:_}=await Promise.resolve().then(()=>extensionLoader);return{ExtensionRegistry:_}},void 0),x=new S,E=await x.getExtension(v);if(!E||!E.content){console.warn(`[Extensions] No cached data for ${v}, skipping onInstall`);return}const b=decodeDeviceFiles(E.content);if(Object.keys(b).length===0){console.log(`[Extensions] ${v} has no device files, skipping onInstall`);const _=E.config?.version,P=Array.isArray(_)?_.join("."):String(_||"0.0.0");await p(f,v,P);return}const k=new Blob([E.content],{type:"text/javascript"}),C=URL.createObjectURL(k);let T;try{T=(await import(C)).default}finally{URL.revokeObjectURL(C)}if(!T){console.warn(`[Extensions] No default export in ${v} bundle`);return}const{html:I}=await __vitePreload(async()=>{const{html:_}=await import("./vendor-B7iaGaih.js");return{html:_}},__vite__mapDeps([1,2,3])),$=new T(f,n.emit.bind(n),e,I);if($.deviceFiles=b,typeof $.onInstall=="function"){if(console.log(`[Extensions] Running onInstall for ${v}...`),await $.onInstall()===!1){console.error(`[Extensions] onInstall returned false for ${v}`);return}const P=E.config?.version,N=Array.isArray(P)?P.join("."):String(P||"0.0.0");await p(f,v,N),console.log(`[Extensions] onInstall complete for ${v}`)}localStorage.removeItem("pending-extension-id"),sessionStorage.removeItem("extension-install-active"),e.installedExtensions=await x.getInstalledExtensions(),e.allCachedExtensions=[...e.installedExtensions],n.emit("render")}catch(S){console.error(`[Extensions] Deferred onInstall failed for ${v}:`,S)}})())}catch(l){console.warn("[Extensions] Could not read device extension registry:",l)}})(),n.emit("render")}catch(c){let l="Connection failed";c instanceof Error||c&&c.message?l=c.message:c&&c.type==="error"&&(l=`WebSocket connection failed. Check if device is available at ${r}`),console.log("✗ Connection failed:",l);const p=r.startsWith("wss://"),u=l.includes("timeout")||l.includes("Timeout");if(l.includes("Authentication failed")||l.includes("Invalid password"))e.connectionError={message:"Wrong password — check your WebREPL password and try again",authHint:!0};else if(p&&!u)try{const m=new URL(r.replace("wss://","https://")).origin;e.connectionError={message:l,certHint:!0,certUrl:m}}catch{e.connectionError={message:l}}else e.connectionError={message:l};e.isConnecting=!1,e.isConnected=!1,e.isConnectionDialogOpen=!0,updateOverlayDirectly(e),n.emit("render")}}),n.on("open-reset-dialog",()=>{e.isResetDialogOpen=!0,n.emit("render")}),n.on("close-reset-dialog",()=>{e.isResetDialogOpen=!1,n.emit("render")}),n.on("trigger-reset",async r=>{e.isResetDialogOpen=!1,n.emit("render");try{r===1?(console.log("[Connection] Triggering Hard Reset"),e.isResettingHard=!0,await i.reset(1),console.log("[Connection] Hard reset sent, waiting for disconnect...")):(console.log("[Connection] Triggering Soft Reset"),await i.reset(0))}catch(d){console.error("[Connection] Reset failed:",d),e.isResettingHard=!1,alert("Reset failed: "+d.message)}}),n.on("bind-terminal-input",()=>{const r=e.cache(XTerm,"terminal");!r||!r.term||r.bindInput(e,i)&&console.log("[Connection] Bound terminal input after view change")}),n.on("terminal-focus",async()=>{if(!e.isConnected||e.bannerDisplayed)return;const r=e.cache(XTerm,"terminal");if(!r||!r.term)return;const d=r.term;try{const a=await i.exec(`
import os, json
u = os.uname()
print(json.dumps({"version": u.version, "machine": u.machine}))
`);if(a){const c=`MicroPython ${a.version} on ${a.machine}`;d.write(`\r
\x1B[1;32m`+c+`\x1B[0m\r
`),d.write(`\x1B[0mType "help()" for more information.\r
`)}}catch(a){console.debug("[Connection] Failed to fetch version info:",a.message)}d.write(TERMINAL_PROMPT),d.scrollToBottom(),e.bannerDisplayed=!0,console.log("[Connection] Welcome banner displayed")})}function registerFileOperationHandlers(e,n,i,s,o,r,d){n.on("save",async()=>{if(console.log("save"),canSave({isConnected:e.isConnected,openFiles:e.openFiles,editingFile:e.editingFile})==!1){console.log("can't save");return}e.isSaving=!0,updateOverlayDirectly(e);let c=e.openFiles.find(m=>m.id===e.editingFile),l=!1;const p=c.parentFolder,u=p===null;u&&(c.source=="board"?c.parentFolder=e.boardNavigationPath:c.source=="disk"&&(c.parentFolder=e.diskNavigationPath));let f=!1;if(c.source=="board"?f=await fileExists(BridgeDevice,getFullPath(e.boardNavigationRoot,c.parentFolder,c.fileName)):c.source=="disk"&&(f=await s.fileExists(s.getFullPath(e.diskNavigationRoot,c.parentFolder,c.fileName))),(u||!f)&&(c.source=="board"?(c.parentFolder=e.boardNavigationPath,l=await fileExists(BridgeDevice,getFullPath(e.boardNavigationRoot,c.parentFolder,c.fileName))):c.source=="disk"&&(c.parentFolder=e.diskNavigationPath,l=await s.fileExists(s.getFullPath(e.diskNavigationRoot,c.parentFolder,c.fileName)))),l&&await confirmDialog(`You are about to overwrite the file ${c.fileName} on your ${c.source}.

 Are you sure you want to proceed?`)!==0){e.isSaving=!1,c.parentFolder=p,updateOverlayDirectly(e),n.emit("render");return}let h=c.editor.content||"";if(c.fileName&&c.fileName.toLowerCase().endsWith(".json"))try{const m=h.trim();if(m&&(m[0]==="{"||m[0]==="[")){const v=JSON.parse(m),y=JSON.stringify(v,null,2)+`
`;y!==h&&(h=y)}}catch{}try{if(c.source=="board"){if(["main.py","boot.py"].includes(c.fileName)&&await confirmDialog(`⚠️ Warning: Saving '${c.fileName}' to device may cause disconnection.

This file is running on the device. Overwriting it may crash the connection.

Recommended: Save locally instead (to disk), then reconnect.

Continue saving to device?`,"Cancel","OK")!==0){e.isSaving=!1,updateOverlayDirectly(e),n.emit("render");return}await i.saveFile(getFullPath(e.boardNavigationRoot,c.parentFolder,c.fileName),h,{progressCallback:v=>{e.savingProgress=v,n.emit("render")}})}else c.source=="disk"&&await s.saveFileContent(s.getFullPath(e.diskNavigationRoot,c.parentFolder,c.fileName),h)}catch(m){console.log("error",m)}c.hasChanges=!1,e.isSaving=!1,e.savingProgress=0,updateOverlayDirectly(e),n.emit("refresh-files"),n.emit("render")}),n.on("select-tab",a=>{if(console.log("select-tab",a),!e.openFiles.find(l=>l.id===a)){console.warn("[select-tab] Tab not found:",a);return}e.editingFile=a,n.emit("render")}),n.on("close-tab",async a=>{console.log("close-tab",a);const c=e.openFiles.find(l=>l.id===a);if(!c){console.warn("[close-tab] Tab not found:",a);return}if(c.hasChanges&&await confirmDialog("Your file has unsaved changes. Are you sure you want to proceed?")!==0)return!1;e.openFiles=e.openFiles.filter(l=>l.id!==a),e.openFiles.length>0?e.editingFile=e.openFiles[0].id:await r("disk"),n.emit("render")}),n.on("refresh-board-files",async()=>{if(console.log("refresh-board-files"),e.isConnected)try{e.boardFiles=await getBoardFiles(getFullPath(e.boardNavigationRoot,e.boardNavigationPath,""))}catch{e.boardFiles=[]}else e.boardFiles=[];n.emit("refresh-selected-files"),n.emit("render")}),n.on("refresh-disk-files",async()=>{console.log("refresh-disk-files");try{e.diskFiles=await getDiskFiles(s.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,""))}catch(a){console.error("[FS] Error refreshing disk files:",a),e.diskNavigationRoot=null,e.diskNavigationPath="/"}n.emit("refresh-selected-files"),n.emit("render")}),n.on("refresh-files",async()=>{if(console.log("refresh-files"),e.isLoadingFiles)return;e.isLoadingFiles=!0;const a=document.getElementById("overlay");a?(a.classList.remove("closed"),a.classList.add("open"),a.innerHTML="<p>Loading files...</p>"):n.emit("render");try{await Promise.all([(async()=>{if(e.isConnected)try{e.boardFiles=await getBoardFiles(getFullPath(e.boardNavigationRoot,e.boardNavigationPath,""))}catch{e.boardFiles=[]}else e.boardFiles=[]})(),(async()=>{try{e.diskFiles=await getDiskFiles(s.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,""))}catch(c){console.error("[FS] Error refreshing files:",c),e.diskNavigationRoot=null,e.diskNavigationPath="/"}})()])}finally{e.isLoadingFiles=!1,n.emit("refresh-selected-files");const c=document.getElementById("overlay");c&&(c.classList.remove("open"),c.classList.add("closed")),e.systemSection==="file-manager"&&n.emit("render")}}),n.on("refresh-selected-files",()=>{e.selectedFiles=e.selectedFiles.filter(a=>a.source==="board"?e.isConnected?e.boardFiles.find(c=>a.fileName===c.fileName):!1:e.diskFiles.find(c=>a.fileName===c.fileName)),n.emit("render")}),n.on("create-new-tab",async(a,c=null)=>{const l=a=="board"?e.boardNavigationPath:e.diskNavigationPath;console.log("create-new-tab",a,c,l),await r(a,c,l)&&(n.emit("close-new-file-dialog"),n.emit("render"))}),n.on("create-file",(a,c=null)=>{console.log("create-file",a),e.creatingFile===null&&(e.creatingFile=a,e.creatingFolder=null,c!=null&&n.emit("finish-creating-file",c),n.emit("render"))}),n.on("finish-creating-file",async a=>{if(console.log("finish-creating",a),!e.creatingFile)return;if(!a){e.creatingFile=null,n.emit("render");return}if(e.creatingFile=="board"&&e.isConnected){if(await checkBoardFile({root:e.boardNavigationRoot,parentFolder:e.boardNavigationPath,fileName:a})&&await confirmDialog(`You are about to overwrite the file ${a} on your board.

Are you sure you want to proceed?`)!==0){e.creatingFile=null,n.emit("render");return}if(["main.py","boot.py"].includes(a)&&await confirmDialog(`⚠️ Warning: Saving '${a}' to device may cause disconnection.

This file is running on the device. Overwriting it may crash the connection.

Recommended: Save locally instead (to disk), then reconnect.

Continue saving to device?`)!==0){e.creatingFile=null,n.emit("render");return}await i.saveFile(getFullPath(e.boardNavigationRoot,e.boardNavigationPath,a),newFileContent)}else if(e.creatingFile=="disk"){if(await checkDiskFile({root:e.diskNavigationRoot,parentFolder:e.diskNavigationPath,fileName:a})&&await confirmDialog(`You are about to overwrite the file ${a} on your disk.

Are you sure you want to proceed?`)!==0){e.creatingFile=null,n.emit("render");return}await s.saveFileContent(s.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,a),newFileContent)}const c=e.creatingFile;setTimeout(()=>{e.creatingFile=null,dismissOpenDialogs(e,n),c==="disk"?n.emit("refresh-disk-files"):n.emit("refresh-board-files"),n.emit("render")},200)}),n.on("import-files",async()=>{console.log("import-files");try{const a=s.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,""),c=await s.importFiles(a);c.length>0&&(console.log(`[Store] Imported ${c.length} file(s):`,c.map(l=>l.name).join(", ")),n.emit("refresh-disk-files"),n.emit("render"))}catch(a){console.error("[Store] Error importing files:",a),alert(`Failed to import files: ${a.message}`)}}),n.on("upload-to-device",async()=>{if(console.log("upload-to-device"),!e.isConnected){alert("Please connect to device first");return}try{const a=document.createElement("input");a.type="file",a.multiple=!0;const c=await new Promise((u,f)=>{a.onchange=h=>{u(Array.from(h.target.files||[]))},a.oncancel=()=>u([]),a.click()});if(c.length===0)return;e.isTransferring=!0,updateOverlayDirectly(e);const l=c.map(u=>u.name),p=await checkOverwrite({source:"board",fileNames:l,parentPath:getFullPath(e.boardNavigationRoot,e.boardNavigationPath,"")});if(p.length>0){let u=`You are about to overwrite the following files/folders on your board:

`;if(p.forEach(h=>u+=`${h.fileName}
`),u+=`
Are you sure you want to proceed?`,await confirmDialog(u,"Cancel","Yes")!==0){e.isTransferring=!1,updateOverlayDirectly(e),n.emit("render");return}}for(const u of c){const f=getFullPath(e.boardNavigationRoot,e.boardNavigationPath,u.name),h=await u.arrayBuffer(),m=new Uint8Array(h);await i.saveFile(f,m,{progressCallback:v=>{e.transferringProgress=`${u.name}: ${v}%`,n.emit("render")}}),e.transferringProgress=""}n.emit("refresh-files"),n.emit("render")}catch(a){console.error("[Store] Error uploading to device:",a),alert(`Failed to upload files: ${a.message}`)}finally{e.isTransferring=!1,e.transferringProgress="",updateOverlayDirectly(e),n.emit("render")}}),n.on("create-folder",a=>{console.log("create-folder",a),e.creatingFolder===null&&(e.creatingFolder=a,e.creatingFile=null,n.emit("render"))}),n.on("finish-creating-folder",async a=>{if(console.log("finish-creating-folder",a),!!e.creatingFolder){if(!a){e.creatingFolder=null,n.emit("render");return}if(e.creatingFolder=="board"&&e.isConnected){if(await checkBoardFile({root:e.boardNavigationRoot,parentFolder:e.boardNavigationPath,fileName:a})){if(await confirmDialog(`You are about to overwrite ${a} on your board.

Are you sure you want to proceed?`)!==0){e.creatingFolder=null,n.emit("render");return}await removeBoardFolder(getFullPath(e.boardNavigationRoot,e.boardNavigationPath,a))}await createFolder(i,getFullPath(e.boardNavigationRoot,e.boardNavigationPath,a))}else if(e.creatingFolder=="disk"){if(await checkDiskFile({root:e.diskNavigationRoot,parentFolder:e.diskNavigationPath,fileName:a})){if(await confirmDialog(`You are about to overwrite ${a} on your disk.

Are you sure you want to proceed?`)!==0){e.creatingFolder=null,n.emit("render");return}await s.removeFolder(s.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,a))}await s.createFolder(s.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,a))}setTimeout(()=>{e.creatingFolder=null,n.emit("refresh-files"),n.emit("render")},200)}}),n.on("remove-files",async()=>{console.log("remove-files");let a=e.selectedFiles.filter(h=>h.source==="board").map(h=>h.fileName),c=e.selectedFiles.filter(h=>h.source==="disk").map(h=>h.fileName),l=`You are about to delete the following files:

`;if(a.length&&(l+=`From your board:
`,a.forEach(h=>l+=`${h}
`),l+=`
`),c.length&&(l+=`From your disk:
`,c.forEach(h=>l+=`${h}
`),l+=`
`),l+="Are you sure you want to proceed?",await confirmDialog(l)!==0){n.emit("render");return}let u=!1,f=!1;for(let h in e.selectedFiles){const m=e.selectedFiles[h];m.type=="folder"?m.source==="board"?(await removeBoardFolder(getFullPath(e.boardNavigationRoot,e.boardNavigationPath,m.fileName)),u=!0):(await s.removeFolder(s.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,m.fileName)),f=!0):m.source==="board"?(await deleteFile(i,getFullPath(e.boardNavigationRoot,e.boardNavigationPath,m.fileName)),u=!0):(await s.removeFile(s.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,m.fileName)),f=!0)}u&&f?n.emit("refresh-files"):u?n.emit("refresh-board-files"):f&&n.emit("refresh-disk-files"),e.selectedFiles=[],n.emit("render")}),n.on("rename-file",(a,c)=>{console.log("rename-file",a,c),e.renamingFile=a,n.emit("render")}),n.on("finish-renaming-file",async a=>{console.log("finish-renaming-file",a);const c=e.selectedFiles[0];if(!a||c.fileName==a){e.renamingFile=null,n.emit("render");return}if(e.isSaving=!0,updateOverlayDirectly(e),e.renamingFile=="board"&&e.isConnected){if((await checkOverwrite({fileNames:[a],parentPath:s.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,""),source:"board"})).length>0){let p=`You are about to overwrite the following file/folder on your board:

`;if(p+=`${a}

`,p+="Are you sure you want to proceed?",await confirmDialog(p)!==0){e.isSaving=!1,e.renamingFile=null,updateOverlayDirectly(e),n.emit("render");return}c.type=="folder"?await removeBoardFolder(getFullPath(e.boardNavigationRoot,e.boardNavigationPath,a)):c.type=="file"&&await deleteFile(i,getFullPath(e.boardNavigationRoot,e.boardNavigationPath,a))}}else if(e.renamingFile=="disk"&&(await checkOverwrite({fileNames:[a],parentPath:s.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,""),source:"disk"})).length>0){let p=`You are about to overwrite the following file/folder on your disk:

`;if(p+=`${a}

`,p+="Are you sure you want to proceed?",await confirmDialog(p)!==0){e.isSaving=!1,e.renamingFile=null,updateOverlayDirectly(e),n.emit("render");return}c.type=="folder"?await s.removeFolder(s.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,a)):c.type=="file"&&await s.removeFile(s.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,a))}try{e.renamingFile=="board"?await renameFile(i,getFullPath(e.boardNavigationRoot,e.boardNavigationPath,c.fileName),getFullPath(e.boardNavigationRoot,e.boardNavigationPath,a)):await s.renameFile(s.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,c.fileName),s.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,a));const l=e.openFiles.findIndex(p=>p.fileName===c.fileName&&p.source===c.source&&p.parentFolder===c.parentFolder);l>-1&&(e.openFiles[l].fileName=a,n.emit("render"))}catch{alert(`The file ${c.fileName} could not be renamed to ${a}`)}e.isSaving=!1,e.renamingFile=null,updateOverlayDirectly(e),n.emit("refresh-files"),n.emit("render")}),n.on("rename-tab",a=>{console.log("rename-tab",a),e.renamingTab=a,n.emit("render")}),n.on("finish-renaming-tab",async a=>{console.log("finish-renaming-tab",a);const c=e.openFiles.find(m=>m.id===e.renamingTab);if(!a||c.fileName==a){e.renamingTab=null,e.isSaving=!1,updateOverlayDirectly(e),n.emit("render");return}e.isSaving=!0,updateOverlayDirectly(e);const l=c.parentFolder,p=c.fileName;c.fileName=a;const u=l===null;let f=!1;u||(c.source=="board"?f=await fileExists(BridgeDevice,getFullPath(e.boardNavigationRoot,c.parentFolder,p)):c.source=="disk"&&(f=await s.fileExists(s.getFullPath(e.diskNavigationRoot,c.parentFolder,p)))),(u||!f)&&(c.source=="board"?c.parentFolder=e.boardNavigationPath:c.source=="disk"&&(c.parentFolder=e.diskNavigationPath));let h=!1;if(c.source=="board"?h=await fileExists(BridgeDevice,getFullPath(e.boardNavigationRoot,c.parentFolder,c.fileName)):c.source=="disk"&&(h=await s.fileExists(s.getFullPath(e.diskNavigationRoot,c.parentFolder,c.fileName))),h&&await confirmDialog(`You are about to overwrite the file ${c.fileName} on your ${c.source}.

 Are you sure you want to proceed?`)!==0){e.renamingTab=null,e.isSaving=!1,c.fileName=p,n.emit("render");return}if(f){if(c.hasChanges){const m=c.editor.content||"";try{if(c.source=="board"){if(["main.py","boot.py"].includes(p)&&await confirmDialog(`⚠️ Warning: Saving '${p}' to device may cause disconnection.

This file is running on the device. Overwriting it may crash the connection.

Recommended: Save locally instead (to disk), then reconnect.

Continue saving to device?`,"Cancel","OK")!==0){e.renamingTab=null,e.isSaving=!1,c.fileName=p,updateOverlayDirectly(e),n.emit("render");return}await i.saveFile(getFullPath(e.boardNavigationRoot,c.parentFolder,p),m,{progressCallback:y=>{e.savingProgress=y,n.emit("render")}})}else c.source=="disk"&&await s.saveFileContent(s.getFullPath(e.diskNavigationRoot,c.parentFolder,p),m)}catch(v){console.log("error",v)}}try{c.source=="board"?await renameFile(i,getFullPath(e.boardNavigationRoot,c.parentFolder,p),getFullPath(e.boardNavigationRoot,c.parentFolder,c.fileName)):c.source=="disk"&&await s.renameFile(s.getFullPath(e.diskNavigationRoot,c.parentFolder,p),s.getFullPath(e.diskNavigationRoot,c.parentFolder,c.fileName))}catch(m){console.log("error",m)}}else if(!f){const m=c.editor.content||"";try{if(c.source=="board"){if(["main.py","boot.py"].includes(c.fileName)&&await confirmDialog(`⚠️ Warning: Saving '${c.fileName}' to device may cause disconnection.

This file is running on the device. Overwriting it may crash the connection.

Recommended: Save locally instead (to disk), then reconnect.

Continue saving to device?`,"Cancel","OK")!==0){e.renamingTab=null,e.isSaving=!1,c.fileName=p,updateOverlayDirectly(e),n.emit("render");return}await i.saveFile(getFullPath(e.boardNavigationRoot,c.parentFolder,c.fileName),m,{progressCallback:y=>{e.savingProgress=y,n.emit("render")}})}else c.source=="disk"&&await s.saveFileContent(s.getFullPath(e.diskNavigationRoot,c.parentFolder,c.fileName),m)}catch(v){console.log("error",v)}}c.hasChanges=!1,e.renamingTab=null,e.isSaving=!1,e.savingProgress=0,updateOverlayDirectly(e),n.emit("refresh-files"),n.emit("render")}),n.on("toggle-file-selection",(a,c,l)=>{console.log("toggle-file-selection",a,c,l);let p=c=="board"?e.boardNavigationPath:e.diskNavigationPath;if(l&&!l.ctrlKey&&!l.metaKey){e.selectedFiles=[{fileName:a.fileName,type:a.type,source:c,parentFolder:p}],n.emit("render");return}e.selectedFiles.find(f=>f.fileName===a.fileName&&f.source===c)?e.selectedFiles=e.selectedFiles.filter(f=>!(f.fileName===a.fileName&&f.source===c)):e.selectedFiles.push({fileName:a.fileName,type:a.type,source:c,parentFolder:p}),n.emit("render")}),n.on("open-selected-files",async()=>{console.log("open-selected-files");let a=[],c=[];if(!e.isLoadingFiles){e.isLoadingFiles=!0,n.emit("render");for(let l in e.selectedFiles){let p=e.selectedFiles[l];if(p.type=="folder")continue;const u=e.openFiles.find(f=>f.fileName==p.fileName&&f.source==p.source&&f.parentFolder==p.parentFolder);if(u)c.push(u);else{let f=null;if(p.source=="board"){const h=await i.loadFile(getFullPath(e.boardNavigationRoot,e.boardNavigationPath,p.fileName)),m=new Uint8Array(h),v=new TextDecoder("utf-8").decode(m);f=await o({parentFolder:e.boardNavigationPath,fileName:p.fileName,source:p.source,content:v}),f.editor.onChange=function(){f.hasChanges=!0,n.emit("render")}}else if(p.source=="disk"){const h=await s.loadFile(s.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,p.fileName)),m=new Uint8Array(h),v=new TextDecoder("utf-8").decode(m);f=await o({parentFolder:e.diskNavigationPath,fileName:p.fileName,source:p.source,content:v}),f.editor.onChange=function(){f.hasChanges=!0,n.emit("render")}}a.push(f)}}c.length>0&&(e.editingFile=c[0].id),a.length>0&&(e.editingFile=a[0].id),e.openFiles=e.openFiles.concat(a),e.selectedFiles=[],e.isLoadingFiles=!1,n.emit("change-view","editor"),n.emit("render")}}),n.on("open-file",(a,c)=>{console.log("open-file",a,c),e.selectedFiles=[{fileName:c.fileName,type:c.type,source:a,parentFolder:e[`${a}NavigationPath`]}],n.emit("open-selected-files")}),n.on("upload-files",async()=>{console.log("upload-files"),e.isTransferring=!0,n.emit("render");const a=await checkOverwrite({source:"board",fileNames:e.selectedFiles.map(c=>c.fileName),parentPath:getFullPath(e.boardNavigationRoot,e.boardNavigationPath,"")});if(a.length>0){let c=`You are about to overwrite the following files/folders on your board:

`;if(a.forEach(p=>c+=`${p.fileName}
`),c+=`
`,c+="Are you sure you want to proceed?",await confirmDialog(c)!==0){e.isTransferring=!1,n.emit("render");return}}try{for(let c in e.selectedFiles){const l=e.selectedFiles[c],p=s.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,l.fileName),u=getFullPath(e.boardNavigationRoot,e.boardNavigationPath,l.fileName);if(l.type=="folder")await uploadFolder(p,u,(f,h)=>{e.transferringProgress=`${h}: ${f}`,n.emit("render")}),e.transferringProgress="";else{const f=await BridgeDisk.loadFile(p),h=new Uint8Array(f);await i.saveFile(u,h,{progressCallback:m=>{e.transferringProgress=`${l.fileName}: ${m}%`,n.emit("render")}}),e.transferringProgress=""}}e.selectedFiles=[],e.isTransferring=!1,e.transferringProgress="",updateOverlayDirectly(e),n.emit("refresh-files"),n.emit("render")}catch(c){console.error("[Upload] Transfer failed:",c),e.isTransferring=!1,e.transferringProgress="",updateOverlayDirectly(e),n.emit("render");let l=c.message;l&&l.includes("Transfer already in progress")&&(l="Transfer already in progress. The device may have stale TFTP state from a previous disconnected transfer. Please wait a moment and try again, or disconnect and reconnect."),alert(`Upload failed: ${l}`)}}),n.on("download-files",async()=>{console.log("download-files"),e.isTransferring=!0,updateOverlayDirectly(e),n.emit("render");const a=await checkOverwrite({source:"disk",fileNames:e.selectedFiles.map(c=>c.fileName),parentPath:s.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,"")});if(a.length>0){let c=`You are about to overwrite the following files/folders on your disk:

`;if(a.forEach(p=>c+=`${p.fileName}
`),c+=`
`,c+="Are you sure you want to proceed?",await confirmDialog(c)!==0){e.isTransferring=!1,n.emit("render");return}}try{for(let c in e.selectedFiles){const l=e.selectedFiles[c],p=getFullPath(e.boardNavigationRoot,e.boardNavigationPath,l.fileName),u=s.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,l.fileName);if(l.type=="folder")await downloadFolder(p,u,f=>{e.transferringProgress=f,n.emit("render")});else{const f=await i.loadFile(p,{progressCallback:h=>{e.transferringProgress=`${l.fileName}: ${h}%`,n.emit("render")}});await BridgeDisk.saveFileContent(u,f.buffer)}}e.isTransferring=!1,e.selectedFiles=[],updateOverlayDirectly(e),n.emit("refresh-files"),n.emit("render")}catch(c){console.error("[Download] Transfer failed:",c),e.isTransferring=!1,e.transferringProgress="",updateOverlayDirectly(e),n.emit("render");let l=c.message;l&&l.includes("Transfer already in progress")&&(l="Transfer already in progress. The device may have stale TFTP state from a previous disconnected transfer. Please wait a moment and try again, or disconnect and reconnect."),alert(`Download failed: ${l}`)}}),n.on("export-files",async()=>{console.log("export-files");for(const a of e.selectedFiles)if(a.type!=="folder")try{let c;if(a.source==="board"){const m=getFullPath(e.boardNavigationRoot,e.boardNavigationPath,a.fileName),v=await i.loadFile(m);c=new Uint8Array(v)}else{const m=s.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,a.fileName),v=await s.loadFile(m);c=new Uint8Array(v)}const l=a.fileName.split(".").pop().toLowerCase(),p={png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg",webp:"image/webp",gif:"image/gif",py:"text/plain",txt:"text/plain",json:"application/json",md:"text/markdown"},u=new Blob([c],{type:p[l]||"application/octet-stream"}),f=URL.createObjectURL(u),h=document.createElement("a");h.href=f,h.download=a.fileName,document.body.appendChild(h),h.click(),document.body.removeChild(h),URL.revokeObjectURL(f)}catch(c){console.error(`[Export] Failed to export ${a.fileName}:`,c),alert(`Failed to export ${a.fileName}: ${c.message}`)}}),n.on("navigate-board-folder",a=>{console.log("navigate-board-folder",a),e.boardNavigationPath=getNavigationPath(e.boardNavigationPath,a),n.emit("refresh-files"),n.emit("render")}),n.on("navigate-board-parent",()=>{console.log("navigate-board-parent"),e.boardNavigationPath=getNavigationPath(e.boardNavigationPath,".."),n.emit("refresh-files"),n.emit("render")}),n.on("navigate-disk-folder",a=>{console.log("navigate-disk-folder",a),e.diskNavigationPath=s.getNavigationPath(e.diskNavigationPath,a),n.emit("refresh-files"),n.emit("render")}),n.on("navigate-disk-parent",()=>{console.log("navigate-disk-parent"),e.diskNavigationPath=s.getNavigationPath(e.diskNavigationPath,".."),n.emit("refresh-files"),n.emit("render")})}function debuggerStore(e,n){let i=null;console.log("[Debugger Store] Registering event handlers"),n.on("debugger:open-config",()=>{console.log("[Debugger] Opening config modal"),e.debugger.configOpen=!0,n.emit("render")}),n.on("debugger:close-config",()=>{e.debugger.configOpen=!1,n.emit("render")}),n.on("debugger:toggle-file",s=>{const o=e.debugger.debugFiles.indexOf(s);o>=0?e.debugger.debugFiles.splice(o,1):e.debugger.debugFiles.push(s),n.emit("render")}),n.on("debugger:set-watches",s=>{const o=s.split(`
`).map(r=>r.trim()).filter(r=>r.length>0);e.debugger.watchExpressions[""]=o,n.emit("render")}),n.on("debugger:start",async()=>{try{const s=e.openFiles.find(r=>r.id===e.editingFile);if(!s){console.error("[Debugger] No file open");return}const o=s.editor?s.editor.content:"";if(!o){console.error("[Debugger] No content to debug");return}e.debugger.active=!0,n.emit("render"),i=new DebugSession(e,n),await i.start(o,e.debugger.watchExpressions,e.debugger.conditionalBreakpoints,s.fileName)}catch(s){console.error("[Debugger] Failed to start:",s),e.debugger.active=!1,n.emit("render")}}),n.on("debugger:step-over",async()=>{i&&await i.stepOver()}),n.on("debugger:step-into",async()=>{i&&await i.stepInto()}),n.on("debugger:step-out",async()=>{i&&await i.stepOut()}),n.on("debugger:continue",async(s=!0)=>{i&&await i.continue(s)}),n.on("debugger:stop",async()=>{i&&(await i.stop(),i=null),e.debugger.active=!1,e.debugger.halted=!1,e.debugger.configOpen=!1,n.emit("render")}),n.on("debugger:state-update",s=>{e.debugger.currentFile=s.f,e.debugger.currentLine=s.l,e.debugger.variables=s.w,e.debugger.locals=s.v,e.debugger.memory=s.m,e.debugger.timing=s.t,e.debugger.halted=s.h,n.emit("render")}),n.on("debugger:edit-breakpoint",s=>{const{file:o,line:r}=s;e.debugger.breakpoints[o]||(e.debugger.breakpoints[o]={}),e.debugger.breakpoints[o][r]||(e.debugger.breakpoints[o][r]={condition:"",hitCount:"",enabled:!0}),e.debugger.editingBreakpoint={file:o,line:r},e.debugger.breakpointModalOpen=!0,n.emit("render")}),n.on("debugger:save-breakpoint",s=>{const{file:o,line:r,config:d}=s;e.debugger.breakpoints[o]||(e.debugger.breakpoints[o]={}),e.debugger.breakpoints[o][r]=d,e.debugger.breakpointModalOpen=!1,e.debugger.editingBreakpoint=null,n.emit("debugger:breakpoints-updated",{file:o}),n.emit("render")}),n.on("debugger:delete-breakpoint",s=>{const{file:o,line:r}=s;e.debugger.breakpoints[o]&&delete e.debugger.breakpoints[o][r],e.debugger.breakpointModalOpen=!1,e.debugger.editingBreakpoint=null,n.emit("debugger:breakpoints-updated",{file:o}),n.emit("render")}),n.on("debugger:close-breakpoint-modal",()=>{e.debugger.breakpointModalOpen=!1,e.debugger.editingBreakpoint=null,n.emit("render")})}class DebugSession{constructor(n,i){this.state=n,this.emitter=i,this.device=BridgeDevice}async start(n,i,s,o){if(console.log("[Debugger] Starting debug session for:",o),!instrumentCodeForExec){console.error("[Debugger] instrumentCodeForExec not available - debugger-utils.js may not be loaded"),this.emitter.emit("show-dialog",{title:"Debugger Error",message:"Debugger utilities not loaded. Please refresh the page.",buttons:["OK"]});return}const r=performance.now(),d=await instrumentCodeForExec(n,{watches:this.state.debugger.watchExpressions,conditionalBP:this.state.debugger.conditionalBreakpoints,breakpoints:this.state.debugger.breakpoints,fileName:o});console.log(`[Debugger] Instrumentation took ${(performance.now()-r).toFixed(0)}ms`),await this.device.interrupt(),await sleep(100),this.device.subscribe("debug-state",this.onDebugState.bind(this)),console.log("[Debugger] Executing instrumented code...");try{await this.device.run(d),console.log("[Debugger] Execution completed successfully")}catch(a){console.warn("[Debugger] Code execution ended:",a.message)}finally{this.emitter.emit("terminal:write-prompt"),this.device.unsubscribe("debug-state"),this.state.debugger.active=!1,this.state.debugger.halted=!1,this.emitter.emit("render")}}async stepInto(){console.log("[Debugger] Step Into"),await this.device.sendDebugCommand("S")}async stepOver(){console.log("[Debugger] Step Over"),await this.device.sendDebugCommand("SO")}async stepOut(){console.log("[Debugger] Step Out"),await this.device.sendDebugCommand("ST")}async continue(n=!0){console.log("[Debugger] Continue",n?"(with log)":"(no log)"),await this.device.sendDebugCommand(n?"CW":"CO")}async stop(){console.log("[Debugger] Stop"),await this.device.interrupt(),this.device.unsubscribe("debug-state")}onDebugState(n){console.log("[Debugger] State update:",n),this.emitter.emit("debugger:state-update",n),this.displayDebugState(n)}displayDebugState(n){let i=`
[DEBUG] Paused at ${n.f}:${n.l}
`;const s=Object.entries(n.w);s.length>0&&(i+=`
[WATCHES]
`,s.forEach(([r,d])=>{i+=`  ${r} = ${d}
`}));const o=Object.entries(n.v||{});o.length>0&&(i+=`
[LOCALS]
`,o.forEach(([r,d])=>{i+=`  ${r} = ${d}
`})),i+=`[DEBUG] Memory: ${this.formatBytes(n.m)} | Time: ${n.t} ms
`,this.emitter.emit("terminal:append",i)}formatBytes(n){if(!n)return"0 B";const i=1024,s=["B","KB","MB"],o=Math.floor(Math.log(n)/Math.log(i));return`${(n/Math.pow(i,o)).toFixed(1)} ${s[o]}`}}const stopStatusInfoPolling=()=>window.stopStatusInfoPolling?window.stopStatusInfoPolling():null,startStatusInfoPolling=(e,n,i)=>window.startStatusInfoPolling?window.startStatusInfoPolling(e,n,i):null;function instantiateExtension(extensionCode,state,emit,html){const deviceAPI=new DeviceAPI$1(BridgeDevice),metaMatch=extensionCode.match(/export\s+const\s+__EXTENSION_META__\s*=\s*(\{[\s\S]*?\});/);let meta={};if(metaMatch)try{meta=eval("("+metaMatch[1]+")")}catch(e){console.warn("[Extensions] Meta parse failed:",e)}const deviceFiles=decodeDeviceFiles(extensionCode),exportMatch=extensionCode.match(/export\s*\{\s*(\w+)\s+as\s+default\s*\}/),defaultExportVar=exportMatch?exportMatch[1]:null,evalCode=extensionCode.replace(/export\s+(const|default|class|function)/g,"$1").replace(/export\s*\{[^}]*\}\s*;?/g,""),returnLogic=defaultExportVar?`return ${defaultExportVar};`:`if (typeof P !== 'undefined') return P;
       const classMatch = ${JSON.stringify(evalCode)}.match(/class\\s+(\\w+(?:App|Extension))\\s*{/);
       if (classMatch) return eval(classMatch[1]);
       throw new Error('No extension class found in bundle');`,extensionFunction=new Function("DeviceAPI","html","emit","state",`
    ${evalCode}
    ${returnLogic}
  `),ExtensionClass=extensionFunction(DeviceAPI$1,html,emit,state),instance=new ExtensionClass(deviceAPI,emit,state,html);return instance.deviceFiles=deviceFiles,instance.meta=meta,console.log(`[Extensions] Loaded ${meta.name||"extension"} with ${Object.keys(deviceFiles).length} device files`),instance}function registerExtensionHandlers(e,n,i,s){const o=console.log;n.on("open-extensions-modal",async()=>{o("open-extensions-modal"),e.isExtensionsModalOpen=!0,e.isLoadingExtensions=!0,n.emit("render");try{const d=e.registryUrl||"https://cheerful-stoat-894.convex.site/api/v1/extensions";e.availableExtensions=await e.extensionRegistry.loadIndex(d),e.isLoadingExtensions=!1,n.emit("render")}catch(d){console.error("[Extensions] Error loading registry:",d),e.isLoadingExtensions=!1,e.availableExtensions=[],n.emit("render"),alert(`Failed to load extensions registry:
${d.message}`)}}),n.on("close-extensions-modal",()=>{o("close-extensions-modal"),e.isExtensionsModalOpen=!1,n.emit("render")}),n.on("install-extension",async d=>{o("install-extension:",d.name);try{const a=await e.extensionRegistry.installExtension(d);e.installedExtensions=await e.extensionRegistry.getInstalledExtensions(),e.allCachedExtensions=[...e.installedExtensions],e.isExtensionsModalOpen=!1,o(`[Extensions] Installed ${d.name}`),n.emit("render");const c=await e.extensionRegistry.getExtension(d.id);hasOnInstallMethod(c?.content)?e.isConnected&&i?await r(d,c,e,n,i):(o("[Extensions] Device not connected - extension will install files when first opened"),await showStyledModal({variant:"warning",icon:"packages",title:"Extension Saved",subtitle:d.name,body:`<p>This extension needs to install files on your device.</p>
                   <p style="color: var(--text-secondary);">Connect to your device and open the extension to complete setup.</p>`,buttons:[{id:"ok",class:"fw-styled-modal-btn-primary",label:"OK"}]})):d.mipPackage&&n.emit("prompt-upload-dependencies",{extensionId:d.id,extensionName:d.name})}catch(a){console.error("[Extensions] Installation failed:",a),alert(`Failed to install extension:
${a.message}`)}});async function r(d,a,c,l,p){const u=d.id,f=Array.isArray(d.version)?d.version.join("."):String(d.version);o(`[Extensions] Running onInstall for ${d.name}...`),showStyledModal({variant:"",icon:"packages",title:"Installing Extension",subtitle:d.name,body:`<p>Installing extension files to device...</p>
             <div style="margin-top: 16px; color: var(--text-secondary);">
               <span class="install-spinner">◐</span> Preparing...
             </div>`,buttons:[]});try{stopStatusInfoPolling();const h=(v,...y)=>v.reduce((w,S,x)=>w+S+(y[x]||""),""),m=instantiateExtension(a.content,c,l.emit.bind(l),h);if(typeof m.onInstall=="function"){updateModalBody(`<p>Writing files to device...</p>
          <div style="margin-top: 16px; color: var(--text-secondary);">
            <span class="install-spinner">◐</span> Installing...
          </div>`),await m.onInstall(),updateModalBody(`<p>Updating device registry...</p>
          <div style="margin-top: 16px; color: var(--text-secondary);">
            <span class="install-spinner">◐</span> Finalizing...
          </div>`);const v=new DeviceAPI$1(BridgeDevice);await updateDeviceExtensionRegistry(v,u,f),o(`[Extensions] onInstall complete for ${d.name}`)}closeStyledModal(),await showStyledModal({variant:"success",icon:"check",title:"Extension Ready",subtitle:d.name,body:"<p>Extension files have been installed on your device.</p>",buttons:[{id:"done",class:"fw-styled-modal-btn-primary",label:"Done"}]})}catch(h){console.error("[Extensions] onInstall failed:",h),closeStyledModal(),await showStyledModal({variant:"danger",icon:"alert-triangle",title:"Installation Failed",subtitle:d.name,body:`<p>Failed to install extension files:</p>
               <p style="color: var(--error-color)">${h.message}</p>
               <p style="margin-top: 12px; color: var(--text-secondary);">
                 You can try again by opening the extension panel.
               </p>`,buttons:[{id:"close",class:"fw-styled-modal-btn-cancel",label:"Close"}]})}finally{c.isConnected&&p&&startStatusInfoPolling(p,c,l)}}n.on("update-extension",async({extension:d,newVersion:a})=>{o("update-extension:",d.id,`v${d.version.join(".")} → v${a.version.join(".")}`);try{delete e.loadedExtensions[d.id];const c=`extension-styles-${d.id}`,l=document.getElementById(c);l&&(l.remove(),console.log(`[Extensions] Removed old styles for ${d.id}`)),await e.extensionRegistry.uninstallExtension(d.id),await e.extensionRegistry.installExtension(a),e.installedExtensions=await e.extensionRegistry.getInstalledExtensions(),e.allCachedExtensions=[...e.installedExtensions],e.activeExtension===d.id&&n.emit("change-extension-panel",{extensionId:d.id,panelId:e.activeExtensionPanel||a.menu[0].id}),o(`[Extensions] Updated ${d.name} to v${a.version.join(".")}`);const p=await e.extensionRegistry.getExtension(d.id);hasOnInstallMethod(p?.content)?e.isConnected&&i?await r(a,p,e,n,i):o("[Extensions] Device not connected - updated files will install when first opened"):a.mipPackage&&n.emit("prompt-upload-dependencies",{extensionId:d.id,extensionName:d.name}),n.emit("render")}catch(c){console.error("[Extensions] Update failed:",c),alert(`Failed to update extension:
${c.message}`)}}),n.on("uninstall-extension",async d=>{o("uninstall-extension:",d);try{await e.extensionRegistry.uninstallExtension(d),delete e.loadedExtensions[d];const a=`extension-styles-${d}`,c=document.getElementById(a);c&&(c.remove(),console.log(`[Extensions] Removed styles for ${d}`)),e.installedExtensions=await e.extensionRegistry.getInstalledExtensions(),e.allCachedExtensions=[...e.installedExtensions],e.activeExtension===d&&(e.activeExtension=null,e.activeExtensionPanel=null,e.systemSection="settings"),o(`[Extensions] Uninstalled ${d}`),n.emit("render")}catch(a){console.error("[Extensions] Uninstall failed:",a),alert(`Failed to uninstall extension:
${a.message}`)}}),n.on("prompt-upload-dependencies",async({extensionId:d,extensionName:a})=>{o("prompt-upload-dependencies:",d);try{const c=await e.extensionRegistry.getDependencies(d);if(!c||!c.mipPackage)return;e.dependencyPrompt={extensionId:d,extensionName:a,dependencies:c},n.emit("render")}catch(c){console.error("[Extensions] Error getting dependencies:",c)}}),n.on("close-dependency-prompt",()=>{o("close-dependency-prompt"),e.dependencyPrompt=null,n.emit("render")}),n.on("upload-extension-dependencies",async d=>{o("upload-extension-dependencies:",d),e.dependencyPrompt=null;try{const a=e.installedExtensions.find(p=>p.id===d);if(!a||!a.mipPackage){n.emit("render");return}if(!e.isConnected){alert("Please connect to device first"),n.emit("render");return}stopStatusInfoPolling(),e.installingDependencies={extensionName:a.name,mipPackage:a.mipPackage},n.emit("render");const c=`
import mip
try:
    result = mip.install("${a.mipPackage}", target="/lib")
    print("mip.install completed")
    print(f"mip.install result: {result}")
except Exception as e:
    print(f"mip.install error: {e}")
    import sys
    sys.print_exception(e)
    raise  # Re-raise to ensure error is visible
`,l=await i.run(c,!1);if(l&&(l.includes("error")||l.includes("Error")||l.includes("Exception")))throw new Error(`mip install failed: ${l}`);e.installingDependencies=null,e.isConnected&&i&&startStatusInfoPolling(i,e,n),n.emit("render"),alert("Dependencies installed successfully via mip!")}catch(a){console.error("[Extensions] Dependency installation failed:",a),e.installingDependencies=null,e.isConnected&&i&&startStatusInfoPolling(i,e,n),n.emit("render"),alert(`Failed to install dependencies:
${a.message}`)}}),n.on("toggle-extension-menu",d=>{e.expandedExtensions[d]=!e.expandedExtensions[d],n.emit("render")}),n.on("change-extension-panel",async({extensionId:d,panelId:a})=>{if(o("change-extension-panel:",d,a),!e.loadedExtensions[d])try{const c=await e.extensionRegistry.getExtension(d);if(!c)throw new Error(`Extension not found: ${d}`);e.loadedExtensions[d]={data:c,instance:null},o(`[Extensions] Loaded extension ${d} from cache`)}catch(c){console.error("[Extensions] Failed to load extension:",c),alert(`Failed to load extension:
${c.message}`);return}e.activeExtension=d,e.activeExtensionPanel=a,e.activeNetworkPanel=null,e.activePeripheralsPanel=null,e.activeSystemPanel=null,e.systemSection=`extension:${d}:${a}`,n.emit("render")})}function registerAIAgentHandlers(e,n,i){const s=console.log;n.on("toggle-agent-sidebar",()=>{s("toggle-agent-sidebar"),e.aiAgent.isOpen=!e.aiAgent.isOpen,n.emit("render")}),n.on("ai-set-provider",async o=>{s("ai-set-provider",o);const r=e.aiAgent.settings.provider;if(e.aiAgent.settings.provider=o,localStorage.setItem("ai-provider",o),r!==o){const d={openai:"gpt-4o",anthropic:"claude-3-5-sonnet-20241022",grok:"grok-4-latest",openrouter:"anthropic/claude-3.5-sonnet",custom:"custom-model"};e.aiAgent.settings.model=d[o]||"gpt-4o",localStorage.setItem("ai-model",e.aiAgent.settings.model)}o==="openrouter"&&e.aiAgent.settings.apiKey&&n.emit("ai-fetch-openrouter-models"),n.emit("render")}),n.on("ai-fetch-openrouter-models",async()=>{if(s("ai-fetch-openrouter-models"),!!e.aiAgent.settings.apiKey){e.aiAgent.isLoadingOpenRouterModels=!0,n.emit("render");try{const o=await fetch("https://openrouter.ai/api/v1/models",{headers:{Authorization:`Bearer ${e.aiAgent.settings.apiKey}`}});if(o.ok){const d=(await o.json()).data.filter(a=>a.id&&!a.id.includes("moderation")).sort((a,c)=>a.pricing?.prompt&&!c.pricing?.prompt?-1:!a.pricing?.prompt&&c.pricing?.prompt?1:a.name.localeCompare(c.name)).map(a=>({value:a.id,label:a.name||a.id}));e.aiAgent.openRouterModels=d,!d.find(a=>a.value===e.aiAgent.settings.model)&&d.length>0&&(e.aiAgent.settings.model=d[0].value,localStorage.setItem("ai-model",e.aiAgent.settings.model))}else console.warn("[AI] Failed to fetch OpenRouter models:",o.status)}catch(o){console.error("[AI] Error fetching OpenRouter models:",o)}finally{e.aiAgent.isLoadingOpenRouterModels=!1,n.emit("render")}}}),n.on("ai-set-apikey",o=>{e.aiAgent.settings.apiKey=o,localStorage.setItem("ai-apikey",o),e.aiAgent.connectionStatus=null,e.aiAgent.settings.provider==="openrouter"&&o&&n.emit("ai-fetch-openrouter-models")}),n.on("ai-set-model",o=>{s("ai-set-model",o),e.aiAgent.settings.model=o,localStorage.setItem("ai-model",o),n.emit("render")}),n.on("ai-set-endpoint",o=>{e.aiAgent.settings.endpoint=o,localStorage.setItem("ai-endpoint",o)}),n.on("ai-set-anthropic-proxy-url",o=>{e.aiAgent.settings.anthropicProxyUrl=o,localStorage.setItem("ai-anthropic-proxy-url",o)}),n.on("ai-set-system-prompt",o=>{e.aiAgent.settings.systemPrompt=o,localStorage.setItem("ai-system-prompt",o)}),n.on("ai-test-connection",async()=>{if(s("ai-test-connection"),!e.aiAgent.settings.apiKey){e.aiAgent.connectionStatus={success:!1,message:"Please enter an API key"},n.emit("render");return}try{e.aiAgent.connectionStatus={success:!1,message:"Testing connection..."},n.emit("render");const r=await AIBridgeInstance.testConnection(e.aiAgent.settings);e.aiAgent.connectionStatus={success:!0,message:"Connection successful! Ready to generate code."}}catch(o){e.aiAgent.connectionStatus={success:!1,message:o.message||"Connection failed"}}n.emit("render")}),n.on("ai-update-input",o=>{e.aiAgent.inputValue=o}),n.on("ai-send-message",async o=>{if(s("ai-send-message",o),!(!o||!o.trim())){if(!e.aiAgent.settings.apiKey){e.aiAgent.messages.push({role:"error",content:"Please configure your API key in System > AI Agent settings",timestamp:new Date}),n.emit("render");return}e.aiAgent.inputValue="",e.aiAgent.messages.push({role:"user",content:o,timestamp:new Date}),e.aiAgent.isGenerating=!0,n.emit("render");try{const r=AIBridgeInstance;let d=o;e.aiAgent.lastScriptName&&(d=`[CONTEXT: The last script you generated was "${e.aiAgent.lastScriptName}". If the user is asking you to modify/improve that script, keep the same name. If they're asking for something completely different, use a new appropriate name.]

${o}`,console.log("[AI] Adding script context:",e.aiAgent.lastScriptName));const a=await r.generateCode(d,e.aiAgent.messages,e.aiAgent.settings);e.aiAgent.messages.push({role:"assistant",content:a.content,code:a.code,timestamp:new Date}),a.code&&n.emit("ai-code-generated",a.code)}catch(r){e.aiAgent.messages.push({role:"error",content:`Error: ${r.message}`,timestamp:new Date})}e.aiAgent.isGenerating=!1,n.emit("render")}}),n.on("ai-clear-chat",()=>{s("ai-clear-chat"),e.aiAgent.messages=[],e.aiAgent.inputValue="",e.aiAgent.lastConfiguredArgs=null,e.aiAgent.lastScriptName=null,console.log("[AI] Cleared chat and configuration values"),n.emit("render")}),n.on("ai-code-generated",async o=>{s("ai-code-generated");try{console.log("[AI] Code received (first 500 chars):",o.substring(0,500)),console.log("[AI] Code has START marker:",o.includes("# === START_CONFIG_PARAMETERS ===")),console.log("[AI] Code has END marker:",o.includes("# === END_CONFIG_PARAMETERS ==="));const r=parseScriptOsConfig(o);if(console.log("[AI] Parsed config:",r),console.log("[AI] Config args:",r?.args),console.log("[AI] Has args:",r&&r.args&&Object.keys(r.args).length>0),r&&r.args&&Object.keys(r.args).length>0){let a=(r.info||{}).name||"AI Generated Script";const c=e.aiAgent.lastScriptName===r.info.name,l=c&&e.aiAgent.lastConfiguredArgs!==null;if(console.log("[AI] Script name:",r.info.name),console.log("[AI] Last script name:",e.aiAgent.lastScriptName),console.log("[AI] Is same script:",c),console.log("[AI] Has existing config:",l),console.log("[AI] Last configured args:",e.aiAgent.lastConfiguredArgs),console.log("[AI] New config args:",Object.keys(r.args)),l){console.log("[AI] Using previous configuration values:",e.aiAgent.lastConfiguredArgs);let p=generateScriptOsCode(o,r,e.aiAgent.lastConfiguredArgs);r.silent===!0&&(p=`# SCRIPTOS_SILENT: True
${p}`);const u=a.replace(/[^a-zA-Z0-9]/g,"_")+".py",f=e.openFiles.find(h=>h.isAIGenerated&&h.source==="disk"&&h.fileName===u);if(f)f.editor.editor.setValue(p),f.hasChanges=!0,e.editingFile=f.id,console.log("[AI] Auto-updated existing tab with previous config:",f.fileName);else if(await i("disk",u,null,p)){const m=e.openFiles[e.openFiles.length-1];m.isAIGenerated=!0,console.log("[AI] Created new tab with previous config:",u)}}else e.selectedScriptOs={filename:a,content:o,config:r,isAIGenerated:!0},e.scriptOsModalView="config",e.scriptOsArgs={},e.isScriptOsModalOpen=!0}else{const d=e.openFiles.find(a=>a.isAIGenerated&&a.source==="disk");if(d)d.editor.editor.setValue(o),d.hasChanges=!0,e.editingFile=d.id,console.log("[AI] Updated existing AI-generated tab:",d.fileName);else{const a="AI_Generated.py";if(await i("disk",a,null,o)){const l=e.openFiles[e.openFiles.length-1];l.isAIGenerated=!0,console.log("[AI] Created new AI-generated tab:",a)}}}n.emit("render")}catch(r){console.error("[AI] Error processing generated code:",r);const d=e.openFiles.find(a=>a.isAIGenerated&&a.source==="disk");if(d)d.editor.editor.setValue(o),d.hasChanges=!0,e.editingFile=d.id;else{await i("disk","AI_Generated.py",null,o);const c=e.openFiles[e.openFiles.length-1];c&&(c.isAIGenerated=!0)}n.emit("render")}})}const SCRIPTOHUB_API_URL="https://cheerful-stoat-894.convex.site";async function listSkills(e,n={}){const i=e||SCRIPTOHUB_API_URL,s=new URLSearchParams;n.limit&&s.set("limit",String(n.limit)),n.cursor&&s.set("cursor",n.cursor),n.sort&&s.set("sort",n.sort);const o=`${i}/api/v1/skills${s.toString()?"?"+s:""}`,r=await fetch(o);if(!r.ok)throw new Error(`ScriptoHub listSkills failed: ${r.status} ${r.statusText}`);return r.json()}async function getSkill(e,n){const s=await fetch(`${n||SCRIPTOHUB_API_URL}/api/v1/skills/${encodeURIComponent(e)}`);if(!s.ok)throw new Error(`ScriptoHub getSkill(${e}) failed: ${s.status}`);return s.json()}async function getSkillFile(e,n,i){const s=i||SCRIPTOHUB_API_URL,o=new URLSearchParams({path:n}),r=await fetch(`${s}/api/v1/skills/${encodeURIComponent(e)}/file?${o}`);if(!r.ok)throw new Error(`ScriptoHub getSkillFile(${e}, ${n}) failed: ${r.status}`);return r.text()}async function getSkillFileBytes(e,n,i){const s=i||SCRIPTOHUB_API_URL,o=new URLSearchParams({path:n}),r=await fetch(`${s}/api/v1/skills/${encodeURIComponent(e)}/file?${o}`);if(!r.ok)throw new Error(`ScriptoHub getSkillFileBytes(${e}, ${n}) failed: ${r.status}`);const d=await r.arrayBuffer();return new Uint8Array(d)}const SCRIPTO_ASSET_ROOT="/scriptos";async function deployScriptoAssets(e,n){const i=e.assetFiles||[];if(i.length===0)return;if(!n.isConnected){console.warn("[Scripto assets] device not connected — skipping asset deploy");return}const s=e.slug,o=`${SCRIPTO_ASSET_ROOT}/${s}`;console.log(`[Scripto assets] deploying ${i.length} file(s) to ${o}/`),await createFolder(BridgeDevice,SCRIPTO_ASSET_ROOT).catch(()=>{}),await createFolder(BridgeDevice,o).catch(()=>{});for(const r of i){const d=await getSkillFileBytes(s,r.path,n.scriptohubApiUrl);await BridgeDevice.saveFile(`${o}/${r.path}`,d),console.log(`[Scripto assets] wrote ${o}/${r.path} (${d.length} bytes)`)}}function registerScriptOsHandlers(e,n,i,s){const o=console.log;n.on("open-scriptos-modal",async()=>{o("open-scriptos-modal"),e.isLoadingRegistry=!0,e.scriptOsModalView="library",e.scriptOsSearchQuery="",e.scriptOsFilterTags=[],e.isScriptOsModalOpen=!0,n.emit("render");try{console.log("[Registry] Fetching skills from ScriptoHub...");const r=await listSkills(e.scriptohubApiUrl,{limit:200});e.scriptOsList=(r.items||[]).map(d=>({slug:d.slug,displayName:d.displayName,summary:d.summary,category:d.category||null,skillType:d.skillType||null,tags:d.tags||{},stats:d.stats||{},latestVersion:d.latestVersion,createdAt:d.createdAt,updatedAt:d.updatedAt})),console.log(`[Registry] Loaded ${e.scriptOsList.length} skills from ScriptoHub`),e.isLoadingRegistry=!1,n.emit("render")}catch(r){console.error("[ScriptOs] Error loading registry:",r),e.isLoadingRegistry=!1,e.scriptOsList=[],n.emit("render"),alert(`Failed to load ScriptOs from ScriptoHub:
${r.message}

Please check your internet connection and try again.`)}}),n.on("select-scriptos",async r=>{if(o("select-scriptos:",r.displayName||r.slug),r.slug&&!r.content){const d=r.slug;console.log("[Registry] Fetching skill from ScriptoHub:",d);try{const a=await getSkill(d,e.scriptohubApiUrl);if(!a||!a.latestVersion)throw new Error(`Skill "${d}" has no published version`);const c=await getSkillVersionFiles(d,a,e.scriptohubApiUrl),l=c.files.find(m=>m.path.endsWith(".py"));if(!l)throw new Error(`Skill "${d}" has no .py file`);const[p,u]=await Promise.all([getSkillFile(d,l.path,e.scriptohubApiUrl),getSkillFile(d,"SKILL.md",e.scriptohubApiUrl).catch(()=>null)]),f=parseScriptOsConfig(p);if(!f)throw new Error("Failed to parse ScriptO configuration");console.log("[Registry] Fetched skill:",d,"py:",l.path,"skill.md:",!!u);const h=(c.files||[]).filter(m=>m.path!=="SKILL.md"&&m.path!==l.path);r={slug:d,filename:l.path,displayName:r.displayName||a.skill?.displayName,content:p,config:f,skillMd:u,assetFiles:h}}catch(a){console.error("[Registry] Error fetching skill:",a),alert(`Failed to load skill:
${a.message}`);return}}if(e.selectedScriptOs=r,e.scriptOsArgs={},r.config&&r.config.args)for(const d in r.config.args){const a=r.config.args[d];a.value!==void 0?e.scriptOsArgs[d]=a.value:a.type==="str"?e.scriptOsArgs[d]="":a.type==="int"||a.type==="float"?e.scriptOsArgs[d]=0:a.type==="bool"?e.scriptOsArgs[d]=!1:a.type==="list"?e.scriptOsArgs[d]=a.optional?null:0:a.type==="dict"&&a.items&&(e.scriptOsArgs[d]=Object.keys(a.items)[0])}r.skillMd&&(e.isSkillSidebarOpen=!0,e.skillSidebarContent={name:r.displayName||r.config?.info?.name||r.slug,skillMd:r.skillMd}),e.scriptOsModalView="config",n.emit("render")}),n.on("scriptos-update-arg",({argId:r,value:d})=>{e.scriptOsArgs[r]=d}),n.on("scriptos-search",r=>{e.scriptOsSearchQuery=r,n.emit("render")}),n.on("scriptos-toggle-tag",r=>{o("scriptos-toggle-tag:",r);const d=e.scriptOsFilterTags.indexOf(r);d>=0?e.scriptOsFilterTags.splice(d,1):e.scriptOsFilterTags.push(r),n.emit("render")}),n.on("scriptos-clear-tags",()=>{o("scriptos-clear-tags"),e.scriptOsFilterTags=[],n.emit("render")}),n.on("scriptos-back",()=>{o("scriptos-back"),e.scriptOsModalView="library",e.selectedScriptOs=null,e.isSkillSidebarOpen=!1,e.skillSidebarContent=null,n.emit("render")}),n.on("scriptos-execute",async()=>{o("scriptos-execute");const r=e.selectedScriptOs;if(r)try{try{await deployScriptoAssets(r,e)}catch(l){console.error("[Scripto assets] deploy failed:",l),alert(`Failed to deploy scripto assets:
${l.message}`);return}let d=generateScriptOsCode(r.content,r.config,e.scriptOsArgs);r.config.silent===!0&&(d=`# SCRIPTOS_SILENT: True
${d}`),e.isScriptOsModalOpen=!1;const a=r.config.info||{};let c=(a.name||r.filename.replace(".py","")).replace(/[^a-zA-Z0-9]/g,"_")+".py";if(r.isAIGenerated){e.aiAgent.lastConfiguredArgs={...e.scriptOsArgs},e.aiAgent.lastScriptName=a.name,console.log("[AI] Saved configuration values for future updates:",e.aiAgent.lastConfiguredArgs),console.log("[AI] Saved script name:",e.aiAgent.lastScriptName);const l=e.openFiles.find(p=>p.isAIGenerated&&p.source==="disk"&&p.fileName===c);if(l)l.editor.editor.setValue(d),l.hasChanges=!0,e.editingFile=l.id,console.log("[AI] Updated existing AI-generated tab with configured code:",l.fileName);else{const p=c||"AI_Generated.py";if(await s("disk",p,null,d)){const f=e.openFiles[e.openFiles.length-1];f.isAIGenerated=!0,console.log("[AI] Created new AI-generated tab with configured code:",p)}}}else{const l=e.openFiles.find(p=>p.source==="disk"&&p.fileName===c);l?(l.editor.editor.setValue(d),l.hasChanges=!0,e.editingFile=l.id,o("[ScriptOs] Updated existing tab:",c)):(await s("disk",c,null,d),o("[ScriptOs] Generated code in new tab:",c))}n.emit("render")}catch(d){console.error("[ScriptOs] Error generating code:",d)}}),n.on("close-scriptos-modal",()=>{o("close-scriptos-modal"),e.isScriptOsModalOpen=!1,e.selectedScriptOs=null,e.scriptOsModalView="library",e.isSkillSidebarOpen=!1,e.skillSidebarContent=null,n.emit("render")}),n.on("deploy-skill",async()=>{if(o("deploy-skill"),!e.isConnected){alert("Please connect to a device to deploy this skill.");return}const r=e.selectedScriptOs;if(!r||!r.content){alert("No skill selected to deploy.");return}const d=r.slug||r.filename.replace(/\.py$/i,"").replace(/[^a-zA-Z0-9]/g,"-").toLowerCase(),a=`/pfc/skills/${d}`,c=r.filename||`${d}.py`;try{console.log(`[Deploy] Deploying skill "${d}" to device at ${a}/`),await createFolder(BridgeDevice,"/pfc/skills").catch(()=>{}),await createFolder(BridgeDevice,a).catch(()=>{}),await BridgeDevice.saveFile(`${a}/${c}`,r.content),console.log(`[Deploy] Saved ${a}/${c}`),r.skillMd&&(await BridgeDevice.saveFile(`${a}/SKILL.md`,r.skillMd),console.log(`[Deploy] Saved ${a}/SKILL.md`)),alert(`Skill "${r.filename}" deployed to ${a}/`),console.log("[Deploy] Skill deployed successfully")}catch(l){console.error("[Deploy] Error deploying skill:",l),alert(`Failed to deploy skill:
${l.message}`)}}),n.on("toggle-skill-sidebar",()=>{e.isSkillSidebarOpen=!e.isSkillSidebarOpen,n.emit("render")}),n.on("close-skill-sidebar",()=>{e.isSkillSidebarOpen=!1,n.emit("render")}),n.on("open-scriptos-ui-modal",r=>{o("open-scriptos-ui-modal",r),e.scriptOsUiModal&&e.scriptOsUiModal.loadTimeout&&clearTimeout(e.scriptOsUiModal.loadTimeout),e.scriptOsUiModal={isOpen:!0,url:r.url,title:r.title||"ScriptO UI",isLoading:!0,error:null,loadTimeout:null},e.scriptOsUiModal.loadTimeout=setTimeout(()=>{e.scriptOsUiModal&&e.scriptOsUiModal.isLoading&&(console.warn("[ScriptO UI] Load timeout - iframe did not load within 10 seconds"),e.scriptOsUiModal.isLoading=!1,e.scriptOsUiModal.error="Failed to load UI: timeout after 10 seconds. Check if the URL is accessible.",n.emit("render"))},1e4),n.emit("render")}),n.on("close-scriptos-ui-modal",()=>{o("close-scriptos-ui-modal"),e.scriptOsUiModal&&e.scriptOsUiModal.loadTimeout&&clearTimeout(e.scriptOsUiModal.loadTimeout),e.scriptOsUiModal={isOpen:!1,url:null,title:null,isLoading:!1,error:null,loadTimeout:null},n.emit("render")}),n.on("configure-scripto",async r=>{o("configure-scripto",r);try{let d,a,c,l=null;if(r.slug){const f=r.slug;console.log("[ScriptO] Fetching skill from ScriptoHub:",f);const h=await getSkill(f,e.scriptohubApiUrl);if(!h||!h.latestVersion)throw new Error(`Skill "${f}" has no published version`);const m=await getSkillVersionFiles(f,h,e.scriptohubApiUrl),v=m.files.find(y=>y.path.endsWith(".py"));if(!v)throw new Error(`Skill "${f}" has no .py file`);[d,l]=await Promise.all([getSkillFile(f,v.path,e.scriptohubApiUrl),getSkillFile(f,"SKILL.md",e.scriptohubApiUrl).catch(()=>null)]),r.assetFiles=(m.files||[]).filter(y=>y.path!=="SKILL.md"&&y.path!==v.path),c=v.path}else if(r.url){const f=await fetch(r.url);if(!f.ok)throw new Error(`Failed to fetch: ${f.status}`);d=await f.text();const h=r.url.split("/");c=decodeURIComponent(h[h.length-1])}else if(r.content)d=r.content,c=r.filename||"script.py";else throw new Error("No slug, url, or content provided");if(a=parseScriptOsConfig(d),!a)throw new Error("Failed to parse ScriptO configuration");let p=c;a.info&&a.info.name&&(p=a.info.name),console.log("[ScriptO] Opening in config modal:",p);const u={slug:r.slug||null,filename:p,content:d,config:a,skillMd:l,assetFiles:r.assetFiles||[],isAIGenerated:r.isAIGenerated||!1};if(e.selectedScriptOs=u,e.scriptOsArgs={},a.args)for(const f in a.args){const h=a.args[f];h.value!==void 0?e.scriptOsArgs[f]=h.value:h.type==="str"?e.scriptOsArgs[f]="":h.type==="int"||h.type==="float"?e.scriptOsArgs[f]=0:h.type==="bool"?e.scriptOsArgs[f]=!1:h.type==="list"?e.scriptOsArgs[f]=h.optional?null:0:h.type==="dict"&&h.items&&(e.scriptOsArgs[f]=Object.keys(h.items)[0])}l&&(e.isSkillSidebarOpen=!0,e.skillSidebarContent={name:p,skillMd:l}),e.scriptOsModalView="config",e.isScriptOsModalOpen=!0,console.log("[ScriptO] Successfully opened ScriptO in config modal"),n.emit("render")}catch(d){console.error("[ScriptO] Error loading ScriptO:",d),alert(`Failed to load ScriptO:
${d.message}`)}})}async function getSkillVersionFiles(e,n,i){const s=n.latestVersion?.version;if(!s)throw new Error(`Skill "${e}" has no version`);const o=await fetch(`${i}/api/v1/skills/${encodeURIComponent(e)}/versions/${encodeURIComponent(s)}`);if(!o.ok)throw new Error(`Failed to fetch version files: ${o.status}`);const r=await o.json();return r.version||r}console.log("[Stores] ES modules loaded");let CodeMirrorEditorClass=null;async function getCodeMirrorEditor(){return CodeMirrorEditorClass||(CodeMirrorEditorClass=(await __vitePreload(()=>Promise.resolve().then(()=>editor),void 0)).CodeMirrorEditor),CodeMirrorEditorClass}const log=console.log,device=BridgeDevice,disk=BridgeDisk,registryCache=new RegistryCache;async function store(e,n){async function i(r){const{source:d,parentFolder:a,fileName:c,content:l=newFileContent,hasChanges:p=!1}=r,u=generateHash(),f=await getCodeMirrorEditor(),h=e.cache(f,`editor_${u}`);return h.content=l,h.fileName=c,{id:u,source:d,parentFolder:a,fileName:c,editor:h,hasChanges:p}}async function s(r,d=null,a=null,c=null){r=="board"?e.boardNavigationPath:e.diskNavigationPath;const l=await i({fileName:d===null?generateFileName():d,parentFolder:a,source:r,hasChanges:!0,content:c||newFileContent});let p=!1;return a!=null&&(r=="board"?p=await fileExists(BridgeDevice,getFullPath$1(e.boardNavigationRoot,l.parentFolder,l.fileName)):r=="disk"&&(p=await disk.fileExists(disk.getFullPath(e.diskNavigationRoot,l.parentFolder,l.fileName)))),e.openFiles.find(f=>f.parentFolder===l.parentFolder&&f.fileName===l.fileName&&f.source===l.source)||p?(await confirmDialog(`File ${l.fileName} already exists on ${r}. Please choose another name.`),!1):(l.editor.onChange=function(){l.hasChanges=!0,n.emit("render")},e.openFiles.push(l),e.editingFile=l.id,!0)}await initializeState(e,n,s),initializeTheme(e,n),registerThemeHandlers(e,n);const o=()=>{};registerDialogHandlers(e,n,device),registerConnectionHandlers(e,n,device,o,bindTerminalOutput),registerFileOperationHandlers(e,n,device,disk,i,s),registerTerminalHandlers(e,n,device,XTerm),registerAIAgentHandlers(e,n,s),registerLogHandlers(e,n),document.addEventListener("connection-mode-change",r=>{const d=r.detail?.mode||"none";e.connectionMode=d,n.emit("render")}),document.addEventListener("firmware-panel-update",()=>{n.emit("render")}),n.on("navigate",r=>{n.emit("change-system-section",r)}),n.on("change-view",async r=>{r==="file-manager"&&(e.isConnected&&BridgeDevice&&BridgeDevice.isCommandRunning()&&(n.emit("stop"),await sleep(250)),e.filesLoadedOnce||(log("[File Manager] Loading files for first time..."),e.filesLoadedOnce=!0),e.isConnected?n.emit("refresh-files"):n.emit("refresh-disk-files")),e.systemSection!==r&&(e.selectedFiles=[],e.systemSection=r,e.activeNetworkPanel=null,e.activePeripheralsPanel=null,e.activeSystemPanel=null,e.activeExtension=null,e.activeExtensionPanel=null,r==="editor"&&e.isConnected&&setTimeout(()=>{bindTerminalOutput(e);const d=e.cache(XTerm,"terminal");d&&d.term&&(n.emit("bind-terminal-input"),n.emit("terminal-focus"))},100),n.emit("render"))}),n.on("launch-app",async(r,d)=>{window.launchApp(r,d)}),n.on("change-system-section",r=>{if(log("change-system-section",r),e.systemSection=r,r.startsWith("network:")){const d=r.split(":")[1];e.activeNetworkPanel=d,e.activeSystemPanel=null,e.activePeripheralsPanel=null,e.activeExtension=null,e.activeExtensionPanel=null}else if(r.startsWith("peripherals:")){const d=r.split(":")[1];e.activePeripheralsPanel=d,e.activeNetworkPanel=null,e.activeSystemPanel=null,e.activeExtension=null,e.activeExtensionPanel=null}else if(r.startsWith("system:")){const d=r.split(":")[1];e.activeSystemPanel=d,e.activeNetworkPanel=null,e.activePeripheralsPanel=null,e.activeExtension=null,e.activeExtensionPanel=null}else e.activeNetworkPanel=null,e.activePeripheralsPanel=null,e.activeSystemPanel=null,e.activeExtension=null,e.activeExtensionPanel=null;(r==="ai-agent"||r==="system:ai-agent")&&e.aiAgent.settings.provider==="openrouter"&&e.aiAgent.settings.apiKey&&e.aiAgent.openRouterModels.length===0&&n.emit("ai-fetch-openrouter-models"),n.emit("render")}),registerNetworkConfigHandlers(e,n,device),registerHardwareConfigHandlers(e,n,device),registerSystemConfigHandlers(e,n,device),registerExtensionHandlers(e,n,device),registerScriptOsHandlers(e,n,registryCache,s),typeof debuggerStore=="function"?debuggerStore(e,n):console.warn("[Store] Debugger store not loaded"),n.on("change-locale",r=>{e.locale=r,localStorage.setItem("locale",r),window.i18n&&window.i18n.setLocale(r),n.emit("render")}),window.i18n?(window.i18n.setLocale(e.locale),console.log("[i18n] Locale initialized to:",e.locale)):console.warn("[i18n] i18n module not available")}const PANEL_CLOSED=45,PANEL_TOO_SMALL=65,PANEL_DEFAULT=320;typeof window<"u"&&(window.PANEL_CLOSED=PANEL_CLOSED,window.PANEL_TOO_SMALL=PANEL_TOO_SMALL,window.PANEL_DEFAULT=PANEL_DEFAULT);function App(e,n){return e.isInitializing?html$1`
      <div id="app" style="display: flex; justify-content: center; align-items: center; height: 100vh;">
        <p>Loading...</p>
      </div>
    `:html$1`
    <div id="app">
      ${SystemView(e,n)}
      ${Overlay(e,n)}
    </div>
  `}async function initApp(){window.i18nReady&&(await window.i18nReady,console.log("[App] Translations loaded, starting app...")),console.log("%c ScriptO Studio v1.2.1 ","background: #9b59b6; color: #fff; font-size: 11px; padding: 2px 6px; border-radius: 3px;","build cbb6af6 (2026-05-04)");let e=Choo();e.use(store),e.route("*",App),e.mount("#app"),window.appState=e.state,window.appInstance=e,e.emitter.on("DOMContentLoaded",()=>{e.state.diskNavigationRoot&&e.emitter.emit("refresh-files");const n=new URLSearchParams(window.location.search),i=n.get("device");if(i){const a=`wss://${i}/webrepl`;localStorage.setItem("webrepl-url",a),console.log(`[App] Device URL from query param: ${a}`),setTimeout(()=>{e.emitter.emit("open-connection-dialog");const c=window.location.pathname;window.history.replaceState({},"",c)},500)}const s=n.get("configure");s&&setTimeout(()=>{e.emitter.emit("configure-scripto",s);const a=window.location.pathname;window.history.replaceState({},"",a)},500);const o=n.get("scripto");o&&setTimeout(()=>{e.emitter.emit("change-view","editor"),e.emitter.emit("configure-scripto",{slug:o});const a=window.location.pathname;window.history.replaceState({},"",a)},500),window.addEventListener("message",a=>{a.data&&a.data.type==="scripto-use"&&a.data.slug&&(console.log("[App] Received scripto-use message:",a.data.slug),closeIframeModal(),e.emitter.emit("configure-scripto",{slug:a.data.slug}))});const r=n.get("extension");if(r){localStorage.setItem("pending-extension-id",r),sessionStorage.setItem("extension-install-active",r),console.log(`[App] Extension from query param: ${r}`),n.delete("extension");const a=n.toString(),c=window.location.pathname+(a?"?"+a:"");window.history.replaceState({},"",c),i||setTimeout(()=>{console.log("[App] Fresh extension install — navigating to Device Setup"),e.emitter.emit("change-system-panel","firmware")},500)}const d=localStorage.getItem("pending-extension-id");if(d&&i&&setTimeout(async()=>{try{const l=(await new ExtensionRegistry().getInstalledExtensions()).find(p=>p.id===d);l&&l.menu&&l.menu.length>0&&(console.log(`[App] Auto-navigating to extension: ${d}`),e.emitter.emit("change-extension-panel",{extensionId:d,panelId:l.menu[0].id}))}catch(a){console.warn("[App] Could not auto-navigate to extension:",a)}},1e3),!e.state.isConnected){let a=document.getElementById("hand-click-hint");if(!a){a=document.createElement("div"),a.id="hand-click-hint";const p=document.createElementNS("http://www.w3.org/2000/svg","svg");p.setAttribute("width","36"),p.setAttribute("height","36"),p.setAttribute("viewBox","0 0 24 24"),p.setAttribute("fill","none"),p.setAttribute("stroke","currentColor"),p.setAttribute("stroke-width","2"),p.setAttribute("stroke-linecap","round"),p.setAttribute("stroke-linejoin","round"),p.innerHTML=`
          <path d="M8 13v-8.5a1.5 1.5 0 0 1 3 0v7.5" />
          <path d="M11 11.5v-2a1.5 1.5 0 0 1 3 0v2.5" />
          <path d="M14 10.5a1.5 1.5 0 0 1 3 0v1.5" />
          <path d="M17 11.5a1.5 1.5 0 0 1 3 0v4.5a6 6 0 0 1 -6 6h-2h.208a6 6 0 0 1 -5.012 -2.7l-.196 -.3c-.312 -.479 -1.407 -2.388 -3.286 -5.728a1.5 1.5 0 0 1 .536 -2.022a1.867 1.867 0 0 1 2.28 .28l1.47 1.47" />
          <path d="M5 3l-1 -1" />
          <path d="M4 7h-1" />
          <path d="M14 3l1 -1" />
          <path d="M15 6h1" />
        `,a.appendChild(p),document.body.appendChild(a)}const c=()=>{a.classList.add("animate"),setTimeout(()=>{a.classList.remove("animate")},7500)};setTimeout(c,1e3);const l=setInterval(c,1e4);e.emitter.on("connect",()=>{clearInterval(l);const p=document.getElementById("hand-click-hint");p&&p.remove()})}})}document.readyState==="complete"?initApp():window.addEventListener("load",initApp);export{__vitePreload as _};
