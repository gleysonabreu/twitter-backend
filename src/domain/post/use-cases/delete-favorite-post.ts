import { Injectable } from '@nestjs/common';
import { FavoritesRepository } from '../repositories/favorites-repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';

type DeleteFavoritePostUseCaseRequest = {
  userId: string;
  postId: string;
};

type DeleteFavoritePostUseCaseResponse = Either<ResourceNotFoundError, null>;

@Injectable()
export class DeleteFavoritePostUseCase {
  constructor(private favoritesRepository: FavoritesRepository) {}
  async execute({
    postId,
    userId,
  }: DeleteFavoritePostUseCaseRequest): Promise<DeleteFavoritePostUseCaseResponse> {
    const favorite = await this.favoritesRepository.findByUserIdAndPostId(
      userId,
      postId,
    );

    if (!favorite) {
      return left(new ResourceNotFoundError());
    }

    await this.favoritesRepository.delete(favorite);
    return right(null);
  }
}
