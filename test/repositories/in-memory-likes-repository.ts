import { Like } from '@/domain/post/entities/like';
import { LikesRepository } from '@/domain/post/repositories/likes-repository';

export class InMemoryLikesRepository implements LikesRepository {
  public likes: Like[] = [];

  async delete(like: Like): Promise<void> {
    const likeIndex = this.likes.findIndex((item) => item.id === like.id);

    this.likes.splice(likeIndex, 1);
  }

  async findByUserIdAndPostId(
    userId: string,
    postId: string,
  ): Promise<Like | null> {
    const like = this.likes.find(
      (item) =>
        item.userId.toString() === userId && item.postId.toString() === postId,
    );

    if (!like) {
      return null;
    }

    return like;
  }

  async create(like: Like): Promise<void> {
    this.likes.push(like);
  }
}
