import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator';
import { TokenPayload } from '@/infra/auth/strategies/jwt.strategy';
import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';
import { GetCommentByIdUseCase } from '@/domain/post/use-cases/get-comment-by-id';
import { CommentPresenter } from '../presenters/comment-presenter';

@Controller('/comments/:id')
export class GetCommentByIdController {
  constructor(private getComment: GetCommentByIdUseCase) {}

  @Get()
  async handler(
    @Param('id') id: string,
    @CurrentUser() currentUser: TokenPayload,
  ) {
    const { sub: userId } = currentUser;
    const commentId = id;

    const result = await this.getComment.execute({ commentId, userId });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        case NotAllowedError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException();
      }
    }

    const comment = result.value.comment;

    return {
      comment: CommentPresenter.toHTTP(comment),
    };
  }
}
