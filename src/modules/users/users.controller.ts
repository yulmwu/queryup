import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common'
import { UsersService } from './users.service'
import { ApiOperation, ApiResponse, ApiTags, ApiNotFoundResponse, ApiBearerAuth } from '@nestjs/swagger'
import { UsernameDto, UserResponseDto } from './dto'
import { MaybeAuthenticatedRequest } from 'common/types/express-request.interface'
import { JwtOptionalAuthGuard } from 'common/guards/jwt-optional-auth.guard'

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @UseGuards(JwtOptionalAuthGuard)
    @ApiBearerAuth()
    @Get(':username')
    @ApiOperation({ summary: 'Get a user by username' })
    @ApiResponse({ status: 200, description: 'Return a user by username.', type: UserResponseDto })
    @ApiNotFoundResponse({ description: 'User not found.' })
    findByUsername(
        @Param() { username }: UsernameDto,
        @Request() req: MaybeAuthenticatedRequest,
    ): Promise<UserResponseDto> {
        return this.usersService.findByUsername(username, req.user?.userId)
    }
}
