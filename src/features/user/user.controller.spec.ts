import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserExistedException } from './exceptions/user-existed.exception';
import { UserNotExistedException } from './exceptions/user-not-existed.exception';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const mockUser = {
      id: 1,
      username: 'someone',
      password: 'dontcare',
    }
    const mockUserService = {
      create: jest.fn(dto => dto.username != 'someone' ? { ...dto, id: 2 } : null),
      findOne: jest.fn(username => username == 'someone' ? mockUser : null),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockUserService },
      ]
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const dto = { username: 'newone', password: 'dontcare' };

    const user = await controller.createUser(dto);
    expect(user.username).toBe(dto.username);
  });

  it('should throw an error when creating a existed user', async () => {
    const dto = { username: 'someone', password: 'dontcare' };

    expect(controller.createUser(dto)).rejects.toThrow(UserExistedException);
  });

  it('should return a user object', async () => {
    const req = { user: { username: 'someone' } };

    const user = await controller.getUser(req as any);
    expect(user.username).toBe(req.user.username);
  });

  it('should throw an error when getting a non-existed user', async () => {
    const req = { user: { username: 'not_existed' } };

    expect(controller.getUser(req as any)).rejects.toThrow(UserNotExistedException);
  });
});
