import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Patch,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { Public } from '@/infra/auth/decorators/public.decorator';
import { ResetPasswordUseCase } from '@/domain/user/use-cases/reset-password';
import { InvalidTokenError } from '@/domain/user/use-cases/errors/invalid-token-error';
import { TokenExpiredError } from '@/domain/user/use-cases/errors/token-expired-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';
import { TypedEventEmitter } from '@/infra/event-emitter/typed-event-emitter';

const pageQueryParamsSchema = z.string();
type PageQueryParamsSchema = z.infer<typeof pageQueryParamsSchema>;

const resetPasswordBodySchema = z
  .object({
    newPassword: z.string().min(6).max(12).trim(),
    confirmPassword: z.string().min(6).max(12).trim(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'The passwords did not match',
    path: ['confirmPassword'],
  });

type ResetPasswordBodySchema = z.infer<typeof resetPasswordBodySchema>;

@Controller('/accounts/reset-password')
export class ResetPasswordController {
  constructor(
    private resetPassword: ResetPasswordUseCase,
    private readonly eventEmitter: TypedEventEmitter,
  ) {}

  @Public()
  @Patch()
  @HttpCode(204)
  async handler(
    @Query('token', new ZodValidationPipe(pageQueryParamsSchema))
    token: PageQueryParamsSchema,
    @Body(new ZodValidationPipe(resetPasswordBodySchema))
    body: ResetPasswordBodySchema,
  ) {
    const { newPassword } = body;
    const result = await this.resetPassword.execute({
      newPassword,
      token,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case InvalidTokenError:
          throw new UnauthorizedException(error.message);
        case TokenExpiredError:
          throw new UnauthorizedException(error.message);
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException();
      }
    }

    const { user } = result.value;

    await this.eventEmitter.emit('user.reset-password', {
      email: user.email,
      updatedDate: new Date(),
      username: user.username,
    });
  }
}
