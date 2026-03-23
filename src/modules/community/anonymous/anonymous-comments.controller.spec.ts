import { AnonymousCommentsController } from './anonymous-comments.controller'
import { AnonymousCommentsService } from './anonymous-comments.service'

describe('AnonymousCommentsController', () => {
    let controller: AnonymousCommentsController
    let service: jest.Mocked<AnonymousCommentsService>

    beforeEach(() => {
        service = {
            list: jest.fn(),
            listReplies: jest.fn(),
            create: jest.fn(),
            createReply: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        } as unknown as jest.Mocked<AnonymousCommentsService>
        controller = new AnonymousCommentsController(service)
    })

    it('list delegates to service', async () => {
        service.list.mockResolvedValue({ items: [], meta: { page: 1, size: 20, total: 0 } } as never)

        const result = await controller.list(1, { page: 1, size: 20 } as never)

        expect(service.list).toHaveBeenCalledWith(1, 1, 20)
        expect(result).toEqual({ items: [], meta: { page: 1, size: 20, total: 0 } })
    })

    it('listReplies delegates to service', async () => {
        service.listReplies.mockResolvedValue({ items: [], meta: { size: 20, nextCursor: null } } as never)

        const result = await controller.listReplies(1, 2, { cursor: 10, size: 20 } as never)

        expect(service.listReplies).toHaveBeenCalledWith(1, 2, 10, 20)
        expect(result).toEqual({ items: [], meta: { size: 20, nextCursor: null } })
    })

    it('create uses request ip', async () => {
        service.create.mockResolvedValue({ id: 1 } as never)

        const result = await controller.create(
            1,
            { content: 'c', authorName: 'anon', password: 'p' } as never,
            { ip: '9.9.9.9' } as any,
        )

        expect(service.create).toHaveBeenCalledWith(1, { content: 'c', authorName: 'anon', password: 'p' }, '9.9.9.9')
        expect(result).toEqual({ id: 1 })
    })

    it('createReply falls back to 0.0.0.0 when ip missing', async () => {
        service.createReply.mockResolvedValue({ id: 1 } as never)

        await controller.createReply(
            1,
            2,
            { content: 'c', authorName: 'anon', password: 'p' } as never,
            { ip: undefined } as any,
        )

        expect(service.createReply).toHaveBeenCalledWith(1, 2, { content: 'c', authorName: 'anon', password: 'p' }, '0.0.0.0')
    })

    it('update delegates to service', async () => {
        service.update.mockResolvedValue({ id: 1 } as never)

        const result = await controller.update(1, 2, { content: 'c', password: 'p' } as never)

        expect(service.update).toHaveBeenCalledWith(1, 2, { content: 'c', password: 'p' })
        expect(result).toEqual({ id: 1 })
    })

    it('remove delegates to service', async () => {
        await controller.remove(1, 2, { password: 'p' } as never)

        expect(service.remove).toHaveBeenCalledWith(1, 2, { password: 'p' })
    })
})
