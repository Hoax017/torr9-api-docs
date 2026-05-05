// Service worker (Chrome MV3). Reçoit les fetch proxy depuis le content script et les exécute
// avec les privilèges de l'extension. Les rules.json fixent Origin/Referer côté request.

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.type === 'TORR9_FETCH') {
    (async () => {
      try {
        const init = msg.init || {};
        const res = await fetch(msg.url, init);
        const body = await res.text();
        const headers = {};
        res.headers.forEach((v, k) => (headers[k] = v));
        sendResponse({
          ok: res.ok,
          status: res.status,
          statusText: res.statusText,
          headers,
          body,
        });
      } catch (e) {
        sendResponse({ error: String(e) });
      }
    })();
    return true; // keep sendResponse async
  }
});

console.log('[Torr9 CORS Unlock] background actif (Chrome MV3)');
