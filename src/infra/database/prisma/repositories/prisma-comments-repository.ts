import { CommentsRepository } from '@/domain/post/repositories/comments-repository';
import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { Comment } from '@/domain/post/entities/comment';
import { CommentWithUser } from '@/domain/post/entities/value-objects/comment-with-user';
import { PrismaCommentMapper } from './mappers/prisma-comment-mapper';
import { PrismaCommentWithUserMapper } from './mappers/prisma-comment-with-user-mapper';

@Injectable()
export class PrismaCommentsRepository implements CommentsRepository {
  constructor(private prisma: PrismaService) {}

  async findByIdDetails(
    commentId: string,
    userId: string,
  ): Promise<CommentWithUser> {
    const comment = await this.prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      include: {
        _count: {
          select: {
            replies: true,
            likesComment: true,
          },
        },
        likesComment: {
          where: {
            userId,
          },
        },
        parent: {
          include: {
            _count: {
              select: {
                replies: true,
                likesComment: true,
              },
            },
            likesComment: {
              where: {
                userId,
              },
            },
            user: true,
          },
        },
        user: true,
      },
    });

    if (!comment) {
      return null;
    }

    return PrismaCommentWithUserMapper.toDomain(comment);
  }

  async fetchReplies(
    userId: string,
    commentId: string,
    { page }: PaginationParams,
  ): Promise<CommentWithUser[]> {
    const comments = await this.prisma.comment.findMany({
      where: {
        parentId: commentId,
      },
      include: {
        _count: {
          select: {
            replies: true,
            likesComment: true,
          },
        },
        likesComment: {
          where: {
            userId,
          },
        },
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return comments.map(PrismaCommentWithUserMapper.toDomain);
  }

  async delete(comment: Comment): Promise<void> {
    const data = PrismaCommentMapper.toPrisma(comment);

    await this.prisma.comment.delete({
      where: {
        id: data.id,
      },
    });
  }

  async create(comment: Comment): Promise<void> {
    const data = PrismaCommentMapper.toPrisma(comment);
    await this.prisma.comment.create({ data });
  }

  async save(comment: Comment): Promise<void> {
    const data = PrismaCommentMapper.toPrisma(comment);

    await this.prisma.comment.update({
      where: {
        id: comment.id.toString(),
      },
      data,
    });
  }

  async findById(id: string): Promise<Comment> {
    const comment = await this.prisma.comment.findUnique({
      where: {
        id,
      },
    });

    if (!comment) {
      return null;
    }

    return PrismaCommentMapper.toDomain(comment);
  }

  async findByPostId(
    postId: string,
    userId: string,
    { page }: PaginationParams,
  ): Promise<CommentWithUser[]> {
    const comments = await this.prisma.comment.findMany({
      where: {
        AND: [
          {
            postId,
          },
          {
            parentId: null,
          },
        ],
      },
      include: {
        _count: {
          select: {
            replies: true,
            likesComment: true,
          },
        },
        likesComment: {
          where: {
            userId,
          },
        },
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return comments.map(PrismaCommentWithUserMapper.toDomain);
  }
}
