import { ApiProperty } from '@nestjs/swagger'
import { IntersectionType, PartialType } from '@nestjs/swagger'
import { TopicDescriptionDto, TopicNameDto, TopicSlugDto } from '../dto/posts.dto'
import { UserBriefResponseDto, UserResponseDto } from 'modules/users/dto'
import { PageMetaDto } from 'common/dto'

export class TopicCreateDto extends IntersectionType(TopicSlugDto, TopicNameDto, TopicDescriptionDto) {}

export class TopicUpdateDto extends PartialType(IntersectionType(TopicSlugDto, TopicNameDto, TopicDescriptionDto)) {}

export class TopicCreatorBriefDto extends IntersectionType(UserBriefResponseDto) {}

export class TopicCreatorDetailDto extends IntersectionType(UserResponseDto) {}

export class TopicListItemDto {
    @ApiProperty({ description: 'Topic ID.', example: 1 })
    id: number

    @ApiProperty({ description: 'Topic slug.', example: 'game-dev' })
    slug: string

    @ApiProperty({ description: 'Topic name.', example: 'Graphics' })
    name: string

    @ApiProperty({ description: 'Topic description.', example: 'All about graphics.' })
    description: string

    @ApiProperty({ description: 'Creator info (brief).', type: TopicCreatorBriefDto })
    creator: TopicCreatorBriefDto

    @ApiProperty({ description: 'Created timestamp.', example: '2024-01-01T00:00:00.000Z' })
    createdAt: Date

    @ApiProperty({ description: 'Updated timestamp.', example: '2024-01-02T00:00:00.000Z' })
    updatedAt: Date
}

export class TopicDetailDto {
    @ApiProperty({ description: 'Topic ID.', example: 1 })
    id: number

    @ApiProperty({ description: 'Topic slug.', example: 'game-dev' })
    slug: string

    @ApiProperty({ description: 'Topic name.', example: 'Graphics' })
    name: string

    @ApiProperty({ description: 'Topic description.', example: 'All about graphics.' })
    description: string

    @ApiProperty({ description: 'Creator info (detail).', type: TopicCreatorDetailDto })
    creator: TopicCreatorDetailDto

    @ApiProperty({ description: 'Created timestamp.', example: '2024-01-01T00:00:00.000Z' })
    createdAt: Date

    @ApiProperty({ description: 'Updated timestamp.', example: '2024-01-02T00:00:00.000Z' })
    updatedAt: Date
}

export class TopicListResponseDto {
    @ApiProperty({ description: 'List items.', type: [TopicListItemDto] })
    items: TopicListItemDto[]

    @ApiProperty({ description: 'Pagination metadata.', type: PageMetaDto })
    meta: PageMetaDto
}
