import 'reflect-metadata';

import { Controller, Get } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
} from 'vitest';
import {
  corsOriginsSchema,
  createCorsOptions,
} from '../src/config/cors';

@Controller('test')
class CorsTestController {
  @Get()
  check() {
    return { ok: true };
  }
}

describe('Configuração de CORS', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CorsTestController],
    }).compile();

    app = moduleRef.createNestApplication();

    const origins = corsOriginsSchema.parse(
      'http://localhost:8081',
    );

    app.enableCors(createCorsOptions(origins));
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
  });

  it('permite a origem configurada', async () => {
    await request(app.getHttpServer())
      .get('/test')
      .set('Origin', 'http://localhost:8081')
      .expect('Access-Control-Allow-Origin', 'http://localhost:8081')
      .expect(200);
  });

  it('não concede acesso CORS a uma origem diferente', async () => {
    const response = await request(app.getHttpServer())
      .get('/test')
      .set('Origin', 'https://nao-permitido.example')
      .expect(200);

    expect(
      response.headers['access-control-allow-origin'],
    ).toBeUndefined();
  });

  it('responde ao preflight de uma origem permitida', async () => {
    await request(app.getHttpServer())
      .options('/test')
      .set('Origin', 'http://localhost:8081')
      .set('Access-Control-Request-Method', 'GET')
      .expect('Access-Control-Allow-Origin', 'http://localhost:8081')
      .expect(204);
  });

  it('aceita lista vazia como padrão', () => {
    expect(corsOriginsSchema.parse(undefined)).toEqual([]);
    expect(createCorsOptions([]).origin).toBe(false);
  });

  it('aceita múltiplas origens separadas por vírgula', () => {
    expect(
      corsOriginsSchema.parse(
        'http://localhost:8081, https://app.example.com',
      ),
    ).toEqual([
      'http://localhost:8081',
      'https://app.example.com',
    ]);
  });

  it.each([
    '*',
    'origem-invalida',
    'https://app.example.com/perfil',
    'https://app.example.com/',
  ])('rejeita a configuração inválida: %s', (value) => {
    expect(() => corsOriginsSchema.parse(value)).toThrow();
  });
});