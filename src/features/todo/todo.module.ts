import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Todo } from '../../entities/todo.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Todo]),
    UserModule,
  ],
  providers: [TodoService],
  controllers: [TodoController]
})
export class TodoModule {}
