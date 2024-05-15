import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  User as PrismaUser,
  Comment as PrismaComment,
  LikeComment as PrismaLikeComment,
} from '@prisma/client';
import { CommentWithUser } from '@/domain/post/entities/value-objects/comment-with-user';
import { PrismaUserMapper } from './prisma-user-mapper';

type PrismaCommentWithUser = PrismaComment & {
  _count: {
    replies: number;
    likesComment: number;
  };
  user: PrismaUser;
  likesComment: PrismaLikeComment[];
  parent?: PrismaCommentWithUser | null;
};

export class PrismaCommentWithUserMapper {
  static toDomain(raw: PrismaCommentWithUser): CommentWithUser {
    return CommentWithUser.create({
      commentId: new UniqueEntityID(raw.id),
      content: raw.content,
      createdAt: raw.createdAt,
      postId: new UniqueEntityID(raw.postId),
      userId: new UniqueEntityID(raw.userId),
      updatedAt: raw.updatedAt,
      parentId: raw.parentId ? new UniqueEntityID(raw.parentId) : null,
      user: PrismaUserMapper.toDomain(raw.user),
      totalComments: raw._count.replies,
      totalLikes: raw._count.likesComment,
      isLiked: raw.likesComment.length > 0,
      parent: raw.parent
        ? PrismaCommentWithUserMapper.toDomain(raw.parent)
        : null,
    });
  }
}
