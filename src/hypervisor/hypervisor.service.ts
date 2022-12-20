import { Injectable } from '@nestjs/common'
import { Scraper, User } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class HypervisorService {
  public constructor(private readonly prisma: PrismaService) {}

  public createScraper(user: User, alias?: string) {
    return this.prisma.scraper.create({
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

  public async createChannel(scraper: Scraper) {
    const closeDate = new Date()
    const [, { id }] = await this.prisma.$transaction([
      this.prisma.scraperChannel.updateMany({
        where: {
          id: scraper.id,
          closedAt: null,
        },
        data: {
          closedAt: closeDate,
        },
      }),
      this.prisma.scraperChannel.create({
        data: {
          scraperId: scraper.id,
        },
        select: {
          id: true,
        },
      }),
    ])
    return id
  }

  public async createJob(task: ScrapTask) {
    const job = await this.prisma.scrapJob.create({
      data: {
        args: { since: task.since.toIso(), until: task.until.toIso() },
      },
      select: {
        id: true,
      },
    })

    return job.id
  }

  public async dispatchJob(jobId: number) {
    const channel = await this.prisma.scraperChannel.findFirst({
      where: {
        closedAt: null,
        scraper: {
          jobs: {
            none: {
              status: {
                in: ['pending', 'queued'],
              },
            },
          },
        },
      },
      include: {
        scraper: true,
      },
    })
    if (!channel) return null

    const { scraper } = channel
    return
  }
}
