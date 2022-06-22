import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Todo } from '../../entities/todo.entity';
import { TodoService } from './todo.service';
import { Repository } from 'typeorm';

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          autoLoadEntities: true,
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Todo, User]),
      ],
      providers: [TodoService],
    }).compile();

    service = module.get<TodoService>(TodoService);

    const userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    await userRepository.save(userRepository.create({
      username: 'someone',
      password: 'dontcare',
    }));

    const todoRepository = module.get<Repository<Todo>>(getRepositoryToken(Todo));
    await todoRepository.save(todoRepository.create({
      title: 'test',
      description: 'test',
      completed: false,
      id: '642d6dc0-6300-4077-8d01-15c9c79ede6b',
      owner: { id: 1 },
    }));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a todo', async () => {
    const dto = { title: 'test', description: 'test' };
    const ownerId = 1;

    const todo = await service.create(dto, ownerId);
    expect(todo.title).toBe(dto.title);
    expect(todo.description).toBe(dto.description);
    expect(todo.completed).toBeFalsy();
    expect(todo.owner.id).toBe(ownerId);
  });
});
