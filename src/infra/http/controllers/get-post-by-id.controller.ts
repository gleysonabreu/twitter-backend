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
import { GetPostWithDetailsByIdUseCase } from '@/domain/post/use-cases/get-post-with-details-by-id';
import { PostWithUserPresenter } from '../presenters/post-with-user-presenter';

@Controller('/posts/:id')
export class GetPostByIdController {
  constructor(private getPostById: GetPostWithDetailsByIdUseCase) {}

  @Get()
  async handler(
    @Param('id') id: string,
    @CurrentUser() currentUser: TokenPayload,
  ) {
    const { sub: userId } = currentUser;
    const postId = id;

    const result = await this.getPostById.execute({ postId, userId });

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

    const post = result.value.post;

    return {
      post: PostWithUserPresenter.toHTTP(post),
    };
  }
}
