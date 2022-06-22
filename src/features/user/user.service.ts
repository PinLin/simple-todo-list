import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Argon2Service } from '../../utils/argon2/argon2.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../../entities/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly argon2: Argon2Service,
    ) { }

    async create(payload: CreateUserDto) {
        const { username } = payload;
        const user = await this.userRepository.findOneBy({ username });
        if (user) return null;

        const newUser = this.userRepository.create({
            ...payload,
            password: await this.argon2.hash(payload.password),
        });
        return this.userRepository.save(newUser);
    }
}