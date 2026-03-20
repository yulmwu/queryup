import { ApiProperty } from '@nestjs/swagger'
import { IntersectionType, PartialType } from '@nestjs/swagger'
import { PostContentDto, PostTitleDto } from '../dto/posts.dto'
import { UserResponseDto } from 'modules/users/dto'
import { PageMetaDto } from 'common/dto'
import { CommunityUserBriefDto } from '../dto/community-user.dto'

export class GeneralPostCreateDto extends IntersectionType(PostTitleDto, PostContentDto) {}

export class GeneralPostUpdateDto extends PartialType(IntersectionType(PostTitleDto, PostContentDto)) {}

export class GeneralPostAuthorBriefDto extends IntersectionType(CommunityUserBriefDto) {}

export class GeneralPostAuthorDetailDto extends IntersectionType(UserResponseDto) {}

export class GeneralPostListItemDto {
    @ApiProperty({ description: 'Post ID.', example: 1 })
    id: number

    @ApiProperty({ description: 'Post title.', example: 'Hello world' })
    title: string

    @ApiProperty({ description: 'Author info (brief).', type: GeneralPostAuthorBriefDto })
    author: GeneralPostAuthorBriefDto

    @ApiProperty({ description: 'Created timestamp.', example: '2024-01-01T00:00:00.000Z' })
    createdAt: Date

    @ApiProperty({ description: 'Updated timestamp.', example: '2024-01-02T00:00:00.000Z' })
    updatedAt: Date
}

export class GeneralPostDetailDto {
    @ApiProperty({ description: 'Post ID.', example: 1 })
    id: number

    @ApiProperty({ description: 'Post title.', example: 'Hello world' })
    title: string

    @ApiProperty({ description: 'Post content.', example: 'This is the content.' })
    content: string

    @ApiProperty({ description: 'Author info (detail).', type: GeneralPostAuthorDetailDto })
    author: GeneralPostAuthorDetailDto

    @ApiProperty({ description: 'Created timestamp.', example: '2024-01-01T00:00:00.000Z' })
    createdAt: Date

    @ApiProperty({ description: 'Updated timestamp.', example: '2024-01-02T00:00:00.000Z' })
    updatedAt: Date
}

export class GeneralPostListResponseDto {
    @ApiProperty({ description: 'List items.', type: [GeneralPostListItemDto] })
    items: GeneralPostListItemDto[]

    @ApiProperty({ description: 'Pagination metadata.', type: PageMetaDto })
    meta: PageMetaDto
}
