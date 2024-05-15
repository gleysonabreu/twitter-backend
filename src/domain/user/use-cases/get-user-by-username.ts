import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';
import { Injectable } from '@nestjs/common';
import { UserDetails } from '../entities/value-objects/user-details';
import { UsersRepository } from '../repositories/users-repository';

type GetUserByUsernameUseCaseRequest = {
  username: string;
  userId: string;
};

type GetUserByUsernameUseCaseResponse = Either<
  ResourceNotFoundError,
  { user: UserDetails }
>;

@Injectable()
export class GetUserByUsernameUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    username,
    userId,
  }: GetUserByUsernameUseCaseRequest): Promise<GetUserByUsernameUseCaseResponse> {
    const user = await this.usersRepository.findDetailsByUsername(
      username,
      userId,
    );

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    return right({ user });
  }
}
