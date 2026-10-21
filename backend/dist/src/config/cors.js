"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOriginsSchema = void 0;
exports.createCorsOptions = createCorsOptions;
const zod_1 = require("zod");
const originSchema = zod_1.z.string().refine((value) => {
    try {
        const url = new URL(value);
        return (['http:', 'https:'].includes(url.protocol) &&
            url.origin === value);
    }
    catch {
        return false;
    }
}, 'Informe uma origem HTTP ou HTTPS, sem caminho ou barra final.');
exports.corsOriginsSchema = zod_1.z
    .string()
    .default('')
    .transform((value) => value.trim() === ''
    ? []
    : value.split(',').map((origin) => origin.trim()))
    .pipe(zod_1.z.array(originSchema));
function createCorsOptions(origins) {
    return {
        origin: origins.length > 0 ? origins : false,
        credentials: false,
    };
}
//# sourceMappingURL=cors.js.map