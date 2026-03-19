import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'

jest.mock('bcrypt', () => ({
    hash: jest.fn(),
    compare: jest.fn(),
}))

import { UsersService } from './users.service'
import { User } from './users.entity'

type MockRepo<T> = {
    create: jest.Mock
    save: jest.Mock
    findOne: jest.Mock
    createQueryBuilder: jest.Mock
    increment: jest.Mock
    decrement: jest.Mock
}

const createMockRepo = <T>(): MockRepo<T> => ({
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
    increment: jest.fn(),
    decrement: jest.fn(),
})

describe('UsersService', () => {
    let service: UsersService
    let repo: MockRepo<User>

    beforeEach(() => {
        repo = createMockRepo<User>()
        service = new UsersService(repo as unknown as Repository<User>)
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('creates a user with hashed password', async () => {
        ;(bcrypt.hash as jest.Mock).mockResolvedValue('hashed')
        repo.create.mockReturnValue({ id: 1, username: 'u1' })
        repo.save.mockResolvedValue({ id: 1, username: 'u1' })

        const result = await service.create({ username: 'u1', password: 'p', email: 'e' })

        expect(bcrypt.hash).toHaveBeenCalledWith('p', 10)
        expect(repo.create).toHaveBeenCalled()
        expect(repo.save).toHaveBeenCalled()
        expect(result).toEqual({ id: 1, username: 'u1' })
    })

    it('findByUsername throws when user not found', async () => {
        const qb = {
            where: jest.fn().mockReturnThis(),
            getRawAndEntities: jest.fn().mockResolvedValue({ raw: [], entities: [] }),
        }
        repo.createQueryBuilder.mockReturnValue(qb)

        await expect(service.findByUsername('missing')).rejects.toBeInstanceOf(NotFoundException)
    })

    it('findById throws when user not found', async () => {
        repo.findOne.mockResolvedValue(null)
        await expect(service.findById(1)).rejects.toBeInstanceOf(NotFoundException)
    })

    it('getPasswordByUsername throws when user not found', async () => {
        const qb = {
            where: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            getOne: jest.fn().mockResolvedValue(null),
        }
        repo.createQueryBuilder.mockReturnValue(qb)

        await expect(service.getPasswordByUsername('missing')).rejects.toBeInstanceOf(NotFoundException)
    })

    it('update rejects when userId mismatch', async () => {
        jest.spyOn(service, 'findByUsername').mockResolvedValue({ id: 2 } as User)
        await expect(service.update('u1', { nickname: 'n' }, 1)).rejects.toBeInstanceOf(ForbiddenException)
    })

    it('update trims and saves fields', async () => {
        const user = { id: 1, nickname: 'old', description: 'old' } as User
        jest.spyOn(service, 'findByUsername').mockResolvedValue(user)
        repo.save.mockResolvedValue({ ...user, nickname: null, description: null })

        const result = await service.update('u1', { nickname: '   ', description: '  ' }, 1)

        expect(repo.save).toHaveBeenCalled()
        expect(result).toEqual({ ...user, nickname: null, description: null })
    })
})
