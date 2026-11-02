import {
  Body,
  Controller,
  Header,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { LoginService } from './services/login.service';

@ApiTags('Auth')
@Controller('auth')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Header('Cache-Control', 'no-store')
  @ApiOperation({
    summary: 'Autentica o usuário e emite um token de acesso',
    description:
      'Endpoint público, sem autenticação prévia ou parâmetros de URL. ' +
      'Recebe email e senha. Exige conta ativa e pelo menos um perfil ativo. ' +
      'Retorna um JWT e os papéis ativos do usuário. ' +
      'Não retorna senha nem hash.',
  })
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      additionalProperties: false,
      required: ['email', 'senha'],
      properties: {
        email: {
          type: 'string',
          format: 'email',
          maxLength: 150,
          example: 'pessoa@example.com',
        },
        senha: {
          type: 'string',
          format: 'password',
          writeOnly: true,
          minLength: 1,
          maxLength: 128,
          example: 'Minha senha segura de teste!',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Credenciais verificadas e token emitido.',
    schema: {
      type: 'object',
      required: [
        'accessToken',
        'tokenType',
        'expiresIn',
        'usuario',
      ],
      properties: {
        accessToken: {
          type: 'string',
          description: 'JWT de acesso. Enviar como Bearer nas rotas protegidas.',
        },
        tokenType: {
          type: 'string',
          enum: ['Bearer'],
        },
        expiresIn: {
          type: 'integer',
          description: 'Tempo de validade do token, em segundos.',
          minimum: 1,
          maximum: 900,
          example: 900,
        },
        usuario: {
          type: 'object',
          required: ['idUsuario', 'nome', 'email', 'papeis'],
          properties: {
            idUsuario: {
              type: 'integer',
              example: 1,
            },
            nome: {
              type: 'string',
              example: 'Pessoa de Teste',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'pessoa@example.com',
            },
            papeis: {
              type: 'array',
              minItems: 1,
              uniqueItems: true,
              items: {
                type: 'string',
                enum: [
                  'CONTRATANTE',
                  'PRESTADOR',
                  'ADMINISTRADOR',
                ],
              },
              example: ['CONTRATANTE'],
            },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description:
      'Campos ausentes, inválidos ou adicionais. Nenhum token é emitido.',
  })
  @ApiUnauthorizedResponse({
    description:
      'Email ou senha inválidos. A mesma resposta é usada para conta ' +
      'inativa ou ausência de perfil ativo.',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'integer',
          example: 401,
        },
        message: {
          type: 'string',
          example: 'Email ou senha inválidos.',
        },
        error: {
          type: 'string',
          example: 'Unauthorized',
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description:
      'Falha interna inesperada. Retorna mensagem genérica, sem detalhes sensíveis.',
  })
  login(@Body() body: unknown) {
    return this.loginService.execute(body);
  }
}