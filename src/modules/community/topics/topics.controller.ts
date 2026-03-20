import { Body, Controller, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common'
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
    ApiNotFoundResponse,
    ApiUnauthorizedResponse,
    ApiForbiddenResponse,
    ApiConflictResponse,
} from '@nestjs/swagger'
import { JwtAuthGuard } from 'common/guards/jwt-auth.guard'
import { PageQueryDto } from 'common/dto'
import { TopicsService } from './topics.service'
import { TopicCreateDto, TopicUpdateDto, TopicDetailDto, TopicListResponseDto } from './topic.dto'
import { AuthenticatedRequest } from 'common/types/express-request.interface'

@ApiTags('Community - Topics')
@Controller('community/topics')
export class TopicsController {
    constructor(private topicsService: TopicsService) {}

    @Get()
    @ApiOperation({ summary: 'List topics' })
    @ApiResponse({ status: 200, description: 'Return topics.', type: TopicListResponseDto })
    list(@Query() query: PageQueryDto) {
        return this.topicsService.list(query.page, query.size)
    }

    @Get(':slug')
    @ApiOperation({ summary: 'Get topic detail' })
    @ApiResponse({ status: 200, description: 'Return topic detail.', type: TopicDetailDto })
    @ApiNotFoundResponse({ description: 'Topic not found.' })
    findOne(@Param('slug') slug: string) {
        return this.topicsService.findBySlug(slug)
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post()
    @ApiOperation({ summary: 'Create topic' })
    @ApiResponse({ status: 201, description: 'Topic created.', type: TopicDetailDto })
    @ApiUnauthorizedResponse({ description: 'User is not authenticated.' })
    @ApiConflictResponse({ description: 'Slug already exists.' })
    create(@Body() dto: TopicCreateDto, @Request() req: AuthenticatedRequest) {
        return this.topicsService.create(req.user.userId, dto)
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Put(':slug')
    @ApiOperation({ summary: 'Update topic' })
    @ApiResponse({ status: 200, description: 'Topic updated.', type: TopicDetailDto })
    @ApiUnauthorizedResponse({ description: 'User is not authenticated.' })
    @ApiForbiddenResponse({ description: 'You are not allowed to update this topic.' })
    @ApiNotFoundResponse({ description: 'Topic not found.' })
    @ApiConflictResponse({ description: 'Slug already exists.' })
    update(@Param('slug') slug: string, @Body() dto: TopicUpdateDto, @Request() req: AuthenticatedRequest) {
        return this.topicsService.update(slug, req.user.userId, dto)
    }
}
