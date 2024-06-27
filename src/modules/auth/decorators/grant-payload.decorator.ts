import { IGrantPayload } from '@common/interfaces/IGrantPayload';
import { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const User = createParamDecorator(
  (data: keyof IGrantPayload, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest() as Request;
    const user = request['user'] as IGrantPayload;

    return data ? user?.[data] : user;
  },
);