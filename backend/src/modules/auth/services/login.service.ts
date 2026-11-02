import { Injectable } from '@nestjs/common';

import { AccessTokenService } from './access-token.service';
import { ValidateCredentialsService } from './validate-credentials.service';

@Injectable()
export class LoginService {
  constructor(
    private readonly validateCredentialsService: ValidateCredentialsService,
    private readonly accessTokenService: AccessTokenService,
  ) {}

  async execute(input: unknown) {
    const usuario = await this.validateCredentialsService.execute(input);

    const token = await this.accessTokenService.execute(
      usuario.idUsuario,
    );

    return {
      ...token,
      usuario,
    };
  }
}