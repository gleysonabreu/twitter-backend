import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { PostWithUser } from '../entities/value-objects/post-with-user';
import { PostsRepository } from '../repositories/posts-repository';

type FetchPostsLikedUseCaseRequest = {
  userId: string;
  page: number;
};

type FetchPostsLikedUseCaseResponse = Either<null, { posts: PostWithUser[] }>;

@Injectable()
export class FetchPostsLikedUseCase {
  constructor(private postsRepository: PostsRepository) {}
  async execute({
    userId,
    page,
  }: FetchPostsLikedUseCaseRequest): Promise<FetchPostsLikedUseCaseResponse> {
    const posts = await this.postsRepository.findPostsLiked(userId, { page });

    return right({ posts });
  }
}
