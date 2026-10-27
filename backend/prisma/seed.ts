import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';
import { PapelUsuario } from '../src/generated/prisma/enums';

async function main(): Promise<void> {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL não configurada.');
  }

  const adapter = new PrismaPg({
    connectionString,
    connectionTimeoutMillis: 5000,
    max: 1,
  });

  const prisma = new PrismaClient({ adapter });

  try {
    const result = await prisma.tipoUsuario.createMany({
      data: [
        { nomeTipo: PapelUsuario.CONTRATANTE },
        { nomeTipo: PapelUsuario.PRESTADOR },
        { nomeTipo: PapelUsuario.ADMINISTRADOR },
      ],
      skipDuplicates: true,
    });

    console.log(
      `Seed concluído: ${result.count} tipo(s) de usuário criado(s).`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(() => {
  console.error(
    'Não foi possível concluir o seed. Verifique DATABASE_URL, o PostgreSQL e as migrations.',
  );

  process.exitCode = 1;
});