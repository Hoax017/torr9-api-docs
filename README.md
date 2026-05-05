# torr9 API docs

Spec OpenAPI 3.0.3 reverse-engineered de [api.torr9.net](https://api.torr9.net), reconstruite depuis les chunks JS du frontend Next.js et captures réseau.

📖 **Docs en ligne**: https://hoax017.github.io/torr9-api-docs/

## Fichiers

- [openapi.yaml](openapi.yaml) — spec OpenAPI 3.0.3
- [index.html](index.html) — Redoc bundlé (servi par Pages)

## Build docs

```bash
npx @redocly/cli build-docs openapi.yaml -o index.html
```

## Auth

`POST /api/v1/auth/login` retourne `{ token, user }`. Le token est un JWT HS256 valide ~30j. À mettre dans le header `Authorization: Bearer <token>` sur tous les autres appels.
