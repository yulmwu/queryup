import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, MaxLength, Matches, IsOptional, IsInt, IsEnum, IsBoolean } from 'class-validator'
import { Type } from 'class-transformer'
import { UserDepartment, UserStatus } from '../users.entity'

export class UsernameDto {
    @ApiProperty({
        description: 'The username of the user.',
        example: 'foo',
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(32)
    @Matches(/^[a-z0-9_]+$/, { message: 'The username must be lowercase letters, numbers, or underscores.' })
    username: string
}

export class NicknameDto {
    @ApiProperty({
        description: 'The nickname of the user.',
        example: 'Kim Jun Young',
    })
    @IsString()
    @MaxLength(32)
    @IsOptional()
    nickname?: string
}

export class PasswordDto {
    @ApiProperty({
        description: 'The password of the user.',
        example: 'securePassword1234@',
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    password: string
}

export class EmailDto {
    @ApiProperty({
        description: 'The email address of the user.',
        example: 'foo@example.com',
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(320)
    @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    email: string
}

export class UserDescriptionDto {
    @ApiProperty({
        description: 'A brief description of the user.',
        example: 'Hello, I am a software developer.',
    })
    @IsString()
    @IsOptional()
    @MaxLength(255)
    description?: string
}

export class ProfileImageDto {
    @ApiProperty({
        description: "The path to the user's profile image.",
        example: 'uploads/profile/1/profile.png',
    })
    @IsString()
    @IsOptional()
    @Matches(/^uploads\/profile\/\d+\/profile\.(jpg|jpeg|png|gif)$/)
    profileImage?: string
}

export class RoleDto {
    @ApiProperty({
        description: 'The role of the user. 0 for admin, 1 for user.',
        example: 1,
    })
    @IsInt()
    @IsNotEmpty()
    role: number
}

export class StudentNumberDto {
    @ApiProperty({
        description:
            'Student number in 5-digit format. Example: 30201 -> Grade 3, Class 02, No. 01. Class/No must be zero-padded.',
        example: '30201',
    })
    @IsString()
    @IsNotEmpty()
    @Matches(/^[1-3](0[1-9]|[1-9][0-9])(0[1-9]|[1-9][0-9])$/, {
        message: 'Student number must be 5 digits: G(1-3) + class(01-99) + number(01-99).',
    })
    studentNumber: string
}

export class DepartmentDto {
    @ApiProperty({
        description:
            'Department code. 1: 스마트보안솔루션과, 2: 모빌리티메이커과, 3: 인공지능소프트웨어과, 4: 게임소프트웨어과',
        enum: UserDepartment,
        enumName: 'UserDepartment',
        example: UserDepartment.SMART_SECURITY_SOLUTION,
    })
    @Type(() => Number)
    @IsEnum(UserDepartment)
    department: UserDepartment
}

export class VerifiedDto {
    @ApiProperty({
        description: 'Whether the user has been verified by an admin.',
        example: false,
    })
    @IsBoolean()
    isVerified: boolean
}

export class StatusDto {
    @ApiProperty({
        description: 'User status. 1: 재학생, 2: 선생님, 3: 졸업생, 4: 기타',
        enum: UserStatus,
        enumName: 'UserStatus',
        example: UserStatus.STUDENT,
    })
    @Type(() => Number)
    @IsEnum(UserStatus)
    status: UserStatus
}

export class ClubDto {
    @ApiProperty({
        description: 'Club name (free text).',
        example: '로봇 동아리',
        required: false,
    })
    @IsString()
    @IsOptional()
    @MaxLength(255)
    club?: string
}
