import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { createTestApp, buildRegisterPayload } from './helpers/test-app'

jest.setTimeout(30000)

describe('Users API', () => {
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

    it('GET /users/:username', async () => {
        const payload = buildRegisterPayload('users_get')
        await agent.post('/auth/register').send(payload).expect(201)
        await agent.get(`/users/${payload.username}`).expect(200)
    })
})
