import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { Todo } from '../../entity/todo.entity';
import { UpdateTodoDto } from './dto/update-todo.dto';

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

    findAllByOwner(ownerId: number) {
        return this.todoRepository.find({
            where: { owner: { id: ownerId } },
        });
    }

    findOne(id: string, options?: { withOwner: boolean }) {
        if (options?.withOwner) {
            return this.todoRepository.findOne({ where: { id }, relations: ['owner'] });
        } else {
            return this.todoRepository.findOne({ where: { id } });
        }
    }

    async update(id: string, payload: UpdateTodoDto) {
        const todo = await this.todoRepository.findOne({ where: { id } });
        Object.entries(payload).forEach(([key, value]) => {
            todo[key] = value;
        });
        return this.todoRepository.save(todo);
    }

    async delete(id: string) {
        const todo = await this.todoRepository.findOne({ where: { id } });
        return this.todoRepository.remove(todo);
    }
}
