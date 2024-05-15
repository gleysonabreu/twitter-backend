import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users-repository';
import { UserDetails } from '../entities/value-objects/user-details';

type SearchUserUseCaseRequest = {
  query: string;
  page: number;
  userId: string;
};

type SearchUserUseCaseResponse = Either<null, { users: UserDetails[] }>;

@Injectable()
export class SearchUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    query,
    page,
    userId,
  }: SearchUserUseCaseRequest): Promise<SearchUserUseCaseResponse> {
    const users = await this.usersRepository.searchUser(userId, query, {
      page,
    });

    return right({ users });
  }
}
