import { ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common'
import { TopicsService } from './topics.service'
import { Topic } from './topic.entity'
import { Repository } from 'typeorm'
import { UsersService } from 'modules/users/users.service'
import { UserRole } from 'modules/users/users.entity'

const createMockRepo = <T>() => ({
    create: jest.fn(),
    save: jest.fn(),
    findAndCount: jest.fn(),
    findOne: jest.fn(),
})

describe('TopicsService', () => {
    let service: TopicsService
    let repo: ReturnType<typeof createMockRepo>
    let usersService: jest.Mocked<UsersService>

    beforeEach(() => {
        repo = createMockRepo<Topic>()
        usersService = {
            findById: jest.fn(),
        } as unknown as jest.Mocked<UsersService>
        service = new TopicsService(repo as unknown as Repository<Topic>, usersService)
    })

    it('create rejects duplicate slug', async () => {
        repo.findOne.mockResolvedValue({ id: 1 })
        await expect(service.create(1, { slug: 'dev', name: 'Dev', description: 'd' })).rejects.toBeInstanceOf(
            ConflictException,
        )
    })

    it('update rejects when not owner or admin', async () => {
        repo.findOne.mockResolvedValue({ id: 1, slug: 'dev', creator: { id: 2 } })
        usersService.findById.mockResolvedValue({ id: 1, role: UserRole.USER } as never)

        await expect(service.update('dev', 1, { name: 'n' })).rejects.toBeInstanceOf(ForbiddenException)
    })

    it('update throws when topic missing', async () => {
        repo.findOne.mockResolvedValue(null)
        await expect(service.update('dev', 1, { name: 'n' })).rejects.toBeInstanceOf(NotFoundException)
    })
})
