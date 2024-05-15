import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';
import { DeleteCommentOnPostUseCase } from '@/domain/post/use-cases/delete-comment-on-post';
import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator';
import { TokenPayload } from '@/infra/auth/strategies/jwt.strategy';
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
  UnauthorizedException,
} from '@nestjs/common';

@Controller('/comments/:id')
export class DeleteCommentOnPostController {
  constructor(private deleteCommentOnPost: DeleteCommentOnPostUseCase) {}

  @Delete()
  @HttpCode(204)
  async handler(
    @Param('id') id: string,
    @CurrentUser() currentUser: TokenPayload,
  ) {
    const { sub: userId } = currentUser;

    const result = await this.deleteCommentOnPost.execute({
      userId,
      commentId: id,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case NotAllowedError:
          throw new UnauthorizedException(error.message);
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
