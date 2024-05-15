import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { UserDetails } from '@/domain/user/entities/value-objects/user-details';
import { Follow as PrismaFollow, User as PrismaUser } from '@prisma/client';

type PrismaUserDetails = PrismaUser & {
  _count: {
    posts: number;
    followedBy: number;
    following: number;
  };

  followedBy: PrismaFollow[];
};

export class PrismaUserDetailsMapper {
  static toDomain(raw: PrismaUserDetails): UserDetails {
    return UserDetails.create({
      birthDate: raw.birthDate,
      createdAt: raw.createdAt,
      email: raw.email,
      firstName: raw.firstName,
      lastName: raw.lastName,
      totalPosts: raw._count.posts,
      userId: new UniqueEntityID(raw.id),
      username: raw.username,
      bio: raw.bio,
      coverImage: raw.coverImage,
      profileImage: raw.profileImage,
      updatedAt: raw.updatedAt,
      followedBy: raw._count.followedBy,
      following: raw._count.following,
      isFollowing: raw.followedBy?.length > 0,
    });
  }
}
