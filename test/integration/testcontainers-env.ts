import { GenericContainer, StartedTestContainer } from 'testcontainers'
import { PostgreSqlContainer } from '@testcontainers/postgresql'

type Started = {
    postgres: StartedTestContainer
    redis: StartedTestContainer
}

const hasEnv = () =>
    Boolean(
        process.env.DATABASE_HOST &&
            process.env.DATABASE_PORT &&
            process.env.DATABASE_USERNAME &&
            process.env.DATABASE_PASSWORD &&
            process.env.DATABASE_NAME &&
            process.env.REDIS_HOST &&
            process.env.REDIS_PORT,
    )

export const ensureTestcontainersEnv = async () => {
    if (hasEnv()) {
        return async () => {}
    }

    const username = 'queryup'
    const password = 'queryup'
    const database = 'queryup_test'

    const started: Started = {
        postgres: await new PostgreSqlContainer('postgres:16-alpine')
            .withDatabase(database)
            .withUsername(username)
            .withPassword(password)
            .start(),
        redis: await new GenericContainer('redis:7-alpine').withExposedPorts(6379).start(),
    }

    process.env.NODE_ENV = 'test'
    process.env.DATABASE_HOST = started.postgres.getHost()
    process.env.DATABASE_PORT = String(started.postgres.getMappedPort(5432))
    process.env.DATABASE_USERNAME = username
    process.env.DATABASE_PASSWORD = password
    process.env.DATABASE_NAME = database
    process.env.REDIS_HOST = started.redis.getHost()
    process.env.REDIS_PORT = String(started.redis.getMappedPort(6379))
    process.env.REDIS_DB = '0'
    process.env.JWT_SECRET = 'test-secret'

    return async () => {
        await started.postgres.stop()
        await started.redis.stop()
    }
}
