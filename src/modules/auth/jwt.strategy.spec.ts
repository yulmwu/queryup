import { JwtStrategy } from './jwt.strategy'

describe('JwtStrategy', () => {
    it('validates payload', async () => {
        process.env.JWT_SECRET = 'test-secret'
        const strategy = new JwtStrategy()
        await expect(strategy.validate({ sub: 42 })).resolves.toEqual({ userId: 42 })
    })
})
