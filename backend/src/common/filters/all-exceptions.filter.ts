import {
  Catch,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type {
  ArgumentsHost,
  ExceptionFilter,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly adapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.adapterHost;
    const response = host.switchToHttp().getResponse();

    let status: number;
    let body: string | object;

    if (exception instanceof HttpException) {
      status = exception.getStatus();

      const originalBody = exception.getResponse();

      body =
        typeof originalBody === 'string'
          ? {
              statusCode: status,
              message: originalBody,
            }
          : originalBody;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;

      body = {
        statusCode: status,
        message: 'Erro interno do servidor.',
        error: 'Internal Server Error',
      };

      this.logger.error('Falha inesperada durante uma requisição HTTP.');
    }

    if (httpAdapter.isHeadersSent(response)) {
      httpAdapter.end(response);
      return;
    }

    httpAdapter.reply(response, body, status);
  }
}