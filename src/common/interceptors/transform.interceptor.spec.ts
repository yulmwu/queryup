import { TransformInterceptor } from './transform.interceptor'
import { CallHandler, StreamableFile } from '@nestjs/common'
import { of } from 'rxjs'

describe('TransformInterceptor', () => {
    it('passes through StreamableFile', (done) => {
        const interceptor = new TransformInterceptor()
        const file = new StreamableFile(Buffer.from('abc'))
        const next: CallHandler = { handle: () => of(file) }

        interceptor.intercept({} as never, next).subscribe((value) => {
            expect(value).toBe(file)
            done()
        })
    })

    it('transforms plain objects', (done) => {
        const interceptor = new TransformInterceptor()
        const next: CallHandler = { handle: () => of({ id: 1 }) }

        interceptor.intercept({} as never, next).subscribe((value) => {
            expect(value).toEqual({ id: 1 })
            done()
        })
    })
})
