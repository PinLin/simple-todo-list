import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { LocalStrategy } from './stratgies/local.strategy';
import { Argon2Module } from '../../utils/argon2/argon2.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './stratgies/jwt.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    Argon2Module,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
      }),
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
