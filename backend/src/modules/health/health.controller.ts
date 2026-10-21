import { Controller, Get, Header } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @Header('Cache-Control', 'no-store')
  @ApiOperation({
    summary: 'Verifica a disponibilidade da API e do PostgreSQL',
    description:
      'Endpoint público, sem autenticação, parâmetros ou body. ' +
      'Executa SELECT 1 no banco. Retorna 200 quando a consulta ' +
      'funciona e 503 quando ocorre uma falha.',
  })
  @ApiOkResponse({
    description: 'API e PostgreSQL disponíveis.',
    schema: {
      type: 'object',
      required: ['status', 'service', 'database'],
      properties: {
        status: { type: 'string', enum: ['ok'] },
        service: {
          type: 'string',
          enum: ['conecta-service-api'],
        },
        database: { type: 'string', enum: ['up'] },
      },
      example: {
        status: 'ok',
        service: 'conecta-service-api',
        database: 'up',
      },
    },
  })
  @ApiServiceUnavailableResponse({
    description: 'Não foi possível consultar o PostgreSQL.',
    schema: {
      type: 'object',
      required: ['status', 'service', 'database'],
      properties: {
        status: { type: 'string', enum: ['error'] },
        service: {
          type: 'string',
          enum: ['conecta-service-api'],
        },
        database: { type: 'string', enum: ['down'] },
      },
      example: {
        status: 'error',
        service: 'conecta-service-api',
        database: 'down',
      },
    },
  })
  check() {
    return this.healthService.check();
  }
}