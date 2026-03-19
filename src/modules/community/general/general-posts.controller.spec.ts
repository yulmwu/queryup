import { GeneralPostsController } from './general-posts.controller'
import { GeneralPostsService } from './general-posts.service'

describe('GeneralPostsController', () => {
    let controller: GeneralPostsController
    let service: jest.Mocked<GeneralPostsService>

    beforeEach(() => {
        service = {
            list: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        } as unknown as jest.Mocked<GeneralPostsService>
        controller = new GeneralPostsController(service)
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

    it('create delegates to service', async () => {
        service.create.mockResolvedValue({ id: 1 } as never)
        const result = await controller.create({ title: 't', content: 'c' } as never, { user: { userId: 2 } } as any)

        expect(service.create).toHaveBeenCalledWith(2, { title: 't', content: 'c' })
        expect(result).toEqual({ id: 1 })
    })

    it('update delegates to service', async () => {
        service.update.mockResolvedValue({ id: 1 } as never)
        const result = await controller.update(1, { title: 't' } as never, { user: { userId: 2 } } as any)

        expect(service.update).toHaveBeenCalledWith(1, 2, { title: 't' })
        expect(result).toEqual({ id: 1 })
    })

    it('remove delegates to service', async () => {
        await controller.remove(1, { user: { userId: 2 } } as any)

        expect(service.remove).toHaveBeenCalledWith(1, 2)
    })
})
