import { describe, expect, it } from 'vitest';
import { validateEnv } from './env';

const databaseUrl =
  'postgresql://teste:senha-ficticia@127.0.0.1:5433/conecta_test';

const jwtSecret = 'a'.repeat(64);

const validInput = {
  DATABASE_URL: databaseUrl,
  JWT_SECRET: jwtSecret,
};

describe('Validação das variáveis de ambiente', () => {
  it('converte a porta e a configuração do Swagger', () => {
    const env = validateEnv({
      ...validInput,
      PORT: '3001',
      SWAGGER_ENABLED: 'false',
    });

    expect(env.PORT).toBe(3001);
    expect(env.SWAGGER_ENABLED).toBe(false);
    expect(env.DATABASE_URL).toBe(databaseUrl);
  });

  it('aplica os padrões quando as variáveis opcionais estão ausentes', () => {
    const env = validateEnv(validInput);

    expect(env).toEqual({
      NODE_ENV: 'development',
      PORT: 3000,
      SWAGGER_ENABLED: false,
      DATABASE_URL: databaseUrl,
      CORS_ORIGINS: [],
      JWT_SECRET: jwtSecret,
      JWT_EXPIRES_IN_SECONDS: 900,
    });
  });

  it('habilita o Swagger quando o valor é true', () => {
    const env = validateEnv({
      ...validInput,
      SWAGGER_ENABLED: 'true',
    });

    expect(env.SWAGGER_ENABLED).toBe(true);
  });

  it.each([
    ['PORT', 'abc'],
    ['PORT', '0'],
    ['PORT', '65536'],
    ['NODE_ENV', 'invalido'],
    ['SWAGGER_ENABLED', 'sim'],
  ])('rejeita %s com valor %s', (field, value) => {
    expect(() =>
      validateEnv({
        ...validInput,
        [field]: value,
      }),
    ).toThrow(`Configuração inválida nas variáveis: ${field}`);
  });

  it('rejeita a ausência de DATABASE_URL', () => {
    expect(() =>
      validateEnv({
        JWT_SECRET: jwtSecret,
      }),
    ).toThrow('Configuração inválida nas variáveis: DATABASE_URL');
  });

  it.each([
    '',
    'nao-e-uma-url',
    'https://example.com/banco',
    'postgresql://localhost:5433/banco',
    'postgresql://teste:senha@localhost:5433/',
  ])('rejeita DATABASE_URL inválida: %s', (value) => {
    expect(() =>
      validateEnv({
        ...validInput,
        DATABASE_URL: value,
      }),
    ).toThrow('Configuração inválida nas variáveis: DATABASE_URL');
  });

  it('aceita o protocolo postgres', () => {
    const url = 'postgres://teste:senha@localhost:5433/banco';

    expect(
      validateEnv({
        ...validInput,
        DATABASE_URL: url,
      }).DATABASE_URL,
    ).toBe(url);
  });

  it('não inclui credenciais na mensagem de erro', () => {
    const validate = () =>
      validateEnv({
        ...validInput,
        DATABASE_URL:
          'https://teste:senha-super-secreta@example.com/banco',
      });

    expect(validate).toThrow(
      'Configuração inválida nas variáveis: DATABASE_URL',
    );
    expect(validate).not.toThrow('senha-super-secreta');
  });

  it('rejeita a ausência de JWT_SECRET', () => {
    expect(() =>
      validateEnv({
        DATABASE_URL: databaseUrl,
      }),
    ).toThrow('Configuração inválida nas variáveis: JWT_SECRET');
  });

  it.each([
    '',
    'a'.repeat(63),
    'a'.repeat(65),
    'g'.repeat(64),
    ` ${'a'.repeat(64)}`,
  ])('rejeita JWT_SECRET inválido no caso %#', (value) => {
    expect(() =>
      validateEnv({
        ...validInput,
        JWT_SECRET: value,
      }),
    ).toThrow('Configuração inválida nas variáveis: JWT_SECRET');
  });

  it('aceita segredo hexadecimal com letras maiúsculas', () => {
    const secret = 'AB12'.repeat(16);

    expect(
      validateEnv({
        ...validInput,
        JWT_SECRET: secret,
      }).JWT_SECRET,
    ).toBe(secret);
  });

  it('não expõe o segredo inválido na mensagem de erro', () => {
    const secret = 'segredo-privado-invalido';

    const validate = () =>
      validateEnv({
        ...validInput,
        JWT_SECRET: secret,
      });

    expect(validate).toThrow(
      'Configuração inválida nas variáveis: JWT_SECRET',
    );
    expect(validate).not.toThrow(secret);
  });

  it('converte a expiração do JWT para número', () => {
    const env = validateEnv({
      ...validInput,
      JWT_EXPIRES_IN_SECONDS: '600',
    });

    expect(env.JWT_EXPIRES_IN_SECONDS).toBe(600);
  });

  it.each(['', 'abc', '0', '-1', '1.5', '901'])(
    'rejeita expiração inválida: %s',
    (value) => {
      expect(() =>
        validateEnv({
          ...validInput,
          JWT_EXPIRES_IN_SECONDS: value,
        }),
      ).toThrow(
        'Configuração inválida nas variáveis: JWT_EXPIRES_IN_SECONDS',
      );
    },
  );
});