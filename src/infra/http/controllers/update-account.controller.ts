import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Put,
} from '@nestjs/common';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { z } from 'zod';
import { UserAlreadyExistsError } from '@/domain/user/use-cases/errors/user-already-exists-error';
import { UpdateAccountUseCase } from '@/domain/user/use-cases/update-account';
import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator';
import { TokenPayload } from '@/infra/auth/strategies/jwt.strategy';

const updateAccountBodySchema = z.object({
  firstName: z.string().min(1).max(18).trim(),
  lastName: z.string().min(1).max(18).trim(),
  email: z.string().email().trim(),
  username: z.string().min(4).trim(),
  birthDate: z.coerce.date(),
  bio: z.string().trim().optional(),
});
type UpdateAccountBodySchema = z.infer<typeof updateAccountBodySchema>;

@Controller('/accounts')
export class UpdateAccountController {
  constructor(private updateAccount: UpdateAccountUseCase) {}

  @Put()
  @HttpCode(204)
  async handler(
    @Body(new ZodValidationPipe(updateAccountBodySchema))
    body: UpdateAccountBodySchema,
    @CurrentUser() currentUser: TokenPayload,
  ) {
    const { bio, birthDate, email, firstName, lastName, username } = body;
    const { sub: userId } = currentUser;

    const result = await this.updateAccount.execute({
      userId,
      bio,
      birthDate,
      email,
      firstName,
      lastName,
      username,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case UserAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
