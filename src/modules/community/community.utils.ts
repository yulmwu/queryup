export const normalizePage = (page?: number) => {
    if (!page || page < 1) return 1

    return page
}

export const normalizeSize = (size?: number) => {
    if (!size || size < 1) return 20
    if (size > 50) return 50

    return size
}

export const maskIp = (ip?: string) => {
    if (!ip) return '0.0.*.*'
    if (ip.includes(':')) return 'masked'

    const parts = ip.split('.')
    if (parts.length < 2) return 'masked'

    return `${parts[0]}.${parts[1]}.*.*`
}

export const toUserBrief = (user: {
    id: number
    username: string
    nickname?: string
    description?: string
    profileImage?: string
    role: number
}) => ({
    id: user.id,
    username: user.username,
    nickname: user.nickname,
    description: user.description,
    profileImage: user.profileImage,
    role: user.role,
})

export const toUserDetail = (user: {
    id: number
    username: string
    nickname?: string
    email: string
    description?: string
    profileImage?: string
    studentNumber: string
    department: number
    status: number
    club?: string
    isVerified: boolean
    createdAt: Date
    role: number
}) => ({
    id: user.id,
    username: user.username,
    nickname: user.nickname,
    email: user.email,
    description: user.description,
    profileImage: user.profileImage,
    studentNumber: user.studentNumber,
    department: user.department,
    status: user.status,
    club: user.club,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
    role: user.role,
})

export const toTopicBrief = (topic: {
    id: number
    slug: string
    name: string
    description: string
    creator: {
        id: number
        username: string
        nickname?: string
        description?: string
        profileImage?: string
        role: number
    }
    createdAt: Date
    updatedAt: Date
}) => ({
    id: topic.id,
    slug: topic.slug,
    name: topic.name,
    description: topic.description,
    creator: toUserBrief(topic.creator),
    createdAt: topic.createdAt,
    updatedAt: topic.updatedAt,
})

export const toTopicDetail = (topic: {
    id: number
    slug: string
    name: string
    description: string
    creator: {
        id: number
        username: string
        nickname?: string
        email: string
        description?: string
        profileImage?: string
        studentNumber: string
        department: number
        status: number
        club?: string
        isVerified: boolean
        createdAt: Date
        role: number
    }
    createdAt: Date
    updatedAt: Date
}) => ({
    id: topic.id,
    slug: topic.slug,
    name: topic.name,
    description: topic.description,
    creator: toUserDetail(topic.creator),
    createdAt: topic.createdAt,
    updatedAt: topic.updatedAt,
})
