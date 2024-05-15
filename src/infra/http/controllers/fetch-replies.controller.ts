import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator';
import { TokenPayload } from '@/infra/auth/strategies/jwt.strategy';
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { CommentWithUserPresenter } from '../presenters/comment-with-user-presenter';
import { FetchReplyCommentsUseCase } from '@/domain/post/use-cases/fetch-reply-comments';

const pageQueryParamsSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamsSchema);
type PageQueryParamSchema = z.infer<typeof pageQueryParamsSchema>;

@Controller('/comments/:id/reply')
export class FetchRepliesController {
  constructor(private fetchReplies: FetchReplyCommentsUseCase) {}

  @Get()
  async handler(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @Param('id') commentId: string,
    @CurrentUser() currentUser: TokenPayload,
  ) {
    const { sub: userId } = currentUser;

    const result = await this.fetchReplies.execute({
      userId,
      page,
      commentId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const { comments } = result.value;

    return {
      comments: comments.map(CommentWithUserPresenter.toHTTP),
    };
  }
}
