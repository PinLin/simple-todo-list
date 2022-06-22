import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { Todo } from '../../entities/todo.entity';

@Injectable()
export class TodoService {
    constructor(
        @InjectRepository(Todo)
        private readonly todoRepository: Repository<Todo>,
    ) { }

    create(payload: CreateTodoDto, ownerId: number) {
        const todo = this.todoRepository.create({
            ...payload,
            owner: { id: ownerId },
            completed: false,
        });
        return this.todoRepository.save(todo);
    }
}
