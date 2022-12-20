import { Logger, NotFoundException, UseGuards } from '@nestjs/common'
import {
  Args,
  Context,
  Mutation,
  Resolver,
  Subscription,
} from '@nestjs/graphql'
import { Scraper, User } from '@prisma/client'
import { randomUUID } from 'crypto'
import { PubSub } from 'mercurius'
import { DateTime } from 'luxon'
import {
  ScraperGuard,
  Scraper as ScraperDecorator,
} from 'src/gql-scraper-token.guard'
import { BearerGuard } from 'src/oauth2/guards/gql/bearer.guard'
import { CurrentUser } from 'src/users/decorators/gql.decorator'
import { HypervisorService } from './hypervisor.service'
import { ScrapTask } from '@auto/graphql'
import { PrismaService } from 'src/prisma/prisma.service'

const predefTasks: ScrapTask[] = [
  {
    // zero filled uuid
    id: '0',
    name: 'Default task',
    since: DateTime.now().startOf('day'),
    until: DateTime.now().plus({ day: 10 }).endOf('day'),
  },
]

@Resolver()
export class HypervisorResolver {
  private readonly logger = new Logger(HypervisorResolver.name)

  public constructor(
    private readonly hypervisor: HypervisorService,
    private readonly prisma: PrismaService,
  ) {}

  @Mutation()
  @UseGuards(ScraperGuard)
  public async createChannel(@ScraperDecorator() scraper: Scraper) {
    const channel = await this.hypervisor.createChannel(scraper)

    return channel
  }

  @Mutation()
  @UseGuards(BearerGuard)
  public async createScraper(
    @CurrentUser() user: User,
    @Args('alias') alias?: string,
  ) {
    const scraper = await this.hypervisor.createScraper(user, alias)
    const [token] = scraper.tokens
    return token
  }

  @Subscription('subscribeTasks', {
    filter(this: HypervisorResolver, payload, variables, context) {
      return payload.channel.id === variables.channel
    },
  })
  public async subscribeTasks(@Context('pubsub') pubsub: PubSub) {
    return pubsub.subscribe('tasks')
  }

  @Mutation()
  @UseGuards(BearerGuard)
  public async publishTask(
    @Context('pubsub') pubsub: PubSub,
    @Args('id') id: number,
  ) {
    const task = predefTasks[id]
    if (!task) throw new NotFoundException()

    const channel = await this.prisma.scraperChannel.findFirst({
      where: {
        closedAt: null,
        scraper: {
          jobs: {
            none: {
              status: 'pending',
            },
          },
        },
      },
    })

    if (!channel) return null

    pubsub.publish({
      topic: 'tasks',
      payload: {
        subscribeTasks: task,
        channel,
      },
    })
    return task.name
  }
}
