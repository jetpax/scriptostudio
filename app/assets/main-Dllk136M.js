const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/tree-sitter-Cql3IGzA.js","assets/modulepreload-polyfill-B5Qt9EMX.js","assets/vendor-BzspHke8.js","assets/vendor-BlGDltiY.js","assets/vendor-DroM8s9k.css","assets/index-CcAq0A7F.js","assets/index-BdYji-3i.js","assets/index-KRlJo8re.js","assets/index-CV6dBaez.js","assets/index-JImUBHhm.js","assets/index-D3NKRj9Q.js","assets/index-Dh2CuqQh.js","assets/xterm-DOrYoP_4.css"])))=>i.map(i=>d[i]);
import"./modulepreload-polyfill-B5Qt9EMX.js";import{PANEL_TOO_SMALL as PANEL_TOO_SMALL$1,PANEL_CLOSED as PANEL_CLOSED$1,PANEL_DEFAULT as PANEL_DEFAULT$1}from"./vendor-BzspHke8.js";import{h as html$1,C as Component$1,g,r as raw,a as Choo}from"./vendor-BlGDltiY.js";function parseScriptOsConfig(e){const n="# === START_CONFIG_PARAMETERS ===",o="# === END_CONFIG_PARAMETERS ===",i=e.indexOf(n),s=e.indexOf(o);if(i===-1||s===-1)return console.warn("[ScriptOs Parser] Config markers not found"),null;const r=e.substring(i+n.length,s).trim();try{return parsePythonDict(r)}catch(l){return console.error("[ScriptOs Parser] Failed to parse config:",l),null}}function parsePythonDict(e){let n=e.trim();n.startsWith("dict(")&&n.endsWith(")")&&(n=n.substring(5,n.length-1).trim()),n=n.split(`
`).map(s=>{let r=!1,l=null,a=!1;for(let c=0;c<s.length;c++){const d=s[c];if(a){a=!1;continue}if(d==="\\"){a=!0;continue}if((d==='"'||d==="'"||d==="`")&&!r){r=!0,l=d;continue}if(d===l&&r){r=!1,l=null;continue}if(d==="#"&&!r)return s.substring(0,c)}return s}).join(`
`),n=n.replace(/\\\s*[\r\n]+\s*/g," ");let o="{";const i=smartSplit(n,",");for(let s=0;s<i.length;s++){const r=i[s].trim();if(!r)continue;const l=r.indexOf("=");if(l===-1)continue;const a=r.substring(0,l).trim();let c=r.substring(l+1).trim();c=convertPythonValue(c),s>0&&(o+=","),o+=`"${a}":${c}`}return o+="}",JSON.parse(o)}function smartSplit(e,n){const o=[];let i="",s=0,r=!1,l=null,a=!1;for(let c=0;c<e.length;c++){const d=e[c],u=c>0?e[c-1]:"";if(a){i+=d,a=!1;continue}if(d==="\\"){a=!0,i+=d;continue}if((d==='"'||d==="'"||d==="`")&&!r){r=!0,l=d,i+=d;continue}if(d===l&&r&&u!=="\\"){r=!1,l=null,i+=d;continue}if(r){i+=d;continue}if(d==="("||d==="["||d==="{"?s++:(d===")"||d==="]"||d==="}")&&s--,d===n&&s===0){o.push(i),i="";continue}i+=d}return i.trim()&&o.push(i),o}function convertPythonValue(e){if(e=e.trim(),e==="None")return"null";if(e==="True")return"true";if(e==="False")return"false";if(/^-?\d+(\.\d+)?$/.test(e))return e;if(e.startsWith("[")&&e.endsWith("]")){const n=e.substring(1,e.length-1);return"["+smartSplit(n,",").map(s=>convertPythonValue(s)).join(",")+"]"}if(e.startsWith("(")&&e.endsWith(")")){const n=e.substring(1,e.length-1);return"["+smartSplit(n,",").map(s=>convertPythonValue(s)).join(",")+"]"}if(e.startsWith("dict(")&&e.endsWith(")")){const n=e.substring(5,e.length-1);return convertDictContent(n)}if(e.startsWith("{")&&e.endsWith("}")){const n=e.substring(1,e.length-1);return convertDictLiteral(n)}if(e.includes("+")){const n=e.split("+").map(o=>{const i=o.trim();return i.startsWith("'")||i.startsWith('"')?i.substring(1,i.length-1):i});return JSON.stringify(n.join(""))}if(e.startsWith("'''")||e.startsWith('"""')){e.substring(0,3);let n=e.substring(3,e.length-3);return n=n.replace(/\s+/g," ").trim(),JSON.stringify(n)}return e.startsWith("'")&&e.endsWith("'")||e.startsWith('"')&&e.endsWith('"')?JSON.stringify(e.substring(1,e.length-1)):e==="str"?'"str"':e==="int"?'"int"':e==="float"?'"float"':e==="bool"?'"bool"':e==="list"?'"list"':e==="dict"?'"dict"':JSON.stringify(e)}function convertDictContent(e){let n="{";const o=smartSplit(e,",");let i=!0;for(let s=0;s<o.length;s++){const r=o[s].trim();if(!r)continue;const l=r.indexOf("=");if(l===-1)continue;const a=r.substring(0,l).trim();let c=r.substring(l+1).trim();c=convertPythonValue(c),i||(n+=","),n+=`"${a}":${c}`,i=!1}return n+="}",n}function convertDictLiteral(e){let n="{";const o=smartSplit(e,",");let i=!0;for(let s=0;s<o.length;s++){const r=o[s].trim();if(!r)continue;const l=r.indexOf(":");if(l===-1)continue;let a=r.substring(0,l).trim(),c=r.substring(l+1).trim();(a.startsWith("'")&&a.endsWith("'")||a.startsWith('"')&&a.endsWith('"'))&&(a=a.substring(1,a.length-1)),c=convertPythonValue(c),i||(n+=","),n+=`"${a}":${c}`,i=!1}return n+="}",n}function generateScriptOsCode(e,n,o){const i="# === START_CONFIG_PARAMETERS ===",s="# === END_CONFIG_PARAMETERS ===",r=e.indexOf(i),l=e.indexOf(s);if(r===-1||l===-1)return e;const a=e.substring(0,r).trim(),c=e.substring(l+s.length).trim();if(!n.args||Object.keys(n.args).length===0){const f=n.info||{};let p=`# ${f.name||"ScriptO"}
`;return f.description&&(p+=`# ${f.description}
`),f.author&&(p+=`# Author: ${f.author}
`),p+=`
`,p+(a?a+`

`:"")+c}const d=n.info||{};let u=`# ${d.name||"ScriptO"}
`;d.description&&(u+=`# ${d.description}
`),d.author&&(u+=`# Author: ${d.author}
`),u+=`
`,a&&(u+=a+`

`),u+=`# Configuration
`,u+=`class args:
`;for(const f in n.args){const p=n.args[f];let h=o[f];h==null&&(h=p.value);let m;h==null?m="None":typeof h=="string"?m=`'${escapePythonString(h)}'`:typeof h=="boolean"?m=h?"True":"False":typeof h=="number"?m=h.toString():Array.isArray(h)?m="["+h.map(w=>typeof w=="string"?`'${escapePythonString(w)}'`:w).join(", ")+"]":m="None",u+=`    ${f} = ${m}
`}return u+=`
`,c&&(u+=c),u}function escapePythonString(e){return String(e).replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/\t/g,"\\t")}class IndexedDBFileBridge{constructor(){this.DB_NAME="scripto-studio-files",this.DB_VERSION=1,this.STORE_FILES="files",this.rootPath="/"}async _initDB(){return new Promise((n,o)=>{const i=indexedDB.open(this.DB_NAME,this.DB_VERSION);i.onerror=()=>o(i.error),i.onsuccess=()=>n(i.result),i.onupgradeneeded=s=>{const r=s.target.result;r.objectStoreNames.contains(this.STORE_FILES)||r.createObjectStore(this.STORE_FILES)}})}_normalizePath(n){return n?(n=n.replace(this.rootPath,""),n.startsWith("/")||(n="/"+n),n!=="/"&&n.endsWith("/")&&(n=n.slice(0,-1)),n):"/"}async _getFilesInDirectory(n){const o=this._normalizePath(n),i=o==="/"?"/":o+"/",s=await this._initDB();return new Promise((r,l)=>{const d=s.transaction([this.STORE_FILES],"readonly").objectStore(this.STORE_FILES).openCursor(),u=[],f=new Set;d.onsuccess=p=>{const h=p.target.result;if(h){const m=h.key,w=h.value;if(m.startsWith(i)){const y=m.substring(i.length);if(m.endsWith("/")&&w.type==="folder"){const S=y.slice(0,-1);S&&!S.includes("/")&&!f.has(S)&&(f.add(S),u.push({path:S,type:"folder"}))}else if(y&&!y.includes("/"))u.push({path:y,type:w.type||"file",content:w.content,timestamp:w.timestamp,size:w.size});else if(y.includes("/")){const S=y.split("/")[0];f.has(S)||(f.add(S),u.push({path:S,type:"folder"}))}}h.continue()}else u.sort((m,w)=>m.type===w.type?m.path.localeCompare(w.path):m.type==="folder"?-1:1),r(u)},d.onerror=()=>l(d.error)})}async initialize(){try{return await this._initDB(),!0}catch(n){return console.error("[IDB FS] Error initializing:",n),!1}}isSupported(){return"indexedDB"in window}async openFolder(){const n=await this.ilistFiles("/");return{folder:this.rootPath,files:n}}async ilistFiles(n){try{return(await this._getFilesInDirectory(n)).map(i=>{let s=i.size;return s===void 0&&i.type==="file"&&(i.content?typeof i.content=="string"?s=new TextEncoder().encode(i.content).length:i.content instanceof ArrayBuffer?s=i.content.byteLength:i.content instanceof Uint8Array?s=i.content.length:i.content instanceof Blob&&(s=i.content.size):s=0),{path:i.path,type:i.type,size:s}})}catch(o){return console.error("[IDB FS] Error listing files:",o),[]}}async ilistAllFiles(n){try{const o=this._normalizePath(n),i=o==="/"?"/":o+"/",s=await this._initDB();return new Promise((r,l)=>{const d=s.transaction([this.STORE_FILES],"readonly").objectStore(this.STORE_FILES).openCursor(),u=[],f=new Set;d.onsuccess=p=>{const h=p.target.result;if(h){const m=h.key,w=h.value;if(m.startsWith(i)){const y=m.substring(i.length);if(y){const S=y.split("/");let $=i.slice(0,-1);for(let C=0;C<S.length;C++)$+="/"+S[C],f.has($)||(f.add($),C===S.length-1&&w.type==="file"?u.push({path:$,type:"file"}):C<S.length-1&&u.push({path:$,type:"folder"}))}}h.continue()}else r(u)},d.onerror=()=>l(d.error)})}catch(o){return console.error("[IDB FS] Error listing all files:",o),[]}}async loadFile(n){try{const o=this._normalizePath(n),i=await this._initDB();return new Promise((s,r)=>{const c=i.transaction([this.STORE_FILES],"readonly").objectStore(this.STORE_FILES).get(o);c.onsuccess=()=>{const d=c.result;if(!d||d.type!=="file"){r(new Error(`File not found: ${n}`));return}const u=d.content||"",p=new TextEncoder().encode(u).buffer;console.log("[IDB FS] Loaded file:",n,"(",p.byteLength,"bytes)"),s(p)},c.onerror=()=>r(c.error)})}catch(o){throw console.error("[IDB FS] Error loading file:",o),new Error(`Failed to load file: ${o.message}`)}}async saveFileContent(n,o){try{const i=this._normalizePath(n);let s=o;o instanceof Uint8Array?s=new TextDecoder().decode(o):o instanceof ArrayBuffer?s=new TextDecoder().decode(new Uint8Array(o)):o instanceof Blob?s=await o.text():typeof o!="string"&&(s=String(o));const r=await this._initDB();return new Promise((l,a)=>{const u=r.transaction([this.STORE_FILES],"readwrite").objectStore(this.STORE_FILES).put({type:"file",content:s,timestamp:Date.now(),size:new TextEncoder().encode(s).length},i);u.onsuccess=()=>{console.log("[IDB FS] Saved file:",n),l(!0)},u.onerror=()=>a(u.error)})}catch(i){throw console.error("[IDB FS] Error saving file:",i),new Error(`Failed to save file: ${i.message}`)}}async importFiles(n="/"){return new Promise((o,i)=>{const s=document.createElement("input");s.type="file",s.multiple=!0,s.accept="*/*",s.onchange=async r=>{try{const l=Array.from(r.target.files);if(l.length===0){o([]);return}const a=[];for(const c of l){const d=await c.text(),u=this.getFullPath(n,"",c.name);await this.saveFileContent(u,d),a.push({name:c.name,path:u,size:c.size}),console.log("[IDB FS] Imported file:",c.name,"→",u)}o(a)}catch(l){console.error("[IDB FS] Error importing files:",l),i(l)}},s.oncancel=()=>{o([])},s.click()})}async fileExists(n){try{const o=this._normalizePath(n),i=await this._initDB();return new Promise((s,r)=>{const c=i.transaction([this.STORE_FILES],"readonly").objectStore(this.STORE_FILES).get(o);c.onsuccess=()=>{const d=c.result;s(d&&d.type==="file")},c.onerror=()=>r(c.error)})}catch{return!1}}async folderExists(n){try{const o=this._normalizePath(n),i=o.endsWith("/")?o:o+"/",s=o==="/"?"/":o+"/",r=await this._initDB();return new Promise((l,a)=>{const d=r.transaction([this.STORE_FILES],"readonly").objectStore(this.STORE_FILES),u=d.get(i);u.onsuccess=()=>{if(u.result&&u.result.type==="folder"){l(!0);return}const f=d.openCursor();f.onsuccess=p=>{const h=p.target.result;if(h){const m=h.key;if(m.startsWith(s)&&m!==i){l(!0);return}h.continue()}else l(!1)},f.onerror=()=>a(f.error)},u.onerror=()=>a(u.error)})}catch{return!1}}async removeFile(n){try{const o=this._normalizePath(n),i=await this._initDB();return new Promise((s,r)=>{const c=i.transaction([this.STORE_FILES],"readwrite").objectStore(this.STORE_FILES).delete(o);c.onsuccess=()=>{console.log("[IDB FS] Removed file:",n),s(!0)},c.onerror=()=>r(c.error)})}catch(o){throw console.error("[IDB FS] Error removing file:",o),new Error(`Failed to remove file: ${o.message}`)}}async renameFile(n,o){try{const i=this._normalizePath(n),s=this._normalizePath(o),r=await this.loadFile(n);return await this.saveFileContent(o,r),await this.removeFile(n),console.log("[IDB FS] Renamed file:",n,"->",o),!0}catch(i){throw console.error("[IDB FS] Error renaming file:",i),new Error(`Failed to rename file: ${i.message}`)}}async createFolder(n){try{const o=this._normalizePath(n),i=o.endsWith("/")?o:o+"/",s=await this._initDB();return new Promise((r,l)=>{const c=s.transaction([this.STORE_FILES],"readwrite").objectStore(this.STORE_FILES),d=c.get(i);d.onsuccess=()=>{if(d.result){console.log("[IDB FS] Folder already exists:",n),r(!0);return}const u=c.put({type:"folder",timestamp:Date.now()},i);u.onsuccess=()=>{console.log("[IDB FS] Created folder:",n),r(!0)},u.onerror=()=>l(u.error)},d.onerror=()=>l(d.error)})}catch(o){throw console.error("[IDB FS] Error creating folder:",o),new Error(`Failed to create folder: ${o.message}`)}}async removeFolder(n){try{const o=this._normalizePath(n),i=o==="/"?"/":o+"/",s=o.endsWith("/")?o:o+"/",r=await this._initDB();return new Promise((l,a)=>{const u=r.transaction([this.STORE_FILES],"readwrite").objectStore(this.STORE_FILES).openCursor(),f=[];u.onsuccess=p=>{const h=p.target.result;if(h){const m=h.key;(m.startsWith(i)||m===o||m===s)&&f.push(h.delete()),h.continue()}else Promise.all(f).then(()=>{console.log("[IDB FS] Removed folder:",n),l(!0)}).catch(a)},u.onerror=()=>a(u.error)})}catch(o){throw console.error("[IDB FS] Error removing folder:",o),new Error(`Failed to remove folder: ${o.message}`)}}async listFiles(n){return this.ilistFiles(n)}getFullPath(n,o,i){let s=n||"/";return o&&o!=="/"&&(s+=(s.endsWith("/")?"":"/")+o.replace(/^\//,"")),i&&(s+=(s.endsWith("/")?"":"/")+i),s.startsWith("/")||(s="/"+s),s}getNavigationPath(n,o){if(o===".."){const i=n.split("/").filter(s=>s);return i.pop(),"/"+i.join("/")}return n==="/"?"/"+o:n+"/"+o}async getAppPath(){return this.rootPath}async clearWorkspace(){try{const n=await this._initDB();return new Promise((o,i)=>{const l=n.transaction([this.STORE_FILES],"readwrite").objectStore(this.STORE_FILES).clear();l.onsuccess=()=>{console.log("[IDB FS] Workspace cleared"),o()},l.onerror=()=>i(l.error)})}catch(n){console.error("[IDB FS] Error clearing workspace:",n)}}async listScriptOsFiles(){try{const n="/ScriptOs",o=await this.ilistFiles(n),i=[];console.log(`[IDB FS] Found ${o.length} items in ScriptOs directory`);for(const s of o)if(s.type==="file"&&s.path.endsWith(".py"))try{const r=n+"/"+s.path,l=await this.loadFile(r),a=new TextDecoder().decode(new Uint8Array(l)),c=parseScriptOsConfig(a);c?(i.push({filename:s.path,fullPath:r,content:a,config:c}),console.log(`[IDB FS] Loaded ScriptO: ${c.info?.name||s.path}`)):console.warn(`[IDB FS] No valid config found in: ${s.path}`)}catch(r){console.error(`[IDB FS] Error loading ScriptO ${s.path}:`,r)}return console.log(`[IDB FS] Successfully loaded ${i.length} ScriptOs`),i}catch(n){return console.error("[IDB FS] Error listing ScriptOs files:",n),[]}}async hasOnboardedDevices(){try{return(await this.ilistFiles("/onboarded")).some(o=>o.type==="file"&&o.path.endsWith(".json"))}catch{return!1}}async getOnboardedDevices(){try{const n=await this.ilistFiles("/onboarded"),o=[];for(const i of n)if(i.type==="file"&&i.path.endsWith(".json"))try{const s=await this.loadFile("/onboarded/"+i.path),r=new TextDecoder().decode(new Uint8Array(s));o.push(JSON.parse(r))}catch(s){console.warn("[IDB FS] Error parsing device file:",i.path,s)}return o}catch(n){return console.error("[IDB FS] Error listing onboarded devices:",n),[]}}async addOnboardedDevice(n,o){try{await this.createFolder("/onboarded");const s="/onboarded/"+(n.replace(/:/g,"")+".json");await this.saveFileContent(s,JSON.stringify(o,null,2)),console.log("[IDB FS] Added onboarded device:",o.hostname||n)}catch(i){throw console.error("[IDB FS] Error adding onboarded device:",i),i}}}const BridgeDisk=new IndexedDBFileBridge;class ExtensionRegistry{constructor(){this.DB_NAME="scripto-studio-extension-registry",this.DB_VERSION=1,this.STORE_INDEX="index",this.STORE_EXTENSIONS="extensions",this.STORE_INSTALLED="installed"}async _initDB(){return new Promise((e,n)=>{const o=indexedDB.open(this.DB_NAME,this.DB_VERSION);o.onerror=()=>n(o.error),o.onsuccess=()=>e(o.result),o.onupgradeneeded=i=>{const s=i.target.result;s.objectStoreNames.contains(this.STORE_INDEX)||s.createObjectStore(this.STORE_INDEX,{keyPath:"id"}),s.objectStoreNames.contains(this.STORE_EXTENSIONS)||s.createObjectStore(this.STORE_EXTENSIONS,{keyPath:"id"}),s.objectStoreNames.contains(this.STORE_INSTALLED)||s.createObjectStore(this.STORE_INSTALLED,{keyPath:"id"})}})}async loadIndex(e){try{const n=await this._initDB();try{const o=await fetch(e);if(!o.ok)throw new Error(`Failed to fetch registry: ${o.status}`);const s=(await o.json()).extensions||[],l=n.transaction([this.STORE_INDEX],"readwrite").objectStore(this.STORE_INDEX);return await new Promise((a,c)=>{const d=l.put({id:"registry",timestamp:Date.now(),extensions:s});d.onsuccess=()=>a(),d.onerror=()=>c(d.error)}),console.log("[Extension Registry] Loaded and cached index:",s.length,"extensions"),s}catch(o){console.warn("[Extension Registry] Failed to fetch index, trying cache:",o);const s=n.transaction([this.STORE_INDEX],"readonly").objectStore(this.STORE_INDEX);return new Promise((r,l)=>{const a=s.get("registry");a.onsuccess=()=>{const c=a.result;c&&c.extensions?(console.log("[Extension Registry] Using cached index:",c.extensions.length,"extensions"),r(c.extensions)):l(new Error("No cached registry available"))},a.onerror=()=>l(a.error)})}}catch(n){return console.error("[Extension Registry] Error loading index:",n),[]}}parseExtensionConfig(content){const metaMatch=content.match(/export\s+const\s+__EXTENSION_META__\s*=\s*(\{[\s\S]*?\});/);if(!metaMatch)return console.error("[Extension Registry] No __EXTENSION_META__ found in V2 bundle"),null;try{return JSON.parse(metaMatch[1])}catch(error){try{return eval("("+metaMatch[1]+")")}catch(e){return console.error("[Extension Registry] Failed to parse V2 config:",error),null}}}async installExtension(e){try{console.log("[Extension Registry] Installing extension:",e.name);const n=await fetch(e.url);if(!n.ok)throw new Error(`Failed to fetch extension: ${n.status}`);const o=await n.text(),i=this.parseExtensionConfig(o);if(!i)throw new Error("Failed to parse extension config");const s=await this._initDB(),r={id:e.id,content:o,config:i,styles:i.styles||"",mipPackage:i.mipPackage||e.mipPackage||null,url:e.url,installedAt:Date.now()},a=s.transaction([this.STORE_EXTENSIONS],"readwrite").objectStore(this.STORE_EXTENSIONS);await new Promise((u,f)=>{const p=a.put(r);p.onsuccess=()=>u(),p.onerror=()=>f(p.error)});const d=s.transaction([this.STORE_INSTALLED],"readwrite").objectStore(this.STORE_INSTALLED);return await new Promise((u,f)=>{const p=d.put({id:e.id,name:i.name,icon:i.icon,iconSvg:i.iconSvg,menu:i.menu,version:i.version,mipPackage:i.mipPackage||null,installedAt:Date.now()});p.onsuccess=()=>u(),p.onerror=()=>f(p.error)}),console.log("[Extension Registry] Extension installed:",i.name),r}catch(n){throw console.error("[Extension Registry] Installation failed:",n),n}}async getInstalledExtensions(){try{const o=(await this._initDB()).transaction([this.STORE_INSTALLED],"readonly").objectStore(this.STORE_INSTALLED);return new Promise((i,s)=>{const r=o.getAll();r.onsuccess=()=>{console.log("[Extension Registry] Found installed extensions:",r.result.length),i(r.result)},r.onerror=()=>s(r.error)})}catch(e){return console.error("[Extension Registry] Error getting installed extensions:",e),[]}}async getExtension(e){try{const i=(await this._initDB()).transaction([this.STORE_EXTENSIONS],"readonly").objectStore(this.STORE_EXTENSIONS);return new Promise((s,r)=>{const l=i.get(e);l.onsuccess=()=>{l.result?(console.log("[Extension Registry] Loaded extension from cache:",e),s(l.result)):(console.warn("[Extension Registry] Extension not found in cache:",e),s(null))},l.onerror=()=>r(l.error)})}catch(n){return console.error("[Extension Registry] Error getting extension:",n),null}}async uninstallExtension(e){try{const n=await this._initDB(),i=n.transaction([this.STORE_EXTENSIONS],"readwrite").objectStore(this.STORE_EXTENSIONS);await new Promise((l,a)=>{const c=i.delete(e);c.onsuccess=()=>l(),c.onerror=()=>a(c.error)});const r=n.transaction([this.STORE_INSTALLED],"readwrite").objectStore(this.STORE_INSTALLED);return await new Promise((l,a)=>{const c=r.delete(e);c.onsuccess=()=>l(),c.onerror=()=>a(c.error)}),console.log("[Extension Registry] Extension uninstalled:",e),!0}catch(n){return console.error("[Extension Registry] Uninstall failed:",n),!1}}async installExtensionFromContent(e){try{const n=this.parseExtensionConfig(e);if(!n)throw new Error("Failed to parse extension config. Ensure the file is a valid bundle with __EXTENSION_META__.");if(!n.id)throw new Error('Extension config must have an "id" field');console.log("[Extension Registry] Installing extension from content:",n.name||n.id);const o=await this._initDB(),i={id:n.id,content:e,config:n,styles:n.styles||"",mipPackage:n.mipPackage||null,url:"local://dev",installedAt:Date.now()},r=o.transaction([this.STORE_EXTENSIONS],"readwrite").objectStore(this.STORE_EXTENSIONS);await new Promise((c,d)=>{const u=r.put(i);u.onsuccess=()=>c(),u.onerror=()=>d(u.error)});const a=o.transaction([this.STORE_INSTALLED],"readwrite").objectStore(this.STORE_INSTALLED);return await new Promise((c,d)=>{const u=a.put({id:n.id,name:n.name,icon:n.icon,iconSvg:n.iconSvg,menu:n.menu,version:n.version,mipPackage:n.mipPackage||null,installedAt:Date.now()});u.onsuccess=()=>c(),u.onerror=()=>d(u.error)}),console.log("[Extension Registry] Extension installed:",n.name),i}catch(n){throw console.error("[Extension Registry] Installation from content failed:",n),n}}async getDependencies(e){try{const i=(await this._initDB()).transaction([this.STORE_EXTENSIONS],"readonly").objectStore(this.STORE_EXTENSIONS);return new Promise((s,r)=>{const l=i.get(e);l.onsuccess=()=>{const a=l.result;a&&a.config&&a.config.mipPackage?s({mipPackage:a.config.mipPackage}):s(null)},l.onerror=()=>r(l.error)})}catch(n){return console.error("[Extension Registry] Error getting dependencies:",n),null}}async updateExtensionDev(e,n){try{console.log("[Extension Registry] DEV: Updating extension:",e);const o=this.parseExtensionConfig(n);if(!o)throw new Error("Failed to parse extension config from content");const i=await this._initDB(),s=await this.getExtension(e);if(!s)throw new Error(`App ${e} not found. Install it first.`);const r={id:e,content:n,config:o,styles:o.styles||"",mipPackage:o.mipPackage||null,url:s.url,installedAt:s.installedAt||Date.now()},a=i.transaction([this.STORE_EXTENSIONS],"readwrite").objectStore(this.STORE_EXTENSIONS);await new Promise((u,f)=>{const p=a.put(r);p.onsuccess=()=>u(),p.onerror=()=>f(p.error)});const d=i.transaction([this.STORE_INSTALLED],"readwrite").objectStore(this.STORE_INSTALLED);return await new Promise((u,f)=>{const p=d.put({id:e,name:o.name,icon:o.icon,menu:o.menu,version:o.version,mipPackage:o.mipPackage||null,installedAt:s.installedAt||Date.now()});p.onsuccess=()=>u(),p.onerror=()=>f(p.error)}),console.log("[Extension Registry] DEV: Extension updated successfully:",o.name),console.log("[Extension Registry] DEV: Reload the extension panel to see changes"),r}catch(o){throw console.error("[Extension Registry] DEV: Update failed:",o),o}}async updateExtensionDevFromFile(e,n){try{console.log("[Extension Registry] DEV: Fetching extension from:",n);const o=await fetch(n);if(!o.ok)throw new Error(`Failed to fetch file: ${o.status} ${o.statusText}`);const i=await o.text();return await this.updateExtensionDev(e,i)}catch(o){throw console.error("[Extension Registry] DEV: Failed to load file:",o),o}}}const extensionLoader=Object.freeze(Object.defineProperty({__proto__:null,ExtensionRegistry},Symbol.toStringTag,{value:"Module"}));let DeviceAPI$1=class{constructor(n){this.device=n}async execute(n,o={}){if(!this.device)throw new Error("Device not connected");try{return await this.device.exec(n)||""}catch(i){throw o.suppressErrors||console.error("[DeviceAPI] Execution error:",i),i}}async saveFile(n,o,i={}){if(!this.device)throw new Error("Device not connected");return this.device.saveFile(n,o,{skipIfSame:!0,...i})}openCanStream(n){return this.device.openCanStream(n)}subscribe(n,o){this.device&&this.device.subscribe(n,o)}unsubscribe(n){this.device&&this.device.unsubscribe(n)}async mkdir(n){if(!this.device)throw new Error("Device not connected");await this.device.exec(`
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
`)}parseJSON(n){if(n&&typeof n=="object")return n;if(!n)throw new Error("Empty output from device");typeof n!="string"&&(n=String(n));try{return JSON.parse(n)}catch{const i=n.indexOf("{");if(i!==-1){let s=0,r=-1;for(let l=i;l<n.length;l++)if(n[l]==="{"&&s++,n[l]==="}"&&s--,s===0){r=l+1;break}if(r!==-1){const l=n.substring(i,r);try{return JSON.parse(l)}catch{throw new Error("Failed to parse extracted JSON: "+l.substring(0,100))}}}throw new Error("Failed to parse response: "+n.substring(0,100))}}};const deviceApi=Object.freeze(Object.defineProperty({__proto__:null,DeviceAPI:DeviceAPI$1},Symbol.toStringTag,{value:"Module"})),language="Language",sidebar={home:"Home",about:"About",editor:"Editor",files:"Files",system:"System",agent:"Agent",networks:"Networks",wifi:"WiFi",ethernet:"Ethernet",vpn:"VPN",btle:"Bluetooth LE",wwan:"WWAN",mqtt:"MQTT",telephony:"Telephony",ntp:"NTP",can:"CAN",peripherals:"Peripherals",gps:"GPS",modem:"Modem",sdcard:"SD Card",settings:"Settings",firmware:"Firmware"},appearance={theme:"Theme",themeHint:"Choose your preferred color theme",themeLight:"Light",themeDark:"Dark",themeDevice:"Device",themeCurrentlyUsing:"Currently using:",themeFromSystem:"(from system)",colorScheme:"Color Scheme",colorSchemeHint:"Select an accent color for the interface",colorTeal:"Teal",colorBlue:"Blue",colorPurple:"Purple",colorGreen:"Green",colorRed:"Red",colorOrange:"Orange",editorTheme:"Editor Theme",editorThemeHint:"Choose a color theme for the code editor",editorAuto:"Auto",editorAutoDesc:"Matches app theme",editorCobalt:"Cobalt",editorCobaltDesc:"Classic dark blue",editorXcode:"Xcode",editorXcodeDesc:"Apple-style",editorCoolGlow:"Cool Glow",editorCoolGlowDesc:"Neon vibes",temperatureUnit:"Temperature Unit",temperatureUnitHint:"Choose how temperature is displayed",temperatureCelsius:"Celsius (°C)",temperatureFahrenheit:"Fahrenheit (°F)"},toolbar={new:"New",newTooltip:"New",save:"Save",saveTooltip:"Save",stop:"Stop",stopTooltip:"Stop",stopDebugTooltip:"Stop Debug",run:"Run",runTooltip:"Run",continue:"Continue",continueTooltip:"Continue",startDebugging:"Start Debugging",step:"Step",stepOverTooltip:"Step Over",stepIn:"Step In",stepIntoTooltip:"Step Into",stepOut:"Step Out",stepOutTooltip:"Step Out",debug:"Debug",debugTooltip:"Start Debugging",scripto:"ScriptO",scriptoTooltip:"Open ScriptO Library",extensions:"Apps",extensionsTooltip:"Manage Apps"},sysinfo={title:"System Information",studioTitle:"ScriptO Studio",studioVersion:"Studio Version:",studioCommit:"Build:",studioBuildDate:"Build Date:",firmwareTitle:"Firmware",firmwareVersion:"Firmware Version:",firmwareBuilt:"Built:",firmwareOrigin:"Origin:",loading:"Loading system information...",boardInfo:"Board Information",loadingBoard:"Loading board information...",boardName:"Board Name:",boardId:"Board ID:",chip:"Chip:",hardwareRevision:"Hardware Revision:",version:"Version:",description:"Description:",mcuTitle:"MCU & MicroPython",uniqueId:"Unique ID:",frequency:"Frequency:",flashSize:"Flash Size:",platform:"Platform:",system:"System:",release:"Release:",implementation:"Implementation:",spiram:"SPIRAM:",mpyVersion:"MPY Version:",yes:"Yes",no:"No",partitions:"Flash Partitions",partitionName:"Name",partitionType:"Type",partitionOffset:"Offset",partitionSize:"Size",notAvailable:"N/A",mhz:"MHz",demoTitle:"Scripto Studio",demoTagline:"Natural language programming for robots.",featureFast:"🌐 Fast, Secure Development",featureFastDesc:"Real-time code execution and debugging, no firmware updates required! Works in all modern browsers, and on iOS and Android via the PWA.",featureEditor:"📝 Smart Python Editor",featureEditorDesc:"Agentic code editor for MicroPython with syntax highlighting, file management, and seamless deployment to connected devices.  Just describe what you want, and the agent will do the rest.",featureScripto:"📜 ScriptO Automations",featureScriptoDesc:"Script Objects are the ultimate device customization tool. Choose from a library of ScriptOs to get started, or roll your own with the Smart Python Editor.",featureExtensions:"🔌 System Extensions",featureExtensionsDesc:"Add major new system features at the touch of a button.  Load Extensions from the Scripto Studio library, such as OVMS, OpenInverter, Dala's Battery Emulator  or create your own that can be shared with the community.",featureManagement:"⚙️ Device Management",featureManagementDesc:"Connect and manage devices, configure board settings, manage user credentials, network settings and more. Access your devices from anywhere in the world, on any device over a secure P2P VPN",featureMonitoring:"🔧 Visual Debugger",featureMonitoringDesc:" Advanced visual debugger with single Step and Watchpoints, together with Live system monitoring and performance metrics make debugging embedded applications easier than ever.",connectDevice:"🚀 Connect Device"},agentPanel={title:"Use with an agent",intro:"An agent on your computer can operate this board: run code, move files, and use the tools your installed apps provide. Studio stays connected alongside it.",watch:"What an agent does shows up in the terminal and the Logs window. Stop, above the editor, breaks whatever it's running and stops its background tasks and apps.",connectFirst:"Connect to your board, and what to paste appears here.",claudeCode:"Claude Code",claudeCodeHint:`Paste this into a terminal, once, from any folder. Then start a new Claude Code session and ask it something like "plot a sine wave on the board's terminal". Its code and output appear in the terminal here.`,tokenHint:"The copied text includes this board's agent token, which lets whoever has it run code on the board.",otherAgents:"Other agents",otherAgentsHint:"Any MCP client that speaks HTTP can use this address, with this header:",noInstall:"With nothing to install",noInstallHint:"PFC runs an agent on the board itself, so this computer needs nothing. Install it from Apps.",openApps:"Open Apps",copy:"Copy",copied:"Copied"},home={connected:"Connected",noBoard:"No board connected",connecting:"Connecting…",connectBoard:"Connect a board",connect:"Connect",boardsUsed:"Boards you've used",noBoardsYet:"Connect a board, or set up a new one, and it stays listed here.",setUpBoard:"Set up a new board",scriptos:"ScriptOs",noScriptos:"Nothing on this board yet. What an agent makes for it stays here.",runAtStartup:"At startup",start:"Start",stop:"Stop",remove:"Remove",code:"Code",cancel:"Cancel",confirmRemove:"Remove {name} and its code from this board? Its data stays.",restarted:"restarted {count} times",toolsForAgents:"Tools for agents: {count}",nothingToRun:"Nothing to run",examples:"Examples",browseApps:"Browse apps",docs:"Docs",agent:"Agent",question:"What should this board do?",connectBoardFirst:"Connect a board, and an agent can get to work on it.",state:{running:"Running",stopped:"Stopped",not_started:"Not started",crashed:"Crashed"},capability:{can:"CAN",wwan:"Modem",rtc:"Clock",imu:"Motion",buzzer:"Buzzer",gnss:"GPS",display:"Display",sd_card:"SD card",sdcard:"SD card",ethernet:"Ethernet",camera:"Camera",audio:"Audio",bluetooth:"Bluetooth"},placeholder:"Beep when the board is tilted",send:"Send",newChat:"New chat",otherAgents:"Other agents",useAnother:"Use another agent",addKey:"Add an API key",changeKey:"API key",needsKey:"Studio's agent runs in this browser, on your own OpenRouter API key.",keyTitle:"Your OpenRouter API key",keyHint:"It stays in this browser, in a separate frame that Studio's pages and Apps can't read. Using it is billed to your OpenRouter account.",keyPlaceholder:"sk-or-…",keySave:"Save",keyForget:"Forget this key",keyBadShape:"That isn't an OpenRouter key. Those start with sk-or-.",keyRejected:"OpenRouter didn't accept this key. Check it's your OpenRouter key (sk-or-…).",typeSomething:"Type what the board should do",frameMissing:"Studio couldn't load the frame that holds your API key.",stopped:"Stopped",notRun:"This wasn't run, because the reply was cut short.",refused:"The model declined this request.",cutShort:"The reply was too long and got cut short. Ask for less at once.",tooManyRounds:"The agent stopped after a lot of steps. Tell it to carry on if it should.",compacted:"Earlier work was summarised to make room.",compactFailed:"Couldn't summarise this chat to make room. Try again, or start a new chat.",interrupted:"The page closed while the agent was working, so it stopped there.",askAgent:"Ask agent",crashOf:"{name} crashed",detach:"Remove this",suggest:{tilt:"Beep when the board is tilted",canLog:"Log CAN traffic to a file",drift:"Show how far the clock chip drifts from NTP",ledFade:"Fade the status LED through some colours",freeMemory:"Tell me how much memory is free"},model:"Model",noCredits:"Your OpenRouter account is out of credits.",modelSearch:"Search models",freeOnly:"Free only",free:"free",thinking:"Thinking…",askDelete:"Delete {path}?",askWrite:"Write to {path}?",askExec:"Run this code? It looks like it deletes files, resets the board or changes partitions.",askReplace:"Replace the ScriptO {id}?",askRemove:"Remove the ScriptO {id}?",askReset:"Reset the board?",askStop:"Stop everything running on the board?",askTool:"Run {tool}?",allow:"Allow",allowChat:"Allow for this chat",deny:"Deny",allowed:"Allowed",denied:"Denied",agentWaiting:"The agent is waiting for your answer"},firmware={deviceSetup:"Device Setup",deviceSetupHint:"Connect your ESP32 device via USB to get started",connectDevice:"Connect Device",connectHint:"Plug in your ESP32 via USB and click Connect.",disconnect:"Disconnect",back:"← Back",statusLog:"Status Log",readyToFlash:"Ready to Flash",pyDirectDetected:"Device Detected",newDevice:"Flash Device",newDeviceDesc:"Flash fresh firmware onto a blank ESP32",forgotCredentials:"Forgot Credentials",forgotCredentialsDesc:"View saved hostname and WiFi network",changeWifi:"Change WiFi",changeWifiDesc:"Update network settings on existing device",reProvision:"Re-provision",reProvisionDesc:"Fresh start with new certificates",deviceInfo:"Device Information",chip:"Chip",macAddress:"MAC Address",flashSize:"Flash Size",flashingNotice:"Firmware flashing will be available in the next update.",selectFirmware:"Select Firmware",boardsFailed:"Couldn't load the list of boards, so this board would only get generic settings.",tryAgain:"Try again",flashButton:"Flash Firmware",loadingFirmware:"Loading firmware options...",downloading:"Downloading...",flashing:"Flashing...",writingToFlash:"Finishing up, please wait...",flashComplete:"Flash Complete",flashSuccess:"Firmware installed successfully!",flashSuccessHint:"Your device is ready for WiFi configuration.",configureWifi:"Configure WiFi",skipForNow:"Skip for now",deviceCredentials:"Device Credentials",hostname:"Hostname",password:"Password",wifiNetwork:"WiFi Network",readingCredentials:"Reading credentials...",wifiNetworks:"WiFi Networks",scanningNetworks:"Scanning for networks...",noNetworksFound:"No networks found",wifiPassword:"WiFi Password",connect:"Connect",reProvisionTitle:"Re-provision Device",reProvisionHint:"Generating new certificates and password. WiFi settings will be preserved.",reProvisionComplete:"Re-provision Complete!",reProvisionSuccess:"Your device has new certificates. Hostname:",browserSecurityTitle:"Next: Accept Browser Security Warning",browserSecurityHint:`When you visit your device, your browser will show a security warning. This is expected — click "Advanced" then "Proceed" to trust your device's new certificate.`,openDeviceSetup:"Open Device Setup",done:"Done",generatingCerts:"This will generate new certificates and reset the device to setup mode.",checkTerminal:"Check the terminal below for progress.",overUsb:"Over USB",overUsbHint:"For a new board, forgotten credentials, a new Wi-Fi network or new certificates. Studio asks for the USB port when you pick one."},apps="Apps",add_app="Add app",platformUpdate={thisBoard:"This board",variant:"Variant",release:"Installed release",botiq:"botIQ",firmwareBuild:"Firmware build",appSlots:"App slots",twoSlots:"2, running {slot}",oneSlot:"1, so firmware updates over USB",notRecorded:"Not recorded",checking:"Checking ScriptoHub for a platform update…",upToDate:"Up to date",notOffered:"No update offered",checkAgain:"Check again",frameworkAvailable:"Framework {version} is available",frameworkDetail:"Only botIQ's files change, and the firmware stays. The board restarts once they're in.",firmwareAvailable:"Firmware and framework {version} are available",firmwareDetail:"New firmware ({size}) and botIQ's files. The board restarts on them, and keeps them once its apps run again.",needsUsb:"This board has one app slot, so its firmware is updated over USB.",update:"Update",confirm:"Update this board to {version}? It restarts at the end, and its apps stop until it's back.",cancel:"Cancel",notNow:"{app} says now isn't safe: {why}",heldBackBotiq:"Held back: {app} needs botIQ {range}, and {version} is outside it.",heldBackModules:"Held back: {app} needs {modules} in the firmware, and {version} doesn't have it.",appsUnknown:"Held back: Studio couldn't check what the installed apps need ({why}).",startRefused:"The board didn't start the update: {why}",updatingTo:"Updating to {version}",preparing:"Checking the release",downloadingFirmware:"Downloading the firmware: {done} of {total}",downloadingFiles:"Downloading botIQ's files: {done} of {total}",verifying:"Checking the firmware it wrote",installing:"Installing. Keep the board powered.",restarting:"Restarting on {version}. Studio reconnects when the board is back.",trial:"On trial: the board keeps {version} once its apps run again, within two minutes.",lost:"Studio lost the board while it restarted. Connect again to see how the update to {version} ended.",waiting:"Waiting for {app}: {why}",installed:"Installed {version}.",putBack:"{version} was put back: {why}. The board runs what it ran before.",failed:"The update to {version} stopped: {why}. Nothing on the board changed.",cancelled:"Update cancelled. Updating again picks up the download where it stopped.",error:"The update to {version} failed: {why}",ok:"OK",noNewerRelease:"ScriptoHub has no newer platform release for this board.",newest:"{version} is the newest platform release.",notChecked:"Not checked for updates yet"},en={language,sidebar,appearance,toolbar,debugger:{debugSession:"Debug Session",setupDebugger:"Setup Debugger",watchExpressions:"Watch Expressions",watchExpressionsHelp:"Expressions to evaluate on each step",watchPlaceholder:"e.g., x * 2",liveVariables:"Live Variables",noVariablesCaptured:"No variables captured.",targetFile:"Target File",noFileSelected:"No file selected",startDebugging:"Start Debugging",noPythonFiles:"No Python files open. Please open a .py file to debug."},sysinfo,agentPanel,home,firmware,apps,add_app,platformUpdate};let translations={en,de:{},es:{},fr:{},zh:{}},currentLocale="en";function initTranslations(e,n,o,i,s){translations.en=e||translations.en,translations.de=n||translations.de,translations.es=o||translations.es,translations.fr=i||translations.fr,translations.zh=s||translations.zh}function getLocale(){return currentLocale}function setLocale(e){getAvailableLocales().includes(e)&&(currentLocale=e)}function getAvailableLocales(){return["en","de","es","fr","zh"]}function getLocaleName(e){return{en:"English",de:"Deutsch",es:"Español",fr:"Français",zh:"中文"}[e]||e}function t(e,n={}){const i=translations[currentLocale||"en"]||translations.en,s=e.split(".");let r=i;for(const l of s)if(r&&typeof r=="object"&&l in r)r=r[l];else{let c=translations.en||{};for(const d of s)if(c&&typeof c=="object"&&d in c)c=c[d];else return e;r=c;break}return typeof r!="string"?e:Object.keys(n).length>0?r.replace(/\{(\w+)\}/g,(l,a)=>n[a]!==void 0?n[a]:l):r}const i18n={initTranslations,getLocale,setLocale,getAvailableLocales,getLocaleName,t};window.i18n=i18n;const MCP_PATH="/mcp",PROTOCOL_VERSION="2026-07-28",PROTOCOL_META={"io.modelcontextprotocol/protocolVersion":PROTOCOL_VERSION,"io.modelcontextprotocol/clientCapabilities":{},"io.modelcontextprotocol/clientInfo":{name:"scripto-studio",version:"2.0.0"}},AGENT_CLIENT_NAME="Studio agent",NOTIFY_EVENT="notifications/com.scriptostudio/event",NOTIFY_STREAM="notifications/com.scriptostudio/stream",NOTIFY_LOG="notifications/message",NOTIFY_TOOLS_CHANGED="notifications/tools/list_changed",LOG_LEVELS={debug:0,info:1,notice:1,warning:2,error:3,critical:3,alert:3,emergency:3},CONNECT_TIMEOUT_MS=1e4,REQUEST_TIMEOUT_MS=3e4,COMPLETION_TIMEOUT_MS=5e3,INTERRUPT_WAIT_MS=2e3,EXEC_TIMEOUT_MS=3e4,CLOSE_POLICY_VIOLATION=1008,FRAME_HEADER_SIZE=8,FRAME_DATA=0,FRAME_CREDIT=1,FRAME_END=2,FRAME_CONTROL=3,CONTROL_INTERRUPT=1,CONTROL_TX_ARM=2,CONTROL_TX_DISARM=3,CAN_RECORD_SIZE=20,TERMINAL_LINE=0,TERMINAL_WHOLE=1,FILE_CHUNK=16384,DEBUG_START="\x1B[?1049hD",DEBUG_END="D\x1B[?1049l",textEncoder=new TextEncoder;function toHex(e){return Array.from(new Uint8Array(e)).map(n=>n.toString(16).padStart(2,"0")).join("")}async function deriveToken(e,n){const o=await crypto.subtle.digest("SHA-256",textEncoder.encode(`ss-${n}:${e}`));return toHex(o).slice(0,32)}function withPath(e,n){const o=new URL(e);return o.pathname=n,o.search="",o.toString()}function buildFrame(e,n,o,i=null,s=0){const r=i?i.byteLength:0,l=new Uint8Array(FRAME_HEADER_SIZE+r),a=new DataView(l.buffer);return a.setUint8(0,e),a.setUint8(1,n),a.setUint16(2,s,!0),a.setUint32(4,o,!0),i&&l.set(i,FRAME_HEADER_SIZE),l}function parseExecOutput(e){if(!e)return null;try{return JSON.parse(e)}catch{const o=e.indexOf("{");if(o===-1)return e;let i=0;for(let s=o;s<e.length;s++)if(e[s]==="{"&&i++,e[s]==="}"&&i--,i===0)try{return JSON.parse(e.substring(o,s+1))}catch{return e}return e}}function lastLine(e){const n=e.trim().split(`
`);return n[n.length-1].trim()}function refusalError(e){let n="Authentication failed";e==="origin"?n=`This board doesn't accept connections from ${globalThis.location?.origin||"this address"}. Add it to the board's server.allowed_origins setting.`:e==="full"&&(n="This board has no free connections. Close another client and try again.");const o=new Error(n);return o.explained=e==="origin"||e==="full",o}class McpDevice{constructor(){this.websocket=null,this.state="DISCONNECTED",this.isReady=!1,this.authenticated=!1,this.dataCallbacks=[],this.connectionClosedCallbacks=[],this.eventHandlers=new Map,this.onEthStatus=null,this.onWwanStatus=null,this.onDisplayUi=null,this.nextId=1,this.meta=PROTOCOL_META,this.pendingRequests=new Map,this.pendingRun=null,this.terminalStream=null,this.terminalDecoder=new TextDecoder,this.fileStreams=new Map,this.openingStreams=0,this.earlyFrames=new Map,this._pendingInputEcho=null}async connect(n,o="password"){if(this.state!=="DISCONNECTED")throw new Error("Already connected or connecting");const i=await deriveToken(o,"human");this.agentToken=await deriveToken(o,"agent");const s=withPath(n,MCP_PATH);this.state="CONNECTING";try{await this._open(s,i),await this._request("server/discover"),await this._request("logging/setLevel",{level:"debug"});const r=await this._tool("stream_open",{kind:"terminal"});this.terminalStream=JSON.parse(r.text).stream,this.terminalDecoder=new TextDecoder,this.authenticated=!0,this.isReady=!0,console.log("[MCP] Connected to",s)}catch(r){const l=this.websocket;throw this._teardown(),l&&l.close(),r}}async connectAsAgent(n,o){if(this.state!=="DISCONNECTED")throw new Error("Already connected or connecting");this.meta={...PROTOCOL_META,"io.modelcontextprotocol/clientInfo":{...PROTOCOL_META["io.modelcontextprotocol/clientInfo"],name:AGENT_CLIENT_NAME}},this.state="CONNECTING";try{await this._open(withPath(n,MCP_PATH),o);const i=await this._request("server/discover");this.instructions=i.instructions,this.authenticated=!0,this.isReady=!0}catch(i){const s=this.websocket;throw this._teardown(),s&&s.close(),i}}async listTools(){return(await this._request("tools/list")).tools}callTool(n,o,i){return this._tool(n,o,i)}breakRunning(){this.state==="CONNECTED"&&this.websocket.send(buildFrame(FRAME_CONTROL,CONTROL_INTERRUPT,0))}_open(n,o){return new Promise((i,s)=>{const r=new WebSocket(n,["mcp",`ss.${o}`]);r.binaryType="arraybuffer",this.websocket=r;let l=!1;const a=setTimeout(()=>{s(new Error("Connection timeout"))},CONNECT_TIMEOUT_MS);r.addEventListener("open",()=>{l=!0,clearTimeout(a),this.state="CONNECTED",i()}),r.addEventListener("message",c=>this._handleMessage(c)),r.addEventListener("close",c=>{if(clearTimeout(a),this.websocket!==r)return;const d=this.authenticated,u=c.code===CLOSE_POLICY_VIOLATION;this._failPending(u?refusalError(c.reason):new Error("Connection closed")),this._teardown(),d&&this._notifyConnectionClosed(),l||s(new Error("Could not connect to the device"))})})}async disconnect(){const n=this.websocket;this._failPending(new Error("Disconnected")),this._teardown(),n&&n.close()}_teardown(){this.websocket=null,this.state="DISCONNECTED",this.isReady=!1,this.authenticated=!1,this.terminalStream=null,this.pendingRun=null,this._pendingInputEcho=null}_failPending(n){for(const o of this.pendingRequests.values())clearTimeout(o.timeoutId),o.reject(n);this.pendingRequests.clear(),this.pendingRun&&this.pendingRun.reject(n);for(const o of this.fileStreams.values())o.fail(n);this.fileStreams.clear()}_request(n,o={},i=REQUEST_TIMEOUT_MS){return this.state!=="CONNECTED"?Promise.reject(new Error("Not connected")):new Promise((s,r)=>{const l=this.nextId++,a=setTimeout(()=>{this.pendingRequests.delete(l),r(new Error(`${n} timeout`))},i);this.pendingRequests.set(l,{resolve:s,reject:r,timeoutId:a}),this.websocket.send(JSON.stringify({jsonrpc:"2.0",id:l,method:n,params:{...o,_meta:this.meta}}))})}async _tool(n,o={},i=REQUEST_TIMEOUT_MS){const s=await this._request("tools/call",{name:n,arguments:o},i);return{text:s.content[0].text,isError:!!s.isError}}_handleMessage(n){if(n.data instanceof ArrayBuffer){this._handleFrame(n.data);return}const o=JSON.parse(n.data);if(o.id!==void 0&&o.id!==null){const i=this.pendingRequests.get(o.id);if(!i)return;this.pendingRequests.delete(o.id),clearTimeout(i.timeoutId),o.error?i.reject(new Error(o.error.message)):i.resolve(o.result)}else o.method===NOTIFY_EVENT?this._handleEvent(o.params):o.method===NOTIFY_STREAM?this._handleStreamNote(o.params):o.method===NOTIFY_LOG?this._handleLog(o.params):o.method===NOTIFY_TOOLS_CHANGED&&this.eventHandlers.get("tools_changed")?.()}_handleEvent(n){n.eth_status!==void 0&&this.onEthStatus&&this.onEthStatus(n.eth_status),n.wwan_status!==void 0&&this.onWwanStatus&&this.onWwanStatus(n.wwan_status),n.display_ui!==void 0&&this.onDisplayUi&&this.onDisplayUi(n.display_ui);for(const[i,s]of Object.entries(n)){const r=this.eventHandlers.get(i);r&&r(s)}const o=this.eventHandlers.get("info");o&&o(n)}_handleLog({level:n,logger:o,data:i}){const s=this.eventHandlers.get("log");s&&s({level:LOG_LEVELS[n]??1,message:i,timestamp:Date.now(),source:o})}_handleStreamNote({stream:n,state:o,prompt:i,error:s,message:r}){if(n===this.terminalStream&&o==="prompt"){this.isReady=!0;const a=this.pendingRun;this.pendingRun=null,a&&(s?a.reject(new Error(s)):a.resolve());return}const l=this.fileStreams.get(n);l&&o==="error"&&(l.error=r)}_handleFrame(n){if(n.byteLength<FRAME_HEADER_SIZE)return;const o=new DataView(n),i=o.getUint8(0),s=o.getUint8(1),r=o.getUint16(2,!0),l=o.getUint32(4,!0),a=new Uint8Array(n,FRAME_HEADER_SIZE);if(s===this.terminalStream){i===FRAME_DATA&&this._handleTerminalData(this.terminalDecoder.decode(a,{stream:!0}));return}const c=this.fileStreams.get(s);c?c.frame(i,l,a,r):this.openingStreams>0&&(this.earlyFrames.has(s)||this.earlyFrames.set(s,[]),this.earlyFrames.get(s).push([i,l,a,r]))}async _openFileStream(n){this.openingStreams++;try{const o=await this._tool("stream_open",n);if(o.isError)throw new Error(lastLine(o.text));return JSON.parse(o.text)}catch(o){throw this.openingStreams--,this.openingStreams===0&&this.earlyFrames.clear(),o}}_listen(n,o){this.fileStreams.set(n,o);const i=this.earlyFrames.get(n)||[];this.earlyFrames.delete(n),this.openingStreams--,this.openingStreams===0&&this.earlyFrames.clear();for(const[s,r,l,a]of i)o.frame(s,r,l,a)}_handleTerminalData(n){const o=this.parseDebugState(n);if(o){const i=this.eventHandlers.get("debug-state");i&&i(o)}this._notifyData(n)}_sendTerminal(n,o){this.websocket.send(buildFrame(FRAME_DATA,this.terminalStream,0,textEncoder.encode(n),o))}async exec(n){const o=await this._tool("exec",{code:n+`
`,echo:!1,timeout_ms:EXEC_TIMEOUT_MS},EXEC_TIMEOUT_MS+1e3);if(o.isError)throw new Error(lastLine(o.text));return parseExecOutput(o.text)}async run(n){if(this.state!=="CONNECTED")throw new Error("Not connected");return this.isReady||await this.interrupt(),this.isReady=!1,new Promise((o,i)=>{this.pendingRun={resolve:o,reject:i},this._sendTerminal(n+`
`,TERMINAL_WHOLE)})}async sendInput(n){if(this.state!=="CONNECTED")throw new Error("Not connected");this._pendingInputEcho=n+`\r
`,this._sendTerminal(n+"\r",TERMINAL_LINE)}async requestCompletion(n){const o=await this._tool("repl_complete",{prefix:n},COMPLETION_TIMEOUT_MS),{suffix:i,candidates:s}=JSON.parse(o.text);return i?[i]:s}async appsList(){return JSON.parse((await this._tool("scriptos_list")).text).scriptos}async appAction(n,o){const{text:i,isError:s}=await this._tool(n,o);if(s)throw new Error(i)}armTx(n){if(this.state!=="CONNECTED")throw new Error("Not connected");this.websocket.send(buildFrame(FRAME_CONTROL,CONTROL_TX_ARM,n))}disarmTx(){if(this.state!=="CONNECTED")throw new Error("Not connected");this.websocket.send(buildFrame(FRAME_CONTROL,CONTROL_TX_DISARM,0))}async openCanStream({ack:n=!1,onFrames:o}){const i=await this._openFileStream({kind:"can",ack:n});let s=null;return this._listen(i.stream,{frame:(r,l,a)=>{if(r!==FRAME_DATA)return;const c=s===null?0:(l-s)/CAN_RECORD_SIZE;s=l+a.byteLength,o(a,c)}}),{status:async()=>JSON.parse((await this._tool("stream_status",{stream:i.stream})).text),close:async()=>{this.fileStreams.delete(i.stream),await this._tool("stream_close",{stream:i.stream})}}}async interrupt(){if(this.state!=="CONNECTED")throw new Error("Not connected");this.websocket.send(buildFrame(FRAME_CONTROL,CONTROL_INTERRUPT,0));try{await this._tool("stop_user_tasks")}catch(n){console.warn("[MCP] Failed to stop tasks:",n)}if(!this.pendingRun){this.isReady=!0;return}await new Promise(n=>{const o=Date.now(),i=setInterval(()=>{(this.isReady||Date.now()-o>INTERRUPT_WAIT_MS)&&(clearInterval(i),this.isReady=!0,n())},50)})}async reset(n=!1){await this._tool("reset",{mode:n?"hard":"soft"})}async _isSameOnDevice(n,o){const i=await this._tool("fs_hash",{path:n});if(i.isError)return!1;const s=await crypto.subtle.digest("SHA-256",o);return JSON.parse(i.text).sha256===toHex(s)}async saveFile(n,o,i={}){const s=typeof o=="string"?textEncoder.encode(o):o,r=Date.now(),l=i.progressCallback;if(i.skipIfSame&&await this._isSameOnDevice(n,s)){l&&l(100),console.log(`[MCP] Unchanged: ${n}`);return}const a=await this._openFileStream({kind:"file_write",path:n,chunk:FILE_CHUNK});await new Promise((d,u)=>{let f=a.credit,p=0;const h=()=>{for(;p<s.length&&p+Math.min(FILE_CHUNK,s.length-p)<=f;){const w=s.subarray(p,p+FILE_CHUNK);this.websocket.send(buildFrame(FRAME_DATA,a.stream,p,w)),p+=w.length,l&&l(Math.min(Math.floor(p/s.length*100),99))}p===s.length&&!m.ended&&(m.ended=!0,this.websocket.send(buildFrame(FRAME_END,a.stream,p)))},m={ended:!1,error:null,fail:u,frame:(w,y,S,$)=>{w===FRAME_CREDIT?(f=y,h()):w===FRAME_END&&(this.fileStreams.delete(a.stream),$?u(new Error(m.error||"Upload failed")):d())}};this._listen(a.stream,m),l&&l(0),h()}),l&&l(100);const c=(Date.now()-r)/1e3;console.log(`[MCP] Upload complete: ${n} (${s.length} bytes in ${c.toFixed(2)}s = ${(s.length/c/1024).toFixed(2)} KB/s)`)}async loadFile(n,o={}){const i=Date.now(),s=o.progressCallback,r=await this._openFileStream({kind:"file_read",path:n,chunk:FILE_CHUNK}),l=await new Promise((c,d)=>{const u=[];let f=0;const p={error:null,fail:d,frame:(h,m,w,y)=>{if(h===FRAME_DATA)u.push(w),f+=w.length,s&&r.length>0&&s(Math.min(Math.floor(f/r.length*100),99));else if(h===FRAME_END){if(this.fileStreams.delete(r.stream),y){d(new Error(p.error||"Download failed"));return}const S=new Uint8Array(f);let $=0;for(const C of u)S.set(C,$),$+=C.length;c(S)}}};this._listen(r.stream,p)});s&&s(100);const a=(Date.now()-i)/1e3;return console.log(`[MCP] Download complete: ${n} (${l.length} bytes in ${a.toFixed(2)}s = ${(l.length/a/1024).toFixed(2)} KB/s)`),l}subscribe(n,o){this.eventHandlers.set(n,o)}unsubscribe(n){this.eventHandlers.delete(n)}onData(n){this.dataCallbacks=[n]}onConnectionClosed(n){this.connectionClosedCallbacks.push(n)}_notifyData(n){if(this._pendingInputEcho&&n.includes(this._pendingInputEcho)){if(n=n.replace(this._pendingInputEcho,""),this._pendingInputEcho=null,n==="")return}else if(this._pendingInputEcho&&this._pendingInputEcho.startsWith(n)){this._pendingInputEcho=this._pendingInputEcho.slice(n.length);return}this.dataCallbacks.forEach(o=>o(n,!1))}_notifyConnectionClosed(){this.connectionClosedCallbacks.forEach(n=>n())}isCommandRunning(){return this.pendingRun!==null||!this.isReady}isFileOperationActive(){return this.fileStreams.size>0}parseDebugState(n){if(!n.includes(DEBUG_START)||!n.includes(DEBUG_END))return null;const o=n.indexOf(DEBUG_START)+DEBUG_START.length,i=n.indexOf(DEBUG_END);try{return JSON.parse(n.substring(o,i))}catch(s){return console.error("[MCP] Failed to parse debug state:",s),null}}async sendDebugCommand(n){const o=`import __main__; setattr(__main__, '_debug_cmd', '${n}')`;return this.exec(o)}}class DeviceBridge{constructor(){this.client=null,this.pendingCallbacks={onData:null,onConnectionClosed:[],subscriptions:{}}}get agentToken(){return this.client?.agentToken}async connect(n,o="password"){if(this.client&&(this.client.state==="CONNECTING"&&await this.client.disconnect(),this.client.state==="DISCONNECTED"))return this.client.connect(n,o);this.client=new McpDevice,this.pendingCallbacks.onData&&this.client.onData(this.pendingCallbacks.onData);for(const i of this.pendingCallbacks.onConnectionClosed)this.client.onConnectionClosed(i);for(const[i,s]of Object.entries(this.pendingCallbacks.subscriptions))this.client.subscribe(i,s);return this.client.connect(n,o)}async disconnect(){if(this.client){const n=await this.client.disconnect();return this.client=null,n}}async exec(n){if(!this.client)throw new Error("Not connected");return this.client.exec(n)}async run(n){if(!this.client)throw new Error("Not connected");return this.client.run(n)}async sendInput(n){if(!this.client)throw new Error("Not connected");return this.client.sendInput(n)}async requestCompletion(n){if(!this.client)throw new Error("Not connected");return this.client.requestCompletion(n)}appsList(){return this.client.appsList()}callTool(n,o,i){return this.client?this.client.callTool(n,o,i):Promise.reject(new Error("Not connected"))}appAction(n,o){return this.client.appAction(n,o)}armTx(n){return this.client.armTx(n)}disarmTx(){return this.client.disarmTx()}openCanStream(n){return this.client.openCanStream(n)}async interrupt(){if(!this.client)throw new Error("Not connected");return this.client.interrupt()}async reset(n=!1){if(!this.client)throw new Error("Not connected");return this.client.reset(n)}async sendDebugCommand(n){if(!this.client)throw new Error("Not connected");return this.client.sendDebugCommand(n)}async saveFile(n,o,i={}){if(!this.client)throw new Error("Not connected");return this.client.saveFile(n,o,i)}async loadFile(n,o={}){if(!this.client)throw new Error("Not connected");return this.client.loadFile(n,o)}onData(n){if(!this.client){this.pendingCallbacks.onData=n;return}this.client.onData(n)}onConnectionClosed(n){if(!this.client){this.pendingCallbacks.onConnectionClosed.push(n);return}this.client.onConnectionClosed(n)}subscribe(n,o){if(!this.client){this.pendingCallbacks.subscriptions[n]=o;return}this.client.subscribe(n,o)}unsubscribe(n){this.client&&this.client.unsubscribe(n)}isCommandRunning(){return this.client?this.client.isCommandRunning():!1}isFileOperationActive(){return this.client?this.client.isFileOperationActive():!1}get state(){return this.client?.state||"DISCONNECTED"}get isReady(){return this.client?.isReady||!1}get authenticated(){return this.client?.authenticated||!1}set onEthStatus(n){this.client&&(this.client.onEthStatus=n)}get onEthStatus(){return this.client?.onEthStatus}set onWwanStatus(n){this.client&&(this.client.onWwanStatus=n)}get onWwanStatus(){return this.client?.onWwanStatus}set onDisplayUi(n){this.client&&(this.client.onDisplayUi=n)}get onDisplayUi(){return this.client?.onDisplayUi}set onPlotData(n){this.client&&(this.client.onPlotData=n)}get onPlotData(){return this.client?.onPlotData}set onMqttConfig(n){this.client&&(this.client.onMqttConfig=n)}get onMqttConfig(){return this.client?.onMqttConfig}set onMqttConfigSave(n){this.client&&(this.client.onMqttConfigSave=n)}get onMqttConfigSave(){return this.client?.onMqttConfigSave}set onWwanConfig(n){this.client&&(this.client.onWwanConfig=n)}get onWwanConfig(){return this.client?.onWwanConfig}set onWwanConfigSave(n){this.client&&(this.client.onWwanConfigSave=n)}get onWwanConfigSave(){return this.client?.onWwanConfigSave}set onModemStatus(n){this.client&&(this.client.onModemStatus=n)}get onModemStatus(){return this.client?.onModemStatus}set onNtpSync(n){this.client&&(this.client.onNtpSync=n)}get onNtpSync(){return this.client?.onNtpSync}set onNtpConfig(n){this.client&&(this.client.onNtpConfig=n)}get onNtpConfig(){return this.client?.onNtpConfig}set onNtpConfigSave(n){this.client&&(this.client.onNtpConfigSave=n)}get onNtpConfigSave(){return this.client?.onNtpConfigSave}set onCanConfig(n){this.client&&(this.client.onCanConfig=n)}get onCanConfig(){return this.client?.onCanConfig}set onCanConfigSave(n){this.client&&(this.client.onCanConfigSave=n)}get onCanConfigSave(){return this.client?.onCanConfigSave}set onVpnConfig(n){this.client&&(this.client.onVpnConfig=n)}get onVpnConfig(){return this.client?.onVpnConfig}set onVpnConfigSave(n){this.client&&(this.client.onVpnConfigSave=n)}get onVpnConfigSave(){return this.client?.onVpnConfigSave}set onVpnConnect(n){this.client&&(this.client.onVpnConnect=n)}get onVpnConnect(){return this.client?.onVpnConnect}set onVpnDisconnect(n){this.client&&(this.client.onVpnDisconnect=n)}get onVpnDisconnect(){return this.client?.onVpnDisconnect}set onVpnInfo(n){this.client&&(this.client.onVpnInfo=n)}get onVpnInfo(){return this.client?.onVpnInfo}set onSdcardConfig(n){this.client&&(this.client.onSdcardConfig=n)}get onSdcardConfig(){return this.client?.onSdcardConfig}set onSdcardConfigSave(n){this.client&&(this.client.onSdcardConfigSave=n)}get onSdcardConfigSave(){return this.client?.onSdcardConfigSave}set onSdcardInfo(n){this.client&&(this.client.onSdcardInfo=n)}get onSdcardInfo(){return this.client?.onSdcardInfo}set onSdcardMount(n){this.client&&(this.client.onSdcardMount=n)}get onSdcardMount(){return this.client?.onSdcardMount}set onSdcardUnmount(n){this.client&&(this.client.onSdcardUnmount=n)}get onSdcardUnmount(){return this.client?.onSdcardUnmount}set onGpioConfig(n){this.client&&(this.client.onGpioConfig=n)}get onGpioConfig(){return this.client?.onGpioConfig}set onGpioConfigSave(n){this.client&&(this.client.onGpioConfigSave=n)}get onGpioConfigSave(){return this.client?.onGpioConfigSave}set onEthConfig(n){this.client&&(this.client.onEthConfig=n)}get onEthConfig(){return this.client?.onEthConfig}set onEthConfigSave(n){this.client&&(this.client.onEthConfigSave=n)}get onEthConfigSave(){return this.client?.onEthConfigSave}set onEthInit(n){this.client&&(this.client.onEthInit=n)}get onEthInit(){return this.client?.onEthInit}}const BridgeDevice=new DeviceBridge,scriptRel="modulepreload",assetsURL=function(e){return"/app/"+e},seen={},__vitePreload=function e(n,o,i){let s=Promise.resolve();if(o&&o.length>0){document.getElementsByTagName("link");const l=document.querySelector("meta[property=csp-nonce]"),a=l?.nonce||l?.getAttribute("nonce");s=Promise.allSettled(o.map(c=>{if(c=assetsURL(c),c in seen)return;seen[c]=!0;const d=c.endsWith(".css"),u=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${u}`))return;const f=document.createElement("link");if(f.rel=d?"stylesheet":scriptRel,d||(f.as="script"),f.crossOrigin="",f.href=c,a&&f.setAttribute("nonce",a),document.head.appendChild(f),d)return new Promise((p,h)=>{f.addEventListener("load",p),f.addEventListener("error",()=>h(new Error(`Unable to preload CSS for ${c}`)))})}))}function r(l){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=l,window.dispatchEvent(a),!a.defaultPrevented)throw l}return s.then(l=>{for(const a of l||[])a.status==="rejected"&&r(a.reason);return n().catch(r)})};let Parser=null,Language=null,wasmUrl=null,pythonWasmImportUrl=null;const DEBUG_STATE_MODULE=`
# Debug State Module (injected at runtime)
from time import ticks_ms, sleep
import gc, json, mcplink, __main__

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
        self.t = ticks_ms()
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
        duration = ticks_ms() - self.t
        self.d = {"t": duration, "m": gc.mem_free(), "f": fileName, "l": lineNum, "w": {}, "h": False, "d": self.depth, "v": {}}
    
    def st(self):
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
            start = ticks_ms()

            # Studio's step command arrives as another exec on mcplink's queue
            while ticks_ms() - start < timeout:
                mcplink.process_queue()

                cmd = __main__._debug_cmd
                if cmd:
                    __main__._debug_cmd = None
                    if cmd in ("S", "SO", "ST", "CO", "CW"):
                        self.s = cmd
                        self.target_depth = self.depth
                    else:
                        self.s = "CO"
                    break
                
                sleep(0.01)
            
            # Send final state before continuing
            print("\\x1b[?1049hD" + json.dumps(self.d) + "D\\x1b[?1049l", end="")
        
        self.t = ticks_ms()

    def exec(self, code):
        g = {"__name__": "__main__", "_ds": self}
        exec(code, g)

# Initialize and reset state
_ds = DebugStates()
__main__._debug_cmd = None

# Drain the queue
while mcplink.process_queue() > 0: pass
`;let parserInstance=null,pythonLanguage=null;async function getParser(){if(parserInstance&&pythonLanguage)return parserInstance;try{if(!Parser){console.log("[Debugger] Lazy loading Tree-sitter...");const[e,n,o]=await Promise.all([__vitePreload(()=>import("./tree-sitter-Cql3IGzA.js"),__vite__mapDeps([0,1,2,3,4])),__vitePreload(()=>import("./tree-sitter-B3V3Ji9r.js"),[]),__vitePreload(()=>import("./tree-sitter-python-DxlSE_Ss.js"),[])]);Parser=e.Parser,Language=e.Language,wasmUrl=n.default,pythonWasmImportUrl=o.default,console.log("[Debugger] Tree-sitter modules loaded")}if(await Parser.init({locateFile:()=>wasmUrl}),parserInstance=new Parser,console.log("[Debugger] Loading Python grammar..."),!pythonWasmImportUrl)throw new Error("tree-sitter-python.wasm URL not found in imports");return pythonLanguage=await Language.load(pythonWasmImportUrl),parserInstance.setLanguage(pythonLanguage),console.log("[Debugger] Tree-sitter parser initialized successfully"),parserInstance}catch(e){throw console.error("[Debugger] Failed to initialize parser:",e),new Error(`Tree-sitter initialization failed: ${e.message}`)}}async function identifyCodeRows(e){const n=await getParser();if(!n)return new Map;const o=n.parse(e),i=new Map,s=["expression_statement","assignment","return_statement","if_statement","for_statement","while_statement","try_statement","with_statement","function_definition","async_function_definition","class_definition","break_statement","continue_statement","pass_statement","match_statement"],r=["else_clause","elif_clause","except_clause","finally_clause","case_clause"],l=a=>{if(!a)return;let c=!1;const d=a.type;r.includes(d)?c=!1:s.includes(d)?(c=!0,(d==="function_definition"||d==="async_function_definition"||d==="class_definition")&&a.parent&&a.parent.type==="decorated_definition"&&(c=!1),d==="expression_statement"&&a.childCount===1&&a.firstChild.type==="string"&&(c=!1)):d==="decorated_definition"&&(c=!0),c&&i.set(a.startPosition.row,d);for(let u=0;u<a.childCount;u++)l(a.child(u))};return l(o.rootNode),i}function generateDebugBlock(e,n,o,i,s,r,l=null){let a="";if(l){const c=l.condition?`(${l.condition})`:"True",d=l.hitCount?`"${l.hitCount}"`:"None",u=l.enabled!==!1?"True":"False";a+=`${e}try:
`,a+=`${e}    _ds.us("${o}", ${i}, ${u} and ${c}, ${d})
`,a+=`${e}except:
`,a+=`${e}    pass
`}else n?a+=`${e}_ds.us("${o}", ${i}, True, None)
`:(r.forEach(c=>{a+=`${e}try:
`,a+=`${e}    if (${c}): _ds.s = "S"
`,a+=`${e}except:
`,a+=`${e}    pass
`}),a+=`${e}if _ds.s == "S":
`,e+="    ");return a+=`${e}_ds.sh("${o}", ${i})
`,a+=`${e}if _ds.s != "CO": _ds.sv(locals())
`,s.forEach(c=>{const d=c.replace(/"/g,'\\"');a+=`${e}try:
`,a+=`${e}    _ds.d["w"]["${d}"] = str(${c})
`,a+=`${e}except Exception as _debug_e:
`,a+=`${e}    _ds.d["w"]["${d}"] = str(_debug_e)
`}),a+=`${e}_ds.st()
`,a}async function instrumentCodeForExec(e,n={}){const{watches:o={},conditionalBP:i={},fileName:s="main.py"}=n,r=performance.now(),l=await identifyCodeRows(e);console.log(`[Debugger] Identified ${l.size} code rows in ${performance.now()-r}ms`);let a=e.split(/\r?\n/);const c=new Map,d=o[""]||[],u=o[s]||[],f=[...new Set([...d,...u])],p=i[""]||[],h=i[s]||[],m=[...new Set([...p,...h])],w=Array.from(l.keys()).sort((_,x)=>_-x);for(const _ of w){const x=a[_],b=l.get(_);if(x===void 0)continue;const k=/# ●/.test(x),F=n.breakpoints&&n.breakpoints[s]?n.breakpoints[s][_+1]:null;(k||F)&&console.log(`[Debugger] Breakpoint detected at line ${_+1}: ${x}`);const A=x.match(/^(\s*)/)[1];let R=generateDebugBlock(A,k,s,_+1,f,m,F);b==="function_definition"?R+=`${A}@_ds.wrap
`:b==="async_function_definition"&&(R+=`${A}@_ds.awrap
`),k&&console.log(`[Debugger] Generated instrumentation for row ${_+1} (${b})`),c.set(_,R)}let y=[];for(let _=0;_<a.length;_++)c.has(_)&&y.push(c.get(_)),y.push(a[_]);const S=y.join(`
`),$=`${DEBUG_STATE_MODULE}

# Execute isolated code
_ds.exec("""${S.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/'/g,"\\'")}""")
`,C=performance.now()-r;return console.log(`[Debugger] Instrumentation complete in ${C.toFixed(0)}ms`),$}console.log("[Libs] ES modules loaded");function renderIcon(e,n={}){const{className:o="",size:i=24,color:s="currentColor"}=n;return html$1`
    <svg class="icon icon-tabler ${o}" 
         width="${i}" 
         height="${i}" 
         viewBox="0 0 24 24" 
         fill="none" 
         stroke="${s}" 
         stroke-width="2" 
         stroke-linecap="round" 
         stroke-linejoin="round">
      <use href="#tabler-${e}" />
    </svg>
  `}const IconSprite={renderIcon};await __vitePreload(()=>import("./vendor-BzspHke8.js"),__vite__mapDeps([2,3,4]));console.log("[Views] Vendor loaded, Component available:",!!window.Component);function Button$1(e){const{first:n=!1,size:o="",square:i=!1,icon:s="link",onClick:r=_=>{},disabled:l=!1,active:a=!1,tooltip:c,label:d,background:u}=e;let f=html``;c&&(f=html`<div class="tooltip">${c}</div>`),f=html``;let p=a?"active":"",h=a?"selected":"",m=u?"inverted":"",w=n?"first":"",y=i?"square":"",S=l?"inactive":"active",$=o==="small"?"":html`<div class="label ${S} ${h}">${d}</div>`;const C=IconSprite.renderIcon(s,{className:""});return html`
     <div class="button ${w}">
       <button disabled=${l} class="${y}${o} ${p} ${m}" onclick=${r}>
         ${C}
       </button>
       ${$}
       ${f}
     </div>
   `}let cm6Loaded=!1,EditorView,EditorState,Compartment,python,json,keymap,highlightActiveLine,lineNumbers,gutter,GutterMarker,search,searchKeymap,highlightSelectionMatches,foldGutter,foldKeymap,indentOnInput,syntaxHighlighting,defaultHighlightStyle,bracketMatching,closeBrackets,closeBracketsKeymap,indentWithTab,defaultKeymap,history,historyKeymap,baseTheme=null,themes=null,BreakpointMarkerClass=null;async function loadCM6(){if(!cm6Loaded)try{const[e,n,o,i,s,r,l,a,c,d]=await Promise.all([__vitePreload(()=>import("./vendor-BlGDltiY.js").then(y=>y.ah),[]),__vitePreload(()=>import("./vendor-BlGDltiY.js").then(y=>y.ag),[]),__vitePreload(()=>import("./index-CcAq0A7F.js"),__vite__mapDeps([5,6,3,7])),__vitePreload(()=>import("./index-CV6dBaez.js"),__vite__mapDeps([8,6,3])),__vitePreload(()=>import("./index-JImUBHhm.js"),__vite__mapDeps([9,3])),__vitePreload(()=>import("./vendor-BlGDltiY.js").then(y=>y.ai),[]),__vitePreload(()=>import("./index-KRlJo8re.js"),__vite__mapDeps([7,3])),__vitePreload(()=>import("./index-D3NKRj9Q.js"),__vite__mapDeps([10,3])),__vitePreload(()=>import("./vendor-BlGDltiY.js").then(y=>y.aj),[]),__vitePreload(()=>import("./index-Dh2CuqQh.js"),__vite__mapDeps([11,3]))]);EditorView=e.EditorView,keymap=e.keymap,highlightActiveLine=e.highlightActiveLine,lineNumbers=e.lineNumbers,gutter=e.gutter,GutterMarker=e.GutterMarker,EditorState=n.EditorState,Compartment=n.Compartment,python=o.python,json=i.json,search=s.search,searchKeymap=s.searchKeymap,highlightSelectionMatches=s.highlightSelectionMatches,foldGutter=r.foldGutter,foldKeymap=r.foldKeymap,indentOnInput=r.indentOnInput,syntaxHighlighting=r.syntaxHighlighting,defaultHighlightStyle=r.defaultHighlightStyle,bracketMatching=r.bracketMatching,closeBrackets=l.closeBrackets,closeBracketsKeymap=l.closeBracketsKeymap,indentWithTab=a.indentWithTab,defaultKeymap=a.defaultKeymap,history=a.history,historyKeymap=a.historyKeymap,BreakpointMarkerClass=class extends GutterMarker{constructor(y=!0){super(),this.enabled=y}toDOM(){const y=document.createElement("span");return y.className="cm-breakpoint"+(this.enabled?"":" cm-breakpoint-disabled"),y.textContent="●",y}},baseTheme=EditorView.theme({"&":{height:"100%",fontSize:"14px"},".cm-scroller":{fontFamily:"var(--font-mono)",overflow:"auto"},".cm-content":{caretColor:"currentColor"},".cm-cursor":{borderLeftColor:"currentColor"},".cm-gutters":{backgroundColor:"transparent !important",borderRight:"none"},".cm-gutter.cm-lineNumbers":{backgroundColor:"transparent !important"},"&.cm-focused .cm-selectionBackground, ::selection":{backgroundColor:"rgba(100, 100, 100, 0.3)"},".cm-foldGutter .cm-gutterElement":{cursor:"pointer",padding:"0 3px"},".cm-breakpoint-gutter":{width:"20px !important",minWidth:"20px !important"},".cm-breakpoint-gutter .cm-gutterElement":{display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",padding:"0"},".cm-breakpoint":{color:"#e63946",fontSize:"14px",lineHeight:"1",paddingRight:"9px"},".cm-breakpoint-disabled":{opacity:"0.3"},".cm-panels":{fontSize:"14px"},".cm-panels input, .cm-panels button":{fontSize:"14px"}});const{cobalt:u,solarizedLight:f,coolGlow:p,clouds:h}=c,{xcodeDark:m,xcodeLight:w}=d;themes={cobalt:u,"solarized-light":f,"xcode-dark":m,"xcode-light":w,coolglow:p,clouds:h},cm6Loaded=!0,console.debug("[Editor] Lazy loaded CM6 modules")}catch(e){throw console.error("[Editor] Failed to load CM6:",e),e}}class CodeMirrorEditor extends Component{constructor(){super(),this.view=null,this.content="# empty file",this.fileName=null,this.scrollTop=0,this.currentTheme=null,this.themeCompartment=null,this.readOnlyCompartment=null,this.languageCompartment=null}createElement(n){return n&&(this.content=n),html`<div id="code-editor"></div>`}load(n){loadCM6().then(()=>this.createEditor(n)).catch(o=>{console.error("[Editor] Failed to initialize:",o),n.innerHTML='<div style="color:red;padding:10px;">Editor failed to load. Check console for errors.</div>'})}createEditor(n){this.themeCompartment=new Compartment,this.readOnlyCompartment=new Compartment,this.languageCompartment=new Compartment;const o=this.getEditorTheme();if(this.currentTheme=o,this.fileName&&typeof this.fileName=="string"&&this.fileName.toLowerCase().endsWith(".json")){const c=this._tryFormatJson(this.content);c!==null&&(this.content=c)}const i=window.appState?.debugger?.active||window.appState?.debugger?.configOpen||!1,s=this.getLanguageMode(),r=this,l=gutter({class:"cm-breakpoint-gutter",lineMarker:(c,d)=>{const u=c.state.doc.lineAt(d.from).number,f=c.state.doc.line(u).text;if(/# ●/.test(f)){const h=(window.appState?.debugger?.breakpoints?.[r.fileName]||{})[u],m=h?h.enabled!==!1:!0;return new BreakpointMarkerClass(m)}return null},domEventHandlers:{click:(c,d)=>{const u=c.state.doc.lineAt(d.from).number,f=c.state.doc.line(u).text;return/# ●/.test(f)?window.appInstance.emitter.emit("debugger:edit-breakpoint",{file:r.fileName,line:u}):r.toggleBreakpoint(u-1),!0}}}),a=EditorState.create({doc:this.content||"",extensions:[lineNumbers(),history(),foldGutter({openText:"▼",closedText:"▶"}),indentOnInput(),bracketMatching(),closeBrackets(),highlightActiveLine(),highlightSelectionMatches(),syntaxHighlighting(defaultHighlightStyle,{fallback:!0}),search({top:!0}),keymap.of([...defaultKeymap,...historyKeymap,...closeBracketsKeymap,...foldKeymap,...searchKeymap,indentWithTab]),this.languageCompartment.of(s),baseTheme,this.themeCompartment.of(themes[o]||themes.cobalt),this.readOnlyCompartment.of(EditorState.readOnly.of(i)),l,EditorView.updateListener.of(c=>{c.docChanged&&(this.content=c.state.doc.toString(),this.onChange()),c.geometryChanged&&(this.scrollTop=this.view?.scrollDOM.scrollTop||0)})]});this.view=new EditorView({state:a,parent:n}),setTimeout(()=>{this.view&&this.scrollTop>0&&(this.view.scrollDOM.scrollTop=this.scrollTop)},10),this.themeObserver=new MutationObserver(()=>{this.updateTheme()}),this.themeObserver.observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme"]}),this.editorThemeHandler=()=>this.updateTheme(),window.addEventListener("editor-theme-changed",this.editorThemeHandler),this.breakpointsUpdatedHandler=c=>{c.file===this.fileName&&this.syncBreakpointsFromStore()},window.appInstance.emitter.on("debugger:breakpoints-updated",this.breakpointsUpdatedHandler)}getLanguageMode(){return this.fileName&&typeof this.fileName=="string"&&this.fileName.toLowerCase().endsWith(".json")?json():python()}getEditorTheme(){const n=document.documentElement.getAttribute("data-theme")==="dark";switch(localStorage.getItem("editorTheme")||"auto"){case"cobalt":return n?"cobalt":"solarized-light";case"xcode":return n?"xcode-dark":"xcode-light";case"coolglow":return n?"coolglow":"clouds";case"auto":default:return n?"cobalt":"solarized-light"}}updateTheme(){if(!this.view||!themes)return;const n=this.getEditorTheme();n!==this.currentTheme&&(this.currentTheme=n,this.view.dispatch({effects:this.themeCompartment.reconfigure(themes[n]||themes.cobalt)}))}update(n){if(this.view&&window.appState?.debugger){const o=window.appState.debugger.active||window.appState.debugger.configOpen;this.view.state.facet(EditorState.readOnly)!==o&&(this.view.dispatch({effects:this.readOnlyCompartment.reconfigure(EditorState.readOnly.of(o))}),this.view.dom.style.opacity=o?"0.7":"1.0")}return!1}unload(){this.themeObserver&&(this.themeObserver.disconnect(),this.themeObserver=null),this.editorThemeHandler&&(window.removeEventListener("editor-theme-changed",this.editorThemeHandler),this.editorThemeHandler=null),this.breakpointsUpdatedHandler&&(window.appInstance.emitter.removeListener("debugger:breakpoints-updated",this.breakpointsUpdatedHandler),this.breakpointsUpdatedHandler=null),this.view&&(this.scrollTop=this.view.scrollDOM.scrollTop,this.view.destroy(),this.view=null)}setContent(n){this.content=n,this.scrollTop=0,this.view&&this.view.dispatch({changes:{from:0,to:this.view.state.doc.length,insert:n}})}updateScrollPosition(n){this.scrollTop=n.target.scrollTop}onChange(){return!1}_tryFormatJson(n){if(typeof n!="string")return null;const o=n.trim();if(!o)return null;const i=o[0];if(i!=="{"&&i!=="[")return null;try{const s=JSON.parse(o);return JSON.stringify(s,null,2)+`
`}catch{return null}}toggleBreakpoint(n){if(!this.view)return;const o=this.view.state.doc.line(n+1),i=o.text,s=/# ●/.test(i);let r;s?r=i.replace(/\s*# ●.*/,""):r=i.trimEnd()+" # ●",this.view.dispatch({changes:{from:o.from,to:o.to,insert:r}})}syncBreakpointsFromStore(){if(!this.view||!this.fileName)return;const n=window.appState?.debugger?.breakpoints?.[this.fileName]||{},o=this.view.state.doc,i=[];for(let s=1;s<=o.lines;s++){const r=o.line(s),l=r.text,a=n[s],c=/# ●/.test(l);if(a&&!c)i.push({from:r.to,to:r.to,insert:" # ●"});else if(!a&&c){const d=l.match(/\s*# ●.*/);if(d){const u=r.from+l.indexOf(d[0]);i.push({from:u,to:r.to,insert:""})}}}i.length>0&&this.view.dispatch({changes:i})}}const editor=Object.freeze(Object.defineProperty({__proto__:null,CodeMirrorEditor},Symbol.toStringTag,{value:"Module"}));function Tab(e){const{text:n="undefined",icon:o="device-desktop",onSelectTab:i=()=>!1,onCloseTab:s=()=>!1,onStartRenaming:r=()=>!1,onFinishRenaming:l=()=>!1,active:a=!1,renaming:c=!1,hasChanges:d=!1}=e;if(a)if(c){let p=function(m){l(m.target.value)},h=function(m){m.key.toLowerCase()==="enter"&&m.target.blur(),m.key.toLowerCase()==="escape"&&(m.target.value=null,m.target.blur())};return html`
        <div class="tab active" tabindex="0">
          ${IconSprite.renderIcon(o,{className:"icon"})}
          <div class="text">
            <input type="text"
              value=${n}
              onblur=${p}
              onkeydown=${h}
              />
          </div>
        </div>
      `}else{let p=function(h){h.stopPropagation(),s(h)};return html`
        <div class="tab active" tabindex="0">
          ${IconSprite.renderIcon(o,{className:"icon"})}
          <div class="text" onclick=${r}>
            ${d?" *":""} ${n}
          </div>
          <div class="options" >
            <button onclick=${p}>
              ${IconSprite.renderIcon("x",{className:"icon"})}
            </button>
          </div>
        </div>
      `}function u(p){p.target.classList.contains("close-tab")||i(p)}function f(p){p.stopPropagation(),s(p)}return html`
    <div
      class="tab"
      tabindex="1"
      onclick=${u}
      >
      ${IconSprite.renderIcon(o,{className:"icon"})}
      <div class="text">
        ${d?"*":""} ${n}
      </div>
      <div class="options close-tab">
        <button class="close-tab" onclick=${f}>
          ${IconSprite.renderIcon("x",{className:"close-tab icon"})}
        </button>
      </div>
    </div>
  `}const TERMINAL_PROMPT="\x1B[38;2;221;221;221m>>> \x1B[0m";function bindTerminalOutput(e){const n=e.cache(XTerm,"terminal");if(!n||!n.term){console.debug("[TerminalHelpers] Terminal not ready yet, will bind on view switch");return}const o=n.term;BridgeDevice.onData((s,r=!1)=>{if(s){e.onTerminalOutput?.();const l=s.replace(/\n/g,`\r
`);r?o.write("\x1B[91m"+l+"\x1B[0m\x1B[38;2;51;255;51m"):o.write(l),o.scrollToBottom()}})}function redrawLine(e,n,o,i){const s=i.isCommandRunning&&i.isCommandRunning(),r=s?"":TERMINAL_PROMPT,l=s?0:4;e.write("\r\x1B[K"+r+n);const a=l+o,c=l+n.length;a<c&&e.write("\x1B["+(c-a)+"D")}function setupTerminalInputHandler(e,n,o){e.onData(async i=>{if(i==="\x1B[A"){n.commandHistory.length>0&&(n.historyIndex===-1?(n.savedLine=n.currentLine,n.historyIndex=n.commandHistory.length-1):n.historyIndex>0&&n.historyIndex--,n.currentLine=n.commandHistory[n.historyIndex],n.cursorPos=n.currentLine.length,redrawLine(e,n.currentLine,n.cursorPos,o)),e.scrollToBottom();return}if(i==="\x1B[B"){n.historyIndex!==-1&&(n.historyIndex++,n.historyIndex>=n.commandHistory.length?(n.currentLine=n.savedLine||"",n.historyIndex=-1):n.currentLine=n.commandHistory[n.historyIndex],n.cursorPos=n.currentLine.length,redrawLine(e,n.currentLine,n.cursorPos,o)),e.scrollToBottom();return}if(i==="\x1B[D"){n.cursorPos>0&&(n.cursorPos--,e.write("\x1B[D"));return}if(i==="\x1B[C"){n.cursorPos<n.currentLine.length&&(n.cursorPos++,e.write("\x1B[C"));return}if(i==="\r"||i===`
`){if(e.write(`\r
`),n.currentLine.trim().length>0){(n.commandHistory.length===0||n.commandHistory[n.commandHistory.length-1]!==n.currentLine)&&(n.commandHistory.push(n.currentLine),n.commandHistory.length>100&&n.commandHistory.shift()),n.historyIndex=-1,n.savedLine="";try{if(o.isCommandRunning&&o.isCommandRunning()){console.log("[Terminal] Sending input to running command:",n.currentLine),await o.sendInput(n.currentLine),n.currentLine="",n.cursorPos=0;return}else{const s=n.currentLine;n.currentLine="",n.cursorPos=0;const r=performance.now();console.log("[Terminal] Calling device.run at",r.toFixed(0)),await o.run(s),console.log("[Terminal] device.run returned after",(performance.now()-r).toFixed(0),"ms")}}catch(s){e.write("Error: "+s.message+`\r
`)}}e.write(TERMINAL_PROMPT)}else if(i==="	"){if(n.isConnected&&o&&typeof o.requestCompletion=="function")try{const s=await o.requestCompletion(n.currentLine);if(!s||s.length===0){e.write("\x07");return}const r=d=>d&&d.length>=2&&/^[A-Z][A-Z0-9_]*$/.test(d),l=s.filter(d=>!r(d));if(l.length===0){e.write("\x07");return}let a="",c=[];if(l.length===1)a=l[0];else{const d=n.currentLine;let u=l[0];for(let f=1;f<l.length;f++){let p=0;for(;p<u.length&&p<l[f].length&&u[p]===l[f][p];)p++;u=u.slice(0,p)}u.length>d.length&&(a=u.slice(d.length)),c=l}if(a&&(n.currentLine=n.currentLine.slice(0,n.cursorPos)+a+n.currentLine.slice(n.cursorPos),n.cursorPos+=a.length,redrawLine(e,n.currentLine,n.cursorPos,o)),c.length>0){e.write(`\r
`);const d=80;let u="";for(const f of c){const p=u.length+f.length+(u?4:0);u&&p>d?(e.write(u+`\r
`),u=f):u=u?u+"    "+f:f}u&&e.write(u+`\r
`),e.write(TERMINAL_PROMPT),redrawLine(e,n.currentLine,n.cursorPos,o)}}catch(s){console.error("[Terminal] Completion error:",s),e.write("\x07")}else e.write("\x07");e.scrollToBottom()}else if(i==="")e.write(`^C\r
`),n.currentLine="",n.cursorPos=0,n.historyIndex=-1,e.write(TERMINAL_PROMPT);else if(i===""||i==="\b")n.cursorPos>0&&(o.isCommandRunning&&o.isCommandRunning()?(n.currentLine=n.currentLine.slice(0,-1),n.cursorPos--,e.write("\b \b")):(n.currentLine=n.currentLine.slice(0,n.cursorPos-1)+n.currentLine.slice(n.cursorPos),n.cursorPos--,redrawLine(e,n.currentLine,n.cursorPos,o)));else if(i.length>=1){const s=i.split("").filter(r=>{const l=r.charCodeAt(0);return l>=32&&l<127}).join("");s.length>0&&(o.isCommandRunning&&o.isCommandRunning()?(n.currentLine+=s,n.cursorPos+=s.length,e.write(s)):(n.currentLine=n.currentLine.slice(0,n.cursorPos)+s+n.currentLine.slice(n.cursorPos),n.cursorPos+=s.length,redrawLine(e,n.currentLine,n.cursorPos,o)))}e.scrollToBottom()})}let TerminalClass=null,FitAddonClass=null,xtermLoaded=!1;async function loadXterm(){if(xtermLoaded)return{Terminal:TerminalClass,FitAddon:FitAddonClass};try{const[e,n]=await Promise.all([__vitePreload(()=>import("./xterm-CASmyfyk.js"),[]),__vitePreload(()=>import("./addon-fit-DOCEibfw.js"),[]),__vitePreload(()=>Promise.resolve({}),__vite__mapDeps([12]))]);return TerminalClass=e.Terminal,FitAddonClass=n.FitAddon,xtermLoaded=!0,console.debug("[XTerm] Lazy loaded xterm modules"),{Terminal:TerminalClass,FitAddon:FitAddonClass}}catch(e){throw console.error("[XTerm] Failed to load xterm:",e),e}}loadXterm();class XTerm extends Component$1{constructor(n,o,i){super(n),this.term=null,this.fitAddon=null,this.resizeObserver=null,this.inputBound=!1,this._emit=i}load(n){if(this.term){console.debug("[XTerm] Reusing existing terminal instance (no re-open needed)");const o=this.term.element?.parentElement;o&&n.appendChild(o),this.resizeObserver&&this.resizeObserver.disconnect(),this.resizeObserver=new ResizeObserver(()=>{setTimeout(()=>this.fitTerminal(),50)}),this.resizeObserver.observe(n),setTimeout(()=>this.fitTerminal(),50),setTimeout(()=>this.fitTerminal(),150);return}loadXterm().then(()=>this.ensureFontsLoaded()).then(()=>this.createAndOpenTerminal(n)).catch(o=>{console.error("[XTerm] Failed to initialize terminal:",o),n.innerHTML='<div style="color:red;padding:10px;">Terminal failed to load. Check console for errors.</div>'})}async ensureFontsLoaded(){if(document.fonts&&document.fonts.ready)try{return await document.fonts.ready,document.fonts.check&&await new Promise(n=>setTimeout(n,50)),Promise.resolve()}catch{return new Promise(o=>setTimeout(o,200))}else return new Promise(n=>setTimeout(n,200))}createAndOpenTerminal(n){this.term=new TerminalClass({fontFamily:"monospace",fontSize:12,letterSpacing:0,cursorBlink:!0,cursorStyle:"block",scrollback:1e3,theme:{foreground:"#33ff33",background:"#000000",cursor:"#FFFFFF",cursorAccent:"#000000"}}),this.term.open(n),this.fitAddon=new FitAddonClass,this.term.loadAddon(this.fitAddon),setTimeout(()=>this.fitTerminal(),50),setTimeout(()=>this.fitTerminal(),150),setTimeout(()=>this.fitTerminal(),300),setTimeout(()=>this.fitTerminal(),600);let o=null;const i=()=>{o&&clearTimeout(o),o=setTimeout(()=>this.fitTerminal(),100)};this.resizeObserver=new ResizeObserver(i),this.resizeObserver.observe(n);const s=n.closest(".repl-panel-main");s&&this.resizeObserver.observe(s)}createElement(){return html$1`<div class="terminal-wrapper"></div>`}update(){return this.fitAddon&&setTimeout(()=>this.fitTerminal(),50),!1}unload(){this.resizeObserver&&(this.resizeObserver.disconnect(),this.resizeObserver=null)}fitTerminal(){if(!(!this.term||!this.fitAddon))try{this.fitAddon.fit(),this.term.refresh&&this.term.refresh(0,this.term.rows-1)}catch(n){console.warn("[XTerm] Fit failed:",n)}}resizeTerm(){this.fitTerminal()}bindInput(n,o){return this.inputBound||!this.term?!1:(console.debug("[XTerm] Binding input handler"),this.inputBound=!0,this.term.textarea&&this.term.textarea.addEventListener("focus",()=>{this._emit&&this._emit("terminal-focus")}),setupTerminalInputHandler(this.term,n,o),!0)}isInputBound(){return this.inputBound}}function CodeEditor(e,n){if(e.editingFile){const o=e.openFiles.find(i=>i.id==e.editingFile);return o?o.editor.render():(console.error("[CodeEditor] File not found for id:",e.editingFile),html$1`<div id="code-editor">File not found</div>`)}else return html$1`
      <div id="code-editor"></div>
    `}function ConnectionDialog(e,n){const o=e.isConnectionDialogOpen?"open":"closed",i=localStorage.getItem("webrepl-url")||"",s=localStorage.getItem("webrepl-password")||"";let r=!1;function l(f){r=f.target.closest(".dialog-content")!==null}function a(f){f.target.id=="dialog-connection"&&!r&&n("close-connection-dialog"),r=!1}function c(f){if(f.preventDefault(),f.stopPropagation(),e.isConnecting)return;e.connectionError=null;const p=document.getElementById("webrepl-url").value,h=document.getElementById("webrepl-password").value;n("connect-webrepl",{wsUrl:p,password:h})}function d(f){f.stopPropagation(),f.key==="Enter"&&!e.isConnecting&&c(f)}e.isConnectionDialogOpen&&!window._connectionDialogEnterHandler?(window._connectionDialogEmit=n,window._connectionDialogEnterHandler=f=>{const p=document.getElementById("dialog-connection");if(!p||!p.classList.contains("open"))return;const h=p.querySelector(".connect-button");if(!(h&&h.disabled)&&f.key==="Enter"){const m=f.target;if(m.tagName!=="INPUT"&&m.tagName!=="TEXTAREA"){f.preventDefault(),f.stopPropagation();const w=document.getElementById("webrepl-url")?.value,y=document.getElementById("webrepl-password")?.value;w&&y&&window._connectionDialogEmit&&window._connectionDialogEmit("connect-webrepl",{wsUrl:w,password:y})}}},document.addEventListener("keydown",window._connectionDialogEnterHandler)):!e.isConnectionDialogOpen&&window._connectionDialogEnterHandler&&(document.removeEventListener("keydown",window._connectionDialogEnterHandler),window._connectionDialogEnterHandler=null,window._connectionDialogEmit=null);const u=html`
  <div id="dialog-connection" class="dialog ${o}" tabindex="-1" onmousedown=${l} onclick=${a} onkeydown=${f=>{f.key==="Enter"&&!e.isConnecting&&(f.preventDefault(),f.stopPropagation(),c(f))}} oncreate=${()=>{const f=document.getElementById("webrepl-url"),p=document.getElementById("webrepl-password");f&&i&&(f.value=i),p&&s&&(p.value=s)}}>
    
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
            placeholder="wss://scripto-XXXX.local/mcp"
            value=${i}
            onclick=${f=>f.stopPropagation()}
            onkeydown=${d}
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
            onclick=${f=>f.stopPropagation()}
            onkeydown=${d}
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
  `;if(e.isConnectionDialogOpen)return u}function getListDirScript(e="/"){return`
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
`.trim()}async function getSystemInfo(e){const n=await e.exec("getSysInfo()");return typeof n=="string"?JSON.parse(n):n}async function getNetworksInfo(e){const n=await e.exec("getNetworksInfo()");return typeof n=="string"?JSON.parse(n):n}async function ilistFiles(e,n="/"){const i=(await e.exec(getListDirScript(n))).entries||{};return Object.entries(i).map(([s,r])=>({fileName:s,size:r,type:r===null?"folder":"file"}))}async function statFile(e,n){const o=`import os, json; print(json.dumps(os.stat('${n}')))`,i=await e.exec(o);return typeof i=="string"?JSON.parse(i):i}async function deleteFile(e,n){const o=`import os; os.remove('${n}')`;await e.exec(o)}async function renameFile(e,n,o){const i=`import os; os.rename('${n}', '${o}')`;await e.exec(i)}async function createFolder(e,n){const o=`import os; os.mkdir('${n}')`;await e.exec(o)}async function fileExists(e,n){try{return await statFile(e,n),!0}catch{return!1}}async function deleteFolder(e,n){await e.exec(getDeleteFolderScript(n))}function getFullPath$1(e,n,o){let i=e||"";return n&&n!=="/"&&(i+=n),o&&(i+="/"+o),i.replace(/\/+/g,"/")}function getNavigationPath(e,n){if(n===".."){const o=e.split("/").filter(i=>i);return o.pop(),"/"+o.join("/")}return e==="/"?"/"+n:e+"/"+n}const getDisk=()=>BridgeDisk,getDevice=()=>BridgeDevice,getFullPath=getFullPath$1;async function getDiskFiles(e){let o=await getDisk().ilistFiles(e);return o=o.map(i=>({fileName:i.path,type:i.type,size:i.size})),o=o.sort(sortFilesAlphabetically),o}async function getBoardFiles(e){let n=await ilistFiles(BridgeDevice,e);return n=n.sort(sortFilesAlphabetically),n}function sortFilesAlphabetically(e,n){return e.fileName.localeCompare(n.fileName)}async function checkDiskFile({root:e,parentFolder:n,fileName:o}){if(e==null||n==null||o==null)return!1;const i=getDisk(),s=i.getFullPath(e,n,o),r=await i.fileExists(s),l=await i.folderExists(s);return r||l}async function checkBoardFile({root:e,parentFolder:n,fileName:o}){return e==null||n==null||o==null?!1:fileExists(BridgeDevice,getFullPath(e,n,o))}async function checkOverwrite({fileNames:e=[],parentPath:n,source:o}){let i=[];return o==="board"?i=await getBoardFiles(n):i=await getDiskFiles(n),i.filter(s=>e.indexOf(s.fileName)!==-1)}function generateFileName(e){{const n=`New${window.appState.fileCounter}.py`;return window.appState.fileCounter++,n}}function generateHash(){return`${Date.now()}_${parseInt(Math.random()*1024)}`}async function uploadFolder(e,n,o){o=o||function(){};const i=getDevice(),s=getDisk();await i.createFolder(n);let r=await s.ilistAllFiles(e);for(let l in r){const a=r[l],c=a.path.substring(e.length);if(a.type==="folder")await i.createFolder(getFullPath(n,c,""));else{const d=s.getFullPath(e,c,""),u=getFullPath(n,c,""),f=await BridgeDisk.loadFile(d),p=new Uint8Array(f);await i.saveFile(u,p,{progressCallback:h=>{o(h,c)}})}o(100,c)}}async function downloadFolder(e,n,o){o=o||function(){},await getDisk().createFolder(n);try{const s=[];async function r(l){const a=await ilistFiles(BridgeDevice,l);for(const c of a){const d=l==="/"?`/${c.fileName}`:`${l}/${c.fileName}`;c.type==="folder"?(s.push({path:d,type:"folder"}),await r(d)):s.push({path:d,type:"file"})}}await r(e);for(let l in s){const a=s[l],c=a.path.substring(e.length),d=getDisk(),u=getDevice();if(a.type=="folder")await d.createFolder(d.getFullPath(n,c,""));else{const f=getFullPath(e,c,""),p=getFullPath(n,c,""),h=await u.loadFile(f,{progressCallback:m=>{o(m,c)}});await BridgeDisk.saveFileContent(p,h.buffer)}o(100,c)}}catch(s){throw console.error(`[Store] Error downloading folder ${e}:`,s),new Error(`Failed to download folder: ${s.message}`)}}async function removeBoardFolder(e){try{await deleteFolder(BridgeDevice,e)}catch(n){throw console.error(`[Store] Error removing folder ${e}:`,n),new Error(`Failed to remove folder: ${n.message}`)}}function canSave({isConnected:e,openFiles:n,editingFile:o}){const i=n.find(s=>s.id===o);return!i||!i.hasChanges?!1:i.source==="disk"?!0:e}function canExecute({isConnected:e}){return e}function canDownload({isConnected:e,selectedFiles:n}){const o=n.filter(i=>i.source==="disk");return e&&n.length>0&&o.length===0}function canUpload({isConnected:e,selectedFiles:n}){const o=n.filter(i=>i.source==="board");return e&&n.length>0&&o.length===0}function canEdit({selectedFiles:e}){return e.filter(o=>o.type=="file").length!=0}function openIframeModal(e,n){const o=document.createElement("div");return o.className="fw-modal-overlay active",o.style.cssText="z-index: 10000;",o.innerHTML=`
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
  `,o.querySelector(".iframe-modal-close").addEventListener("click",()=>o.remove()),o.addEventListener("click",i=>{i.target===o&&o.remove()}),document.addEventListener("keydown",function i(s){s.key==="Escape"&&(o.remove(),document.removeEventListener("keydown",i))}),document.body.appendChild(o),o}function closeIframeModal(){const e=document.querySelector(".fw-modal-overlay.active");e&&e.remove()}function NewFileDialog(e,n){const o=e.isNewFileDialogOpen?"open":"closed";function i(h){h.target.id=="dialog-new-file"&&n("close-new-file-dialog")}function s(h){return()=>{const m=document.querySelector("#file-name"),w=m.value.trim()||m.placeholder;n("create-new-tab",h,w)}}function r(){n("close-new-file-dialog"),openIframeModal("https://scriptohub.ai/skills","Examples")}let l="";e.isConnected&&(l=html`
      <button class="button item" onclick=${s("board")}>Board</button>
    `),new MutationObserver((h,m)=>{const w=document.querySelector("#dialog-new-file input");w&&(w.focus(),m.disconnect())}).observe(document.body,{childList:!0,subtree:!0});let c="",d="";d=generateFileName();const u={type:"text",id:"file-name",value:c,placeholder:d},f=generateFileName();e.newFileName===null&&`${f}`;const p=html`
  <div id="dialog-new-file" class="dialog ${o}" onclick=${i}>
    <div class="dialog-content">
      <h2 class="dialog-title">Create new file</h2>
      <input class="dialog-input" ${u} />
      <div class="buttons-horizontal">
        ${l}
        <button class="button item" onclick=${s("disk")}>Computer</button>
      </div>
      <div class="buttons-horizontal">
        <button class="button item" onclick=${r}>From an example</button>
      </div>
    </div>
  </div>
`;if(e.isNewFileDialogOpen){const h=p.querySelector("#dialog-new-file .dialog-content > input");return h&&h.focus(),p}}function ScriptOsModal(e,n){return e.isScriptOsModalOpen?html`
    <div class="scriptos-modal-overlay" onclick=${o=>{o.target.classList.contains("scriptos-modal-overlay")&&n("close-scriptos-modal")}}>
      <div class="scriptos-modal">
        <button 
          class="scriptos-modal-close" 
          onclick=${()=>n("close-scriptos-modal")}
          title="Close">
          ×
        </button>
        ${e.scriptOsModalView==="library"?ScriptOsLibraryView(e,n):e.scriptOsModalView==="install"?ScriptOsInstallView(e,n):ScriptOsConfigView(e,n)}
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
    `;const o=y=>{if(y.slug){const S=[];return y.category&&S.push(y.category),y.skillType&&S.push(y.skillType==="skill"?"📦 Package":"🔧 Tool"),{name:y.displayName||y.slug,description:y.summary||"",tags:S,author:"",version:y.latestVersion?.version||"1.0.0"}}else return y.config&&y.config.info?{name:y.config.info.name||y.filename,description:y.config.info.description||"",tags:y.config.info.category?[y.config.info.category]:[],author:y.config.info.author||"",version:y.config.info.version||[1,0,0]}:{name:y.filename||"Unknown",description:"",tags:[],author:"",version:[1,0,0]}},i=new Set;e.scriptOsList.forEach(y=>{o(y).tags.forEach($=>i.add($))});const s=Array.from(i).sort(),r=(e.scriptOsSearchQuery||"").toLowerCase(),l=e.scriptOsFilterTags||[],a=e.scriptOsList.filter(y=>{const S=o(y),$=S.name.toLowerCase(),C=S.description.toLowerCase(),_=S.tags.join(" ").toLowerCase(),x=!r||$.includes(r)||C.includes(r)||_.includes(r),b=l.length===0||l.every(k=>S.tags.includes(k));return x&&b}),c={},d=[];a.forEach(y=>{const S=o(y),$=S.tags.length>0?S.tags[0]:null;$?(c[$]||(c[$]=[]),c[$].push(y)):d.push(y)});const u=Object.keys(c).sort(),f=y=>{e.scriptOsCategoryCollapse[y]=!e.scriptOsCategoryCollapse[y],n("render")},p=()=>{e.scriptOsFiltersCollapsed=!e.scriptOsFiltersCollapsed,n("render")},h=()=>{e.scriptOsViewMode=e.scriptOsViewMode==="cards"?"list":"cards",n("render")},m=e.scriptOsFiltersCollapsed,w=e.scriptOsViewMode||"cards";return html`
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
              ${s.length>1?html`
                <button 
                  class="scriptos-toolbar-btn ${m?"":"active"} ${l.length>0?"has-filters":""}"
                  onclick=${p}
                  title="${m?"Show filters":"Hide filters"}">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                  </svg>
                  ${l.length>0?html`<span class="scriptos-toolbar-badge">${l.length}</span>`:""}
                </button>
              `:""}
              <button 
                class="scriptos-toolbar-btn"
                onclick=${h}
                title="${w==="cards"?"Switch to list view":"Switch to card view"}">
                ${w==="cards"?html`
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
          
          ${s.length>1&&!m?html`
            <div class="scriptos-tag-filters">
              <div class="scriptos-tag-filters-list">
                ${s.map(y=>{const S=l.includes(y);return html`
                    <button 
                      class="scriptos-tag-filter ${S?"active":""}" 
                      onclick=${()=>n("scriptos-toggle-tag",y)}
                      title="${S?"Remove filter":"Filter by "+y}">
                      ${y}
                      ${S?html`<span class="scriptos-tag-check">✓</span>`:""}
                    </button>
                  `})}
              </div>
              ${l.length>0?html`
                <button 
                  class="scriptos-clear-filters"
                  onclick=${()=>n("scriptos-clear-tags")}
                  title="Clear all filters">
                  Clear filters (${l.length})
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
        `:u.length<=1&&d.length===0?html`
          <!-- Single category or flat list: no collapsible headers -->
          ${w==="list"?html`
            <div class="scriptos-list">
              ${a.map(y=>ScriptOsListRow(y,n))}
            </div>
          `:html`
            <div class="scriptos-grid">
              ${a.map(y=>ScriptOsCard(y,n,s.length<=1))}
            </div>
          `}
        `:html`
          <div class="scriptos-categories">
            ${u.map(y=>{const S=e.scriptOsCategoryCollapse[y]===!0;return html`
                <div class="scriptos-category ${S?"collapsed":""}">
                  <h3 class="scriptos-category-title" onclick=${()=>f(y)}>
                    <svg class="scriptos-category-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                    <span>${y}</span>
                    <span class="scriptos-category-count">${c[y].length}</span>
                  </h3>
                  ${S?"":w==="list"?html`
                    <div class="scriptos-list">
                      ${c[y].map($=>ScriptOsListRow($,n))}
                    </div>
                  `:html`
                    <div class="scriptos-grid">
                      ${c[y].map($=>ScriptOsCard($,n,!1))}
                    </div>
                  `}
                </div>
              `})}
            ${d.length>0?html`
              <div class="scriptos-category ${e.scriptOsCategoryCollapse.Other?"collapsed":""}">
                <h3 class="scriptos-category-title" onclick=${()=>f("Other")}>
                  <svg class="scriptos-category-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                  <span>Other</span>
                  <span class="scriptos-category-count">${d.length}</span>
                </h3>
                ${e.scriptOsCategoryCollapse.Other?"":w==="list"?html`
                  <div class="scriptos-list">
                    ${d.map(y=>ScriptOsListRow(y,n))}
                  </div>
                `:html`
                  <div class="scriptos-grid">
                    ${d.map(y=>ScriptOsCard(y,n,!1))}
                  </div>
                `}
              </div>
            `:""}
          </div>
        `}
      </div>
    </div>
  `}function ScriptOsCard(e,n,o=!1){let i,s,r,l,a;if(e.slug)i=e.displayName||e.slug,s=e.summary||"",l=e.tags?Object.keys(e.tags):[],r=e.latestVersion?.version?`v${e.latestVersion.version}`:"v1.0.0",a="";else if(e.config&&e.config.info){const c=e.config.info;i=c.name||e.filename,s=c.description||"",l=c.category?[c.category]:[],a=c.author||"",c.version?r=Array.isArray(c.version)?`v${c.version.join(".")}`:`v${c.version}`:r="v1.0.0"}else i=e.filename||"Unknown",s="",l=[],r="v1.0.0",a="";return html`
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
        <h3>${i}</h3>
        <span class="scriptos-card-version">${r}</span>
      </div>
      
      <p class="scriptos-card-description">
        ${s||"No description available"}
      </p>
      
      ${l.length>0&&!o?html`
        <div class="scriptos-card-tags">
          ${l.slice(0,3).map(c=>html`<span class="scriptos-tag-badge">${c}</span>`)}
          ${l.length>3?html`<span class="scriptos-tag-badge">+${l.length-3}</span>`:""}
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
  `}function ScriptOsListRow(e,n){let o,i,s;if(e.slug)o=e.displayName||e.slug,i=e.summary||"",s=e.latestVersion?.version?`v${e.latestVersion.version}`:"v1.0.0";else if(e.config&&e.config.info){const r=e.config.info;o=r.name||e.filename,i=r.description||"",r.version?s=Array.isArray(r.version)?`v${r.version.join(".")}`:`v${r.version}`:s="v1.0.0"}else o=e.filename||"Unknown",i="",s="v1.0.0";return html`
    <div class="scriptos-list-row" onclick=${()=>n("select-scriptos",e)}>
      <span class="scriptos-list-name">${o}</span>
      <span class="scriptos-list-version">${s}</span>
      <span class="scriptos-list-desc">${i}</span>
    </div>
  `}function ScriptOsInstallView(e,n){const o=e.selectedScriptOs;if(!o)return html`<div>Loading...</div>`;const i=e.scriptOsInstall||{},s=!!e.isConnected;return html`
    <div class="scriptos-config">
      <div class="scriptos-config-header">
        <div class="scriptos-config-title">
          <h2>${o.displayName}</h2>
          <span class="scriptos-config-version">v${o.version}</span>
        </div>
        <p class="scriptos-config-description">${o.summary||"No description"}</p>
      </div>

      <div class="scriptos-config-form">
        <p>Installing this ScriptO leaves it on the board${o.install.main?", running":""}, and gives an agent these tools:</p>
        <ul>
          ${o.tools.map(r=>html`<li><code>${r}</code></li>`)}
        </ul>
        ${i.error?html`<p class="fw-update-warn">${i.error}</p>`:""}
        ${i.done?html`<p>Installed on the board.</p>`:""}
        ${s?"":html`<p>Connect a board to install it.</p>`}
      </div>

      <div class="scriptos-config-actions">
        <button 
          class="scriptos-btn scriptos-btn-secondary" 
          onclick=${()=>n("scriptos-back")}>
          Back
        </button>
        <button 
          class="scriptos-btn scriptos-btn-primary" 
          disabled=${!s||i.busy||i.done}
          onclick=${()=>n("scriptos-install")}>
          ${i.busy?"Installing...":i.done?"Installed":"Install on the board"}
        </button>
      </div>
    </div>
  `}function ScriptOsConfigView(e,n){const o=e.selectedScriptOs;if(!o)return html`<div>Loading...</div>`;const i=o.config.info||{},s=o.config.args,r=s&&typeof s=="object"&&Object.keys(s).length>0;let l="v1.0.0";return i.version&&(Array.isArray(i.version)?l=`v${i.version.join(".")}`:l=`v${i.version}`),html`
    <div class="scriptos-config">
      <div class="scriptos-config-header">
        <div class="scriptos-config-title">
          <h2>${i.name||o.filename}</h2>
          <span class="scriptos-config-version">
            ${l}
          </span>
        </div>
        <p class="scriptos-config-description">${i.description||"No description"}</p>
        ${i.author?html`
          <div class="scriptos-config-meta">
            <span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              ${i.author}
            </span>
            ${i.www?html`
              <a href="${i.www}" target="_blank" rel="noopener">
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
          ${renderConfigFields(s,e,n)}
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
  `}function renderConfigFields(e,n,o){const i=Object.keys(e);return html`
    <div class="scriptos-config-fields">
      ${i.map(s=>{const r=e[s],l=r.label||s;r.type;const a=r.optional||!1;return html`
          <div class="scriptos-config-field">
            <label for="arg-${s}">
              ${l}
              ${a?html`<span class="scriptos-field-optional">(optional)</span>`:""}
            </label>
            ${renderInputField(s,r,n,o)}
          </div>
        `})}
    </div>
  `}function renderInputField(e,n,o,i){const s=n.type,r=o.scriptOsArgs[e],l=n.value!==void 0?n.value:null;switch(s){case"str":return html`
        <input 
          type="text" 
          id="arg-${e}"
          class="scriptos-input"
          value="${r!==void 0?r:l||""}"
          oninput=${u=>i("scriptos-update-arg",{argId:e,value:u.target.value})}
          placeholder="Enter text..."
        />
      `;case"int":return html`
        <input 
          type="number" 
          id="arg-${e}"
          class="scriptos-input"
          step="1"
          value="${r!==void 0?r:l||0}"
          oninput=${u=>i("scriptos-update-arg",{argId:e,value:parseInt(u.target.value)||0})}
          placeholder="Enter integer..."
        />
      `;case"float":return html`
        <input 
          type="number" 
          id="arg-${e}"
          class="scriptos-input"
          step="0.1"
          value="${r!==void 0?r:l||0}"
          oninput=${u=>i("scriptos-update-arg",{argId:e,value:parseFloat(u.target.value)||0})}
          placeholder="Enter number..."
        />
      `;case"bool":return html`
        <label class="scriptos-checkbox">
          <input 
            type="checkbox" 
            id="arg-${e}"
            checked=${r!==void 0?r:l||!1}
            onchange=${u=>i("scriptos-update-arg",{argId:e,value:u.target.checked})}
          />
          <span class="scriptos-checkbox-label">Enabled</span>
        </label>
      `;case"list":const a=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,21,26,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48];return html`
        <select 
          id="arg-${e}"
          class="scriptos-select"
          onchange=${u=>i("scriptos-update-arg",{argId:e,value:u.target.value==="none"?null:parseInt(u.target.value)})}>
          ${n.optional?html`<option value="none">No pin</option>`:""}
          ${a.map(u=>html`
            <option 
              value="${u}" 
              selected=${r==u||r===void 0&&l==u}>
              GPIO ${u}
            </option>
          `)}
        </select>
      `;case"dict":const c=n.items||{},d=Object.keys(c);return html`
        <select 
          id="arg-${e}"
          class="scriptos-select"
          onchange=${u=>i("scriptos-update-arg",{argId:e,value:u.target.value})}>
          ${d.map(u=>html`
            <option 
              value="${u}" 
              selected=${r===u||r===void 0&&l===u}>
              ${c[u]}
            </option>
          `)}
        </select>
      `;default:return html`
        <input 
          type="text" 
          id="arg-${e}"
          class="scriptos-input"
          value="${r!==void 0?r:l||""}"
          oninput=${u=>i("scriptos-update-arg",{argId:e,value:u.target.value})}
          placeholder="Enter value..."
        />
      `}}function ScriptOsUiModal(e,n){if(!e.scriptOsUiModal||!e.scriptOsUiModal.isOpen)return html`<div></div>`;const{url:o,title:i}=e.scriptOsUiModal;return html`
    <div 
      class="scriptos-ui-modal-overlay" 
      onclick=${s=>{s.target.classList.contains("scriptos-ui-modal-overlay")&&n("close-scriptos-ui-modal")}}>
      <div class="scriptos-ui-modal-container">
        <div class="scriptos-ui-modal-header">
          <h2 class="scriptos-ui-modal-title">${i||"ScriptO UI"}</h2>
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
            src="${o}"
            class="scriptos-ui-modal-iframe"
            style="${e.scriptOsUiModal.isLoading?"display: none;":""}"
            sandbox="allow-scripts allow-same-origin allow-forms"
            onload=${()=>{e.scriptOsUiModal&&e.scriptOsUiModal.isLoading&&(e.scriptOsUiModal.loadTimeout&&(clearTimeout(e.scriptOsUiModal.loadTimeout),e.scriptOsUiModal.loadTimeout=null),e.scriptOsUiModal.isLoading=!1,e.scriptOsUiModal.error=null,n("render"))}}
            onerror=${s=>{console.error("[ScriptO UI] Failed to load iframe:",s),e.scriptOsUiModal&&(e.scriptOsUiModal.loadTimeout&&(clearTimeout(e.scriptOsUiModal.loadTimeout),e.scriptOsUiModal.loadTimeout=null),e.scriptOsUiModal.isLoading=!1,e.scriptOsUiModal.error="Failed to load UI from device. Check the browser console for details.",n("render"))}}
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
            ${o}
          </div>
        </div>
      </div>
    </div>
  `}function ExtensionsModal(e,n){return!e.isExtensionsModalOpen&&!e.installingDependencies&&!e.dependencyPrompt?html`<div></div>`:e.dependencyPrompt?DependencyPromptModal(e,n):e.installingDependencies?DependencyInstallModal(e):html`
    <div class="scriptos-modal-overlay" onclick=${o=>{o.target.classList.contains("scriptos-modal-overlay")&&n("close-extensions-modal")}}>
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
            <p>Loading apps...</p>
          </div>
        `:ExtensionsLibraryView(e,n)}
      </div>
    </div>
  `}function DependencyPromptModal(e,n){const{extensionId:o,extensionName:i,dependencies:s}=e.dependencyPrompt,r=s?.mipPackage||"";return html`
    <div class="scriptos-modal-overlay" onclick=${l=>{l.target.classList.contains("scriptos-modal-overlay")&&n("close-dependency-prompt")}}>
      <div class="scriptos-modal" style="max-width: 500px;">
        <div class="scriptos-library">
          <div class="scriptos-header">
            <h2>Install Dependencies?</h2>
            <p class="scriptos-subtitle">${i} requires Python libraries</p>
          </div>
          
          <div style="padding: 20px;">
            <p style="color: var(--text-primary); margin-bottom: 16px;">
              This app requires Python libraries to be installed on your device.
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
                onclick=${()=>n("upload-extension-dependencies",o)}
                style="padding: 10px 20px;">
                Install
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `}function DependencyInstallModal(e,n){const{extensionName:o,mipPackage:i}=e.installingDependencies;return html`
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
              ${i}
            </div>
            <p style="color: var(--text-secondary);">
              This may take a few moments. Please wait...
            </p>
          </div>
        </div>
      </div>
    </div>
  `}function ExtensionsLibraryView(e,n){const o=e.availableExtensions||[],i=e.installedExtensions||[],s=new Set(i.map(a=>a.id)),r=o.filter(a=>!s.has(a.id)),l=(a,c)=>{for(let d=0;d<3;d++){const u=a[d]||0,f=c[d]||0;if(u>f)return!0;if(u<f)return!1}return!1};return o.length===0?html`
      <div class="scriptos-library">
        <div class="scriptos-header-sticky">
           <div class="scriptos-header">
            <h2>Apps</h2>
            <p class="scriptos-subtitle">System extensions registry</p>
          </div>
        </div>
        <div class="scriptos-content">
          <div class="scriptos-empty">
            <h3>No Apps Available</h3>
            <p>No apps found</p>
          </div>
        </div>
      </div>
    `:html`
    <div class="scriptos-library">
      <div class="scriptos-header-sticky">
        <div class="scriptos-header">
          <h2>Apps</h2>
          <p class="scriptos-subtitle">
            ${i.length} installed, ${r.length} available
          </p>
        </div>
      </div>
      
      <div class="scriptos-content">
        ${i.length>0?html`
          <div class="scriptos-section" style="margin-bottom: 32px">
            <h3 style="margin: 0 0 16px 0; font-size: 16px; color: var(--text-primary);">Installed</h3>
            
            <div class="scriptos-grid">
              ${i.map(a=>{const c=o.find(u=>u.id===a.id),d=c&&l(c.version,a.version);return html`
                  <div class="scriptos-card installed ${d?"has-update":""}">
                    ${d?html`
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
                        ${d?html`<span class="scriptos-version-arrow">→ v${c.version.join(".")}</span>`:""}
                      </span>
                    </div>

                    <p class="scriptos-card-description">${a.description}</p>
                    
                    ${d&&c.changelog?html`
                      <p class="scriptos-card-changelog">${c.changelog}</p>
                    `:""}
                    
                    <div class="scriptos-card-actions" style="margin-top: auto; padding-top: 12px; border-top: 1px solid var(--border-color); display: flex; gap: 8px;">
                      ${d?html`
                        <button 
                          class="scriptos-update-btn"
                          onclick=${u=>{u.stopPropagation(),n("update-extension",{extension:a,newVersion:c})}}
                          title="Update to v${c.version.join(".")}">
                          Update
                        </button>
                      `:""}
                      <button 
                        class="scriptos-uninstall-btn"
                        onclick=${u=>{u.stopPropagation(),n("uninstall-extension",a.id)}}
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
    `};return n[e]||n.cpu}function ResetDialog(e,n){const o=e.isResetDialogOpen?"open":"closed";function i(a){a.target.id==="dialog-reset"&&n("close-reset-dialog")}function s(){n("trigger-reset",0)}async function r(){confirm(`HARD RESET WARNING:

This is equivalent to pressing the physical reset button.
The connection will be lost immediately.

Are you sure you want to proceed?`)&&n("trigger-reset",1)}e.isResetDialogOpen&&window.addEventListener("keydown",function a(c){c.key==="Escape"&&(n("close-reset-dialog"),window.removeEventListener("keydown",a))},{once:!0});const l=html`
  <div id="dialog-reset" class="dialog ${o}" tabindex="-1" onclick=${i}>
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
               Restarts the MicroPython interpreter (VM). Global variables are cleared, but the connection to the device stays open.
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
  `;if(e.isResetDialogOpen)return l}function DebugSidebar(e,n){if(!e.debugger||!e.debugger.configOpen)return html``;const o=e.openFiles.filter(l=>l.fileName&&l.fileName.endsWith(".py")),s=(e.debugger.watchExpressions[""]||[]).join(`
`),r=e.debugger.active;return html`
    <div class="debug-sidebar">
      <div class="debug-sidebar-header">
        <h2>${r?"Debug Session":"Setup Debugger"}</h2>
        <button class="close-btn" onclick=${()=>{n(r?"debugger:stop":"debugger:close-config")}}>×</button>
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
              oninput=${l=>n("debugger:set-watches",l.target.value)}
            >${s}</textarea>
          </section>

          ${r?html`
            <section class="debug-section">
              <h3>Live Variables</h3>
              <div class="debug-variables">
                ${Object.entries(e.debugger.variables||{}).map(([l,a])=>html`
                  <div class="debug-var">
                    <span class="var-name">${l}:</span>
                    <span class="var-value">${a}</span>
                  </div>
                `)}
                ${Object.entries(e.debugger.locals||{}).map(([l,a])=>html`
                  <div class="debug-var">
                    <span class="var-name">${l}:</span>
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
              <p class="file-path">${e.openFiles.find(l=>l.id===e.editingFile)?.fileName||"No file selected"}</p>
              
              <div class="debug-actions">
                <button 
                  class="debug-btn-primary" 
                  onclick=${()=>n("debugger:start")}
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
  `}function BreakpointModal(e,n){if(!e.debugger||!e.debugger.breakpointModalOpen)return html`<div></div>`;const{file:o,line:i}=e.debugger.editingBreakpoint,s=e.debugger.breakpoints[o][i]||{condition:"",hitCount:"",enabled:!0},r=()=>{n("debugger:save-breakpoint",{file:o,line:i,config:s})},l=()=>{n("debugger:delete-breakpoint",{file:o,line:i})},a=()=>{n("debugger:close-breakpoint-modal")};return html`
    <div class="scriptos-modal-overlay" onclick=${c=>{c.target.classList.contains("scriptos-modal-overlay")&&a()}}>
      <div class="scriptos-modal breakpoint-modal">
        <div class="breakpoint-modal-header">
          <div class="breakpoint-modal-title">
            <span onclick=${a} style="cursor: pointer; font-size: 20px; line-height: 1;">×</span>
            <span>Breakpoint</span>
          </div>
          <div class="switch-container">
            <label class="switch">
              <input type="checkbox" checked=${s.enabled} onchange=${c=>{s.enabled=c.target.checked,n("render")}}>
              <span class="slider"></span>
            </label>
            <span style="font-size: 13px; color: var(--text-primary);">
              ${s.enabled?"Enabled":"Disabled"}
            </span>
            <button class="btn-delete" onclick=${l} title="Delete Breakpoint">
              ${IconSprite.renderIcon("trash",{size:20})}
            </button>
          </div>
        </div>

        <div class="breakpoint-modal-file">
          ${o} (${i})
        </div>

        <div class="breakpoint-field">
          <div class="breakpoint-field-icon" title="Condition">?</div>
          <input 
            type="text" 
            class="breakpoint-input" 
            placeholder="CONDITION EXPRESSION e.g. x == 0"
            value=${s.condition}
            oninput=${c=>{s.condition=c.target.value}}
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
            oninput=${c=>{s.hitCount=c.target.value}}
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
`);if(typeof n=="object"&&n.registry!==void 0)return n.registry;if(typeof n=="string"){const o=JSON.parse(n.trim());return o.registry||o||{}}return{}}catch(n){return console.warn("[device-registry] Error reading registry:",n),{}}}async function updateDeviceExtensionRegistry(e,n,o,i=null){try{await e.execute(`
import json
from lib.sys import apps
apps.register(${JSON.stringify(n)}, ${JSON.stringify(String(o))}, ${i?JSON.stringify(i):"None"})
print(json.dumps({"ok": True}))
`),console.log(`[device-registry] Updated ${n} to v${o}`)}catch(s){throw console.error("[device-registry] Error updating registry:",s),s}}async function removeDeviceExtension(e,n){return e.execute(`
import json
from lib.sys import apps
print(json.dumps(apps.remove(${JSON.stringify(n)})))
`)}function needsInstall(e,n){if(!n)return!0;const o=Array.isArray(e)?e.join("."):String(e),i=n.version||"";return o!==i}function hasOnInstallMethod(e){return e?/async\s+onInstall\s*\(/.test(e):!1}const deviceRegistry=Object.freeze(Object.defineProperty({__proto__:null,hasOnInstallMethod,needsInstall,readDeviceExtensionRegistry,removeDeviceExtension,updateDeviceExtensionRegistry},Symbol.toStringTag,{value:"Module"}));function decodeDeviceFiles(extensionCode){const filesMatch=extensionCode.match(/export\s+const\s+__DEVICE_FILES__\s*=\s*(\{[\s\S]*?\});/);if(!filesMatch)return{};try{const rawFiles=eval("("+filesMatch[1]+")"),deviceFiles={};for(const[e,n]of Object.entries(rawFiles))try{const o=atob(n),i=new Uint8Array(o.length);for(let s=0;s<o.length;s++)i[s]=o.charCodeAt(s);e.endsWith(".mpy")?deviceFiles[e]=i:deviceFiles[e]=new TextDecoder("utf-8").decode(i)}catch(o){console.warn(`[bundle-utils] Failed to decode ${e}:`,o),deviceFiles[e]=n}return deviceFiles}catch(e){return console.warn("[bundle-utils] Device files parse failed:",e),{}}}let lastExtensionDOM=null,lastExtensionKey=null;function shouldPreserveInput(e){const n=document.activeElement;if(n&&(n.tagName==="INPUT"||n.tagName==="TEXTAREA")){if(n.classList.contains("msg-input"))return!1;if(n.closest('.system-panel, .msg-chat, [class*="extension"]'))return!0}return!1}async function checkAndRunOnInstall(e,n,o,i,s,r){const l=o.data.config,a=Array.isArray(l.version)?l.version.join("."):String(l.version||"0.0.0");try{const d=(await readDeviceExtensionRegistry(i))[e];if(!needsInstall(a,d))return;s.loadedExtensions[e].installing=!0,r("render");try{await n.onInstall(),await updateDeviceExtensionRegistry(i,e,a)}catch(u){console.error("[ExtensionContainer] onInstall failed:",u),s.loadedExtensions[e].installError=u.message}finally{s.loadedExtensions[e].installing=!1,r("render")}}catch(c){console.warn("[ExtensionContainer] Could not check device registry:",c)}}async function instantiateExtension$1(e,n,o,i,s){if(n.data.styles&&!n.stylesInjected){const p=`extension-styles-${e}`;let h=document.getElementById(p);h||(h=document.createElement("style"),h.id=p,h.textContent=n.data.styles,document.head.appendChild(h)),n.stylesInjected=!0}const r=n.data.content,l=decodeDeviceFiles(r),a=new Blob([r],{type:"text/javascript"}),c=URL.createObjectURL(a);let d;try{d=(await import(c)).default}finally{URL.revokeObjectURL(c)}if(!d)throw new Error("No default export found in extension bundle");const u=new DeviceAPI$1(BridgeDevice),f=new d(u,i,o,s);f.deviceFiles=l,n.instance=f,n.instantiating=!1,i("render"),o.isConnected&&typeof f.onInstall=="function"&&checkAndRunOnInstall(e,f,n,u,o,i)}function ExtensionContainer(e,n,o){const i=e.activeExtension,s=e.activeExtensionPanel,r=`${i}:${s}`;if(shouldPreserveInput()&&lastExtensionDOM&&lastExtensionKey===r)return console.debug("[ExtensionContainer] Preserving DOM during input focus"),lastExtensionDOM;if(!i||!s)return lastExtensionDOM=null,lastExtensionKey=null,o`
      <div class="system-panel">
        <div class="panel-message">
          <p>No extension panel selected</p>
        </div>
      </div>
    `;if(!e.loadedExtensions[i])return lastExtensionDOM=null,lastExtensionKey=null,e.isConnected?o`
      <div class="system-panel">
        <div class="panel-message">
          <p>Loading extension...</p>
        </div>
      </div>
    `:o`
        <div class="system-panel">
          <div class="panel-message" style="cursor: pointer;" onclick=${()=>n("connect")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="32" height="32" style="opacity: 0.4; margin-bottom: 8px;">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
            <p style="color: var(--text-secondary);">Connect to device</p>
          </div>
        </div>
      `;const l=e.loadedExtensions[i];if(!l.instance&&!l.instantiating)return l.instantiating=!0,instantiateExtension$1(i,l,e,n,o).catch(d=>{console.error("[ExtensionContainer] Failed to instantiate extension:",d),l.instantiateError=d.message,l.instantiating=!1,n("render")}),lastExtensionDOM=null,lastExtensionKey=null,o`
      <div class="system-panel">
        <div class="panel-message">
          <p>Loading extension...</p>
        </div>
      </div>
    `;if(l.instantiating)return lastExtensionDOM=null,lastExtensionKey=null,o`
      <div class="system-panel">
        <div class="panel-message">
          <p>Loading extension...</p>
        </div>
      </div>
    `;if(l.instantiateError)return lastExtensionDOM=null,lastExtensionKey=null,o`
      <div class="system-panel">
        <div class="panel-message error">
          <p>Failed to load extension: ${l.instantiateError}</p>
        </div>
      </div>
    `;if(l.installing){lastExtensionDOM=null,lastExtensionKey=null;const d=l.data?.config?.name||i;return o`
      <div class="system-panel">
        <div class="panel-message" style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; padding: 48px 24px;">
          <div class="install-progress-spinner"></div>
          <div style="text-align: center;">
            <div style="font-size: 1.1rem; font-weight: 600; margin-bottom: 6px;">Installing ${d}</div>
            <div style="color: var(--text-secondary); font-size: 0.9rem;">Writing files to device…</div>
          </div>
        </div>
      </div>
    `}if(l.installError)return lastExtensionDOM=null,lastExtensionKey=null,o`
      <div class="system-panel">
        <div class="panel-message error">
          <p>Failed to install app files: ${l.installError}</p>
          <button onclick=${()=>{delete l.installError,delete l.instance,n("render")}}>Retry</button>
        </div>
      </div>
    `;const a=l.instance,c=`render${s.charAt(0).toUpperCase()+s.slice(1)}`;if(typeof a[c]!="function")return lastExtensionDOM=null,lastExtensionKey=null,o`
      <div class="system-panel">
        <div class="panel-message error">
          <p>App panel not found: ${s}</p>
          <p>Looking for method: ${c}</p>
        </div>
      </div>
    `;try{const d=a[c]();return lastExtensionDOM=d,lastExtensionKey=r,d}catch(d){return console.error("[ExtensionContainer] Render error:",d),lastExtensionDOM=null,lastExtensionKey=null,o`
      <div class="system-panel">
        <div class="panel-message error">
          <p>App render error: ${d.message}</p>
        </div>
      </div>
    `}}class LogTerminalComponent extends Component{constructor(n,o,i){super(n),this.state=o,this.emit=i,this.term=null,this.fitAddon=null,this.resizeObserver=null,this.writeHandler=null,this.clearHandler=null}createElement(n){return html`<div class="log-sidebar-terminal"></div>`}update(n){return this.state=n,!1}load(n){console.debug("[LogTerminal] Component loaded, initializing terminal"),this.initTerminal(n),this.attachEventListeners()}unload(){console.debug("[LogTerminal] Component unloading, cleaning up"),this.cleanup()}async initTerminal(n){const i=document.documentElement.getAttribute("data-theme")==="dark";let s,r,l,a;i?(s="#2c3e50",r="#e8eaed",l="#008184",a="#34495e"):(s="#ffffff",r="#1f1f1f",l="#008184",a="#e8e8e8"),await this.ensureFontsLoaded();const[c,d]=await Promise.all([__vitePreload(()=>import("./xterm-CASmyfyk.js"),[]),__vitePreload(()=>import("./addon-fit-DOCEibfw.js"),[]),__vitePreload(()=>Promise.resolve({}),__vite__mapDeps([12]))]),u=c.Terminal,f=d.FitAddon;this.term=new u({cursorBlink:!1,cursorStyle:"bar",fontSize:12,fontFamily:"monospace",letterSpacing:0,theme:{background:s,foreground:r,cursor:l,selection:a},disableStdin:!0,scrollback:this.state.logs?.maxMessages||1e3}),this.fitAddon=new f,this.term.loadAddon(this.fitAddon),console.debug("[LogTerminal] Opening terminal into container, dimensions:",n.getBoundingClientRect()),this.term.open(n),this.fitAfterOpen(n)}async ensureFontsLoaded(){if(document.fonts&&document.fonts.ready)try{return await document.fonts.ready,document.fonts.check&&await new Promise(n=>setTimeout(n,50)),Promise.resolve()}catch{return new Promise(o=>setTimeout(o,200))}else return new Promise(n=>setTimeout(n,200))}fitAfterOpen(n){setTimeout(()=>this.fitTerminal(),100),setTimeout(()=>this.fitTerminal(),300),setTimeout(()=>this.fitTerminal(),1e3),this.resizeObserver=new ResizeObserver(()=>{setTimeout(()=>this.fitTerminal(),50)}),this.resizeObserver.observe(n);const o=n.closest(".log-sidebar");o&&this.resizeObserver.observe(o),this.term.write(`\x1B[1;32m=== Log Terminal Initialized ===\x1B[0m\r
`),this.term.write(`\x1B[37mTerminal is ready to receive logs\x1B[0m\r
\r
`),this.state.logs?.messages?.length>0&&(console.debug("[LogTerminal] Writing",this.state.logs.messages.length,"buffered messages"),this.state.logs.messages.forEach(i=>{this.writeLogEntry(i)}))}fitTerminal(){if(!this.term||!this.fitAddon)return;const o=this.element?.closest(".log-sidebar")?.getBoundingClientRect(),i=this.element?.getBoundingClientRect();console.debug("[LogTerminal] Sidebar rect:",o,"Container rect:",i);try{this.fitAddon.fit(),this.term.refresh&&this.term.refresh(0,this.term.rows-1),console.debug("[LogTerminal] Fitted:",this.term.cols,"x",this.term.rows)}catch(s){console.warn("[LogTerminal] Fit failed:",s)}}attachEventListeners(){this.writeHandler=n=>{const o=n.detail;o&&this.term&&this.writeLogEntry(o)},this.clearHandler=()=>{this.term&&this.term.clear()},window.addEventListener("log-terminal-write",this.writeHandler),window.addEventListener("log-terminal-clear",this.clearHandler),console.debug("[LogTerminal] Event listeners attached")}writeLogEntry(n){if(!this.term)return;const{level:o,message:i,timestamp:s,source:r}=n,l=["\x1B[37m","\x1B[38;5;208m","\x1B[33m","\x1B[91m"],a=["DBG","INF","WRN","ERR"],c=l[o]||"",d=a[o]||"LOG",u="\x1B[0m";let f="";if(s){const w=s<9466848e5?s*1e3:s;f=`[${new Date(w).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"})}] `}const p=r?`[${r}] `:"",h=`${f}${c}[${d}]${u} ${p}${i}\r
`;this.term.write(h),this.state.logs?.autoScroll!==!1&&this.term.scrollToBottom()}cleanup(){this.writeHandler&&(window.removeEventListener("log-terminal-write",this.writeHandler),this.writeHandler=null),this.clearHandler&&(window.removeEventListener("log-terminal-clear",this.clearHandler),this.clearHandler=null),this.resizeObserver&&(this.resizeObserver.disconnect(),this.resizeObserver=null),this.term&&(this.term.dispose(),this.term=null),this.fitAddon=null}}let logTerminalComponent=null;function LogSidebar(e,n){if(!e.logs.isOpen)return logTerminalComponent=null,null;logTerminalComponent||(logTerminalComponent=new LogTerminalComponent("log-terminal",e,n));const o=logTerminalComponent.render(e),i=e.logSidebarWidth||350;return html`
    <div class="log-sidebar" style="width: ${i}px; flex: 0 0 ${i}px;">
      <div class="log-sidebar-resizer" 
           onmousedown=${()=>n("start-resizing-log-sidebar")}></div>
      <div class="log-sidebar-header">
        ${IconSprite.renderIcon("file-text",{className:"",size:16})}
        <span>Logs</span>
      </div>
      ${o}
    </div>
  `}function FileActions(e,n){const{isConnected:o,selectedFiles:i}=e,s=i.some(r=>r.type==="file");return html`
  <div id="file-actions">
    ${Button$1({icon:"edit",size:"small",disabled:!canEdit({selectedFiles:e.selectedFiles}),onClick:()=>n("open-selected-files")})}
    ${Button$1({icon:"arrow-left",size:"small",background:"inverted",active:!0,disabled:!canUpload({isConnected:o,selectedFiles:i}),onClick:()=>n("upload-files")})}
    ${Button$1({icon:"arrow-right",size:"small",background:"inverted",active:!0,disabled:!canDownload({isConnected:o,selectedFiles:i}),onClick:()=>n("download-files")})}
    ${Button$1({icon:"arrow-down",size:"small",background:"inverted",active:!0,disabled:!s,onClick:()=>n("export-files")})}
    ${Button$1({icon:"trash",size:"small",disabled:e.selectedFiles.length===0,onClick:()=>n("remove-files")})}
  </div>

  `}const DiskFileList=generateFileList("disk"),BoardFileList=generateFileList("board");function generateFileList(e){return function(o,i){function s(p){p.key.toLowerCase()==="enter"&&p.target.blur(),p.key.toLowerCase()==="escape"&&(p.target.value=null,p.target.blur())}const r=html`
      <div class="item">
        ${IconSprite.renderIcon("file",{className:"icon"})}
        <div class="text">
          <input type="text" onkeydown=${s} onblur=${p=>i("finish-creating-file",p.target.value)}/>
        </div>
      </div>
    `,l=html`
      <div class="item">
        ${IconSprite.renderIcon("folder",{className:"icon"})}
        <div class="text">
          <input type="text" onkeydown=${s} onblur=${p=>i("finish-creating-folder",p.target.value)}/>
        </div>
      </div>
    `;function a(p,h){const m=html`
        <input type="text"
          value=${p.fileName}
          onkeydown=${s}
          onblur=${k=>i("finish-renaming-file",k.target.value)}
          onclick=${k=>!1}
          ondblclick=${k=>!1}
          />
      `,w=o.selectedFiles.find(k=>k.fileName===p.fileName&&k.source===e);function y(k){return k.preventDefault(),i("rename-file",e,p),!1}function S(){o.renamingFile||i(`navigate-${e}-folder`,p.fileName)}function $(){o.renamingFile||i("open-file",e,p)}let C=p.fileName;const _=o.selectedFiles.find(k=>k.fileName===C);o.renamingFile==e&&_&&(C=m);function x(k){if(k==null)return"";if(k===0)return"0 B";const F=1024,A=["B","KB","MB","GB"],R=Math.floor(Math.log(k)/Math.log(F));return parseFloat((k/Math.pow(F,R)).toFixed(1))+" "+A[R]}const b=p.type==="file"?x(p.size):"";return p.type==="folder"?html`
          <div
            class="item ${w?"selected":""}"
            onclick=${k=>i("toggle-file-selection",p,e,k)}
            ondblclick=${S}
            >
            ${IconSprite.renderIcon("folder",{className:"icon"})}
            <div class="text">${C}</div>
            <div class="options" onclick=${y}>
              ${IconSprite.renderIcon("cursor-text",{className:""})}
            </div>
          </div>
        `:html`
          <div
            class="item ${w?"selected":""}"
            onclick=${k=>i("toggle-file-selection",p,e,k)}
            ondblclick=${$}
            >
            ${IconSprite.renderIcon("file",{className:"icon"})}
            <div class="text" style="display: flex; justify-content: space-between; padding-right: 10px;">
              <span>${C}</span>
              <span class="file-size">${b}</span>
            </div>
            <div class="options" onclick=${y}>
              ${IconSprite.renderIcon("cursor-text",{className:""})}
            </div>
          </div>
        `}const c=o[`${e}Files`].sort((p,h)=>{const m=p.fileName.toUpperCase(),w=h.fileName.toUpperCase();if(p.type==="folder"&&h.type==="file")return-1;if(p.type===h.type){if(m<w)return-1;if(m>w)return 1}return 0}),d=html`<div class="item"
  onclick=${()=>i(`navigate-${e}-parent`)}
  style="cursor: pointer"
  >
  ..
</div>`,u=html`
      <div class="file-list">
        <div class="list">
          ${e==="disk"&&o.diskNavigationPath!="/"?d:""}
          ${e==="board"&&o.boardNavigationPath!="/"?d:""}
          ${o.creatingFile==e?r:null}
          ${o.creatingFolder==e?l:null}
          ${c.map(a)}
        </div>
      </div>
    `;return new MutationObserver(p=>{const h=u.querySelector("input");h&&h.focus()}).observe(u,{childList:!0,subtree:!0}),u}}function ReplPanel(e,n){const o=()=>{e.panelHeight>PANEL_CLOSED$1?n("close-panel"):n("open-panel")};e.isPanelOpen;const i=e.panelHeight>PANEL_TOO_SMALL$1?"visible":"hidden";let s="terminal-enabled";(!e.isConnected||e.isNewFileDialogOpen)&&(s="terminal-disabled");const r=e.isConnected||e.isReconnecting?"":"no-board";return html$1`
    <div id="panel" class=${r} style="height: ${e.panelHeight}px">
      <div class="panel-bar">
        ${e.isConnected&&e.connectedPort?html$1`
          <div class="panel-connection-label" title=${`Connected to ${e.connectedPort}`}>
            Connected to ${e.connectedPort}
          </div>
        `:""}
        <div class="spacer"></div>
        <div id="drag-handle"
          onmousedown=${l=>n("start-resizing-panel",l)}
          ></div>
        <div class="term-operations ${i}">
          ${ReplOperations(e,n)}
        </div>
        ${Button$1({icon:e.panelHeight>PANEL_CLOSED$1?"chevron-down":"chevron-up",size:"small",onClick:o})}
        
      </div>
      <div class="repl-panel-content">
        <div class="repl-panel-main ${s}">
          ${e.cache(XTerm,"terminal").render()}
        </div>
        ${e.logs&&e.logs.isOpen?LogSidebar(e,n):""}
      </div>
    </div>
  `}function ReplOperations(e,n){return[Button$1({icon:"copy",size:"small",tooltip:"Copy",onClick:()=>document.execCommand("copy")}),Button$1({icon:"clipboard",size:"small",tooltip:"Paste",onClick:()=>document.execCommand("paste")}),Button$1({icon:"trash",size:"small",tooltip:`Clean (${e.platform==="darwin"?"Cmd":"Ctrl"}+L)`,onClick:()=>n("clear-terminal")}),Button$1({icon:"file-text",size:"small",tooltip:"Toggle Logs",onClick:()=>n("toggle-log-sidebar")})]}function Tabs(e,n){const o=html`
    <div id="tabs">
      ${e.openFiles.map(s=>Tab({text:s.fileName,icon:s.source==="board"?"cpu":"device-desktop",active:s.id===e.editingFile,renaming:s.id===e.renamingTab,hasChanges:s.hasChanges,onSelectTab:()=>n("select-tab",s.id),onCloseTab:()=>n("close-tab",s.id),onStartRenaming:()=>n("rename-tab",s.id),onFinishRenaming:r=>n("finish-renaming-tab",r)}))}
    </div>
  `;return new MutationObserver(s=>{const r=o.querySelector("input");r&&r.focus()}).observe(o,{childList:!0,subtree:!0}),o}function Toolbar(e,n){const o=canSave({isConnected:e.isConnected,openFiles:e.openFiles,editingFile:e.editingFile}),i=canExecute({isConnected:e.isConnected}),s=e.platform==="darwin"?"Cmd":"Ctrl",r=e.debugger.active||e.debugger.configOpen;return html`
    <div id="navigation-bar">
      <div id="toolbar">
        ${Button$1({icon:"file-plus",label:"New",tooltip:`New (${s}+N)`,disabled:e.systemSection!="editor"||r,onClick:()=>n("create-new-file"),first:!0})}

        ${Button$1({icon:"device-floppy",label:"Save",tooltip:`Save (${s}+S)`,disabled:!o||r,onClick:()=>n("save")})}

        <div class="separator"></div>

        ${Button$1({icon:"alert-triangle",label:"Reset",tooltip:"Reset Device",disabled:!e.isConnected,onClick:()=>n("open-reset-dialog")})}

        ${r?html`
          ${Button$1({icon:"player-stop",label:"Stop",tooltip:"Stop Debug",onClick:()=>n("debugger:stop")})}

          ${Button$1({icon:"player-play",label:e.debugger.active?"Continue":"Run",tooltip:e.debugger.active?"Continue (F5)":"Start Debugging (F5)",disabled:e.debugger.active&&!e.debugger.halted,onClick:()=>{e.debugger.active?n("debugger:continue",!0):n("debugger:start")}})}

          ${Button$1({icon:"player-skip-forward",label:"Step",tooltip:"Step Over (F10)",disabled:!e.debugger.active||!e.debugger.halted,onClick:()=>n("debugger:step-over")})}
          ${Button$1({icon:"step-into",label:"Step In",tooltip:"Step Into (F11)",disabled:!e.debugger.active||!e.debugger.halted,onClick:()=>n("debugger:step-into")})}
          ${Button$1({icon:"step-out",label:"Step Out",tooltip:"Step Out (F12)",disabled:!e.debugger.active||!e.debugger.halted,onClick:()=>n("debugger:step-out")})}
        `:html`
          ${Button$1({icon:"player-stop",label:"Stop",tooltip:"Stop",disabled:!i,onClick:()=>n("stop")})}

          ${Button$1({icon:"player-play",label:"Run",tooltip:`Run (${s}+R)`,disabled:!i,onClick:l=>{l.altKey?n("run-from-button",!0):n("run-from-button")}})}

          <div class="separator"></div>

          ${e.systemSection==="editor"?Button$1({icon:"bug",label:"Debug",tooltip:"Start Debugging",disabled:!i||!e.editingFile,onClick:()=>n("debugger:open-config")}):""}

          <div class="separator"></div>

          ${e.systemSection==="system"?Button$1({icon:"apps",label:"Apps",tooltip:"Manage Apps",onClick:()=>n("open-extensions-modal")}):""}
        `}
      </div>
    </div>
  `}function Overlay(e,n){let o=html`<div id="overlay" class="closed"></div>`;if(e.diskFiles==null&&(n("load-disk-files"),o=html`<div id="overlay" class="open"><p>Loading files...</p></div>`),e.isRemoving&&(o=html`<div id="overlay" class="open"><p>Removing...</p></div>`),e.isConnecting&&(o=html`<div id="overlay" class="open"><p>Connecting...</p></div>`),e.isLoadingFiles&&(o=html`<div id="overlay" class="open"><p>Loading files...</p></div>`),e.isSaving&&(o=html`<div id="overlay" class="open"><p>Saving file... ${e.savingProgress}</p></div>`),e.isTransferring){const i=String(e.transferringProgress||""),s=i.match(/(\d+)%?$/),r=s?parseInt(s[1]):0,l=i.match(/^(.+?):/),a=l?l[1]:"file";o=html`
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
    `}return o}const DISCONNECTED_STATUS_TEXT="ScriptO Studio © JetPax 2026";function formatUptimeMinutes(e){const n=(e||0)*60,o=Math.floor(n/86400),i=Math.floor(n%86400/3600),s=Math.floor(n%3600/60),r=Math.floor(n%60),l=[];return o>0&&l.push(`${o}d`),i>0&&l.push(`${i}h`),s>0&&l.push(`${s}m`),(r>0||l.length===0)&&l.push(`${r}s`),l.join(" ")}function buildStatusBarModel(e,n){if(!e)return{connected:!1,disconnectedText:DISCONNECTED_STATUS_TEXT,ram:null,temp:null,uptime:null,rssi:null};const o=e.mem||{},i=e.temp,s=e.uptime||0,r=e.wifi_rssi;let l=o.alloc||0,a=o.free||0;const c=e.bvm;c&&(l+=c.total||0);const d=l+a,u=(l/1024).toFixed(2),f=(d/(1024*1024)).toFixed(2);let p=null;i!=null&&((n||"degC")==="degF"?p=`${(i*9/5+32).toFixed(1)}°F`:p=`${i.toFixed(1)}°C`);const h=formatUptimeMinutes(s);let m=null;return r!=null&&(m=`${r} dBm`),{connected:!0,disconnectedText:DISCONNECTED_STATUS_TEXT,ram:`${u} KB / ${f} MB`,temp:p,uptime:h,rssi:m}}function StatusBar(e,n){const o=buildStatusBarModel(e.isConnected?e.statusInfo:null,e.temperatureUnit||"degC");if(!o||!o.connected){const i=o&&o.disconnectedText||DISCONNECTED_STATUS_TEXT;return html`
      <div id="status-bar" class="disconnected">
        <div class="status-bar-center">
          <a href="https://scriptostudio.com" target="_blank" rel="noopener noreferrer">${i}</a>
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
  `}function LanguageSelector(e,n){const o=window.html||(()=>{}),i=e.locale||"en",s=window.i18n?window.i18n.getAvailableLocales():["en","de","es","fr"],r=window.i18n?window.i18n.t("language"):"Language";return o`
    <div class="language-selector">
      <label class="language-selector-label" for="language-select">
        ${r}
      </label>
      <select
        id="language-select"
        class="language-select"
        onchange=${a=>{const c=a.target.value;n("change-locale",c)}}
      >
        ${s.map(a=>o`
          <option value=${a} selected=${a===i}>
            ${window.i18n?window.i18n.getLocaleName(a):a}
          </option>
        `)}
      </select>
    </div>
  `}typeof window<"u"&&(window.LanguageSelector=LanguageSelector);function AppearancePanel(e,n){const o=window.i18n?window.i18n.t:l=>l;e.isConnected&&!e.networkInterfacesConfig&&!e.isLoadingNetworkInterfacesConfig&&n("load-network-interfaces-config");const i=e.networksInfo?.eth!==null,s=e.networksInfo?.wwan!==null,r=e.networkInterfacesConfig||{wifi:!0,ethernet:!0,wwan:!0};return html`
    <div class="panel-container">
      <div class="appearance-content">
        
        <!-- Theme Mode Section -->
        <div class="appearance-section">
          <h3>${o("appearance.theme")}</h3>
          <p class="appearance-hint">${o("appearance.themeHint")}</p>
          
          <div class="theme-mode-selector">
            ${renderThemeOption("light",o("appearance.themeLight"),e,n)}
            ${renderThemeOption("dark",o("appearance.themeDark"),e,n)}
            ${renderThemeOption("device",o("appearance.themeDevice"),e,n)}
          </div>
          
          ${e.theme==="device"?html`
            <p class="appearance-hint">
              ${o("appearance.themeCurrentlyUsing")} <strong>${e.effectiveTheme==="dark"?o("appearance.themeDark"):o("appearance.themeLight")}</strong> 
              ${o("appearance.themeFromSystem")}
            </p>
          `:""}
        </div>
        
        <!-- Color Scheme Section -->
        <div class="appearance-section">
          <h3>${o("appearance.colorScheme")}</h3>
          <p class="appearance-hint">${o("appearance.colorSchemeHint")}</p>
          
          <div class="color-scheme-grid">
            ${renderColorSchemeOption("teal",o("appearance.colorTeal"),e,n)}
            ${renderColorSchemeOption("blue",o("appearance.colorBlue"),e,n)}
            ${renderColorSchemeOption("purple",o("appearance.colorPurple"),e,n)}
            ${renderColorSchemeOption("green",o("appearance.colorGreen"),e,n)}
            ${renderColorSchemeOption("red",o("appearance.colorRed"),e,n)}
            ${renderColorSchemeOption("orange",o("appearance.colorOrange"),e,n)}
          </div>
        </div>
        
        <!-- Editor Theme Section -->
        <div class="appearance-section">
          <h3>${o("appearance.editorTheme")}</h3>
          <p class="appearance-hint">${o("appearance.editorThemeHint")}</p>
          
          <div class="editor-theme-grid">
            ${renderEditorThemeOption("auto",o("appearance.editorAuto"),o("appearance.editorAutoDesc"),e,n)}
            ${renderEditorThemeOption("cobalt",o("appearance.editorCobalt"),o("appearance.editorCobaltDesc"),e,n)}
            ${renderEditorThemeOption("xcode",o("appearance.editorXcode"),o("appearance.editorXcodeDesc"),e,n)}
            ${renderEditorThemeOption("coolglow",o("appearance.editorCoolGlow"),o("appearance.editorCoolGlowDesc"),e,n)}
          </div>
        </div>
        
        <!-- Temperature Unit Section -->
        <div class="appearance-section">
          <h3>${o("appearance.temperatureUnit")}</h3>
          <p class="appearance-hint">${o("appearance.temperatureUnitHint")}</p>
          
          <div class="theme-mode-selector">
            ${renderTemperatureUnitOption("degC",o("appearance.temperatureCelsius"),e,n)}
            ${renderTemperatureUnitOption("degF",o("appearance.temperatureFahrenheit"),e,n)}
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
                ${i?renderNetworkInterfaceOption("ethernet","Ethernet",r.ethernet,e,n):""}
                ${s?renderNetworkInterfaceOption("wwan","WWAN (4G)",r.wwan,e,n):""}
              </div>
              
              <button 
                class="save-button" 
                style="margin-top: 16px;"
                onclick=${()=>{const l={wifi:e.networkInterfacesConfig?.wifi??!0,ethernet:e.networkInterfacesConfig?.ethernet??!0,wwan:e.networkInterfacesConfig?.wwan??!0};n("save-network-interfaces-config",l)}}
                disabled=${!e.isConnected||e.isSavingNetworkInterfacesConfig===!0}
              >
                ${e.isSavingNetworkInterfacesConfig?"Saving...":"Save Network Settings"}
              </button>
            `}
          </div>
        `:""}
        
      </div>
    </div>
  `}function renderThemeOption(e,n,o,i){const s=o.theme===e;return html`
    <button 
      class="theme-mode-option ${s?"selected":""}"
      onclick=${()=>i("set-theme",e)}
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
    `};return n[e]||n.device}function renderColorSchemeOption(e,n,o,i){const s=o.colorScheme===e;return html`
    <div 
      class="color-scheme-option ${s?"selected":""}"
      data-scheme="${e}"
      onclick=${()=>i("set-color-scheme",e)}
    >
      <div class="color-scheme-circle"></div>
      <div class="color-scheme-label">${n}</div>
    </div>
  `}function renderTemperatureUnitOption(e,n,o,i){const s=(o.temperatureUnit||"degC")===e;return html`
    <button 
      class="theme-mode-option ${s?"selected":""}"
      onclick=${()=>i("set-temperature-unit",e)}
    >
      <span>${n}</span>
    </button>
  `}function renderEditorThemeOption(e,n,o,i,s){const r=(i.editorTheme||"auto")===e;return html`
    <div 
      class="editor-theme-option ${r?"selected":""}"
      onclick=${()=>s("set-editor-theme",e)}
    >
      <div class="editor-theme-preview" data-theme="${e}"></div>
      <div class="editor-theme-info">
        <div class="editor-theme-name">${n}</div>
        <div class="editor-theme-desc">${o}</div>
      </div>
    </div>
  `}function renderNetworkInterfaceOption(e,n,o,i,s){return html`
    <div class="network-interface-option">
      <div class="network-interface-info">
        <span class="network-interface-label">${n}</span>
        <span class="network-interface-status ${o?"enabled":"disabled"}">
          ${o?"Enabled":"Disabled"}
        </span>
      </div>
      <label class="toggle-switch">
        <input 
          type="checkbox" 
          checked=${o}
          onchange=${r=>{i.networkInterfacesConfig||(i.networkInterfacesConfig={wifi:!0,ethernet:!0,wwan:!0}),i.networkInterfacesConfig[e]=r.target.checked,s("render")}}
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
          <span class="info-value info-mono">${"460eeda"}</span>
        </div>
        <div class="info-item">
          <span class="info-label">${e("sysinfo.studioBuildDate")}</span>
          <span class="info-value">${"2026-11-14"}</span>
        </div>
      </div>
    </div>
  `}function FirmwareInfoSection(e,n){const o=e?.firmware_version||{},i=o.platform_version||o.platform||n("sysinfo.notAvailable"),s=o.built||n("sysinfo.notAvailable"),r=o.origin||(o.platform_version?"gha":"unknown");return html`
    <div class="panel-section">
      <h3 class="panel-section-title">${n("sysinfo.firmwareTitle")}</h3>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">${n("sysinfo.firmwareVersion")}</span>
          <span class="info-value">${i}</span>
        </div>
        <div class="info-item">
          <span class="info-label">${n("sysinfo.firmwareBuilt")}</span>
          <span class="info-value info-mono">${s}</span>
        </div>
        <div class="info-item">
          <span class="info-label">${n("sysinfo.firmwareOrigin")}</span>
          <span class="info-value">${r}</span>
        </div>
      </div>
    </div>
  `}function SysInfoPanel(e,n){const o=window.i18n?window.i18n.t:s=>s;if(!e.systemInfo&&e.isConnected&&!e.isLoadingSystemInfo&&!e.systemInfoAttempted&&(e.systemInfoAttempted=!0,n("refresh-system-info")),!e.systemInfo)return html`
      <div class="panel-container">
        <div class="panel-header">
          <h2>${o("sysinfo.title")}</h2>
        </div>
        ${StudioInfoSection(o)}
        <div class="panel-message">
          <p>${e.isConnected?o("sysinfo.loading"):"Connect to a device to view system information."}</p>
        </div>
      </div>
    `;const i=e.systemInfo;return html`
    <div class="panel-container">
      <div class="panel-header">
        <h2>${o("sysinfo.title")}</h2>
      </div>
      
      ${StudioInfoSection(o)}
      ${FirmwareInfoSection(e.boardConfig,o)}
      ${BoardInfoSection(e.boardConfig,o)}
      ${MCUSection(i,o)}
      ${PartitionsSection(i,o)}
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
  `}function MCUSection(e,n){const o=e.os||{};return html`
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
          <span class="info-value">${formatBytes$2(e.flashSize)}</span>
        </div>
        <div class="info-item">
          <span class="info-label">${n("sysinfo.platform")}</span>
          <span class="info-value">${o.platform||n("sysinfo.notAvailable")}</span>
        </div>
        <div class="info-item">
          <span class="info-label">${n("sysinfo.system")}</span>
          <span class="info-value">${o.system||n("sysinfo.notAvailable")}</span>
        </div>
        <div class="info-item">
          <span class="info-label">${n("sysinfo.release")}</span>
          <span class="info-value">${o.release||n("sysinfo.notAvailable")}</span>
        </div>
        <div class="info-item">
          <span class="info-label">${n("sysinfo.version")}</span>
          <span class="info-value info-mono">${o.version||n("sysinfo.notAvailable")}</span>
        </div>
        <div class="info-item">
          <span class="info-label">${n("sysinfo.implementation")}</span>
          <span class="info-value">${o.implem||n("sysinfo.notAvailable")}</span>
        </div>
        <div class="info-item">
          <span class="info-label">${n("sysinfo.spiram")}</span>
          <span class="info-value ${o.spiram?"status-yes":"status-no"}">
            ${o.spiram?n("sysinfo.yes"):n("sysinfo.no")}
          </span>
        </div>
        <div class="info-item">
          <span class="info-label">${n("sysinfo.mpyVersion")}</span>
          <span class="info-value">${o.mpyver||n("sysinfo.notAvailable")}</span>
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
        ${e.partitions.map(o=>{let i;return Array.isArray(o)?i={type:o[0],subtype:o[1],offset:o[2],size:o[3],name:o[4]||"unknown",encrypted:o[5]}:i=o,html`
            <div class="partition-row">
              <span class="partition-name">
                ${getPartitionIcon(i.name)}
                ${i.name}
              </span>
              <span class="partition-type">${getPartitionType(i.type,i.subtype)}</span>
              <span class="partition-offset">0x${i.offset.toString(16)}</span>
              <span class="partition-size">${formatBytes$2(i.size)}</span>
            </div>
          `})}
      </div>
    </div>
  `}function getPartitionType(e,n){return{0:"APP",1:"DATA"}[e]||`Type ${e}`}function getPartitionIcon(e){if(!e)return"📦";const n=e.toLowerCase();return n.includes("ota")?"🔄":n.includes("nvs")?"💾":n.includes("www")?"🌐":n.includes("vfs")?"📁":n.includes("data")?"💿":n.includes("factory")?"🏭":"📦"}function formatBytes$2(e){return e?e<1024?e+" B":e<1024*1024?(e/1024).toFixed(1)+" KB":(e/(1024*1024)).toFixed(2)+" MB":"N/A"}function WiFiPanel(e,n){if(!e.networksInfo&&e.isConnected&&!e.isLoadingNetworks&&n("refresh-networks"),e.isConnected&&!e.networkInterfacesConfig&&!e.isLoadingNetworkInterfacesConfig&&n("load-network-interfaces-config"),!e.networksInfo)return html$1`
      <div class="panel-container">
        <div class="panel-header">
          <h2>WiFi Configuration</h2>
        </div>
        <div class="panel-loading">
          ${e.isConnected?"Loading WiFi information...":"Connect to device to view WiFi configuration"}
        </div>
      </div>
    `;const o=e.networksInfo,i=e.networkInterfacesConfig?.wifi===!1;return html$1`
    <div class="panel-container">
      <div class="panel-header">
        <h2>WiFi Configuration</h2>
      </div>
      
      ${WiFiSTASection(o.wifiSTA,n,i)}
      ${WiFiAPSection(o.wifiAP)}
    </div>
  `}function WiFiSTASection(e,n,o=!1){if(!e)return"";const i=o?"status-disabled":e.active?"status-active":"status-inactive",s=o?"Disabled":e.active?"Active":"Inactive";return html$1`
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
        ${e.rssi?html$1`
          <div class="info-item">
            <span class="info-label">Signal Strength:</span>
            <span class="info-value">${e.rssi} dBm</span>
          </div>
        `:""}
      </div>
      
      <div class="config-actions">
        <button class="secondary-button" onclick=${()=>n("navigate","system:firmware")}>
          ${t("firmware.changeWifi")}
        </button>
      </div>
    </div>
  `}function WiFiAPSection(e){return e?html$1`
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
        ${e.clients!==void 0?html$1`
          <div class="info-item">
            <span class="info-label">Connected Clients:</span>
            <span class="info-value">${e.clients}</span>
          </div>
        `:""}
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
    `;const o=e.networksInfo.eth,i=e.ethStatus,s=i&&i.initialized?i:o&&o.mac?o:i||o,r=e.ethConfig||{},l=o!==null,a=e.networkInterfacesConfig?.ethernet===!1,c=s&&(s.mac||s.enabled||s.enable||s.initialized),d=s&&s.ip&&s.ip!=="0.0.0.0",u=s&&s.linkup===!0,f=d;if(!l)return html`
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
    `;const p=a?"status-disabled":f?"status-active":u?"status-warning":"status-inactive",h=a?"Disabled":f?"Connected":u?"Link Up (No IP)":c?"No Link":"Not Initialized";return html`
    <div class="panel-container">
      <div class="panel-header">
        <h2>Ethernet Configuration</h2>
      </div>
      
      <div class="panel-section">
        <div class="section-header">
          <h3 class="panel-section-title">Ethernet PHY Interface</h3>
          <div class="status-badge ${p}">
            ${h}
          </div>
        </div>
        
        ${c?html`
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
              <span class="info-value ${u?"status-yes":"status-no"}">
                ${u?"Cable Connected":"No Cable"}
              </span>
            </div>
            ${d?html`
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
  `}function VPNPanel(e,n){e.isConnected&&!e.vpnConfigLoaded&&!e.isLoadingVpnConfig&&n("load-vpn-config");const o=e.vpnConfig||{hostname:"",join_code:"",auto_connect:!1},i=e.networksInfo?.vpn,s=e.isConnected,r=e.networksInfo&&i!==void 0;!r||i.available;const l=r&&i.active;return html`
    <div class="panel-container">
      <div class="panel-header">
        <h2>VPN Configuration</h2>
      </div>
      
      <!-- Module not available warning (only show when connected and confirmed unavailable) -->
      ${s&&r&&!i.available?html`
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
          <div class="status-badge ${l?"status-active":"status-inactive"}">
            ${l?"Connected":"Disconnected"}
          </div>
        </div>
        
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Status:</span>
            <span class="info-value ${l?"status-yes":"status-no"}">
              ${l?"Connected":"Not connected"}
            </span>
          </div>
          <div class="info-item">
            <span class="info-label">VPN IPv6 Address:</span>
            <span class="info-value info-mono">${l&&i?.ip?i.ip:"--"}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Hostname:</span>
            <span class="info-value">${i?.hostname||o.hostname||"--"}</span>
          </div>
        </div>
      </div>
      
      <!-- VPN Configuration Section -->
      <div class="panel-section">
        <div class="section-header">
          <h3 class="panel-section-title">Configuration</h3>
        </div>
        
        <form class="config-form" onsubmit=${a=>{a.preventDefault();const c=new FormData(a.target),d=c.get("hostname")||"",u=c.get("join_code")||"",f=c.get("auto_connect")==="on";if(!d.trim()){alert("Please enter a hostname for this device");return}if(!u.trim()){alert("Please enter a Husarnet join code");return}n("vpn-connect",{hostname:d.trim(),join_code:u.trim(),auto_connect:f})}}>
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
              ${l?"disabled":""}
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
              ${l?"disabled":""}
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
            ${l?html`
              <button 
                type="button" 
                class="secondary-button danger" 
                onclick=${()=>n("vpn-disconnect")}
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
                onclick=${a=>{a.preventDefault();const c=a.target.closest("form"),d=new FormData(c);n("vpn-save-config",{hostname:d.get("hostname")||"",join_code:d.get("join_code")||"",auto_connect:d.get("auto_connect")==="on",enabled:!1})}}
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
        
        ${l&&i?.peers&&i.peers.length>0?html`
          <div class="peers-list">
            ${i.peers.map(a=>html`
              <div class="peer-item">
                <div class="peer-hostname">${a.hostname}</div>
                <div class="peer-ip info-mono">${a.ip}</div>
              </div>
            `)}
          </div>
        `:html`
          <p class="info-description">
            ${l?"No other peers discovered yet. Add more devices to your Husarnet network to see them here.":"Connect to VPN to discover peers on your network."}
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
    `;const o=e.networksInfo.ble;return o?html`
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
    `;const i=e.wwanConfig||{},s=e.modemStatus||{},r=s.ppp||{};let l="Disabled",a="status-disabled";return i.mobile_data_enabled&&(r.connected?(l="Connected",a="status-connected"):r.connecting?(l="Connecting...",a="status-connecting"):s.connected?(l="Standby (WiFi OK)",a="status-standby"):(l="Waiting for modem...",a="status-waiting")),html`
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
                ${i.mobile_data_enabled?"checked":""}
                onchange=${c=>{c.target.checked?n("enable-mobile-data"):n("disable-mobile-data")}}
                disabled=${!e.isConnected}
              />
              <span class="toggle-slider"></span>
            </label>
            <span class="toggle-label">Enable Mobile Data</span>
          </div>
          
          <div class="status-row">
            <span class="status-label">Status:</span>
            <span class="status-value ${a}">${l}</span>
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
        
        <form class="config-form" onsubmit=${c=>{c.preventDefault();const d=new FormData(c.target),u={apn:d.get("apn")||"",username:d.get("username")||"",password:d.get("password")||"",auto_init_modem:d.get("auto_init_modem")==="on",mobile_data_enabled:i.mobile_data_enabled||!1};n("save-wwan-config",u)}}>
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
              value=${i.apn||""}
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
              value=${i.username||""}
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
              value=${i.password||""}
              placeholder="Optional"
            />
          </div>
          
          <div class="form-group">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                name="auto_init_modem" 
                ${i.auto_init_modem!==!1?"checked":""}
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
  `}function MQTTPanel(e,n){e.isConnected&&!e.mqttConfigLoaded&&!e.isLoadingMqttConfig&&n("load-mqtt-config");const o=e.mqttConfig||{};return html`
    <div class="panel-container">
      <div class="panel-header">
        <h2>MQTT Configuration</h2>
      </div>
      
      <div class="panel-section">
        <div class="section-header">
          <h3 class="panel-section-title">MQTT Broker Settings</h3>
        </div>
        
        <form class="config-form" onsubmit=${i=>{i.preventDefault();const s=new FormData(i.target),r={server:s.get("server")||"",port:parseInt(s.get("port")||"1883"),username:s.get("username")||"",password:s.get("password")||"",tls:s.get("tls")==="on",ca_cert_path:s.get("ca_cert_path")||"",topic_prefix:s.get("topic_prefix")||""};if(!r.server){alert("Server address is required");return}n("save-mqtt-config",r)}}>
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
            <button type="submit" class="primary-button" disabled=${!e.isConnected}>
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  `}function NTPPanel(e,n){e.isConnected&&!e.ntpConfigLoaded&&!e.isLoadingNtpConfig&&n("load-ntp-config");const o=e.ntpConfig||{server:"pool.ntp.org",tzOffset:0,timezone:"UTC",autoDetect:!1},i=e.ntpSyncResult||null,s=d=>{if(!d)return"--:--:--";const{year:u,month:f,day:p,hour:h,minute:m,second:w}=d;return`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(w).padStart(2,"0")}`},r=d=>{if(!d)return"";const{year:u,month:f,day:p}=d;return`${u}-${String(f).padStart(2,"0")}-${String(p).padStart(2,"0")}`},l=[{value:"UTC",offset:0,label:"UTC (Coordinated Universal Time)"},{value:"EST",offset:-5,label:"EST (Eastern Standard Time)"},{value:"CST",offset:-6,label:"CST (Central Standard Time)"},{value:"MST",offset:-7,label:"MST (Mountain Standard Time)"},{value:"PST",offset:-8,label:"PST (Pacific Standard Time)"},{value:"GMT",offset:0,label:"GMT (Greenwich Mean Time)"},{value:"CET",offset:1,label:"CET (Central European Time)"},{value:"EET",offset:2,label:"EET (Eastern European Time)"},{value:"JST",offset:9,label:"JST (Japan Standard Time)"},{value:"AEST",offset:10,label:"AEST (Australian Eastern Standard Time)"}],a=o.timezone,c=[...l];return a&&!l.find(d=>d.value===a)&&c.unshift({value:a,offset:o.tzOffset||0,label:`${a} (Detected)`}),html`
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
              ${i&&i.local?`${r(i.local)} ${s(i.local)}`:"--:--:--"}
            </span>
          </div>
          <div class="info-item">
            <span class="info-label">UTC Time:</span>
            <span class="info-value">
              ${i&&i.utc?`${r(i.utc)} ${s(i.utc)}`:"--:--:--"}
            </span>
          </div>
        </div>
        ${i?html`
          <p class="info-description" style="margin-top: 12px; font-size: 12px; color: var(--text-secondary);">
            Last synchronized: ${new Date(i.timestamp).toLocaleTimeString()}
          </p>
        `:""}
      </div>
      
      <div class="panel-section">
        <div class="section-header">
          <h3 class="panel-section-title">NTP Configuration</h3>
        </div>
        
        <form class="config-form" onsubmit=${async d=>{d.preventDefault();const u=new FormData(d.target),f=u.get("server")||"pool.ntp.org",p=u.get("timezone")||"UTC",h=u.get("auto_detect")==="on",m=c.find(S=>S.value===p),w=m?m.offset:0,y={server:f,tz_offset:w,timezone:p,auto_detect:h};try{await new Promise((S,$)=>{const C=setTimeout(()=>$(new Error("Save timeout")),1e4),_=()=>{clearTimeout(C),window.appInstance.emitter.removeListener("ntp-config-saved",x),window.appInstance.emitter.removeListener("ntp-config-save-error",b)},x=()=>{_(),S()},b=k=>{_(),$(k)};window.appInstance.emitter.once("ntp-config-saved",x),window.appInstance.emitter.once("ntp-config-save-error",b),n("save-ntp-config",y)}),n("sync-ntp-time",f,w,h)}catch(S){console.error("[NTP] Failed to save config before sync:",S),alert(`Failed to save NTP configuration: ${S.message}`)}}}>
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
              ${c.map(d=>html`
                <option value=${d.value} ${o.timezone===d.value?"selected":""}>
                  ${d.label}
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
          
          <div class="config-actions">
            <button type="submit" class="primary-button" disabled=${!e.isConnected}>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  `}const ARM_SECONDS=60;function TransmitLatch(e,n){const o=Math.ceil((e.txLatch.armedUntil-Date.now())/1e3),i=o>0;return html`
    <div class="panel-section">
      <div class="section-header">
        <h3 class="panel-section-title">Agent transmit</h3>
        <div class="status-badge ${i?"status-active":"status-inactive"}">
          ${i?`Armed, ${o} s left`:"Not armed"}
        </div>
      </div>
      <p>
        An agent can't transmit on this bus until you arm it, and the arm expires. Your own panels and
        scripts, and apps started at boot, aren't affected. This guards against accidents. It isn't a
        sandbox, since an agent's code runs on the same interpreter.
      </p>
      <div class="config-actions">
        ${i?html`<button class="secondary-button" onclick=${()=>n("tx-disarm")}>Disarm now</button>`:html`<button class="primary-button" disabled=${!e.isConnected} onclick=${()=>n("tx-arm",ARM_SECONDS)}>Arm for ${ARM_SECONDS} s</button>`}
      </div>
    </div>
  `}function CANPanel(e,n){e.isConnected&&!e.canConfigLoaded&&!e.isLoadingCanConfig&&n("load-can-config");const o=e.canConfig||{bitrate:5e5,enabled:!0};return html`
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
          
          <form class="config-form" onsubmit=${async i=>{i.preventDefault();const s=new FormData(i.target),r={bitrate:parseInt(s.get("bitrate")||"500000"),enabled:s.get("enabled")==="on",agentTxNeedsArm:s.get("agentTxNeedsArm")==="on"};n("save-can-config",r)}}>
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
            <label class="checkbox-label">
              <input type="checkbox" name="agentTxNeedsArm" ${o.agentTxNeedsArm?"checked":""} />
              <span>Agents need my arm to transmit</span>
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
      
      ${o.agentTxNeedsArm?TransmitLatch(e,n):""}

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
    </div>
  `}function GPSPanel(e,n){e.isConnected&&!e.gpsDataLoaded&&!e.isLoadingGpsData&&n("load-gps-data");const o=e.gpsData||{},i=o.latitude!==void 0&&o.longitude!==void 0,s=37.3349,r=-122.009,l=i?o.latitude:s,a=i?o.longitude:r;return html`
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
            <h3 class="panel-section-title">${i?"Current Location":"Map Display"}</h3>
            <div class="status-badge ${i?"status-active":"status-inactive"}">
              ${i?"GPS Fix Acquired":"No GPS Fix"}
            </div>
          </div>
          
          <!-- Map Container (always shown) -->
          <div class="gps-map-container">
            ${i?"":html`
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
              src=${`https://www.openstreetmap.org/export/embed.html?bbox=${a-.01},${l-.01},${a+.01},${l+.01}&layer=mapnik&marker=${l},${a}`}
            >
            </iframe>
            <br/>
            <small>
              <a 
                href=${`https://www.openstreetmap.org/?mlat=${l}&mlon=${a}&zoom=15`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Larger Map
              </a>
            </small>
          </div>
            
            <!-- GPS Information Grid -->
            <div class="info-grid" style="margin-top: 1rem;">
              ${i?html`
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
                  <span class="info-value info-mono" style="color: #999;">${l.toFixed(6)}° (default)</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Longitude:</span>
                  <span class="info-value info-mono" style="color: #999;">${a.toFixed(6)}° (default)</span>
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
                href=${`https://www.google.com/maps?q=${l},${a}`}
                target="_blank"
                rel="noopener noreferrer"
                class="primary-button"
                style="text-decoration: none; display: inline-block;"
              >
                Open in Google Maps
              </a>
            </div>
          </div>
          
          ${i?"":html`
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
      
    </div>
  `}function formatDate(e){if(!e||e.length!==6)return e;const n=e.substring(0,2),o=e.substring(2,4),i="20"+e.substring(4,6);return`${n}/${o}/${i}`}function formatTime(e){if(!e)return e;const n=e.indexOf("."),o=n!==-1?e.substring(0,n):e;if(o.length!==6)return e;const i=o.substring(0,2),s=o.substring(2,4),r=o.substring(4,6);return`${i}:${s}:${r}`}function ModemPanel(e,n){e.isConnected&&!e.modemStatusLoaded&&!e.isLoadingModemStatus&&n("load-modem-status");const o=e.modemStatus||{},i=o.info||{},s=o.signal||{},r=o.ppp||{},l=s.dbm,a=rssiToBars(l),c=rssiToQuality(l),d=getSignalColor(l);let u="Not detected",f="status-disconnected";return o.connected&&(r.connected?(u="PPP Active",f="status-ppp"):r.connecting?(u="PPP Connecting...",f="status-connecting"):(u="Connected (AT)",f="status-connected")),html`
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
          <span class="status-indicator ${f}"></span>
          <span class="status-text">${u}</span>
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
        ${o.connected?html`
          <div class="signal-display">
            <div class="signal-bars">
              ${[1,2,3,4,5].map(p=>html`
                <div class="signal-bar ${p<=a?"active":""}" style="--bar-color: ${d}"></div>
              `)}
            </div>
            <div class="signal-info">
              ${l!=null&&l!==-999?html`
                <span class="signal-dbm" style="color: ${d}">${l} dBm</span>
                <span class="signal-quality">${c}</span>
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
        ${o.connected&&Object.keys(i).length>0?html`
          <div class="info-grid">
            ${i.manufacturer?html`
              <div class="info-row">
                <span class="info-label">Manufacturer</span>
                <span class="info-value">${i.manufacturer}</span>
              </div>
            `:""}
            ${i.model?html`
              <div class="info-row">
                <span class="info-label">Model</span>
                <span class="info-value">${i.model}</span>
              </div>
            `:""}
            ${i.revision?html`
              <div class="info-row">
                <span class="info-label">Revision</span>
                <span class="info-value">${i.revision}</span>
              </div>
            `:""}
            ${i.imei?html`
              <div class="info-row">
                <span class="info-label">IMEI</span>
                <span class="info-value mono">${i.imei}</span>
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
  `}function rssiToBars(e){return e==null||e===-999?0:e>=-70?5:e>=-80?4:e>=-90?3:e>=-100?2:e>=-110?1:0}function rssiToQuality(e){return e==null||e===-999?"Unknown":e>=-70?"Excellent":e>=-80?"Good":e>=-90?"Fair":e>=-100?"Poor":"Very Poor"}function getSignalColor(e){return e==null||e===-999?"var(--text-secondary)":e>=-70||e>=-80?"#22c55e":e>=-90||e>=-100?"#f59e0b":"#ef4444"}function SDCardPanel(e,n){const o=e.boardConfig,i=o?.hardware?.sdcard,s=o?.sdmmc?.sdcard;return i&&e.isConnected&&!e.sdcardInfo&&!e.isLoadingSdcardInfo&&n("sdcard-get-info"),e.isConnected?i?html`
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
      
      ${BoardSDCardHardwareSection(i,s)}
      
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
                    <span class="partition-size">${formatBytes$1(e.sdcardInfo.cardCapacity)}</span>
                  </div>
                `:""}
                <div class="partition-row">
                  <span class="partition-name">📁 /sd</span>
                  <span class="partition-type">FAT32</span>
                  <span class="partition-size">${formatBytes$1(e.sdcardInfo.totalSize)}</span>
                </div>
                <div class="partition-row" style="padding-left: 32px;">
                  <span class="partition-name">Used</span>
                  <span class="partition-type"></span>
                  <span class="partition-size">${formatBytes$1(e.sdcardInfo.usedSize)}</span>
                </div>
                <div class="partition-row" style="padding-left: 32px;">
                  <span class="partition-name">Free</span>
                  <span class="partition-type"></span>
                  <span class="partition-size">${formatBytes$1(e.sdcardInfo.freeSize)}</span>
                </div>
                ${e.sdcardInfo.cardCapacity&&e.sdcardInfo.cardCapacity>e.sdcardInfo.totalSize?html`
                  <div class="partition-row" style="color: var(--text-secondary); opacity: 0.7;">
                    <span class="partition-name">⚠️ Unallocated</span>
                    <span class="partition-type">—</span>
                    <span class="partition-size">${formatBytes$1(e.sdcardInfo.cardCapacity-e.sdcardInfo.totalSize)}</span>
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
    `}function BoardSDCardHardwareSection(e,n){if(!e)return"";const o=n||{},i=e.power_control||{},s=e.mode||"SD";let r=e.bus_width||1;e.bus_width||(o.d3!==void 0?r=4:o.d0!==void 0?r=1:s==="SD"&&(r=4));const l=s==="SD"?"SDMMC":s;return html`
    <div class="panel-section">
      <div class="section-header">
        <h3 class="panel-section-title">Board Hardware Configuration</h3>
      </div>
      
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">Mode:</span>
          <span class="info-value">${l}</span>
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
            ${o.cmd!==void 0?html`
              <div class="info-item">
                <span class="info-label">CMD:</span>
                <span class="info-value info-mono">GPIO ${o.cmd}</span>
              </div>
            `:""}
            ${o.clk!==void 0?html`
              <div class="info-item">
                <span class="info-label">CLK:</span>
                <span class="info-value info-mono">GPIO ${o.clk}</span>
              </div>
            `:""}
            ${o.d0!==void 0?html`
              <div class="info-item">
                <span class="info-label">D0:</span>
                <span class="info-value info-mono">GPIO ${o.d0}</span>
              </div>
            `:""}
            ${o.d1!==void 0?html`
              <div class="info-item">
                <span class="info-label">D1:</span>
                <span class="info-value info-mono">GPIO ${o.d1}</span>
              </div>
            `:""}
            ${o.d2!==void 0?html`
              <div class="info-item">
                <span class="info-label">D2:</span>
                <span class="info-value info-mono">GPIO ${o.d2}</span>
              </div>
            `:""}
            ${o.d3!==void 0?html`
              <div class="info-item">
                <span class="info-label">D3:</span>
                <span class="info-value info-mono">GPIO ${o.d3}</span>
              </div>
            `:""}
            ${i.pin!==void 0?html`
              <div class="info-item">
                <span class="info-label">Power:</span>
                <span class="info-value info-mono">GPIO ${i.pin} ${i.active_low?"(Active Low)":"(Active High)"}</span>
              </div>
            `:""}
          </div>
        </details>
      </div>
    </div>
  `}function formatBytes$1(e){if(!e||e===0)return"0 B";const n=1024,o=["B","KB","MB","GB"],i=Math.floor(Math.log(e)/Math.log(n));return Math.round(e/Math.pow(n,i)*100)/100+" "+o[i]}const PARTITION_TABLE_OFFSET=32768,PARTITION_TABLE_SIZE$1=3072,PARTITION_MAGIC=20650,SECTOR=4096;function readPartitionTable(e){const n=new DataView(e.buffer,e.byteOffset,e.byteLength),o=[];for(let i=0;i+32<=e.length&&n.getUint16(i,!0)===PARTITION_MAGIC;i+=32){const s=e.subarray(i+12,i+28),r=s.indexOf(0);o.push({label:new TextDecoder().decode(r<0?s:s.subarray(0,r)),type:e[i+2],subtype:e[i+3],offset:n.getUint32(i+4,!0),size:n.getUint32(i+8,!0),flags:n.getUint32(i+28,!0)})}return o}function fullInstallPieces(e){const n=e instanceof Uint8Array?e:new Uint8Array(e),i=readPartitionTable(n.subarray(PARTITION_TABLE_OFFSET,PARTITION_TABLE_OFFSET+PARTITION_TABLE_SIZE$1)).find(l=>l.label==="nvs_factory");if(!i)throw new Error("This image has no nvs_factory partition, so it is not for the current flash layout");if(i.offset%SECTOR||i.size%SECTOR)throw new Error("nvs_factory does not start and end on a flash sector");const s=i.offset+i.size;return{pieces:[{address:0,data:n.subarray(0,i.offset)},{address:s,data:n.subarray(s)}].filter(l=>l.data.length),kept:{offset:i.offset,size:i.size}}}async function writeFullInstall(e,n,o={}){const{onProgress:i=()=>{},onLog:s=console.log}=o,{pieces:r,kept:l}=fullInstallPieces(n),a=u=>"0x"+u.toString(16).toUpperCase();s(`Keeping nvs_factory (${a(l.offset)}, ${l.size/1024} KB): the board's factory data`);const c=r.reduce((u,f)=>u+f.data.length,0);let d=0;for(const{address:u,data:f}of r)s(`Writing ${a(u)} to ${a(u+f.length)}`),await e.flashData(f.slice().buffer,p=>i(d+p,c),u,!0),d+=f.length}const hubRetry={waits:[500,1500,4e3]};async function hubFetch(e,n,o=hubRetry.waits){for(let i=0;;i++){let s=null,r=null;try{s=await fetch(e,n)}catch(l){r=l}if(s&&s.status<500&&s.status!==429)return s;if(i>=o.length){if(r)throw new Error(`ScriptoHub can't be reached (${r.message})`);return s}await new Promise(l=>setTimeout(l,o[i]))}}const RELEASE_KEYS={"release-2026-11":"cee7fcecdb407ffb92f714cb91d91fda3a942fa4eee65f85b910bae79e31fd70"},MANIFEST_HEADER="scriptohub-release 1",SHA256=/^[a-f0-9]{64}$/,PARTITION_TABLE="partition-table",PARTITION_TABLE_SIZE=3072;function hexBytes(e){const n=new Uint8Array(e.length/2);for(let o=0;o<n.length;o++)n[o]=parseInt(e.substr(o*2,2),16);return n}function base64Bytes(e){const n=atob(e),o=new Uint8Array(n.length);for(let i=0;i<n.length;i++)o[i]=n.charCodeAt(i);return o}async function sha256Hex(e){const n=new Uint8Array(await crypto.subtle.digest("SHA-256",e));return Array.from(n,o=>o.toString(16).padStart(2,"0")).join("")}function whole(e,n){if(!/^\d+$/.test(e))throw new Error(`The release manifest has a bad ${n}: ${e}`);return Number(e)}function parseReleaseManifest(e){if(!e.endsWith(`
`))throw new Error("The release manifest is cut short");const n=e.slice(0,-1).split(`
`);if(n[0]!==MANIFEST_HEADER)throw new Error("This is not a release manifest");const o={platform:null,firmwareBuild:null,images:{},install:[],files:[],manifests:[]};for(const i of n.slice(1)){const s=i.split(" ");if(s[0]==="platform"&&s.length===2)o.platform=s[1];else if(s[0]==="firmware-build"&&s.length===2)o.firmwareBuild=s[1];else if(s[0]==="image"&&s.length===4&&SHA256.test(s[2]))o.images[s[1]]={sha256:s[2],size:whole(s[3],"size")};else if(s[0]==="install"&&s.length===6&&SHA256.test(s[4]))o.install.push({variant:s[1],role:s[2],offset:whole(s[3],"offset"),sha256:s[4],size:whole(s[5],"size")});else if(s[0]==="file"&&s[1]==="manifest"&&s.length===5&&SHA256.test(s[2])&&s[4].endsWith(".json"))o.manifests.push({id:s[4].slice(0,-5),sha256:s[2],size:whole(s[3],"size")});else if(s[0]==="file"&&s[1]==="botiq"&&s.length>=5&&SHA256.test(s[2]))o.files.push({path:s.slice(4).join(" "),sha256:s[2],size:whole(s[3],"size")});else throw new Error(`The release manifest has a line Studio doesn't know: ${i.slice(0,80)}`)}if(!o.platform||!o.firmwareBuild)throw new Error("The release manifest names no platform or firmware build");return o}async function verifyRelease(e,n=RELEASE_KEYS){const o=e?.manifest;if(typeof o!="string")throw new Error("The release has no manifest");const i=new TextEncoder().encode(o);for(const{keyId:r,sig:l}of e.signatures||[]){if(!n[r])continue;const a=await crypto.subtle.importKey("raw",hexBytes(n[r]),{name:"Ed25519"},!1,["verify"]);if(await crypto.subtle.verify({name:"Ed25519"},a,base64Bytes(l),i))return{...parseReleaseManifest(o),keyId:r}}const s=(e.signatures||[]).map(r=>r.keyId).join(", ")||"no one";throw new Error(`This release isn't signed by a key Studio trusts (signed by ${s})`)}async function fetchLatestRelease(e,n,o){const i=await hubFetch(`${e}/api/v1/platform/latest?variant=${n}&major=${o}`,{cache:"no-cache"});if(i.status===404)throw new Error(`No ${o}.x release for ${n} yet`);if(!i.ok)throw new Error(`ScriptoHub answered ${i.status}`);return i.json()}function installParts(e,n){const o=e.install.filter(i=>i.variant===n).sort((i,s)=>i.offset-s.offset);if(!o.length)throw new Error(`Release ${e.platform} can't be installed from scratch on ${n}`);for(const i of["app",PARTITION_TABLE,"filesystem"])if(!o.some(s=>s.role===i))throw new Error(`Release ${e.platform} has no ${i} for ${n}`);return o}async function downloadFile(e,n,o=()=>{}){const i=await hubFetch(`${e}/api/v1/files/${n.sha256}`);if(!i.ok)throw new Error(`ScriptoHub answered ${i.status} for a release file`);const s=new Uint8Array(n.size);let r=0;if(i.body){const l=i.body.getReader();for(;;){const{done:a,value:c}=await l.read();if(a)break;if(r+c.length>n.size)throw new Error("A release file is longer than the release says");s.set(c,r),r+=c.length,o(r)}}else{const l=new Uint8Array(await i.arrayBuffer());if(l.length>n.size)throw new Error("A release file is longer than the release says");s.set(l),r=l.length,o(r)}if(r!==n.size||await sha256Hex(s)!==n.sha256)throw new Error("A release file does not match its sha256, so nothing was written");return s}function assembleInstallImage(e){const n=e.find(c=>c.role===PARTITION_TABLE);if(!n)throw new Error("The release has no partition table");const o=readPartitionTable(n.data.subarray(0,PARTITION_TABLE_SIZE));if(!o.length)throw new Error("The release's partition table is empty");const i=Math.max(...o.map(c=>c.offset+c.size)),s=new Uint8Array(i).fill(255),r=[...e].sort((c,d)=>c.offset-d.offset);let l=0;for(const c of r){if(c.offset<l)throw new Error(`The release's ${c.role} overlaps the part before it`);if(l=c.offset+c.data.length,l>i)throw new Error(`The release's ${c.role} runs past the end of the flash layout`);s.set(c.data,c.offset)}const a=r.find(c=>c.role==="filesystem");if(a){const c=o.find(d=>d.offset===a.offset);if(!c||a.data.length>c.size)throw new Error("The release's filesystem image doesn't fit its partition")}return s}function manifestChunks(e,n=1200){if(/['\\]/.test(e)||/[^\x20-\x7e\n]/.test(e))throw new Error("The release manifest holds characters a manifest never has");const o=[];let i="";for(const s of e.split(`
`).slice(0,-1)){const r=`${s}\\n`;i&&i.length+r.length>n&&(o.push(i),i=""),i+=r}return i&&o.push(i),o}const PLATFORM_MAJOR=2,ANY_VARIANT="ESP32_S3_16";let hub="https://cheerful-stoat-894.convex.site",chosen=null;function useHub(e){e&&e!==hub&&(hub=e.replace(/\/+$/,""),chosen=null)}async function newestRelease(e){const n=await fetchLatestRelease(hub,e,PLATFORM_MAJOR);return{release:n,signed:await verifyRelease(n)}}const CHIP_VARIANT_MAP={"ESP32-S3":{base:"ESP32_S3_8",variants:["ESP32_S3_8","ESP32_S3_8_OCT","ESP32_S3_16","ESP32_S3_32"]},"ESP32-P4":{base:"ESP32_P4_16",variants:["ESP32_P4_16","ESP32_P4_32"]}},S3_PSRAM_CAPACITY={1:"8MB",2:"2MB",3:"16MB",4:"4MB"},S3_PSRAM_VENDOR={1:"AP Memory 3.3V",2:"AP Memory 1.8V"},S3_PSRAM_MODE={"2MB":"quad","8MB":"octal","16MB":"octal"};function decodeS3Psram(e,n){const o=(n>>19&1)<<2|e>>3&3;if(o===0)return null;const i=S3_PSRAM_CAPACITY[o]||"Unknown",s=S3_PSRAM_VENDOR[e>>7&3]||"";return{capacity:i,vendor:s,mode:S3_PSRAM_MODE[i]||null,display:`Embedded PSRAM ${i}${s?` (${s})`:""}`}}async function selectFirmwareVariant(e,n=0,o=null){const i=CHIP_VARIANT_MAP[e];if(!i)return console.warn(`[firmware-flasher] No firmware mapping for chip: ${e}`),null;const s=typeof n=="string"?parseInt(n):n;let r=i.base;e==="ESP32-S3"?o==="quad"?r="ESP32_S3_8":s>=32?r="ESP32_S3_32":s>=16?r="ESP32_S3_16":o==="octal"&&(r="ESP32_S3_8_OCT"):e==="ESP32-P4"&&s>=32&&(r="ESP32_P4_32"),chosen=await newestRelease(r);const{release:l,signed:a}=chosen,c=installParts(a,r);return{id:r,displayName:r.replace(/_/g," "),flash:`${r.match(/_(\d+)(_|$)/)[1]}MB`,platformVersion:l.version,firmwareBuild:l.firmwareBuild,size:c.reduce((d,u)=>d+u.size,0),parts:c}}async function fetchBoardManifests(e=null){const{release:n,signed:o}=chosen||await newestRelease(ANY_VARIANT),i=new Set(o.manifests.map(r=>r.id));let s=(n.manifests||[]).filter(r=>r.listed&&i.has(r.id));return e&&(s=s.filter(r=>r.chip===e)),s.map(({id:r,name:l,chip:a,vendor:c,description:d})=>({id:r,name:l,chip:a,vendor:c,description:d}))}async function fetchBoardManifest(e,{newest:n=!1}={}){const{signed:o}=!n&&chosen||await newestRelease(ANY_VARIANT),i=o.manifests.find(r=>r.id===e);if(!i)throw new Error(`Release ${o.platform} has no manifest for ${e}`);const s=JSON.parse(new TextDecoder().decode(await downloadFile(hub,i)));if(s?.identity?.id!==e)throw new Error(`The manifest for ${e} names another board`);return s}function releaseManifest(){if(!chosen)throw new Error("No release has been chosen");return chosen.release.manifest}async function downloadFirmware(e,n=()=>{}){const o=e.size;let i=0;const s=[];for(const r of e.parts){const l=await downloadFile(hub,r,a=>n(Math.round((i+a)/o*100)));s.push({role:r.role,offset:r.offset,data:l}),i+=r.size}return console.log(`[firmware-flasher] Downloaded ${(o/1024/1024).toFixed(1)} MB in ${s.length} parts`),n(100),assembleInstallImage(s).buffer}function showStyledModal({variant:e="",icon:n,title:o,subtitle:i,body:s,buttons:r}){const l=a=>a?a.includes("<")||/[\u{1F300}-\u{1F9FF}]/u.test(a)?a:`<svg class="icon icon-tabler" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><use href="#tabler-${a}"></use></svg>`:"";return new Promise(a=>{const c=document.createElement("div");c.className="fw-modal-overlay active",c.innerHTML=`
      <div class="fw-styled-modal">
        <div class="fw-styled-modal-header ${e?`fw-styled-modal-header--${e}`:""}">
          <div class="fw-styled-modal-icon">${l(n)}</div>
          <h2>${o}</h2>
          <p>${i}</p>
        </div>
        <div class="fw-styled-modal-content">
          <div class="fw-styled-modal-card">${s}</div>
          ${r.map(d=>`<button class="${d.class}" data-id="${d.id}">${d.icon||""}${d.label}</button>`).join("")}
        </div>
      </div>`,document.body.appendChild(c),r.forEach(d=>{c.querySelector(`[data-id="${d.id}"]`).addEventListener("click",()=>{c.remove(),a(d.id)})})})}function updateModalBody(e){const n=document.querySelector(".fw-styled-modal-card");n&&(n.innerHTML=e)}function closeStyledModal(){const e=document.querySelector(".fw-modal-overlay.active");e&&e.remove()}const UNDER_WAY=["starting","checking","downloading","verifying","installing","restarting","trial"],PAST_THE_SWITCH=["installing","restarting","trial"],CANCELLABLE=["starting","checking","downloading","verifying"],VERSION=/^v?(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+[0-9A-Za-z.-]+)?$/,PARTIAL=/^v?(\d+|[xX*])(?:\.(\d+|[xX*])(?:\.(\d+|[xX*])(?:-([0-9A-Za-z.-]+))?(?:\+[0-9A-Za-z.-]+)?)?)?$/,OPERATOR=/^(<=|>=|<|>|=|~>|~|\^)?(.*)$/;function parseVersion(e){const n=VERSION.exec(String(e??"").trim());return n?{major:+n[1],minor:+n[2],patch:+n[3],pre:n[4]?n[4].split("."):[]}:null}function comparePre(e,n){if(!e.length||!n.length)return Math.sign(n.length-e.length);for(let o=0;o<Math.max(e.length,n.length);o++){if(o>=e.length)return-1;if(o>=n.length)return 1;const i=e[o],s=n[o],r=/^\d+$/.test(i),l=/^\d+$/.test(s);if(r&&l){if(+i!=+s)return Math.sign(+i-+s)}else{if(r!==l)return r?-1:1;if(i!==s)return i<s?-1:1}}return 0}function compareVersions(e,n){const o=typeof e=="string"?parseVersion(e):e,i=typeof n=="string"?parseVersion(n):n;return Math.sign(o.major-i.major)||Math.sign(o.minor-i.minor)||Math.sign(o.patch-i.patch)||comparePre(o.pre,i.pre)}const isWild=e=>e===void 0||e==="x"||e==="X"||e==="*";function v(e,n,o,i=[]){return{major:e,minor:n,patch:o,pre:i}}const FLOOR=["0"];function desugar(e){const[,n="",o]=OPERATOR.exec(e),i=partial(o);if(!i)return null;const{major:s,minor:r,patch:l,pre:a}=i;if(s===null)return n==="<"||n===">"?[["<",v(0,0,0,FLOOR)]]:[];const c=r!==null&&l!==null;if(n==="~"||n==="~>"){const f=v(s,r??0,l??0,c?a:[]),p=r===null?v(s+1,0,0,FLOOR):v(s,r+1,0,FLOOR);return[[">=",f],["<",p]]}if(n==="^"){const f=!c||s===0&&!a.length,p=v(s,r??0,l??0,a.length?a:f?FLOOR:[]);let h;return r===null||s>0?h=v(s+1,0,0,FLOOR):l===null||r>0?h=v(0,r+1,0,FLOOR):h=v(0,0,l+1,FLOOR),[[">=",p],["<",h]]}if(c)return[[n||"=",v(s,r,l,a)]];const d=r===null?v(s+1,0,0,FLOOR):v(s,r+1,0,FLOOR),u=v(s,r??0,0,FLOOR);switch(n){case">":return[[">=",d]];case">=":return[[">=",u]];case"<":return[["<",u]];case"<=":return[["<",d]];default:return[[">=",u],["<",d]]}}function partial(e){const n=PARTIAL.exec(e);if(!n)return null;const[o,i,s]=[n[1],n[2],n[3]].map(r=>isWild(r)?null:+r);return{major:o,minor:i,patch:s,pre:n[4]?n[4].split("."):[]}}function desugarHyphen(e,n){const o=partial(e),i=partial(n);if(!o||!i)return null;const s=[];if(o.major!==null){const r=o.minor!==null&&o.patch!==null&&o.pre.length;s.push([">=",v(o.major,o.minor??0,o.patch??0,r?o.pre:FLOOR)])}return i.major!==null&&(i.minor===null?s.push(["<",v(i.major+1,0,0,FLOOR)]):i.patch===null?s.push(["<",v(i.major,i.minor+1,0,FLOOR)]):i.pre.length?s.push(["<=",v(i.major,i.minor,i.patch,i.pre)]):s.push(["<",v(i.major,i.minor,i.patch+1,FLOOR)])),s}const TESTS={"=":e=>e===0,"<":e=>e<0,"<=":e=>e<=0,">":e=>e>0,">=":e=>e>=0};function satisfies(e,n){const o=parseVersion(e);return!o||typeof n!="string"?!1:n.split("||").some(i=>{const s=i.trim().replace(/(<=|>=|<|>|=|~>|~|\^)\s+/g,"$1"),r=/^(\S+)\s+-\s+(\S+)$/.exec(s);let l;if(r)l=desugarHyphen(r[1],r[2]);else{l=[];for(const a of s.split(/\s+/).filter(Boolean)){const c=desugar(a);if(!c)return!1;l.push(...c)}}return!!l&&l.every(([a,c])=>TESTS[a](compareVersions(o,c)))})}function appProblems(e,n){if(!e)return[];const o=[];e.botiq&&!satisfies(n.botiq,e.botiq)&&o.push({kind:"botiq",range:e.botiq});const i=(e.modules||[]).filter(s=>!(n.modules||[]).includes(s));return i.length&&o.push({kind:"modules",modules:i}),o}function failureReason(e){const n=String(e||"").trim().split(`
`);return n[n.length-1].trim().replace(/^ValueError: /,"")}function isNoRelease(e){return/^ScriptoHub has no \S+ release for /.test(e)}function splitRefusal(e){const n=e.indexOf(": ");return n===-1?{app:"",why:e}:{app:e.slice(0,n),why:e.slice(n+2)}}function startRefusal(e){const n=failureReason(e);return n.startsWith("not now: ")?{refusals:n.slice(9).split("; ").map(splitRefusal),why:null}:{refusals:[],why:n}}function noticeKind(e){return!e||!e.newer?"upToDate":e.firmware==="needs USB"?"needsUsb":e.firmware==="same"?"framework":"firmware"}function isUnderWay(e){return!!e&&UNDER_WAY.includes(e.state)}function canCancel(e){return!!e&&CANCELLABLE.includes(e.state)}function track(e,n){return{...e,version:e.version||n.version||null,moved:e.moved||PAST_THE_SWITCH.includes(n.state)}}function outcomeOf(e,n){if(!e||isUnderWay(e))return null;const o=e.last||null,i=JSON.stringify(o)!==n.before;return o&&(i||n.moved)?{result:o.result,version:o.version||n.version,why:o.why||null}:e.state==="failed"?{result:"error",version:e.version||n.version,why:failureReason(e.error)}:e.state==="cancelled"?{result:"cancelled",version:e.version||n.version,why:null}:null}function formatBytes(e){return e>=1e6?`${(e/1e6).toFixed(1)} MB`:e>=1e3?`${Math.round(e/1e3)} KB`:`${e} B`}const CHECK_TIMEOUT_MS=6e4,POLL_MS=2e3;function blank(e=null){return{port:e,board:null,checking:!1,installed:null,found:null,noRelease:!1,notOffered:null,heldBack:[],appsUnknown:null,refused:null,note:null,following:null,outcome:null}}async function fetchJson(e){const n=await hubFetch(e);if(n.status===404||n.status===410)return null;if(!n.ok)throw new Error(`ScriptoHub answered ${n.status}`);return n.json()}async function appsRequires(e,n){const o=await fetchJson(`${n}/api/v1/extensions`),i=new Map((o?.extensions||[]).map(r=>[r.id,r.requires])),s=[];for(const r of e){const a=[(r.version?await fetchJson(`${n}/api/v1/skills/${encodeURIComponent(r.id)}/versions/${encodeURIComponent(r.version)}`):null)?.version?.requires,i.get(r.id)].filter(Boolean);a.length&&s.push({app:r,needs:a})}return s}async function appsHeldBack(e,n,o){const i=await appsRequires(await e.appsList(),o);if(!i.length)return[];const{hub:s}=await e.exec(`import json
from lib.sys import update
print(json.dumps({"hub": update.hub()}))`),r=await fetchJson(`${s}/api/v1/platform/${encodeURIComponent(n.available)}?variant=${encodeURIComponent(n.variant)}`);if(!r)throw new Error(`ScriptoHub has no ${n.available} for ${n.variant}`);const l=(r.images||[]).find(c=>c.variant===n.variant),a={botiq:n.available,modules:l?.modules||[]};return i.map(({app:c,needs:d})=>({app:c.name||c.id,problems:d.flatMap(u=>appProblems(u,a))})).filter(c=>c.problems.length)}function createPlatformUpdate({pu:e,device:n,render:o,ask:i,appsHub:s,isConnected:r,pollMs:l=POLL_MS}){let a=0,c=null;async function d(){const{text:x,isError:b}=await n.callTool("update_status",{});if(b)throw new Error(failureReason(x));return JSON.parse(x)}function u(){clearInterval(c),c=null}function f(){c||(c=setInterval(async()=>{if(!e.following)return u();if(r())try{p(await d())}catch(x){console.debug("[Update] status:",x.message)}},l))}function p(x){if(!x)return;if(e.installed=x.installed??e.installed,!e.following){if(!isUnderWay(x))return;e.following={version:x.version||null,before:JSON.stringify(x.last||null),moved:!1},e.refused=null,f()}e.following={...track(e.following,x),status:x};const b=outcomeOf(x,e.following);b&&(e.outcome=b,e.following=null,e.note=null,u(),h().then(o)),o()}async function h(){try{const{text:x,isError:b}=await n.callTool("device_info",{});if(b)return;const k=JSON.parse(x);e.board={...k.platform,micropython:k.micropython},e.installed=k.platform?.release??e.installed}catch(x){console.warn("[Update] Could not read device_info:",x.message)}}async function m(){const x=++a;if(Object.assign(e,{checking:!0,found:null,noRelease:!1,notOffered:null,heldBack:[],appsUnknown:null,refused:null,note:null}),o(),await h(),x===a){o();try{const{text:b,isError:k}=await n.callTool("update_check",{},CHECK_TIMEOUT_MS);if(x!==a)return;k?isNoRelease(failureReason(b))?e.noRelease=!0:e.notOffered=failureReason(b):e.found=JSON.parse(b);const F=e.found;if(F?.newer&&F.firmware!=="needs USB")try{const A=await appsHeldBack(n,F,s());x===a&&(e.heldBack=A)}catch(A){x===a&&(e.appsUnknown=A.message)}}catch(b){x===a&&(e.notOffered=b.message)}x===a&&(e.checking=!1,o())}}async function w(){if(!r())return;let x=null;try{x=await d()}catch(b){console.warn("[Update] Could not read the board's update status:",b.message)}if(e.following||isUnderWay(x)){p(x),e.following&&f();return}x&&(e.installed=x.installed),e.outcome||await m()}async function y(){const x=e.found;if(!(!x||e.following||!await i(x.available))){e.refused=null,e.note=null;try{const b=JSON.stringify((await d()).last||null),{text:k,isError:F}=await n.callTool("update_start",{version:x.available});if(F){e.refused=startRefusal(k),o();return}e.following={version:x.available,before:b,moved:!1},p(JSON.parse(k)),f()}catch(b){e.refused={refusals:[],why:b.message},o()}}}async function S(){try{const{text:x,isError:b}=await n.callTool("update_cancel",{});b?e.note=failureReason(x):p(JSON.parse(x))}catch(x){e.note=x.message}o()}function $(x){return e.port!==x&&(u(),Object.assign(e,blank(x))),w()}function C(){e.following||(u(),Object.assign(e,blank(e.port)))}function _(){return e.outcome=null,m()}return{apply:p,check:m,resume:w,start:y,cancel:S,connected:$,disconnected:C,dismiss:_,stop:u}}const OUTCOMES={installed:"installed","put back":"putBack",failed:"failed",cancelled:"cancelled",error:"error"};function hostOf$1(e){try{return new URL(e).hostname}catch{return""}}function appName(e,n){return e.deviceApps?.[n]?.name||n}function Facts(e){const n=t("platformUpdate.notRecorded"),o=(e.micropython||"").split("; ").pop(),i=[[t("platformUpdate.variant"),e.variant||n],[t("platformUpdate.release"),e.release||n],[t("platformUpdate.botiq"),e.release||n],[t("platformUpdate.firmwareBuild"),e.firmware_build||o||n],[t("platformUpdate.appSlots"),e.app_slots===1?t("platformUpdate.oneSlot"):t("platformUpdate.twoSlots",{slot:e.running_slot||""})]];return html$1`
    <div class="fw-board-facts">
      ${i.map(([s,r])=>html$1`
        <div class="fw-board-fact">
          <span class="fw-board-label">${s}</span>
          <span class="fw-board-value">${r}</span>
        </div>
      `)}
    </div>
  `}function Warn(e){return html$1`<p class="fw-update-warn">${e}</p>`}function Button(e,n,o=!1,i=!1){return html$1`<button class="fw-update-button ${o?"primary":""}" disabled=${i} onclick=${n}>${e}</button>`}function Card(e,n,o,i){return html$1`
    <div class="fw-update ${e}">
      <div class="fw-update-title">${n}</div>
      ${o}
      ${i?html$1`<div class="fw-update-actions">${i}</div>`:""}
    </div>
  `}function Available(e,n){const o=e.platformUpdate,i=o.found,s=noticeKind(i),r=i.available,l=[...(i.refusals||[]).map(splitRefusal),...o.refused?.refusals||[]],a=s==="needsUsb"||l.length||o.heldBack.length||o.appsUnknown||o.refused,c=s==="framework"?t("platformUpdate.frameworkDetail"):s==="firmware"?t("platformUpdate.firmwareDetail",{size:formatBytes(i.image_bytes)}):t("platformUpdate.needsUsb");return Card("available",t(s==="framework"?"platformUpdate.frameworkAvailable":"platformUpdate.firmwareAvailable",{version:r}),html$1`
      <p>${c}</p>
      ${o.heldBack.map(d=>d.problems.map(u=>Warn(u.kind==="botiq"?t("platformUpdate.heldBackBotiq",{app:d.app,range:u.range,version:r}):t("platformUpdate.heldBackModules",{app:d.app,modules:u.modules.join(", "),version:r}))))}
      ${o.appsUnknown?Warn(t("platformUpdate.appsUnknown",{why:o.appsUnknown})):""}
      ${l.map(({app:d,why:u})=>Warn(t("platformUpdate.notNow",{app:appName(e,d),why:u})))}
      ${o.refused?.why?Warn(t("platformUpdate.startRefused",{why:o.refused.why})):""}
    `,s==="needsUsb"?"":a?Button(t("platformUpdate.checkAgain"),()=>n("platform-update-check"),!1,o.checking):Button(t("platformUpdate.update"),()=>n("platform-update-start"),!0,o.checking))}function progressLine(e,n){switch(e.state){case"downloading":return t(e.step==="firmware"?"platformUpdate.downloadingFirmware":"platformUpdate.downloadingFiles",{done:formatBytes(e.done||0),total:formatBytes(e.total||0)});case"verifying":return t("platformUpdate.verifying");case"installing":return t("platformUpdate.installing");case"restarting":return t("platformUpdate.restarting",{version:n});case"trial":return t("platformUpdate.trial",{version:n});default:return t("platformUpdate.preparing",{version:n})}}function Following(e,n){const o=e.platformUpdate,i=o.following.status||{},s=o.following.version||i.version||"",r=t("platformUpdate.updatingTo",{version:s});if(!e.isConnected)return Card("",r,html$1`<p>${t(e.isReconnecting?"platformUpdate.restarting":"platformUpdate.lost",{version:s})}</p>`);const l=i.state==="downloading"&&i.total?Math.min(100,Math.round(100*(i.done||0)/i.total)):null;return Card("",r,html$1`
      <p>${progressLine(i,s)}</p>
      ${l!==null?html$1`<div class="fw-update-bar"><div style="width: ${l}%"></div></div>`:""}
      ${(i.waiting||[]).map(a=>{const{app:c,why:d}=splitRefusal(a);return Warn(t("platformUpdate.waiting",{app:appName(e,c),why:d}))})}
      ${o.note?Warn(o.note):""}
    `,canCancel(i)?Button(t("platformUpdate.cancel"),()=>n("platform-update-cancel")):"")}function Outcome(e,n){const{result:o,version:i,why:s}=e.platformUpdate.outcome,r=OUTCOMES[o]||"error";return Card(r==="installed"?"done":"",t(`platformUpdate.${r}`,{version:i||"",why:s||o}),"",Button(t("platformUpdate.ok"),()=>n("platform-update-dismiss")))}function UpdateCard(e,n){const o=e.platformUpdate;if(o.following)return Following(e,n);if(o.outcome)return Outcome(e,n);if(o.found?.newer)return Available(e,n);const i=Button(t("platformUpdate.checkAgain"),()=>n("platform-update-check"));return o.checking?Card("",t("platformUpdate.checking"),""):o.notOffered?Card("",t("platformUpdate.notOffered"),html$1`<p>${o.notOffered}</p>`,i):o.noRelease?Card("",t("platformUpdate.upToDate"),html$1`<p>${t("platformUpdate.noNewerRelease",{variant:o.board?.variant||""})}</p>`,i):o.found?Card("",t("platformUpdate.upToDate"),html$1`<p>${t("platformUpdate.newest",{version:o.found.installed||o.found.available})}</p>`,i):Card("",t("platformUpdate.notChecked"),"",i)}function ThisBoard(e,n){const o=e.platformUpdate;return html$1`
    <div class="fw-board">
      <div class="fw-board-head">
        <h2>${t("platformUpdate.thisBoard")}</h2>
        <span>${[hostOf$1(e.connectedPort),e.boardConfig?.board_name].filter(Boolean).join(" · ")}</span>
      </div>
      ${o.board?Facts(o.board):""}
      ${UpdateCard(e,n)}
    </div>
  `}let currentPort=null,currentPortIds=null,currentLoader=null,detectedChipName="",detectedMacAddress="",isBlankDevice=!0,ESPLoader=null,appState=null,panelState={view:"connect",deviceInfo:null,releases:[],selectedFirmware:null,flashProgress:0,wifiNetworks:[],selectedNetwork:null,credentials:null,logs:[{message:"> Ready",type:"info",timestamp:new Date().toLocaleTimeString()}],isFlashing:!1,isScanning:!1,terminalCollapsed:!1,reblessComplete:!1,reblessHostname:null,flashStep:"select",currentRelease:null,firmwareOptions:[],flashComplete:!1,boardOptions:[],selectedBoard:null,boardsFailed:!1,isNewDeviceFlow:!1};function addLog(e,n="info"){panelState.logs.push({message:`> ${e}`,type:n,timestamp:new Date().toLocaleTimeString()}),panelState.logs.length>100&&(panelState.logs=panelState.logs.slice(-100)),(n==="error"?console.error:n==="warning"?console.warn:console.log)(`[firmware-panel] ${e}`),triggerRerender()}function wifiFailure(e,n){const o=(e.match(/FAILED:(\w+)/)||[])[1];if(o==="WRONG_PASSWORD")return`"${n}" refused the board's authentication. That's usually the password.`;if(o==="HANDSHAKE_TIMEOUT"||o==="15")return`The handshake with "${n}" timed out, which usually means a wrong password.`;if(o==="NO_AP_FOUND")return`The board can't see "${n}". Move it closer, or check its antenna.`;if(o==="BEACON_TIMEOUT")return`The board lost "${n}"'s signal. Move it closer, or check its antenna.`;if(o==="TIMEOUT")return`"${n}" didn't answer within 15 seconds. Move the board closer, or try again.`;if(o)return`The board reported ${o}.`;const i=e.trim().split(`
`).pop();return i?`The board said: ${i}`:"The board didn't answer."}function clearLog(){panelState.logs=[]}function triggerRerender(){document.dispatchEvent(new CustomEvent("firmware-panel-update"))}async function pulseReset(e){await e.setSignals({dataTerminalReady:!1,requestToSend:!1}),await new Promise(n=>setTimeout(n,50)),await e.setSignals({dataTerminalReady:!1,requestToSend:!0}),await new Promise(n=>setTimeout(n,100)),await e.setSignals({dataTerminalReady:!1,requestToSend:!1}),await new Promise(n=>setTimeout(n,100))}async function closePort(e){await Promise.race([e.close().catch(()=>{}),new Promise(n=>setTimeout(n,1e3))])}async function reopenPort(e=1e4){if(!currentPortIds)throw new Error("No device connected. Click Connect.");currentPort&&(await closePort(currentPort),await new Promise(i=>setTimeout(i,100)));const n=Date.now()+e;let o=null;for(;Date.now()<n;){const i=(await navigator.serial.getPorts()).filter(r=>{const{usbVendorId:l,usbProductId:a}=r.getInfo();return l===currentPortIds.usbVendorId&&a===currentPortIds.usbProductId}),s=i.includes(currentPort)?currentPort:i.length===1?i[0]:null;if(s)try{return await s.open({baudRate:115200}),s!==currentPort&&addLog("Device re-enumerated on USB, reconnected"),currentPort=s,s}catch(r){o=r}else i.length>1&&(o=new Error("Several devices with the same USB ID are connected. Unplug the others and click Connect."));await new Promise(r=>setTimeout(r,250))}throw currentPort=null,o||new Error("Device not found on USB. Replug it and click Connect.")}async function waitForSetupServer(e=6e4){const n=Date.now()+e,o=new TextDecoder;let i="",s=currentPort;for(;Date.now()<n;){if(!s?.readable)try{s=await reopenPort(n-Date.now())}catch(a){return addLog(a.message,"warning"),null}const r=s.readable.getReader(),l=setTimeout(()=>r.cancel().catch(()=>{}),n-Date.now());try{for(;;){const{value:a,done:c}=await r.read();if(c)break;i+=o.decode(a,{stream:!0});const d=i.match(/\[SETUP\] Setup server ready at (https:\/\/\S+)\s/);if(d){const f=i.match(/\[SETUP\] Connected! IP: ([\d.]+)/);return{url:d[1],ip:f?f[1]:null}}const u=i.match(/\[SETUP\] ERROR: ([^\r\n]+)/);if(u)return{error:u[1]}}}catch{s=null}finally{clearTimeout(l),r.releaseLock()}}return null}async function resetIntoSetupMode(e,n=null){addLog("Resetting device...");try{const s=currentPort.writable.getWriter(),r=new TextEncoder().encode("import machine; machine.reset()"),l=new Uint8Array(r.length+1);l.set(r),l[r.length]=4,await s.write(l),s.releaseLock()}catch{}await new Promise(s=>setTimeout(s,500)),addLog("Device is restarting and connecting to WiFi...");const o=await waitForSetupServer();let i=`https://${e}/setup`;if(o?.url){i=o.url;const s=new URL(o.url).host;s!==e&&addLog(`Device serves ${s} but its certificate is for ${e}`,"warning"),addLog(`Setup page ready: ${o.url}${o.ip?` (IP ${o.ip})`:""}`,"success")}else if(o?.error){addLog(`Device could not start setup mode: ${o.error}`,"error"),addLog("Check the network with Change WiFi, then Re-provision.","warning"),panelState.view="scenarios",triggerRerender();return}else addLog(`Could not confirm the setup page over USB. It should come up at ${i}`,"warning");n&&(i+=`?ext=${encodeURIComponent(n)}`),showSecurityWarningModal(new URL(i).host,i,!!o?.url)}async function transitionToREPL(){currentLoader&&(await currentLoader.disconnect(),currentLoader=null,await new Promise(d=>setTimeout(d,100))),await reopenPort(),addLog("Resetting device..."),await pulseReset(currentPort),addLog("Waiting for System booting...");const e=currentPort.readable.getReader(),n=new TextDecoder;let o="";const i=Date.now();let s=!1,r=null;const l=[{pattern:/invalid header: 0x[0-9a-fA-F]+/i,message:"Invalid firmware header - incompatible image for this device"},{pattern:/flash read err/i,message:"Flash read error - firmware may be corrupted"},{pattern:/ets_main\.c/i,message:"Boot failure - firmware not recognized"},{pattern:/rst:0x10.*boot:0x[0-9a-f]+.*invalid/i,message:"Boot loop detected - firmware incompatible"}],c=panelState.deviceInfo?.chipFamily==="ESP32-P4"?15e3:8e3;for(;Date.now()-i<c;){const{value:d,done:u}=await e.read();if(u)break;if(d){o+=n.decode(d);for(const{pattern:f,message:p}of l)if(f.test(o)){r=p,console.log("[transitionToREPL] Boot error detected:",o);break}if(r)break;if(o.includes("System booting...")){s=!0,addLog("System booting detected","success"),e.releaseLock();const f=currentPort.writable.getWriter();await f.write(new Uint8Array([3,3,3])),await new Promise(p=>setTimeout(p,30)),await f.write(new Uint8Array([3,3])),f.releaseLock(),addLog("Interrupting to enter REPL...");break}}}if(!s)try{e.releaseLock()}catch{}if(r)return addLog(r,"error"),{success:!1,error:r,bootOutput:o};if(!s){addLog("No boot signature detected","error");const d=currentPort.writable.getWriter();return await d.write(new Uint8Array([3,3])),d.releaseLock(),{success:!1,error:"No boot signature from device - firmware may be incompatible",bootOutput:o}}await new Promise(d=>setTimeout(d,200)),addLog("Entering REPL mode...");try{const d=currentPort.readable.getReader(),u=setTimeout(()=>d.cancel(),500);try{for(;;){const{value:f,done:p}=await d.read();if(p)break}}catch{}clearTimeout(u),d.releaseLock()}catch(d){console.log("[DRAIN] Error:",d)}return addLog("REPL ready"),{success:!0}}async function handleBootFailure(e){await showStyledModal({variant:"danger",icon:'<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',title:"Boot Failure Detected",subtitle:"Incompatible firmware image",body:`<p><strong>${e}</strong></p><p>The device could not boot. This typically happens when the wrong firmware variant is flashed.</p>`,buttons:[{id:"reflash",class:"fw-styled-modal-btn-primary",icon:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" style="margin-right:0.5rem"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>',label:"Return to Bootloader"},{id:"close",class:"fw-styled-modal-btn-cancel",label:"Close"}]})==="reflash"&&(addLog("Returning to bootloader mode..."),addLog('Ready for re-flash. Select "Onboard New Device" to flash correct firmware.',"success")),panelState.view="scenarios",triggerRerender()}async function sendREPLCommand(e,n,o=15e3,i=!0,s=null){const r=e.writable.getWriter();try{const l=n.split(`
`).filter(w=>w.trim().length>0),a=Math.min(...l.map(w=>{const y=w.match(/^(\s*)/);return y?y[1].length:0})),c=l.map(w=>w.slice(a)).join(`
`);i&&(await r.write(new Uint8Array([1])),await new Promise(w=>setTimeout(w,100)));const d=new TextEncoder().encode(c),u=64;for(let w=0;w<d.length;w+=u){const y=d.slice(w,Math.min(w+u,d.length));await r.write(y),await new Promise(S=>setTimeout(S,10))}await new Promise(w=>setTimeout(w,50)),await r.write(new Uint8Array([4])),r.releaseLock();const f=e.readable.getReader();let p="";const h=new TextDecoder,m=Date.now();for(;Date.now()-m<o;){const{value:w,done:y}=await f.read();if(y||w&&(p+=h.decode(w),p.includes("OK")&&p.endsWith(">")))break}if(f.releaseLock(),s&&!p.includes(s))throw new Error(`REPL command failed (no "${s}" in output): ${p.slice(-300).trim()}`);return p}catch(l){try{r.releaseLock()}catch{}throw l}}const USB_BRIDGE_DB={6790:{vendorName:"QinHeng Electronics",products:{29986:{name:"CH340",maxBaudrate:460800},29987:{name:"CH340",maxBaudrate:460800},21971:{name:"CH343",maxBaudrate:6e6},21972:{name:"CH9102",maxBaudrate:6e6}}},4292:{vendorName:"Silicon Labs",products:{6e4:{name:"CP2102(n)",maxBaudrate:3e6},60016:{name:"CP2105",maxBaudrate:2e6}}},1027:{vendorName:"FTDI",products:{24577:{name:"FT232R",maxBaudrate:3e6},24592:{name:"FT2232",maxBaudrate:3e6},24597:{name:"FT230X",maxBaudrate:3e6}}},12346:{vendorName:"Espressif Systems",products:{2:{name:"ESP32-S2 Native USB",maxBaudrate:2e6},4097:{name:"ESP32 Native USB",maxBaudrate:2e6},16386:{name:"ESP32 Native USB (CDC)",maxBaudrate:2e6}}}},JEDEC_MANUFACTURERS={1:"Spansion/Infineon",11:"Samsung",28:"Eon/Puya",32:"Micron",104:"Atmel/Adesto",133:"Fudan",157:"ISSI",191:"Microchip/SST",194:"Macronix",200:"GigaDevice",239:"Winbond"},JEDEC_FLASH_PARTS={239:{16406:"W25Q32 (32 Mbit)",16407:"W25Q64 (64 Mbit)",16408:"W25Q128 (128 Mbit)",16409:"W25Q256 (256 Mbit)"},200:{16406:"GD25Q32 (32 Mbit)",16407:"GD25Q64 (64 Mbit)",16408:"GD25Q128 (128 Mbit)",16409:"GD25Q256 (256 Mbit)"},194:{16406:"MX25L3206 (32 Mbit)",16407:"MX25L6406 (64 Mbit)",16408:"MX25L12835 (128 Mbit)"}};function getUsbBridgeInfo(e){try{const n=e.getInfo?.();if(!n||typeof n.usbVendorId!="number")return null;const o=n.usbVendorId,i=n.usbProductId,s=USB_BRIDGE_DB[o];if(!s)return`Unknown (0x${o.toString(16).padStart(4,"0")})`;const r=s.products[i];return r?`${s.vendorName} - ${r.name} (0x${i.toString(16).toUpperCase()})`:`${s.vendorName} (0x${i?.toString(16).padStart(4,"0")||"????"})`}catch(n){return console.log("[getUsbBridgeInfo] Error:",n),null}}function getFlashDeviceInfo(e){if(!e||typeof e!="number")return null;const n=e&255,o=e>>8&255,i=e>>16&255,s=o<<8|i,r=JEDEC_MANUFACTURERS[n],l=JEDEC_FLASH_PARTS[n]?.[s];return r&&l?`${r} ${l}`:r?`${r} (0x${s.toString(16).toUpperCase()})`:`0x${e.toString(16).padStart(6,"0").toUpperCase()}`}async function detectHardware(e){ESPLoader||(ESPLoader=(await __vitePreload(()=>import("./tasmota-esptool.bundle-CejzY9o0.js"),[])).ESPLoader,console.log("[firmware-panel] ESPLoader module loaded"));const n={log:f=>console.log(f),debug:f=>console.debug(f),error:f=>console.error(f)},o=new ESPLoader(e,n),i=getUsbBridgeInfo(e);await o.initialize();const s=o.chipName||"Unknown";console.log("Connected to chip:",s);const r=o.macAddr(),l=Array.isArray(r)&&r.length>=6?r.slice(0,6).map(f=>f.toString(16).padStart(2,"0")).join(":"):"Unknown";let a=null;if(s?.includes("ESP32-S3"))try{a=decodeS3Psram(await o.readRegister(1610641476+4*4),await o.readRegister(1610641476+5*4)),a&&console.log("PSRAM detected:",a)}catch(f){console.log("PSRAM eFuse detection not available:",f)}let c="Unknown",d=null,u=115200;try{console.log("Running stub...");const f=await o.runStub();await f.detectFlashSize(),c=f.flashSize||"Unknown",console.log("Flash size detected:",c);try{const p=await f.flashId?.();p&&(d=getFlashDeviceInfo(p),console.log("Flash device:",d))}catch(p){console.log("Flash ID detection not available:",p)}u=f.transport?.baudrate||921600,currentLoader=f}catch(f){console.warn("Stub/Feature detection failed:",f),c="Detection Failed",currentLoader=o}return{chipName:s,flashSizeMB:c,macAddress:l,usbBridge:i,flashDevice:d,connectionBaud:u,psramInfo:a}}async function handleConnect(){try{currentLoader&&(await currentLoader.disconnect(),currentLoader=null)}catch(e){console.log("Cleanup previous connection:",e)}currentPort&&(await closePort(currentPort),currentPort=null),currentPortIds=null,resetDeviceState();try{if(clearLog(),addLog("Requesting serial port..."),!navigator.serial){addLog("Error: Web Serial API is not available in this browser.","error"),addLog("Please use Google Chrome or Microsoft Edge (version 89+).","error");return}currentPort=await navigator.serial.requestPort({});const{usbVendorId:e,usbProductId:n}=currentPort.getInfo();currentPortIds={usbVendorId:e,usbProductId:n},await currentPort.open({baudRate:115200}),addLog("Port opened"),addLog("Detecting hardware...");const o=await detectHardware(currentPort);detectedChipName=o.chipName,detectedMacAddress=o.macAddress,addLog(`Detected: ${detectedChipName}`),addLog(`MAC: ${detectedMacAddress}`),panelState.deviceInfo={chipName:detectedChipName,mac:detectedMacAddress,flashSize:o.flashSizeMB,usbBridge:o.usbBridge,flashDevice:o.flashDevice,connectionBaud:o.connectionBaud,psramInfo:o.psramInfo},isBlankDevice=!0;const i=sessionStorage.getItem("extension-install-active");i?(addLog(`App install: ${i} — skipping to flash`),selectScenario("new-device")):(panelState.view="scenarios",addLog("Device connected - select an action")),appState&&(appState.connectionMode="usb"),triggerRerender()}catch(e){if(console.error("[firmware-panel]",e),addLog(`Error: ${e.message}`,"error"),currentPort){try{await currentPort.close()}catch{}try{await currentPort.forget()}catch{}}currentPort=null,currentPortIds=null,currentLoader=null,triggerRerender()}}function resetDeviceState(){panelState.credentials=null,panelState.savedHostname=null,panelState.isNewDeviceFlow=!1,panelState.setupComplete=!1,panelState.setupHostname=null,panelState.setupUrl=null,panelState.reblessComplete=!1,panelState.reblessHostname=null}async function handleDisconnect(){try{if(currentLoader&&(await currentLoader.disconnect(),currentLoader=null),currentPort){try{await pulseReset(currentPort)}catch(e){console.log("[handleDisconnect] Reset error:",e)}await closePort(currentPort)}}catch{}currentPort=null,currentPortIds=null,resetDeviceState(),panelState.view="connect",panelState.deviceInfo=null,detectedChipName="",detectedMacAddress="",isBlankDevice=!0,appState&&(appState.connectionMode=null),clearLog(),addLog("Disconnected"),triggerRerender()}async function resetAndClosePort(){try{if(currentLoader&&(await currentLoader.disconnect(),currentLoader=null),currentPort){try{await pulseReset(currentPort)}catch(e){console.log("[resetAndClosePort] Reset error:",e)}await currentPort.close(),currentPort=null}}catch(e){console.log("[resetAndClosePort] Error:",e)}}function selectScenario(e){addLog(`Selected: ${e}`),panelState.view=e,e==="new-device"?loadFirmwareOptions():e==="forgot-credentials"?readCredentials():e==="change-wifi"?performWifiSetup():e==="re-provision"&&startRebless(),triggerRerender()}async function connectThen(e){await handleConnect(),panelState.view==="scenarios"&&selectScenario(e)}function goBack(){panelState.flashStep="select",panelState.flashComplete=!1,panelState.flashProgress=0,panelState.view="scenarios",triggerRerender()}async function loadFirmwareOptions(){try{addLog("Selecting firmware variant..."),panelState.flashStep="select",panelState.firmwareOptions=[],triggerRerender();const e=panelState.deviceInfo?.chipName?.includes("ESP32-S3")?"ESP32-S3":panelState.deviceInfo?.chipName?.includes("ESP32-P4")?"ESP32-P4":null;if(!e){addLog("Unknown chip family - cannot select firmware","error");return}const n=panelState.deviceInfo?.flashSize,o=panelState.deviceInfo?.psramInfo?.mode||null,i=await selectFirmwareVariant(e,n,o);if(!i){addLog(`No firmware available for ${e}`,"error");return}panelState.selectedFirmware=i,panelState.firmwareOptions=[i],addLog(`Selected: ${i.displayName}`),parseFloat(i.flash)<parseFloat(n)&&addLog(`${i.displayName} uses ${i.flash} of the ${n} flash: the larger builds need octal PSRAM`),await loadBoardOptions(e)}catch(e){addLog(`Error: ${e.message}`,"error"),triggerRerender()}}async function loadBoardOptions(e){panelState.boardsFailed=!1;try{const n=await fetchBoardManifests(e);panelState.boardOptions=n;const o=e==="ESP32-S3"?"generic_esp32s3":"generic_esp32p4";panelState.selectedBoard=n.find(i=>i.id===o)||n[0]||null}catch(n){console.warn("[firmware-panel] Could not load board manifests:",n),addLog(t("firmware.boardsFailed"),"error"),panelState.boardOptions=[],panelState.selectedBoard=null,panelState.boardsFailed=e}triggerRerender()}async function startFlash(){if(!currentLoader){addLog("Error: No device connected","error");return}if(!panelState.selectedFirmware){addLog("Error: No firmware selected","error");return}if(!confirm(`⚠️ FLASH FIRMWARE ⚠️

This will ERASE all data on the device and install:
${panelState.selectedFirmware.displayName}

Any existing scripts, settings, and certificates will be PERMANENTLY DELETED.

Are you sure you want to continue?`)){addLog("Flash cancelled by user");return}try{panelState.flashStep="downloading",panelState.flashProgress=0,triggerRerender(),addLog(`Downloading ${panelState.selectedFirmware.displayName}...`);const n=await downloadFirmware(panelState.selectedFirmware,o=>{panelState.flashProgress=o,o%20===0&&addLog(`Download: ${o}%`),triggerRerender()});addLog(`Downloaded ${(panelState.selectedFirmware.size/1024/1024).toFixed(1)} MB, verified`),panelState.flashStep="flashing",panelState.flashProgress=0,triggerRerender(),addLog("Syncing with device...");try{await currentLoader.sync()}catch{await currentLoader.initialize()}addLog("Flashing firmware...");try{await writeFullInstall(currentLoader,n,{onProgress:(o,i)=>{const s=Math.floor(o/i*100);panelState.flashProgress=s,s%10===0&&addLog(`Progress: ${s}%`),triggerRerender()},onLog:o=>addLog(o)})}catch(o){const i=o?.message||String(o),s=parseFloat(panelState.deviceInfo?.flashSize)||8,r=s>=32?85:s>=16?90:95;if(i.includes("Timed out")&&panelState.flashProgress>=r)addLog(`⚠ Flash timed out at ${panelState.flashProgress}% — large flash chips can stall during cache flush.`,"warning"),addLog("Reconnect to verify. If device boots normally, the flash succeeded.","warning");else throw o}addLog("✓ Flash complete!","success");try{await currentLoader.disconnect()}catch{}currentLoader=null,panelState.flashStep="complete",panelState.flashComplete=!0,panelState.terminalCollapsed=!0,triggerRerender()}catch(n){console.error("[firmware-panel] Flash error:",n),addLog(`Flash failed: ${n.message}`,"error");const o=panelState.flashStep==="flashing";if(panelState.flashStep="select",o){try{currentPort&&await currentPort.close()}catch{}currentPort=null,currentLoader=null}triggerRerender()}}async function proceedToWifiSetup(){addLog("Proceeding to WiFi setup..."),panelState.flashStep="select",panelState.flashComplete=!1,panelState.flashProgress=0,panelState.isNewDeviceFlow=!0,panelState.view="change-wifi";try{if(!currentPortIds){addLog("Please reconnect device"),panelState.view="connect",triggerRerender();return}performWifiSetup()}catch(e){addLog(`Error: ${e.message}`,"error")}triggerRerender()}async function readCredentials(){panelState.credentials=null;try{addLog("Reading credentials from device...");const e=await transitionToREPL();if(!e.success){await handleBootFailure(e.error);return}const o=(await sendREPLCommand(currentPort,`
import json
from lib.sys import settings
hostname = settings.get("device.hostname", "unknown")
ssid = settings.get("wifi.ssid", "not set")
print("CREDS:" + json.dumps({"h": hostname, "s": ssid}))
`)).match(/CREDS:(\{.*\})/);if(o){const i=JSON.parse(o[1]);panelState.credentials={hostname:i.h+".local",ssid:i.s},addLog(`Found: ${i.h}.local`,"success")}else throw new Error("Could not read settings - device may need firmware");triggerRerender()}catch(e){addLog(`Error: ${e.message}`,"error"),triggerRerender()}}async function performWifiSetup(){clearLog();try{let a=function(c){return new Promise((d,u)=>{const f=document.createElement("div");f.className="fw-modal-overlay active",f.innerHTML=`
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
              ${c.map((w,y)=>`
                <button class="fw-modal-network-item" data-index="${y}">
                  <span class="fw-network-name">${w.ssid}</span>
                  <span class="fw-network-info">
                    ${w.sec?'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>':""}
                    <span class="fw-network-rssi">${w.rssi} dBm</span>
                  </span>
                </button>
              `).join("")}
            </div>
            <button class="fw-modal-cancel">Cancel</button>
          </div>
        `,document.body.appendChild(f);const p=w=>{const y=w.target.closest(".fw-modal-network-item");if(y){const S=parseInt(y.dataset.index);m(),d(S)}},h=()=>{m(),u(new Error("Setup cancelled"))},m=()=>{f.remove()};f.querySelector(".fw-network-modal-list").addEventListener("click",p),f.querySelector(".fw-modal-cancel").addEventListener("click",h)})};addLog("Connecting to REPL...");const e=await transitionToREPL();if(!e.success){await handleBootFailure(e.error);return}addLog("Scanning for WiFi networks...");const o=(await sendREPLCommand(currentPort,`
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
`)).match(/JSON:(\[.*\])/);if(!o)throw new Error("Failed to parse network scan - no JSON found");let i;try{i=JSON.parse(o[1])}catch(c){throw new Error("Failed to parse network JSON: "+c.message)}if(i.length===0)throw new Error("No WiFi networks found");addLog(`Found ${i.length} networks`);let s=!1,r=null,l=null;for(;!s;){const c=await a(i),d=i[c],u=prompt(`Enter password for "${d.ssid}":`);if(u===null)continue;addLog(`Connecting to "${d.ssid}" (${d.rssi} dBm)...`);const f=await sendREPLCommand(currentPort,`
import time
from lib.sys.network import wifi
wifi.connect(${JSON.stringify(d.ssid)}, ${JSON.stringify(u)}, wait=False)
seen = None
for i in range(30):
    if wlan.isconnected():
        print("CONNECTED:" + wlan.ifconfig()[0])
        break
    s = wlan.status()
    if s != network.STAT_CONNECTING:
        seen = s
    time.sleep(0.5)
else:
    names = {getattr(network, n): n[5:] for n in dir(network) if n.startswith("STAT_")}
    print("FAILED:" + (names.get(seen, str(seen)) if seen is not None else "TIMEOUT"))
`,2e4,!1),p=f.match(/CONNECTED:(\d+\.\d+\.\d+\.\d+)/);if(p){r=p[1],s=!0,addLog(`Connected! IP: ${r}`),addLog("Saving settings...");const m=(await sendREPLCommand(currentPort,`
import machine
from lib.sys import settings
hostname = "pybot-" + "".join("%02x" % b for b in machine.unique_id())[-4:]
settings.set("wifi.ssid", ${JSON.stringify(d.ssid)})
settings.set("wifi.password", ${JSON.stringify(u)})
settings.set("server.https_enabled", True)
settings.set("device.hostname", hostname)
settings.save()
print("SETTINGS_OK:" + hostname)
`,5e3,!1,"SETTINGS_OK")).match(/SETTINGS_OK:(\S+)/)[1];if(addLog(`Settings saved (hostname: ${m})`,"success"),panelState.isNewDeviceFlow){panelState.isNewDeviceFlow=!1,panelState.savedHostname=m,addLog("Continuing to certificate generation..."),await continueToProvision(m);return}panelState.view="scenarios",triggerRerender();return}else{const h=wifiFailure(f,d.ssid);if(addLog(`Connection failed: ${h}`),!confirm(`WiFi connection failed. ${h}

Click OK to try again, or Cancel to abort.`))throw new Error("Connection cancelled")}}}catch(e){addLog(`Error: ${e.message}`,"error"),triggerRerender()}}async function continueToProvision(e){try{const n=e+".local";addLog("Generating HTTPS certificate..."),window.forge||await new Promise((l,a)=>{const c=document.createElement("script");c.src="https://cdn.jsdelivr.net/npm/node-forge@1.3.1/dist/forge.min.js",c.onload=l,c.onerror=()=>a(new Error("Failed to load forge")),document.head.appendChild(c)}),addLog(`Hostname: ${n}`);const{certPem:o,keyPem:i}=generateSelfSignedCert(n);if(addLog(`Certificate generated (${o.length} bytes)`),addLog("Installing certificate..."),await uploadCertsToDevice(currentPort,o,i),panelState.selectedBoard)try{addLog(`Installing board config: ${panelState.selectedBoard.name}...`);const l=await fetchBoardManifest(panelState.selectedBoard.id),a=JSON.stringify(l).replace(/\\/g,"\\\\").replace(/'/g,"\\'");await sendREPLCommand(currentPort,`
import json
try:
    import os
    os.mkdir('/settings')
except:
    pass
with open('/settings/board.json', 'w') as f:
    f.write('${a}')
print("BOARD_OK")
`,1e4,!1,"BOARD_OK"),addLog("Board config installed","success")}catch(l){addLog(`Warning: Could not install board config: ${l.message}`,"error")}try{addLog("Recording the installed release...");const l=manifestChunks(releaseManifest());for(let a=0;a<l.length;a++)await sendREPLCommand(currentPort,`
with open('/lib/sys/release.manifest', '${a?"a":"w"}') as f:
    f.write('${l[a]}')
print("RELEASE_OK")
`,1e4,!1,"RELEASE_OK");addLog("Installed release recorded","success")}catch(l){addLog(`Warning: Could not record the installed release: ${l.message}`,"error")}const s=localStorage.getItem("pending-extension-id");if(s){localStorage.removeItem("pending-extension-id");try{addLog(`Pre-installing app: ${s}...`);const l=new ExtensionRegistry,c=(await l.loadIndex("https://cheerful-stoat-894.convex.site/api/v1/extensions")).find(d=>d.id===s);c?(await l.installExtension(c),addLog(`App cached: ${c.name}`,"success")):addLog(`App "${s}" not found`,"error")}catch(l){addLog(`Warning: could not pre-install app: ${l.message}`,"error")}}const r=panelState.selectedFirmware?.platformVersion||"unknown";addLog(`Firmware version: ${r}`),addLog("Enabling setup mode..."),await sendREPLCommand(currentPort,`
from lib.sys import settings
settings.set("setup_mode", True)
settings.set("firmware.version", "${r}")
settings.save()
print("SETUP_MODE_SET")
`,5e3,!1,"SETUP_MODE_SET"),await resetIntoSetupMode(n,s)}catch(n){addLog(`Error: ${n.message}`,"error"),triggerRerender()}}async function startRebless(){try{addLog("Starting re-provisioning...");const e=await transitionToREPL();if(!e.success){addLog("Boot detection failed — attempting recovery...","warning"),addLog("Sending interrupt to reach REPL...");try{const c=currentPort.writable.getWriter();for(let d=0;d<3;d++)await c.write(new Uint8Array([3,3,3])),await new Promise(u=>setTimeout(u,500));c.releaseLock(),await new Promise(d=>setTimeout(d,1e3))}catch{addLog("Could not send interrupt — device may need re-flash","error"),await handleBootFailure(e.error);return}}addLog("Reading device settings...");const n=await sendREPLCommand(currentPort,`
import machine
from lib.sys import settings
print("HOST:" + settings.get("device.hostname", "pybot-xxxx"))
print("MAC:" + "".join("%02x" % b for b in machine.unique_id()))
`),o=n.match(/HOST:(.+)/),i=o?o[1].trim():"pybot-new",s=n.match(/MAC:([0-9a-f]+)/);addLog(`Device: ${i}.local${s?` (MAC ending ${s[1].slice(-4)})`:""}`),addLog(`Generating new certificate for ${i}.local...`),window.forge||await new Promise((c,d)=>{const u=document.createElement("script");u.src="https://cdn.jsdelivr.net/npm/node-forge@1.3.1/dist/forge.min.js",u.onload=c,u.onerror=d,document.head.appendChild(u)});const r=i+".local",{certPem:l,keyPem:a}=generateSelfSignedCert(r);addLog("Installing new certificate..."),await uploadCertsToDevice(currentPort,l,a);try{const d=(await sendREPLCommand(currentPort,`
import json
try:
    with open('/settings/board.json') as f:
        b = json.load(f)
    print("BOARD_ID:" + b.get("identity", {}).get("id", ""))
except:
    print("BOARD_ID:")
`,5e3,!1)).match(/BOARD_ID:(.+)/),u=d?d[1].trim():"";if(u){addLog(`Updating board config: ${u}...`);const f=await fetchBoardManifest(u),p=JSON.stringify(f).replace(/\\/g,"\\\\").replace(/'/g,"\\'");await sendREPLCommand(currentPort,`
with open('/settings/board.json', 'w') as f:
    f.write('${p}')
print("BOARD_OK")
`,1e4,!1,"BOARD_OK"),addLog("Board config updated","success")}else addLog("No board config found on device — skipping update")}catch(c){addLog(`Warning: Could not update board config: ${c.message}`,"warning")}addLog("Enabling setup mode..."),await sendREPLCommand(currentPort,`
from lib.sys import settings
settings.set("setup_mode", True)
settings.save()
print("SETUP_MODE_SET")
`,5e3,!1,"SETUP_MODE_SET"),await resetIntoSetupMode(r)}catch(e){addLog(`Error: ${e.message}`,"error"),triggerRerender()}}async function showSecurityWarningModal(e,n,o=!1){const s=await showStyledModal({icon:'<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>',title:"Accept Security Warning",subtitle:"Your device has new certificates",body:(o?"<p>Your device is on WiFi and its setup page is <strong>ready</strong>.</p>":"<p>Your device is <strong>restarting</strong> and connecting to WiFi.</p>")+'<p>A new tab will open — click <strong>"Advanced"</strong> → <strong>"Proceed"</strong> to trust your device, then <strong>return here</strong>.</p>',buttons:[{id:"connect",class:"fw-styled-modal-btn-primary",icon:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" style="margin-right:0.5rem"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',label:`Open ${e}`},{id:"cancel",class:"fw-styled-modal-btn-cancel",label:"Skip for now"}]});panelState.view="scenarios",panelState.reblessComplete=!1,triggerRerender(),s==="connect"&&window.open(n,"_blank")}function generateSelfSignedCert(e,n=10){const o=forge.pki.rsa.generateKeyPair(2048),i=forge.pki.createCertificate();i.publicKey=o.publicKey,i.serialNumber="01",i.validity.notBefore=new Date,i.validity.notAfter=new Date,i.validity.notAfter.setFullYear(i.validity.notBefore.getFullYear()+n);const s=[{name:"commonName",value:e}];return i.setSubject(s),i.setIssuer(s),i.setExtensions([{name:"subjectAltName",altNames:[{type:2,value:e}]}]),i.sign(o.privateKey,forge.md.sha256.create()),{certPem:forge.pki.certificateToPem(i),keyPem:forge.pki.privateKeyToPem(o.privateKey)}}async function uploadCertsToDevice(e,n,o){addLog("Creating /certs directory..."),await sendREPLCommand(e,`
import os
try:
    os.mkdir('/certs')
except OSError:
    pass
print('DIR_OK')
`,3e3,!1,"DIR_OK"),addLog("Writing certificate...");const i=btoa(n);await sendREPLCommand(e,`
import binascii
with open('/certs/servercert.pem', 'wb') as f:
    f.write(binascii.a2b_base64(b'${i}'))
print('CERT_OK')
`,1e4,!1,"CERT_OK"),addLog("Writing private key...");const s=btoa(o);await sendREPLCommand(e,`
with open('/certs/prvtkey.pem', 'wb') as f:
    f.write(binascii.a2b_base64(b'${s}'))
print('KEY_OK')
`,1e4,!1,"KEY_OK"),addLog("Certificates installed!")}function showsThisBoard(e){return panelState.view==="connect"&&!sessionStorage.getItem("extension-install-active")&&(e.isConnected||!!e.platformUpdate?.following)}function FirmwarePanel(e,n){useHub(e.scriptohubApiUrl),appState=e;const o=panelState.view,i=showsThisBoard(e);return html$1`
    <div class="firmware-panel">
      ${i?renderThisBoardView(e,n):""}
      ${o==="connect"&&!i?renderConnectView():""}
      ${o==="scenarios"?renderScenariosView():""}
      ${o==="new-device"?renderNewDeviceView():""}
      ${o==="forgot-credentials"?renderForgotCredentialsView():""}
      ${o==="change-wifi"?renderChangeWifiView():""}
      ${o==="re-provision"?renderReProvisionView():""}
      
      ${i&&panelState.logs.length<=1?"":renderTerminal()}
    </div>
  `}function renderDeviceInfoCompact(e="Connected",n="fw-status-success"){const o=panelState.deviceInfo;if(!o)return"";const i=getChipFeatures(o.chipName),s=o.connectionBaud?`${o.connectionBaud.toLocaleString()} bps`:"115,200 bps";return html$1`
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
            MEMORY
          </div>
          <div class="fw-summary-value">${o.flashSize||"Unknown"} Flash${o.psramInfo?` · ${o.psramInfo.capacity} PSRAM`:""}</div>
          <div class="fw-summary-meta">Crystal 40 MHz${o.psramInfo?.mode?` · ${o.psramInfo.mode.toUpperCase()} PSRAM`:""}</div>
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
          <div class="fw-summary-value">${i.length} capabilities</div>
          <div class="fw-summary-chips">
            ${i.map(r=>html$1`
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
  `}function getChipFeatures(e){const n={"ESP32-P4":["High-Performance MCU","RISC-V Dual Core"],"ESP32-S3":["WiFi","BLE 5.0","USB OTG"],"ESP32-S2":["WiFi","USB OTG"],"ESP32-C3":["WiFi","BLE 5.0","RISC-V"],"ESP32-C6":["WiFi 6","BLE 5.0","Thread"],ESP32:["WiFi","Bluetooth Classic","BLE"]};for(const[o,i]of Object.entries(n))if(e?.includes(o))return i;return["Microcontroller"]}let extensionDisplayNames={},extensionNamesFetched=!1;async function fetchExtensionDisplayName(e){if(!extensionNamesFetched){extensionNamesFetched=!0;try{const n=await fetch("https://cheerful-stoat-894.convex.site/api/v1/extensions");if(!n.ok)return;const o=await n.json();for(const i of o.extensions||[])extensionDisplayNames[i.id]=i.name;triggerRerender()}catch(n){console.warn("[firmware-panel] Could not fetch extension names:",n)}}}function renderConnectView(e,n){const o=sessionStorage.getItem("extension-install-active");if(o){extensionNamesFetched||fetchExtensionDisplayName();const i=extensionDisplayNames[o]||o.toUpperCase();return html$1`
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
          
          <h2 class="fw-ext-title">Installing ${i}</h2>
          <p class="fw-ext-subtitle">Plug in your device via USB</p>
          
          <div class="fw-ext-spinner" aria-hidden="true">
            <div class="fw-ext-spinner-ring"></div>
          </div>
          
          <p class="fw-ext-note">
            We'll detect your hardware, flash firmware, and install the <strong>${i}</strong> extension on your ESP32 device.
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
  `}function renderThisBoardView(e,n){return html$1`
    <div class="fw-view active">
      ${ThisBoard(e,n)}
      <div class="fw-usb">
        <h3>${t("firmware.overUsb")}</h3>
        <p>${t("firmware.overUsbHint")}</p>
        ${renderScenarioCards(connectThen,!1)}
      </div>
    </div>
  `}function renderScenariosView(e,n){const o=t(isBlankDevice?"firmware.readyToFlash":"firmware.pyDirectDetected");return html$1`
    <div class="fw-view active">
      ${renderDeviceInfoCompact(o,isBlankDevice?"fw-status-warning":"fw-status-success")}
      
      ${renderScenarioCards(selectScenario,!0)}
    </div>
  `}function renderScenarioCards(e,n){return html$1`
    <div class="fw-scenario-grid">
      <div class="fw-scenario-card ${n&&isBlankDevice?"fw-scenario-highlighted":""}"
           onclick=${()=>e("new-device")}>
        <div class="fw-scenario-icon">
          ${IconSprite.renderIcon("cpu",{className:"",size:28})}
        </div>
        <h3>${t("firmware.newDevice")}</h3>
        <p>${t("firmware.newDeviceDesc")}</p>
      </div>
      
      <div class="fw-scenario-card ${n&&!isBlankDevice?"fw-scenario-highlighted":""}"
           onclick=${()=>e("forgot-credentials")}>
        <div class="fw-scenario-icon">
          ${IconSprite.renderIcon("key",{className:"",size:28})}
        </div>
        <h3>${t("firmware.forgotCredentials")}</h3>
        <p>${t("firmware.forgotCredentialsDesc")}</p>
      </div>
      
      <div class="fw-scenario-card"
           onclick=${()=>e("change-wifi")}>
        <div class="fw-scenario-icon">
          ${IconSprite.renderIcon("wifi",{className:"",size:28})}
        </div>
        <h3>${t("firmware.changeWifi")}</h3>
        <p>${t("firmware.changeWifiDesc")}</p>
      </div>
      
      <div class="fw-scenario-card"
           onclick=${()=>e("re-provision")}>
        <div class="fw-scenario-icon">
          ${IconSprite.renderIcon("refresh",{className:"",size:28})}
        </div>
        <h3>${t("firmware.reProvision")}</h3>
        <p>${t("firmware.reProvisionDesc")}</p>
      </div>
    </div>
  `}function renderNewDeviceView(e,n){const o=panelState.flashStep,i=panelState.flashProgress,s=panelState.selectedFirmware;if(o==="complete")return html$1`
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
            ${s?.platformVersion?html$1`<p style="color: var(--brand); font-size: 0.85rem; font-weight: 500; margin-bottom: 0.25rem;">botIQ ${s.platformVersion}</p>`:""}
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
    `;if(o==="downloading"||o==="flashing"){const r=t(o==="downloading"?"firmware.downloading":"firmware.flashing"),l=o==="flashing"&&i>90?html$1`<p style="text-align: center; color: var(--text-muted); margin-top: 0.5rem; font-size: 0.8rem;">
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
              <div class="fw-progress-fill" style="width: ${i}%"></div>
            </div>
            <p style="text-align: center; color: var(--text-secondary); margin-top: 0.75rem; font-size: 0.9rem;">
              ${i}%
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
      
      
      
      
      <div class="fw-device-card" style="margin-top: 1rem;">
        <div class="fw-device-card-header">
          <h3>
            ${IconSprite.renderIcon("bolt",{className:"fw-header-icon"})}
            ${t("firmware.selectFirmware")}
          </h3>
        </div>
        
        ${s?html$1`
          ${panelState.firmwareOptions.length>1?html$1`
            <div class="fw-form-group">
              <select class="fw-select" onchange=${r=>{const l=panelState.firmwareOptions.find(a=>a.id===r.target.value);l&&(panelState.selectedFirmware=l,triggerRerender())}}>
                ${panelState.firmwareOptions.map(r=>html$1`
                  <option value="${r.id}" selected=${r.id===s.id}>
                    ${r.displayName}
                  </option>
                `)}
              </select>
            </div>
          `:html$1`
            <div class="fw-firmware-info">
              <p style="font-weight: 500;">${s.displayName} <span style="font-size: 0.8rem; color: var(--text-secondary);">
                ${s.platformVersion?`botIQ ${s.platformVersion}`:""}
                ${s.platformVersion&&s.size?" · ":""}
                ${s.size?`${(s.size/1024/1024).toFixed(1)} MB`:s.platformVersion?"":"Ready to flash"}
              </span></p>
            </div>
          `}
          
          ${panelState.boardOptions.length>0?html$1`
            <div class="fw-form-group" style="margin-top: 1rem;">
              <label style="font-size: 0.85rem; font-weight: 500; margin-bottom: 0.5rem; display: block; color: var(--text-secondary);">
                Board Configuration
              </label>
              <select class="fw-select" onchange=${r=>{const l=panelState.boardOptions.find(a=>a.id===r.target.value);l&&(panelState.selectedBoard=l,triggerRerender())}}>
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

          ${panelState.boardsFailed?html$1`
            <div class="fw-hint-box fw-hint-warning" style="margin-top: 1rem;">
              <p>${t("firmware.boardsFailed")}</p>
              <button class="fw-btn fw-btn-secondary" style="margin-top: 0.75rem;" onclick=${()=>loadBoardOptions(panelState.boardsFailed)}>
                ${t("firmware.tryAgain")}
              </button>
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
  `}function renderForgotCredentialsView(e,n){const o=panelState.credentials;return html$1`
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
  `}function renderReProvisionView(e,n){const o=()=>{const s=`https://${panelState.reblessHostname}`;window.open(s,"_blank")},i=async()=>{await resetAndClosePort(),panelState.reblessComplete=!1,panelState.reblessHostname=null,panelState.view="connect",triggerRerender()};return panelState.reblessComplete?html$1`
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
          <button class="fw-btn fw-btn-secondary" onclick=${i} style="margin-top: 0.5rem;">
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
  `}const COPIED_MS=1500,HIDDEN_TOKEN="•".repeat(8);function mcpAddress(e){return`http://${new URL(e.connectedPort).host}/mcp`}function serverName(e){const n=e.split("//").pop().split(/[./:]/)[0];return/^[a-zA-Z][\w-]*$/.test(n)?n:"board"}function copy(e,n){const o=e.currentTarget;navigator.clipboard.writeText(n).then(()=>{o.textContent=t("agentPanel.copied"),setTimeout(()=>{o.textContent=t("agentPanel.copy")},COPIED_MS)})}function ConnectLine(e,n=e){return html$1`
    <div class="agent-connect-line">
      <code>${n}</code>
      <button class="secondary-button" onclick=${o=>copy(o,e)}>${t("agentPanel.copy")}</button>
    </div>
  `}function Connecting(e){const n=mcpAddress(e),o=r=>`Authorization: Bearer ${r}`,i=r=>`claude mcp add --scope user --transport http ${serverName(n)} ${n} --header "${o(r)}"`,s=BridgeDevice.agentToken;return html$1`
    <div class="panel-section">
      <h3 class="panel-section-title">${t("agentPanel.claudeCode")}</h3>
      <p>${t("agentPanel.claudeCodeHint")}</p>
      ${ConnectLine(i(s),i(HIDDEN_TOKEN))}
      <p>${t("agentPanel.tokenHint")}</p>
    </div>

    <div class="panel-section">
      <h3 class="panel-section-title">${t("agentPanel.otherAgents")}</h3>
      <p>${t("agentPanel.otherAgentsHint")}</p>
      ${ConnectLine(n)}
      ${ConnectLine(o(s),o(HIDDEN_TOKEN))}
    </div>
  `}function AgentPanel(e,n){return html$1`
    <div class="panel-container">
      <div class="panel-header">
        <h2>${t("agentPanel.title")}</h2>
      </div>

      <div class="panel-section">
        <p>${t("agentPanel.intro")}</p>
        <p>${t("agentPanel.watch")}</p>
      </div>

      ${e.isConnected?Connecting(e):html$1`
        <div class="panel-section">
          <p>${t("agentPanel.connectFirst")}</p>
        </div>
      `}

      <div class="panel-section">
        <h3 class="panel-section-title">${t("agentPanel.noInstall")}</h3>
        <p>${t("agentPanel.noInstallHint")}</p>
        <button class="secondary-button" onclick=${()=>n("open-extensions-modal")}>${t("agentPanel.openApps")}</button>
      </div>
    </div>
  `}function ReconnectDialog(e,n){if(!e.isReconnecting)return;const o=e.reconnectAttempt||0;function i(){n("reconnect-cancel")}return html$1`
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
        <div class="dialog-subtitle">Attempting to reconnect… (${o+1})</div>
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
           <button class="scriptos-btn scriptos-btn-secondary" style="min-width: 100px;" onclick=${i}>
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
      </div>
    </div>
  `}function FileManagerContent(e,n){let o="Connect to board",i=`${e.diskNavigationRoot}${e.diskNavigationPath}`;return e.isConnected&&(o=`${e.connectedPort}${e.boardNavigationPath}`),html`
    <div id="file-manager">
      <div id="board-files">
        <div class="device-header">
          ${IconSprite.renderIcon(e.isConnected?"cpu":"unlink",{className:"icon"})}
          <div onclick=${()=>n("connect")} class="text">
            <span>${o}</span>
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
            <span>${i}</span>
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
  `}function TwilioPanel(e,n){e.isConnected&&!e.twilioConfigLoaded&&!e.isLoadingTwilioConfig&&n("load-twilio-config");const o=e.twilioConfig||{};return html`
    <div class="panel-container">
      <div class="panel-header">
        <h2>Telephony</h2>
      </div>
      
      <div class="panel-section">
        <div class="section-header">
          <h3 class="panel-section-title">Twilio Credentials</h3>
        </div>
        
        <form class="config-form" onsubmit=${i=>{i.preventDefault();const s=new FormData(i.target),r={account_sid:s.get("account_sid")||"",auth_token:s.get("auth_token")||"",from_number:s.get("from_number")||""};if(!r.account_sid){alert("Account SID is required");return}if(!r.auth_token){alert("Auth Token is required");return}n("save-twilio-config",r)}}>
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
              value=${o.account_sid||""}
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
              value=${o.auth_token||""}
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
              value=${o.from_number||""}
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
  `}const SHOWN_CAPABILITIES=["can","wwan","rtc","imu","buzzer","gnss","display","sd_card","sdcard","ethernet","camera","audio","bluetooth"],URLS={examples:"https://scriptohub.ai/skills",apps:"https://scriptohub.ai/extensions",docs:"https://scriptostudio.com/docs/"};function hostOf(e){try{return new URL(e).hostname}catch{return""}}function isApp(e,n){return!!(n.allCachedExtensions||[]).find(i=>i.id===e)?.menu?.some(i=>!i.disabled)}function ScriptOStatus(e){if(!e.code)return e.tools?.length?t("home.toolsForAgents",{count:e.tools.length}):t("home.nothingToRun");const n=e.why||t(`home.state.${e.state?.replace(" ","_")}`),o=e.why&&e.stopped_at?`, ${new Date(e.stopped_at*1e3).toLocaleString()}`:"",i=e.restarts?`, ${t("home.restarted",{count:e.restarts})}`:"";return`${n}${o}${i}`}function ScriptORow(e,n,o){const i=n.name||e,s=(a,c={})=>o("app-action",{tool:a,args:{id:e,...c}}),r=n.state==="running",l=!!n.error;return html$1`
    <div class="home-row">
      <div class="home-row-main">
        <span class="home-dot ${l?"failed":r?"on":""}"></span>
        <span class="home-row-name">${i}</span>
        ${l?html$1`
          <button class="home-button" onclick=${()=>o("agent-chat-attach",{label:t("home.crashOf",{name:i}),text:`The ScriptO "${i}" (id ${e}) crashed:
${n.error}`})}>${t("home.askAgent")}</button>
        `:""}
        ${n.code?html$1`
          <button class="home-button" onclick=${()=>s(r?"scripto_stop":"scripto_start")}>${t(r?"home.stop":"home.start")}</button>
        `:""}
      </div>
      <div class="home-row-sub">
        <span class="home-row-status">${ScriptOStatus(n)}</span>
        ${n.code?html$1`
          <label class="home-row-boot">
            <input type="checkbox" checked=${!!n.run_at_boot} onchange=${a=>s("scripto_run_at_boot",{on:a.target.checked})} />
            ${t("home.runAtStartup")}
          </label>
        `:""}
        ${n.code?html$1`<button class="home-link" onclick=${()=>o("open-board-file",n.code)}>${t("home.code")}</button>`:""}
        <button class="home-link" onclick=${()=>o("app-remove",{id:e,name:i})}>${t("home.remove")}</button>
      </div>
      ${l&&n.error!==n.why?html$1`<pre class="home-row-error">${n.error}</pre>`:""}
    </div>
  `}function ConnectedBoard(e,n){const o=e.boardConfig?.capabilities||{},i=SHOWN_CAPABILITIES.filter(r=>o[r]),s=Object.entries(e.deviceApps||{}).filter(([r])=>!isApp(r,e));return html$1`
    <div class="home-board-head">
      <h2>${hostOf(e.connectedPort)||e.boardConfig?.board_name}</h2>
      <span class="home-dot on"></span>
      <span class="home-muted">${e.boardConfig?.board_name||t("home.connected")}</span>
    </div>
    <div class="home-chips">
      ${i.map(r=>html$1`<span class="home-chip">${t(`home.capability.${r}`)}</span>`)}
    </div>
    <h3>${t("home.scriptos")}</h3>
    ${s.length?s.map(([r,l])=>ScriptORow(r,l,n)):html$1`<p class="home-muted">${t("home.noScriptos")}</p>`}
  `}function KnownBoard(e,n){const o=()=>{localStorage.setItem("webrepl-url",e.url),n("connect")};return html$1`
    <div class="home-row">
      <div class="home-row-main">
        <span class="home-dot"></span>
        <span class="home-row-name">${e.hostname}</span>
        <button class="home-button" onclick=${o}>${t("home.connect")}</button>
      </div>
      <div class="home-row-sub">
        <span class="home-row-status">${e.board_name}, ${new Date(e.connectedAt).toLocaleDateString()}</span>
      </div>
    </div>
  `}function NoBoard(e,n){const o=[...e.knownBoards||[]].sort((i,s)=>(s.connectedAt||"").localeCompare(i.connectedAt||""));return html$1`
    <div class="home-board-head">
      <h2>${t("home.noBoard")}</h2>
      <span class="home-dot"></span>
    </div>
    <div class="home-chips">
      <button class="home-button primary" onclick=${()=>n("connect")}>${t(e.isConnecting?"home.connecting":"home.connectBoard")}</button>
    </div>
    ${o.length?html$1`
      <h3>${t("home.boardsUsed")}</h3>
      ${o.map(i=>KnownBoard(i,n))}
    `:html$1`<p class="home-muted">${t("home.noBoardsYet")}</p>`}
  `}function BoardPane(e,n){return html$1`
    <div class="home">
      <div class="home-board">
        <div class="home-board-body">
          ${e.isConnected?ConnectedBoard(e,n):NoBoard(e,n)}
        </div>
        <div class="home-links">
          <button class="home-link" onclick=${()=>openIframeModal(URLS.examples,t("home.examples"))}>${t("home.examples")}</button>
          <button class="home-link" onclick=${()=>openIframeModal(URLS.apps,t("home.browseApps"))}>${t("home.browseApps")}</button>
          <button class="home-link" onclick=${()=>openExternal(URLS.docs)}>${t("home.docs")}</button>
          <button class="home-link" onclick=${()=>n("navigate","system:firmware")}>${t("home.setUpBoard")}</button>
        </div>
      </div>
    </div>
  `}function openExternal(e){window.open(e,"_blank","noopener,noreferrer")}const WEB_LINK=/^https?:\/\//i;function element(e,n,o=""){const i=document.createElement(e);return n&&(i.className=n),i.textContent=o,i}function addInline(e,n){for(const o of n)if(o.type==="strong"||o.type==="em"||o.type==="del"){const i=element(o.type);addInline(i,o.tokens),e.append(i)}else if(o.type==="codespan")e.append(element("code","",o.text));else if(o.type==="link"&&WEB_LINK.test(o.href)){const i=element("a","",o.text);i.href=o.href,i.target="_blank",i.rel="noopener noreferrer",e.append(i)}else o.type==="br"?e.append(`
`):o.tokens?addInline(e,o.tokens):o.type==="text"||o.type==="escape"?e.append(o.text):e.append(o.raw)}function addBlocks(e,n){for(const o of n)if(o.type!=="space")if(o.type==="code")e.append(element("pre","agent-code",o.text));else if(o.type==="list"){const i=element(o.ordered?"ol":"ul");for(const s of o.items){const r=element("li");addBlocks(r,s.tokens),i.append(r)}e.append(i)}else if(o.type==="blockquote")addBlocks(e,o.tokens);else if(o.type==="paragraph"||o.type==="heading"||o.type==="text"){const i=element("div",o.type==="heading"?"agent-text-heading":"agent-text-block");addInline(i,o.tokens||[o]),e.append(i)}else e.append(element("pre","agent-code",o.raw.trimEnd()))}function AgentText(e){const n=element("div","agent-text");return addBlocks(n,g.lexer(e)),n}const stopStatusInfoPolling$1=()=>window.stopStatusInfoPolling?window.stopStatusInfoPolling():null,startStatusInfoPolling$1=(e,n,o)=>window.startStatusInfoPolling?window.startStatusInfoPolling(e,n,o):null;async function refreshBoardApps(e,n){if(!e.isConnected)return;const o={};for(const i of await BridgeDevice.appsList())o[i.id]=i;e.deviceApps=o,e.installedExtensions=e.allCachedExtensions.filter(i=>o[i.id]),n.emit("render")}function versionString(e){return Array.isArray(e)?e.join("."):String(e)}function instantiateExtension(extensionCode,state,emit,html){const deviceAPI=new DeviceAPI$1(BridgeDevice),metaMatch=extensionCode.match(/export\s+const\s+__EXTENSION_META__\s*=\s*(\{[\s\S]*?\});/);let meta={};if(metaMatch)try{meta=eval("("+metaMatch[1]+")")}catch(e){console.warn("[Extensions] Meta parse failed:",e)}const deviceFiles=decodeDeviceFiles(extensionCode),exportMatch=extensionCode.match(/export\s*\{\s*(\w+)\s+as\s+default\s*\}/),defaultExportVar=exportMatch?exportMatch[1]:null,evalCode=extensionCode.replace(/export\s+(const|default|class|function)/g,"$1").replace(/export\s*\{[^}]*\}\s*;?/g,""),returnLogic=defaultExportVar?`return ${defaultExportVar};`:`if (typeof P !== 'undefined') return P;
       const classMatch = ${JSON.stringify(evalCode)}.match(/class\\s+(\\w+(?:App|Extension))\\s*{/);
       if (classMatch) return eval(classMatch[1]);
       throw new Error('No extension class found in bundle');`,extensionFunction=new Function("DeviceAPI","html","emit","state",`
    ${evalCode}
    ${returnLogic}
  `),ExtensionClass=extensionFunction(DeviceAPI$1,html,emit,state),instance=new ExtensionClass(deviceAPI,emit,state,html);return instance.deviceFiles=deviceFiles,instance.meta=meta,console.log(`[Extensions] Loaded ${meta.name||"extension"} with ${Object.keys(deviceFiles).length} device files`),instance}function registerExtensionHandlers(e,n,o,i){const s=console.log;n.on("open-extensions-modal",async()=>{s("open-extensions-modal"),e.isExtensionsModalOpen=!0,e.isLoadingExtensions=!0,n.emit("render");try{const l=e.registryUrl||"https://cheerful-stoat-894.convex.site/api/v1/extensions";e.availableExtensions=await e.extensionRegistry.loadIndex(l),e.isLoadingExtensions=!1,n.emit("render")}catch(l){console.error("[Extensions] Error loading registry:",l),e.isLoadingExtensions=!1,e.availableExtensions=[],n.emit("render"),alert(`Failed to load the app list:
${l.message}`)}}),n.on("close-extensions-modal",()=>{s("close-extensions-modal"),e.isExtensionsModalOpen=!1,n.emit("render")}),n.on("install-extension",async l=>{s("install-extension:",l.name);try{const a=await e.extensionRegistry.installExtension(l);e.installedExtensions=await e.extensionRegistry.getInstalledExtensions(),e.allCachedExtensions=[...e.installedExtensions],e.isExtensionsModalOpen=!1,s(`[Extensions] Installed ${l.name}`),n.emit("render");const c=await e.extensionRegistry.getExtension(l.id);hasOnInstallMethod(c?.content)?e.isConnected&&o?await r(l,c,e,n,o):(s("[Extensions] Device not connected - extension will install files when first opened"),await showStyledModal({variant:"warning",icon:"packages",title:"App Saved",subtitle:l.name,body:`<p>This app needs to install files on your device.</p>
                   <p style="color: var(--text-secondary);">Connect to your device and open the app to complete setup.</p>`,buttons:[{id:"ok",class:"fw-styled-modal-btn-primary",label:"OK"}]})):e.isConnected?(await updateDeviceExtensionRegistry(new DeviceAPI$1(BridgeDevice),l.id,versionString(l.version),l.name),await refreshBoardApps(e,n)):l.mipPackage&&n.emit("prompt-upload-dependencies",{extensionId:l.id,extensionName:l.name})}catch(a){console.error("[Extensions] Installation failed:",a),alert(`Failed to install app:
${a.message}`)}});async function r(l,a,c,d,u){const f=l.id,p=Array.isArray(l.version)?l.version.join("."):String(l.version);s(`[Extensions] Running onInstall for ${l.name}...`),showStyledModal({variant:"",icon:"packages",title:"Installing App",subtitle:l.name,body:`<p>Installing app files to device...</p>
             <div style="margin-top: 16px; color: var(--text-secondary);">
               <span class="install-spinner">◐</span> Preparing...
             </div>`,buttons:[]});try{stopStatusInfoPolling$1();const h=(w,...y)=>w.reduce((S,$,C)=>S+$+(y[C]||""),""),m=instantiateExtension(a.content,c,d.emit.bind(d),h);if(typeof m.onInstall=="function"){updateModalBody(`<p>Writing files to device...</p>
          <div style="margin-top: 16px; color: var(--text-secondary);">
            <span class="install-spinner">◐</span> Installing...
          </div>`),await m.onInstall(),updateModalBody(`<p>Updating device registry...</p>
          <div style="margin-top: 16px; color: var(--text-secondary);">
            <span class="install-spinner">◐</span> Finalizing...
          </div>`);const w=new DeviceAPI$1(BridgeDevice);await updateDeviceExtensionRegistry(w,f,p,l.name),await refreshBoardApps(c,d),s(`[Extensions] onInstall complete for ${l.name}`)}closeStyledModal(),await showStyledModal({variant:"success",icon:"check",title:"App Ready",subtitle:l.name,body:"<p>App files have been installed on your device.</p>",buttons:[{id:"done",class:"fw-styled-modal-btn-primary",label:"Done"}]})}catch(h){console.error("[Extensions] onInstall failed:",h),closeStyledModal(),await showStyledModal({variant:"danger",icon:"alert-triangle",title:"Installation Failed",subtitle:l.name,body:`<p>Failed to install app files:</p>
               <p style="color: var(--error-color)">${h.message}</p>
               <p style="margin-top: 12px; color: var(--text-secondary);">
                 You can try again by opening the extension panel.
               </p>`,buttons:[{id:"close",class:"fw-styled-modal-btn-cancel",label:"Close"}]})}finally{c.isConnected&&u&&startStatusInfoPolling$1(u,c,d)}}n.on("update-extension",async({extension:l,newVersion:a})=>{s("update-extension:",l.id,`v${l.version.join(".")} → v${a.version.join(".")}`);try{delete e.loadedExtensions[l.id];const c=`extension-styles-${l.id}`,d=document.getElementById(c);d&&(d.remove(),console.log(`[Extensions] Removed old styles for ${l.id}`)),await e.extensionRegistry.uninstallExtension(l.id),await e.extensionRegistry.installExtension(a),e.installedExtensions=await e.extensionRegistry.getInstalledExtensions(),e.allCachedExtensions=[...e.installedExtensions],e.activeExtension===l.id&&n.emit("change-extension-panel",{extensionId:l.id,panelId:e.activeExtensionPanel||a.menu[0].id}),s(`[Extensions] Updated ${l.name} to v${a.version.join(".")}`);const u=await e.extensionRegistry.getExtension(l.id);hasOnInstallMethod(u?.content)?e.isConnected&&o?await r(a,u,e,n,o):s("[Extensions] Device not connected - updated files will install when first opened"):a.mipPackage&&n.emit("prompt-upload-dependencies",{extensionId:l.id,extensionName:l.name}),n.emit("render")}catch(c){console.error("[Extensions] Update failed:",c),alert(`Failed to update app:
${c.message}`)}}),n.on("uninstall-extension",async l=>{s("uninstall-extension:",l);try{if(e.isConnected){const d=e.installedExtensions.find(u=>u.id===l)?.name||l;if(!confirm(`Remove ${d} from this board?

Its code is deleted. Its saved data stays.`))return;await removeDeviceExtension(new DeviceAPI$1(BridgeDevice),l)}await e.extensionRegistry.uninstallExtension(l),delete e.loadedExtensions[l];const a=`extension-styles-${l}`,c=document.getElementById(a);c&&(c.remove(),console.log(`[Extensions] Removed styles for ${l}`)),e.installedExtensions=await e.extensionRegistry.getInstalledExtensions(),e.allCachedExtensions=[...e.installedExtensions],await refreshBoardApps(e,n),e.activeExtension===l&&(e.activeExtension=null,e.activeExtensionPanel=null,e.systemSection="settings"),s(`[Extensions] Uninstalled ${l}`),n.emit("render")}catch(a){console.error("[Extensions] Uninstall failed:",a),alert(`Failed to uninstall app:
${a.message}`)}}),n.on("prompt-upload-dependencies",async({extensionId:l,extensionName:a})=>{s("prompt-upload-dependencies:",l);try{const c=await e.extensionRegistry.getDependencies(l);if(!c||!c.mipPackage)return;e.dependencyPrompt={extensionId:l,extensionName:a,dependencies:c},n.emit("render")}catch(c){console.error("[Extensions] Error getting dependencies:",c)}}),n.on("close-dependency-prompt",()=>{s("close-dependency-prompt"),e.dependencyPrompt=null,n.emit("render")}),n.on("upload-extension-dependencies",async l=>{s("upload-extension-dependencies:",l),e.dependencyPrompt=null;try{const a=e.installedExtensions.find(u=>u.id===l);if(!a||!a.mipPackage){n.emit("render");return}if(!e.isConnected){alert("Please connect to device first"),n.emit("render");return}stopStatusInfoPolling$1(),e.installingDependencies={extensionName:a.name,mipPackage:a.mipPackage},n.emit("render");const c=`
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
`,d=await o.run(c,!1);if(d&&(d.includes("error")||d.includes("Error")||d.includes("Exception")))throw new Error(`mip install failed: ${d}`);e.installingDependencies=null,e.isConnected&&o&&startStatusInfoPolling$1(o,e,n),n.emit("render"),alert("Dependencies installed successfully via mip!")}catch(a){console.error("[Extensions] Dependency installation failed:",a),e.installingDependencies=null,e.isConnected&&o&&startStatusInfoPolling$1(o,e,n),n.emit("render"),alert(`Failed to install dependencies:
${a.message}`)}}),n.on("toggle-extension-menu",l=>{e.expandedExtensions[l]=!e.expandedExtensions[l],n.emit("render")}),n.on("change-extension-panel",async({extensionId:l,panelId:a})=>{if(s("change-extension-panel:",l,a),!e.loadedExtensions[l])try{const c=await e.extensionRegistry.getExtension(l);if(!c)throw new Error(`App not found: ${l}`);e.loadedExtensions[l]={data:c,instance:null},s(`[Extensions] Loaded extension ${l} from cache`)}catch(c){console.error("[Extensions] Failed to load app:",c),alert(`Failed to load app:
${c.message}`);return}e.activeExtension=l,e.activeExtensionPanel=a,e.activeNetworkPanel=null,e.activePeripheralsPanel=null,e.activeSystemPanel=null,e.systemSection=`extension:${l}:${a}`,n.emit("render")})}const MAX_ROWS=200,RENDER_EVERY_MS$1=250,REFRESH_FILES_AFTER_MS=400,REFRESH_APPS_AFTER_MS=1e3,READ_ONLY_TOOLS=new Set(["fs_list","fs_stat","fs_read_text","device_info","scriptos_list","can_capture"]),MAY_WRITE_FILES=/\bopen\(|\bos\./,WHO_COLOUR="\x1B[36m",DIM="\x1B[2m",RED="\x1B[91m",PLAIN="\x1B[0m",LOG_INFO=1,LOG_ERROR=3;function isEmptyObject(e){return e!==null&&typeof e=="object"&&Object.keys(e).length===0}function showValue(e){return e!==null&&typeof e=="object"?JSON.stringify(e):e}function describeCall(e){const n=e.args||{};if(e.tool==="stream_open")return n.kind==="file_write"?`write ${n.path}`:n.kind==="file_read"?`read ${n.path}`:`open ${n.kind} stream`;const o=Object.entries(n).filter(([,i])=>!isEmptyObject(i)).map(([i,s])=>i==="path"||i==="id"?s:`${i}=${showValue(s)}`);return[e.tool,...o].join(" ")}function isReadOnly(e){return READ_ONLY_TOOLS.has(e.tool)||e.tool==="stream_open"&&e.args?.kind!=="file_write"}function registerAgentActivityHandlers(e,n,o){e.agentActivity={rows:[]};let i=null,s=null,r=null;function l(){i||(i=setTimeout(()=>{i=null,n.emit("render")},RENDER_EVERY_MS$1))}function a(m){const w=e.cache(XTerm,"terminal").term;w&&(w.write("\r\x1B[K"+m.replace(/\r?\n/g,`\r
`)),redrawLine(w,e.currentLine,e.cursorPos,o),w.scrollToBottom())}function c(m,w){const y=`${WHO_COLOUR}[${m.who}]${PLAIN}`;if(w.code!==void 0){const S=w.code.replace(/\n+$/,"").split(`
`);a(`${y} ${DIM}>>> ${S.join(`
... `)}${PLAIN}
`)}if(w.output){e.onTerminalOutput?.();const S=w.output.endsWith(`
`)?w.output:w.output+`
`;a(m.state==="failed"?`${RED}${S}${PLAIN}`:S)}}function d(m){m.tool!=="exec"&&(m.state==="failed"?a(`${WHO_COLOUR}[${m.who}]${PLAIN} ${describeCall(m)}: ${RED}${m.output||"failed"}${PLAIN}
`):m.state!=="running"&&!isReadOnly(m)&&a(`${WHO_COLOUR}[${m.who}]${PLAIN} ${DIM}${describeCall(m)}${PLAIN}
`))}function u(m){const w=m.state==="failed",y=m.output&&(w||m.tool!=="exec")?`
${m.output.trimEnd()}`:"";n.emit("log:add",{level:w?LOG_ERROR:LOG_INFO,message:`${describeCall(m)}: ${w?"failed":`${m.ms} ms`}${y}`.replace(/\r?\n/g,`\r
`),timestamp:m.at,source:m.who})}o.subscribe("agent_activity",m=>{const w=e.agentActivity.rows;e.agentActivity.lastCallAt=Date.now();let y=w.find(S=>S.id===m.id&&S.state==="running");y?Object.assign(y,m):(y={...m,at:Date.now()},w.push(y),w.length>MAX_ROWS&&w.shift()),y.tool==="exec"&&(c(y,m),y.state!=="running"&&MAY_WRITE_FILES.test(y.code||"")&&f()),d(y),y.state!=="running"&&u(y),l()}),o.onConnectionClosed(()=>{let m=!1;for(const w of e.agentActivity.rows)w.state==="running"&&(w.state="failed",w.output="The connection closed before it finished",u(w),m=!0);m&&l()});function f(){clearTimeout(s),s=setTimeout(()=>{e.isConnected&&n.emit("refresh-board-files")},REFRESH_FILES_AFTER_MS)}function p(m){return getFullPath(e.boardNavigationRoot,m.parentFolder,m.fileName)}async function h(m){const w=e.openFiles.filter(y=>{if(y.source!=="board"||y.parentFolder===null)return!1;const S=p(y);return S===m||S.startsWith(m+"/")});for(const y of w){if(y.hasChanges){a(`${WHO_COLOUR}${y.fileName} changed on the board. Your unsaved edits are still here, and saving replaces it.${PLAIN}
`);continue}try{const S=await o.loadFile(p(y)),$=new TextDecoder("utf-8").decode(new Uint8Array(S));$!==y.editor.content&&(y.editor.setContent($),y.hasChanges=!1)}catch(S){console.warn("[Agent] Could not reload",y.fileName,S)}}w.length&&n.emit("render")}o.subscribe("file_changed",m=>{f(),m.op!=="made"&&h(m.path)}),o.subscribe("apps_changed",()=>{r||(r=setTimeout(()=>{r=null,refreshBoardApps(e,n).catch(m=>console.warn("[Agent] Could not refresh apps:",m))},REFRESH_APPS_AFTER_MS))})}const FRAME_ORIGIN="https://agent.scriptostudio.com",LOCAL_FRAME_ORIGIN="http://localhost:5174",LOCAL_STUDIO_HOST="127.0.0.1",ANSWER_MS=8e3;function frameUrl(){const e=location.hostname===LOCAL_STUDIO_HOST?LOCAL_FRAME_ORIGIN:FRAME_ORIGIN,n=new URL("/app/agent-frame.html",e),o=new URLSearchParams(location.search).get("agent-api");o&&n.searchParams.set("api",o);const i=new URLSearchParams(location.search).get("agent-key");return i&&n.searchParams.set("key",i),n}class AgentFrame{constructor(n){this.onKey=n,this.nextRun=1,this.runs=new Map,this.answered=!1,this.waiting=[];const o=frameUrl();this.url=o,this.origin=o.origin,this.iframe=document.createElement("iframe"),this.iframe.className="agent-key-frame",this.iframe.title="API key",this.iframe.referrerPolicy="no-referrer",this.iframe.src=o,this.iframe.addEventListener("load",()=>this._post({type:"hello"})),window.addEventListener("message",i=>this._hear(i)),document.body.appendChild(this.iframe)}_post(n){this.iframe.contentWindow.postMessage(n,this.origin)}_hear(n){if(n.source!==this.iframe.contentWindow||n.origin!==this.origin)return;const o=n.data;if(o.type==="key")this.answered=!0,this.waiting.splice(0).forEach(i=>i(!0)),this.onKey(o.hasKey);else if(o.type==="close")this.iframe.classList.remove("open");else{const i=this.runs.get(o.id);if(!i)return;o.type==="delta"?i.onDelta(o):o.type==="done"?(this.runs.delete(o.id),i.resolve(o.message)):o.type==="failed"&&(this.runs.delete(o.id),i.reject(Object.assign(new Error(o.message),{kind:o.kind})))}}ready(){return this.answered?Promise.resolve(!0):(this.reloading||(this.reloading=new Promise(n=>{const o=s=>{clearTimeout(i),this.reloading=null,n(s)},i=setTimeout(()=>{this.waiting=this.waiting.filter(s=>s!==o),o(!1)},ANSWER_MS);this.waiting.push(o),this.iframe.src=this.url})),this.reloading)}ask(n,o){return new Promise((i,s)=>{const r=this.nextRun++;this.runs.set(r,{resolve:i,reject:s,onDelta:o}),this.current=r,this._post({type:"run",id:r,request:n})})}abort(){this._post({type:"abort",id:this.current})}openKeyDialog(n,o){this.iframe.classList.add("open"),this._post({type:"show",strings:n,dark:o})}}const SCRIPTO_FOLDER=/^\/lib\/ext\/[^/]+\//,RISKY_EXEC=[/\bu?os\.(?:remove|unlink|rmdir|rename|umount|mkfs)\b/,/\bfrom\s+u?os\s+import\b.*\b(?:remove|unlink|rmdir|rename|umount|mkfs)\b/,/\bmachine\.(?:reset|soft_reset|deepsleep|bootloader)\b/,/\bfrom\s+machine\s+import\b.*\b(?:reset|soft_reset|deepsleep|bootloader)\b/,/\b(?:esp32\.)?Partition\b/,/\.(?:set_boot|writeblocks)\(/,/\besp\.flash_(?:erase|write)\b/,/\bmkfs\b/];function isScriptOFile(e){return SCRIPTO_FOLDER.test(e)&&!e.includes("..")}function isRiskyCode(e){return RISKY_EXEC.some(n=>n.test(e))}function askFirst(e,n,{tools:o,scriptos:i,made:s}){switch(e){case"fs_rm":return{rule:"delete",key:"home.askDelete",params:{path:n.path},detail:""};case"fs_write_text":return isScriptOFile(String(n.path))?null:{rule:"write",key:"home.askWrite",params:{path:n.path},detail:""};case"exec":return isRiskyCode(String(n.code))?{rule:"exec",key:"home.askExec",params:{},detail:n.code}:null;case"scripto_create":return!i[n.id]||s.has(n.id)?null:{rule:"replace",key:"home.askReplace",params:{id:n.id},detail:""};case"scripto_remove":return s.has(n.id)?null:{rule:"remove",key:"home.askRemove",params:{id:n.id},detail:""};case"reset":return{rule:"reset",key:"home.askReset",params:{},detail:""};case"stop_user_tasks":return{rule:"stop",key:"home.askStop",params:{},detail:""};case"job_start":return askFirst(n.tool,n.arguments||{},{tools:o,scriptos:i,made:s})}const r=Object.values(i).some(a=>a.tools?.includes(e)),l=o.get(e);return!r||!l?.annotations?.destructiveHint?null:{rule:`tool:${e}`,key:"home.askTool",params:{tool:l.annotations.title||e},detail:l.description||""}}const DB_NAME="agent-log",DB_VERSION=1,STORE="events",BY_BOARD="board",WAS_RUNNING="The page closed while this was running, so whether it finished isn't known. Look at the board before repeating it.",NOT_RUN="The page closed before this ran.";function newChat(){return{items:[],messages:[],made:new Set,rows:new Map,open:!1}}function apply(e,n){switch(n.type){case"user":e.items.push({kind:"user",text:n.shown}),e.messages.push({role:"user",content:n.content}),e.open=!0;break;case"assistant":e.messages.push(n.message),n.message.content&&e.items.push({kind:"text",text:n.message.content});break;case"tool-start":{const o={tool:n.name,args:n.args,state:"running"};e.rows.set(n.id,o),e.items.push({kind:"call",row:o});break}case"tool-end":{const o=e.rows.get(n.id);o&&(o.state=n.isError?"failed":"done",o.output=n.text);const i=n.sent??n.text;e.messages.push({role:"tool",tool_call_id:n.id,content:n.isError?`Error: ${i}`:i});break}case"made":e.made.add(n.id);break;case"ask":e.items.push({kind:"ask",text:n.text,detail:n.detail,state:n.state});break;case"note":e.items.push({kind:"note",text:n.text,failed:n.failed,detail:n.detail});break;case"context":e.messages=n.messages;break;case"turn-end":e.open=!1;break}}function replay(e){const n=newChat();for(const o of e)apply(n,o);return n}function unansweredCalls(e){const n=e.messages.findLastIndex(i=>i.role==="assistant");if(n<0)return[];const o=new Set(e.messages.slice(n+1).map(i=>i.tool_call_id));return(e.messages[n].tool_calls||[]).filter(i=>!o.has(i.id)).map(i=>({type:"tool-end",id:i.id,isError:!0,text:e.rows.get(i.id)?.state==="running"?WAS_RUNNING:NOT_RUN}))}function request(e){return new Promise((n,o)=>{e.onsuccess=()=>n(e.result),e.onerror=()=>o(e.error)})}let opened=null;function openDb(){return opened||=new Promise((e,n)=>{const o=indexedDB.open(DB_NAME,DB_VERSION);o.onupgradeneeded=()=>{o.result.createObjectStore(STORE,{keyPath:"seq",autoIncrement:!0}).createIndex(BY_BOARD,"board")},o.onsuccess=()=>e(o.result),o.onerror=()=>n(o.error)}).catch(e=>(console.warn("[Agent] Chats will only last until this page closes:",e),null)),opened}async function append(e,n){const o=await openDb();if(!o)return;const i=o.transaction(STORE,"readwrite").objectStore(STORE).add({board:e,...n});i.onerror=()=>console.warn("[Agent] Could not keep this in the chat log:",i.error)}async function read(e){const n=await openDb();return n?request(n.transaction(STORE).objectStore(STORE).index(BY_BOARD).getAll(e)):[]}async function lastBoard(){const e=await openDb();if(!e)return null;const n=await request(e.transaction(STORE).objectStore(STORE).openCursor(null,"prev"));return n?n.value.board:null}async function forget(e){const n=await openDb();if(!n)return;const o=n.transaction(STORE,"readwrite").objectStore(STORE);for(const i of await request(o.index(BY_BOARD).getAllKeys(e)))o.delete(i)}let release=null;function claim(e){return release?.(),release=null,navigator.locks?new Promise(n=>{navigator.locks.request(`${DB_NAME}:${e}`,{ifAvailable:!0},o=>(n(!!o),o?new Promise(i=>{release=i}):void 0))}):Promise.resolve(!0)}const MAX_CONTEXT_TOKENS=1e5,CHARS_PER_TOKEN=3,COMPACT_AT=.8,MAX_RESULT_CHARS=2e4,RESULT_SHARE=.25,TRANSCRIPT_PART_CHARS=2e3,HEAD_SHARE=.7,MIN_MESSAGES_TO_SUMMARIZE=3,SUMMARY_ASK="Studio is shortening this chat to make room, and the person didn't ask for this. What's happened so far? Your answer replaces the earlier messages.",SUMMARY_PROMPT=`Below is a chat between a person and an agent working on one MicroPython board. It's being shortened, and the agent will carry on from your summary with nothing else from this part.

Write what it needs to carry on, in at most 600 words:
- What the person asked for and any preferences they gave
- What's on the board now: ScriptOs by id and whether they're running, and files changed
- What trying things showed: pins, addresses, readings, errors and what fixed them
- What was only assumed or hasn't been checked, saying so
- Where the work had got to: the last thing tried, what happened and what's left to do, so none of it gets repeated

Keep exact names, ids, paths and numbers. Leave out what's no longer true. Start with the summary itself.`;function shorten(e,n){if(e.length<=n)return e;const o=Math.floor(n*HEAD_SHARE),i=e.length-n;return`${e.slice(0,o)}
[${i} characters cut here to save room. Ask for a smaller part if you need them.]
${e.slice(o-n)}`}function estimateTokens(e){return Math.ceil(JSON.stringify(e).length/CHARS_PER_TOKEN)}function contextRoom(e,n){return e?Math.min(Math.max(e-n,e/2),MAX_CONTEXT_TOKENS):MAX_CONTEXT_TOKENS}function needsCompacting(e,n){return e>n*COMPACT_AT}function maxResultChars(e){return Math.min(MAX_RESULT_CHARS,Math.floor(e*CHARS_PER_TOKEN*RESULT_SHARE))}function hasReasoning(e){return e.some(n=>n.reasoning_details||n.reasoning)}function withoutReasoning(e){return e.map(({reasoning_details:n,reasoning:o,...i})=>i)}function transcript(e){return e.filter(n=>n.content!==SUMMARY_ASK).map(n=>{if(n.role==="user")return`Person: ${n.content}`;if(n.role==="tool")return`Result: ${shorten(n.content,TRANSCRIPT_PART_CHARS)}`;const o=(n.tool_calls||[]).map(i=>`Agent called ${i.function.name} with ${shorten(i.function.arguments,TRANSCRIPT_PART_CHARS)}`);return[n.content&&`Agent: ${n.content}`,...o].filter(Boolean).join(`
`)}).join(`

`)}function latestRequest(e){return e.findLastIndex(n=>n.role==="user")}function canCompact(e){return e.length>MIN_MESSAGES_TO_SUMMARIZE}function summaryPrompt(e,n){const o=latestRequest(e),i=[...e.slice(0,o),...e.slice(o+1)];return`${SUMMARY_PROMPT}

---

${shorten(transcript(i),n*CHARS_PER_TOKEN)}`}function compacted(e,n){return[{role:"user",content:SUMMARY_ASK},{role:"assistant",content:n},e[latestRequest(e)]]}const DEFAULT_MODEL="anthropic/claude-opus-5.5",MODELS_URL="https://openrouter.ai/api/v1/models",EFFORT="medium",MAX_TOKENS=16e3,MAX_ROUNDS=40,TOOL_TIMEOUT_MS=3e5,DECLINED="The person declined this, so leave it undone. Carry on without it, or ask them.",RECONNECT_TRIES=30,RECONNECT_WAIT_MS=1e3,RENDER_EVERY_MS=100,TERMINAL_WATCH_MS=3e4,SCRIPTO_SETTLE_MS=2e3,MODEL_STORE="agent-model",FOCUS_AFTER_MS=50,INPUT_ID="agent-input",MODEL_INPUT_ID="agent-model-search",JSON_TYPES={string:e=>typeof e=="string",number:e=>typeof e=="number",integer:e=>Number.isInteger(e),boolean:e=>typeof e=="boolean",object:e=>e!==null&&typeof e=="object"&&!Array.isArray(e),array:e=>Array.isArray(e)},PROMPT=`You're the agent inside ScriptO Studio. You do the work on one MicroPython board yourself, by calling these tools.

Never give the person code to run or paste, because code in a reply does nothing. When they ask for something on the board, do it now with a tool, then say what happened in a sentence or two.

- "The REPL", "the terminal", "the device" and "the board" all mean this board, and "MCP" means these tools.
- What exec prints appears in the person's terminal, so that's how to show them something there.
- Use exec for anything one-off.
- Make a ScriptO with scripto_create only when they want something to stay on the board or keep running.
- Choose sensible defaults, and ask only if you can't go on without an answer.
- The result of starting a ScriptO says what became of it two seconds later, so there's no need to look again. If it crashed, fix that before saying anything else.
- The person can't call tools, so never tell them to. To read a ScriptO's code, they use the Code link on its row in the sidebar.
- If a tool is refused, tell the person what it needs rather than working around it.
- Some actions ask the person first. If they decline one, respect that.

For example, for "create a sine wave in the terminal", call exec with code that prints a sine wave as lines of text.

The person watches your exec code and output in the terminal and your calls in the chat, and can stop you at any time.`;function readStored(e){try{return localStorage.getItem(e)}catch{return null}}function writeStored(e,n){try{localStorage.setItem(e,n)}catch(o){console.warn("[Agent] Could not remember",e,o)}}function invalidInput(e,n){if(!JSON_TYPES.object(n))return"The input is not an object";for(const o of e?.required||[])if(!(o in n))return`${o} is missing`;for(const[o,i]of Object.entries(n)){const s=e?.properties?.[o]?.type;if(JSON_TYPES[s]&&!JSON_TYPES[s](i))return`${o} should be a ${s}`}return null}function isForModels(e){const n=e._meta?.ui?.visibility;return!n||n.includes("model")}function toApiTool(e){return{type:"function",function:{name:e.name,description:e.description,parameters:e.inputSchema}}}function registerAgentChatHandlers(e,n,o){const i={model:readStored(MODEL_STORE)||DEFAULT_MODEL,models:[],pickingModel:!1,modelSearch:"",freeOnly:!1,running:!1,thinking:!1,draft:"",attached:null,error:null,hasKey:null,...newChat()};e.agentChat=i;const s=new AgentFrame(E=>{i.hasKey=E,n.emit("render")});let r=null,l=null,a=!1,c=null,d=null,u=!1,f=null,p=null,h=null;const m=new Set;let w=null,y=!1,S=!1,$=!0;e.onTerminalOutput=()=>{const E=Date.now()-(e.agentActivity.lastCallAt||0)<TERMINAL_WATCH_MS;$&&E&&e.panelHeight<=PANEL_CLOSED$1&&n.emit("open-panel")},n.on("close-panel",()=>{$=!1});function C(){f||(f=setTimeout(()=>{f=null,n.emit("render")},RENDER_EVERY_MS))}function _(){setTimeout(()=>document.getElementById(INPUT_ID)?.focus(),FOCUS_AFTER_MS)}function x(E){apply(i,E),a&&append(l,E),C()}function b(E,T=!1,D=""){x({type:"note",text:E,failed:T,detail:D})}function k(){const E=r;r=null,E&&E.disconnect()}function F(E=[]){Object.assign(i,replay(E)),d=crypto.randomUUID(),p=null,h=null,i.error=null,m.clear()}async function A(E){if(k(),l=E,a=await claim(E),F(a?await read(E):[]),i.open){for(const T of unansweredCalls(i))x(T);b(t("home.interrupted"),!0),x({type:"turn-end"})}n.emit("render")}const R=E=>console.warn("[Agent] Could not restore the chat:",E);let I=lastBoard().then(E=>E&&A(E)).catch(R);function O({key:E,params:T,detail:D}){return new Promise(N=>{const P={kind:"ask",text:t(E,T),detail:D,state:"waiting"};i.items.push(P),w=M=>{w=null,i.items.splice(i.items.indexOf(P),1),x({type:"ask",text:P.text,detail:D,state:M==="deny"?"denied":"allowed"}),N(M)},C()})}async function z(){if(S&&(S=!1,k()),r?.state==="CONNECTED")return r;for(let E=0;;E++){if(u)throw new Error(t("home.stopped"));const T=new McpDevice;try{return await T.connectAsAgent(l,c),r=T,r}catch(D){if(E>=RECONNECT_TRIES)throw D;await new Promise(N=>setTimeout(N,RECONNECT_WAIT_MS))}}}async function V(E,T){const D={model:i.model,max_tokens:MAX_TOKENS,stream:!0,reasoning:{effort:EFFORT},cache_control:{type:"ephemeral"},session_id:d,tools:T,messages:[{role:"system",content:E},...i.messages]},N=i.messages.length;let P=null;i.thinking=!0,C();try{const M=await s.ask(D,({text:B})=>{P||(P={kind:"text",text:""},i.items.push(P),i.thinking=!1),P.text+=B,C()});return P&&i.items.splice(i.items.indexOf(P),1),p=M.usage?.prompt_tokens?{tokens:M.usage.prompt_tokens,count:N}:null,M}finally{i.thinking=!1}}function X(E,T){return p?p.tokens+estimateTokens(i.messages.slice(p.count)):estimateTokens({system:E,tools:T,messages:i.messages})}function q(){return hasReasoning(i.messages)?(x({type:"context",messages:withoutReasoning(i.messages)}),p=null,!0):!1}async function Y(E){if(!canCompact(i.messages))return!1;i.thinking=!0,C();try{const T={model:i.model,max_tokens:MAX_TOKENS,stream:!0,reasoning:{effort:EFFORT},messages:[{role:"user",content:summaryPrompt(i.messages,E)}]},{message:D}=await s.ask(T,()=>{});if(!D.content)throw new Error(t("home.compactFailed"));return x({type:"context",messages:compacted(i.messages,D.content)}),b(t("home.compacted"),!1,D.content),p=null,!0}finally{i.thinking=!1}}async function Z(E,T,D){try{return await V(E,T)}catch(N){if(!(N.kind==="too-long"?await Y(D):N.kind==="stale-reasoning"&&q()))throw N;return V(E,T)}}async function ee(E,T,D){await new Promise(P=>setTimeout(P,SCRIPTO_SETTLE_MS));const N=(await E.appsList()).find(P=>P.id===T);return N?.error?{text:`${D}

It crashed within two seconds, so it isn't working:
${N.error}`,isError:!0}:{text:`${D}

Two seconds later: ${N?.why||N?.state}.`,isError:!1}}async function ne(E,T,D){const N=E.function.name;let P=null;try{P=JSON.parse(E.function.arguments||"{}")}catch(L){console.warn("[Agent] Bad tool input:",L)}const M=P&&!u?askFirst(N,P,{tools:T,scriptos:e.deviceApps||{},made:i.made}):null;if(M&&!m.has(M.rule)){const L=await O(M);if(L==="deny"){x({type:"tool-end",id:E.id,text:DECLINED,isError:!0});return}L==="allow-chat"&&m.add(M.rule)}x({type:"tool-start",id:E.id,name:N,args:P||{}});const B=(L,H)=>{const j=shorten(L,maxResultChars(D));x({type:"tool-end",id:E.id,text:L,isError:H,...j===L?{}:{sent:j}})};if(u)return B(t("home.stopped"),!0);const U=P===null?"The input is not valid JSON":invalidInput(T.get(N)?.inputSchema,P);if(U)return B(`${U}: ${E.function.arguments}`,!0);try{const L=await z(),{text:H,isError:j}=await L.callTool(N,P,TOOL_TIMEOUT_MS);if(N==="scripto_create"&&!j&&x({type:"made",id:P.id}),!j&&(N==="scripto_start"||N==="scripto_create"&&P.start!==!1)&&!u){const W=await ee(L,P.id,H);return B(W.text,W.isError)}return B(H,j)}catch(L){return B(L.message,!0)}}async function te(){const E=await z(),T=(await E.listTools()).filter(isForModels).sort((U,L)=>U.name.localeCompare(L.name)),D=new Map(T.map(U=>[U.name,U])),N=T.map(toApiTool),P=`${PROMPT}

${E.instructions}`,M=`${i.model}
${P}
${JSON.stringify(N)}`;M!==h&&q(),h=M,await Q();const B=contextRoom(i.models.find(U=>U.id===i.model)?.contextLength,MAX_TOKENS);for(let U=0;U<MAX_ROUNDS;U++){needsCompacting(X(P,N),B)&&await Y(B);const{message:L,finishReason:H,refusal:j}=await Z(P,N,B);x({type:"assistant",message:L});const K=L.tool_calls||[],W=H==="content_filter"||!!j;if(W||H==="length"){for(const J of K)x({type:"tool-end",id:J.id,text:t("home.notRun"),isError:!0});b(j||t(W?"home.refused":"home.cutShort"),!0);return}if(!K.length)return;for(const J of K)await ne(J,D,B);if(u)return}b(t("home.tooManyRounds"),!0)}async function G(E){if(!await s.ready()){i.error=t("home.frameMissing"),n.emit("render");return}i.error===t("home.frameMissing")&&(i.error=null,n.emit("render")),s.openKeyDialog({title:t("home.keyTitle"),hint:t("home.keyHint"),placeholder:t("home.keyPlaceholder"),save:t("home.keySave"),cancel:t("home.cancel"),forget:t("home.keyForget"),badShape:t("home.keyBadShape"),problem:E||""},document.documentElement.getAttribute("data-theme")==="dark")}async function oe(){const E=i.draft.trim();if(i.running||y)return;if(i.error=null,e.isConnected?!E&&!i.attached&&(i.error=t("home.typeSomething")):i.error=t("home.connectBoardFirst"),i.error){n.emit("render");return}y=!0;const T=await s.ready();if(y=!1,!T){i.error=t("home.frameMissing"),n.emit("render");return}if(!i.hasKey){G();return}const D=i.attached?`${i.attached.label}
${E}`.trim():E,N=i.attached?`${i.attached.text}

${E}`.trim():E;i.draft="",i.attached=null,i.running=!0,u=!1,$=!0;try{await I,l!==e.connectedPort&&await A(e.connectedPort),c=BridgeDevice.agentToken,x({type:"user",shown:D,content:N}),n.emit("render"),await te()}catch(P){P.kind==="auth"?(G(t("home.keyRejected")),b(t("home.keyRejected"),!0)):P.kind==="no-key"?G():P.kind==="credits"?b(t("home.noCredits"),!0):P.kind!=="aborted"&&b(P.message,!0)}finally{x({type:"turn-end"}),i.running=!1,n.emit("render")}}async function Q(){if(!i.models.length)try{const{data:E}=await(await fetch(MODELS_URL)).json();i.models=E.filter(T=>T.supported_parameters?.includes("tools")&&!T.id.endsWith(":batch")).map(T=>({id:T.id,free:T.pricing?.prompt==="0"&&T.pricing?.completion==="0",contextLength:T.context_length})).sort((T,D)=>T.id.localeCompare(D.id))}catch(E){console.warn("[Agent] Could not list models:",E)}}n.on("agent-chat-send",oe),n.on("agent-chat-draft",E=>{i.draft=E,i.error&&(i.error=null,n.emit("render"))}),n.on("agent-chat-suggest",E=>{i.draft=E,i.error=null,n.emit("render"),_()}),n.on("agent-chat-attach",E=>{i.attached=E,i.error=null,n.emit("change-system-section","home"),_()}),n.on("agent-chat-detach",()=>{i.attached=null,n.emit("render")}),n.on("agent-chat-stop",()=>{u=!0,w?.("deny"),s.abort(),r?.breakRunning(),k(),b(t("home.stopped"))}),n.on("agent-chat-new",()=>{i.running||(a&&forget(l),F(),i.attached=null,n.emit("render"))}),n.on("board-connected",()=>{I=I.then(()=>{if(!i.running&&l!==e.connectedPort)return A(e.connectedPort)}).catch(R)}),n.on("board-manifest-updated",()=>{S=!0}),n.on("agent-key-open",()=>G()),n.on("agent-ask-answer",E=>w?.(E)),n.on("agent-model-pick",async()=>{i.pickingModel=!0,i.modelSearch="",n.emit("render"),setTimeout(()=>document.getElementById(MODEL_INPUT_ID)?.focus()),await Q(),n.emit("render")}),n.on("agent-model-search",E=>{i.modelSearch=E,n.emit("render")}),n.on("agent-model-free-only",E=>{i.freeOnly=E,n.emit("render")}),n.on("agent-model-set",E=>{i.pickingModel=!1,E.trim()&&(i.model=E.trim(),writeStored(MODEL_STORE,i.model)),n.emit("render")}),o.onConnectionClosed(k)}const MAX_SUGGESTIONS=3,SHOWN_CALL_CHARS=100,SHOWN_MODELS=60,LOG_ID="agent-log",SIZE_TAG=/^a?\d+b$/,SUGGESTIONS=[{id:"tilt",needs:["imu","buzzer"]},{id:"canLog",needs:["can"]},{id:"drift",needs:["rtc"]},{id:"ledFade",needs:["status_led"]},{id:"freeMemory",needs:[]}];function selectsAll(e){return(e.metaKey||e.ctrlKey)&&e.key?.toLowerCase()==="a"}function selectChat(e){e.preventDefault();const n=document.getElementById(LOG_ID);n.focus({preventScroll:!0}),window.getSelection().selectAllChildren(n)}function modelName(e){return e.split("/").pop().split(":")[0].split("-").filter(o=>o&&!SIZE_TAG.test(o)).map(o=>o[0].toUpperCase()+o.slice(1)).join(" ")}function Call(e){const n=describeCall(e);return html$1`<div class="agent-call ${e.state}" title=${e.output||""}>${n.length>SHOWN_CALL_CHARS?`${n.slice(0,SHOWN_CALL_CHARS)}…`:n}</div>`}function Ask(e,n){return html$1`
    <div class="agent-ask ${e.state}">
      <div class="agent-ask-text">${e.text}</div>
      ${e.detail?html$1`<pre class="agent-ask-detail">${e.detail}</pre>`:""}
      ${e.state==="waiting"?html$1`
        <div class="agent-ask-buttons">
          <button class="home-button primary" onclick=${()=>n("agent-ask-answer","allow")}>${t("home.allow")}</button>
          <button class="home-button" onclick=${()=>n("agent-ask-answer","allow-chat")}>${t("home.allowChat")}</button>
          <button class="home-button" onclick=${()=>n("agent-ask-answer","deny")}>${t("home.deny")}</button>
        </div>
      `:html$1`<div class="agent-ask-result">${t(`home.${e.state}`)}</div>`}
    </div>
  `}function Item(e,n){return e.kind==="ask"?Ask(e,n):e.kind==="call"?Call(e.row):e.kind==="user"?html$1`<pre class="agent-user">${e.text}</pre>`:e.kind==="note"?html$1`<div class="agent-note ${e.failed?"failed":""}" title=${e.detail||""}>${e.text}</div>`:AgentText(e.text)}function Suggestions(e,n){const o=e.boardConfig?.capabilities||{};return SUGGESTIONS.filter(i=>i.needs.every(s=>o[s])).slice(0,MAX_SUGGESTIONS).map(i=>{const s=t(`home.suggest.${i.id}`);return html$1`<button class="agent-suggestion" onclick=${()=>n("agent-chat-suggest",s)}>${s}</button>`})}function Start(e,n){return html$1`
    <div class="agent-start">
      <h2>${t("home.question")}</h2>
      ${e.isConnected?Suggestions(e,n):html$1`<p class="home-muted">${t("home.connectBoardFirst")}</p>`}
    </div>
  `}function ModelPicker(e,n){const o=e.agentChat;if(!o.pickingModel)return html$1`<button class="home-link" title=${t("home.model")} onclick=${()=>n("agent-model-pick")}>${o.model}</button>`;const i=o.modelSearch.trim(),s=o.models.filter(l=>(!o.freeOnly||l.free)&&l.id.toLowerCase().includes(i.toLowerCase())),r=l=>{l.key==="Escape"&&n("agent-model-set",""),l.key==="Enter"&&n("agent-model-set",s[0]?.id||i)};return html$1`
    <div class="agent-model">
      <input
        id=${MODEL_INPUT_ID}
        aria-label=${t("home.model")}
        placeholder=${t("home.modelSearch")}
        value=${o.modelSearch}
        oninput=${l=>n("agent-model-search",l.target.value)}
        onkeydown=${r}
      />
      <div class="agent-model-options">
        <label class="agent-model-free">
          <input type="checkbox" checked=${o.freeOnly} onchange=${l=>n("agent-model-free-only",l.target.checked)} />
          ${t("home.freeOnly")}
        </label>
        <button class="home-link" onclick=${()=>n("agent-model-set","")}>${t("home.cancel")}</button>
      </div>
      <div class="agent-model-list">
        ${s.slice(0,SHOWN_MODELS).map(l=>html$1`
          <button class="agent-model-row ${l.id===o.model?"current":""}" onclick=${()=>n("agent-model-set",l.id)}>
            <span>${l.id}</span>
            ${l.free?html$1`<span class="agent-model-tag">${t("home.free")}</span>`:""}
          </button>
        `)}
      </div>
    </div>
  `}function Composer(e,n){const o=e.agentChat,i=s=>{s.key==="Enter"&&!s.shiftKey&&(s.preventDefault(),n("agent-chat-send")),selectsAll(s)&&!o.draft&&selectChat(s)};return html$1`
    <div id="agent-composer" class="agent-composer">
      <div class="agent-attached-slot">
        ${o.attached?html$1`
          <button class="agent-attached" title=${t("home.detach")} onclick=${()=>n("agent-chat-detach")}>${o.attached.label} ×</button>
        `:""}
      </div>
      <div class="agent-composer-row">
        <textarea
          id=${INPUT_ID}
          rows="2"
          aria-label=${t("home.question")}
          placeholder=${t("home.placeholder")}
          oninput=${s=>n("agent-chat-draft",s.target.value)}
          onkeydown=${i}
        >${o.draft}</textarea>
        ${o.running?html$1`<button class="home-button" onclick=${()=>n("agent-chat-stop")}>${t("home.stop")}</button>`:html$1`<button class="home-button primary" onclick=${()=>n("agent-chat-send")}>${t("home.send")}</button>`}
      </div>
      ${o.error?html$1`<div class="agent-note failed">${o.error}</div>`:""}
      ${o.hasKey===!1?html$1`<p class="home-muted">${t("home.needsKey")}</p>`:""}
      <div class="agent-links">
        <button class="home-link" onclick=${()=>n("agent-key-open")}>${t(o.hasKey?"home.changeKey":"home.addKey")}</button>
        <button class="home-link" onclick=${()=>n("change-system-section","system:agent")}>${t("home.useAnother")}</button>
        ${ModelPicker(e,n)}
      </div>
    </div>
  `}function AgentPane(e,n){const o=e.agentChat;if(!o)return html$1`<aside class="agent-pane"></aside>`;const i=(e.agentActivity?.rows||[]).filter(r=>r.who!==AGENT_CLIENT_NAME),s=i.some(r=>r.state==="running");return html$1`
    <aside class="agent-pane">
      <div class="agent-head">
        <span class="home-muted">${t("home.agent")}</span>
        <h2 title=${o.model}>${modelName(o.model)}</h2>
        <span class="home-dot ${e.isConnected?"on":""} ${o.running?"working":""}"></span>
        <span class="agent-head-gap"></span>
        ${o.items.length&&!o.running?html$1`<button class="home-link" onclick=${()=>n("agent-chat-new")}>${t("home.newChat")}</button>`:""}
      </div>
      <div id=${LOG_ID} class="agent-log" tabindex="-1" onkeydown=${r=>{selectsAll(r)&&selectChat(r)}}>
        <div class="agent-log-items">
          ${o.items.length?o.items.slice(-300).map(r=>Item(r,n)):Start(e,n)}
          ${o.thinking?html$1`<div class="agent-note">${t("home.thinking")}</div>`:""}
        </div>
      </div>
      ${i.length?html$1`
        <div class="agent-outside">
          <div class="agent-outside-head">
            <span>${t("home.otherAgents")}</span>
            ${s?html$1`<button class="home-button" onclick=${()=>n("stop")}>${t("home.stop")}</button>`:""}
          </div>
          <div class="agent-outside-calls">
            ${i.slice(-40).reverse().map(Call)}
          </div>
        </div>
      `:""}
      ${Composer(e,n)}
    </aside>
  `}function SystemView(e,n){e.sidebarIconRotated===void 0&&(e.sidebarIconRotated=!1);const o=e.connectionMode==="webrepl"?"#00FF7F":e.connectionMode==="usb"?"#FF9500":"var(--text-secondary)",i=html$1`
    <div class="sidebar-header">
      <div
        class="sidebar-header-logo connection-${e.connectionMode||"none"}"
        onclick=${()=>{e.connectionMode==="usb"?handleDisconnect():e.isConnected?n("disconnect"):n("connect")}}
        title=${e.connectionMode==="usb"?"Disconnect USB Device":e.isConnected?"Disconnect from Device":"Connect to Device"}
        style="color: ${o}"
      >
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>
      </div>
    </div>
  `,s=e.systemSection,r=!s||s==="home"||s==="landing",l=e.agentChat?.items.some(a=>a.kind==="ask"&&a.state==="waiting");return html$1`
    <div class="working-area">
      <div class="system-container with-agent" style="--board-width: ${e.boardWidth}px">
        ${i}
        <aside class="system-sidebar">
          ${SystemSidebar(e,n)}
        </aside>
        <main class="system-content">
          ${!r&&l?html$1`
            <button class="agent-waiting" onclick=${()=>n("change-system-section","home")}>${t("home.agentWaiting")}</button>
          `:""}
          ${renderActivePanel(e,n)}
        </main>
        <div
          class="system-divider"
          role="separator"
          aria-orientation="vertical"
          onmousedown=${a=>n("start-resizing-board",a)}
        ></div>
        <div class="system-board">
          ${BoardPane(e,n)}
          ${ReplPanel(e,n)}
        </div>
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
  `}function SystemSidebar(e,n){const o=[{id:"home",label:t("sidebar.home"),icon:"home"}],i=[{id:"editor",label:t("sidebar.editor"),icon:"code"},{id:"file-manager",label:t("sidebar.files"),icon:"folder"}],s=[{id:"about",label:t("sidebar.about"),icon:"info-circle"},{id:"settings",label:t("sidebar.settings"),icon:"adjustments-alt"},{id:"agent",label:t("sidebar.agent"),icon:"robot-face"},{id:"firmware",label:t("sidebar.firmware"),icon:"file-download"}],r=[{id:"wifi",label:t("sidebar.wifi"),icon:"wifi"},{id:"ethernet",label:t("sidebar.ethernet"),icon:"cloud-network"},{id:"vpn",label:t("sidebar.vpn"),icon:"shield-chevron"},{id:"btle",label:t("sidebar.btle"),icon:"bluetooth"},{id:"wwan",label:t("sidebar.wwan"),icon:"cell"},{id:"mqtt",label:t("sidebar.mqtt"),icon:"message-2"},{id:"twilio",label:t("sidebar.telephony"),icon:"phone"},{id:"ntp",label:t("sidebar.ntp"),icon:"clock-cog"},{id:"can",label:t("sidebar.can"),icon:"car-crash"}],l=[{id:"gps",label:t("sidebar.gps"),icon:"gps"},{id:"4g-modem",label:t("sidebar.modem"),icon:"signal-4g"},{id:"sdcard",label:t("sidebar.sdcard"),icon:"device-sd-card"}],a=o.map(b=>renderSidebarItem(b,e,n)),c=i.map(b=>renderSidebarItem(b,e,n)),d=e.expandedSystem!==!1,u=e.agentActivity?.rows.some(b=>b.state==="running"),f=html$1`<span class="agent-busy"></span>`,p=html$1`
    <div class="system-sidebar-extension">
      <div 
        class="system-sidebar-item system-sidebar-toggle"
        onclick=${()=>n("toggle-system-menu")}
      >
        ${IconSprite.renderIcon("settings",{className:"",size:20})}
        <span>${t("sidebar.system")}</span>
        ${u&&!d?f:""}
        ${IconSprite.renderIcon("chevron-down",{className:`expand-icon ${d?"expanded":""}`,size:16})}
      </div>
      
      ${d?html$1`
        <div class="system-sidebar-submenu">
          ${s.map(b=>{const k=e.activeSystemPanel===b.id;return html$1`
              <div 
                class="system-sidebar-subitem ${k?"active":""}"
                onclick=${()=>n("change-system-panel",b.id)}
              >
                ${IconSprite.renderIcon(b.icon,{className:"",size:16})}
                <span>${b.label}</span>
                ${b.id==="agent"&&u?f:""}
              </div>
            `})}
        </div>
      `:""}
    </div>
  `,h=e.expandedNetworks!==!1,m=html$1`
    <div class="system-sidebar-extension">
      <div 
        class="system-sidebar-item system-sidebar-toggle"
        onclick=${()=>n("toggle-networks-menu")}
      >
        ${IconSprite.renderIcon("network",{className:"",size:20})}
        <span>${t("sidebar.networks")}</span>
        ${IconSprite.renderIcon("chevron-down",{className:`expand-icon ${h?"expanded":""}`,size:16})}
      </div>
      
      ${h?html$1`
        <div class="system-sidebar-submenu">
          ${r.map(b=>{const k=e.activeNetworkPanel===b.id;return html$1`
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
  `,w=e.expandedPeripherals!==!1,y=html$1`
    <div class="system-sidebar-extension">
      <div
        class="system-sidebar-item system-sidebar-toggle"
        onclick=${()=>n("toggle-peripherals-menu")}
      >
        ${IconSprite.renderIcon("cpu",{className:"",size:20})}
        <span>${t("sidebar.peripherals")}</span>
        ${IconSprite.renderIcon("chevron-down",{className:`expand-icon ${w?"expanded":""}`,size:16})}
      </div>
      
      ${w?html$1`
        <div class="system-sidebar-submenu">
          ${l.map(b=>{const k=e.activePeripheralsPanel===b.id;return html$1`
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
  `,S=b=>{if(b.iconSvg)return html$1`<span class="icon icon-extension">${raw(b.iconSvg)}</span>`;const k=b.icon||"settings";return IconSprite.renderIcon(k,{className:"",size:20})},$=(e.installedExtensions||[]).map(b=>{const k=e.expandedExtensions[b.id],F=e.activeExtension===b.id,A=b.devices===!0;let R=null;if(A&&k)if(!e.loadedExtensions[b.id])console.warn("[System] Extension not loaded:",b.id);else{const I=e.loadedExtensions[b.id];if(!I.instance)try{const O=I.data.content,V=new Function("DeviceAPI","html","emit","state",`
              ${O}
              const classMatch = ${JSON.stringify(O)}.match(/class\\s+(\\w+(?:App|Extension))\\s*{/);
              if (!classMatch) {
                throw new Error('No extension class found');
              }
              return eval(classMatch[1]);
            `)(DeviceAPI,html$1,n,e),X=new DeviceAPI(BridgeDevice),q=new V(X,n,e,html$1);e.loadedExtensions[b.id].instance=q}catch(O){console.error(`[System] Error instantiating extension ${b.id}:`,O)}if(I.instance&&typeof I.instance.getMenuItems=="function")try{const O=I.instance.getMenuItems();O&&Array.isArray(O)&&(b.menu=O)}catch(O){console.error(`[System] Error getting menu items for ${b.id}:`,O)}if(I.instance&&typeof I.instance.renderSidebarDevices=="function")try{R=I.instance.renderSidebarDevices()}catch(O){console.error(`[System] Error rendering sidebar devices for ${b.id}:`,O)}else console.warn(`[System] renderSidebarDevices not available for ${b.id}`)}if(k&&e.loadedExtensions[b.id]?.instance){const I=e.loadedExtensions[b.id];if(I.instance&&typeof I.instance.getMenuItems=="function")try{const O=I.instance.getMenuItems();O&&Array.isArray(O)&&(b.menu=O)}catch(O){console.error(`[System] Error getting menu items for ${b.id}:`,O)}}return html$1`
      <div class="system-sidebar-extension">
        <div 
          class="system-sidebar-item system-sidebar-toggle ${F?"active-extension":""}"
          onclick=${()=>n("toggle-extension-menu",b.id)}
        >
          ${S(b)}
          <span>${b.name}</span>
          ${IconSprite.renderIcon("chevron-down",{className:`expand-icon ${k?"expanded":""}`,size:16})}
        </div>
        
        ${k?html$1`
          <div class="system-sidebar-submenu">
            ${b.menu.map(I=>{const O=e.activeExtension===b.id&&e.activeExtensionPanel===I.id,z=I.disabled===!0;return html$1`
                <div 
                  class="system-sidebar-subitem ${O?"active":""} ${z?"disabled":""}"
                  onclick=${z?null:()=>n("change-extension-panel",{extensionId:b.id,panelId:I.id})}
                  style=${z?"opacity: 0.6; cursor: default; font-weight: 600;":""}
                >
                  <span>${I.label}</span>
                </div>
              `})}
            
            ${A?html$1`
              <div class="system-sidebar-devices-section">
                <div class="system-sidebar-devices-header">
                  DEVICES
                </div>
                ${R||html$1`
                  <div style="padding: 12px; text-align: center; color: var(--text-secondary); font-size: 11px;">
                    Loading...
                  </div>
                `}
              </div>
            `:""}
          </div>
        `:""}
      </div>
    `}),C=html$1`
    <div class="system-sidebar-extensions-header">
      <span>${t("apps")}</span>
      <button 
        class="extensions-add-button" 
        onclick=${()=>n("open-extensions-modal")}
        title=${t("add_app")}
      >
        +
      </button>
    </div>
  `,_=html$1`
    <div class="system-sidebar-divider"></div>
  `,x=html$1`
    <div class="sidebar-footer">
      ${window.LanguageSelector?window.LanguageSelector(e,n):""}
    </div>
  `;return html$1`
    <div class="system-sidebar-content">
      ${a}
      ${c}
      ${m}
      ${y}
      ${p}
      ${_}
      ${C}
      ${$}
      ${x}
    </div>
  `}function renderSidebarItem(e,n,o){const i=n.systemSection===e.id,r=["editor","file-manager"].includes(e.id)?"change-view":"change-system-section";return html$1`
    <div
      class="system-sidebar-item ${i?"active":""}"
      onclick=${()=>o(r,e.id)}
    >
      ${IconSprite.renderIcon(e.icon,{className:"",size:20})}
      <span>${e.label}</span>
    </div>
  `}function renderActivePanel(e,n){const o=e.systemSection;if(o==="editor")return EditorContent(e,n);if(o==="file-manager")return FileManagerContent(e,n);if(o==="landing")return AgentPane(e,n);if(o?.startsWith("extension:"))return ExtensionContainer(e,n,html$1);if(o?.startsWith("network:"))switch(o.split(":")[1]){case"wifi":return WiFiPanel(e,n);case"ethernet":return EthernetPanel(e,n);case"vpn":return VPNPanel(e,n);case"btle":return BTLEPanel(e,n);case"wwan":return WWANPanel(e,n);case"mqtt":return MQTTPanel(e,n);case"twilio":return TwilioPanel(e,n);case"ntp":return NTPPanel(e,n);case"can":return CANPanel(e,n);default:return WiFiPanel(e,n)}if(o?.startsWith("peripherals:"))switch(o.split(":")[1]){case"gps":return GPSPanel(e,n);case"4g-modem":return ModemPanel(e,n);case"sdcard":return SDCardPanel(e,n);default:return GPSPanel(e,n)}if(o?.startsWith("system:"))switch(o.split(":")[1]){case"about":return SysInfoPanel(e,n);case"settings":return AppearancePanel(e,n);case"agent":return AgentPanel(e,n);case"firmware":return FirmwarePanel(e,n);default:return AppearancePanel(e,n)}return AgentPane(e,n)}const cacheBuster=Date.now(),load=e=>fetch(`locales/${e}.json?v=${cacheBuster}`).then(n=>n.ok?n.json():Promise.reject(new Error(`HTTP ${n.status}`))).catch(n=>(console.warn(`[i18n] ${e} not loaded:`,n),null));window.i18nReady=Promise.all([null,load("de"),load("es"),load("fr"),load("zh")]).then(([e,n,o,i,s])=>{if(window.i18n){window.i18n.initTranslations(e,n,o,i,s);const r=localStorage.getItem("locale")||"en";window.i18n.setLocale(r),console.log("[i18n] Translations loaded, locale set to:",r),window.appInstance&&window.appInstance.emitter.emit("render")}else console.warn("[i18n] window.i18n not available yet");return!0}).catch(e=>(console.error("[i18n] Failed to load translations:",e),!1));const newFileContent=`# This program was created in ScriptO Studio for MicroPython

print('Hello, ')
print('ScriptO!') # ●
`;async function sleep(e){return new Promise(n=>setTimeout(n,e))}async function confirmDialog(e,n,o){return confirm(e)?0:1}function updateStatusBarDirectly(e,n){const o=document.getElementById("status-bar");if(!o)return;const i=n||localStorage.getItem("temperatureUnit")||"degC",s=buildStatusBarModel?buildStatusBarModel(e,i):null;if(!s||!s.connected){o.className="disconnected";const f=o.querySelector(".status-bar-center");f?f.textContent=s&&s.disconnectedText||DISCONNECTED_STATUS_TEXT:o.textContent=s&&s.disconnectedText||DISCONNECTED_STATUS_TEXT;return}o.className="";const r=o.querySelector(".status-bar-center")||o;function l(f){let p=r.querySelector(`.status-item.${f}`);if(!p){p=document.createElement("div"),p.className=`status-item ${f}`;const h=document.createElement("span");h.className="status-label";const m=document.createElement("span");m.className="status-value",p.appendChild(h),p.appendChild(m),r.appendChild(p)}return p}const a=l("ram");a.querySelector(".status-label").textContent="RAM",a.querySelector(".status-value").textContent=s.ram;const c=r.querySelector(".status-item.temp");if(s.temp){const f=l("temp");f.querySelector(".status-label").textContent="TEMP",f.querySelector(".status-value").textContent=s.temp}else c&&c.remove();const d=l("uptime");d.querySelector(".status-label").textContent="UPTIME",d.querySelector(".status-value").textContent=s.uptime;const u=r.querySelector(".status-item.wifi-rssi");if(s.rssi){const f=l("wifi-rssi");f.querySelector(".status-label").textContent="RSSI",f.querySelector(".status-value").textContent=s.rssi}else u&&u.remove()}function updateOverlayDirectly(e){const n=document.getElementById("overlay");if(!n)return;let o=!1,i="";if(e.diskFiles==null)o=!0,i="<p>Loading files...</p>";else if(e.isRemoving)o=!0,i="<p>Removing...</p>";else if(e.isConnecting)o=!0,i="<p>Connecting...</p>";else if(e.isLoadingFiles)o=!0,i="<p>Loading files...</p>";else if(e.isSaving)o=!0,i=`<p>Saving file... ${e.savingProgress||0}</p>`;else if(e.isTransferring){o=!0;const s=String(e.transferringProgress||""),r=s.match(/(\d+)%?$/),l=r?parseInt(r[1]):0,a=s.match(/^(.+?):/);i=`
      <div class="transfer-overlay-content">
        <div class="transfer-title">Transferring File</div>
        <div class="transfer-filename">${a?a[1]:"file"}</div>
        <div class="transfer-progress-container">
          <div class="transfer-progress-bar">
            <div class="transfer-progress-fill" style="width: ${l}%"></div>
          </div>
          <div class="transfer-progress-text">${l}%</div>
        </div>
      </div>
    `}o?(n.classList.remove("closed"),n.classList.add("open"),n.innerHTML=i):(n.classList.remove("open"),n.classList.add("closed"))}class RegistryCache{constructor(){this.DB_NAME="scripto-studio-registry-cache",this.DB_VERSION=1,this.STORE_SCRIPTOS="scriptos",this.STORE_INDEX="index",this.INDEX_CACHE_KEY="index",this.INDEX_CACHE_EXPIRY=24*60*60*1e3}async _initDB(){return new Promise((n,o)=>{const i=indexedDB.open(this.DB_NAME,this.DB_VERSION);i.onerror=()=>o(i.error),i.onsuccess=()=>n(i.result),i.onupgradeneeded=s=>{const r=s.target.result;r.objectStoreNames.contains(this.STORE_SCRIPTOS)||r.createObjectStore(this.STORE_SCRIPTOS),r.objectStoreNames.contains(this.STORE_INDEX)||r.createObjectStore(this.STORE_INDEX)}})}async getIndex(){try{const n=await this._initDB();return new Promise((o,i)=>{const l=n.transaction([this.STORE_INDEX],"readonly").objectStore(this.STORE_INDEX).get(this.INDEX_CACHE_KEY);l.onsuccess=()=>{const a=l.result;if(a&&a.data){const c=Date.now()-a.timestamp;c<this.INDEX_CACHE_EXPIRY?(console.log("[Registry Cache] Using cached index (age:",Math.round(c/1e3/60),"minutes)"),o(a.data)):(console.log("[Registry Cache] Index cache expired"),o(null))}else o(null)},l.onerror=()=>i(l.error)})}catch(n){return console.error("[Registry Cache] Error getting index:",n),null}}async saveIndex(n){try{const o=await this._initDB();return new Promise((i,s)=>{const a=o.transaction([this.STORE_INDEX],"readwrite").objectStore(this.STORE_INDEX).put({data:n,timestamp:Date.now()},this.INDEX_CACHE_KEY);a.onsuccess=()=>{console.log("[Registry Cache] Saved index"),i()},a.onerror=()=>s(a.error)})}catch(o){console.error("[Registry Cache] Error saving index:",o)}}async getScriptO(n){try{const o=await this._initDB();return new Promise((i,s)=>{const a=o.transaction([this.STORE_SCRIPTOS],"readonly").objectStore(this.STORE_SCRIPTOS).get(n);a.onsuccess=()=>{const c=a.result;c&&c.content?(console.log("[Registry Cache] Using cached ScriptO:",n),i(c)):i(null)},a.onerror=()=>s(a.error)})}catch(o){return console.error("[Registry Cache] Error getting ScriptO:",o),null}}async saveScriptO(n,o,i){try{const s=await this._initDB();return new Promise((r,l)=>{const d=s.transaction([this.STORE_SCRIPTOS],"readwrite").objectStore(this.STORE_SCRIPTOS).put({url:n,content:o,config:i,timestamp:Date.now()},n);d.onsuccess=()=>{console.log("[Registry Cache] Saved ScriptO:",n),r()},d.onerror=()=>l(d.error)})}catch(s){console.error("[Registry Cache] Error saving ScriptO:",s)}}}const BOARD_WIDTH_STORE="board-width",BOARD_WIDTH_DEFAULT=420;async function initializeState(e,n,o){const i=BridgeDisk;e.platform=navigator.platform.indexOf("Mac")>-1?"darwin":"linux",e.systemSection=null,e.diskNavigationPath="/",e.isInitializing=!0,e.boardWidth=Number(localStorage.getItem(BOARD_WIDTH_STORE))||BOARD_WIDTH_DEFAULT,e.commandHistory=[],e.historyIndex=-1,e.cursorPos=0,await i.initialize(),e.diskNavigationRoot="/",console.log("[Store] Using IndexedDB virtual filesystem, root:",e.diskNavigationRoot),e.isInitializing=!1,n.emit("render"),e.diskFiles=[],e.boardNavigationPath="/",e.boardNavigationRoot="/",e.boardFiles=[],e.openFiles=[],e.selectedFiles=[],e.filesLoadedOnce=!1,e.newTabFileName=null,e.editingFile=null,e.creatingFile=null,e.renamingFile=null,e.currentLine="",e.bannerDisplayed=!1,e.creatingFolder=null,e.renamingTab=null,e.fileCounter=1,e.isConnectionDialogOpen=!1,e.isConnecting=!1,e.systemInfo=null,e.networksInfo=null,e.isLoadingSystemInfo=!1,e.isLoadingNetworks=!1,e.expandedNetworks=!1,e.activeNetworkPanel=null,e.expandedPeripherals=!1,e.activePeripheralsPanel=null,e.expandedSystem=!1,e.activeSystemPanel=null,e.sdcardConfig=null,e.isLoadingSdcardConfig=!1,e.sdcardConfigLoaded=!1,e.sdcardInfo=null,e.isLoadingSdcardInfo=!1,e.isMountingSDCard=!1,e.isUnmountingSDCard=!1,e.gpioConfig=null,e.isLoadingGpioConfig=!1,e.gpioConfigLoaded=!1,e.gpioSortBy="usage",e.gpioSortOrder="asc",e.gpioEditingRow=null,e.gpioEditingRowData=null,e.gpioValidationErrors=[],e.mqttConfig=null,e.isLoadingMqttConfig=!1,e.canConfig=null,e.canConfigLoaded=!1,e.isLoadingCanConfig=!1,e.mqttConfigLoaded=!1,e.ntpConfig={server:"pool.ntp.org",tzOffset:0,timezone:"UTC",autoDetect:!1},e.isLoadingNtpConfig=!1,e.ntpConfigLoaded=!1,e.ntpSyncResult=null,e.wwanConfig=null,e.isLoadingWwanConfig=!1,e.wwanConfigLoaded=!1,e.modemStatus=null,e.isLoadingModemStatus=!1,e.modemStatusLoaded=!1,e.gpsData=null,e.isLoadingGpsData=!1,e.gpsDataLoaded=!1,e.theme=null,e.colorScheme=null,e.effectiveTheme=null,e.locale=localStorage.getItem("locale")||"en",e.isConnected=!1,e.connectedPort=null,e.connectionMode="none",e.needsOnboarding=!1,e.knownBoards=[];try{const s=await i.hasOnboardedDevices();e.needsOnboarding=!s,e.knownBoards=await i.getOnboardedDevices(),console.log("[State Init] Onboarding needed:",e.needsOnboarding)}catch(s){console.warn("[State Init] Could not check onboarded devices:",s),e.needsOnboarding=!0}e.statusInfo=null,e.scriptOsList=[],e.selectedScriptOs=null,e.scriptOsModalView="library",e.scriptOsArgs={},e.scriptOsSearchQuery="",e.scriptOsFilterTags=[],e.scriptOsFiltersCollapsed=!0,e.scriptOsViewMode="cards",e.isScriptOsModalOpen=!1,e.scriptohubApiUrl="https://cheerful-stoat-894.convex.site",e.isLoadingRegistry=!1,e.scriptOsUiModal={isOpen:!1,url:null,title:null,isLoading:!1,error:null};for(const s of["ai-provider","ai-apikey","ai-model","ai-endpoint","ai-system-prompt","ai-anthropic-proxy-url"])localStorage.removeItem(s);e.debugger={active:!1,halted:!1,configOpen:!1,debugFiles:[],breakpoints:{},watchExpressions:{},conditionalBreakpoints:{},breakpointModalOpen:!1,editingBreakpoint:null,currentFile:"",currentLine:0,variables:{},locals:{},memory:0,timing:0},e.extensionRegistry=new ExtensionRegistry,e.deviceApps={},e.installedExtensions=[],e.allCachedExtensions=[],e.availableExtensions=[],e.loadedExtensions={},e.activeExtension=null,e.activeExtensionPanel=null,e.expandedExtensions={},e.isExtensionsModalOpen=!1,e.isLoadingExtensions=!1,e.dependencyPrompt=null,e.installingDependencies=null,e.isNewFileDialogOpen=!1,e.isSaving=!1,e.savingProgress=0,e.isTransferring=!1,e.transferringProgress="",e.isRemoving=!1,e.isLoadingFiles=!1,e.dialogs=[],e.shortcutsDisabled=!1,await o("disk"),e.savedPanelHeight=PANEL_DEFAULT$1,e.panelHeight=PANEL_CLOSED$1,e.dragStartY=0,e.dragStartHeight=0,e.logSidebarWidth=350,e.savedLogSidebarWidth=350;try{const s=await e.extensionRegistry.getInstalledExtensions();e.allCachedExtensions=s,e.installedExtensions=[...s],console.log(`[Extension Registry] Cached extensions in IDB: ${s.length}`)}catch(s){console.error("[Extensions] Failed to load installed extensions:",s),e.allCachedExtensions=[],e.installedExtensions=[]}e.cache(XTerm,"terminal"),console.log("[State Init] Terminal component cached"),typeof window<"u"&&(window.dev={state:e,registry:e.extensionRegistry,updateExtension:async s=>new Promise((r,l)=>{const a=document.createElement("input");a.type="file",a.accept=".js",a.onchange=async c=>{try{const d=await c.target.files[0].text(),u=await e.extensionRegistry.updateExtensionDev(s,d);console.log("✅ Extension updated! Click another panel, then back to reload."),r(u)}catch(d){l(d)}},a.click()}),installExtensionFromFile:async()=>new Promise((s,r)=>{const l=document.createElement("input");l.type="file",l.accept=".js",l.onchange=async a=>{try{const c=await a.target.files[0].text(),d=await e.extensionRegistry.installExtensionFromContent(c);if(console.log(`✅ Extension "${d.config.name}" installed!`),e.installedExtensions=await e.extensionRegistry.getInstalledExtensions(),e.allCachedExtensions=[...e.installedExtensions],n.emit("render"),hasOnInstallMethod(c)&&e.isConnected){showStyledModal({variant:"",icon:"📦",title:"Installing App Files",subtitle:d.config.name,body:"<p>Writing files to device...</p>",buttons:[]});try{const u=(b,...k)=>b.reduce((F,A,R)=>F+A+(k[R]||""),""),f=new DeviceAPI$1(BridgeDevice),p=decodeDeviceFiles(c),h=c.match(/export\s*\{\s*(\w+)\s+as\s+default\s*\}/),m=h?h[1]:null,w=c.replace(/export\s+(const|default|class|function)/g,"$1").replace(/export\s*\{[^}]*\}\s*;?/g,""),y=m?`return ${m};`:`if (typeof P !== 'undefined') return P;
                       const classMatch = ${JSON.stringify(w)}.match(/class\\s+(\\w+(?:App|Extension))\\s*{/);
                       if (classMatch) return eval(classMatch[1]);
                       throw new Error('No extension class found in bundle');`,$=new Function("DeviceAPI","html","emit","state",`
                    ${w}
                    ${y}
                  `)(DeviceAPI$1,u,n.emit.bind(n),e),C=new $(f,n.emit.bind(n),e,u);if(C.deviceFiles=p,console.log(`[Dev Install] Loaded with ${Object.keys(p).length} device files`),await C.onInstall()===!1)throw new Error("onInstall returned false (check console for details)");const x=Array.isArray(d.config.version)?d.config.version.join("."):"0.0.0";await updateDeviceExtensionRegistry(f,d.id,x),closeStyledModal(),await showStyledModal({variant:"success",icon:"✅",title:"App Ready",subtitle:d.config.name,body:"<p>App files have been installed on your device.</p>",buttons:[{id:"done",class:"fw-styled-modal-btn-primary",label:"Done"}]})}catch(u){console.error("[Dev Install] onInstall failed:",u),closeStyledModal(),await showStyledModal({variant:"danger",icon:"❌",title:"Installation Failed",subtitle:d.config.name,body:`<p>Failed to install files: ${u.message}</p>`,buttons:[{id:"close",class:"fw-styled-modal-btn-cancel",label:"Close"}]})}}else hasOnInstallMethod(c)&&await showStyledModal({variant:"warning",icon:"📦",title:"App Saved",subtitle:d.config.name,body:"<p>Connect to your device and open the app to install files.</p>",buttons:[{id:"ok",class:"fw-styled-modal-btn-primary",label:"OK"}]});s(d),console.log("[Dev Install] 🔄 Reloading to apply changes..."),setTimeout(()=>location.reload(),500)}catch(c){r(c)}},l.click()})},console.log('[State Init] Dev utilities exposed: dev.updateExtension("id"), dev.installExtensionFromFile()')),e.resizePanel=function(s){const r=parseFloat(getComputedStyle(document.body).zoom)||1,l=(s.clientY-e.dragStartY)/r;e.panelHeight=e.dragStartHeight-l,e.panelHeight<=PANEL_CLOSED$1?e.savedPanelHeight=PANEL_DEFAULT$1:e.savedPanelHeight=e.panelHeight,n.emit("render")},e.resizeLogSidebar=function(s){const a=document.querySelector(".repl-panel-content");if(!a)return;const c=a.getBoundingClientRect(),d=c.width,u=c.right-s.clientX,f=d-600;u>=200&&u<=f&&(e.logSidebarWidth=u,e.savedLogSidebarWidth=u,n.emit("render"))}}function detectSystemTheme(){try{return window.matchMedia("(prefers-color-scheme: dark)").matches}catch(e){return console.warn("Failed to detect system theme:",e),!1}}function applyTheme(e){if(e.theme==="device"){const n=detectSystemTheme();e.effectiveTheme=n?"dark":"light"}else e.effectiveTheme=e.theme;e.effectiveTheme==="dark"?document.documentElement.setAttribute("data-theme","dark"):document.documentElement.removeAttribute("data-theme")}function applyColorScheme(e){document.documentElement.setAttribute("data-color-scheme",e.colorScheme)}let darkModeMediaQuery=null;function setupThemeListener(e,n){if(darkModeMediaQuery)try{darkModeMediaQuery.removeListener?darkModeMediaQuery.removeListener(handleSystemThemeChange):darkModeMediaQuery.removeEventListener&&darkModeMediaQuery.removeEventListener("change",handleSystemThemeChange)}catch{}darkModeMediaQuery=window.matchMedia("(prefers-color-scheme: dark)"),darkModeMediaQuery.addListener?darkModeMediaQuery.addListener(()=>handleSystemThemeChange(e,n)):darkModeMediaQuery.addEventListener&&darkModeMediaQuery.addEventListener("change",()=>handleSystemThemeChange(e,n))}function handleSystemThemeChange(e,n){e.theme==="device"&&(applyTheme(e),window.dispatchEvent(new CustomEvent("theme-changed")),n.emit("render"))}function initializeTheme(e,n){const o=localStorage.getItem("theme")||"dark",i=localStorage.getItem("colorScheme")||"green",s=localStorage.getItem("editorTheme")||"auto";e.theme=o,e.colorScheme=i,e.editorTheme=s,applyTheme(e),applyColorScheme(e),setupThemeListener(e,n)}function registerThemeHandlers(e,n){n.on("set-theme",o=>{console.log("set-theme",o),e.theme=o,localStorage.setItem("theme",e.theme),applyTheme(e),window.dispatchEvent(new CustomEvent("theme-changed")),n.emit("render")}),n.on("set-color-scheme",o=>{console.log("set-color-scheme",o),e.colorScheme=o,localStorage.setItem("colorScheme",e.colorScheme),applyColorScheme(e),n.emit("render")}),n.on("set-temperature-unit",o=>{console.log("set-temperature-unit",o),e.temperatureUnit=o,localStorage.setItem("temperatureUnit",e.temperatureUnit),e.isConnected&&e.statusInfo&&updateStatusBarDirectly(e.statusInfo,o||"degC"),n.emit("render")}),n.on("set-editor-theme",o=>{console.log("set-editor-theme",o),e.editorTheme=o,localStorage.setItem("editorTheme",e.editorTheme),window.dispatchEvent(new CustomEvent("editor-theme-changed",{detail:{theme:o}})),n.emit("render")})}function dismissOpenDialogs(e,n,o=null){o&&o.key!="Escape"||(window._dismissDialogsKeyHandler&&(document.removeEventListener("keydown",window._dismissDialogsKeyHandler),window._dismissDialogsKeyHandler=null),e.isConnectionDialogOpen=!1,e.isNewFileDialogOpen=!1,e.scriptOsUiModal&&e.scriptOsUiModal.isOpen&&n.emit("close-scriptos-ui-modal"),n.emit("render"))}function updateDialogDOM(e,n){const o=document.getElementById(e);return o?(n?(o.classList.remove("closed"),o.classList.add("open")):(o.classList.remove("open"),o.classList.add("closed")),!0):!1}function registerDialogHandlers(e,n,o){n.on("open-connection-dialog",async()=>{dismissOpenDialogs(e,n),await o.disconnect(),e.isConnectionDialogOpen=!0,updateDialogDOM("dialog-connection",!0)||n.emit("render");const i=s=>dismissOpenDialogs(e,n,s);document.addEventListener("keydown",i),window._dismissDialogsKeyHandler=i}),n.on("close-connection-dialog",()=>{e.isConnectionDialogOpen=!1,dismissOpenDialogs(e,n),updateDialogDOM("dialog-connection",!1)}),n.on("create-new-file",()=>{console.log("create-new-file"),dismissOpenDialogs(e,n),e.isNewFileDialogOpen=!0,updateDialogDOM("dialog-new-file",!0)||n.emit("render");const i=s=>dismissOpenDialogs(e,n,s);document.addEventListener("keydown",i),window._dismissDialogsKeyHandler=i}),n.on("close-new-file-dialog",()=>{e.isNewFileDialogOpen=!1,dismissOpenDialogs(e,n),updateDialogDOM("dialog-new-file",!1)})}const NAV_WIDTH=220,DIVIDER_WIDTH=6,MAIN_MIN_WIDTH=480,BOARD_MIN_WIDTH=280;function halfOfWork(){const e=document.getElementById("panel");if(!e)return PANEL_DEFAULT$1;const n=e.getBoundingClientRect().height/parseFloat(getComputedStyle(e).height);return Math.round(e.parentElement.getBoundingClientRect().height/2/n)}function registerTerminalHandlers(e,n,o,i){let s=!1;function r(){s=!0,setTimeout(()=>{s=!1},500)}function l(u=!1){s||(n.emit("run",u),r())}function a(){canExecute({isConnected:e.isConnected})&&l()}function c(){canExecute({isConnected:e.isConnected})&&l(!0)}function d(){canExecute({isConnected:e.isConnected})&&n.emit("stop")}return n.on("run-from-button",(u=!1)=>{u?c():a()}),n.on("run",async(u=!1)=>{const f=e.openFiles.find(w=>w.id==e.editingFile);if(!f||!f.editor){console.warn("[run] No active file to execute");return}let p=f.editor.content||"";if(u&&f.editor.view){const w=f.editor.view.state,y=w.selection;if(y.ranges.some($=>$.from!==$.to)){const $=y.ranges.filter(C=>C.from!==C.to).map(C=>w.sliceDoc(C.from,C.to)).join(`
`);$.trim().length>0&&(p=$)}}let h=!1;if(!u&&p.startsWith("# SCRIPTOS_SILENT: True")&&(h=!0,console.log("[ScriptO] Detected silent mode marker")),!u&&p.includes("# === START_CONFIG_PARAMETERS ==="))try{console.log("[ScriptO] Detected ScriptO file, parsing...");const w=parseScriptOsConfig(p);if(w){h=w.silent===!0,console.log("[ScriptO] Config parsed:",w,"silent:",h);const y={};if(w.args)for(const $ in w.args){const C=w.args[$];C.value!==void 0&&(y[$]=C.value)}console.log("[ScriptO] Using default values:",y);const S=generateScriptOsCode(p,w,y);console.log("[ScriptO] Generated code length:",S.length,"original:",p.length),p=S,console.log("[ScriptO] Parsed and generated clean code successfully")}else console.log("[ScriptO] Config parsing returned null")}catch(w){console.error("[ScriptO] Error parsing config:",w)}n.emit("open-panel");let m=document.querySelector(".xterm-helper-textarea");m&&m.focus(),n.emit("render");try{bindTerminalOutput(e);let w=e.cache(i,"terminal").term;w.write(`\r
`);const y=await o.run(p,h);y&&y.trim()&&h&&w.write(y+`\r
`),w.write(TERMINAL_PROMPT),w.scrollToBottom()}catch(w){console.log("error",w),bindTerminalOutput(e);let y=e.cache(i,"terminal").term;y.write(`\r
\x1B[91mError: `+w.message+`\x1B[0m\r
`),y.write(TERMINAL_PROMPT),y.scrollToBottom()}m=document.querySelector(".cm-content"),m&&m.focus(),n.emit("render")}),n.on("stop",async()=>{if(e.panelHeight<=PANEL_CLOSED$1&&(e.panelHeight=e.savedPanelHeight),n.emit("open-panel"),n.emit("render"),e.isConnected)try{await o.interrupt()}catch(u){console.log("Stop failed:",u)}}),n.on("clear-terminal",()=>{e.cache(i,"terminal").term.clear(),n.emit("log:clear")}),n.on("terminal:write",u=>{e.cache(i,"terminal").term.write(u)}),n.on("terminal:write-prompt",()=>{e.cache(i,"terminal").term.write(TERMINAL_PROMPT)}),n.on("board-connected",()=>{e.savedPanelHeight===PANEL_DEFAULT$1&&requestAnimationFrame(()=>requestAnimationFrame(()=>n.emit("open-panel")))}),n.on("open-panel",()=>{n.emit("stop-resizing-panel"),e.panelHeight=e.savedPanelHeight===PANEL_DEFAULT$1?halfOfWork():e.savedPanelHeight,n.emit("render"),setTimeout(()=>{e.cache(i,"terminal").resizeTerm()},200)}),n.on("close-panel",()=>{n.emit("stop-resizing-panel"),e.savedPanelHeight=e.panelHeight,e.panelHeight=0,n.emit("render")}),n.on("start-resizing-board",u=>{u.preventDefault();const f=document.querySelector(".system-container"),{right:p,width:h}=f.getBoundingClientRect(),m=h/parseFloat(getComputedStyle(f).width),w=h/m-NAV_WIDTH-DIVIDER_WIDTH-MAIN_MIN_WIDTH,y=$=>{e.boardWidth=Math.round(Math.max(BOARD_MIN_WIDTH,Math.min(w,(p-$.clientX)/m))),f.style.setProperty("--board-width",`${e.boardWidth}px`)},S=()=>{window.removeEventListener("mousemove",y),document.body.style.userSelect="",document.body.style.cursor="",localStorage.setItem(BOARD_WIDTH_STORE,e.boardWidth),n.emit("render")};document.body.style.userSelect="none",document.body.style.cursor="col-resize",window.addEventListener("mousemove",y),window.addEventListener("mouseup",S,{once:!0})}),n.on("start-resizing-panel",u=>{e.dragStartY=u.clientY,e.dragStartHeight=e.panelHeight;const f=document.querySelector("#panel");f&&f.classList.add("resizing"),document.body.style.userSelect="none",document.body.style.cursor="grabbing",window.addEventListener("mousemove",e.resizePanel);const p=()=>{n.emit("stop-resizing-panel")};window.addEventListener("mouseup",p,{once:!0}),document.body.addEventListener("mouseleave",p,{once:!0}),document.querySelector("#tabs").addEventListener("mouseenter",p,{once:!0})}),n.on("stop-resizing-panel",()=>{const u=document.querySelector("#panel");u&&u.classList.remove("resizing"),document.body.style.userSelect="",document.body.style.cursor="",window.removeEventListener("mousemove",e.resizePanel),setTimeout(()=>e.cache(i,"terminal").resizeTerm(),50)}),{runCode:a,runCodeSelection:c,stopCode:d}}function registerLogHandlers(e,n){e.logs={isOpen:!1,messages:[],maxMessages:1e3,autoScroll:!0},n.on("toggle-log-sidebar",()=>{e.logs.isOpen=!e.logs.isOpen,n.emit("render"),e.logs.isOpen&&e.logs.autoScroll&&setTimeout(()=>{const o=document.querySelector("#log-terminal .xterm-viewport");o&&(o.scrollTop=o.scrollHeight)},100)}),n.on("log:add",o=>{console.debug("[Log Store] log:add event received:",o),e.logs.messages.push(o),e.logs.messages.length>e.logs.maxMessages&&e.logs.messages.shift();const i=new CustomEvent("log-terminal-write",{detail:o});console.debug("[Log Store] Dispatching log-terminal-write event:",o),window.dispatchEvent(i)}),n.on("log:clear",()=>{e.logs.messages=[];const o=new CustomEvent("log-terminal-clear");window.dispatchEvent(o),n.emit("render")}),n.on("log:toggle-autoscroll",()=>{e.logs.autoScroll=!e.logs.autoScroll,n.emit("render")}),n.on("start-resizing-log-sidebar",()=>{console.log("start-resizing-log-sidebar"),window.addEventListener("mousemove",e.resizeLogSidebar);const o=()=>{n.emit("stop-resizing-log-sidebar")};window.addEventListener("mouseup",o,{once:!0}),document.body.addEventListener("mouseleave",o,{once:!0})}),n.on("stop-resizing-log-sidebar",()=>{window.removeEventListener("mousemove",e.resizeLogSidebar)})}function registerSystemConfigHandlers(e,n,o){n.on("toggle-system-menu",()=>{e.expandedSystem=!e.expandedSystem,n.emit("render")}),n.on("app-action",async({tool:i,args:s})=>{try{await o.appAction(i,s)}catch(r){console.warn("[Apps]",i,r)}await refreshBoardApps(e,n).catch(r=>console.warn("[Apps] Could not refresh:",r))}),n.on("app-remove",async({id:i,name:s})=>{await confirmDialog(t("home.confirmRemove",{name:s}),t("home.cancel"),t("home.remove"))===0&&n.emit("app-action",{tool:"scripto_remove",args:{id:i}})}),n.on("change-system-panel",i=>{e.activeSystemPanel=i,e.activeNetworkPanel=null,e.activePeripheralsPanel=null,e.activeExtension=null,e.activeExtensionPanel=null,e.systemSection=`system:${i}`,n.emit("render")}),n.on("load-network-interfaces-config",async()=>{if(console.log("[Network Interfaces] Loading config..."),!e.isConnected){console.warn("[Network Interfaces] Not connected to device");return}if(e.isLoadingNetworkInterfacesConfig){console.log("[Network Interfaces] Already loading, skipping");return}try{e.isLoadingNetworkInterfacesConfig=!0;const s=await o.exec(`
from lib.sys import settings
import json

config = {
    'wifi': settings.get("network.wifi.enabled", True),
    'ethernet': settings.get("network.ethernet.enabled", True),
    'wwan': settings.get("network.wwan.enabled", True)
}

print(json.dumps({'success': True, 'config': config}))
`);s&&s.success&&(e.networkInterfacesConfig=s.config,console.log("[Network Interfaces] Config loaded:",e.networkInterfacesConfig))}catch(i){console.error("[Network Interfaces] Failed to load config:",i)}finally{e.isLoadingNetworkInterfacesConfig=!1,n.emit("render")}}),n.on("save-network-interfaces-config",async i=>{if(console.log("[Network Interfaces] Saving config:",i),!e.isConnected){console.warn("[Network Interfaces] Not connected to device");return}if(!i.wifi&&!i.ethernet&&!i.wwan){alert("At least one network interface must be enabled.");return}try{e.isSavingNetworkInterfacesConfig=!0,n.emit("render");const r=`
from lib.sys import settings
import json

config_json = '${JSON.stringify(i).replace(/'/g,"\\'")}'
config = json.loads(config_json)

settings.set("network.wifi.enabled", config.get('wifi', True))
settings.set("network.ethernet.enabled", config.get('ethernet', True))
settings.set("network.wwan.enabled", config.get('wwan', True))

settings.save()

print(json.dumps({'success': True, 'message': 'Network interfaces configuration saved. Reboot to apply changes.'}))
`,l=await o.exec(r);if(l&&l.success)e.networkInterfacesConfig=i,alert("Network interfaces configuration saved. Please reboot the device to apply changes.");else throw new Error(l?.error||"Save failed")}catch(s){console.error("[Network Interfaces] Failed to save config:",s),alert(`Failed to save configuration: ${s.message}`)}finally{e.isSavingNetworkInterfacesConfig=!1,n.emit("render")}})}function registerNetworkConfigHandlers(e,n,o){const i=console.log;n.on("toggle-networks-menu",()=>{i("toggle-networks-menu"),e.expandedNetworks=!e.expandedNetworks,n.emit("render")}),n.on("change-network-panel",s=>{i("change-network-panel:",s),e.activeNetworkPanel=s,e.activeSystemPanel=null,e.activePeripheralsPanel=null,e.activeExtension=null,e.activeExtensionPanel=null,e.systemSection=`network:${s}`,s==="gps"&&!e.gpsDataLoaded&&e.isConnected&&n.emit("load-gps-data"),n.emit("render")}),n.on("load-ntp-config",async()=>{if(i("load-ntp-config"),!e.isConnected){console.warn("[NTP] Not connected to device");return}if(e.isLoadingNtpConfig){console.log("[NTP] Already loading config, skipping");return}try{e.isLoadingNtpConfig=!0;const r=await o.exec(`
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
`);o.onNtpConfig&&o.onNtpConfig(r)}catch(s){console.error("[NTP] Failed to load config:",s),e.isLoadingNtpConfig=!1}}),n.on("save-ntp-config",async s=>{if(i("save-ntp-config",s),!e.isConnected){console.warn("[NTP] Not connected to device"),n.emit("ntp-config-save-error",new Error("Not connected"));return}try{const l=`
from lib.sys import settings
import json

config_json = '${JSON.stringify(s).replace(/'/g,"\\'")}'
config = json.loads(config_json)

# Save config using settings API
settings.set("ntp.server", config.get('server', config.get('server', 'pool.ntp.org')))
settings.set("ntp.tz_offset", config.get('tz_offset', config.get('tzOffset', 0.0)))
settings.set("ntp.timezone", config.get('timezone', 'UTC'))
settings.set("ntp.auto_detect_tz", config.get('auto_detect', config.get('autoDetect', False)))

settings.save()

print(json.dumps({'success': True, 'message': 'NTP configuration saved successfully'}))
`,a=await o.exec(l);if(a&&a.success)e.ntpConfig={server:s.server||"pool.ntp.org",tzOffset:s.tz_offset??s.tzOffset??0,timezone:s.timezone||"UTC",autoDetect:s.auto_detect??s.autoDetect??!1},n.emit("render"),n.emit("ntp-config-saved");else{const c=new Error(a?.error||"Save failed");throw n.emit("ntp-config-save-error",c),c}}catch(r){throw console.error("[NTP] Failed to save config:",r),alert(`Failed to save NTP configuration: ${r.message}`),n.emit("ntp-config-save-error",r),r}}),n.on("sync-ntp-time",async(s,r,l)=>{if(i("sync-ntp-time",s,r,l),!e.isConnected){console.warn("[NTP] Not connected to device");return}try{const c=`
from lib.sys.utils import sync_ntp
sync_ntp('${s}', ${r}, ${l?"True":"False"}, force=True)
`,d=await o.exec(c);if(o.onNtpSync){const u={autoDetect:l,server:s,tzOffset:r};o.onNtpSync(d,u)}}catch(a){console.error("[NTP] Failed to sync time:",a),alert(`Failed to sync NTP time: ${a.message}`)}}),n.on("load-mqtt-config",async()=>{if(i("load-mqtt-config"),!e.isConnected){console.warn("[MQTT] Not connected to device");return}if(e.isLoadingMqttConfig){console.log("[MQTT] Already loading config, skipping");return}try{e.isLoadingMqttConfig=!0;const r=await o.exec(`
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
`);o.onMqttConfig&&o.onMqttConfig(r)}catch(s){console.error("[MQTT] Failed to load config:",s),e.isLoadingMqttConfig=!1}}),n.on("save-mqtt-config",async s=>{if(i("save-mqtt-config",s),!e.isConnected){console.warn("[MQTT] Not connected to device");return}try{const l=`
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
`,a=await o.exec(l);o.onMqttConfigSave&&o.onMqttConfigSave(a),e.mqttConfig=s,n.emit("render")}catch(r){console.error("[MQTT] Failed to save config:",r),alert(`Failed to save MQTT configuration: ${r.message}`)}}),n.on("load-wwan-config",async()=>{if(i("load-wwan-config"),!e.isConnected){console.warn("[WWAN] Not connected to device");return}if(e.isLoadingWwanConfig){console.log("[WWAN] Already loading config, skipping");return}try{e.isLoadingWwanConfig=!0;const r=await o.exec(`
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
`);o.onWwanConfig&&o.onWwanConfig(r)}catch(s){console.error("[WWAN] Failed to load config:",s),e.isLoadingWwanConfig=!1}}),n.on("save-wwan-config",async s=>{if(i("save-wwan-config",s),!e.isConnected){console.warn("[WWAN] Not connected to device");return}try{const l=`
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
`,a=await o.exec(l);o.onWwanConfigSave&&o.onWwanConfigSave(a),e.wwanConfig=s,n.emit("render")}catch(r){console.error("[WWAN] Failed to save config:",r),alert(`Failed to save WWAN configuration: ${r.message}`)}}),n.on("load-modem-status",async()=>{if(i("load-modem-status"),!e.isConnected){console.warn("[Modem] Not connected to device");return}if(e.isLoadingModemStatus){console.log("[Modem] Already loading status, skipping");return}try{e.isLoadingModemStatus=!0;const r=await o.exec(`
from lib.sys.network import wwan
import json

status = wwan.get_status()
print(json.dumps(status))
`);o.onModemStatus&&o.onModemStatus(r)}catch(s){console.error("[Modem] Failed to load status:",s),e.isLoadingModemStatus=!1}}),n.on("load-can-config",async()=>{if(i("load-can-config"),!e.isConnected){console.warn("[CAN] Not connected to device");return}if(e.isLoadingCanConfig){console.log("[CAN] Already loading config, skipping");return}try{e.isLoadingCanConfig=!0;const r=await o.exec(`
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
    'mode': settings.get("can.mode", "NORMAL"),
    'agentTxNeedsArm': settings.get("can.agent_tx_needs_arm", False)
}

print(json.dumps({'success': True, 'config': config}))
`);o.onCanConfig&&o.onCanConfig(r)}catch(s){console.error("[CAN] Failed to load config:",s),e.isLoadingCanConfig=!1}}),n.on("save-can-config",async s=>{if(i("save-can-config",s),!e.isConnected){console.warn("[CAN] Not connected to device");return}try{const l=`
from lib.sys import settings
import json
import mcplink

config_json = '${JSON.stringify(s).replace(/'/g,"\\'")}'
config = json.loads(config_json)

# Save user preferences only (pins come from board.json, not settings)
settings.set("can.bitrate", config.get('bitrate', 500000))
settings.set("can.enabled", config.get('enabled', False))
settings.set("can.mode", config.get('mode', "NORMAL"))
settings.set("can.agent_tx_needs_arm", config.get('agentTxNeedsArm', False))
mcplink.tx_gate(config.get('agentTxNeedsArm', False))

settings.save()

print(json.dumps({'success': True, 'message': 'CAN configuration saved successfully'}))
`,a=await o.exec(l);o.onCanConfigSave&&o.onCanConfigSave(a),e.canConfig=s,n.emit("render")}catch(r){console.error("[CAN] Failed to save config:",r),alert(`Failed to save CAN configuration: ${r.message}`)}}),n.on("load-vpn-config",async()=>{if(i("load-vpn-config"),!e.isConnected){console.warn("[VPN] Not connected to device");return}if(e.isLoadingVpnConfig){console.log("[VPN] Already loading config, skipping");return}try{e.isLoadingVpnConfig=!0;const r=await o.exec(`
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
`);o.onVpnConfig&&o.onVpnConfig(r)}catch(s){console.error("[VPN] Failed to load config:",s),e.isLoadingVpnConfig=!1}}),n.on("vpn-save-config",async s=>{if(i("vpn-save-config",s),!e.isConnected){console.warn("[VPN] Not connected to device");return}try{const l=`
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
`,a=await o.exec(l);o.onVpnConfigSave&&o.onVpnConfigSave(a),e.vpnConfig=s,e.vpnConfigLoaded=!0,n.emit("render")}catch(r){console.error("[VPN] Failed to save config:",r),alert(`Failed to save VPN configuration: ${r.message}`)}}),n.on("vpn-connect",async s=>{if(i("vpn-connect",s),!e.isConnected){console.warn("[VPN] Not connected to device");return}try{const r=`
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
`,l=await o.exec(r);o.onVpnConnect&&o.onVpnConnect(l),e.vpnConfig=s,e.vpnConfigLoaded=!0,setTimeout(()=>{n.emit("refresh-networks")},2e3),n.emit("render")}catch(r){console.error("[VPN] Failed to connect:",r),alert(`Failed to connect to VPN: ${r.message}`)}}),n.on("vpn-disconnect",async()=>{if(i("vpn-disconnect"),!e.isConnected){console.warn("[VPN] Not connected to device");return}try{const r=await o.exec(`
import husarnet
import json

try:
    husarnet.leave()
    print(json.dumps({'success': True, 'message': 'Disconnected from Husarnet'}))
except Exception as e:
    import sys
    sys.print_exception(e)
    print(json.dumps({'success': False, 'error': str(e)}))
`);o.onVpnDisconnect&&o.onVpnDisconnect(r),e.vpnConfig&&(e.vpnConfig.enabled=!1),setTimeout(()=>{n.emit("refresh-networks")},1e3),n.emit("render")}catch(s){console.error("[VPN] Failed to disconnect:",s),alert(`Failed to disconnect VPN: ${s.message}`)}}),n.on("load-gps-data",async()=>{if(i("load-gps-data"),!e.isConnected){console.warn("[GPS] Not connected to device");return}if(e.isLoadingGpsData){console.log("[GPS] Already loading GPS data, skipping");return}try{e.isLoadingGpsData=!0,n.emit("render");const r=await o.exec(`
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
`);r&&r.success&&r.data?(e.gpsData=r.data,e.gpsDataLoaded=!0,console.log("[GPS] GPS data loaded:",e.gpsData)):(e.gpsData={},e.gpsDataLoaded=!0)}catch(s){console.error("[GPS] Failed to load GPS data:",s),e.gpsData={},e.gpsDataLoaded=!0}finally{e.isLoadingGpsData=!1,n.emit("render")}}),n.on("refresh-gps-data",async()=>{i("refresh-gps-data"),e.gpsDataLoaded=!1,n.emit("load-gps-data")}),n.on("refresh-system-info",async()=>{if(!e.isConnected){console.warn("[System Info] Not connected, cannot refresh system info");return}if(e.isLoadingSystemInfo){console.log("[System Info] Already loading, skipping");return}e.isLoadingSystemInfo=!0,n.emit("render");try{const s=await getSystemInfo(o);e.systemInfo=s,console.log("[System Info] Loaded:",s)}catch(s){console.error("[System Info] Failed to load:",s),e.systemInfo=null}finally{e.isLoadingSystemInfo=!1,n.emit("render")}}),n.on("refresh-networks",async()=>{if(i("refresh-networks"),!e.isConnected){console.warn("[Networks] Not connected, cannot refresh networks");return}if(e.isLoadingNetworks){console.log("[Networks] Already loading, skipping");return}e.isLoadingNetworks=!0,n.emit("render");try{const s=await getNetworksInfo(o);e.networksInfo=s,console.log("[Networks] Loaded:",s)}catch(s){console.error("[Networks] Failed to load:",s),e.networksInfo=null}finally{e.isLoadingNetworks=!1,n.emit("render")}}),n.on("load-eth-config",async()=>{if(i("load-eth-config"),!e.isConnected){console.warn("[Ethernet] Not connected to device");return}if(e.isLoadingEthConfig){console.log("[Ethernet] Already loading config, skipping");return}try{e.isLoadingEthConfig=!0,n.emit("render");const r=await o.exec(`
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
`);o.onEthConfig&&o.onEthConfig(r)}catch(s){console.error("[Ethernet] Failed to load config:",s),e.isLoadingEthConfig=!1,n.emit("render")}}),n.on("save-eth-config",async s=>{if(i("save-eth-config",s),!e.isConnected){console.warn("[Ethernet] Not connected to device");return}try{const l=`
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
`,a=await o.exec(l);o.onEthConfigSave&&o.onEthConfigSave(a),e.ethConfig=s,n.emit("render")}catch(r){console.error("[Ethernet] Failed to save config:",r),alert(`Failed to save Ethernet configuration: ${r.message}`)}}),n.on("init-ethernet",async()=>{if(i("init-ethernet"),!e.isConnected){console.warn("[Ethernet] Not connected to device");return}try{e.isInitializingEth=!0,n.emit("render");const r=await o.exec(`
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
`);o.onEthInit&&o.onEthInit(r),e.isInitializingEth=!1,n.emit("refresh-networks")}catch(s){console.error("[Ethernet] Failed to initialize:",s),e.isInitializingEth=!1,alert(`Failed to initialize Ethernet: ${s.message}`),n.emit("render")}}),n.on("refresh-eth-status",async()=>{if(i("refresh-eth-status"),!!e.isConnected)try{const r=await o.exec(`
from lib.sys.network import eth
import json
print(json.dumps(eth.get_status()))
`);o.onEthStatus&&o.onEthStatus(r)}catch(s){console.error("[Ethernet] Failed to get status:",s)}}),n.on("load-twilio-config",async()=>{if(i("load-twilio-config"),!e.isConnected){console.warn("[Twilio] Not connected to device");return}if(e.isLoadingTwilioConfig){console.log("[Twilio] Already loading config, skipping");return}try{e.isLoadingTwilioConfig=!0;const r=await o.exec(`
from lib.sys import settings
import json

# Load config from settings API
config = {
    'account_sid': settings.get("twilio.account_sid", ""),
    'auth_token': settings.get("twilio.auth_token", ""),
    'from_number': settings.get("twilio.from_number", "")
}

print(json.dumps({'success': True, 'config': config}))
`);r&&r.success&&r.config&&(e.twilioConfig=r.config,e.twilioConfigLoaded=!0),e.isLoadingTwilioConfig=!1,n.emit("render")}catch(s){console.error("[Twilio] Failed to load config:",s),e.isLoadingTwilioConfig=!1}}),n.on("save-twilio-config",async s=>{if(i("save-twilio-config",s),!e.isConnected){console.warn("[Twilio] Not connected to device");return}try{const l=`
from lib.sys import settings
import json

config_json = '${JSON.stringify(s).replace(/'/g,"\\'")}'
config = json.loads(config_json)

# Save config using settings API
settings.set("twilio.account_sid", config.get('account_sid', ''))
settings.set("twilio.auth_token", config.get('auth_token', ''))
settings.set("twilio.from_number", config.get('from_number', ''))

settings.save()

print(json.dumps({'success': True, 'message': 'Twilio configuration saved successfully'}))
`,a=await o.exec(l);a&&a.success?(e.twilioConfig=s,e.twilioConfigLoaded=!0,n.emit("render"),alert("Twilio configuration saved!")):alert("Failed to save Twilio configuration")}catch(r){console.error("[Twilio] Failed to save config:",r),alert(`Failed to save Twilio configuration: ${r.message}`)}})}function registerHardwareConfigHandlers(e,n,o){const i=console.log;n.on("toggle-peripherals-menu",()=>{i("toggle-peripherals-menu"),e.expandedPeripherals=!e.expandedPeripherals,n.emit("render")}),n.on("change-peripherals-panel",s=>{i("change-peripherals-panel:",s),e.activePeripheralsPanel=s,e.activeNetworkPanel=null,e.activeSystemPanel=null,e.activeExtension=null,e.activeExtensionPanel=null,e.systemSection=`peripherals:${s}`,s==="gps"&&e.isConnected&&!e.gpsDataLoaded&&!e.isLoadingGpsData&&n.emit("load-gps-data"),s==="sdcard"&&e.isConnected&&(e.sdcardInfo=null,n.emit("sdcard-get-info")),n.emit("render")}),n.on("sdcard-unmount",async()=>{if(i("sdcard-unmount"),!e.isConnected){console.warn("[SD Card] Not connected to device");return}if(e.isUnmountingSDCard){console.log("[SD Card] Already unmounting, skipping");return}try{e.isUnmountingSDCard=!0,n.emit("render");const r=await o.exec(`
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
`);o.onSdcardUnmount&&o.onSdcardUnmount(r),e.sdcardInfo={error:"SD card unmounted"},e.isUnmountingSDCard=!1,n.emit("render")}catch(s){console.error("[SD Card] Failed to unmount:",s),e.isUnmountingSDCard=!1,alert(`Failed to unmount SD card: ${s.message}`),n.emit("render")}}),n.on("sdcard-mount",async()=>{if(i("sdcard-mount"),!e.isConnected){console.warn("[SD Card] Not connected to device");return}if(e.isMountingSDCard){console.log("[SD Card] Already mounting, skipping");return}try{e.isMountingSDCard=!0,n.emit("render");const r=await o.exec(`
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
`);o.onSdcardMount&&o.onSdcardMount(r)}catch(s){console.error("[SD Card] Failed to mount:",s),e.isMountingSDCard=!1,alert(`Failed to mount SD card: ${s.message}`),n.emit("render")}}),n.on("sdcard-get-info",async()=>{if(i("sdcard-get-info"),!e.isConnected){console.warn("[SD Card] Not connected to device");return}if(e.isLoadingSdcardInfo){console.log("[SD Card] Already loading info, skipping");return}try{e.isLoadingSdcardInfo=!0,n.emit("render");const r=await o.exec(`
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
`);o.onSdcardInfo&&o.onSdcardInfo(r)}catch(s){console.error("[SD Card] Failed to get info:",s),e.isLoadingSdcardInfo=!1,e.sdcardInfo={error:`Failed to get storage info: ${s.message}`},n.emit("render")}})}const PATH="/settings/board.json",READ_IDENTITY=`
import json
try:
    with open('${PATH}') as f:
        _i = json.load(f).get('identity', {})
    print(json.dumps({'id': _i.get('id'), 'revision': _i.get('revision')}))
except OSError:
    print('{}')
`,RELOAD=`
from lib.sys import board
board.reload()
`;function isNewer(e,n){const o=r=>String(r??"").split(".").map(l=>parseInt(l,10)||0),i=o(e),s=o(n);for(let r=0;r<Math.max(i.length,s.length);r++){const l=(i[r]||0)-(s[r]||0);if(l)return l>0}return!1}async function updateBoardManifest(e){const n=await e.exec(READ_IDENTITY);if(!n?.id)return null;let o;try{o=await fetchBoardManifest(n.id,{newest:!0})}catch{return null}const i=o.identity?.revision;return isNewer(i,n.revision)?(await e.saveFile(PATH,JSON.stringify(o,null,2)),await e.exec(RELOAD),i):null}const STATUS_INFO_POLL_INTERVAL=1e4;let statusInfoPollInterval=null,statusInfoPollingEnabled=!1;function startStatusInfoPolling(e,n,o){stopStatusInfoPolling(),statusInfoPollingEnabled=!0;let i=null;statusInfoPollInterval=setInterval(async()=>{if(!statusInfoPollingEnabled)return;if(!n.isConnected||!e){stopStatusInfoPolling();return}const s=n.isTransferring,r=n.installingDependencies,l=e.isFileOperationActive&&e.isFileOperationActive(),a=e.isCommandRunning&&e.isCommandRunning();if(s||r||l||a){const c=s?"transferring":l?"fileOp":a?"command":"deps";c!==i&&(console.log(`[Store] Status info polling paused: ${c}`),i=c);return}i&&(console.log("[Store] Status info polling resuming"),i=null);try{const c=await e.exec("getStatusInfo()");c&&(n.statusInfo=c,updateStatusBarDirectly(c,n.temperatureUnit||"degC"))}catch(c){console.debug("[Store] Status info poll failed:",c.message)}},STATUS_INFO_POLL_INTERVAL)}function stopStatusInfoPolling(){statusInfoPollingEnabled=!1,statusInfoPollInterval&&(clearInterval(statusInfoPollInterval),statusInfoPollInterval=null,console.log("[Store] Stopped status info polling"))}function registerConnectionHandlers(e,n,o,i,s){n.on("disconnected",()=>{stopStatusInfoPolling(),e.isConnected=!1,e.connectionMode="none",e.boardFiles=[],e.boardNavigationPath="/",e.filesLoadedOnce=!1,e.isTransferring=!1,e.transferringProgress="",e.isSaving=!1,e.savingProgress=0,e.isRemoving=!1,e.bannerDisplayed=!1,e.systemInfoAttempted=!1;for(const r in e.loadedExtensions)e.loadedExtensions[r].instance=null;n.emit("refresh-files"),n.emit("render"),e.isResettingHard&&(e.isResettingHard=!1,setTimeout(()=>{n.emit("open-connection-dialog")},100))}),n.on("disconnect",async()=>{e._userDisconnected=!0,e._reconnectTimer&&(clearTimeout(e._reconnectTimer),e._reconnectTimer=null),e.isReconnecting=!1,await o.disconnect(),n.emit("disconnected")}),n.on("reconnecting",()=>{if(e.isReconnecting){console.log("[Store] Reconnect already in progress, ignoring duplicate");return}if(e._userDisconnected){n.emit("disconnected");return}console.log("[Store] Connection lost - starting auto-reconnect"),stopStatusInfoPolling(),e.isReconnecting=!0,e.reconnectAttempt=0,e.isConnected=!1,e.connectionMode="none",n.emit("render");const r=localStorage.getItem("webrepl-url"),l=localStorage.getItem("webrepl-password")||"";if(!r){console.warn("[Store] No saved connection URL, falling back to disconnect"),e.isReconnecting=!1,n.emit("disconnected");return}const a=20,c=3e3,d=async()=>{if(e.isReconnecting){e.reconnectAttempt++,console.log(`[Store] Reconnect attempt ${e.reconnectAttempt}/${a}`),n.emit("render");try{await o.connect(r,l),console.log("[Store] Reconnected successfully"),e.isReconnecting=!1,e.reconnectAttempt=0,e.isConnected=!0,e.connectionMode="webrepl",e._reconnectTimer=null,i(),n.emit("render"),n.emit("board-reconnected"),startStatusInfoPolling(o,e,n);try{const u=await o.exec("getStatusInfo()");u&&(e.statusInfo=u,updateStatusBarDirectly(u,e.temperatureUnit||"degC"))}catch{}}catch(u){if(console.log(`[Store] Reconnect attempt ${e.reconnectAttempt} failed:`,u.message),e.reconnectAttempt>=a){console.warn("[Store] Max reconnect attempts reached, giving up"),e.isReconnecting=!1,e._reconnectTimer=null,n.emit("disconnected");return}e.isReconnecting&&(e._reconnectTimer=setTimeout(d,c))}}};e._reconnectTimer=setTimeout(d,c)}),n.on("reconnect-cancel",()=>{console.log("[Store] Reconnect cancelled by user"),e._reconnectTimer&&(clearTimeout(e._reconnectTimer),e._reconnectTimer=null),e.isReconnecting=!1,n.emit("disconnected")}),n.on("connection-timeout",async()=>{e.isConnected=!1,e.isConnecting=!1,e.isConnectionDialogOpen=!0,n.emit("render")}),n.on("connect",async()=>{n.emit("open-connection-dialog")}),n.on("connect-webrepl",async({wsUrl:r,password:l})=>{r&&localStorage.setItem("webrepl-url",r),l&&localStorage.setItem("webrepl-password",l),e.isConnecting=!0,n.emit("render"),updateOverlayDirectly(e);const a=e.cache(XTerm,"terminal");a&&a.term&&a.bindInput(e,o),s(e);try{await o.connect(r,l),e.isConnecting=!1,e.isConnected=!0,e.connectionMode="webrepl",updateOverlayDirectly(e),e.boardNavigationPath="/",e.connectedPort=r,n.emit("board-connected"),i(),n.emit("render"),e.systemSection==="file-manager"&&n.emit("refresh-files"),e._userDisconnected=!1,o.onConnectionClosed(()=>{e._userDisconnected||n.emit("reconnecting")}),o.subscribe("tools_changed",()=>{refreshBoardApps(e,n).catch(d=>console.warn("[Extensions] Could not refresh apps:",d))}),o.subscribe("status_info",d=>{const u=!e.statusInfo&&d;e.statusInfo=d,u?n.emit("render"):updateStatusBarDirectly(d,e.temperatureUnit||"degC")}),o.subscribe("log",d=>{console.debug("[Connection] LOG event handler called with:",d),n.emit("log:add",d)}),o.onPlotData=d=>{},o.onDisplayUi=d=>{console.log("[ScriptO UI] Display UI command received:",d),n.emit("open-scriptos-ui-modal",d)},o.onWwanStatus=d=>{console.log("[WWAN] Status event received:",d),e.wwanStatus=d,n.emit("render")},o.onMqttConfig=d=>{console.log("[MQTT] Config received:",d),e.isLoadingMqttConfig=!1,e.mqttConfigLoaded=!0,d.success&&d.config?e.mqttConfig=d.config:e.mqttConfig={},n.emit("render")},o.onMqttConfigSave=d=>{console.log("[MQTT] Config save response:",d),d.success?n.emit("render"):alert(`Failed to save MQTT configuration: ${d.error||"Unknown error"}`)},o.onWwanConfig=d=>{console.log("[WWAN] Config received:",d),e.isLoadingWwanConfig=!1,e.wwanConfigLoaded=!0,d.success&&d.config?(e.wwanConfig=d.config,e.wwanConfig.auto_init_modem===void 0&&(e.wwanConfig.auto_init_modem=!0)):e.wwanConfig={auto_init_modem:!0},n.emit("render")},o.onWwanConfigSave=d=>{console.log("[WWAN] Config save response:",d),d.success?n.emit("render"):alert(`Failed to save WWAN configuration: ${d.error||"Unknown error"}`)},o.onModemStatus=d=>{console.log("[Modem] Status received:",d),e.isLoadingModemStatus=!1,e.modemStatusLoaded=!0,e.modemStatus=d,n.emit("render")},o.onNtpSync=(d,u)=>{if(console.log("[NTP] Sync response:",d),d.success){e.ntpConfig||(e.ntpConfig={server:"pool.ntp.org",tzOffset:0,timezone:"UTC",autoDetect:!1,autoSync:!1});const f=u?.autoDetect??e.ntpConfig.autoDetect??!1,p=u?.autoSync??e.ntpConfig.autoSync??!1,h=e.ntpConfig.timezone??"UTC";d.ntp_server?e.ntpConfig.server=d.ntp_server:u?.server&&(e.ntpConfig.server=u.server),d.tz_offset!==void 0?e.ntpConfig.tzOffset=d.tz_offset:u?.tzOffset!==void 0&&(e.ntpConfig.tzOffset=u.tzOffset),e.ntpConfig.autoDetect=f,e.ntpConfig.autoSync=p,e.ntpConfig.timezone=h,e.ntpSyncResult={utc:d.utc,local:d.local,timestamp:Date.now()},n.emit("render")}else alert(`NTP sync failed: ${d.error||"Unknown error"}`)},o.onNtpConfig=d=>{console.log("[NTP] Config received:",d),e.isLoadingNtpConfig=!1,e.ntpConfigLoaded=!0,d.success&&d.config&&(e.ntpConfig={server:d.config.server||"pool.ntp.org",tzOffset:d.config.tz_offset||0,timezone:d.config.timezone||"UTC",autoDetect:d.config.auto_detect||!1,autoSync:d.config.auto_sync||!1},d.current_time&&(e.ntpSyncResult={utc:d.current_time.utc,local:d.current_time.local,timestamp:Date.now()})),n.emit("render")},o.onNtpConfigSave=d=>{if(console.log("[NTP] Config save response:",d),d.success)n.emit("render");else{const u=new Error(d.error||"Unknown error");n.emit("ntp-config-save-error",u),alert(`Failed to save NTP configuration: ${u.message}`)}},o.onCanConfig=d=>{console.log("[CAN] Config received:",d),e.isLoadingCanConfig=!1,e.canConfigLoaded=!0,d.success&&d.config&&(e.canConfig={txPin:d.config.txPin||5,rxPin:d.config.rxPin||4,bitrate:d.config.bitrate||5e5,enabled:d.config.enabled!==void 0?d.config.enabled:!0,loopback:d.config.loopback||!1},n.emit("render"))},o.onCanConfigSave=d=>{console.log("[CAN] Config save response:",d),d.success?(n.emit("render"),alert("CAN configuration saved successfully. Device restart required for changes to take effect.")):alert(`Failed to save CAN configuration: ${d.error||"Unknown error"}`)},o.onVpnConfig=d=>{console.log("[VPN] Config received:",d),e.isLoadingVpnConfig=!1,e.vpnConfigLoaded=!0,d.success&&d.config?e.vpnConfig={hostname:d.config.hostname||"",join_code:d.config.join_code||"",auto_connect:d.config.auto_connect||!1,enabled:d.config.enabled||!1}:e.vpnConfig={hostname:"",join_code:"",auto_connect:!1,enabled:!1},n.emit("render")},o.onVpnConfigSave=d=>{console.log("[VPN] Config save response:",d),d.success?n.emit("render"):alert(`Failed to save VPN configuration: ${d.error||"Unknown error"}`)},o.onVpnConnect=d=>{console.log("[VPN] Connect response:",d),d.success?(alert(d.message||"Connected to VPN successfully!"),n.emit("refresh-networks")):alert(`Failed to connect to VPN: ${d.error||"Unknown error"}`),n.emit("render")},o.onVpnDisconnect=d=>{console.log("[VPN] Disconnect response:",d),d.success?(alert(d.message||"VPN disconnected."),n.emit("refresh-networks")):alert(`Failed to disconnect VPN: ${d.error||"Unknown error"}`),n.emit("render")},o.onVpnInfo=d=>{console.log("[VPN] Info received:",d),e.networksInfo&&(e.networksInfo.vpn=d),n.emit("render")},o.onSdcardInfo=d=>{console.log("[SD Card] Info received:",d),e.isLoadingSdcardInfo=!1,d.success&&d.info?(!d.info.cardCapacity&&e.sdcardInfo&&e.sdcardInfo.cardCapacity&&(d.info.cardCapacity=e.sdcardInfo.cardCapacity,d.info.sectorSize=e.sdcardInfo.sectorSize),e.sdcardInfo=d.info):e.sdcardInfo={error:d.error||"Failed to get storage information"},n.emit("render")},o.onSdcardMount=d=>{if(console.log("[SD Card] Mount response:",d),e.isMountingSDCard=!1,d.success){const u=d.log?d.log.join(`
`):"SD card mounted successfully";console.log(`[SD Card] Mount log:
`+u),d.info&&(e.sdcardInfo=d.info)}else{const u=d.error||"Unknown error",f=d.log?`

Log:
`+d.log.join(`
`):"";alert("Failed to mount SD card: "+u+f),e.sdcardInfo={error:u}}n.emit("render")},o.onSdcardUnmount=d=>{if(console.log("[SD Card] Unmount response:",d),e.isUnmountingSDCard=!1,d.success)console.log("[SD Card] Unmounted successfully"),e.sdcardInfo=null;else{const u=d.error||"Unknown error";alert("Failed to unmount SD card: "+u)}n.emit("render")},o.onGpioConfig=d=>{console.log("[GPIO] Config received:",d),e.isLoadingGpioConfig=!1,e.gpioConfigLoaded=!0,d.success&&d.config?e.gpioConfig=d.config:(d.chipInfo?e.gpioConfig={version:"1.0",assignments:{OUT:{digital:{PP:[],HS:[],LS:[]}},IN:{digital:{PU:[],PD:[],FLOAT:[]}},SPI0:{MISO:null,MOSI:null,SCLK:null,CS:null},SPI1:{MISO:null,MOSI:null,SCLK:null,CS:null},I2C0:{SDA:null,SCL:null},I2C1:{SDA:null,SCL:null},UART0:{TXD:null,RXD:null},UART1:{TXD:null,RXD:null},UART2:{TXD:null,RXD:null},CAN:{TX:null,RX:null},PWM:{channels:{}},NEO:{DIN:null,count:0},BUZZ:{PWM:null},BOOT:{pin:0,mode:"INPUT_PULLUP"},SDCARD:{CMD:null,CLK:null,D0:null,D1:null,D2:null,D3:null,mode:"SPI"},BRIDGE:{0:{HS:null,LS:null},1:{HS:null,LS:null}},USB:{DP:null,DM:null,enabled:!1}},metadata:{...d.chipInfo,board:d.chipInfo.board||"Unknown",modified:null}}:e.gpioConfig=null,console.warn("[GPIO] Config not found, using defaults with chip info")),n.emit("render")},o.onGpioConfigSave=d=>{console.log("[GPIO] Config save response:",d),d.success?(alert("GPIO configuration saved successfully"),n.emit("render")):alert(`Failed to save GPIO configuration: ${d.error||"Unknown error"}`)},o.onEthConfig=d=>{console.log("[Ethernet] Config received:",d),e.isLoadingEthConfig=!1,e.ethConfigLoaded=!0,d.success?(e.ethConfig=d.config||{},e.ethStatus=d.status||{}):(e.ethConfig={enabled:!0,dhcp:!0},console.warn("[Ethernet] Config not found, using defaults")),n.emit("render")},o.onEthConfigSave=d=>{console.log("[Ethernet] Config save response:",d),d.success?alert("Ethernet configuration saved successfully"):alert(`Failed to save Ethernet configuration: ${d.error||"Unknown error"}`),n.emit("render")},o.onEthInit=d=>{console.log("[Ethernet] Init response:",d),e.isInitializingEth=!1,d.success&&d.status?(e.ethStatus=d.status,d.status.gotip?alert(`Ethernet connected: ${d.status.ip}`):d.status.linkup?alert("Ethernet link up, waiting for DHCP..."):alert("Ethernet initialized (no cable detected)")):alert(`Ethernet initialization failed: ${d.error||"Unknown error"}`),n.emit("render")},o.onEthStatus=d=>{console.log("[Ethernet] Status received:",d),e.ethStatus=d,n.emit("render")},window.handleIframeMessage=async d=>{if(!d.data||d.data.type!=="execute")return;const{id:u,code:f}=d.data;console.log("[Iframe Bridge] Executing code from iframe:",f.substring(0,50)+"...");try{const p=await o.run(f,!0);console.log("[Iframe Bridge] Raw output from device:",p.substring(0,200));const h=p.indexOf("{");let m=p;if(h!==-1){let w=0,y=-1;for(let S=h;S<p.length;S++)if(p[S]==="{"&&w++,p[S]==="}"&&w--,w===0){y=S+1;break}y!==-1&&(m=p.substring(h,y),console.log("[Iframe Bridge] Extracted JSON:",m.substring(0,100)+"..."))}d.source.postMessage({type:"result",id:u,data:m},"*"),console.log("[Iframe Bridge] Result sent to iframe")}catch(p){console.log("[Iframe Bridge] Error executing code:",p),d.source.postMessage({type:"error",id:u,error:p.message||"Execution failed"},"*")}},window.addEventListener("message",window.handleIframeMessage);const c=e.cache(XTerm,"terminal");c&&c.term&&c.term.clear(),n.emit("close-connection-dialog");try{const d=await o.exec("getStatusInfo()");d&&(e.statusInfo=d,n.emit("render"))}catch{}startStatusInfoPolling(o,e,n),n.emit("refresh-system-info"),setTimeout(()=>{n.emit("terminal-focus")},200),(async()=>{try{const d=await updateBoardManifest(o);d&&(console.log(`[Connection] Board manifest updated to revision ${d}`),n.emit("board-manifest-updated"))}catch(d){console.warn("[Connection] Could not update the board manifest:",d)}try{const d=await o.exec(`
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
capabilities = None
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
        capabilities = config.get('capabilities')
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
  'capabilities': capabilities,
  'sdmmc': sdmmc
}))
`),u=typeof d=="object"?d:JSON.parse(d.trim());e.boardConfig={board_id:u.board_id,board_name:u.board_name,chip:u.chip,version:u.version,firmware_version:u.firmware_version,description:u.description,hardware:u.hardware,capabilities:u.capabilities,sdmmc:u.sdmmc};try{const p=new URL(r).hostname,h=u.board_id||p.replace(/\\./g,"-");await BridgeDisk.addOnboardedDevice(h,{hostname:p,url:r,board_id:u.board_id,board_name:u.board_name,chip:u.chip,version:u.version,connectedAt:new Date().toISOString()}),console.log("[Connection] Device saved to /onboarded/"),e.needsOnboarding=!1,e.knownBoards=await BridgeDisk.getOnboardedDevices()}catch(f){console.warn("[Connection] Could not save device to /onboarded/:",f)}n.emit("render")}catch(d){console.error("[BoardConfig] Failed to load board config:",d)}try{const d=(await __vitePreload(async()=>{const{DeviceAPI:$}=await Promise.resolve().then(()=>deviceApi);return{DeviceAPI:$}},void 0)).DeviceAPI,{updateDeviceExtensionRegistry:u,needsInstall:f}=await __vitePreload(async()=>{const{updateDeviceExtensionRegistry:$,needsInstall:C}=await Promise.resolve().then(()=>deviceRegistry);return{updateDeviceExtensionRegistry:$,needsInstall:C}},void 0),p=new d(BridgeDevice),h=await readDeviceExtensionRegistry(p),m=new Set(Object.keys(h));e.deviceApps=h,refreshBoardApps(e,n).catch($=>console.warn("[Extensions] Could not read apps:",$));const w=localStorage.getItem("pending-extension-id"),y=sessionStorage.getItem("extension-install-active");for(const $ in e.loadedExtensions)e.loadedExtensions[$].instance=null;if(y)console.log(`[Extensions] Skipping prune — install in progress for: ${y}`);else{const $=e.allCachedExtensions.filter(C=>!m.has(C.id)&&C.id!==w);$.length>0&&console.log(`[Extensions] Hiding ${$.length} extension(s) not on this device: ${$.map(C=>C.id).join(", ")}`),e.installedExtensions=e.allCachedExtensions.filter(C=>m.has(C.id)||C.id===w)}const S=Object.keys(h).filter($=>!e.installedExtensions.some(C=>C.id===$));if(S.length>0){console.log(`[Extensions] Device has ${S.length} extension(s) not cached in IDB: ${S.join(", ")}`);try{const{ExtensionRegistry:$}=await __vitePreload(async()=>{const{ExtensionRegistry:b}=await Promise.resolve().then(()=>extensionLoader);return{ExtensionRegistry:b}},void 0),C=new $,_=e.registryUrl||"https://cheerful-stoat-894.convex.site/api/v1/extensions",x=await C.loadIndex(_);for(const b of S){const k=x.find(F=>F.id===b);k?(console.log(`[Extensions] Re-installing ${b} from registry into IDB cache...`),await C.installExtension(k)):console.warn(`[Extensions] Extension ${b} not found in registry, skipping re-add`)}e.installedExtensions=await C.getInstalledExtensions(),e.allCachedExtensions=[...e.installedExtensions]}catch($){console.warn("[Extensions] Could not re-add extensions from registry:",$)}}console.log(`[Extensions] Device registry has ${Object.keys(h).length} extensions, sidebar showing: ${e.installedExtensions.map($=>$.id).join(", ")||"(none)"}`),n.emit("render"),w&&!h[w]&&(console.log(`[Extensions] Pending extension ${w} not in device registry — running onInstall`),(async()=>{try{const{ExtensionRegistry:$}=await __vitePreload(async()=>{const{ExtensionRegistry:I}=await Promise.resolve().then(()=>extensionLoader);return{ExtensionRegistry:I}},void 0),C=new $,_=await C.getExtension(w);if(!_||!_.content){console.warn(`[Extensions] No cached data for ${w}, skipping onInstall`);return}const x=decodeDeviceFiles(_.content);if(Object.keys(x).length===0){console.log(`[Extensions] ${w} has no device files, skipping onInstall`);const I=_.config?.version,O=Array.isArray(I)?I.join("."):String(I||"0.0.0");await u(p,w,O);return}const b=new Blob([_.content],{type:"text/javascript"}),k=URL.createObjectURL(b);let F;try{F=(await import(k)).default}finally{URL.revokeObjectURL(k)}if(!F){console.warn(`[Extensions] No default export in ${w} bundle`);return}const{html:A}=await __vitePreload(async()=>{const{html:I}=await import("./vendor-BzspHke8.js");return{html:I}},__vite__mapDeps([2,3,4])),R=new F(p,n.emit.bind(n),e,A);if(R.deviceFiles=x,typeof R.onInstall=="function"){if(console.log(`[Extensions] Running onInstall for ${w}...`),await R.onInstall()===!1){console.error(`[Extensions] onInstall returned false for ${w}`);return}const O=_.config?.version,z=Array.isArray(O)?O.join("."):String(O||"0.0.0");await u(p,w,z),console.log(`[Extensions] onInstall complete for ${w}`)}localStorage.removeItem("pending-extension-id"),sessionStorage.removeItem("extension-install-active"),e.installedExtensions=await C.getInstalledExtensions(),e.allCachedExtensions=[...e.installedExtensions],n.emit("render")}catch($){console.error(`[Extensions] Deferred onInstall failed for ${w}:`,$)}})())}catch(d){console.warn("[Extensions] Could not read device extension registry:",d)}})(),n.emit("render")}catch(c){let d="Connection failed";c instanceof Error||c&&c.message?d=c.message:c&&c.type==="error"&&(d=`WebSocket connection failed. Check if device is available at ${r}`),console.log("✗ Connection failed:",d);const u=r.startsWith("wss://"),f=d.includes("timeout")||d.includes("Timeout"),p=d.includes("Authentication failed")||d.includes("Invalid password");if(d.includes("1.x firmware")||c?.explained)e.connectionError={message:d};else if(p)e.connectionError={message:"Wrong password — check your device password and try again",authHint:!0};else if(u&&!f)try{const w=new URL(r.replace("wss://","https://")).origin;e.connectionError={message:d,certHint:!0,certUrl:w}}catch{e.connectionError={message:d}}else e.connectionError={message:d};e.isConnecting=!1,e.isConnected=!1,e.isConnectionDialogOpen=!0,updateOverlayDirectly(e),n.emit("render")}}),n.on("open-reset-dialog",()=>{e.isResetDialogOpen=!0,n.emit("render")}),n.on("close-reset-dialog",()=>{e.isResetDialogOpen=!1,n.emit("render")}),n.on("trigger-reset",async r=>{e.isResetDialogOpen=!1,n.emit("render");try{r===1?(console.log("[Connection] Triggering Hard Reset"),e.isResettingHard=!0,await o.reset(1),console.log("[Connection] Hard reset sent, waiting for disconnect...")):(console.log("[Connection] Triggering Soft Reset"),await o.reset(0))}catch(l){console.error("[Connection] Reset failed:",l),e.isResettingHard=!1,alert("Reset failed: "+l.message)}}),n.on("bind-terminal-input",()=>{const r=e.cache(XTerm,"terminal");!r||!r.term||r.bindInput(e,o)&&console.log("[Connection] Bound terminal input after view change")}),n.on("terminal-focus",async()=>{if(!e.isConnected||e.bannerDisplayed)return;const r=e.cache(XTerm,"terminal");if(!r||!r.term)return;const l=r.term;try{const a=await o.exec(`
import os, json
u = os.uname()
print(json.dumps({"version": u.version, "machine": u.machine}))
`);if(a){const c=`MicroPython ${a.version} on ${a.machine}`;l.write(`\r
\x1B[1;32m`+c+`\x1B[0m\r
`),l.write(`\x1B[0mType "help()" for more information.\r
`)}}catch(a){console.debug("[Connection] Failed to fetch version info:",a.message)}l.write(TERMINAL_PROMPT),l.scrollToBottom(),e.bannerDisplayed=!0,console.log("[Connection] Welcome banner displayed")})}function registerFileOperationHandlers(e,n,o,i,s,r,l){n.on("save",async()=>{if(console.log("save"),canSave({isConnected:e.isConnected,openFiles:e.openFiles,editingFile:e.editingFile})==!1){console.log("can't save");return}e.isSaving=!0,updateOverlayDirectly(e);let c=e.openFiles.find(m=>m.id===e.editingFile),d=!1;const u=c.parentFolder,f=u===null;f&&(c.source=="board"?c.parentFolder=e.boardNavigationPath:c.source=="disk"&&(c.parentFolder=e.diskNavigationPath));let p=!1;if(c.source=="board"?p=await fileExists(BridgeDevice,getFullPath(e.boardNavigationRoot,c.parentFolder,c.fileName)):c.source=="disk"&&(p=await i.fileExists(i.getFullPath(e.diskNavigationRoot,c.parentFolder,c.fileName))),(f||!p)&&(c.source=="board"?(c.parentFolder=e.boardNavigationPath,d=await fileExists(BridgeDevice,getFullPath(e.boardNavigationRoot,c.parentFolder,c.fileName))):c.source=="disk"&&(c.parentFolder=e.diskNavigationPath,d=await i.fileExists(i.getFullPath(e.diskNavigationRoot,c.parentFolder,c.fileName)))),d&&await confirmDialog(`You are about to overwrite the file ${c.fileName} on your ${c.source}.

 Are you sure you want to proceed?`)!==0){e.isSaving=!1,c.parentFolder=u,updateOverlayDirectly(e),n.emit("render");return}let h=c.editor.content||"";if(c.fileName&&c.fileName.toLowerCase().endsWith(".json"))try{const m=h.trim();if(m&&(m[0]==="{"||m[0]==="[")){const w=JSON.parse(m),y=JSON.stringify(w,null,2)+`
`;y!==h&&(h=y)}}catch{}try{if(c.source=="board"){if(["/main.py","/boot.py"].includes(getFullPath(e.boardNavigationRoot,c.parentFolder,c.fileName))&&await confirmDialog(`⚠️ Warning: Saving '${c.fileName}' to device may cause disconnection.

This file is running on the device. Overwriting it may crash the connection.

Recommended: Save locally instead (to disk), then reconnect.

Continue saving to device?`,"Cancel","OK")!==0){e.isSaving=!1,updateOverlayDirectly(e),n.emit("render");return}await o.saveFile(getFullPath(e.boardNavigationRoot,c.parentFolder,c.fileName),h,{progressCallback:w=>{e.savingProgress=w,n.emit("render")}})}else c.source=="disk"&&await i.saveFileContent(i.getFullPath(e.diskNavigationRoot,c.parentFolder,c.fileName),h)}catch(m){console.log("error",m)}c.hasChanges=!1,e.isSaving=!1,e.savingProgress=0,updateOverlayDirectly(e),n.emit("refresh-files"),n.emit("render")}),n.on("select-tab",a=>{if(console.log("select-tab",a),!e.openFiles.find(d=>d.id===a)){console.warn("[select-tab] Tab not found:",a);return}e.editingFile=a,n.emit("render")}),n.on("close-tab",async a=>{console.log("close-tab",a);const c=e.openFiles.find(d=>d.id===a);if(!c){console.warn("[close-tab] Tab not found:",a);return}if(c.hasChanges&&await confirmDialog("Your file has unsaved changes. Are you sure you want to proceed?")!==0)return!1;e.openFiles=e.openFiles.filter(d=>d.id!==a),e.openFiles.length>0?e.editingFile=e.openFiles[0].id:await r("disk"),n.emit("render")}),n.on("refresh-board-files",async()=>{if(console.log("refresh-board-files"),e.isConnected)try{e.boardFiles=await getBoardFiles(getFullPath(e.boardNavigationRoot,e.boardNavigationPath,""))}catch{e.boardFiles=[]}else e.boardFiles=[];n.emit("refresh-selected-files"),n.emit("render")}),n.on("refresh-disk-files",async()=>{console.log("refresh-disk-files");try{e.diskFiles=await getDiskFiles(i.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,""))}catch(a){console.error("[FS] Error refreshing disk files:",a),e.diskNavigationRoot=null,e.diskNavigationPath="/"}n.emit("refresh-selected-files"),n.emit("render")}),n.on("refresh-files",async()=>{if(console.log("refresh-files"),e.isLoadingFiles)return;e.isLoadingFiles=!0;const a=document.getElementById("overlay");a?(a.classList.remove("closed"),a.classList.add("open"),a.innerHTML="<p>Loading files...</p>"):n.emit("render");try{await Promise.all([(async()=>{if(e.isConnected)try{e.boardFiles=await getBoardFiles(getFullPath(e.boardNavigationRoot,e.boardNavigationPath,""))}catch{e.boardFiles=[]}else e.boardFiles=[]})(),(async()=>{try{e.diskFiles=await getDiskFiles(i.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,""))}catch(c){console.error("[FS] Error refreshing files:",c),e.diskNavigationRoot=null,e.diskNavigationPath="/"}})()])}finally{e.isLoadingFiles=!1,n.emit("refresh-selected-files");const c=document.getElementById("overlay");c&&(c.classList.remove("open"),c.classList.add("closed")),e.systemSection==="file-manager"&&n.emit("render")}}),n.on("refresh-selected-files",()=>{e.selectedFiles=e.selectedFiles.filter(a=>a.source==="board"?e.isConnected?e.boardFiles.find(c=>a.fileName===c.fileName):!1:e.diskFiles.find(c=>a.fileName===c.fileName)),n.emit("render")}),n.on("create-new-tab",async(a,c=null)=>{const d=a=="board"?e.boardNavigationPath:e.diskNavigationPath;console.log("create-new-tab",a,c,d),await r(a,c,d)&&(n.emit("close-new-file-dialog"),n.emit("render"))}),n.on("create-file",(a,c=null)=>{console.log("create-file",a),e.creatingFile===null&&(e.creatingFile=a,e.creatingFolder=null,c!=null&&n.emit("finish-creating-file",c),n.emit("render"))}),n.on("finish-creating-file",async a=>{if(console.log("finish-creating",a),!e.creatingFile)return;if(!a){e.creatingFile=null,n.emit("render");return}if(e.creatingFile=="board"&&e.isConnected){if(await checkBoardFile({root:e.boardNavigationRoot,parentFolder:e.boardNavigationPath,fileName:a})&&await confirmDialog(`You are about to overwrite the file ${a} on your board.

Are you sure you want to proceed?`)!==0){e.creatingFile=null,n.emit("render");return}if(["main.py","boot.py"].includes(a)&&await confirmDialog(`⚠️ Warning: Saving '${a}' to device may cause disconnection.

This file is running on the device. Overwriting it may crash the connection.

Recommended: Save locally instead (to disk), then reconnect.

Continue saving to device?`)!==0){e.creatingFile=null,n.emit("render");return}await o.saveFile(getFullPath(e.boardNavigationRoot,e.boardNavigationPath,a),newFileContent)}else if(e.creatingFile=="disk"){if(await checkDiskFile({root:e.diskNavigationRoot,parentFolder:e.diskNavigationPath,fileName:a})&&await confirmDialog(`You are about to overwrite the file ${a} on your disk.

Are you sure you want to proceed?`)!==0){e.creatingFile=null,n.emit("render");return}await i.saveFileContent(i.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,a),newFileContent)}const c=e.creatingFile;setTimeout(()=>{e.creatingFile=null,dismissOpenDialogs(e,n),c==="disk"?n.emit("refresh-disk-files"):n.emit("refresh-board-files"),n.emit("render")},200)}),n.on("import-files",async()=>{console.log("import-files");try{const a=i.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,""),c=await i.importFiles(a);c.length>0&&(console.log(`[Store] Imported ${c.length} file(s):`,c.map(d=>d.name).join(", ")),n.emit("refresh-disk-files"),n.emit("render"))}catch(a){console.error("[Store] Error importing files:",a),alert(`Failed to import files: ${a.message}`)}}),n.on("upload-to-device",async()=>{if(console.log("upload-to-device"),!e.isConnected){alert("Please connect to device first");return}try{const a=document.createElement("input");a.type="file",a.multiple=!0;const c=await new Promise((f,p)=>{a.onchange=h=>{f(Array.from(h.target.files||[]))},a.oncancel=()=>f([]),a.click()});if(c.length===0)return;e.isTransferring=!0,updateOverlayDirectly(e);const d=c.map(f=>f.name),u=await checkOverwrite({source:"board",fileNames:d,parentPath:getFullPath(e.boardNavigationRoot,e.boardNavigationPath,"")});if(u.length>0){let f=`You are about to overwrite the following files/folders on your board:

`;if(u.forEach(h=>f+=`${h.fileName}
`),f+=`
Are you sure you want to proceed?`,await confirmDialog(f,"Cancel","Yes")!==0){e.isTransferring=!1,updateOverlayDirectly(e),n.emit("render");return}}for(const f of c){const p=getFullPath(e.boardNavigationRoot,e.boardNavigationPath,f.name),h=await f.arrayBuffer(),m=new Uint8Array(h);await o.saveFile(p,m,{progressCallback:w=>{e.transferringProgress=`${f.name}: ${w}%`,n.emit("render")}}),e.transferringProgress=""}n.emit("refresh-files"),n.emit("render")}catch(a){console.error("[Store] Error uploading to device:",a),alert(`Failed to upload files: ${a.message}`)}finally{e.isTransferring=!1,e.transferringProgress="",updateOverlayDirectly(e),n.emit("render")}}),n.on("create-folder",a=>{console.log("create-folder",a),e.creatingFolder===null&&(e.creatingFolder=a,e.creatingFile=null,n.emit("render"))}),n.on("finish-creating-folder",async a=>{if(console.log("finish-creating-folder",a),!!e.creatingFolder){if(!a){e.creatingFolder=null,n.emit("render");return}if(e.creatingFolder=="board"&&e.isConnected){if(await checkBoardFile({root:e.boardNavigationRoot,parentFolder:e.boardNavigationPath,fileName:a})){if(await confirmDialog(`You are about to overwrite ${a} on your board.

Are you sure you want to proceed?`)!==0){e.creatingFolder=null,n.emit("render");return}await removeBoardFolder(getFullPath(e.boardNavigationRoot,e.boardNavigationPath,a))}await createFolder(o,getFullPath(e.boardNavigationRoot,e.boardNavigationPath,a))}else if(e.creatingFolder=="disk"){if(await checkDiskFile({root:e.diskNavigationRoot,parentFolder:e.diskNavigationPath,fileName:a})){if(await confirmDialog(`You are about to overwrite ${a} on your disk.

Are you sure you want to proceed?`)!==0){e.creatingFolder=null,n.emit("render");return}await i.removeFolder(i.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,a))}await i.createFolder(i.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,a))}setTimeout(()=>{e.creatingFolder=null,n.emit("refresh-files"),n.emit("render")},200)}}),n.on("remove-files",async()=>{console.log("remove-files");let a=e.selectedFiles.filter(h=>h.source==="board").map(h=>h.fileName),c=e.selectedFiles.filter(h=>h.source==="disk").map(h=>h.fileName),d=`You are about to delete the following files:

`;if(a.length&&(d+=`From your board:
`,a.forEach(h=>d+=`${h}
`),d+=`
`),c.length&&(d+=`From your disk:
`,c.forEach(h=>d+=`${h}
`),d+=`
`),d+="Are you sure you want to proceed?",await confirmDialog(d)!==0){n.emit("render");return}let f=!1,p=!1;for(let h in e.selectedFiles){const m=e.selectedFiles[h];m.type=="folder"?m.source==="board"?(await removeBoardFolder(getFullPath(e.boardNavigationRoot,e.boardNavigationPath,m.fileName)),f=!0):(await i.removeFolder(i.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,m.fileName)),p=!0):m.source==="board"?(await deleteFile(o,getFullPath(e.boardNavigationRoot,e.boardNavigationPath,m.fileName)),f=!0):(await i.removeFile(i.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,m.fileName)),p=!0)}f&&p?n.emit("refresh-files"):f?n.emit("refresh-board-files"):p&&n.emit("refresh-disk-files"),e.selectedFiles=[],n.emit("render")}),n.on("rename-file",(a,c)=>{console.log("rename-file",a,c),e.renamingFile=a,n.emit("render")}),n.on("finish-renaming-file",async a=>{console.log("finish-renaming-file",a);const c=e.selectedFiles[0];if(!a||c.fileName==a){e.renamingFile=null,n.emit("render");return}if(e.isSaving=!0,updateOverlayDirectly(e),e.renamingFile=="board"&&e.isConnected){if((await checkOverwrite({fileNames:[a],parentPath:i.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,""),source:"board"})).length>0){let u=`You are about to overwrite the following file/folder on your board:

`;if(u+=`${a}

`,u+="Are you sure you want to proceed?",await confirmDialog(u)!==0){e.isSaving=!1,e.renamingFile=null,updateOverlayDirectly(e),n.emit("render");return}c.type=="folder"?await removeBoardFolder(getFullPath(e.boardNavigationRoot,e.boardNavigationPath,a)):c.type=="file"&&await deleteFile(o,getFullPath(e.boardNavigationRoot,e.boardNavigationPath,a))}}else if(e.renamingFile=="disk"&&(await checkOverwrite({fileNames:[a],parentPath:i.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,""),source:"disk"})).length>0){let u=`You are about to overwrite the following file/folder on your disk:

`;if(u+=`${a}

`,u+="Are you sure you want to proceed?",await confirmDialog(u)!==0){e.isSaving=!1,e.renamingFile=null,updateOverlayDirectly(e),n.emit("render");return}c.type=="folder"?await i.removeFolder(i.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,a)):c.type=="file"&&await i.removeFile(i.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,a))}try{e.renamingFile=="board"?await renameFile(o,getFullPath(e.boardNavigationRoot,e.boardNavigationPath,c.fileName),getFullPath(e.boardNavigationRoot,e.boardNavigationPath,a)):await i.renameFile(i.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,c.fileName),i.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,a));const d=e.openFiles.findIndex(u=>u.fileName===c.fileName&&u.source===c.source&&u.parentFolder===c.parentFolder);d>-1&&(e.openFiles[d].fileName=a,n.emit("render"))}catch{alert(`The file ${c.fileName} could not be renamed to ${a}`)}e.isSaving=!1,e.renamingFile=null,updateOverlayDirectly(e),n.emit("refresh-files"),n.emit("render")}),n.on("rename-tab",a=>{console.log("rename-tab",a),e.renamingTab=a,n.emit("render")}),n.on("finish-renaming-tab",async a=>{console.log("finish-renaming-tab",a);const c=e.openFiles.find(m=>m.id===e.renamingTab);if(!a||c.fileName==a){e.renamingTab=null,e.isSaving=!1,updateOverlayDirectly(e),n.emit("render");return}e.isSaving=!0,updateOverlayDirectly(e);const d=c.parentFolder,u=c.fileName;c.fileName=a;const f=d===null;let p=!1;f||(c.source=="board"?p=await fileExists(BridgeDevice,getFullPath(e.boardNavigationRoot,c.parentFolder,u)):c.source=="disk"&&(p=await i.fileExists(i.getFullPath(e.diskNavigationRoot,c.parentFolder,u)))),(f||!p)&&(c.source=="board"?c.parentFolder=e.boardNavigationPath:c.source=="disk"&&(c.parentFolder=e.diskNavigationPath));let h=!1;if(c.source=="board"?h=await fileExists(BridgeDevice,getFullPath(e.boardNavigationRoot,c.parentFolder,c.fileName)):c.source=="disk"&&(h=await i.fileExists(i.getFullPath(e.diskNavigationRoot,c.parentFolder,c.fileName))),h&&await confirmDialog(`You are about to overwrite the file ${c.fileName} on your ${c.source}.

 Are you sure you want to proceed?`)!==0){e.renamingTab=null,e.isSaving=!1,c.fileName=u,n.emit("render");return}if(p){if(c.hasChanges){const m=c.editor.content||"";try{if(c.source=="board"){if(["main.py","boot.py"].includes(u)&&await confirmDialog(`⚠️ Warning: Saving '${u}' to device may cause disconnection.

This file is running on the device. Overwriting it may crash the connection.

Recommended: Save locally instead (to disk), then reconnect.

Continue saving to device?`,"Cancel","OK")!==0){e.renamingTab=null,e.isSaving=!1,c.fileName=u,updateOverlayDirectly(e),n.emit("render");return}await o.saveFile(getFullPath(e.boardNavigationRoot,c.parentFolder,u),m,{progressCallback:y=>{e.savingProgress=y,n.emit("render")}})}else c.source=="disk"&&await i.saveFileContent(i.getFullPath(e.diskNavigationRoot,c.parentFolder,u),m)}catch(w){console.log("error",w)}}try{c.source=="board"?await renameFile(o,getFullPath(e.boardNavigationRoot,c.parentFolder,u),getFullPath(e.boardNavigationRoot,c.parentFolder,c.fileName)):c.source=="disk"&&await i.renameFile(i.getFullPath(e.diskNavigationRoot,c.parentFolder,u),i.getFullPath(e.diskNavigationRoot,c.parentFolder,c.fileName))}catch(m){console.log("error",m)}}else if(!p){const m=c.editor.content||"";try{if(c.source=="board"){if(["main.py","boot.py"].includes(c.fileName)&&await confirmDialog(`⚠️ Warning: Saving '${c.fileName}' to device may cause disconnection.

This file is running on the device. Overwriting it may crash the connection.

Recommended: Save locally instead (to disk), then reconnect.

Continue saving to device?`,"Cancel","OK")!==0){e.renamingTab=null,e.isSaving=!1,c.fileName=u,updateOverlayDirectly(e),n.emit("render");return}await o.saveFile(getFullPath(e.boardNavigationRoot,c.parentFolder,c.fileName),m,{progressCallback:y=>{e.savingProgress=y,n.emit("render")}})}else c.source=="disk"&&await i.saveFileContent(i.getFullPath(e.diskNavigationRoot,c.parentFolder,c.fileName),m)}catch(w){console.log("error",w)}}c.hasChanges=!1,e.renamingTab=null,e.isSaving=!1,e.savingProgress=0,updateOverlayDirectly(e),n.emit("refresh-files"),n.emit("render")}),n.on("toggle-file-selection",(a,c,d)=>{console.log("toggle-file-selection",a,c,d);let u=c=="board"?e.boardNavigationPath:e.diskNavigationPath;if(d&&!d.ctrlKey&&!d.metaKey){e.selectedFiles=[{fileName:a.fileName,type:a.type,source:c,parentFolder:u}],n.emit("render");return}e.selectedFiles.find(p=>p.fileName===a.fileName&&p.source===c)?e.selectedFiles=e.selectedFiles.filter(p=>!(p.fileName===a.fileName&&p.source===c)):e.selectedFiles.push({fileName:a.fileName,type:a.type,source:c,parentFolder:u}),n.emit("render")}),n.on("open-selected-files",async()=>{console.log("open-selected-files");let a=[],c=[];if(!e.isLoadingFiles){e.isLoadingFiles=!0,n.emit("render");for(let d in e.selectedFiles){let u=e.selectedFiles[d];if(u.type=="folder")continue;const f=e.openFiles.find(p=>p.fileName==u.fileName&&p.source==u.source&&p.parentFolder==u.parentFolder);if(f)c.push(f);else{let p=null;if(u.source=="board"){const h=await o.loadFile(getFullPath(e.boardNavigationRoot,e.boardNavigationPath,u.fileName)),m=new Uint8Array(h),w=new TextDecoder("utf-8").decode(m);p=await s({parentFolder:e.boardNavigationPath,fileName:u.fileName,source:u.source,content:w}),p.editor.onChange=function(){p.hasChanges=!0,n.emit("render")}}else if(u.source=="disk"){const h=await i.loadFile(i.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,u.fileName)),m=new Uint8Array(h),w=new TextDecoder("utf-8").decode(m);p=await s({parentFolder:e.diskNavigationPath,fileName:u.fileName,source:u.source,content:w}),p.editor.onChange=function(){p.hasChanges=!0,n.emit("render")}}a.push(p)}}c.length>0&&(e.editingFile=c[0].id),a.length>0&&(e.editingFile=a[0].id),e.openFiles=e.openFiles.concat(a),e.selectedFiles=[],e.isLoadingFiles=!1,n.emit("change-view","editor"),n.emit("render")}}),n.on("open-board-file",async a=>{const c=a.lastIndexOf("/"),d=a.slice(0,c),u=a.slice(c+1);let f=e.openFiles.find(p=>p.source=="board"&&p.parentFolder==d&&p.fileName==u);if(!f){const p=new Uint8Array(await o.loadFile(a));f=await s({parentFolder:d,fileName:u,source:"board",content:new TextDecoder("utf-8").decode(p)}),f.editor.onChange=function(){f.hasChanges=!0,n.emit("render")},e.openFiles=e.openFiles.concat(f)}e.editingFile=f.id,n.emit("change-view","editor"),n.emit("render")}),n.on("open-file",(a,c)=>{console.log("open-file",a,c),e.selectedFiles=[{fileName:c.fileName,type:c.type,source:a,parentFolder:e[`${a}NavigationPath`]}],n.emit("open-selected-files")}),n.on("upload-files",async()=>{console.log("upload-files"),e.isTransferring=!0,n.emit("render");const a=await checkOverwrite({source:"board",fileNames:e.selectedFiles.map(c=>c.fileName),parentPath:getFullPath(e.boardNavigationRoot,e.boardNavigationPath,"")});if(a.length>0){let c=`You are about to overwrite the following files/folders on your board:

`;if(a.forEach(u=>c+=`${u.fileName}
`),c+=`
`,c+="Are you sure you want to proceed?",await confirmDialog(c)!==0){e.isTransferring=!1,n.emit("render");return}}try{for(let c in e.selectedFiles){const d=e.selectedFiles[c],u=i.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,d.fileName),f=getFullPath(e.boardNavigationRoot,e.boardNavigationPath,d.fileName);if(d.type=="folder")await uploadFolder(u,f,(p,h)=>{e.transferringProgress=`${h}: ${p}`,n.emit("render")}),e.transferringProgress="";else{const p=await BridgeDisk.loadFile(u),h=new Uint8Array(p);await o.saveFile(f,h,{progressCallback:m=>{e.transferringProgress=`${d.fileName}: ${m}%`,n.emit("render")}}),e.transferringProgress=""}}e.selectedFiles=[],e.isTransferring=!1,e.transferringProgress="",updateOverlayDirectly(e),n.emit("refresh-files"),n.emit("render")}catch(c){console.error("[Upload] Transfer failed:",c),e.isTransferring=!1,e.transferringProgress="",updateOverlayDirectly(e),n.emit("render");let d=c.message;d&&d.includes("Transfer already in progress")&&(d="Transfer already in progress. The device may have stale TFTP state from a previous disconnected transfer. Please wait a moment and try again, or disconnect and reconnect."),alert(`Upload failed: ${d}`)}}),n.on("download-files",async()=>{console.log("download-files"),e.isTransferring=!0,updateOverlayDirectly(e),n.emit("render");const a=await checkOverwrite({source:"disk",fileNames:e.selectedFiles.map(c=>c.fileName),parentPath:i.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,"")});if(a.length>0){let c=`You are about to overwrite the following files/folders on your disk:

`;if(a.forEach(u=>c+=`${u.fileName}
`),c+=`
`,c+="Are you sure you want to proceed?",await confirmDialog(c)!==0){e.isTransferring=!1,n.emit("render");return}}try{for(let c in e.selectedFiles){const d=e.selectedFiles[c],u=getFullPath(e.boardNavigationRoot,e.boardNavigationPath,d.fileName),f=i.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,d.fileName);if(d.type=="folder")await downloadFolder(u,f,p=>{e.transferringProgress=p,n.emit("render")});else{const p=await o.loadFile(u,{progressCallback:h=>{e.transferringProgress=`${d.fileName}: ${h}%`,n.emit("render")}});await BridgeDisk.saveFileContent(f,p.buffer)}}e.isTransferring=!1,e.selectedFiles=[],updateOverlayDirectly(e),n.emit("refresh-files"),n.emit("render")}catch(c){console.error("[Download] Transfer failed:",c),e.isTransferring=!1,e.transferringProgress="",updateOverlayDirectly(e),n.emit("render");let d=c.message;d&&d.includes("Transfer already in progress")&&(d="Transfer already in progress. The device may have stale TFTP state from a previous disconnected transfer. Please wait a moment and try again, or disconnect and reconnect."),alert(`Download failed: ${d}`)}}),n.on("export-files",async()=>{console.log("export-files");for(const a of e.selectedFiles)if(a.type!=="folder")try{let c;if(a.source==="board"){const m=getFullPath(e.boardNavigationRoot,e.boardNavigationPath,a.fileName),w=await o.loadFile(m);c=new Uint8Array(w)}else{const m=i.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,a.fileName),w=await i.loadFile(m);c=new Uint8Array(w)}const d=a.fileName.split(".").pop().toLowerCase(),u={png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg",webp:"image/webp",gif:"image/gif",py:"text/plain",txt:"text/plain",json:"application/json",md:"text/markdown"},f=new Blob([c],{type:u[d]||"application/octet-stream"}),p=URL.createObjectURL(f),h=document.createElement("a");h.href=p,h.download=a.fileName,document.body.appendChild(h),h.click(),document.body.removeChild(h),URL.revokeObjectURL(p)}catch(c){console.error(`[Export] Failed to export ${a.fileName}:`,c),alert(`Failed to export ${a.fileName}: ${c.message}`)}}),n.on("navigate-board-folder",a=>{console.log("navigate-board-folder",a),e.boardNavigationPath=getNavigationPath(e.boardNavigationPath,a),n.emit("refresh-files"),n.emit("render")}),n.on("navigate-board-parent",()=>{console.log("navigate-board-parent"),e.boardNavigationPath=getNavigationPath(e.boardNavigationPath,".."),n.emit("refresh-files"),n.emit("render")}),n.on("navigate-disk-folder",a=>{console.log("navigate-disk-folder",a),e.diskNavigationPath=i.getNavigationPath(e.diskNavigationPath,a),n.emit("refresh-files"),n.emit("render")}),n.on("navigate-disk-parent",()=>{console.log("navigate-disk-parent"),e.diskNavigationPath=i.getNavigationPath(e.diskNavigationPath,".."),n.emit("refresh-files"),n.emit("render")})}function debuggerStore(e,n){let o=null;console.log("[Debugger Store] Registering event handlers"),n.on("debugger:open-config",()=>{console.log("[Debugger] Opening config modal"),e.debugger.configOpen=!0,n.emit("render")}),n.on("debugger:close-config",()=>{e.debugger.configOpen=!1,n.emit("render")}),n.on("debugger:toggle-file",i=>{const s=e.debugger.debugFiles.indexOf(i);s>=0?e.debugger.debugFiles.splice(s,1):e.debugger.debugFiles.push(i),n.emit("render")}),n.on("debugger:set-watches",i=>{const s=i.split(`
`).map(r=>r.trim()).filter(r=>r.length>0);e.debugger.watchExpressions[""]=s,n.emit("render")}),n.on("debugger:start",async()=>{try{const i=e.openFiles.find(r=>r.id===e.editingFile);if(!i){console.error("[Debugger] No file open");return}const s=i.editor?i.editor.content:"";if(!s){console.error("[Debugger] No content to debug");return}e.debugger.active=!0,n.emit("render"),o=new DebugSession(e,n),await o.start(s,e.debugger.watchExpressions,e.debugger.conditionalBreakpoints,i.fileName)}catch(i){console.error("[Debugger] Failed to start:",i),e.debugger.active=!1,n.emit("render")}}),n.on("debugger:step-over",async()=>{o&&await o.stepOver()}),n.on("debugger:step-into",async()=>{o&&await o.stepInto()}),n.on("debugger:step-out",async()=>{o&&await o.stepOut()}),n.on("debugger:continue",async(i=!0)=>{o&&await o.continue(i)}),n.on("debugger:stop",async()=>{o&&(await o.stop(),o=null),e.debugger.active=!1,e.debugger.halted=!1,e.debugger.configOpen=!1,n.emit("render")}),n.on("debugger:state-update",i=>{e.debugger.currentFile=i.f,e.debugger.currentLine=i.l,e.debugger.variables=i.w,e.debugger.locals=i.v,e.debugger.memory=i.m,e.debugger.timing=i.t,e.debugger.halted=i.h,n.emit("render")}),n.on("debugger:edit-breakpoint",i=>{const{file:s,line:r}=i;e.debugger.breakpoints[s]||(e.debugger.breakpoints[s]={}),e.debugger.breakpoints[s][r]||(e.debugger.breakpoints[s][r]={condition:"",hitCount:"",enabled:!0}),e.debugger.editingBreakpoint={file:s,line:r},e.debugger.breakpointModalOpen=!0,n.emit("render")}),n.on("debugger:save-breakpoint",i=>{const{file:s,line:r,config:l}=i;e.debugger.breakpoints[s]||(e.debugger.breakpoints[s]={}),e.debugger.breakpoints[s][r]=l,e.debugger.breakpointModalOpen=!1,e.debugger.editingBreakpoint=null,n.emit("debugger:breakpoints-updated",{file:s}),n.emit("render")}),n.on("debugger:delete-breakpoint",i=>{const{file:s,line:r}=i;e.debugger.breakpoints[s]&&delete e.debugger.breakpoints[s][r],e.debugger.breakpointModalOpen=!1,e.debugger.editingBreakpoint=null,n.emit("debugger:breakpoints-updated",{file:s}),n.emit("render")}),n.on("debugger:close-breakpoint-modal",()=>{e.debugger.breakpointModalOpen=!1,e.debugger.editingBreakpoint=null,n.emit("render")})}class DebugSession{constructor(n,o){this.state=n,this.emitter=o,this.device=BridgeDevice}async start(n,o,i,s){if(console.log("[Debugger] Starting debug session for:",s),!instrumentCodeForExec){console.error("[Debugger] instrumentCodeForExec not available - debugger-utils.js may not be loaded"),this.emitter.emit("show-dialog",{title:"Debugger Error",message:"Debugger utilities not loaded. Please refresh the page.",buttons:["OK"]});return}const r=performance.now(),l=await instrumentCodeForExec(n,{watches:this.state.debugger.watchExpressions,conditionalBP:this.state.debugger.conditionalBreakpoints,breakpoints:this.state.debugger.breakpoints,fileName:s});console.log(`[Debugger] Instrumentation took ${(performance.now()-r).toFixed(0)}ms`),await this.device.interrupt(),await sleep(100),this.device.subscribe("debug-state",this.onDebugState.bind(this)),console.log("[Debugger] Executing instrumented code...");try{await this.device.run(l),console.log("[Debugger] Execution completed successfully")}catch(a){console.warn("[Debugger] Code execution ended:",a.message)}finally{this.emitter.emit("terminal:write-prompt"),this.device.unsubscribe("debug-state"),this.state.debugger.active=!1,this.state.debugger.halted=!1,this.emitter.emit("render")}}async stepInto(){console.log("[Debugger] Step Into"),await this.device.sendDebugCommand("S")}async stepOver(){console.log("[Debugger] Step Over"),await this.device.sendDebugCommand("SO")}async stepOut(){console.log("[Debugger] Step Out"),await this.device.sendDebugCommand("ST")}async continue(n=!0){console.log("[Debugger] Continue",n?"(with log)":"(no log)"),await this.device.sendDebugCommand(n?"CW":"CO")}async stop(){console.log("[Debugger] Stop"),await this.device.interrupt(),this.device.unsubscribe("debug-state")}onDebugState(n){console.log("[Debugger] State update:",n),this.emitter.emit("debugger:state-update",n),this.displayDebugState(n)}displayDebugState(n){let o=`
[DEBUG] Paused at ${n.f}:${n.l}
`;const i=Object.entries(n.w);i.length>0&&(o+=`
[WATCHES]
`,i.forEach(([r,l])=>{o+=`  ${r} = ${l}
`}));const s=Object.entries(n.v||{});s.length>0&&(o+=`
[LOCALS]
`,s.forEach(([r,l])=>{o+=`  ${r} = ${l}
`})),o+=`[DEBUG] Memory: ${this.formatBytes(n.m)} | Time: ${n.t} ms
`,this.emitter.emit("terminal:append",o)}formatBytes(n){if(!n)return"0 B";const o=1024,i=["B","KB","MB"],s=Math.floor(Math.log(n)/Math.log(o));return`${(n/Math.pow(o,s)).toFixed(1)} ${i[s]}`}}const TICK_MS=1e3;function registerTxLatchHandlers(e,n,o){let i=null;e.txLatch={armedUntil:0};function s(){i||(i=setInterval(()=>{Date.now()>=e.txLatch.armedUntil&&(e.txLatch.armedUntil=0,clearInterval(i),i=null),n.emit("render")},TICK_MS))}n.on("tx-arm",r=>{o.armTx(r*1e3),e.txLatch.armedUntil=Date.now()+r*1e3,s(),n.emit("render")}),n.on("tx-disarm",()=>{o.disarmTx(),e.txLatch.armedUntil=0,n.emit("render")}),o.subscribe("tx_armed_ms",r=>{e.txLatch.armedUntil=r>0?Date.now()+r:0,r>0&&s(),n.emit("render")})}function shortcutAction(e,n){const o=e.ctrlKey||e.metaKey,i=e.key?.toLowerCase();if(o&&i==="l")return["clear-terminal"];if(n.systemSection!=="editor")return null;const{active:s,configOpen:r,halted:l}=n.debugger;return s||r?o&&(i==="s"||i==="n"||i==="r")?[]:i==="f5"?s?l?["debugger:continue",!0]:[]:["debugger:start"]:s&&i==="f10"?l?["debugger:step-over"]:[]:s&&i==="f11"?l?["debugger:step-into"]:[]:s&&i==="f12"?l?["debugger:step-out"]:[]:null:o&&i==="s"?["save"]:o&&i==="n"?["create-new-file"]:o&&i==="r"&&n.isConnected?["run-from-button"]:null}function registerShortcutHandlers(e,n){document.addEventListener("keydown",o=>{const i=shortcutAction(o,e);i&&(o.preventDefault(),i.length&&n.emit(...i))})}const SCRIPTOHUB_API_URL="https://cheerful-stoat-894.convex.site";async function listSkills(e,n={}){const o=e||SCRIPTOHUB_API_URL,i=new URLSearchParams;n.limit&&i.set("limit",String(n.limit)),n.cursor&&i.set("cursor",n.cursor),n.sort&&i.set("sort",n.sort);const s=`${o}/api/v1/skills${i.toString()?"?"+i:""}`,r=await fetch(s);if(!r.ok)throw new Error(`ScriptoHub listSkills failed: ${r.status} ${r.statusText}`);return r.json()}async function getSkill(e,n){const i=await fetch(`${n||SCRIPTOHUB_API_URL}/api/v1/skills/${encodeURIComponent(e)}`);if(!i.ok)throw new Error(`ScriptoHub getSkill(${e}) failed: ${i.status}`);return i.json()}async function getSkillFile(e,n,o){const i=o||SCRIPTOHUB_API_URL,s=new URLSearchParams({path:n}),r=await fetch(`${i}/api/v1/skills/${encodeURIComponent(e)}/file?${s}`);if(!r.ok)throw new Error(`ScriptoHub getSkillFile(${e}, ${n}) failed: ${r.status}`);return r.text()}async function getSkillFileBytes(e,n,o){const i=o||SCRIPTOHUB_API_URL,s=new URLSearchParams({path:n}),r=await fetch(`${i}/api/v1/skills/${encodeURIComponent(e)}/file?${s}`);if(!r.ok)throw new Error(`ScriptoHub getSkillFileBytes(${e}, ${n}) failed: ${r.status}`);const l=await r.arrayBuffer();return new Uint8Array(l)}const README="SKILL.md",MAIN="main.py",TOOL=/^tools\/([A-Za-z0-9_]+)\.py$/,ID=/^[a-z0-9][a-z0-9-]*$/;function installPlan(e){let n=null;const o=[];for(const{path:i}of e||[]){if(i===README)continue;const s=i.match(TOOL);if(i===MAIN)n=i;else if(s)o.push({name:s[1],path:i});else return null}return o.length?(o.sort((i,s)=>i.name<s.name?-1:1),{main:n,tools:o}):null}function toolNames(e,n){return n.tools.filter(o=>!o.name.startsWith("_")).map(o=>`${e}_${o.name}`)}async function installScripto(e,n,o){if(!ID.test(n.id))throw new Error(`A ScriptO's id is lowercase letters, digits and hyphens: ${n.id}`);const i={};for(const a of n.plan.tools)i[a.name]=await o(a.path);const s={id:n.id,tools:i};n.name&&(s.name=n.name),n.version&&(s.version=n.version),n.plan.main&&(s.code=await o(n.plan.main));const{text:r,isError:l}=await e.callTool("scripto_create",s);if(l)throw new Error(r);try{return JSON.parse(r)}catch{return{id:n.id}}}const SCRIPTO_ASSET_ROOT="/scriptos";async function deployScriptoAssets(e,n){const o=e.assetFiles||[];if(o.length===0)return;if(!n.isConnected){console.warn("[Scripto assets] device not connected — skipping asset deploy");return}const i=e.slug,s=`${SCRIPTO_ASSET_ROOT}/${i}`;console.log(`[Scripto assets] deploying ${o.length} file(s) to ${s}/`),await createFolder(BridgeDevice,SCRIPTO_ASSET_ROOT).catch(()=>{}),await createFolder(BridgeDevice,s).catch(()=>{});for(const r of o){const l=await getSkillFileBytes(i,r.path,n.scriptohubApiUrl);await BridgeDevice.saveFile(`${s}/${r.path}`,l),console.log(`[Scripto assets] wrote ${s}/${r.path} (${l.length} bytes)`)}}function registerScriptOsHandlers(e,n,o,i,s){const r=console.log;n.on("open-scriptos-modal",async()=>{r("open-scriptos-modal"),e.isLoadingRegistry=!0,e.scriptOsModalView="library",e.scriptOsSearchQuery="",e.scriptOsFilterTags=[],e.isScriptOsModalOpen=!0,n.emit("render");try{console.log("[Registry] Fetching skills from ScriptoHub...");const l=await listSkills(e.scriptohubApiUrl,{limit:200});e.scriptOsList=(l.items||[]).map(a=>({slug:a.slug,displayName:a.displayName,summary:a.summary,category:a.category||null,skillType:a.skillType||null,tags:a.tags||{},stats:a.stats||{},latestVersion:a.latestVersion,createdAt:a.createdAt,updatedAt:a.updatedAt})),console.log(`[Registry] Loaded ${e.scriptOsList.length} skills from ScriptoHub`),e.isLoadingRegistry=!1,n.emit("render")}catch(l){console.error("[ScriptOs] Error loading registry:",l),e.isLoadingRegistry=!1,e.scriptOsList=[],n.emit("render"),alert(`Failed to load ScriptOs from ScriptoHub:
${l.message}

Please check your internet connection and try again.`)}}),n.on("select-scriptos",async l=>{if(r("select-scriptos:",l.displayName||l.slug),l.slug&&!l.content){const a=l.slug;console.log("[Registry] Fetching skill from ScriptoHub:",a);try{const c=await getSkill(a,e.scriptohubApiUrl);if(!c||!c.latestVersion)throw new Error(`Skill "${a}" has no published version`);const d=await getSkillVersionFiles(a,c,e.scriptohubApiUrl),u=installPlan(d.files);if(u){e.selectedScriptOs={slug:a,displayName:l.displayName||c.skill?.displayName||a,summary:l.summary||c.skill?.summary||"",version:c.latestVersion.version,install:u,tools:toolNames(a,u)},e.scriptOsInstall={busy:!1,error:null,done:!1},e.scriptOsModalView="install",n.emit("render");return}const f=d.files.find(w=>w.path.endsWith(".py"));if(!f)throw new Error(`Skill "${a}" has no .py file`);const p=await getSkillFile(a,f.path,e.scriptohubApiUrl),h=parseScriptOsConfig(p);if(!h)throw new Error("Failed to parse ScriptO configuration");console.log("[Registry] Fetched skill:",a,"py:",f.path);const m=(d.files||[]).filter(w=>w.path!=="SKILL.md"&&w.path!==f.path);l={slug:a,filename:f.path,displayName:l.displayName||c.skill?.displayName,content:p,config:h,assetFiles:m}}catch(c){console.error("[Registry] Error fetching skill:",c),alert(`Failed to load skill:
${c.message}`);return}}if(e.selectedScriptOs=l,e.scriptOsArgs={},l.config&&l.config.args)for(const a in l.config.args){const c=l.config.args[a];c.value!==void 0?e.scriptOsArgs[a]=c.value:c.type==="str"?e.scriptOsArgs[a]="":c.type==="int"||c.type==="float"?e.scriptOsArgs[a]=0:c.type==="bool"?e.scriptOsArgs[a]=!1:c.type==="list"?e.scriptOsArgs[a]=c.optional?null:0:c.type==="dict"&&c.items&&(e.scriptOsArgs[a]=Object.keys(c.items)[0])}e.scriptOsModalView="config",n.emit("render")}),n.on("scriptos-install",async()=>{const l=e.selectedScriptOs;if(!(!l?.install||e.scriptOsInstall?.busy)){e.scriptOsInstall={busy:!0,error:null,done:!1},n.emit("render");try{await installScripto(s,{id:l.slug,name:l.displayName,version:l.version,plan:l.install},a=>getSkillFile(l.slug,a,e.scriptohubApiUrl)),e.scriptOsInstall={busy:!1,error:null,done:!0},r("[ScriptOs] Installed on the board:",l.slug)}catch(a){console.error("[ScriptOs] Install failed:",a),e.scriptOsInstall={busy:!1,error:a.message,done:!1}}n.emit("render")}}),n.on("scriptos-update-arg",({argId:l,value:a})=>{e.scriptOsArgs[l]=a}),n.on("scriptos-search",l=>{e.scriptOsSearchQuery=l,n.emit("render")}),n.on("scriptos-toggle-tag",l=>{r("scriptos-toggle-tag:",l);const a=e.scriptOsFilterTags.indexOf(l);a>=0?e.scriptOsFilterTags.splice(a,1):e.scriptOsFilterTags.push(l),n.emit("render")}),n.on("scriptos-clear-tags",()=>{r("scriptos-clear-tags"),e.scriptOsFilterTags=[],n.emit("render")}),n.on("scriptos-back",()=>{r("scriptos-back"),e.scriptOsModalView="library",e.selectedScriptOs=null,n.emit("render")}),n.on("scriptos-execute",async()=>{r("scriptos-execute");const l=e.selectedScriptOs;if(l)try{try{await deployScriptoAssets(l,e)}catch(f){console.error("[Scripto assets] deploy failed:",f),alert(`Failed to deploy scripto assets:
${f.message}`);return}let a=generateScriptOsCode(l.content,l.config,e.scriptOsArgs);l.config.silent===!0&&(a=`# SCRIPTOS_SILENT: True
${a}`),e.isScriptOsModalOpen=!1;let d=((l.config.info||{}).name||l.filename.replace(".py","")).replace(/[^a-zA-Z0-9]/g,"_")+".py";const u=e.openFiles.find(f=>f.source==="disk"&&f.fileName===d);u?(u.editor.setContent(a),u.hasChanges=!0,e.editingFile=u.id,r("[ScriptOs] Updated existing tab:",d)):(await i("disk",d,null,a),r("[ScriptOs] Generated code in new tab:",d)),n.emit("render")}catch(a){console.error("[ScriptOs] Error generating code:",a)}}),n.on("close-scriptos-modal",()=>{r("close-scriptos-modal"),e.isScriptOsModalOpen=!1,e.selectedScriptOs=null,e.scriptOsModalView="library",n.emit("render")}),n.on("open-scriptos-ui-modal",l=>{r("open-scriptos-ui-modal",l),e.scriptOsUiModal&&e.scriptOsUiModal.loadTimeout&&clearTimeout(e.scriptOsUiModal.loadTimeout),e.scriptOsUiModal={isOpen:!0,url:l.url,title:l.title||"ScriptO UI",isLoading:!0,error:null,loadTimeout:null},e.scriptOsUiModal.loadTimeout=setTimeout(()=>{e.scriptOsUiModal&&e.scriptOsUiModal.isLoading&&(console.warn("[ScriptO UI] Load timeout - iframe did not load within 10 seconds"),e.scriptOsUiModal.isLoading=!1,e.scriptOsUiModal.error="Failed to load UI: timeout after 10 seconds. Check if the URL is accessible.",n.emit("render"))},1e4),n.emit("render")}),n.on("close-scriptos-ui-modal",()=>{r("close-scriptos-ui-modal"),e.scriptOsUiModal&&e.scriptOsUiModal.loadTimeout&&clearTimeout(e.scriptOsUiModal.loadTimeout),e.scriptOsUiModal={isOpen:!1,url:null,title:null,isLoading:!1,error:null,loadTimeout:null},n.emit("render")}),n.on("configure-scripto",async l=>{r("configure-scripto",l);try{let a,c,d;if(l.slug){const p=l.slug;console.log("[ScriptO] Fetching skill from ScriptoHub:",p);const h=await getSkill(p,e.scriptohubApiUrl);if(!h||!h.latestVersion)throw new Error(`Skill "${p}" has no published version`);const m=await getSkillVersionFiles(p,h,e.scriptohubApiUrl),w=m.files.find(y=>y.path.endsWith(".py"));if(!w)throw new Error(`Skill "${p}" has no .py file`);a=await getSkillFile(p,w.path,e.scriptohubApiUrl),l.assetFiles=(m.files||[]).filter(y=>y.path!=="SKILL.md"&&y.path!==w.path),d=w.path}else if(l.url){const p=await fetch(l.url);if(!p.ok)throw new Error(`Failed to fetch: ${p.status}`);a=await p.text();const h=l.url.split("/");d=decodeURIComponent(h[h.length-1])}else if(l.content)a=l.content,d=l.filename||"script.py";else throw new Error("No slug, url, or content provided");if(c=parseScriptOsConfig(a),!c)throw new Error("Failed to parse ScriptO configuration");let u=d;c.info&&c.info.name&&(u=c.info.name),console.log("[ScriptO] Opening in config modal:",u);const f={slug:l.slug||null,filename:u,content:a,config:c,assetFiles:l.assetFiles||[]};if(e.selectedScriptOs=f,e.scriptOsArgs={},c.args)for(const p in c.args){const h=c.args[p];h.value!==void 0?e.scriptOsArgs[p]=h.value:h.type==="str"?e.scriptOsArgs[p]="":h.type==="int"||h.type==="float"?e.scriptOsArgs[p]=0:h.type==="bool"?e.scriptOsArgs[p]=!1:h.type==="list"?e.scriptOsArgs[p]=h.optional?null:0:h.type==="dict"&&h.items&&(e.scriptOsArgs[p]=Object.keys(h.items)[0])}e.scriptOsModalView="config",e.isScriptOsModalOpen=!0,console.log("[ScriptO] Successfully opened ScriptO in config modal"),n.emit("render")}catch(a){console.error("[ScriptO] Error loading ScriptO:",a),alert(`Failed to load ScriptO:
${a.message}`)}})}async function getSkillVersionFiles(e,n,o){const i=n.latestVersion?.version;if(!i)throw new Error(`Skill "${e}" has no version`);const s=await fetch(`${o}/api/v1/skills/${encodeURIComponent(e)}/versions/${encodeURIComponent(i)}`);if(!s.ok)throw new Error(`Failed to fetch version files: ${s.status}`);const r=await s.json();return r.version||r}function registerPlatformUpdateHandlers(e,n,o){e.platformUpdate=blank();const i=createPlatformUpdate({pu:e.platformUpdate,device:o,render:()=>n.emit("render"),ask:async s=>await confirmDialog(t("platformUpdate.confirm",{version:s}),t("platformUpdate.cancel"),t("platformUpdate.update"))===0,appsHub:()=>e.scriptohubApiUrl,isConnected:()=>e.isConnected});o.subscribe("update",i.apply),n.on("board-connected",()=>i.connected(e.connectedPort)),n.on("board-reconnected",i.resume),n.on("disconnected",i.disconnected),n.on("platform-update-check",i.check),n.on("platform-update-start",i.start),n.on("platform-update-cancel",i.cancel),n.on("platform-update-dismiss",i.dismiss)}console.log("[Stores] ES modules loaded");let CodeMirrorEditorClass=null;async function getCodeMirrorEditor(){return CodeMirrorEditorClass||(CodeMirrorEditorClass=(await __vitePreload(()=>Promise.resolve().then(()=>editor),void 0)).CodeMirrorEditor),CodeMirrorEditorClass}const log=console.log,device=BridgeDevice,disk=BridgeDisk,registryCache=new RegistryCache;async function store(e,n){async function o(r){const{source:l,parentFolder:a,fileName:c,content:d=newFileContent,hasChanges:u=!1}=r,f=generateHash(),p=await getCodeMirrorEditor(),h=e.cache(p,`editor_${f}`);return h.content=d,h.fileName=c,{id:f,source:l,parentFolder:a,fileName:c,editor:h,hasChanges:u}}async function i(r,l=null,a=null,c=null){r=="board"?e.boardNavigationPath:e.diskNavigationPath;const d=await o({fileName:l===null?generateFileName():l,parentFolder:a,source:r,hasChanges:!0,content:c||newFileContent});let u=!1;return a!=null&&(r=="board"?u=await fileExists(BridgeDevice,getFullPath$1(e.boardNavigationRoot,d.parentFolder,d.fileName)):r=="disk"&&(u=await disk.fileExists(disk.getFullPath(e.diskNavigationRoot,d.parentFolder,d.fileName)))),e.openFiles.find(p=>p.parentFolder===d.parentFolder&&p.fileName===d.fileName&&p.source===d.source)||u?(await confirmDialog(`File ${d.fileName} already exists on ${r}. Please choose another name.`),!1):(d.editor.onChange=function(){d.hasChanges=!0,n.emit("render")},e.openFiles.push(d),e.editingFile=d.id,!0)}await initializeState(e,n,i),initializeTheme(e,n),registerThemeHandlers(e,n);const s=()=>{};registerDialogHandlers(e,n,device),registerConnectionHandlers(e,n,device,s,bindTerminalOutput),registerFileOperationHandlers(e,n,device,disk,o,i),registerTerminalHandlers(e,n,device,XTerm),registerLogHandlers(e,n),registerTxLatchHandlers(e,n,device),registerAgentActivityHandlers(e,n,device),registerAgentChatHandlers(e,n,device),registerShortcutHandlers(e,n),registerPlatformUpdateHandlers(e,n,device),document.addEventListener("connection-mode-change",r=>{const l=r.detail?.mode||"none";e.connectionMode=l,n.emit("render")}),document.addEventListener("firmware-panel-update",()=>{n.emit("render")}),n.on("navigate",r=>{n.emit("change-system-section",r)}),n.on("change-view",async r=>{r==="file-manager"&&(e.filesLoadedOnce||(log("[File Manager] Loading files for first time..."),e.filesLoadedOnce=!0),e.isConnected?n.emit("refresh-files"):n.emit("refresh-disk-files")),e.systemSection!==r&&(e.selectedFiles=[],e.systemSection=r,e.activeNetworkPanel=null,e.activePeripheralsPanel=null,e.activeSystemPanel=null,e.activeExtension=null,e.activeExtensionPanel=null,r==="editor"&&e.isConnected&&setTimeout(()=>{bindTerminalOutput(e);const l=e.cache(XTerm,"terminal");l&&l.term&&(n.emit("bind-terminal-input"),n.emit("terminal-focus"))},100),n.emit("render"))}),n.on("launch-app",async(r,l)=>{window.launchApp(r,l)}),n.on("change-system-section",r=>{if(log("change-system-section",r),e.systemSection=r,r.startsWith("network:")){const l=r.split(":")[1];e.activeNetworkPanel=l,e.activeSystemPanel=null,e.activePeripheralsPanel=null,e.activeExtension=null,e.activeExtensionPanel=null}else if(r.startsWith("peripherals:")){const l=r.split(":")[1];e.activePeripheralsPanel=l,e.activeNetworkPanel=null,e.activeSystemPanel=null,e.activeExtension=null,e.activeExtensionPanel=null}else if(r.startsWith("system:")){const l=r.split(":")[1];e.activeSystemPanel=l,e.activeNetworkPanel=null,e.activePeripheralsPanel=null,e.activeExtension=null,e.activeExtensionPanel=null}else e.activeNetworkPanel=null,e.activePeripheralsPanel=null,e.activeSystemPanel=null,e.activeExtension=null,e.activeExtensionPanel=null;n.emit("render")}),registerNetworkConfigHandlers(e,n,device),registerHardwareConfigHandlers(e,n,device),registerSystemConfigHandlers(e,n,device),registerExtensionHandlers(e,n,device),registerScriptOsHandlers(e,n,registryCache,i,device),typeof debuggerStore=="function"?debuggerStore(e,n):console.warn("[Store] Debugger store not loaded"),n.on("change-locale",r=>{e.locale=r,localStorage.setItem("locale",r),window.i18n&&window.i18n.setLocale(r),n.emit("render")}),window.i18n?(window.i18n.setLocale(e.locale),console.log("[i18n] Locale initialized to:",e.locale)):console.warn("[i18n] i18n module not available")}const PANEL_CLOSED=45,PANEL_TOO_SMALL=65,PANEL_DEFAULT=320;typeof window<"u"&&(window.PANEL_CLOSED=PANEL_CLOSED,window.PANEL_TOO_SMALL=PANEL_TOO_SMALL,window.PANEL_DEFAULT=PANEL_DEFAULT);function App(e,n){return e.isInitializing?html$1`
      <div id="app" style="display: flex; justify-content: center; align-items: center; height: 100vh;">
        <p>Loading...</p>
      </div>
    `:html$1`
    <div id="app">
      ${SystemView(e,n)}
      ${Overlay(e,n)}
    </div>
  `}async function initApp(){window.i18nReady&&(await window.i18nReady,console.log("[App] Translations loaded, starting app...")),console.log("%c ScriptO Studio v1.2.1 ","background: #9b59b6; color: #fff; font-size: 11px; padding: 2px 6px; border-radius: 3px;","build 460eeda (2026-11-14)");let e=Choo();e.use(store),e.route("*",App),e.mount("#app"),window.appState=e.state,window.appInstance=e,e.emitter.on("DOMContentLoaded",()=>{e.state.diskNavigationRoot&&e.emitter.emit("refresh-files");const n=new URLSearchParams(window.location.search),o=n.get("device");if(o){const a=`wss://${o}/mcp`;localStorage.setItem("webrepl-url",a),console.log(`[App] Device URL from query param: ${a}`),setTimeout(()=>{e.emitter.emit("open-connection-dialog");const c=window.location.pathname;window.history.replaceState({},"",c)},500)}const i=n.get("configure");i&&setTimeout(()=>{e.emitter.emit("configure-scripto",i);const a=window.location.pathname;window.history.replaceState({},"",a)},500);const s=n.get("scripto");s&&setTimeout(()=>{e.emitter.emit("change-view","editor"),e.emitter.emit("configure-scripto",{slug:s});const a=window.location.pathname;window.history.replaceState({},"",a)},500),window.addEventListener("message",a=>{a.data&&a.data.type==="scripto-use"&&a.data.slug&&(console.log("[App] Received scripto-use message:",a.data.slug),closeIframeModal(),e.emitter.emit("configure-scripto",{slug:a.data.slug}))});const r=n.get("extension");if(r){localStorage.setItem("pending-extension-id",r),sessionStorage.setItem("extension-install-active",r),console.log(`[App] Extension from query param: ${r}`),n.delete("extension");const a=n.toString(),c=window.location.pathname+(a?"?"+a:"");window.history.replaceState({},"",c),o||setTimeout(()=>{console.log("[App] Fresh extension install — navigating to Device Setup"),e.emitter.emit("change-system-panel","firmware")},500)}const l=localStorage.getItem("pending-extension-id");if(l&&o&&setTimeout(async()=>{try{const d=(await new ExtensionRegistry().getInstalledExtensions()).find(u=>u.id===l);d&&d.menu&&d.menu.length>0&&(console.log(`[App] Auto-navigating to extension: ${l}`),e.emitter.emit("change-extension-panel",{extensionId:l,panelId:d.menu[0].id}))}catch(a){console.warn("[App] Could not auto-navigate to extension:",a)}},1e3),!e.state.isConnected){let a=document.getElementById("hand-click-hint");if(!a){a=document.createElement("div"),a.id="hand-click-hint";const u=document.createElementNS("http://www.w3.org/2000/svg","svg");u.setAttribute("width","36"),u.setAttribute("height","36"),u.setAttribute("viewBox","0 0 24 24"),u.setAttribute("fill","none"),u.setAttribute("stroke","currentColor"),u.setAttribute("stroke-width","2"),u.setAttribute("stroke-linecap","round"),u.setAttribute("stroke-linejoin","round"),u.innerHTML=`
          <path d="M8 13v-8.5a1.5 1.5 0 0 1 3 0v7.5" />
          <path d="M11 11.5v-2a1.5 1.5 0 0 1 3 0v2.5" />
          <path d="M14 10.5a1.5 1.5 0 0 1 3 0v1.5" />
          <path d="M17 11.5a1.5 1.5 0 0 1 3 0v4.5a6 6 0 0 1 -6 6h-2h.208a6 6 0 0 1 -5.012 -2.7l-.196 -.3c-.312 -.479 -1.407 -2.388 -3.286 -5.728a1.5 1.5 0 0 1 .536 -2.022a1.867 1.867 0 0 1 2.28 .28l1.47 1.47" />
          <path d="M5 3l-1 -1" />
          <path d="M4 7h-1" />
          <path d="M14 3l1 -1" />
          <path d="M15 6h1" />
        `,a.appendChild(u),document.body.appendChild(a)}const c=()=>{a.classList.add("animate"),setTimeout(()=>{a.classList.remove("animate")},7500)};setTimeout(c,1e3);const d=setInterval(c,1e4);e.emitter.on("connect",()=>{clearInterval(d);const u=document.getElementById("hand-click-hint");u&&u.remove()})}})}document.readyState==="complete"?initApp():window.addEventListener("load",initApp);export{__vitePreload as _};
