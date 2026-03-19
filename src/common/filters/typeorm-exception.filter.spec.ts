import { TypeOrmExceptionFilter } from './typeorm-exception.filter'
import { ArgumentsHost } from '@nestjs/common'

describe('TypeOrmExceptionFilter', () => {
    const makeHost = () => {
        const json = jest.fn()
        const status = jest.fn().mockReturnValue({ json })
        const response = { status }
        const host = {
            switchToHttp: () => ({
                getResponse: () => response,
            }),
        } as ArgumentsHost
        return { host, status, json }
    }

    it('maps duplicate error to 409', () => {
        const originalEnv = process.env.NODE_ENV
        process.env.NODE_ENV = 'test'

        const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
        const filter = new TypeOrmExceptionFilter()
        const { host, status, json } = makeHost()

        filter.catch({ code: '23505', detail: 'dup' } as never, host)

        expect(status).toHaveBeenCalledWith(409)
        expect(json).toHaveBeenCalledWith(
            expect.objectContaining({
                statusCode: 409,
                error: 'Conflict',
            }),
        )
        errorSpy.mockRestore()
        process.env.NODE_ENV = originalEnv
    })

    it('maps unknown code to 500', () => {
        const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
        const filter = new TypeOrmExceptionFilter()
        const { host, status, json } = makeHost()

        filter.catch({ code: '99999', detail: 'err' } as never, host)

        expect(status).toHaveBeenCalledWith(500)
        expect(json).toHaveBeenCalledWith(
            expect.objectContaining({
                statusCode: 500,
                error: 'InternalServerError',
            }),
        )
        errorSpy.mockRestore()
    })

    it('maps foreign key error to 404', () => {
        const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
        const filter = new TypeOrmExceptionFilter()
        const { host, status, json } = makeHost()

        filter.catch({ code: '23503', detail: 'fk' } as never, host)

        expect(status).toHaveBeenCalledWith(404)
        expect(json).toHaveBeenCalledWith(
            expect.objectContaining({
                statusCode: 404,
                error: 'NotFound',
            }),
        )
        errorSpy.mockRestore()
    })

    it('maps not-null error to 400', () => {
        const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
        const filter = new TypeOrmExceptionFilter()
        const { host, status, json } = makeHost()

        filter.catch({ code: '23502', detail: 'nn' } as never, host)

        expect(status).toHaveBeenCalledWith(400)
        expect(json).toHaveBeenCalledWith(
            expect.objectContaining({
                statusCode: 400,
                error: 'BadRequest',
            }),
        )
        errorSpy.mockRestore()
    })

    it('maps data too long to 400', () => {
        const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
        const filter = new TypeOrmExceptionFilter()
        const { host, status, json } = makeHost()

        filter.catch({ code: '22001', detail: 'long' } as never, host)

        expect(status).toHaveBeenCalledWith(400)
        expect(json).toHaveBeenCalledWith(
            expect.objectContaining({
                statusCode: 400,
                error: 'BadRequest',
            }),
        )
        errorSpy.mockRestore()
    })

    it('does not log error in production', () => {
        const originalEnv = process.env.NODE_ENV
        process.env.NODE_ENV = 'production'
        const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
        const filter = new TypeOrmExceptionFilter()
        const { host } = makeHost()

        filter.catch({ code: '23505', detail: 'dup' } as never, host)

        expect(errorSpy).not.toHaveBeenCalled()
        errorSpy.mockRestore()
        process.env.NODE_ENV = originalEnv
    })
})
