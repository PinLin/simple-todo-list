import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { UserExistedException } from './exceptions/user-existed.exception';
import { UserNotExistedException } from './exceptions/user-not-existed.exception';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) { }

    @Post()
    async createUser(@Body() payload: CreateUserDto) {
        const user = await this.userService.create(payload);
        if (!user) throw new UserExistedException();

        const { id, password, ...otherUserData } = user;
        return otherUserData;
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async getUser(@Req() req: Request) {
        const { username } = req.user;
        const user = await this.userService.findOne(username);
        if (!user) throw new UserNotExistedException();

        const { id, password, ...otherUserData } = user;
        return otherUserData;
    }
}
