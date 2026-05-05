# Torr9 CORS Unlock — Chrome extension

Bypass CORS sur `api.torr9.net` (Manifest v3, Chrome ≥ 88 ou Edge / Brave).

## Install (mode dev / non packagée)

1. `chrome://extensions/`
2. Active **"Mode développeur"** (toggle en haut à droite)
3. Bouton **"Charger l'extension non empaquetée"** → sélectionne ce dossier
4. Va sur https://hoax017.github.io/torr9-api-docs/ — Try-it marche

L'extension reste active tant que tu ne la supprimes pas.

## Différences vs Firefox

- Manifest v3 (service worker au lieu de background page)
- `declarativeNetRequest` rules dans `rules.json` pour spoofer `Origin/Referer` (Chrome MV3 interdit `webRequest blocking`)
- Reste identique: content script injecte `inject.js` qui patch fetch/XHR, requêtes routées via service worker

## Permanent / Web Store

Pour distribution publique → soumettre sur [Chrome Web Store](https://chrome.google.com/webstore/devconsole/) (frais $5 one-time).
