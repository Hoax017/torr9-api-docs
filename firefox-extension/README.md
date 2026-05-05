# Torr9 CORS Unlock — Firefox extension

Bypass CORS sur `api.torr9.net` pour pouvoir tester la doc OpenAPI Try-it depuis github.io ou localhost.

## Comment ça marche

L'API torr9 ne whiteliste que `Origin: https://torr9.net` dans CORS, et Cloudflare répond 403 sur les preflights venant d'ailleurs. Modifier les headers de réponse côté navigateur ne suffit pas (le statut 403 fait échouer la preflight).

L'extension contourne en:
1. Injectant un content script qui override `window.fetch` + `XMLHttpRequest` sur les pages de doc
2. Quand l'URL pointe `api.torr9.net`, la requête est envoyée au background script
3. Le background utilise `fetch` privilégié de l'extension (pas de CORS browser) avec `Origin: https://torr9.net` spoofé
4. La réponse est renvoyée à la page comme si le fetch direct avait réussi

## Install (signée AMO — recommandé)

1. Télécharge `torr9-cors-unlock.xpi` depuis la [release](https://github.com/Hoax017/torr9-api-docs/releases/latest)
2. Glisse-dépose le `.xpi` sur l'onglet `about:addons` de Firefox (ou clique le `.xpi` dans Firefox direct)
3. Confirme l'install
4. Reste active jusqu'à suppression manuelle

## Install (dev / non signée, depuis ce dossier)

1. Firefox → `about:debugging#/runtime/this-firefox`
2. **"Charger un module complémentaire temporaire…"** → sélectionne `manifest.json`
3. ⚠️ Perdue à la fermeture de Firefox

## Vérifier

DevTools console (F12) → tu dois voir:
```
[Torr9 CORS Unlock] content bridge actif
[Torr9 CORS Unlock] fetch + XHR patched dans la page
```

Si oui, Try-it marche.

## Sécurité

⚠️ L'extension intercepte tout fetch vers `api.torr9.net` depuis les pages où le content script tourne. Scope limité aux 3 origines listées dans `manifest.json` (`hoax017.github.io`, `localhost`, `127.0.0.1`) — pas d'effet ailleurs. Désactive après usage si paranoïaque.
