import { RedisService } from './redis.service'

describe('RedisService', () => {
    const makeClient = () => ({
        quit: jest.fn(),
        set: jest.fn(),
        get: jest.fn(),
        del: jest.fn(),
        keys: jest.fn(),
    })

    it('quits on module destroy', () => {
        const client = makeClient()
        const service = new RedisService(client as never)

        service.onModuleDestroy()
        expect(client.quit).toHaveBeenCalled()
    })

    it('set uses EX when expireSeconds provided', async () => {
        const client = makeClient()
        const service = new RedisService(client as never)

        await service.set('k', 'v', 10)
        expect(client.set).toHaveBeenCalledWith('k', 'v', 'EX', 10)
    })

    it('set without expireSeconds', async () => {
        const client = makeClient()
        const service = new RedisService(client as never)

        await service.set('k', 'v')
        expect(client.set).toHaveBeenCalledWith('k', 'v')
    })

    it('get and del delegate', async () => {
        const client = makeClient()
        client.get.mockResolvedValue('v')

        const service = new RedisService(client as never)

        await expect(service.get('k')).resolves.toBe('v')

        await service.del('k')
        expect(client.del).toHaveBeenCalledWith('k')
    })

    it('delPattern deletes matching keys', async () => {
        const client = makeClient()
        client.keys.mockResolvedValue(['a', 'b'])

        const service = new RedisService(client as never)

        await service.delPattern('a*')
        expect(client.del).toHaveBeenCalledWith('a', 'b')
    })

    it('delPattern no-ops when empty', async () => {
        const client = makeClient()
        client.keys.mockResolvedValue([])

        const service = new RedisService(client as never)

        await service.delPattern('a*')
        expect(client.del).not.toHaveBeenCalled()
    })
})
