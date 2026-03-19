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
