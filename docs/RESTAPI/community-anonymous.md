---
title: Community - Anonymous
nav_order: 5
---

# Community - Anonymous

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

## Anonymous Comments

Notes

- Pagination: top-level comments use page pagination; replies use cursor pagination.
- Deleted comments with no replies are omitted.
- Deleted comments with replies are returned with `content: null` and `isDeleted: true`.
- Deleted replies are omitted.

### List Comments

`GET /community/anonymous/posts/:postId/comments`

Response 200 (example)

```json
{
    "items": [
        {
            "id": 10,
            "parentId": null,
            "content": "Nice post!",
            "isDeleted": false,
            "replyCount": 1,
            "author": {
                "authorName": "익명123",
                "ipMasked": "123.45.*.*"
            },
            "createdAt": "2024-01-01T00:00:00.000Z",
            "updatedAt": "2024-01-01T00:00:00.000Z"
        }
    ],
    "meta": { "page": 1, "size": 20, "total": 1 }
}
```

### List Replies

`GET /community/anonymous/posts/:postId/comments/:commentId/replies`

Response 200 (example)

```json
{
    "items": [
        {
            "id": 21,
            "parentId": 10,
            "content": "Thanks!",
            "author": {
                "authorName": "익명123",
                "ipMasked": "123.45.*.*"
            },
            "createdAt": "2024-01-01T00:00:00.000Z",
            "updatedAt": "2024-01-01T00:00:00.000Z"
        }
    ],
    "meta": { "size": 20, "nextCursor": null }
}
```

### Create Comment

`POST /community/anonymous/posts/:postId/comments`

Request

```json
{
    "content": "Nice post!",
    "authorName": "익명123",
    "password": "secret1234"
}
```

### Create Reply

`POST /community/anonymous/posts/:postId/comments/:commentId/replies`

Request

```json
{
    "content": "Thanks!",
    "authorName": "익명123",
    "password": "secret1234"
}
```

### Update Comment

`PUT /community/anonymous/posts/:postId/comments/:commentId`

Request

```json
{
    "content": "Updated",
    "password": "secret1234"
}
```

### Delete Comment

`DELETE /community/anonymous/posts/:postId/comments/:commentId`

Request

```json
{
    "password": "secret1234"
}
```
