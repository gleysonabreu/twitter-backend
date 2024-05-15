import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { CommentsRepository } from '../repositories/comments-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

type DeleteCommentOnPostUseCaseRequest = {
  userId: string;
  commentId: string;
};

type DeleteCommentOnPostUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>;

@Injectable()
export class DeleteCommentOnPostUseCase {
  constructor(private commentsRepository: CommentsRepository) {}

  async execute({
    commentId,
    userId,
  }: DeleteCommentOnPostUseCaseRequest): Promise<DeleteCommentOnPostUseCaseResponse> {
    const comment = await this.commentsRepository.findById(commentId);

    if (!comment) {
      return left(new ResourceNotFoundError());
    }

    if (userId !== comment.userId.toString()) {
      return left(new NotAllowedError());
    }

    await this.commentsRepository.delete(comment);
    return right(null);
  }
}
