import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'
import { Exclude } from 'class-transformer'

export enum UserRole {
    ADMIN = 0,
    USER = 1,
}

export enum UserDepartment {
    SMART_SECURITY_SOLUTION = 1,
    MOBILITY_MAKER = 2,
    AI_SOFTWARE = 3,
    GAME_SOFTWARE = 4,
}

export enum UserStatus {
    STUDENT = 1,
    TEACHER = 2,
    GRADUATE = 3,
    OTHER = 4,
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar', length: 32, unique: true })
    username: string

    @Column({ type: 'varchar', length: 32, nullable: true })
    nickname?: string

    @Exclude()
    @Column({ type: 'varchar', length: 255, select: false })
    password: string

    @Column({ type: 'varchar', length: 320, unique: true })
    email: string

    @Column({ type: 'varchar', length: 255, nullable: true })
    description?: string

    @Column({ type: 'varchar', length: 255, nullable: true })
    profileImage?: string

    @Column({ type: 'varchar', length: 5 })
    studentNumber: string

    @Column({ type: 'smallint' })
    department: UserDepartment

    @Column({ type: 'boolean', default: false })
    isVerified: boolean

    @Column({ type: 'smallint', default: UserStatus.STUDENT })
    status: UserStatus

    @Column({ type: 'varchar', length: 255, nullable: true })
    club?: string

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role: UserRole

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date
}
