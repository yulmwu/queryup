---
title: REST API
nav_order: 1
---

# REST API

Base URL

- If `USE_GLOBAL_PREFIX=true`, all endpoints are prefixed with `/api`.
- Otherwise, use the paths as written below.

Modules

- `auth` -> `docs/RESTAPI/auth.md`
- `users` -> `docs/RESTAPI/users.md`
- `errors` -> `docs/RESTAPI/errors.md`

Common Response Shape

- All JSON responses are serialized by `class-transformer` (`TransformInterceptor`).
