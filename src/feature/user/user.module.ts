import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Argon2Module } from '../../utility/argon2/argon2.module';
import { User } from '../../entity/user.entity';
import { Todo } from '../../entity/todo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Todo]),
    Argon2Module,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
