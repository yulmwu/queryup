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
import { User } from 'modules/users/users.entity'
import { TopicPost } from './topic-post.entity'

@Entity('topic_post_comments')
export class TopicPostComment {
    @PrimaryGeneratedColumn()
    id: number

    @Index()
    @ManyToOne(() => TopicPost)
    @JoinColumn({ name: 'postId' })
    post: TopicPost

    @Index()
    @ManyToOne(() => TopicPostComment, { nullable: true })
    @JoinColumn({ name: 'parentId' })
    parent?: TopicPostComment | null

    @RelationId((comment: TopicPostComment) => comment.parent)
    parentId?: number | null

    @Column({ type: 'text', nullable: true })
    content: string | null

    @ManyToOne(() => User, { eager: true })
    author: User

    @Index()
    @Column({ type: 'boolean', default: false })
    isDeleted: boolean

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date
}
