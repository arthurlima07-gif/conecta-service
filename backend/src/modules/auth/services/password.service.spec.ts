import { beforeAll, describe, expect, it } from 'vitest';

import { PasswordService } from './password.service';

describe('PasswordService', () => {
  const service = new PasswordService();
  const senha = 'Minha senha de teste segura!';
  let senhaHash: string;

  beforeAll(async () => {
    senhaHash = await service.hash(senha);
  });

  it('gera um hash Argon2id diferente da senha original', () => {
    expect(senhaHash).toMatch(/^\$argon2id\$/);
    expect(senhaHash).not.toBe(senha);
    expect(senhaHash.length).toBeLessThanOrEqual(255);
  });

  it('confirma a senha correta', async () => {
    await expect(service.verify(senhaHash, senha)).resolves.toBe(true);
  });

  it('rejeita uma senha diferente', async () => {
    await expect(
      service.verify(senhaHash, 'Outra senha de teste segura!'),
    ).resolves.toBe(false);
  });

  it('gera hashes diferentes para a mesma senha', async () => {
    const outroHash = await service.hash(senha);

    expect(outroHash).not.toBe(senhaHash);

    await expect(service.verify(outroHash, senha)).resolves.toBe(true);
  });

  it('preserva espaços no início e no final da senha', async () => {
    const senhaComEspacos = '  Minha senha com espaços  ';
    const hash = await service.hash(senhaComEspacos);

    await expect(
      service.verify(hash, senhaComEspacos),
    ).resolves.toBe(true);

    await expect(
      service.verify(hash, senhaComEspacos.trim()),
    ).resolves.toBe(false);
  });

  it('suporta senha com acentos e caracteres Unicode', async () => {
    const senhaUnicode = 'Minha proteção é forte 🔐!';
    const hash = await service.hash(senhaUnicode);

    await expect(
      service.verify(hash, senhaUnicode),
    ).resolves.toBe(true);

    await expect(
      service.verify(hash, 'Minha protecao e forte 🔐!'),
    ).resolves.toBe(false);
  });

  it('sinaliza erro quando o hash está malformado', async () => {
    await expect(
      service.verify('hash-invalido', senha),
    ).rejects.toThrow();
  });
});