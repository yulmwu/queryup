import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from 'modules/users/users.module'

import { AnonymousPost } from './anonymous/anonymous-post.entity'
import { Topic } from './topics/topic.entity'
import { GeneralPost } from './general/general-post.entity'
import { TopicPost } from './topic-posts/topic-post.entity'

import { AnonymousPostsService } from './anonymous/anonymous-posts.service'
import { TopicsService } from './topics/topics.service'
import { GeneralPostsService } from './general/general-posts.service'
import { TopicPostsService } from './topic-posts/topic-posts.service'

import { AnonymousPostsController } from './anonymous/anonymous-posts.controller'
import { TopicsController } from './topics/topics.controller'
import { GeneralPostsController } from './general/general-posts.controller'
import { TopicPostsController } from './topic-posts/topic-posts.controller'

@Module({
    imports: [TypeOrmModule.forFeature([GeneralPost, AnonymousPost, Topic, TopicPost]), UsersModule],
    providers: [GeneralPostsService, AnonymousPostsService, TopicsService, TopicPostsService],
    controllers: [GeneralPostsController, AnonymousPostsController, TopicsController, TopicPostsController],
})
export class CommunityModule {}
