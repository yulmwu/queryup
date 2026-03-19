import { UnauthorizedException, NotFoundException } from '@nestjs/common'
import { AnonymousPostsService } from './anonymous-posts.service'
import { AnonymousPost } from './anonymous-post.entity'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'

jest.mock('bcrypt', () => ({
    hash: jest.fn(),
    compare: jest.fn(),
}))

type MockRepo<T> = {
    create: jest.Mock
    save: jest.Mock
    findAndCount: jest.Mock
    findOne: jest.Mock
    createQueryBuilder: jest.Mock
}

const createMockRepo = <T>(): MockRepo<T> => ({
    create: jest.fn(),
    save: jest.fn(),
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
})

describe('AnonymousPostsService', () => {
    let service: AnonymousPostsService
    let repo: MockRepo<AnonymousPost>

    beforeEach(() => {
        repo = createMockRepo<AnonymousPost>()
        service = new AnonymousPostsService(repo as unknown as Repository<AnonymousPost>)
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('create hashes password and returns masked ip', async () => {
        ;(bcrypt.hash as jest.Mock).mockResolvedValue('hash')
        repo.create.mockReturnValue({ id: 1 })
        repo.save.mockResolvedValue({
            id: 1,
            title: 't',
            content: 'c',
            authorName: 'anon',
            ipAddress: '123.456.78.90',
            createdAt: new Date('2024-01-01T00:00:00.000Z'),
            updatedAt: new Date('2024-01-01T00:00:00.000Z'),
        })

        const result = await service.create(
            { title: 't', content: 'c', authorName: 'anon', password: 'p' },
            '123.456.78.90',
        )

        expect(bcrypt.hash).toHaveBeenCalledWith('p', 10)
        expect(result.ipMasked).toBe('123.456.*.*')
    })

    it('update rejects invalid password', async () => {
        const qb = {
            addSelect: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            getOne: jest.fn().mockResolvedValue({
                id: 1,
                passwordHash: 'hash',
                title: 't',
                content: 'c',
                authorName: 'anon',
                ipAddress: '1.2.3.4',
            }),
        }
        repo.createQueryBuilder.mockReturnValue(qb)
        ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)

        await expect(service.update(1, { password: 'bad' })).rejects.toBeInstanceOf(UnauthorizedException)
    })

    it('remove rejects when post missing', async () => {
        const qb = {
            addSelect: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            getOne: jest.fn().mockResolvedValue(null),
        }
        repo.createQueryBuilder.mockReturnValue(qb)

        await expect(service.remove(1, { password: 'p' })).rejects.toBeInstanceOf(NotFoundException)
    })
})
