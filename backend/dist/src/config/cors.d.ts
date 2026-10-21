import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { z } from 'zod';
export declare const corsOriginsSchema: z.ZodPipe<z.ZodPipe<z.ZodDefault<z.ZodString>, z.ZodTransform<string[], string>>, z.ZodArray<z.ZodString>>;
export declare function createCorsOptions(origins: string[]): CorsOptions;
