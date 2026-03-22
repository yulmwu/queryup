import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common'
import { Repository } from 'typeorm'
import { UsersService } from 'modules/users/users.service'
import { TopicPostCommentsService } from './topic-post-comments.service'
import { TopicPostComment } from './topic-post-comment.entity'
import { TopicPost } from './topic-post.entity'
import { Topic } from '../topics/topic.entity'

const createMockRepo = <T>() => ({
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
})

const createMockQueryBuilder = (result?: { manyAndCount?: [unknown[], number]; rawMany?: unknown[] }) => ({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    addOrderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue(result?.manyAndCount ?? [[], 0]),
    getRawMany: jest.fn().mockResolvedValue(result?.rawMany ?? []),
    getMany: jest.fn().mockResolvedValue([]),
})

describe('TopicPostCommentsService', () => {
    let service: TopicPostCommentsService
    let commentRepo: ReturnType<typeof createMockRepo>
    let postRepo: ReturnType<typeof createMockRepo>
    let topicRepo: ReturnType<typeof createMockRepo>
    let usersService: jest.Mocked<UsersService>

    beforeEach(() => {
        commentRepo = createMockRepo<TopicPostComment>()
        postRepo = createMockRepo<TopicPost>()
        topicRepo = createMockRepo<Topic>()
        usersService = { findById: jest.fn() } as unknown as jest.Mocked<UsersService>

        service = new TopicPostCommentsService(
            commentRepo as unknown as Repository<TopicPostComment>,
            postRepo as unknown as Repository<TopicPost>,
            topicRepo as unknown as Repository<Topic>,
            usersService,
        )
    })

    it('create throws when topic missing', async () => {
        topicRepo.findOne.mockResolvedValue(null)

        await expect(service.create('slug', 1, 1, { content: 'c' })).rejects.toBeInstanceOf(NotFoundException)
    })

    it('createReply rejects nested replies', async () => {
        topicRepo.findOne.mockResolvedValue({ id: 1 })
        postRepo.findOne.mockResolvedValue({ id: 2 })
        commentRepo.findOne.mockResolvedValue({ id: 3, parentId: 1 })

        await expect(service.createReply('slug', 2, 3, 1, { content: 'c' })).rejects.toBeInstanceOf(BadRequestException)
    })

    it('list returns reply counts', async () => {
        topicRepo.findOne.mockResolvedValue({ id: 1 })
        postRepo.findOne.mockResolvedValue({ id: 2 })
        const listQb = createMockQueryBuilder({
            manyAndCount: [
                [
                    {
                        id: 1,
                        content: 'a',
                        isDeleted: false,
                        author: { id: 1, username: 'u', role: 1 },
                        createdAt: new Date('2024-01-01T00:00:00.000Z'),
                        updatedAt: new Date('2024-01-01T00:00:00.000Z'),
                    },
                ],
                1,
            ],
        })

        const countQb = createMockQueryBuilder({ rawMany: [{ parentId: 1, count: '1' }] })
        commentRepo.createQueryBuilder.mockImplementationOnce(() => listQb).mockImplementationOnce(() => countQb)

        const result = await service.list('slug', 2, 1, 10)
        expect(result.items[0].replyCount).toBe(1)
    })

    it('update rejects when not owner', async () => {
        topicRepo.findOne.mockResolvedValue({ id: 1 })
        postRepo.findOne.mockResolvedValue({ id: 2 })
        commentRepo.findOne.mockResolvedValue({ id: 1, author: { id: 2 } })

        await expect(service.update('slug', 2, 1, 1, { content: 'c' })).rejects.toBeInstanceOf(ForbiddenException)
    })

    it('listReplies throws when cursor missing', async () => {
        topicRepo.findOne.mockResolvedValue({ id: 1 })
        postRepo.findOne.mockResolvedValue({ id: 2 })
        commentRepo.findOne.mockResolvedValueOnce({ id: 10 }).mockResolvedValueOnce(null)

        await expect(service.listReplies('slug', 2, 10, 999, 10)).rejects.toBeInstanceOf(NotFoundException)
    })
})
