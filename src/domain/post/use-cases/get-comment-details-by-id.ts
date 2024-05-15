import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { CommentsRepository } from '../repositories/comments-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';
import { CommentWithUser } from '../entities/value-objects/comment-with-user';

type GetCommentDetailsByIdUseCaseRequest = {
  userId: string;
  commentId: string;
};

type GetCommentDetailsByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    comment: CommentWithUser;
  }
>;

@Injectable()
export class GetCommentDetailsByIdUseCase {
  constructor(private commentsRepository: CommentsRepository) {}
  async execute({
    commentId,
    userId,
  }: GetCommentDetailsByIdUseCaseRequest): Promise<GetCommentDetailsByIdUseCaseResponse> {
    const comment = await this.commentsRepository.findByIdDetails(
      commentId,
      userId,
    );

    if (!comment) {
      return left(new ResourceNotFoundError());
    }

    return right({ comment });
  }
}
