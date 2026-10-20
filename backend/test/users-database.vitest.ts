import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import { Client } from 'pg';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest';

describe.sequential('Banco: usuários e perfis', () => {
  let client: Client;
  let idUsuario: number;
  let idContratante: number;
  let idPrestador: number;
  let email: string;

  beforeEach(async () => {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error('DATABASE_URL não definida para os testes.');
    }

    client = new Client({
      connectionString,
      connectionTimeoutMillis: 5000,
      query_timeout: 5000,
    });

    await client.connect();
    await client.query('BEGIN');

    email = `teste-${randomUUID()}@example.com`;

    const usuario = await client.query<{ idUsuario: number }>(
      `INSERT INTO "Usuario"
        ("nome", "email", "senhaHash", "statusConta")
       VALUES ($1, $2, $3, $4)
       RETURNING "idUsuario"`,
      [
        'Usuário de teste',
        email,
        'valor-ficticio-exclusivo-do-teste-de-banco',
        'ATIVA',
      ],
    );

    idUsuario = usuario.rows[0].idUsuario;

    // Reutiliza os tipos existentes ou cria dentro da transação.
    // Nada será confirmado por COMMIT.
    for (const papel of ['CONTRATANTE', 'PRESTADOR']) {
      await client.query(
        `INSERT INTO "TipoUsuario" ("nomeTipo")
         VALUES ($1)
         ON CONFLICT ("nomeTipo") DO NOTHING`,
        [papel],
      );
    }

    const tipos = await client.query<{
      idTipoUsuario: number;
      nomeTipo: string;
    }>(
      `SELECT "idTipoUsuario", "nomeTipo"
       FROM "TipoUsuario"
       WHERE "nomeTipo" IN ('CONTRATANTE', 'PRESTADOR')`,
    );

    idContratante = tipos.rows.find(
      (tipo) => tipo.nomeTipo === 'CONTRATANTE',
    )!.idTipoUsuario;

    idPrestador = tipos.rows.find(
      (tipo) => tipo.nomeTipo === 'PRESTADOR',
    )!.idTipoUsuario;
  });

  afterEach(async () => {
    if (client) {
      try {
        await client.query('ROLLBACK');
      } finally {
        await client.end();
      }
    }
  });

  function vincular(usuarioId: number, tipoId: number) {
    return client.query(
      `INSERT INTO "PerfilUsuario"
        ("status", "idUsuario", "idTipoUsuario")
       VALUES ($1, $2, $3)`,
      ['ATIVO', usuarioId, tipoId],
    );
  }

  it('permite dois papéis diferentes para o mesmo usuário', async () => {
    await vincular(idUsuario, idContratante);
    await vincular(idUsuario, idPrestador);

    const resultado = await client.query<{ nomeTipo: string }>(
      `SELECT t."nomeTipo"
       FROM "PerfilUsuario" p
       JOIN "TipoUsuario" t
         ON t."idTipoUsuario" = p."idTipoUsuario"
       WHERE p."idUsuario" = $1`,
      [idUsuario],
    );

    expect(
      resultado.rows.map((linha) => linha.nomeTipo).sort(),
    ).toEqual(['CONTRATANTE', 'PRESTADOR']);
  });

  it('rejeita email duplicado', async () => {
    await expect(
      client.query(
        `INSERT INTO "Usuario"
          ("nome", "email", "senhaHash", "statusConta")
         VALUES ($1, $2, $3, $4)`,
        ['Outro usuário', email, 'valor-ficticio', 'ATIVA'],
      ),
    ).rejects.toMatchObject({
      code: '23505',
      constraint: 'Usuario_email_key',
    });
  });

  it('rejeita o mesmo papel duas vezes para o usuário', async () => {
    await vincular(idUsuario, idContratante);

    await expect(
      vincular(idUsuario, idContratante),
    ).rejects.toMatchObject({
      code: '23505',
      constraint: 'PerfilUsuario_idUsuario_idTipoUsuario_key',
    });
  });

  it('rejeita vínculo com usuário inexistente', async () => {
    // Remove somente o usuário criado por este teste.
    await client.query(
      `DELETE FROM "Usuario" WHERE "idUsuario" = $1`,
      [idUsuario],
    );

    await expect(
      vincular(idUsuario, idContratante),
    ).rejects.toMatchObject({
      code: '23503',
      constraint: 'PerfilUsuario_idUsuario_fkey',
    });
  });

  it('rejeita usuário sem nome', async () => {
    await expect(
      client.query(
        `INSERT INTO "Usuario"
          ("email", "senhaHash", "statusConta")
         VALUES ($1, $2, $3)`,
        [`sem-nome-${randomUUID()}@example.com`, 'valor-ficticio', 'ATIVA'],
      ),
    ).rejects.toMatchObject({
      code: '23502',
      column: 'nome',
    });
  });

  it('impede excluir usuário com perfil vinculado', async () => {
    await vincular(idUsuario, idContratante);

    await expect(
      client.query(
        `DELETE FROM "Usuario" WHERE "idUsuario" = $1`,
        [idUsuario],
      ),
    ).rejects.toMatchObject({
      code: '23503',
      constraint: 'PerfilUsuario_idUsuario_fkey',
    });
  });
});