import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { createTestApp } from './helpers/test-app'

jest.setTimeout(30000)

describe('Health API', () => {
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

    it('GET /health', async () => {
        await agent.get('/health').expect(200)
    })
})
