import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
    JoinColumn,
    RelationId,
} from 'typeorm'
import { AnonymousPost } from './anonymous-post.entity'

@Entity('anonymous_comments')
export class AnonymousComment {
    @PrimaryGeneratedColumn()
    id: number

    @Index()
    @ManyToOne(() => AnonymousPost)
    @JoinColumn({ name: 'postId' })
    post: AnonymousPost

    @Index()
    @ManyToOne(() => AnonymousComment, { nullable: true })
    @JoinColumn({ name: 'parentId' })
    parent?: AnonymousComment | null

    @RelationId((comment: AnonymousComment) => comment.parent)
    parentId?: number | null

    @Column({ type: 'text', nullable: true })
    content: string | null

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
