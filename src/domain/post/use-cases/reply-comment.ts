import { Injectable } from '@nestjs/common';
import { CommentsRepository } from '../repositories/comments-repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';
import { Comment } from '../entities/comment';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

type ReplyCommentUseCaseRequest = {
  commentId: string;
  userId: string;
  content: string;
};

type ReplyCommentUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    comment: Comment;
  }
>;

@Injectable()
export class ReplyCommentUseCase {
  constructor(private commentsRepository: CommentsRepository) {}

  async execute({
    commentId,
    userId,
    content,
  }: ReplyCommentUseCaseRequest): Promise<ReplyCommentUseCaseResponse> {
    const comment = await this.commentsRepository.findById(commentId);

    if (!comment) {
      return left(new ResourceNotFoundError());
    }

    const reply = Comment.create({
      content,
      postId: comment.postId,
      userId: new UniqueEntityID(userId),
      parentId: comment.id,
    });

    await this.commentsRepository.create(reply);
    return right({ comment: reply });
  }
}
