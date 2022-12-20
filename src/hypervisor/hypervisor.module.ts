import { Module } from '@nestjs/common'
import { ScraperGuard } from 'src/gql-scraper-token.guard'
import { PrismaModule } from 'src/prisma/prisma.module'
import { HypervisorResolver } from './hypervisor.resolver'
import { HypervisorService } from './hypervisor.service';

@Module({
  imports: [PrismaModule],
  providers: [HypervisorResolver, ScraperGuard, HypervisorService],
})
export class HypervisorModule {}
