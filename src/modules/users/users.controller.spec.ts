import { UsersController } from './users.controller'
import { UsersService } from './users.service'

describe('UsersController', () => {
    let controller: UsersController
    let usersService: jest.Mocked<UsersService>

    beforeEach(() => {
        usersService = {
            findByUsername: jest.fn(),
        } as unknown as jest.Mocked<UsersService>
        controller = new UsersController(usersService)
    })

    it('findByUsername delegates to service with optional userId', async () => {
        usersService.findByUsername.mockResolvedValue({ id: 1 } as never)
        const result = await controller.findByUsername({ username: 'u' }, { user: { userId: 2 } } as any)

        expect(usersService.findByUsername).toHaveBeenCalledWith('u', 2)
        expect(result).toEqual({ id: 1 })
    })

    it('findByUsername handles missing user context', async () => {
        usersService.findByUsername.mockResolvedValue({ id: 1 } as never)
        await controller.findByUsername({ username: 'u' }, {} as any)

        expect(usersService.findByUsername).toHaveBeenCalledWith('u', undefined)
    })
})
