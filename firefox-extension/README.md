# Torr9 CORS Unlock — Firefox extension

Bypass CORS sur `api.torr9.net` pour pouvoir tester la doc OpenAPI Try-it depuis github.io ou localhost.

## Comment ça marche

L'API torr9 ne whiteliste que `Origin: https://torr9.net` dans CORS, et Cloudflare répond 403 sur les preflights venant d'ailleurs. Modifier les headers de réponse côté navigateur ne suffit pas (le statut 403 fait échouer la preflight).

L'extension contourne en:
1. Injectant un content script qui override `window.fetch` + `XMLHttpRequest` sur les pages de doc
2. Quand l'URL pointe `api.torr9.net`, la requête est envoyée au background script
3. Le background utilise `fetch` privilégié de l'extension (pas de CORS browser) avec `Origin: https://torr9.net` spoofé
4. La réponse est renvoyée à la page comme si le fetch direct avait réussi

## Install (mode dev / temporaire)

1. Firefox → `about:debugging#/runtime/this-firefox`
2. **"Charger un module complémentaire temporaire…"**
3. Sélectionne `manifest.json` dans ce dossier
4. Active sur https://hoax017.github.io/torr9-api-docs/, http://localhost:*, http://127.0.0.1:*

L'extension reste active jusqu'à la fermeture de Firefox.

## Vérifier

DevTools console (F12) → tu dois voir:
```
[Torr9 CORS Unlock] fetch + XHR patched pour api.torr9.net
```

Si oui, Try-it marche.

## Sécurité

⚠️ L'extension intercepte tout fetch vers `api.torr9.net` depuis les pages où le content script tourne. Le scope est limité aux 3 origines listées dans `manifest.json` — pas d'effet ailleurs. Désactive après usage si paranoïaque.

## Permanent

Firefox stable refuse les extensions non signées en mode permanent. Pour permanent:
- Soumets sur https://addons.mozilla.org/ (validation review)
- Ou utilise Firefox Developer Edition / Nightly + `xpinstall.signatures.required = false` dans `about:config`
