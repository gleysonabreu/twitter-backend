import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Follow } from '@/domain/user/entities/follow';
import { Prisma, Follow as PrismaFollow } from '@prisma/client';

export class PrismaFollowMapper {
  static toDomain(follow: PrismaFollow): Follow {
    return Follow.create({
      followedById: new UniqueEntityID(follow.followedById),
      followingId: new UniqueEntityID(follow.followingId),
    });
  }

  static toPrisma(follow: Follow): Prisma.FollowUncheckedCreateInput {
    return {
      followedById: follow.followedById.toString(),
      followingId: follow.followingId.toString(),
    };
  }
}
