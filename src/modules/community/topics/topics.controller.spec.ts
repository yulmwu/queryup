import { TopicsController } from './topics.controller'
import { TopicsService } from './topics.service'

describe('TopicsController', () => {
    let controller: TopicsController
    let service: jest.Mocked<TopicsService>

    beforeEach(() => {
        service = {
            list: jest.fn(),
            findBySlug: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        } as unknown as jest.Mocked<TopicsService>
        controller = new TopicsController(service)
    })

    it('list delegates to service', async () => {
        service.list.mockResolvedValue({ items: [], meta: { page: 1, size: 20, total: 0 } } as never)
        const result = await controller.list({ page: 1, size: 20 } as never)

        expect(service.list).toHaveBeenCalledWith(1, 20)
        expect(result).toEqual({ items: [], meta: { page: 1, size: 20, total: 0 } })
    })

    it('findOne delegates to service', async () => {
        service.findBySlug.mockResolvedValue({ id: 1 } as never)
        const result = await controller.findOne('dev')

        expect(service.findBySlug).toHaveBeenCalledWith('dev')
        expect(result).toEqual({ id: 1 })
    })

    it('create delegates to service', async () => {
        service.create.mockResolvedValue({ id: 1 } as never)
        const result = await controller.create(
            { slug: 'dev', name: 'n', description: 'd' } as never,
            {
                user: { userId: 2 },
            } as any,
        )

        expect(service.create).toHaveBeenCalledWith(2, { slug: 'dev', name: 'n', description: 'd' })
        expect(result).toEqual({ id: 1 })
    })

    it('update delegates to service', async () => {
        service.update.mockResolvedValue({ id: 1 } as never)
        const result = await controller.update('dev', { name: 'n' } as never, { user: { userId: 2 } } as any)

        expect(service.update).toHaveBeenCalledWith('dev', 2, { name: 'n' })
        expect(result).toEqual({ id: 1 })
    })
})
