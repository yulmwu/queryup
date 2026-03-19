import { NotFoundException } from '@nestjs/common'
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

        const result = await service.create({
            username: 'u1',
            password: 'p',
            email: 'e',
            studentNumber: '30201',
            department: 1,
        })

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

    it('findByUsername returns user when found', async () => {
        const qb = {
            where: jest.fn().mockReturnThis(),
            getRawAndEntities: jest.fn().mockResolvedValue({
                raw: [{}],
                entities: [
                    {
                        id: 1,
                        username: 'u1',
                        studentNumber: '30201',
                        department: 1,
                        status: 1,
                        isVerified: false,
                    },
                ],
            }),
        }
        repo.createQueryBuilder.mockReturnValue(qb)

        const result = await service.findByUsername('u1')

        expect(result).toEqual(
            expect.objectContaining({
                id: 1,
                username: 'u1',
            }),
        )
    })

    it('findById throws when user not found', async () => {
        repo.findOne.mockResolvedValue(null)
        await expect(service.findById(1)).rejects.toBeInstanceOf(NotFoundException)
    })

    it('findById returns user when found', async () => {
        repo.findOne.mockResolvedValue({
            id: 1,
            username: 'u1',
            studentNumber: '30201',
            department: 1,
            status: 1,
            isVerified: false,
        })

        const result = await service.findById(1)

        expect(result).toEqual(
            expect.objectContaining({
                id: 1,
                username: 'u1',
            }),
        )
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

    it('getPasswordByUsername returns user with password', async () => {
        const qb = {
            where: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            getOne: jest.fn().mockResolvedValue({ id: 1, password: 'hash' }),
        }
        repo.createQueryBuilder.mockReturnValue(qb)

        const result = await service.getPasswordByUsername('u1')

        expect(result).toEqual({ id: 1, password: 'hash' })
    })

    it('update trims and saves fields', async () => {
        const user = {
            id: 1,
            nickname: 'old',
            description: 'old',
            club: 'old-club',
            studentNumber: '30201',
            department: 1,
            status: 1,
            isVerified: false,
        } as User
        jest.spyOn(service, 'findById').mockResolvedValue(user)
        repo.save.mockResolvedValue({ ...user, nickname: null, description: null, club: null })

        const result = await service.update(1, { nickname: '   ', description: '  ', club: '  ' })

        expect(repo.save).toHaveBeenCalled()
        expect(result).toEqual({ ...user, nickname: null, description: null, club: null })
    })

    it('update applies profile metadata fields', async () => {
        const user = {
            id: 1,
            studentNumber: '10101',
            department: 1,
            status: 1,
            club: 'old',
            isVerified: false,
        } as User
        jest.spyOn(service, 'findById').mockResolvedValue(user)
        repo.save.mockResolvedValue({
            ...user,
            studentNumber: '30201',
            department: 3,
            club: 'robot',
        })

        const result = await service.update(1, {
            studentNumber: '30201',
            department: 3,
            club: 'robot',
        })

        expect(repo.save).toHaveBeenCalledWith(
            expect.objectContaining({
                studentNumber: '30201',
                department: 3,
                club: 'robot',
            }),
        )

        expect(result).toEqual({
            ...user,
            studentNumber: '30201',
            department: 3,
            club: 'robot',
        })
    })

    it('increment/decrement delegates to repository', async () => {
        await service.increment(1, 'id', 3)
        await service.decrement(1, 'id', 2)

        expect(repo.increment).toHaveBeenCalledWith({ id: 1 }, 'id', 3)
        expect(repo.decrement).toHaveBeenCalledWith({ id: 1 }, 'id', 2)
    })
})
