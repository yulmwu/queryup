import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UsersService } from 'modules/users/users.service'
import { normalizePage, normalizeSize, toUserBrief, toUserDetail } from '../community.utils'
import { GeneralPost } from './general-post.entity'
import { GeneralPostCreateDto, GeneralPostUpdateDto } from './general-post.dto'

@Injectable()
export class GeneralPostsService {
    constructor(
        @InjectRepository(GeneralPost) private generalRepo: Repository<GeneralPost>,
        private usersService: UsersService,
    ) {}

    async create(userId: number, dto: GeneralPostCreateDto) {
        const author = await this.usersService.findById(userId)
        const post = this.generalRepo.create({
            title: dto.title.trim(),
            content: dto.content,
            author,
        })

        return this.generalRepo.save(post)
    }

    async list(page?: number, size?: number) {
        const currentPage = normalizePage(page)
        const take = normalizeSize(size)
        const skip = (currentPage - 1) * take

        const [rows, total] = await this.generalRepo.findAndCount({
            where: { isDeleted: false },
            order: { createdAt: 'DESC' },
            skip,
            take,
        })

        return {
            items: rows.map((post) => ({
                id: post.id,
                title: post.title,
                author: toUserBrief(post.author),
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,
            })),
            meta: { page: currentPage, size: take, total },
        }
    }

    async findOne(id: number) {
        const post = await this.generalRepo.findOne({ where: { id, isDeleted: false } })
        if (!post) throw new NotFoundException('Post not found')

        return {
            id: post.id,
            title: post.title,
            content: post.content,
            author: toUserDetail(post.author),
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
        }
    }

    async update(id: number, userId: number, dto: GeneralPostUpdateDto) {
        const post = await this.generalRepo.findOne({ where: { id, isDeleted: false } })
        if (!post) throw new NotFoundException('Post not found')
        if (post.author.id !== userId) throw new ForbiddenException('You are not allowed to update this post')

        if (dto.title !== undefined) post.title = dto.title.trim()
        if (dto.content !== undefined) post.content = dto.content

        const updated = await this.generalRepo.save(post)
        return {
            id: updated.id,
            title: updated.title,
            content: updated.content,
            author: toUserDetail(updated.author),
            createdAt: updated.createdAt,
            updatedAt: updated.updatedAt,
        }
    }

    async remove(id: number, userId: number) {
        const post = await this.generalRepo.findOne({ where: { id, isDeleted: false } })
        if (!post) throw new NotFoundException('Post not found')
        if (post.author.id !== userId) throw new ForbiddenException('You are not allowed to delete this post')

        post.isDeleted = true
        await this.generalRepo.save(post)
    }
}
