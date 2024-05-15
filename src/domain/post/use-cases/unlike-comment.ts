import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';
import { LikesCommentRepository } from '../repositories/likes-comment-repository';

type UnLikeCommentUseCaseUseCaseRequest = {
  userId: string;
  commentId: string;
};

type UnLikeCommentUseCaseUseCaseResponse = Either<ResourceNotFoundError, null>;

@Injectable()
export class UnLikeCommentUseCase {
  constructor(private likesCommentRepository: LikesCommentRepository) {}
  async execute({
    commentId,
    userId,
  }: UnLikeCommentUseCaseUseCaseRequest): Promise<UnLikeCommentUseCaseUseCaseResponse> {
    const likeComment =
      await this.likesCommentRepository.findByUserIdAndCommentId(
        userId,
        commentId,
      );

    if (!likeComment) {
      return left(new ResourceNotFoundError());
    }

    await this.likesCommentRepository.delete(likeComment);
    return right(null);
  }
}
