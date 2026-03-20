import {
    maskIp,
    normalizePage,
    normalizeSize,
    toTopicBrief,
    toTopicDetail,
    toUserBrief,
    toUserDetail,
} from './community.utils'

describe('community.utils', () => {
    it('normalizes page and size', () => {
        expect(normalizePage(undefined)).toBe(1)
        expect(normalizePage(0)).toBe(1)
        expect(normalizePage(2)).toBe(2)

        expect(normalizeSize(undefined)).toBe(20)
        expect(normalizeSize(0)).toBe(20)
        expect(normalizeSize(60)).toBe(50)
        expect(normalizeSize(10)).toBe(10)
    })

    it('masks ip', () => {
        expect(maskIp('123.456.78.90')).toBe('123.456.*.*')
        expect(maskIp('::1')).toBe('masked')
        expect(maskIp('1')).toBe('masked')
        expect(maskIp(undefined)).toBe('0.0.*.*')
    })

    it('maps user and topic shapes', () => {
        const user = {
            id: 1,
            username: 'u',
            nickname: 'n',
            email: 'e@test.com',
            description: 'd',
            profileImage: 'p',
            studentNumber: '30201',
            department: 1,
            status: 1,
            club: 'c',
            isVerified: false,
            createdAt: new Date('2024-01-01T00:00:00.000Z'),
            role: 1,
        }
        const brief = toUserBrief(user)
        const detail = toUserDetail(user)

        expect(brief).toEqual(
            expect.objectContaining({
                id: 1,
                username: 'u',
                role: 1,
            }),
        )

        expect(detail).toEqual(
            expect.objectContaining({
                email: 'e@test.com',
                studentNumber: '30201',
            }),
        )

        const topic = {
            id: 1,
            slug: 'dev',
            name: 'Dev',
            description: 'desc',
            creator: user,
            createdAt: new Date('2024-01-01T00:00:00.000Z'),
            updatedAt: new Date('2024-01-02T00:00:00.000Z'),
        }

        expect(toTopicBrief(topic)).toEqual(
            expect.objectContaining({
                slug: 'dev',
                creator: expect.objectContaining({ username: 'u' }),
            }),
        )

        expect(toTopicDetail(topic)).toEqual(
            expect.objectContaining({
                creator: expect.objectContaining({ email: 'e@test.com' }),
            }),
        )
    })
})
