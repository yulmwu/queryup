import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { AnonymousPost } from './anonymous-post.entity'
import { AnonymousPostCreateDto, AnonymousPostUpdateDto, AnonymousPostDeleteDto } from './anonymous-post.dto'
import { maskIp, normalizePage, normalizeSize } from '../community.utils'

@Injectable()
export class AnonymousPostsService {
    constructor(@InjectRepository(AnonymousPost) private anonRepo: Repository<AnonymousPost>) {}

    async create(dto: AnonymousPostCreateDto, ipAddress: string) {
        const passwordHash = await bcrypt.hash(dto.password, 10)
        const post = this.anonRepo.create({
            title: dto.title.trim(),
            content: dto.content,
            authorName: dto.authorName.trim(),
            passwordHash,
            ipAddress,
        })

        const saved = await this.anonRepo.save(post)
        return {
            id: saved.id,
            title: saved.title,
            content: saved.content,
            authorName: saved.authorName,
            ipMasked: maskIp(saved.ipAddress),
            createdAt: saved.createdAt,
            updatedAt: saved.updatedAt,
        }
    }

    async list(page?: number, size?: number) {
        const currentPage = normalizePage(page)
        const take = normalizeSize(size)
        const skip = (currentPage - 1) * take

        const [rows, total] = await this.anonRepo.findAndCount({
            where: { isDeleted: false },
            order: { createdAt: 'DESC' },
            skip,
            take,
        })

        return {
            items: rows.map((post) => ({
                id: post.id,
                title: post.title,
                authorName: post.authorName,
                ipMasked: maskIp(post.ipAddress),
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,
            })),
            meta: { page: currentPage, size: take, total },
        }
    }

    async findOne(id: number) {
        const post = await this.anonRepo.findOne({ where: { id, isDeleted: false } })
        if (!post) throw new NotFoundException('Post not found')

        return {
            id: post.id,
            title: post.title,
            content: post.content,
            authorName: post.authorName,
            ipMasked: maskIp(post.ipAddress),
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
        }
    }

    async update(id: number, dto: AnonymousPostUpdateDto) {
        const post = await this.anonRepo
            .createQueryBuilder('post')
            .addSelect(['post.passwordHash'])
            .where('post.id = :id', { id })
            .andWhere('post.isDeleted = :isDeleted', { isDeleted: false })
            .getOne()
        if (!post) throw new NotFoundException('Post not found')

        const ok = await bcrypt.compare(dto.password, post.passwordHash)
        if (!ok) throw new UnauthorizedException('Invalid password')

        if (dto.title !== undefined) post.title = dto.title.trim()
        if (dto.content !== undefined) post.content = dto.content

        const updated = await this.anonRepo.save(post)
        return {
            id: updated.id,
            title: updated.title,
            content: updated.content,
            authorName: updated.authorName,
            ipMasked: maskIp(updated.ipAddress),
            createdAt: updated.createdAt,
            updatedAt: updated.updatedAt,
        }
    }

    async remove(id: number, dto: AnonymousPostDeleteDto) {
        const post = await this.anonRepo
            .createQueryBuilder('post')
            .addSelect(['post.passwordHash'])
            .where('post.id = :id', { id })
            .andWhere('post.isDeleted = :isDeleted', { isDeleted: false })
            .getOne()
        if (!post) throw new NotFoundException('Post not found')

        const ok = await bcrypt.compare(dto.password, post.passwordHash)
        if (!ok) throw new UnauthorizedException('Invalid password')

        post.isDeleted = true
        await this.anonRepo.save(post)
    }
}
