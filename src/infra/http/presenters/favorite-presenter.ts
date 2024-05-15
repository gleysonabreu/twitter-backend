import { Favorite } from '@/domain/post/entities/favorites';

export class FavoritePresenter {
  static toHTTP(favorite: Favorite) {
    return {
      id: favorite.id.toString(),
      postId: favorite.postId.toString(),
      userId: favorite.userId.toString(),
      createdAt: favorite.createdAt,
    };
  }
}
