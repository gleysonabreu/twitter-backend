import { Injectable } from '@nestjs/common';
import { PostsRepository } from '../repositories/posts-repository';
import { Either, right } from '@/core/either';
import { PostWithUser } from '../entities/value-objects/post-with-user';

type FetchUserPostsUseCaseRequest = {
  userId: string;
  page: number;
};

type FetchUserPostsUseCaseResponse = Either<null, { posts: PostWithUser[] }>;

@Injectable()
export class FetchUserPostsUseCase {
  constructor(private postsRepository: PostsRepository) {}

  async execute({
    userId,
    page,
  }: FetchUserPostsUseCaseRequest): Promise<FetchUserPostsUseCaseResponse> {
    const posts = await this.postsRepository.findByUserId(userId, { page });

    return right({ posts });
  }
}
