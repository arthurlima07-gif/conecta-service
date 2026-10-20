import 'reflect-metadata';
import 'dotenv/config';

import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';
import { PrismaModule } from '../src/database/prisma.module';
import { PrismaService } from '../src/database/prisma.service';

describe('Integração do Prisma com NestJS', () => {
  it('inicializa o módulo e consulta as tabelas da migration', async () => {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error('DATABASE_URL não definida para os testes.');
    }

    const moduleRef = await Test.createTestingModule({
      imports: [PrismaModule],
    })
      .overrideProvider(ConfigService)
      .useValue(
        new ConfigService({
          DATABASE_URL: connectionString,
        }),
      )
      .compile();

    const prisma = moduleRef.get(PrismaService);
    let inicializado = false;

    try {
      await moduleRef.init();
      inicializado = true;

      const resultado = await prisma.$queryRaw<
        Array<{ resultado: number }>
      >`SELECT 1::int AS resultado`;

      expect(resultado).toEqual([{ resultado: 1 }]);

      const quantidades = await Promise.all([
        prisma.usuario.count(),
        prisma.tipoUsuario.count(),
        prisma.perfilUsuario.count(),
      ]);

      for (const quantidade of quantidades) {
        expect(quantidade).toBeGreaterThanOrEqual(0);
      }
    } finally {
      if (inicializado) {
        await moduleRef.close();
      } else {
        await prisma.$disconnect();
      }
    }
  });

  it('rejeita a inicialização quando o banco está inacessível', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PrismaModule],
    })
      .overrideProvider(ConfigService)
      .useValue(
        new ConfigService({
          DATABASE_URL:
            'postgresql://teste:teste@127.0.0.1:1/banco_inexistente',
        }),
      )
      .compile();

    const prisma = moduleRef.get(PrismaService);

    try {
      await expect(moduleRef.init()).rejects.toThrow(
        'Não foi possível conectar ao PostgreSQL.',
      );
    } finally {
      // Evita que close() propague novamente a falha de inicialização.
      await prisma.$disconnect();
    }
  }, 15000);
});