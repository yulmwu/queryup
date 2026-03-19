import { Test } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'

import { UsersModule } from 'modules/users/users.module'
import { UsersService } from 'modules/users/users.service'
import { User } from 'modules/users/users.entity'
import { ensureTestcontainersEnv } from './testcontainers-env'

jest.setTimeout(30000)

describe('UsersService (integration)', () => {
    let dataSource: DataSource
    let service: UsersService
    let stopContainers: () => Promise<void>

    beforeAll(async () => {
        stopContainers = await ensureTestcontainersEnv()
        const moduleRef = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: 'postgres',
                    host: process.env.DATABASE_HOST,
                    port: Number(process.env.DATABASE_PORT),
                    username: process.env.DATABASE_USERNAME,
                    password: process.env.DATABASE_PASSWORD,
                    database: process.env.DATABASE_NAME,
                    autoLoadEntities: true,
                    synchronize: true,
                    dropSchema: true,
                    retryAttempts: 5,
                    retryDelay: 2000,
                }),
                UsersModule,
            ],
        }).compile()

        dataSource = moduleRef.get(DataSource)
        service = moduleRef.get(UsersService)
    })

    afterAll(async () => {
        await dataSource.destroy()
        await stopContainers()
    })

    beforeEach(async () => {
        await dataSource.getRepository(User).clear()
    })

    it('creates and reads a user', async () => {
        const created = await service.create({
            username: 'u1',
            password: 'p',
            email: 'u1@test.com',
            studentNumber: '30201',
            department: 1,
        })
        const found = await service.findById(created.id)

        expect(found.username).toBe('u1')
        expect(found.email).toBe('u1@test.com')
    })

    it('updates nickname and description', async () => {
        const created = await service.create({
            username: 'u2',
            password: 'p',
            email: 'u2@test.com',
            studentNumber: '30202',
            department: 2,
        })
        const updated = await service.update(created.id, { nickname: 'nick', description: 'desc' })

        expect(updated.nickname).toBe('nick')
        expect(updated.description).toBe('desc')
    })
})
