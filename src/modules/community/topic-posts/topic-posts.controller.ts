import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Post,
    Put,
    Query,
    Request,
    UseGuards,
    ParseIntPipe,
} from '@nestjs/common'
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
    ApiNotFoundResponse,
    ApiUnauthorizedResponse,
    ApiForbiddenResponse,
} from '@nestjs/swagger'
import { JwtAuthGuard } from 'common/guards/jwt-auth.guard'
import { PageQueryDto } from 'common/dto'
import { TopicPostsService } from './topic-posts.service'
import { TopicPostCreateDto, TopicPostUpdateDto, TopicPostDetailDto, TopicPostListResponseDto } from './topic-post.dto'
import { AuthenticatedRequest } from 'common/types/express-request.interface'

@ApiTags('Community - Topic Posts')
@Controller('community/topics/:slug/posts')
export class TopicPostsController {
    constructor(private topicPostsService: TopicPostsService) {}

    @Get()
    @ApiOperation({ summary: 'List topic posts' })
    @ApiResponse({ status: 200, description: 'Return topic posts.', type: TopicPostListResponseDto })
    @ApiNotFoundResponse({ description: 'Topic not found.' })
    list(@Param('slug') slug: string, @Query() query: PageQueryDto) {
        return this.topicPostsService.list(slug, query.page, query.size)
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get topic post detail' })
    @ApiResponse({ status: 200, description: 'Return topic post detail.', type: TopicPostDetailDto })
    @ApiNotFoundResponse({ description: 'Topic not found.' })
    @ApiNotFoundResponse({ description: 'Post not found.' })
    findOne(@Param('slug') slug: string, @Param('id', ParseIntPipe) id: number) {
        return this.topicPostsService.findOne(slug, id)
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post()
    @ApiOperation({ summary: 'Create topic post' })
    @ApiResponse({ status: 201, description: 'Topic post created.', type: TopicPostDetailDto })
    @ApiUnauthorizedResponse({ description: 'User is not authenticated.' })
    @ApiNotFoundResponse({ description: 'Topic not found.' })
    create(@Param('slug') slug: string, @Body() dto: TopicPostCreateDto, @Request() req: AuthenticatedRequest) {
        return this.topicPostsService.create(slug, req.user.userId, dto)
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Put(':id')
    @ApiOperation({ summary: 'Update topic post' })
    @ApiResponse({ status: 200, description: 'Topic post updated.', type: TopicPostDetailDto })
    @ApiUnauthorizedResponse({ description: 'User is not authenticated.' })
    @ApiForbiddenResponse({ description: 'You are not allowed to update this post.' })
    @ApiNotFoundResponse({ description: 'Topic or post not found.' })
    update(
        @Param('slug') slug: string,
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: TopicPostUpdateDto,
        @Request() req: AuthenticatedRequest,
    ) {
        return this.topicPostsService.update(slug, id, req.user.userId, dto)
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Delete(':id')
    @ApiOperation({ summary: 'Delete topic post' })
    @ApiResponse({ status: 204, description: 'Topic post deleted.' })
    @ApiUnauthorizedResponse({ description: 'User is not authenticated.' })
    @ApiForbiddenResponse({ description: 'You are not allowed to delete this post.' })
    @ApiNotFoundResponse({ description: 'Topic or post not found.' })
    @HttpCode(204)
    async remove(
        @Param('slug') slug: string,
        @Param('id', ParseIntPipe) id: number,
        @Request() req: AuthenticatedRequest,
    ) {
        await this.topicPostsService.remove(slug, id, req.user.userId)
    }
}
