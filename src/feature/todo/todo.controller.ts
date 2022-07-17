import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { NoPermissionToEditTodoException } from './exception/no-permission-to-edit-todo.exception';
import { TodoNotExistedException } from './exception/todo-not-existed.exception';
import { TodoService } from './todo.service';

@Controller('todo')
export class TodoController {
    constructor(
        private readonly todoService: TodoService,
    ) { }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async createTodo(@Body() payload: CreateTodoDto, @Req() req: Request) {
        const todo = await this.todoService.create(payload, req.user.id);
        delete todo.owner;
        return todo;
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async findAllTodosByOwner(@Req() req: Request) {
        const todos = await this.todoService.findAllByOwner(req.user.id);
        return todos;
    }

    @Patch(':id')
    @UseGuards(AuthGuard('jwt'))
    async updateTodo(@Param('id') id: string, @Body() payload: UpdateTodoDto, @Req() req: Request) {
        const todo = await this.todoService.findOne(id, { withOwner: true });
        if (!todo) {
            throw new TodoNotExistedException();
        }

        if (todo?.owner.id !== req.user.id) {
            throw new NoPermissionToEditTodoException();
        }

        const updatedTodo = await this.todoService.update(id, payload);
        delete updatedTodo.owner;
        return updatedTodo;
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteTodo(@Param('id') id: string, @Req() req: Request) {
        const todo = await this.todoService.findOne(id, { withOwner: true });
        if (!todo) {
            throw new TodoNotExistedException();
        }

        if (todo?.owner.id !== req.user.id) {
            throw new NoPermissionToEditTodoException();
        }

        await this.todoService.delete(id);
    }
}
