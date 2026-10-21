import 'reflect-metadata';

import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  it,
  vi,
} from 'vitest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';

describe.sequential('GET /api/health', () => {
  let app: INestApplication | undefined;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');

    await app.init();

    prisma = app.get(PrismaService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(async () => {
    await app?.close();
  });

  it('retorna 200 quando o banco responde', async () => {
    await request(app!.getHttpServer())
      .get('/api/health')
      .expect('Cache-Control', 'no-store')
      .expect(200)
      .expect({
        status: 'ok',
        service: 'conecta-service-api',
        database: 'up',
      });
  });

  it('retorna 503 sem expor detalhes internos quando a consulta falha', async () => {
    vi.spyOn(prisma, '$queryRaw').mockRejectedValueOnce(
      new Error(
        'Falha interna: postgresql://usuario:senha-secreta@servidor/banco',
      ),
    );

    await request(app!.getHttpServer())
      .get('/api/health')
      .expect('Cache-Control', 'no-store')
      .expect(503)
      .expect({
        status: 'error',
        service: 'conecta-service-api',
        database: 'down',
      });
  });

  it('volta a retornar 200 depois de uma falha temporária', async () => {
    vi.spyOn(prisma, '$queryRaw').mockRejectedValueOnce(
      new Error('Falha temporária'),
    );

    await request(app!.getHttpServer())
      .get('/api/health')
      .expect(503);

    // A simulação afeta somente a primeira chamada.
    // Esta segunda consulta utiliza o PostgreSQL real.
    await request(app!.getHttpServer())
      .get('/api/health')
      .expect(200)
      .expect({
        status: 'ok',
        service: 'conecta-service-api',
        database: 'up',
      });
  });
});