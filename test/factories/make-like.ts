import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Like, LikeProps } from '@/domain/post/entities/like';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaLikeMapper } from '@/infra/database/prisma/repositories/mappers/prisma-like-mapper';
import { Injectable } from '@nestjs/common';

export function makeLike(
  override: Partial<LikeProps> = {},
  id?: UniqueEntityID,
) {
  const like = Like.create(
    {
      postId: new UniqueEntityID(),
      userId: new UniqueEntityID(),
      ...override,
    },
    id,
  );

  return like;
}

@Injectable()
export class LikeFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaLike(data: Partial<LikeProps> = {}): Promise<Like> {
    const like = makeLike(data);

    await this.prisma.like.create({
      data: PrismaLikeMapper.toPrisma(like),
    });

    return like;
  }
}
