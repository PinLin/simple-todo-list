import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiCreatedResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @ApiCreatedResponse({ description: "Log in successfully." })
    @ApiUnauthorizedResponse({ description: "Log in failed because of the wrong username or password."})
    @Post()
    @UseGuards(AuthGuard('local'))
    login(@Req() req: Request) {
        return { accessToken: this.authService.generateToken(req.user) };
    }
}
