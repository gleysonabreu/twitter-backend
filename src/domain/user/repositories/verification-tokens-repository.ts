import { VerificationToken } from '../entities/verification-token';

export abstract class VerificationTokensRepository {
  abstract create(verificationToken: VerificationToken): Promise<void>;
  abstract findByToken(token: string): Promise<VerificationToken>;
}
