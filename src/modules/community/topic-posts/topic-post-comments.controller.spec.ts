import { TopicPostCommentsController } from './topic-post-comments.controller'
import { TopicPostCommentsService } from './topic-post-comments.service'

describe('TopicPostCommentsController', () => {
    let controller: TopicPostCommentsController
    let service: jest.Mocked<TopicPostCommentsService>

    beforeEach(() => {
        service = {
            list: jest.fn(),
            listReplies: jest.fn(),
            create: jest.fn(),
            createReply: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        } as unknown as jest.Mocked<TopicPostCommentsService>
        controller = new TopicPostCommentsController(service)
    })

    it('list delegates to service', async () => {
        service.list.mockResolvedValue({ items: [], meta: { page: 1, size: 20, total: 0 } } as never)

        const result = await controller.list('slug', 1, { page: 1, size: 20 } as never)

        expect(service.list).toHaveBeenCalledWith('slug', 1, 1, 20)
        expect(result).toEqual({ items: [], meta: { page: 1, size: 20, total: 0 } })
    })

    it('listReplies delegates to service', async () => {
        service.listReplies.mockResolvedValue({ items: [], meta: { size: 20, nextCursor: null } } as never)

        const result = await controller.listReplies('slug', 1, 2, { cursor: 10, size: 20 } as never)

        expect(service.listReplies).toHaveBeenCalledWith('slug', 1, 2, 10, 20)
        expect(result).toEqual({ items: [], meta: { size: 20, nextCursor: null } })
    })

    it('create uses user id from request', async () => {
        service.create.mockResolvedValue({ id: 1 } as never)
        const req = { user: { userId: 7 } } as any

        const result = await controller.create('slug', 1, { content: 'c' } as never, req)

        expect(service.create).toHaveBeenCalledWith('slug', 1, 7, { content: 'c' })
        expect(result).toEqual({ id: 1 })
    })

    it('createReply uses user id from request', async () => {
        service.createReply.mockResolvedValue({ id: 1 } as never)
        const req = { user: { userId: 7 } } as any

        const result = await controller.createReply('slug', 1, 2, { content: 'c' } as never, req)

        expect(service.createReply).toHaveBeenCalledWith('slug', 1, 2, 7, { content: 'c' })
        expect(result).toEqual({ id: 1 })
    })

    it('update uses user id from request', async () => {
        service.update.mockResolvedValue({ id: 1 } as never)
        const req = { user: { userId: 7 } } as any

        const result = await controller.update('slug', 1, 2, { content: 'c' } as never, req)

        expect(service.update).toHaveBeenCalledWith('slug', 1, 2, 7, { content: 'c' })
        expect(result).toEqual({ id: 1 })
    })

    it('remove uses user id from request', async () => {
        const req = { user: { userId: 7 } } as any

        await controller.remove('slug', 1, 2, req)

        expect(service.remove).toHaveBeenCalledWith('slug', 1, 2, 7)
    })
})
