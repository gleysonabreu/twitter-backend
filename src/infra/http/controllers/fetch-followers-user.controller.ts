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
import { UserDetailsPresenter } from '../presenters/user-details-presenter';
import { FetchFollowersUserUseCase } from '@/domain/user/use-cases/fetch-followers-user';

const pageQueryParamsSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamsSchema);
type PageQueryParamSchema = z.infer<typeof pageQueryParamsSchema>;

@Controller('/users/:id/followers')
export class FetchFollowersUserController {
  constructor(private fetchFollowersUser: FetchFollowersUserUseCase) {}

  @Get()
  async handler(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @Param('id') id: string,
    @CurrentUser() currentUser: TokenPayload,
  ) {
    const { sub: userId } = currentUser;

    const result = await this.fetchFollowersUser.execute({
      userId,
      page,
      followedById: id,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const { followers } = result.value;

    return {
      followers: followers.map(UserDetailsPresenter.toHTTP),
    };
  }
}
