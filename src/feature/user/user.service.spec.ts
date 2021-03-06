import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entity/user.entity';
import { Todo } from '../../entity/todo.entity';
import { Argon2Service } from '../../utility/argon2/argon2.service';
import { Repository } from 'typeorm';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const mockArgon2Service = {
      hash: jest.fn(password => 'hashed_' + password),
      verify: jest.fn((hash, password) => hash == 'hashed_' + password),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          autoLoadEntities: true,
          synchronize: true,
        }),
        TypeOrmModule.forFeature([User, Todo]),
      ],
      providers: [
        UserService,
        { provide: Argon2Service, useValue: mockArgon2Service },
      ],
    }).compile();

    service = module.get<UserService>(UserService);

    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    await userRepository.save(userRepository.create({
      username: 'someone',
      password: 'hashed_correct',
    }));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const dto = { username: 'newone', password: 'correct' };

    const user = await service.create(dto);
    expect(user.username).toBe(dto.username);
    expect(user.password).toBe('hashed_correct');
  });

  it('should return null when creating a existed user', async () => {
    const dto = { username: 'someone', password: 'dontcare' };

    const user = await service.create(dto);
    expect(user).toBeNull();
  });

  it('should find the user by username', async () => {
    const username = 'someone';

    const user = await service.findOne(username);
    expect(user.username).toBe(username);
    expect(user.password).toBe('hashed_correct');
  });

  it('should return null when finding a existed user', async () => {
    const username = 'not_existed';

    const user = await service.findOne(username);
    expect(user).toBeNull();
  });

  it('should change the password of the specific user', async () => {
    const username = 'someone';
    const oldPassword = 'correct';
    const newPassword = 'changed';

    const result = await service.changePassword(username, oldPassword, newPassword);
    expect(result).toBeTruthy();
    const user = await userRepository.findOneBy({ username });
    expect(user.password).toBe('hashed_changed');
  })

  it('should delete the specific user', async () => {
    const username = 'someone';

    const result = await service.delete(username);
    expect(result).toBeTruthy();
  });
});
