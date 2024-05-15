import { CommentAlreadyLikedError } from '@/domain/post/use-cases/errors/comment-already-liked-error';
import { LikeCommentUseCase } from '@/domain/post/use-cases/like-comment';
import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator';
import { TokenPayload } from '@/infra/auth/strategies/jwt.strategy';
import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';

@Controller('/comments/:id/like')
export class CreateLikeCommentController {
  constructor(private likeComment: LikeCommentUseCase) {}

  @Post()
  @HttpCode(204)
  async handler(
    @Param('id') id: string,
    @CurrentUser() currentUser: TokenPayload,
  ) {
    const { sub: userId } = currentUser;

    const result = await this.likeComment.execute({
      commentId: id,
      userId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case CommentAlreadyLikedError:
          throw new BadRequestException(error.message);
        default:
          throw new BadRequestException();
      }
    }
  }
}
