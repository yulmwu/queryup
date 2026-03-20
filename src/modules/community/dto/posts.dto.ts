import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsNotEmpty, IsString, MaxLength, Matches } from 'class-validator'

export class PostTitleDto {
    @ApiProperty({ description: 'Post title.', example: 'Hello world' })
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString()
    @IsNotEmpty()
    @Matches(/\S/, { message: 'Title must contain at least one non-space character.' })
    @MaxLength(200)
    title: string
}

export class PostContentDto {
    @ApiProperty({ description: 'Post content.', example: 'This is the content.' })
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString()
    @IsNotEmpty()
    @Matches(/\S/, { message: 'Content must contain at least one non-space character.' })
    content: string
}

export class AnonymousAuthorDto {
    @ApiProperty({ description: 'Anonymous author name.', example: '익명123' })
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString()
    @IsNotEmpty()
    @Matches(/\S/, { message: 'Author name must contain at least one non-space character.' })
    @MaxLength(32)
    authorName: string
}

export class AnonymousPasswordDto {
    @ApiProperty({ description: 'Password for edit/delete.', example: 'secret1234' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    password: string
}

export class TopicSlugDto {
    @ApiProperty({ description: 'Topic slug.', example: 'game-dev' })
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString()
    @IsNotEmpty()
    @Matches(/\S/, { message: 'Slug must contain at least one non-space character.' })
    @MaxLength(64)
    @Matches(/^[a-z0-9-]+$/, { message: 'Slug must be lowercase letters, numbers, or hyphens.' })
    slug: string
}

export class TopicNameDto {
    @ApiProperty({ description: 'Topic name.', example: 'Graphics' })
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString()
    @IsNotEmpty()
    @Matches(/\S/, { message: 'Name must contain at least one non-space character.' })
    @MaxLength(100)
    name: string
}

export class TopicDescriptionDto {
    @ApiProperty({ description: 'Topic description.', example: 'All about graphics.' })
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString()
    @IsNotEmpty()
    @Matches(/\S/, { message: 'Description must contain at least one non-space character.' })
    @MaxLength(255)
    description: string
}
