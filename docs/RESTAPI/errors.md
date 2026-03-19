---
title: Errors
nav_order: 4
---

# Errors

Common Error Format (NestJS default)

```json
{
    "statusCode": 400,
    "message": "Bad Request",
    "error": "Bad Request"
}
```

Validation errors may return `message` as an array of strings.

Global Error Mapping (TypeOrmExceptionFilter)

- 409 `Conflict` when Postgres error code `23505` (unique violation)
- 404 `NotFound` when Postgres error code `23503` (foreign key violation)
- 400 `BadRequest` when Postgres error code `23502` (not-null violation)
- 400 `BadRequest` when Postgres error code `22001` (value too long)
- 500 `InternalServerError` for other database errors

Auth Errors

- 401 `Unauthorized` when JWT is missing or invalid
- 403 `Forbidden` when the authenticated user is not allowed to access the resource
