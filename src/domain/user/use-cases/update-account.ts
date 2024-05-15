import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';
import { User } from '../entities/user';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

type UpdateAccountUseCaseRequest = {
  userId: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  birthDate: Date;
  bio?: string | null;
};

type UpdateAccountUseCaseResponse = Either<
  ResourceNotFoundError | UserAlreadyExistsError,
  { user: User }
>;

@Injectable()
export class UpdateAccountUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    birthDate,
    email,
    firstName,
    lastName,
    userId,
    username,
    bio,
  }: UpdateAccountUseCaseRequest): Promise<UpdateAccountUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    if (user.email !== email) {
      const verifyEmailAlreadyExists =
        await this.usersRepository.findByEmail(email);

      if (verifyEmailAlreadyExists) {
        return left(new UserAlreadyExistsError(email));
      }
    }

    if (user.username !== username) {
      const verifyUsernameAlreadyExists =
        await this.usersRepository.findByUsername(username);

      if (verifyUsernameAlreadyExists) {
        return left(new UserAlreadyExistsError(username));
      }
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.username = username;
    user.birthDate = birthDate;
    user.bio = bio;

    await this.usersRepository.save(user);
    return right({ user });
  }
}
