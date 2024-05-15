import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { LikesCommentRepository } from '../repositories/likes-comment-repository';
import { LikeComment } from '../entities/like-comment';
import { CommentAlreadyLikedError } from './errors/comment-already-liked-error';

type LikeCommentUseCaseRequest = {
  userId: string;
  commentId: string;
};

type LikePostUseCaseResponse = Either<
  CommentAlreadyLikedError,
  {
    likeComment: LikeComment;
  }
>;

@Injectable()
export class LikeCommentUseCase {
  constructor(private likesCommentRepository: LikesCommentRepository) {}
  async execute({
    commentId,
    userId,
  }: LikeCommentUseCaseRequest): Promise<LikePostUseCaseResponse> {
    const likeExists =
      await this.likesCommentRepository.findByUserIdAndCommentId(
        userId,
        commentId,
      );

    if (likeExists) {
      return left(new CommentAlreadyLikedError());
    }

    const likeComment = LikeComment.create({
      commentId: new UniqueEntityID(commentId),
      userId: new UniqueEntityID(userId),
    });

    await this.likesCommentRepository.create(likeComment);
    return right({
      likeComment,
    });
  }
}
