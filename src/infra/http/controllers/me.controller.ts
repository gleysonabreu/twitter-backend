import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';
import { FindUserByIdUseCase } from '@/domain/user/use-cases/find-user-by-id';
import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator';
import { TokenPayload } from '@/infra/auth/strategies/jwt.strategy';
import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
} from '@nestjs/common';
import { UserPresenter } from '../presenters/user-presenter';

@Controller('/me')
export class MeController {
  constructor(private findUserByIdUseCase: FindUserByIdUseCase) {}

  @Get()
  async handler(@CurrentUser() currentUser: TokenPayload) {
    const { sub: userId } = currentUser;

    const result = await this.findUserByIdUseCase.execute({ id: userId });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { user } = result.value;
    const userHttp = UserPresenter.toHTTP(user);

    return userHttp;
  }
}
