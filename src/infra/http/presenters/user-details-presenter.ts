import { UserDetails } from '@/domain/user/entities/value-objects/user-details';

export class UserDetailsPresenter {
  static toHTTP(userDetails: UserDetails) {
    return {
      id: userDetails.userId.toString(),
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      email: userDetails.email,
      username: userDetails.username,
      birthDate: userDetails.birthDate,
      createdAt: userDetails.createdAt,
      bio: userDetails.bio,
      profileImage: userDetails.profileImage,
      coverImage: userDetails.coverImage,
      updatedAt: userDetails.updatedAt,
      totalPosts: userDetails.totalPosts,
      followedBy: userDetails.followedBy,
      following: userDetails.following,
      isFollowing: userDetails.isFollowing,
    };
  }
}
