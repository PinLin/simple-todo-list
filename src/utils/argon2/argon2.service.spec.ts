import { Test, TestingModule } from '@nestjs/testing';
import { Argon2Service } from './argon2.service';

describe('Argon2Service', () => {
  let service: Argon2Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Argon2Service],
    }).compile();

    service = module.get<Argon2Service>(Argon2Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return true after verified a correct password', async () => {
    const password = 'ud4cFZG5f9kwoSmhsD';
    const hash = '$argon2i$v=19$m=4096,t=3,p=1$bndzd0wzNWJSRlNtdDZWcVVi$YqgEUEUczVg+/orR+sLvx3HPpraVdXYRyzbYE/BpNlU';

    const matched = await service.verify(hash, password);
    expect(matched).toBeTruthy();
  });

  it('should return false after verified a wrong password', async () => {
    const password = 'xxxxxxxxxxxxxxxxxx';
    const hash = '$argon2i$v=19$m=4096,t=3,p=1$bndzd0wzNWJSRlNtdDZWcVVi$YqgEUEUczVg+/orR+sLvx3HPpraVdXYRyzbYE/BpNlU';

    const matched = await service.verify(hash, password);
    expect(matched).toBeFalsy();
  });

  it('should generate a correct hash', async () => {
    const password = 'ud4cFZG5f9kwoSmhsD';
    const salt = 'nwswL35bRFSmt6VqUb';
    const hash = '$argon2i$v=19$m=4096,t=3,p=1$bndzd0wzNWJSRlNtdDZWcVVi$YqgEUEUczVg+/orR+sLvx3HPpraVdXYRyzbYE/BpNlU';

    const result = await service.hash(password, salt);
    expect(result).toBe(hash);
  });
});
