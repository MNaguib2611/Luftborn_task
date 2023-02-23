import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './user.entity';

export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    // prevent sensitive data from returning to the user
    delete request.user.password;
    delete request.user.salt;
    return request.user;
  },
);
