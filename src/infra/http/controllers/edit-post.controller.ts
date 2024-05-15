import { EditPostUseCase } from '@/domain/post/use-cases/edit-post';
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

const editPostBodySchema = z.object({
  content: z.string().min(1).max(600),
});

type EditPostBodySchema = z.infer<typeof editPostBodySchema>;

@Controller('/posts/:id')
export class EditPostController {
  constructor(private editPost: EditPostUseCase) {}

  @Put()
  @HttpCode(204)
  async handler(
    @Body(new ZodValidationPipe(editPostBodySchema)) body: EditPostBodySchema,
    @CurrentUser() currentUser: TokenPayload,
    @Param('id') id: string,
  ) {
    const { content } = body;
    const { sub: userId } = currentUser;

    const result = await this.editPost.execute({
      content,
      postId: id,
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
