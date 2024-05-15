import { PaginationParams } from '@/core/repositories/pagination-params';
import { Follow } from '../entities/follow';
import { UserDetails } from '../entities/value-objects/user-details';

export abstract class FollowsRepository {
  abstract create(follow: Follow): Promise<void>;
  abstract delete(follow: Follow): Promise<void>;
  abstract findByFollowingIdAndFollowedBy(
    followingId: string,
    followedById: string,
  ): Promise<Follow>;
  abstract fetchFollowing(
    followingId: string,
    userId: string,
    params: PaginationParams,
  ): Promise<UserDetails[]>;
  abstract fetchFollowers(
    followedById: string,
    userId: string,
    params: PaginationParams,
  ): Promise<UserDetails[]>;
}
