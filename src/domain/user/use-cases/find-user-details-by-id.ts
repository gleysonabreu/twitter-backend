import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';
import { Injectable } from '@nestjs/common';
import { UserDetails } from '../entities/value-objects/user-details';
import { UsersRepository } from '../repositories/users-repository';

type FindUserDetailsByIdUseCaseRequest = {
  id: string;
  userId: string;
};

type FindUserDetailsByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  { user: UserDetails }
>;

@Injectable()
export class FindUserDetailsByIdUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    id,
    userId,
  }: FindUserDetailsByIdUseCaseRequest): Promise<FindUserDetailsByIdUseCaseResponse> {
    const user = await this.usersRepository.findUserDetailsById(id, userId);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    return right({ user });
  }
}
