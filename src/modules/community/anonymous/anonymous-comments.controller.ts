import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put, Query, Request } from '@nestjs/common'
import { ApiNotFoundResponse, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { PageQueryDto, CursorQueryDto } from 'common/dto'
import { AnonymousCommentsService } from './anonymous-comments.service'
import {
    AnonymousCommentCreateDto,
    AnonymousCommentUpdateDto,
    AnonymousCommentDeleteDto,
    AnonymousCommentListResponseDto,
    AnonymousReplyListResponseDto,
} from './anonymous-comment.dto'
import { Request as ExpressRequest } from 'express'

const extractIp = (req: ExpressRequest) => {
    return req.ip ?? '0.0.0.0'
}

@ApiTags('Community - Anonymous Comments')
@Controller('community/anonymous/posts/:postId/comments')
export class AnonymousCommentsController {
    constructor(private anonCommentsService: AnonymousCommentsService) {}

    @Get()
    @ApiOperation({ summary: 'List anonymous post comments' })
    @ApiResponse({ status: 200, description: 'Return anonymous post comments.', type: AnonymousCommentListResponseDto })
    @ApiNotFoundResponse({ description: 'Post not found.' })
    list(@Param('postId', ParseIntPipe) postId: number, @Query() query: PageQueryDto) {
        return this.anonCommentsService.list(postId, query.page, query.size)
    }

    @Get(':commentId/replies')
    @ApiOperation({ summary: 'List anonymous post comment replies' })
    @ApiResponse({ status: 200, description: 'Return comment replies.', type: AnonymousReplyListResponseDto })
    @ApiNotFoundResponse({ description: 'Post or comment not found.' })
    listReplies(
        @Param('postId', ParseIntPipe) postId: number,
        @Param('commentId', ParseIntPipe) commentId: number,
        @Query() query: CursorQueryDto,
    ) {
        return this.anonCommentsService.listReplies(postId, commentId, query.cursor, query.size)
    }

    @Post()
    @ApiOperation({ summary: 'Create anonymous post comment' })
    @ApiResponse({ status: 201, description: 'Comment created.' })
    @ApiNotFoundResponse({ description: 'Post not found.' })
    create(
        @Param('postId', ParseIntPipe) postId: number,
        @Body() dto: AnonymousCommentCreateDto,
        @Request() req: ExpressRequest,
    ) {
        return this.anonCommentsService.create(postId, dto, extractIp(req))
    }

    @Post(':commentId/replies')
    @ApiOperation({ summary: 'Create anonymous post comment reply' })
    @ApiResponse({ status: 201, description: 'Reply created.' })
    @ApiNotFoundResponse({ description: 'Post or comment not found.' })
    createReply(
        @Param('postId', ParseIntPipe) postId: number,
        @Param('commentId', ParseIntPipe) commentId: number,
        @Body() dto: AnonymousCommentCreateDto,
        @Request() req: ExpressRequest,
    ) {
        return this.anonCommentsService.createReply(postId, commentId, dto, extractIp(req))
    }

    @Put(':commentId')
    @ApiOperation({ summary: 'Update anonymous post comment' })
    @ApiResponse({ status: 200, description: 'Comment updated.' })
    @ApiUnauthorizedResponse({ description: 'Invalid password.' })
    @ApiNotFoundResponse({ description: 'Post or comment not found.' })
    update(
        @Param('postId', ParseIntPipe) postId: number,
        @Param('commentId', ParseIntPipe) commentId: number,
        @Body() dto: AnonymousCommentUpdateDto,
    ) {
        return this.anonCommentsService.update(postId, commentId, dto)
    }

    @Delete(':commentId')
    @ApiOperation({ summary: 'Delete anonymous post comment' })
    @ApiResponse({ status: 204, description: 'Comment deleted.' })
    @ApiUnauthorizedResponse({ description: 'Invalid password.' })
    @ApiNotFoundResponse({ description: 'Post or comment not found.' })
    @HttpCode(204)
    async remove(
        @Param('postId', ParseIntPipe) postId: number,
        @Param('commentId', ParseIntPipe) commentId: number,
        @Body() dto: AnonymousCommentDeleteDto,
    ) {
        await this.anonCommentsService.remove(postId, commentId, dto)
    }
}
