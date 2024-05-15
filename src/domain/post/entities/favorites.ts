import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export type FavoriteProps = {
  userId: UniqueEntityID;
  postId: UniqueEntityID;
  createdAt: Date;
};

export class Favorite extends Entity<FavoriteProps> {
  get userId() {
    return this.props.userId;
  }

  get postId() {
    return this.props.postId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  static create(
    props: Optional<FavoriteProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const favorite = new Favorite(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return favorite;
  }
}
