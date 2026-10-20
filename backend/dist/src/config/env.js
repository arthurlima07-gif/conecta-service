"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnv = validateEnv;
const zod_1 = require("zod");
const databaseUrlSchema = zod_1.z.string().min(1).refine((value) => {
    try {
        const url = new URL(value);
        return (['postgresql:', 'postgres:'].includes(url.protocol) &&
            url.hostname.length > 0 &&
            url.username.length > 0 &&
            url.pathname.length > 1);
    }
    catch {
        return false;
    }
}, {
    message: 'Informe uma URL válida de conexão PostgreSQL.',
});
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z
        .enum(['development', 'test', 'production'])
        .default('development'),
    PORT: zod_1.z.coerce.number().int().min(1).max(65535).default(3000),
    SWAGGER_ENABLED: zod_1.z
        .enum(['true', 'false'])
        .default('false')
        .transform((value) => value === 'true'),
    DATABASE_URL: databaseUrlSchema,
});
function validateEnv(input) {
    const result = envSchema.safeParse(input);
    if (!result.success) {
        const fields = [
            ...new Set(result.error.issues.map((issue) => issue.path.join('.'))),
        ];
        throw new Error(`Configuração inválida nas variáveis: ${fields.join(', ')}`);
    }
    return result.data;
}
//# sourceMappingURL=env.js.map