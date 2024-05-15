import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { CommentsRepository } from '../repositories/comments-repository';
import { CommentWithUser } from '../entities/value-objects/comment-with-user';

type FetchCommentsOnPostUseCaseRequest = {
  postId: string;
  userId: string;
  page: number;
};

type FetchCommentsOnPostUseCaseResponse = Either<
  null,
  { comments: CommentWithUser[] }
>;

@Injectable()
export class FetchCommentsOnPostUseCase {
  constructor(private commentsRepository: CommentsRepository) {}

  async execute({
    postId,
    userId,
    page,
  }: FetchCommentsOnPostUseCaseRequest): Promise<FetchCommentsOnPostUseCaseResponse> {
    const comments = await this.commentsRepository.findByPostId(
      postId,
      userId,
      { page },
    );

    return right({ comments });
  }
}
