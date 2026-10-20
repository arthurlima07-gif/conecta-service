import { describe, expect, it } from 'vitest';
import { validateEnv } from './env';

const databaseUrl =
  'postgresql://teste:senha-ficticia@127.0.0.1:5433/conecta_test';

describe('Validação das variáveis de ambiente', () => {
  it('converte a porta e a configuração do Swagger', () => {
    const env = validateEnv({
      PORT: '3001',
      SWAGGER_ENABLED: 'false',
      DATABASE_URL: databaseUrl,
    });

    expect(env.PORT).toBe(3001);
    expect(env.SWAGGER_ENABLED).toBe(false);
    expect(env.DATABASE_URL).toBe(databaseUrl);
  });

  it('aplica os padrões quando as variáveis opcionais estão ausentes', () => {
    const env = validateEnv({
      DATABASE_URL: databaseUrl,
    });

    expect(env).toEqual({
      NODE_ENV: 'development',
      PORT: 3000,
      SWAGGER_ENABLED: false,
      DATABASE_URL: databaseUrl,
    });
  });

  it('habilita o Swagger quando o valor é true', () => {
    const env = validateEnv({
      SWAGGER_ENABLED: 'true',
      DATABASE_URL: databaseUrl,
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
        DATABASE_URL: databaseUrl,
        [field]: value,
      }),
    ).toThrow(`Configuração inválida nas variáveis: ${field}`);
  });

  it('rejeita a ausência de DATABASE_URL', () => {
    expect(() => validateEnv({})).toThrow(
      'Configuração inválida nas variáveis: DATABASE_URL',
    );
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
        DATABASE_URL: value,
      }),
    ).toThrow('Configuração inválida nas variáveis: DATABASE_URL');
  });

  it('aceita o protocolo postgres', () => {
    const url = 'postgres://teste:senha@localhost:5433/banco';

    expect(
      validateEnv({
        DATABASE_URL: url,
      }).DATABASE_URL,
    ).toBe(url);
  });

  it('não inclui credenciais na mensagem de erro', () => {
    const validate = () =>
      validateEnv({
        DATABASE_URL:
          'https://teste:senha-super-secreta@example.com/banco',
      });

    expect(validate).toThrow(
      'Configuração inválida nas variáveis: DATABASE_URL',
    );
    expect(validate).not.toThrow('senha-super-secreta');
  });
});