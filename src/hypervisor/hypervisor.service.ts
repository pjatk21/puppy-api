import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class HypervisorService {
  public constructor(private readonly prisma: PrismaService) {}

  public createScraper(user: User, alias?: string) {
    return this.prisma.scrapper.create({
      data: {
        alias,
        ownerId: user.id,
        tokens: {
          create: {},
        },
      },
      include: {
        tokens: true,
      },
    })
  }
}
