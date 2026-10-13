import { Controller, Get } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({
    summary: 'Verifica se a API está respondendo',
    description:
      'Endpoint público, sem parâmetros ou corpo de requisição. ' +
      'Nesta etapa, verifica apenas a resposta da API, sem consultar o banco.',
  })
  @ApiOkResponse({
    description: 'A API está respondendo.',
    schema: {
      type: 'object',
      required: ['status', 'service'],
      properties: {
        status: {
          type: 'string',
          enum: ['ok'],
        },
        service: {
          type: 'string',
          enum: ['conecta-service-api'],
        },
      },
      example: {
        status: 'ok',
        service: 'conecta-service-api',
      },
    },
  })
  check() {
    return this.healthService.check();
  }
}