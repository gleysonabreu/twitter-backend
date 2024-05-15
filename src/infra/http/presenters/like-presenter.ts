import { Like } from '@/domain/post/entities/like';

export class LikePresenter {
  static toHTTP(like: Like) {
    return {
      id: like.id.toString(),
      postId: like.postId.toString(),
      userId: like.userId.toString(),
      createdAt: like.createdAt,
    };
  }
}
