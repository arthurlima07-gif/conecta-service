import { describe, expect, it } from 'vitest';
import { validateEnv } from './env';

describe('Configuração de ambiente', () => {
  it('converte a porta e interpreta false corretamente', () => {
    const config = validateEnv({
      NODE_ENV: 'development',
      PORT: '3001',
      SWAGGER_ENABLED: 'false',
    });

    expect(config.PORT).toBe(3001);
    expect(config.SWAGGER_ENABLED).toBe(false);
  });

  it('utiliza os valores padrão quando não há configuração', () => {
    expect(validateEnv({})).toEqual({
      NODE_ENV: 'development',
      PORT: 3000,
      SWAGGER_ENABLED: false,
    });
  });

  it.each([
    { PORT: 'abc' },
    { PORT: '0' },
    { PORT: '65536' },
    { NODE_ENV: 'invalido' },
    { SWAGGER_ENABLED: 'sim' },
  ])('rejeita uma configuração inválida: %o', (input) => {
    expect(() => validateEnv(input)).toThrow('Configuração inválida');
  });
});