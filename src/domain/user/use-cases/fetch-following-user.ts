import { Injectable } from '@nestjs/common';
import { Either, right } from '@/core/either';
import { FollowsRepository } from '../repositories/follows-repository';
import { UserDetails } from '../entities/value-objects/user-details';

type FetchFollowingUserUseCaseRequest = {
  followingId: string;
  userId: string;
  page: number;
};

type FetchFollowingUserUseCaseResponse = Either<
  null,
  {
    following: UserDetails[];
  }
>;

@Injectable()
export class FetchFollowingUserUseCase {
  constructor(private followsRepository: FollowsRepository) {}

  async execute({
    followingId,
    userId,
    page,
  }: FetchFollowingUserUseCaseRequest): Promise<FetchFollowingUserUseCaseResponse> {
    const following = await this.followsRepository.fetchFollowing(
      followingId,
      userId,
      { page },
    );

    return right({ following });
  }
}
