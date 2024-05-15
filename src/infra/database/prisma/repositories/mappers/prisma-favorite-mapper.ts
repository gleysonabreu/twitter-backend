import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Favorite } from '@/domain/post/entities/favorites';
import { Prisma, Favorite as PrismaFavorite } from '@prisma/client';

export class PrismaFavoriteMapper {
  static toDomain(favorite: PrismaFavorite): Favorite {
    return Favorite.create(
      {
        postId: new UniqueEntityID(favorite.postId),
        userId: new UniqueEntityID(favorite.userId),
        createdAt: favorite.createdAt,
      },
      new UniqueEntityID(favorite.id),
    );
  }

  static toPrisma(favorite: Favorite): Prisma.FavoriteUncheckedCreateInput {
    return {
      id: favorite.id.toString(),
      postId: favorite.postId.toString(),
      userId: favorite.userId.toString(),
      createdAt: favorite.createdAt,
    };
  }
}
