import { Body, Controller, Get, HttpCode, HttpStatus, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ChangeUserPasswordDto } from './dto/change-user-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserExistedException } from './exceptions/user-existed.exception';
import { UserNotExistedException } from './exceptions/user-not-existed.exception';
import { WrongPasswordException } from './exceptions/wrong-password.exception';
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

    @Put('password')
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(HttpStatus.NO_CONTENT)
    async changePassword(@Req() req: Request, @Body() payload: ChangeUserPasswordDto) {
        const { username } = req.user;
        const { oldPassword, newPassword } = payload;
        const result = await this.userService.changePassword(username, oldPassword, newPassword);
        if (!result) throw new WrongPasswordException();
    }
}
