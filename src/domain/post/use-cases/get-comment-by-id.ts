import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { Comment } from '../entities/comment';
import { CommentsRepository } from '../repositories/comments-repository';

type GetCommentByIdUseCaseRequest = {
  userId: string;
  commentId: string;
};

type GetCommentByIdUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    comment: Comment;
  }
>;

@Injectable()
export class GetCommentByIdUseCase {
  constructor(private commentsRepository: CommentsRepository) {}

  async execute({
    commentId,
    userId,
  }: GetCommentByIdUseCaseRequest): Promise<GetCommentByIdUseCaseResponse> {
    const comment = await this.commentsRepository.findById(commentId);

    if (!comment) {
      return left(new ResourceNotFoundError());
    }

    if (comment.userId.toString() !== userId) {
      return left(new NotAllowedError());
    }

    return right({ comment });
  }
}
