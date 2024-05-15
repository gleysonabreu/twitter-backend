import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { VerificationTokensRepository } from '@/domain/user/repositories/verification-tokens-repository';
import { VerificationToken } from '@/domain/user/entities/verification-token';
import { PrismaVerificationTokenMapper } from './mappers/prisma-verification-token-mapper';

@Injectable()
export class PrismaVerificationTokensRepository
  implements VerificationTokensRepository
{
  constructor(private prisma: PrismaService) {}

  async findByToken(token: string): Promise<VerificationToken> {
    const verificationToken = await this.prisma.verificationTokens.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      return null;
    }

    return PrismaVerificationTokenMapper.toDomain(verificationToken);
  }

  async create(verificationToken: VerificationToken): Promise<void> {
    const data = PrismaVerificationTokenMapper.toPrisma(verificationToken);

    await this.prisma.verificationTokens.create({
      data,
    });
  }
}
