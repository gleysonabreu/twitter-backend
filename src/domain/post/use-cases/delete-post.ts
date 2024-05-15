import { Injectable } from '@nestjs/common';
import { PostsRepository } from '../repositories/posts-repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

type DeletePostUseCaseRequest = {
  userId: string;
  postId: string;
};

type DeletePostUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>;

@Injectable()
export class DeletePostUseCase {
  constructor(private postsRepository: PostsRepository) {}

  async execute({
    postId,
    userId,
  }: DeletePostUseCaseRequest): Promise<DeletePostUseCaseResponse> {
    const post = await this.postsRepository.findById(postId);

    if (!post) {
      return left(new ResourceNotFoundError());
    }

    if (userId !== post.userId.toString()) {
      return left(new NotAllowedError());
    }

    await this.postsRepository.delete(post);
    return right(null);
  }
}
