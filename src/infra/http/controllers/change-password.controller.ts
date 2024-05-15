import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Patch,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { ChangePasswordUseCase } from '@/domain/user/use-cases/change-password';
import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator';
import { TokenPayload } from '@/infra/auth/strategies/jwt.strategy';
import { WrongCurrentPasswordError } from '@/domain/user/use-cases/errors/wrong-current-password-error';

const changePasswordBodySchema = z
  .object({
    password: z.string().min(6).max(12).trim(),
    newPassword: z.string().min(6).max(12).trim(),
    confirmPassword: z.string().min(6).max(12).trim(),
  })
  .refine((data) => data.password !== data.newPassword, {
    message: 'New password cannot be the same as the existing password',
    path: ['newPassword'],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'The passwords did not match',
    path: ['confirmPassword'],
  });

type ChangePasswordBodySchema = z.infer<typeof changePasswordBodySchema>;

@Controller('/accounts/change-password')
export class ChangePasswordController {
  constructor(private changePassword: ChangePasswordUseCase) {}

  @Patch()
  @HttpCode(204)
  async handler(
    @Body(new ZodValidationPipe(changePasswordBodySchema))
    body: ChangePasswordBodySchema,
    @CurrentUser() currentUser: TokenPayload,
  ) {
    const { newPassword, password } = body;
    const { sub: userId } = currentUser;

    const result = await this.changePassword.execute({
      newPassword,
      password,
      userId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case WrongCurrentPasswordError:
          throw new BadRequestException(error.message);
        default:
          throw new BadRequestException();
      }
    }
  }
}
