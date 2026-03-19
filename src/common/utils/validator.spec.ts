import { BadRequestException } from '@nestjs/common'
import { validateDirectoryName, validateFileName } from './validator'

describe('validator utils', () => {
    describe('validateDirectoryName', () => {
        it('accepts valid directory names', () => {
            expect(() => validateDirectoryName('projects')).not.toThrow()
            expect(() => validateDirectoryName('my-folder_01')).not.toThrow()
        })

        it('rejects empty or whitespace', () => {
            expect(() => validateDirectoryName('')).toThrow(BadRequestException)
            expect(() => validateDirectoryName('   ')).toThrow(BadRequestException)
        })

        it('rejects invalid characters and slashes', () => {
            expect(() => validateDirectoryName('a/b')).toThrow(BadRequestException)
            expect(() => validateDirectoryName('bad|name')).toThrow(BadRequestException)
        })

        it('rejects dot names and leading/trailing spaces or dots', () => {
            expect(() => validateDirectoryName('.')).toThrow(BadRequestException)
            expect(() => validateDirectoryName('..')).toThrow(BadRequestException)
            expect(() => validateDirectoryName(' bad')).toThrow(BadRequestException)
            expect(() => validateDirectoryName('bad ')).toThrow(BadRequestException)
            expect(() => validateDirectoryName('.bad')).toThrow(BadRequestException)
            expect(() => validateDirectoryName('bad.')).toThrow(BadRequestException)
        })

        it('rejects overly long names', () => {
            const longName = 'a'.repeat(256)
            expect(() => validateDirectoryName(longName)).toThrow(BadRequestException)
        })
    })

    describe('validateFileName', () => {
        it('accepts valid file names', () => {
            expect(() => validateFileName('file.txt')).not.toThrow()
            expect(() => validateFileName('image_01.png')).not.toThrow()
        })

        it('rejects empty or whitespace', () => {
            expect(() => validateFileName('')).toThrow(BadRequestException)
            expect(() => validateFileName('   ')).toThrow(BadRequestException)
        })

        it('rejects slashes and invalid characters', () => {
            expect(() => validateFileName('a/b')).toThrow(BadRequestException)
            expect(() => validateFileName('a\\b')).toThrow(BadRequestException)
            expect(() => validateFileName('bad|name')).toThrow(BadRequestException)
        })

        it('rejects dot names and leading ".."', () => {
            expect(() => validateFileName('.')).toThrow(BadRequestException)
            expect(() => validateFileName('..')).toThrow(BadRequestException)
            expect(() => validateFileName('..hidden')).toThrow(BadRequestException)
        })

        it('rejects overly long names', () => {
            const longName = 'a'.repeat(256)
            expect(() => validateFileName(longName)).toThrow(BadRequestException)
        })
    })
})
