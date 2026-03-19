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
})
