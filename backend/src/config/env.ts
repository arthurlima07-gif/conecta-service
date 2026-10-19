import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),

  PORT: z.coerce.number().int().min(1).max(65535).default(3000),

  SWAGGER_ENABLED: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
});

export function validateEnv(input: Record<string, unknown>) {
  const result = envSchema.safeParse(input);

  if (!result.success) {
    const fields = [
      ...new Set(
        result.error.issues.map((issue) => issue.path.join('.')),
      ),
    ];

    throw new Error(
      `Configuração inválida nas variáveis: ${fields.join(', ')}`,
    );
  }

  return result.data;
}