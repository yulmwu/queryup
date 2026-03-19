---
title: Users
nav_order: 3
---

## Get User By Username

`GET /users/:username`

Request

- Optional `Authorization: Bearer <accessToken>` (currently not used to alter response)

Authorization

- None (JWT is optional)

Path Params

- `username` lowercase letters, numbers, or underscores only, max 32

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

- 400 `Bad Request` for validation failures or extra fields (global validation pipe)
- 404 `Not Found` when user does not exist
- 500 `Internal Server Error` for other server errors

---

## Update User By Username

`PUT /users/:username`

Request

- Requires `Authorization: Bearer <accessToken>`

Authorization

- JWT required
- Must be the same user as `:username` (self-only)

Body

```json
{
    "nickname": "홍길동",
    "description": "Hello",
    "profileImage": "uploads/profile/1/profile.png",
    "studentNumber": "30201",
    "department": 1,
    "club": "Robot Club"
}
```

Field Constraints

- `nickname` optional, max 32
- `description` optional, max 255
- `profileImage` optional, must match `uploads/profile/<id>/profile.(jpg|jpeg|png|gif)`
- `studentNumber` optional, 5 digits `GCCNN` (example `30201` => grade 3, class 02, number 01)
- `department` optional, enum: 1 스마트보안솔루션과, 2 모빌리티메이커과, 3 인공지능소프트웨어과, 4 게임소프트웨어과
- `club` optional, max 255

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

- 400 `Bad Request` for validation failures or extra fields (global validation pipe)
- 401 `Unauthorized` when access token is missing or invalid
- 403 `Forbidden` when trying to update another user
- 404 `Not Found` when user does not exist
- 500 `Internal Server Error` for other server errors

Notes:

- `status` and `isVerified` cannot be changed via this endpoint.
- `studentNumber` format: 5 digits `GCCNN` (example `30201` => grade 3, class 02, number 01)
- `department` enum: 1 스마트보안솔루션과, 2 모빌리티메이커과, 3 인공지능소프트웨어과, 4 게임소프트웨어과
- `status` enum: 1 재학생, 2 선생님, 3 졸업생, 4 기타
