import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Comment, CommentProps } from '@/domain/post/entities/comment';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaCommentMapper } from '@/infra/database/prisma/repositories/mappers/prisma-comment-mapper';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

export function makeComment(
  override: Partial<CommentProps> = {},
  id?: UniqueEntityID,
) {
  const comment = Comment.create(
    {
      content: faker.lorem.text(),
      userId: new UniqueEntityID(),
      postId: new UniqueEntityID(),
      ...override,
    },
    id,
  );

  return comment;
}

@Injectable()
export class CommentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaComment(data: Partial<CommentProps> = {}): Promise<Comment> {
    const comment = makeComment(data);

    await this.prisma.comment.create({
      data: PrismaCommentMapper.toPrisma(comment),
    });

    return comment;
  }
}
