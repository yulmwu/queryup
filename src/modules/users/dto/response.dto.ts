import { IntersectionType } from '@nestjs/swagger'
import { CreatedAtDto, IdDto } from 'common/dto'
import {
    EmailDto,
    NicknameDto,
    UsernameDto,
    RoleDto,
    UserDescriptionDto,
    ProfileImageDto,
    StudentNumberDto,
    DepartmentDto,
    StatusDto,
    ClubDto,
    VerifiedDto,
} from '.'

export class UserResponseDto extends IntersectionType(
    IdDto,
    UsernameDto,
    NicknameDto,
    EmailDto,
    UserDescriptionDto,
    ProfileImageDto,
    StudentNumberDto,
    DepartmentDto,
    StatusDto,
    ClubDto,
    VerifiedDto,
    CreatedAtDto,
    RoleDto,
) {}

export class UserBriefResponseDto extends IntersectionType(
    IdDto,
    UsernameDto,
    NicknameDto,
    UserDescriptionDto,
    ProfileImageDto,
    StudentNumberDto,
    DepartmentDto,
    StatusDto,
    ClubDto,
    VerifiedDto,
    RoleDto,
) {}
