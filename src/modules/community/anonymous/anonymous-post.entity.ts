import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm'

@Entity('anonymous_posts')
export class AnonymousPost {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar', length: 200 })
    title: string

    @Column({ type: 'text' })
    content: string

    @Column({ type: 'varchar', length: 32 })
    authorName: string

    @Column({ type: 'varchar', length: 255, select: false })
    passwordHash: string

    @Column({ type: 'varchar', length: 64 })
    ipAddress: string

    @Index()
    @Column({ type: 'boolean', default: false })
    isDeleted: boolean

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date
}
