import { PaginationParams } from '@/core/repositories/pagination-params';
import { Post } from '@/domain/post/entities/post';
import {
  FeedProfile,
  PostsRepository,
} from '@/domain/post/repositories/posts-repository';
import { InMemoryUsersRepository } from './in-memory-users-repository';
import { PostWithUser } from '@/domain/post/entities/value-objects/post-with-user';
import { InMemoryFavoritesRepository } from './in-memory-favorites-repository';
import { InMemoryLikesRepository } from './in-memory-likes-repository';
import { InMemoryFollowsRepository } from './in-memory-follows-repository';
import { InMemoryCommentsRepository } from './in-memory-comments-repository';

export class InMemoryPostsRepository implements PostsRepository {
  public posts: Post[] = [];

  constructor(
    private inMemoryUsersRepository: InMemoryUsersRepository,
    private inMemoryLikesRepository: InMemoryLikesRepository,
    private inMemoryFavoritesRepository: InMemoryFavoritesRepository,
    private inMemoryFollowsRepository: InMemoryFollowsRepository,
    private inMemoryCommentsRepository: InMemoryCommentsRepository,
  ) {}

  async findDetailsById(postId: string, userId: string): Promise<PostWithUser> {
    const post = this.posts.find((post) => post.id.toString() === postId);

    if (!post) {
      return null;
    }

    const user = this.inMemoryUsersRepository.users.find((user) =>
      user.id.equals(post.userId),
    );

    if (!user) {
      throw new Error(`User with ID ${user.id.toString()} does not exist.`);
    }

    const favorite = this.inMemoryFavoritesRepository.favorites.find(
      (favorite) =>
        favorite.userId.toString() === userId && favorite.postId === post.id,
    );

    const likes = this.inMemoryLikesRepository.likes.filter(
      (like) => like.postId === post.id,
    );

    const liked = this.inMemoryLikesRepository.likes.find(
      (like) => like.postId === post.id && like.userId.toString() === userId,
    );

    const totalComments = this.inMemoryCommentsRepository.comments.filter(
      (comment) => comment.postId.equals(post.id),
    ).length;

    return PostWithUser.create({
      content: post.content,
      createdAt: post.createdAt,
      postId: post.id,
      user: user,
      userId: user.id,
      updatedAt: post.updatedAt,
      isFavorite: !!favorite,
      isLiked: !!liked,
      totalLikes: likes.length,
      totalComments: totalComments,
    });
  }

  async feedProfile({
    params,
    userId,
    currentUserId,
  }: FeedProfile): Promise<PostWithUser[]> {
    const posts = this.posts
      .filter((post) => post.userId.toString() === userId)
      .map((post) => {
        const user = this.inMemoryUsersRepository.users.find((user) =>
          user.id.equals(post.userId),
        );

        if (!user) {
          throw new Error(`User with ID ${user.id.toString()} does not exist.`);
        }

        const favorite = this.inMemoryFavoritesRepository.favorites.find(
          (favorite) =>
            favorite.userId.toString() === currentUserId &&
            favorite.postId === post.id,
        );

        const likes = this.inMemoryLikesRepository.likes.filter(
          (like) => like.postId === post.id,
        );

        const liked = this.inMemoryLikesRepository.likes.find(
          (like) =>
            like.postId === post.id && like.userId.toString() === currentUserId,
        );

        const totalComments = this.inMemoryCommentsRepository.comments.filter(
          (comment) => comment.postId.equals(post.id),
        ).length;

        return PostWithUser.create({
          content: post.content,
          createdAt: post.createdAt,
          postId: post.id,
          user: user,
          userId: user.id,
          updatedAt: post.updatedAt,
          isFavorite: !!favorite,
          isLiked: !!liked,
          totalLikes: likes.length,
          totalComments: totalComments,
        });
      })
      .slice((params.page - 1) * 20, params.page * 20);

    return posts;
  }

  async findPostsLiked(
    userId: string,
    { page }: PaginationParams,
  ): Promise<PostWithUser[]> {
    const posts = this.posts
      .map((post) => {
        const user = this.inMemoryUsersRepository.users.find((user) => {
          return user.id.equals(post.userId);
        });

        if (!user) {
          throw new Error(`User with ID ${user.id.toString()} does not exist.`);
        }

        const favorite = this.inMemoryFavoritesRepository.favorites.find(
          (favorite) =>
            favorite.userId.toString() === userId &&
            favorite.postId === post.id,
        );

        const likes = this.inMemoryLikesRepository.likes.filter(
          (like) => like.postId === post.id,
        );

        const liked = this.inMemoryLikesRepository.likes.find(
          (like) =>
            like.postId === post.id && like.userId.toString() === userId,
        );

        const totalComments = this.inMemoryCommentsRepository.comments.filter(
          (comment) => comment.postId.equals(post.id),
        ).length;

        return PostWithUser.create({
          content: post.content,
          createdAt: post.createdAt,
          postId: post.id,
          user: user,
          userId: user.id,
          updatedAt: post.updatedAt,
          isFavorite: !!favorite,
          isLiked: !!liked,
          totalLikes: likes.length,
          totalComments,
        });
      })
      .filter((post) => post.isLiked)
      .slice((page - 1) * 20, page * 20);

    return posts;
  }

  async findFavoritePostsByUserId(
    userId: string,
    { page }: PaginationParams,
  ): Promise<PostWithUser[]> {
    const posts = this.posts
      .map((post) => {
        const user = this.inMemoryUsersRepository.users.find((user) => {
          return user.id.equals(post.userId);
        });

        if (!user) {
          throw new Error(`User with ID ${user.id.toString()} does not exist.`);
        }

        const favorite = this.inMemoryFavoritesRepository.favorites.find(
          (favorite) =>
            favorite.userId.toString() === userId &&
            favorite.postId === post.id,
        );

        const likes = this.inMemoryLikesRepository.likes.filter(
          (like) => like.postId === post.id,
        );

        const liked = this.inMemoryLikesRepository.likes.find(
          (like) =>
            like.postId === post.id && like.userId.toString() === userId,
        );

        const totalComments = this.inMemoryCommentsRepository.comments.filter(
          (comment) => comment.postId.equals(post.id),
        ).length;

        return PostWithUser.create({
          content: post.content,
          createdAt: post.createdAt,
          postId: post.id,
          user: user,
          userId: user.id,
          updatedAt: post.updatedAt,
          isFavorite: !!favorite,
          isLiked: !!liked,
          totalLikes: likes.length,
          totalComments: totalComments,
        });
      })
      .filter((post) => post.isFavorite)
      .slice((page - 1) * 20, page * 20);

    return posts;
  }

  async findByUserId(userId: string, { page }: PaginationParams) {
    const posts = this.posts
      .filter((post) => {
        const user = this.inMemoryUsersRepository.users.find((user) => {
          return user.id.equals(post.userId);
        });

        const followedBy = this.inMemoryFollowsRepository.follows.find(
          (follow) =>
            follow.followingId.toString() === userId &&
            follow.followedById.toString() === user.id.toString(),
        );

        if (post.userId.toString() === userId || followedBy) {
          return post;
        }
      })
      .map((post) => {
        const user = this.inMemoryUsersRepository.users.find((user) => {
          return user.id.equals(post.userId);
        });

        if (!user) {
          throw new Error(`User with ID ${user.id.toString()} does not exist.`);
        }

        const favorite = this.inMemoryFavoritesRepository.favorites.find(
          (favorite) =>
            favorite.userId.toString() === userId &&
            favorite.postId === post.id,
        );

        const likes = this.inMemoryLikesRepository.likes.filter(
          (like) => like.postId === post.id,
        );

        const liked = this.inMemoryLikesRepository.likes.find(
          (like) =>
            like.postId === post.id && like.userId.toString() === userId,
        );

        const totalComments = this.inMemoryCommentsRepository.comments.filter(
          (comment) => comment.postId.equals(post.id),
        ).length;

        return PostWithUser.create({
          content: post.content,
          createdAt: post.createdAt,
          postId: post.id,
          user: user,
          userId: user.id,
          updatedAt: post.updatedAt,
          isFavorite: !!favorite,
          isLiked: !!liked,
          totalLikes: likes.length,
          totalComments,
        });
      })
      .slice((page - 1) * 20, page * 20);

    return posts;
  }

  async delete(post: Post): Promise<void> {
    const itemIndex = this.posts.findIndex((item) => item.id === post.id);
    this.posts.splice(itemIndex, 1);
  }

  async findById(id: string): Promise<Post | null> {
    const user = this.posts.find((post) => post.id.toString() === id);

    if (!user) {
      return null;
    }

    return user;
  }

  async save(post: Post): Promise<void> {
    const itemIndex = this.posts.findIndex(
      (item) => item.id.toString() === post.id.toString(),
    );

    this.posts[itemIndex] = post;
  }

  async create(data: Post): Promise<void> {
    this.posts.push(data);
  }
}
