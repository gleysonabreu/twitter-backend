import { WrongCredentialsError } from '@/core/errors/errors/wrong-credentials-error';
import { AuthenticateUserUseCase } from '@/domain/user/use-cases/authenticate-user';
import { Public } from '@/infra/auth/decorators/public.decorator';
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

const authenticateUserBodySchema = z.object({
  login: z.string().min(3),
  password: z.string().min(6).max(12).trim(),
});

type AuthenticateUserBodySchema = z.infer<typeof authenticateUserBodySchema>;

@Controller('/auth')
export class AuthenticateUserController {
  constructor(private authenticateUser: AuthenticateUserUseCase) {}

  @Public()
  @Post()
  @UsePipes(new ZodValidationPipe(authenticateUserBodySchema))
  async handler(@Body() body: AuthenticateUserBodySchema) {
    const { login, password } = body;

    const result = await this.authenticateUser.execute({
      login,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { accessToken } = result.value;

    return {
      accessToken,
    };
  }
}
