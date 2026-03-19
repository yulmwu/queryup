import { setupSwagger } from './setupSwagger'
import { INestApplication } from '@nestjs/common'

const createDocument = jest.fn()
const setup = jest.fn()
const builder = {
    setTitle: jest.fn().mockReturnThis(),
    setDescription: jest.fn().mockReturnThis(),
    setVersion: jest.fn().mockReturnThis(),
    addBearerAuth: jest.fn().mockReturnThis(),
    build: jest.fn().mockReturnValue({ built: true }),
}

jest.mock('@nestjs/swagger', () => ({
    SwaggerModule: {
        createDocument: (...args: unknown[]) => createDocument(...args),
        setup: (...args: unknown[]) => setup(...args),
    },
    DocumentBuilder: jest.fn(() => builder),
}))

describe('setupSwagger', () => {
    it('builds and registers swagger docs', () => {
        const app = {} as INestApplication
        createDocument.mockReturnValue({ doc: true })

        setupSwagger(app)

        expect(createDocument).toHaveBeenCalledWith(app, { built: true })
        expect(setup).toHaveBeenCalledWith('api-docs', app, { doc: true })
    })
})
