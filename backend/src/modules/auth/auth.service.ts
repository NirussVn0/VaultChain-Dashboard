import { ConflictException, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { hash, verify } from "argon2";

import { UsersService } from "../users/users.service";
import { AuthPrincipal, JwtPayload } from "./auth.types";
import { AuthResponseDto, AuthenticatedUserDto } from "./dto/auth-response.dto";
import { RegisterDto } from "./dto/register.dto";

/**
 * AuthService orchestrates account lifecycle events and token issuance.
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly passwordPepper: string;
  private readonly jwtExpiresInSeconds: number;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.passwordPepper = this.configService.get<string>("PASSWORD_PEPPER") ?? "";
    this.jwtExpiresInSeconds = this.parseExpires(
      this.configService.get<string>("JWT_EXPIRES_IN") ?? "3600",
    );
  }

  async register(payload: RegisterDto): Promise<AuthResponseDto> {
    const email = this.normalizeEmail(payload.email);
    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      throw new ConflictException("Email is already registered.");
    }

    const passwordHash = await this.hashPassword(payload.password, email);
    const created = await this.usersService.createUser({
      email,
      passwordHash,
      displayName: payload.displayName,
      roles: payload.roles,
    });

    const hydrated = await this.usersService.touchLastLogin(created.id);
    const principal = this.toPrincipal(hydrated);
    this.logger.log(`Registered account ${principal.id} (${principal.email}).`);
    return this.buildAuthResponse(principal);
  }

  async login(principal: AuthPrincipal): Promise<AuthResponseDto> {
    const updated = await this.usersService.touchLastLogin(principal.id);
    const freshPrincipal = this.toPrincipal(updated);
    this.logger.log(`User ${freshPrincipal.id} logged in.`);
    return this.buildAuthResponse(freshPrincipal);
  }

  async validateUser(email: string, password: string): Promise<AuthPrincipal> {
    const normalizedEmail = this.normalizeEmail(email);
    const user = await this.usersService.findByEmail(normalizedEmail);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials.");
    }

    const isValid = await verify(user.passwordHash, this.withPepper(password, normalizedEmail));
    if (!isValid) {
      throw new UnauthorizedException("Invalid credentials.");
    }

    return this.toPrincipal(user);
  }

  getProfile(principal: AuthPrincipal): AuthenticatedUserDto {
    return this.toDto(principal);
  }

  private async buildAuthResponse(principal: AuthPrincipal): Promise<AuthResponseDto> {
    const payload: JwtPayload = {
      sub: principal.id,
      email: principal.email,
      roles: principal.roles,
      pv: principal.passwordVersion,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    return {
      accessToken,
      expiresIn: this.jwtExpiresInSeconds,
      user: this.toDto(principal),
    };
  }

  private async hashPassword(password: string, email: string): Promise<string> {
    return hash(this.withPepper(password, email));
  }

  private withPepper(password: string, email: string): string {
    return `${password}${this.passwordPepper}${email}`;
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private toPrincipal(user: User): AuthPrincipal {
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

  private toDto(principal: AuthPrincipal): AuthenticatedUserDto {
    return {
      id: principal.id,
      email: principal.email,
      displayName: principal.displayName,
      roles: principal.roles,
      createdAt: principal.createdAt,
      lastLoginAt: principal.lastLoginAt,
    };
  }

  private parseExpires(value: string): number {
    if (!value) {
      return 3600;
    }
    if (/^\d+$/.test(value)) {
      return Number(value);
    }

    const match = value.match(/^(\d+)([smhd])$/i);
    if (!match) {
      return 3600;
    }

    const amount = Number(match[1]);
    const unit = match[2].toLowerCase();
    switch (unit) {
      case "s":
        return amount;
      case "m":
        return amount * 60;
      case "h":
        return amount * 3600;
      case "d":
        return amount * 86400;
      default:
        return 3600;
    }
  }
}
