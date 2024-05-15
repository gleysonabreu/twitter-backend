import { FollowUserUseCase } from '@/domain/user/use-cases/follow-user';
import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator';
import { TokenPayload } from '@/infra/auth/strategies/jwt.strategy';
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';

@Controller('/follows')
export class CreateFollowUserController {
  constructor(private followUser: FollowUserUseCase) {}

  @Post('/:followedBy')
  @HttpCode(204)
  async handlerCreate(
    @Param('followedBy') followedBy: string,
    @CurrentUser() currentUser: TokenPayload,
  ) {
    const { sub: followingId } = currentUser;

    const result = await this.followUser.execute({
      followingId,
      followedBy,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }

  @Delete('/:followedBy')
  @HttpCode(204)
  async handlerDelete(
    @Param('followedBy') followedBy: string,
    @CurrentUser() currentUser: TokenPayload,
  ) {
    const { sub: followingId } = currentUser;

    const result = await this.followUser.execute({
      followingId,
      followedBy,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
