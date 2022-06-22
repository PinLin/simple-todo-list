import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user/user.service';
import { NoPermissionToEditTodoException } from './exceptions/no-permission-to-edit-todo.exception';
import { TodoNotExistedException } from './exceptions/todo-not-existed.exception';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

describe('TodoController', () => {
  let controller: TodoController;

  beforeEach(async () => {
    const mockTodo = {
      title: 'test',
      description: 'test',
      completed: false,
      id: '642d6dc0-6300-4077-8d01-15c9c79ede6b',
    };
    const mockTodoWithOwner = {
      ...mockTodo,
      owner: { id: 1 },
    };
    const mockTodoService = {
      create: jest.fn((dto, ownerId) => ({ ...dto, owner: { id: ownerId } })),
      findAllByOwner: jest.fn(_ => [mockTodo]),
      findOne: jest.fn((id, { withOwner }) => {
        if (id === '642d6dc0-6300-4077-8d01-15c9c79ede6b') {
          return withOwner ? mockTodoWithOwner : mockTodo;
        } else {
          return null;
        }
      }),
      update: jest.fn((id, dto) => ({ ...dto, id })),
      delete: jest.fn(_ => { }),
    };
    const mockUser1 = {
      id: 1,
      username: 'someone',
    };
    const mockUser2 = {
      id: 2,
      username: 'sometwo',
    };
    const mockUserService = {
      findOne: jest.fn(username => {
        if (username == 'someone') {
          return mockUser1;
        }
        if (username == 'sometwo') {
          return mockUser2;
        }
        return null;
      }),
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


  it('should show all todos of a specific user', async () => {
    const req = { user: { username: 'someone' } };

    const todos = await controller.findAllTodosByOwner(req);
    expect(todos).toHaveLength(1);
  });

  it('should update the specific todo', async () => {
    const todoId = '642d6dc0-6300-4077-8d01-15c9c79ede6b';
    const dto = { title: 'wow', description: 'wow', completed: true };
    const req = { user: { username: 'someone' } };

    const todo = await controller.updateTodo(todoId, dto, req);
    expect(todo.title).toBe(dto.title);
    expect(todo.description).toBe(dto.description);
    expect(todo.completed).toBe(dto.completed);
  });

  it('should throw an error when updating a todo that belongs to others', async () => {
    const todoId = '642d6dc0-6300-4077-8d01-15c9c79ede6b';
    const dto = { title: 'wow', description: 'wow', completed: true };
    const req = { user: { username: 'sometwo' } };

    expect(controller.updateTodo(todoId, dto, req)).rejects.toThrow(NoPermissionToEditTodoException);
  });

  it('should throw an error when updating a non-existed todo', async () => {
    const todoId = 'not-existed';
    const dto = { title: 'wow', description: 'wow', completed: true };
    const req = { user: { username: 'sometwo' } };

    expect(controller.updateTodo(todoId, dto, req)).rejects.toThrow(TodoNotExistedException);
  });

  it('should delete the specific todo', async () => {
    const todoId = '642d6dc0-6300-4077-8d01-15c9c79ede6b';
    const req = { user: { username: 'someone' } };

    expect(controller.deleteTodo(todoId, req)).resolves.not.toThrow();
  });

  it('should throw an error when deleting a todo that belongs to others', async () => {
    const todoId = '642d6dc0-6300-4077-8d01-15c9c79ede6b';
    const req = { user: { username: 'sometwo' } };

    expect(controller.deleteTodo(todoId, req)).rejects.toThrow(NoPermissionToEditTodoException);
  });

  it('should throw an error when deleting a non-existed todo', async () => {
    const todoId = 'not-existed';
    const req = { user: { username: 'sometwo' } };

    expect(controller.deleteTodo(todoId, req)).rejects.toThrow(TodoNotExistedException);
  });
});
