import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export type LikeProps = {
  userId: UniqueEntityID;
  postId: UniqueEntityID;
  createdAt: Date;
};

export class Like extends Entity<LikeProps> {
  get userId() {
    return this.props.userId;
  }

  get postId() {
    return this.props.postId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  static create(props: Optional<LikeProps, 'createdAt'>, id?: UniqueEntityID) {
    const like = new Like(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return like;
  }
}
