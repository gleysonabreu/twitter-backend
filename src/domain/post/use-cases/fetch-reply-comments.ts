import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { CommentsRepository } from '../repositories/comments-repository';
import { CommentWithUser } from '../entities/value-objects/comment-with-user';

type FetchReplyCommentsUseCaseRequest = {
  commentId: string;
  userId: string;
  page: number;
};

type FetchReplyCommentsUseCaseResponse = Either<
  null,
  { comments: CommentWithUser[] }
>;

@Injectable()
export class FetchReplyCommentsUseCase {
  constructor(private commentsRepository: CommentsRepository) {}

  async execute({
    userId,
    commentId,
    page,
  }: FetchReplyCommentsUseCaseRequest): Promise<FetchReplyCommentsUseCaseResponse> {
    const comments = await this.commentsRepository.fetchReplies(
      userId,
      commentId,
      { page },
    );

    return right({ comments });
  }
}
