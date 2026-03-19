import { IntersectionType, PartialType } from '@nestjs/swagger'
import { NicknameDto, ProfileImageDto, UserDescriptionDto, StudentNumberDto, DepartmentDto, ClubDto } from './base.dto'

export class UserUpdateRequestDto extends PartialType(
    IntersectionType(NicknameDto, UserDescriptionDto, ProfileImageDto, StudentNumberDto, DepartmentDto, ClubDto),
) {}
