import 'dotenv/config';

import { randomUUID } from 'node:crypto';
import {
  BadRequestException,
  UnauthorizedException,
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
import { ValidateCredentialsService } from '../src/modules/auth/services/validate-credentials.service';

describe('Verificação de credenciais', () => {
  let prisma: PrismaService;
  let passwordService: PasswordService;
  let registerService: RegisterService;
  let credentialsService: ValidateCredentialsService;

  const emailsCriados: string[] = [];

  async function criarUsuario(
    papel: 'CONTRATANTE' | 'PRESTADOR' = 'CONTRATANTE',
  ) {
    const email = `credenciais-${randomUUID()}@example.com`;
    const senha = 'Minha senha segura de teste!';

    emailsCriados.push(email);

    const usuario = await registerService.execute({
      nome: 'Pessoa de Teste',
      email,
      senha,
      confirmacaoSenha: senha,
      papel,
    });

    return {
      idUsuario: usuario.idUsuario,
      email,
      senha,
    };
  }

  async function adicionarPerfil(
    idUsuario: number,
    papel: PapelUsuario,
    status: StatusPerfil = StatusPerfil.ATIVO,
  ) {
    return prisma.perfilUsuario.create({
      data: {
        status,
        usuario: {
          connect: { idUsuario },
        },
        tipoUsuario: {
          connect: { nomeTipo: papel },
        },
      },
    });
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

    credentialsService = new ValidateCredentialsService(
      prisma,
      passwordService,
    );

    // Aqui instanciamos diretamente, então chamamos o hook.
    // Na aplicação, o Nest faz isso automaticamente.
    await credentialsService.onModuleInit();

    const quantidade = await prisma.tipoUsuario.count({
      where: {
        nomeTipo: {
          in: [PapelUsuario.CONTRATANTE, PapelUsuario.PRESTADOR],
        },
      },
    });

    if (quantidade !== 2) {
      throw new Error('Execute o seed antes dos testes de credenciais.');
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
    if (prisma) {
      await prisma.$disconnect();
    }
  });

  it.each(['CONTRATANTE', 'PRESTADOR'] as const)(
    'aceita credenciais válidas de %s sem retornar dados secretos',
    async (papel) => {
      const usuario = await criarUsuario(papel);

      const resultado = await credentialsService.execute({
        email: usuario.email,
        senha: usuario.senha,
      });

      expect(resultado).toEqual({
        idUsuario: usuario.idUsuario,
        nome: 'Pessoa de Teste',
        email: usuario.email,
        papeis: [papel],
      });
    },
  );

  it('aceita email com espaços externos e letras maiúsculas', async () => {
    const usuario = await criarUsuario();

    const resultado = await credentialsService.execute({
      email: `  ${usuario.email.toUpperCase()}  `,
      senha: usuario.senha,
    });

    expect(resultado.idUsuario).toBe(usuario.idUsuario);
  });

  it('rejeita senha incorreta', async () => {
    const usuario = await criarUsuario();

    await expect(
      credentialsService.execute({
        email: usuario.email,
        senha: 'Outra senha segura de teste!',
      }),
    ).rejects.toMatchObject({
      message: 'Email ou senha inválidos.',
      status: 401,
    });
  });

  it('rejeita email inexistente e ainda executa a verificação Argon2', async () => {
    const verifySpy = vi.spyOn(passwordService, 'verify');

    await expect(
      credentialsService.execute({
        email: `inexistente-${randomUUID()}@example.com`,
        senha: 'Minha senha segura de teste!',
      }),
    ).rejects.toMatchObject({
      message: 'Email ou senha inválidos.',
      status: 401,
    });

    expect(verifySpy).toHaveBeenCalledTimes(1);
  });

  it('rejeita conta inativa mesmo com senha correta', async () => {
    const usuario = await criarUsuario();

    await prisma.usuario.update({
      where: { idUsuario: usuario.idUsuario },
      data: { statusConta: StatusConta.INATIVA },
    });

    await expect(
      credentialsService.execute({
        email: usuario.email,
        senha: usuario.senha,
      }),
    ).rejects.toMatchObject({
      message: 'Email ou senha inválidos.',
      status: 401,
    });
  });

  it('rejeita usuário com todos os perfis inativos', async () => {
    const usuario = await criarUsuario();

    await prisma.perfilUsuario.updateMany({
      where: { idUsuario: usuario.idUsuario },
      data: { status: StatusPerfil.INATIVO },
    });

    await expect(
      credentialsService.execute({
        email: usuario.email,
        senha: usuario.senha,
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejeita usuário sem perfil', async () => {
    const usuario = await criarUsuario();

    await prisma.perfilUsuario.deleteMany({
      where: { idUsuario: usuario.idUsuario },
    });

    await expect(
      credentialsService.execute({
        email: usuario.email,
        senha: usuario.senha,
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('retorna todos os papéis ativos do usuário', async () => {
    const usuario = await criarUsuario();

    await adicionarPerfil(
      usuario.idUsuario,
      PapelUsuario.PRESTADOR,
    );

    const resultado = await credentialsService.execute({
      email: usuario.email,
      senha: usuario.senha,
    });

    expect(resultado.papeis).toHaveLength(2);
    expect(resultado.papeis).toEqual(
      expect.arrayContaining(['CONTRATANTE', 'PRESTADOR']),
    );
  });

  it('não retorna o papel de um perfil inativo', async () => {
    const usuario = await criarUsuario();

    await adicionarPerfil(
      usuario.idUsuario,
      PapelUsuario.PRESTADOR,
      StatusPerfil.INATIVO,
    );

    const resultado = await credentialsService.execute({
      email: usuario.email,
      senha: usuario.senha,
    });

    expect(resultado.papeis).toEqual(['CONTRATANTE']);
  });

  it('rejeita entrada inválida antes de consultar o banco', async () => {
    const querySpy = vi.spyOn(prisma.usuario, 'findUnique');

    await expect(
      credentialsService.execute({
        email: 'email-invalido',
        senha: '',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(querySpy).not.toHaveBeenCalled();
  });
});