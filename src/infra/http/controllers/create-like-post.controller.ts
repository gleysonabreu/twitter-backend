import { PostAlreadyLikedError } from '@/domain/post/use-cases/errors/post-already-liked-error';
import { LikePostUseCase } from '@/domain/post/use-cases/like-post';
import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator';
import { TokenPayload } from '@/infra/auth/strategies/jwt.strategy';
import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';

@Controller('/posts/:id/like')
export class CreateLikePostController {
  constructor(private likePost: LikePostUseCase) {}

  @Post()
  @HttpCode(204)
  async handler(
    @Param('id') id: string,
    @CurrentUser() currentUser: TokenPayload,
  ) {
    const { sub: userId } = currentUser;

    const result = await this.likePost.execute({
      postId: id,
      userId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case PostAlreadyLikedError:
          throw new BadRequestException(error.message);
        default:
          throw new BadRequestException();
      }
    }
  }
}
