import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { createCorsOptions } from './config/cors';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const corsOrigins =
    configService.getOrThrow<string[]>('CORS_ORIGINS');

  app.enableCors(createCorsOptions(corsOrigins));

  app.setGlobalPrefix('api');

  // Executa os hooks de encerramento ao receber sinais como SIGTERM.
  app.enableShutdownHooks();

  const swaggerEnabled =
    configService.getOrThrow<boolean>('SWAGGER_ENABLED');

  if (swaggerEnabled) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Conecta Service API')
      .setDescription('API de prestação e contratação de serviços.')
      .setVersion('0.1.0')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);

    SwaggerModule.setup('docs', app, document);
  }

  const port = configService.getOrThrow<number>('PORT');

  try {
    await app.listen(port);
  } catch {
    Logger.error(
      'Não foi possível iniciar a API. Verifique o banco de dados e a porta configurada.',
      'Bootstrap',
    );

    // Evita reutilizar app.close() após uma inicialização que falhou.
    // O processo termina e libera os recursos restantes.
    process.exit(1);
  }
}

void bootstrap().catch(() => {
  Logger.error('Falha na inicialização da aplicação.', 'Bootstrap');
  process.exit(1);
});