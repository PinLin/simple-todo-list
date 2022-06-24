import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const mockAuthService = {
      generateToken: jest.fn(({ username }) => {
        return username == 'someone' ? 'token' : 'error';
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should generate a access token', async () => {
    const req = { user: { username: 'someone' } } as any;

    const result = controller.login(req);
    expect(result['accessToken']).toBe('token');
  });
});
