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
import { PageQueryDto } from 'common/dto'
import { AuthenticatedRequest } from 'common/types/express-request.interface'
import { GeneralPostsService } from './general-posts.service'
import {
    GeneralPostCreateDto,
    GeneralPostDetailDto,
    GeneralPostListResponseDto,
    GeneralPostUpdateDto,
} from './general-post.dto'

@ApiTags('Community - General')
@Controller('community/general/posts')
export class GeneralPostsController {
    constructor(private generalPostsService: GeneralPostsService) {}

    @Get()
    @ApiOperation({ summary: 'List general board posts' })
    @ApiResponse({ status: 200, description: 'Return general board posts.', type: GeneralPostListResponseDto })
    list(@Query() query: PageQueryDto) {
        return this.generalPostsService.list(query.page, query.size)
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get general board post detail' })
    @ApiResponse({ status: 200, description: 'Return general board post detail.', type: GeneralPostDetailDto })
    @ApiNotFoundResponse({ description: 'Post not found.' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.generalPostsService.findOne(id)
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post()
    @ApiOperation({ summary: 'Create general board post' })
    @ApiResponse({ status: 201, description: 'General post created.', type: GeneralPostDetailDto })
    @ApiUnauthorizedResponse({ description: 'User is not authenticated.' })
    create(@Body() dto: GeneralPostCreateDto, @Request() req: AuthenticatedRequest) {
        return this.generalPostsService.create(req.user.userId, dto)
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Put(':id')
    @ApiOperation({ summary: 'Update general board post' })
    @ApiResponse({ status: 200, description: 'General post updated.', type: GeneralPostDetailDto })
    @ApiUnauthorizedResponse({ description: 'User is not authenticated.' })
    @ApiForbiddenResponse({ description: 'You are not allowed to update this post.' })
    @ApiNotFoundResponse({ description: 'Post not found.' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: GeneralPostUpdateDto,
        @Request() req: AuthenticatedRequest,
    ) {
        return this.generalPostsService.update(id, req.user.userId, dto)
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Delete(':id')
    @ApiOperation({ summary: 'Delete general board post' })
    @ApiResponse({ status: 204, description: 'General post deleted.' })
    @ApiUnauthorizedResponse({ description: 'User is not authenticated.' })
    @ApiForbiddenResponse({ description: 'You are not allowed to delete this post.' })
    @ApiNotFoundResponse({ description: 'Post not found.' })
    @HttpCode(204)
    async remove(@Param('id', ParseIntPipe) id: number, @Request() req: AuthenticatedRequest) {
        await this.generalPostsService.remove(id, req.user.userId)
    }
}
