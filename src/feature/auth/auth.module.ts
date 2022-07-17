import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { LocalStrategy } from './stratgy/local.strategy';
import { Argon2Module } from '../../utility/argon2/argon2.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './stratgy/jwt.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    Argon2Module,
    JwtModule.registerAsync({
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
export class AuthModule { }
