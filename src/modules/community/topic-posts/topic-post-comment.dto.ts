import { ApiProperty } from '@nestjs/swagger'
import { IntersectionType, PartialType } from '@nestjs/swagger'
import { CommentContentDto } from '../dto/posts.dto'
import { CommunityUserBriefDto } from '../dto/community-user.dto'
import { PageMetaDto, CursorMetaDto } from 'common/dto'
import { CommentListItemBaseDto, CommentReplyItemBaseDto } from '../dto/comment.dto'

export class TopicPostCommentCreateDto extends IntersectionType(CommentContentDto) {}

export class TopicPostCommentUpdateDto extends PartialType(CommentContentDto) {}

export class TopicPostCommentAuthorBriefDto extends IntersectionType(CommunityUserBriefDto) {}

export class TopicPostCommentListItemDto extends CommentListItemBaseDto {
    @ApiProperty({ description: 'Author info (brief).', type: TopicPostCommentAuthorBriefDto })
    author: TopicPostCommentAuthorBriefDto
}

export class TopicPostCommentListResponseDto {
    @ApiProperty({ description: 'List items.', type: [TopicPostCommentListItemDto] })
    items: TopicPostCommentListItemDto[]

    @ApiProperty({ description: 'Pagination metadata.', type: PageMetaDto })
    meta: PageMetaDto
}

export class TopicPostReplyListItemDto extends CommentReplyItemBaseDto {
    @ApiProperty({ description: 'Author info (brief).', type: TopicPostCommentAuthorBriefDto })
    author: TopicPostCommentAuthorBriefDto
}

export class TopicPostReplyListResponseDto {
    @ApiProperty({ description: 'List items.', type: [TopicPostReplyListItemDto] })
    items: TopicPostReplyListItemDto[]

    @ApiProperty({ description: 'Cursor metadata.', type: CursorMetaDto })
    meta: CursorMetaDto
}
