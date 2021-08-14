import { UserModule } from './../user/user.module';
import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { CommonModule } from '../common/common.module';
import { AuthService } from './auth.service';

@Module({
  imports: [forwardRef(() => UserModule), CommonModule],
  exports: [AuthService],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
