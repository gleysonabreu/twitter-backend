import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';
import { UserDetailsPresenter } from '../presenters/user-details-presenter';
import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator';
import { TokenPayload } from '@/infra/auth/strategies/jwt.strategy';
import { FindUserDetailsByIdUseCase } from '@/domain/user/use-cases/find-user-details-by-id';

@Controller('/users/:id/details')
export class FindUserDetailsByIdController {
  constructor(private findUserDetailsById: FindUserDetailsByIdUseCase) {}

  @Get()
  async handler(
    @Param('id') id: string,
    @CurrentUser() currentUser: TokenPayload,
  ) {
    const { sub: userId } = currentUser;
    const result = await this.findUserDetailsById.execute({
      id,
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
