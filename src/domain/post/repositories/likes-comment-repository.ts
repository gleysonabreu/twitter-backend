import { LikeComment } from '../entities/like-comment';

export abstract class LikesCommentRepository {
  abstract findByUserIdAndCommentId(
    userId: string,
    commentId: string,
  ): Promise<LikeComment | null>;
  abstract create(likeComment: LikeComment): Promise<void>;
  abstract delete(likeComment: LikeComment): Promise<void>;
}
