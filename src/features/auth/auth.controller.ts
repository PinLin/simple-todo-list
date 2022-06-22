import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Post()
    @UseGuards(AuthGuard('local'))
    login(@Req() req: Request) {
        return { accessToken: this.authService.generateToken(req.user) };
    }
}
