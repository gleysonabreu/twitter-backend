import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export type VerificationTokenProps = {
  userId: UniqueEntityID;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt?: Date | null;
};

export class VerificationToken extends Entity<VerificationTokenProps> {
  get userId() {
    return this.props.userId;
  }

  get token() {
    return this.props.token;
  }

  get expiresAt() {
    return this.props.expiresAt;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(
    props: Optional<VerificationTokenProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const token = new VerificationToken(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
    return token;
  }
}
