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
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';

import { RegisterService } from './services/register.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly registerService: RegisterService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @Header('Cache-Control', 'no-store')
  @ApiOperation({
    summary: 'Cadastra um usuário e seu perfil inicial',
    description:
      'Endpoint público, sem autenticação ou parâmetros de URL. ' +
      'Aceita somente CONTRATANTE ou PRESTADOR. ' +
      'Cria a conta e o perfil juntos. Não realiza login nem emite token.',
  })
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      additionalProperties: false,
      required: [
        'nome',
        'email',
        'senha',
        'confirmacaoSenha',
        'papel',
      ],
      properties: {
        nome: {
          type: 'string',
          minLength: 1,
          maxLength: 150,
          description:
            'Nome obrigatório. Espaços nas extremidades são removidos.',
          example: 'Pessoa de Teste',
        },
        email: {
          type: 'string',
          format: 'email',
          maxLength: 150,
          description:
            'Email normalizado para minúsculas e sem espaços externos.',
          example: 'cadastro@example.com',
        },
        senha: {
          type: 'string',
          format: 'password',
          writeOnly: true,
          minLength: 15,
          maxLength: 128,
          description: 'O conteúdo da senha é preservado exatamente.',
        },
        confirmacaoSenha: {
          type: 'string',
          format: 'password',
          writeOnly: true,
          minLength: 1,
          maxLength: 128,
          description: 'Deve ser exatamente igual à senha.',
        },
        papel: {
          type: 'string',
          enum: ['CONTRATANTE', 'PRESTADOR'],
          example: 'CONTRATANTE',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Usuário e perfil criados. Não retorna senha ou hash.',
    schema: {
      type: 'object',
      required: [
        'idUsuario',
        'nome',
        'email',
        'statusConta',
        'dataCadastro',
        'perfis',
      ],
      properties: {
        idUsuario: { type: 'integer', example: 1 },
        nome: { type: 'string', example: 'Pessoa de Teste' },
        email: {
          type: 'string',
          format: 'email',
          example: 'cadastro@example.com',
        },
        statusConta: {
          type: 'string',
          enum: ['ATIVA'],
        },
        dataCadastro: {
          type: 'string',
          format: 'date-time',
        },
        perfis: {
          type: 'array',
          minItems: 1,
          maxItems: 1,
          items: {
            type: 'object',
            required: ['idPerfilUsuario', 'status', 'tipoUsuario'],
            properties: {
              idPerfilUsuario: { type: 'integer', example: 1 },
              status: { type: 'string', enum: ['ATIVO'] },
              tipoUsuario: {
                type: 'object',
                required: ['nomeTipo'],
                properties: {
                  nomeTipo: {
                    type: 'string',
                    enum: ['CONTRATANTE', 'PRESTADOR'],
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description:
      'Campos ausentes ou inválidos, senhas diferentes, campos extras ' +
      'ou tentativa de cadastro como administrador.',
  })
  @ApiConflictResponse({
    description: 'Email já cadastrado ou conflito de unicidade.',
  })
  @ApiServiceUnavailableResponse({
    description: 'Tipo de usuário necessário ao cadastro indisponível.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Falha inesperada. Retorna mensagem genérica.',
  })
  register(@Body() body: unknown) {
    return this.registerService.execute(body);
  }
}