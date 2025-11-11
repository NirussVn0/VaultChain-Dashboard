import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from "@nestjs/common";

import { AuthService } from "./auth.service";
import { AuthenticatedRequest } from "./auth.types";
import { AuthResponseDto, AuthenticatedUserDto } from "./dto/auth-response.dto";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { LocalAuthGuard } from "./guards/local-auth.guard";

@Controller({
  path: "auth",
  version: "1",
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() payload: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(payload);
  }

  @Post("login")
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(@Body() _payload: LoginDto, @Req() request: AuthenticatedRequest): Promise<AuthResponseDto> {
    return this.authService.login(request.user);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  async profile(@Req() request: AuthenticatedRequest): Promise<AuthenticatedUserDto> {
    return this.authService.getProfile(request.user);
  }
}
