import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator';
import { TokenPayload } from '@/infra/auth/strategies/jwt.strategy';
import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { PostWithUserPresenter } from '../presenters/post-with-user-presenter';
import { FetchFavoritePostsUseCase } from '@/domain/post/use-cases/fetch-favorite-posts';

const pageQueryParamsSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamsSchema);
type PageQueryParamSchema = z.infer<typeof pageQueryParamsSchema>;

@Controller('/favorites')
export class FetchFavoritePostsByUserIdController {
  constructor(private fetchFavoritePosts: FetchFavoritePostsUseCase) {}

  @Get()
  async handler(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @CurrentUser() currentUser: TokenPayload,
  ) {
    const { sub: userId } = currentUser;

    const result = await this.fetchFavoritePosts.execute({
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
