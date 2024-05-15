import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export type LikeCommentProps = {
  userId: UniqueEntityID;
  commentId: UniqueEntityID;
  createdAt: Date;
};

export class LikeComment extends Entity<LikeCommentProps> {
  get userId() {
    return this.props.userId;
  }

  get commentId() {
    return this.props.commentId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  static create(
    props: Optional<LikeCommentProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const likeComment = new LikeComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return likeComment;
  }
}
