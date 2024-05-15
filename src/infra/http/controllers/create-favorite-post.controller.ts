import { FavoritePostAlreadyExistsError } from '@/domain/post/use-cases/errors/favorite-post-already-exists-error';
import { FavoritePostUseCase } from '@/domain/post/use-cases/favorite-post';
import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator';
import { TokenPayload } from '@/infra/auth/strategies/jwt.strategy';
import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';

@Controller('/posts/:id/favorite')
export class CreateFavoritePostController {
  constructor(private favoritePost: FavoritePostUseCase) {}

  @Post()
  @HttpCode(204)
  async handler(
    @Param('id') id: string,
    @CurrentUser() currentUser: TokenPayload,
  ) {
    const { sub: userId } = currentUser;

    const result = await this.favoritePost.execute({
      postId: id,
      userId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case FavoritePostAlreadyExistsError:
          throw new BadRequestException(error.message);
        default:
          throw new BadRequestException();
      }
    }
  }
}
