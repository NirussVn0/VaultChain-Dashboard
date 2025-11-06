import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { configuration } from "./common/config/app.config";
import { AiModule } from "./modules/ai/ai.module";
import { HealthModule } from "./modules/health/health.module";
import { MarketModule } from "./modules/market/market.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", ".env.local"],
      load: [configuration],
    }),
    HealthModule,
    MarketModule,
    AiModule,
  ],
})
export class AppModule {}
