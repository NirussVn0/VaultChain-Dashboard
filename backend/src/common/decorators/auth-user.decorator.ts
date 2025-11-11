import { createParamDecorator, ExecutionContext } from "@nestjs/common";

import type { AuthPrincipal } from "../../modules/auth/auth.types";

export const AuthUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthPrincipal => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as AuthPrincipal;
  },
);
