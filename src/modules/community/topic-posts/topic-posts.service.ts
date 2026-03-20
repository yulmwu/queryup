import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { TopicPost } from './topic-post.entity'
import { UsersService } from 'modules/users/users.service'
import { TopicPostCreateDto, TopicPostUpdateDto } from './topic-post.dto'
import {
    normalizePage,
    normalizeSize,
    toTopicBrief,
    toTopicDetail,
    toUserBrief,
    toUserDetail,
} from '../community.utils'
import { Topic } from '../topics/topic.entity'

@Injectable()
export class TopicPostsService {
    constructor(
        @InjectRepository(TopicPost) private postRepo: Repository<TopicPost>,
        @InjectRepository(Topic) private topicRepo: Repository<Topic>,
        private usersService: UsersService,
    ) {}

    async create(slug: string, userId: number, dto: TopicPostCreateDto) {
        const topic = await this.topicRepo.findOne({ where: { slug } })
        if (!topic) throw new NotFoundException('Topic not found')
        const author = await this.usersService.findById(userId)

        const post = this.postRepo.create({
            topic,
            title: dto.title.trim(),
            content: dto.content,
            author,
        })

        return this.postRepo.save(post)
    }

    async list(slug: string, page?: number, size?: number) {
        const topic = await this.topicRepo.findOne({ where: { slug } })
        if (!topic) throw new NotFoundException('Topic not found')

        const currentPage = normalizePage(page)
        const take = normalizeSize(size)
        const skip = (currentPage - 1) * take

        const [rows, total] = await this.postRepo.findAndCount({
            where: { topic: { id: topic.id }, isDeleted: false },
            order: { createdAt: 'DESC' },
            skip,
            take,
        })

        return {
            items: rows.map((post) => ({
                id: post.id,
                title: post.title,
                topic: toTopicBrief(post.topic),
                author: toUserBrief(post.author),
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,
            })),
            meta: { page: currentPage, size: take, total },
        }
    }

    async findOne(slug: string, id: number) {
        const topic = await this.topicRepo.findOne({ where: { slug } })
        if (!topic) throw new NotFoundException('Topic not found')

        const post = await this.postRepo.findOne({
            where: { id, isDeleted: false, topic: { id: topic.id } },
        })
        if (!post) throw new NotFoundException('Post not found')

        return {
            id: post.id,
            title: post.title,
            content: post.content,
            topic: toTopicDetail(post.topic),
            author: toUserDetail(post.author),
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
        }
    }

    async update(slug: string, id: number, userId: number, dto: TopicPostUpdateDto) {
        const topic = await this.topicRepo.findOne({ where: { slug } })
        if (!topic) throw new NotFoundException('Topic not found')

        const post = await this.postRepo.findOne({
            where: { id, isDeleted: false, topic: { id: topic.id } },
        })
        if (!post) throw new NotFoundException('Post not found')
        if (post.author.id !== userId) throw new ForbiddenException('You are not allowed to update this post')

        if (dto.title !== undefined) post.title = dto.title.trim()
        if (dto.content !== undefined) post.content = dto.content

        const updated = await this.postRepo.save(post)

        return {
            id: updated.id,
            title: updated.title,
            content: updated.content,
            topic: toTopicDetail(updated.topic),
            author: toUserDetail(updated.author),
            createdAt: updated.createdAt,
            updatedAt: updated.updatedAt,
        }
    }

    async remove(slug: string, id: number, userId: number) {
        const topic = await this.topicRepo.findOne({ where: { slug } })
        if (!topic) throw new NotFoundException('Topic not found')

        const post = await this.postRepo.findOne({
            where: { id, isDeleted: false, topic: { id: topic.id } },
        })
        if (!post) throw new NotFoundException('Post not found')

        if (post.author.id !== userId) throw new ForbiddenException('You are not allowed to delete this post')

        post.isDeleted = true
        await this.postRepo.save(post)
    }
}
