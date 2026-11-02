import { randomBytes } from 'node:crypto';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { OnModuleInit } from '@nestjs/common';

import { PrismaService } from '../../../database/prisma.service';
import {
  StatusConta,
  StatusPerfil,
} from '../../../generated/prisma/enums';
import type { PapelUsuario } from '../../../generated/prisma/enums';
import { loginSchema } from '../schemas/login.schema';
import { PasswordService } from './password.service';

export interface AuthenticatedUser {
  idUsuario: number;
  nome: string;
  email: string;
  papeis: PapelUsuario[];
}

@Injectable()
export class ValidateCredentialsService implements OnModuleInit {
  private comparisonHash!: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
  ) {}

  async onModuleInit(): Promise<void> {
    // Hash auxiliar gerado uma vez por instância.
    // Não corresponde a uma conta e não é salvo no banco.
    this.comparisonHash = await this.passwordService.hash(
      randomBytes(32).toString('hex'),
    );
  }

  async execute(input: unknown): Promise<AuthenticatedUser> {
    const validation = loginSchema.safeParse(input);

    if (!validation.success) {
      throw new BadRequestException({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Dados de login inválidos.',
        errors: validation.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    const dados = validation.data;

    const usuario = await this.prisma.usuario.findUnique({
      where: {
        email: dados.email,
      },
      select: {
        idUsuario: true,
        nome: true,
        email: true,
        senhaHash: true,
        statusConta: true,
        perfis: {
          where: {
            status: StatusPerfil.ATIVO,
          },
          select: {
            tipoUsuario: {
              select: {
                nomeTipo: true,
              },
            },
          },
        },
      },
    });

    // Também executa Argon2 quando o email não existe.
    // Evita uma saída imediata que diferenciaria esses casos.
    const senhaCorreta = await this.passwordService.verify(
      usuario?.senhaHash ?? this.comparisonHash,
      dados.senha,
    );

    if (
      !usuario ||
      !senhaCorreta ||
      usuario.statusConta !== StatusConta.ATIVA ||
      usuario.perfis.length === 0
    ) {
      throw new UnauthorizedException('Email ou senha inválidos.');
    }

    return {
      idUsuario: usuario.idUsuario,
      nome: usuario.nome,
      email: usuario.email,
      papeis: usuario.perfis.map(
        (perfil) => perfil.tipoUsuario.nomeTipo,
      ),
    };
  }
}