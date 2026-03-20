---
title: Community
nav_order: 4
---

# Community

## General Board

### List Posts

`GET /community/general/posts`

Query

- `page` (optional, default 1)
- `size` (optional, default 20, max 50)

Authorization

- None

Response 200

```json
{
    "items": [
        {
            "id": 1,
            "title": "Hello world",
            "author": {
                "id": 1,
                "username": "user1",
                "nickname": "홍길동",
                "description": "Hello",
                "profileImage": "uploads/profile/1/profile.png",
                "role": 1
            },
            "createdAt": "2024-01-01T00:00:00.000Z",
            "updatedAt": "2024-01-01T00:00:00.000Z"
        }
    ],
    "meta": { "page": 1, "size": 20, "total": 1 }
}
```

Errors:

- 400 `Bad Request` for invalid query or extra fields
- 500 `Internal Server Error`

### Get Post Detail

`GET /community/general/posts/:id`

Authorization

- None

Response 200

```json
{
    "id": 1,
    "title": "Hello world",
    "content": "This is the content.",
    "author": {
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
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

Errors:

- 404 `Not Found` when post does not exist
- 500 `Internal Server Error`

### Create Post

`POST /community/general/posts`

Authorization

- JWT required

Request

```json
{
    "title": "Hello world",
    "content": "This is the content."
}
```

Response 201

```json
{
    "id": 1,
    "title": "Hello world",
    "content": "This is the content.",
    "author": {
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
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

Errors:

- 400 `Bad Request` for validation failures or extra fields
- 401 `Unauthorized` when access token is missing or invalid
- 500 `Internal Server Error`

### Update Post

`PUT /community/general/posts/:id`

Authorization

- JWT required
- Self-only

Request

```json
{
    "title": "Updated title",
    "content": "Updated content."
}
```

Response 200

```json
{
    "id": 1,
    "title": "Updated title",
    "content": "Updated content.",
    "author": {
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
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
}
```

Errors:

- 400 `Bad Request` for validation failures or extra fields
- 401 `Unauthorized` when access token is missing or invalid
- 403 `Forbidden` when trying to update another user's post
- 404 `Not Found` when post does not exist
- 500 `Internal Server Error`

### Delete Post

`DELETE /community/general/posts/:id`

Authorization

- JWT required
- Self-only

Response 204

(empty body)

Errors:

- 401 `Unauthorized` when access token is missing or invalid
- 403 `Forbidden` when trying to delete another user's post
- 404 `Not Found` when post does not exist
- 500 `Internal Server Error`

---

## Anonymous Board

### List Posts

`GET /community/anonymous/posts`

Query

- `page` (optional, default 1)
- `size` (optional, default 20, max 50)

Authorization

- None

Response 200

```json
{
    "items": [
        {
            "id": 1,
            "title": "Hello world",
            "authorName": "익명123",
            "ipMasked": "123.456.*.*",
            "createdAt": "2024-01-01T00:00:00.000Z",
            "updatedAt": "2024-01-01T00:00:00.000Z"
        }
    ],
    "meta": { "page": 1, "size": 20, "total": 1 }
}
```

Errors:

- 400 `Bad Request` for invalid query or extra fields
- 500 `Internal Server Error`

### Get Post Detail

`GET /community/anonymous/posts/:id`

Authorization

- None

Response 200

```json
{
    "id": 1,
    "title": "Hello world",
    "content": "This is the content.",
    "authorName": "익명123",
    "ipMasked": "123.456.*.*",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

Errors:

- 404 `Not Found` when post does not exist
- 500 `Internal Server Error`

### Create Post

`POST /community/anonymous/posts`

Authorization

- None

Request

```json
{
    "title": "Hello world",
    "content": "This is the content.",
    "authorName": "익명123",
    "password": "secret1234"
}
```

Response 201

```json
{
    "id": 1,
    "title": "Hello world",
    "content": "This is the content.",
    "authorName": "익명123",
    "ipMasked": "123.456.*.*",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

Errors:

- 400 `Bad Request` for validation failures or extra fields
- 500 `Internal Server Error`

### Update Post

`PUT /community/anonymous/posts/:id`

Authorization

- None

Request

```json
{
    "title": "Updated title",
    "content": "Updated content.",
    "password": "secret1234"
}
```

Response 200

```json
{
    "id": 1,
    "title": "Updated title",
    "content": "Updated content.",
    "authorName": "익명123",
    "ipMasked": "123.456.*.*",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
}
```

Errors:

- 400 `Bad Request` for validation failures or extra fields
- 401 `Unauthorized` when password is invalid
- 404 `Not Found` when post does not exist
- 500 `Internal Server Error`

### Delete Post

`DELETE /community/anonymous/posts/:id`

Authorization

- None

Request

```json
{
    "password": "secret1234"
}
```

Response 204

(empty body)

Errors:

- 401 `Unauthorized` when password is invalid
- 404 `Not Found` when post does not exist
- 500 `Internal Server Error`

---

## Topics

### List Topics

`GET /community/topics`

Query

- `page` (optional, default 1)
- `size` (optional, default 20, max 50)

Authorization

- None

Response 200

```json
{
    "items": [
        {
            "id": 1,
            "slug": "game-dev",
            "name": "Graphics",
            "description": "All about graphics.",
            "creator": {
                "id": 1,
                "username": "user1",
                "nickname": "홍길동",
                "description": "Hello",
                "profileImage": "uploads/profile/1/profile.png",
                "role": 1
            },
            "createdAt": "2024-01-01T00:00:00.000Z",
            "updatedAt": "2024-01-01T00:00:00.000Z"
        }
    ],
    "meta": { "page": 1, "size": 20, "total": 1 }
}
```

Errors:

- 400 `Bad Request` for invalid query or extra fields
- 500 `Internal Server Error`

### Get Topic Detail

`GET /community/topics/:slug`

Authorization

- None

Response 200

```json
{
    "id": 1,
    "slug": "game-dev",
    "name": "Graphics",
    "description": "All about graphics.",
    "creator": {
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
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
}
```

Errors:

- 404 `Not Found` when topic does not exist
- 500 `Internal Server Error`

### Create Topic

`POST /community/topics`

Authorization

- JWT required

Request

```json
{
    "slug": "game-dev",
    "name": "Graphics",
    "description": "All about graphics."
}
```

Response 201

```json
{
    "id": 1,
    "slug": "game-dev",
    "name": "Graphics",
    "description": "All about graphics.",
    "creator": {
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
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

Errors:

- 400 `Bad Request` for validation failures or extra fields
- 401 `Unauthorized` when access token is missing or invalid
- 409 `Conflict` when slug already exists
- 500 `Internal Server Error`

### Update Topic

`PUT /community/topics/:slug`

Authorization

- JWT required
- Creator or admin only

Request

```json
{
    "slug": "game-dev",
    "name": "Graphics",
    "description": "All about graphics."
}
```

Response 200

```json
{
    "id": 1,
    "slug": "game-dev",
    "name": "Graphics",
    "description": "All about graphics.",
    "creator": {
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
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
}
```

Errors:

- 400 `Bad Request` for validation failures or extra fields
- 401 `Unauthorized` when access token is missing or invalid
- 403 `Forbidden` when not creator or admin
- 404 `Not Found` when topic does not exist
- 409 `Conflict` when slug already exists
- 500 `Internal Server Error`

---

## Topic Posts

### List Topic Posts

`GET /community/topics/:slug/posts`

Query

- `page` (optional, default 1)
- `size` (optional, default 20, max 50)

Authorization

- None

Response 200

```json
{
    "items": [
        {
            "id": 1,
            "title": "Hello world",
            "topic": {
                "id": 1,
                "slug": "game-dev",
                "name": "Graphics",
                "description": "All about graphics.",
                "creator": {
                    "id": 1,
                    "username": "user1",
                    "nickname": "홍길동",
                    "description": "Hello",
                    "profileImage": "uploads/profile/1/profile.png",
                    "role": 1
                },
                "createdAt": "2024-01-01T00:00:00.000Z",
                "updatedAt": "2024-01-01T00:00:00.000Z"
            },
            "author": {
                "id": 1,
                "username": "user1",
                "nickname": "홍길동",
                "description": "Hello",
                "profileImage": "uploads/profile/1/profile.png",
                "role": 1
            },
            "createdAt": "2024-01-01T00:00:00.000Z",
            "updatedAt": "2024-01-01T00:00:00.000Z"
        }
    ],
    "meta": { "page": 1, "size": 20, "total": 1 }
}
```

Errors:

- 400 `Bad Request` for invalid query or extra fields
- 404 `Not Found` when topic does not exist
- 500 `Internal Server Error`

### Get Topic Post Detail

`GET /community/topics/:slug/posts/:id`

Authorization

- None

Response 200

```json
{
    "id": 1,
    "title": "Hello world",
    "content": "This is the content.",
    "topic": {
        "id": 1,
        "slug": "game-dev",
        "name": "Graphics",
        "description": "All about graphics.",
        "creator": {
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
        },
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-02T00:00:00.000Z"
    },
    "author": {
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
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
}
```

Errors:

- 404 `Not Found` when topic or post does not exist
- 500 `Internal Server Error`

### Create Topic Post

`POST /community/topics/:slug/posts`

Authorization

- JWT required

Request

```json
{
    "title": "Hello world",
    "content": "This is the content."
}
```

Response 201

```json
{
    "id": 1,
    "title": "Hello world",
    "content": "This is the content.",
    "topic": {
        "id": 1,
        "slug": "game-dev",
        "name": "Graphics",
        "description": "All about graphics.",
        "creator": {
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
        },
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "author": {
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
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

Errors:

- 400 `Bad Request` for validation failures or extra fields
- 401 `Unauthorized` when access token is missing or invalid
- 404 `Not Found` when topic does not exist
- 500 `Internal Server Error`

### Update Topic Post

`PUT /community/topics/:slug/posts/:id`

Authorization

- JWT required
- Self-only

Request

```json
{
    "title": "Updated title",
    "content": "Updated content."
}
```

Response 200

```json
{
    "id": 1,
    "title": "Updated title",
    "content": "Updated content.",
    "topic": {
        "id": 1,
        "slug": "game-dev",
        "name": "Graphics",
        "description": "All about graphics.",
        "creator": {
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
        },
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-02T00:00:00.000Z"
    },
    "author": {
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
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
}
```

Errors:

- 400 `Bad Request` for validation failures or extra fields
- 401 `Unauthorized` when access token is missing or invalid
- 403 `Forbidden` when trying to update another user's post
- 404 `Not Found` when topic or post does not exist
- 500 `Internal Server Error`

### Delete Topic Post

`DELETE /community/topics/:slug/posts/:id`

Authorization

- JWT required
- Self-only

Response 204

(empty body)

Errors:

- 401 `Unauthorized` when access token is missing or invalid
- 403 `Forbidden` when trying to delete another user's post
- 404 `Not Found` when topic or post does not exist
- 500 `Internal Server Error`
