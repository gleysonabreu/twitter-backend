import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';
import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Post,
  UsePipes,
} from '@nestjs/common';
import { ForgotPasswordUseCase } from '@/domain/user/use-cases/forgot-password';
import { Public } from '@/infra/auth/decorators/public.decorator';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { TypedEventEmitter } from '@/infra/event-emitter/typed-event-emitter';

const forgotPasswordBodySchema = z.object({
  email: z.string().email().trim(),
});
type ForgotPasswordBodySchema = z.infer<typeof forgotPasswordBodySchema>;

@Controller('/accounts/forgot-password')
export class ForgotPasswordController {
  constructor(
    private forgotPassword: ForgotPasswordUseCase,
    private readonly eventEmitter: TypedEventEmitter,
  ) {}

  @Public()
  @Post()
  @UsePipes(new ZodValidationPipe(forgotPasswordBodySchema))
  async handler(@Body() body: ForgotPasswordBodySchema) {
    const { email } = body;

    const result = await this.forgotPassword.execute({ email });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { user, verificationToken } = result.value;

    await this.eventEmitter.emit('user.forgot-password', {
      email: user.email,
      username: user.username,
      token: verificationToken.token,
    });
  }
}
