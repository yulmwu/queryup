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

    it('list returns items and meta', async () => {
        repo.findAndCount.mockResolvedValue([
            [
                {
                    id: 1,
                    slug: 'dev',
                    name: 'Dev',
                    description: 'd',
                    creator: { id: 1, username: 'u', role: UserRole.USER },
                    createdAt: new Date('2024-01-01T00:00:00.000Z'),
                    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
                },
            ],
            1,
        ])

        const result = await service.list(1, 10)

        expect(result.meta.total).toBe(1)
        expect(result.items[0]).toEqual(expect.objectContaining({ slug: 'dev' }))
    })

    it('findBySlug returns topic detail', async () => {
        repo.findOne.mockResolvedValue({
            id: 1,
            slug: 'dev',
            name: 'Dev',
            description: 'd',
            creator: { id: 1, username: 'u', email: 'e@test.com', role: UserRole.USER },
            createdAt: new Date('2024-01-01T00:00:00.000Z'),
            updatedAt: new Date('2024-01-01T00:00:00.000Z'),
        })

        const result = await service.findBySlug('dev')

        expect(result).toEqual(expect.objectContaining({ slug: 'dev' }))
    })

    it('update allows admin and changes slug', async () => {
        repo.findOne.mockResolvedValueOnce({ id: 1, slug: 'dev', creator: { id: 2 } }).mockResolvedValueOnce(null)
        usersService.findById.mockResolvedValue({ id: 1, role: UserRole.ADMIN } as never)
        repo.save.mockResolvedValue({
            id: 1,
            slug: 'new-dev',
            name: 'Dev',
            description: 'd',
            creator: { id: 2, username: 'u', email: 'e@test.com', role: UserRole.USER },
            createdAt: new Date('2024-01-01T00:00:00.000Z'),
            updatedAt: new Date('2024-01-01T00:00:00.000Z'),
        })

        const result = await service.update('dev', 1, { slug: 'new-dev' })

        expect(result).toEqual(expect.objectContaining({ slug: 'new-dev' }))
    })
})
