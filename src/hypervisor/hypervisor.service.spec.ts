import { Test, TestingModule } from '@nestjs/testing';
import { HypervisorService } from './hypervisor.service';

describe('HypervisorService', () => {
  let service: HypervisorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HypervisorService],
    }).compile();

    service = module.get<HypervisorService>(HypervisorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
