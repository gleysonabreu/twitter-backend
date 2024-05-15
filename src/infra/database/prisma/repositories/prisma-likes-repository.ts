import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';
import { LikesRepository } from '@/domain/post/repositories/likes-repository';
import { PrismaLikeMapper } from './mappers/prisma-like-mapper';
import { Like } from '@/domain/post/entities/like';

@Injectable()
export class PrismaLikesRepository implements LikesRepository {
  constructor(private prisma: PrismaService) {}

  async delete(like: Like): Promise<void> {
    const data = PrismaLikeMapper.toPrisma(like);

    await this.prisma.like.delete({
      where: {
        id: data.id,
      },
    });
  }

  async findByUserIdAndPostId(
    userId: string,
    postId: string,
  ): Promise<Like | null> {
    const like = await this.prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (!like) {
      return null;
    }

    return PrismaLikeMapper.toDomain(like);
  }

  async create(like: Like): Promise<void> {
    const data = PrismaLikeMapper.toPrisma(like);

    await this.prisma.like.create({ data });
  }
}
