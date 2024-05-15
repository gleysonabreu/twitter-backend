import { PaginationParams } from '@/core/repositories/pagination-params';
import { Comment } from '../entities/comment';
import { CommentWithUser } from '../entities/value-objects/comment-with-user';

export abstract class CommentsRepository {
  abstract create(comment: Comment): Promise<void>;
  abstract delete(comment: Comment): Promise<void>;
  abstract save(comment: Comment): Promise<void>;
  abstract findById(id: string): Promise<Comment>;
  abstract findByIdDetails(
    commentId: string,
    userId: string,
  ): Promise<CommentWithUser>;
  abstract fetchReplies(
    userId: string,
    commentId: string,
    params: PaginationParams,
  ): Promise<CommentWithUser[]>;
  abstract findByPostId(
    postId: string,
    userId: string,
    params: PaginationParams,
  ): Promise<CommentWithUser[]>;
}
