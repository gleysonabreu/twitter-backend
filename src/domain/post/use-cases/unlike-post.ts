import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';
import { LikesRepository } from '../repositories/likes-repository';

type UnLikePostUseCaseUseCaseRequest = {
  userId: string;
  postId: string;
};

type UnLikePostUseCaseUseCaseResponse = Either<ResourceNotFoundError, null>;

@Injectable()
export class UnLikePostUseCase {
  constructor(private likesRepository: LikesRepository) {}
  async execute({
    postId,
    userId,
  }: UnLikePostUseCaseUseCaseRequest): Promise<UnLikePostUseCaseUseCaseResponse> {
    const like = await this.likesRepository.findByUserIdAndPostId(
      userId,
      postId,
    );

    if (!like) {
      return left(new ResourceNotFoundError());
    }

    await this.likesRepository.delete(like);
    return right(null);
  }
}
