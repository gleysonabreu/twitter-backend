import { Favorite } from '../entities/favorites';

export abstract class FavoritesRepository {
  abstract findByUserIdAndPostId(
    userId: string,
    postId: string,
  ): Promise<Favorite | null>;
  abstract create(favorite: Favorite): Promise<void>;
  abstract delete(favorite: Favorite): Promise<void>;
}
