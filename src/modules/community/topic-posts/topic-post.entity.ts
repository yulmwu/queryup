import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm'
import { User } from 'modules/users/users.entity'
import { Topic } from '../topics/topic.entity'

@Entity('topic_posts')
export class TopicPost {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Topic, { eager: true })
    topic: Topic

    @Column({ type: 'varchar', length: 200 })
    title: string

    @Column({ type: 'text' })
    content: string

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
