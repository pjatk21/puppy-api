import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name)

  async onModuleInit() {
    await this.$connect()
    new Logger(PrismaClient.name, { timestamp: true }).verbose(
      'Connected to Prisma',
    )
  }

  async onModuleDestroy() {
    await this.$disconnect()
    this.logger.verbose('Disconnected from Prisma')
  }
}
