import { Post } from '@/domain/post/entities/post';

export class PostPresenter {
  static toHTTP(post: Post) {
    return {
      id: post.id.toString(),
      userId: post.userId.toString(),
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }
}
