import { ForbiddenException } from '@nestjs/common';

export class NoPermissionToEditTodoException extends ForbiddenException {
    constructor() {
        super('You cannot edit this todo.');
    }
}
