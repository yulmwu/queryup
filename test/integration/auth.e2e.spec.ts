import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { createTestApp, buildRegisterPayload } from './helpers/test-app'

jest.setTimeout(30000)

describe('Auth API', () => {
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

    it('POST /auth/register', async () => {
        const payload = buildRegisterPayload('auth_register')
        await agent.post('/auth/register').send(payload).expect(201)
    })

    it('POST /auth/login', async () => {
        const payload = buildRegisterPayload('auth_login')
        await agent.post('/auth/register').send(payload).expect(201)
        await agent.post('/auth/login').send({ username: payload.username, password: payload.password }).expect(201)
    })

    it('POST /auth/refresh', async () => {
        const payload = buildRegisterPayload('auth_refresh')
        await agent.post('/auth/register').send(payload).expect(201)
        await agent.post('/auth/login').send({ username: payload.username, password: payload.password }).expect(201)
        await agent.post('/auth/refresh').expect(200)
    })

    it('GET /auth/me', async () => {
        const payload = buildRegisterPayload('auth_me')
        await agent.post('/auth/register').send(payload).expect(201)

        const loginRes = await agent
            .post('/auth/login')
            .send({ username: payload.username, password: payload.password })
            .expect(201)

        const accessToken = loginRes.body?.accessToken
        await agent.get('/auth/me').set('Authorization', `Bearer ${accessToken}`).expect(200)
    })

    it('PUT /auth/me', async () => {
        const payload = buildRegisterPayload('auth_update')
        await agent.post('/auth/register').send(payload).expect(201)
        const loginRes = await agent
            .post('/auth/login')
            .send({ username: payload.username, password: payload.password })
            .expect(201)
        const accessToken = loginRes.body?.accessToken
        await agent.put('/auth/me').set('Authorization', `Bearer ${accessToken}`).send({ nickname: 'nick' }).expect(200)
    })

    it('POST /auth/logout', async () => {
        const payload = buildRegisterPayload('auth_logout')
        await agent.post('/auth/register').send(payload).expect(201)
        await agent.post('/auth/login').send({ username: payload.username, password: payload.password }).expect(201)
        await agent.post('/auth/logout').expect(200)
    })
})
