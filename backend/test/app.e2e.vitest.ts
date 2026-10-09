import 'reflect-metadata';

import { afterAll, beforeAll, describe, it } from 'vitest';
import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Rota inicial da API', () => {
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

  it('GET /api deve retornar Hello World!', async () => {
    if (!app) {
      throw new Error('A aplicação de teste não foi inicializada');
    }

    await request(app.getHttpServer())
      .get('/api')
      .expect(200)
      .expect('Hello World!');
  });
});