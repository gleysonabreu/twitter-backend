import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ValueObject } from '@/core/entities/value-object';
import { User } from '@/domain/user/entities/user';

export interface PostWithUserProps {
  postId: UniqueEntityID;
  content: string;
  user: User;
  userId: UniqueEntityID;
  isFavorite: boolean;
  isLiked: boolean;
  totalLikes: number;
  totalComments: number;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class PostWithUser extends ValueObject<PostWithUserProps> {
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

  get updatedAt() {
    return this.props.updatedAt;
  }

  get isFavorite() {
    return this.props.isFavorite;
  }

  get totalLikes() {
    return this.props.totalLikes;
  }

  get isLiked() {
    return this.props.isLiked;
  }

  get totalComments() {
    return this.props.totalComments;
  }

  static create(props: PostWithUserProps) {
    return new PostWithUser(props);
  }
}
