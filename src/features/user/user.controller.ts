import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { ChangeUserPasswordDto } from './dto/change-user-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserExistedException } from './exceptions/user-existed.exception';
import { WrongPasswordException } from './exceptions/wrong-password.exception';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) { }

    @ApiCreatedResponse({ description: "Create user successfully." })
    @ApiConflictResponse({ description: "This user is already existed." })
    @Post()
    async createUser(@Body() payload: CreateUserDto) {
        const user = await this.userService.create(payload);
        if (!user) throw new UserExistedException();

        const { id, password, ...otherUserData } = user;
        return otherUserData;
    }

    @ApiOkResponse({ description: "Get user successfully." })
    @ApiNotFoundResponse({ description: "This user is not existed." })
    @Get()
    @UseGuards(AuthGuard('jwt'))
    async getUser(@Req() req: Request) {
        const { id, password, ...otherUserData } = req.user;
        return otherUserData;
    }

    @ApiOkResponse({ description: "Change password successfully." })
    @ApiNotFoundResponse({ description: "This user is not existed." })
    @ApiUnauthorizedResponse({ description: "Change password failed because of the wrong password." })
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
