import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator';
import { TokenPayload } from '@/infra/auth/strategies/jwt.strategy';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { CommentOnPostUseCase } from '@/domain/post/use-cases/comment-on-post';

const createCommentOnPostBodySchema = z.object({
  content: z.string().min(1).max(300),
});

type CreateCommentOnPostBodySchema = z.infer<
  typeof createCommentOnPostBodySchema
>;

@Controller('/posts/:id/comments')
export class CreateCommentOnPostController {
  constructor(private commentOnPost: CommentOnPostUseCase) {}

  @Post()
  @HttpCode(204)
  async handler(
    @Body(new ZodValidationPipe(createCommentOnPostBodySchema))
    body: CreateCommentOnPostBodySchema,
    @CurrentUser() currentUser: TokenPayload,
    @Param('id') postId: string,
  ) {
    const { content } = body;
    const { sub: userId } = currentUser;

    const result = await this.commentOnPost.execute({
      content,
      userId,
      postId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
