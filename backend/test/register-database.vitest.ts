import 'dotenv/config';

import { randomUUID } from 'node:crypto';
import {
  BadRequestException,
  ConflictException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { PrismaService } from '../src/database/prisma.service';
import {
  PapelUsuario,
  StatusConta,
  StatusPerfil,
} from '../src/generated/prisma/enums';
import { PasswordService } from '../src/modules/auth/services/password.service';
import { RegisterService } from '../src/modules/auth/services/register.service';

describe('Cadastro: integração com PostgreSQL', () => {
  let prisma: PrismaService;
  let passwordService: PasswordService;
  let registerService: RegisterService;

  const emailsCriados: string[] = [];

  function novoCadastro(papel = 'CONTRATANTE') {
    const email = `cadastro-${randomUUID()}@example.com`;
    emailsCriados.push(email);

    return {
      nome: 'Pessoa de Teste',
      email,
      senha: 'Minha senha segura de teste!',
      confirmacaoSenha: 'Minha senha segura de teste!',
      papel,
    };
  }

  beforeAll(async () => {
    if (!process.env.DATABASE_URL) {
      throw new Error('Configure DATABASE_URL para executar os testes.');
    }

    prisma = new PrismaService(
      new ConfigService({
        DATABASE_URL: process.env.DATABASE_URL,
      }),
    );

    await prisma.onModuleInit();

    passwordService = new PasswordService();
    registerService = new RegisterService(prisma, passwordService);

    const quantidade = await prisma.tipoUsuario.count({
      where: {
        nomeTipo: {
          in: [PapelUsuario.CONTRATANTE, PapelUsuario.PRESTADOR],
        },
      },
    });

    if (quantidade !== 2) {
      throw new Error('Execute o seed antes dos testes de cadastro.');
    }
  });

  afterEach(async () => {
    vi.restoreAllMocks();

    if (!prisma || emailsCriados.length === 0) {
      return;
    }

    const emails = [...emailsCriados];

    await prisma.$transaction([
      prisma.perfilUsuario.deleteMany({
        where: {
          usuario: {
            email: {
              in: emails,
            },
          },
        },
      }),

      prisma.usuario.deleteMany({
        where: {
          email: {
            in: emails,
          },
        },
      }),
    ]);

    emailsCriados.length = 0;
  });

  afterAll(async () => {
    if (prisma) {
      await prisma.$disconnect();
    }
  });

  it.each(['CONTRATANTE', 'PRESTADOR'])(
    'cria usuário e perfil como %s, armazenando somente o hash',
    async (papel) => {
      const dados = novoCadastro(papel);

      const resposta = await registerService.execute(dados);

      expect(resposta.email).toBe(dados.email);
      expect(resposta.statusConta).toBe(StatusConta.ATIVA);
      expect(resposta.perfis).toHaveLength(1);
      expect(resposta.perfis[0].status).toBe(StatusPerfil.ATIVO);
      expect(resposta.perfis[0].tipoUsuario.nomeTipo).toBe(papel);

      expect(resposta).not.toHaveProperty('senha');
      expect(resposta).not.toHaveProperty('senhaHash');
      expect(resposta).not.toHaveProperty('confirmacaoSenha');

      const usuario = await prisma.usuario.findUniqueOrThrow({
        where: {
          idUsuario: resposta.idUsuario,
        },
      });

      expect(usuario.senhaHash).not.toBe(dados.senha);

      await expect(
        passwordService.verify(usuario.senhaHash, dados.senha),
      ).resolves.toBe(true);
    },
  );

  it('rejeita email duplicado mesmo com letras maiúsculas', async () => {
    const dados = novoCadastro();

    await registerService.execute(dados);

    await expect(
      registerService.execute({
        ...dados,
        email: `  ${dados.email.toUpperCase()}  `,
      }),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(
      await prisma.usuario.count({
        where: { email: dados.email },
      }),
    ).toBe(1);
  });

  it('permite somente um cadastro em tentativas concorrentes', async () => {
    const dados = novoCadastro();

    const resultados = await Promise.allSettled([
      registerService.execute(dados),
      registerService.execute(dados),
    ]);

    expect(
      resultados.filter((resultado) => resultado.status === 'fulfilled'),
    ).toHaveLength(1);

    const falha = resultados.find(
      (resultado) => resultado.status === 'rejected',
    );

    if (!falha || falha.status !== 'rejected') {
      throw new Error('Uma das tentativas deveria ter sido rejeitada.');
    }

    expect(falha.reason).toBeInstanceOf(ConflictException);

    expect(
      await prisma.usuario.count({
        where: { email: dados.email },
      }),
    ).toBe(1);

    expect(
      await prisma.perfilUsuario.count({
        where: { usuario: { email: dados.email } },
      }),
    ).toBe(1);
  });

  it.each([
    ['senha divergente', { confirmacaoSenha: 'Outra senha diferente!' }],
    ['papel administrativo', { papel: 'ADMINISTRADOR' }],
  ])('não grava cadastro com %s', async (_descricao, alteracao) => {
    const dados = novoCadastro();

    await expect(
      registerService.execute({
        ...dados,
        ...alteracao,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(
      await prisma.usuario.count({
        where: { email: dados.email },
      }),
    ).toBe(0);
  });

  it('não cria usuário quando o tipo não está disponível', async () => {
    const dados = novoCadastro();

    // Simula ausência do seed sem apagar tipos reais do banco.
    vi.spyOn(prisma.tipoUsuario, 'findUnique').mockResolvedValueOnce(null);

    await expect(
      registerService.execute(dados),
    ).rejects.toBeInstanceOf(ServiceUnavailableException);

    expect(
      await prisma.usuario.count({
        where: { email: dados.email },
      }),
    ).toBe(0);
  });

  it('não deixa usuário salvo quando o vínculo com o tipo falha', async () => {
    const dados = novoCadastro();

    const tipo = await prisma.tipoUsuario.findUniqueOrThrow({
      where: { nomeTipo: PapelUsuario.CONTRATANTE },
    });

    // Simula um tipo que deixou de existir antes da gravação.
    // A escrita aninhada continua sendo executada no PostgreSQL real.
    vi.spyOn(prisma.tipoUsuario, 'findUnique').mockResolvedValueOnce({
      ...tipo,
      idTipoUsuario: -1,
    });

    await expect(
      registerService.execute(dados),
    ).rejects.toBeInstanceOf(ServiceUnavailableException);

    expect(
      await prisma.usuario.count({
        where: { email: dados.email },
      }),
    ).toBe(0);
  });
});