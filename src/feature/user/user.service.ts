import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Argon2Service } from '../../utility/argon2/argon2.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../../entity/user.entity';

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

    findOne(username: string) {
        return this.userRepository.findOneBy({ username });
    }

    async changePassword(username: string, oldPassword: string, newPassword: string) {
        const user = await this.userRepository.findOneBy({ username });
        if (!user) return false;

        if (!(await this.argon2.verify(user.password, oldPassword))) return false;

        user.password = await this.argon2.hash(newPassword);
        await this.userRepository.save(user);
        return true;
    }

    async delete(username: string) {
        const user = await this.userRepository.findOneBy({ username });
        return this.userRepository.remove(user);
    }
}
