import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger'
import { CommentContentDto, AnonymousAuthorDto, AnonymousPasswordDto } from '../dto/posts.dto'
import { PageMetaDto, CursorMetaDto } from 'common/dto'
import { AnonymousCommentAuthorDto, CommentListItemBaseDto, CommentReplyItemBaseDto } from '../dto/comment.dto'

export class AnonymousCommentCreateDto extends IntersectionType(
    CommentContentDto,
    AnonymousAuthorDto,
    AnonymousPasswordDto,
) {}

export class AnonymousCommentUpdateDto extends IntersectionType(AnonymousPasswordDto, PartialType(CommentContentDto)) {}

export class AnonymousCommentDeleteDto extends IntersectionType(AnonymousPasswordDto) {}

export class AnonymousCommentListItemDto extends CommentListItemBaseDto {
    @ApiProperty({ description: 'Author info.', type: AnonymousCommentAuthorDto })
    author: AnonymousCommentAuthorDto
}

export class AnonymousCommentListResponseDto {
    @ApiProperty({ description: 'List items.', type: [AnonymousCommentListItemDto] })
    items: AnonymousCommentListItemDto[]

    @ApiProperty({ description: 'Pagination metadata.', type: PageMetaDto })
    meta: PageMetaDto
}

export class AnonymousReplyListItemDto extends CommentReplyItemBaseDto {
    @ApiProperty({ description: 'Author info.', type: AnonymousCommentAuthorDto })
    author: AnonymousCommentAuthorDto
}

export class AnonymousReplyListResponseDto {
    @ApiProperty({ description: 'List items.', type: [AnonymousReplyListItemDto] })
    items: AnonymousReplyListItemDto[]

    @ApiProperty({ description: 'Cursor metadata.', type: CursorMetaDto })
    meta: CursorMetaDto
}
