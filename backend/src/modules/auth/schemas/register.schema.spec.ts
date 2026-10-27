import { describe, expect, it } from 'vitest';

import { registerSchema } from './register.schema';

function cadastroValido() {
  return {
    nome: 'Arthur Lima',
    email: 'arthur@example.com',
    senha: 'Uma senha de teste longa!',
    confirmacaoSenha: 'Uma senha de teste longa!',
    papel: 'CONTRATANTE',
  };
}

describe('Validação do cadastro', () => {
  it.each(['CONTRATANTE', 'PRESTADOR'])(
    'aceita cadastro como %s',
    (papel) => {
      const resultado = registerSchema.safeParse({
        ...cadastroValido(),
        papel,
      });

      expect(resultado.success).toBe(true);
    },
  );

  it('normaliza nome e email', () => {
    const resultado = registerSchema.parse({
      ...cadastroValido(),
      nome: '  Arthur Lima  ',
      email: '  ARTHUR@EXAMPLE.COM  ',
    });

    expect(resultado.nome).toBe('Arthur Lima');
    expect(resultado.email).toBe('arthur@example.com');
  });

  it('preserva exatamente o conteúdo da senha', () => {
    const senha = '  Minha senha com espaços  ';

    const resultado = registerSchema.parse({
      ...cadastroValido(),
      senha,
      confirmacaoSenha: senha,
    });

    expect(resultado.senha).toBe(senha);
    expect(resultado.confirmacaoSenha).toBe(senha);
  });

  it('associa a divergência de senhas ao campo de confirmação', () => {
    const resultado = registerSchema.safeParse({
      ...cadastroValido(),
      confirmacaoSenha: 'Outra senha de teste longa!',
    });

    expect(resultado.success).toBe(false);

    if (resultado.success) {
      throw new Error('O cadastro deveria ter sido rejeitado.');
    }

    expect(resultado.error.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: ['confirmacaoSenha'],
          message: 'As senhas não coincidem.',
        }),
      ]),
    );
  });

  it.each([
    ['nome', ''],
    ['nome', '   '],
    ['nome', 'a'.repeat(151)],
    ['email', ''],
    ['email', 'email-invalido'],
    ['email', `${'a'.repeat(140)}@example.com`],
    ['senha', 'a'.repeat(14)],
    ['senha', 'a'.repeat(129)],
    ['confirmacaoSenha', ''],
    ['confirmacaoSenha', 'a'.repeat(129)],
    ['papel', 'ADMINISTRADOR'],
    ['papel', 'OUTRO'],
    ['papel', ''],
  ])('rejeita %s inválido: %s', (campo, valor) => {
    const resultado = registerSchema.safeParse({
      ...cadastroValido(),
      [campo]: valor,
    });

    expect(resultado.success).toBe(false);
  });

  it.each([15, 128])(
    'aceita senha com %i caracteres',
    (tamanho) => {
      const senha = 'a'.repeat(tamanho);

      const resultado = registerSchema.safeParse({
        ...cadastroValido(),
        senha,
        confirmacaoSenha: senha,
      });

      expect(resultado.success).toBe(true);
    },
  );

  it.each([
    'nome',
    'email',
    'senha',
    'confirmacaoSenha',
    'papel',
  ])('rejeita ausência de %s', (campo) => {
    const dados: Record<string, unknown> = cadastroValido();
    delete dados[campo];

    expect(registerSchema.safeParse(dados).success).toBe(false);
  });

  it.each([
    ['idUsuario', 1],
    ['statusConta', 'ATIVA'],
    ['perfis', [{ nomeTipo: 'ADMINISTRADOR' }]],
  ])('rejeita o campo não permitido %s', (campo, valor) => {
    const resultado = registerSchema.safeParse({
      ...cadastroValido(),
      [campo]: valor,
    });

    expect(resultado.success).toBe(false);
  });

  it('rejeita valores com tipos incorretos', () => {
    const resultado = registerSchema.safeParse({
      nome: 123,
      email: true,
      senha: [],
      confirmacaoSenha: {},
      papel: null,
    });

    expect(resultado.success).toBe(false);
  });
});