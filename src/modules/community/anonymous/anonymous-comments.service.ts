import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { IsNull, Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { AnonymousPost } from './anonymous-post.entity'
import { AnonymousComment } from './anonymous-comment.entity'
import {
    AnonymousCommentCreateDto,
    AnonymousCommentUpdateDto,
    AnonymousCommentDeleteDto,
} from './anonymous-comment.dto'
import { maskIp, normalizePage, normalizeSize } from '../community.utils'

@Injectable()
export class AnonymousCommentsService {
    constructor(
        @InjectRepository(AnonymousComment) private commentRepo: Repository<AnonymousComment>,
        @InjectRepository(AnonymousPost) private postRepo: Repository<AnonymousPost>,
    ) {}

    private async findPostOrThrow(postId: number) {
        const post = await this.postRepo.findOne({ where: { id: postId, isDeleted: false } })
        if (!post) throw new NotFoundException('Post not found')
        return post
    }

    private async findTopLevelCommentOrThrow(postId: number, commentId: number) {
        const comment = await this.commentRepo.findOne({
            where: { id: commentId, post: { id: postId }, parent: IsNull() },
        })
        if (!comment) throw new NotFoundException('Comment not found')

        return comment
    }

    async create(postId: number, dto: AnonymousCommentCreateDto, ipAddress: string) {
        const post = await this.findPostOrThrow(postId)
        const passwordHash = await bcrypt.hash(dto.password, 10)

        const comment = this.commentRepo.create({
            post,
            content: dto.content,
            authorName: dto.authorName.trim(),
            passwordHash,
            ipAddress,
        })

        return this.commentRepo.save(comment)
    }

    async createReply(postId: number, commentId: number, dto: AnonymousCommentCreateDto, ipAddress: string) {
        const post = await this.findPostOrThrow(postId)
        const parent = await this.commentRepo.findOne({ where: { id: commentId, post: { id: postId } } })
        if (!parent) throw new NotFoundException('Comment not found')
        if (parent.parentId) throw new BadRequestException('Nested replies are not allowed')
        const passwordHash = await bcrypt.hash(dto.password, 10)

        const reply = this.commentRepo.create({
            post,
            parent,
            content: dto.content,
            authorName: dto.authorName.trim(),
            passwordHash,
            ipAddress,
        })

        return this.commentRepo.save(reply)
    }

    async list(postId: number, page?: number, size?: number) {
        await this.findPostOrThrow(postId)

        const currentPage = normalizePage(page)
        const take = normalizeSize(size)
        const skip = (currentPage - 1) * take

        const qb = this.commentRepo
            .createQueryBuilder('comment')
            .where('comment.postId = :postId', { postId })
            .andWhere('comment.parentId IS NULL')
            .andWhere(
                `(
                    comment.isDeleted = false
                    OR EXISTS (
                        SELECT 1 FROM anonymous_comments reply
                        WHERE reply.\"parentId\" = comment.id AND reply.\"isDeleted\" = false
                    )
                )`,
            )
            .orderBy('comment.createdAt', 'DESC')
            .addOrderBy('comment.id', 'DESC')
            .skip(skip)
            .take(take)

        const [rows, total] = await qb.getManyAndCount()
        const parentIds = rows.map((row) => row.id)

        const replyCounts = parentIds.length
            ? await this.commentRepo
                  .createQueryBuilder('reply')
                  .select('reply.parentId', 'parentId')
                  .addSelect('COUNT(*)', 'count')
                  .where('reply.parentId IN (:...parentIds)', { parentIds })
                  .andWhere('reply.isDeleted = false')
                  .groupBy('reply.parentId')
                  .getRawMany()
            : []

        const countMap = new Map<number, number>()
        for (const row of replyCounts) {
            countMap.set(Number(row.parentId), Number(row.count))
        }

        return {
            items: rows.map((comment) => ({
                id: comment.id,
                parentId: null,
                content: comment.isDeleted ? null : comment.content,
                isDeleted: comment.isDeleted,
                replyCount: countMap.get(comment.id) ?? 0,
                author: {
                    authorName: comment.authorName,
                    ipMasked: maskIp(comment.ipAddress),
                },
                createdAt: comment.createdAt,
                updatedAt: comment.updatedAt,
            })),
            meta: { page: currentPage, size: take, total },
        }
    }

    async listReplies(postId: number, commentId: number, cursor?: number, size?: number) {
        await this.findPostOrThrow(postId)
        await this.findTopLevelCommentOrThrow(postId, commentId)

        const take = normalizeSize(size)
        let cursorCreatedAt: Date | null = null

        if (cursor) {
            const cursorRow = await this.commentRepo.findOne({
                where: { id: cursor, post: { id: postId }, parent: { id: commentId }, isDeleted: false },
            })
            if (!cursorRow) throw new NotFoundException('Reply cursor not found')

            cursorCreatedAt = cursorRow.createdAt
        }

        const qb = this.commentRepo
            .createQueryBuilder('reply')
            .where('reply.postId = :postId', { postId })
            .andWhere('reply.parentId = :parentId', { parentId: commentId })
            .andWhere('reply.isDeleted = false')

        if (cursor && cursorCreatedAt) {
            qb.andWhere(
                '(reply.createdAt < :cursorCreatedAt OR (reply.createdAt = :cursorCreatedAt AND reply.id < :cursorId))',
                { cursorCreatedAt, cursorId: cursor },
            )
        }

        const rows = await qb
            .orderBy('reply.createdAt', 'DESC')
            .addOrderBy('reply.id', 'DESC')
            .take(take + 1)
            .getMany()

        const hasMore = rows.length > take
        const items = hasMore ? rows.slice(0, take) : rows
        const nextCursor = hasMore ? items[items.length - 1].id : null

        return {
            items: items.map((reply) => ({
                id: reply.id,
                parentId: commentId,
                content: reply.content ?? '',
                author: {
                    authorName: reply.authorName,
                    ipMasked: maskIp(reply.ipAddress),
                },
                createdAt: reply.createdAt,
                updatedAt: reply.updatedAt,
            })),
            meta: { size: take, nextCursor },
        }
    }

    async update(postId: number, commentId: number, dto: AnonymousCommentUpdateDto) {
        await this.findPostOrThrow(postId)

        const qb = this.commentRepo
            .createQueryBuilder('comment')
            .addSelect(['comment.passwordHash'])
            .where('comment.id = :id', { id: commentId })
            .andWhere('comment.postId = :postId', { postId })
            .andWhere('comment.isDeleted = :isDeleted', { isDeleted: false })

        const comment = await qb.getOne()
        if (!comment) throw new NotFoundException('Comment not found')

        const ok = await bcrypt.compare(dto.password, comment.passwordHash)
        if (!ok) throw new UnauthorizedException('Invalid password')

        if (dto.content !== undefined) comment.content = dto.content

        return this.commentRepo.save(comment)
    }

    async remove(postId: number, commentId: number, dto: AnonymousCommentDeleteDto) {
        await this.findPostOrThrow(postId)

        const qb = this.commentRepo
            .createQueryBuilder('comment')
            .addSelect(['comment.passwordHash'])
            .where('comment.id = :id', { id: commentId })
            .andWhere('comment.postId = :postId', { postId })
            .andWhere('comment.isDeleted = :isDeleted', { isDeleted: false })

        const comment = await qb.getOne()
        if (!comment) throw new NotFoundException('Comment not found')

        const ok = await bcrypt.compare(dto.password, comment.passwordHash)
        if (!ok) throw new UnauthorizedException('Invalid password')

        comment.isDeleted = true
        comment.content = null

        await this.commentRepo.save(comment)
    }
}
