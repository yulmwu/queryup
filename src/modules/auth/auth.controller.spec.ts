import { BadRequestException, UnauthorizedException } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtService } from '@nestjs/jwt'

describe('AuthController', () => {
    let controller: AuthController
    let authService: jest.Mocked<AuthService>
    let jwtService: jest.Mocked<JwtService>

    beforeEach(() => {
        authService = {
            login: jest.fn(),
            register: jest.fn(),
            refresh: jest.fn(),
            logout: jest.fn(),
            getMe: jest.fn(),
        } as unknown as jest.Mocked<AuthService>
        jwtService = {
            decode: jest.fn(),
        } as unknown as jest.Mocked<JwtService>
        controller = new AuthController(authService, jwtService)
    })

    it('login sets refresh cookie and returns access token info', async () => {
        authService.login.mockResolvedValue({
            refresh_token: 'rt',
            access_token: 'at',
            user_id: 1,
            max_age: 3600,
        } as never)
        const res = { cookie: jest.fn() } as any

        const result = await controller.login({ username: 'u', password: 'p' }, res)

        expect(res.cookie).toHaveBeenCalled()
        expect(result).toEqual({ id: 1, accessToken: 'at', maxAgeSeconds: 3600 })
    })

    it('register delegates to AuthService', async () => {
        authService.register.mockResolvedValue({ id: 1 } as never)
        const result = await controller.register({ username: 'u', password: 'p', email: 'e' })
        expect(result).toEqual({ id: 1 })
    })

    it('refresh requires refresh token', async () => {
        const req = { cookies: {} } as any
        await expect(controller.refresh(req)).rejects.toBeInstanceOf(BadRequestException)
    })

    it('refresh returns new access token', async () => {
        const req = { cookies: { refresh_token: 'rt' } } as any
        jwtService.decode.mockReturnValue({ sub: 1 } as never)
        authService.refresh.mockResolvedValue({ accessToken: 'new' } as never)

        const result = await controller.refresh(req)

        expect(result).toEqual({ accessToken: 'new' })
    })

    it('logout clears refresh cookie', async () => {
        const req = { cookies: { refresh_token: 'rt' } } as any
        const res = { clearCookie: jest.fn() } as any
        jwtService.decode.mockReturnValue({ sub: 1 } as never)

        await controller.logout(req, res)

        expect(authService.logout).toHaveBeenCalledWith(1)
        expect(res.clearCookie).toHaveBeenCalledWith('refresh_token')
    })

    it('getMe requires refresh token', async () => {
        const req = { cookies: {} } as any
        await expect(controller.getMe(req)).rejects.toBeInstanceOf(BadRequestException)
    })

    it('getMe returns user info', async () => {
        const req = { cookies: { refresh_token: 'rt' }, user: { userId: 1 } } as any
        authService.getMe.mockResolvedValue({ id: 1 } as never)
        const result = await controller.getMe(req)
        expect(result).toEqual({ id: 1 })
    })

    it('throws unauthorized when refresh token is invalid', async () => {
        const req = { cookies: { refresh_token: 'rt' } } as any
        jwtService.decode.mockImplementation(() => {
            throw new Error('bad')
        })

        await expect(controller.refresh(req)).rejects.toBeInstanceOf(UnauthorizedException)
    })
})
