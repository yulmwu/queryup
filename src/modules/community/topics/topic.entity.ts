import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm'
import { User } from 'modules/users/users.entity'

@Entity('topics')
export class Topic {
    @PrimaryGeneratedColumn()
    id: number

    @Index({ unique: true })
    @Column({ type: 'varchar', length: 64 })
    slug: string

    @Column({ type: 'varchar', length: 100 })
    name: string

    @Column({ type: 'varchar', length: 255 })
    description: string

    @ManyToOne(() => User, { eager: true })
    creator: User

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date
}
