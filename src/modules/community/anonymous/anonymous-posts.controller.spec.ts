import { AnonymousPostsController } from './anonymous-posts.controller'
import { AnonymousPostsService } from './anonymous-posts.service'

describe('AnonymousPostsController', () => {
    let controller: AnonymousPostsController
    let service: jest.Mocked<AnonymousPostsService>

    beforeEach(() => {
        service = {
            list: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        } as unknown as jest.Mocked<AnonymousPostsService>
        controller = new AnonymousPostsController(service)
    })

    it('list delegates to service', async () => {
        service.list.mockResolvedValue({ items: [], meta: { page: 1, size: 20, total: 0 } } as never)
        const result = await controller.list({ page: 1, size: 20 } as never)

        expect(service.list).toHaveBeenCalledWith(1, 20)
        expect(result).toEqual({ items: [], meta: { page: 1, size: 20, total: 0 } })
    })

    it('findOne delegates to service', async () => {
        service.findOne.mockResolvedValue({ id: 1 } as never)
        const result = await controller.findOne(1)

        expect(service.findOne).toHaveBeenCalledWith(1)
        expect(result).toEqual({ id: 1 })
    })

    it('create uses x-forwarded-for', async () => {
        service.create.mockResolvedValue({ id: 1 } as never)
        const req = {
            headers: { 'x-forwarded-for': '123.456.78.90, 10.0.0.1' },
            ip: '9.9.9.9',
        } as any

        const result = await controller.create(
            { title: 't', content: 'c', authorName: 'a', password: 'p' } as never,
            req,
        )

        expect(service.create).toHaveBeenCalledWith(
            { title: 't', content: 'c', authorName: 'a', password: 'p' },
            '123.456.78.90',
        )
        expect(result).toEqual({ id: 1 })
    })

    it('create falls back to ip when forwarded missing', async () => {
        service.create.mockResolvedValue({ id: 1 } as never)
        const req = { headers: {}, ip: undefined } as any

        await controller.create({ title: 't', content: 'c', authorName: 'a', password: 'p' } as never, req)

        expect(service.create).toHaveBeenCalledWith(
            { title: 't', content: 'c', authorName: 'a', password: 'p' },
            '0.0.0.0',
        )
    })

    it('update delegates to service', async () => {
        service.update.mockResolvedValue({ id: 1 } as never)
        const result = await controller.update(1, { password: 'p' } as never)

        expect(service.update).toHaveBeenCalledWith(1, { password: 'p' })
        expect(result).toEqual({ id: 1 })
    })

    it('remove delegates to service', async () => {
        await controller.remove(1, { password: 'p' } as never)

        expect(service.remove).toHaveBeenCalledWith(1, { password: 'p' })
    })
})
