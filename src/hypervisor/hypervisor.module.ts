import { Module } from '@nestjs/common'
import { GqlScraperAuthGuard } from 'src/gql-scrapper-token.guard'
import { PrismaModule } from 'src/prisma/prisma.module'
import { HypervisorResolver } from './hypervisor.resolver'
import { HypervisorService } from './hypervisor.service';

@Module({
  imports: [PrismaModule],
  providers: [HypervisorResolver, GqlScraperAuthGuard, HypervisorService],
})
export class HypervisorModule {}
