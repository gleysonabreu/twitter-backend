import { RegisterUserUseCase } from '@/domain/user/use-cases/register-user';
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { z } from 'zod';
import { UserAlreadyExistsError } from '@/domain/user/use-cases/errors/user-already-exists-error';
import { Public } from '@/infra/auth/decorators/public.decorator';

const createAccountBodySchema = z.object({
  firstName: z.string().min(1).max(18).trim(),
  lastName: z.string().min(1).max(18).trim(),
  password: z.string().min(6).max(12).trim(),
  email: z.string().email().trim(),
  username: z.string().min(4).trim(),
  birthDate: z.coerce.date(),
  bio: z.string().trim().optional(),
});
type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

@Controller('/accounts')
export class CreateAccountController {
  constructor(private registerUser: RegisterUserUseCase) {}

  @Public()
  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handler(@Body() body: CreateAccountBodySchema) {
    const { bio, birthDate, email, firstName, lastName, password, username } =
      body;

    const result = await this.registerUser.execute({
      bio,
      birthDate,
      email,
      firstName,
      lastName,
      password,
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
