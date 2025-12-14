import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingService } from './logger/logger.service';
import { CatchEverythingFilter } from './filter/catch.everything.filter';
import { HttpAdapterHost } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const logger = app.get(LoggingService);
  app.useLogger(logger);

  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new CatchEverythingFilter(httpAdapterHost, logger));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    logger.error(
      `Uncaught Exception: ${error.message}`,
      error.stack,
      'UncaughtException',
    );
  });

  // Handle unhandled rejections
  process.on('unhandledRejection', (reason, promise) => {
    logger.error(
      `Unhandled Rejection at: ${promise}`,
      `Reason: ${reason}`,
      'UnhandledRejection',
    );
  });

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
