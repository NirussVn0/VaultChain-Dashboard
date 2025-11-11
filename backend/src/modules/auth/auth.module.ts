import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({
      defaultStrategy: "jwt",
      property: "user",
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const expiresRaw = configService.get<string>("JWT_EXPIRES_IN") ?? "3600";
        const expiresIn = Number(expiresRaw);

        return {
          secret: configService.get<string>("JWT_SECRET") ?? "change-me",
          signOptions: {
            expiresIn: Number.isNaN(expiresIn) ? 3600 : expiresIn,
          },
        };
      },
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, LocalAuthGuard, JwtAuthGuard],
  exports: [AuthService],
})
export class AuthModule {}
