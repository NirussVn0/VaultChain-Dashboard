import { ValidationPipe, VersioningType } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import helmet from "helmet";

import { AppModule } from "./app.module";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>("app.port", 4000);
  const globalPrefix = configService.get<string>("app.globalPrefix", "api");
  const corsOrigin = configService.get<string>("app.corsOrigin", "*");

  app.setGlobalPrefix(globalPrefix, {
    exclude: [""],
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1",
  });

  app.enableCors({
    origin: corsOrigin === "*" ? true : corsOrigin.split(","),
    credentials: true,
  });

  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(port);
  const appUrl = await app.getUrl();
  // eslint-disable-next-line no-console
  console.log(`🚀 Backend ready at ${appUrl}/${globalPrefix}/v1`);
}

void bootstrap();
