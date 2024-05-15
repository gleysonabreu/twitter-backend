import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export type FollowProps = {
  followedById: UniqueEntityID;
  followingId: UniqueEntityID;
};

export class Follow extends Entity<FollowProps> {
  get followedById() {
    return this.props.followedById;
  }

  get followingId() {
    return this.props.followingId;
  }

  static create(props: FollowProps, id?: UniqueEntityID) {
    const follow = new Follow(props, id);

    return follow;
  }
}
