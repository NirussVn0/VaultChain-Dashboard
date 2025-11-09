import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";

import { AuthService } from "../auth.service";
import { AuthPrincipal } from "../auth.types";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: false,
    });
  }

  async validate(email: string, password: string): Promise<AuthPrincipal> {
    return this.authService.validateUser(email, password);
  }
}
