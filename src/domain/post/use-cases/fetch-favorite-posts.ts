import { Injectable } from '@nestjs/common';
import { PostsRepository } from '../repositories/posts-repository';
import { Either, right } from '@/core/either';
import { PostWithUser } from '../entities/value-objects/post-with-user';

type FetchFavoritePostsUseCaseRequest = {
  userId: string;
  page: number;
};

type FetchFavoritePostsUseCaseResponse = Either<
  null,
  { posts: PostWithUser[] }
>;

@Injectable()
export class FetchFavoritePostsUseCase {
  constructor(private postsRepository: PostsRepository) {}

  async execute({
    page,
    userId,
  }: FetchFavoritePostsUseCaseRequest): Promise<FetchFavoritePostsUseCaseResponse> {
    const posts = await this.postsRepository.findFavoritePostsByUserId(userId, {
      page,
    });

    return right({ posts });
  }
}
