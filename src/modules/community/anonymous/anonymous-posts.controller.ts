import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, Request } from '@nestjs/common'
import { ApiNotFoundResponse, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { PageQueryDto } from 'common/dto'
import { AnonymousPostsService } from './anonymous-posts.service'
import {
    AnonymousPostCreateDto,
    AnonymousPostUpdateDto,
    AnonymousPostDeleteDto,
    AnonymousPostDetailDto,
    AnonymousPostListResponseDto,
} from './anonymous-post.dto'
import { Request as ExpressRequest } from 'express'

const extractIp = (req: ExpressRequest) => {
    const forwarded = req.headers['x-forwarded-for']
    if (typeof forwarded === 'string' && forwarded.length > 0) {
        return forwarded.split(',')[0].trim()
    }

    return req.ip
}

@ApiTags('Community - Anonymous')
@Controller('community/anonymous/posts')
export class AnonymousPostsController {
    constructor(private anonPostsService: AnonymousPostsService) {}

    @Get()
    @ApiOperation({ summary: 'List anonymous board posts' })
    @ApiResponse({ status: 200, description: 'Return anonymous board posts.', type: AnonymousPostListResponseDto })
    list(@Query() query: PageQueryDto) {
        return this.anonPostsService.list(query.page, query.size)
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get anonymous board post detail' })
    @ApiResponse({ status: 200, description: 'Return anonymous board post detail.', type: AnonymousPostDetailDto })
    @ApiNotFoundResponse({ description: 'Post not found.' })
    findOne(@Param('id') id: number) {
        return this.anonPostsService.findOne(id)
    }

    @Post()
    @ApiOperation({ summary: 'Create anonymous board post' })
    @ApiResponse({ status: 201, description: 'Anonymous post created.', type: AnonymousPostDetailDto })
    create(@Body() dto: AnonymousPostCreateDto, @Request() req: ExpressRequest) {
        return this.anonPostsService.create(dto, extractIp(req))
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update anonymous board post' })
    @ApiResponse({ status: 200, description: 'Anonymous post updated.', type: AnonymousPostDetailDto })
    @ApiUnauthorizedResponse({ description: 'Invalid password.' })
    @ApiNotFoundResponse({ description: 'Post not found.' })
    update(@Param('id') id: number, @Body() dto: AnonymousPostUpdateDto) {
        return this.anonPostsService.update(id, dto)
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete anonymous board post' })
    @ApiResponse({ status: 204, description: 'Anonymous post deleted.' })
    @ApiUnauthorizedResponse({ description: 'Invalid password.' })
    @ApiNotFoundResponse({ description: 'Post not found.' })
    @HttpCode(204)
    async remove(@Param('id') id: number, @Body() dto: AnonymousPostDeleteDto) {
        await this.anonPostsService.remove(id, dto)
    }
}
