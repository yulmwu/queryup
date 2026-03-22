import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { createTestApp } from './helpers/test-app'

jest.setTimeout(30000)

describe('Anonymous Posts API', () => {
    let app: INestApplication
    let agent: request.SuperAgentTest

    beforeAll(async () => {
        const setup = await createTestApp()
        app = setup.app
        agent = setup.agent
    })

    afterAll(async () => {
        await app.close()
    })

    it('POST /community/anonymous/posts', async () => {
        await agent
            .post('/community/anonymous/posts')
            .send({ title: 'anon', content: 'c', authorName: '익명', password: 'pw' })
            .expect(201)
    })

    it('GET /community/anonymous/posts', async () => {
        await agent
            .post('/community/anonymous/posts')
            .send({ title: 'anon', content: 'c', authorName: '익명', password: 'pw' })
            .expect(201)

        await agent.get('/community/anonymous/posts?page=1&size=20').expect(200)
    })

    it('GET /community/anonymous/posts/:id', async () => {
        const created = await agent
            .post('/community/anonymous/posts')
            .send({ title: 'anon', content: 'c', authorName: '익명', password: 'pw' })
            .expect(201)

        await agent.get(`/community/anonymous/posts/${created.body.id}`).expect(200)
    })

    it('PUT /community/anonymous/posts/:id', async () => {
        const created = await agent
            .post('/community/anonymous/posts')
            .send({ title: 'anon', content: 'c', authorName: '익명', password: 'pw' })
            .expect(201)

        await agent
            .put(`/community/anonymous/posts/${created.body.id}`)
            .send({ title: 'anon2', content: 'c2', password: 'pw' })
            .expect(200)
    })

    it('DELETE /community/anonymous/posts/:id', async () => {
        const created = await agent
            .post('/community/anonymous/posts')
            .send({ title: 'anon', content: 'c', authorName: '익명', password: 'pw' })
            .expect(201)

        await agent.delete(`/community/anonymous/posts/${created.body.id}`).send({ password: 'pw' }).expect(204)
    })
})
