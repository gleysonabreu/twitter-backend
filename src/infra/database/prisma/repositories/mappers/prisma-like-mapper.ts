import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Like } from '@/domain/post/entities/like';
import { Prisma, Like as PrismaLike } from '@prisma/client';

export class PrismaLikeMapper {
  static toDomain(like: PrismaLike): Like {
    return Like.create(
      {
        postId: new UniqueEntityID(like.postId),
        userId: new UniqueEntityID(like.userId),
        createdAt: like.createdAt,
      },
      new UniqueEntityID(like.id),
    );
  }

  static toPrisma(like: Like): Prisma.LikeUncheckedCreateInput {
    return {
      id: like.id.toString(),
      postId: like.postId.toString(),
      userId: like.userId.toString(),
      createdAt: like.createdAt,
    };
  }
}
