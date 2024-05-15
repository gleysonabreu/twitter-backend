import {
  FeedProfile,
  PostsRepository,
} from '@/domain/post/repositories/posts-repository';
import { PrismaService } from '../prisma.service';
import { Post } from '@/domain/post/entities/post';
import { PrismaPostMapper } from './mappers/prisma-post-mapper';
import { Injectable } from '@nestjs/common';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { PostWithUser } from '@/domain/post/entities/value-objects/post-with-user';
import { PrismaPostWithUserMapper } from './mappers/prisma-post-with-user-mapper';

@Injectable()
export class PrismaPostsRepository implements PostsRepository {
  constructor(private prisma: PrismaService) {}

  async findDetailsById(postId: string, userId: string): Promise<PostWithUser> {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
        user: true,
        favorites: {
          where: {
            userId: userId,
          },
        },
        likes: {
          where: {
            userId: userId,
          },
        },
      },
    });

    if (!post) {
      return null;
    }

    return PrismaPostWithUserMapper.toDomain(post);
  }

  async feedProfile({
    params,
    userId,
    currentUserId,
  }: FeedProfile): Promise<PostWithUser[]> {
    const posts = await this.prisma.post.findMany({
      where: {
        userId,
      },
      include: {
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
        user: true,
        favorites: {
          where: {
            userId: currentUserId,
          },
        },
        likes: {
          where: {
            userId: currentUserId,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (params.page - 1) * 20,
    });

    return posts.map(PrismaPostWithUserMapper.toDomain);
  }

  async findPostsLiked(
    userId: string,
    { page }: PaginationParams,
  ): Promise<PostWithUser[]> {
    const likedPosts = await this.prisma.post.findMany({
      where: {
        likes: {
          some: {
            userId,
          },
        },
      },
      include: {
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
        user: true,
        favorites: true,
        likes: {
          where: {
            userId,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return likedPosts.map(PrismaPostWithUserMapper.toDomain);
  }

  async findFavoritePostsByUserId(
    userId: string,
    { page }: PaginationParams,
  ): Promise<PostWithUser[]> {
    const favorites = await this.prisma.post.findMany({
      where: {
        favorites: {
          some: {
            userId,
          },
        },
      },
      include: {
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
        user: true,
        favorites: true,
        likes: {
          where: {
            userId,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return favorites.map(PrismaPostWithUserMapper.toDomain);
  }

  async findByUserId(
    userId: string,
    { page }: PaginationParams,
  ): Promise<PostWithUser[]> {
    const posts = await this.prisma.post.findMany({
      where: {
        OR: [
          {
            userId,
          },
          {
            user: {
              followedBy: {
                some: {
                  followingId: userId,
                },
              },
            },
          },
        ],
      },
      include: {
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
        user: true,
        favorites: {
          where: {
            userId,
          },
        },
        likes: {
          where: {
            userId,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return posts.map(PrismaPostWithUserMapper.toDomain);
  }

  async delete(post: Post): Promise<void> {
    const data = PrismaPostMapper.toPrisma(post);

    await this.prisma.post.delete({
      where: {
        id: data.id,
      },
    });
  }

  async findById(id: string): Promise<Post | null> {
    const post = await this.prisma.post.findUnique({
      where: {
        id,
      },
    });

    if (!post) {
      return null;
    }

    return PrismaPostMapper.toDomain(post);
  }

  async save(post: Post): Promise<void> {
    const data = PrismaPostMapper.toPrisma(post);

    await this.prisma.post.update({
      where: {
        id: post.id.toString(),
      },
      data,
    });
  }

  async create(post: Post): Promise<void> {
    const data = PrismaPostMapper.toPrisma(post);

    await this.prisma.post.create({
      data,
    });
  }
}
