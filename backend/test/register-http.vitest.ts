import 'reflect-metadata';

import { randomUUID } from 'node:crypto';
import type { INestApplication } from '@nestjs/common';
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

import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';
import { PasswordService } from '../src/modules/auth/services/password.service';

describe('POST /api/auth/register', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let inicializado = false;

  const emailsCriados: string[] = [];

  function novoCadastro(papel = 'CONTRATANTE') {
    const email = `http-${randomUUID()}@example.com`;
    emailsCriados.push(email);

    return {
      nome: 'Pessoa de Teste HTTP',
      email,
      senha: 'Minha senha segura de teste!',
      confirmacaoSenha: 'Minha senha segura de teste!',
      papel,
    };
  }

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');

    prisma = app.get(PrismaService);

    await app.init();
    inicializado = true;
  });

  afterEach(async () => {
    vi.restoreAllMocks();

    if (!inicializado || emailsCriados.length === 0) {
      return;
    }

    const emails = [...emailsCriados];

    await prisma.$transaction([
      prisma.perfilUsuario.deleteMany({
        where: {
          usuario: {
            email: { in: emails },
          },
        },
      }),
      prisma.usuario.deleteMany({
        where: {
          email: { in: emails },
        },
      }),
    ]);

    emailsCriados.length = 0;
  });

  afterAll(async () => {
    if (inicializado) {
      await app.close();
    } else if (prisma) {
      await prisma.$disconnect();
    }
  });

  it.each(['CONTRATANTE', 'PRESTADOR'])(
    'retorna 201 e salva cadastro como %s sem expor a senha',
    async (papel) => {
      const dados = novoCadastro(papel);

      const resposta = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(dados)
        .expect(201);

      expect(resposta.headers['cache-control']).toBe('no-store');

      expect(Object.keys(resposta.body).sort()).toEqual(
        [
          'idUsuario',
          'nome',
          'email',
          'statusConta',
          'dataCadastro',
          'perfis',
        ].sort(),
      );

      expect(resposta.body.email).toBe(dados.email);
      expect(resposta.body.statusConta).toBe('ATIVA');
      expect(resposta.body.perfis).toHaveLength(1);
      expect(resposta.body.perfis[0].tipoUsuario.nomeTipo).toBe(papel);
      expect(JSON.stringify(resposta.body)).not.toContain(dados.senha);

      const usuario = await prisma.usuario.findUniqueOrThrow({
        where: { email: dados.email },
      });

      const passwordService = new PasswordService();

      await expect(
        passwordService.verify(usuario.senhaHash, dados.senha),
      ).resolves.toBe(true);
    },
  );

  it.each([
    ['senhas diferentes', { confirmacaoSenha: 'Outra senha diferente!' }],
    ['papel administrativo', { papel: 'ADMINISTRADOR' }],
    ['campo extra', { statusConta: 'ATIVA' }],
  ])('retorna 400 para %s e não grava usuário', async (_nome, alteracao) => {
    const dados = novoCadastro();

    const resposta = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        ...dados,
        ...alteracao,
      })
      .expect(400);

    expect(resposta.body.message).toBe('Dados de cadastro inválidos.');
    expect(JSON.stringify(resposta.body)).not.toContain(dados.senha);

    expect(
      await prisma.usuario.count({
        where: { email: dados.email },
      }),
    ).toBe(0);
  });

  it('retorna 409 para email já cadastrado', async () => {
    const dados = novoCadastro();

    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send(dados)
      .expect(201);

    const resposta = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        ...dados,
        email: dados.email.toUpperCase(),
      })
      .expect(409);

    expect(resposta.body.message).toBe('Email já cadastrado.');

    expect(
      await prisma.usuario.count({
        where: { email: dados.email },
      }),
    ).toBe(1);
  });

  it('retorna 503 quando o tipo de usuário não está disponível', async () => {
    const dados = novoCadastro();

    // Não remove os tipos reais do banco.
    vi.spyOn(prisma.tipoUsuario, 'findUnique').mockResolvedValueOnce(null);

    const resposta = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send(dados)
      .expect(503);

    expect(resposta.body.message).toBe(
      'Cadastro temporariamente indisponível.',
    );

    expect(
      await prisma.usuario.count({
        where: { email: dados.email },
      }),
    ).toBe(0);
  });
});