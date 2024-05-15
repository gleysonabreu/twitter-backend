import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { VerificationToken } from '@/domain/user/entities/verification-token';
import {
  Prisma,
  VerificationTokens as PrismaVerificationToken,
} from '@prisma/client';

export class PrismaVerificationTokenMapper {
  static toDomain(raw: PrismaVerificationToken): VerificationToken {
    return VerificationToken.create(
      {
        expiresAt: raw.expiresAt,
        token: raw.token,
        userId: new UniqueEntityID(raw.userId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(
    verificationToken: VerificationToken,
  ): Prisma.VerificationTokensUncheckedCreateInput {
    return {
      id: verificationToken.id.toString(),
      userId: verificationToken.userId.toString(),
      expiresAt: verificationToken.expiresAt,
      token: verificationToken.token,
      createdAt: verificationToken.createdAt,
      updatedAt: verificationToken.updatedAt,
    };
  }
}
