import { JwtOptionalAuthGuard } from './jwt-optional-auth.guard'

describe('JwtOptionalAuthGuard', () => {
    it('returns user when provided', () => {
        const guard = new JwtOptionalAuthGuard()
        expect(guard.handleRequest(null, { id: 1 })).toEqual({ id: 1 })
    })

    it('returns undefined when error or missing user', () => {
        const guard = new JwtOptionalAuthGuard()
        expect(guard.handleRequest(new Error('x'), { id: 1 })).toBeUndefined()
        expect(guard.handleRequest(null, null)).toBeUndefined()
    })
})
