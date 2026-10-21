import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { z } from 'zod';

const originSchema = z.string().refine((value) => {
  try {
    const url = new URL(value);

    return (
      ['http:', 'https:'].includes(url.protocol) &&
      url.origin === value
    );
  } catch {
    return false;
  }
}, 'Informe uma origem HTTP ou HTTPS, sem caminho ou barra final.');

export const corsOriginsSchema = z
  .string()
  .default('')
  .transform((value) =>
    value.trim() === ''
      ? []
      : value.split(',').map((origin) => origin.trim()),
  )
  .pipe(z.array(originSchema));

export function createCorsOptions(origins: string[]): CorsOptions {
  return {
    origin: origins.length > 0 ? origins : false,
    credentials: false,
  };
}