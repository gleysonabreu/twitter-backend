import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users-repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';
import { User } from '../entities/user';
import { HashGenerator } from '../cryptography/hash-generator';
import { VerificationTokensRepository } from '../repositories/verification-tokens-repository';
import { InvalidTokenError } from './errors/invalid-token-error';
import { DateRepository } from '@/infra/date/repository/date-repository';
import { TokenExpiredError } from './errors/token-expired-error';

type ResetPasswordUseCaseRequest = {
  token: string;
  newPassword: string;
};

type ResetPasswordUseCaseResponse = Either<
  ResourceNotFoundError | InvalidTokenError | TokenExpiredError,
  { user: User }
>;

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    private verificationTokens: VerificationTokensRepository,
    private usersRepository: UsersRepository,
    private dateRepository: DateRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    token,
    newPassword,
  }: ResetPasswordUseCaseRequest): Promise<ResetPasswordUseCaseResponse> {
    const verificationToken = await this.verificationTokens.findByToken(token);

    if (!verificationToken) {
      return left(new InvalidTokenError());
    }

    if (
      this.dateRepository.compareIfBefore(
        verificationToken.expiresAt,
        this.dateRepository.dateNow(),
      )
    ) {
      return left(new TokenExpiredError());
    }

    const user = await this.usersRepository.findById(
      verificationToken.userId.toString(),
    );

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    const newPasswordHash = await this.hashGenerator.hash(newPassword);
    user.password = newPasswordHash;
    await this.usersRepository.save(user);

    return right({ user });
  }
}
