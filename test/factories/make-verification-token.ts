import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  VerificationToken,
  VerificationTokenProps,
} from '@/domain/user/entities/verification-token';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaVerificationTokenMapper } from '@/infra/database/prisma/repositories/mappers/prisma-verification-token-mapper';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

export function makeVerificationToken(
  override: Partial<VerificationTokenProps> = {},
  id?: UniqueEntityID,
) {
  const verificationToken = VerificationToken.create(
    {
      userId: new UniqueEntityID(),
      expiresAt: faker.date.future(),
      token: new UniqueEntityID().toString(),
      ...override,
    },
    id,
  );

  return verificationToken;
}

@Injectable()
export class VerificationTokenFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaVerificationToken(
    data: Partial<VerificationTokenProps> = {},
  ): Promise<VerificationToken> {
    const verificationToken = makeVerificationToken(data);

    await this.prisma.verificationTokens.create({
      data: PrismaVerificationTokenMapper.toPrisma(verificationToken),
    });

    return verificationToken;
  }
}
