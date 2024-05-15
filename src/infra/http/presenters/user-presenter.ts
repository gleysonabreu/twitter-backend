import { User } from '@/domain/user/entities/user';

export class UserPresenter {
  static toHTTP(user: User) {
    return {
      id: user.id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      coverImage: user.coverImage,
      profileImage: user.profileImage,
      bio: user.bio,
      email: user.email,
      password: null,
      username: user.username,
      birthDate: user.birthDate,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
