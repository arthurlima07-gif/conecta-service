import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { PrismaModule } from '../../database/prisma.module';
import { AuthController } from './auth.controller';
import { LoginController } from './login.controller';
import { AccessTokenService } from './services/access-token.service';
import { LoginService } from './services/login.service';
import { PasswordService } from './services/password.service';
import { RegisterService } from './services/register.service';
import { ValidateCredentialsService } from './services/validate-credentials.service';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: Buffer.from(
          configService.getOrThrow<string>('JWT_SECRET'),
          'hex',
        ),
        signOptions: {
          algorithm: 'HS256',
          expiresIn: configService.getOrThrow<number>(
            'JWT_EXPIRES_IN_SECONDS',
          ),
        },
        verifyOptions: {
          algorithms: ['HS256'],
        },
      }),
    }),
  ],
  controllers: [
    AuthController,
    LoginController,
  ],
  providers: [
    PasswordService,
    RegisterService,
    ValidateCredentialsService,
    AccessTokenService,
    LoginService,
  ],
})
export class AuthModule {}