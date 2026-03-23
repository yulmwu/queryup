import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { createTestApp, registerAndLogin } from './helpers/test-app'

jest.setTimeout(30000)

describe('Topic Comments API', () => {
    let app: INestApplication
    let agent: request.SuperAgentTest

    const createTopic = async (accessToken: string, slug: string) => {
        await agent
            .post('/community/topics')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ slug, name: `Topic ${slug}`, description: 'Board' })
            .expect(201)
    }

    const createPost = async (accessToken: string, slug: string) => {
        const post = await agent
            .post(`/community/topics/${slug}/posts`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ title: 't1', content: 'c1' })
            .expect(201)
        return post.body.id as number
    }

    const createComment = async (accessToken: string, slug: string, postId: number) => {
        const comment = await agent
            .post(`/community/topics/${slug}/posts/${postId}/comments`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ content: 'comment' })
            .expect(201)
        return comment.body.id as number
    }

    beforeAll(async () => {
        const setup = await createTestApp()
        app = setup.app
        agent = setup.agent
    })

    afterAll(async () => {
        await app.close()
    })

    it('POST /community/topics/:slug/posts/:postId/comments', async () => {
        const { accessToken } = await registerAndLogin(agent, 'topic_comment_create')

        const slug = 'topic-comment-create'
        await createTopic(accessToken, slug)

        const postId = await createPost(accessToken, slug)
        await agent
            .post(`/community/topics/${slug}/posts/${postId}/comments`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ content: 'comment' })
            .expect(201)
    })

    it('GET /community/topics/:slug/posts/:postId/comments', async () => {
        const { accessToken } = await registerAndLogin(agent, 'topic_comment_list')

        const slug = 'topic-comment-list'
        await createTopic(accessToken, slug)

        const postId = await createPost(accessToken, slug)
        await createComment(accessToken, slug, postId)

        await agent.get(`/community/topics/${slug}/posts/${postId}/comments?page=1&size=20`).expect(200)
    })

    it('POST /community/topics/:slug/posts/:postId/comments/:commentId/replies', async () => {
        const { accessToken } = await registerAndLogin(agent, 'topic_comment_reply_create')

        const slug = 'topic-comment-reply-create'
        await createTopic(accessToken, slug)

        const postId = await createPost(accessToken, slug)
        const commentId = await createComment(accessToken, slug, postId)

        await agent
            .post(`/community/topics/${slug}/posts/${postId}/comments/${commentId}/replies`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ content: 'reply' })
            .expect(201)
    })

    it('GET /community/topics/:slug/posts/:postId/comments/:commentId/replies', async () => {
        const { accessToken } = await registerAndLogin(agent, 'topic_comment_reply_list')

        const slug = 'topic-comment-reply-list'
        await createTopic(accessToken, slug)

        const postId = await createPost(accessToken, slug)
        const commentId = await createComment(accessToken, slug, postId)

        await agent
            .post(`/community/topics/${slug}/posts/${postId}/comments/${commentId}/replies`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ content: 'reply' })
            .expect(201)

        await agent.get(`/community/topics/${slug}/posts/${postId}/comments/${commentId}/replies?size=20`).expect(200)
    })

    it('PUT /community/topics/:slug/posts/:postId/comments/:commentId', async () => {
        const { accessToken } = await registerAndLogin(agent, 'topic_comment_update')

        const slug = 'topic-comment-update'
        await createTopic(accessToken, slug)

        const postId = await createPost(accessToken, slug)
        const commentId = await createComment(accessToken, slug, postId)

        await agent
            .put(`/community/topics/${slug}/posts/${postId}/comments/${commentId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ content: 'comment2' })
            .expect(200)
    })

    it('DELETE /community/topics/:slug/posts/:postId/comments/:commentId', async () => {
        const { accessToken } = await registerAndLogin(agent, 'topic_comment_delete')

        const slug = 'topic-comment-delete'
        await createTopic(accessToken, slug)

        const postId = await createPost(accessToken, slug)
        const commentId = await createComment(accessToken, slug, postId)

        await agent
            .delete(`/community/topics/${slug}/posts/${postId}/comments/${commentId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(204)
    })
})
