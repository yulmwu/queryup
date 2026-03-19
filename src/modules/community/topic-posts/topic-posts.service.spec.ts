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
})
