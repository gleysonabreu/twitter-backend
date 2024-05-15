import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';
import { UnLikePostUseCase } from '@/domain/post/use-cases/unlike-post';
import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator';
import { TokenPayload } from '@/infra/auth/strategies/jwt.strategy';
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common';

@Controller('/posts/:id/unlike')
export class DeleteLikePostController {
  constructor(private unLikePost: UnLikePostUseCase) {}

  @Delete()
  @HttpCode(204)
  async handler(
    @Param('id') id: string,
    @CurrentUser() currentUser: TokenPayload,
  ) {
    const { sub: userId } = currentUser;

    const result = await this.unLikePost.execute({
      postId: id,
      userId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
