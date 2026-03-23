import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt, IsOptional, Max, Min } from 'class-validator'

export class PageQueryDto {
    @ApiProperty({ description: 'Page number (1-based).', example: 1, required: false })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    page?: number = 1

    @ApiProperty({ description: 'Page size.', example: 20, required: false })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(50)
    @IsOptional()
    size?: number = 20
}

export class PageMetaDto {
    @ApiProperty({ description: 'Page number (1-based).', example: 1 })
    page: number

    @ApiProperty({ description: 'Page size.', example: 20 })
    size: number

    @ApiProperty({ description: 'Total items.', example: 120 })
    total: number
}

export class CursorQueryDto {
    @ApiProperty({ description: 'Cursor ID (last item id).', example: 100, required: false })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    cursor?: number

    @ApiProperty({ description: 'Page size.', example: 20, required: false })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(50)
    @IsOptional()
    size?: number = 20
}

export class CursorMetaDto {
    @ApiProperty({ description: 'Page size.', example: 20 })
    size: number

    @ApiProperty({ description: 'Next cursor ID (null when no more).', example: 120, nullable: true })
    nextCursor?: number | null
}
