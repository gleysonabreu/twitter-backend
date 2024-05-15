import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';
import { LikesCommentRepository } from '@/domain/post/repositories/likes-comment-repository';
import { PrismaLikeCommentMapper } from './mappers/prisma-like-comment-mapper';
import { LikeComment } from '@/domain/post/entities/like-comment';

@Injectable()
export class PrismaLikesCommentRepository implements LikesCommentRepository {
  constructor(private prisma: PrismaService) {}

  async delete(likeComment: LikeComment): Promise<void> {
    const data = PrismaLikeCommentMapper.toPrisma(likeComment);

    await this.prisma.likeComment.delete({
      where: {
        id: data.id,
      },
    });
  }

  async findByUserIdAndCommentId(
    userId: string,
    commentId: string,
  ): Promise<LikeComment | null> {
    const likeComment = await this.prisma.likeComment.findUnique({
      where: {
        userId_commentId: {
          userId,
          commentId,
        },
      },
    });

    if (!likeComment) {
      return null;
    }

    return PrismaLikeCommentMapper.toDomain(likeComment);
  }

  async create(likeComment: LikeComment): Promise<void> {
    const data = PrismaLikeCommentMapper.toPrisma(likeComment);

    await this.prisma.likeComment.create({ data });
  }
}
