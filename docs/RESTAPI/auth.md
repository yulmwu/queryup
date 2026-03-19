---
title: Auth
nav_order: 2
---

## Register

`POST /auth/register`

Request

```json
{
    "username": "user1",
    "password": "strong-password",
    "email": "user1@example.com",
    "studentNumber": "30201",
    "department": 1,
    "nickname": "홍길동",
    "description": "Hello",
    "club": "Robot Club"
}
```

Authorization

- None

Field Constraints

- `username` lowercase letters, numbers, or underscores only, max 32
- `password` max 255
- `email` valid email format, max 320
- `studentNumber` 5 digits `GCCNN` (example `30201` => grade 3, class 02, number 01)
- `department` enum: 1 스마트보안솔루션과, 2 모빌리티메이커과, 3 인공지능소프트웨어과, 4 게임소프트웨어과
- `nickname` optional, max 32
- `description` optional, max 255
- `club` optional, max 255

Response 201

```json
{
    "id": 1,
    "username": "user1",
    "nickname": "홍길동",
    "email": "user1@example.com",
    "description": "Hello",
    "profileImage": "uploads/profile/1/profile.png",
    "studentNumber": "30201",
    "department": 1,
    "status": 1,
    "club": "Robot Club",
    "isVerified": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "role": 1
}
```

Errors:

- 400 `Bad Request` for validation failures or extra fields (global validation pipe)
- 409 `Conflict` for duplicate username or email (unique constraint)
- 500 `Internal Server Error` for other server errors

Notes:

- `status` is always stored as `1` by the server and is not accepted in the request.
- `isVerified` defaults to `false` and is not accepted in the request.

---

## Login

`POST /auth/login`

Request

```json
{
    "username": "user1",
    "password": "strong-password"
}
```

Authorization

- None

Response 201

```json
{
    "id": 1,
    "accessToken": "<jwt>",
    "maxAgeSeconds": 3600
}
```

Side Effects:

- `refresh_token` is set as an HttpOnly cookie.

Errors:

- 400 `Bad Request` for validation failures or extra fields (global validation pipe)
- 401 `Unauthorized` for invalid credentials
- 500 `Internal Server Error` for other server errors

---

## Refresh Token

`POST /auth/refresh`

Request

- Requires `refresh_token` cookie
- Requires valid refresh token bound to the user in Redis

Authorization

- None (cookie-based)

Response 200

```json
{
    "accessToken": "<jwt>"
}
```

Errors:

- 400 `Bad Request` when refresh token cookie is missing
- 401 `Unauthorized` when refresh token is invalid or expired
- 500 `Internal Server Error` for other server errors

---

## Logout

`POST /auth/logout`

Request

- Requires `refresh_token` cookie
- Requires valid refresh token bound to the user in Redis

Authorization

- None (cookie-based)

Response 200

(empty body)

Errors:

- 400 `Bad Request` when refresh token cookie is missing
- 401 `Unauthorized` when refresh token is invalid
- 500 `Internal Server Error` for other server errors

---

## Get Me

`GET /auth/me`

Request

- Requires `Authorization: Bearer <accessToken>`
- Requires `refresh_token` cookie
- JWT subject must match the user being fetched (self)

Authorization

- JWT required
- Self-only

Response 200

```json
{
    "id": 1,
    "username": "user1",
    "nickname": "홍길동",
    "email": "user1@example.com",
    "description": "Hello",
    "profileImage": "uploads/profile/1/profile.png",
    "studentNumber": "30201",
    "department": 1,
    "status": 1,
    "club": "Robot Club",
    "isVerified": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "role": 1
}
```

Errors:

- 400 `Bad Request` when refresh token cookie is missing
- 401 `Unauthorized` when access token is missing or invalid
- 404 `Not Found` when user does not exist
- 500 `Internal Server Error` for other server errors
