import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IJWTPayload } from '../interfaces/user.interface';

export const UserInfo = createParamDecorator(
  (_: undefined, context: ExecutionContext): IJWTPayload => {
    const request = context.switchToHttp().getRequest();
    return request['userInfo'];
  },
);
