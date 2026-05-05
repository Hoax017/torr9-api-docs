// Inject le patch dans le main world via <script> (les content scripts Firefox sont isolés
// de la window de la page, donc patcher window.fetch ici n'affecte pas la page).
// Bridge content↔page via window.postMessage.

(function () {
  // 1) Injecte le script de patch dans la page
  const s = document.createElement('script');
  s.src = browser.runtime.getURL('inject.js');
  s.onload = () => s.remove();
  (document.head || document.documentElement).appendChild(s);

  // 2) Relais des requêtes page → background → page
  window.addEventListener('message', async (ev) => {
    if (ev.source !== window) return;
    const d = ev.data;
    if (!d || d.type !== 'TORR9_PROXY_REQ') return;
    try {
      const res = await browser.runtime.sendMessage({
        type: 'TORR9_FETCH',
        url: d.url,
        init: d.init,
      });
      window.postMessage({ type: 'TORR9_PROXY_RES', id: d.id, res }, '*');
    } catch (e) {
      window.postMessage({ type: 'TORR9_PROXY_RES', id: d.id, res: { error: String(e) } }, '*');
    }
  });

  console.log('[Torr9 CORS Unlock] content bridge actif');
})();
