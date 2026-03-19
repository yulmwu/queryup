import { Test } from '@nestjs/testing'
import { ConfigModule } from '@nestjs/config'

import { RedisModule } from 'common/redis/redis.module'
import { RedisService } from 'common/redis/redis.service'
import { ensureTestcontainersEnv } from './testcontainers-env'

describe('RedisService (integration)', () => {
    let service: RedisService
    let stopContainers: () => Promise<void>

    beforeAll(async () => {
        stopContainers = await ensureTestcontainersEnv()
        const moduleRef = await Test.createTestingModule({
            imports: [ConfigModule.forRoot({ isGlobal: true }), RedisModule],
        }).compile()

        service = moduleRef.get(RedisService)
    })

    afterAll(async () => {
        await service.delPattern('test:*')
        service.onModuleDestroy()
        await stopContainers()
    })

    it('sets and gets a value', async () => {
        await service.set('test:key', 'value', 10)
        await expect(service.get('test:key')).resolves.toBe('value')
    })
})
