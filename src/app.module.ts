import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Argon2Module } from './utility/argon2/argon2.module';
import { UserModule } from './feature/user/user.module';
import { AuthModule } from './feature/auth/auth.module';
import { TodoModule } from './feature/todo/todo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST'),
        port: config.get('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    Argon2Module,
    UserModule,
    AuthModule,
    TodoModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_PIPE',
      useValue: new ValidationPipe({ whitelist: true }),
    },
  ],
})
export class AppModule { }
