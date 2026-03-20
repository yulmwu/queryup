import { ApiProperty } from '@nestjs/swagger'
import { IntersectionType, PartialType } from '@nestjs/swagger'
import { PostContentDto, PostTitleDto } from '../dto/posts.dto'
import { UserResponseDto } from 'modules/users/dto'
import { PageMetaDto } from 'common/dto'
import { TopicDetailDto, TopicListItemDto } from '../topics/topic.dto'
import { CommunityUserBriefDto } from '../dto/community-user.dto'

export class TopicPostCreateDto extends IntersectionType(PostTitleDto, PostContentDto) {}

export class TopicPostUpdateDto extends PartialType(IntersectionType(PostTitleDto, PostContentDto)) {}

export class TopicPostAuthorBriefDto extends IntersectionType(CommunityUserBriefDto) {}

export class TopicPostAuthorDetailDto extends IntersectionType(UserResponseDto) {}

export class TopicPostListItemDto {
    @ApiProperty({ description: 'Post ID.', example: 1 })
    id: number

    @ApiProperty({ description: 'Post title.', example: 'Hello world' })
    title: string

    @ApiProperty({ description: 'Topic info (brief).', type: TopicListItemDto })
    topic: TopicListItemDto

    @ApiProperty({ description: 'Author info (brief).', type: TopicPostAuthorBriefDto })
    author: TopicPostAuthorBriefDto

    @ApiProperty({ description: 'Created timestamp.', example: '2024-01-01T00:00:00.000Z' })
    createdAt: Date

    @ApiProperty({ description: 'Updated timestamp.', example: '2024-01-02T00:00:00.000Z' })
    updatedAt: Date
}

export class TopicPostDetailDto {
    @ApiProperty({ description: 'Post ID.', example: 1 })
    id: number

    @ApiProperty({ description: 'Post title.', example: 'Hello world' })
    title: string

    @ApiProperty({ description: 'Post content.', example: 'This is the content.' })
    content: string

    @ApiProperty({ description: 'Topic info (detail).', type: TopicDetailDto })
    topic: TopicDetailDto

    @ApiProperty({ description: 'Author info (detail).', type: TopicPostAuthorDetailDto })
    author: TopicPostAuthorDetailDto

    @ApiProperty({ description: 'Created timestamp.', example: '2024-01-01T00:00:00.000Z' })
    createdAt: Date

    @ApiProperty({ description: 'Updated timestamp.', example: '2024-01-02T00:00:00.000Z' })
    updatedAt: Date
}

export class TopicPostListResponseDto {
    @ApiProperty({ description: 'List items.', type: [TopicPostListItemDto] })
    items: TopicPostListItemDto[]

    @ApiProperty({ description: 'Pagination metadata.', type: PageMetaDto })
    meta: PageMetaDto
}
