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
})
