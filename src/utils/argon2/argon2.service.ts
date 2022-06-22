import * as argon2 from 'argon2';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Argon2Service {
    verify(hash: string, password: string) {
        return argon2.verify(hash, password);
    }

    hash(password: string, salt?: string) {
        return argon2.hash(password, {
            salt: salt ? Buffer.from(salt) : undefined,
            type: argon2.argon2i,
            version: 19,
            memoryCost: 4096,
            timeCost: 3,
            parallelism: 1,
            raw: false,
        });
    }
}
