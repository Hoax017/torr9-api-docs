// Reçoit les requêtes proxy depuis le content script et les exécute avec les privilèges de l'extension (no CORS).

browser.runtime.onMessage.addListener(async (msg, sender) => {
  if (msg && msg.type === 'TORR9_FETCH') {
    try {
      const init = msg.init || {};
      // Force Origin/Referer torr9.net pour matcher la whitelist API
      const headers = new Headers(init.headers || {});
      headers.set('Origin', 'https://torr9.net');
      headers.set('Referer', 'https://torr9.net/');
      const res = await fetch(msg.url, { ...init, headers });
      const body = await res.text();
      const respHeaders = {};
      res.headers.forEach((v, k) => (respHeaders[k] = v));
      return {
        ok: res.ok,
        status: res.status,
        statusText: res.statusText,
        headers: respHeaders,
        body,
      };
    } catch (e) {
      return { error: String(e) };
    }
  }
});

console.log('[Torr9 CORS Unlock] background actif');
