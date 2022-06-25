import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserExistedException } from './exceptions/user-existed.exception';
import { WrongPasswordException } from './exceptions/wrong-password.exception';

describe('UserController', () => {
  let controller: UserController;

  const mockUserService = {
    create: jest.fn(dto => dto.username != 'someone' ? { ...dto, id: 2 } : null),
    changePassword: jest.fn((_, oldPassword) => oldPassword == 'correct'),
    delete: jest.fn(_ => { }),
  };

  beforeEach(async () => {
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
    const req = { user: { id: 1, username: 'someone' } } as any;

    const user = await controller.getUser(req);
    expect(user.username).toBe(req.user.username);
  });

  it('should change the password of the specific user', async () => {
    const req = { user: { id: 1, username: 'someone' } } as any;
    const dto = { oldPassword: 'correct', newPassword: 'changed' };

    expect(controller.changePassword(req, dto)).resolves.not.toThrow();
  });

  it('should throw an error when changing password with a wrong password', async () => {
    const req = { user: { id: 1, username: 'someone' } } as any;
    const dto = { oldPassword: 'wrong', newPassword: 'changed' };

    expect(controller.changePassword(req, dto)).rejects.toThrow(WrongPasswordException);
  });

  it('should delete a specific user', async () => {
    const req = { user: { id: 1, username: 'someone' } } as any;

    expect(controller.deleteUser(req)).resolves.not.toThrow();
  });
});
