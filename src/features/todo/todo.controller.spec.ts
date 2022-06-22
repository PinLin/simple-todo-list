import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user/user.service';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

describe('TodoController', () => {
  let controller: TodoController;

  beforeEach(async () => {
    const mockTodoService = {
      create: jest.fn((dto, ownerId) => ({ ...dto, owner: { id: ownerId } })),
    };
    const mockUser = {
      id: 1,
      username: 'someone',
    };
    const mockUserService = {
      findOne: jest.fn(username => (username == 'someone@example.com' ? mockUser : null)),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        { provide: TodoService, useValue: mockTodoService },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    controller = module.get<TodoController>(TodoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a todo for the user', async () => {
    const dto = { title: 'test', description: 'test' };
    const req = { user: { username: 'someone' } };

    const todo = await controller.createTodo(dto, req);
    expect(todo.title).toBe(dto.title);
    expect(todo.description).toBe(dto.description);
  });
});