import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { User } from '@/domain/user/entities/user';
import { Prisma, User as PrismaUser } from '@prisma/client';

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    return User.create(
      {
        birthDate: raw.birthDate,
        email: raw.email,
        firstName: raw.firstName,
        lastName: raw.lastName,
        password: raw.password,
        username: raw.username,
        bio: raw.bio,
        coverImage: raw.coverImage,
        createdAt: raw.createdAt,
        profileImage: raw.profileImage,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id.toString(),
      birthDate: user.birthDate,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      password: user.password,
      username: user.username,
      bio: user.bio,
      coverImage: user.coverImage,
      createdAt: user.createdAt,
      profileImage: user.profileImage,
      updatedAt: user.updatedAt,
    };
  }
}
