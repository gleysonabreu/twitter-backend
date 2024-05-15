import { Injectable } from '@nestjs/common';
import { PostsRepository } from '../repositories/posts-repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { Post } from '../entities/post';

type GetPostByIdUseCaseRequest = {
  userId: string;
  postId: string;
};

type GetPostByIdUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    post: Post;
  }
>;

@Injectable()
export class GetPostByIdUseCase {
  constructor(private postsRepository: PostsRepository) {}

  async execute({
    postId,
    userId,
  }: GetPostByIdUseCaseRequest): Promise<GetPostByIdUseCaseResponse> {
    const post = await this.postsRepository.findById(postId);

    if (!post) {
      return left(new ResourceNotFoundError());
    }

    if (post.userId.toString() !== userId) {
      return left(new NotAllowedError());
    }

    return right({ post });
  }
}
