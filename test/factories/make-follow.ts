import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Follow, FollowProps } from '@/domain/user/entities/follow';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaFollowMapper } from '@/infra/database/prisma/repositories/mappers/prisma-follow-mapper';
import { Injectable } from '@nestjs/common';

export function makeFollow(
  override: Partial<FollowProps> = {},
  id?: UniqueEntityID,
) {
  const follow = Follow.create(
    {
      followedById: new UniqueEntityID(),
      followingId: new UniqueEntityID(),
      ...override,
    },
    id,
  );

  return follow;
}

@Injectable()
export class FollowFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaFollow(data: Partial<FollowProps> = {}): Promise<Follow> {
    const follow = makeFollow(data);

    await this.prisma.follow.create({
      data: PrismaFollowMapper.toPrisma(follow),
    });

    return follow;
  }
}
