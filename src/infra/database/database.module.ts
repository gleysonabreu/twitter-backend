import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UsersRepository } from '@/domain/user/repositories/users-repository';
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository';
import { PostsRepository } from '@/domain/post/repositories/posts-repository';
import { PrismaPostsRepository } from './prisma/repositories/prisma-posts-repository';
import { FavoritesRepository } from '@/domain/post/repositories/favorites-repository';
import { PrismaFavoritesRepository } from './prisma/repositories/prisma-favorites-repository';
import { LikesRepository } from '@/domain/post/repositories/likes-repository';
import { PrismaLikesRepository } from './prisma/repositories/prisma-likes-repository';
import { FollowsRepository } from '@/domain/user/repositories/follows-repository';
import { PrismaFollowsRepository } from './prisma/repositories/prisma-follows-repository';
import { CommentsRepository } from '@/domain/post/repositories/comments-repository';
import { PrismaCommentsRepository } from './prisma/repositories/prisma-comments-repository';
import { LikesCommentRepository } from '@/domain/post/repositories/likes-comment-repository';
import { PrismaLikesCommentRepository } from './prisma/repositories/prisma-likes-comment-repository';
import { VerificationTokensRepository } from '@/domain/user/repositories/verification-tokens-repository';
import { PrismaVerificationTokensRepository } from './prisma/repositories/prisma-verification-tokens-repository';

@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: PostsRepository,
      useClass: PrismaPostsRepository,
    },
    {
      provide: FavoritesRepository,
      useClass: PrismaFavoritesRepository,
    },
    {
      provide: LikesRepository,
      useClass: PrismaLikesRepository,
    },
    {
      provide: FollowsRepository,
      useClass: PrismaFollowsRepository,
    },
    {
      provide: CommentsRepository,
      useClass: PrismaCommentsRepository,
    },
    {
      provide: LikesCommentRepository,
      useClass: PrismaLikesCommentRepository,
    },
    {
      provide: VerificationTokensRepository,
      useClass: PrismaVerificationTokensRepository,
    },
  ],
  exports: [
    PrismaService,
    UsersRepository,
    PostsRepository,
    FavoritesRepository,
    LikesRepository,
    FollowsRepository,
    CommentsRepository,
    LikesCommentRepository,
    VerificationTokensRepository,
  ],
})
export class DatabaseModule {}
