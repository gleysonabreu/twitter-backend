import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator';
import { TokenPayload } from '@/infra/auth/strategies/jwt.strategy';
import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { SearchUserUseCase } from '@/domain/user/use-cases/search-user';
import { UserDetailsPresenter } from '../presenters/user-details-presenter';

const pageQueryParamsSchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1)),
  query: z.string(),
});

const queryValidationPipe = new ZodValidationPipe(pageQueryParamsSchema);
type PageQueryParamSchema = z.infer<typeof pageQueryParamsSchema>;

@Controller('/search')
export class SearchUserController {
  constructor(private searchUser: SearchUserUseCase) {}

  @Get()
  async handler(
    @Query(queryValidationPipe) queryParams: PageQueryParamSchema,
    @CurrentUser() currentUser: TokenPayload,
  ) {
    const { sub: userId } = currentUser;
    const { page, query } = queryParams;

    const result = await this.searchUser.execute({
      query,
      userId,
      page,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const { users } = result.value;

    return {
      users: users.map(UserDetailsPresenter.toHTTP),
    };
  }
}
