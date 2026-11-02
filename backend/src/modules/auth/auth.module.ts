import { Module } from '@nestjs/common';

import { PrismaModule } from '../../database/prisma.module';
import { AuthController } from './auth.controller';
import { PasswordService } from './services/password.service';
import { RegisterService } from './services/register.service';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [PasswordService, RegisterService],
})
export class AuthModule {}