import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { UsersService } from "../../users/users.service";
import { AuthPrincipal, JwtPayload } from "../auth.types";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_SECRET") ?? "change-me",
    });
  }

  async validate(payload: JwtPayload): Promise<AuthPrincipal> {
    const user = await this.usersService.findById(payload.sub);
    if (!user || user.passwordVersion !== payload.pv) {
      throw new UnauthorizedException("Invalid or expired token.");
    }

    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      roles: user.roles,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt ?? undefined,
      passwordVersion: user.passwordVersion,
    };
  }
}
