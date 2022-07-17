import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { Argon2Service } from '../../utility/argon2/argon2.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const mockUser = {
      id: 1,
      username: 'someone',
      password: 'correct',
    };
    const mockUserService = {
      create: jest.fn(dto => dto),
      findOne: jest.fn(username => {
        if (username == 'someone') return mockUser;
        else return null;
      }),
    };
    const mockArgon2Service = {
      verify: jest.fn((_, password) => (password == 'correct')),
    };
    const mockJwtService = {
      sign: jest.fn(({ username }) => !!username ? 'token' : 'error'),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: Argon2Service, useValue: mockArgon2Service },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a user object', async () => {
    const username = 'someone';
    const password = 'correct';

    const user = await service.validateUser(username, password);
    expect(user).not.toBeNull();
    expect(user.username).toBe(username);
  });

  it('should return null when username is wrong', async () => {
    const username = 'not_exist';
    const password = 'correct';

    const user = await service.validateUser(username, password);
    expect(user).toBeNull();
  });

  it('should return null when password is wrong', async () => {
    const username = 'someone';
    const password = 'wrong';

    const user = await service.validateUser(username, password);
    expect(user).toBeNull();
  });

  it('should generate a access token', async () => {
    const user = { username: 'someone' } as any;

    const token = service.generateToken(user);
    expect(token).toBe('token');
  });
});
