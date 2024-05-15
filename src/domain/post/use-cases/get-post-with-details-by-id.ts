import { Injectable } from '@nestjs/common';
import { PostsRepository } from '../repositories/posts-repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';
import { PostWithUser } from '../entities/value-objects/post-with-user';

type GetPostWithDetailsByIdUseCaseRequest = {
  userId: string;
  postId: string;
};

type GetPostWithDetailsByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    post: PostWithUser;
  }
>;

@Injectable()
export class GetPostWithDetailsByIdUseCase {
  constructor(private postsRepository: PostsRepository) {}

  async execute({
    postId,
    userId,
  }: GetPostWithDetailsByIdUseCaseRequest): Promise<GetPostWithDetailsByIdUseCaseResponse> {
    const post = await this.postsRepository.findDetailsById(postId, userId);

    if (!post) {
      return left(new ResourceNotFoundError());
    }

    return right({ post });
  }
}
