"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.setGlobalPrefix('api');
    app.enableShutdownHooks();
    const swaggerEnabled = configService.getOrThrow('SWAGGER_ENABLED');
    if (swaggerEnabled) {
        const swaggerConfig = new swagger_1.DocumentBuilder()
            .setTitle('Conecta Service API')
            .setDescription('API de prestação e contratação de serviços.')
            .setVersion('0.1.0')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
        swagger_1.SwaggerModule.setup('docs', app, document);
    }
    const port = configService.getOrThrow('PORT');
    try {
        await app.listen(port);
    }
    catch {
        common_1.Logger.error('Não foi possível iniciar a API. Verifique o banco de dados e a porta configurada.', 'Bootstrap');
        process.exit(1);
    }
}
void bootstrap().catch(() => {
    common_1.Logger.error('Falha na inicialização da aplicação.', 'Bootstrap');
    process.exit(1);
});
//# sourceMappingURL=main.js.map