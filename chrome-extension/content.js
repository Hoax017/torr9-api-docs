// Content script (Chrome MV3). Injecte inject.js dans le main world et relaie postMessage
// vers le service worker.

(function () {
  const s = document.createElement('script');
  s.src = chrome.runtime.getURL('inject.js');
  s.onload = () => s.remove();
  (document.head || document.documentElement).appendChild(s);

  window.addEventListener('message', (ev) => {
    if (ev.source !== window) return;
    const d = ev.data;
    if (!d || d.type !== 'TORR9_PROXY_REQ') return;
    chrome.runtime.sendMessage(
      { type: 'TORR9_FETCH', url: d.url, init: d.init },
      (res) => {
        const out = res || { error: chrome.runtime.lastError?.message || 'no response' };
        window.postMessage({ type: 'TORR9_PROXY_RES', id: d.id, res: out }, '*');
      },
    );
  });

  console.log('[Torr9 CORS Unlock] content bridge actif');
})();
