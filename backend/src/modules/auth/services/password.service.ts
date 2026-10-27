import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class PasswordService {
  async hash(senha: string): Promise<string> {
    return argon2.hash(senha, {
      type: argon2.argon2id,
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1,
      hashLength: 32,
    });
  }

  async verify(senhaHash: string, senha: string): Promise<boolean> {
    return argon2.verify(senhaHash, senha);
  }
}