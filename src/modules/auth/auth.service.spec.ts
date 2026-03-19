import { UnauthorizedException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

jest.mock('bcrypt', () => ({
    hash: jest.fn(),
    compare: jest.fn(),
}))

import { AuthService } from './auth.service'
import { UsersService } from 'modules/users/users.service'
import { JwtService } from '@nestjs/jwt'
import { RedisService } from 'common/redis/redis.service'

describe('AuthService', () => {
    let service: AuthService
    let usersService: jest.Mocked<UsersService>
    let jwtService: jest.Mocked<JwtService>
    let redisService: jest.Mocked<RedisService>

    beforeEach(() => {
        usersService = {
            getPasswordByUsername: jest.fn(),
            create: jest.fn(),
            findById: jest.fn(),
        } as unknown as jest.Mocked<UsersService>

        jwtService = {
            sign: jest.fn(),
        } as unknown as jest.Mocked<JwtService>

        redisService = {
            set: jest.fn(),
            get: jest.fn(),
            del: jest.fn(),
        } as unknown as jest.Mocked<RedisService>

        service = new AuthService(usersService, jwtService, redisService)
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('login throws when password mismatch', async () => {
        usersService.getPasswordByUsername.mockResolvedValue({ id: 1, password: 'hash' } as never)
        ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)

        await expect(service.login({ username: 'u', password: 'p' })).rejects.toBeInstanceOf(UnauthorizedException)
    })

    it('login returns tokens and stores refresh', async () => {
        usersService.getPasswordByUsername.mockResolvedValue({ id: 1, password: 'hash' } as never)
        ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)
        jwtService.sign.mockReturnValueOnce('access-token' as never).mockReturnValueOnce('refresh-token' as never)

        const result = await service.login({ username: 'u', password: 'p' })

        expect(jwtService.sign).toHaveBeenCalledTimes(2)
        expect(redisService.set).toHaveBeenCalled()
        expect(result).toEqual(
            expect.objectContaining({
                access_token: 'access-token',
                refresh_token: 'refresh-token',
                user_id: 1,
            }),
        )
    })

    it('register delegates to UsersService', async () => {
        usersService.create.mockResolvedValue({ id: 1 } as never)
        const result = await service.register({ username: 'u', password: 'p', email: 'e' })

        expect(usersService.create).toHaveBeenCalled()
        expect(result).toEqual({ id: 1 })
    })

    it('refresh rejects invalid refresh token', async () => {
        redisService.get.mockResolvedValue(null as never)
        await expect(service.refresh(1, 'bad')).rejects.toBeInstanceOf(UnauthorizedException)
    })

    it('refresh returns new access token when valid', async () => {
        redisService.get.mockResolvedValue('ok' as never)
        jwtService.sign.mockReturnValue('new-token' as never)

        const result = await service.refresh(1, 'ok')
        expect(result).toEqual({ accessToken: 'new-token' })
    })

    it('logout removes refresh token', async () => {
        await service.logout(1)
        expect(redisService.del).toHaveBeenCalledWith('user:1:refresh')
    })

    it('getMe returns user', async () => {
        usersService.findById.mockResolvedValue({ id: 1 } as never)
        const result = await service.getMe(1)
        expect(result).toEqual({ id: 1 })
    })
})
