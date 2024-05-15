import { Injectable } from '@nestjs/common';
import { PostsRepository } from '../repositories/posts-repository';
import { Either, right } from '@/core/either';
import { PostWithUser } from '../entities/value-objects/post-with-user';

type FetchFeedProfileUseCaseRequest = {
  userId: string;
  currentUserId: string;
  page: number;
};

type FetchFeedProfileUseCaseResponse = Either<null, { posts: PostWithUser[] }>;

@Injectable()
export class FetchFeedProfileUseCase {
  constructor(private postsRepository: PostsRepository) {}

  async execute({
    userId,
    currentUserId,
    page,
  }: FetchFeedProfileUseCaseRequest): Promise<FetchFeedProfileUseCaseResponse> {
    const posts = await this.postsRepository.feedProfile({
      userId,
      currentUserId,
      params: { page },
    });

    return right({ posts });
  }
}
