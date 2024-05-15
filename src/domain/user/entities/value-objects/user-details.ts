import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ValueObject } from '@/core/entities/value-object';

export type UserDetailsProps = {
  userId: UniqueEntityID;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  birthDate: Date;
  createdAt: Date;
  bio?: string | null;
  profileImage?: string | null;
  coverImage?: string | null;
  updatedAt?: Date | null;
  totalPosts: number;
  followedBy: number;
  following: number;
  isFollowing: boolean;
};

export class UserDetails extends ValueObject<UserDetailsProps> {
  get userId() {
    return this.props.userId;
  }

  get firstName() {
    return this.props.firstName;
  }

  get lastName() {
    return this.props.lastName;
  }

  get email() {
    return this.props.email;
  }

  get username() {
    return this.props.username;
  }

  get bio() {
    return this.props.bio;
  }

  get birthDate() {
    return this.props.birthDate;
  }

  get profileImage() {
    return this.props.profileImage;
  }

  get coverImage() {
    return this.props.coverImage;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get totalPosts() {
    return this.props.totalPosts;
  }

  get followedBy() {
    return this.props.followedBy;
  }

  get following() {
    return this.props.following;
  }

  get isFollowing() {
    return this.props.isFollowing;
  }

  static create(props: UserDetailsProps) {
    return new UserDetails(props);
  }
}
