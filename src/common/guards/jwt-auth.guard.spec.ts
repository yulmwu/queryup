import { JwtAuthGuard } from './jwt-auth.guard'

describe('JwtAuthGuard', () => {
    it('can be instantiated', () => {
        const guard = new JwtAuthGuard()
        expect(guard).toBeDefined()
    })
})
