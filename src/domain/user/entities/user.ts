import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export type UserProps = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  birthDate: Date;
  createdAt: Date;
  bio?: string | null;
  profileImage?: string | null;
  coverImage?: string | null;
  updatedAt?: Date | null;
};

export class User extends Entity<UserProps> {
  get firstName() {
    return this.props.firstName;
  }

  set firstName(firstName: string) {
    this.props.firstName = firstName;
  }

  get lastName() {
    return this.props.lastName;
  }

  set lastName(lastName: string) {
    this.props.lastName = lastName;
  }

  get email() {
    return this.props.email;
  }

  set email(email: string) {
    this.props.email = email;
  }

  get username() {
    return this.props.username;
  }

  set username(username: string) {
    this.props.username = username;
  }

  set password(password: string) {
    this.props.password = password;
    this.touch();
  }

  get password() {
    return this.props.password;
  }

  get bio() {
    return this.props.bio;
  }

  set bio(bio: string | null | undefined) {
    this.props.bio = bio;
  }

  get birthDate() {
    return this.props.birthDate;
  }

  set birthDate(birthDate: Date) {
    this.props.birthDate = birthDate;
  }

  get profileImage() {
    return this.props.profileImage;
  }

  set profileImage(url: string) {
    this.props.profileImage = url;
  }

  get coverImage() {
    return this.props.coverImage;
  }

  set coverImage(url: string) {
    this.props.coverImage = url;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(props: Optional<UserProps, 'createdAt'>, id?: UniqueEntityID) {
    const user = new User(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return user;
  }
}
