import { PostWithUser } from '@/domain/post/entities/value-objects/post-with-user';
import { UserPresenter } from './user-presenter';

export class PostWithUserPresenter {
  static toHTTP(postWithUser: PostWithUser) {
    return {
      id: postWithUser.postId.toString(),
      content: postWithUser.content,
      userId: postWithUser.userId.toString(),
      isFavorite: postWithUser.isFavorite,
      isLiked: postWithUser.isLiked,
      totalLikes: postWithUser.totalLikes,
      totalComments: postWithUser.totalComments,
      user: UserPresenter.toHTTP(postWithUser.user),
      createdAt: postWithUser.createdAt,
      updatedAt: postWithUser.updatedAt,
    };
  }
}
