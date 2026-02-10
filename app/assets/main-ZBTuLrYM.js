const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/tree-sitter-C11OGzyA.js","assets/vendor-DBsAqGKK.js","assets/vendor-BgmjMNkd.js","assets/vendor-ccdApEFz.css","assets/index-DX8WB_Mh.js","assets/index-CN9oGm0v.js","assets/index-Ct0B6E_D.js","assets/index-CC_OnImC.js","assets/index-uUR0fcff.js","assets/index-fKr_TzPR.js","assets/index-DhGTJQR7.js","assets/xterm-DOrYoP_4.css"])))=>i.map(i=>d[i]);
import{PANEL_TOO_SMALL as PANEL_TOO_SMALL$1,PANEL_CLOSED as PANEL_CLOSED$1,PANEL_DEFAULT as PANEL_DEFAULT$1}from"./vendor-DBsAqGKK.js";import{c as cborExports,C as CBOR,h as html$1,a as Component$1,b as Choo}from"./vendor-BgmjMNkd.js";(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const c of a.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&r(c)}).observe(document,{childList:!0,subtree:!0});function o(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(s){if(s.ep)return;s.ep=!0;const a=o(s);fetch(s.href,a)}})();function parseScriptOsConfig(n){const i="# === START_CONFIG_PARAMETERS ===",o="# === END_CONFIG_PARAMETERS ===",r=n.indexOf(i),s=n.indexOf(o);if(r===-1||s===-1)return console.warn("[ScriptOs Parser] Config markers not found"),null;const a=n.substring(r+i.length,s).trim();try{return parsePythonDict(a)}catch(c){return console.error("[ScriptOs Parser] Failed to parse config:",c),null}}function parsePythonDict(n){let i=n.trim();i.startsWith("dict(")&&i.endsWith(")")&&(i=i.substring(5,i.length-1).trim()),i=i.split(`
`).map(s=>{let a=!1,c=null,l=!1;for(let d=0;d<s.length;d++){const u=s[d];if(l){l=!1;continue}if(u==="\\"){l=!0;continue}if((u==='"'||u==="'"||u==="`")&&!a){a=!0,c=u;continue}if(u===c&&a){a=!1,c=null;continue}if(u==="#"&&!a)return s.substring(0,d)}return s}).join(`
`),i=i.replace(/\\\s*[\r\n]+\s*/g," ");let o="{";const r=smartSplit(i,",");for(let s=0;s<r.length;s++){const a=r[s].trim();if(!a)continue;const c=a.indexOf("=");if(c===-1)continue;const l=a.substring(0,c).trim();let d=a.substring(c+1).trim();d=convertPythonValue(d),s>0&&(o+=","),o+=`"${l}":${d}`}return o+="}",JSON.parse(o)}function smartSplit(n,i){const o=[];let r="",s=0,a=!1,c=null,l=!1;for(let d=0;d<n.length;d++){const u=n[d],p=d>0?n[d-1]:"";if(l){r+=u,l=!1;continue}if(u==="\\"){l=!0,r+=u;continue}if((u==='"'||u==="'"||u==="`")&&!a){a=!0,c=u,r+=u;continue}if(u===c&&a&&p!=="\\"){a=!1,c=null,r+=u;continue}if(a){r+=u;continue}if(u==="("||u==="["||u==="{"?s++:(u===")"||u==="]"||u==="}")&&s--,u===i&&s===0){o.push(r),r="";continue}r+=u}return r.trim()&&o.push(r),o}function convertPythonValue(n){if(n=n.trim(),n==="None")return"null";if(n==="True")return"true";if(n==="False")return"false";if(/^-?\d+(\.\d+)?$/.test(n))return n;if(n.startsWith("[")&&n.endsWith("]")){const i=n.substring(1,n.length-1);return"["+smartSplit(i,",").map(s=>convertPythonValue(s)).join(",")+"]"}if(n.startsWith("(")&&n.endsWith(")")){const i=n.substring(1,n.length-1);return"["+smartSplit(i,",").map(s=>convertPythonValue(s)).join(",")+"]"}if(n.startsWith("dict(")&&n.endsWith(")")){const i=n.substring(5,n.length-1);return convertDictContent(i)}if(n.startsWith("{")&&n.endsWith("}")){const i=n.substring(1,n.length-1);return convertDictLiteral(i)}if(n.includes("+")){const i=n.split("+").map(o=>{const r=o.trim();return r.startsWith("'")||r.startsWith('"')?r.substring(1,r.length-1):r});return JSON.stringify(i.join(""))}if(n.startsWith("'''")||n.startsWith('"""')){n.substring(0,3);let i=n.substring(3,n.length-3);return i=i.replace(/\s+/g," ").trim(),JSON.stringify(i)}return n.startsWith("'")&&n.endsWith("'")||n.startsWith('"')&&n.endsWith('"')?JSON.stringify(n.substring(1,n.length-1)):n==="str"?'"str"':n==="int"?'"int"':n==="float"?'"float"':n==="bool"?'"bool"':n==="list"?'"list"':n==="dict"?'"dict"':JSON.stringify(n)}function convertDictContent(n){let i="{";const o=smartSplit(n,",");let r=!0;for(let s=0;s<o.length;s++){const a=o[s].trim();if(!a)continue;const c=a.indexOf("=");if(c===-1)continue;const l=a.substring(0,c).trim();let d=a.substring(c+1).trim();d=convertPythonValue(d),r||(i+=","),i+=`"${l}":${d}`,r=!1}return i+="}",i}function convertDictLiteral(n){let i="{";const o=smartSplit(n,",");let r=!0;for(let s=0;s<o.length;s++){const a=o[s].trim();if(!a)continue;const c=a.indexOf(":");if(c===-1)continue;let l=a.substring(0,c).trim(),d=a.substring(c+1).trim();(l.startsWith("'")&&l.endsWith("'")||l.startsWith('"')&&l.endsWith('"'))&&(l=l.substring(1,l.length-1)),d=convertPythonValue(d),r||(i+=","),i+=`"${l}":${d}`,r=!1}return i+="}",i}function generateScriptOsCode(n,i,o){const r="# === START_CONFIG_PARAMETERS ===",s="# === END_CONFIG_PARAMETERS ===",a=n.indexOf(r),c=n.indexOf(s);if(a===-1||c===-1)return n;const l=n.substring(0,a).trim(),d=n.substring(c+s.length).trim();if(!i.args||Object.keys(i.args).length===0){const g=i.info||{};let f=`# ${g.name||"ScriptO"}
`;return g.description&&(f+=`# ${g.description}
`),g.author&&(f+=`# Author: ${g.author}
`),f+=`
`,f+(l?l+`

`:"")+d}const u=i.info||{};let p=`# ${u.name||"ScriptO"}
`;u.description&&(p+=`# ${u.description}
`),u.author&&(p+=`# Author: ${u.author}
`),p+=`
`,l&&(p+=l+`

`),p+=`# Configuration
`,p+=`class args:
`;for(const g in i.args){const f=i.args[g];let h=o[g];h==null&&(h=f.value);let m;h==null?m="None":typeof h=="string"?m=`'${escapePythonString(h)}'`:typeof h=="boolean"?m=h?"True":"False":typeof h=="number"?m=h.toString():Array.isArray(h)?m="["+h.map(v=>typeof v=="string"?`'${escapePythonString(v)}'`:v).join(", ")+"]":m="None",p+=`    ${g} = ${m}
`}return p+=`
`,d&&(p+=d),p}function escapePythonString(n){return String(n).replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/\t/g,"\\t")}class IndexedDBFileBridge{constructor(){this.DB_NAME="scripto-studio-files",this.DB_VERSION=1,this.STORE_FILES="files",this.rootPath="/"}async _initDB(){return new Promise((i,o)=>{const r=indexedDB.open(this.DB_NAME,this.DB_VERSION);r.onerror=()=>o(r.error),r.onsuccess=()=>i(r.result),r.onupgradeneeded=s=>{const a=s.target.result;a.objectStoreNames.contains(this.STORE_FILES)||a.createObjectStore(this.STORE_FILES)}})}_normalizePath(i){return i?(i=i.replace(this.rootPath,""),i.startsWith("/")||(i="/"+i),i!=="/"&&i.endsWith("/")&&(i=i.slice(0,-1)),i):"/"}async _getFilesInDirectory(i){const o=this._normalizePath(i),r=o==="/"?"/":o+"/",s=await this._initDB();return new Promise((a,c)=>{const u=s.transaction([this.STORE_FILES],"readonly").objectStore(this.STORE_FILES).openCursor(),p=[],g=new Set;u.onsuccess=f=>{const h=f.target.result;if(h){const m=h.key,v=h.value;if(m.startsWith(r)){const y=m.substring(r.length);if(m.endsWith("/")&&v.type==="folder"){const b=y.slice(0,-1);b&&!b.includes("/")&&!g.has(b)&&(g.add(b),p.push({path:b,type:"folder"}))}else if(y&&!y.includes("/"))p.push({path:y,type:v.type||"file",content:v.content,timestamp:v.timestamp,size:v.size});else if(y.includes("/")){const b=y.split("/")[0];g.has(b)||(g.add(b),p.push({path:b,type:"folder"}))}}h.continue()}else p.sort((m,v)=>m.type===v.type?m.path.localeCompare(v.path):m.type==="folder"?-1:1),a(p)},u.onerror=()=>c(u.error)})}async initialize(){try{return await this._initDB(),!0}catch(i){return console.error("[IDB FS] Error initializing:",i),!1}}isSupported(){return"indexedDB"in window}async openFolder(){const i=await this.ilistFiles("/");return{folder:this.rootPath,files:i}}async ilistFiles(i){try{return(await this._getFilesInDirectory(i)).map(r=>{let s=r.size;return s===void 0&&r.type==="file"&&(r.content?typeof r.content=="string"?s=new TextEncoder().encode(r.content).length:r.content instanceof ArrayBuffer?s=r.content.byteLength:r.content instanceof Uint8Array?s=r.content.length:r.content instanceof Blob&&(s=r.content.size):s=0),{path:r.path,type:r.type,size:s}})}catch(o){return console.error("[IDB FS] Error listing files:",o),[]}}async ilistAllFiles(i){try{const o=this._normalizePath(i),r=o==="/"?"/":o+"/",s=await this._initDB();return new Promise((a,c)=>{const u=s.transaction([this.STORE_FILES],"readonly").objectStore(this.STORE_FILES).openCursor(),p=[],g=new Set;u.onsuccess=f=>{const h=f.target.result;if(h){const m=h.key,v=h.value;if(m.startsWith(r)){const y=m.substring(r.length);if(y){const b=y.split("/");let S=r.slice(0,-1);for(let C=0;C<b.length;C++)S+="/"+b[C],g.has(S)||(g.add(S),C===b.length-1&&v.type==="file"?p.push({path:S,type:"file"}):C<b.length-1&&p.push({path:S,type:"folder"}))}}h.continue()}else a(p)},u.onerror=()=>c(u.error)})}catch(o){return console.error("[IDB FS] Error listing all files:",o),[]}}async loadFile(i){try{const o=this._normalizePath(i),r=await this._initDB();return new Promise((s,a)=>{const d=r.transaction([this.STORE_FILES],"readonly").objectStore(this.STORE_FILES).get(o);d.onsuccess=()=>{const u=d.result;if(!u||u.type!=="file"){a(new Error(`File not found: ${i}`));return}const p=u.content||"",f=new TextEncoder().encode(p).buffer;console.log("[IDB FS] Loaded file:",i,"(",f.byteLength,"bytes)"),s(f)},d.onerror=()=>a(d.error)})}catch(o){throw console.error("[IDB FS] Error loading file:",o),new Error(`Failed to load file: ${o.message}`)}}async saveFileContent(i,o){try{const r=this._normalizePath(i);let s=o;o instanceof Uint8Array?s=new TextDecoder().decode(o):o instanceof ArrayBuffer?s=new TextDecoder().decode(new Uint8Array(o)):o instanceof Blob?s=await o.text():typeof o!="string"&&(s=String(o));const a=await this._initDB();return new Promise((c,l)=>{const p=a.transaction([this.STORE_FILES],"readwrite").objectStore(this.STORE_FILES).put({type:"file",content:s,timestamp:Date.now(),size:new TextEncoder().encode(s).length},r);p.onsuccess=()=>{console.log("[IDB FS] Saved file:",i),c(!0)},p.onerror=()=>l(p.error)})}catch(r){throw console.error("[IDB FS] Error saving file:",r),new Error(`Failed to save file: ${r.message}`)}}async importFiles(i="/"){return new Promise((o,r)=>{const s=document.createElement("input");s.type="file",s.multiple=!0,s.accept="*/*",s.onchange=async a=>{try{const c=Array.from(a.target.files);if(c.length===0){o([]);return}const l=[];for(const d of c){const u=await d.text(),p=this.getFullPath(i,"",d.name);await this.saveFileContent(p,u),l.push({name:d.name,path:p,size:d.size}),console.log("[IDB FS] Imported file:",d.name,"→",p)}o(l)}catch(c){console.error("[IDB FS] Error importing files:",c),r(c)}},s.oncancel=()=>{o([])},s.click()})}async fileExists(i){try{const o=this._normalizePath(i),r=await this._initDB();return new Promise((s,a)=>{const d=r.transaction([this.STORE_FILES],"readonly").objectStore(this.STORE_FILES).get(o);d.onsuccess=()=>{const u=d.result;s(u&&u.type==="file")},d.onerror=()=>a(d.error)})}catch{return!1}}async folderExists(i){try{const o=this._normalizePath(i),r=o.endsWith("/")?o:o+"/",s=o==="/"?"/":o+"/",a=await this._initDB();return new Promise((c,l)=>{const u=a.transaction([this.STORE_FILES],"readonly").objectStore(this.STORE_FILES),p=u.get(r);p.onsuccess=()=>{if(p.result&&p.result.type==="folder"){c(!0);return}const g=u.openCursor();g.onsuccess=f=>{const h=f.target.result;if(h){const m=h.key;if(m.startsWith(s)&&m!==r){c(!0);return}h.continue()}else c(!1)},g.onerror=()=>l(g.error)},p.onerror=()=>l(p.error)})}catch{return!1}}async removeFile(i){try{const o=this._normalizePath(i),r=await this._initDB();return new Promise((s,a)=>{const d=r.transaction([this.STORE_FILES],"readwrite").objectStore(this.STORE_FILES).delete(o);d.onsuccess=()=>{console.log("[IDB FS] Removed file:",i),s(!0)},d.onerror=()=>a(d.error)})}catch(o){throw console.error("[IDB FS] Error removing file:",o),new Error(`Failed to remove file: ${o.message}`)}}async renameFile(i,o){try{const r=this._normalizePath(i),s=this._normalizePath(o),a=await this.loadFile(i);return await this.saveFileContent(o,a),await this.removeFile(i),console.log("[IDB FS] Renamed file:",i,"->",o),!0}catch(r){throw console.error("[IDB FS] Error renaming file:",r),new Error(`Failed to rename file: ${r.message}`)}}async createFolder(i){try{const o=this._normalizePath(i),r=o.endsWith("/")?o:o+"/",s=await this._initDB();return new Promise((a,c)=>{const d=s.transaction([this.STORE_FILES],"readwrite").objectStore(this.STORE_FILES),u=d.get(r);u.onsuccess=()=>{if(u.result){console.log("[IDB FS] Folder already exists:",i),a(!0);return}const p=d.put({type:"folder",timestamp:Date.now()},r);p.onsuccess=()=>{console.log("[IDB FS] Created folder:",i),a(!0)},p.onerror=()=>c(p.error)},u.onerror=()=>c(u.error)})}catch(o){throw console.error("[IDB FS] Error creating folder:",o),new Error(`Failed to create folder: ${o.message}`)}}async removeFolder(i){try{const o=this._normalizePath(i),r=o==="/"?"/":o+"/",s=o.endsWith("/")?o:o+"/",a=await this._initDB();return new Promise((c,l)=>{const p=a.transaction([this.STORE_FILES],"readwrite").objectStore(this.STORE_FILES).openCursor(),g=[];p.onsuccess=f=>{const h=f.target.result;if(h){const m=h.key;(m.startsWith(r)||m===o||m===s)&&g.push(h.delete()),h.continue()}else Promise.all(g).then(()=>{console.log("[IDB FS] Removed folder:",i),c(!0)}).catch(l)},p.onerror=()=>l(p.error)})}catch(o){throw console.error("[IDB FS] Error removing folder:",o),new Error(`Failed to remove folder: ${o.message}`)}}async listFiles(i){return this.ilistFiles(i)}getFullPath(i,o,r){let s=i||"/";return o&&o!=="/"&&(s+=(s.endsWith("/")?"":"/")+o.replace(/^\//,"")),r&&(s+=(s.endsWith("/")?"":"/")+r),s.startsWith("/")||(s="/"+s),s}getNavigationPath(i,o){if(o===".."){const r=i.split("/").filter(s=>s);return r.pop(),"/"+r.join("/")}return i==="/"?"/"+o:i+"/"+o}async getAppPath(){return this.rootPath}async clearWorkspace(){try{const i=await this._initDB();return new Promise((o,r)=>{const c=i.transaction([this.STORE_FILES],"readwrite").objectStore(this.STORE_FILES).clear();c.onsuccess=()=>{console.log("[IDB FS] Workspace cleared"),o()},c.onerror=()=>r(c.error)})}catch(i){console.error("[IDB FS] Error clearing workspace:",i)}}async listScriptOsFiles(){try{const i="/ScriptOs",o=await this.ilistFiles(i),r=[];console.log(`[IDB FS] Found ${o.length} items in ScriptOs directory`);for(const s of o)if(s.type==="file"&&s.path.endsWith(".py"))try{const a=i+"/"+s.path,c=await this.loadFile(a),l=new TextDecoder().decode(new Uint8Array(c)),d=parseScriptOsConfig(l);d?(r.push({filename:s.path,fullPath:a,content:l,config:d}),console.log(`[IDB FS] Loaded ScriptO: ${d.info?.name||s.path}`)):console.warn(`[IDB FS] No valid config found in: ${s.path}`)}catch(a){console.error(`[IDB FS] Error loading ScriptO ${s.path}:`,a)}return console.log(`[IDB FS] Successfully loaded ${r.length} ScriptOs`),r}catch(i){return console.error("[IDB FS] Error listing ScriptOs files:",i),[]}}async hasOnboardedDevices(){try{return(await this.ilistFiles("/onboarded")).some(o=>o.type==="file"&&o.path.endsWith(".json"))}catch{return!1}}async getOnboardedDevices(){try{const i=await this.ilistFiles("/onboarded"),o=[];for(const r of i)if(r.type==="file"&&r.path.endsWith(".json"))try{const s=await this.loadFile("/onboarded/"+r.path),a=new TextDecoder().decode(new Uint8Array(s));o.push(JSON.parse(a))}catch(s){console.warn("[IDB FS] Error parsing device file:",r.path,s)}return o}catch(i){return console.error("[IDB FS] Error listing onboarded devices:",i),[]}}async addOnboardedDevice(i,o){try{await this.createFolder("/onboarded");const s="/onboarded/"+(i.replace(/:/g,"")+".json");await this.saveFileContent(s,JSON.stringify(o,null,2)),console.log("[IDB FS] Added onboarded device:",o.hostname||i)}catch(r){throw console.error("[IDB FS] Error adding onboarded device:",r),r}}}const BridgeDisk=new IndexedDBFileBridge,AIAgentSystemPrompt=`You are an expert MicroPython developer specializing in ESP32 microcontrollers.

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
   ALWAYS unregister routes with httpserver.off() before registering to avoid conflicts`;class AIBridge{constructor(){this.registryExamples=null,this.registryUrl="https://scriptostudio.com/registry/index.json",this.systemPrompt=AIAgentSystemPrompt,this.systemPrompt||console.warn("[AIBridge] System prompt not loaded")}async testConnection(i){const{provider:o,apiKey:r,model:s,endpoint:a}=i;if(!r)throw new Error("API key is required");try{const c=await this.makeRequest("Hi! Just testing the connection.",[],i,!0);return{success:!0}}catch(c){throw new Error(c.message||"Connection test failed")}}async fetchRegistryExamples(){if(this.registryExamples)return this.registryExamples;try{console.log("[AIBridge] Fetching registry examples...");const i=await fetch(this.registryUrl);if(!i.ok)throw new Error("Failed to fetch registry");const o=await i.json(),r=[],s=["UI Plugins","GPIO","Hardware","Utilities"];for(const a of s){const c=o.scriptos.find(l=>l.tags&&l.tags.includes(a));if(c){const l=await fetch(c.url);if(l.ok){const d=await l.text();r.push({name:c.name,category:a,code:d})}}}return this.registryExamples=r,console.log(`[AIBridge] Loaded ${r.length} registry examples`),r}catch(i){return console.warn("[AIBridge] Failed to fetch registry examples:",i),[]}}async generateCode(i,o,r){await this.fetchRegistryExamples();const s=this.buildMessages(i,o,r);try{const a=await this.makeRequest(i,s,r,!1);console.log("[AIBridge] Raw AI response:",a.substring(0,200)+"...");const c=this.extractCode(a);return console.log("[AIBridge] Extracted code:",c?"YES ("+c.length+" chars)":"NO CODE FOUND"),c&&(console.log("[AIBridge] Extracted code (first 300 chars):",c.substring(0,300)),console.log("[AIBridge] Code has START marker:",c.includes("# === START_CONFIG_PARAMETERS ===")),console.log("[AIBridge] Code has END marker:",c.includes("# === END_CONFIG_PARAMETERS ==="))),{content:a,code:c}}catch(a){throw console.error("[AIBridge] Error generating code:",a),a}}buildMessages(i,o,r){const s=[];let a=r.systemPrompt&&typeof r.systemPrompt=="string"&&r.systemPrompt.trim().length>0?r.systemPrompt.trim():this.systemPrompt;if(this.registryExamples&&this.registryExamples.length>0){a+=`

REAL-WORLD EXAMPLES FROM REGISTRY:

`,a+=`Study these actual ScriptOs from the registry to learn the patterns:

`;for(const d of this.registryExamples){a+=`Example: ${d.name} (${d.category})
`,a+="```python\n";const u=d.code.length>500?d.code.substring(0,500)+`
# ... (rest of code omitted)
`:d.code;a+=u,a+="```\n\n"}a+=`Use these examples as reference for proper ScriptO format, patterns, and best practices.
`}console.log("[AIBridge] Using system prompt:",a===this.systemPrompt?"DEFAULT (ScriptO format)":"CUSTOM","| Length:",a.length,"chars",this.registryExamples?`| ${this.registryExamples.length} registry examples`:""),(r.provider==="openai"||r.provider==="grok"||r.provider==="openrouter"||r.provider==="custom")&&s.push({role:"system",content:a}),o.slice(-10).filter(d=>d.role==="user"||d.role==="assistant").forEach(d=>{(d.role==="user"||d.role==="assistant")&&s.push({role:d.role,content:d.content})});const l=o[o.length-1];return(!l||l.content!==i)&&s.push({role:"user",content:i}),s}async makeRequest(i,o,r,s=!1){const{provider:a,apiKey:c,model:l,endpoint:d,anthropicProxyUrl:u}=r;switch(a){case"openai":return await this.callOpenAI(o,c,l,s);case"anthropic":const p=r.systemPrompt&&typeof r.systemPrompt=="string"&&r.systemPrompt.trim().length>0?r.systemPrompt.trim():this.systemPrompt;return await this.callAnthropic(o,c,l,p,s,u);case"grok":return await this.callGrok(o,c,l,s);case"openrouter":return await this.callOpenRouter(o,c,l,s);case"custom":return await this.callCustomEndpoint(o,c,l,d,s);default:throw new Error(`Unknown provider: ${a}`)}}async callOpenAI(i,o,r,s){const a="https://api.openai.com/v1/chat/completions",c={model:r,messages:s?[{role:"system",content:"You are a helpful assistant."},{role:"user",content:'Say "OK" if you can read this.'}]:i,temperature:.7,max_tokens:s?10:2e3},l=await fetch(a,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${o}`},body:JSON.stringify(c)});if(!l.ok){let u=`OpenAI API error: ${l.status}`;try{const p=await l.json(),g=p.error?.message||"";g.includes("insufficient_quota")||g.includes("billing")?u="Insufficient credits or billing issue. Please check your OpenAI account balance.":l.status===401?u="Invalid API key. Please check your API key in System > AI Agent settings.":l.status===403?u="Access forbidden. Check your API key permissions and account status.":u=p.error?.message||u}catch{u=`OpenAI API error: ${l.status} ${l.statusText}`}throw new Error(u)}return(await l.json()).choices[0].message.content}async callAnthropic(i,o,r,s,a,c){const l=c||"http://localhost:3001/api/anthropic",d=i.filter(p=>p.role!=="system"),u={model:r,max_tokens:a?10:2e3,system:a?"You are a helpful assistant.":s,messages:a?[{role:"user",content:'Say "OK" if you can read this.'}]:d,apiKey:o||void 0};try{const p=await fetch(l,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(u)});if(!p.ok){let f=`Anthropic API error: ${p.status}`;try{const h=await p.json();f=h.error?.message||h.message||f}catch{}throw new Error(f)}return(await p.json()).content[0].text}catch(p){throw p.message.includes("Failed to fetch")||p.message.includes("NetworkError")||p.name==="TypeError"?new Error(`Could not connect to Anthropic proxy server at ${l}. Make sure the proxy server is running. See proxy-server/README.md for setup instructions.`):p}}async callGrok(i,o,r,s){const a="https://api.x.ai/v1/chat/completions",c={model:r,messages:s?[{role:"system",content:"You are a helpful assistant."},{role:"user",content:'Say "OK" if you can read this.'}]:i,stream:!1,temperature:s?0:.7,max_tokens:s?10:2e3},l=await fetch(a,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${o}`},body:JSON.stringify(c)});if(!l.ok){let u=`Grok API error: ${l.status} ${l.statusText}`;try{const p=await l.json();if(p.code||p.error){const g=p.code||"",f=p.error||"";g.includes("permission")||f.includes("credits")?u="No credits available. Please purchase credits at https://console.x.ai or check your account balance.":g.includes("authentication")||l.status===401?u="Invalid API key. Please check your API key in System > AI Agent settings.":l.status===403?u=p.error||p.message||"Access forbidden. Check your API key permissions and account status.":u=p.error||p.message||p.code||u}else u=p.message||u}catch{const g=await l.text();g&&(u+=` - ${g}`)}throw new Error(u)}return(await l.json()).choices[0].message.content}async callOpenRouter(i,o,r,s){const a="https://openrouter.ai/api/v1/chat/completions",c={model:r,messages:s?[{role:"system",content:"You are a helpful assistant."},{role:"user",content:'Say "OK" if you can read this.'}]:i},l=await fetch(a,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${o}`,"HTTP-Referer":window.location.origin,"X-Title":"ScriptO Studio"},body:JSON.stringify(c)});if(!l.ok){let u=`OpenRouter API error: ${l.status} ${l.statusText}`;try{const p=await l.json(),g=p.error?.message||p.message||"";g.includes("credits")||g.includes("balance")?u="Insufficient credits. Please add credits to your OpenRouter account.":l.status===401?u="Invalid API key. Please check your API key in System > AI Agent settings.":l.status===403?u=p.error?.message||p.message||"Access forbidden. Check your API key permissions and account status.":u=p.error?.message||p.message||u}catch{const g=await l.text();g&&(u+=` - ${g}`)}throw new Error(u)}return(await l.json()).choices[0].message.content}async callCustomEndpoint(i,o,r,s,a){if(!s)throw new Error("Custom endpoint URL is required");const c={model:r,messages:a?[{role:"system",content:"You are a helpful assistant."},{role:"user",content:'Say "OK" if you can read this.'}]:i,temperature:.7,max_tokens:a?10:2e3},l=await fetch(s,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${o}`},body:JSON.stringify(c)});if(!l.ok)throw new Error(`Custom endpoint error: ${l.status}`);const d=await l.json();if(d.choices&&d.choices[0]?.message?.content)return d.choices[0].message.content;if(d.content&&Array.isArray(d.content))return d.content[0].text;if(d.response)return d.response;if(d.text)return d.text;throw new Error("Unable to parse response from custom endpoint")}extractCode(i){let o=null;const r=i.match(/```python\n([\s\S]*?)```/);if(r&&(o=r[1].trim()),!o){const s=i.match(/```\n([\s\S]*?)```/);s&&(o=s[1].trim())}if(!o&&i.includes("# === START_CONFIG_PARAMETERS ===")&&(o=i.trim()),o){const s=o.includes("# === START_CONFIG_PARAMETERS ==="),a=o.includes("def ")||o.includes("import ")||o.includes("print(")||o.includes("class ")||/^[a-zA-Z_][\w]*\s*=/.test(o);return!s&&!a?(console.log("[AIBridge] Extracted content does not look like code, ignoring"),null):o.length<50?(console.log("[AIBridge] Extracted code too short, probably not valid:",o.length,"chars"),null):o}return null}}const AIBridgeInstance=new AIBridge;class ExtensionRegistry{constructor(){this.DB_NAME="scripto-studio-extension-registry",this.DB_VERSION=1,this.STORE_INDEX="index",this.STORE_EXTENSIONS="extensions",this.STORE_INSTALLED="installed"}async _initDB(){return new Promise((n,i)=>{const o=indexedDB.open(this.DB_NAME,this.DB_VERSION);o.onerror=()=>i(o.error),o.onsuccess=()=>n(o.result),o.onupgradeneeded=r=>{const s=r.target.result;s.objectStoreNames.contains(this.STORE_INDEX)||s.createObjectStore(this.STORE_INDEX,{keyPath:"id"}),s.objectStoreNames.contains(this.STORE_EXTENSIONS)||s.createObjectStore(this.STORE_EXTENSIONS,{keyPath:"id"}),s.objectStoreNames.contains(this.STORE_INSTALLED)||s.createObjectStore(this.STORE_INSTALLED,{keyPath:"id"})}})}async loadIndex(n){try{const i=await this._initDB();try{const o=await fetch(n);if(!o.ok)throw new Error(`Failed to fetch registry: ${o.status}`);const s=(await o.json()).extensions||[],c=i.transaction([this.STORE_INDEX],"readwrite").objectStore(this.STORE_INDEX);return await new Promise((l,d)=>{const u=c.put({id:"registry",timestamp:Date.now(),extensions:s});u.onsuccess=()=>l(),u.onerror=()=>d(u.error)}),console.log("[Extension Registry] Loaded and cached index:",s.length,"extensions"),s}catch(o){console.warn("[Extension Registry] Failed to fetch index, trying cache:",o);const s=i.transaction([this.STORE_INDEX],"readonly").objectStore(this.STORE_INDEX);return new Promise((a,c)=>{const l=s.get("registry");l.onsuccess=()=>{const d=l.result;d&&d.extensions?(console.log("[Extension Registry] Using cached index:",d.extensions.length,"extensions"),a(d.extensions)):c(new Error("No cached registry available"))},l.onerror=()=>c(l.error)})}}catch(i){return console.error("[Extension Registry] Error loading index:",i),[]}}parseExtensionConfig(content){const metaMatch=content.match(/export\s+const\s+__EXTENSION_META__\s*=\s*(\{[\s\S]*?\});/);if(!metaMatch)return console.error("[Extension Registry] No __EXTENSION_META__ found in V2 bundle"),null;try{return JSON.parse(metaMatch[1])}catch(error){try{return eval("("+metaMatch[1]+")")}catch(n){return console.error("[Extension Registry] Failed to parse V2 config:",error),null}}}async installExtension(n){try{console.log("[Extension Registry] Installing extension:",n.name);const i=await fetch(n.url);if(!i.ok)throw new Error(`Failed to fetch extension: ${i.status}`);const o=await i.text(),r=this.parseExtensionConfig(o);if(!r)throw new Error("Failed to parse extension config");const s=await this._initDB(),a={id:n.id,content:o,config:r,styles:r.styles||"",mipPackage:r.mipPackage||n.mipPackage||null,url:n.url,installedAt:Date.now()},l=s.transaction([this.STORE_EXTENSIONS],"readwrite").objectStore(this.STORE_EXTENSIONS);await new Promise((p,g)=>{const f=l.put(a);f.onsuccess=()=>p(),f.onerror=()=>g(f.error)});const u=s.transaction([this.STORE_INSTALLED],"readwrite").objectStore(this.STORE_INSTALLED);return await new Promise((p,g)=>{const f=u.put({id:n.id,name:r.name,icon:r.icon,iconSvg:r.iconSvg||null,menu:r.menu,version:r.version,mipPackage:r.mipPackage||null,installedAt:Date.now()});f.onsuccess=()=>p(),f.onerror=()=>g(f.error)}),console.log("[Extension Registry] Extension installed:",r.name),a}catch(i){throw console.error("[Extension Registry] Installation failed:",i),i}}async getInstalledExtensions(){try{const o=(await this._initDB()).transaction([this.STORE_INSTALLED],"readonly").objectStore(this.STORE_INSTALLED);return new Promise((r,s)=>{const a=o.getAll();a.onsuccess=()=>{console.log("[Extension Registry] Found installed extensions:",a.result.length),r(a.result)},a.onerror=()=>s(a.error)})}catch(n){return console.error("[Extension Registry] Error getting installed extensions:",n),[]}}async getExtension(n){try{const r=(await this._initDB()).transaction([this.STORE_EXTENSIONS],"readonly").objectStore(this.STORE_EXTENSIONS);return new Promise((s,a)=>{const c=r.get(n);c.onsuccess=()=>{c.result?(console.log("[Extension Registry] Loaded extension from cache:",n),s(c.result)):(console.warn("[Extension Registry] Extension not found in cache:",n),s(null))},c.onerror=()=>a(c.error)})}catch(i){return console.error("[Extension Registry] Error getting extension:",i),null}}async uninstallExtension(n){try{const i=await this._initDB(),r=i.transaction([this.STORE_EXTENSIONS],"readwrite").objectStore(this.STORE_EXTENSIONS);await new Promise((c,l)=>{const d=r.delete(n);d.onsuccess=()=>c(),d.onerror=()=>l(d.error)});const a=i.transaction([this.STORE_INSTALLED],"readwrite").objectStore(this.STORE_INSTALLED);return await new Promise((c,l)=>{const d=a.delete(n);d.onsuccess=()=>c(),d.onerror=()=>l(d.error)}),console.log("[Extension Registry] Extension uninstalled:",n),!0}catch(i){return console.error("[Extension Registry] Uninstall failed:",i),!1}}async installExtensionFromContent(n){try{const i=this.parseExtensionConfig(n);if(!i)throw new Error("Failed to parse extension config. Ensure the file is a valid bundle with __EXTENSION_META__.");if(!i.id)throw new Error('Extension config must have an "id" field');console.log("[Extension Registry] Installing extension from content:",i.name||i.id);const o=await this._initDB(),r={id:i.id,content:n,config:i,styles:i.styles||"",mipPackage:i.mipPackage||null,url:"local://dev",installedAt:Date.now()},a=o.transaction([this.STORE_EXTENSIONS],"readwrite").objectStore(this.STORE_EXTENSIONS);await new Promise((d,u)=>{const p=a.put(r);p.onsuccess=()=>d(),p.onerror=()=>u(p.error)});const l=o.transaction([this.STORE_INSTALLED],"readwrite").objectStore(this.STORE_INSTALLED);return await new Promise((d,u)=>{const p=l.put({id:i.id,name:i.name,icon:i.icon,iconSvg:i.iconSvg||null,menu:i.menu,version:i.version,mipPackage:i.mipPackage||null,installedAt:Date.now()});p.onsuccess=()=>d(),p.onerror=()=>u(p.error)}),console.log("[Extension Registry] Extension installed:",i.name),r}catch(i){throw console.error("[Extension Registry] Installation from content failed:",i),i}}async getDependencies(n){try{const r=(await this._initDB()).transaction([this.STORE_EXTENSIONS],"readonly").objectStore(this.STORE_EXTENSIONS);return new Promise((s,a)=>{const c=r.get(n);c.onsuccess=()=>{const l=c.result;l&&l.config&&l.config.mipPackage?s({mipPackage:l.config.mipPackage}):s(null)},c.onerror=()=>a(c.error)})}catch(i){return console.error("[Extension Registry] Error getting dependencies:",i),null}}async updateExtensionDev(n,i){try{console.log("[Extension Registry] DEV: Updating extension:",n);const o=this.parseExtensionConfig(i);if(!o)throw new Error("Failed to parse extension config from content");const r=await this._initDB(),s=await this.getExtension(n);if(!s)throw new Error(`Extension ${n} not found. Install it first from the registry.`);const a={id:n,content:i,config:o,styles:o.styles||"",mipPackage:o.mipPackage||null,url:s.url,installedAt:s.installedAt||Date.now()},l=r.transaction([this.STORE_EXTENSIONS],"readwrite").objectStore(this.STORE_EXTENSIONS);await new Promise((p,g)=>{const f=l.put(a);f.onsuccess=()=>p(),f.onerror=()=>g(f.error)});const u=r.transaction([this.STORE_INSTALLED],"readwrite").objectStore(this.STORE_INSTALLED);return await new Promise((p,g)=>{const f=u.put({id:n,name:o.name,icon:o.icon,iconSvg:o.iconSvg||null,menu:o.menu,version:o.version,mipPackage:o.mipPackage||null,installedAt:s.installedAt||Date.now()});f.onsuccess=()=>p(),f.onerror=()=>g(f.error)}),console.log("[Extension Registry] DEV: Extension updated successfully:",o.name),console.log("[Extension Registry] DEV: Reload the extension panel to see changes"),console.log("[Extension Registry] DEV: iconSvg stored:",!!o.iconSvg),a}catch(o){throw console.error("[Extension Registry] DEV: Update failed:",o),o}}async updateExtensionDevFromFile(n,i){try{console.log("[Extension Registry] DEV: Fetching extension from:",i);const o=await fetch(i);if(!o.ok)throw new Error(`Failed to fetch file: ${o.status} ${o.statusText}`);const r=await o.text();return await this.updateExtensionDev(n,r)}catch(o){throw console.error("[Extension Registry] DEV: Failed to load file:",o),o}}}let DeviceAPI$1=class{constructor(i){this.device=i}async execute(i,o=!0){if(!this.device)throw new Error("Device not connected");try{return await this.device.exec(i)||""}catch(r){throw console.error("[DeviceAPI] Execution error:",r),r}}async saveFile(i,o,r={}){if(!this.device)throw new Error("Device not connected");return this.device.saveFile(i,o,r)}async mkdir(i){if(!this.device)throw new Error("Device not connected");await this.device.exec(`
import os, json
def mkdirs(p):
  parts = p.strip('/').split('/')
  cur = ''
  for part in parts:
    cur += '/' + part
    try: os.mkdir(cur)
    except: pass
mkdirs('${i}')
print(json.dumps({"ok":True}))
`)}parseJSON(i){if(i&&typeof i=="object")return i;if(!i)throw new Error("Empty output from device");typeof i!="string"&&(i=String(i));try{return JSON.parse(i)}catch{const r=i.indexOf("{");if(r!==-1){let s=0,a=-1;for(let c=r;c<i.length;c++)if(i[c]==="{"&&s++,i[c]==="}"&&s--,s===0){a=c+1;break}if(a!==-1){const c=i.substring(r,a);try{return JSON.parse(c)}catch{throw new Error("Failed to parse extracted JSON: "+c.substring(0,100))}}}throw new Error("Failed to parse response: "+i.substring(0,100))}}},translations={en:{},de:{},es:{},fr:{}},currentLocale="en";function initTranslations(n,i,o,r){translations.en=n||{},translations.de=i||{},translations.es=o||{},translations.fr=r||{}}function getLocale(){return currentLocale}function setLocale(n){getAvailableLocales().includes(n)&&(currentLocale=n)}function getAvailableLocales(){return["en","de","es","fr"]}function getLocaleName(n){return{en:"English",de:"Deutsch",es:"Español",fr:"Français"}[n]||n}function t(n,i={}){const r=translations[currentLocale||"en"]||translations.en,s=n.split(".");let a=r;for(const c of s)if(a&&typeof a=="object"&&c in a)a=a[c];else{let d=translations.en||{};for(const u of s)if(d&&typeof d=="object"&&u in d)d=d[u];else return n;a=d;break}return typeof a!="string"?n:Object.keys(i).length>0?a.replace(/\{(\w+)\}/g,(c,l)=>i[l]!==void 0?i[l]:c):a}const i18n={initTranslations,getLocale,setLocale,getAvailableLocales,getLocaleName,t};window.i18n=i18n;class WebREPLWCB{constructor(){this.websocket=null,this.state="DISCONNECTED",this.password="",this.dataCallbacks=[],this.connectionClosedCallbacks=[],this.eventHandlers=new Map,this.completionCallbacks=[],this.onEthStatus=null,this.onWwanStatus=null,this.pendingRequests=new Map,this.pendingRun=null,this.pendingFileOps=new Map,this.currentTransfer=null,this.isReady=!1,this.authenticated=!1,this.CH_FILE=23,this.CH_TRM=1,this.CH_M2M=2,this.CH_DBG=3,this.CH_LOG=4,this.CH_EVENT=0,this.OP_EXE=0,this.OP_INT=1,this.OP_RST=2,this.OP_RES=0,this.OP_CON=1,this.OP_PRO=2,this.OP_COM=3,this.FILE_RRQ=1,this.FILE_WRQ=2,this.FILE_DATA=3,this.FILE_ACK=4,this.FILE_ERROR=5,this.ERR_NOT_FOUND=1,this.ERR_ACCESS=2,this.ERR_DISK_FULL=3,this.EVT_AUTH=0,this.EVT_AUTH_OK=1,this.EVT_AUTH_FAIL=2,this.EVT_INFO=3,this.EVT_LOG=4,this.FMT_PY=0,this.FMT_MPY=1,this.DEFAULT_BLKSIZE=4096}_generateId(){return Math.random().toString(36).substring(2,9)}_sendChannel(i,o,r="",s={}){if(!this.websocket||this.state!=="CONNECTED"){console.warn("[WCB] Cannot send: not connected");return}const a=[i,o,r];s.id!==void 0?(a.push(s.format!==void 0?s.format:null),a.push(s.id)):s.format!==void 0&&a.push(s.format);const c=cborExports.encode(a),l=r?r.length:0;console.debug(`[WCB] Sending CH=${i} OP=${o} DataLen=${l} EncodedLen=${c.byteLength}`),this.websocket.send(c)}_sendEvent(i,...o){if(!this.websocket||this.state!=="CONNECTED"){console.warn("[WCB] Cannot send: not connected");return}const r=[this.CH_EVENT,i,...o],s=cborExports.encode(r);this.websocket.send(s)}_sendFileMsg(i,...o){if(this.state!=="CONNECTED")return;const r=[this.CH_FILE,i,...o],s=cborExports.encode(r);this.websocket.send(s)}_handleMessage(i){const o=i.data;if(!(o instanceof ArrayBuffer)){console.warn("[WCB] Unexpected TEXT frame");return}try{const r=cborExports.decode(o);if(!Array.isArray(r)||r.length<2){console.warn("[WCB] Invalid message format");return}const s=r[0];s===this.CH_FILE?this._handleFile(r):s===this.CH_EVENT?this._handleEvent(r):s>=this.CH_TRM&&s<=22?this._handleChannel(r):console.warn("[WCB] Unknown channel:",s)}catch(r){console.error("[WCB] Failed to decode CBOR:",r);const s=new Uint8Array(o),a=Array.from(s.slice(0,32)).map(c=>c.toString(16).padStart(2,"0")).join(" ");console.error("[WCB] Raw data (first 32 bytes):",a),console.error("[WCB] As ASCII:",String.fromCharCode(...s.slice(0,32)))}}_handleChannel(i){if(i.length<3)return;const[o,r,...s]=i;switch(r){case this.OP_RES:this._handleRES(o,s[0],s[1]);break;case this.OP_CON:this._handleCON(o);break;case this.OP_PRO:this._handlePRO(o,s[0],s[1],s[2]);break;case this.OP_COM:this._handleCOM(o,s[0]);break;default:console.warn("[WCB] Unknown channel opcode:",r)}}_handleRES(i,o,r){const s=this.parseDebugState(o);if(s){console.debug("[WCB] Parsed debug state:",s);const a=this.eventHandlers.get("debug-state");if(a)try{a(s)}catch(c){console.error("[WCB] debug-state event handler error:",c)}}if(r&&this.pendingRequests.has(r)){const a=this.pendingRequests.get(r);a.buffer=(a.buffer||"")+o,console.debug("[WCB] M2M RES with ID:",r,"data length:",o.length,"total buffer:",a.buffer.length);return}i===this.CH_M2M&&!r&&(console.warn("[WCB] M2M RES message missing ID (device bug). Expected one of:",Array.from(this.pendingRequests.keys())),console.warn("[WCB] RES data:",o.substring(0,200))),i===this.CH_TRM?this._notifyData(o,!1):i===this.CH_DBG?this._notifyData(o,!1):i===this.CH_LOG&&console.log("[WCB LOG]",o)}_handleCON(i){console.debug("[WCB] Continuation prompt (...)")}_handleCOM(i,o){console.debug("[WCB] Tab completions on channel",i,":",o),this.completionCallbacks.forEach(r=>{try{r(i,o)}catch(s){console.error("[WCB] Completion callback error:",s)}})}_handlePRO(i,o,r=null,s=null){if(s&&this.pendingRequests.has(s)){const a=this.pendingRequests.get(s),{resolve:c,reject:l,timeoutId:d,buffer:u}=a;if(clearTimeout(d),this.pendingRequests.delete(s),o!==0)l(new Error(r||"Request failed"));else if(i===this.CH_M2M){console.debug("[WCB] M2M PRO success with ID:",s,"buffer length:",u?u.length:0,"buffer:",u?u.substring(0,200):"null");try{let p=null;if(u)try{p=JSON.parse(u)}catch(g){const f=u.indexOf("{");if(f!==-1){let h=0,m=-1;for(let v=f;v<u.length;v++)if(u[v]==="{"&&h++,u[v]==="}"&&h--,h===0){m=v+1;break}if(m!==-1){const v=u.substring(f,m);p=JSON.parse(v)}else throw g}else throw g}c(p)}catch(p){console.warn("[WCB] Failed to parse JSON buffer:",p,"buffer:",u?u.substring(0,200):"null"),c(u||null)}}else c(u||null);return}if(i===this.CH_M2M&&!s&&console.warn("[WCB] M2M PRO message missing ID (device bug):",{status:o,error:r}),o!==0){const a=r||"Unknown error";if(console.error("[WCB] Error:",a),this.isReady=!0,this.pendingRun){const{reject:c}=this.pendingRun;this.pendingRun=null,c(new Error(a))}}else if(this.isReady=!0,this.pendingRun){const{resolve:a}=this.pendingRun;this.pendingRun=null,a()}}_handleFile(i){if(i.length<2)return;const o=i[1],r=i.slice(2);if(!this.currentTransfer){console.warn("[WCB] Received file message with no active transfer");return}switch(o){case this.FILE_ACK:this._handleFileAck(r);break;case this.FILE_DATA:this._handleFileData(r);break;case this.FILE_ERROR:this._handleFileError(r);break;default:console.warn("[WCB] Unknown file opcode:",o)}}_handleFileAck(i){if(!this.currentTransfer)return;const o=i[0];this.currentTransfer.type==="UPLOAD"?o===this.currentTransfer.blockNum&&this.currentTransfer.resolveBlock():this.currentTransfer.type==="DOWNLOAD"&&o===0&&this.currentTransfer.blockNum===-1&&(i.length>1&&(this.currentTransfer.totalSize=i[1]),this._sendFileMsg(this.FILE_ACK,0),this.currentTransfer.blockNum=0)}_handleFileData(i){if(!this.currentTransfer||this.currentTransfer.type!=="DOWNLOAD")return;const o=i[0],r=i[1],s=(this.currentTransfer.blockNum+1)%65536;if(o===s){if((r instanceof Uint8Array||r instanceof ArrayBuffer)&&(this.currentTransfer.chunks.push(r),this.currentTransfer.receivedSize+=r.byteLength),this.currentTransfer.blockNum=o,this._sendFileMsg(this.FILE_ACK,o),this.currentTransfer.progressCallback&&this.currentTransfer.totalSize>0){const a=Math.floor(this.currentTransfer.receivedSize/this.currentTransfer.totalSize*100);this.currentTransfer.progressCallback(Math.min(a,99))}if(r.byteLength<this.currentTransfer.blksize){this.currentTransfer.progressCallback&&this.currentTransfer.progressCallback(100);const a=(Date.now()-this.currentTransfer.startTime)/1e3,c=(this.currentTransfer.receivedSize/a/1024).toFixed(2),l=(this.currentTransfer.receivedSize*8/a/1e6).toFixed(2);console.log(`[WCB] Download complete: ${this.currentTransfer.path} (${this.currentTransfer.receivedSize} bytes in ${a.toFixed(2)}s = ${c} KB/s / ${l} Mbps)`);const d=new Blob(this.currentTransfer.chunks),u=new FileReader;u.onload=()=>{this.currentTransfer.resolve(new Uint8Array(u.result)),this.currentTransfer=null},u.readAsArrayBuffer(d)}}else o===this.currentTransfer.blockNum&&this._sendFileMsg(this.FILE_ACK,o)}_handleFileError(i){if(this.currentTransfer){const o=i[0],r=i[1];this.currentTransfer.reject(new Error(`TFTP Error ${o}: ${r}`)),this.currentTransfer=null}}_handleEvent(i){if(i.length<2)return;const[o,r,...s]=i;switch(r){case this.EVT_AUTH_OK:this._authResolve&&(this.authenticated=!0,this._authResolve(),this._authResolve=null,this._authReject=null);break;case this.EVT_AUTH_FAIL:if(this._authReject){const a=s[0]||"Authentication failed";this._authReject(new Error(a)),this._authResolve=null,this._authReject=null}break;case this.EVT_INFO:{let a={};try{const l=s[0];if(typeof l!="string"){console.error("[WCB] INFO payload must be a JSON string, got:",typeof l);break}a=JSON.parse(l)}catch(l){console.error("[WCB] Failed to parse INFO payload JSON:",l,s[0]);break}if(a.welcome){this.isReady=!0;const l=this.eventHandlers.get("welcome");l&&l(a.welcome)}if(a.heap!==void 0){const l={heap:a.heap,uptime:a.uptime,rssi:a.rssi,extra:a.extra},d=this.eventHandlers.get("auto_info");d&&d(l)}if(a.eth_status!==void 0){if(console.log("[WCB] Ethernet status event:",a.eth_status),this.onEthStatus)try{this.onEthStatus(a.eth_status)}catch(d){console.error("[WCB] onEthStatus callback error:",d)}const l=this.eventHandlers.get("eth_status");if(l)try{l(a.eth_status)}catch(d){console.error("[WCB] eth_status event handler error:",d)}}if(a.wwan_status!==void 0){if(console.log("[WCB] WWAN status event:",a.wwan_status),this.onWwanStatus)try{this.onWwanStatus(a.wwan_status)}catch(d){console.error("[WCB] onWwanStatus callback error:",d)}const l=this.eventHandlers.get("wwan_status");if(l)try{l(a.wwan_status)}catch(d){console.error("[WCB] wwan_status event handler error:",d)}}if(a.display_ui!==void 0){if(console.log("[WCB] Display UI event:",a.display_ui),this.onDisplayUi)try{this.onDisplayUi(a.display_ui)}catch(d){console.error("[WCB] onDisplayUi callback error:",d)}const l=this.eventHandlers.get("display_ui");if(l)try{l(a.display_ui)}catch(d){console.error("[WCB] display_ui event handler error:",d)}}const c=this.eventHandlers.get("info");c&&c(a)}break;case this.EVT_LOG:{const[a,c,l,d]=s,u={level:a,message:c,timestamp:l,source:d};console.debug("[WCB] LOG event received:",u);const p=this.eventHandlers.get("log");if(console.debug("[WCB] LOG handler check:",{hasHandler:!!p,handlerCount:this.eventHandlers.size,allHandlers:Array.from(this.eventHandlers.keys())}),p)console.debug("[WCB] Calling LOG handler with:",u),p(u);else{const g=["DBG","INF","WRN","ERR"][a]||"LOG";console.log(`[WCB ${g}] ${c} (no handler registered)`)}}break;default:console.debug("[WCB] Unhandled event:",r)}}async connect(i,o="password"){if(this.state!=="DISCONNECTED")throw new Error("Already connected or connecting");return this.password=o,new Promise((r,s)=>{try{const a=Date.now();console.log("[WCB] Connecting to:",i),this.websocket=new WebSocket(i,["webrepl.binary.v1"]),this.websocket.binaryType="arraybuffer",this.state="CONNECTING";const c=setTimeout(()=>{s(new Error("Connection timeout")),this.disconnect()},1e4);this.websocket.addEventListener("open",async()=>{console.log("[WCB] WebSocket opened after",Date.now()-a,"ms"),this.state="CONNECTED";try{await this._authenticate(),clearTimeout(c),this.isReady=!0,console.log("[WCB] Authenticated successfully"),r()}catch(l){clearTimeout(c),s(new Error("Authentication failed: "+l.message)),this.disconnect()}}),this.websocket.addEventListener("message",l=>{this._handleMessage(l)}),this.websocket.addEventListener("close",l=>{console.log("[WCB] Connection closed",{code:l.code,reason:l.reason||"No reason provided"}),this.state="DISCONNECTED",this.isReady=!1,this.authenticated=!1,this.currentTransfer&&(console.warn("[WCB] Transfer interrupted by disconnect:",this.currentTransfer.path),this.currentTransfer.reject&&this.currentTransfer.reject(new Error("Transfer interrupted: Connection closed")),this.currentTransfer=null),this._notifyConnectionClosed()}),this.websocket.addEventListener("error",l=>{console.error("[WCB] WebSocket error:",l),s(l)})}catch(a){this.state="DISCONNECTED",s(a)}})}async _authenticate(){return new Promise((i,o)=>{const r=setTimeout(()=>{this._authResolve=null,this._authReject=null,o(new Error("Auth timeout"))},1e4);this._authResolve=()=>{clearTimeout(r),i()},this._authReject=s=>{clearTimeout(r),o(s)},this._sendEvent(this.EVT_AUTH,this.password)})}async disconnect(){this.websocket&&(this.websocket.close(),this.websocket=null),this.state="DISCONNECTED",this.isReady=!1,this.authenticated=!1,this.pendingRequests.clear(),this.pendingRun=null,this.currentTransfer&&(console.warn("[WCB] Clearing transfer state on disconnect:",this.currentTransfer.path),this.currentTransfer.reject&&this.currentTransfer.reject(new Error("Transfer cancelled: Disconnected")),this.currentTransfer=null),this.pendingFileOps&&this.pendingFileOps.clear()}async exec(i){if(this.state!=="CONNECTED")throw new Error("Not connected");return new Promise((o,r)=>{const s=this._generateId(),a=setTimeout(()=>{this.pendingRequests.has(s)&&(this.pendingRequests.delete(s),r(new Error("M2M timeout")))},3e4);this.pendingRequests.set(s,{resolve:o,reject:r,timeoutId:a,buffer:""}),console.debug("[WCB] Sending M2M EXE with ID:",s,"code:",i.substring(0,50)),this._sendChannel(this.CH_M2M,this.OP_EXE,i+`
`,{format:this.FMT_PY,id:s})})}async execBytecode(i){if(this.state!=="CONNECTED")throw new Error("Not connected");return new Promise((o,r)=>{const s=this._generateId(),a=setTimeout(()=>{this.pendingRequests.has(s)&&(this.pendingRequests.delete(s),r(new Error("M2M timeout")))},3e4);this.pendingRequests.set(s,{resolve:o,reject:r,timeoutId:a,buffer:""}),this._sendChannel(this.CH_M2M,this.OP_EXE,i,{format:this.FMT_MPY,id:s})})}async sendInput(i){if(this.state!=="CONNECTED")throw new Error("Not connected");this._pendingInputEcho=i+`\r
`,this._sendChannel(this.CH_TRM,this.OP_EXE,i+"\r")}async run(i){if(this.state!=="CONNECTED")throw new Error("Not connected");return this.isReady||await this.interrupt(),console.debug("[WCB] Executing:",i.substring(0,50)+(i.length>50?"...":"")),this.isReady=!1,new Promise((o,r)=>{this.pendingRun={resolve:o,reject:r},this._sendChannel(this.CH_TRM,this.OP_EXE,i+`
`)})}async requestCompletion(i){if(this.state!=="CONNECTED")throw new Error("Not connected");return new Promise((o,r)=>{const s=setTimeout(()=>{this.offCompletion(a),r(new Error("Completion timeout"))},5e3),a=(c,l)=>{c===this.CH_TRM&&(clearTimeout(s),this.offCompletion(a),o(l||[]))};this.onCompletion(a),console.debug("[WCB] Requesting completion for:",i),this._sendChannel(this.CH_TRM,this.OP_EXE,i+"	")})}async interrupt(){if(this.pendingRun!==null)console.log("[WCB] Interrupting active script execution"),this._sendChannel(this.CH_TRM,this.OP_INT);else{console.log("[WCB] No script running - stopping background tasks via M2M");try{const o=await this.exec("from lib import bg_tasks; bg_tasks.stop_user_tasks()");console.log("[WCB] Stopped tasks:",o),this.isReady=!0}catch(o){console.warn("[WCB] Failed to send stop request:",o)}}return new Promise(o=>{const r=setInterval(()=>{this.isReady&&(clearInterval(r),o())},50);setTimeout(()=>{clearInterval(r),this.isReady=!0,o()},2e3)})}async reset(i=!1){if(this.state!=="CONNECTED")throw new Error("Not connected");console.log("[WCB] Sending",i?"hard":"soft","reset"),this._sendChannel(this.CH_TRM,this.OP_RST,i?1:0),this.isReady=!1}async saveFile(i,o,r={}){if(this.currentTransfer)throw new Error("Transfer already in progress");const s=typeof o=="string"?new TextEncoder().encode(o):o,a=s.length;return new Promise(async(c,l)=>{this.currentTransfer={type:"UPLOAD",path:i,data:s,totalSize:a,blockNum:0,blksize:8192,startTime:Date.now(),resolveBlock:null,resolve:c,reject:l,chunks:null},this._sendFileMsg(this.FILE_WRQ,i,a,this.DEFAULT_BLKSIZE,5e3,0);try{await new Promise(m=>{this.currentTransfer.resolveBlock=m});let d=0,u=1;const p=r.progressCallback;for(p&&p(0);d<a;){const m=s.slice(d,d+this.DEFAULT_BLKSIZE);if(this.currentTransfer.blockNum=u,this._sendFileMsg(this.FILE_DATA,u,m),await new Promise(v=>{this.currentTransfer.resolveBlock=v}),d+=m.length,u++,p&&a>0){const v=Math.floor(d/a*100);p(Math.min(v,99))}}p&&p(100),a===0&&(this._sendFileMsg(this.FILE_DATA,1,new Uint8Array(0)),this.currentTransfer.blockNum=1,await new Promise(m=>{this.currentTransfer.resolveBlock=m}));const g=(Date.now()-this.currentTransfer.startTime)/1e3,f=(a/g/1024).toFixed(2),h=(a*8/g/1e6).toFixed(2);console.log(`[WCB] Upload complete: ${i} (${a} bytes in ${g.toFixed(2)}s = ${f} KB/s / ${h} Mbps)`),this.currentTransfer=null,c()}catch(d){this.currentTransfer=null,l(d)}})}async loadFile(i,o={}){if(this.currentTransfer&&this.state==="DISCONNECTED"&&(console.warn("[WCB] Clearing stale transfer state before loadFile"),this.currentTransfer=null),this.currentTransfer)throw new Error("Transfer already in progress");return new Promise((r,s)=>{this.currentTransfer={type:"DOWNLOAD",path:i,totalSize:0,receivedSize:0,blockNum:-1,chunks:[],blksize:16384,startTime:Date.now(),progressCallback:o.progressCallback,resolve:r,reject:s},this._sendFileMsg(this.FILE_RRQ,i,16384,5e3)})}subscribe(i,o){this.eventHandlers.set(i,o)}unsubscribe(i){this.eventHandlers.delete(i)}onData(i){this.dataCallbacks=[i]}onConnectionClosed(i){this.connectionClosedCallbacks.push(i)}onCompletion(i){this.completionCallbacks.push(i)}offCompletion(i){const o=this.completionCallbacks.indexOf(i);o>=0&&this.completionCallbacks.splice(o,1)}_notifyData(i,o=!1){if(this._pendingInputEcho&&i.includes(this._pendingInputEcho)){if(i=i.replace(this._pendingInputEcho,""),this._pendingInputEcho=null,i==="")return}else if(this._pendingInputEcho&&this._pendingInputEcho.startsWith(i)){this._pendingInputEcho=this._pendingInputEcho.slice(i.length);return}this.dataCallbacks.forEach(r=>r(i,o))}_notifyConnectionClosed(){this.connectionClosedCallbacks.forEach(i=>i())}isCommandRunning(){return this.pendingRun!==null||!this.isReady}isFileOperationActive(){return this.currentTransfer!==null||this.pendingFileOps.size>0}parseDebugState(i){const o="\x1B[?1049hD",r="D\x1B[?1049l";if(i.includes(o)&&i.includes(r)){const s=i.indexOf(o)+o.length,a=i.indexOf(r),c=i.substring(s,a);try{return JSON.parse(c)}catch(l){return console.error("[WCB] Failed to parse debug state:",l),null}}return null}async sendDebugCommand(i){const o=`_debug_cmd = '${i}'; import __main__; setattr(__main__, '_debug_cmd', '${i}'); import builtins; setattr(builtins, '_debug_cmd', '${i}')`;return console.log("[WCB] Sending debug command via M2M:",i),this.exec(o)}}const CBOR_RTC=CBOR;class WebREPLRTC{constructor(){this.pc=null,this.dataChannel=null,this.state="DISCONNECTED",this.signalingUrl="",this.dataCallbacks=[],this.connectionClosedCallbacks=[],this.eventHandlers=new Map,this.completionCallbacks=[],this.pendingRequests=new Map,this.pendingRun=null,this.pendingFileOps=new Map,this.currentTransfer=null,this.keepaliveTimer=null,this.isReady=!1,this.authenticated=!1,this.CH_FILE=23,this.CH_TRM=1,this.CH_M2M=2,this.CH_DBG=3,this.CH_LOG=4,this.CH_EVENT=0,this.OP_EXE=0,this.OP_INT=1,this.OP_RST=2,this.OP_RES=0,this.OP_CON=1,this.OP_PRO=2,this.OP_COM=3,this.FILE_RRQ=1,this.FILE_WRQ=2,this.FILE_DATA=3,this.FILE_ACK=4,this.FILE_ERROR=5,this.ERR_NOT_FOUND=1,this.ERR_ACCESS=2,this.ERR_DISK_FULL=3,this.EVT_AUTH=0,this.EVT_AUTH_OK=1,this.EVT_AUTH_FAIL=2,this.EVT_INFO=3,this.EVT_LOG=4,this.CH_AUTH=0,this.FMT_PY=0,this.FMT_MPY=1,this.DEFAULT_BLKSIZE=4096}_generateId(){return Math.random().toString(36).substring(2,9)}_sendChannel(i,o,r="",s={}){if(!this.dataChannel||this.dataChannel.readyState!=="open"){console.warn("[RTC] Cannot send: DataChannel not open",{hasDataChannel:!!this.dataChannel,readyState:this.dataChannel?.readyState,state:this.state});return}const a=[i,o,r];s.id!==void 0?(a.push(s.format!==void 0?s.format:null),a.push(s.id)):s.format!==void 0&&a.push(s.format);const c=CBOR_RTC.encode(a);try{this.dataChannel.send(c)}catch(l){throw console.error("[RTC] DataChannel send failed:",l,{readyState:this.dataChannel.readyState,bufferedAmount:this.dataChannel.bufferedAmount}),l}}_sendEvent(i,...o){if(!this.dataChannel||this.dataChannel.readyState!=="open"){console.warn("[RTC] Cannot send event: DataChannel not open");return}const r=[this.CH_AUTH,i,...o],s=CBOR_RTC.encode(r);this.dataChannel.send(s)}_sendFileMsg(i,...o){if(!this.dataChannel||this.dataChannel.readyState!=="open")return;const r=[this.CH_FILE,i,...o],s=CBOR_RTC.encode(r);this.dataChannel.send(s)}_handleMessage(i){const o=Date.now(),r=i.data;if(console.debug("[RTC] Received message:",{type:typeof r,size:r?.byteLength||0,timestamp:o}),!(r instanceof ArrayBuffer)){console.warn("[RTC] Unexpected non-binary data");return}try{const s=CBOR_RTC.decode(r);if(console.debug("[RTC] Decoded message:",s),!Array.isArray(s)||s.length<2){console.warn("[RTC] Invalid message format");return}const a=s[0];a===this.CH_FILE?this._handleFile(s):a===this.CH_EVENT?this._handleEvent(s):a>=this.CH_TRM&&a<=22?this._handleChannel(s):console.warn("[RTC] Unknown channel:",a)}catch(s){console.error("[RTC] Failed to decode CBOR:",s);const a=new Uint8Array(r),c=Array.from(a.slice(0,32)).map(l=>l.toString(16).padStart(2,"0")).join(" ");console.error("[RTC] Raw data (first 32 bytes):",c),console.error("[RTC] As ASCII:",String.fromCharCode(...a.slice(0,32)))}}_handleChannel(i){if(i.length<3)return;const[o,r,...s]=i;switch(console.debug("[RTC] Handling channel message:",{channel:o,opcode:r,restLength:s.length}),r){case this.OP_RES:this._handleRES(o,s[0],s[1]);break;case this.OP_CON:this._handleCON(o);break;case this.OP_PRO:this._handlePRO(o,s[0],s[1],s[2]);break;case this.OP_COM:this._handleCOM(o,s[0]);break;default:console.warn("[RTC] Unknown channel opcode:",r)}}_handleRES(i,o,r){if(console.debug("[RTC] Handling RES:",{channel:i,dataType:typeof o,dataLength:o?.length||0,id:r}),r&&this.pendingRequests.has(r)){const s=this.pendingRequests.get(r);s.buffer=(s.buffer||"")+o,console.debug("[RTC] Buffered data for ID:",r,"Total:",s.buffer.length);return}i===this.CH_M2M&&!r&&(console.warn("[RTC] M2M RES message missing ID (device bug). Expected one of:",Array.from(this.pendingRequests.keys())),console.warn("[RTC] RES data:",o?.substring?o.substring(0,200):o)),i===this.CH_TRM?(console.debug("[RTC] Notifying terminal data:",o),this._notifyData(o,!1)):i===this.CH_DBG?(console.debug("[RTC] Notifying debug data:",o),this._notifyData(o,!1)):i===this.CH_LOG&&console.log("[RTC LOG]",o)}_handleCON(i){}_handleCOM(i,o){this.completionCallbacks.forEach(r=>{try{r(i,o)}catch(s){console.error(s)}})}_handlePRO(i,o,r=null,s=null){if(console.log("[RTC] PRO received:",{channel:i,status:o,error:r,id:s,pendingRun:!!this.pendingRun}),s&&this.pendingRequests.has(s)){const a=this.pendingRequests.get(s),{resolve:c,reject:l,timeoutId:d,buffer:u}=a;if(console.debug("[RTC] Completing request:",s,"Buffer:",u),clearTimeout(d),this.pendingRequests.delete(s),o!==0)l(new Error(r||"Request failed"));else if(i===this.CH_M2M){console.debug("[RTC] M2M PRO success with ID:",s,"buffer length:",u?u.length:0);try{let p=null;if(u)try{p=JSON.parse(u)}catch(g){const f=u.indexOf("{");if(f!==-1){let h=0,m=-1;for(let v=f;v<u.length;v++)if(u[v]==="{"&&h++,u[v]==="}"&&h--,h===0){m=v+1;break}if(m!==-1){const v=u.substring(f,m);p=JSON.parse(v)}else throw g}else throw g}console.debug("[RTC] M2M result parsed:",p),c(p)}catch(p){console.warn("[RTC] Failed to parse JSON buffer:",p,"buffer:",u?u.substring(0,200):"null"),c(u||null)}}else c(u||null);return}if(console.log("[RTC] PRO for TRM, pendingRun:",!!this.pendingRun,"id:",s),o!==0){const a=r||"Unknown error";if(console.error("[RTC] Error:",a),this.pendingRun){const{reject:c}=this.pendingRun;this.pendingRun=null,c(new Error(a))}}else if(this.isReady=!0,this.pendingRun){console.log("[RTC] Resolving pendingRun, setting isReady=true");const{resolve:a}=this.pendingRun;this.pendingRun=null,a()}}_handleFile(i){if(i.length<2)return;const o=i[1],r=i.slice(2);if(!this.currentTransfer){console.warn("[RTC] File message with no active transfer");return}switch(o){case this.FILE_ACK:this._handleFileAck(r);break;case this.FILE_DATA:this._handleFileData(r);break;case this.FILE_ERROR:this._handleFileError(r);break}}_handleFileAck(i){if(!this.currentTransfer)return;const o=i[0];this.currentTransfer.type==="UPLOAD"?o===this.currentTransfer.blockNum&&this.currentTransfer.resolveBlock():this.currentTransfer.type==="DOWNLOAD"&&o===0&&this.currentTransfer.blockNum===-1&&(i.length>1&&(this.currentTransfer.totalSize=i[1]),this._sendFileMsg(this.FILE_ACK,0),this.currentTransfer.blockNum=0)}_handleFileData(i){if(!this.currentTransfer||this.currentTransfer.type!=="DOWNLOAD")return;const o=i[0],r=i[1],s=(this.currentTransfer.blockNum+1)%65536;if(o===s){if(this.currentTransfer.chunks.push(r),this.currentTransfer.receivedSize+=r.byteLength,this.currentTransfer.totalSize&&this.currentTransfer.progressCallback){const a=Math.floor(this.currentTransfer.receivedSize*100/this.currentTransfer.totalSize);this.currentTransfer.progressCallback(Math.min(a,99))}if(this._sendFileMsg(this.FILE_ACK,o),this.currentTransfer.blockNum=o,r.byteLength<this.currentTransfer.blksize){this.currentTransfer.progressCallback&&this.currentTransfer.progressCallback(100);const a=new Blob(this.currentTransfer.chunks),c=new FileReader;c.onload=()=>{this.currentTransfer.resolve(new Uint8Array(c.result)),this.currentTransfer=null},c.readAsArrayBuffer(a)}}else o===this.currentTransfer.blockNum&&this._sendFileMsg(this.FILE_ACK,o)}_handleFileError(i){if(this.currentTransfer){const o=i[0],r=i[1];this.currentTransfer.reject(new Error(`TFTP Error ${o}: ${r}`)),this.currentTransfer=null}}_handleEvent(i){if(i.length<2)return;const[o,r,...s]=i;switch(r){case this.EVT_INFO:{let a={};try{const l=s[0];if(typeof l!="string"){console.error("[RTC] INFO payload must be a JSON string, got:",typeof l);break}a=JSON.parse(l)}catch(l){console.error("[RTC] Failed to parse INFO payload JSON:",l,s[0]);break}if(a.welcome){this.isReady=!0;const l=this.eventHandlers.get("welcome");l&&l(a.welcome)}if(a.display_ui!==void 0){if(console.log("[RTC] Display UI event:",a.display_ui),this.onDisplayUi)try{this.onDisplayUi(a.display_ui)}catch(d){console.error("[RTC] onDisplayUi callback error:",d)}const l=this.eventHandlers.get("display_ui");if(l)try{l(a.display_ui)}catch(d){console.error("[RTC] display_ui event handler error:",d)}}const c=this.eventHandlers.get("info");c&&c(a)}break;case this.EVT_AUTH_OK:this._authResolve&&(this.authenticated=!0,this._authResolve(),this._authResolve=null,this._authReject=null);break;case this.EVT_AUTH_FAIL:{const a=s[0]||"Authentication failed";console.error("[RTC] Authentication failed:",a),this._authReject&&(this._authReject(new Error(a)),this._authResolve=null,this._authReject=null)}break;case this.EVT_LOG:{const[a,c,l,d]=s,u={level:a,message:c,timestamp:l,source:d},p=this.eventHandlers.get("log");p&&p(u)}break}}async connect(i,o=""){if(this.state!=="DISCONNECTED")throw new Error("Already connected or connecting");let r,s;i=i.trim(),i.startsWith("https://")?(r="https:",i=i.slice(8)):i.startsWith("http://")?(r="http:",i=i.slice(7)):r=window.location.protocol==="https:"?"https:":"http:";const a=i.indexOf("/");a!==-1&&(i=i.slice(0,a)),s=i,this.signalingUrl=`${r}//${s}/webrtc/offer`,this.state="CONNECTING";try{this.pc=new RTCPeerConnection({iceServers:[{urls:"stun:stun.l.google.com:19302"}]}),this.dataChannel=this.pc.createDataChannel("wbp",{ordered:!0,protocol:"webrepl.binary.v1"}),this.dataChannel.binaryType="arraybuffer",this._setupDataChannel();const c=[],l=new Promise(f=>{this.pc.onicecandidate=h=>{h.candidate?c.push(h.candidate.candidate):f()},setTimeout(f,3e3)}),d=await this.pc.createOffer();await this.pc.setLocalDescription(d),await l;let u=this.pc.localDescription.sdp;const p=await fetch(this.signalingUrl,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sdp:u,password:o})});if(!p.ok)throw new Error(`Signaling failed: ${p.status}`);const g=await p.json();if(g.error)throw new Error(g.error);if(await this.pc.setRemoteDescription({type:"answer",sdp:g.sdp}),g.ice_candidates)for(const f of g.ice_candidates)try{await this.pc.addIceCandidate({candidate:f,sdpMid:"0",sdpMLineIndex:0})}catch{}await new Promise((f,h)=>{const m=setTimeout(()=>h(new Error("DataChannel open timeout")),1e4);this.dataChannel.readyState==="open"?(clearTimeout(m),f()):(this.dataChannel.onopen=()=>{clearTimeout(m),f()},this.dataChannel.onerror=v=>{clearTimeout(m),h(new Error("DataChannel error"))})}),await this.authenticate(o),this.state="CONNECTED",this.isReady=!0,console.log("[RTC] Connection established:",{state:this.state,isReady:this.isReady,dataChannelState:this.dataChannel.readyState,peerConnectionState:this.pc.connectionState}),this._startKeepalive()}catch(c){throw console.error("[RTC] Connection failed:",c),this.state="DISCONNECTED",this._cleanup(),c}}async authenticate(i){if(!this.dataChannel||this.dataChannel.readyState!=="open")throw new Error("DataChannel not open");if(!this.authenticated)return new Promise((o,r)=>{const s=setTimeout(()=>{this._authResolve=null,this._authReject=null,r(new Error("Authentication timeout"))},1e4);this._authResolve=()=>{clearTimeout(s),o()},this._authReject=a=>{clearTimeout(s),r(a)},this._sendEvent(this.EVT_AUTH,i)})}_setupDataChannel(){this.dataChannel.onmessage=i=>this._handleMessage(i),this.dataChannel.onclose=()=>{this.state="DISCONNECTED",this.isReady=!1,this._stopKeepalive(),this._notifyConnectionClosed()},this.dataChannel.onerror=i=>{console.error("[RTC] DataChannel error:",i)}}_startKeepalive(){this._stopKeepalive(),this.keepaliveTimer=setInterval(()=>{if(this.dataChannel&&this.dataChannel.readyState==="open")try{const i=CBOR_RTC.encode([0,99]);this.dataChannel.send(i)}catch(i){console.warn("[RTC] Keepalive send failed:",i)}},2e3)}_stopKeepalive(){this.keepaliveTimer&&(clearInterval(this.keepaliveTimer),this.keepaliveTimer=null)}_cleanup(){this._stopKeepalive(),this.dataChannel&&(this.dataChannel.close(),this.dataChannel=null),this.pc&&(this.pc.close(),this.pc=null),this.currentTransfer=null,this.pendingRequests.clear(),this.pendingRun=null}async disconnect(){this._cleanup(),this.state="DISCONNECTED",this.isReady=!1,this.authenticated=!1}async exec(i){if(this.state!=="CONNECTED")throw new Error("Not connected");return new Promise((o,r)=>{const s=this._generateId(),a=setTimeout(()=>{this.pendingRequests.has(s)&&(this.pendingRequests.delete(s),r(new Error("M2M timeout")))},3e4);this.pendingRequests.set(s,{resolve:o,reject:r,timeoutId:a,buffer:""}),this._sendChannel(this.CH_M2M,this.OP_EXE,i+`
`,{format:this.FMT_PY,id:s})})}async run(i){if(this.state!=="CONNECTED")throw new Error("Not connected");const o=performance.now();return this.isReady||(console.log("[RTC] run(): isReady=false, calling interrupt()..."),await this.interrupt(),console.log("[RTC] run(): interrupt() took",(performance.now()-o).toFixed(0),"ms")),this.isReady=!1,console.log("[RTC] run(): sending command, total setup time:",(performance.now()-o).toFixed(0),"ms"),new Promise((r,s)=>{const a=setTimeout(()=>{this.pendingRun&&(console.warn("[RTC] run(): Command timed out after 30 seconds"),this.pendingRun=null,this.isReady=!0,s(new Error("Command timeout")))},3e4);this.pendingRun={resolve:c=>{clearTimeout(a),r(c)},reject:c=>{clearTimeout(a),s(c)}},this._sendChannel(this.CH_TRM,this.OP_EXE,i+`
`)})}async interrupt(){return this._sendChannel(this.CH_TRM,this.OP_INT),new Promise(i=>{const o=setInterval(()=>{this.isReady&&(clearInterval(o),i())},50);setTimeout(()=>{clearInterval(o),this.isReady=!0,i()},2e3)})}async requestCompletion(i){if(this.state!=="CONNECTED")throw new Error("Not connected");return new Promise((o,r)=>{const s=setTimeout(()=>{this.offCompletion(a),r(new Error("Completion timeout"))},5e3),a=(c,l)=>{c===this.CH_TRM&&(clearTimeout(s),this.offCompletion(a),o(l||[]))};this.onCompletion(a),console.debug("[RTC] Requesting completion for:",i),this._sendChannel(this.CH_TRM,this.OP_EXE,i+"	")})}async reset(i=!1){if(this.state!=="CONNECTED")throw new Error("Not connected");this._sendChannel(this.CH_TRM,this.OP_RST,i?1:0),this.isReady=!1}async saveFile(i,o,r={}){if(this.currentTransfer)throw new Error("Transfer already in progress");const s=typeof o=="string"?new TextEncoder().encode(o):o,a=s.length;return new Promise(async(c,l)=>{this.currentTransfer={type:"UPLOAD",path:i,data:s,totalSize:a,blockNum:0,blksize:this.DEFAULT_BLKSIZE,startTime:Date.now(),resolveBlock:null,resolve:c,reject:l},this._sendFileMsg(this.FILE_WRQ,i,a,this.DEFAULT_BLKSIZE,5e3,0);try{await new Promise(g=>{this.currentTransfer.resolveBlock=g});let d=0,u=1;const p=r.progressCallback;for(p&&p(0);d<a;){const g=s.slice(d,d+this.DEFAULT_BLKSIZE);this.currentTransfer.blockNum=u,this._sendFileMsg(this.FILE_DATA,u,g),await new Promise(f=>{this.currentTransfer.resolveBlock=f}),d+=g.length,u++,p&&a>0&&p(Math.min(Math.floor(d/a*100),99))}p&&p(100),a===0&&(this._sendFileMsg(this.FILE_DATA,1,new Uint8Array(0)),this.currentTransfer.blockNum=1,await new Promise(g=>{this.currentTransfer.resolveBlock=g})),this.currentTransfer=null,c()}catch(d){this.currentTransfer=null,l(d)}})}async loadFile(i,o={}){if(this.currentTransfer)throw new Error("Transfer already in progress");return new Promise((r,s)=>{this.currentTransfer={type:"DOWNLOAD",path:i,totalSize:0,receivedSize:0,blockNum:-1,chunks:[],blksize:16384,startTime:Date.now(),progressCallback:o.progressCallback,resolve:r,reject:s},this._sendFileMsg(this.FILE_RRQ,i,16384,5e3)})}subscribe(i,o){this.eventHandlers.set(i,o)}unsubscribe(i){this.eventHandlers.delete(i)}onData(i){this.dataCallbacks=[i]}onConnectionClosed(i){this.connectionClosedCallbacks.push(i)}onCompletion(i){this.completionCallbacks.push(i)}offCompletion(i){const o=this.completionCallbacks.indexOf(i);o>=0&&this.completionCallbacks.splice(o,1)}_notifyData(i,o=!1){console.debug("[RTC] _notifyData called:",{data:i,isError:o,callbackCount:this.dataCallbacks.length}),this.dataCallbacks.forEach(r=>r(i,o))}_notifyConnectionClosed(){this.connectionClosedCallbacks.forEach(i=>i())}isCommandRunning(){return this.pendingRun!==null||!this.isReady}isFileOperationActive(){return this.currentTransfer!==null||this.pendingFileOps.size>0}}class WebREPLBridge{constructor(){this.client=null,this.transportType=null,this.pendingCallbacks={onData:null,onConnectionClosed:[],onCompletion:[],subscriptions:{}}}async connect(i,o="rtyu4567"){if(i.startsWith("ws://")||i.startsWith("wss://"))console.log("[Bridge] Using WebSocket transport"),this.client=new WebREPLWCB,this.transportType="websocket";else if(i.startsWith("http://")||i.startsWith("https://")){if(console.log("[Bridge] Using WebRTC transport"),typeof WebREPLRTC>"u")throw new Error("WebRTC transport not available");this.client=new WebREPLRTC,this.transportType="webrtc"}else throw new Error(`Unknown transport protocol in URL: ${i}
Supported: ws://, wss://, http://, https://`);this.pendingCallbacks.onData&&this.client.onData(this.pendingCallbacks.onData);for(const r of this.pendingCallbacks.onConnectionClosed)this.client.onConnectionClosed(r);for(const r of this.pendingCallbacks.onCompletion)this.client.onCompletion(r);for(const[r,s]of Object.entries(this.pendingCallbacks.subscriptions))this.client.subscribe(r,s);return this.client.connect(i,o)}async disconnect(){if(this.client){const i=await this.client.disconnect();return this.client=null,this.transportType=null,i}}async exec(i){if(!this.client)throw new Error("Not connected");return this.client.exec(i)}async execBytecode(i){if(!this.client)throw new Error("Not connected");return this.client.execBytecode(i)}async run(i){if(!this.client)throw new Error("Not connected");return this.client.run(i)}async sendInput(i){if(!this.client)throw new Error("Not connected");return this.client.sendInput?this.client.sendInput(i):this.client.run(i)}async requestCompletion(i){if(!this.client)throw new Error("Not connected");return this.client.requestCompletion(i)}async interrupt(){if(!this.client)throw new Error("Not connected");return this.client.interrupt()}async reset(i=!1){if(!this.client)throw new Error("Not connected");return this.client.reset(i)}async sendDebugCommand(i){if(!this.client)throw new Error("Not connected");return this.client.sendDebugCommand(i)}async saveFile(i,o,r={}){if(!this.client)throw new Error("Not connected");return this.client.saveFile(i,o,r)}async loadFile(i,o={}){if(!this.client)throw new Error("Not connected");return this.client.loadFile(i,o)}onData(i){if(!this.client){this.pendingCallbacks.onData=i;return}this.client.onData(i)}onConnectionClosed(i){if(!this.client){this.pendingCallbacks.onConnectionClosed.push(i);return}this.client.onConnectionClosed(i)}subscribe(i,o){if(!this.client){this.pendingCallbacks.subscriptions[i]=o;return}this.client.subscribe(i,o)}unsubscribe(i){this.client&&this.client.unsubscribe(i)}onCompletion(i){if(!this.client){this.pendingCallbacks.onCompletion.push(i);return}this.client.onCompletion(i)}offCompletion(i){this.client&&this.client.offCompletion(i)}isCommandRunning(){return this.client?this.client.isCommandRunning():!1}isFileOperationActive(){return this.client?this.client.isFileOperationActive():!1}get state(){return this.client?.state||"DISCONNECTED"}get isReady(){return this.client?.isReady||!1}get authenticated(){return this.client?.authenticated||!1}set onEthStatus(i){this.client&&(this.client.onEthStatus=i)}get onEthStatus(){return this.client?.onEthStatus}set onWwanStatus(i){this.client&&(this.client.onWwanStatus=i)}get onWwanStatus(){return this.client?.onWwanStatus}set onDisplayUi(i){this.client&&(this.client.onDisplayUi=i)}get onDisplayUi(){return this.client?.onDisplayUi}set onPlotData(i){this.client&&(this.client.onPlotData=i)}get onPlotData(){return this.client?.onPlotData}set onMqttConfig(i){this.client&&(this.client.onMqttConfig=i)}get onMqttConfig(){return this.client?.onMqttConfig}set onMqttConfigSave(i){this.client&&(this.client.onMqttConfigSave=i)}get onMqttConfigSave(){return this.client?.onMqttConfigSave}set onWwanConfig(i){this.client&&(this.client.onWwanConfig=i)}get onWwanConfig(){return this.client?.onWwanConfig}set onWwanConfigSave(i){this.client&&(this.client.onWwanConfigSave=i)}get onWwanConfigSave(){return this.client?.onWwanConfigSave}set onModemStatus(i){this.client&&(this.client.onModemStatus=i)}get onModemStatus(){return this.client?.onModemStatus}set onNtpSync(i){this.client&&(this.client.onNtpSync=i)}get onNtpSync(){return this.client?.onNtpSync}set onNtpConfig(i){this.client&&(this.client.onNtpConfig=i)}get onNtpConfig(){return this.client?.onNtpConfig}set onNtpConfigSave(i){this.client&&(this.client.onNtpConfigSave=i)}get onNtpConfigSave(){return this.client?.onNtpConfigSave}set onCanConfig(i){this.client&&(this.client.onCanConfig=i)}get onCanConfig(){return this.client?.onCanConfig}set onCanConfigSave(i){this.client&&(this.client.onCanConfigSave=i)}get onCanConfigSave(){return this.client?.onCanConfigSave}set onVpnConfig(i){this.client&&(this.client.onVpnConfig=i)}get onVpnConfig(){return this.client?.onVpnConfig}set onVpnConfigSave(i){this.client&&(this.client.onVpnConfigSave=i)}get onVpnConfigSave(){return this.client?.onVpnConfigSave}set onVpnConnect(i){this.client&&(this.client.onVpnConnect=i)}get onVpnConnect(){return this.client?.onVpnConnect}set onVpnDisconnect(i){this.client&&(this.client.onVpnDisconnect=i)}get onVpnDisconnect(){return this.client?.onVpnDisconnect}set onVpnInfo(i){this.client&&(this.client.onVpnInfo=i)}get onVpnInfo(){return this.client?.onVpnInfo}set onSdcardConfig(i){this.client&&(this.client.onSdcardConfig=i)}get onSdcardConfig(){return this.client?.onSdcardConfig}set onSdcardConfigSave(i){this.client&&(this.client.onSdcardConfigSave=i)}get onSdcardConfigSave(){return this.client?.onSdcardConfigSave}set onSdcardInfo(i){this.client&&(this.client.onSdcardInfo=i)}get onSdcardInfo(){return this.client?.onSdcardInfo}set onSdcardMount(i){this.client&&(this.client.onSdcardMount=i)}get onSdcardMount(){return this.client?.onSdcardMount}set onSdcardUnmount(i){this.client&&(this.client.onSdcardUnmount=i)}get onSdcardUnmount(){return this.client?.onSdcardUnmount}set onGpioConfig(i){this.client&&(this.client.onGpioConfig=i)}get onGpioConfig(){return this.client?.onGpioConfig}set onGpioConfigSave(i){this.client&&(this.client.onGpioConfigSave=i)}get onGpioConfigSave(){return this.client?.onGpioConfigSave}set onEthConfig(i){this.client&&(this.client.onEthConfig=i)}get onEthConfig(){return this.client?.onEthConfig}set onEthConfigSave(i){this.client&&(this.client.onEthConfigSave=i)}get onEthConfigSave(){return this.client?.onEthConfigSave}set onEthInit(i){this.client&&(this.client.onEthInit=i)}get onEthInit(){return this.client?.onEthInit}}const BridgeDevice=new WebREPLBridge,scriptRel="modulepreload",assetsURL=function(n){return"/app/"+n},seen={},__vitePreload=function n(i,o,r){let s=Promise.resolve();if(o&&o.length>0){document.getElementsByTagName("link");const c=document.querySelector("meta[property=csp-nonce]"),l=c?.nonce||c?.getAttribute("nonce");s=Promise.allSettled(o.map(d=>{if(d=assetsURL(d),d in seen)return;seen[d]=!0;const u=d.endsWith(".css"),p=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${p}`))return;const g=document.createElement("link");if(g.rel=u?"stylesheet":scriptRel,u||(g.as="script"),g.crossOrigin="",g.href=d,l&&g.setAttribute("nonce",l),document.head.appendChild(g),u)return new Promise((f,h)=>{g.addEventListener("load",f),g.addEventListener("error",()=>h(new Error(`Unable to preload CSS for ${d}`)))})}))}function a(c){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=c,window.dispatchEvent(l),!l.defaultPrevented)throw c}return s.then(c=>{for(const l of c||[])l.status==="rejected"&&a(l.reason);return i().catch(a)})};let Parser=null,Language=null,wasmUrl=null,pythonWasmImportUrl=null;const DEBUG_STATE_MODULE=`
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
`;let parserInstance=null,pythonLanguage=null;async function getParser(){if(parserInstance&&pythonLanguage)return parserInstance;try{if(!Parser){console.log("[Debugger] Lazy loading Tree-sitter...");const[n,i,o]=await Promise.all([__vitePreload(()=>import("./tree-sitter-C11OGzyA.js"),__vite__mapDeps([0,1,2,3])),__vitePreload(()=>import("./tree-sitter-B3V3Ji9r.js"),[]),__vitePreload(()=>import("./tree-sitter-python-DxlSE_Ss.js"),[])]);Parser=n.Parser,Language=n.Language,wasmUrl=i.default,pythonWasmImportUrl=o.default,console.log("[Debugger] Tree-sitter modules loaded")}if(await Parser.init({locateFile:()=>wasmUrl}),parserInstance=new Parser,console.log("[Debugger] Loading Python grammar..."),!pythonWasmImportUrl)throw new Error("tree-sitter-python.wasm URL not found in imports");return pythonLanguage=await Language.load(pythonWasmImportUrl),parserInstance.setLanguage(pythonLanguage),console.log("[Debugger] Tree-sitter parser initialized successfully"),parserInstance}catch(n){throw console.error("[Debugger] Failed to initialize parser:",n),new Error(`Tree-sitter initialization failed: ${n.message}`)}}async function identifyCodeRows(n){const i=await getParser();if(!i)return new Map;const o=i.parse(n),r=new Map,s=["expression_statement","assignment","return_statement","if_statement","for_statement","while_statement","try_statement","with_statement","function_definition","async_function_definition","class_definition","break_statement","continue_statement","pass_statement","match_statement"],a=["else_clause","elif_clause","except_clause","finally_clause","case_clause"],c=l=>{if(!l)return;let d=!1;const u=l.type;a.includes(u)?d=!1:s.includes(u)?(d=!0,(u==="function_definition"||u==="async_function_definition"||u==="class_definition")&&l.parent&&l.parent.type==="decorated_definition"&&(d=!1),u==="expression_statement"&&l.childCount===1&&l.firstChild.type==="string"&&(d=!1)):u==="decorated_definition"&&(d=!0),d&&r.set(l.startPosition.row,u);for(let p=0;p<l.childCount;p++)c(l.child(p))};return c(o.rootNode),r}function generateDebugBlock(n,i,o,r,s,a,c=null){let l="";if(c){const d=c.condition?`(${c.condition})`:"True",u=c.hitCount?`"${c.hitCount}"`:"None",p=c.enabled!==!1?"True":"False";l+=`${n}try:
`,l+=`${n}    _ds.us("${o}", ${r}, ${p} and ${d}, ${u})
`,l+=`${n}except:
`,l+=`${n}    pass
`}else i?l+=`${n}_ds.us("${o}", ${r}, True, None)
`:(a.forEach(d=>{l+=`${n}try:
`,l+=`${n}    if (${d}): _ds.s = "S"
`,l+=`${n}except:
`,l+=`${n}    pass
`}),l+=`${n}if _ds.s == "S":
`,n+="    ");return l+=`${n}_ds.sh("${o}", ${r})
`,l+=`${n}if _ds.s != "CO": _ds.sv(locals())
`,s.forEach(d=>{const u=d.replace(/"/g,'\\"');l+=`${n}try:
`,l+=`${n}    _ds.d["w"]["${u}"] = str(${d})
`,l+=`${n}except Exception as _debug_e:
`,l+=`${n}    _ds.d["w"]["${u}"] = str(_debug_e)
`}),l+=`${n}_ds.st()
`,l}async function instrumentCodeForExec(n,i={}){const{watches:o={},conditionalBP:r={},fileName:s="main.py"}=i,a=performance.now(),c=await identifyCodeRows(n);console.log(`[Debugger] Identified ${c.size} code rows in ${performance.now()-a}ms`);let l=n.split(/\r?\n/);const d=new Map,u=o[""]||[],p=o[s]||[],g=[...new Set([...u,...p])],f=r[""]||[],h=r[s]||[],m=[...new Set([...f,...h])],v=Array.from(c.keys()).sort((k,w)=>k-w);for(const k of v){const w=l[k],_=c.get(k);if(w===void 0)continue;const x=/# ●/.test(w),P=i.breakpoints&&i.breakpoints[s]?i.breakpoints[s][k+1]:null;(x||P)&&console.log(`[Debugger] Breakpoint detected at line ${k+1}: ${w}`);const T=w.match(/^(\s*)/)[1];let E=generateDebugBlock(T,x,s,k+1,g,m,P);_==="function_definition"?E+=`${T}@_ds.wrap
`:_==="async_function_definition"&&(E+=`${T}@_ds.awrap
`),x&&console.log(`[Debugger] Generated instrumentation for row ${k+1} (${_})`),d.set(k,E)}let y=[];for(let k=0;k<l.length;k++)d.has(k)&&y.push(d.get(k)),y.push(l[k]);const b=y.join(`
`),S=`${DEBUG_STATE_MODULE}

# Execute isolated code
_ds.exec("""${b.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/'/g,"\\'")}""")
`,C=performance.now()-a;return console.log(`[Debugger] Instrumentation complete in ${C.toFixed(0)}ms`),S}console.log("[Libs] ES modules loaded");function renderIcon(n,i={}){const{className:o="",size:r=24,color:s="currentColor"}=i;return html$1`
    <svg class="icon icon-tabler ${o}" 
         width="${r}" 
         height="${r}" 
         viewBox="0 0 24 24" 
         fill="none" 
         stroke="${s}" 
         stroke-width="2" 
         stroke-linecap="round" 
         stroke-linejoin="round">
      <use href="#tabler-${n}" />
    </svg>
  `}const IconSprite={renderIcon};await __vitePreload(()=>import("./vendor-DBsAqGKK.js"),__vite__mapDeps([1,2,3]));console.log("[Views] Vendor loaded, Component available:",!!window.Component);function Button(n){const{first:i=!1,size:o="",square:r=!1,icon:s="link",onClick:a=k=>{},disabled:c=!1,active:l=!1,tooltip:d,label:u,background:p}=n;let g=html``;d&&(g=html`<div class="tooltip">${d}</div>`),g=html``;let f=l?"active":"",h=l?"selected":"",m=p?"inverted":"",v=i?"first":"",y=r?"square":"",b=c?"inactive":"active",S=o==="small"?"":html`<div class="label ${b} ${h}">${u}</div>`;const C=IconSprite.renderIcon(s,{className:""});return html`
     <div class="button ${v}">
       <button disabled=${c} class="${y}${o} ${f} ${m}" onclick=${a}>
         ${C}
       </button>
       ${S}
       ${g}
     </div>
   `}let cm6Loaded=!1,EditorView,EditorState,Compartment,python,json,keymap,highlightActiveLine,lineNumbers,gutter,GutterMarker,search,searchKeymap,highlightSelectionMatches,foldGutter,foldKeymap,indentOnInput,syntaxHighlighting,defaultHighlightStyle,bracketMatching,closeBrackets,closeBracketsKeymap,indentWithTab,defaultKeymap,history,historyKeymap,baseTheme=null,themes=null,BreakpointMarkerClass=null;async function loadCM6(){if(!cm6Loaded)try{const[n,i,o,r,s,a,c,l,d,u]=await Promise.all([__vitePreload(()=>import("./vendor-BgmjMNkd.js").then(y=>y.ai),[]),__vitePreload(()=>import("./vendor-BgmjMNkd.js").then(y=>y.ah),[]),__vitePreload(()=>import("./index-DX8WB_Mh.js"),__vite__mapDeps([4,5,2,6])),__vitePreload(()=>import("./index-CC_OnImC.js"),__vite__mapDeps([7,5,2])),__vitePreload(()=>import("./index-uUR0fcff.js"),__vite__mapDeps([8,2])),__vitePreload(()=>import("./vendor-BgmjMNkd.js").then(y=>y.aj),[]),__vitePreload(()=>import("./index-Ct0B6E_D.js"),__vite__mapDeps([6,2])),__vitePreload(()=>import("./index-fKr_TzPR.js"),__vite__mapDeps([9,2])),__vitePreload(()=>import("./vendor-BgmjMNkd.js").then(y=>y.ak),[]),__vitePreload(()=>import("./index-DhGTJQR7.js"),__vite__mapDeps([10,2]))]);EditorView=n.EditorView,keymap=n.keymap,highlightActiveLine=n.highlightActiveLine,lineNumbers=n.lineNumbers,gutter=n.gutter,GutterMarker=n.GutterMarker,EditorState=i.EditorState,Compartment=i.Compartment,python=o.python,json=r.json,search=s.search,searchKeymap=s.searchKeymap,highlightSelectionMatches=s.highlightSelectionMatches,foldGutter=a.foldGutter,foldKeymap=a.foldKeymap,indentOnInput=a.indentOnInput,syntaxHighlighting=a.syntaxHighlighting,defaultHighlightStyle=a.defaultHighlightStyle,bracketMatching=a.bracketMatching,closeBrackets=c.closeBrackets,closeBracketsKeymap=c.closeBracketsKeymap,indentWithTab=l.indentWithTab,defaultKeymap=l.defaultKeymap,history=l.history,historyKeymap=l.historyKeymap,BreakpointMarkerClass=class extends GutterMarker{constructor(y=!0){super(),this.enabled=y}toDOM(){const y=document.createElement("span");return y.className="cm-breakpoint"+(this.enabled?"":" cm-breakpoint-disabled"),y.textContent="●",y}},baseTheme=EditorView.theme({"&":{height:"100%",fontSize:"14px"},".cm-scroller":{fontFamily:"var(--font-mono)",overflow:"auto"},".cm-content":{caretColor:"currentColor"},".cm-cursor":{borderLeftColor:"currentColor"},".cm-gutters":{backgroundColor:"transparent !important",borderRight:"none"},".cm-gutter.cm-lineNumbers":{backgroundColor:"transparent !important"},"&.cm-focused .cm-selectionBackground, ::selection":{backgroundColor:"rgba(100, 100, 100, 0.3)"},".cm-foldGutter .cm-gutterElement":{cursor:"pointer",padding:"0 3px"},".cm-breakpoint-gutter":{width:"20px !important",minWidth:"20px !important"},".cm-breakpoint-gutter .cm-gutterElement":{display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",padding:"0"},".cm-breakpoint":{color:"#e63946",fontSize:"14px",lineHeight:"1",paddingRight:"9px"},".cm-breakpoint-disabled":{opacity:"0.3"},".cm-panels":{fontSize:"14px"},".cm-panels input, .cm-panels button":{fontSize:"14px"}});const{cobalt:p,solarizedLight:g,coolGlow:f,clouds:h}=d,{xcodeDark:m,xcodeLight:v}=u;themes={cobalt:p,"solarized-light":g,"xcode-dark":m,"xcode-light":v,coolglow:f,clouds:h},cm6Loaded=!0,console.debug("[Editor] Lazy loaded CM6 modules")}catch(n){throw console.error("[Editor] Failed to load CM6:",n),n}}class CodeMirrorEditor extends Component{constructor(){super(),this.view=null,this.content="# empty file",this.fileName=null,this.scrollTop=0,this.currentTheme=null,this.themeCompartment=null,this.readOnlyCompartment=null,this.languageCompartment=null}createElement(i){return i&&(this.content=i),html`<div id="code-editor"></div>`}load(i){loadCM6().then(()=>this.createEditor(i)).catch(o=>{console.error("[Editor] Failed to initialize:",o),i.innerHTML='<div style="color:red;padding:10px;">Editor failed to load. Check console for errors.</div>'})}createEditor(i){this.themeCompartment=new Compartment,this.readOnlyCompartment=new Compartment,this.languageCompartment=new Compartment;const o=this.getEditorTheme();if(this.currentTheme=o,this.fileName&&typeof this.fileName=="string"&&this.fileName.toLowerCase().endsWith(".json")){const d=this._tryFormatJson(this.content);d!==null&&(this.content=d)}const r=window.appState?.debugger?.active||window.appState?.debugger?.configOpen||!1,s=this.getLanguageMode(),a=this,c=gutter({class:"cm-breakpoint-gutter",lineMarker:(d,u)=>{const p=d.state.doc.lineAt(u.from).number,g=d.state.doc.line(p).text;if(/# ●/.test(g)){const h=(window.appState?.debugger?.breakpoints?.[a.fileName]||{})[p],m=h?h.enabled!==!1:!0;return new BreakpointMarkerClass(m)}return null},domEventHandlers:{click:(d,u)=>{const p=d.state.doc.lineAt(u.from).number,g=d.state.doc.line(p).text;return/# ●/.test(g)?window.appInstance.emitter.emit("debugger:edit-breakpoint",{file:a.fileName,line:p}):a.toggleBreakpoint(p-1),!0}}}),l=EditorState.create({doc:this.content||"",extensions:[lineNumbers(),history(),foldGutter({openText:"▼",closedText:"▶"}),indentOnInput(),bracketMatching(),closeBrackets(),highlightActiveLine(),highlightSelectionMatches(),syntaxHighlighting(defaultHighlightStyle,{fallback:!0}),search({top:!0}),keymap.of([...defaultKeymap,...historyKeymap,...closeBracketsKeymap,...foldKeymap,...searchKeymap,indentWithTab]),this.languageCompartment.of(s),baseTheme,this.themeCompartment.of(themes[o]||themes.cobalt),this.readOnlyCompartment.of(EditorState.readOnly.of(r)),c,EditorView.updateListener.of(d=>{d.docChanged&&(this.content=d.state.doc.toString(),this.onChange()),d.geometryChanged&&(this.scrollTop=this.view?.scrollDOM.scrollTop||0)})]});this.view=new EditorView({state:l,parent:i}),setTimeout(()=>{this.view&&this.scrollTop>0&&(this.view.scrollDOM.scrollTop=this.scrollTop)},10),this.themeObserver=new MutationObserver(()=>{this.updateTheme()}),this.themeObserver.observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme"]}),this.editorThemeHandler=()=>this.updateTheme(),window.addEventListener("editor-theme-changed",this.editorThemeHandler),this.breakpointsUpdatedHandler=d=>{d.file===this.fileName&&this.syncBreakpointsFromStore()},window.appInstance.emitter.on("debugger:breakpoints-updated",this.breakpointsUpdatedHandler)}getLanguageMode(){return this.fileName&&typeof this.fileName=="string"&&this.fileName.toLowerCase().endsWith(".json")?json():python()}getEditorTheme(){const i=document.documentElement.getAttribute("data-theme")==="dark";switch(localStorage.getItem("editorTheme")||"auto"){case"cobalt":return i?"cobalt":"solarized-light";case"xcode":return i?"xcode-dark":"xcode-light";case"coolglow":return i?"coolglow":"clouds";case"auto":default:return i?"cobalt":"solarized-light"}}updateTheme(){if(!this.view||!themes)return;const i=this.getEditorTheme();i!==this.currentTheme&&(this.currentTheme=i,this.view.dispatch({effects:this.themeCompartment.reconfigure(themes[i]||themes.cobalt)}))}update(i){if(this.view&&window.appState?.debugger){const o=window.appState.debugger.active||window.appState.debugger.configOpen;this.view.state.facet(EditorState.readOnly)!==o&&(this.view.dispatch({effects:this.readOnlyCompartment.reconfigure(EditorState.readOnly.of(o))}),this.view.dom.style.opacity=o?"0.7":"1.0")}return!1}unload(){this.themeObserver&&(this.themeObserver.disconnect(),this.themeObserver=null),this.editorThemeHandler&&(window.removeEventListener("editor-theme-changed",this.editorThemeHandler),this.editorThemeHandler=null),this.breakpointsUpdatedHandler&&(window.appInstance.emitter.removeListener("debugger:breakpoints-updated",this.breakpointsUpdatedHandler),this.breakpointsUpdatedHandler=null),this.view&&(this.scrollTop=this.view.scrollDOM.scrollTop,this.view.destroy(),this.view=null)}updateScrollPosition(i){this.scrollTop=i.target.scrollTop}onChange(){return!1}_tryFormatJson(i){if(typeof i!="string")return null;const o=i.trim();if(!o)return null;const r=o[0];if(r!=="{"&&r!=="[")return null;try{const s=JSON.parse(o);return JSON.stringify(s,null,2)+`
`}catch{return null}}toggleBreakpoint(i){if(!this.view)return;const o=this.view.state.doc.line(i+1),r=o.text,s=/# ●/.test(r);let a;s?a=r.replace(/\s*# ●.*/,""):a=r.trimEnd()+" # ●",this.view.dispatch({changes:{from:o.from,to:o.to,insert:a}})}syncBreakpointsFromStore(){if(!this.view||!this.fileName)return;const i=window.appState?.debugger?.breakpoints?.[this.fileName]||{},o=this.view.state.doc,r=[];for(let s=1;s<=o.lines;s++){const a=o.line(s),c=a.text,l=i[s],d=/# ●/.test(c);if(l&&!d)r.push({from:a.to,to:a.to,insert:" # ●"});else if(!l&&d){const u=c.match(/\s*# ●.*/);if(u){const p=a.from+c.indexOf(u[0]);r.push({from:p,to:a.to,insert:""})}}}r.length>0&&this.view.dispatch({changes:r})}}const editor=Object.freeze(Object.defineProperty({__proto__:null,CodeMirrorEditor},Symbol.toStringTag,{value:"Module"}));function Tab(n){const{text:i="undefined",icon:o="device-desktop",onSelectTab:r=()=>!1,onCloseTab:s=()=>!1,onStartRenaming:a=()=>!1,onFinishRenaming:c=()=>!1,active:l=!1,renaming:d=!1,hasChanges:u=!1}=n;if(l)if(d){let f=function(m){c(m.target.value)},h=function(m){m.key.toLowerCase()==="enter"&&m.target.blur(),m.key.toLowerCase()==="escape"&&(m.target.value=null,m.target.blur())};return html`
        <div class="tab active" tabindex="0">
          ${IconSprite.renderIcon(o,{className:"icon"})}
          <div class="text">
            <input type="text"
              value=${i}
              onblur=${f}
              onkeydown=${h}
              />
          </div>
        </div>
      `}else{let f=function(h){h.stopPropagation(),s(h)};return html`
        <div class="tab active" tabindex="0">
          ${IconSprite.renderIcon(o,{className:"icon"})}
          <div class="text" onclick=${a}>
            ${u?" *":""} ${i}
          </div>
          <div class="options" >
            <button onclick=${f}>
              ${IconSprite.renderIcon("x",{className:"icon"})}
            </button>
          </div>
        </div>
      `}function p(f){f.target.classList.contains("close-tab")||r(f)}function g(f){f.stopPropagation(),s(f)}return html`
    <div
      class="tab"
      tabindex="1"
      onclick=${p}
      >
      ${IconSprite.renderIcon(o,{className:"icon"})}
      <div class="text">
        ${u?"*":""} ${i}
      </div>
      <div class="options close-tab">
        <button class="close-tab" onclick=${g}>
          ${IconSprite.renderIcon("x",{className:"close-tab icon"})}
        </button>
      </div>
    </div>
  `}const TERMINAL_PROMPT="\x1B[38;2;221;221;221m>>> \x1B[0m";function bindTerminalOutput(n){const i=n.cache(XTerm,"terminal");if(!i||!i.term){console.debug("[TerminalHelpers] Terminal not ready yet, will bind on view switch");return}const o=i.term;BridgeDevice.onData((s,a=!1)=>{if(s){const c=s.replace(/\n/g,`\r
`);a?o.write("\x1B[91m"+c+"\x1B[0m\x1B[38;2;51;255;51m"):o.write(c),o.scrollToBottom()}})}function redrawLine(n,i,o,r){const s=r.isCommandRunning&&r.isCommandRunning(),a=s?"":TERMINAL_PROMPT,c=s?0:4;n.write("\r\x1B[K"+a+i);const l=c+o,d=c+i.length;l<d&&n.write("\x1B["+(d-l)+"D")}function setupTerminalInputHandler(n,i,o){n.onData(async r=>{if(r==="\x1B[A"){i.commandHistory.length>0&&(i.historyIndex===-1?(i.savedLine=i.currentLine,i.historyIndex=i.commandHistory.length-1):i.historyIndex>0&&i.historyIndex--,i.currentLine=i.commandHistory[i.historyIndex],i.cursorPos=i.currentLine.length,redrawLine(n,i.currentLine,i.cursorPos,o)),n.scrollToBottom();return}if(r==="\x1B[B"){i.historyIndex!==-1&&(i.historyIndex++,i.historyIndex>=i.commandHistory.length?(i.currentLine=i.savedLine||"",i.historyIndex=-1):i.currentLine=i.commandHistory[i.historyIndex],i.cursorPos=i.currentLine.length,redrawLine(n,i.currentLine,i.cursorPos,o)),n.scrollToBottom();return}if(r==="\x1B[D"){i.cursorPos>0&&(i.cursorPos--,n.write("\x1B[D"));return}if(r==="\x1B[C"){i.cursorPos<i.currentLine.length&&(i.cursorPos++,n.write("\x1B[C"));return}if(r==="\r"||r===`
`){if(n.write(`\r
`),i.currentLine.trim().length>0){(i.commandHistory.length===0||i.commandHistory[i.commandHistory.length-1]!==i.currentLine)&&(i.commandHistory.push(i.currentLine),i.commandHistory.length>100&&i.commandHistory.shift()),i.historyIndex=-1,i.savedLine="";try{if(o.isCommandRunning&&o.isCommandRunning()){console.log("[Terminal] Sending input to running command:",i.currentLine),await o.sendInput(i.currentLine),i.currentLine="",i.cursorPos=0;return}else{const s=i.currentLine;i.currentLine="",i.cursorPos=0;const a=performance.now();console.log("[Terminal] Calling device.run at",a.toFixed(0)),await o.run(s),console.log("[Terminal] device.run returned after",(performance.now()-a).toFixed(0),"ms")}}catch(s){n.write("Error: "+s.message+`\r
`)}}n.write(TERMINAL_PROMPT)}else if(r==="	"){if(i.isConnected&&o&&typeof o.requestCompletion=="function")try{const s=await o.requestCompletion(i.currentLine);if(!s||s.length===0){n.write("\x07");return}const a=u=>u&&u.length>=2&&/^[A-Z][A-Z0-9_]*$/.test(u),c=s.filter(u=>!a(u));if(c.length===0){n.write("\x07");return}let l="",d=[];if(c.length===1)l=c[0];else{const u=i.currentLine;let p=c[0];for(let g=1;g<c.length;g++){let f=0;for(;f<p.length&&f<c[g].length&&p[f]===c[g][f];)f++;p=p.slice(0,f)}p.length>u.length&&(l=p.slice(u.length)),d=c}if(l&&(i.currentLine=i.currentLine.slice(0,i.cursorPos)+l+i.currentLine.slice(i.cursorPos),i.cursorPos+=l.length,redrawLine(n,i.currentLine,i.cursorPos,o)),d.length>0){n.write(`\r
`);const u=80;let p="";for(const g of d){const f=p.length+g.length+(p?4:0);p&&f>u?(n.write(p+`\r
`),p=g):p=p?p+"    "+g:g}p&&n.write(p+`\r
`),n.write(TERMINAL_PROMPT),redrawLine(n,i.currentLine,i.cursorPos,o)}}catch(s){console.error("[Terminal] Completion error:",s),n.write("\x07")}else n.write("\x07");n.scrollToBottom()}else if(r==="")n.write(`^C\r
`),i.currentLine="",i.cursorPos=0,i.historyIndex=-1,n.write(TERMINAL_PROMPT);else if(r===""||r==="\b")i.cursorPos>0&&(o.isCommandRunning&&o.isCommandRunning()?(i.currentLine=i.currentLine.slice(0,-1),i.cursorPos--,n.write("\b \b")):(i.currentLine=i.currentLine.slice(0,i.cursorPos-1)+i.currentLine.slice(i.cursorPos),i.cursorPos--,redrawLine(n,i.currentLine,i.cursorPos,o)));else if(r.length>=1){const s=r.split("").filter(a=>{const c=a.charCodeAt(0);return c>=32&&c<127}).join("");s.length>0&&(o.isCommandRunning&&o.isCommandRunning()?(i.currentLine+=s,i.cursorPos+=s.length,n.write(s)):(i.currentLine=i.currentLine.slice(0,i.cursorPos)+s+i.currentLine.slice(i.cursorPos),i.cursorPos+=s.length,redrawLine(n,i.currentLine,i.cursorPos,o)))}n.scrollToBottom()})}async function convertToAsciiArt(n,i=null){const o=()=>`\x1B[3m${n}\x1B[0m`;return typeof figlet<"u"&&typeof figlet=="function"?generateWithFiglet(n,figlet,i).catch(()=>o()):document.querySelector('script[src*="figlet"]')?typeof figlet<"u"&&typeof figlet=="function"?generateWithFiglet(n,figlet,i).catch(()=>o()):new Promise(s=>{let a=0;const c=setInterval(()=>{a++,typeof figlet<"u"&&typeof figlet=="function"?(clearInterval(c),generateWithFiglet(n,figlet,i).then(s).catch(()=>s(o()))):a>50&&(clearInterval(c),s(o()))},100)}):new Promise(s=>{const a=document.createElement("script");a.src="https://cdn.jsdelivr.net/npm/figlet@1.7.0/lib/figlet.js",a.onload=()=>{setTimeout(()=>{typeof figlet<"u"&&typeof figlet=="function"?generateWithFiglet(n,figlet,i).then(s).catch(()=>s(o())):s(o())},100)},a.onerror=()=>{s(o())},document.head.appendChild(a)})}function generateWithFiglet(n,i,o=null){return new Promise(r=>{i.defaults&&i.defaults({fontPath:"https://cdn.jsdelivr.net/npm/figlet@1.7.0/fonts"});const s=["Slant","Standard","Block","Small","Big"],a=o?[o,...s.filter(d=>d!==o)]:s;let c=0;const l=()=>{if(c>=a.length){r(`\x1B[3m${n}\x1B[0m`);return}const d=a[c++];i(n,d,(u,p)=>{u||!p||p.length<=n.length*3?l():r(p)})};l()})}let TerminalClass=null,FitAddonClass=null,xtermLoaded=!1;async function loadXterm(){if(xtermLoaded)return{Terminal:TerminalClass,FitAddon:FitAddonClass};try{const[n,i]=await Promise.all([__vitePreload(()=>import("./xterm-CASmyfyk.js"),[]),__vitePreload(()=>import("./addon-fit-DOCEibfw.js"),[]),__vitePreload(()=>Promise.resolve({}),__vite__mapDeps([11]))]);return TerminalClass=n.Terminal,FitAddonClass=i.FitAddon,xtermLoaded=!0,console.debug("[XTerm] Lazy loaded xterm modules"),{Terminal:TerminalClass,FitAddon:FitAddonClass}}catch(n){throw console.error("[XTerm] Failed to load xterm:",n),n}}loadXterm();class XTerm extends Component$1{constructor(i,o,r){super(i),this.term=null,this.fitAddon=null,this.resizeObserver=null,this.inputBound=!1,this._emit=r}load(i){if(this.term){console.debug("[XTerm] Reusing existing terminal instance (no re-open needed)");const o=this.term.element?.parentElement;o&&i.appendChild(o),this.resizeObserver&&this.resizeObserver.disconnect(),this.resizeObserver=new ResizeObserver(()=>{setTimeout(()=>this.fitTerminal(),50)}),this.resizeObserver.observe(i),setTimeout(()=>this.fitTerminal(),50),setTimeout(()=>this.fitTerminal(),150);return}loadXterm().then(()=>this.ensureFontsLoaded()).then(()=>this.createAndOpenTerminal(i)).catch(o=>{console.error("[XTerm] Failed to initialize terminal:",o),i.innerHTML='<div style="color:red;padding:10px;">Terminal failed to load. Check console for errors.</div>'})}async ensureFontsLoaded(){if(document.fonts&&document.fonts.ready)try{return await document.fonts.ready,document.fonts.check&&await new Promise(i=>setTimeout(i,50)),Promise.resolve()}catch{return new Promise(o=>setTimeout(o,200))}else return new Promise(i=>setTimeout(i,200))}createAndOpenTerminal(i){this.term=new TerminalClass({fontFamily:"CodeFont, Cascadia Code, Menlo, Monaco, Consolas, monospace",fontSize:14,letterSpacing:0,cursorBlink:!0,cursorStyle:"block",scrollback:1e3,theme:{foreground:"#33ff33",background:"#000000",cursor:"#FFFFFF",cursorAccent:"#000000"}}),this.term.open(i),this.fitAddon=new FitAddonClass,this.term.loadAddon(this.fitAddon),setTimeout(()=>this.fitTerminal(),50),setTimeout(()=>this.fitTerminal(),150),setTimeout(()=>this.fitTerminal(),300),setTimeout(()=>this.fitTerminal(),600);let o=null;const r=()=>{o&&clearTimeout(o),o=setTimeout(()=>this.fitTerminal(),100)};this.resizeObserver=new ResizeObserver(r),this.resizeObserver.observe(i);const s=i.closest(".repl-panel-main");s&&this.resizeObserver.observe(s)}createElement(){return html$1`<div class="terminal-wrapper"></div>`}update(){return this.fitAddon&&setTimeout(()=>this.fitTerminal(),50),!1}unload(){this.resizeObserver&&(this.resizeObserver.disconnect(),this.resizeObserver=null)}fitTerminal(){if(!(!this.term||!this.fitAddon))try{this.fitAddon.fit(),this.term.refresh&&this.term.refresh(0,this.term.rows-1)}catch(i){console.warn("[XTerm] Fit failed:",i)}}resizeTerm(){this.fitTerminal()}bindInput(i,o){return this.inputBound||!this.term?!1:(console.debug("[XTerm] Binding input handler"),this.inputBound=!0,this.term.textarea&&this.term.textarea.addEventListener("focus",()=>{this._emit&&this._emit("terminal-focus")}),setupTerminalInputHandler(this.term,i,o),!0)}isInputBound(){return this.inputBound}}function CodeEditor(n,i){if(n.editingFile){const o=n.openFiles.find(r=>r.id==n.editingFile);return o?o.editor.render():(console.error("[CodeEditor] File not found for id:",n.editingFile),html$1`<div id="code-editor">File not found</div>`)}else return html$1`
      <div id="code-editor"></div>
    `}function ConnectionDialog(n,i){const o=n.isConnectionDialogOpen?"open":"closed",r=localStorage.getItem("webrepl-url")||"",s=localStorage.getItem("webrepl-password")||"";let a=!1;function c(g){a=g.target.closest(".dialog-content")!==null}function l(g){g.target.id=="dialog-connection"&&!a&&i("close-connection-dialog"),a=!1}function d(g){if(g.preventDefault(),g.stopPropagation(),n.isConnecting)return;const f=document.getElementById("webrepl-url").value,h=document.getElementById("webrepl-password").value;i("connect-webrepl",{wsUrl:f,password:h})}function u(g){g.stopPropagation(),g.key==="Enter"&&!n.isConnecting&&d(g)}n.isConnectionDialogOpen&&!window._connectionDialogEnterHandler?(window._connectionDialogEmit=i,window._connectionDialogEnterHandler=g=>{const f=document.getElementById("dialog-connection");if(!f||!f.classList.contains("open"))return;const h=f.querySelector(".connect-button");if(!(h&&h.disabled)&&g.key==="Enter"){const m=g.target;if(m.tagName!=="INPUT"&&m.tagName!=="TEXTAREA"){g.preventDefault(),g.stopPropagation();const v=document.getElementById("webrepl-url")?.value,y=document.getElementById("webrepl-password")?.value;v&&y&&window._connectionDialogEmit&&window._connectionDialogEmit("connect-webrepl",{wsUrl:v,password:y})}}},document.addEventListener("keydown",window._connectionDialogEnterHandler)):!n.isConnectionDialogOpen&&window._connectionDialogEnterHandler&&(document.removeEventListener("keydown",window._connectionDialogEnterHandler),window._connectionDialogEnterHandler=null,window._connectionDialogEmit=null);const p=html`
  <div id="dialog-connection" class="dialog ${o}" tabindex="-1" onmousedown=${c} onclick=${l} onkeydown=${g=>{g.key==="Enter"&&!n.isConnecting&&(g.preventDefault(),g.stopPropagation(),d(g))}} oncreate=${()=>{const g=document.getElementById("webrepl-url"),f=document.getElementById("webrepl-password");g&&r&&(g.value=r),f&&s&&(f.value=s)}}>
    
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
            value=${r}
            onclick=${g=>g.stopPropagation()}
            onkeydown=${u}
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
            value=${s}
            onclick=${g=>g.stopPropagation()}
            onkeydown=${u}
          />
        </div>
        
        <div class="dialog-footer">
          <button class="connect-button" onclick=${d} disabled=${n.isConnecting}>
            ${n.isConnecting?"Connecting...":"Connect"}
          </button>
          <div class="dialog-feedback ${n.isConnecting?"connecting":""}">
            ${n.isConnecting?html`<svg class="spinner" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg> Connecting...`:"Press Enter or click Connect to begin"}
          </div>
        </div>
      </div>
    </div>
    
  </div>
  `;if(n.isConnectionDialogOpen)return p}function getListDirScript(n="/"){return`
import os, json
S_IFDIR = 0x4000
S_IFREG = 0x8000
def S_ISDIR(m): return (m & 0xF000) == S_IFDIR
def S_ISREG(m): return (m & 0xF000) == S_IFREG
def _join(p1, p2):
    if p1 == "/" and not p2.startswith("/"): return "/" + p2
    elif p1 == "/": return p2
    return p1 + "/" + p2

dir_path = ${JSON.stringify(n)}
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

print(json.dumps({'path': dir_path, 'entries': entries_dict}))`.trim()}function getDeleteFolderScript(n){return`
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

_recursive_delete(${JSON.stringify(n)})
`.trim()}async function getSystemInfo(n){const i=await n.exec("getSysInfo()");return typeof i=="string"?JSON.parse(i):i}async function getNetworksInfo(n){const i=await n.exec("getNetworksInfo()");return typeof i=="string"?JSON.parse(i):i}async function ilistFiles(n,i="/"){const r=(await n.exec(getListDirScript(i))).entries||{};return Object.entries(r).map(([s,a])=>({fileName:s,size:a,type:a===null?"folder":"file"}))}async function statFile(n,i){const o=`import os, json; print(json.dumps(os.stat('${i}')))`,r=await n.exec(o);return typeof r=="string"?JSON.parse(r):r}async function deleteFile(n,i){const o=`import os; os.remove('${i}')`;await n.exec(o)}async function renameFile(n,i,o){const r=`import os; os.rename('${i}', '${o}')`;await n.exec(r)}async function createFolder(n,i){const o=`import os; os.mkdir('${i}')`;await n.exec(o)}async function fileExists(n,i){try{return await statFile(n,i),!0}catch{return!1}}async function deleteFolder(n,i){await n.exec(getDeleteFolderScript(i))}function getFullPath$1(n,i,o){let r=n||"";return i&&i!=="/"&&(r+=i),o&&(r+="/"+o),r.replace(/\/+/g,"/")}function getNavigationPath(n,i){if(i===".."){const o=n.split("/").filter(r=>r);return o.pop(),"/"+o.join("/")}return n==="/"?"/"+i:n+"/"+i}const getDisk=()=>BridgeDisk,getDevice=()=>BridgeDevice,getFullPath=getFullPath$1;async function getDiskFiles(n){let o=await getDisk().ilistFiles(n);return o=o.map(r=>({fileName:r.path,type:r.type,size:r.size})),o=o.sort(sortFilesAlphabetically),o}async function getBoardFiles(n){let i=await ilistFiles(BridgeDevice,n);return i=i.sort(sortFilesAlphabetically),i}function sortFilesAlphabetically(n,i){return n.fileName.localeCompare(i.fileName)}async function checkDiskFile({root:n,parentFolder:i,fileName:o}){if(n==null||i==null||o==null)return!1;const r=getDisk(),s=r.getFullPath(n,i,o),a=await r.fileExists(s),c=await r.folderExists(s);return a||c}async function checkBoardFile({root:n,parentFolder:i,fileName:o}){return n==null||i==null||o==null?!1:fileExists(BridgeDevice,getFullPath(n,i,o))}async function checkOverwrite({fileNames:n=[],parentPath:i,source:o}){let r=[];return o==="board"?r=await getBoardFiles(i):r=await getDiskFiles(i),r.filter(s=>n.indexOf(s.fileName)!==-1)}function generateFileName(n){{const i=`New${window.appState.fileCounter}.py`;return window.appState.fileCounter++,i}}function generateHash(){return`${Date.now()}_${parseInt(Math.random()*1024)}`}async function uploadFolder(n,i,o){o=o||function(){};const r=getDevice(),s=getDisk();await r.createFolder(i);let a=await s.ilistAllFiles(n);for(let c in a){const l=a[c],d=l.path.substring(n.length);if(l.type==="folder")await r.createFolder(getFullPath(i,d,""));else{const u=s.getFullPath(n,d,""),p=getFullPath(i,d,""),g=await BridgeDisk.loadFile(u),f=new Uint8Array(g);await r.saveFile(p,f,{progressCallback:h=>{o(h,d)}})}o(100,d)}}async function downloadFolder(n,i,o){o=o||function(){},await getDisk().createFolder(i);try{const s=[];async function a(c){const l=await ilistFiles(BridgeDevice,c);for(const d of l){const u=c==="/"?`/${d.fileName}`:`${c}/${d.fileName}`;d.type==="folder"?(s.push({path:u,type:"folder"}),await a(u)):s.push({path:u,type:"file"})}}await a(n);for(let c in s){const l=s[c],d=l.path.substring(n.length),u=getDisk(),p=getDevice();if(l.type=="folder")await u.createFolder(u.getFullPath(i,d,""));else{const g=getFullPath(n,d,""),f=getFullPath(i,d,""),h=await p.loadFile(g,{progressCallback:m=>{o(m,d)}});await BridgeDisk.saveFileContent(f,h.buffer)}o(100,d)}}catch(s){throw console.error(`[Store] Error downloading folder ${n}:`,s),new Error(`Failed to download folder: ${s.message}`)}}async function removeBoardFolder(n){try{await deleteFolder(BridgeDevice,n)}catch(i){throw console.error(`[Store] Error removing folder ${n}:`,i),new Error(`Failed to remove folder: ${i.message}`)}}function canSave({isConnected:n,openFiles:i,editingFile:o}){const r=i.find(s=>s.id===o);return!r||!r.hasChanges?!1:r.source==="disk"?!0:n}function canExecute({isConnected:n}){return n}function canDownload({isConnected:n,selectedFiles:i}){const o=i.filter(r=>r.source==="disk");return n&&i.length>0&&o.length===0}function canUpload({isConnected:n,selectedFiles:i}){const o=i.filter(r=>r.source==="board");return n&&i.length>0&&o.length===0}function canEdit({selectedFiles:n}){return n.filter(o=>o.type=="file").length!=0}function NewFileDialog(n,i){const o=n.isNewFileDialogOpen?"open":"closed";function r(f){f.target.id=="dialog-new-file"&&i("close-new-file-dialog")}function s(f){return()=>{const h=document.querySelector("#file-name"),m=h.value.trim()||h.placeholder;i("create-new-tab",f,m)}}let a="";n.isConnected&&(a=html`
      <button class="button item" onclick=${s("board")}>Board</button>
    `),new MutationObserver((f,h)=>{const m=document.querySelector("#dialog-new-file input");m&&(m.focus(),h.disconnect())}).observe(document.body,{childList:!0,subtree:!0});let l="",d="";d=generateFileName();const u={type:"text",id:"file-name",value:l,placeholder:d},p=generateFileName();n.newFileName===null&&`${p}`;const g=html`
  <div id="dialog-new-file" class="dialog ${o}" onclick=${r}>
    <div class="dialog-content">
      <h2 class="dialog-title">Create new file</h2>
      <input class="dialog-input" ${u} />
      <div class="buttons-horizontal">
        ${a}
        <button class="button item" onclick=${s("disk")}>Computer</button>
      </div>
    </div>
  </div>
`;if(n.isNewFileDialogOpen){const f=g.querySelector("#dialog-new-file .dialog-content > input");return f&&f.focus(),g}}function ScriptOsModal(n,i){return n.isScriptOsModalOpen?html`
    <div class="scriptos-modal-overlay" onclick=${o=>{o.target.classList.contains("scriptos-modal-overlay")&&i("close-scriptos-modal")}}>
      <div class="scriptos-modal">
        <button 
          class="scriptos-modal-close" 
          onclick=${()=>i("close-scriptos-modal")}
          title="Close">
          ×
        </button>
        ${n.scriptOsModalView==="library"?ScriptOsLibraryView(n,i):ScriptOsConfigView(n,i)}
      </div>
    </div>
  `:html`<div></div>`}function ScriptOsLibraryView(n,i){if(n.scriptOsCategoryCollapse||(n.scriptOsCategoryCollapse={}),n.isLoadingRegistry)return html`
      <div class="scriptos-library">
        <div class="scriptos-empty">
          <div class="scriptos-loading-spinner"></div>
          <h3>Loading ScriptO Registry...</h3>
          <p>Fetching ScriptOs from the cloud registry</p>
        </div>
      </div>
    `;const o=f=>f.registryEntry?{name:f.registryEntry.name||f.filename,description:f.registryEntry.description||"",tags:f.registryEntry.tags||[],author:f.registryEntry.author||"",version:f.registryEntry.version||[1,0,0]}:f.config&&f.config.info?{name:f.config.info.name||f.filename,description:f.config.info.description||"",tags:f.config.info.category?[f.config.info.category]:[],author:f.config.info.author||"",version:f.config.info.version||[1,0,0]}:{name:f.filename,description:"",tags:[],author:"",version:[1,0,0]},r=new Set;n.scriptOsList.forEach(f=>{o(f).tags.forEach(m=>r.add(m))});const s=Array.from(r).sort(),a=(n.scriptOsSearchQuery||"").toLowerCase(),c=n.scriptOsFilterTags||[],l=n.scriptOsList.filter(f=>{const h=o(f),m=h.name.toLowerCase(),v=h.description.toLowerCase(),y=h.tags.join(" ").toLowerCase(),b=!a||m.includes(a)||v.includes(a)||y.includes(a),S=c.length===0||c.every(C=>h.tags.includes(C));return b&&S}),d={},u=[];l.forEach(f=>{const h=o(f),m=h.tags.length>0?h.tags[0]:null;m?(d[m]||(d[m]=[]),d[m].push(f)):u.push(f)});const p=Object.keys(d).sort(),g=f=>{n.scriptOsCategoryCollapse[f]=!n.scriptOsCategoryCollapse[f],i("render")};return html`
    <div class="scriptos-library">
      <div class="scriptos-header-sticky">
        <div class="scriptos-header">
          <h2>ScriptO Registry</h2>
          <p class="scriptos-subtitle">
            ${n.scriptOsList.length} ScriptO${n.scriptOsList.length!==1?"s":""} available from cloud registry
          </p>
        </div>
        
        ${n.scriptOsList.length>0?html`
          <div class="scriptos-search">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="scriptos-search-icon">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input 
            type="text" 
            class="scriptos-search-input"
            placeholder="Search ScriptOs by name, description, or tags..."
            value="${n.scriptOsSearchQuery||""}"
            oninput=${f=>i("scriptos-search",f.target.value)}
          />
          ${a?html`
            <button 
              class="scriptos-search-clear"
              onclick=${()=>i("scriptos-search","")}
              title="Clear search">
              ×
            </button>
          `:""}
          </div>
          
          ${s.length>0?html`
            <div class="scriptos-tag-filters">
              <div class="scriptos-tag-filters-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                </svg>
                Filter by tags:
              </div>
              <div class="scriptos-tag-filters-list">
                ${s.map(f=>{const h=c.includes(f);return html`
                    <button 
                      class="scriptos-tag-filter ${h?"active":""}"
                      onclick=${()=>i("scriptos-toggle-tag",f)}
                      title="${h?"Remove filter":"Filter by "+f}">
                      ${f}
                      ${h?html`<span class="scriptos-tag-check">✓</span>`:""}
                    </button>
                  `})}
              </div>
              ${c.length>0?html`
                <button 
                  class="scriptos-clear-filters"
                  onclick=${()=>i("scriptos-clear-tags")}
                  title="Clear all filters">
                  Clear filters (${c.length})
                </button>
              `:""}
            </div>
          `:""}
        `:""}
      </div>
      
      <div class="scriptos-content">
        ${n.scriptOsList.length===0?html`
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
        `:l.length===0?html`
          <div class="scriptos-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <h3>No ScriptOs Found</h3>
            <p>No ScriptOs match "${a}"</p>
            <button 
              class="scriptos-btn scriptos-btn-primary"
              onclick=${()=>i("scriptos-search","")}>
              Clear Search
            </button>
          </div>
        `:html`
          <div class="scriptos-categories">
            ${p.map(f=>{const h=n.scriptOsCategoryCollapse[f]===!0;return html`
                <div class="scriptos-category ${h?"collapsed":""}">
                  <h3 class="scriptos-category-title" onclick=${()=>g(f)}>
                    <svg class="scriptos-category-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                    <span>${f}</span>
                    <span class="scriptos-category-count">${d[f].length}</span>
                  </h3>
                  <div class="scriptos-grid" style="${h?"display: none;":""}">
                    ${d[f].map(m=>ScriptOsCard(m,i))}
                  </div>
                </div>
              `})}
            ${u.length>0?html`
              <div class="scriptos-category ${n.scriptOsCategoryCollapse.Other?"collapsed":""}">
                <h3 class="scriptos-category-title" onclick=${()=>g("Other")}>
                  <svg class="scriptos-category-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                  <span>Other</span>
                  <span class="scriptos-category-count">${u.length}</span>
                </h3>
                <div class="scriptos-grid" style="${n.scriptOsCategoryCollapse.Other?"display: none;":""}">
                  ${u.map(f=>ScriptOsCard(f,i))}
                </div>
              </div>
            `:""}
          </div>
        `}
      </div>
    </div>
  `}function ScriptOsCard(n,i){let o,r,s;return n.registryEntry?(o=n.registryEntry,s=o.tags||[]):n.config&&n.config.info?(o=n.config.info,s=o.category?[o.category]:[]):(o={},s=[]),r="v1.0.0",o.version&&(Array.isArray(o.version)?r=`v${o.version.join(".")}`:r=`v${o.version}`),html`
    <div 
      class="scriptos-card"
      onclick=${()=>i("select-scriptos",n)}>
      <div class="scriptos-card-header">
        <div class="scriptos-card-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="16 18 22 12 16 6"/>
            <polyline points="8 6 2 12 8 18"/>
          </svg>
        </div>
        <h3>${o.name||n.filename}</h3>
        <span class="scriptos-card-version">${r}</span>
      </div>
      
      <p class="scriptos-card-description">
        ${o.description||"No description available"}
      </p>
      
      ${s.length>0?html`
        <div class="scriptos-card-tags">
          ${s.slice(0,3).map(a=>html`<span class="scriptos-tag-badge">${a}</span>`)}
          ${s.length>3?html`<span class="scriptos-tag-badge">+${s.length-3}</span>`:""}
        </div>
      `:""}
      
      <div class="scriptos-card-footer">
        ${o.author?html`
          <span class="scriptos-card-author">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            ${o.author}
          </span>
        `:""}
      </div>
    </div>
  `}function ScriptOsConfigView(n,i){const o=n.selectedScriptOs;if(!o)return html`<div>Loading...</div>`;const r=o.config.info||{},s=o.config.args,a=s&&typeof s=="object"&&Object.keys(s).length>0;let c="v1.0.0";return r.version&&(Array.isArray(r.version)?c=`v${r.version.join(".")}`:c=`v${r.version}`),html`
    <div class="scriptos-config">
      <div class="scriptos-config-header">
        <div class="scriptos-config-title">
          <h2>${r.name||o.filename}</h2>
          <span class="scriptos-config-version">
            ${c}
          </span>
        </div>
        <p class="scriptos-config-description">${r.description||"No description"}</p>
        ${r.author?html`
          <div class="scriptos-config-meta">
            <span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              ${r.author}
            </span>
            ${r.www?html`
              <a href="${r.www}" target="_blank" rel="noopener">
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
        ${a?html`
          <h3>Configuration</h3>
          ${renderConfigFields(s,n,i)}
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
          onclick=${()=>i("scriptos-back")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          Back
        </button>
        <button 
          class="scriptos-btn scriptos-btn-primary" 
          onclick=${()=>i("scriptos-execute")}>
          Generate Code
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="5 12 5 5 12 5"/>
            <polyline points="19 12 19 19 12 19"/>
            <line x1="5" y1="5" x2="19" y2="19"/>
          </svg>
        </button>
      </div>
    </div>
  `}function renderConfigFields(n,i,o){const r=Object.keys(n);return html`
    <div class="scriptos-config-fields">
      ${r.map(s=>{const a=n[s],c=a.label||s;a.type;const l=a.optional||!1;return html`
          <div class="scriptos-config-field">
            <label for="arg-${s}">
              ${c}
              ${l?html`<span class="scriptos-field-optional">(optional)</span>`:""}
            </label>
            ${renderInputField(s,a,i,o)}
          </div>
        `})}
    </div>
  `}function renderInputField(n,i,o,r){const s=i.type,a=o.scriptOsArgs[n],c=i.value!==void 0?i.value:null;switch(s){case"str":return html`
        <input 
          type="text" 
          id="arg-${n}"
          class="scriptos-input"
          value="${a!==void 0?a:c||""}"
          oninput=${p=>r("scriptos-update-arg",{argId:n,value:p.target.value})}
          placeholder="Enter text..."
        />
      `;case"int":return html`
        <input 
          type="number" 
          id="arg-${n}"
          class="scriptos-input"
          step="1"
          value="${a!==void 0?a:c||0}"
          oninput=${p=>r("scriptos-update-arg",{argId:n,value:parseInt(p.target.value)||0})}
          placeholder="Enter integer..."
        />
      `;case"float":return html`
        <input 
          type="number" 
          id="arg-${n}"
          class="scriptos-input"
          step="0.1"
          value="${a!==void 0?a:c||0}"
          oninput=${p=>r("scriptos-update-arg",{argId:n,value:parseFloat(p.target.value)||0})}
          placeholder="Enter number..."
        />
      `;case"bool":return html`
        <label class="scriptos-checkbox">
          <input 
            type="checkbox" 
            id="arg-${n}"
            checked=${a!==void 0?a:c||!1}
            onchange=${p=>r("scriptos-update-arg",{argId:n,value:p.target.checked})}
          />
          <span class="scriptos-checkbox-label">Enabled</span>
        </label>
      `;case"list":const l=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,21,26,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48];return html`
        <select 
          id="arg-${n}"
          class="scriptos-select"
          onchange=${p=>r("scriptos-update-arg",{argId:n,value:p.target.value==="none"?null:parseInt(p.target.value)})}>
          ${i.optional?html`<option value="none">No pin</option>`:""}
          ${l.map(p=>html`
            <option 
              value="${p}" 
              selected=${a==p||a===void 0&&c==p}>
              GPIO ${p}
            </option>
          `)}
        </select>
      `;case"dict":const d=i.items||{},u=Object.keys(d);return html`
        <select 
          id="arg-${n}"
          class="scriptos-select"
          onchange=${p=>r("scriptos-update-arg",{argId:n,value:p.target.value})}>
          ${u.map(p=>html`
            <option 
              value="${p}" 
              selected=${a===p||a===void 0&&c===p}>
              ${d[p]}
            </option>
          `)}
        </select>
      `;default:return html`
        <input 
          type="text" 
          id="arg-${n}"
          class="scriptos-input"
          value="${a!==void 0?a:c||""}"
          oninput=${p=>r("scriptos-update-arg",{argId:n,value:p.target.value})}
          placeholder="Enter value..."
        />
      `}}function ScriptOsUiModal(n,i){if(!n.scriptOsUiModal||!n.scriptOsUiModal.isOpen)return html`<div></div>`;const{url:o,title:r}=n.scriptOsUiModal;return html`
    <div 
      class="scriptos-ui-modal-overlay" 
      onclick=${s=>{s.target.classList.contains("scriptos-ui-modal-overlay")&&i("close-scriptos-ui-modal")}}>
      <div class="scriptos-ui-modal-container">
        <div class="scriptos-ui-modal-header">
          <h2 class="scriptos-ui-modal-title">${r||"ScriptO UI"}</h2>
          <button 
            class="scriptos-ui-modal-close" 
            onclick=${()=>i("close-scriptos-ui-modal")}
            title="Close (Esc)">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        
        <div class="scriptos-ui-modal-content">
          ${n.scriptOsUiModal.isLoading?html`
            <div class="scriptos-ui-modal-loading">
              <div class="scriptos-ui-modal-spinner"></div>
              <p>Loading UI from device...</p>
            </div>
          `:""}
          
          <iframe
            src="${o}"
            class="scriptos-ui-modal-iframe"
            style="${n.scriptOsUiModal.isLoading?"display: none;":""}"
            sandbox="allow-scripts allow-same-origin allow-forms"
            onload=${()=>{n.scriptOsUiModal&&n.scriptOsUiModal.isLoading&&(n.scriptOsUiModal.loadTimeout&&(clearTimeout(n.scriptOsUiModal.loadTimeout),n.scriptOsUiModal.loadTimeout=null),n.scriptOsUiModal.isLoading=!1,n.scriptOsUiModal.error=null,i("render"))}}
            onerror=${s=>{console.error("[ScriptO UI] Failed to load iframe:",s),n.scriptOsUiModal&&(n.scriptOsUiModal.loadTimeout&&(clearTimeout(n.scriptOsUiModal.loadTimeout),n.scriptOsUiModal.loadTimeout=null),n.scriptOsUiModal.isLoading=!1,n.scriptOsUiModal.error="Failed to load UI from device. Check the browser console for details.",i("render"))}}
          ></iframe>
          
          ${n.scriptOsUiModal.error?html`
            <div class="scriptos-ui-modal-error">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p>${n.scriptOsUiModal.error}</p>
              <button 
                class="scriptos-ui-modal-retry"
                onclick=${()=>{n.scriptOsUiModal.error=null,n.scriptOsUiModal.isLoading=!0,i("render")}}>
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
            ${o}
          </div>
        </div>
      </div>
    </div>
  `}function ExtensionsModal(n,i){return!n.isExtensionsModalOpen&&!n.installingDependencies&&!n.dependencyPrompt?html`<div></div>`:n.dependencyPrompt?DependencyPromptModal(n,i):n.installingDependencies?DependencyInstallModal(n):html`
    <div class="scriptos-modal-overlay" onclick=${o=>{o.target.classList.contains("scriptos-modal-overlay")&&i("close-extensions-modal")}}>
      <div class="scriptos-modal">
        <button 
          class="scriptos-modal-close" 
          onclick=${()=>i("close-extensions-modal")}
          title="Close">
          ×
        </button>
        ${n.isLoadingExtensions?html`
          <div class="scriptos-loading">
            <div class="scriptos-loading-spinner"></div>
            <p>Loading extensions registry...</p>
          </div>
        `:ExtensionsLibraryView(n,i)}
      </div>
    </div>
  `}function DependencyPromptModal(n,i){const{extensionId:o,extensionName:r,dependencies:s}=n.dependencyPrompt,a=s?.mipPackage||"";return html`
    <div class="scriptos-modal-overlay" onclick=${c=>{c.target.classList.contains("scriptos-modal-overlay")&&i("close-dependency-prompt")}}>
      <div class="scriptos-modal" style="max-width: 500px;">
        <div class="scriptos-library">
          <div class="scriptos-header">
            <h2>Install Dependencies?</h2>
            <p class="scriptos-subtitle">${r} requires Python libraries</p>
          </div>
          
          <div style="padding: 20px;">
            <p style="color: var(--text-primary); margin-bottom: 16px;">
              This extension requires Python libraries to be installed on your device.
            </p>
            <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 6px; padding: 12px; margin-bottom: 20px;">
              <div style="font-family: 'Menlo', 'Monaco', monospace; color: var(--scheme-primary); font-size: 13px; word-break: break-all;">
                ${a}
              </div>
            </div>
            <p style="color: var(--text-secondary); font-size: 13px; margin-bottom: 20px;">
              Make sure your device is connected before installing.
            </p>
            <div style="display: flex; gap: 12px; justify-content: flex-end;">
              <button 
                class="scriptos-uninstall-btn"
                onclick=${()=>i("close-dependency-prompt")}
                style="padding: 10px 20px;">
                Skip
              </button>
              <button 
                class="scriptos-update-btn"
                onclick=${()=>i("upload-extension-dependencies",o)}
                style="padding: 10px 20px;">
                Install
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `}function DependencyInstallModal(n,i){const{extensionName:o,mipPackage:r}=n.installingDependencies;return html`
    <div class="scriptos-modal-overlay">
      <div class="scriptos-modal" style="max-width: 500px;">
        <div class="scriptos-library">
          <div class="scriptos-header">
            <h2>Installing Dependencies</h2>
            <p class="scriptos-subtitle">Installing Python libraries for ${o}...</p>
          </div>
          
          <div style="padding: 40px 20px; text-align: center;">
            <div class="scriptos-loading-spinner" style="margin: 0 auto 20px;"></div>
            <div style="font-family: 'Menlo', 'Monaco', monospace; color: var(--scheme-primary); font-size: 14px; margin-bottom: 12px;">
              ${r}
            </div>
            <p style="color: var(--text-secondary);">
              This may take a few moments. Please wait...
            </p>
          </div>
        </div>
      </div>
    </div>
  `}function ExtensionsLibraryView(n,i){const o=n.availableExtensions||[],r=n.installedExtensions||[],s=new Set(r.map(l=>l.id)),a=o.filter(l=>!s.has(l.id)),c=(l,d)=>{for(let u=0;u<3;u++){const p=l[u]||0,g=d[u]||0;if(p>g)return!0;if(p<g)return!1}return!1};return o.length===0?html`
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
            ${r.length} installed, ${a.length} available
          </p>
        </div>
      </div>
      
      <div class="scriptos-content">
        ${r.length>0?html`
          <div class="scriptos-section" style="margin-bottom: 32px">
            <h3 style="margin: 0 0 16px 0; font-size: 16px; color: var(--text-primary);">Installed</h3>
            
            <div class="scriptos-grid">
              ${r.map(l=>{const d=o.find(p=>p.id===l.id),u=d&&c(d.version,l.version);return html`
                  <div class="scriptos-card installed ${u?"has-update":""}">
                    ${u?html`
                      <div class="scriptos-update-badge">Update available</div>
                    `:""}
                    
                    <div class="scriptos-card-header">
                      <div class="scriptos-card-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          ${getExtensionIcon(l.icon)}
                        </svg>
                      </div>
                      <h3>${l.name}</h3>
                      <span class="scriptos-card-version">
                        v${l.version.join(".")}
                        ${u?html`<span class="scriptos-version-arrow">→ v${d.version.join(".")}</span>`:""}
                      </span>
                    </div>

                    <p class="scriptos-card-description">${l.description}</p>
                    
                    <div class="scriptos-card-actions" style="margin-top: auto; padding-top: 12px; border-top: 1px solid var(--border-color); display: flex; gap: 8px;">
                      ${u?html`
                        <button 
                          class="scriptos-update-btn"
                          onclick=${p=>{p.stopPropagation(),i("update-extension",{extension:l,newVersion:d})}}
                          title="Update to v${d.version.join(".")}">
                          Update
                        </button>
                      `:""}
                      <button 
                        class="scriptos-uninstall-btn"
                        onclick=${p=>{p.stopPropagation(),i("uninstall-extension",l.id)}}
                        title="Uninstall ${l.name}">
                        Uninstall
                      </button>
                    </div>
                    
                    <div class="scriptos-card-footer" style="border: none; padding-top: 8px;">
                       <span class="scriptos-card-author">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                        ${l.author}
                      </span>
                    </div>
                  </div>
                `})}
            </div>
          </div>
        `:""}
        
        ${a.length>0?html`
          <div class="scriptos-section">
            <h3 style="margin: 0 0 16px 0; font-size: 16px; color: var(--text-primary);">Available for Install</h3>
            
            <div class="scriptos-grid">
              ${a.map(l=>html`
                <div class="scriptos-card" onclick=${()=>i("install-extension",l)}>
                  <div class="scriptos-card-header">
                    <div class="scriptos-card-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        ${getExtensionIcon(l.icon)}
                      </svg>
                    </div>
                    <h3>${l.name}</h3>
                    <span class="scriptos-card-version">v${l.version.join(".")}</span>
                  </div>
                  
                  <p class="scriptos-card-description">${l.description}</p>
                  
                  <div class="scriptos-card-badge" style="margin-top: auto;">
                    <span class="scriptos-badge-install">Click to Install</span>
                  </div>

                   <div class="scriptos-card-footer">
                       <span class="scriptos-card-author">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                        ${l.author}
                      </span>
                    </div>
                </div>
              `)}
            </div>
          </div>
        `:""}
      </div>
    </div>
  `}function getExtensionIcon(n){const i={sliders:html`
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
    `};return i[n]||i.cpu}function ResetDialog(n,i){const o=n.isResetDialogOpen?"open":"closed";function r(l){l.target.id==="dialog-reset"&&i("close-reset-dialog")}function s(){i("trigger-reset",0)}async function a(){confirm(`HARD RESET WARNING:

This is equivalent to pressing the physical reset button.
The connection will be lost immediately.

Are you sure you want to proceed?`)&&i("trigger-reset",1)}n.isResetDialogOpen&&window.addEventListener("keydown",function l(d){d.key==="Escape"&&(i("close-reset-dialog"),window.removeEventListener("keydown",l))},{once:!0});const c=html`
  <div id="dialog-reset" class="dialog ${o}" tabindex="-1" onclick=${r}>
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
          
          <div class="reset-option" style="padding: 16px; background: var(--bg-secondary); border-radius: 8px; border: 1px solid var(--border-color); cursor: pointer;" onclick=${s}>
             <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                <div style="font-weight: 600; color: var(--text-primary);">Soft Reset</div>
                <div style="font-size: 11px; background: var(--scheme-primary); color: white; padding: 2px 6px; border-radius: 4px;">RECOMMENDED</div>
             </div>
             <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.4;">
               Restarts the MicroPython interpreter (VM). Global variables are cleared, but the WebREPL connection remains active.
             </div>
          </div>

          <div class="reset-option" style="padding: 16px; background: var(--bg-secondary); border-radius: 8px; border: 1px solid var(--border-color); cursor: pointer;" onclick=${a}>
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
           <button class="scriptos-btn scriptos-btn-secondary" style="min-width: 100px;" onclick=${()=>i("close-reset-dialog")}>
             Cancel
           </button>
        </div>
      </div>
    </div>
  </div>
  `;if(n.isResetDialogOpen)return c}function DebugSidebar(n,i){if(!n.debugger||!n.debugger.configOpen)return html``;const o=n.openFiles.filter(c=>c.fileName&&c.fileName.endsWith(".py")),s=(n.debugger.watchExpressions[""]||[]).join(`
`),a=n.debugger.active;return html`
    <div class="debug-sidebar">
      <div class="debug-sidebar-header">
        <h2>${a?"Debug Session":"Setup Debugger"}</h2>
        <button class="close-btn" onclick=${()=>{i(a?"debugger:stop":"debugger:close-config")}}>×</button>
      </div>

      <div class="debug-sidebar-body">
        ${o.length===0?html`
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
              oninput=${c=>i("debugger:set-watches",c.target.value)}
            >${s}</textarea>
          </section>

          ${a?html`
            <section class="debug-section">
              <h3>Live Variables</h3>
              <div class="debug-variables">
                ${Object.entries(n.debugger.variables||{}).map(([c,l])=>html`
                  <div class="debug-var">
                    <span class="var-name">${c}:</span>
                    <span class="var-value">${l}</span>
                  </div>
                `)}
                ${Object.entries(n.debugger.locals||{}).map(([c,l])=>html`
                  <div class="debug-var">
                    <span class="var-name">${c}:</span>
                    <span class="var-value">${l}</span>
                  </div>
                `)}
                ${Object.keys(n.debugger.variables||{}).length===0&&Object.keys(n.debugger.locals||{}).length===0?html`
                  <p class="empty-hint">No variables captured.</p>
                `:""}
              </div>
            </section>
          `:html`
            <section class="debug-section">
              <h3>Target File</h3>
              <p class="file-path">${n.openFiles.find(c=>c.id===n.editingFile)?.fileName||"No file selected"}</p>
              
              <div class="debug-actions">
                <button 
                  class="debug-btn-primary" 
                  onclick=${()=>i("debugger:start")}
                  disabled=${o.length===0}
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
  `}function BreakpointModal(n,i){if(!n.debugger||!n.debugger.breakpointModalOpen)return html`<div></div>`;const{file:o,line:r}=n.debugger.editingBreakpoint,s=n.debugger.breakpoints[o][r]||{condition:"",hitCount:"",enabled:!0},a=()=>{i("debugger:save-breakpoint",{file:o,line:r,config:s})},c=()=>{i("debugger:delete-breakpoint",{file:o,line:r})},l=()=>{i("debugger:close-breakpoint-modal")};return html`
    <div class="scriptos-modal-overlay" onclick=${d=>{d.target.classList.contains("scriptos-modal-overlay")&&l()}}>
      <div class="scriptos-modal breakpoint-modal">
        <div class="breakpoint-modal-header">
          <div class="breakpoint-modal-title">
            <span onclick=${l} style="cursor: pointer; font-size: 20px; line-height: 1;">×</span>
            <span>Breakpoint</span>
          </div>
          <div class="switch-container">
            <label class="switch">
              <input type="checkbox" checked=${s.enabled} onchange=${d=>{s.enabled=d.target.checked,i("render")}}>
              <span class="slider"></span>
            </label>
            <span style="font-size: 13px; color: var(--text-primary);">
              ${s.enabled?"Enabled":"Disabled"}
            </span>
            <button class="btn-delete" onclick=${c} title="Delete Breakpoint">
              ${IconSprite.renderIcon("trash",{size:20})}
            </button>
          </div>
        </div>

        <div class="breakpoint-modal-file">
          ${o} (${r})
        </div>

        <div class="breakpoint-field">
          <div class="breakpoint-field-icon" title="Condition">?</div>
          <input 
            type="text" 
            class="breakpoint-input" 
            placeholder="CONDITION EXPRESSION e.g. x == 0"
            value=${s.condition}
            oninput=${d=>{s.condition=d.target.value}}
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
            value=${s.hitCount}
            oninput=${d=>{s.hitCount=d.target.value}}
          >
        </div>

        <div class="breakpoint-actions">
          <button class="scriptos-btn scriptos-btn-secondary" onclick=${l}>Cancel</button>
          <button class="scriptos-btn scriptos-btn-primary" onclick=${a}>Save</button>
        </div>
      </div>
    </div>
  `}const REGISTRY_PATH="/lib/ext/registry.json";async function readDeviceExtensionRegistry(n){try{const i=await n.execute(`
import json
try:
    with open('${REGISTRY_PATH}') as f:
        print(json.dumps({"registry": json.load(f)}))
except:
    print(json.dumps({"registry": {}}))
`);if(typeof i=="object"&&i.registry!==void 0)return i.registry;if(typeof i=="string"){const o=JSON.parse(i.trim());return o.registry||o||{}}return{}}catch(i){return console.warn("[device-registry] Error reading registry:",i),{}}}async function updateDeviceExtensionRegistry(n,i,o){try{const r=await readDeviceExtensionRegistry(n);r[i]={version:o,installedAt:Date.now()};const a=JSON.stringify(r).replace(/\\/g,"\\\\").replace(/'/g,"\\'");await n.execute(`
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
    f.write('${a}')
print(json.dumps({"ok": True}))
`),console.log(`[device-registry] Updated ${i} to v${o}`)}catch(r){throw console.error("[device-registry] Error updating registry:",r),r}}function needsInstall(n,i){if(!i)return!0;const o=Array.isArray(n)?n.join("."):String(n),r=i.version||"";return o!==r}function hasOnInstallMethod(n){return n?/async\s+onInstall\s*\(/.test(n):!1}let lastExtensionDOM=null,lastExtensionKey=null;function shouldPreserveInput(n){const i=document.activeElement;if(i&&(i.tagName==="INPUT"||i.tagName==="TEXTAREA")){if(i.classList.contains("msg-input"))return!1;if(i.closest('.system-panel, .msg-chat, [class*="extension"]'))return!0}return!1}async function checkAndRunOnInstall(n,i,o,r,s,a){const c=o.data.config,l=Array.isArray(c.version)?c.version.join("."):String(c.version||"0.0.0");try{const u=(await readDeviceExtensionRegistry(r))[n];if(!needsInstall(l,u))return;s.loadedExtensions[n].installing=!0,a("render");try{await i.onInstall(),await updateDeviceExtensionRegistry(r,n,l)}catch(p){console.error("[ExtensionContainer] onInstall failed:",p),s.loadedExtensions[n].installError=p.message}finally{s.loadedExtensions[n].installing=!1,a("render")}}catch(d){console.warn("[ExtensionContainer] Could not check device registry:",d)}}async function instantiateExtension$1(extensionId,loadedExtension,state,emit,html){if(loadedExtension.data.styles&&!loadedExtension.stylesInjected){const n=`extension-styles-${extensionId}`;let i=document.getElementById(n);i||(i=document.createElement("style"),i.id=n,i.textContent=loadedExtension.data.styles,document.head.appendChild(i)),loadedExtension.stylesInjected=!0}const extensionCode=loadedExtension.data.content,filesMatch=extensionCode.match(/export\s+const\s+__DEVICE_FILES__\s*=\s*(\{[\s\S]*?\});/);let deviceFiles={};if(filesMatch)try{const rawFiles=eval("("+filesMatch[1]+")");for(const[n,i]of Object.entries(rawFiles))try{const o=atob(i),r=new Uint8Array(o.length);for(let s=0;s<o.length;s++)r[s]=o.charCodeAt(s);deviceFiles[n]=new TextDecoder("utf-8").decode(r)}catch{deviceFiles[n]=i}}catch(n){console.warn("[ExtensionContainer] Device files parse failed:",n)}const blob=new Blob([extensionCode],{type:"text/javascript"}),blobUrl=URL.createObjectURL(blob);let ExtensionClass;try{ExtensionClass=(await import(blobUrl)).default}finally{URL.revokeObjectURL(blobUrl)}if(!ExtensionClass)throw new Error("No default export found in extension bundle");const deviceAPI=new DeviceAPI$1(BridgeDevice),extensionInstance=new ExtensionClass(deviceAPI,emit,state,html);extensionInstance.deviceFiles=deviceFiles,loadedExtension.instance=extensionInstance,loadedExtension.instantiating=!1,emit("render"),state.isConnected&&typeof extensionInstance.onInstall=="function"&&checkAndRunOnInstall(extensionId,extensionInstance,loadedExtension,deviceAPI,state,emit)}function ExtensionContainer(n,i,o){const r=n.activeExtension,s=n.activeExtensionPanel,a=`${r}:${s}`;if(shouldPreserveInput()&&lastExtensionDOM&&lastExtensionKey===a)return console.debug("[ExtensionContainer] Preserving DOM during input focus"),lastExtensionDOM;if(!r||!s)return lastExtensionDOM=null,lastExtensionKey=null,o`
      <div class="system-panel">
        <div class="panel-message">
          <p>No extension panel selected</p>
        </div>
      </div>
    `;if(!n.loadedExtensions[r])return lastExtensionDOM=null,lastExtensionKey=null,o`
      <div class="system-panel">
        <div class="panel-message">
          <p>Loading extension...</p>
        </div>
      </div>
    `;const c=n.loadedExtensions[r];if(!c.instance&&!c.instantiating)return c.instantiating=!0,instantiateExtension$1(r,c,n,i,o).catch(u=>{console.error("[ExtensionContainer] Failed to instantiate extension:",u),c.instantiateError=u.message,c.instantiating=!1,i("render")}),lastExtensionDOM=null,lastExtensionKey=null,o`
      <div class="system-panel">
        <div class="panel-message">
          <p>Loading extension...</p>
        </div>
      </div>
    `;if(c.instantiating)return lastExtensionDOM=null,lastExtensionKey=null,o`
      <div class="system-panel">
        <div class="panel-message">
          <p>Loading extension...</p>
        </div>
      </div>
    `;if(c.instantiateError)return lastExtensionDOM=null,lastExtensionKey=null,o`
      <div class="system-panel">
        <div class="panel-message error">
          <p>Failed to load extension: ${c.instantiateError}</p>
        </div>
      </div>
    `;if(c.installing)return lastExtensionDOM=null,lastExtensionKey=null,o`
      <div class="system-panel">
        <div class="panel-message">
          <p>Installing extension files to device...</p>
        </div>
      </div>
    `;if(c.installError)return lastExtensionDOM=null,lastExtensionKey=null,o`
      <div class="system-panel">
        <div class="panel-message error">
          <p>Failed to install extension files: ${c.installError}</p>
          <button onclick=${()=>{delete c.installError,delete c.instance,i("render")}}>Retry</button>
        </div>
      </div>
    `;const l=c.instance,d=`render${s.charAt(0).toUpperCase()+s.slice(1)}`;if(typeof l[d]!="function")return lastExtensionDOM=null,lastExtensionKey=null,o`
      <div class="system-panel">
        <div class="panel-message error">
          <p>Extension panel not found: ${s}</p>
          <p>Looking for method: ${d}</p>
        </div>
      </div>
    `;try{const u=l[d]();return lastExtensionDOM=u,lastExtensionKey=a,u}catch(u){return console.error("[ExtensionContainer] Render error:",u),lastExtensionDOM=null,lastExtensionKey=null,o`
      <div class="system-panel">
        <div class="panel-message error">
          <p>Extension render error: ${u.message}</p>
        </div>
      </div>
    `}}function AgentSidebar(n,i){return n.aiAgent.isOpen?html`
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
          ${n.aiAgent.messages.length>0?html`
            <button 
              class="agent-sidebar-clear"
              onclick=${()=>i("ai-clear-chat")}
              title="Clear chat">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          `:""}
          <button 
            class="agent-sidebar-close"
            onclick=${()=>i("toggle-agent-sidebar")}
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
        ${n.aiAgent.messages.length===0?html`
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
            ${n.aiAgent.settings.apiKey?"":html`
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
        `:n.aiAgent.messages.map(o=>renderMessage(o,i))}
        
        ${n.aiAgent.isGenerating?html`
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
          oninput=${o=>{n.aiAgent.inputValue=o.target.value,i("ai-update-input",o.target.value)}}
          onkeydown=${o=>handleInputKeydown(o,n,i)}
          disabled=${n.aiAgent.isGenerating}
        >${n.aiAgent.inputValue||""}</textarea>
        <button 
          class="agent-send-btn"
          onclick=${()=>handleSendMessage(n,i)}
          disabled=${n.aiAgent.isGenerating}
          title="Send message (Ctrl+Enter)">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </div>
  `:html`<div></div>`}function renderMessage(n,i){const o=new Date(n.timestamp).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});return n.role==="user"?html`
      <div class="agent-message agent-message-user">
        <div class="agent-message-content">
          <div class="agent-message-text">${n.content}</div>
          <div class="agent-message-time">${o}</div>
        </div>
        <div class="agent-message-avatar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
      </div>
    `:n.role==="assistant"?html`
      <div class="agent-message agent-message-assistant">
        <div class="agent-message-avatar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="4" y="4" width="16" height="16" rx="2" ry="2"/>
            <rect x="9" y="9" width="6" height="6"/>
          </svg>
        </div>
        <div class="agent-message-content">
          <div class="agent-message-text">${formatMessageContent(n.content)}</div>
          ${n.code?html`
            <div class="agent-code-actions">
              <button 
                class="agent-code-btn"
                onclick=${()=>i("ai-code-generated",n.code)}
                title="Configure">
                Configure
              </button>
              <button 
                class="agent-copy-btn"
                onclick=${()=>i("ai-open-in-new-tab",n.code)}
                title="Open in new tab">
                Open in new tab
              </button>
            </div>
          `:""}
          <div class="agent-message-time">${o}</div>
        </div>
      </div>
    `:n.role==="error"?html`
      <div class="agent-message agent-message-error">
        <div class="agent-message-avatar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        </div>
        <div class="agent-message-content">
          <div class="agent-message-text">${n.content}</div>
          <div class="agent-message-time">${o}</div>
        </div>
      </div>
    `:html`<div></div>`}function formatMessageContent(n){let i=n;i=i.replace(/```python\n[\s\S]*?```/g,'[Code generated - click "Configure" below]'),i=i.replace(/```\n[\s\S]*?```/g,'[Code generated - click "Configure" below]');const o=i.split(`
`);if(o.length===0)return"";if(o.length===1)return o[0]||"";const r=[];for(let s=0;s<o.length;s++)r.push(o[s]),s<o.length-1&&r.push(html`<br>`);return html`${r}`}function handleInputKeydown(n,i,o){(n.ctrlKey||n.metaKey)&&n.key==="Enter"&&(n.preventDefault(),handleSendMessage(i,o))}function handleSendMessage(n,i){const o=(n.aiAgent.inputValue||"").trim();!o||n.aiAgent.isGenerating||(i("ai-send-message",o),setTimeout(()=>{const r=document.getElementById("agent-messages");r&&(r.scrollTop=r.scrollHeight)},100))}class LogTerminalComponent extends Component{constructor(i,o,r){super(i),this.state=o,this.emit=r,this.term=null,this.fitAddon=null,this.resizeObserver=null,this.writeHandler=null,this.clearHandler=null}createElement(i){return html`<div class="log-sidebar-terminal"></div>`}update(i){return this.state=i,!1}load(i){console.debug("[LogTerminal] Component loaded, initializing terminal"),this.initTerminal(i),this.attachEventListeners()}unload(){console.debug("[LogTerminal] Component unloading, cleaning up"),this.cleanup()}async initTerminal(i){const r=document.documentElement.getAttribute("data-theme")==="dark";let s,a,c,l;r?(s="#2c3e50",a="#e8eaed",c="#008184",l="#34495e"):(s="#ffffff",a="#1f1f1f",c="#008184",l="#e8e8e8"),await this.ensureFontsLoaded();const[d,u]=await Promise.all([__vitePreload(()=>import("./xterm-CASmyfyk.js"),[]),__vitePreload(()=>import("./addon-fit-DOCEibfw.js"),[]),__vitePreload(()=>Promise.resolve({}),__vite__mapDeps([11]))]),p=d.Terminal,g=u.FitAddon;this.term=new p({cursorBlink:!1,cursorStyle:"bar",fontSize:12,fontFamily:"CodeFont, monospace",letterSpacing:0,theme:{background:s,foreground:a,cursor:c,selection:l},disableStdin:!0,scrollback:this.state.logs?.maxMessages||1e3}),this.fitAddon=new g,this.term.loadAddon(this.fitAddon),console.debug("[LogTerminal] Opening terminal into container, dimensions:",i.getBoundingClientRect()),this.term.open(i),this.fitAfterOpen(i)}async ensureFontsLoaded(){if(document.fonts&&document.fonts.ready)try{return await document.fonts.ready,document.fonts.check&&await new Promise(i=>setTimeout(i,50)),Promise.resolve()}catch{return new Promise(o=>setTimeout(o,200))}else return new Promise(i=>setTimeout(i,200))}fitAfterOpen(i){setTimeout(()=>this.fitTerminal(),100),setTimeout(()=>this.fitTerminal(),300),setTimeout(()=>this.fitTerminal(),1e3),this.resizeObserver=new ResizeObserver(()=>{setTimeout(()=>this.fitTerminal(),50)}),this.resizeObserver.observe(i);const o=i.closest(".log-sidebar");o&&this.resizeObserver.observe(o),this.term.write(`\x1B[1;32m=== Log Terminal Initialized ===\x1B[0m\r
`),this.term.write(`\x1B[37mTerminal is ready to receive logs\x1B[0m\r
\r
`),this.state.logs?.messages?.length>0&&(console.debug("[LogTerminal] Writing",this.state.logs.messages.length,"buffered messages"),this.state.logs.messages.forEach(r=>{this.writeLogEntry(r)}))}fitTerminal(){if(!this.term||!this.fitAddon)return;const o=this.element?.closest(".log-sidebar")?.getBoundingClientRect(),r=this.element?.getBoundingClientRect();console.debug("[LogTerminal] Sidebar rect:",o,"Container rect:",r);try{this.fitAddon.fit(),this.term.refresh&&this.term.refresh(0,this.term.rows-1),console.debug("[LogTerminal] Fitted:",this.term.cols,"x",this.term.rows)}catch(s){console.warn("[LogTerminal] Fit failed:",s)}}attachEventListeners(){this.writeHandler=i=>{const o=i.detail;o&&this.term&&this.writeLogEntry(o)},this.clearHandler=()=>{this.term&&this.term.clear()},window.addEventListener("log-terminal-write",this.writeHandler),window.addEventListener("log-terminal-clear",this.clearHandler),console.debug("[LogTerminal] Event listeners attached")}writeLogEntry(i){if(!this.term)return;const{level:o,message:r,timestamp:s,source:a}=i,c=["\x1B[37m","\x1B[34m","\x1B[33m","\x1B[31m"],l=["DBG","INF","WRN","ERR"],d=c[o]||"",u=l[o]||"LOG",p="\x1B[0m";let g="";if(s){const v=s<9466848e5?s*1e3:s;g=`[${new Date(v).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"})}] `}const f=a?`[${a}] `:"",h=`${g}${d}[${u}]${p} ${f}${r}\r
`;this.term.write(h),this.state.logs?.autoScroll!==!1&&this.term.scrollToBottom()}cleanup(){this.writeHandler&&(window.removeEventListener("log-terminal-write",this.writeHandler),this.writeHandler=null),this.clearHandler&&(window.removeEventListener("log-terminal-clear",this.clearHandler),this.clearHandler=null),this.resizeObserver&&(this.resizeObserver.disconnect(),this.resizeObserver=null),this.term&&(this.term.dispose(),this.term=null),this.fitAddon=null}}let logTerminalComponent=null;function LogSidebar(n,i){if(!n.logs.isOpen)return logTerminalComponent=null,null;logTerminalComponent||(logTerminalComponent=new LogTerminalComponent("log-terminal",n,i));const o=logTerminalComponent.render(n),r=n.logSidebarWidth||350;return html`
    <div class="log-sidebar" style="width: ${r}px; flex: 0 0 ${r}px;">
      <div class="log-sidebar-resizer" 
           onmousedown=${()=>i("start-resizing-log-sidebar")}></div>
      <div class="log-sidebar-header">
        ${IconSprite.renderIcon("file-text",{className:"",size:16})}
        <span>Logs</span>
      </div>
      ${o}
    </div>
  `}function FileActions(n,i){const{isConnected:o,selectedFiles:r}=n,s=r.some(a=>a.type==="file");return html`
  <div id="file-actions">
    ${Button({icon:"edit",size:"small",disabled:!canEdit({selectedFiles:n.selectedFiles}),onClick:()=>i("open-selected-files")})}
    ${Button({icon:"arrow-left",size:"small",background:"inverted",active:!0,disabled:!canUpload({isConnected:o,selectedFiles:r}),onClick:()=>i("upload-files")})}
    ${Button({icon:"arrow-right",size:"small",background:"inverted",active:!0,disabled:!canDownload({isConnected:o,selectedFiles:r}),onClick:()=>i("download-files")})}
    ${Button({icon:"arrow-down",size:"small",background:"inverted",active:!0,disabled:!s,onClick:()=>i("export-files")})}
    ${Button({icon:"trash",size:"small",disabled:n.selectedFiles.length===0,onClick:()=>i("remove-files")})}
  </div>

  `}const DiskFileList=generateFileList("disk"),BoardFileList=generateFileList("board");function generateFileList(n){return function(o,r){function s(f){f.key.toLowerCase()==="enter"&&f.target.blur(),f.key.toLowerCase()==="escape"&&(f.target.value=null,f.target.blur())}const a=html`
      <div class="item">
        ${IconSprite.renderIcon("file",{className:"icon"})}
        <div class="text">
          <input type="text" onkeydown=${s} onblur=${f=>r("finish-creating-file",f.target.value)}/>
        </div>
      </div>
    `,c=html`
      <div class="item">
        ${IconSprite.renderIcon("folder",{className:"icon"})}
        <div class="text">
          <input type="text" onkeydown=${s} onblur=${f=>r("finish-creating-folder",f.target.value)}/>
        </div>
      </div>
    `;function l(f,h){const m=html`
        <input type="text"
          value=${f.fileName}
          onkeydown=${s}
          onblur=${x=>r("finish-renaming-file",x.target.value)}
          onclick=${x=>!1}
          ondblclick=${x=>!1}
          />
      `,v=o.selectedFiles.find(x=>x.fileName===f.fileName&&x.source===n);function y(x){return x.preventDefault(),r("rename-file",n,f),!1}function b(){o.renamingFile||r(`navigate-${n}-folder`,f.fileName)}function S(){o.renamingFile||r("open-file",n,f)}let C=f.fileName;const k=o.selectedFiles.find(x=>x.fileName===C);o.renamingFile==n&&k&&(C=m);function w(x){if(x==null)return"";if(x===0)return"0 B";const P=1024,T=["B","KB","MB","GB"],E=Math.floor(Math.log(x)/Math.log(P));return parseFloat((x/Math.pow(P,E)).toFixed(1))+" "+T[E]}const _=f.type==="file"?w(f.size):"";return f.type==="folder"?html`
          <div
            class="item ${v?"selected":""}"
            onclick=${x=>r("toggle-file-selection",f,n,x)}
            ondblclick=${b}
            >
            ${IconSprite.renderIcon("folder",{className:"icon"})}
            <div class="text">${C}</div>
            <div class="options" onclick=${y}>
              ${IconSprite.renderIcon("cursor-text",{className:""})}
            </div>
          </div>
        `:html`
          <div
            class="item ${v?"selected":""}"
            onclick=${x=>r("toggle-file-selection",f,n,x)}
            ondblclick=${S}
            >
            ${IconSprite.renderIcon("file",{className:"icon"})}
            <div class="text" style="display: flex; justify-content: space-between; padding-right: 10px;">
              <span>${C}</span>
              <span class="file-size">${_}</span>
            </div>
            <div class="options" onclick=${y}>
              ${IconSprite.renderIcon("cursor-text",{className:""})}
            </div>
          </div>
        `}const d=o[`${n}Files`].sort((f,h)=>{const m=f.fileName.toUpperCase(),v=h.fileName.toUpperCase();if(f.type==="folder"&&h.type==="file")return-1;if(f.type===h.type){if(m<v)return-1;if(m>v)return 1}return 0}),u=html`<div class="item"
  onclick=${()=>r(`navigate-${n}-parent`)}
  style="cursor: pointer"
  >
  ..
</div>`,p=html`
      <div class="file-list">
        <div class="list">
          ${n==="disk"&&o.diskNavigationPath!="/"?u:""}
          ${n==="board"&&o.boardNavigationPath!="/"?u:""}
          ${o.creatingFile==n?a:null}
          ${o.creatingFolder==n?c:null}
          ${d.map(l)}
        </div>
      </div>
    `;return new MutationObserver(f=>{const h=p.querySelector("input");h&&h.focus()}).observe(p,{childList:!0,subtree:!0}),p}}function ReplPanel(n,i){const o=()=>{n.panelHeight>PANEL_CLOSED$1?i("close-panel"):i("open-panel")};n.isPanelOpen;const r=n.panelHeight>PANEL_TOO_SMALL$1?"visible":"hidden";let s="terminal-enabled";return(!n.isConnected||n.isNewFileDialogOpen)&&(s="terminal-disabled"),html$1`
    <div id="panel" style="height: ${n.panelHeight}px">
      <div class="panel-bar">
        ${n.isConnected&&n.connectedPort?html$1`
          <div class="panel-connection-label" title=${`Connected to ${n.connectedPort}`}>
            Connected to ${n.connectedPort}
          </div>
        `:""}
        <div class="spacer"></div>
        <div id="drag-handle"
          onmousedown=${a=>i("start-resizing-panel",a)}
          ></div>
        <div class="term-operations ${r}">
          ${ReplOperations(n,i)}
        </div>
        ${Button({icon:n.panelHeight>PANEL_CLOSED$1?"chevron-down":"chevron-up",size:"small",onClick:o})}
        
      </div>
      <div class="repl-panel-content">
        <div class="repl-panel-main ${s}">
          ${n.cache(XTerm,"terminal").render()}
        </div>
        ${n.logs&&n.logs.isOpen?LogSidebar(n,i):""}
      </div>
    </div>
  `}function ReplOperations(n,i){return[Button({icon:"copy",size:"small",tooltip:"Copy",onClick:()=>document.execCommand("copy")}),Button({icon:"clipboard",size:"small",tooltip:"Paste",onClick:()=>document.execCommand("paste")}),Button({icon:"trash",size:"small",tooltip:`Clean (${n.platform==="darwin"?"Cmd":"Ctrl"}+L)`,onClick:()=>i("clear-terminal")}),Button({icon:"file-text",size:"small",tooltip:"Toggle Logs",onClick:()=>i("toggle-log-sidebar")})]}function Tabs(n,i){const o=html`
    <div id="tabs">
      ${n.openFiles.map(s=>Tab({text:s.fileName,icon:s.source==="board"?"cpu":"device-desktop",active:s.id===n.editingFile,renaming:s.id===n.renamingTab,hasChanges:s.hasChanges,onSelectTab:()=>i("select-tab",s.id),onCloseTab:()=>i("close-tab",s.id),onStartRenaming:()=>i("rename-tab",s.id),onFinishRenaming:a=>i("finish-renaming-tab",a)}))}
    </div>
  `;return new MutationObserver(s=>{const a=o.querySelector("input");a&&a.focus()}).observe(o,{childList:!0,subtree:!0}),o}function Toolbar(n,i){const o=canSave({isConnected:n.isConnected,openFiles:n.openFiles,editingFile:n.editingFile}),r=canExecute({isConnected:n.isConnected}),s=n.platform==="darwin"?"Cmd":"Ctrl",a=n.debugger.active||n.debugger.configOpen;return html`
    <div id="navigation-bar">
      <div id="toolbar">
        ${Button({icon:"file-plus",label:"New",tooltip:`New (${s}+N)`,disabled:n.systemSection!="editor"||a,onClick:()=>i("create-new-file"),first:!0})}

        ${Button({icon:"device-floppy",label:"Save",tooltip:`Save (${s}+S)`,disabled:!o||a,onClick:()=>i("save")})}

        <div class="separator"></div>

        ${Button({icon:"alert-triangle",label:"Reset",tooltip:"Reset Device",disabled:!n.isConnected,onClick:()=>i("open-reset-dialog")})}

        ${a?html`
          ${Button({icon:"player-stop",label:"Stop",tooltip:"Stop Debug",onClick:()=>i("debugger:stop")})}

          ${Button({icon:"player-play",label:n.debugger.active?"Continue":"Run",tooltip:n.debugger.active?"Continue (F5)":"Start Debugging (F5)",disabled:n.debugger.active&&!n.debugger.halted,onClick:()=>{n.debugger.active?i("debugger:continue",!0):i("debugger:start")}})}

          ${Button({icon:"player-skip-forward",label:"Step",tooltip:"Step Over (F10)",disabled:!n.debugger.active||!n.debugger.halted,onClick:()=>i("debugger:step-over")})}
          ${Button({icon:"step-into",label:"Step In",tooltip:"Step Into (F11)",disabled:!n.debugger.active||!n.debugger.halted,onClick:()=>i("debugger:step-into")})}
          ${Button({icon:"step-out",label:"Step Out",tooltip:"Step Out (F12)",disabled:!n.debugger.active||!n.debugger.halted,onClick:()=>i("debugger:step-out")})}
        `:html`
          ${Button({icon:"player-stop",label:"Stop",tooltip:`Stop (${s}+H)`,disabled:!r,onClick:()=>i("stop")})}

          ${Button({icon:"player-play",label:"Run",tooltip:`Run (${s}+R)`,disabled:!r,onClick:c=>{c.altKey?i("run-from-button",!0):i("run-from-button")}})}

          <div class="separator"></div>

          ${n.systemSection==="editor"?Button({icon:"bug",label:"Debug",tooltip:"Start Debugging",disabled:!r||!n.editingFile,onClick:()=>i("debugger:open-config")}):""}

          <div class="separator"></div>

          ${n.systemSection==="editor"?Button({icon:"script",label:"ScriptO",tooltip:"Open ScriptO Library",onClick:()=>i("open-scriptos-modal")}):""}

          ${n.systemSection==="system"?Button({icon:"apps",label:"Extensions",tooltip:"Manage Extensions",onClick:()=>i("open-extensions-modal")}):""}

          ${n.systemSection==="editor"?Button({icon:"robot-face",label:"AI Agent",tooltip:"Open AI Code Assistant",active:n.aiAgent.isOpen,onClick:()=>i("toggle-agent-sidebar")}):""}
        `}
      </div>
    </div>
  `}function Overlay(n,i){let o=html`<div id="overlay" class="closed"></div>`;if(n.diskFiles==null&&(i("load-disk-files"),o=html`<div id="overlay" class="open"><p>Loading files...</p></div>`),n.isRemoving&&(o=html`<div id="overlay" class="open"><p>Removing...</p></div>`),n.isConnecting&&(o=html`<div id="overlay" class="open"><p>Connecting...</p></div>`),n.isLoadingFiles&&(o=html`<div id="overlay" class="open"><p>Loading files...</p></div>`),n.isSaving&&(o=html`<div id="overlay" class="open"><p>Saving file... ${n.savingProgress}</p></div>`),n.isTransferring){const r=String(n.transferringProgress||""),s=r.match(/(\d+)%?$/),a=s?parseInt(s[1]):0,c=r.match(/^(.+?):/),l=c?c[1]:"file";o=html`
      <div id="overlay" class="open">
        <div class="transfer-overlay-content">
          <div class="transfer-title">Transferring File</div>
          <div class="transfer-filename">${l}</div>
          <div class="transfer-progress-container">
            <div class="transfer-progress-bar">
              <div class="transfer-progress-fill" style="width: ${a}%"></div>
            </div>
            <div class="transfer-progress-text">${a}%</div>
          </div>
        </div>
      </div>
    `}return o}const DISCONNECTED_STATUS_TEXT="ScriptO Studio © JetPax 2026";function formatUptimeMinutes(n){const i=(n||0)*60,o=Math.floor(i/86400),r=Math.floor(i%86400/3600),s=Math.floor(i%3600/60),a=Math.floor(i%60),c=[];return o>0&&c.push(`${o}d`),r>0&&c.push(`${r}h`),s>0&&c.push(`${s}m`),(a>0||c.length===0)&&c.push(`${a}s`),c.join(" ")}function buildStatusBarModel(n,i){if(!n)return{connected:!1,disconnectedText:DISCONNECTED_STATUS_TEXT,ram:null,temp:null,uptime:null,rssi:null};const o=n.mem||{},r=n.temp,s=n.uptime||0,a=n.wifi_rssi,c=o.alloc||0,l=o.free||0,d=c+l,u=(c/1024).toFixed(2),p=(d/(1024*1024)).toFixed(2);let g=null;r!=null&&((i||"degC")==="degF"?g=`${(r*9/5+32).toFixed(1)}°F`:g=`${r.toFixed(1)}°C`);const f=formatUptimeMinutes(s);let h=null;return a!=null&&(h=`${a} dBm`),{connected:!0,disconnectedText:DISCONNECTED_STATUS_TEXT,ram:`${u} KB / ${p} MB`,temp:g,uptime:f,rssi:h}}function StatusBar(n,i){const o=buildStatusBarModel(n.isConnected?n.statusInfo:null,n.temperatureUnit||"degC");if(!o||!o.connected){const r=o&&o.disconnectedText||DISCONNECTED_STATUS_TEXT;return html`
      <div id="status-bar" class="disconnected">
        <div class="status-bar-center">
          <a href="https://scriptostudio.com" target="_blank" rel="noopener noreferrer">${r}</a>
        </div>
      </div>
    `}return html`
    <div id="status-bar">
      <div class="status-bar-center">
        <div class="status-item ram">
          <span class="status-label">RAM</span>
          <span class="status-value">${o.ram}</span>
        </div>
        ${o.temp?html`
          <div class="status-item temp">
            <span class="status-label">TEMP</span>
            <span class="status-value">${o.temp}</span>
          </div>
        `:""}
        <div class="status-item uptime">
          <span class="status-label">UPTIME</span>
          <span class="status-value">${o.uptime}</span>
        </div>
        ${o.rssi?html`
          <div class="status-item wifi-rssi">
            <span class="status-label">RSSI</span>
            <span class="status-value">${o.rssi}</span>
          </div>
        `:""}
      </div>
    </div>
  `}function LanguageSelector(n,i){const o=window.html||(()=>{}),r=n.locale||"en",s=window.i18n?window.i18n.getAvailableLocales():["en","de","es","fr"],a={en:"English",de:"Deutsch",es:"Español",fr:"Français"},c=window.i18n?window.i18n.t("language"):"Language";return o`
    <div class="language-selector">
      <label class="language-selector-label" for="language-select">
        ${c}
      </label>
      <select
        id="language-select"
        class="language-select"
        onchange=${d=>{const u=d.target.value;i("change-locale",u)}}
      >
        ${s.map(d=>o`
          <option value=${d} selected=${d===r}>
            ${a[d]||d}
          </option>
        `)}
      </select>
    </div>
  `}typeof window<"u"&&(window.LanguageSelector=LanguageSelector);function AppearancePanel(n,i){const o=window.i18n?window.i18n.t:c=>c;n.isConnected&&!n.networkInterfacesConfig&&!n.isLoadingNetworkInterfacesConfig&&i("load-network-interfaces-config");const r=n.networksInfo?.eth!==null,s=n.networksInfo?.wwan!==null,a=n.networkInterfacesConfig||{wifi:!0,ethernet:!0,wwan:!0};return html`
    <div class="panel-container">
      <div class="appearance-content">
        
        <!-- Theme Mode Section -->
        <div class="appearance-section">
          <h3>${o("appearance.theme")}</h3>
          <p class="appearance-hint">${o("appearance.themeHint")}</p>
          
          <div class="theme-mode-selector">
            ${renderThemeOption("light",o("appearance.themeLight"),n,i)}
            ${renderThemeOption("dark",o("appearance.themeDark"),n,i)}
            ${renderThemeOption("device",o("appearance.themeDevice"),n,i)}
          </div>
          
          ${n.theme==="device"?html`
            <p class="appearance-hint">
              ${o("appearance.themeCurrentlyUsing")} <strong>${n.effectiveTheme==="dark"?o("appearance.themeDark"):o("appearance.themeLight")}</strong> 
              ${o("appearance.themeFromSystem")}
            </p>
          `:""}
        </div>
        
        <!-- Color Scheme Section -->
        <div class="appearance-section">
          <h3>${o("appearance.colorScheme")}</h3>
          <p class="appearance-hint">${o("appearance.colorSchemeHint")}</p>
          
          <div class="color-scheme-grid">
            ${renderColorSchemeOption("teal",o("appearance.colorTeal"),n,i)}
            ${renderColorSchemeOption("blue",o("appearance.colorBlue"),n,i)}
            ${renderColorSchemeOption("purple",o("appearance.colorPurple"),n,i)}
            ${renderColorSchemeOption("green",o("appearance.colorGreen"),n,i)}
            ${renderColorSchemeOption("red",o("appearance.colorRed"),n,i)}
            ${renderColorSchemeOption("orange",o("appearance.colorOrange"),n,i)}
          </div>
        </div>
        
        <!-- Editor Theme Section -->
        <div class="appearance-section">
          <h3>${o("appearance.editorTheme")}</h3>
          <p class="appearance-hint">${o("appearance.editorThemeHint")}</p>
          
          <div class="editor-theme-grid">
            ${renderEditorThemeOption("auto",o("appearance.editorAuto"),o("appearance.editorAutoDesc"),n,i)}
            ${renderEditorThemeOption("cobalt",o("appearance.editorCobalt"),o("appearance.editorCobaltDesc"),n,i)}
            ${renderEditorThemeOption("xcode",o("appearance.editorXcode"),o("appearance.editorXcodeDesc"),n,i)}
            ${renderEditorThemeOption("coolglow",o("appearance.editorCoolGlow"),o("appearance.editorCoolGlowDesc"),n,i)}
          </div>
        </div>
        
        <!-- Temperature Unit Section -->
        <div class="appearance-section">
          <h3>${o("appearance.temperatureUnit")}</h3>
          <p class="appearance-hint">${o("appearance.temperatureUnitHint")}</p>
          
          <div class="theme-mode-selector">
            ${renderTemperatureUnitOption("degC",o("appearance.temperatureCelsius"),n,i)}
            ${renderTemperatureUnitOption("degF",o("appearance.temperatureFahrenheit"),n,i)}
          </div>
        </div>
        
        <!-- Network Interfaces Section (only show when connected) -->
        ${n.isConnected?html`
          <div class="appearance-section">
            <h3>Network Interfaces</h3>
            <p class="appearance-hint">Enable or disable network interfaces. Disabled interfaces will not start on boot. At least one interface must remain enabled.</p>
            
            ${n.isLoadingNetworkInterfacesConfig?html`
              <p style="color: var(--text-secondary);">Loading configuration...</p>
            `:html`
              <div class="network-interfaces-grid">
                ${renderNetworkInterfaceOption("wifi","WiFi",a.wifi,n,i)}
                ${r?renderNetworkInterfaceOption("ethernet","Ethernet",a.ethernet,n,i):""}
                ${s?renderNetworkInterfaceOption("wwan","WWAN (4G)",a.wwan,n,i):""}
              </div>
              
              <button 
                class="save-button" 
                style="margin-top: 16px;"
                onclick=${()=>{const c={wifi:n.networkInterfacesConfig?.wifi??!0,ethernet:n.networkInterfacesConfig?.ethernet??!0,wwan:n.networkInterfacesConfig?.wwan??!0};i("save-network-interfaces-config",c)}}
                disabled=${!n.isConnected||n.isSavingNetworkInterfacesConfig===!0}
              >
                ${n.isSavingNetworkInterfacesConfig?"Saving...":"Save Network Settings"}
              </button>
            `}
          </div>
        `:""}
        
      </div>
    </div>
  `}function renderThemeOption(n,i,o,r){const s=o.theme===n;return html`
    <button 
      class="theme-mode-option ${s?"selected":""}"
      onclick=${()=>r("set-theme",n)}
    >
      ${getThemeIcon(n)}
      <span>${i}</span>
    </button>
  `}function getThemeIcon(n){const i={light:html`
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
    `};return i[n]||i.device}function renderColorSchemeOption(n,i,o,r){const s=o.colorScheme===n;return html`
    <div 
      class="color-scheme-option ${s?"selected":""}"
      data-scheme="${n}"
      onclick=${()=>r("set-color-scheme",n)}
    >
      <div class="color-scheme-circle"></div>
      <div class="color-scheme-label">${i}</div>
    </div>
  `}function renderTemperatureUnitOption(n,i,o,r){const s=(o.temperatureUnit||"degC")===n;return html`
    <button 
      class="theme-mode-option ${s?"selected":""}"
      onclick=${()=>r("set-temperature-unit",n)}
    >
      <span>${i}</span>
    </button>
  `}function renderEditorThemeOption(n,i,o,r,s){const a=(r.editorTheme||"auto")===n;return html`
    <div 
      class="editor-theme-option ${a?"selected":""}"
      onclick=${()=>s("set-editor-theme",n)}
    >
      <div class="editor-theme-preview" data-theme="${n}"></div>
      <div class="editor-theme-info">
        <div class="editor-theme-name">${i}</div>
        <div class="editor-theme-desc">${o}</div>
      </div>
    </div>
  `}function renderNetworkInterfaceOption(n,i,o,r,s){return html`
    <div class="network-interface-option">
      <div class="network-interface-info">
        <span class="network-interface-label">${i}</span>
        <span class="network-interface-status ${o?"enabled":"disabled"}">
          ${o?"Enabled":"Disabled"}
        </span>
      </div>
      <label class="toggle-switch">
        <input 
          type="checkbox" 
          checked=${o}
          onchange=${a=>{r.networkInterfacesConfig||(r.networkInterfacesConfig={wifi:!0,ethernet:!0,wwan:!0}),r.networkInterfacesConfig[n]=a.target.checked,s("render")}}
        />
        <span class="toggle-slider"></span>
      </label>
    </div>
  `}function SysInfoPanel(n,i){const o=window.i18n?window.i18n.t:s=>s;if(!n.systemInfo&&n.isConnected&&!n.isLoadingSystemInfo&&!n.systemInfoAttempted&&(n.systemInfoAttempted=!0,i("refresh-system-info")),!n.systemInfo)return n.isConnected?html`
      <div class="panel-container">
        <div class="panel-header">
          <h2>${o("sysinfo.title")}</h2>
        </div>
        <div class="panel-loading">
          ${o("sysinfo.loading")}
        </div>
      </div>
    `:html`
        <div class="panel-container">
          <div class="panel-header">
            <h2>${o("sysinfo.title")}</h2>
          </div>
          <div class="panel-message">
            <p>Connect to a device to view system information.</p>
          </div>
        </div>
      `;const r=n.systemInfo;return html`
    <div class="panel-container">
      <div class="panel-header">
        <h2>${o("sysinfo.title")}</h2>
      </div>
      
      ${BoardInfoSection(n.boardConfig,o)}
      ${MCUSection(r,o)}
      ${PartitionsSection(r,o)}
    </div>
  `}function BoardInfoSection(n,i){return html`
    <div class="panel-section">
      <h3 class="panel-section-title">${i("sysinfo.boardInfo")}</h3>
      ${n?html`
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">${i("sysinfo.boardName")}</span>
            <span class="info-value">${n.board_name||i("sysinfo.notAvailable")}</span>
          </div>
          <div class="info-item">
            <span class="info-label">${i("sysinfo.boardId")}</span>
            <span class="info-value info-mono">${n.board_id||i("sysinfo.notAvailable")}</span>
          </div>
          <div class="info-item">
            <span class="info-label">${i("sysinfo.chip")}</span>
            <span class="info-value">${n.chip||i("sysinfo.notAvailable")}</span>
          </div>
          <div class="info-item">
            <span class="info-label">${i("sysinfo.version")}</span>
            <span class="info-value">${n.version||i("sysinfo.notAvailable")}</span>
          </div>
          ${n.description?html`
            <div class="info-item" style="grid-column: 1 / -1;">
              <span class="info-label">${i("sysinfo.description")}</span>
              <span class="info-value">${n.description}</span>
            </div>
          `:""}
        </div>
      `:html`
        <div class="panel-loading" style="padding: 20px; text-align: center; color: var(--text-secondary);">
          ${i("sysinfo.loadingBoard")}
        </div>
      `}
    </div>
  `}function MCUSection(n,i){const o=n.os||{};return html`
    <div class="panel-section">
      <h3 class="panel-section-title">${i("sysinfo.mcuTitle")}</h3>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">${i("sysinfo.uniqueId")}</span>
          <span class="info-value info-mono">${n.uid||i("sysinfo.notAvailable")}</span>
        </div>
        <div class="info-item">
          <span class="info-label">${i("sysinfo.frequency")}</span>
          <span class="info-value">${n.freq?n.freq+" "+i("sysinfo.mhz"):i("sysinfo.notAvailable")}</span>
        </div>
        <div class="info-item">
          <span class="info-label">${i("sysinfo.flashSize")}</span>
          <span class="info-value">${formatBytes$1(n.flashSize)}</span>
        </div>
        <div class="info-item">
          <span class="info-label">${i("sysinfo.platform")}</span>
          <span class="info-value">${o.platform||i("sysinfo.notAvailable")}</span>
        </div>
        <div class="info-item">
          <span class="info-label">${i("sysinfo.system")}</span>
          <span class="info-value">${o.system||i("sysinfo.notAvailable")}</span>
        </div>
        <div class="info-item">
          <span class="info-label">${i("sysinfo.release")}</span>
          <span class="info-value">${o.release||i("sysinfo.notAvailable")}</span>
        </div>
        <div class="info-item">
          <span class="info-label">${i("sysinfo.version")}</span>
          <span class="info-value info-mono">${o.version||i("sysinfo.notAvailable")}</span>
        </div>
        <div class="info-item">
          <span class="info-label">${i("sysinfo.implementation")}</span>
          <span class="info-value">${o.implem||i("sysinfo.notAvailable")}</span>
        </div>
        <div class="info-item">
          <span class="info-label">${i("sysinfo.spiram")}</span>
          <span class="info-value ${o.spiram?"status-yes":"status-no"}">
            ${o.spiram?i("sysinfo.yes"):i("sysinfo.no")}
          </span>
        </div>
        <div class="info-item">
          <span class="info-label">${i("sysinfo.mpyVersion")}</span>
          <span class="info-value">${o.mpyver||i("sysinfo.notAvailable")}</span>
        </div>
      </div>
    </div>
  `}function PartitionsSection(n,i){return!n.partitions||n.partitions.length===0?"":html`
    <div class="panel-section">
      <h3 class="panel-section-title">${i("sysinfo.partitions")}</h3>
      <div class="partitions-table">
        <div class="partition-header">
          <span class="partition-name">${i("sysinfo.partitionName")}</span>
          <span class="partition-type">${i("sysinfo.partitionType")}</span>
          <span class="partition-offset">${i("sysinfo.partitionOffset")}</span>
          <span class="partition-size">${i("sysinfo.partitionSize")}</span>
        </div>
        ${n.partitions.map(o=>{let r;return Array.isArray(o)?r={type:o[0],subtype:o[1],offset:o[2],size:o[3],name:o[4]||"unknown",encrypted:o[5]}:r=o,html`
            <div class="partition-row">
              <span class="partition-name">
                ${getPartitionIcon(r.name)}
                ${r.name}
              </span>
              <span class="partition-type">${getPartitionType(r.type,r.subtype)}</span>
              <span class="partition-offset">0x${r.offset.toString(16)}</span>
              <span class="partition-size">${formatBytes$1(r.size)}</span>
            </div>
          `})}
      </div>
    </div>
  `}function getPartitionType(n,i){return{0:"APP",1:"DATA"}[n]||`Type ${n}`}function getPartitionIcon(n){if(!n)return"📦";const i=n.toLowerCase();return i.includes("ota")?"🔄":i.includes("nvs")?"💾":i.includes("www")?"🌐":i.includes("vfs")?"📁":i.includes("data")?"💿":i.includes("factory")?"🏭":"📦"}function formatBytes$1(n){return n?n<1024?n+" B":n<1024*1024?(n/1024).toFixed(1)+" KB":(n/(1024*1024)).toFixed(2)+" MB":"N/A"}function WiFiPanel(n,i){if(!n.networksInfo&&n.isConnected&&!n.isLoadingNetworks&&i("refresh-networks"),n.isConnected&&!n.networkInterfacesConfig&&!n.isLoadingNetworkInterfacesConfig&&i("load-network-interfaces-config"),!n.networksInfo)return html`
      <div class="panel-container">
        <div class="panel-header">
          <h2>WiFi Configuration</h2>
        </div>
        <div class="panel-loading">
          ${n.isConnected?"Loading WiFi information...":"Connect to device to view WiFi configuration"}
        </div>
      </div>
    `;const o=n.networksInfo,r=n.networkInterfacesConfig?.wifi===!1;return html`
    <div class="panel-container">
      <div class="panel-header">
        <h2>WiFi Configuration</h2>
      </div>
      
      ${WiFiSTASection(o.wifiSTA,r)}
      ${WiFiAPSection(o.wifiAP)}
    </div>
  `}function WiFiSTASection(n,i=!1){if(!n)return"";const o=i?"status-disabled":n.active?"status-active":"status-inactive",r=i?"Disabled":n.active?"Active":"Inactive";return html`
    <div class="panel-section">
      <div class="section-header">
        <h3 class="panel-section-title">Wi-Fi Client Interface</h3>
        <div class="status-badge ${o}">
          ${r}
        </div>
      </div>
      
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">MAC Address:</span>
          <span class="info-value info-mono">${n.mac||"N/A"}</span>
        </div>
        <div class="info-item">
          <span class="info-label">SSID:</span>
          <span class="info-value">${n.ssid||"Not connected"}</span>
        </div>
        <div class="info-item">
          <span class="info-label">IP Address:</span>
          <span class="info-value info-mono">${n.ip||"0.0.0.0"}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Subnet Mask:</span>
          <span class="info-value info-mono">${n.mask||"0.0.0.0"}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Gateway:</span>
          <span class="info-value info-mono">${n.gateway||"0.0.0.0"}</span>
        </div>
        <div class="info-item">
          <span class="info-label">DNS Server:</span>
          <span class="info-value info-mono">${n.dns||"0.0.0.0"}</span>
        </div>
        ${n.rssi?html`
          <div class="info-item">
            <span class="info-label">Signal Strength:</span>
            <span class="info-value">${n.rssi} dBm</span>
          </div>
        `:""}
      </div>
      
      ${n.active&&n.ssid?html`
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
  `}function WiFiAPSection(n){return n?html`
    <div class="panel-section">
      <div class="section-header">
        <h3 class="panel-section-title">Wi-Fi Access Point Interface</h3>
        <div class="status-badge ${n.active?"status-active":"status-inactive"}">
          ${n.active?"Active":"Inactive"}
        </div>
      </div>
      
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">MAC Address:</span>
          <span class="info-value info-mono">${n.mac||"N/A"}</span>
        </div>
        <div class="info-item">
          <span class="info-label">SSID:</span>
          <span class="info-value">${n.ssid||"N/A"}</span>
        </div>
        <div class="info-item">
          <span class="info-label">IP Address:</span>
          <span class="info-value info-mono">${n.ip||"0.0.0.0"}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Subnet Mask:</span>
          <span class="info-value info-mono">${n.mask||"0.0.0.0"}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Gateway:</span>
          <span class="info-value info-mono">${n.gateway||"0.0.0.0"}</span>
        </div>
        <div class="info-item">
          <span class="info-label">DNS Server:</span>
          <span class="info-value info-mono">${n.dns||"0.0.0.0"}</span>
        </div>
        ${n.clients!==void 0?html`
          <div class="info-item">
            <span class="info-label">Connected Clients:</span>
            <span class="info-value">${n.clients}</span>
          </div>
        `:""}
      </div>
      
      <div class="config-actions">
        <button class="secondary-button" onclick=${()=>alert("AP configuration coming soon")}>
          ${n.active?"Configure":"Enable AP"}
        </button>
      </div>
    </div>
  `:""}function EthernetPanel(n,i){if(!n.networksInfo&&n.isConnected&&!n.isLoadingNetworks&&i("refresh-networks"),n.isConnected&&!n.ethConfigLoaded&&!n.isLoadingEthConfig&&i("load-eth-config"),n.isConnected&&!n.networkInterfacesConfig&&!n.isLoadingNetworkInterfacesConfig&&i("load-network-interfaces-config"),!n.networksInfo)return html`
      <div class="panel-container">
        <div class="panel-header">
          <h2>Ethernet Configuration</h2>
        </div>
        <div class="panel-loading">
          ${n.isConnected?"Loading Ethernet information...":"Connect to device to view Ethernet configuration"}
        </div>
      </div>
    `;const o=n.networksInfo.eth,r=n.ethStatus,s=r&&r.initialized?r:o&&o.mac?o:r||o,a=n.ethConfig||{},c=o!==null,l=n.networkInterfacesConfig?.ethernet===!1,d=s&&(s.mac||s.enabled||s.enable||s.initialized),u=s&&s.ip&&s.ip!=="0.0.0.0",p=s&&s.linkup===!0,g=u;if(!c)return html`
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
    `;const f=l?"status-disabled":g?"status-active":p?"status-warning":"status-inactive",h=l?"Disabled":g?"Connected":p?"Link Up (No IP)":d?"No Link":"Not Initialized";return html`
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
        
        ${d?html`
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">MAC Address:</span>
              <span class="info-value info-mono">${s.mac||"N/A"}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Status:</span>
              <span class="info-value ${s.enabled||s.enable?"status-yes":"status-no"}">
                ${s.enabled||s.enable?"Active":"Inactive"}
              </span>
            </div>
            <div class="info-item">
              <span class="info-label">Link:</span>
              <span class="info-value ${p?"status-yes":"status-no"}">
                ${p?"Cable Connected":"No Cable"}
              </span>
            </div>
            ${u?html`
              <div class="info-item">
                <span class="info-label">IP Address:</span>
                <span class="info-value info-mono">${s.ip||"0.0.0.0"}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Subnet Mask:</span>
                <span class="info-value info-mono">${s.mask||"0.0.0.0"}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Gateway:</span>
                <span class="info-value info-mono">${s.gateway||"0.0.0.0"}</span>
              </div>
              <div class="info-item">
                <span class="info-label">DNS Server:</span>
                <span class="info-value info-mono">${s.dns||"0.0.0.0"}</span>
              </div>
            `:""}
          </div>
        `:html`
          <div class="panel-message" style="margin: 16px 0;">
            <p>Ethernet interface is available but not initialized.</p>
          </div>
        `}
        
        <div class="config-actions" style="margin-top: 16px;">
          ${d?"":html`
            <button 
              class="primary-button" 
              onclick=${()=>i("init-ethernet")}
              disabled=${n.isInitializingEth}
            >
              ${n.isInitializingEth?"Initializing...":"Initialize Ethernet"}
            </button>
          `}
        </div>
      </div>
      
      ${a?html`
        <div class="panel-section">
          <div class="section-header">
            <h3 class="panel-section-title">Configuration</h3>
          </div>
          
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Auto-Enable:</span>
              <span class="info-value ${a.enabled!==!1?"status-yes":"status-no"}">
                ${a.enabled!==!1?"Yes":"No"}
              </span>
            </div>
            <div class="info-item">
              <span class="info-label">DHCP:</span>
              <span class="info-value ${a.dhcp!==!1?"status-yes":"status-no"}">
                ${a.dhcp!==!1?"Enabled":"Static IP"}
              </span>
            </div>
            <div class="info-item">
              <span class="info-label">PHY Type:</span>
              <span class="info-value">${a.phy_type||"Auto"}</span>
            </div>
            <div class="info-item">
              <span class="info-label">PHY Address:</span>
              <span class="info-value">${a.phy_addr!==void 0?a.phy_addr:"Auto"}</span>
            </div>
            ${a.pins?html`
              <div class="info-item">
                <span class="info-label">MDC Pin:</span>
                <span class="info-value">GPIO ${a.pins.mdc}</span>
              </div>
              <div class="info-item">
                <span class="info-label">MDIO Pin:</span>
                <span class="info-value">GPIO ${a.pins.mdio}</span>
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
  `}function VPNPanel(n,i){n.isConnected&&!n.vpnConfigLoaded&&!n.isLoadingVpnConfig&&i("load-vpn-config");const o=n.vpnConfig||{hostname:"",join_code:"",auto_connect:!1},r=n.networksInfo?.vpn,s=n.isConnected,a=n.networksInfo&&r!==void 0;!a||r.available;const c=a&&r.active;return html`
    <div class="panel-container">
      <div class="panel-header">
        <h2>VPN Configuration</h2>
      </div>
      
      <!-- Module not available warning (only show when connected and confirmed unavailable) -->
      ${s&&a&&!r.available?html`
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
            <span class="info-value info-mono">${c&&r?.ip?r.ip:"--"}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Hostname:</span>
            <span class="info-value">${r?.hostname||o.hostname||"--"}</span>
          </div>
        </div>
      </div>
      
      <!-- VPN Configuration Section -->
      <div class="panel-section">
        <div class="section-header">
          <h3 class="panel-section-title">Configuration</h3>
        </div>
        
        <form class="config-form" onsubmit=${l=>{l.preventDefault();const d=new FormData(l.target),u=d.get("hostname")||"",p=d.get("join_code")||"",g=d.get("auto_connect")==="on";if(!u.trim()){alert("Please enter a hostname for this device");return}if(!p.trim()){alert("Please enter a Husarnet join code");return}i("vpn-connect",{hostname:u.trim(),join_code:p.trim(),auto_connect:g})}}>
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
              value=${o.hostname||""}
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
              value=${o.join_code||""}
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
                ${o.auto_connect?"checked":""}
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
                onclick=${()=>i("vpn-disconnect")}
              >
                Disconnect VPN
              </button>
            `:html`
              <button type="submit" class="primary-button" disabled=${!s}>
                Connect to VPN
              </button>
              <button 
                type="button" 
                class="secondary-button" 
                disabled=${!s}
                onclick=${l=>{l.preventDefault();const d=l.target.closest("form"),u=new FormData(d);i("vpn-save-config",{hostname:u.get("hostname")||"",join_code:u.get("join_code")||"",auto_connect:u.get("auto_connect")==="on",enabled:!1})}}
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
        
        ${c&&r?.peers&&r.peers.length>0?html`
          <div class="peers-list">
            ${r.peers.map(l=>html`
              <div class="peer-item">
                <div class="peer-hostname">${l.hostname}</div>
                <div class="peer-ip info-mono">${l.ip}</div>
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
  `}function BTLEPanel(n,i){if(!n.networksInfo&&n.isConnected&&!n.isLoadingNetworks&&i("refresh-networks"),!n.networksInfo)return html`
      <div class="panel-container">
        <div class="panel-header">
          <h2>Bluetooth LE Configuration</h2>
        </div>
        <div class="panel-loading">
          ${n.isConnected?"Loading Bluetooth LE information...":"Connect to device to view Bluetooth LE configuration"}
        </div>
      </div>
    `;const o=n.networksInfo.ble;return o?html`
    <div class="panel-container">
      <div class="panel-header">
        <h2>Bluetooth LE Configuration</h2>
      </div>
      
      <div class="panel-section">
        <div class="section-header">
          <h3 class="panel-section-title">Bluetooth LE Interface</h3>
          <div class="status-badge ${o.active?"status-active":"status-inactive"}">
            ${o.active?"Active":"Inactive"}
          </div>
        </div>
        
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">MAC Address:</span>
            <span class="info-value info-mono">${o.mac||"N/A"}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Status:</span>
            <span class="info-value">${o.active?"Enabled":"Disabled"}</span>
          </div>
        </div>
        
        <div class="config-actions">
          <button class="secondary-button" onclick=${()=>alert("Bluetooth configuration coming soon")}>
            ${o.active?"Configure":"Enable Bluetooth"}
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
    `}function WWANPanel(n,i){if(n.isConnected&&!n.wwanConfigLoaded&&!n.isLoadingWwanConfig&&i("load-wwan-config"),n.isConnected&&!n.modemStatusLoaded&&!n.isLoadingModemStatus&&i("load-modem-status"),n.isConnected&&!n.networkInterfacesConfig&&!n.isLoadingNetworkInterfacesConfig&&i("load-network-interfaces-config"),n.networkInterfacesConfig?.wwan===!1)return html`
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
    `;const r=n.wwanConfig||{},s=n.modemStatus||{},a=s.ppp||{};let c="Disabled",l="status-disabled";return r.mobile_data_enabled&&(a.connected?(c="Connected",l="status-connected"):a.connecting?(c="Connecting...",l="status-connecting"):s.connected?(c="Standby (WiFi OK)",l="status-standby"):(c="Waiting for modem...",l="status-waiting")),html`
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
            <label class="toggle-switch ${a.connected?"ppp-active":a.connecting?"ppp-connecting":""}">
              <input 
                type="checkbox" 
                ${r.mobile_data_enabled?"checked":""}
                onchange=${d=>{d.target.checked?i("enable-mobile-data"):i("disable-mobile-data")}}
                disabled=${!n.isConnected}
              />
              <span class="toggle-slider"></span>
            </label>
            <span class="toggle-label">Enable Mobile Data</span>
          </div>
          
          <div class="status-row">
            <span class="status-label">Status:</span>
            <span class="status-value ${l}">${c}</span>
          </div>
          
          ${a.connected&&a.ip?html`
            <div class="ip-row">
              <span class="ip-label">IP Address:</span>
              <span class="ip-value">${a.ip}</span>
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
        
        <form class="config-form" onsubmit=${d=>{d.preventDefault();const u=new FormData(d.target),p={apn:u.get("apn")||"",username:u.get("username")||"",password:u.get("password")||"",auto_init_modem:u.get("auto_init_modem")==="on",mobile_data_enabled:r.mobile_data_enabled||!1};i("save-wwan-config",p)}}>
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
              value=${r.apn||""}
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
              value=${r.username||""}
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
              value=${r.password||""}
              placeholder="Optional"
            />
          </div>
          
          <div class="form-group">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                name="auto_init_modem" 
                ${r.auto_init_modem!==!1?"checked":""}
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
            <button type="submit" class="primary-button" disabled=${!n.isConnected}>
              Save Configuration
            </button>
          </div>
        </form>
      </div>
      
      ${n.isConnected?"":html`
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
  `}function MQTTPanel(n,i){n.isConnected&&!n.mqttConfigLoaded&&!n.isLoadingMqttConfig&&i("load-mqtt-config");const o=n.mqttConfig||{};return html`
    <div class="panel-container">
      <div class="panel-header">
        <h2>MQTT Configuration</h2>
      </div>
      
      <div class="panel-section">
        <div class="section-header">
          <h3 class="panel-section-title">MQTT Broker Settings</h3>
        </div>
        
        <form class="config-form" onsubmit=${r=>{r.preventDefault();const s=new FormData(r.target),a={server:s.get("server")||"",port:parseInt(s.get("port")||"1883"),username:s.get("username")||"",password:s.get("password")||"",tls:s.get("tls")==="on",ca_cert_path:s.get("ca_cert_path")||"",topic_prefix:s.get("topic_prefix")||""};if(!a.server){alert("Server address is required");return}i("save-mqtt-config",a)}}>
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
              value=${o.server||""}
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
              value=${o.port||1883}
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
              value=${o.username||""}
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
              value=${o.password||""}
              placeholder="Optional"
            />
          </div>
          
          <div class="form-group">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                name="tls" 
                ${o.tls?"checked":""}
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
              value=${o.ca_cert_path||""}
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
              value=${o.topic_prefix||"ovms/"}
              placeholder="e.g., ovms/username/vehicleid"
            />
          </div>
          
          <div class="config-actions">
            <button type="submit" class="primary-button" disabled=${!n.isConnected}>
              Save Configuration
            </button>
          </div>
        </form>
      </div>
      
      ${n.isConnected?"":html`
        <div class="panel-message">
          <p>Connect to device to configure MQTT settings.</p>
        </div>
      `}
    </div>
  `}function NTPPanel(n,i){n.isConnected&&!n.ntpConfigLoaded&&!n.isLoadingNtpConfig&&i("load-ntp-config");const o=n.ntpConfig||{server:"pool.ntp.org",tzOffset:0,timezone:"UTC",autoDetect:!1,autoSync:!1},r=n.ntpSyncResult||null,s=u=>{if(!u)return"--:--:--";const{year:p,month:g,day:f,hour:h,minute:m,second:v}=u;return`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(v).padStart(2,"0")}`},a=u=>{if(!u)return"";const{year:p,month:g,day:f}=u;return`${p}-${String(g).padStart(2,"0")}-${String(f).padStart(2,"0")}`},c=[{value:"UTC",offset:0,label:"UTC (Coordinated Universal Time)"},{value:"EST",offset:-5,label:"EST (Eastern Standard Time)"},{value:"CST",offset:-6,label:"CST (Central Standard Time)"},{value:"MST",offset:-7,label:"MST (Mountain Standard Time)"},{value:"PST",offset:-8,label:"PST (Pacific Standard Time)"},{value:"GMT",offset:0,label:"GMT (Greenwich Mean Time)"},{value:"CET",offset:1,label:"CET (Central European Time)"},{value:"EET",offset:2,label:"EET (Eastern European Time)"},{value:"JST",offset:9,label:"JST (Japan Standard Time)"},{value:"AEST",offset:10,label:"AEST (Australian Eastern Standard Time)"}],l=o.timezone,d=[...c];return l&&!c.find(u=>u.value===l)&&d.unshift({value:l,offset:o.tzOffset||0,label:`${l} (Detected)`}),html`
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
              ${r&&r.local?`${a(r.local)} ${s(r.local)}`:"--:--:--"}
            </span>
          </div>
          <div class="info-item">
            <span class="info-label">UTC Time:</span>
            <span class="info-value">
              ${r&&r.utc?`${a(r.utc)} ${s(r.utc)}`:"--:--:--"}
            </span>
          </div>
        </div>
        ${r?html`
          <p class="info-description" style="margin-top: 12px; font-size: 12px; color: var(--text-secondary);">
            Last synchronized: ${new Date(r.timestamp).toLocaleTimeString()}
          </p>
        `:""}
      </div>
      
      <div class="panel-section">
        <div class="section-header">
          <h3 class="panel-section-title">NTP Configuration</h3>
        </div>
        
        <form class="config-form" onsubmit=${async u=>{u.preventDefault();const p=new FormData(u.target),g=p.get("server")||"pool.ntp.org",f=p.get("timezone")||"UTC",h=p.get("auto_detect")==="on",m=p.get("auto_sync")==="on",v=d.find(S=>S.value===f),y=v?v.offset:0,b={server:g,tz_offset:y,timezone:f,auto_detect:h,auto_sync:m};try{await new Promise((S,C)=>{const k=setTimeout(()=>C(new Error("Save timeout")),1e4),w=()=>{clearTimeout(k),window.appInstance.emitter.removeListener("ntp-config-saved",_),window.appInstance.emitter.removeListener("ntp-config-save-error",x)},_=()=>{w(),S()},x=P=>{w(),C(P)};window.appInstance.emitter.once("ntp-config-saved",_),window.appInstance.emitter.once("ntp-config-save-error",x),i("save-ntp-config",b)}),i("sync-ntp-time",g,y,h,m)}catch(S){console.error("[NTP] Failed to save config before sync:",S),alert(`Failed to save NTP configuration: ${S.message}`)}}}>
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
              value=${o.server||"pool.ntp.org"}
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
              ${d.map(u=>html`
                <option value=${u.value} ${o.timezone===u.value?"selected":""}>
                  ${u.label}
                </option>
              `)}
            </select>
          </div>
          
          <div class="form-group">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                name="auto_detect"
                ${o.autoDetect?"checked":""}
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
                ${o.autoSync?"checked":""}
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
            <button type="submit" class="primary-button" disabled=${!n.isConnected}>
              Save
            </button>
          </div>
        </form>
      </div>
      
      ${n.isConnected?"":html`
        <div class="panel-message">
          <p>Connect to device to synchronize time.</p>
        </div>
      `}
    </div>
  `}function CANPanel(n,i){n.isConnected&&!n.canConfigLoaded&&!n.isLoadingCanConfig&&i("load-can-config");const o=n.canConfig||{bitrate:5e5,enabled:!0};return html`
    <div class="panel-container">
      <div class="panel-header">
        <h2>CAN/TWAI Configuration</h2>
      </div>
      
      <div class="panel-section">
        <div class="panel-section">
          <div class="section-header">
            <h3 class="panel-section-title">Protocol Settings</h3>
            <div class="status-badge ${o.enabled?"status-active":"status-inactive"}">
              ${o.enabled?"Enabled":"Disabled"}
            </div>
          </div>
          
          <form class="config-form" onsubmit=${async r=>{r.preventDefault();const s=new FormData(r.target),a={bitrate:parseInt(s.get("bitrate")||"500000"),enabled:s.get("enabled")==="on"};i("save-can-config",a)}}>
          <div class="form-group">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                name="enabled" 
                ${o.enabled?"checked":""}
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
              <option value="125000" ${o.bitrate===125e3?"selected":""}>125 kbps</option>
              <option value="250000" ${o.bitrate===25e4?"selected":""}>250 kbps</option>
              <option value="500000" ${o.bitrate===5e5?"selected":""}>500 kbps</option>
              <option value="1000000" ${o.bitrate===1e6?"selected":""}>1 Mbps</option>
            </select>
          </div>
          
          <div class="config-actions">
            <button type="submit" class="primary-button" disabled=${!n.isConnected}>
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
            <span class="info-value">${o.txPin!=null?"GPIO"+o.txPin:"Not configured"}</span>
          </div>
          <div class="info-item">
            <span class="info-label">RX Pin:</span>
            <span class="info-value">${o.rxPin!=null?"GPIO"+o.rxPin:"Not configured"}</span>
          </div>
        </div>
      </div>
      
      ${n.isConnected?"":html`
        <div class="panel-message">
          <p>Connect to device to configure CAN settings.</p>
        </div>
      `}
    </div>
  `}function GPSPanel(n,i){n.isConnected&&!n.gpsDataLoaded&&!n.isLoadingGpsData&&i("load-gps-data");const o=n.gpsData||{},r=o.latitude!==void 0&&o.longitude!==void 0,s=37.3349,a=-122.009,c=r?o.latitude:s,l=r?o.longitude:a;return html`
    <div class="panel-container">
      <div class="panel-header">
        <h2>GPS Location</h2>
      </div>
      
      ${n.isLoadingGpsData?html`
        <div class="panel-loading">
          Loading GPS data...
        </div>
      `:html`
        <div class="panel-section">
          <div class="section-header">
            <h3 class="panel-section-title">${r?"Current Location":"Map Display"}</h3>
            <div class="status-badge ${r?"status-active":"status-inactive"}">
              ${r?"GPS Fix Acquired":"No GPS Fix"}
            </div>
          </div>
          
          <!-- Map Container (always shown) -->
          <div class="gps-map-container">
            ${r?"":html`
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
              src=${`https://www.openstreetmap.org/export/embed.html?bbox=${l-.01},${c-.01},${l+.01},${c+.01}&layer=mapnik&marker=${c},${l}`}
            >
            </iframe>
            <br/>
            <small>
              <a 
                href=${`https://www.openstreetmap.org/?mlat=${c}&mlon=${l}&zoom=15`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Larger Map
              </a>
            </small>
          </div>
            
            <!-- GPS Information Grid -->
            <div class="info-grid" style="margin-top: 1rem;">
              ${r?html`
                <div class="info-item">
                  <span class="info-label">Latitude:</span>
                  <span class="info-value info-mono">${o.latitude.toFixed(6)}°</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Longitude:</span>
                  <span class="info-value info-mono">${o.longitude.toFixed(6)}°</span>
                </div>
              `:html`
                <div class="info-item">
                  <span class="info-label">Latitude:</span>
                  <span class="info-value info-mono" style="color: #999;">${c.toFixed(6)}° (default)</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Longitude:</span>
                  <span class="info-value info-mono" style="color: #999;">${l.toFixed(6)}° (default)</span>
                </div>
              `}
              ${o.altitude!==void 0?html`
                <div class="info-item">
                  <span class="info-label">Altitude:</span>
                  <span class="info-value">${o.altitude.toFixed(1)} m</span>
                </div>
              `:""}
              ${o.satellites!==void 0?html`
                <div class="info-item">
                  <span class="info-label">Satellites:</span>
                  <span class="info-value">${o.satellites}</span>
                </div>
              `:""}
              ${o.speed!==void 0?html`
                <div class="info-item">
                  <span class="info-label">Speed:</span>
                  <span class="info-value">${o.speed.toFixed(1)} km/h</span>
                </div>
              `:""}
              ${o.heading!==void 0?html`
                <div class="info-item">
                  <span class="info-label">Heading:</span>
                  <span class="info-value">${o.heading.toFixed(1)}°</span>
                </div>
              `:""}
              ${o.date?html`
                <div class="info-item">
                  <span class="info-label">Date:</span>
                  <span class="info-value info-mono">${formatDate(o.date)}</span>
                </div>
              `:""}
              ${o.time?html`
                <div class="info-item">
                  <span class="info-label">Time:</span>
                  <span class="info-value info-mono">${formatTime(o.time)}</span>
                </div>
              `:""}
            </div>
            
            <!-- Google Maps Link -->
            <div class="config-actions" style="margin-top: 1rem;">
              <a 
                href=${`https://www.google.com/maps?q=${c},${l}`}
                target="_blank"
                rel="noopener noreferrer"
                class="primary-button"
                style="text-decoration: none; display: inline-block;"
              >
                Open in Google Maps
              </a>
            </div>
          </div>
          
          ${r?"":html`
            <div class="panel-section" style="margin-top: 1rem;">
              <div class="section-header">
                <h3 class="panel-section-title">GPS Status</h3>
              </div>
              <p class="info-description">
                GPS is enabled but no fix has been acquired yet. This can take 30-60 seconds for a cold start.
                Make sure the GPS antenna has a clear view of the sky.
              </p>
              ${o.satellites!==void 0?html`
                <div class="info-grid" style="margin-top: 1rem;">
                  <div class="info-item">
                    <span class="info-label">Satellites in View:</span>
                    <span class="info-value">${o.satellites}</span>
                  </div>
                </div>
              `:""}
            </div>
          `}
      `}
      
      ${n.isConnected?"":html`
        <div class="panel-message">
          <p>Connect to device to view GPS location data.</p>
        </div>
      `}
    </div>
  `}function formatDate(n){if(!n||n.length!==6)return n;const i=n.substring(0,2),o=n.substring(2,4),r="20"+n.substring(4,6);return`${i}/${o}/${r}`}function formatTime(n){if(!n)return n;const i=n.indexOf("."),o=i!==-1?n.substring(0,i):n;if(o.length!==6)return n;const r=o.substring(0,2),s=o.substring(2,4),a=o.substring(4,6);return`${r}:${s}:${a}`}function ModemPanel(n,i){n.isConnected&&!n.modemStatusLoaded&&!n.isLoadingModemStatus&&i("load-modem-status");const o=n.modemStatus||{},r=o.info||{},s=o.signal||{},a=o.ppp||{},c=s.dbm,l=rssiToBars(c),d=rssiToQuality(c),u=getSignalColor(c);let p="Not detected",g="status-disconnected";return o.connected&&(a.connected?(p="PPP Active",g="status-ppp"):a.connecting?(p="PPP Connecting...",g="status-connecting"):(p="Connected (AT)",g="status-connected")),html`
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
          <span class="status-indicator ${g}"></span>
          <span class="status-text">${p}</span>
        </div>
        ${a.connected&&a.ip?html`
          <div class="ip-display">
            <span class="ip-label">IP Address:</span>
            <span class="ip-value">${a.ip}</span>
          </div>
        `:""}
      </div>
      
      <!-- Signal Strength -->
      <div class="panel-section">
        <div class="section-header">
          <h3 class="panel-section-title">Signal Strength</h3>
        </div>
        ${o.connected?html`
          <div class="signal-display">
            <div class="signal-bars">
              ${[1,2,3,4,5].map(f=>html`
                <div class="signal-bar ${f<=l?"active":""}" style="--bar-color: ${u}"></div>
              `)}
            </div>
            <div class="signal-info">
              ${c!=null&&c!==-999?html`
                <span class="signal-dbm" style="color: ${u}">${c} dBm</span>
                <span class="signal-quality">${d}</span>
              `:html`
                <span class="signal-unknown">Unknown</span>
              `}
            </div>
          </div>
          ${s.rssi!=null?html`
            <div class="signal-raw">
              <span>RSSI: ${s.rssi}</span>
              ${s.ber!=null?html`<span>BER: ${s.ber}</span>`:""}
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
        ${o.connected&&Object.keys(r).length>0?html`
          <div class="info-grid">
            ${r.manufacturer?html`
              <div class="info-row">
                <span class="info-label">Manufacturer</span>
                <span class="info-value">${r.manufacturer}</span>
              </div>
            `:""}
            ${r.model?html`
              <div class="info-row">
                <span class="info-label">Model</span>
                <span class="info-value">${r.model}</span>
              </div>
            `:""}
            ${r.revision?html`
              <div class="info-row">
                <span class="info-label">Revision</span>
                <span class="info-value">${r.revision}</span>
              </div>
            `:""}
            ${r.imei?html`
              <div class="info-row">
                <span class="info-label">IMEI</span>
                <span class="info-value mono">${r.imei}</span>
              </div>
            `:""}
            ${o.firmware?html`
              <div class="info-row">
                <span class="info-label">Firmware</span>
                <span class="info-value">${o.firmware}</span>
              </div>
            `:""}
          </div>
        `:html`
          <p class="no-data">${o.connected?"Loading...":"Modem not connected"}</p>
        `}
      </div>
      
      ${n.isConnected?"":html`
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
  `}function rssiToBars(n){return n==null||n===-999?0:n>=-70?5:n>=-80?4:n>=-90?3:n>=-100?2:n>=-110?1:0}function rssiToQuality(n){return n==null||n===-999?"Unknown":n>=-70?"Excellent":n>=-80?"Good":n>=-90?"Fair":n>=-100?"Poor":"Very Poor"}function getSignalColor(n){return n==null||n===-999?"var(--text-secondary)":n>=-70||n>=-80?"#22c55e":n>=-90||n>=-100?"#f59e0b":"#ef4444"}function SDCardPanel(n,i){const r=n.boardConfig?.hardware?.sdcard;n.isConnected&&!n.sdcardConfigLoaded&&!n.isLoadingSdcardConfig&&i("load-sdcard-config"),r&&n.isConnected&&!n.sdcardInfo&&!n.isLoadingSdcardInfo&&i("sdcard-get-info");const s=n.sdcardConfig||{mountPoint:"/sd",autoMount:!1};return n.isConnected?r?html`
    <div class="panel-container">
      <div class="panel-header">
        <h2>SD Card Configuration</h2>
        ${n.sdcardInfo&&!n.sdcardInfo.error?html`
          <button 
            class="refresh-button" 
            onclick=${()=>i("sdcard-unmount")}
            disabled=${!n.isConnected||n.isUnmountingSDCard}
            title="Unmount SD Card"
          >
            ${n.isUnmountingSDCard?"Unmounting...":"Unmount"}
          </button>
        `:html`
          <button 
            class="refresh-button" 
            onclick=${()=>i("sdcard-mount")}
            disabled=${!n.isConnected}
            title="Mount SD Card"
          >
            Mount
          </button>
        `}
      </div>
      
      ${BoardSDCardHardwareSection(r)}
      
      <div class="sdcard-layout">
        ${n.sdcardInfo?html`
          <div class="panel-section">
            <h3 class="panel-section-title">
              ${n.sdcardInfo.error?"SD Card Status":"Storage Information"}
            </h3>
            ${n.sdcardInfo.error?html`
              <div class="info-grid">
                <div class="info-item" style="grid-column: 1 / -1; border-left: 3px solid #dc3545;">
                  <span class="info-label">Not Mounted</span>
                  <span class="info-value">${n.sdcardInfo.error}</span>
                </div>
              </div>
            `:html`
              <div class="info-grid">
                ${n.sdcardInfo.cardCapacity?html`
                  <div class="info-item">
                    <span class="info-label">Card Capacity</span>
                    <span class="info-value">${formatBytes(n.sdcardInfo.cardCapacity)}</span>
                  </div>
                `:""}
                <div class="info-item">
                  <span class="info-label">Partition</span>
                  <span class="info-value">${formatBytes(n.sdcardInfo.totalSize)}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Free</span>
                  <span class="info-value">${formatBytes(n.sdcardInfo.freeSize)}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Used</span>
                  <span class="info-value">${formatBytes(n.sdcardInfo.usedSize)}</span>
                </div>
              </div>
            `}
          </div>
        `:n.isLoadingSdcardInfo?html`
          <div class="panel-section">
            <div class="panel-loading">Loading storage information...</div>
          </div>
        `:""}
        
        <div class="panel-section">
          <h3 class="panel-section-title">SD Card Settings</h3>
          <form class="config-form" onsubmit=${async a=>{a.preventDefault();const c=new FormData(a.target);i("save-sdcard-config",{mountPoint:c.get("mount_point")||"/sd",autoMount:c.get("auto_mount")==="on"})}}>
            <div class="form-group">
              <label for="sdcard-mount-point">
                Mount Point <span class="required">*</span>
                <span class="label-tooltip">
                  ${IconSprite.renderIcon("info-circle",{className:"label-tooltip-icon",size:16})}
                  <span class="tooltip">Filesystem mount point path (e.g., /sd)</span>
                </span>
              </label>
              <input type="text" id="sdcard-mount-point" name="mount_point" 
                value=${s.mountPoint||"/sd"} required placeholder="/sd" />
            </div>
            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" name="auto_mount" ${s.autoMount?"checked":""} />
                <span>Auto-mount on boot
                  <span class="label-tooltip">
                    ${IconSprite.renderIcon("info-circle",{className:"label-tooltip-icon",size:16})}
                    <span class="tooltip">Automatically mount SD card when device boots</span>
                  </span>
                </span>
              </label>
            </div>
            <div class="config-actions">
              <button type="submit" class="scriptos-update-btn">Save Settings</button>
            </div>
          </form>
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
    `}function BoardSDCardHardwareSection(n){if(!n)return"";const i=n.pins||{},o=n.power_control||{},r=n.mode||"SD";let s=n.bus_width||1;n.bus_width||(i.d3!==void 0?s=4:i.d0!==void 0?s=1:r==="SD"&&(s=4));const a=r==="SD"?"SDMMC":r;return html`
    <div class="panel-section">
      <div class="section-header">
        <h3 class="panel-section-title">Board Hardware Configuration</h3>
      </div>
      
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">Mode:</span>
          <span class="info-value">${a}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Width:</span>
          <span class="info-value">${s}-bit</span>
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
            ${o.pin!==void 0?html`
              <div class="info-item">
                <span class="info-label">Power:</span>
                <span class="info-value info-mono">GPIO ${o.pin} ${o.active_low?"(Active Low)":"(Active High)"}</span>
              </div>
            `:""}
          </div>
        </details>
      </div>
    </div>
  `}function formatBytes(n){if(!n||n===0)return"0 B";const i=1024,o=["B","KB","MB","GB"],r=Math.floor(Math.log(n)/Math.log(i));return Math.round(n/Math.pow(i,r)*100)/100+" "+o[r]}const GITHUB_RELEASES_API="https://api.github.com/repos/jetpax/pyDirect/releases",CORS_PROXIES=["https://api.codetabs.com/v1/proxy?quest=","https://corsproxy.io/?","https://api.allorigins.win/raw?url="],IS_DEV=import.meta?.env?.DEV||window.location.hostname==="localhost";function getProxiedUrl(n){return IS_DEV&&n.startsWith("https://github.com/")?n.replace("https://github.com","/github-releases"):n}const CHIP_FIRMWARE_MAP={"ESP32-S3":"ESP32_S3","ESP32-P4":"ESP32_P4","ESP32-S2":"ESP32_S2","ESP32-C3":"ESP32_C3","ESP32-C6":"ESP32_C6",ESP32:"ESP32"};async function fetchReleases(){try{const n=await fetch(GITHUB_RELEASES_API);if(!n.ok)throw new Error(`GitHub API error: ${n.status}`);return(await n.json()).filter(o=>!o.draft).map(o=>({id:o.id,name:o.name||o.tag_name,tag:o.tag_name,published:o.published_at,prerelease:o.prerelease,assets:o.assets.filter(r=>r.name.startsWith("pyDirect-")&&r.name.endsWith("-merged.bin")).map(r=>({name:r.name,size:r.size,downloadUrl:r.browser_download_url}))})).filter(o=>o.assets.length>0)}catch(n){throw console.error("[firmware-flasher] Failed to fetch releases:",n),n}}async function getLatestRelease(){const n=await fetchReleases();return n.find(o=>!o.prerelease)||n[0]||null}function getFirmwareDisplayName(n,i){let o=n.replace(/_/g," ");if(i){const r=(i/1024/1024).toFixed(1);o+=` (${r} MB)`}return o}function findAllFirmwareForChip(n,i){const o=CHIP_FIRMWARE_MAP[i];return o?n.assets.filter(s=>{const a=s.name.match(/^pyDirect-(.+)-merged\.bin$/);if(!a)return!1;const c=a[1];return!!(c.startsWith(o)||i==="ESP32-S3"&&(c==="RetroVMS_Mini"||c.includes("S3"))||i==="ESP32-P4"&&c.includes("P4"))}).map(s=>{const a=s.name.match(/^pyDirect-(.+)-merged\.bin$/),c=a?a[1]:s.name;return{...s,productId:c,displayName:getFirmwareDisplayName(c,s.size)}}):(console.warn(`[firmware-flasher] No firmware mapping for chip: ${i}`),[])}function findFirmwareForChip(n,i,o=null){const r=findAllFirmwareForChip(n,i);if(r.length===0)return null;let s=r[0];const a=o?parseInt(o):0;if(a&&i==="ESP32-S3"&&a>=16){const c=r.find(l=>l.productId==="ESP32_S3_16MB");c&&(s=c)}if(a&&i==="ESP32-P4"&&a>=32){const c=r.find(l=>l.productId==="Waveshare_P4_POE"||l.productId==="ESP32_P4_32");c&&(s=c)}return s}async function downloadFirmware(n,i=()=>{}){let o;const r=getProxiedUrl(n);r!==n&&console.log("[firmware-flasher] Using Vite dev proxy for download");try{if(o=await fetch(r),!o.ok)throw new Error(`HTTP ${o.status}`)}catch(a){console.log("[firmware-flasher] Direct download failed:",a.message,"- trying CORS proxies");let c;for(const l of CORS_PROXIES)try{if(console.log("[firmware-flasher] Trying proxy:",l),o=await fetch(l+encodeURIComponent(n)),o.ok){console.log("[firmware-flasher] Proxy succeeded:",l);break}c=new Error(`HTTP ${o.status}`)}catch(d){c=d,console.log("[firmware-flasher] Proxy failed:",l,d.message)}if(!o||!o.ok)throw console.error("[firmware-flasher] All proxies failed"),new Error(`Failed to fetch firmware: ${c?.message||"All proxies failed"}`)}try{const a=o.headers.get("content-length"),c=a?parseInt(a,10):0;if(console.log(`[firmware-flasher] Content-Length: ${a||"unknown"}, starting download...`),!o.body){console.log("[firmware-flasher] Using non-streaming fallback");const h=await o.arrayBuffer();return i(100),h}const l=o.body.getReader(),d=[];let u=0,p=Date.now();for(;;){const{done:h,value:m}=await l.read();if(h)break;if(d.push(m),u+=m.length,c>0)i(Math.round(u/c*100));else if(Date.now()-p>500){console.log(`[firmware-flasher] Downloaded ${(u/1024/1024).toFixed(1)} MB...`),p=Date.now();const y=10+u/1e6%80;i(Math.round(y))}}const g=new Uint8Array(u);let f=0;for(const h of d)g.set(h,f),f+=h.length;return console.log(`[firmware-flasher] Downloaded ${u} bytes (${(u/1024/1024).toFixed(1)} MB)`),i(100),g.buffer}catch(a){throw console.error("[firmware-flasher] Download error:",a),a}}function showStyledModal({variant:n="",icon:i,title:o,subtitle:r,body:s,buttons:a}){const c=l=>l?l.includes("<")||/[\u{1F300}-\u{1F9FF}]/u.test(l)?l:`<svg class="icon icon-tabler" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><use href="#tabler-${l}"></use></svg>`:"";return new Promise(l=>{const d=document.createElement("div");d.className="fw-modal-overlay active",d.innerHTML=`
      <div class="fw-styled-modal">
        <div class="fw-styled-modal-header ${n?`fw-styled-modal-header--${n}`:""}">
          <div class="fw-styled-modal-icon">${c(i)}</div>
          <h2>${o}</h2>
          <p>${r}</p>
        </div>
        <div class="fw-styled-modal-content">
          <div class="fw-styled-modal-card">${s}</div>
          ${a.map(u=>`<button class="${u.class}" data-id="${u.id}">${u.icon||""}${u.label}</button>`).join("")}
        </div>
      </div>`,document.body.appendChild(d),a.forEach(u=>{d.querySelector(`[data-id="${u.id}"]`).addEventListener("click",()=>{d.remove(),l(u.id)})})})}function updateModalBody(n){const i=document.querySelector(".fw-styled-modal-card");i&&(i.innerHTML=n)}function closeStyledModal(){const n=document.querySelector(".fw-modal-overlay.active");n&&n.remove()}let currentPort=null,currentLoader=null,detectedChipName="",detectedMacAddress="",isBlankDevice=!0,ESPLoader=null,appState=null,panelState={view:"connect",deviceInfo:null,releases:[],selectedFirmware:null,flashProgress:0,wifiNetworks:[],selectedNetwork:null,credentials:null,logs:[{message:"> Ready",type:"info",timestamp:new Date().toLocaleTimeString()}],isFlashing:!1,isScanning:!1,terminalCollapsed:!1,reblessComplete:!1,reblessHostname:null,flashStep:"select",currentRelease:null,firmwareOptions:[],flashComplete:!1,isNewDeviceFlow:!1};function addLog(n,i="info"){panelState.logs.push({message:`> ${n}`,type:i,timestamp:new Date().toLocaleTimeString()}),panelState.logs.length>100&&(panelState.logs=panelState.logs.slice(-100)),triggerRerender()}function clearLog(){panelState.logs=[]}function triggerRerender(){document.dispatchEvent(new CustomEvent("firmware-panel-update"))}async function pulseReset(n){await n.setSignals({dataTerminalReady:!1,requestToSend:!1}),await new Promise(i=>setTimeout(i,50)),await n.setSignals({dataTerminalReady:!1,requestToSend:!0}),await new Promise(i=>setTimeout(i,100)),await n.setSignals({dataTerminalReady:!1,requestToSend:!1}),await new Promise(i=>setTimeout(i,100))}async function transitionToREPL(){currentLoader&&(await currentLoader.disconnect(),currentLoader=null,await new Promise(l=>setTimeout(l,100))),await currentPort.close(),await new Promise(l=>setTimeout(l,100)),await currentPort.open({baudRate:115200}),addLog("Resetting device..."),await pulseReset(currentPort),addLog("Waiting for System booting...");const n=currentPort.readable.getReader(),i=new TextDecoder;let o="";const r=Date.now();let s=!1,a=null;const c=[{pattern:/invalid header: 0x[0-9a-fA-F]+/i,message:"Invalid firmware header - incompatible image for this device"},{pattern:/flash read err/i,message:"Flash read error - firmware may be corrupted"},{pattern:/ets_main\.c/i,message:"Boot failure - firmware not recognized"},{pattern:/rst:0x10.*boot:0x[0-9a-f]+.*invalid/i,message:"Boot loop detected - firmware incompatible"}];for(;Date.now()-r<8e3;){const{value:l,done:d}=await n.read();if(d)break;if(l){o+=i.decode(l);for(const{pattern:u,message:p}of c)if(u.test(o)){a=p,console.log("[transitionToREPL] Boot error detected:",o);break}if(a)break;if(o.includes("System booting...")){s=!0,addLog("System booting detected","success"),n.releaseLock();const u=currentPort.writable.getWriter();await u.write(new Uint8Array([3,3,3])),await new Promise(p=>setTimeout(p,30)),await u.write(new Uint8Array([3,3])),u.releaseLock(),addLog("Interrupting to enter REPL...");break}}}if(!s)try{n.releaseLock()}catch{}if(a)return addLog(a,"error"),{success:!1,error:a,bootOutput:o};if(!s){addLog("No boot signature detected","error");const l=currentPort.writable.getWriter();return await l.write(new Uint8Array([3,3])),l.releaseLock(),{success:!1,error:"No boot signature from device - firmware may be incompatible",bootOutput:o}}await new Promise(l=>setTimeout(l,200)),addLog("Entering REPL mode...");try{const l=currentPort.readable.getReader(),d=setTimeout(()=>l.cancel(),500);try{for(;;){const{value:u,done:p}=await l.read();if(p)break}}catch{}clearTimeout(d),l.releaseLock()}catch(l){console.log("[DRAIN] Error:",l)}return addLog("REPL ready"),{success:!0}}async function handleBootFailure(n){await showStyledModal({variant:"danger",icon:'<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',title:"Boot Failure Detected",subtitle:"Incompatible firmware image",body:`<p><strong>${n}</strong></p><p>The device could not boot. This typically happens when the wrong firmware variant is flashed.</p>`,buttons:[{id:"reflash",class:"fw-styled-modal-btn-primary",icon:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" style="margin-right:0.5rem"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>',label:"Return to Bootloader"},{id:"close",class:"fw-styled-modal-btn-cancel",label:"Close"}]})==="reflash"&&(addLog("Returning to bootloader mode..."),addLog('Ready for re-flash. Select "Onboard New Device" to flash correct firmware.',"success")),panelState.view="scenarios",triggerRerender()}async function sendREPLCommand(n,i,o=15e3,r=!0){const s=n.writable.getWriter();try{const a=i.split(`
`).filter(m=>m.trim().length>0),c=Math.min(...a.map(m=>{const v=m.match(/^(\s*)/);return v?v[1].length:0})),l=a.map(m=>m.slice(c)).join(`
`);r&&(await s.write(new Uint8Array([1])),await new Promise(m=>setTimeout(m,100)));const d=new TextEncoder().encode(l),u=64;for(let m=0;m<d.length;m+=u){const v=d.slice(m,Math.min(m+u,d.length));await s.write(v),await new Promise(y=>setTimeout(y,10))}await new Promise(m=>setTimeout(m,50)),await s.write(new Uint8Array([4])),s.releaseLock();const p=n.readable.getReader();let g="";const f=new TextDecoder,h=Date.now();for(;Date.now()-h<o;){const{value:m,done:v}=await p.read();if(v||m&&(g+=f.decode(m),g.includes("OK")&&g.endsWith(">")))break}return p.releaseLock(),g}catch(a){try{s.releaseLock()}catch{}throw a}}const USB_BRIDGE_DB={6790:{vendorName:"QinHeng Electronics",products:{29986:{name:"CH340",maxBaudrate:460800},29987:{name:"CH340",maxBaudrate:460800},21971:{name:"CH343",maxBaudrate:6e6},21972:{name:"CH9102",maxBaudrate:6e6}}},4292:{vendorName:"Silicon Labs",products:{6e4:{name:"CP2102(n)",maxBaudrate:3e6},60016:{name:"CP2105",maxBaudrate:2e6}}},1027:{vendorName:"FTDI",products:{24577:{name:"FT232R",maxBaudrate:3e6},24592:{name:"FT2232",maxBaudrate:3e6},24597:{name:"FT230X",maxBaudrate:3e6}}},12346:{vendorName:"Espressif Systems",products:{2:{name:"ESP32-S2 Native USB",maxBaudrate:2e6},4097:{name:"ESP32 Native USB",maxBaudrate:2e6},16386:{name:"ESP32 Native USB (CDC)",maxBaudrate:2e6}}}},JEDEC_MANUFACTURERS={1:"Spansion/Infineon",11:"Samsung",28:"Eon/Puya",32:"Micron",104:"Atmel/Adesto",133:"Fudan",157:"ISSI",191:"Microchip/SST",194:"Macronix",200:"GigaDevice",239:"Winbond"},JEDEC_FLASH_PARTS={239:{16406:"W25Q32 (32 Mbit)",16407:"W25Q64 (64 Mbit)",16408:"W25Q128 (128 Mbit)",16409:"W25Q256 (256 Mbit)"},200:{16406:"GD25Q32 (32 Mbit)",16407:"GD25Q64 (64 Mbit)",16408:"GD25Q128 (128 Mbit)",16409:"GD25Q256 (256 Mbit)"},194:{16406:"MX25L3206 (32 Mbit)",16407:"MX25L6406 (64 Mbit)",16408:"MX25L12835 (128 Mbit)"}};function getUsbBridgeInfo(n){try{const i=n.getInfo?.();if(!i||typeof i.usbVendorId!="number")return null;const o=i.usbVendorId,r=i.usbProductId,s=USB_BRIDGE_DB[o];if(!s)return`Unknown (0x${o.toString(16).padStart(4,"0")})`;const a=s.products[r];return a?`${s.vendorName} - ${a.name} (0x${r.toString(16).toUpperCase()})`:`${s.vendorName} (0x${r?.toString(16).padStart(4,"0")||"????"})`}catch(i){return console.log("[getUsbBridgeInfo] Error:",i),null}}function getFlashDeviceInfo(n){if(!n||typeof n!="number")return null;const i=n&255,o=n>>8&255,r=n>>16&255,s=o<<8|r,a=JEDEC_MANUFACTURERS[i],c=JEDEC_FLASH_PARTS[i]?.[s];return a&&c?`${a} ${c}`:a?`${a} (0x${s.toString(16).toUpperCase()})`:`0x${n.toString(16).padStart(6,"0").toUpperCase()}`}async function detectHardware(n){ESPLoader||(ESPLoader=(await __vitePreload(()=>import("./tasmota-esptool.bundle-CejzY9o0.js"),[])).ESPLoader,console.log("[firmware-panel] ESPLoader module loaded"));const i={log:p=>console.log(p),debug:p=>console.debug(p),error:p=>console.error(p)},o=new ESPLoader(n,i),r=getUsbBridgeInfo(n);await o.initialize();const s=o.chipName||"Unknown";console.log("Connected to chip:",s);const a=o.macAddr(),c=Array.isArray(a)&&a.length>=6?a.slice(0,6).map(p=>p.toString(16).padStart(2,"0")).join(":"):"Unknown";let l="Unknown",d=null,u=115200;try{console.log("Running stub...");const p=await o.runStub();await p.detectFlashSize(),l=p.flashSize||"Unknown",console.log("Flash size detected:",l);try{const g=await p.flashId?.();g&&(d=getFlashDeviceInfo(g),console.log("Flash device:",d))}catch(g){console.log("Flash ID detection not available:",g)}u=p.transport?.baudrate||921600,currentLoader=p}catch(p){console.warn("Stub/Feature detection failed:",p),l="Detection Failed",currentLoader=o}return{chipName:s,flashSizeMB:l,macAddress:c,usbBridge:r,flashDevice:d,connectionBaud:u}}async function handleConnect(){try{currentLoader&&(await currentLoader.disconnect(),currentLoader=null),currentPort&&(await currentPort.close(),currentPort=null)}catch(n){console.log("Cleanup previous connection:",n)}try{clearLog(),addLog("Requesting serial port..."),currentPort=await navigator.serial.requestPort({}),await currentPort.open({baudRate:115200}),addLog("Port opened"),addLog("Detecting hardware...");const n=await detectHardware(currentPort);detectedChipName=n.chipName,detectedMacAddress=n.macAddress,addLog(`Detected: ${detectedChipName}`),addLog(`MAC: ${detectedMacAddress}`),panelState.deviceInfo={chipName:detectedChipName,mac:detectedMacAddress,flashSize:n.flashSizeMB,usbBridge:n.usbBridge,flashDevice:n.flashDevice,connectionBaud:n.connectionBaud},isBlankDevice=!0,panelState.view="scenarios",addLog("Device connected - select an action"),appState&&(appState.connectionMode="usb"),triggerRerender()}catch(n){console.error("[firmware-panel]",n),addLog(`Error: ${n.message}`,"error");try{currentPort&&await currentPort.close()}catch{}currentPort=null,currentLoader=null,triggerRerender()}}async function handleDisconnect(){try{if(currentLoader&&(await currentLoader.disconnect(),currentLoader=null),currentPort){try{await pulseReset(currentPort)}catch(n){console.log("[handleDisconnect] Reset error:",n)}await currentPort.close(),currentPort=null}}catch{}panelState.view="connect",panelState.deviceInfo=null,detectedChipName="",detectedMacAddress="",isBlankDevice=!0,appState&&(appState.connectionMode=null),clearLog(),addLog("Disconnected"),triggerRerender()}async function resetAndClosePort(){try{if(currentLoader&&(await currentLoader.disconnect(),currentLoader=null),currentPort){try{await pulseReset(currentPort)}catch(n){console.log("[resetAndClosePort] Reset error:",n)}await currentPort.close(),currentPort=null}}catch(n){console.log("[resetAndClosePort] Error:",n)}}function selectScenario(n){addLog(`Selected: ${n}`),panelState.view=n,n==="new-device"?loadFirmwareOptions():n==="forgot-credentials"?readCredentials():n==="change-wifi"?performWifiSetup():n==="re-provision"&&startRebless(),triggerRerender()}function goBack(){panelState.flashStep="select",panelState.flashComplete=!1,panelState.flashProgress=0,panelState.view="scenarios",triggerRerender()}async function loadFirmwareOptions(){try{addLog("Loading firmware options..."),panelState.flashStep="select",panelState.firmwareOptions=[],triggerRerender();const n=await getLatestRelease();if(!n){addLog("No firmware releases found","error");return}panelState.currentRelease=n,addLog(`Found release: ${n.name}`);const i=panelState.deviceInfo?.chipName?.includes("ESP32-S3")?"ESP32-S3":panelState.deviceInfo?.chipName?.includes("ESP32-P4")?"ESP32-P4":panelState.deviceInfo?.chipName?.includes("ESP32-C3")?"ESP32-C3":panelState.deviceInfo?.chipName?.includes("ESP32")?"ESP32":null;if(!i){addLog("Unknown chip family - cannot select firmware","error");return}const o=findAllFirmwareForChip(n,i);if(o.length===0){addLog(`No firmware available for ${i}`,"error");return}panelState.firmwareOptions=o;const r=panelState.deviceInfo?.flashSize,s=findFirmwareForChip(n,i,r);panelState.selectedFirmware=s||o[0],addLog(`Found ${o.length} firmware option(s)`),addLog(`Selected: ${panelState.selectedFirmware.displayName||panelState.selectedFirmware.name}`),triggerRerender()}catch(n){addLog(`Error: ${n.message}`,"error"),triggerRerender()}}async function startFlash(){if(!currentLoader){addLog("Error: No device connected","error");return}if(!panelState.selectedFirmware){addLog("Error: No firmware selected","error");return}if(!confirm(`⚠️ FLASH FIRMWARE ⚠️

This will ERASE all data on the device and install:
${panelState.selectedFirmware.name}

Any existing scripts, settings, and certificates will be PERMANENTLY DELETED.

Are you sure you want to continue?`)){addLog("Flash cancelled by user");return}try{panelState.flashStep="downloading",panelState.flashProgress=0,triggerRerender(),addLog(`Downloading ${panelState.selectedFirmware.name}...`);const i=await downloadFirmware(panelState.selectedFirmware.downloadUrl,o=>{panelState.flashProgress=o,o%20===0&&addLog(`Download: ${o}%`),triggerRerender()});addLog(`Downloaded ${(i.byteLength/1024/1024).toFixed(1)} MB`),panelState.flashStep="flashing",panelState.flashProgress=0,triggerRerender(),addLog("Syncing with device...");try{await currentLoader.sync()}catch{await currentLoader.initialize()}addLog("Flashing firmware...");try{await currentLoader.flashData(i,(o,r)=>{const s=Math.floor(o/r*100);panelState.flashProgress=s,s%10===0&&addLog(`Progress: ${s}%`),triggerRerender()},0,!0)}catch(o){if((o?.message||String(o)).includes("Timed out")&&panelState.flashProgress>=95)addLog("Flash complete (device rebooted)");else throw o}addLog("✓ Flash complete!","success");try{await currentLoader.disconnect()}catch{}currentLoader=null,panelState.flashStep="complete",panelState.flashComplete=!0,panelState.terminalCollapsed=!0,triggerRerender()}catch(i){console.error("[firmware-panel] Flash error:",i),addLog(`Flash failed: ${i.message}`,"error"),panelState.flashStep="select";try{currentPort&&await currentPort.close()}catch{}currentPort=null,currentLoader=null,triggerRerender()}}async function proceedToWifiSetup(){addLog("Proceeding to WiFi setup..."),panelState.flashStep="select",panelState.flashComplete=!1,panelState.flashProgress=0,panelState.isNewDeviceFlow=!0,panelState.view="change-wifi";try{if(!currentPort){addLog("Please reconnect device"),panelState.view="connect",triggerRerender();return}performWifiSetup()}catch(n){addLog(`Error: ${n.message}`,"error")}triggerRerender()}async function readCredentials(){try{addLog("Reading credentials from device...");const n=await transitionToREPL();if(!n.success){await handleBootFailure(n.error);return}const o=(await sendREPLCommand(currentPort,`
import json
from lib.sys import settings
hostname = settings.get("device.hostname", "unknown")
password = settings.get("server.webrepl_password", "not set")
ssid = settings.get("wifi.ssid", "not set")
print("CREDS:" + json.dumps({"h": hostname, "p": password, "s": ssid}))
`)).match(/CREDS:(\{.*\})/);if(o){const r=JSON.parse(o[1]);panelState.credentials={hostname:r.h+".local",password:r.p,ssid:r.s},addLog(`Found: ${r.h}.local`,"success")}else throw new Error("Could not read settings - device may need firmware");triggerRerender()}catch(n){addLog(`Error: ${n.message}`,"error"),triggerRerender()}}async function performWifiSetup(){clearLog();try{let l=function(d){return new Promise((u,p)=>{const g=document.createElement("div");g.className="fw-modal-overlay active",g.innerHTML=`
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
              ${d.map((v,y)=>`
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
        `,document.body.appendChild(g);const f=v=>{const y=v.target.closest(".fw-modal-network-item");if(y){const b=parseInt(y.dataset.index);m(),u(b)}},h=()=>{m(),p(new Error("Setup cancelled"))},m=()=>{g.remove()};g.querySelector(".fw-network-modal-list").addEventListener("click",f),g.querySelector(".fw-modal-cancel").addEventListener("click",h)})};addLog("Connecting to REPL...");const n=await transitionToREPL();if(!n.success){await handleBootFailure(n.error);return}addLog("Scanning for WiFi networks...");const o=(await sendREPLCommand(currentPort,`
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
`)).match(/JSON:(\[.*\])/);if(!o)throw new Error("Failed to parse network scan - no JSON found");let r;try{r=JSON.parse(o[1])}catch(d){throw new Error("Failed to parse network JSON: "+d.message)}if(r.length===0)throw new Error("No WiFi networks found");addLog(`Found ${r.length} networks`);let s=!1,a=null,c=null;for(;!s;){const d=await l(r),u=r[d],p=prompt(`Enter password for "${u.ssid}":`);if(p===null)continue;addLog(`Connecting to "${u.ssid}"...`);const f=(await sendREPLCommand(currentPort,`
import time
try:
    wlan.disconnect()
except:
    pass
time.sleep(0.3)
wlan.connect('${u.ssid}', '${p}')
for i in range(20):
    if wlan.isconnected():
        ip = wlan.ifconfig()[0]
        print(f"CONNECTED:{ip}")
        break
    time.sleep(0.5)
else:
    print("FAILED:timeout")
`,15e3,!1)).match(/CONNECTED:(\d+\.\d+\.\d+\.\d+)/);if(f){a=f[1],s=!0,addLog(`Connected! IP: ${a}`),addLog("Saving settings...");const m=`pydirect-${panelState.deviceInfo?.mac?panelState.deviceInfo.mac.replace(/:/g,"").slice(-4).toLowerCase():"xxxx"}`;if(await sendREPLCommand(currentPort,`
from lib.sys import settings
settings.set("wifi.ssid", "${u.ssid}")
settings.set("wifi.password", "${p}")
settings.set("server.https_enabled", True)
settings.set("device.hostname", "${m}")
settings.save()
print("SETTINGS_OK")
`,5e3,!1),addLog(`Settings saved (hostname: ${m})`,"success"),panelState.isNewDeviceFlow){panelState.isNewDeviceFlow=!1,panelState.savedHostname=m,addLog("Continuing to certificate generation..."),await continueToProvision(m);return}panelState.view="scenarios",triggerRerender();return}else if(addLog("Connection failed"),!confirm(`WiFi connection failed. Wrong password?

Click OK to try again, or Cancel to abort.`))throw new Error("Connection cancelled")}}catch(n){addLog(`Error: ${n.message}`,"error"),triggerRerender()}}async function continueToProvision(n){try{const i=n+".local";addLog("Generating HTTPS certificate..."),window.forge||await new Promise((a,c)=>{const l=document.createElement("script");l.src="https://cdn.jsdelivr.net/npm/node-forge@1.3.1/dist/forge.min.js",l.onload=a,l.onerror=()=>c(new Error("Failed to load forge")),document.head.appendChild(l)}),addLog(`Hostname: ${i}`);const{certPem:o,keyPem:r}=generateSelfSignedCert(i);addLog(`Certificate generated (${o.length} bytes)`),addLog("Installing certificate..."),await uploadCertsToDevice(currentPort,o,r),addLog("Enabling setup mode..."),await sendREPLCommand(currentPort,`
from lib.sys import settings
settings.set("setup_mode", True)
settings.save()
print("SETUP_MODE_SET")
`,5e3,!1),addLog("Resetting device..."),await sendREPLCommand(currentPort,"import machine; machine.reset()",1e3,!1);try{await currentPort.close()}catch{}currentPort=null,addLog("Device is restarting and connecting to WiFi...","success");const s=`https://${i}/setup`;showSecurityWarningModal(i,s)}catch(i){addLog(`Error: ${i.message}`,"error"),triggerRerender()}}async function startRebless(){try{addLog("Starting re-provisioning...");const n=await transitionToREPL();if(!n.success){await handleBootFailure(n.error);return}addLog("Reading device settings...");const o=(await sendREPLCommand(currentPort,`
from lib.sys import settings
print("HOST:" + settings.get("device.hostname", "pydirect-xxxx"))
`)).match(/HOST:(.+)/),r=o?o[1].trim():"pydirect-new";addLog(`Generating new certificate for ${r}.local...`),window.forge||await new Promise((d,u)=>{const p=document.createElement("script");p.src="https://cdn.jsdelivr.net/npm/node-forge@1.3.1/dist/forge.min.js",p.onload=d,p.onerror=u,document.head.appendChild(p)});const s=r+".local",{certPem:a,keyPem:c}=generateSelfSignedCert(s);addLog("Installing new certificate..."),await uploadCertsToDevice(currentPort,a,c),addLog("Enabling setup mode..."),await sendREPLCommand(currentPort,`
from lib.sys import settings
settings.set("setup_mode", True)
settings.save()
print("SETUP_MODE_SET")
`,5e3,!1),addLog("Resetting device..."),await sendREPLCommand(currentPort,"import machine; machine.reset()",1e3,!1);try{await currentPort.close()}catch{}currentPort=null,addLog("Device is restarting and connecting to WiFi...","success");const l=`https://${s}/setup`;showSecurityWarningModal(s,l)}catch(n){addLog(`Error: ${n.message}`,"error"),triggerRerender()}}async function showSecurityWarningModal(n,i){const o=window.matchMedia("(display-mode: standalone)").matches||window.navigator.standalone===!0||document.referrer.includes("android-app://"),r=await showStyledModal({icon:'<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>',title:"Accept Security Warning",subtitle:"Your device has new certificates",body:o?'<p>Your device is <strong>restarting</strong> and connecting to WiFi.</p><p>When you connect, click <strong>"Advanced"</strong> → <strong>"Proceed"</strong> to trust your device.</p>':'<p>Your device is <strong>restarting</strong> and connecting to WiFi.</p><p>When the browser opens, click <strong>"Advanced"</strong> → <strong>"Proceed"</strong> to trust your device.</p>',buttons:[{id:"connect",class:"fw-styled-modal-btn-primary",icon:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" style="margin-right:0.5rem"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',label:`Connect to ${n}`},{id:"cancel",class:"fw-styled-modal-btn-cancel",label:"Cancel"}]});panelState.view="scenarios",panelState.reblessComplete=!1,triggerRerender(),r==="connect"&&(o?window.location.href=i:window.open(i,"_blank"))}function generateSelfSignedCert(n,i=10){const o=forge.pki.rsa.generateKeyPair(2048),r=forge.pki.createCertificate();r.publicKey=o.publicKey,r.serialNumber="01",r.validity.notBefore=new Date,r.validity.notAfter=new Date,r.validity.notAfter.setFullYear(r.validity.notBefore.getFullYear()+i);const s=[{name:"commonName",value:n}];return r.setSubject(s),r.setIssuer(s),r.setExtensions([{name:"subjectAltName",altNames:[{type:2,value:n}]}]),r.sign(o.privateKey,forge.md.sha256.create()),{certPem:forge.pki.certificateToPem(r),keyPem:forge.pki.privateKeyToPem(o.privateKey)}}async function uploadCertsToDevice(n,i,o){addLog("Creating /certs directory..."),await sendREPLCommand(n,`
import os
try:
    os.mkdir('/certs')
except OSError:
    pass
print('DIR_OK')
`,3e3,!1),addLog("Writing certificate...");const r=btoa(i);await sendREPLCommand(n,`
import binascii
with open('/certs/servercert.pem', 'wb') as f:
    f.write(binascii.a2b_base64('${r}'))
print('CERT_OK')
`,5e3,!1),addLog("Writing private key...");const s=btoa(o);await sendREPLCommand(n,`
with open('/certs/prvtkey.pem', 'wb') as f:
    f.write(binascii.a2b_base64('${s}'))
print('KEY_OK')
`,5e3,!1),addLog("Certificates installed!")}function FirmwarePanel(n,i){appState=n;const o=panelState.view;return html$1`
    <div class="firmware-panel">
      ${o==="connect"?renderConnectView():""}
      ${o==="scenarios"?renderScenariosView():""}
      ${o==="new-device"?renderNewDeviceView():""}
      ${o==="forgot-credentials"?renderForgotCredentialsView():""}
      ${o==="change-wifi"?renderChangeWifiView():""}
      ${o==="re-provision"?renderReProvisionView():""}
      
      ${renderTerminal()}
    </div>
  `}function renderDeviceInfoCompact(n="Connected",i="fw-status-success"){const o=panelState.deviceInfo;if(!o)return"";const r=getChipFeatures(o.chipName),s=o.connectionBaud?`${o.connectionBaud.toLocaleString()} bps`:"115,200 bps";return html$1`
    <div class="fw-device-info-header">
      <!-- Dark Header Section -->
      <div class="fw-device-chip-header">
        <div class="fw-device-chip-name">${o.chipName}</div>
        <div class="fw-device-chip-subline">
          <span class="fw-device-subline-item">
            ${IconSprite.renderIcon("refresh",{className:"fw-subline-icon",size:16})}
            v1.0
          </span>
          <span class="fw-device-subline-item">
            ${IconSprite.renderIcon("wifi",{className:"fw-subline-icon",size:16})}
            ${o.mac} (MAC)
          </span>
        </div>
      </div>
      
      <!-- Blue Summary Card -->
      <div class="fw-device-summary-card">
        <div class="fw-summary-section">
          <div class="fw-summary-label">
            ${IconSprite.renderIcon("cpu",{className:"fw-summary-icon",size:24})}
            FLASH & CLOCK
          </div>
          <div class="fw-summary-value">${o.flashSize||"Unknown"}</div>
          <div class="fw-summary-meta">Crystal 40 MHz</div>
          <div class="fw-summary-facts">
            ${o.flashDevice?html$1`
              <div class="fw-summary-fact">
                ${IconSprite.renderIcon("cpu",{className:"fw-fact-icon",size:14})}
                <span>Flash Device : ${o.flashDevice}</span>
              </div>
            `:""}
            ${o.usbBridge?html$1`
              <div class="fw-summary-fact">
                ${IconSprite.renderIcon("usb",{className:"fw-fact-icon",size:14})}
                <span>USB Bridge : ${o.usbBridge}</span>
              </div>
            `:""}
            <div class="fw-summary-fact">
              ${IconSprite.renderIcon("bolt",{className:"fw-fact-icon",size:14})}
              <span>Connection Baud : ${s}</span>
            </div>
          </div>
        </div>
        
        <div class="fw-summary-divider"></div>
        
        <div class="fw-summary-section">
          <div class="fw-summary-label">
            ${IconSprite.renderIcon("bolt",{className:"fw-summary-icon",size:24})}
            FEATURE SET
          </div>
          <div class="fw-summary-value">${r.length} capabilities</div>
          <div class="fw-summary-chips">
            ${r.map(a=>html$1`
              <div class="fw-feature-chip">
                <span class="fw-feature-label">${a}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <path d="M20 6L9 17L4 12"></path>
                </svg>
              </div>
            `)}
          </div>
        </div>
      </div>
    </div>
  `}function getChipFeatures(n){const i={"ESP32-P4":["High-Performance MCU","RISC-V Dual Core"],"ESP32-S3":["WiFi","BLE 5.0","USB OTG"],"ESP32-S2":["WiFi","USB OTG"],"ESP32-C3":["WiFi","BLE 5.0","RISC-V"],"ESP32-C6":["WiFi 6","BLE 5.0","Thread"],ESP32:["WiFi","Bluetooth Classic","BLE"]};for(const[o,r]of Object.entries(i))if(n?.includes(o))return r;return["Microcontroller"]}function renderConnectView(n,i){return html$1`
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
  `}function renderScenariosView(n,i){const o=t(isBlankDevice?"firmware.readyToFlash":"firmware.pyDirectDetected");return html$1`
    <div class="fw-view active">
      ${renderDeviceInfoCompact(o,isBlankDevice?"fw-status-warning":"fw-status-success")}
      
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
  `}function renderNewDeviceView(n,i){const o=panelState.deviceInfo,r=panelState.flashStep,s=panelState.flashProgress,a=panelState.selectedFirmware;if(r==="complete")return html$1`
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
    `;if(r==="downloading"||r==="flashing"){const c=t(r==="downloading"?"firmware.downloading":"firmware.flashing"),l=r==="flashing"&&s>90?html$1`<p style="text-align: center; color: var(--text-muted); margin-top: 0.5rem; font-size: 0.8rem;">
          ${t("firmware.writingToFlash")}
        </p>`:null;return html$1`
      <div class="fw-view active">
        ${renderDeviceInfoCompact(c,"fw-status-warning")}
        
        <div class="fw-device-card">
          <div class="fw-device-card-header">
            <h3>
              ${IconSprite.renderIcon("cpu",{className:"fw-header-icon"})}
              ${c}
            </h3>
          </div>
          
          <div style="padding: 1.5rem 0;">
            <div class="fw-progress-bar">
              <div class="fw-progress-fill" style="width: ${s}%"></div>
            </div>
            <p style="text-align: center; color: var(--text-secondary); margin-top: 0.75rem; font-size: 0.9rem;">
              ${s}%
            </p>
            ${l}
          </div>
        </div>
      </div>
    `}return html$1`
    <div class="fw-view active">
      <button class="fw-btn-back" onclick=${goBack}>
        ${t("firmware.back")}
      </button>
      
      ${renderDeviceInfoCompact(t("firmware.readyToFlash"),"fw-status-warning")}
      
      <div class="fw-device-card">
        <div class="fw-device-card-header">
          <h3>
            ${IconSprite.renderIcon("cpu",{className:"fw-header-icon"})}
            ${t("firmware.deviceInfo")}
          </h3>
        </div>
        
        ${o?html$1`
          <div class="fw-info-grid">
            <div class="fw-info-item">
              <label>${t("firmware.chip")}</label>
              <span>${o.chipName}</span>
            </div>
            <div class="fw-info-item">
              <label>${t("firmware.macAddress")}</label>
              <span>${o.mac}</span>
            </div>
            <div class="fw-info-item">
              <label>${t("firmware.flashSize")}</label>
              <span>${o.flashSize}</span>
            </div>
          </div>
        `:""}
      </div>
      
      <div class="fw-device-card" style="margin-top: 1rem;">
        <div class="fw-device-card-header">
          <h3>
            ${IconSprite.renderIcon("bolt",{className:"fw-header-icon"})}
            ${t("firmware.selectFirmware")}
          </h3>
        </div>
        
        ${a?html$1`
          ${panelState.firmwareOptions.length>1?html$1`
            <div class="fw-form-group">
              <select class="fw-select" onchange=${c=>{const l=panelState.firmwareOptions.find(d=>d.productId===c.target.value);l&&(panelState.selectedFirmware=l,triggerRerender())}}>
                ${panelState.firmwareOptions.map(c=>html$1`
                  <option value="${c.productId}" selected=${c.productId===a.productId}>
                    ${c.displayName}
                  </option>
                `)}
              </select>
            </div>
          `:html$1`
            <div class="fw-firmware-info">
              <p style="font-weight: 500; margin-bottom: 0.25rem;">${a.displayName||a.name}</p>
              <p style="font-size: 0.8rem; color: var(--text-secondary);">
                ${(a.size/1024/1024).toFixed(1)} MB
              </p>
            </div>
          `}
          
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
  `}function renderForgotCredentialsView(n,i){const o=panelState.credentials;return html$1`
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
        
        ${o?html$1`
          <div class="fw-credentials-grid">
            <div class="fw-cred-item">
              <label>${t("firmware.hostname")}</label>
              <span class="fw-cred-value">${o.hostname}</span>
            </div>
            <div class="fw-cred-item">
              <label>${t("firmware.password")}</label>
              <span class="fw-cred-value">${o.password}</span>
            </div>
            <div class="fw-cred-item">
              <label>${t("firmware.wifiNetwork")}</label>
              <span class="fw-cred-value">${o.ssid}</span>
            </div>
          </div>
        `:html$1`
          <div class="fw-loading">
            <span>${t("firmware.readingCredentials")}</span>
          </div>
        `}
      </div>
    </div>
  `}function renderChangeWifiView(n,i){return panelState.setupComplete?html$1`
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
  `}function renderReProvisionView(n,i){const o=()=>{const s=`https://${panelState.reblessHostname}`;window.open(s,"_blank")},r=async()=>{await resetAndClosePort(),panelState.reblessComplete=!1,panelState.reblessHostname=null,panelState.view="connect",triggerRerender()};return panelState.reblessComplete?html$1`
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
          
          <button class="fw-btn fw-btn-primary" onclick=${o} style="margin-top: 1rem;">
            ${IconSprite.renderIcon("external-link",{className:"fw-btn-icon",size:20})}
            ${t("firmware.openDeviceSetup")}
          </button>
          <button class="fw-btn fw-btn-secondary" onclick=${r} style="margin-top: 0.5rem;">
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
  `}function renderTerminal(){const n=panelState.logs;return html$1`
    <div class="fw-terminal ${panelState.terminalCollapsed?"collapsed":""}">
      <div class="fw-terminal-header" onclick=${()=>{panelState.terminalCollapsed=!panelState.terminalCollapsed,triggerRerender()}}>
        <span>${IconSprite.renderIcon("terminal",{className:"fw-terminal-icon",size:14})} ${t("firmware.statusLog")}</span>
        ${IconSprite.renderIcon(panelState.terminalCollapsed?"chevron-up":"chevron-down",{className:"fw-terminal-toggle"})}
      </div>
      <div class="fw-terminal-content">
        ${n.map(i=>html$1`
          <div class="fw-log-line ${i.type}">${i.message}</div>
        `)}
      </div>
    </div>
  `}function AIAgentPanel(n,i){const o=n.aiAgent.settings;return html`
    <div class="panel-container">
      <div class="ai-agent-content">
        
        <!-- API Provider Section -->
        <div class="ai-agent-section">
          <h3>API Provider</h3>
          <p class="ai-agent-hint">Select your AI service provider</p>
          
          <select 
            class="ai-agent-select"
            value="${o.provider}"
            onchange=${r=>i("ai-set-provider",r.target.value)}
          >
            <option value="openai" selected=${o.provider==="openai"}>OpenAI (GPT-4, GPT-3.5)</option>
            <option value="anthropic" selected=${o.provider==="anthropic"}>Anthropic (Claude)</option>
            <option value="grok" selected=${o.provider==="grok"}>Grok (x.ai)</option>
            <option value="openrouter" selected=${o.provider==="openrouter"}>OpenRouter (Multi-model)</option>
            <option value="custom" selected=${o.provider==="custom"}>Custom Endpoint</option>
          </select>
        </div>
        
        <!-- API Key Section -->
        <div class="ai-agent-section">
          <h3>API Key</h3>
          <p class="ai-agent-hint">
            ${o.provider==="openai"?"Get your API key from platform.openai.com":""}
            ${o.provider==="anthropic"?html`
              Get your API key from console.anthropic.com
              <br><strong style="color: var(--scheme-primary);">Note:</strong> Anthropic requires a proxy server (see below). You can enter your API key here (it will be sent to the proxy), or configure it in the proxy server's .env file.
            `:""}
            ${o.provider==="grok"?"Get your API key from x.ai":""}
            ${o.provider==="openrouter"?"Get your API key from openrouter.ai":""}
            ${o.provider==="custom"?"Enter your custom API key and endpoint URL":""}
          </p>
          
          <div class="ai-agent-input-group">
            <input 
              type="password"
              class="ai-agent-input"
              placeholder="sk-..."
              value="${o.apiKey||""}"
              oninput=${r=>i("ai-set-apikey",r.target.value)}
            />
            <button 
              class="ai-agent-test-btn"
              onclick=${()=>i("ai-test-connection")}
              disabled=${!o.apiKey}
            >
              Test
            </button>
          </div>
          
          ${n.aiAgent.connectionStatus?html`
            <div class="ai-agent-status ${n.aiAgent.connectionStatus.success?"success":"error"}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                ${n.aiAgent.connectionStatus.success?html`
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                `:html`
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                `}
              </svg>
              ${n.aiAgent.connectionStatus.message}
            </div>
          `:""}
        </div>
        
        <!-- Model Selection -->
        <div class="ai-agent-section">
          <h3>Model</h3>
          <p class="ai-agent-hint">Choose the AI model to use for code generation</p>
          
          <select 
            class="ai-agent-select"
            value="${o.model}"
            onchange=${r=>i("ai-set-model",r.target.value)}
            disabled=${n.aiAgent.isLoadingOpenRouterModels&&o.provider==="openrouter"}
          >
            ${getModelOptions(o.provider,o.model,n.aiAgent.openRouterModels,n.aiAgent.isLoadingOpenRouterModels)}
          </select>
          ${n.aiAgent.isLoadingOpenRouterModels&&o.provider==="openrouter"?html`
            <p class="ai-agent-hint" style="margin-top: 8px; font-size: 12px; color: var(--text-secondary);">
              Loading available models...
            </p>
          `:""}
        </div>
        
        <!-- Custom Endpoint (if custom provider) -->
        ${o.provider==="custom"?html`
          <div class="ai-agent-section">
            <h3>Custom Endpoint</h3>
            <p class="ai-agent-hint">Enter your custom API endpoint URL</p>
            
            <input 
              type="text"
              class="ai-agent-input"
              placeholder="https://api.example.com/v1/chat/completions"
              value="${o.endpoint||""}"
              oninput=${r=>i("ai-set-endpoint",r.target.value)}
            />
          </div>
        `:""}
        
        <!-- Anthropic Proxy URL (if anthropic provider) -->
        ${o.provider==="anthropic"?html`
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
              value="${o.anthropicProxyUrl||""}"
              oninput=${r=>i("ai-set-anthropic-proxy-url",r.target.value)}
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
            value="${o.systemPrompt||""}"
            oninput=${r=>i("ai-set-system-prompt",r.target.value)}
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
  `}function getModelOptions(n,i,o=[],r=!1){const s={openai:[{value:"gpt-4o",label:"GPT-4o (Recommended)"},{value:"gpt-4-turbo",label:"GPT-4 Turbo"},{value:"gpt-4",label:"GPT-4"},{value:"gpt-3.5-turbo",label:"GPT-3.5 Turbo"}],anthropic:[{value:"claude-3-5-sonnet-20241022",label:"Claude 3.5 Sonnet (Recommended)"},{value:"claude-3-opus-20240229",label:"Claude 3 Opus"},{value:"claude-3-sonnet-20240229",label:"Claude 3 Sonnet"},{value:"claude-3-haiku-20240307",label:"Claude 3 Haiku"}],grok:[{value:"grok-4-latest",label:"Grok-4 Latest (Recommended)"},{value:"grok-2-1212",label:"Grok-2"},{value:"grok-beta",label:"Grok Beta"},{value:"grok-vision-beta",label:"Grok Vision Beta"}],openrouter:o.length>0?o:[{value:"anthropic/claude-3.5-sonnet",label:"Claude 3.5 Sonnet"},{value:"openai/gpt-4-turbo",label:"GPT-4 Turbo"},{value:"google/gemini-pro-1.5",label:"Gemini Pro 1.5"},{value:"meta-llama/llama-3.1-70b-instruct",label:"Llama 3.1 70B"}],custom:[{value:"custom-model",label:"Custom Model"}]},a=s[n]||s.openai;return r&&n==="openrouter"?html`<option>Loading models...</option>`:a.map(c=>html`
    <option value="${c.value}" selected=${c.value===i}>${c.label}</option>
  `)}function EditorContent(n,i){return html$1`
    <div class="editor-layout">
      <div class="working-area">
        ${Toolbar(n,i)}
        ${Tabs(n,i)}
        ${CodeEditor(n)}
        ${ReplPanel(n,i)}
      </div>
      ${AgentSidebar(n,i)}
    </div>
  `}function FileManagerContent(n,i){let o="Connect to board",r=`${n.diskNavigationRoot}${n.diskNavigationPath}`;return n.isConnected&&(o=`${n.connectedPort}${n.boardNavigationPath}`),html`
    <div id="file-manager">
      <div id="board-files">
        <div class="device-header">
          ${IconSprite.renderIcon(n.isConnected?"cpu":"unlink",{className:"icon"})}
          <div onclick=${()=>i("connect")} class="text">
            <span>${o}</span>
          </div>
          <button disabled=${!n.isConnected} onclick=${()=>i("create-folder","board")}>
            ${IconSprite.renderIcon("folder-plus",{className:"icon"})}
          </button>
          <button disabled=${!n.isConnected} onclick=${()=>i("create-file","board")}>
            ${IconSprite.renderIcon("file-plus",{className:"icon"})}
          </button>
          <button disabled=${!n.isConnected} onclick=${()=>i("upload-to-device")} title="Upload files from computer directly to device">
            ${IconSprite.renderIcon("file-upload",{className:"icon"})}
          </button>
        </div>
        ${BoardFileList(n,i)}
      </div>
      ${FileActions(n,i)}
      <div id="disk-files">
        <div class="device-header">
          ${IconSprite.renderIcon("device-desktop",{className:"icon"})}
          <div class="text">
            <span>${r}</span>
          </div>
          <button onclick=${()=>i("create-folder","disk")}>
            ${IconSprite.renderIcon("folder-plus",{className:"icon"})}
          </button>
          <button onclick=${()=>i("create-file","disk")}>
            ${IconSprite.renderIcon("file-plus",{className:"icon"})}
          </button>
          <button onclick=${()=>i("import-files")} title="Import files from computer">
            ${IconSprite.renderIcon("file-upload",{className:"icon"})}
          </button>
        </div>
        ${DiskFileList(n,i)}
      </div>
    </div>
  `}function LandingView(n,i){return html$1`
    <div class="landing-view">
      <div class="landing-container">
        <!-- Demo Header with Scripto Studio branding -->
        <div class="demo-header">
          <h2>${t("landing.title")}</h2>
          <p>${t("landing.tagline")}</p>
        </div>
        
        <div class="landing-scenario-grid">
          <div class="landing-scenario-card" onclick=${()=>openExternal("https://scriptostudio.com/registry/extensions-catalogue/")}>
            <div class="landing-scenario-icon">
              ${IconSprite.renderIcon("packages",{className:"landing-icon-large"})}
            </div>
            <h3>${t("landing.browseExtensions")}</h3>
            <p>${t("landing.browseExtensionsDesc")}</p>
          </div>
          
          <div class="landing-scenario-card" onclick=${()=>openExternal("https://scriptostudio.com/registry/catalogue/")}>
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
          
          <div class="landing-scenario-card ${n.needsOnboarding?"highlight-pulse":""}" onclick=${()=>i("navigate","system:firmware")}>
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
            <button class="interactive-btn" onclick=${()=>i("connect")}>
              ${t("landing.connectDevice")}
            </button>
          </div>
        </div>
      </div>
    </div>
  `}function openExternal(n){window.open(n,"_blank","noopener,noreferrer")}function SystemView(n,i){n.sidebarIconRotated===void 0&&(n.sidebarIconRotated=!1);const o=n.connectionMode==="webrepl"?"#00FF7F":n.connectionMode==="usb"?"#FF9500":"var(--text-secondary)",r=html$1`
    <div class="sidebar-header">
      <div
        class="sidebar-header-logo connection-${n.connectionMode||"none"}"
        onclick=${()=>{n.connectionMode==="usb"?handleDisconnect():n.isConnected?i("disconnect"):i("connect")}}
        title=${n.connectionMode==="usb"?"Disconnect USB Device":n.isConnected?"Disconnect from Device":"Connect to Device"}
        style="color: ${o}"
      >
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>
      </div>
    </div>
  `;return html$1`
    <div class="working-area">
      <div class="system-container">
        ${r}
        <aside class="system-sidebar">
          ${SystemSidebar(n,i)}
        </aside>
        <main class="system-content">
          ${renderActivePanel(n,i)}
        </main>
      </div>
    </div>
    ${StatusBar(n)}
    ${ConnectionDialog(n,i)}
    ${DebugSidebar(n,i)}
    ${NewFileDialog(n,i)}
    ${ScriptOsModal(n,i)}
    ${ScriptOsUiModal(n,i)}
    ${ResetDialog(n,i)}
    ${ExtensionsModal(n,i)}
    ${BreakpointModal(n,i)}
  `}function SystemSidebar(n,i){const o=window.i18n?window.i18n.t:w=>w,r=[{id:"home",label:o("sidebar.home"),icon:"home"}],s=[{id:"editor",label:o("sidebar.editor"),icon:"code"},{id:"file-manager",label:o("sidebar.files"),icon:"folder"}],a=[{id:"about",label:o("sidebar.about"),icon:"info-circle"},{id:"settings",label:o("sidebar.settings"),icon:"adjustments-alt"},{id:"ai-agent",label:o("sidebar.aiAgent"),icon:"robot-face"},{id:"firmware",label:o("sidebar.firmware"),icon:"file-download"}],c=[{id:"wifi",label:o("sidebar.wifi"),icon:"wifi"},{id:"ethernet",label:o("sidebar.ethernet"),icon:"cloud-network"},{id:"vpn",label:o("sidebar.vpn"),icon:"shield-chevron"},{id:"btle",label:o("sidebar.btle"),icon:"bluetooth"},{id:"wwan",label:o("sidebar.wwan"),icon:"cell"},{id:"mqtt",label:o("sidebar.mqtt"),icon:"message-2"},{id:"ntp",label:o("sidebar.ntp"),icon:"clock-cog"},{id:"can",label:o("sidebar.can"),icon:"car-crash"}],l=[{id:"gps",label:o("sidebar.gps"),icon:"gps"},{id:"4g-modem",label:o("sidebar.modem"),icon:"signal-4g"},{id:"sdcard",label:o("sidebar.sdcard"),icon:"device-sd-card"}],d=r.map(w=>renderSidebarItem(w,n,i)),u=s.map(w=>renderSidebarItem(w,n,i)),p=n.expandedSystem!==!1,g=html$1`
    <div class="system-sidebar-extension">
      <div 
        class="system-sidebar-item system-sidebar-toggle"
        onclick=${()=>i("toggle-system-menu")}
      >
        ${IconSprite.renderIcon("settings",{className:"",size:20})}
        <span>${o("sidebar.system")}</span>
        ${IconSprite.renderIcon("chevron-down",{className:`expand-icon ${p?"expanded":""}`,size:16})}
      </div>
      
      ${p?html$1`
        <div class="system-sidebar-submenu">
          ${a.map(w=>{const _=n.activeSystemPanel===w.id;return html$1`
              <div 
                class="system-sidebar-subitem ${_?"active":""}"
                onclick=${()=>i("change-system-panel",w.id)}
              >
                ${IconSprite.renderIcon(w.icon,{className:"",size:16})}
                <span>${w.label}</span>
              </div>
            `})}
        </div>
      `:""}
    </div>
  `,f=n.expandedNetworks!==!1,h=html$1`
    <div class="system-sidebar-extension">
      <div 
        class="system-sidebar-item system-sidebar-toggle"
        onclick=${()=>i("toggle-networks-menu")}
      >
        ${IconSprite.renderIcon("network",{className:"",size:20})}
        <span>${o("sidebar.networks")}</span>
        ${IconSprite.renderIcon("chevron-down",{className:`expand-icon ${f?"expanded":""}`,size:16})}
      </div>
      
      ${f?html$1`
        <div class="system-sidebar-submenu">
          ${c.map(w=>{const _=n.activeNetworkPanel===w.id;return html$1`
              <div 
                class="system-sidebar-subitem ${_?"active":""}"
                onclick=${()=>i("change-network-panel",w.id)}
              >
                ${IconSprite.renderIcon(w.icon,{className:"",size:16})}
                <span>${w.label}</span>
              </div>
            `})}
        </div>
      `:""}
    </div>
  `,m=n.expandedPeripherals!==!1,v=html$1`
    <div class="system-sidebar-extension">
      <div
        class="system-sidebar-item system-sidebar-toggle"
        onclick=${()=>i("toggle-peripherals-menu")}
      >
        ${IconSprite.renderIcon("cpu",{className:"",size:20})}
        <span>${o("sidebar.peripherals")}</span>
        ${IconSprite.renderIcon("chevron-down",{className:`expand-icon ${m?"expanded":""}`,size:16})}
      </div>
      
      ${m?html$1`
        <div class="system-sidebar-submenu">
          ${l.map(w=>{const _=n.activePeripheralsPanel===w.id;return html$1`
              <div 
                class="system-sidebar-subitem ${_?"active":""}"
                onclick=${()=>i("change-peripherals-panel",w.id)}
              >
                ${IconSprite.renderIcon(w.icon,{className:"",size:16})}
                <span>${w.label}</span>
              </div>
            `})}
        </div>
      `:""}
    </div>
  `,y=w=>{if(w.iconSvg)try{const T=new DOMParser().parseFromString(w.iconSvg,"image/svg+xml").querySelector("svg");if(T){const E=T.getAttribute("viewBox")||"0 0 24 24",$=Array.from(T.querySelectorAll("path"));return html$1`
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              class="icon icon-extension icon-tabler" 
              width="20" 
              height="20" 
              viewBox="${E}" 
              stroke-width="2" 
              stroke="none"
              fill="none" 
              stroke-linecap="round" 
              stroke-linejoin="round"
              style="vertical-align: middle; border: none !important; outline: none !important; box-shadow: none !important; display: block;"
            >
              ${$.map(I=>{const N=I.getAttribute("d")||"",O=I.getAttribute("fill")||"none",F=I.getAttribute("stroke");return N==="M0 0h24v24H0z"||F==="none"?html$1`<path d="${N}" stroke="none" fill="none" />`:html$1`<path d="${N}" stroke="currentColor" fill="${O}" />`})}
            </svg>
          `}}catch(x){console.warn("[System] Failed to parse extension icon SVG:",x)}const _=w.icon||"settings";return IconSprite.renderIcon(_,{className:"",size:20})},b=(n.installedExtensions||[]).map(w=>{const _=n.expandedExtensions[w.id],x=n.activeExtension===w.id,P=w.devices===!0;let T=null;if(P&&_)if(!n.loadedExtensions[w.id])console.warn("[System] Extension not loaded:",w.id);else{const E=n.loadedExtensions[w.id];if(!E.instance)try{const $=E.data.content,N=new Function("DeviceAPI","html","emit","state",`
              ${$}
              const classMatch = ${JSON.stringify($)}.match(/class\\s+(\\w+(?:App|Extension))\\s*{/);
              if (!classMatch) {
                throw new Error('No extension class found');
              }
              return eval(classMatch[1]);
            `)(DeviceAPI,html$1,i,n),O=new DeviceAPI(BridgeDevice),F=new N(O,i,n,html$1);n.loadedExtensions[w.id].instance=F}catch($){console.error(`[System] Error instantiating extension ${w.id}:`,$)}if(E.instance&&typeof E.instance.getMenuItems=="function")try{const $=E.instance.getMenuItems();$&&Array.isArray($)&&(w.menu=$)}catch($){console.error(`[System] Error getting menu items for ${w.id}:`,$)}if(E.instance&&typeof E.instance.renderSidebarDevices=="function")try{T=E.instance.renderSidebarDevices()}catch($){console.error(`[System] Error rendering sidebar devices for ${w.id}:`,$)}else console.warn(`[System] renderSidebarDevices not available for ${w.id}`)}if(_&&n.loadedExtensions[w.id]?.instance){const E=n.loadedExtensions[w.id];if(E.instance&&typeof E.instance.getMenuItems=="function")try{const $=E.instance.getMenuItems();$&&Array.isArray($)&&(w.menu=$)}catch($){console.error(`[System] Error getting menu items for ${w.id}:`,$)}}return html$1`
      <div class="system-sidebar-extension">
        <div 
          class="system-sidebar-item system-sidebar-toggle ${x?"active-extension":""}"
          onclick=${()=>i("toggle-extension-menu",w.id)}
        >
          ${y(w)}
          <span>${w.name}</span>
          ${IconSprite.renderIcon("chevron-down",{className:`expand-icon ${_?"expanded":""}`,size:16})}
        </div>
        
        ${_?html$1`
          <div class="system-sidebar-submenu">
            ${w.menu.map(E=>{const $=n.activeExtension===w.id&&n.activeExtensionPanel===E.id,I=E.disabled===!0;return html$1`
                <div 
                  class="system-sidebar-subitem ${$?"active":""} ${I?"disabled":""}"
                  onclick=${I?null:()=>i("change-extension-panel",{extensionId:w.id,panelId:E.id})}
                  style=${I?"opacity: 0.6; cursor: default; font-weight: 600;":""}
                >
                  <span>${E.label}</span>
                </div>
              `})}
            
            ${P?html$1`
              <div class="system-sidebar-devices-section">
                <div class="system-sidebar-devices-header">
                  DEVICES
                </div>
                ${T||html$1`
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
      <span>${o("extensions")}</span>
      <button 
        class="extensions-add-button" 
        onclick=${()=>i("open-extensions-modal")}
        title=${o("add_extension")}
      >
        +
      </button>
    </div>
  `,C=html$1`
    <div class="system-sidebar-divider"></div>
  `,k=html$1`
    <div class="sidebar-footer">
      ${window.LanguageSelector?window.LanguageSelector(n,i):""}
    </div>
  `;return html$1`
    <div class="system-sidebar-content">
      ${d}
      ${u}
      ${h}
      ${v}
      ${g}
      ${C}
      ${S}
      ${b}
      ${k}
    </div>
  `}function renderSidebarItem(n,i,o){const r=i.systemSection===n.id,a=["editor","file-manager"].includes(n.id)?"change-view":"change-system-section";return html$1`
    <div
      class="system-sidebar-item ${r?"active":""}"
      onclick=${()=>o(a,n.id)}
    >
      ${IconSprite.renderIcon(n.icon,{className:"",size:20})}
      <span>${n.label}</span>
    </div>
  `}function renderActivePanel(n,i){const o=n.systemSection;if(o==="editor")return EditorContent(n,i);if(o==="file-manager")return FileManagerContent(n,i);if(o==="landing")return LandingView(n,i);if(o?.startsWith("extension:"))return ExtensionContainer(n,i,html$1);if(o?.startsWith("network:"))switch(o.split(":")[1]){case"wifi":return WiFiPanel(n,i);case"ethernet":return EthernetPanel(n,i);case"vpn":return VPNPanel(n,i);case"btle":return BTLEPanel(n,i);case"wwan":return WWANPanel(n,i);case"mqtt":return MQTTPanel(n,i);case"ntp":return NTPPanel(n,i);case"can":return CANPanel(n,i);default:return WiFiPanel(n,i)}if(o?.startsWith("peripherals:"))switch(o.split(":")[1]){case"gps":return GPSPanel(n,i);case"4g-modem":return ModemPanel(n,i);case"sdcard":return SDCardPanel(n,i);default:return GPSPanel(n,i)}if(o?.startsWith("system:"))switch(o.split(":")[1]){case"about":return SysInfoPanel(n,i);case"settings":return AppearancePanel(n,i);case"ai-agent":return AIAgentPanel(n,i);case"firmware":return FirmwarePanel(n);default:return AppearancePanel(n,i)}return LandingView(n,i)}const cacheBuster=Date.now();window.i18nReady=Promise.all([fetch(`locales/en.json?v=${cacheBuster}`).then(n=>n.json()),fetch(`locales/de.json?v=${cacheBuster}`).then(n=>n.json()),fetch(`locales/es.json?v=${cacheBuster}`).then(n=>n.json()),fetch(`locales/fr.json?v=${cacheBuster}`).then(n=>n.json())]).then(([n,i,o,r])=>{if(window.i18n){window.i18n.initTranslations(n,i,o,r);const s=localStorage.getItem("locale")||"en";window.i18n.setLocale(s),console.log("[i18n] Translations loaded, locale set to:",s),window.appInstance&&window.appInstance.emitter.emit("render")}else console.warn("[i18n] window.i18n not available yet");return!0}).catch(n=>(console.error("[i18n] Failed to load translations:",n),!1));const newFileContent=`# This program was created in ScriptO Studio for MicroPython

print('Hello, ')
print('ScriptO!') # ●
`;async function sleep(n){return new Promise(i=>setTimeout(i,n))}async function confirmDialog(n,i,o){return confirm(n)?0:1}function updateStatusBarDirectly(n,i){const o=document.getElementById("status-bar");if(!o)return;const r=i||localStorage.getItem("temperatureUnit")||"degC",s=buildStatusBarModel?buildStatusBarModel(n,r):null;if(!s||!s.connected){o.className="disconnected";const g=o.querySelector(".status-bar-center");g?g.textContent=s&&s.disconnectedText||DISCONNECTED_STATUS_TEXT:o.textContent=s&&s.disconnectedText||DISCONNECTED_STATUS_TEXT;return}o.className="";const a=o.querySelector(".status-bar-center")||o;function c(g){let f=a.querySelector(`.status-item.${g}`);if(!f){f=document.createElement("div"),f.className=`status-item ${g}`;const h=document.createElement("span");h.className="status-label";const m=document.createElement("span");m.className="status-value",f.appendChild(h),f.appendChild(m),a.appendChild(f)}return f}const l=c("ram");l.querySelector(".status-label").textContent="RAM",l.querySelector(".status-value").textContent=s.ram;const d=a.querySelector(".status-item.temp");if(s.temp){const g=c("temp");g.querySelector(".status-label").textContent="TEMP",g.querySelector(".status-value").textContent=s.temp}else d&&d.remove();const u=c("uptime");u.querySelector(".status-label").textContent="UPTIME",u.querySelector(".status-value").textContent=s.uptime;const p=a.querySelector(".status-item.wifi-rssi");if(s.rssi){const g=c("wifi-rssi");g.querySelector(".status-label").textContent="RSSI",g.querySelector(".status-value").textContent=s.rssi}else p&&p.remove()}function updateOverlayDirectly(n){const i=document.getElementById("overlay");if(!i)return;let o=!1,r="";if(n.diskFiles==null)o=!0,r="<p>Loading files...</p>";else if(n.isRemoving)o=!0,r="<p>Removing...</p>";else if(n.isConnecting)o=!0,r="<p>Connecting...</p>";else if(n.isLoadingFiles)o=!0,r="<p>Loading files...</p>";else if(n.isSaving)o=!0,r=`<p>Saving file... ${n.savingProgress||0}</p>`;else if(n.isTransferring){o=!0;const s=String(n.transferringProgress||""),a=s.match(/(\d+)%?$/),c=a?parseInt(a[1]):0,l=s.match(/^(.+?):/);r=`
      <div class="transfer-overlay-content">
        <div class="transfer-title">Transferring File</div>
        <div class="transfer-filename">${l?l[1]:"file"}</div>
        <div class="transfer-progress-container">
          <div class="transfer-progress-bar">
            <div class="transfer-progress-fill" style="width: ${c}%"></div>
          </div>
          <div class="transfer-progress-text">${c}%</div>
        </div>
      </div>
    `}o?(i.classList.remove("closed"),i.classList.add("open"),i.innerHTML=r):(i.classList.remove("open"),i.classList.add("closed"))}class RegistryCache{constructor(){this.DB_NAME="scripto-studio-registry-cache",this.DB_VERSION=1,this.STORE_SCRIPTOS="scriptos",this.STORE_INDEX="index",this.INDEX_CACHE_KEY="index",this.INDEX_CACHE_EXPIRY=24*60*60*1e3}async _initDB(){return new Promise((i,o)=>{const r=indexedDB.open(this.DB_NAME,this.DB_VERSION);r.onerror=()=>o(r.error),r.onsuccess=()=>i(r.result),r.onupgradeneeded=s=>{const a=s.target.result;a.objectStoreNames.contains(this.STORE_SCRIPTOS)||a.createObjectStore(this.STORE_SCRIPTOS),a.objectStoreNames.contains(this.STORE_INDEX)||a.createObjectStore(this.STORE_INDEX)}})}async getIndex(){try{const i=await this._initDB();return new Promise((o,r)=>{const c=i.transaction([this.STORE_INDEX],"readonly").objectStore(this.STORE_INDEX).get(this.INDEX_CACHE_KEY);c.onsuccess=()=>{const l=c.result;if(l&&l.data){const d=Date.now()-l.timestamp;d<this.INDEX_CACHE_EXPIRY?(console.log("[Registry Cache] Using cached index (age:",Math.round(d/1e3/60),"minutes)"),o(l.data)):(console.log("[Registry Cache] Index cache expired"),o(null))}else o(null)},c.onerror=()=>r(c.error)})}catch(i){return console.error("[Registry Cache] Error getting index:",i),null}}async saveIndex(i){try{const o=await this._initDB();return new Promise((r,s)=>{const l=o.transaction([this.STORE_INDEX],"readwrite").objectStore(this.STORE_INDEX).put({data:i,timestamp:Date.now()},this.INDEX_CACHE_KEY);l.onsuccess=()=>{console.log("[Registry Cache] Saved index"),r()},l.onerror=()=>s(l.error)})}catch(o){console.error("[Registry Cache] Error saving index:",o)}}async getScriptO(i){try{const o=await this._initDB();return new Promise((r,s)=>{const l=o.transaction([this.STORE_SCRIPTOS],"readonly").objectStore(this.STORE_SCRIPTOS).get(i);l.onsuccess=()=>{const d=l.result;d&&d.content?(console.log("[Registry Cache] Using cached ScriptO:",i),r(d)):r(null)},l.onerror=()=>s(l.error)})}catch(o){return console.error("[Registry Cache] Error getting ScriptO:",o),null}}async saveScriptO(i,o,r){try{const s=await this._initDB();return new Promise((a,c)=>{const u=s.transaction([this.STORE_SCRIPTOS],"readwrite").objectStore(this.STORE_SCRIPTOS).put({url:i,content:o,config:r,timestamp:Date.now()},i);u.onsuccess=()=>{console.log("[Registry Cache] Saved ScriptO:",i),a()},u.onerror=()=>c(u.error)})}catch(s){console.error("[Registry Cache] Error saving ScriptO:",s)}}}async function initializeState(state,emitter,createNewTab){const disk=BridgeDisk;state.platform=navigator.platform.indexOf("Mac")>-1?"darwin":"linux",state.systemSection=null,state.diskNavigationPath="/",state.isInitializing=!0,state.commandHistory=[],state.historyIndex=-1,state.cursorPos=0,await disk.initialize(),state.diskNavigationRoot="/",console.log("[Store] Using IndexedDB virtual filesystem, root:",state.diskNavigationRoot),state.isInitializing=!1,emitter.emit("render"),state.diskFiles=[],state.boardNavigationPath="/",state.boardNavigationRoot="/",state.boardFiles=[],state.openFiles=[],state.selectedFiles=[],state.filesLoadedOnce=!1,state.newTabFileName=null,state.editingFile=null,state.creatingFile=null,state.renamingFile=null,state.currentLine="",state.bannerDisplayed=!1,state.creatingFolder=null,state.renamingTab=null,state.fileCounter=1,state.isConnectionDialogOpen=!1,state.isConnecting=!1,state.systemInfo=null,state.networksInfo=null,state.isLoadingSystemInfo=!1,state.isLoadingNetworks=!1,state.expandedNetworks=!1,state.activeNetworkPanel=null,state.expandedPeripherals=!1,state.activePeripheralsPanel=null,state.expandedSystem=!1,state.activeSystemPanel=null,state.sdcardConfig=null,state.isLoadingSdcardConfig=!1,state.sdcardConfigLoaded=!1,state.sdcardInfo=null,state.isLoadingSdcardInfo=!1,state.isMountingSDCard=!1,state.isUnmountingSDCard=!1,state.gpioConfig=null,state.isLoadingGpioConfig=!1,state.gpioConfigLoaded=!1,state.gpioSortBy="usage",state.gpioSortOrder="asc",state.gpioEditingRow=null,state.gpioEditingRowData=null,state.gpioValidationErrors=[],state.mqttConfig=null,state.isLoadingMqttConfig=!1,state.canConfig=null,state.canConfigLoaded=!1,state.isLoadingCanConfig=!1,state.mqttConfigLoaded=!1,state.ntpConfig={server:"pool.ntp.org",tzOffset:0,timezone:"UTC",autoDetect:!1,autoSync:!1},state.isLoadingNtpConfig=!1,state.ntpConfigLoaded=!1,state.ntpSyncResult=null,state.wwanConfig=null,state.isLoadingWwanConfig=!1,state.wwanConfigLoaded=!1,state.modemStatus=null,state.isLoadingModemStatus=!1,state.modemStatusLoaded=!1,state.gpsData=null,state.isLoadingGpsData=!1,state.gpsDataLoaded=!1,state.theme=null,state.colorScheme=null,state.effectiveTheme=null,state.locale=localStorage.getItem("locale")||"en",state.isConnected=!1,state.connectedPort=null,state.connectionMode="none",state.needsOnboarding=!1;try{const n=await disk.hasOnboardedDevices();state.needsOnboarding=!n,console.log("[State Init] Onboarding needed:",state.needsOnboarding)}catch(n){console.warn("[State Init] Could not check onboarded devices:",n),state.needsOnboarding=!0}state.statusInfo=null,state.scriptOsList=[],state.selectedScriptOs=null,state.scriptOsModalView="library",state.scriptOsArgs={},state.scriptOsSearchQuery="",state.scriptOsFilterTags=[],state.isScriptOsModalOpen=!1,state.registryUrl="https://scriptostudio.com/registry/index.json",state.isLoadingRegistry=!1,state.scriptOsUiModal={isOpen:!1,url:null,title:null,isLoading:!1,error:null},state.aiAgent={isOpen:!1,messages:[],isGenerating:!1,connectionStatus:null,openRouterModels:[],isLoadingOpenRouterModels:!1,inputValue:"",lastConfiguredArgs:null,lastScriptName:null,settings:{provider:localStorage.getItem("ai-provider")||"openai",apiKey:localStorage.getItem("ai-apikey")||null,model:localStorage.getItem("ai-model")||"gpt-4o",endpoint:localStorage.getItem("ai-endpoint")||null,systemPrompt:localStorage.getItem("ai-system-prompt")||"",anthropicProxyUrl:localStorage.getItem("ai-anthropic-proxy-url")||"http://localhost:3001/api/anthropic"}},state.debugger={active:!1,halted:!1,configOpen:!1,debugFiles:[],breakpoints:{},watchExpressions:{},conditionalBreakpoints:{},breakpointModalOpen:!1,editingBreakpoint:null,currentFile:"",currentLine:0,variables:{},locals:{},memory:0,timing:0},state.extensionRegistry=new ExtensionRegistry,state.installedExtensions=[],state.availableExtensions=[],state.loadedExtensions={},state.activeExtension=null,state.activeExtensionPanel=null,state.expandedExtensions={},state.isExtensionsModalOpen=!1,state.isLoadingExtensions=!1,state.dependencyPrompt=null,state.installingDependencies=null,state.isNewFileDialogOpen=!1,state.isSaving=!1,state.savingProgress=0,state.isTransferring=!1,state.transferringProgress="",state.isRemoving=!1,state.isLoadingFiles=!1,state.dialogs=[],state.shortcutsDisabled=!1,await createNewTab("disk"),state.savedPanelHeight=PANEL_DEFAULT$1,state.panelHeight=PANEL_CLOSED$1,state.dragStartY=0,state.dragStartHeight=0,state.logSidebarWidth=350,state.savedLogSidebarWidth=350;try{state.installedExtensions=await state.extensionRegistry.getInstalledExtensions(),console.log(`[Extension Registry] Found installed extensions: ${state.installedExtensions.length}`)}catch(n){console.error("[Extensions] Failed to load installed extensions:",n),state.installedExtensions=[]}state.cache(XTerm,"terminal"),console.log("[State Init] Terminal component cached"),typeof window<"u"&&(window.dev={state,registry:state.extensionRegistry,updateExtension:async n=>new Promise((i,o)=>{const r=document.createElement("input");r.type="file",r.accept=".js",r.onchange=async s=>{try{const a=await s.target.files[0].text(),c=await state.extensionRegistry.updateExtensionDev(n,a);console.log("✅ Extension updated! Click another panel, then back to reload."),i(c)}catch(a){o(a)}},r.click()}),installExtensionFromFile:async()=>new Promise((resolve,reject)=>{const input=document.createElement("input");input.type="file",input.accept=".js",input.onchange=async e=>{try{const content=await e.target.files[0].text(),result=await state.extensionRegistry.installExtensionFromContent(content);if(console.log(`✅ Extension "${result.config.name}" installed!`),state.installedExtensions=await state.extensionRegistry.getInstalledExtensions(),emitter.emit("render"),hasOnInstallMethod(content)&&state.isConnected){showStyledModal({variant:"",icon:"📦",title:"Installing Extension Files",subtitle:result.config.name,body:"<p>Writing files to device...</p>",buttons:[]});try{const html=(n,...i)=>n.reduce((o,r,s)=>o+r+(i[s]||""),""),deviceAPI=new DeviceAPI$1(BridgeDevice),filesMatch=content.match(/export\s+const\s+__DEVICE_FILES__\s*=\s*(\{[\s\S]*?\});/);let deviceFiles={};if(filesMatch)try{const rawFiles=eval("("+filesMatch[1]+")");for(const[n,i]of Object.entries(rawFiles))try{const o=atob(i),r=new Uint8Array(o.length);for(let s=0;s<o.length;s++)r[s]=o.charCodeAt(s);deviceFiles[n]=new TextDecoder("utf-8").decode(r)}catch(o){console.warn(`[Dev Install] Failed to decode ${n}:`,o),deviceFiles[n]=i}}catch(n){console.warn("[Dev Install] Device files parse failed:",n)}const exportMatch=content.match(/export\s*\{\s*(\w+)\s+as\s+default\s*\}/),defaultExportVar=exportMatch?exportMatch[1]:null,evalContent=content.replace(/export\s+(const|default|class|function)/g,"$1").replace(/export\s*\{[^}]*\}\s*;?/g,""),returnLogic=defaultExportVar?`return ${defaultExportVar};`:`if (typeof P !== 'undefined') return P;
                       const classMatch = ${JSON.stringify(evalContent)}.match(/class\\s+(\\w+(?:App|Extension))\\s*{/);
                       if (classMatch) return eval(classMatch[1]);
                       throw new Error('No extension class found in bundle');`,extensionFunction=new Function("DeviceAPI","html","emit","state",`
                    ${evalContent}
                    ${returnLogic}
                  `),ExtensionClass=extensionFunction(DeviceAPI$1,html,emitter.emit.bind(emitter),state),instance=new ExtensionClass(deviceAPI,emitter.emit.bind(emitter),state,html);instance.deviceFiles=deviceFiles,console.log(`[Dev Install] Loaded with ${Object.keys(deviceFiles).length} device files`);const installResult=await instance.onInstall();if(installResult===!1)throw new Error("onInstall returned false (check console for details)");const version=Array.isArray(result.config.version)?result.config.version.join("."):"0.0.0";await updateDeviceExtensionRegistry(deviceAPI,result.id,version),closeStyledModal(),await showStyledModal({variant:"success",icon:"✅",title:"Extension Ready",subtitle:result.config.name,body:"<p>Extension files have been installed on your device.</p>",buttons:[{id:"done",class:"fw-styled-modal-btn-primary",label:"Done"}]})}catch(n){console.error("[Dev Install] onInstall failed:",n),closeStyledModal(),await showStyledModal({variant:"danger",icon:"❌",title:"Installation Failed",subtitle:result.config.name,body:`<p>Failed to install files: ${n.message}</p>`,buttons:[{id:"close",class:"fw-styled-modal-btn-cancel",label:"Close"}]})}}else hasOnInstallMethod(content)&&await showStyledModal({variant:"warning",icon:"📦",title:"Extension Saved",subtitle:result.config.name,body:"<p>Connect to your device and open the extension to install files.</p>",buttons:[{id:"ok",class:"fw-styled-modal-btn-primary",label:"OK"}]});resolve(result),console.log("[Dev Install] 🔄 Reloading to apply changes..."),setTimeout(()=>location.reload(),500)}catch(n){reject(n)}},input.click()})},console.log('[State Init] Dev utilities exposed: dev.updateExtension("id"), dev.installExtensionFromFile()')),state.resizePanel=function(n){const i=parseFloat(getComputedStyle(document.body).zoom)||1,o=(n.clientY-state.dragStartY)/i;state.panelHeight=state.dragStartHeight-o,state.panelHeight<=PANEL_CLOSED$1?state.savedPanelHeight=PANEL_DEFAULT$1:state.savedPanelHeight=state.panelHeight,emitter.emit("render")},state.resizeLogSidebar=function(n){const r=document.querySelector(".repl-panel-content");if(!r)return;const s=r.getBoundingClientRect(),a=s.width,c=s.right-n.clientX,l=a-600;c>=200&&c<=l&&(state.logSidebarWidth=c,state.savedLogSidebarWidth=c,emitter.emit("render"))}}function detectSystemTheme(){try{return window.matchMedia("(prefers-color-scheme: dark)").matches}catch(n){return console.warn("Failed to detect system theme:",n),!1}}function applyTheme(n){if(n.theme==="device"){const i=detectSystemTheme();n.effectiveTheme=i?"dark":"light"}else n.effectiveTheme=n.theme;n.effectiveTheme==="dark"?document.documentElement.setAttribute("data-theme","dark"):document.documentElement.removeAttribute("data-theme")}function applyColorScheme(n){document.documentElement.setAttribute("data-color-scheme",n.colorScheme)}let darkModeMediaQuery=null;function setupThemeListener(n,i){if(darkModeMediaQuery)try{darkModeMediaQuery.removeListener?darkModeMediaQuery.removeListener(handleSystemThemeChange):darkModeMediaQuery.removeEventListener&&darkModeMediaQuery.removeEventListener("change",handleSystemThemeChange)}catch{}darkModeMediaQuery=window.matchMedia("(prefers-color-scheme: dark)"),darkModeMediaQuery.addListener?darkModeMediaQuery.addListener(()=>handleSystemThemeChange(n,i)):darkModeMediaQuery.addEventListener&&darkModeMediaQuery.addEventListener("change",()=>handleSystemThemeChange(n,i))}function handleSystemThemeChange(n,i){n.theme==="device"&&(applyTheme(n),window.dispatchEvent(new CustomEvent("theme-changed")),i.emit("render"))}function initializeTheme(n,i){const o=localStorage.getItem("theme")||"dark",r=localStorage.getItem("colorScheme")||"green",s=localStorage.getItem("editorTheme")||"auto";n.theme=o,n.colorScheme=r,n.editorTheme=s,applyTheme(n),applyColorScheme(n),setupThemeListener(n,i)}function registerThemeHandlers(n,i){i.on("set-theme",o=>{console.log("set-theme",o),n.theme=o,localStorage.setItem("theme",n.theme),applyTheme(n),window.dispatchEvent(new CustomEvent("theme-changed")),i.emit("render")}),i.on("set-color-scheme",o=>{console.log("set-color-scheme",o),n.colorScheme=o,localStorage.setItem("colorScheme",n.colorScheme),applyColorScheme(n),i.emit("render")}),i.on("set-temperature-unit",o=>{console.log("set-temperature-unit",o),n.temperatureUnit=o,localStorage.setItem("temperatureUnit",n.temperatureUnit),n.isConnected&&n.statusInfo&&updateStatusBarDirectly(n.statusInfo,o||"degC"),i.emit("render")}),i.on("set-editor-theme",o=>{console.log("set-editor-theme",o),n.editorTheme=o,localStorage.setItem("editorTheme",n.editorTheme),window.dispatchEvent(new CustomEvent("editor-theme-changed",{detail:{theme:o}})),i.emit("render")})}function dismissOpenDialogs(n,i,o=null){o&&o.key!="Escape"||(window._dismissDialogsKeyHandler&&(document.removeEventListener("keydown",window._dismissDialogsKeyHandler),window._dismissDialogsKeyHandler=null),n.isConnectionDialogOpen=!1,n.isNewFileDialogOpen=!1,n.scriptOsUiModal&&n.scriptOsUiModal.isOpen&&i.emit("close-scriptos-ui-modal"),i.emit("render"))}function updateDialogDOM(n,i){const o=document.getElementById(n);return o?(i?(o.classList.remove("closed"),o.classList.add("open")):(o.classList.remove("open"),o.classList.add("closed")),!0):!1}function registerDialogHandlers(n,i,o){i.on("open-connection-dialog",async()=>{dismissOpenDialogs(n,i),await o.disconnect(),n.isConnectionDialogOpen=!0,updateDialogDOM("dialog-connection",!0)||i.emit("render");const r=s=>dismissOpenDialogs(n,i,s);document.addEventListener("keydown",r),window._dismissDialogsKeyHandler=r}),i.on("close-connection-dialog",()=>{n.isConnectionDialogOpen=!1,dismissOpenDialogs(n,i),updateDialogDOM("dialog-connection",!1)}),i.on("create-new-file",()=>{console.log("create-new-file"),dismissOpenDialogs(n,i),n.isNewFileDialogOpen=!0,updateDialogDOM("dialog-new-file",!0)||i.emit("render");const r=s=>dismissOpenDialogs(n,i,s);document.addEventListener("keydown",r),window._dismissDialogsKeyHandler=r}),i.on("close-new-file-dialog",()=>{n.isNewFileDialogOpen=!1,dismissOpenDialogs(n,i),updateDialogDOM("dialog-new-file",!1)})}function registerTerminalHandlers(n,i,o,r){let s=!1;function a(){s=!0,setTimeout(()=>{s=!1},500)}function c(p=!1){s||(i.emit("run",p),a())}function l(){canExecute({isConnected:n.isConnected})&&c()}function d(){canExecute({isConnected:n.isConnected})&&c(!0)}function u(){canExecute({isConnected:n.isConnected})&&i.emit("stop")}return i.on("run-from-button",(p=!1)=>{p?d():l()}),i.on("run",async(p=!1)=>{const g=n.openFiles.find(v=>v.id==n.editingFile);if(!g||!g.editor){console.warn("[run] No active file to execute");return}let f=g.editor.content||"";if(p&&g.editor.view){const v=g.editor.view.state,y=v.selection;if(y.ranges.some(S=>S.from!==S.to)){const S=y.ranges.filter(C=>C.from!==C.to).map(C=>v.sliceDoc(C.from,C.to)).join(`
`);S.trim().length>0&&(f=S)}}let h=!1;if(!p&&f.startsWith("# SCRIPTOS_SILENT: True")&&(h=!0,console.log("[ScriptO] Detected silent mode marker")),!p&&f.includes("# === START_CONFIG_PARAMETERS ==="))try{console.log("[ScriptO] Detected ScriptO file, parsing...");const v=parseScriptOsConfig(f);if(v){h=v.silent===!0,console.log("[ScriptO] Config parsed:",v,"silent:",h);const y={};if(v.args)for(const S in v.args){const C=v.args[S];C.value!==void 0&&(y[S]=C.value)}console.log("[ScriptO] Using default values:",y);const b=generateScriptOsCode(f,v,y);console.log("[ScriptO] Generated code length:",b.length,"original:",f.length),f=b,console.log("[ScriptO] Parsed and generated clean code successfully")}else console.log("[ScriptO] Config parsing returned null")}catch(v){console.error("[ScriptO] Error parsing config:",v)}i.emit("open-panel");let m=document.querySelector(".xterm-helper-textarea");m&&m.focus(),i.emit("render");try{bindTerminalOutput(n);let v=n.cache(r,"terminal").term;v.write(`\r
`);const y=await o.run(f,h);y&&y.trim()&&h&&v.write(y+`\r
`),v.write(TERMINAL_PROMPT),v.scrollToBottom()}catch(v){console.log("error",v),bindTerminalOutput(n);let y=n.cache(r,"terminal").term;y.write(`\r
\x1B[91mError: `+v.message+`\x1B[0m\r
`),y.write(TERMINAL_PROMPT),y.scrollToBottom()}m=document.querySelector(".cm-content"),m&&m.focus(),i.emit("render")}),i.on("stop",async()=>{if(n.panelHeight<=PANEL_CLOSED$1&&(n.panelHeight=n.savedPanelHeight),i.emit("open-panel"),i.emit("render"),n.isConnected)try{await o.interrupt()}catch(p){console.log("Stop failed:",p)}}),i.on("clear-terminal",()=>{n.cache(r,"terminal").term.clear(),i.emit("log:clear")}),i.on("terminal:write",p=>{n.cache(r,"terminal").term.write(p)}),i.on("terminal:write-prompt",()=>{n.cache(r,"terminal").term.write(TERMINAL_PROMPT)}),i.on("open-panel",()=>{i.emit("stop-resizing-panel"),n.panelHeight=n.savedPanelHeight,i.emit("render"),setTimeout(()=>{n.cache(r,"terminal").resizeTerm()},200)}),i.on("close-panel",()=>{i.emit("stop-resizing-panel"),n.savedPanelHeight=n.panelHeight,n.panelHeight=0,i.emit("render")}),i.on("start-resizing-panel",p=>{n.dragStartY=p.clientY,n.dragStartHeight=n.panelHeight;const g=document.querySelector("#panel");g&&g.classList.add("resizing"),document.body.style.userSelect="none",document.body.style.cursor="grabbing",window.addEventListener("mousemove",n.resizePanel);const f=()=>{i.emit("stop-resizing-panel")};window.addEventListener("mouseup",f,{once:!0}),document.body.addEventListener("mouseleave",f,{once:!0}),document.querySelector("#tabs").addEventListener("mouseenter",f,{once:!0})}),i.on("stop-resizing-panel",()=>{const p=document.querySelector("#panel");p&&p.classList.remove("resizing"),document.body.style.userSelect="",document.body.style.cursor="",window.removeEventListener("mousemove",n.resizePanel),setTimeout(()=>n.cache(r,"terminal").resizeTerm(),50)}),{runCode:l,runCodeSelection:d,stopCode:u}}function registerLogHandlers(n,i){n.logs={isOpen:!1,messages:[],maxMessages:1e3,autoScroll:!0},i.on("toggle-log-sidebar",()=>{n.logs.isOpen=!n.logs.isOpen,i.emit("render"),n.logs.isOpen&&n.logs.autoScroll&&setTimeout(()=>{const o=document.querySelector("#log-terminal .xterm-viewport");o&&(o.scrollTop=o.scrollHeight)},100)}),i.on("log:add",o=>{console.debug("[Log Store] log:add event received:",o),n.logs.messages.push(o),n.logs.messages.length>n.logs.maxMessages&&n.logs.messages.shift();const r=new CustomEvent("log-terminal-write",{detail:o});console.debug("[Log Store] Dispatching log-terminal-write event:",o),window.dispatchEvent(r)}),i.on("log:clear",()=>{n.logs.messages=[];const o=new CustomEvent("log-terminal-clear");window.dispatchEvent(o),i.emit("render")}),i.on("log:toggle-autoscroll",()=>{n.logs.autoScroll=!n.logs.autoScroll,i.emit("render")}),i.on("start-resizing-log-sidebar",()=>{console.log("start-resizing-log-sidebar"),window.addEventListener("mousemove",n.resizeLogSidebar);const o=()=>{i.emit("stop-resizing-log-sidebar")};window.addEventListener("mouseup",o,{once:!0}),document.body.addEventListener("mouseleave",o,{once:!0})}),i.on("stop-resizing-log-sidebar",()=>{window.removeEventListener("mousemove",n.resizeLogSidebar)})}function registerSystemConfigHandlers(n,i,o){i.on("toggle-system-menu",()=>{n.expandedSystem=!n.expandedSystem,i.emit("render")}),i.on("change-system-panel",r=>{n.activeSystemPanel=r,n.activeNetworkPanel=null,n.activePeripheralsPanel=null,n.activeExtension=null,n.activeExtensionPanel=null,n.systemSection=`system:${r}`,i.emit("render")}),i.on("load-network-interfaces-config",async()=>{if(console.log("[Network Interfaces] Loading config..."),!n.isConnected){console.warn("[Network Interfaces] Not connected to device");return}if(n.isLoadingNetworkInterfacesConfig){console.log("[Network Interfaces] Already loading, skipping");return}try{n.isLoadingNetworkInterfacesConfig=!0;const s=await o.exec(`
from lib.sys import settings
import json

config = {
    'wifi': settings.get("network.wifi.enabled", True),
    'ethernet': settings.get("network.ethernet.enabled", True),
    'wwan': settings.get("network.wwan.enabled", True)
}

print(json.dumps({'success': True, 'config': config}))
`);s&&s.success&&(n.networkInterfacesConfig=s.config,console.log("[Network Interfaces] Config loaded:",n.networkInterfacesConfig))}catch(r){console.error("[Network Interfaces] Failed to load config:",r)}finally{n.isLoadingNetworkInterfacesConfig=!1,i.emit("render")}}),i.on("save-network-interfaces-config",async r=>{if(console.log("[Network Interfaces] Saving config:",r),!n.isConnected){console.warn("[Network Interfaces] Not connected to device");return}if(!r.wifi&&!r.ethernet&&!r.wwan){alert("At least one network interface must be enabled.");return}try{n.isSavingNetworkInterfacesConfig=!0,i.emit("render");const a=`
from lib.sys import settings
import json

config_json = '${JSON.stringify(r).replace(/'/g,"\\'")}'
config = json.loads(config_json)

settings.set("network.wifi.enabled", config.get('wifi', True))
settings.set("network.ethernet.enabled", config.get('ethernet', True))
settings.set("network.wwan.enabled", config.get('wwan', True))

settings.save()

print(json.dumps({'success': True, 'message': 'Network interfaces configuration saved. Reboot to apply changes.'}))
`,c=await o.exec(a);if(c&&c.success)n.networkInterfacesConfig=r,alert("Network interfaces configuration saved. Please reboot the device to apply changes.");else throw new Error(c?.error||"Save failed")}catch(s){console.error("[Network Interfaces] Failed to save config:",s),alert(`Failed to save configuration: ${s.message}`)}finally{n.isSavingNetworkInterfacesConfig=!1,i.emit("render")}})}function registerNetworkConfigHandlers(n,i,o){const r=console.log;i.on("toggle-networks-menu",()=>{r("toggle-networks-menu"),n.expandedNetworks=!n.expandedNetworks,i.emit("render")}),i.on("change-network-panel",s=>{r("change-network-panel:",s),n.activeNetworkPanel=s,n.activeSystemPanel=null,n.activePeripheralsPanel=null,n.activeExtension=null,n.activeExtensionPanel=null,n.systemSection=`network:${s}`,s==="gps"&&!n.gpsDataLoaded&&n.isConnected&&i.emit("load-gps-data"),i.emit("render")}),i.on("load-ntp-config",async()=>{if(r("load-ntp-config"),!n.isConnected){console.warn("[NTP] Not connected to device");return}if(n.isLoadingNtpConfig){console.log("[NTP] Already loading config, skipping");return}try{n.isLoadingNtpConfig=!0;const a=await o.exec(`
from lib.sys import settings
from time import gmtime, localtime, mktime
import json

# Load config from settings API
tz_offset = settings.get("ntp.tz_offset", 0.0)
config = {
    'server': settings.get("ntp.server", "pool.ntp.org"),
    'tz_offset': tz_offset,
    'timezone': settings.get("ntp.timezone", "UTC"),
    'auto_detect': settings.get("ntp.auto_detect_tz", False),
    'auto_sync': settings.get("ntp.enabled", True)
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
`);o.onNtpConfig&&o.onNtpConfig(a)}catch(s){console.error("[NTP] Failed to load config:",s),n.isLoadingNtpConfig=!1}}),i.on("save-ntp-config",async s=>{if(r("save-ntp-config",s),!n.isConnected){console.warn("[NTP] Not connected to device"),i.emit("ntp-config-save-error",new Error("Not connected"));return}try{const c=`
from lib.sys import settings
import json

config_json = '${JSON.stringify(s).replace(/'/g,"\\'")}'
config = json.loads(config_json)

# Save config using settings API
settings.set("ntp.server", config.get('server', config.get('server', 'pool.ntp.org')))
settings.set("ntp.tz_offset", config.get('tz_offset', config.get('tzOffset', 0.0)))
settings.set("ntp.timezone", config.get('timezone', 'UTC'))
settings.set("ntp.auto_detect", config.get('auto_detect', config.get('autoDetect', False)))
settings.set("ntp.auto_sync", config.get('auto_sync', config.get('autoSync', False)))

settings.save()

print(json.dumps({'success': True, 'message': 'NTP configuration saved successfully'}))
`,l=await o.exec(c);if(l&&l.success)n.ntpConfig={server:s.server||"pool.ntp.org",tzOffset:s.tz_offset??s.tzOffset??0,timezone:s.timezone||"UTC",autoDetect:s.auto_detect??s.autoDetect??!1,autoSync:s.auto_sync??s.autoSync??!1},i.emit("render"),i.emit("ntp-config-saved");else{const d=new Error(l?.error||"Save failed");throw i.emit("ntp-config-save-error",d),d}}catch(a){throw console.error("[NTP] Failed to save config:",a),alert(`Failed to save NTP configuration: ${a.message}`),i.emit("ntp-config-save-error",a),a}}),i.on("sync-ntp-time",async(s,a,c,l)=>{if(r("sync-ntp-time",s,a,c,l),!n.isConnected){console.warn("[NTP] Not connected to device");return}try{const u=`
from lib.sys.utils import sync_ntp
sync_ntp('${s}', ${a}, ${c?"True":"False"}, force=True)
`,p=await o.exec(u);if(o.onNtpSync){const g={autoDetect:c,autoSync:l,server:s,tzOffset:a};o.onNtpSync(p,g)}}catch(d){console.error("[NTP] Failed to sync time:",d),alert(`Failed to sync NTP time: ${d.message}`)}}),i.on("load-mqtt-config",async()=>{if(r("load-mqtt-config"),!n.isConnected){console.warn("[MQTT] Not connected to device");return}if(n.isLoadingMqttConfig){console.log("[MQTT] Already loading config, skipping");return}try{n.isLoadingMqttConfig=!0;const a=await o.exec(`
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
`);o.onMqttConfig&&o.onMqttConfig(a)}catch(s){console.error("[MQTT] Failed to load config:",s),n.isLoadingMqttConfig=!1}}),i.on("save-mqtt-config",async s=>{if(r("save-mqtt-config",s),!n.isConnected){console.warn("[MQTT] Not connected to device");return}try{const c=`
from lib.sys import settings
import json

config_json = '${JSON.stringify(s).replace(/'/g,"\\'")}'
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
`,l=await o.exec(c);o.onMqttConfigSave&&o.onMqttConfigSave(l),n.mqttConfig=s,i.emit("render")}catch(a){console.error("[MQTT] Failed to save config:",a),alert(`Failed to save MQTT configuration: ${a.message}`)}}),i.on("load-wwan-config",async()=>{if(r("load-wwan-config"),!n.isConnected){console.warn("[WWAN] Not connected to device");return}if(n.isLoadingWwanConfig){console.log("[WWAN] Already loading config, skipping");return}try{n.isLoadingWwanConfig=!0;const a=await o.exec(`
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
`);o.onWwanConfig&&o.onWwanConfig(a)}catch(s){console.error("[WWAN] Failed to load config:",s),n.isLoadingWwanConfig=!1}}),i.on("save-wwan-config",async s=>{if(r("save-wwan-config",s),!n.isConnected){console.warn("[WWAN] Not connected to device");return}try{const c=`
from lib.sys import settings
import json

config_json = '${JSON.stringify(s).replace(/'/g,"\\'")}'
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
`,l=await o.exec(c);o.onWwanConfigSave&&o.onWwanConfigSave(l),n.wwanConfig=s,i.emit("render")}catch(a){console.error("[WWAN] Failed to save config:",a),alert(`Failed to save WWAN configuration: ${a.message}`)}}),i.on("load-modem-status",async()=>{if(r("load-modem-status"),!n.isConnected){console.warn("[Modem] Not connected to device");return}if(n.isLoadingModemStatus){console.log("[Modem] Already loading status, skipping");return}try{n.isLoadingModemStatus=!0;const a=await o.exec(`
from lib.sys.network import wwan
import json

status = wwan.get_status()
print(json.dumps(status))
`);o.onModemStatus&&o.onModemStatus(a)}catch(s){console.error("[Modem] Failed to load status:",s),n.isLoadingModemStatus=!1}}),i.on("load-can-config",async()=>{if(r("load-can-config"),!n.isConnected){console.warn("[CAN] Not connected to device");return}if(n.isLoadingCanConfig){console.log("[CAN] Already loading config, skipping");return}try{n.isLoadingCanConfig=!0;const a=await o.exec(`
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
`);o.onCanConfig&&o.onCanConfig(a)}catch(s){console.error("[CAN] Failed to load config:",s),n.isLoadingCanConfig=!1}}),i.on("save-can-config",async s=>{if(r("save-can-config",s),!n.isConnected){console.warn("[CAN] Not connected to device");return}try{const c=`
from lib.sys import settings
import json

config_json = '${JSON.stringify(s).replace(/'/g,"\\'")}'
config = json.loads(config_json)

# Save user preferences only (pins come from board.json, not settings)
settings.set("can.bitrate", config.get('bitrate', 500000))
settings.set("can.enabled", config.get('enabled', False))
settings.set("can.mode", config.get('mode', "NORMAL"))

settings.save()

print(json.dumps({'success': True, 'message': 'CAN configuration saved successfully'}))
`,l=await o.exec(c);o.onCanConfigSave&&o.onCanConfigSave(l),n.canConfig=s,i.emit("render")}catch(a){console.error("[CAN] Failed to save config:",a),alert(`Failed to save CAN configuration: ${a.message}`)}}),i.on("load-vpn-config",async()=>{if(r("load-vpn-config"),!n.isConnected){console.warn("[VPN] Not connected to device");return}if(n.isLoadingVpnConfig){console.log("[VPN] Already loading config, skipping");return}try{n.isLoadingVpnConfig=!0;const a=await o.exec(`
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
`);o.onVpnConfig&&o.onVpnConfig(a)}catch(s){console.error("[VPN] Failed to load config:",s),n.isLoadingVpnConfig=!1}}),i.on("vpn-save-config",async s=>{if(r("vpn-save-config",s),!n.isConnected){console.warn("[VPN] Not connected to device");return}try{const c=`
from lib.sys import settings
import json

config_json = '${JSON.stringify(s).replace(/'/g,"\\'")}'
config = json.loads(config_json)

# Save VPN config using settings API
settings.set("vpn.hostname", config.get('hostname', ''))
settings.set("vpn.join_code", config.get('join_code', ''))
settings.set("vpn.auto_connect", config.get('auto_connect', False))
settings.set("vpn.enabled", config.get('enabled', False))

settings.save()

print(json.dumps({'success': True, 'message': 'VPN configuration saved successfully'}))
`,l=await o.exec(c);o.onVpnConfigSave&&o.onVpnConfigSave(l),n.vpnConfig=s,n.vpnConfigLoaded=!0,i.emit("render")}catch(a){console.error("[VPN] Failed to save config:",a),alert(`Failed to save VPN configuration: ${a.message}`)}}),i.on("vpn-connect",async s=>{if(r("vpn-connect",s),!n.isConnected){console.warn("[VPN] Not connected to device");return}try{const a=`
import husarnet
import json

try:
    # Initialize Husarnet client first
    husarnet.init()
    
    # Join with hostname and join_code as separate arguments
    husarnet.join('${s.hostname}', '${s.join_code}')
    
    ipv6 = husarnet.get_ip()
    print(json.dumps({'success': True, 'ipv6': ipv6, 'message': 'Connected to Husarnet'}))
except Exception as e:
    import sys
    sys.print_exception(e)
    print(json.dumps({'success': False, 'error': str(e)}))
`,c=await o.exec(a);o.onVpnConnect&&o.onVpnConnect(c),n.vpnConfig=s,n.vpnConfigLoaded=!0,setTimeout(()=>{i.emit("refresh-networks")},2e3),i.emit("render")}catch(a){console.error("[VPN] Failed to connect:",a),alert(`Failed to connect to VPN: ${a.message}`)}}),i.on("vpn-disconnect",async()=>{if(r("vpn-disconnect"),!n.isConnected){console.warn("[VPN] Not connected to device");return}try{const a=await o.exec(`
import husarnet
import json

try:
    husarnet.leave()
    print(json.dumps({'success': True, 'message': 'Disconnected from Husarnet'}))
except Exception as e:
    import sys
    sys.print_exception(e)
    print(json.dumps({'success': False, 'error': str(e)}))
`);o.onVpnDisconnect&&o.onVpnDisconnect(a),n.vpnConfig&&(n.vpnConfig.enabled=!1),setTimeout(()=>{i.emit("refresh-networks")},1e3),i.emit("render")}catch(s){console.error("[VPN] Failed to disconnect:",s),alert(`Failed to disconnect VPN: ${s.message}`)}}),i.on("load-gps-data",async()=>{if(r("load-gps-data"),!n.isConnected){console.warn("[GPS] Not connected to device");return}if(n.isLoadingGpsData){console.log("[GPS] Already loading GPS data, skipping");return}try{n.isLoadingGpsData=!0,i.emit("render");const a=await o.exec(`
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
`);a&&a.success&&a.data?(n.gpsData=a.data,n.gpsDataLoaded=!0,console.log("[GPS] GPS data loaded:",n.gpsData)):(n.gpsData={},n.gpsDataLoaded=!0)}catch(s){console.error("[GPS] Failed to load GPS data:",s),n.gpsData={},n.gpsDataLoaded=!0}finally{n.isLoadingGpsData=!1,i.emit("render")}}),i.on("refresh-gps-data",async()=>{r("refresh-gps-data"),n.gpsDataLoaded=!1,i.emit("load-gps-data")}),i.on("refresh-system-info",async()=>{if(!n.isConnected){console.warn("[System Info] Not connected, cannot refresh system info");return}if(n.isLoadingSystemInfo){console.log("[System Info] Already loading, skipping");return}n.isLoadingSystemInfo=!0,i.emit("render");try{const s=await getSystemInfo(o);n.systemInfo=s,console.log("[System Info] Loaded:",s)}catch(s){console.error("[System Info] Failed to load:",s),n.systemInfo=null}finally{n.isLoadingSystemInfo=!1,i.emit("render")}}),i.on("refresh-networks",async()=>{if(r("refresh-networks"),!n.isConnected){console.warn("[Networks] Not connected, cannot refresh networks");return}if(n.isLoadingNetworks){console.log("[Networks] Already loading, skipping");return}n.isLoadingNetworks=!0,i.emit("render");try{const s=await getNetworksInfo(o);n.networksInfo=s,console.log("[Networks] Loaded:",s)}catch(s){console.error("[Networks] Failed to load:",s),n.networksInfo=null}finally{n.isLoadingNetworks=!1,i.emit("render")}}),i.on("load-eth-config",async()=>{if(r("load-eth-config"),!n.isConnected){console.warn("[Ethernet] Not connected to device");return}if(n.isLoadingEthConfig){console.log("[Ethernet] Already loading config, skipping");return}try{n.isLoadingEthConfig=!0,i.emit("render");const a=await o.exec(`
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
`);o.onEthConfig&&o.onEthConfig(a)}catch(s){console.error("[Ethernet] Failed to load config:",s),n.isLoadingEthConfig=!1,i.emit("render")}}),i.on("save-eth-config",async s=>{if(r("save-eth-config",s),!n.isConnected){console.warn("[Ethernet] Not connected to device");return}try{const c=`
from lib.sys import settings
import json

config_json = '${JSON.stringify(s).replace(/'/g,"\\'")}'
config = json.loads(config_json)

# Save config using settings API
settings.set("ethernet.dhcp", config.get('dhcp', True))
if config.get('static_ip'):
    settings.set("ethernet.static_ip", config.get('static_ip'))
else:
    settings.set("ethernet.static_ip", None)

settings.save()

print(json.dumps({'success': True, 'message': 'Ethernet configuration saved'}))
`,l=await o.exec(c);o.onEthConfigSave&&o.onEthConfigSave(l),n.ethConfig=s,i.emit("render")}catch(a){console.error("[Ethernet] Failed to save config:",a),alert(`Failed to save Ethernet configuration: ${a.message}`)}}),i.on("init-ethernet",async()=>{if(r("init-ethernet"),!n.isConnected){console.warn("[Ethernet] Not connected to device");return}try{n.isInitializingEth=!0,i.emit("render");const a=await o.exec(`
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
`);o.onEthInit&&o.onEthInit(a),n.isInitializingEth=!1,i.emit("refresh-networks")}catch(s){console.error("[Ethernet] Failed to initialize:",s),n.isInitializingEth=!1,alert(`Failed to initialize Ethernet: ${s.message}`),i.emit("render")}}),i.on("refresh-eth-status",async()=>{if(r("refresh-eth-status"),!!n.isConnected)try{const a=await o.exec(`
from lib.sys.network import eth
import json
print(json.dumps(eth.get_status()))
`);o.onEthStatus&&o.onEthStatus(a)}catch(s){console.error("[Ethernet] Failed to get status:",s)}})}function registerHardwareConfigHandlers(n,i,o){const r=console.log;i.on("toggle-peripherals-menu",()=>{r("toggle-peripherals-menu"),n.expandedPeripherals=!n.expandedPeripherals,i.emit("render")}),i.on("change-peripherals-panel",s=>{r("change-peripherals-panel:",s),n.activePeripheralsPanel=s,n.activeNetworkPanel=null,n.activeSystemPanel=null,n.activeExtension=null,n.activeExtensionPanel=null,n.systemSection=`peripherals:${s}`,s==="gps"&&n.isConnected&&!n.gpsDataLoaded&&!n.isLoadingGpsData&&i.emit("load-gps-data"),s==="sdcard"&&n.isConnected&&(!n.sdcardConfigLoaded&&!n.isLoadingSdcardConfig&&i.emit("load-sdcard-config"),n.sdcardInfo=null,i.emit("sdcard-get-info")),i.emit("render")}),i.on("load-sdcard-config",async()=>{if(r("load-sdcard-config"),!n.isConnected){console.warn("[SD Card] Not connected to device");return}if(n.isLoadingSdcardConfig){console.log("[SD Card] Already loading config, skipping");return}try{n.isLoadingSdcardConfig=!0;const a=await o.exec(`
import json
try:
    with open('/settings/sdcard.json', 'r') as f:
        config = json.load(f)
    print(json.dumps({'success': True, 'config': config}))
except OSError:
    print(json.dumps({'success': True, 'config': {'mountPoint': '/sd', 'autoMount': False}}))
except Exception as e:
    print(json.dumps({'success': False, 'error': str(e)}))
`);o.onSdcardConfig&&o.onSdcardConfig(a)}catch(s){console.error("[SD Card] Failed to load config:",s),n.isLoadingSdcardConfig=!1}}),i.on("save-sdcard-config",async s=>{if(r("save-sdcard-config",s),!n.isConnected){console.warn("[SD Card] Not connected to device");return}try{const c=`
import json
import os
config_json = '${JSON.stringify(s).replace(/'/g,"\\'")}'
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
`,l=await o.exec(c);o.onSdcardConfigSave&&o.onSdcardConfigSave(l),n.sdcardConfig=s,i.emit("render")}catch(a){console.error("[SD Card] Failed to save config:",a),alert(`Failed to save SD Card configuration: ${a.message}`)}}),i.on("sdcard-unmount",async()=>{if(r("sdcard-unmount"),!n.isConnected){console.warn("[SD Card] Not connected to device");return}if(n.isUnmountingSDCard){console.log("[SD Card] Already unmounting, skipping");return}try{n.isUnmountingSDCard=!0,i.emit("render");const c=`
import os
import json

mount_point = '${(n.sdcardConfig||{mountPoint:"/sd"}).mountPoint||"/sd"}'

try:
    os.umount(mount_point)
except OSError:
    pass

# Deinit and remove the global sd object
try:
    import builtins
    if hasattr(builtins, 'sd'):
        builtins.sd.deinit()
        del builtins.sd
except:
    pass

import gc
gc.collect()
print(json.dumps({'success': True, 'message': 'SD card unmounted successfully'}))
`,l=await o.exec(c);o.onSdcardUnmount&&o.onSdcardUnmount(l)}catch(s){console.error("[SD Card] Failed to unmount:",s),n.isUnmountingSDCard=!1,alert(`Failed to unmount SD card: ${s.message}`),i.emit("render")}}),i.on("sdcard-mount",async()=>{if(r("sdcard-mount"),!n.isConnected){console.warn("[SD Card] Not connected to device");return}if(n.isMountingSDCard){console.log("[SD Card] Already mounting, skipping");return}try{n.isMountingSDCard=!0,i.emit("render");const c=`
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
            freq=4000000
        )
        import builtins
        builtins.sd = sd
        
        info = sd.info()
        capacity_gb = (info[0] * info[1]) / (1024**3)
        log_msg(f"✓ {capacity_gb:.1f} GB card detected")
        
        # Mount filesystem
        mount_point = '${(n.sdcardConfig||{mountPoint:"/sd"}).mountPoint||"/sd"}'
        log_msg(f"Mounting to {mount_point}...")
        try:
            os.mkdir(mount_point)
        except OSError:
            pass
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
            'cardCapacity': info[0],
            'sectorSize': info[1],
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
`,l=await o.exec(c);o.onSdcardMount&&o.onSdcardMount(l)}catch(s){console.error("[SD Card] Failed to mount:",s),n.isMountingSDCard=!1,alert(`Failed to mount SD card: ${s.message}`),i.emit("render")}}),i.on("sdcard-get-info",async()=>{if(r("sdcard-get-info"),!n.isConnected){console.warn("[SD Card] Not connected to device");return}if(n.isLoadingSdcardInfo){console.log("[SD Card] Already loading info, skipping");return}try{n.isLoadingSdcardInfo=!0,i.emit("render");const c=`
import os
import json

mount_point = '${(n.sdcardConfig||{mountPoint:"/sd"}).mountPoint||"/sd"}'

try:
    # Check if mount point exists using os.stat() (NOT listdir - crashes P4+C6)
    os.stat(mount_point)
    
    # Get physical card capacity from sd.info()
    card_capacity = 0
    sector_size = 0
    try:
        _ci = sd.info()
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
    # Mount point doesn't exist or not mounted
    print(json.dumps({'success': False, 'error': f'SD Card not mounted at {mount_point}'}))
except Exception as e:
    print(json.dumps({'success': False, 'error': str(e)}))
`,l=await o.exec(c);o.onSdcardInfo&&o.onSdcardInfo(l)}catch(s){console.error("[SD Card] Failed to get info:",s),n.isLoadingSdcardInfo=!1,n.sdcardInfo={error:`Failed to get storage info: ${s.message}`},i.emit("render")}})}const STATUS_INFO_POLL_INTERVAL=1e4;let statusInfoPollInterval=null,statusInfoPollingEnabled=!1;function startStatusInfoPolling$1(n,i,o){stopStatusInfoPolling$1(),statusInfoPollingEnabled=!0;let r=null;statusInfoPollInterval=setInterval(async()=>{if(!statusInfoPollingEnabled)return;if(!i.isConnected||!n){stopStatusInfoPolling$1();return}const s=i.isTransferring,a=i.installingDependencies,c=n.isFileOperationActive&&n.isFileOperationActive(),l=n.isCommandRunning&&n.isCommandRunning();if(s||a||c||l){const d=s?"transferring":c?"fileOp":l?"command":"deps";d!==r&&(console.log(`[Store] Status info polling paused: ${d}`),r=d);return}r&&(console.log("[Store] Status info polling resuming"),r=null);try{const d=await n.exec("getStatusInfo()");d&&(i.statusInfo=d,updateStatusBarDirectly(d,i.temperatureUnit||"degC"))}catch(d){console.debug("[Store] Status info poll failed:",d.message)}},STATUS_INFO_POLL_INTERVAL)}function stopStatusInfoPolling$1(){statusInfoPollingEnabled=!1,statusInfoPollInterval&&(clearInterval(statusInfoPollInterval),statusInfoPollInterval=null,console.log("[Store] Stopped status info polling"))}function registerConnectionHandlers(n,i,o,r,s){i.on("disconnected",()=>{stopStatusInfoPolling$1(),n.isConnected=!1,n.connectionMode="none",n.panelHeight=PANEL_CLOSED$1,n.boardFiles=[],n.boardNavigationPath="/",n.filesLoadedOnce=!1,n.isTransferring=!1,n.transferringProgress="",n.isSaving=!1,n.savingProgress=0,n.isRemoving=!1,n.bannerDisplayed=!1,n.systemInfoAttempted=!1,i.emit("refresh-files"),i.emit("render"),n.isResettingHard&&(n.isResettingHard=!1,setTimeout(()=>{i.emit("open-connection-dialog")},100))}),i.on("disconnect",async()=>{await o.disconnect()}),i.on("connection-timeout",async()=>{n.isConnected=!1,n.isConnecting=!1,n.isConnectionDialogOpen=!0,i.emit("render")}),i.on("connect",async()=>{i.emit("open-connection-dialog")}),i.on("connect-webrepl",async({wsUrl:a,password:c})=>{a&&localStorage.setItem("webrepl-url",a),c&&localStorage.setItem("webrepl-password",c),n.isConnecting=!0,i.emit("render"),updateOverlayDirectly(n);const l=n.cache(XTerm,"terminal");l&&l.term&&l.bindInput(n,o),s(n);try{await o.connect(a,c),n.isConnecting=!1,n.isConnected=!0,n.connectionMode="webrepl",updateOverlayDirectly(n),n.boardNavigationPath="/",n.connectedPort=a,r(),i.emit("render"),n.systemSection==="file-manager"&&i.emit("refresh-files"),o.onConnectionClosed(()=>i.emit("disconnected")),o.subscribe("status_info",u=>{const p=!n.statusInfo&&u;n.statusInfo=u,p?i.emit("render"):updateStatusBarDirectly(u,n.temperatureUnit||"degC")}),o.subscribe("log",u=>{console.debug("[Connection] LOG event handler called with:",u),i.emit("log:add",u)}),o.onPlotData=u=>{},o.onDisplayUi=u=>{console.log("[ScriptO UI] Display UI command received:",u),i.emit("open-scriptos-ui-modal",u)},o.onWwanStatus=u=>{console.log("[WWAN] Status event received:",u),n.wwanStatus=u,i.emit("render")},o.onMqttConfig=u=>{console.log("[MQTT] Config received:",u),n.isLoadingMqttConfig=!1,n.mqttConfigLoaded=!0,u.success&&u.config?n.mqttConfig=u.config:n.mqttConfig={},i.emit("render")},o.onMqttConfigSave=u=>{console.log("[MQTT] Config save response:",u),u.success?i.emit("render"):alert(`Failed to save MQTT configuration: ${u.error||"Unknown error"}`)},o.onWwanConfig=u=>{console.log("[WWAN] Config received:",u),n.isLoadingWwanConfig=!1,n.wwanConfigLoaded=!0,u.success&&u.config?(n.wwanConfig=u.config,n.wwanConfig.auto_init_modem===void 0&&(n.wwanConfig.auto_init_modem=!0)):n.wwanConfig={auto_init_modem:!0},i.emit("render")},o.onWwanConfigSave=u=>{console.log("[WWAN] Config save response:",u),u.success?i.emit("render"):alert(`Failed to save WWAN configuration: ${u.error||"Unknown error"}`)},o.onModemStatus=u=>{console.log("[Modem] Status received:",u),n.isLoadingModemStatus=!1,n.modemStatusLoaded=!0,n.modemStatus=u,i.emit("render")},o.onNtpSync=(u,p)=>{if(console.log("[NTP] Sync response:",u),u.success){n.ntpConfig||(n.ntpConfig={server:"pool.ntp.org",tzOffset:0,timezone:"UTC",autoDetect:!1,autoSync:!1});const g=p?.autoDetect??n.ntpConfig.autoDetect??!1,f=p?.autoSync??n.ntpConfig.autoSync??!1,h=n.ntpConfig.timezone??"UTC";u.ntp_server?n.ntpConfig.server=u.ntp_server:p?.server&&(n.ntpConfig.server=p.server),u.tz_offset!==void 0?n.ntpConfig.tzOffset=u.tz_offset:p?.tzOffset!==void 0&&(n.ntpConfig.tzOffset=p.tzOffset),n.ntpConfig.autoDetect=g,n.ntpConfig.autoSync=f,n.ntpConfig.timezone=h,n.ntpSyncResult={utc:u.utc,local:u.local,timestamp:Date.now()},i.emit("render")}else alert(`NTP sync failed: ${u.error||"Unknown error"}`)},o.onNtpConfig=u=>{console.log("[NTP] Config received:",u),n.isLoadingNtpConfig=!1,n.ntpConfigLoaded=!0,u.success&&u.config&&(n.ntpConfig={server:u.config.server||"pool.ntp.org",tzOffset:u.config.tz_offset||0,timezone:u.config.timezone||"UTC",autoDetect:u.config.auto_detect||!1,autoSync:u.config.auto_sync||!1},u.current_time&&(n.ntpSyncResult={utc:u.current_time.utc,local:u.current_time.local,timestamp:Date.now()})),i.emit("render")},o.onNtpConfigSave=u=>{if(console.log("[NTP] Config save response:",u),u.success)i.emit("render");else{const p=new Error(u.error||"Unknown error");i.emit("ntp-config-save-error",p),alert(`Failed to save NTP configuration: ${p.message}`)}},o.onCanConfig=u=>{console.log("[CAN] Config received:",u),n.isLoadingCanConfig=!1,n.canConfigLoaded=!0,u.success&&u.config&&(n.canConfig={txPin:u.config.txPin||5,rxPin:u.config.rxPin||4,bitrate:u.config.bitrate||5e5,enabled:u.config.enabled!==void 0?u.config.enabled:!0,loopback:u.config.loopback||!1},i.emit("render"))},o.onCanConfigSave=u=>{console.log("[CAN] Config save response:",u),u.success?(i.emit("render"),alert("CAN configuration saved successfully. Device restart required for changes to take effect.")):alert(`Failed to save CAN configuration: ${u.error||"Unknown error"}`)},o.onVpnConfig=u=>{console.log("[VPN] Config received:",u),n.isLoadingVpnConfig=!1,n.vpnConfigLoaded=!0,u.success&&u.config?n.vpnConfig={hostname:u.config.hostname||"",join_code:u.config.join_code||"",auto_connect:u.config.auto_connect||!1,enabled:u.config.enabled||!1}:n.vpnConfig={hostname:"",join_code:"",auto_connect:!1,enabled:!1},i.emit("render")},o.onVpnConfigSave=u=>{console.log("[VPN] Config save response:",u),u.success?i.emit("render"):alert(`Failed to save VPN configuration: ${u.error||"Unknown error"}`)},o.onVpnConnect=u=>{console.log("[VPN] Connect response:",u),u.success?(alert(u.message||"Connected to VPN successfully!"),i.emit("refresh-networks")):alert(`Failed to connect to VPN: ${u.error||"Unknown error"}`),i.emit("render")},o.onVpnDisconnect=u=>{console.log("[VPN] Disconnect response:",u),u.success?(alert(u.message||"VPN disconnected."),i.emit("refresh-networks")):alert(`Failed to disconnect VPN: ${u.error||"Unknown error"}`),i.emit("render")},o.onVpnInfo=u=>{console.log("[VPN] Info received:",u),n.networksInfo&&(n.networksInfo.vpn=u),i.emit("render")},o.onSdcardConfig=u=>{console.log("[SD Card] Config received:",u),n.isLoadingSdcardConfig=!1,n.sdcardConfigLoaded=!0,u.success&&u.config?n.sdcardConfig={mountPoint:u.config.mountPoint||"/sd",autoMount:u.config.autoMount||!1}:n.sdcardConfig={mountPoint:"/sd",autoMount:!1},i.emit("render")},o.onSdcardConfigSave=u=>{console.log("[SD Card] Config save response:",u),u.success?i.emit("render"):alert(`Failed to save SD Card configuration: ${u.error||"Unknown error"}`)},o.onSdcardInfo=u=>{console.log("[SD Card] Info received:",u),n.isLoadingSdcardInfo=!1,u.success&&u.info?(!u.info.cardCapacity&&n.sdcardInfo&&n.sdcardInfo.cardCapacity&&(u.info.cardCapacity=n.sdcardInfo.cardCapacity,u.info.sectorSize=n.sdcardInfo.sectorSize),n.sdcardInfo=u.info):n.sdcardInfo={error:u.error||"Failed to get storage information"},i.emit("render")},o.onSdcardMount=u=>{if(console.log("[SD Card] Mount response:",u),n.isMountingSDCard=!1,u.success){const p=u.log?u.log.join(`
`):"SD card mounted successfully";console.log(`[SD Card] Mount log:
`+p),u.info&&(n.sdcardInfo=u.info)}else{const p=u.error||"Unknown error",g=u.log?`

Log:
`+u.log.join(`
`):"";alert("Failed to mount SD card: "+p+g),n.sdcardInfo={error:p}}i.emit("render")},o.onSdcardUnmount=u=>{if(console.log("[SD Card] Unmount response:",u),n.isUnmountingSDCard=!1,u.success)console.log("[SD Card] Unmounted successfully"),n.sdcardInfo=null;else{const p=u.error||"Unknown error";alert("Failed to unmount SD card: "+p)}i.emit("render")},o.onGpioConfig=u=>{console.log("[GPIO] Config received:",u),n.isLoadingGpioConfig=!1,n.gpioConfigLoaded=!0,u.success&&u.config?n.gpioConfig=u.config:(u.chipInfo?n.gpioConfig={version:"1.0",assignments:{OUT:{digital:{PP:[],HS:[],LS:[]}},IN:{digital:{PU:[],PD:[],FLOAT:[]}},SPI0:{MISO:null,MOSI:null,SCLK:null,CS:null},SPI1:{MISO:null,MOSI:null,SCLK:null,CS:null},I2C0:{SDA:null,SCL:null},I2C1:{SDA:null,SCL:null},UART0:{TXD:null,RXD:null},UART1:{TXD:null,RXD:null},UART2:{TXD:null,RXD:null},CAN:{TX:null,RX:null},PWM:{channels:{}},NEO:{DIN:null,count:0},BUZZ:{PWM:null},BOOT:{pin:0,mode:"INPUT_PULLUP"},SDCARD:{CMD:null,CLK:null,D0:null,D1:null,D2:null,D3:null,mode:"SPI"},BRIDGE:{0:{HS:null,LS:null},1:{HS:null,LS:null}},USB:{DP:null,DM:null,enabled:!1}},metadata:{...u.chipInfo,board:u.chipInfo.board||"Unknown",modified:null}}:n.gpioConfig=null,console.warn("[GPIO] Config not found, using defaults with chip info")),i.emit("render")},o.onGpioConfigSave=u=>{console.log("[GPIO] Config save response:",u),u.success?(alert("GPIO configuration saved successfully"),i.emit("render")):alert(`Failed to save GPIO configuration: ${u.error||"Unknown error"}`)},o.onEthConfig=u=>{console.log("[Ethernet] Config received:",u),n.isLoadingEthConfig=!1,n.ethConfigLoaded=!0,u.success?(n.ethConfig=u.config||{},n.ethStatus=u.status||{}):(n.ethConfig={enabled:!0,dhcp:!0},console.warn("[Ethernet] Config not found, using defaults")),i.emit("render")},o.onEthConfigSave=u=>{console.log("[Ethernet] Config save response:",u),u.success?alert("Ethernet configuration saved successfully"):alert(`Failed to save Ethernet configuration: ${u.error||"Unknown error"}`),i.emit("render")},o.onEthInit=u=>{console.log("[Ethernet] Init response:",u),n.isInitializingEth=!1,u.success&&u.status?(n.ethStatus=u.status,u.status.gotip?alert(`Ethernet connected: ${u.status.ip}`):u.status.linkup?alert("Ethernet link up, waiting for DHCP..."):alert("Ethernet initialized (no cable detected)")):alert(`Ethernet initialization failed: ${u.error||"Unknown error"}`),i.emit("render")},o.onEthStatus=u=>{console.log("[Ethernet] Status received:",u),n.ethStatus=u,i.emit("render")},window.handleIframeMessage=async u=>{if(!u.data||u.data.type!=="execute")return;const{id:p,code:g}=u.data;console.log("[Iframe Bridge] Executing code from iframe:",g.substring(0,50)+"...");try{const f=await o.run(g,!0);console.log("[Iframe Bridge] Raw output from device:",f.substring(0,200));const h=f.indexOf("{");let m=f;if(h!==-1){let v=0,y=-1;for(let b=h;b<f.length;b++)if(f[b]==="{"&&v++,f[b]==="}"&&v--,v===0){y=b+1;break}y!==-1&&(m=f.substring(h,y),console.log("[Iframe Bridge] Extracted JSON:",m.substring(0,100)+"..."))}u.source.postMessage({type:"result",id:p,data:m},"*"),console.log("[Iframe Bridge] Result sent to iframe")}catch(f){console.log("[Iframe Bridge] Error executing code:",f),u.source.postMessage({type:"error",id:p,error:f.message||"Execution failed"},"*")}},window.addEventListener("message",window.handleIframeMessage);const d=n.cache(XTerm,"terminal");d&&d.term&&d.term.clear(),n.panelHeight=PANEL_DEFAULT$1,i.emit("open-panel"),i.emit("close-connection-dialog");try{const u=await o.exec("getStatusInfo()");u&&(n.statusInfo=u,i.emit("render"))}catch{}startStatusInfoPolling$1(o,n,i),i.emit("refresh-system-info"),setTimeout(()=>{i.emit("terminal-focus")},200),(async()=>{try{const u=await o.exec(`
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
        hardware = config.get('devices')
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
`),p=typeof u=="object"?u:JSON.parse(u.trim());n.boardConfig={board_id:p.board_id,board_name:p.board_name,chip:p.chip,version:p.version,description:p.description,hardware:p.hardware};try{const f=new URL(a).hostname,h=p.board_id||f.replace(/\\./g,"-");await BridgeDisk.addOnboardedDevice(h,{hostname:f,url:a,board_id:p.board_id,board_name:p.board_name,chip:p.chip,version:p.version,connectedAt:new Date().toISOString()}),console.log("[Connection] Device saved to /onboarded/"),n.needsOnboarding=!1}catch(g){console.warn("[Connection] Could not save device to /onboarded/:",g)}i.emit("render")}catch(u){console.error("[BoardConfig] Failed to load board config:",u)}})(),i.emit("render")}catch(d){let u="Connection failed";d instanceof Error||d&&d.message?u=d.message:d&&d.type==="error"&&(u=`WebSocket connection failed. Check if device is available at ${a}`),console.log("✗ Connection failed:",u),n.isConnecting=!1,n.isConnected=!1,updateOverlayDirectly(n),i.emit("render")}}),i.on("open-reset-dialog",()=>{n.isResetDialogOpen=!0,i.emit("render")}),i.on("close-reset-dialog",()=>{n.isResetDialogOpen=!1,i.emit("render")}),i.on("trigger-reset",async a=>{n.isResetDialogOpen=!1,i.emit("render");try{a===1?(console.log("[Connection] Triggering Hard Reset"),n.isResettingHard=!0,await o.reset(1),console.log("[Connection] Hard reset sent, waiting for disconnect...")):(console.log("[Connection] Triggering Soft Reset"),await o.reset(0))}catch(c){console.error("[Connection] Reset failed:",c),n.isResettingHard=!1,alert("Reset failed: "+c.message)}}),i.on("bind-terminal-input",()=>{const a=n.cache(XTerm,"terminal");!a||!a.term||a.bindInput(n,o)&&console.log("[Connection] Bound terminal input after view change")}),i.on("terminal-focus",async()=>{if(console.debug("[Connection] terminal-focus event received, isConnected:",n.isConnected,"bannerDisplayed:",n.bannerDisplayed),!n.isConnected||n.bannerDisplayed){console.debug("[Connection] Skipping banner: not connected or already displayed");return}const a=n.cache(XTerm,"terminal");if(!a||!a.term){console.log("[Connection] Skipping banner: terminal component not available");return}const c=a.term;try{console.log("[Connection] Fetching banner data...");const l=await o.exec(`
import os, json
u = os.uname()
print(json.dumps({"name": "ScriptO Studio", "version": u.version, "machine": u.machine}))
`);if(console.log("[Connection] banner() returned:",l),l&&l.name){const d=l.name,u=`MicroPython ${l.version} on ${l.machine}`,g=(await convertToAsciiArt(d,null)).split(/\r?\n/).filter(h=>h.trim().length>0);let f=`\r\x1B[K\x1B[38;05;208;1m\r
`;for(const h of g)f+="  "+h+`\r
`;f+=`\r
\x1B[1;32m`+u+`\x1B[0m\r
`,f+=`\x1B[0mType "help()" for more information.\r
`,c.write(f),c.write(TERMINAL_PROMPT),c.scrollToBottom(),n.bannerDisplayed=!0,console.log("[Connection] Welcome banner displayed")}}catch(l){console.debug("[Connection] Failed to fetch banner:",l.message)}})}function registerFileOperationHandlers(n,i,o,r,s,a,c){i.on("save",async()=>{if(console.log("save"),canSave({isConnected:n.isConnected,openFiles:n.openFiles,editingFile:n.editingFile})==!1){console.log("can't save");return}n.isSaving=!0,updateOverlayDirectly(n);let d=n.openFiles.find(m=>m.id===n.editingFile),u=!1;const p=d.parentFolder,g=p===null;g&&(d.source=="board"?d.parentFolder=n.boardNavigationPath:d.source=="disk"&&(d.parentFolder=n.diskNavigationPath));let f=!1;if(d.source=="board"?f=await fileExists(BridgeDevice,getFullPath(n.boardNavigationRoot,d.parentFolder,d.fileName)):d.source=="disk"&&(f=await r.fileExists(r.getFullPath(n.diskNavigationRoot,d.parentFolder,d.fileName))),(g||!f)&&(d.source=="board"?(d.parentFolder=n.boardNavigationPath,u=await fileExists(BridgeDevice,getFullPath(n.boardNavigationRoot,d.parentFolder,d.fileName))):d.source=="disk"&&(d.parentFolder=n.diskNavigationPath,u=await r.fileExists(r.getFullPath(n.diskNavigationRoot,d.parentFolder,d.fileName)))),u&&await confirmDialog(`You are about to overwrite the file ${d.fileName} on your ${d.source}.

 Are you sure you want to proceed?`)!==0){n.isSaving=!1,d.parentFolder=p,updateOverlayDirectly(n),i.emit("render");return}let h=d.editor.content||"";if(d.fileName&&d.fileName.toLowerCase().endsWith(".json"))try{const m=h.trim();if(m&&(m[0]==="{"||m[0]==="[")){const v=JSON.parse(m),y=JSON.stringify(v,null,2)+`
`;y!==h&&(h=y)}}catch{}try{if(d.source=="board"){if(["main.py","boot.py"].includes(d.fileName)&&await confirmDialog(`⚠️ Warning: Saving '${d.fileName}' to device may cause disconnection.

This file is running on the device. Overwriting it may crash the connection.

Recommended: Save locally instead (to disk), then reconnect.

Continue saving to device?`,"Cancel","OK")!==0){n.isSaving=!1,updateOverlayDirectly(n),i.emit("render");return}await o.saveFile(getFullPath(n.boardNavigationRoot,d.parentFolder,d.fileName),h,{progressCallback:v=>{n.savingProgress=v,i.emit("render")}})}else d.source=="disk"&&await r.saveFileContent(r.getFullPath(n.diskNavigationRoot,d.parentFolder,d.fileName),h)}catch(m){console.log("error",m)}d.hasChanges=!1,n.isSaving=!1,n.savingProgress=0,updateOverlayDirectly(n),i.emit("refresh-files"),i.emit("render")}),i.on("select-tab",l=>{if(console.log("select-tab",l),!n.openFiles.find(u=>u.id===l)){console.warn("[select-tab] Tab not found:",l);return}n.editingFile=l,i.emit("render")}),i.on("close-tab",async l=>{console.log("close-tab",l);const d=n.openFiles.find(u=>u.id===l);if(!d){console.warn("[close-tab] Tab not found:",l);return}if(d.hasChanges&&await confirmDialog("Your file has unsaved changes. Are you sure you want to proceed?")!==0)return!1;n.openFiles=n.openFiles.filter(u=>u.id!==l),n.openFiles.length>0?n.editingFile=n.openFiles[0].id:await a("disk"),i.emit("render")}),i.on("refresh-board-files",async()=>{if(console.log("refresh-board-files"),n.isConnected)try{n.boardFiles=await getBoardFiles(getFullPath(n.boardNavigationRoot,n.boardNavigationPath,""))}catch{n.boardFiles=[]}else n.boardFiles=[];i.emit("refresh-selected-files"),i.emit("render")}),i.on("refresh-disk-files",async()=>{console.log("refresh-disk-files");try{n.diskFiles=await getDiskFiles(r.getFullPath(n.diskNavigationRoot,n.diskNavigationPath,""))}catch(l){console.error("[FS] Error refreshing disk files:",l),n.diskNavigationRoot=null,n.diskNavigationPath="/"}i.emit("refresh-selected-files"),i.emit("render")}),i.on("refresh-files",async()=>{if(console.log("refresh-files"),n.isLoadingFiles)return;n.isLoadingFiles=!0;const l=document.getElementById("overlay");l?(l.classList.remove("closed"),l.classList.add("open"),l.innerHTML="<p>Loading files...</p>"):i.emit("render");try{await Promise.all([(async()=>{if(n.isConnected)try{n.boardFiles=await getBoardFiles(getFullPath(n.boardNavigationRoot,n.boardNavigationPath,""))}catch{n.boardFiles=[]}else n.boardFiles=[]})(),(async()=>{try{n.diskFiles=await getDiskFiles(r.getFullPath(n.diskNavigationRoot,n.diskNavigationPath,""))}catch(d){console.error("[FS] Error refreshing files:",d),n.diskNavigationRoot=null,n.diskNavigationPath="/"}})()])}finally{n.isLoadingFiles=!1,i.emit("refresh-selected-files");const d=document.getElementById("overlay");d&&(d.classList.remove("open"),d.classList.add("closed")),n.systemSection==="file-manager"&&i.emit("render")}}),i.on("refresh-selected-files",()=>{n.selectedFiles=n.selectedFiles.filter(l=>l.source==="board"?n.isConnected?n.boardFiles.find(d=>l.fileName===d.fileName):!1:n.diskFiles.find(d=>l.fileName===d.fileName)),i.emit("render")}),i.on("create-new-tab",async(l,d=null)=>{const u=l=="board"?n.boardNavigationPath:n.diskNavigationPath;console.log("create-new-tab",l,d,u),await a(l,d,u)&&(i.emit("close-new-file-dialog"),i.emit("render"))}),i.on("create-file",(l,d=null)=>{console.log("create-file",l),n.creatingFile===null&&(n.creatingFile=l,n.creatingFolder=null,d!=null&&i.emit("finish-creating-file",d),i.emit("render"))}),i.on("finish-creating-file",async l=>{if(console.log("finish-creating",l),!n.creatingFile)return;if(!l){n.creatingFile=null,i.emit("render");return}if(n.creatingFile=="board"&&n.isConnected){if(await checkBoardFile({root:n.boardNavigationRoot,parentFolder:n.boardNavigationPath,fileName:l})&&await confirmDialog(`You are about to overwrite the file ${l} on your board.

Are you sure you want to proceed?`)!==0){n.creatingFile=null,i.emit("render");return}if(["main.py","boot.py"].includes(l)&&await confirmDialog(`⚠️ Warning: Saving '${l}' to device may cause disconnection.

This file is running on the device. Overwriting it may crash the connection.

Recommended: Save locally instead (to disk), then reconnect.

Continue saving to device?`)!==0){n.creatingFile=null,i.emit("render");return}await o.saveFile(getFullPath(n.boardNavigationRoot,n.boardNavigationPath,l),newFileContent)}else if(n.creatingFile=="disk"){if(await checkDiskFile({root:n.diskNavigationRoot,parentFolder:n.diskNavigationPath,fileName:l})&&await confirmDialog(`You are about to overwrite the file ${l} on your disk.

Are you sure you want to proceed?`)!==0){n.creatingFile=null,i.emit("render");return}await r.saveFileContent(r.getFullPath(n.diskNavigationRoot,n.diskNavigationPath,l),newFileContent)}const d=n.creatingFile;setTimeout(()=>{n.creatingFile=null,dismissOpenDialogs(n,i),d==="disk"?i.emit("refresh-disk-files"):i.emit("refresh-board-files"),i.emit("render")},200)}),i.on("import-files",async()=>{console.log("import-files");try{const l=r.getFullPath(n.diskNavigationRoot,n.diskNavigationPath,""),d=await r.importFiles(l);d.length>0&&(console.log(`[Store] Imported ${d.length} file(s):`,d.map(u=>u.name).join(", ")),i.emit("refresh-disk-files"),i.emit("render"))}catch(l){console.error("[Store] Error importing files:",l),alert(`Failed to import files: ${l.message}`)}}),i.on("upload-to-device",async()=>{if(console.log("upload-to-device"),!n.isConnected){alert("Please connect to device first");return}try{const l=document.createElement("input");l.type="file",l.multiple=!0;const d=await new Promise((g,f)=>{l.onchange=h=>{g(Array.from(h.target.files||[]))},l.oncancel=()=>g([]),l.click()});if(d.length===0)return;n.isTransferring=!0,updateOverlayDirectly(n);const u=d.map(g=>g.name),p=await checkOverwrite({source:"board",fileNames:u,parentPath:getFullPath(n.boardNavigationRoot,n.boardNavigationPath,"")});if(p.length>0){let g=`You are about to overwrite the following files/folders on your board:

`;if(p.forEach(h=>g+=`${h.fileName}
`),g+=`
Are you sure you want to proceed?`,await confirmDialog(g,"Cancel","Yes")!==0){n.isTransferring=!1,updateOverlayDirectly(n),i.emit("render");return}}for(const g of d){const f=getFullPath(n.boardNavigationRoot,n.boardNavigationPath,g.name),h=await g.arrayBuffer(),m=new Uint8Array(h);await o.saveFile(f,m,{progressCallback:v=>{n.transferringProgress=`${g.name}: ${v}%`,i.emit("render")}}),n.transferringProgress=""}i.emit("refresh-files"),i.emit("render")}catch(l){console.error("[Store] Error uploading to device:",l),alert(`Failed to upload files: ${l.message}`)}finally{n.isTransferring=!1,n.transferringProgress="",updateOverlayDirectly(n),i.emit("render")}}),i.on("create-folder",l=>{console.log("create-folder",l),n.creatingFolder===null&&(n.creatingFolder=l,n.creatingFile=null,i.emit("render"))}),i.on("finish-creating-folder",async l=>{if(console.log("finish-creating-folder",l),!!n.creatingFolder){if(!l){n.creatingFolder=null,i.emit("render");return}if(n.creatingFolder=="board"&&n.isConnected){if(await checkBoardFile({root:n.boardNavigationRoot,parentFolder:n.boardNavigationPath,fileName:l})){if(await confirmDialog(`You are about to overwrite ${l} on your board.

Are you sure you want to proceed?`)!==0){n.creatingFolder=null,i.emit("render");return}await removeBoardFolder(getFullPath(n.boardNavigationRoot,n.boardNavigationPath,l))}await createFolder(o,getFullPath(n.boardNavigationRoot,n.boardNavigationPath,l))}else if(n.creatingFolder=="disk"){if(await checkDiskFile({root:n.diskNavigationRoot,parentFolder:n.diskNavigationPath,fileName:l})){if(await confirmDialog(`You are about to overwrite ${l} on your disk.

Are you sure you want to proceed?`)!==0){n.creatingFolder=null,i.emit("render");return}await r.removeFolder(r.getFullPath(n.diskNavigationRoot,n.diskNavigationPath,l))}await r.createFolder(r.getFullPath(n.diskNavigationRoot,n.diskNavigationPath,l))}setTimeout(()=>{n.creatingFolder=null,i.emit("refresh-files"),i.emit("render")},200)}}),i.on("remove-files",async()=>{console.log("remove-files");let l=n.selectedFiles.filter(h=>h.source==="board").map(h=>h.fileName),d=n.selectedFiles.filter(h=>h.source==="disk").map(h=>h.fileName),u=`You are about to delete the following files:

`;if(l.length&&(u+=`From your board:
`,l.forEach(h=>u+=`${h}
`),u+=`
`),d.length&&(u+=`From your disk:
`,d.forEach(h=>u+=`${h}
`),u+=`
`),u+="Are you sure you want to proceed?",await confirmDialog(u)!==0){i.emit("render");return}let g=!1,f=!1;for(let h in n.selectedFiles){const m=n.selectedFiles[h];m.type=="folder"?m.source==="board"?(await removeBoardFolder(getFullPath(n.boardNavigationRoot,n.boardNavigationPath,m.fileName)),g=!0):(await r.removeFolder(r.getFullPath(n.diskNavigationRoot,n.diskNavigationPath,m.fileName)),f=!0):m.source==="board"?(await deleteFile(o,getFullPath(n.boardNavigationRoot,n.boardNavigationPath,m.fileName)),g=!0):(await r.removeFile(r.getFullPath(n.diskNavigationRoot,n.diskNavigationPath,m.fileName)),f=!0)}g&&f?i.emit("refresh-files"):g?i.emit("refresh-board-files"):f&&i.emit("refresh-disk-files"),n.selectedFiles=[],i.emit("render")}),i.on("rename-file",(l,d)=>{console.log("rename-file",l,d),n.renamingFile=l,i.emit("render")}),i.on("finish-renaming-file",async l=>{console.log("finish-renaming-file",l);const d=n.selectedFiles[0];if(!l||d.fileName==l){n.renamingFile=null,i.emit("render");return}if(n.isSaving=!0,updateOverlayDirectly(n),n.renamingFile=="board"&&n.isConnected){if((await checkOverwrite({fileNames:[l],parentPath:r.getFullPath(n.boardNavigationRoot,n.boardNavigationPath,""),source:"board"})).length>0){let p=`You are about to overwrite the following file/folder on your board:

`;if(p+=`${l}

`,p+="Are you sure you want to proceed?",await confirmDialog(p)!==0){n.isSaving=!1,n.renamingFile=null,updateOverlayDirectly(n),i.emit("render");return}d.type=="folder"?await removeBoardFolder(getFullPath(n.boardNavigationRoot,n.boardNavigationPath,l)):d.type=="file"&&await deleteFile(o,getFullPath(n.boardNavigationRoot,n.boardNavigationPath,l))}}else if(n.renamingFile=="disk"&&(await checkOverwrite({fileNames:[l],parentPath:r.getFullPath(n.diskNavigationRoot,n.diskNavigationPath,""),source:"disk"})).length>0){let p=`You are about to overwrite the following file/folder on your disk:

`;if(p+=`${l}

`,p+="Are you sure you want to proceed?",await confirmDialog(p)!==0){n.isSaving=!1,n.renamingFile=null,updateOverlayDirectly(n),i.emit("render");return}d.type=="folder"?await r.removeFolder(r.getFullPath(n.diskNavigationRoot,n.diskNavigationPath,l)):d.type=="file"&&await r.removeFile(r.getFullPath(n.diskNavigationRoot,n.diskNavigationPath,l))}try{n.renamingFile=="board"?await renameFile(o,getFullPath(n.boardNavigationRoot,n.boardNavigationPath,d.fileName),getFullPath(n.boardNavigationRoot,n.boardNavigationPath,l)):await r.renameFile(r.getFullPath(n.diskNavigationRoot,n.diskNavigationPath,d.fileName),r.getFullPath(n.diskNavigationRoot,n.diskNavigationPath,l));const u=n.openFiles.findIndex(p=>p.fileName===d.fileName&&p.source===d.source&&p.parentFolder===d.parentFolder);u>-1&&(n.openFiles[u].fileName=l,i.emit("render"))}catch{alert(`The file ${d.fileName} could not be renamed to ${l}`)}n.isSaving=!1,n.renamingFile=null,updateOverlayDirectly(n),i.emit("refresh-files"),i.emit("render")}),i.on("rename-tab",l=>{console.log("rename-tab",l),n.renamingTab=l,i.emit("render")}),i.on("finish-renaming-tab",async l=>{console.log("finish-renaming-tab",l);const d=n.openFiles.find(m=>m.id===n.renamingTab);if(!l||d.fileName==l){n.renamingTab=null,n.isSaving=!1,updateOverlayDirectly(n),i.emit("render");return}n.isSaving=!0,updateOverlayDirectly(n);const u=d.parentFolder,p=d.fileName;d.fileName=l;const g=u===null;let f=!1;g||(d.source=="board"?f=await fileExists(BridgeDevice,getFullPath(n.boardNavigationRoot,d.parentFolder,p)):d.source=="disk"&&(f=await r.fileExists(r.getFullPath(n.diskNavigationRoot,d.parentFolder,p)))),(g||!f)&&(d.source=="board"?d.parentFolder=n.boardNavigationPath:d.source=="disk"&&(d.parentFolder=n.diskNavigationPath));let h=!1;if(d.source=="board"?h=await fileExists(BridgeDevice,getFullPath(n.boardNavigationRoot,d.parentFolder,d.fileName)):d.source=="disk"&&(h=await r.fileExists(r.getFullPath(n.diskNavigationRoot,d.parentFolder,d.fileName))),h&&await confirmDialog(`You are about to overwrite the file ${d.fileName} on your ${d.source}.

 Are you sure you want to proceed?`)!==0){n.renamingTab=null,n.isSaving=!1,d.fileName=p,i.emit("render");return}if(f){if(d.hasChanges){const m=d.editor.content||"";try{if(d.source=="board"){if(["main.py","boot.py"].includes(p)&&await confirmDialog(`⚠️ Warning: Saving '${p}' to device may cause disconnection.

This file is running on the device. Overwriting it may crash the connection.

Recommended: Save locally instead (to disk), then reconnect.

Continue saving to device?`,"Cancel","OK")!==0){n.renamingTab=null,n.isSaving=!1,d.fileName=p,updateOverlayDirectly(n),i.emit("render");return}await o.saveFile(getFullPath(n.boardNavigationRoot,d.parentFolder,p),m,{progressCallback:y=>{n.savingProgress=y,i.emit("render")}})}else d.source=="disk"&&await r.saveFileContent(r.getFullPath(n.diskNavigationRoot,d.parentFolder,p),m)}catch(v){console.log("error",v)}}try{d.source=="board"?await renameFile(o,getFullPath(n.boardNavigationRoot,d.parentFolder,p),getFullPath(n.boardNavigationRoot,d.parentFolder,d.fileName)):d.source=="disk"&&await r.renameFile(r.getFullPath(n.diskNavigationRoot,d.parentFolder,p),r.getFullPath(n.diskNavigationRoot,d.parentFolder,d.fileName))}catch(m){console.log("error",m)}}else if(!f){const m=d.editor.content||"";try{if(d.source=="board"){if(["main.py","boot.py"].includes(d.fileName)&&await confirmDialog(`⚠️ Warning: Saving '${d.fileName}' to device may cause disconnection.

This file is running on the device. Overwriting it may crash the connection.

Recommended: Save locally instead (to disk), then reconnect.

Continue saving to device?`,"Cancel","OK")!==0){n.renamingTab=null,n.isSaving=!1,d.fileName=p,updateOverlayDirectly(n),i.emit("render");return}await o.saveFile(getFullPath(n.boardNavigationRoot,d.parentFolder,d.fileName),m,{progressCallback:y=>{n.savingProgress=y,i.emit("render")}})}else d.source=="disk"&&await r.saveFileContent(r.getFullPath(n.diskNavigationRoot,d.parentFolder,d.fileName),m)}catch(v){console.log("error",v)}}d.hasChanges=!1,n.renamingTab=null,n.isSaving=!1,n.savingProgress=0,updateOverlayDirectly(n),i.emit("refresh-files"),i.emit("render")}),i.on("toggle-file-selection",(l,d,u)=>{console.log("toggle-file-selection",l,d,u);let p=d=="board"?n.boardNavigationPath:n.diskNavigationPath;if(u&&!u.ctrlKey&&!u.metaKey){n.selectedFiles=[{fileName:l.fileName,type:l.type,source:d,parentFolder:p}],i.emit("render");return}n.selectedFiles.find(f=>f.fileName===l.fileName&&f.source===d)?n.selectedFiles=n.selectedFiles.filter(f=>!(f.fileName===l.fileName&&f.source===d)):n.selectedFiles.push({fileName:l.fileName,type:l.type,source:d,parentFolder:p}),i.emit("render")}),i.on("open-selected-files",async()=>{console.log("open-selected-files");let l=[],d=[];if(!n.isLoadingFiles){n.isLoadingFiles=!0,i.emit("render");for(let u in n.selectedFiles){let p=n.selectedFiles[u];if(p.type=="folder")continue;const g=n.openFiles.find(f=>f.fileName==p.fileName&&f.source==p.source&&f.parentFolder==p.parentFolder);if(g)d.push(g);else{let f=null;if(p.source=="board"){const h=await o.loadFile(getFullPath(n.boardNavigationRoot,n.boardNavigationPath,p.fileName)),m=new Uint8Array(h),v=new TextDecoder("utf-8").decode(m);f=await s({parentFolder:n.boardNavigationPath,fileName:p.fileName,source:p.source,content:v}),f.editor.onChange=function(){f.hasChanges=!0,i.emit("render")}}else if(p.source=="disk"){const h=await r.loadFile(r.getFullPath(n.diskNavigationRoot,n.diskNavigationPath,p.fileName)),m=new Uint8Array(h),v=new TextDecoder("utf-8").decode(m);f=await s({parentFolder:n.diskNavigationPath,fileName:p.fileName,source:p.source,content:v}),f.editor.onChange=function(){f.hasChanges=!0,i.emit("render")}}l.push(f)}}d.length>0&&(n.editingFile=d[0].id),l.length>0&&(n.editingFile=l[0].id),n.openFiles=n.openFiles.concat(l),n.selectedFiles=[],n.isLoadingFiles=!1,i.emit("change-view","editor"),i.emit("render")}}),i.on("open-file",(l,d)=>{console.log("open-file",l,d),n.selectedFiles=[{fileName:d.fileName,type:d.type,source:l,parentFolder:n[`${l}NavigationPath`]}],i.emit("open-selected-files")}),i.on("upload-files",async()=>{console.log("upload-files"),n.isTransferring=!0,i.emit("render");const l=await checkOverwrite({source:"board",fileNames:n.selectedFiles.map(d=>d.fileName),parentPath:getFullPath(n.boardNavigationRoot,n.boardNavigationPath,"")});if(l.length>0){let d=`You are about to overwrite the following files/folders on your board:

`;if(l.forEach(p=>d+=`${p.fileName}
`),d+=`
`,d+="Are you sure you want to proceed?",await confirmDialog(d)!==0){n.isTransferring=!1,i.emit("render");return}}try{for(let d in n.selectedFiles){const u=n.selectedFiles[d],p=r.getFullPath(n.diskNavigationRoot,n.diskNavigationPath,u.fileName),g=getFullPath(n.boardNavigationRoot,n.boardNavigationPath,u.fileName);if(u.type=="folder")await uploadFolder(p,g,(f,h)=>{n.transferringProgress=`${h}: ${f}`,i.emit("render")}),n.transferringProgress="";else{const f=await BridgeDisk.loadFile(p),h=new Uint8Array(f);await o.saveFile(g,h,{progressCallback:m=>{n.transferringProgress=`${u.fileName}: ${m}%`,i.emit("render")}}),n.transferringProgress=""}}n.selectedFiles=[],n.isTransferring=!1,n.transferringProgress="",updateOverlayDirectly(n),i.emit("refresh-files"),i.emit("render")}catch(d){console.error("[Upload] Transfer failed:",d),n.isTransferring=!1,n.transferringProgress="",updateOverlayDirectly(n),i.emit("render");let u=d.message;u&&u.includes("Transfer already in progress")&&(u="Transfer already in progress. The device may have stale TFTP state from a previous disconnected transfer. Please wait a moment and try again, or disconnect and reconnect."),alert(`Upload failed: ${u}`)}}),i.on("download-files",async()=>{console.log("download-files"),n.isTransferring=!0,updateOverlayDirectly(n),i.emit("render");const l=await checkOverwrite({source:"disk",fileNames:n.selectedFiles.map(d=>d.fileName),parentPath:r.getFullPath(n.diskNavigationRoot,n.diskNavigationPath,"")});if(l.length>0){let d=`You are about to overwrite the following files/folders on your disk:

`;if(l.forEach(p=>d+=`${p.fileName}
`),d+=`
`,d+="Are you sure you want to proceed?",await confirmDialog(d)!==0){n.isTransferring=!1,i.emit("render");return}}try{for(let d in n.selectedFiles){const u=n.selectedFiles[d],p=getFullPath(n.boardNavigationRoot,n.boardNavigationPath,u.fileName),g=r.getFullPath(n.diskNavigationRoot,n.diskNavigationPath,u.fileName);if(u.type=="folder")await downloadFolder(p,g,f=>{n.transferringProgress=f,i.emit("render")});else{const f=await o.loadFile(p,{progressCallback:h=>{n.transferringProgress=`${u.fileName}: ${h}%`,i.emit("render")}});await BridgeDisk.saveFileContent(g,f.buffer)}}n.isTransferring=!1,n.selectedFiles=[],updateOverlayDirectly(n),i.emit("refresh-files"),i.emit("render")}catch(d){console.error("[Download] Transfer failed:",d),n.isTransferring=!1,n.transferringProgress="",updateOverlayDirectly(n),i.emit("render");let u=d.message;u&&u.includes("Transfer already in progress")&&(u="Transfer already in progress. The device may have stale TFTP state from a previous disconnected transfer. Please wait a moment and try again, or disconnect and reconnect."),alert(`Download failed: ${u}`)}}),i.on("export-files",async()=>{console.log("export-files");for(const l of n.selectedFiles)if(l.type!=="folder")try{let d;if(l.source==="board"){const m=getFullPath(n.boardNavigationRoot,n.boardNavigationPath,l.fileName),v=await o.loadFile(m);d=new Uint8Array(v)}else{const m=r.getFullPath(n.diskNavigationRoot,n.diskNavigationPath,l.fileName),v=await r.loadFile(m);d=new Uint8Array(v)}const u=l.fileName.split(".").pop().toLowerCase(),p={png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg",webp:"image/webp",gif:"image/gif",py:"text/plain",txt:"text/plain",json:"application/json",md:"text/markdown"},g=new Blob([d],{type:p[u]||"application/octet-stream"}),f=URL.createObjectURL(g),h=document.createElement("a");h.href=f,h.download=l.fileName,document.body.appendChild(h),h.click(),document.body.removeChild(h),URL.revokeObjectURL(f)}catch(d){console.error(`[Export] Failed to export ${l.fileName}:`,d),alert(`Failed to export ${l.fileName}: ${d.message}`)}}),i.on("navigate-board-folder",l=>{console.log("navigate-board-folder",l),n.boardNavigationPath=getNavigationPath(n.boardNavigationPath,l),i.emit("refresh-files"),i.emit("render")}),i.on("navigate-board-parent",()=>{console.log("navigate-board-parent"),n.boardNavigationPath=getNavigationPath(n.boardNavigationPath,".."),i.emit("refresh-files"),i.emit("render")}),i.on("navigate-disk-folder",l=>{console.log("navigate-disk-folder",l),n.diskNavigationPath=r.getNavigationPath(n.diskNavigationPath,l),i.emit("refresh-files"),i.emit("render")}),i.on("navigate-disk-parent",()=>{console.log("navigate-disk-parent"),n.diskNavigationPath=r.getNavigationPath(n.diskNavigationPath,".."),i.emit("refresh-files"),i.emit("render")})}function debuggerStore(n,i){let o=null;console.log("[Debugger Store] Registering event handlers"),i.on("debugger:open-config",()=>{console.log("[Debugger] Opening config modal"),n.debugger.configOpen=!0,i.emit("render")}),i.on("debugger:close-config",()=>{n.debugger.configOpen=!1,i.emit("render")}),i.on("debugger:toggle-file",r=>{const s=n.debugger.debugFiles.indexOf(r);s>=0?n.debugger.debugFiles.splice(s,1):n.debugger.debugFiles.push(r),i.emit("render")}),i.on("debugger:set-watches",r=>{const s=r.split(`
`).map(a=>a.trim()).filter(a=>a.length>0);n.debugger.watchExpressions[""]=s,i.emit("render")}),i.on("debugger:start",async()=>{try{const r=n.openFiles.find(a=>a.id===n.editingFile);if(!r){console.error("[Debugger] No file open");return}const s=r.editor?r.editor.content:"";if(!s){console.error("[Debugger] No content to debug");return}n.debugger.active=!0,i.emit("render"),o=new DebugSession(n,i),await o.start(s,n.debugger.watchExpressions,n.debugger.conditionalBreakpoints,r.fileName)}catch(r){console.error("[Debugger] Failed to start:",r),n.debugger.active=!1,i.emit("render")}}),i.on("debugger:step-over",async()=>{o&&await o.stepOver()}),i.on("debugger:step-into",async()=>{o&&await o.stepInto()}),i.on("debugger:step-out",async()=>{o&&await o.stepOut()}),i.on("debugger:continue",async(r=!0)=>{o&&await o.continue(r)}),i.on("debugger:stop",async()=>{o&&(await o.stop(),o=null),n.debugger.active=!1,n.debugger.halted=!1,n.debugger.configOpen=!1,i.emit("render")}),i.on("debugger:state-update",r=>{n.debugger.currentFile=r.f,n.debugger.currentLine=r.l,n.debugger.variables=r.w,n.debugger.locals=r.v,n.debugger.memory=r.m,n.debugger.timing=r.t,n.debugger.halted=r.h,i.emit("render")}),i.on("debugger:edit-breakpoint",r=>{const{file:s,line:a}=r;n.debugger.breakpoints[s]||(n.debugger.breakpoints[s]={}),n.debugger.breakpoints[s][a]||(n.debugger.breakpoints[s][a]={condition:"",hitCount:"",enabled:!0}),n.debugger.editingBreakpoint={file:s,line:a},n.debugger.breakpointModalOpen=!0,i.emit("render")}),i.on("debugger:save-breakpoint",r=>{const{file:s,line:a,config:c}=r;n.debugger.breakpoints[s]||(n.debugger.breakpoints[s]={}),n.debugger.breakpoints[s][a]=c,n.debugger.breakpointModalOpen=!1,n.debugger.editingBreakpoint=null,i.emit("debugger:breakpoints-updated",{file:s}),i.emit("render")}),i.on("debugger:delete-breakpoint",r=>{const{file:s,line:a}=r;n.debugger.breakpoints[s]&&delete n.debugger.breakpoints[s][a],n.debugger.breakpointModalOpen=!1,n.debugger.editingBreakpoint=null,i.emit("debugger:breakpoints-updated",{file:s}),i.emit("render")}),i.on("debugger:close-breakpoint-modal",()=>{n.debugger.breakpointModalOpen=!1,n.debugger.editingBreakpoint=null,i.emit("render")})}class DebugSession{constructor(i,o){this.state=i,this.emitter=o,this.device=BridgeDevice}async start(i,o,r,s){if(console.log("[Debugger] Starting debug session for:",s),!instrumentCodeForExec){console.error("[Debugger] instrumentCodeForExec not available - debugger-utils.js may not be loaded"),this.emitter.emit("show-dialog",{title:"Debugger Error",message:"Debugger utilities not loaded. Please refresh the page.",buttons:["OK"]});return}const a=performance.now(),c=await instrumentCodeForExec(i,{watches:this.state.debugger.watchExpressions,conditionalBP:this.state.debugger.conditionalBreakpoints,breakpoints:this.state.debugger.breakpoints,fileName:s});console.log(`[Debugger] Instrumentation took ${(performance.now()-a).toFixed(0)}ms`),await this.device.interrupt(),await sleep(100),this.device.subscribe("debug-state",this.onDebugState.bind(this)),console.log("[Debugger] Executing instrumented code...");try{await this.device.run(c),console.log("[Debugger] Execution completed successfully")}catch(l){console.warn("[Debugger] Code execution ended:",l.message)}finally{this.emitter.emit("terminal:write-prompt"),this.device.unsubscribe("debug-state"),this.state.debugger.active=!1,this.state.debugger.halted=!1,this.emitter.emit("render")}}async stepInto(){console.log("[Debugger] Step Into"),await this.device.sendDebugCommand("S")}async stepOver(){console.log("[Debugger] Step Over"),await this.device.sendDebugCommand("SO")}async stepOut(){console.log("[Debugger] Step Out"),await this.device.sendDebugCommand("ST")}async continue(i=!0){console.log("[Debugger] Continue",i?"(with log)":"(no log)"),await this.device.sendDebugCommand(i?"CW":"CO")}async stop(){console.log("[Debugger] Stop"),await this.device.interrupt(),this.device.unsubscribe("debug-state")}onDebugState(i){console.log("[Debugger] State update:",i),this.emitter.emit("debugger:state-update",i),this.displayDebugState(i)}displayDebugState(i){let o=`
[DEBUG] Paused at ${i.f}:${i.l}
`;const r=Object.entries(i.w);r.length>0&&(o+=`
[WATCHES]
`,r.forEach(([a,c])=>{o+=`  ${a} = ${c}
`}));const s=Object.entries(i.v||{});s.length>0&&(o+=`
[LOCALS]
`,s.forEach(([a,c])=>{o+=`  ${a} = ${c}
`})),o+=`[DEBUG] Memory: ${this.formatBytes(i.m)} | Time: ${i.t} ms
`,this.emitter.emit("terminal:append",o)}formatBytes(i){if(!i)return"0 B";const o=1024,r=["B","KB","MB"],s=Math.floor(Math.log(i)/Math.log(o));return`${(i/Math.pow(o,s)).toFixed(1)} ${r[s]}`}}const stopStatusInfoPolling=()=>window.stopStatusInfoPolling?window.stopStatusInfoPolling():null,startStatusInfoPolling=(n,i,o)=>window.startStatusInfoPolling?window.startStatusInfoPolling(n,i,o):null;function instantiateExtension(extensionCode,state,emit,html){const deviceAPI=new DeviceAPI$1(BridgeDevice),metaMatch=extensionCode.match(/export\s+const\s+__EXTENSION_META__\s*=\s*(\{[\s\S]*?\});/);let meta={};if(metaMatch)try{meta=eval("("+metaMatch[1]+")")}catch(n){console.warn("[Extensions] Meta parse failed:",n)}const filesMatch=extensionCode.match(/export\s+const\s+__DEVICE_FILES__\s*=\s*(\{[\s\S]*?\});/);let deviceFiles={};if(filesMatch)try{const rawFiles=eval("("+filesMatch[1]+")");for(const[n,i]of Object.entries(rawFiles))try{const o=atob(i),r=new Uint8Array(o.length);for(let s=0;s<o.length;s++)r[s]=o.charCodeAt(s);deviceFiles[n]=new TextDecoder("utf-8").decode(r)}catch(o){console.warn(`[Extensions] Failed to decode ${n}:`,o),deviceFiles[n]=i}}catch(n){console.warn("[Extensions] Device files parse failed:",n)}const exportMatch=extensionCode.match(/export\s*\{\s*(\w+)\s+as\s+default\s*\}/),defaultExportVar=exportMatch?exportMatch[1]:null,evalCode=extensionCode.replace(/export\s+(const|default|class|function)/g,"$1").replace(/export\s*\{[^}]*\}\s*;?/g,""),returnLogic=defaultExportVar?`return ${defaultExportVar};`:`if (typeof P !== 'undefined') return P;
       const classMatch = ${JSON.stringify(evalCode)}.match(/class\\s+(\\w+(?:App|Extension))\\s*{/);
       if (classMatch) return eval(classMatch[1]);
       throw new Error('No extension class found in bundle');`,extensionFunction=new Function("DeviceAPI","html","emit","state",`
    ${evalCode}
    ${returnLogic}
  `),ExtensionClass=extensionFunction(DeviceAPI$1,html,emit,state),instance=new ExtensionClass(deviceAPI,emit,state,html);return instance.deviceFiles=deviceFiles,instance.meta=meta,console.log(`[Extensions] Loaded ${meta.name||"extension"} with ${Object.keys(deviceFiles).length} device files`),instance}function registerExtensionHandlers(n,i,o,r){const s=console.log;i.on("open-extensions-modal",async()=>{s("open-extensions-modal"),n.isExtensionsModalOpen=!0,n.isLoadingExtensions=!0,i.emit("render");try{n.availableExtensions=await n.extensionRegistry.loadIndex(n.registryUrl),n.isLoadingExtensions=!1,i.emit("render")}catch(c){console.error("[Extensions] Error loading registry:",c),n.isLoadingExtensions=!1,n.availableExtensions=[],i.emit("render"),alert(`Failed to load extensions registry:
${c.message}`)}}),i.on("close-extensions-modal",()=>{s("close-extensions-modal"),n.isExtensionsModalOpen=!1,i.emit("render")}),i.on("install-extension",async c=>{s("install-extension:",c.name);try{const l=await n.extensionRegistry.installExtension(c);n.installedExtensions=await n.extensionRegistry.getInstalledExtensions(),n.isExtensionsModalOpen=!1,s(`[Extensions] Installed ${c.name}`),i.emit("render");const d=await n.extensionRegistry.getExtension(c.id);hasOnInstallMethod(d?.content)?n.isConnected&&o?await a(c,d,n,i,o):(s("[Extensions] Device not connected - extension will install files when first opened"),await showStyledModal({variant:"warning",icon:"packages",title:"Extension Saved",subtitle:c.name,body:`<p>This extension needs to install files on your device.</p>
                   <p style="color: var(--text-secondary);">Connect to your device and open the extension to complete setup.</p>`,buttons:[{id:"ok",class:"fw-styled-modal-btn-primary",label:"OK"}]})):c.mipPackage&&i.emit("prompt-upload-dependencies",{extensionId:c.id,extensionName:c.name})}catch(l){console.error("[Extensions] Installation failed:",l),alert(`Failed to install extension:
${l.message}`)}});async function a(c,l,d,u,p){const g=c.id,f=Array.isArray(c.version)?c.version.join("."):String(c.version);s(`[Extensions] Running onInstall for ${c.name}...`),showStyledModal({variant:"",icon:"packages",title:"Installing Extension",subtitle:c.name,body:`<p>Installing extension files to device...</p>
             <div style="margin-top: 16px; color: var(--text-secondary);">
               <span class="install-spinner">◐</span> Preparing...
             </div>`,buttons:[]});try{stopStatusInfoPolling();const h=(v,...y)=>v.reduce((b,S,C)=>b+S+(y[C]||""),""),m=instantiateExtension(l.content,d,u.emit.bind(u),h);if(typeof m.onInstall=="function"){updateModalBody(`<p>Writing files to device...</p>
          <div style="margin-top: 16px; color: var(--text-secondary);">
            <span class="install-spinner">◐</span> Installing...
          </div>`),await m.onInstall(),updateModalBody(`<p>Updating device registry...</p>
          <div style="margin-top: 16px; color: var(--text-secondary);">
            <span class="install-spinner">◐</span> Finalizing...
          </div>`);const v=new DeviceAPI$1(BridgeDevice);await updateDeviceExtensionRegistry(v,g,f),s(`[Extensions] onInstall complete for ${c.name}`)}closeStyledModal(),await showStyledModal({variant:"success",icon:"check",title:"Extension Ready",subtitle:c.name,body:"<p>Extension files have been installed on your device.</p>",buttons:[{id:"done",class:"fw-styled-modal-btn-primary",label:"Done"}]})}catch(h){console.error("[Extensions] onInstall failed:",h),closeStyledModal(),await showStyledModal({variant:"danger",icon:"alert-triangle",title:"Installation Failed",subtitle:c.name,body:`<p>Failed to install extension files:</p>
               <p style="color: var(--error-color)">${h.message}</p>
               <p style="margin-top: 12px; color: var(--text-secondary);">
                 You can try again by opening the extension panel.
               </p>`,buttons:[{id:"close",class:"fw-styled-modal-btn-cancel",label:"Close"}]})}finally{d.isConnected&&p&&startStatusInfoPolling(p,d,u)}}i.on("update-extension",async({extension:c,newVersion:l})=>{s("update-extension:",c.id,`v${c.version.join(".")} → v${l.version.join(".")}`);try{delete n.loadedExtensions[c.id];const d=`extension-styles-${c.id}`,u=document.getElementById(d);u&&(u.remove(),console.log(`[Extensions] Removed old styles for ${c.id}`)),await n.extensionRegistry.uninstallExtension(c.id),await n.extensionRegistry.installExtension(l),n.installedExtensions=await n.extensionRegistry.getInstalledExtensions(),n.activeExtension===c.id&&i.emit("change-extension-panel",{extensionId:c.id,panelId:n.activeExtensionPanel||l.menu[0].id}),s(`[Extensions] Updated ${c.name} to v${l.version.join(".")}`),l.mipPackage&&i.emit("prompt-upload-dependencies",{extensionId:c.id,extensionName:c.name}),i.emit("render")}catch(d){console.error("[Extensions] Update failed:",d),alert(`Failed to update extension:
${d.message}`)}}),i.on("uninstall-extension",async c=>{s("uninstall-extension:",c);try{await n.extensionRegistry.uninstallExtension(c),delete n.loadedExtensions[c];const l=`extension-styles-${c}`,d=document.getElementById(l);d&&(d.remove(),console.log(`[Extensions] Removed styles for ${c}`)),n.installedExtensions=await n.extensionRegistry.getInstalledExtensions(),n.activeExtension===c&&(n.activeExtension=null,n.activeExtensionPanel=null,n.systemSection="settings"),s(`[Extensions] Uninstalled ${c}`),i.emit("render")}catch(l){console.error("[Extensions] Uninstall failed:",l),alert(`Failed to uninstall extension:
${l.message}`)}}),i.on("prompt-upload-dependencies",async({extensionId:c,extensionName:l})=>{s("prompt-upload-dependencies:",c);try{const d=await n.extensionRegistry.getDependencies(c);if(!d||!d.mipPackage)return;n.dependencyPrompt={extensionId:c,extensionName:l,dependencies:d},i.emit("render")}catch(d){console.error("[Extensions] Error getting dependencies:",d)}}),i.on("close-dependency-prompt",()=>{s("close-dependency-prompt"),n.dependencyPrompt=null,i.emit("render")}),i.on("upload-extension-dependencies",async c=>{s("upload-extension-dependencies:",c),n.dependencyPrompt=null;try{const l=n.installedExtensions.find(p=>p.id===c);if(!l||!l.mipPackage){i.emit("render");return}if(!n.isConnected){alert("Please connect to device first"),i.emit("render");return}stopStatusInfoPolling(),n.installingDependencies={extensionName:l.name,mipPackage:l.mipPackage},i.emit("render");const d=`
import mip
try:
    result = mip.install("${l.mipPackage}", target="/lib")
    print("mip.install completed")
    print(f"mip.install result: {result}")
except Exception as e:
    print(f"mip.install error: {e}")
    import sys
    sys.print_exception(e)
    raise  # Re-raise to ensure error is visible
`,u=await o.run(d,!1);if(u&&(u.includes("error")||u.includes("Error")||u.includes("Exception")))throw new Error(`mip install failed: ${u}`);n.installingDependencies=null,n.isConnected&&o&&startStatusInfoPolling(o,n,i),i.emit("render"),alert("Dependencies installed successfully via mip!")}catch(l){console.error("[Extensions] Dependency installation failed:",l),n.installingDependencies=null,n.isConnected&&o&&startStatusInfoPolling(o,n,i),i.emit("render"),alert(`Failed to install dependencies:
${l.message}`)}}),i.on("toggle-extension-menu",c=>{n.expandedExtensions[c]=!n.expandedExtensions[c],i.emit("render")}),i.on("change-extension-panel",async({extensionId:c,panelId:l})=>{if(s("change-extension-panel:",c,l),!n.loadedExtensions[c])try{const d=await n.extensionRegistry.getExtension(c);if(!d)throw new Error(`Extension not found: ${c}`);n.loadedExtensions[c]={data:d,instance:null},s(`[Extensions] Loaded extension ${c} from cache`)}catch(d){console.error("[Extensions] Failed to load extension:",d),alert(`Failed to load extension:
${d.message}`);return}n.activeExtension=c,n.activeExtensionPanel=l,n.activeNetworkPanel=null,n.activePeripheralsPanel=null,n.activeSystemPanel=null,n.systemSection=`extension:${c}:${l}`,i.emit("render")})}function registerAIAgentHandlers(n,i,o){const r=console.log;i.on("toggle-agent-sidebar",()=>{r("toggle-agent-sidebar"),n.aiAgent.isOpen=!n.aiAgent.isOpen,i.emit("render")}),i.on("ai-set-provider",async s=>{r("ai-set-provider",s);const a=n.aiAgent.settings.provider;if(n.aiAgent.settings.provider=s,localStorage.setItem("ai-provider",s),a!==s){const c={openai:"gpt-4o",anthropic:"claude-3-5-sonnet-20241022",grok:"grok-4-latest",openrouter:"anthropic/claude-3.5-sonnet",custom:"custom-model"};n.aiAgent.settings.model=c[s]||"gpt-4o",localStorage.setItem("ai-model",n.aiAgent.settings.model)}s==="openrouter"&&n.aiAgent.settings.apiKey&&i.emit("ai-fetch-openrouter-models"),i.emit("render")}),i.on("ai-fetch-openrouter-models",async()=>{if(r("ai-fetch-openrouter-models"),!!n.aiAgent.settings.apiKey){n.aiAgent.isLoadingOpenRouterModels=!0,i.emit("render");try{const s=await fetch("https://openrouter.ai/api/v1/models",{headers:{Authorization:`Bearer ${n.aiAgent.settings.apiKey}`}});if(s.ok){const c=(await s.json()).data.filter(l=>l.id&&!l.id.includes("moderation")).sort((l,d)=>l.pricing?.prompt&&!d.pricing?.prompt?-1:!l.pricing?.prompt&&d.pricing?.prompt?1:l.name.localeCompare(d.name)).map(l=>({value:l.id,label:l.name||l.id}));n.aiAgent.openRouterModels=c,!c.find(l=>l.value===n.aiAgent.settings.model)&&c.length>0&&(n.aiAgent.settings.model=c[0].value,localStorage.setItem("ai-model",n.aiAgent.settings.model))}else console.warn("[AI] Failed to fetch OpenRouter models:",s.status)}catch(s){console.error("[AI] Error fetching OpenRouter models:",s)}finally{n.aiAgent.isLoadingOpenRouterModels=!1,i.emit("render")}}}),i.on("ai-set-apikey",s=>{n.aiAgent.settings.apiKey=s,localStorage.setItem("ai-apikey",s),n.aiAgent.connectionStatus=null,n.aiAgent.settings.provider==="openrouter"&&s&&i.emit("ai-fetch-openrouter-models")}),i.on("ai-set-model",s=>{r("ai-set-model",s),n.aiAgent.settings.model=s,localStorage.setItem("ai-model",s),i.emit("render")}),i.on("ai-set-endpoint",s=>{n.aiAgent.settings.endpoint=s,localStorage.setItem("ai-endpoint",s)}),i.on("ai-set-anthropic-proxy-url",s=>{n.aiAgent.settings.anthropicProxyUrl=s,localStorage.setItem("ai-anthropic-proxy-url",s)}),i.on("ai-set-system-prompt",s=>{n.aiAgent.settings.systemPrompt=s,localStorage.setItem("ai-system-prompt",s)}),i.on("ai-test-connection",async()=>{if(r("ai-test-connection"),!n.aiAgent.settings.apiKey){n.aiAgent.connectionStatus={success:!1,message:"Please enter an API key"},i.emit("render");return}try{n.aiAgent.connectionStatus={success:!1,message:"Testing connection..."},i.emit("render");const a=await AIBridgeInstance.testConnection(n.aiAgent.settings);n.aiAgent.connectionStatus={success:!0,message:"Connection successful! Ready to generate code."}}catch(s){n.aiAgent.connectionStatus={success:!1,message:s.message||"Connection failed"}}i.emit("render")}),i.on("ai-update-input",s=>{n.aiAgent.inputValue=s}),i.on("ai-send-message",async s=>{if(r("ai-send-message",s),!(!s||!s.trim())){if(!n.aiAgent.settings.apiKey){n.aiAgent.messages.push({role:"error",content:"Please configure your API key in System > AI Agent settings",timestamp:new Date}),i.emit("render");return}n.aiAgent.inputValue="",n.aiAgent.messages.push({role:"user",content:s,timestamp:new Date}),n.aiAgent.isGenerating=!0,i.emit("render");try{const a=AIBridgeInstance;let c=s;n.aiAgent.lastScriptName&&(c=`[CONTEXT: The last script you generated was "${n.aiAgent.lastScriptName}". If the user is asking you to modify/improve that script, keep the same name. If they're asking for something completely different, use a new appropriate name.]

${s}`,console.log("[AI] Adding script context:",n.aiAgent.lastScriptName));const l=await a.generateCode(c,n.aiAgent.messages,n.aiAgent.settings);n.aiAgent.messages.push({role:"assistant",content:l.content,code:l.code,timestamp:new Date}),l.code&&i.emit("ai-code-generated",l.code)}catch(a){n.aiAgent.messages.push({role:"error",content:`Error: ${a.message}`,timestamp:new Date})}n.aiAgent.isGenerating=!1,i.emit("render")}}),i.on("ai-clear-chat",()=>{r("ai-clear-chat"),n.aiAgent.messages=[],n.aiAgent.inputValue="",n.aiAgent.lastConfiguredArgs=null,n.aiAgent.lastScriptName=null,console.log("[AI] Cleared chat and configuration values"),i.emit("render")}),i.on("ai-code-generated",async s=>{r("ai-code-generated");try{console.log("[AI] Code received (first 500 chars):",s.substring(0,500)),console.log("[AI] Code has START marker:",s.includes("# === START_CONFIG_PARAMETERS ===")),console.log("[AI] Code has END marker:",s.includes("# === END_CONFIG_PARAMETERS ==="));const a=parseScriptOsConfig(s);if(console.log("[AI] Parsed config:",a),console.log("[AI] Config args:",a?.args),console.log("[AI] Has args:",a&&a.args&&Object.keys(a.args).length>0),a&&a.args&&Object.keys(a.args).length>0){let l=(a.info||{}).name||"AI Generated Script";const d=n.aiAgent.lastScriptName===a.info.name,u=d&&n.aiAgent.lastConfiguredArgs!==null;if(console.log("[AI] Script name:",a.info.name),console.log("[AI] Last script name:",n.aiAgent.lastScriptName),console.log("[AI] Is same script:",d),console.log("[AI] Has existing config:",u),console.log("[AI] Last configured args:",n.aiAgent.lastConfiguredArgs),console.log("[AI] New config args:",Object.keys(a.args)),u){console.log("[AI] Using previous configuration values:",n.aiAgent.lastConfiguredArgs);let p=generateScriptOsCode(s,a,n.aiAgent.lastConfiguredArgs);a.silent===!0&&(p=`# SCRIPTOS_SILENT: True
${p}`);const g=l.replace(/[^a-zA-Z0-9]/g,"_")+".py",f=n.openFiles.find(h=>h.isAIGenerated&&h.source==="disk"&&h.fileName===g);if(f)f.editor.editor.setValue(p),f.hasChanges=!0,n.editingFile=f.id,console.log("[AI] Auto-updated existing tab with previous config:",f.fileName);else if(await o("disk",g,null,p)){const m=n.openFiles[n.openFiles.length-1];m.isAIGenerated=!0,console.log("[AI] Created new tab with previous config:",g)}}else n.selectedScriptOs={filename:l,content:s,config:a,isAIGenerated:!0},n.scriptOsModalView="config",n.scriptOsArgs={},n.isScriptOsModalOpen=!0}else{const c=n.openFiles.find(l=>l.isAIGenerated&&l.source==="disk");if(c)c.editor.editor.setValue(s),c.hasChanges=!0,n.editingFile=c.id,console.log("[AI] Updated existing AI-generated tab:",c.fileName);else{const l="AI_Generated.py";if(await o("disk",l,null,s)){const u=n.openFiles[n.openFiles.length-1];u.isAIGenerated=!0,console.log("[AI] Created new AI-generated tab:",l)}}}i.emit("render")}catch(a){console.error("[AI] Error processing generated code:",a);const c=n.openFiles.find(l=>l.isAIGenerated&&l.source==="disk");if(c)c.editor.editor.setValue(s),c.hasChanges=!0,n.editingFile=c.id;else{await o("disk","AI_Generated.py",null,s);const d=n.openFiles[n.openFiles.length-1];d&&(d.isAIGenerated=!0)}i.emit("render")}})}function registerScriptOsHandlers(n,i,o,r){const s=console.log;i.on("open-scriptos-modal",async()=>{s("open-scriptos-modal"),n.isLoadingRegistry=!0,n.scriptOsModalView="library",n.scriptOsSearchQuery="",n.scriptOsFilterTags=[],n.isScriptOsModalOpen=!0,i.emit("render");try{let a=o?await o.getIndex():null;console.log("[Registry] Fetching index from network...");const c=n.registryUrl+(n.registryUrl.includes("?")?"&":"?")+"_t="+Date.now(),l=await fetch(c,{cache:"no-cache"});if(!l.ok)throw new Error(`Failed to fetch registry: ${l.status} ${l.statusText}`);const d=await l.json(),u=!a||a.updated!==d.updated||(a.scriptos?.length||0)!==(d.scriptos?.length||0);let p;u?(console.log("[Registry] Cache is stale, using fresh data"),p=d,o&&await o.saveIndex(d)):(console.log("[Registry] Cache is up to date, using cached index"),p=a,o&&o.saveIndex(d).catch(f=>console.warn("[Registry] Background cache update failed:",f)));const g=p.scriptos||[];n.scriptOsList=g.map(f=>({filename:f.filename,url:f.url,registryEntry:f})),n.isLoadingRegistry=!1,i.emit("render")}catch(a){console.error("[ScriptOs] Error loading registry:",a),n.isLoadingRegistry=!1,n.scriptOsList=[],i.emit("render"),alert(`Failed to load ScriptOs registry:
${a.message}

Please check your internet connection and try again.`)}}),i.on("select-scriptos",async a=>{if(s("select-scriptos:",a.registryEntry?.name||a.filename),a.url&&!a.content){const c=a.url;console.log("[Registry] Fetching ScriptO from:",c);let l=o?await o.getScriptO(c):null,d,u;const p=l?.config?.info?.version,g=a.registryEntry?.version,f=p&&g&&JSON.stringify(p)===JSON.stringify(g);if(l&&l.content&&f)d=l.content,u=l.config,console.log("[Registry] Using cached ScriptO (version match)");else{l&&!f&&console.log("[Registry] Cache version mismatch, fetching fresh copy");try{const h=await fetch(c);if(!h.ok)throw new Error(`Failed to fetch ScriptO: ${h.status} ${h.statusText}`);if(d=await h.text(),u=parseScriptOsConfig(d),!u)throw new Error("Failed to parse ScriptO configuration");o&&await o.saveScriptO(c,d,u),console.log("[Registry] Fetched and cached ScriptO")}catch(h){console.error("[Registry] Error fetching ScriptO:",h),alert(`Failed to load ScriptO:
${h.message}`);return}}a={filename:a.filename,content:d,config:u,url:c}}if(n.selectedScriptOs=a,n.scriptOsArgs={},a.config&&a.config.args)for(const c in a.config.args){const l=a.config.args[c];l.value!==void 0?n.scriptOsArgs[c]=l.value:l.type==="str"?n.scriptOsArgs[c]="":l.type==="int"||l.type==="float"?n.scriptOsArgs[c]=0:l.type==="bool"?n.scriptOsArgs[c]=!1:l.type==="list"?n.scriptOsArgs[c]=l.optional?null:0:l.type==="dict"&&l.items&&(n.scriptOsArgs[c]=Object.keys(l.items)[0])}n.scriptOsModalView="config",i.emit("render")}),i.on("scriptos-update-arg",({argId:a,value:c})=>{n.scriptOsArgs[a]=c}),i.on("scriptos-search",a=>{n.scriptOsSearchQuery=a,i.emit("render")}),i.on("scriptos-toggle-tag",a=>{s("scriptos-toggle-tag:",a);const c=n.scriptOsFilterTags.indexOf(a);c>=0?n.scriptOsFilterTags.splice(c,1):n.scriptOsFilterTags.push(a),i.emit("render")}),i.on("scriptos-clear-tags",()=>{s("scriptos-clear-tags"),n.scriptOsFilterTags=[],i.emit("render")}),i.on("scriptos-back",()=>{s("scriptos-back"),n.scriptOsModalView="library",n.selectedScriptOs=null,i.emit("render")}),i.on("scriptos-execute",async()=>{s("scriptos-execute");const a=n.selectedScriptOs;if(a)try{let c=generateScriptOsCode(a.content,a.config,n.scriptOsArgs);a.config.silent===!0&&(c=`# SCRIPTOS_SILENT: True
${c}`),n.isScriptOsModalOpen=!1;const l=a.config.info||{};let d=(l.name||a.filename.replace(".py","")).replace(/[^a-zA-Z0-9]/g,"_")+".py";if(a.isAIGenerated){n.aiAgent.lastConfiguredArgs={...n.scriptOsArgs},n.aiAgent.lastScriptName=l.name,console.log("[AI] Saved configuration values for future updates:",n.aiAgent.lastConfiguredArgs),console.log("[AI] Saved script name:",n.aiAgent.lastScriptName);const u=n.openFiles.find(p=>p.isAIGenerated&&p.source==="disk"&&p.fileName===d);if(u)u.editor.editor.setValue(c),u.hasChanges=!0,n.editingFile=u.id,console.log("[AI] Updated existing AI-generated tab with configured code:",u.fileName);else{const p=d||"AI_Generated.py";if(await r("disk",p,null,c)){const f=n.openFiles[n.openFiles.length-1];f.isAIGenerated=!0,console.log("[AI] Created new AI-generated tab with configured code:",p)}}}else await r("disk",d,null,c),s("[ScriptOs] Generated code in new tab:",d);i.emit("render")}catch(c){console.error("[ScriptOs] Error generating code:",c)}}),i.on("close-scriptos-modal",()=>{s("close-scriptos-modal"),n.isScriptOsModalOpen=!1,n.selectedScriptOs=null,n.scriptOsModalView="library",i.emit("render")}),i.on("open-scriptos-ui-modal",a=>{s("open-scriptos-ui-modal",a),n.scriptOsUiModal&&n.scriptOsUiModal.loadTimeout&&clearTimeout(n.scriptOsUiModal.loadTimeout),n.scriptOsUiModal={isOpen:!0,url:a.url,title:a.title||"ScriptO UI",isLoading:!0,error:null,loadTimeout:null},n.scriptOsUiModal.loadTimeout=setTimeout(()=>{n.scriptOsUiModal&&n.scriptOsUiModal.isLoading&&(console.warn("[ScriptO UI] Load timeout - iframe did not load within 10 seconds"),n.scriptOsUiModal.isLoading=!1,n.scriptOsUiModal.error="Failed to load UI: timeout after 10 seconds. Check if the URL is accessible.",i.emit("render"))},1e4),i.emit("render")}),i.on("close-scriptos-ui-modal",()=>{s("close-scriptos-ui-modal"),n.scriptOsUiModal&&n.scriptOsUiModal.loadTimeout&&clearTimeout(n.scriptOsUiModal.loadTimeout),n.scriptOsUiModal={isOpen:!1,url:null,title:null,isLoading:!1,error:null,loadTimeout:null},i.emit("render")}),i.on("configure-scripto",async a=>{s("configure-scripto",a);try{console.log("[ScriptO] Fetching ScriptO from:",a);const c=await fetch(a);if(!c.ok)throw new Error(`Failed to fetch ScriptO: ${c.status} ${c.statusText}`);const l=await c.text();console.log("[ScriptO] Fetched content, length:",l.length);const d=parseScriptOsConfig(l);if(!d)throw new Error("Failed to parse ScriptO configuration");const u=a.split("/");let p=u[u.length-1];p=decodeURIComponent(p),p=decodeURIComponent(p);let g=p;d.info&&d.info.name&&(g=d.info.name),console.log("[ScriptO] Opening in config modal:",g);const f={filename:g,content:l,config:d};if(n.selectedScriptOs=f,n.scriptOsArgs={},d.args)for(const h in d.args){const m=d.args[h];m.value!==void 0?n.scriptOsArgs[h]=m.value:m.type==="str"?n.scriptOsArgs[h]="":m.type==="int"||m.type==="float"?n.scriptOsArgs[h]=0:m.type==="bool"?n.scriptOsArgs[h]=!1:m.type==="list"?n.scriptOsArgs[h]=m.optional?null:0:m.type==="dict"&&m.items&&(n.scriptOsArgs[h]=Object.keys(m.items)[0])}n.scriptOsModalView="config",n.isScriptOsModalOpen=!0,console.log("[ScriptO] Successfully opened ScriptO in config modal"),i.emit("render")}catch(c){console.error("[ScriptO] Error loading ScriptO:",c),alert(`Failed to load ScriptO from ${a}:
${c.message}`)}})}console.log("[Stores] ES modules loaded");let CodeMirrorEditorClass=null;async function getCodeMirrorEditor(){return CodeMirrorEditorClass||(CodeMirrorEditorClass=(await __vitePreload(()=>Promise.resolve().then(()=>editor),void 0)).CodeMirrorEditor),CodeMirrorEditorClass}const log=console.log,device=BridgeDevice,disk=BridgeDisk,registryCache=new RegistryCache;async function store(n,i){async function o(a){const{source:c,parentFolder:l,fileName:d,content:u=newFileContent,hasChanges:p=!1}=a,g=generateHash(),f=await getCodeMirrorEditor(),h=n.cache(f,`editor_${g}`);return h.content=u,h.fileName=d,{id:g,source:c,parentFolder:l,fileName:d,editor:h,hasChanges:p}}async function r(a,c=null,l=null,d=null){a=="board"?n.boardNavigationPath:n.diskNavigationPath;const u=await o({fileName:c===null?generateFileName():c,parentFolder:l,source:a,hasChanges:!0,content:d||newFileContent});let p=!1;return l!=null&&(a=="board"?p=await fileExists(BridgeDevice,getFullPath$1(n.boardNavigationRoot,u.parentFolder,u.fileName)):a=="disk"&&(p=await disk.fileExists(disk.getFullPath(n.diskNavigationRoot,u.parentFolder,u.fileName)))),n.openFiles.find(f=>f.parentFolder===u.parentFolder&&f.fileName===u.fileName&&f.source===u.source)||p?(await confirmDialog(`File ${u.fileName} already exists on ${a}. Please choose another name.`),!1):(u.editor.onChange=function(){u.hasChanges=!0,i.emit("render")},n.openFiles.push(u),n.editingFile=u.id,!0)}await initializeState(n,i,r),initializeTheme(n,i),registerThemeHandlers(n,i);const s=()=>{};registerDialogHandlers(n,i,device),registerConnectionHandlers(n,i,device,s,bindTerminalOutput),registerFileOperationHandlers(n,i,device,disk,o,r),registerTerminalHandlers(n,i,device,XTerm),registerAIAgentHandlers(n,i,r),registerLogHandlers(n,i),document.addEventListener("connection-mode-change",a=>{const c=a.detail?.mode||"none";n.connectionMode=c,i.emit("render")}),document.addEventListener("firmware-panel-update",()=>{i.emit("render")}),i.on("navigate",a=>{i.emit("change-system-section",a)}),i.on("change-view",async a=>{a==="file-manager"&&(n.isConnected&&BridgeDevice&&BridgeDevice.isCommandRunning()&&(i.emit("stop"),await sleep(250)),n.filesLoadedOnce||(log("[File Manager] Loading files for first time..."),n.filesLoadedOnce=!0),n.isConnected?i.emit("refresh-files"):i.emit("refresh-disk-files")),n.systemSection!==a&&(n.selectedFiles=[],n.systemSection=a,n.activeNetworkPanel=null,n.activePeripheralsPanel=null,n.activeSystemPanel=null,n.activeExtension=null,n.activeExtensionPanel=null,a==="editor"&&n.isConnected&&setTimeout(()=>{bindTerminalOutput(n);const c=n.cache(XTerm,"terminal");c&&c.term&&(i.emit("bind-terminal-input"),i.emit("terminal-focus"))},100),i.emit("render"))}),i.on("launch-app",async(a,c)=>{window.launchApp(a,c)}),i.on("change-system-section",a=>{if(log("change-system-section",a),n.systemSection=a,a.startsWith("network:")){const c=a.split(":")[1];n.activeNetworkPanel=c,n.activeSystemPanel=null,n.activePeripheralsPanel=null,n.activeExtension=null,n.activeExtensionPanel=null}else if(a.startsWith("peripherals:")){const c=a.split(":")[1];n.activePeripheralsPanel=c,n.activeNetworkPanel=null,n.activeSystemPanel=null,n.activeExtension=null,n.activeExtensionPanel=null}else if(a.startsWith("system:")){const c=a.split(":")[1];n.activeSystemPanel=c,n.activeNetworkPanel=null,n.activePeripheralsPanel=null,n.activeExtension=null,n.activeExtensionPanel=null}else n.activeNetworkPanel=null,n.activePeripheralsPanel=null,n.activeSystemPanel=null,n.activeExtension=null,n.activeExtensionPanel=null;(a==="ai-agent"||a==="system:ai-agent")&&n.aiAgent.settings.provider==="openrouter"&&n.aiAgent.settings.apiKey&&n.aiAgent.openRouterModels.length===0&&i.emit("ai-fetch-openrouter-models"),i.emit("render")}),registerNetworkConfigHandlers(n,i,device),registerHardwareConfigHandlers(n,i,device),registerSystemConfigHandlers(n,i,device),registerExtensionHandlers(n,i,device),registerScriptOsHandlers(n,i,registryCache,r),typeof debuggerStore=="function"?debuggerStore(n,i):console.warn("[Store] Debugger store not loaded"),i.on("change-locale",a=>{n.locale=a,localStorage.setItem("locale",a),window.i18n&&window.i18n.setLocale(a),i.emit("render")}),window.i18n?(window.i18n.setLocale(n.locale),console.log("[i18n] Locale initialized to:",n.locale)):console.warn("[i18n] i18n module not available")}const PANEL_CLOSED=45,PANEL_TOO_SMALL=65,PANEL_DEFAULT=320;typeof window<"u"&&(window.PANEL_CLOSED=PANEL_CLOSED,window.PANEL_TOO_SMALL=PANEL_TOO_SMALL,window.PANEL_DEFAULT=PANEL_DEFAULT);function App(n,i){return n.isInitializing?html$1`
      <div id="app" style="display: flex; justify-content: center; align-items: center; height: 100vh;">
        <p>Loading...</p>
      </div>
    `:html$1`
    <div id="app">
      ${SystemView(n,i)}
      ${Overlay(n,i)}
    </div>
  `}async function initApp(){window.i18nReady&&(await window.i18nReady,console.log("[App] Translations loaded, starting app..."));let n=Choo();n.use(store),n.route("*",App),n.mount("#app"),window.appState=n.state,window.appInstance=n,n.emitter.on("DOMContentLoaded",()=>{n.state.diskNavigationRoot&&n.emitter.emit("refresh-files");const i=new URLSearchParams(window.location.search),o=i.get("device");if(o){const s=`wss://${o}/webrepl`;localStorage.setItem("webrepl-url",s),console.log(`[App] Device URL from query param: ${s}`),setTimeout(()=>{n.emitter.emit("open-connection-dialog");const a=window.location.pathname;window.history.replaceState({},"",a)},500)}const r=i.get("configure");if(r&&setTimeout(()=>{n.emitter.emit("configure-scripto",r);const s=window.location.pathname;window.history.replaceState({},"",s)},500),!n.state.isConnected){let s=document.getElementById("hand-click-hint");if(!s){s=document.createElement("div"),s.id="hand-click-hint";const l=document.createElementNS("http://www.w3.org/2000/svg","svg");l.setAttribute("width","36"),l.setAttribute("height","36"),l.setAttribute("viewBox","0 0 24 24"),l.setAttribute("fill","none"),l.setAttribute("stroke","currentColor"),l.setAttribute("stroke-width","2"),l.setAttribute("stroke-linecap","round"),l.setAttribute("stroke-linejoin","round"),l.innerHTML=`
          <path d="M8 13v-8.5a1.5 1.5 0 0 1 3 0v7.5" />
          <path d="M11 11.5v-2a1.5 1.5 0 0 1 3 0v2.5" />
          <path d="M14 10.5a1.5 1.5 0 0 1 3 0v1.5" />
          <path d="M17 11.5a1.5 1.5 0 0 1 3 0v4.5a6 6 0 0 1 -6 6h-2h.208a6 6 0 0 1 -5.012 -2.7l-.196 -.3c-.312 -.479 -1.407 -2.388 -3.286 -5.728a1.5 1.5 0 0 1 .536 -2.022a1.867 1.867 0 0 1 2.28 .28l1.47 1.47" />
          <path d="M5 3l-1 -1" />
          <path d="M4 7h-1" />
          <path d="M14 3l1 -1" />
          <path d="M15 6h1" />
        `,s.appendChild(l),document.body.appendChild(s)}const a=()=>{s.classList.add("animate"),setTimeout(()=>{s.classList.remove("animate")},7500)};setTimeout(a,1e3);const c=setInterval(a,1e4);n.emitter.on("connect",()=>{clearInterval(c);const l=document.getElementById("hand-click-hint");l&&l.remove()})}})}document.readyState==="complete"?initApp():window.addEventListener("load",initApp);export{__vitePreload as _};
