import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../entities/user.entity';
import { Argon2Service } from '../../utils/argon2/argon2.service';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly argon2: Argon2Service,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(username: string, password: string) {
        const user = await this.userService.findOne(username);
        if (user && await this.argon2.verify(user.password, password)) {
            return user;
        }
        return null;
    }

    generateToken(user: User) {
        const { username } = user;
        return this.jwtService.sign({ username });
    }
}
