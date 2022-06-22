import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from '../../entities/user.entity';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Argon2Service } from '../../utils/argon2/argon2.service';
import { Repository } from 'typeorm';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const mockArgon2Service = {
      hash: jest.fn(_ => 'hashed'),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          autoLoadEntities: true,
          synchronize: true,
        }),
        TypeOrmModule.forFeature([User]),
      ],
      providers: [
        UserService,
        { provide: Argon2Service, useValue: mockArgon2Service },
      ],
    }).compile();

    service = module.get<UserService>(UserService);

    const userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    await userRepository.save(userRepository.create({
      username: 'someone',
      password: 'hashed',
    }));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const dto = { username: 'newone', password: 'dontcare' };

    const user = await service.create(dto);
    expect(user.username).toBe(dto.username);
    expect(user.password).toBe('hashed');
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
    expect(user.password).toBe('hashed');
  });

  it('should return null when finding a existed user', async () => {
    const username = 'not_existed';

    const user = await service.findOne(username);
    expect(user).toBeNull();
  });
});
