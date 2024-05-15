import { PaginationParams } from '@/core/repositories/pagination-params';
import { Follow } from '@/domain/user/entities/follow';
import { UserDetails } from '@/domain/user/entities/value-objects/user-details';
import { FollowsRepository } from '@/domain/user/repositories/follows-repository';
import { InMemoryUsersRepository } from './in-memory-users-repository';
import { InMemoryPostsRepository } from './in-memory.posts-repository';

export class InMemoryFollowsRepository implements FollowsRepository {
  public follows: Follow[] = [];

  constructor(
    private inMemoryUsersRepository: InMemoryUsersRepository,
    private inMemoryPostsRepository: InMemoryPostsRepository,
  ) {}

  async fetchFollowers(
    followedById: string,
    userId: string,
    { page }: PaginationParams,
  ): Promise<UserDetails[]> {
    const following = this.follows
      .filter((follow) => follow.followedById.toString() === followedById)
      .map((follow) => {
        const user = this.inMemoryUsersRepository.users.find((user) => {
          return user.id.equals(follow.followingId);
        });

        if (!user) {
          throw new Error(`User with ID ${user.id.toString()} does not exist.`);
        }

        const totalPosts = this.inMemoryPostsRepository.posts.filter((post) =>
          post.userId.equals(user.id),
        ).length;

        const following = this.follows.filter((follow) =>
          follow.followingId.equals(user.id),
        ).length;

        const followedBy = this.follows.filter((follow) =>
          follow.followedById.equals(user.id),
        ).length;

        const isFollowing = this.follows.find(
          (follow) =>
            follow.followingId.toString() === userId &&
            follow.followedById.equals(user.id),
        );

        return UserDetails.create({
          birthDate: user.birthDate,
          createdAt: user.createdAt,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          bio: user.bio,
          coverImage: user.coverImage,
          profileImage: user.profileImage,
          updatedAt: user.updatedAt,
          totalPosts,
          userId: user.id,
          followedBy,
          following,
          isFollowing: !!isFollowing,
        });
      })
      .slice((page - 1) * 20, page * 20);

    return following;
  }

  async fetchFollowing(
    followingId: string,
    userId: string,
    { page }: PaginationParams,
  ): Promise<UserDetails[]> {
    const following = this.follows
      .filter((follow) => follow.followingId.toString() === followingId)
      .map((follow) => {
        const user = this.inMemoryUsersRepository.users.find((user) => {
          return user.id.equals(follow.followedById);
        });

        if (!user) {
          throw new Error(`User with ID ${user.id.toString()} does not exist.`);
        }

        const totalPosts = this.inMemoryPostsRepository.posts.filter((post) =>
          post.userId.equals(user.id),
        ).length;

        const following = this.follows.filter((follow) =>
          follow.followingId.equals(user.id),
        ).length;

        const followedBy = this.follows.filter((follow) =>
          follow.followedById.equals(user.id),
        ).length;

        const isFollowing = this.follows.find(
          (follow) =>
            follow.followingId.toString() === userId &&
            follow.followedById.toString() === user.id.toString(),
        );

        return UserDetails.create({
          birthDate: user.birthDate,
          createdAt: user.createdAt,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          bio: user.bio,
          coverImage: user.coverImage,
          profileImage: user.profileImage,
          updatedAt: user.updatedAt,
          totalPosts,
          userId: user.id,
          followedBy,
          following,
          isFollowing: !!isFollowing,
        });
      })
      .slice((page - 1) * 20, page * 20);

    return following;
  }

  async create(follow: Follow): Promise<void> {
    this.follows.push(follow);
  }
  async delete(followDelete: Follow): Promise<void> {
    const findIndexFollow = this.follows.findIndex(
      (follow) =>
        follow.followingId.equals(followDelete.followingId) &&
        follow.followedById.equals(followDelete.followedById),
    );

    this.follows.splice(findIndexFollow, 1);
  }

  async findByFollowingIdAndFollowedBy(
    followingId: string,
    followedById: string,
  ): Promise<Follow> {
    const follows = this.follows.find(
      (follow) =>
        follow.followingId.toString() === followingId &&
        follow.followedById.toString() === followedById,
    );

    if (!follows) {
      return null;
    }

    return follows;
  }
}
