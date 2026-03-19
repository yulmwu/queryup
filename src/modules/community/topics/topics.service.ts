import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Topic } from './topic.entity'
import { UsersService } from 'modules/users/users.service'
import { UserRole } from 'modules/users/users.entity'
import { TopicCreateDto, TopicUpdateDto } from './topic.dto'
import { normalizePage, normalizeSize, toUserBrief, toUserDetail } from '../community.utils'

@Injectable()
export class TopicsService {
    constructor(
        @InjectRepository(Topic) private topicRepo: Repository<Topic>,
        private usersService: UsersService,
    ) {}

    async create(userId: number, dto: TopicCreateDto) {
        const creator = await this.usersService.findById(userId)
        const existing = await this.topicRepo.findOne({ where: { slug: dto.slug } })
        if (existing) throw new ConflictException('Slug already exists')

        const topic = this.topicRepo.create({
            slug: dto.slug,
            name: dto.name,
            description: dto.description,
            creator,
        })

        return this.topicRepo.save(topic)
    }

    async list(page?: number, size?: number) {
        const currentPage = normalizePage(page)
        const take = normalizeSize(size)
        const skip = (currentPage - 1) * take

        const [rows, total] = await this.topicRepo.findAndCount({
            order: { createdAt: 'DESC' },
            skip,
            take,
        })

        return {
            items: rows.map((topic) => ({
                id: topic.id,
                slug: topic.slug,
                name: topic.name,
                description: topic.description,
                creator: toUserBrief(topic.creator),
                createdAt: topic.createdAt,
                updatedAt: topic.updatedAt,
            })),
            meta: { page: currentPage, size: take, total },
        }
    }

    async findBySlug(slug: string) {
        const topic = await this.topicRepo.findOne({ where: { slug } })
        if (!topic) throw new NotFoundException('Topic not found')

        return {
            id: topic.id,
            slug: topic.slug,
            name: topic.name,
            description: topic.description,
            creator: toUserDetail(topic.creator),
            createdAt: topic.createdAt,
            updatedAt: topic.updatedAt,
        }
    }

    async update(slug: string, userId: number, dto: TopicUpdateDto) {
        const topic = await this.topicRepo.findOne({ where: { slug } })
        if (!topic) throw new NotFoundException('Topic not found')

        const user = await this.usersService.findById(userId)

        const isOwner = topic.creator.id === userId
        const isAdmin = user.role === UserRole.ADMIN
        if (!isOwner && !isAdmin) throw new ForbiddenException('You are not allowed to update this topic')

        if (dto.slug !== undefined && dto.slug !== topic.slug) {
            const existing = await this.topicRepo.findOne({ where: { slug: dto.slug } })
            if (existing) throw new ConflictException('Slug already exists')
            topic.slug = dto.slug
        }

        if (dto.name !== undefined) topic.name = dto.name

        if (dto.description !== undefined) topic.description = dto.description

        const updated = await this.topicRepo.save(topic)

        return {
            id: updated.id,
            slug: updated.slug,
            name: updated.name,
            description: updated.description,
            creator: toUserDetail(updated.creator),
            createdAt: updated.createdAt,
            updatedAt: updated.updatedAt,
        }
    }
}
