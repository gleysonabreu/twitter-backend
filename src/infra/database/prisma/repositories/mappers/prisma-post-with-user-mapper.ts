import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { PostWithUser } from '@/domain/post/entities/value-objects/post-with-user';
import {
  User as PrismaUser,
  Post as PrismaPost,
  Favorite as PrismaFavorite,
  Like as PrismaLike,
} from '@prisma/client';
import { PrismaUserMapper } from './prisma-user-mapper';

type PrismaPostWithUser = PrismaPost & {
  user: PrismaUser;
  _count: {
    likes: number;
    comments: number;
  };
  favorites: PrismaFavorite[];
  likes: PrismaLike[];
};

export class PrismaPostWithUserMapper {
  static toDomain(raw: PrismaPostWithUser): PostWithUser {
    return PostWithUser.create({
      postId: new UniqueEntityID(raw.id),
      content: raw.content,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      userId: new UniqueEntityID(raw.userId),
      user: PrismaUserMapper.toDomain(raw.user),
      isFavorite: raw.favorites.length > 0,
      isLiked: raw.likes.length > 0,
      totalLikes: raw._count.likes,
      totalComments: raw._count.comments,
    });
  }
}
