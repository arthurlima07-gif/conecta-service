import 'reflect-metadata';
import 'dotenv/config';

import { randomUUID } from 'node:crypto';

import type { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
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
import {
  PapelUsuario,
  StatusConta,
  StatusPerfil,
} from '../src/generated/prisma/enums';
import { AccessTokenService } from '../src/modules/auth/services/access-token.service';
import { RegisterService } from '../src/modules/auth/services/register.service';

interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  usuario: {
    idUsuario: number;
    nome: string;
    email: string;
    papeis: string[];
  };
}

interface TokenPayload {
  sub: string;
  iat: number;
  exp: number;
}

describe('POST /api/auth/login', () => {
  const senha = 'Minha senha segura de teste!';
  const emails: string[] = [];

  let app: INestApplication | undefined;
  let prisma: PrismaService | undefined;
  let registerService: RegisterService;
  let accessTokenService: AccessTokenService;
  let configService: ConfigService;
  let verifier: JwtService;
  let initialized = false;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');

    prisma = moduleRef.get(PrismaService);
    registerService = moduleRef.get(RegisterService);
    accessTokenService = moduleRef.get(AccessTokenService);
    configService = moduleRef.get(ConfigService);

    await app.init();
    initialized = true;

    verifier = new JwtService({
      secret: Buffer.from(
        configService.getOrThrow<string>('JWT_SECRET'),
        'hex',
      ),
      verifyOptions: {
        algorithms: ['HS256'],
      },
    });

    const tipos = await prisma.tipoUsuario.count({
      where: {
        nomeTipo: {
          in: [
            PapelUsuario.CONTRATANTE,
            PapelUsuario.PRESTADOR,
          ],
        },
      },
    });

    if (tipos !== 2) {
      throw new Error(
        'Execute npx prisma db seed antes dos testes de login.',
      );
    }
  });

  afterEach(async () => {
    vi.restoreAllMocks();

    if (prisma && emails.length > 0) {
      await prisma.$transaction([
        prisma.perfilUsuario.deleteMany({
          where: {
            usuario: {
              email: {
                in: [...emails],
              },
            },
          },
        }),
        prisma.usuario.deleteMany({
          where: {
            email: {
              in: [...emails],
            },
          },
        }),
      ]);

      emails.length = 0;
    }
  });

  afterAll(async () => {
    if (initialized && app) {
      await app.close();
    } else if (prisma) {
      await prisma.$disconnect();
    }
  });

  async function criarUsuario(
    papel: 'CONTRATANTE' | 'PRESTADOR' = 'CONTRATANTE',
  ) {
    const email = `login-http-${randomUUID()}@example.com`;
    emails.push(email);

    return registerService.execute({
      nome: 'Pessoa de Teste',
      email,
      senha,
      confirmacaoSenha: senha,
      papel,
    });
  }

  it.each(['CONTRATANTE', 'PRESTADOR'] as const)(
    'retorna 200 e JWT válido para %s',
    async (papel) => {
      const usuario = await criarUsuario(papel);

      const response = await request(app!.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: usuario.email,
          senha,
        })
        .expect(200);

      const body = response.body as LoginResponse;

      expect(body).toEqual({
        accessToken: expect.any(String),
        tokenType: 'Bearer',
        expiresIn: configService.getOrThrow<number>(
          'JWT_EXPIRES_IN_SECONDS',
        ),
        usuario: {
          idUsuario: usuario.idUsuario,
          nome: usuario.nome,
          email: usuario.email,
          papeis: [papel],
        },
      });

      expect(response.headers['cache-control']).toBe('no-store');

      const payload = await verifier.verifyAsync<TokenPayload>(
        body.accessToken,
      );

      expect(payload.sub).toBe(String(usuario.idUsuario));
      expect(payload.exp - payload.iat).toBe(body.expiresIn);
      expect(Object.keys(payload).sort()).toEqual([
        'exp',
        'iat',
        'sub',
      ]);
    },
  );

  it('normaliza o email antes de autenticar', async () => {
    const usuario = await criarUsuario();

    const response = await request(app!.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: `  ${usuario.email.toUpperCase()}  `,
        senha,
      })
      .expect(200);

    expect(response.body.usuario.email).toBe(usuario.email);
  });

  it.each([
    'senha incorreta',
    'email inexistente',
    'conta inativa',
    'perfis inativos',
    'sem perfil',
  ])('retorna 401 sem emitir token: %s', async (cenario) => {
    const usuario = await criarUsuario();

    let emailLogin = usuario.email;
    let senhaLogin = senha;

    if (cenario === 'senha incorreta') {
      senhaLogin = 'Outra senha diferente!';
    }

    if (cenario === 'email inexistente') {
      emailLogin = `inexistente-${randomUUID()}@example.com`;
    }

    if (cenario === 'conta inativa') {
      await prisma!.usuario.update({
        where: {
          idUsuario: usuario.idUsuario,
        },
        data: {
          statusConta: StatusConta.INATIVA,
        },
      });
    }

    if (cenario === 'perfis inativos') {
      await prisma!.perfilUsuario.updateMany({
        where: {
          idUsuario: usuario.idUsuario,
        },
        data: {
          status: StatusPerfil.INATIVO,
        },
      });
    }

    if (cenario === 'sem perfil') {
      await prisma!.perfilUsuario.deleteMany({
        where: {
          idUsuario: usuario.idUsuario,
        },
      });
    }

    const issueSpy = vi.spyOn(accessTokenService, 'execute');

    const response = await request(app!.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: emailLogin,
        senha: senhaLogin,
      })
      .expect(401);

    expect(response.body).toEqual({
      statusCode: 401,
      message: 'Email ou senha inválidos.',
      error: 'Unauthorized',
    });

    expect(issueSpy).not.toHaveBeenCalled();
  });

  it.each([
    {},
    { email: 'invalido', senha },
    { email: 'pessoa@example.com', senha: '' },
    {
      email: 'pessoa@example.com',
      senha,
      papel: 'ADMINISTRADOR',
    },
  ])('retorna 400 para entrada inválida no caso %#', async (body) => {
    const issueSpy = vi.spyOn(accessTokenService, 'execute');

    const response = await request(app!.getHttpServer())
      .post('/api/auth/login')
      .send(body)
      .expect(400);

    expect(response.body.message).toBe('Dados de login inválidos.');
    expect(response.body).not.toHaveProperty('accessToken');
    expect(issueSpy).not.toHaveBeenCalled();
  });

  it('retorna os dois papéis ativos do usuário', async () => {
    const usuario = await criarUsuario();

    await prisma!.perfilUsuario.create({
      data: {
        status: StatusPerfil.ATIVO,
        usuario: {
          connect: {
            idUsuario: usuario.idUsuario,
          },
        },
        tipoUsuario: {
          connect: {
            nomeTipo: PapelUsuario.PRESTADOR,
          },
        },
      },
    });

    const response = await request(app!.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: usuario.email,
        senha,
      })
      .expect(200);

    expect(
      [...(response.body as LoginResponse).usuario.papeis].sort(),
    ).toEqual(['CONTRATANTE', 'PRESTADOR']);
  });

  it('não retorna papéis de perfis inativos', async () => {
    const usuario = await criarUsuario();

    await prisma!.perfilUsuario.create({
      data: {
        status: StatusPerfil.INATIVO,
        usuario: {
          connect: {
            idUsuario: usuario.idUsuario,
          },
        },
        tipoUsuario: {
          connect: {
            nomeTipo: PapelUsuario.PRESTADOR,
          },
        },
      },
    });

    const response = await request(app!.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: usuario.email,
        senha,
      })
      .expect(200);

    expect(response.body.usuario.papeis).toEqual([
      'CONTRATANTE',
    ]);
  });

  it('retorna 500 genérico quando a emissão do token falha', async () => {
    const usuario = await criarUsuario();

    vi.spyOn(accessTokenService, 'execute').mockRejectedValueOnce(
      new Error('Detalhe interno que não pode aparecer na resposta.'),
    );

    const response = await request(app!.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: usuario.email,
        senha,
      })
      .expect(500);

    expect(response.body).toEqual({
      statusCode: 500,
      message: 'Erro interno do servidor.',
      error: 'Internal Server Error',
    });
  });
});