import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Comment } from '@/domain/post/entities/comment';
import { Prisma, Comment as PrismaComment } from '@prisma/client';

export class PrismaCommentMapper {
  static toDomain(comment: PrismaComment): Comment {
    return Comment.create(
      {
        content: comment.content,
        userId: new UniqueEntityID(comment.userId),
        postId: new UniqueEntityID(comment.postId),
        parentId: comment.parentId
          ? new UniqueEntityID(comment.parentId)
          : null,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      },
      new UniqueEntityID(comment.id),
    );
  }

  static toPrisma(comment: Comment): Prisma.CommentUncheckedCreateInput {
    return {
      id: comment.id.toString(),
      postId: comment.postId.toString(),
      parentId: comment.parentId ? comment.parentId.toString() : null,
      content: comment.content,
      userId: comment.userId.toString(),
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }
}
