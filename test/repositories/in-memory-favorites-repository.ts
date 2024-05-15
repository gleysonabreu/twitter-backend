import { Favorite } from '@/domain/post/entities/favorites';
import { FavoritesRepository } from '@/domain/post/repositories/favorites-repository';

export class InMemoryFavoritesRepository implements FavoritesRepository {
  public favorites: Favorite[] = [];

  async delete(favorite: Favorite): Promise<void> {
    const favoriteIndex = this.favorites.findIndex(
      (item) => item.id === favorite.id,
    );

    this.favorites.splice(favoriteIndex, 1);
  }

  async findByUserIdAndPostId(
    userId: string,
    postId: string,
  ): Promise<Favorite | null> {
    const favorite = this.favorites.find(
      (item) =>
        item.userId.toString() === userId && item.postId.toString() === postId,
    );

    if (!favorite) {
      return null;
    }

    return favorite;
  }

  async create(favorite: Favorite): Promise<void> {
    this.favorites.push(favorite);
  }
}
