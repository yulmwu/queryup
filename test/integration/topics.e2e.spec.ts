import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { createTestApp, registerAndLogin } from './helpers/test-app'

jest.setTimeout(30000)

describe('Topics API', () => {
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

    it('POST /community/topics', async () => {
        const { accessToken } = await registerAndLogin(agent, 'topics_create')

        const slug = 'topics-create'
        await agent
            .post('/community/topics')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ slug, name: 'General', description: 'General board' })
            .expect(201)
    })

    it('GET /community/topics', async () => {
        const { accessToken } = await registerAndLogin(agent, 'topics_list')

        const slug = 'topics-list'
        await agent
            .post('/community/topics')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ slug, name: 'General', description: 'General board' })
            .expect(201)

        await agent.get('/community/topics?page=1&size=20').expect(200)
    })

    it('GET /community/topics/:slug', async () => {
        const { accessToken } = await registerAndLogin(agent, 'topics_detail')

        const slug = 'topics-detail'
        await agent
            .post('/community/topics')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ slug, name: 'General', description: 'General board' })
            .expect(201)

        await agent.get(`/community/topics/${slug}`).expect(200)
    })

    it('PUT /community/topics/:slug', async () => {
        const { accessToken } = await registerAndLogin(agent, 'topics_update')

        const slug = 'topics-update'
        await agent
            .post('/community/topics')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ slug, name: 'General', description: 'General board' })
            .expect(201)

        await agent
            .put(`/community/topics/${slug}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ name: 'General 2' })
            .expect(200)
    })
})
