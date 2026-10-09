import 'reflect-metadata';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('GET /api/health', () => {
  let app: INestApplication | undefined;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.setGlobalPrefix('api');

    await app.init();
  });

  afterAll(async () => {
    await app?.close();
  });

  it('deve retornar HTTP 200 e o status da API', async () => {
    if (!app) {
      throw new Error('A aplicação de teste não foi inicializada');
    }

    const response = await request(app.getHttpServer())
      .get('/api/health')
      .expect(200);

    expect(response.body).toEqual({
      status: 'ok',
      service: 'conecta-service-api',
    });
  });
});