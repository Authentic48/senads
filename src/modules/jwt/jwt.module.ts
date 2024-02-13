import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from '../../libs/config/jwt.config';
import { InternalJWTService } from './jwt.service';

@Module({
  imports: [JwtModule.registerAsync(getJwtConfig())],
  providers: [InternalJWTService],
  exports: [InternalJWTService],
})
export class InternalJwtModule {}
