import { Module } from "@nestjs/common";
import { createAppConfigProvider } from "../../common/providers/app-config.provider";
import { AiController } from "./ai.controller";
import { AiService } from "./ai.service";
import { AiProviderFactory, AI_PROVIDER } from "./providers/ai-provider.factory";

@Module({
  controllers: [AiController],
  providers: [
    AiService,
    AiProviderFactory,
    createAppConfigProvider(),
    {
      provide: AI_PROVIDER,
      inject: [AiProviderFactory],
      useFactory: (factory: AiProviderFactory) => factory.create(),
    },
  ],
  exports: [AiService],
})
export class AiModule {}
