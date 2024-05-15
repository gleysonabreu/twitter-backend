import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';
import { UnLikeCommentUseCase } from '@/domain/post/use-cases/unlike-comment';
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

@Controller('/comments/:id/unlike')
export class DeleteLikeCommentController {
  constructor(private unLikeComment: UnLikeCommentUseCase) {}

  @Delete()
  @HttpCode(204)
  async handler(
    @Param('id') id: string,
    @CurrentUser() currentUser: TokenPayload,
  ) {
    const { sub: userId } = currentUser;

    const result = await this.unLikeComment.execute({
      commentId: id,
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
