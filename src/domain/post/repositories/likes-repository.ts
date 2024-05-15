import { Like } from '../entities/like';

export abstract class LikesRepository {
  abstract findByUserIdAndPostId(
    userId: string,
    postId: string,
  ): Promise<Like | null>;
  abstract create(like: Like): Promise<void>;
  abstract delete(like: Like): Promise<void>;
}
