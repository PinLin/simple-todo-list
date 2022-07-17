import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../../../entity/user.entity';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly config: ConfigService,
        private readonly userService: UserService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get('JWT_SECRET'),
        });
    }

    validate(user: User) {
        return this.userService.findOne(user.username);
    }
}
