import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { User } from '../entities/user';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { UsersRepository } from '../repositories/users-repository';
import { HashGenerator } from '../cryptography/hash-generator';

type RegisterUserUseCaseRequest = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  birthDate: Date;
  bio?: string | null;
};

type RegisterUserUseCaseResponse = Either<
  UserAlreadyExistsError,
  {
    user: User;
  }
>;

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    birthDate,
    email,
    firstName,
    lastName,
    password,
    username,
    bio,
  }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
    const userEmailAlreadyExists =
      await this.usersRepository.findByEmail(email);
    if (userEmailAlreadyExists) {
      return left(new UserAlreadyExistsError(email));
    }

    const usernameAlreadyExists =
      await this.usersRepository.findByUsername(username);
    if (usernameAlreadyExists) {
      return left(new UserAlreadyExistsError(username));
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const user = User.create({
      birthDate,
      email,
      firstName,
      lastName,
      password: hashedPassword,
      username,
      bio,
    });

    await this.usersRepository.create(user);
    return right({ user });
  }
}
