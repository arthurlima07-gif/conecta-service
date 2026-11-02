import { z } from 'zod';

export const loginSchema = z
  .object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, 'Informe o email.')
      .max(150, 'O email deve ter no máximo 150 caracteres.')
      .email('Informe um email válido.'),

    senha: z
      .string()
      .min(1, 'Informe a senha.')
      .max(128, 'A senha deve ter no máximo 128 caracteres.'),
  })
  .strict();

export type LoginInput = z.infer<typeof loginSchema>;