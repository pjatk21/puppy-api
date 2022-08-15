import { Test, TestingModule } from '@nestjs/testing';
import { HypervisorResolver } from './hypervisor.resolver';

describe('HypervisorResolver', () => {
  let resolver: HypervisorResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HypervisorResolver],
    }).compile();

    resolver = module.get<HypervisorResolver>(HypervisorResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
