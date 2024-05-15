import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UsersRepository } from '@/domain/user/repositories/users-repository';
import { User } from '@/domain/user/entities/user';
import { PrismaUserMapper } from './mappers/prisma-user-mapper';
import { UserDetails } from '@/domain/user/entities/value-objects/user-details';
import { PrismaUserDetailsMapper } from './mappers/prisma-user-details-mapper';
import { PaginationParams } from '@/core/repositories/pagination-params';

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private prisma: PrismaService) {}

  async save(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user);

    await this.prisma.user.update({
      where: {
        id: user.id.toString(),
      },
      data,
    });
  }

  async searchUser(
    userId: string,
    query: string,
    { page }: PaginationParams,
  ): Promise<UserDetails[]> {
    const users = await this.prisma.user.findMany({
      where: {
        OR: [
          {
            firstName: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            lastName: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            username: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      include: {
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
      take: 20,
      skip: (page - 1) * 20,
    });

    return users.map(PrismaUserDetailsMapper.toDomain);
  }

  async findDetailsByUsername(
    username: string,
    userId: string,
  ): Promise<UserDetails> {
    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
      include: {
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
    });

    if (!user) {
      return null;
    }

    return PrismaUserDetailsMapper.toDomain(user);
  }

  async findUserDetailsById(id: string, userId: string): Promise<UserDetails> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
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
    });

    if (!user) {
      return null;
    }

    return PrismaUserDetailsMapper.toDomain(user);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }

  async findByEmailOrUsername(login: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          {
            username: login,
          },
          {
            email: login,
          },
        ],
      },
    });

    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }

  async create(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user);

    await this.prisma.user.create({
      data,
    });
  }
}
