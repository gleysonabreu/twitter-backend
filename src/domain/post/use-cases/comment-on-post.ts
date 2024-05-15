import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { Comment } from '../entities/comment';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { PostsRepository } from '../repositories/posts-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';
import { CommentsRepository } from '../repositories/comments-repository';

type CommentOnPostUseCaseRequest = {
  postId: string;
  userId: string;
  content: string;
};

type CommentOnPostUseCaseResponse = Either<
  ResourceNotFoundError,
  { comment: Comment }
>;

@Injectable()
export class CommentOnPostUseCase {
  constructor(
    private postsRepository: PostsRepository,
    private commentsRepository: CommentsRepository,
  ) {}
  async execute({
    content,
    postId,
    userId,
  }: CommentOnPostUseCaseRequest): Promise<CommentOnPostUseCaseResponse> {
    const post = await this.postsRepository.findById(postId);

    if (!post) {
      return left(new ResourceNotFoundError());
    }

    const comment = Comment.create({
      content,
      postId: new UniqueEntityID(postId),
      userId: new UniqueEntityID(userId),
    });
    await this.commentsRepository.create(comment);

    return right({ comment });
  }
}
