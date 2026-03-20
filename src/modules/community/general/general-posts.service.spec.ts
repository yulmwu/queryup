import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { Repository } from 'typeorm'
import { UsersService } from 'modules/users/users.service'
import { GeneralPost } from './general-post.entity'
import { GeneralPostsService } from './general-posts.service'

const createMockRepo = <T>() => ({
    create: jest.fn(),
    save: jest.fn(),
    findAndCount: jest.fn(),
    findOne: jest.fn(),
})

describe('GeneralPostsService', () => {
    let service: GeneralPostsService
    let repo: ReturnType<typeof createMockRepo>
    let usersService: jest.Mocked<UsersService>

    beforeEach(() => {
        repo = createMockRepo<GeneralPost>()
        usersService = {
            findById: jest.fn(),
        } as unknown as jest.Mocked<UsersService>
        service = new GeneralPostsService(repo as unknown as Repository<GeneralPost>, usersService)
    })

    it('update rejects when not owner', async () => {
        repo.findOne.mockResolvedValue({ id: 1, author: { id: 2 } })

        await expect(service.update(1, 1, { title: 't' })).rejects.toBeInstanceOf(ForbiddenException)
    })

    it('findOne throws when missing', async () => {
        repo.findOne.mockResolvedValue(null)

        await expect(service.findOne(1)).rejects.toBeInstanceOf(NotFoundException)
    })

    it('list returns items and meta', async () => {
        repo.findAndCount.mockResolvedValue([
            [
                {
                    id: 1,
                    title: 't',
                    author: { id: 1, username: 'u', role: 1 },
                    createdAt: new Date('2024-01-01T00:00:00.000Z'),
                    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
                },
            ],
            1,
        ])

        const result = await service.list(1, 10)

        expect(result.meta.total).toBe(1)
        expect(result.items[0]).toEqual(
            expect.objectContaining({
                id: 1,
                title: 't',
            }),
        )
    })

    it('create delegates to repo and returns saved post', async () => {
        usersService.findById.mockResolvedValue({ id: 2 } as never)
        repo.create.mockReturnValue({ id: 1 })
        repo.save.mockResolvedValue({
            id: 1,
            title: 't',
            content: 'c',
            author: { id: 2, username: 'u', role: 1 },
            createdAt: new Date('2024-01-01T00:00:00.000Z'),
            updatedAt: new Date('2024-01-01T00:00:00.000Z'),
        })

        const result = await service.create(2, { title: 't', content: 'c' })

        expect(repo.create).toHaveBeenCalled()
        expect(result).toEqual(
            expect.objectContaining({
                id: 1,
                title: 't',
            }),
        )
    })

    it('update applies title and content', async () => {
        repo.findOne.mockResolvedValue({
            id: 1,
            title: 'old',
            content: 'old',
            author: { id: 1 },
        })
        repo.save.mockResolvedValue({
            id: 1,
            title: 'new',
            content: 'new',
            author: { id: 1, username: 'u', role: 1 },
            createdAt: new Date('2024-01-01T00:00:00.000Z'),
            updatedAt: new Date('2024-01-01T00:00:00.000Z'),
        })

        const result = await service.update(1, 1, { title: 'new', content: 'new' })

        expect(result).toEqual(expect.objectContaining({ title: 'new', content: 'new' }))
    })

    it('remove marks post deleted', async () => {
        const post = { id: 1, isDeleted: false, author: { id: 1 } }
        repo.findOne.mockResolvedValue(post)

        await service.remove(1, 1)

        expect(post.isDeleted).toBe(true)
        expect(repo.save).toHaveBeenCalledWith(post)
    })
})
