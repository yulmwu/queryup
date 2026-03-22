import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from 'modules/users/users.module'

import { AnonymousPost } from './anonymous/anonymous-post.entity'
import { AnonymousComment } from './anonymous/anonymous-comment.entity'
import { Topic } from './topics/topic.entity'
import { TopicPost } from './topic-posts/topic-post.entity'
import { TopicPostComment } from './topic-posts/topic-post-comment.entity'

import { AnonymousPostsService } from './anonymous/anonymous-posts.service'
import { AnonymousCommentsService } from './anonymous/anonymous-comments.service'
import { TopicsService } from './topics/topics.service'
import { TopicPostsService } from './topic-posts/topic-posts.service'
import { TopicPostCommentsService } from './topic-posts/topic-post-comments.service'

import { AnonymousPostsController } from './anonymous/anonymous-posts.controller'
import { AnonymousCommentsController } from './anonymous/anonymous-comments.controller'
import { TopicsController } from './topics/topics.controller'
import { TopicPostsController } from './topic-posts/topic-posts.controller'
import { TopicPostCommentsController } from './topic-posts/topic-post-comments.controller'

@Module({
    imports: [
        TypeOrmModule.forFeature([AnonymousPost, AnonymousComment, Topic, TopicPost, TopicPostComment]),
        UsersModule,
    ],
    providers: [
        AnonymousPostsService,
        AnonymousCommentsService,
        TopicsService,
        TopicPostsService,
        TopicPostCommentsService,
    ],
    controllers: [
        AnonymousPostsController,
        AnonymousCommentsController,
        TopicsController,
        TopicPostsController,
        TopicPostCommentsController,
    ],
})
export class CommunityModule {}
