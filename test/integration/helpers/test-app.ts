import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import cookieParser from 'cookie-parser'
import request from 'supertest'

import { ConfigModule } from '@nestjs/config'
import { RedisModule } from 'common/redis/redis.module'
import { AuthModule } from 'modules/auth/auth.module'
import { UsersModule } from 'modules/users/users.module'
import { CommunityModule } from 'modules/community/community.module'
import { TransformInterceptor } from 'common/interceptors/transform.interceptor'
import { TypeOrmExceptionFilter } from 'common/filters/typeorm-exception.filter'
import { AppController } from 'app.controller'

export const createTestApp = async () => {
    const moduleRef = await Test.createTestingModule({
        imports: [
            ConfigModule.forRoot({ isGlobal: true }),
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
            RedisModule,
            AuthModule,
            UsersModule,
            CommunityModule,
        ],
        controllers: [AppController],
    }).compile()

    const app = moduleRef.createNestApplication()
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
        }),
    )
    app.useGlobalInterceptors(new TransformInterceptor())
    app.useGlobalFilters(new TypeOrmExceptionFilter())
    app.use(cookieParser())
    await app.init()

    const agent = request.agent(app.getHttpServer())

    return { app, agent }
}

type RegisterPayload = {
    username: string
    password: string
    email: string
    studentNumber: string
    department: number
}

export const buildRegisterPayload = (seed: string): RegisterPayload => ({
    username: `user_${seed}`,
    password: 'p@ssw0rd',
    email: `user_${seed}@test.com`,
    studentNumber: '30201',
    department: 1,
})

export const registerAndLogin = async (agent: request.SuperAgentTest, seed: string) => {
    const payload = buildRegisterPayload(seed)
    const registerRes = await agent.post('/auth/register').send(payload)
    const loginRes = await agent.post('/auth/login').send({ username: payload.username, password: payload.password })

    return {
        payload,
        userId: registerRes.body?.id,
        accessToken: loginRes.body?.accessToken,
    }
}
