import 'reflect-metadata';

import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';

@Controller('test')
class ExceptionsTestController {
  @Get('invalid')
  invalid() {
    throw new BadRequestException('Dados inválidos.');
  }

  @Get('unavailable')
  unavailable() {
    throw new ServiceUnavailableException({
      status: 'error',
      service: 'conecta-service-api',
      database: 'down',
    });
  }

  @Get('unexpected')
  unexpected() {
    throw new Error(
      'Falha interna: postgresql://usuario:senha-secreta@servidor/banco',
    );
  }
}

describe('Filtro global de exceções', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ExceptionsTestController],
      providers: [
        {
          provide: APP_FILTER,
          useClass: AllExceptionsFilter,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(async () => {
    await app?.close();
  });

  it('preserva uma resposta HTTP 400 intencional', async () => {
    await request(app.getHttpServer())
      .get('/test/invalid')
      .expect(400)
      .expect({
        statusCode: 400,
        message: 'Dados inválidos.',
        error: 'Bad Request',
      });
  });

  it('preserva HTTP 404 para uma rota inexistente', async () => {
    const response = await request(app.getHttpServer())
      .get('/rota-inexistente')
      .expect(404);

    expect(response.body).toMatchObject({
      statusCode: 404,
      error: 'Not Found',
    });
  });

  it('preserva o formato personalizado do HTTP 503', async () => {
    await request(app.getHttpServer())
      .get('/test/unavailable')
      .expect(503)
      .expect({
        status: 'error',
        service: 'conecta-service-api',
        database: 'down',
      });
  });

  it('retorna 500 genérico e registra a falha sem detalhes sensíveis', async () => {
    const log = vi
      .spyOn(Logger.prototype, 'error')
      .mockImplementation(() => undefined);

    await request(app.getHttpServer())
      .get('/test/unexpected')
      .expect(500)
      .expect({
        statusCode: 500,
        message: 'Erro interno do servidor.',
        error: 'Internal Server Error',
      });

    expect(log).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenCalledWith(
      'Falha inesperada durante uma requisição HTTP.',
    );
  });
});