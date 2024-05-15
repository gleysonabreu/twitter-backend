import { PaginationParams } from '@/core/repositories/pagination-params';
import { User } from '../entities/user';
import { UserDetails } from '../entities/value-objects/user-details';

export abstract class UsersRepository {
  abstract findByEmailOrUsername(login: string): Promise<User | null>;
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findByUsername(username: string): Promise<User | null>;
  abstract findUserDetailsById(
    id: string,
    userId: string,
  ): Promise<UserDetails | null>;
  abstract findDetailsByUsername(
    username: string,
    userId: string,
  ): Promise<UserDetails | null>;
  abstract searchUser(
    userId: string,
    query: string,
    params: PaginationParams,
  ): Promise<UserDetails[]>;
  abstract create(user: User): Promise<void>;
  abstract save(user: User): Promise<void>;
}
