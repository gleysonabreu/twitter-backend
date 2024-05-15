import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { Comment } from '../entities/comment';
import { CommentsRepository } from '../repositories/comments-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

type EditCommentOnPostUseCaseRequest = {
  commentId: string;
  content: string;
  userId: string;
};
type EditCommentOnPostUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    comment: Comment;
  }
>;

@Injectable()
export class EditCommentOnPostUseCase {
  constructor(private commentsRepository: CommentsRepository) {}

  async execute({
    commentId,
    content,
    userId,
  }: EditCommentOnPostUseCaseRequest): Promise<EditCommentOnPostUseCaseResponse> {
    const comment = await this.commentsRepository.findById(commentId);

    if (!comment) {
      return left(new ResourceNotFoundError());
    }

    if (userId !== comment.userId.toString()) {
      return left(new NotAllowedError());
    }

    comment.content = content;
    await this.commentsRepository.save(comment);

    return right({ comment });
  }
}
