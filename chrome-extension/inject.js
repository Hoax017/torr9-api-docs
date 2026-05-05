// Tourne dans le main world de la page. Override window.fetch + XMLHttpRequest pour api.torr9.net.
// Les requêtes sont envoyées au content script via postMessage, qui les relaie au background.

(function () {
  const TARGET = 'api.torr9.net';
  const pending = new Map();
  let nextId = 1;

  window.addEventListener('message', (ev) => {
    if (ev.source !== window) return;
    const d = ev.data;
    if (!d || d.type !== 'TORR9_PROXY_RES') return;
    const cb = pending.get(d.id);
    if (cb) {
      pending.delete(d.id);
      cb(d.res);
    }
  });

  function proxy(url, init) {
    return new Promise((resolve) => {
      const id = nextId++;
      pending.set(id, resolve);
      window.postMessage({ type: 'TORR9_PROXY_REQ', id, url, init }, '*');
    });
  }

  // ===== fetch =====
  const origFetch = window.fetch.bind(window);
  window.fetch = async function (input, init = {}) {
    const url = typeof input === 'string' ? input : input.url;
    if (!url || !url.includes(TARGET)) return origFetch(input, init);

    let body = init.body;
    if (body && typeof body !== 'string' && !(body instanceof ArrayBuffer)) {
      try { body = await new Response(body).text(); } catch {}
    }
    const cleanInit = {
      method: init.method || (typeof input !== 'string' && input.method) || 'GET',
      headers: serializeHeaders(init.headers || (typeof input !== 'string' && input.headers)),
      body,
    };
    const r = await proxy(url, cleanInit);
    if (r.error) throw new TypeError(r.error);
    return new Response(r.body, {
      status: r.status,
      statusText: r.statusText,
      headers: r.headers,
    });
  };

  function serializeHeaders(h) {
    if (!h) return {};
    if (h instanceof Headers) {
      const o = {};
      h.forEach((v, k) => (o[k] = v));
      return o;
    }
    if (Array.isArray(h)) return Object.fromEntries(h);
    return { ...h };
  }

  // ===== XMLHttpRequest =====
  const OrigXHR = window.XMLHttpRequest;
  function PatchedXHR() {
    const xhr = new OrigXHR();
    let _url = '', _method = 'GET', _headers = {}, _intercept = false;

    const origOpen = xhr.open;
    xhr.open = function (method, url) {
      _method = method;
      _url = url;
      _intercept = String(url).includes(TARGET);
      if (!_intercept) return origOpen.apply(xhr, arguments);
    };
    const origSetHeader = xhr.setRequestHeader;
    xhr.setRequestHeader = function (k, v) {
      if (_intercept) _headers[k] = v;
      else origSetHeader.apply(xhr, arguments);
    };
    const origSend = xhr.send;
    xhr.send = async function (body) {
      if (!_intercept) return origSend.apply(xhr, arguments);
      try {
        const r = await proxy(_url, { method: _method, headers: _headers, body });
        if (r.error) throw new Error(r.error);
        Object.defineProperty(xhr, 'readyState', { value: 4, configurable: true });
        Object.defineProperty(xhr, 'status', { value: r.status, configurable: true });
        Object.defineProperty(xhr, 'statusText', { value: r.statusText, configurable: true });
        Object.defineProperty(xhr, 'response', { value: r.body, configurable: true });
        Object.defineProperty(xhr, 'responseText', { value: r.body, configurable: true });
        const headerStr = Object.entries(r.headers || {})
          .map(([k, v]) => `${k}: ${v}`)
          .join('\r\n');
        xhr.getAllResponseHeaders = () => headerStr;
        xhr.getResponseHeader = (n) => (r.headers || {})[n.toLowerCase()] || null;
        if (xhr.onreadystatechange) xhr.onreadystatechange();
        if (xhr.onload) xhr.onload();
        xhr.dispatchEvent(new Event('load'));
        xhr.dispatchEvent(new Event('loadend'));
      } catch (e) {
        if (xhr.onerror) xhr.onerror(e);
        xhr.dispatchEvent(new Event('error'));
      }
    };
    return xhr;
  }
  PatchedXHR.prototype = OrigXHR.prototype;
  window.XMLHttpRequest = PatchedXHR;

  console.log('[Torr9 CORS Unlock] fetch + XHR patched dans la page');
})();
