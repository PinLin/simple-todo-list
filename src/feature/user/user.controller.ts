import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ChangeUserPasswordDto } from './dto/change-user-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserExistedException } from './exception/user-existed.exception';
import { WrongPasswordException } from './exception/wrong-password.exception';
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
        const { id, password, ...otherUserData } = req.user;
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

    @Delete()
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteUser(@Req() req: Request) {
        const { username } = req.user;
        await this.userService.delete(username);
    }
}
