/**
 * Studio's service worker: the installed app opens with no network.
 *
 * The build fills in FILES (everything it wrote) and VERSION (a hash of them), so each
 * deploy is a new worker with its own cache. A new worker waits until the page tells it to
 * take over, which the page does when the person presses Reload.
 */
const VERSION = '96e10e31f6f4'
const FILES = ["./assets/__vite-browser-external-BIHI7g3E.js","./assets/agentFrame-CQe3wCnv.js","./assets/editor--OQSkCrM.js","./assets/favicon-CmaffBQr.svg","./assets/gallery-DJenDvjh.css","./assets/gallery-pJRszxn2.js","./assets/main-Dh7VyQs9.css","./assets/main-DlcaXTKR.js","./assets/menu-BIwDklZK.js","./assets/menu-C8of6Vrf.css","./assets/modulepreload-polyfill-B5Qt9EMX.js","./assets/tasmota-esptool.bundle-CejzY9o0.js","./assets/terminal-BGGhj1af.js","./assets/terminal-DOrYoP_4.css","./assets/tree-sitter-python-BlcJAWGl.wasm","./assets/tree-sitter-python-DxlSE_Ss.js","./assets/tree-sitter-qKYAACSa.wasm","./assets/vendor-D_y76g1R.js","./favicon.svg","./index.html","./locales/de.json","./locales/en.json","./locales/es.json","./locales/fr.json","./locales/zh.json","./manifest.json","./media/SS.svg","./media/icon-192.png","./media/icon-512.png","./media/tabler-sprite.svg","./science.png"]
const CACHE = `studio-${VERSION}`

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES.map(file => new Request(file, { cache: 'reload' })))))
})

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    for (const name of await caches.keys()) if (name !== CACHE) await caches.delete(name)
    await self.clients.claim()
  })())
})

self.addEventListener('message', (event) => {
  if (event.data === 'take-over') self.skipWaiting()
})

/** The network's answer, kept for next time; the kept one if there is no network. */
async function freshFirst(request, instead) {
  const cache = await caches.open(CACHE)
  try {
    const answer = await fetch(request)
    if (answer.ok) cache.put(request, answer.clone())
    return answer
  } catch (e) {
    const kept = await cache.match(instead || request, { ignoreSearch: true })
    if (kept) return kept
    throw e
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  // Boards, ScriptoHub and the key frame are other origins, and are never answered from here
  if (request.method !== 'GET' || url.origin !== location.origin) return
  if (request.mode === 'navigate') {
    event.respondWith(freshFirst(request, new URL('index.html', self.registration.scope).href))
    return
  }
  // A built file's name carries its hash, so the kept copy is the file
  if (url.pathname.includes('/assets/')) {
    event.respondWith(caches.open(CACHE).then(async cache => (await cache.match(request)) || freshFirst(request)))
    return
  }
  event.respondWith(freshFirst(request))
})
