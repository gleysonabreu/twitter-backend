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
import { FetchFollowingUserUseCase } from '@/domain/user/use-cases/fetch-following-user';
import { UserDetailsPresenter } from '../presenters/user-details-presenter';

const pageQueryParamsSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamsSchema);
type PageQueryParamSchema = z.infer<typeof pageQueryParamsSchema>;

@Controller('/users/:id/following')
export class FetchFollowingUserController {
  constructor(private fetchFollowingUser: FetchFollowingUserUseCase) {}

  @Get()
  async handler(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @Param('id') id: string,
    @CurrentUser() currentUser: TokenPayload,
  ) {
    const { sub: userId } = currentUser;

    const result = await this.fetchFollowingUser.execute({
      userId,
      page,
      followingId: id,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const { following } = result.value;

    return {
      following: following.map(UserDetailsPresenter.toHTTP),
    };
  }
}
