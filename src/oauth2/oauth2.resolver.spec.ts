import { Test, TestingModule } from '@nestjs/testing';
import { Oauth2Resolver } from './oauth2.resolver';

describe('Oauth2Resolver', () => {
  let resolver: Oauth2Resolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Oauth2Resolver],
    }).compile();

    resolver = module.get<Oauth2Resolver>(Oauth2Resolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
