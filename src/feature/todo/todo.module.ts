import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entity/user.entity';
import { Todo } from '../../entity/todo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Todo]),
  ],
  providers: [TodoService],
  controllers: [TodoController]
})
export class TodoModule {}
