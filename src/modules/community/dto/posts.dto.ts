import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MaxLength, Matches } from 'class-validator'

export class PostTitleDto {
    @ApiProperty({ description: 'Post title.', example: 'Hello world' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    title: string
}

export class PostContentDto {
    @ApiProperty({ description: 'Post content.', example: 'This is the content.' })
    @IsString()
    @IsNotEmpty()
    content: string
}

export class AnonymousAuthorDto {
    @ApiProperty({ description: 'Anonymous author name.', example: '익명123' })
    @IsString()
    @IsNotEmpty()
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
    @IsString()
    @IsNotEmpty()
    @MaxLength(64)
    @Matches(/^[a-z0-9-]+$/, { message: 'Slug must be lowercase letters, numbers, or hyphens.' })
    slug: string
}

export class TopicNameDto {
    @ApiProperty({ description: 'Topic name.', example: 'Graphics' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name: string
}

export class TopicDescriptionDto {
    @ApiProperty({ description: 'Topic description.', example: 'All about graphics.' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    description: string
}
