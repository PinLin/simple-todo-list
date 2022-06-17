import { NotFoundException } from '@nestjs/common';

export class TodoNotExistedException extends NotFoundException {
    constructor() {
        super('This todo is not existed.');
    }
}
