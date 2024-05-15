import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator';
import { TokenPayload } from '@/infra/auth/strategies/jwt.strategy';
import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { PostWithUserPresenter } from '../presenters/post-with-user-presenter';
import { FetchPostsLikedUseCase } from '@/domain/post/use-cases/fetch-posts-liked';

const pageQueryParamsSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamsSchema);
type PageQueryParamSchema = z.infer<typeof pageQueryParamsSchema>;

@Controller('/likes')
export class FetchLikedPostsByUserIdController {
  constructor(private fetchLikedPosts: FetchPostsLikedUseCase) {}

  @Get()
  async handler(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @CurrentUser() currentUser: TokenPayload,
  ) {
    const { sub: userId } = currentUser;

    const result = await this.fetchLikedPosts.execute({
      userId,
      page,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const { posts } = result.value;

    return {
      posts: posts.map(PostWithUserPresenter.toHTTP),
    };
  }
}
