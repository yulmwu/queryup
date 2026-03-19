import fs from 'node:fs'
import path from 'node:path'
import { GenericContainer, StartedTestContainer } from 'testcontainers'
import { PostgreSqlContainer } from '@testcontainers/postgresql'

const statePath = path.join(__dirname, 'containers-state.json')
const envPath = path.join(__dirname, 'test-env.json')

module.exports = async () => {
    const postgres = await new PostgreSqlContainer('postgres:16-alpine')
        .withDatabase('queryup_test')
        .withUsername('queryup')
        .withPassword('queryup')
        .start()

    const redis = await new GenericContainer('redis:7-alpine').withExposedPorts(6379).start()

    const env = {
        NODE_ENV: 'test',
        DATABASE_HOST: postgres.getHost(),
        DATABASE_PORT: String(postgres.getMappedPort(5432)),
        DATABASE_USERNAME: postgres.getUsername(),
        DATABASE_PASSWORD: postgres.getPassword(),
        DATABASE_NAME: postgres.getDatabase(),
        REDIS_HOST: redis.getHost(),
        REDIS_PORT: String(redis.getMappedPort(6379)),
        REDIS_DB: '0',
        JWT_SECRET: 'test-secret',
    }

    fs.writeFileSync(envPath, JSON.stringify(env))
    fs.writeFileSync(
        statePath,
        JSON.stringify({
            postgresId: postgres.getId(),
            redisId: redis.getId(),
        }),
    )
}
