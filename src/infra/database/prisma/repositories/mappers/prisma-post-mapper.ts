import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Post } from '@/domain/post/entities/post';
import { Prisma, Post as PrismaPost } from '@prisma/client';

export class PrismaPostMapper {
  static toDomain(post: PrismaPost): Post {
    return Post.create(
      {
        content: post.content,
        userId: new UniqueEntityID(post.userId),
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      },
      new UniqueEntityID(post.id),
    );
  }

  static toPrisma(post: Post): Prisma.PostUncheckedCreateInput {
    return {
      id: post.id.toString(),
      content: post.content,
      userId: post.userId.toString(),
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }
}
