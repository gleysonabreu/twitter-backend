import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator';
import { TokenPayload } from '@/infra/auth/strategies/jwt.strategy';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { EditCommentOnPostUseCase } from '@/domain/post/use-cases/edit-comment-on-post';

const editCommentOnPostBodySchema = z.object({
  content: z.string().min(1).max(300),
});

type EditCommentOnPostBodySchema = z.infer<typeof editCommentOnPostBodySchema>;

@Controller('/comments/:id')
export class EditCommentOnPostController {
  constructor(private editComment: EditCommentOnPostUseCase) {}

  @Put()
  @HttpCode(204)
  async handler(
    @Body(new ZodValidationPipe(editCommentOnPostBodySchema))
    body: EditCommentOnPostBodySchema,
    @CurrentUser() currentUser: TokenPayload,
    @Param('id') id: string,
  ) {
    const { content } = body;
    const { sub: userId } = currentUser;

    const result = await this.editComment.execute({
      content,
      commentId: id,
      userId,
    });

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
  }
}
