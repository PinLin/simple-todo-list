import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UserService } from '../user/user.service';
import { CreateTodoDto } from './dto/create-todo.dto';
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
}
