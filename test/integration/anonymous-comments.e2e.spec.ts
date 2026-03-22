import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { createTestApp } from './helpers/test-app'

jest.setTimeout(30000)

describe('Anonymous Comments API', () => {
    let app: INestApplication
    let agent: request.SuperAgentTest

    const createPost = async () => {
        const created = await agent
            .post('/community/anonymous/posts')
            .send({ title: 'anon', content: 'c', authorName: '익명', password: 'pw' })
            .expect(201)

        return created.body.id
    }

    beforeAll(async () => {
        const setup = await createTestApp()
        app = setup.app
        agent = setup.agent
    })

    afterAll(async () => {
        await app.close()
    })

    it('POST /community/anonymous/posts/:postId/comments', async () => {
        const postId = await createPost()
        await agent
            .post(`/community/anonymous/posts/${postId}/comments`)
            .send({ content: 'comment', authorName: '익명', password: 'pw' })
            .expect(201)
    })

    it('GET /community/anonymous/posts/:postId/comments', async () => {
        const postId = await createPost()
        await agent
            .post(`/community/anonymous/posts/${postId}/comments`)
            .send({ content: 'comment', authorName: '익명', password: 'pw' })
            .expect(201)
        await agent.get(`/community/anonymous/posts/${postId}/comments?page=1&size=20`).expect(200)
    })

    it('POST /community/anonymous/posts/:postId/comments/:commentId/replies', async () => {
        const postId = await createPost()
        const comment = await agent
            .post(`/community/anonymous/posts/${postId}/comments`)
            .send({ content: 'comment', authorName: '익명', password: 'pw' })
            .expect(201)

        await agent
            .post(`/community/anonymous/posts/${postId}/comments/${comment.body.id}/replies`)
            .send({ content: 'reply', authorName: '익명', password: 'pw' })
            .expect(201)
    })

    it('GET /community/anonymous/posts/:postId/comments/:commentId/replies', async () => {
        const postId = await createPost()
        const comment = await agent
            .post(`/community/anonymous/posts/${postId}/comments`)
            .send({ content: 'comment', authorName: '익명', password: 'pw' })
            .expect(201)

        await agent
            .post(`/community/anonymous/posts/${postId}/comments/${comment.body.id}/replies`)
            .send({ content: 'reply', authorName: '익명', password: 'pw' })
            .expect(201)

        await agent.get(`/community/anonymous/posts/${postId}/comments/${comment.body.id}/replies?size=20`).expect(200)
    })

    it('PUT /community/anonymous/posts/:postId/comments/:commentId', async () => {
        const postId = await createPost()
        const comment = await agent
            .post(`/community/anonymous/posts/${postId}/comments`)
            .send({ content: 'comment', authorName: '익명', password: 'pw' })
            .expect(201)

        await agent
            .put(`/community/anonymous/posts/${postId}/comments/${comment.body.id}`)
            .send({ content: 'comment2', password: 'pw' })
            .expect(200)
    })

    it('DELETE /community/anonymous/posts/:postId/comments/:commentId', async () => {
        const postId = await createPost()
        const comment = await agent
            .post(`/community/anonymous/posts/${postId}/comments`)
            .send({ content: 'comment', authorName: '익명', password: 'pw' })
            .expect(201)

        await agent
            .delete(`/community/anonymous/posts/${postId}/comments/${comment.body.id}`)
            .send({ password: 'pw' })
            .expect(204)
    })
})
