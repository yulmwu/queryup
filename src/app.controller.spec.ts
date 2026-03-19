import { AppController } from './app.controller'

describe('AppController', () => {
    it('returns health status payload', () => {
        const now = new Date('2026-03-18T12:00:00.000Z')
        jest.useFakeTimers().setSystemTime(now)
        const controller = new AppController()

        const result = controller.health()

        expect(result.status).toBe('OK')
        expect(result.timestamp).toBe(now.toISOString())
        expect(result.environment).toBe(process.env.NODE_ENV || 'development')

        jest.useRealTimers()
    })
})
