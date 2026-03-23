import { ApiProperty } from '@nestjs/swagger'

export class CommentListItemBaseDto {
    @ApiProperty({ description: 'Comment ID.', example: 1 })
    id: number

    @ApiProperty({ description: 'Parent comment ID (null for top-level).', example: null, nullable: true })
    parentId?: number | null

    @ApiProperty({ description: 'Comment content.', example: 'Nice post!', nullable: true })
    content: string | null

    @ApiProperty({ description: 'Is deleted.', example: false })
    isDeleted: boolean

    @ApiProperty({ description: 'Reply count.', example: 2 })
    replyCount: number

    @ApiProperty({ description: 'Created timestamp.', example: '2024-01-01T00:00:00.000Z' })
    createdAt: Date

    @ApiProperty({ description: 'Updated timestamp.', example: '2024-01-01T00:00:00.000Z' })
    updatedAt: Date
}

export class CommentReplyItemBaseDto {
    @ApiProperty({ description: 'Reply ID.', example: 10 })
    id: number

    @ApiProperty({ description: 'Parent comment ID.', example: 1 })
    parentId: number

    @ApiProperty({ description: 'Reply content.', example: 'Thanks!' })
    content: string

    @ApiProperty({ description: 'Created timestamp.', example: '2024-01-01T00:00:00.000Z' })
    createdAt: Date

    @ApiProperty({ description: 'Updated timestamp.', example: '2024-01-01T00:00:00.000Z' })
    updatedAt: Date
}

export class AnonymousCommentAuthorDto {
    @ApiProperty({ description: 'Author name.', example: '익명123' })
    authorName: string

    @ApiProperty({ description: 'Masked IP.', example: '123.45.*.*' })
    ipMasked: string
}
