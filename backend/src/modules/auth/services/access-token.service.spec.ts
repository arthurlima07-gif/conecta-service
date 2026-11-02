import 'reflect-metadata';

import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AccessTokenService } from './access-token.service';

interface TokenPayload {
  sub: string;
  iat: number;
  exp: number;
}

describe('AccessTokenService', () => {
  const secret = Buffer.from('a'.repeat(64), 'hex');
  const expiresIn = 900;

  let jwtService: JwtService;
  let service: AccessTokenService;

  beforeEach(() => {
    jwtService = new JwtService({
      secret,
      signOptions: {
        algorithm: 'HS256',
      },
      verifyOptions: {
        algorithms: ['HS256'],
      },
    });

    const configService = new ConfigService({
      JWT_EXPIRES_IN_SECONDS: expiresIn,
    });

    service = new AccessTokenService(jwtService, configService);
  });

  it('emite um token assinado com o ID do usuário em sub', async () => {
    const result = await service.execute(123);

    expect(result).toEqual({
      accessToken: expect.any(String),
      tokenType: 'Bearer',
      expiresIn: 900,
    });

    const payload = await jwtService.verifyAsync<TokenPayload>(
      result.accessToken,
    );

    expect(payload.sub).toBe('123');
    expect(payload.exp - payload.iat).toBe(900);
  });

  it('inclui somente identificação e campos temporais no payload', async () => {
    const result = await service.execute(123);

    const payload = await jwtService.verifyAsync<TokenPayload>(
      result.accessToken,
    );

    expect(Object.keys(payload).sort()).toEqual([
      'exp',
      'iat',
      'sub',
    ]);
  });

  it('respeita a expiração configurada', async () => {
    const customService = new AccessTokenService(
      jwtService,
      new ConfigService({
        JWT_EXPIRES_IN_SECONDS: 60,
      }),
    );

    const result = await customService.execute(123);

    const payload = await jwtService.verifyAsync<TokenPayload>(
      result.accessToken,
    );

    expect(result.expiresIn).toBe(60);
    expect(payload.exp - payload.iat).toBe(60);
  });

  it('aceita o token antes da expiração e o rejeita ao expirar', async () => {
    const result = await service.execute(123);

    const payload = await jwtService.verifyAsync<TokenPayload>(
      result.accessToken,
    );

    await expect(
      jwtService.verifyAsync(result.accessToken, {
        clockTimestamp: payload.exp - 1,
      }),
    ).resolves.toMatchObject({
      sub: '123',
    });

    await expect(
      jwtService.verifyAsync(result.accessToken, {
        clockTimestamp: payload.exp,
      }),
    ).rejects.toMatchObject({
      name: 'TokenExpiredError',
    });
  });

  it('rejeita a verificação com outro segredo', async () => {
    const result = await service.execute(123);

    await expect(
      jwtService.verifyAsync(result.accessToken, {
        secret: Buffer.from('b'.repeat(64), 'hex'),
      }),
    ).rejects.toMatchObject({
      name: 'JsonWebTokenError',
    });
  });

  it('rejeita um token cujo payload foi adulterado', async () => {
    const result = await service.execute(123);

    const [header, , signature] = result.accessToken.split('.');

    const changedPayload = Buffer.from(
      JSON.stringify({
        sub: '999',
      }),
    ).toString('base64url');

    const changedToken = [
      header,
      changedPayload,
      signature,
    ].join('.');

    await expect(
      jwtService.verifyAsync(changedToken),
    ).rejects.toMatchObject({
      name: 'JsonWebTokenError',
    });
  });

  it('rejeita um token assinado com algoritmo diferente', async () => {
    const token = await jwtService.signAsync(
      {
        sub: '123',
      },
      {
        algorithm: 'HS384',
        expiresIn: 900,
      },
    );

    await expect(
      jwtService.verifyAsync(token),
    ).rejects.toMatchObject({
      name: 'JsonWebTokenError',
    });
  });

  it.each([0, -1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1])(
    'não assina token para identificador inválido: %s',
    async (idUsuario) => {
      const signSpy = vi.spyOn(jwtService, 'signAsync');

      await expect(
        service.execute(idUsuario),
      ).rejects.toThrow(
        'Não foi possível emitir o token: identificador inválido.',
      );

      expect(signSpy).not.toHaveBeenCalled();
    },
  );

  it('propaga falha de assinatura sem retornar um token', async () => {
    vi.spyOn(jwtService, 'signAsync').mockRejectedValueOnce(
      new Error('Falha de assinatura simulada.'),
    );

    await expect(service.execute(123)).rejects.toThrow(
      'Falha de assinatura simulada.',
    );
  });
});