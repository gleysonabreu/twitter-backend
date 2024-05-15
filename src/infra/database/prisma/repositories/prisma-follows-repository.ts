import { Follow } from '@/domain/user/entities/follow';
import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';
import { PrismaFollowMapper } from './mappers/prisma-follow-mapper';
import { FollowsRepository } from '@/domain/user/repositories/follows-repository';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { UserDetails } from '@/domain/user/entities/value-objects/user-details';
import { PrismaUserDetailsMapper } from './mappers/prisma-user-details-mapper';

@Injectable()
export class PrismaFollowsRepository implements FollowsRepository {
  constructor(private prisma: PrismaService) {}
  async fetchFollowers(
    followedById: string,
    userId: string,
    { page }: PaginationParams,
  ): Promise<UserDetails[]> {
    const followings = await this.prisma.follow.findMany({
      where: {
        followedById,
      },
      include: {
        following: {
          select: {
            bio: true,
            birthDate: true,
            coverImage: true,
            createdAt: true,
            email: true,
            firstName: true,
            id: true,
            lastName: true,
            password: true,
            profileImage: true,
            updatedAt: true,
            username: true,
            _count: {
              select: {
                posts: true,
                followedBy: true,
                following: true,
              },
            },
            followedBy: {
              where: {
                followingId: userId,
              },
            },
          },
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return followings.map((follow) =>
      PrismaUserDetailsMapper.toDomain({ ...follow.following }),
    );
  }

  async fetchFollowing(
    followingId: string,
    userId: string,
    { page }: PaginationParams,
  ): Promise<UserDetails[]> {
    const followings = await this.prisma.follow.findMany({
      where: {
        followingId,
      },
      include: {
        followedBy: {
          select: {
            bio: true,
            birthDate: true,
            coverImage: true,
            createdAt: true,
            email: true,
            firstName: true,
            id: true,
            lastName: true,
            password: true,
            profileImage: true,
            updatedAt: true,
            username: true,
            _count: {
              select: {
                posts: true,
                followedBy: true,
                following: true,
              },
            },
            followedBy: {
              where: {
                followingId: userId,
              },
            },
          },
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return followings.map((follow) =>
      PrismaUserDetailsMapper.toDomain(follow.followedBy),
    );
  }

  async findByFollowingIdAndFollowedBy(
    followingId: string,
    followedById: string,
  ): Promise<Follow> {
    const follow = await this.prisma.follow.findUnique({
      where: {
        followingId_followedById: {
          followedById,
          followingId,
        },
      },
    });

    if (!follow) {
      return null;
    }

    return PrismaFollowMapper.toDomain(follow);
  }

  async delete(follow: Follow): Promise<void> {
    const data = PrismaFollowMapper.toPrisma(follow);

    await this.prisma.follow.delete({
      where: {
        followingId_followedById: {
          followedById: data.followedById,
          followingId: data.followingId,
        },
      },
    });
  }

  async create(follow: Follow): Promise<void> {
    const data = PrismaFollowMapper.toPrisma(follow);

    await this.prisma.follow.create({ data });
  }
}
