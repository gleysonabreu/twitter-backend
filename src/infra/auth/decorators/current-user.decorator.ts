import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { TokenPayload } from '../strategies/jwt.strategy';

export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();

    return req.user as TokenPayload;
  },
);
