import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users-repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';
import { User } from '../entities/user';
import { HashGenerator } from '../cryptography/hash-generator';
import { HashComparer } from '../cryptography/hash-comparer';
import { WrongCurrentPasswordError } from './errors/wrong-current-password-error';

type ChangePasswordUseCaseRequest = {
  userId: string;
  password: string;
  newPassword: string;
};

type ChangePasswordUseCaseResponse = Either<
  ResourceNotFoundError,
  { user: User }
>;

@Injectable()
export class ChangePasswordUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
    private hashComparer: HashComparer,
  ) {}

  async execute({
    userId,
    newPassword,
    password,
  }: ChangePasswordUseCaseRequest): Promise<ChangePasswordUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    const isValidPassword = await this.hashComparer.compare(
      password,
      user.password,
    );

    if (!isValidPassword) {
      return left(new WrongCurrentPasswordError());
    }

    const newPasswordHash = await this.hashGenerator.hash(newPassword);
    user.password = newPasswordHash;
    await this.usersRepository.save(user);

    return right({ user });
  }
}
