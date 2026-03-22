import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    Request,
    UseGuards,
} from '@nestjs/common'
import {
    ApiBearerAuth,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOperation,
    ApiResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { JwtAuthGuard } from 'common/guards/jwt-auth.guard'
import { PageQueryDto, CursorQueryDto } from 'common/dto'
import { AuthenticatedRequest } from 'common/types/express-request.interface'
import { TopicPostCommentsService } from './topic-post-comments.service'
import {
    TopicPostCommentCreateDto,
    TopicPostCommentUpdateDto,
    TopicPostCommentListResponseDto,
    TopicPostReplyListResponseDto,
} from './topic-post-comment.dto'

@ApiTags('Community - Topic Comments')
@Controller('community/topics/:slug/posts/:postId/comments')
export class TopicPostCommentsController {
    constructor(private topicPostCommentsService: TopicPostCommentsService) {}

    @Get()
    @ApiOperation({ summary: 'List topic post comments' })
    @ApiResponse({ status: 200, description: 'Return topic post comments.', type: TopicPostCommentListResponseDto })
    @ApiNotFoundResponse({ description: 'Topic or post not found.' })
    list(@Param('slug') slug: string, @Param('postId', ParseIntPipe) postId: number, @Query() query: PageQueryDto) {
        return this.topicPostCommentsService.list(slug, postId, query.page, query.size)
    }

    @Get(':commentId/replies')
    @ApiOperation({ summary: 'List topic post comment replies' })
    @ApiResponse({ status: 200, description: 'Return comment replies.', type: TopicPostReplyListResponseDto })
    @ApiNotFoundResponse({ description: 'Topic, post, or comment not found.' })
    listReplies(
        @Param('slug') slug: string,
        @Param('postId', ParseIntPipe) postId: number,
        @Param('commentId', ParseIntPipe) commentId: number,
        @Query() query: CursorQueryDto,
    ) {
        return this.topicPostCommentsService.listReplies(slug, postId, commentId, query.cursor, query.size)
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post()
    @ApiOperation({ summary: 'Create topic post comment' })
    @ApiResponse({ status: 201, description: 'Comment created.' })
    @ApiUnauthorizedResponse({ description: 'User is not authenticated.' })
    @ApiNotFoundResponse({ description: 'Topic or post not found.' })
    create(
        @Param('slug') slug: string,
        @Param('postId', ParseIntPipe) postId: number,
        @Body() dto: TopicPostCommentCreateDto,
        @Request() req: AuthenticatedRequest,
    ) {
        return this.topicPostCommentsService.create(slug, postId, req.user.userId, dto)
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post(':commentId/replies')
    @ApiOperation({ summary: 'Create topic post comment reply' })
    @ApiResponse({ status: 201, description: 'Reply created.' })
    @ApiUnauthorizedResponse({ description: 'User is not authenticated.' })
    @ApiNotFoundResponse({ description: 'Topic, post, or comment not found.' })
    createReply(
        @Param('slug') slug: string,
        @Param('postId', ParseIntPipe) postId: number,
        @Param('commentId', ParseIntPipe) commentId: number,
        @Body() dto: TopicPostCommentCreateDto,
        @Request() req: AuthenticatedRequest,
    ) {
        return this.topicPostCommentsService.createReply(slug, postId, commentId, req.user.userId, dto)
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Put(':commentId')
    @ApiOperation({ summary: 'Update topic post comment' })
    @ApiResponse({ status: 200, description: 'Comment updated.' })
    @ApiUnauthorizedResponse({ description: 'User is not authenticated.' })
    @ApiForbiddenResponse({ description: 'You are not allowed to update this comment.' })
    @ApiNotFoundResponse({ description: 'Topic, post, or comment not found.' })
    update(
        @Param('slug') slug: string,
        @Param('postId', ParseIntPipe) postId: number,
        @Param('commentId', ParseIntPipe) commentId: number,
        @Body() dto: TopicPostCommentUpdateDto,
        @Request() req: AuthenticatedRequest,
    ) {
        return this.topicPostCommentsService.update(slug, postId, commentId, req.user.userId, dto)
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Delete(':commentId')
    @ApiOperation({ summary: 'Delete topic post comment' })
    @ApiResponse({ status: 204, description: 'Comment deleted.' })
    @ApiUnauthorizedResponse({ description: 'User is not authenticated.' })
    @ApiForbiddenResponse({ description: 'You are not allowed to delete this comment.' })
    @ApiNotFoundResponse({ description: 'Topic, post, or comment not found.' })
    @HttpCode(204)
    async remove(
        @Param('slug') slug: string,
        @Param('postId', ParseIntPipe) postId: number,
        @Param('commentId', ParseIntPipe) commentId: number,
        @Request() req: AuthenticatedRequest,
    ) {
        await this.topicPostCommentsService.remove(slug, postId, commentId, req.user.userId)
    }
}
