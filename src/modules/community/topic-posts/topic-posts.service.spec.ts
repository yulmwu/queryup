import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { TopicPostsService } from './topic-posts.service'
import { TopicPost } from './topic-post.entity'
import { Topic } from '../topics/topic.entity'
import { Repository } from 'typeorm'
import { UsersService } from 'modules/users/users.service'

const createMockRepo = <T>() => ({
    create: jest.fn(),
    save: jest.fn(),
    findAndCount: jest.fn(),
    findOne: jest.fn(),
})

describe('TopicPostsService', () => {
    let service: TopicPostsService
    let postRepo: ReturnType<typeof createMockRepo>
    let topicRepo: ReturnType<typeof createMockRepo>
    let usersService: jest.Mocked<UsersService>

    beforeEach(() => {
        postRepo = createMockRepo<TopicPost>()
        topicRepo = createMockRepo<Topic>()
        usersService = {
            findById: jest.fn(),
        } as unknown as jest.Mocked<UsersService>
        service = new TopicPostsService(
            postRepo as unknown as Repository<TopicPost>,
            topicRepo as unknown as Repository<Topic>,
            usersService,
        )
    })

    it('update rejects when not owner', async () => {
        topicRepo.findOne.mockResolvedValue({ id: 1, slug: 'dev' })
        postRepo.findOne.mockResolvedValue({ id: 1, author: { id: 2 } })

        await expect(service.update('dev', 1, 1, { title: 't' })).rejects.toBeInstanceOf(ForbiddenException)
    })

    it('findOne throws when topic missing', async () => {
        topicRepo.findOne.mockResolvedValue(null)

        await expect(service.findOne('dev', 1)).rejects.toBeInstanceOf(NotFoundException)
    })

    it('list returns items and meta', async () => {
        topicRepo.findOne.mockResolvedValue({ id: 1, slug: 'dev' })
        postRepo.findAndCount.mockResolvedValue([
            [
                {
                    id: 1,
                    title: 't',
                    topic: {
                        id: 1,
                        slug: 'dev',
                        name: 'Dev',
                        description: 'd',
                        creator: { id: 1, username: 'u', role: 1 },
                        createdAt: new Date('2024-01-01T00:00:00.000Z'),
                        updatedAt: new Date('2024-01-01T00:00:00.000Z'),
                    },
                    author: { id: 1, username: 'u', role: 1 },
                    createdAt: new Date('2024-01-01T00:00:00.000Z'),
                    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
                },
            ],
            1,
        ])

        const result = await service.list('dev', 1, 10)

        expect(result.meta.total).toBe(1)
        expect(result.items[0]).toEqual(expect.objectContaining({ id: 1 }))
    })

    it('create returns saved post', async () => {
        topicRepo.findOne.mockResolvedValue({ id: 1, slug: 'dev' })
        usersService.findById.mockResolvedValue({ id: 1 } as never)
        postRepo.create.mockReturnValue({ id: 1 })
        postRepo.save.mockResolvedValue({
            id: 1,
            title: 't',
            content: 'c',
            topic: {
                id: 1,
                slug: 'dev',
                name: 'Dev',
                description: 'd',
                creator: { id: 1, username: 'u', email: 'e@test.com', role: 1 },
                createdAt: new Date('2024-01-01T00:00:00.000Z'),
                updatedAt: new Date('2024-01-01T00:00:00.000Z'),
            },
            author: { id: 1, username: 'u', email: 'e@test.com', role: 1 },
            createdAt: new Date('2024-01-01T00:00:00.000Z'),
            updatedAt: new Date('2024-01-01T00:00:00.000Z'),
        })

        const result = await service.create('dev', 1, { title: 't', content: 'c' })

        expect(result).toEqual(expect.objectContaining({ id: 1, title: 't' }))
    })

    it('update returns updated post', async () => {
        topicRepo.findOne.mockResolvedValue({ id: 1, slug: 'dev' })
        postRepo.findOne.mockResolvedValue({
            id: 1,
            title: 't',
            content: 'c',
            author: { id: 1 },
            topic: {
                id: 1,
                slug: 'dev',
                name: 'Dev',
                description: 'd',
                creator: { id: 1, username: 'u', email: 'e@test.com', role: 1 },
                createdAt: new Date('2024-01-01T00:00:00.000Z'),
                updatedAt: new Date('2024-01-01T00:00:00.000Z'),
            },
            createdAt: new Date('2024-01-01T00:00:00.000Z'),
            updatedAt: new Date('2024-01-01T00:00:00.000Z'),
        })
        postRepo.save.mockResolvedValue({
            id: 1,
            title: 't2',
            content: 'c2',
            author: { id: 1, username: 'u', email: 'e@test.com', role: 1 },
            topic: {
                id: 1,
                slug: 'dev',
                name: 'Dev',
                description: 'd',
                creator: { id: 1, username: 'u', email: 'e@test.com', role: 1 },
                createdAt: new Date('2024-01-01T00:00:00.000Z'),
                updatedAt: new Date('2024-01-01T00:00:00.000Z'),
            },
            createdAt: new Date('2024-01-01T00:00:00.000Z'),
            updatedAt: new Date('2024-01-01T00:00:00.000Z'),
        })

        const result = await service.update('dev', 1, 1, { title: 't2', content: 'c2' })

        expect(result).toEqual(expect.objectContaining({ title: 't2', content: 'c2' }))
    })

    it('remove marks post deleted', async () => {
        topicRepo.findOne.mockResolvedValue({ id: 1, slug: 'dev' })
        const post = {
            id: 1,
            isDeleted: false,
            author: { id: 1 },
            topic: { id: 1 },
        }
        postRepo.findOne.mockResolvedValue(post)

        await service.remove('dev', 1, 1)

        expect(post.isDeleted).toBe(true)
        expect(postRepo.save).toHaveBeenCalledWith(post)
    })
})
