import { ApiProperty } from '@nestjs/swagger'
import { IntersectionType, PartialType } from '@nestjs/swagger'
import { PostContentDto, PostTitleDto, AnonymousAuthorDto, AnonymousPasswordDto } from '../dto/posts.dto'
import { PageMetaDto } from 'common/dto'

export class AnonymousPostCreateDto extends IntersectionType(
    PostTitleDto,
    PostContentDto,
    AnonymousAuthorDto,
    AnonymousPasswordDto,
) {}

export class AnonymousPostUpdateDto extends IntersectionType(
    PartialType(IntersectionType(PostTitleDto, PostContentDto)),
    AnonymousPasswordDto,
) {}

export class AnonymousPostDeleteDto extends IntersectionType(AnonymousPasswordDto) {}

export class AnonymousPostListItemDto {
    @ApiProperty({ description: 'Post ID.', example: 1 })
    id: number

    @ApiProperty({ description: 'Post title.', example: 'Hello world' })
    title: string

    @ApiProperty({ description: 'Author name.', example: '익명123' })
    authorName: string

    @ApiProperty({ description: 'Masked IP (first 2 octets).', example: '123.456.*.*' })
    ipMasked: string

    @ApiProperty({ description: 'Created timestamp.', example: '2024-01-01T00:00:00.000Z' })
    createdAt: Date

    @ApiProperty({ description: 'Updated timestamp.', example: '2024-01-02T00:00:00.000Z' })
    updatedAt: Date
}

export class AnonymousPostDetailDto {
    @ApiProperty({ description: 'Post ID.', example: 1 })
    id: number

    @ApiProperty({ description: 'Post title.', example: 'Hello world' })
    title: string

    @ApiProperty({ description: 'Post content.', example: 'This is the content.' })
    content: string

    @ApiProperty({ description: 'Author name.', example: '익명123' })
    authorName: string

    @ApiProperty({ description: 'Masked IP (first 2 octets).', example: '123.456.*.*' })
    ipMasked: string

    @ApiProperty({ description: 'Created timestamp.', example: '2024-01-01T00:00:00.000Z' })
    createdAt: Date

    @ApiProperty({ description: 'Updated timestamp.', example: '2024-01-02T00:00:00.000Z' })
    updatedAt: Date
}

export class AnonymousPostListResponseDto {
    @ApiProperty({ description: 'List items.', type: [AnonymousPostListItemDto] })
    items: AnonymousPostListItemDto[]

    @ApiProperty({ description: 'Pagination metadata.', type: PageMetaDto })
    meta: PageMetaDto
}
