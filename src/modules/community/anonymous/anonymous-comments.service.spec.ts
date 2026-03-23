import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { AnonymousCommentsService } from './anonymous-comments.service'
import { AnonymousComment } from './anonymous-comment.entity'
import { AnonymousPost } from './anonymous-post.entity'

jest.mock('bcrypt', () => ({
    hash: jest.fn(),
    compare: jest.fn(),
}))

type MockRepo<T> = {
    create: jest.Mock
    save: jest.Mock
    findOne: jest.Mock
    createQueryBuilder: jest.Mock
}

const createMockRepo = <T>(): MockRepo<T> => ({
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
})

const createMockQueryBuilder = (result?: {
    one?: unknown
    manyAndCount?: [unknown[], number]
    rawMany?: unknown[]
}) => ({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    addOrderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    getOne: jest.fn().mockResolvedValue(result?.one ?? null),
    getManyAndCount: jest.fn().mockResolvedValue(result?.manyAndCount ?? [[], 0]),
    getRawMany: jest.fn().mockResolvedValue(result?.rawMany ?? []),
    getMany: jest.fn().mockResolvedValue([]),
})

describe('AnonymousCommentsService', () => {
    let service: AnonymousCommentsService
    let commentRepo: MockRepo<AnonymousComment>
    let postRepo: MockRepo<AnonymousPost>

    beforeEach(() => {
        commentRepo = createMockRepo<AnonymousComment>()
        postRepo = createMockRepo<AnonymousPost>()
        service = new AnonymousCommentsService(
            commentRepo as unknown as Repository<AnonymousComment>,
            postRepo as unknown as Repository<AnonymousPost>,
        )
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('create hashes password', async () => {
        postRepo.findOne.mockResolvedValue({ id: 1 })
        ;(bcrypt.hash as jest.Mock).mockResolvedValue('hash')
        commentRepo.create.mockReturnValue({ id: 1 })
        commentRepo.save.mockResolvedValue({ id: 1 })

        await service.create(1, { content: 'c', authorName: 'anon', password: 'p' }, '1.2.3.4')

        expect(bcrypt.hash).toHaveBeenCalledWith('p', 10)
    })

    it('update rejects invalid password', async () => {
        postRepo.findOne.mockResolvedValue({ id: 1 })
        const qb = createMockQueryBuilder({ one: { id: 1, passwordHash: 'hash' } })
        commentRepo.createQueryBuilder.mockReturnValue(qb)
        ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)

        await expect(service.update(1, 1, { password: 'bad' })).rejects.toBeInstanceOf(UnauthorizedException)
    })

    it('createReply throws when parent comment is missing', async () => {
        postRepo.findOne.mockResolvedValue({ id: 1 })
        commentRepo.findOne.mockResolvedValue(null)

        await expect(
            service.createReply(1, 10, { content: 'c', authorName: 'anon', password: 'p' }, '1.2.3.4'),
        ).rejects.toBeInstanceOf(NotFoundException)
    })

    it('createReply rejects nested replies', async () => {
        postRepo.findOne.mockResolvedValue({ id: 1 })
        commentRepo.findOne.mockResolvedValue({ id: 10, parentId: 1 })

        await expect(
            service.createReply(1, 10, { content: 'c', authorName: 'anon', password: 'p' }, '1.2.3.4'),
        ).rejects.toBeInstanceOf(BadRequestException)
    })

    it('list returns reply counts', async () => {
        postRepo.findOne.mockResolvedValue({ id: 1 })
        const listQb = createMockQueryBuilder({
            manyAndCount: [
                [
                    {
                        id: 1,
                        content: 'a',
                        isDeleted: false,
                        authorName: 'anon',
                        ipAddress: '1.2.3.4',
                        createdAt: new Date('2024-01-01T00:00:00.000Z'),
                        updatedAt: new Date('2024-01-01T00:00:00.000Z'),
                    },
                ],
                1,
            ],
        })
        const countQb = createMockQueryBuilder({ rawMany: [{ parentId: 1, count: '1' }] })
        commentRepo.createQueryBuilder.mockImplementationOnce(() => listQb).mockImplementationOnce(() => countQb)

        const result = await service.list(1, 1, 10)

        expect(result.items[0].replyCount).toBe(1)
        expect(result.items[0].author).toEqual({ authorName: 'anon', ipMasked: '1.2.*.*' })
    })

    it('listReplies returns nextCursor null when no more', async () => {
        postRepo.findOne.mockResolvedValue({ id: 1 })
        commentRepo.findOne.mockResolvedValueOnce({ id: 10 })
        const replyRow = {
            id: 1,
            content: 'r',
            authorName: 'anon',
            ipAddress: '1.2.3.4',
            createdAt: new Date('2024-01-01T00:00:00.000Z'),
            updatedAt: new Date('2024-01-01T00:00:00.000Z'),
        }
        const repliesQb = createMockQueryBuilder()
        repliesQb.getMany.mockResolvedValue([replyRow])
        commentRepo.createQueryBuilder.mockImplementationOnce(() => repliesQb)

        const result = await service.listReplies(1, 10, undefined, 10)

        expect(result.meta.nextCursor).toBeNull()
        expect(result.items).toHaveLength(1)
        expect(result.items[0].id).toBe(1)
    })

    it('update succeeds with correct password', async () => {
        postRepo.findOne.mockResolvedValue({ id: 1 })

        const qb = createMockQueryBuilder({ one: { id: 1, passwordHash: 'hash', content: 'c' } })
        commentRepo.createQueryBuilder.mockReturnValue(qb)
        ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)

        commentRepo.save.mockResolvedValue({ id: 1, content: 'c2' })

        const result = await service.update(1, 1, { password: 'p', content: 'c2' })
        expect(result).toEqual(expect.objectContaining({ id: 1, content: 'c2' }))
    })

    it('remove throws when missing', async () => {
        postRepo.findOne.mockResolvedValue({ id: 1 })
        const qb = createMockQueryBuilder({ one: null })
        commentRepo.createQueryBuilder.mockReturnValue(qb)

        await expect(service.remove(1, 1, { password: 'p' })).rejects.toBeInstanceOf(NotFoundException)
    })

    it('remove marks deleted on success', async () => {
        postRepo.findOne.mockResolvedValue({ id: 1 })
        const comment = { id: 1, passwordHash: 'hash', isDeleted: false, content: 'c' }
        const qb = createMockQueryBuilder({ one: comment })
        commentRepo.createQueryBuilder.mockReturnValue(qb)
        ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)

        await service.remove(1, 1, { password: 'p' })

        expect(comment.isDeleted).toBe(true)
        expect(comment.content).toBeNull()
    })

    it('remove rejects invalid password', async () => {
        postRepo.findOne.mockResolvedValue({ id: 1 })
        const qb = createMockQueryBuilder({ one: { id: 1, passwordHash: 'hash' } })
        commentRepo.createQueryBuilder.mockReturnValue(qb)
        ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)

        await expect(service.remove(1, 1, { password: 'bad' })).rejects.toBeInstanceOf(UnauthorizedException)
    })
})
