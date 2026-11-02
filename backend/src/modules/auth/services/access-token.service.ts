import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

export interface AccessTokenResult {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
}

@Injectable()
export class AccessTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(idUsuario: number): Promise<AccessTokenResult> {
    if (!Number.isSafeInteger(idUsuario) || idUsuario <= 0) {
      throw new Error(
        'Não foi possível emitir o token: identificador inválido.',
      );
    }

    const expiresIn = this.configService.getOrThrow<number>(
      'JWT_EXPIRES_IN_SECONDS',
    );

    const accessToken = await this.jwtService.signAsync(
      {
        sub: String(idUsuario),
      },
      {
        algorithm: 'HS256',
        expiresIn,
      },
    );

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn,
    };
  }
}