import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { configuration } from "./common/config/app.config";
import { PrismaModule } from "./common/prisma/prisma.module";
import { AiModule } from "./modules/ai/ai.module";
import { AuthModule } from "./modules/auth/auth.module";
import { HealthModule } from "./modules/health/health.module";
import { MarketModule } from "./modules/market/market.module";
import { UsersModule } from "./modules/users/users.module";
import { PortfolioModule } from "./modules/portfolio/portfolio.module";
import { WatchlistModule } from "./modules/watchlist/watchlist.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", ".env.local"],
      load: [configuration],
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    HealthModule,
    MarketModule,
    AiModule,
    PortfolioModule,
    WatchlistModule,
  ],
})
export class AppModule {}
