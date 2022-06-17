import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UserService } from '../user/user.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { NoPermissionToEditTodoException } from './exceptions/no-permission-to-edit-todo.exception';
import { TodoNotExistedException } from './exceptions/todo-not-existed.exception';
import { TodoService } from './todo.service';

@Controller('todo')
export class TodoController {
    constructor(
        private readonly todoService: TodoService,
        private readonly userService: UserService,
    ) { }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async createTodo(@Body() payload: CreateTodoDto, @Req() req: Request) {
        const { username } = req.user;
        const user = await this.userService.findOne(username);
        const todo = await this.todoService.create(payload, user.id);
        delete todo.owner;
        return todo;
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async findAllTodosByOwner(@Req() req: Request) {
        const { username } = req.user;
        const user = await this.userService.findOne(username);
        const todos = await this.todoService.findAllByOwner(user.id);
        return todos;
    }

    @Patch(':id')
    @UseGuards(AuthGuard('jwt'))
    async updateTodo(@Param('id') id: string, @Body() payload: UpdateTodoDto, @Req() req: Request) {
        const todo = await this.todoService.findOne(id, { withOwner: true });
        if (!todo) {
            throw new TodoNotExistedException();
        }

        const { username } = req.user;
        const user = await this.userService.findOne(username);
        if (todo?.owner.id !== user.id) {
            throw new NoPermissionToEditTodoException();
        }

        const updatedTodo = await this.todoService.update(id, payload);
        delete updatedTodo.owner;
        return updatedTodo;
    }
}
