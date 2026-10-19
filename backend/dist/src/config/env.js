"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnv = validateEnv;
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z
        .enum(['development', 'test', 'production'])
        .default('development'),
    PORT: zod_1.z.coerce.number().int().min(1).max(65535).default(3000),
    SWAGGER_ENABLED: zod_1.z
        .enum(['true', 'false'])
        .default('false')
        .transform((value) => value === 'true'),
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