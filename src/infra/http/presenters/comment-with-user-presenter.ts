import { CommentWithUser } from '@/domain/post/entities/value-objects/comment-with-user';
import { UserPresenter } from './user-presenter';

export class CommentWithUserPresenter {
  static toHTTP(commentWithUser: CommentWithUser) {
    return {
      id: commentWithUser.commentId.toString(),
      postId: commentWithUser.postId.toString(),
      userId: commentWithUser.userId.toString(),
      parentId: commentWithUser.parentId
        ? commentWithUser.parentId.toString()
        : null,
      parent: commentWithUser.parent
        ? CommentWithUserPresenter.toHTTP(commentWithUser.parent)
        : null,
      content: commentWithUser.content,
      user: UserPresenter.toHTTP(commentWithUser.user),
      totalComments: commentWithUser.totalComments,
      totalLikes: commentWithUser.totalLikes,
      isLiked: commentWithUser.isLiked,
      createdAt: commentWithUser.createdAt,
      updatedAt: commentWithUser.updatedAt,
    };
  }
}
