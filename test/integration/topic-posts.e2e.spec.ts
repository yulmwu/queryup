import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { createTestApp, registerAndLogin } from './helpers/test-app'

jest.setTimeout(30000)

describe('Topic Posts API', () => {
    let app: INestApplication
    let agent: request.SuperAgentTest

    const createTopic = async (accessToken: string, slug: string) => {
        await agent
            .post('/community/topics')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ slug, name: 'General', description: 'General board' })
            .expect(201)
    }

    beforeAll(async () => {
        const setup = await createTestApp()
        app = setup.app
        agent = setup.agent
    })

    afterAll(async () => {
        await app.close()
    })

    it('POST /community/topics/:slug/posts', async () => {
        const { accessToken } = await registerAndLogin(agent, 'topic_posts_create')

        const slug = 'topic-posts-create'
        await createTopic(accessToken, slug)

        await agent
            .post(`/community/topics/${slug}/posts`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ title: 't1', content: 'c1' })
            .expect(201)
    })

    it('GET /community/topics/:slug/posts', async () => {
        const { accessToken } = await registerAndLogin(agent, 'topic_posts_list')

        const slug = 'topic-posts-list'
        await createTopic(accessToken, slug)

        await agent
            .post(`/community/topics/${slug}/posts`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ title: 't1', content: 'c1' })
            .expect(201)

        await agent.get(`/community/topics/${slug}/posts?page=1&size=20`).expect(200)
    })

    it('GET /community/topics/:slug/posts/:id', async () => {
        const { accessToken } = await registerAndLogin(agent, 'topic_posts_detail')

        const slug = 'topic-posts-detail'
        await createTopic(accessToken, slug)

        const post = await agent
            .post(`/community/topics/${slug}/posts`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ title: 't1', content: 'c1' })
            .expect(201)

        await agent.get(`/community/topics/${slug}/posts/${post.body.id}`).expect(200)
    })

    it('PUT /community/topics/:slug/posts/:id', async () => {
        const { accessToken } = await registerAndLogin(agent, 'topic_posts_update')

        const slug = 'topic-posts-update'
        await createTopic(accessToken, slug)

        const post = await agent
            .post(`/community/topics/${slug}/posts`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ title: 't1', content: 'c1' })
            .expect(201)

        await agent
            .put(`/community/topics/${slug}/posts/${post.body.id}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ title: 't2' })
            .expect(200)
    })

    it('DELETE /community/topics/:slug/posts/:id', async () => {
        const { accessToken } = await registerAndLogin(agent, 'topic_posts_delete')

        const slug = 'topic-posts-delete'
        await createTopic(accessToken, slug)

        const post = await agent
            .post(`/community/topics/${slug}/posts`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ title: 't1', content: 'c1' })
            .expect(201)

        await agent
            .delete(`/community/topics/${slug}/posts/${post.body.id}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(204)
    })
})
