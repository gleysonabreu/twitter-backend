import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { FavoriteProps, Favorite } from '@/domain/post/entities/favorites';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaFavoriteMapper } from '@/infra/database/prisma/repositories/mappers/prisma-favorite-mapper';
import { Injectable } from '@nestjs/common';

export function makeFavorite(
  override: Partial<FavoriteProps> = {},
  id?: UniqueEntityID,
) {
  const favorite = Favorite.create(
    {
      postId: new UniqueEntityID(),
      userId: new UniqueEntityID(),
      ...override,
    },
    id,
  );

  return favorite;
}

@Injectable()
export class FavoriteFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaFavorite(
    data: Partial<FavoriteProps> = {},
  ): Promise<Favorite> {
    const favorite = makeFavorite(data);

    await this.prisma.favorite.create({
      data: PrismaFavoriteMapper.toPrisma(favorite),
    });

    return favorite;
  }
}
