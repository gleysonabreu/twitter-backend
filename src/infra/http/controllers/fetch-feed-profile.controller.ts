import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { PostWithUserPresenter } from '../presenters/post-with-user-presenter';
import { FetchFeedProfileUseCase } from '@/domain/post/use-cases/fetch-feed-profile';
import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator';
import { TokenPayload } from '@/infra/auth/strategies/jwt.strategy';

const pageQueryParamsSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamsSchema);
type PageQueryParamSchema = z.infer<typeof pageQueryParamsSchema>;

@Controller('/profile/:userId/feed')
export class FetchFeedProfileController {
  constructor(private fetchFeedProfile: FetchFeedProfileUseCase) {}

  @Get()
  async handler(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @Param('userId') userId: string,
    @CurrentUser() currentUser: TokenPayload,
  ) {
    const { sub: currentUserId } = currentUser;
    const result = await this.fetchFeedProfile.execute({
      userId,
      currentUserId,
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
