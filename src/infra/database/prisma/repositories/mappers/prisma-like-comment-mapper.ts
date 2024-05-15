import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { LikeComment } from '@/domain/post/entities/like-comment';
import { Prisma, LikeComment as PrismaLikeComment } from '@prisma/client';

export class PrismaLikeCommentMapper {
  static toDomain(likeComment: PrismaLikeComment): LikeComment {
    return LikeComment.create(
      {
        commentId: new UniqueEntityID(likeComment.commentId),
        userId: new UniqueEntityID(likeComment.userId),
        createdAt: likeComment.createdAt,
      },
      new UniqueEntityID(likeComment.id),
    );
  }

  static toPrisma(
    likeComment: LikeComment,
  ): Prisma.LikeCommentUncheckedCreateInput {
    return {
      id: likeComment.id.toString(),
      commentId: likeComment.commentId.toString(),
      userId: likeComment.userId.toString(),
      createdAt: likeComment.createdAt,
    };
  }
}
