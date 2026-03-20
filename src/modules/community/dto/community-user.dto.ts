import { PickType } from '@nestjs/swagger'
import { UserResponseDto } from 'modules/users/dto'

export class CommunityUserBriefDto extends PickType(UserResponseDto, [
    'id',
    'username',
    'nickname',
    'description',
    'profileImage',
    'role',
] as const) {}
