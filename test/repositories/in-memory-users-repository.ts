import { User } from '@/domain/user/entities/user';
import { UserDetails } from '@/domain/user/entities/value-objects/user-details';
import { UsersRepository } from '@/domain/user/repositories/users-repository';
import { InMemoryPostsRepository } from './in-memory.posts-repository';
import { InMemoryFollowsRepository } from './in-memory-follows-repository';
import { PaginationParams } from '@/core/repositories/pagination-params';

export class InMemoryUsersRepository implements UsersRepository {
  constructor(
    private inMemoryPostsRepository: InMemoryPostsRepository,
    private inMemoryFollowsRepository: InMemoryFollowsRepository,
  ) {}

  async save(user: User): Promise<void> {
    const itemIndex = this.users.findIndex((item) => item.id.equals(user.id));

    this.users[itemIndex] = user;
  }

  async searchUser(
    userId: string,
    query: string,
    { page }: PaginationParams,
  ): Promise<UserDetails[]> {
    const users = this.users
      .filter(
        (user) =>
          user.firstName.toLowerCase().includes(query.toLocaleLowerCase()) ||
          user.lastName.toLowerCase().includes(query.toLocaleLowerCase()) ||
          user.username.toLowerCase().includes(query.toLocaleLowerCase()),
      )
      .map((user) => {
        const totalPosts = this.inMemoryPostsRepository.posts.filter((post) =>
          post.userId.equals(user.id),
        ).length;

        const following = this.inMemoryFollowsRepository.follows.filter(
          (follow) => follow.followingId.equals(user.id),
        ).length;

        const followedBy = this.inMemoryFollowsRepository.follows.filter(
          (follow) => follow.followedById.equals(user.id),
        ).length;

        const isFollowing = this.inMemoryFollowsRepository.follows.find(
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
          totalPosts,
          userId: user.id,
          username: user.username,
          bio: user.bio,
          coverImage: user.coverImage,
          profileImage: user.profileImage,
          updatedAt: user.updatedAt,
          followedBy,
          following,
          isFollowing: !!isFollowing,
        });
      })
      .slice((page - 1) * 20, page * 20);

    return users;
  }

  public users: User[] = [];

  async findDetailsByUsername(
    username: string,
    userId: string,
  ): Promise<UserDetails> {
    const user = this.users.find((user) => user.username === username);

    if (!user) {
      return null;
    }

    const totalPosts = this.inMemoryPostsRepository.posts.filter((post) =>
      post.userId.equals(user.id),
    ).length;

    const following = this.inMemoryFollowsRepository.follows.filter((follow) =>
      follow.followingId.equals(user.id),
    ).length;

    const followedBy = this.inMemoryFollowsRepository.follows.filter((follow) =>
      follow.followedById.equals(user.id),
    ).length;

    const isFollowing =
      await this.inMemoryFollowsRepository.findByFollowingIdAndFollowedBy(
        userId,
        user.id.toString(),
      );

    return UserDetails.create({
      birthDate: user.birthDate,
      createdAt: user.createdAt,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      totalPosts,
      userId: user.id,
      username: user.username,
      bio: user.bio,
      coverImage: user.coverImage,
      profileImage: user.profileImage,
      updatedAt: user.updatedAt,
      followedBy,
      following,
      isFollowing: !!isFollowing,
    });
  }

  async findUserDetailsById(id: string, userId: string): Promise<UserDetails> {
    const user = this.users.find((user) => user.id.toString() === id);

    if (!user) {
      return null;
    }

    const totalPosts = this.inMemoryPostsRepository.posts.filter((post) =>
      post.userId.equals(user.id),
    ).length;

    const following = this.inMemoryFollowsRepository.follows.filter((follow) =>
      follow.followingId.equals(user.id),
    ).length;

    const followedBy = this.inMemoryFollowsRepository.follows.filter((follow) =>
      follow.followedById.equals(user.id),
    ).length;

    const isFollowing =
      await this.inMemoryFollowsRepository.findByFollowingIdAndFollowedBy(
        userId,
        user.id.toString(),
      );

    return UserDetails.create({
      birthDate: user.birthDate,
      createdAt: user.createdAt,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      totalPosts,
      userId: user.id,
      username: user.username,
      bio: user.bio,
      coverImage: user.coverImage,
      profileImage: user.profileImage,
      updatedAt: user.updatedAt,
      followedBy,
      following,
      isFollowing: !!isFollowing,
    });
  }

  async findById(id: string): Promise<User | null> {
    const user = this.users.find((user) => user.id.toString() === id);

    if (!user) {
      return null;
    }

    return user;
  }

  async findByEmailOrUsername(login: string): Promise<User | null> {
    const user = this.users.find(
      (user) => user.email === login || user.username === login,
    );

    if (!user) {
      return null;
    }

    return user;
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = this.users.find((user) => user.username === username);

    if (!user) {
      return null;
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.email === email);

    if (!user) {
      return null;
    }

    return user;
  }

  async create(user: User): Promise<void> {
    this.users.push(user);
  }
}
