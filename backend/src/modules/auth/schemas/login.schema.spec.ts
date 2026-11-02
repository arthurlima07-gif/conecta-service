import { describe, expect, it } from 'vitest';

import { loginSchema } from './login.schema';

function loginValido() {
  return {
    email: 'cadastro@example.com',
    senha: 'Minha senha segura de teste!',
  };
}

describe('Validação do login', () => {
  it('aceita email e senha válidos', () => {
    const resultado = loginSchema.safeParse(loginValido());

    expect(resultado.success).toBe(true);
  });

  it('normaliza o email', () => {
    const resultado = loginSchema.parse({
      ...loginValido(),
      email: '  CADASTRO@EXAMPLE.COM  ',
    });

    expect(resultado.email).toBe('cadastro@example.com');
  });

  it('preserva exatamente a senha, incluindo espaços e acentos', () => {
    const senha = '  Minha proteção é forte 🔐!  ';

    const resultado = loginSchema.parse({
      ...loginValido(),
      senha,
    });

    expect(resultado.senha).toBe(senha);
  });

  it('não aplica ao login o tamanho mínimo exigido no cadastro', () => {
    const resultado = loginSchema.safeParse({
      ...loginValido(),
      senha: 'curta',
    });

    // Validar a entrada não significa autenticar o usuário.
    expect(resultado.success).toBe(true);
  });

  it.each([
    ['email', ''],
    ['email', 'email-invalido'],
    ['email', `${'a'.repeat(140)}@example.com`],
    ['senha', ''],
    ['senha', 'a'.repeat(129)],
    ['senha', null],
  ])('rejeita valor inválido no campo %s: %s', (campo, valor) => {
    const resultado = loginSchema.safeParse({
      ...loginValido(),
      [campo]: valor,
    });

    expect(resultado.success).toBe(false);
  });

  it.each(['email', 'senha'])(
    'rejeita ausência do campo %s',
    (campo) => {
      const dados: Record<string, unknown> = loginValido();
      delete dados[campo];

      expect(loginSchema.safeParse(dados).success).toBe(false);
    },
  );

  it.each([
    ['papel', 'ADMINISTRADOR'],
    ['idUsuario', 1],
  ])('rejeita o campo extra %s', (campo, valor) => {
    const resultado = loginSchema.safeParse({
      ...loginValido(),
      [campo]: valor,
    });

    expect(resultado.success).toBe(false);
  });
});