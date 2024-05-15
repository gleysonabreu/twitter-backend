import { LikeComment } from '@/domain/post/entities/like-comment';
import { LikesCommentRepository } from '@/domain/post/repositories/likes-comment-repository';

export class InMemoryLikesCommentRepository implements LikesCommentRepository {
  public likeComments: LikeComment[] = [];

  async findByUserIdAndCommentId(
    userId: string,
    commentId: string,
  ): Promise<LikeComment> {
    const likeComment = this.likeComments.find(
      (likeComment) =>
        likeComment.userId.toString() === userId &&
        likeComment.commentId.toString() === commentId,
    );

    if (!likeComment) {
      return null;
    }

    return likeComment;
  }

  async create(likeComment: LikeComment): Promise<void> {
    this.likeComments.push(likeComment);
  }

  async delete(likeComment: LikeComment): Promise<void> {
    const likeIndex = this.likeComments.findIndex(
      (item) => item.id === likeComment.id,
    );
    this.likeComments.splice(likeIndex, 1);
  }
}
