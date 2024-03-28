import {ExecutionContext, createParamDecorator} from "@nestjs/common";
import {UUID} from "crypto";
import {UserRole} from "src/auth/types";

export const User = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;

})

export interface UserAfterAuth {
  id: string
  email: string,
  name: string,
  phone: string,
  role: UserRole,
  createdAt: Date,
  updatedAt: Date,

}