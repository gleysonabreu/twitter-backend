import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users-repository';
import { DateRepository } from '@/infra/date/repository/date-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { VerificationToken } from '../entities/verification-token';
import { VerificationTokensRepository } from '../repositories/verification-tokens-repository';
import { User } from '../entities/user';

type ForgotPasswordUseCaseRequest = {
  email: string;
};

type ForgotPasswordUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    verificationToken: VerificationToken;
    user: User;
  }
>;

@Injectable()
export class ForgotPasswordUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private dateRepository: DateRepository,
    private verificationTokens: VerificationTokensRepository,
  ) {}

  async execute({
    email,
  }: ForgotPasswordUseCaseRequest): Promise<ForgotPasswordUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    const token = new UniqueEntityID();
    const expiresAt = this.dateRepository.addHours(1);

    const verificationToken = VerificationToken.create({
      token: token.toString(),
      expiresAt,
      userId: user.id,
    });

    await this.verificationTokens.create(verificationToken);
    return right({ verificationToken, user });
  }
}
