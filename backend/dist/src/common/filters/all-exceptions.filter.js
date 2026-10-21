"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AllExceptionsFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
let AllExceptionsFilter = AllExceptionsFilter_1 = class AllExceptionsFilter {
    adapterHost;
    logger = new common_1.Logger(AllExceptionsFilter_1.name);
    constructor(adapterHost) {
        this.adapterHost = adapterHost;
    }
    catch(exception, host) {
        const { httpAdapter } = this.adapterHost;
        const response = host.switchToHttp().getResponse();
        let status;
        let body;
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const originalBody = exception.getResponse();
            body =
                typeof originalBody === 'string'
                    ? {
                        statusCode: status,
                        message: originalBody,
                    }
                    : originalBody;
        }
        else {
            status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            body = {
                statusCode: status,
                message: 'Erro interno do servidor.',
                error: 'Internal Server Error',
            };
            this.logger.error('Falha inesperada durante uma requisição HTTP.');
        }
        if (httpAdapter.isHeadersSent(response)) {
            httpAdapter.end(response);
            return;
        }
        httpAdapter.reply(response, body, status);
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = AllExceptionsFilter_1 = __decorate([
    (0, common_1.Catch)(),
    __metadata("design:paramtypes", [core_1.HttpAdapterHost])
], AllExceptionsFilter);
//# sourceMappingURL=all-exceptions.filter.js.map