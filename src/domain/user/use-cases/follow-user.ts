import { Injectable } from '@nestjs/common';
import { FollowsRepository } from '../repositories/follows-repository';
import { Either, right } from '@/core/either';
import { Follow } from '../entities/follow';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

type FollowUserUseCaseRequest = {
  followedBy: string;
  followingId: string;
};

type FollowUserUseCaseResponse = Either<null, null>;

@Injectable()
export class FollowUserUseCase {
  constructor(private followsRepository: FollowsRepository) {}

  async execute({
    followedBy,
    followingId,
  }: FollowUserUseCaseRequest): Promise<FollowUserUseCaseResponse> {
    let follows = await this.followsRepository.findByFollowingIdAndFollowedBy(
      followingId,
      followedBy,
    );

    if (follows) {
      await this.followsRepository.delete(follows);
    } else {
      follows = Follow.create({
        followedById: new UniqueEntityID(followedBy),
        followingId: new UniqueEntityID(followingId),
      });
      await this.followsRepository.create(follows);
    }

    return right(null);
  }
}
