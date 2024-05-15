import { PaginationParams } from '@/core/repositories/pagination-params';
import { Post } from '../entities/post';
import { PostWithUser } from '../entities/value-objects/post-with-user';

export type FeedProfile = {
  userId: string;
  currentUserId: string;
  params: PaginationParams;
};

export abstract class PostsRepository {
  abstract create(data: Post): Promise<void>;
  abstract findById(id: string): Promise<Post | null>;
  abstract save(post: Post): Promise<void>;
  abstract delete(post: Post): Promise<void>;
  abstract feedProfile(data: FeedProfile): Promise<PostWithUser[]>;
  abstract findDetailsById(
    postId: string,
    userId: string,
  ): Promise<PostWithUser>;
  abstract findByUserId(
    userId: string,
    params: PaginationParams,
  ): Promise<PostWithUser[]>;
  abstract findFavoritePostsByUserId(
    userId: string,
    params: PaginationParams,
  ): Promise<PostWithUser[]>;
  abstract findPostsLiked(
    userId: string,
    params: PaginationParams,
  ): Promise<PostWithUser[]>;
}
