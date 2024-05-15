import { VerificationToken } from '@/domain/user/entities/verification-token';
import { VerificationTokensRepository } from '@/domain/user/repositories/verification-tokens-repository';

export class InMemoryVerificationTokens
  implements VerificationTokensRepository
{
  public tokens: VerificationToken[] = [];

  async findByToken(token: string): Promise<VerificationToken> {
    const verificationToken = this.tokens.find(
      (verification) => verification.token === token,
    );

    if (!verificationToken) {
      return null;
    }

    return verificationToken;
  }

  async create(verificationToken: VerificationToken): Promise<void> {
    this.tokens.push(verificationToken);
  }
}
