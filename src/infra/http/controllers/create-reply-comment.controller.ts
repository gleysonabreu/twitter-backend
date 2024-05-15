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
import { ReplyCommentUseCase } from '@/domain/post/use-cases/reply-comment';

const createReplyCommentBodySchema = z.object({
  content: z.string().min(1).max(300),
});

type CreateReplyCommentBodySchema = z.infer<
  typeof createReplyCommentBodySchema
>;

@Controller('/comments/:id/reply')
export class CreateReplyCommentController {
  constructor(private replyComment: ReplyCommentUseCase) {}

  @Post()
  @HttpCode(204)
  async handler(
    @Body(new ZodValidationPipe(createReplyCommentBodySchema))
    body: CreateReplyCommentBodySchema,
    @CurrentUser() currentUser: TokenPayload,
    @Param('id') commentId: string,
  ) {
    const { content } = body;
    const { sub: userId } = currentUser;

    const result = await this.replyComment.execute({
      content,
      userId,
      commentId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
