import { CreatePostUseCase } from '@/domain/post/use-cases/create-post';
import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator';
import { TokenPayload } from '@/infra/auth/strategies/jwt.strategy';
import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

const createPostBodySchema = z.object({
  content: z.string().min(1).max(600),
});

type CreatePostBodySchema = z.infer<typeof createPostBodySchema>;

@Controller('/posts')
export class CreatePostController {
  constructor(private createPostUseCase: CreatePostUseCase) {}

  @Post()
  async handler(
    @Body(new ZodValidationPipe(createPostBodySchema))
    body: CreatePostBodySchema,
    @CurrentUser() currentUser: TokenPayload,
  ) {
    const { content } = body;
    const { sub: userId } = currentUser;

    const result = await this.createPostUseCase.execute({
      content,
      userId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
