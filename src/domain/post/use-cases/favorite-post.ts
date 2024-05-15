import { Injectable } from '@nestjs/common';
import { FavoritesRepository } from '../repositories/favorites-repository';
import { Either, left, right } from '@/core/either';
import { FavoritePostAlreadyExistsError } from './errors/favorite-post-already-exists-error';
import { Favorite } from '../entities/favorites';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

type FavoritePostUseCaseRequest = {
  userId: string;
  postId: string;
};

type FavoritePostUseCaseResponse = Either<
  FavoritePostAlreadyExistsError,
  {
    favorite: Favorite;
  }
>;

@Injectable()
export class FavoritePostUseCase {
  constructor(private favoritesRepository: FavoritesRepository) {}
  async execute({
    postId,
    userId,
  }: FavoritePostUseCaseRequest): Promise<FavoritePostUseCaseResponse> {
    const favoriteExists = await this.favoritesRepository.findByUserIdAndPostId(
      userId,
      postId,
    );

    if (favoriteExists) {
      return left(new FavoritePostAlreadyExistsError());
    }

    const favorite = Favorite.create({
      postId: new UniqueEntityID(postId),
      userId: new UniqueEntityID(userId),
    });
    await this.favoritesRepository.create(favorite);
    return right({
      favorite,
    });
  }
}
