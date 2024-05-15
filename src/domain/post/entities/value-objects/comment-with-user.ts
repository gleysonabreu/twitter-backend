import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ValueObject } from '@/core/entities/value-object';
import { User } from '@/domain/user/entities/user';

export interface CommentWithUserProps {
  postId: UniqueEntityID;
  commentId: UniqueEntityID;
  userId: UniqueEntityID;
  content: string;
  user: User;
  createdAt: Date;
  updatedAt?: Date | null;
  parentId?: UniqueEntityID | null;
  parent?: CommentWithUser | null;
  totalComments: number;
  totalLikes: number;
  isLiked: boolean;
}

export class CommentWithUser extends ValueObject<CommentWithUserProps> {
  get commentId() {
    return this.props.commentId;
  }

  get postId() {
    return this.props.postId;
  }

  get content() {
    return this.props.content;
  }

  get userId() {
    return this.props.userId;
  }

  get user() {
    return this.props.user;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get parentId() {
    return this.props.parentId;
  }

  get parent() {
    return this.props.parent;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get totalComments() {
    return this.props.totalComments;
  }

  get totalLikes() {
    return this.props.totalLikes;
  }

  get isLiked() {
    return this.props.isLiked;
  }

  static create(props: CommentWithUserProps) {
    return new CommentWithUser(props);
  }
}
