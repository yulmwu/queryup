import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { IsNull, Repository } from 'typeorm'
import { UsersService } from 'modules/users/users.service'
import { Topic } from '../topics/topic.entity'
import { TopicPost } from './topic-post.entity'
import { TopicPostComment } from './topic-post-comment.entity'
import { TopicPostCommentCreateDto, TopicPostCommentUpdateDto } from './topic-post-comment.dto'
import { normalizePage, normalizeSize, toUserBrief } from '../community.utils'

@Injectable()
export class TopicPostCommentsService {
    constructor(
        @InjectRepository(TopicPostComment) private commentRepo: Repository<TopicPostComment>,
        @InjectRepository(TopicPost) private postRepo: Repository<TopicPost>,
        @InjectRepository(Topic) private topicRepo: Repository<Topic>,
        private usersService: UsersService,
    ) {}

    private async findPostOrThrow(slug: string, postId: number) {
        const topic = await this.topicRepo.findOne({ where: { slug } })
        if (!topic) throw new NotFoundException('Topic not found')

        const post = await this.postRepo.findOne({ where: { id: postId, topic: { id: topic.id }, isDeleted: false } })
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

    async create(slug: string, postId: number, userId: number, dto: TopicPostCommentCreateDto) {
        const post = await this.findPostOrThrow(slug, postId)
        const author = await this.usersService.findById(userId)

        const comment = this.commentRepo.create({
            post,
            content: dto.content,
            author,
        })

        return this.commentRepo.save(comment)
    }

    async createReply(slug: string, postId: number, commentId: number, userId: number, dto: TopicPostCommentCreateDto) {
        const post = await this.findPostOrThrow(slug, postId)
        const parent = await this.findTopLevelCommentOrThrow(postId, commentId)
        if (parent.parentId) throw new BadRequestException('Nested replies are not allowed')

        const author = await this.usersService.findById(userId)
        const reply = this.commentRepo.create({
            post,
            parent,
            content: dto.content,
            author,
        })

        return this.commentRepo.save(reply)
    }

    async list(slug: string, postId: number, page?: number, size?: number) {
        await this.findPostOrThrow(slug, postId)

        const currentPage = normalizePage(page)
        const take = normalizeSize(size)
        const skip = (currentPage - 1) * take

        const qb = this.commentRepo
            .createQueryBuilder('comment')
            .leftJoinAndSelect('comment.author', 'author')
            .where('comment.postId = :postId', { postId })
            .andWhere('comment.parentId IS NULL')
            .andWhere(
                `(
                    comment.isDeleted = false
                    OR EXISTS (
                        SELECT 1 FROM topic_post_comments reply
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
                author: toUserBrief(comment.author),
                createdAt: comment.createdAt,
                updatedAt: comment.updatedAt,
            })),
            meta: { page: currentPage, size: take, total },
        }
    }

    async listReplies(slug: string, postId: number, commentId: number, cursor?: number, size?: number) {
        await this.findPostOrThrow(slug, postId)
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
            .leftJoinAndSelect('reply.author', 'author')
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
                author: toUserBrief(reply.author),
                createdAt: reply.createdAt,
                updatedAt: reply.updatedAt,
            })),
            meta: { size: take, nextCursor },
        }
    }

    async update(slug: string, postId: number, commentId: number, userId: number, dto: TopicPostCommentUpdateDto) {
        await this.findPostOrThrow(slug, postId)

        const comment = await this.commentRepo.findOne({
            where: { id: commentId, post: { id: postId }, isDeleted: false },
        })
        if (!comment) throw new NotFoundException('Comment not found')

        if (comment.author.id !== userId) throw new ForbiddenException('You are not allowed to update this comment')

        if (dto.content !== undefined) comment.content = dto.content

        return this.commentRepo.save(comment)
    }

    async remove(slug: string, postId: number, commentId: number, userId: number) {
        await this.findPostOrThrow(slug, postId)

        const comment = await this.commentRepo.findOne({
            where: { id: commentId, post: { id: postId }, isDeleted: false },
        })
        if (!comment) throw new NotFoundException('Comment not found')

        if (comment.author.id !== userId) throw new ForbiddenException('You are not allowed to delete this comment')

        comment.isDeleted = true
        comment.content = null
        await this.commentRepo.save(comment)
    }
}
