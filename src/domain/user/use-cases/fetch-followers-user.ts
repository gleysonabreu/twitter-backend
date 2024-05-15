import { Injectable } from '@nestjs/common';
import { Either, right } from '@/core/either';
import { FollowsRepository } from '../repositories/follows-repository';
import { UserDetails } from '../entities/value-objects/user-details';

type FetchFollowersUserUseCaseRequest = {
  followedById: string;
  userId: string;
  page: number;
};

type FetchFollowersUserUseCaseResponse = Either<
  null,
  {
    followers: UserDetails[];
  }
>;

@Injectable()
export class FetchFollowersUserUseCase {
  constructor(private followsRepository: FollowsRepository) {}

  async execute({
    followedById,
    userId,
    page,
  }: FetchFollowersUserUseCaseRequest): Promise<FetchFollowersUserUseCaseResponse> {
    const followers = await this.followsRepository.fetchFollowers(
      followedById,
      userId,
      { page },
    );

    return right({ followers });
  }
}
