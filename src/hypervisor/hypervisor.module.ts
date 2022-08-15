import { Module } from '@nestjs/common';
import { HypervisorResolver } from './hypervisor.resolver';

@Module({
  providers: [HypervisorResolver],
})
export class HypervisorModule {}
