import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { LikesRepository } from '../repositories/likes-repository';
import { PostAlreadyLikedError } from './errors/post-already-liked-error';
import { Like } from '../entities/like';

type LikePostUseCaseRequest = {
  userId: string;
  postId: string;
};

type LikePostUseCaseResponse = Either<
  PostAlreadyLikedError,
  {
    like: Like;
  }
>;

@Injectable()
export class LikePostUseCase {
  constructor(private likesRepository: LikesRepository) {}
  async execute({
    postId,
    userId,
  }: LikePostUseCaseRequest): Promise<LikePostUseCaseResponse> {
    const likeExists = await this.likesRepository.findByUserIdAndPostId(
      userId,
      postId,
    );

    if (likeExists) {
      return left(new PostAlreadyLikedError());
    }

    const like = Like.create({
      postId: new UniqueEntityID(postId),
      userId: new UniqueEntityID(userId),
    });

    await this.likesRepository.create(like);
    return right({
      like,
    });
  }
}
