import { z } from 'zod';

export const registerSchema = z
  .object({
    nome: z
      .string()
      .trim()
      .min(1, 'Informe o nome.')
      .max(150, 'O nome deve ter no máximo 150 caracteres.'),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, 'Informe o email.')
      .max(150, 'O email deve ter no máximo 150 caracteres.')
      .email('Informe um email válido.'),

    senha: z
      .string()
      .min(15, 'A senha deve ter pelo menos 15 caracteres.')
      .max(128, 'A senha deve ter no máximo 128 caracteres.'),

    confirmacaoSenha: z
      .string()
      .min(1, 'Confirme a senha.')
      .max(128, 'A confirmação deve ter no máximo 128 caracteres.'),

    papel: z.enum(['CONTRATANTE', 'PRESTADOR']),
  })
  .strict()
  .refine((dados) => dados.senha === dados.confirmacaoSenha, {
    message: 'As senhas não coincidem.',
    path: ['confirmacaoSenha'],
  });

export type RegisterInput = z.infer<typeof registerSchema>;