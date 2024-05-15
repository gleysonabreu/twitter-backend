import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';
import { FavoritesRepository } from '@/domain/post/repositories/favorites-repository';
import { Favorite } from '@/domain/post/entities/favorites';
import { PrismaFavoriteMapper } from './mappers/prisma-favorite-mapper';

@Injectable()
export class PrismaFavoritesRepository implements FavoritesRepository {
  constructor(private prisma: PrismaService) {}

  async delete(favorite: Favorite): Promise<void> {
    const data = PrismaFavoriteMapper.toPrisma(favorite);

    await this.prisma.favorite.delete({
      where: {
        id: data.id,
      },
    });
  }

  async findByUserIdAndPostId(
    userId: string,
    postId: string,
  ): Promise<Favorite | null> {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (!favorite) {
      return null;
    }

    return PrismaFavoriteMapper.toDomain(favorite);
  }

  async create(favorite: Favorite): Promise<void> {
    const data = PrismaFavoriteMapper.toPrisma(favorite);

    await this.prisma.favorite.create({ data });
  }
}
