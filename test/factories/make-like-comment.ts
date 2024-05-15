import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  LikeCommentProps,
  LikeComment,
} from '@/domain/post/entities/like-comment';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaLikeCommentMapper } from '@/infra/database/prisma/repositories/mappers/prisma-like-comment-mapper';
import { Injectable } from '@nestjs/common';

export function makeLikeComment(
  override: Partial<LikeCommentProps> = {},
  id?: UniqueEntityID,
) {
  const likeComment = LikeComment.create(
    {
      commentId: new UniqueEntityID(),
      userId: new UniqueEntityID(),
      ...override,
    },
    id,
  );

  return likeComment;
}

@Injectable()
export class LikeCommentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaLike(
    data: Partial<LikeCommentProps> = {},
  ): Promise<LikeComment> {
    const likeComment = makeLikeComment(data);

    await this.prisma.likeComment.create({
      data: PrismaLikeCommentMapper.toPrisma(likeComment),
    });

    return likeComment;
  }
}
