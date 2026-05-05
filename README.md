# torr9 API docs

Spec OpenAPI 3.0.3 reverse-engineered de [api.torr9.net](https://api.torr9.net), reconstruite depuis les chunks JS du frontend Next.js et captures réseau.

📖 **Docs en ligne (Stoplight Elements + Try-it)**: https://hoax017.github.io/torr9-api-docs/

## Fichiers

- [openapi.yaml](openapi.yaml) — source unique
- [index.html](index.html) — viewer Stoplight Elements (charge `openapi.yaml` au runtime, pas de build step)
- [categories.json](categories.json) — taxonomie des catégories/sous-catégories

## Auth

`POST /api/v1/auth/login` retourne `{ token, user }`. Le token est un JWT HS256 valide ~30j. À mettre dans header `Authorization: Bearer <token>` sur tous les autres appels.

## Try it out

L'API torr9 n'autorise que `Origin: https://torr9.net` en CORS → tester depuis github.io requiert une extension CORS-disable temporaire (cf. note dans la doc).
