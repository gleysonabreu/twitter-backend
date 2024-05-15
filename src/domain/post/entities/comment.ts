import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export interface CommentProps {
  postId: UniqueEntityID;
  userId: UniqueEntityID;
  content: string;
  parentId?: UniqueEntityID | null;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Comment extends Entity<CommentProps> {
  get postId() {
    return this.props.postId;
  }

  get userId() {
    return this.props.userId;
  }

  get content() {
    return this.props.content;
  }

  set content(content: string) {
    this.props.content = content;
    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  get parentId() {
    return this.props.parentId;
  }

  static create(
    props: Optional<CommentProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const comment = new Comment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? null,
      },
      id,
    );

    return comment;
  }
}
