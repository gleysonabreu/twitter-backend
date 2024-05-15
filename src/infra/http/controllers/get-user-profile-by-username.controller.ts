import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';
import { GetUserByUsernameUseCase } from '@/domain/user/use-cases/get-user-by-username';
import { UserDetailsPresenter } from '../presenters/user-details-presenter';
import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator';
import { TokenPayload } from '@/infra/auth/strategies/jwt.strategy';

@Controller('/users')
export class GetUserProfileByUsernameController {
  constructor(private getUserByUsername: GetUserByUsernameUseCase) {}

  @Get()
  async handler(
    @Query('username') username: string,
    @CurrentUser() currentUser: TokenPayload,
  ) {
    const { sub: userId } = currentUser;
    const result = await this.getUserByUsername.execute({
      username,
      userId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException();
      }
    }

    const user = result.value.user;

    return {
      user: UserDetailsPresenter.toHTTP(user),
    };
  }
}
