import {
  BadRequestException,
  ConflictException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';

import { PrismaService } from '../../../database/prisma.service';
import { Prisma } from '../../../generated/prisma/client';
import {
  StatusConta,
  StatusPerfil,
} from '../../../generated/prisma/enums';
import { registerSchema } from '../schemas/register.schema';
import { PasswordService } from './password.service';

@Injectable()
export class RegisterService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
  ) {}

  async execute(input: unknown) {
    const validation = registerSchema.safeParse(input);

    if (!validation.success) {
      throw new BadRequestException({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Dados de cadastro inválidos.',
        errors: validation.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    const dados = validation.data;

    const usuarioExistente = await this.prisma.usuario.findFirst({
      where: {
        email: {
          equals: dados.email,
          mode: 'insensitive',
        },
      },
      select: {
        idUsuario: true,
      },
    });

    if (usuarioExistente) {
      throw new ConflictException('Email já cadastrado.');
    }

    const tipoUsuario = await this.prisma.tipoUsuario.findUnique({
      where: {
        nomeTipo: dados.papel,
      },
    });

    if (!tipoUsuario) {
      throw new ServiceUnavailableException(
        'Cadastro temporariamente indisponível.',
      );
    }

    // O cálculo do hash acontece antes da transação do banco.
    const senhaHash = await this.passwordService.hash(dados.senha);

    try {
      return await this.prisma.usuario.create({
        data: {
          nome: dados.nome,
          email: dados.email,
          senhaHash,
          statusConta: StatusConta.ATIVA,
          perfis: {
            create: {
              status: StatusPerfil.ATIVO,
              tipoUsuario: {
                connect: {
                  idTipoUsuario: tipoUsuario.idTipoUsuario,
                },
              },
            },
          },
        },

        // Apenas estes campos podem sair deste serviço.
        select: {
          idUsuario: true,
          nome: true,
          email: true,
          statusConta: true,
          dataCadastro: true,
          perfis: {
            select: {
              idPerfilUsuario: true,
              status: true,
              tipoUsuario: {
                select: {
                  nomeTipo: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Protege também contra cadastros concorrentes.
        if (error.code === 'P2002') {
          throw new ConflictException(
            'Já existe um cadastro com esses dados.',
          );
        }

        // O tipo pode ter sido removido entre a consulta e a gravação.
        if (error.code === 'P2025' || error.code === 'P2003') {
          throw new ServiceUnavailableException(
            'Cadastro temporariamente indisponível.',
          );
        }
      }

      throw error;
    }
  }
}